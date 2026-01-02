---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 387
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 387 of 991)

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

---[FILE: spark_model_cache.py]---
Location: mlflow-master/mlflow/pyfunc/spark_model_cache.py

```python
from mlflow.utils._spark_utils import _SparkDirectoryDistributor


class SparkModelCache:
    """Caches models in memory on Spark Executors, to avoid continually reloading from disk.

    This class has to be part of a different module than the one that _uses_ it. This is
    because Spark will pickle classes that are defined in the local scope, but relies on
    Python's module loading behavior for classes in different modules. In this case, we
    are relying on the fact that Python will load a module at-most-once, and can therefore
    store per-process state in a static map.
    """

    # Map from unique name --> (loaded model, local_model_path).
    _models = {}

    # Number of cache hits we've had, for testing purposes.
    _cache_hits = 0

    def __init__(self):
        pass

    @staticmethod
    def add_local_model(spark, model_path):
        """Given a SparkSession and a model_path which refers to a pyfunc directory locally,
        we will zip the directory up, enable it to be distributed to executors, and return
        the "archive_path", which should be used as the path in get_or_load().
        """
        return _SparkDirectoryDistributor.add_dir(spark, model_path)

    @staticmethod
    def get_or_load(archive_path):
        """Given a path returned by add_local_model(), this method will return a tuple of
        (loaded_model, local_model_path).
        If this Python process ever loaded the model before, we will reuse that copy.
        """
        if archive_path in SparkModelCache._models:
            SparkModelCache._cache_hits += 1
            return SparkModelCache._models[archive_path]

        local_model_dir = _SparkDirectoryDistributor.get_or_extract(archive_path)

        # We must rely on a supposed cyclic import here because we want this behavior
        # on the Spark Executors (i.e., don't try to pickle the load_model function).
        from mlflow.pyfunc import load_model

        SparkModelCache._models[archive_path] = (load_model(local_model_dir), local_model_dir)
        return SparkModelCache._models[archive_path]
```

--------------------------------------------------------------------------------

---[FILE: stdin_server.py]---
Location: mlflow-master/mlflow/pyfunc/stdin_server.py

```python
import argparse
import inspect
import json
import logging
import sys

from mlflow.pyfunc import scoring_server
from mlflow.pyfunc.model import _log_warning_if_params_not_in_predict_signature

_logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

parser = argparse.ArgumentParser()
parser.add_argument("--model-uri")
args = parser.parse_args()

_logger.info("Loading model from %s", args.model_uri)

model = scoring_server.load_model_with_mlflow_config(args.model_uri)
input_schema = model.metadata.get_input_schema()
_logger.info("Loaded model")

_logger.info("Waiting for request")
for line in sys.stdin:
    _logger.info("Received request")
    request = json.loads(line)

    _logger.info("Parsing input data")
    data = request["data"]
    data, params = scoring_server._split_data_and_params(data)
    data = scoring_server.infer_and_parse_data(data, input_schema)

    _logger.info("Making predictions")
    if "params" in inspect.signature(model.predict).parameters:
        preds = model.predict(data, params=params)
    else:
        _log_warning_if_params_not_in_predict_signature(_logger, params)
        preds = model.predict(data)

    _logger.info("Writing predictions")
    with open(request["output_file"], "a") as f:
        scoring_server.predictions_to_json(preds, f, {"id": request["id"]})

    _logger.info("Done")
```

--------------------------------------------------------------------------------

---[FILE: _mlflow_pyfunc_backend_predict.py]---
Location: mlflow-master/mlflow/pyfunc/_mlflow_pyfunc_backend_predict.py

```python
"""
This script should be executed in a fresh python interpreter process using `subprocess`.
"""

import argparse

from mlflow.pyfunc.scoring_server import _predict


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--model-uri", required=True)
    parser.add_argument("--input-path", required=False)
    parser.add_argument("--output-path", required=False)
    parser.add_argument("--content-type", required=True)
    return parser.parse_args()


# Guidance for fixing missing module error
_MISSING_MODULE_HELP_MSG = (
    "Exception occurred while running inference: {e}"
    "\n\n"
    "\033[93m[Hint] It appears that your MLflow Model doesn't contain the required "
    "dependency '{missing_module}' to run model inference. When logging a model, MLflow "
    "detects dependencies based on the model flavor, but it is possible that some "
    "dependencies are not captured. In this case, you can manually add dependencies "
    "using the `extra_pip_requirements` parameter of `mlflow.pyfunc.log_model`.\033[0m"
    """

\033[1mSample code:\033[0m
    ----
    mlflow.pyfunc.log_model(
        artifact_path="model",
        python_model=your_model,
        extra_pip_requirements=["{missing_module}==x.y.z"]
    )
    ----

    For mode guidance on fixing missing dependencies, please refer to the MLflow docs:
    https://www.mlflow.org/docs/latest/deployment/index.html#how-to-fix-dependency-errors-when-serving-my-model
"""
)


def main():
    args = parse_args()

    try:
        _predict(
            model_uri=args.model_uri,
            input_path=args.input_path or None,
            output_path=args.output_path or None,
            content_type=args.content_type,
        )
    except ModuleNotFoundError as e:
        message = _MISSING_MODULE_HELP_MSG.format(e=str(e), missing_module=e.name)
        raise RuntimeError(message) from e


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

````
