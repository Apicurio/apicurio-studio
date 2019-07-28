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

import java.io.File;
import java.util.Deque;

import io.apicurio.test.integration.common.IntegrationTestProperties;
import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.container.test.api.OperateOnDeployment;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.container.test.api.TargetsContainer;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.jboss.shrinkwrap.resolver.api.maven.Maven;
import org.junit.AfterClass;
import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;

import io.apicurio.hub.api.beans.NewApiDesign;
import io.apicurio.hub.core.beans.ApiDesign;
import io.apicurio.hub.core.editing.ops.BaseOperation;
import io.apicurio.hub.core.editing.ops.JoinLeaveOperation;
import io.apicurio.hub.core.editing.ops.OperationFactory;
import io.apicurio.hub.core.editing.ops.SelectionOperation;
import io.apicurio.hub.core.editing.ops.VersionedAck;
import io.apicurio.hub.core.editing.ops.VersionedCommandOperation;
import io.apicurio.hub.core.util.JsonUtil;
import io.apicurio.test.integration.arquillian.helpers.ApicurioWebsocketsClient;
import io.apicurio.test.integration.arquillian.helpers.ArtemisBroker;
import io.apicurio.test.integration.arquillian.helpers.HTwoDatabase;
import io.apicurio.test.integration.arquillian.helpers.RestHelper;
import io.apicurio.test.integration.arquillian.helpers.SessionInfo;
import io.apicurio.test.integration.arquillian.helpers.TestOperationHelper;
import io.apicurio.test.integration.arquillian.helpers.WsHelper;
import io.restassured.RestAssured;
import io.restassured.parsing.Parser;
import io.restassured.specification.RequestSpecification;

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
    
    private static final IntegrationTestProperties version = new IntegrationTestProperties();
    
    private static final String USER_1 = "editor1";
    private static final String USER_2 = "editor2";
    private static final int NODE_1_PORT = 8080;
    private static final int NODE_2_PORT = 8180;
    
    private static HTwoDatabase h2db;
    private static ArtemisBroker artemisBroker;

    private ApiDesign apiDesign;

    private SessionInfo node1SessionInfo;
    private SessionInfo node2SessionInfo;

    private ApicurioWebsocketsClient websocketClientNode1;
    private ApicurioWebsocketsClient websocketClientNode2;

    private TestOperationHelper testOperationProcessor = TestOperationHelper.INSTANCE;

    // Make RestAssured use Jackson
    static {
        RestAssured.defaultParser = Parser.JSON;
        System.out.println("**** VARIABLES ****");
        System.getenv().keySet().forEach( key -> {
            if (key.startsWith("APICURIO")) {
                String val = System.getenv(key);
                System.out.println("    " + key + " = " + val);
            }
        });
    }

    @BeforeClass
    public static void beforeClass() throws Exception {
        artemisBroker = new ArtemisBroker();
        artemisBroker.start();
        h2db = new HTwoDatabase();
        h2db.start();
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
        node_1_edits();
        node_2_edits();
        close_node2();
        close_node1();
        // Give the rollup executor a chance to work before we mercilessly shut everything down.
        Thread.sleep(3000);
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

        String selection1 = "/";
        String command1 = "{\"__type\":\"NewPathCommand_30\",\"_newPath\":\"/testpath\"}";
        String command2 = "{\"__type\":\"ChangeVersionCommand_30\",\"_newVersion\":\"1.0.0.1.1\"}";
        String command3 = "{\"__type\":\"ChangeVersionCommand_30\",\"_newVersion\":\"2\"}";

        // TODO use objects on send side.
        // Join a session (session ID in URL)
        websocketClientNode1.connectBlocking();
        // Send a selection event
        websocketClientNode1.send(OperationFactory.select(selection1));
        // Send a new path event
        websocketClientNode1.send(OperationFactory.fullCommand(101, command1));
        // Modify a field
        websocketClientNode1.send(OperationFactory.fullCommand(102, command2));
        // Modify the field again
        websocketClientNode1.send(OperationFactory.fullCommand(103, command3));

        // Check our inbound messages; do they contain what we expect so far?
        Deque<String> inboundMessages1 = websocketClientNode1.getInboundMessages();

        // Wait for our messages.
        waitOnInboundMessages("node_1_websockets_join_and_edit", inboundMessages1, 3);

        // Ack for new path
        VersionedAck expectedAck = OperationFactory.ack(16, 101, "command");
        testOperationProcessor.assertEquals(expectedAck, inboundMessages1.pop());
        // Ack for change version (1)
        VersionedAck expectedAck2 = OperationFactory.ack(17, 102, "command");
        testOperationProcessor.assertEquals(expectedAck2, inboundMessages1.pop());
        // Ack for change version (2)
        VersionedAck expectedAck3 = OperationFactory.ack(18, 103, "command");
        testOperationProcessor.assertEquals(expectedAck3, inboundMessages1.pop());
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
        Deque<String> inboundMessages2 = websocketClientNode2.getInboundMessages();
        waitOnInboundMessages("node_2_join_and_read (node2)", inboundMessages2, 4);
        
        // Add path /testpath
        VersionedCommandOperation expectedCommand1 = OperationFactory.fullCommand(84L,
                "{\"__type\":\"NewPathCommand_30\",\"_newPath\":\"/testpath\"}",
                USER_1,
                false);
        testOperationProcessor.assertEquals(expectedCommand1, inboundMessages2.pop());

        // Change versions
        VersionedCommandOperation expectedCommand2 = OperationFactory.fullCommand(85L,
                "{\"__type\":\"ChangeVersionCommand_30\",\"_newVersion\":\"1.0.0.1.1\"}",
                USER_1,
                false);
        testOperationProcessor.assertEquals(expectedCommand2, inboundMessages2.pop());

        // Change versions again
        VersionedCommandOperation expectedCommand3 = OperationFactory.fullCommand(86L,
                "{\"__type\":\"ChangeVersionCommand_30\",\"_newVersion\":\"2\"}",
                USER_1,
                false);
        testOperationProcessor.assertEquals(expectedCommand3, inboundMessages2.pop());

        // Join message from editor1. Hello editor1!
        JoinLeaveOperation expectedJoin = OperationFactory.join(USER_1, "ASMLHuxCV1-LKVodpnSLuoBjXUu1X8_EDOC443sv");
        testOperationProcessor.assertEquals(expectedJoin, inboundMessages2.pop());
        
        
        // Assert that node1 received the JOIN message when node2 joined
        Deque<String> inboundMessages1 = websocketClientNode1.getInboundMessages();
        waitOnInboundMessages("node_2_join_and_read (node1)", inboundMessages1, 1);
        
        expectedJoin = OperationFactory.join(USER_2, "ASMLHuxCV1-LKVodpnSLuoBjXUu1X8_EDOC443sv");
        testOperationProcessor.assertEquals(expectedJoin, inboundMessages1.pop());
    }

    /**
     * Node 1 will now make some more edits (and a selection).
     */
    private void node_1_edits() {
        String command1 = "{\"__type\":\"NewPathCommand_30\",\"_newPath\":\"/widgets\"}";
        String selection1 = "/info";
        String command2 = "{\"__type\":\"ChangeLicenseCommand_30\",\"_newLicenseName\":\"Apache 2.0\",\"_newLicenseUrl\":\"http://www.apache.org/licenses/LICENSE-2.0.html\"}";

        // Send a new path command
        websocketClientNode1.send(OperationFactory.fullCommand(104, command1));
        // Send a selection message
        websocketClientNode1.send(OperationFactory.select(selection1));
        // Send a setLicense command
        websocketClientNode1.send(OperationFactory.fullCommand(105, command2));
        
        // Check our inbound messages; do they contain what we expect so far?
        Deque<String> inboundMessages1 = websocketClientNode1.getInboundMessages();
        Deque<String> inboundMessages2 = websocketClientNode2.getInboundMessages();

        waitOnInboundMessages("node_1_edits (node1)", inboundMessages1, 2);
        waitOnInboundMessages("node_1_edits (node2)", inboundMessages2, 3);
        
        
        // Assert the Ack messages for node1 (should get one ACK for each command)
        ////////////////////////
        VersionedAck expectedAck = OperationFactory.ack(17, 104, "command");
        testOperationProcessor.assertEquals(expectedAck, inboundMessages1.pop());
        expectedAck = OperationFactory.ack(18, 105, "command");
        testOperationProcessor.assertEquals(expectedAck, inboundMessages1.pop());

        
        // Assert the selection and command messages came through on node2
        ////////////////////////
        VersionedCommandOperation expectedCommand = OperationFactory.fullCommand(-1L,
                command1, USER_1, false);
        testOperationProcessor.assertEquals(expectedCommand, inboundMessages2.pop());
        SelectionOperation expectedSelection = OperationFactory.select(USER_1, "HFOkNs7NJqOqerVUQYRal0HDG_QyyhxGgbdF_TqA", selection1);
        testOperationProcessor.assertEquals(expectedSelection, inboundMessages2.pop());
        expectedCommand = OperationFactory.fullCommand(-1L,
                command2, 
                USER_1, false);
        testOperationProcessor.assertEquals(expectedCommand, inboundMessages2.pop());

    }

    private void node_2_edits() {
        String selection1 = "/contact";
        String command1 = "{\"__type\":\"ChangeTitleCommand_30\",\"_newTitle\":\"New API Title 1.0\"}";
        String command2 = "{\"__type\":\"ChangeLicenseCommand_30\",\"_newLicenseName\":\"Apache 3.0\",\"_newLicenseUrl\":\"http://www.apache.org/licenses/LICENSE-3.0.html\"}";
        String command3 = "{\"__type\":\"ChangeTitleCommand_30\",\"_newTitle\":\"Other Title for API 1.0\"}";
        String selection2 = "/info";
        
        // Send a selection message
        websocketClientNode2.send(OperationFactory.select(selection1));
        // Send a change title command
        websocketClientNode2.send(OperationFactory.fullCommand(201, command1));
        // Send a setLicense command
        websocketClientNode2.send(OperationFactory.fullCommand(202, command2));
        
        // Wait for the ACKS
        Deque<String> inboundMessages2 = websocketClientNode2.getInboundMessages();
        waitOnInboundMessages("node_2_edits (node2) [ACKs 1]", inboundMessages2, 2);
        // Pop the two ACKs from the inbound message queue.
        String ackMsg = inboundMessages2.pop(); // Pop the change title ACK
        long contentVersionToUndo = JsonUtil.toJsonTree(ackMsg).get("contentVersion").asLong();
        inboundMessages2.pop(); // Pop the change license ACK.

        // Send an undo command
        websocketClientNode2.send(OperationFactory.undo(contentVersionToUndo));
        // Send a change title command
        websocketClientNode2.send(OperationFactory.fullCommand(201, command3));
        // Send a selection message
        websocketClientNode2.send(OperationFactory.select("/info"));
        
        // Wait for the ACKS (again)
        waitOnInboundMessages("node_2_edits (node2) [ACKs 2]", inboundMessages2, 2);
        // Pop the two ACKs from the inbound message queue.
        inboundMessages2.pop();
        inboundMessages2.pop();

        
        // Now assert that all the right messages made it to node1!
        Deque<String> inboundMessages1 = websocketClientNode1.getInboundMessages();
        waitOnInboundMessages("node_2_edits (node1)", inboundMessages1, 6);
        // Selection: /contact
        BaseOperation expectedOp = OperationFactory.select(USER_2, "XXX", selection1);
        testOperationProcessor.assertEquals(expectedOp, inboundMessages1.pop());
        // Command: change title
        expectedOp = OperationFactory.fullCommand(84L, command1, USER_2, false);
        testOperationProcessor.assertEquals(expectedOp, inboundMessages1.pop());
        // Command: change license
        expectedOp = OperationFactory.fullCommand(84L, command2, USER_2, false);
        testOperationProcessor.assertEquals(expectedOp, inboundMessages1.pop());
        // Undo
        expectedOp = OperationFactory.undo(contentVersionToUndo);
        testOperationProcessor.assertEquals(expectedOp, inboundMessages1.pop());
        // Command: change title
        expectedOp = OperationFactory.fullCommand(84L, command3, USER_2, false);
        testOperationProcessor.assertEquals(expectedOp, inboundMessages1.pop());
        // Selection: /info
        expectedOp = OperationFactory.select(USER_2, "XXX", selection2);
        testOperationProcessor.assertEquals(expectedOp, inboundMessages1.pop());
    }
    
    public void close_node2() throws Exception {
        websocketClientNode2.closeBlocking();

        // Make sure we got a "leave" message
        Deque<String> inboundMessages1 = websocketClientNode1.getInboundMessages();
        waitOnInboundMessages("close_node2", inboundMessages1, 1);
        // Leave
        BaseOperation expectedOp = OperationFactory.leave(USER_2, "XXX");
        testOperationProcessor.assertEquals(expectedOp, inboundMessages1.pop());
    }

    public void close_node1() throws Exception {
        websocketClientNode1.closeBlocking();
    }
    
    private void waitOnInboundMessages(String label, Deque<String> inboundMessages, 
            int expectedNumberOfMessages) {
        int maxTimeToWait = 5000;
        int totalWaitTime = 0;
        System.out.println("[" + label + "]  Waiting for inbound messages.");
        while (inboundMessages.size() < expectedNumberOfMessages && totalWaitTime < maxTimeToWait) {
            System.out.println("[" + label + "]  Inbound Messages size: " + inboundMessages.size());
            try { Thread.sleep(250); } catch (Exception e) {}
            totalWaitTime += 250;
        }
        if (expectedNumberOfMessages != inboundMessages.size()) {
            System.out.println("!!! ---------------------");
            inboundMessages.forEach( message -> {
                System.out.println("[" + label + "]  Message: " + message);
            });
            System.out.println("!!! ---------------------");
        }
        Assert.assertEquals("[" + label + "]  Received an unexpected number of inbound messages.", 
                expectedNumberOfMessages, inboundMessages.size());
        System.out.println("[" + label + "]  Found the expected number of messages (" + expectedNumberOfMessages + ")");
    }

    @AfterClass
    public static void afterClass() {
        if (h2db != null) {
            h2db.stop();
        }
        if (artemisBroker != null) {
            artemisBroker.stop();
        }
    }

    // Need to use preemptive otherwise expects challenge/response
    private static RequestSpecification givenNode1(String user) {
        return RestHelper.given(user, NODE_1_PORT);
    }

    private static WebArchive getApiWar() {
        File resolvedApiWar = Maven.resolver()
                .resolve("io.apicurio:apicurio-studio-test-integration-api:war:" + version.getVersion())
                .withTransitivity()
                .asSingleFile();
        return ShrinkWrap.createFromZipFile(WebArchive.class, resolvedApiWar)
                .addClass(SessionInfo.class);
    }

    private static WebArchive getWsWar() {
        File resolvedApiWar = Maven.resolver()
                .resolve("io.apicurio:apicurio-studio-test-integration-ws:war:" + version.getVersion())
                .withTransitivity()
                .asSingleFile();
        return ShrinkWrap.createFromZipFile(WebArchive.class, resolvedApiWar);
    }

}
