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

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import io.apicurio.hub.api.github.AbstractResourceResolver;
import io.apicurio.hub.core.config.HubConfiguration;

@ApplicationScoped
public class BitbucketResourceResolver {

    // https://bitbucket.org/apicurio/apicurio-test/src/master/apis/pet-store.json
    private static final String PATTERN1 = "/([^/]+)/([^/]+)/src/([^/]+)/(.*)";
    private static final String TEMPLATE = "/:team/:repo/src/:branch/:resource";

    private Pattern pattern1 = null;
    private String template = null;

    @Inject
    private HubConfiguration config;
    
    /**
     * Constructor.
     */
    public BitbucketResourceResolver() {
    }

    @PostConstruct
    public void postConstruct() {
        pattern1 = Pattern.compile(createPatternOrTemplate(PATTERN1));
        template = createPatternOrTemplate(TEMPLATE);
    }

    /**
     * Creates a pattern with the configured GitLab URL as the prefix and the given
     * suffix at the end.
     * @param suffix
     */
    private String createPatternOrTemplate(String suffix) {
        String bitbucket = config.getBitbucketUrl();
        if (bitbucket == null || bitbucket.trim().isEmpty()) {
            bitbucket = "https://bitbucket.org";
        }
        if (bitbucket.endsWith("/")) {
            bitbucket = bitbucket.substring(0, bitbucket.length() - 1);
        }
        return bitbucket + suffix;
    }
    
    /**
     * Resolves a bitbucket URL into a resource object.  The URL must be of the proper format.
     * @param url
     */
    public BitbucketResource resolve(String url) {
        Matcher matcher = pattern1.matcher(url);
        if (matcher.matches()) {
            BitbucketResource resource = new BitbucketResource();
            String team = AbstractResourceResolver.decode(matcher.group(1));
            String repo = AbstractResourceResolver.decode(matcher.group(2));
            String branch = AbstractResourceResolver.decode(matcher.group(3));
            String path = matcher.group(4);
            if (path.contains("?")) {
                path = path.substring(0, path.indexOf("?"));
            }
            path = AbstractResourceResolver.decode(path);
            resource.setTeam(team);
            resource.setRepository(repo);
            resource.setBranch(branch);
            resource.setResourcePath(path);
            return resource;
        }

        return null;
    }

    /**
     * Creates a resource url from the information provided.
     * @param team
     * @param repo
     * @param branch
     * @param resourcePath
     */
    public String create(String team, String repo, String branch, String resourcePath) {
        String resource = resourcePath;
        if (resource == null) {
            resource = "";
        }
        if (resource.startsWith("/")) {
            resource = resource.substring(1);
        }
        return template.replace(":team", AbstractResourceResolver.encode(team))
                .replace(":repo", AbstractResourceResolver.encode(repo))
                .replace(":branch", AbstractResourceResolver.encode(branch))
                .replace(":resource", resource);
    }

}
