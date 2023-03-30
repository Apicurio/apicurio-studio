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

package io.apicurio.studio.fe.servlet.filters;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.security.SecureRandom;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import kong.unirest.HttpResponse;
import kong.unirest.ObjectMapper;
import kong.unirest.UnirestException;
import org.apache.commons.io.IOUtils;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.JsonProcessingException;
import kong.unirest.Unirest;

import io.apicurio.studio.fe.servlet.beans.AccessTokenRequest;
import io.apicurio.studio.fe.servlet.beans.AccessTokenResponse;
import io.apicurio.studio.fe.servlet.config.RequestAttributeKeys;
import io.apicurio.studio.shared.beans.User;

/**
 * @author eric.wittmann@gmail.com
 */
public class GitHubAuthenticationFilter implements Filter {

    private static SecureRandom random = new SecureRandom();
    private static com.fasterxml.jackson.databind.ObjectMapper jacksonObjectMapper = new com.fasterxml.jackson.databind.ObjectMapper();
    static {
        jacksonObjectMapper.setSerializationInclusion(Include.NON_NULL);
        Unirest.config().setObjectMapper(new ObjectMapper() {
            public <T> T readValue(String value, Class<T> valueType) {
                try {
                    return jacksonObjectMapper.readValue(value, valueType);
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }

            public String writeValue(Object value) {
                try {
                    return jacksonObjectMapper.writeValueAsString(value);
                } catch (JsonProcessingException e) {
                    throw new RuntimeException(e);
                }
            }
        });
    }

    private static String AUTH_URL = "https://github.com/login/oauth/authorize?scope=user:email+repo+read:org&client_id=";
    private static String ACCESS_TOKEN_URL = "https://github.com/login/oauth/access_token";

    private static String REDIRECT_KEY = "GitHubAuthenticationFilter.redirectTo";
    private static String STATE_KEY = "GitHubAuthenticationFilter.state";
    
    private String clientId;
    private String clientSecret;

    /**
     * @see javax.servlet.Filter#init(javax.servlet.FilterConfig)
     */
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        this.clientId = lookupClientId();
        this.clientSecret = lookupClientSecret();
        if (this.clientId == null || this.clientSecret == null) {
            throw new ServletException("Missing clientId or clientSecret for GitHub OAuth authentication.  Please configure both of these as system properties or environment variables:  apicurio.github.auth.clientId|GITHUB_AUTH_CLIENT_ID and apicurio.github.auth.clientSecret|GITHUB_AUTH_CLIENT_SECRET");
        }
    }

    /**
     * @see javax.servlet.Filter#doFilter(javax.servlet.ServletRequest,
     *      javax.servlet.ServletResponse, javax.servlet.FilterChain)
     */
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpReq = (HttpServletRequest) request;
        HttpServletResponse httpResp = (HttpServletResponse) response;
        HttpSession session = httpReq.getSession();

        if (httpReq.getServletPath().endsWith("/callback")) {
            String code = httpReq.getParameter("code");
            String state = (String) session.getAttribute(STATE_KEY);

            AccessTokenRequest tokenReq = new AccessTokenRequest();
            tokenReq.setClient_id(clientId);
            tokenReq.setClient_secret(clientSecret);
            tokenReq.setCode(code);
            tokenReq.setState(state);

            try {
                HttpResponse<AccessTokenResponse> tokenResp = Unirest.post(ACCESS_TOKEN_URL)
                        .header("Content-Type", "application/json")
                        .header("Accept", "application/json")
                        .body(tokenReq)
                        .asObject(AccessTokenResponse.class);
                
                AccessTokenResponse token = tokenResp.getBody();
                session.setAttribute(RequestAttributeKeys.AUTH_KEY, token);
                User user = authenticateUser(token.getAccess_token());
                session.setAttribute(RequestAttributeKeys.USER_KEY, user);

                String redirectUrl = (String) session.getAttribute(REDIRECT_KEY);
                httpResp.sendRedirect(redirectUrl);
            } catch (UnirestException e) {
                throw new ServletException(e);
            }
        } else if (httpReq.getServletPath().endsWith("/logout")) {
            session.removeAttribute(RequestAttributeKeys.AUTH_KEY);
            session.removeAttribute(RequestAttributeKeys.USER_KEY);
            
            String logoutPageHtml = createLogoutPage();
            httpResp.setContentType("text/html");
            httpResp.setContentLength(logoutPageHtml.length());
            httpResp.getWriter().print(logoutPageHtml);
            httpResp.getWriter().flush();
        } else {
            AccessTokenResponse token = (AccessTokenResponse) session.getAttribute(RequestAttributeKeys.AUTH_KEY);
            if (token == null) {
                StringBuffer originalAppUrl = httpReq.getRequestURL();
                String qs = httpReq.getQueryString();
                if (qs != null && !qs.isEmpty()) {
                    originalAppUrl.append("?").append(qs);
                }
                session.setAttribute(REDIRECT_KEY, originalAppUrl.toString());
                String state = String.valueOf(random.nextInt());
                session.setAttribute(STATE_KEY, state);
                String authUrl = AUTH_URL + clientId + "&state=" + state;
                
                String loginPageHtml = createLoginPage(authUrl);
                httpResp.setContentType("text/html");
                httpResp.setContentLength(loginPageHtml.length());
                httpResp.getWriter().print(loginPageHtml);
                httpResp.getWriter().flush();
            } else {
                chain.doFilter(request, response);
            }
        }
    }

    /**
     * Uses the included 'auth.html' template to create a login page and show it to the user.  This
     * login page is only shown if the user hasn't yet authenticated.
     * @param authUrl
     */
    private String createLoginPage(String authUrl) throws ServletException {
        try (InputStream in = getClass().getClassLoader().getResourceAsStream("login.html")) {
            String content = IOUtils.toString(in, Charset.forName("UTF-8"));
            return content.replaceAll("XXX", authUrl);
        } catch (IOException e) {
            throw new ServletException(e);
        }
    }

    /**
     * Uses the included 'auth.html' template to create a login page and show it to the user.  This
     * login page is only shown if the user hasn't yet authenticated.
     */
    private String createLogoutPage() throws ServletException {
        try (InputStream in = getClass().getClassLoader().getResourceAsStream("logout.html")) {
            String content = IOUtils.toString(in, Charset.forName("UTF-8"));
            return content;
        } catch (IOException e) {
            throw new ServletException(e);
        }
    }

    /**
     * Returns the GitHub OAuth client-id.
     */
    private String lookupClientId() {
        String clientId = System.getProperty("apicurio.github.auth.clientId", null);
        if (clientId == null) {
            clientId = System.getenv("GITHUB_AUTH_CLIENT_ID");
        }
        return clientId;
    }

    /**
     * Returns the GitHub OAuth client-secret.
     */
    private String lookupClientSecret() {
        String clientSecret = System.getProperty("apicurio.github.auth.clientSecret", null);
        if (clientSecret == null) {
            clientSecret = System.getenv("GITHUB_AUTH_CLIENT_SECRET");
        }
        return clientSecret;
    }

    /**
     * Fetches information about the authenticated user.  Uses the github access token
     * to make an authenticated call to the GitHub API to fetch the user info.
     * @param token
     */
    private static User authenticateUser(String token) {
        try {
            HttpResponse<String> userResp = Unirest.get("https://api.github.com/user")
                    .header("Accept", "application/json")
                    .header("Authorization", "Bearer " + token)
                    .asString();
            if (userResp.getStatus() != 200) {
                return null;
            } else {
                String json = userResp.getBody();
                User user = jacksonObjectMapper.readerFor(User.class).readValue(json);
                return user;
            }
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * @see javax.servlet.Filter#destroy()
     */
    @Override
    public void destroy() {
    }

}
