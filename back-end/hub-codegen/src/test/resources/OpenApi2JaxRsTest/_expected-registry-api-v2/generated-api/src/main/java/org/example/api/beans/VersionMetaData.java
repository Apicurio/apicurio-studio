
package org.example.api.beans;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.apicurio.registry.types.ArtifactState;
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
    "type",
    "globalId",
    "state",
    "id",
    "labels",
    "properties",
    "groupId"
})
public class VersionMetaData {

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("version")
    private Long version;
    @JsonProperty("name")
    private java.lang.String name;
    @JsonProperty("description")
    private java.lang.String description;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("createdBy")
    private java.lang.String createdBy;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("createdOn")
    private Date createdOn;
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
     * (Required)
     * 
     */
    @JsonProperty("globalId")
    @JsonPropertyDescription("")
    private Long globalId;
    /**
     * Describes the state of an artifact or artifact version.  The following states
     * are possible:
     * 
     * * ENABLED
     * * DISABLED
     * * DEPRECATED
     * 
     * 
     */
    @JsonProperty("state")
    @JsonPropertyDescription("Describes the state of an artifact or artifact version.  The following states\nare possible:\n\n* ENABLED\n* DISABLED\n* DEPRECATED\n")
    private ArtifactState state;
    /**
     * The ID of a single Artifact.
     * (Required)
     * 
     */
    @JsonProperty("id")
    @JsonPropertyDescription("The ID of a single Artifact.")
    private java.lang.String id;
    /**
     * 
     */
    @JsonProperty("labels")
    @JsonPropertyDescription("")
    private List<java.lang.String> labels = new ArrayList<java.lang.String>();
    /**
     * User-defined name-value pairs. Name and value must be strings.
     * 
     */
    @JsonProperty("properties")
    @JsonPropertyDescription("User-defined name-value pairs. Name and value must be strings.")
    private Map<String, String> properties;
    /**
     * An id of a single Artifact Group.
     * 
     */
    @JsonProperty("groupId")
    @JsonPropertyDescription("An id of a single Artifact Group.")
    private java.lang.String groupId;

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
    public java.lang.String getName() {
        return name;
    }

    @JsonProperty("name")
    public void setName(java.lang.String name) {
        this.name = name;
    }

    @JsonProperty("description")
    public java.lang.String getDescription() {
        return description;
    }

    @JsonProperty("description")
    public void setDescription(java.lang.String description) {
        this.description = description;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("createdBy")
    public java.lang.String getCreatedBy() {
        return createdBy;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("createdBy")
    public void setCreatedBy(java.lang.String createdBy) {
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
     * Describes the state of an artifact or artifact version.  The following states
     * are possible:
     * 
     * * ENABLED
     * * DISABLED
     * * DEPRECATED
     * 
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
     * 
     */
    @JsonProperty("state")
    public void setState(ArtifactState state) {
        this.state = state;
    }

    /**
     * The ID of a single Artifact.
     * (Required)
     * 
     */
    @JsonProperty("id")
    public java.lang.String getId() {
        return id;
    }

    /**
     * The ID of a single Artifact.
     * (Required)
     * 
     */
    @JsonProperty("id")
    public void setId(java.lang.String id) {
        this.id = id;
    }

    /**
     * 
     */
    @JsonProperty("labels")
    public List<java.lang.String> getLabels() {
        return labels;
    }

    /**
     * 
     */
    @JsonProperty("labels")
    public void setLabels(List<java.lang.String> labels) {
        this.labels = labels;
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

    /**
     * An id of a single Artifact Group.
     * 
     */
    @JsonProperty("groupId")
    public java.lang.String getGroupId() {
        return groupId;
    }

    /**
     * An id of a single Artifact Group.
     * 
     */
    @JsonProperty("groupId")
    public void setGroupId(java.lang.String groupId) {
        this.groupId = groupId;
    }

}
