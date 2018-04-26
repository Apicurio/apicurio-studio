/*
 * Copyright 2018 JBoss Inc
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

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Used to create a ScriptEngine with all of the OAI code pre-loaded into it.
 * @author eric.wittmann@gmail.com
 */
public class OaiScriptEngineFactory {

    private static Logger logger = LoggerFactory.getLogger(OaiScriptEngineFactory.class);

    public static void debug(String message) {
        logger.debug(message);
    }
    public static void trace(String message) {
        logger.trace(message);
    }
    public static void error(Object error) {
        logger.error(error.toString());
    }

    public static final ScriptEngine createScriptEngine(URL ... jsUrls) throws Exception {
        logger.debug("Creating and initializing a Nashorn script engine.");
        long start = System.currentTimeMillis();
        ScriptEngine engine = new ScriptEngineManager().getEngineByName("nashorn");
        if (engine == null) {
            throw new Exception("Failed to create a Nashorn script engine!");
        }
        
        URL consoleJsUrl = OaiScriptEngineFactory.class.getClassLoader().getResource("js-lib/core-console.js");
        if (consoleJsUrl == null) { throw new Exception("Failed to load script: core-console.js"); }
        URL oaiJsUrl = OaiScriptEngineFactory.class.getClassLoader().getResource("js-lib/OAI.umd.js");
        if (oaiJsUrl == null) { throw new Exception("Failed to load script: OAI.umd.js"); }
        URL oaiCommandsJsUrl = OaiScriptEngineFactory.class.getClassLoader().getResource("js-lib/OAI-commands.umd.js");
        if (oaiCommandsJsUrl == null) { throw new Exception("Failed to load script: OAI-commands.umd.js"); }

        // Load the JS libraries into the engine
        engine.eval(IOUtils.toString(consoleJsUrl));
        engine.eval(IOUtils.toString(oaiJsUrl));
        engine.eval(IOUtils.toString(oaiCommandsJsUrl));
        for (URL jsUrl : jsUrls) {
            engine.eval(IOUtils.toString(jsUrl));
        }

        long end = System.currentTimeMillis();
        logger.debug("Initialized a Nashorn script engine in {} millis.", end - start);
        
        return engine;

    }

}
