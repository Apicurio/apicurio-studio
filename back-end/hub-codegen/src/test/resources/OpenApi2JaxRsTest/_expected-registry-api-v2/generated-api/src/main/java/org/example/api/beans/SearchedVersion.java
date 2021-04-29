
package org.example.api.beans;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import javax.annotation.processing.Generated;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.apicurio.registry.types.ArtifactState;
import io.apicurio.registry.types.ArtifactType;


/**
 * Models a single artifact from the result set returned when searching for artifacts.
 * 
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "name",
    "description",
    "createdOn",
    "createdBy",
    "type",
    "labels",
    "state",
    "globalId",
    "version",
    "properties"
})
@Generated("jsonschema2pojo")
public class SearchedVersion {

    /**
     * 
     */
    @JsonProperty("name")
    @JsonPropertyDescription("")
    private String name;
    /**
     * 
     */
    @JsonProperty("description")
    @JsonPropertyDescription("")
    private String description;
    /**
     * 
     * (Required)
     * 
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssZ", timezone = "UTC")
    @JsonProperty("createdOn")
    @JsonPropertyDescription("")
    private Date createdOn;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("createdBy")
    @JsonPropertyDescription("")
    private String createdBy;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("type")
    @JsonPropertyDescription("")
    private ArtifactType type;
    /**
     * 
     */
    @JsonProperty("labels")
    @JsonPropertyDescription("")
    private List<String> labels = new ArrayList<String>();
    /**
     * Describes the state of an artifact or artifact version.  The following states
     * are possible:
     * 
     * * ENABLED
     * * DISABLED
     * * DEPRECATED
     * 
     * (Required)
     * 
     */
    @JsonProperty("state")
    @JsonPropertyDescription("Describes the state of an artifact or artifact version.  The following states\nare possible:\n\n* ENABLED\n* DISABLED\n* DEPRECATED\n")
    private ArtifactState state;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("globalId")
    @JsonPropertyDescription("")
    private Long globalId;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("version")
    @JsonPropertyDescription("")
    private Integer version;
    /**
     * User-defined name-value pairs. Name and value must be strings.
     * 
     */
    @JsonProperty("properties")
    @JsonPropertyDescription("User-defined name-value pairs. Name and value must be strings.")
    private Map<String, String> properties;

    /**
     * 
     */
    @JsonProperty("name")
    public String getName() {
        return name;
    }

    /**
     * 
     */
    @JsonProperty("name")
    public void setName(String name) {
        this.name = name;
    }

    /**
     * 
     */
    @JsonProperty("description")
    public String getDescription() {
        return description;
    }

    /**
     * 
     */
    @JsonProperty("description")
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("createdOn")
    public Date getCreatedOn() {
        return createdOn;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("createdOn")
    public void setCreatedOn(Date createdOn) {
        this.createdOn = createdOn;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("createdBy")
    public String getCreatedBy() {
        return createdBy;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("createdBy")
    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("type")
    public ArtifactType getType() {
        return type;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("type")
    public void setType(ArtifactType type) {
        this.type = type;
    }

    /**
     * 
     */
    @JsonProperty("labels")
    public List<String> getLabels() {
        return labels;
    }

    /**
     * 
     */
    @JsonProperty("labels")
    public void setLabels(List<String> labels) {
        this.labels = labels;
    }

    /**
     * Describes the state of an artifact or artifact version.  The following states
     * are possible:
     * 
     * * ENABLED
     * * DISABLED
     * * DEPRECATED
     * 
     * (Required)
     * 
     */
    @JsonProperty("state")
    public ArtifactState getState() {
        return state;
    }

    /**
     * Describes the state of an artifact or artifact version.  The following states
     * are possible:
     * 
     * * ENABLED
     * * DISABLED
     * * DEPRECATED
     * 
     * (Required)
     * 
     */
    @JsonProperty("state")
    public void setState(ArtifactState state) {
        this.state = state;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("globalId")
    public Long getGlobalId() {
        return globalId;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("globalId")
    public void setGlobalId(Long globalId) {
        this.globalId = globalId;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("version")
    public Integer getVersion() {
        return version;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("version")
    public void setVersion(Integer version) {
        this.version = version;
    }

    /**
     * User-defined name-value pairs. Name and value must be strings.
     * 
     */
    @JsonProperty("properties")
    public Map<String, String> getProperties() {
        return properties;
    }

    /**
     * User-defined name-value pairs. Name and value must be strings.
     * 
     */
    @JsonProperty("properties")
    public void setProperties(Map<String, String> properties) {
        this.properties = properties;
    }

}
