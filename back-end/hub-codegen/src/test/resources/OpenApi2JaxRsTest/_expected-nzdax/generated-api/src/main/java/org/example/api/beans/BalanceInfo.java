
package org.example.api.beans;

import javax.annotation.processing.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "currency",
    "free",
    "used",
    "total"
})
@Generated("jsonschema2pojo")
public class BalanceInfo {

    /**
     * The currency at which this balance refers to
     * (Required)
     * 
     */
    @JsonProperty("currency")
    @JsonPropertyDescription("The currency at which this balance refers to")
    private String currency;
    /**
     * The amount of currency that is free to used
     * (Required)
     * 
     */
    @JsonProperty("free")
    @JsonPropertyDescription("The amount of currency that is free to used")
    private Double free;
    /**
     * The amount of currency that is currently used
     * (Required)
     * 
     */
    @JsonProperty("used")
    @JsonPropertyDescription("The amount of currency that is currently used")
    private Double used;
    /**
     * The total amount of currency (free + used)
     * (Required)
     * 
     */
    @JsonProperty("total")
    @JsonPropertyDescription("The total amount of currency (free + used)")
    private Double total;

    /**
     * The currency at which this balance refers to
     * (Required)
     * 
     */
    @JsonProperty("currency")
    public String getCurrency() {
        return currency;
    }

    /**
     * The currency at which this balance refers to
     * (Required)
     * 
     */
    @JsonProperty("currency")
    public void setCurrency(String currency) {
        this.currency = currency;
    }

    /**
     * The amount of currency that is free to used
     * (Required)
     * 
     */
    @JsonProperty("free")
    public Double getFree() {
        return free;
    }

    /**
     * The amount of currency that is free to used
     * (Required)
     * 
     */
    @JsonProperty("free")
    public void setFree(Double free) {
        this.free = free;
    }

    /**
     * The amount of currency that is currently used
     * (Required)
     * 
     */
    @JsonProperty("used")
    public Double getUsed() {
        return used;
    }

    /**
     * The amount of currency that is currently used
     * (Required)
     * 
     */
    @JsonProperty("used")
    public void setUsed(Double used) {
        this.used = used;
    }

    /**
     * The total amount of currency (free + used)
     * (Required)
     * 
     */
    @JsonProperty("total")
    public Double getTotal() {
        return total;
    }

    /**
     * The total amount of currency (free + used)
     * (Required)
     * 
     */
    @JsonProperty("total")
    public void setTotal(Double total) {
        this.total = total;
    }

}
