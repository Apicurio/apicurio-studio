package io.apicurio.hub.api.gitlab;

import org.junit.Assert;
import org.junit.Test;

public class GitLabResourceResolverTest {

    @Test
    public void test() {
        GitLabResource resource = GitLabResourceResolver.resolve("https://gitlab.com/innodays/apicurio-awesomeness/blob/master/newApi.json");
        Assert.assertEquals("innodays", resource.getGroup());
        Assert.assertEquals("apicurio-awesomeness", resource.getProject());
        Assert.assertEquals("master", resource.getBranch());
        Assert.assertEquals("newApi.json", resource.getResourcePath());

        resource = GitLabResourceResolver.resolve("https://gitlab.com/Apicurio/api-samples/blob/master/pet-store.json");
        Assert.assertEquals("Apicurio", resource.getGroup());
        Assert.assertEquals("api-samples", resource.getProject());
        Assert.assertEquals("master", resource.getBranch());
        Assert.assertEquals("pet-store.json", resource.getResourcePath());

        resource = GitLabResourceResolver.resolve("https://gitlab.com/Apicurio/api-samples/blob/jjackf/3.0/simple-api.json");
        Assert.assertEquals("Apicurio", resource.getGroup());
        Assert.assertEquals("api-samples", resource.getProject());
        Assert.assertEquals("jjackf", resource.getBranch());
        Assert.assertEquals("3.0/simple-api.json", resource.getResourcePath());

    }

}
