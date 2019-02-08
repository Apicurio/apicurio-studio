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
import io.apicurio.test.integration.arquillian.helpers.TestOperationHelper;

/**
 * Allows assertion between expected and actual payloads (e.g. expected command vs actual command).
 *
 * Remember to add new processors to {@link TestOperationHelper} if
 * you want it to be made available.
 *
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public interface ITestOperationProcessor {
    /**
     * Assert that the given operation is equal to that actually received.
     * A {@link ITestOperationProcessor} can take an arbitrary approach to equality (e.g. certain fields
     * may be ignored as they are either random, or database generated).
     *
     * The <tt>actual</tt> payload is unmarshalled into JSON, with the corresponding
     * {@link ITestOperationProcessor} looked up via {@link BaseOperation#getType()}.
     *
     * @param expected expected operation
     * @param actual actual operation
     */
    void assertEquals(BaseOperation expected, String actual);

    /**
     * Unique operation name
     */
    String getOperationName();

    /**
     * Class this process unmarshalls
     */
    Class<? extends BaseOperation> unmarshallClass();

    // TODO: Could add method to ensure sequences via contentVersion? Could be interesting.
}
