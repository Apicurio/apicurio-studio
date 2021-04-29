
package org.example.api.beans;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.annotation.processing.Generated;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "bids",
    "asks",
    "timestamp",
    "datetime"
})
@Generated("jsonschema2pojo")
public class OrderBookResponse {

    /**
     * The publicly listed buy orders
     * (Required)
     * 
     */
    @JsonProperty("bids")
    @JsonPropertyDescription("The publicly listed buy orders")
    private List<org.example.api.beans.OrderBookLevel> bids = new ArrayList<org.example.api.beans.OrderBookLevel>();
    /**
     * The publicly listed sell orders
     * (Required)
     * 
     */
    @JsonProperty("asks")
    @JsonPropertyDescription("The publicly listed sell orders")
    private List<org.example.api.beans.OrderBookLevel> asks = new ArrayList<org.example.api.beans.OrderBookLevel>();
    /**
     * The timestamp associated for this order book
     * 
     */
    @JsonProperty("timestamp")
    @JsonPropertyDescription("The timestamp associated for this order book")
    private Double timestamp;
    /**
     * The timestamp associated for this order book
     * 
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssZ", timezone = "UTC")
    @JsonProperty("datetime")
    @JsonPropertyDescription("The timestamp associated for this order book")
    private Date datetime;

    /**
     * The publicly listed buy orders
     * (Required)
     * 
     */
    @JsonProperty("bids")
    public List<org.example.api.beans.OrderBookLevel> getBids() {
        return bids;
    }

    /**
     * The publicly listed buy orders
     * (Required)
     * 
     */
    @JsonProperty("bids")
    public void setBids(List<org.example.api.beans.OrderBookLevel> bids) {
        this.bids = bids;
    }

    /**
     * The publicly listed sell orders
     * (Required)
     * 
     */
    @JsonProperty("asks")
    public List<org.example.api.beans.OrderBookLevel> getAsks() {
        return asks;
    }

    /**
     * The publicly listed sell orders
     * (Required)
     * 
     */
    @JsonProperty("asks")
    public void setAsks(List<org.example.api.beans.OrderBookLevel> asks) {
        this.asks = asks;
    }

    /**
     * The timestamp associated for this order book
     * 
     */
    @JsonProperty("timestamp")
    public Double getTimestamp() {
        return timestamp;
    }

    /**
     * The timestamp associated for this order book
     * 
     */
    @JsonProperty("timestamp")
    public void setTimestamp(Double timestamp) {
        this.timestamp = timestamp;
    }

    /**
     * The timestamp associated for this order book
     * 
     */
    @JsonProperty("datetime")
    public Date getDatetime() {
        return datetime;
    }

    /**
     * The timestamp associated for this order book
     * 
     */
    @JsonProperty("datetime")
    public void setDatetime(Date datetime) {
        this.datetime = datetime;
    }

}
