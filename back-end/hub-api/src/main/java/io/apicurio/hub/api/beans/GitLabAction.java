package io.apicurio.hub.api.beans;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class GitLabAction {

    private GitLabActionType gitLabAction;
    private String filePath;
    private String previousPath;
    private String content;
    private String encoding;

    public void setGitLabAction(GitLabActionType gitLabAction) {
        this.gitLabAction = gitLabAction;
    }

    @JsonProperty("file_path")
    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    @JsonProperty("previous_path")
    public String getPreviousPath() {
        return previousPath;
    }

    public void setPreviousPath(String previousPath) {
        this.previousPath = previousPath;
    }

    @JsonProperty("content")
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @JsonProperty("encoding")
    public String getEncoding() {
        return encoding;
    }

    public void setEncoding(String encoding) {
        this.encoding = encoding;
    }

    @JsonProperty("action")
    public String getAction() {
        if (this.gitLabAction != null) {
            return gitLabAction.getValue();
        }

        return null;
    }

    public enum GitLabActionType {

        CREATE("create"), DELETE("delete"), MOVE("move"), UPDATE("update");

        private String value;

        private GitLabActionType(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }
}
