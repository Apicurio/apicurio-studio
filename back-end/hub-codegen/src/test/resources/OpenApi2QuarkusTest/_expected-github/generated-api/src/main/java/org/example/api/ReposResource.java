package org.example.api;

import java.io.InputStream;
import java.util.List;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PATCH;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/repos")
public interface ReposResource {
  /**
   * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   *
   * Lists the teams who have push access to this branch. The list includes child teams.
   */
  @Path("/{owner}/{repo}/branches/{branch}/protection/restrictions/teams")
  @GET
  @Produces("application/json")
  Response repos_get_teams_with_access_to_protected_branch(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("branch") String branch);

  /**
   * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   *
   * Replaces the list of teams that have push access to this branch. This removes all teams that previously had push access and grants push access to the new list of teams. Team restrictions include child teams.
   *
   * | Type    | Description                                                                                                                                |
   * | ------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
   * | `array` | The teams that can have push access. Use the team's `slug`. **Note**: The list of users, apps, and teams in total is limited to 100 items. |
   */
  @Path("/{owner}/{repo}/branches/{branch}/protection/restrictions/teams")
  @PUT
  @Produces("application/json")
  @Consumes("application/json")
  Response repos_set_team_access_restrictions(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("branch") String branch, List<String> data);

  /**
   * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   *
   * Grants the specified teams push access for this branch. You can also give push access to child teams.
   *
   * | Type    | Description                                                                                                                                |
   * | ------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
   * | `array` | The teams that can have push access. Use the team's `slug`. **Note**: The list of users, apps, and teams in total is limited to 100 items. |
   */
  @Path("/{owner}/{repo}/branches/{branch}/protection/restrictions/teams")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response repos_add_team_access_restrictions(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("branch") String branch, List<String> data);

  /**
   * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   *
   * Removes the ability of a team to push to this branch. You can also remove push access for child teams.
   *
   * | Type    | Description                                                                                                                                         |
   * | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
   * | `array` | Teams that should no longer have push access. Use the team's `slug`. **Note**: The list of users, apps, and teams in total is limited to 100 items. |
   */
  @Path("/{owner}/{repo}/branches/{branch}/protection/restrictions/teams")
  @DELETE
  @Produces("application/json")
  @Consumes("application/json")
  Response repos_remove_team_access_restrictions(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("branch") String branch, List<String> data);

  /**
   * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   *
   * Returns all branches where the given commit SHA is the HEAD, or latest commit for the branch.
   */
  @Path("/{owner}/{repo}/commits/{commit_sha}/branches-where-head")
  @GET
  @Produces("application/json")
  Response repos_list_branches_for_head_commit(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("commit_sha") String commitSha);

  /**
   * Get the top 10 popular contents over the last 14 days.
   */
  @Path("/{owner}/{repo}/traffic/popular/paths")
  @GET
  @Produces("application/json")
  Response repos_get_top_paths(@PathParam("owner") String owner, @PathParam("repo") String repo);

  /**
   *
   */
  @Path("/{owner}/{repo}/deployments/{deployment_id}")
  @GET
  @Produces("application/json")
  Response repos_get_deployment(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("deployment_id") Integer deploymentId);

  /**
   * To ensure there can always be an active deployment, you can only delete an _inactive_ deployment. Anyone with `repo` or `repo_deployment` scopes can delete an inactive deployment.
   *
   * To set a deployment as inactive, you must:
   *
   * *   Create a new deployment that is active so that the system has a record of the current state, then delete the previously active deployment.
   * *   Mark the active deployment as inactive by adding any non-successful deployment status.
   *
   * For more information, see "[Create a deployment](https://developer.github.com/v3/repos/deployments/#create-a-deployment)" and "[Create a deployment status](https://developer.github.com/v3/repos/deployments/#create-a-deployment-status)."
   */
  @Path("/{owner}/{repo}/deployments/{deployment_id}")
  @DELETE
  void repos_delete_deployment(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("deployment_id") Integer deploymentId);

  /**
   * To download the asset's binary content, set the `Accept` header of the request to [`application/octet-stream`](https://developer.github.com/v3/media/#media-types). The API will either redirect the client to the location, or stream it directly if possible. API clients should handle both a `200` or `302` response.
   */
  @Path("/{owner}/{repo}/releases/assets/{asset_id}")
  @GET
  @Produces("application/json")
  Response repos_get_release_asset(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("asset_id") Integer assetId);

  /**
   *
   */
  @Path("/{owner}/{repo}/releases/assets/{asset_id}")
  @DELETE
  void repos_delete_release_asset(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("asset_id") Integer assetId);

  /**
   * Users with push access to the repository can edit a release asset.
   */
  @Path("/{owner}/{repo}/releases/assets/{asset_id}")
  @PATCH
  @Produces("application/json")
  @Consumes("application/json")
  Response repos_update_release_asset(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("asset_id") Integer assetId, InputStream data);

  /**
   * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   */
  @Path("/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts")
  @GET
  @Produces("application/json")
  List<String> repos_get_all_status_check_contexts(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("branch") String branch);

  /**
   * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   */
  @Path("/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts")
  @PUT
  @Produces("application/json")
  @Consumes("application/json")
  List<String> repos_set_status_check_contexts(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("branch") String branch, List<String> data);

  /**
   * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   */
  @Path("/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  List<String> repos_add_status_check_contexts(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("branch") String branch, List<String> data);

  /**
   * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   */
  @Path("/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts")
  @DELETE
  @Produces("application/json")
  @Consumes("application/json")
  List<String> repos_remove_status_check_contexts(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("branch") String branch, List<String> data);

  /**
   * Gets the contents of a file or directory in a repository. Specify the file path or directory in `:path`. If you omit
   * `:path`, you will receive the contents of all files in the repository.
   *
   * Files and symlinks support [a custom media type](https://developer.github.com/v3/repos/contents/#custom-media-types) for
   * retrieving the raw content or rendered HTML (when supported). All content types support [a custom media
   * type](https://developer.github.com/v3/repos/contents/#custom-media-types) to ensure the content is returned in a consistent
   * object format.
   *
   * **Note**:
   * *   To get a repository's contents recursively, you can [recursively get the tree](https://developer.github.com/v3/git/trees/).
   * *   This API has an upper limit of 1,000 files for a directory. If you need to retrieve more files, use the [Git Trees
   * API](https://developer.github.com/v3/git/trees/#get-a-tree).
   * *   This API supports files up to 1 megabyte in size.
   *
   * #### If the content is a directory
   * The response will be an array of objects, one object for each item in the directory.
   * When listing the contents of a directory, submodules have their "type" specified as "file". Logically, the value
   * _should_ be "submodule". This behavior exists in API v3 [for backwards compatibility purposes](https://git.io/v1YCW).
   * In the next major version of the API, the type will be returned as "submodule".
   *
   * #### If the content is a symlink 
   * If the requested `:path` points to a symlink, and the symlink's target is a normal file in the repository, then the
   * API responds with the content of the file (in the format shown in the example. Otherwise, the API responds with an object 
   * describing the symlink itself.
   *
   * #### If the content is a submodule
   * The `submodule_git_url` identifies the location of the submodule repository, and the `sha` identifies a specific
   * commit within the submodule repository. Git uses the given URL when cloning the submodule repository, and checks out
   * the submodule at that specific commit.
   *
   * If the submodule repository is not hosted on github.com, the Git URLs (`git_url` and `_links["git"]`) and the
   * github.com URLs (`html_url` and `_links["html"]`) will have null values.
   */
  @Path("/{owner}/{repo}/contents/{path}")
  @GET
  @Produces({"application/json", "application/vnd.github.v3.object"})
  Response repos_get_content(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("path") String path, @QueryParam("ref") String ref);

  /**
   * Creates a new file or replaces an existing file in a repository.
   */
  @Path("/{owner}/{repo}/contents/{path}")
  @PUT
  @Produces("application/json")
  @Consumes("application/json")
  Response repos_create_or_update_file_contents(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("path") String path, InputStream data);

  /**
   * Deletes a file in a repository.
   *
   * You can provide an additional `committer` parameter, which is an object containing information about the committer. Or, you can provide an `author` parameter, which is an object containing information about the author.
   *
   * The `author` section is optional and is filled in with the `committer` information if omitted. If the `committer` information is omitted, the authenticated user's information is used.
   *
   * You must provide values for both `name` and `email`, whether you choose to use `author` or `committer`. Otherwise, you'll receive a `422` status code.
   */
  @Path("/{owner}/{repo}/contents/{path}")
  @DELETE
  @Produces("application/json")
  @Consumes("application/json")
  Response repos_delete_file(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("path") String path, InputStream data);

  /**
   *
   */
  @Path("/{owner}/{repo}/topics")
  @GET
  @Produces("application/json")
  Response repos_get_all_topics(@PathParam("owner") String owner, @PathParam("repo") String repo);

  /**
   *
   */
  @Path("/{owner}/{repo}/topics")
  @PUT
  @Produces("application/json")
  @Consumes("application/json")
  Response repos_replace_all_topics(@PathParam("owner") String owner,
      @PathParam("repo") String repo, InputStream data);

  /**
   * Shows whether dependency alerts are enabled or disabled for a repository. The authenticated user must have admin access to the repository. For more information, see "[About security alerts for vulnerable dependencies](https://help.github.com/en/articles/about-security-alerts-for-vulnerable-dependencies)".
   */
  @Path("/{owner}/{repo}/vulnerability-alerts")
  @GET
  void repos_check_vulnerability_alerts(@PathParam("owner") String owner,
      @PathParam("repo") String repo);

  /**
   * Enables dependency alerts and the dependency graph for a repository. The authenticated user must have admin access to the repository. For more information, see "[About security alerts for vulnerable dependencies](https://help.github.com/en/articles/about-security-alerts-for-vulnerable-dependencies)".
   */
  @Path("/{owner}/{repo}/vulnerability-alerts")
  @PUT
  void repos_enable_vulnerability_alerts(@PathParam("owner") String owner,
      @PathParam("repo") String repo);

  /**
   * Disables dependency alerts and the dependency graph for a repository. The authenticated user must have admin access to the repository. For more information, see "[About security alerts for vulnerable dependencies](https://help.github.com/en/articles/about-security-alerts-for-vulnerable-dependencies)".
   */
  @Path("/{owner}/{repo}/vulnerability-alerts")
  @DELETE
  void repos_disable_vulnerability_alerts(@PathParam("owner") String owner,
      @PathParam("repo") String repo);

  /**
   * Simple filtering of deployments is available via query parameters:
   */
  @Path("/{owner}/{repo}/deployments")
  @GET
  @Produces("application/json")
  Response repos_list_deployments(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @QueryParam("sha") String sha, @QueryParam("ref") String ref, @QueryParam("task") String task,
      @QueryParam("environment") String environment, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Deployments offer a few configurable parameters with certain defaults.
   *
   * The `ref` parameter can be any named branch, tag, or SHA. At GitHub we often deploy branches and verify them
   * before we merge a pull request.
   *
   * The `environment` parameter allows deployments to be issued to different runtime environments. Teams often have
   * multiple environments for verifying their applications, such as `production`, `staging`, and `qa`. This parameter
   * makes it easier to track which environments have requested deployments. The default environment is `production`.
   *
   * The `auto_merge` parameter is used to ensure that the requested ref is not behind the repository's default branch. If
   * the ref _is_ behind the default branch for the repository, we will attempt to merge it for you. If the merge succeeds,
   * the API will return a successful merge commit. If merge conflicts prevent the merge from succeeding, the API will
   * return a failure response.
   *
   * By default, [commit statuses](https://developer.github.com/v3/repos/statuses) for every submitted context must be in a `success`
   * state. The `required_contexts` parameter allows you to specify a subset of contexts that must be `success`, or to
   * specify contexts that have not yet been submitted. You are not required to use commit statuses to deploy. If you do
   * not require any contexts or create any commit statuses, the deployment will always succeed.
   *
   * The `payload` parameter is available for any extra information that a deployment system might need. It is a JSON text
   * field that will be passed on when a deployment event is dispatched.
   *
   * The `task` parameter is used by the deployment system to allow different execution paths. In the web world this might
   * be `deploy:migrations` to run schema changes on the system. In the compiled world this could be a flag to compile an
   * application with debugging enabled.
   *
   * Users with `repo` or `repo_deployment` scopes can create a deployment for a given ref.
   *
   * #### Merged branch response
   * You will see this response when GitHub automatically merges the base branch into the topic branch instead of creating
   * a deployment. This auto-merge happens when:
   * *   Auto-merge option is enabled in the repository
   * *   Topic branch does not include the latest changes on the base branch, which is `master` in the response example
   * *   There are no merge conflicts
   *
   * If there are no new commits in the base branch, a new request to create a deployment should give a successful
   * response.
   *
   * #### Merge conflict response
   * This error happens when the `auto_merge` option is enabled and when the default branch (in this case `master`), can't
   * be merged into the branch that's being deployed (in this case `topic-branch`), due to merge conflicts.
   *
   * #### Failed commit status checks
   * This error happens when the `required_contexts` parameter indicates that one or more contexts need to have a `success`
   * status for the commit to be deployed, but one or more of the required contexts do not have a state of `success`.
   */
  @Path("/{owner}/{repo}/deployments")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response repos_create_deployment(@PathParam("owner") String owner, @PathParam("repo") String repo,
      InputStream data);

  /**
   * This endpoint will return all community profile metrics, including an overall health score, repository description, the presence of documentation, detected code of conduct, detected license, and the presence of ISSUE\_TEMPLATE, PULL\_REQUEST\_TEMPLATE, README, and CONTRIBUTING files.
   */
  @Path("/{owner}/{repo}/community/profile")
  @GET
  @Produces("application/json")
  Response repos_get_community_profile_metrics(@PathParam("owner") String owner,
      @PathParam("repo") String repo);

  /**
   *
   */
  @Path("/{owner}/{repo}/pages")
  @GET
  @Produces("application/json")
  Response repos_get_pages(@PathParam("owner") String owner, @PathParam("repo") String repo);

  /**
   *
   */
  @Path("/{owner}/{repo}/pages")
  @PUT
  @Consumes("application/json")
  void repos_update_information_about_pages_site(@PathParam("owner") String owner,
      @PathParam("repo") String repo, InputStream data);

  /**
   *
   */
  @Path("/{owner}/{repo}/pages")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response repos_create_pages_site(@PathParam("owner") String owner, @PathParam("repo") String repo,
      InputStream data);

  /**
   *
   */
  @Path("/{owner}/{repo}/pages")
  @DELETE
  void repos_delete_pages_site(@PathParam("owner") String owner, @PathParam("repo") String repo);

  /**
   * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   */
  @Path("/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews")
  @GET
  @Produces("application/vnd.github.luke-cage-preview+json")
  Response repos_get_pull_request_review_protection(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("branch") String branch);

  /**
   * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   */
  @Path("/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews")
  @DELETE
  void repos_delete_pull_request_review_protection(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("branch") String branch);

  /**
   * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   *
   * Updating pull request review enforcement requires admin or owner permissions to the repository and branch protection to be enabled.
   *
   * **Note**: Passing new arrays of `users` and `teams` replaces their previous values.
   */
  @Path("/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews")
  @PATCH
  @Produces("application/json")
  @Consumes("application/json")
  Response repos_update_pull_request_review_protection(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("branch") String branch, InputStream data);

  /**
   * Get the top 10 referrers over the last 14 days.
   */
  @Path("/{owner}/{repo}/traffic/popular/referrers")
  @GET
  @Produces("application/json")
  Response repos_get_top_referrers(@PathParam("owner") String owner,
      @PathParam("repo") String repo);

  /**
   * Users with pull access in a repository can view commit statuses for a given ref. The ref can be a SHA, a branch name, or a tag name. Statuses are returned in reverse chronological order. The first status in the list will be the latest one.
   *
   * This resource is also available via a legacy route: `GET /repos/:owner/:repo/statuses/:ref`.
   */
  @Path("/{owner}/{repo}/commits/{ref}/statuses")
  @GET
  @Produces("application/json")
  Response repos_list_commit_statuses_for_ref(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("ref") String ref,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * Both `:base` and `:head` must be branch names in `:repo`. To compare branches across other repositories in the same network as `:repo`, use the format `<USERNAME>:branch`.
   *
   * The response from the API is equivalent to running the `git log base..head` command; however, commits are returned in chronological order. Pass the appropriate [media type](https://developer.github.com/v3/media/#commits-commit-comparison-and-pull-requests) to fetch diff and patch formats.
   *
   * The response also includes details on the files that were changed between the two commits. This includes the status of the change (for example, if a file was added, removed, modified, or renamed), and details of the change itself. For example, files with a `renamed` status have a `previous_filename` field showing the previous filename of the file, and files with a `modified` status have a `patch` field showing the changes made to the file.
   *
   * **Working with large comparisons**
   *
   * The response will include a comparison of up to 250 commits. If you are working with a larger commit range, you can use the [List commits](https://developer.github.com/v3/repos/commits/#list-commits) to enumerate all commits in the range.
   *
   * For comparisons with extremely large diffs, you may receive an error response indicating that the diff took too long to generate. You can typically resolve this error by using a smaller commit range.
   *
   * **Signature verification object**
   *
   * The response will include a `verification` object that describes the result of verifying the commit's signature. The following fields are included in the `verification` object:
   *
   * These are the possible values for `reason` in the `verification` object:
   *
   * | Value                    | Description                                                                                                                       |
   * | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
   * | `expired_key`            | The key that made the signature is expired.                                                                                       |
   * | `not_signing_key`        | The "signing" flag is not among the usage flags in the GPG key that made the signature.                                           |
   * | `gpgverify_error`        | There was an error communicating with the signature verification service.                                                         |
   * | `gpgverify_unavailable`  | The signature verification service is currently unavailable.                                                                      |
   * | `unsigned`               | The object does not include a signature.                                                                                          |
   * | `unknown_signature_type` | A non-PGP signature was found in the commit.                                                                                      |
   * | `no_user`                | No user was associated with the `committer` email address in the commit.                                                          |
   * | `unverified_email`       | The `committer` email address in the commit was associated with a user, but the email address is not verified on her/his account. |
   * | `bad_email`              | The `committer` email address in the commit is not included in the identities of the PGP key that made the signature.             |
   * | `unknown_key`            | The key that made the signature has not been registered with any user's account.                                                  |
   * | `malformed_signature`    | There was an error parsing the signature.                                                                                         |
   * | `invalid`                | The signature could not be cryptographically verified using the key whose key-id was found in the signature.                      |
   * | `valid`                  | None of the above errors applied, so the signature is considered to be verified.                                                  |
   */
  @Path("/{owner}/{repo}/compare/{base}...{head}")
  @GET
  @Produces("application/json")
  Response repos_compare_commits(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("base") String base, @PathParam("head") String head);

  /**
   * Lists all pull requests containing the provided commit SHA, which can be from any point in the commit history. The results will include open and closed pull requests. Additional preview headers may be required to see certain details for associated pull requests, such as whether a pull request is in a draft state. For more information about previews that might affect this endpoint, see the [List pull requests](https://developer.github.com/v3/pulls/#list-pull-requests) endpoint.
   */
  @Path("/{owner}/{repo}/commits/{commit_sha}/pulls")
  @GET
  @Produces("application/json")
  Response repos_list_pull_requests_associated_with_commit(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("commit_sha") String commitSha,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   */
  @Path("/{owner}/{repo}/branches/{branch}/protection/enforce_admins")
  @GET
  @Produces("application/json")
  Response repos_get_admin_branch_protection(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("branch") String branch);

  /**
   * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   *
   * Adding admin enforcement requires admin or owner permissions to the repository and branch protection to be enabled.
   */
  @Path("/{owner}/{repo}/branches/{branch}/protection/enforce_admins")
  @POST
  @Produces("application/json")
  Response repos_set_admin_branch_protection(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("branch") String branch);

  /**
   * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   *
   * Removing admin enforcement requires admin or owner permissions to the repository and branch protection to be enabled.
   */
  @Path("/{owner}/{repo}/branches/{branch}/protection/enforce_admins")
  @DELETE
  void repos_delete_admin_branch_protection(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("branch") String branch);

  /**
   * Users with pull access can view a deployment status for a deployment:
   */
  @Path("/{owner}/{repo}/deployments/{deployment_id}/statuses/{status_id}")
  @GET
  @Produces("application/json")
  Response repos_get_deployment_status(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("deployment_id") Integer deploymentId,
      @PathParam("status_id") Integer statusId);

  /**
   * Enables automated security fixes for a repository. The authenticated user must have admin access to the repository. For more information, see "[Configuring automated security fixes](https://help.github.com/en/articles/configuring-automated-security-fixes)".
   */
  @Path("/{owner}/{repo}/automated-security-fixes")
  @PUT
  void repos_enable_automated_security_fixes(@PathParam("owner") String owner,
      @PathParam("repo") String repo);

  /**
   * Disables automated security fixes for a repository. The authenticated user must have admin access to the repository. For more information, see "[Configuring automated security fixes](https://help.github.com/en/articles/configuring-automated-security-fixes)".
   */
  @Path("/{owner}/{repo}/automated-security-fixes")
  @DELETE
  void repos_disable_automated_security_fixes(@PathParam("owner") String owner,
      @PathParam("repo") String repo);

  /**
   * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   *
   * When authenticated with admin or owner permissions to the repository, you can use this endpoint to check whether a branch requires signed commits. An enabled status of `true` indicates you must sign commits on this branch. For more information, see [Signing commits with GPG](https://help.github.com/articles/signing-commits-with-gpg) in GitHub Help.
   *
   * **Note**: You must enable branch protection to require signed commits.
   */
  @Path("/{owner}/{repo}/branches/{branch}/protection/required_signatures")
  @GET
  @Produces("application/json")
  Response repos_get_commit_signature_protection(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("branch") String branch);

  /**
   * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   *
   * When authenticated with admin or owner permissions to the repository, you can use this endpoint to require signed commits on a branch. You must enable branch protection to require signed commits.
   */
  @Path("/{owner}/{repo}/branches/{branch}/protection/required_signatures")
  @POST
  @Produces("application/json")
  Response repos_create_commit_signature_protection(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("branch") String branch);

  /**
   * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   *
   * When authenticated with admin or owner permissions to the repository, you can use this endpoint to disable required signed commits on a branch. You must enable branch protection to require signed commits.
   */
  @Path("/{owner}/{repo}/branches/{branch}/protection/required_signatures")
  @DELETE
  void repos_delete_commit_signature_protection(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("branch") String branch);

  /**
   * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   *
   * Lists the people who have push access to this branch.
   */
  @Path("/{owner}/{repo}/branches/{branch}/protection/restrictions/users")
  @GET
  @Produces("application/json")
  Response repos_get_users_with_access_to_protected_branch(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("branch") String branch);

  /**
   * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   *
   * Replaces the list of people that have push access to this branch. This removes all people that previously had push access and grants push access to the new list of people.
   *
   * | Type    | Description                                                                                                                   |
   * | ------- | ----------------------------------------------------------------------------------------------------------------------------- |
   * | `array` | Usernames for people who can have push access. **Note**: The list of users, apps, and teams in total is limited to 100 items. |
   */
  @Path("/{owner}/{repo}/branches/{branch}/protection/restrictions/users")
  @PUT
  @Produces("application/json")
  @Consumes("application/json")
  Response repos_set_user_access_restrictions(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("branch") String branch, List<String> data);

  /**
   * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   *
   * Grants the specified people push access for this branch.
   *
   * | Type    | Description                                                                                                                   |
   * | ------- | ----------------------------------------------------------------------------------------------------------------------------- |
   * | `array` | Usernames for people who can have push access. **Note**: The list of users, apps, and teams in total is limited to 100 items. |
   */
  @Path("/{owner}/{repo}/branches/{branch}/protection/restrictions/users")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response repos_add_user_access_restrictions(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("branch") String branch, List<String> data);

  /**
   * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   *
   * Removes the ability of a user to push to this branch.
   *
   * | Type    | Description                                                                                                                                   |
   * | ------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
   * | `array` | Usernames of the people who should no longer have push access. **Note**: The list of users, apps, and teams in total is limited to 100 items. |
   */
  @Path("/{owner}/{repo}/branches/{branch}/protection/restrictions/users")
  @DELETE
  @Produces("application/json")
  @Consumes("application/json")
  Response repos_remove_user_access_restrictions(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("branch") String branch, List<String> data);

  /**
   *
   */
  @Path("/{owner}/{repo}/branches")
  @GET
  @Produces("application/json")
  Response repos_list_branches(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @QueryParam("protected") Boolean _protected, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   *
   */
  @Path("/{owner}/{repo}/branches/{branch}")
  @GET
  @Produces("application/json")
  Response repos_get_branch(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("branch") String branch);

  /**
   *
   */
  @Path("/{owner}/{repo}/keys")
  @GET
  @Produces("application/json")
  Response repos_list_deploy_keys(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * You can create a read-only deploy key.
   */
  @Path("/{owner}/{repo}/keys")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response repos_create_deploy_key(@PathParam("owner") String owner, @PathParam("repo") String repo,
      InputStream data);

  /**
   *
   */
  @Path("/{owner}/{repo}/pages/builds/{build_id}")
  @GET
  @Produces("application/json")
  Response repos_get_pages_build(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("build_id") Integer buildId);

  /**
   * Get the total number of clones and breakdown per day or week for the last 14 days. Timestamps are aligned to UTC midnight of the beginning of the day or week. Week begins on Monday.
   */
  @Path("/{owner}/{repo}/traffic/clones")
  @GET
  @Produces("application/json")
  Response repos_get_clones(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @QueryParam("per") String per);

  /**
   *
   */
  @Path("/{owner}/{repo}/hooks/{hook_id}")
  @GET
  @Produces("application/json")
  Response repos_get_webhook(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("hook_id") Integer hookId);

  /**
   *
   */
  @Path("/{owner}/{repo}/hooks/{hook_id}")
  @DELETE
  void repos_delete_webhook(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("hook_id") Integer hookId);

  /**
   *
   */
  @Path("/{owner}/{repo}/hooks/{hook_id}")
  @PATCH
  @Produces("application/json")
  @Consumes("application/json")
  Response repos_update_webhook(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("hook_id") Integer hookId, InputStream data);

  /**
   * This returns a list of releases, which does not include regular Git tags that have not been associated with a release. To get a list of Git tags, use the [Repository Tags API](https://developer.github.com/v3/repos/#list-repository-tags).
   *
   * Information about published releases are available to everyone. Only users with push access will receive listings for draft releases.
   */
  @Path("/{owner}/{repo}/releases")
  @GET
  @Produces("application/json")
  Response repos_list_releases(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * Users with push access to the repository can create a release.
   *
   * This endpoint triggers [notifications](https://help.github.com/articles/about-notifications/). Creating content too quickly using this endpoint may result in abuse rate limiting. See "[Abuse rate limits](https://developer.github.com/v3/#abuse-rate-limits)" and "[Dealing with abuse rate limits](https://developer.github.com/v3/guides/best-practices-for-integrators/#dealing-with-abuse-rate-limits)" for details.
   */
  @Path("/{owner}/{repo}/releases")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response repos_create_release(@PathParam("owner") String owner, @PathParam("repo") String repo,
      InputStream data);

  /**
   * Creates a new repository using a repository template. Use the `template_owner` and `template_repo` route parameters to specify the repository to use as the template. The authenticated user must own or be a member of an organization that owns the repository. To check if a repository is available to use as a template, get the repository's information using the [Get a repository](https://developer.github.com/v3/repos/#get-a-repository) endpoint and check that the `is_template` key is `true`.
   *
   * **OAuth scope requirements**
   *
   * When using [OAuth](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/), authorizations must include:
   *
   * *   `public_repo` scope or `repo` scope to create a public repository
   * *   `repo` scope to create a private repository
   */
  @Path("/{template_owner}/{template_repo}/generate")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response repos_create_using_template(@PathParam("template_owner") String templateOwner,
      @PathParam("template_repo") String templateRepo, InputStream data);

  /**
   * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   */
  @Path("/{owner}/{repo}/branches/{branch}/protection/required_status_checks")
  @GET
  @Produces("application/json")
  Response repos_get_status_checks_protection(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("branch") String branch);

  /**
   * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   */
  @Path("/{owner}/{repo}/branches/{branch}/protection/required_status_checks")
  @DELETE
  void repos_remove_status_check_protection(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("branch") String branch);

  /**
   * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   *
   * Updating required status checks requires admin or owner permissions to the repository and branch protection to be enabled.
   */
  @Path("/{owner}/{repo}/branches/{branch}/protection/required_status_checks")
  @PATCH
  @Produces("application/json")
  @Consumes("application/json")
  Response repos_update_status_check_protection(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("branch") String branch, InputStream data);

  /**
   * When you pass the `scarlet-witch-preview` media type, requests to get a repository will also return the repository's code of conduct if it can be detected from the repository's code of conduct file.
   *
   * The `parent` and `source` objects are present when the repository is a fork. `parent` is the repository this repository was forked from, `source` is the ultimate source for the network.
   */
  @Path("/{owner}/{repo}")
  @GET
  @Produces("application/json")
  Response repos_get(@PathParam("owner") String owner, @PathParam("repo") String repo);

  /**
   * Deleting a repository requires admin access. If OAuth is used, the `delete_repo` scope is required.
   *
   * If an organization owner has configured the organization to prevent members from deleting organization-owned
   * repositories, you will get a `403 Forbidden` response.
   */
  @Path("/{owner}/{repo}")
  @DELETE
  void repos_delete(@PathParam("owner") String owner, @PathParam("repo") String repo);

  /**
   * **Note**: To edit a repository's topics, use the [Replace all repository topics](https://developer.github.com/v3/repos/#replace-all-repository-topics) endpoint.
   */
  @Path("/{owner}/{repo}")
  @PATCH
  @Produces("application/json")
  @Consumes("application/json")
  Response repos_update(@PathParam("owner") String owner, @PathParam("repo") String repo,
      InputStream data);

  /**
   * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   *
   * Lists who has access to this protected branch.
   *
   * **Note**: Users, apps, and teams `restrictions` are only available for organization-owned repositories.
   */
  @Path("/{owner}/{repo}/branches/{branch}/protection/restrictions")
  @GET
  @Produces("application/json")
  Response repos_get_access_restrictions(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("branch") String branch);

  /**
   * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   *
   * Disables the ability to restrict who can push to this branch.
   */
  @Path("/{owner}/{repo}/branches/{branch}/protection/restrictions")
  @DELETE
  void repos_delete_access_restrictions(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("branch") String branch);

  /**
   *
   */
  @Path("/{owner}/{repo}/keys/{key_id}")
  @GET
  @Produces("application/json")
  Response repos_get_deploy_key(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("key_id") Integer keyId);

  /**
   * Deploy keys are immutable. If you need to update a key, remove the key and create a new one instead.
   */
  @Path("/{owner}/{repo}/keys/{key_id}")
  @DELETE
  void repos_delete_deploy_key(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("key_id") Integer keyId);

  /**
   * **Note:** This returns an `upload_url` key corresponding to the endpoint for uploading release assets. This key is a [hypermedia resource](https://developer.github.com/v3/#hypermedia).
   */
  @Path("/{owner}/{repo}/releases/{release_id}")
  @GET
  @Produces("application/json")
  Response repos_get_release(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("release_id") Integer releaseId);

  /**
   * Users with push access to the repository can delete a release.
   */
  @Path("/{owner}/{repo}/releases/{release_id}")
  @DELETE
  void repos_delete_release(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("release_id") Integer releaseId);

  /**
   * Users with push access to the repository can edit a release.
   */
  @Path("/{owner}/{repo}/releases/{release_id}")
  @PATCH
  @Produces("application/json")
  @Consumes("application/json")
  Response repos_update_release(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("release_id") Integer releaseId, InputStream data);

  /**
   * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   */
  @Path("/{owner}/{repo}/branches/{branch}/protection")
  @GET
  @Produces("application/json")
  Response repos_get_branch_protection(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("branch") String branch);

  /**
   * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   *
   * Protecting a branch requires admin or owner permissions to the repository.
   *
   * **Note**: Passing new arrays of `users` and `teams` replaces their previous values.
   *
   * **Note**: The list of users, apps, and teams in total is limited to 100 items.
   */
  @Path("/{owner}/{repo}/branches/{branch}/protection")
  @PUT
  @Produces("application/json")
  @Consumes("application/json")
  Response repos_update_branch_protection(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("branch") String branch, InputStream data);

  /**
   * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   */
  @Path("/{owner}/{repo}/branches/{branch}/protection")
  @DELETE
  void repos_delete_branch_protection(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("branch") String branch);

  /**
   * When authenticating as a user with admin rights to a repository, this endpoint will list all currently open repository invitations.
   */
  @Path("/{owner}/{repo}/invitations")
  @GET
  @Produces("application/json")
  Response repos_list_invitations(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * This will trigger a [ping event](https://developer.github.com/webhooks/#ping-event) to be sent to the hook.
   */
  @Path("/{owner}/{repo}/hooks/{hook_id}/pings")
  @POST
  void repos_ping_webhook(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("hook_id") Integer hookId);

  /**
   *
   */
  @Path("/{owner}/{repo}/tags")
  @GET
  @Produces("application/json")
  Response repos_list_tags(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   *
   */
  @Path("/{owner}/{repo}/teams")
  @GET
  @Produces("application/json")
  Response repos_list_teams(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * Returns the last year of commit activity grouped by week. The `days` array is a group of commits per day, starting on `Sunday`.
   */
  @Path("/{owner}/{repo}/stats/commit_activity")
  @GET
  @Produces("application/json")
  Response repos_get_commit_activity_stats(@PathParam("owner") String owner,
      @PathParam("repo") String repo);

  /**
   * Lists languages for the specified repository. The value shown for each language is the number of bytes of code written in that language.
   */
  @Path("/{owner}/{repo}/languages")
  @GET
  @Produces("application/json")
  Response repos_list_languages(@PathParam("owner") String owner, @PathParam("repo") String repo);

  /**
   * You can use this endpoint to trigger a webhook event called `repository_dispatch` when you want activity that happens outside of GitHub to trigger a GitHub Actions workflow or GitHub App webhook. You must configure your GitHub Actions workflow or GitHub App to run when the `repository_dispatch` event occurs. For an example `repository_dispatch` webhook payload, see "[RepositoryDispatchEvent](https://developer.github.com/webhooks/event-payloads/#repository_dispatch)."
   *
   * The `client_payload` parameter is available for any extra information that your workflow might need. This parameter is a JSON payload that will be passed on when the webhook event is dispatched. For example, the `client_payload` can include a message that a user would like to send using a GitHub Actions workflow. Or the `client_payload` can be used as a test to debug your workflow. For a test example, see the [input example](https://developer.github.com/v3/repos/#example-4).
   *
   * To give you write access to the repository, you must use a personal access token with the `repo` scope. For more information, see "[Creating a personal access token for the command line](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line)" in the GitHub Help documentation.
   *
   * This input example shows how you can use the `client_payload` as a test to debug your workflow.
   */
  @Path("/{owner}/{repo}/dispatches")
  @POST
  @Consumes("application/json")
  void repos_create_dispatch_event(@PathParam("owner") String owner, @PathParam("repo") String repo,
      InputStream data);

  /**
   * Each array contains the day number, hour number, and number of commits:
   *
   * *   `0-6`: Sunday - Saturday
   * *   `0-23`: Hour of day
   * *   Number of commits
   *
   * For example, `[2, 14, 25]` indicates that there were 25 total commits, during the 2:00pm hour on Tuesdays. All times are based on the time zone of individual commits.
   */
  @Path("/{owner}/{repo}/stats/punch_card")
  @GET
  @Produces("application/json")
  List<Integer> repos_get_punch_card_stats(@PathParam("owner") String owner,
      @PathParam("repo") String repo);

  /**
   * A transfer request will need to be accepted by the new owner when transferring a personal repository to another user. The response will contain the original `owner`, and the transfer will continue asynchronously. For more details on the requirements to transfer personal and organization-owned repositories, see [about repository transfers](https://help.github.com/articles/about-repository-transfers/).
   */
  @Path("/{owner}/{repo}/transfer")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response repos_transfer(@PathParam("owner") String owner, @PathParam("repo") String repo,
      InputStream data);

  /**
   *
   */
  @Path("/{owner}/{repo}/pages/builds")
  @GET
  @Produces("application/json")
  Response repos_list_pages_builds(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * You can request that your site be built from the latest revision on the default branch. This has the same effect as pushing a commit to your default branch, but does not require an additional commit. Manually triggering page builds can be helpful when diagnosing build warnings and failures.
   *
   * Build requests are limited to one concurrent build per repository and one concurrent build per requester. If you request a build while another is still in progress, the second request will be queued until the first completes.
   */
  @Path("/{owner}/{repo}/pages/builds")
  @POST
  @Produces("application/json")
  Response repos_request_pages_build(@PathParam("owner") String owner,
      @PathParam("repo") String repo);

  /**
   * For organization-owned repositories, the list of collaborators includes outside collaborators, organization members that are direct collaborators, organization members with access through team memberships, organization members with access through default organization permissions, and organization owners.
   *
   * Team members will include the members of child teams.
   */
  @Path("/{owner}/{repo}/collaborators/{username}")
  @GET
  void repos_check_collaborator(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("username") String username);

  /**
   * This endpoint triggers [notifications](https://help.github.com/articles/about-notifications/). Creating content too quickly using this endpoint may result in abuse rate limiting. See "[Abuse rate limits](https://developer.github.com/v3/#abuse-rate-limits)" and "[Dealing with abuse rate limits](https://developer.github.com/v3/guides/best-practices-for-integrators/#dealing-with-abuse-rate-limits)" for details.
   *
   * For more information the permission levels, see "[Repository permission levels for an organization](https://help.github.com/en/github/setting-up-and-managing-organizations-and-teams/repository-permission-levels-for-an-organization#permission-levels-for-repositories-owned-by-an-organization)".
   *
   * Note that, if you choose not to pass any parameters, you'll need to set `Content-Length` to zero when calling out to this endpoint. For more information, see "[HTTP verbs](https://developer.github.com/v3/#http-verbs)."
   *
   * The invitee will receive a notification that they have been invited to the repository, which they must accept or decline. They may do this via the notifications page, the email they receive, or by using the [repository invitations API endpoints](https://developer.github.com/v3/repos/invitations/).
   *
   * **Rate limits**
   *
   * To prevent abuse, you are limited to sending 50 invitations to a repository per 24 hour period. Note there is no limit if you are inviting organization members to an organization repository.
   */
  @Path("/{owner}/{repo}/collaborators/{username}")
  @PUT
  @Produces("application/json")
  @Consumes("application/json")
  Response repos_add_collaborator(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("username") String username, InputStream data);

  /**
   *
   */
  @Path("/{owner}/{repo}/collaborators/{username}")
  @DELETE
  void repos_remove_collaborator(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("username") String username);

  /**
   *
   */
  @Path("/{owner}/{repo}/forks")
  @GET
  @Produces("application/json")
  Response repos_list_forks(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @QueryParam("sort") String sort, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Create a fork for the authenticated user.
   *
   * **Note**: Forking a Repository happens asynchronously. You may have to wait a short period of time before you can access the git objects. If this takes longer than 5 minutes, be sure to contact [GitHub Support](https://github.com/contact) or [GitHub Premium Support](https://premium.githubsupport.com).
   */
  @Path("/{owner}/{repo}/forks")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response repos_create_fork(@PathParam("owner") String owner, @PathParam("repo") String repo,
      InputStream data);

  /**
   * Get the total number of views and breakdown per day or week for the last 14 days. Timestamps are aligned to UTC midnight of the beginning of the day or week. Week begins on Monday.
   */
  @Path("/{owner}/{repo}/traffic/views")
  @GET
  @Produces("application/json")
  Response repos_get_views(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @QueryParam("per") String per);

  /**
   *
   */
  @Path("/{owner}/{repo}/releases/{release_id}/assets")
  @GET
  @Produces("application/json")
  Response repos_list_release_assets(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("release_id") Integer releaseId,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * This endpoint makes use of [a Hypermedia relation](https://developer.github.com/v3/#hypermedia) to determine which URL to access. The endpoint you call to upload release assets is specific to your release. Use the `upload_url` returned in
   * the response of the [Create a release endpoint](https://developer.github.com/v3/repos/releases/#create-a-release) to upload a release asset.
   *
   * You need to use an HTTP client which supports [SNI](http://en.wikipedia.org/wiki/Server_Name_Indication) to make calls to this endpoint.
   *
   * Most libraries will set the required `Content-Length` header automatically. Use the required `Content-Type` header to provide the media type of the asset. For a list of media types, see [Media Types](https://www.iana.org/assignments/media-types/media-types.xhtml). For example: 
   *
   * `application/zip`
   *
   * GitHub expects the asset data in its raw binary form, rather than JSON. You will send the raw binary content of the asset as the request body. Everything else about the endpoint is the same as the rest of the API. For example,
   * you'll still need to pass your authentication to be able to upload an asset.
   *
   * When an upstream failure occurs, you will receive a `502 Bad Gateway` status. This may leave an empty asset with a state of `starter`. It can be safely deleted.
   *
   * **Notes:**
   * *   GitHub renames asset filenames that have special characters, non-alphanumeric characters, and leading or trailing periods. The "[List assets for a release](https://developer.github.com/v3/repos/releases/#list-assets-for-a-release)"
   * endpoint lists the renamed filenames. For more information and help, contact [GitHub Support](https://github.com/contact).
   * *   If you upload an asset with the same filename as another uploaded asset, you'll receive an error and must delete the old file before you can re-upload the new asset.
   */
  @Path("/{owner}/{repo}/releases/{release_id}/assets")
  @POST
  @Produces("application/json")
  @Consumes("*/*")
  Response repos_upload_release_asset(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("release_id") Integer releaseId,
      @QueryParam("name") String name, @QueryParam("label") String label, String data);

  /**
   *
   */
  @Path("/{owner}/{repo}/comments/{comment_id}")
  @GET
  @Produces("application/json")
  Response repos_get_commit_comment(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("comment_id") Integer commentId);

  /**
   *
   */
  @Path("/{owner}/{repo}/comments/{comment_id}")
  @DELETE
  void repos_delete_commit_comment(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("comment_id") Integer commentId);

  /**
   *
   */
  @Path("/{owner}/{repo}/comments/{comment_id}")
  @PATCH
  @Produces("application/json")
  @Consumes("application/json")
  Response repos_update_commit_comment(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("comment_id") Integer commentId, InputStream data);

  /**
   * This will trigger the hook with the latest push to the current repository if the hook is subscribed to `push` events. If the hook is not subscribed to `push` events, the server will respond with 204 but no test POST will be generated.
   *
   * **Note**: Previously `/repos/:owner/:repo/hooks/:hook_id/test`
   */
  @Path("/{owner}/{repo}/hooks/{hook_id}/tests")
  @POST
  void repos_test_push_webhook(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("hook_id") Integer hookId);

  /**
   *
   */
  @Path("/{owner}/{repo}/hooks")
  @GET
  @Produces("application/json")
  Response repos_list_webhooks(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * Repositories can have multiple webhooks installed. Each webhook should have a unique `config`. Multiple webhooks can
   * share the same `config` as long as those webhooks do not have any `events` that overlap.
   */
  @Path("/{owner}/{repo}/hooks")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response repos_create_webhook(@PathParam("owner") String owner, @PathParam("repo") String repo,
      InputStream data);

  /**
   *
   */
  @Path("/{owner}/{repo}/pages/builds/latest")
  @GET
  @Produces("application/json")
  Response repos_get_latest_pages_build(@PathParam("owner") String owner,
      @PathParam("repo") String repo);

  /**
   * Use the `:commit_sha` to specify the commit that will have its comments listed.
   */
  @Path("/{owner}/{repo}/commits/{commit_sha}/comments")
  @GET
  @Produces("application/json")
  Response repos_list_comments_for_commit(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("commit_sha") String commitSha,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * Create a comment for a commit using its `:commit_sha`.
   *
   * This endpoint triggers [notifications](https://help.github.com/articles/about-notifications/). Creating content too quickly using this endpoint may result in abuse rate limiting. See "[Abuse rate limits](https://developer.github.com/v3/#abuse-rate-limits)" and "[Dealing with abuse rate limits](https://developer.github.com/v3/guides/best-practices-for-integrators/#dealing-with-abuse-rate-limits)" for details.
   */
  @Path("/{owner}/{repo}/commits/{commit_sha}/comments")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response repos_create_commit_comment(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("commit_sha") String commitSha, InputStream data);

  /**
   * Returns the total commit counts for the `owner` and total commit counts in `all`. `all` is everyone combined, including the `owner` in the last 52 weeks. If you'd like to get the commit counts for non-owners, you can subtract `owner` from `all`.
   *
   * The array order is oldest week (index 0) to most recent week.
   */
  @Path("/{owner}/{repo}/stats/participation")
  @GET
  @Produces("application/json")
  Response repos_get_participation_stats(@PathParam("owner") String owner,
      @PathParam("repo") String repo);

  /**
   * **Signature verification object**
   *
   * The response will include a `verification` object that describes the result of verifying the commit's signature. The following fields are included in the `verification` object:
   *
   * These are the possible values for `reason` in the `verification` object:
   *
   * | Value                    | Description                                                                                                                       |
   * | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
   * | `expired_key`            | The key that made the signature is expired.                                                                                       |
   * | `not_signing_key`        | The "signing" flag is not among the usage flags in the GPG key that made the signature.                                           |
   * | `gpgverify_error`        | There was an error communicating with the signature verification service.                                                         |
   * | `gpgverify_unavailable`  | The signature verification service is currently unavailable.                                                                      |
   * | `unsigned`               | The object does not include a signature.                                                                                          |
   * | `unknown_signature_type` | A non-PGP signature was found in the commit.                                                                                      |
   * | `no_user`                | No user was associated with the `committer` email address in the commit.                                                          |
   * | `unverified_email`       | The `committer` email address in the commit was associated with a user, but the email address is not verified on her/his account. |
   * | `bad_email`              | The `committer` email address in the commit is not included in the identities of the PGP key that made the signature.             |
   * | `unknown_key`            | The key that made the signature has not been registered with any user's account.                                                  |
   * | `malformed_signature`    | There was an error parsing the signature.                                                                                         |
   * | `invalid`                | The signature could not be cryptographically verified using the key whose key-id was found in the signature.                      |
   * | `valid`                  | None of the above errors applied, so the signature is considered to be verified.                                                  |
   */
  @Path("/{owner}/{repo}/commits")
  @GET
  @Produces("application/json")
  Response repos_list_commits(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @QueryParam("sha") String sha, @QueryParam("path") String path,
      @QueryParam("author") String author, @QueryParam("since") String since,
      @QueryParam("until") String until, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   *
   * Lists the GitHub Apps that have push access to this branch. Only installed GitHub Apps with `write` access to the `contents` permission can be added as authorized actors on a protected branch.
   */
  @Path("/{owner}/{repo}/branches/{branch}/protection/restrictions/apps")
  @GET
  @Produces("application/json")
  Response repos_get_apps_with_access_to_protected_branch(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("branch") String branch);

  /**
   * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   *
   * Replaces the list of apps that have push access to this branch. This removes all apps that previously had push access and grants push access to the new list of apps. Only installed GitHub Apps with `write` access to the `contents` permission can be added as authorized actors on a protected branch.
   *
   * | Type    | Description                                                                                                                                                |
   * | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
   * | `array` | The GitHub Apps that have push access to this branch. Use the app's `slug`. **Note**: The list of users, apps, and teams in total is limited to 100 items. |
   */
  @Path("/{owner}/{repo}/branches/{branch}/protection/restrictions/apps")
  @PUT
  @Produces("application/json")
  @Consumes("application/json")
  Response repos_set_app_access_restrictions(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("branch") String branch, List<String> data);

  /**
   * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   *
   * Grants the specified apps push access for this branch. Only installed GitHub Apps with `write` access to the `contents` permission can be added as authorized actors on a protected branch.
   *
   * | Type    | Description                                                                                                                                                |
   * | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
   * | `array` | The GitHub Apps that have push access to this branch. Use the app's `slug`. **Note**: The list of users, apps, and teams in total is limited to 100 items. |
   */
  @Path("/{owner}/{repo}/branches/{branch}/protection/restrictions/apps")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response repos_add_app_access_restrictions(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("branch") String branch, List<String> data);

  /**
   * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   *
   * Removes the ability of an app to push to this branch. Only installed GitHub Apps with `write` access to the `contents` permission can be added as authorized actors on a protected branch.
   *
   * | Type    | Description                                                                                                                                                |
   * | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
   * | `array` | The GitHub Apps that have push access to this branch. Use the app's `slug`. **Note**: The list of users, apps, and teams in total is limited to 100 items. |
   */
  @Path("/{owner}/{repo}/branches/{branch}/protection/restrictions/apps")
  @DELETE
  @Produces("application/json")
  @Consumes("application/json")
  Response repos_remove_app_access_restrictions(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("branch") String branch, List<String> data);

  /**
   * Get a published release with the specified tag.
   */
  @Path("/{owner}/{repo}/releases/tags/{tag}")
  @GET
  @Produces("application/json")
  Response repos_get_release_by_tag(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("tag") String tag);

  /**
   * Gets a redirect URL to download a zip archive for a repository. If you omit `:ref`, the repository’s default branch (usually
   * `master`) will be used. Please make sure your HTTP framework is configured to follow redirects or you will need to use
   * the `Location` header to make a second `GET` request.
   * **Note**: For private repositories, these links are temporary and expire after five minutes.
   */
  @Path("/{owner}/{repo}/zipball/{ref}")
  @GET
  void repos_download_zipball_archive(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("ref") String ref);

  /**
   *
   */
  @Path("/{owner}/{repo}/invitations/{invitation_id}")
  @DELETE
  void repos_delete_invitation(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("invitation_id") Integer invitationId);

  /**
   *
   */
  @Path("/{owner}/{repo}/invitations/{invitation_id}")
  @PATCH
  @Produces("application/json")
  @Consumes("application/json")
  Response repos_update_invitation(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("invitation_id") Integer invitationId, InputStream data);

  /**
   * Users with pull access in a repository can access a combined view of commit statuses for a given ref. The ref can be a SHA, a branch name, or a tag name.
   *
   * The most recent status for each context is returned, up to 100. This field [paginates](https://developer.github.com/v3/#pagination) if there are over 100 contexts.
   *
   * Additionally, a combined `state` is returned. The `state` is one of:
   *
   * *   **failure** if any of the contexts report as `error` or `failure`
   * *   **pending** if there are no statuses or a context is `pending`
   * *   **success** if the latest status for all contexts is `success`
   */
  @Path("/{owner}/{repo}/commits/{ref}/status")
  @GET
  @Produces("application/json")
  Response repos_get_combined_status_for_ref(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("ref") String ref);

  /**
   * Users with push access in a repository can create commit statuses for a given SHA.
   *
   * Note: there is a limit of 1000 statuses per `sha` and `context` within a repository. Attempts to create more than 1000 statuses will result in a validation error.
   */
  @Path("/{owner}/{repo}/statuses/{sha}")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response repos_create_commit_status(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("sha") String sha, InputStream data);

  /**
   * Users with pull access can view deployment statuses for a deployment:
   */
  @Path("/{owner}/{repo}/deployments/{deployment_id}/statuses")
  @GET
  @Produces("application/json")
  Response repos_list_deployment_statuses(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("deployment_id") Integer deploymentId,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * Users with `push` access can create deployment statuses for a given deployment.
   *
   * GitHub Apps require `read & write` access to "Deployments" and `read-only` access to "Repo contents" (for private repos). OAuth Apps require the `repo_deployment` scope.
   */
  @Path("/{owner}/{repo}/deployments/{deployment_id}/statuses")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response repos_create_deployment_status(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("deployment_id") Integer deploymentId,
      InputStream data);

  /**
   * Gets a redirect URL to download a tar archive for a repository. If you omit `:ref`, the repository’s default branch (usually
   * `master`) will be used. Please make sure your HTTP framework is configured to follow redirects or you will need to use
   * the `Location` header to make a second `GET` request.
   * **Note**: For private repositories, these links are temporary and expire after five minutes.
   */
  @Path("/{owner}/{repo}/tarball/{ref}")
  @GET
  void repos_download_tarball_archive(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("ref") String ref);

  /**
   *
   * Returns the `total` number of commits authored by the contributor. In addition, the response includes a Weekly Hash (`weeks` array) with the following information:
   *
   * *   `w` - Start of the week, given as a [Unix timestamp](http://en.wikipedia.org/wiki/Unix_time).
   * *   `a` - Number of additions
   * *   `d` - Number of deletions
   * *   `c` - Number of commits
   */
  @Path("/{owner}/{repo}/stats/contributors")
  @GET
  @Produces("application/json")
  Response repos_get_contributors_stats(@PathParam("owner") String owner,
      @PathParam("repo") String repo);

  /**
   * Gets the preferred README for a repository.
   *
   * READMEs support [custom media types](https://developer.github.com/v3/repos/contents/#custom-media-types) for retrieving the raw content or rendered HTML.
   */
  @Path("/{owner}/{repo}/readme")
  @GET
  @Produces("application/json")
  Response repos_get_readme(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @QueryParam("ref") String ref);

  /**
   * Commit Comments use [these custom media types](https://developer.github.com/v3/repos/comments/#custom-media-types). You can read more about the use of media types in the API [here](https://developer.github.com/v3/media/).
   *
   * Comments are ordered by ascending ID.
   */
  @Path("/{owner}/{repo}/comments")
  @GET
  @Produces("application/json")
  Response repos_list_commit_comments_for_repo(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Returns the contents of a single commit reference. You must have `read` access for the repository to use this endpoint.
   *
   * You can pass the appropriate [media type](https://developer.github.com/v3/media/#commits-commit-comparison-and-pull-requests) to fetch `diff` and `patch` formats. Diffs with binary data will have no `patch` property.
   *
   * To return only the SHA-1 hash of the commit reference, you can provide the `sha` custom [media type](https://developer.github.com/v3/media/#commits-commit-comparison-and-pull-requests) in the `Accept` header. You can use this endpoint to check if a remote reference's SHA-1 hash is the same as your local reference's SHA-1 hash by providing the local SHA-1 reference as the ETag.
   *
   * **Signature verification object**
   *
   * The response will include a `verification` object that describes the result of verifying the commit's signature. The following fields are included in the `verification` object:
   *
   * These are the possible values for `reason` in the `verification` object:
   *
   * | Value                    | Description                                                                                                                       |
   * | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
   * | `expired_key`            | The key that made the signature is expired.                                                                                       |
   * | `not_signing_key`        | The "signing" flag is not among the usage flags in the GPG key that made the signature.                                           |
   * | `gpgverify_error`        | There was an error communicating with the signature verification service.                                                         |
   * | `gpgverify_unavailable`  | The signature verification service is currently unavailable.                                                                      |
   * | `unsigned`               | The object does not include a signature.                                                                                          |
   * | `unknown_signature_type` | A non-PGP signature was found in the commit.                                                                                      |
   * | `no_user`                | No user was associated with the `committer` email address in the commit.                                                          |
   * | `unverified_email`       | The `committer` email address in the commit was associated with a user, but the email address is not verified on her/his account. |
   * | `bad_email`              | The `committer` email address in the commit is not included in the identities of the PGP key that made the signature.             |
   * | `unknown_key`            | The key that made the signature has not been registered with any user's account.                                                  |
   * | `malformed_signature`    | There was an error parsing the signature.                                                                                         |
   * | `invalid`                | The signature could not be cryptographically verified using the key whose key-id was found in the signature.                      |
   * | `valid`                  | None of the above errors applied, so the signature is considered to be verified.                                                  |
   */
  @Path("/{owner}/{repo}/commits/{ref}")
  @GET
  @Produces("application/json")
  Response repos_get_commit(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("ref") String ref);

  /**
   * View the latest published full release for the repository.
   *
   * The latest release is the most recent non-prerelease, non-draft release, sorted by the `created_at` attribute. The `created_at` attribute is the date of the commit used for the release, and not the date when the release was drafted or published.
   */
  @Path("/{owner}/{repo}/releases/latest")
  @GET
  @Produces("application/json")
  Response repos_get_latest_release(@PathParam("owner") String owner,
      @PathParam("repo") String repo);

  /**
   * Returns a weekly aggregate of the number of additions and deletions pushed to a repository.
   */
  @Path("/{owner}/{repo}/stats/code_frequency")
  @GET
  @Produces("application/json")
  List<Integer> repos_get_code_frequency_stats(@PathParam("owner") String owner,
      @PathParam("repo") String repo);

  /**
   * Lists contributors to the specified repository and sorts them by the number of commits per contributor in descending order. This endpoint may return information that is a few hours old because the GitHub REST API v3 caches contributor data to improve performance.
   *
   * GitHub identifies contributors by author email address. This endpoint groups contribution counts by GitHub user, which includes all associated email addresses. To improve performance, only the first 500 author email addresses in the repository link to GitHub users. The rest will appear as anonymous contributors without associated GitHub user information.
   */
  @Path("/{owner}/{repo}/contributors")
  @GET
  @Produces("application/json")
  Response repos_list_contributors(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @QueryParam("anon") String anon, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * For organization-owned repositories, the list of collaborators includes outside collaborators, organization members that are direct collaborators, organization members with access through team memberships, organization members with access through default organization permissions, and organization owners.
   *
   * Team members will include the members of child teams.
   */
  @Path("/{owner}/{repo}/collaborators")
  @GET
  @Produces("application/json")
  Response repos_list_collaborators(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @QueryParam("affiliation") String affiliation,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   *
   */
  @Path("/{owner}/{repo}/merges")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response repos_merge(@PathParam("owner") String owner, @PathParam("repo") String repo,
      InputStream data);

  /**
   * Checks the repository permission of a collaborator. The possible repository permissions are `admin`, `write`, `read`, and `none`.
   */
  @Path("/{owner}/{repo}/collaborators/{username}/permission")
  @GET
  @Produces("application/json")
  Response repos_get_collaborator_permission_level(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("username") String username);

  /**
   * List files larger than 100MB found during the import
   */
  @Path("/{owner}/{repo}/import/large_files")
  @GET
  @Produces("application/json")
  Response migrations_get_large_files(@PathParam("owner") String owner,
      @PathParam("repo") String repo);

  /**
   * View the progress of an import.
   *
   * **Import status**
   *
   * This section includes details about the possible values of the `status` field of the Import Progress response.
   *
   * An import that does not have errors will progress through these steps:
   *
   * *   `detecting` - the "detection" step of the import is in progress because the request did not include a `vcs` parameter. The import is identifying the type of source control present at the URL.
   * *   `importing` - the "raw" step of the import is in progress. This is where commit data is fetched from the original repository. The import progress response will include `commit_count` (the total number of raw commits that will be imported) and `percent` (0 - 100, the current progress through the import).
   * *   `mapping` - the "rewrite" step of the import is in progress. This is where SVN branches are converted to Git branches, and where author updates are applied. The import progress response does not include progress information.
   * *   `pushing` - the "push" step of the import is in progress. This is where the importer updates the repository on GitHub. The import progress response will include `push_percent`, which is the percent value reported by `git push` when it is "Writing objects".
   * *   `complete` - the import is complete, and the repository is ready on GitHub.
   *
   * If there are problems, you will see one of these in the `status` field:
   *
   * *   `auth_failed` - the import requires authentication in order to connect to the original repository. To update authentication for the import, please see the [Update an import](https://developer.github.com/v3/migrations/source_imports/#update-an-import) section.
   * *   `error` - the import encountered an error. The import progress response will include the `failed_step` and an error message. Contact [GitHub Support](https://github.com/contact) or [GitHub Premium Support](https://premium.githubsupport.com) for more information.
   * *   `detection_needs_auth` - the importer requires authentication for the originating repository to continue detection. To update authentication for the import, please see the [Update an import](https://developer.github.com/v3/migrations/source_imports/#update-an-import) section.
   * *   `detection_found_nothing` - the importer didn't recognize any source control at the URL. To resolve, [Cancel the import](https://developer.github.com/v3/migrations/source_imports/#cancel-an-import) and [retry](https://developer.github.com/v3/migrations/source_imports/#start-an-import) with the correct URL.
   * *   `detection_found_multiple` - the importer found several projects or repositories at the provided URL. When this is the case, the Import Progress response will also include a `project_choices` field with the possible project choices as values. To update project choice, please see the [Update an import](https://developer.github.com/v3/migrations/source_imports/#update-an-import) section.
   *
   * **The project_choices field**
   *
   * When multiple projects are found at the provided URL, the response hash will include a `project_choices` field, the value of which is an array of hashes each representing a project choice. The exact key/value pairs of the project hashes will differ depending on the version control type.
   *
   * **Git LFS related fields**
   *
   * This section includes details about Git LFS related fields that may be present in the Import Progress response.
   *
   * *   `use_lfs` - describes whether the import has been opted in or out of using Git LFS. The value can be `opt_in`, `opt_out`, or `undecided` if no action has been taken.
   * *   `has_large_files` - the boolean value describing whether files larger than 100MB were found during the `importing` step.
   * *   `large_files_size` - the total size in gigabytes of files larger than 100MB found in the originating repository.
   * *   `large_files_count` - the total number of files larger than 100MB found in the originating repository. To see a list of these files, make a "Get Large Files" request.
   */
  @Path("/{owner}/{repo}/import")
  @GET
  @Produces("application/json")
  Response migrations_get_import_status(@PathParam("owner") String owner,
      @PathParam("repo") String repo);

  /**
   * Start a source import to a GitHub repository using GitHub Importer.
   */
  @Path("/{owner}/{repo}/import")
  @PUT
  @Produces("application/json")
  @Consumes("application/json")
  Response migrations_start_import(@PathParam("owner") String owner, @PathParam("repo") String repo,
      InputStream data);

  /**
   * Stop an import for a repository.
   */
  @Path("/{owner}/{repo}/import")
  @DELETE
  void migrations_cancel_import(@PathParam("owner") String owner, @PathParam("repo") String repo);

  /**
   * An import can be updated with credentials or a project choice by passing in the appropriate parameters in this API
   * request. If no parameters are provided, the import will be restarted.
   */
  @Path("/{owner}/{repo}/import")
  @PATCH
  @Produces("application/json")
  @Consumes("application/json")
  Response migrations_update_import(@PathParam("owner") String owner,
      @PathParam("repo") String repo, InputStream data);

  /**
   * Update an author's identity for the import. Your application can continue updating authors any time before you push new commits to the repository.
   */
  @Path("/{owner}/{repo}/import/authors/{author_id}")
  @PATCH
  @Produces("application/json")
  @Consumes("application/json")
  Response migrations_map_commit_author(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("author_id") Integer authorId, InputStream data);

  /**
   * Each type of source control system represents authors in a different way. For example, a Git commit author has a display name and an email address, but a Subversion commit author just has a username. The GitHub Importer will make the author information valid, but the author might not be correct. For example, it will change the bare Subversion username `hubot` into something like `hubot <hubot@12341234-abab-fefe-8787-fedcba987654>`.
   *
   * This endpoint and the [Map a commit author](https://developer.github.com/v3/migrations/source_imports/#map-a-commit-author) endpoint allow you to provide correct Git author information.
   */
  @Path("/{owner}/{repo}/import/authors")
  @GET
  @Produces("application/json")
  Response migrations_get_commit_authors(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @QueryParam("since") String since);

  /**
   * You can import repositories from Subversion, Mercurial, and TFS that include files larger than 100MB. This ability is powered by [Git LFS](https://git-lfs.github.com). You can learn more about our LFS feature and working with large files [on our help site](https://help.github.com/articles/versioning-large-files/).
   */
  @Path("/{owner}/{repo}/import/lfs")
  @PATCH
  @Produces("application/json")
  @Consumes("application/json")
  Response migrations_set_lfs_preference(@PathParam("owner") String owner,
      @PathParam("repo") String repo, InputStream data);

  /**
   * Shows which group of GitHub users can interact with this repository and when the restriction expires. If there are no restrictions, you will see an empty response.
   */
  @Path("/{owner}/{repo}/interaction-limits")
  @GET
  @Produces("application/json")
  Response interactions_get_restrictions_for_repo(@PathParam("owner") String owner,
      @PathParam("repo") String repo);

  /**
   * Temporarily restricts interactions to certain GitHub users within the given repository. You must have owner or admin access to set restrictions.
   */
  @Path("/{owner}/{repo}/interaction-limits")
  @PUT
  @Produces("application/json")
  @Consumes("application/json")
  Response interactions_set_restrictions_for_repo(@PathParam("owner") String owner,
      @PathParam("repo") String repo, InputStream data);

  /**
   * Removes all interaction restrictions from the given repository. You must have owner or admin access to remove restrictions.
   */
  @Path("/{owner}/{repo}/interaction-limits")
  @DELETE
  void interactions_remove_restrictions_for_repo(@PathParam("owner") String owner,
      @PathParam("repo") String repo);

  /**
   * This method returns the contents of the repository's license file, if one is detected.
   *
   * Similar to [Get repository content](https://developer.github.com/v3/repos/contents/#get-repository-content), this method also supports [custom media types](https://developer.github.com/v3/repos/contents/#custom-media-types) for retrieving the raw license content or rendered license HTML.
   */
  @Path("/{owner}/{repo}/license")
  @GET
  @Produces("application/json")
  Response licenses_get_for_repo(@PathParam("owner") String owner, @PathParam("repo") String repo);

  /**
   *
   */
  @Path("/{owner}/{repo}/subscription")
  @GET
  @Produces("application/json")
  Response activity_get_repo_subscription(@PathParam("owner") String owner,
      @PathParam("repo") String repo);

  /**
   * If you would like to watch a repository, set `subscribed` to `true`. If you would like to ignore notifications made within a repository, set `ignored` to `true`. If you would like to stop watching a repository, [delete the repository's subscription](https://developer.github.com/v3/activity/watching/#delete-a-repository-subscription) completely.
   */
  @Path("/{owner}/{repo}/subscription")
  @PUT
  @Produces("application/json")
  @Consumes("application/json")
  Response activity_set_repo_subscription(@PathParam("owner") String owner,
      @PathParam("repo") String repo, InputStream data);

  /**
   * This endpoint should only be used to stop watching a repository. To control whether or not you wish to receive notifications from a repository, [set the repository's subscription manually](https://developer.github.com/v3/activity/watching/#set-a-repository-subscription).
   */
  @Path("/{owner}/{repo}/subscription")
  @DELETE
  void activity_delete_repo_subscription(@PathParam("owner") String owner,
      @PathParam("repo") String repo);

  /**
   *
   */
  @Path("/{owner}/{repo}/events")
  @GET
  @Produces("application/json")
  Response activity_list_repo_events(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * List all notifications for the current user.
   */
  @Path("/{owner}/{repo}/notifications")
  @GET
  @Produces("application/json")
  Response activity_list_repo_notifications_for_authenticated_user(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @QueryParam("all") Boolean all,
      @QueryParam("participating") Boolean participating, @QueryParam("since") String since,
      @QueryParam("before") String before, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Marks all notifications in a repository as "read" removes them from the [default view on GitHub](https://github.com/notifications). If the number of notifications is too large to complete in one request, you will receive a `202 Accepted` status and GitHub will run an asynchronous process to mark notifications as "read." To check whether any "unread" notifications remain, you can use the [List repository notifications for the authenticated user](https://developer.github.com/v3/activity/notifications/#list-repository-notifications-for-the-authenticated-user) endpoint and pass the query parameter `all=false`.
   */
  @Path("/{owner}/{repo}/notifications")
  @PUT
  @Consumes("application/json")
  void activity_mark_repo_notifications_as_read(@PathParam("owner") String owner,
      @PathParam("repo") String repo, InputStream data);

  /**
   * Lists the people watching the specified repository.
   */
  @Path("/{owner}/{repo}/subscribers")
  @GET
  @Produces("application/json")
  Response activity_list_watchers_for_repo(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Lists the people that have starred the repository.
   *
   * You can also find out _when_ stars were created by passing the following custom [media type](https://developer.github.com/v3/media/) via the `Accept` header:
   */
  @Path("/{owner}/{repo}/stargazers")
  @GET
  @Produces({"application/json", "application/vnd.github.v3.star+json"})
  Response activity_list_stargazers_for_repo(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Lists annotations for a check run using the annotation `id`. GitHub Apps must have the `checks:read` permission on a private repository or pull access to a public repository to get annotations for a check run. OAuth Apps and authenticated users must have the `repo` scope to get annotations for a check run in a private repository.
   */
  @Path("/{owner}/{repo}/check-runs/{check_run_id}/annotations")
  @GET
  @Produces("application/json")
  Response checks_list_annotations(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("check_run_id") Integer checkRunId, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * **Note:** The Checks API only looks for pushes in the repository where the check suite or check run were created. Pushes to a branch in a forked repository are not detected and return an empty `pull_requests` array and a `null` value for `head_branch`.
   *
   * Lists check suites for a commit `ref`. The `ref` can be a SHA, branch name, or a tag name. GitHub Apps must have the `checks:read` permission on a private repository or pull access to a public repository to list check suites. OAuth Apps and authenticated users must have the `repo` scope to get check suites in a private repository.
   */
  @Path("/{owner}/{repo}/commits/{ref}/check-suites")
  @GET
  @Produces("application/json")
  Response checks_list_suites_for_ref(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("ref") String ref,
      @QueryParam("app_id") Integer appId, @QueryParam("check_name") String checkName,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * **Note:** The Checks API only looks for pushes in the repository where the check suite or check run were created. Pushes to a branch in a forked repository are not detected and return an empty `pull_requests` array.
   *
   * Lists check runs for a commit ref. The `ref` can be a SHA, branch name, or a tag name. GitHub Apps must have the `checks:read` permission on a private repository or pull access to a public repository to get check runs. OAuth Apps and authenticated users must have the `repo` scope to get check runs in a private repository.
   */
  @Path("/{owner}/{repo}/commits/{ref}/check-runs")
  @GET
  @Produces("application/json")
  Response checks_list_for_ref(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("ref") String ref, @QueryParam("check_name") String checkName,
      @QueryParam("status") String status, @QueryParam("filter") String filter,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * **Note:** The Checks API only looks for pushes in the repository where the check suite or check run were created. Pushes to a branch in a forked repository are not detected and return an empty `pull_requests` array.
   *
   * Lists check runs for a check suite using its `id`. GitHub Apps must have the `checks:read` permission on a private repository or pull access to a public repository to get check runs. OAuth Apps and authenticated users must have the `repo` scope to get check runs in a private repository.
   */
  @Path("/{owner}/{repo}/check-suites/{check_suite_id}/check-runs")
  @GET
  @Produces("application/json")
  Response checks_list_for_suite(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("check_suite_id") Integer checkSuiteId, @QueryParam("check_name") String checkName,
      @QueryParam("status") String status, @QueryParam("filter") String filter,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * **Note:** The Checks API only looks for pushes in the repository where the check suite or check run were created. Pushes to a branch in a forked repository are not detected and return an empty `pull_requests` array.
   *
   * Gets a single check run using its `id`. GitHub Apps must have the `checks:read` permission on a private repository or pull access to a public repository to get check runs. OAuth Apps and authenticated users must have the `repo` scope to get check runs in a private repository.
   */
  @Path("/{owner}/{repo}/check-runs/{check_run_id}")
  @GET
  @Produces("application/json")
  Response checks_get(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("check_run_id") Integer checkRunId);

  /**
   * **Note:** The Checks API only looks for pushes in the repository where the check suite or check run were created. Pushes to a branch in a forked repository are not detected and return an empty `pull_requests` array.
   *
   * Updates a check run for a specific commit in a repository. Your GitHub App must have the `checks:write` permission to edit check runs.
   */
  @Path("/{owner}/{repo}/check-runs/{check_run_id}")
  @PATCH
  @Produces("application/json")
  @Consumes("application/json")
  Response checks_update(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("check_run_id") Integer checkRunId, InputStream data);

  /**
   * **Note:** The Checks API only looks for pushes in the repository where the check suite or check run were created. Pushes to a branch in a forked repository are not detected and return an empty `pull_requests` array and a `null` value for `head_branch`.
   *
   * By default, check suites are automatically created when you create a [check run](https://developer.github.com/v3/checks/runs/). You only need to use this endpoint for manually creating check suites when you've disabled automatic creation using "[Update repository preferences for check suites](https://developer.github.com/v3/checks/suites/#update-repository-preferences-for-check-suites)". Your GitHub App must have the `checks:write` permission to create check suites.
   */
  @Path("/{owner}/{repo}/check-suites")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response checks_create_suite(@PathParam("owner") String owner, @PathParam("repo") String repo,
      InputStream data);

  /**
   * Triggers GitHub to rerequest an existing check suite, without pushing new code to a repository. This endpoint will trigger the [`check_suite` webhook](https://developer.github.com/webhooks/event-payloads/#check_suite) event with the action `rerequested`. When a check suite is `rerequested`, its `status` is reset to `queued` and the `conclusion` is cleared.
   *
   * To rerequest a check suite, your GitHub App must have the `checks:read` permission on a private repository or pull access to a public repository.
   */
  @Path("/{owner}/{repo}/check-suites/{check_suite_id}/rerequest")
  @POST
  void checks_rerequest_suite(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("check_suite_id") Integer checkSuiteId);

  /**
   * Changes the default automatic flow when creating check suites. By default, a check suite is automatically created each time code is pushed to a repository. When you disable the automatic creation of check suites, you can manually [Create a check suite](https://developer.github.com/v3/checks/suites/#create-a-check-suite). You must have admin permissions in the repository to set preferences for check suites.
   */
  @Path("/{owner}/{repo}/check-suites/preferences")
  @PATCH
  @Produces("application/json")
  @Consumes("application/json")
  Response checks_set_suites_preferences(@PathParam("owner") String owner,
      @PathParam("repo") String repo, InputStream data);

  /**
   * **Note:** The Checks API only looks for pushes in the repository where the check suite or check run were created. Pushes to a branch in a forked repository are not detected and return an empty `pull_requests` array.
   *
   * Creates a new check run for a specific commit in a repository. Your GitHub App must have the `checks:write` permission to create check runs.
   */
  @Path("/{owner}/{repo}/check-runs")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response checks_create(@PathParam("owner") String owner, @PathParam("repo") String repo,
      InputStream data);

  /**
   * **Note:** The Checks API only looks for pushes in the repository where the check suite or check run were created. Pushes to a branch in a forked repository are not detected and return an empty `pull_requests` array and a `null` value for `head_branch`.
   *
   * Gets a single check suite using its `id`. GitHub Apps must have the `checks:read` permission on a private repository or pull access to a public repository to get check suites. OAuth Apps and authenticated users must have the `repo` scope to get check suites in a private repository.
   */
  @Path("/{owner}/{repo}/check-suites/{check_suite_id}")
  @GET
  @Produces("application/json")
  Response checks_get_suite(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("check_suite_id") Integer checkSuiteId);

  /**
   * Lists the projects in a repository. Returns a `404 Not Found` status if projects are disabled in the repository. If you do not have sufficient privileges to perform this action, a `401 Unauthorized` or `410 Gone` status is returned.
   */
  @Path("/{owner}/{repo}/projects")
  @GET
  @Produces("application/json")
  Response projects_list_for_repo(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @QueryParam("state") String state, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Creates a repository project board. Returns a `404 Not Found` status if projects are disabled in the repository. If you do not have sufficient privileges to perform this action, a `401 Unauthorized` or `410 Gone` status is returned.
   */
  @Path("/{owner}/{repo}/projects")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response projects_create_for_repo(@PathParam("owner") String owner,
      @PathParam("repo") String repo, InputStream data);

  /**
   * List the reactions to an [issue comment](https://developer.github.com/v3/issues/comments/).
   */
  @Path("/{owner}/{repo}/issues/comments/{comment_id}/reactions")
  @GET
  @Produces("application/json")
  Response reactions_list_for_issue_comment(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("comment_id") Integer commentId,
      @QueryParam("content") String content, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Create a reaction to an [issue comment](https://developer.github.com/v3/issues/comments/). A response with a `Status: 200 OK` means that you already added the reaction type to this issue comment.
   */
  @Path("/{owner}/{repo}/issues/comments/{comment_id}/reactions")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response reactions_create_for_issue_comment(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("comment_id") Integer commentId, InputStream data);

  /**
   * List the reactions to an [issue](https://developer.github.com/v3/issues/).
   */
  @Path("/{owner}/{repo}/issues/{issue_number}/reactions")
  @GET
  @Produces("application/json")
  Response reactions_list_for_issue(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("issue_number") Integer issueNumber,
      @QueryParam("content") String content, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Create a reaction to an [issue](https://developer.github.com/v3/issues/). A response with a `Status: 200 OK` means that you already added the reaction type to this issue.
   */
  @Path("/{owner}/{repo}/issues/{issue_number}/reactions")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response reactions_create_for_issue(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("issue_number") Integer issueNumber,
      InputStream data);

  /**
   * List the reactions to a [pull request review comment](https://developer.github.com/v3/pulls/comments/).
   */
  @Path("/{owner}/{repo}/pulls/comments/{comment_id}/reactions")
  @GET
  @Produces("application/json")
  Response reactions_list_for_pull_request_review_comment(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("comment_id") Integer commentId,
      @QueryParam("content") String content, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Create a reaction to a [pull request review comment](https://developer.github.com/v3/pulls/comments/). A response with a `Status: 200 OK` means that you already added the reaction type to this pull request review comment.
   */
  @Path("/{owner}/{repo}/pulls/comments/{comment_id}/reactions")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response reactions_create_for_pull_request_review_comment(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("comment_id") Integer commentId, InputStream data);

  /**
   * **Note:** You can also specify a repository by `repository_id` using the route `DELETE /repositories/:repository_id/comments/:comment_id/reactions/:reaction_id`.
   *
   * Delete a reaction to a [commit comment](https://developer.github.com/v3/repos/comments/).
   */
  @Path("/{owner}/{repo}/comments/{comment_id}/reactions/{reaction_id}")
  @DELETE
  void reactions_delete_for_commit_comment(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("comment_id") Integer commentId,
      @PathParam("reaction_id") Integer reactionId);

  /**
   * **Note:** You can also specify a repository by `repository_id` using the route `DELETE delete /repositories/:repository_id/issues/comments/:comment_id/reactions/:reaction_id`.
   *
   * Delete a reaction to an [issue comment](https://developer.github.com/v3/issues/comments/).
   */
  @Path("/{owner}/{repo}/issues/comments/{comment_id}/reactions/{reaction_id}")
  @DELETE
  void reactions_delete_for_issue_comment(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("comment_id") Integer commentId,
      @PathParam("reaction_id") Integer reactionId);

  /**
   * **Note:** You can also specify a repository by `repository_id` using the route `DELETE /repositories/:repository_id/issues/:issue_number/reactions/:reaction_id`.
   *
   * Delete a reaction to an [issue](https://developer.github.com/v3/issues/).
   */
  @Path("/{owner}/{repo}/issues/{issue_number}/reactions/{reaction_id}")
  @DELETE
  void reactions_delete_for_issue(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("issue_number") Integer issueNumber, @PathParam("reaction_id") Integer reactionId);

  /**
   * **Note:** You can also specify a repository by `repository_id` using the route `DELETE /repositories/:repository_id/pulls/comments/:comment_id/reactions/:reaction_id.`
   *
   * Delete a reaction to a [pull request review comment](https://developer.github.com/v3/pulls/comments/).
   */
  @Path("/{owner}/{repo}/pulls/comments/{comment_id}/reactions/{reaction_id}")
  @DELETE
  void reactions_delete_for_pull_request_comment(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("comment_id") Integer commentId,
      @PathParam("reaction_id") Integer reactionId);

  /**
   * List the reactions to a [commit comment](https://developer.github.com/v3/repos/comments/).
   */
  @Path("/{owner}/{repo}/comments/{comment_id}/reactions")
  @GET
  @Produces("application/json")
  Response reactions_list_for_commit_comment(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("comment_id") Integer commentId,
      @QueryParam("content") String content, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Create a reaction to a [commit comment](https://developer.github.com/v3/repos/comments/). A response with a `Status: 200 OK` means that you already added the reaction type to this commit comment.
   */
  @Path("/{owner}/{repo}/comments/{comment_id}/reactions")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response reactions_create_for_commit_comment(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("comment_id") Integer commentId, InputStream data);

  /**
   * This method returns the contents of the repository's code of conduct file, if one is detected.
   */
  @Path("/{owner}/{repo}/community/code_of_conduct")
  @GET
  @Produces("application/json")
  Response codes_of_conduct_get_for_repo(@PathParam("owner") String owner,
      @PathParam("repo") String repo);

  /**
   * Lists the workflows in a repository. Anyone with read access to the repository can use this endpoint. If the repository is private you must use an access token with the `repo` scope. GitHub Apps must have the `actions:read` permission to use this endpoint.
   */
  @Path("/{owner}/{repo}/actions/workflows")
  @GET
  @Produces("application/json")
  Response actions_list_repo_workflows(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * You can use this endpoint to manually trigger a GitHub Actions workflow run. You can also replace `{workflow_id}` with the workflow file name. For example, you could use `main.yml`.
   *
   * You must configure your GitHub Actions workflow to run when the [`workflow_dispatch` webhook](/developers/webhooks-and-events/webhook-events-and-payloads#workflow_dispatch) event occurs. The `inputs` are configured in the workflow file. For more information about how to configure the `workflow_dispatch` event in the workflow file, see "[Events that trigger workflows](/actions/reference/events-that-trigger-workflows#workflow_dispatch)."
   *
   * You must authenticate using an access token with the `repo` scope to use this endpoint. GitHub Apps must have the `actions:write` permission to use this endpoint. For more information, see "[Creating a personal access token for the command line](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line)."
   */
  @Path("/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches")
  @POST
  @Consumes("application/json")
  void actions_create_workflow_dispatch(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("workflow_id") Integer workflowId,
      InputStream data);

  /**
   * Lists binaries for the runner application that you can download and run. You must authenticate using an access token with the `repo` scope to use this endpoint.
   */
  @Path("/{owner}/{repo}/actions/runners/downloads")
  @GET
  @Produces("application/json")
  Response actions_list_runner_applications_for_repo(@PathParam("owner") String owner,
      @PathParam("repo") String repo);

  /**
   * Lists all artifacts for a repository. Anyone with read access to the repository can use this endpoint. If the repository is private you must use an access token with the `repo` scope. GitHub Apps must have the `actions:read` permission to use this endpoint.
   */
  @Path("/{owner}/{repo}/actions/artifacts")
  @GET
  @Produces("application/json")
  Response actions_list_artifacts_for_repo(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Lists all secrets available in a repository without revealing their encrypted values. You must authenticate using an access token with the `repo` scope to use this endpoint. GitHub Apps must have the `secrets` repository permission to use this endpoint.
   */
  @Path("/{owner}/{repo}/actions/secrets")
  @GET
  @Produces("application/json")
  Response actions_list_repo_secrets(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * **Warning:** This GitHub Actions usage endpoint is currently in public beta and subject to change. For more information, see "[GitHub Actions API workflow usage](https://developer.github.com/changes/2020-05-15-actions-api-workflow-usage)."
   *
   * Gets the number of billable minutes used by a specific workflow during the current billing cycle. Billable minutes only apply to workflows in private repositories that use GitHub-hosted runners. Usage is listed for each GitHub-hosted runner operating system in milliseconds. Any job re-runs are also included in the usage. The usage does not include the multiplier for macOS and Windows runners and is not rounded up to the nearest whole minute. For more information, see "[Managing billing for GitHub Actions](https://help.github.com/github/setting-up-and-managing-billing-and-payments-on-github/managing-billing-for-github-actions)".
   *
   * You can also replace `:workflow_id` with `:workflow_file_name`. For example, you could use `main.yml`. Anyone with read access to the repository can use this endpoint. If the repository is private you must use an access token with the `repo` scope. GitHub Apps must have the `actions:read` permission to use this endpoint.
   */
  @Path("/{owner}/{repo}/actions/workflows/{workflow_id}/timing")
  @GET
  @Produces("application/json")
  Response actions_get_workflow_usage(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("workflow_id") Integer workflowId);

  /**
   * Gets a specific artifact for a workflow run. Anyone with read access to the repository can use this endpoint. If the repository is private you must use an access token with the `repo` scope. GitHub Apps must have the `actions:read` permission to use this endpoint.
   */
  @Path("/{owner}/{repo}/actions/artifacts/{artifact_id}")
  @GET
  @Produces("application/json")
  Response actions_get_artifact(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("artifact_id") Integer artifactId);

  /**
   * Deletes an artifact for a workflow run. You must authenticate using an access token with the `repo` scope to use this endpoint. GitHub Apps must have the `actions:write` permission to use this endpoint.
   */
  @Path("/{owner}/{repo}/actions/artifacts/{artifact_id}")
  @DELETE
  void actions_delete_artifact(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("artifact_id") Integer artifactId);

  /**
   * Gets a single repository secret without revealing its encrypted value. You must authenticate using an access token with the `repo` scope to use this endpoint. GitHub Apps must have the `secrets` repository permission to use this endpoint.
   */
  @Path("/{owner}/{repo}/actions/secrets/{secret_name}")
  @GET
  @Produces("application/json")
  Response actions_get_repo_secret(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("secret_name") String secretName);

  /**
   * Creates or updates a repository secret with an encrypted value. Encrypt your secret using
   * [LibSodium](https://libsodium.gitbook.io/doc/bindings_for_other_languages). You must authenticate using an access
   * token with the `repo` scope to use this endpoint. GitHub Apps must have the `secrets` repository permission to use
   * this endpoint.
   *
   * #### Example encrypting a secret using Node.js
   *
   * Encrypt your secret using the [tweetsodium](https://github.com/github/tweetsodium) library.
   *
   * ```
   * const sodium = require('tweetsodium');
   *
   * const key = "base64-encoded-public-key";
   * const value = "plain-text-secret";
   *
   * // Convert the message and key to Uint8Array's (Buffer implements that interface)
   * const messageBytes = Buffer.from(value);
   * const keyBytes = Buffer.from(key, 'base64');
   *
   * // Encrypt using LibSodium.
   * const encryptedBytes = sodium.seal(messageBytes, keyBytes);
   *
   * // Base64 the encrypted secret
   * const encrypted = Buffer.from(encryptedBytes).toString('base64');
   *
   * console.log(encrypted);
   * ```
   *
   *
   * #### Example encrypting a secret using Python
   *
   * Encrypt your secret using [pynacl](https://pynacl.readthedocs.io/en/stable/public/#nacl-public-sealedbox) with Python 3.
   *
   * ```
   * from base64 import b64encode
   * from nacl import encoding, public
   *
   * def encrypt(public_key: str, secret_value: str) -> str:
   *   """Encrypt a Unicode string using the public key."""
   *   public_key = public.PublicKey(public_key.encode("utf-8"), encoding.Base64Encoder())
   *   sealed_box = public.SealedBox(public_key)
   *   encrypted = sealed_box.encrypt(secret_value.encode("utf-8"))
   *   return b64encode(encrypted).decode("utf-8")
   * ```
   *
   * #### Example encrypting a secret using C#
   *
   * Encrypt your secret using the [Sodium.Core](https://www.nuget.org/packages/Sodium.Core/) package.
   *
   * ```
   * var secretValue = System.Text.Encoding.UTF8.GetBytes("mySecret");
   * var publicKey = Convert.FromBase64String("2Sg8iYjAxxmI2LvUXpJjkYrMxURPc8r+dB7TJyvvcCU=");
   *
   * var sealedPublicKeyBox = Sodium.SealedPublicKeyBox.Create(secretValue, publicKey);
   *
   * Console.WriteLine(Convert.ToBase64String(sealedPublicKeyBox));
   * ```
   *
   * #### Example encrypting a secret using Ruby
   *
   * Encrypt your secret using the [rbnacl](https://github.com/RubyCrypto/rbnacl) gem.
   *
   * ```ruby
   * require "rbnacl"
   * require "base64"
   *
   * key = Base64.decode64("+ZYvJDZMHUfBkJdyq5Zm9SKqeuBQ4sj+6sfjlH4CgG0=")
   * public_key = RbNaCl::PublicKey.new(key)
   *
   * box = RbNaCl::Boxes::Sealed.from_public_key(public_key)
   * encrypted_secret = box.encrypt("my_secret")
   *
   * # Print the base64 encoded secret
   * puts Base64.strict_encode64(encrypted_secret)
   * ```
   */
  @Path("/{owner}/{repo}/actions/secrets/{secret_name}")
  @PUT
  @Consumes("application/json")
  void actions_create_or_update_repo_secret(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("secret_name") String secretName,
      InputStream data);

  /**
   * Deletes a secret in a repository using the secret name. You must authenticate using an access token with the `repo` scope to use this endpoint. GitHub Apps must have the `secrets` repository permission to use this endpoint.
   */
  @Path("/{owner}/{repo}/actions/secrets/{secret_name}")
  @DELETE
  void actions_delete_repo_secret(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("secret_name") String secretName);

  /**
   * Gets a redirect URL to download an archive for a repository. This URL expires after 1 minute. Look for `Location:` in
   * the response header to find the URL for the download. The `:archive_format` must be `zip`. Anyone with read access to
   * the repository can use this endpoint. If the repository is private you must use an access token with the `repo` scope.
   * GitHub Apps must have the `actions:read` permission to use this endpoint.
   */
  @Path("/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}")
  @GET
  void actions_download_artifact(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("artifact_id") Integer artifactId,
      @PathParam("archive_format") String archiveFormat);

  /**
   * Gets a specific self-hosted runner. You must authenticate using an access token with the `repo` scope to use this endpoint.
   */
  @Path("/{owner}/{repo}/actions/runners/{runner_id}")
  @GET
  @Produces("application/json")
  Response actions_get_self_hosted_runner_for_repo(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("runner_id") Integer runnerId);

  /**
   * Forces the removal of a self-hosted runner from a repository. You can use this endpoint to completely remove the runner when the machine you were using no longer exists. You must authenticate using an access token with the `repo` scope to use this endpoint.
   */
  @Path("/{owner}/{repo}/actions/runners/{runner_id}")
  @DELETE
  void actions_delete_self_hosted_runner_from_repo(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("runner_id") Integer runnerId);

  /**
   * Gets a redirect URL to download a plain text file of logs for a workflow job. This link expires after 1 minute. Look
   * for `Location:` in the response header to find the URL for the download. Anyone with read access to the repository can
   * use this endpoint. If the repository is private you must use an access token with the `repo` scope. GitHub Apps must
   * have the `actions:read` permission to use this endpoint.
   */
  @Path("/{owner}/{repo}/actions/jobs/{job_id}/logs")
  @GET
  void actions_download_job_logs_for_workflow_run(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("job_id") Integer jobId);

  /**
   * Lists jobs for a workflow run. Anyone with read access to the repository can use this endpoint. If the repository is private you must use an access token with the `repo` scope. GitHub Apps must have the `actions:read` permission to use this endpoint. You can use parameters to narrow the list of results. For more information about using parameters, see [Parameters](https://developer.github.com/v3/#parameters).
   */
  @Path("/{owner}/{repo}/actions/runs/{run_id}/jobs")
  @GET
  @Produces("application/json")
  Response actions_list_jobs_for_workflow_run(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("run_id") Integer runId,
      @QueryParam("filter") String filter, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Lists all self-hosted runners for a repository. You must authenticate using an access token with the `repo` scope to use this endpoint.
   */
  @Path("/{owner}/{repo}/actions/runners")
  @GET
  @Produces("application/json")
  Response actions_list_self_hosted_runners_for_repo(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Gets a specific workflow. You can also replace `:workflow_id` with `:workflow_file_name`. For example, you could use `main.yml`. Anyone with read access to the repository can use this endpoint. If the repository is private you must use an access token with the `repo` scope. GitHub Apps must have the `actions:read` permission to use this endpoint.
   */
  @Path("/{owner}/{repo}/actions/workflows/{workflow_id}")
  @GET
  @Produces("application/json")
  Response actions_get_workflow(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("workflow_id") Integer workflowId);

  /**
   * Gets a specific job in a workflow run. Anyone with read access to the repository can use this endpoint. If the repository is private you must use an access token with the `repo` scope. GitHub Apps must have the `actions:read` permission to use this endpoint.
   */
  @Path("/{owner}/{repo}/actions/jobs/{job_id}")
  @GET
  @Produces("application/json")
  Response actions_get_job_for_workflow_run(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("job_id") Integer jobId);

  /**
   * Cancels a workflow run using its `id`. You must authenticate using an access token with the `repo` scope to use this endpoint. GitHub Apps must have the `actions:write` permission to use this endpoint.
   */
  @Path("/{owner}/{repo}/actions/runs/{run_id}/cancel")
  @POST
  void actions_cancel_workflow_run(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("run_id") Integer runId);

  /**
   * Gets a redirect URL to download an archive of log files for a workflow run. This link expires after 1 minute. Look for
   * `Location:` in the response header to find the URL for the download. Anyone with read access to the repository can use
   * this endpoint. If the repository is private you must use an access token with the `repo` scope. GitHub Apps must have
   * the `actions:read` permission to use this endpoint.
   */
  @Path("/{owner}/{repo}/actions/runs/{run_id}/logs")
  @GET
  void actions_download_workflow_run_logs(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("run_id") Integer runId);

  /**
   * Deletes all logs for a workflow run. You must authenticate using an access token with the `repo` scope to use this endpoint. GitHub Apps must have the `actions:write` permission to use this endpoint.
   */
  @Path("/{owner}/{repo}/actions/runs/{run_id}/logs")
  @DELETE
  void actions_delete_workflow_run_logs(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("run_id") Integer runId);

  /**
   * Re-runs your workflow run using its `id`. You must authenticate using an access token with the `repo` scope to use this endpoint. GitHub Apps must have the `actions:write` permission to use this endpoint.
   */
  @Path("/{owner}/{repo}/actions/runs/{run_id}/rerun")
  @POST
  void actions_re_run_workflow(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("run_id") Integer runId);

  /**
   * Gets a specific workflow run. Anyone with read access to the repository can use this endpoint. If the repository is private you must use an access token with the `repo` scope. GitHub Apps must have the `actions:read` permission to use this endpoint.
   */
  @Path("/{owner}/{repo}/actions/runs/{run_id}")
  @GET
  @Produces("application/json")
  Response actions_get_workflow_run(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("run_id") Integer runId);

  /**
   * Delete a specific workflow run. Anyone with write access to the repository can use this endpoint. If the repository is
   * private you must use an access token with the `repo` scope. GitHub Apps must have the `actions:write` permission to use
   * this endpoint.
   */
  @Path("/{owner}/{repo}/actions/runs/{run_id}")
  @DELETE
  void actions_delete_workflow_run(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("run_id") Integer runId);

  /**
   * **Warning:** This GitHub Actions usage endpoint is currently in public beta and subject to change. For more information, see "[GitHub Actions API workflow usage](https://developer.github.com/changes/2020-05-15-actions-api-workflow-usage)."
   *
   * Gets the number of billable minutes and total run time for a specific workflow run. Billable minutes only apply to workflows in private repositories that use GitHub-hosted runners. Usage is listed for each GitHub-hosted runner operating system in milliseconds. Any job re-runs are also included in the usage. The usage does not include the multiplier for macOS and Windows runners and is not rounded up to the nearest whole minute. For more information, see "[Managing billing for GitHub Actions](https://help.github.com/github/setting-up-and-managing-billing-and-payments-on-github/managing-billing-for-github-actions)".
   *
   * Anyone with read access to the repository can use this endpoint. If the repository is private you must use an access token with the `repo` scope. GitHub Apps must have the `actions:read` permission to use this endpoint.
   */
  @Path("/{owner}/{repo}/actions/runs/{run_id}/timing")
  @GET
  @Produces("application/json")
  Response actions_get_workflow_run_usage(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("run_id") Integer runId);

  /**
   * Gets your public key, which you need to encrypt secrets. You need to encrypt a secret before you can create or update secrets. Anyone with read access to the repository can use this endpoint. If the repository is private you must use an access token with the `repo` scope. GitHub Apps must have the `secrets` repository permission to use this endpoint.
   */
  @Path("/{owner}/{repo}/actions/secrets/public-key")
  @GET
  @Produces("application/json")
  Response actions_get_repo_public_key(@PathParam("owner") String owner,
      @PathParam("repo") String repo);

  /**
   * Lists artifacts for a workflow run. Anyone with read access to the repository can use this endpoint. If the repository is private you must use an access token with the `repo` scope. GitHub Apps must have the `actions:read` permission to use this endpoint.
   */
  @Path("/{owner}/{repo}/actions/runs/{run_id}/artifacts")
  @GET
  @Produces("application/json")
  Response actions_list_workflow_run_artifacts(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("run_id") Integer runId,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * Returns a token that you can pass to the `config` script. The token expires after one hour. You must authenticate
   * using an access token with the `repo` scope to use this endpoint.
   *
   * #### Example using registration token
   *  
   * Configure your self-hosted runner, replacing `TOKEN` with the registration token provided by this endpoint.
   *
   * ```
   * ./config.sh --url https://github.com/octo-org/octo-repo-artifacts --token TOKEN
   * ```
   */
  @Path("/{owner}/{repo}/actions/runners/registration-token")
  @POST
  @Produces("application/json")
  Response actions_create_registration_token_for_repo(@PathParam("owner") String owner,
      @PathParam("repo") String repo);

  /**
   * Returns a token that you can pass to remove a self-hosted runner from a repository. The token expires after one hour.
   * You must authenticate using an access token with the `repo` scope to use this endpoint.
   *
   * #### Example using remove token
   *  
   * To remove your self-hosted runner from a repository, replace TOKEN with the remove token provided by this endpoint.
   *
   * ```
   * ./config.sh remove --token TOKEN
   * ```
   */
  @Path("/{owner}/{repo}/actions/runners/remove-token")
  @POST
  @Produces("application/json")
  Response actions_create_remove_token_for_repo(@PathParam("owner") String owner,
      @PathParam("repo") String repo);

  /**
   * List all workflow runs for a workflow. You can also replace `:workflow_id` with `:workflow_file_name`. For example, you could use `main.yml`. You can use parameters to narrow the list of results. For more information about using parameters, see [Parameters](https://developer.github.com/v3/#parameters).
   *
   * Anyone with read access to the repository can use this endpoint. If the repository is private you must use an access token with the `repo` scope.
   */
  @Path("/{owner}/{repo}/actions/workflows/{workflow_id}/runs")
  @GET
  @Produces("application/json")
  Response actions_list_workflow_runs(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("workflow_id") Integer workflowId,
      @QueryParam("actor") String actor, @QueryParam("branch") String branch,
      @QueryParam("event") String event, @QueryParam("status") String status,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * Lists all workflow runs for a repository. You can use parameters to narrow the list of results. For more information about using parameters, see [Parameters](https://developer.github.com/v3/#parameters).
   *
   * Anyone with read access to the repository can use this endpoint. If the repository is private you must use an access token with the `repo` scope. GitHub Apps must have the `actions:read` permission to use this endpoint.
   */
  @Path("/{owner}/{repo}/actions/runs")
  @GET
  @Produces("application/json")
  Response actions_list_workflow_runs_for_repo(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @QueryParam("actor") String actor,
      @QueryParam("branch") String branch, @QueryParam("event") String event,
      @QueryParam("status") String status, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * **Note:** Multi-line comments on pull requests are currently in public beta and subject to change.
   *
   * Provides details for a review comment.
   *
   * **Multi-line comment summary**
   *
   * **Note:** New parameters and response fields are available for developers to preview. During the preview period, these response fields may change without advance notice. Please see the [blog post](https://developer.github.com/changes/2019-10-03-multi-line-comments) for full details.
   *
   * Use the `comfort-fade` preview header and the `line` parameter to show multi-line comment-supported fields in the response.
   *
   * If you use the `comfort-fade` preview header, your response will show:
   *
   * *   For multi-line comments, values for `start_line`, `original_start_line`, `start_side`, `line`, `original_line`, and `side`.
   * *   For single-line comments, values for `line`, `original_line`, and `side` and a `null` value for `start_line`, `original_start_line`, and `start_side`.
   *
   * If you don't use the `comfort-fade` preview header, multi-line and single-line comments will appear the same way in the response with a single `position` attribute. Your response will show:
   *
   * *   For multi-line comments, the last line of the comment range for the `position` attribute.
   * *   For single-line comments, the diff-positioned way of referencing comments for the `position` attribute. For more information, see `position` in the [input parameters](https://developer.github.com/v3/pulls/comments/#parameters-2) table.
   *
   * The `reactions` key will have the following payload where `url` can be used to construct the API location for [listing and creating](https://developer.github.com/v3/reactions) reactions.
   */
  @Path("/{owner}/{repo}/pulls/comments/{comment_id}")
  @GET
  @Produces("application/json")
  Response pulls_get_review_comment(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("comment_id") Integer commentId);

  /**
   * Deletes a review comment.
   */
  @Path("/{owner}/{repo}/pulls/comments/{comment_id}")
  @DELETE
  void pulls_delete_review_comment(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("comment_id") Integer commentId);

  /**
   * **Note:** Multi-line comments on pull requests are currently in public beta and subject to change.
   *
   * Enables you to edit a review comment.
   *
   * **Multi-line comment summary**
   *
   * **Note:** New parameters and response fields are available for developers to preview. During the preview period, these response fields may change without advance notice. Please see the [blog post](https://developer.github.com/changes/2019-10-03-multi-line-comments) for full details.
   *
   * Use the `comfort-fade` preview header and the `line` parameter to show multi-line comment-supported fields in the response.
   *
   * If you use the `comfort-fade` preview header, your response will show:
   *
   * *   For multi-line comments, values for `start_line`, `original_start_line`, `start_side`, `line`, `original_line`, and `side`.
   * *   For single-line comments, values for `line`, `original_line`, and `side` and a `null` value for `start_line`, `original_start_line`, and `start_side`.
   *
   * If you don't use the `comfort-fade` preview header, multi-line and single-line comments will appear the same way in the response with a single `position` attribute. Your response will show:
   *
   * *   For multi-line comments, the last line of the comment range for the `position` attribute.
   * *   For single-line comments, the diff-positioned way of referencing comments for the `position` attribute. For more information, see `position` in the [input parameters](https://developer.github.com/v3/pulls/comments/#parameters-2) table.
   */
  @Path("/{owner}/{repo}/pulls/comments/{comment_id}")
  @PATCH
  @Produces("application/json")
  @Consumes("application/json")
  Response pulls_update_review_comment(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("comment_id") Integer commentId, InputStream data);

  /**
   * **Note:** Multi-line comments on pull requests are currently in public beta and subject to change.
   *
   * Lists all review comments for a pull request. By default, review comments are in ascending order by ID.
   *
   * **Multi-line comment summary**
   *
   * **Note:** New parameters and response fields are available for developers to preview. During the preview period, these response fields may change without advance notice. Please see the [blog post](https://developer.github.com/changes/2019-10-03-multi-line-comments) for full details.
   *
   * Use the `comfort-fade` preview header and the `line` parameter to show multi-line comment-supported fields in the response.
   *
   * If you use the `comfort-fade` preview header, your response will show:
   *
   * *   For multi-line comments, values for `start_line`, `original_start_line`, `start_side`, `line`, `original_line`, and `side`.
   * *   For single-line comments, values for `line`, `original_line`, and `side` and a `null` value for `start_line`, `original_start_line`, and `start_side`.
   *
   * If you don't use the `comfort-fade` preview header, multi-line and single-line comments will appear the same way in the response with a single `position` attribute. Your response will show:
   *
   * *   For multi-line comments, the last line of the comment range for the `position` attribute.
   * *   For single-line comments, the diff-positioned way of referencing comments for the `position` attribute. For more information, see `position` in the [input parameters](https://developer.github.com/v3/pulls/comments/#parameters-2) table.
   *
   * The `reactions` key will have the following payload where `url` can be used to construct the API location for [listing and creating](https://developer.github.com/v3/reactions) reactions.
   */
  @Path("/{owner}/{repo}/pulls/{pull_number}/comments")
  @GET
  @Produces("application/json")
  Response pulls_list_review_comments(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("pull_number") Integer pullNumber,
      @QueryParam("sort") String sort, @QueryParam("direction") String direction,
      @QueryParam("since") String since, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * **Note:** Multi-line comments on pull requests are currently in public beta and subject to change.
   *
   * Creates a review comment in the pull request diff. To add a regular comment to a pull request timeline, see "[Create an issue comment](https://developer.github.com/v3/issues/comments/#create-an-issue-comment)." We recommend creating a review comment using `line`, `side`, and optionally `start_line` and `start_side` if your comment applies to more than one line in the pull request diff.
   *
   * You can still create a review comment using the `position` parameter. When you use `position`, the `line`, `side`, `start_line`, and `start_side` parameters are not required. For more information, see [Multi-line comment summary](https://developer.github.com/v3/pulls/comments/#multi-line-comment-summary-3).
   *
   * **Note:** The position value equals the number of lines down from the first "@@" hunk header in the file you want to add a comment. The line just below the "@@" line is position 1, the next line is position 2, and so on. The position in the diff continues to increase through lines of whitespace and additional hunks until the beginning of a new file.
   *
   * This endpoint triggers [notifications](https://help.github.com/articles/about-notifications/). Creating content too quickly using this endpoint may result in abuse rate limiting. See "[Abuse rate limits](https://developer.github.com/v3/#abuse-rate-limits)" and "[Dealing with abuse rate limits](https://developer.github.com/v3/guides/best-practices-for-integrators/#dealing-with-abuse-rate-limits)" for details.
   *
   * **Multi-line comment summary**
   *
   * **Note:** New parameters and response fields are available for developers to preview. During the preview period, these response fields may change without advance notice. Please see the [blog post](https://developer.github.com/changes/2019-10-03-multi-line-comments) for full details.
   *
   * Use the `comfort-fade` preview header and the `line` parameter to show multi-line comment-supported fields in the response.
   *
   * If you use the `comfort-fade` preview header, your response will show:
   *
   * *   For multi-line comments, values for `start_line`, `original_start_line`, `start_side`, `line`, `original_line`, and `side`.
   * *   For single-line comments, values for `line`, `original_line`, and `side` and a `null` value for `start_line`, `original_start_line`, and `start_side`.
   *
   * If you don't use the `comfort-fade` preview header, multi-line and single-line comments will appear the same way in the response with a single `position` attribute. Your response will show:
   *
   * *   For multi-line comments, the last line of the comment range for the `position` attribute.
   * *   For single-line comments, the diff-positioned way of referencing comments for the `position` attribute. For more information, see `position` in the [input parameters](https://developer.github.com/v3/pulls/comments/#parameters-2) table.
   */
  @Path("/{owner}/{repo}/pulls/{pull_number}/comments")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response pulls_create_review_comment(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("pull_number") Integer pullNumber,
      InputStream data);

  /**
   * **Note:** Multi-line comments on pull requests are currently in public beta and subject to change.
   *
   * Lists review comments for all pull requests in a repository. By default, review comments are in ascending order by ID.
   *
   * **Multi-line comment summary**
   *
   * **Note:** New parameters and response fields are available for developers to preview. During the preview period, these response fields may change without advance notice. Please see the [blog post](https://developer.github.com/changes/2019-10-03-multi-line-comments) for full details.
   *
   * Use the `comfort-fade` preview header and the `line` parameter to show multi-line comment-supported fields in the response.
   *
   * If you use the `comfort-fade` preview header, your response will show:
   *
   * *   For multi-line comments, values for `start_line`, `original_start_line`, `start_side`, `line`, `original_line`, and `side`.
   * *   For single-line comments, values for `line`, `original_line`, and `side` and a `null` value for `start_line`, `original_start_line`, and `start_side`.
   *
   * If you don't use the `comfort-fade` preview header, multi-line and single-line comments will appear the same way in the response with a single `position` attribute. Your response will show:
   *
   * *   For multi-line comments, the last line of the comment range for the `position` attribute.
   * *   For single-line comments, the diff-positioned way of referencing comments for the `position` attribute. For more information, see `position` in the [input parameters](https://developer.github.com/v3/pulls/comments/#parameters-2) table.
   *
   * The `reactions` key will have the following payload where `url` can be used to construct the API location for [listing and creating](https://developer.github.com/v3/reactions) reactions.
   */
  @Path("/{owner}/{repo}/pulls/comments")
  @GET
  @Produces("application/json")
  Response pulls_list_review_comments_for_repo(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @QueryParam("sort") String sort,
      @QueryParam("direction") String direction, @QueryParam("since") String since,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   *
   */
  @Path("/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}")
  @GET
  @Produces("application/json")
  Response pulls_get_review(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("pull_number") Integer pullNumber, @PathParam("review_id") Integer reviewId);

  /**
   * Update the review summary comment with new text.
   */
  @Path("/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}")
  @PUT
  @Produces("application/json")
  @Consumes("application/json")
  Response pulls_update_review(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("pull_number") Integer pullNumber, @PathParam("review_id") Integer reviewId,
      InputStream data);

  /**
   *
   */
  @Path("/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}")
  @DELETE
  @Produces("application/json")
  Response pulls_delete_pending_review(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("pull_number") Integer pullNumber,
      @PathParam("review_id") Integer reviewId);

  /**
   * **Note:** To dismiss a pull request review on a [protected branch](https://developer.github.com/v3/repos/branches/), you must be a repository administrator or be included in the list of people or teams who can dismiss pull request reviews.
   */
  @Path("/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/dismissals")
  @PUT
  @Produces("application/json")
  @Consumes("application/json")
  Response pulls_dismiss_review(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("pull_number") Integer pullNumber, @PathParam("review_id") Integer reviewId,
      InputStream data);

  /**
   *
   */
  @Path("/{owner}/{repo}/pulls/{pull_number}/requested_reviewers")
  @GET
  @Produces("application/json")
  Response pulls_list_requested_reviewers(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("pull_number") Integer pullNumber,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * This endpoint triggers [notifications](https://help.github.com/articles/about-notifications/). Creating content too quickly using this endpoint may result in abuse rate limiting. See "[Abuse rate limits](https://developer.github.com/v3/#abuse-rate-limits)" and "[Dealing with abuse rate limits](https://developer.github.com/v3/guides/best-practices-for-integrators/#dealing-with-abuse-rate-limits)" for details.
   */
  @Path("/{owner}/{repo}/pulls/{pull_number}/requested_reviewers")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response pulls_request_reviewers(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("pull_number") Integer pullNumber, InputStream data);

  /**
   *
   */
  @Path("/{owner}/{repo}/pulls/{pull_number}/requested_reviewers")
  @DELETE
  @Consumes("application/json")
  void pulls_remove_requested_reviewers(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("pull_number") Integer pullNumber,
      InputStream data);

  /**
   * Draft pull requests are available in public repositories with GitHub Free and GitHub Free for organizations, GitHub Pro, and legacy per-repository billing plans, and in public and private repositories with GitHub Team and GitHub Enterprise Cloud. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   *
   * Lists details of a pull request by providing its number.
   *
   * When you get, [create](https://developer.github.com/v3/pulls/#create-a-pull-request), or [edit](https://developer.github.com/v3/pulls/#update-a-pull-request) a pull request, GitHub creates a merge commit to test whether the pull request can be automatically merged into the base branch. This test commit is not added to the base branch or the head branch. You can review the status of the test commit using the `mergeable` key. For more information, see "[Checking mergeability of pull requests](https://developer.github.com/v3/git/#checking-mergeability-of-pull-requests)".
   *
   * The value of the `mergeable` attribute can be `true`, `false`, or `null`. If the value is `null`, then GitHub has started a background job to compute the mergeability. After giving the job time to complete, resubmit the request. When the job finishes, you will see a non-`null` value for the `mergeable` attribute in the response. If `mergeable` is `true`, then `merge_commit_sha` will be the SHA of the _test_ merge commit.
   *
   * The value of the `merge_commit_sha` attribute changes depending on the state of the pull request. Before merging a pull request, the `merge_commit_sha` attribute holds the SHA of the _test_ merge commit. After merging a pull request, the `merge_commit_sha` attribute changes depending on how you merged the pull request:
   *
   * *   If merged as a [merge commit](https://help.github.com/articles/about-merge-methods-on-github/), `merge_commit_sha` represents the SHA of the merge commit.
   * *   If merged via a [squash](https://help.github.com/articles/about-merge-methods-on-github/#squashing-your-merge-commits), `merge_commit_sha` represents the SHA of the squashed commit on the base branch.
   * *   If [rebased](https://help.github.com/articles/about-merge-methods-on-github/#rebasing-and-merging-your-commits), `merge_commit_sha` represents the commit that the base branch was updated to.
   *
   * Pass the appropriate [media type](https://developer.github.com/v3/media/#commits-commit-comparison-and-pull-requests) to fetch diff and patch formats.
   */
  @Path("/{owner}/{repo}/pulls/{pull_number}")
  @GET
  @Produces("application/json")
  Response pulls_get(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("pull_number") Integer pullNumber);

  /**
   * Draft pull requests are available in public repositories with GitHub Free and GitHub Free for organizations, GitHub Pro, and legacy per-repository billing plans, and in public and private repositories with GitHub Team and GitHub Enterprise Cloud. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   *
   * To open or update a pull request in a public repository, you must have write access to the head or the source branch. For organization-owned repositories, you must be a member of the organization that owns the repository to open or update a pull request.
   */
  @Path("/{owner}/{repo}/pulls/{pull_number}")
  @PATCH
  @Produces("application/json")
  @Consumes("application/json")
  Response pulls_update(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("pull_number") Integer pullNumber, InputStream data);

  /**
   * The list of reviews returns in chronological order.
   */
  @Path("/{owner}/{repo}/pulls/{pull_number}/reviews")
  @GET
  @Produces("application/json")
  Response pulls_list_reviews(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("pull_number") Integer pullNumber, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * This endpoint triggers [notifications](https://help.github.com/articles/about-notifications/). Creating content too quickly using this endpoint may result in abuse rate limiting. See "[Abuse rate limits](https://developer.github.com/v3/#abuse-rate-limits)" and "[Dealing with abuse rate limits](https://developer.github.com/v3/guides/best-practices-for-integrators/#dealing-with-abuse-rate-limits)" for details.
   *
   * Pull request reviews created in the `PENDING` state do not include the `submitted_at` property in the response.
   *
   * **Note:** To comment on a specific line in a file, you need to first determine the _position_ of that line in the diff. The GitHub REST API v3 offers the `application/vnd.github.v3.diff` [media type](https://developer.github.com/v3/media/#commits-commit-comparison-and-pull-requests). To see a pull request diff, add this media type to the `Accept` header of a call to the [single pull request](https://developer.github.com/v3/pulls/#get-a-pull-request) endpoint.
   *
   * The `position` value equals the number of lines down from the first "@@" hunk header in the file you want to add a comment. The line just below the "@@" line is position 1, the next line is position 2, and so on. The position in the diff continues to increase through lines of whitespace and additional hunks until the beginning of a new file.
   */
  @Path("/{owner}/{repo}/pulls/{pull_number}/reviews")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response pulls_create_review(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("pull_number") Integer pullNumber, InputStream data);

  /**
   *
   */
  @Path("/{owner}/{repo}/pulls/{pull_number}/merge")
  @GET
  void pulls_check_if_merged(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("pull_number") Integer pullNumber);

  /**
   * This endpoint triggers [notifications](https://help.github.com/articles/about-notifications/). Creating content too quickly using this endpoint may result in abuse rate limiting. See "[Abuse rate limits](https://developer.github.com/v3/#abuse-rate-limits)" and "[Dealing with abuse rate limits](https://developer.github.com/v3/guides/best-practices-for-integrators/#dealing-with-abuse-rate-limits)" for details.
   */
  @Path("/{owner}/{repo}/pulls/{pull_number}/merge")
  @PUT
  @Produces("application/json")
  @Consumes("application/json")
  Response pulls_merge(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("pull_number") Integer pullNumber, InputStream data);

  /**
   * Updates the pull request branch with the latest upstream changes by merging HEAD from the base branch into the pull request branch.
   */
  @Path("/{owner}/{repo}/pulls/{pull_number}/update-branch")
  @PUT
  @Produces("application/json")
  @Consumes("application/json")
  Response pulls_update_branch(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("pull_number") Integer pullNumber, InputStream data);

  /**
   * **Note:** Responses include a maximum of 3000 files. The paginated response returns 30 files per page by default.
   */
  @Path("/{owner}/{repo}/pulls/{pull_number}/files")
  @GET
  @Produces("application/json")
  Response pulls_list_files(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("pull_number") Integer pullNumber, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Draft pull requests are available in public repositories with GitHub Free and GitHub Free for organizations, GitHub Pro, and legacy per-repository billing plans, and in public and private repositories with GitHub Team and GitHub Enterprise Cloud. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   */
  @Path("/{owner}/{repo}/pulls")
  @GET
  @Produces("application/json")
  Response pulls_list(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @QueryParam("state") String state, @QueryParam("head") String head,
      @QueryParam("base") String base, @QueryParam("sort") String sort,
      @QueryParam("direction") String direction, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Draft pull requests are available in public repositories with GitHub Free and GitHub Free for organizations, GitHub Pro, and legacy per-repository billing plans, and in public and private repositories with GitHub Team and GitHub Enterprise Cloud. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   *
   * To open or update a pull request in a public repository, you must have write access to the head or the source branch. For organization-owned repositories, you must be a member of the organization that owns the repository to open or update a pull request.
   *
   * You can create a new pull request.
   *
   * This endpoint triggers [notifications](https://help.github.com/articles/about-notifications/). Creating content too quickly using this endpoint may result in abuse rate limiting. See "[Abuse rate limits](https://developer.github.com/v3/#abuse-rate-limits)" and "[Dealing with abuse rate limits](https://developer.github.com/v3/guides/best-practices-for-integrators/#dealing-with-abuse-rate-limits)" for details.
   */
  @Path("/{owner}/{repo}/pulls")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response pulls_create(@PathParam("owner") String owner, @PathParam("repo") String repo,
      InputStream data);

  /**
   * Creates a reply to a review comment for a pull request. For the `comment_id`, provide the ID of the review comment you are replying to. This must be the ID of a _top-level review comment_, not a reply to that comment. Replies to replies are not supported.
   *
   * This endpoint triggers [notifications](https://help.github.com/articles/about-notifications/). Creating content too quickly using this endpoint may result in abuse rate limiting. See "[Abuse rate limits](https://developer.github.com/v3/#abuse-rate-limits)" and "[Dealing with abuse rate limits](https://developer.github.com/v3/guides/best-practices-for-integrators/#dealing-with-abuse-rate-limits)" for details.
   */
  @Path("/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response pulls_create_reply_for_review_comment(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("pull_number") Integer pullNumber,
      @PathParam("comment_id") Integer commentId, InputStream data);

  /**
   * Lists a maximum of 250 commits for a pull request. To receive a complete commit list for pull requests with more than 250 commits, use the [List commits](https://developer.github.com/v3/repos/commits/#list-commits) endpoint.
   */
  @Path("/{owner}/{repo}/pulls/{pull_number}/commits")
  @GET
  @Produces("application/json")
  Response pulls_list_commits(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("pull_number") Integer pullNumber, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   *
   */
  @Path("/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/events")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response pulls_submit_review(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("pull_number") Integer pullNumber, @PathParam("review_id") Integer reviewId,
      InputStream data);

  /**
   * List comments for a specific pull request review.
   */
  @Path("/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments")
  @GET
  @Produces("application/json")
  Response pulls_list_comments_for_review(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("pull_number") Integer pullNumber,
      @PathParam("review_id") Integer reviewId, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Lists all open code scanning alerts for the default branch (usually `master`) and protected branches in a repository. You must use an access token with the `security_events` scope to use this endpoint. GitHub Apps must have the `security_events` read permission to use this endpoint.
   */
  @Path("/{owner}/{repo}/code-scanning/alerts")
  @GET
  @Produces("application/json")
  Response code_scanning_list_alerts_for_repo(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @QueryParam("state") String state,
      @QueryParam("ref") String ref);

  /**
   * Gets a single code scanning alert. You must use an access token with the `security_events` scope to use this endpoint. GitHub Apps must have the `security_events` read permission to use this endpoint.
   *
   * The security `alert_id` is found at the end of the security alert's URL. For example, the security alert ID for `https://github.com/Octo-org/octo-repo/security/code-scanning/88` is `88`.
   */
  @Path("/{owner}/{repo}/code-scanning/alerts/{alert_id}")
  @GET
  @Produces("application/json")
  Response code_scanning_get_alert(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("alert_id") Integer alertId);

  /**
   * Users with push access can lock an issue or pull request's conversation.
   *
   * Note that, if you choose not to pass any parameters, you'll need to set `Content-Length` to zero when calling out to this endpoint. For more information, see "[HTTP verbs](https://developer.github.com/v3/#http-verbs)."
   */
  @Path("/{owner}/{repo}/issues/{issue_number}/lock")
  @PUT
  @Consumes("application/json")
  void issues_lock(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("issue_number") Integer issueNumber, InputStream data);

  /**
   * Users with push access can unlock an issue's conversation.
   */
  @Path("/{owner}/{repo}/issues/{issue_number}/lock")
  @DELETE
  void issues_unlock(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("issue_number") Integer issueNumber);

  /**
   *
   */
  @Path("/{owner}/{repo}/milestones/{milestone_number}")
  @GET
  @Produces("application/json")
  Response issues_get_milestone(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("milestone_number") Integer milestoneNumber);

  /**
   *
   */
  @Path("/{owner}/{repo}/milestones/{milestone_number}")
  @DELETE
  void issues_delete_milestone(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("milestone_number") Integer milestoneNumber);

  /**
   *
   */
  @Path("/{owner}/{repo}/milestones/{milestone_number}")
  @PATCH
  @Produces("application/json")
  @Consumes("application/json")
  Response issues_update_milestone(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("milestone_number") Integer milestoneNumber, InputStream data);

  /**
   * Removes the specified label from the issue, and returns the remaining labels on the issue. This endpoint returns a `404 Not Found` status if the label does not exist.
   */
  @Path("/{owner}/{repo}/issues/{issue_number}/labels/{name}")
  @DELETE
  @Produces("application/json")
  Response issues_remove_label(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("issue_number") Integer issueNumber, @PathParam("name") String name);

  /**
   *
   */
  @Path("/{owner}/{repo}/milestones")
  @GET
  @Produces("application/json")
  Response issues_list_milestones(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @QueryParam("state") String state, @QueryParam("sort") String sort,
      @QueryParam("direction") String direction, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   *
   */
  @Path("/{owner}/{repo}/milestones")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response issues_create_milestone(@PathParam("owner") String owner, @PathParam("repo") String repo,
      InputStream data);

  /**
   *
   */
  @Path("/{owner}/{repo}/issues/comments/{comment_id}")
  @GET
  @Produces("application/json")
  Response issues_get_comment(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("comment_id") Integer commentId);

  /**
   *
   */
  @Path("/{owner}/{repo}/issues/comments/{comment_id}")
  @DELETE
  void issues_delete_comment(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("comment_id") Integer commentId);

  /**
   *
   */
  @Path("/{owner}/{repo}/issues/comments/{comment_id}")
  @PATCH
  @Produces("application/json")
  @Consumes("application/json")
  Response issues_update_comment(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("comment_id") Integer commentId, InputStream data);

  /**
   * The API returns a [`301 Moved Permanently` status](https://developer.github.com/v3/#http-redirects) if the issue was
   * [transferred](https://help.github.com/articles/transferring-an-issue-to-another-repository/) to another repository. If
   * the issue was transferred to or deleted from a repository where the authenticated user lacks read access, the API
   * returns a `404 Not Found` status. If the issue was deleted from a repository where the authenticated user has read
   * access, the API returns a `410 Gone` status. To receive webhook events for transferred and deleted issues, subscribe
   * to the [`issues`](https://developer.github.com/webhooks/event-payloads/#issues) webhook.
   *
   * **Note**: GitHub's REST API v3 considers every pull request an issue, but not every issue is a pull request. For this
   * reason, "Issues" endpoints may return both issues and pull requests in the response. You can identify pull requests by
   * the `pull_request` key. Be aware that the `id` of a pull request returned from "Issues" endpoints will be an _issue id_. To find out the pull
   * request id, use the "[List pull requests](https://developer.github.com/v3/pulls/#list-pull-requests)" endpoint.
   */
  @Path("/{owner}/{repo}/issues/{issue_number}")
  @GET
  @Produces("application/json")
  Response issues_get(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("issue_number") Integer issueNumber);

  /**
   * Issue owners and users with push access can edit an issue.
   */
  @Path("/{owner}/{repo}/issues/{issue_number}")
  @PATCH
  @Produces("application/json")
  @Consumes("application/json")
  Response issues_update(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("issue_number") Integer issueNumber, InputStream data);

  /**
   *
   */
  @Path("/{owner}/{repo}/labels/{name}")
  @GET
  @Produces("application/json")
  Response issues_get_label(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("name") String name);

  /**
   *
   */
  @Path("/{owner}/{repo}/labels/{name}")
  @DELETE
  void issues_delete_label(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("name") String name);

  /**
   *
   */
  @Path("/{owner}/{repo}/labels/{name}")
  @PATCH
  @Produces("application/json")
  @Consumes("application/json")
  Response issues_update_label(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("name") String name, InputStream data);

  /**
   *
   */
  @Path("/{owner}/{repo}/labels")
  @GET
  @Produces("application/json")
  Response issues_list_labels_for_repo(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   *
   */
  @Path("/{owner}/{repo}/labels")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response issues_create_label(@PathParam("owner") String owner, @PathParam("repo") String repo,
      InputStream data);

  /**
   *
   */
  @Path("/{owner}/{repo}/issues/{issue_number}/timeline")
  @GET
  @Produces("application/json")
  Response issues_list_events_for_timeline(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("issue_number") Integer issueNumber,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * Lists the [available assignees](https://help.github.com/articles/assigning-issues-and-pull-requests-to-other-github-users/) for issues in a repository.
   */
  @Path("/{owner}/{repo}/assignees")
  @GET
  @Produces("application/json")
  Response issues_list_assignees(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   *
   */
  @Path("/{owner}/{repo}/issues/{issue_number}/labels")
  @GET
  @Produces("application/json")
  Response issues_list_labels_on_issue(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("issue_number") Integer issueNumber,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * Removes any previous labels and sets the new labels for an issue.
   */
  @Path("/{owner}/{repo}/issues/{issue_number}/labels")
  @PUT
  @Produces("application/json")
  @Consumes("application/json")
  Response issues_set_labels(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("issue_number") Integer issueNumber, InputStream data);

  /**
   *
   */
  @Path("/{owner}/{repo}/issues/{issue_number}/labels")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response issues_add_labels(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("issue_number") Integer issueNumber, InputStream data);

  /**
   *
   */
  @Path("/{owner}/{repo}/issues/{issue_number}/labels")
  @DELETE
  void issues_remove_all_labels(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("issue_number") Integer issueNumber);

  /**
   *
   */
  @Path("/{owner}/{repo}/issues/{issue_number}/events")
  @GET
  @Produces("application/json")
  Response issues_list_events(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("issue_number") Integer issueNumber, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * List issues in a repository.
   *
   * **Note**: GitHub's REST API v3 considers every pull request an issue, but not every issue is a pull request. For this
   * reason, "Issues" endpoints may return both issues and pull requests in the response. You can identify pull requests by
   * the `pull_request` key. Be aware that the `id` of a pull request returned from "Issues" endpoints will be an _issue id_. To find out the pull
   * request id, use the "[List pull requests](https://developer.github.com/v3/pulls/#list-pull-requests)" endpoint.
   */
  @Path("/{owner}/{repo}/issues")
  @GET
  @Produces("application/json")
  Response issues_list_for_repo(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @QueryParam("milestone") String milestone, @QueryParam("state") String state,
      @QueryParam("assignee") String assignee, @QueryParam("creator") String creator,
      @QueryParam("mentioned") String mentioned, @QueryParam("labels") String labels,
      @QueryParam("sort") String sort, @QueryParam("direction") String direction,
      @QueryParam("since") String since, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Any user with pull access to a repository can create an issue. If [issues are disabled in the repository](https://help.github.com/articles/disabling-issues/), the API returns a `410 Gone` status.
   *
   * This endpoint triggers [notifications](https://help.github.com/articles/about-notifications/). Creating content too quickly using this endpoint may result in abuse rate limiting. See "[Abuse rate limits](https://developer.github.com/v3/#abuse-rate-limits)" and "[Dealing with abuse rate limits](https://developer.github.com/v3/guides/best-practices-for-integrators/#dealing-with-abuse-rate-limits)" for details.
   */
  @Path("/{owner}/{repo}/issues")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response issues_create(@PathParam("owner") String owner, @PathParam("repo") String repo,
      InputStream data);

  /**
   * Issue Comments are ordered by ascending ID.
   */
  @Path("/{owner}/{repo}/issues/{issue_number}/comments")
  @GET
  @Produces("application/json")
  Response issues_list_comments(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("issue_number") Integer issueNumber, @QueryParam("since") String since,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * This endpoint triggers [notifications](https://help.github.com/articles/about-notifications/). Creating content too quickly using this endpoint may result in abuse rate limiting. See "[Abuse rate limits](https://developer.github.com/v3/#abuse-rate-limits)" and "[Dealing with abuse rate limits](https://developer.github.com/v3/guides/best-practices-for-integrators/#dealing-with-abuse-rate-limits)" for details.
   */
  @Path("/{owner}/{repo}/issues/{issue_number}/comments")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response issues_create_comment(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("issue_number") Integer issueNumber, InputStream data);

  /**
   * Adds up to 10 assignees to an issue. Users already assigned to an issue are not replaced.
   */
  @Path("/{owner}/{repo}/issues/{issue_number}/assignees")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response issues_add_assignees(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("issue_number") Integer issueNumber, InputStream data);

  /**
   * Removes one or more assignees from an issue.
   */
  @Path("/{owner}/{repo}/issues/{issue_number}/assignees")
  @DELETE
  @Produces("application/json")
  @Consumes("application/json")
  Response issues_remove_assignees(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("issue_number") Integer issueNumber, InputStream data);

  /**
   *
   */
  @Path("/{owner}/{repo}/issues/events")
  @GET
  @Produces("application/json")
  Response issues_list_events_for_repo(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Checks if a user has permission to be assigned to an issue in this repository.
   *
   * If the `assignee` can be assigned to issues in the repository, a `204` header with no content is returned.
   *
   * Otherwise a `404` status code is returned.
   */
  @Path("/{owner}/{repo}/assignees/{assignee}")
  @GET
  void issues_check_user_can_be_assigned(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("assignee") String assignee);

  /**
   *
   */
  @Path("/{owner}/{repo}/milestones/{milestone_number}/labels")
  @GET
  @Produces("application/json")
  Response issues_list_labels_for_milestone(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @PathParam("milestone_number") Integer milestoneNumber,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   *
   */
  @Path("/{owner}/{repo}/issues/events/{event_id}")
  @GET
  @Produces("application/json")
  Response issues_get_event(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("event_id") Integer eventId);

  /**
   * By default, Issue Comments are ordered by ascending ID.
   */
  @Path("/{owner}/{repo}/issues/comments")
  @GET
  @Produces("application/json")
  Response issues_list_comments_for_repo(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @QueryParam("sort") String sort,
      @QueryParam("direction") String direction, @QueryParam("since") String since,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * Enables an authenticated GitHub App to find the repository's installation information. The installation's account type will be either an organization or a user account, depending which account the repository belongs to.
   *
   * You must use a [JWT](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-a-github-app) to access this endpoint.
   */
  @Path("/{owner}/{repo}/installation")
  @GET
  @Produces("application/json")
  Response apps_get_repo_installation(@PathParam("owner") String owner,
      @PathParam("repo") String repo);

  /**
   * Returns a single tree using the SHA1 value for that tree.
   *
   * If `truncated` is `true` in the response then the number of items in the `tree` array exceeded our maximum limit. If you need to fetch more items, use the non-recursive method of fetching trees, and fetch one sub-tree at a time.
   */
  @Path("/{owner}/{repo}/git/trees/{tree_sha}")
  @GET
  @Produces("application/json")
  Response git_get_tree(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("tree_sha") String treeSha, @QueryParam("recursive") String recursive);

  /**
   * Returns an array of references from your Git database that match the supplied name. The `:ref` in the URL must be formatted as `heads/<branch name>` for branches and `tags/<tag name>` for tags. If the `:ref` doesn't exist in the repository, but existing refs start with `:ref`, they will be returned as an array.
   *
   * When you use this endpoint without providing a `:ref`, it will return an array of all the references from your Git database, including notes and stashes if they exist on the server. Anything in the namespace is returned, not just `heads` and `tags`.
   *
   * **Note:** You need to explicitly [request a pull request](https://developer.github.com/v3/pulls/#get-a-pull-request) to trigger a test merge commit, which checks the mergeability of pull requests. For more information, see "[Checking mergeability of pull requests](https://developer.github.com/v3/git/#checking-mergeability-of-pull-requests)".
   *
   * If you request matching references for a branch named `feature` but the branch `feature` doesn't exist, the response can still include other matching head refs that start with the word `feature`, such as `featureA` and `featureB`.
   */
  @Path("/{owner}/{repo}/git/matching-refs/{ref}")
  @GET
  @Produces("application/json")
  Response git_list_matching_refs(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("ref") String ref, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   *
   */
  @Path("/{owner}/{repo}/git/refs/{ref}")
  @DELETE
  void git_delete_ref(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("ref") String ref);

  /**
   *
   */
  @Path("/{owner}/{repo}/git/refs/{ref}")
  @PATCH
  @Produces("application/json")
  @Consumes("application/json")
  Response git_update_ref(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("ref") String ref, InputStream data);

  /**
   * Creates a new Git [commit object](https://git-scm.com/book/en/v1/Git-Internals-Git-Objects#Commit-Objects).
   *
   * In this example, the payload of the signature would be:
   *
   *
   *
   * **Signature verification object**
   *
   * The response will include a `verification` object that describes the result of verifying the commit's signature. The following fields are included in the `verification` object:
   *
   * These are the possible values for `reason` in the `verification` object:
   *
   * | Value                    | Description                                                                                                                       |
   * | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
   * | `expired_key`            | The key that made the signature is expired.                                                                                       |
   * | `not_signing_key`        | The "signing" flag is not among the usage flags in the GPG key that made the signature.                                           |
   * | `gpgverify_error`        | There was an error communicating with the signature verification service.                                                         |
   * | `gpgverify_unavailable`  | The signature verification service is currently unavailable.                                                                      |
   * | `unsigned`               | The object does not include a signature.                                                                                          |
   * | `unknown_signature_type` | A non-PGP signature was found in the commit.                                                                                      |
   * | `no_user`                | No user was associated with the `committer` email address in the commit.                                                          |
   * | `unverified_email`       | The `committer` email address in the commit was associated with a user, but the email address is not verified on her/his account. |
   * | `bad_email`              | The `committer` email address in the commit is not included in the identities of the PGP key that made the signature.             |
   * | `unknown_key`            | The key that made the signature has not been registered with any user's account.                                                  |
   * | `malformed_signature`    | There was an error parsing the signature.                                                                                         |
   * | `invalid`                | The signature could not be cryptographically verified using the key whose key-id was found in the signature.                      |
   * | `valid`                  | None of the above errors applied, so the signature is considered to be verified.                                                  |
   */
  @Path("/{owner}/{repo}/git/commits")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response git_create_commit(@PathParam("owner") String owner, @PathParam("repo") String repo,
      InputStream data);

  /**
   * **Signature verification object**
   *
   * The response will include a `verification` object that describes the result of verifying the commit's signature. The following fields are included in the `verification` object:
   *
   * These are the possible values for `reason` in the `verification` object:
   *
   * | Value                    | Description                                                                                                                       |
   * | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
   * | `expired_key`            | The key that made the signature is expired.                                                                                       |
   * | `not_signing_key`        | The "signing" flag is not among the usage flags in the GPG key that made the signature.                                           |
   * | `gpgverify_error`        | There was an error communicating with the signature verification service.                                                         |
   * | `gpgverify_unavailable`  | The signature verification service is currently unavailable.                                                                      |
   * | `unsigned`               | The object does not include a signature.                                                                                          |
   * | `unknown_signature_type` | A non-PGP signature was found in the commit.                                                                                      |
   * | `no_user`                | No user was associated with the `committer` email address in the commit.                                                          |
   * | `unverified_email`       | The `committer` email address in the commit was associated with a user, but the email address is not verified on her/his account. |
   * | `bad_email`              | The `committer` email address in the commit is not included in the identities of the PGP key that made the signature.             |
   * | `unknown_key`            | The key that made the signature has not been registered with any user's account.                                                  |
   * | `malformed_signature`    | There was an error parsing the signature.                                                                                         |
   * | `invalid`                | The signature could not be cryptographically verified using the key whose key-id was found in the signature.                      |
   * | `valid`                  | None of the above errors applied, so the signature is considered to be verified.                                                  |
   */
  @Path("/{owner}/{repo}/git/tags/{tag_sha}")
  @GET
  @Produces("application/json")
  Response git_get_tag(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("tag_sha") String tagSha);

  /**
   * The tree creation API accepts nested entries. If you specify both a tree and a nested path modifying that tree, this endpoint will overwrite the contents of the tree with the new path contents, and create a new tree structure.
   *
   * If you use this endpoint to add, delete, or modify the file contents in a tree, you will need to commit the tree and then update a branch to point to the commit. For more information see "[Create a commit](https://developer.github.com/v3/git/commits/#create-a-commit)" and "[Update a reference](https://developer.github.com/v3/git/refs/#update-a-reference)."
   */
  @Path("/{owner}/{repo}/git/trees")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response git_create_tree(@PathParam("owner") String owner, @PathParam("repo") String repo,
      InputStream data);

  /**
   * Creates a reference for your repository. You are unable to create new references for empty repositories, even if the commit SHA-1 hash used exists. Empty repositories are repositories without branches.
   */
  @Path("/{owner}/{repo}/git/refs")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response git_create_ref(@PathParam("owner") String owner, @PathParam("repo") String repo,
      InputStream data);

  /**
   * Note that creating a tag object does not create the reference that makes a tag in Git. If you want to create an annotated tag in Git, you have to do this call to create the tag object, and then [create](https://developer.github.com/v3/git/refs/#create-a-reference) the `refs/tags/[tag]` reference. If you want to create a lightweight tag, you only have to [create](https://developer.github.com/v3/git/refs/#create-a-reference) the tag reference - this call would be unnecessary.
   *
   * **Signature verification object**
   *
   * The response will include a `verification` object that describes the result of verifying the commit's signature. The following fields are included in the `verification` object:
   *
   * These are the possible values for `reason` in the `verification` object:
   *
   * | Value                    | Description                                                                                                                       |
   * | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
   * | `expired_key`            | The key that made the signature is expired.                                                                                       |
   * | `not_signing_key`        | The "signing" flag is not among the usage flags in the GPG key that made the signature.                                           |
   * | `gpgverify_error`        | There was an error communicating with the signature verification service.                                                         |
   * | `gpgverify_unavailable`  | The signature verification service is currently unavailable.                                                                      |
   * | `unsigned`               | The object does not include a signature.                                                                                          |
   * | `unknown_signature_type` | A non-PGP signature was found in the commit.                                                                                      |
   * | `no_user`                | No user was associated with the `committer` email address in the commit.                                                          |
   * | `unverified_email`       | The `committer` email address in the commit was associated with a user, but the email address is not verified on her/his account. |
   * | `bad_email`              | The `committer` email address in the commit is not included in the identities of the PGP key that made the signature.             |
   * | `unknown_key`            | The key that made the signature has not been registered with any user's account.                                                  |
   * | `malformed_signature`    | There was an error parsing the signature.                                                                                         |
   * | `invalid`                | The signature could not be cryptographically verified using the key whose key-id was found in the signature.                      |
   * | `valid`                  | None of the above errors applied, so the signature is considered to be verified.                                                  |
   */
  @Path("/{owner}/{repo}/git/tags")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response git_create_tag(@PathParam("owner") String owner, @PathParam("repo") String repo,
      InputStream data);

  /**
   * Returns a single reference from your Git database. The `:ref` in the URL must be formatted as `heads/<branch name>` for branches and `tags/<tag name>` for tags. If the `:ref` doesn't match an existing ref, a `404` is returned.
   *
   * **Note:** You need to explicitly [request a pull request](https://developer.github.com/v3/pulls/#get-a-pull-request) to trigger a test merge commit, which checks the mergeability of pull requests. For more information, see "[Checking mergeability of pull requests](https://developer.github.com/v3/git/#checking-mergeability-of-pull-requests)".
   */
  @Path("/{owner}/{repo}/git/ref/{ref}")
  @GET
  @Produces("application/json")
  Response git_get_ref(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("ref") String ref);

  /**
   *
   */
  @Path("/{owner}/{repo}/git/blobs")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response git_create_blob(@PathParam("owner") String owner, @PathParam("repo") String repo,
      InputStream data);

  /**
   * The `content` in the response will always be Base64 encoded.
   *
   * _Note_: This API supports blobs up to 100 megabytes in size.
   */
  @Path("/{owner}/{repo}/git/blobs/{file_sha}")
  @GET
  @Produces("application/json")
  Response git_get_blob(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("file_sha") String fileSha);

  /**
   * Gets a Git [commit object](https://git-scm.com/book/en/v1/Git-Internals-Git-Objects#Commit-Objects).
   *
   * **Signature verification object**
   *
   * The response will include a `verification` object that describes the result of verifying the commit's signature. The following fields are included in the `verification` object:
   *
   * These are the possible values for `reason` in the `verification` object:
   *
   * | Value                    | Description                                                                                                                       |
   * | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
   * | `expired_key`            | The key that made the signature is expired.                                                                                       |
   * | `not_signing_key`        | The "signing" flag is not among the usage flags in the GPG key that made the signature.                                           |
   * | `gpgverify_error`        | There was an error communicating with the signature verification service.                                                         |
   * | `gpgverify_unavailable`  | The signature verification service is currently unavailable.                                                                      |
   * | `unsigned`               | The object does not include a signature.                                                                                          |
   * | `unknown_signature_type` | A non-PGP signature was found in the commit.                                                                                      |
   * | `no_user`                | No user was associated with the `committer` email address in the commit.                                                          |
   * | `unverified_email`       | The `committer` email address in the commit was associated with a user, but the email address is not verified on her/his account. |
   * | `bad_email`              | The `committer` email address in the commit is not included in the identities of the PGP key that made the signature.             |
   * | `unknown_key`            | The key that made the signature has not been registered with any user's account.                                                  |
   * | `malformed_signature`    | There was an error parsing the signature.                                                                                         |
   * | `invalid`                | The signature could not be cryptographically verified using the key whose key-id was found in the signature.                      |
   * | `valid`                  | None of the above errors applied, so the signature is considered to be verified.                                                  |
   */
  @Path("/{owner}/{repo}/git/commits/{commit_sha}")
  @GET
  @Produces("application/json")
  Response git_get_commit(@PathParam("owner") String owner, @PathParam("repo") String repo,
      @PathParam("commit_sha") String commitSha);
}
