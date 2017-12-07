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

package io.apicurio.hub.api.beans;

import io.apicurio.hub.core.beans.LinkedAccountType;

/**
 * @author eric.wittmann@gmail.com
 */
public class CreateLinkedAccount {
    
    private LinkedAccountType type;
    private String redirectUrl;
    
    /**
     * Constructor.
     */
    public CreateLinkedAccount() {
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
     * @return the redirectUrl
     */
    public String getRedirectUrl() {
        return redirectUrl;
    }

    /**
     * @param redirectUrl the redirectUrl to set
     */
    public void setRedirectUrl(String redirectUrl) {
        this.redirectUrl = redirectUrl;
    }

}
