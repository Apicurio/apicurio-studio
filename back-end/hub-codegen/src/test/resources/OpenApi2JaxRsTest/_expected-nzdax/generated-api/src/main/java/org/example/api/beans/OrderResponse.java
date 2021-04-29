
package org.example.api.beans;

import java.util.Date;
import javax.annotation.processing.Generated;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "id",
    "timestamp",
    "datetime",
    "symbol",
    "type",
    "side",
    "price",
    "amount",
    "cost",
    "filled",
    "remaining",
    "status",
    "info"
})
@Generated("jsonschema2pojo")
public class OrderResponse {

    /**
     * The unique identifier of the exchange for this order
     * (Required)
     * 
     */
    @JsonProperty("id")
    @JsonPropertyDescription("The unique identifier of the exchange for this order")
    private String id;
    /**
     * The timestamp of this order
     * 
     */
    @JsonProperty("timestamp")
    @JsonPropertyDescription("The timestamp of this order")
    private Double timestamp;
    /**
     * The datetime of this order
     * 
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssZ", timezone = "UTC")
    @JsonProperty("datetime")
    @JsonPropertyDescription("The datetime of this order")
    private Date datetime;
    /**
     * The currency pair of this order
     * 
     */
    @JsonProperty("symbol")
    @JsonPropertyDescription("The currency pair of this order")
    private String symbol;
    /**
     * Whether this is a 'market' order or a 'limit' order
     * 
     */
    @JsonProperty("type")
    @JsonPropertyDescription("Whether this is a 'market' order or a 'limit' order")
    private OrderType type;
    /**
     * Wether this is a bid or ask (i.e. buy or sell) order
     * 
     */
    @JsonProperty("side")
    @JsonPropertyDescription("Wether this is a bid or ask (i.e. buy or sell) order")
    private Side side;
    /**
     * The price of this order
     * 
     */
    @JsonProperty("price")
    @JsonPropertyDescription("The price of this order")
    private Double price;
    /**
     * The amount of this order
     * 
     */
    @JsonProperty("amount")
    @JsonPropertyDescription("The amount of this order")
    private Double amount;
    /**
     * The cost of this order (i.e. price x amount)
     * 
     */
    @JsonProperty("cost")
    @JsonPropertyDescription("The cost of this order (i.e. price x amount)")
    private Double cost;
    /**
     * The amount of this order that is currently filled (i.e. this can be less than or equal to 'amount')
     * 
     */
    @JsonProperty("filled")
    @JsonPropertyDescription("The amount of this order that is currently filled (i.e. this can be less than or equal to 'amount')")
    private Double filled;
    /**
     * The amount of this order that is still yet to be filled (i.e. this can be less than or equal to 'amount')
     * 
     */
    @JsonProperty("remaining")
    @JsonPropertyDescription("The amount of this order that is still yet to be filled (i.e. this can be less than or equal to 'amount')")
    private Double remaining;
    /**
     * The current status of this order
     * 
     */
    @JsonProperty("status")
    @JsonPropertyDescription("The current status of this order")
    private OrderStatus status;
    /**
     * Raw order response gotten from the exchange site's API
     * 
     */
    @JsonProperty("info")
    @JsonPropertyDescription("Raw order response gotten from the exchange site's API")
    private Info info;

    /**
     * The unique identifier of the exchange for this order
     * (Required)
     * 
     */
    @JsonProperty("id")
    public String getId() {
        return id;
    }

    /**
     * The unique identifier of the exchange for this order
     * (Required)
     * 
     */
    @JsonProperty("id")
    public void setId(String id) {
        this.id = id;
    }

    /**
     * The timestamp of this order
     * 
     */
    @JsonProperty("timestamp")
    public Double getTimestamp() {
        return timestamp;
    }

    /**
     * The timestamp of this order
     * 
     */
    @JsonProperty("timestamp")
    public void setTimestamp(Double timestamp) {
        this.timestamp = timestamp;
    }

    /**
     * The datetime of this order
     * 
     */
    @JsonProperty("datetime")
    public Date getDatetime() {
        return datetime;
    }

    /**
     * The datetime of this order
     * 
     */
    @JsonProperty("datetime")
    public void setDatetime(Date datetime) {
        this.datetime = datetime;
    }

    /**
     * The currency pair of this order
     * 
     */
    @JsonProperty("symbol")
    public String getSymbol() {
        return symbol;
    }

    /**
     * The currency pair of this order
     * 
     */
    @JsonProperty("symbol")
    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    /**
     * Whether this is a 'market' order or a 'limit' order
     * 
     */
    @JsonProperty("type")
    public OrderType getType() {
        return type;
    }

    /**
     * Whether this is a 'market' order or a 'limit' order
     * 
     */
    @JsonProperty("type")
    public void setType(OrderType type) {
        this.type = type;
    }

    /**
     * Wether this is a bid or ask (i.e. buy or sell) order
     * 
     */
    @JsonProperty("side")
    public Side getSide() {
        return side;
    }

    /**
     * Wether this is a bid or ask (i.e. buy or sell) order
     * 
     */
    @JsonProperty("side")
    public void setSide(Side side) {
        this.side = side;
    }

    /**
     * The price of this order
     * 
     */
    @JsonProperty("price")
    public Double getPrice() {
        return price;
    }

    /**
     * The price of this order
     * 
     */
    @JsonProperty("price")
    public void setPrice(Double price) {
        this.price = price;
    }

    /**
     * The amount of this order
     * 
     */
    @JsonProperty("amount")
    public Double getAmount() {
        return amount;
    }

    /**
     * The amount of this order
     * 
     */
    @JsonProperty("amount")
    public void setAmount(Double amount) {
        this.amount = amount;
    }

    /**
     * The cost of this order (i.e. price x amount)
     * 
     */
    @JsonProperty("cost")
    public Double getCost() {
        return cost;
    }

    /**
     * The cost of this order (i.e. price x amount)
     * 
     */
    @JsonProperty("cost")
    public void setCost(Double cost) {
        this.cost = cost;
    }

    /**
     * The amount of this order that is currently filled (i.e. this can be less than or equal to 'amount')
     * 
     */
    @JsonProperty("filled")
    public Double getFilled() {
        return filled;
    }

    /**
     * The amount of this order that is currently filled (i.e. this can be less than or equal to 'amount')
     * 
     */
    @JsonProperty("filled")
    public void setFilled(Double filled) {
        this.filled = filled;
    }

    /**
     * The amount of this order that is still yet to be filled (i.e. this can be less than or equal to 'amount')
     * 
     */
    @JsonProperty("remaining")
    public Double getRemaining() {
        return remaining;
    }

    /**
     * The amount of this order that is still yet to be filled (i.e. this can be less than or equal to 'amount')
     * 
     */
    @JsonProperty("remaining")
    public void setRemaining(Double remaining) {
        this.remaining = remaining;
    }

    /**
     * The current status of this order
     * 
     */
    @JsonProperty("status")
    public OrderStatus getStatus() {
        return status;
    }

    /**
     * The current status of this order
     * 
     */
    @JsonProperty("status")
    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    /**
     * Raw order response gotten from the exchange site's API
     * 
     */
    @JsonProperty("info")
    public Info getInfo() {
        return info;
    }

    /**
     * Raw order response gotten from the exchange site's API
     * 
     */
    @JsonProperty("info")
    public void setInfo(Info info) {
        this.info = info;
    }

}
