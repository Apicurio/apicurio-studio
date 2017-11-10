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

package io.apicurio.studio.fe.servlet.beans;

/**
 * Models the data sent by GitHub when it calls /callback during the OAuth2 web flow.
 * @author eric.wittmann@gmail.com
 */
public class AccessTokenRequest {

    private String client_id;
    private String client_secret;
    private String code;
    private String redirect_uri;
    private String state;
    
    /**
     * Constructor.
     */
    public AccessTokenRequest() {
    }

    /**
     * @return the client_id
     */
    public String getClient_id() {
        return client_id;
    }

    /**
     * @param client_id the client_id to set
     */
    public void setClient_id(String client_id) {
        this.client_id = client_id;
    }

    /**
     * @return the client_secret
     */
    public String getClient_secret() {
        return client_secret;
    }

    /**
     * @param client_secret the client_secret to set
     */
    public void setClient_secret(String client_secret) {
        this.client_secret = client_secret;
    }

    /**
     * @return the code
     */
    public String getCode() {
        return code;
    }

    /**
     * @param code the code to set
     */
    public void setCode(String code) {
        this.code = code;
    }

    /**
     * @return the redirect_uri
     */
    public String getRedirect_uri() {
        return redirect_uri;
    }

    /**
     * @param redirect_uri the redirect_uri to set
     */
    public void setRedirect_uri(String redirect_uri) {
        this.redirect_uri = redirect_uri;
    }

    /**
     * @return the state
     */
    public String getState() {
        return state;
    }

    /**
     * @param state the state to set
     */
    public void setState(String state) {
        this.state = state;
    }
    
}
