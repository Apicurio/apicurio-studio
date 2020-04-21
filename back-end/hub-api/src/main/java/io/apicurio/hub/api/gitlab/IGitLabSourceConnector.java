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

package io.apicurio.hub.api.gitlab;

import java.util.Collection;

import io.apicurio.hub.api.beans.GitLabGroup;
import io.apicurio.hub.api.beans.GitLabProject;
import io.apicurio.hub.api.beans.SourceCodeBranch;
import io.apicurio.hub.api.connectors.ISourceConnector;
import io.apicurio.hub.api.connectors.SourceConnectorException;

/**
 * A GitLab specific source connector.
 * @author christopher.snyder@spectrumhealth.org
 */
public interface IGitLabSourceConnector extends ISourceConnector {

    /**
     * Lists all of the GitLab groups for the current user.
     * @throws GitLabException
     * @throws SourceConnectorException
     */
    public Collection<GitLabGroup> getGroups() throws GitLabException, SourceConnectorException;

    /**
     * Lists all of the GitLab projects for the current user within the given group.
     * @param group
     * @throws GitLabException
     * @throws SourceConnectorException
     */
    public Collection<GitLabProject> getProjects(String group) throws GitLabException, SourceConnectorException;

    /**
     * Lists all of the branches available in the given GitLab project.
     * @param projectId
     */
    public Collection<SourceCodeBranch> getBranches(String projectId) throws GitLabException, SourceConnectorException;

}
