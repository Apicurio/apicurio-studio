/*
 * Copyright 2020 Red Hat
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

package io.apicurio.hub.core.editing;

import io.apicurio.hub.core.editing.events.EventAction;
import io.apicurio.hub.core.editing.kafka.JsonSerde;
import io.apicurio.hub.core.editing.ops.JoinLeaveOperation;
import io.apicurio.hub.core.editing.ops.OperationFactory;
import org.junit.Assert;
import org.junit.Test;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

/**
 * @author Ales Justin
 */
public class KafkaEditingSessionTest {

    JsonSerde serde = new JsonSerde();

    @Test
    public void testSerde() {
        String uuid = UUID.randomUUID().toString();
        testSerde(EventAction.close(uuid));
        testSerde(EventAction.rollup(uuid));
        JoinLeaveOperation join = OperationFactory.join("alesj", "foobar");
        testSerde(EventAction.sendToOthers(join, uuid));
        testSerde(EventAction.sendToList(uuid));
        testSerde(EventAction.sendToExecute(Collections.singletonList(join), uuid));
    }

    private void testSerde(EventAction original) {
        byte[] bytes = serde.serialize(null, original);
        EventAction copy = serde.deserialize(null, bytes);
        Assert.assertEquals(original.getType(), copy.getType());
        Assert.assertEquals(original.getId(), copy.getId());
        Assert.assertArrayEquals(original.getOp(), copy.getOp());

        List<JoinLeaveOperation> originalOps = original.getOps();
        List<JoinLeaveOperation> copyOps = copy.getOps();
        if (originalOps != null) {
            Assert.assertNotNull(copyOps);
            Assert.assertEquals(originalOps.size(), copyOps.size());
            for (int i = 0; i < originalOps.size(); i++) {
                JoinLeaveOperation oJLO = originalOps.get(i);
                JoinLeaveOperation cJLO = copyOps.get(i);
                Assert.assertEquals(oJLO.getId(), cJLO.getId());
                Assert.assertEquals(oJLO.getUser(), cJLO.getUser());
            }
        }
    }
}
