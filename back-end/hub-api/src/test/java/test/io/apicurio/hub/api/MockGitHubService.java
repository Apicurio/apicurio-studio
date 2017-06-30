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
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import io.apicurio.hub.api.beans.ApiDesignResourceInfo;
import io.apicurio.hub.api.beans.Collaborator;
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
            info.setUrl(repositoryUrl);
            return info;
        } catch (URISyntaxException e) {
            throw new NotFoundException();
        }
    }
    
    /**
     * @see io.apicurio.hub.api.github.IGitHubService#getCollaborators(java.lang.String)
     */
    @Override
    public Collection<Collaborator> getCollaborators(String repoUrl) {
        Set<Collaborator> rval = new HashSet<>();

        Collaborator c1 = new Collaborator();
        c1.setCommits(7);
        c1.setName("user1");
        c1.setUrl("urn:user1");
        rval.add(c1);
        
        Collaborator c2 = new Collaborator();
        c2.setCommits(7);
        c2.setName("user1");
        c2.setUrl("urn:user1");
        rval.add(c2);
        
        return rval;
    }

}
