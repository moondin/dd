---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 738
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 738 of 991)

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

---[FILE: name_utils.py]---
Location: mlflow-master/mlflow/utils/name_utils.py

```python
import random
import uuid

_EXPERIMENT_ID_FIXED_WIDTH = 18


def _generate_unique_integer_id():
    """Utility function for generating a random fixed-length integer

    Args:
        id_length: The target length of the string representation of the integer without
            leading zeros

    Returns:
        a fixed-width integer
    """

    random_int = uuid.uuid4().int
    # Cast to string to get a fixed length
    random_str = str(random_int)[-_EXPERIMENT_ID_FIXED_WIDTH:]
    # append a random int as string to the end of the generated string for as many
    # leading zeros exist in the generated string in order to preserve the total length
    # once cast back to int
    for s in random_str:
        if s == "0":
            random_str = random_str + str(random.randint(0, 9))
        else:
            break
    return int(random_str)


def _generate_string(sep, integer_scale):
    predicate = random.choice(_GENERATOR_PREDICATES).lower()
    noun = random.choice(_GENERATOR_NOUNS).lower()
    num = random.randint(0, 10**integer_scale)
    return f"{predicate}{sep}{noun}{sep}{num}"


def _generate_random_name(sep="-", integer_scale=3, max_length=20):
    """Helper function for generating a random predicate, noun, and integer combination

    Args:
        sep: String separator for word spacing.
        integer_scale: Dictates the maximum scale range for random integer sampling (power of 10).
        max_length: Maximum allowable string length.

    Returns:
        A random string phrase comprised of a predicate, noun, and random integer.

    """
    name = None
    for _ in range(10):
        name = _generate_string(sep, integer_scale)
        if len(name) <= max_length:
            return name
    # If the combined length isn't below the threshold after 10 iterations, truncate it.
    return name[:max_length]


_GENERATOR_NOUNS = [
    "ant",
    "ape",
    "asp",
    "auk",
    "bass",
    "bat",
    "bear",
    "bee",
    "bird",
    "boar",
    "bug",
    "calf",
    "carp",
    "cat",
    "chimp",
    "cod",
    "colt",
    "conch",
    "cow",
    "crab",
    "crane",
    "croc",
    "crow",
    "cub",
    "deer",
    "doe",
    "dog",
    "dolphin",
    "donkey",
    "dove",
    "duck",
    "eel",
    "elk",
    "fawn",
    "finch",
    "fish",
    "flea",
    "fly",
    "foal",
    "fowl",
    "fox",
    "frog",
    "gnat",
    "gnu",
    "goat",
    "goose",
    "grouse",
    "grub",
    "gull",
    "hare",
    "hawk",
    "hen",
    "hog",
    "horse",
    "hound",
    "jay",
    "kit",
    "kite",
    "koi",
    "lamb",
    "lark",
    "loon",
    "lynx",
    "mare",
    "midge",
    "mink",
    "mole",
    "moose",
    "moth",
    "mouse",
    "mule",
    "newt",
    "owl",
    "ox",
    "panda",
    "penguin",
    "perch",
    "pig",
    "pug",
    "quail",
    "ram",
    "rat",
    "ray",
    "robin",
    "roo",
    "rook",
    "seal",
    "shad",
    "shark",
    "sheep",
    "shoat",
    "shrew",
    "shrike",
    "shrimp",
    "skink",
    "skunk",
    "sloth",
    "slug",
    "smelt",
    "snail",
    "snake",
    "snipe",
    "sow",
    "sponge",
    "squid",
    "squirrel",
    "stag",
    "steed",
    "stoat",
    "stork",
    "swan",
    "tern",
    "toad",
    "trout",
    "turtle",
    "vole",
    "wasp",
    "whale",
    "wolf",
    "worm",
    "wren",
    "yak",
    "zebra",
]

_GENERATOR_PREDICATES = [
    "abundant",
    "able",
    "abrasive",
    "adorable",
    "adaptable",
    "adventurous",
    "aged",
    "agreeable",
    "ambitious",
    "amazing",
    "amusing",
    "angry",
    "auspicious",
    "awesome",
    "bald",
    "beautiful",
    "bemused",
    "bedecked",
    "big",
    "bittersweet",
    "blushing",
    "bold",
    "bouncy",
    "brawny",
    "bright",
    "burly",
    "bustling",
    "calm",
    "capable",
    "carefree",
    "capricious",
    "caring",
    "casual",
    "charming",
    "chill",
    "classy",
    "clean",
    "clumsy",
    "colorful",
    "crawling",
    "dapper",
    "debonair",
    "dashing",
    "defiant",
    "delicate",
    "delightful",
    "dazzling",
    "efficient",
    "enchanting",
    "entertaining",
    "enthused",
    "exultant",
    "fearless",
    "flawless",
    "fortunate",
    "fun",
    "funny",
    "gaudy",
    "gentle",
    "gifted",
    "glamorous",
    "grandiose",
    "gregarious",
    "handsome",
    "hilarious",
    "honorable",
    "illustrious",
    "incongruous",
    "indecisive",
    "industrious",
    "intelligent",
    "inquisitive",
    "intrigued",
    "invincible",
    "judicious",
    "kindly",
    "languid",
    "learned",
    "legendary",
    "likeable",
    "loud",
    "luminous",
    "luxuriant",
    "lyrical",
    "magnificent",
    "marvelous",
    "masked",
    "melodic",
    "merciful",
    "mercurial",
    "monumental",
    "mysterious",
    "nebulous",
    "nervous",
    "nimble",
    "nosy",
    "omniscient",
    "orderly",
    "overjoyed",
    "peaceful",
    "painted",
    "persistent",
    "placid",
    "polite",
    "popular",
    "powerful",
    "puzzled",
    "rambunctious",
    "rare",
    "rebellious",
    "respected",
    "resilient",
    "righteous",
    "receptive",
    "redolent",
    "resilient",
    "rogue",
    "rumbling",
    "salty",
    "sassy",
    "secretive",
    "selective",
    "sedate",
    "serious",
    "shivering",
    "skillful",
    "sincere",
    "skittish",
    "silent",
    "smiling",
    "sneaky",
    "sophisticated",
    "spiffy",
    "stately",
    "suave",
    "stylish",
    "tasteful",
    "thoughtful",
    "thundering",
    "traveling",
    "treasured",
    "trusting",
    "unequaled",
    "upset",
    "unique",
    "unleashed",
    "useful",
    "upbeat",
    "unruly",
    "valuable",
    "vaunted",
    "victorious",
    "welcoming",
    "whimsical",
    "wistful",
    "wise",
    "worried",
    "youthful",
    "zealous",
]
```

--------------------------------------------------------------------------------

---[FILE: nfs_on_spark.py]---
Location: mlflow-master/mlflow/utils/nfs_on_spark.py

```python
import os
import shutil
import uuid

from mlflow.utils._spark_utils import _get_active_spark_session
from mlflow.utils.databricks_utils import (
    get_databricks_nfs_temp_dir,
    is_databricks_connect,
    is_in_databricks_runtime,
    is_in_databricks_serverless_runtime,
)

# Set spark config "spark.mlflow.nfs.rootDir" to specify a NFS (network file system) directory
# which is shared with all spark cluster nodes.
# This will help optimize routine of distributing spark driver files to remote workers.
# None represent no NFS directory available.
# Note:
#  1. If NFS directory set, you must ensure all spark cluster nodes using the same hardware and
#  installed the same OS with the same environment configured, because mlflow uses NFS directory
#  to distribute driver side virtual environment to remote workers if NFS available, heterogeneous
#  cluster nodes might cause issues under the case.
#  2. The NFS directory must be mounted before importing mlflow.
#  3. For databricks users, don't set this config, databricks product sets up internal NFS service
#  automatically.
_NFS_CACHE_ROOT_DIR = None


def get_nfs_cache_root_dir():
    if is_in_databricks_runtime():
        spark_sess = _get_active_spark_session()
        if is_in_databricks_serverless_runtime():
            # Databricks Serverless runtime VM can't access NFS.
            nfs_enabled = False
        else:
            nfs_enabled = spark_sess and (
                spark_sess.conf.get("spark.databricks.mlflow.nfs.enabled", "true").lower() == "true"
            )
        if nfs_enabled:
            try:
                return get_databricks_nfs_temp_dir()
            except Exception:
                nfs_root_dir = "/local_disk0/.ephemeral_nfs"
                # Test whether the NFS directory is writable.
                test_path = os.path.join(nfs_root_dir, uuid.uuid4().hex)
                try:
                    os.makedirs(test_path)
                    return nfs_root_dir
                except Exception:
                    # For databricks cluster enabled Table ACL, we have no permission to access NFS
                    # directory, in this case, return None, meaning NFS is not available.
                    return None
                finally:
                    shutil.rmtree(test_path, ignore_errors=True)
        else:
            return None
    else:
        spark_session = _get_active_spark_session()
        if is_databricks_connect(spark_session):
            # Remote spark connect client can't access Databricks Serverless cluster NFS.
            return None
        if spark_session is not None:
            return spark_session.conf.get("spark.mlflow.nfs.rootDir", None)
```

--------------------------------------------------------------------------------

---[FILE: openai_utils.py]---
Location: mlflow-master/mlflow/utils/openai_utils.py

```python
import os
import time
from enum import Enum
from typing import NamedTuple

import mlflow

REQUEST_URL_CHAT = "https://api.openai.com/v1/chat/completions"
REQUEST_URL_COMPLETIONS = "https://api.openai.com/v1/completions"
REQUEST_URL_EMBEDDINGS = "https://api.openai.com/v1/embeddings"

REQUEST_FIELDS_CHAT = {
    "model",
    "messages",
    "frequency_penalty",
    "logit_bias",
    "max_tokens",
    "n",
    "presence_penalty",
    "response_format",
    "seed",
    "stop",
    "stream",
    "temperature",
    "top_p",
    "tools",
    "tool_choice",
    "user",
    "function_call",
    "functions",
}
REQUEST_FIELDS_COMPLETIONS = {
    "model",
    "prompt",
    "best_of",
    "echo",
    "frequency_penalty",
    "logit_bias",
    "logprobs",
    "max_tokens",
    "n",
    "presence_penalty",
    "seed",
    "stop",
    "stream",
    "suffix",
    "temperature",
    "top_p",
    "user",
}
REQUEST_FIELDS_EMBEDDINGS = {"input", "model", "encoding_format", "user"}
REQUEST_FIELDS = REQUEST_FIELDS_CHAT | REQUEST_FIELDS_COMPLETIONS | REQUEST_FIELDS_EMBEDDINGS


def _validate_model_params(task, model, params):
    if not params:
        return

    if any(key in model for key in params):
        raise mlflow.MlflowException.invalid_parameter_value(
            f"Providing any of {list(model.keys())} as parameters in the signature is not "
            "allowed because they were indicated as part of the OpenAI model. Either remove "
            "the argument when logging the model or remove the parameter from the signature.",
        )
    if "batch_size" in params and task == "chat.completions":
        raise mlflow.MlflowException.invalid_parameter_value(
            "Parameter `batch_size` is not supported for task `chat.completions`"
        )


class _OAITokenHolder:
    def __init__(self, api_type):
        self._credential = None
        self._api_type = api_type
        self._is_azure_ad = api_type in ("azure_ad", "azuread")
        self._azure_ad_token = None
        self._api_token_env = os.environ.get("OPENAI_API_KEY")

        if self._is_azure_ad and not self._api_token_env:
            try:
                from azure.identity import DefaultAzureCredential
            except ImportError:
                raise mlflow.MlflowException(
                    "Using API type `azure_ad` or `azuread` requires the package"
                    " `azure-identity` to be installed."
                )
            self._credential = DefaultAzureCredential()

    @property
    def token(self):
        return self._api_token_env or self._azure_ad_token.token

    def refresh(self, logger=None):
        """Validates the token or API key configured for accessing the OpenAI resource."""

        if self._api_token_env is not None:
            return

        if self._is_azure_ad:
            if not self._azure_ad_token or self._azure_ad_token.expires_on < time.time() + 60:
                from azure.core.exceptions import ClientAuthenticationError

                if logger:
                    logger.debug(
                        "Token for Azure AD is either expired or unset. Attempting to "
                        "acquire a new token."
                    )
                try:
                    self._azure_ad_token = self._credential.get_token(
                        "https://cognitiveservices.azure.com/.default"
                    )
                except ClientAuthenticationError as err:
                    raise mlflow.MlflowException(
                        "Unable to acquire a valid Azure AD token for the resource due to "
                        f"the following error: {err.message}"
                    ) from err

            if logger:
                logger.debug("Token refreshed successfully")
        else:
            raise mlflow.MlflowException(
                "OpenAI API key must be set in the ``OPENAI_API_KEY`` environment variable."
            )


class _OpenAIApiConfig(NamedTuple):
    api_type: str
    batch_size: int
    max_requests_per_minute: int
    max_tokens_per_minute: int
    api_version: str | None
    api_base: str
    deployment_id: str | None
    organization: str | None = None
    max_retries: int = 5
    timeout: float = 60.0


# See https://github.com/openai/openai-python/blob/cf03fe16a92cd01f2a8867537399c12e183ba58e/openai/__init__.py#L30-L38
# for the list of environment variables that openai-python uses
class _OpenAIEnvVar(str, Enum):
    OPENAI_API_TYPE = "OPENAI_API_TYPE"
    OPENAI_BASE_URL = "OPENAI_BASE_URL"
    OPENAI_API_BASE = "OPENAI_API_BASE"
    OPENAI_API_KEY = "OPENAI_API_KEY"
    OPENAI_API_KEY_PATH = "OPENAI_API_KEY_PATH"
    OPENAI_API_VERSION = "OPENAI_API_VERSION"
    OPENAI_ORGANIZATION = "OPENAI_ORGANIZATION"
    OPENAI_ENGINE = "OPENAI_ENGINE"
    # use deployment_name instead of deployment_id to be
    # consistent with gateway
    OPENAI_DEPLOYMENT_NAME = "OPENAI_DEPLOYMENT_NAME"

    @property
    def secret_key(self):
        return self.value.lower()

    @classmethod
    def read_environ(cls):
        env_vars = {}
        for e in _OpenAIEnvVar:
            if value := os.getenv(e.value):
                env_vars[e.value] = value
        return env_vars
```

--------------------------------------------------------------------------------

---[FILE: os.py]---
Location: mlflow-master/mlflow/utils/os.py

```python
import os


def is_windows():
    """
    Returns true if the local system/OS name is Windows.

    Returns:
        True if the local system/OS name is Windows.

    """
    return os.name == "nt"
```

--------------------------------------------------------------------------------

---[FILE: oss_registry_utils.py]---
Location: mlflow-master/mlflow/utils/oss_registry_utils.py

```python
import urllib.parse

from mlflow.environment_variables import MLFLOW_UC_OSS_TOKEN
from mlflow.exceptions import MlflowException
from mlflow.utils.databricks_utils import get_databricks_host_creds
from mlflow.utils.rest_utils import MlflowHostCreds
from mlflow.utils.uri import (
    _DATABRICKS_UNITY_CATALOG_SCHEME,
)


def get_oss_host_creds(server_uri=None):
    """
    Retrieve the host credentials for the OSS server.

    Args:
        server_uri (str): The URI of the server.

    Returns:
        MlflowHostCreds: The host credentials for the OSS server.
    """
    parsed_uri = urllib.parse.urlparse(server_uri)

    if parsed_uri.scheme != "uc":
        raise MlflowException("The scheme of the server_uri should be 'uc'")

    if parsed_uri.path == _DATABRICKS_UNITY_CATALOG_SCHEME:
        return get_databricks_host_creds(parsed_uri.path)
    return MlflowHostCreds(host=parsed_uri.path, token=MLFLOW_UC_OSS_TOKEN.get())
```

--------------------------------------------------------------------------------

---[FILE: plugins.py]---
Location: mlflow-master/mlflow/utils/plugins.py

```python
import importlib.metadata


def _get_entry_points(group: str) -> list[importlib.metadata.EntryPoint]:
    return importlib.metadata.entry_points(group=group)


def get_entry_points(group: str) -> list[importlib.metadata.EntryPoint]:
    return _get_entry_points(group)
```

--------------------------------------------------------------------------------

---[FILE: process.py]---
Location: mlflow-master/mlflow/utils/process.py

```python
import functools
import os
import subprocess
import sys

from mlflow.utils.databricks_utils import is_in_databricks_runtime
from mlflow.utils.os import is_windows


class ShellCommandException(Exception):
    @classmethod
    def from_completed_process(cls, process):
        lines = [
            f"Non-zero exit code: {process.returncode}",
            f"Command: {process.args}",
        ]
        if process.stdout:
            lines += [
                "",
                "STDOUT:",
                process.stdout,
            ]
        if process.stderr:
            lines += [
                "",
                "STDERR:",
                process.stderr,
            ]
        return cls("\n".join(lines))


def _remove_inaccessible_python_path(env):
    """
    Remove inaccessible path from PYTHONPATH environment variable.
    """
    if python_path := env.get("PYTHONPATH"):
        paths = [p for p in python_path.split(":") if os.access(p, os.R_OK)]
        env["PYTHONPATH"] = ":".join(paths)
    return env


def _exec_cmd(
    cmd,
    *,
    throw_on_error=True,
    extra_env=None,
    capture_output=True,
    synchronous=True,
    stream_output=False,
    **kwargs,
):
    """A convenience wrapper of `subprocess.Popen` for running a command from a Python script.

    Args:
        cmd: The command to run, as a string or a list of strings.
        throw_on_error: If True, raises an Exception if the exit code of the program is nonzero.
        extra_env: Extra environment variables to be defined when running the child process.
            If this argument is specified, `kwargs` cannot contain `env`.
        capture_output: If True, stdout and stderr will be captured and included in an exception
            message on failure; if False, these streams won't be captured.
        synchronous: If True, wait for the command to complete and return a CompletedProcess
            instance, If False, does not wait for the command to complete and return
            a Popen instance, and ignore the `throw_on_error` argument.
        stream_output: If True, stream the command's stdout and stderr to `sys.stdout`
            as a unified stream during execution.
            If False, do not stream the command's stdout and stderr to `sys.stdout`.
        kwargs: Keyword arguments (except `text`) passed to `subprocess.Popen`.

    Returns:
        If synchronous is True, return a `subprocess.CompletedProcess` instance,
        otherwise return a Popen instance.

    """

    if illegal_kwargs := set(kwargs.keys()).intersection({"text"}):
        raise ValueError(f"`kwargs` cannot contain {list(illegal_kwargs)}")

    env = kwargs.pop("env", None)
    if extra_env is not None and env is not None:
        raise ValueError("`extra_env` and `env` cannot be used at the same time")

    if capture_output and stream_output:
        raise ValueError(
            "`capture_output=True` and `stream_output=True` cannot be specified at the same time"
        )

    # Copy current `os.environ` or passed in `env` to avoid mutating it.
    env = env or os.environ.copy()
    if extra_env is not None:
        env.update(extra_env)

    if is_in_databricks_runtime():
        # in databricks runtime, the PYTHONPATH might contain inaccessible path
        # which causes virtualenv python environment creation subprocess failure.
        # as a workaround, we remove inaccessible path out of python path.
        env = _remove_inaccessible_python_path(env)

    # In Python < 3.8, `subprocess.Popen` doesn't accept a command containing path-like
    # objects (e.g. `["ls", pathlib.Path("abc")]`) on Windows. To avoid this issue,
    # stringify all elements in `cmd`. Note `str(pathlib.Path("abc"))` returns 'abc'.
    if isinstance(cmd, list):
        cmd = list(map(str, cmd))

    if capture_output or stream_output:
        if kwargs.get("stdout") is not None or kwargs.get("stderr") is not None:
            raise ValueError(
                "stdout and stderr arguments may not be used with capture_output or stream_output"
            )
        kwargs["stdout"] = subprocess.PIPE
        if capture_output:
            kwargs["stderr"] = subprocess.PIPE
        elif stream_output:
            # Redirect stderr to stdout in order to combine the streams for unified printing to
            # `sys.stdout`, as documented in
            # https://docs.python.org/3/library/subprocess.html#subprocess.run
            kwargs["stderr"] = subprocess.STDOUT

    process = subprocess.Popen(
        cmd,
        env=env,
        text=True,
        **kwargs,
    )
    if not synchronous:
        return process

    if stream_output:
        for output_char in iter(lambda: process.stdout.read(1), ""):
            sys.stdout.write(output_char)

    stdout, stderr = process.communicate()
    returncode = process.poll()
    comp_process = subprocess.CompletedProcess(
        process.args,
        returncode=returncode,
        stdout=stdout,
        stderr=stderr,
    )
    if throw_on_error and returncode != 0:
        raise ShellCommandException.from_completed_process(comp_process)
    return comp_process


def _join_commands(*commands):
    entry_point = ["bash", "-c"] if not is_windows() else ["cmd", "/c"]
    sep = " && " if not is_windows() else " & "
    return [*entry_point, sep.join(map(str, commands))]


# A global map storing (function, args_tuple) --> (value, pid)
_per_process_value_cache_map = {}


def cache_return_value_per_process(fn):
    """
    A decorator which globally caches the return value of the decorated function.
    But if current process forked out a new child process, in child process,
    old cache values are invalidated.

    Restrictions: The decorated function must be called with only positional arguments,
    and all the argument values must be hashable.
    """

    @functools.wraps(fn)
    def wrapped_fn(*args, **kwargs):
        if len(kwargs) > 0:
            raise ValueError(
                "The function decorated by `cache_return_value_per_process` is not allowed to be "
                "called with key-word style arguments."
            )
        if (fn, args) in _per_process_value_cache_map:
            prev_value, prev_pid = _per_process_value_cache_map.get((fn, args))
            if os.getpid() == prev_pid:
                return prev_value

        new_value = fn(*args)
        new_pid = os.getpid()
        _per_process_value_cache_map[(fn, args)] = (new_value, new_pid)
        return new_value

    return wrapped_fn
```

--------------------------------------------------------------------------------

---[FILE: promptlab_utils.py]---
Location: mlflow-master/mlflow/utils/promptlab_utils.py

```python
import json
import os
import tempfile
import time
from datetime import datetime, timezone

from mlflow.entities.param import Param
from mlflow.entities.run_status import RunStatus
from mlflow.entities.run_tag import RunTag
from mlflow.utils.file_utils import make_containing_dirs, write_to
from mlflow.utils.mlflow_tags import MLFLOW_LOGGED_ARTIFACTS, MLFLOW_RUN_SOURCE_TYPE
from mlflow.version import VERSION as __version__


def create_eval_results_json(prompt_parameters, model_input, model_output_parameters, model_output):
    columns = [param.key for param in prompt_parameters] + ["prompt", "output"]
    data = [param.value for param in prompt_parameters] + [model_input, model_output]

    updated_columns = columns + [param.key for param in model_output_parameters]
    updated_data = data + [param.value for param in model_output_parameters]

    eval_results = {"columns": updated_columns, "data": [updated_data]}

    return json.dumps(eval_results)


def _create_promptlab_run_impl(
    store,
    experiment_id: str,
    run_name: str,
    tags: list[RunTag],
    prompt_template: str,
    prompt_parameters: list[Param],
    model_route: str,
    model_parameters: list[Param],
    model_input: str,
    model_output_parameters: list[Param],
    model_output: str,
    mlflow_version: str,
    user_id: str,
    start_time: str,
):
    run = store.create_run(experiment_id, user_id, start_time, tags, run_name)
    run_id = run.info.run_id

    try:
        prompt_parameters = [
            Param(key=param.key, value=str(param.value)) for param in prompt_parameters
        ]
        model_parameters = [
            Param(key=param.key, value=str(param.value)) for param in model_parameters
        ]
        model_output_parameters = [
            Param(key=param.key, value=str(param.value)) for param in model_output_parameters
        ]

        # log model parameters
        parameters_to_log = [
            *model_parameters,
            Param("model_route", model_route),
            Param("prompt_template", prompt_template),
        ]

        tags_to_log = [
            RunTag(
                MLFLOW_LOGGED_ARTIFACTS,
                json.dumps([{"path": "eval_results_table.json", "type": "table"}]),
            ),
            RunTag(MLFLOW_RUN_SOURCE_TYPE, "PROMPT_ENGINEERING"),
        ]

        store.log_batch(run_id, [], parameters_to_log, tags_to_log)

        # log model
        from mlflow.models import Model

        artifact_dir = store.get_run(run_id).info.artifact_uri

        utc_time_created = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S.%f")
        promptlab_model = Model(
            artifact_path="model",
            run_id=run_id,
            utc_time_created=utc_time_created,
        )
        store.record_logged_model(run_id, promptlab_model)

        try:
            from mlflow.models.signature import ModelSignature
            from mlflow.types.schema import ColSpec, DataType, Schema
        except ImportError:
            signature = None
        else:
            inputs_colspecs = [ColSpec(DataType.string, param.key) for param in prompt_parameters]
            outputs_colspecs = [ColSpec(DataType.string, "output")]
            signature = ModelSignature(
                inputs=Schema(inputs_colspecs),
                outputs=Schema(outputs_colspecs),
            )

        from mlflow.prompt.promptlab_model import save_model
        from mlflow.server.handlers import (
            _get_artifact_repo_mlflow_artifacts,
            _get_proxied_run_artifact_destination_path,
            _is_servable_proxied_run_artifact_root,
        )

        # write artifact files
        from mlflow.store.artifact.artifact_repository_registry import get_artifact_repository

        with tempfile.TemporaryDirectory() as local_dir:
            save_model(
                mlflow_model=promptlab_model,
                path=os.path.join(local_dir, "model"),
                signature=signature,
                input_example={"inputs": [param.value for param in prompt_parameters]},
                prompt_template=prompt_template,
                prompt_parameters=prompt_parameters,
                model_parameters=model_parameters,
                model_route=model_route,
                pip_requirements=[f"mlflow[gateway]=={__version__}"],
            )

            eval_results_json = create_eval_results_json(
                prompt_parameters, model_input, model_output_parameters, model_output
            )
            eval_results_json_file_path = os.path.join(local_dir, "eval_results_table.json")
            make_containing_dirs(eval_results_json_file_path)
            write_to(eval_results_json_file_path, eval_results_json)

            if _is_servable_proxied_run_artifact_root(run.info.artifact_uri):
                artifact_repo = _get_artifact_repo_mlflow_artifacts()
                artifact_path = _get_proxied_run_artifact_destination_path(
                    proxied_artifact_root=run.info.artifact_uri,
                )
                artifact_repo.log_artifacts(local_dir, artifact_path=artifact_path)
            else:
                artifact_repo = get_artifact_repository(artifact_dir)
                artifact_repo.log_artifacts(local_dir)

    except Exception:
        store.update_run_info(run_id, RunStatus.FAILED, int(time.time() * 1000), run_name)
    else:
        # end time is the current number of milliseconds since the UNIX epoch.
        store.update_run_info(run_id, RunStatus.FINISHED, int(time.time() * 1000), run_name)

    return store.get_run(run_id=run_id)
```

--------------------------------------------------------------------------------

````
