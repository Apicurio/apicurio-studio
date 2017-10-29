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

import io.apicurio.hub.api.gitlab.GitLabResource;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class BitBucketResourceResolver {

    private static Pattern pattern = Pattern.compile("https://bitbucket.org/([^/]+)/([^/]+)/src/([^/]+)/(.*.json)");

    /**
     * Resolves a bitbucket URL into a resource object.  The URL must be of the proper format.
     * @param glUrl
     */
    public static BitBucketResource resolve(String glUrl) {
        Matcher matcher = pattern.matcher(glUrl);
        if (matcher.matches()) {
            BitBucketResource resource = new BitBucketResource();
            String team = matcher.group(1);
            String repo = matcher.group(2);
            String slug = matcher.group(3);
            String path = matcher.group(4);
            resource.setTeam(team);
            resource.setRepository(repo);
            resource.setSlug(slug);
            resource.setResourcePath(path);
            return resource;
        }
        return null;
    }

}
