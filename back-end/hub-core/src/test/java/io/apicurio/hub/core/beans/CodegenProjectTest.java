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

package io.apicurio.hub.core.beans;

import java.util.Date;
import java.util.HashMap;

import org.junit.Assert;
import org.junit.Test;

import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * @author eric.wittmann@gmail.com
 */
public class CodegenProjectTest {

    @Test
    public void testSerialize() throws Exception {
        CodegenProject project = new CodegenProject();
        project.setId("1");
        project.setDesignId("100");
        project.setCreatedBy("user");
        project.setCreatedOn(new Date(0));
        project.setModifiedBy("user2");
        project.setModifiedOn(new Date(1000000));
        project.setType(CodegenProjectType.springBoot);
        project.setAttributes(new HashMap<>());
        project.getAttributes().put("property-1", "value1");
        project.getAttributes().put("property-2", "value2");
        project.getAttributes().put("property-3", "value3");
        
        ObjectMapper mapper = new ObjectMapper();
        String sval = mapper.writer().writeValueAsString(project);
        String expected = "{\"id\":\"1\",\"createdBy\":\"user\",\"createdOn\":0,\"modifiedBy\":\"user2\",\"modifiedOn\":1000000,\"designId\":\"100\",\"type\":\"springBoot\",\"attributes\":{\"property-1\":\"value1\",\"property-3\":\"value3\",\"property-2\":\"value2\"}}";
        Assert.assertEquals(expected, sval);
    }

}
