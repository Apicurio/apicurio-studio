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
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
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
        FileUtils.writeByteArrayToFile(new File("C:\\Temp\\output.zip"), outputStream.toByteArray());
        
        try (ZipInputStream zipInputStream = new ZipInputStream(new ByteArrayInputStream(outputStream.toByteArray()))) {
            ZipEntry zipEntry = zipInputStream.getNextEntry();
            while (zipEntry != null) {
                String name = zipEntry.getName();
                System.out.println(name);
                zipEntry = zipInputStream.getNextEntry();
            }
        }
        
    }

}
