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
package io.apicurio.hub.core.integrations;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * @author Fabian Martinez
 */
@ApplicationScoped
public class EventsServiceImpl implements EventsService {

    private static final Logger log = LoggerFactory.getLogger(EventsServiceImpl.class);

    private ObjectMapper mapper;
    private boolean configuredSinks = false;
    private List<EventSink> subscriptions;
    private ExecutorService executor;

    @Inject
    Instance<EventSink> sinks;

    @PostConstruct
    public void init() {
        for (EventSink sink : sinks) {
            if (sink.isConfigured()) {
                configuredSinks = true;
                if (subscriptions == null) {
                    subscriptions = new ArrayList<>();
                }
                log.info("Subscribing sink " + sink.name());
                subscriptions.add(sink);
            }
        }
        if (configuredSinks) {
            executor = new ThreadPoolExecutor(1, 3, 5, TimeUnit.SECONDS, new LinkedBlockingQueue<Runnable>());
            mapper = new ObjectMapper();
            mapper.setSerializationInclusion(Include.NON_NULL);
        }
    }

    @Override
    public boolean isConfigured() {
        return configuredSinks;
    }

    @Override
    public void triggerEvent(ApicurioEventType type, Object data) {
        if (configuredSinks && data != null) {
            byte[] buffer;
            try {
                buffer = mapper.writeValueAsBytes(data);
            } catch (JsonProcessingException e) {
                log.error("Error serializing event data", e);
                return;
            }
            executor.submit(() -> {
               for (EventSink sink : subscriptions) {
                   try {
                       sink.handle(type, buffer);
                   } catch (Exception e) {
                       log.error("Error sending event in sink " + sink.name(), e);
                   }
               }
            });
        }
    }

}
