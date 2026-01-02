---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 306
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 306 of 991)

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

---[FILE: BasicMlflowHostCreds.java]---
Location: mlflow-master/mlflow/java/client/src/main/java/org/mlflow/tracking/creds/BasicMlflowHostCreds.java

```java
package org.mlflow.tracking.creds;

/** A static hostname and optional credentials to talk to an MLflow server. */
public class BasicMlflowHostCreds implements MlflowHostCreds, MlflowHostCredsProvider {
  private String host;
  private String username;
  private String password;
  private String token;
  private boolean shouldIgnoreTlsVerification;

  public BasicMlflowHostCreds(String host) {
    this.host = host;
  }

  public BasicMlflowHostCreds(String host, String username, String password) {
    this.host = host;
    this.username = username;
    this.password = password;
  }

  public BasicMlflowHostCreds(String host, String token) {
    this.host = host;
    this.token = token;
  }

  public BasicMlflowHostCreds(
      String host,
      String username,
      String password,
      String token,
      boolean shouldIgnoreTlsVerification) {
    this.host = host;
    this.username = username;
    this.password = password;
    this.token = token;
    this.shouldIgnoreTlsVerification = shouldIgnoreTlsVerification;
  }

  @Override
  public String getHost() {
    return host;
  }

  @Override
  public String getUsername() {
    return username;
  }

  @Override
  public String getPassword() {
    return password;
  }

  @Override
  public String getToken() {
    return token;
  }

  @Override
  public boolean shouldIgnoreTlsVerification() {
    return shouldIgnoreTlsVerification;
  }

  @Override
  public MlflowHostCreds getHostCreds() {
    return this;
  }

  @Override
  public void refresh() {
    // no-op
  }
}
```

--------------------------------------------------------------------------------

---[FILE: DatabricksConfigHostCredsProvider.java]---
Location: mlflow-master/mlflow/java/client/src/main/java/org/mlflow/tracking/creds/DatabricksConfigHostCredsProvider.java

```java
package org.mlflow.tracking.creds;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;

import org.ini4j.Ini;
import org.ini4j.Profile;

public class DatabricksConfigHostCredsProvider extends DatabricksHostCredsProvider {
  private static final String CONFIG_FILE_ENV_VAR = "DATABRICKS_CONFIG_FILE";

  private final String profile;

  private DatabricksMlflowHostCreds hostCreds;

  public DatabricksConfigHostCredsProvider(String profile) {
    this.profile = profile;
  }

  public DatabricksConfigHostCredsProvider() {
    this.profile = null;
  }

  private void loadConfigIfNecessary() {
    if (hostCreds == null) {
      reloadConfig();
    }
  }

  private void reloadConfig() {
    String basePath = System.getenv(CONFIG_FILE_ENV_VAR);
    if (basePath == null) {
      String userHome = System.getProperty("user.home");
      basePath = Paths.get(userHome, ".databrickscfg").toString();
    }

    if (!new File(basePath).isFile()) {
      throw new IllegalStateException("Could not find Databricks configuration file" +
        " (" + basePath + "). Please run 'databricks configure' using the Databricks CLI.");
    }

    Ini ini;
    try {
      ini = new Ini(new File(basePath));
    } catch (IOException e) {
      throw new IllegalStateException("Failed to load databrickscfg file at " + basePath, e);
    }

    Profile.Section section;
    if (profile == null) {
      section = ini.get("DEFAULT");
      if (section == null) {
        throw new IllegalStateException("Could not find 'DEFAULT' section within config file" +
          " (" + basePath + "). Please run 'databricks configure' using the Databricks CLI.");
      }
    } else {
      section = ini.get(profile);
      if (section == null) {
        throw new IllegalStateException("Could not find '" + profile + "' section within config" +
          " file  (" + basePath + "). Please run 'databricks configure --profile " + profile + "'" +
          " using the Databricks CLI.");
      }
    }
    assert (section != null);

    String host = section.get("host");
    String username = section.get("username");
    String password = section.get("password");
    String token = section.get("token");
    boolean insecure = section.get("insecure", "false").toLowerCase().equals("true");

    if (host == null) {
      throw new IllegalStateException("No 'host' configured within Databricks config file" +
        " (" + basePath + "). Please run 'databricks configure' using the Databricks CLI.");
    }

    boolean hasValidUserPassword = username != null && password != null;
    boolean hasValidToken = token != null;
    if (!hasValidUserPassword && !hasValidToken) {
      throw new IllegalStateException("No authentication configured within Databricks config file" +
        " (" + basePath + "). Please run 'databricks configure' using the Databricks CLI.");
    }

    this.hostCreds = new DatabricksMlflowHostCreds(host, username, password, token, insecure);
  }

  @Override
  public DatabricksMlflowHostCreds getHostCreds() {
    loadConfigIfNecessary();
    return hostCreds;
  }

  @Override
  public void refresh() {
    reloadConfig();
  }
}
```

--------------------------------------------------------------------------------

---[FILE: DatabricksDynamicHostCredsProvider.java]---
Location: mlflow-master/mlflow/java/client/src/main/java/org/mlflow/tracking/creds/DatabricksDynamicHostCredsProvider.java

```java
package org.mlflow.tracking.creds;

import java.util.Map;

import com.google.common.annotations.VisibleForTesting;
import org.mlflow.tracking.utils.DatabricksContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DatabricksDynamicHostCredsProvider extends DatabricksHostCredsProvider {
  private static final Logger logger = LoggerFactory.getLogger(
    DatabricksDynamicHostCredsProvider.class);

  private final Map<String, String> configProvider;

  private DatabricksDynamicHostCredsProvider(Map<String, String> configProvider) {
    this.configProvider = configProvider;
  }

  public static DatabricksDynamicHostCredsProvider createIfAvailable() {
    return createIfAvailable(DatabricksContext.CONFIG_PROVIDER_CLASS_NAME);
  }

  @VisibleForTesting
  static DatabricksDynamicHostCredsProvider createIfAvailable(String className) {
    Map<String, String> configProvider =
      DatabricksContext.getConfigProviderIfAvailable(className);
    if (configProvider == null) {
      return null;
    }
    return new DatabricksDynamicHostCredsProvider(configProvider);
  }

  @Override
  public DatabricksMlflowHostCreds getHostCreds() {
    return new DatabricksMlflowHostCreds(
      configProvider.get("host"),
      configProvider.get("username"),
      configProvider.get("password"),
      configProvider.get("token"),
      "true".equals(configProvider.get("shouldIgnoreTlsVerification"))
    );
  }

  @Override
  public void refresh() {
    // no-op
  }
}
```

--------------------------------------------------------------------------------

---[FILE: DatabricksHostCredsProvider.java]---
Location: mlflow-master/mlflow/java/client/src/main/java/org/mlflow/tracking/creds/DatabricksHostCredsProvider.java

```java
package org.mlflow.tracking.creds;

abstract class DatabricksHostCredsProvider implements MlflowHostCredsProvider {

  @Override
  public abstract DatabricksMlflowHostCreds getHostCreds();

  @Override
  public abstract void refresh();

}
```

--------------------------------------------------------------------------------

---[FILE: DatabricksMlflowHostCreds.java]---
Location: mlflow-master/mlflow/java/client/src/main/java/org/mlflow/tracking/creds/DatabricksMlflowHostCreds.java

```java
package org.mlflow.tracking.creds;

/** Credentials to talk to a Databricks-hosted MLflow server. */
public final class DatabricksMlflowHostCreds extends BasicMlflowHostCreds {

  public DatabricksMlflowHostCreds(String host, String username, String password) {
    super(host, username, password);
  }

  public DatabricksMlflowHostCreds(String host, String token) {
    super(host, token);
  }

  public DatabricksMlflowHostCreds(
      String host,
      String username,
      String password,
      String token,
      boolean shouldIgnoreTlsVerification) {
    super(host, username, password, token, shouldIgnoreTlsVerification);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: HostCredsProviderChain.java]---
Location: mlflow-master/mlflow/java/client/src/main/java/org/mlflow/tracking/creds/HostCredsProviderChain.java

```java
package org.mlflow.tracking.creds;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.mlflow.tracking.MlflowClientException;

public class HostCredsProviderChain implements MlflowHostCredsProvider {
  private static final Logger logger = LoggerFactory.getLogger(HostCredsProviderChain.class);

  private final List<MlflowHostCredsProvider> hostCredsProviders = new ArrayList<>();

  public HostCredsProviderChain(MlflowHostCredsProvider... hostCredsProviders) {
    this.hostCredsProviders.addAll(Arrays.asList(hostCredsProviders));
  }

  @Override
  public MlflowHostCreds getHostCreds() {
    List<String> exceptionMessages = new ArrayList<>();
    for (MlflowHostCredsProvider provider : hostCredsProviders) {
      try {
        MlflowHostCreds hostCreds = provider.getHostCreds();

        if (hostCreds != null && hostCreds.getHost() != null) {
          logger.debug("Loading credentials from " + provider.toString());
          return hostCreds;
        }
      } catch (Exception e) {
        String message = provider + ": " + e.getMessage();
        logger.debug("Unable to load credentials from " + message);
        exceptionMessages.add(message);
      }
    }
    throw new MlflowClientException("Unable to load MLflow Host/Credentials from any provider in" +
      " the chain: " + exceptionMessages);
  }

  @Override
  public void refresh() {
    for (MlflowHostCredsProvider provider : hostCredsProviders) {
      provider.refresh();
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: MlflowHostCreds.java]---
Location: mlflow-master/mlflow/java/client/src/main/java/org/mlflow/tracking/creds/MlflowHostCreds.java

```java
package org.mlflow.tracking.creds;

/**
 * Provides a hostname and optional authentication for talking to an MLflow server.
 */
public interface MlflowHostCreds {
  /** Hostname (e.g., http://localhost:5000) to MLflow server. */
  String getHost();

  /**
   * Username to use with Basic authentication when talking to server.
   * If this is specified, password must also be specified.
   */
  String getUsername();

  /**
   * Password to use with Basic authentication when talking to server.
   * If this is specified, username must also be specified.
   */
  String getPassword();

  /**
   * Token to use with Bearer authentication when talking to server.
   * If provided, user/password authentication will be ignored.
   */
  String getToken();

  /**
   * If true, we will not verify the server's hostname or TLS certificate.
   * This is useful for certain testing situations, but should never be true in production.
   */
  boolean shouldIgnoreTlsVerification();
}
```

--------------------------------------------------------------------------------

---[FILE: MlflowHostCredsProvider.java]---
Location: mlflow-master/mlflow/java/client/src/main/java/org/mlflow/tracking/creds/MlflowHostCredsProvider.java

```java
package org.mlflow.tracking.creds;

/** Provides a dynamic, refreshable set of MlflowHostCreds. */
public interface MlflowHostCredsProvider {

  /** Returns a valid MlflowHostCreds. This may be cached. */
  MlflowHostCreds getHostCreds();

  /** Refreshes the underlying credentials. May be a no-op. */
  void refresh();
}
```

--------------------------------------------------------------------------------

---[FILE: package-info.java]---
Location: mlflow-master/mlflow/java/client/src/main/java/org/mlflow/tracking/creds/package-info.java

```java
/** Support for custom tracking service discovery and authentication. */
package org.mlflow.tracking.creds;
```

--------------------------------------------------------------------------------

---[FILE: FluentExample.java]---
Location: mlflow-master/mlflow/java/client/src/main/java/org/mlflow/tracking/samples/FluentExample.java

```java
package org.mlflow.tracking.samples;

import com.google.common.collect.ImmutableMap;
import org.mlflow.tracking.ActiveRun;
import org.mlflow.tracking.MlflowContext;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class FluentExample {
  public static void main(String[] args) {
    MlflowContext mlflow = new MlflowContext();
    ExecutorService executor = Executors.newFixedThreadPool(10);

    // Vanilla usage
    {
      ActiveRun run = mlflow.startRun("run");
      run.logParam("alpha", "0.0");
      run.logMetric("MSE", 0.0);
      run.setTags(ImmutableMap.of(
        "company", "databricks",
        "org", "engineering"
      ));
      run.endRun();
    }

    // Lambda usage
    {
      mlflow.withActiveRun("lambda run", (activeRun -> {
        activeRun.logParam("layers", "4");
        // Perform training code
      }));
    }
    // Log one parent run and 5 children run
    {
      ActiveRun run = mlflow.startRun("parent run");
      for (int i = 0; i <= 5; i++) {
        ActiveRun childRun = mlflow.startRun("child run", run.getId());
        childRun.logParam("iteration", Integer.toString(i));
        childRun.endRun();
      }
      run.endRun();
    }

    // Log one parent run and 5 children run (multithreaded)
    {
      ActiveRun run = mlflow.startRun("parent run (multithreaded)");
      for (int i = 0; i <= 5; i++) {
        final int i0 = i;
        executor.submit(() -> {
          ActiveRun childRun = mlflow.startRun("child run (multithreaded)", run.getId());
          childRun.logParam("iteration", Integer.toString(i0));
          childRun.endRun();
        });
      }
      run.endRun();
    }
    executor.shutdown();
    mlflow.getClient().close();
  }
}
```

--------------------------------------------------------------------------------

---[FILE: QuickStartDriver.java]---
Location: mlflow-master/mlflow/java/client/src/main/java/org/mlflow/tracking/samples/QuickStartDriver.java

```java
package org.mlflow.tracking.samples;

import java.util.List;
import java.util.Optional;

import org.mlflow.api.proto.Service.*;
import org.mlflow.tracking.MlflowClient;

/**
 * This is an example application which uses the MLflow Tracking API to create and manage
 * experiments and runs.
 */
public class QuickStartDriver {
  public static void main(String[] args) throws Exception {
    (new QuickStartDriver()).process(args);
  }

  void process(String[] args) throws Exception {
    MlflowClient client;
    if (args.length < 1) {
      client = new MlflowClient();
    } else {
      client = new MlflowClient(args[0]);
    }

    System.out.println("====== createExperiment");
    String expName = "Exp_" + System.currentTimeMillis();
    String expId = client.createExperiment(expName);
    System.out.println("createExperiment: expId=" + expId);

    System.out.println("====== getExperiment");
    Experiment exp = client.getExperiment(expId);
    System.out.println("getExperiment: " + exp);

    System.out.println("====== searchExperiments");
    List<Experiment> exps = client.searchExperiments().getItems();
    System.out.println("#experiments: " + exps.size());
    exps.forEach(e -> System.out.println("  Exp: " + e));

    createRun(client, expId);

    System.out.println("====== getExperiment again");
    Experiment exp2 = client.getExperiment(expId);
    System.out.println("getExperiment: " + exp2);

    System.out.println("====== getExperiment by name");
    Optional<Experiment> exp3 = client.getExperimentByName(expName);
    System.out.println("getExperimentByName: " + exp3);
    client.close();
  }

  void createRun(MlflowClient client, String expId) {
    System.out.println("====== createRun");

    // Create run
    String sourceFile = "MyFile.java";

    RunInfo runCreated = client.createRun(expId);
    System.out.println("CreateRun: " + runCreated);
    String runId = runCreated.getRunUuid();

    // Log parameters
    client.logParam(runId, "min_samples_leaf", "2");
    client.logParam(runId, "max_depth", "3");

    // Log metrics
    client.logMetric(runId, "auc", 2.12F);
    client.logMetric(runId, "accuracy_score", 3.12F);
    client.logMetric(runId, "zero_one_loss", 4.12F);

    // Update finished run
    client.setTerminated(runId, RunStatus.FINISHED);

    // Get run details
    Run run = client.getRun(runId);
    System.out.println("GetRun: " + run);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: DatabricksContext.java]---
Location: mlflow-master/mlflow/java/client/src/main/java/org/mlflow/tracking/utils/DatabricksContext.java

```java
package org.mlflow.tracking.utils;

import com.google.common.annotations.VisibleForTesting;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

public class DatabricksContext {
  public static final String CONFIG_PROVIDER_CLASS_NAME =
    "com.databricks.config.DatabricksClientSettingsProvider";
  private static final Logger logger = LoggerFactory.getLogger(
    DatabricksContext.class);
  private final Map<String, String> configProvider;

  private DatabricksContext(Map<String, String> configProvider) {
    this.configProvider = configProvider;
  }

  public static DatabricksContext createIfAvailable() {
    return createIfAvailable(CONFIG_PROVIDER_CLASS_NAME);
  }

  @VisibleForTesting
  static DatabricksContext createIfAvailable(String className) {
    Map<String, String> configProvider = getConfigProviderIfAvailable(className);
    if (configProvider == null) {
      return null;
    }
    return new DatabricksContext(configProvider);
  }

  public Map<String, String> getTags() {
    if (isInDatabricksNotebook()) {
      return getTagsForDatabricksNotebook();
    } else if (isInDatabricksJob()) {
      return getTagsForDatabricksJob();
    } else {
      return new HashMap<>();
    }
  }

  public boolean isInDatabricksNotebook() {
    return configProvider.get("notebookId") != null;
  }

  /**
   * Should only be called if isInDatabricksNotebook() is true.
   */
  private Map<String, String> getTagsForDatabricksNotebook() {
    Map<String, String> tagsForNotebook = new HashMap<>();
    String notebookId = getNotebookId();
    if (notebookId != null) {
      tagsForNotebook.put(MlflowTagConstants.DATABRICKS_NOTEBOOK_ID, notebookId);
    }
    String notebookPath = configProvider.get("notebookPath");
    if (notebookPath != null) {
      tagsForNotebook.put(MlflowTagConstants.SOURCE_NAME, notebookPath);
      tagsForNotebook.put(MlflowTagConstants.DATABRICKS_NOTEBOOK_PATH, notebookPath);
      tagsForNotebook.put(MlflowTagConstants.SOURCE_TYPE, "NOTEBOOK");
    }
    String webappUrl = configProvider.get("host");
    if (webappUrl != null) {
      tagsForNotebook.put(MlflowTagConstants.DATABRICKS_WEBAPP_URL, webappUrl);
    }
    return tagsForNotebook;
  }

  /**
   * Should only be called if isInDatabricksNotebook() is true.
   */
  public String getNotebookId() {
    if (!isInDatabricksNotebook()) {
      throw new IllegalArgumentException(
        "getNotebookId() should not be called when isInDatabricksNotebook() is false"
      );
    }
    return configProvider.get("notebookId");
  }

  public String getNotebookPath() {
    if (!isInDatabricksNotebook()) {
      throw new IllegalArgumentException(
        "getNotebookPath() should not be called when isInDatabricksNotebook() is false"
      );
    }
    return configProvider.get("notebookPath");
  }

  private boolean isInDatabricksJob() {
    return configProvider.get("jobId") != null;
  }

  /**
   * Should only be called if isInDatabricksJob() is true.
   */
  private Map<String, String> getTagsForDatabricksJob() {
    Map<String, String> tagsForJob = new HashMap<>();
    String jobId = configProvider.get("jobId");
    String jobRunId = configProvider.get("jobRunId");
    String jobType = configProvider.get("jobType");
    String webappUrl = configProvider.get("host");
    if (jobId != null && jobRunId != null) {
      tagsForJob.put(MlflowTagConstants.DATABRICKS_JOB_ID, jobId);
      tagsForJob.put(MlflowTagConstants.DATABRICKS_JOB_RUN_ID, jobRunId);
      tagsForJob.put(MlflowTagConstants.SOURCE_TYPE, "JOB");
      tagsForJob.put(MlflowTagConstants.SOURCE_NAME,
                          String.format("jobs/%s/run/%s", jobId, jobRunId));
    }
    if (jobType != null) {
      tagsForJob.put(MlflowTagConstants.DATABRICKS_JOB_TYPE, jobType);
    }
    if (webappUrl != null) {
      tagsForJob.put(MlflowTagConstants.DATABRICKS_WEBAPP_URL, webappUrl);
    }
    return tagsForJob;
  }

  public static Map<String, String> getConfigProviderIfAvailable(String className) {
    try {
      Class<?> cls = Class.forName(className);
      return (Map<String, String>) cls.newInstance();
    } catch (ClassNotFoundException e) {
      return null;
    } catch (IllegalAccessException | InstantiationException e) {
      logger.warn("Found but failed to invoke dynamic config provider", e);
      return null;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: MlflowTagConstants.java]---
Location: mlflow-master/mlflow/java/client/src/main/java/org/mlflow/tracking/utils/MlflowTagConstants.java

```java
package org.mlflow.tracking.utils;

public class MlflowTagConstants {
  public static final String PARENT_RUN_ID = "mlflow.parentRunId";
  public static final String RUN_NAME = "mlflow.runName";
  public static final String USER = "mlflow.user";
  public static final String SOURCE_TYPE = "mlflow.source.type";
  public static final String SOURCE_NAME = "mlflow.source.name";
  public static final String DATABRICKS_NOTEBOOK_ID = "mlflow.databricks.notebookID";
  public static final String DATABRICKS_NOTEBOOK_PATH = "mlflow.databricks.notebookPath";
  // The JOB_ID, JOB_RUN_ID, and JOB_TYPE tags are used for automatically recording Job 
  // information when MLflow Tracking APIs are used within a Databricks Job
  public static final String DATABRICKS_JOB_ID = "mlflow.databricks.jobID";
  public static final String DATABRICKS_JOB_RUN_ID = "mlflow.databricks.jobRunID";
  public static final String DATABRICKS_JOB_TYPE = "mlflow.databricks.jobType";
  public static final String DATABRICKS_WEBAPP_URL = "mlflow.databricks.webappURL";
  public static final String MLFLOW_EXPERIMENT_SOURCE_TYPE = "mlflow.experiment.sourceType";
  public static final String MLFLOW_EXPERIMENT_SOURCE_ID = "mlflow.experiment.sourceId";
}
```

--------------------------------------------------------------------------------

---[FILE: log4j.properties]---
Location: mlflow-master/mlflow/java/client/src/main/resources/log4j.properties

```text
log4j.rootLogger=info, console
log4j.logger.com.databricks=info
log4j.appender.console=org.apache.log4j.ConsoleAppender
log4j.appender.console.layout=org.apache.log4j.PatternLayout
log4j.appender.console.layout.ConversionPattern=%p  %c.%M:%L: %m%n
```

--------------------------------------------------------------------------------

---[FILE: CliBasedArtifactRepositoryTest.java]---
Location: mlflow-master/mlflow/java/client/src/test/java/org/mlflow/artifacts/CliBasedArtifactRepositoryTest.java

```java
package org.mlflow.artifacts;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.google.common.collect.Sets;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.Assert;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeSuite;
import org.testng.annotations.Test;

import org.mlflow.api.proto.Service.FileInfo;
import org.mlflow.api.proto.Service.RunInfo;
import org.mlflow.tracking.MlflowClient;
import org.mlflow.tracking.TestClientProvider;
import org.mlflow.tracking.creds.BasicMlflowHostCreds;
import org.mlflow.tracking.creds.DatabricksMlflowHostCreds;
import org.mlflow.tracking.creds.MlflowHostCreds;

public class CliBasedArtifactRepositoryTest {
  private static final Logger logger = LoggerFactory.getLogger(
    CliBasedArtifactRepositoryTest.class);

  private final TestClientProvider testClientProvider = new TestClientProvider();

  private MlflowClient client;

  @BeforeSuite
  public void beforeAll() throws IOException {
    client = testClientProvider.initializeClientAndServer();
  }

  @AfterSuite
  public void afterAll() throws InterruptedException {
    testClientProvider.cleanupClientAndServer();
  }

  private CliBasedArtifactRepository newRepo() {
    RunInfo runInfo = client.createRun();
    logger.info("Created run with id=" + runInfo.getRunUuid() + " and artifactUri=" +
      runInfo.getArtifactUri());
    return new CliBasedArtifactRepository(runInfo.getArtifactUri(), runInfo.getRunUuid(),
      testClientProvider.getClientHostCredsProvider(client));
  }

  @Test
  public void testLogAndDownloadArtifact() throws IOException {
    // Tests the logArtifact and downloadArtifacts APIs when targeting a single file.
    ArtifactRepository repo = newRepo();
    Path tempFile = Files.createTempFile(getClass().getSimpleName(), ".txt");
    FileUtils.writeStringToFile(tempFile.toFile(), "Hello, World!", StandardCharsets.UTF_8);
    repo.logArtifact(tempFile.toFile());
    Path returnFile = repo.downloadArtifacts(tempFile.getFileName().toString()).toPath();
    Assert.assertEquals(readFile(returnFile), "Hello, World!");
  }

  @Test
  public void testLogListAndDownloadArtifacts() throws IOException {
    // Tests the logArtifacts, list, downloadArtifacts APIs when targeting a set of files.
    ArtifactRepository repo = newRepo();
    Path tempDir = Files.createTempDirectory(getClass().getSimpleName());
    FileUtils.writeStringToFile(tempDir.resolve("a").toFile(), "A", StandardCharsets.UTF_8);
    FileUtils.writeStringToFile(tempDir.resolve("b").toFile(), "B", StandardCharsets.UTF_8);
    repo.logArtifacts(tempDir.toFile());
    Set<FileInfo> fileInfos = Sets.newHashSet(repo.listArtifacts());
    Assert.assertEquals(fileInfos, Sets.newHashSet(fileInfo("a", 1), fileInfo("b", 1)));
    Path returnDir = repo.downloadArtifacts().toPath();
    Assert.assertEquals(readFile(returnDir.resolve("a")), "A");
    Assert.assertEquals(readFile(returnDir.resolve("b")), "B");
  }

  @Test
  public void testEverything() throws IOException {
    // This is a comprehensive integration test which tests all 8 APIs exposed by ArtifactRepository
    // on a mix of files, directories, and subdirectories.
    ArtifactRepository repo = newRepo();

    // Create a temporary directory with /childFile and /childDir/granchild as files.
    Path tempDir = Files.createTempDirectory(getClass().getSimpleName());
    Path childFile = tempDir.resolve("childFile");
    String childContents = "File contents!";
    FileUtils.writeStringToFile(childFile.toFile(), childContents, StandardCharsets.UTF_8);
    Path childDir = tempDir.resolve("childDir");
    Path grandchildFile = childDir.resolve("grandchild");
    String grandchildContents = "Baby content!";
    childDir.toFile().mkdir();
    FileUtils.writeStringToFile(grandchildFile.toFile(), grandchildContents, StandardCharsets.UTF_8);

    // Log artifacts such that we expect:
    //   childFile
    //   grandchild
    //   subpath/childFile
    //   subpath/subberpath/grandchild
    repo.logArtifact(childFile.toFile());
    repo.logArtifacts(childDir.toFile());
    repo.logArtifact(childFile.toFile(), "subpath");
    repo.logArtifacts(childDir.toFile(), "subpath/subberpath");

    // List at the root, we should see childFile, grandchild, and subpath/.
    List<FileInfo> fileInfos = repo.listArtifacts();
    Set<FileInfo> expectedFileInfos = Sets.newHashSet(
      fileInfo("childFile", childContents.length()),
      fileInfo("grandchild", grandchildContents.length()),
      dirInfo("subpath")
    );
    Assert.assertEquals(Sets.newHashSet(fileInfos), expectedFileInfos);

    // List within subpath/, we should see childFile and subberpath.
    List<FileInfo> subpathFileInfos = repo.listArtifacts("subpath");
    Set<FileInfo> expectedSubpathFileInfos = Sets.newHashSet(
      fileInfo("subpath/childFile", childContents.length()),
      dirInfo("subpath/subberpath")
    );
    Assert.assertEquals(Sets.newHashSet(subpathFileInfos), expectedSubpathFileInfos);

    // Download everything, and confirm that we have the four expected files.
    Path allArtifacts = repo.downloadArtifacts().toPath();
    Assert.assertEquals(childContents, readFile(allArtifacts.resolve("childFile")));
    Assert.assertEquals(childContents, readFile(allArtifacts.resolve("subpath/childFile")));
    Assert.assertEquals(grandchildContents, readFile(allArtifacts.resolve("grandchild")));
    Assert.assertEquals(grandchildContents,
      readFile(allArtifacts.resolve("subpath/subberpath/grandchild")));

    // Download subpath/subberpath, and confirm that we have just the grandchild.
    Path subberpathArtifacts = repo.downloadArtifacts("subpath/subberpath").toPath();
    Assert.assertEquals(grandchildContents, readFile(subberpathArtifacts.resolve("grandchild")));
    Assert.assertEquals(subberpathArtifacts.toFile().list(), new String[] {"grandchild"});
  }

  @Test
  public void testSettingProcessEnvBasic() {
    CliBasedArtifactRepository repo = newRepo();
    MlflowHostCreds hostCreds = new BasicMlflowHostCreds("just-host");
    Map<String, String> env = new HashMap<>();
    repo.setProcessEnvironment(env, hostCreds);
    Map<String, String> expectedEnv = new HashMap<>();
    expectedEnv.put("MLFLOW_TRACKING_URI", "just-host");
    Assert.assertEquals(env, expectedEnv);
  }

  @Test
  public void testSettingProcessEnvUserPass() {
    CliBasedArtifactRepository repo = newRepo();
    MlflowHostCreds hostCreds = new BasicMlflowHostCreds("just-host", "user", "pass");
    Map<String, String> env = new HashMap<>();
    repo.setProcessEnvironment(env, hostCreds);
    Map<String, String> expectedEnv = new HashMap<>();
    expectedEnv.put("MLFLOW_TRACKING_URI", "just-host");
    expectedEnv.put("MLFLOW_TRACKING_USERNAME", "user");
    expectedEnv.put("MLFLOW_TRACKING_PASSWORD", "pass");
    Assert.assertEquals(env, expectedEnv);
  }

  @Test
  public void testSettingProcessEnvToken() {
    CliBasedArtifactRepository repo = newRepo();
    MlflowHostCreds hostCreds = new BasicMlflowHostCreds("just-host", "token");
    Map<String, String> env = new HashMap<>();
    repo.setProcessEnvironment(env, hostCreds);
    Map<String, String> expectedEnv = new HashMap<>();
    expectedEnv.put("MLFLOW_TRACKING_URI", "just-host");
    expectedEnv.put("MLFLOW_TRACKING_TOKEN", "token");
    Assert.assertEquals(env, expectedEnv);
  }

  @Test
  public void testSettingProcessEnvInsecure() {
    CliBasedArtifactRepository repo = newRepo();
    MlflowHostCreds hostCreds = new BasicMlflowHostCreds("insecure-host", null, null, null,
      true);
    Map<String, String> env = new HashMap<>();
    repo.setProcessEnvironment(env, hostCreds);
    Map<String, String> expectedEnv = new HashMap<>();
    expectedEnv.put("MLFLOW_TRACKING_URI", "insecure-host");
    expectedEnv.put("MLFLOW_TRACKING_INSECURE_TLS", "true");
    Assert.assertEquals(env, expectedEnv);
  }

  @Test
  public void testSettingProcessEnvDatabricksUserPass() {
    CliBasedArtifactRepository repo = newRepo();
    DatabricksMlflowHostCreds hostCreds = new DatabricksMlflowHostCreds(
      "just-host", "user", "pass");
    Map<String, String> env = new HashMap<>();
    repo.setProcessEnvironmentDatabricks(env, hostCreds);
    Map<String, String> expectedEnv = new HashMap<>();
    expectedEnv.put("DATABRICKS_HOST", "just-host");
    expectedEnv.put("DATABRICKS_USERNAME", "user");
    expectedEnv.put("DATABRICKS_PASSWORD", "pass");
    Assert.assertEquals(env, expectedEnv);
  }

  @Test
  public void testSettingProcessEnvDatabricksToken() {
    CliBasedArtifactRepository repo = newRepo();
    DatabricksMlflowHostCreds hostCreds = new DatabricksMlflowHostCreds("just-host", "token");
    Map<String, String> env = new HashMap<>();
    repo.setProcessEnvironmentDatabricks(env, hostCreds);
    Map<String, String> expectedEnv = new HashMap<>();
    expectedEnv.put("DATABRICKS_HOST", "just-host");
    expectedEnv.put("DATABRICKS_TOKEN", "token");
    Assert.assertEquals(env, expectedEnv);
  }

  @Test
  public void testSettingProcessEnvDatabricksInsecure() {
    CliBasedArtifactRepository repo = newRepo();
    DatabricksMlflowHostCreds hostCreds = new DatabricksMlflowHostCreds(
      "insecure-host", null, null, null, true);
    Map<String, String> env = new HashMap<>();
    repo.setProcessEnvironmentDatabricks(env, hostCreds);
    Map<String, String> expectedEnv = new HashMap<>();
    expectedEnv.put("DATABRICKS_HOST", "insecure-host");
    expectedEnv.put("DATABRICKS_INSECURE", "true");
    Assert.assertEquals(env, expectedEnv);
  }

  private String readFile(Path path) throws IOException {
    return FileUtils.readFileToString(path.toFile(), StandardCharsets.UTF_8);
  }

  private FileInfo fileInfo(String path, int fileSize) {
    return FileInfo.newBuilder().setPath(path).setFileSize(fileSize).setIsDir(false).build();
  }
  private FileInfo dirInfo(String path) {
    return FileInfo.newBuilder().setPath(path).setIsDir(true).build();
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ActiveRunTest.java]---
Location: mlflow-master/mlflow/java/client/src/test/java/org/mlflow/tracking/ActiveRunTest.java

```java
package org.mlflow.tracking;

import com.google.common.collect.ImmutableMap;
import org.mlflow.api.proto.Service.*;
import org.mockito.ArgumentCaptor;
import org.testng.annotations.Test;
import org.testng.collections.Lists;

import java.io.File;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.testng.Assert.*;
import static org.mockito.Mockito.*;

public class ActiveRunTest {

  private static final String RUN_ID = "test-run-id";
  private static final String ARTIFACT_URI = "dbfs:/artifact-uri";

  private MlflowClient mockClient;

  private ActiveRun getActiveRun() {
    RunInfo r = RunInfo.newBuilder().setRunId(RUN_ID).setArtifactUri(ARTIFACT_URI).build();
    this.mockClient = mock(MlflowClient.class);
    return new ActiveRun(r, mockClient);
  }

  @Test
  public void testGetId() {
    assertEquals(getActiveRun().getId(), RUN_ID);
  }

  @Test
  public void testLogParam() {
    getActiveRun().logParam("param-key", "param-value");
    verify(mockClient).logParam(RUN_ID, "param-key", "param-value");
  }

  @Test
  public void testSetTag() {
    getActiveRun().setTag("tag-key", "tag-value");
    verify(mockClient).setTag(RUN_ID, "tag-key", "tag-value");
  }

  @Test
  public void testLogMetric() {
    getActiveRun().logMetric("metric-key", 1.0);
    // The any is for the timestamp.
    verify(mockClient).logMetric(eq(RUN_ID), eq("metric-key"), eq(1.0), anyLong(), eq(0L));
  }

  @Test
  public void testLogMetricWithStep() {
    getActiveRun().logMetric("metric-key", 1.0, 99);
    // The any is for the timestamp.
    verify(mockClient).logMetric(eq(RUN_ID), eq("metric-key"), eq(1.0), anyLong(), eq(99L));
  }

  @Test
  public void testLogMetrics() {
    ActiveRun activeRun = getActiveRun();
    ArgumentCaptor<Iterable<Metric>> metricsArg = ArgumentCaptor.forClass(Iterable.class);
    activeRun.logMetrics(ImmutableMap.of("a", 0.0, "b", 1.0));
    verify(mockClient).logBatch(eq(RUN_ID), metricsArg.capture(), any(), any());

    Set<Metric> metrics = new HashSet<>();
    metricsArg.getValue().forEach(metrics::add);

    assertTrue(metrics.stream()
      .anyMatch(m -> m.getKey().equals("a") && m.getValue() == 0.0 && m.getStep() == 0));
    assertTrue(metrics.stream()
      .anyMatch(m -> m.getKey().equals("b") && m.getValue() == 1.0 && m.getStep() == 0));
  }

  @Test
  public void testLogMetricsWithStep() {
    ActiveRun activeRun = getActiveRun();
    ArgumentCaptor<Iterable<Metric>> metricsArg = ArgumentCaptor.forClass(Iterable.class);
    activeRun.logMetrics(ImmutableMap.of("a", 0.0, "b", 1.0), 99);
    verify(mockClient).logBatch(eq(RUN_ID), metricsArg.capture(), any(), any());

    Set<Metric> metrics = new HashSet<>();
    metricsArg.getValue().forEach(metrics::add);

    assertTrue(metrics.stream()
      .anyMatch(m -> m.getKey().equals("a") && m.getValue() == 0.0 && m.getStep() == 99));
    assertTrue(metrics.stream()
      .anyMatch(m -> m.getKey().equals("b") && m.getValue() == 1.0 && m.getStep() == 99));
  }

  @Test
  public void testLogParams() {
    ActiveRun activeRun = getActiveRun();
    ArgumentCaptor<Iterable<Param>> paramsArg = ArgumentCaptor.forClass(Iterable.class);
    activeRun.logParams(ImmutableMap.of("a", "a", "b", "b"));
    verify(mockClient).logBatch(eq(RUN_ID), any(), paramsArg.capture(), any());

    Set<Param> params = new HashSet<>();
    paramsArg.getValue().forEach(params::add);

    assertTrue(params.stream()
      .anyMatch(p -> p.getKey().equals("a") && p.getValue().equals("a")));
    assertTrue(params.stream()
      .anyMatch(p -> p.getKey().equals("b") && p.getValue().equals("b")));
  }

  @Test
  public void testSetTags() {
    ActiveRun activeRun = getActiveRun();
    ArgumentCaptor<Iterable<RunTag>> tagsArg = ArgumentCaptor.forClass(Iterable.class);
    activeRun.setTags(ImmutableMap.of("a", "a", "b", "b"));
    verify(mockClient).logBatch(eq(RUN_ID), any(), any(), tagsArg.capture());

    Set<RunTag> tags = new HashSet<>();
    tagsArg.getValue().forEach(tags::add);

    assertTrue(tags.stream()
      .anyMatch(t -> t.getKey().equals("a") && t.getValue().equals("a")));
    assertTrue(tags.stream()
      .anyMatch(t -> t.getKey().equals("b") && t.getValue().equals("b")));
  }

  @Test
  public void testLogArtifact() {
    ActiveRun activeRun = getActiveRun();
    activeRun.logArtifact(Paths.get("test"));
    verify(mockClient).logArtifact(RUN_ID, new File("test"));
  }

  @Test
  public void testLogArtifactWithArtifactPath() {
    ActiveRun activeRun = getActiveRun();
    activeRun.logArtifact(Paths.get("test"), "artifact-path");
    verify(mockClient).logArtifact(RUN_ID, new File("test"), "artifact-path");
  }

  @Test
  public void testLogArtifacts() {
    ActiveRun activeRun = getActiveRun();
    activeRun.logArtifacts(Paths.get("test"));
    verify(mockClient).logArtifacts(RUN_ID, new File("test"));
  }

  @Test
  public void testLogArtifactsWithArtifactPath() {
    ActiveRun activeRun = getActiveRun();
    activeRun.logArtifacts(Paths.get("test"), "artifact-path");
    verify(mockClient).logArtifacts(RUN_ID, new File("test"), "artifact-path");
  }

  @Test
  public void testGetArtifactUri() {
    ActiveRun activeRun = getActiveRun();
    assertEquals(activeRun.getArtifactUri(), ARTIFACT_URI);
  }

  @Test
  public void testEndRun() {
    ActiveRun activeRun = getActiveRun();
    activeRun.endRun();
    verify(mockClient).setTerminated(RUN_ID, RunStatus.FINISHED);
  }

  @Test
  public void testEndRunWithStatus() {
    ActiveRun activeRun = getActiveRun();
    activeRun.endRun(RunStatus.FAILED);
    verify(mockClient).setTerminated(RUN_ID, RunStatus.FAILED);
  }
}
```

--------------------------------------------------------------------------------

````
