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

package io.apicurio.hub.api.codegen.js;

import java.net.URL;

import javax.script.Invocable;
import javax.script.ScriptEngine;

import org.apache.commons.pool2.BasePooledObjectFactory;
import org.apache.commons.pool2.ObjectPool;
import org.apache.commons.pool2.PooledObject;
import org.apache.commons.pool2.impl.DefaultPooledObject;
import org.apache.commons.pool2.impl.GenericObjectPool;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.apicurio.hub.api.codegen.beans.CodegenInfo;
import io.apicurio.hub.core.js.OaiScriptEngineFactory;

/**
 * @author eric.wittmann@gmail.com
 */
public class CodegenExecutor {

    private static Logger logger = LoggerFactory.getLogger(CodegenExecutor.class);
    private static ObjectPool<ScriptEngine> enginePool;
    static {
        enginePool = new GenericObjectPool<>(new BasePooledObjectFactory<ScriptEngine>() {

            @Override
            public ScriptEngine create() throws Exception {
                URL codegenJsUrl = CodegenExecutor.class.getClassLoader().getResource("js-lib/OAI-codegen.umd.js");
                URL libraryJsUrl = CodegenExecutor.class.getClassLoader().getResource("js-lib/codegen-library.js");
                
                if (codegenJsUrl == null) { throw new Exception("Failed to load script: OAI-codegen.umd.js"); }
                if (libraryJsUrl == null) { throw new Exception("Failed to load script: codegen-library.js"); }
                
                return OaiScriptEngineFactory.createScriptEngine(codegenJsUrl, libraryJsUrl);
            }

            @Override
            public PooledObject<ScriptEngine> wrap(ScriptEngine obj) {
                return new DefaultPooledObject<ScriptEngine>(obj);
            }
        });
    }

    /**
     * Executes the codegen logic on the given OAI document, returning a {@link CodegenInfo} object for it.
     * @param oaiDocument
     * @param javaPackage
     * @throws Exception
     */
    public static String executeCodegen(String oaiDocument, String javaPackage) throws Exception {
        ScriptEngine engine = null;
        try {
            engine = enginePool.borrowObject();
            final Invocable invocable = (Invocable) engine;
            
            return invocable.invokeFunction("executeCodegen", oaiDocument, javaPackage).toString();
        } catch (Exception e) {
            logger.error("Error executing codegen.", e);
            throw new Exception(e);
        } finally {
            if (engine != null) {
                try { enginePool.returnObject(engine); } catch (Exception e) {}
            }
        }
    }

}
