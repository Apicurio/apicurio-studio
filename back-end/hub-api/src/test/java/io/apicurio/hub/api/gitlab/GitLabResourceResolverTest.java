package io.apicurio.hub.api.gitlab;

import io.apicurio.hub.api.github.GitHubResource;
import io.apicurio.hub.api.github.GitHubResourceResolver;
import org.junit.Assert;
import org.junit.Test;

public class GitLabResourceResolverTest {

    @Test
    public void test() {
        GitLabResource resource = GitLabResourceResolver.resolve("https://gitlab.com/innodays/apicurio-awesomeness/blob/master/newApi.json");
        Assert.assertEquals("innodays", resource.getGroup());
        Assert.assertEquals("apicurio-awesomeness", resource.getProject());
        Assert.assertEquals("master", resource.getProject());
        Assert.assertEquals("newApi.json", resource.getResourcePath());

    }

}
