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
import java.util.function.Function;

/**
 * Starts up/stops a process
 *
 * @author eric.wittmann@gmail.com
 * @author jsenko@redhat.com
 */
public class ProcessExecutor {

    private Process process = null;

    /**
     * @param cmdArray           Command to execute
     * @param startWaitCondition Consume stdout lines, and return true if the process is considered "started"
     *                           (return from this method).
     * @throws Exception
     */
    public void start(String[] cmdArray, Function<String, Boolean> startWaitCondition) throws Exception {
        process = Runtime.getRuntime().exec(cmdArray);
        InputStream is = process.getInputStream();
        BufferedReader reader = new BufferedReader(new InputStreamReader(is));
        final CountDownLatch latch = new CountDownLatch(1);
        Thread t = new Thread(() -> {
            try {
                String line = null;
                while (process.isAlive()) {
                    line = reader.readLine();

                    if (line != null && startWaitCondition.apply(line)) {
                        latch.countDown();
                        return;
                    }
                }
                // TODO error handling
                latch.countDown();
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
        t.start();
        latch.await();
    }

    public void stop() {
        if (this.process != null) {
            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            process.destroyForcibly();
        }
    }
}
