# docker build -t="apicurio/apicurio-docs-builder" --rm .
# winpty docker run '-v=C:\Users\ewittman\git\apicurio\apicurio.github.io\registry\docs:/antora-dist' -it apicurio/apicurio-docs-builder
# winpty docker run '-v=C:\Users\ewittman\git\apicurio\apicurio.github.io\registry\docs:/antora-dist' --env GIT_REPO=https://github.com/EricWittmann/apicurio-registry.git --env GIT_BRANCH=antora -it apicurio/apicurio-docs-builder
FROM ubuntu:latest

ENV BASE_DIR=/apicurio-docs-playbook
ENV PLAYBOOK docs-playbook.yml
ENV SEARCH_PLAYBOOK search-playbook.yml

VOLUME /apicurio-docs-playbook

RUN apt-get update
RUN apt-get install -y git-all
RUN apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash
RUN apt-get install -y nodejs
RUN npm i -g antora-site-generator-lunr antora-lunr @antora/cli@2.3 @antora/site-generator-default@2.3

ADD build.sh build.sh

CMD ./build.sh
