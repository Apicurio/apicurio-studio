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

package io.apicurio.hub.core.beans;

/**
 * @author eric.wittmann@gmail.com
 */
public enum ApiContentType {
    
    Document(0), Command(1), Publish(2), Mock(3), Template(4);

    private final int id;
    
    /**
     * Constructor.
     */
    private ApiContentType(int id) {
        this.id = id;
    }
    
    /**
     * @return the id
     */
    public int getId() {
        return id;
    }
    
    /**
     * Gets an ApiContenType from its ID value.
     * @param id
     */
    public static ApiContentType fromId(int id) {
        if (id == 0) {
            return Document;
        }
        if (id == 1) {
            return Command;
        }
        if (id == 2) {
            return Publish;
        }
        if (id == 3) {
            return Mock;
        }
        if (id == 4) {
            return Template;
        }
        return null;
    }
    
}
