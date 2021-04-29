
package org.example.api.beans;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;


/**
 * Contract
 * <p>
 * 
 * 
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "apiOrgId",
    "apiId",
    "apiVersion",
    "plan",
    "policies"
})
@Generated("jsonschema2pojo")
public class Contract {

    /**
     * API Organization ID
     * <p>
     * Organization of API chosen. Must map to a valid API Organization ID.
     * 
     */
    @JsonProperty("apiOrgId")
    @JsonPropertyDescription("Organization of API chosen. Must map to a valid API Organization ID.")
    private String apiOrgId;
    /**
     * API ID
     * <p>
     * API chosen. Must map to a valid API ID.
     * 
     */
    @JsonProperty("apiId")
    @JsonPropertyDescription("API chosen. Must map to a valid API ID.")
    private String apiId;
    /**
     * API Version
     * <p>
     * Version of API chosen. Must map to a valid API Version.
     * 
     */
    @JsonProperty("apiVersion")
    @JsonPropertyDescription("Version of API chosen. Must map to a valid API Version.")
    private String apiVersion;
    /**
     * Plan Name
     * <p>
     * Name of plan.
     * 
     */
    @JsonProperty("plan")
    @JsonPropertyDescription("Name of plan.")
    private String plan;
    @JsonProperty("policies")
    private List<Policy> policies = new ArrayList<Policy>();

    /**
     * API Organization ID
     * <p>
     * Organization of API chosen. Must map to a valid API Organization ID.
     * 
     */
    @JsonProperty("apiOrgId")
    public String getApiOrgId() {
        return apiOrgId;
    }

    /**
     * API Organization ID
     * <p>
     * Organization of API chosen. Must map to a valid API Organization ID.
     * 
     */
    @JsonProperty("apiOrgId")
    public void setApiOrgId(String apiOrgId) {
        this.apiOrgId = apiOrgId;
    }

    /**
     * API ID
     * <p>
     * API chosen. Must map to a valid API ID.
     * 
     */
    @JsonProperty("apiId")
    public String getApiId() {
        return apiId;
    }

    /**
     * API ID
     * <p>
     * API chosen. Must map to a valid API ID.
     * 
     */
    @JsonProperty("apiId")
    public void setApiId(String apiId) {
        this.apiId = apiId;
    }

    /**
     * API Version
     * <p>
     * Version of API chosen. Must map to a valid API Version.
     * 
     */
    @JsonProperty("apiVersion")
    public String getApiVersion() {
        return apiVersion;
    }

    /**
     * API Version
     * <p>
     * Version of API chosen. Must map to a valid API Version.
     * 
     */
    @JsonProperty("apiVersion")
    public void setApiVersion(String apiVersion) {
        this.apiVersion = apiVersion;
    }

    /**
     * Plan Name
     * <p>
     * Name of plan.
     * 
     */
    @JsonProperty("plan")
    public String getPlan() {
        return plan;
    }

    /**
     * Plan Name
     * <p>
     * Name of plan.
     * 
     */
    @JsonProperty("plan")
    public void setPlan(String plan) {
        this.plan = plan;
    }

    @JsonProperty("policies")
    public List<Policy> getPolicies() {
        return policies;
    }

    @JsonProperty("policies")
    public void setPolicies(List<Policy> policies) {
        this.policies = policies;
    }

}
