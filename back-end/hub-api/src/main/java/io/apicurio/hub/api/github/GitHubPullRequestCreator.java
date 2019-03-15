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

package io.apicurio.hub.api.github;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import org.apache.commons.io.IOUtils;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPatch;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.apicurio.hub.api.connectors.AbstractSourceConnector.Endpoint;

/**
 * Creates a pull request from a ZIP file containing a set of resources to
 * commit to the git repo.
 * @author eric.wittmann@gmail.com
 */
public class GitHubPullRequestCreator {
    
    private static ObjectMapper mapper = new ObjectMapper();
    static {
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    
    private final ZipInputStream contents;
    private final String organization;
    private final String repository;
    private final String branch;
    private final String path;
    private final String commitMessage;
    
    private String apiUrl;
    private String token;
    
    /**
     * Constructor.
     * @param contents
     * @param organization
     * @param repository
     * @param branch
     * @param path
     * @param commitMessage
     */
    public GitHubPullRequestCreator(ZipInputStream contents, String organization, String repository,
            String branch, String path, String commitMessage) {
        this.contents = contents;
        this.organization = organization;
        this.repository = repository;
        this.branch = branch;
        this.path = path;
        this.commitMessage = commitMessage;
    }

    /**
     * @return the apiUrl
     */
    public String getApiUrl() {
        return apiUrl;
    }

    /**
     * @param apiUrl the apiUrl to set
     */
    public void setApiUrl(String apiUrl) {
        this.apiUrl = apiUrl;
    }

    /**
     * @return the token
     */
    public String getToken() {
        return token;
    }

    /**
     * @param token the token to set
     */
    public void setToken(String token) {
        this.token = token;
    }

    /**
     * Creates a github API endpoint from the api path.
     * @param path
     */
    protected Endpoint endpoint(String path) {
        return new Endpoint(this.apiUrl + path);
    }
    
    /**
     * Adds security to the request.
     * @param request
     */
    protected void addSecurityTo(HttpRequestBase request) {
        String idpToken = this.token;
        request.addHeader("Authorization", "Bearer " + idpToken);
    }

    /**
     * Called to create the pull request.  To accomplish this goal using the GitHub API, the
     * following steps must be taken:
     * 
     *    1. Get the "ref" for the target branch (need the ref's sha hash)
     *       https://developer.github.com/v3/git/refs/#get-a-reference
     *    2. Create a new "ref" for the branch we're creating (using the sha hash from step 1)
     *       https://developer.github.com/v3/git/refs/#create-a-reference
     *    3. Store all files as Blobs
     *       https://developer.github.com/v3/git/blobs/#create-a-blob
     *    4. Fetch the tree for our new branch "ref"
     *       https://developer.github.com/v3/git/trees/#get-a-tree
     *    5. Create a new tree for our files
     *       https://developer.github.com/v3/git/trees/#create-a-tree
     *    6. Create a new commit for our tree
     *       https://developer.github.com/v3/git/commits/#create-a-commit
     *    7. Update the new branch ref to point to the new commit SHA
     *       https://developer.github.com/v3/git/refs/#update-a-reference
     *    8. Create a pull request
     *       https://developer.github.com/v3/pulls/#create-a-pull-request
     */
    public GitHubPullRequest create() throws GitHubException {
        GitHubReference targetBranchRef = getTargetBranchRef();
        GitHubBranchReference prBranchRef = createPullRequestBranch(targetBranchRef);
        List<GitHubBlob> blobs = addFilesAsBlobs();
        GitHubTree parentTree = getParentTree(prBranchRef);
        GitHubTree commitTree = createTree(blobs, parentTree);
        GitHubCommit commit = createCommit(commitTree, prBranchRef);
        GitHubBranchReference updatedPrBranchRef = updateBranchRef(prBranchRef, commit);
        GitHubPullRequest pullRequest = createPullRequest(updatedPrBranchRef);
        return pullRequest;
    }

    /**
     * Gets the ref for the target branch (the branch where we ultimately want the content
     * to be committed via pull request).
     * @throws GitHubException
     */
    private GitHubReference getTargetBranchRef() throws GitHubException {
        String ref = "heads/" + this.branch;
        String url = this.endpoint("/repos/:owner/:repo/git/refs/:ref")
                .bind("owner", this.organization)
                .bind("repo", this.repository)
                .bind("ref", ref)
                .toString();

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpGet request = new HttpGet(url);
            request.addHeader("Accept", "application/json");
            addSecurityTo(request);

            try (CloseableHttpResponse response = httpClient.execute(request)) {
                if (response.getStatusLine().getStatusCode() != 200) {
                    throw new IOException("Invalid response code: " + response.getStatusLine().getStatusCode() + " :: " + response.getStatusLine().getReasonPhrase());
                }
                try (InputStream contentStream = response.getEntity().getContent()) {
                    GitHubReference ghRef = mapper.readValue(contentStream, GitHubReference.class);
                    return ghRef;
                }
            }
        } catch (IOException e) {
            throw new GitHubException("Error getting GitHub target branch ref.", e);
        }
    }

    /**
     * Creates a new branch that will eventually be used when creating committing the 
     * resources and creating the pull request.
     * @param targetBranchRef
     * @throws GitHubException
     */
    private GitHubBranchReference createPullRequestBranch(GitHubReference targetBranchRef) throws GitHubException {
        String url = this.endpoint("/repos/:owner/:repo/git/refs")
                .bind("owner", this.organization)
                .bind("repo", this.repository)
                .toString();
        
        String branchName = "_apicurio-" + (System.currentTimeMillis() % 10000);
        String newRefName = "refs/heads/" + branchName;
        GitHubCreateReference requestBody = new GitHubCreateReference();
        requestBody.setRef(newRefName);
        requestBody.setSha(targetBranchRef.getObject().getSha());

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpPost request = new HttpPost(url);
            request.setEntity(new StringEntity(mapper.writeValueAsString(requestBody)));
            request.addHeader("Content-Type", "application/json");
            request.addHeader("Accept", "application/json");
            addSecurityTo(request);

            try (CloseableHttpResponse response = httpClient.execute(request)) {
                if (response.getStatusLine().getStatusCode() != 201) {
                    throw new IOException("Invalid response code: " + response.getStatusLine().getStatusCode() + " :: " + response.getStatusLine().getReasonPhrase());
                }
                try (InputStream contentStream = response.getEntity().getContent()) {
                    GitHubBranchReference ghRef = mapper.readValue(contentStream, GitHubBranchReference.class);
                    ghRef.setName(branchName);
                    return ghRef;
                }
            }
        } catch (IOException e) {
            throw new GitHubException("Error getting GitHub target branch ref.", e);
        }
    }

    /**
     * Store all of the files as blobs.
     */
    private List<GitHubBlob> addFilesAsBlobs() throws GitHubException {
        try {
            List<GitHubBlob> rval = new ArrayList<>();
            ZipEntry entry = this.contents.getNextEntry();
            while (entry != null) {
                String filename = entry.getName();
                byte[] data = IOUtils.toByteArray(contents);
                rval.add(this.addFileAsBlob(filename, data));
                this.contents.closeEntry();
                entry = this.contents.getNextEntry();
            }
            
            return rval;
        } catch (IOException e) {
            throw new GitHubException("Error creating blobs.", e);
        }
    }
    
    /**
     * Stores a single file as a blob.
     * @param name
     * @param content
     */
    private GitHubBlob addFileAsBlob(String name, byte [] content) throws GitHubException {
        String url = this.endpoint("/repos/:owner/:repo/git/blobs")
                .bind("owner", this.organization)
                .bind("repo", this.repository)
                .toString();
        
        GitHubCreateBlob requestBody = new GitHubCreateBlob();
        requestBody.setContent(content);
        
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpPost request = new HttpPost(url);
            request.setEntity(new StringEntity(mapper.writeValueAsString(requestBody)));
            request.addHeader("Content-Type", "application/json");
            request.addHeader("Accept", "application/json");
            addSecurityTo(request);

            try (CloseableHttpResponse response = httpClient.execute(request)) {
                if (response.getStatusLine().getStatusCode() != 201) {
                    throw new IOException("Invalid response code: " + response.getStatusLine().getStatusCode() + " :: " + response.getStatusLine().getReasonPhrase());
                }
                try (InputStream contentStream = response.getEntity().getContent()) {
                    GitHubBlob so = mapper.readValue(contentStream, GitHubBlob.class);
                    so.setName(name);
                    return so;
                }
            }
        } catch (IOException e) {
            throw new GitHubException("Error creating a GH blob.", e);
        }
    }

    /**
     * Gets a tree given the SHA of a given branch ref.
     * @param branchRef
     */
    private GitHubTree getParentTree(GitHubReference branchRef) throws GitHubException {
        String url = this.endpoint("/repos/:owner/:repo/git/trees/:tree_sha?recursive=1")
                .bind("owner", this.organization)
                .bind("repo", this.repository)
                .bind("tree_sha", branchRef.getObject().getSha())
                .toString();

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpGet request = new HttpGet(url);
            request.addHeader("Accept", "application/json");
            addSecurityTo(request);

            try (CloseableHttpResponse response = httpClient.execute(request)) {
                if (response.getStatusLine().getStatusCode() != 200) {
                    throw new IOException("Invalid response code: " + response.getStatusLine().getStatusCode() + " :: " + response.getStatusLine().getReasonPhrase());
                }
                try (InputStream contentStream = response.getEntity().getContent()) {
                    GitHubTree ghTree = mapper.readValue(contentStream, GitHubTree.class);
                    return ghTree;
                }
            }
        } catch (IOException e) {
            throw new GitHubException("Error getting GitHub target branch ref.", e);
        }
    }

    /**
     * Creates a new tree with all the blobs we uploaded earlier.
     * @param blobs
     * @param parentTree
     * @throws GitHubException
     */
    private GitHubTree createTree(List<GitHubBlob> blobs, GitHubTree parentTree) throws GitHubException {
        String url = this.endpoint("/repos/:owner/:repo/git/trees")
                .bind("owner", this.organization)
                .bind("repo", this.repository)
                .toString();
        
        GitHubCreateTree requestBody = new GitHubCreateTree();
        requestBody.setBase_tree(parentTree.getSha());
        for (GitHubBlob blob : blobs) {
            String itemPath = this.itemPath(blob.getName());
            GitHubCreateTreeItem item = new GitHubCreateTreeItem();
            item.setMode("100644");
            item.setPath(itemPath);
            item.setSha(blob.getSha());
            item.setType("blob");
            requestBody.addItem(item);
        }
        
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpPost request = new HttpPost(url);
            request.setEntity(new StringEntity(mapper.writeValueAsString(requestBody)));
            request.addHeader("Content-Type", "application/json");
            request.addHeader("Accept", "application/json");
            addSecurityTo(request);

            try (CloseableHttpResponse response = httpClient.execute(request)) {
                if (response.getStatusLine().getStatusCode() != 201) {
                    throw new IOException("Invalid response code: " + response.getStatusLine().getStatusCode() + " :: " + response.getStatusLine().getReasonPhrase());
                }
                try (InputStream contentStream = response.getEntity().getContent()) {
                    GitHubTree tree = mapper.readValue(contentStream, GitHubTree.class);
                    return tree;
                }
            }
        } catch (IOException e) {
            throw new GitHubException("Error creating a GH tree.", e);
        }
    }

    /**
     * Creates a new commit for the given tree.
     * @param commitTree
     * @param branchRef
     * @throws GitHubException
     */
    private GitHubCommit createCommit(GitHubTree commitTree, GitHubReference branchRef) throws GitHubException {
        String url = this.endpoint("/repos/:owner/:repo/git/commits")
                .bind("owner", this.organization)
                .bind("repo", this.repository)
                .toString();
        
        GitHubCreateCommit requestBody = new GitHubCreateCommit();
        requestBody.setMessage(this.commitMessage);
        requestBody.setTree(commitTree.getSha());
        requestBody.setParents(branchRef.getObject().getSha());
        
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpPost request = new HttpPost(url);
            request.setEntity(new StringEntity(mapper.writeValueAsString(requestBody)));
            request.addHeader("Content-Type", "application/json");
            request.addHeader("Accept", "application/json");
            addSecurityTo(request);

            try (CloseableHttpResponse response = httpClient.execute(request)) {
                if (response.getStatusLine().getStatusCode() != 201) {
                    throw new IOException("Invalid response code: " + response.getStatusLine().getStatusCode() + " :: " + response.getStatusLine().getReasonPhrase());
                }
                try (InputStream contentStream = response.getEntity().getContent()) {
                    GitHubCommit commit = mapper.readValue(contentStream, GitHubCommit.class);
                    return commit;
                }
            }
        } catch (IOException e) {
            throw new GitHubException("Error creating a GH commit.", e);
        }
    }

    /**
     * Updates a branch reference to point it at the new commit.
     * @param branchRef
     * @param commit
     */
    private GitHubBranchReference updateBranchRef(GitHubBranchReference branchRef, GitHubCommit commit) throws GitHubException {
        String bref = branchRef.getRef();
        if (bref.startsWith("refs/")) {
            bref = bref.substring(5);
        }
        String url = this.endpoint("/repos/:owner/:repo/git/refs/:ref")
                .bind("owner", this.organization)
                .bind("repo", this.repository)
                .bind("ref", bref)
                .toString();
        
        GitHubUpdateReference requestBody = new GitHubUpdateReference();
        requestBody.setSha(commit.getSha());
        
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpPatch request = new HttpPatch(url);
            request.setEntity(new StringEntity(mapper.writeValueAsString(requestBody)));
            request.addHeader("Content-Type", "application/json");
            request.addHeader("Accept", "application/json");
            addSecurityTo(request);

            try (CloseableHttpResponse response = httpClient.execute(request)) {
                if (response.getStatusLine().getStatusCode() != 200) {
                    throw new IOException("Invalid response code: " + response.getStatusLine().getStatusCode() + " :: " + response.getStatusLine().getReasonPhrase());
                }
                try (InputStream contentStream = response.getEntity().getContent()) {
                    GitHubBranchReference ref = mapper.readValue(contentStream, GitHubBranchReference.class);
                    ref.setName(branchRef.getName());
                    return ref;
                }
            }
        } catch (IOException e) {
            throw new GitHubException("Error creating a GH commit.", e);
        }
    }

    /**
     * Creates a pull request for the branch.
     * @param branchRef
     */
    private GitHubPullRequest createPullRequest(GitHubBranchReference branchRef) throws GitHubException {
        String url = this.endpoint("/repos/:owner/:repo/pulls")
                .bind("owner", this.organization)
                .bind("repo", this.repository)
                .toString();
        
        GitHubCreatePullRequest requestBody = new GitHubCreatePullRequest();
        requestBody.setTitle("[Apicurio] Please merge generated API project");
        requestBody.setBody("The Apicurio tool was used to generate an API project from an OpenAPI definition.  Please review this pull request, modify as necessary, and merge!");
        requestBody.setHead(branchRef.getName());
        requestBody.setBase(this.branch);
        
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpPost request = new HttpPost(url);
            request.setEntity(new StringEntity(mapper.writeValueAsString(requestBody)));
            request.addHeader("Content-Type", "application/json");
            request.addHeader("Accept", "application/json");
            addSecurityTo(request);

            try (CloseableHttpResponse response = httpClient.execute(request)) {
                if (response.getStatusLine().getStatusCode() != 201) {
                    throw new IOException("Invalid response code: " + response.getStatusLine().getStatusCode() + " :: " + response.getStatusLine().getReasonPhrase());
                }
                try (InputStream contentStream = response.getEntity().getContent()) {
                    GitHubPullRequest pullRequest = mapper.readValue(contentStream, GitHubPullRequest.class);
                    return pullRequest;
                }
            }
        } catch (IOException e) {
            throw new GitHubException("Error creating a GH commit.", e);
        }
    }

    /**
     * Creates a tree item path for a given file resource path.
     * @param resource
     */
    private String itemPath(String resource) {
        StringBuilder builder = new StringBuilder();
        builder.append(this.path);
        if (!this.path.endsWith("/") && !this.path.equals("") && !resource.startsWith("/")) {
            builder.append("/");
        }
        if (resource.startsWith("/")) {
            builder.append(resource.substring(1));
        } else {
            builder.append(resource);
        }
        return builder.toString();
    }

}
