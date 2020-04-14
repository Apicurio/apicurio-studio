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

import io.apicurio.hub.core.util.JsonUtil;
import io.apicurio.registry.utils.kafka.SelfSerde;
import org.apache.kafka.common.errors.SerializationException;

/**
 * JSON serde
 *
 * @author Ales Justin
 */
public class JsonSerde extends SelfSerde<KafkaAction> {
    @Override
    public KafkaAction deserialize(String topic, byte[] bytes) {
        if (bytes == null)
            return null;

        try {
            return JsonUtil.fromJson(bytes, KafkaAction.class);
        } catch (Exception e) {
            throw new SerializationException(e);
        }
    }

    @Override
    public byte[] serialize(String topic, KafkaAction action) {
        return JsonUtil.toJsonBytes(action);
    }
}
