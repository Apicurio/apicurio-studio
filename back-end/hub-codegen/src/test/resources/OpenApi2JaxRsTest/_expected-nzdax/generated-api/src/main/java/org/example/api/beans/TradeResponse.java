
package org.example.api.beans;

import java.util.Date;
import javax.annotation.processing.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "id",
    "info",
    "timestamp",
    "symbol",
    "side",
    "price",
    "amount"
})
@Generated("jsonschema2pojo")
public class TradeResponse {

    /**
     * The unique identifier of the exchange for this trade
     * 
     */
    @JsonProperty("id")
    @JsonPropertyDescription("The unique identifier of the exchange for this trade")
    private String id;
    /**
     * Raw trade response gotten from the exchange site's API
     * (Required)
     * 
     */
    @JsonProperty("info")
    @JsonPropertyDescription("Raw trade response gotten from the exchange site's API")
    private Info info;
    /**
     * The timestamp of this trade
     * 
     */
    @JsonProperty("timestamp")
    @JsonPropertyDescription("The timestamp of this trade")
    private Date timestamp;
    /**
     * The currency pair of this trade
     * (Required)
     * 
     */
    @JsonProperty("symbol")
    @JsonPropertyDescription("The currency pair of this trade")
    private String symbol;
    /**
     * Wether this is a bid or ask (i.e. buy or sell) order
     * (Required)
     * 
     */
    @JsonProperty("side")
    @JsonPropertyDescription("Wether this is a bid or ask (i.e. buy or sell) order")
    private Side side;
    /**
     * The price of this trade
     * (Required)
     * 
     */
    @JsonProperty("price")
    @JsonPropertyDescription("The price of this trade")
    private Double price;
    /**
     * The amount of this trade
     * (Required)
     * 
     */
    @JsonProperty("amount")
    @JsonPropertyDescription("The amount of this trade")
    private Double amount;

    /**
     * The unique identifier of the exchange for this trade
     * 
     */
    @JsonProperty("id")
    public String getId() {
        return id;
    }

    /**
     * The unique identifier of the exchange for this trade
     * 
     */
    @JsonProperty("id")
    public void setId(String id) {
        this.id = id;
    }

    /**
     * Raw trade response gotten from the exchange site's API
     * (Required)
     * 
     */
    @JsonProperty("info")
    public Info getInfo() {
        return info;
    }

    /**
     * Raw trade response gotten from the exchange site's API
     * (Required)
     * 
     */
    @JsonProperty("info")
    public void setInfo(Info info) {
        this.info = info;
    }

    /**
     * The timestamp of this trade
     * 
     */
    @JsonProperty("timestamp")
    public Date getTimestamp() {
        return timestamp;
    }

    /**
     * The timestamp of this trade
     * 
     */
    @JsonProperty("timestamp")
    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    /**
     * The currency pair of this trade
     * (Required)
     * 
     */
    @JsonProperty("symbol")
    public String getSymbol() {
        return symbol;
    }

    /**
     * The currency pair of this trade
     * (Required)
     * 
     */
    @JsonProperty("symbol")
    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    /**
     * Wether this is a bid or ask (i.e. buy or sell) order
     * (Required)
     * 
     */
    @JsonProperty("side")
    public Side getSide() {
        return side;
    }

    /**
     * Wether this is a bid or ask (i.e. buy or sell) order
     * (Required)
     * 
     */
    @JsonProperty("side")
    public void setSide(Side side) {
        this.side = side;
    }

    /**
     * The price of this trade
     * (Required)
     * 
     */
    @JsonProperty("price")
    public Double getPrice() {
        return price;
    }

    /**
     * The price of this trade
     * (Required)
     * 
     */
    @JsonProperty("price")
    public void setPrice(Double price) {
        this.price = price;
    }

    /**
     * The amount of this trade
     * (Required)
     * 
     */
    @JsonProperty("amount")
    public Double getAmount() {
        return amount;
    }

    /**
     * The amount of this trade
     * (Required)
     * 
     */
    @JsonProperty("amount")
    public void setAmount(Double amount) {
        this.amount = amount;
    }

}
