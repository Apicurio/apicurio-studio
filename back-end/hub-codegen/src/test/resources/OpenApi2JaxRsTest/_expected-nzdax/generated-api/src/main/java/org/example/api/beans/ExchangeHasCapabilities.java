
package org.example.api.beans;

import javax.annotation.processing.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "CORS",
    "publicAPI",
    "privateAPI",
    "cancelOrder",
    "cancelOrders",
    "createDepositAddress",
    "createOrder",
    "createMarketOrder",
    "createLimitOrder",
    "editOrder",
    "fetchBalance",
    "fetchBidsAsks",
    "fetchClosedOrders",
    "fetchCurrencies",
    "fetchDepositAddress",
    "fetchFundingFees",
    "fetchL2OrderBook",
    "fetchMarkets",
    "fetchMyTrades",
    "fetchOHLCV",
    "fetchOpenOrders",
    "fetchOrder",
    "fetchOrderBook",
    "fetchOrderBooks",
    "fetchOrders",
    "fetchTicker",
    "fetchTickers",
    "fetchTrades",
    "fetchTradingFees",
    "fetchTradingLimits",
    "withdraw"
})
@Generated("jsonschema2pojo")
public class ExchangeHasCapabilities {

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("CORS")
    private org.example.api.beans.ExchangeCapability cors;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("publicAPI")
    private org.example.api.beans.ExchangeCapability publicAPI;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("privateAPI")
    private org.example.api.beans.ExchangeCapability privateAPI;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("cancelOrder")
    private org.example.api.beans.ExchangeCapability cancelOrder;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("cancelOrders")
    private org.example.api.beans.ExchangeCapability cancelOrders;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("createDepositAddress")
    private org.example.api.beans.ExchangeCapability createDepositAddress;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("createOrder")
    private org.example.api.beans.ExchangeCapability createOrder;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("createMarketOrder")
    private org.example.api.beans.ExchangeCapability createMarketOrder;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("createLimitOrder")
    private org.example.api.beans.ExchangeCapability createLimitOrder;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("editOrder")
    private org.example.api.beans.ExchangeCapability editOrder;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchBalance")
    private org.example.api.beans.ExchangeCapability fetchBalance;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchBidsAsks")
    private org.example.api.beans.ExchangeCapability fetchBidsAsks;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchClosedOrders")
    private org.example.api.beans.ExchangeCapability fetchClosedOrders;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchCurrencies")
    private org.example.api.beans.ExchangeCapability fetchCurrencies;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchDepositAddress")
    private org.example.api.beans.ExchangeCapability fetchDepositAddress;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchFundingFees")
    private org.example.api.beans.ExchangeCapability fetchFundingFees;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchL2OrderBook")
    private org.example.api.beans.ExchangeCapability fetchL2OrderBook;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchMarkets")
    private org.example.api.beans.ExchangeCapability fetchMarkets;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchMyTrades")
    private org.example.api.beans.ExchangeCapability fetchMyTrades;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchOHLCV")
    private org.example.api.beans.ExchangeCapability fetchOHLCV;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchOpenOrders")
    private org.example.api.beans.ExchangeCapability fetchOpenOrders;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchOrder")
    private org.example.api.beans.ExchangeCapability fetchOrder;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchOrderBook")
    private org.example.api.beans.ExchangeCapability fetchOrderBook;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchOrderBooks")
    private org.example.api.beans.ExchangeCapability fetchOrderBooks;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchOrders")
    private org.example.api.beans.ExchangeCapability fetchOrders;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchTicker")
    private org.example.api.beans.ExchangeCapability fetchTicker;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchTickers")
    private org.example.api.beans.ExchangeCapability fetchTickers;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchTrades")
    private org.example.api.beans.ExchangeCapability fetchTrades;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchTradingFees")
    private org.example.api.beans.ExchangeCapability fetchTradingFees;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchTradingLimits")
    private org.example.api.beans.ExchangeCapability fetchTradingLimits;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("withdraw")
    private org.example.api.beans.ExchangeCapability withdraw;

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("CORS")
    public org.example.api.beans.ExchangeCapability getCors() {
        return cors;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("CORS")
    public void setCors(org.example.api.beans.ExchangeCapability cors) {
        this.cors = cors;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("publicAPI")
    public org.example.api.beans.ExchangeCapability getPublicAPI() {
        return publicAPI;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("publicAPI")
    public void setPublicAPI(org.example.api.beans.ExchangeCapability publicAPI) {
        this.publicAPI = publicAPI;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("privateAPI")
    public org.example.api.beans.ExchangeCapability getPrivateAPI() {
        return privateAPI;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("privateAPI")
    public void setPrivateAPI(org.example.api.beans.ExchangeCapability privateAPI) {
        this.privateAPI = privateAPI;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("cancelOrder")
    public org.example.api.beans.ExchangeCapability getCancelOrder() {
        return cancelOrder;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("cancelOrder")
    public void setCancelOrder(org.example.api.beans.ExchangeCapability cancelOrder) {
        this.cancelOrder = cancelOrder;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("cancelOrders")
    public org.example.api.beans.ExchangeCapability getCancelOrders() {
        return cancelOrders;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("cancelOrders")
    public void setCancelOrders(org.example.api.beans.ExchangeCapability cancelOrders) {
        this.cancelOrders = cancelOrders;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("createDepositAddress")
    public org.example.api.beans.ExchangeCapability getCreateDepositAddress() {
        return createDepositAddress;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("createDepositAddress")
    public void setCreateDepositAddress(org.example.api.beans.ExchangeCapability createDepositAddress) {
        this.createDepositAddress = createDepositAddress;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("createOrder")
    public org.example.api.beans.ExchangeCapability getCreateOrder() {
        return createOrder;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("createOrder")
    public void setCreateOrder(org.example.api.beans.ExchangeCapability createOrder) {
        this.createOrder = createOrder;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("createMarketOrder")
    public org.example.api.beans.ExchangeCapability getCreateMarketOrder() {
        return createMarketOrder;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("createMarketOrder")
    public void setCreateMarketOrder(org.example.api.beans.ExchangeCapability createMarketOrder) {
        this.createMarketOrder = createMarketOrder;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("createLimitOrder")
    public org.example.api.beans.ExchangeCapability getCreateLimitOrder() {
        return createLimitOrder;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("createLimitOrder")
    public void setCreateLimitOrder(org.example.api.beans.ExchangeCapability createLimitOrder) {
        this.createLimitOrder = createLimitOrder;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("editOrder")
    public org.example.api.beans.ExchangeCapability getEditOrder() {
        return editOrder;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("editOrder")
    public void setEditOrder(org.example.api.beans.ExchangeCapability editOrder) {
        this.editOrder = editOrder;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchBalance")
    public org.example.api.beans.ExchangeCapability getFetchBalance() {
        return fetchBalance;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchBalance")
    public void setFetchBalance(org.example.api.beans.ExchangeCapability fetchBalance) {
        this.fetchBalance = fetchBalance;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchBidsAsks")
    public org.example.api.beans.ExchangeCapability getFetchBidsAsks() {
        return fetchBidsAsks;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchBidsAsks")
    public void setFetchBidsAsks(org.example.api.beans.ExchangeCapability fetchBidsAsks) {
        this.fetchBidsAsks = fetchBidsAsks;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchClosedOrders")
    public org.example.api.beans.ExchangeCapability getFetchClosedOrders() {
        return fetchClosedOrders;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchClosedOrders")
    public void setFetchClosedOrders(org.example.api.beans.ExchangeCapability fetchClosedOrders) {
        this.fetchClosedOrders = fetchClosedOrders;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchCurrencies")
    public org.example.api.beans.ExchangeCapability getFetchCurrencies() {
        return fetchCurrencies;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchCurrencies")
    public void setFetchCurrencies(org.example.api.beans.ExchangeCapability fetchCurrencies) {
        this.fetchCurrencies = fetchCurrencies;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchDepositAddress")
    public org.example.api.beans.ExchangeCapability getFetchDepositAddress() {
        return fetchDepositAddress;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchDepositAddress")
    public void setFetchDepositAddress(org.example.api.beans.ExchangeCapability fetchDepositAddress) {
        this.fetchDepositAddress = fetchDepositAddress;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchFundingFees")
    public org.example.api.beans.ExchangeCapability getFetchFundingFees() {
        return fetchFundingFees;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchFundingFees")
    public void setFetchFundingFees(org.example.api.beans.ExchangeCapability fetchFundingFees) {
        this.fetchFundingFees = fetchFundingFees;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchL2OrderBook")
    public org.example.api.beans.ExchangeCapability getFetchL2OrderBook() {
        return fetchL2OrderBook;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchL2OrderBook")
    public void setFetchL2OrderBook(org.example.api.beans.ExchangeCapability fetchL2OrderBook) {
        this.fetchL2OrderBook = fetchL2OrderBook;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchMarkets")
    public org.example.api.beans.ExchangeCapability getFetchMarkets() {
        return fetchMarkets;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchMarkets")
    public void setFetchMarkets(org.example.api.beans.ExchangeCapability fetchMarkets) {
        this.fetchMarkets = fetchMarkets;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchMyTrades")
    public org.example.api.beans.ExchangeCapability getFetchMyTrades() {
        return fetchMyTrades;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchMyTrades")
    public void setFetchMyTrades(org.example.api.beans.ExchangeCapability fetchMyTrades) {
        this.fetchMyTrades = fetchMyTrades;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchOHLCV")
    public org.example.api.beans.ExchangeCapability getFetchOHLCV() {
        return fetchOHLCV;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchOHLCV")
    public void setFetchOHLCV(org.example.api.beans.ExchangeCapability fetchOHLCV) {
        this.fetchOHLCV = fetchOHLCV;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchOpenOrders")
    public org.example.api.beans.ExchangeCapability getFetchOpenOrders() {
        return fetchOpenOrders;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchOpenOrders")
    public void setFetchOpenOrders(org.example.api.beans.ExchangeCapability fetchOpenOrders) {
        this.fetchOpenOrders = fetchOpenOrders;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchOrder")
    public org.example.api.beans.ExchangeCapability getFetchOrder() {
        return fetchOrder;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchOrder")
    public void setFetchOrder(org.example.api.beans.ExchangeCapability fetchOrder) {
        this.fetchOrder = fetchOrder;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchOrderBook")
    public org.example.api.beans.ExchangeCapability getFetchOrderBook() {
        return fetchOrderBook;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchOrderBook")
    public void setFetchOrderBook(org.example.api.beans.ExchangeCapability fetchOrderBook) {
        this.fetchOrderBook = fetchOrderBook;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchOrderBooks")
    public org.example.api.beans.ExchangeCapability getFetchOrderBooks() {
        return fetchOrderBooks;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchOrderBooks")
    public void setFetchOrderBooks(org.example.api.beans.ExchangeCapability fetchOrderBooks) {
        this.fetchOrderBooks = fetchOrderBooks;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchOrders")
    public org.example.api.beans.ExchangeCapability getFetchOrders() {
        return fetchOrders;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchOrders")
    public void setFetchOrders(org.example.api.beans.ExchangeCapability fetchOrders) {
        this.fetchOrders = fetchOrders;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchTicker")
    public org.example.api.beans.ExchangeCapability getFetchTicker() {
        return fetchTicker;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchTicker")
    public void setFetchTicker(org.example.api.beans.ExchangeCapability fetchTicker) {
        this.fetchTicker = fetchTicker;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchTickers")
    public org.example.api.beans.ExchangeCapability getFetchTickers() {
        return fetchTickers;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchTickers")
    public void setFetchTickers(org.example.api.beans.ExchangeCapability fetchTickers) {
        this.fetchTickers = fetchTickers;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchTrades")
    public org.example.api.beans.ExchangeCapability getFetchTrades() {
        return fetchTrades;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchTrades")
    public void setFetchTrades(org.example.api.beans.ExchangeCapability fetchTrades) {
        this.fetchTrades = fetchTrades;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchTradingFees")
    public org.example.api.beans.ExchangeCapability getFetchTradingFees() {
        return fetchTradingFees;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchTradingFees")
    public void setFetchTradingFees(org.example.api.beans.ExchangeCapability fetchTradingFees) {
        this.fetchTradingFees = fetchTradingFees;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchTradingLimits")
    public org.example.api.beans.ExchangeCapability getFetchTradingLimits() {
        return fetchTradingLimits;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("fetchTradingLimits")
    public void setFetchTradingLimits(org.example.api.beans.ExchangeCapability fetchTradingLimits) {
        this.fetchTradingLimits = fetchTradingLimits;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("withdraw")
    public org.example.api.beans.ExchangeCapability getWithdraw() {
        return withdraw;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("withdraw")
    public void setWithdraw(org.example.api.beans.ExchangeCapability withdraw) {
        this.withdraw = withdraw;
    }

}
