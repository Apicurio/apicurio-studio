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

/**
 * @author eric.wittmann@gmail.com
 */
public class GitHubPullRequest {
    
    private int id;
    private String node_id;
    private String url;
    private String html_url;

    /**
     * Constructor.
     */
    public GitHubPullRequest() {
    }

    /**
     * @return the id
     */
    public int getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(int id) {
        this.id = id;
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
     * @return the html_url
     */
    public String getHtml_url() {
        return html_url;
    }

    /**
     * @param html_url the html_url to set
     */
    public void setHtml_url(String html_url) {
        this.html_url = html_url;
    }
}
