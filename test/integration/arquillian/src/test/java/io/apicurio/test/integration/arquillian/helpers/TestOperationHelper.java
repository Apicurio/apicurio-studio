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
package io.apicurio.test.integration.arquillian.helpers;

import java.util.LinkedHashMap;
import java.util.Map;

import io.apicurio.hub.core.editing.ops.BaseOperation;
import io.apicurio.hub.core.util.JsonUtil;
import io.apicurio.test.integration.arquillian.testprocessors.ITestOperationProcessor;
import io.apicurio.test.integration.arquillian.testprocessors.TestAckOperationProcessor;
import io.apicurio.test.integration.arquillian.testprocessors.TestCommandOperationProcessor;
import io.apicurio.test.integration.arquillian.testprocessors.TestJoinOperationProcessor;
import io.apicurio.test.integration.arquillian.testprocessors.TestLeaveOperationProcessor;
import io.apicurio.test.integration.arquillian.testprocessors.TestRedoOperationProcessor;
import io.apicurio.test.integration.arquillian.testprocessors.TestSelectionOperationProcessor;
import io.apicurio.test.integration.arquillian.testprocessors.TestUndoOperationProcessor;

/**
 * Look up a test processor in order to compare expected with actual payloads.
 *
 * Add your processor to addProcessors
 *
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public class TestOperationHelper {
    
    public static final TestOperationHelper INSTANCE = new TestOperationHelper();
    private static final Map<String, ITestOperationProcessor> processorMap = new LinkedHashMap<>();

    // As this is not necessarily in a CDI environment, we use the manual approach...
    static {
        INSTANCE.addProcessors();
    }

    private void addProcessors() {
        add(TestAckOperationProcessor.class);
        add(TestCommandOperationProcessor.class);
        add(TestSelectionOperationProcessor.class);
        add(TestJoinOperationProcessor.class);
        add(TestLeaveOperationProcessor.class);
        add(TestUndoOperationProcessor.class);
        add(TestRedoOperationProcessor.class);
    }

    private static void add(Class<? extends ITestOperationProcessor> clazz) {
        try {
            @SuppressWarnings("deprecation")
            ITestOperationProcessor instance = clazz.newInstance();
            String name = instance.getOperationName();
            processorMap.put(name, instance);
        } catch (InstantiationException | IllegalAccessException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Add a processor to the operation helper.
     *
     * You may access this via the static INSTANCE.
     *
     * @param processor the new processor
     */
    public void addProcessor(Class<ITestOperationProcessor> processor) {
        add(processor);
    }

    /**
     * Assert that expected and actual are equivalent.
     * @param expect expected operation
     * @param actual actual operation as JSON
     */
    public void assertEquals(BaseOperation expect, String actual) {
        String type = JsonUtil.toJsonTree(actual).get("type").asText();
        ITestOperationProcessor processor = processorMap.get(type);
        if(processor == null) {
            throw new IllegalArgumentException("Test processor for operation \"" + type + "\" did not exist " +
                        "You probably need to add an extra ITestOperationProcessor.");
        }
        processor.assertEquals(expect, actual);
    }
}
