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

package io.apicurio.hub.core.editing;

import java.io.Closeable;

import javax.websocket.Session;

/**
 * Models a single, shared editing session for an API Design.
 * @author eric.wittmann@gmail.com
 */
public class ApiDesignEditingSession implements Closeable {
    
    private final String designId;
    
    /**
     * Constructor.
     * @param designId
     */
    public ApiDesignEditingSession(String designId) {
        this.designId = designId;
    }

    /**
     * @param session
     */
    public void join(Session session) {
        // TODO Auto-generated method stub
        
    }

    /**
     * @param session
     */
    public void leave(Session session) {
        // TODO Auto-generated method stub
        
    }

    /**
     * @return
     */
    public boolean isEmpty() {
        // TODO Auto-generated method stub
        return false;
    }

    /**
     * @see java.io.Closeable#close()
     */
    @Override
    public void close() {
        // TODO Auto-generated method stub
        
    }

    /**
     * @param session
     * @param user
     * @param content
     */
    public void sendCommandToOthers(Session session, String user, String content) {
        // TODO Auto-generated method stub
        
    }

    /**
     * @return the designId
     */
    public String getDesignId() {
        return designId;
    }

}
