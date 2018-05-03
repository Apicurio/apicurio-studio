FROM centos:7
ENV RELEASE_PATH target/simple-api-swarm.jar
RUN yum install -y \
    java-1.8.0-openjdk-headless \
  && yum clean all

WORKDIR /opt/simple-api

ADD ${RELEASE_PATH} /opt/simple-api

RUN groupadd -r duser -g 1001 \
    && useradd -u 1001 -r -g duser -d /opt/simple-api/ -s /sbin/nologin -c "Docker image user" duser \
    && chown -R duser:duser /opt/simple-api/ \
    && chgrp -R 0 /opt/simple-api && chmod -R g=u /opt/simple-api

USER 1001


EXPOSE 8080

ENV PORT_OFFSET=0
ENV LOGGING_LEVEL=INFO

CMD java -jar /opt/simple-api/simple-api-swarm.jar \
    -Dswarm.port.offset=${PORT_OFFSET} \
    -Dswarm.logging=${LOGGING_LEVEL}
