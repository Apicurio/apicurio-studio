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
import io.apicurio.hub.core.editing.ops.VersionedAck;
import io.apicurio.hub.core.util.JsonUtil;
import org.junit.Assert;

/**
 * Test an ack operation.
 *
 * @see VersionedAck
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public class TestAckOperationProcessor implements ITestOperationProcessor {
    @Override
    public void assertEquals(BaseOperation expectedOp, String actualRaw) {
        VersionedAck expected = (VersionedAck) expectedOp;
        VersionedAck actual = JsonUtil.fromJson(actualRaw, unmarshallClass());

        Assert.assertEquals(expected.getCommandId(), actual.getCommandId());
        Assert.assertEquals(expected.getType(), actual.getType());
        Assert.assertEquals(expected.getAckType(), actual.getAckType());
    }

    @Override
    public String getOperationName() {
        return "ack";
    }

    @Override
    public Class<VersionedAck> unmarshallClass() {
        return VersionedAck.class;
    }
}
