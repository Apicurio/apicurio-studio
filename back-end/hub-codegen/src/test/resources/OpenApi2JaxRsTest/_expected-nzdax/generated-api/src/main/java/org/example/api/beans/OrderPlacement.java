
package org.example.api.beans;

import javax.annotation.processing.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "symbol",
    "type",
    "side",
    "amount",
    "price",
    "exchangeSpecificParams"
})
@Generated("jsonschema2pojo")
public class OrderPlacement {

    /**
     * The currency pair (base/quote) of the order to be created
     * (Required)
     * 
     */
    @JsonProperty("symbol")
    @JsonPropertyDescription("The currency pair (base/quote) of the order to be created")
    private String symbol;
    /**
     * Whether this is a 'market' order or a 'limit' order
     * (Required)
     * 
     */
    @JsonProperty("type")
    @JsonPropertyDescription("Whether this is a 'market' order or a 'limit' order")
    private OrderType type;
    /**
     * Wether this is a bid or ask (i.e. buy or sell) order
     * (Required)
     * 
     */
    @JsonProperty("side")
    @JsonPropertyDescription("Wether this is a bid or ask (i.e. buy or sell) order")
    private Side side;
    /**
     * The amount of currency pair's base that we want to buy or sell
     * (Required)
     * 
     */
    @JsonProperty("amount")
    @JsonPropertyDescription("The amount of currency pair's base that we want to buy or sell")
    private Double amount;
    /**
     * The buying price or the selling price in terms of the quote. Price is needed for market orders and ignored in limit orders
     * 
     */
    @JsonProperty("price")
    @JsonPropertyDescription("The buying price or the selling price in terms of the quote. Price is needed for market orders and ignored in limit orders")
    private Double price;
    /**
     * Exchange specific parameters
     * 
     */
    @JsonProperty("exchangeSpecificParams")
    @JsonPropertyDescription("Exchange specific parameters")
    private ExchangeSpecificParams exchangeSpecificParams;

    /**
     * The currency pair (base/quote) of the order to be created
     * (Required)
     * 
     */
    @JsonProperty("symbol")
    public String getSymbol() {
        return symbol;
    }

    /**
     * The currency pair (base/quote) of the order to be created
     * (Required)
     * 
     */
    @JsonProperty("symbol")
    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    /**
     * Whether this is a 'market' order or a 'limit' order
     * (Required)
     * 
     */
    @JsonProperty("type")
    public OrderType getType() {
        return type;
    }

    /**
     * Whether this is a 'market' order or a 'limit' order
     * (Required)
     * 
     */
    @JsonProperty("type")
    public void setType(OrderType type) {
        this.type = type;
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
     * The amount of currency pair's base that we want to buy or sell
     * (Required)
     * 
     */
    @JsonProperty("amount")
    public Double getAmount() {
        return amount;
    }

    /**
     * The amount of currency pair's base that we want to buy or sell
     * (Required)
     * 
     */
    @JsonProperty("amount")
    public void setAmount(Double amount) {
        this.amount = amount;
    }

    /**
     * The buying price or the selling price in terms of the quote. Price is needed for market orders and ignored in limit orders
     * 
     */
    @JsonProperty("price")
    public Double getPrice() {
        return price;
    }

    /**
     * The buying price or the selling price in terms of the quote. Price is needed for market orders and ignored in limit orders
     * 
     */
    @JsonProperty("price")
    public void setPrice(Double price) {
        this.price = price;
    }

    /**
     * Exchange specific parameters
     * 
     */
    @JsonProperty("exchangeSpecificParams")
    public ExchangeSpecificParams getExchangeSpecificParams() {
        return exchangeSpecificParams;
    }

    /**
     * Exchange specific parameters
     * 
     */
    @JsonProperty("exchangeSpecificParams")
    public void setExchangeSpecificParams(ExchangeSpecificParams exchangeSpecificParams) {
        this.exchangeSpecificParams = exchangeSpecificParams;
    }

}
