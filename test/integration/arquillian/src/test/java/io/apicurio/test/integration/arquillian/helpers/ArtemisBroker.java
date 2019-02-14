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

import java.io.BufferedReader;
import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.concurrent.CountDownLatch;

import io.apicurio.test.integration.arquillian.IntegrationTestProperties;

/**
 * Starts up the Artemis broker instance that will be used by the Apicurio JMS editing integration test.
 * This should probably be replaced by something controlled by Arquillian.  But I couldn't immediately
 * figure out how to get Arquillian to start up an Artemis broker instance.
 * @author eric.wittmann@gmail.com
 */
public class ArtemisBroker {

    private Process process = null;

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

        process = Runtime.getRuntime().exec(cmdArray);
        InputStream is = process.getInputStream();
        BufferedReader reader = new BufferedReader(new InputStreamReader(is));
        final CountDownLatch latch = new CountDownLatch(1);
        Thread t = new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    String line = null;
                    while (process.isAlive()) {
                        line = reader.readLine();
                        if (line != null) {
                            System.out.println("Artemis>> " + line);
                        }
                        if (line != null && line.contains("Server is now live")) {
                            latch.countDown();
                            return;
                        }
                    }

                    // only happens on startup error
                    InputStream is = process.getErrorStream();
                    BufferedReader reader = new BufferedReader(new InputStreamReader(is));
                    line = reader.readLine();
                    System.out.println("Artemis>> " + line);
                    line = reader.readLine();
                    System.out.println("Artemis>> " + line);
                    line = reader.readLine();
                    System.out.println("Artemis>> " + line);

                    System.out.println("Artemis Server process exited with: " + process.exitValue());
                    latch.countDown();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        });
        t.start();
        latch.await();
        System.out.println("Artemis server started!");
        System.out.println("----------------------------------");
    }
    
    /**
     * Determine the location of the log manager JAR within the given Artemis home directory.
     * @param artemisHome
     */
    private String findLogManagerJar(File artemisHome) {
        File libDir = new File(artemisHome, "lib");
        return libDir.listFiles(new FilenameFilter() {
            @Override
            public boolean accept(File dir, String name) {
                return name.startsWith("jboss-logmanager");
            }
        })[0].getAbsolutePath();
    }

    public void stop() {
        if (this.process != null) {
            try { Thread.sleep(3000); } catch (InterruptedException e) { e.printStackTrace(); }
            process.destroyForcibly();
            System.out.println("Artemis server stopped.");
        }
    }

}
