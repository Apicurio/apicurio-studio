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

package io.apicurio.studio.fe.servlet.servlets;

import java.io.IOException;
import java.io.InputStream;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.apache.http.Header;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.cache.CacheConfig;
import org.apache.http.impl.client.cache.CachingHttpClients;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Servlet used to fetch external content to avoid CORS issues.
 * @author eric.wittmann@gmail.com
 */
public class FetchServlet extends HttpServlet {
    
    private static final long serialVersionUID = -3103265971135926034L;
    private static Logger logger = LoggerFactory.getLogger(FetchServlet.class);
    
    private CloseableHttpClient httpClient;

    @PostConstruct
    protected void postConstruct() {
        try {
            // TODO make these settings configurable!!
            CacheConfig cacheConfig = CacheConfig.custom()
                    .setMaxCacheEntries(2000)
                    .setMaxObjectSize(16384)
                    .build();
            RequestConfig requestConfig = RequestConfig.custom()
                    .setConnectTimeout(30000)
                    .setSocketTimeout(30000)
                    .build();
            this.httpClient = CachingHttpClients.custom()
                    .setCacheConfig(cacheConfig)
                    .setDefaultRequestConfig(requestConfig)
                    .build();
        } catch (Exception e) {
            logger.error("Error creating HTTP client.", e);
            throw new RuntimeException(e);
        }
    }
    
    @PreDestroy
    protected void preDestroy() {
        try {
            httpClient.close();
        } catch (IOException e) {
            logger.error("Error closing HTTP client.", e);
        }
    }
    
    /**
     * @see javax.servlet.http.HttpServlet#doGet(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
     */
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String url = req.getParameter("url");
        proxyUrlTo(url, req, resp);
    }

    /**
     * Makes an HTTP connect to the given url and then proxies the response to
     * the given HTTP response.
     * @param url
     * @param request
     * @param response
     */
    private void proxyUrlTo(String url, HttpServletRequest request, HttpServletResponse response) {
        try {
            HttpGet get = new HttpGet(url);
            try (CloseableHttpResponse apiResponse = httpClient.execute(get)) {
                response.setStatus(apiResponse.getStatusLine().getStatusCode());
                Header[] headers = apiResponse.getAllHeaders();
                for (Header header : headers) {
                    response.setHeader(header.getName(), header.getValue());
                }
                InputStream stream = apiResponse.getEntity().getContent();
                IOUtils.copy(stream, response.getOutputStream());
                response.getOutputStream().flush();
            }            
        } catch (IOException e) {
            logger.error("Error proxying URL: " + url, e);
            try { response.sendError(500); } catch (IOException e1) {}
        }
    }

}
