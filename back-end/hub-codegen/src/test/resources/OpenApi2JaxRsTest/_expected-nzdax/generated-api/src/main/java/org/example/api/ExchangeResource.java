package org.example.api;

import java.util.List;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import org.example.api.beans.AccessToken;
import org.example.api.beans.BalanceResponse;
import org.example.api.beans.Exchange;
import org.example.api.beans.ExchangeConfig;
import org.example.api.beans.ExchangeResponse;
import org.example.api.beans.MarketResponse;
import org.example.api.beans.OrderBookResponse;
import org.example.api.beans.OrderPlacement;
import org.example.api.beans.OrderResponse;
import org.example.api.beans.TickerResponse;
import org.example.api.beans.TradeResponse;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/exchange")
public interface ExchangeResource {
  /**
   * Retreives the current exchange connection details given the {exchangeName} and access token in the header
   */
  @Path("/{exchangeName}")
  @GET
  @Produces("application/json")
  ExchangeResponse getConnection(@PathParam("exchangeName") Exchange exchangeName);

  /**
   * Creates a private connection to the exchange referenced in {exchangeName}
   */
  @Path("/{exchangeName}")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  AccessToken createPrivateConnection(@PathParam("exchangeName") Exchange exchangeName,
      ExchangeConfig data);

  /**
   * Delete the exchange connection referenced by access token in the header
   */
  @Path("/{exchangeName}")
  @DELETE
  @Produces("application/json")
  ExchangeResponse deletePrivateConnection(@PathParam("exchangeName") Exchange exchangeName);

  /**
   * Get the markets of the exchange referenced by the {exchangeName}.
   *
   * <br/> *Parameters listed here are common to all exchanges. But any other parameter passed would be forwarded as well into the exchange.*
   */
  @Path("/{exchangeName}/markets")
  @GET
  @Produces("application/json")
  List<MarketResponse> markets(@PathParam("exchangeName") Exchange exchangeName);

  /**
   * Get the order book of the exchange referenced by the {exchangeName} and `?symbol=`. 
   *
   * <br/> *Parameters listed here are common to all exchanges. But any other parameter passed would be forwarded as well into the exchange.*
   */
  @Path("/{exchangeName}/orderBook")
  @GET
  @Produces("application/json")
  List<OrderBookResponse> orderBook(@PathParam("exchangeName") Exchange exchangeName,
      @QueryParam("symbol") String symbol, @QueryParam("limit") Number limit,
      @QueryParam("exchangeSpecificParams") Object exchangeSpecificParams);

  /**
   * Get the Level 2 Order Book of the exchange referenced by the {exchangeName} and `?symbol=`.
   *
   * <br/> *Parameters listed here are common to all exchanges. But any other parameter passed would be forwarded as well into the exchange.*
   */
  @Path("/{exchangeName}/l2OrderBook")
  @GET
  @Produces("application/json")
  List<OrderBookResponse> l2OrderBook(@PathParam("exchangeName") Exchange exchangeName,
      @QueryParam("symbol") String symbol, @QueryParam("limit") Number limit,
      @QueryParam("exchangeSpecificParams") Object exchangeSpecificParams);

  /**
   * Get the trades of the exchange referenced by the {exchangeName} and `?symbol=`.
   *
   * <br/> *Parameters listed here are common to all exchanges. But any other parameter passed would be forwarded as well into the exchange.*
   */
  @Path("/{exchangeName}/trades")
  @GET
  @Produces("application/json")
  List<TradeResponse> trades(@PathParam("exchangeName") Exchange exchangeName,
      @QueryParam("symbol") String symbol, @QueryParam("since") String since,
      @QueryParam("limit") Number limit,
      @QueryParam("exchangeSpecificParams") Object exchangeSpecificParams);

  /**
   * Get the ticker of the exchange referenced by the {exchangeName} and `?symbol=`.
   *
   * <br/> *Parameters listed here are common to all exchanges. But any other parameter passed would be forwarded as well into the exchange.*
   */
  @Path("/{exchangeName}/ticker")
  @GET
  @Produces("application/json")
  TickerResponse ticker(@PathParam("exchangeName") Exchange exchangeName,
      @QueryParam("symbol") String symbol, @QueryParam("exchangeSymbol") String exchangeSymbol,
      @QueryParam("exchangeSpecificParams") Object exchangeSpecificParams);

  /**
   * Get the tickers of the exchange referenced by the {exchangeName} and `?symbol=`.
   *
   * <br/> *Parameters listed here are common to all exchanges. But any other parameter passed would be forwarded as well into the exchange.*
   */
  @Path("/{exchangeName}/tickers")
  @GET
  @Produces("application/json")
  List<TickerResponse> tickers(@PathParam("exchangeName") Exchange exchangeName,
      @QueryParam("symbol") String symbol,
      @QueryParam("exchangeSpecificParams") Object exchangeSpecificParams);

  /**
   * Get the balances of the exchange referenced by the {exchangeName}. 
   *
   * <br/> *Parameters listed here are common to all exchanges. But any other parameter passed would be forwarded as well into the exchange.*
   */
  @Path("/{exchangeName}/balances")
  @GET
  @Produces("application/json")
  BalanceResponse balances(@PathParam("exchangeName") Exchange exchangeName,
      @QueryParam("exchangeSpecificParams") Object exchangeSpecificParams);

  /**
   * Get the orders of the exchange referenced by the {exchangeName}. 
   *
   * <br/> *Parameters listed here are common to all exchanges. But any other parameter passed would be forwarded as well into the exchange.*
   */
  @Path("/{exchangeName}/orders")
  @GET
  @Produces("application/json")
  List<OrderResponse> fetchOrders(@PathParam("exchangeName") Exchange exchangeName,
      @QueryParam("symbol") String symbol, @QueryParam("since") String since,
      @QueryParam("limit") Number limit,
      @QueryParam("exchangeSpecificParams") Object exchangeSpecificParams);

  /**
   * Get the open orders of the exchange referenced by the {exchangeName}. 
   *
   * <br/> *Parameters listed here are common to all exchanges. But any other parameter passed would be forwarded as well into the exchange.*
   */
  @Path("/{exchangeName}/orders/open")
  @GET
  @Produces("application/json")
  List<OrderResponse> fetchOpenOrders(@PathParam("exchangeName") Exchange exchangeName,
      @QueryParam("symbol") String symbol, @QueryParam("since") String since,
      @QueryParam("limit") Number limit,
      @QueryParam("exchangeSpecificParams") Object exchangeSpecificParams);

  /**
   * Get the closed orders of the exchange referenced by the {exchangeName}.
   *
   * <br/> *Parameters listed here are common to all exchanges. But any other parameter passed would be forwarded as well into the exchange.*
   */
  @Path("/{exchangeName}/orders/closed")
  @GET
  @Produces("application/json")
  List<OrderResponse> fetchClosedOrders(@PathParam("exchangeName") Exchange exchangeName,
      @QueryParam("symbol") String symbol, @QueryParam("since") String since,
      @QueryParam("limit") Number limit,
      @QueryParam("exchangeSpecificParams") Object exchangeSpecificParams);

  /**
   * Get my trades of the exchange referenced by the {exchangeName}. 
   *
   * <br/> *Parameters listed here are common to all exchanges. But any other parameter passed would be forwarded as well into the exchange.*
   */
  @Path("/{exchangeName}/trades/mine")
  @GET
  @Produces("application/json")
  List<TradeResponse> fetchMyTrades(@PathParam("exchangeName") Exchange exchangeName,
      @QueryParam("symbol") String symbol, @QueryParam("since") String since,
      @QueryParam("limit") Number limit,
      @QueryParam("exchangeSpecificParams") Object exchangeSpecificParams);

  /**
   * Create an order on the exchange referenced by the {exchangeName}
   */
  @Path("/{exchangeName}/order")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  OrderResponse createOrder(@PathParam("exchangeName") Exchange exchangeName, OrderPlacement data);

  /**
   * Retrieves the information of an order on the exchange referenced by the {exchangeName} and {orderId}. 
   *
   * <br/> *Parameters listed here are common to all exchanges. But any other parameter passed would be forwarded as well into the exchange.*
   */
  @Path("/{exchangeName}/order/{orderId}")
  @GET
  @Produces("application/json")
  OrderResponse fetchOrder(@PathParam("exchangeName") Exchange exchangeName,
      @PathParam("orderId") String orderId, @QueryParam("symbol") String symbol,
      @QueryParam("exchangeSpecificParams") Object exchangeSpecificParams);

  /**
   * Cancel an open order on the exchange referenced by the {exchangeName} and {orderId}. 
   *
   * <br/> *Parameters listed here are common to all exchanges. But any other parameter passed would be forwarded as well into the exchange.*
   */
  @Path("/{exchangeName}/order/{orderId}")
  @DELETE
  @Produces("application/json")
  OrderResponse cancelOrder(@PathParam("exchangeName") Exchange exchangeName,
      @PathParam("orderId") String orderId, @QueryParam("symbol") String symbol,
      @QueryParam("exchangeSpecificParams") Object exchangeSpecificParams);
}
