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
package io.apicurio.test.integration.arquillian.testprocessors;

import org.junit.Assert;

import io.apicurio.hub.core.editing.ops.BaseOperation;
import io.apicurio.hub.core.editing.ops.JoinLeaveOperation;
import io.apicurio.hub.core.util.JsonUtil;

/**
 * Test a leave operation
 *
 * @see JoinLeaveOperation
 */
public class TestLeaveOperationProcessor implements ITestOperationProcessor {
    @Override
    public void assertEquals(BaseOperation expectedOp, String actualRaw) {
        JoinLeaveOperation expected = (JoinLeaveOperation) expectedOp;
        JoinLeaveOperation actual = JsonUtil.fromJson(actualRaw, unmarshallClass());

        Assert.assertEquals(expected.getUser(), actual.getUser());
        //Assert.assertEquals(expected.getId(), actual.getId());
    }

    @Override
    public String getOperationName() {
        return "leave";
    }

    @Override
    public Class<JoinLeaveOperation> unmarshallClass() {
        return JoinLeaveOperation.class;
    }
}
