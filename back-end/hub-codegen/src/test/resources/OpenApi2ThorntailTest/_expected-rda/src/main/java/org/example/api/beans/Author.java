
package org.example.api.beans;

import javax.annotation.processing.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;


/**
 * The author of the metadata 
 * 
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "firstName",
    "familyName",
    "email"
})
@Generated("jsonschema2pojo")
public class Author {

    @JsonProperty("firstName")
    private String firstName;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("familyName")
    private String familyName;
    /**
     * email for the author
     * (Required)
     * 
     */
    @JsonProperty("email")
    @JsonPropertyDescription("email for the author")
    private String email;

    @JsonProperty("firstName")
    public String getFirstName() {
        return firstName;
    }

    @JsonProperty("firstName")
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("familyName")
    public String getFamilyName() {
        return familyName;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("familyName")
    public void setFamilyName(String familyName) {
        this.familyName = familyName;
    }

    /**
     * email for the author
     * (Required)
     * 
     */
    @JsonProperty("email")
    public String getEmail() {
        return email;
    }

    /**
     * email for the author
     * (Required)
     * 
     */
    @JsonProperty("email")
    public void setEmail(String email) {
        this.email = email;
    }

}
