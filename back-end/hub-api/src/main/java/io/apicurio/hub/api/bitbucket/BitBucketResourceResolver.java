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

public class BitBucketResourceResolver {

    // https://bitbucket.org/apicurio/apicurio-test/src/master/apis/pet-store.json
    private static Pattern pattern1 = Pattern.compile("https://bitbucket.org/([^/]+)/([^/]+)/src/([^/]+)/(.*.json)");
    // https://bitbucket.org/apicurio/apicurio-test/src/46163f44a4a398e0101ee9ff10affbbf57e066f9/apis/pet-store.json?at=master&fileviewer=file-view-default
    private static Pattern pattern2 = Pattern.compile("https://bitbucket.org/([^/]+)/([^/]+)/src/([^/]+)/(.*.json)\\?at=([^&]+).(fileviewer=file-view-default)?");
    // https://bitbucket.org/apicurio/apicurio-test/raw/46163f44a4a398e0101ee9ff10affbbf57e066f9/apis/pet-store.json
    private static Pattern pattern3 = Pattern.compile("https://bitbucket.org/([^/]+)/([^/]+)/raw/([^/]+)/(.*.json)");

    /**
     * Resolves a bitbucket URL into a resource object.  The URL must be of the proper format.
     * @param url
     */
    public static BitBucketResource resolve(String url) {
        Matcher matcher = pattern2.matcher(url);
        if (matcher.matches()) {
            BitBucketResource resource = new BitBucketResource();
            String team = matcher.group(1);
            String repo = matcher.group(2);
            String slug = matcher.group(3);
            String path = matcher.group(4);
            String branch = matcher.group(5);
            resource.setTeam(team);
            resource.setRepository(repo);
            resource.setBranch(branch);
            resource.setSlug(slug);
            resource.setResourcePath(path);
            return resource;
        }
        
        matcher = pattern1.matcher(url);
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
        
        matcher = pattern3.matcher(url);
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
