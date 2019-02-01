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

import io.apicurio.hub.api.beans.NewApiDesign;
import io.apicurio.hub.core.beans.ApiDesign;
import io.apicurio.hub.core.editing.sessionbeans.FullCommandOperation;
import io.apicurio.hub.core.editing.sessionbeans.JoinLeaveOperation;
import io.apicurio.hub.core.editing.sessionbeans.SelectionOperation;
import io.apicurio.hub.core.editing.sessionbeans.VersionedAck;
import io.apicurio.hub.core.editing.sessionbeans.VersionedCommandOperation;
import io.apicurio.test.integration.arquillian.helpers.ApicurioWebsocketsClient;
import io.apicurio.test.integration.arquillian.helpers.RestHelper;
import io.apicurio.test.integration.arquillian.helpers.SessionInfo;
import io.apicurio.test.integration.arquillian.helpers.TestOperationHelper;
import io.apicurio.test.integration.arquillian.helpers.WsHelper;
import io.restassured.RestAssured;
import io.restassured.parsing.Parser;
import io.restassured.specification.RequestSpecification;
import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.container.test.api.OperateOnDeployment;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.container.test.api.TargetsContainer;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.jboss.shrinkwrap.resolver.api.maven.Maven;
import org.junit.AfterClass;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.io.File;
import java.util.Deque;

/**
 * Verify distributed Apicurio setup.
 *
 * Editor1 joins and makes a number of edits.
 *
 * Editor2 joins, and receives updates Editor1 made, plus join information, selection, etc.
 *
 * Ignore or disable any IDE errors about <tt>@Deployment</tt> only being allowed once per class.
 *
 * Uses the Maven resolver to get the latest asset. A gotcha is that your IDE might not rebuild the dependency.
 *
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
@RunWith(Arquillian.class)
@RunAsClient
public class VerifyDistributedSetupTestIT {
    private static final String USER_1 = "editor1";
    private static final String USER_2 = "editor2";
    private static final int NODE_1_PORT = 8080;
    private static final int NODE_2_PORT = 8180;

    private ApiDesign apiDesign;

    private SessionInfo node1SessionInfo;
    private SessionInfo node2SessionInfo;

    private ApicurioWebsocketsClient websocketClientNode1;
    private ApicurioWebsocketsClient websocketClientNode2;

    private TestOperationHelper testOperationProcessor = TestOperationHelper.INSTANCE;

    // Make RestAssured use Jackson
    static {
        RestAssured.defaultParser = Parser.JSON;
    }

    /**
     * Apicurio node 1 Hub API
     */
    @Deployment(name = "apicurio1-api", order = 1, testable = false)
    @TargetsContainer("apicurio1") //@OverProtocol("jmx-as7")
    public static WebArchive createApicurio1Api() {
        return getApiWar();
    }

    /**
     * Apicurio node 1 websockets editing node
     */
    @Deployment(name = "apicurio1-ws", order = 2, testable = false)
    @TargetsContainer("apicurio1") //@OverProtocol("jmx-as7")
    public static WebArchive createApicurio1Ws() {
        return getWsWar();
    }

    /**
     * Apicurio node 2 websockets editing node
     */
    @Deployment(name = "apicurio2-ws", order = 3, testable = false)
    @TargetsContainer("apicurio2") //@OverProtocol("jmx-as7")
    public static WebArchive createApicurio2Ws() {
        return getWsWar();
    }

    @RunAsClient
    @Test
    @OperateOnDeployment("apicurio2-ws")
    public void websockets_test() throws Exception {
        setup_document();
        node_1_websockets_join_and_edit();
        node_2_join_and_read();
        close_websockets_connections();
    }

    private void setup_document() throws Exception {
        NewApiDesign newApiDesign = new NewApiDesign();
        newApiDesign.setName("testdesign");
        newApiDesign.setSpecVersion("2.0");
        newApiDesign.setDescription("a description");

        // This must simply succeed without failure
        apiDesign = RestHelper.createApiDesign(USER_1, NODE_1_PORT, newApiDesign);

        // Create editing session for user 1 (WS not yet initialised)
        node1SessionInfo = RestHelper.createEditingSession(givenNode1(USER_1), apiDesign);

        // Share the document created by user 1 with user 2
        RestHelper.shareDocument(NODE_1_PORT, USER_1, USER_2, apiDesign);

        // Create editing session for user 2 WS not yet initialised)
        node2SessionInfo = RestHelper.createEditingSession(givenNode1(USER_2), apiDesign);
    }

    /**
     * Node 1 joins and sends some commands
     */
    public void node_1_websockets_join_and_edit() throws InterruptedException {
        // Create websockets connection to WS node 1.
        websocketClientNode1 = new ApicurioWebsocketsClient("WS Client 1",
                WsHelper.wsUri(USER_1, NODE_1_PORT, apiDesign.getId(), node1SessionInfo));

        System.err.println("Node 1 session info: " + node1SessionInfo);
        System.err.println("Node 1 WS URI: " + websocketClientNode1.getURI());

        // TODO use objects on send side.
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

        // Wait for our messages. TODO refactor to be more elegant
        while (inboundMessages.size() < 5) {
            System.err.println("Node 1 size " + inboundMessages.size());
            Thread.sleep(1000);
            // TODO when you move to Java 9, try this out:
            //Thread.onSpinWait();
        }

        // First in is a select
        SelectionOperation expectSelect = SelectionOperation.select(USER_1,
                "HFOkNs7NJqOqerVUQYRal0HDG_QyyhxGgbdF_TqA", "/");
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

    /**
     * Node 2 should receive all of the commands we executed on Node 1 since the previous snapshot.
     */
    private void node_2_join_and_read()  throws InterruptedException {
        // Create websockets connection to WS node 2.
        websocketClientNode2 = new ApicurioWebsocketsClient("WS Client 2",
                WsHelper.wsUri(USER_2, NODE_2_PORT, apiDesign.getId(), node2SessionInfo));

        websocketClientNode2.connectBlocking();

        // Check our inbound messages; do they contain what we expect so far?
        Deque<String> inboundMessages = websocketClientNode2.getInboundMessages();

        while (inboundMessages.size() < 3) {
            Thread.sleep(1000);
            System.err.println("Node 2 size " + inboundMessages.size());
            // TODO when you move to Java 9, try this out:
            //Thread.onSpinWait();
        }

        // Add path /testpath
        FullCommandOperation expectedCommand1 = FullCommandOperation.fullCommand(84L,
                "{\"__type\":\"NewPathCommand_30\",\"_newPath\":\"/testpath\",\"_pathExisted\":false}",
                USER_1,
                false);
        testOperationProcessor.assertEquals(expectedCommand1, inboundMessages.pop());

        // Change versions
        FullCommandOperation expectedCommand2 = FullCommandOperation.fullCommand(85L,
                "{\"__type\":\"ChangeVersionCommand_30\",\"_newVersion\":\"1.0.0.1.1\",\"_oldVersion\":\"1.0.0.1\"}",
                USER_1,
                false);
        testOperationProcessor.assertEquals(expectedCommand2, inboundMessages.pop());

        // Change versions again
        FullCommandOperation expectedCommand3 = FullCommandOperation.fullCommand(86L,
                "{\"__type\":\"ChangeVersionCommand_30\",\"_newVersion\":\"2\",\"_oldVersion\":\"1.0.0.1.1\"}",
                USER_1,
                false);
        testOperationProcessor.assertEquals(expectedCommand3, inboundMessages.pop());

        // Join message from editor1. Hello editor1!
        JoinLeaveOperation expectedJoin = JoinLeaveOperation.join(USER_1, "ASMLHuxCV1-LKVodpnSLuoBjXUu1X8_EDOC443sv");
        testOperationProcessor.assertEquals(expectedJoin, inboundMessages.pop());
    }

    public void close_websockets_connections() throws Exception {
        websocketClientNode2.closeBlocking();
        websocketClientNode1.closeBlocking();
    }

    @AfterClass
    @RunAsClient
    public static void shut_down_websockets() {
        System.err.println("Teardown run on tests");
    }
    // Need to use preemptive otherwise expects challenge/response
    private static RequestSpecification givenNode1(String user) {
        return RestHelper.given(user, NODE_1_PORT);
    }

    private static File[] resolveRestAssured() {
        return Maven.resolver().resolve("io.rest-assured:rest-assured:3.3.0").withTransitivity().asFile();
    }

    private static WebArchive getApiWar() {
        File resolvedApiWar = Maven.resolver()
                .resolve("io.apicurio:apicurio-studio-test-integration-api:war:0.2.21-SNAPSHOT")
                .withTransitivity()
                .asSingleFile();
        return ShrinkWrap.createFromZipFile(WebArchive.class, resolvedApiWar)
                .addClass(SessionInfo.class)
                .addAsLibraries(resolveRestAssured());
    }

    private static WebArchive getWsWar() {
        File resolvedApiWar = Maven.resolver()
                .resolve("io.apicurio:apicurio-studio-test-integration-ws:war:0.2.21-SNAPSHOT")
                .withTransitivity()
                .asSingleFile();
        return ShrinkWrap.createFromZipFile(WebArchive.class, resolvedApiWar)
                .addAsLibraries(resolveRestAssured());
    }

}
