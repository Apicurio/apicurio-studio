
package org.example.api.beans;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;


/**
 * Keywords that apply to the template
 * 
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "keywordArray"
})
@Generated("jsonschema2pojo")
public class Keywords {

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("keywordArray")
    private List<String> keywordArray = new ArrayList<String>();

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("keywordArray")
    public List<String> getKeywordArray() {
        return keywordArray;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("keywordArray")
    public void setKeywordArray(List<String> keywordArray) {
        this.keywordArray = keywordArray;
    }

}
