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

package io.apicurio.hub.api.metrics;

import java.io.IOException;

import io.apicurio.hub.core.beans.ApiDesignType;
import io.apicurio.hub.core.beans.LinkedAccountType;

/**
 * Interface used to report metrics information for the Hub API.
 * @author eric.wittmann@gmail.com
 */
public interface IApiMetrics {

    /**
     * Returns the current state of the metrics.  This information is typically presented
     * via a REST API or servlet.
     * @return metrics information
     */
    public String getCurrentMetricsInfo() throws IOException;

    /**
     * Indicates an API call was made.
     * @param endpoint
     * @param method
     */
    public void apiCall(String endpoint, String method);

    /**
     * Indicates that an API was created.
     * @param specVersion
     */
    public void apiCreate(ApiDesignType type);

    /**
     * Indicates that an API was imported.
     * @param type
     */
    public void apiImport(LinkedAccountType type);

    /**
     * Indicates a linked account creation was initiated.
     * @param type
     */
    public void accountLinkInitiated(LinkedAccountType type);

    /**
     * Indicates that a linked account was successfully created.
     * @param type
     */
    public void accountLinkCompleted(LinkedAccountType type);

}
