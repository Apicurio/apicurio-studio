
package org.example.api.beans;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.annotation.processing.Generated;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonValue;


/**
 * API
 * <p>
 * 
 * 
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "publicApi",
    "organizationId",
    "apiId",
    "version",
    "endpoint",
    "endpointType",
    "endpointContentType",
    "endpointProperties",
    "parsePayload",
    "apiPolicies"
})
@Generated("jsonschema2pojo")
public class Api {

    /**
     * Public API
     * <p>
     * 
     * 
     */
    @JsonProperty("publicApi")
    private Boolean publicApi = false;
    /**
     * Organization identifier
     * <p>
     * 
     * 
     */
    @JsonProperty("organizationId")
    private String organizationId;
    /**
     * API identifier
     * <p>
     * 
     * 
     */
    @JsonProperty("apiId")
    private String apiId;
    /**
     * Version identifier
     * <p>
     * 
     * 
     */
    @JsonProperty("version")
    private String version;
    /**
     * Endpoint URI
     * <p>
     * 
     * 
     */
    @JsonProperty("endpoint")
    private String endpoint;
    /**
     * Endpoint type
     * <p>
     * 
     * 
     */
    @JsonProperty("endpointType")
    private Api.EndpointType endpointType;
    /**
     * Endpoint Content Type
     * <p>
     * Gateway's content type when responding with errors/failures.
     * 
     */
    @JsonProperty("endpointContentType")
    @JsonPropertyDescription("Gateway's content type when responding with errors/failures.")
    private Api.EndpointContentType endpointContentType;
    /**
     * Endpoint properties
     * <p>
     * 
     * 
     */
    @JsonProperty("endpointProperties")
    private EndpointProperties endpointProperties;
    /**
     * Parse payload
     * <p>
     * Parse whole payload upfront (reduces performance).
     * 
     */
    @JsonProperty("parsePayload")
    @JsonPropertyDescription("Parse whole payload upfront (reduces performance).")
    private Boolean parsePayload = false;
    @JsonProperty("apiPolicies")
    private List<Policy> apiPolicies = new ArrayList<Policy>();

    /**
     * Public API
     * <p>
     * 
     * 
     */
    @JsonProperty("publicApi")
    public Boolean getPublicApi() {
        return publicApi;
    }

    /**
     * Public API
     * <p>
     * 
     * 
     */
    @JsonProperty("publicApi")
    public void setPublicApi(Boolean publicApi) {
        this.publicApi = publicApi;
    }

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
     * API identifier
     * <p>
     * 
     * 
     */
    @JsonProperty("apiId")
    public String getApiId() {
        return apiId;
    }

    /**
     * API identifier
     * <p>
     * 
     * 
     */
    @JsonProperty("apiId")
    public void setApiId(String apiId) {
        this.apiId = apiId;
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
     * Endpoint URI
     * <p>
     * 
     * 
     */
    @JsonProperty("endpoint")
    public String getEndpoint() {
        return endpoint;
    }

    /**
     * Endpoint URI
     * <p>
     * 
     * 
     */
    @JsonProperty("endpoint")
    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    /**
     * Endpoint type
     * <p>
     * 
     * 
     */
    @JsonProperty("endpointType")
    public Api.EndpointType getEndpointType() {
        return endpointType;
    }

    /**
     * Endpoint type
     * <p>
     * 
     * 
     */
    @JsonProperty("endpointType")
    public void setEndpointType(Api.EndpointType endpointType) {
        this.endpointType = endpointType;
    }

    /**
     * Endpoint Content Type
     * <p>
     * Gateway's content type when responding with errors/failures.
     * 
     */
    @JsonProperty("endpointContentType")
    public Api.EndpointContentType getEndpointContentType() {
        return endpointContentType;
    }

    /**
     * Endpoint Content Type
     * <p>
     * Gateway's content type when responding with errors/failures.
     * 
     */
    @JsonProperty("endpointContentType")
    public void setEndpointContentType(Api.EndpointContentType endpointContentType) {
        this.endpointContentType = endpointContentType;
    }

    /**
     * Endpoint properties
     * <p>
     * 
     * 
     */
    @JsonProperty("endpointProperties")
    public EndpointProperties getEndpointProperties() {
        return endpointProperties;
    }

    /**
     * Endpoint properties
     * <p>
     * 
     * 
     */
    @JsonProperty("endpointProperties")
    public void setEndpointProperties(EndpointProperties endpointProperties) {
        this.endpointProperties = endpointProperties;
    }

    /**
     * Parse payload
     * <p>
     * Parse whole payload upfront (reduces performance).
     * 
     */
    @JsonProperty("parsePayload")
    public Boolean getParsePayload() {
        return parsePayload;
    }

    /**
     * Parse payload
     * <p>
     * Parse whole payload upfront (reduces performance).
     * 
     */
    @JsonProperty("parsePayload")
    public void setParsePayload(Boolean parsePayload) {
        this.parsePayload = parsePayload;
    }

    @JsonProperty("apiPolicies")
    public List<Policy> getApiPolicies() {
        return apiPolicies;
    }

    @JsonProperty("apiPolicies")
    public void setApiPolicies(List<Policy> apiPolicies) {
        this.apiPolicies = apiPolicies;
    }

    public enum EndpointContentType {

        json("json"),
        xml("xml");
        private final String value;
        private final static Map<String, Api.EndpointContentType> CONSTANTS = new HashMap<String, Api.EndpointContentType>();

        static {
            for (Api.EndpointContentType c: values()) {
                CONSTANTS.put(c.value, c);
            }
        }

        private EndpointContentType(String value) {
            this.value = value;
        }

        @Override
        public String toString() {
            return this.value;
        }

        @JsonValue
        public String value() {
            return this.value;
        }

        @JsonCreator
        public static Api.EndpointContentType fromValue(String value) {
            Api.EndpointContentType constant = CONSTANTS.get(value);
            if (constant == null) {
                throw new IllegalArgumentException(value);
            } else {
                return constant;
            }
        }

    }

    public enum EndpointType {

        rest("rest"),
        soap("soap");
        private final String value;
        private final static Map<String, Api.EndpointType> CONSTANTS = new HashMap<String, Api.EndpointType>();

        static {
            for (Api.EndpointType c: values()) {
                CONSTANTS.put(c.value, c);
            }
        }

        private EndpointType(String value) {
            this.value = value;
        }

        @Override
        public String toString() {
            return this.value;
        }

        @JsonValue
        public String value() {
            return this.value;
        }

        @JsonCreator
        public static Api.EndpointType fromValue(String value) {
            Api.EndpointType constant = CONSTANTS.get(value);
            if (constant == null) {
                throw new IllegalArgumentException(value);
            } else {
                return constant;
            }
        }

    }

}
