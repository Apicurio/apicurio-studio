
package io.apicurio.registry.rest.v2.beans;

import javax.annotation.processing.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;


/**
 * Root Type for Limits
 * <p>
 * List of limitations on used resources, that are applied on the current instance of Registry.
 * Keys represent the resource type and are suffixed by the corresponding unit.
 * Values are integers. Only non-negative values are allowed, with the exception of -1, which means that the limit is not applied.
 * 
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "maxTotalSchemasCount",
    "maxSchemaSizeBytes",
    "maxArtifactsCount",
    "maxVersionsPerArtifactCount",
    "maxArtifactPropertiesCount",
    "maxPropertyKeySizeBytes",
    "maxPropertyValueSizeBytes",
    "maxArtifactLabelsCount",
    "maxLabelSizeBytes",
    "maxNameLengthChars",
    "maxDescriptionLengthChars",
    "maxRequestsPerSecondCount"
})
@Generated("jsonschema2pojo")
@io.quarkus.runtime.annotations.RegisterForReflection
@lombok.ToString
public class Limits {

    @JsonProperty("maxTotalSchemasCount")
    private Long maxTotalSchemasCount;
    @JsonProperty("maxSchemaSizeBytes")
    private Long maxSchemaSizeBytes;
    @JsonProperty("maxArtifactsCount")
    private Long maxArtifactsCount;
    @JsonProperty("maxVersionsPerArtifactCount")
    private Long maxVersionsPerArtifactCount;
    @JsonProperty("maxArtifactPropertiesCount")
    private Long maxArtifactPropertiesCount;
    @JsonProperty("maxPropertyKeySizeBytes")
    private Long maxPropertyKeySizeBytes;
    @JsonProperty("maxPropertyValueSizeBytes")
    private Long maxPropertyValueSizeBytes;
    @JsonProperty("maxArtifactLabelsCount")
    private Long maxArtifactLabelsCount;
    @JsonProperty("maxLabelSizeBytes")
    private Long maxLabelSizeBytes;
    @JsonProperty("maxNameLengthChars")
    private Long maxNameLengthChars;
    @JsonProperty("maxDescriptionLengthChars")
    private Long maxDescriptionLengthChars;
    @JsonProperty("maxRequestsPerSecondCount")
    private Long maxRequestsPerSecondCount;

    @JsonProperty("maxTotalSchemasCount")
    public Long getMaxTotalSchemasCount() {
        return maxTotalSchemasCount;
    }

    @JsonProperty("maxTotalSchemasCount")
    public void setMaxTotalSchemasCount(Long maxTotalSchemasCount) {
        this.maxTotalSchemasCount = maxTotalSchemasCount;
    }

    @JsonProperty("maxSchemaSizeBytes")
    public Long getMaxSchemaSizeBytes() {
        return maxSchemaSizeBytes;
    }

    @JsonProperty("maxSchemaSizeBytes")
    public void setMaxSchemaSizeBytes(Long maxSchemaSizeBytes) {
        this.maxSchemaSizeBytes = maxSchemaSizeBytes;
    }

    @JsonProperty("maxArtifactsCount")
    public Long getMaxArtifactsCount() {
        return maxArtifactsCount;
    }

    @JsonProperty("maxArtifactsCount")
    public void setMaxArtifactsCount(Long maxArtifactsCount) {
        this.maxArtifactsCount = maxArtifactsCount;
    }

    @JsonProperty("maxVersionsPerArtifactCount")
    public Long getMaxVersionsPerArtifactCount() {
        return maxVersionsPerArtifactCount;
    }

    @JsonProperty("maxVersionsPerArtifactCount")
    public void setMaxVersionsPerArtifactCount(Long maxVersionsPerArtifactCount) {
        this.maxVersionsPerArtifactCount = maxVersionsPerArtifactCount;
    }

    @JsonProperty("maxArtifactPropertiesCount")
    public Long getMaxArtifactPropertiesCount() {
        return maxArtifactPropertiesCount;
    }

    @JsonProperty("maxArtifactPropertiesCount")
    public void setMaxArtifactPropertiesCount(Long maxArtifactPropertiesCount) {
        this.maxArtifactPropertiesCount = maxArtifactPropertiesCount;
    }

    @JsonProperty("maxPropertyKeySizeBytes")
    public Long getMaxPropertyKeySizeBytes() {
        return maxPropertyKeySizeBytes;
    }

    @JsonProperty("maxPropertyKeySizeBytes")
    public void setMaxPropertyKeySizeBytes(Long maxPropertyKeySizeBytes) {
        this.maxPropertyKeySizeBytes = maxPropertyKeySizeBytes;
    }

    @JsonProperty("maxPropertyValueSizeBytes")
    public Long getMaxPropertyValueSizeBytes() {
        return maxPropertyValueSizeBytes;
    }

    @JsonProperty("maxPropertyValueSizeBytes")
    public void setMaxPropertyValueSizeBytes(Long maxPropertyValueSizeBytes) {
        this.maxPropertyValueSizeBytes = maxPropertyValueSizeBytes;
    }

    @JsonProperty("maxArtifactLabelsCount")
    public Long getMaxArtifactLabelsCount() {
        return maxArtifactLabelsCount;
    }

    @JsonProperty("maxArtifactLabelsCount")
    public void setMaxArtifactLabelsCount(Long maxArtifactLabelsCount) {
        this.maxArtifactLabelsCount = maxArtifactLabelsCount;
    }

    @JsonProperty("maxLabelSizeBytes")
    public Long getMaxLabelSizeBytes() {
        return maxLabelSizeBytes;
    }

    @JsonProperty("maxLabelSizeBytes")
    public void setMaxLabelSizeBytes(Long maxLabelSizeBytes) {
        this.maxLabelSizeBytes = maxLabelSizeBytes;
    }

    @JsonProperty("maxNameLengthChars")
    public Long getMaxNameLengthChars() {
        return maxNameLengthChars;
    }

    @JsonProperty("maxNameLengthChars")
    public void setMaxNameLengthChars(Long maxNameLengthChars) {
        this.maxNameLengthChars = maxNameLengthChars;
    }

    @JsonProperty("maxDescriptionLengthChars")
    public Long getMaxDescriptionLengthChars() {
        return maxDescriptionLengthChars;
    }

    @JsonProperty("maxDescriptionLengthChars")
    public void setMaxDescriptionLengthChars(Long maxDescriptionLengthChars) {
        this.maxDescriptionLengthChars = maxDescriptionLengthChars;
    }

    @JsonProperty("maxRequestsPerSecondCount")
    public Long getMaxRequestsPerSecondCount() {
        return maxRequestsPerSecondCount;
    }

    @JsonProperty("maxRequestsPerSecondCount")
    public void setMaxRequestsPerSecondCount(Long maxRequestsPerSecondCount) {
        this.maxRequestsPerSecondCount = maxRequestsPerSecondCount;
    }

}
