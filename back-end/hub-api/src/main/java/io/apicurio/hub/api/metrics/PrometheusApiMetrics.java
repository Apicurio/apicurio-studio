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
import java.io.StringWriter;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;

import io.apicurio.hub.core.beans.ApiDesignType;
import io.apicurio.hub.core.beans.LinkedAccountType;
import io.prometheus.client.CollectorRegistry;
import io.prometheus.client.Counter;
import io.prometheus.client.exporter.common.TextFormat;

/**
 * An implementation of the metrics interface that exposes metrics to
 * Prometheus.  Uses the prometheus simple client to collect the metric 
 * information.  The /system/metrics endpoint is then available for 
 * prometheus to scrape.
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class PrometheusApiMetrics implements IApiMetrics {
    
    static final Counter apiRequests = Counter.build().labelNames("endpoint", "method")
            .name("apicurio_api_calls_total").help("Total number of API calls made.").register();
    static final Counter apisCreated = Counter.build().labelNames("type")
            .name("apicurio_api_creates").help("Total number of APIs created.").register();
    static final Counter apisImported = Counter.build().labelNames("from")
            .name("apicurio_api_imports").help("Total number of APIs imported.").register();

    static final Counter accountLinksInitiated = Counter.build().labelNames("type")
            .name("apicurio_account_initiated").help("Total number of Linked Accounts initiated.").register();
    static final Counter accountLinksCompleted = Counter.build().labelNames("type")
            .name("apicurio_account_creates").help("Total number of Linked Accounts completed.").register();

    @PostConstruct
    void postConstruct() {
        // The JVM metrics leak too much information!  Disable for now.
        //DefaultExports.initialize();
    }

    /**
     * @see io.apicurio.hub.api.metrics.IApiMetrics#getCurrentMetricsInfo()
     */
    @Override
    public String getCurrentMetricsInfo() throws IOException {
        StringWriter writer = new StringWriter();
        TextFormat.write004(writer, CollectorRegistry.defaultRegistry.metricFamilySamples());

        String content = writer.getBuffer().toString();
        return content;
    }
    
    /**
     * @see io.apicurio.hub.api.metrics.IApiMetrics#apiCall(java.lang.String, java.lang.String)
     */
    @Override
    public void apiCall(String endpoint, String method) {
        apiRequests.labels(endpoint, method).inc();;
    }

    /**
     * @see io.apicurio.hub.api.metrics.IApiMetrics#apiCreate(java.lang.String)
     */
    @Override
    public void apiCreate(ApiDesignType type) {
        apisCreated.labels(type.name()).inc();
    }

    /**
     * @see io.apicurio.hub.api.metrics.IApiMetrics#apiImport(io.apicurio.hub.core.beans.LinkedAccountType)
     */
    @Override
    public void apiImport(LinkedAccountType type) {
        if (type == null) {
            apisImported.labels("url");
        } else {
            apisImported.labels(type.name()).inc();
        }
    }
    
    /**
     * @see io.apicurio.hub.api.metrics.IApiMetrics#accountLinkInitiated(io.apicurio.hub.core.beans.LinkedAccountType)
     */
    @Override
    public void accountLinkInitiated(LinkedAccountType type) {
        accountLinksInitiated.labels(type.name()).inc();
    }
    
    /**
     * @see io.apicurio.hub.api.metrics.IApiMetrics#accountLinkCompleted(io.apicurio.hub.core.beans.LinkedAccountType)
     */
    @Override
    public void accountLinkCompleted(LinkedAccountType type) {
        accountLinksCompleted.labels(type.name()).inc();
    }
}
