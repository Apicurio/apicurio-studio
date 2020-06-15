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

package io.apicurio.hub.core.editing.infinispan;

import io.apicurio.hub.core.config.HubConfiguration;
import io.apicurio.hub.core.editing.ISessionContext;
import io.apicurio.hub.core.editing.events.AbstractEventsHandler;
import io.apicurio.hub.core.editing.events.ActionType;
import io.apicurio.hub.core.editing.events.EventAction;
import io.apicurio.hub.core.editing.events.IEditingSessionExt;
import io.apicurio.hub.core.storage.IRollupExecutor;
import io.apicurio.registry.utils.IoUtil;
import org.infinispan.Cache;
import org.infinispan.configuration.cache.CacheMode;
import org.infinispan.configuration.cache.ConfigurationBuilder;
import org.infinispan.configuration.global.GlobalConfigurationBuilder;
import org.infinispan.configuration.global.TransportConfigurationBuilder;
import org.infinispan.manager.DefaultCacheManager;
import org.infinispan.manager.EmbeddedCacheManager;
import org.infinispan.notifications.Listener;
import org.infinispan.notifications.cachelistener.annotation.CacheEntryCreated;
import org.infinispan.notifications.cachelistener.annotation.CacheEntryModified;
import org.infinispan.notifications.cachelistener.event.CacheEntryEvent;
import org.infinispan.remoting.transport.Address;

import java.util.Map;
import java.util.Properties;

/**
 * @author Ales Justin
 */
@Listener(clustered = true, observation = Listener.Observation.POST)
public class InfinispanEventsHandler extends AbstractEventsHandler {
    private static final String EVENT_ACTION_CACHE = "event-action-cache";
    private static final String COUNTER_CACHE = "counter-cache";

    private EmbeddedCacheManager manager;
    private Cache<String, EventAction> eventActionCache;
    private Cache<String, Map<String, Integer>> counterCache;

    public InfinispanEventsHandler(HubConfiguration configuration, IRollupExecutor rollupExecutor) {
        super(configuration, rollupExecutor);
    }

    @SuppressWarnings("deprecation")
    @Override
    public synchronized void start() {
        if (manager != null) {
            return;
        }

        GlobalConfigurationBuilder gConf = GlobalConfigurationBuilder.defaultClusteredBuilder();
        gConf.serialization().addAdvancedExternalizer(new EventActionExternalizer());

        TransportConfigurationBuilder transport = gConf.transport();
        transport.clusterName(configuration.getInfinispanClusterName());

        Properties transportProperties = configuration.getInfinispanTransportProperties();
        if (transportProperties.size() > 0) {
            transport.withProperties(transportProperties);
        }

        manager = new DefaultCacheManager(gConf.build());

        manager.defineConfiguration(
            EVENT_ACTION_CACHE,
            new ConfigurationBuilder()
                .clustering().cacheMode(CacheMode.REPL_SYNC)
                .build()
        );
        eventActionCache = manager.getCache(EVENT_ACTION_CACHE, true);
        eventActionCache.addListener(this);

        manager.defineConfiguration(
            COUNTER_CACHE,
            new ConfigurationBuilder()
                .clustering().cacheMode(CacheMode.REPL_SYNC)
                .build()
        );
        counterCache = manager.getCache(COUNTER_CACHE, true);
    }

    @Override
    public void removeSession(IEditingSessionExt session) {
        super.removeSession(session);
        send(session.getDesignId(), EventAction.close(null));
    }

    @Override
    public void addSessionContext(String designId, ISessionContext context) {
        Address address = manager.getAddress();
        counterCache.compute(designId, new NodeCounterOp<>(1, address.toString()));
    }

    @Override
    public void removeSessionContext(String designId, ISessionContext context) {
        Address address = manager.getAddress();
        counterCache.compute(designId, new NodeCounterOp<>(-1, address.toString()));
    }

    @CacheEntryCreated
    @CacheEntryModified
    public void handle(CacheEntryEvent<String, EventAction> event) {
        String designId = event.getKey();
        EventAction action = event.getValue();
        ActionType type = action.getType();
        String id = action.getId();

        IEditingSessionExt session = sessions.get(designId);
        if (session != null && type != ActionType.CLOSE) {
            switch (type) {
                case SEND_TO_OTHERS:
                    session.sendToOthers(action.toBaseOperation(), id);
                    return;
                case SEND_TO_LIST:
                    session.sendTo(id);
                    return;
                case SEND_TO_EXECUTE:
                    session.sendTo(action.getOps(), id);
                    return;
                case CLOSE:
                case ROLLUP:
                default:
                    break;
            }
        }

        // only do rollup once - on the event origin node
        if (type == ActionType.CLOSE && event.isOriginLocal()) {
            Map<String, Integer> map = counterCache.get(designId);
            int count = 0;
            // only count live nodes
            for (Address member : manager.getMembers()) {
                count += map.getOrDefault(member.toString(), 0);
            }
            if (count == 0) {
                try {
                    rollup(designId);
                } finally {
                    counterCache.remove(designId);
                    eventActionCache.remove(designId);
                }
            }
        }
    }

    @Override
    public void send(String designId, EventAction action) {
        eventActionCache.put(designId, action);
    }

    @Override
    public void close() {
        try {
            if (eventActionCache != null) {
                eventActionCache.removeListener(this);
            }
        } finally {
            IoUtil.close(manager);
        }
    }
}
