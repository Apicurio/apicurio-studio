
package org.example.api.beans;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "id",
    "name",
    "private",
    "enableRateLimit",
    "countries",
    "rateLimit",
    "twofa",
    "has",
    "urls"
})
@Generated("jsonschema2pojo")
public class ExchangeResponse {

    /**
     * The id of the exchange. When you created the exchange (via POST:/exchanges/{exhangeName}), the 'id' parameter there becomes the name here
     * (Required)
     * 
     */
    @JsonProperty("id")
    @JsonPropertyDescription("The id of the exchange. When you created the exchange (via POST:/exchanges/{exhangeName}), the 'id' parameter there becomes the name here")
    private String id;
    /**
     * The name of the exchange. 
     * (Required)
     * 
     */
    @JsonProperty("name")
    @JsonPropertyDescription("The name of the exchange. ")
    private String name;
    /**
     * Whether this exchange is private (has apiKey) or public (no apiKey)
     * (Required)
     * 
     */
    @JsonProperty("private")
    @JsonPropertyDescription("Whether this exchange is private (has apiKey) or public (no apiKey)")
    private Boolean _private;
    /**
     * Whether to enable the built in rate limiter or not. The built in rate limiter is an approximation of the actual exchange's limit. To have a more accurate rate limiting, set this to false and implement the rate limiter on your client
     * (Required)
     * 
     */
    @JsonProperty("enableRateLimit")
    @JsonPropertyDescription("Whether to enable the built in rate limiter or not. The built in rate limiter is an approximation of the actual exchange's limit. To have a more accurate rate limiting, set this to false and implement the rate limiter on your client")
    private Boolean enableRateLimit = true;
    /**
     * The list of countries where this exchange is a member of
     * (Required)
     * 
     */
    @JsonProperty("countries")
    @JsonPropertyDescription("The list of countries where this exchange is a member of")
    private List<String> countries = new ArrayList<String>();
    /**
     * A request rate limit in milliseconds. Specifies the required minimal delay between two consequent HTTP requests to the same exchange. If enableRateLimit is set to false, this would be ignored.
     * 
     */
    @JsonProperty("rateLimit")
    @JsonPropertyDescription("A request rate limit in milliseconds. Specifies the required minimal delay between two consequent HTTP requests to the same exchange. If enableRateLimit is set to false, this would be ignored.")
    private Integer rateLimit;
    /**
     * Whether to enable two factor authentication or not
     * 
     */
    @JsonProperty("twofa")
    @JsonPropertyDescription("Whether to enable two factor authentication or not")
    private Boolean twofa = false;
    @JsonProperty("has")
    private ExchangeHasCapabilities has;
    /**
     * Collection of URLs this exchange has
     * 
     */
    @JsonProperty("urls")
    @JsonPropertyDescription("Collection of URLs this exchange has")
    private Urls urls;

    /**
     * The id of the exchange. When you created the exchange (via POST:/exchanges/{exhangeName}), the 'id' parameter there becomes the name here
     * (Required)
     * 
     */
    @JsonProperty("id")
    public String getId() {
        return id;
    }

    /**
     * The id of the exchange. When you created the exchange (via POST:/exchanges/{exhangeName}), the 'id' parameter there becomes the name here
     * (Required)
     * 
     */
    @JsonProperty("id")
    public void setId(String id) {
        this.id = id;
    }

    /**
     * The name of the exchange. 
     * (Required)
     * 
     */
    @JsonProperty("name")
    public String getName() {
        return name;
    }

    /**
     * The name of the exchange. 
     * (Required)
     * 
     */
    @JsonProperty("name")
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Whether this exchange is private (has apiKey) or public (no apiKey)
     * (Required)
     * 
     */
    @JsonProperty("private")
    public Boolean getPrivate() {
        return _private;
    }

    /**
     * Whether this exchange is private (has apiKey) or public (no apiKey)
     * (Required)
     * 
     */
    @JsonProperty("private")
    public void setPrivate(Boolean _private) {
        this._private = _private;
    }

    /**
     * Whether to enable the built in rate limiter or not. The built in rate limiter is an approximation of the actual exchange's limit. To have a more accurate rate limiting, set this to false and implement the rate limiter on your client
     * (Required)
     * 
     */
    @JsonProperty("enableRateLimit")
    public Boolean getEnableRateLimit() {
        return enableRateLimit;
    }

    /**
     * Whether to enable the built in rate limiter or not. The built in rate limiter is an approximation of the actual exchange's limit. To have a more accurate rate limiting, set this to false and implement the rate limiter on your client
     * (Required)
     * 
     */
    @JsonProperty("enableRateLimit")
    public void setEnableRateLimit(Boolean enableRateLimit) {
        this.enableRateLimit = enableRateLimit;
    }

    /**
     * The list of countries where this exchange is a member of
     * (Required)
     * 
     */
    @JsonProperty("countries")
    public List<String> getCountries() {
        return countries;
    }

    /**
     * The list of countries where this exchange is a member of
     * (Required)
     * 
     */
    @JsonProperty("countries")
    public void setCountries(List<String> countries) {
        this.countries = countries;
    }

    /**
     * A request rate limit in milliseconds. Specifies the required minimal delay between two consequent HTTP requests to the same exchange. If enableRateLimit is set to false, this would be ignored.
     * 
     */
    @JsonProperty("rateLimit")
    public Integer getRateLimit() {
        return rateLimit;
    }

    /**
     * A request rate limit in milliseconds. Specifies the required minimal delay between two consequent HTTP requests to the same exchange. If enableRateLimit is set to false, this would be ignored.
     * 
     */
    @JsonProperty("rateLimit")
    public void setRateLimit(Integer rateLimit) {
        this.rateLimit = rateLimit;
    }

    /**
     * Whether to enable two factor authentication or not
     * 
     */
    @JsonProperty("twofa")
    public Boolean getTwofa() {
        return twofa;
    }

    /**
     * Whether to enable two factor authentication or not
     * 
     */
    @JsonProperty("twofa")
    public void setTwofa(Boolean twofa) {
        this.twofa = twofa;
    }

    @JsonProperty("has")
    public ExchangeHasCapabilities getHas() {
        return has;
    }

    @JsonProperty("has")
    public void setHas(ExchangeHasCapabilities has) {
        this.has = has;
    }

    /**
     * Collection of URLs this exchange has
     * 
     */
    @JsonProperty("urls")
    public Urls getUrls() {
        return urls;
    }

    /**
     * Collection of URLs this exchange has
     * 
     */
    @JsonProperty("urls")
    public void setUrls(Urls urls) {
        this.urls = urls;
    }

}
