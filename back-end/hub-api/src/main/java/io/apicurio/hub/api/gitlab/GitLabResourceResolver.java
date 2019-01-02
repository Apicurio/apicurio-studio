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

import io.apicurio.hub.api.github.AbstractResourceResolver;

public class GitLabResourceResolver {

    private static Pattern pattern1 = Pattern.compile("https://gitlab.com/([^/]+)/([^/]+)/blob/([^/]+)/(.*)");
    private static Pattern pattern2 = Pattern.compile("https://gitlab.com/([^/]+)/([^/]+)/([^/]+)/blob/([^/]+)/(.*)");
    private static Pattern pattern3 = Pattern.compile("https://gitlab.com/([^/]+)/([^/]+)/([^/]+)/([^/]+)/blob/([^/]+)/(.*)");
    // TODO support "raw" URLs.  Example:  https://gitlab.com/Apicurio/api-samples/raw/master/3.0/simple-api.json

    private static String template = "https://gitlab.com/:group/:project/blob/:branch/:resource";

    /**
     * Resolves a GitLab URL into a resource object.  The URL must be of the proper format.
     * @param glUrl
     */
    public static GitLabResource resolve(String glUrl) {
        Matcher matcher = pattern1.matcher(glUrl);
        if (matcher.matches()) {
            GitLabResource resource = new GitLabResource();
            String group = AbstractResourceResolver.decode(matcher.group(1));
            String project = AbstractResourceResolver.decode(matcher.group(2));
            String branch = AbstractResourceResolver.decode(matcher.group(3));
            String path = AbstractResourceResolver.decode(matcher.group(4));
            resource.setGroup(group);
            resource.setProject(project);
            resource.setBranch(branch);
            resource.setResourcePath(path);
            return resource;
        }
        matcher = pattern2.matcher(glUrl);
        if (matcher.matches()) {
            GitLabResource resource = new GitLabResource();
            String group = AbstractResourceResolver.decode(matcher.group(1));
            String subGroup = AbstractResourceResolver.decode(matcher.group(2));
            String project = AbstractResourceResolver.decode(matcher.group(3));
            String branch = AbstractResourceResolver.decode(matcher.group(4));
            String path = AbstractResourceResolver.decode(matcher.group(5));
            resource.setGroup(group + "/" + subGroup);
            resource.setProject(project);
            resource.setBranch(branch);
            resource.setResourcePath(path);
            return resource;
        }
        matcher = pattern3.matcher(glUrl);
        if (matcher.matches()) {
            GitLabResource resource = new GitLabResource();
            String group = AbstractResourceResolver.decode(matcher.group(1));
            String subGroup = AbstractResourceResolver.decode(matcher.group(2));
            String subSubGroup = AbstractResourceResolver.decode(matcher.group(3));
            String project = AbstractResourceResolver.decode(matcher.group(4));
            String branch = AbstractResourceResolver.decode(matcher.group(5));
            String path = AbstractResourceResolver.decode(matcher.group(6));
            resource.setGroup(group + "/" + subGroup + "/" + subSubGroup);
            resource.setProject(project);
            resource.setBranch(branch);
            resource.setResourcePath(path);
            return resource;
        }
        
        return null;
    }
    
    /**
     * Creates a resource url from the information provided.
     * @param group
     * @param project
     * @param branch
     * @param resourcePath
     */
    public static String create(String group, String project, String branch, String resourcePath) {
        String resource = resourcePath;
        if (resource == null) {
            resource = "";
        }
        if (resource.startsWith("/")) {
            resource = resource.substring(1);
        }
        return template.replace(":group", AbstractResourceResolver.encode(group))
                .replace(":project", AbstractResourceResolver.encode(project))
                .replace(":branch", AbstractResourceResolver.encode(branch))
                .replace(":resource", resource);
    }

}
