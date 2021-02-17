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

package io.apicurio.hub.api.codegen.util;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import com.sun.codemodel.CodeWriter;
import com.sun.codemodel.JPackage;

import io.apicurio.hub.api.codegen.beans.CodegenJavaBean;

/**
 * @author eric.wittmann@gmail.com
 */
public class IndexedCodeWriter extends CodeWriter {
    
    private Map<String, ByteArrayOutputStream> contentIndex = new HashMap<>();
    private Map<String, CodegenJavaBean> beanIndex = new HashMap<>();
    
    /**
     * Constructor.
     */
    public IndexedCodeWriter() {
    }

    /**
     * @see com.sun.codemodel.CodeWriter#openBinary(com.sun.codemodel.JPackage, java.lang.String)
     */
    @Override
    public OutputStream openBinary(JPackage pkg, String fileName) throws IOException {
        String fullname = pkg.name() + "." + fileName;
        fullname = fullname.replace(".java", "");
        ByteArrayOutputStream stream = new ByteArrayOutputStream();
        this.set(fullname, stream);
        return stream;
    }

    /**
     * @see com.sun.codemodel.CodeWriter#close()
     */
    @Override
    public void close() throws IOException {
    }
    
    /**
     * Gets the content produced for a given class name.
     * @param className
     * @throws IOException
     */
    public ByteArrayOutputStream getContent(String className) throws IOException {
        if (this.contentIndex.containsKey(className)) {
            return this.contentIndex.get(className);
        }
        return null;
    }

    /**
     * Gets the bean for a given class name.
     * @param className
     */
    public CodegenJavaBean getBean(String className) {
        if (this.beanIndex.containsKey(className)) {
            return this.beanIndex.get(className);
        }
        return null;
    }
    
    /**
     * Updates the index with the given content.
     * @param className
     * @param data
     */
    public void set(String className, ByteArrayOutputStream data) {
        this.contentIndex.put(className, data);
    }

    /**
     * Gets the keys.
     */
    public Set<String> keys() {
        return this.contentIndex.keySet();
    }

    public void indexBean(String beanClassname, CodegenJavaBean bean) {
        this.beanIndex.put(beanClassname, bean);
    }

}
