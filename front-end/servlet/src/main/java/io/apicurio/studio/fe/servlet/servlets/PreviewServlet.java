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

package io.apicurio.studio.fe.servlet.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.URL;
import java.nio.charset.Charset;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * A preview servlet for apicurio.  This servlet is responsible for serving up a RedDoc page used to
 * preview documentation for an API.  The user must have access to the API, and the API must exist.
 * The servlet requires the ID of the API to display.
 * @author eric.wittmann@gmail.com
 */
public class PreviewServlet extends HttpServlet {

    private static final long serialVersionUID = 7680564778236525468L;
    private static Logger logger = LoggerFactory.getLogger(PreviewServlet.class);
    
    private static String TEMPLATE_REDOC = null;
    {
        URL templateURL = PreviewServlet.class.getResource("preview_redoc.template");
        try {
            TEMPLATE_REDOC = IOUtils.toString(templateURL, Charset.forName("UTF-8"));
        } catch (Exception e) {
            logger.error("Failed to load previe template resource: preview_redoc.template", e);
        }
    }
    private static String TEMPLATE_RAPIDOC = null;
    {
        URL templateURL = PreviewServlet.class.getResource("preview_rapidoc.template");
        try {
        	TEMPLATE_RAPIDOC = IOUtils.toString(templateURL, Charset.forName("UTF-8"));
        } catch (Exception e) {
            logger.error("Failed to load previe template resource: preview_rapidoc.template", e);
        }
    }

    /**
     * @see javax.servlet.http.HttpServlet#doGet(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
     */
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        String apiId = req.getParameter("aid");
        String rid = req.getParameter("rid");
        
        logger.debug("Rendering document preview for API: {}", apiId);

        String specURL = "download?type=api&format=json&dereference=true&id=" + apiId;
        logger.debug("Spec URL: {}", specURL);
        
        String content;
        if (rid != null && rid.equals("rapidoc")) {
        	content = TEMPLATE_RAPIDOC.replace("SPEC_URL", specURL);
        } else {
        	content = TEMPLATE_REDOC.replace("SPEC_URL", specURL);
        }
        resp.setStatus(200);
        resp.setContentLength(content.length());
        resp.setContentType("text/html");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter writer = resp.getWriter();
        writer.print(content);
        writer.flush();
    }

}
