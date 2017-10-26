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

package io.apicurio.hub.core.js;

import java.io.IOException;
import java.net.URL;
import java.util.List;

import javax.enterprise.context.ApplicationScoped;
import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
    
    private static final ThreadLocal<ScriptEngine> scriptEngine = new ThreadLocal<>();
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
        try {
            ScriptEngine engine = getScriptEngine();
            final Invocable invocable = (Invocable) engine;
            
            String [] cmdList = commands.toArray(new String[commands.size()]);
            String mutatedOaiDoc = invocable.invokeFunction("executeCommands", oaiDocument, cmdList).toString();
            
            return mutatedOaiDoc;
        } catch (NoSuchMethodException | IOException | ScriptException e) {
            throw new OaiCommandException(e);
        }

    }

    /**
     * Creates and initializes the script engine used to execute commands against
     * an OAI document.  The Nashorn script engine is not thread safe, so we will
     * create one engine per thread (using a thread local variable).
     * @throws IOException
     */
    private ScriptEngine getScriptEngine() throws IOException, ScriptException {
        ScriptEngine engine = scriptEngine.get();
        if (engine == null) {
            logger.debug("Creating and initializing a Nashorn script engine.");
            long start = System.currentTimeMillis();
            engine = new ScriptEngineManager().getEngineByName("nashorn");
            URL consoleJsUrl = OaiCommandExecutor.class.getClassLoader().getResource("js-lib/core-console.js");
            URL oaiJsUrl = OaiCommandExecutor.class.getClassLoader().getResource("js-lib/OAI.umd.js");
            URL oaiCommandsJsUrl = OaiCommandExecutor.class.getClassLoader().getResource("js-lib/OAI-commands.umd.js");
            URL libraryJsUrl = OaiCommandExecutor.class.getClassLoader().getResource("js-lib/core-library.js");

            // Load the JS libraries into the engine
            engine.eval(IOUtils.toString(consoleJsUrl));
            engine.eval(IOUtils.toString(oaiJsUrl));
            engine.eval(IOUtils.toString(oaiCommandsJsUrl));
            engine.eval(IOUtils.toString(libraryJsUrl));
            long end = System.currentTimeMillis();
            logger.debug("Initialized a Nashorn script engine in {} millis.", end - start);
            scriptEngine.set(engine);
       }
        return engine;
    }

}
