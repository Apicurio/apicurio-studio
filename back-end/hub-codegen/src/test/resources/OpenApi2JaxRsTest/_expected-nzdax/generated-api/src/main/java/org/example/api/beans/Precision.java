
package org.example.api.beans;

import javax.annotation.processing.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "amount",
    "price"
})
@Generated("jsonschema2pojo")
public class Precision {

    /**
     * The allowable precision of the amount when placing an order. For example, given 2, then an amount of 0.123 must be made either 0.12 (or 0.13)
     * (Required)
     * 
     */
    @JsonProperty("amount")
    @JsonPropertyDescription("The allowable precision of the amount when placing an order. For example, given 2, then an amount of 0.123 must be made either 0.12 (or 0.13)")
    private Double amount;
    /**
     * The allowable precision of the amount when placing an order. For example, given 2, then a price of 0.123 must be made either 0.12 (or 0.13)
     * (Required)
     * 
     */
    @JsonProperty("price")
    @JsonPropertyDescription("The allowable precision of the amount when placing an order. For example, given 2, then a price of 0.123 must be made either 0.12 (or 0.13)")
    private Double price;

    /**
     * The allowable precision of the amount when placing an order. For example, given 2, then an amount of 0.123 must be made either 0.12 (or 0.13)
     * (Required)
     * 
     */
    @JsonProperty("amount")
    public Double getAmount() {
        return amount;
    }

    /**
     * The allowable precision of the amount when placing an order. For example, given 2, then an amount of 0.123 must be made either 0.12 (or 0.13)
     * (Required)
     * 
     */
    @JsonProperty("amount")
    public void setAmount(Double amount) {
        this.amount = amount;
    }

    /**
     * The allowable precision of the amount when placing an order. For example, given 2, then a price of 0.123 must be made either 0.12 (or 0.13)
     * (Required)
     * 
     */
    @JsonProperty("price")
    public Double getPrice() {
        return price;
    }

    /**
     * The allowable precision of the amount when placing an order. For example, given 2, then a price of 0.123 must be made either 0.12 (or 0.13)
     * (Required)
     * 
     */
    @JsonProperty("price")
    public void setPrice(Double price) {
        this.price = price;
    }

}
