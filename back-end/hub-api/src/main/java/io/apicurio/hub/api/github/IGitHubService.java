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

package io.apicurio.hub.api.github;

import java.util.Collection;

import io.apicurio.hub.api.beans.ApiDesignResourceInfo;
import io.apicurio.hub.api.beans.Collaborator;
import io.apicurio.hub.api.beans.ResourceContent;
import io.apicurio.hub.api.exceptions.NotFoundException;

/**
 * @author eric.wittmann@gmail.com
 * 
 * TODO throw a checked exception when github api calls fail
 */
public interface IGitHubService {

    /**
     * Validates that the given repository URL can be resolved to a real resource
     * of an appropriate type.  Ensures that the resource is accessible, reads the
     * resource, extracts some basic information from the content.
     * @param repositoryUrl
     * @throws NotFoundException
     */
    public ApiDesignResourceInfo validateResourceExists(String repositoryUrl) throws NotFoundException, GitHubException;

    /**
     * Fetchs information about the collaborators for a given repository resource.
     * This will iterate through all of the git commits for the given resource
     * and tally up commit counts for every user found.  The result is a collection
     * of all users who have contributed to the design.
     * @param repositoryUrl
     * @throws NotFoundException
     */
    public Collection<Collaborator> getCollaborators(String repositoryUrl) throws NotFoundException, GitHubException;

    /**
     * Fetchs the content of a github resource.  Uses the GitHub API to get access to
     * the actual resource content and returns it as a string.  Should only be used
     * for text resources, for obvious reasons.
     * @param repositoryUrl
     */
    public ResourceContent getResourceContent(String repositoryUrl) throws NotFoundException, GitHubException;

    /**
     * Updates the raw content for a resource in GitHub using the GH API.
     * @param repositoryUrl
     * @param commitMessage
     * @param content
     */
    public void updateResourceContent(String repositoryUrl, String commitMessage, ResourceContent content) throws GitHubException;

    /**
     * Creates a new resource in GitHub with the given content.
     * @param repositoryUrl
     * @param commitMessage
     * @param content
     */
    public void createResourceContent(String repositoryUrl, String commitMessage, String content) throws GitHubException;

    /**
     * Lists all of the GitHub organizations for the current user.
     */
    public Collection<String> getOrganizations() throws GitHubException;

    /**
     * Lists all of the GitHub repositories for the current user within the given organization.
     * @param org
     */
    public Collection<String> getRepositories(String org) throws GitHubException;

}
