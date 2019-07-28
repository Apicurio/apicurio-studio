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

package io.apicurio.hub.api.codegen;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.nio.charset.Charset;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.junit.Assert;
import org.junit.Test;

import com.fasterxml.jackson.databind.ObjectMapper;

import io.apicurio.hub.api.codegen.OpenApi2JaxRs.JaxRsProjectSettings;
import io.apicurio.hub.api.codegen.beans.CodegenInfo;

/**
 * @author eric.wittmann@gmail.com
 */
public class OpenApi2ThorntailTest {
    
    /**
     * Test method for {@link io.apicurio.hub.api.codegen.OpenApi2Thorntail#generate()}.
     */
    @Test
    public void testGenerateOnly() throws IOException {
        doGenerateOnlyTest("OpenApi2ThorntailTest/beer-api.codegen.json", 
                "OpenApi2ThorntailTest/beer-api.json", "_expected/generated-api", 
                "org.example.api", "generated-api", "org.example.api", true);
    }

    /**
     * Test method for {@link io.apicurio.hub.api.codegen.OpenApi2Thorntail#generate()}.
     */
    @Test
    public void testGenerateOnly_GatewayApiNoTypes() throws IOException {
        doGenerateOnlyTest("OpenApi2ThorntailTest/gateway-api-notypes.codegen.json", 
                "OpenApi2ThorntailTest/gateway-api.json", "_expected-gatewayApiNoTypes/simple-api", 
                "io.openapi.simple", "simple-api", "io.openapi.simple", false);
    }

    /**
     * Test method for {@link io.apicurio.hub.api.codegen.OpenApi2Thorntail#generate()}.
     */
    @Test
    public void testGenerateFull() throws IOException {
        doFullTest("OpenApi2ThorntailTest/beer-api.json", false, "_expected-full/generated-api", false);
    }

    /**
     * Test method for {@link io.apicurio.hub.api.codegen.OpenApi2Thorntail#generate()}.
     */
    @Test
    public void testGenerateFull_GatewayApi() throws IOException {
        doFullTest("OpenApi2ThorntailTest/gateway-api.json", false, "_expected-gatewayApi-full/generated-api", false);
    }

    /**
     * Test method for {@link io.apicurio.hub.api.codegen.OpenApi2Thorntail#generate()}.
     */
    @Test
    public void testGenerateUpdateOnly() throws IOException {
        doFullTest("OpenApi2ThorntailTest/beer-api.json", true, "_expected-full/generated-api", false);
    }

    /**
     * Test method for {@link io.apicurio.hub.api.codegen.OpenApi2Thorntail#generate()}.
     */
    @Test
    public void testGenerateFull_RdaApi() throws IOException {
        doFullTest("OpenApi2ThorntailTest/rda-api.json", false, "_expected-rda", false);
    }
    
    /**
     * Shared test method.
     * @throws IOException
     */
    private void doGenerateOnlyTest(String codegenSpec, String apiDef, String expectedFilesPath, String groupId, 
            String artifactId, String _package, boolean debug) throws IOException {
        OpenApi2Thorntail generator = new OpenApi2Thorntail() {
            /**
             * @see io.apicurio.hub.api.codegen.OpenApi2JaxRs#getInfoFromApiDoc()
             */
            @Override
            protected CodegenInfo getInfoFromApiDoc() throws IOException {
                try {
                    ObjectMapper mapper = new ObjectMapper();
                    String data = IOUtils.toString(OpenApi2ThorntailTest.class.getClassLoader().getResource(codegenSpec), Charset.forName("UTF-8"));
                    return mapper.readerFor(CodegenInfo.class).readValue(data);
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
            @Override
            protected String getResourceName(String name) {
                return "_OpenApi2Thorntail/" + name;
            }
        };
        generator.setUpdateOnly(false);
        generator.setSettings(new JaxRsProjectSettings(groupId, artifactId, _package));
        generator.setOpenApiDocument(getClass().getClassLoader().getResource(apiDef));
        ByteArrayOutputStream outputStream = generator.generate();
        
        if (debug) {
            File tempFile = File.createTempFile("api", "zip");
            FileUtils.writeByteArrayToFile(File.createTempFile("api", "zip"), outputStream.toByteArray());
            System.out.println("Generated ZIP (debug) can be found here: " + tempFile.getAbsolutePath());

        }

        // Validate the result
        try (ZipInputStream zipInputStream = new ZipInputStream(new ByteArrayInputStream(outputStream.toByteArray()))) {
            ZipEntry zipEntry = zipInputStream.getNextEntry();
            while (zipEntry != null) {
                if (!zipEntry.isDirectory()) {
                    String name = zipEntry.getName();
                    if (debug) {
                        System.out.println(name);
                    }
                    Assert.assertNotNull(name);
                    
                    URL expectedFile = getClass().getClassLoader().getResource(getClass().getSimpleName() + 
                            "/" + expectedFilesPath + "/" + name);
                    Assert.assertNotNull("Could not find expected file for entry: " + name, expectedFile);
                    String expected = IOUtils.toString(expectedFile, Charset.forName("UTF-8"));

                    String actual = IOUtils.toString(zipInputStream, Charset.forName("UTF-8"));
                    if (debug) {
                        System.out.println("-----");
                        System.out.println(actual);
                        System.out.println("-----");
                    }
                    Assert.assertEquals("Expected vs. actual failed for entry: " + name, normalizeString(expected), normalizeString(actual));
                }
                zipEntry = zipInputStream.getNextEntry();
            }
        }
    }
    
    /**
     * Shared test method.
     * @param apiDef
     * @param updateOnly
     * @param expectedFilesPath
     * @param debug
     * @throws IOException
     */
    private void doFullTest(String apiDef, boolean updateOnly, String expectedFilesPath, boolean debug) throws IOException {
        OpenApi2Thorntail generator = new OpenApi2Thorntail();
        generator.setUpdateOnly(updateOnly);
        generator.setOpenApiDocument(getClass().getClassLoader().getResource(apiDef));
        ByteArrayOutputStream outputStream = generator.generate();
        
        if (debug) {
            File tempFile = File.createTempFile("api", "zip");
            FileUtils.writeByteArrayToFile(File.createTempFile("api", "zip"), outputStream.toByteArray());
            System.out.println("Generated ZIP (debug) can be found here: " + tempFile.getAbsolutePath());
        }

        // Validate the result
        try (ZipInputStream zipInputStream = new ZipInputStream(new ByteArrayInputStream(outputStream.toByteArray()))) {
            ZipEntry zipEntry = zipInputStream.getNextEntry();
            while (zipEntry != null) {
                if (!zipEntry.isDirectory()) {
                    String name = zipEntry.getName();
                    if (debug) {
                        System.out.println(name);
                    }
                    Assert.assertNotNull(name);
                    
                    URL expectedFile = getClass().getClassLoader().getResource(getClass().getSimpleName() + "/" + expectedFilesPath + "/" + name);
                    Assert.assertNotNull("Could not find expected file for entry: " + name, expectedFile);
                    String expected = IOUtils.toString(expectedFile, Charset.forName("UTF-8"));

                    String actual = IOUtils.toString(zipInputStream, Charset.forName("UTF-8"));
                    if (debug) {
                        System.out.println("-----");
                        System.out.println(actual);
                        System.out.println("-----");
                    }
                    Assert.assertEquals("Expected vs. actual failed for entry: " + name, normalizeString(expected), normalizeString(actual));
                }
                zipEntry = zipInputStream.getNextEntry();
            }
        }
    }

    private static String normalizeString(String value) {
        value = value.replaceAll("\\r\\n", "\n");
        value = value.replaceAll("\\r", "\n");
        return value;
    }

}
