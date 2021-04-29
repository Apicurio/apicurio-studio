
package org.example.api.beans;

import javax.annotation.processing.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;


/**
 * 
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "name",
    "description",
    "level"
})
@Generated("jsonschema2pojo")
public class NamedLogConfiguration {

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("name")
    private String name;
    @JsonProperty("description")
    private Double description;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("level")
    private String level;

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("name")
    public String getName() {
        return name;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("name")
    public void setName(String name) {
        this.name = name;
    }

    @JsonProperty("description")
    public Double getDescription() {
        return description;
    }

    @JsonProperty("description")
    public void setDescription(Double description) {
        this.description = description;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("level")
    public String getLevel() {
        return level;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("level")
    public void setLevel(String level) {
        this.level = level;
    }

}
