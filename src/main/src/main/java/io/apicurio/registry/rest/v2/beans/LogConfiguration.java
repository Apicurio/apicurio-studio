
package io.apicurio.registry.rest.v2.beans;

import javax.annotation.processing.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.apicurio.registry.types.LogLevel;


/**
 * 
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "level"
})
@Generated("jsonschema2pojo")
@io.quarkus.runtime.annotations.RegisterForReflection
@lombok.ToString
public class LogConfiguration {

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("level")
    @JsonPropertyDescription("")
    private LogLevel level;

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("level")
    public LogLevel getLevel() {
        return level;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("level")
    public void setLevel(LogLevel level) {
        this.level = level;
    }

}
