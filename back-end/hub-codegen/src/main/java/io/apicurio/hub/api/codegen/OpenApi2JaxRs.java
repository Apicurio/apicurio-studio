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
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.URI;
import java.net.URL;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.concurrent.CompletionStage;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.lang.model.SourceVersion;
import javax.lang.model.element.Modifier;
import javax.ws.rs.Consumes;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.jsonschema2pojo.Annotator;
import org.jsonschema2pojo.DefaultGenerationConfig;
import org.jsonschema2pojo.GenerationConfig;
import org.jsonschema2pojo.Jackson2Annotator;
import org.jsonschema2pojo.Schema;
import org.jsonschema2pojo.SchemaGenerator;
import org.jsonschema2pojo.SchemaMapper;
import org.jsonschema2pojo.SchemaStore;
import org.jsonschema2pojo.rules.Rule;
import org.jsonschema2pojo.rules.RuleFactory;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.squareup.javapoet.AnnotationSpec;
import com.squareup.javapoet.ClassName;
import com.squareup.javapoet.JavaFile;
import com.squareup.javapoet.MethodSpec;
import com.squareup.javapoet.ParameterSpec;
import com.squareup.javapoet.ParameterizedTypeName;
import com.squareup.javapoet.TypeName;
import com.squareup.javapoet.TypeSpec;
import com.squareup.javapoet.TypeSpec.Builder;
import com.sun.codemodel.JClassContainer;
import com.sun.codemodel.JCodeModel;
import com.sun.codemodel.JType;

import io.apicurio.datamodels.Library;
import io.apicurio.datamodels.core.models.Document;
import io.apicurio.datamodels.core.models.Extension;
import io.apicurio.datamodels.core.util.VisitorUtil;
import io.apicurio.datamodels.core.visitors.TraverserDirection;
import io.apicurio.datamodels.openapi.models.OasDocument;
import io.apicurio.hub.api.codegen.beans.CodegenInfo;
import io.apicurio.hub.api.codegen.beans.CodegenJavaArgument;
import io.apicurio.hub.api.codegen.beans.CodegenJavaBean;
import io.apicurio.hub.api.codegen.beans.CodegenJavaInterface;
import io.apicurio.hub.api.codegen.beans.CodegenJavaMethod;
import io.apicurio.hub.api.codegen.jaxrs.InterfacesVisitor;
import io.apicurio.hub.api.codegen.jaxrs.OpenApi2CodegenVisitor;
import io.apicurio.hub.api.codegen.post.JavaBeanPostProcessor;
import io.apicurio.hub.api.codegen.pre.DocumentPreProcessor;
import io.apicurio.hub.api.codegen.util.CodegenUtil;
import io.apicurio.hub.api.codegen.util.IndexedCodeWriter;


/**
 * Class used to generate a simple JAX-RS project from an OpenAPI document.
 *
 * @author eric.wittmann@gmail.com
 */
public class OpenApi2JaxRs {

    protected static ObjectMapper mapper = new ObjectMapper();
    protected static Charset utf8 = StandardCharsets.UTF_8;
    protected static GenerationConfig config = new DefaultGenerationConfig() {
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

        @Override
        public boolean isIncludeToString() {
            return false;
        }
    };
    protected static JavaBeanPostProcessor postProcessor = new JavaBeanPostProcessor();

    private String openApiDoc;
    protected transient Document document;
    protected JaxRsProjectSettings settings;
    private boolean updateOnly;

    /**
     * Constructor.
     */
    public OpenApi2JaxRs() {
        this.settings = new JaxRsProjectSettings();
        this.settings.artifactId = "generated-api";
        this.settings.groupId = "org.example.api";
        this.settings.javaPackage = "org.example.api";
    }

    /**
     * Configure the settings.
     *
     * @param settings
     */
    public void setSettings(JaxRsProjectSettings settings) {
        this.settings = settings;
    }

    /**
     * Sets the OpenAPI document.
     *
     * @param content
     * @throws IOException
     */
    public void setOpenApiDocument(String content) {
        this.openApiDoc = content;
    }

    /**
     * Sets the OpenAPI document via a URL to the content.
     *
     * @param url
     * @throws IOException
     */
    public void setOpenApiDocument(URL url) throws IOException {
        try (InputStream is = url.openStream()) {
            this.setOpenApiDocument(is);
        }
    }

    /**
     * Sets the OpenAPI document via an input stream.  The stream must be closed
     * by the caller.
     *
     * @param stream
     * @throws IOException
     */
    public void setOpenApiDocument(InputStream stream) throws IOException {
        this.openApiDoc = IOUtils.toString(stream, utf8);
    }

    /**
     * Generates a JaxRs project and streams the generated ZIP to the given
     * output stream.
     *
     * @param output
     * @throws IOException
     */
    public final void generate(OutputStream output) throws IOException {
        StringBuilder log = new StringBuilder();

        try (ZipOutputStream zos = new ZipOutputStream(output)) {
            try {
                CodegenInfo info = getInfoFromApiDoc();
                generateAll(info, log, zos);
            } catch (Exception e) {
                // If we get an error, put an PROJECT_GENERATION_ERROR file into the ZIP.
                zos.putNextEntry(new ZipEntry("PROJECT_GENERATION_FAILED.txt"));
                zos.write("An unexpected server error was encountered while generating the project.  See\r\n".getBytes());
                zos.write("the details of the error below.\r\n\r\n".getBytes());
                zos.write("Generation Log:\r\n\r\n".getBytes());
                zos.write(log.toString().getBytes(utf8));
                zos.write("\r\n\r\nServer Stack Trace:\r\n".getBytes());

                PrintWriter writer = new PrintWriter(zos);
                e.printStackTrace(writer);
                writer.flush();
                zos.closeEntry();
            }
        }
    }

    /**
     * Generates all of the content for storage in the ZIP.  Responsible for generating all classes
     * and other resources that make up the generated project.
     *
     * @param info
     * @param log
     * @param zipOutput
     * @throws IOException
     */
    protected void generateAll(CodegenInfo info, StringBuilder log, ZipOutputStream zipOutput) throws IOException {
        if (!this.updateOnly && !this.settings.codeOnly) {
            log.append("Generating pom.xml\r\n");
            String pomXml = generatePomXml(info);
            if (pomXml != null) {
                zipOutput.putNextEntry(new ZipEntry("pom.xml"));
                zipOutput.write(pomXml.getBytes(utf8));
                zipOutput.closeEntry();
            }
        }

        log.append("Generating src/main/resources/META-INF/openapi.json\r\n");
        zipOutput.putNextEntry(new ZipEntry("src/main/resources/META-INF/openapi.json"));
        zipOutput.write(this.openApiDoc.getBytes(utf8));
        zipOutput.closeEntry();

        if (!this.updateOnly) {
            String appFileName = javaPackageToZipPath(this.settings.javaPackage) + "JaxRsApplication.java";
            String jaxRsApp = generateJaxRsApplication();
            if (jaxRsApp != null) {
                log.append("Generating " + appFileName + "\r\n");
                zipOutput.putNextEntry(new ZipEntry(appFileName));
                zipOutput.write(jaxRsApp.getBytes(utf8));
                zipOutput.closeEntry();
            }
        }

        // Generate the java beans from data types
        IndexedCodeWriter codeWriter = new IndexedCodeWriter();
        for (CodegenJavaBean bean : info.getBeans()) {
            log.append("Generating Bean: " + bean.getPackage() + "." + bean.getName() + "\r\n");
            generateJavaBean(bean, info, codeWriter);
        }
        // Post-process generated java bean classes
        for (String className : codeWriter.keys()) {
            ByteArrayOutputStream beanData = codeWriter.getContent(className);
            List<String> annotations = new ArrayList<>();
            annotations.addAll(info.getBeanAnnotations());
            CodegenJavaBean bean = codeWriter.getBean(className);
            if (bean != null && bean.getAnnotations() != null) {
                annotations.addAll(bean.getAnnotations());
            }
            
            ByteArrayOutputStream processedBeanData = postProcessor.process(className, annotations, beanData);
            if (beanData != processedBeanData) {
                codeWriter.set(className, processedBeanData);
            }
        }
        // Write all of the java beans classes to the ZIP file
        for (String key : codeWriter.keys()) {
            String javaClassFileName = javaClassToZipPath(key);
            log.append("Adding to zip: " + javaClassFileName + "\r\n");
            zipOutput.putNextEntry(new ZipEntry(javaClassFileName));
            zipOutput.write(codeWriter.getContent(key).toByteArray());
            zipOutput.closeEntry();
        }

        // Generate the JAX-RS interfaces
        for (CodegenJavaInterface iface : info.getInterfaces()) {
            log.append("Generating Interface: " + iface.getPackage() + "." + iface.getName() + "\r\n");
            String javaInterface = generateJavaInterface(info, iface);
            String javaInterfaceFileName = javaPackageToZipPath(iface.getPackage()) + iface.getName() + ".java";
            log.append("Adding to zip: " + javaInterfaceFileName + "\r\n");
            zipOutput.putNextEntry(new ZipEntry(javaInterfaceFileName));
            zipOutput.write(javaInterface.getBytes(utf8));
            zipOutput.closeEntry();
        }

    }

    /**
     * Generate the JaxRs project.
     *
     * @throws IOException
     */
    public ByteArrayOutputStream generate() throws IOException {
        try (ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            this.generate(output);
            return output;
        }
    }

    private String javaClassToZipPath(String javaClass) {
        return "src/main/java/" + javaClass.replace('.', '/') + ".java";
    }

    /**
     * Processes the OpenAPI document to produce a CodegenInfo object that contains everything
     * needed to generate appropriate Java class(es).
     */
    protected CodegenInfo getInfoFromApiDoc() throws IOException {
        document = Library.readDocumentFromJSONString(openApiDoc);
        
        // Pre-process the document
        document = preProcess(document);
        
        // Figure out the breakdown of the interfaces.
        InterfacesVisitor iVisitor = new InterfacesVisitor();
        VisitorUtil.visitTree(document, iVisitor, TraverserDirection.down);

        // Then generate the CodegenInfo object.
        OpenApi2CodegenVisitor cgVisitor = new OpenApi2CodegenVisitor(this.settings.javaPackage, iVisitor.getInterfaces());
        VisitorUtil.visitTree(document, cgVisitor, TraverserDirection.down);

        // Now resolve any inline schemas/types
        CodegenInfo info = cgVisitor.getCodegenInfo();
        info.getInterfaces().forEach(iface -> {
            iface.getMethods().forEach(method -> {
                method.getArguments().forEach(arg -> {
                    String argTypeSig = arg.getTypeSignature();
                    CodegenJavaBean matchingBean = findMatchingBean(info, argTypeSig);
                    if (matchingBean != null) {
                        arg.setType(matchingBean.getPackage() + "." + StringUtils.capitalize(matchingBean.getName()));
                    }
                });
            });
        });
        info.setContextRoot(getContextRoot(document));
        return info;
    }

    private String getContextRoot(Document document) {
        OasDocument oaiDoc = (OasDocument) document;
        if (oaiDoc.paths != null) {
            Extension extension = oaiDoc.paths.getExtension("x-codegen-contextRoot");
            if (extension != null && extension.value != null) {
                return String.valueOf(extension.value);
            }
        }
        return "";
    }

    /**
     * Pre-process the document to modify it in the following ways:
     * 
     * 1) Inline any re-usable simple-type schemas
     * 2) Check for the "x-codegen-contextRoot" property in the Paths object and prepend its value to all paths
     * 
     * @param document
     */
    private Document preProcess(Document document) {
        DocumentPreProcessor preprocessor = new DocumentPreProcessor();
        preprocessor.process(document);
        
        if (Boolean.FALSE) {
            System.out.println("-------------------------");
            System.out.println(Library.writeDocumentToJSONString(document));
            System.out.println("-------------------------");
            System.exit(1);
        }
        
        return document;
    }

    /**
     * Find a bean that matches the schema signature.
     *
     * @param info
     * @param typeSignature
     */
    private static CodegenJavaBean findMatchingBean(CodegenInfo info, String typeSignature) {
        if (typeSignature == null) {
            return null;
        }
        for (CodegenJavaBean bean : info.getBeans()) {
            if (typeSignature.equals(bean.getSignature())) {
                return bean;
            }
        }
        return null;
    }

    /**
     * Generates the pom.xml file.
     *
     * @param info
     */
    protected String generatePomXml(CodegenInfo info) throws IOException {
        String template = IOUtils.toString(getResource("pom.xml"), Charset.forName("UTF-8"));
        return template.replace("$GROUP_ID$", this.settings.groupId)
                .replace("$ARTIFACT_ID$", this.settings.artifactId)
                .replace("$VERSION$", info.getVersion())
                .replace("$NAME$", info.getName())
                .replace("$DESCRIPTION$", info.getDescription());
    }

    /**
     * Generates the JaxRsApplication java class.
     */
    protected String generateJaxRsApplication() throws IOException {
        TypeSpec jaxRsApp = TypeSpec.classBuilder(ClassName.get(this.settings.javaPackage, "JaxRsApplication"))
                .addModifiers(Modifier.PUBLIC)
                .superclass(ClassName.get("javax.ws.rs.core", "Application"))
                .addAnnotation(ClassName.get("javax.enterprise.context", "ApplicationScoped"))
                .addAnnotation(AnnotationSpec.builder(ClassName.get("javax.ws.rs", "ApplicationPath"))
                        .addMember("value", "$S", "/")
                        .build())
                .addJavadoc("The JAX-RS application.\n")
                .build();
        JavaFile javaFile = JavaFile.builder(this.settings.javaPackage, jaxRsApp).skipJavaLangImports(true).build();
        return javaFile.toString();
    }

    /**
     * Generates a Jax-rs interface from the given codegen information.
     * @param info
     * @param _interface
     */
    protected String generateJavaInterface(CodegenInfo info, CodegenJavaInterface _interface) {
        // Create the JAX-RS interface spec itself.
        Builder interfaceBuilder = TypeSpec
                .interfaceBuilder(ClassName.get(_interface.getPackage(), _interface.getName()));
        String jaxRsPath = info.getContextRoot() + _interface.getPath();
        interfaceBuilder.addModifiers(Modifier.PUBLIC)
                .addAnnotation(AnnotationSpec.builder(Path.class).addMember("value", "$S", jaxRsPath).build())
                .addJavadoc("A JAX-RS interface.  An implementation of this interface must be provided.\n");

        // Add specs for all the methods.
        for (CodegenJavaMethod cgMethod : _interface.getMethods()) {
            com.squareup.javapoet.MethodSpec.Builder methodBuilder = MethodSpec.methodBuilder(cgMethod.getName());
            methodBuilder.addModifiers(Modifier.PUBLIC, Modifier.ABSTRACT);
            // The @Path annotation.
            if (cgMethod.getPath() != null) {
                methodBuilder.addAnnotation(AnnotationSpec.builder(Path.class).addMember("value", "$S", cgMethod.getPath()).build());
            }
            // The @GET, @PUT, @POST, etc annotation
            methodBuilder.addAnnotation(AnnotationSpec.builder(ClassName.get("javax.ws.rs", cgMethod.getMethod().toUpperCase())).build());
            // The @Produces annotation
            if (cgMethod.getProduces() != null && !cgMethod.getProduces().isEmpty()) {
                methodBuilder.addAnnotation(AnnotationSpec.builder(Produces.class)
                        .addMember("value", "$L", toStringArrayLiteral(cgMethod.getProduces())).build());
            }
            // The @Consumes annotation
            if (cgMethod.getConsumes() != null && !cgMethod.getConsumes().isEmpty()) {
                methodBuilder.addAnnotation(AnnotationSpec.builder(Consumes.class)
                        .addMember("value", "$L", toStringArrayLiteral(cgMethod.getConsumes())).build());
            }
            // The method return type.
            if (cgMethod.getReturn() != null) {
                TypeName returnType = generateTypeName(cgMethod.getReturn().getCollection(),
                        cgMethod.getReturn().getType(), cgMethod.getReturn().getFormat(), true,
                        ClassName.get("javax.ws.rs.core", "Response"));
                if (getSettings().reactive || cgMethod.isAsync()) {
                    returnType = generateReactiveTypeName(returnType);
                }
                methodBuilder.returns(returnType);
            }

            // The method arguments.
            if (cgMethod.getArguments() != null && !cgMethod.getArguments().isEmpty()) {
                for (CodegenJavaArgument cgArgument : cgMethod.getArguments()) {
                    TypeName defaultParamType = ClassName.OBJECT;
                    if (cgArgument.getIn().equals("body")) {
                        defaultParamType = ClassName.get("java.io", "InputStream");
                    }
                    TypeName paramType = generateTypeName(cgArgument.getCollection(), cgArgument.getType(),
                            cgArgument.getFormat(), cgArgument.getRequired(), defaultParamType);
                    if (cgArgument.getTypeSignature() != null) {
                        // TODO try to find a re-usable data type that matches the type signature
                    }
                    com.squareup.javapoet.ParameterSpec.Builder paramBuilder = ParameterSpec.builder(paramType,
                            paramNameToJavaArgName(cgArgument.getName()));
                    if (cgArgument.getIn().equals("path")) {
                        paramBuilder.addAnnotation(AnnotationSpec.builder(PathParam.class)
                                .addMember("value", "$S", cgArgument.getName()).build());
                    }
                    if (cgArgument.getIn().equals("query")) {
                        paramBuilder.addAnnotation(AnnotationSpec.builder(QueryParam.class)
                                .addMember("value", "$S", cgArgument.getName()).build());
                    }
                    if (cgArgument.getIn().equals("header")) {
                        paramBuilder.addAnnotation(AnnotationSpec.builder(HeaderParam.class)
                                .addMember("value", "$S", cgArgument.getName()).build());
                    }
                    methodBuilder.addParameter(paramBuilder.build());
                }
            }

            // TODO:: error responses (4xx and 5xx)
            // Should errors be modeled in some way?  JAX-RS has a few ways to handle them.  I'm inclined to 
            // not generate anything in the interface for error responses.

            // Javadoc
            if (cgMethod.getDescription() != null) {
                methodBuilder.addJavadoc(cgMethod.getDescription());
                methodBuilder.addJavadoc("\n");
            }

            interfaceBuilder.addMethod(methodBuilder.build());
        }

        TypeSpec jaxRsInterface = interfaceBuilder.build();

        JavaFile javaFile = JavaFile.builder(_interface.getPackage(), jaxRsInterface).skipJavaLangImports(true).build();
        return javaFile.toString();
    }

    /**
     * Generates the java type name for a collection (optional) and type.  Examples include list/string,
     * null/org.example.Bean, list/org.example.OtherBean, etc.
     *
     * @param collection
     * @param type
     * @param format
     * @param required
     * @param defaultType
     */
    private TypeName generateTypeName(String collection, String type, String format, Boolean required, TypeName defaultType) {
        if (type == null) {
            return defaultType;
        }
        if (required == null) {
            required = Boolean.FALSE;
        }

        boolean isList = "list".equals(collection);

        TypeName coreType = null;
        if (type.equals("string")) {
            coreType = ClassName.get(String.class);
            if (format != null) {
                if (format.equals("date") || format.equals("date-time")) {
                    coreType = ClassName.get(Date.class);
                }
                if (format.equals("binary") && collection == null) {
                    coreType = defaultType;
                }
                // TODO handle byte
            }
        } else if (type.equals("integer")) {
            if (config.isUseLongIntegers()) {
                coreType = required && !isList && format != null ? TypeName.LONG : ClassName.get(Long.class);

            } else {
                coreType = required && !isList && format != null ? TypeName.INT : ClassName.get(Integer.class);
            }

        } else if (type.equals("number")) {
            coreType = ClassName.get(Number.class);
            if (format != null) {
                if (format.equals("float")) {
                    coreType = required && !isList ? TypeName.FLOAT : ClassName.get(Float.class);
                } else if (format.equals("double")) {
                    coreType = required && !isList ? TypeName.DOUBLE : ClassName.get(Double.class);
                }
            }
        } else if (type.equals("boolean")) {
            coreType = ClassName.get(Boolean.class);
        } else {
            try {
                coreType = ClassName.bestGuess(type);
            } catch (Exception e) {
                return defaultType;
            }
        }

        if (collection == null) {
            return coreType;
        }

        if ("list".equals(collection)) {
            return ParameterizedTypeName.get(ClassName.get(List.class), coreType);
        }

        return defaultType;
    }

    /**
     * Generates the reactive java type name for a collection (optional) and type.  Examples include list/string,
     * null/org.example.Bean, list/org.example.OtherBean, etc.
     *
     * @param collection
     * @param type
     * @param format
     * @param required
     * @param defaultType
     */
    private TypeName generateReactiveTypeName(TypeName coreType) {
        return ParameterizedTypeName.get(ClassName.get(CompletionStage.class), coreType);
    }

    /**
     * Converts a set of strings into an array literal format.
     *
     * @param values
     */
    private static String toStringArrayLiteral(Set<String> values) {
        StringBuilder builder = new StringBuilder();

        if (values.size() == 1) {
            builder.append("\"");
            builder.append(values.iterator().next().replace("\"", "\\\""));
            builder.append("\"");
        } else {
            builder.append("{");
            boolean first = true;
            for (String value : values) {
                if (!first) {
                    builder.append(", ");
                }
                builder.append("\"");
                builder.append(value.replace("\"", "\\\""));
                builder.append("\"");
                first = false;
            }
            builder.append("}");
        }
        return builder.toString();
    }

    /**
     * Generates a Java Bean class for the given bean info.  The bean info should
     * have a name, package, and JSON Schema.  This information will be used to
     * generate a POJO.
     *
     * @param bean
     * @param info
     * @param codeWriter
     * @throws IOException
     */
    private void generateJavaBean(CodegenJavaBean bean, CodegenInfo info, IndexedCodeWriter codeWriter) throws IOException {
        JCodeModel codeModel = new JCodeModel();

        SchemaMapper schemaMapper = new SchemaMapper(
                new JaxRsRuleFactory(config, new Jackson2Annotator(config), new SchemaStore() {
                    @Override
                    public Schema create(Schema parent, String path, String refFragmentPathDelimiters) {
                        String beanClassname = schemaRefToFQCN(path);
                        for (CodegenJavaBean cgBean : info.getBeans()) {
                            String cgBeanFQCN = cgBean.getPackage() + "." + StringUtils.capitalize(cgBean.getName());
                            if (beanClassname.equals(cgBeanFQCN)) {
                                Schema schema = new Schema(classnameToUri(beanClassname), cgBean.get$schema(), null);
                                JType jclass = codeModel._getClass(beanClassname);
                                if (jclass == null) {
                                    jclass = codeModel.directClass(beanClassname);
                                }
                                schema.setJavaType(jclass);
                                return schema;
                            }
                        }
                        // TODO if we get here, we probably want to return an empty schema
                        return super.create(parent, path, refFragmentPathDelimiters);
                    }
                }),
                new SchemaGenerator());
        String source = mapper.writeValueAsString(bean.get$schema());
        schemaMapper.generate(codeModel, bean.getName(), bean.getPackage(), source);
        codeModel.build(codeWriter);
        
        String fqcn = bean.getPackage() + "." + bean.getName();
        codeWriter.indexBean(fqcn, bean);
    }

    protected URL getResource(String name) {
        return getClass().getResource(getResourceName(name));
    }

    protected String getResourceName(String name) {
        return "_" + getClass().getSimpleName() + "/" + name;
    }

    protected URI classnameToUri(String path) {
        return URI.create(path.replace('.', '/') + ".java");
    }

    protected String schemaRefToFQCN(String path) {
        return CodegenUtil.schemaRefToFQCN(document, path, this.settings.javaPackage + ".beans");
    }

    private static String javaPackageToZipPath(String javaPackage) {
        return "src/main/java/" + javaPackageToPath(javaPackage);
    }

    private static String javaPackageToPath(String javaPackage) {
        return javaPackage.replaceAll("[^A-Za-z0-9.]", "").replace('.', '/') + "/";
    }

    private static String paramNameToJavaArgName(String paramName) {
        if (paramName == null) {
            return null;
        }
        String[] split = paramName.replaceAll("[^a-zA-Z0-9_]", "_").split("_");
        StringBuilder builder = new StringBuilder();
        boolean first = true;
        for (String term : split) {
            if (term.trim().length() == 0) {
                continue;
            }
            if (first) {
                builder.append(decapitalize(term));
                first = false;
            } else {
                builder.append(capitalize(term));
            }
        }
        String rval = builder.toString();
        if (!SourceVersion.isName(rval)) {
            rval = "_" + rval;
        }
        return rval;
    }

    private static String capitalize(String term) {
        if (term.length() == 1) {
            return term.toUpperCase();
        }
        return term.substring(0, 1).toUpperCase() + term.substring(1);
    }

    private static String decapitalize(String term) {
        if (term.length() == 1) {
            return term.toLowerCase();
        }
        return term.substring(0, 1).toLowerCase() + term.substring(1);
    }

    /**
     * @return the updateOnly
     */
    public boolean isUpdateOnly() {
        return updateOnly;
    }

    /**
     * @return the settings
     */
    public JaxRsProjectSettings getSettings() {
        return this.settings;
    }

    /**
     * @param updateOnly the updateOnly to set
     */
    public void setUpdateOnly(boolean updateOnly) {
        this.updateOnly = updateOnly;
    }

    public static class JaxRsRuleFactory extends RuleFactory {

        /**
         * Constructor.
         */
        public JaxRsRuleFactory(GenerationConfig generationConfig, Annotator annotator, SchemaStore schemaStore) {
            super(generationConfig, annotator, schemaStore);
        }

        /**
         * @see org.jsonschema2pojo.rules.RuleFactory#getEnumRule()
         */
        @Override
        public Rule<JClassContainer, JType> getEnumRule() {
            return new JaxRsEnumRule(this);
        }
    }

    /**
     * Represents some basic meta information about the project being generated.
     *
     * @author eric.wittmann@gmail.com
     */
    public static class JaxRsProjectSettings {
        public boolean codeOnly;
        public boolean reactive;
        public String groupId;
        public String artifactId;
        public String javaPackage;

        /**
         * Constructor.
         */
        public JaxRsProjectSettings() {
        }

        /**
         * Constructor.
         *
         * @param groupId
         * @param artifactId
         * @param javaPackage
         */
        public JaxRsProjectSettings(String groupId, String artifactId, String javaPackage) {
            this.codeOnly = false;
            this.reactive = false;
            this.groupId = groupId;
            this.artifactId = artifactId;
            this.javaPackage = javaPackage;
        }

        /**
         * Constructor.
         *
         * @param codeOnly
         * @param reactive
         * @param groupId
         * @param artifactId
         * @param javaPackage
         */
        public JaxRsProjectSettings(boolean codeOnly, boolean reactive, String groupId, String artifactId, String javaPackage) {
            this.codeOnly = false;
            this.reactive = false;
            this.groupId = groupId;
            this.artifactId = artifactId;
            this.javaPackage = javaPackage;
        }
    }

}
