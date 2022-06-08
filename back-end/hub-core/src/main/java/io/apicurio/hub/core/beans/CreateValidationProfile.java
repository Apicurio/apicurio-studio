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

import java.util.HashMap;
import java.util.Map;

/**
 * @author eric.wittmann@gmail.com
 */
public class CreateValidationProfile {

    private String name;
    private String description;
    private Map<String, ValidationSeverity> severities = new HashMap<>();
    private String externalRuleset;

    /**
     * Constructor.
     */
    public CreateValidationProfile() {
    }

    /**
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * @param name the name to set
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return the description
     */
    public String getDescription() {
        return description;
    }

    /**
     * @param description the description to set
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * @return the severities
     */
    public Map<String, ValidationSeverity> getSeverities() {
        return severities;
    }

    /**
     * @param severities the severities to set
     */
    public void setSeverities(Map<String, ValidationSeverity> severities) {
        this.severities = severities;
    }

    /**
     * @return the (optional) external ruleset
     */
    public String getExternalRuleset() {
        return externalRuleset;
    }

    /**
     * Set the external ruleset value
     *
     * @param externalRuleset the external ruleset value
     */
    public void setExternalRuleset(String externalRuleset) {
        this.externalRuleset = externalRuleset;
    }
}
