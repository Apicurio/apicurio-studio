FROM registry.access.redhat.com/ubi8/nginx-118

USER root

# Install dos2unix utility
RUN yum install -y dos2unix

# Install node.js
RUN yum install -y nodejs

# Configure certificate and key
RUN mkdir -p /etc/pki/nginx/private && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/pki/nginx/private/server.key -out /etc/pki/nginx/server.crt --batch && \
    chown -R 1001:0 /etc/pki/nginx/ && chmod 755 /etc/pki/nginx/private/server.key /etc/pki/nginx/server.crt
    
# Grant write permission to group
RUN chmod -R g+w /opt/app-root/src /usr/local/bin/

# Copy configuration scripts
COPY --chown=1001:0 .docker-scripts/create-config.cjs /usr/local/bin/create-config.cjs
COPY --chown=1001:0 .docker-scripts/entrypoint.sh /usr/local/bin/entrypoint.sh

# Copy nginx config
COPY --chown=1001:0 .docker-scripts/nginx.conf /etc/nginx/nginx.conf

# To avoid docker-scripts failure in windows, convert text files from DOS line
# endings (carriage return + line feed) to Unix line endings (line feed).
RUN dos2unix /usr/local/bin/create-config.cjs && \
    dos2unix /usr/local/bin/entrypoint.sh && \
    dos2unix /etc/nginx/nginx.conf

# Copy dist files
COPY --chown=1001:0 dist/ .

# Expose port 8080 for http and 1337 for https
EXPOSE 8080 1337


USER 1001
CMD /usr/local/bin/entrypoint.sh