---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 312
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 312 of 991)

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

---[FILE: autologging.py]---
Location: mlflow-master/mlflow/keras/autologging.py

```python
"""MLflow autologging support for Keras 3."""

import logging

import keras
import numpy as np

import mlflow
from mlflow.data.code_dataset_source import CodeDatasetSource
from mlflow.data.numpy_dataset import from_numpy
from mlflow.data.tensorflow_dataset import from_tensorflow
from mlflow.entities.logged_model_input import LoggedModelInput
from mlflow.exceptions import MlflowException
from mlflow.keras.callback import MlflowCallback
from mlflow.keras.save import log_model
from mlflow.keras.utils import get_model_signature
from mlflow.tracking.context import registry as context_registry
from mlflow.tracking.fluent import _initialize_logged_model
from mlflow.utils import is_iterator
from mlflow.utils.autologging_utils import (
    autologging_integration,
    get_autologging_config,
    log_fn_args_as_params,
    safe_patch,
)

_logger = logging.getLogger(__name__)


def _check_existing_mlflow_callback(callbacks):
    for callback in callbacks:
        if isinstance(callback, MlflowCallback):
            raise MlflowException(
                "MLflow autologging must be turned off if an `MlflowCallback` is explicitly added "
                "to the callback list. You are creating an `MlflowCallback` while having "
                "autologging enabled. Please either call `mlflow.keras.autolog(disable=True)` "
                "to disable autologging or remove `MlflowCallback` from the callback list. "
            )


def _log_dataset(dataset, source, context, name=None, targets=None, model_id=None):
    """Helper function to log the dataset information to MLflow."""
    try:
        import tensorflow as tf

        is_tf_dataset = isinstance(dataset, tf.data.Dataset)
        is_tf_tensor = isinstance(dataset, tf.Tensor)
    except ImportError:
        pass

    if isinstance(dataset, np.ndarray):
        dataset = from_numpy(features=dataset, targets=targets, source=source, name=name)
    elif is_tf_tensor:
        dataset = from_tensorflow(features=dataset, targets=targets, source=source, name=name)
    elif is_tf_dataset:
        dataset = from_tensorflow(features=dataset, source=source, name=name)
    elif isinstance(dataset, tuple):
        x = dataset[0]
        y = dataset[1]
        # check if x and y are tensors
        if isinstance(x, tf.Tensor) and isinstance(y, tf.Tensor):
            dataset = from_tensorflow(features=x, source=source, targets=y, name=name)
        else:
            dataset = from_numpy(features=x, targets=y, source=source, name=name)
    else:
        _logger.warning(f"Unrecognized dataset type {type(dataset)}. Dataset logging skipped.")
        return

    model = LoggedModelInput(model_id=model_id) if model_id else None
    mlflow.log_input(dataset, context, model=model)


def _parse_dataset(*keras_fit_args, **keras_fit_kwargs):
    """Parse dataset from `keras.Model.fit` args and kwargs."""
    x = keras_fit_kwargs["x"] if "x" in keras_fit_kwargs else keras_fit_args[0]
    if "y" in keras_fit_kwargs:
        # `y` is either specified as a kwarg, or the second argument to `fit`.
        y = keras_fit_kwargs["y"]
    elif len(keras_fit_args) >= 2:
        y = keras_fit_args[1]
    else:
        y = None
    return x, y


def _log_keras_model(
    model,
    save_exported_model,
    log_model_signatures=True,
    save_model_kwargs=None,
    model_id=None,
):
    """Helper function to log the Keras model to MLflow."""
    if log_model_signatures:
        try:
            signature = get_model_signature(model)
        except Exception as e:
            _logger.warning(f"Failed to get model signature, reason: {e}")
            signature = None
    else:
        signature = None

    log_model(
        model,
        "model",
        save_exported_model=save_exported_model,
        signature=signature,
        registered_model_name=get_autologging_config("keras", "registered_model_name", None),
        save_model_kwargs=save_model_kwargs,
        model_id=model_id,
    )


@autologging_integration("keras")
def autolog(
    log_every_epoch=True,
    log_every_n_steps=None,
    log_models=True,
    log_model_signatures=True,
    save_exported_model=False,
    log_datasets=True,
    log_input_examples=False,
    disable=False,
    exclusive=False,
    disable_for_unsupported_versions=False,
    silent=False,
    registered_model_name=None,
    save_model_kwargs=None,
    extra_tags=None,
):
    """
    Enable autologging for Keras.

    This method configures the autologging for Keras workflow. Only Keras > 3 is supported. For
    usage of lower Keras version (also known as tf-keras), please refer to `mlflow.tensorflow`
    flavor. At a high level, calling this `mlflow.keras.autolog()` function will replace
    `keras.Model.fit` method with the custom `fit` method provided by MLflow, which logs
    metrics/params/info/model to MLflow at the corresponding time.

    Autologging is compatible with all backends supported by Keras, including Tensorflow, PyTorch
    and JAX.

    Please note that autologging works only when you are using `model.fit()` for training. If you
    are writing a custom training loop, then you need to use manual logging.

    Args:
        log_every_epoch: If True, training metrics will be logged at the end of each epoch.
        log_every_n_steps: If set, training metrics will be logged every `n` training steps.
            `log_every_n_steps` must be `None` when `log_every_epoch=True`.
        log_models: If True, the Keras model will be logged to MLflow at the end of `model.fit()`.
        log_model_signatures: If True, model signature will be automatically captured and logged.
        save_exported_model: If True, model will be saved as the exported format (compiled graph),
            which is suitable for serving and deployment. If False, model will be saved in `.keras`
            format, which contains model architecture and weights.
        log_datasets: If True, the dataset metadata will be logged to MLflow.
        log_input_examples: If True, input examples will be logged.
        disable: If `True`, disables the Keras autologging.
        exclusive: If `True`, autologged content is not logged to user-created fluent runs. If
            `False`, autologged content is logged to the active fluent run, which may be
            user-created.  disable_for_unsupported_versions: If `True`, disable autologging for
            incompatible Keras versions.
        disable_for_unsupported_versions: If ``True``, disable autologging for versions of keras
            that have not been tested against this version of the MLflow client or are
            incompatible.
        silent: If `True`, suppress all event logs and warnings from MLflow during Keras
            autologging.  If `True`, show all events and warnings during Keras autologging.
        registered_model_name: If set, each time a model is trained, it is registered as a new model
            version of the registered model with this name. The registered model is created if it
            does not already exist.
        save_model_kwargs: Extra kwargs passed to `keras.Model.save()`.
        extra_tags: A dictionary of extra tags to set on each managed run created by autologging.

    .. code-block:: python
        :caption: Example

        import keras
        import mlflow
        import numpy as np

        mlflow.keras.autolog()

        # Prepare data for a 2-class classification.
        data = np.random.uniform([8, 28, 28, 3])
        label = np.random.randint(2, size=8)
        model = keras.Sequential(
            [
                keras.Input([28, 28, 3]),
                keras.layers.Flatten(),
                keras.layers.Dense(2),
            ]
        )
        model.compile(
            loss=keras.losses.SparseCategoricalCrossentropy(from_logits=True),
            optimizer=keras.optimizers.Adam(0.001),
            metrics=[keras.metrics.SparseCategoricalAccuracy()],
        )
        with mlflow.start_run() as run:
            model.fit(data, label, batch_size=4, epochs=2)
    """

    def _patched_inference(original, inst, *args, **kwargs):
        unlogged_params = ["self", "x", "y", "callbacks", "validation_data", "verbose"]

        batch_size, args, kwargs = _infer_batch_size(inst, *args, **kwargs)

        if batch_size is not None:
            mlflow.log_param("batch_size", batch_size)
            unlogged_params.append("batch_size")

        log_fn_args_as_params(original, [], kwargs, unlogged_params)
        model_id = None
        if log_models:
            model_id = _initialize_logged_model("model", flavor="keras").model_id

        if log_datasets:
            try:
                context_tags = context_registry.resolve_tags()
                source = CodeDatasetSource(tags=context_tags)
                x, y = _parse_dataset(*args, **kwargs)
                _log_dataset(x, source, "train", targets=y, model_id=model_id)

                if "validation_data" in kwargs:
                    _log_dataset(kwargs["validation_data"], source, "eval", model_id=model_id)

            except Exception as e:
                _logger.warning(f"Failed to log dataset information to MLflow. Reason: {e}")

        # Add `MlflowCallback` to the callback list.
        callbacks = args[5] if len(args) >= 6 else kwargs.get("callbacks", [])
        mlflow_callback = MlflowCallback(
            log_every_epoch=log_every_epoch,
            log_every_n_steps=log_every_n_steps,
            model_id=model_id,
        )
        _check_existing_mlflow_callback(callbacks)
        callbacks.append(mlflow_callback)
        kwargs["callbacks"] = callbacks
        history = original(inst, *args, **kwargs)

        if log_models:
            _log_keras_model(
                inst,
                save_exported_model,
                log_model_signatures,
                save_model_kwargs,
                model_id=model_id,
            )
        return history

    safe_patch(
        "keras", keras.Model, "fit", _patched_inference, manage_run=True, extra_tags=extra_tags
    )


def _infer_batch_size(inst, *args, **kwargs):
    batch_size = None
    if "batch_size" in kwargs:
        batch_size = kwargs["batch_size"]
    else:
        training_data = kwargs["x"] if "x" in kwargs else args[0]
        if _batch_size := getattr(training_data, "batch_size", None):
            batch_size = _batch_size
        elif _batch_size := getattr(training_data, "_batch_size", None):
            batch_size = _batch_size if isinstance(_batch_size, int) else _batch_size.numpy()
        elif is_iterator(training_data):
            is_single_input_model = isinstance(inst.input_shape, tuple)
            peek = next(training_data)
            batch_size = len(peek[0]) if is_single_input_model else len(peek[0][0])

            def origin_training_data_generator_fn():
                yield peek
                yield from training_data

            origin_training_data = origin_training_data_generator_fn()

            if "x" in kwargs:
                kwargs["x"] = origin_training_data
            else:
                args = (origin_training_data,) + args[1:]
    return batch_size, args, kwargs
```

--------------------------------------------------------------------------------

---[FILE: callback.py]---
Location: mlflow-master/mlflow/keras/callback.py

```python
"""Keras 3 callback to log information to MLflow."""

import keras

from mlflow import log_metrics, log_params, log_text
from mlflow.utils.autologging_utils import ExceptionSafeClass


class MlflowCallback(keras.callbacks.Callback, metaclass=ExceptionSafeClass):
    """Callback for logging Keras metrics/params/model/... to MLflow.

    This callback logs model metadata at training begins, and logs training metrics every epoch or
    every n steps (defined by the user) to MLflow.

    Args:
        log_every_epoch: bool, defaults to True. If True, log metrics every epoch. If False,
            log metrics every n steps.
        log_every_n_steps: int, defaults to None. If set, log metrics every n steps. If None,
            log metrics every epoch. Must be `None` if `log_every_epoch=True`.

    .. code-block:: python
        :caption: Example

        import keras
        import mlflow
        import numpy as np

        # Prepare data for a 2-class classification.
        data = np.random.uniform([8, 28, 28, 3])
        label = np.random.randint(2, size=8)
        model = keras.Sequential(
            [
                keras.Input([28, 28, 3]),
                keras.layers.Flatten(),
                keras.layers.Dense(2),
            ]
        )
        model.compile(
            loss=keras.losses.SparseCategoricalCrossentropy(from_logits=True),
            optimizer=keras.optimizers.Adam(0.001),
            metrics=[keras.metrics.SparseCategoricalAccuracy()],
        )
        with mlflow.start_run() as run:
            model.fit(
                data,
                label,
                batch_size=4,
                epochs=2,
                callbacks=[mlflow.keras.MlflowCallback()],
            )
    """

    def __init__(self, log_every_epoch=True, log_every_n_steps=None, model_id=None):
        self.log_every_epoch = log_every_epoch
        self.log_every_n_steps = log_every_n_steps
        self.model_id = model_id

        if log_every_epoch and log_every_n_steps is not None:
            raise ValueError(
                "`log_every_n_steps` must be None if `log_every_epoch=True`, received "
                f"`log_every_epoch={log_every_epoch}` and `log_every_n_steps={log_every_n_steps}`."
            )

        if not log_every_epoch and log_every_n_steps is None:
            raise ValueError(
                "`log_every_n_steps` must be specified if `log_every_epoch=False`, received"
                "`log_every_n_steps=False` and `log_every_n_steps=None`."
            )

    def on_train_begin(self, logs=None):
        """Log model architecture and optimizer configuration when training begins."""
        config = self.model.optimizer.get_config()
        log_params({f"optimizer_{k}": v for k, v in config.items()})

        model_summary = []

        def print_fn(line, *args, **kwargs):
            model_summary.append(line)

        self.model.summary(print_fn=print_fn)
        summary = "\n".join(model_summary)
        log_text(summary, artifact_file="model_summary.txt")

    def on_epoch_end(self, epoch, logs=None):
        """Log metrics at the end of each epoch."""
        if not self.log_every_epoch or logs is None:
            return
        log_metrics(logs, step=epoch, synchronous=False, model_id=self.model_id)

    def on_batch_end(self, batch, logs=None):
        """Log metrics at the end of each batch with user specified frequency."""
        if self.log_every_n_steps is None or logs is None:
            return
        current_iteration = int(self.model.optimizer.iterations.numpy())

        if current_iteration % self.log_every_n_steps == 0:
            log_metrics(logs, step=current_iteration, synchronous=False, model_id=self.model_id)

    def on_test_end(self, logs=None):
        """Log validation metrics at validation end."""
        if logs is None:
            return
        metrics = {"validation_" + k: v for k, v in logs.items()}
        log_metrics(metrics, synchronous=False, model_id=self.model_id)
```

--------------------------------------------------------------------------------

---[FILE: load.py]---
Location: mlflow-master/mlflow/keras/load.py

```python
"""Functions for loading Keras models saved with MLflow."""

import os

import keras
import numpy as np
import pandas as pd

from mlflow.exceptions import INVALID_PARAMETER_VALUE, MlflowException
from mlflow.models import Model
from mlflow.models.model import MLMODEL_FILE_NAME
from mlflow.tracking.artifact_utils import _download_artifact_from_uri

_MODEL_SAVE_PATH = "model"


class KerasModelWrapper:
    def __init__(self, model, signature, save_exported_model=False):
        self.model = model
        self.signature = signature
        self.save_exported_model = save_exported_model

    def get_raw_model(self):
        """
        Returns the underlying model.
        """
        return self.model

    def get_model_call_method(self):
        if self.save_exported_model:
            return self.model.serve
        else:
            return self.model.predict

    def predict(self, data, **kwargs):
        model_call = self.get_model_call_method()
        if isinstance(data, pd.DataFrame):
            return pd.DataFrame(model_call(data.values), index=data.index)

        supported_input_types = (np.ndarray, list, tuple, dict)
        if not isinstance(data, supported_input_types):
            raise MlflowException(
                f"`data` must be one of: {[x.__name__ for x in supported_input_types]}, but "
                f"received type: {type(data)}.",
                INVALID_PARAMETER_VALUE,
            )
        # Return numpy array for serving purposes.
        return keras.ops.convert_to_numpy(model_call(data))


def _load_keras_model(path, model_conf, custom_objects=None, **load_model_kwargs):
    save_exported_model = model_conf.flavors["keras"].get("save_exported_model")
    model_path = os.path.join(path, model_conf.flavors["keras"].get("data", _MODEL_SAVE_PATH))
    if os.path.isdir(model_path):
        model_path = os.path.join(model_path, _MODEL_SAVE_PATH)
    if save_exported_model:
        try:
            import tensorflow as tf
        except ImportError:
            raise MlflowException(
                "`tensorflow` must be installed if you want to load an exported Keras 3 model, "
                "please install `tensorflow` by `pip install tensorflow`."
            )
        return tf.saved_model.load(model_path)
    else:
        model_path += ".keras"
        return keras.saving.load_model(
            model_path,
            custom_objects=custom_objects,
            **load_model_kwargs,
        )


def load_model(model_uri, dst_path=None, custom_objects=None, load_model_kwargs=None):
    """
    Load Keras model from MLflow.

    This method loads a saved Keras model from MLflow, and returns a Keras model instance.

    Args:
        model_uri: The URI of the saved Keras model in MLflow. For example:

            - `/Users/me/path/to/local/model`
            - `relative/path/to/local/model`
            - `s3://my_bucket/path/to/model`
            - `runs:/<mlflow_run_id>/run-relative/path/to/model`
            - `models:/<model_name>/<model_version>`
            - `models:/<model_name>/<stage>`

            For more information about supported URI schemes, see `Referencing
            Artifacts <https://www.mlflow.org/docs/latest/concepts.html#artifact-locations>`_.
        dst_path: The local filesystem path to which to download the
            model artifact. If unspecified, a local output path will be created.
        custom_objects: The `custom_objects` arg in
            `keras.saving.load_model`.
        load_model_kwargs: Extra args for `keras.saving.load_model`.

    .. code-block:: python
        :caption: Example

        import keras
        import mlflow
        import numpy as np

        model = keras.Sequential(
            [
                keras.Input([28, 28, 3]),
                keras.layers.Flatten(),
                keras.layers.Dense(2),
            ]
        )
        with mlflow.start_run() as run:
            mlflow.keras.log_model(model)

        model_url = f"runs:/{run.info.run_id}/{model_path}"
        loaded_model = mlflow.keras.load_model(model_url)

        # Test the loaded model produces the same output for the same input as the model.
        test_input = np.random.uniform(size=[2, 28, 28, 3])
        np.testing.assert_allclose(
            keras.ops.convert_to_numpy(model(test_input)),
            loaded_model.predict(test_input),
        )

    Returns:
        A Keras model instance.
    """
    local_model_path = _download_artifact_from_uri(artifact_uri=model_uri, output_path=dst_path)
    load_model_kwargs = {} if load_model_kwargs is None else load_model_kwargs

    model_configuration_path = os.path.join(local_model_path, MLMODEL_FILE_NAME)
    model_conf = Model.load(model_configuration_path)

    return _load_keras_model(local_model_path, model_conf, custom_objects, **load_model_kwargs)


def _load_pyfunc(path):
    """Logics of loading a saved Keras model as a PyFunc model.

    This function is called by `mlflow.pyfunc.load_model`.

    Args:
        path: Local filesystem path to the MLflow Model with the `keras` flavor.
    """
    model_meta_path1 = os.path.join(path, MLMODEL_FILE_NAME)
    model_meta_path2 = os.path.join(os.path.dirname(path), MLMODEL_FILE_NAME)

    if os.path.isfile(model_meta_path1):
        model_conf = Model.load(model_meta_path1)
    elif os.path.isfile(model_meta_path2):
        model_conf = Model.load(model_meta_path2)
    else:
        raise MlflowException(f"Cannot find file {MLMODEL_FILE_NAME} for the logged model.")

    save_exported_model = model_conf.flavors["keras"].get("save_exported_model")

    loaded_model = _load_keras_model(path, model_conf)
    return KerasModelWrapper(loaded_model, model_conf.signature, save_exported_model)
```

--------------------------------------------------------------------------------

---[FILE: save.py]---
Location: mlflow-master/mlflow/keras/save.py

```python
"""Functions for saving Keras models to MLflow."""

import importlib
import logging
import os
import shutil
import tempfile
from typing import Any

import keras
import yaml

import mlflow
from mlflow import pyfunc
from mlflow.exceptions import INVALID_PARAMETER_VALUE, MlflowException
from mlflow.models import (
    Model,
    ModelInputExample,
    ModelSignature,
    infer_pip_requirements,
)
from mlflow.models.model import MLMODEL_FILE_NAME
from mlflow.models.utils import _save_example
from mlflow.tracking._model_registry import DEFAULT_AWAIT_MAX_SLEEP_SECONDS
from mlflow.types.schema import TensorSpec
from mlflow.utils.docstring_utils import LOG_MODEL_PARAM_DOCS, format_docstring
from mlflow.utils.environment import (
    _CONDA_ENV_FILE_NAME,
    _CONSTRAINTS_FILE_NAME,
    _PYTHON_ENV_FILE_NAME,
    _REQUIREMENTS_FILE_NAME,
    _mlflow_conda_env,
    _process_conda_env,
    _process_pip_requirements,
    _PythonEnv,
)
from mlflow.utils.file_utils import get_total_file_size, write_to
from mlflow.utils.requirements_utils import _get_pinned_requirement

FLAVOR_NAME = "keras"

_MODEL_SAVE_PATH = "model"
_KERAS_MODULE_SPEC_PATH = "keras_module.txt"

_logger = logging.getLogger(__name__)


_MODEL_DATA_PATH = "data"


def get_default_pip_requirements():
    """
    Returns:
        A list of default pip requirements for MLflow Models produced by Keras flavor. Calls to
        `save_model()` and `log_model()` produce a pip environment that, at minimum, contains these
        requirements.
    """
    return [_get_pinned_requirement("keras")]


def get_default_conda_env():
    """
    Returns:
        The default Conda environment for MLflow Models produced by calls to `save_model()` and
        `log_model()`.
    """
    return _mlflow_conda_env(additional_pip_deps=get_default_pip_requirements())


def _export_keras_model(model, path, signature):
    if signature is None:
        raise ValueError(
            "`signature` cannot be None when `save_exported_model=True` for "
            "`mlflow.keras.save_model()` method."
        )
    try:
        import tensorflow as tf
    except ImportError:
        raise MlflowException(
            "`tensorflow` must be installed if you want to export a Keras 3 model, please "
            "install `tensorflow` by `pip install tensorflow`, or set `save_exported_model=False`."
        )
    input_schema = signature.inputs.to_dict()
    export_signature = []
    for schema in input_schema:
        dtype = schema["tensor-spec"]["dtype"]
        shape = schema["tensor-spec"]["shape"]
        # Replace -1 with None in shape.
        new_shape = [size if size != -1 else None for size in shape]
        export_signature.append(tf.TensorSpec(shape=new_shape, dtype=dtype))

    export_archive = keras.export.ExportArchive()
    export_archive.track(model)
    export_archive.add_endpoint(
        name="serve",
        fn=model.call,
        input_signature=export_signature,
    )
    export_archive.write_out(path)


@format_docstring(LOG_MODEL_PARAM_DOCS.format(package_name=FLAVOR_NAME))
def save_model(
    model,
    path,
    save_exported_model=False,
    conda_env=None,
    mlflow_model=None,
    signature: ModelSignature = None,
    input_example: ModelInputExample = None,
    pip_requirements=None,
    extra_pip_requirements=None,
    save_model_kwargs=None,
    metadata=None,
):
    """
    Save a Keras model along with metadata.

    This method saves a Keras model along with metadata such as model signature and conda
    environments to local file system. This method is called inside `mlflow.keras.log_model()`.

    Args:
        model: an instance of `keras.Model`. The Keras model to be saved.
        path: local path where the MLflow model is to be saved.
        save_exported_model: If True, save Keras model in exported model
            format, otherwise save in `.keras` format. For more information, please
            refer to https://keras.io/guides/serialization_and_saving/.
        conda_env: {{ conda_env }}
        mlflow_model: an instance of `mlflow.models.Model`, defaults to None. MLflow model
            configuration to which to add the Keras model metadata. If None, a blank instance will
            be created.
        signature: {{ signature }}
        input_example: {{ input_example }}
        pip_requirements: {{ pip_requirements }}
        extra_pip_requirements: {{ extra_pip_requirements }}
        save_model_kwargs: A dict of kwargs to pass to `keras.Model.save`
            method.
        metadata: {{ metadata }}

    .. code-block:: python
        :caption: Example

        import keras
        import mlflow

        model = keras.Sequential(
            [
                keras.Input([28, 28, 3]),
                keras.layers.Flatten(),
                keras.layers.Dense(2),
            ]
        )
        with mlflow.start_run() as run:
            mlflow.keras.save_model(model, "./model")
    """

    import keras

    if signature is None:
        _logger.warning("You are saving a Keras model without specifying model signature.")
    else:
        num_inputs = len(signature.inputs.inputs)
        if num_inputs == 0:
            raise MlflowException(
                "The model signature's input schema must contain at least one field.",
                error_code=INVALID_PARAMETER_VALUE,
            )
        for field in signature.inputs.inputs:
            if not isinstance(field, TensorSpec):
                raise MlflowException(
                    "All fields in the model signature's input schema must be of type TensorSpec.",
                    error_code=INVALID_PARAMETER_VALUE,
                )
            if field.shape[0] != -1:
                raise MlflowException(
                    "All input schema' first dimension should be -1, which represents the dynamic "
                    "batch dimension.",
                    error_code=INVALID_PARAMETER_VALUE,
                )

    if mlflow_model is None:
        mlflow_model = Model()
    if signature is not None:
        mlflow_model.signature = signature
    if input_example is not None:
        _save_example(mlflow_model, input_example, path)
    if metadata is not None:
        mlflow_model.metadata = metadata

    save_model_kwargs = save_model_kwargs or {}

    data_subpath = _MODEL_DATA_PATH
    # Construct new data folder in existing path.
    data_path = os.path.join(path, data_subpath)
    os.makedirs(data_path)

    model_subpath = os.path.join(data_subpath, _MODEL_SAVE_PATH)
    keras_module = importlib.import_module("keras")

    # Save keras module spec to path/data/keras_module.txt
    with open(os.path.join(data_path, _KERAS_MODULE_SPEC_PATH), "w") as f:
        f.write(keras_module.__name__)

    if save_exported_model:
        model_path = os.path.join(path, model_subpath)
        _export_keras_model(model, model_path, signature)
    else:
        # Save path requires ".keras" suffix.
        file_extension = ".keras"
        model_path = os.path.join(path, model_subpath) + file_extension
        if path.startswith("/dbfs/"):
            # The Databricks Filesystem uses a FUSE implementation that does not support
            # random writes. It causes an error.
            with tempfile.NamedTemporaryFile(suffix=".keras") as f:
                model.save(f.name, **save_model_kwargs)
                f.flush()  # force flush the data
                shutil.copy2(src=f.name, dst=model_path)
        else:
            model.save(model_path, **save_model_kwargs)

    flavor_options = {
        "data": data_subpath,
        "keras_version": keras.__version__,
        "keras_backend": keras.backend.backend(),
        "save_exported_model": save_exported_model,
    }

    # Add flavor info to `mlflow_model`.
    mlflow_model.add_flavor(FLAVOR_NAME, **flavor_options)

    # Add loader_module, data and env data to `mlflow_model`.
    pyfunc.add_to_model(
        mlflow_model,
        loader_module="mlflow.keras",
        conda_env=_CONDA_ENV_FILE_NAME,
        python_env=_PYTHON_ENV_FILE_NAME,
    )

    # Add model file size to `mlflow_model`.
    if size := get_total_file_size(path):
        mlflow_model.model_size_bytes = size

    # save mlflow_model to path/MLmodel
    mlflow_model.save(os.path.join(path, MLMODEL_FILE_NAME))

    if conda_env is None:
        if pip_requirements is None:
            default_reqs = get_default_pip_requirements()
            # To ensure `_load_pyfunc` can successfully load the model during the dependency
            # inference, `mlflow_model.save` must be called beforehand to save an MLmodel file.
            inferred_reqs = infer_pip_requirements(path, FLAVOR_NAME, fallback=default_reqs)
            default_reqs = sorted(set(inferred_reqs).union(default_reqs))
        else:
            default_reqs = None
        conda_env, pip_requirements, pip_constraints = _process_pip_requirements(
            default_reqs,
            pip_requirements,
            extra_pip_requirements,
        )
    else:
        conda_env, pip_requirements, pip_constraints = _process_conda_env(conda_env)

    with open(os.path.join(path, _CONDA_ENV_FILE_NAME), "w") as f:
        yaml.safe_dump(conda_env, stream=f, default_flow_style=False)

    # Save `constraints.txt` if necessary.
    if pip_constraints:
        write_to(os.path.join(path, _CONSTRAINTS_FILE_NAME), "\n".join(pip_constraints))

    # Save `requirements.txt`.
    write_to(os.path.join(path, _REQUIREMENTS_FILE_NAME), "\n".join(pip_requirements))

    _PythonEnv.current().to_yaml(os.path.join(path, _PYTHON_ENV_FILE_NAME))


@format_docstring(LOG_MODEL_PARAM_DOCS.format(package_name=FLAVOR_NAME))
def log_model(
    model,
    artifact_path: str | None = None,
    save_exported_model=False,
    conda_env=None,
    signature: ModelSignature = None,
    input_example: ModelInputExample = None,
    registered_model_name=None,
    await_registration_for=DEFAULT_AWAIT_MAX_SLEEP_SECONDS,
    pip_requirements=None,
    extra_pip_requirements=None,
    save_model_kwargs=None,
    metadata=None,
    name: str | None = None,
    params: dict[str, Any] | None = None,
    tags: dict[str, Any] | None = None,
    model_type: str | None = None,
    step: int = 0,
    model_id: str | None = None,
):
    """
    Log a Keras model along with metadata to MLflow.

    This method saves a Keras model along with metadata such as model signature and conda
    environments to MLflow.

    Args:
        model: an instance of `keras.Model`. The Keras model to be saved.
        artifact_path: Deprecated. Use `name` instead.
        save_exported_model: defaults to False. If True, save Keras model in exported
            model format, otherwise save in `.keras` format. For more information, please
            refer to `Keras doc <https://keras.io/guides/serialization_and_saving/>`_.
        conda_env: {{ conda_env }}
        signature: {{ signature }}
        input_example: {{ input_example }}
        registered_model_name: defaults to None. If set, create a model version under
            `registered_model_name`, also create a registered model if one with the given name does
            not exist.
        await_registration_for: defaults to
            `mlflow.tracking._model_registry.DEFAULT_AWAIT_MAX_SLEEP_SECONDS`. Number of
            seconds to wait for the model version to finish being created and is in ``READY``
            status. By default, the function waits for five minutes. Specify 0 or None to skip
            waiting.
        pip_requirements: {{ pip_requirements }}
        extra_pip_requirements: {{ extra_pip_requirements }}
        save_model_kwargs: defaults to None. A dict of kwargs to pass to
            `keras.Model.save` method.
        metadata: Custom metadata dictionary passed to the model and stored in the MLmodel
            file.
        name: {{ name }}
        params: {{ params }}
        tags: {{ tags }}
        model_type: {{ model_type }}
        step: {{ step }}
        model_id: {{ model_id }}

    .. code-block:: python
        :caption: Example

        import keras
        import mlflow

        model = keras.Sequential(
            [
                keras.Input([28, 28, 3]),
                keras.layers.Flatten(),
                keras.layers.Dense(2),
            ]
        )
        with mlflow.start_run() as run:
            mlflow.keras.log_model(model, name="model")
    """
    return Model.log(
        artifact_path=artifact_path,
        name=name,
        flavor=mlflow.keras,
        model=model,
        conda_env=conda_env,
        registered_model_name=registered_model_name,
        signature=signature,
        input_example=input_example,
        await_registration_for=await_registration_for,
        pip_requirements=pip_requirements,
        extra_pip_requirements=extra_pip_requirements,
        save_model_kwargs=save_model_kwargs,
        save_exported_model=save_exported_model,
        metadata=metadata,
        params=params,
        tags=tags,
        model_type=model_type,
        step=step,
        model_id=model_id,
    )
```

--------------------------------------------------------------------------------

---[FILE: utils.py]---
Location: mlflow-master/mlflow/keras/utils.py

```python
import numpy as np

from mlflow.models import ModelSignature
from mlflow.types import Schema, TensorSpec


def get_model_signature(model):
    def replace_none_in_shape(shape):
        return [-1 if dim_size is None else dim_size for dim_size in shape]

    input_shape = model.input_shape
    input_dtype = model.input_dtype
    output_shape = model.output_shape
    output_dtype = model.compute_dtype

    if isinstance(input_shape, list):
        input_schema = Schema(
            [
                TensorSpec(np.dtype(input_dtype), replace_none_in_shape(shape))
                for shape in input_shape
            ]
        )
    else:
        input_schema = Schema(
            [TensorSpec(np.dtype(input_dtype), replace_none_in_shape(input_shape))]
        )
    if isinstance(output_shape, list):
        output_schema = Schema(
            [
                TensorSpec(np.dtype(output_dtype), replace_none_in_shape(shape))
                for shape in output_shape
            ]
        )
    else:
        output_schema = Schema(
            [TensorSpec(np.dtype(output_dtype), replace_none_in_shape(output_shape))]
        )
    return ModelSignature(inputs=input_schema, outputs=output_schema)
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/keras/__init__.py

```python
# MLflow Keras 3 flavor.
import keras
from packaging.version import Version

if Version(keras.__version__).major < 3:
    from mlflow.tensorflow import (
        # Redirect `mlflow.keras._load_pyfunc` to `mlflow.tensorflow._load_pyfunc`,
        # For backwards compatibility on loading keras model saved by old mlflow versions.
        _load_pyfunc,
        autolog,
        load_model,
        log_model,
        save_model,
    )

    __all__ = [
        "_load_pyfunc",
        "autolog",
        "load_model",
        "save_model",
        "log_model",
    ]
else:
    from mlflow.keras.autologging import autolog
    from mlflow.keras.callback import MlflowCallback
    from mlflow.keras.load import _load_pyfunc, load_model
    from mlflow.keras.save import (
        get_default_conda_env,
        get_default_pip_requirements,
        log_model,
        save_model,
    )

    FLAVOR_NAME = "keras"

    MLflowCallback = MlflowCallback  # for backwards compatibility

    __all__ = [
        "_load_pyfunc",
        "MlflowCallback",
        "MLflowCallback",
        "autolog",
        "load_model",
        "save_model",
        "log_model",
        "get_default_pip_requirements",
        "get_default_conda_env",
    ]
```

--------------------------------------------------------------------------------

````
