/*
 * Copyright 2019 Red Hat
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

package io.apicurio.hub.core.editing.ops;

import java.util.ArrayList;
import java.util.List;

/**
 * An operation that supports a batch of operations.  So this is just a collection of 
 * arbitrary other operations.
 * @author eric.wittmann@gmail.com
 */
public class BatchOperation extends BaseOperation {
    
    private List<BaseOperation> operations = new ArrayList<>();

    /**
     * @return the operations
     */
    public List<BaseOperation> getOperations() {
        return operations;
    }

    /**
     * @param operations the operations to set
     */
    public void setOperations(List<BaseOperation> operations) {
        this.operations = operations;
    }
    
}
