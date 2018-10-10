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

/**
 * @author eric.wittmann@gmail.com
 */
public class GitLabGroup {

    private int id;
    private String name;
    private String path;
    private String full_path;
    private boolean userGroup;

    /**
     * Constructor.
     */
    public GitLabGroup() {
    }

    /**
     * @return the id
     */
    public int getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(int id) {
        this.id = id;
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
     * @return the path
     */
    public String getPath() {
        return path;
    }

    /**
     * @param path the path to set
     */
    public void setPath(String path) {
        this.path = path;
    }

    /**
     * @return the userGroup
     */
    public boolean isUserGroup() {
        return userGroup;
    }

    /**
     * @param userGroup the userGroup to set
     */
    public void setUserGroup(boolean userGroup) {
        this.userGroup = userGroup;
    }

    /**
     * @return the full_path
     */
    public String getFull_path() {
        return full_path;
    }

    /**
     * @param full_path the full_path to set
     */
    public void setFull_path(String full_path) {
        this.full_path = full_path;
    }

}
