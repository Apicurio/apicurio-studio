/*
 * Copyright 2018 JBoss Inc
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

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.junit.Assert;
import org.junit.Test;

import io.apicurio.hub.api.connectors.AbstractSourceConnector.Endpoint;

/**
 * @author eric.wittmann@gmail.com
 */
public class EndpointTest {

    /**
     * Test method for {@link io.apicurio.hub.api.connectors.AbstractSourceConnector.Endpoint#toString()}.
     */
    @Test
    public void testSimple() {
        String url = new Endpoint("http://www.example.org/path/to/resource").toString();
        Assert.assertEquals("http://www.example.org/path/to/resource", url);
    }

    /**
     * Test method for {@link io.apicurio.hub.api.connectors.AbstractSourceConnector.Endpoint#toString()}.
     */
    @Test
    public void testPathParams() throws Exception {
        String url = new Endpoint("http://www.example.org/repos/:org")
                .bind("org", "ORG")
                .toString();
        Assert.assertEquals("http://www.example.org/repos/ORG", url);

        url = new Endpoint("http://www.example.org/repos/:org/:repo/contents/:path")
                .bind("org", "ORG")
                .bind("repo", "REPO")
                .bind("path", "PATH")
                .toString();
        Assert.assertEquals("http://www.example.org/repos/ORG/REPO/contents/PATH", url);

        url = new Endpoint("http://www.example.org/repos/:org/:repo/contents/:path")
                .bind("org", "ORG")
                .bind("repo", "REPO")
                .bind("path", URLEncoder.encode("/path/to/file.doc", StandardCharsets.UTF_8.name()))
                .toString();
        Assert.assertEquals("http://www.example.org/repos/ORG/REPO/contents/%2Fpath%2Fto%2Ffile.doc", url);
    }

    /**
     * Test method for {@link io.apicurio.hub.api.connectors.AbstractSourceConnector.Endpoint#toString()}.
     */
    @Test
    public void testQueryParams() {
        String url = new Endpoint("http://www.example.org/repos/:org/:repo/contents/:path")
                .bind("org", "ORG")
                .bind("repo", "REPO")
                .bind("path", "PATH")
                .queryParam("ref", "REF")
                .toString();
        Assert.assertEquals("http://www.example.org/repos/ORG/REPO/contents/PATH?ref=REF", url);
        
        url = new Endpoint("http://www.example.org/repos/:org/:repo/contents/:path")
                .bind("org", "ORG")
                .bind("repo", "REPO")
                .bind("path", "PATH")
                .queryParam("ref", "REF")
                .queryParam("foo", "FOO")
                .queryParam("bar", "BAR")
                .toString();
        Assert.assertEquals("http://www.example.org/repos/ORG/REPO/contents/PATH?ref=REF&foo=FOO&bar=BAR", url);
        
        url = new Endpoint("http://www.example.org/repos/:org/:repo/contents/:path")
                .bind("org", "ORG")
                .bind("repo", "REPO")
                .bind("path", "PATH")
                .queryParam("param1", "SOME VALUE")
                .queryParam("param2", "1/3")
                .queryParam("param3", "one+three")
                .toString();
        Assert.assertEquals("http://www.example.org/repos/ORG/REPO/contents/PATH?param1=SOME+VALUE&param2=1%2F3&param3=one%2Bthree", url);
    }

}
