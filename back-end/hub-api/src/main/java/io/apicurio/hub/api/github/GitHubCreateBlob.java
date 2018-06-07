/*
 * Copyright 2018 JBoss Inc
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

package io.apicurio.hub.api.github;

import java.io.IOException;
import java.io.InputStream;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.IOUtils;

/**
 * @author eric.wittmann@gmail.com
 */
public class GitHubCreateBlob {

    private String content;
    private String encoding = "utf-8";
    
    /**
     * Constructor.
     */
    public GitHubCreateBlob() {
    }

    /**
     * @return the content
     */
    public String getContent() {
        return content;
    }

    /**
     * @param content the content to set
     */
    public void setContent(String content) {
        this.content = content;
    }
    
    /**
     * @param content the content to set
     */
    public void setContent(byte [] content) {
        this.content = Base64.encodeBase64String(content);
        this.encoding = "base64";
    }

    /**
     * @param content the content to set
     */
    public void setContent(InputStream content) throws IOException {
        this.content = Base64.encodeBase64String(IOUtils.toByteArray(content));
        this.encoding = "base64";
    }

    /**
     * @return the encoding
     */
    public String getEncoding() {
        return encoding;
    }

    /**
     * @param encoding the encoding to set
     */
    public void setEncoding(String encoding) {
        this.encoding = encoding;
    }
    
}
