---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 305
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 305 of 991)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - mlflow-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/mlflow-master
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: MlflowClientException.java]---
Location: mlflow-master/mlflow/java/client/src/main/java/org/mlflow/tracking/MlflowClientException.java

```java
package org.mlflow.tracking;

/** Superclass of all exceptions thrown by the MlflowClient API. */
public class MlflowClientException extends RuntimeException {
  public MlflowClientException(String message) {
    super(message);
  }
  public MlflowClientException(String message, Throwable cause) {
    super(message, cause);
  }
  public MlflowClientException(Throwable cause) {
    super(cause);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: MlflowClientVersion.java]---
Location: mlflow-master/mlflow/java/client/src/main/java/org/mlflow/tracking/MlflowClientVersion.java

```java
package org.mlflow.tracking;

import java.io.InputStream;
import java.util.Properties;

import com.google.common.base.Supplier;
import com.google.common.base.Suppliers;

/** Returns the version of the MLflow project this client was compiled against. */
public class MlflowClientVersion {
  // To avoid extra disk IO during class loading (static initialization), we lazily read the
  // pom.properties file on first access and then cache the result to avoid future IO.
  private static Supplier<String> clientVersionSupplier = Suppliers.memoize(() -> {
    try {
      Properties p = new Properties();
      InputStream is = MlflowClientVersion.class.getResourceAsStream(
        "/META-INF/maven/org.mlflow/mlflow-client/pom.properties");
      if (is == null) {
        return "";
      }
      p.load(is);
      return p.getProperty("version", "");
    } catch (Exception e) {
      return "";
    }
  });

  private MlflowClientVersion() {}

  /** @return MLflow client version (e.g., 0.9.1) or an empty string if detection fails. */
  public static String getClientVersion() {
    return clientVersionSupplier.get();
  }
}
```

--------------------------------------------------------------------------------

---[FILE: MlflowContext.java]---
Location: mlflow-master/mlflow/java/client/src/main/java/org/mlflow/tracking/MlflowContext.java

```java
package org.mlflow.tracking;

import org.mlflow.api.proto.Service.*;
import org.mlflow.tracking.utils.DatabricksContext;
import org.mlflow.tracking.utils.MlflowTagConstants;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.function.Consumer;

/**
 * Main entrypoint used to start MLflow runs to log to. This is a higher level interface than
 * {@code MlflowClient} and provides convenience methods to keep track of active runs and to set
 * default tags on runs which are created through {@code MlflowContext}
 *
 * On construction, MlflowContext will choose a default experiment ID to log to depending on your
 * environment. To log to a different experiment, use {@link #setExperimentId(String)} or
 * {@link #setExperimentName(String)}
 *
 * <p>
 * For example:
 *   <pre>
 *   // Uses the URI set in the MLFLOW_TRACKING_URI environment variable.
 *   // To use your own tracking uri set it in the call to "new MlflowContext("tracking-uri")"
 *   MlflowContext mlflow = new MlflowContext();
 *   ActiveRun run = mlflow.startRun("run-name");
 *   run.logParam("alpha", "0.5");
 *   run.logMetric("MSE", 0.0);
 *   run.endRun();
 *   </pre>
 */
public class MlflowContext {
  private MlflowClient client;
  private String experimentId;
  // Cache the default experiment ID for a repo notebook to avoid sending
  // extraneous API requests
  private static String defaultRepoNotebookExperimentId;
  private static final Logger logger = LoggerFactory.getLogger(MlflowContext.class);


  /**
   * Constructs a {@code MlflowContext} with a MlflowClient based on the MLFLOW_TRACKING_URI
   * environment variable.
   */
  public MlflowContext() {
    this(new MlflowClient());
  }

  /**
   * Constructs a {@code MlflowContext} which points to the specified trackingUri.
   *
   * @param trackingUri The URI to log to.
   */
  public MlflowContext(String trackingUri) {
    this(new MlflowClient(trackingUri));
  }

  /**
   * Constructs a {@code MlflowContext} which points to the specified trackingUri.
   *
   * @param client The client used to log runs.
   */
  public MlflowContext(MlflowClient client) {
    this.client = client;
    this.experimentId = getDefaultExperimentId();
  }

  /**
   * Returns the client used to log runs.
   *
   * @return the client used to log runs.
   */
  public MlflowClient getClient() {
    return this.client;
  }

  /**
   * Sets the experiment to log runs to by name.
   * @param experimentName the name of the experiment to log runs to.
   * @throws IllegalArgumentException if the experiment name does not match an existing experiment
   */
  public MlflowContext setExperimentName(String experimentName) throws IllegalArgumentException {
    Optional<Experiment> experimentOpt = client.getExperimentByName(experimentName);
    if (!experimentOpt.isPresent()) {
      throw new IllegalArgumentException(
        String.format("%s is not a valid experiment", experimentName));
    }
    experimentId = experimentOpt.get().getExperimentId();
    return this;
  }

  /**
   * Sets the experiment to log runs to by ID.
   * @param experimentId the id of the experiment to log runs to.
   */
  public MlflowContext setExperimentId(String experimentId) {
    this.experimentId = experimentId;
    return this;
  }

  /**
   * Returns the experiment ID we are logging to.
   *
   * @return the experiment ID we are logging to.
   */
  public String getExperimentId() {
    return this.experimentId;
  }

  /**
   * Starts a MLflow run without a name. To log data to newly created MLflow run see the methods on
   * {@link ActiveRun}. MLflow runs should be ended using {@link ActiveRun#endRun()}
   *
   * @return An {@code ActiveRun} object to log data to.
   */
  public ActiveRun startRun() {
    return startRun(null);
  }

  /**
   * Starts a MLflow run. To log data to newly created MLflow run see the methods on
   * {@link ActiveRun}. MLflow runs should be ended using {@link ActiveRun#endRun()}
   *
   * @param runName The name of this run. For display purposes only and is stored in the
   *                mlflow.runName tag.
   * @return An {@code ActiveRun} object to log data to.
   */
  public ActiveRun startRun(String runName) {
    return startRun(runName, null);
  }

  /**
   * Like {@link #startRun(String)} but sets the {@code mlflow.parentRunId} tag in order to create
   * nested runs.
   *
   * @param runName The name of this run. For display purposes only and is stored in the
   *                mlflow.runName tag.
   * @param parentRunId The ID of this run's parent
   * @return An {@code ActiveRun} object to log data to.
   */
  public ActiveRun startRun(String runName, String parentRunId) {
    Map<String, String> tags = new HashMap<>();
    if (runName != null) {
      tags.put(MlflowTagConstants.RUN_NAME, runName);
    }
    tags.put(MlflowTagConstants.USER, System.getProperty("user.name"));
    tags.put(MlflowTagConstants.SOURCE_TYPE, "LOCAL");
    if (parentRunId != null) {
      tags.put(MlflowTagConstants.PARENT_RUN_ID, parentRunId);
    }

    // Add tags from DatabricksContext if they exist
    DatabricksContext databricksContext = DatabricksContext.createIfAvailable();
    if (databricksContext != null) {
      tags.putAll(databricksContext.getTags());
    }

    CreateRun.Builder createRunBuilder = CreateRun.newBuilder()
      .setExperimentId(experimentId)
      .setStartTime(System.currentTimeMillis());
    for (Map.Entry<String, String> tag: tags.entrySet()) {
      createRunBuilder.addTags(
        RunTag.newBuilder().setKey(tag.getKey()).setValue(tag.getValue()).build());
    }
    RunInfo runInfo = client.createRun(createRunBuilder.build());

    ActiveRun newRun = new ActiveRun(runInfo, client);
    return newRun;
  }

  /**
   * Like {@link #startRun(String)} but will terminate the run after the activeRunFunction is
   * executed.
   *
   * For example
   *   <pre>
   *   mlflowContext.withActiveRun((activeRun -&gt; {
   *     activeRun.logParam("layers", "4");
   *   }));
   *   </pre>
   *
   * @param activeRunFunction A function which takes an {@code ActiveRun} and logs data to it.
   */
  public void withActiveRun(Consumer<ActiveRun> activeRunFunction) {
    ActiveRun newRun = startRun();
    try {
      activeRunFunction.accept(newRun);
    } catch(Exception e) {
      newRun.endRun(RunStatus.FAILED);
      return;
    }
    newRun.endRun(RunStatus.FINISHED);
  }

  /**
   * Like {@link #withActiveRun(Consumer)} with an explicity run name.
   *
   * @param runName The name of this run. For display purposes only and is stored in the
   *                mlflow.runName tag.
   * @param activeRunFunction A function which takes an {@code ActiveRun} and logs data to it.
   */
  public void withActiveRun(String runName, Consumer<ActiveRun> activeRunFunction) {
    ActiveRun newRun = startRun(runName);
    try {
      activeRunFunction.accept(newRun);
    } catch(Exception e) {
      newRun.endRun(RunStatus.FAILED);
      return;
    }
    newRun.endRun(RunStatus.FINISHED);
  }

  private static String getDefaultRepoNotebookExperimentId(String notebookId, String notebookPath) {
      if (defaultRepoNotebookExperimentId != null) {
        return defaultRepoNotebookExperimentId;
      }
      CreateExperiment.Builder request = CreateExperiment.newBuilder();
      request.setName(notebookPath);
      request.addTags(ExperimentTag.newBuilder()
              .setKey(MlflowTagConstants.MLFLOW_EXPERIMENT_SOURCE_TYPE)
              .setValue("REPO_NOTEBOOK")
      );
      request.addTags(ExperimentTag.newBuilder()
              .setKey(MlflowTagConstants.MLFLOW_EXPERIMENT_SOURCE_ID)
              .setValue(notebookId)
      );
      String experimentId = (new MlflowClient()).createExperiment(request.build());
      defaultRepoNotebookExperimentId = experimentId;
      return experimentId;

  }

  private static String getDefaultExperimentId() {
    DatabricksContext databricksContext = DatabricksContext.createIfAvailable();
    if (databricksContext != null && databricksContext.isInDatabricksNotebook()) {
      String notebookId = databricksContext.getNotebookId();
      String notebookPath = databricksContext.getNotebookPath();
      if (notebookId != null) {
        if (notebookPath != null && notebookPath.startsWith("/Repos")) {
          try {
            return getDefaultRepoNotebookExperimentId(notebookId, notebookPath);
          }
          catch (Exception e) {
            // Do nothing; will fall through to returning notebookId
            logger.warn("Failed to get default repo notebook experiment ID", e);
          }
        }
        return notebookId;
      }
    }
    return MlflowClient.DEFAULT_EXPERIMENT_ID;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: MlflowHttpCaller.java]---
Location: mlflow-master/mlflow/java/client/src/main/java/org/mlflow/tracking/MlflowHttpCaller.java

```java
package org.mlflow.tracking;

import com.google.common.annotations.VisibleForTesting;

import java.io.IOException;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpEntityEnclosingRequestBase;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPatch;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustSelfSignedStrategy;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.ssl.SSLContextBuilder;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.mlflow.tracking.creds.MlflowHostCreds;
import org.mlflow.tracking.creds.MlflowHostCredsProvider;


class MlflowHttpCaller {
  private static final Logger logger = LoggerFactory.getLogger(MlflowHttpCaller.class);
  private static final String BASE_API_PATH = "api/2.0/mlflow";
  protected CloseableHttpClient httpClient;
  private final MlflowHostCredsProvider hostCredsProvider;
  private final int maxRateLimitIntervalMillis;
  private final int rateLimitRetrySleepInitMillis;
  private final int maxRetryAttempts;

  /**
   * Construct a new MlflowHttpCaller with a default configuration for request retries.
   */
  MlflowHttpCaller(MlflowHostCredsProvider hostCredsProvider) {
    this(hostCredsProvider, 60000, 1000, 3);
  }

  /**
   * Construct a new MlflowHttpCaller.
   *
   * @param maxRateLimitIntervalMs The maximum amount of time, in milliseconds, to spend retrying a
   *                               single request in response to rate limiting (error code 429).
   * @param rateLimitRetrySleepInitMs The initial backoff delay, in milliseconds, when retrying a
   *                                  request in response to rate limiting (error code 429). The
   *                                  delay is increased exponentially after each rate limiting
   *                                  response until the total delay incurred across all retries for
   *                                  the request exceeds the specified maxRateLimitIntervalSeconds.
   * @param maxRetryAttempts The maximum number of times to retry a request, excluding rate limit
   *                         retries.
   */
  MlflowHttpCaller(MlflowHostCredsProvider hostCredsProvider,
                   int maxRateLimitIntervalMs,
                   int rateLimitRetrySleepInitMs,
                   int maxRetryAttempts) {
    this.hostCredsProvider = hostCredsProvider;
    this.maxRateLimitIntervalMillis = maxRateLimitIntervalMs;
    this.rateLimitRetrySleepInitMillis = rateLimitRetrySleepInitMs;
    this.maxRetryAttempts = maxRetryAttempts;
  }

  @VisibleForTesting
  MlflowHttpCaller(MlflowHostCredsProvider hostCredsProvider,
                   int maxRateLimitIntervalMs,
                   int rateLimitRetrySleepInitMs,
                   int maxRetryAttempts,
                   CloseableHttpClient client) {
    this(
      hostCredsProvider, maxRateLimitIntervalMs, rateLimitRetrySleepInitMs, maxRetryAttempts);
    this.httpClient = client;
  }

  private HttpResponse executeRequestWithRateLimitRetries(HttpRequestBase request)
      throws IOException {
    int timeLeft = maxRateLimitIntervalMillis;
    int sleepFor = rateLimitRetrySleepInitMillis;
    HttpResponse response = httpClient.execute(request);
    while (response.getStatusLine().getStatusCode() == 429 && timeLeft > 0) {
      logger.warn("Request returned with status code 429 (Rate limit exceeded). Retrying after "
                  + sleepFor
                  + " milliseconds. Will continue to retry 429s for up to "
                  + timeLeft
                  + " milliseconds.");
      try {
        Thread.sleep(sleepFor);
      } catch (InterruptedException e) {
        throw new RuntimeException(e);
      }
      timeLeft -= sleepFor;
      sleepFor = Math.min(timeLeft, 2 * sleepFor);
      response = httpClient.execute(request);
    }
    checkError(response);
    return response;
  }

  private HttpResponse executeRequest(HttpRequestBase request) throws IOException {
    HttpResponse response = null;
    int attemptsRemaining = this.maxRetryAttempts;
    while (attemptsRemaining > 0) {
      attemptsRemaining -= 1;
      try {
        response = executeRequestWithRateLimitRetries(request);
        break;
      } catch (MlflowHttpException e) {
        if (attemptsRemaining > 0 && e.getStatusCode() != 429) {
          logger.warn("Request returned with status code {} (Rate limit exceeded)."
                      + " Retrying up to {} more times. Response body: {}",
                      e.getStatusCode(),
                      attemptsRemaining,
                      e.getBodyMessage());
          continue;
        } else {
          throw e;
        }
      }
    }
    return response;
  }

  String get(String path) {
    logger.debug("Sending GET " + path);
    HttpGet request = new HttpGet();
    fillRequestSettings(request, path);
    try {
      HttpResponse response = executeRequest(request);
      String responseJson = EntityUtils.toString(response.getEntity(), StandardCharsets.UTF_8);
      logger.debug("Response: " + responseJson);
      return responseJson;
    } catch (IOException e) {
      throw new MlflowClientException(e);
    }
  }

  // TODO(aaron) Convert to InputStream.
  byte[] getAsBytes(String path) {
    logger.debug("Sending GET " + path);
    HttpGet request = new HttpGet();
    fillRequestSettings(request, path);
    try {
      HttpResponse response = executeRequest(request);
      byte[] bytes = EntityUtils.toByteArray(response.getEntity());
      logger.debug("response: #bytes=" + bytes.length);
      return bytes;
    } catch (IOException e) {
      throw new MlflowClientException(e);
    }
  }

  String post(String path, String json) {
    logger.debug("Sending POST " + path + ": " + json);
    HttpPost request = new HttpPost();
    return send(request, path, json);
  }

  String patch(String path, String json) {
    logger.debug("Sending PATCH " + path + ": " + json);
    HttpPatch request = new HttpPatch();
    return send(request, path, json);
  }

  private String send(HttpEntityEnclosingRequestBase request, String path, String json) {
    fillRequestSettings(request, path);
    request.setEntity(new StringEntity(json, StandardCharsets.UTF_8));
    request.setHeader("Content-Type", "application/json");
    try {
      HttpResponse response = executeRequest(request);
      String responseJson = EntityUtils.toString(response.getEntity(), StandardCharsets.UTF_8);
      logger.debug("Response: " + responseJson);
      return responseJson;
    } catch (IOException e) {
      throw new MlflowClientException(e);
    }
  }

  private void checkError(HttpResponse response) throws MlflowClientException, IOException {
    int statusCode = response.getStatusLine().getStatusCode();
    String reasonPhrase = response.getStatusLine().getReasonPhrase();
    if (isError(statusCode)) {
      String bodyMessage = EntityUtils.toString(response.getEntity(), StandardCharsets.UTF_8);
      if (statusCode >= 400 && statusCode <= 499) {
        throw new MlflowHttpException(statusCode, reasonPhrase, bodyMessage);
      }
      if (statusCode >= 500 && statusCode <= 599) {
        throw new MlflowHttpException(statusCode, reasonPhrase, bodyMessage);
      }
      throw new MlflowHttpException(statusCode, reasonPhrase, bodyMessage);
    }
  }

  private void fillRequestSettings(HttpRequestBase request, String path) {
    MlflowHostCreds hostCreds = hostCredsProvider.getHostCreds();
    createHttpClientIfNecessary(hostCreds.shouldIgnoreTlsVerification());
    String uri = hostCreds.getHost() + "/" + BASE_API_PATH + "/" + path;
    request.setURI(URI.create(uri));
    String username = hostCreds.getUsername();
    String password = hostCreds.getPassword();
    String token = hostCreds.getToken();
    if (username != null && password != null) {
      String authHeader = Base64.getEncoder()
        .encodeToString((username + ":" + password).getBytes(StandardCharsets.UTF_8));
      request.addHeader("Authorization", "Basic " + authHeader);
    } else if (token != null) {
      request.addHeader("Authorization", "Bearer " + token);
    }

    String userAgent = "mlflow-java-client";
    String clientVersion = MlflowClientVersion.getClientVersion();
    if (!clientVersion.isEmpty()) {
      userAgent += "/" + clientVersion;
    }
    request.addHeader("User-Agent", userAgent);
  }

  private boolean isError(int statusCode) {
    return statusCode < 200 || statusCode > 399;
  }

  private void createHttpClientIfNecessary(boolean noTlsVerify) {
    if (httpClient != null) {
      return;
    }

    HttpClientBuilder builder = HttpClientBuilder.create();
    if (noTlsVerify) {
      try {
        SSLContextBuilder sslBuilder = new SSLContextBuilder()
          .loadTrustMaterial(null, new TrustSelfSignedStrategy());
        SSLConnectionSocketFactory connectionFactory =
          new SSLConnectionSocketFactory(sslBuilder.build(), new NoopHostnameVerifier());
        builder.setSSLSocketFactory(connectionFactory);
      } catch (NoSuchAlgorithmException | KeyStoreException | KeyManagementException e) {
        logger.warn("Could not set noTlsVerify to true, verification will remain", e);
      }
    }

    this.httpClient = builder.build();
  }

  void close() {
    if (httpClient != null) {
      try {
	  httpClient.close();
      } catch(IOException e){
	  logger.warn("Unable to close connection to mlflow backend", e);
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: MlflowHttpException.java]---
Location: mlflow-master/mlflow/java/client/src/main/java/org/mlflow/tracking/MlflowHttpException.java

```java
package org.mlflow.tracking;

/**
 * Returned when an HTTP API request to a remote Tracking service returns an error code.
 */
public class MlflowHttpException extends MlflowClientException {

  public MlflowHttpException(int statusCode, String reasonPhrase) {
    super("statusCode=" + statusCode + " reasonPhrase=[" + reasonPhrase +"]");
    this.statusCode = statusCode;
    this.reasonPhrase = reasonPhrase;
  }

  public MlflowHttpException(int statusCode, String reasonPhrase, String bodyMessage) {
    super("statusCode=" + statusCode + " reasonPhrase=[" + reasonPhrase + "] bodyMessage=["
      + bodyMessage + "]");
    this.statusCode = statusCode;
    this.reasonPhrase = reasonPhrase;
    this.bodyMessage = bodyMessage;
  }

  private int statusCode;

  public int getStatusCode() {
    return statusCode;
  }

  private String reasonPhrase;

  public String getReasonPhrase() {
    return reasonPhrase;
  }

  private String bodyMessage;

  public String getBodyMessage() {
    return bodyMessage;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: MlflowProtobufMapper.java]---
Location: mlflow-master/mlflow/java/client/src/main/java/org/mlflow/tracking/MlflowProtobufMapper.java

```java
package org.mlflow.tracking;

import com.google.protobuf.InvalidProtocolBufferException;
import com.google.protobuf.MessageOrBuilder;
import com.google.protobuf.util.JsonFormat;

import java.lang.Iterable;
import java.net.URISyntaxException;
import java.util.List;

import org.apache.http.client.utils.URIBuilder;
import org.mlflow.api.proto.ModelRegistry.*;
import org.mlflow.api.proto.Service.*;

class MlflowProtobufMapper {

  String makeCreateExperimentRequest(String expName) {
    CreateExperiment.Builder builder = CreateExperiment.newBuilder();
    builder.setName(expName);
    return print(builder);
  }

  String makeDeleteExperimentRequest(String experimentId) {
    DeleteExperiment.Builder builder = DeleteExperiment.newBuilder();
    builder.setExperimentId(experimentId);
    return print(builder);
  }

  String makeRestoreExperimentRequest(String experimentId) {
    RestoreExperiment.Builder builder = RestoreExperiment.newBuilder();
    builder.setExperimentId(experimentId);
    return print(builder);
  }

  String makeUpdateExperimentRequest(String experimentId, String newExperimentName) {
    UpdateExperiment.Builder builder = UpdateExperiment.newBuilder();
    builder.setExperimentId(experimentId);
    builder.setNewName(newExperimentName);
    return print(builder);
  }

  String makeLogParam(String runId, String key, String value) {
    LogParam.Builder builder = LogParam.newBuilder();
    builder.setRunUuid(runId);
    builder.setRunId(runId);
    builder.setKey(key);
    builder.setValue(value);
    return print(builder);
  }

  String makeLogMetric(String runId, String key, double value, long timestamp, long step) {
    LogMetric.Builder builder = LogMetric.newBuilder();
    builder.setRunUuid(runId);
    builder.setRunId(runId);
    builder.setKey(key);
    builder.setValue(value);
    builder.setTimestamp(timestamp);
    builder.setStep(step);
    return print(builder);
  }

  String makeSetExperimentTag(String expId, String key, String value) {
    SetExperimentTag.Builder builder = SetExperimentTag.newBuilder();
    builder.setExperimentId(expId);
    builder.setKey(key);
    builder.setValue(value);
    return print(builder);
  }

  String makeSetTag(String runId, String key, String value) {
    SetTag.Builder builder = SetTag.newBuilder();
    builder.setRunUuid(runId);
    builder.setRunId(runId);
    builder.setKey(key);
    builder.setValue(value);
    return print(builder);
  }

  String makeDeleteTag(String runId, String key) {
    DeleteTag.Builder builder = DeleteTag.newBuilder();
    builder.setRunId(runId);
    builder.setKey(key);
    return print(builder);
  }

  String makeLogBatch(String runId,
      Iterable<Metric> metrics,
      Iterable<Param> params,
      Iterable<RunTag> tags) {
    LogBatch.Builder builder = LogBatch.newBuilder();
    builder.setRunId(runId);
    if (metrics != null) {
      builder.addAllMetrics(metrics);
    }
    if (params != null) {
      builder.addAllParams(params);
    }
    if (tags != null) {
      builder.addAllTags(tags);
    }
    return print(builder);
  }

  String makeUpdateRun(String runId, RunStatus status, long endTime) {
    UpdateRun.Builder builder = UpdateRun.newBuilder();
    builder.setRunUuid(runId);
    builder.setRunId(runId);
    builder.setStatus(status);
    builder.setEndTime(endTime);
    return print(builder);
  }

  String makeDeleteRun(String runId) {
    DeleteRun.Builder builder = DeleteRun.newBuilder();
    builder.setRunId(runId);
    return print(builder);
  }

  String makeRestoreRun(String runId) {
    RestoreRun.Builder builder = RestoreRun.newBuilder();
    builder.setRunId(runId);
    return print(builder);
  }

  String makeGetLatestVersion(String modelName, Iterable<String> stages) {
    try {
      URIBuilder builder = new URIBuilder("registered-models/get-latest-versions")
              .addParameter("name", modelName);
      if (stages != null) {
        for( String stage: stages) {
          builder.addParameter("stages", stage);
        }
      }
      return builder.build().toString();
    } catch (URISyntaxException e) {
      throw new MlflowClientException("Failed to construct request URI for get latest versions.",
              e);
    }
  }

  String makeUpdateModelVersion(String modelName, String version) {
    return print(UpdateModelVersion.newBuilder().setName(modelName).setVersion(version));
  }

  String makeTransitionModelVersionStage(String modelName, String version, String stage) {
    return print(TransitionModelVersionStage.newBuilder()
            .setName(modelName).setVersion(version).setStage(stage));
  }

  String makeCreateModel(String modelName) {
    CreateRegisteredModel.Builder builder = CreateRegisteredModel.newBuilder()
            .setName(modelName);
    return print(builder);
  }

  String makeCreateModelVersion(String modelName, String runId, String source) {
    CreateModelVersion.Builder builder = CreateModelVersion.newBuilder()
            .setName(modelName)
            .setRunId(runId)
            .setSource(source);
    return print(builder);
  }

  String makeGetRegisteredModel(String modelName) {
    try {
      return new URIBuilder("registered-models/get")
          .addParameter("name", modelName)
          .build()
          .toString();
    } catch (URISyntaxException e) {
      throw new MlflowClientException("Failed to construct request URI for get model version.", e);
    }
  }

  String makeGetModelVersion(String modelName, String modelVersion) {
    try {
      return new URIBuilder("model-versions/get")
          .addParameter("name", modelName)
          .addParameter("version", modelVersion)
          .build()
          .toString();
    } catch (URISyntaxException e) {
      throw new MlflowClientException("Failed to construct request URI for get model version.", e);
    }
  }

  String makeGetModelVersionDownloadUri(String modelName, String modelVersion) {
    try {
      return new URIBuilder("model-versions/get-download-uri")
              .addParameter("name", modelName)
              .addParameter("version", modelVersion).build().toString();
    } catch (URISyntaxException e) {
      throw new MlflowClientException(
              "Failed to construct request URI for get version download uri.",
              e);
    }
  }

  String makeSearchModelVersions(String searchFilter,
                                 int maxResults,
                                 List<String> orderBy,
                                 String pageToken) {
    try {
      URIBuilder builder = new URIBuilder("model-versions/search")
              .addParameter("max_results", Integer.toString(maxResults));
      if (searchFilter != null && searchFilter != "") {
        builder.addParameter("filter", searchFilter);
      }
      if (pageToken != null && pageToken != "") {
        builder.addParameter("page_token", pageToken);
      }
      for( String order: orderBy) {
        builder.addParameter("order_by", order);
      }
      return builder.build().toString();
    } catch (URISyntaxException e) {
      throw new MlflowClientException(
              "Failed to construct request URI for search model version.",
              e);
    }
  }

  String toJson(MessageOrBuilder mb) {
    return print(mb);
  }

  GetExperiment.Response toGetExperimentResponse(String json) {
    GetExperiment.Response.Builder builder = GetExperiment.Response.newBuilder();
    merge(json, builder);
    return builder.build();
  }

  GetExperimentByName.Response toGetExperimentByNameResponse(String json) {
    GetExperimentByName.Response.Builder builder = GetExperimentByName.Response.newBuilder();
    merge(json, builder);
    return builder.build();
  }

  SearchExperiments.Response toSearchExperimentsResponse(String json) {
    SearchExperiments.Response.Builder builder = SearchExperiments.Response.newBuilder();
    merge(json, builder);
    return builder.build();
  }

  CreateExperiment.Response toCreateExperimentResponse(String json) {
    CreateExperiment.Response.Builder builder = CreateExperiment.Response.newBuilder();
    merge(json, builder);
    return builder.build();
  }

  GetRun.Response toGetRunResponse(String json) {
    GetRun.Response.Builder builder = GetRun.Response.newBuilder();
    merge(json, builder);
    return builder.build();
  }

  GetMetricHistory.Response toGetMetricHistoryResponse(String json) {
    GetMetricHistory.Response.Builder builder = GetMetricHistory.Response.newBuilder();
    merge(json, builder);
    return builder.build();
  }

  CreateRun.Response toCreateRunResponse(String json) {
    CreateRun.Response.Builder builder = CreateRun.Response.newBuilder();
    merge(json, builder);
    return builder.build();
  }

  SearchRuns.Response toSearchRunsResponse(String json) {
    SearchRuns.Response.Builder builder = SearchRuns.Response.newBuilder();
    merge(json, builder);
    return builder.build();
  }

  GetLatestVersions.Response toGetLatestVersionsResponse(String json) {
    GetLatestVersions.Response.Builder builder = GetLatestVersions.Response.newBuilder();
    merge(json, builder);
    return builder.build();
  }

  GetModelVersion.Response toGetModelVersionResponse(String json) {
    GetModelVersion.Response.Builder builder = GetModelVersion.Response.newBuilder();
    merge(json, builder);
    return builder.build();
  }

  GetRegisteredModel.Response toGetRegisteredModelResponse(String json) {
    GetRegisteredModel.Response.Builder builder = GetRegisteredModel.Response.newBuilder();
    merge(json, builder);
    return builder.build();
  }

  String toGetModelVersionDownloadUriResponse(String json) {
    GetModelVersionDownloadUri.Response.Builder builder = GetModelVersionDownloadUri.Response
            .newBuilder();
    merge(json, builder);
    return builder.getArtifactUri();
  }

  SearchModelVersions.Response toSearchModelVersionsResponse(String json) {
    SearchModelVersions.Response.Builder builder = SearchModelVersions.Response.newBuilder();
    merge(json, builder);
    return builder.build();
  }

  private String print(MessageOrBuilder message) {
    try {
      return JsonFormat.printer().preservingProtoFieldNames().print(message);
    } catch (InvalidProtocolBufferException e) {
      throw new MlflowClientException("Failed to serialize message " + message, e);
    }
  }

  private void merge(String json, com.google.protobuf.Message.Builder builder) {
    try {
      JsonFormat.parser().ignoringUnknownFields().merge(json, builder);
    } catch (InvalidProtocolBufferException e) {
      throw new MlflowClientException("Failed to serialize json " + json + " into " + builder, e);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ModelVersionsPage.java]---
Location: mlflow-master/mlflow/java/client/src/main/java/org/mlflow/tracking/ModelVersionsPage.java

```java
package org.mlflow.tracking;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.mlflow.api.proto.ModelRegistry.*;

public class ModelVersionsPage implements Page<ModelVersion> {

  private final String token;
  private final List<ModelVersion> mvs;

  private final MlflowClient client;
  private final String searchFilter;
  private final List<String> orderBy;
  private final int maxResults;

  /**
   * Creates a fixed size page of ModelVersions.
   */
  ModelVersionsPage(List<ModelVersion> mvs,
                    String token,
                    String searchFilter,
                    int maxResults,
                    List<String> orderBy,
                    MlflowClient client) {
    this.mvs = Collections.unmodifiableList(mvs);
    this.token = token;
    this.searchFilter = searchFilter;
    this.orderBy = orderBy;
    this.maxResults = maxResults;
    this.client = client;
  }

  /**
   * @return The number of model versions in the page.
   */
  public int getPageSize() {
    return this.mvs.size();
  }

  /**
   * @return True if a token for the next page exists and isn't empty. Otherwise returns false.
   */
  public boolean hasNextPage() {
    return this.token != null && this.token != "";
  }

  /**
   * @return An optional with the token for the next page.
   * Empty if the token doesn't exist or is empty.
   */
  public Optional<String> getNextPageToken() {
    if (this.hasNextPage()) {
      return Optional.of(this.token);
    } else {
      return Optional.empty();
    }
  }

  /**
   * @return The next page of model versions matching the search criteria.
   * If there are no more pages, an {@link org.mlflow.tracking.EmptyPage} will be returned.
   */
  public Page<ModelVersion> getNextPage() {
    if (this.hasNextPage()) {
      return this.client.searchModelVersions(this.searchFilter,
                                             this.maxResults,
                                             this.orderBy,
                                             this.token);
    } else {
      return new EmptyPage();
    }
  }

  /**
   * @return An iterable over the model versions in this page.
   */
  public List<ModelVersion> getItems() {
    return mvs;
  }

}
```

--------------------------------------------------------------------------------

---[FILE: package-info.java]---
Location: mlflow-master/mlflow/java/client/src/main/java/org/mlflow/tracking/package-info.java

```java
/**
 * MLflow Tracking provides a Java CRUD interface to MLflow Experiments and Runs --
 * to create and log to MLflow runs, use the {@link org.mlflow.tracking.MlflowContext} interface.
 */
package org.mlflow.tracking;
```

--------------------------------------------------------------------------------

---[FILE: Page.java]---
Location: mlflow-master/mlflow/java/client/src/main/java/org/mlflow/tracking/Page.java

```java
package org.mlflow.tracking;

import java.lang.Iterable;
import java.util.Optional;

public interface Page<E> {

  /**
   * @return The number of elements in this page.
   */
  public int getPageSize();

  /**
   * @return True if there are more pages that can be retrieved from the API.
   */
  public boolean hasNextPage();

  /**
   * @return An Optional of the token string to get the next page. 
   * Empty if there is no next page.
   */
  public Optional<String> getNextPageToken();

  /**
   * @return Retrieves the next Page object using the next page token,
   * or returns an empty page if there are no more pages.
   */
  public Page<E> getNextPage();

  /**
   * @return A List of the elements in this Page.
   */
  public Iterable<E> getItems();

}
```

--------------------------------------------------------------------------------

---[FILE: RunsPage.java]---
Location: mlflow-master/mlflow/java/client/src/main/java/org/mlflow/tracking/RunsPage.java

```java
package org.mlflow.tracking;

import java.util.Collections;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;
import org.mlflow.api.proto.Service.*;

public class RunsPage implements Page<Run> {

  private final String token;
  private final List<Run> runs;

  private final MlflowClient client;
  private final List<String> experimentIds;
  private final String searchFilter;
  private final ViewType runViewType;
  private final List<String> orderBy;
  private final int maxResults;

  /**
   * Creates a fixed size page of Runs.
   */
  RunsPage(List<Run> runs,
                  String token,
                  List<String> experimentIds,
                  String searchFilter,
                  ViewType runViewType,
                  int maxResults,
                  List<String> orderBy,
                  MlflowClient client) {
    this.runs = Collections.unmodifiableList(runs);
    this.token = token;
    this.experimentIds = experimentIds;
    this.searchFilter = searchFilter;
    this.runViewType = runViewType;
    this.orderBy = orderBy;
    this.maxResults = maxResults;
    this.client = client;
  }

  /**
   * @return The number of runs in the page.
   */
  public int getPageSize() {
    return this.runs.size();
  }

  /**
   * @return True if a token for the next page exists and isn't empty. Otherwise returns false.
   */
  public boolean hasNextPage() {
    return this.token != null && this.token != "";
  }

  /**
   * @return An optional with the token for the next page. 
   * Empty if the token doesn't exist or is empty.
   */
  public Optional<String> getNextPageToken() {
    if (this.hasNextPage()) {
      return Optional.of(this.token);
    } else {
      return Optional.empty();
    }
  }

  /**
   * @return The next page of runs matching the search criteria. 
   * If there are no more pages, an {@link org.mlflow.tracking.EmptyPage} will be returned.
   */
  public Page<Run> getNextPage() {
    if (this.hasNextPage()) {
      return this.client.searchRuns(this.experimentIds,
                                    this.searchFilter,
                                    this.runViewType,
                                    this.maxResults,
                                    this.orderBy,
                                    this.token);
    } else {
      return new EmptyPage();
    }
  }

  /**
   * @return An iterable over the runs in this page.
   */
  public List<Run> getItems() {
    return runs;
  }

}
```

--------------------------------------------------------------------------------

````
