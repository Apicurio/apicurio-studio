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
import java.util.HashSet;
import java.util.Set;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.junit.Assert;
import org.junit.Test;

/**
 * @author eric.wittmann@gmail.com
 */
public class OpenApi2SwarmTest {

    /**
     * Test method for {@link io.apicurio.hub.api.codegen.OpenApi2Swarm#generate()}.
     */
    @Test
    public void testGenerate() throws IOException {
        OpenApi2Swarm generator = new OpenApi2Swarm() {
            /**
             * @see io.apicurio.hub.api.codegen.OpenApi2Swarm#processApiDoc()
             */
            @Override
            protected String processApiDoc() {
                try {
                    return IOUtils.toString(OpenApi2SwarmTest.class.getResource("beer-api.codegen.json"));
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
        };
        generator.setOpenApiDocument(getClass().getResource("beer-api.json"));
        ByteArrayOutputStream outputStream = generator.generate();
        
        FileUtils.writeByteArrayToFile(new File("C:\\Users\\ewittman\\tmp\\output.zip"), outputStream.toByteArray());
        
        Set<String> expectedFiles = new HashSet<>();
        expectedFiles.add("generated-api/pom.xml");
        expectedFiles.add("generated-api/src/main/resources/META-INF/openapi.json");
        expectedFiles.add("generated-api/src/main/resources/META-INF/microprofile-config.properties");
        expectedFiles.add("generated-api/src/main/java/org/example/api/JaxRsApplication.java");
        expectedFiles.add("generated-api/src/main/java/org/example/api/Beers.java");
        expectedFiles.add("generated-api/src/main/java/org/example/api/beans/Beer.java");
        expectedFiles.add("generated-api/src/main/java/org/example/api/beans/Brewery.java");

        // Validate the result
        try (ZipInputStream zipInputStream = new ZipInputStream(new ByteArrayInputStream(outputStream.toByteArray()))) {
            ZipEntry zipEntry = zipInputStream.getNextEntry();
            while (zipEntry != null) {
                if (!zipEntry.isDirectory()) {
                    String name = zipEntry.getName();
                    Assert.assertNotNull(name);
                    Assert.assertTrue("Unexpected file found in ZIP: " + name, expectedFiles.contains(name));
                    
                    URL expectedFile = getClass().getResource(getClass().getSimpleName() + "_expected/" + name);
                    Assert.assertNotNull("Could not find expected file for entry: " + name, expectedFile);
                    String expected = IOUtils.toString(expectedFile);

                    String actual = IOUtils.toString(zipInputStream);
//                    System.out.println("-----");
//                    System.out.println(actual);
//                    System.out.println("-----");
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
