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

package io.apicurio.hub.api.connectors;

import java.util.Collection;

import com.mashape.unirest.http.exceptions.UnirestException;
import io.apicurio.hub.api.beans.ApiDesignResourceInfo;
import io.apicurio.hub.api.beans.Collaborator;
import io.apicurio.hub.api.beans.LinkedAccountType;
import io.apicurio.hub.api.beans.ResourceContent;
import io.apicurio.hub.api.exceptions.NotFoundException;

/**
 * A connector to a source code control system or platform.  Provides a way to get access
 * to information stored in something like git.  Also allows storing information in such
 * a system.  Typical implementations may include GitHub, GitLab, and Bitbucket.
 * @author eric.wittmann@gmail.com
 */
public interface ISourceConnector {
    
    /**
     * Gets the linked account type that this connector supports.
     */
    public LinkedAccountType getType();

    /**
     * Validates that the given repository URL can be resolved to a real resource
     * of an appropriate type.  Ensures that the resource is accessible, reads the
     * resource, extracts some basic information from the content.
     * @param repositoryUrl
     * @throws NotFoundException
     */
    public ApiDesignResourceInfo validateResourceExists(String repositoryUrl) throws NotFoundException, SourceConnectorException;

    /**
     * Fetchs information about the collaborators for a given repository resource.
     * This will iterate through all of the git commits for the given resource
     * and tally up commit counts for every user found.  The result is a collection
     * of all users who have contributed to the design.
     * @param repositoryUrl
     * @throws NotFoundException
     */
    public Collection<Collaborator> getCollaborators(String repositoryUrl) throws NotFoundException, SourceConnectorException;

    /**
     * Fetchs the content of a github resource.  Uses the source control API to get access to
     * the actual resource content and returns it as a string.  Should only be used
     * for text resources, for obvious reasons.
     * @param repositoryUrl
     */
    public ResourceContent getResourceContent(String repositoryUrl) throws NotFoundException, SourceConnectorException;

    /**
     * Updates the raw content for a resource in the source control system using its API.
     * @param repositoryUrl
     * @param commitMessage
     * @param commitComment 
     * @param content
     * @return the latest SHA hash
     */
    public String updateResourceContent(String repositoryUrl, String commitMessage, String commitComment, ResourceContent content) throws SourceConnectorException;

    /**
     * Creates a new resource in the source control system with the given content.
     * @param repositoryUrl
     * @param commitMessage
     * @param content
     */
    public void createResourceContent(String repositoryUrl, String commitMessage, String content) throws SourceConnectorException;

}
