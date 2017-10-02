package io.apicurio.hub.api.gitlab;

import io.apicurio.hub.api.github.GitHubResource;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class GitLabResourceResolver {

    private static Pattern pattern = Pattern.compile("https://gitlab.com/([^/]+)/([^/]+)/blob/([^/]+)/(.*.json)");

    /**
     * Resolves a github URL into a resource object.  The URL must be of the proper format.
     * @param glUrl
     */
    public static GitLabResource resolve(String glUrl) {
        Matcher matcher = pattern.matcher(glUrl);
        if (matcher.matches()) {
            GitLabResource resource = new GitLabResource();
            String org = matcher.group(1);
            String repo = matcher.group(2);
            String branch = matcher.group(3);
            String path = matcher.group(4);
            resource.setGroup(org);
            resource.setProject(repo);
            resource.setBranch(branch);
            resource.setResourcePath(path);
            return resource;
        }
        return null;
    }

}
