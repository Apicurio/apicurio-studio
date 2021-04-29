
package org.example.api.beans;

import javax.annotation.processing.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "id",
    "symbol",
    "base",
    "quote",
    "info",
    "lot",
    "limits",
    "precision"
})
@Generated("jsonschema2pojo")
public class MarketResponse {

    /**
     * The unique identifier for this market
     * (Required)
     * 
     */
    @JsonProperty("id")
    @JsonPropertyDescription("The unique identifier for this market")
    private String id;
    /**
     * A unified way of referencing this Market. When a symbol parameter is needed in one of the APIs, this iis where you will get it.
     * (Required)
     * 
     */
    @JsonProperty("symbol")
    @JsonPropertyDescription("A unified way of referencing this Market. When a symbol parameter is needed in one of the APIs, this iis where you will get it.")
    private String symbol;
    /**
     * The base currency. Given 'BTC/USD', the base is 'BTC'
     * (Required)
     * 
     */
    @JsonProperty("base")
    @JsonPropertyDescription("The base currency. Given 'BTC/USD', the base is 'BTC'")
    private String base;
    /**
     * The quote currency. Given 'BTC/USD', the quote is 'USD'
     * (Required)
     * 
     */
    @JsonProperty("quote")
    @JsonPropertyDescription("The quote currency. Given 'BTC/USD', the quote is 'USD'")
    private String quote;
    /**
     * Raw market response gotten from the exchange site's API
     * (Required)
     * 
     */
    @JsonProperty("info")
    @JsonPropertyDescription("Raw market response gotten from the exchange site's API")
    private Info info;
    /**
     * When placing an order, its amount must be divisible by this lot value
     * (Required)
     * 
     */
    @JsonProperty("lot")
    @JsonPropertyDescription("When placing an order, its amount must be divisible by this lot value")
    private Double lot;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("limits")
    private Limits limits;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("precision")
    private Precision precision;

    /**
     * The unique identifier for this market
     * (Required)
     * 
     */
    @JsonProperty("id")
    public String getId() {
        return id;
    }

    /**
     * The unique identifier for this market
     * (Required)
     * 
     */
    @JsonProperty("id")
    public void setId(String id) {
        this.id = id;
    }

    /**
     * A unified way of referencing this Market. When a symbol parameter is needed in one of the APIs, this iis where you will get it.
     * (Required)
     * 
     */
    @JsonProperty("symbol")
    public String getSymbol() {
        return symbol;
    }

    /**
     * A unified way of referencing this Market. When a symbol parameter is needed in one of the APIs, this iis where you will get it.
     * (Required)
     * 
     */
    @JsonProperty("symbol")
    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    /**
     * The base currency. Given 'BTC/USD', the base is 'BTC'
     * (Required)
     * 
     */
    @JsonProperty("base")
    public String getBase() {
        return base;
    }

    /**
     * The base currency. Given 'BTC/USD', the base is 'BTC'
     * (Required)
     * 
     */
    @JsonProperty("base")
    public void setBase(String base) {
        this.base = base;
    }

    /**
     * The quote currency. Given 'BTC/USD', the quote is 'USD'
     * (Required)
     * 
     */
    @JsonProperty("quote")
    public String getQuote() {
        return quote;
    }

    /**
     * The quote currency. Given 'BTC/USD', the quote is 'USD'
     * (Required)
     * 
     */
    @JsonProperty("quote")
    public void setQuote(String quote) {
        this.quote = quote;
    }

    /**
     * Raw market response gotten from the exchange site's API
     * (Required)
     * 
     */
    @JsonProperty("info")
    public Info getInfo() {
        return info;
    }

    /**
     * Raw market response gotten from the exchange site's API
     * (Required)
     * 
     */
    @JsonProperty("info")
    public void setInfo(Info info) {
        this.info = info;
    }

    /**
     * When placing an order, its amount must be divisible by this lot value
     * (Required)
     * 
     */
    @JsonProperty("lot")
    public Double getLot() {
        return lot;
    }

    /**
     * When placing an order, its amount must be divisible by this lot value
     * (Required)
     * 
     */
    @JsonProperty("lot")
    public void setLot(Double lot) {
        this.lot = lot;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("limits")
    public Limits getLimits() {
        return limits;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("limits")
    public void setLimits(Limits limits) {
        this.limits = limits;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("precision")
    public Precision getPrecision() {
        return precision;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("precision")
    public void setPrecision(Precision precision) {
        this.precision = precision;
    }

}
