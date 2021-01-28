
package org.example.api.beans;

import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Exchange {

    _1btcxe("_1btcxe"),
    acx("acx"),
    allcoin("allcoin"),
    anxpro("anxpro"),
    anybits("anybits"),
    bcex("bcex"),
    bequant("bequant"),
    bibox("bibox"),
    bigone("bigone"),
    binance("binance"),
    binanceje("binanceje"),
    bit2c("bit2c"),
    bitbank("bitbank"),
    bitbay("bitbay"),
    bitfinex("bitfinex"),
    bitfinex2("bitfinex2"),
    bitflyer("bitflyer"),
    bitforex("bitforex"),
    bithumb("bithumb"),
    bitibu("bitibu"),
    bitkk("bitkk"),
    bitlish("bitlish"),
    bitmarket("bitmarket"),
    bitmex("bitmex"),
    bitsane("bitsane"),
    bitso("bitso"),
    bitstamp("bitstamp"),
    bitstamp1("bitstamp1"),
    bittrex("bittrex"),
    bitz("bitz"),
    bl3p("bl3p"),
    bleutrade("bleutrade"),
    braziliex("braziliex"),
    btcalpha("btcalpha"),
    btcbox("btcbox"),
    btcchina("btcchina"),
    btcexchange("btcexchange"),
    btcmarkets("btcmarkets"),
    btctradeim("btctradeim"),
    btctradeua("btctradeua"),
    btcturk("btcturk"),
    buda("buda"),
    bxinth("bxinth"),
    ccex("ccex"),
    cex("cex"),
    chbtc("chbtc"),
    chilebit("chilebit"),
    cobinhood("cobinhood"),
    coinbase("coinbase"),
    coinbaseprime("coinbaseprime"),
    coinbasepro("coinbasepro"),
    coincheck("coincheck"),
    coinegg("coinegg"),
    coinex("coinex"),
    coinexchange("coinexchange"),
    coinfalcon("coinfalcon"),
    coinfloor("coinfloor"),
    coingi("coingi"),
    coinmarketcap("coinmarketcap"),
    coinmate("coinmate"),
    coinnest("coinnest"),
    coinone("coinone"),
    coinspot("coinspot"),
    cointiger("cointiger"),
    coolcoin("coolcoin"),
    coss("coss"),
    crex24("crex24"),
    crypton("crypton"),
    cryptopia("cryptopia"),
    deribit("deribit"),
    dsx("dsx"),
    ethfinex("ethfinex"),
    exmo("exmo"),
    exx("exx"),
    fcoin("fcoin"),
    fcoinjp("fcoinjp"),
    flowbtc("flowbtc"),
    foxbit("foxbit"),
    fybse("fybse"),
    fybsg("fybsg"),
    gateio("gateio"),
    gdax("gdax"),
    gemini("gemini"),
    getbtc("getbtc"),
    hadax("hadax"),
    hitbtc("hitbtc"),
    hitbtc2("hitbtc2"),
    huobipro("huobipro"),
    huobiru("huobiru"),
    ice3x("ice3x"),
    independentreserve("independentreserve"),
    indodax("indodax"),
    itbit("itbit"),
    jubi("jubi"),
    kkex("kkex"),
    kraken("kraken"),
    kucoin("kucoin"),
    kucoin2("kucoin2"),
    kuna("kuna"),
    lakebtc("lakebtc"),
    lbank("lbank"),
    liqui("liqui"),
    liquid("liquid"),
    livecoin("livecoin"),
    luno("luno"),
    lykke("lykke"),
    mandala("mandala"),
    mercado("mercado"),
    mixcoins("mixcoins"),
    negociecoins("negociecoins"),
    nova("nova"),
    okcoincny("okcoincny"),
    okcoinusd("okcoinusd"),
    okex("okex"),
    paymium("paymium"),
    poloniex("poloniex"),
    quadrigacx("quadrigacx"),
    rightbtc("rightbtc"),
    southxchange("southxchange"),
    stronghold("stronghold"),
    surbitcoin("surbitcoin"),
    theocean("theocean"),
    therock("therock"),
    tidebit("tidebit"),
    tidex("tidex"),
    uex("uex"),
    upbit("upbit"),
    urdubit("urdubit"),
    vaultoro("vaultoro"),
    vbtc("vbtc"),
    virwox("virwox"),
    xbtce("xbtce"),
    yobit("yobit"),
    zaif("zaif"),
    zb("zb");
    private final String value;
    private final static Map<String, Exchange> CONSTANTS = new HashMap<String, Exchange>();

    static {
        for (Exchange c: values()) {
            CONSTANTS.put(c.value, c);
        }
    }

    private Exchange(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return this.value;
    }

    @JsonValue
    public String value() {
        return this.value;
    }

    @JsonCreator
    public static Exchange fromValue(String value) {
        Exchange constant = CONSTANTS.get(value);
        if (constant == null) {
            throw new IllegalArgumentException(value);
        } else {
            return constant;
        }
    }

}
