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

import com.fasterxml.jackson.databind.JsonNode;

import io.apicurio.hub.core.editing.ops.BaseOperation;
import io.apicurio.hub.core.editing.ops.FullCommandOperation;
import io.apicurio.hub.core.editing.ops.VersionedCommandOperation;
import io.apicurio.hub.core.util.JsonUtil;
import org.junit.Assert;

/**
 * Test a command operation.
 *
 * Test for the <tt>author</tt> field in JSON to determine whether the command
 * is a {@link FullCommandOperation}.
 *
 * @see VersionedCommandOperation
 * @see FullCommandOperation
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public class TestCommandOperationProcessor implements ITestOperationProcessor {
    @Override
    public void assertEquals(BaseOperation expectedOp, String actualRaw) {
        VersionedCommandOperation expected = (VersionedCommandOperation) expectedOp;
        VersionedCommandOperation actual;

        JsonNode tree = JsonUtil.toJsonTree(actualRaw);

        // If it's a full command, then it will include the "author" field.
        // At present, there's no simple flag to distinguish.
        if(tree.has("author")) {
            FullCommandOperation expectedFull = (FullCommandOperation) expected;
            FullCommandOperation actualFull = JsonUtil.fromJson(actualRaw, FullCommandOperation.class);
            Assert.assertEquals(expectedFull.getAuthor(), actualFull.getAuthor());
            Assert.assertEquals(expectedFull.isReverted(), actualFull.isReverted());
            actual = actualFull;
        } else {
            actual = JsonUtil.fromJson(actualRaw, VersionedCommandOperation.class);
        }

        Assert.assertEquals(expected.getCommandId(), actual.getCommandId());
        Assert.assertEquals("JSON command string did not match", expected.getCommandStr(), actual.getCommandStr());
        Assert.assertEquals(expected.getType(), actual.getType());
    }


    public void versionedCommand() {

    }

    public void fullCommand() {

    }

    @Override
    public String getOperationName() {
        return "command";
    }

    @Override
    public Class<VersionedCommandOperation> unmarshallClass() {
        return VersionedCommandOperation.class;
    }
}
