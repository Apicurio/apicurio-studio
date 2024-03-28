package io.apicurio.deployment;

import io.fabric8.kubernetes.api.model.Namespace;
import io.fabric8.kubernetes.api.model.PodList;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.KubernetesClientBuilder;
import io.fabric8.kubernetes.client.LocalPortForward;
import io.fabric8.kubernetes.client.dsl.LogWatch;
import io.fabric8.kubernetes.client.dsl.Resource;
import io.fabric8.openshift.api.model.Route;
import io.fabric8.openshift.client.DefaultOpenShiftClient;
import io.fabric8.openshift.client.OpenShiftClient;

import org.apache.commons.io.IOUtils;
import org.junit.platform.launcher.TestExecutionListener;
import org.junit.platform.launcher.TestPlan;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import static io.apicurio.deployment.Constants.STUDIO_IMAGE;
import static io.apicurio.deployment.KubernetesTestResources.APPLICATION_SERVICE;
import static io.apicurio.deployment.KubernetesTestResources.E2E_NAMESPACE_RESOURCE;
import static io.apicurio.deployment.KubernetesTestResources.KEYCLOAK_RESOURCES;
import static io.apicurio.deployment.KubernetesTestResources.STUDIO_OPENSHIFT_ROUTE;
import static io.apicurio.deployment.KubernetesTestResources.TEST_NAMESPACE;

@SuppressWarnings({ "resource", "deprecation" })
public class StudioDeploymentManager implements TestExecutionListener {

    private static final Logger LOGGER = LoggerFactory.getLogger(StudioDeploymentManager.class);

    static KubernetesClient kubernetesClient;
    static LocalPortForward studioPortForward;

    static List<LogWatch> logWatch;

    @Override
    public void testPlanExecutionStarted(TestPlan testPlan) {
        if (Boolean.parseBoolean(System.getProperty("cluster.tests"))) {

            kubernetesClient = new KubernetesClientBuilder()
                    .build();

            try {
                handleInfraDeployment();
            } catch (Exception e) {
                LOGGER.error("Error starting studio deployment", e);
            }

            LOGGER.info("Test suite started ##################################################");
        }
    }

    @Override
    public void testPlanExecutionFinished(TestPlan testPlan) {
        LOGGER.info("Test suite ended ##################################################");

        //Finally, once the testsuite is done, cleanup all the resources in the cluster
        if (kubernetesClient != null && !(Boolean.parseBoolean(System.getProperty("preserveNamespace")))) {
            LOGGER.info("Closing test resources ##################################################");

            if (studioPortForward != null) {
                try {
                    studioPortForward.close();
                } catch (IOException e) {
                    LOGGER.warn("Error closing studio port forward", e);
                }
            }

            if (logWatch != null && !logWatch.isEmpty()) {
                logWatch.forEach(LogWatch::close);
            }

            final Resource<Namespace> namespaceResource = kubernetesClient.namespaces()
                    .withName(TEST_NAMESPACE);
            namespaceResource.delete();

            // wait the namespace to be deleted
            CompletableFuture<List<Namespace>> namespace = namespaceResource
                    .informOnCondition(Collection::isEmpty);

            try {
                namespace.get(60, TimeUnit.SECONDS);
            } catch (ExecutionException | InterruptedException | TimeoutException e) {
                LOGGER.warn("Error waiting for namespace deletion", e);
            } finally {
                namespace.cancel(true);
            }
            kubernetesClient.close();
        }
    }

    private void handleInfraDeployment() throws Exception {
        //First, create the namespace used for the test.
        kubernetesClient.load(getClass().getResourceAsStream(E2E_NAMESPACE_RESOURCE))
                .create();

        //Based on the configuration, deploy the appropriate variant
        if (Boolean.parseBoolean(System.getProperty("deployInMemory"))) {
            LOGGER.info("Deploying In Memory Studio Variant with image: {} ##################################################", System.getProperty("studio-in-memory-image"));
            InMemoryDeploymentManager.deployInMemoryApp(System.getProperty("studio-in-memory-image"));
            logWatch = streamPodLogs("apicurio-studio-memory");
        } else if (Boolean.parseBoolean(System.getProperty("deploySql"))) {
            LOGGER.info("Deploying SQL Studio Variant with image: {} ##################################################", System.getProperty("studio-sql-image"));
            SqlDeploymentManager.deploySqlApp(System.getProperty("studio-sql-image"));
            logWatch = streamPodLogs("apicurio-studio-sql");
        }
    }

    static void prepareTestsInfra(String externalResources, String studioResources, boolean startKeycloak, String
            studioImage) throws IOException {
        if (startKeycloak) {
            LOGGER.info("Deploying Keycloak resources ##################################################");
            deployResource(KEYCLOAK_RESOURCES);
        }

        if (externalResources != null) {
            LOGGER.info("Deploying external dependencies for Studio ##################################################");
            deployResource(externalResources);
        }

        final InputStream resourceAsStream = StudioDeploymentManager.class.getResourceAsStream(studioResources);

        assert resourceAsStream != null;

        String studioLoadedResources = IOUtils.toString(resourceAsStream, StandardCharsets.UTF_8.name());

        if (studioImage != null) {
            studioLoadedResources = studioLoadedResources.replace(STUDIO_IMAGE, studioImage);
        }

        try {
            //Deploy all the resources associated to the studio variant
            kubernetesClient.load(IOUtils.toInputStream(studioLoadedResources, StandardCharsets.UTF_8.name()))
                    .create();
        } catch (Exception ex) {
            LOGGER.warn("Error creating studio resources:", ex);
        }

        //Wait for all the pods of the variant to be ready
        kubernetesClient.pods()
                .inNamespace(TEST_NAMESPACE).waitUntilReady(360, TimeUnit.SECONDS);

        setupTestNetworking();
    }

    private static void setupTestNetworking() {
        //For openshift, a route to the application is created we use it to set up the networking needs.
        if (Boolean.parseBoolean(System.getProperty("openshift.resources"))) {

            OpenShiftClient openShiftClient = new DefaultOpenShiftClient();

            try {
                final Route studioRoute = openShiftClient.routes()
                        .load(StudioDeploymentManager.class.getResourceAsStream(STUDIO_OPENSHIFT_ROUTE))
                        .create();
                System.setProperty("quarkus.http.test-host", studioRoute.getSpec().getHost());
                System.setProperty("quarkus.http.test-port", "80");

            } catch (Exception ex) {
                LOGGER.warn("The studio route already exists: ", ex);
            }


        } else {
            //If we're running the cluster tests but no external endpoint has been provided, set the value of the load balancer.
            if (System.getProperty("quarkus.http.test-host").equals("localhost") && !System.getProperty("os.name").contains("Mac OS")) {
                System.setProperty("quarkus.http.test-host", kubernetesClient.services().inNamespace(TEST_NAMESPACE).withName(APPLICATION_SERVICE).get().getSpec().getClusterIP());
            }
        }
    }

    private static void deployResource(String resource) {
        //Deploy all the resources associated to the external requirements
        kubernetesClient.load(StudioDeploymentManager.class.getResourceAsStream(resource))
                .create();

        //Wait for all the external resources pods to be ready
        kubernetesClient.pods()
                .inNamespace(TEST_NAMESPACE).waitUntilReady(60, TimeUnit.SECONDS);
    }

    private static List<LogWatch> streamPodLogs(String container) {
        List<LogWatch> logWatchList = new ArrayList<>();

        PodList podList = kubernetesClient.pods().inNamespace(TEST_NAMESPACE).withLabel("app", container).list();

        podList.getItems().forEach(p -> logWatchList.add(kubernetesClient.pods()
                .inNamespace(TEST_NAMESPACE)
                .withName(p.getMetadata().getName())
                .inContainer(container)
                .tailingLines(10)
                .watchLog(System.out)));

        return logWatchList;
    }
}