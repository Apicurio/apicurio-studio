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

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import io.apicurio.hub.core.config.HubConfiguration;

/**
 * Resolves a github URL to a more granular set of properties including:
 * 
 *  - Organization
 *  - Repository Name
 *  - Resource path
 *  
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class GitHubResourceResolver {

    private static final String PATTERN1 = "/([^/]+)/([^/]+)/blob/([^/]+)/(.*)";
    private static final String PATTERN2 = "https://raw.githubusercontent.com/([^/]+)/([^/]+)/([^/]+)/(.*)";
    private static final String TEMPLATE = "/:org/:repo/blob/:branch/:resource";

    private Pattern pattern1 = null;
    private Pattern pattern2 = null;
    private String template = null;

    @Inject
    private HubConfiguration config;
    
    /**
     * Constructor.
     */
    public GitHubResourceResolver() {
    }

    @PostConstruct
    public void postConstruct() {
        pattern1 = Pattern.compile(createPatternOrTemplate(PATTERN1));
        pattern2 = Pattern.compile(PATTERN2);
        template = createPatternOrTemplate(TEMPLATE);
    }

    /**
     * Creates a pattern with the configured GitLab URL as the prefix and the given
     * suffix at the end.
     * @param suffix
     */
    private String createPatternOrTemplate(String suffix) {
        String github = config.getGitHubUrl();
        if (github == null || github.trim().isEmpty()) {
            github = "https://github.com";
        }
        if (github.endsWith("/")) {
            github = github.substring(0, github.length() - 1);
        }
        return github + suffix;
    }
    
    /**
     * Resolves a github URL into a resource object.  The URL must be of the proper format.
     * @param ghUrl
     */
    public GitHubResource resolve(String ghUrl) {
        Matcher matcher = pattern1.matcher(ghUrl);
        if (!matcher.matches()) {
            matcher = pattern2.matcher(ghUrl);
        }
        
        if (matcher.matches()) {
            GitHubResource resource = new GitHubResource();
            String org = AbstractResourceResolver.decode(matcher.group(1));
            String repo = AbstractResourceResolver.decode(matcher.group(2));
            String branch = AbstractResourceResolver.decode(matcher.group(3));
            String path = AbstractResourceResolver.decode(matcher.group(4));
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
    public String create(String org, String repo, String branch, String resourcePath) {
        String resource = resourcePath;
        if (resource == null) {
            resource = "";
        }
        if (resource.startsWith("/")) {
            resource = resource.substring(1);
        }
        return template.replace(":org", AbstractResourceResolver.encode(org))
                .replace(":repo", AbstractResourceResolver.encode(repo))
                .replace(":branch", AbstractResourceResolver.encode(branch))
                .replace(":resource", resource);
    }

}
