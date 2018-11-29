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

package io.apicurio.hub.core.metrics;

import io.apicurio.hub.core.editing.IEditingMetrics;
import io.prometheus.client.CollectorRegistry;
import io.prometheus.client.Counter;
import io.prometheus.client.exporter.common.TextFormat;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import java.io.IOException;
import java.io.StringWriter;

/**
 * An implementation of the metrics interface that exposes metrics to
 * Prometheus.  Uses the prometheus simple client to collect the metric 
 * information.  The /metrics endpoint is then available for 
 * prometheus to scrape.
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class PrometheusApiMetrics implements IEditingMetrics {
    
    static final Counter sockets = Counter.build().labelNames("designId", "user")
            .name("apicurio_websockets_total").help("Total number of Web Sockets connected.").register();
    static final Counter sessions = Counter.build().labelNames("designId")
            .name("apicurio_sessions_total").help("Total number of editing sessions created.").register();
    static final Counter commands = Counter.build().labelNames("designId")
            .name("apicurio_commands_total").help("Total number of Commands executed.").register();

    @PostConstruct
    void postConstruct() {
    }
    
    /**
     * @see IEditingMetrics#socketConnected(java.lang.String, java.lang.String)
     */
    @Override
    public void socketConnected(String designId, String user) {
        sockets.labels(designId, user).inc();
        
    }
    
    /**
     * @see IEditingMetrics#editingSessionCreated(java.lang.String)
     */
    @Override
    public void editingSessionCreated(String designId) {
        sessions.labels(designId).inc();
    }
    
    /**
     * @see IEditingMetrics#contentCommand(java.lang.String)
     */
    @Override
    public void contentCommand(String designId) {
        commands.labels(designId).inc();
    }

    /**
     * @see IEditingMetrics#getCurrentMetricsInfo()
     */
    @Override
    public String getCurrentMetricsInfo() throws IOException {
        StringWriter writer = new StringWriter();
        TextFormat.write004(writer, CollectorRegistry.defaultRegistry.metricFamilySamples());

        String content = writer.getBuffer().toString();
        return content;
    }
    
    /**
     * @see IEditingMetrics#undoCommand(java.lang.String, long)
     */
    @Override
    public void undoCommand(String designId, long contentVersion) {
        // Nothing yet.
    }
    
    /**
     * @see IEditingMetrics#redoCommand(java.lang.String, long)
     */
    @Override
    public void redoCommand(String designId, long contentVersion) {
        // Nothing yet
    }
}
