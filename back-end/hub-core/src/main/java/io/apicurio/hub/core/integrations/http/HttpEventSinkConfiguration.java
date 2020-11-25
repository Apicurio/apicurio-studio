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

import java.util.List;
import java.util.Properties;
import java.util.stream.Collectors;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Produces;

import io.apicurio.hub.core.config.HubConfiguration;

/**
 * @author Fabian Martinez
 */
@ApplicationScoped
public class HttpEventSinkConfiguration {

    @Produces
    public HttpSinksConfiguration sinkConfig(HubConfiguration configuration) {
        Properties properties = configuration.getWebhooksConfiguration();
        List<HttpSinkConfiguration> httpSinks = properties.stringPropertyNames().stream()
            .map(key -> new HttpSinkConfiguration(key, properties.getProperty(key)))
            .collect(Collectors.toList());
        return new HttpSinksConfiguration(httpSinks);
    }


}
