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

package io.apicurio.studio.tools.release;

import java.util.HashMap;
import java.util.Map;

/**
 * @author eric.wittmann@gmail.com
 */
public class Link {

    public static Map<String, Link> parseAll(String allLinks) {
        Map<String, Link> rval = new HashMap<>();
        if (allLinks != null) {
            String[] split = allLinks.split(",");
            for (String singleLink : split) {
                Link link = Link.parse(singleLink.trim());
                rval.put(link.getType(), link);
            }
        }
        return rval;
    }

    public static Link parse(String singleLink) {
        String[] split = singleLink.split("[<>;]");
        String url = split[1];
        String type = split[3].trim().substring(5);
        type = type.substring(0, type.length() - 1);
        return new Link(url, type);
    }

    private final String url;
    private final String type;

    /**
     * Constructor.
     * @param url
     * @param type
     */
    public Link(String url, String type) {
        this.url = url;
        this.type = type;
    }

    /**
     * @return the url
     */
    public String getUrl() {
        return url;
    }

    /**
     * @return the type
     */
    public String getType() {
        return type;
    }

}
