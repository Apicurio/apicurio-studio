
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
    "symbol",
    "timestamp",
    "datetime",
    "high",
    "low",
    "bid",
    "ask",
    "vwap",
    "close",
    "last",
    "baseVolume",
    "quoteVolume",
    "info"
})
@Generated("jsonschema2pojo")
public class TickerResponse {

    /**
     * The currency pair of this tick
     * (Required)
     * 
     */
    @JsonProperty("symbol")
    @JsonPropertyDescription("The currency pair of this tick")
    private String symbol;
    /**
     * The timestamp of this tick
     * (Required)
     * 
     */
    @JsonProperty("timestamp")
    @JsonPropertyDescription("The timestamp of this tick")
    private Double timestamp;
    /**
     * The datetime of this tick
     * (Required)
     * 
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssZ", timezone = "UTC")
    @JsonProperty("datetime")
    @JsonPropertyDescription("The datetime of this tick")
    private Date datetime;
    /**
     * The higest price of this tick
     * (Required)
     * 
     */
    @JsonProperty("high")
    @JsonPropertyDescription("The higest price of this tick")
    private Double high;
    /**
     * The lowest price of this tick
     * (Required)
     * 
     */
    @JsonProperty("low")
    @JsonPropertyDescription("The lowest price of this tick")
    private Double low;
    /**
     * The current bid price of this tick
     * (Required)
     * 
     */
    @JsonProperty("bid")
    @JsonPropertyDescription("The current bid price of this tick")
    private Double bid;
    /**
     * The current ask price of this tick
     * (Required)
     * 
     */
    @JsonProperty("ask")
    @JsonPropertyDescription("The current ask price of this tick")
    private Double ask;
    /**
     * The volume weighted average price of this tick
     * (Required)
     * 
     */
    @JsonProperty("vwap")
    @JsonPropertyDescription("The volume weighted average price of this tick")
    private Double vwap;
    /**
     * The closing price of this tick
     * (Required)
     * 
     */
    @JsonProperty("close")
    @JsonPropertyDescription("The closing price of this tick")
    private Double close;
    /**
     * The last price of this tick
     * (Required)
     * 
     */
    @JsonProperty("last")
    @JsonPropertyDescription("The last price of this tick")
    private Double last;
    /**
     * The volume of the base currency of this tick
     * (Required)
     * 
     */
    @JsonProperty("baseVolume")
    @JsonPropertyDescription("The volume of the base currency of this tick")
    private Double baseVolume;
    /**
     * The volume of the quote currency of this tick
     * (Required)
     * 
     */
    @JsonProperty("quoteVolume")
    @JsonPropertyDescription("The volume of the quote currency of this tick")
    private Double quoteVolume;
    /**
     * Raw ticker response gotten from the exchange site's API
     * (Required)
     * 
     */
    @JsonProperty("info")
    @JsonPropertyDescription("Raw ticker response gotten from the exchange site's API")
    private Info info;

    /**
     * The currency pair of this tick
     * (Required)
     * 
     */
    @JsonProperty("symbol")
    public String getSymbol() {
        return symbol;
    }

    /**
     * The currency pair of this tick
     * (Required)
     * 
     */
    @JsonProperty("symbol")
    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    /**
     * The timestamp of this tick
     * (Required)
     * 
     */
    @JsonProperty("timestamp")
    public Double getTimestamp() {
        return timestamp;
    }

    /**
     * The timestamp of this tick
     * (Required)
     * 
     */
    @JsonProperty("timestamp")
    public void setTimestamp(Double timestamp) {
        this.timestamp = timestamp;
    }

    /**
     * The datetime of this tick
     * (Required)
     * 
     */
    @JsonProperty("datetime")
    public Date getDatetime() {
        return datetime;
    }

    /**
     * The datetime of this tick
     * (Required)
     * 
     */
    @JsonProperty("datetime")
    public void setDatetime(Date datetime) {
        this.datetime = datetime;
    }

    /**
     * The higest price of this tick
     * (Required)
     * 
     */
    @JsonProperty("high")
    public Double getHigh() {
        return high;
    }

    /**
     * The higest price of this tick
     * (Required)
     * 
     */
    @JsonProperty("high")
    public void setHigh(Double high) {
        this.high = high;
    }

    /**
     * The lowest price of this tick
     * (Required)
     * 
     */
    @JsonProperty("low")
    public Double getLow() {
        return low;
    }

    /**
     * The lowest price of this tick
     * (Required)
     * 
     */
    @JsonProperty("low")
    public void setLow(Double low) {
        this.low = low;
    }

    /**
     * The current bid price of this tick
     * (Required)
     * 
     */
    @JsonProperty("bid")
    public Double getBid() {
        return bid;
    }

    /**
     * The current bid price of this tick
     * (Required)
     * 
     */
    @JsonProperty("bid")
    public void setBid(Double bid) {
        this.bid = bid;
    }

    /**
     * The current ask price of this tick
     * (Required)
     * 
     */
    @JsonProperty("ask")
    public Double getAsk() {
        return ask;
    }

    /**
     * The current ask price of this tick
     * (Required)
     * 
     */
    @JsonProperty("ask")
    public void setAsk(Double ask) {
        this.ask = ask;
    }

    /**
     * The volume weighted average price of this tick
     * (Required)
     * 
     */
    @JsonProperty("vwap")
    public Double getVwap() {
        return vwap;
    }

    /**
     * The volume weighted average price of this tick
     * (Required)
     * 
     */
    @JsonProperty("vwap")
    public void setVwap(Double vwap) {
        this.vwap = vwap;
    }

    /**
     * The closing price of this tick
     * (Required)
     * 
     */
    @JsonProperty("close")
    public Double getClose() {
        return close;
    }

    /**
     * The closing price of this tick
     * (Required)
     * 
     */
    @JsonProperty("close")
    public void setClose(Double close) {
        this.close = close;
    }

    /**
     * The last price of this tick
     * (Required)
     * 
     */
    @JsonProperty("last")
    public Double getLast() {
        return last;
    }

    /**
     * The last price of this tick
     * (Required)
     * 
     */
    @JsonProperty("last")
    public void setLast(Double last) {
        this.last = last;
    }

    /**
     * The volume of the base currency of this tick
     * (Required)
     * 
     */
    @JsonProperty("baseVolume")
    public Double getBaseVolume() {
        return baseVolume;
    }

    /**
     * The volume of the base currency of this tick
     * (Required)
     * 
     */
    @JsonProperty("baseVolume")
    public void setBaseVolume(Double baseVolume) {
        this.baseVolume = baseVolume;
    }

    /**
     * The volume of the quote currency of this tick
     * (Required)
     * 
     */
    @JsonProperty("quoteVolume")
    public Double getQuoteVolume() {
        return quoteVolume;
    }

    /**
     * The volume of the quote currency of this tick
     * (Required)
     * 
     */
    @JsonProperty("quoteVolume")
    public void setQuoteVolume(Double quoteVolume) {
        this.quoteVolume = quoteVolume;
    }

    /**
     * Raw ticker response gotten from the exchange site's API
     * (Required)
     * 
     */
    @JsonProperty("info")
    public Info getInfo() {
        return info;
    }

    /**
     * Raw ticker response gotten from the exchange site's API
     * (Required)
     * 
     */
    @JsonProperty("info")
    public void setInfo(Info info) {
        this.info = info;
    }

}
