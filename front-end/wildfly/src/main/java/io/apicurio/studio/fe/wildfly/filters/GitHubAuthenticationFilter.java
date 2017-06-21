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

package io.apicurio.studio.fe.wildfly.filters;

import java.io.IOException;
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

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.ObjectMapper;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;

import io.apicurio.studio.fe.wildfly.beans.AccessTokenRequest;
import io.apicurio.studio.fe.wildfly.beans.AccessTokenResponse;

/**
 * @author eric.wittmann@gmail.com
 */
public class GitHubAuthenticationFilter implements Filter {

    private static SecureRandom random = new SecureRandom();
    static {
        Unirest.setObjectMapper(new ObjectMapper() {
            private com.fasterxml.jackson.databind.ObjectMapper jacksonObjectMapper = new com.fasterxml.jackson.databind.ObjectMapper();

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
    private static String CLIENT_ID = "045dc8287fb7f2decbc9"; // TODO get from
    private static String CLIENT_SECRET = "4246c94537cec51e99302738d7092cce2751ae4a";

    private static String TOKEN_KEY = "GitHubAuthenticationFilter.token";
    private static String REDIRECT_KEY = "GitHubAuthenticationFilter.redirectTo";
    private static String STATE_KEY = "GitHubAuthenticationFilter.state";

    /**
     * @see javax.servlet.Filter#init(javax.servlet.FilterConfig)
     */
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
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
            tokenReq.setClient_id(CLIENT_ID);
            tokenReq.setClient_secret(CLIENT_SECRET);
            tokenReq.setCode(code);
            tokenReq.setState(state);

            try {
                HttpResponse<AccessTokenResponse> tokenResp = Unirest.post(ACCESS_TOKEN_URL)
                        .header("Content-Type", "application/json")
                        .header("Accept", "application/json")
                        .body(tokenReq)
                        .asObject(AccessTokenResponse.class);
                session.setAttribute(TOKEN_KEY, tokenResp.getBody());
                String redirectUrl = (String) session.getAttribute(REDIRECT_KEY);
                httpResp.sendRedirect(redirectUrl);
            } catch (UnirestException e) {
                throw new ServletException(e);
            }
        } else {
            if (httpReq.getServletPath().contains("index.html")) {
                AccessTokenResponse token = (AccessTokenResponse) session.getAttribute(TOKEN_KEY);
                if (token == null) {
                    StringBuffer originalAppUrl = httpReq.getRequestURL();
                    String qs = httpReq.getQueryString();
                    if (qs != null && !qs.isEmpty()) {
                        originalAppUrl.append("?").append(qs);
                    }
                    session.setAttribute(REDIRECT_KEY, originalAppUrl.toString());
                    String state = String.valueOf(random.nextInt());
                    session.setAttribute(STATE_KEY, state);
                    httpResp.sendRedirect(AUTH_URL + CLIENT_ID + "&state=" + state);
                } else {
                    chain.doFilter(request, response);
                }
            } else {
                chain.doFilter(request, response);
            }
        }
    }

    /**
     * @see javax.servlet.Filter#destroy()
     */
    @Override
    public void destroy() {
    }

}
