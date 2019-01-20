/*
 * Copyright 2018 JBoss Inc
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
package io.apicurio.hub.core.editing.distributed;

import io.apicurio.hub.core.config.HubConfiguration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Instance;
import javax.enterprise.inject.Produces;
import javax.inject.Inject;
import java.util.Map;
import java.util.Optional;
import java.util.TreeMap;

/**
 * Returns user-configured (or default) distributed session factory according to user configuration.
 *
 * Discovers all visible implementations of {@link ApicurioDistributedSessionFactory}, and registers
 * them by type/name {@link ApicurioDistributedSessionFactory#getSessionType()}.
 *
 * @see ApicurioDistributedSessionFactory
 * @see HubConfiguration
 *
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
@ApplicationScoped
public class DistributedImplementationFactory {
    private static Logger logger = LoggerFactory.getLogger(DistributedImplementationFactory.class);

    @Inject
    private HubConfiguration config;

    @Inject
    private Instance<ApicurioDistributedSessionFactory> implInstances;

    private Map<String, ApicurioDistributedSessionFactory> implMap = new TreeMap<>(String.CASE_INSENSITIVE_ORDER);

    @PostConstruct
    public void setup() {
        for (ApicurioDistributedSessionFactory factory : implInstances) {
            implMap.put(factory.getSessionType(), factory);
            logger.debug("Registering distributed session factory: {}.", factory.getSessionType());
        }
    }

    @Produces
    public ApicurioDistributedSessionFactory getImplementation() {
        return Optional
                .ofNullable(implMap.get(config.getDistributedSessionType()))
                .orElseThrow(() -> new IllegalArgumentException(buildExceptionMessage()));
    }

    private String buildExceptionMessage() {
        String availableTypes = String.join(", ", implMap.keySet());
        return "Configured session type " + config.getDistributedSessionType() +  " does not exist.\n" +
                "Available types: " + availableTypes;
    }
}
