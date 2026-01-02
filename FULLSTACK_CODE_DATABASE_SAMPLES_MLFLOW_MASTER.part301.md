---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 301
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 301 of 991)

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

---[FILE: ArtifactRepository.java]---
Location: mlflow-master/mlflow/java/client/src/main/java/org/mlflow/artifacts/ArtifactRepository.java

```java
package org.mlflow.artifacts;

import java.io.File;
import java.util.List;

import org.mlflow.api.proto.Service.FileInfo;

/**
 * Allows logging, listing, and downloading artifacts against a remote Artifact Repository.
 * This is used for storing potentially-large objects associated with MLflow runs.
 */
public interface ArtifactRepository {

  /**
   * Uploads the given local file to the run's root artifact directory. For example,
   *
   *   <pre>
   *   logArtifact("/my/localModel")
   *   listArtifacts() // returns "localModel"
   *   </pre>
   *
   * @param localFile File to upload. Must exist, and must be a simple file (not a directory).
   */
  void logArtifact(File localFile);

  /**
   * Uploads the given local file to an artifactPath within the run's root directory. For example,
   *
   *   <pre>
   *   logArtifact("/my/localModel", "model")
   *   listArtifacts("model") // returns "model/localModel"
   *   </pre>
   *
   * (i.e., the localModel file is now available in model/localModel).
   *
   * @param localFile File to upload. Must exist, and must be a simple file (not a directory).
   * @param artifactPath Artifact path relative to the run's root directory. Should NOT
   *                     start with a /.
   */
  void logArtifact(File localFile, String artifactPath);

  /**
   * Uploads all files within the given local director the run's root artifact directory.
   * For example, if /my/local/dir/ contains two files "file1" and "file2", then
   *
   *   <pre>
   *   logArtifacts("/my/local/dir")
   *   listArtifacts() // returns "file1" and "file2"
   *   </pre>
   *
   * @param localDir Directory to upload. Must exist, and must be a directory (not a simple file).
   */
  void logArtifacts(File localDir);


  /**
   * Uploads all files within the given local director an artifactPath within the run's root
   * artifact directory. For example, if /my/local/dir/ contains two files "file1" and "file2", then
   *
   *   <pre>
   *   logArtifacts("/my/local/dir", "model")
   *   listArtifacts("model") // returns "model/file1" and "model/file2"
   *   </pre>
   *
   * (i.e., the contents of the local directory are now available in model/).
   *
   * @param localDir Directory to upload. Must exist, and must be a directory (not a simple file).
   * @param artifactPath Artifact path relative to the run's root directory. Should NOT
   *                     start with a /.
   */
  void logArtifacts(File localDir, String artifactPath);

  /**
   * Lists the artifacts immediately under the run's root artifact directory. This does not
   * recursively list; instead, it will return FileInfos with isDir=true where further
   * listing may be done.
   */
  List<FileInfo> listArtifacts();

  /**
   * Lists the artifacts immediately under the given artifactPath within the run's root artifact
   * irectory. This does not recursively list; instead, it will return FileInfos with isDir=true
   * where further listing may be done.
   * @param artifactPath Artifact path relative to the run's root directory. Should NOT
   *                     start with a /.
   */
  List<FileInfo> listArtifacts(String artifactPath);

  /**
   * Returns a local directory containing *all* artifacts within the run's artifact directory.
   * Note that this will download the entire directory path, and so may be expensive if
   * the directory a lot of data.
   */
  File downloadArtifacts();

  /**
   * Returns a local file or directory containing all artifacts within the given artifactPath
   * within the run's root artifactDirectory. For example, if "model/file1" and "model/file2"
   * exist within the artifact directory, then
   *
   *   <pre>
   *   downloadArtifacts("model") // returns a local directory containing "file1" and "file2"
   *   downloadArtifacts("model/file1") // returns a local *file* with the contents of file1.
   *   </pre>
   *
   * Note that this will download the entire subdirectory path, and so may be expensive if
   * the subdirectory a lot of data.
   *
   * @param artifactPath Artifact path relative to the run's root directory. Should NOT
   *                     start with a /.
   */
  File downloadArtifacts(String artifactPath);
}
```

--------------------------------------------------------------------------------

---[FILE: ArtifactRepositoryFactory.java]---
Location: mlflow-master/mlflow/java/client/src/main/java/org/mlflow/artifacts/ArtifactRepositoryFactory.java

```java
package org.mlflow.artifacts;

import java.net.URI;

import org.mlflow.tracking.creds.MlflowHostCredsProvider;

public class ArtifactRepositoryFactory {
  private final MlflowHostCredsProvider hostCredsProvider;

  public ArtifactRepositoryFactory(MlflowHostCredsProvider hostCredsProvider) {
    this.hostCredsProvider = hostCredsProvider;
  }

  public ArtifactRepository getArtifactRepository(URI baseArtifactUri, String runId) {
    return new CliBasedArtifactRepository(baseArtifactUri.toString(), runId, hostCredsProvider);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: CliBasedArtifactRepository.java]---
Location: mlflow-master/mlflow/java/client/src/main/java/org/mlflow/artifacts/CliBasedArtifactRepository.java

```java
package org.mlflow.artifacts;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.Type;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;

import com.google.common.annotations.VisibleForTesting;
import com.google.common.collect.Lists;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.google.protobuf.InvalidProtocolBufferException;
import com.google.protobuf.util.JsonFormat;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.mlflow.api.proto.Service;
import org.mlflow.tracking.MlflowClientException;
import org.mlflow.tracking.creds.MlflowHostCreds;
import org.mlflow.tracking.creds.DatabricksMlflowHostCreds;
import org.mlflow.tracking.creds.MlflowHostCredsProvider;

/**
 * Shells out to the 'mlflow' command line utility to upload, download, and list artifacts. This
 * is used as a fallback to implement any artifact repositories which are not natively supported
 * within Java.
 *
 * We require that 'mlflow' is available in the system path.
 */
public class CliBasedArtifactRepository implements ArtifactRepository {
  private static final Logger logger = LoggerFactory.getLogger(CliBasedArtifactRepository.class);

  // Global check if we ever successfully loaded 'mlflow'. This allows us to print a more
  // helpful error message if the executable is not in the path.
  private static final AtomicBoolean mlflowSuccessfullyLoaded = new AtomicBoolean(false);

  // Name of the Python CLI utility which can be exec'd directly, with MLflow on its path
  private final String PYTHON_EXECUTABLE =
    Optional.ofNullable(System.getenv("MLFLOW_PYTHON_EXECUTABLE")).orElse("python");

  // Python CLI command
  private final String PYTHON_COMMAND = "mlflow.store.artifact.cli";

  // Base directory of the artifactory, used to let the user know why this repository was chosen.
  private final String artifactBaseDir;

  // Run ID this repository is targeting.
  private final String runId;

  // Used to pass credentials as environment variables
  // (e.g., MLFLOW_TRACKING_URI or DATABRICKS_HOST) to the mlflow process.
  private final MlflowHostCredsProvider hostCredsProvider;

  public CliBasedArtifactRepository(
      String artifactBaseDir,
      String runId,
      MlflowHostCredsProvider hostCredsProvider) {
    this.artifactBaseDir = artifactBaseDir;
    this.runId = runId;
    this.hostCredsProvider = hostCredsProvider;
  }

  @Override
  public void logArtifact(File localFile, String artifactPath) {
    checkMlflowAccessible();
    if (!localFile.exists()) {
      throw new MlflowClientException("Local file does not exist: " + localFile);
    }
    if (localFile.isDirectory()) {
      throw new MlflowClientException("Local path points to a directory. Use logArtifacts" +
        " instead: " + localFile);
    }

    List<String> baseCommand = Lists.newArrayList(
      "log-artifact", "--local-file", localFile.toString());
    List<String> command = appendRunIdArtifactPath(baseCommand, runId, artifactPath);
    String tag = "log file " + localFile + " to " + getTargetIdentifier(artifactPath);
    forkMlflowProcess(command, tag);
  }

  @Override
  public void logArtifact(File localFile) {
    logArtifact(localFile, null);
  }

  @Override
  public void logArtifacts(File localDir, String artifactPath) {
    checkMlflowAccessible();
    if (!localDir.exists()) {
      throw new MlflowClientException("Local file does not exist: " + localDir);
    }
    if (localDir.isFile()) {
      throw new MlflowClientException("Local path points to a file. Use logArtifact" +
        " instead: " + localDir);
    }

    List<String> baseCommand = Lists.newArrayList(
      "log-artifacts", "--local-dir", localDir.toString());
    List<String> command = appendRunIdArtifactPath(baseCommand, runId, artifactPath);
    String tag = "log dir " + localDir + " to " + getTargetIdentifier(artifactPath);
    forkMlflowProcess(command, tag);
  }

  @Override
  public void logArtifacts(File localDir) {
    logArtifacts(localDir, null);
  }

  @Override
  public File downloadArtifacts(String artifactPath) {
    checkMlflowAccessible();
    String tag = "download artifacts for " + getTargetIdentifier(artifactPath);
    List<String> command = appendRunIdArtifactPath(
      Lists.newArrayList("download"), runId, artifactPath);
    String stdOutput = forkMlflowProcess(command, tag);
    String[] splits = stdOutput.split(System.lineSeparator());
    return new File(splits[splits.length-1].trim());
  }

  @Override
  public File downloadArtifacts() {
    return downloadArtifacts(null);
  }

  @Override
  public List<Service.FileInfo> listArtifacts(String artifactPath) {
    checkMlflowAccessible();
    String tag = "list artifacts in " + getTargetIdentifier(artifactPath);
    List<String> command = appendRunIdArtifactPath(
      Lists.newArrayList("list"), runId, artifactPath);
    String jsonOutput = forkMlflowProcess(command, tag);
    return parseFileInfos(jsonOutput);
  }

  @Override
  public List<Service.FileInfo> listArtifacts() {
    return listArtifacts(null);
  }

  /**
   * Only available in the CliBasedArtifactRepository. Downloads an artifact to the local
   * filesystem when provided with an artifact uri. This method should not be used directly
   * by the user. Please use {@link org.mlflow.tracking.MlflowClient}
   *
   * @param artifactUri Artifact uri
   * @return Directory/file of the artifact
   */
  public File downloadArtifactFromUri(String artifactUri) {
    checkMlflowAccessible();
    String tag = "download artifacts for " + artifactUri;
    List<String> command = Lists.newArrayList("download", "--artifact-uri", artifactUri);
    String localPath = forkMlflowProcess(command, tag).trim();
    return new File(localPath);
  }

  /** Parses a list of JSON FileInfos, as returned by 'mlflow artifacts list'. */
  private List<Service.FileInfo> parseFileInfos(String json) {
    // The protobuf deserializer doesn't allow us to directly deserialize a list, so we
    // deserialize a list-of-dictionaries, and then reserialize each dictionary to pass it to
    // the protobuf deserializer.
    Gson gson = new Gson();
    Type type = new TypeToken<List<Map<String, Object>>>(){}.getType();
    List<Map<String, Object>> listOfDicts = gson.fromJson(json, type);
    List<Service.FileInfo> fileInfos = new ArrayList<>();
    for (Map<String, Object> dict: listOfDicts) {
      String fileInfoJson = gson.toJson(dict);
      try {
        Service.FileInfo.Builder builder = Service.FileInfo.newBuilder();
        JsonFormat.parser().merge(fileInfoJson, builder);
        fileInfos.add(builder.build());
      } catch (InvalidProtocolBufferException e) {
        throw new MlflowClientException("Failed to deserialize JSON into FileInfo: " + json, e);
      }
    }
    return fileInfos;
  }

  /**
   * Checks whether the 'mlflow' executable is available, and throws a nice error if not.
   * If this method has ever run successfully before (in the entire JVM), we will not rerun it.
   */
  private void checkMlflowAccessible() {
    if (mlflowSuccessfullyLoaded.get()) {
      return;
    }

    try {
      String tag = "get mlflow version";
      forkMlflowProcess(Lists.newArrayList("--help"), tag);
      logger.info("Found local mlflow executable");
      mlflowSuccessfullyLoaded.set(true);
    } catch (MlflowClientException e) {
      String errorMessage = String.format("Failed to exec '%s -m %s', needed to" +
          " access artifacts within the non-Java-native artifact store at '%s'. Please make" +
          " sure mlflow is available on your local system path (e.g., from 'pip install mlflow')",
        PYTHON_EXECUTABLE, PYTHON_COMMAND, artifactBaseDir);
      throw new MlflowClientException(errorMessage, e);
    }
  }

  /**
   * Forks the given mlflow command and awaits for its successful completion.
   *
   * @param mlflowCommand List of arguments to invoke mlflow with.
   * @param tag User-facing tag which will be used to identify what we were trying to do
   *            in the case of a failure.
   * @return raw stdout of the process, decoded as a utf-8 string
   * @throws MlflowClientException if the process exits with a non-zero exit code, or anything
   *                               else goes wrong.
   */
  private String forkMlflowProcess(List<String> mlflowCommand, String tag) {
    String stdout;
    Process process = null;
    try {
      MlflowHostCreds hostCreds = hostCredsProvider.getHostCreds();
      List<String> fullCommand = Lists.newArrayList(PYTHON_EXECUTABLE, "-m", PYTHON_COMMAND);
      fullCommand.addAll(mlflowCommand);
      ProcessBuilder pb = new ProcessBuilder(fullCommand);
      if (hostCreds instanceof DatabricksMlflowHostCreds) {
        setProcessEnvironmentDatabricks(pb.environment(), (DatabricksMlflowHostCreds) hostCreds);
      } else {
        setProcessEnvironment(pb.environment(), hostCreds);
      }
      process = pb.start();
      stdout = IOUtils.toString(process.getInputStream(), StandardCharsets.UTF_8);
      int exitValue = process.waitFor();
      if (exitValue != 0) {
        throw new MlflowClientException("Failed to " + tag + ". Error: " +
          getErrorBestEffort(process));
      }
    } catch (IOException | InterruptedException e) {
      throw new MlflowClientException("Failed to fork mlflow process to " + tag +
        ". Process stderr: " + getErrorBestEffort(process), e);
    }
    return stdout;
  }

  @VisibleForTesting
  void setProcessEnvironment(Map<String, String> environment, MlflowHostCreds hostCreds) {
    environment.put("MLFLOW_TRACKING_URI", hostCreds.getHost());
    if (hostCreds.getUsername() != null) {
      environment.put("MLFLOW_TRACKING_USERNAME", hostCreds.getUsername());
    }
    if (hostCreds.getPassword() != null) {
      environment.put("MLFLOW_TRACKING_PASSWORD", hostCreds.getPassword());
    }
    if (hostCreds.getToken() != null) {
      environment.put("MLFLOW_TRACKING_TOKEN", hostCreds.getToken());
    }
    if (hostCreds.shouldIgnoreTlsVerification()) {
      environment.put("MLFLOW_TRACKING_INSECURE_TLS", "true");
    }
  }

  @VisibleForTesting
  void setProcessEnvironmentDatabricks(
      Map<String, String> environment,
      DatabricksMlflowHostCreds hostCreds) {
    environment.put("DATABRICKS_HOST", hostCreds.getHost());
    if (hostCreds.getUsername() != null) {
      environment.put("DATABRICKS_USERNAME", hostCreds.getUsername());
    }
    if (hostCreds.getPassword() != null) {
      environment.put("DATABRICKS_PASSWORD", hostCreds.getPassword());
    }
    if (hostCreds.getToken() != null) {
      environment.put("DATABRICKS_TOKEN", hostCreds.getToken());
    }
    if (hostCreds.shouldIgnoreTlsVerification()) {
      environment.put("DATABRICKS_INSECURE", "true");
    }
  }

  /** Does our best to get the process's stderr, or returns a dummy return value. */
  private String getErrorBestEffort(Process process) {
    if (process == null) {
      return "<process not started>";
    }
    try {
      return IOUtils.toString(process.getErrorStream(), StandardCharsets.UTF_8);
    } catch (IOException e) {
      return "<error unknown>";
    }
  }

  /** Appends --run-id $runId and --artifact-path $artifactPath, omitting artifactPath if null. */
  private List<String> appendRunIdArtifactPath(
      List<String> baseCommand,
      String runId,
      String artifactPath) {
    baseCommand.add("--run-id");
    baseCommand.add(runId);
    if (artifactPath != null) {
      baseCommand.add("--artifact-path");
      baseCommand.add(artifactPath);
    }
    return baseCommand;
  }

  /** Returns user-facing identifier "runId=abc, artifactId=/foo", omitting artifactPath if null. */
  private String getTargetIdentifier(String artifactPath) {
    String identifier = "runId=" + runId;
    if (artifactPath != null) {
      return identifier + ", artifactPath=" + artifactPath;
    }
    return identifier;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: Internal.java]---
Location: mlflow-master/mlflow/java/client/src/main/java/org/mlflow/internal/proto/Internal.java

```java
// Generated by the protocol buffer compiler.  DO NOT EDIT!
// source: internal.proto

package org.mlflow.internal.proto;

public final class Internal {
  private Internal() {}
  public static void registerAllExtensions(
      com.google.protobuf.ExtensionRegistryLite registry) {
  }

  public static void registerAllExtensions(
      com.google.protobuf.ExtensionRegistry registry) {
    registerAllExtensions(
        (com.google.protobuf.ExtensionRegistryLite) registry);
  }
  /**
   * <pre>
   * Types of vertices represented in MLflow Run Inputs. Valid vertices are MLflow objects that can
   * have an input relationship.
   * </pre>
   *
   * Protobuf enum {@code mlflow.internal.InputVertexType}
   */
  public enum InputVertexType
      implements com.google.protobuf.ProtocolMessageEnum {
    /**
     * <code>RUN = 1;</code>
     */
    RUN(1),
    /**
     * <code>DATASET = 2;</code>
     */
    DATASET(2),
    /**
     * <code>MODEL = 3;</code>
     */
    MODEL(3),
    ;

    /**
     * <code>RUN = 1;</code>
     */
    public static final int RUN_VALUE = 1;
    /**
     * <code>DATASET = 2;</code>
     */
    public static final int DATASET_VALUE = 2;
    /**
     * <code>MODEL = 3;</code>
     */
    public static final int MODEL_VALUE = 3;


    public final int getNumber() {
      return value;
    }

    /**
     * @param value The numeric wire value of the corresponding enum entry.
     * @return The enum associated with the given numeric wire value.
     * @deprecated Use {@link #forNumber(int)} instead.
     */
    @java.lang.Deprecated
    public static InputVertexType valueOf(int value) {
      return forNumber(value);
    }

    /**
     * @param value The numeric wire value of the corresponding enum entry.
     * @return The enum associated with the given numeric wire value.
     */
    public static InputVertexType forNumber(int value) {
      switch (value) {
        case 1: return RUN;
        case 2: return DATASET;
        case 3: return MODEL;
        default: return null;
      }
    }

    public static com.google.protobuf.Internal.EnumLiteMap<InputVertexType>
        internalGetValueMap() {
      return internalValueMap;
    }
    private static final com.google.protobuf.Internal.EnumLiteMap<
        InputVertexType> internalValueMap =
          new com.google.protobuf.Internal.EnumLiteMap<InputVertexType>() {
            public InputVertexType findValueByNumber(int number) {
              return InputVertexType.forNumber(number);
            }
          };

    public final com.google.protobuf.Descriptors.EnumValueDescriptor
        getValueDescriptor() {
      return getDescriptor().getValues().get(ordinal());
    }
    public final com.google.protobuf.Descriptors.EnumDescriptor
        getDescriptorForType() {
      return getDescriptor();
    }
    public static final com.google.protobuf.Descriptors.EnumDescriptor
        getDescriptor() {
      return org.mlflow.internal.proto.Internal.getDescriptor().getEnumTypes().get(0);
    }

    private static final InputVertexType[] VALUES = values();

    public static InputVertexType valueOf(
        com.google.protobuf.Descriptors.EnumValueDescriptor desc) {
      if (desc.getType() != getDescriptor()) {
        throw new java.lang.IllegalArgumentException(
          "EnumValueDescriptor is not for this type.");
      }
      return VALUES[desc.getIndex()];
    }

    private final int value;

    private InputVertexType(int value) {
      this.value = value;
    }

    // @@protoc_insertion_point(enum_scope:mlflow.internal.InputVertexType)
  }

  /**
   * <pre>
   * Types of vertices represented in MLflow Run Outputs. Valid vertices are MLflow objects that can
   * have an output relationship.
   * </pre>
   *
   * Protobuf enum {@code mlflow.internal.OutputVertexType}
   */
  public enum OutputVertexType
      implements com.google.protobuf.ProtocolMessageEnum {
    /**
     * <code>RUN_OUTPUT = 1;</code>
     */
    RUN_OUTPUT(1),
    /**
     * <code>MODEL_OUTPUT = 2;</code>
     */
    MODEL_OUTPUT(2),
    ;

    /**
     * <code>RUN_OUTPUT = 1;</code>
     */
    public static final int RUN_OUTPUT_VALUE = 1;
    /**
     * <code>MODEL_OUTPUT = 2;</code>
     */
    public static final int MODEL_OUTPUT_VALUE = 2;


    public final int getNumber() {
      return value;
    }

    /**
     * @param value The numeric wire value of the corresponding enum entry.
     * @return The enum associated with the given numeric wire value.
     * @deprecated Use {@link #forNumber(int)} instead.
     */
    @java.lang.Deprecated
    public static OutputVertexType valueOf(int value) {
      return forNumber(value);
    }

    /**
     * @param value The numeric wire value of the corresponding enum entry.
     * @return The enum associated with the given numeric wire value.
     */
    public static OutputVertexType forNumber(int value) {
      switch (value) {
        case 1: return RUN_OUTPUT;
        case 2: return MODEL_OUTPUT;
        default: return null;
      }
    }

    public static com.google.protobuf.Internal.EnumLiteMap<OutputVertexType>
        internalGetValueMap() {
      return internalValueMap;
    }
    private static final com.google.protobuf.Internal.EnumLiteMap<
        OutputVertexType> internalValueMap =
          new com.google.protobuf.Internal.EnumLiteMap<OutputVertexType>() {
            public OutputVertexType findValueByNumber(int number) {
              return OutputVertexType.forNumber(number);
            }
          };

    public final com.google.protobuf.Descriptors.EnumValueDescriptor
        getValueDescriptor() {
      return getDescriptor().getValues().get(ordinal());
    }
    public final com.google.protobuf.Descriptors.EnumDescriptor
        getDescriptorForType() {
      return getDescriptor();
    }
    public static final com.google.protobuf.Descriptors.EnumDescriptor
        getDescriptor() {
      return org.mlflow.internal.proto.Internal.getDescriptor().getEnumTypes().get(1);
    }

    private static final OutputVertexType[] VALUES = values();

    public static OutputVertexType valueOf(
        com.google.protobuf.Descriptors.EnumValueDescriptor desc) {
      if (desc.getType() != getDescriptor()) {
        throw new java.lang.IllegalArgumentException(
          "EnumValueDescriptor is not for this type.");
      }
      return VALUES[desc.getIndex()];
    }

    private final int value;

    private OutputVertexType(int value) {
      this.value = value;
    }

    // @@protoc_insertion_point(enum_scope:mlflow.internal.OutputVertexType)
  }


  public static com.google.protobuf.Descriptors.FileDescriptor
      getDescriptor() {
    return descriptor;
  }
  private static  com.google.protobuf.Descriptors.FileDescriptor
      descriptor;
  static {
    java.lang.String[] descriptorData = {
      "\n\016internal.proto\022\017mlflow.internal\032\025scala" +
      "pb/scalapb.proto*2\n\017InputVertexType\022\007\n\003R" +
      "UN\020\001\022\013\n\007DATASET\020\002\022\t\n\005MODEL\020\003*4\n\020OutputVe" +
      "rtexType\022\016\n\nRUN_OUTPUT\020\001\022\020\n\014MODEL_OUTPUT" +
      "\020\002B#\n\031org.mlflow.internal.proto\220\001\001\342?\002\020\001"
    };
    descriptor = com.google.protobuf.Descriptors.FileDescriptor
      .internalBuildGeneratedFileFrom(descriptorData,
        new com.google.protobuf.Descriptors.FileDescriptor[] {
          org.mlflow.scalapb_interface.Scalapb.getDescriptor(),
        });
    com.google.protobuf.ExtensionRegistry registry =
        com.google.protobuf.ExtensionRegistry.newInstance();
    registry.add(org.mlflow.scalapb_interface.Scalapb.options);
    com.google.protobuf.Descriptors.FileDescriptor
        .internalUpdateFileDescriptor(descriptor, registry);
    org.mlflow.scalapb_interface.Scalapb.getDescriptor();
  }

  // @@protoc_insertion_point(outer_class_scope)
}
```

--------------------------------------------------------------------------------

````
