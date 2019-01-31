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
package io.apicurio.hub.core.editing;

import javax.websocket.CloseReason;
import javax.websocket.Session;
import java.io.IOException;
import java.util.Map;

/**
 * Wraps a websockets {@link Session}.
 *
 * @see Session
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public interface ApicurioSessionContext {

    /**
     * @see Session#getPathParameters()
     */
    Map<String, String> getPathParameters();

    /**
     * @see Session#getQueryString() ()
     */
    String getQueryString();

    /**
     * @see Session#getId()
     */
    String getId();

    /**
     * Get WS query string as map
     */
    Map<String, String> getQueryStringMap();

    /**
     * Send string payload as text
     *
     * @param serialized serialized payload
     */
    void sendAsText(String serialized) throws IOException;

    /**
     * Send object payload as JSON
     *
     * @param obj object to be serialized as JSON
     */
    <T> void sendAsText(T obj) throws IOException;

    /**
     * @see Session#close(CloseReason)
     */
    void close(CloseReason closeReason) throws IOException;
}
