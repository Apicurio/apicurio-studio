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
public class GitHubResourceResolver {
    
    private static Pattern pattern1 = Pattern.compile("https://github.com/([^/]+)/([^/]+)/blob/([^/]+)/(.*)");
    private static Pattern pattern2 = Pattern.compile("https://raw.githubusercontent.com/([^/]+)/([^/]+)/([^/]+)/(.*)");
    
    private static String template = "https://github.com/:org/:repo/blob/:branch/:resource";

    /**
     * Resolves a github URL into a resource object.  The URL must be of the proper format.
     * @param ghUrl
     */
    public static GitHubResource resolve(String ghUrl) {
        Matcher matcher = pattern1.matcher(ghUrl);
        if (!matcher.matches()) {
            matcher = pattern2.matcher(ghUrl);
        }
        
        if (matcher.matches()) {
            GitHubResource resource = new GitHubResource();
            String org = matcher.group(1);
            String repo = matcher.group(2);
            String branch = matcher.group(3);
            String path = matcher.group(4);
            resource.setOrganization(org);
            resource.setRepository(repo);
            resource.setBranch(branch);
            resource.setResourcePath(path);
            return resource;
        }

        return null;
    }
    
    /**
     * Creates a resource url from the information provided.
     * @param org
     * @param repo
     * @param branch
     * @param resourcePath
     */
    public static String create(String org, String repo, String branch, String resourcePath) {
        String resource = resourcePath;
        if (resource == null) {
            resource = "";
        }
        if (resource.startsWith("/")) {
            resource = resource.substring(1);
        }
        return template.replace(":org", org).replace(":repo", repo).replace(":branch", branch).replace(":resource", resource);
    }

}
