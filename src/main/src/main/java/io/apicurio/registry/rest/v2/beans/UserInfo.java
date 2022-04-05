
package io.apicurio.registry.rest.v2.beans;

import javax.annotation.processing.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;


/**
 * Root Type for UserInfo
 * <p>
 * Information about a single user.
 * 
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "username",
    "displayName",
    "admin",
    "developer",
    "viewer"
})
@Generated("jsonschema2pojo")
@io.quarkus.runtime.annotations.RegisterForReflection
@lombok.ToString
public class UserInfo {

    @JsonProperty("username")
    private String username;
    @JsonProperty("displayName")
    private String displayName;
    @JsonProperty("admin")
    private Boolean admin;
    @JsonProperty("developer")
    private Boolean developer;
    @JsonProperty("viewer")
    private Boolean viewer;

    @JsonProperty("username")
    public String getUsername() {
        return username;
    }

    @JsonProperty("username")
    public void setUsername(String username) {
        this.username = username;
    }

    @JsonProperty("displayName")
    public String getDisplayName() {
        return displayName;
    }

    @JsonProperty("displayName")
    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    @JsonProperty("admin")
    public Boolean getAdmin() {
        return admin;
    }

    @JsonProperty("admin")
    public void setAdmin(Boolean admin) {
        this.admin = admin;
    }

    @JsonProperty("developer")
    public Boolean getDeveloper() {
        return developer;
    }

    @JsonProperty("developer")
    public void setDeveloper(Boolean developer) {
        this.developer = developer;
    }

    @JsonProperty("viewer")
    public Boolean getViewer() {
        return viewer;
    }

    @JsonProperty("viewer")
    public void setViewer(Boolean viewer) {
        this.viewer = viewer;
    }

}
