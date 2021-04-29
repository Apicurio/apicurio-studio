
package org.example.api.beans;

import javax.annotation.processing.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "amount",
    "price",
    "cost"
})
@Generated("jsonschema2pojo")
public class Limits {

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("amount")
    private org.example.api.beans.Limit amount;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("price")
    private org.example.api.beans.Limit price;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("cost")
    private org.example.api.beans.Limit cost;

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("amount")
    public org.example.api.beans.Limit getAmount() {
        return amount;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("amount")
    public void setAmount(org.example.api.beans.Limit amount) {
        this.amount = amount;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("price")
    public org.example.api.beans.Limit getPrice() {
        return price;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("price")
    public void setPrice(org.example.api.beans.Limit price) {
        this.price = price;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("cost")
    public org.example.api.beans.Limit getCost() {
        return cost;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("cost")
    public void setCost(org.example.api.beans.Limit cost) {
        this.cost = cost;
    }

}
