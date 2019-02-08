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
import io.apicurio.hub.core.editing.ops.VersionedOperation;
import io.apicurio.hub.core.util.JsonUtil;

/**
 * Test an undo operation
 */
public class TestRedoOperationProcessor implements ITestOperationProcessor {
    @Override
    public void assertEquals(BaseOperation expectedOp, String actualRaw) {
        //VersionedOperation expected = (VersionedOperation) base;
        VersionedOperation actual = JsonUtil.fromJson(actualRaw, unmarshallClass());

        Assert.assertNotNull(actual.getContentVersion());
        //Assert.assertEquals(expected.getId(), actual.getId());
    }

    @Override
    public String getOperationName() {
        return "redo";
    }

    @Override
    public Class<VersionedOperation> unmarshallClass() {
        return VersionedOperation.class;
    }
}
