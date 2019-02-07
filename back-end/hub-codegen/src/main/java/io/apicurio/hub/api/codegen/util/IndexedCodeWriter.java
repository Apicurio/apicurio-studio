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

/**
 * @author eric.wittmann@gmail.com
 */
public class IndexedCodeWriter extends CodeWriter {
    
    private Map<String, ByteArrayOutputStream> index = new HashMap<>();
    
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
        this.index.put(fullname, stream);
        return stream;
    }

    /**
     * @see com.sun.codemodel.CodeWriter#close()
     */
    @Override
    public void close() throws IOException {
    }
    
    /**
     * Gets the content produced for a given filename.
     * @param className
     * @throws IOException
     */
    public String get(String className) throws IOException {
        if (this.index.containsKey(className)) {
            return this.index.get(className).toString("UTF-8");
        }
        return null;
    }

    /**
     * Gets the keys.
     */
    public Set<String> getKeys() {
        return this.index.keySet();
    }

}
