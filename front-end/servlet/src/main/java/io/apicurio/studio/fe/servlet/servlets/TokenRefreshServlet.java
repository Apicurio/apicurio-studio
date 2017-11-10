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

package io.apicurio.studio.fe.servlet.servlets;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.ObjectMapper;

import io.apicurio.studio.fe.servlet.config.RequestAttributeKeys;
import io.apicurio.studio.shared.beans.StudioConfigAuth;

/**
 * A servlet that is invoked by the angular UI layer to refresh the bearer token it is 
 * using to communicate with the back-end API.
 * 
 * @author eric.wittmann@gmail.com
 */
public class TokenRefreshServlet extends HttpServlet {
    private static final long serialVersionUID = -6174425062278223049L;

    private static Logger logger = LoggerFactory.getLogger(TokenRefreshServlet.class);

    /**
     * @see javax.servlet.http.HttpServlet#doGet(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        logger.debug("Refreshing authentication token."); //$NON-NLS-1$

        HttpSession session = request.getSession();
        StudioConfigAuth auth = (StudioConfigAuth) session.getAttribute(RequestAttributeKeys.AUTH_KEY);

        if (auth == null) {
            logger.error("Authentication 'token' is null (not authenticated?)");
            response.sendError(403);
            return;
        }
        
        ObjectMapper mapper = new ObjectMapper();
        response.setContentType("application/json"); //$NON-NLS-1$
        response.setDateHeader("Date", System.currentTimeMillis()); //$NON-NLS-1$
        response.setDateHeader("Expires", System.currentTimeMillis() - 86400000L); //$NON-NLS-1$
        response.setHeader("Pragma", "no-cache"); //$NON-NLS-1$ //$NON-NLS-2$
        response.setHeader("Cache-control", "no-cache, no-store, must-revalidate"); //$NON-NLS-1$ //$NON-NLS-2$
        mapper.writer().writeValue(response.getOutputStream(), auth);
    }

}
