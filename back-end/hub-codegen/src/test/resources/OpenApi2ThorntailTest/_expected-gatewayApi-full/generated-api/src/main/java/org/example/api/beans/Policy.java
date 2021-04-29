
package org.example.api.beans;

import javax.annotation.processing.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;


/**
 * Policy
 * <p>
 * 
 * 
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "policyJsonConfig",
    "policyImpl"
})
@Generated("jsonschema2pojo")
public class Policy {

    /**
     * Policy JSON config
     * <p>
     * The policy's escaped/serialised configuration.
     * (Required)
     * 
     */
    @JsonProperty("policyJsonConfig")
    @JsonPropertyDescription("The policy's escaped/serialised configuration.")
    private String policyJsonConfig;
    /**
     * Policy implementation.
     * <p>
     * Policy implementation coordinates, either: 
     * 
     * * class:[Fully qualified class reference]
     * * plugin:[GroupId]:[ArtifactId]:[Version]:war/[Fully qualified class name]'
     * 
     * For example:
     * 
     * * `class:io.apiman.gateway.engine.policies.BasicAuthenticationPolicy`
     * * `plugin:io.apiman.plugins:apiman-plugins-simple-header-policy:1.3.1.Final:war/io.apiman.plugins.simpleheaderpolicy.SimpleHeaderPolicy`
     * 
     * A plugin's class reference can usually be found in the documentation, 
     * or via the plugin's `apiman/policyDefs/[POLICY-NAME]-policyDef.json`
     * metadata in the `policyImpl` field. 
     * 
     * **It may be easier to use the apiman-cli tool to generate this 
     * configuration for you.**
     * 
     * Note that the fully qualified class name must be a valid Java FQN, however
     * that is not explicitly checked here due to its complexity.
     * 
     * (Required)
     * 
     */
    @JsonProperty("policyImpl")
    @JsonPropertyDescription("Policy implementation coordinates, either: \n\n* class:[Fully qualified class reference]\n* plugin:[GroupId]:[ArtifactId]:[Version]:war/[Fully qualified class name]'\n\nFor example:\n\n* `class:io.apiman.gateway.engine.policies.BasicAuthenticationPolicy`\n* `plugin:io.apiman.plugins:apiman-plugins-simple-header-policy:1.3.1.Final:war/io.apiman.plugins.simpleheaderpolicy.SimpleHeaderPolicy`\n\nA plugin's class reference can usually be found in the documentation, \nor via the plugin's `apiman/policyDefs/[POLICY-NAME]-policyDef.json`\nmetadata in the `policyImpl` field. \n\n**It may be easier to use the apiman-cli tool to generate this \nconfiguration for you.**\n\nNote that the fully qualified class name must be a valid Java FQN, however\nthat is not explicitly checked here due to its complexity.\n")
    private String policyImpl;

    /**
     * Policy JSON config
     * <p>
     * The policy's escaped/serialised configuration.
     * (Required)
     * 
     */
    @JsonProperty("policyJsonConfig")
    public String getPolicyJsonConfig() {
        return policyJsonConfig;
    }

    /**
     * Policy JSON config
     * <p>
     * The policy's escaped/serialised configuration.
     * (Required)
     * 
     */
    @JsonProperty("policyJsonConfig")
    public void setPolicyJsonConfig(String policyJsonConfig) {
        this.policyJsonConfig = policyJsonConfig;
    }

    /**
     * Policy implementation.
     * <p>
     * Policy implementation coordinates, either: 
     * 
     * * class:[Fully qualified class reference]
     * * plugin:[GroupId]:[ArtifactId]:[Version]:war/[Fully qualified class name]'
     * 
     * For example:
     * 
     * * `class:io.apiman.gateway.engine.policies.BasicAuthenticationPolicy`
     * * `plugin:io.apiman.plugins:apiman-plugins-simple-header-policy:1.3.1.Final:war/io.apiman.plugins.simpleheaderpolicy.SimpleHeaderPolicy`
     * 
     * A plugin's class reference can usually be found in the documentation, 
     * or via the plugin's `apiman/policyDefs/[POLICY-NAME]-policyDef.json`
     * metadata in the `policyImpl` field. 
     * 
     * **It may be easier to use the apiman-cli tool to generate this 
     * configuration for you.**
     * 
     * Note that the fully qualified class name must be a valid Java FQN, however
     * that is not explicitly checked here due to its complexity.
     * 
     * (Required)
     * 
     */
    @JsonProperty("policyImpl")
    public String getPolicyImpl() {
        return policyImpl;
    }

    /**
     * Policy implementation.
     * <p>
     * Policy implementation coordinates, either: 
     * 
     * * class:[Fully qualified class reference]
     * * plugin:[GroupId]:[ArtifactId]:[Version]:war/[Fully qualified class name]'
     * 
     * For example:
     * 
     * * `class:io.apiman.gateway.engine.policies.BasicAuthenticationPolicy`
     * * `plugin:io.apiman.plugins:apiman-plugins-simple-header-policy:1.3.1.Final:war/io.apiman.plugins.simpleheaderpolicy.SimpleHeaderPolicy`
     * 
     * A plugin's class reference can usually be found in the documentation, 
     * or via the plugin's `apiman/policyDefs/[POLICY-NAME]-policyDef.json`
     * metadata in the `policyImpl` field. 
     * 
     * **It may be easier to use the apiman-cli tool to generate this 
     * configuration for you.**
     * 
     * Note that the fully qualified class name must be a valid Java FQN, however
     * that is not explicitly checked here due to its complexity.
     * 
     * (Required)
     * 
     */
    @JsonProperty("policyImpl")
    public void setPolicyImpl(String policyImpl) {
        this.policyImpl = policyImpl;
    }

}
