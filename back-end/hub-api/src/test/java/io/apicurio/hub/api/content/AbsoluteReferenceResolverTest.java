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

package io.apicurio.hub.api.content;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;

import org.apache.commons.io.IOUtils;
import org.junit.AfterClass;
import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import io.apicurio.datamodels.Library;
import io.apicurio.datamodels.asyncapi.models.AaiMessage;
import io.apicurio.datamodels.asyncapi.models.AaiParameter;
import io.apicurio.datamodels.asyncapi.v2.models.Aai20Document;
import io.apicurio.datamodels.asyncapi.v2.models.Aai20NodeFactory;
import io.apicurio.datamodels.core.models.DocumentType;
import io.apicurio.datamodels.core.models.Node;
import io.apicurio.datamodels.openapi.models.OasResponse;
import io.apicurio.datamodels.openapi.models.OasSchema;
import io.apicurio.datamodels.openapi.v2.models.Oas20Document;
import io.apicurio.datamodels.openapi.v2.models.Oas20Response;
import io.apicurio.datamodels.openapi.v2.models.Oas20Schema;
import io.apicurio.datamodels.openapi.v3.models.Oas30Document;
import io.apicurio.datamodels.openapi.v3.models.Oas30Response;
import io.apicurio.datamodels.openapi.v3.models.Oas30SchemaDefinition;
import io.apicurio.hub.core.content.AbsoluteReferenceResolver;

/**
 * @author eric.wittmann@gmail.com
 */
public class AbsoluteReferenceResolverTest {
    
    private static TestHttpServer testHttpServer;

    private static AbsoluteReferenceResolver resolver = new AbsoluteReferenceResolver();

    @BeforeClass
    public static void setup() throws IOException {
        testHttpServer = new TestHttpServer();
        testHttpServer.start();
    }
    
    @AfterClass
    public static void tearDown() {
        testHttpServer.stop();
    }

    /**
     * Test method for {@link io.apicurio.hub.core.content.AbsoluteReferenceResolver#resolveRef(java.lang.String, io.apicurio.datamodels.core.models.Node)}.
     */
    @Test
    public void testResolveRef_OpenAPI3() {
        Oas30Document doc = (Oas30Document) Library.createDocument(DocumentType.openapi3);
        doc.components = doc.createComponents();
        Oas30SchemaDefinition schema = doc.components.createSchemaDefinition("DT");

        schema.$ref = "#/components/DataType";
        Node actual = resolver.resolveRef(schema.$ref, schema);
        Assert.assertNull(actual);
        
        schema.$ref = "http://localhost:8111/oai30-three-data-type.json#/components/schemas/DataType1";
        actual = resolver.resolveRef(schema.$ref, schema);
        Assert.assertNotNull(actual);
        Assert.assertEquals("The first", ((OasSchema) actual).description);

        Oas30Response response = (Oas30Response) doc.createPaths().createPathItem("/").createOperation("GET").createResponses().createResponse("404");
        response.$ref = "http://localhost:8111/oai30-responses.json#/components/responses/NotFound";
        actual = resolver.resolveRef(response.$ref, response);
        Assert.assertNotNull(actual);
        Assert.assertEquals("Standard 404 response.", ((OasResponse) actual).description);
    }

    /**
     * Test method for {@link io.apicurio.hub.core.content.AbsoluteReferenceResolver#resolveRef(java.lang.String, io.apicurio.datamodels.core.models.Node)}.
     */
    @Test
    public void testResolveRef_OpenAPI2() {
        Oas20Document doc = (Oas20Document) Library.createDocument(DocumentType.openapi2);
        Oas20Schema schema = doc.createDefinitions().createSchemaDefinition("DT");

        schema.$ref = "#/definitions/DataType";
        Node actual = resolver.resolveRef(schema.$ref, schema);
        Assert.assertNull(actual);
        
        schema.$ref = "http://localhost:8111/oai20-all.json#/definitions/Widget";
        actual = resolver.resolveRef(schema.$ref, schema);
        Assert.assertNotNull(actual);
        Assert.assertEquals("A very simple, generic data type.", ((OasSchema) actual).description);

        Oas20Response response = (Oas20Response) doc.createPaths().createPathItem("/").createOperation("GET").createResponses().createResponse("404");
        response.$ref = "http://localhost:8111/oai20-all.json#/responses/NotFound";
        actual = resolver.resolveRef(response.$ref, response);
        Assert.assertNotNull(actual);
        Assert.assertEquals("Standard 404 response.", ((OasResponse) actual).description);
    }

    /**
     * Test method for {@link io.apicurio.hub.core.content.AbsoluteReferenceResolver#resolveRef(java.lang.String, io.apicurio.datamodels.core.models.Node)}.
     */
    @Test
    public void testResolveRef_AsyncAPI2() {
        Aai20NodeFactory factory = new Aai20NodeFactory();
        Aai20Document doc = (Aai20Document) Library.createDocument(DocumentType.asyncapi2);
        
        AaiMessage message = factory.createMessage(doc.createComponents(), "foo");
        message.$ref = "#/components/Message1";

        Node actual = resolver.resolveRef(message.$ref, message);
        Assert.assertNull(actual);
        
        message.$ref = "http://localhost:8111/aai20-streetlights.json#/components/messages/lightMeasured";
        actual = resolver.resolveRef(message.$ref, message);
        Assert.assertNotNull(actual);
        Assert.assertEquals("Inform about environmental lighting conditions of a particular streetlight.", ((AaiMessage) actual).summary);

        AaiParameter param = factory.createParameter(doc.createComponents(), "foo-param");
        param._ownerDocument = doc;
        param.$ref = "http://localhost:8111/aai20-streetlights.json#/components/parameters/streetlightId";
        actual = resolver.resolveRef(param.$ref, param);
        Assert.assertNotNull(actual);
        Assert.assertEquals("The ID of the streetlight.", ((AaiParameter) actual).description);
    }

    
    private static class TestHttpServer {
        
        private HttpServer server;
        
        public void start() throws IOException {
            server = HttpServer.create(new InetSocketAddress(8111), 0);
            server.createContext("/", new TestHttpServerHandler());
            server.setExecutor(null);
            server.start();
        }
        
        public void stop() {
            server.stop(0);
        }
        
    }
    
    private static class TestHttpServerHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange t) throws IOException {
            String path = t.getRequestURI().getPath().substring(1);
            InputStream testFile = getClass().getResourceAsStream(path);
            if (testFile == null) {
                throw new IOException("Resource not found: " + path);
            }
            
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            IOUtils.copy(testFile, baos);

            t.sendResponseHeaders(200, baos.size());
            
            ByteArrayInputStream bais = new ByteArrayInputStream(baos.toByteArray());
            OutputStream os = t.getResponseBody();
            IOUtils.copy(bais, os);
            os.close();
        }
    }

}
