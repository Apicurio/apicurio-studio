# Base image: Wildfly 10 with 8080 port exposed
FROM jboss/wildfly:14.1.0.Final

# Open management port
EXPOSE 9990

# Add management user with password
RUN /opt/jboss/wildfly/bin/add-user.sh admin admin --silent

# Set the default command to run on boot
# This will boot WildFly in the standalone mode and bind to all interface
CMD ["/opt/jboss/wildfly/bin/standalone.sh", "-b", "0.0.0.0", "-bmanagement", "0.0.0.0"]
