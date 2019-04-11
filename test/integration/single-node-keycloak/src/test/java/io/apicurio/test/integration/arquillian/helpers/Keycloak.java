package io.apicurio.test.integration.arquillian.helpers;

import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonStructure;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.Invocation;
import javax.ws.rs.core.Form;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.StringReader;

import static com.codeborne.selenide.Selectors.byText;
import static com.codeborne.selenide.Selenide.$;
import static com.codeborne.selenide.Selenide.open;


public class Keycloak implements AutoCloseable {

    private static final IntegrationTestProperties properties = new IntegrationTestProperties();

    private String baseUrl;
    private String token;

    private ProcessExecutor pe;

    public Keycloak(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    public void init() throws Exception {
        pe = new ProcessExecutor();
        pe.start(properties.get("it.server.keycloak.cmd").split(" "),
                (s) -> s.endsWith("services are lazy, passive or on-demand)"));
        initAdminAccess();
    }

    private void initAdminAccess() {
        open(baseUrl + "/auth");
        if($("#username").exists()) {
            $("#username").setValue("admin");
            $("#password").setValue("admin");
            $("#passwordConfirmation").setValue("admin");
            $("#create-button").click();
            if(!$(byText("User created")).exists())
                throw new RuntimeException("Can't create initial admin account.");
        }
    }

    // TODO provide credentials separately
    public void login() {
        Client client = ClientBuilder.newClient();

        Form form = new Form();
        form.param("client_id", "admin-cli");
        form.param("username", "admin");
        form.param("password", "admin");
        form.param("grant_type", "password");
        Entity<Form> entity = Entity.form(form);

        Response response = client.target(baseUrl + "/auth/realms/master/protocol/openid-connect/token")
                .request(MediaType.APPLICATION_JSON_TYPE)
                .post(entity);
        JsonObject data = (JsonObject) asJson(response);
        this.token = data.getString("access_token");
    }

    public void importRealm(JsonObject realm) {
        int res = rest("realms").post(Entity.json(realm.toString())).getStatus(); // TODO check
    }

    public JsonArray getUsers() {
        Response response = rest("realms/master/users").get();
        JsonArray data = (JsonArray) asJson(response);
        return data;
    }

    private Invocation.Builder rest(String path) {
        if(token == null)
            throw new RuntimeException("Have to login first.");

        Client client = ClientBuilder.newClient(); // TODO cache this?
        return client.target(baseUrl + "/auth/admin").path(path)
                .request(MediaType.APPLICATION_JSON_TYPE)
                .header("Authorization", "bearer " + token);
    }

    private JsonStructure asJson(Response response) {
        String jsonString = response.readEntity(String.class);
        return Json.createReader(new StringReader(jsonString)).read();
    }

    @Override
    public void close() {
        if (pe != null) {
            pe.stop();
        }
    }
}
