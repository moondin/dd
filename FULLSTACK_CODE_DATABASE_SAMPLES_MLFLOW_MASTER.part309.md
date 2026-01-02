---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 309
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 309 of 991)

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

---[FILE: DatabricksContextTest.java]---
Location: mlflow-master/mlflow/java/client/src/test/java/org/mlflow/tracking/utils/DatabricksContextTest.java

```java
package org.mlflow.tracking.utils;

import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Maps;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.util.*;

public class DatabricksContextTest {
  private static Map<String, String> baseMap = new HashMap<>();

  public static class MyDynamicProvider extends AbstractMap<String, String> {
    @Override
    public Set<Entry<String, String>> entrySet() {
      return baseMap.entrySet();
    }
  }

  @BeforeMethod
  public static void beforeMethod() {
    baseMap = new HashMap<>();
  }


  @Test
  public void testIsInDatabricksNotebook() {
    baseMap.put("notebookId", "1");
    DatabricksContext context = DatabricksContext.createIfAvailable(MyDynamicProvider.class.getName());
    Assert.assertTrue(context.isInDatabricksNotebook());
  }

  @Test
  public void testGetNotebookId() {
    baseMap.put("notebookId", "1");
    DatabricksContext context = DatabricksContext.createIfAvailable(MyDynamicProvider.class.getName());
    Assert.assertEquals(context.getNotebookId(), "1");
  }

  @Test
  public void testGetTagsWithEmptyNotebookAndJobDetails() {
    // Will return empty map if not in Databricks notebook.
    {
      baseMap.put("notebookId", null);
      baseMap.put("notebookPath", null);
      DatabricksContext context = DatabricksContext.createIfAvailable(MyDynamicProvider.class.getName());
      Assert.assertFalse(context.isInDatabricksNotebook());
      Assert.assertEquals(context.getTags(), Maps.newHashMap());
    }
    // Will return empty map if not in Databricks job.
    {
      baseMap.put("jobId", null);
      baseMap.put("jobRunId", null);
      DatabricksContext context = DatabricksContext.createIfAvailable(MyDynamicProvider.class.getName());
      Assert.assertFalse(context.isInDatabricksNotebook());
      Assert.assertEquals(context.getTags(), Maps.newHashMap());
    }
    // Will return empty map if not config map is empty.
    {
      DatabricksContext context = DatabricksContext.createIfAvailable(MyDynamicProvider.class.getName());
      Assert.assertFalse(context.isInDatabricksNotebook());
      Assert.assertEquals(context.getTags(), Maps.newHashMap());
    }
  }

  @Test
  public void testGetTagsForNotebook() {
    // Will return all tags if notebook context is set as expected.
    {
      baseMap = new HashMap<>();
      Map<String, String> expectedTags = ImmutableMap.of(
        MlflowTagConstants.DATABRICKS_NOTEBOOK_ID, "1",
        MlflowTagConstants.DATABRICKS_NOTEBOOK_PATH, "test-path",
        MlflowTagConstants.SOURCE_TYPE, "NOTEBOOK",
        MlflowTagConstants.SOURCE_NAME, "test-path");
      baseMap.put("notebookId", "1");
      baseMap.put("notebookPath", "test-path");
      DatabricksContext context = DatabricksContext.createIfAvailable(MyDynamicProvider.class.getName());
      Assert.assertEquals(context.getTags(), expectedTags);
    }
    // Will not set notebook path tags if context doesn't have a notebookPath member.
    {
      baseMap = new HashMap<>();
      Map<String, String> expectedTags = ImmutableMap.of(
        MlflowTagConstants.DATABRICKS_NOTEBOOK_ID, "1");
      baseMap.put("notebookId", "1");
      baseMap.put("notebookPath", null);
      DatabricksContext context = DatabricksContext.createIfAvailable(MyDynamicProvider.class.getName());
      Assert.assertEquals(context.getTags(), expectedTags);
    }
  }

  @Test
  public void testGetTagsForJob() {
    // Will return all tags if job context is set as expected.
    {
      baseMap = new HashMap<>();
      Map<String, String> expectedTags = ImmutableMap.of(
        MlflowTagConstants.DATABRICKS_JOB_ID, "70",
        MlflowTagConstants.DATABRICKS_JOB_RUN_ID, "5",
        MlflowTagConstants.DATABRICKS_JOB_TYPE, "notebook",
        MlflowTagConstants.SOURCE_TYPE, "JOB",
        MlflowTagConstants.SOURCE_NAME, "jobs/70/run/5");
      baseMap.put("jobId", "70");
      baseMap.put("jobRunId", "5");
      baseMap.put("jobType", "notebook");
      DatabricksContext context = DatabricksContext.createIfAvailable(MyDynamicProvider.class.getName());
      Assert.assertEquals(context.getTags(), expectedTags);
    }
    // Will not set job type tag if job type is absent.
    {
      baseMap = new HashMap<>();
      Map<String, String> expectedTags = ImmutableMap.of(
        MlflowTagConstants.DATABRICKS_JOB_ID, "70",
        MlflowTagConstants.DATABRICKS_JOB_RUN_ID, "5",
        MlflowTagConstants.SOURCE_TYPE, "JOB",
        MlflowTagConstants.SOURCE_NAME, "jobs/70/run/5");
      baseMap.put("jobId", "70");
      baseMap.put("jobRunId", "5");
      DatabricksContext context = DatabricksContext.createIfAvailable(MyDynamicProvider.class.getName());
      Assert.assertEquals(context.getTags(), expectedTags);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: SparkAutologgingUtils.scala]---
Location: mlflow-master/mlflow/java/spark/src/main/scala/org/apache/spark/sql/SparkAutologgingUtils.scala

```text
package org.apache.spark.sql

import org.apache.spark.sql.execution.ui._
import org.apache.spark.sql.execution.QueryExecution


/**
 * MLflow-internal object used to access Spark-private fields in the implementation of
 * autologging Spark datasource information.
 */
object SparkAutologgingUtils {
  def getQueryExecution(sqlExecution: SparkListenerSQLExecutionEnd): QueryExecution = {
    sqlExecution.qe
  }
}
```

--------------------------------------------------------------------------------

---[FILE: DatasourceAttributeExtractor.scala]---
Location: mlflow-master/mlflow/java/spark/src/main/scala/org/mlflow/spark/autologging/DatasourceAttributeExtractor.scala

```text
package org.mlflow.spark.autologging

import org.apache.spark.sql.SparkAutologgingUtils
import org.apache.spark.sql.catalyst.plans.logical.{LeafNode, LogicalPlan}
import org.apache.spark.sql.execution.datasources.v2.{DataSourceV2Relation, FileTable}
import org.apache.spark.sql.execution.datasources.{HadoopFsRelation, LogicalRelation}
import org.apache.spark.sql.connector.catalog.Table
import org.apache.spark.sql.execution.ui.SparkListenerSQLExecutionEnd
import org.apache.spark.sql.sources.DataSourceRegister
import org.slf4j.{Logger, LoggerFactory}

import scala.util.control.NonFatal

/** Case class wrapping information on a Spark datasource that was read. */
private[autologging] case class SparkTableInfo(
    path: String,
    versionOpt: Option[String],
    formatOpt: Option[String])

/** Base trait for extracting Spark datasource attributes from a Spark logical plan. */
private[autologging] trait DatasourceAttributeExtractorBase {
  protected val logger: Logger = LoggerFactory.getLogger(getClass)

  private def getSparkTableInfoFromTable(table: Table): Option[SparkTableInfo] = {
    table match {
      case fileTable: FileTable =>
        val tableName = fileTable.name
        val splitName = tableName.split(" ")
        val lowercaseFormat = fileTable.formatName.toLowerCase()
        if (splitName.headOption.exists(head => head.toLowerCase == lowercaseFormat)) {
          Option(SparkTableInfo(splitName.tail.mkString(" "), None, Option(lowercaseFormat)))
        } else {
          Option(SparkTableInfo(fileTable.name, None, Option(fileTable.formatName)))
        }
      case other: Table =>
        Option(SparkTableInfo(other.name, None, None))
    }
  }

  protected def maybeGetDeltaTableInfo(plan: LogicalPlan): Option[SparkTableInfo]

  /**
   * Get SparkTableInfo representing the datasource that was read from leaf node of a Spark SQL
   * query plan
   */
  protected def getTableInfoToLog(leafNode: LogicalPlan): Option[SparkTableInfo] = {
    val deltaInfoOpt = maybeGetDeltaTableInfo(leafNode)
    if (deltaInfoOpt.isDefined) {
      deltaInfoOpt
    } else {
      leafNode match {
        // DataSourceV2Relation was disabled in Spark 3.0.0 stable release due to some issue and 
        // still not present in Spark 3.2.0. While we are not sure whether it will be back in
        // the future, we still keep this code here to support previous versions.
        case relation: DataSourceV2Relation =>
          getSparkTableInfoFromTable(relation.table)
        // This is the case for Spark 3.x except for 3.0.0-preview
        case LogicalRelation(HadoopFsRelation(index, _, _, _, fileFormat, _), _, _, _) =>
          val path: String = index.rootPaths.headOption.map(_.toString).getOrElse("unknown")
          val formatOpt = fileFormat match {
            case format: DataSourceRegister => Option(format.shortName)
            case _ => None
          }
          Option(SparkTableInfo(path, None, formatOpt))
        case _ => None
      }
    }
  }

  private def getLeafNodes(lp: LogicalPlan): Seq[LogicalPlan] = {
    if (lp == null) {
      return Seq.empty
    }
    if (lp.isInstanceOf[LeafNode]) {
      Seq(lp)
    } else {
      lp.children.flatMap(getLeafNodes)
    }
  }

  /**
   * Get SparkTableInfo representing the datasource(s) that were read from a SparkListenerEvent
   * assumed to have a QueryExecution field named "qe".
   */
  def getTableInfos(event: SparkListenerSQLExecutionEnd): Seq[SparkTableInfo] = {
    val qe = SparkAutologgingUtils.getQueryExecution(event)
    if (qe != null) {
      val leafNodes = getLeafNodes(qe.analyzed)
      leafNodes.flatMap(getTableInfoToLog)
    } else {
      Seq.empty
    }
  }
}

/** Default datasource attribute extractor */
object DatasourceAttributeExtractor extends DatasourceAttributeExtractorBase {
  // TODO: attempt to detect Delta table info when Delta Lake becomes compatible with Spark 3.0
  override def maybeGetDeltaTableInfo(leafNode: LogicalPlan): Option[SparkTableInfo] = None
}

/** Datasource attribute extractor for REPL-ID aware environments (e.g. Databricks) */
object ReplAwareDatasourceAttributeExtractor extends DatasourceAttributeExtractorBase {
  override protected def maybeGetDeltaTableInfo(leafNode: LogicalPlan): Option[SparkTableInfo] = {
    try {
      leafNode match {
        case lr: LogicalRelation =>
          // First, check whether LogicalRelation is a Delta table
          val obj = ReflectionUtils.getScalaObjectByName("com.databricks.sql.transaction.tahoe.DeltaTable")
          val deltaFileIndexOpt = ReflectionUtils.callMethod(obj, "unapply", Seq(lr)).asInstanceOf[Option[Any]]
          deltaFileIndexOpt.map(fileIndex => {
            val path = ReflectionUtils.getField(fileIndex, "path").toString
            val versionOpt = ReflectionUtils.maybeCallMethod(fileIndex, "tableVersion", Seq.empty).orElse(
              ReflectionUtils.maybeCallMethod(fileIndex, "version", Seq.empty)
            ).map(_.toString)
            SparkTableInfo(path, versionOpt, Option("delta"))
          })
        case other => None
      }
    } catch {
      case NonFatal(e) =>
        if (logger.isTraceEnabled) {
          logger.trace(s"Unable to extract Delta table info: ${e.getMessage}")
        }
        None
    }
  }

  private def tryRedactString(value: String): String = {
    try {
      val redactor = ReflectionUtils.getScalaObjectByName(
        "com.databricks.spark.util.DatabricksSparkLogRedactor")
      ReflectionUtils.callMethod(redactor, "redact", Seq(value)).asInstanceOf[String]
    } catch {
      case NonFatal(e) =>
        if (logger.isTraceEnabled) {
          logger.trace(s"Redaction not available, using original value: ${e.getMessage}")
        }
        value
    }
  }

  private def applyRedaction(tableInfo: SparkTableInfo): SparkTableInfo = {
    tableInfo match {
      case SparkTableInfo(path, versionOpt, formatOpt) =>
        SparkTableInfo(tryRedactString(path), versionOpt, formatOpt)
    }
  }

  override def getTableInfos(event: SparkListenerSQLExecutionEnd): Seq[SparkTableInfo] = {
    super.getTableInfos(event).map(applyRedaction)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ExceptionUtils.scala]---
Location: mlflow-master/mlflow/java/spark/src/main/scala/org/mlflow/spark/autologging/ExceptionUtils.scala

```text
package org.mlflow.spark.autologging

import java.io.{PrintWriter, StringWriter}

import scala.util.control.NonFatal

import org.slf4j.Logger

private[autologging] object ExceptionUtils {
  /** Helper for generating a nicely-formatted string representation of a Throwable */
  def serializeException(exc: Throwable): String = {
    val sw = new StringWriter
    exc.printStackTrace(new PrintWriter(sw))
    sw.toString
  }

  def getUnexpectedExceptionMessage(exc: Throwable, msg: String): String = {
    s"Unexpected exception $msg. Please report this error, along with the " +
      s"following stacktrace, on https://github.com/mlflow/mlflow/issues:\n" +
      s"${ExceptionUtils.serializeException(exc)}"
  }

  def tryAndLogSilently(logger: Logger, errorMsg: String, fn: => Any): Unit = {
    try {
      fn
    } catch {
      case NonFatal(e) =>
        if (logger.isTraceEnabled) {
          logger.trace(s"Skipping operation $errorMsg: ${e.getMessage}")
        }
    }
  }

  def tryAndLogUnexpectedError(logger: Logger, errorMsg: String, fn: => Any): Unit = {
    try {
      fn
    } catch {
      case NonFatal(e) =>
        if (logger.isTraceEnabled) {
          logger.trace(getUnexpectedExceptionMessage(e, errorMsg))
        }
    }
  }

}
```

--------------------------------------------------------------------------------

---[FILE: MlflowAutologEventPublisher.scala]---
Location: mlflow-master/mlflow/java/spark/src/main/scala/org/mlflow/spark/autologging/MlflowAutologEventPublisher.scala

```text
package org.mlflow.spark.autologging

import java.util.concurrent.{ConcurrentHashMap, ScheduledFuture, ScheduledThreadPoolExecutor, TimeUnit}

import py4j.Py4JException
import org.apache.spark.scheduler.SparkListener

import scala.collection.JavaConverters._
import org.apache.spark.sql.SparkSession
import org.slf4j.LoggerFactory

import scala.util.{Try, Success, Failure}
import scala.util.control.NonFatal

/**
  * Object exposing the actual implementation of MlflowAutologEventPublisher.
  * We opt for this pattern (an object extending a trait) so that we can mock methods of the
  * trait in testing
  */
object MlflowAutologEventPublisher extends MlflowAutologEventPublisherImpl {

}

/**
 * Trait implementing a publisher interface for publishing events on Spark datasource reads to
 * a set of listeners. See the design doc:
 * https://docs.google.com/document/d/11nhwZtj-rps0stxuIioFBM9lkvIh_ua45cAFy_PqdHU/edit for more
 * details.
 */
private[autologging] trait MlflowAutologEventPublisherImpl {
  private val logger = LoggerFactory.getLogger(getClass)

  private[autologging] var sparkQueryListener: SparkListener = _
  private val executor = new ScheduledThreadPoolExecutor(1)
  private[autologging] val subscribers =
    new ConcurrentHashMap[String, MlflowAutologEventSubscriber]()
  private var scheduledTask: ScheduledFuture[_] = _

  def spark: SparkSession = {
    SparkSession.getActiveSession.getOrElse(throw new RuntimeException("Unable to get active " +
      "SparkSession. Please ensure you've started a SparkSession via " +
      "SparkSession.builder.getOrCreate() before attempting to initialize Spark datasource " +
      "autologging."))
  }

  /**
   * @returns True if Spark is running in a REPL-aware context. False otherwise.
   */
  private def isInReplAwareContext: Boolean = {
    // Attempt to fetch the `spark.databricks.replId` property from the Spark Context.
    // The presence of this ID is a clear indication that we are in a REPL-aware environment
    val sc = spark.sparkContext
    val replId = Option(sc.getLocalProperty("spark.databricks.replId"))
    if (replId.isDefined) {
      return true
    }

    // If the `spark.databricks.replId` is absent, we may still be in a Databricks environment,
    // which is REPL-aware. To check, we look for the presence of a Databricks-specific cluster ID
    // tag in the Spark configuration
    val clusterId = spark.conf.getOption("spark.databricks.clusterUsageTags.clusterId")
    if (clusterId.isDefined) {
      return true
    }

    false
  }

  // Exposed for testing
  private[autologging] def getSparkDataSourceListener: SparkListener = {
    if (isInReplAwareContext) {
      new ReplAwareSparkDataSourceListener(this)
    } else {
      new SparkDataSourceListener(this)
    }
  }

  // Initialize Spark listener that pulls Delta query plan information & bubbles it up to registered
  // Python subscribers, along with a GC loop for removing unrespoins
  def init(gcDeadSubscribersIntervalSec: Int = 1): Unit = synchronized {
    if (sparkQueryListener == null) {
      val listener = getSparkDataSourceListener
      // NB: We take care to set the variable only after adding the Spark listener succeeds,
      // in case listener registration throws. This is defensive - adding a listener should
      // always succeed.
      spark.sparkContext.addSparkListener(listener)
      sparkQueryListener = listener
      // Schedule regular cleanup of detached subscribers, e.g. those associated with detached
      // notebooks
      val task = new Runnable {
        def run(): Unit = {
          unregisterBrokenSubscribers()
        }
      }
      scheduledTask = executor.scheduleAtFixedRate(
        task, gcDeadSubscribersIntervalSec, gcDeadSubscribersIntervalSec, TimeUnit.SECONDS)
    }
  }

  def stop(): Unit = synchronized {
    if (sparkQueryListener != null) {
      spark.sparkContext.removeSparkListener(sparkQueryListener)
      sparkQueryListener = null
      while(!scheduledTask.cancel(false)) {
        Thread.sleep(1000)
        logger.info("Unable to cancel task for GC of unresponsive subscribers, retrying...")
      }
      subscribers.clear()
    }
  }

  def register(subscriber: MlflowAutologEventSubscriber): Unit = synchronized {
    if (sparkQueryListener == null) {
      throw new RuntimeException("Please call init() before attempting to register a subscriber")
    }
    subscribers.put(subscriber.replId, subscriber)
  }

  // Exposed for testing - in particular, so that we can iterate over subscribers in a specific
  // order within tests
  private[autologging] def getSubscribers: Seq[(String, MlflowAutologEventSubscriber)] = {
    subscribers.asScala.toSeq
  }

  /** Unregister subscribers broken e.g. due to detaching of the associated Python REPL */
  private[autologging] def unregisterBrokenSubscribers(): Unit = {
    val brokenReplIds = getSubscribers.flatMap { case (replId, listener) =>
      try {
        listener.ping()
        Seq.empty
      } catch {
        case e: Py4JException =>
          logger.info(s"Subscriber with repl ID $replId not responding to health checks, " +
            s"removing it")
          Seq(replId)
        case NonFatal(e) =>
          if (logger.isTraceEnabled) {
            val msg = ExceptionUtils.getUnexpectedExceptionMessage(e, "while checking health " +
              s"of subscriber with repl ID $replId, removing it")
            logger.trace(msg)
          }
          Seq(replId)
      }
    }
    brokenReplIds.foreach { replId =>
      subscribers.remove(replId)
    }
  }

  // https://github.com/delta-io/delta/blob/aaf3cd77dae06118f5cb7716eb2e71c791c6a148/core/src/main/scala/org/apache/spark/sql/delta/util/FileNames.scala#L26
  private val checkpointFilePattern = ".*\\d+\\.checkpoint(\\.\\d+\\.\\d+)?\\.parquet$".r.pattern
  private def isCheckpointFile(path: String): Boolean = checkpointFilePattern.matcher(path).matches()

  private def shouldSkipPublish(path: String, format: Option[String]): Boolean = {
    // 1. Spark first loads head of the data as unknown "text" to infer the schema, which we don't want to log
    // 2. Checkpoint files don't provide useful information, so we filter them out
    (format.isEmpty || format.get == "text") || isCheckpointFile(path)
  }

  private[autologging] def publishEvent(
      replIdOpt: Option[String],
      sparkTableInfo: SparkTableInfo): Unit = synchronized {
    sparkTableInfo match {
      case SparkTableInfo(path, version, format) if !shouldSkipPublish(path, format) =>
        for ((replId, listener) <- getSubscribers) {
          if (replIdOpt.isEmpty || replId == replIdOpt.get) {
            try {
              listener.notify(path, version.getOrElse("unknown"), format.getOrElse("unknown"))
            } catch {
              case NonFatal(e) =>
                if (logger.isTraceEnabled) {
                  logger.trace(s"Unable to forward event to listener with repl ID $replId. " +
                    s"Exception:\n${ExceptionUtils.serializeException(e)}")
                }
            }
          }
        }
      case _ =>
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: MlflowAutologEventSubscriber.scala]---
Location: mlflow-master/mlflow/java/spark/src/main/scala/org/mlflow/spark/autologging/MlflowAutologEventSubscriber.scala

```text
package org.mlflow.spark.autologging

/**
  * Trait defining subscriber interface for receiving information about Spark datasource reads.
  * This trait can be implemented in Python in order to obtain datasource read
  * information, see https://www.py4j.org/advanced_topics.html#implementing-java-interfaces-from-python-callback
  */
trait MlflowAutologEventSubscriber {
  /**
   * Method called on datasource reads.
   * @param path Path of the datasource that was read
   * @param version Version, if applicable (e.g. for Delta tables) of datasource that was read
   * @param format Format ("csv", "json", etc) of the datasource that was read
   */
  def notify(path: String, version: String, format: String): Any

  /**
   * Used to verify that a subscriber is still responsive - for example,
   * in the case of a Python subscriber, invoking the ping() method from Java via a Py4J callback
   * allows us to verify that the associated Python process is still alive.
   */
  def ping(): Unit

  /**
   * Return the ID of the notebook associated with this subscriber, if any. The returned ID is
   * expected to be unique across all subscribers (e.g. a UUID).
   */
  def replId: String
}
```

--------------------------------------------------------------------------------

---[FILE: ReflectionUtils.scala]---
Location: mlflow-master/mlflow/java/spark/src/main/scala/org/mlflow/spark/autologging/ReflectionUtils.scala

```text
package org.mlflow.spark.autologging

import java.lang.reflect.{Field, Method}

import scala.reflect.runtime.{universe => ru}
import org.slf4j.LoggerFactory

import scala.collection.mutable

private[autologging] object ReflectionUtils {
  private val logger = LoggerFactory.getLogger(getClass)
  private val rm = ru.runtimeMirror(getClass.getClassLoader)

  /** Get Scala object by its fully-qualified name */
  def getScalaObjectByName(name: String): Any = {
    val module = rm.staticModule(name)
    val obj = rm.reflectModule(module)
    obj.instance
  }

  def getField(obj: Any, fieldName: String): Any = {
    var declaredFields: mutable.Buffer[Field] = obj.getClass.getDeclaredFields.toBuffer
    var superClass = obj.getClass.getSuperclass
    while (superClass != null) {
      declaredFields = declaredFields ++ superClass.getDeclaredFields
      superClass = superClass.getSuperclass
    }
    val field = declaredFields.find(_.getName == fieldName).getOrElse {
      throw new RuntimeException(s"Unable to get field '$fieldName' in object with class " +
        s"${obj.getClass.getName}. Available fields: " +
        s"[${declaredFields.map(_.getName).mkString(", ")}]")
    }
    field.setAccessible(true)
    field.get(obj)
  }

  /**
    * Call method with provided name on the specified object. The method name is assumed to be
    * unique
    */
  def callMethod(obj: Any, name: Any, args: Seq[Object]): Any = {
    var declaredMethods: mutable.Buffer[Method] = obj.getClass.getDeclaredMethods.toBuffer
    var superClass = obj.getClass.getSuperclass
    while (superClass != null) {
      declaredMethods = declaredMethods ++ superClass.getDeclaredMethods
      superClass = superClass.getSuperclass
    }
    val method = declaredMethods.find(_.getName == name).getOrElse(
      throw new RuntimeException(s"Unable to find method with name $name of object with class " +
        s"${obj.getClass.getName}. Available methods: " +
        s"[${declaredMethods.map(_.getName).mkString(", ")}]"))
    method.invoke(obj, args: _*)
  }

  def maybeCallMethod(obj: Any, name: Any, args: Seq[Object]): Option[Any] = {
    var declaredMethods: mutable.Buffer[Method] = obj.getClass.getDeclaredMethods.toBuffer
    var superClass = obj.getClass.getSuperclass
    while (superClass != null) {
      declaredMethods = declaredMethods ++ superClass.getDeclaredMethods
      superClass = superClass.getSuperclass
    }

    val methodOpt = declaredMethods.find(_.getName == name)

    methodOpt match {
      case Some(method) => Some(method.invoke(obj, args: _*))
      case None => None
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ReplAwareSparkDataSourceListener.scala]---
Location: mlflow-master/mlflow/java/spark/src/main/scala/org/mlflow/spark/autologging/ReplAwareSparkDataSourceListener.scala

```text
package org.mlflow.spark.autologging

import org.apache.spark.scheduler._
import org.apache.spark.sql.catalyst.plans.logical.{LeafNode, LogicalPlan}
import org.apache.spark.sql.execution.ui.{SparkListenerSQLExecutionEnd, SparkListenerSQLExecutionStart}
import org.apache.spark.sql.execution.{QueryExecution, SQLExecution}

import scala.collection.JavaConverters._
import scala.collection.mutable

/**
 * Implementation of the SparkListener interface used to detect Spark datasource reads.
 * and notify subscribers. Used in REPL-ID aware environments (e.g. Databricks)
 */
class ReplAwareSparkDataSourceListener(
    publisher: MlflowAutologEventPublisherImpl = MlflowAutologEventPublisher)
  extends SparkDataSourceListener(publisher) {
  private val executionIdToReplId = mutable.Map[Long, String]()

  override protected def getDatasourceAttributeExtractor: DatasourceAttributeExtractorBase = {
    ReplAwareDatasourceAttributeExtractor
  }

  private[autologging] def getProperties(event: SparkListenerJobStart): Map[String, String] = {
    Option(event.properties).map(_.asScala.toMap).getOrElse(Map.empty)
  }

  override def onJobStart(event: SparkListenerJobStart): Unit = {
    val properties = getProperties(event)
    val executionIdOpt = properties.get(SQLExecution.EXECUTION_ID_KEY).map(_.toLong)
    val replIdOpt = properties.get("spark.databricks.replId")

    (executionIdOpt, replIdOpt) match {
      case (Some(executionId), Some(replId)) =>
        executionIdToReplId.put(executionId, replId)
      case _ =>
        logger.trace(s"Skipping datasource autolog - required properties not available")
    }
  }

  protected[autologging] override def onSQLExecutionEnd(event: SparkListenerSQLExecutionEnd): Unit = {
    val extractor = getDatasourceAttributeExtractor
    val tableInfos = extractor.getTableInfos(event)
    val replIdOpt = popReplIdOpt(event)
    if (replIdOpt.isDefined) {
      tableInfos.foreach { tableInfo =>
        publisher.publishEvent(replIdOpt = replIdOpt, sparkTableInfo = tableInfo)
      }
    }
  }

  private def popReplIdOpt(event: SparkListenerSQLExecutionEnd): Option[String] = {
    executionIdToReplId.remove(event.executionId)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: SparkDataSourceListener.scala]---
Location: mlflow-master/mlflow/java/spark/src/main/scala/org/mlflow/spark/autologging/SparkDataSourceListener.scala

```text
package org.mlflow.spark.autologging

import org.apache.spark.scheduler._
import org.apache.spark.sql.execution.ui.SparkListenerSQLExecutionEnd
import org.slf4j.LoggerFactory
import scala.util.control.NonFatal


/**
 * Implementation of the SparkListener interface used to detect Spark datasource reads.
 * and notify subscribers.
 */
class SparkDataSourceListener(
    publisher: MlflowAutologEventPublisherImpl = MlflowAutologEventPublisher) extends SparkListener {
  protected val logger = LoggerFactory.getLogger(getClass)

  protected def getDatasourceAttributeExtractor: DatasourceAttributeExtractorBase = {
    DatasourceAttributeExtractor
  }

  protected[autologging] def onSQLExecutionEnd(event: SparkListenerSQLExecutionEnd): Unit = {
    val extractor = getDatasourceAttributeExtractor
    val tableInfos = extractor.getTableInfos(event)
    tableInfos.foreach { tableInfo =>
      publisher.publishEvent(replIdOpt = None, sparkTableInfo = tableInfo)
    }
  }

  override def onOtherEvent(event: SparkListenerEvent): Unit = {
    event match {
      case e: SparkListenerSQLExecutionEnd =>
        try {
          onSQLExecutionEnd(e)
        } catch {
          case NonFatal(ex) =>
            logger.trace(s"Skipping datasource autolog: ${ex.getMessage}")
        }
      case _ =>
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: MlflowSparkAutologgingTestUtils.scala]---
Location: mlflow-master/mlflow/java/spark/src/test/scala/org/apache/spark/mlflow/MlflowSparkAutologgingTestUtils.scala

```text
package org.apache.spark.mlflow

import org.apache.spark.scheduler.SparkListenerInterface
import org.apache.spark.sql.SparkSession
import org.mlflow.spark.autologging.SparkDataSourceListener

/** Test-only object used to access Spark-private fields */
object MlflowSparkAutologgingTestUtils {
  def getListeners(spark: SparkSession): Seq[SparkListenerInterface] = {
    spark.sparkContext.listenerBus.findListenersByClass[SparkDataSourceListener]
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ReflectionUtilsSuite.scala]---
Location: mlflow-master/mlflow/java/spark/src/test/scala/org/mlflow/spark/autologging/ReflectionUtilsSuite.scala

```text
package org.mlflow.spark.autologging

import org.scalatest.funsuite.AnyFunSuite

object TestObject {
  def myMethod: String = "hi"
}

object TestFileIndex {
  def version: String = "1.0"
}

abstract class TestAbstractClass {
  protected def addNumbers(x: Int, y: Int): Int = x + y
  protected val myProtectedVal: Int = 5
}

class RealClass extends TestAbstractClass {
  private val myField: String = "myCoolVal"
  def subclassMethod(x: Int): Int = x * x
}

class ReflectionUtilsSuite extends AnyFunSuite {

  test("Can get private & protected fields of an object via reflection") {
    val obj = new RealClass()
    val field0 = ReflectionUtils.getField(obj, "myField").asInstanceOf[String]
    assert(field0 == "myCoolVal")
    val field1 = ReflectionUtils.getField(obj, "myProtectedVal").asInstanceOf[Int]
    assert(field1 == 5)
  }

  test("Can call methods via reflection") {
    val obj = new RealClass()
    val args0: Seq[Object] = Seq[Integer](3)
    val res0 = ReflectionUtils.callMethod(obj, "subclassMethod", args0).asInstanceOf[Int]
    assert(res0 == 9)
    val args1: Seq[Object] = Seq[Integer](5, 6)
    val res1 = ReflectionUtils.callMethod(obj, "addNumbers", args1).asInstanceOf[Int]
    assert(res1 == 11)
  }

  test("Can get Scala object and call methods via reflection") {
    val obj = ReflectionUtils.getScalaObjectByName("org.mlflow.spark.autologging.TestObject")
    val res = ReflectionUtils.callMethod(obj, "myMethod", Seq.empty).asInstanceOf[String]
    assert(res == "hi")
  }

  test("maybeCallMethod None if method not found") {
    val obj = new RealClass()
    val res = ReflectionUtils.maybeCallMethod(obj, "nonExistentMethod", Seq.empty)

    assert (res.isEmpty)
  }

  test("maybeCallMethod invokes the method if the method is found") {
    val obj = ReflectionUtils.getScalaObjectByName("org.mlflow.spark.autologging.TestObject")
    val res0 = ReflectionUtils.maybeCallMethod(obj, "myMethod", Seq.empty).getOrElse("")
    assert(res0 == "hi")
  }

  test("chaining maybeCallMethod works") {
    val fileIndex = ReflectionUtils.getScalaObjectByName("org.mlflow.spark.autologging.TestFileIndex")

    val versionOpt0 = ReflectionUtils.maybeCallMethod(fileIndex, "version", Seq.empty).orElse(
      Option("second thing")
    ).map(_.toString)
    assert(versionOpt0 == Some("1.0"))

    // if only the second method exists, return it
    val versionOpt1 = ReflectionUtils.maybeCallMethod(fileIndex, "tableVersion", Seq.empty).orElse(
      ReflectionUtils.maybeCallMethod(fileIndex, "version", Seq.empty)
    ).map(_.toString)
    assert(versionOpt1 == Some("1.0"))

    // if both don't exist, just return None
    val versionOpt2 = ReflectionUtils.maybeCallMethod(fileIndex, "tableVersion", Seq.empty).orElse(
      ReflectionUtils.maybeCallMethod(fileIndex, "anotherTableVersion", Seq.empty)
    ).map(_.toString)
    assert(versionOpt2 == None)
  }
}
```

--------------------------------------------------------------------------------

````
