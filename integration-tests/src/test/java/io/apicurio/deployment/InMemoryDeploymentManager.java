package io.apicurio.deployment;

import static io.apicurio.deployment.KubernetesTestResources.APPLICATION_IN_MEMORY_RESOURCES;
import static io.apicurio.deployment.KubernetesTestResources.APPLICATION_IN_MEMORY_SECURED_RESOURCES;
import static io.apicurio.deployment.StudioDeploymentManager.prepareTestsInfra;

public class InMemoryDeploymentManager {

    static void deployInMemoryApp(String studioImage) throws Exception {
        if (Constants.TEST_PROFILE.equals(Constants.AUTH)) {
            prepareTestsInfra(null, APPLICATION_IN_MEMORY_SECURED_RESOURCES, true, studioImage);
        } else {
            prepareTestsInfra(null, APPLICATION_IN_MEMORY_RESOURCES, false, studioImage);
        }
    }
}
