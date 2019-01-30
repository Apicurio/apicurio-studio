package io.apicurio.test.integration.arquillian;

import io.restassured.http.Headers;

import javax.ws.rs.core.Response;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public class SessionInfo {
    private String editingSessionUuid;
    private String contentVersion;
    private String contentType;
    private Integer contentLength;

    public SessionInfo(Response response) {
        editingSessionUuid = response.getHeaderString("X-Apicurio-EditingSessionUuid");
        contentVersion = response.getHeaderString("X-Apicurio-ContentVersion");
        contentType = response.getHeaderString("Content-Type");
        contentLength = Integer.valueOf(response.getHeaderString("Content-Length"));
    }

    public SessionInfo(Headers editingSession) {
        editingSessionUuid = editingSession.get("X-Apicurio-EditingSessionUuid").getValue();
        contentVersion = editingSession.get("X-Apicurio-ContentVersion").getValue();
        contentType = editingSession.get("Content-Type").getValue();
        contentLength = Integer.valueOf(editingSession.get("Content-Length").getValue());
    }

    public String getEditingSessionUuid() {
        return editingSessionUuid;
    }

    public String getContentVersion() {
        return contentVersion;
    }

    public String getContentType() {
        return contentType;
    }

    public Integer getContentLength() {
        return contentLength;
    }

    @Override
    public String toString() {
        return "SessionInfo{" +
                "editingSessionUuid='" + editingSessionUuid + '\'' +
                ", contentVersion='" + contentVersion + '\'' +
                ", contentType='" + contentType + '\'' +
                ", contentLength=" + contentLength +
                '}';
    }
}
