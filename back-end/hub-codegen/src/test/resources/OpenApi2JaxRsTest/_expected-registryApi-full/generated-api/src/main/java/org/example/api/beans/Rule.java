
package org.example.api.beans;

import javax.annotation.processing.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.apicurio.registry.types.RuleType;


/**
 * Root Type for Rule
 * <p>
 * A simple rule.
 * 
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "config",
    "type"
})
@Generated("jsonschema2pojo")
public class Rule {

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("config")
    private String config;
    /**
     * Rule type enum.
     * 
     */
    @JsonProperty("type")
    @JsonPropertyDescription("Rule type enum.")
    private RuleType type;

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("config")
    public String getConfig() {
        return config;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("config")
    public void setConfig(String config) {
        this.config = config;
    }

    /**
     * Rule type enum.
     * 
     */
    @JsonProperty("type")
    public RuleType getType() {
        return type;
    }

    /**
     * Rule type enum.
     * 
     */
    @JsonProperty("type")
    public void setType(RuleType type) {
        this.type = type;
    }

}
