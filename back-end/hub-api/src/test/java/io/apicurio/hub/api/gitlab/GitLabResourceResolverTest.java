package io.apicurio.hub.api.gitlab;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import io.apicurio.hub.core.config.HubConfiguration;
import io.apicurio.test.core.TestUtil;

public class GitLabResourceResolverTest {

    private GitLabResourceResolver resolver;
    private HubConfiguration config;

    @Before
    public void setUp() {
        resolver = new GitLabResourceResolver();
        config = new HubConfiguration();
        
        TestUtil.setPrivateField(resolver, "config", config);
        resolver.postConstruct();
    }
    
    @After
    public void tearDown() throws Exception {
    }

    @Test
    public void test() {
        GitLabResource resource = resolver.resolve("https://gitlab.com/innodays/apicurio-awesomeness/blob/master/newApi.json");
        Assert.assertEquals("innodays", resource.getGroup());
        Assert.assertEquals("apicurio-awesomeness", resource.getProject());
        Assert.assertEquals("master", resource.getBranch());
        Assert.assertEquals("newApi.json", resource.getResourcePath());

        resource = resolver.resolve("https://gitlab.com/Apicurio/api-samples/blob/master/pet-store.json");
        Assert.assertEquals("Apicurio", resource.getGroup());
        Assert.assertEquals("api-samples", resource.getProject());
        Assert.assertEquals("master", resource.getBranch());
        Assert.assertEquals("pet-store.json", resource.getResourcePath());

        resource = resolver.resolve("https://gitlab.com/Apicurio/api-samples/blob/jjackf/3.0/simple-api.json");
        Assert.assertEquals("Apicurio", resource.getGroup());
        Assert.assertEquals("api-samples", resource.getProject());
        Assert.assertEquals("jjackf", resource.getBranch());
        Assert.assertEquals("3.0/simple-api.json", resource.getResourcePath());

        resource = resolver.resolve("https://gitlab.com/apicurio-private/apicurio-private-sub2/sub2-project-2/blob/master/README.md");
        Assert.assertEquals("apicurio-private/apicurio-private-sub2", resource.getGroup());
        Assert.assertEquals("sub2-project-2", resource.getProject());
        Assert.assertEquals("master", resource.getBranch());
        Assert.assertEquals("README.md", resource.getResourcePath());

        resource = resolver.resolve("https://gitlab.com/private.account/private-project/blob/feature-1%2Ffeature-name/apis/foo-api.yaml");
        Assert.assertEquals("private.account", resource.getGroup());
        Assert.assertEquals("private-project", resource.getProject());
        Assert.assertEquals("feature-1/feature-name", resource.getBranch());
        Assert.assertEquals("apis/foo-api.yaml", resource.getResourcePath());
    }

    @Test
    public void test_yaml() {
        GitLabResource resource = resolver.resolve("https://gitlab.com/innodays/apicurio-awesomeness/blob/master/newApi.yaml");
        Assert.assertEquals("innodays", resource.getGroup());
        Assert.assertEquals("apicurio-awesomeness", resource.getProject());
        Assert.assertEquals("master", resource.getBranch());
        Assert.assertEquals("newApi.yaml", resource.getResourcePath());

        resource = resolver.resolve("https://gitlab.com/Apicurio/api-samples/blob/master/pet-store.yml");
        Assert.assertEquals("Apicurio", resource.getGroup());
        Assert.assertEquals("api-samples", resource.getProject());
        Assert.assertEquals("master", resource.getBranch());
        Assert.assertEquals("pet-store.yml", resource.getResourcePath());

        resource = resolver.resolve("https://gitlab.com/Apicurio/api-samples/blob/jjackf/3.0/simple-api.yaml");
        Assert.assertEquals("Apicurio", resource.getGroup());
        Assert.assertEquals("api-samples", resource.getProject());
        Assert.assertEquals("jjackf", resource.getBranch());
        Assert.assertEquals("3.0/simple-api.yaml", resource.getResourcePath());
    }

}
