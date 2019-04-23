FROM centos:7

RUN groupadd --gid 3434 circleci \
  && useradd --uid 3434 --gid circleci --shell /bin/bash --create-home circleci

COPY google-chrome.repo /etc/yum.repos.d/google-chrome.repo

RUN yum install -y java-1.8.0-openjdk-devel && \
    yum install -y git && \
    yum install -y wget && \
    yum install -y unzip && \
    yum install -y epel-release && \
    yum install -y nodejs && \
    yum install -y npm && \
    yum install -y google-chrome-stable && \
    yum install -y which

WORKDIR /opt

RUN wget https://archive.apache.org/dist/maven/maven-3/3.5.4/binaries/apache-maven-3.5.4-bin.zip && \
    unzip apache-maven-3.5.4-bin.zip && \
    ln -s apache-maven-3.5.4 maven

ENV PATH="/opt/maven/bin:${PATH}"
ENV JAVA_HOME="/etc/alternatives/java_sdk_1.8.0_openjdk"

USER circleci

WORKDIR /home/circleci

CMD ["/bin/sh"]
