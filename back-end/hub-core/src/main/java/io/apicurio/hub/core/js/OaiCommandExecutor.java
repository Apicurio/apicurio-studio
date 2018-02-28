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

import java.net.URL;
import java.util.List;

import javax.enterprise.context.ApplicationScoped;
import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;

import org.apache.commons.io.IOUtils;
import org.apache.commons.pool2.BasePooledObjectFactory;
import org.apache.commons.pool2.ObjectPool;
import org.apache.commons.pool2.PooledObject;
import org.apache.commons.pool2.impl.DefaultPooledObject;
import org.apache.commons.pool2.impl.GenericObjectPool;
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
    
    private static Logger logger = LoggerFactory.getLogger(OaiCommandExecutor.class);
    private static ObjectPool<ScriptEngine> enginePool;
    static {
        enginePool = new GenericObjectPool<>(new BasePooledObjectFactory<ScriptEngine>() {

            @Override
            public ScriptEngine create() throws Exception {
                logger.debug("Creating and initializing a Nashorn script engine.");
                long start = System.currentTimeMillis();
                ScriptEngine engine = new ScriptEngineManager().getEngineByName("nashorn");
                if (engine == null) {
                    throw new Exception("Failed to create a Nashorn script engine!");
                }
                
                URL consoleJsUrl = OaiCommandExecutor.class.getClassLoader().getResource("js-lib/core-console.js");
                if (consoleJsUrl == null) { throw new Exception("Failed to load script: core-console.js"); }
                URL oaiJsUrl = OaiCommandExecutor.class.getClassLoader().getResource("js-lib/OAI.umd.js");
                if (oaiJsUrl == null) { throw new Exception("Failed to load script: OAI.umd.js"); }
                URL oaiCommandsJsUrl = OaiCommandExecutor.class.getClassLoader().getResource("js-lib/OAI-commands.umd.js");
                if (oaiCommandsJsUrl == null) { throw new Exception("Failed to load script: OAI-commands.umd.js"); }
                URL libraryJsUrl = OaiCommandExecutor.class.getClassLoader().getResource("js-lib/core-library.js");
                if (libraryJsUrl == null) { throw new Exception("Failed to load script: core-library.js"); }

                // Load the JS libraries into the engine
                engine.eval(IOUtils.toString(consoleJsUrl));
                engine.eval(IOUtils.toString(oaiJsUrl));
                engine.eval(IOUtils.toString(oaiCommandsJsUrl));
                engine.eval(IOUtils.toString(libraryJsUrl));
                long end = System.currentTimeMillis();
                logger.debug("Initialized a Nashorn script engine in {} millis.", end - start);
                
                return engine;
            }

            @Override
            public PooledObject<ScriptEngine> wrap(ScriptEngine obj) {
                return new DefaultPooledObject<ScriptEngine>(obj);
            }
        });
    }
    
    public static void debug(String message) {
        logger.debug(message);
    }
    public static void trace(String message) {
        logger.trace(message);
    }
    public static void error(Object error) {
        logger.error(error.toString());
    }

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
        ScriptEngine engine = null;
        try {
            engine = enginePool.borrowObject();
            final Invocable invocable = (Invocable) engine;
            
            String [] cmdList = commands.toArray(new String[commands.size()]);
            String mutatedOaiDoc = invocable.invokeFunction("executeCommands", oaiDocument, cmdList).toString();
            
            return mutatedOaiDoc;
        } catch (Exception e) {
            logger.error("Error executing commands.", e);
            throw new OaiCommandException(e);
        } finally {
            if (engine != null) {
                try { enginePool.returnObject(engine); } catch (Exception e) {}
            }
        }
    }

}
