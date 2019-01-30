package io.apicurio.test.integration.arquillian;

import io.apicurio.hub.api.beans.NewApiDesign;
import io.apicurio.hub.core.beans.ApiDesign;
import io.apicurio.hub.core.editing.sessionbeans.SelectionOperation;
import io.apicurio.hub.core.editing.sessionbeans.VersionedAck;
import io.apicurio.hub.core.editing.sessionbeans.VersionedCommandOperation;
import io.apicurio.test.integration.arquillian.testprocessors.TestOperationProcessor;
import io.restassured.RestAssured;
import io.restassured.http.Headers;
import io.restassured.parsing.Parser;
import io.restassured.specification.RequestSpecification;
import org.apache.commons.codec.digest.DigestUtils;
import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.container.test.api.TargetsContainer;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.jboss.shrinkwrap.resolver.api.maven.Maven;
import org.junit.AfterClass;
import org.junit.Test;
import org.junit.runner.RunWith;

import javax.ws.rs.core.UriBuilder;
import java.io.File;
import java.net.URI;
import java.util.Base64;
import java.util.Deque;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
@RunWith(Arquillian.class)
@RunAsClient
//@ArquillianSuiteDeployment
public class VerifyDistributedSetup {
    private static SessionInfo sessionInfo;
    private static ApicurioWebsocketsClient websocketClientNode1;
    private static final String APICURIO1_USER = "editor1";

    // Make RestAssured use Jackson
    static {
        RestAssured.defaultParser = Parser.JSON;
    }

    private static File[] resolveRestAssured() {
        return Maven.resolver().resolve("io.rest-assured:rest-assured:3.3.0").withTransitivity().asFile();
    }

    private static WebArchive getApiWar() {
        File resolvedApiWar = Maven.resolver()
                .resolve("io.apicurio:apicurio-studio-test-integration-api:war:0.2.20-SNAPSHOT")
                .withTransitivity()
                .asSingleFile();
        return ShrinkWrap.createFromZipFile(WebArchive.class, resolvedApiWar)
                .addClass(SessionInfo.class)
                .addAsLibraries(resolveRestAssured());
    }

    private static WebArchive getWsWar() {
        File resolvedApiWar = Maven.resolver()
                .resolve("io.apicurio:apicurio-studio-test-integration-ws:war:0.2.20-SNAPSHOT")
                .withTransitivity()
                .asSingleFile();
        return ShrinkWrap.createFromZipFile(WebArchive.class, resolvedApiWar)
                .addAsLibraries(resolveRestAssured());
    }

    // Ignore or disable any IDE errors about @Deployment only being allowed once per class.
    @Deployment(name = "apicurio1-api", order = 1, testable = false)
    @TargetsContainer("apicurio1") //@OverProtocol("jmx-as7")
    public static WebArchive createApicurio1Api() {
        return getApiWar();
    }

    @Deployment(name = "apicurio1-ws", order = 2, testable = false)
    @TargetsContainer("apicurio1") //@OverProtocol("jmx-as7")
    public static WebArchive createApicurio1Ws() {
        return getWsWar();
    }

    @RunAsClient
    @Test
    public void websockets_test() throws Exception {
        setup_sessions();
        node_1_edit();
        //node_2_join_and_read();
    }

    //@OperateOnDeployment("apicurio1-api")
    private void setup_sessions() throws Exception {
        NewApiDesign newApiDesign = new NewApiDesign();
        newApiDesign.setName("testdesign");
        newApiDesign.setSpecVersion("2.0");
        newApiDesign.setDescription("a description");

        // FIXME: Occasionally the WAR does not seem fully deployed by the time this is run?
        //Thread.sleep(30000);

        // This must simply succeed without failure
        ApiDesign apiDesign = given1()
            .contentType("application/json")
            .body(newApiDesign)
        .when()
            .post("/api-hub/designs")
        .thenReturn().as(ApiDesign.class);

        // Create editing session
        Headers editingSession = given1().expect().statusCode(200)
                .when()
                    .get("/api-hub/designs/" + apiDesign.getId() + "/session")
                .getHeaders();

        // Editing session information
        sessionInfo = new SessionInfo(editingSession);

        // Create websockets connection.
        websocketClientNode1 = new ApicurioWebsocketsClient(node1WsUri(apiDesign.getId(), sessionInfo, APICURIO1_USER));
    }
    private static final String SALT = "a3b81d8d8328abc9";

    TestOperationProcessor testOperationProcessor = TestOperationProcessor.INSTANCE;

//    @Test
//    @InSequence(2)
   // @OperateOnDeployment("apicurio1-ws")
    //@RunAsClient
    public void node_1_edit() throws InterruptedException {
        System.err.println(sessionInfo);
        System.err.println(websocketClientNode1.getURI());

        // Join a session (session ID in URL)
        websocketClientNode1.connectBlocking();
        // Send an editing event
        websocketClientNode1.send("{\"type\":\"selection\",\"selection\":\"/\"}");
        // Send a new path event
        websocketClientNode1.send("{\"type\":\"command\",\"commandId\":1,\"command\":{\"__type\":\"NewPathCommand_30\",\"_newPath\":\"/testpath\",\"_pathExisted\":false}}");
        // Modify a field
        websocketClientNode1.send("{\"type\":\"command\",\"commandId\":2,\"command\":{\"__type\":\"ChangeVersionCommand_30\",\"_newVersion\":\"1.0.0.1.1\",\"_oldVersion\":\"1.0.0.1\"}}");
        // Modify the field again
        websocketClientNode1.send("{\"type\":\"command\",\"commandId\":3,\"command\":{\"__type\":\"ChangeVersionCommand_30\",\"_newVersion\":\"2\",\"_oldVersion\":\"1.0.0.1.1\"}}");

        // Check our inbound messages; do they contain what we expect so far?
        Deque<String> inboundMessages = websocketClientNode1.getInboundMessages();

        // testOperationProcessor.compare(inboundMessages.pop(), <EXPECTED_OBJECT>);

        while (inboundMessages.size() < 5) {
            Thread.sleep(100);
            // TODO when you move to Java 9, try this out:
            //Thread.onSpinWait();
        }

        // First in is a select
        SelectionOperation expectSelect = SelectionOperation.select(APICURIO1_USER, "HFOkNs7NJqOqerVUQYRal0HDG_QyyhxGgbdF_TqA", "/");
        testOperationProcessor.assertEquals(expectSelect, inboundMessages.pop());

        // Ack for select
        VersionedAck expectedAck = VersionedAck.ack(16, 1);
        testOperationProcessor.assertEquals(expectedAck, inboundMessages.pop());

        // Command creating new path /testpath
        VersionedCommandOperation expectedCommand = VersionedCommandOperation.command(16,
                "{\"__type\":\"NewPathCommand_30\",\"_newPath\":\"/testpath\",\"_pathExisted\":false}");
        testOperationProcessor.assertEquals(expectedCommand, inboundMessages.pop());

        // Ack for new path command
        VersionedAck expectedAck2 = VersionedAck.ack(17, 2);
        testOperationProcessor.assertEquals(expectedAck2, inboundMessages.pop());

        // Command altering version
        VersionedCommandOperation expectedCommand2 = VersionedCommandOperation.command(17,
                "{\"__type\":\"ChangeVersionCommand_30\",\"_newVersion\":\"1.0.0.1.1\",\"_oldVersion\":\"1.0.0.1\"}");
        testOperationProcessor.assertEquals(expectedCommand2, inboundMessages.pop());

        // Ack for new path command
        VersionedAck expectedAck3 = VersionedAck.ack(18, 3);
        testOperationProcessor.assertEquals(expectedAck3, inboundMessages.pop());

        // Command altering version again
        VersionedCommandOperation expectedCommand3 = VersionedCommandOperation.command(18,
                "{\"__type\":\"ChangeVersionCommand_30\",\"_newVersion\":\"2\",\"_oldVersion\":\"1.0.0.1.1\"}");
        testOperationProcessor.assertEquals(expectedCommand3, inboundMessages.pop());

        System.err.println(websocketClientNode1.getConnection().getReadyState());
    }

    @AfterClass
    @RunAsClient
    public static void shut_down_websockets() throws InterruptedException {
        System.err.println("Teardown run on tests");
        websocketClientNode1.closeBlocking();
    }

    public static void main(String[] args) {
        System.err.println(DigestUtils.sha512Hex(SALT + APICURIO1_USER + "Basic ZWRpdG9yMTplZGl0b3I"));
    }

    private static URI node1WsUri(String designId, SessionInfo sessionInfo, String user) {

        // Figure out token based upon our test scheme (i.e. dumb BASIC)
        String basicValueUnencoded = APICURIO1_USER + ":" + APICURIO1_USER;
        String token = "Basic " + Base64.getEncoder().encodeToString(basicValueUnencoded.getBytes());

        // Figure out secret using same method as codebase under test
        //String secret = token.substring(0, Math.min(64, token.length() - 1));


        URI result = UriBuilder.fromUri("ws://localhost:8080/api-editing/designs/" + designId)
                .queryParam("uuid", sessionInfo.getEditingSessionUuid())
                .queryParam("user", user)
                .queryParam("secret", token.substring(0, token.length()-1))
                .build();

        System.err.println("--digest should be--");
        System.err.println(DigestUtils.sha512Hex(SALT + user + token));

        return result;
    }

    // Need to use preemptive otherwise expects challenge/response
    private static RequestSpecification given1() {
        return RestAssured.given().auth().preemptive().basic(APICURIO1_USER, APICURIO1_USER).port(8080);
    }

    // Need to use preemptive otherwise expects challenge/response
//    private static RequestSpecification given2() {
//        return RestAssured.given().auth().preemptive().basic("editor2", "editor1").port(8180);
//    }

}
