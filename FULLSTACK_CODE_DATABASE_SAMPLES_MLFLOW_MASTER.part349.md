---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 349
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 349 of 991)

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

---[FILE: submitted_run.py]---
Location: mlflow-master/mlflow/projects/submitted_run.py

```python
import logging
import os
import signal
from abc import abstractmethod

from mlflow.entities import RunStatus
from mlflow.utils.annotations import developer_stable

_logger = logging.getLogger(__name__)


@developer_stable
class SubmittedRun:
    """
    Wrapper around an MLflow project run (e.g. a subprocess running an entry point
    command or a Databricks job run) and exposing methods for waiting on and cancelling the run.
    This class defines the interface that the MLflow project runner uses to manage the lifecycle
    of runs launched in different environments (e.g. runs launched locally or on Databricks).

    ``SubmittedRun`` is not thread-safe. That is, concurrent calls to wait() / cancel()
    from multiple threads may inadvertently kill resources (e.g. local processes) unrelated to the
    run.

    NOTE:

        Subclasses of ``SubmittedRun`` must expose a ``run_id`` member containing the
        run's MLflow run ID.
    """

    @abstractmethod
    def wait(self):
        """
        Wait for the run to finish, returning True if the run succeeded and false otherwise. Note
        that in some cases (e.g. remote execution on Databricks), we may wait until the remote job
        completes rather than until the MLflow run completes.
        """

    @abstractmethod
    def get_status(self):
        """
        Get status of the run.
        """

    @abstractmethod
    def cancel(self):
        """
        Cancel the run (interrupts the command subprocess, cancels the Databricks run, etc) and
        waits for it to terminate. The MLflow run status may not be set correctly
        upon run cancellation.
        """

    @property
    @abstractmethod
    def run_id(self):
        pass


class LocalSubmittedRun(SubmittedRun):
    """
    Instance of ``SubmittedRun`` corresponding to a subprocess launched to run an entry point
    command locally.
    """

    def __init__(self, run_id, command_proc):
        super().__init__()
        self._run_id = run_id
        self.command_proc = command_proc

    @property
    def run_id(self):
        return self._run_id

    def wait(self):
        return self.command_proc.wait() == 0

    def cancel(self):
        # Interrupt child process if it hasn't already exited
        if self.command_proc.poll() is None:
            # Kill the the process tree rooted at the child if it's the leader of its own process
            # group, otherwise just kill the child
            try:
                if self.command_proc.pid == os.getpgid(self.command_proc.pid):
                    os.killpg(self.command_proc.pid, signal.SIGTERM)
                else:
                    self.command_proc.terminate()
            except OSError:
                # The child process may have exited before we attempted to terminate it, so we
                # ignore OSErrors raised during child process termination
                _logger.info(
                    "Failed to terminate child process (PID %s) corresponding to MLflow "
                    "run with ID %s. The process may have already exited.",
                    self.command_proc.pid,
                    self._run_id,
                )
            self.command_proc.wait()

    def _get_status(self):
        exit_code = self.command_proc.poll()
        if exit_code is None:
            return RunStatus.RUNNING
        if exit_code == 0:
            return RunStatus.FINISHED
        return RunStatus.FAILED

    def get_status(self):
        return RunStatus.to_string(self._get_status())
```

--------------------------------------------------------------------------------

---[FILE: utils.py]---
Location: mlflow-master/mlflow/projects/utils.py

```python
import logging
import os
import pathlib
import re
import shutil
import tempfile
import urllib.parse
import zipfile
from io import BytesIO

from mlflow import tracking
from mlflow.entities import Param, SourceType
from mlflow.environment_variables import MLFLOW_EXPERIMENT_ID, MLFLOW_RUN_ID, MLFLOW_TRACKING_URI
from mlflow.exceptions import ExecutionException
from mlflow.projects import _project_spec
from mlflow.tracking import fluent
from mlflow.tracking.context.default_context import _get_user
from mlflow.utils.git_utils import get_git_commit, get_git_repo_url
from mlflow.utils.mlflow_tags import (
    MLFLOW_GIT_BRANCH,
    MLFLOW_GIT_COMMIT,
    MLFLOW_GIT_REPO_URL,
    MLFLOW_PARENT_RUN_ID,
    MLFLOW_PROJECT_ENTRY_POINT,
    MLFLOW_SOURCE_NAME,
    MLFLOW_SOURCE_TYPE,
    MLFLOW_USER,
)
from mlflow.utils.rest_utils import augmented_raise_for_status

_FILE_URI_REGEX = re.compile(r"^file://.+")
_ZIP_URI_REGEX = re.compile(r".+\.zip$")
MLFLOW_LOCAL_BACKEND_RUN_ID_CONFIG = "_mlflow_local_backend_run_id"
MLFLOW_DOCKER_WORKDIR_PATH = "/mlflow/projects/code/"

PROJECT_ENV_MANAGER = "ENV_MANAGER"
PROJECT_SYNCHRONOUS = "SYNCHRONOUS"
PROJECT_DOCKER_ARGS = "DOCKER_ARGS"
PROJECT_STORAGE_DIR = "STORAGE_DIR"
PROJECT_BUILD_IMAGE = "build_image"
PROJECT_DOCKER_AUTH = "docker_auth"
GIT_FETCH_DEPTH = 1


_logger = logging.getLogger(__name__)


def _parse_subdirectory(uri):
    # Parses a uri and returns the uri and subdirectory as separate values.
    # Uses '#' as a delimiter.
    unquoted_uri = _strip_quotes(uri)
    subdirectory = ""
    parsed_uri = unquoted_uri
    if "#" in unquoted_uri:
        subdirectory = unquoted_uri[unquoted_uri.find("#") + 1 :]
        parsed_uri = unquoted_uri[: unquoted_uri.find("#")]
    if subdirectory and "." in subdirectory:
        raise ExecutionException("'.' is not allowed in project subdirectory paths.")
    return parsed_uri, subdirectory


def _strip_quotes(uri):
    return uri.strip("'\"")


def _get_storage_dir(storage_dir):
    if storage_dir is not None and not os.path.exists(storage_dir):
        os.makedirs(storage_dir)
    return tempfile.mkdtemp(dir=storage_dir)


def _expand_uri(uri):
    if _is_local_uri(uri):
        return os.path.abspath(uri)
    return uri


def _is_file_uri(uri):
    """Returns True if the passed-in URI is a file:// URI."""
    return _FILE_URI_REGEX.match(uri)


def _is_git_repo(path) -> bool:
    """Returns True if passed-in path is a valid git repository"""
    import git

    try:
        repo = git.Repo(path)
        if len(repo.branches) > 0:
            return True
    except git.exc.InvalidGitRepositoryError:
        pass
    return False


def _parse_file_uri(uri: str) -> str:
    """Converts file URIs to filesystem paths"""
    if _is_file_uri(uri):
        parsed_file_uri = urllib.parse.urlparse(uri)
        return str(
            pathlib.Path(parsed_file_uri.netloc, parsed_file_uri.path, parsed_file_uri.fragment)
        )
    return uri


def _is_local_uri(uri: str) -> bool:
    """Returns True if passed-in URI should be interpreted as a folder on the local filesystem."""
    resolved_uri = pathlib.Path(_parse_file_uri(uri)).resolve()
    return resolved_uri.exists()


def _is_zip_uri(uri):
    """Returns True if the passed-in URI points to a ZIP file."""
    return _ZIP_URI_REGEX.match(uri)


def _is_valid_branch_name(work_dir, version):
    """
    Returns True if the ``version`` is the name of a branch in a Git project.
    ``work_dir`` must be the working directory in a git repo.
    """
    if version is not None:
        from git import Repo
        from git.exc import GitCommandError

        repo = Repo(work_dir, search_parent_directories=True)
        try:
            return repo.git.rev_parse("--verify", f"refs/heads/{version}") != ""
        except GitCommandError:
            return False
    return False


def fetch_and_validate_project(uri, version, entry_point, parameters):
    parameters = parameters or {}
    work_dir = _fetch_project(uri=uri, version=version)
    project = _project_spec.load_project(work_dir)
    if entry_point_obj := project.get_entry_point(entry_point):
        entry_point_obj._validate_parameters(parameters)
    return work_dir


def load_project(work_dir):
    return _project_spec.load_project(work_dir)


def _fetch_project(uri, version=None):
    """
    Fetch a project into a local directory, returning the path to the local project directory.
    """
    parsed_uri, subdirectory = _parse_subdirectory(uri)
    use_temp_dst_dir = _is_zip_uri(parsed_uri) or not _is_local_uri(parsed_uri)
    dst_dir = tempfile.mkdtemp() if use_temp_dst_dir else _parse_file_uri(parsed_uri)

    if use_temp_dst_dir:
        _logger.info("=== Fetching project from %s into %s ===", uri, dst_dir)
    if _is_zip_uri(parsed_uri):
        parsed_uri = _parse_file_uri(parsed_uri)
        _unzip_repo(
            zip_file=(parsed_uri if _is_local_uri(parsed_uri) else _fetch_zip_repo(parsed_uri)),
            dst_dir=dst_dir,
        )
    elif _is_local_uri(parsed_uri):
        if use_temp_dst_dir:
            shutil.copytree(parsed_uri, dst_dir, dirs_exist_ok=True)
        if version is not None:
            if not _is_git_repo(_parse_file_uri(parsed_uri)):
                raise ExecutionException("Setting a version is only supported for Git project URIs")
            _fetch_git_repo(parsed_uri, version, dst_dir)
    else:
        _fetch_git_repo(parsed_uri, version, dst_dir)
    res = os.path.abspath(os.path.join(dst_dir, subdirectory))
    if not os.path.exists(res):
        raise ExecutionException(f"Could not find subdirectory {subdirectory} of {dst_dir}")
    return res


def _unzip_repo(zip_file, dst_dir):
    with zipfile.ZipFile(zip_file) as zip_in:
        zip_in.extractall(dst_dir)


_HEAD_BRANCH_REGEX = re.compile(r"^\s*HEAD branch:\s+(?P<branch>\S+)")


def _get_head_branch(remote_show_output):
    for line in remote_show_output.splitlines():
        if match := _HEAD_BRANCH_REGEX.match(line):
            return match.group("branch")


def _fetch_git_repo(uri, version, dst_dir):
    """
    Clone the git repo at ``uri`` into ``dst_dir``, checking out commit ``version`` (or defaulting
    to the head commit of the repository's master branch if version is unspecified).
    Assumes authentication parameters are specified by the environment, e.g. by a Git credential
    helper.
    """
    # We defer importing git until the last moment, because the import requires that the git
    # executable is available on the PATH, so we only want to fail if we actually need it.
    import git

    repo = git.Repo.init(dst_dir)
    origin = next((remote for remote in repo.remotes), None)
    if origin is None:
        origin = repo.create_remote("origin", uri)
    if version is not None:
        try:
            origin.fetch(refspec=version, depth=GIT_FETCH_DEPTH, tags=True)
            repo.git.checkout(version)
        except git.exc.GitCommandError as e:
            raise ExecutionException(
                f"Unable to checkout version '{version}' of git repo {uri}"
                "- please ensure that the version exists in the repo. "
                f"Error: {e}"
            )
    else:
        g = git.cmd.Git(dst_dir)
        cmd = ["git", "remote", "show", "origin"]
        output = g.execute(cmd)
        head_branch = _get_head_branch(output)
        if head_branch is None:
            raise ExecutionException(
                "Failed to find HEAD branch. Output of `{cmd}`:\n{output}".format(
                    cmd=" ".join(cmd), output=output
                )
            )
        origin.fetch(head_branch, depth=GIT_FETCH_DEPTH)
        ref = origin.refs[0]
        _logger.info("Fetched '%s' branch", head_branch)
        repo.create_head(head_branch, ref)
        repo.heads[head_branch].checkout()
    repo.git.execute(command=["git", "submodule", "update", "--init", "--recursive"])


def _fetch_zip_repo(uri):
    import requests

    # TODO (dbczumar): Replace HTTP resolution via ``requests.get`` with an invocation of
    # ```mlflow.data.download_uri()`` when the API supports the same set of available stores as
    # the artifact repository (Azure, FTP, etc). See the following issue:
    # https://github.com/mlflow/mlflow/issues/763.
    response = requests.get(uri)
    try:
        augmented_raise_for_status(response)
    except requests.HTTPError as error:
        raise ExecutionException(f"Unable to retrieve ZIP file. Reason: {error!s}")
    return BytesIO(response.content)


def get_or_create_run(run_id, uri, experiment_id, work_dir, version, entry_point, parameters):
    if run_id:
        return tracking.MlflowClient().get_run(run_id)
    else:
        return _create_run(uri, experiment_id, work_dir, version, entry_point, parameters)


def _create_run(uri, experiment_id, work_dir, version, entry_point, parameters):
    """
    Create a ``Run`` against the current MLflow tracking server, logging metadata (e.g. the URI,
    entry point, and parameters of the project) about the run. Return an ``ActiveRun`` that can be
    used to report additional data about the run (metrics/params) to the tracking server.
    """
    if _is_local_uri(uri):
        source_name = tracking._tracking_service.utils._get_git_url_if_present(_expand_uri(uri))
    else:
        source_name = _expand_uri(uri)
    source_version = get_git_commit(work_dir)
    existing_run = fluent.active_run()
    parent_run_id = existing_run.info.run_id if existing_run else None

    tags = {
        MLFLOW_USER: _get_user(),
        MLFLOW_SOURCE_NAME: source_name,
        MLFLOW_SOURCE_TYPE: SourceType.to_string(SourceType.PROJECT),
        MLFLOW_PROJECT_ENTRY_POINT: entry_point,
    }
    if source_version is not None:
        tags[MLFLOW_GIT_COMMIT] = source_version
    if parent_run_id is not None:
        tags[MLFLOW_PARENT_RUN_ID] = parent_run_id

    repo_url = get_git_repo_url(work_dir)
    if repo_url is not None:
        tags[MLFLOW_GIT_REPO_URL] = repo_url

    # Add branch name tag if a branch is specified through -version
    if _is_valid_branch_name(work_dir, version):
        tags[MLFLOW_GIT_BRANCH] = version
    active_run = tracking.MlflowClient().create_run(experiment_id=experiment_id, tags=tags)

    project = _project_spec.load_project(work_dir)
    # Consolidate parameters for logging.
    # `storage_dir` is `None` since we want to log actual path not downloaded local path
    if entry_point_obj := project.get_entry_point(entry_point):
        final_params, extra_params = entry_point_obj.compute_parameters(
            parameters, storage_dir=None
        )
        params_list = [
            Param(key, value)
            for key, value in list(final_params.items()) + list(extra_params.items())
        ]
        tracking.MlflowClient().log_batch(active_run.info.run_id, params=params_list)
    return active_run


def get_entry_point_command(project, entry_point, parameters, storage_dir):
    """
    Returns the shell command to execute in order to run the specified entry point.

    Args:
        project: Project containing the target entry point.
        entry_point: Entry point to run.
        parameters: Parameters (dictionary) for the entry point command.
        storage_dir: Base local directory to use for downloading remote artifacts passed to
            arguments of type 'path'. If None, a temporary base directory is used.
    """
    storage_dir_for_run = _get_storage_dir(storage_dir)
    _logger.info(
        "=== Created directory %s for downloading remote URIs passed to arguments of"
        " type 'path' ===",
        storage_dir_for_run,
    )
    commands = []
    commands.append(
        project.get_entry_point(entry_point).compute_command(parameters, storage_dir_for_run)
    )
    return commands


def get_run_env_vars(run_id, experiment_id):
    """
    Returns a dictionary of environment variable key-value pairs to set in subprocess launched
    to run MLflow projects.
    """
    return {
        MLFLOW_RUN_ID.name: run_id,
        MLFLOW_TRACKING_URI.name: tracking.get_tracking_uri(),
        MLFLOW_EXPERIMENT_ID.name: str(experiment_id),
    }
```

--------------------------------------------------------------------------------

---[FILE: _project_spec.py]---
Location: mlflow-master/mlflow/projects/_project_spec.py

```python
"""Internal utilities for parsing MLproject YAML files."""

import os

import yaml

from mlflow.exceptions import ExecutionException, MlflowException
from mlflow.projects import env_type
from mlflow.tracking import artifact_utils
from mlflow.utils import data_utils
from mlflow.utils.environment import _PYTHON_ENV_FILE_NAME
from mlflow.utils.file_utils import get_local_path_or_none
from mlflow.utils.string_utils import is_string_type, quote

MLPROJECT_FILE_NAME = "mlproject"
DEFAULT_CONDA_FILE_NAME = "conda.yaml"


def _find_mlproject(directory):
    filenames = os.listdir(directory)
    for filename in filenames:
        if filename.lower() == MLPROJECT_FILE_NAME:
            return os.path.join(directory, filename)
    return None


def load_project(directory):
    mlproject_path = _find_mlproject(directory)

    # TODO: Validate structure of YAML loaded from the file
    yaml_obj = {}
    if mlproject_path is not None:
        with open(mlproject_path) as mlproject_file:
            yaml_obj = yaml.safe_load(mlproject_file)

    # Validate the project config does't contain multiple environment fields
    env_fields = set(yaml_obj.keys()).intersection(env_type.ALL)
    if len(env_fields) > 1:
        raise ExecutionException(
            f"Project cannot contain multiple environment fields: {env_fields}"
        )

    project_name = yaml_obj.get("name")

    # Parse entry points
    entry_points = {}
    for name, entry_point_yaml in yaml_obj.get("entry_points", {}).items():
        parameters = entry_point_yaml.get("parameters", {})
        command = entry_point_yaml.get("command")
        entry_points[name] = EntryPoint(name, parameters, command)

    databricks_spark_job_yaml = yaml_obj.get("databricks_spark_job")
    if databricks_spark_job_yaml is not None:
        python_file = databricks_spark_job_yaml.get("python_file")

        if python_file is None and not entry_points:
            raise MlflowException(
                "Databricks Spark job requires either 'databricks_spark_job.python_file' "
                "setting or 'entry_points' setting."
            )
        if python_file is not None and entry_points:
            raise MlflowException(
                "Databricks Spark job does not allow setting both "
                "'databricks_spark_job.python_file' and 'entry_points'."
            )

        for entry_point in entry_points.values():
            for param in entry_point.parameters.values():
                if param.type == "path":
                    raise MlflowException(
                        "Databricks Spark job does not support entry point parameter of 'path' "
                        f"type. '{param.name}' value type is invalid."
                    )

        if env_type.DOCKER in yaml_obj:
            raise MlflowException(
                "Databricks Spark job does not support setting docker environment."
            )

        if env_type.PYTHON in yaml_obj:
            raise MlflowException(
                "Databricks Spark job does not support setting python environment."
            )

        if env_type.CONDA in yaml_obj:
            raise MlflowException(
                "Databricks Spark job does not support setting conda environment."
            )

        databricks_spark_job_spec = DatabricksSparkJobSpec(
            python_file=databricks_spark_job_yaml.get("python_file"),
            parameters=databricks_spark_job_yaml.get("parameters", []),
            python_libraries=databricks_spark_job_yaml.get("python_libraries", []),
        )
        return Project(
            databricks_spark_job_spec=databricks_spark_job_spec,
            name=project_name,
            entry_points=entry_points,
        )

    # Validate config if docker_env parameter is present
    if docker_env := yaml_obj.get(env_type.DOCKER):
        if not docker_env.get("image"):
            raise ExecutionException(
                "Project configuration (MLproject file) was invalid: Docker "
                "environment specified but no image attribute found."
            )
        if docker_env.get("volumes"):
            if not (
                isinstance(docker_env["volumes"], list)
                and all(isinstance(i, str) for i in docker_env["volumes"])
            ):
                raise ExecutionException(
                    "Project configuration (MLproject file) was invalid: "
                    "Docker volumes must be a list of strings, "
                    """e.g.: '["/path1/:/path1", "/path2/:/path2"])"""
                )
        if docker_env.get("environment"):
            if not (
                isinstance(docker_env["environment"], list)
                and all(isinstance(i, (list, str)) for i in docker_env["environment"])
            ):
                raise ExecutionException(
                    "Project configuration (MLproject file) was invalid: "
                    "environment must be a list containing either strings (to copy environment "
                    "variables from host system) or lists of string pairs (to define new "
                    "environment variables)."
                    """E.g.: '[["NEW_VAR", "new_value"], "VAR_TO_COPY_FROM_HOST"])"""
                )
        return Project(
            env_type=env_type.DOCKER,
            env_config_path=None,
            entry_points=entry_points,
            docker_env=docker_env,
            name=project_name,
        )

    if python_env := yaml_obj.get(env_type.PYTHON):
        python_env_path = os.path.join(directory, python_env)
        if not os.path.exists(python_env_path):
            raise ExecutionException(
                f"Project specified python_env file {python_env_path}, but no such file was found."
            )
        return Project(
            env_type=env_type.PYTHON,
            env_config_path=python_env_path,
            entry_points=entry_points,
            docker_env=None,
            name=project_name,
        )

    if conda_path := yaml_obj.get(env_type.CONDA):
        conda_env_path = os.path.join(directory, conda_path)
        if not os.path.exists(conda_env_path):
            raise ExecutionException(
                f"Project specified conda environment file {conda_env_path}, but no such "
                "file was found."
            )
        return Project(
            env_type=env_type.CONDA,
            env_config_path=conda_env_path,
            entry_points=entry_points,
            docker_env=None,
            name=project_name,
        )

    default_python_env_path = os.path.join(directory, _PYTHON_ENV_FILE_NAME)
    if os.path.exists(default_python_env_path):
        return Project(
            env_type=env_type.PYTHON,
            env_config_path=default_python_env_path,
            entry_points=entry_points,
            docker_env=None,
            name=project_name,
        )

    default_conda_path = os.path.join(directory, DEFAULT_CONDA_FILE_NAME)
    if os.path.exists(default_conda_path):
        return Project(
            env_type=env_type.CONDA,
            env_config_path=default_conda_path,
            entry_points=entry_points,
            docker_env=None,
            name=project_name,
        )

    return Project(
        env_type=env_type.PYTHON,
        env_config_path=None,
        entry_points=entry_points,
        docker_env=None,
        name=project_name,
    )


class Project:
    """A project specification loaded from an MLproject file in the passed-in directory."""

    def __init__(
        self,
        name,
        env_type=None,
        env_config_path=None,
        entry_points=None,
        docker_env=None,
        databricks_spark_job_spec=None,
    ):
        self.env_type = env_type
        self.env_config_path = env_config_path
        self._entry_points = entry_points
        self.docker_env = docker_env
        self.name = name
        self.databricks_spark_job_spec = databricks_spark_job_spec

    def get_entry_point(self, entry_point):
        if self.databricks_spark_job_spec:
            if self.databricks_spark_job_spec.python_file is not None:
                # If Databricks Spark job is configured with python_file field,
                # it does not need to configure entry_point section
                # and the 'entry_point' param in 'mlflow run' command is ignored
                return None

            if self._entry_points is None or entry_point not in self._entry_points:
                raise MlflowException(
                    f"The entry point '{entry_point}' is not defined in the Databricks spark job "
                    f"MLproject file."
                )

        if entry_point in self._entry_points:
            return self._entry_points[entry_point]
        _, file_extension = os.path.splitext(entry_point)
        ext_to_cmd = {".py": "python", ".sh": os.environ.get("SHELL", "bash")}
        if file_extension in ext_to_cmd:
            command = f"{ext_to_cmd[file_extension]} {quote(entry_point)}"
            if not is_string_type(command):
                command = command.encode("utf-8")
            return EntryPoint(name=entry_point, parameters={}, command=command)
        elif file_extension == ".R":
            command = f"Rscript -e \"mlflow::mlflow_source('{quote(entry_point)}')\" --args"
            return EntryPoint(name=entry_point, parameters={}, command=command)
        raise ExecutionException(
            "Could not find {0} among entry points {1} or interpret {0} as a "
            "runnable script. Supported script file extensions: "
            "{2}".format(entry_point, list(self._entry_points.keys()), list(ext_to_cmd.keys()))
        )


class EntryPoint:
    """An entry point in an MLproject specification."""

    def __init__(self, name, parameters, command):
        self.name = name
        self.parameters = {k: Parameter(k, v) for (k, v) in parameters.items()}
        self.command = command

    def _validate_parameters(self, user_parameters):
        missing_params = [
            name
            for name in self.parameters
            if name not in user_parameters and self.parameters[name].default is None
        ]
        if missing_params:
            raise ExecutionException(
                "No value given for missing parameters: {}".format(
                    ", ".join([f"'{name}'" for name in missing_params])
                )
            )

    def compute_parameters(self, user_parameters, storage_dir):
        """
        Given a dict mapping user-specified param names to values, computes parameters to
        substitute into the command for this entry point. Returns a tuple (params, extra_params)
        where `params` contains key-value pairs for parameters specified in the entry point
        definition, and `extra_params` contains key-value pairs for additional parameters passed
        by the user.

        Note that resolving parameter values can be a heavy operation, e.g. if a remote URI is
        passed for a parameter of type `path`, we download the URI to a local path within
        `storage_dir` and substitute in the local path as the parameter value.

        If `storage_dir` is `None`, report path will be return as parameter.
        """
        if user_parameters is None:
            user_parameters = {}
        # Validate params before attempting to resolve parameter values
        self._validate_parameters(user_parameters)
        final_params = {}
        extra_params = {}

        parameter_keys = list(self.parameters.keys())
        for key in parameter_keys:
            param_obj = self.parameters[key]
            key_position = parameter_keys.index(key)
            value = user_parameters[key] if key in user_parameters else self.parameters[key].default
            final_params[key] = param_obj.compute_value(value, storage_dir, key_position)
        for key in user_parameters:
            if key not in final_params:
                extra_params[key] = user_parameters[key]
        return self._sanitize_param_dict(final_params), self._sanitize_param_dict(extra_params)

    def compute_command(self, user_parameters, storage_dir):
        params, extra_params = self.compute_parameters(user_parameters, storage_dir)
        command_with_params = self.command.format(**params)
        command_arr = [command_with_params]
        command_arr.extend([f"--{key} {value}" for key, value in extra_params.items()])
        return " ".join(command_arr)

    @staticmethod
    def _sanitize_param_dict(param_dict):
        return {str(key): quote(str(value)) for key, value in param_dict.items()}


class Parameter:
    """A parameter in an MLproject entry point."""

    def __init__(self, name, yaml_obj):
        self.name = name
        if is_string_type(yaml_obj):
            self.type = yaml_obj
            self.default = None
        else:
            self.type = yaml_obj.get("type", "string")
            self.default = yaml_obj.get("default")

    def _compute_uri_value(self, user_param_value):
        if not data_utils.is_uri(user_param_value):
            raise ExecutionException(
                f"Expected URI for parameter {self.name} but got {user_param_value}"
            )
        return user_param_value

    def _compute_path_value(self, user_param_value, storage_dir, key_position):
        if local_path := get_local_path_or_none(user_param_value):
            if not os.path.exists(local_path):
                raise ExecutionException(
                    f"Got value {user_param_value} for parameter {self.name}, but no such file or "
                    "directory was found."
                )
            return os.path.abspath(local_path)
        target_sub_dir = f"param_{key_position}"
        download_dir = os.path.join(storage_dir, target_sub_dir)
        os.mkdir(download_dir)
        return artifact_utils._download_artifact_from_uri(
            artifact_uri=user_param_value, output_path=download_dir
        )

    def compute_value(self, param_value, storage_dir, key_position):
        if storage_dir and self.type == "path":
            return self._compute_path_value(param_value, storage_dir, key_position)
        elif self.type == "uri":
            return self._compute_uri_value(param_value)
        else:
            return param_value


class DatabricksSparkJobSpec:
    def __init__(self, python_file, parameters, python_libraries):
        self.python_file = python_file
        self.parameters = parameters
        self.python_libraries = python_libraries
```

--------------------------------------------------------------------------------

````
