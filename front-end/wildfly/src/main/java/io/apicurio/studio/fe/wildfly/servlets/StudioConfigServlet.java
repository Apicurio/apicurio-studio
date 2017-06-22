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

package io.apicurio.studio.fe.wildfly.servlets;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.JsonEncoding;
import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.apicurio.studio.fe.wildfly.beans.AccessTokenResponse;
import io.apicurio.studio.fe.wildfly.filters.GitHubAuthenticationFilter;
import io.apicurio.studio.shared.beans.StudioConfig;
import io.apicurio.studio.shared.beans.StudioConfigAuth;
import io.apicurio.studio.shared.beans.StudioConfigAuthType;
import io.apicurio.studio.shared.beans.User;

/**
 * A servlet that generates a "config.js" file, which is used by the Apicurio Studio
 * Angular application on startup.
 * 
 * @author eric.wittmann@gmail.com
 */
public class StudioConfigServlet extends HttpServlet {
    
    private static final long serialVersionUID = -4719439088893434221L;

    /**
     * @see javax.servlet.http.HttpServlet#doGet(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        JsonFactory f = new JsonFactory();
        try (JsonGenerator g = f.createGenerator(response.getOutputStream(), JsonEncoding.UTF8)) {
            response.getOutputStream().write("var ApicurioStudioConfig = ".getBytes("UTF-8")); //$NON-NLS-1$ //$NON-NLS-2$
            ObjectMapper mapper = new ObjectMapper();
            mapper.setSerializationInclusion(Include.NON_NULL);
            g.setCodec(mapper);
            g.useDefaultPrettyPrinter();

            HttpSession session = request.getSession();
            AccessTokenResponse token = (AccessTokenResponse) session.getAttribute(GitHubAuthenticationFilter.TOKEN_KEY);
            User user = (User) session.getAttribute(GitHubAuthenticationFilter.USER_KEY);
            
            if (token == null) {
                response.sendError(403);
                return;
            }

            StudioConfig config = new StudioConfig();
            config.setAuth(new StudioConfigAuth());
            config.getAuth().setType(StudioConfigAuthType.token);
            config.getAuth().setToken(token.getAccess_token());
            config.getAuth().setLogoutUrl(request.getContextPath() + "/logout");
            config.setUser(user);
            
            g.writeObject(config);

            g.flush();
            response.getOutputStream().write(";".getBytes("UTF-8")); //$NON-NLS-1$ //$NON-NLS-2$
        } catch (Exception e) {
            throw new ServletException(e);
        }
    }

}
