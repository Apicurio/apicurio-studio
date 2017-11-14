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

import io.prometheus.client.CollectorRegistry;
import io.prometheus.client.Counter;
import io.prometheus.client.exporter.common.TextFormat;
import io.prometheus.client.hotspot.DefaultExports;

/**
 * An implementation of the metrics interface that exposes metrics to
 * Prometheus.  Uses the prometheus simple client to collect the metric 
 * information.  The /system/metrics endpoint is then available for 
 * prometheus to scrape.
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class PrometheusMetrics implements IMetrics {
    
    static final Counter apiRequests = Counter.build().name("apicurio_api_calls_total").help("Total number of API calls made.").register();
    
    @PostConstruct
    void postConstruct() {
        DefaultExports.initialize();
    }

    /**
     * @see io.apicurio.hub.api.metrics.IMetrics#getCurrentMetricsInfo()
     */
    @Override
    public String getCurrentMetricsInfo() throws IOException {
        StringWriter writer = new StringWriter();
        TextFormat.write004(writer, CollectorRegistry.defaultRegistry.metricFamilySamples());

        String content = writer.getBuffer().toString();
        return content;
    }
    
    /**
     * @see io.apicurio.hub.api.metrics.IMetrics#apiCall(java.lang.String, java.lang.String)
     */
    @Override
    public void apiCall(String endpoint, String method) {
        apiRequests.inc();
    }
    
}
