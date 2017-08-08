/*
 * Copyright 2017 JBoss Inc
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

package io.apicurio.hub.api.connectors;

import java.util.Map;

import org.junit.Assert;
import org.junit.Test;

/**
 * @author eric.wittmann@gmail.com
 */
public class AbstractSourceConnectorTest {

    /**
     * Test method for {@link io.apicurio.hub.api.connectors.AbstractSourceConnector#parseExternalTokenResponse(java.lang.String)}.
     */
    @Test
    public void testParseExternalTokenResponse() {
        Map<String, String> response = AbstractSourceConnector.parseExternalTokenResponse("access_token=12345&scope=repo%2Cuser%3Aemail&token_type=bearer");
        Assert.assertNotNull(response);
        Assert.assertEquals("12345", response.get("access_token"));
        Assert.assertEquals("repo,user:email", response.get("scope"));
        Assert.assertEquals("bearer", response.get("token_type"));
    }

}
