---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 243
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 243 of 991)

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

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/data/__init__.py

```python
import sys
from contextlib import suppress

from mlflow.data import dataset_registry
from mlflow.data import sources as mlflow_data_sources
from mlflow.data.dataset import Dataset
from mlflow.data.dataset_source import DatasetSource
from mlflow.data.dataset_source_registry import (
    get_dataset_source_from_json,
    get_registered_sources,
)
from mlflow.entities import Dataset as DatasetEntity
from mlflow.entities import DatasetInput
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE

with suppress(ImportError):
    # Suppressing ImportError to pass mlflow-skinny testing.
    from mlflow.data import meta_dataset  # noqa: F401


def get_source(dataset: DatasetEntity | DatasetInput | Dataset) -> DatasetSource:
    """Obtains the source of the specified dataset or dataset input.

    Args:
        dataset:
            An instance of :py:class:`mlflow.data.dataset.Dataset <mlflow.data.dataset.Dataset>`,
            :py:class:`mlflow.entities.Dataset`, or :py:class:`mlflow.entities.DatasetInput`.

    Returns:
        An instance of :py:class:`DatasetSource <mlflow.data.dataset_source.DatasetSource>`.

    """
    if isinstance(dataset, DatasetInput):
        dataset: DatasetEntity = dataset.dataset

    if isinstance(dataset, DatasetEntity):
        dataset_source: DatasetSource = get_dataset_source_from_json(
            source_json=dataset.source,
            source_type=dataset.source_type,
        )
    elif isinstance(dataset, Dataset):
        dataset_source: DatasetSource = dataset.source
    else:
        raise MlflowException(
            f"Unrecognized dataset type {type(dataset)}. Expected one of: "
            f"`mlflow.data.dataset.Dataset`,"
            f" `mlflow.entities.Dataset`, `mlflow.entities.DatasetInput`.",
            INVALID_PARAMETER_VALUE,
        )

    return dataset_source


__all__ = ["get_source"]


def _define_dataset_constructors_in_current_module():
    data_module = sys.modules[__name__]
    for (
        constructor_name,
        constructor_fn,
    ) in dataset_registry.get_registered_constructors().items():
        setattr(data_module, constructor_name, constructor_fn)
        __all__.append(constructor_name)


_define_dataset_constructors_in_current_module()


def _define_dataset_sources_in_sources_module():
    for source in get_registered_sources():
        setattr(mlflow_data_sources, source.__name__, source)
        mlflow_data_sources.__all__.append(source.__name__)


_define_dataset_sources_in_sources_module()
```

--------------------------------------------------------------------------------

---[FILE: base.py]---
Location: mlflow-master/mlflow/deployments/base.py

```python
"""
This module contains the base interface implemented by MLflow model deployment plugins.
In particular, a valid deployment plugin module must implement:

1. Exactly one client class subclassed from :py:class:`BaseDeploymentClient`, exposing the primary
   user-facing APIs used to manage deployments.
2. :py:func:`run_local`, for testing deployment by deploying a model locally
3. :py:func:`target_help`, which returns a help message describing target-specific URI format
   and deployment config
"""

import abc

from mlflow.exceptions import MlflowException
from mlflow.utils.annotations import developer_stable


def run_local(target, name, model_uri, flavor=None, config=None):
    """Deploys the specified model locally, for testing. This function should be defined
    within the plugin module. Also note that this function has a signature which is very
    similar to :py:meth:`BaseDeploymentClient.create_deployment` since both does logically
    similar operation.

    .. Note::
        This function is kept here only for documentation purpose and not implementing the
        actual feature. It should be implemented in the plugin's top level namescope and should
        be callable with ``plugin_module.run_local``

    Args:
        target: Which target to use. This information is used to call the appropriate plugin.
        name: Unique name to use for deployment. If another deployment exists with the same
            name, create_deployment will raise a
            :py:class:`mlflow.exceptions.MlflowException`.
        model_uri: URI of model to deploy.
        flavor: (optional) Model flavor to deploy. If unspecified, default flavor is chosen.
        config: (optional) Dict containing updated target-specific config for the deployment.

    Returns:
        None
    """
    raise NotImplementedError(
        "This function should be implemented in the deployment plugin. It is "
        "kept here only for documentation purpose and shouldn't be used in "
        "your application"
    )


def target_help():
    """
    .. Note::
        This function is kept here only for documentation purpose and not implementing the
        actual feature. It should be implemented in the plugin's top level namescope and should
        be callable with ``plugin_module.target_help``

    Return a string containing detailed documentation on the current deployment target, to be
    displayed when users invoke the ``mlflow deployments help -t <target-name>`` CLI. This
    method should be defined within the module specified by the plugin author.
    The string should contain:

    * An explanation of target-specific fields in the ``config`` passed to ``create_deployment``,
      ``update_deployment``
    * How to specify a ``target_uri`` (e.g. for AWS SageMaker, ``target_uri`` have a scheme of
      "sagemaker:/<aws-cli-profile-name>", where aws-cli-profile-name is the name of an AWS
      CLI profile https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html)
    * Any other target-specific details.

    """
    raise NotImplementedError(
        "This function should be implemented in the deployment plugin. It is "
        "kept here only for documentation purpose and shouldn't be used in "
        "your application"
    )


@developer_stable
class BaseDeploymentClient(abc.ABC):
    """
    Base class exposing Python model deployment APIs.

    Plugin implementors should define target-specific deployment logic via a subclass of
    ``BaseDeploymentClient`` within the plugin module, and customize method docstrings with
    target-specific information.

    .. Note::
        Subclasses should raise :py:class:`mlflow.exceptions.MlflowException` in error cases (e.g.
        on failure to deploy a model).
    """

    def __init__(self, target_uri):
        self.target_uri = target_uri

    @abc.abstractmethod
    def create_deployment(self, name, model_uri, flavor=None, config=None, endpoint=None):
        """
        Deploy a model to the specified target. By default, this method should block until
        deployment completes (i.e. until it's possible to perform inference with the deployment).
        In the case of conflicts (e.g. if it's not possible to create the specified deployment
        without due to conflict with an existing deployment), raises a
        :py:class:`mlflow.exceptions.MlflowException` or an `HTTPError` for remote
        deployments. See target-specific plugin documentation
        for additional detail on support for asynchronous deployment and other configuration.

        Args:
            name: Unique name to use for deployment. If another deployment exists with the same
                name, raises a :py:class:`mlflow.exceptions.MlflowException`
            model_uri: URI of model to deploy
            flavor: (optional) Model flavor to deploy. If unspecified, a default flavor
                will be chosen.
            config: (optional) Dict containing updated target-specific configuration for the
                deployment
            endpoint: (optional) Endpoint to create the deployment under. May not be supported
                by all targets

        Returns:
            Dict corresponding to created deployment, which must contain the 'name' key.

        """

    @abc.abstractmethod
    def update_deployment(self, name, model_uri=None, flavor=None, config=None, endpoint=None):
        """
        Update the deployment with the specified name. You can update the URI of the model, the
        flavor of the deployed model (in which case the model URI must also be specified), and/or
        any target-specific attributes of the deployment (via `config`). By default, this method
        should block until deployment completes (i.e. until it's possible to perform inference
        with the updated deployment). See target-specific plugin documentation for additional
        detail on support for asynchronous deployment and other configuration.

        Args:
            name: Unique name of deployment to update.
            model_uri: URI of a new model to deploy.
            flavor: (optional) new model flavor to use for deployment. If provided,
                ``model_uri`` must also be specified. If ``flavor`` is unspecified but
                ``model_uri`` is specified, a default flavor will be chosen and the
                deployment will be updated using that flavor.
            config: (optional) dict containing updated target-specific configuration for the
                deployment.
            endpoint: (optional) Endpoint containing the deployment to update. May not be
                supported by all targets.

        Returns:
            None

        """

    @abc.abstractmethod
    def delete_deployment(self, name, config=None, endpoint=None):
        """Delete the deployment with name ``name`` from the specified target.

        Deletion should be idempotent (i.e. deletion should not fail if retried on a non-existent
        deployment).

        Args:
            name: Name of deployment to delete
            config: (optional) dict containing updated target-specific configuration for the
                deployment
            endpoint: (optional) Endpoint containing the deployment to delete. May not be
                supported by all targets

        Returns:
            None
        """

    @abc.abstractmethod
    def list_deployments(self, endpoint=None):
        """List deployments.

        This method is expected to return an unpaginated list of all
        deployments (an alternative would be to return a dict with a 'deployments' field
        containing the actual deployments, with plugins able to specify other fields, e.g.
        a next_page_token field, in the returned dictionary for pagination, and to accept
        a `pagination_args` argument to this method for passing pagination-related args).

        Args:
            endpoint: (optional) List deployments in the specified endpoint. May not be
                supported by all targets

        Returns:
            A list of dicts corresponding to deployments. Each dict is guaranteed to
            contain a 'name' key containing the deployment name. The other fields of
            the returned dictionary and their types may vary across deployment targets.
        """

    @abc.abstractmethod
    def get_deployment(self, name, endpoint=None):
        """
        Returns a dictionary describing the specified deployment, throwing either a
        :py:class:`mlflow.exceptions.MlflowException` or an `HTTPError` for remote
        deployments if no deployment exists with the provided ID.
        The dict is guaranteed to contain an 'name' key containing the deployment name.
        The other fields of the returned dictionary and their types may vary across
        deployment targets.

        Args:
            name: ID of deployment to fetch.
            endpoint: (optional) Endpoint containing the deployment to get. May not be
                supported by all targets.

        Returns:
            A dict corresponding to the retrieved deployment. The dict is guaranteed to
            contain a 'name' key corresponding to the deployment name. The other fields of
            the returned dictionary and their types may vary across targets.
        """

    @abc.abstractmethod
    def predict(self, deployment_name=None, inputs=None, endpoint=None):
        """Compute predictions on inputs using the specified deployment or model endpoint.

        Note that the input/output types of this method match those of `mlflow pyfunc predict`.

        Args:
            deployment_name: Name of deployment to predict against.
            inputs: Input data (or arguments) to pass to the deployment or model endpoint for
                inference.
            endpoint: Endpoint to predict against. May not be supported by all targets.

        Returns:
            A :py:class:`mlflow.deployments.PredictionsResponse` instance representing the
            predictions and associated Model Server response metadata.

        """

    def predict_stream(self, deployment_name=None, inputs=None, endpoint=None):
        """
        Submit a query to a configured provider endpoint, and get streaming response

        Args:
            deployment_name: Name of deployment to predict against.
            inputs: The inputs to the query, as a dictionary.
            endpoint: The name of the endpoint to query.

        Returns:
            An iterator of dictionary containing the response from the endpoint.
        """
        raise NotImplementedError()

    def explain(self, deployment_name=None, df=None, endpoint=None):
        """
        Generate explanations of model predictions on the specified input pandas Dataframe
        ``df`` for the deployed model. Explanation output formats vary by deployment target,
        and can include details like feature importance for understanding/debugging predictions.

        Args:
            deployment_name: Name of deployment to predict against
            df: Pandas DataFrame to use for explaining feature importance in model prediction
            endpoint: Endpoint to predict against. May not be supported by all targets

        Returns:
            A JSON-able object (pandas dataframe, numpy array, dictionary), or
            an exception if the implementation is not available in deployment target's class
        """
        raise MlflowException(
            "Computing model explanations is not yet supported for this deployment target"
        )

    def create_endpoint(self, name, config=None):
        """
        Create an endpoint with the specified target. By default, this method should block until
        creation completes (i.e. until it's possible to create a deployment within the endpoint).
        In the case of conflicts (e.g. if it's not possible to create the specified endpoint
        due to conflict with an existing endpoint), raises a
        :py:class:`mlflow.exceptions.MlflowException` or an `HTTPError` for remote
        deployments. See target-specific plugin documentation
        for additional detail on support for asynchronous creation and other configuration.

        Args:
            name: Unique name to use for endpoint. If another endpoint exists with the same
                name, raises a :py:class:`mlflow.exceptions.MlflowException`.
            config: (optional) Dict containing target-specific configuration for the
                endpoint.

        Returns:
            Dict corresponding to created endpoint, which must contain the 'name' key.

        """
        raise MlflowException(
            "Method is unimplemented in base client. Implementation should be "
            "provided by specific target plugins."
        )

    def update_endpoint(self, endpoint, config=None):
        """
        Update the endpoint with the specified name. You can update any target-specific attributes
        of the endpoint (via `config`). By default, this method should block until the update
        completes (i.e. until it's possible to create a deployment within the endpoint). See
        target-specific plugin documentation for additional detail on support for asynchronous
        update and other configuration.

        Args:
            endpoint: Unique name of endpoint to update
            config: (optional) dict containing target-specific configuration for the
                endpoint

        Returns:
            None

        """
        raise MlflowException(
            "Method is unimplemented in base client. Implementation should be "
            "provided by specific target plugins."
        )

    def delete_endpoint(self, endpoint):
        """
        Delete the endpoint from the specified target. Deletion should be idempotent (i.e. deletion
        should not fail if retried on a non-existent deployment).

        Args:
            endpoint: Name of endpoint to delete

        Returns:
            None
        """
        raise MlflowException(
            "Method is unimplemented in base client. Implementation should be "
            "provided by specific target plugins."
        )

    def list_endpoints(self):
        """
        List endpoints in the specified target. This method is expected to return an
        unpaginated list of all endpoints (an alternative would be to return a dict with
        an 'endpoints' field containing the actual endpoints, with plugins able to specify
        other fields, e.g. a next_page_token field, in the returned dictionary for pagination,
        and to accept a `pagination_args` argument to this method for passing
        pagination-related args).

        Returns:
            A list of dicts corresponding to endpoints. Each dict is guaranteed to
            contain a 'name' key containing the endpoint name. The other fields of
            the returned dictionary and their types may vary across targets.
        """
        raise MlflowException(
            "Method is unimplemented in base client. Implementation should be "
            "provided by specific target plugins."
        )

    def get_endpoint(self, endpoint):
        """
        Returns a dictionary describing the specified endpoint, throwing a
        py:class:`mlflow.exception.MlflowException` or an `HTTPError` for remote
        deployments if no endpoint exists with the provided
        name.
        The dict is guaranteed to contain an 'name' key containing the endpoint name.
        The other fields of the returned dictionary and their types may vary across targets.

        Args:
            endpoint: Name of endpoint to fetch

        Returns:
            A dict corresponding to the retrieved endpoint. The dict is guaranteed to
            contain a 'name' key corresponding to the endpoint name. The other fields of
            the returned dictionary and their types may vary across targets.
        """
        raise MlflowException(
            "Method is unimplemented in base client. Implementation should be "
            "provided by specific target plugins."
        )
```

--------------------------------------------------------------------------------

---[FILE: cli.py]---
Location: mlflow-master/mlflow/deployments/cli.py

```python
import json
import sys
from inspect import signature

import click

from mlflow.deployments import interface
from mlflow.utils import cli_args
from mlflow.utils.proto_json_utils import NumpyEncoder, _get_jsonable_obj


def _user_args_to_dict(user_list):
    # Similar function in mlflow.cli is throwing exception on import
    user_dict = {}
    for s in user_list:
        try:
            # Some configs may contain '=' in the value
            name, value = s.split("=", 1)
        except ValueError as exc:
            # not enough values to unpack
            raise click.BadOptionUsage(
                "config",
                "Config options must be a pair and should be "
                "provided as ``-C key=value`` or "
                "``--config key=value``",
            ) from exc
        if name in user_dict:
            raise click.ClickException(f"Repeated parameter: '{name}'")
        user_dict[name] = value
    return user_dict


installed_targets = list(interface.plugin_store.registry)
if len(installed_targets) > 0:
    supported_targets_msg = "Support is currently installed for deployment to: {targets}".format(
        targets=", ".join(installed_targets)
    )
else:
    supported_targets_msg = (
        "NOTE: you currently do not have support installed for any deployment targets."
    )

target_details = click.option(
    "--target",
    "-t",
    required=True,
    help=f"""
                                   Deployment target URI. Run
                                   `mlflow deployments help --target-name <target-name>` for
                                   more details on the supported URI format and config options
                                   for a given target.
                                   {supported_targets_msg}

                                   See all supported deployment targets and installation
                                   instructions at
                                   https://mlflow.org/docs/latest/plugins.html#community-plugins
                                   """,
)
deployment_name = click.option("--name", "name", required=True, help="Name of the deployment")
optional_deployment_name = click.option("--name", "name", help="Name of the deployment")
parse_custom_arguments = click.option(
    "--config",
    "-C",
    metavar="NAME=VALUE",
    multiple=True,
    help="Extra target-specific config for the model "
    "deployment, of the form -C name=value. See "
    "documentation/help for your deployment target for a "
    "list of supported config options.",
)

parse_input = click.option(
    "--input-path",
    "-I",
    required=True,
    help="Path to input prediction payload file. The file can"
    "be a JSON (Python Dict) or CSV (pandas DataFrame). If the file is a CSV, the user must specify"
    "the --content-type csv option.",
)

parse_output = click.option(
    "--output-path",
    "-O",
    help="File to output results to as a JSON file. If not provided, prints output to stdout.",
)

required_endpoint_param = click.option("--endpoint", required=True, help="Name of the endpoint")
optional_endpoint_param = click.option("--endpoint", help="Name of the endpoint")


@click.group(
    "deployments",
    help=f"""
    Deploy MLflow models to custom targets.
    Run `mlflow deployments help --target-name <target-name>` for
    more details on the supported URI format and config options for a given target.
    {supported_targets_msg}

    See all supported deployment targets and installation instructions in
    https://mlflow.org/docs/latest/plugins.html#community-plugins

    You can also write your own plugin for deployment to a custom target. For instructions on
    writing and distributing a plugin, see
    https://mlflow.org/docs/latest/plugins.html#writing-your-own-mlflow-plugins.
""",
)
def commands():
    """
    Deploy MLflow models to custom targets. Support is currently installed for
    the following targets: {targets}. Run `mlflow deployments help --target-name <target-name>` for
    more details on the supported URI format and config options for a given target.

    To deploy to other targets, you must first install an
    appropriate third-party Python plugin. See the list of known community-maintained plugins
    at https://mlflow.org/docs/latest/plugins.html#community-plugins.

    You can also write your own plugin for deployment to a custom target. For instructions on
    writing and distributing a plugin, see
    https://mlflow.org/docs/latest/plugins.html#writing-your-own-mlflow-plugins.
    """


@commands.command("create")
@optional_endpoint_param
@parse_custom_arguments
@deployment_name
@target_details
@cli_args.MODEL_URI
@click.option(
    "--flavor",
    "-f",
    help="Which flavor to be deployed. This will be auto inferred if it's not given",
)
def create_deployment(flavor, model_uri, target, name, config, endpoint):
    """
    Deploy the model at ``model_uri`` to the specified target.

    Additional plugin-specific arguments may also be passed to this command, via `-C key=value`
    """
    config_dict = _user_args_to_dict(config)
    client = interface.get_deploy_client(target)

    sig = signature(client.create_deployment)
    if "endpoint" in sig.parameters:
        deployment = client.create_deployment(
            name, model_uri, flavor, config=config_dict, endpoint=endpoint
        )
    else:
        deployment = client.create_deployment(name, model_uri, flavor, config=config_dict)
    click.echo("\n{} deployment {} is created".format(deployment["flavor"], deployment["name"]))


@commands.command("update")
@optional_endpoint_param
@parse_custom_arguments
@deployment_name
@target_details
@click.option(
    "--model-uri",
    "-m",
    default=None,
    metavar="URI",
    help="URI to the model. A local path, a 'runs:/' URI, or a"
    " remote storage URI (e.g., an 's3://' URI). For more information"
    " about supported remote URIs for model artifacts, see"
    " https://mlflow.org/docs/latest/tracking.html"
    "#artifact-stores",
)
@click.option(
    "--flavor",
    "-f",
    help="Which flavor to be deployed. This will be auto inferred if it's not given",
)
def update_deployment(flavor, model_uri, target, name, config, endpoint):
    """
    Update the deployment with ID `deployment_id` in the specified target.
    You can update the URI of the model and/or the flavor of the deployed model (in which case the
    model URI must also be specified).

    Additional plugin-specific arguments may also be passed to this command, via `-C key=value`.
    """
    config_dict = _user_args_to_dict(config)
    client = interface.get_deploy_client(target)

    sig = signature(client.update_deployment)
    if "endpoint" in sig.parameters:
        ret = client.update_deployment(
            name, model_uri=model_uri, flavor=flavor, config=config_dict, endpoint=endpoint
        )
    else:
        ret = client.update_deployment(name, model_uri=model_uri, flavor=flavor, config=config_dict)
    click.echo("Deployment {} is updated (with flavor {})".format(name, ret["flavor"]))


@commands.command("delete")
@optional_endpoint_param
@parse_custom_arguments
@deployment_name
@target_details
def delete_deployment(target, name, config, endpoint):
    """
    Delete the deployment with name given at `--name` from the specified target.
    """
    client = interface.get_deploy_client(target)

    sig = signature(client.delete_deployment)
    if "config" in sig.parameters:
        config_dict = _user_args_to_dict(config)
        if "endpoint" in sig.parameters:
            client.delete_deployment(name, config=config_dict, endpoint=endpoint)
        else:
            client.delete_deployment(name, config=config_dict)
    else:
        if "endpoint" in sig.parameters:
            client.delete_deployment(name, endpoint=endpoint)
        else:
            client.delete_deployment(name)

    click.echo(f"Deployment {name} is deleted")


@commands.command("list")
@optional_endpoint_param
@target_details
def list_deployment(target, endpoint):
    """
    List the names of all model deployments in the specified target. These names can be used with
    the `delete`, `update`, and `get` commands.
    """
    client = interface.get_deploy_client(target)

    sig = signature(client.list_deployments)
    if "endpoint" in sig.parameters:
        ids = client.list_deployments(endpoint=endpoint)
    else:
        ids = client.list_deployments()
    click.echo(f"List of all deployments:\n{ids}")


@commands.command("get")
@optional_endpoint_param
@deployment_name
@target_details
def get_deployment(target, name, endpoint):
    """
    Print a detailed description of the deployment with name given at ``--name`` in the specified
    target.
    """
    client = interface.get_deploy_client(target)

    sig = signature(client.get_deployment)
    if "endpoint" in sig.parameters:
        desc = client.get_deployment(name, endpoint=endpoint)
    else:
        desc = client.get_deployment(name)
    for key, val in desc.items():
        click.echo(f"{key}: {val}")
    click.echo("\n")


@commands.command("help")
@target_details
def target_help(target):
    """
    Display additional help for a specific deployment target, e.g. info on target-specific config
    options and the target's URI format.
    """
    click.echo(interface._target_help(target))


@commands.command("run-local")
@parse_custom_arguments
@deployment_name
@target_details
@cli_args.MODEL_URI
@click.option(
    "--flavor",
    "-f",
    help="Which flavor to be deployed. This will be auto inferred if it's not given",
)
def run_local(flavor, model_uri, target, name, config):
    """
    Deploy the model locally. This has very similar signature to ``create`` API
    """
    config_dict = _user_args_to_dict(config)
    interface.run_local(target, name, model_uri, flavor, config_dict)


def predictions_to_json(raw_predictions, output):
    predictions = _get_jsonable_obj(raw_predictions, pandas_orient="records")
    json.dump(predictions, output, cls=NumpyEncoder)


@commands.command("predict")
@click.option(
    "--name",
    "name",
    help="Name of the deployment. Exactly one of --name or --endpoint must be specified.",
)
@click.option(
    "--endpoint",
    help="Name of the endpoint. Exactly one of --name or --endpoint must be specified.",
)
@target_details
@parse_input
@parse_output
def predict(target, name, input_path, output_path, endpoint):
    """
    Predict the results for the deployed model for the given input(s)
    """
    import pandas as pd

    if (name, endpoint).count(None) != 1:
        raise click.UsageError("Must specify exactly one of --name or --endpoint.")

    df = pd.read_json(input_path)
    client = interface.get_deploy_client(target)

    sig = signature(client.predict)
    if "endpoint" in sig.parameters:
        result = client.predict(name, df, endpoint=endpoint)
    else:
        result = client.predict(name, df)
    if output_path is not None:
        result.to_json(output_path)
    else:
        click.echo(result.to_json())


@commands.command("explain")
@click.option(
    "--name",
    "name",
    help="Name of the deployment. Exactly one of --name or --endpoint must be specified.",
)
@click.option(
    "--endpoint",
    help="Name of the endpoint. Exactly one of --name or --endpoint must be specified.",
)
@target_details
@parse_input
@parse_output
def explain(target, name, input_path, output_path, endpoint):
    """
    Generate explanations of model predictions on the specified input for
    the deployed model for the given input(s). Explanation output formats vary
    by deployment target, and can include details like feature importance for
    understanding/debugging predictions. Run `mlflow deployments help` or
    consult the documentation for your plugin for details on explanation format.
    For information about the input data formats accepted by this function,
    see the following documentation:
    https://www.mlflow.org/docs/latest/models.html#built-in-deployment-tools
    """
    import pandas as pd

    if (name, endpoint).count(None) != 1:
        raise click.UsageError("Must specify exactly one of --name or --endpoint.")

    df = pd.read_json(input_path)
    client = interface.get_deploy_client(target)

    sig = signature(client.explain)
    if "endpoint" in sig.parameters:
        result = client.explain(name, df, endpoint=endpoint)
    else:
        result = client.explain(name, df)
    if output_path:
        with open(output_path, "w") as fp:
            predictions_to_json(result, fp)
    else:
        predictions_to_json(result, sys.stdout)


@commands.command("create-endpoint")
@click.option(
    "--config",
    "-C",
    metavar="NAME=VALUE",
    multiple=True,
    help="Extra target-specific config for the endpoint, "
    "of the form -C name=value. See "
    "documentation/help for your deployment target for a "
    "list of supported config options.",
)
@required_endpoint_param
@target_details
def create_endpoint(target, name, config):
    """
    Create an endpoint with the specified name at the specified target.

    Additional plugin-specific arguments may also be passed to this command, via `-C key=value`
    """
    config_dict = _user_args_to_dict(config)
    client = interface.get_deploy_client(target)
    endpoint = client.create_endpoint(name, config=config_dict)
    click.echo("\nEndpoint {} is created".format(endpoint["name"]))


@commands.command("update-endpoint")
@click.option(
    "--config",
    "-C",
    metavar="NAME=VALUE",
    multiple=True,
    help="Extra target-specific config for the endpoint, "
    "of the form -C name=value. See "
    "documentation/help for your deployment target for a "
    "list of supported config options.",
)
@required_endpoint_param
@target_details
def update_endpoint(target, endpoint, config):
    """
    Update the specified endpoint at the specified target.

    Additional plugin-specific arguments may also be passed to this command, via `-C key=value`
    """
    config_dict = _user_args_to_dict(config)
    client = interface.get_deploy_client(target)
    client.update_endpoint(endpoint, config=config_dict)
    click.echo(f"\nEndpoint {endpoint} is updated")


@commands.command("delete-endpoint")
@required_endpoint_param
@target_details
def delete_endpoint(target, endpoint):
    """
    Delete the specified endpoint at the specified target
    """
    client = interface.get_deploy_client(target)
    client.delete_endpoint(endpoint)
    click.echo(f"\nEndpoint {endpoint} is deleted")


@commands.command("list-endpoints")
@target_details
def list_endpoints(target):
    """
    List all endpoints at the specified target
    """
    client = interface.get_deploy_client(target)
    ids = client.list_endpoints()
    click.echo(f"List of all endpoints:\n{ids}")


@commands.command("get-endpoint")
@required_endpoint_param
@target_details
def get_endpoint(target, endpoint):
    """
    Get details for the specified endpoint at the specified target
    """
    client = interface.get_deploy_client(target)
    desc = client.get_endpoint(endpoint)
    for key, val in desc.items():
        click.echo(f"{key}: {val}")
    click.echo("\n")


def validate_config_path(_ctx, _param, value):
    from mlflow.gateway.config import _validate_config

    try:
        _validate_config(value)
        return value
    except Exception as e:
        raise click.BadParameter(str(e))
```

--------------------------------------------------------------------------------

---[FILE: constants.py]---
Location: mlflow-master/mlflow/deployments/constants.py

```python
# Abridged retryable error codes for deployments clients.
# These are modified from the standard MLflow Tracking server retry codes for the MLflowClient to
# remove timeouts from the list of the retryable conditions. A long-running timeout with
# retries for the proxied providers generally indicates an issue with the underlying query or
# the model being served having issues responding to the query due to parameter configuration.
MLFLOW_DEPLOYMENT_CLIENT_REQUEST_RETRY_CODES = frozenset(
    [
        429,  # Too many requests
        500,  # Server Error
        502,  # Bad Gateway
        503,  # Service Unavailable
    ]
)
```

--------------------------------------------------------------------------------

---[FILE: interface.py]---
Location: mlflow-master/mlflow/deployments/interface.py

```python
import inspect
from logging import Logger

from mlflow.deployments.base import BaseDeploymentClient
from mlflow.deployments.plugin_manager import DeploymentPlugins
from mlflow.deployments.utils import get_deployments_target, parse_target_uri
from mlflow.exceptions import MlflowException

plugin_store = DeploymentPlugins()
plugin_store.register("sagemaker", "mlflow.sagemaker")

_logger = Logger(__name__)


def get_deploy_client(target_uri=None):
    """Returns a subclass of :py:class:`mlflow.deployments.BaseDeploymentClient` exposing standard
    APIs for deploying models to the specified target. See available deployment APIs
    by calling ``help()`` on the returned object or viewing docs for
    :py:class:`mlflow.deployments.BaseDeploymentClient`. You can also run
    ``mlflow deployments help -t <target-uri>`` via the CLI for more details on target-specific
    configuration options.

    Args:
        target_uri: Optional URI of target to deploy to. If no target URI is provided, then
            MLflow will attempt to get the deployments target set via `get_deployments_target()` or
            `MLFLOW_DEPLOYMENTS_TARGET` environment variable.

    .. code-block:: python
        :caption: Example

        from mlflow.deployments import get_deploy_client
        import pandas as pd

        client = get_deploy_client("redisai")
        # Deploy the model stored at artifact path 'myModel' under run with ID 'someRunId'. The
        # model artifacts are fetched from the current tracking server and then used for deployment.
        client.create_deployment("spamDetector", "runs:/someRunId/myModel")
        # Load a CSV of emails and score it against our deployment
        emails_df = pd.read_csv("...")
        prediction_df = client.predict_deployment("spamDetector", emails_df)
        # List all deployments, get details of our particular deployment
        print(client.list_deployments())
        print(client.get_deployment("spamDetector"))
        # Update our deployment to serve a different model
        client.update_deployment("spamDetector", "runs:/anotherRunId/myModel")
        # Delete our deployment
        client.delete_deployment("spamDetector")
    """
    if not target_uri:
        try:
            target_uri = get_deployments_target()
        except MlflowException:
            _logger.info(
                "No deployments target has been set. Please either set the MLflow deployments "
                "target via `mlflow.deployments.set_deployments_target()` or set the environment "
                "variable MLFLOW_DEPLOYMENTS_TARGET to the running deployment server's uri"
            )
            return None
    target = parse_target_uri(target_uri)
    plugin = plugin_store[target]
    for _, obj in inspect.getmembers(plugin):
        if inspect.isclass(obj):
            if issubclass(obj, BaseDeploymentClient) and not obj == BaseDeploymentClient:
                return obj(target_uri)


def run_local(target, name, model_uri, flavor=None, config=None):
    """Deploys the specified model locally, for testing. Note that models deployed locally cannot
    be managed by other deployment APIs (e.g. ``update_deployment``, ``delete_deployment``, etc).

    Args:
        target: Target to deploy to.
        name: Name to use for deployment
        model_uri: URI of model to deploy
        flavor: (optional) Model flavor to deploy. If unspecified, a default flavor
            will be chosen.
        config: (optional) Dict containing updated target-specific configuration for
            the deployment

    Returns:
        None
    """
    return plugin_store[target].run_local(name, model_uri, flavor, config)


def _target_help(target):
    """
    Return a string containing detailed documentation on the current deployment target,
    to be displayed when users invoke the ``mlflow deployments help -t <target-name>`` CLI.
    This method should be defined within the module specified by the plugin author.
    The string should contain:
    * An explanation of target-specific fields in the ``config`` passed to ``create_deployment``,
      ``update_deployment``
    * How to specify a ``target_uri`` (e.g. for AWS SageMaker, ``target_uri``s have a scheme of
      "sagemaker:/<aws-cli-profile-name>", where aws-cli-profile-name is the name of an AWS
      CLI profile https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html)
    * Any other target-specific details.

    Args:
        target: Which target to use. This information is used to call the appropriate plugin.
    """
    return plugin_store[target].target_help()
```

--------------------------------------------------------------------------------

````
