# Distributed Apicurio Setup (Artemis)

## Requirements

* Apache ActiveMQ Artemis (tested with 2.6.3)
* External database (for this example we will use H2)
* Application Server (for this example we will use Wildfly 14)

## Configuration

### Artemis

* [Download Artemis server](https://activemq.apache.org/artemis/download.html) (or use an existing one).
* [Create a broker instance](https://activemq.apache.org/artemis/docs/latest/using-server.html#creating-a-broker-instance) for Apicurio.
* Edit your instance's `broker.xml` configuration file. This is usually located in `etc/` of the instance you created.

In the `<address-settings>` section, add a new address setting:

```xml
<address-settings>
        [...]
        <address-setting match="apicurio/session/*">
            <default-purge-on-no-consumers>true</default-purge-on-no-consumers>
            <auto-create-addresses>true</auto-create-addresses>
            <auto-delete-addresses>true</auto-delete-addresses>
            <!-- Standard attributes -->
            <dead-letter-address>DLQ</dead-letter-address>
            <expiry-address>ExpiryQueue</expiry-address>
            <redelivery-delay>0</redelivery-delay>
            <!-- with -1 only the global-max-size is in use for limiting -->
            <max-size-bytes>-1</max-size-bytes>
            <message-counter-history-day-limit>10</message-counter-history-day-limit>
            <address-full-policy>PAGE</address-full-policy>
            <auto-create-queues>true</auto-create-queues>
        </address-setting>
</address-settings>
```

In the `<core>` section, set the `management-notification-address`:

```xml
    <!-- Get management notifications -->
    <management-notification-address>jms.topic.activemq.notifications</management-notification-address>
```

In the `<core>` section, add the following broker plugin (if you already have broker plugins, merge the config). This ensures Artemis transmits address events (such as 'address deleted') over the management notification topic. 

```xml
<broker-plugins>
    <broker-plugin class-name="org.apache.activemq.artemis.core.server.plugin.impl.NotificationActiveMQServerPlugin">
        <property key="SEND_ADDRESS_NOTIFICATIONS" value="true" />
    </broker-plugin>
</broker-plugins>
```

* Make any other configuration changes that are necessary for your environment and preferences.

### Database

Start up an external database, and set it up as per normal. You can see examples of MySQL, PostgreSQL, and others in the main Apicurio documentation and samples. For this document, we will use H2:

* [Download and configure H2 standalone](http://www.h2database.com/html/main.html)
* Start H2; ensure you allow non-local connections. For example `java -jar h2-1.4.197.jar -tcpAllowOthers` to enable non-local TCP connections.

### Wildfly 14

Edit the configuration `standalone-apicurio-artemis.xml` (or using System properties), set:

* `apicurio.hub.distributed.session.type` to `jms`
* `apicurio.db.host` to your H2 database host
* `apicurio.broker.host` to your Artemis host
* `apicurio.broker.port` to your Artemis port (default is the standard 61616)

Once these are correct, you should be able to launch multiple instances of Wildfly:

```bash
$ ./bin/standalone.sh -c standalone-apicurio-artemis.xml
```

#### Detail

For reference, the example configuration is based upon the full Wildfly profile, with the following modifications:

* An external H2 data-source is added. Add your own of any supported type:

```xml
    <datasource jndi-name="java:jboss/datasources/ApicurioDS" pool-name="ApicurioDS" enabled="true" use-java-context="true">
        <connection-url>jdbc:h2:tcp://${apicurio.db.host}:9092/~/apicurio;DB_CLOSE_ON_EXIT=FALSE;DB_CLOSE_DELAY=-1</connection-url>
        <driver>h2</driver>
        <security>
            <user-name>sa</user-name>
        </security>
    </datasource>
```

* In the ActiveMQ `<server>` section a remote Artemis connector:

```xml
    <remote-connector name="remote-artemis" socket-binding="remote-artemis"/>
    [...]
    <connection-factory name="activemq-ra" entries="java:/ApicurioConnectionFactory" connectors="remote-artemis"/>
```

* In the `<socket-binding-group>` section:

```xml
    <outbound-socket-binding name="remote-artemis">
        <remote-destination host="${apicurio.broker.host}" port="${apicurio.broker.port}"/>
    </outbound-socket-binding>
```

## Development set-up

A convenient development and debug set-up for manual testing:

* Create a virtual machine (or container) with a Wildfly installation containing everything as above, *except* Apicurio's WARs (see below). 
* Add a shared volume pointing to the locations of your Apicurio development builds (e.g. docker volume, shared directory, shared folder).
* In each Wildfly standalone.xml configuration `<server>` section, add a deployments section:

```xml
    <deployments>
        <deployment name="apicurio-studio-api.war" runtime-name="apicurio-studio-api.war">
            <fs-archive path="<YOUR_SHARED_VOLUME_PATH>/<PATH TO WAR>/apicurio-studio-api.war"/>
        </deployment>
        <deployment name="apicurio-studio-ws.war" runtime-name="apicurio-studio-ws.war">
            <fs-archive path="<YOUR_SHARED_VOLUME_PATH>/<PATH TO WAR>/apicurio-studio-ws.war"/>
        </deployment>
        <deployment name="apicurio-studio.war" runtime-name="apicurio-studio.war">
            <fs-archive path="<YOUR_SHARED_VOLUME_PATH>/<PATH TO WAR>/apicurio-studio.war"/>
        </deployment>
    </deployments>
```

When you rebuild your code, you will simply need to restart/redeploy each Wildfly server and they will all be synchronised with the same underlying code.

