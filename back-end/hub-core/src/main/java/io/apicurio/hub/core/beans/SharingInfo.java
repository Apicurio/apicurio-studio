/*
 * Copyright 2019 JBoss Inc
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

package io.apicurio.hub.core.beans;

/**
 * @author eric.wittmann@gmail.com
 */
public class SharingInfo {

    private String designId;
    private String shareUuid;
    private SharingLevel level;
    
    /**
     * Constructor.
     */
    public SharingInfo() {
    }

    /**
     * @return the designId
     */
    public String getDesignId() {
        return designId;
    }

    /**
     * @param designId the designId to set
     */
    public void setDesignId(String designId) {
        this.designId = designId;
    }

    /**
     * @return the shareUuid
     */
    public String getShareUuid() {
        return shareUuid;
    }

    /**
     * @param shareUuid the shareUuid to set
     */
    public void setShareUuid(String shareUuid) {
        this.shareUuid = shareUuid;
    }

    /**
     * @return the level
     */
    public SharingLevel getLevel() {
        return level;
    }

    /**
     * @param level the level to set
     */
    public void setLevel(SharingLevel level) {
        this.level = level;
    }
}
