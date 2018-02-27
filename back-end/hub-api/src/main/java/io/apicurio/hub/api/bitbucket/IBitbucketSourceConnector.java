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

package io.apicurio.hub.api.bitbucket;

import java.util.Collection;

import io.apicurio.hub.api.beans.BitbucketRepository;
import io.apicurio.hub.api.beans.BitbucketTeam;
import io.apicurio.hub.api.beans.SourceCodeBranch;
import io.apicurio.hub.api.connectors.ISourceConnector;
import io.apicurio.hub.api.connectors.SourceConnectorException;

/**
 * A Bitbucket specific source connector.
 */
public interface IBitbucketSourceConnector extends ISourceConnector {

    /**
     * Lists all of the Bitbucket teams for the current user.
     * @throws BitbucketException
     * @throws SourceConnectorException
     */
    public Collection<BitbucketTeam> getTeams() throws BitbucketException, SourceConnectorException;

    /**
     * Lists all of the Bitbucket repositories for the current user within the given group.
     * @param teamName
     * @throws BitbucketException
     * @throws SourceConnectorException
     */
    public Collection<BitbucketRepository> getRepositories(String teamName) throws BitbucketException, SourceConnectorException;

    /**
     * Lists all of the branches available in the given Bitbucket repository.
     * @param group
     * @param repo
     */
    public Collection<SourceCodeBranch> getBranches(String group, String repo) throws BitbucketException, SourceConnectorException;

}
