
package org.example.api.beans;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;


/**
 * Describes the response received when searching for artifacts.
 * 
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "artifacts",
    "count"
})
@Generated("jsonschema2pojo")
public class ArtifactSearchResults {

    /**
     * The artifacts returned in the result set.
     * (Required)
     * 
     */
    @JsonProperty("artifacts")
    @JsonPropertyDescription("The artifacts returned in the result set.")
    private List<SearchedArtifact> artifacts = new ArrayList<SearchedArtifact>();
    /**
     * The total number of artifacts that matched the query that produced the result set (may be 
     * more than the number of artifacts in the result set).
     * (Required)
     * 
     */
    @JsonProperty("count")
    @JsonPropertyDescription("The total number of artifacts that matched the query that produced the result set (may be \nmore than the number of artifacts in the result set).")
    private Integer count;

    /**
     * The artifacts returned in the result set.
     * (Required)
     * 
     */
    @JsonProperty("artifacts")
    public List<SearchedArtifact> getArtifacts() {
        return artifacts;
    }

    /**
     * The artifacts returned in the result set.
     * (Required)
     * 
     */
    @JsonProperty("artifacts")
    public void setArtifacts(List<SearchedArtifact> artifacts) {
        this.artifacts = artifacts;
    }

    /**
     * The total number of artifacts that matched the query that produced the result set (may be 
     * more than the number of artifacts in the result set).
     * (Required)
     * 
     */
    @JsonProperty("count")
    public Integer getCount() {
        return count;
    }

    /**
     * The total number of artifacts that matched the query that produced the result set (may be 
     * more than the number of artifacts in the result set).
     * (Required)
     * 
     */
    @JsonProperty("count")
    public void setCount(Integer count) {
        this.count = count;
    }

}
