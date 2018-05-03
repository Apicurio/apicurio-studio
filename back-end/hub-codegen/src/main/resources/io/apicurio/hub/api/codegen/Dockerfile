FROM centos:7
ENV RELEASE_PATH target/$ARTIFACT_ID$-swarm.jar
RUN yum install -y \
    java-1.8.0-openjdk-headless \
  && yum clean all

WORKDIR /opt/$ARTIFACT_ID$

ADD ${RELEASE_PATH} /opt/$ARTIFACT_ID$

RUN groupadd -r duser -g 1001 \
    && useradd -u 1001 -r -g duser -d /opt/$ARTIFACT_ID$/ -s /sbin/nologin -c "Docker image user" duser \
    && chown -R duser:duser /opt/$ARTIFACT_ID$/ \
    && chgrp -R 0 /opt/$ARTIFACT_ID$ && chmod -R g=u /opt/$ARTIFACT_ID$

USER 1001


EXPOSE 8080

ENV PORT_OFFSET=0
ENV LOGGING_LEVEL=INFO

CMD java -jar /opt/$ARTIFACT_ID$/$ARTIFACT_ID$-swarm.jar \
    -Dswarm.port.offset=${PORT_OFFSET} \
    -Dswarm.logging=${LOGGING_LEVEL}
