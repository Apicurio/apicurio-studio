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

import io.apicurio.hub.api.beans.GitHubOrganization;
import io.apicurio.hub.api.beans.GitHubRepository;
import io.apicurio.hub.api.beans.SourceCodeBranch;
import io.apicurio.hub.api.connectors.ISourceConnector;
import io.apicurio.hub.api.connectors.SourceConnectorException;

/**
 * A GitHub specific source connector.
 * @author eric.wittmann@gmail.com
 */
public interface IGitHubSourceConnector extends ISourceConnector {

    /**
     * Lists all of the GitHub organizations for the current user.
     */
    public Collection<GitHubOrganization> getOrganizations() throws GitHubException, SourceConnectorException;

    /**
     * Lists all of the GitHub repositories for the current user within the given organization.
     * @param org
     */
    public Collection<GitHubRepository> getRepositories(String org) throws GitHubException, SourceConnectorException;

    /**
     * Lists all of the branches available on the given GitHub repository in the given org.
     * @param org
     * @param repo
     */
    public Collection<SourceCodeBranch> getBranches(String org, String repo) throws GitHubException, SourceConnectorException;

}
