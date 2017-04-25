FROM centos:7
LABEL authors="Daniel Cesario <dcesario@redhat.com>"
ARG RELEASE_VERSION
ARG RELEASE_PATH
RUN yum install -y \
    java-1.8.0-openjdk-headless \
    unzip \
  && yum clean all

WORKDIR /opt/apiman-studio

ADD ${RELEASE_PATH} /opt/apiman-studio

RUN groupadd -r apiman -g 1001 \
    && useradd -u 1001 -r -g apiman -d /opt/apiman-studio/ -s /sbin/nologin -c "Docker image user" apiman \
    && chown -R apiman:apiman /opt/apiman-studio/

USER 1001
RUN unzip  /opt/apiman-studio/api-design-studio-${RELEASE_VERSION}-quickstart.zip \
    && rm /opt/apiman-studio/api-design-studio-${RELEASE_VERSION}-quickstart.zip

EXPOSE 8080

ENTRYPOINT ["/opt/apiman-studio/apiman-studio-${RELEASE_VERSION}/bin/catalina.sh"]
CMD ["run"]
