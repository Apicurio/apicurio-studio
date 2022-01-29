/*
 * Copyright 2021 Red Hat
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

package io.apicurio.studio.web.servlets;

import javax.enterprise.context.ApplicationScoped;
import javax.servlet.http.HttpServletRequest;

import io.apicurio.common.apps.web.servlets.ConfigJsServlet;
import io.apicurio.studio.web.config.ApiConfig;
import io.apicurio.studio.web.config.AuthConfig;
import io.apicurio.studio.web.config.ConfigJs;
import io.apicurio.studio.web.config.FeaturesConfig;
import io.apicurio.studio.web.config.UiConfig;

/**
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class ConfigServlet extends ConfigJsServlet {

    private static final long serialVersionUID = -5631008749890851653L;

    /**
     * @see io.apicurio.common.apps.web.servlets.ConfigJsServlet#generateConfig(javax.servlet.http.HttpServletRequest)
     */
    @Override
    protected Object generateConfig(HttpServletRequest request) {
        String apiUrl = this.generateApiUrl(request);
        // TODO need real configuration of features, UI, and auth
        return ConfigJs.builder()
                .api(ApiConfig.builder().url(apiUrl).build())
                .features(FeaturesConfig.builder().breadcrumbs(true).multiTenant(false).build())
                .ui(UiConfig.builder().contextPath("/ui/").build())
                .auth(AuthConfig.builder().type("none").build())
                .build();
    }

    /**
     * @see io.apicurio.common.apps.web.servlets.ConfigJsServlet#getVarName()
     */
    @Override
    protected String getVarName() {
        return "ApiStudioConfig";
    }

    /**
     * @see io.apicurio.common.apps.web.servlets.ConfigJsServlet#getApiRelativePath()
     */
    @Override
    protected String getApiRelativePath() {
        return "/apis/studio/v1";
    }

    /**
     * @see io.apicurio.common.apps.web.servlets.ConfigJsServlet#getApiUrlOverride()
     */
    @Override
    protected String getApiUrlOverride() {
        // TODO implement this from config
        return null;
    }

}
