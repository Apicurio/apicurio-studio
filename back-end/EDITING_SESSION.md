# Editing session configuration

In order to inform the kind of editing session that the application will use, you need to inform the following environment variable with one of the available options (kafka, jms):

	APICURIO_HUB_EDITING_SESSION_TYPE=kafka
	
If you leave this option empty, the application will use an in-memory implementation, please, do not use this in production environments.

If you choose kafka as the option for the editing session, then you will be able to configure the session with the following environment variables:

	KAFKA_BOOTSTRAP_SERVERS=localhost:9092
	KAFKA_GROUP_ID=UUID
	APICURIO_HUB_EDITING_SESSION_KAFKA_TOPIC=editing-session-topic
	APICURIO_HUB_EDITING_SESSION_CONSUMERS=1
	APICURIO_HUB_EDITING_SESSION_THREADS=3
	APICURIO_HUB_EDITING_SESSION_TIMEOUT=5
	
Being KAFKA_BOOTSTRAP_SERVERS` the only mandatory environment variable.