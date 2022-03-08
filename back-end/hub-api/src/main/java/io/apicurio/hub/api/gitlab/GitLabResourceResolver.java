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

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import io.apicurio.hub.api.github.AbstractResourceResolver;
import io.apicurio.hub.core.config.HubConfiguration;

@ApplicationScoped
public class GitLabResourceResolver {
    
    private static final String PATTERN1 = "/([^/]+)/([^/]+)/(?:blob|raw)/([^/]+)/(.*)";
    private static final String PATTERN2 = "/([^/]+)/([^/]+)/([^/]+)/(?:blob|raw)/([^/]+)/(.*)";
    private static final String PATTERN3 = "/([^/]+)/([^/]+)/([^/]+)/([^/]+)/(?:blob|raw)/([^/]+)/(.*)";
    private static final String TEMPLATE = "/:group/:project/blob/:branch/:resource";

    private Pattern pattern1 = null;
    private Pattern pattern2 = null;
    private Pattern pattern3 = null;
    private String template = null;
    
    @Inject
    private HubConfiguration config;
    
    /**
     * Constructor.
     */
    public GitLabResourceResolver() {
    }
    
    @PostConstruct
    public void postConstruct() {
        pattern1 = Pattern.compile(createPatternOrTemplate(PATTERN1));
        pattern2 = Pattern.compile(createPatternOrTemplate(PATTERN2));
        pattern3 = Pattern.compile(createPatternOrTemplate(PATTERN3));
        template = createPatternOrTemplate(TEMPLATE);
    }

    /**
     * Creates a pattern with the configured GitLab URL as the prefix and the given
     * suffix at the end.
     * @param suffix
     */
    private String createPatternOrTemplate(String suffix) {
        String gitlab = config.getGitLabUrl();
        if (gitlab == null || gitlab.trim().isEmpty()) {
            gitlab = "https://gitlab.com";
        }
        if (gitlab.endsWith("/")) {
            gitlab = gitlab.substring(0, gitlab.length() - 1);
        }
        return gitlab + suffix;
    }
    
    /**
     * Resolves a GitLab URL into a resource object.  The URL must be of the proper format.
     * @param glUrl
     */
    public GitLabResource resolve(String glUrl) {
        Matcher matcher = pattern1.matcher(glUrl);
        if (matcher.matches()) {
            GitLabResource resource = new GitLabResource();
            String group = AbstractResourceResolver.decode(matcher.group(1));
            String project = AbstractResourceResolver.decode(matcher.group(2));
            String branch = AbstractResourceResolver.decode(matcher.group(3));
            String path = matcher.group(4);
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
            String path = matcher.group(5);
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
            String path = matcher.group(6);
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
    public String create(String group, String project, String branch, String resourcePath) {
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
