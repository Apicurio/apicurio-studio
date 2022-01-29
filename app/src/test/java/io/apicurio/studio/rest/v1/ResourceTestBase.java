/*
 * Copyright 2022 Red Hat
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

package io.apicurio.studio.rest.v1;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestInstance.Lifecycle;

import io.restassured.RestAssured;

/**
 * @author eric.wittmann@gmail.com
 */
@TestInstance(Lifecycle.PER_CLASS)
public class ResourceTestBase {

    public static final String CT_JSON = "application/json";
    protected static final String CT_PROTO = "application/x-protobuf";
    protected static final String CT_YAML = "application/x-yaml";
    protected static final String CT_XML = "application/xml";

    protected String studioApiBaseUrl;
    protected String studioV1ApiUrl;

    @BeforeAll
    protected void beforeAll() throws Exception {
        studioApiBaseUrl = "http://localhost:8081/apis";
        studioV1ApiUrl = studioApiBaseUrl + "/studio/v1";
    }

    @BeforeEach
    protected void beforeEach() throws Exception {
        setupRestAssured();
    }

    protected void setupRestAssured() {
        RestAssured.baseURI = studioApiBaseUrl;
//        RestAssured.registerParser(MediaTypes.BINARY.toString(), Parser.JSON);
    }

}
