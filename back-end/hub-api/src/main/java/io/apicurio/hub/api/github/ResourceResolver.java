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

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Resolves a github URL to a more granular set of properties including:
 * 
 *  - Organization
 *  - Repository Name
 *  - Resource path
 *  
 * @author eric.wittmann@gmail.com
 */
public class ResourceResolver {
    
    private static Pattern pattern1 = Pattern.compile("https://github.com/([^/]+)/([^/]+)/blob/[^/]+/(.*.json)");
    private static Pattern pattern2 = Pattern.compile("https://raw.githubusercontent.com/([^/]+)/([^/]+)/[^/]+/(.*.json)");
    
    /**
     * Resolves a github URL into a resource object.  The URL must be of the proper format.
     * @param ghUrl
     */
    public static GitHubResource resolve(String ghUrl) {
        Matcher matcher = pattern1.matcher(ghUrl);
        if (matcher.matches()) {
            GitHubResource resource = new GitHubResource();
            String org = matcher.group(1);
            String repo = matcher.group(2);
            String path = matcher.group(3);
            resource.setOrganization(org);
            resource.setRepository(repo);
            resource.setResourcePath(path);
            return resource;
        }
        
        matcher = pattern2.matcher(ghUrl);
        if (matcher.matches()) {
            GitHubResource resource = new GitHubResource();
            String org = matcher.group(1);
            String repo = matcher.group(2);
            String path = matcher.group(3);
            resource.setOrganization(org);
            resource.setRepository(repo);
            resource.setResourcePath(path);
            return resource;
        }
        
        return null;
    }

}
