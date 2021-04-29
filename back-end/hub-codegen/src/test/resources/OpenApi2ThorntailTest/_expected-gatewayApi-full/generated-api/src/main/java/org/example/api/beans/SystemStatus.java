
package org.example.api.beans;

import javax.annotation.processing.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "id",
    "name",
    "description",
    "version",
    "up"
})
@Generated("jsonschema2pojo")
public class SystemStatus {

    /**
     * The system's ID
     * 
     */
    @JsonProperty("id")
    @JsonPropertyDescription("The system's ID")
    private String id;
    /**
     * The system's human-readable name
     * 
     */
    @JsonProperty("name")
    @JsonPropertyDescription("The system's human-readable name")
    private String name;
    @JsonProperty("description")
    private String description;
    /**
     * The version of the gateway (i.e. apiman release)
     * 
     */
    @JsonProperty("version")
    @JsonPropertyDescription("The version of the gateway (i.e. apiman release)")
    private String version;
    /**
     * Whether the system is up and available for requests.
     * 
     */
    @JsonProperty("up")
    @JsonPropertyDescription("Whether the system is up and available for requests.")
    private Boolean up;

    /**
     * The system's ID
     * 
     */
    @JsonProperty("id")
    public String getId() {
        return id;
    }

    /**
     * The system's ID
     * 
     */
    @JsonProperty("id")
    public void setId(String id) {
        this.id = id;
    }

    /**
     * The system's human-readable name
     * 
     */
    @JsonProperty("name")
    public String getName() {
        return name;
    }

    /**
     * The system's human-readable name
     * 
     */
    @JsonProperty("name")
    public void setName(String name) {
        this.name = name;
    }

    @JsonProperty("description")
    public String getDescription() {
        return description;
    }

    @JsonProperty("description")
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * The version of the gateway (i.e. apiman release)
     * 
     */
    @JsonProperty("version")
    public String getVersion() {
        return version;
    }

    /**
     * The version of the gateway (i.e. apiman release)
     * 
     */
    @JsonProperty("version")
    public void setVersion(String version) {
        this.version = version;
    }

    /**
     * Whether the system is up and available for requests.
     * 
     */
    @JsonProperty("up")
    public Boolean getUp() {
        return up;
    }

    /**
     * Whether the system is up and available for requests.
     * 
     */
    @JsonProperty("up")
    public void setUp(Boolean up) {
        this.up = up;
    }

}
