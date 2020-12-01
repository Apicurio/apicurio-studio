/*
 * Copyright 2020 Red Hat
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
package io.apicurio.hub.core.integrations;

/**
 * @author Fabian Martinez
 */
public enum ApicurioEventType {

    DESIGN_CREATED("io.apicurio.hub.design-created"),
    DESIGN_UPDATED("io.apicurio.hub.design-updated"),
    DESIGN_DELETED("io.apicurio.hub.design-deleted");

    private String cloudEventType;

    private ApicurioEventType(String cloudEventType) {
        this.cloudEventType = cloudEventType;
    }

    public String cloudEventType() {
        return this.cloudEventType;
    }

}
