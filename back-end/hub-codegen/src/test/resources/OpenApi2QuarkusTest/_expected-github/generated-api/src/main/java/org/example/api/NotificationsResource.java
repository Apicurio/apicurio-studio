package org.example.api;

import java.io.InputStream;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PATCH;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/notifications")
public interface NotificationsResource {
  /**
   *
   */
  @Path("/threads/{thread_id}")
  @GET
  @Produces("application/json")
  Response activity_get_thread(@PathParam("thread_id") Integer threadId);

  /**
   *
   */
  @Path("/threads/{thread_id}")
  @PATCH
  void activity_mark_thread_as_read(@PathParam("thread_id") Integer threadId);

  /**
   * This checks to see if the current user is subscribed to a thread. You can also [get a repository subscription](https://developer.github.com/v3/activity/watching/#get-a-repository-subscription).
   *
   * Note that subscriptions are only generated if a user is participating in a conversation--for example, they've replied to the thread, were **@mentioned**, or manually subscribe to a thread.
   */
  @Path("/threads/{thread_id}/subscription")
  @GET
  @Produces("application/json")
  Response activity_get_thread_subscription_for_authenticated_user(
      @PathParam("thread_id") Integer threadId);

  /**
   * If you are watching a repository, you receive notifications for all threads by default. Use this endpoint to ignore future notifications for threads until you comment on the thread or get an **@mention**.
   *
   * You can also use this endpoint to subscribe to threads that you are currently not receiving notifications for or to subscribed to threads that you have previously ignored.
   *
   * Unsubscribing from a conversation in a repository that you are not watching is functionally equivalent to the [Delete a thread subscription](https://developer.github.com/v3/activity/notifications/#delete-a-thread-subscription) endpoint.
   */
  @Path("/threads/{thread_id}/subscription")
  @PUT
  @Produces("application/json")
  @Consumes("application/json")
  Response activity_set_thread_subscription(@PathParam("thread_id") Integer threadId,
      InputStream data);

  /**
   * Mutes all future notifications for a conversation until you comment on the thread or get an **@mention**. If you are watching the repository of the thread, you will still receive notifications. To ignore future notifications for a repository you are watching, use the [Set a thread subscription](https://developer.github.com/v3/activity/notifications/#set-a-thread-subscription) endpoint and set `ignore` to `true`.
   */
  @Path("/threads/{thread_id}/subscription")
  @DELETE
  void activity_delete_thread_subscription(@PathParam("thread_id") Integer threadId);

  /**
   * List all notifications for the current user, sorted by most recently updated.
   */
  @GET
  @Produces("application/json")
  Response activity_list_notifications_for_authenticated_user(@QueryParam("all") Boolean all,
      @QueryParam("participating") Boolean participating, @QueryParam("since") String since,
      @QueryParam("before") String before, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Marks all notifications as "read" removes it from the [default view on GitHub](https://github.com/notifications). If the number of notifications is too large to complete in one request, you will receive a `202 Accepted` status and GitHub will run an asynchronous process to mark notifications as "read." To check whether any "unread" notifications remain, you can use the [List notifications for the authenticated user](https://developer.github.com/v3/activity/notifications/#list-notifications-for-the-authenticated-user) endpoint and pass the query parameter `all=false`.
   */
  @PUT
  @Produces("application/json")
  @Consumes("application/json")
  Response activity_mark_notifications_as_read(InputStream data);
}
