#!/bin/sh

java -jar /opt/apicurio/apicurio-studio-ws-thorntail.jar \
    -Xms${APICURIO_MIN_HEAP} \
    -Xmx${APICURIO_MAX_HEAP} \
    -Dthorntail.port.offset=${APICURIO_PORT_OFFSET} \
    -Dthorntail.datasources.data-sources.ApicurioDS.driver-name=${APICURIO_DB_DRIVER_NAME} \
    -Dthorntail.datasources.data-sources.ApicurioDS.connection-url=${APICURIO_DB_CONNECTION_URL} \
    -Dthorntail.datasources.data-sources.ApicurioDS.user-name=${APICURIO_DB_USER_NAME} \
    -Dthorntail.datasources.data-sources.ApicurioDS.password=${APICURIO_DB_PASSWORD} \
    -Dthorntail.datasources.data-sources.ApicurioDS.valid-connection-checker-class-name=${APICURIO_DB_VALID_CONNECTION_CHECKER_CLASS_NAME} \
    -Dthorntail.datasources.data-sources.ApicurioDS.validate-on-match=${APICURIO_DB_VALID_ON_MATCH} \
    -Dthorntail.datasources.data-sources.ApicurioDS.background-validation=${APICURIO_DB_BACKGROUND_VALIDATION} \
    -Dthorntail.datasources.data-sources.ApicurioDS.exception-sorter-class-name=${APICURIO_DB_EXCEPTION_SORTER_CLASS_NAME} \
    -Dapicurio.hub.storage.jdbc.init=${APICURIO_DB_INITIALIZE} \
    -Dapicurio.hub.storage.jdbc.type=${APICURIO_DB_TYPE} \
    -Dthorntail.logging=${APICURIO_LOGGING_LEVEL}