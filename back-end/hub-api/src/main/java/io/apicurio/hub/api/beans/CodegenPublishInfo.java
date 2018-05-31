/*
 * Copyright 2018 JBoss Inc
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
public class CodegenPublishInfo {
    
    private LinkedAccountType type;
    private String org;
    private String repo;
    private String team;
    private String group;
    private String project;
    private String branch;
    private String location;
    private String commitMessage;
    
    /**
     * Constructor.
     */
    public CodegenPublishInfo() {
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
     * @return the org
     */
    public String getOrg() {
        return org;
    }

    /**
     * @param org the org to set
     */
    public void setOrg(String org) {
        this.org = org;
    }

    /**
     * @return the repo
     */
    public String getRepo() {
        return repo;
    }

    /**
     * @param repo the repo to set
     */
    public void setRepo(String repo) {
        this.repo = repo;
    }

    /**
     * @return the team
     */
    public String getTeam() {
        return team;
    }

    /**
     * @param team the team to set
     */
    public void setTeam(String team) {
        this.team = team;
    }

    /**
     * @return the group
     */
    public String getGroup() {
        return group;
    }

    /**
     * @param group the group to set
     */
    public void setGroup(String group) {
        this.group = group;
    }

    /**
     * @return the project
     */
    public String getProject() {
        return project;
    }

    /**
     * @param project the project to set
     */
    public void setProject(String project) {
        this.project = project;
    }

    /**
     * @return the branch
     */
    public String getBranch() {
        return branch;
    }

    /**
     * @param branch the branch to set
     */
    public void setBranch(String branch) {
        this.branch = branch;
    }

    /**
     * @return the location
     */
    public String getLocation() {
        return location;
    }

    /**
     * @param location the location to set
     */
    public void setLocation(String location) {
        this.location = location;
    }

    /**
     * @return the commitMessage
     */
    public String getCommitMessage() {
        return commitMessage;
    }

    /**
     * @param commitMessage the commitMessage to set
     */
    public void setCommitMessage(String commitMessage) {
        this.commitMessage = commitMessage;
    }

}
