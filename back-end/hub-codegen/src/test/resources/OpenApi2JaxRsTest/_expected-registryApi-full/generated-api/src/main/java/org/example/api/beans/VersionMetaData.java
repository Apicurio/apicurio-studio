
package org.example.api.beans;

import java.util.Date;
import javax.annotation.processing.Generated;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.apicurio.registry.types.ArtifactType;


/**
 * Root Type for ArtifactVersionMetaData
 * <p>
 * 
 * 
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "version",
    "name",
    "description",
    "createdBy",
    "createdOn",
    "type"
})
@Generated("jsonschema2pojo")
public class VersionMetaData {

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("version")
    private Long version;
    @JsonProperty("name")
    private String name;
    @JsonProperty("description")
    private String description;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("createdBy")
    private String createdBy;
    /**
     * 
     * (Required)
     * 
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssZ", timezone = "UTC")
    @JsonProperty("createdOn")
    private Date createdOn;
    /**
     * Artifact type enum.
     * (Required)
     * 
     */
    @JsonProperty("type")
    @JsonPropertyDescription("Artifact type enum.")
    private ArtifactType type;

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("version")
    public Long getVersion() {
        return version;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("version")
    public void setVersion(Long version) {
        this.version = version;
    }

    @JsonProperty("name")
    public String getName() {
        return name;
    }

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
     * Artifact type enum.
     * (Required)
     * 
     */
    @JsonProperty("type")
    public ArtifactType getType() {
        return type;
    }

    /**
     * Artifact type enum.
     * (Required)
     * 
     */
    @JsonProperty("type")
    public void setType(ArtifactType type) {
        this.type = type;
    }

}
