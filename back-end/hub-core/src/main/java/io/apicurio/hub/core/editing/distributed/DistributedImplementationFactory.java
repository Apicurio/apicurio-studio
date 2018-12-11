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
