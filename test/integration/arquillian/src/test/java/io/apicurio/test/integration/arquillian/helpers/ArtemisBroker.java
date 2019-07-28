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

import java.io.File;

import io.apicurio.test.integration.common.IntegrationTestProperties;
import io.apicurio.test.integration.common.ProcessExecutor;

/**
 * Starts up the Artemis broker instance that will be used by the Apicurio JMS editing integration test.
 * This should probably be replaced by something controlled by Arquillian.  But I couldn't immediately
 * figure out how to get Arquillian to start up an Artemis broker instance.
 * @author eric.wittmann@gmail.com
 */
public class ArtemisBroker {

    private ProcessExecutor pe = new ProcessExecutor();

    /**
     * Called to start up the Artemis broker instance.
     * @throws Exception
     */
    public void start() throws Exception {
        IntegrationTestProperties testProperties = new IntegrationTestProperties();

        System.out.println("----------------------------------");
        System.out.println("Starting Artemis Broker Instance");
        System.out.println("Artemis version: " + testProperties.get("artemis.version"));

        File workDir = new File(testProperties.get("artemis.instance.dir"));
        File artemisHome = new File(testProperties.get("artemis.appserver.dir"));
        String classpath = new File(artemisHome, "lib/artemis-boot.jar").getAbsolutePath();
        String logman = findLogManagerJar(artemisHome);
        String loginConfig = new File(workDir, "etc/login.config").getAbsolutePath();
        String policyLocation = new File(workDir, "etc/jolokia-access.xml").toURI().toURL().toString();
        String dataDir = new File(workDir, "data").getAbsolutePath();
        String etcDir = new File(workDir, "etc").getAbsolutePath();
        String loggingConfig = new File(workDir, "etc/logging.properties").toURI().toURL().toString();
        String [] cmdArray = {
                "java",
                "-XX:+PrintClassHistogram",
                "-XX:+UseG1GC",
                "-XX:+AggressiveOpts",
                "-Xms256M",
                "-Xmx512M",
                "-Xbootclasspath/a:" + logman,
                "-Djava.security.auth.login.config=" + loginConfig,
                "-Dhawtio.offline=true",
                "-Dhawtio.realm=activemq",
                "-Dhawtio.role=guest",
                "-Dhawtio.rolePrincipalClasses=org.apache.activemq.artemis.spi.core.security.jaas.RolePrincipal",
                "-Djolokia.policyLocation=" + policyLocation,
                "-Dartemis.instance=" + workDir.getAbsolutePath(),
                "-classpath", classpath,
                "-Dartemis.home=" + artemisHome.getAbsolutePath(),
                "-Ddata.dir=" + dataDir,
                "-Dartemis.instance.etc=" + etcDir,
                "-Djava.util.logging.manager=org.jboss.logmanager.LogManager",
                "-Dlogging.configuration=" + loggingConfig,
                "org.apache.activemq.artemis.boot.Artemis",
                "run"
        };

        pe.start(cmdArray, s -> s.contains("Server is now live"));

        System.out.println("Artemis server started!");
        System.out.println("----------------------------------");
    }
    
    /**
     * Determine the location of the log manager JAR within the given Artemis home directory.
     * @param artemisHome
     */
    private String findLogManagerJar(File artemisHome) {
        File libDir = new File(artemisHome, "lib");
        return libDir.listFiles((dir, name) -> name.startsWith("jboss-logmanager"))[0].getAbsolutePath();
    }

    public void stop() {
        pe.stop();
    }

}
