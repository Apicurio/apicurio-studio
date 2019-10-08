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

package io.apicurio.hub.editing.sharing;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.Writer;
import java.net.URL;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.apicurio.hub.core.beans.ApiDesignContent;
import io.apicurio.hub.core.exceptions.NotFoundException;
import io.apicurio.hub.core.storage.IStorage;
import io.apicurio.hub.core.storage.StorageException;

/**
 * Used when showing generated documentation.
 * 
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class SharingServlet extends HttpServlet {

    private static final long serialVersionUID = -4661205992177464583L;
    private static Logger logger = LoggerFactory.getLogger(SharingServlet.class);

    private static String TEMPLATE_REDOC = null;
    {
        URL templateURL = SharingServlet.class.getResource("preview_redoc.template");
        try {
            TEMPLATE_REDOC = IOUtils.toString(templateURL, Charset.forName("UTF-8"));
        } catch (Exception e) {
            logger.error("Failed to load previe template resource: preview_redoc.template", e);
        }
    }

    @Inject
    private IStorage storage;

    /**
     * @see javax.servlet.http.HttpServlet#doGet(javax.servlet.http.HttpServletRequest,
     *      javax.servlet.http.HttpServletResponse)
     */
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String path = req.getPathInfo();
        if (path == null) {
            // TODO respond with an error and a response payload in JSON
            throw new ServletException("Missing path parameter: UUID");
        }
        
        String uuid = path.replaceAll("/", "");

        boolean content = "true".equals(req.getParameter("content"));
        if (content) {
            doGetContent(resp, uuid);
        } else {
            doGetTemplate(resp, uuid);
        }

    }

    /**
     * Gets the content for the given sharing UUID.
     * @param resp
     * @param uuid
     * @throws ServletException
     * @throws IOException
     */
    private void doGetContent(HttpServletResponse resp, String uuid) throws ServletException, IOException {
        try {
            ApiDesignContent adc = storage.getLatestContentDocumentForSharing(uuid);
            if (adc == null) {
                // TODO respond with an error and a response payload in JSON
                throw new ServletException("Unknown sharing UUID: " + uuid);
            }
            String content = adc.getDocument();
            
            resp.setStatus(HttpServletResponse.SC_OK);
            resp.setContentType("application/json");
            resp.setCharacterEncoding(StandardCharsets.UTF_8.name());

            try (Writer writer = resp.getWriter()) {
                writer.write(content);
                writer.flush();
            }
        } catch (StorageException | NotFoundException e) {
            logger.error("Error detected getting content.", e);
            throw new ServletException("Unknown sharing UUID: " + uuid);
        }
    }
    
    private void doGetTemplate(HttpServletResponse resp, String uuid)
            throws ServletException, IOException {
        logger.debug("Rendering documentation for UUID: {}", uuid);
        
        String specURL = uuid + "?content=true";
        logger.debug("Spec URL: {}", specURL);
        
        String content = TEMPLATE_REDOC.replace("SPEC_URL", specURL);
        resp.setStatus(200);
        resp.setContentLength(content.length());
        resp.setContentType("text/html");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter writer = resp.getWriter();
        writer.print(content);
        writer.flush();
    }


}
