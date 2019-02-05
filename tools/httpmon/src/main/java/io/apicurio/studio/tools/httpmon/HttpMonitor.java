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

package io.apicurio.studio.tools.httpmon;

import java.net.ServerSocket;
import java.net.Socket;

/**
 * @author eric.wittmann@gmail.com
 */
public class HttpMonitor {

    public static void main(String[] args) throws Exception {
        int port = 5000;
        System.out.println("Starting server on port: " + port);
        System.out.println("---");
        try (ServerSocket server = new ServerSocket(port)) {
            while (true) {
                Socket connectionSocket = server.accept();
                ConnectionHandler handler = new ConnectionHandler(connectionSocket);
                Thread thread = new Thread(handler);
                thread.start();
            }
        }
    }

}
