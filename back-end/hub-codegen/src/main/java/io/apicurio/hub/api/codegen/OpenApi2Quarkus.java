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

import java.io.IOException;
import java.nio.charset.Charset;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apache.commons.io.IOUtils;

import io.apicurio.hub.api.codegen.beans.CodegenInfo;


/**
 * Class used to generate a Quarkus JAX-RS project from an OpenAPI document.
 * 
 * @author eric.wittmann@gmail.com
 */
public class OpenApi2Quarkus extends OpenApi2JaxRs {

    /**
     * Constructor.
     */
    public OpenApi2Quarkus() {
        super();
    }
    
    /**
     * @see io.apicurio.hub.api.codegen.OpenApi2JaxRs#generateAll(io.apicurio.hub.api.codegen.beans.CodegenInfo, java.lang.StringBuilder, java.util.zip.ZipOutputStream)
     */
    @Override
    protected void generateAll(CodegenInfo info, StringBuilder log, ZipOutputStream zipOutput)
            throws IOException {
        super.generateAll(info, log, zipOutput);
        if (!this.isUpdateOnly() && !this.settings.codeOnly) {
            log.append("Generating Dockerfiles\r\n");
            zipOutput.putNextEntry(new ZipEntry("src/main/docker/Dockerfile.jvm"));
            zipOutput.write(generateDockerfileJvm().getBytes());
            zipOutput.closeEntry();
            zipOutput.putNextEntry(new ZipEntry("src/main/docker/Dockerfile.native"));
            zipOutput.write(generateDockerfileNative().getBytes());
            zipOutput.closeEntry();

            log.append("Generating application.properties\r\n");
            zipOutput.putNextEntry(new ZipEntry("src/main/resources/application.properties"));
            zipOutput.write(generateApplicationProperties().getBytes());
            zipOutput.closeEntry();

            log.append("Generating src/main/resources/META-INF/microprofile-config.properties\r\n");
            zipOutput.putNextEntry(new ZipEntry("src/main/resources/META-INF/microprofile-config.properties"));
            zipOutput.write(generateMicroprofileConfigProperties().getBytes());
            zipOutput.closeEntry();
        }
    }
    
    /**
     * @see io.apicurio.hub.api.codegen.OpenApi2JaxRs#generateJaxRsApplication()
     */
    @Override
    protected String generateJaxRsApplication() throws IOException {
        // Don't need one of these for Quarkus.
        return null;
    }

    /**
     * Generates Dockerfile.jvm.
     */
    private String generateDockerfileJvm() throws IOException {
        String template = IOUtils.toString(getResource("src/main/docker/Dockerfile.jvm"), Charset.forName("UTF-8"));
        return template;
    }

    /**
     * Generates Dockerfile.native.
     */
    private String generateDockerfileNative() throws IOException {
        String template = IOUtils.toString(getResource("src/main/docker/Dockerfile.native"), Charset.forName("UTF-8"));
        return template;
    }

    /**
     * Generates the openshift-template.yml file.
     */
    private String generateApplicationProperties() throws IOException {
        String template = IOUtils.toString(getResource("src/main/resources/application.properties"), Charset.forName("UTF-8"));
        return template;
    }

    /**
     * Generates the microprofile-config.properties file to include in the generated project.
     */
    private String generateMicroprofileConfigProperties() throws IOException {
        String template = IOUtils.toString(getResource("src/main/resources/META-INF/microprofile-config.properties"), Charset.forName("UTF-8"));
        return template;
    }

}
