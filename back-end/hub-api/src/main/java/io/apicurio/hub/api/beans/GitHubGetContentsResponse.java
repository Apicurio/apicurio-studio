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

package io.apicurio.hub.api.beans;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

/**
 * @author eric.wittmann@gmail.com
 */
@JsonInclude(Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown=true)
public class GitHubGetContentsResponse {
    
    private String type;
    private String encoding;
    private int size;
    private String name;
    private String path;
    private String content;
    private String sha;
    private String url;
    private String git_url;
    private String html_url;
    private String download_url;
    
    /**
     * Constructor.
     */
    public GitHubGetContentsResponse() {
    }

    /**
     * @return the type
     */
    public String getType() {
        return type;
    }

    /**
     * @param type the type to set
     */
    public void setType(String type) {
        this.type = type;
    }

    /**
     * @return the encoding
     */
    public String getEncoding() {
        return encoding;
    }

    /**
     * @param encoding the encoding to set
     */
    public void setEncoding(String encoding) {
        this.encoding = encoding;
    }

    /**
     * @return the size
     */
    public int getSize() {
        return size;
    }

    /**
     * @param size the size to set
     */
    public void setSize(int size) {
        this.size = size;
    }

    /**
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * @param name the name to set
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return the path
     */
    public String getPath() {
        return path;
    }

    /**
     * @param path the path to set
     */
    public void setPath(String path) {
        this.path = path;
    }

    /**
     * @return the content
     */
    public String getContent() {
        return content;
    }

    /**
     * @param content the content to set
     */
    public void setContent(String content) {
        this.content = content;
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
     * @return the git_url
     */
    public String getGit_url() {
        return git_url;
    }

    /**
     * @param git_url the git_url to set
     */
    public void setGit_url(String git_url) {
        this.git_url = git_url;
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

    /**
     * @return the download_url
     */
    public String getDownload_url() {
        return download_url;
    }

    /**
     * @param download_url the download_url to set
     */
    public void setDownload_url(String download_url) {
        this.download_url = download_url;
    }
}
