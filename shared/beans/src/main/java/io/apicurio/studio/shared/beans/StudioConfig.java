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
public class StudioConfig {
    
    private StudioConfigMode mode;
    private StudioConfigAuth auth;
    private StudioConfigApis apis;
    private User user;
    private StudioConfigUi ui;
    private StudioConfigFeatures features;
    
    /**
     * Constructor.
     */
    public StudioConfig() {
    }

    /**
     * @return the auth
     */
    public StudioConfigAuth getAuth() {
        return auth;
    }

    /**
     * @param auth the auth to set
     */
    public void setAuth(StudioConfigAuth auth) {
        this.auth = auth;
    }

    /**
     * @return the user
     */
    public User getUser() {
        return user;
    }

    /**
     * @param user the user to set
     */
    public void setUser(User user) {
        this.user = user;
    }

    /**
     * @return the api config
     */
	public StudioConfigApis getApis() {
		return apis;
	}

	/**
	 * @param apis the api config
	 */
	public void setApis(StudioConfigApis apis) {
		this.apis = apis;
	}

    /**
     * @return the mode
     */
    public StudioConfigMode getMode() {
        return mode;
    }

    /**
     * @param mode the mode to set
     */
    public void setMode(StudioConfigMode mode) {
        this.mode = mode;
    }

    /**
     * @return the features
     */
    public StudioConfigFeatures getFeatures() {
        return features;
    }

    /**
     * @param features the features to set
     */
    public void setFeatures(StudioConfigFeatures features) {
        this.features = features;
    }

    /**
     * @return the ui
     */
    public StudioConfigUi getUi() {
        return ui;
    }

    /**
     * @param ui the ui to set
     */
    public void setUi(StudioConfigUi ui) {
        this.ui = ui;
    }

}
