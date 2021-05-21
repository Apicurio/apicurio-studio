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

import io.apicurio.hub.api.codegen.OpenApi2JaxRs.JaxRsProjectSettings;

/**
 * @author eric.wittmann@gmail.com
 */
public class OpenApi2JaxRsTest {
    
    private static enum UpdateOnly {
        yes, no
    }
    private static enum Reactive {
        yes, no
    }

    /**
     * Test method for {@link io.apicurio.hub.api.codegen.OpenApi2JaxRs#generate()}.
     */
    @Test
    public void testGenerateFull() throws IOException {
        doFullTest("OpenApi2JaxRsTest/beer-api.json", UpdateOnly.no, Reactive.no, "_expected-full/generated-api", false);
    }

    /**
     * Test method for {@link io.apicurio.hub.api.codegen.OpenApi2JaxRs#generate()}.
     */
    @Test
    public void testGenerateFull_GatewayApi() throws IOException {
        doFullTest("OpenApi2JaxRsTest/gateway-api.json", UpdateOnly.no, Reactive.no, "_expected-gatewayApi-full/generated-api", false);
    }

    /**
     * Test method for {@link io.apicurio.hub.api.codegen.OpenApi2JaxRs#generate()}.
     */
    @Test
    public void testGenerateFull_RegistryApi() throws IOException {
        doFullTest("OpenApi2JaxRsTest/registry-api.json", UpdateOnly.no, Reactive.no, "_expected-registryApi-full/generated-api", false);
    }

    /**
     * Test method for {@link io.apicurio.hub.api.codegen.OpenApi2JaxRs#generate()}.
     */
    @Test
    public void testGenerateFull_RegistryApiV2() throws IOException {
        doFullTest("OpenApi2JaxRsTest/registry-api-v2.json", UpdateOnly.yes, Reactive.no, "_expected-registry-api-v2/generated-api", false);
    }

    /**
     * Test method for {@link io.apicurio.hub.api.codegen.OpenApi2JaxRs#generate()}.
     */
    @Test
    public void testGenerateUpdateOnly() throws IOException {
        doFullTest("OpenApi2JaxRsTest/beer-api.json", UpdateOnly.yes, Reactive.no, "_expected-full/generated-api", false);
    }

    /**
     * Test method for {@link io.apicurio.hub.api.codegen.OpenApi2JaxRs#generate()}.
     */
    @Test
    public void testGenerateFullReactive() throws IOException {
        doFullTest("OpenApi2JaxRsTest/beer-api.json", UpdateOnly.no, Reactive.yes, "_expected-reactive-full/generated-api", false);
    }

    /**
     * Test method for {@link io.apicurio.hub.api.codegen.OpenApi2JaxRs#generate()}.
     */
    @Test
    public void testGenerateFull_Issue885Api() throws IOException {
        // Note: I can't seem to get this working in the maven build, but it works in Eclipse.
        doFullTest("OpenApi2JaxRsTest/issue-885-api.json", UpdateOnly.no, Reactive.no, "_expected-issue885Api-full/generated-api", false);
    }

    /**
     * Test method for {@link io.apicurio.hub.api.codegen.OpenApi2JaxRs#generate()}.
     */
    @Test
    public void testGenerateFull_ContextRoot() throws IOException {
        doFullTest("OpenApi2JaxRsTest/context-root.json", UpdateOnly.no, Reactive.no, "_expected-context-root/generated-api", false);
    }

    /**
     * Test method for {@link io.apicurio.hub.api.codegen.OpenApi2JaxRs#generate()}.
     */
    @Test
    public void testGenerateFull_SimpleType() throws IOException {
        doFullTest("OpenApi2JaxRsTest/simple-type.json", UpdateOnly.no, Reactive.no, "_expected-simple-type/generated-api", false);
    }

    /**
     * Test method for {@link io.apicurio.hub.api.codegen.OpenApi2JaxRs#generate()}.
     */
    @Test
    public void testGenerateFull_BeanAnnotations() throws IOException {
        doFullTest("OpenApi2JaxRsTest/bean-annotations.json", UpdateOnly.no, Reactive.no, "_expected-bean-annotations/generated-api", false);
    }

    /**
     * Test method for {@link io.apicurio.hub.api.codegen.OpenApi2JaxRs#generate()}.
     */
    @Test
    public void testGenerateFull_Inheritance() throws IOException {
        doFullTest("OpenApi2JaxRsTest/inheritance.json", UpdateOnly.yes, Reactive.no, "_expected-inheritance/generated-api", false);
    }

    /**
     * Test method for {@link io.apicurio.hub.api.codegen.OpenApi2JaxRs#generate()}.
     */
    @Test
    public void testGenerateFull_NZDAX() throws IOException {
        doFullTest("OpenApi2JaxRsTest/nzdax.json", UpdateOnly.yes, Reactive.no, "_expected-nzdax/generated-api", false);
    }

    /**
     * Test method for {@link io.apicurio.hub.api.codegen.OpenApi2JaxRs#generate()}.
     */
    @Test
    public void testGenerateFull_CustomResponseType() throws IOException {
        doFullTest("OpenApi2JaxRsTest/custom-response-type.json", UpdateOnly.yes, Reactive.no, "_expected-custom-response-type/generated-api", false);
    }

    /**
     * Shared test method.
     * @param apiDef
     * @param updateOnly
     * @param reactive
     * @param expectedFilesPath
     * @param debug
     * @throws IOException
     */
    private void doFullTest(String apiDef, UpdateOnly updateOnly, Reactive reactive, String expectedFilesPath, boolean debug) throws IOException {
        JaxRsProjectSettings settings = new JaxRsProjectSettings();
        settings.codeOnly = false;
        settings.reactive = reactive == Reactive.yes;
        settings.artifactId = "generated-api";
        settings.groupId = "org.example.api";
        settings.javaPackage = "org.example.api";

        OpenApi2JaxRs generator = new OpenApi2JaxRs();
        generator.setSettings(settings);
        generator.setUpdateOnly(updateOnly == UpdateOnly.yes);
        generator.setOpenApiDocument(getClass().getClassLoader().getResource(apiDef));
        ByteArrayOutputStream outputStream = generator.generate();
        
        if (debug) {
            File tempFile = File.createTempFile("api", ".zip");
            FileUtils.writeByteArrayToFile(tempFile, outputStream.toByteArray());
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
                    if (expectedFile == null && "PROJECT_GENERATION_FAILED.txt".equals(name)) {
                        String errorLog = IOUtils.toString(zipInputStream, Charset.forName("UTF-8"));
                        System.out.println("----- UNEXPECTED ERROR LOG -----");
                        System.out.println(errorLog);
                        System.out.println("----- UNEXPECTED ERROR LOG -----");
                    }
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
