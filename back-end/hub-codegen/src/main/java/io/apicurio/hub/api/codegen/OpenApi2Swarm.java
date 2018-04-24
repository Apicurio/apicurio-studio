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

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apache.commons.io.IOUtils;
import org.jsonschema2pojo.DefaultGenerationConfig;
import org.jsonschema2pojo.GenerationConfig;
import org.jsonschema2pojo.Jackson2Annotator;
import org.jsonschema2pojo.SchemaGenerator;
import org.jsonschema2pojo.SchemaMapper;
import org.jsonschema2pojo.SchemaStore;
import org.jsonschema2pojo.rules.RuleFactory;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.squareup.javapoet.AnnotationSpec;
import com.squareup.javapoet.ClassName;
import com.squareup.javapoet.JavaFile;
import com.squareup.javapoet.TypeSpec;
import com.sun.codemodel.JCodeModel;

import io.apicurio.hub.api.codegen.beans.CodegenInfo;
import io.apicurio.hub.api.codegen.beans.CodegenJavaBean;
import io.apicurio.hub.api.codegen.beans.CodegenJavaInterface;
import io.apicurio.hub.api.codegen.util.IndexedCodeWriter;


/**
 * Class used to generate a WildFly Swarm JAX-RS project from an OpenAPI document.
 * 
 * @author eric.wittmann@gmail.com
 */
public class OpenApi2Swarm {

    private static ObjectMapper mapper = new ObjectMapper();

    private String openApiDoc;
    private SwarmProjectSettings settings;
    
    /**
     * Constructor.
     */
    public OpenApi2Swarm() {
        this.settings = new SwarmProjectSettings();
        this.settings.artifactId = "generated-api";
        this.settings.groupId = "org.example.api";
        this.settings.javaPackage = "org.example.api";
    }

    /**
     * Configure the settings.
     * @param settings
     */
    public void setSettings(SwarmProjectSettings settings) {
        this.settings = settings;
    }

    /**
     * Sets the OpenAPI document.
     * @param content
     * @throws IOException
     */
    public void setOpenApiDocument(String content) throws IOException {
        this.openApiDoc = content;
    }

    /**
     * Sets the OpenAPI document via a URL to the content.
     * @param url
     * @throws IOException
     */
    public void setOpenApiDocument(URL url) throws IOException {
        try (InputStream is = url.openStream()) {
            this.setOpenApiDocument(is);
        }
    }
    
    /**
     * Sets the OpenAPI document via an input stream.
     * @param stream
     * @throws IOException
     */
    public void setOpenApiDocument(InputStream stream) throws IOException {
        this.openApiDoc = IOUtils.toString(stream);
    }
    
    /**
     * Generate the WildFly Swarm project.
     * @throws IOException
     */
    public ByteArrayOutputStream generate() throws IOException {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        
        CodegenInfo info = getInfoFromApiDoc();
        
        try (ZipOutputStream zos = new ZipOutputStream(output)) {
            zos.putNextEntry(new ZipEntry(this.settings.artifactId + "/pom.xml"));
            zos.write(generatePomXml().getBytes());
            zos.closeEntry();
            
            zos.putNextEntry(new ZipEntry(this.settings.artifactId + this.javaPackageToZipPath(this.settings.javaPackage) + "JaxRsApplication.java"));
            zos.write(generateJaxRsApplication().getBytes());
            zos.closeEntry();
            
            for (CodegenJavaInterface iface : info.getInterfaces()) {
                String javaInterface = generateJavaInterface(iface);
                zos.putNextEntry(new ZipEntry(this.settings.artifactId + this.javaPackageToZipPath(iface.getPackage()) + iface.getName() + ".java"));
                zos.write(javaInterface.getBytes());
                zos.closeEntry();
            }
            
            for (CodegenJavaBean bean : info.getBeans()) {
                String javaBean = generateJavaBean(bean);
                zos.putNextEntry(new ZipEntry(this.settings.artifactId + this.javaPackageToZipPath(bean.getPackage()) + bean.getName() + ".java"));
                zos.write(javaBean.getBytes());
                zos.closeEntry();
            }
        }
        
        return output;
    }
    
    private String generateJavaInterface(CodegenJavaInterface _interface) {
        // TODO Auto-generated method stub
        return "java_interface";
    }

    /**
     * Generates a Java Bean class for the given bean info.  The bean info should
     * have a name, package, and JSON Schema.  This information will be used to 
     * generate a POJO.
     * @param bean
     * @throws IOException
     */
    private String generateJavaBean(CodegenJavaBean bean) throws IOException {
        JCodeModel codeModel = new JCodeModel();
        GenerationConfig config = new DefaultGenerationConfig() {
            @Override
            public boolean isUsePrimitives() {
                return false;
            }
            @Override
            public boolean isIncludeHashcodeAndEquals() {
                return false;
            }
            @Override
            public boolean isIncludeAdditionalProperties() {
                return false;
            }
        };

        SchemaMapper schemaMapper = new SchemaMapper(
                new RuleFactory(config, new Jackson2Annotator(config), new SchemaStore()),
                new SchemaGenerator());
        String source = mapper.writeValueAsString(bean.get$schema());
        schemaMapper.generate(codeModel, bean.getName(), bean.getPackage(), source);

        IndexedCodeWriter codeWriter = new IndexedCodeWriter();
        codeModel.build(codeWriter);
        
        return codeWriter.get(bean.getPackage() + "." + bean.getName());
    }

    /**
     * Processes the OpenAPI document to produce a CodegenInfo object that contains everything
     * needed to generate appropriate Java class(es).
     */
    protected CodegenInfo getInfoFromApiDoc() throws IOException {
        String codegenJson = processApiDoc();
        return mapper.readerFor(CodegenInfo.class).readValue(codegenJson);
    }

    /**
     * Processes the OAI document and produces a -codegen.json file that can be
     * deserialized into a {@link CodegenInfo} object.
     */
    protected String processApiDoc() throws IOException {
        // TODO Auto-generated method stub
        throw new RuntimeException("Not yet implemented.");
    }

    /**
     * Generates the pom.xml file.
     */
    private String generatePomXml() throws IOException {
        String template = IOUtils.toString(getClass().getResource("pom.xml"));
        return template.replace("$GROUP_ID$", this.settings.groupId)
                .replace("$ARTIFACT_ID$", this.settings.artifactId);
    }
    
    /**
     * Generates the JaxRsApplication java class.
     */
    private String generateJaxRsApplication() throws IOException {
        TypeSpec jaxRsApp = TypeSpec.classBuilder(ClassName.get(this.settings.javaPackage, "JaxRsApplication"))
                .superclass(ClassName.get("javax.ws.rs", "Application"))
                .addAnnotation(ClassName.get("javax.enterprise.context", "ApplicationScoped"))
                .addAnnotation(AnnotationSpec.builder(ClassName.get("javax.ws.rs", "ApplicationPath"))
                        .addMember("value", "$S", "/")
                        .build())
                .addJavadoc("The JAX-RS application.")
                .build();
        JavaFile javaFile = JavaFile.builder(this.settings.javaPackage, jaxRsApp).build();
        return javaFile.toString();
    }
    
    private String javaPackageToZipPath(String javaPackage) {
        return "/src/main/java/" + this.javaPackageToPath(javaPackage);
    }
    
    private String javaPackageToPath(String javaPackage) {
        return javaPackage.replaceAll("[^A-Za-z0-9.]", "").replace('.', '/') + "/";
    }

    /**
     * Represents some basic meta information about the project being generated.
     * @author eric.wittmann@gmail.com
     */
    public static class SwarmProjectSettings {
        public String groupId;
        public String artifactId;
        public String javaPackage;
    }

}
