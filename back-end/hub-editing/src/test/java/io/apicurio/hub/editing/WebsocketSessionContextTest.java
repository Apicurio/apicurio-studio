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

package io.apicurio.hub.editing;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.junit.Assert;
import org.junit.Test;

/**
 * @author eric.wittmann@gmail.com
 */
public class WebsocketSessionContextTest {

    /**
     * Test method for {@link io.apicurio.hub.editing.EditApiDesignEndpoint#parseQueryString(java.lang.String)}.
     */
    @Test
    public void testParseQueryString() throws Exception {
        Map<String, String> map = WebsocketSessionContext.parseQueryString("");
        Assert.assertEquals(Collections.EMPTY_MAP, map);
        
        map = WebsocketSessionContext.parseQueryString("foo=bar");
        Assert.assertEquals(toMap("foo", "bar"), map);
        
        map = WebsocketSessionContext.parseQueryString("foo=bar&hello=world&gosh=darn");
        Assert.assertEquals(toMap("foo", "bar", "hello", "world", "gosh", "darn"), map);
        
        String url = "http://www.example.org?foo=bar";
        map = WebsocketSessionContext.parseQueryString("foo=bar&url=" + URLEncoder.encode(url, StandardCharsets.UTF_8.name()));
        Assert.assertEquals(toMap("foo", "bar", "url", url), map);
    }
    
    private static Map<String, String> toMap(String ... values) {
        Map<String, String> rval = new HashMap<>();
        for (int i=0; i < values.length; i+=2) {
            String key = values[i];
            String val = values[i+1];
            rval.put(key, val);
        }
        return rval;
    }

}
