
package io.apicurio.registry.rest.v2.beans;

import javax.annotation.processing.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.apicurio.registry.types.RoleType;


/**
 * Root Type for UpdateRole
 * <p>
 * 
 * 
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "role"
})
@Generated("jsonschema2pojo")
@io.quarkus.runtime.annotations.RegisterForReflection
@lombok.ToString
public class UpdateRole {

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("role")
    @JsonPropertyDescription("")
    private RoleType role;

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("role")
    public RoleType getRole() {
        return role;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("role")
    public void setRole(RoleType role) {
        this.role = role;
    }

}
