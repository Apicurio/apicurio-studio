
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
    "count",
    "versions"
})
@Generated("jsonschema2pojo")
public class VersionSearchResults {

    /**
     * The total number of versions that matched the query (may be more than the number of versions
     * returned in the result set).
     * (Required)
     * 
     */
    @JsonProperty("count")
    @JsonPropertyDescription("The total number of versions that matched the query (may be more than the number of versions\nreturned in the result set).")
    private Integer count;
    /**
     * The collection of artifact versions returned in the result set.
     * (Required)
     * 
     */
    @JsonProperty("versions")
    @JsonPropertyDescription("The collection of artifact versions returned in the result set.")
    private List<SearchedVersion> versions = new ArrayList<SearchedVersion>();

    /**
     * The total number of versions that matched the query (may be more than the number of versions
     * returned in the result set).
     * (Required)
     * 
     */
    @JsonProperty("count")
    public Integer getCount() {
        return count;
    }

    /**
     * The total number of versions that matched the query (may be more than the number of versions
     * returned in the result set).
     * (Required)
     * 
     */
    @JsonProperty("count")
    public void setCount(Integer count) {
        this.count = count;
    }

    /**
     * The collection of artifact versions returned in the result set.
     * (Required)
     * 
     */
    @JsonProperty("versions")
    public List<SearchedVersion> getVersions() {
        return versions;
    }

    /**
     * The collection of artifact versions returned in the result set.
     * (Required)
     * 
     */
    @JsonProperty("versions")
    public void setVersions(List<SearchedVersion> versions) {
        this.versions = versions;
    }

}
