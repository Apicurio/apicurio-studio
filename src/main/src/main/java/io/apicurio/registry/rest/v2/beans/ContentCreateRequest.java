
package io.apicurio.registry.rest.v2.beans;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;


/**
 * 
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "content",
    "references"
})
@Generated("jsonschema2pojo")
@io.quarkus.runtime.annotations.RegisterForReflection
@lombok.ToString
public class ContentCreateRequest {

    /**
     * Raw content of the artifact.
     * (Required)
     * 
     */
    @JsonProperty("content")
    @JsonPropertyDescription("Raw content of the artifact.")
    private String content;
    /**
     * Collection of references to other artifacts.
     * (Required)
     * 
     */
    @JsonProperty("references")
    @JsonPropertyDescription("Collection of references to other artifacts.")
    private List<ArtifactReference> references = new ArrayList<ArtifactReference>();

    /**
     * Raw content of the artifact.
     * (Required)
     * 
     */
    @JsonProperty("content")
    public String getContent() {
        return content;
    }

    /**
     * Raw content of the artifact.
     * (Required)
     * 
     */
    @JsonProperty("content")
    public void setContent(String content) {
        this.content = content;
    }

    /**
     * Collection of references to other artifacts.
     * (Required)
     * 
     */
    @JsonProperty("references")
    public List<ArtifactReference> getReferences() {
        return references;
    }

    /**
     * Collection of references to other artifacts.
     * (Required)
     * 
     */
    @JsonProperty("references")
    public void setReferences(List<ArtifactReference> references) {
        this.references = references;
    }

}
