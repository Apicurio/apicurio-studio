
package org.example.api.beans;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;


/**
 * Client
 * <p>
 * 
 * 
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "organizationId",
    "clientId",
    "version",
    "apiKey",
    "contracts"
})
@Generated("jsonschema2pojo")
public class Client {

    /**
     * Organization identifier
     * <p>
     * 
     * 
     */
    @JsonProperty("organizationId")
    private String organizationId;
    /**
     * Client identifier
     * <p>
     * 
     * 
     */
    @JsonProperty("clientId")
    private String clientId;
    /**
     * Version identifier
     * <p>
     * 
     * 
     */
    @JsonProperty("version")
    private String version;
    /**
     * API Key
     * <p>
     * 
     * 
     */
    @JsonProperty("apiKey")
    private String apiKey;
    /**
     * Contracts
     * <p>
     * 
     * 
     */
    @JsonProperty("contracts")
    private List<Contract> contracts = new ArrayList<Contract>();

    /**
     * Organization identifier
     * <p>
     * 
     * 
     */
    @JsonProperty("organizationId")
    public String getOrganizationId() {
        return organizationId;
    }

    /**
     * Organization identifier
     * <p>
     * 
     * 
     */
    @JsonProperty("organizationId")
    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    /**
     * Client identifier
     * <p>
     * 
     * 
     */
    @JsonProperty("clientId")
    public String getClientId() {
        return clientId;
    }

    /**
     * Client identifier
     * <p>
     * 
     * 
     */
    @JsonProperty("clientId")
    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    /**
     * Version identifier
     * <p>
     * 
     * 
     */
    @JsonProperty("version")
    public String getVersion() {
        return version;
    }

    /**
     * Version identifier
     * <p>
     * 
     * 
     */
    @JsonProperty("version")
    public void setVersion(String version) {
        this.version = version;
    }

    /**
     * API Key
     * <p>
     * 
     * 
     */
    @JsonProperty("apiKey")
    public String getApiKey() {
        return apiKey;
    }

    /**
     * API Key
     * <p>
     * 
     * 
     */
    @JsonProperty("apiKey")
    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    /**
     * Contracts
     * <p>
     * 
     * 
     */
    @JsonProperty("contracts")
    public List<Contract> getContracts() {
        return contracts;
    }

    /**
     * Contracts
     * <p>
     * 
     * 
     */
    @JsonProperty("contracts")
    public void setContracts(List<Contract> contracts) {
        this.contracts = contracts;
    }

}
