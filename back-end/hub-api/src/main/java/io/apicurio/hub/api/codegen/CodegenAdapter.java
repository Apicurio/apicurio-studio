package io.apicurio.hub.api.codegen;

import io.apicurio.hub.core.beans.CodegenProject;
import pro.bilous.codegen.exec.ExecSettings;
import pro.bilous.codegen.exec.ServerMain;

import javax.ws.rs.core.Response;
import javax.ws.rs.core.StreamingOutput;
import java.io.*;
import java.util.HashMap;
import java.util.Map;

public class CodegenAdapter {

    public Response createResponse(CodegenProject project, String content) throws IOException {

        JaxRsProjectSettings localSettings = toSettings(project);

        Map<String, String> attr = project.getAttributes();

        ServerMain main = new ServerMain();
        String specFilePath = writeToFile(localSettings.artifactId, content, ".json");

        Map<String, String> properties = new HashMap<>();
        String confContent = "groupId: " + attr.get("groupId") +"\n" +
                        "system: " + attr.get("system") + "\n" +
                        "application:\n" +
                        "  - " + attr.get("application") + "\n" +
                        "artifactId: " + attr.get("artifactId") + "\n" +
                        "artifactVersion: " + attr.get("artifactVersion") + "\n" +
                        "artifactDescription: Application description\n" +
                        "title: Application title\n" +
                        "basePackage: " + attr.get("javaPackage") + "\n" +
                        "addKotlin: true\n" +
                        "dateLibrary: default\n" +
                        "cicd: " + "true".equals(attr.get("cicd")) + "\n"+
                        "addBindingEntity: " + "true".equals(attr.get("addBindingEntity")) + "\n";
        String confFilePath = writeToFile(localSettings.artifactId, confContent, ".yaml");
        ExecSettings settings = new ExecSettings("/application", specFilePath, confFilePath, properties);

        StreamingOutput stream = output -> main.generate(output, settings);

        String fname = localSettings.artifactId + ".zip";
        Response.ResponseBuilder builder = Response.ok().entity(stream)
                .header("Content-Disposition", "attachment; filename=\"" + fname + "\"")
                .header("Content-Type", "application/zip");

        return builder.build();
    }

    private JaxRsProjectSettings toSettings(CodegenProject project) {
        boolean codeOnly = "true".equals(project.getAttributes().get("codeOnly"));
        boolean reactive = "true".equals(project.getAttributes().get("reactive"));
        boolean generateCliCi = "true".equals(project.getAttributes().get("generateCliCi"));
        String groupId = project.getAttributes().get("groupId");
        String artifactId = project.getAttributes().get("artifactId");
        String javaPackage = project.getAttributes().get("javaPackage");

        JaxRsProjectSettings settings = new JaxRsProjectSettings();
        settings.codeOnly = codeOnly;
        settings.reactive = reactive;
        settings.cliGenCI = generateCliCi;
        settings.groupId = groupId != null ? groupId : "org.example.api";
        settings.artifactId = artifactId != null ? artifactId : "generated-api";
        settings.javaPackage = javaPackage != null ? javaPackage : "org.example.api";

        return settings;
    }

    public static String writeToFile(String pFilename, String content, String suffix) throws IOException {
        File tempDir = new File("/tmp");
        File tempFile = File.createTempFile(pFilename, suffix, tempDir);
        FileWriter fileWriter = new FileWriter(tempFile, true);
        BufferedWriter bw = new BufferedWriter(fileWriter);
        bw.write(content);
        bw.close();
        return tempFile.getAbsolutePath();
    }
}
