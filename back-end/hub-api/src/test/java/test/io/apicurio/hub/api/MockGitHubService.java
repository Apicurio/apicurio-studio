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

package test.io.apicurio.hub.api;

import java.io.File;
import java.net.URI;
import java.net.URISyntaxException;

import io.apicurio.hub.api.beans.ApiDesignResourceInfo;
import io.apicurio.hub.api.exceptions.NotFoundException;
import io.apicurio.hub.api.github.IGitHubService;

/**
 * @author eric.wittmann@gmail.com
 */
public class MockGitHubService implements IGitHubService {

    /**
     * @see io.apicurio.hub.api.github.IGitHubService#validateResourceExists(java.lang.String)
     */
    @Override
    public ApiDesignResourceInfo validateResourceExists(String repositoryUrl) throws NotFoundException {
        try {
            URI uri = new URI(repositoryUrl);
            String name = new File(uri.getPath()).getName();
            ApiDesignResourceInfo info = new ApiDesignResourceInfo();
            info.setName(name);
            info.setDescription(repositoryUrl);
            return info;
        } catch (URISyntaxException e) {
            throw new NotFoundException();
        }
    }

}
