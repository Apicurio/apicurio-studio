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
package io.apicurio.test.integration.arquillian.helpers;

import io.apicurio.hub.api.beans.NewApiDesign;
import io.apicurio.hub.core.beans.ApiDesign;
import io.apicurio.hub.core.beans.Invitation;
import io.restassured.RestAssured;
import io.restassured.http.Headers;
import io.restassured.specification.RequestSpecification;

/**
 * REST helper methods
 *
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public class RestHelper {

    public static ApiDesign createApiDesign(String user, int port, NewApiDesign newApiDesign) {
        return given(user, port)
                .contentType("application/json")
                    .body(newApiDesign)
                .when()
                    .post("/api-hub/designs")
                .thenReturn().as(ApiDesign.class);
    }

    // Use HTTP API to create 2 editing sessions -- one for each WS client
    public static SessionInfo createEditingSession(RequestSpecification given, ApiDesign apiDesign) {
        // Create editing session
        Headers editingSession = given.expect().statusCode(200)
                .when()
                .get("/api-hub/designs/" + apiDesign.getId() + "/session")
                .getHeaders();
        // Editing session information
        return new SessionInfo(editingSession);
    }

    public static void shareDocument(int apiPort, String apicurio1User, String apicurio2User, ApiDesign apiDesign) {
        // Create an invite
        Invitation invite = given(apicurio1User, apiPort)
                .post("/api-hub/designs/" + apiDesign.getId() + "/invitations")
                .as(Invitation.class);

        System.err.println("Created an invite: " + invite.getInviteId());

        // Accept the invitation
        given(apicurio2User, apiPort)
                .put("/api-hub/designs/" + apiDesign.getId() + "/invitations/" + invite.getInviteId());

        System.err.println("Accepted the invite");
    }

    public static RequestSpecification given(String user, int port) {
        return RestAssured.given().auth().preemptive().basic(user, user).port(port);
    }

}
