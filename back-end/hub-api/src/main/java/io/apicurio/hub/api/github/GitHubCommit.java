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

import java.util.ArrayList;
import java.util.List;

/**
 * @author eric.wittmann@gmail.com
 */
public class GitHubCommit {
    
    private String sha;
    private String node_id;
    private String url;
    // author
    // committer
    private String message;
    private GitHubSimpleObject tree;
    private List<GitHubSimpleObject> parents = new ArrayList<>();
    // verification
    
    /**
     * Constructor.
     */
    public GitHubCommit() {
    }

    /**
     * @return the sha
     */
    public String getSha() {
        return sha;
    }

    /**
     * @param sha the sha to set
     */
    public void setSha(String sha) {
        this.sha = sha;
    }

    /**
     * @return the node_id
     */
    public String getNode_id() {
        return node_id;
    }

    /**
     * @param node_id the node_id to set
     */
    public void setNode_id(String node_id) {
        this.node_id = node_id;
    }

    /**
     * @return the url
     */
    public String getUrl() {
        return url;
    }

    /**
     * @param url the url to set
     */
    public void setUrl(String url) {
        this.url = url;
    }

    /**
     * @return the message
     */
    public String getMessage() {
        return message;
    }

    /**
     * @param message the message to set
     */
    public void setMessage(String message) {
        this.message = message;
    }

    /**
     * @return the tree
     */
    public GitHubSimpleObject getTree() {
        return tree;
    }

    /**
     * @param tree the tree to set
     */
    public void setTree(GitHubSimpleObject tree) {
        this.tree = tree;
    }

    /**
     * @return the parents
     */
    public List<GitHubSimpleObject> getParents() {
        return parents;
    }

    /**
     * @param parents the parents to set
     */
    public void setParents(List<GitHubSimpleObject> parents) {
        this.parents = parents;
    }

}
