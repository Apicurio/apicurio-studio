package io.apicurio.test.integration.arquillian.helpers;

import io.apicurio.hub.core.beans.ApiDesign;
import io.apicurio.hub.core.beans.Invitation;
import io.restassured.RestAssured;
import io.restassured.specification.RequestSpecification;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public class RestHelper {

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
