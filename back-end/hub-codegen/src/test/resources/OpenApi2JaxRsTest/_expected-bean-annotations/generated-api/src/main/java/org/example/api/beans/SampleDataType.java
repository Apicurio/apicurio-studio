
package org.example.api.beans;

import javax.annotation.processing.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;


/**
 * 
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "name",
    "mylong",
    "myint"
})
@Generated("jsonschema2pojo")
@javax.enterprise.context.ApplicationScoped
public class SampleDataType {

    /**
     * 
     */
    @JsonProperty("name")
    @JsonPropertyDescription("")
    private String name;
    /**
     * 
     */
    @JsonProperty("mylong")
    @JsonPropertyDescription("")
    private Long mylong;
    /**
     * 
     */
    @JsonProperty("myint")
    @JsonPropertyDescription("")
    private Integer myint;

    /**
     * 
     */
    @JsonProperty("name")
    public String getName() {
        return name;
    }

    /**
     * 
     */
    @JsonProperty("name")
    public void setName(String name) {
        this.name = name;
    }

    /**
     * 
     */
    @JsonProperty("mylong")
    public Long getMylong() {
        return mylong;
    }

    /**
     * 
     */
    @JsonProperty("mylong")
    public void setMylong(Long mylong) {
        this.mylong = mylong;
    }

    /**
     * 
     */
    @JsonProperty("myint")
    public Integer getMyint() {
        return myint;
    }

    /**
     * 
     */
    @JsonProperty("myint")
    public void setMyint(Integer myint) {
        this.myint = myint;
    }

}
