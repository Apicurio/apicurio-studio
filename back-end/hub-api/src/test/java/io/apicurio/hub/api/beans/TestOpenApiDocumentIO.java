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

package io.apicurio.hub.api.beans;

import java.net.URL;

import org.apache.commons.io.IOUtils;
import org.junit.Assert;
import org.junit.Test;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * @author eric.wittmann@gmail.com
 */
public class TestOpenApiDocumentIO {

    /**
     * Test method for {@link io.apicurio.hub.api.beans.OpenApiDocument#OpenApiDocument()}.
     */
    @Test
    public void testOpenApiDocument() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        URL contentUrl = getClass().getResource("simple-api-3.0.json");
        String content = IOUtils.toString(contentUrl);
        OpenApi3Document document = mapper.reader(OpenApi3Document.class).readValue(content);
        Assert.assertNotNull(document);
        Assert.assertEquals(2, document.getTags().length);
    }

}
