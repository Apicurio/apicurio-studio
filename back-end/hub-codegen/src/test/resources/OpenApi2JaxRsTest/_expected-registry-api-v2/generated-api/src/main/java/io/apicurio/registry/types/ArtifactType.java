
package io.apicurio.registry.types;

import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ArtifactType {

    AVRO("AVRO"),
    PROTOBUF("PROTOBUF"),
    PROTOBUF_FD("PROTOBUF_FD"),
    JSON("JSON"),
    OPENAPI("OPENAPI"),
    ASYNCAPI("ASYNCAPI"),
    GRAPHQL("GRAPHQL"),
    KCONNECT("KCONNECT"),
    WSDL("WSDL"),
    XSD("XSD"),
    XML("XML");
    private final String value;
    private final static Map<String, ArtifactType> CONSTANTS = new HashMap<String, ArtifactType>();

    static {
        for (ArtifactType c: values()) {
            CONSTANTS.put(c.value, c);
        }
    }

    private ArtifactType(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return this.value;
    }

    @JsonValue
    public String value() {
        return this.value;
    }

    @JsonCreator
    public static ArtifactType fromValue(String value) {
        ArtifactType constant = CONSTANTS.get(value);
        if (constant == null) {
            throw new IllegalArgumentException(value);
        } else {
            return constant;
        }
    }

}
