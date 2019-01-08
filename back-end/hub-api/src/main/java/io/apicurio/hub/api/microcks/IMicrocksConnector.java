/*
 * Copyright 2019 JBoss Inc
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

package io.apicurio.hub.api.microcks;

import java.util.Collection;

/**
 * A Microcks specific connector.
 * 
 * @author laurent.broudoux@gmail.com
 */
public interface IMicrocksConnector {

    /**
     * Upload an OAS v3 specification content to Microcks. This will trigger service discovery and mock
     * endpoint publication on the Microcks side.
     * 
     * @param content OAS v3 specification content
     * @throws MicrocksConnectorException if upload fails for any reasons
     */
    public String uploadResourceContent(String content) throws MicrocksConnectorException;

    /**
     * Reserved for future usage.
     * 
     * @return List of repository secrets managed by Microcks server
     * @throws MicrocksConnectorException if connection fails for any reasons
     */
    public Collection<MicrocksSecret> getSecrets() throws MicrocksConnectorException;

    /**
     * Reserved for future usage.
     * 
     * @return List of import jobs managed by Microcks server
     * @throws MicrocksConnectorException if connection fails for any reasons
     */
    public Collection<MicrocksImporter> getImportJobs() throws MicrocksConnectorException;

    /**
     * Reserved for future usage.
     * 
     * @param job Import job to create in Microcks server.
     * @throws MicrocksConnectorException if connection fails for any reasons
     */
    public void createImportJob(MicrocksImporter job) throws MicrocksConnectorException;

    /**
     * Reserved for future usage.
     * 
     * @param job Import job to force import in Microcks server.
     * @throws MicrocksConnectorException if connection fails for any reasons
     */
    public void forceResourceImport(MicrocksImporter job) throws MicrocksConnectorException;
}
