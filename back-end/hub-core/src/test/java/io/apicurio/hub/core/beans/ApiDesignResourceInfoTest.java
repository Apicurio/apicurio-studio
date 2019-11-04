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

package io.apicurio.hub.core.beans;

import java.nio.charset.Charset;
import java.util.Collections;

import org.apache.commons.io.IOUtils;
import org.junit.Assert;
import org.junit.Test;

/**
 * @author eric.wittmann@gmail.com
 */
public class ApiDesignResourceInfoTest {

    /**
     * Test method for {@link io.apicurio.hub.core.beans.ApiDesignResourceInfo#fromContent(java.lang.String)}.
     */
    @Test
    public void testFromContent_Empty() throws Exception {
        ApiDesignResourceInfo info = ApiDesignResourceInfo.fromContent("{}");
        Assert.assertNull(info);
    }

    /**
     * Test method for {@link io.apicurio.hub.core.beans.ApiDesignResourceInfo#fromContent(java.lang.String)}.
     */
    @Test
    public void testFromContent_30_Json() throws Exception {
        String content = IOUtils.toString(ApiDesignResourceInfoTest.class.getResourceAsStream("ApiDesignResourceInfoTest_3.0.json"), Charset.forName("UTF-8"));
        ApiDesignResourceInfo info = ApiDesignResourceInfo.fromContent(content);
        Assert.assertNotNull(info);
        Assert.assertEquals(FormatType.JSON, info.getFormat());
        Assert.assertEquals("Simple OAI 3.0.0 API", info.getName());
        Assert.assertEquals("A simple API using OpenAPI 3.0.0.", info.getDescription());
        Assert.assertEquals(Collections.singleton("baz"), info.getTags());
    }

    /**
     * Test method for {@link io.apicurio.hub.core.beans.ApiDesignResourceInfo#fromContent(java.lang.String)}.
     */
    @Test
    public void testFromContent_30_Yaml() throws Exception {
        String content = IOUtils.toString(ApiDesignResourceInfoTest.class.getResourceAsStream("ApiDesignResourceInfoTest_3.0.yaml"), Charset.forName("UTF-8"));
        ApiDesignResourceInfo info = ApiDesignResourceInfo.fromContent(content);
        Assert.assertNotNull(info);
        Assert.assertEquals(FormatType.YAML, info.getFormat());
        Assert.assertEquals("Simple OAI 3.0.0 API", info.getName());
        Assert.assertEquals("A simple API using OpenAPI 3.0.0.", info.getDescription());
        Assert.assertEquals(Collections.singleton("foo"), info.getTags());
    }

    /**
     * Test method for {@link io.apicurio.hub.core.beans.ApiDesignResourceInfo#fromContent(java.lang.String)}.
     */
    @Test
    public void testFromContent_20_Json() throws Exception {
        String content = IOUtils.toString(ApiDesignResourceInfoTest.class.getResourceAsStream("ApiDesignResourceInfoTest_2.0.json"), Charset.forName("UTF-8"));
        ApiDesignResourceInfo info = ApiDesignResourceInfo.fromContent(content);
        Assert.assertNotNull(info);
        Assert.assertEquals(FormatType.JSON, info.getFormat());
        Assert.assertEquals("Rate Limiter API", info.getName());
        Assert.assertEquals("A REST API used by clients to access the standalone Rate Limiter micro-service.", info.getDescription());
        Assert.assertEquals(Collections.emptySet(), info.getTags());
    }

    /**
     * Test method for {@link io.apicurio.hub.core.beans.ApiDesignResourceInfo#fromContent(java.lang.String)}.
     */
    @Test
    public void testFromContent_20_Yaml() throws Exception {
        String content = IOUtils.toString(ApiDesignResourceInfoTest.class.getResourceAsStream("ApiDesignResourceInfoTest_2.0.yaml"), Charset.forName("UTF-8"));
        ApiDesignResourceInfo info = ApiDesignResourceInfo.fromContent(content);
        Assert.assertNotNull(info);
        Assert.assertEquals(FormatType.YAML, info.getFormat());
        Assert.assertEquals("Rate Limiter API", info.getName());
        Assert.assertEquals("A REST API used by clients to access the standalone Rate Limiter micro-service.", info.getDescription());
        Assert.assertEquals(Collections.emptySet(), info.getTags());
    }

    /**
     * Test method for {@link io.apicurio.hub.core.beans.ApiDesignResourceInfo#fromContent(java.lang.String)}.
     */
    @Test
    public void testFromContent_InvalidContent() throws Exception {
        String content = IOUtils.toString(ApiDesignResourceInfoTest.class.getResourceAsStream("ApiDesignResourceInfoTest_Invalid.txt"), Charset.forName("UTF-8"));
        ApiDesignResourceInfo info = ApiDesignResourceInfo.fromContent(content);
        Assert.assertNull(info);
    }

}
