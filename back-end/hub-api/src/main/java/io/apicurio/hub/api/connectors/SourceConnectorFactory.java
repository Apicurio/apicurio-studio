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

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import io.apicurio.hub.api.beans.LinkedAccountType;
import io.apicurio.hub.api.exceptions.NotFoundException;
import io.apicurio.hub.api.github.GitHubResourceResolver;
import io.apicurio.hub.api.github.IGitHubSourceConnector;
import io.apicurio.hub.api.gitlab.IGitLabSourceConnector;

/**
 * Creates/provides connectors for different types of linked accounts.
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class SourceConnectorFactory {

    @Inject
    private IGitHubSourceConnector gitHub;

    @Inject
    private IGitLabSourceConnector gitLab;
    // TODO add more platforms here

    /**
     * Creates a connector for a particular type of account (e.g. GitHub, GitLab, etc).
     * @param accountType
     * @throws NotFoundException
     */
    public ISourceConnector createConnector(LinkedAccountType accountType) throws NotFoundException {
        if (accountType == LinkedAccountType.GitHub) {
            return gitHub;
        }

        if (accountType == LinkedAccountType.GitLab) {
            return gitLab;
        }
        // TODO add more platforms here

        throw new NotFoundException();
    }

    /**
     * Creates a connector for a particular resource URL.  The factory will determine the
     * type of connector based on the URL pattern.
     * @param repositoryUrl
     * @throws NotFoundException
     */
    public ISourceConnector createConnector(String repositoryUrl) throws NotFoundException {
        if (GitHubResourceResolver.resolve(repositoryUrl) != null) {
            return gitHub;
        }


        // TODO add more platforms here

        throw new NotFoundException();
    }

}
