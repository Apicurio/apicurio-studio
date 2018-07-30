import io.gatling.core.Predef._
import io.gatling.http.Predef._
import scala.concurrent.duration._
import scala.util.Random
import io.gatling.core.body.ElFileBody

abstract class ApicurioSimulation extends Simulation {
  
  var host = "http://localhost:8080/api-hub";
  var kc_url = "https://studio-auth.apicur.io/auth";
  var kc_realm = "apicurio-local";
  var kc_clientId = "gatling";
  var kc_clientSecret = "28b38cc7-40c8-42ce-804e-a8c86502ec57";
  var kc_username = "user1@example.com";
  var kc_password = "g4tl1ng!";
  
}

class SimpleSimulation extends ApicurioSimulation {

  val httpConf = http
    .baseURL(host)
    .acceptHeader("application/json,application/xml;q=0.9,*/*;q=0.8")
    .doNotTrackHeader("1")
    .acceptLanguageHeader("en-US,en;q=0.5")
    .acceptEncodingHeader("gzip, deflate")
    .userAgentHeader("Mozilla/5.0 (Windows NT 5.1; rv:31.0) Gecko/20100101 Firefox/31.0")

  val scn = scenario("SmokeTestScenario")
    // Use Keycloak to login and get an access token (direct grant).
    .exec(http("Login")
        .post(kc_url + "/realms/" + kc_realm + "/protocol/openid-connect/token")
        .formParam("client_id", kc_clientId)
        .formParam("client_secret", kc_clientSecret)
        .formParam("username", kc_username)
        .formParam("password", kc_password)
        .formParam("grant_type", "password")
        .check(jsonPath("$.access_token").saveAs("authToken"))
      )
    // Get system status. Validate that a user is returned in the payload (indicates successful auth).
    .exec(http("System Status")
        .get("/system/status")
        .header("Authorization", "Bearer ${authToken}")
        .check(jsonPath("$.name"))
        .check(jsonPath("$.user"))
      )
    // Create a new API
    .exec(http("Create API")
        .post("/designs")
        .header("Authorization", "Bearer ${authToken}")
        .body(ElFileBody("create-api.json")).asJSON
        .check(jsonPath("$.id").saveAs("designId"))
      )
    // Get the API (ie show the new API details to the user)
    .exec(http("Get API")
        .get("/designs/${designId}").asJSON
        .header("Authorization", "Bearer ${authToken}")
        .check(jsonPath("$.id"))
      )
    // Get the API activity
    .exec(http("Get API Activity")
        .get("/designs/${designId}/activity").asJSON
        .header("Authorization", "Bearer ${authToken}")
      )

    // Create 10 more APIs
    .repeat(100, "n") {
      pause(1 second, 5 seconds)
      exec(http("Create API")
          .post("/designs")
          .header("Authorization", "Bearer ${authToken}")
          .body(ElFileBody("create-api.json")).asJSON
        )
      .pause(1 second, 3 seconds)
      .exec(http("List APIs")
          .get("/designs").asJSON
          .header("Authorization", "Bearer ${authToken}")
        )
      }

  setUp(
    scn.inject(atOnceUsers(10))
  ).protocols(httpConf)
}

