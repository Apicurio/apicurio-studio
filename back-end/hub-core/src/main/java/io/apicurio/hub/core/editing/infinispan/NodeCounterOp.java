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

package io.apicurio.hub.core.editing.infinispan;

import org.infinispan.util.function.SerializableBiFunction;

import java.util.HashMap;
import java.util.Map;
import java.util.function.BiFunction;

/**
 * @author Ales Justin
 */
public class NodeCounterOp<K> implements SerializableBiFunction<K, Map<String, Integer>, Map<String, Integer>> {
    private static final long serialVersionUID = 1L;

    private int increment;
    private String nodeId;

    public NodeCounterOp(int increment, String nodeId) {
        this.increment = increment;
        this.nodeId = nodeId;
    }

    @Override
    public Map<String, Integer> apply(K k, Map<String, Integer> value) {
        if (value == null) {
            value = new HashMap<>();
        }
        BiFunction<String, Integer, Integer> fn = new IncrementOp<>(increment);
        value.compute(nodeId, fn);
        return value;
    }
}
