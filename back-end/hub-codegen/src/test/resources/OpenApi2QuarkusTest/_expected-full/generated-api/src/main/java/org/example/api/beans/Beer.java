
package org.example.api.beans;

import javax.annotation.processing.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;


/**
 * Root Type for Beer
 * <p>
 * The root of the Beer type's schema.
 * 
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "id",
    "abv",
    "ibu",
    "name",
    "style",
    "breweryId",
    "ounces"
})
@Generated("jsonschema2pojo")
public class Beer {

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("id")
    private Integer id;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("abv")
    private Double abv;
    @JsonProperty("ibu")
    private Double ibu;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("name")
    private String name;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("style")
    private String style;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("breweryId")
    private Integer breweryId;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("ounces")
    private Double ounces;

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("id")
    public Integer getId() {
        return id;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("id")
    public void setId(Integer id) {
        this.id = id;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("abv")
    public Double getAbv() {
        return abv;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("abv")
    public void setAbv(Double abv) {
        this.abv = abv;
    }

    @JsonProperty("ibu")
    public Double getIbu() {
        return ibu;
    }

    @JsonProperty("ibu")
    public void setIbu(Double ibu) {
        this.ibu = ibu;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("name")
    public String getName() {
        return name;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("name")
    public void setName(String name) {
        this.name = name;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("style")
    public String getStyle() {
        return style;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("style")
    public void setStyle(String style) {
        this.style = style;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("breweryId")
    public Integer getBreweryId() {
        return breweryId;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("breweryId")
    public void setBreweryId(Integer breweryId) {
        this.breweryId = breweryId;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("ounces")
    public Double getOunces() {
        return ounces;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("ounces")
    public void setOunces(Double ounces) {
        this.ounces = ounces;
    }

}
