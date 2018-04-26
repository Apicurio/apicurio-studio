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
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.net.ssl.SSLContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.apache.http.Header;
import org.apache.http.NameValuePair;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URLEncodedUtils;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustSelfSignedStrategy;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.ssl.SSLContexts;
import org.keycloak.KeycloakSecurityContext;

import io.apicurio.studio.fe.servlet.config.StudioUiConfiguration;

/**
 * Servlet used to download content (e.g. an API design).
 * @author eric.wittmann@gmail.com
 */
public class DownloadServlet extends HttpServlet {
    
    private static final long serialVersionUID = 8432874125909707075L;
    
    @Inject
    private StudioUiConfiguration uiConfig;
    private CloseableHttpClient httpClient;

    @PostConstruct
    protected void postConstruct() {
        try {
            if (uiConfig.isDisableHubApiTrustManager()) {
                SSLContext sslContext = SSLContexts.custom().loadTrustMaterial(null, new TrustSelfSignedStrategy()).build();
                SSLConnectionSocketFactory sslsf = new SSLConnectionSocketFactory(sslContext, NoopHostnameVerifier.INSTANCE);
                httpClient = HttpClients.custom().setSSLSocketFactory(sslsf).build();
            } else {
                httpClient = HttpClients.createSystem();
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    
    /**
     * @see javax.servlet.http.HttpServlet#doGet(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
     */
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Map<String, String> params = parseQueryString(req.getQueryString());
        String type = params.get("type");
        if ("api".equals(type)) {
            String format = params.get("format");
            String designId = params.get("id");
            
            String url = generateHubApiUrl(req);
            if (url.endsWith("/")) {
                url = url.substring(0, url.length() - 1);
            }
            url += "/designs/{designId}/content?format={format}".replace("{designId}", designId).replace("{format}", format);
            
            disableHttpCaching(resp);
            proxyUrlTo(url, req, resp);
        } else if ("codegen-swarm".equals(type)) {
            String designId = params.get("id");
            String groupId = params.get("groupId");
            String artifactId = params.get("artifactId");
            String javaPackage = params.get("package");
            
            String url = generateHubApiUrl(req);
            if (url.endsWith("/")) {
                url = url.substring(0, url.length() - 1);
            }
            url += "/designs/{designId}/codegen/swarm?groupId={groupId}&artifactId={artifactId}&package={package}"
                    .replace("{designId}", designId)
                    .replace("{groupId}", groupId)
                    .replace("{artifactId}", artifactId)
                    .replace("{package}", javaPackage);
            
            disableHttpCaching(resp);
            proxyUrlTo(url, req, resp);
        } else {
            resp.sendError(404);
        }
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
            KeycloakSecurityContext session = (KeycloakSecurityContext) request.getAttribute(KeycloakSecurityContext.class.getName());
            get.addHeader("Authorization", "Bearer " + session.getTokenString());

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
        } catch (IOException e) {
            try { response.sendError(500); } catch (IOException e1) {}
        }
    }

    /**
     * Parses the query string into a map.
     * @param queryString
     */
    protected static Map<String, String> parseQueryString(String queryString) {
        Map<String, String> rval = new HashMap<>();
        if (queryString != null) {
            List<NameValuePair> list = URLEncodedUtils.parse(queryString, StandardCharsets.UTF_8);
            for (NameValuePair nameValuePair : list) {
                rval.put(nameValuePair.getName(), nameValuePair.getValue());
            }
        }
        return rval;
    }

    /**
     * Generates a URL that the caller can use to access the Hub API.
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
            throw new RuntimeException(e);
        }
    }
    
    /**
     * Disable caching.
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