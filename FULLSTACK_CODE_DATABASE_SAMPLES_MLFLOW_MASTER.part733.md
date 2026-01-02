---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 733
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 733 of 991)

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

---[FILE: data_utils.py]---
Location: mlflow-master/mlflow/utils/data_utils.py

```python
import urllib.parse


def parse_s3_uri(uri):
    """Parse an S3 URI, returning (bucket, path)"""
    parsed = urllib.parse.urlparse(uri)
    if parsed.scheme != "s3":
        raise Exception(f"Not an S3 URI: {uri}")
    path = parsed.path
    path = path.removeprefix("/")
    return parsed.netloc, path


def is_uri(string):
    parsed_uri = urllib.parse.urlparse(string)
    return len(parsed_uri.scheme) > 0
```

--------------------------------------------------------------------------------

---[FILE: docstring_utils.py]---
Location: mlflow-master/mlflow/utils/docstring_utils.py

```python
import textwrap
import warnings
from typing import Any

from mlflow.ml_package_versions import _ML_PACKAGE_VERSIONS
from mlflow.utils.autologging_utils.versioning import (
    get_min_max_version_and_pip_release,
)


def _create_placeholder(key: str):
    return "{{ " + key + " }}"


def _replace_keys_with_placeholders(d: dict[str, Any]) -> dict[str, Any]:
    return {_create_placeholder(k): v for k, v in d.items()}


def _get_indentation_of_key(line: str, placeholder: str) -> str:
    index = line.find(placeholder)
    return (index * " ") if index != -1 else ""


def _indent(text: str, indent: str) -> str:
    """Indent everything but first line in text."""
    lines = text.splitlines()
    if len(lines) <= 1:
        return text

    else:
        first_line = lines[0]
        subsequent_lines = "\n".join(list(lines[1:]))
        indented_subsequent_lines = textwrap.indent(subsequent_lines, indent)
        return first_line + "\n" + indented_subsequent_lines


def _replace_all(text: str, replacements: dict[str, str]) -> str:
    """
    Replace all instances of replacements.keys() with their corresponding
    values in text. The replacements will be inserted on the same line
    with wrapping to the same level of indentation, for example:

    ```
    Args:
        param_1: {{ key }}
    ```

    will become...

    ```
    Args:
        param_1: replaced_value_at same indentation as prior
                 and if there are more lines they will also
                 have the same indentation.
    ```
    """
    for key, value in replacements.items():
        if key in text:
            indent = _get_indentation_of_key(text, key)
            indented_value = _indent(value, indent)
            text = text.replace(key, indented_value)
    return text


class ParamDocs(dict):
    """
    Represents a set of parameter documents in the docstring.
    """

    def __repr__(self):
        return f"ParamDocs({super().__repr__()})"

    def format(self, **kwargs):
        """
        Formats values to be substituted in via the format_docstring() method.

        Args:
            kwargs: A `dict` in the form of `{"< placeholder name >": "< value >"}`.

        Returns:
            A new `ParamDocs` instance with the formatted param docs.

        .. code-block:: text
            :caption: Example

            >>> pd = ParamDocs(p1="{{ doc1 }}", p2="{{ doc2 }}")
            >>> pd.format(doc1="foo", doc2="bar")
            ParamDocs({'p1': 'foo', 'p2': 'bar'})
        """
        replacements = _replace_keys_with_placeholders(kwargs)
        return ParamDocs({k: _replace_all(v, replacements) for k, v in self.items()})

    def format_docstring(self, docstring: str) -> str:
        """
        Formats placeholders in `docstring`.

        Args:
            docstring: A docstring with placeholders to be replaced.
                If provided with None, will return None.

        .. code-block:: text
            :caption: Example

            >>> pd = ParamDocs(p1="doc1", p2="doc2
            doc2 second line")
            >>> docstring = '''
            ... Args:
            ...     p1: {{ p1 }}
            ...     p2: {{ p2 }}
            ... '''.strip()
            >>> print(pd.format_docstring(docstring))
        """
        if docstring is None:
            return None

        replacements = _replace_keys_with_placeholders(self)
        lines = docstring.splitlines()
        for i, line in enumerate(lines):
            lines[i] = _replace_all(line, replacements)

        return "\n".join(lines)


def format_docstring(param_docs):
    """
    Returns a decorator that replaces param doc placeholders (e.g. '{{ param_name }}') in the
    docstring of the decorated function.

    Args:
        param_docs: A `ParamDocs` instance or `dict`.

    Returns:
        A decorator to apply the formatting.

    .. code-block:: text
        :caption: Example

        >>> param_docs = {"p1": "doc1", "p2": "doc2
        doc2 second line"}
        >>> @format_docstring(param_docs)
        ... def func(p1, p2):
        ...     '''
        ...     Args:
        ...         p1: {{ p1 }}
        ...         p2: {{ p2 }}
        ...     '''
        >>> import textwrap
        >>> print(textwrap.dedent(func.__doc__).strip())

        Args:
            p1: doc1
            p2: doc2
                doc2 second line
    """
    param_docs = ParamDocs(param_docs)

    def decorator(func):
        func.__doc__ = param_docs.format_docstring(func.__doc__)
        return func

    return decorator


# `{{ ... }}` represents a placeholder.
LOG_MODEL_PARAM_DOCS = ParamDocs(
    {
        "name": "Model name.",
        "conda_env": (
            """Either a dictionary representation of a Conda environment or the path to a conda
environment yaml file. If provided, this describes the environment this model should be run in.
At a minimum, it should specify the dependencies contained in `get_default_conda_env()`.
If ``None``, a conda environment with pip requirements inferred by
:func:`mlflow.models.infer_pip_requirements` is added
to the model. If the requirement inference fails, it falls back to using
`get_default_pip_requirements`. pip requirements from ``conda_env`` are written to a pip
``requirements.txt`` file and the full conda environment is written to ``conda.yaml``.
The following is an *example* dictionary representation of a conda environment::

    {
        "name": "mlflow-env",
        "channels": ["conda-forge"],
        "dependencies": [
            "python=3.8.15",
            {
                "pip": [
                    "{{ package_name }}==x.y.z"
                ],
            },
        ],
    }"""
        ),
        "pip_requirements": (
            """Either an iterable of pip requirement strings
(e.g. ``["{{ package_name }}", "-r requirements.txt", "-c constraints.txt"]``) or the string path to
a pip requirements file on the local filesystem (e.g. ``"requirements.txt"``). If provided, this
describes the environment this model should be run in. If ``None``, a default list of requirements
is inferred by :func:`mlflow.models.infer_pip_requirements` from the current software environment.
If the requirement inference fails, it falls back to using `get_default_pip_requirements`.
Both requirements and constraints are automatically parsed and written to ``requirements.txt`` and
``constraints.txt`` files, respectively, and stored as part of the model. Requirements are also
written to the ``pip`` section of the model's conda environment (``conda.yaml``) file."""
        ),
        "extra_pip_requirements": (
            """Either an iterable of pip
requirement strings
(e.g. ``["pandas", "-r requirements.txt", "-c constraints.txt"]``) or the string path to
a pip requirements file on the local filesystem (e.g. ``"requirements.txt"``). If provided, this
describes additional pip requirements that are appended to a default set of pip requirements
generated automatically based on the user's current software environment. Both requirements and
constraints are automatically parsed and written to ``requirements.txt`` and ``constraints.txt``
files, respectively, and stored as part of the model. Requirements are also written to the ``pip``
section of the model's conda environment (``conda.yaml``) file.

.. warning::
    The following arguments can't be specified at the same time:

    - ``conda_env``
    - ``pip_requirements``
    - ``extra_pip_requirements``

`This example <https://github.com/mlflow/mlflow/blob/master/examples/pip_requirements/pip_requirements.py>`_ demonstrates how to specify pip requirements using
``pip_requirements`` and ``extra_pip_requirements``."""  # noqa: E501
        ),
        "signature": (
            """an instance of the :py:class:`ModelSignature <mlflow.models.ModelSignature>`
class that describes the model's inputs and outputs. If not specified but an
``input_example`` is supplied, a signature will be automatically inferred
based on the supplied input example and model. To disable automatic signature
inference when providing an input example, set ``signature`` to ``False``.
To manually infer a model signature, call
:py:func:`infer_signature() <mlflow.models.infer_signature>` on datasets
with valid model inputs, such as a training dataset with the target column
omitted, and valid model outputs, like model predictions made on the training
dataset, for example:

.. code-block:: python

    from mlflow.models import infer_signature

    train = df.drop_column("target_label")
    predictions = ...  # compute model predictions
    signature = infer_signature(train, predictions)
"""
        ),
        "metadata": (
            "Custom metadata dictionary passed to the model and stored in the MLmodel file."
        ),
        "input_example": (
            """one or several instances of valid model input. The input example is used
as a hint of what data to feed the model. It will be converted to a Pandas
DataFrame and then serialized to json using the Pandas split-oriented
format, or a numpy array where the example will be serialized to json
by converting it to a list. Bytes are base64-encoded. When the ``signature`` parameter is
``None``, the input example is used to infer a model signature.
"""
        ),
        "prompt_template": (
            """A string that, if provided, will be used to format the user's input prior
to inference. The string should contain a single placeholder, ``{prompt}``, which will be
replaced with the user's input. For example: ``"Answer the following question. Q: {prompt} A:"``.

Currently, only the following pipeline types are supported:

- `feature-extraction <https://huggingface.co/transformers/main_classes/pipelines.html#transformers.FeatureExtractionPipeline>`_
- `fill-mask <https://huggingface.co/transformers/main_classes/pipelines.html#transformers.FillMaskPipeline>`_
- `summarization <https://huggingface.co/transformers/main_classes/pipelines.html#transformers.SummarizationPipeline>`_
- `text2text-generation <https://huggingface.co/transformers/main_classes/pipelines.html#transformers.Text2TextGenerationPipeline>`_
- `text-generation <https://huggingface.co/transformers/main_classes/pipelines.html#transformers.TextGenerationPipeline>`_

The following example shows how to log a text-generation pipeline with a prompt template and
use it via the ``python_function`` (pyfunc) flavor:

.. code-block:: python

    import mlflow
    from transformers import pipeline

    # Initialize a text-generation pipeline
    generator = pipeline("text-generation", model="gpt2")

    # Define a prompt template. The ``{prompt}`` placeholder will be replaced
    # with the raw user input at inference time.
    prompt_template = "Answer the following question concisely.\\n\\nQ: {prompt}\\nA:"

    example_prompt = "What is MLflow?"

    # Log the model with the prompt template and an input example
    with mlflow.start_run():
        model_info = mlflow.transformers.log_model(
            transformers_model=generator,
            name="qa_text_generator",
            prompt_template=prompt_template,
            input_example=example_prompt,
        )

    # Load the model back as a pyfunc model
    loaded_model = mlflow.pyfunc.load_model(model_info.model_uri)

    # The input to ``predict`` is the raw question string; the prompt template
    # is applied internally before calling the underlying transformers pipeline.
    loaded_model.predict("What is experiment tracking?")
"""
        ),
        "code_paths": (
            """A list of local filesystem paths to Python file dependencies (or directories
containing file dependencies). These files are *prepended* to the system path when the model
is loaded. Files declared as dependencies for a given model should have relative
imports declared from a common root path if multiple files are defined with import dependencies
between them to avoid import errors when loading the model.

For a detailed explanation of ``code_paths`` functionality, recommended usage patterns and
limitations, see the
`code_paths usage guide <https://mlflow.org/docs/latest/model/dependencies.html?highlight=code_paths#saving-extra-code-with-an-mlflow-model>`_.
"""
        ),
        # Only pyfunc flavor supports `infer_code_paths`.
        "code_paths_pyfunc": (
            """A list of local filesystem paths to Python file dependencies (or directories
containing file dependencies). These files are *prepended* to the system path when the model
is loaded. Files declared as dependencies for a given model should have relative
imports declared from a common root path if multiple files are defined with import dependencies
between them to avoid import errors when loading the model.

You can leave ``code_paths`` argument unset but set ``infer_code_paths`` to ``True`` to let MLflow
infer the model code paths. See ``infer_code_paths`` argument doc for details.

For a detailed explanation of ``code_paths`` functionality, recommended usage patterns and
limitations, see the
`code_paths usage guide <https://mlflow.org/docs/latest/model/dependencies.html?highlight=code_paths#saving-extra-code-with-an-mlflow-model>`_.
"""
        ),
        "infer_code_paths": (
            """If set to ``True``, MLflow automatically infers model code paths. The inferred
            code path files only include necessary python module files. Only python code files
            under current working directory are automatically inferable. Default value is
            ``False``.

.. warning::
    Please ensure that the custom python module code does not contain sensitive data such as
    credential token strings, otherwise they might be included in the automatic inferred code
    path files and be logged to MLflow artifact repository.

    If your custom python module depends on non-python files (e.g. a JSON file) with a relative
    path to the module code file path, the non-python files can't be automatically inferred as the
    code path file. To address this issue, you should put all used non-python files outside
    your custom code directory.

    If a python code file is loaded as the python ``__main__`` module, then this code file can't be
    inferred as the code path file. If your model depends on classes / functions defined in
    ``__main__`` module, you should use `cloudpickle` to dump your model instance in order to pickle
    classes / functions in ``__main__``.

.. Note:: Experimental: This parameter may change or be removed in a future release without warning.
"""
        ),
        "save_pretrained": (
            """If set to ``False``, MLflow will not save the Transformer model weight files,
instead only saving the reference to the HuggingFace Hub model repository and its commit hash.
This is useful when you load the pretrained model from HuggingFace Hub and want to log or save
it to MLflow without modifying the model weights. In such case, specifying this flag to
``False`` will save the storage space and reduce time to save the model. Please refer to the
`Storage-Efficient Model Logging
<../../llms/transformers/large-models.html#transformers-save-pretrained-guide>`_ for more detailed
usage.


.. warning::

    If the model is saved with ``save_pretrained`` set to ``False``, the model cannot be
    registered to the MLflow Model Registry. In order to convert the model to the one that
    can be registered, you can use :py:func:`mlflow.transformers.persist_pretrained_model()`
    to download the model weights from the HuggingFace Hub and save it in the existing model
    artifacts. Please refer to `Transformers flavor documentation
    <../../llms/transformers/large-models.html#persist-pretrained-guide>`_
    for more detailed usage.

    .. code-block:: python

        import mlflow.transformers

        model_uri = "YOUR_MODEL_URI_LOGGED_WITH_SAVE_PRETRAINED_FALSE"
        model = mlflow.transformers.persist_pretrained_model(model_uri)
        mlflow.register_model(model_uri, "model_name")

.. important::

    When you save the `PEFT <https://huggingface.co/docs/peft/en/index>`_ model, MLflow will
    override the `save_pretrained` flag to `False` and only store the PEFT adapter weights. The
    base model weights are not saved but the reference to the HuggingFace repository and
    its commit hash are logged instead.
"""
        ),
        "auth_policy": (
            """Specifies the authentication policy for the model, which includes two key components.
            Note that only one of `auth_policy` or `resources` should be defined.

                - **System Auth Policy**: A list of resources required to serve this model.
                - **User Auth Policy**: A minimal list of scopes that the user should have access to
                    ,in order to invoke this model.

    .. Note::
        Experimental: This parameter may change or be removed in a future release without warning.
            """
        ),
        "params": "A dictionary of parameters to log with the model.",
        "tags": "A dictionary of tags to log with the model.",
        "model_type": "The type of the model.",
        "step": "The step at which to log the model outputs and metrics",
        "model_id": "The ID of the model.",
        "prompts": """\
A list of prompt URIs registered in the MLflow Prompt Registry, to be associated with the model.
Each prompt URI should be in the form ``prompt:/<name>/<version>``. The prompts should be
registered in the MLflow Prompt Registry before being associated with the model.

This will create a mutual link between the model and the prompt. The associated prompts can be
seen in the model's metadata stored in the MLmodel file. From the Prompt Registry UI, you can
navigate to the model as well.

.. code-block:: python

    import mlflow

    prompt_template = "Hi, {name}! How are you doing today?"

    # Register a prompt in the MLflow Prompt Registry
    mlflow.prompts.register_prompt("my_prompt", prompt_template, description="A simple prompt")

    # Log a model with the registered prompt
    with mlflow.start_run():
        model_info = mlflow.pyfunc.log_model(
            name=MyModel(),
            name="model",
            prompts=["prompt:/my_prompt/1"]
        )

    print(model_info.prompts)
    # Output: ['prompt:/my_prompt/1']

    # Load the prompt
    prompt = mlflow.genai.load_prompt(model_info.prompts[0])
""",
    }
)


def get_module_min_and_max_supported_ranges(flavor_name):
    """
    Extracts the minimum and maximum supported package versions from the provided module name.
    The version information is provided via the yaml-to-python-script generation script in
    dev/update_ml_package_versions.py which writes a python file to the importable namespace of
    mlflow.ml_package_versions

    Args:
        flavor_name: The flavor name registered in ml_package_versions.py

    Returns:
        tuple of module name, minimum supported version, maximum supported version as strings.
    """
    if flavor_name == "pyspark.ml":
        # pyspark.ml is a special case of spark flavor
        flavor_name = "spark"

    module_name = _ML_PACKAGE_VERSIONS[flavor_name]["package_info"].get("module_name", flavor_name)
    versions = _ML_PACKAGE_VERSIONS[flavor_name]["models"]
    min_version = versions["minimum"]
    max_version = versions["maximum"]
    return module_name, min_version, max_version


def _do_version_compatibility_warning(msg: str):
    """
    Isolate the warn call to show the warning only once.
    """
    warnings.warn(msg, category=UserWarning, stacklevel=2)


def docstring_version_compatibility_warning(integration_name):
    """
    Generates a docstring that can be applied as a note stating a version compatibility range for
    a given flavor and optionally raises a warning if the installed version is outside of the
    supported range.

    Args:
        integration_name: The name of the module as stored within ml-package-versions.yml

    Returns:
        The wrapped function with the additional docstring header applied
    """

    def annotated_func(func):
        # NB: if using this decorator, ensure the package name to module name reference is
        # updated with the flavor's `save` and `load` functions being used within
        # ml-package-version.yml file.
        min_ver, max_ver, pip_release = get_min_max_version_and_pip_release(
            integration_name, "models"
        )
        notice = (
            f"The '{integration_name}' MLflow Models integration is known to be compatible with "
            f"``{min_ver}`` <= ``{pip_release}`` <= ``{max_ver}``. "
            f"MLflow Models integrations with {integration_name} may not succeed when used with "
            "package versions outside of this range."
        )

        func.__doc__ = (
            "    .. Note:: " + notice + "\n" * 2 + func.__doc__ if func.__doc__ else notice
        )

        return func

    return annotated_func
```

--------------------------------------------------------------------------------

---[FILE: doctor.py]---
Location: mlflow-master/mlflow/utils/doctor.py
Signals: Flask, SQLAlchemy

```python
import os
import platform

import click
import importlib_metadata
import yaml
from packaging.requirements import Requirement

import mlflow
from mlflow.utils.databricks_utils import get_databricks_runtime_version


def doctor(mask_envs=False):
    """Prints out useful information for debugging issues with MLflow.

    Args:
        mask_envs: If True, mask the MLflow environment variable values
            (e.g. `"MLFLOW_ENV_VAR": "***"`) in the output to prevent leaking sensitive
            information.

    .. warning::

        - This API should only be used for debugging purposes.
        - The output may contain sensitive information such as a database URI containing a password.

    .. code-block:: python
        :caption: Example

        import mlflow

        with mlflow.start_run():
            mlflow.doctor()

    .. code-block:: text
        :caption: Output

        System information: Linux #58~20.04.1-Ubuntu SMP Thu Oct 13 13:09:46 UTC 2022
        Python version: 3.8.13
        MLflow version: 2.0.1
        MLflow module location: /usr/local/lib/python3.8/site-packages/mlflow/__init__.py
        Tracking URI: sqlite:///mlflow.db
        Registry URI: sqlite:///mlflow.db
        MLflow environment variables:
          MLFLOW_TRACKING_URI: sqlite:///mlflow.db
        MLflow dependencies:
          Flask: 2.2.2
          Jinja2: 3.0.3
          alembic: 1.8.1
          click: 8.1.3
          cloudpickle: 2.2.0
          databricks-cli: 0.17.4.dev0
          docker: 6.0.0
          entrypoints: 0.4
          gitpython: 3.1.29
          gunicorn: 20.1.0
          importlib-metadata: 5.0.0
          markdown: 3.4.1
          matplotlib: 3.6.1
          numpy: 1.23.4
          packaging: 21.3
          pandas: 1.5.1
          protobuf: 3.19.6
          pyarrow: 9.0.0
          pytz: 2022.6
          pyyaml: 6.0
          querystring-parser: 1.2.4
          requests: 2.28.1
          scikit-learn: 1.1.3
          scipy: 1.9.3
          shap: 0.41.0
          sqlalchemy: 1.4.42
          sqlparse: 0.4.3
    """
    items = [
        ("System information", " ".join((platform.system(), platform.version()))),
        ("Python version", platform.python_version()),
        ("MLflow version", mlflow.__version__),
        ("MLflow module location", mlflow.__file__),
        ("Tracking URI", mlflow.get_tracking_uri()),
        ("Registry URI", mlflow.get_registry_uri()),
    ]

    if (runtime := get_databricks_runtime_version()) is not None:
        items.append(("Databricks runtime version", runtime))

    if active_run := mlflow.active_run():
        items.extend(
            [
                ("Active experiment ID", active_run.info.experiment_id),
                ("Active run ID", active_run.info.run_id),
                ("Active run artifact URI", active_run.info.artifact_uri),
            ]
        )

    mlflow_envs = {
        k: ("***" if mask_envs else v) for k, v in os.environ.items() if k.startswith("MLFLOW_")
    }
    if mlflow_envs:
        items.append(
            (
                "MLflow environment variables",
                yaml.dump({"_": mlflow_envs}, indent=2).replace("'", "").lstrip("_:").rstrip("\n"),
            )
        )

    try:
        requires = importlib_metadata.requires("mlflow")
    except importlib_metadata.PackageNotFoundError:
        requires = importlib_metadata.requires("mlflow-skinny")

    mlflow_dependencies = {}
    for req in requires:
        req = Requirement(req)
        try:
            dist = importlib_metadata.distribution(req.name)
        except importlib_metadata.PackageNotFoundError:
            continue
        else:
            mlflow_dependencies[req.name] = dist.version

    items.append(
        (
            "MLflow dependencies",
            yaml.dump({"_": mlflow_dependencies}, indent=2)
            .replace("'", "")
            .lstrip("_:")
            .rstrip("\n"),
        )
    )
    for key, val in items:
        click.secho(key, fg="blue", nl=False)
        click.echo(f": {val}")
```

--------------------------------------------------------------------------------

---[FILE: download_cloud_file_chunk.py]---
Location: mlflow-master/mlflow/utils/download_cloud_file_chunk.py

```python
"""
This script should be executed in a fresh python interpreter process using `subprocess`.
"""

import argparse
import importlib.util
import json
import os
import sys


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--range-start", required=True, type=int)
    parser.add_argument("--range-end", required=True, type=int)
    parser.add_argument("--headers", required=True, type=str)
    parser.add_argument("--download-path", required=True, type=str)
    parser.add_argument("--http-uri", required=True, type=str)
    return parser.parse_args()


def main():
    file_path = os.path.join(os.path.dirname(__file__), "request_utils.py")
    module_name = "mlflow.utils.request_utils"

    spec = importlib.util.spec_from_file_location(module_name, file_path)
    module = importlib.util.module_from_spec(spec)
    sys.modules[module_name] = module
    spec.loader.exec_module(module)
    download_chunk = module.download_chunk

    args = parse_args()
    download_chunk(
        range_start=args.range_start,
        range_end=args.range_end,
        headers=json.loads(args.headers),
        download_path=args.download_path,
        http_uri=args.http_uri,
    )


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

````
