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

import javax.ws.rs.core.UriBuilder;
import java.net.URI;
import java.util.Base64;

/**
 * Websocket helper methods
 *
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public class WsHelper {
    public static URI wsUri(String user, int port, String designId, SessionInfo sessionInfo) {
        // Figure out token based upon our test scheme (i.e. dumb BASIC)
        String basicValueUnencoded = user + ":" + user;
        String token = "Basic " + Base64.getEncoder().encodeToString(basicValueUnencoded.getBytes());

        // Figure out secret using same method as codebase under test
        URI result = UriBuilder.fromUri("ws://localhost:" + port + "/api-editing/designs/" + designId)
                .queryParam("uuid", sessionInfo.getEditingSessionUuid())
                .queryParam("user", user)
                .queryParam("secret", token.substring(0, token.length()-1))
                .build();
        System.err.println("Generated WS URI: " + result.toString());
        return result;
    }

}
