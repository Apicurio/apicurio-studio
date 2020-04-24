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

package io.apicurio.hub.editing;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.websocket.CloseReason;
import javax.websocket.Session;

import org.apache.http.NameValuePair;
import org.apache.http.client.utils.URLEncodedUtils;

import io.apicurio.hub.core.editing.ISessionContext;
import io.apicurio.hub.core.util.JsonUtil;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public class WebsocketSessionContext implements ISessionContext {

    private final Session session;
    private Map<String, String> queryParams;

    /**
     * Constructor.
     * @param session
     */
    public WebsocketSessionContext(Session session) {
        this.session = session;
    }

    /**
     * @see io.apicurio.hub.core.editing.ISessionContext#getPathParameters()
     */
    @Override
    public Map<String, String> getPathParameters() {
        return session.getPathParameters();
    }
    
    /**
     * @see io.apicurio.hub.core.editing.ISessionContext#getQueryParam(java.lang.String)
     */
    @Override
    public String getQueryParam(String paramName) {
        return this.getQueryParams().get(paramName);
    }

    /**
     * @see io.apicurio.hub.core.editing.ISessionContext#getId()
     */
    @Override
    public String getId() {
        return session.getId();
    }

    /**
     * Parse and return the session's query parameters.
     */
    private Map<String, String> getQueryParams() {
        if (this.queryParams == null) {
            this.queryParams = parseQueryString(session.getQueryString());
        }
        return this.queryParams;
    }
    
    /**
     * Parses the query string into a map of params.
     * @param queryString
     */
    protected static Map<String, String> parseQueryString(String queryString) {
        Map<String, String> parsed = new HashMap<>();
        List<NameValuePair> list = URLEncodedUtils.parse(queryString, StandardCharsets.UTF_8);
        for (NameValuePair nameValuePair : list) {
            parsed.put(nameValuePair.getName(), nameValuePair.getValue());
        }
        return parsed;
    }

    /**
     * @see io.apicurio.hub.core.editing.ISessionContext#sendAsText(java.lang.String)
     */
    @Override
    public void sendAsText(String serialized) throws IOException {
        session.getAsyncRemote().sendText(serialized);
    }

    /**
     * @see io.apicurio.hub.core.editing.ISessionContext#sendAsText(java.lang.Object)
     */
    @Override
    public <T> void sendAsText(T obj) throws IOException {
        session.getAsyncRemote().sendText(JsonUtil.toJson(obj));
    }

    /**
     * @see io.apicurio.hub.core.editing.ISessionContext#close(javax.websocket.CloseReason)
     */
    @Override
    public void close(CloseReason closeReason) throws IOException {
        session.close();
    }
}
