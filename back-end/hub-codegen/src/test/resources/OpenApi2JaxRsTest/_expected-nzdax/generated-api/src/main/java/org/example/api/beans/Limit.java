
package org.example.api.beans;

import javax.annotation.processing.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "min",
    "max"
})
@Generated("jsonschema2pojo")
public class Limit {

    /**
     * The minimum allowable value
     * (Required)
     * 
     */
    @JsonProperty("min")
    @JsonPropertyDescription("The minimum allowable value")
    private Double min;
    /**
     * The maximum allowable value
     * (Required)
     * 
     */
    @JsonProperty("max")
    @JsonPropertyDescription("The maximum allowable value")
    private Double max;

    /**
     * The minimum allowable value
     * (Required)
     * 
     */
    @JsonProperty("min")
    public Double getMin() {
        return min;
    }

    /**
     * The minimum allowable value
     * (Required)
     * 
     */
    @JsonProperty("min")
    public void setMin(Double min) {
        this.min = min;
    }

    /**
     * The maximum allowable value
     * (Required)
     * 
     */
    @JsonProperty("max")
    public Double getMax() {
        return max;
    }

    /**
     * The maximum allowable value
     * (Required)
     * 
     */
    @JsonProperty("max")
    public void setMax(Double max) {
        this.max = max;
    }

}
