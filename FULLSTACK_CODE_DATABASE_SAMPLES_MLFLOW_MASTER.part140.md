---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 140
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 140 of 991)

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

---[FILE: artifact-store.mdx]---
Location: mlflow-master/docs/docs/self-hosting/architecture/artifact-store.mdx

```text
import { APILink } from "@site/src/components/APILink";

# Artifact Stores

The artifact store is a core component in [MLflow Tracking](/ml/tracking) where MLflow stores (typically large) artifacts
for each run such as model weights (e.g. a pickled scikit-learn model), images (e.g. PNGs), model and data files (e.g. [Parquet](https://parquet.apache.org/) file).
Note that metadata like parameters, metrics, and tags are stored in a [backend store](/self-hosting/architecture/backend-store) (e.g., PostGres, MySQL, or MSSQL Database), the other component of the MLflow Tracking.

## Configuring an Artifact Store

MLflow by default stores artifacts in a local (file system) `./mlruns` directory, but also supports various locations suitable for large data:
Amazon S3, Azure Blob Storage, Google Cloud Storage, SFTP server, and NFS. You can connect those remote storages via the MLflow Tracking server.
See [tracking server setup](/self-hosting/architecture/tracking-server#tracking-server-artifact-store) and the specific section for your storage in [supported storages](/self-hosting/architecture/artifact-store#artifacts-store-supported-storages) for guidance on
how to connect to the remote storage of your choice.

### Managing Artifact Store Access \{#artifacts-stores-manage-access}

To allow the server and clients to access the artifact location, you should configure your cloud
provider credentials as you would for accessing them in any other capacity. For example, for S3, you can set the `AWS_ACCESS_KEY_ID`
and `AWS_SECRET_ACCESS_KEY` environment variables, use an IAM role, or configure a default
profile in `~/.aws/credentials`.

:::warning important
Access of credentials and configurations for the artifact storage location are configured **once during the tracking server initialization** instead
of having to provide access credentials for artifact-based operations through the client APIs. Note that **all users who have access to the
Tracking Server in this mode will have access to artifacts served through this assumed role**.
:::

### Setting an access Timeout

You can set the environment variable `MLFLOW_ARTIFACT_UPLOAD_DOWNLOAD_TIMEOUT` (in seconds) to configure the timeout for artifact uploads and downloads.
If it's not set, MLflow will use the default timeout for the underlying storage client library (e.g. boto3 for S3).
Note that this is an experimental feature and it may be modified as needed.

### Setting a Default Artifact Location for Logging

MLflow automatically records the `artifact_uri` property as a part of <APILink fn="mlflow.entities.RunInfo">`mlflow.entities.RunInfo`</APILink> so that you can
retrieve the location of the artifacts for historical runs using the <APILink fn="mlflow.get_artifact_uri" /> API.
Also, `artifact_location` is a property recorded on <APILink fn="mlflow.entities.Experiment">`mlflow.entities.Experiment`</APILink> for setting the
default location to store artifacts for all runs for models within a given experiment.

:::warning important
If you do not specify a `--default-artifact-root` or an artifact URI when creating the experiment
(for example, `mlflow experiments create --artifact-location s3://<my-bucket>`), the artifact root
will be set as a path inside the local file store (the hard drive of the computer executing your run). Typically this is not an appropriate location, as the client and
server probably refer to different physical locations (that is, the same path on different disks or computers).
:::

## Supported storage types for the Artifact Store \{#artifacts-store-supported-storages}

### Amazon S3 and S3-compatible storage

To store artifacts in S3 (whether on Amazon S3 or on an S3-compatible alternative, such as
[MinIO](https://min.io/) or [Digital Ocean Spaces](https://www.digitalocean.com/products/spaces), specify a URI of the form `s3://<bucket>/<path>`. MLflow obtains
credentials to access S3 from your machine's IAM role, a profile in `~/.aws/credentials`, or
the environment variables `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` depending on which of
these are available. For more information on how to set credentials, see
[Set up AWS Credentials and Region for Development](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/setup-credentials.html).

Followings are commonly used environment variables for configuring S3 storage access. The complete list of configurable parameters for an S3 client is available in the
[boto3 documentation](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/configuration.html#configuration).

#### Passing Extra Arguments to S3 Upload

To add S3 file upload extra arguments, set `MLFLOW_S3_UPLOAD_EXTRA_ARGS` to a JSON object of key/value pairs.
For example, if you want to upload to a KMS Encrypted bucket using the KMS Key 1234:

```bash
export MLFLOW_S3_UPLOAD_EXTRA_ARGS='{"ServerSideEncryption": "aws:kms", "SSEKMSKeyId": "1234"}'
```

For a list of available extra args see [Boto3 ExtraArgs Documentation](https://github.com/boto/boto3/blob/develop/docs/source/guide/s3-uploading-files.rst#the-extraargs-parameter).

#### Bucket Ownership Verification

To protect against bucket takeover attacks where a deleted bucket is recreated by a different AWS account, you can set `MLFLOW_S3_EXPECTED_BUCKET_OWNER` to the expected AWS account ID that owns your S3 bucket:

```bash
export MLFLOW_S3_EXPECTED_BUCKET_OWNER=123456789012
```

When set, MLflow will include the `ExpectedBucketOwner` parameter in all S3 API calls. If the bucket is owned by a different account, S3 will reject the operation with an access denied error, preventing unauthorized access to artifacts.

This is particularly important for scenarios where:

- S3 bucket names are globally unique across all AWS accounts
- A bucket could be deleted and recreated by an attacker with the same name
- MLflow would unknowingly send artifacts to the attacker's bucket

For more information, see the [AWS S3 Bucket Owner Condition documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-owner-condition.html).

#### Setting Custom S3 Endpoints

To store artifacts in a custom endpoint, set the `MLFLOW_S3_ENDPOINT_URL` to your endpoint's URL. For example, if you are using Digital Ocean Spaces:

```bash
export MLFLOW_S3_ENDPOINT_URL=https://<region>.digitaloceanspaces.com
```

If you have a MinIO server at 1.2.3.4 on port 9000:

```bash
export MLFLOW_S3_ENDPOINT_URL=http://1.2.3.4:9000
```

#### Using Non-TLS Authentication

If the MinIO server is configured with using SSL self-signed or signed using some internal-only CA certificate, you could set `MLFLOW_S3_IGNORE_TLS` or `AWS_CA_BUNDLE` variables (not both at the same time!) to disable certificate signature check, or add a custom CA bundle to perform this check, respectively:

```bash
export MLFLOW_S3_IGNORE_TLS=true
#or
export AWS_CA_BUNDLE=/some/ca/bundle.pem
```

#### Setting Bucket Region

Additionally, if MinIO server is configured with non-default region, you should set `AWS_DEFAULT_REGION` variable:

```bash
export AWS_DEFAULT_REGION=my_region
```

:::warning
The MLflow tracking server utilizes specific reserved keywords to generate a qualified path. These environment configurations, if present in the client environment, can create path resolution issues.
For example, providing `--default-artifact-root $MLFLOW_S3_ENDPOINT_URL` on the server side **and** `MLFLOW_S3_ENDPOINT_URL` on the client side will create a client path resolution issue for the artifact storage location.
Upon resolving the artifact storage location, the MLflow client will use the value provided by `--default-artifact-root` and suffixes the location with the values provided in the environment variable `MLFLOW_S3_ENDPOINT_URL`.
Depending on the value set for the environment variable `MLFLOW_S3_ENDPOINT_URL`, the resulting artifact storage path for this scenario would be one of the following invalid object store paths: `https://<bucketname>.s3.<region>.amazonaws.com/<key>/<bucketname>/<key>` or `s3://<bucketname>/<key>/<bucketname>/<key>`.
To prevent path parsing issues, **ensure that reserved environment variables are removed (`unset`) from client environments**.
:::

### Azure Blob Storage

To store artifacts in Azure Blob Storage, specify a URI of the form
`wasbs://<container>@<storage-account>.blob.core.windows.net/<path>`.
MLflow expects that your Azure Storage access credentials are located in the
`AZURE_STORAGE_CONNECTION_STRING` and `AZURE_STORAGE_ACCESS_KEY` environment variables
or having your credentials configured such that the [DefaultAzureCredential()](https://docs.microsoft.com/en-us/python/api/overview/azure/identity-readme?view=azure-python) class can pick them up.
The order of precedence is:

1. `AZURE_STORAGE_CONNECTION_STRING`
2. `AZURE_STORAGE_ACCESS_KEY`
3. `DefaultAzureCredential()`

You must set one of these options on **both your client application and your MLflow tracking server**.
Also, you must run `pip install azure-storage-blob` separately (on both your client and the server) to access Azure Blob Storage.
Finally, if you want to use DefaultAzureCredential, you must `pip install azure-identity`;
MLflow does not declare a dependency on these packages by default.

You may set an MLflow environment variable to configure the timeout for artifact uploads and downloads:

- `MLFLOW_ARTIFACT_UPLOAD_DOWNLOAD_TIMEOUT` - (Experimental, may be changed or removed) Sets the timeout for artifact upload/download in seconds (Default: 600 for Azure blob).

### Google Cloud Storage

To store artifacts in Google Cloud Storage, specify a URI of the form `gs://<bucket>/<path>`.
You should configure credentials for accessing the GCS container on the client and server as described
in the [GCS documentation](https://google-cloud.readthedocs.io/en/latest/core/auth.html).
Finally, you must run `pip install google-cloud-storage` (on both your client and the server)
to access Google Cloud Storage; MLflow does not declare a dependency on this package by default.

You may set some MLflow environment variables to troubleshoot GCS read-timeouts (eg. due to slow transfer speeds) using the following variables:

- `MLFLOW_ARTIFACT_UPLOAD_DOWNLOAD_TIMEOUT` - (Experimental, may be changed or removed) Sets the standard timeout for transfer operations in seconds (Default: 60 for GCS). Use -1 for indefinite timeout.
- `MLFLOW_GCS_UPLOAD_CHUNK_SIZE` - Sets the standard upload chunk size for bigger files in bytes (Default: 104857600 ≙ 100MiB), must be multiple of 256 KB.
- `MLFLOW_GCS_DOWNLOAD_CHUNK_SIZE` - Sets the standard download chunk size for bigger files in bytes (Default: 104857600 ≙ 100MiB), must be multiple of 256 KB

### FTP server

To store artifacts in a FTP server, specify a URI of the form ftp://user@host/path/to/directory .
The URI may optionally include a password for logging into the server, e.g. `ftp://user:pass@host/path/to/directory`

### SFTP Server

To store artifacts in an SFTP server, specify a URI of the form `sftp://user@host/path/to/directory`.
You should configure the client to be able to log in to the SFTP server without a password over SSH (e.g. public key, identity file in ssh_config, etc.).

The format `sftp://user:pass@host/` is supported for logging in. However, for safety reasons this is not recommended.

When using this store, `pysftp` must be installed on both the server and the client. Run `pip install pysftp` to install the required package.

### NFS

To store artifacts in an NFS mount, specify a URI as a normal file system path, e.g., `/mnt/nfs`.
This path must be the same on both the server and the client -- you may need to use symlinks or remount
the client in order to enforce this property.

### HDFS

To store artifacts in HDFS, specify a `hdfs:` URI. It can contain host and port: `hdfs://<host>:<port>/<path>` or just the path: `hdfs://<path>`.

There are also two ways to authenticate to HDFS:

- Use current UNIX account authorization
- Kerberos credentials using the following environment variables:

```bash
export MLFLOW_KERBEROS_TICKET_CACHE=/tmp/krb5cc_22222222
export MLFLOW_KERBEROS_USER=user_name_to_use
```

The HDFS artifact store is accessed using the `pyarrow.fs` module, refer to the
[PyArrow Documentation](https://arrow.apache.org/docs/python/filesystems.html#filesystem-hdfs) for configuration and environment variables needed.

## Deletion Behavior

In order to allow MLflow Runs to be restored, Run metadata and artifacts are not automatically removed
from the backend store or artifact store when a Run is deleted. The <APILink fn="mlflow.server.cli" hash="mlflow-gc">mlflow gc</APILink> CLI is provided
for permanently removing Run metadata and artifacts for deleted runs.

## Multipart upload for proxied artifact access

The Tracking Server supports uploading large artifacts using multipart upload for proxied artifact access.
To enable this feature, set `MLFLOW_ENABLE_PROXY_MULTIPART_UPLOAD` to `true`.

```bash
export MLFLOW_ENABLE_PROXY_MULTIPART_UPLOAD=true
```

Under the hood, the Tracking Server will create a multipart upload request with the underlying storage,
generate presigned urls for each part, and let the client upload the parts directly to the storage.
Once all parts are uploaded, the Tracking Server will complete the multipart upload.
None of the data will pass through the Tracking Server.

If the underlying storage does not support multipart upload, the Tracking Server will fallback to a single part upload.
If multipart upload is supported but fails for any reason, an exception will be thrown.

MLflow supports multipart upload for the following storage for proxied artifact access:

- Amazon S3
- Google Cloud Storage

You can configure the following environment variables:

- `MLFLOW_MULTIPART_UPLOAD_MINIMUM_FILE_SIZE` - Specifies the minimum file size in bytes to use multipart upload
  when logging artifacts (Default: 500 MB)
- `MLFLOW_MULTIPART_UPLOAD_CHUNK_SIZE` - Specifies the chunk size in bytes to use when performing multipart upload
  (Default: 100 MB)
```

--------------------------------------------------------------------------------

---[FILE: backend-store.mdx]---
Location: mlflow-master/docs/docs/self-hosting/architecture/backend-store.mdx

```text
import { APILink } from "@site/src/components/APILink";
import { Table } from "@site/src/components/Table";

# Backend Stores

The backend store is a core component in MLflow that stores metadata for
Runs, models, traces, and experiments such as:

- Run ID
- Model ID
- Trace ID
- Tags
- Start & end time
- Parameters
- Metrics

Large model artifacts such as model weight files are stored in the [artifact store](/self-hosting/architecture/artifact-store).

## Types of Backend Stores

### Relational Database (**Default**)

MLflow supports different databases through SQLAlchemy, including `sqlite`, `postgresql`, `mysql`, and `mssql`. This option provides better performance through indexing and is easier to scale to larger volumes of data than the file system backend.

**SQLite is the default backend store**. When you start MLflow without specifying a backend, it automatically creates and uses `sqlite:///mlflow.db` in the current directory. To use a different database such as PostgreSQL, specify `--backend-store-uri` when starting MLflow (e.g., `--backend-store-uri postgresql://...`).

### Local File System (**Legacy**)

The file-based backend stores metadata in local files in the `./mlruns` directory. This was the default backend in earlier versions of MLflow, but is still supported for backward compatibility.

To use file-based storage, specify `--backend-store-uri ./mlruns` when starting the server, or set `MLFLOW_TRACKING_URI=./mlruns`.

:::warning[TO BE DEPRECATED SOON]

File system backend is in Keep-the-Light-On (KTLO) mode and is no longer receiving new feature updates. We strongly recommend using the database backend (now the default) for better performance and reliability.

:::

## Configure Backend Store

You can configure a different backend store by passing the desired **tracking URI** to MLflow, via either of the following methods:

- Set the `MLFLOW_TRACKING_URI` environment variable.
- Call <APILink fn="mlflow.set_tracking_uri" /> in your code.
- If you are running a [Tracking Server](/self-hosting/architecture/tracking-server), you can set the `--backend-store-uri` option when starting the server, like `mlflow server --backend-store-uri postgresql://...`

Continue to the next section for the supported format of tracking URLs.
Also visit [this guidance](/self-hosting/architecture/tracking-server) for how to set up the backend store properly for your workflow.

## Supported Store Types

MLflow supports the following types of tracking URI for backend stores:

- Local file path (specified as `file:/my/local/dir`), where data is just directly stored locally to a system disk where your code is executing.
- A Database, encoded as `<dialect>+<driver>://<username>:<password>@<host>:<port>/<database>`. MLflow supports the dialects `mysql`, `mssql`, `sqlite`, and `postgresql`. For more details, see [SQLAlchemy database uri](https://docs.sqlalchemy.org/en/latest/core/engines.html#database-urls).
- HTTP server (specified as `https://my-server:5000`), which is a server hosting an [MLflow tracking server](/self-hosting/architecture/tracking-server).
- Databricks workspace (specified as `databricks` or as `databricks://<profileName>`, a [Databricks CLI profile](https://github.com/databricks/databricks-cli#installation)).
  Refer to Access the MLflow tracking server from outside Databricks [[AWS]](http://docs.databricks.com/applications/mlflow/access-hosted-tracking-server.html)
  [[Azure]](http://docs.microsoft.com/azure/databricks/applications/mlflow/access-hosted-tracking-server).

:::warning database-requirements
**Database-Backed Store Requirements**

When using database-backed stores, please note:

- **Model Registry Integration**: [Model Registry](/ml/model-registry) functionality requires a database-backed store. See [this FAQ](/ml/tracking#tracking-with-model-registry) for more information.

- **Schema Migrations**: `mlflow server` will fail against a database with an out-of-date schema. Always run `mlflow db upgrade [db_uri]` to upgrade your database schema before starting the server. Schema migrations can result in database downtime and may take longer on larger databases. **Always backup your database before running migrations.**
  :::

:::note parameter-limits
In Sep 2023, we increased the max length for params recorded in a Run from 500 to 8k (but we limit param value max length to 6000 internally).
[mlflow/2d6e25af4d3e_increase_max_param_val_length](https://github.com/mlflow/mlflow/blob/master/mlflow/store/db_migrations/versions/2d6e25af4d3e_increase_max_param_val_length.py)
is a non-invertible migration script that increases the cap in existing database to 8k. Please be careful if you want to upgrade and backup your database before upgrading.
:::

## Deletion Behavior

In order to allow MLflow Runs to be restored, Run metadata and artifacts are not automatically removed
from the backend store or artifact store when a Run is deleted. The <APILink fn="mlflow.server.cli" hash="mlflow-gc">mlflow gc</APILink> CLI is provided
for permanently removing Run metadata and artifacts for deleted runs.

## SQLAlchemy Options

You can inject some [SQLAlchemy connection pooling options](https://docs.sqlalchemy.org/en/latest/core/pooling.html) using environment variables.

<Table>
  <thead>
    <tr>
      <th>MLflow Environment Variable</th>
      <th>SQLAlchemy QueuePool Option</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>`MLFLOW_SQLALCHEMYSTORE_POOL_SIZE`</td>
      <td>`pool_size`</td>
    </tr>
    <tr>
      <td>`MLFLOW_SQLALCHEMYSTORE_POOL_RECYCLE`</td>
      <td>`pool_recycle`</td>
    </tr>
    <tr>
      <td>`MLFLOW_SQLALCHEMYSTORE_MAX_OVERFLOW`</td>
      <td>`max_overflow`</td>
    </tr>
  </tbody>
</Table>

## MySQL SSL Options

When connecting to a MySQL database that requires SSL certificates, you can set the following environment variables:

```bash
# Path to SSL CA certificate file
export MLFLOW_MYSQL_SSL_CA=/path/to/ca.pem

# Path to SSL client certificate file (if needed)
export MLFLOW_MYSQL_SSL_CERT=/path/to/client-cert.pem

# Path to SSL client key file (if needed)
export MLFLOW_MYSQL_SSL_KEY=/path/to/client-key.pem
```

Then start the MLflow server with your MySQL URI:

```bash
mlflow server --backend-store-uri="mysql+pymysql://username@hostname:port/database" --default-artifact-root=s3://your-bucket --host=0.0.0.0 --port=5000
```

These environment variables will be used to configure the SSL connection to the MySQL server.

## File Store Performance

MLflow will automatically try to use [LibYAML](https://pyyaml.org/wiki/LibYAML) bindings if they are already installed.
However, if you notice any performance issues when using _file store_ backend, it could mean LibYAML is not installed on your system.
On Linux or Mac you can easily install it using your system package manager:

```bash
# On Ubuntu/Debian
apt-get install libyaml-cpp-dev libyaml-dev

# On macOS using Homebrew
brew install yaml-cpp libyaml
```

After installing LibYAML, you need to reinstall PyYAML:

```bash
# Reinstall PyYAML
pip --no-cache-dir install --force-reinstall -I pyyaml
```

:::note

We generally recommend using a database backend to get better performance.

:::
```

--------------------------------------------------------------------------------

---[FILE: overview.mdx]---
Location: mlflow-master/docs/docs/self-hosting/architecture/overview.mdx

```text
---
title: Architecture Overview
---

import { Table } from "@site/src/components/Table";

# Architecture Overview

MLflow's architecture is simple yet flexible. Whether your needs are for local solo development or production-scale deployment, you can choose the right components and backend options to fit your needs.

## Core Components

### MLflow SDK

MLflow provides client SDKs in multiple languages (Python, TypeScript, Java, R) with which users interact with the backend.

### Backend Store

A database (or file system that emulates it) that stores the metadata of experiments, runs, traces, etc. MLflow supports different databases through SQLAlchemy, including `postgresql`, `mysql`, `sqlite` and `mssql`. See [Backend Stores](/self-hosting/architecture/backend-store) for more configurations of the backend store.

### Artifact Store

Artifact store persists (typically large) artifacts for each run, such as model weights (e.g. a pickled scikit-learn model),
images (e.g. PNGs), model and data files (e.g. [Parquet](https://parquet.apache.org) file). These files are too large to be stored within the tracking backend and are often less-frequently accessed than metadata, rendering them more suited for cheap object storage such as Amazon S3. See [Artifact Stores](/self-hosting/architecture/artifact-store) for supported storage options and low-level configurations.

### Tracking Server

MLflow Tracking Server is a FastAPI server that serves REST APIs for accessing the backend and the artifact store, as well as hosting the MLflow UI. This is optional for local development since MLflow SDK can directly interact with a local database and file system. However, the server is essential for team development and provides features such as access control. Read [Tracking Server](/self-hosting/architecture/tracking-server) for how to configure the server.

## Common Setups

By configuring these components properly, you can create an MLflow Tracking environment suitable for your team's development workflow.
The following diagram and table show a few common setups for the MLflow Tracking environment.

![](/images/tracking/tracking-setup-overview.png)

<Table>
  <thead>
    <tr>
      <th></th>
      <th>1. Localhost (default)</th>
      <th>2. Local Tracking with Local Database</th>
      <th>3. Remote Tracking with MLflow Tracking Server</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Scenario</th>
      <td>Solo development</td>
      <td>Solo development</td>
      <td>Team development</td>
    </tr>
    <tr>
      <th>Use Case</th>
      <td>By default, MLflow records metadata and artifacts for each run to a local directory, `mlruns`. This is the simplest way to get started with MLflow Tracking, without setting up any external server, database, and storage.</td>
      <td>Database backend provides better performance and reliability than the default file backend. MLflow client SDK interfaces with a [SQLAlchemy-compatible database](/self-hosting/architecture/backend-store) (e.g., SQLite, PostgreSQL, MySQL) to manage metadata, and store artifacts to the local file system.</td>
      <td>[MLflow Tracking Server](/self-hosting/architecture/tracking-server) serves as a proxy for the remote access to the metadata and artifacts. This is particularly useful for team development scenarios where you want to store artifacts and experiment metadata in a shared location with proper access control.</td>
    </tr>
    <tr>
      <th>Setup</th>
      <td>
        No additional setup (default).
      </td>
      <td>
        Set the tracking URI to the database URI (e.g., `sqlite:///mlflow.db`) with the `mlflow.set_tracking_uri` or the `MLFLOW_TRACKING_URI` environment variable.
      </td>
      <td>
        Refer to the [Docker Compose](/self-hosting/#docker-compose) setup. Alternatively, you can use the [managed MLflow service](https://www.databricks.com/product/managed-mlflow) from popular cloud providers to avoid the maintenance overhead.
      </td>
    </tr>
  </tbody>
</Table>
```

--------------------------------------------------------------------------------

````
