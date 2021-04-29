
package org.example.api.beans;

import javax.annotation.processing.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "price",
    "amount"
})
@Generated("jsonschema2pojo")
public class OrderBookLevel {

    /**
     * The price being asked for. If this is a bid, then this is the amount the bidder is willing to buy. If this is a sell, then this is the amount the seller is willing to sell for.
     * (Required)
     * 
     */
    @JsonProperty("price")
    @JsonPropertyDescription("The price being asked for. If this is a bid, then this is the amount the bidder is willing to buy. If this is a sell, then this is the amount the seller is willing to sell for.")
    private Double price;
    /**
     * The amount of units being sold.
     * 
     */
    @JsonProperty("amount")
    @JsonPropertyDescription("The amount of units being sold.")
    private Double amount;

    /**
     * The price being asked for. If this is a bid, then this is the amount the bidder is willing to buy. If this is a sell, then this is the amount the seller is willing to sell for.
     * (Required)
     * 
     */
    @JsonProperty("price")
    public Double getPrice() {
        return price;
    }

    /**
     * The price being asked for. If this is a bid, then this is the amount the bidder is willing to buy. If this is a sell, then this is the amount the seller is willing to sell for.
     * (Required)
     * 
     */
    @JsonProperty("price")
    public void setPrice(Double price) {
        this.price = price;
    }

    /**
     * The amount of units being sold.
     * 
     */
    @JsonProperty("amount")
    public Double getAmount() {
        return amount;
    }

    /**
     * The amount of units being sold.
     * 
     */
    @JsonProperty("amount")
    public void setAmount(Double amount) {
        this.amount = amount;
    }

}
