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

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class GitLabResourceResolver {

    private static Pattern pattern1 = Pattern.compile("https://gitlab.com/([^/]+)/([^/]+)/blob/([^/]+)/(.*.json)");
    private static Pattern pattern2 = Pattern.compile("https://gitlab.com/([^/]+)/([^/]+)/blob/([^/]+)/(.*.ya?ml)");
    // TODO support "raw" URLs.  Example:  https://gitlab.com/Apicurio/api-samples/raw/master/3.0/simple-api.json

    /**
     * Resolves a github URL into a resource object.  The URL must be of the proper format.
     * @param glUrl
     */
    public static GitLabResource resolve(String glUrl) {
        Matcher matcher = pattern1.matcher(glUrl);
        if (matcher.matches()) {
            GitLabResource resource = new GitLabResource();
            String org = matcher.group(1);
            String repo = matcher.group(2);
            String branch = matcher.group(3);
            String path = matcher.group(4);
            resource.setGroup(org);
            resource.setProject(repo);
            resource.setBranch(branch);
            resource.setResourcePath(path);
            return resource;
        }
        
        matcher = pattern2.matcher(glUrl);
        if (matcher.matches()) {
            GitLabResource resource = new GitLabResource();
            String org = matcher.group(1);
            String repo = matcher.group(2);
            String branch = matcher.group(3);
            String path = matcher.group(4);
            resource.setGroup(org);
            resource.setProject(repo);
            resource.setBranch(branch);
            resource.setResourcePath(path);
            return resource;
        }
        
        return null;
    }

}
