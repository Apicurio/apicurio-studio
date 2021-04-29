
package org.example.api.beans;

import javax.annotation.processing.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "token"
})
@Generated("jsonschema2pojo")
public class AccessToken {

    /**
     * The JWT token that needs to be added into the 'Authorization' header with the 'Bearer ' prefix. For example, given a token of xyz, do a secured request with 'Authorization: Bearer xyz'
     * (Required)
     * 
     */
    @JsonProperty("token")
    @JsonPropertyDescription("The JWT token that needs to be added into the 'Authorization' header with the 'Bearer ' prefix. For example, given a token of xyz, do a secured request with 'Authorization: Bearer xyz'")
    private String token;

    /**
     * The JWT token that needs to be added into the 'Authorization' header with the 'Bearer ' prefix. For example, given a token of xyz, do a secured request with 'Authorization: Bearer xyz'
     * (Required)
     * 
     */
    @JsonProperty("token")
    public String getToken() {
        return token;
    }

    /**
     * The JWT token that needs to be added into the 'Authorization' header with the 'Bearer ' prefix. For example, given a token of xyz, do a secured request with 'Authorization: Bearer xyz'
     * (Required)
     * 
     */
    @JsonProperty("token")
    public void setToken(String token) {
        this.token = token;
    }

}
