/*
 * Copyright 2020 JBoss Inc
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


import io.apicurio.studio.fe.servlet.config.StudioUiConfiguration;
import org.apache.commons.io.IOUtils;
import org.apache.http.Header;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustStrategy;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.ssl.SSLContexts;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.inject.Inject;
import javax.net.ssl.SSLContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.Date;

/**
 * Servlet used to download content (e.g. an API design).
 *
 * @author carles.arnal@redhat.com
 */
public abstract class DownloadServlet extends HttpServlet {

    private static final Logger logger = LoggerFactory.getLogger(DownloadServlet.class);

    @Inject
    private StudioUiConfiguration uiConfig;
    private CloseableHttpClient httpClient;

    @PostConstruct
    protected void postConstruct() {
        try {
            if (uiConfig.isDisableHubApiTrustManager()) {
                SSLContext sslContext = SSLContexts.custom().loadTrustMaterial(null, new TrustStrategy() {
                    @Override
                    public boolean isTrusted(X509Certificate[] chain, String authType)
                            throws CertificateException {
                        return true;
                    }
                }).build();
                SSLConnectionSocketFactory sslsf = new SSLConnectionSocketFactory(sslContext, NoopHostnameVerifier.INSTANCE);
                httpClient = HttpClients.custom().setSSLSocketFactory(sslsf).build();
            } else {
                httpClient = HttpClients.createSystem();
            }
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
        String type = req.getParameter("type");
        if ("api".equals(type)) {
            String format = req.getParameter("format");
            String designId = req.getParameter("id");
            String dereference = req.getParameter("dereference");

            String url = generateHubApiUrl(req);
            if (url.endsWith("/")) {
                url = url.substring(0, url.length() - 1);
            }
            url += "/designs/{designId}/content?format={format}"
                    .replace("{designId}", designId)
                    .replace("{format}", format);

            if (dereference != null) {
                url += "&dereference=" + dereference;
            }

            disableHttpCaching(resp);
            proxyUrlTo(url, req, resp);
        } else if ("codegen".equals(type)) {
            String designId = req.getParameter("designId");
            String projectId = req.getParameter("projectId");

            String url = generateHubApiUrl(req);
            if (url.endsWith("/")) {
                url = url.substring(0, url.length() - 1);
            }
            url += "/designs/{designId}/codegen/projects/{projectId}/zip"
                    .replace("{designId}", designId)
                    .replace("{projectId}", projectId);

            disableHttpCaching(resp);
            proxyUrlTo(url, req, resp);
        } else {
            resp.sendError(404);
        }
    }

    /**
     * Makes an HTTP connect to the given url and then proxies the response to
     * the given HTTP response.
     *
     * @param url
     * @param request
     * @param response
     */
    protected abstract void proxyUrlTo(String url, HttpServletRequest request, HttpServletResponse response);

    protected void proxyUrlWithToken(String token, String url, HttpServletResponse response) {
        try {
            HttpGet get = new HttpGet(url);

            get.addHeader("Authorization", "Bearer " + token);

            try (CloseableHttpResponse apiResponse = httpClient.execute(get)) {
                Header ct = apiResponse.getFirstHeader("Content-Type");
                Header cl = apiResponse.getFirstHeader("Content-Length");
                Header cd = apiResponse.getFirstHeader("Content-Disposition");
                if (ct != null)
                    response.setHeader("Content-Type", ct.getValue());
                if (cl != null)
                    response.setHeader("Content-Length", cl.getValue());
                if (cd != null)
                    response.setHeader("Content-Disposition", cd.getValue());
                InputStream stream = apiResponse.getEntity().getContent();
                IOUtils.copy(stream, response.getOutputStream());
                response.getOutputStream().flush();
            }
        } catch (IOException | IllegalStateException e) {
            logger.error("Error proxying URL: " + url, e);
            try {
                response.sendError(500);
            } catch (IOException e1) {
            }
        }
    }

    /**
     * Generates a URL that the caller can use to access the Hub API.
     *
     * @param request
     */
    private String generateHubApiUrl(HttpServletRequest request) {
        try {
            String url = this.uiConfig.getHubApiUrl();
            if (url == null) {
                url = request.getRequestURL().toString();
                url = new URI(url).resolve("/api-hub").toString();
            }
            return url;
        } catch (URISyntaxException e) {
            logger.error("Error generating hub API URL.", e);
            throw new RuntimeException(e);
        }
    }

    /**
     * Disable caching.
     *
     * @param httpResponse
     */
    private static void disableHttpCaching(HttpServletResponse httpResponse) {
        Date now = new Date();
        httpResponse.setDateHeader("Date", now.getTime()); //$NON-NLS-1$
        httpResponse.setDateHeader("Expires", expiredSinceYesterday(now)); //$NON-NLS-1$
        httpResponse.setHeader("Pragma", "no-cache"); //$NON-NLS-1$ //$NON-NLS-2$
        httpResponse.setHeader("Cache-control", "no-cache, no-store, must-revalidate"); //$NON-NLS-1$ //$NON-NLS-2$
    }

    private static long expiredSinceYesterday(Date now) {
        return now.getTime() - 86400000L;
    }
}
