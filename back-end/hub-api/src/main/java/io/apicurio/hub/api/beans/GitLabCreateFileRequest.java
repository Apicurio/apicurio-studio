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

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class GitLabCreateFileRequest {

    private String branch;
    private String commitMessage;
    private String startBranch;
    private List<GitLabAction> actions;
    private String authorEmail;
    private String authorName;

    @JsonProperty("branch")
    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    @JsonProperty("commit_message")
    public String getCommitMessage() {
        return commitMessage;
    }

    public void setCommitMessage(String commitMessage) {
        this.commitMessage = commitMessage;
    }

    @JsonProperty("start_branch")
    public String getStartBranch() {
        return startBranch;
    }

    public void setStartBranch(String startBranch) {
        this.startBranch = startBranch;
    }

    @JsonProperty("actions")
    public List<GitLabAction> getActions() {
        return actions;
    }

    public void setActions(List<GitLabAction> actions) {
        this.actions = actions;
    }

    @JsonProperty("author_email")
    public String getAuthorEmail() {
        return authorEmail;
    }

    public void setAuthorEmail(String authorEmail) {
        this.authorEmail = authorEmail;
    }

    @JsonProperty("author_name")
    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }
}
