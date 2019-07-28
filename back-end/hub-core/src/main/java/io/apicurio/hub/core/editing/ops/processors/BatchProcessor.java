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

package io.apicurio.hub.core.editing.ops.processors;

import javax.inject.Inject;
import javax.inject.Singleton;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.apicurio.hub.core.editing.IEditingMetrics;
import io.apicurio.hub.core.editing.IEditingSession;
import io.apicurio.hub.core.editing.ISessionContext;
import io.apicurio.hub.core.editing.ops.BaseOperation;
import io.apicurio.hub.core.editing.ops.BatchOperation;
import io.apicurio.hub.core.editing.ops.OperationProcessorException;

/**
 * @author eric.wittmann@gmail.com
 */
@Singleton
public class BatchProcessor implements IOperationProcessor {

    private static Logger logger = LoggerFactory.getLogger(BatchProcessor.class);
    
    @Inject
    private OperationProcessorDispatcher opDispatcher;

    @Inject
    private IEditingMetrics metrics;

    /**
     * @see io.apicurio.hub.core.editing.ops.processors.IOperationProcessor#process(io.apicurio.hub.core.editing.IEditingSession, io.apicurio.hub.core.editing.ISessionContext, io.apicurio.hub.core.editing.ops.BaseOperation)
     */
    @Override
    public void process(IEditingSession editingSession, ISessionContext context, BaseOperation operation) throws OperationProcessorException {
        BatchOperation batch = (BatchOperation) operation;
        
        String designId = editingSession.getDesignId();

        this.metrics.batchCommand(designId, batch.getOperations().size());
        
        logger.debug("Processing a batch of {} operations for design: {}", batch.getOperations().size(), designId);  

        for (BaseOperation op : batch.getOperations()) {
            opDispatcher.process(editingSession, context, op);
        }
    }

    /**
     * @see io.apicurio.hub.core.editing.ops.processors.IOperationProcessor#getOperationName()
     */
    @Override
    public String getOperationName() {
        return "batch";
    }
}
