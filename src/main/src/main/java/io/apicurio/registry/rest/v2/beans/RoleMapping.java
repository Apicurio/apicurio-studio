
package io.apicurio.registry.rest.v2.beans;

import javax.annotation.processing.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.apicurio.registry.types.RoleType;


/**
 * The mapping between a user/principal and their role.
 * 
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "principalId",
    "role",
    "principalName"
})
@Generated("jsonschema2pojo")
@io.quarkus.runtime.annotations.RegisterForReflection
@lombok.ToString
public class RoleMapping {

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("principalId")
    @JsonPropertyDescription("")
    private String principalId;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("role")
    @JsonPropertyDescription("")
    private RoleType role;
    /**
     * A friendly name for the principal.
     * 
     */
    @JsonProperty("principalName")
    @JsonPropertyDescription("A friendly name for the principal.")
    private String principalName;

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("principalId")
    public String getPrincipalId() {
        return principalId;
    }

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("principalId")
    public void setPrincipalId(String principalId) {
        this.principalId = principalId;
    }

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

    /**
     * A friendly name for the principal.
     * 
     */
    @JsonProperty("principalName")
    public String getPrincipalName() {
        return principalName;
    }

    /**
     * A friendly name for the principal.
     * 
     */
    @JsonProperty("principalName")
    public void setPrincipalName(String principalName) {
        this.principalName = principalName;
    }

}
