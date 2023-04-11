package io.apicurio.hub.api.codegen;

import io.apicurio.hub.api.bitbucket.BitbucketResourceResolver;
import io.apicurio.hub.api.connectors.ISourceConnector;
import io.apicurio.hub.api.connectors.SourceConnectorException;
import io.apicurio.hub.api.connectors.SourceConnectorFactory;
import io.apicurio.hub.api.github.GitHubResourceResolver;
import io.apicurio.hub.api.gitlab.GitLabResourceResolver;
import io.apicurio.hub.core.beans.CodegenProject;
import io.apicurio.hub.core.beans.LinkedAccountType;
import io.apicurio.hub.core.exceptions.NotFoundException;
import pro.bilous.codegen.exec.ExecSettings;
import pro.bilous.codegen.exec.ServerMain;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.StreamingOutput;
import java.io.*;
import java.util.HashMap;
import java.util.Map;
import java.util.zip.ZipInputStream;

@ApplicationScoped
public class DjaiCodegen {

    @Inject
    private SourceConnectorFactory sourceConnectorFactory;
    @Inject
    private GitLabResourceResolver gitLabResolver;
    @Inject
    private GitHubResourceResolver gitHubResolver;
    @Inject
    private BitbucketResourceResolver bitbucketResolver;

    public Response createResponse(CodegenProject project, String content) throws IOException {

        JaxRsProjectSettings localSettings = toSettings(project);

        StreamingOutput stream = generateToStream(project, content, localSettings.artifactId);

        String fname = localSettings.artifactId + ".zip";
        Response.ResponseBuilder builder = Response.ok().entity(stream)
                .header("Content-Disposition", "attachment; filename=\"" + fname + "\"")
                .header("Content-Type", "application/zip");

        return builder.build();
    }

    private StreamingOutput generateToStream(CodegenProject project, String content, String artifactId) throws IOException {
        Map<String, String> attr = project.getAttributes();

        ServerMain main = new ServerMain();
        String specFilePath = writeToFile(artifactId, content, ".json");

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
        String confFilePath = writeToFile(artifactId, confContent, ".yaml");
        ExecSettings settings = new ExecSettings("/", specFilePath, confFilePath, properties);
        return output -> main.generate(output, settings);
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

    public String generateAndPublish(CodegenProject project, String content) throws IOException, NotFoundException, SourceConnectorException {
        JaxRsProjectSettings localSettings = toSettings(project);

        ByteArrayOutputStream generatedContent = new ByteArrayOutputStream();
        StreamingOutput output = generateToStream(project, content, localSettings.artifactId);
        output.write(generatedContent);

        LinkedAccountType scsType = LinkedAccountType.valueOf(project.getAttributes().get("publish-type"));

        ISourceConnector connector = this.sourceConnectorFactory.createConnector(scsType);
        String url = toSourceResourceUrl(project);
        String commitMessage = project.getAttributes().get("publish-commitMessage");
        String pullRequestUrl = connector.createPullRequestFromZipContent(url, commitMessage,
                new ZipInputStream(new ByteArrayInputStream(generatedContent.toByteArray())));
        return pullRequestUrl;
    }

    /**
     * Creates a source control resource URL from the information found in the codegen project.
     * @param project
     */
    private String toSourceResourceUrl(CodegenProject project) {
        LinkedAccountType scsType = LinkedAccountType.valueOf(project.getAttributes().get("publish-type"));
        String url;
        switch (scsType) {
            case Bitbucket: {
                String team = project.getAttributes().get("publish-team");
                String repo = project.getAttributes().get("publish-repo");
                String branch = project.getAttributes().get("publish-branch");
                String path = project.getAttributes().get("publish-location");
                url = bitbucketResolver.create(team, repo, branch, path);
            }
            break;
            case GitHub: {
                String org = project.getAttributes().get("publish-org");
                String repo = project.getAttributes().get("publish-repo");
                String branch = project.getAttributes().get("publish-branch");
                String path = project.getAttributes().get("publish-location");
                url = gitHubResolver.create(org, repo, branch, path);
            }
            break;
            case GitLab: {
                String group = project.getAttributes().get("publish-group");
                String proj = project.getAttributes().get("publish-project");
                String branch = project.getAttributes().get("publish-branch");
                String path = project.getAttributes().get("publish-location");
                url = gitLabResolver.create(group, proj, branch, path);
            }
            break;
            default:
                throw new RuntimeException("Unsupported type: " + scsType);
        }
        return url;
    }
}
