/*
 * Copyright 2020 Red Hat
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
package io.apicurio.hub.core.integrations.http;

import java.io.IOException;
import java.util.UUID;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ByteArrayEntity;
import org.apache.http.entity.ContentType;
import org.apache.http.impl.client.HttpClientBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.apicurio.hub.core.integrations.ApicurioEventType;
import io.apicurio.hub.core.integrations.EventSink;

@ApplicationScoped
public class HttpEventSink implements EventSink {

    private static final Logger log = LoggerFactory.getLogger(HttpEventSink.class);

    private HttpClient httpClient;

    @Inject
    HttpSinksConfiguration configuration;

    @PostConstruct
    void init() {
        if (isConfigured()) {
            httpClient = HttpClientBuilder.create().build();
        }
    }

    @Override
    public String name() {
        return "http sink";
    }

    @Override
    public boolean isConfigured() {
        return configuration.isConfigured();
    }

    @Override
    public void handle(ApicurioEventType type, byte[] data) {

        log.info("Firing event " + type);

        for (HttpSinkConfiguration httpSink : configuration.httpSinks()) {
            sendEventHttp(type, httpSink, data);
        }

    }

    private void sendEventHttp(ApicurioEventType type, HttpSinkConfiguration httpSink, byte[] data) {
        try {
            log.debug("Sending event to sink "+httpSink.getName());

            HttpPost request = new HttpPost(httpSink.getEndpoint());
            request.addHeader("ce-id", UUID.randomUUID().toString());
            request.addHeader("ce-specversion", "1.0");
            request.addHeader("ce-source", "apicurio-registry");
            request.addHeader("ce-type", type.cloudEventType());
            request.addHeader("content-type", ContentType.APPLICATION_JSON.getMimeType());
            request.setEntity(new ByteArrayEntity(data, ContentType.APPLICATION_JSON));
            try {
                HttpResponse response = httpClient.execute(request);
                if (response.getStatusLine().getStatusCode() < 200 || response.getStatusLine().getStatusCode() > 299) {
                    log.warn("Http sink {} return status code {}", httpSink.getName(), response.getStatusLine().getStatusCode());
                }
            } catch (IOException e) {
                log.error("Error sending event to " + httpSink.getEndpoint(), e);
            }

        } catch (Exception e) {
            log.error("Error sending http event", e);
        }
    }

}
