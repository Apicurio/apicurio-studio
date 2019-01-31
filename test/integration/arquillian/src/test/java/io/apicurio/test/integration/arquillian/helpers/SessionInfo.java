/*
 * Copyright 2019 JBoss Inc
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
package io.apicurio.test.integration.arquillian.helpers;

import io.restassured.http.Headers;

import javax.ws.rs.core.Response;

/**
 * Parse session information returned by {@link io.apicurio.hub.api.rest.IDesignsResource#editDesign(String)}
 *
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
