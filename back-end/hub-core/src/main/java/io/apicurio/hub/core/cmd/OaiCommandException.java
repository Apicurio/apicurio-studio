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

package io.apicurio.hub.core.cmd;

/**
 * @author eric.wittmann@gmail.com
 */
public class OaiCommandException extends Exception {

    private static final long serialVersionUID = 1008261428922840540L;

    /**
     * Constructor.
     */
    public OaiCommandException(Throwable root) {
        super(root);
    }

}
