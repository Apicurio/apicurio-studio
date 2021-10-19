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

package io.apicurio.studio.shared.beans;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

/**
 * @author eric.wittmann@gmail.com
 */
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
public class StudioConfigFeatures {
    
    private boolean microcks;
    private boolean asyncapi;
    private boolean graphql;
    private boolean shareWithEveryone;
    
    /**
     * Constructor.
     */
    public StudioConfigFeatures() {
    }

    /**
     * @return the microcks
     */
    public boolean isMicrocks() {
        return microcks;
    }

    /**
     * @param microcks the microcks to set
     */
    public void setMicrocks(boolean microcks) {
        this.microcks = microcks;
    }

    /**
     * @return the shareWithEveryone
     */
    public boolean isShareWithEveryone() {
        return shareWithEveryone;
    }

    /**
     * @param shareWithEveryone the shareWithEveryone to set
     */
    public void setShareWithEveryone(boolean shareWithEveryone) {
        this.shareWithEveryone = shareWithEveryone;
    }

    /**
     * @return the asyncapi
     */
    public boolean isAsyncapi() {
        return asyncapi;
    }

    /**
     * @param asyncapi the asyncapi to set
     */
    public void setAsyncapi(boolean asyncapi) {
        this.asyncapi = asyncapi;
    }

    /**
     * @return the graphql
     */
    public boolean isGraphql() {
        return graphql;
    }

    /**
     * @param graphql the graphql to set
     */
    public void setGraphql(boolean graphql) {
        this.graphql = graphql;
    }
}
