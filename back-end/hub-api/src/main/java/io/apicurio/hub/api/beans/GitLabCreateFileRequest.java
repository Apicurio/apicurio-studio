package io.apicurio.hub.api.beans;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class GitLabCreateFileRequest {

    private String id;
    private String branch;
    private String commitMessage;
    private String startBranch;
    private List<GitLabAction> actions;
    private String authorEmail;
    private String authorName;

    @JsonProperty("id")
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

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
