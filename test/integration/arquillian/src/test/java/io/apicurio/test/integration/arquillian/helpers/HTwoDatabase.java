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
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.concurrent.CountDownLatch;

import io.apicurio.test.integration.common.IntegrationTestProperties;

/**
 * Simple class that starts up an in-memory H2 database that can then be shared by
 * both of the nodes in the Apicurio editing integration test.
 * @author eric.wittmann@gmail.com
 */
public class HTwoDatabase {
    
    private Process process = null;
    
    /**
     * Called to start up the H2 database.
     * @throws Exception
     */
    public void start() throws Exception {
        IntegrationTestProperties testProperties = new IntegrationTestProperties();

        System.out.println("----------------------------------");
        System.out.println("Starting H2 server");
        System.out.println("H2 version: " + testProperties.get("h2.version"));
        
        String jar = testProperties.get("h2.install.dir") + "/h2-" + testProperties.get("h2.version") + ".jar";
        String [] cmdArray = {
                "java",
                "-jar",
                jar,
                "-tcpAllowOthers",
                "-tcp"
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
                            System.out.println("H2DB>> " + line);
                        }
                        if (line != null && line.contains("TCP server running")) {
                            latch.countDown();
                        }
                    }
                    System.out.println("H2 Server process exited with: " + process.exitValue());
                    latch.countDown();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        });
        t.start();
        latch.await();
        System.out.println("H2 server started!");
        System.out.println("----------------------------------");
    }
    
    public void stop() {
        if (this.process != null) {
            this.process.destroyForcibly();
            System.out.println("H2 server stopped.");
        }
    }

}
