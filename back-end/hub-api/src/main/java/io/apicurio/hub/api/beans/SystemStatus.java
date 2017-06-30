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

import java.util.Date;

import io.apicurio.studio.shared.beans.User;

/**
 * @author eric.wittmann@gmail.com
 */
public class SystemStatus {

    private String name;
    private String description;
    private String moreInfo;
    private String version;
    private Date builtOn;
    private boolean up;
    private User user;
    
    /**
     * Constructor.
     */
    public SystemStatus() {
    }

    /**
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * @param name the name to set
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return the description
     */
    public String getDescription() {
        return description;
    }

    /**
     * @param description the description to set
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * @return the moreInfo
     */
    public String getMoreInfo() {
        return moreInfo;
    }

    /**
     * @param moreInfo the moreInfo to set
     */
    public void setMoreInfo(String moreInfo) {
        this.moreInfo = moreInfo;
    }

    /**
     * @return the version
     */
    public String getVersion() {
        return version;
    }

    /**
     * @param version the version to set
     */
    public void setVersion(String version) {
        this.version = version;
    }

    /**
     * @return the builtOn
     */
    public Date getBuiltOn() {
        return builtOn;
    }

    /**
     * @param builtOn the builtOn to set
     */
    public void setBuiltOn(Date builtOn) {
        this.builtOn = builtOn;
    }

    /**
     * @return the up
     */
    public boolean isUp() {
        return up;
    }

    /**
     * @param up the up to set
     */
    public void setUp(boolean up) {
        this.up = up;
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

}
