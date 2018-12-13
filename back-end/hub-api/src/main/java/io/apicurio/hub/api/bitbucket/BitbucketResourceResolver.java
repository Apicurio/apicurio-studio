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

public class BitbucketResourceResolver {

    // https://bitbucket.org/apicurio/apicurio-test/src/master/apis/pet-store.json
    private static Pattern pattern1 = Pattern.compile("https://bitbucket.org/([^/]+)/([^/]+)/src/([^/]+)/(.*)");

    private static String template = "https://bitbucket.org/:team/:repo/src/:branch/:resource";

    /**
     * Resolves a bitbucket URL into a resource object.  The URL must be of the proper format.
     * @param url
     */
    public static BitbucketResource resolve(String url) {
        Matcher matcher = pattern1.matcher(url);
        if (matcher.matches()) {
            BitbucketResource resource = new BitbucketResource();
            String team = matcher.group(1);
            String repo = matcher.group(2);
            String branch = matcher.group(3);
            String path = matcher.group(4);
            if (path.contains("?")) {
                path = path.substring(0, path.indexOf("?"));
            }
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
    public static String create(String team, String repo, String branch, String resourcePath) {
        String resource = resourcePath;
        if (resource == null) {
            resource = "";
        }
        if (resource.startsWith("/")) {
            resource = resource.substring(1);
        }
        return template.replace(":team", team).replace(":repo", repo).replace(":branch", branch).replace(":resource", resource);
    }

}
