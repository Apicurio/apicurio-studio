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

package io.apicurio.studio.fe.servlet.config;

import javax.enterprise.context.ApplicationScoped;

import io.apicurio.studio.shared.config.Configuration;

/**
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class StudioUiConfiguration extends Configuration {

    private static final String HUB_API_URL_ENV = "APICURIO_UI_HUB_API_URL";
    private static final String HUB_API_URL_SYSPROP = "apicurio-ui.hub-api.url";

    /**
     * Returns the URL of the Apicurio Hub API.
     */
    public String getHubApiUrl() {
        return getConfigurationProperty(HUB_API_URL_ENV, HUB_API_URL_SYSPROP, null);
    }
}
