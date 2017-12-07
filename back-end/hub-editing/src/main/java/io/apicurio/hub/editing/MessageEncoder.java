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

package io.apicurio.hub.editing;

import javax.websocket.EncodeException;
import javax.websocket.Encoder;
import javax.websocket.EndpointConfig;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * @author eric.wittmann@gmail.com
 */
public class MessageEncoder implements Encoder.Text<JsonNode> {

    private static final ObjectMapper mapper = new ObjectMapper();

    @Override
    public void init(EndpointConfig ec) {
    }

    @Override
    public void destroy() {
    }

    @Override
    public String encode(JsonNode msg) throws EncodeException {
        try {
            return mapper.writeValueAsString(msg);
        } catch (JsonProcessingException e) {
            throw new EncodeException(msg, e.getMessage());
        }
    }

}
