/*
 * Copyright 2019 Red Hat
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

package io.apicurio.hub.api.rest.impl;

import java.io.IOException;
import java.util.List;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import io.apicurio.hub.api.beans.ValidationError;
import io.apicurio.hub.api.rest.IUtilsResource;

/**
 * @author eric.wittmann@gmail.com
 */
public class UtilsResourceTest {
    
    private IUtilsResource resource;

    @Before
    public void setUp() {
        resource = new UtilsResource();
    }
    
    @After
    public void tearDown() throws Exception {
    }
    
    @Test
    public void testValidation_Empty() throws IOException {
        String apiContent = "{\r\n" + 
                "    \"openapi\": \"3.0.2\",\r\n" + 
                "    \"info\": {\r\n" + 
                "        \"title\": \"Empty API\",\r\n" + 
                "        \"version\": \"1.0.0\"\r\n" + 
                "    }\r\n" + 
                "}";
        List<ValidationError> problems = resource.validation(apiContent);
        Assert.assertFalse(problems.isEmpty());
        Assert.assertEquals(1, problems.size());
        Assert.assertEquals("API is missing the 'paths' property.", problems.get(0).message);
        
        apiContent = "openapi: 3.0.2\r\n" + 
                "info:\r\n" + 
                "    title: Empty API\r\n" + 
                "    version: 1.0.0\r\n" + 
                "";
        problems = resource.validation(apiContent);
        Assert.assertFalse(problems.isEmpty());
        Assert.assertEquals(1, problems.size());
        Assert.assertEquals("API is missing the 'paths' property.", problems.get(0).message);
    }

}
