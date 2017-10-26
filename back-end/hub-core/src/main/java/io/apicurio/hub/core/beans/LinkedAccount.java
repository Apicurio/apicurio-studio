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

package io.apicurio.hub.core.beans;

import java.util.Date;

/**
 * @author eric.wittmann@gmail.com
 */
public class LinkedAccount {

    private LinkedAccountType type;
    private Date linkedOn;
    private Date usedOn;
    private String nonce;
    
    /**
     * Constructor.
     */
    public LinkedAccount() {
    }

    /**
     * @return the type
     */
    public LinkedAccountType getType() {
        return type;
    }

    /**
     * @param type the type to set
     */
    public void setType(LinkedAccountType type) {
        this.type = type;
    }

    /**
     * @return the linkedOn
     */
    public Date getLinkedOn() {
        return linkedOn;
    }

    /**
     * @param linkedOn the linkedOn to set
     */
    public void setLinkedOn(Date linkedOn) {
        this.linkedOn = linkedOn;
    }

    /**
     * @return the usedOn
     */
    public Date getUsedOn() {
        return usedOn;
    }

    /**
     * @param usedOn the usedOn to set
     */
    public void setUsedOn(Date usedOn) {
        this.usedOn = usedOn;
    }

    /**
     * @return the nonce
     */
    public String getNonce() {
        return nonce;
    }

    /**
     * @param nonce the nonce to set
     */
    public void setNonce(String nonce) {
        this.nonce = nonce;
    }
}
