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

package io.apicurio.hub.api.connectors;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.util.HashMap;
import java.util.Map;

import kong.unirest.GetRequest;
import kong.unirest.HttpRequest;
import kong.unirest.HttpResponse;
import kong.unirest.Unirest;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.json.JSONObject;
import org.junit.*;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import io.apicurio.hub.api.connectors.AbstractSourceConnector.Endpoint;

/**
 * @author eric.wittmann@gmail.com
 */
public class HttpClientTest {
    
    static int HTTP_PORT;
    static HttpServer server;
    static ObjectMapper mapper = new ObjectMapper();

    @BeforeClass
    public static final void setUp() throws Exception {
        String portEnv = System.getProperty("apicurio.test.httpclient.server.port");
        if (portEnv == null || portEnv.isEmpty()) {
            portEnv = "9432";
        }
        HTTP_PORT = Integer.valueOf(portEnv);
        System.out.println("[HttpClientTest] Starting test server on port " + HTTP_PORT);
        server = HttpServer.create(new InetSocketAddress(HTTP_PORT), 0);
        server.createContext("/echo", new EchoHandler());
        server.setExecutor(null);
        server.start();
    }

    @AfterClass
    public static final void tearDown() throws Exception {
        server.stop(0);
    }
    
    @Test
    public void testSimple_Apache() throws Exception {
        String url = new Endpoint("http://127.0.0.1:" + HTTP_PORT + "/echo").toString();
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpGet get = new HttpGet(url);
            get.addHeader("Accept", "application/json");
            try (CloseableHttpResponse response = httpClient.execute(get)) {
                Assert.assertEquals(200, response.getStatusLine().getStatusCode());
                try (InputStream contentStream = response.getEntity().getContent()) {
                    JsonNode node = mapper.readTree(contentStream);
                    if (node.isObject()) {
                        ObjectNode root = (ObjectNode) node;
                        String method = root.get("method").asText();
                        String uri = root.get("uri").asText();
                        Assert.assertEquals("GET", method);
                        Assert.assertEquals("/echo", uri);
                    }
                }
            }
        }
    }

    @Test
    public void testEncodedPath_Apache() throws Exception {
        String url = new Endpoint("http://127.0.0.1:" + HTTP_PORT + "/echo/encoded%2Fpath").toString();
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpGet get = new HttpGet(url);
            get.addHeader("Accept", "application/json");
            try (CloseableHttpResponse response = httpClient.execute(get)) {
                Assert.assertEquals(200, response.getStatusLine().getStatusCode());
                try (InputStream contentStream = response.getEntity().getContent()) {
                    JsonNode node = mapper.readTree(contentStream);
                    if (node.isObject()) {
                        ObjectNode root = (ObjectNode) node;
                        String method = root.get("method").asText();
                        String uri = root.get("uri").asText();
                        Assert.assertEquals("GET", method);
                        Assert.assertEquals("/echo/encoded%2Fpath", uri);
                    }
                }
            }
        }
    }

    @Test
    public void testSimple_Unirest() throws Exception {
        String url = new Endpoint("http://127.0.0.1:" + HTTP_PORT + "/echo").toString();
        HttpRequest request = Unirest.get(url);
        HttpResponse<kong.unirest.JsonNode> response = request.asJson();
        Assert.assertEquals(200, response.getStatus());
        
        kong.unirest.json.JSONObject responseObj = response.getBody().getObject();
        String method = responseObj.getString("method");
        String uri = responseObj.getString("uri");
        
        Assert.assertEquals("GET", method);
        Assert.assertEquals("/echo", uri);
    }

    @Test
    public void testEncodedPath_Unirest() throws Exception {
        String url = new Endpoint("http://127.0.0.1:" + HTTP_PORT + "/echo/encoded%2Fpath").toString();
        HttpRequest<GetRequest> request = Unirest.get(url);
        HttpResponse<kong.unirest.JsonNode> response = request.asJson();
        Assert.assertEquals(200, response.getStatus());
        
        kong.unirest.json.JSONObject responseObj = response.getBody().getObject();
        String method = responseObj.getString("method");
        String uri = responseObj.getString("uri");
        
        Assert.assertEquals("GET", method);
        // Note: Unirest used to mess with the encoded path, incorrectly changing it from "/echo/encoded%2Fpath"
        // to "/echo/encoded/path" prior to making the HTTP request.  This is why Unirest is not used in
        // the GitLab source connector.
        // This should not happen anymore
        Assert.assertEquals("/echo/encoded%2Fpath", uri);
    }

    static class EchoHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange t) throws IOException {
            Map<String, Object> response = new HashMap<>();
            response.put("method", t.getRequestMethod());
            response.put("uri", t.getRequestURI().toString());
            String responseBody = mapper.writeValueAsString(response);

            t.getResponseHeaders().add("Content-Type", "application/json");
            t.sendResponseHeaders(200, responseBody.length());
            OutputStream os = t.getResponseBody();
            os.write(responseBody.getBytes());
            os.close();
        }
    }

}
