package io.apicurio.deployment;

import static io.apicurio.deployment.KubernetesTestResources.APPLICATION_SQL_RESOURCES;
import static io.apicurio.deployment.KubernetesTestResources.APPLICATION_SQL_SECURED_RESOURCES;
import static io.apicurio.deployment.KubernetesTestResources.DATABASE_RESOURCES;
import static io.apicurio.deployment.StudioDeploymentManager.prepareTestsInfra;

public class SqlDeploymentManager {

//    private static final Logger LOGGER = LoggerFactory.getLogger(SqlDeploymentManager.class);

    protected static void deploySqlApp(String studioImage) throws Exception {
        if (Constants.TEST_PROFILE.equals(Constants.AUTH)) {
            prepareTestsInfra(DATABASE_RESOURCES, APPLICATION_SQL_SECURED_RESOURCES, true, studioImage);
        } else {
            prepareTestsInfra(DATABASE_RESOURCES, APPLICATION_SQL_RESOURCES, false, studioImage);
        }
    }
}
