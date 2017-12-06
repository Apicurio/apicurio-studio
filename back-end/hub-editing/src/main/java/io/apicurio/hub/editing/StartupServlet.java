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

package io.apicurio.hub.editing;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.servlet.http.HttpServlet;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.apicurio.hub.core.Version;

/**
 * A simple startup servlet used to report the server version.
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class StartupServlet extends HttpServlet {

    private static final long serialVersionUID = -1346569685620564962L;
    
    private static Logger logger = LoggerFactory.getLogger(StartupServlet.class);

    @Inject
    private Version version;

    @PostConstruct
    public void postConstruct() {
        logger.info("------------------------------------------------");
        logger.info("Starting up Apicurio Editing API");
        logger.info("\tVersion:  " + version.getVersionString());
        logger.info("\tBuilt On: " + version.getVersionDate().toString());
        logger.info("\tBuild:    " + version.getVersionInfo());
        ScriptEngine engine = new ScriptEngineManager().getEngineByName("nashorn");
        logger.info("\tNashorn:  " + (engine != null));
        boolean hasClass = false;
        try {
            Class<?> c = Class.forName("jdk.nashorn.api.scripting.NashornScriptEngineFactory");
            hasClass = c != null;
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        logger.info("\tNashorn Class:  " + hasClass);
        logger.info("------------------------------------------------");
    }

}
