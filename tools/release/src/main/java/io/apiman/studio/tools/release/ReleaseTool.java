/*
 * Copyright 2017 JBoss Inc
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

package io.apiman.studio.tools.release;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.DefaultParser;
import org.apache.commons.cli.HelpFormatter;
import org.apache.commons.cli.Options;
import org.apache.commons.io.IOUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;

/**
 * @author eric.wittmann@gmail.com
 */
public class ReleaseTool {
    
    /**
     * Main method.
     * @param args
     */
    public static void main(String[] args) throws Exception {
        Options options = new Options();
        options.addOption("n", "release-name", true, "The name of the new release.");
        options.addOption("p", "prerelease", false, "Indicate that this is a pre-release.");
        options.addOption("d", "draft", false, "Indicate that this is a draft release.");
        options.addOption("t", "release-tag", true, "The tag name of the new release.");
        options.addOption("o", "previous-tag", true, "The tag name of the previous release.");
        options.addOption("g", "github-pat", true, "The GitHub PAT (for authentication/authorization).");
        options.addOption("a", "artifact", true, "The binary release artifact (full path).");
        
        CommandLineParser parser = new DefaultParser();
        CommandLine cmd = parser.parse(options, args);
        
        if (    !cmd.hasOption("n") || 
                !cmd.hasOption("t") || 
                !cmd.hasOption("o") || 
                !cmd.hasOption("g") || 
                !cmd.hasOption("a")    )
        {
            HelpFormatter formatter = new HelpFormatter();
            formatter.printHelp( "release-studio", options );
            System.exit(1);
        }
        
        // Arguments (command line)
        String releaseName = cmd.getOptionValue("n");
        boolean isPrerelease = cmd.hasOption("p");
        boolean isDraft = cmd.hasOption("d");
        String releaseTag = cmd.getOptionValue("t");
        String oldReleaseTag = cmd.getOptionValue("o");
        String githubPAT = cmd.getOptionValue("g");
        String artifact = cmd.getOptionValue("a");
        
        File releaseArtifactFile = new File(artifact);
        File releaseArtifactSigFile = new File(artifact + ".asc");
        
        String releaseArtifact = releaseArtifactFile.getName();
        String releaseArtifactSig = releaseArtifactSigFile.getName();

        if (!releaseArtifactFile.isFile()) {
            System.err.println("Missing file: " + releaseArtifactFile.getAbsolutePath());
            System.exit(1);
        }
        if (!releaseArtifactSigFile.isFile()) {
            System.err.println("Missing file: " + releaseArtifactSigFile.getAbsolutePath());
            System.exit(1);
        }

        System.out.println("=========================================");
        System.out.println("Creating Release: " + releaseTag);
        System.out.println("Previous Release: " + oldReleaseTag);
        System.out.println("            Name: " + releaseName);
        System.out.println("        Artifact: " + releaseArtifact);
        System.out.println("=========================================");
        
        String releaseNotes = "";
        
        // Step #1 - Generate Release Notes
        //   * Grab info about the previous release (extract publish date)
        //   * Query all Issues for ones closed since that date
        //   * Generate Release Notes from the resulting Issues
        try {
            System.out.println("Getting info about release " + oldReleaseTag);
            HttpResponse<JsonNode> response = Unirest.get("https://api.github.com/repos/apiman/apiman-studio/releases/tags/v" + oldReleaseTag)
                    .header("Accept", "application/json").header("Authorization", "token " + githubPAT).asJson();
            if (response.getStatus() != 200) {
                throw new Exception("Failed to get old release info: " + response.getStatusText());
            }
            JsonNode body = response.getBody();
            String publishedDate = body.getObject().getString("published_at");
            if (publishedDate == null) {
                throw new Exception("Could not find Published Date for previous release " + oldReleaseTag);
            }
            System.out.println("Release " + oldReleaseTag + " was published on " + publishedDate);
            
            List<JSONObject> issues = getIssuesForRelease(publishedDate, githubPAT);
            System.out.println("Found " + issues.size() + " issues closed in release " + releaseTag);
            System.out.println("Generating Release Notes");
            
            releaseNotes = generateReleaseNotes(releaseName, releaseTag, issues);
            System.out.println("------------ Release Notes --------------");
            System.out.println(releaseNotes);
            System.out.println("-----------------------------------------");
        } catch (Exception e) {
            e.printStackTrace();
            System.exit(1);
        }
        
        System.exit(0);

        String assetUploadUrl = null;
        
        // Step #2 - Create a GitHub Release
        try {
            System.out.println("\nCreating GitHub Release " + releaseTag);
            JSONObject body = new JSONObject();
            body.put("tag_name", "v" + releaseTag);
            body.put("name", releaseName);
            body.put("body", releaseNotes);
            body.put("prerelease", isPrerelease);
            body.put("draft", isDraft);
            
            HttpResponse<JsonNode> response = Unirest.post("https://api.github.com/repos/apiman/apiman-studio/releases")
                    .header("Accept", "application/json")
                    .header("Content-Type", "application/json")
                    .header("Authorization", "token " + githubPAT)
                    .body(body).asJson();
            if (response.getStatus() != 200) {
                throw new Exception("Failed to get old release info: " + response.getStatusText());
            }
            
            assetUploadUrl = response.getBody().getObject().getString("upload_url");
            if (assetUploadUrl == null || assetUploadUrl.trim().isEmpty()) {
                throw new Exception("Failed to get Asset Upload URL for newly created release!");
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.exit(1);
        }

        // Step #3 - Upload Release Artifact (zip file)
        System.out.println("\nUploading Quickstart Artifact: " + releaseArtifact);
        try {
            String artifactUploadUrl = createUploadUrl(assetUploadUrl, releaseArtifact);
            byte [] artifactData = loadArtifactData(releaseArtifactFile);
            System.out.println("Uploading artifact asset: " + artifactUploadUrl);
            HttpResponse<JsonNode> response = Unirest.post(artifactUploadUrl)
                    .header("Accept", "application/json")
                    .header("Content-Type", "application/zip")
                    .header("Authorization", "token " + githubPAT)
                    .body(artifactData)
                    .asJson();
            if (response.getStatus() != 201) {
                throw new Exception("Failed to upload asset: " + releaseArtifact);
            }

            artifactUploadUrl = createUploadUrl(assetUploadUrl, releaseArtifactSig);
            artifactData = loadArtifactData(releaseArtifactSigFile);
            System.out.println("Uploading artifact asset: " + artifactUploadUrl);
            response = Unirest.post(artifactUploadUrl)
                    .header("Accept", "application/json")
                    .header("Content-Type", "text/plain")
                    .header("Authorization", "token " + githubPAT)
                    .body(artifactData)
                    .asJson();
            if (response.getStatus() != 201) {
                throw new Exception("Failed to upload asset: " + releaseArtifactSig);
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.exit(1);
        }
        
        System.out.println("=========================================");
        System.out.println("All Done!");
        System.out.println("=========================================");
    }

    /**
     * Generates the release notes for a release.
     * @param releaseName
     * @param releaseTag
     * @param issues
     */
    private static String generateReleaseNotes(String releaseName, String releaseTag,
            List<JSONObject> issues) {
        StringBuilder builder = new StringBuilder();

        builder.append("This represents the official release of the API Design Studio, version ");
        builder.append(releaseTag);
        builder.append(".\n\n");
        builder.append("The following issues have been resolved in this release:\n\n");
        
        issues.forEach(issue -> {
            builder.append(String.format("* [#%d](%s) %s", issue.getInt("number"), issue.getString("url"), issue.getString("title")));
            builder.append("\n");
        });
        
        builder.append("\n\n");
        
        builder.append("For more information, please see the API Design Studio's official project site:\n\n");
        builder.append("* [General Information](http://www.apidesigner.org/)\n");
        builder.append("* [Download/Quickstart](http://www.apidesigner.org/download)\n");
        builder.append("* [Blog](http://www.apidesigner.org/blog)\n");
        
        return builder.toString();
    }

    /**
     * Returns all issues (as JSON nodes) that were closed since the given date.
     * @param since
     * @param githubPAT
     */
    private static List<JSONObject> getIssuesForRelease(String since, String githubPAT) throws Exception {
        List<JSONObject> rval = new ArrayList<>();
        
        String currentPageUrl = "https://api.github.com/repos/apiman/apiman-studio/issues?state=closed";
        int pageNum = 1;
        while (currentPageUrl != null) {
            System.out.println("Querying page " + pageNum + " of issues.");
            HttpResponse<JsonNode> response = Unirest.get(currentPageUrl)
                    .header("Accept", "application/json").header("Authorization", "token " + githubPAT).asJson();
            if (response.getStatus() != 200) {
                throw new Exception("Failed to list Issues: " + response.getStatusText());
            }
            JSONArray issueNodes = response.getBody().getArray();
            issueNodes.forEach(issueNode -> {
                JSONObject issue = (JSONObject) issueNode;
                String closedOn = issue.getString("closed_at");
                if (since.compareTo(closedOn) < 0) {
                    rval.add(issue);
                }
            });
            
            System.out.println("Processing page " + pageNum + " of issues.");
            System.out.println("    Found " + issueNodes.length() + " issues on page.");
            String allLinks = response.getHeaders().getFirst("Link");
            Map<String, Link> links = Link.parseAll(allLinks);
            if (links.containsKey("next")) {
                currentPageUrl = links.get("next").getUrl();
            } else {
                currentPageUrl = null;
            }
            pageNum++;
        }

        return rval;
    }

    /**
     * @param assetUploadUrl
     * @param assetName
     */
    private static String createUploadUrl(String assetUploadUrl, String assetName) throws Exception {
        int idx = assetUploadUrl.indexOf("{?name");
        if (idx < 0) {
            throw new Exception("Invalid Asset Upload URL Pattern: " + assetUploadUrl);
        }
        return String.format("%s?name=%s", assetUploadUrl.substring(0, idx), assetName);
    }

    /**
     * @param releaseArtifactFile
     */
    private static byte[] loadArtifactData(File releaseArtifactFile) throws Exception {
        System.out.println("Loading artifact content: " + releaseArtifactFile.getName()); 
        byte [] buffer = new byte[(int) releaseArtifactFile.length()];
        InputStream is = null;
        try {
            is = new FileInputStream(releaseArtifactFile);
            IOUtils.readFully(is, buffer);
            return buffer;
        } catch (IOException e) {
            throw new Exception(e);
        } finally {
            IOUtils.closeQuietly(is);
        }
    }
}
