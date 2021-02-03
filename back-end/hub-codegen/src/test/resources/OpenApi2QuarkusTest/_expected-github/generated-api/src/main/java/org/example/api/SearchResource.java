package org.example.api;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/search")
public interface SearchResource {
  /**
   * Searches for query terms inside of a file. This method returns up to 100 results [per page](https://developer.github.com/v3/#pagination).
   *
   * When searching for code, you can get text match metadata for the file **content** and file **path** fields when you pass the `text-match` media type. For more details about how to receive highlighted search results, see [Text match metadata](https://developer.github.com/v3/search/#text-match-metadata).
   *
   * For example, if you want to find the definition of the `addClass` function inside [jQuery](https://github.com/jquery/jquery) repository, your query would look something like this:
   *
   * `q=addClass+in:file+language:js+repo:jquery/jquery`
   *
   * This query searches for the keyword `addClass` within a file's contents. The query limits the search to files where the language is JavaScript in the `jquery/jquery` repository.
   *
   * #### Considerations for code search
   *
   * Due to the complexity of searching code, there are a few restrictions on how searches are performed:
   *
   * *   Only the _default branch_ is considered. In most cases, this will be the `master` branch.
   * *   Only files smaller than 384 KB are searchable.
   * *   You must always include at least one search term when searching source code. For example, searching for [`language:go`](https://github.com/search?utf8=%E2%9C%93&q=language%3Ago&type=Code) is not valid, while [`amazing
   * language:go`](https://github.com/search?utf8=%E2%9C%93&q=amazing+language%3Ago&type=Code) is.
   */
  @Path("/code")
  @GET
  @Produces("application/json")
  Response search_code(@QueryParam("q") String q, @QueryParam("sort") String sort,
      @QueryParam("order") String order, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Find labels in a repository with names or descriptions that match search keywords. Returns up to 100 results [per page](https://developer.github.com/v3/#pagination).
   *
   * When searching for labels, you can get text match metadata for the label **name** and **description** fields when you pass the `text-match` media type. For more details about how to receive highlighted search results, see [Text match metadata](https://developer.github.com/v3/search/#text-match-metadata).
   *
   * For example, if you want to find labels in the `linguist` repository that match `bug`, `defect`, or `enhancement`. Your query might look like this:
   *
   * `q=bug+defect+enhancement&repository_id=64778136`
   *
   * The labels that best match the query appear first in the search results.
   */
  @Path("/labels")
  @GET
  @Produces("application/json")
  Response search_labels(@QueryParam("repository_id") Integer repositoryId,
      @QueryParam("q") String q, @QueryParam("sort") String sort,
      @QueryParam("order") String order);

  /**
   * Find users via various criteria. This method returns up to 100 results [per page](https://developer.github.com/v3/#pagination).
   *
   * When searching for users, you can get text match metadata for the issue **login**, **email**, and **name** fields when you pass the `text-match` media type. For more details about highlighting search results, see [Text match metadata](https://developer.github.com/v3/search/#text-match-metadata). For more details about how to receive highlighted search results, see [Text match metadata](https://developer.github.com/v3/search/#text-match-metadata).
   *
   * For example, if you're looking for a list of popular users, you might try this query:
   *
   * `q=tom+repos:%3E42+followers:%3E1000`
   *
   * This query searches for users with the name `tom`. The results are restricted to users with more than 42 repositories and over 1,000 followers.
   */
  @Path("/users")
  @GET
  @Produces("application/json")
  Response search_users(@QueryParam("q") String q, @QueryParam("sort") String sort,
      @QueryParam("order") String order, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Find commits via various criteria on the default branch (usually `master`). This method returns up to 100 results [per page](https://developer.github.com/v3/#pagination).
   *
   * When searching for commits, you can get text match metadata for the **message** field when you provide the `text-match` media type. For more details about how to receive highlighted search results, see [Text match
   * metadata](https://developer.github.com/v3/search/#text-match-metadata).
   *
   * For example, if you want to find commits related to CSS in the [octocat/Spoon-Knife](https://github.com/octocat/Spoon-Knife) repository. Your query would look something like this:
   *
   * `q=repo:octocat/Spoon-Knife+css`
   */
  @Path("/commits")
  @GET
  @Produces("application/json")
  Response search_commits(@QueryParam("q") String q, @QueryParam("sort") String sort,
      @QueryParam("order") String order, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Find issues by state and keyword. This method returns up to 100 results [per page](https://developer.github.com/v3/#pagination).
   *
   * When searching for issues, you can get text match metadata for the issue **title**, issue **body**, and issue **comment body** fields when you pass the `text-match` media type. For more details about how to receive highlighted
   * search results, see [Text match metadata](https://developer.github.com/v3/search/#text-match-metadata).
   *
   * For example, if you want to find the oldest unresolved Python bugs on Windows. Your query might look something like this.
   *
   * `q=windows+label:bug+language:python+state:open&sort=created&order=asc`
   *
   * This query searches for the keyword `windows`, within any open issue that is labeled as `bug`. The search runs across repositories whose primary language is Python. The results are sorted by creation date in ascending order, whick means the oldest issues appear first in the search results.
   */
  @Path("/issues")
  @GET
  @Produces("application/json")
  Response search_issues_and_pull_requests(@QueryParam("q") String q,
      @QueryParam("sort") String sort, @QueryParam("order") String order,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * Find repositories via various criteria. This method returns up to 100 results [per page](https://developer.github.com/v3/#pagination).
   *
   * When searching for repositories, you can get text match metadata for the **name** and **description** fields when you pass the `text-match` media type. For more details about how to receive highlighted search results, see [Text match metadata](https://developer.github.com/v3/search/#text-match-metadata).
   *
   * For example, if you want to search for popular Tetris repositories written in assembly code, your query might look like this:
   *
   * `q=tetris+language:assembly&sort=stars&order=desc`
   *
   * This query searches for repositories with the word `tetris` in the name, the description, or the README. The results are limited to repositories where the primary language is assembly. The results are sorted by stars in descending order, so that the most popular repositories appear first in the search results.
   *
   * When you include the `mercy` preview header, you can also search for multiple topics by adding more `topic:` instances. For example, your query might look like this:
   *
   * `q=topic:ruby+topic:rails`
   */
  @Path("/repositories")
  @GET
  @Produces("application/json")
  Response search_repos(@QueryParam("q") String q, @QueryParam("sort") String sort,
      @QueryParam("order") String order, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Find topics via various criteria. Results are sorted by best match. This method returns up to 100 results [per page](https://developer.github.com/v3/#pagination). See "[Searching topics](https://help.github.com/articles/searching-topics/)" for a detailed list of qualifiers.
   *
   * When searching for topics, you can get text match metadata for the topic's **short\_description**, **description**, **name**, or **display\_name** field when you pass the `text-match` media type. For more details about how to receive highlighted search results, see [Text match metadata](https://developer.github.com/v3/search/#text-match-metadata).
   *
   * For example, if you want to search for topics related to Ruby that are featured on https://github.com/topics. Your query might look like this:
   *
   * `q=ruby+is:featured`
   *
   * This query searches for topics with the keyword `ruby` and limits the results to find only topics that are featured. The topics that are the best match for the query appear first in the search results.
   */
  @Path("/topics")
  @GET
  @Produces("application/json")
  Response search_topics(@QueryParam("q") String q);
}
