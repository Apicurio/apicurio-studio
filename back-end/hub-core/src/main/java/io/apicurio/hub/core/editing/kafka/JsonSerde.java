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

package io.apicurio.hub.core.editing.kafka;

import io.apicurio.hub.core.editing.events.EventAction;
import io.apicurio.hub.core.editing.events.EventActionUtil;
import io.apicurio.registry.utils.kafka.SelfSerde;

/**
 * JSON serde
 *
 * @author Ales Justin
 */
public class JsonSerde extends SelfSerde<EventAction> {
    @Override
    public EventAction deserialize(String topic, byte[] bytes) {
        return EventActionUtil.deserialize(bytes);
    }

    @Override
    public byte[] serialize(String topic, EventAction action) {
        return EventActionUtil.serialize(action);
    }
}
