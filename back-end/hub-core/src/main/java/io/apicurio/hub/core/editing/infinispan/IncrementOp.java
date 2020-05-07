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

/**
 * @author Ales Justin
 */
public class IncrementOp<K> implements SerializableBiFunction<K, Integer, Integer> {
    private static final long serialVersionUID = 1L;

    private int increment;

    public IncrementOp(int increment) {
        this.increment = increment;
    }

    @Override
    public Integer apply(K key, Integer value) {
        return (value == null) ? increment : value + increment;
    }
}
