
package io.apicurio.studio.rest.v1.beans;

import javax.annotation.processing.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;


/**
 * Root Type for TeamMember
 * <p>
 * 
 * 
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "principal"
})
@Generated("jsonschema2pojo")
@io.quarkus.runtime.annotations.RegisterForReflection
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor
@lombok.EqualsAndHashCode
@lombok.ToString
public class TeamMember {

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("principal")
    private String principal;

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("principal")
    public String getPrincipal() {
        return principal;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("principal")
    public void setPrincipal(String principal) {
        this.principal = principal;
    }

}
