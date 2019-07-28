/*
 * Copyright 2017 JBoss Inc
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

package io.apicurio.hub.core.cmd;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.apicurio.datamodels.Library;
import io.apicurio.datamodels.cmd.ICommand;
import io.apicurio.datamodels.compat.JsonCompat;
import io.apicurio.datamodels.compat.MarshallCompat;
import io.apicurio.datamodels.core.models.Document;

/**
 * A service used to execute commands on an OAI document.  This executor uses 
 * Java's support for executing JavaScript code (via Nashorn) to leverage the
 * oai-ts-core and oai-ts-commands TypeScript libraries.  This libraries support
 * reading/writing (oai-ts-core) and manipulating (oai-ts-commands) OpenAPI
 * documents.
 * 
 * The executor requires an OAI document and a sequence of commands (serialized
 * as JSON).  The commands are executed in sequence against the document.  The
 * result is a (potentially) mutated OAI document as a string.
 * 
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class OaiCommandExecutor {

    private static Logger logger = LoggerFactory.getLogger(OaiCommandExecutor.class);
    
    /**
     * Executes the given sequence of commands (as serialized JSON) against the
     * given OAI document.  Returns the document after the commands have been
     * executed.
     * @param oaiDocument
     * @param commands
     */
    public String executeCommands(String oaiDocument, List<String> commands) throws OaiCommandException {
        if (commands == null || commands.isEmpty()) {
            return oaiDocument;
        }
        
        logger.info("Applying {} commands to a document.", commands.size());
        
        Document doc = Library.readDocumentFromJSONString(oaiDocument);
        commands.forEach(cmdStr -> {
            ICommand cmd = MarshallCompat.unmarshallCommand(JsonCompat.parseJSON(cmdStr));
            cmd.execute(doc);
        });
        
        return Library.writeDocumentToJSONString(doc);
    }

}
