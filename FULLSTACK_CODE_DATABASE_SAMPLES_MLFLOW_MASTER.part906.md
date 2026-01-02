---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 906
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 906 of 991)

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

---[FILE: test_endpoint.py]---
Location: mlflow-master/tests/server/jobs/test_endpoint.py

```python
import os
import signal
import subprocess
import sys
import time
from typing import Any

import pytest
import requests

import mlflow
from mlflow.server.jobs import job

pytestmark = pytest.mark.skipif(
    os.name == "nt", reason="MLflow job execution is not supported on Windows"
)


@job(name="simple_job_fun", max_workers=1)
def simple_job_fun(x: int, y: int, sleep_secs: int = 0) -> dict[str, Any]:
    if sleep_secs:
        time.sleep(sleep_secs)
    return {
        "a": x + y,
        "b": x * y,
    }


@job(name="job_assert_tracking_uri", max_workers=1)
def job_assert_tracking_uri(server_url: str) -> None:
    assert mlflow.get_tracking_uri() == server_url


class Client:
    def __init__(self, server_url: str):
        self.server_url = server_url

    def submit_job(
        self, job_name: str, params: dict[str, Any], timeout: float | None = None
    ) -> dict[str, Any]:
        payload = {
            "job_name": job_name,
            "params": params,
            "timeout": timeout,
        }
        response = requests.post(f"{self.server_url}/ajax-api/3.0/jobs/", json=payload)
        response.raise_for_status()
        return response.json()

    def post(self, path: str, payload: dict[str, Any]) -> requests.Response:
        return requests.post(f"{self.server_url}{path}", json=payload)

    def get_job(self, job_id: str) -> dict[str, Any]:
        response = requests.get(f"{self.server_url}/ajax-api/3.0/jobs/{job_id}")
        response.raise_for_status()
        return response.json()

    def wait_job(self, job_id: str, timeout: float = 10) -> dict[str, Any]:
        beg_time = time.time()
        while time.time() - beg_time <= timeout:
            job_json = self.get_job(job_id)
            if job_json["status"] in ["SUCCEEDED", "FAILED", "TIMEOUT"]:
                return job_json
            time.sleep(0.5)
        raise TimeoutError("The job is not finalized within the timeout.")

    def search_job(
        self,
        job_name: str | None = None,
        params: dict[str, Any] | None = None,
        statuses: list[str] | None = None,
    ) -> list[dict[str, Any]]:
        response = self.post(
            "/ajax-api/3.0/jobs/search",
            payload={
                "job_name": job_name,
                "params": params,
                "statuses": statuses,
            },
        )
        response.raise_for_status()
        return response.json()["jobs"]


@pytest.fixture(scope="module")
def client(tmp_path_factory: pytest.TempPathFactory) -> Client:
    from tests.helper_functions import get_safe_port

    tmp_path = tmp_path_factory.mktemp("server_mod")
    backend_store_uri = f"sqlite:///{tmp_path / 'mlflow.db'}"

    port = get_safe_port()
    with subprocess.Popen(
        [
            sys.executable,
            "-m",
            "mlflow",
            "server",
            "-h",
            "127.0.0.1",
            "-p",
            str(port),
            "--backend-store-uri",
            backend_store_uri,
        ],
        env={
            **os.environ,
            "PYTHONPATH": os.path.dirname(__file__),
            "MLFLOW_SERVER_ENABLE_JOB_EXECUTION": "true",
            "_MLFLOW_SUPPORTED_JOB_FUNCTION_LIST": (
                "test_endpoint.simple_job_fun,test_endpoint.job_assert_tracking_uri"
            ),
            "_MLFLOW_ALLOWED_JOB_NAME_LIST": ("simple_job_fun,job_assert_tracking_uri"),
        },
        start_new_session=True,  # new session & process group
    ) as server_proc:
        try:
            time.sleep(10)  # wait the job runner up
            # wait server up.
            deadline = time.time() + 15
            while time.time() < deadline:
                time.sleep(1)
                try:
                    resp = requests.get(f"http://127.0.0.1:{port}/health")
                except requests.ConnectionError:
                    continue
                if resp.status_code == 200:
                    break
            else:
                raise TimeoutError("Server did not report healthy within 15 seconds")
            yield Client(f"http://127.0.0.1:{port}")
        finally:
            # NOTE that we need to kill subprocesses
            # (uvicorn server / huey task runner)
            # so `killpg` is needed.
            os.killpg(server_proc.pid, signal.SIGKILL)


def test_job_endpoint(client: Client):
    job_id = client.submit_job(
        job_name="simple_job_fun",
        params={"x": 3, "y": 4},
    )["job_id"]
    job_json = client.wait_job(job_id)
    job_json.pop("creation_time")
    job_json.pop("last_update_time")
    assert job_json == {
        "job_id": job_id,
        "job_name": "simple_job_fun",
        "params": {"x": 3, "y": 4},
        "timeout": None,
        "status": "SUCCEEDED",
        "result": {"a": 7, "b": 12},
        "retry_count": 0,
    }


def test_job_endpoint_invalid_job_name(client: Client):
    payload = {
        "job_name": "invalid_job_name",
        "params": {"x": 3, "y": 4},
    }
    response = client.post("/ajax-api/3.0/jobs/", payload=payload)
    assert response.status_code == 400
    error_json = response.json()
    assert "Invalid job name: invalid_job_name" in error_json["detail"]


def test_job_endpoint_missing_parameters(client: Client):
    payload = {
        "job_name": "simple_job_fun",
        "params": {"x": 3},  # Missing required parameter 'y'
    }
    response = client.post("/ajax-api/3.0/jobs/", payload=payload)

    # Should return a 400 error with information about missing parameters
    assert response.status_code == 400
    assert response.json()["detail"] == (
        "Missing required parameters for function 'simple_job_fun': ['y']. "
        + "Expected parameters: ['x', 'y', 'sleep_secs']"
    )


def test_job_tracking_uri(client: Client):
    job_id = client.submit_job(
        job_name="job_assert_tracking_uri",
        params={"server_url": client.server_url},
    )["job_id"]
    job_json = client.wait_job(job_id)
    assert job_json["status"] == "SUCCEEDED"


def test_job_endpoint_search(client: Client):
    job1_id = client.submit_job(
        job_name="simple_job_fun",
        params={"x": 7, "y": 4},
    )["job_id"]

    job2_id = client.submit_job(
        job_name="simple_job_fun",
        params={"x": 7, "y": 5},
    )["job_id"]

    job3_id = client.submit_job(
        job_name="simple_job_fun",
        params={"x": 4, "y": 5},
    )["job_id"]

    job4_id = client.submit_job(
        job_name="simple_job_fun",
        params={"x": 4, "y": 5, "sleep_secs": 5},
        timeout=2,
    )["job_id"]

    client.wait_job(job1_id)
    client.wait_job(job2_id)
    client.wait_job(job3_id)
    client.wait_job(job4_id)

    def extract_job_ids(jobs: list[dict[str, Any]]) -> list[str]:
        return [job_json["job_id"] for job_json in jobs]

    jobs = client.search_job(
        job_name="simple_job_fun",
        params={"x": 7},
    )
    assert extract_job_ids(jobs) == [job1_id, job2_id]

    jobs = client.search_job(
        job_name="bad_fun_name",
        params={"x": 7},
    )
    assert extract_job_ids(jobs) == []

    jobs = client.search_job(
        job_name="simple_job_fun",
        params={"x": 7, "y": 5},
    )
    assert extract_job_ids(jobs) == [job2_id]

    jobs = client.search_job(
        job_name="simple_job_fun",
        params={"y": 5},
    )
    assert extract_job_ids(jobs) == [job2_id, job3_id, job4_id]

    jobs = client.search_job(
        job_name="simple_job_fun",
        params={"y": 6},
    )
    assert extract_job_ids(jobs) == []

    jobs = client.search_job(
        job_name="simple_job_fun",
        params={"y": 5},
        statuses=["SUCCEEDED"],
    )
    assert extract_job_ids(jobs) == [job2_id, job3_id]

    jobs = client.search_job(
        job_name="simple_job_fun",
        params={"y": 5},
        statuses=["TIMEOUT"],
    )
    assert extract_job_ids(jobs) == [job4_id]

    jobs = client.search_job(
        job_name="simple_job_fun",
        params={"y": 5},
        statuses=["SUCCEEDED", "TIMEOUT"],
    )
    assert extract_job_ids(jobs) == [job2_id, job3_id, job4_id]

    response = client.post(
        "/ajax-api/3.0/jobs/search",
        payload={
            "job_name": "simple_job_fun",
            "statuses": ["BAD_STATUS"],
        },
    )
    assert response.status_code == 422
    assert (
        response.json()["detail"][0]["msg"]
        == "Input should be 'PENDING', 'RUNNING', 'SUCCEEDED', 'FAILED' or 'TIMEOUT'"
    )
```

--------------------------------------------------------------------------------

---[FILE: test_jobs.py]---
Location: mlflow-master/tests/server/jobs/test_jobs.py

```python
import concurrent.futures
import multiprocessing
import os
import time
from contextlib import contextmanager
from pathlib import Path

import pytest

from mlflow.entities._job_status import JobStatus
from mlflow.exceptions import MlflowException
from mlflow.server import (
    ARTIFACT_ROOT_ENV_VAR,
    BACKEND_STORE_URI_ENV_VAR,
    HUEY_STORAGE_PATH_ENV_VAR,
)
from mlflow.server.handlers import _get_job_store
from mlflow.server.jobs import (
    _ALLOWED_JOB_NAME_LIST,
    _SUPPORTED_JOB_FUNCTION_LIST,
    TransientError,
    get_job,
    job,
    submit_job,
)
from mlflow.server.jobs.utils import _launch_job_runner
from mlflow.store.jobs.sqlalchemy_store import SqlAlchemyJobStore

# TODO: Remove `pytest.mark.xfail` after fixing flakiness
pytestmark = [
    pytest.mark.skipif(os.name == "nt", reason="MLflow job execution is not supported on Windows"),
]


def _get_mlflow_repo_home():
    root = str(Path(__file__).resolve().parents[3])
    return f"{root}{os.pathsep}{path}" if (path := os.environ.get("PYTHONPATH")) else root


@contextmanager
def _launch_job_runner_for_test():
    new_pythonpath = _get_mlflow_repo_home()
    with _launch_job_runner(
        {"PYTHONPATH": new_pythonpath},
        os.getpid(),
    ) as proc:
        try:
            yield proc
        finally:
            proc.kill()


@contextmanager
def _setup_job_runner(
    monkeypatch: pytest.MonkeyPatch,
    tmp_path: Path,
    supported_job_functions: list[str],
    allowed_job_names: list[str],
    backend_store_uri: str | None = None,
):
    backend_store_uri = backend_store_uri or f"sqlite:///{tmp_path / 'mlflow.db'}"
    huey_store_path = tmp_path / "huey_store"
    huey_store_path.mkdir()
    default_artifact_root = str(tmp_path / "artifacts")
    try:
        monkeypatch.setenv("MLFLOW_SERVER_ENABLE_JOB_EXECUTION", "true")
        monkeypatch.setenv(BACKEND_STORE_URI_ENV_VAR, backend_store_uri)
        monkeypatch.setenv(ARTIFACT_ROOT_ENV_VAR, default_artifact_root)
        monkeypatch.setenv(HUEY_STORAGE_PATH_ENV_VAR, str(huey_store_path))
        monkeypatch.setenv("_MLFLOW_SUPPORTED_JOB_FUNCTION_LIST", ",".join(supported_job_functions))
        monkeypatch.setenv("_MLFLOW_ALLOWED_JOB_NAME_LIST", ",".join(allowed_job_names))
        _SUPPORTED_JOB_FUNCTION_LIST.clear()
        _SUPPORTED_JOB_FUNCTION_LIST.extend(supported_job_functions)
        _ALLOWED_JOB_NAME_LIST.clear()
        _ALLOWED_JOB_NAME_LIST.extend(allowed_job_names)

        with _launch_job_runner_for_test() as job_runner_proc:
            time.sleep(10)
            yield job_runner_proc
    finally:
        # Clear the huey instance cache AFTER killing the runner to ensure clean state for next test
        import mlflow.server.jobs.utils

        mlflow.server.jobs.utils._huey_instance_map.clear()
        if mlflow.server.handlers._job_store is not None:
            # close all db connections and drops connection pool
            mlflow.server.handlers._job_store.engine.dispose()
        mlflow.server.handlers._job_store = None


@job(name="basic_job_fun", max_workers=1)
def basic_job_fun(x, y, sleep_secs=0):
    if sleep_secs > 0:
        time.sleep(sleep_secs)
    return x + y


def test_basic_job(monkeypatch, tmp_path):
    with _setup_job_runner(
        monkeypatch,
        tmp_path,
        supported_job_functions=["tests.server.jobs.test_jobs.basic_job_fun"],
        allowed_job_names=["basic_job_fun"],
    ):
        submitted_job = submit_job(basic_job_fun, {"x": 3, "y": 4})
        wait_job_finalize(submitted_job.job_id)
        job = get_job(submitted_job.job_id)
        assert job.job_id == submitted_job.job_id
        assert job.job_name == "basic_job_fun"
        assert job.params == '{"x": 3, "y": 4}'
        assert job.timeout is None
        assert job.result == "7"
        assert job.parsed_result == 7
        assert job.status == JobStatus.SUCCEEDED
        assert job.retry_count == 0


@job(name="json_in_out_fun", max_workers=1)
def json_in_out_fun(data):
    x = data["x"]
    y = data["y"]
    return {"res": x + y}


def test_job_json_input_output(monkeypatch, tmp_path):
    with _setup_job_runner(
        monkeypatch,
        tmp_path,
        supported_job_functions=["tests.server.jobs.test_jobs.json_in_out_fun"],
        allowed_job_names=["json_in_out_fun"],
    ):
        submitted_job = submit_job(json_in_out_fun, {"data": {"x": 3, "y": 4}})
        wait_job_finalize(submitted_job.job_id)
        job = get_job(submitted_job.job_id)
        assert job.job_id == submitted_job.job_id
        assert job.job_name == "json_in_out_fun"
        assert job.params == '{"data": {"x": 3, "y": 4}}'
        assert job.result == '{"res": 7}'
        assert job.parsed_result == {"res": 7}
        assert job.status == JobStatus.SUCCEEDED
        assert job.retry_count == 0


@job(name="err_fun", max_workers=1)
def err_fun(data):
    raise RuntimeError()


def test_error_job(monkeypatch, tmp_path):
    with _setup_job_runner(
        monkeypatch,
        tmp_path,
        supported_job_functions=["tests.server.jobs.test_jobs.err_fun"],
        allowed_job_names=["err_fun"],
    ):
        submitted_job = submit_job(err_fun, {"data": None})
        wait_job_finalize(submitted_job.job_id)
        job = get_job(submitted_job.job_id)

        # check database record correctness.
        assert job.job_id == submitted_job.job_id
        assert job.job_name == "err_fun"
        assert job.params == '{"data": null}'
        assert job.result.startswith("RuntimeError()")
        assert job.status == JobStatus.FAILED
        assert job.retry_count == 0


def assert_job_result(job_id, expected_status, expected_result):
    job = get_job(job_id)
    assert job.status == expected_status
    assert job.parsed_result == expected_result


def test_job_resume_on_job_runner_restart(monkeypatch, tmp_path):
    with _setup_job_runner(
        monkeypatch,
        tmp_path,
        supported_job_functions=["tests.server.jobs.test_jobs.basic_job_fun"],
        allowed_job_names=["basic_job_fun"],
    ) as job_runner_proc:
        job1_id = submit_job(basic_job_fun, {"x": 3, "y": 4, "sleep_secs": 0}).job_id
        job2_id = submit_job(basic_job_fun, {"x": 5, "y": 6, "sleep_secs": 2}).job_id
        job3_id = submit_job(basic_job_fun, {"x": 7, "y": 8, "sleep_secs": 0}).job_id
        wait_job_finalize(job1_id)
        job_runner_proc.kill()
        job_runner_proc.wait()  # ensure the job runner process is killed.

        # assert that job1 has done, job2 is running, and job3 is pending.
        assert_job_result(job1_id, JobStatus.SUCCEEDED, 7)
        assert_job_result(job2_id, JobStatus.RUNNING, None)
        assert_job_result(job3_id, JobStatus.PENDING, None)

        # restart the job runner, and verify it resumes unfinished jobs (job2 and job3)
        with _launch_job_runner_for_test():
            wait_job_finalize(job2_id)
            wait_job_finalize(job3_id)
            # assert all jobs are done.
            assert_job_result(job1_id, JobStatus.SUCCEEDED, 7)
            assert_job_result(job2_id, JobStatus.SUCCEEDED, 11)
            assert_job_result(job3_id, JobStatus.SUCCEEDED, 15)


def test_job_resume_on_new_job_runner(monkeypatch, tmp_path):
    db_tmp_path = tmp_path / "db"
    db_tmp_path.mkdir()
    runner1_tmp_path = tmp_path / "runner1"
    runner1_tmp_path.mkdir()
    runner2_tmp_path = tmp_path / "runner2"
    runner2_tmp_path.mkdir()

    backend_store_uri = f"sqlite:///{db_tmp_path / 'mlflow.db'!s}"

    with _setup_job_runner(
        monkeypatch,
        runner1_tmp_path,
        supported_job_functions=["tests.server.jobs.test_jobs.basic_job_fun"],
        allowed_job_names=["basic_job_fun"],
        backend_store_uri=backend_store_uri,
    ) as job_runner_proc:
        job1_id = submit_job(basic_job_fun, {"x": 3, "y": 4, "sleep_secs": 0}).job_id
        job2_id = submit_job(basic_job_fun, {"x": 5, "y": 6, "sleep_secs": 2}).job_id
        job3_id = submit_job(basic_job_fun, {"x": 7, "y": 8, "sleep_secs": 0}).job_id
        wait_job_finalize(job1_id)

        # assert that job1 has done, job2 is running, and job3 is pending.
        assert_job_result(job1_id, JobStatus.SUCCEEDED, 7)
        assert_job_result(job2_id, JobStatus.RUNNING, None)
        assert_job_result(job3_id, JobStatus.PENDING, None)

    # ensure the job runner process is killed.
    job_runner_proc.wait()

    with _setup_job_runner(
        monkeypatch,
        runner2_tmp_path,
        supported_job_functions=["tests.server.jobs.test_jobs.basic_job_fun"],
        allowed_job_names=["basic_job_fun"],
        backend_store_uri=backend_store_uri,
    ):
        wait_job_finalize(job2_id)
        wait_job_finalize(job3_id)
        # assert all jobs are done.
        assert_job_result(job1_id, JobStatus.SUCCEEDED, 7)
        assert_job_result(job2_id, JobStatus.SUCCEEDED, 11)
        assert_job_result(job3_id, JobStatus.SUCCEEDED, 15)


@job(name="job_fun_parallelism2", max_workers=2)
def job_fun_parallelism2(x, y, sleep_secs=0):
    if sleep_secs > 0:
        time.sleep(sleep_secs)
    return x + y


@job(name="job_fun_parallelism3", max_workers=3)
def job_fun_parallelism3(x, y, sleep_secs=0):
    if sleep_secs > 0:
        time.sleep(sleep_secs)
    return x + y


def test_job_queue_parallelism(monkeypatch, tmp_path):
    with _setup_job_runner(
        monkeypatch,
        tmp_path,
        supported_job_functions=[
            "tests.server.jobs.test_jobs.job_fun_parallelism2",
            "tests.server.jobs.test_jobs.job_fun_parallelism3",
        ],
        allowed_job_names=["job_fun_parallelism2", "job_fun_parallelism3"],
    ):
        for x in range(4):
            submit_job(job_fun_parallelism2, {"x": x, "y": 1, "sleep_secs": 2})

        for x in range(6):
            submit_job(job_fun_parallelism3, {"x": x, "y": 1, "sleep_secs": 2})

        job_store = _get_job_store()
        p2_peak_parallelism = 0
        p3_peak_parallelism = 0

        deadline = time.time() + 60
        while time.time() < deadline:
            p2_parallelism = 0
            p3_parallelism = 0

            p2_succeeded_count = 0
            p3_succeeded_count = 0

            jobs = list(job_store.list_jobs())
            for job in jobs:
                if job.job_name == "job_fun_parallelism2":
                    if job.status == JobStatus.RUNNING:
                        p2_parallelism += 1
                    elif job.status == JobStatus.SUCCEEDED:
                        p2_succeeded_count += 1
                elif job.job_name == "job_fun_parallelism3":
                    if job.status == JobStatus.RUNNING:
                        p3_parallelism += 1
                    elif job.status == JobStatus.SUCCEEDED:
                        p3_succeeded_count += 1

            if p2_parallelism > p2_peak_parallelism:
                p2_peak_parallelism = p2_parallelism

            if p3_parallelism > p3_peak_parallelism:
                p3_peak_parallelism = p3_parallelism

            if p2_succeeded_count + p3_succeeded_count == 10:
                break
            time.sleep(1)
        else:
            assert False, "Submitted Jobs do not succeed within timeout."

        assert p2_peak_parallelism == 2
        assert p3_peak_parallelism == 3


@job(name="transient_err_fun_always_fail", max_workers=1)
def transient_err_fun_always_fail():
    raise TransientError(RuntimeError("test transient error."))


@job(name="transient_err_fun_fail_then_succeed", max_workers=1)
def transient_err_fun_fail_then_succeed(counter_file: str):
    counter_path = Path(counter_file)

    try:
        current = int(counter_path.read_text()) if counter_path.exists() else 0
    except (ValueError, FileNotFoundError):
        current = 0

    current += 1
    counter_path.write_text(str(current))

    if current >= 2:
        return 100
    raise TransientError(RuntimeError("test transient error."))


@job(
    name="transient_err_fun2_fail_then_succeed",
    max_workers=1,
    transient_error_classes=[TimeoutError],
)
def transient_err_fun2_fail_then_succeed(counter_file: str):
    counter_path = Path(counter_file)

    try:
        current = int(counter_path.read_text()) if counter_path.exists() else 0
    except (ValueError, FileNotFoundError):
        current = 0

    current += 1
    counter_path.write_text(str(current))

    if current >= 2:
        return 100
    raise TimeoutError("test transient timeout error.")


def wait_job_finalize(job_id, timeout=60):
    beg_time = time.time()
    while time.time() - beg_time <= timeout:
        job = get_job(job_id)
        if JobStatus.is_finalized(job.status):
            return
        time.sleep(0.5)
    raise TimeoutError("The job is not finalized within the timeout.")


def test_job_retry_on_transient_error(monkeypatch, tmp_path):
    monkeypatch.setenv("MLFLOW_SERVER_JOB_TRANSIENT_ERROR_RETRY_BASE_DELAY", "1")
    monkeypatch.setenv("MLFLOW_SERVER_JOB_TRANSIENT_ERROR_MAX_RETRIES", "2")
    with _setup_job_runner(
        monkeypatch,
        tmp_path,
        supported_job_functions=[
            "tests.server.jobs.test_jobs.transient_err_fun_always_fail",
            "tests.server.jobs.test_jobs.transient_err_fun_fail_then_succeed",
            "tests.server.jobs.test_jobs.transient_err_fun2_fail_then_succeed",
        ],
        allowed_job_names=[
            "transient_err_fun_always_fail",
            "transient_err_fun_fail_then_succeed",
            "transient_err_fun2_fail_then_succeed",
        ],
    ):
        store = _get_job_store()

        # Test 1: Job that always fails should exhaust retries and fail
        job1_id = submit_job(transient_err_fun_always_fail, {}).job_id
        wait_job_finalize(job1_id)
        assert_job_result(job1_id, JobStatus.FAILED, "RuntimeError('test transient error.')")
        job1 = store.get_job(job1_id)
        assert job1.status == JobStatus.FAILED
        assert job1.result == "RuntimeError('test transient error.')"
        assert job1.retry_count == 2

        # Test 2: Job that fails once then succeeds should succeed with retry_count=1
        job2_counter = tmp_path / "job2_counter.txt"
        job2_id = submit_job(
            transient_err_fun_fail_then_succeed, {"counter_file": str(job2_counter)}
        ).job_id
        wait_job_finalize(job2_id)
        assert_job_result(job2_id, JobStatus.SUCCEEDED, 100)
        job2 = store.get_job(job2_id)
        assert job2.status == JobStatus.SUCCEEDED
        assert job2.result == "100"
        assert job2.retry_count == 1

        # Test 3: Same as test 2 but with custom transient_error_classes
        job3_counter = tmp_path / "job3_counter.txt"
        job3_id = submit_job(
            transient_err_fun2_fail_then_succeed, {"counter_file": str(job3_counter)}
        ).job_id
        wait_job_finalize(job3_id)
        assert_job_result(job3_id, JobStatus.SUCCEEDED, 100)
        job3 = store.get_job(job3_id)
        assert job3.status == JobStatus.SUCCEEDED
        assert job3.result == "100"
        assert job3.retry_count == 1


# `submit_job` API is designed to be called inside MLflow server handler,
# MLflow server handler might be executed in multiple MLflow server workers
# so that we need a test to cover the case that executes `submit_job` in
# multi-processes case.
def test_submit_jobs_from_multi_processes(monkeypatch, tmp_path):
    context = multiprocessing.get_context("spawn")
    with (
        _setup_job_runner(
            monkeypatch,
            tmp_path,
            supported_job_functions=["tests.server.jobs.test_jobs.basic_job_fun"],
            allowed_job_names=["basic_job_fun"],
        ),
        context.Pool(2) as pool,
    ):
        job_id = submit_job(basic_job_fun, {"x": 1, "y": 1, "sleep_secs": 0}).job_id
        wait_job_finalize(job_id)

        async_res_list = [
            pool.apply_async(
                submit_job,
                args=(basic_job_fun,),
                kwds={"params": {"x": x, "y": 1, "sleep_secs": 2}},
            )
            for x in range(2)
        ]
        job_ids = [async_res.get().job_id for async_res in async_res_list]
        for job_id in job_ids:
            wait_job_finalize(job_id)
        for x in range(2):
            assert_job_result(job_ids[x], JobStatus.SUCCEEDED, x + 1)


@job(name="sleep_fun", max_workers=1)
def sleep_fun(sleep_secs, tmp_dir):
    (Path(tmp_dir) / "pid").write_text(str(os.getpid()))
    time.sleep(sleep_secs)


def test_job_timeout(monkeypatch, tmp_path):
    from mlflow.server.jobs.utils import is_process_alive

    with _setup_job_runner(
        monkeypatch,
        tmp_path,
        supported_job_functions=["tests.server.jobs.test_jobs.sleep_fun"],
        allowed_job_names=["sleep_fun"],
    ):
        job_tmp_path = tmp_path / "job"
        job_tmp_path.mkdir()

        # warm up
        job_id = submit_job(sleep_fun, {"sleep_secs": 0, "tmp_dir": str(job_tmp_path)}).job_id
        wait_job_finalize(job_id)

        job_id = submit_job(
            sleep_fun, {"sleep_secs": 10, "tmp_dir": str(job_tmp_path)}, timeout=3
        ).job_id
        wait_job_finalize(job_id)
        pid = int((job_tmp_path / "pid").read_text())
        # assert timeout job process is killed.
        assert not is_process_alive(pid)

        assert_job_result(job_id, JobStatus.TIMEOUT, None)

        store = _get_job_store()
        job = store.get_job(job_id)

        # check database record correctness.
        assert job.job_id == job_id
        assert job.job_name == "sleep_fun"
        assert job.timeout == 3.0
        assert job.result is None
        assert job.status == JobStatus.TIMEOUT
        assert job.retry_count == 0


def test_list_job_pagination(monkeypatch, tmp_path):
    import mlflow.store.jobs.sqlalchemy_store

    monkeypatch.setattr(mlflow.store.jobs.sqlalchemy_store, "_LIST_JOB_PAGE_SIZE", 3)
    with _setup_job_runner(
        monkeypatch,
        tmp_path,
        supported_job_functions=["tests.server.jobs.test_jobs.basic_job_fun"],
        allowed_job_names=["basic_job_fun"],
    ):
        job_ids = [submit_job(basic_job_fun, {"x": x, "y": 4}).job_id for x in range(10)]

        listed_jobs = _get_job_store().list_jobs()
        assert [job.job_id for job in listed_jobs] == job_ids


def bad_job_function() -> None:
    return


def test_job_function_without_decorator(monkeypatch, tmp_path):
    with _setup_job_runner(
        monkeypatch,
        tmp_path,
        supported_job_functions=["tests.server.jobs.test_jobs.bad_job_function"],
        allowed_job_names=["bad_job_function"],
    ):
        with pytest.raises(
            MlflowException,
            match="The job function tests.server.jobs.test_jobs.bad_job_function is not decorated",
        ):
            submit_job(bad_job_function, params={})


@job(name="job_use_process", max_workers=1)
def job_use_process(tmp_dir):
    (Path(tmp_dir) / str(os.getpid())).write_text("")


def test_job_use_process(monkeypatch, tmp_path):
    with _setup_job_runner(
        monkeypatch,
        tmp_path,
        supported_job_functions=["tests.server.jobs.test_jobs.job_use_process"],
        allowed_job_names=["job_use_process"],
    ):
        job_tmp_path = tmp_path / "job"
        job_tmp_path.mkdir()

        job_id1 = submit_job(job_use_process, {"tmp_dir": str(job_tmp_path)}).job_id
        job_id2 = submit_job(job_use_process, {"tmp_dir": str(job_tmp_path)}).job_id
        wait_job_finalize(job_id1)
        wait_job_finalize(job_id2)
        assert len(os.listdir(str(job_tmp_path))) == 2


def test_submit_job_bad_call(monkeypatch, tmp_path):
    with _setup_job_runner(
        monkeypatch,
        tmp_path,
        supported_job_functions=["tests.server.jobs.test_jobs.basic_job_fun"],
        allowed_job_names=["basic_job_fun"],
    ):
        with pytest.raises(
            MlflowException,
            match="When calling 'submit_job', the 'params' argument must be a dict.",
        ):
            submit_job(basic_job_fun, params=None)


@job(
    name="check_python_env_fn",
    max_workers=1,
    python_version="3.11.9",
    pip_requirements=["openai==1.108.2", "pytest<9"],
)
def check_python_env_fn():
    import openai

    from mlflow.utils import PYTHON_VERSION

    assert PYTHON_VERSION == "3.11.9"
    assert openai.__version__ == "1.108.2"


def test_job_with_python_env(monkeypatch, tmp_path):
    monkeypatch.setenv("MLFLOW_HOME", _get_mlflow_repo_home())

    with _setup_job_runner(
        monkeypatch,
        tmp_path,
        supported_job_functions=["tests.server.jobs.test_jobs.check_python_env_fn"],
        allowed_job_names=["check_python_env_fn"],
    ):
        job_id = submit_job(check_python_env_fn, params={}).job_id
        wait_job_finalize(job_id, timeout=600)
        job = get_job(job_id)
        assert job.status == JobStatus.SUCCEEDED


def test_start_job_is_atomic(tmp_path: Path):
    backend_store_uri = f"sqlite:///{tmp_path / 'test.db'}"
    store = SqlAlchemyJobStore(backend_store_uri)

    job = store.create_job("test.function", '{"param": "value"}')
    assert job.status == JobStatus.PENDING

    results = []

    def try_start_job() -> str:
        try:
            store.start_job(job.job_id)
            return "success"
        except MlflowException:
            return "failed"

    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        futures = [executor.submit(try_start_job) for _ in range(5)]
        results = [f.result() for f in concurrent.futures.as_completed(futures)]

    assert results.count("success") == 1
    assert results.count("failed") == 4

    final_job = store.get_job(job.job_id)
    assert final_job.status == JobStatus.RUNNING
```

--------------------------------------------------------------------------------

---[FILE: test_utils.py]---
Location: mlflow-master/tests/server/jobs/test_utils.py

```python
import os

import pytest

from mlflow.exceptions import MlflowException
from mlflow.server.jobs.utils import _load_function, _validate_function_parameters

pytestmark = pytest.mark.skipif(
    os.name == "nt", reason="MLflow job execution is not supported on Windows"
)


def test_validate_function_parameters():
    def test_func(a, b, c=None):
        return a + b + (c or 0)

    # Test with all required parameters present
    _validate_function_parameters(test_func, {"a": 1, "b": 2})
    _validate_function_parameters(test_func, {"a": 1, "b": 2, "c": 3})

    # Test with missing required parameters
    with pytest.raises(MlflowException, match=r"Missing required parameters.*\['b'\]"):
        _validate_function_parameters(test_func, {"a": 1})

    # Test with multiple missing required parameters
    with pytest.raises(MlflowException, match=r"Missing required parameters.*\['a', 'b'\]"):
        _validate_function_parameters(test_func, {})


def test_validate_function_parameters_with_varargs():
    def test_func_with_kwargs(a, **kwargs):
        return a

    # Should not raise error even with extra parameters due to **kwargs
    _validate_function_parameters(test_func_with_kwargs, {"a": 1, "extra": 2})

    # Should still raise error for missing required parameters
    with pytest.raises(MlflowException, match=r"Missing required parameters.*\['a'\]"):
        _validate_function_parameters(test_func_with_kwargs, {"extra": 2})


def test_validate_function_parameters_with_positional_args():
    def test_func_with_args(a, *args):
        return a

    # Should work fine with just required parameter
    _validate_function_parameters(test_func_with_args, {"a": 1})

    # Should still raise error for missing required parameters
    with pytest.raises(MlflowException, match=r"Missing required parameters.*\['a'\]"):
        _validate_function_parameters(test_func_with_args, {})


def test_job_status_conversion():
    from mlflow.entities._job_status import JobStatus

    assert JobStatus.from_int(1) == JobStatus.RUNNING
    assert JobStatus.from_str("RUNNING") == JobStatus.RUNNING

    assert JobStatus.RUNNING.to_int() == 1
    assert str(JobStatus.RUNNING) == "RUNNING"

    with pytest.raises(
        MlflowException, match="The value -1 can't be converted to JobStatus enum value."
    ):
        JobStatus.from_int(-1)

    with pytest.raises(
        MlflowException, match="The value 5 can't be converted to JobStatus enum value."
    ):
        JobStatus.from_int(5)

    with pytest.raises(
        MlflowException, match="The string 'ABC' can't be converted to JobStatus enum value."
    ):
        JobStatus.from_str("ABC")


def test_load_function_invalid_function_format():
    with pytest.raises(MlflowException, match="Invalid function fullname format"):
        _load_function("invalid_format_no_module")


def test_load_function_module_not_found():
    with pytest.raises(MlflowException, match="Module not found"):
        _load_function("non_existent_module.some_function")


def test_load_function_function_not_found():
    with pytest.raises(MlflowException, match="Function not found in module"):
        _load_function("os.non_exist_function")
```

--------------------------------------------------------------------------------

````
