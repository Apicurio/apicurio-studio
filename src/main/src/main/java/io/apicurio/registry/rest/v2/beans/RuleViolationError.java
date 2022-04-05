
package io.apicurio.registry.rest.v2.beans;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;


/**
 * Root Type for Error
 * <p>
 * All error responses, whether `4xx` or `5xx` will include one of these as the response
 * body.
 * 
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "causes",
    "message",
    "error_code",
    "detail",
    "name"
})
@Generated("jsonschema2pojo")
@io.quarkus.runtime.annotations.RegisterForReflection
@lombok.ToString
public class RuleViolationError
    extends Error
{

    /**
     * List of rule violation causes.
     * (Required)
     * 
     */
    @JsonProperty("causes")
    @JsonPropertyDescription("List of rule violation causes.")
    private List<RuleViolationCause> causes = new ArrayList<RuleViolationCause>();
    /**
     * The short error message.
     * 
     */
    @JsonProperty("message")
    @JsonPropertyDescription("The short error message.")
    private String message;
    /**
     * The server-side error code.
     * 
     */
    @JsonProperty("error_code")
    @JsonPropertyDescription("The server-side error code.")
    private Integer errorCode;
    /**
     * Full details about the error.  This might contain a server stack trace, for example.
     * 
     */
    @JsonProperty("detail")
    @JsonPropertyDescription("Full details about the error.  This might contain a server stack trace, for example.")
    private String detail;
    /**
     * The error name - typically the classname of the exception thrown by the server.
     * 
     */
    @JsonProperty("name")
    @JsonPropertyDescription("The error name - typically the classname of the exception thrown by the server.")
    private String name;

    /**
     * List of rule violation causes.
     * (Required)
     * 
     */
    @JsonProperty("causes")
    public List<RuleViolationCause> getCauses() {
        return causes;
    }

    /**
     * List of rule violation causes.
     * (Required)
     * 
     */
    @JsonProperty("causes")
    public void setCauses(List<RuleViolationCause> causes) {
        this.causes = causes;
    }

    /**
     * The short error message.
     * 
     */
    @JsonProperty("message")
    public String getMessage() {
        return message;
    }

    /**
     * The short error message.
     * 
     */
    @JsonProperty("message")
    public void setMessage(String message) {
        this.message = message;
    }

    /**
     * The server-side error code.
     * 
     */
    @JsonProperty("error_code")
    public Integer getErrorCode() {
        return errorCode;
    }

    /**
     * The server-side error code.
     * 
     */
    @JsonProperty("error_code")
    public void setErrorCode(Integer errorCode) {
        this.errorCode = errorCode;
    }

    /**
     * Full details about the error.  This might contain a server stack trace, for example.
     * 
     */
    @JsonProperty("detail")
    public String getDetail() {
        return detail;
    }

    /**
     * Full details about the error.  This might contain a server stack trace, for example.
     * 
     */
    @JsonProperty("detail")
    public void setDetail(String detail) {
        this.detail = detail;
    }

    /**
     * The error name - typically the classname of the exception thrown by the server.
     * 
     */
    @JsonProperty("name")
    public String getName() {
        return name;
    }

    /**
     * The error name - typically the classname of the exception thrown by the server.
     * 
     */
    @JsonProperty("name")
    public void setName(String name) {
        this.name = name;
    }

}
