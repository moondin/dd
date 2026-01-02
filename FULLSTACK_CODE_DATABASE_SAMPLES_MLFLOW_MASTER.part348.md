---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 348
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 348 of 991)

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

---[FILE: databricks.py]---
Location: mlflow-master/mlflow/projects/databricks.py

```python
import hashlib
import json
import logging
import os
import posixpath
import re
import tempfile
import textwrap
import time
import uuid
from pathlib import Path
from shlex import quote

from mlflow import tracking
from mlflow.entities import RunStatus
from mlflow.environment_variables import MLFLOW_EXPERIMENT_ID, MLFLOW_RUN_ID, MLFLOW_TRACKING_URI
from mlflow.exceptions import ExecutionException, MlflowException
from mlflow.projects.submitted_run import SubmittedRun
from mlflow.projects.utils import MLFLOW_LOCAL_BACKEND_RUN_ID_CONFIG
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE
from mlflow.utils import databricks_utils, file_utils, rest_utils
from mlflow.utils.mlflow_tags import (
    MLFLOW_DATABRICKS_RUN_URL,
    MLFLOW_DATABRICKS_SHELL_JOB_ID,
    MLFLOW_DATABRICKS_SHELL_JOB_RUN_ID,
    MLFLOW_DATABRICKS_WEBAPP_URL,
)
from mlflow.utils.uri import is_databricks_uri, is_http_uri
from mlflow.version import VERSION, is_release_version

# Base directory within driver container for storing files related to MLflow
DB_CONTAINER_BASE = "/databricks/mlflow"
# Base directory within driver container for storing project archives
DB_TARFILE_BASE = posixpath.join(DB_CONTAINER_BASE, "project-tars")
# Base directory directory within driver container for storing extracted project directories
DB_PROJECTS_BASE = posixpath.join(DB_CONTAINER_BASE, "projects")
# Name to use for project directory when archiving it for upload to DBFS; the TAR will contain
# a single directory with this name
DB_TARFILE_ARCHIVE_NAME = "mlflow-project"
# Base directory within DBFS for storing code for project runs for experiments
DBFS_EXPERIMENT_DIR_BASE = "mlflow-experiments"


_logger = logging.getLogger(__name__)

_MLFLOW_GIT_URI_REGEX = re.compile(r"^git\+https://github.com/[\w-]+/mlflow")


def _is_mlflow_git_uri(s):
    return bool(_MLFLOW_GIT_URI_REGEX.match(s))


def _contains_mlflow_git_uri(libraries):
    for lib in libraries:
        package = lib.get("pypi", {}).get("package")
        if package and _is_mlflow_git_uri(package):
            return True
    return False


def before_run_validations(tracking_uri, backend_config):
    """Validations to perform before running a project on Databricks."""
    if backend_config is None:
        raise ExecutionException(
            "Backend spec must be provided when launching MLflow project runs on Databricks."
        )
    elif "existing_cluster_id" in backend_config:
        raise MlflowException(
            message=(
                "MLflow Project runs on Databricks must provide a *new cluster* specification."
                " Project execution against existing clusters is not currently supported. For more"
                " information, see https://mlflow.org/docs/latest/projects.html"
                "#run-an-mlflow-project-on-databricks"
            ),
            error_code=INVALID_PARAMETER_VALUE,
        )
    if not is_databricks_uri(tracking_uri) and not is_http_uri(tracking_uri):
        raise ExecutionException(
            "When running on Databricks, the MLflow tracking URI must be of the form "
            "'databricks' or 'databricks://profile', or a remote HTTP URI accessible to both the "
            "current client and code running on Databricks. Got local tracking URI "
            f"{tracking_uri}. Please specify a valid tracking URI via mlflow.set_tracking_uri or "
            "by setting the MLFLOW_TRACKING_URI environment variable."
        )


class DatabricksJobRunner:
    """
    Helper class for running an MLflow project as a Databricks Job.

    Args:
        databricks_profile: Optional Databricks CLI profile to use to fetch hostname &
           authentication information when making Databricks API requests.
    """

    def __init__(self, databricks_profile_uri):
        self.databricks_profile_uri = databricks_profile_uri

    def _databricks_api_request(self, endpoint, method, **kwargs):
        host_creds = databricks_utils.get_databricks_host_creds(self.databricks_profile_uri)
        return rest_utils.http_request_safe(
            host_creds=host_creds, endpoint=endpoint, method=method, **kwargs
        )

    def _jobs_runs_submit(self, req_body):
        response = self._databricks_api_request(
            endpoint="/api/2.0/jobs/runs/submit", method="POST", json=req_body
        )
        return json.loads(response.text)

    def _upload_to_dbfs(self, src_path, dbfs_fuse_uri):
        """
        Upload the file at `src_path` to the specified DBFS URI within the Databricks workspace
        corresponding to the default Databricks CLI profile.
        """
        _logger.info("=== Uploading project to DBFS path %s ===", dbfs_fuse_uri)
        http_endpoint = dbfs_fuse_uri
        with open(src_path, "rb") as f:
            try:
                self._databricks_api_request(endpoint=http_endpoint, method="POST", data=f)
            except MlflowException as e:
                if "Error 409" in e.message and "File already exists" in e.message:
                    _logger.info("=== Did not overwrite existing DBFS path %s ===", dbfs_fuse_uri)
                else:
                    raise e

    def _dbfs_path_exists(self, dbfs_path):
        """
        Return True if the passed-in path exists in DBFS for the workspace corresponding to the
        default Databricks CLI profile. The path is expected to be a relative path to the DBFS root
        directory, e.g. 'path/to/file'.
        """
        host_creds = databricks_utils.get_databricks_host_creds(self.databricks_profile_uri)
        response = rest_utils.http_request(
            host_creds=host_creds,
            endpoint="/api/2.0/dbfs/get-status",
            method="GET",
            json={"path": f"/{dbfs_path}"},
        )
        try:
            json_response_obj = json.loads(response.text)
        except Exception:
            raise MlflowException(
                f"API request to check existence of file at DBFS path {dbfs_path} failed with "
                f"status code {response.status_code}. Response body: {response.text}"
            )
        # If request fails with a RESOURCE_DOES_NOT_EXIST error, the file does not exist on DBFS
        error_code_field = "error_code"
        if error_code_field in json_response_obj:
            if json_response_obj[error_code_field] == "RESOURCE_DOES_NOT_EXIST":
                return False
            raise ExecutionException(
                f"Got unexpected error response when checking whether file {dbfs_path} "
                f"exists in DBFS: {json_response_obj}"
            )
        return True

    def _upload_project_to_dbfs(self, project_dir, experiment_id):
        """
        Tars a project directory into an archive in a temp dir and uploads it to DBFS, returning
        the HDFS-style URI of the tarball in DBFS (e.g. dbfs:/path/to/tar).

        Args:
            project_dir: Path to a directory containing an MLflow project to upload to DBFS (e.g.
                a directory containing an MLproject file).
        """
        with tempfile.TemporaryDirectory() as temp_tarfile_dir:
            temp_tar_filename = os.path.join(temp_tarfile_dir, "project.tar.gz")

            def custom_filter(x):
                return None if os.path.basename(x.name) == "mlruns" else x

            directory_size = file_utils._get_local_project_dir_size(project_dir)
            _logger.info(
                f"=== Creating tarball from {project_dir} in temp directory {temp_tarfile_dir} ==="
            )
            _logger.info(f"=== Total file size to compress: {directory_size} KB ===")
            file_utils.make_tarfile(
                temp_tar_filename, project_dir, DB_TARFILE_ARCHIVE_NAME, custom_filter=custom_filter
            )
            with open(temp_tar_filename, "rb") as tarred_project:
                tarfile_hash = hashlib.sha256(tarred_project.read()).hexdigest()
            # TODO: Get subdirectory for experiment from the tracking server
            dbfs_path = posixpath.join(
                DBFS_EXPERIMENT_DIR_BASE,
                str(experiment_id),
                "projects-code",
                f"{tarfile_hash}.tar.gz",
            )
            tar_size = file_utils._get_local_file_size(temp_tar_filename)
            dbfs_fuse_uri = posixpath.join("/dbfs", dbfs_path)
            if not self._dbfs_path_exists(dbfs_path):
                _logger.info(
                    f"=== Uploading project tarball (size: {tar_size} KB) to {dbfs_fuse_uri} ==="
                )
                self._upload_to_dbfs(temp_tar_filename, dbfs_fuse_uri)
                _logger.info("=== Finished uploading project to %s ===", dbfs_fuse_uri)
            else:
                _logger.info("=== Project already exists in DBFS ===")
        return dbfs_fuse_uri

    def _run_shell_command_job(self, project_uri, command, env_vars, cluster_spec):
        """
        Run the specified shell command on a Databricks cluster.

        Args:
            project_uri: URI of the project from which the shell command originates.
            command: Shell command to run.
            env_vars: Environment variables to set in the process running ``command``.
            cluster_spec: Dictionary containing a `Databricks cluster specification
                <https://docs.databricks.com/dev-tools/api/latest/jobs.html#clusterspec>`_
                or a `Databricks new cluster specification
                <https://docs.databricks.com/dev-tools/api/latest/jobs.html#jobsclusterspecnewcluster>`_
                to use when launching a run. If you specify libraries, this function
                will add MLflow to the library list. This function does not support
                installation of conda environment libraries on the workers.

        Returns:
            ID of the Databricks job run. Can be used to query the run's status via the
            Databricks `Runs Get <https://docs.databricks.com/api/latest/jobs.html#runs-get>`_ API.
        """
        if is_release_version():
            mlflow_lib = {"pypi": {"package": f"mlflow=={VERSION}"}}
        else:
            # When running a non-release version as the client the same version will not be
            # available within Databricks.
            _logger.warning(
                "Your client is running a non-release version of MLflow. "
                "This version is not available on the databricks runtime. "
                "MLflow will fallback the MLflow version provided by the runtime. "
                "This might lead to unforeseen issues. "
            )
            mlflow_lib = {"pypi": {"package": f"'mlflow<={VERSION}'"}}

        # Check syntax of JSON - if it contains libraries and new_cluster, pull those out
        if "new_cluster" in cluster_spec:
            # Libraries are optional, so we don't require that this be specified
            cluster_spec_libraries = cluster_spec.get("libraries", [])
            libraries = (
                # This is for development purposes only. If the cluster spec already includes
                # an MLflow Git URI, then we don't append `mlflow_lib` to avoid having
                # two different pip requirements for mlflow.
                cluster_spec_libraries
                if _contains_mlflow_git_uri(cluster_spec_libraries)
                else cluster_spec_libraries + [mlflow_lib]
            )
            cluster_spec = cluster_spec["new_cluster"]
        else:
            libraries = [mlflow_lib]

        # Make jobs API request to launch run.
        req_body_json = {
            "run_name": f"MLflow Run for {project_uri}",
            "new_cluster": cluster_spec,
            "shell_command_task": {"command": command, "env_vars": env_vars},
            "libraries": libraries,
        }
        _logger.info("=== Submitting a run to execute the MLflow project... ===")
        run_submit_res = self._jobs_runs_submit(req_body_json)
        return run_submit_res["run_id"]

    def run_databricks_spark_job(
        self,
        project_uri,
        work_dir,
        experiment_id,
        cluster_spec,
        run_id,
        project_spec,
        entry_point,
        parameters,
    ):
        from mlflow.utils.file_utils import get_or_create_tmp_dir

        dbfs_fuse_uri = self._upload_project_to_dbfs(work_dir, experiment_id)

        env_vars = {
            MLFLOW_TRACKING_URI.name: "databricks",
            MLFLOW_EXPERIMENT_ID.name: experiment_id,
            MLFLOW_RUN_ID.name: run_id,
        }
        _logger.info(
            "=== Running databricks spark job of project %s on Databricks ===", project_uri
        )

        if project_spec.databricks_spark_job_spec.python_file is not None:
            if entry_point != "main" or parameters:
                _logger.warning(
                    "You configured Databricks spark job python_file and parameters within the "
                    "MLProject file's databricks_spark_job section. '--entry-point' "
                    "and '--param-list' arguments specified in the 'mlflow run' command are "
                    "ignored."
                )
            job_code_file = project_spec.databricks_spark_job_spec.python_file
            job_parameters = project_spec.databricks_spark_job_spec.parameters
        else:
            command = project_spec.get_entry_point(entry_point).compute_command(parameters, None)
            command_splits = command.split(" ")
            if command_splits[0] != "python":
                raise MlflowException(
                    "Databricks spark job only supports 'python' command in the entry point "
                    "configuration."
                )
            job_code_file = command_splits[1]
            job_parameters = command_splits[2:]

        tmp_dir = Path(get_or_create_tmp_dir())
        origin_job_code = (Path(work_dir) / job_code_file).read_text()
        job_code_filename = f"{uuid.uuid4().hex}.py"
        new_job_code_file = tmp_dir / job_code_filename

        project_dir, extracting_tar_command = _get_project_dir_and_extracting_tar_command(
            dbfs_fuse_uri
        )

        env_vars_str = json.dumps(env_vars)
        new_job_code_file.write_text(
            f"""
import os
import subprocess
os.environ.update({env_vars_str})

extracting_tar_command = \"\"\"
{extracting_tar_command}
\"\"\"
subprocess.check_call(extracting_tar_command, shell=True)

os.chdir('{project_dir}')
{origin_job_code}
"""
        )

        dbfs_job_code_file_path = posixpath.join(
            DBFS_EXPERIMENT_DIR_BASE,
            str(experiment_id),
            "projects-code",
            job_code_filename,
        )
        job_code_file_dbfs_fuse_uri = posixpath.join("/dbfs", dbfs_job_code_file_path)
        if not self._dbfs_path_exists(dbfs_job_code_file_path):
            self._upload_to_dbfs(str(new_job_code_file), job_code_file_dbfs_fuse_uri)

        libraries_config = [
            {"pypi": {"package": python_lib}}
            for python_lib in project_spec.databricks_spark_job_spec.python_libraries
        ]
        # Make Databricks Spark jobs API request to launch run.
        req_body_json = {
            "run_name": f"MLflow Run for {project_uri}",
            "new_cluster": cluster_spec,
            "libraries": libraries_config,
            "spark_python_task": {
                "python_file": f"dbfs:/{dbfs_job_code_file_path}",
                "parameters": job_parameters,
            },
        }

        _logger.info("=== Submitting a run to execute the MLflow project... ===")
        run_submit_res = self._jobs_runs_submit(req_body_json)
        return run_submit_res["run_id"]

    def run_databricks(
        self,
        uri,
        entry_point,
        work_dir,
        parameters,
        experiment_id,
        cluster_spec,
        run_id,
        env_manager,
    ):
        tracking_uri = _get_tracking_uri_for_run()
        dbfs_fuse_uri = self._upload_project_to_dbfs(work_dir, experiment_id)

        env_vars = {
            MLFLOW_TRACKING_URI.name: tracking_uri,
            MLFLOW_EXPERIMENT_ID.name: experiment_id,
        }
        _logger.info("=== Running entry point %s of project %s on Databricks ===", entry_point, uri)
        # Launch run on Databricks
        command = _get_databricks_run_cmd(
            dbfs_fuse_uri, run_id, entry_point, parameters, env_manager
        )
        return self._run_shell_command_job(uri, command, env_vars, cluster_spec)

    def _get_status(self, databricks_run_id):
        run_state = self.get_run_result_state(databricks_run_id)
        if run_state is None:
            return RunStatus.RUNNING
        if run_state == "SUCCESS":
            return RunStatus.FINISHED
        return RunStatus.FAILED

    def get_status(self, databricks_run_id):
        return RunStatus.to_string(self._get_status(databricks_run_id))

    def get_run_result_state(self, databricks_run_id):
        """
        Get the run result state (string) of a Databricks job run.

        Args:
            databricks_run_id: Integer Databricks job run ID.

        Returns:
            `RunResultState <https://docs.databricks.com/api/latest/jobs.html#runresultstate>`_ or
            None if the run is still active.
        """
        res = self.jobs_runs_get(databricks_run_id)
        return res["state"].get("result_state", None)

    def jobs_runs_cancel(self, databricks_run_id):
        response = self._databricks_api_request(
            endpoint="/api/2.0/jobs/runs/cancel", method="POST", json={"run_id": databricks_run_id}
        )
        return json.loads(response.text)

    def jobs_runs_get(self, databricks_run_id):
        response = self._databricks_api_request(
            endpoint="/api/2.0/jobs/runs/get", method="GET", params={"run_id": databricks_run_id}
        )
        return json.loads(response.text)


def _get_tracking_uri_for_run():
    uri = tracking.get_tracking_uri()
    if uri.startswith("databricks"):
        return "databricks"
    return uri


def _get_cluster_mlflow_run_cmd(project_dir, run_id, entry_point, parameters, env_manager):
    cmd = [
        "mlflow",
        "run",
        project_dir,
        "--entry-point",
        entry_point,
    ]
    if env_manager:
        cmd += ["--env-manager", env_manager]
    mlflow_run_arr = list(map(quote, cmd))
    if run_id:
        mlflow_run_arr.extend(["-c", json.dumps({MLFLOW_LOCAL_BACKEND_RUN_ID_CONFIG: run_id})])
    if parameters:
        for key, value in parameters.items():
            mlflow_run_arr.extend(["-P", f"{key}={value}"])
    return mlflow_run_arr


def _get_project_dir_and_extracting_tar_command(dbfs_fuse_tar_uri):
    # Strip ".gz" and ".tar" file extensions from base filename of the tarfile
    tar_hash = posixpath.splitext(posixpath.splitext(posixpath.basename(dbfs_fuse_tar_uri))[0])[0]
    container_tar_path = posixpath.abspath(
        posixpath.join(DB_TARFILE_BASE, posixpath.basename(dbfs_fuse_tar_uri))
    )
    project_dir = posixpath.join(DB_PROJECTS_BASE, tar_hash)
    command = textwrap.dedent(
        f"""
    # Make local directories in the container into which to copy/extract the tarred project
    mkdir -p {DB_TARFILE_BASE} {DB_PROJECTS_BASE} &&
    # Rsync from DBFS FUSE to avoid copying archive into local filesystem if it already exists
    rsync -a -v --ignore-existing {dbfs_fuse_tar_uri} {DB_TARFILE_BASE} &&
    # Extract project into a temporary directory. We don't extract directly into the desired
    # directory as tar extraction isn't guaranteed to be atomic
    cd $(mktemp -d) &&
    tar --no-same-owner -xzvf {container_tar_path} &&
    # Atomically move the extracted project into the desired directory
    mv -T {DB_TARFILE_ARCHIVE_NAME} {project_dir}"""
    )
    return project_dir, command


def _get_databricks_run_cmd(dbfs_fuse_tar_uri, run_id, entry_point, parameters, env_manager):
    """
    Generate MLflow CLI command to run on Databricks cluster in order to launch a run on Databricks.
    """
    project_dir, extracting_tar_command = _get_project_dir_and_extracting_tar_command(
        dbfs_fuse_tar_uri
    )
    mlflow_run_arr = _get_cluster_mlflow_run_cmd(
        project_dir,
        run_id,
        entry_point,
        parameters,
        env_manager,
    )
    mlflow_run_cmd = " ".join([quote(elem) for elem in mlflow_run_arr])
    shell_command = textwrap.dedent(
        f"""
    export PATH=$PATH:$DB_HOME/python/bin &&
    mlflow --version &&
    {extracting_tar_command} &&
    {mlflow_run_cmd}
    """
    )
    return ["bash", "-c", shell_command]


def run_databricks(
    remote_run, uri, entry_point, work_dir, parameters, experiment_id, cluster_spec, env_manager
):
    """
    Run the project at the specified URI on Databricks, returning a ``SubmittedRun`` that can be
    used to query the run's status or wait for the resulting Databricks Job run to terminate.
    """
    run_id = remote_run.info.run_id
    db_job_runner = DatabricksJobRunner(databricks_profile_uri=tracking.get_tracking_uri())
    db_run_id = db_job_runner.run_databricks(
        uri, entry_point, work_dir, parameters, experiment_id, cluster_spec, run_id, env_manager
    )
    submitted_run = DatabricksSubmittedRun(db_run_id, run_id, db_job_runner)
    submitted_run._print_description_and_log_tags()
    return submitted_run


def run_databricks_spark_job(
    remote_run,
    uri,
    work_dir,
    experiment_id,
    cluster_spec,
    project_spec,
    entry_point,
    parameters,
):
    run_id = remote_run.info.run_id
    db_job_runner = DatabricksJobRunner(databricks_profile_uri=tracking.get_tracking_uri())
    db_run_id = db_job_runner.run_databricks_spark_job(
        uri,
        work_dir,
        experiment_id,
        cluster_spec,
        run_id,
        project_spec,
        entry_point,
        parameters,
    )
    submitted_run = DatabricksSubmittedRun(db_run_id, run_id, db_job_runner)
    submitted_run._print_description_and_log_tags()
    return submitted_run


class DatabricksSubmittedRun(SubmittedRun):
    """
    Instance of SubmittedRun corresponding to a Databricks Job run launched to run an MLflow
    project. Note that run_id may be None, e.g. if we did not launch the run against a tracking
    server accessible to the local client.

    Args:
        databricks_run_id: Run ID of the launched Databricks Job.
        mlflow_run_id: ID of the MLflow project run.
        databricks_job_runner: Instance of ``DatabricksJobRunner`` used to make Databricks API
            requests.
    """

    # How often to poll run status when waiting on a run
    POLL_STATUS_INTERVAL = 30

    def __init__(self, databricks_run_id, mlflow_run_id, databricks_job_runner):
        super().__init__()
        self._databricks_run_id = databricks_run_id
        self._mlflow_run_id = mlflow_run_id
        self._job_runner = databricks_job_runner

    def _print_description_and_log_tags(self):
        _logger.info(
            "=== Launched MLflow run as Databricks job run with ID %s."
            " Getting run status page URL... ===",
            self._databricks_run_id,
        )
        run_info = self._job_runner.jobs_runs_get(self._databricks_run_id)
        jobs_page_url = run_info["run_page_url"]
        _logger.info("=== Check the run's status at %s ===", jobs_page_url)
        host_creds = databricks_utils.get_databricks_host_creds(
            self._job_runner.databricks_profile_uri
        )
        tracking.MlflowClient().set_tag(
            self._mlflow_run_id, MLFLOW_DATABRICKS_RUN_URL, jobs_page_url
        )
        tracking.MlflowClient().set_tag(
            self._mlflow_run_id, MLFLOW_DATABRICKS_SHELL_JOB_RUN_ID, self._databricks_run_id
        )
        tracking.MlflowClient().set_tag(
            self._mlflow_run_id, MLFLOW_DATABRICKS_WEBAPP_URL, host_creds.host
        )
        job_id = run_info.get("job_id")
        # In some releases of Databricks we do not return the job ID. We start including it in DB
        # releases 2.80 and above.
        if job_id is not None:
            tracking.MlflowClient().set_tag(
                self._mlflow_run_id, MLFLOW_DATABRICKS_SHELL_JOB_ID, job_id
            )

    @property
    def run_id(self):
        return self._mlflow_run_id

    def wait(self):
        result_state = self._job_runner.get_run_result_state(self._databricks_run_id)
        while result_state is None:
            time.sleep(self.POLL_STATUS_INTERVAL)
            result_state = self._job_runner.get_run_result_state(self._databricks_run_id)
        return result_state == "SUCCESS"

    def cancel(self):
        self._job_runner.jobs_runs_cancel(self._databricks_run_id)
        self.wait()

    def get_status(self):
        return self._job_runner.get_status(self._databricks_run_id)
```

--------------------------------------------------------------------------------

---[FILE: docker.py]---
Location: mlflow-master/mlflow/projects/docker.py

```python
import logging
import os
import posixpath
import shutil
import subprocess
import tempfile
import urllib.parse
import urllib.request

import docker

from mlflow import tracking
from mlflow.environment_variables import MLFLOW_TRACKING_URI
from mlflow.exceptions import ExecutionException
from mlflow.projects.utils import MLFLOW_DOCKER_WORKDIR_PATH
from mlflow.utils import file_utils, process
from mlflow.utils.databricks_utils import get_databricks_env_vars
from mlflow.utils.file_utils import _handle_readonly_on_windows
from mlflow.utils.git_utils import get_git_commit
from mlflow.utils.mlflow_tags import MLFLOW_DOCKER_IMAGE_ID, MLFLOW_DOCKER_IMAGE_URI

_logger = logging.getLogger(__name__)

_GENERATED_DOCKERFILE_NAME = "Dockerfile.mlflow-autogenerated"
_MLFLOW_DOCKER_TRACKING_DIR_PATH = "/mlflow/tmp/mlruns"
_PROJECT_TAR_ARCHIVE_NAME = "mlflow-project-docker-build-context"


def validate_docker_installation():
    """
    Verify if Docker is installed and running on host machine.
    """
    if shutil.which("docker") is None:
        raise ExecutionException(
            "Could not find Docker executable. "
            "Ensure Docker is installed as per the instructions "
            "at https://docs.docker.com/install/overview/."
        )

    cmd = ["docker", "info"]
    prc = process._exec_cmd(
        cmd,
        throw_on_error=False,
        capture_output=False,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
    )
    if prc.returncode != 0:
        joined_cmd = " ".join(cmd)
        raise ExecutionException(
            f"Ran `{joined_cmd}` to ensure docker daemon is running but it failed "
            f"with the following output:\n{prc.stdout}"
        )


def validate_docker_env(project):
    if not project.name:
        raise ExecutionException(
            "Project name in MLProject must be specified when using docker for image tagging."
        )
    if not project.docker_env.get("image"):
        raise ExecutionException(
            "Project with docker environment must specify the docker image "
            "to use via an 'image' field under the 'docker_env' field."
        )


def build_docker_image(work_dir, repository_uri, base_image, run_id, build_image, docker_auth):
    """
    Build a docker image containing the project in `work_dir`, using the base image.
    """
    image_uri = _get_docker_image_uri(repository_uri=repository_uri, work_dir=work_dir)
    client = docker.from_env()
    if docker_auth is not None:
        client.login(**docker_auth)

    if not build_image:
        if not client.images.list(name=base_image):
            _logger.info(f"Pulling {base_image}")
            image = client.images.pull(base_image)
        else:
            _logger.info(f"{base_image} already exists")
            image = client.images.get(base_image)
        image_uri = base_image
    else:
        dockerfile = (
            f"FROM {base_image}\n COPY {_PROJECT_TAR_ARCHIVE_NAME}/ {MLFLOW_DOCKER_WORKDIR_PATH}\n"
            f" WORKDIR {MLFLOW_DOCKER_WORKDIR_PATH}\n"
        )
        build_ctx_path = _create_docker_build_ctx(work_dir, dockerfile)
        with open(build_ctx_path, "rb") as docker_build_ctx:
            _logger.info("=== Building docker image %s ===", image_uri)
            image, _ = client.images.build(
                tag=image_uri,
                forcerm=True,
                dockerfile=posixpath.join(_PROJECT_TAR_ARCHIVE_NAME, _GENERATED_DOCKERFILE_NAME),
                fileobj=docker_build_ctx,
                custom_context=True,
                encoding="gzip",
            )
        try:
            os.remove(build_ctx_path)
        except Exception:
            _logger.info("Temporary docker context file %s was not deleted.", build_ctx_path)
    tracking.MlflowClient().set_tag(run_id, MLFLOW_DOCKER_IMAGE_URI, image_uri)
    tracking.MlflowClient().set_tag(run_id, MLFLOW_DOCKER_IMAGE_ID, image.id)
    return image


def _get_docker_image_uri(repository_uri, work_dir):
    """
    Args:
        repository_uri: The URI of the Docker repository with which to tag the image. The
            repository URI is used as the prefix of the image URI.
        work_dir: Path to the working directory in which to search for a git commit hash
    """
    repository_uri = repository_uri or "docker-project"
    # Optionally include first 7 digits of git SHA in tag name, if available.
    git_commit = get_git_commit(work_dir)
    version_string = ":" + git_commit[:7] if git_commit else ""
    return repository_uri + version_string


def _create_docker_build_ctx(work_dir, dockerfile_contents):
    """
    Creates build context tarfile containing Dockerfile and project code, returning path to tarfile
    """
    directory = tempfile.mkdtemp()
    try:
        dst_path = os.path.join(directory, "mlflow-project-contents")
        shutil.copytree(src=work_dir, dst=dst_path)
        with open(os.path.join(dst_path, _GENERATED_DOCKERFILE_NAME), "w") as handle:
            handle.write(dockerfile_contents)
        _, result_path = tempfile.mkstemp()
        file_utils.make_tarfile(
            output_filename=result_path, source_dir=dst_path, archive_name=_PROJECT_TAR_ARCHIVE_NAME
        )
    finally:
        shutil.rmtree(directory, onerror=_handle_readonly_on_windows)
    return result_path


def get_docker_tracking_cmd_and_envs(tracking_uri):
    cmds = []
    env_vars = {}

    local_path, container_tracking_uri = _get_local_uri_or_none(tracking_uri)
    if local_path is not None:
        cmds = ["-v", f"{local_path}:{_MLFLOW_DOCKER_TRACKING_DIR_PATH}"]
        env_vars[MLFLOW_TRACKING_URI.name] = container_tracking_uri
    env_vars.update(get_databricks_env_vars(tracking_uri))
    return cmds, env_vars


def _get_local_uri_or_none(uri):
    if uri == "databricks":
        return None, None
    parsed_uri = urllib.parse.urlparse(uri)
    if not parsed_uri.netloc and parsed_uri.scheme in ("", "file", "sqlite"):
        path = urllib.request.url2pathname(parsed_uri.path)
        if parsed_uri.scheme == "sqlite":
            uri = file_utils.path_to_local_sqlite_uri(_MLFLOW_DOCKER_TRACKING_DIR_PATH)
        else:
            uri = file_utils.path_to_local_file_uri(_MLFLOW_DOCKER_TRACKING_DIR_PATH)
        return path, uri
    else:
        return None, None
```

--------------------------------------------------------------------------------

---[FILE: env_type.py]---
Location: mlflow-master/mlflow/projects/env_type.py

```python
DOCKER = "docker_env"
PYTHON = "python_env"
CONDA = "conda_env"
ALL = [DOCKER, PYTHON, CONDA]
```

--------------------------------------------------------------------------------

---[FILE: kubernetes.py]---
Location: mlflow-master/mlflow/projects/kubernetes.py

```python
import logging
import os
import time
from datetime import datetime
from shlex import quote, split
from threading import RLock

import docker
import kubernetes
from kubernetes.config.config_exception import ConfigException

from mlflow.entities import RunStatus
from mlflow.exceptions import ExecutionException
from mlflow.projects.submitted_run import SubmittedRun

_logger = logging.getLogger(__name__)

_DOCKER_API_TIMEOUT = 300


def push_image_to_registry(image_tag):
    client = docker.from_env(timeout=_DOCKER_API_TIMEOUT)
    _logger.info("=== Pushing docker image %s ===", image_tag)
    for line in client.images.push(repository=image_tag, stream=True, decode=True):
        if "error" in line and line["error"]:
            raise ExecutionException(
                "Error while pushing to docker registry: {error}".format(error=line["error"])
            )
    return client.images.get_registry_data(image_tag).id


def _get_kubernetes_job_definition(
    project_name, image_tag, image_digest, command, env_vars, job_template
):
    container_image = image_tag + "@" + image_digest
    timestamp = datetime.now().strftime("%Y-%m-%d-%H-%M-%S-%f")
    job_name = f"{project_name}-{timestamp}"
    _logger.info("=== Creating Job %s ===", job_name)
    if os.environ.get("KUBE_MLFLOW_TRACKING_URI") is not None:
        env_vars["MLFLOW_TRACKING_URI"] = os.environ["KUBE_MLFLOW_TRACKING_URI"]
    environment_variables = [{"name": k, "value": v} for k, v in env_vars.items()]
    job_template["metadata"]["name"] = job_name
    job_template["spec"]["template"]["spec"]["containers"][0]["name"] = project_name
    job_template["spec"]["template"]["spec"]["containers"][0]["image"] = container_image
    job_template["spec"]["template"]["spec"]["containers"][0]["command"] = command
    if "env" not in job_template["spec"]["template"]["spec"]["containers"][0].keys():
        job_template["spec"]["template"]["spec"]["containers"][0]["env"] = []
    job_template["spec"]["template"]["spec"]["containers"][0]["env"] += environment_variables
    return job_template


def _get_run_command(entrypoint_command):
    formatted_command = []
    for cmd in entrypoint_command:
        formatted_command.extend([quote(s) for s in split(cmd)])
    return formatted_command


def _load_kube_context(context=None):
    try:
        # trying to load either the context passed as arg or, if None,
        # the one provided as env var `KUBECONFIG` or in `~/.kube/config`
        kubernetes.config.load_kube_config(context=context)
    except (OSError, ConfigException) as e:
        _logger.debug('Error loading kube context "%s": %s', context, e)
        _logger.info("No valid kube config found, using in-cluster configuration")
        kubernetes.config.load_incluster_config()


def run_kubernetes_job(
    project_name,
    active_run,
    image_tag,
    image_digest,
    command,
    env_vars,
    kube_context=None,
    job_template=None,
):
    job_template = _get_kubernetes_job_definition(
        project_name, image_tag, image_digest, _get_run_command(command), env_vars, job_template
    )
    job_name = job_template["metadata"]["name"]
    job_namespace = job_template["metadata"]["namespace"]
    _load_kube_context(context=kube_context)
    api_instance = kubernetes.client.BatchV1Api()
    api_instance.create_namespaced_job(namespace=job_namespace, body=job_template, pretty=True)
    return KubernetesSubmittedRun(active_run.info.run_id, job_name, job_namespace)


class KubernetesSubmittedRun(SubmittedRun):
    """
    Instance of SubmittedRun corresponding to a Kubernetes Job run launched to run an MLflow
    project.

    Args:
        mlflow_run_id: ID of the MLflow project run.
        job_name: Kubernetes job name.
        job_namespace: Kubernetes job namespace.
    """

    # How often to poll run status when waiting on a run
    POLL_STATUS_INTERVAL = 5

    def __init__(self, mlflow_run_id, job_name, job_namespace):
        super().__init__()
        self._mlflow_run_id = mlflow_run_id
        self._job_name = job_name
        self._job_namespace = job_namespace
        self._status = RunStatus.SCHEDULED
        self._status_lock = RLock()
        self._kube_api = kubernetes.client.BatchV1Api()

    @property
    def run_id(self):
        return self._mlflow_run_id

    def wait(self):
        while not RunStatus.is_terminated(self._update_status()):
            time.sleep(self.POLL_STATUS_INTERVAL)

        return self._status == RunStatus.FINISHED

    def _update_status(self):
        api_response = self._kube_api.read_namespaced_job_status(
            name=self._job_name, namespace=self._job_namespace, pretty=True
        )
        status = api_response.status
        with self._status_lock:
            if RunStatus.is_terminated(self._status):
                return self._status
            if self._status == RunStatus.SCHEDULED:
                if api_response.status.start_time is None:
                    _logger.info("Waiting for Job to start")
                else:
                    _logger.info("Job started.")
                    self._status = RunStatus.RUNNING
            if status.conditions is not None:
                for condition in status.conditions:
                    if condition.status == "True":
                        _logger.info(condition.message)
                        if condition.type == "Failed":
                            self._status = RunStatus.FAILED
                        elif condition.type == "Complete":
                            self._status = RunStatus.FINISHED
        return self._status

    def get_status(self):
        status = self._status
        return status if RunStatus.is_terminated(status) else self._update_status()

    def cancel(self):
        with self._status_lock:
            if not RunStatus.is_terminated(self._status):
                _logger.info("Cancelling job.")
                self._kube_api.delete_namespaced_job(
                    name=self._job_name,
                    namespace=self._job_namespace,
                    body=kubernetes.client.V1DeleteOptions(),
                    pretty=True,
                )
                self._status = RunStatus.KILLED
                _logger.info("Job cancelled.")
            else:
                _logger.info("Attempting to cancel a job that is already terminated.")
```

--------------------------------------------------------------------------------

````
