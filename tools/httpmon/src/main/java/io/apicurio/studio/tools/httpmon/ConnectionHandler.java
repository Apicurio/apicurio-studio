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

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.Socket;

import javax.net.ssl.SSLSocket;
import javax.net.ssl.SSLSocketFactory;

/**
 * @author eric.wittmann@gmail.com
 */
public class ConnectionHandler implements Runnable {

    private Socket socket;

    /**
     * Constructor.
     * 
     * @param socket
     */
    public ConnectionHandler(Socket socket) {
        this.socket = socket;
    }

    /**
     * @see java.lang.Runnable#run()
     */
    @Override
    public void run() {
        try {
            SSLSocketFactory factory = (SSLSocketFactory) SSLSocketFactory.getDefault();
            SSLSocket clientSocket = (SSLSocket) factory.createSocket("35.231.145.151", 443); // gitlab.com
            clientSocket.startHandshake();
            
            OutputStream clientOS = clientSocket.getOutputStream();
            
            // Proxy the request
            BufferedReader inFromClient = new BufferedReader(
                    new InputStreamReader(this.socket.getInputStream()));
            String sentence;
            do {
                sentence = inFromClient.readLine();
                System.out.println("REQUEST: " + sentence);
                clientOS.write((sentence + "\r\n").getBytes());
            } while (!"".equals(sentence));
            
            System.out.println("---");
            
            // Proxy the response
            BufferedReader outFromServer = new BufferedReader(
                    new InputStreamReader(clientSocket.getInputStream()));
            OutputStream originOS = this.socket.getOutputStream();
            do {
                sentence = outFromServer.readLine();
                System.out.println("RESPONSE: " + sentence);
                originOS.write((sentence + "\r\n").getBytes());
            } while (sentence != null);
        } catch (Throwable t) {
            t.printStackTrace();
        } finally {
            System.out.println("(Closing socket)");
            try { this.socket.close(); } catch (IOException e) { }
        }

    }

}
