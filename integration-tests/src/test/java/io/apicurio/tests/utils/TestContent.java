/*
 * Copyright 2024 Red Hat Inc
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

package io.apicurio.tests.utils;

/**
 * @author eric.wittmann@gmail.com
 */
public class TestContent {
    
    public static final String OPENAPI_CONTENT = "{\n"
            + "    \"openapi\": \"3.0.2\",\n"
            + "    \"info\": {\n"
            + "        \"title\": \"Empty Test\",\n"
            + "        \"version\": \"1.0.1\"\n"
            + "    },\n"
            + "    \"paths\": {\n"
            + "        \"/hello\": {\n"
            + "            \"get\": {\n"
            + "                \"responses\": {\n"
            + "                    \"200\": {\n"
            + "                        \"content\": {\n"
            + "                            \"application/json\": {\n"
            + "                                \"schema\": {\n"
            + "                                    \"type\": \"string\"\n"
            + "                                }\n"
            + "                            }\n"
            + "                        },\n"
            + "                        \"description\": \"Success.\"\n"
            + "                    }\n"
            + "                }\n"
            + "            }\n"
            + "        }\n"
            + "    }\n"
            + "}";

}
