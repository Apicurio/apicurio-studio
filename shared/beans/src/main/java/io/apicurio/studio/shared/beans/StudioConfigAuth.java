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

package io.apicurio.studio.shared.beans;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

/**
 * @author eric.wittmann@gmail.com
 */
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
public class StudioConfigAuth {
    
    private StudioConfigAuthType type;
    private String token;
    private int tokenRefreshPeriod;
    private String logoutUrl;
    
    /**
     * Constructor.
     */
    public StudioConfigAuth() {
    }

    /**
     * @return the type
     */
    public StudioConfigAuthType getType() {
        return type;
    }

    /**
     * @param type the type to set
     */
    public void setType(StudioConfigAuthType type) {
        this.type = type;
    }

    /**
     * @return the token
     */
    public String getToken() {
        return token;
    }

    /**
     * @param token the token to set
     */
    public void setToken(String token) {
        this.token = token;
    }

    /**
     * @return the logoutUrl
     */
    public String getLogoutUrl() {
        return logoutUrl;
    }

    /**
     * @param logoutUrl the logoutUrl to set
     */
    public void setLogoutUrl(String logoutUrl) {
        this.logoutUrl = logoutUrl;
    }

    /**
     * @return the tokenRefreshPeriod
     */
    public int getTokenRefreshPeriod() {
        return tokenRefreshPeriod;
    }

    /**
     * @param tokenRefreshPeriod the tokenRefreshPeriod to set
     */
    public void setTokenRefreshPeriod(int tokenRefreshPeriod) {
        this.tokenRefreshPeriod = tokenRefreshPeriod;
    }

}
