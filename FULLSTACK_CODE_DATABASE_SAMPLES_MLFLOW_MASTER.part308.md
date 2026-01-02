---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 308
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 308 of 991)

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

---[FILE: MlflowContextTest.java]---
Location: mlflow-master/mlflow/java/client/src/test/java/org/mlflow/tracking/MlflowContextTest.java

```java
package org.mlflow.tracking;

import static org.mockito.Mockito.*;

import static org.mlflow.api.proto.Service.*;

import org.mlflow.tracking.utils.MlflowTagConstants;
import org.mockito.ArgumentCaptor;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.Test;

import java.util.List;
import java.util.Optional;

public class MlflowContextTest {
  private static MlflowClient mockClient;

  @AfterMethod
  public static void afterMethod() {
    mockClient = null;
  }

  public static MlflowContext setupMlflowContext() {
    mockClient = mock(MlflowClient.class);
    MlflowContext mlflow = new MlflowContext(mockClient);
    return mlflow;
  }

  @Test
  public void testGetClient() {
    MlflowContext mlflow = setupMlflowContext();
    Assert.assertEquals(mlflow.getClient(), mockClient);
  }

  @Test
  public void testSetExperimentName() {
    // Will throw if there is no experiment with the same name.
    {
      MlflowContext mlflow = setupMlflowContext();
      when(mockClient.getExperimentByName("experiment-name")).thenReturn(Optional.empty());
      try {
        mlflow.setExperimentName("experiment-name");
        Assert.fail();
      } catch (IllegalArgumentException expected) {
      }
    }

    // Will set experiment-id if experiment is returned from getExperimentByName
    {
      MlflowContext mlflow = setupMlflowContext();
      when(mockClient.getExperimentByName("experiment-name")).thenReturn(
        Optional.of(Experiment.newBuilder().setExperimentId("123").build()));
      mlflow.setExperimentName("experiment-name");
      Assert.assertEquals(mlflow.getExperimentId(), "123");
    }
  }

  @Test
  public void testSetAndGetExperimentId() {
      MlflowContext mlflow = setupMlflowContext();
      mlflow.setExperimentId("apple");
      Assert.assertEquals(mlflow.getExperimentId(), "apple");
  }

  @Test
  public void testStartRun() {
    // Sets the appropriate tags
    ArgumentCaptor<CreateRun> createRunArgument = ArgumentCaptor.forClass(CreateRun.class);
    MlflowContext mlflow = setupMlflowContext();
    mlflow.setExperimentId("123");
    mlflow.startRun("apple", "parent-run-id");
    verify(mockClient).createRun(createRunArgument.capture());
    List<RunTag> tags = createRunArgument.getValue().getTagsList();
    Assert.assertEquals(createRunArgument.getValue().getExperimentId(), "123");
    Assert.assertTrue(tags.contains(createRunTag(MlflowTagConstants.RUN_NAME, "apple")));
    Assert.assertTrue(tags.contains(createRunTag(MlflowTagConstants.SOURCE_TYPE, "LOCAL")));
    Assert.assertTrue(tags.contains(createRunTag(MlflowTagConstants.USER, System.getProperty("user.name"))));
    Assert.assertTrue(tags.contains(createRunTag(MlflowTagConstants.PARENT_RUN_ID, "parent-run-id")));
  }

  @Test
  public void testStartRunWithNoRunName() {
    // Sets the appropriate tags
    ArgumentCaptor<CreateRun> createRunArgument = ArgumentCaptor.forClass(CreateRun.class);
    MlflowContext mlflow = setupMlflowContext();
    mlflow.startRun();
    verify(mockClient).createRun(createRunArgument.capture());
    List<RunTag> tags = createRunArgument.getValue().getTagsList();
    Assert.assertFalse(
      tags.stream().anyMatch(tag -> tag.getKey().equals(MlflowTagConstants.RUN_NAME)));
  }

  @Test
  public void testWithActiveRun() {
    // Sets the appropriate tags
    MlflowContext mlflow = setupMlflowContext();
    mlflow.setExperimentId("123");
    when(mockClient.createRun(any(CreateRun.class)))
      .thenReturn(RunInfo.newBuilder().setRunId("test-id").build());
    mlflow.withActiveRun("apple", activeRun -> {
      Assert.assertEquals(activeRun.getId(), "test-id");
    });
    verify(mockClient).createRun(any(CreateRun.class));
    verify(mockClient).setTerminated(any(), any());
  }

  @Test
  public void testWithActiveRunNoRunName() {
    // Sets the appropriate tags
    MlflowContext mlflow = setupMlflowContext();
    mlflow.setExperimentId("123");
    when(mockClient.createRun(any(CreateRun.class)))
      .thenReturn(RunInfo.newBuilder().setRunId("test-id").build());
    mlflow.withActiveRun(activeRun -> {
      Assert.assertEquals(activeRun.getId(), "test-id");
    });
    verify(mockClient).createRun(any(CreateRun.class));
    verify(mockClient).setTerminated(any(), any());
  }


  private static RunTag createRunTag(String key, String value) {
    return RunTag.newBuilder().setKey(key).setValue(value).build();
  }
}
```

--------------------------------------------------------------------------------

---[FILE: MlflowProtobufMapperTest.java]---
Location: mlflow-master/mlflow/java/client/src/test/java/org/mlflow/tracking/MlflowProtobufMapperTest.java

```java
package org.mlflow.tracking;

import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.Map;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import org.testng.Assert;
import org.testng.annotations.Test;

import org.mlflow.api.proto.Service;

public class MlflowProtobufMapperTest {
  @Test
  public void testSerializeSnakeCase() {
    MlflowProtobufMapper mapper = new MlflowProtobufMapper();
    String result = mapper.makeLogParam("my-id", "my-key", "my-value");

    Gson gson = new Gson();
    Type type = new TypeToken<Map<String, Object>>(){}.getType();
    Map<String, String> serializedMessage = gson.fromJson(result, type);

    Map<String, String> expectedMessage = new HashMap<>();
    expectedMessage.put("run_uuid", "my-id");
    expectedMessage.put("run_id", "my-id");
    expectedMessage.put("key", "my-key");
    expectedMessage.put("value", "my-value");
    Assert.assertEquals(serializedMessage, expectedMessage);
  }

  @Test
  public void testDeserializeSnakeCaseAndUnknown() {
    MlflowProtobufMapper mapper = new MlflowProtobufMapper();
    Service.CreateExperiment.Response result = mapper.toCreateExperimentResponse(
      "{\"experiment_id\": 123, \"what is this field\": \"even\"}");
    Assert.assertEquals(result.getExperimentId(), "123");
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ModelRegistryMlflowClientTest.java]---
Location: mlflow-master/mlflow/java/client/src/test/java/org/mlflow/tracking/ModelRegistryMlflowClientTest.java

```java
package org.mlflow.tracking;

import static org.mlflow.tracking.TestUtils.createExperimentName;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;

import com.google.common.collect.Lists;
import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import org.apache.commons.io.FileUtils;
import org.mlflow.api.proto.ModelRegistry.ModelVersion;
import org.mlflow.api.proto.ModelRegistry.RegisteredModel;
import org.mlflow.api.proto.Service;
import org.mlflow.api.proto.Service.RunInfo;
import org.mockito.Mockito;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.Assert;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

public class ModelRegistryMlflowClientTest {
    private static final Logger logger = LoggerFactory.getLogger(ModelRegistryMlflowClientTest.class);

    private static final MlflowProtobufMapper mapper = new MlflowProtobufMapper();

    private final TestClientProvider testClientProvider = new TestClientProvider();

    private MlflowClient client;
    private String source;

    private String modelName;

    private static final String content = "Hello, Worldz!";

    // As only a single `.txt` is stored as a model version artifact, this filter is used to
    // extract the written file.
    FilenameFilter filter = new FilenameFilter() {
        @Override
        public boolean accept(File f, String name) {
            return name.endsWith(".txt");
        }
    };

    @BeforeTest
    public void before() throws IOException {
        client = testClientProvider.initializeClientAndSqlLiteBasedServer();
        modelName = "Model-" + UUID.randomUUID().toString();

        String expName = createExperimentName();
        String expId = client.createExperiment(expName);

        RunInfo runCreated = client.createRun(expId);
        String runId = runCreated.getRunUuid();
        source = String.format("runs:/%s/model", runId);

        File tempDir = Files.createTempDirectory("tempDir").toFile();
        File tempFile = Files.createTempFile(tempDir.toPath(), "file", ".txt").toFile();
        FileUtils.writeStringToFile(tempFile, content, StandardCharsets.UTF_8);
        client.logArtifact(runId, tempFile, "model");

        client.sendPost("registered-models/create",
                mapper.makeCreateModel(modelName));

        client.sendPost("model-versions/create",
                mapper.makeCreateModelVersion(modelName, runId, String.format("runs:/%s/model", runId)));
    }

    @AfterTest
    public void after() throws InterruptedException {
        testClientProvider.cleanupClientAndServer();
    }

    @Test
    public void testGetLatestModelVersions() throws IOException {
        // a list of stages
        List<ModelVersion> versions = client.getLatestVersions(modelName,
                Lists.newArrayList("None"));
        Assert.assertEquals(versions.size(), 1);

        validateDetailedModelVersion(versions.get(0), modelName, "None", "1");

        client.sendPatch("model-versions/update", mapper.makeUpdateModelVersion(modelName,
                "1"));
        // get the latest version of all stages
        List<ModelVersion> modelVersion = client.getLatestVersions(modelName);
        Assert.assertEquals(modelVersion.size(), 1);
        validateDetailedModelVersion(modelVersion.get(0), modelName, "None", "1");
        client.sendPost("model-versions/transition-stage",
                mapper.makeTransitionModelVersionStage(modelName, "1", "Staging"));
        modelVersion = client.getLatestVersions(modelName);
        Assert.assertEquals(modelVersion.size(), 1);
        validateDetailedModelVersion(modelVersion.get(0),
                modelName, "Staging", "1");
    }

    @Test
    public void testGetModelVersion() {
        ModelVersion modelVersion = client.getModelVersion(modelName, "1");
        validateDetailedModelVersion(modelVersion, modelName, "Staging", "1");
    }

    @Test(expectedExceptions = MlflowHttpException.class, expectedExceptionsMessageRegExp = ".*RESOURCE_DOES_NOT_EXIST.*")
    public void testGetModelVersion_NotFound() {
        client.getModelVersion(modelName, "2");
    }

    @Test
    public void testGetRegisteredModel() {
	RegisteredModel model = client.getRegisteredModel(modelName);
	Assert.assertEquals(model.getName(), modelName);
	validateDetailedModelVersion(model.getLatestVersions(0), modelName, "Staging", "1" );
    }

    @Test
    public void testGetModelVersionDownloadUri() {
        String downloadUri = client.getModelVersionDownloadUri(modelName, "1");
        Assert.assertEquals(source, downloadUri);
    }

    @Test
    public void testDownloadModelVersion() throws IOException {
        File tempDownloadDir = client.downloadModelVersion(modelName, "1");
        File[] tempDownloadFile = tempDownloadDir.listFiles(filter);
        Assert.assertEquals(tempDownloadFile.length, 1);
        String downloadedContent = FileUtils.readFileToString(tempDownloadFile[0],
                StandardCharsets.UTF_8);
        Assert.assertEquals(content, downloadedContent);
    }

    @Test
    public void testDownloadLatestModelVersion() throws IOException {
        File tempDownloadDir = client.downloadLatestModelVersion(modelName, "None");
        File[] tempDownloadFile = tempDownloadDir.listFiles(filter);
        Assert.assertEquals(tempDownloadFile.length, 1);
        String downloadedContent = FileUtils.readFileToString(tempDownloadFile[0],
                StandardCharsets.UTF_8);
        Assert.assertEquals(content, downloadedContent);
    }

    @Test(expectedExceptions = MlflowClientException.class)
    public void testDownloadLatestModelVersionWhenMoreThanOneVersionIsReturned() {
        MlflowClient mockedClient = Mockito.spy(client);

        List<ModelVersion> modelVersions = Lists.newArrayList();
        modelVersions.add(ModelVersion.newBuilder().build());
        modelVersions.add(ModelVersion.newBuilder().build());
        doReturn(modelVersions).when(mockedClient).getLatestVersions(any(), any());

        mockedClient.downloadLatestModelVersion(modelName, "None");
    }

    private void validateDetailedModelVersion(ModelVersion details, String modelName,
                                              String stage, String version) {
        Assert.assertEquals(details.getCurrentStage(), stage);
        Assert.assertEquals(details.getName(), modelName);
        Assert.assertEquals(details.getVersion(), version);
    }

    @Test
    public void testSearchModelVersions() {
        List<ModelVersion> mvsBefore = client.searchModelVersions().getItems();

        // create new model version of existing registered model
        String newVersionRunId = "newVersionRunId";
        String newVersionSource = "runs:/newVersionRunId/model";
        client.sendPost("model-versions/create",
                mapper.makeCreateModelVersion(modelName, newVersionRunId, newVersionSource));

        // create new registered model
        String modelName2 = "modelName2";
        String runId2 = "runId2";
        String source2 = "runs:/runId2/model";
        client.sendPost("registered-models/create",
                mapper.makeCreateModel(modelName2));
        client.sendPost("model-versions/create",
                mapper.makeCreateModelVersion(modelName2, runId2, source2));

        List<ModelVersion> mvsAfter = client.searchModelVersions().getItems();
        Assert.assertEquals(mvsAfter.size(), 2 + mvsBefore.size());

        String filter1 = String.format("name = '%s'", modelName);
        List<ModelVersion> mvs1 = client.searchModelVersions(filter1).getItems();
        Assert.assertEquals(mvs1.size(), 2);
        Assert.assertEquals(mvs1.get(0).getName(), modelName);
        Assert.assertEquals(mvs1.get(1).getName(), modelName);

        String filter2 = String.format("name = '%s'", modelName2);
        List<ModelVersion> mvs2 = client.searchModelVersions(filter2).getItems();
        Assert.assertEquals(mvs2.size(), 1);
        Assert.assertEquals(mvs2.get(0).getName(), modelName2);
        Assert.assertEquals(mvs2.get(0).getVersion(), "1");

        String filter3 = String.format("run_id = '%s'", newVersionRunId);
        List<ModelVersion> mvs3 = client.searchModelVersions(filter3).getItems();
        Assert.assertEquals(mvs3.size(), 1);
        Assert.assertEquals(mvs3.get(0).getName(), modelName);
        Assert.assertEquals(mvs3.get(0).getVersion(), "2");

        ModelVersionsPage page1 = client.searchModelVersions(
            "", 1, Arrays.asList("creation_timestamp ASC")
        );
        Assert.assertEquals(page1.getItems().size(), 1);
        Assert.assertEquals(page1.getItems().get(0).getName(), modelName);
        Assert.assertTrue(page1.getNextPageToken().isPresent());

        ModelVersionsPage page2 = client.searchModelVersions(
            "",
            2,
            Arrays.asList("creation_timestamp ASC"),
            page1.getNextPageToken().get()
        );
        Assert.assertEquals(page2.getItems().size(), 2);
        Assert.assertEquals(page2.getItems().get(0).getName(), modelName);
        Assert.assertEquals(page2.getItems().get(0).getRunId(), newVersionRunId);
        Assert.assertEquals(page2.getItems().get(1).getName(), modelName2);
        Assert.assertEquals(page2.getItems().get(1).getRunId(), runId2);
        Assert.assertFalse(page2.getNextPageToken().isPresent());

        ModelVersionsPage nextPageFromPrevPage = (ModelVersionsPage) page1.getNextPage();
        Assert.assertEquals(nextPageFromPrevPage.getItems().size(), 1);
        Assert.assertEquals(page2.getItems().get(0).getName(), modelName);
        Assert.assertEquals(page2.getItems().get(0).getRunId(), newVersionRunId);
        Assert.assertTrue(nextPageFromPrevPage.getNextPageToken().isPresent());
    }
}
```

--------------------------------------------------------------------------------

---[FILE: TestClientProvider.java]---
Location: mlflow-master/mlflow/java/client/src/test/java/org/mlflow/tracking/TestClientProvider.java

```java
package org.mlflow.tracking;

import java.io.*;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.mlflow.tracking.creds.MlflowHostCredsProvider;

/**
 * Provides an MLflow API client for testing. This is a real client, pointed to a real server.
 * If the MLFLOW_TRACKING_URI environment variable is set, we will talk to the provided server;
 * this allows running tests against existing servers. Otherwise, we will launch a local
 * server on an ephemeral port, and manage its lifecycle.
 */
public class TestClientProvider {
  private static final Logger logger = LoggerFactory.getLogger(TestClientProvider.class);

  private static final long MAX_SERVER_WAIT_TIME_MILLIS = 60 * 1000;

  private Process serverProcess;

  private MlflowClient client;

  /**
   * Intializes an MLflow client and, if necessary, a local MLflow server process as well.
   * Callers should always call {@link #cleanupClientAndServer()}.
   */
  public MlflowClient initializeClientAndServer() throws IOException {
    if (serverProcess != null) {
      throw new IllegalStateException("Previous server process not cleaned up");
    }

    String trackingUri = System.getenv("MLFLOW_TRACKING_URI");
    if (trackingUri != null) {
      logger.info("MLFLOW_TRACKING_URI was set, test will run against that server");
      client = new MlflowClient(trackingUri);
      return client;
    } else {
      Path tempDir = Files.createTempDirectory(getClass().getSimpleName());
      String mlruns = tempDir.resolve("mlruns").toString();
      return startServerProcess(mlruns, mlruns);
    }
  }

  public MlflowClient initializeClientAndSqlLiteBasedServer() throws IOException {
    if (serverProcess != null) {
      throw new IllegalStateException("Previous server process not cleaned up");
    }

    String trackingUri = System.getenv("MLFLOW_TRACKING_URI");
    if (trackingUri != null) {
      logger.info("MLFLOW_TRACKING_URI was set, test will run against that server");
      client = new MlflowClient(trackingUri);
      return client;
    } else {
      Path tempDir = Files.createTempDirectory(getClass().getSimpleName());
      String tempDBFile = tempDir.resolve("sqldb").toAbsolutePath().toString();
      return startServerProcess("sqlite:///" + tempDBFile, tempDir.toString());
    }
  }

  /**
   * Performs any necessary cleanup on the client and server allocated by
   * {@link #initializeClientAndServer()}. This is safe to call even if the client/server were
   * not initialized successfully.
   */
  public void cleanupClientAndServer() throws InterruptedException {
    if (client != null) {
      client.close();
    }
    if (serverProcess == null) {
      return;
    }

    try {
      serverProcess.destroy();
      // Do our best to ensure that the
      boolean processTerminated = serverProcess.waitFor(30, TimeUnit.SECONDS);
      if (!processTerminated) {
        logger.warn("Server process did not terminate in 30 seconds, will forcibly destroy");
        serverProcess.destroyForcibly();
      }
    } catch (Exception ex) {
      logger.warn("Failed to destroy server process nicely.", ex);
      serverProcess.destroyForcibly();
    }
    serverProcess = null;
  }

  public MlflowHostCredsProvider getClientHostCredsProvider(MlflowClient client) {
    return client.getInternalHostCredsProvider();
  }

  /**
   * Launches an "mlflow server" process locally. This requires that the "mlflow" command
   * line client is on the local PATH (e.g., that we're within a conda environment), and that
   * we are allowed to bind to 127.0.0.1 on ephemeral ports.
   *
   * Standard out and error from the server will be streamed to System.out and System.err.
   *
   * This method will wait until the server is up and running
   * @param backendStoreUri the backend store uri to use
   * @param
   * @return MlflowClient pointed at the local server.
   */
  private MlflowClient startServerProcess(String backendStoreUri,
                                          String defaultArtifactRoot) throws IOException {
    ProcessBuilder pb = new ProcessBuilder();
    int freePort = getFreePort();
    String bindAddress = "127.0.0.1";
    pb.command("mlflow", "server",
            "--host", bindAddress,
            "--port", "" + freePort,
            "--backend-store-uri", backendStoreUri,
            "--workers", "1",
            "--default-artifact-root", defaultArtifactRoot);
    serverProcess = pb.start();

    // NB: We cannot use pb.inheritIO() because that interacts poorly with the Maven
    // Surefire test runner (it keeps waiting for more input/output indefinitely).
    // Therefore, we must manually drain the stdout and stderr streams.
    drainStream(serverProcess.getInputStream(), System.out, "mlflow-server-stdout-reader");
    drainStream(serverProcess.getErrorStream(), System.err, "mlflow-server-stderr-reader");

    logger.info("Awaiting start of server on port " + freePort);
    long startTime = System.nanoTime();
    while (System.nanoTime() - startTime < MAX_SERVER_WAIT_TIME_MILLIS * 1000 * 1000) {
      if (isPortOpen(bindAddress, freePort, 1)) {
        break;
      }
      try {
        Thread.sleep(1000);
      } catch (InterruptedException e) {
        throw new RuntimeException(e);
      }
    }
    if (!isPortOpen(bindAddress, freePort, 1)) {
      serverProcess.destroy();
      throw new IllegalStateException("Server failed to start on port " + freePort + " after "
        + MAX_SERVER_WAIT_TIME_MILLIS + " milliseconds.");
    }

    client = new MlflowClient("http://" + bindAddress + ":" + freePort);
    return client;
  }

  /** Launches a new daemon Thread to drain the given InputStream into the given OutputStream. */
  private void drainStream(InputStream inStream, PrintStream outStream, String threadName) {
    Thread drainThread = new Thread(threadName) {
      @Override
      public void run() {
        BufferedReader reader = new BufferedReader(new InputStreamReader(inStream,
          StandardCharsets.UTF_8));
        reader.lines().forEach(outStream::println);
        logger.info("Drain completed on " + threadName);
      }
    };
    drainThread.setDaemon(true);
    drainThread.start();
  }

  /** Returns an ephemeral port which is very likely to be free, even in cases of contention. */
  private int getFreePort() throws IOException {
    // *nix systems rarely reuse recently allocated ports, so we allocate one and then release it.
    ServerSocket sock = new ServerSocket(0);
    int port = sock.getLocalPort();
    sock.close();
    return port;
  }

  /**
   * Checks if a server is listening on the given host and port. This simply attempts to establish
   * a TCP connection and returns false if it fails to do so within timeoutSeconds.
   */
  private boolean isPortOpen(String host, int port, int timeoutSeconds) {
    try {
      String ip = InetAddress.getByName(host).getHostAddress();
      Socket socket = new Socket();
      socket.connect(new InetSocketAddress(ip, port), timeoutSeconds * 1000);
      socket.close();
    } catch (IOException e) {
      return false;
    }
    return true;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: TestUtils.java]---
Location: mlflow-master/mlflow/java/client/src/test/java/org/mlflow/tracking/TestUtils.java

```java
package org.mlflow.tracking;

import java.util.*;

import org.testng.Assert;

import org.mlflow.api.proto.Service.*;

public class TestUtils {

  final static double EPSILON = 0.0001F;

  static boolean equals(double a, double b) {
    return a == b ? true : Math.abs(a - b) < EPSILON;
  }

  static void assertRunInfo(RunInfo runInfo, String experimentId) {
    Assert.assertEquals(runInfo.getExperimentId(), experimentId);
    Assert.assertNotEquals(runInfo.getUserId(), "");
    Assert.assertTrue(runInfo.getStartTime() < runInfo.getEndTime());
  }

  public static void assertParam(List<Param> params, String key, String value) {
    Assert.assertTrue(params.stream().filter(e -> e.getKey().equals(key) && e.getValue().equals(value)).findFirst().isPresent());
  }

  public static void assertMetric(List<Metric> metrics, String key, double value) {

    if (Double.isNaN(value)) {
      Assert.assertTrue(metrics.stream().filter(e -> e.getKey().equals(key) && Double.isNaN(e.getValue())).findFirst().isPresent());
    } else if(Double.isInfinite(value) && value > 0) {
      Assert.assertTrue(metrics.stream().filter(e -> e.getKey().equals(key) && e.getValue() >= Double.MAX_VALUE).findFirst().isPresent());
    } else if(Double.isInfinite(value) && value < 0) {
      Assert.assertTrue(metrics.stream().filter(e -> e.getKey().equals(key) && e.getValue() <= -Double.MAX_VALUE).findFirst().isPresent());
    } else {
      Assert.assertTrue(metrics.stream().filter(e -> e.getKey().equals(key) && equals(e.getValue(), value)).findFirst().isPresent());
    }
  }

  public static void assertMetric(List<Metric> metrics, String key, double value, long timestamp, long step) {
    Assert.assertTrue(metrics.stream().filter(
      e -> e.getKey().equals(key) && equals(e.getValue(), value) && equals(e.getTimestamp(), timestamp)
      && equals(e.getStep(), step)).findFirst().isPresent());
  }

  public static void assertMetricHistory(List<Metric> history, String key, List<Double> values, List<Long> steps) {
    Assert.assertEquals(history.size(), values.size());
    Assert.assertEquals(history.size(), steps.size());
    for (int i = 0; i < history.size(); i++) {
      Metric metric = history.get(i);
      Assert.assertEquals(metric.getKey(), key);
      Assert.assertTrue(equals(metric.getValue(), values.get(i)));
      Assert.assertTrue(equals(metric.getStep(), steps.get(i)));
    }
  }

  public static void assertMetricHistory(List<Metric> history, String key, List<Double> values, List<Long> timestamps, List<Long> steps) {
    assertMetricHistory(history, key, values, steps);
    for(int i = 0; i < history.size(); ++i) {
      Assert.assertTrue(equals(history.get(i).getTimestamp(), timestamps.get(i)));
    }
  }

  public static void assertTag(List<RunTag> tags, String key, String value) {
    Assert.assertTrue(tags.stream().filter(e -> e.getKey().equals(key) && e.getValue().equals(value)).findFirst().isPresent());
  }
  public static java.util.Optional<Experiment> getExperimentByName(List<Experiment> exps, String expName) {
    return exps.stream().filter(e -> e.getName().equals(expName)).findFirst();
  }

  static public String createExperimentName() {
    return "JavaTestExp_" + UUID.randomUUID().toString();
  }

  public static Metric createMetric(String name, double value, long timestamp, long step) {
    Metric.Builder builder = Metric.newBuilder();
    builder.setKey(name).setValue(value).setTimestamp(timestamp);
    builder.setKey(name).setValue(value).setStep(step);
    return builder.build();
  }

  public static Param createParam(String name, String value) {
    Param.Builder builder = Param.newBuilder();
    builder.setKey(name).setValue(value);
    return builder.build();
  }

  public static RunTag createTag(String name, String value) {
    RunTag.Builder builder = RunTag.newBuilder();
    builder.setKey(name).setValue(value);
    return builder.build();
  }
}
```

--------------------------------------------------------------------------------

---[FILE: DatabricksConfigHostCredsProviderTest.java]---
Location: mlflow-master/mlflow/java/client/src/test/java/org/mlflow/tracking/creds/DatabricksConfigHostCredsProviderTest.java

```java
package org.mlflow.tracking.creds;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

import org.apache.commons.io.FileUtils;
import org.testng.Assert;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeSuite;
import org.testng.annotations.Test;

public class DatabricksConfigHostCredsProviderTest {
  private String previousUserHome = null;
  private File databrickscfg = null;

  @BeforeSuite
  public void beforeAll() throws IOException {
    previousUserHome = System.getProperty("user.home");
    Path tempDir = Files.createTempDirectory(getClass().getSimpleName());
    databrickscfg = tempDir.resolve(".databrickscfg").toFile();
    System.setProperty("user.home", tempDir.toString());
  }

  @AfterSuite
  public void afterAll() {
    if (previousUserHome != null) {
      System.setProperty("user.home", previousUserHome);
    }
  }

  @Test
  public void testGetTokenFromDefault() throws IOException {
    String contents = "[DEFAULT]\nhost = https://boop.com\ntoken = dapi\n";
    FileUtils.writeStringToFile(databrickscfg, contents, StandardCharsets.UTF_8);
    DatabricksConfigHostCredsProvider provider = new DatabricksConfigHostCredsProvider();
    Assert.assertEquals(provider.getHostCreds().getHost(), "https://boop.com");
    Assert.assertEquals(provider.getHostCreds().getToken(), "dapi");

    String contents2 = "[DEFAULT]\nhost = https://boop.com\ntoken=dapi2\ninsecure = TrUe";
    FileUtils.writeStringToFile(databrickscfg, contents2, StandardCharsets.UTF_8);
    Assert.assertEquals(provider.getHostCreds().getToken(), "dapi");
    Assert.assertFalse(provider.getHostCreds().shouldIgnoreTlsVerification());
    provider.refresh();
    Assert.assertEquals(provider.getHostCreds().getToken(), "dapi2");
    Assert.assertTrue(provider.getHostCreds().shouldIgnoreTlsVerification());
  }

  @Test
  public void testGetUserPassFromProfile() throws IOException {
    String contents = "[myprof]\nhost = https://boop.com\nusername = Bob\npassword = Ross\n";
    FileUtils.writeStringToFile(databrickscfg, contents, StandardCharsets.UTF_8);
    DatabricksConfigHostCredsProvider provider = new DatabricksConfigHostCredsProvider("myprof");
    Assert.assertEquals(provider.getHostCreds().getHost(), "https://boop.com");
    Assert.assertEquals(provider.getHostCreds().getUsername(), "Bob");
    Assert.assertEquals(provider.getHostCreds().getPassword(), "Ross");

    try {
      new DatabricksConfigHostCredsProvider().getHostCreds();
      Assert.fail();
    } catch (IllegalStateException e) {
      Assert.assertTrue(e.getMessage().contains("Could not find 'DEFAULT'"), e.getMessage());
    }

    try {
      new DatabricksConfigHostCredsProvider("blah").getHostCreds();
      Assert.fail();
    } catch (IllegalStateException e) {
      Assert.assertTrue(e.getMessage().contains("Could not find 'blah'"), e.getMessage());
    }
  }

  @Test
  public void testProfileNoHost() throws IOException {
    String contents = "[DEFAULT]\ntoken = dabi\n";
    FileUtils.writeStringToFile(databrickscfg, contents, StandardCharsets.UTF_8);
    try {
      new DatabricksConfigHostCredsProvider().getHostCreds();
      Assert.fail();
    } catch (IllegalStateException e) {
      Assert.assertTrue(e.getMessage().contains("No 'host' configured"), e.getMessage());
    }
  }

  @Test
  public void testProfileNoAuth() throws IOException {
    String contents = "[DEFAULT]\nhost = foo\n";
    FileUtils.writeStringToFile(databrickscfg, contents, StandardCharsets.UTF_8);
    try {
      new DatabricksConfigHostCredsProvider().getHostCreds();
      Assert.fail();
    } catch (IllegalStateException e) {
      Assert.assertTrue(e.getMessage().contains("No authentication configured"), e.getMessage());
    }
  }

  @Test
  public void testProfileNoFile() throws IOException {
    databrickscfg.delete();
    try {
      new DatabricksConfigHostCredsProvider().getHostCreds();
      Assert.fail();
    } catch (IllegalStateException e) {
      Assert.assertTrue(e.getMessage().contains("Could not find Databricks configuration file"),
        e.getMessage());
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: DatabricksDynamicHostCredsProviderTest.java]---
Location: mlflow-master/mlflow/java/client/src/test/java/org/mlflow/tracking/creds/DatabricksDynamicHostCredsProviderTest.java

```java
package org.mlflow.tracking.creds;

import java.util.AbstractMap;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.testng.Assert;
import org.testng.annotations.Test;

public class DatabricksDynamicHostCredsProviderTest {
  private static Map<String, String> baseMap = new HashMap<>();
  public static class MyDynamicProvider extends AbstractMap<String, String> {
    @Override
    public Set<Map.Entry<String, String>> entrySet() {
      return baseMap.entrySet();
    }
  }

  @Test
  public void testUpdatesAfterPut() {
    baseMap.put("host", "hello");
    MlflowHostCredsProvider provider = DatabricksDynamicHostCredsProvider.createIfAvailable(
      MyDynamicProvider.class.getName());
    Assert.assertNotNull(provider);
    Assert.assertEquals(provider.getHostCreds().getHost(), "hello");
    Assert.assertNull(provider.getHostCreds().getToken());

    baseMap.put("token", "toke");
    Assert.assertEquals(provider.getHostCreds().getHost(), "hello");
    Assert.assertEquals(provider.getHostCreds().getToken(), "toke");

    baseMap.put("token", "toke2");
    Assert.assertEquals(provider.getHostCreds().getHost(), "hello");
    Assert.assertEquals(provider.getHostCreds().getToken(), "toke2");
  }

  @Test
  public void testUsernamePassword() {
    baseMap.put("host", "hello");
    baseMap.put("username", "boop");
    baseMap.put("password", "beep");
    MlflowHostCredsProvider provider = DatabricksDynamicHostCredsProvider.createIfAvailable(
      MyDynamicProvider.class.getName());
    Assert.assertNotNull(provider);
    Assert.assertEquals(provider.getHostCreds().getHost(), "hello");
    Assert.assertEquals(provider.getHostCreds().getUsername(), "boop");
    Assert.assertEquals(provider.getHostCreds().getPassword(), "beep");
  }

  @Test
  public void testTlsInsecure() {
    baseMap.put("host", "hello");
    MlflowHostCredsProvider provider = DatabricksDynamicHostCredsProvider.createIfAvailable(
      MyDynamicProvider.class.getName());
    Assert.assertNotNull(provider);
    Assert.assertEquals(provider.getHostCreds().getHost(), "hello");
    Assert.assertFalse(provider.getHostCreds().shouldIgnoreTlsVerification());

    baseMap.put("shouldIgnoreTlsVerification", "true");
    Assert.assertTrue(provider.getHostCreds().shouldIgnoreTlsVerification());

    baseMap.put("shouldIgnoreTlsVerification", "false");
    Assert.assertFalse(provider.getHostCreds().shouldIgnoreTlsVerification());
  }
}
```

--------------------------------------------------------------------------------

---[FILE: HostCredsProviderChainTest.java]---
Location: mlflow-master/mlflow/java/client/src/test/java/org/mlflow/tracking/creds/HostCredsProviderChainTest.java

```java
package org.mlflow.tracking.creds;

import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import org.mlflow.tracking.MlflowClientException;

public class HostCredsProviderChainTest {
  private boolean refreshCalled = false;
  private boolean throwException = false;
  private MlflowHostCreds providedHostCreds = null;
  private MlflowHostCredsProvider myHostCredsProvider = new MyHostCredsProvider();

  class MyHostCredsProvider implements MlflowHostCredsProvider {
    @Override
    public MlflowHostCreds getHostCreds() {
      if (throwException) {
        throw new IllegalStateException("Oh no!");
      }
      return providedHostCreds;
    }

    @Override
    public void refresh() {
      refreshCalled = true;
    }
  }

  @BeforeMethod
  public void beforeEach() {
    refreshCalled = false;
    throwException = false;
    providedHostCreds = null;
  }

  @Test
  public void testUseFirstIfAvailable() {
    BasicMlflowHostCreds secondCreds = new BasicMlflowHostCreds("hosty", "tokeny");
    HostCredsProviderChain chain = new HostCredsProviderChain(myHostCredsProvider, secondCreds);

    // If we have valid credentials, we should be used.
    providedHostCreds = new BasicMlflowHostCreds("new-host");
    Assert.assertEquals(chain.getHostCreds().getHost(), "new-host");
    Assert.assertNull(chain.getHostCreds().getToken());

    // If our credentials are invalid, we should be skipped.
    providedHostCreds = new BasicMlflowHostCreds(null);
    Assert.assertEquals(chain.getHostCreds().getHost(), "hosty");
    Assert.assertEquals(chain.getHostCreds().getToken(), "tokeny");

    // If we return null, we should be skipped.
    providedHostCreds = null;
    Assert.assertEquals(chain.getHostCreds().getHost(), "hosty");
    Assert.assertEquals(chain.getHostCreds().getToken(), "tokeny");

    // If we return an exception, we should be skipped.
    throwException = true;
    Assert.assertEquals(chain.getHostCreds().getHost(), "hosty");
    Assert.assertEquals(chain.getHostCreds().getToken(), "tokeny");
  }

  @Test
  public void testRefreshPropagates() {
    HostCredsProviderChain chain = new HostCredsProviderChain(myHostCredsProvider);
    Assert.assertFalse(refreshCalled);
    chain.refresh();
    Assert.assertTrue(refreshCalled);
  }

  @Test
  public void testThrowFinalError() {
    throwException = true;
    HostCredsProviderChain chain = new HostCredsProviderChain(myHostCredsProvider);
    try {
      chain.getHostCreds().getHost();
    } catch (MlflowClientException e) {
      Assert.assertTrue(e.getMessage().contains("Oh no!"), e.getMessage());
    }
  }
}
```

--------------------------------------------------------------------------------

````
