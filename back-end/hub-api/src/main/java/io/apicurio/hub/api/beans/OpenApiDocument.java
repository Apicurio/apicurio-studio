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

package io.apicurio.hub.api.beans;

/**
 * @author eric.wittmann@gmail.com
 */
public abstract class OpenApiDocument {
    
    private OpenApiInfo info;
    private Tag[] tags;
    
    /**
     * Constructor.
     */
    public OpenApiDocument() {
    }

    /**
     * @return the info
     */
    public OpenApiInfo getInfo() {
        return info;
    }

    /**
     * @param info the info to set
     */
    public void setInfo(OpenApiInfo info) {
        this.info = info;
    }

    /**
     * @return the tags
     */
    public Tag[] getTags() {
        return tags;
    }

    /**
     * @param tags the tags to set
     */
    public void setTags(Tag[] tags) {
        this.tags = tags;
    }

}
