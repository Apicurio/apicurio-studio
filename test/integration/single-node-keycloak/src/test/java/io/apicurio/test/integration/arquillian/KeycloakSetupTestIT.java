/*
 * Copyright 2019 JBoss Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package io.apicurio.test.integration.arquillian;

import io.apicurio.test.integration.arquillian.helpers.Apicurio;
import io.apicurio.test.integration.common.IntegrationTestProperties;
import io.apicurio.test.integration.arquillian.helpers.Keycloak;
import io.apicurio.test.integration.arquillian.helpers.Selenide;
import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.container.test.api.OperateOnDeployment;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.jboss.shrinkwrap.resolver.api.maven.Maven;
import org.junit.Test;
import org.junit.runner.RunWith;

import javax.json.Json;
import javax.json.JsonObject;
import java.io.File;
import java.io.InputStream;

import static com.codeborne.selenide.Condition.text;
import static com.codeborne.selenide.Selenide.$;

/**
 * @author Jakub Senko <jsenko@redhat.com>
 */
@RunWith(Arquillian.class)
@RunAsClient
public class KeycloakSetupTestIT {

    private static final IntegrationTestProperties properties = new IntegrationTestProperties();

    public JsonObject getRealmFile() {
        Class<? extends KeycloakSetupTestIT> clazz = this.getClass();
        InputStream inputStream = clazz.getResourceAsStream(properties.get("it.keycloak.realm.file"));
        return Json.createReader(inputStream).readObject();
    }

    @Test
    @RunAsClient
    @OperateOnDeployment("apicurio-api")
    public void testLoginWithLocalKeycloak() throws Exception {
        Selenide.init();

        try (Keycloak kc = new Keycloak(properties.get("it.server.keycloak.url"))) {
            kc.init();
            kc.login();
            kc.importRealm(getRealmFile());

            Apicurio ac = new Apicurio(properties.get("it.server.apicurio.url"));
            ac.register();

            $("h2 strong").shouldHave(text("Apicurio")); // We've been redirected to the landing page
        }
    }

    @Deployment(name = "apicurio-api", order = 1, testable = false)
    public static WebArchive createApicurio1Api() {
        return getWar("io.apicurio:apicurio-studio-platforms-wildfly-api:war:" + properties.getVersion());
    }

    @Deployment(name = "apicurio-ws", order = 2, testable = false)
    public static WebArchive createApicurio1Ws() {
        return getWar("io.apicurio:apicurio-studio-platforms-wildfly-ws:war:" + properties.getVersion());
    }

    @Deployment(name = "apicurio-ui", order = 3, testable = false)
    public static WebArchive createApicurio1UI() {
        return getWar("io.apicurio:apicurio-studio-platforms-wildfly-ui:war:" + properties.getVersion());

    }

    private static WebArchive getWar(String gav) {
        File resolvedApiWar = Maven.resolver()
                .resolve(gav)
                .withTransitivity()
                .asSingleFile();
        return ShrinkWrap.createFromZipFile(WebArchive.class, resolvedApiWar);
    }
}
