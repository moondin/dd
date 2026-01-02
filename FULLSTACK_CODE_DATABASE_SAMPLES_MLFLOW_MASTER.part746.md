---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 746
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 746 of 991)

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

---[FILE: virtualenv.py]---
Location: mlflow-master/mlflow/utils/virtualenv.py

```python
import logging
import os
import re
import shutil
import sys
import tempfile
import uuid
from pathlib import Path
from typing import Literal

from packaging.version import Version

import mlflow
from mlflow.environment_variables import _MLFLOW_TESTING, MLFLOW_ENV_ROOT
from mlflow.exceptions import MlflowException
from mlflow.models.model import MLMODEL_FILE_NAME, Model
from mlflow.utils import env_manager as em
from mlflow.utils.conda import _PIP_CACHE_DIR
from mlflow.utils.databricks_utils import is_in_databricks_runtime
from mlflow.utils.environment import (
    _CONDA_ENV_FILE_NAME,
    _PYTHON_ENV_FILE_NAME,
    _REQUIREMENTS_FILE_NAME,
    _get_mlflow_env_name,
    _PythonEnv,
)
from mlflow.utils.file_utils import remove_on_error
from mlflow.utils.os import is_windows
from mlflow.utils.process import _exec_cmd, _join_commands
from mlflow.utils.requirements_utils import _parse_requirements

_logger = logging.getLogger(__name__)


def _get_mlflow_virtualenv_root():
    """
    Returns the root directory to store virtualenv environments created by MLflow.
    """
    return MLFLOW_ENV_ROOT.get()


_DATABRICKS_PYENV_BIN_PATH = "/databricks/.pyenv/bin/pyenv"


def _is_pyenv_available():
    """
    Returns True if pyenv is available, otherwise False.
    """
    return _get_pyenv_bin_path() is not None


def _validate_pyenv_is_available():
    """
    Validates pyenv is available. If not, throws an `MlflowException` with a brief instruction on
    how to install pyenv.
    """
    url = (
        "https://github.com/pyenv/pyenv#installation"
        if not is_windows()
        else "https://github.com/pyenv-win/pyenv-win#installation"
    )
    if not _is_pyenv_available():
        raise MlflowException(
            f"Could not find the pyenv binary. See {url} for installation instructions."
        )


def _is_virtualenv_available():
    """
    Returns True if virtualenv is available, otherwise False.
    """
    return shutil.which("virtualenv") is not None


def _validate_virtualenv_is_available():
    """
    Validates virtualenv is available. If not, throws an `MlflowException` with a brief instruction
    on how to install virtualenv.
    """
    if not _is_virtualenv_available():
        raise MlflowException(
            "Could not find the virtualenv binary. Run `pip install virtualenv` to install "
            "virtualenv."
        )


_SEMANTIC_VERSION_REGEX = re.compile(r"^([0-9]+)\.([0-9]+)\.([0-9]+)$")


def _get_pyenv_bin_path():
    if os.path.exists(_DATABRICKS_PYENV_BIN_PATH):
        return _DATABRICKS_PYENV_BIN_PATH
    return shutil.which("pyenv")


def _find_latest_installable_python_version(version_prefix):
    """
    Find the latest installable python version that matches the given version prefix
    from the output of `pyenv install --list`. For example, `version_prefix("3.8")` returns '3.8.x'
    where 'x' represents the latest micro version in 3.8.
    """
    lines = _exec_cmd(
        [_get_pyenv_bin_path(), "install", "--list"],
        capture_output=True,
        shell=is_windows(),
    ).stdout.splitlines()
    semantic_versions = filter(_SEMANTIC_VERSION_REGEX.match, map(str.strip, lines))
    matched = [v for v in semantic_versions if v.startswith(version_prefix)]
    if not matched:
        raise MlflowException(f"Could not find python version that matches {version_prefix}")
    return max(matched, key=Version)


def _install_python(version, pyenv_root=None, capture_output=False):
    """Installs a specified version of python with pyenv and returns a path to the installed python
    binary.

    Args:
        version: Python version to install.
        pyenv_root: The value of the "PYENV_ROOT" environment variable used when running
            `pyenv install` which installs python in `{PYENV_ROOT}/versions/{version}`.
        capture_output: Set the `capture_output` argument when calling `_exec_cmd`.

    Returns:
        Path to the installed python binary.
    """
    version = (
        version
        if _SEMANTIC_VERSION_REGEX.match(version)
        else _find_latest_installable_python_version(version)
    )
    _logger.info("Installing python %s if it does not exist", version)
    # pyenv-win doesn't support `--skip-existing` but its behavior is enabled by default
    # https://github.com/pyenv-win/pyenv-win/pull/314
    pyenv_install_options = ("--skip-existing",) if not is_windows() else ()
    extra_env = {"PYENV_ROOT": pyenv_root} if pyenv_root else None
    pyenv_bin_path = _get_pyenv_bin_path()
    _exec_cmd(
        [pyenv_bin_path, "install", *pyenv_install_options, version],
        capture_output=capture_output,
        # Windows fails to find pyenv and throws `FileNotFoundError` without `shell=True`
        shell=is_windows(),
        extra_env=extra_env,
    )

    if not is_windows():
        if pyenv_root is None:
            pyenv_root = _exec_cmd([pyenv_bin_path, "root"], capture_output=True).stdout.strip()
        path_to_bin = ("bin", "python")
    else:
        # pyenv-win doesn't provide the `pyenv root` command
        pyenv_root = os.getenv("PYENV_ROOT")
        if pyenv_root is None:
            raise MlflowException("Environment variable 'PYENV_ROOT' must be set")
        path_to_bin = ("python.exe",)
    return Path(pyenv_root).joinpath("versions", version, *path_to_bin)


def _get_conda_env_file(model_config):
    from mlflow.pyfunc import _extract_conda_env

    for flavor, config in model_config.flavors.items():
        if flavor == mlflow.pyfunc.FLAVOR_NAME:
            if env := config.get(mlflow.pyfunc.ENV):
                return _extract_conda_env(env)
    return _CONDA_ENV_FILE_NAME


def _get_python_env_file(model_config):
    from mlflow.pyfunc import EnvType

    for flavor, config in model_config.flavors.items():
        if flavor == mlflow.pyfunc.FLAVOR_NAME:
            env = config.get(mlflow.pyfunc.ENV)
            if isinstance(env, dict):
                # Models saved in MLflow >= 2.0 use a dictionary for the pyfunc flavor
                # `env` config, where the keys are different environment managers (e.g.
                # conda, virtualenv) and the values are corresponding environment paths
                return env[EnvType.VIRTUALENV]
    return _PYTHON_ENV_FILE_NAME


def _get_python_env(local_model_path):
    """Constructs `_PythonEnv` from the model artifacts stored in `local_model_path`. If
    `python_env.yaml` is available, use it, otherwise extract model dependencies from `conda.yaml`.
    If `conda.yaml` contains conda dependencies except `python`, `pip`, `setuptools`, and, `wheel`,
    an `MlflowException` is thrown because conda dependencies cannot be installed in a virtualenv
    environment.

    Args:
        local_model_path: Local directory containing the model artifacts.

    Returns:
        `_PythonEnv` instance.

    """
    model_config = Model.load(local_model_path / MLMODEL_FILE_NAME)
    python_env_file = local_model_path / _get_python_env_file(model_config)
    conda_env_file = local_model_path / _get_conda_env_file(model_config)
    requirements_file = local_model_path / _REQUIREMENTS_FILE_NAME

    if python_env_file.exists():
        return _PythonEnv.from_yaml(python_env_file)
    else:
        _logger.info(
            "This model is missing %s, which is because it was logged in an older version"
            "of MLflow (< 1.26.0) that does not support restoring a model environment with "
            "virtualenv. Attempting to extract model dependencies from %s and %s instead.",
            _PYTHON_ENV_FILE_NAME,
            _REQUIREMENTS_FILE_NAME,
            _CONDA_ENV_FILE_NAME,
        )
        if requirements_file.exists():
            deps = _PythonEnv.get_dependencies_from_conda_yaml(conda_env_file)
            return _PythonEnv(
                python=deps["python"],
                build_dependencies=deps["build_dependencies"],
                dependencies=[f"-r {_REQUIREMENTS_FILE_NAME}"],
            )
        else:
            return _PythonEnv.from_conda_yaml(conda_env_file)


def _get_virtualenv_name(python_env, work_dir_path, env_id=None):
    requirements = _parse_requirements(
        python_env.dependencies,
        is_constraint=False,
        base_dir=work_dir_path,
    )
    return _get_mlflow_env_name(
        str(python_env) + "".join(map(str, sorted(requirements))) + (env_id or "")
    )


def _get_virtualenv_activate_cmd(env_dir: Path) -> str:
    # Created a command to activate the environment
    paths = ("bin", "activate") if not is_windows() else ("Scripts", "activate.bat")
    activate_cmd = env_dir.joinpath(*paths)
    return f"source {activate_cmd}" if not is_windows() else str(activate_cmd)


def _get_uv_env_creation_command(env_dir: str | Path, python_version: str) -> str:
    return ["uv", "venv", str(env_dir), f"--python={python_version}"]


def _create_virtualenv(
    local_model_path: Path,
    python_env: _PythonEnv,
    env_dir: Path,
    python_install_dir: str | None = None,
    env_manager: Literal["virtualenv", "uv"] = em.UV,
    extra_env: dict[str, str] | None = None,
    capture_output: bool = False,
    pip_requirements_override: list[str] | None = None,
):
    if env_manager not in {em.VIRTUALENV, em.UV}:
        raise MlflowException.invalid_parameter_value(
            f"Invalid value for `env_manager`: {env_manager}. "
            f"Must be one of `{em.VIRTUALENV}, {em.UV}`"
        )

    activate_cmd = _get_virtualenv_activate_cmd(env_dir)
    if env_dir.exists():
        _logger.info(f"Environment {env_dir} already exists")
        return activate_cmd

    env_creation_extra_env = {}
    if env_manager == em.VIRTUALENV:
        python_bin_path = _install_python(
            python_env.python, pyenv_root=python_install_dir, capture_output=capture_output
        )
        _logger.info(f"Creating a new environment in {env_dir} with {python_bin_path}")
        env_creation_cmd = [
            sys.executable,
            "-m",
            "virtualenv",
            "--python",
            python_bin_path,
            env_dir,
        ]
        install_deps_cmd_prefix = "python -m pip install"
    elif env_manager == em.UV:
        _logger.info(
            f"Creating a new environment in {env_dir} with python "
            f"version {python_env.python} using uv"
        )
        env_creation_cmd = _get_uv_env_creation_command(env_dir, python_env.python)
        install_deps_cmd_prefix = "uv pip install"
        if python_install_dir:
            # Setting `UV_PYTHON_INSTALL_DIR` to make `uv env` install python into
            # the directory it points to.
            env_creation_extra_env["UV_PYTHON_INSTALL_DIR"] = python_install_dir
        if _MLFLOW_TESTING.get():
            os.environ["RUST_LOG"] = "uv=debug"
    with remove_on_error(
        env_dir,
        onerror=lambda e: _logger.warning(
            "Encountered an unexpected error: %s while creating a virtualenv environment in %s, "
            "removing the environment directory...",
            repr(e),
            env_dir,
        ),
    ):
        _exec_cmd(
            env_creation_cmd,
            capture_output=capture_output,
            extra_env=env_creation_extra_env,
        )

        _logger.info("Installing dependencies")
        for deps in filter(None, [python_env.build_dependencies, python_env.dependencies]):
            with tempfile.TemporaryDirectory() as tmpdir:
                # Create a temporary requirements file in the model directory to resolve the
                # references in it correctly. To do this, we must first symlink or copy the model
                # directory's contents to a temporary location for compatibility with deployment
                # tools that store models in a read-only mount
                try:
                    for model_item in os.listdir(local_model_path):
                        os.symlink(
                            src=os.path.join(local_model_path, model_item),
                            dst=os.path.join(tmpdir, model_item),
                        )
                except Exception as e:
                    _logger.warning(
                        "Failed to symlink model directory during dependency installation"
                        " Copying instead. Exception: %s",
                        e,
                    )
                    _copy_model_to_writeable_destination(local_model_path, tmpdir)

                tmp_req_file = f"requirements.{uuid.uuid4().hex}.txt"
                Path(tmpdir).joinpath(tmp_req_file).write_text("\n".join(deps))
                cmd = _join_commands(activate_cmd, f"{install_deps_cmd_prefix} -r {tmp_req_file}")
                _exec_cmd(cmd, capture_output=capture_output, cwd=tmpdir, extra_env=extra_env)

        if pip_requirements_override:
            _logger.info(
                "Installing additional dependencies specified by "
                f"pip_requirements_override: {pip_requirements_override}"
            )
            cmd = _join_commands(
                activate_cmd,
                f"{install_deps_cmd_prefix} --quiet {' '.join(pip_requirements_override)}",
            )
            _exec_cmd(cmd, capture_output=capture_output, extra_env=extra_env)

        return activate_cmd


def _copy_model_to_writeable_destination(model_src, dst):
    """
    Copies the specified `model_src` directory, which may be read-only, to the writeable `dst`
    directory.
    """
    os.makedirs(dst, exist_ok=True)
    for model_item in os.listdir(model_src):
        # Copy individual files and subdirectories, rather than using `shutil.copytree()`
        # because `shutil.copytree()` will apply the permissions from the source directory,
        # which may be read-only
        copy_fn = shutil.copytree if os.path.isdir(model_item) else shutil.copy2

        copy_fn(
            src=os.path.join(model_src, model_item),
            dst=os.path.join(dst, model_item),
        )


def _get_virtualenv_extra_env_vars(env_root_dir=None):
    extra_env = {
        # PIP_NO_INPUT=1 makes pip run in non-interactive mode,
        # otherwise pip might prompt "yes or no" and ask stdin input
        "PIP_NO_INPUT": "1",
    }
    if env_root_dir is not None:
        # Note: Both conda pip and virtualenv can use the pip cache directory.
        extra_env["PIP_CACHE_DIR"] = os.path.join(env_root_dir, _PIP_CACHE_DIR)
    return extra_env


_VIRTUALENV_ENVS_DIR = "virtualenv_envs"
_PYENV_ROOT_DIR = "pyenv_root"


def _get_or_create_virtualenv(
    local_model_path,
    env_id=None,
    env_root_dir=None,
    capture_output=False,
    pip_requirements_override: list[str] | None = None,
    env_manager: Literal["virtualenv", "uv"] = em.UV,
    extra_envs: dict[str, str] | None = None,
):
    """Restores an MLflow model's environment in a virtual environment and returns a command
    to activate it.

    Args:
        local_model_path: Local directory containing the model artifacts.
        env_id: Optional string that is added to the contents of the yaml file before
            calculating the hash. It can be used to distinguish environments that have the
            same conda dependencies but are supposed to be different based on the context.
            For example, when serving the model we may install additional dependencies to the
            environment after the environment has been activated.
        pip_requirements_override: If specified, install the specified python dependencies to
            the environment (upgrade if already installed).
        env_manager: Specifies the environment manager to use to create the environment.
            Defaults to "uv".
        extra_envs: If specified, a dictionary of extra environment variables will be passed to the
            environment creation command.

            .. tip::
                It is highly recommended to use "uv" as it has significant performance improvements
                over "virtualenv".

    Returns:
        Command to activate the created virtual environment
        (e.g. "source /path/to/bin/activate").

    """
    if env_manager == em.VIRTUALENV:
        _validate_pyenv_is_available()
        _validate_virtualenv_is_available()

    local_model_path = Path(local_model_path)
    python_env = _get_python_env(local_model_path)

    if env_root_dir is None:
        virtual_envs_root_path = Path(_get_mlflow_virtualenv_root())
        python_install_dir = None
    else:
        virtual_envs_root_path = Path(env_root_dir) / _VIRTUALENV_ENVS_DIR
        pyenv_root_path = Path(env_root_dir) / _PYENV_ROOT_DIR
        pyenv_root_path.mkdir(parents=True, exist_ok=True)
        python_install_dir = str(pyenv_root_path)

    virtual_envs_root_path.mkdir(parents=True, exist_ok=True)
    env_name = _get_virtualenv_name(python_env, local_model_path, env_id)
    env_dir = virtual_envs_root_path / env_name
    try:
        env_dir.exists()
    except PermissionError:
        if is_in_databricks_runtime():
            # Updating env_name only doesn't work because the cluster may not have
            # permission to access the original virtual_envs_root_path
            virtual_envs_root_path = (
                Path(env_root_dir) / f"{_VIRTUALENV_ENVS_DIR}_{uuid.uuid4().hex[:8]}"
            )
            virtual_envs_root_path.mkdir(parents=True, exist_ok=True)
            env_dir = virtual_envs_root_path / env_name
        else:
            _logger.warning(
                f"Existing virtual environment directory {env_dir} cannot be accessed "
                "due to permission error. Check the permissions of the directory and "
                "try again. If the issue persists, consider cleaning up the directory manually."
            )
            raise

    extra_envs = extra_envs or {}
    extra_envs |= _get_virtualenv_extra_env_vars(env_root_dir)

    # Create an environment
    return _create_virtualenv(
        local_model_path=local_model_path,
        python_env=python_env,
        env_dir=env_dir,
        python_install_dir=python_install_dir,
        env_manager=env_manager,
        extra_env=extra_envs,
        capture_output=capture_output,
        pip_requirements_override=pip_requirements_override,
    )
```

--------------------------------------------------------------------------------

---[FILE: warnings_utils.py]---
Location: mlflow-master/mlflow/utils/warnings_utils.py

```python
import warnings

# ANSI escape code
ANSI_BASE = "\033["
COLORS = {
    "default_bold": f"{ANSI_BASE}1m",
    "red": f"{ANSI_BASE}31m",
    "red_bold": f"{ANSI_BASE}1;31m",
    "yellow": f"{ANSI_BASE}33m",
    "yellow_bold": f"{ANSI_BASE}1;33m",
    "blue": f"{ANSI_BASE}34m",
    "blue_bold": f"{ANSI_BASE}1;34m",
}
RESET = "\033[0m"


def color_warning(message: str, stacklevel: int, color: str, category: type[Warning] = UserWarning):
    if color in COLORS:
        message = f"{COLORS[color]}{message}{RESET}"

    warnings.warn(
        message=message,
        category=category,
        stacklevel=stacklevel + 1,
    )
```

--------------------------------------------------------------------------------

---[FILE: yaml_utils.py]---
Location: mlflow-master/mlflow/utils/yaml_utils.py

```python
import codecs
import os
import shutil
import tempfile

import yaml

from mlflow.utils.file_utils import ENCODING, exists, get_parent_dir

try:
    from yaml import CSafeDumper as YamlSafeDumper
    from yaml import CSafeLoader as YamlSafeLoader

except ImportError:
    from yaml import SafeDumper as YamlSafeDumper
    from yaml import SafeLoader as YamlSafeLoader

from mlflow.exceptions import MissingConfigException


def write_yaml(root, file_name, data, overwrite=False, sort_keys=True, ensure_yaml_extension=True):
    """Write dictionary data in yaml format.

    Args:
        root: Directory name.
        file_name: Desired file name.
        data: Data to be dumped as yaml format.
        overwrite: If True, will overwrite existing files.
        sort_keys: Whether to sort the keys when writing the yaml file.
        ensure_yaml_extension: If True, will automatically add .yaml extension if not given.
    """
    if not exists(root):
        raise MissingConfigException(f"Parent directory '{root}' does not exist.")

    file_path = os.path.join(root, file_name)
    yaml_file_name = file_path
    if ensure_yaml_extension and not file_path.endswith(".yaml"):
        yaml_file_name = file_path + ".yaml"

    if exists(yaml_file_name) and not overwrite:
        raise Exception(f"Yaml file '{file_path}' exists as '{yaml_file_name}")

    with codecs.open(yaml_file_name, mode="w", encoding=ENCODING) as yaml_file:
        yaml.dump(
            data,
            yaml_file,
            default_flow_style=False,
            allow_unicode=True,
            sort_keys=sort_keys,
            Dumper=YamlSafeDumper,
        )


def overwrite_yaml(root, file_name, data, ensure_yaml_extension=True):
    """Safely overwrites a preexisting yaml file, ensuring that file contents are not deleted or
    corrupted if the write fails. This is achieved by writing contents to a temporary file
    and moving the temporary file to replace the preexisting file, rather than opening the
    preexisting file for a direct write.

    Args:
        root: Directory name.
        file_name: File name.
        data: The data to write, represented as a dictionary.
        ensure_yaml_extension: If True, Will automatically add .yaml extension if not given.
    """
    tmp_file_path = None
    original_file_path = os.path.join(root, file_name)
    original_file_mode = os.stat(original_file_path).st_mode
    try:
        tmp_file_fd, tmp_file_path = tempfile.mkstemp(suffix="file.yaml")
        os.close(tmp_file_fd)
        write_yaml(
            root=get_parent_dir(tmp_file_path),
            file_name=os.path.basename(tmp_file_path),
            data=data,
            overwrite=True,
            sort_keys=True,
            ensure_yaml_extension=ensure_yaml_extension,
        )
        shutil.move(tmp_file_path, original_file_path)
        # restores original file permissions, see https://docs.python.org/3/library/tempfile.html#tempfile.mkstemp
        os.chmod(original_file_path, original_file_mode)
    finally:
        if tmp_file_path is not None and os.path.exists(tmp_file_path):
            os.remove(tmp_file_path)


def read_yaml(root, file_name):
    """Read data from yaml file and return as dictionary
    Args:
        root: Directory name.
        file_name: File name. Expects to have '.yaml' extension.

    Returns:
        Data in yaml file as dictionary.
    """
    if not exists(root):
        raise MissingConfigException(
            f"Cannot read '{file_name}'. Parent dir '{root}' does not exist."
        )

    file_path = os.path.join(root, file_name)
    if not exists(file_path):
        raise MissingConfigException(f"Yaml file '{file_path}' does not exist.")
    with codecs.open(file_path, mode="r", encoding=ENCODING) as yaml_file:
        return yaml.load(yaml_file, Loader=YamlSafeLoader)


class safe_edit_yaml:
    def __init__(self, root, file_name, edit_func):
        self._root = root
        self._file_name = file_name
        self._edit_func = edit_func
        self._original = read_yaml(root, file_name)

    def __enter__(self):
        new_dict = self._edit_func(self._original.copy())
        write_yaml(self._root, self._file_name, new_dict, overwrite=True)

    def __exit__(self, *args):
        write_yaml(self._root, self._file_name, self._original, overwrite=True)
```

--------------------------------------------------------------------------------

---[FILE: _capture_modules.py]---
Location: mlflow-master/mlflow/utils/_capture_modules.py

```python
"""
This script should be executed in a fresh python interpreter process using `subprocess`.
"""

import argparse
import builtins
import functools
import importlib
import json
import os
import sys

import mlflow
from mlflow.models.model import MLMODEL_FILE_NAME, Model
from mlflow.pyfunc import MAIN
from mlflow.utils._spark_utils import _prepare_subprocess_environ_for_creating_local_spark_session
from mlflow.utils.exception_utils import get_stacktrace
from mlflow.utils.file_utils import write_to
from mlflow.utils.requirements_utils import (
    DATABRICKS_MODULES_TO_PACKAGES,
    MLFLOW_MODULES_TO_PACKAGES,
)


def _get_top_level_module(full_module_name):
    return full_module_name.split(".")[0]


def _get_second_level_module(full_module_name):
    return ".".join(full_module_name.split(".")[:2])


class _CaptureImportedModules:
    """
    A context manager to capture imported modules by temporarily applying a patch to
    `builtins.__import__` and `importlib.import_module`.

    If `record_full_module` is set to `False`, it only captures top level modules
    for inferring python package purpose.
    If `record_full_module` is set to `True`, it captures full module name for all
    imported modules and sub-modules. This is used in automatic model code path inference.
    """

    def __init__(self, record_full_module=False):
        self.imported_modules = set()
        self.original_import = None
        self.original_import_module = None
        self.record_full_module = record_full_module

    def _wrap_import(self, original):
        @functools.wraps(original)
        def wrapper(name, globals=None, locals=None, fromlist=(), level=0):
            is_absolute_import = level == 0
            if not self.record_full_module and is_absolute_import:
                self._record_imported_module(name)

            result = original(name, globals, locals, fromlist, level)

            if self.record_full_module:
                if is_absolute_import:
                    parent_modules = name.split(".")
                else:
                    parent_modules = globals["__name__"].split(".")
                    if level > 1:
                        parent_modules = parent_modules[: -(level - 1)]

                if fromlist:
                    for from_name in fromlist:
                        full_modules = parent_modules + [from_name]
                        full_module_name = ".".join(full_modules)
                        if full_module_name in sys.modules:
                            self._record_imported_module(full_module_name)
                else:
                    full_module_name = ".".join(parent_modules)
                    self._record_imported_module(full_module_name)

            return result

        return wrapper

    def _wrap_import_module(self, original):
        @functools.wraps(original)
        def wrapper(name, *args, **kwargs):
            self._record_imported_module(name)
            return original(name, *args, **kwargs)

        return wrapper

    def _record_imported_module(self, full_module_name):
        if self.record_full_module:
            self.imported_modules.add(full_module_name)
            return

        # If the module is an internal module (prefixed by "_") or is the "databricks"
        # module, which is populated by many different packages, don't record it (specific
        # module imports within the databricks namespace are still recorded and mapped to
        # their corresponding packages)
        if full_module_name.startswith("_") or full_module_name == "databricks":
            return

        top_level_module = _get_top_level_module(full_module_name)
        second_level_module = _get_second_level_module(full_module_name)

        if top_level_module == "databricks":
            # Multiple packages populate the `databricks` module namespace on Databricks;
            # to avoid bundling extraneous Databricks packages into model dependencies, we
            # scope each module to its relevant package
            if second_level_module in DATABRICKS_MODULES_TO_PACKAGES:
                self.imported_modules.add(second_level_module)
                return

            for databricks_module in DATABRICKS_MODULES_TO_PACKAGES:
                if full_module_name.startswith(databricks_module):
                    self.imported_modules.add(databricks_module)
                    return

        # special casing for mlflow extras since they may not be required by default
        if top_level_module == "mlflow":
            if second_level_module in MLFLOW_MODULES_TO_PACKAGES:
                self.imported_modules.add(second_level_module)
                return

        self.imported_modules.add(top_level_module)

    def __enter__(self):
        # Patch `builtins.__import__` and `importlib.import_module`
        self.original_import = builtins.__import__
        self.original_import_module = importlib.import_module
        builtins.__import__ = self._wrap_import(self.original_import)
        importlib.import_module = self._wrap_import_module(self.original_import_module)
        return self

    def __exit__(self, *_, **__):
        # Revert the patches
        builtins.__import__ = self.original_import
        importlib.import_module = self.original_import_module


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--model-path", required=True)
    parser.add_argument("--flavor", required=True)
    parser.add_argument("--output-file", required=True)
    parser.add_argument("--sys-path", required=True)
    parser.add_argument("--module-to-throw", required=False)
    parser.add_argument("--error-file", required=False)
    parser.add_argument("--record-full-module", default=False, action="store_true")
    return parser.parse_args()


def store_imported_modules(
    cap_cm, model_path, flavor, output_file, error_file=None, record_full_module=False
):
    # If `model_path` refers to an MLflow model directory, load the model using
    # `mlflow.pyfunc.load_model`
    if os.path.isdir(model_path) and MLMODEL_FILE_NAME in os.listdir(model_path):
        mlflow_model = Model.load(model_path)
        pyfunc_conf = mlflow_model.flavors.get(mlflow.pyfunc.FLAVOR_NAME)
        input_example = mlflow_model.load_input_example(model_path)
        params = mlflow_model.load_input_example_params(model_path)

        def load_model_and_predict(original_load_fn, *args, **kwargs):
            model = original_load_fn(*args, **kwargs)
            if input_example is not None:
                try:
                    model.predict(input_example, params=params)
                except Exception as e:
                    if error_file:
                        stack_trace = get_stacktrace(e)
                        write_to(
                            error_file,
                            "Failed to run predict on input_example, dependencies "
                            "introduced in predict are not captured.\n" + stack_trace,
                        )
                    else:
                        raise e
            return model

        if record_full_module:
            # Note: if we want to record all imported modules
            # (for inferring code_paths purpose),
            # The `importlib.import_module(pyfunc_conf[MAIN])` invocation
            # must be wrapped with `cap_cm` context manager,
            # because `pyfunc_conf[MAIN]` might also be a module loaded from
            # code_paths.
            with cap_cm:
                # `mlflow.pyfunc.load_model` internally invokes
                # `importlib.import_module(pyfunc_conf[MAIN])`
                mlflow.pyfunc.load_model(model_path)
        else:
            loader_module = importlib.import_module(pyfunc_conf[MAIN])
            original = loader_module._load_pyfunc

            @functools.wraps(original)
            def _load_pyfunc_patch(*args, **kwargs):
                with cap_cm:
                    return load_model_and_predict(original, *args, **kwargs)

            loader_module._load_pyfunc = _load_pyfunc_patch
            try:
                mlflow.pyfunc.load_model(model_path)
            finally:
                loader_module._load_pyfunc = original
    # Otherwise, load the model using `mlflow.<flavor>._load_pyfunc`.
    # For models that don't contain pyfunc flavor (e.g. scikit-learn estimator
    # that doesn't implement a `predict` method),
    # we need to directly pass a model data path to this script.
    else:
        with cap_cm:
            importlib.import_module(f"mlflow.{flavor}")._load_pyfunc(model_path)

    # Store the imported modules in `output_file`
    write_to(output_file, "\n".join(cap_cm.imported_modules))


def main():
    args = parse_args()
    model_path = args.model_path
    flavor = args.flavor
    output_file = args.output_file
    error_file = args.error_file
    # Mirror `sys.path` of the parent process
    sys.path = json.loads(args.sys_path)

    if flavor == mlflow.spark.FLAVOR_NAME:
        # Create a local spark environment within the subprocess
        from mlflow.utils._spark_utils import _create_local_spark_session_for_loading_spark_model

        _prepare_subprocess_environ_for_creating_local_spark_session()
        _create_local_spark_session_for_loading_spark_model()

    cap_cm = _CaptureImportedModules(record_full_module=args.record_full_module)
    store_imported_modules(
        cap_cm,
        model_path,
        flavor,
        output_file,
        error_file,
        record_full_module=args.record_full_module,
    )

    # Clean up a spark session created by `mlflow.spark._load_pyfunc`
    if flavor == mlflow.spark.FLAVOR_NAME:
        from mlflow.utils._spark_utils import _get_active_spark_session

        if spark := _get_active_spark_session():
            try:
                spark.stop()
            except Exception:
                # Swallow unexpected exceptions
                pass


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: _capture_transformers_modules.py]---
Location: mlflow-master/mlflow/utils/_capture_transformers_modules.py

```python
"""
This script should be executed in a fresh python interpreter process using `subprocess`.
"""

import json
import os
import sys

import mlflow
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE
from mlflow.utils._capture_modules import (
    _CaptureImportedModules,
    parse_args,
    store_imported_modules,
)


class _CaptureImportedModulesForHF(_CaptureImportedModules):
    """
    A context manager to capture imported modules by temporarily applying a patch to
    `builtins.__import__` and `importlib.import_module`.
    Used for 'transformers' flavor only.
    """

    def __init__(self, module_to_throw, record_full_module=False):
        super().__init__(record_full_module=record_full_module)
        self.module_to_throw = module_to_throw

    def _record_imported_module(self, full_module_name):
        if full_module_name == self.module_to_throw or full_module_name.startswith(
            f"{self.module_to_throw}."
        ):
            raise ImportError(f"Disabled package {full_module_name}")
        return super()._record_imported_module(full_module_name)


def main():
    args = parse_args()
    model_path = args.model_path
    flavor = args.flavor
    output_file = args.output_file
    module_to_throw = args.module_to_throw
    # Mirror `sys.path` of the parent process
    sys.path = json.loads(args.sys_path)

    if flavor != mlflow.transformers.FLAVOR_NAME:
        raise MlflowException(
            f"This script is only applicable to '{mlflow.transformers.FLAVOR_NAME}' flavor, "
            "if you're applying other flavors, please use _capture_modules script.",
        )

    if module_to_throw == "":
        raise MlflowException("Please specify the module to throw.")
    elif module_to_throw == "tensorflow":
        if os.environ.get("USE_TORCH", None) != "TRUE":
            raise MlflowException(
                "The environment variable USE_TORCH has to be set to TRUE to disable Tensorflow.",
                error_code=INVALID_PARAMETER_VALUE,
            )
    elif module_to_throw == "torch":
        if os.environ.get("USE_TF", None) != "TRUE":
            raise MlflowException(
                "The environment variable USE_TF has to be set to TRUE to disable Pytorch.",
                error_code=INVALID_PARAMETER_VALUE,
            )

    cap_cm = _CaptureImportedModulesForHF(
        module_to_throw, record_full_module=args.record_full_module
    )
    store_imported_modules(cap_cm, model_path, flavor, output_file)


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

````
