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

package test.io.apicurio.hub.api;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

/**
 * @author eric.wittmann@gmail.com
 */
public class MockHttpServletResponse implements HttpServletResponse {
    
    private Map<String, String> headers = new HashMap<>();
    private int status;

    /**
     * @see javax.servlet.ServletResponse#getCharacterEncoding()
     */
    @Override
    public String getCharacterEncoding() {
        return null;
    }

    /**
     * @see javax.servlet.ServletResponse#getContentType()
     */
    @Override
    public String getContentType() {
        return null;
    }

    /**
     * @see javax.servlet.ServletResponse#getOutputStream()
     */
    @Override
    public ServletOutputStream getOutputStream() throws IOException {
        return null;
    }

    /**
     * @see javax.servlet.ServletResponse#getWriter()
     */
    @Override
    public PrintWriter getWriter() throws IOException {
        return null;
    }

    /**
     * @see javax.servlet.ServletResponse#setCharacterEncoding(java.lang.String)
     */
    @Override
    public void setCharacterEncoding(String charset) {
    }

    /**
     * @see javax.servlet.ServletResponse#setContentLength(int)
     */
    @Override
    public void setContentLength(int len) {
    }

    /**
     * @see javax.servlet.ServletResponse#setContentType(java.lang.String)
     */
    @Override
    public void setContentType(String type) {
    }

    /**
     * @see javax.servlet.ServletResponse#setBufferSize(int)
     */
    @Override
    public void setBufferSize(int size) {
    }

    /**
     * @see javax.servlet.ServletResponse#getBufferSize()
     */
    @Override
    public int getBufferSize() {
        return 0;
    }

    /**
     * @see javax.servlet.ServletResponse#flushBuffer()
     */
    @Override
    public void flushBuffer() throws IOException {
    }

    /**
     * @see javax.servlet.ServletResponse#resetBuffer()
     */
    @Override
    public void resetBuffer() {
    }

    /**
     * @see javax.servlet.ServletResponse#isCommitted()
     */
    @Override
    public boolean isCommitted() {
        return false;
    }

    /**
     * @see javax.servlet.ServletResponse#reset()
     */
    @Override
    public void reset() {
    }

    /**
     * @see javax.servlet.ServletResponse#setLocale(java.util.Locale)
     */
    @Override
    public void setLocale(Locale loc) {
    }

    /**
     * @see javax.servlet.ServletResponse#getLocale()
     */
    @Override
    public Locale getLocale() {
        return Locale.getDefault();
    }

    /**
     * @see javax.servlet.http.HttpServletResponse#addCookie(javax.servlet.http.Cookie)
     */
    @Override
    public void addCookie(Cookie cookie) {
    }

    /**
     * @see javax.servlet.http.HttpServletResponse#containsHeader(java.lang.String)
     */
    @Override
    public boolean containsHeader(String name) {
        return this.headers.containsKey(name);
    }

    /**
     * @see javax.servlet.http.HttpServletResponse#encodeURL(java.lang.String)
     */
    @Override
    public String encodeURL(String url) {
        return null;
    }

    /**
     * @see javax.servlet.http.HttpServletResponse#encodeRedirectURL(java.lang.String)
     */
    @Override
    public String encodeRedirectURL(String url) {
        return null;
    }

    /**
     * @see javax.servlet.http.HttpServletResponse#encodeUrl(java.lang.String)
     */
    @Override
    public String encodeUrl(String url) {
        return null;
    }

    /**
     * @see javax.servlet.http.HttpServletResponse#encodeRedirectUrl(java.lang.String)
     */
    @Override
    public String encodeRedirectUrl(String url) {
        return null;
    }

    /**
     * @see javax.servlet.http.HttpServletResponse#sendError(int,
     *      java.lang.String)
     */
    @Override
    public void sendError(int sc, String msg) throws IOException {
        this.setStatus(sc);
    }

    /**
     * @see javax.servlet.http.HttpServletResponse#sendError(int)
     */
    @Override
    public void sendError(int sc) throws IOException {
        this.setStatus(sc);
    }

    /**
     * @see javax.servlet.http.HttpServletResponse#sendRedirect(java.lang.String)
     */
    @Override
    public void sendRedirect(String location) throws IOException {
    }

    /**
     * @see javax.servlet.http.HttpServletResponse#setDateHeader(java.lang.String,
     *      long)
     */
    @Override
    public void setDateHeader(String name, long date) {
        this.setHeader(name, String.valueOf(date));
    }

    /**
     * @see javax.servlet.http.HttpServletResponse#addDateHeader(java.lang.String,
     *      long)
     */
    @Override
    public void addDateHeader(String name, long date) {
        this.setHeader(name, String.valueOf(date));
    }

    /**
     * @see javax.servlet.http.HttpServletResponse#setHeader(java.lang.String,
     *      java.lang.String)
     */
    @Override
    public void setHeader(String name, String value) {
        this.headers.put(name, value);
    }

    /**
     * @see javax.servlet.http.HttpServletResponse#addHeader(java.lang.String,
     *      java.lang.String)
     */
    @Override
    public void addHeader(String name, String value) {
        this.headers.put(name, value);
    }

    /**
     * @see javax.servlet.http.HttpServletResponse#setIntHeader(java.lang.String,
     *      int)
     */
    @Override
    public void setIntHeader(String name, int value) {
        this.setHeader(name, String.valueOf(value));
    }

    /**
     * @see javax.servlet.http.HttpServletResponse#addIntHeader(java.lang.String,
     *      int)
     */
    @Override
    public void addIntHeader(String name, int value) {
        this.setHeader(name, String.valueOf(value));
    }

    /**
     * @see javax.servlet.http.HttpServletResponse#setStatus(int)
     */
    @Override
    public void setStatus(int sc) {
        this.status = sc;
    }

    /**
     * @see javax.servlet.http.HttpServletResponse#setStatus(int,
     *      java.lang.String)
     */
    @Override
    public void setStatus(int sc, String sm) {
        this.status = sc;
    }

    /**
     * @see javax.servlet.http.HttpServletResponse#getStatus()
     */
    @Override
    public int getStatus() {
        return this.status;
    }

    /**
     * @see javax.servlet.http.HttpServletResponse#getHeader(java.lang.String)
     */
    @Override
    public String getHeader(String name) {
        return this.headers.get(name);
    }

    /**
     * @see javax.servlet.http.HttpServletResponse#getHeaders(java.lang.String)
     */
    @Override
    public Collection<String> getHeaders(String name) {
        return Collections.singleton(this.getHeader(name));
    }

    /**
     * @see javax.servlet.http.HttpServletResponse#getHeaderNames()
     */
    @Override
    public Collection<String> getHeaderNames() {
        return this.headers.keySet();
    }

}
