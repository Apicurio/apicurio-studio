
package io.apicurio.registry.rest.v2.beans;

import javax.annotation.processing.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;


/**
 * Root Type for Download
 * <p>
 * Models a download "link".  Useful for browser use-cases.
 * 
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "downloadId",
    "href"
})
@Generated("jsonschema2pojo")
@io.quarkus.runtime.annotations.RegisterForReflection
@lombok.ToString
public class DownloadRef {

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("downloadId")
    private String downloadId;
    @JsonProperty("href")
    private String href;

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("downloadId")
    public String getDownloadId() {
        return downloadId;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("downloadId")
    public void setDownloadId(String downloadId) {
        this.downloadId = downloadId;
    }

    @JsonProperty("href")
    public String getHref() {
        return href;
    }

    @JsonProperty("href")
    public void setHref(String href) {
        this.href = href;
    }

}
