---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 744
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 744 of 991)

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

---[FILE: server_cli_utils.py]---
Location: mlflow-master/mlflow/utils/server_cli_utils.py

```python
"""
Utilities for MLflow cli server config validation and resolving.
NOTE: these functions are intended to be used as utilities for the cli click-based interface.
Do not use for any other purpose as the potential Exceptions being raised will be misleading
for users.
"""

import click

from mlflow.store.tracking import (
    DEFAULT_ARTIFACTS_URI,
    DEFAULT_LOCAL_FILE_AND_ARTIFACT_PATH,
    DEFAULT_TRACKING_URI,
)
from mlflow.utils.uri import is_local_uri


def resolve_default_artifact_root(
    serve_artifacts: bool,
    default_artifact_root: str,
    backend_store_uri: str,
) -> str:
    if serve_artifacts and not default_artifact_root:
        default_artifact_root = DEFAULT_ARTIFACTS_URI
    elif not serve_artifacts and not default_artifact_root:
        if is_local_uri(backend_store_uri):
            default_artifact_root = backend_store_uri
        else:
            default_artifact_root = DEFAULT_LOCAL_FILE_AND_ARTIFACT_PATH
    return default_artifact_root


def _is_default_backend_store_uri(backend_store_uri: str) -> bool:
    """Utility function to validate if the configured backend store uri location is set as the
    default value for MLflow server.

    Args:
        backend_store_uri: The value set for the backend store uri for MLflow server artifact
            handling.

    Returns:
        bool True if the default value is set.

    """
    return backend_store_uri == DEFAULT_TRACKING_URI


def artifacts_only_config_validation(artifacts_only: bool, backend_store_uri: str) -> None:
    if artifacts_only and not _is_default_backend_store_uri(backend_store_uri):
        msg = (
            "You are starting a tracking server in `--artifacts-only` mode and have provided a "
            f"value for `--backend_store_uri`: '{backend_store_uri}'. A tracking server in "
            "`--artifacts-only` mode cannot have a value set for `--backend_store_uri` to "
            "properly proxy access to the artifact storage location."
        )
        raise click.UsageError(message=msg)
```

--------------------------------------------------------------------------------

---[FILE: spark_utils.py]---
Location: mlflow-master/mlflow/utils/spark_utils.py

```python
def is_spark_connect_mode():
    try:
        from pyspark.sql.utils import is_remote
    except ImportError:
        return False
    return is_remote()


def get_spark_dataframe_type():
    if is_spark_connect_mode():
        from pyspark.sql.connect.dataframe import DataFrame as SparkDataFrame
    else:
        from pyspark.sql import DataFrame as SparkDataFrame

    return SparkDataFrame
```

--------------------------------------------------------------------------------

---[FILE: string_utils.py]---
Location: mlflow-master/mlflow/utils/string_utils.py

```python
import re
import shlex
from datetime import datetime
from typing import Any

from mlflow.utils.os import is_windows


def strip_prefix(original: str, prefix: str) -> str:
    if original.startswith(prefix):
        return original[len(prefix) :]
    return original


def strip_suffix(original: str, suffix: str) -> str:
    if original.endswith(suffix) and suffix != "":
        return original[: -len(suffix)]
    return original


def is_string_type(item: Any) -> bool:
    return isinstance(item, str)


def generate_feature_name_if_not_string(s: Any) -> str:
    if isinstance(s, str):
        return s

    return f"feature_{s}"


def truncate_str_from_middle(s: str, max_length: int) -> str:
    assert max_length > 5
    if len(s) <= max_length:
        return s
    else:
        left_part_len = (max_length - 3) // 2
        right_part_len = max_length - 3 - left_part_len
        return f"{s[:left_part_len]}...{s[-right_part_len:]}"


def _create_table(
    rows: list[list[str]], headers: list[str], column_sep: str = " " * 2, min_column_width: int = 4
) -> str:
    """
    Creates a table from a list of rows and headers.

    Example
    =======
    >>> print(_create_table([["a", "b", "c"], ["d", "e", "f"]], ["x", "y", "z"]))
    x     y     z
    ----  ----  ----
    a     b     c
    d     e     f
    """
    column_widths = [
        max(len(max(col, key=len)), len(header) + 2, min_column_width)
        for col, header in zip(zip(*rows), headers)
    ]
    aligned_rows = [
        column_sep.join(header.ljust(width) for header, width in zip(headers, column_widths)),
        column_sep.join("-" * width for width in column_widths),
        *(
            column_sep.join(cell.ljust(width) for cell, width in zip(row, column_widths))
            for row in rows
        ),
    ]
    return "\n".join(aligned_rows)


# Source: https://github.com/smoofra/mslex/blob/3338c347324d52af619ba39cebfdf7cbf46fa51b/mslex.py#L89-L139
cmd_meta = r"([\"\^\&\|\<\>\(\)\%\!])"
cmd_meta_or_space = r"[\s\"\^\&\|\<\>\(\)\%\!]"
cmd_meta_inside_quotes = r"([\"\%\!])"


def mslex_quote(s: str, for_cmd: bool = True) -> str:
    """
    Quote a string for use as a command line argument in DOS or Windows.

    On windows, before a command line argument becomes a char* in a
    program's argv, it must be parsed by both cmd.exe, and by
    CommandLineToArgvW.

    If for_cmd is true, then this will quote the string so it will
    be parsed correctly by cmd.exe and then by CommandLineToArgvW.

    If for_cmd is false, then this will quote the string so it will
    be parsed correctly when passed directly to CommandLineToArgvW.

    For some strings there is no way to quote them so they will
    parse correctly in both situations.
    """
    if not s:
        return '""'
    if not re.search(cmd_meta_or_space, s):
        return s
    if for_cmd and re.search(cmd_meta, s):
        if not re.search(cmd_meta_inside_quotes, s):
            if m := re.search(r"\\+$", s):
                return '"' + s + m.group() + '"'
            else:
                return '"' + s + '"'
        if not re.search(r"[\s\"]", s):
            return re.sub(cmd_meta, r"^\1", s)
        return re.sub(cmd_meta, r"^\1", mslex_quote(s, for_cmd=False))
    i = re.finditer(r"(\\*)(\"+)|(\\+)|([^\\\"]+)", s)

    def parts():
        yield '"'
        for m in i:
            _, end = m.span()
            slashes, quotes, onlyslashes, text = m.groups()
            if quotes:
                yield slashes
                yield slashes
                yield r"\"" * len(quotes)
            elif onlyslashes:
                if end == len(s):
                    yield onlyslashes
                    yield onlyslashes
                else:
                    yield onlyslashes
            else:
                yield text
        yield '"'

    return "".join(parts())


def quote(s: str) -> str:
    return mslex_quote(s) if is_windows() else shlex.quote(s)


def _backtick_quote(s: str) -> str:
    """
    Quotes the given string with backticks if it is not already quoted with backticks.
    """
    return f"`{s}`" if not (s.startswith("`") and s.endswith("`")) else s


def format_table_cell_value(field: str, cell_value: Any, values: list[Any] | None = None) -> str:
    """
    Format cell values for table display with field-specific formatting.

    Args:
        field: The field name (e.g., "info.request_time")
        cell_value: The value to format
        values: List of extracted values (for multiple values handling)

    Returns:
        Formatted string value suitable for table display
    """
    if values is None:
        values = [cell_value] if cell_value is not None else []

    # Handle empty/missing values
    if not values:
        return "N/A"
    elif len(values) == 1:
        cell_value = values[0]
    else:
        # Multiple values - join them
        cell_value = ", ".join(str(v) for v in values[:3])  # Limit to first 3
        if len(values) > 3:
            cell_value += f", ... (+{len(values) - 3} more)"

    # Format specific fields
    if field == "info.request_time" and cell_value != "N/A":
        # Convert ISO timestamp to readable format
        try:
            dt = datetime.fromisoformat(str(cell_value).replace("Z", "+00:00"))
            cell_value = dt.strftime("%Y-%m-%d %H:%M:%S %Z")
        except Exception:
            pass  # Keep original if conversion fails
    elif field == "info.execution_duration_ms" and cell_value != "N/A" and cell_value is not None:
        try:
            duration_ms = float(cell_value)
            if duration_ms < 1000:
                cell_value = f"{int(duration_ms)}ms"
            else:
                cell_value = f"{duration_ms / 1000:.1f}s"
        except (ValueError, TypeError):
            pass  # Keep original if conversion fails
    elif field in ["info.request_preview", "info.response_preview"]:
        # Truncate previews to keep table readable
        if len(str(cell_value)) > 20:
            cell_value = str(cell_value)[:17] + "..."

    return str(cell_value)
```

--------------------------------------------------------------------------------

---[FILE: thread_utils.py]---
Location: mlflow-master/mlflow/utils/thread_utils.py

```python
import os
import threading
from typing import Any


class ThreadLocalVariable:
    """
    Class for creating a thread local variable.

    Args:
        default_factory: A function used to create the default value
        reset_in_subprocess: Indicating whether the variable is reset in subprocess.
    """

    def __init__(self, default_factory, reset_in_subprocess=True):
        self.reset_in_subprocess = reset_in_subprocess
        self.default_factory = default_factory
        self.thread_local = threading.local()
        # The `__global_thread_values` attribute saves all thread-local values,
        # the key is thread ID.
        self.__global_thread_values: dict[int, Any] = {}

    def get(self):
        """
        Get the thread-local variable value.
        If the thread-local variable is not set, return the provided `init_value` value.
        If `get` is called in a forked subprocess and `reset_in_subprocess` is True,
        return the provided `init_value` value
        """
        if hasattr(self.thread_local, "value"):
            value, pid = self.thread_local.value
            if self.reset_in_subprocess and pid != os.getpid():
                # `get` is called in a forked subprocess, reset it.
                init_value = self.default_factory()
                self.set(init_value)
                return init_value
            else:
                return value
        else:
            init_value = self.default_factory()
            self.set(init_value)
            return init_value

    def set(self, value):
        """
        Set a value for the thread-local variable.
        """
        self.thread_local.value = (value, os.getpid())
        self.__global_thread_values[threading.get_ident()] = value

    def get_all_thread_values(self) -> dict[int, Any]:
        """
        Return all thread values as a dict, dict key is the thread ID.
        """
        return self.__global_thread_values.copy()

    def reset(self):
        """
        Reset the thread-local variable.
        Clear the global thread values and create a new thread local variable.
        """
        self.__global_thread_values.clear()
        self.thread_local = threading.local()
```

--------------------------------------------------------------------------------

---[FILE: time.py]---
Location: mlflow-master/mlflow/utils/time.py

```python
import datetime
import time


def get_current_time_millis():
    """
    Returns the time in milliseconds since the epoch as an integer number.
    """
    return int(time.time() * 1000)


def conv_longdate_to_str(longdate, local_tz=True):
    date_time = datetime.datetime.fromtimestamp(longdate / 1000.0)
    str_long_date = date_time.strftime("%Y-%m-%d %H:%M:%S")
    if local_tz:
        if tzinfo := datetime.datetime.now().astimezone().tzinfo:
            str_long_date += " " + tzinfo.tzname(date_time)

    return str_long_date


class Timer:
    """
    Measures elapsed time.

    .. code-block:: python

        from mlflow.utils.time import Timer

        with Timer() as t:
            ...

        print(f"Elapsed time: {t:.2f} seconds")
    """

    def __init__(self):
        self.elapsed = 0.0

    def __enter__(self):
        self.elapsed = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.elapsed = time.perf_counter() - self.elapsed

    def __format__(self, format_spec: str) -> str:
        return self.elapsed.__format__(format_spec)

    def __repr__(self) -> str:
        return self.elapsed.__repr__()

    def __str__(self) -> str:
        return self.elapsed.__str__()
```

--------------------------------------------------------------------------------

---[FILE: timeout.py]---
Location: mlflow-master/mlflow/utils/timeout.py

```python
import signal
from contextlib import contextmanager

from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import NOT_IMPLEMENTED
from mlflow.utils.os import is_windows


class MlflowTimeoutError(Exception):
    pass


@contextmanager
def run_with_timeout(seconds):
    """
    Context manager to runs a block of code with a timeout. If the block of code takes longer
    than `seconds` to execute, a `TimeoutError` is raised.
    NB: This function uses Unix signals to implement the timeout, so it is not thread-safe.
    Also it does not work on non-Unix platforms such as Windows.

    E.g.
        ```
        with run_with_timeout(5):
            model.predict(data)
        ```
    """
    if is_windows():
        raise MlflowException(
            "Timeouts are not implemented yet for non-Unix platforms",
            error_code=NOT_IMPLEMENTED,
        )

    def signal_handler(signum, frame):
        raise MlflowTimeoutError(f"Operation timed out after {seconds} seconds")

    signal.signal(signal.SIGALRM, signal_handler)
    signal.alarm(seconds)

    try:
        yield
    finally:
        signal.alarm(0)  # Disable the alarm after the operation completes or times out
```

--------------------------------------------------------------------------------

---[FILE: uri.py]---
Location: mlflow-master/mlflow/utils/uri.py

```python
import os
import pathlib
import posixpath
import re
import urllib.parse
import uuid
from typing import Any

from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE
from mlflow.utils.os import is_windows
from mlflow.utils.validation import _validate_db_type_string

_INVALID_DB_URI_MSG = (
    "Please refer to https://mlflow.org/docs/latest/tracking.html#storage for "
    "format specifications."
)

_DBFS_FUSE_PREFIX = "/dbfs/"
_DBFS_HDFS_URI_PREFIX = "dbfs:/"
_uc_volume_URI_PREFIX = "/Volumes/"
_uc_model_URI_PREFIX = "/Models/"
_UC_DBFS_SYMLINK_PREFIX = "/.fuse-mounts/"
_DATABRICKS_UNITY_CATALOG_SCHEME = "databricks-uc"
_OSS_UNITY_CATALOG_SCHEME = "uc"


def is_local_uri(uri, is_tracking_or_registry_uri=True):
    """Returns true if the specified URI is a local file path (/foo or file:/foo).

    Args:
        uri: The URI.
        is_tracking_or_registry_uri: Whether or not the specified URI is an MLflow Tracking or
            MLflow Model Registry URI. Examples of other URIs are MLflow artifact URIs,
            filesystem paths, etc.
    """
    if uri == "databricks" and is_tracking_or_registry_uri:
        return False

    if is_windows() and uri.startswith("\\\\"):
        # windows network drive path looks like: "\\<server name>\path\..."
        return False

    parsed_uri = urllib.parse.urlparse(uri)
    scheme = parsed_uri.scheme
    if scheme == "":
        return True

    is_remote_hostname = parsed_uri.hostname and not (
        parsed_uri.hostname == "."
        or parsed_uri.hostname.startswith("localhost")
        or parsed_uri.hostname.startswith("127.0.0.1")
    )
    if scheme == "file":
        if is_remote_hostname:
            raise MlflowException(
                f"{uri} is not a valid remote uri. For remote access "
                "on windows, please consider using a different scheme "
                "such as SMB (e.g. smb://<hostname>/<path>)."
            )
        return True

    if is_remote_hostname:
        return False

    if is_windows() and len(scheme) == 1 and scheme.lower() == pathlib.Path(uri).drive.lower()[0]:
        return True

    return False


def is_file_uri(uri):
    scheme = urllib.parse.urlparse(uri).scheme
    return scheme == "file"


def is_http_uri(uri):
    scheme = urllib.parse.urlparse(uri).scheme
    return scheme in {"http", "https"}


def is_databricks_uri(uri):
    """
    Databricks URIs look like 'databricks' (default profile) or 'databricks://profile'
    or 'databricks://secret_scope:secret_key_prefix'.
    """
    scheme = urllib.parse.urlparse(uri).scheme
    return scheme == "databricks" or uri == "databricks"


def is_fuse_or_uc_volumes_uri(uri):
    """
    Validates whether a provided URI is directed to a FUSE mount point or a UC volumes mount point.
    Multiple directory paths are collapsed into a single designator for root path validation.
    For example, "////Volumes/" will resolve to "/Volumes/" for validation purposes.
    """
    resolved_uri = re.sub(r"/+", "/", uri).lower()
    return any(
        resolved_uri.startswith(x.lower())
        for x in [
            _DBFS_FUSE_PREFIX,
            _DBFS_HDFS_URI_PREFIX,
            _uc_volume_URI_PREFIX,
            _uc_model_URI_PREFIX,
            _UC_DBFS_SYMLINK_PREFIX,
        ]
    )


def _is_uc_volumes_path(path: str) -> bool:
    return re.match(r"^/[vV]olumes?/", path) is not None


def is_uc_volumes_uri(uri: str) -> bool:
    parsed_uri = urllib.parse.urlparse(uri)
    return parsed_uri.scheme == "dbfs" and _is_uc_volumes_path(parsed_uri.path)


def is_valid_uc_volumes_uri(uri: str) -> bool:
    parsed_uri = urllib.parse.urlparse(uri)
    return parsed_uri.scheme == "dbfs" and bool(
        re.match(r"^/[vV]olumes?/[^/]+/[^/]+/[^/]+/[^/]+", parsed_uri.path)
    )


def is_databricks_unity_catalog_uri(uri):
    scheme = urllib.parse.urlparse(uri).scheme
    return _DATABRICKS_UNITY_CATALOG_SCHEME in (scheme, uri)


def is_oss_unity_catalog_uri(uri):
    scheme = urllib.parse.urlparse(uri).scheme
    return scheme == "uc"


def construct_db_uri_from_profile(profile):
    if profile:
        return "databricks://" + profile


def construct_db_uc_uri_from_profile(profile):
    """
    Construct a databricks-uc URI from a profile.

    Args:
        profile: The profile name, optionally with key_prefix (e.g., "profile" or "scope:key")

    Returns:
        A databricks-uc URI string, or the scheme alone if no profile is provided
    """
    if profile:
        return f"{_DATABRICKS_UNITY_CATALOG_SCHEME}://{profile}"
    else:
        return _DATABRICKS_UNITY_CATALOG_SCHEME


# Both scope and key_prefix should not contain special chars for URIs, like '/'
# and ':'.
def validate_db_scope_prefix_info(scope, prefix):
    for c in ["/", ":", " "]:
        if c in scope:
            raise MlflowException(
                f"Unsupported Databricks profile name: {scope}. Profile names cannot contain '{c}'."
            )
        if prefix and c in prefix:
            raise MlflowException(
                f"Unsupported Databricks profile key prefix: {prefix}."
                f" Key prefixes cannot contain '{c}'."
            )
    if prefix is not None and prefix.strip() == "":
        raise MlflowException(
            f"Unsupported Databricks profile key prefix: '{prefix}'. Key prefixes cannot be empty."
        )


def get_db_info_from_uri(uri):
    """
    Get the Databricks profile specified by the tracking URI (if any), otherwise
    returns None.
    """
    parsed_uri = urllib.parse.urlparse(uri)
    if parsed_uri.scheme in ("databricks", _DATABRICKS_UNITY_CATALOG_SCHEME):
        # netloc should not be an empty string unless URI is formatted incorrectly.
        if parsed_uri.netloc == "":
            raise MlflowException(
                f"URI is formatted incorrectly: no netloc in URI '{uri}'."
                " This may be the case if there is only one slash in the URI."
            )
        profile_tokens = parsed_uri.netloc.split(":")
        parsed_scope = profile_tokens[0]
        if len(profile_tokens) == 1:
            parsed_key_prefix = None
        elif len(profile_tokens) == 2:
            parsed_key_prefix = profile_tokens[1]
        else:
            # parse the content before the first colon as the profile.
            parsed_key_prefix = ":".join(profile_tokens[1:])
        validate_db_scope_prefix_info(parsed_scope, parsed_key_prefix)
        return parsed_scope, parsed_key_prefix
    return None, None


def get_databricks_profile_uri_from_artifact_uri(uri, result_scheme="databricks"):
    """
    Retrieves the netloc portion of the URI as a ``databricks://`` or `databricks-uc://` URI,
    if it is a proper Databricks profile specification, e.g.
    ``profile@databricks`` or ``secret_scope:key_prefix@databricks``.
    """
    parsed = urllib.parse.urlparse(uri)
    if not parsed.netloc or parsed.hostname != result_scheme:
        return None
    if not parsed.username:  # no profile or scope:key
        return result_scheme  # the default tracking/registry URI
    validate_db_scope_prefix_info(parsed.username, parsed.password)
    key_prefix = ":" + parsed.password if parsed.password else ""
    return f"{result_scheme}://" + parsed.username + key_prefix


def remove_databricks_profile_info_from_artifact_uri(artifact_uri):
    """
    Only removes the netloc portion of the URI if it is a Databricks
    profile specification, e.g.
    ``profile@databricks`` or ``secret_scope:key_prefix@databricks``.
    """
    parsed = urllib.parse.urlparse(artifact_uri)
    if not parsed.netloc or parsed.hostname != "databricks":
        return artifact_uri
    return urllib.parse.urlunparse(parsed._replace(netloc=""))


def add_databricks_profile_info_to_artifact_uri(artifact_uri, databricks_profile_uri):
    """
    Throws an exception if ``databricks_profile_uri`` is not valid.
    """
    if not databricks_profile_uri or not is_databricks_uri(databricks_profile_uri):
        return artifact_uri
    artifact_uri_parsed = urllib.parse.urlparse(artifact_uri)
    # Do not overwrite the authority section if there is already one
    if artifact_uri_parsed.netloc:
        return artifact_uri

    scheme = artifact_uri_parsed.scheme
    if scheme in {"dbfs", "runs", "models"}:
        if databricks_profile_uri == "databricks":
            netloc = "databricks"
        else:
            (profile, key_prefix) = get_db_info_from_uri(databricks_profile_uri)
            prefix = ":" + key_prefix if key_prefix else ""
            netloc = profile + prefix + "@databricks"
        new_parsed = artifact_uri_parsed._replace(netloc=netloc)
        return urllib.parse.urlunparse(new_parsed)
    else:
        return artifact_uri


def extract_db_type_from_uri(db_uri):
    """
    Parse the specified DB URI to extract the database type. Confirm the database type is
    supported. If a driver is specified, confirm it passes a plausible regex.
    """
    scheme = urllib.parse.urlparse(db_uri).scheme
    scheme_plus_count = scheme.count("+")

    if scheme_plus_count == 0:
        db_type = scheme
    elif scheme_plus_count == 1:
        db_type, _ = scheme.split("+")
    else:
        error_msg = f"Invalid database URI: '{db_uri}'. {_INVALID_DB_URI_MSG}"
        raise MlflowException(error_msg, INVALID_PARAMETER_VALUE)

    _validate_db_type_string(db_type)

    return db_type


def get_uri_scheme(uri_or_path):
    from mlflow.store.db.db_types import DATABASE_ENGINES

    scheme = urllib.parse.urlparse(uri_or_path).scheme
    if any(scheme.lower().startswith(db) for db in DATABASE_ENGINES):
        return extract_db_type_from_uri(uri_or_path)
    return scheme


def extract_and_normalize_path(uri):
    parsed_uri_path = urllib.parse.urlparse(uri).path
    normalized_path = posixpath.normpath(parsed_uri_path)
    return normalized_path.lstrip("/")


def append_to_uri_path(uri, *paths):
    """Appends the specified POSIX `paths` to the path component of the specified `uri`.

    Args:
        uri: The input URI, represented as a string.
        paths: The POSIX paths to append to the specified `uri`'s path component.

    Returns:
        A new URI with a path component consisting of the specified `paths` appended to
        the path component of the specified `uri`.

        .. code-block:: python
          uri1 = "s3://root/base/path?param=value"
          uri1 = append_to_uri_path(uri1, "some/subpath", "/anotherpath")
          assert uri1 == "s3://root/base/path/some/subpath/anotherpath?param=value"
          uri2 = "a/posix/path"
          uri2 = append_to_uri_path(uri2, "/some", "subpath")
          assert uri2 == "a/posixpath/some/subpath"
    """
    path = ""
    for subpath in paths:
        path = _join_posixpaths_and_append_absolute_suffixes(path, subpath)

    parsed_uri = urllib.parse.urlparse(uri)

    # Validate query string not to contain any traversal path (../) before appending
    # to the end of the path, otherwise they will be resolved as part of the path.
    validate_query_string(parsed_uri.query)

    if len(parsed_uri.scheme) == 0:
        # If the input URI does not define a scheme, we assume that it is a POSIX path
        # and join it with the specified input paths
        return _join_posixpaths_and_append_absolute_suffixes(uri, path)

    prefix = ""
    if not parsed_uri.path.startswith("/"):
        # For certain URI schemes (e.g., "file:"), urllib's unparse routine does
        # not preserve the relative URI path component properly. In certain cases,
        # urlunparse converts relative paths to absolute paths. We introduce this logic
        # to circumvent urlunparse's erroneous conversion
        prefix = parsed_uri.scheme + ":"
        parsed_uri = parsed_uri._replace(scheme="")

    new_uri_path = _join_posixpaths_and_append_absolute_suffixes(parsed_uri.path, path)
    new_parsed_uri = parsed_uri._replace(path=new_uri_path)
    return prefix + urllib.parse.urlunparse(new_parsed_uri)


def append_to_uri_query_params(uri, *query_params: tuple[str, Any]) -> str:
    """Appends the specified query parameters to an existing URI.

    Args:
        uri: The URI to which to append query parameters.
        query_params: Query parameters to append. Each parameter should
            be a 2-element tuple. For example, ``("key", "value")``.
    """
    parsed_uri = urllib.parse.urlparse(uri)
    parsed_query = urllib.parse.parse_qsl(parsed_uri.query)
    new_parsed_query = parsed_query + list(query_params)
    new_query = urllib.parse.urlencode(new_parsed_query)
    new_parsed_uri = parsed_uri._replace(query=new_query)
    return urllib.parse.urlunparse(new_parsed_uri)


def _join_posixpaths_and_append_absolute_suffixes(prefix_path, suffix_path):
    """
    Joins the POSIX path `prefix_path` with the POSIX path `suffix_path`. Unlike posixpath.join(),
    if `suffix_path` is an absolute path, it is appended to prefix_path.

    >>> result1 = _join_posixpaths_and_append_absolute_suffixes("relpath1", "relpath2")
    >>> assert result1 == "relpath1/relpath2"
    >>> result2 = _join_posixpaths_and_append_absolute_suffixes("relpath", "/absolutepath")
    >>> assert result2 == "relpath/absolutepath"
    >>> result3 = _join_posixpaths_and_append_absolute_suffixes("/absolutepath", "relpath")
    >>> assert result3 == "/absolutepath/relpath"
    >>> result4 = _join_posixpaths_and_append_absolute_suffixes(
    ...     "/absolutepath1", "/absolutepath2"
    ... )
    >>> assert result4 == "/absolutepath1/absolutepath2"
    """
    if len(prefix_path) == 0:
        return suffix_path

    # If the specified prefix path is non-empty, we must relativize the suffix path by removing
    # the leading slash, if present. Otherwise, posixpath.join() would omit the prefix from the
    # joined path
    suffix_path = suffix_path.lstrip(posixpath.sep)
    return posixpath.join(prefix_path, suffix_path)


def is_databricks_acled_artifacts_uri(artifact_uri):
    _ACLED_ARTIFACT_URI = "databricks/mlflow-tracking/"
    artifact_uri_path = extract_and_normalize_path(artifact_uri)
    return artifact_uri_path.startswith(_ACLED_ARTIFACT_URI)


def is_databricks_model_registry_artifacts_uri(artifact_uri):
    _MODEL_REGISTRY_ARTIFACT_URI = "databricks/mlflow-registry/"
    artifact_uri_path = extract_and_normalize_path(artifact_uri)
    return artifact_uri_path.startswith(_MODEL_REGISTRY_ARTIFACT_URI)


def is_valid_dbfs_uri(uri):
    parsed = urllib.parse.urlparse(uri)
    if parsed.scheme != "dbfs":
        return False
    try:
        db_profile_uri = get_databricks_profile_uri_from_artifact_uri(uri)
    except MlflowException:
        db_profile_uri = None
    return not parsed.netloc or db_profile_uri is not None


def dbfs_hdfs_uri_to_fuse_path(dbfs_uri: str) -> str:
    """Converts the provided DBFS URI into a DBFS FUSE path

    Args:
        dbfs_uri: A DBFS URI like "dbfs:/my-directory". Can also be a scheme-less URI like
            "/my-directory" if running in an environment where the default HDFS filesystem
            is "dbfs:/" (e.g. Databricks)

    Returns:
        A DBFS FUSE-style path, e.g. "/dbfs/my-directory". For UC Volumes paths
        (e.g., "/Volumes/..."), returns the path unchanged.

    """
    if _is_uc_volumes_path(dbfs_uri):
        return dbfs_uri  # UC Volumes paths do not need conversion
    if not is_valid_dbfs_uri(dbfs_uri) and dbfs_uri == posixpath.abspath(dbfs_uri):
        # Convert posixpaths (e.g. "/tmp/mlflow") to DBFS URIs by adding "dbfs:/" as a prefix
        dbfs_uri = "dbfs:" + dbfs_uri
    if not dbfs_uri.startswith(_DBFS_HDFS_URI_PREFIX):
        raise MlflowException(
            f"Path '{dbfs_uri}' did not start with expected DBFS URI "
            f"prefix '{_DBFS_HDFS_URI_PREFIX}'",
        )

    return _DBFS_FUSE_PREFIX + dbfs_uri[len(_DBFS_HDFS_URI_PREFIX) :]


def resolve_uri_if_local(local_uri):
    """
    if `local_uri` is passed in as a relative local path, this function
    resolves it to absolute path relative to current working directory.

    Args:
        local_uri: Relative or absolute path or local file uri

    Returns:
        a fully-formed absolute uri path or an absolute filesystem path
    """
    from mlflow.utils.file_utils import local_file_uri_to_path

    if local_uri is not None and is_local_uri(local_uri):
        scheme = get_uri_scheme(local_uri)
        cwd = pathlib.Path.cwd()
        local_path = local_file_uri_to_path(local_uri)
        if not pathlib.Path(local_path).is_absolute():
            if scheme == "":
                if is_windows():
                    return urllib.parse.urlunsplit(
                        (
                            "file",
                            None,
                            cwd.joinpath(local_path).as_posix(),
                            None,
                            None,
                        )
                    )
                return cwd.joinpath(local_path).as_posix()
            local_uri_split = urllib.parse.urlsplit(local_uri)
            return urllib.parse.urlunsplit(
                (
                    local_uri_split.scheme,
                    None,
                    cwd.joinpath(local_path).as_posix(),
                    local_uri_split.query,
                    local_uri_split.fragment,
                )
            )
    return local_uri


def generate_tmp_dfs_path(dfs_tmp):
    return posixpath.join(dfs_tmp, str(uuid.uuid4()))


def join_paths(*paths: str) -> str:
    stripped = (p.strip("/") for p in paths)
    return "/" + posixpath.normpath(posixpath.join(*stripped))


_OS_ALT_SEPS = [sep for sep in [os.sep, os.path.altsep] if sep is not None and sep != "/"]


def validate_path_is_safe(path):
    """
    Validates that the specified path is safe to join with a trusted prefix. This is a security
    measure to prevent path traversal attacks.
    A valid path should:
        not contain separators other than '/'
        not contain .. to navigate to parent dir in path
        not be an absolute path
    """
    from mlflow.utils.file_utils import local_file_uri_to_path

    # We must decode path before validating it
    path = _decode(path)
    # If control characters are included in the path, escape them.
    path = _escape_control_characters(path)

    exc = MlflowException("Invalid path", error_code=INVALID_PARAMETER_VALUE)
    if "#" in path:
        raise exc

    if is_file_uri(path):
        path = local_file_uri_to_path(path)
    if (
        any((s in path) for s in _OS_ALT_SEPS)
        or ".." in path.split("/")
        or pathlib.PureWindowsPath(path).is_absolute()
        or pathlib.PurePosixPath(path).is_absolute()
        or (is_windows() and len(path) >= 2 and path[1] == ":")
    ):
        raise exc

    return path


def validate_path_within_directory(base_dir: str, constructed_path: str) -> str:
    """
    Validates that the constructed path (after resolving symlinks) is within the base directory.
    This is a security measure to prevent symlink-based path traversal attacks.

    Args:
        base_dir: The trusted base directory path.
        constructed_path: The full path that was constructed by joining base_dir with user input.

    Returns:
        The constructed_path if validation passes.
    """
    real_base_dir = pathlib.Path(base_dir).resolve()
    real_constructed_path = pathlib.Path(constructed_path).resolve()

    if not real_constructed_path.is_relative_to(real_base_dir):
        raise MlflowException(
            "Invalid path: resolved path is outside the artifact directory",
            error_code=INVALID_PARAMETER_VALUE,
        )

    return constructed_path


def _escape_control_characters(text: str) -> str:
    # Method to escape control characters (e.g. \u0017)
    def escape_char(c):
        code_point = ord(c)

        # If it's a control character (ASCII 0-31 or 127), escape it
        if (0 <= code_point <= 31) or (code_point == 127):
            return f"%{code_point:02x}"
        return c

    return "".join(escape_char(c) for c in text)


def validate_query_string(query):
    query = _decode(query)
    # Block query strings contain any traversal path (../) because they
    # could be resolved as part of the path and allow path traversal.
    if ".." in query:
        raise MlflowException("Invalid query string", error_code=INVALID_PARAMETER_VALUE)


def _decode(url):
    # Keep decoding until the url stops changing (with a max of 10 iterations)
    for _ in range(10):
        decoded = urllib.parse.unquote(url)
        parsed = urllib.parse.urlunparse(urllib.parse.urlparse(decoded))
        if parsed == url:
            return url
        url = parsed

    raise ValueError("Failed to decode url")


def strip_scheme(uri: str) -> str:
    """
    Strips the scheme from the specified URI.

    Example:

    >>> strip_scheme("http://example.com")
    '//example.com'
    """
    parsed = urllib.parse.urlparse(uri)
    # `_replace` looks like a private method, but it's actually part of the public API:
    # https://docs.python.org/3/library/collections.html#collections.somenamedtuple._replace
    return urllib.parse.urlunparse(parsed._replace(scheme=""))


def is_models_uri(uri: str) -> bool:
    try:
        parsed = urllib.parse.urlparse(uri)
    except ValueError:
        return False

    return parsed.scheme == "models"
```

--------------------------------------------------------------------------------

````
