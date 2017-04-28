FROM centos:7
LABEL authors="Daniel Cesario <dcesario@redhat.com>"
ARG RELEASE_VERSION
ARG RELEASE_PATH
RUN yum install -y \
    java-1.8.0-openjdk-headless \
    unzip \
  && yum clean all

WORKDIR /opt/apicurio-studio

ADD ${RELEASE_PATH} /opt/apicurio-studio

RUN groupadd -r apicurio -g 1001 \
    && useradd -u 1001 -r -g apicurio -d /opt/apicurio-studio/ -s /sbin/nologin -c "Docker image user" apicurio \
    && chown -R apicurio:apicurio /opt/apicurio-studio/

USER 1001
RUN unzip  /opt/apicurio-studio/apicurio-studio-${RELEASE_VERSION}-quickstart.zip \
    && rm /opt/apicurio-studio/apicurio-studio-${RELEASE_VERSION}-quickstart.zip

EXPOSE 8080

ENTRYPOINT ["/opt/apicurio-studio/apicurio-studio-${RELEASE_VERSION}/bin/catalina.sh"]
CMD ["run"]
