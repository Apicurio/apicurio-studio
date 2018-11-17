///*
// * Copyright 2017 JBoss Inc
// *
// * Licensed under the Apache License, Version 2.0 (the "License");
// * you may not use this file except in compliance with the License.
// * You may obtain a copy of the License at
// *
// *      http://www.apache.org/licenses/LICENSE-2.0
// *
// * Unless required by applicable law or agreed to in writing, software
// * distributed under the License is distributed on an "AS IS" BASIS,
// * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// * See the License for the specific language governing permissions and
// * limitations under the License.
// */
//
//package io.apicurio.hub.editing;
//
//import com.fasterxml.jackson.databind.JsonNode;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import io.apicurio.hub.core.editing.operationprocessors.ApicurioOperationProcessor;
//
//import javax.inject.Inject;
//import javax.websocket.DecodeException;
//import javax.websocket.Decoder;
//import javax.websocket.EndpointConfig;
//import java.io.IOException;
//
///**
// * @author eric.wittmann@gmail.com
// */
//public class MessageDecoder2 implements Decoder.Text<JsonNode> {
//
//    private static final ObjectMapper mapper = new ObjectMapper();
//
//    @Inject
//    private ApicurioOperationProcessor
//
//    @Override
//    public void init(EndpointConfig ec) {
//    }
//
//    @Override
//    public void destroy() {
//    }
//
//    @Override
//    public JsonNode decode(String value) throws DecodeException {
//        try {
//
//            //mapper.readV
//
//
//            JsonNode tree = mapper.readTree(value);
//
//            tree.
//
//            String typeName = tree.get("type").asText(); // TODO checks for presence
//
//
//
//            return mapper.readTree(value);
//        } catch (IOException e) {
//            throw new DecodeException(value, e.getMessage());
//        }
//    }
//
//    @Override
//    public boolean willDecode(String string) {
//        return true;
//    }
//}
