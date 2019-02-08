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

import io.apicurio.hub.core.editing.ops.BaseOperation;
import io.apicurio.hub.core.editing.ops.SelectionOperation;
import io.apicurio.hub.core.util.JsonUtil;
import org.junit.Assert;

import javax.inject.Singleton;

/**
 * Test a selection operation
 *
 * @see SelectionOperation
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
@Singleton
public class TestSelectionOperationProcessor implements ITestOperationProcessor {
    @Override
    public void assertEquals(BaseOperation expectedOp, String actualRaw) {
        SelectionOperation expected = (SelectionOperation) expectedOp;
        SelectionOperation actual = JsonUtil.fromJson(actualRaw, unmarshallClass());

        Assert.assertEquals(expected.getUser(), actual.getUser());
        //Assert.assertEquals(expected.getId(), actual.getId()); TODO is this predictable in some way?
        Assert.assertEquals(expected.getSelection(), actual.getSelection());
        Assert.assertEquals(expected.getType(), actual.getType());
    }

    @Override
    public String getOperationName() {
        return "selection";
    }

    @Override
    public Class<SelectionOperation> unmarshallClass() {
        return SelectionOperation.class;
    }
}
