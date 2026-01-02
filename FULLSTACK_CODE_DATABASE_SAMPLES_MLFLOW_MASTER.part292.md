---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 292
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 292 of 991)

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

---[FILE: pom.xml]---
Location: mlflow-master/mlflow/java/pom.xml

```text
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>org.mlflow</groupId>
  <artifactId>mlflow-parent</artifactId>
  <version>3.8.1-SNAPSHOT</version>
  <packaging>pom</packaging>
  <name>MLflow Parent POM</name>
  <url>http://mlflow.org</url>

  <description>Open source platform for the machine learning lifecycle</description>

  <repositories>
    <repository>
      <id>google-maven-central</id>
      <name>Google Maven Central</name>
      <url>https://maven-central.storage-download.googleapis.com/repos/central/data</url>
    </repository>
  </repositories>

  <pluginRepositories>
    <pluginRepository>
      <id>google-maven-central</id>
      <name>Google Maven Central</name>
      <url>https://maven-central.storage-download.googleapis.com/repos/central/data</url>
    </pluginRepository>
  </pluginRepositories>

  <!-- The following sections (licenses, developers, scm, and distributionManagement) are needed to
       publish pom-only packages to Maven -->
  <licenses>
    <license>
      <name>The Apache License, Version 2.0</name>
      <url>http://www.apache.org/licenses/LICENSE-2.0.txt</url>
    </license>
  </licenses>
  <developers>
    <developer>
      <name>Matei Zaharia</name>
      <email>matei@databricks.com</email>
      <organization>Databricks</organization>
      <organizationUrl>http://www.databricks.com</organizationUrl>
    </developer>
  </developers>
  <scm>
    <connection>scm:git:git://github.com/mlflow/mlflow.git</connection>
    <developerConnection>scm:git:ssh://github.com:mlflow/mlflow.git</developerConnection>
    <url>http://github.com/mlflow/mlflow/tree/master</url>
  </scm>

  <properties>
    <mlflow-version>3.8.1-SNAPSHOT</mlflow-version>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
    <scala.version>2.11.12</scala.version>
    <httpclient.version>4.5.6</httpclient.version>
    <git-commit.version>2.2.4</git-commit.version>
    <protobuf.version>3.19.6</protobuf.version>
    <scalapb.version>0.6.7</scalapb.version>
    <testng.version>6.14.3</testng.version>
    <slf4j.version>1.7.25</slf4j.version>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
  </properties>

  <modules>
    <module>client</module>
    <module>spark_2.12</module>
    <module>spark_2.13</module>
  </modules>

  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.12</version>
        <scope>test</scope>
      </dependency>
      <dependency>
        <groupId>org.mockito</groupId>
        <artifactId>mockito-core</artifactId>
        <version>2.28.2</version>
        <scope>test</scope>
      </dependency>
      <dependency>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-surefire-plugin</artifactId>
        <version>2.22.0</version>
        <scope>test</scope>
        <exclusions>
          <exclusion>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-nop</artifactId>
          </exclusion>
          <exclusion>
            <groupId>org.slf4j</groupId>
            <artifactId>jcl-over-slf4j</artifactId>
          </exclusion>
        </exclusions>
      </dependency>
      <dependency>
        <groupId>org.eclipse.jetty</groupId>
        <artifactId>jetty-server</artifactId>
        <version>9.4.11.v20180605</version>
      </dependency>
      <dependency>
        <groupId>org.eclipse.jetty</groupId>
        <artifactId>jetty-servlet</artifactId>
        <version>9.4.11.v20180605</version>
      </dependency>
      <dependency>
        <groupId>org.eclipse.jetty</groupId>
        <artifactId>jetty-util</artifactId>
        <version>9.4.11.v20180605</version>
      </dependency>
      <dependency>
        <groupId>commons-io</groupId>
        <artifactId>commons-io</artifactId>
        <version>2.5</version>
      </dependency>
      <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-api</artifactId>
        <version>${slf4j.version}</version>
      </dependency>
      <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-simple</artifactId>
        <version>${slf4j.version}</version>
      </dependency>
      <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-jdk14</artifactId>
        <version>${slf4j.version}</version>
      </dependency>
      <dependency>
        <groupId>org.apache.httpcomponents</groupId>
        <artifactId>httpclient</artifactId>
        <version>${httpclient.version}</version>
      </dependency>
      <dependency>
        <groupId>pl.project13.maven</groupId>
        <artifactId>git-commit-id-plugin</artifactId>
        <version>${git-commit.version}</version>
      </dependency>
      <dependency>
        <groupId>org.testng</groupId>
        <artifactId>testng</artifactId>
        <version>${testng.version}</version>
        <scope>test</scope>
      </dependency>
      <dependency>
        <groupId>com.google.protobuf</groupId>
        <artifactId>protobuf-java</artifactId>
        <version>${protobuf.version}</version>
      </dependency>
      <dependency>
        <groupId>com.google.protobuf</groupId>
        <artifactId>protobuf-java-util</artifactId>
        <version>${protobuf.version}</version>
      </dependency>
      <dependency>
        <groupId>javax.annotation</groupId>
        <artifactId>javax.annotation-api</artifactId>
        <version>1.2</version>
      </dependency>
      <dependency>
        <groupId>org.ini4j</groupId>
        <artifactId>ini4j</artifactId>
        <version>0.5.4</version>
      </dependency>
    </dependencies>
  </dependencyManagement>
  <build>
    <plugins>
      <plugin>
        <groupId>org.sonatype.central</groupId>
        <artifactId>central-publishing-maven-plugin</artifactId>
        <version>0.8.0</version>
        <extensions>true</extensions>
        <configuration>
            <publishingServerId>central</publishingServerId>
            <centralSnapshotsUrl>https://central.sonatype.com/repository/maven-snapshots/</centralSnapshotsUrl>
            <autoPublish>true</autoPublish>
        </configuration>
      </plugin>
    </plugins>
    <pluginManagement>
      <plugins>
        <plugin>
          <groupId>org.apache.maven.plugins</groupId>
          <artifactId>maven-checkstyle-plugin</artifactId>
          <version>3.0.0</version>
          <executions>
            <execution>
              <id>checkstyle</id>
              <phase>prepare-package</phase>
              <goals>
                <goal>check</goal>
              </goals>
              <configuration>
                <failOnViolation>true</failOnViolation>
                <logViolationsToConsole>true</logViolationsToConsole>
                <checkstyleRules>
                  <module name="Checker">
                    <module name="TreeWalker">
                      <module name="LineLength">
                        <property name="max" value="100"/>
                      </module>
                    </module>
                  </module>
                </checkstyleRules>
                <excludes>com/databricks/**,org/mlflow/api/proto/**,org/mlflow/scalapb_interface/**</excludes>
              </configuration>
            </execution>
          </executions>
        </plugin>
        <plugin>
          <groupId>org.apache.maven.plugins</groupId>
          <artifactId>maven-shade-plugin</artifactId>
          <version>3.1.0</version>
        </plugin>
        <plugin>
          <groupId>org.apache.maven.plugins</groupId>
          <artifactId>maven-javadoc-plugin</artifactId>
          <version>3.0.1</version>
          <executions>
            <execution>
              <id>attach-javadocs</id>
              <goals>
                <goal>jar</goal>
              </goals>
            </execution>
          </executions>
        </plugin>
        <plugin>
          <groupId>org.apache.maven.plugins</groupId>
          <artifactId>maven-source-plugin</artifactId>
          <version>3.0.1</version>
          <executions>
            <execution>
              <id>attach-sources</id>
              <goals>
                <goal>jar</goal>
              </goals>
            </execution>
          </executions>
        </plugin>
        <plugin>
          <groupId>net.alchim31.maven</groupId>
          <artifactId>scala-maven-plugin</artifactId>
          <version>4.2.0</version>
        </plugin>
        <plugin>
          <groupId>org.apache.maven.plugins</groupId>
          <artifactId>maven-gpg-plugin</artifactId>
          <version>1.6</version>
        </plugin>
      </plugins>
    </pluginManagement>
  </build>
  <profiles>
    <profile>
      <id>do-sign</id>
      <build>
        <plugins>
          <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-gpg-plugin</artifactId>
            <version>1.6</version>
            <executions>
              <execution>
                <id>sign-artifacts</id>
                <phase>verify</phase>
                <goals>
                  <goal>sign</goal>
                </goals>
                <configuration>
                  <keyname>${gpg.keyname}</keyname>
                  <passphraseServerId>${gpg.keyname}</passphraseServerId>
                  <gpgArguments>
                    <arg>-v</arg>
                    <arg>--batch</arg>
                    <arg>--pinentry-mode</arg>
                    <arg>loopback</arg>
                  </gpgArguments>
                  <executable>gpg2</executable>
                </configuration>
              </execution>
            </executions>
          </plugin>
        </plugins>
      </build>
    </profile>
  </profiles>
</project>
```

--------------------------------------------------------------------------------

---[FILE: pom.xml]---
Location: mlflow-master/mlflow/java/client/pom.xml

```text
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <parent>
    <groupId>org.mlflow</groupId>
    <artifactId>mlflow-parent</artifactId>
    <version>3.8.1-SNAPSHOT</version>
    <relativePath>../pom.xml</relativePath>
  </parent>

  <artifactId>mlflow-client</artifactId>
  <packaging>jar</packaging>
  <name>MLflow Tracking API</name>
  <url>http://mlflow.org</url>
  <properties>
    <mlflow.shade.packageName>org.mlflow_project</mlflow.shade.packageName>
  </properties>

  <dependencies>
    <dependency>
      <groupId>org.slf4j</groupId>
      <artifactId>slf4j-api</artifactId>
    </dependency>
    <dependency>
      <groupId>org.apache.httpcomponents</groupId>
      <artifactId>httpclient</artifactId>
    </dependency>
    <dependency>
      <groupId>com.google.protobuf</groupId>
      <artifactId>protobuf-java</artifactId>
    </dependency>
    <dependency>
      <groupId>com.google.protobuf</groupId>
      <artifactId>protobuf-java-util</artifactId>
    </dependency>
    <dependency>
      <groupId>commons-io</groupId>
      <artifactId>commons-io</artifactId>
    </dependency>
    <dependency>
      <groupId>org.ini4j</groupId>
      <artifactId>ini4j</artifactId>
    </dependency>
    <dependency>
      <groupId>io.opentelemetry.proto</groupId>
      <artifactId>opentelemetry-proto</artifactId>
      <!-- use 0.20.0 to be compatible with protobuf 3.19.6, we should upgrade later -->
      <version>0.20.0-alpha</version>
    </dependency>

    <!-- Test dependencies -->
    <dependency>
      <groupId>org.testng</groupId>
      <artifactId>testng</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>org.slf4j</groupId>
      <artifactId>slf4j-jdk14</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>org.mockito</groupId>
      <artifactId>mockito-core</artifactId>
      <scope>test</scope>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-checkstyle-plugin</artifactId>
      </plugin>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-javadoc-plugin</artifactId>
        <configuration>
          <sourcepath>${project.basedir}/src/main/java</sourcepath>
          <excludePackageNames>com.databricks.api.proto.databricks:org.mlflow.scalapb_interface:org.mlflow.tracking.samples:org.mlflow.artifacts</excludePackageNames>
          <groups>
            <group>
              <title>Tracking API</title>
              <packages>org.mlflow.tracking:org.mlflow.tracking.*</packages>
            </group>
          </groups>
        </configuration>
      </plugin>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-source-plugin</artifactId>
      </plugin>

      <plugin>
        <!--
        We construct a comprehensive shaded artifact so that we do not require that downstream
        clients pick particular versions of protobuf, guava, apache http, and apache commons.
        -->
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-shade-plugin</artifactId>
        <configuration>
          <minimizeJar>false</minimizeJar>
          <shadedArtifactAttached>false</shadedArtifactAttached>
          <artifactSet>
            <includes>
              <include>com.google.protobuf:protobuf-java</include>
              <include>com.google.protobuf:protobuf-java-util</include>
              <include>org.apache.httpcomponents:httpclient</include>
              <include>com.google.guava:guava</include>
              <include>com.google.code.gson:gson</include>
              <include>commons-codec:commons-codec</include>
              <include>commons-io:commons-io</include>
              <include>commons-logging:commons-logging</include>
              <include>org.apache.httpcomponents:httpcore</include>
              <include>org.ini4j:ini4j</include>
              <include>io.opentelemetry.proto:opentelemetry-proto</include>
            </includes>
          </artifactSet>
          <relocations>
            <relocation>
              <pattern>com.google</pattern>
              <shadedPattern>${mlflow.shade.packageName}.google</shadedPattern>
            </relocation>
            <relocation>
              <pattern>org.apache.commons</pattern>
              <shadedPattern>${mlflow.shade.packageName}.apachecommons</shadedPattern>
            </relocation>
            <relocation>
              <pattern>org.apache.http</pattern>
              <shadedPattern>${mlflow.shade.packageName}.apachehttp</shadedPattern>
            </relocation>
            <relocation>
              <!-- We have to move this package as it conflicts with other Databricks jars. -->
              <pattern>com.databricks.api.proto.databricks</pattern>
              <shadedPattern>${mlflow.shade.packageName}.databricks</shadedPattern>
            </relocation>
            <relocation>
              <pattern>org.ini4j</pattern>
              <shadedPattern>${mlflow.shade.packageName}.ini4j</shadedPattern>
            </relocation>
            <relocation>
              <pattern>io.opentelemetry</pattern>
              <shadedPattern>${mlflow.shade.packageName}.opentelemetry</shadedPattern>
            </relocation>
          </relocations>
          <transformers>
            <transformer implementation="org.apache.maven.plugins.shade.resource.DontIncludeResourceTransformer">
              <resources>
                <resource>public-suffix-list.txt</resource>
                <resource>log4j.properties</resource>
                <resource>.proto</resource>
              </resources>
            </transformer>
          </transformers>
        </configuration>
        <executions>
          <execution>
            <phase>package</phase>
            <goals>
              <goal>shade</goal>
            </goals>
          </execution>
        </executions>
      </plugin>
      </plugins>
  </build>
  <profiles>
    <profile>
      <id>do-sign</id>
    </profile>
  </profiles>
</project>
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/mlflow/java/client/README.md

```text
# MLflow Java Client

Java client for [MLflow](https://mlflow.org) REST API.
See also the MLflow [Python API](https://mlflow.org/docs/latest/python_api/index.html)
and [REST API](https://mlflow.org/docs/latest/rest-api.html).

## Requirements

- Java 1.8
- Maven
- Run the [MLflow Tracking Server 0.4.2](https://mlflow.org/docs/latest/tracking.html#running-a-tracking-server)

## Build

### Build with tests

The MLflow Java client tests require that MLflow is on the PATH (to start a local server),
so it is recommended to run them from within a development conda environment.

To build a deployable JAR and run tests:

```
mvn package
```

## Run

To run a simple sample.

```
java -cp target/mlflow-java-client-0.4.2.jar \
  com.databricks.mlflow.client.samples.QuickStartDriver http://localhost:5001
```

## JSON Serialization

MLflow Java client uses [Protobuf](https://developers.google.com/protocol-buffers/) 3.6.0 to serialize the JSON payload.

- [service.proto](../mlflow/protos/service.proto) - Protobuf definition of data objects.
- [com.databricks.api.proto.mlflow.Service.java](src/main/java/com/databricks/api/proto/mlflow/Service.java) - Generated Java classes of all data objects.
- [generate_protos.py](generate_protos.py) - One time script to generate Service.java. If service.proto changes you will need to re-run this script.
- Javadoc can be generated by running `mvn javadoc:javadoc`. The output will be in [target/site/apidocs/index.html](target/site/apidocs/index.html).
  Here is the javadoc for [Service.java](target/site/apidocs/com/databricks/api/proto/mlflow/Service.html).

## Java Client API

See [ApiClient.java](src/main/java/org/mlflow/client/ApiClient.java)
and [Service.java domain objects](src/main/java/org/mlflow/api/proto/mlflow/Service.java).

```
Run getRun(String runId)
RunInfo createRun()
RunInfo createRun(String experimentId)
RunInfo createRun(String experimentId, String appName)
RunInfo createRun(CreateRun request)
List<RunInfo> listRunInfos(String experimentId)


List<Experiment> searchExperiments()
GetExperiment.Response getExperiment(String experimentId)
Optional<Experiment> getExperimentByName(String experimentName)
long createExperiment(String experimentName)

void logParam(String runId, String key, String value)
void logMetric(String runId, String key, float value)
void setTerminated(String runId)
void setTerminated(String runId, RunStatus status)
void setTerminated(String runId, RunStatus status, long endTime)
ListArtifacts.Response listArtifacts(String runId, String path)
```

## Usage

### Java Usage

For a simple example see [QuickStartDriver.java](src/main/java/org/mlflow/tracking/samples/QuickStartDriver.java).
For full examples of API coverage see the [tests](src/test/java/org/mlflow/tracking) such as [MlflowClientTest.java](src/test/java/org/mlflow/tracking/MlflowClientTest.java).

```
package org.mlflow.tracking.samples;

import java.util.List;
import java.util.Optional;

import org.apache.log4j.Level;
import org.apache.log4j.LogManager;

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

    boolean verbose = args.length >= 2 && "true".equals(args[1]);
    if (verbose) {
      LogManager.getLogger("org.mlflow.client").setLevel(Level.DEBUG);
    }

    System.out.println("====== createExperiment");
    String expName = "Exp_" + System.currentTimeMillis();
    String expId = client.createExperiment(expName);
    System.out.println("createExperiment: expId=" + expId);

    System.out.println("====== getExperiment");
    GetExperiment.Response exp = client.getExperiment(expId);
    System.out.println("getExperiment: " + exp);

    System.out.println("====== searchExperiments");
    List<Experiment> exps = client.searchExperiments();
    System.out.println("#experiments: " + exps.size());
    exps.forEach(e -> System.out.println("  Exp: " + e));

    createRun(client, expId);

    System.out.println("====== getExperiment again");
    GetExperiment.Response exp2 = client.getExperiment(expId);
    System.out.println("getExperiment: " + exp2);

    System.out.println("====== getExperiment by name");
    Optional<Experiment> exp3 = client.getExperimentByName(expName);
    System.out.println("getExperimentByName: " + exp3);
  }

  void createRun(MlflowClient client, String expId) {
    System.out.println("====== createRun");

    // Create run
    String sourceFile = "MyFile.java";
    RunInfo runCreated = client.createRun(expId, sourceFile);
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
    client.close();
  }
}
```
```

--------------------------------------------------------------------------------

````
