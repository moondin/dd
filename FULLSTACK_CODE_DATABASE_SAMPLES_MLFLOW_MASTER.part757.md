---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 757
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 757 of 991)

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

---[FILE: conftest.py]---
Location: mlflow-master/tests/conftest.py
Signals: Flask, SQLAlchemy

```python
import inspect
import json
import os
import posixpath
import re
import shutil
import subprocess
import sys
import tempfile
import threading
import time
import uuid
from collections import defaultdict
from dataclasses import dataclass
from pathlib import Path
from typing import Iterator
from unittest import mock

import pytest
import requests
from opentelemetry import trace as trace_api

import mlflow
import mlflow.telemetry.utils
from mlflow.environment_variables import _MLFLOW_TESTING, MLFLOW_TRACKING_URI
from mlflow.telemetry.client import get_telemetry_client
from mlflow.tracing.display.display_handler import IPythonTraceDisplayHandler
from mlflow.tracing.export.inference_table import _TRACE_BUFFER
from mlflow.tracing.fluent import _set_last_active_trace_id
from mlflow.tracing.trace_manager import InMemoryTraceManager
from mlflow.utils.os import is_windows
from mlflow.version import IS_TRACING_SDK_ONLY, VERSION

from tests.autologging.fixtures import enable_test_mode
from tests.helper_functions import get_safe_port
from tests.tracing.helper import purge_traces

if not IS_TRACING_SDK_ONLY:
    from mlflow.tracking._tracking_service.utils import _use_tracking_uri
    from mlflow.tracking.fluent import (
        _last_active_run_id,
        _reset_last_logged_model_id,
        clear_active_model,
    )


# Pytest hooks and configuration from root conftest.py
def pytest_addoption(parser):
    parser.addoption(
        "--requires-ssh",
        action="store_true",
        dest="requires_ssh",
        default=False,
        help="Run tests decorated with 'requires_ssh' annotation. "
        "These tests require keys to be configured locally "
        "for SSH authentication.",
    )
    parser.addoption(
        "--ignore-flavors",
        action="store_true",
        dest="ignore_flavors",
        default=False,
        help="Ignore tests for model flavors.",
    )
    parser.addoption(
        "--splits",
        default=None,
        type=int,
        help="The number of groups to split tests into.",
    )
    parser.addoption(
        "--group",
        default=None,
        type=int,
        help="The group of tests to run.",
    )
    parser.addoption(
        "--serve-wheel",
        action="store_true",
        default=os.getenv("CI", "false").lower() == "true",
        help="Serve a wheel for the dev version of MLflow. True by default in CI, False otherwise.",
    )


def pytest_configure(config: pytest.Config):
    config.addinivalue_line("markers", "requires_ssh")
    config.addinivalue_line("markers", "notrackingurimock")
    config.addinivalue_line("markers", "allow_infer_pip_requirements_fallback")
    config.addinivalue_line(
        "markers", "do_not_disable_new_import_hook_firing_if_module_already_exists"
    )
    config.addinivalue_line("markers", "classification")
    config.addinivalue_line("markers", "no_mock_requests_get")

    labels = fetch_pr_labels() or []
    if "fail-fast" in labels:
        config.option.maxfail = 1

    # Register SQLAlchemy LegacyAPIWarning filter only if sqlalchemy is available
    try:
        import sqlalchemy  # noqa: F401

        config.addinivalue_line("filterwarnings", "error::sqlalchemy.exc.LegacyAPIWarning")
    except ImportError:
        pass


@pytest.hookimpl(tryfirst=True)
def pytest_cmdline_main(config: pytest.Config):
    if not_exists := [p for p in config.getoption("ignore") or [] if not os.path.exists(p)]:
        raise pytest.UsageError(f"The following paths are ignored but do not exist: {not_exists}")

    group = config.getoption("group")
    splits = config.getoption("splits")

    if splits is None and group is None:
        return None

    if splits and group is None:
        raise pytest.UsageError("`--group` is required")

    if group and splits is None:
        raise pytest.UsageError("`--splits` is required")

    if splits < 0:
        raise pytest.UsageError("`--splits` must be >= 1")

    if group < 1 or group > splits:
        raise pytest.UsageError("`--group` must be between 1 and {splits}")

    return None


@dataclass
class TestResult:
    path: Path
    test_name: str
    execution_time: float


_test_results: list[TestResult] = []


def pytest_sessionstart(session):
    # Clear duration tracking state at the start of each session
    _test_results.clear()

    if IS_TRACING_SDK_ONLY:
        return

    import click

    if uri := MLFLOW_TRACKING_URI.get():
        click.echo(
            click.style(
                (
                    f"Environment variable {MLFLOW_TRACKING_URI} is set to {uri!r}, "
                    "which may interfere with tests."
                ),
                fg="red",
            )
        )


def to_md_table(rows: list[list[str]]) -> str:
    if not rows:
        return ""
    n = max(len(r) for r in rows)
    rows = [r + [""] * (n - len(r)) for r in rows]

    # Calculate column widths
    widths = [max(len(row[i]) for row in rows) for i in range(n)]

    def esc(s: str) -> str:
        return s.replace("|", r"\|").replace("\n", "<br>")

    # Format rows with proper padding
    def format_row(row: list[str]) -> str:
        cells = [esc(cell).ljust(width) for cell, width in zip(row, widths)]
        return "| " + " | ".join(cells) + " |"

    header = format_row(rows[0])
    sep = "| " + " | ".join(["-" * w for w in widths]) + " |"
    body = [format_row(row) for row in rows[1:]]

    return "\n".join([header, sep, *body])


def generate_duration_stats() -> str:
    """Generate per-file duration statistics as markdown table."""
    if not _test_results:
        return ""

    # Group results by file path
    file_groups: defaultdict[Path, list[float]] = defaultdict(list)
    for result in _test_results:
        file_groups[result.path].append(result.execution_time)

    rows = []
    for path, test_times in file_groups.items():
        rel_path = path.relative_to(Path.cwd()).as_posix()
        total_dur = sum(test_times)
        if total_dur < 1.0:
            # Ignore files with total duration < 1s
            continue
        test_count = len(test_times)
        min_test = min(test_times)
        max_test = max(test_times)
        avg_test = sum(test_times) / len(test_times)

        rows.append((rel_path, total_dur, test_count, min_test, max_test, avg_test))

    rows.sort(key=lambda r: r[1], reverse=True)

    if not rows:
        return ""

    # Prepare data for markdown table (headers + data rows)
    table_rows = [["Rank", "File", "Duration", "Tests", "Min", "Max", "Avg"]]
    for idx, (path, dur, count, min_, max_, avg_) in enumerate(rows, 1):
        table_rows.append(
            [
                str(idx),
                f"`{path}`",
                f"{dur:.2f}s",
                str(count),
                f"{min_:.3f}s",
                f"{max_:.3f}s",
                f"{avg_:.3f}s",
            ]
        )

    return to_md_table(table_rows)


@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_protocol(item: pytest.Item, nextitem: pytest.Item | None):
    start = time.perf_counter()
    yield  # This includes setup + call + teardown
    duration = time.perf_counter() - start
    _test_results.append(TestResult(path=item.path, test_name=item.name, execution_time=duration))


def pytest_runtest_setup(item):
    markers = [mark.name for mark in item.iter_markers()]
    if "requires_ssh" in markers and not item.config.getoption("--requires-ssh"):
        pytest.skip("use `--requires-ssh` to run this test")


def fetch_pr_labels():
    """
    Returns the labels associated with the current pull request.
    """
    if "GITHUB_ACTIONS" not in os.environ:
        return None

    if os.environ.get("GITHUB_EVENT_NAME") != "pull_request":
        return None

    with open(os.environ["GITHUB_EVENT_PATH"]) as f:
        pr_data = json.load(f)
        return [label["name"] for label in pr_data["pull_request"]["labels"]]


@pytest.hookimpl(hookwrapper=True)
def pytest_report_teststatus(report, config):
    outcome = yield
    if report.when == "call":
        try:
            import psutil
        except ImportError:
            return

        (*rest, result) = outcome.get_result()
        mem = psutil.virtual_memory()
        mem_used = mem.used / 1024**3
        mem_total = mem.total / 1024**3

        disk = psutil.disk_usage("/")
        disk_used = disk.used / 1024**3
        disk_total = disk.total / 1024**3
        outcome.force_result(
            (
                *rest,
                (
                    f"{result} | "
                    f"MEM {mem_used:.1f}/{mem_total:.1f} GB | "
                    f"DISK {disk_used:.1f}/{disk_total:.1f} GB"
                ),
            )
        )


@pytest.hookimpl(hookwrapper=True)
def pytest_ignore_collect(collection_path, config):
    outcome = yield
    if not outcome.get_result() and config.getoption("ignore_flavors"):
        # If not ignored by the default hook and `--ignore-flavors` specified

        # Ignored files and directories must be included in dev/run-python-flavor-tests.sh
        model_flavors = [
            # Tests of flavor modules.
            "tests/ag2",
            "tests/agno",
            "tests/anthropic",
            "tests/autogen",
            "tests/azureml",
            "tests/bedrock",
            "tests/catboost",
            "tests/crewai",
            "tests/dspy",
            "tests/gemini",
            "tests/groq",
            "tests/h2o",
            "tests/johnsnowlabs",
            "tests/keras",
            "tests/keras_core",
            "tests/llama_index",
            "tests/langchain",
            "tests/langgraph",
            "tests/lightgbm",
            "tests/litellm",
            "tests/mistral",
            "tests/models",
            "tests/onnx",
            "tests/openai",
            "tests/paddle",
            "tests/pmdarima",
            "tests/prophet",
            "tests/pydantic_ai",
            "tests/pyfunc",
            "tests/pytorch",
            "tests/strands",
            "tests/haystack",
            "tests/semantic_kernel",
            "tests/sentence_transformers",
            "tests/shap",
            "tests/sklearn",
            "tests/smolagents",
            "tests/spacy",
            "tests/spark",
            "tests/statsmodels",
            "tests/tensorflow",
            "tests/transformers",
            "tests/xgboost",
            # Lazy loading test.
            "tests/test_mlflow_lazily_imports_ml_packages.py",
            # This test is included here because it imports many big libraries like tf, keras, etc.
            "tests/tracking/fluent/test_fluent_autolog.py",
            # Cross flavor autologging related tests.
            "tests/autologging/test_autologging_safety_unit.py",
            "tests/autologging/test_autologging_behaviors_unit.py",
            "tests/autologging/test_autologging_behaviors_integration.py",
            "tests/autologging/test_autologging_utils.py",
            "tests/autologging/test_training_session.py",
        ]

        relpath = os.path.relpath(str(collection_path))
        relpath = relpath.replace(os.sep, posixpath.sep)  # for Windows

        if relpath in model_flavors:
            outcome.force_result(True)


@pytest.hookimpl(trylast=True)
def pytest_collection_modifyitems(session, config, items):
    # Executing `tests.server.test_prometheus_exporter` after `tests.server.test_handlers`
    # results in an error because Flask >= 2.2.0 doesn't allow calling setup method such as
    # `before_request` on the application after the first request. To avoid this issue,
    # execute `tests.server.test_prometheus_exporter` first by reordering the test items.
    items.sort(key=lambda item: item.module.__name__ != "tests.server.test_prometheus_exporter")

    # Select the tests to run based on the group and splits
    if (splits := config.getoption("--splits")) and (group := config.getoption("--group")):
        items[:] = items[(group - 1) :: splits]


@pytest.hookimpl(hookwrapper=True)
def pytest_terminal_summary(terminalreporter, exitstatus, config):
    yield

    # Display per-file durations
    if duration_stats := generate_duration_stats():
        terminalreporter.write("\n")
        header = "per-file durations (sorted)"
        terminalreporter.write_sep("=", header)
        terminalreporter.write(f"::group::{header}\n\n")
        terminalreporter.write(duration_stats)
        terminalreporter.write("\n\n::endgroup::\n")
        terminalreporter.write("\n")

    if (
        # `uv run` was used to run tests
        "UV" in os.environ
        # Tests failed because of missing dependencies
        and (errors := terminalreporter.stats.get("error"))
        and any(re.search(r"ModuleNotFoundError|ImportError", str(e.longrepr)) for e in errors)
    ):
        terminalreporter.write("\n")
        terminalreporter.section("HINTS", yellow=True)
        terminalreporter.write(
            "To run tests with additional packages, use:\n"
            "  uv run --with <package> pytest ...\n\n"
            "For multiple packages:\n"
            "  uv run --with <package1> --with <package2> pytest ...\n\n",
            yellow=True,
        )

    # If there are failed tests, display a command to run them
    if failed_test_reports := terminalreporter.stats.get("failed", []):
        if len(failed_test_reports) <= 30:
            ids = [repr(report.nodeid) for report in failed_test_reports]
        else:
            # Use dict.fromkeys to preserve the order
            ids = list(dict.fromkeys(report.fspath for report in failed_test_reports))
        terminalreporter.section("command to run failed tests")
        terminalreporter.write(" ".join(["pytest"] + ids))
        terminalreporter.write("\n" * 2)

        if summary_path := os.environ.get("GITHUB_STEP_SUMMARY"):
            summary_path = Path(summary_path).resolve()
            with summary_path.open("a") as f:
                f.write("## Failed tests\n")
                f.write("Run the following command to run the failed tests:\n")
                f.write("```bash\n")
                f.write(" ".join(["pytest"] + ids) + "\n")
                f.write("```\n\n")

        # If some tests failed at installing mlflow, we suggest using `--serve-wheel` flag.
        # Some test cases try to install mlflow via pip e.g. model loading. They pins
        # mlflow version to install based on local environment i.e. dev version ahead of
        # the latest release, hence it's not found on PyPI. `--serve-wheel` flag was
        # introduced to resolve this issue, which starts local PyPI server and serve
        # an mlflow wheel based on local source code.
        # Ref: https://github.com/mlflow/mlflow/pull/10247
        msg = f"No matching distribution found for mlflow=={VERSION}"
        for rep in failed_test_reports:
            if any(msg in t for t in (rep.longreprtext, rep.capstdout, rep.capstderr)):
                terminalreporter.section("HINTS", yellow=True)
                terminalreporter.write(
                    f"Found test(s) that failed with {msg!r}. Adding"
                    " --serve-wheel` flag to your pytest command may help.\n\n",
                    yellow=True,
                )
                break

    main_thread = threading.main_thread()
    if threads := [t for t in threading.enumerate() if t is not main_thread]:
        terminalreporter.section("Remaining threads", yellow=True)
        for idx, thread in enumerate(threads, start=1):
            terminalreporter.write(f"{idx}: {thread}\n")

        # Uncomment this block to print tracebacks of non-daemon threads
        # if non_daemon_threads := [t for t in threads if not t.daemon]:
        #     frames = sys._current_frames()
        #     terminalreporter.section("Tracebacks of non-daemon threads", yellow=True)
        #     for thread in non_daemon_threads:
        #         thread.join(timeout=1)
        #         if thread.is_alive() and (frame := frames.get(thread.ident)):
        #             terminalreporter.section(repr(thread), sep="~")
        #             terminalreporter.write("".join(traceback.format_stack(frame)))

    try:
        import psutil
    except ImportError:
        pass
    else:
        current_process = psutil.Process()
        if children := current_process.children(recursive=True):
            terminalreporter.section("Remaining child processes", yellow=True)
            for idx, child in enumerate(children, start=1):
                terminalreporter.write(f"{idx}: {child}\n")


# Test fixtures from tests/conftest.py


@pytest.fixture(autouse=IS_TRACING_SDK_ONLY, scope="session")
def remote_backend_for_tracing_sdk_test():
    """
    A fixture to start a remote backend for testing mlflow-tracing package integration.
    Since the tracing SDK has to be tested in an environment that has minimal dependencies,
    we need to start a tracking backend in an isolated uv environment.
    """
    port = get_safe_port()
    # Start a remote backend to test mlflow-tracing package integration.
    with tempfile.TemporaryDirectory() as temp_dir:
        mlflow_root = os.path.dirname(os.path.dirname(__file__))
        with subprocess.Popen(
            [
                "uv",
                "run",
                "--directory",
                # Install from the dev version
                mlflow_root,
                "mlflow",
                "server",
                "--port",
                str(port),
            ],
            cwd=temp_dir,
        ) as process:
            print("Starting mlflow server on port 5000")  # noqa: T201
            try:
                for _ in range(60):
                    try:
                        response = requests.get(f"http://localhost:{port}")
                        if response.ok:
                            break
                    except requests.ConnectionError:
                        print("MLflow server is not responding yet.")  # noqa: T201
                        time.sleep(1)
                else:
                    raise RuntimeError("Failed to start server")

                mlflow.set_tracking_uri(f"http://localhost:{port}")

                yield

            finally:
                process.terminate()


@pytest.fixture(autouse=IS_TRACING_SDK_ONLY)
def tmp_experiment_for_tracing_sdk_test(monkeypatch):
    # Generate a random experiment name
    experiment_name = f"trace-unit-test-{uuid.uuid4().hex}"
    experiment = mlflow.set_experiment(experiment_name)

    # Reduce retries for speed up tests
    monkeypatch.setenv("MLFLOW_HTTP_REQUEST_MAX_RETRIES", "1")

    yield

    purge_traces(experiment_id=experiment.experiment_id)


@pytest.fixture(autouse=not IS_TRACING_SDK_ONLY)
def tracking_uri_mock(db_uri: str, request: pytest.FixtureRequest) -> Iterator[str | None]:
    if "notrackingurimock" not in request.keywords:
        with _use_tracking_uri(db_uri):
            yield db_uri
    else:
        yield None


@pytest.fixture(autouse=True)
def reset_active_experiment_id():
    yield
    mlflow.tracking.fluent._active_experiment_id = None
    os.environ.pop("MLFLOW_EXPERIMENT_ID", None)


@pytest.fixture(autouse=True)
def reset_mlflow_uri():
    yield
    # Resetting these environment variables cause sqlalchemy store tests to run with a sqlite
    # database instead of mysql/postgresql/mssql.
    if "DISABLE_RESET_MLFLOW_URI_FIXTURE" not in os.environ:
        os.environ.pop("MLFLOW_TRACKING_URI", None)
        os.environ.pop("MLFLOW_REGISTRY_URI", None)
        try:
            from mlflow.tracking import set_registry_uri

            # clean up the registry URI to avoid side effects
            set_registry_uri(None)
        except ImportError:
            # tracing sdk does not have the registry module
            pass


@pytest.fixture(autouse=True)
def reset_tracing():
    """
    Reset the global state of the tracing feature.

    This fixture is auto-applied for cleaning up the global state between tests
    to avoid side effects.
    """
    yield

    # Reset OpenTelemetry and MLflow tracer setup
    mlflow.tracing.reset()

    # Clear other global state and singletons
    _set_last_active_trace_id(None)
    _TRACE_BUFFER.clear()
    InMemoryTraceManager.reset()
    IPythonTraceDisplayHandler._instance = None

    # Reset opentelemetry tracer provider as well
    trace_api._TRACER_PROVIDER_SET_ONCE._done = False
    trace_api._TRACER_PROVIDER = None


def _is_span_active():
    span = trace_api.get_current_span()
    return (span is not None) and not isinstance(span, trace_api.NonRecordingSpan)


@pytest.fixture(autouse=True)
def validate_trace_finish():
    """
    Validate all spans are finished and detached from the context by the end of the each test.

    Leaked span is critical problem and also hard to find without an explicit check.
    """
    # When the span is leaked, it causes confusing test failure in the subsequent tests. To avoid
    # this and make the test failure more clear, we fail first here.
    if _is_span_active():
        pytest.skip(reason="A leaked active span is found before starting the test.")

    yield

    assert not _is_span_active(), (
        "A span is still active at the end of the test. All spans must be finished "
        "and detached from the context before the test ends. The leaked span context "
        "may cause other subsequent tests to fail."
    )


@pytest.fixture(autouse=True, scope="session")
def enable_test_mode_by_default_for_autologging_integrations():
    """
    Run all MLflow tests in autologging test mode, ensuring that errors in autologging patch code
    are raised and detected. For more information about autologging test mode, see the docstring
    for :py:func:`mlflow.utils.autologging_utils._is_testing()`.
    """
    yield from enable_test_mode()


@pytest.fixture(autouse=not IS_TRACING_SDK_ONLY)
def clean_up_leaked_runs():
    """
    Certain test cases validate safety API behavior when runs are leaked. Leaked runs that
    are not cleaned up between test cases may result in cascading failures that are hard to
    debug. Accordingly, this fixture attempts to end any active runs it encounters and
    throws an exception (which reported as an additional error in the pytest execution output).
    """
    try:
        yield
        assert not mlflow.active_run(), (
            "test case unexpectedly leaked a run. Run info: {}. Run data: {}".format(
                mlflow.active_run().info, mlflow.active_run().data
            )
        )
    finally:
        while mlflow.active_run():
            mlflow.end_run()


def _called_in_save_model():
    for frame in inspect.stack()[::-1]:
        if frame.function == "save_model":
            return True
    return False


@pytest.fixture(autouse=not IS_TRACING_SDK_ONLY)
def prevent_infer_pip_requirements_fallback(request):
    """
    Prevents `mlflow.models.infer_pip_requirements` from falling back in `mlflow.*.save_model`
    unless explicitly disabled via `pytest.mark.allow_infer_pip_requirements_fallback`.
    """
    from mlflow.utils.environment import _INFER_PIP_REQUIREMENTS_GENERAL_ERROR_MESSAGE

    def new_exception(msg, *_, **__):
        if msg == _INFER_PIP_REQUIREMENTS_GENERAL_ERROR_MESSAGE and _called_in_save_model():
            raise Exception(
                "`mlflow.models.infer_pip_requirements` should not fall back in"
                "`mlflow.*.save_model` during test"
            )

    if "allow_infer_pip_requirements_fallback" not in request.keywords:
        with mock.patch("mlflow.utils.environment._logger.exception", new=new_exception):
            yield
    else:
        yield


@pytest.fixture(autouse=not IS_TRACING_SDK_ONLY)
def clean_up_mlruns_directory(request):
    """
    Clean up an `mlruns` directory on each test module teardown on CI to save the disk space.
    """
    yield

    # Only run this fixture on CI.
    if "GITHUB_ACTIONS" not in os.environ:
        return

    mlruns_dir = os.path.join(request.config.rootpath, "mlruns")
    if os.path.exists(mlruns_dir):
        try:
            shutil.rmtree(mlruns_dir)
        except OSError:
            if is_windows():
                raise
            # `shutil.rmtree` can't remove files owned by root in a docker container.
            subprocess.check_call(["sudo", "rm", "-rf", mlruns_dir])


@pytest.fixture(autouse=not IS_TRACING_SDK_ONLY)
def clean_up_last_logged_model_id():
    """
    Clean up the last logged model ID stored in a thread local var.
    """
    _reset_last_logged_model_id()


@pytest.fixture(autouse=not IS_TRACING_SDK_ONLY)
def clean_up_last_active_run():
    _last_active_run_id.set(None)


@pytest.fixture(scope="module", autouse=not IS_TRACING_SDK_ONLY)
def clean_up_envs():
    """
    Clean up virtualenvs and conda environments created during tests to save disk space.
    """
    yield

    if "GITHUB_ACTIONS" in os.environ:
        from mlflow.utils.virtualenv import _get_mlflow_virtualenv_root

        shutil.rmtree(_get_mlflow_virtualenv_root(), ignore_errors=True)
        if not is_windows():
            conda_info = json.loads(subprocess.check_output(["conda", "info", "--json"], text=True))
            root_prefix = conda_info["root_prefix"]
            regex = re.compile(r"mlflow-\w{32,}")
            for env in conda_info["envs"]:
                if env == root_prefix:
                    continue
                if regex.fullmatch(os.path.basename(env)):
                    shutil.rmtree(env, ignore_errors=True)


@pytest.fixture(scope="session", autouse=True)
def enable_mlflow_testing():
    with pytest.MonkeyPatch.context() as mp:
        mp.setenv(_MLFLOW_TESTING.name, "TRUE")
        yield


@pytest.fixture(scope="session", autouse=not IS_TRACING_SDK_ONLY)
def serve_wheel(request, tmp_path_factory):
    """
    Models logged during tests have a dependency on the dev version of MLflow built from
    source (e.g., mlflow==1.20.0.dev0) and cannot be served because the dev version is not
    available on PyPI. This fixture serves a wheel for the dev version from a temporary
    PyPI repository running on localhost and appends the repository URL to the
    `PIP_EXTRA_INDEX_URL` environment variable to make the wheel available to pip.
    """
    from tests.helper_functions import get_safe_port

    if "COPILOT_AGENT_ACTION" in os.environ:
        yield  # pytest expects a generator fixture to yield
        return

    if not request.config.getoption("--serve-wheel"):
        yield  # pytest expects a generator fixture to yield
        return

    root = tmp_path_factory.mktemp("root")
    mlflow_dir = root.joinpath("mlflow")
    mlflow_dir.mkdir()
    port = get_safe_port()
    try:
        repo_root = subprocess.check_output(
            [
                "git",
                "rev-parse",
                "--show-toplevel",
            ],
            text=True,
        ).strip()
    except subprocess.CalledProcessError:
        # Some tests run in a Docker container where git is not installed.
        # In this case, assume we're in the root of the repo.
        repo_root = "."

    subprocess.check_call(
        [
            sys.executable,
            "-m",
            "pip",
            "wheel",
            "--wheel-dir",
            mlflow_dir,
            "--no-deps",
            repo_root,
        ],
    )
    with subprocess.Popen(
        [
            sys.executable,
            "-m",
            "http.server",
            str(port),
        ],
        cwd=root,
    ) as prc:
        try:
            url = f"http://localhost:{port}"
            if existing_url := os.environ.get("PIP_EXTRA_INDEX_URL"):
                url = f"{existing_url} {url}"
            os.environ["PIP_EXTRA_INDEX_URL"] = url
            # Set the `UV_INDEX` environment variable to allow fetching the wheel from the
            # url when using `uv` as environment manager
            os.environ["UV_INDEX"] = f"mlflow={url}"
            yield
        finally:
            prc.terminate()


@pytest.fixture
def mock_s3_bucket():
    """
    Creates a mock S3 bucket using moto

    Returns:
        The name of the mock bucket.
    """
    import boto3
    import moto

    with moto.mock_s3():
        bucket_name = "mock-bucket"
        s3_client = boto3.client("s3")
        s3_client.create_bucket(Bucket=bucket_name)
        yield bucket_name


@pytest.fixture
def tmp_sqlite_uri(tmp_path):
    path = tmp_path.joinpath("mlflow.db").as_uri()
    return ("sqlite://" if is_windows() else "sqlite:////") + path[len("file://") :]


@pytest.fixture
def mock_databricks_serving_with_tracing_env(monkeypatch):
    monkeypatch.setenv("IS_IN_DB_MODEL_SERVING_ENV", "true")
    monkeypatch.setenv("ENABLE_MLFLOW_TRACING", "true")


@pytest.fixture(params=[True, False])
def mock_is_in_databricks(request):
    with mock.patch(
        "mlflow.models.model.is_in_databricks_runtime", return_value=request.param
    ) as mock_databricks:
        yield mock_databricks


@pytest.fixture(autouse=not IS_TRACING_SDK_ONLY)
def reset_active_model_context():
    yield
    clear_active_model()


@pytest.fixture(autouse=True)
def clean_up_telemetry_threads():
    yield
    if client := get_telemetry_client():
        client._clean_up()


@pytest.fixture(scope="session")
def cached_db(tmp_path_factory: pytest.TempPathFactory) -> Path:
    """
    Creates and caches a SQLite database to avoid repeated migrations for each test run.

    This is a session-scoped fixture that creates the database once per test session.
    Individual tests should copy this database to their own tmp_path to avoid conflicts.
    """
    tmp_dir = tmp_path_factory.mktemp("sqlite_db")
    db_path = tmp_dir / "mlflow.db"

    if IS_TRACING_SDK_ONLY:
        return db_path

    try:
        from mlflow.store.tracking.sqlalchemy_store import SqlAlchemyStore
    except ImportError:
        return db_path

    db_uri = f"sqlite:///{db_path}"
    artifact_uri = (tmp_dir / "artifacts").as_uri()
    store = SqlAlchemyStore(db_uri, artifact_uri)
    store.engine.dispose()

    return db_path


@pytest.fixture
def db_uri(cached_db: Path) -> Iterator[str]:
    """Returns a fresh SQLite URI for each test by copying the cached database."""
    with tempfile.TemporaryDirectory(ignore_cleanup_errors=True) as tmp_dir:
        db_path = Path(tmp_dir) / "mlflow.db"

        if not IS_TRACING_SDK_ONLY and cached_db.exists():
            shutil.copy2(cached_db, db_path)

        yield f"sqlite:///{db_path}"


@pytest.fixture(autouse=True)
def clear_engine_map():
    """
    Clear the SQLAlchemy engine cache in all stores between tests.

    Each SQLAlchemy store caches engines by database URI to prevent connection pool leaks.
    This fixture clears the cache between tests to ensure test isolation and prevent
    engines from one test affecting another.
    """
    try:
        from mlflow.store.jobs.sqlalchemy_store import SqlAlchemyJobStore
        from mlflow.store.model_registry.sqlalchemy_store import (
            SqlAlchemyStore as ModelRegistrySqlAlchemyStore,
        )
        from mlflow.store.tracking.sqlalchemy_store import SqlAlchemyStore

        SqlAlchemyStore._engine_map.clear()
        ModelRegistrySqlAlchemyStore._engine_map.clear()
        SqlAlchemyJobStore._engine_map.clear()
    except ImportError:
        pass
```

--------------------------------------------------------------------------------

---[FILE: generate_ui_test_data.py]---
Location: mlflow-master/tests/generate_ui_test_data.py

```python
"""
Small script used to generate mock data to test the UI.
"""

import argparse
import itertools
import random
import string
from random import random as rand

import mlflow
from mlflow import MlflowClient


def log_metrics(metrics):
    for k, values in metrics.items():
        for v in values:
            mlflow.log_metric(k, v)


def log_params(parameters):
    for k, v in parameters.items():
        mlflow.log_param(k, v)


def rand_str(max_len=40):
    return "".join(random.sample(string.ascii_letters, random.randint(1, max_len)))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--large",
        help="If true, will also generate larger datasets for testing UI performance.",
        action="store_true",
    )
    args = parser.parse_args()
    client = MlflowClient()
    # Simple run
    for l1, alpha in itertools.product([0, 0.25, 0.5, 0.75, 1], [0, 0.5, 1]):
        with mlflow.start_run(run_name="ipython"):
            parameters = {
                "l1": str(l1),
                "alpha": str(alpha),
            }
            metrics = {
                "MAE": [rand()],
                "R2": [rand()],
                "RMSE": [rand()],
            }
            log_params(parameters)
            log_metrics(metrics)

    # Runs with multiple values for a single metric so that we can QA the time-series metric
    # plot
    for i in range(3):
        with mlflow.start_run():
            for j in range(10):
                sign = random.choice([-1, 1])
                mlflow.log_metric(
                    "myReallyLongTimeSeriesMetricName-abcdefghijklmnopqrstuvwxyz",
                    random.random() * sign,
                )
                mlflow.log_metric("Another Timeseries Metric", rand() * sign)
                mlflow.log_metric("Yet Another Timeseries Metric", rand() * sign)
            if i == 0:
                mlflow.log_metric("Special Timeseries Metric", rand() * sign)
            mlflow.log_metric("Bar chart metric", rand())

    # Big parameter values
    with mlflow.start_run(run_name="ipython"):
        parameters = {
            "this is a pretty long parameter name": "NA10921-test_file_2018-08-10.txt",
        }
        metrics = {"grower": [i**1.2 for i in range(10)]}
        log_params(parameters)
        log_metrics(metrics)

    # Nested runs.
    with mlflow.start_run(run_name="multirun.py"):
        l1 = 0.5
        alpha = 0.5
        parameters = {
            "l1": str(l1),
            "alpha": str(alpha),
        }
        metrics = {
            "MAE": [rand()],
            "R2": [rand()],
            "RMSE": [rand()],
        }
        log_params(parameters)
        log_metrics(metrics)

        with mlflow.start_run(run_name="child_params.py", nested=True):
            parameters = {
                "lot": str(rand()),
                "of": str(rand()),
                "parameters": str(rand()),
                "in": str(rand()),
                "this": str(rand()),
                "experiment": str(rand()),
                "run": str(rand()),
                "because": str(rand()),
                "we": str(rand()),
                "need": str(rand()),
                "to": str(rand()),
                "check": str(rand()),
                "how": str(rand()),
                "it": str(rand()),
                "handles": str(rand()),
            }
            log_params(parameters)
            mlflow.log_metric("test_metric", 1)

        with mlflow.start_run(run_name="child_metrics.py", nested=True):
            metrics = {
                "lot": [rand()],
                "of": [rand()],
                "parameters": [rand()],
                "in": [rand()],
                "this": [rand()],
                "experiment": [rand()],
                "run": [rand()],
                "because": [rand()],
                "we": [rand()],
                "need": [rand()],
                "to": [rand()],
                "check": [rand()],
                "how": [rand()],
                "it": [rand()],
                "handles": [rand()],
            }
            log_metrics(metrics)

        with mlflow.start_run(run_name="sort_child.py", nested=True):
            mlflow.log_metric("test_metric", 1)
            mlflow.log_param("test_param", 1)

        with mlflow.start_run(run_name="sort_child.py", nested=True):
            mlflow.log_metric("test_metric", 2)
            mlflow.log_param("test_param", 2)

    # Grandchildren
    with mlflow.start_run(run_name="parent"):
        with mlflow.start_run(run_name="child", nested=True):
            with mlflow.start_run(run_name="grandchild", nested=True):
                pass

    # Loop
    loop_1_run_id = None
    loop_2_run_id = None
    with mlflow.start_run(run_name="loop-1") as run_1:
        with mlflow.start_run(run_name="loop-2", nested=True) as run_2:
            loop_1_run_id = run_1.info.run_id
            loop_2_run_id = run_2.info.run_id
    client.set_tag(loop_1_run_id, "mlflow.parentRunId", loop_2_run_id)

    # Lot's of children
    with mlflow.start_run(run_name="parent-with-lots-of-children"):
        for i in range(100):
            with mlflow.start_run(run_name=f"child-{i}", nested=True):
                pass
    mlflow.set_experiment("my-empty-experiment")
    mlflow.set_experiment("runs-but-no-metrics-params")
    for i in range(100):
        with mlflow.start_run(run_name=f"empty-run-{i}"):
            pass
    if args.large:
        mlflow.set_experiment("med-size-experiment")
        # Experiment with a mix of nested runs & non-nested runs
        for i in range(3):
            with mlflow.start_run(run_name=f"parent-with-children-{i}"):
                params = {rand_str(): rand_str() for _ in range(5)}
                metrics = {rand_str(): [rand()] for _ in range(5)}
                log_params(params)
                log_metrics(metrics)
                for j in range(10):
                    with mlflow.start_run(run_name=f"child-{j}", nested=True):
                        params = {rand_str(): rand_str() for _ in range(30)}
                        metrics = {rand_str(): [rand()] for idx in range(30)}
                        log_params(params)
                        log_metrics(metrics)
            for j in range(10):
                with mlflow.start_run(run_name=f"unnested-{i}-{j}"):
                    params = {rand_str(): rand_str() for _ in range(5)}
                    metrics = {rand_str(): [rand()] for _ in range(5)}
        mlflow.set_experiment("hitting-metric-param-limits")
        for i in range(50):
            with mlflow.start_run(run_name=f"big-run-{i}"):
                params = {str(j) + "a" * 250: "b" * 1000 for j in range(100)}
                metrics = {str(j) + "a" * 250: [rand()] for j in range(100)}
                log_metrics(metrics)
                log_params(params)
```

--------------------------------------------------------------------------------

````
