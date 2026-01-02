---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 303
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 303 of 991)

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

---[FILE: ActiveRun.java]---
Location: mlflow-master/mlflow/java/client/src/main/java/org/mlflow/tracking/ActiveRun.java

```java
package org.mlflow.tracking;

import org.mlflow.api.proto.Service.*;

import java.nio.file.Path;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * Represents an active MLflow run and contains APIs to log data to the run.
 */
public class ActiveRun {
  private MlflowClient client;
  private RunInfo runInfo;

  ActiveRun(RunInfo runInfo, MlflowClient client) {
    this.runInfo = runInfo;
    this.client = client;
  }

  /**
   * Gets the run id of this run.
   * @return The run id of this run.
   */
  public String getId() {
    return runInfo.getRunId();
  }

  /**
   * Log a parameter under this run.
   *
   * @param key The name of the parameter.
   * @param value The value of the parameter.
   */
  public void logParam(String key, String value) {
    client.logParam(getId(), key, value);
  }

  /**
   * Sets a tag under this run.
   *
   * @param key The name of the tag.
   * @param value The value of the tag.
   */
  public void setTag(String key, String value) {
    client.setTag(getId(), key, value);
  }

  /**
   * Like {@link #logMetric(String, double, int)} with a default step of 0.
   */
  public void logMetric(String key, double value) {
    logMetric(key, value, 0);
  }

  /**
   * Logs a metric under this run.
   *
   * @param key The name of the metric.
   * @param value The value of the metric.
   * @param step The metric step.
   */
  public void logMetric(String key, double value, int step) {
    client.logMetric(getId(), key, value, System.currentTimeMillis(), step);
  }

  /**
   * Like {@link #logMetrics(Map, int)} with a default step of 0.
   */
  public void logMetrics(Map<String, Double> metrics) {
      logMetrics(metrics, 0);
  }

  /**
   * Log multiple metrics for this run.
   *
   * @param metrics A map of metric name to value.
   * @param step The metric step.
   */
  public void logMetrics(Map<String, Double> metrics, int step) {
    List<Metric> protoMetrics = metrics.entrySet().stream()
      .map((metric) ->
        Metric.newBuilder()
          .setKey(metric.getKey())
          .setValue(metric.getValue())
          .setTimestamp(System.currentTimeMillis())
          .setStep(step)
          .build()
      ).collect(Collectors.toList());
    client.logBatch(getId(), protoMetrics, Collections.emptyList(), Collections.emptyList());
  }

  /**
   * Log multiple params for this run.
   *
   * @param params A map of param name to value.
   */
  public void logParams(Map<String, String> params) {
    List<Param> protoParams = params.entrySet().stream().map((param) ->
      Param.newBuilder()
        .setKey(param.getKey())
        .setValue(param.getValue())
        .build()
    ).collect(Collectors.toList());
    client.logBatch(getId(), Collections.emptyList(), protoParams, Collections.emptyList());
  }

  /**
   * Sets multiple tags for this run.
   *
   * @param tags A map of tag name to value.
   */
  public void setTags(Map<String, String> tags) {
    List<RunTag> protoTags = tags.entrySet().stream().map((tag) ->
      RunTag.newBuilder().setKey(tag.getKey()).setValue(tag.getValue()).build()
    ).collect(Collectors.toList());
    client.logBatch(getId(), Collections.emptyList(), Collections.emptyList(), protoTags);
  }

  /**
   * Like {@link #logArtifact(Path, String)} with the artifactPath set to the root of the
   * artifact directory.
   *
   * @param localPath Path of file to upload. Must exist, and must be a simple file
   *                  (not a directory).
   */
  public void logArtifact(Path localPath) {
    client.logArtifact(getId(), localPath.toFile());
  }

  /**
   * Uploads the given local file to the run's root artifact directory. For example,
   *
   *   <pre>
   *   activeRun.logArtifact("/my/localModel", "model")
   *   mlflowClient.listArtifacts(activeRun.getId(), "model") // returns "model/localModel"
   *   </pre>
   *
   * @param localPath Path of file to upload. Must exist, and must be a simple file
   *                  (not a directory).
   * @param artifactPath Artifact path relative to the run's root directory given by
   *                     {@link #getArtifactUri()}. Should NOT start with a /.
   */
  public void logArtifact(Path localPath, String artifactPath) {
    client.logArtifact(getId(), localPath.toFile(), artifactPath);
  }

  /**
   * Like {@link #logArtifacts(Path, String)} with the artifactPath set to the root of the
   * artifact directory.
   *
   * @param localPath Directory to upload. Must exist, and must be a directory (not a simple file).
   */
  public void logArtifacts(Path localPath) {
    client.logArtifacts(getId(), localPath.toFile());
  }

  /**
   * Uploads all files within the given local director an artifactPath within the run's root
   * artifact directory. For example, if /my/local/dir/ contains two files "file1" and "file2", then
   *
   *   <pre>
   *   activeRun.logArtifacts("/my/local/dir", "model")
   *   mlflowClient.listArtifacts(activeRun.getId(), "model") // returns "model/file1" and
   *                                                          // "model/file2"
   *   </pre>
   *
   * (i.e., the contents of the local directory are now available in model/).
   *
   * @param localPath Directory to upload. Must exist, and must be a directory (not a simple file).
   * @param artifactPath Artifact path relative to the run's root directory given by
   *                     {@link #getArtifactUri()}. Should NOT start with a /.
   */
  public void logArtifacts(Path localPath, String artifactPath) {
    client.logArtifacts(getId(), localPath.toFile(), artifactPath);
  }

  /**
   * Get the absolute URI of the run artifact directory root.
   * @return The absolute URI of the run artifact directory root.
   */
  public String getArtifactUri() {
    return this.runInfo.getArtifactUri();
  }

  /**
   * Ends the active MLflow run.
   */
  public void endRun() {
    endRun(RunStatus.FINISHED);
  }

  /**
   * Ends the active MLflow run.
   *
   * @param status The status of the run.
   */
  public void endRun(RunStatus status) {
    client.setTerminated(getId(), status);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: EmptyPage.java]---
Location: mlflow-master/mlflow/java/client/src/main/java/org/mlflow/tracking/EmptyPage.java

```java
package org.mlflow.tracking;

import java.util.Collections;
import java.util.Optional;

public class EmptyPage<E> implements Page<E> {

  /**
   * Creates an empty page
   */
  EmptyPage() {}

  /**
   * @return Zero
   */
  public int getPageSize() {
    return 0;
  }

  /**
   * @return False
   */
  public boolean hasNextPage() {
    return false;
  }

  /**
   * @return An empty Optional.
   */
  public Optional<String> getNextPageToken() {
    return Optional.empty();
  }

  /**
   * @return An {@link org.mlflow.tracking.EmptyPage}
   */
  public EmptyPage getNextPage() {
    return this;
  }

  /**
   * @return An empty iterable.
   */
  public Iterable getItems() {
    return Collections.EMPTY_LIST;
  }

}
```

--------------------------------------------------------------------------------

---[FILE: ExperimentsPage.java]---
Location: mlflow-master/mlflow/java/client/src/main/java/org/mlflow/tracking/ExperimentsPage.java

```java
package org.mlflow.tracking;

import java.util.Collections;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;
import org.mlflow.api.proto.Service.*;

public class ExperimentsPage implements Page<Experiment> {

  private final String token;
  private final List<Experiment> experiments;

  private final MlflowClient client;
  private final String searchFilter;
  private final ViewType experimentViewType;
  private final List<String> orderBy;
  private final int maxResults;

  /**
   * Creates a fixed size page of Experiments.
   */
  ExperimentsPage(List<Experiment> experiments,
                  String token,
                  String searchFilter,
                  ViewType experimentViewType,
                  int maxResults,
                  List<String> orderBy,
                  MlflowClient client) {
    this.experiments = Collections.unmodifiableList(experiments);
    this.token = token;
    this.searchFilter = searchFilter;
    this.experimentViewType = experimentViewType;
    this.orderBy = orderBy;
    this.maxResults = maxResults;
    this.client = client;
  }

  /**
   * @return The number of experiments in the page.
   */
  public int getPageSize() {
    return this.experiments.size();
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
   * @return The next page of experiments matching the search criteria.
   * If there are no more pages, an {@link org.mlflow.tracking.EmptyPage} will be returned.
   */
  public Page<Experiment> getNextPage() {
    if (this.hasNextPage()) {
      return this.client.searchExperiments(this.searchFilter,
                                           this.experimentViewType,
                                           this.maxResults,
                                           this.orderBy,
                                           this.token);
    } else {
      return new EmptyPage();
    }
  }

  /**
   * @return An iterable over the experiments in this page.
   */
  public List<Experiment> getItems() {
    return experiments;
  }

}
```

--------------------------------------------------------------------------------

````
