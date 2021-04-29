
package org.example.api.beans;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "info",
    "balances"
})
@Generated("jsonschema2pojo")
public class BalanceResponse {

    /**
     * Raw balance response gotten from the exchange site's API
     * (Required)
     * 
     */
    @JsonProperty("info")
    @JsonPropertyDescription("Raw balance response gotten from the exchange site's API")
    private Info info;
    /**
     * List of balances per currency that you own
     * (Required)
     * 
     */
    @JsonProperty("balances")
    @JsonPropertyDescription("List of balances per currency that you own")
    private List<BalanceInfo> balances = new ArrayList<BalanceInfo>();

    /**
     * Raw balance response gotten from the exchange site's API
     * (Required)
     * 
     */
    @JsonProperty("info")
    public Info getInfo() {
        return info;
    }

    /**
     * Raw balance response gotten from the exchange site's API
     * (Required)
     * 
     */
    @JsonProperty("info")
    public void setInfo(Info info) {
        this.info = info;
    }

    /**
     * List of balances per currency that you own
     * (Required)
     * 
     */
    @JsonProperty("balances")
    public List<BalanceInfo> getBalances() {
        return balances;
    }

    /**
     * List of balances per currency that you own
     * (Required)
     * 
     */
    @JsonProperty("balances")
    public void setBalances(List<BalanceInfo> balances) {
        this.balances = balances;
    }

}
