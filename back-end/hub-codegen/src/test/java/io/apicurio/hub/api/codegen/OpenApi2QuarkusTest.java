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

/**
 * @author eric.wittmann@gmail.com
 */
public class OpenApi2QuarkusTest {

    /**
     * Test method for {@link io.apicurio.hub.api.codegen.OpenApi2Quarkus#generate()}.
     */
    @Test
    public void testGenerateFull() throws IOException {
        doFullTest("OpenApi2QuarkusTest/beer-api.json", false, "_expected-full/generated-api", false);
    }

    /**
     * Test method for {@link io.apicurio.hub.api.codegen.OpenApi2Quarkus#generate()}.
     */
    @Test
    public void testGitHubApisFull() throws IOException {
        doFullTest("OpenApi2QuarkusTest/github-apis-deref.json", false, "_expected-github/generated-api", false);
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
        OpenApi2Quarkus generator = new OpenApi2Quarkus();
        generator.setUpdateOnly(updateOnly);
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
