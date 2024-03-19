/*
 * Copyright 2023 Red Hat Inc
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

package io.apicurio.studio.ui;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import io.apicurio.common.apps.config.Info;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class RedirectFilter implements Filter {
    
    @ConfigProperty(name = "apicurio.enable-redirects", defaultValue = "true")
    @Info(category = "redirects", description = "Enable redirects", availableSince = "1.0.0.Final")
    Boolean redirectsEnabled;

    @ConfigProperty(name = "apicurio.redirects")
    @Info(category = "redirects", description = "Studio redirects", availableSince = "1.0.0.Final")
    Map<String, String> redirectsConfig;
    Map<String, String> redirects = new HashMap<>();

    @PostConstruct
    void init() {
        if (redirectsEnabled != null && redirectsEnabled) {
            redirectsConfig.values().forEach(value -> {
                String [] split = value.split(",");
                if (split != null && split.length == 2) {
                    String key = split[0];
                    String val = split[1];
                    redirects.put(key, val);
                }
            });
        }
    }

    /**
     * @see jakarta.servlet.Filter#init(jakarta.servlet.FilterConfig)
     */
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    /**
     * @see jakarta.servlet.Filter#doFilter(jakarta.servlet.ServletRequest,
     *      jakarta.servlet.ServletResponse, jakarta.servlet.FilterChain)
     */
    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        if (redirectsEnabled != null && redirectsEnabled) {
            HttpServletRequest request = (HttpServletRequest) req;
            HttpServletResponse response = (HttpServletResponse) res;
    
            String servletPath = request.getServletPath();
    
            if (servletPath == null || "".equals(servletPath)) {
                servletPath = "/";
            }
    
            if (redirects.containsKey(servletPath)) {
                response.sendRedirect(redirects.get(servletPath));
                return;
            }
        }
        chain.doFilter(req, res);
    }

    /**
     * @see jakarta.servlet.Filter#destroy()
     */
    @Override
    public void destroy() {
    }

}
