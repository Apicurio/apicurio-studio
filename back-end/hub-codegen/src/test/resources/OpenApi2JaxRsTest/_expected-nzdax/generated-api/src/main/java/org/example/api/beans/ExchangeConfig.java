
package org.example.api.beans;

import javax.annotation.processing.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "id",
    "apiKey",
    "secret",
    "enableRateLimit"
})
@Generated("jsonschema2pojo")
public class ExchangeConfig {

    /**
     * The unique identifier for this exchange. 
     * (Required)
     * 
     */
    @JsonProperty("id")
    @JsonPropertyDescription("The unique identifier for this exchange. ")
    private String id;
    /**
     * The API key you got from the exchange itself. This with the secret is what will allow you to access the exchange
     * 
     */
    @JsonProperty("apiKey")
    @JsonPropertyDescription("The API key you got from the exchange itself. This with the secret is what will allow you to access the exchange")
    private String apiKey;
    /**
     * The Secret key you got from the exchange itself. This with the apiKey is what will allow you to access the exchange
     * 
     */
    @JsonProperty("secret")
    @JsonPropertyDescription("The Secret key you got from the exchange itself. This with the apiKey is what will allow you to access the exchange")
    private String secret;
    /**
     * Whether to enable the built in rate limiter or not. The built in rate limiter is an approximation of the actual exchange's limit. To have a more accurate rate limiting, set this to false and implement the rate limiter on your client
     * 
     */
    @JsonProperty("enableRateLimit")
    @JsonPropertyDescription("Whether to enable the built in rate limiter or not. The built in rate limiter is an approximation of the actual exchange's limit. To have a more accurate rate limiting, set this to false and implement the rate limiter on your client")
    private Boolean enableRateLimit = true;

    /**
     * The unique identifier for this exchange. 
     * (Required)
     * 
     */
    @JsonProperty("id")
    public String getId() {
        return id;
    }

    /**
     * The unique identifier for this exchange. 
     * (Required)
     * 
     */
    @JsonProperty("id")
    public void setId(String id) {
        this.id = id;
    }

    /**
     * The API key you got from the exchange itself. This with the secret is what will allow you to access the exchange
     * 
     */
    @JsonProperty("apiKey")
    public String getApiKey() {
        return apiKey;
    }

    /**
     * The API key you got from the exchange itself. This with the secret is what will allow you to access the exchange
     * 
     */
    @JsonProperty("apiKey")
    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    /**
     * The Secret key you got from the exchange itself. This with the apiKey is what will allow you to access the exchange
     * 
     */
    @JsonProperty("secret")
    public String getSecret() {
        return secret;
    }

    /**
     * The Secret key you got from the exchange itself. This with the apiKey is what will allow you to access the exchange
     * 
     */
    @JsonProperty("secret")
    public void setSecret(String secret) {
        this.secret = secret;
    }

    /**
     * Whether to enable the built in rate limiter or not. The built in rate limiter is an approximation of the actual exchange's limit. To have a more accurate rate limiting, set this to false and implement the rate limiter on your client
     * 
     */
    @JsonProperty("enableRateLimit")
    public Boolean getEnableRateLimit() {
        return enableRateLimit;
    }

    /**
     * Whether to enable the built in rate limiter or not. The built in rate limiter is an approximation of the actual exchange's limit. To have a more accurate rate limiting, set this to false and implement the rate limiter on your client
     * 
     */
    @JsonProperty("enableRateLimit")
    public void setEnableRateLimit(Boolean enableRateLimit) {
        this.enableRateLimit = enableRateLimit;
    }

}
