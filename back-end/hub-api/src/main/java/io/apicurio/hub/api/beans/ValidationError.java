/*
 * Copyright 2019 Red Hat
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

package io.apicurio.hub.api.beans;

/**
 * @author eric.wittmann@gmail.com
 */
public class ValidationError {

    public String errorCode;
    public String nodePath;
    public String property;
    public String message;
    public String severity;

    /**
     * Constructor.
     */
    public ValidationError() {
    }

    /**
     * Constructor.
     * @param errorCode
     * @param nodePath
     * @param property
     * @param message
     * @param severity
     */
    public ValidationError(String errorCode, String nodePath, String property, String message,
            String severity) {
        this.errorCode = errorCode;
        this.nodePath = nodePath;
        this.property = property;
        this.message = message;
        this.severity = severity;
    }

}
