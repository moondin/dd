---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 415
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 415 of 991)

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

---[FILE: utils.py]---
Location: mlflow-master/mlflow/server/jobs/utils.py

```python
import errno
import importlib
import inspect
import json
import logging
import os
import shutil
import signal
import subprocess
import sys
import tempfile
import threading
import time
from dataclasses import asdict, dataclass
from datetime import datetime
from pathlib import Path
from typing import TYPE_CHECKING, Any, Callable

from mlflow.entities._job_status import JobStatus
from mlflow.environment_variables import (
    MLFLOW_SERVER_JOB_TRANSIENT_ERROR_RETRY_BASE_DELAY,
    MLFLOW_SERVER_JOB_TRANSIENT_ERROR_RETRY_MAX_DELAY,
)
from mlflow.exceptions import MlflowException
from mlflow.server.constants import HUEY_STORAGE_PATH_ENV_VAR
from mlflow.utils.environment import _PythonEnv
from mlflow.utils.import_hooks import register_post_import_hook

if TYPE_CHECKING:
    import huey

_logger = logging.getLogger(__name__)


def _exponential_backoff_retry(retry_count: int) -> None:
    from huey.exceptions import RetryTask

    # We can support more retry strategies (e.g. exponential backoff) in future
    base_delay = MLFLOW_SERVER_JOB_TRANSIENT_ERROR_RETRY_BASE_DELAY.get()
    max_delay = MLFLOW_SERVER_JOB_TRANSIENT_ERROR_RETRY_MAX_DELAY.get()
    delay = min(base_delay * (2 ** (retry_count - 1)), max_delay)
    raise RetryTask(delay=delay)


@dataclass
class JobResult:
    succeeded: bool
    result: str | None = None  # serialized JSON string
    is_transient_error: bool | None = None
    error: str | None = None

    @classmethod
    def from_error(
        cls, e: Exception, transient_error_classes: list[type[Exception]] | None = None
    ) -> "JobResult":
        from mlflow.server.jobs import TransientError

        if isinstance(e, TransientError):
            return JobResult(succeeded=False, is_transient_error=True, error=repr(e.origin_error))

        if transient_error_classes:
            if e.__class__ in transient_error_classes:
                return JobResult(succeeded=False, is_transient_error=True, error=repr(e))

        return JobResult(
            succeeded=False,
            is_transient_error=False,
            error=repr(e),
        )

    def dump(self, path: str) -> None:
        with open(path, "w") as fp:
            json.dump(asdict(self), fp)

    @classmethod
    def load(cls, path: str) -> "JobResult":
        with open(path) as fp:
            return JobResult(**json.load(fp))


def _exit_when_orphaned(poll_interval: float = 1) -> None:
    while True:
        if os.getppid() == 1:
            os._exit(1)
        time.sleep(poll_interval)


def is_process_alive(pid: int) -> bool:
    if pid <= 0:
        return False
    try:
        os.kill(pid, 0)  # doesn't actually kill
    except OSError as e:
        if e.errno == errno.ESRCH:  # No such process
            return False
        elif e.errno == errno.EPERM:  # Process exists, but no permission
            return True
        else:
            raise
    else:
        return True


def _start_huey_consumer_proc(
    huey_instance_key: str,
    max_job_parallelism: int,
):
    from mlflow.server.constants import MLFLOW_HUEY_INSTANCE_KEY
    from mlflow.utils.process import _exec_cmd

    return _exec_cmd(
        [
            sys.executable,
            shutil.which("huey_consumer.py"),
            "mlflow.server.jobs._huey_consumer.huey_instance",
            "-w",
            str(max_job_parallelism),
        ],
        capture_output=False,
        synchronous=False,
        extra_env={
            MLFLOW_HUEY_INSTANCE_KEY: huey_instance_key,
        },
    )


_JOB_ENTRY_MODULE = "mlflow.server.jobs._job_subproc_entry"


def _exec_job_in_subproc(
    function_fullname: str,
    params: dict[str, Any],
    python_env: _PythonEnv | None,
    transient_error_classes: list[type[Exception]] | None,
    timeout: float | None,
    tmpdir: str,
) -> JobResult | None:
    """
    Executes the job function in a subprocess,
    If the job execution time exceeds timeout, the subprocess is killed and return None,
    otherwise return `JobResult` instance,
    """
    from mlflow.utils.process import _exec_cmd, _join_commands
    from mlflow.utils.virtualenv import (
        _get_mlflow_virtualenv_root,
        _get_uv_env_creation_command,
        _get_virtualenv_activate_cmd,
        _get_virtualenv_extra_env_vars,
        _get_virtualenv_name,
    )

    if python_env is not None:
        # set up virtual python environment
        virtual_envs_root_path = Path(_get_mlflow_virtualenv_root())
        env_name = _get_virtualenv_name(python_env, None)
        env_dir = virtual_envs_root_path / env_name
        activate_cmd = _get_virtualenv_activate_cmd(env_dir)

        if not env_dir.exists():
            _logger.info(f"Creating a python virtual environment in {env_dir}.")
            # create python environment
            env_creation_cmd = _get_uv_env_creation_command(env_dir, python_env.python)
            _exec_cmd(env_creation_cmd, capture_output=False)

            # install dependencies
            tmp_req_file = "requirements.txt"
            (Path(tmpdir) / tmp_req_file).write_text("\n".join(python_env.dependencies))
            cmd = _join_commands(activate_cmd, f"uv pip install -r {tmp_req_file}")
            _exec_cmd(
                cmd,
                cwd=tmpdir,
                extra_env=_get_virtualenv_extra_env_vars(),
                capture_output=False,
            )
        else:
            _logger.debug(f"The python environment {env_dir} already exists.")

        job_cmd = _join_commands(activate_cmd, f"exec python -m {_JOB_ENTRY_MODULE}")
    else:
        job_cmd = [sys.executable, "-m", _JOB_ENTRY_MODULE]

    result_file = str(Path(tmpdir) / "result.json")
    transient_error_classes_file = str(Path(tmpdir) / "transient_error_classes")
    transient_error_classes = transient_error_classes or []
    with open(transient_error_classes_file, "w") as f:
        for cls in transient_error_classes:
            f.write(f"{cls.__module__}.{cls.__name__}\n")

    with subprocess.Popen(
        job_cmd,
        env={
            **os.environ,
            "_MLFLOW_SERVER_JOB_PARAMS": json.dumps(params),
            "_MLFLOW_SERVER_JOB_FUNCTION_FULLNAME": function_fullname,
            "_MLFLOW_SERVER_JOB_RESULT_DUMP_PATH": result_file,
            "_MLFLOW_SERVER_JOB_TRANSIENT_ERROR_ClASSES_PATH": transient_error_classes_file,
        },
    ) as popen:
        try:
            popen.wait(timeout=timeout)
        except subprocess.TimeoutExpired:
            popen.kill()
            return None

        if popen.returncode == 0:
            return JobResult.load(result_file)

        return JobResult.from_error(
            RuntimeError(
                f"The subprocess that executes job function {function_fullname} "
                f"exists with error code {popen.returncode}"
            )
        )


def _exec_job(
    job_id: str,
    job_name: str,
    params: dict[str, Any],
    timeout: float | None,
) -> None:
    from mlflow.server.handlers import _get_job_store

    job_store = _get_job_store()
    job_store.start_job(job_id)

    fn_fullname = get_job_fn_fullname(job_name)
    function = _load_function(fn_fullname)
    fn_metadata = function._job_fn_metadata

    with tempfile.TemporaryDirectory() as tmpdir:
        job_result = _exec_job_in_subproc(
            fn_metadata.fn_fullname,
            params,
            fn_metadata.python_env,
            fn_metadata.transient_error_classes,
            timeout,
            tmpdir,
        )

    if job_result is None:
        job_store.mark_job_timed_out(job_id)
        return

    if job_result.succeeded:
        job_store.finish_job(job_id, job_result.result)
        return

    if job_result.is_transient_error:
        # For transient errors, if the retry count is less than max allowed count,
        # trigger task retry by raising `RetryTask` exception.
        retry_count = job_store.retry_or_fail_job(job_id, job_result.error)
        if retry_count is not None:
            _exponential_backoff_retry(retry_count)
    else:
        job_store.fail_job(job_id, job_result.error)


@dataclass
class HueyInstance:
    instance: "huey.SqliteHuey"
    submit_task: Callable[..., Any]


# Each job function has an individual execution pool, each execution pool
# is managed by a Huey instance.
# The `_huey_instance_map` stores the map, the key is the job function fullname,
# and the value is the `HueyInstance` object.
_huey_instance_map: dict[str, HueyInstance] = {}
_huey_instance_map_lock = threading.RLock()


def _get_or_init_huey_instance(instance_key: str):
    from huey import SqliteHuey
    from huey.serializer import Serializer

    class CustomJSONEncoder(json.JSONEncoder):
        def default(self, obj):
            if isinstance(obj, datetime):
                return {
                    "__type__": "datetime",
                    "value": obj.isoformat(),
                }
            return super().default(obj)

    def json_loader_object_hook(d):
        if d.get("__type__") == "datetime":
            return datetime.fromisoformat(d["value"])
        return d

    class JsonSerializer(Serializer):
        def serialize(self, data):
            return json.dumps(data._asdict(), cls=CustomJSONEncoder).encode("utf-8")

        def deserialize(self, data):
            from huey.registry import Message

            return Message(**json.loads(data.decode("utf-8"), object_hook=json_loader_object_hook))

    with _huey_instance_map_lock:
        if instance_key not in _huey_instance_map:
            _logger.info(f"Creating huey instance for {instance_key}")
            huey_store_file = os.path.join(
                os.environ[HUEY_STORAGE_PATH_ENV_VAR], f"{instance_key}.mlflow-huey-store"
            )
            huey_instance = SqliteHuey(
                filename=huey_store_file,
                results=False,
                serializer=JsonSerializer(),
            )
            huey_submit_task_fn = huey_instance.task(retries=0)(_exec_job)
            _huey_instance_map[instance_key] = HueyInstance(
                instance=huey_instance,
                submit_task=huey_submit_task_fn,
            )
        return _huey_instance_map[instance_key]


def _launch_huey_consumer(job_name: str) -> None:
    _logger.info(f"Starting huey consumer for job function {job_name}")

    fn_fullname = get_job_fn_fullname(job_name)
    job_fn = _load_function(fn_fullname)

    if not hasattr(job_fn, "_job_fn_metadata"):
        raise MlflowException.invalid_parameter_value(
            f"The job function {job_name} is not decorated by 'mlflow.server.jobs.job_function'."
        )

    max_job_parallelism = job_fn._job_fn_metadata.max_workers

    def _huey_consumer_thread() -> None:
        while True:
            # start MLflow job runner process
            # Put it inside the loop to ensure the job runner process alive
            job_runner_proc = _start_huey_consumer_proc(
                job_name,
                max_job_parallelism,
            )
            job_runner_proc.wait()
            time.sleep(1)

    # start job runner.
    threading.Thread(
        target=_huey_consumer_thread,
        name=f"MLflow-huey-consumer-{job_name}-watcher",
        daemon=False,
    ).start()


def _launch_job_runner(env_map, server_proc_pid):
    return subprocess.Popen(
        [
            sys.executable,
            "-m",
            "mlflow.server.jobs._job_runner",
        ],
        env={**os.environ, **env_map, "MLFLOW_SERVER_PID": str(server_proc_pid)},
    )


def _start_watcher_to_kill_job_runner_if_mlflow_server_dies(check_interval: float = 1.0) -> None:
    mlflow_server_pid = int(os.environ.get("MLFLOW_SERVER_PID"))

    def watcher():
        while True:
            if not is_process_alive(mlflow_server_pid):
                os.kill(os.getpid(), signal.SIGTERM)
            time.sleep(check_interval)

    t = threading.Thread(target=watcher, daemon=True, name="job-runner-watcher")
    t.start()


def _load_function(fullname: str) -> Callable[..., Any]:
    match fullname.split("."):
        case [*module_parts, func_name] if module_parts:
            module_name = ".".join(module_parts)
        case _:
            raise MlflowException.invalid_parameter_value(
                f"Invalid function fullname format: {fullname}"
            )
    try:
        module = importlib.import_module(module_name)
        return getattr(module, func_name)
    except ModuleNotFoundError:
        # Module doesn't exist
        raise MlflowException.invalid_parameter_value(
            f"Module not found for function '{fullname}'",
        )
    except AttributeError:
        # Function doesn't exist in the module
        raise MlflowException.invalid_parameter_value(
            f"Function not found in module for '{fullname}'",
        )


def _enqueue_unfinished_jobs(server_launching_timestamp: int) -> None:
    from mlflow.server.handlers import _get_job_store

    job_store = _get_job_store()

    unfinished_jobs = job_store.list_jobs(
        statuses=[JobStatus.PENDING, JobStatus.RUNNING],
        # filter out jobs created after the server is launched.
        end_timestamp=server_launching_timestamp,
    )

    for job in unfinished_jobs:
        if job.status == JobStatus.RUNNING:
            job_store.reset_job(job.job_id)  # reset the job status to PENDING

        params = json.loads(job.params)
        timeout = job.timeout
        # enqueue job
        _get_or_init_huey_instance(job.job_name).submit_task(
            job.job_id, job.job_name, params, timeout
        )


def _validate_function_parameters(function: Callable[..., Any], params: dict[str, Any]) -> None:
    """Validate that the provided parameters match the function's required arguments.

    Args:
        function: The function to validate parameters against
        params: Dictionary of parameters provided for the function

    Raises:
        MlflowException: If required parameters are missing
    """
    sig = inspect.signature(function)

    # Get all required parameters (no default value)
    # Exclude VAR_POSITIONAL (*args) and VAR_KEYWORD (**kwargs) parameters
    required_params = [
        name
        for name, param in sig.parameters.items()
        if param.default is inspect.Parameter.empty
        and param.kind not in (inspect.Parameter.VAR_POSITIONAL, inspect.Parameter.VAR_KEYWORD)
    ]

    # Check for missing required parameters
    if missing_params := [param for param in required_params if param not in params]:
        raise MlflowException.invalid_parameter_value(
            f"Missing required parameters for function '{function.__name__}': {missing_params}. "
            f"Expected parameters: {list(sig.parameters.keys())}"
        )


def _check_requirements(backend_store_uri: str | None = None) -> None:
    from mlflow.server.constants import BACKEND_STORE_URI_ENV_VAR
    from mlflow.utils.uri import extract_db_type_from_uri

    if os.name == "nt":
        raise MlflowException("MLflow job backend does not support Windows system.")

    if shutil.which("uv") is None:
        raise MlflowException("MLflow job backend requires 'uv' but it is not installed.")

    backend_store_uri = backend_store_uri or os.environ.get(BACKEND_STORE_URI_ENV_VAR)
    if not backend_store_uri:
        raise MlflowException(
            "MLflow job backend requires a database backend store URI but "
            "'--backend-store-uri' is not set"
        )
    try:
        extract_db_type_from_uri(backend_store_uri)
    except MlflowException:
        raise MlflowException(
            f"MLflow job backend requires a database backend store URI but got {backend_store_uri}"
        )


# The map from job name to the job function's fullname.
_job_name_to_fn_fullname_map = {}


def get_job_fn_fullname(job_name: str):
    if job_name not in _job_name_to_fn_fullname_map:
        raise MlflowException.invalid_parameter_value(f"Invalid job name: {job_name}")
    return _job_name_to_fn_fullname_map[job_name]


def _build_job_name_to_fn_fullname_map():
    from mlflow.server.jobs import _SUPPORTED_JOB_FUNCTION_LIST

    for fn_fullname in set(_SUPPORTED_JOB_FUNCTION_LIST):
        try:
            fn_meta = _load_function(fn_fullname)._job_fn_metadata
            if exist_fullname := _job_name_to_fn_fullname_map.get(fn_meta.name):
                if exist_fullname != fn_fullname:
                    _logger.warning(
                        f"The 2 job functions {fn_fullname} and {exist_fullname} have the same "
                        f"job name {fn_meta.name}, this is not allowed, skip loading function "
                        f"{fn_fullname}."
                    )
            else:
                _job_name_to_fn_fullname_map[fn_meta.name] = fn_fullname
        except Exception as e:
            _logger.warning(f"loading job function {fn_fullname} failed: {e!r}", exc_info=True)


register_post_import_hook(lambda m: _build_job_name_to_fn_fullname_map(), __name__)
```

--------------------------------------------------------------------------------

---[FILE: _huey_consumer.py]---
Location: mlflow-master/mlflow/server/jobs/_huey_consumer.py

```python
"""
This module is used for launching Huey consumer

the command is like:

```
export _MLFLOW_HUEY_STORAGE_PATH={huey_store_dir}
export _MLFLOW_HUEY_INSTANCE_KEY={huey_instance_key}
huey_consumer.py mlflow.server.jobs.huey_consumer.huey_instance -w {max_workers}
```

It launches the Huey consumer that polls tasks from the huey storage file path
`{huey_store_dir}/{huey_instance_key}.mlflow-huey-store`
and schedules the job execution continuously.
"""

import os
import threading

from mlflow.server.constants import MLFLOW_HUEY_INSTANCE_KEY
from mlflow.server.jobs.utils import (
    _exit_when_orphaned,
    _get_or_init_huey_instance,
)

# ensure the subprocess is killed when parent process dies.
# The huey consumer's parent process is `_job_runner` process,
# if `_job_runner` process is died, it means the MLflow server exits.
threading.Thread(
    target=_exit_when_orphaned,
    name="exit_when_orphaned",
    daemon=True,
).start()

huey_instance = _get_or_init_huey_instance(os.environ[MLFLOW_HUEY_INSTANCE_KEY]).instance
```

--------------------------------------------------------------------------------

---[FILE: _job_runner.py]---
Location: mlflow-master/mlflow/server/jobs/_job_runner.py

```python
"""
This module is used for launching the job runner process.

The job runner will:
* enqueue all unfinished huey tasks when MLflow server is down last time.
* Watch the `_MLFLOW_HUEY_STORAGE_PATH` path,
  if new files (named like `XXX.mlflow-huey-store`) are created,
  it means a new Huey queue is created, then the job runner
  launches an individual Huey consumer process for each Huey queue.
  See module `mlflow/server/jobs/_huey_consumer.py` for details of Huey consumer.
"""

import logging
import os
import time

from mlflow.server import HUEY_STORAGE_PATH_ENV_VAR
from mlflow.server.jobs.utils import (
    _enqueue_unfinished_jobs,
    _job_name_to_fn_fullname_map,
    _launch_huey_consumer,
    _start_watcher_to_kill_job_runner_if_mlflow_server_dies,
)

if __name__ == "__main__":
    logger = logging.getLogger("mlflow.server.jobs._job_runner")
    server_up_time = int(time.time() * 1000)
    _start_watcher_to_kill_job_runner_if_mlflow_server_dies()

    huey_store_path = os.environ[HUEY_STORAGE_PATH_ENV_VAR]

    for job_name in _job_name_to_fn_fullname_map:
        try:
            _launch_huey_consumer(job_name)
        except Exception as e:
            logging.warning(f"Launch Huey consumer for {job_name} jobs failed, root cause: {e!r}")

    time.sleep(10)  # wait for huey consumer launching
    _enqueue_unfinished_jobs(server_up_time)
```

--------------------------------------------------------------------------------

---[FILE: _job_subproc_entry.py]---
Location: mlflow-master/mlflow/server/jobs/_job_subproc_entry.py

```python
"""
This module is used for launching subprocess to execute the job function.

If the job has timeout setting, or the job has pip requirements dependencies,
or the job has extra environment variables setting,
the job is executed as a subprocess.
"""

import importlib
import json
import os
import threading

from mlflow.server.jobs.utils import JobResult, _exit_when_orphaned, _load_function

if __name__ == "__main__":
    # ensure the subprocess is killed when parent process dies.
    threading.Thread(
        target=_exit_when_orphaned,
        name="exit_when_orphaned",
        daemon=True,
    ).start()

    params = json.loads(os.environ["_MLFLOW_SERVER_JOB_PARAMS"])
    function = _load_function(os.environ["_MLFLOW_SERVER_JOB_FUNCTION_FULLNAME"])
    result_dump_path = os.environ["_MLFLOW_SERVER_JOB_RESULT_DUMP_PATH"]
    transient_error_classes_path = os.environ["_MLFLOW_SERVER_JOB_TRANSIENT_ERROR_ClASSES_PATH"]

    with open(transient_error_classes_path) as f:
        content = f.read()

    transient_error_classes = []
    for cls_str in content.split("\n"):
        if not cls_str:
            continue
        *module_parts, cls_name = cls_str.split(".")
        module = importlib.import_module(".".join(module_parts))
        transient_error_classes.append(getattr(module, cls_name))

    try:
        value = function(**params)
        job_result = JobResult(
            succeeded=True,
            result=json.dumps(value),
        )
        job_result.dump(result_dump_path)
    except Exception as e:
        JobResult.from_error(e, transient_error_classes).dump(result_dump_path)
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/server/jobs/__init__.py

```python
import json
import logging
import os
from dataclasses import dataclass
from types import FunctionType
from typing import Any, Callable, ParamSpec, TypeVar

from mlflow.entities._job import Job as JobEntity
from mlflow.exceptions import MlflowException
from mlflow.server.handlers import _get_job_store
from mlflow.utils.environment import _PythonEnv

_logger = logging.getLogger(__name__)

P = ParamSpec("P")
R = TypeVar("R")


_SUPPORTED_JOB_FUNCTION_LIST = [
    # Putting all supported job function fullname in the list
]

if supported_job_function_list_env := os.environ.get("_MLFLOW_SUPPORTED_JOB_FUNCTION_LIST"):
    _SUPPORTED_JOB_FUNCTION_LIST += supported_job_function_list_env.split(",")


_ALLOWED_JOB_NAME_LIST = [
    # Putting all allowed job function static name in the list
]

if allowed_job_name_list_env := os.environ.get("_MLFLOW_ALLOWED_JOB_NAME_LIST"):
    _ALLOWED_JOB_NAME_LIST += allowed_job_name_list_env.split(",")


class TransientError(RuntimeError):
    """
    Raise `TransientError` in a job to trigger job retry
    """

    def __init__(self, origin_error: Exception):
        super().__init__()
        self._origin_error = origin_error

    @property
    def origin_error(self) -> Exception:
        return self._origin_error


@dataclass
class JobFunctionMetadata:
    name: str
    fn_fullname: str
    max_workers: int
    transient_error_classes: list[type[Exception]] | None = None
    python_env: _PythonEnv | None = None


def job(
    name: str,
    max_workers: int,
    transient_error_classes: list[type[Exception]] | None = None,
    python_version: str | None = None,
    pip_requirements: list[str] | None = None,
) -> Callable[[Callable[P, R]], Callable[P, R]]:
    """
    The decorator for the custom job function for setting max parallel workers that
    the job function can use.
    Each job is executed in an individual subprocess.

    Args:
        name: The static name of the job function.
        max_workers: The maximum number of workers that are allowed to run the jobs
            using this job function.
        transient_error_classes: (optional) Specify a list of classes that are regarded as
            transient error classes.
        python_version: (optional) The required python version to run the job function.
        pip_requirements: (optional) The required pip requirements to run the job function,
            relative file references such as "-r requirements.txt" are not supported.
    """
    from mlflow.utils import PYTHON_VERSION
    from mlflow.utils.requirements_utils import _parse_requirements
    from mlflow.version import VERSION

    if not python_version and not pip_requirements:
        python_env = None
    else:
        python_version = python_version or PYTHON_VERSION
        try:
            pip_requirements = [
                req.req_str for req in _parse_requirements(pip_requirements, is_constraint=False)
            ]
        except Exception as e:
            raise MlflowException.invalid_parameter_value(
                f"Invalid pip_requirements for job function: {pip_requirements}, "
                f"parsing error: {e!r}"
            )
        if mlflow_home := os.environ.get("MLFLOW_HOME"):
            # Append MLflow dev version dependency (for testing)
            pip_requirements += [mlflow_home]
        else:
            pip_requirements += [f"mlflow=={VERSION}"]

        python_env = _PythonEnv(
            python=python_version,
            dependencies=pip_requirements,
        )

    def decorator(fn: Callable[P, R]) -> Callable[P, R]:
        fn._job_fn_metadata = JobFunctionMetadata(
            name=name,
            fn_fullname=f"{fn.__module__}.{fn.__name__}",
            max_workers=max_workers,
            transient_error_classes=transient_error_classes,
            python_env=python_env,
        )
        return fn

    return decorator


def submit_job(
    function: Callable[..., Any],
    params: dict[str, Any],
    timeout: float | None = None,
) -> JobEntity:
    """
    Submit a job to the job queue. The job is executed at most once.
    If the MLflow server crashes while the job is pending or running,
    it is rescheduled on restart.

    Note:
        This is a server-side API and requires the MLflow server to configure
        the backend store URI to a database URI.

    Args:
        function: The job function, it must be a python module-level function,
            and all params and return value must be JSON-serializable.
            The function can raise `TransientError` in order to trigger
            job retry, or you can annotate a list of transient error classes
            by ``@job(..., transient_error_classes=[...])``.
            You can set `MLFLOW_SERVER_JOB_TRANSIENT_ERROR_MAX_RETRIES`
            to configure maximum allowed retries for transient errors
            and set `MLFLOW_SERVER_JOB_TRANSIENT_ERROR_RETRY_BASE_DELAY` to
            configure base retry delay in seconds.

            The function must be decorated by `mlflow.server.jobs.job_function` decorator.
        params: The params to be passed to the job function.
        timeout: (optional) The job execution timeout, default None (no timeout)

    Returns:
        The job entity. You can call `get_job` API by the job id to get
        the updated job entity.
    """
    from mlflow.environment_variables import MLFLOW_SERVER_ENABLE_JOB_EXECUTION
    from mlflow.server.jobs.utils import (
        _check_requirements,
        _get_or_init_huey_instance,
        _validate_function_parameters,
    )

    if not MLFLOW_SERVER_ENABLE_JOB_EXECUTION.get():
        raise MlflowException(
            "Mlflow server job execution feature is not enabled, please set "
            "environment variable 'MLFLOW_SERVER_ENABLE_JOB_EXECUTION' to 'true' to enable it."
        )

    _check_requirements()

    if not (isinstance(function, FunctionType) and "." not in function.__qualname__):
        raise MlflowException("The job function must be a python global function.")

    func_fullname = f"{function.__module__}.{function.__name__}"

    if not hasattr(function, "_job_fn_metadata"):
        raise MlflowException(
            f"The job function {func_fullname} is not decorated by "
            "'mlflow.server.jobs.job_function'."
        )

    fn_meta = function._job_fn_metadata

    if fn_meta.name not in _ALLOWED_JOB_NAME_LIST:
        raise MlflowException.invalid_parameter_value(
            f"The function {func_fullname} is not in the allowed job function list"
        )

    if not isinstance(params, dict):
        raise MlflowException.invalid_parameter_value(
            "When calling 'submit_job', the 'params' argument must be a dict."
        )
    # Validate that required parameters are provided
    _validate_function_parameters(function, params)

    job_store = _get_job_store()
    serialized_params = json.dumps(params)
    job = job_store.create_job(fn_meta.name, serialized_params, timeout)

    # enqueue job
    _get_or_init_huey_instance(fn_meta.name).submit_task(
        job.job_id,
        fn_meta.name,
        params,
        timeout,
    )

    return job


def get_job(job_id: str) -> JobEntity:
    """
    Get the job entity by the job id.

    Note:
        This is a server-side API, and it requires MLflow server configures
        backend store URI to database URI.

    Args:
        job_id: The job id.

    Returns:
        The job entity. If the job does not exist, error is raised.
    """
    job_store = _get_job_store()
    return job_store.get_job(job_id)
```

--------------------------------------------------------------------------------

---[FILE: .env]---
Location: mlflow-master/mlflow/server/js/.env

```bash
SKIP_PREFLIGHT_CHECK=true
DISABLE_ESLINT_PLUGIN=true
```

--------------------------------------------------------------------------------

---[FILE: .enzymemigrationignore]---
Location: mlflow-master/mlflow/server/js/.enzymemigrationignore

```text
src/common/components/PlotlyStylesProvider.enzyme.test.tsx
src/common/components/RequestStateWrapper.enzyme.test.tsx
src/common/components/error-boundaries/AppErrorBoundary.enzyme.test.tsx
src/common/utils/TestUtils.enzyme.tsx
src/endpoints/components/BrowserClientCode.enzyme.test.tsx
src/endpoints/components/ConfigTableSegmentedControlGroup.enzyme.test.tsx
src/endpoints/components/EndpointView.enzyme.test.tsx
src/endpoints/components/FetchScopedOAuthToken.enzyme.test.tsx
src/endpoints/components/LogsModelSelector.enzyme.test.tsx
src/endpoints/components/LogsPane.enzyme.test.tsx
src/endpoints/components/MetricsPane.enzyme.test.tsx
src/endpoints/components/ServedModelsTable.enzyme.test.tsx
src/endpoints/components/endpoint-table/EndpointsTable.enzyme.test.tsx
src/endpoints/components/endpoint-table/EndpointsTableUtils.enzyme.test.tsx
src/endpoints/hooks/useActiveTab.enzyme.test.tsx
src/experiment-tracking/components/ArtifactPage.enzyme.test.tsx
src/experiment-tracking/components/ArtifactView.enzyme.test.tsx
src/experiment-tracking/components/CompareRunContour.enzyme.test.tsx
src/experiment-tracking/components/CompareRunPage.enzyme.test.tsx
src/experiment-tracking/components/CompareRunScatter.enzyme.test.tsx
src/experiment-tracking/components/HtmlTableView.enzyme.test.tsx
src/experiment-tracking/components/MetricPage.enzyme.test.tsx
src/experiment-tracking/components/MetricView.enzyme.test.tsx
src/experiment-tracking/components/MetricsPlotControls.enzyme.test.tsx
src/experiment-tracking/components/MetricsPlotPanel.enzyme.test.tsx
src/experiment-tracking/components/MetricsPlotView.enzyme.test.tsx
src/experiment-tracking/components/MetricsSummaryTable.enzyme.test.tsx
src/experiment-tracking/components/ParallelCoordinatesPlotControls.enzyme.test.tsx
src/experiment-tracking/components/ParallelCoordinatesPlotPanel.enzyme.test.tsx
src/experiment-tracking/components/ParallelCoordinatesPlotView.enzyme.test.tsx
src/experiment-tracking/components/PermissionDeniedView.enzyme.test.tsx
src/experiment-tracking/components/RunLinksPopover.enzyme.test.tsx
src/experiment-tracking/components/artifact-view-components/ShowArtifactHtmlView.enzyme.test.tsx
src/experiment-tracking/components/artifact-view-components/ShowArtifactImageView.enzyme.test.tsx
src/experiment-tracking/components/artifact-view-components/ShowArtifactLoggedModelView.enzyme.test.tsx
src/experiment-tracking/components/artifact-view-components/ShowArtifactMapView.enzyme.test.tsx
src/experiment-tracking/components/artifact-view-components/ShowArtifactPage.enzyme.test.tsx
src/experiment-tracking/components/artifact-view-components/ShowArtifactPdfView.enzyme.test.tsx
src/experiment-tracking/components/artifact-view-components/ShowArtifactTableView.enzyme.test.tsx
src/experiment-tracking/components/artifact-view-components/ShowArtifactTextView.enzyme.test.tsx
src/experiment-tracking/components/evaluation-artifacts-compare/hooks/useEvaluationArtifactColumns.enzyme.test.tsx
src/experiment-tracking/components/evaluation-artifacts-compare/hooks/useEvaluationArtifactTables.enzyme.test.tsx
src/experiment-tracking/components/experiment-page/components/ExperimentViewAutoML.enzyme.test.tsx
src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewDownloadRunsOverlay.enzyme.test.tsx
src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewRunsControlsActions.enzyme.test.tsx
src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewRunsControlsFilters.enzyme.test.tsx
src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewRunsEmptyTable.enzyme.test.tsx
src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewRunsTable.enzyme.test.tsx
src/experiment-tracking/components/experiment-page/components/runs/RunsSearchAutoComplete.enzyme.test.tsx
src/experiment-tracking/components/experiment-page/hooks/useExperiments.enzyme.test.tsx
src/experiment-tracking/components/experiment-page/hooks/useFetchedRunsNotification.enzyme.test.tsx
src/experiment-tracking/components/experiment-page/utils/experimentPage.column-utils.enzyme.test.tsx
src/experiment-tracking/components/modals/ConfirmModal.enzyme.test.tsx
src/experiment-tracking/components/modals/CreateExperimentModal.enzyme.test.tsx
src/experiment-tracking/components/modals/DeleteExperimentModal.enzyme.test.tsx
src/experiment-tracking/components/modals/DeleteRunModal.enzyme.test.tsx
src/experiment-tracking/components/modals/GenericInputModal.enzyme.test.tsx
src/experiment-tracking/components/modals/RenameRunModal.enzyme.test.tsx
src/experiment-tracking/components/modals/RestoreRunModal.enzyme.test.tsx
src/experiment-tracking/components/modals/DeleteRunModal.enzyme.test.tsx
src/experiment-tracking/components/runs-charts/hooks/useRunsChartsTooltip.enzyme.test.tsx
src/model-registry/components/CompareModelVersionsPage.enzyme.test.tsx
src/model-registry/components/CompareModelVersionsView.enzyme.test.tsx
src/model-registry/components/ConfigureInferenceButton.enzyme.test.tsx
src/model-registry/components/ModelActivitiesList.enzyme.test.tsx
src/model-registry/components/ModelListPage.enzyme.test.tsx
src/model-registry/components/ModelListView.enzyme.test.tsx
src/model-registry/components/ModelPage.enzyme.test.tsx
src/model-registry/components/ModelStageTransitionDropdown.enzyme.test.tsx
src/model-registry/components/ModelVersionPage.enzyme.test.tsx
src/model-registry/components/ModelVersionView.enzyme.test.tsx
src/model-registry/components/ModelView.enzyme.test.tsx
src/model-registry/components/PendingRequestsTable.enzyme.test.tsx
src/model-registry/components/RegisterModel.enzyme.test.tsx
src/model-registry/components/RegisterModelForm.enzyme.test.tsx
src/model-registry/components/model-list/ModelListFilters.enzyme.test.tsx
src/model-registry/components/model-list/ModelListTable.enzyme.test.tsx
src/model-serving/components/CallModelView.test.ts.enzyme.test.tsx
src/model-serving/components/CurlClientCode.enzyme.test.tsx
src/model-serving/components/EditableClusterSettingsView.enzyme.test.tsx
src/model-serving/components/EnableServing.enzyme.test.tsx
src/model-serving/components/ServingPane.enzyme.test.tsx
src/model-serving/components/ServingView.test.ts.enzyme.test.tsx
src/model-serving/components/ShowExampleButton.enzyme.test.tsx
src/model-serving/components/withServing.enzyme.test.tsx
src/model-serving/reducers.test.ts.enzyme.test.tsx
```

--------------------------------------------------------------------------------

---[FILE: .eslintignore]---
Location: mlflow-master/mlflow/server/js/.eslintignore

```text
src/sdk/*.js
/I18nCompileLoader
/scripts
/craco.config.js
```

--------------------------------------------------------------------------------

````
