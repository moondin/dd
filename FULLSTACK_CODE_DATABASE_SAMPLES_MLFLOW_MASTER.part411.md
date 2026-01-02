---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 411
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 411 of 991)

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

---[FILE: client.py]---
Location: mlflow-master/mlflow/server/auth/client.py

```python
from mlflow.server.auth.entities import (
    ExperimentPermission,
    RegisteredModelPermission,
    ScorerPermission,
    User,
)
from mlflow.server.auth.routes import (
    CREATE_EXPERIMENT_PERMISSION,
    CREATE_REGISTERED_MODEL_PERMISSION,
    CREATE_SCORER_PERMISSION,
    CREATE_USER,
    DELETE_EXPERIMENT_PERMISSION,
    DELETE_REGISTERED_MODEL_PERMISSION,
    DELETE_SCORER_PERMISSION,
    DELETE_USER,
    GET_EXPERIMENT_PERMISSION,
    GET_REGISTERED_MODEL_PERMISSION,
    GET_SCORER_PERMISSION,
    GET_USER,
    UPDATE_EXPERIMENT_PERMISSION,
    UPDATE_REGISTERED_MODEL_PERMISSION,
    UPDATE_SCORER_PERMISSION,
    UPDATE_USER_ADMIN,
    UPDATE_USER_PASSWORD,
)
from mlflow.utils.credentials import get_default_host_creds
from mlflow.utils.rest_utils import http_request_safe


class AuthServiceClient:
    """
    Client of an MLflow Tracking Server that enabled the default basic authentication plugin.
    It is recommended to use :py:func:`mlflow.server.get_app_client()` to instantiate this class.
    See https://mlflow.org/docs/latest/auth.html for more information.
    """

    def __init__(self, tracking_uri: str):
        """
        Args:
            tracking_uri: Address of local or remote tracking server.
        """
        self.tracking_uri = tracking_uri

    def _request(self, endpoint, method, **kwargs):
        host_creds = get_default_host_creds(self.tracking_uri)
        resp = http_request_safe(host_creds, endpoint, method, **kwargs)
        return resp.json()

    def create_user(self, username: str, password: str):
        """
        Create a new user.

        Args:
            username: The username.
            password: The user's password. Must not be empty string.

        Raises:
            mlflow.exceptions.RestException: if the username is already taken.

        Returns:
            A single :py:class:`mlflow.server.auth.entities.User` object.

        .. code-block:: python
            :caption: Example

            from mlflow.server.auth.client import AuthServiceClient

            client = AuthServiceClient("tracking_uri")
            user = client.create_user("newuser", "newpassword")
            print(f"user_id: {user.id}")
            print(f"username: {user.username}")
            print(f"password_hash: {user.password_hash}")
            print(f"is_admin: {user.is_admin}")

        .. code-block:: text
            :caption: Output

            user_id: 3
            username: newuser
            password_hash: REDACTED
            is_admin: False
        """
        resp = self._request(
            CREATE_USER,
            "POST",
            json={"username": username, "password": password},
        )
        return User.from_json(resp["user"])

    def get_user(self, username: str):
        """
        Get a user with a specific username.

        Args:
            username: The username.

        Raises:
            mlflow.exceptions.RestException: if the user does not exist

        Returns:
            A single :py:class:`mlflow.server.auth.entities.User` object.

        .. code-block:: bash
            :caption: Example

            export MLFLOW_TRACKING_USERNAME=admin
            export MLFLOW_TRACKING_PASSWORD=password

        .. code-block:: python

            from mlflow.server.auth.client import AuthServiceClient

            client = AuthServiceClient("tracking_uri")
            client.create_user("newuser", "newpassword")
            user = client.get_user("newuser")

            print(f"user_id: {user.id}")
            print(f"username: {user.username}")
            print(f"password_hash: {user.password_hash}")
            print(f"is_admin: {user.is_admin}")

        .. code-block:: text
            :caption: Output

            user_id: 3
            username: newuser
            password_hash: REDACTED
            is_admin: False
        """
        resp = self._request(
            GET_USER,
            "GET",
            params={"username": username},
        )
        return User.from_json(resp["user"])

    def update_user_password(self, username: str, password: str):
        """
        Update the password of a specific user.

        Args:
            username: The username.
            password: The new password.

        Raises:
            mlflow.exceptions.RestException: if the user does not exist

        .. code-block:: bash
            :caption: Example

            export MLFLOW_TRACKING_USERNAME=admin
            export MLFLOW_TRACKING_PASSWORD=password

        .. code-block:: python

            from mlflow.server.auth.client import AuthServiceClient

            client = AuthServiceClient("tracking_uri")
            client.create_user("newuser", "newpassword")

            client.update_user_password("newuser", "anotherpassword")
        """
        self._request(
            UPDATE_USER_PASSWORD,
            "PATCH",
            json={"username": username, "password": password},
        )

    def update_user_admin(self, username: str, is_admin: bool):
        """
        Update the admin status of a specific user.

        Args:
            username: The username.
            is_admin: The new admin status.

        Raises:
            mlflow.exceptions.RestException: if the user does not exist

        .. code-block:: bash
            :caption: Example

            export MLFLOW_TRACKING_USERNAME=admin
            export MLFLOW_TRACKING_PASSWORD=password

        .. code-block:: python

            from mlflow.server.auth.client import AuthServiceClient

            client = AuthServiceClient("tracking_uri")
            client.create_user("newuser", "newpassword")

            client.update_user_admin("newuser", True)
        """
        self._request(
            UPDATE_USER_ADMIN,
            "PATCH",
            json={"username": username, "is_admin": is_admin},
        )

    def delete_user(self, username: str):
        """
        Delete a specific user.

        Args:
            username: The username.

        Raises:
            mlflow.exceptions.RestException: if the user does not exist

        .. code-block:: bash
            :caption: Example

            export MLFLOW_TRACKING_USERNAME=admin
            export MLFLOW_TRACKING_PASSWORD=password

        .. code-block:: python

            from mlflow.server.auth.client import AuthServiceClient

            client = AuthServiceClient("tracking_uri")
            client.create_user("newuser", "newpassword")

            client.delete_user("newuser")
        """
        self._request(
            DELETE_USER,
            "DELETE",
            json={"username": username},
        )

    def create_experiment_permission(self, experiment_id: str, username: str, permission: str):
        """
        Create a permission on an experiment for a user.

        Args:
            experiment_id: The id of the experiment.
            username: The username.
            permission: Permission to grant. Must be one of "READ", "EDIT", "MANAGE" and
                "NO_PERMISSIONS".

        Raises:
            mlflow.exceptions.RestException: if the user does not exist, or a permission already
                exists for this experiment user pair, or if the permission is invalid. Does not
                require ``experiment_id`` to be an existing experiment.

        Returns:
            A single :py:class:`mlflow.server.auth.entities.ExperimentPermission` object.

        .. code-block:: bash
            :caption: Example

            export MLFLOW_TRACKING_USERNAME=admin
            export MLFLOW_TRACKING_PASSWORD=password

        .. code-block:: python

            from mlflow.server.auth.client import AuthServiceClient

            client = AuthServiceClient("tracking_uri")
            client.create_user("newuser", "newpassword")
            ep = client.create_experiment_permission("myexperiment", "newuser", "READ")

            print(f"experiment_id: {ep.experiment_id}")
            print(f"user_id: {ep.user_id}")
            print(f"permission: {ep.permission}")

        .. code-block:: text
            :caption: Output

            experiment_id: myexperiment
            user_id: 3
            permission: READ
        """
        resp = self._request(
            CREATE_EXPERIMENT_PERMISSION,
            "POST",
            json={"experiment_id": experiment_id, "username": username, "permission": permission},
        )
        return ExperimentPermission.from_json(resp["experiment_permission"])

    def get_experiment_permission(self, experiment_id: str, username: str):
        """
        Get an experiment permission for a user.

        Args:
            experiment_id: The id of the experiment.
            username: The username.

        Raises:
            mlflow.exceptions.RestException: if the user does not exist,
                or no permission exists for this experiment user pair.
                Note that the default permission will still be effective even if
                no permission exists.

        Returns:
            A single :py:class:`mlflow.server.auth.entities.ExperimentPermission` object.

        .. code-block:: bash
            :caption: Example

            export MLFLOW_TRACKING_USERNAME=admin
            export MLFLOW_TRACKING_PASSWORD=password

        .. code-block:: python

            from mlflow.server.auth.client import AuthServiceClient

            client = AuthServiceClient("tracking_uri")
            client.create_user("newuser", "newpassword")
            client.create_experiment_permission("myexperiment", "newuser", "READ")
            ep = client.get_experiment_permission("myexperiment", "newuser")
            print(f"experiment_id: {ep.experiment_id}")
            print(f"user_id: {ep.user_id}")
            print(f"permission: {ep.permission}")

        .. code-block:: text
            :caption: Output

            experiment_id: myexperiment
            user_id: 3
            permission: READ
        """
        resp = self._request(
            GET_EXPERIMENT_PERMISSION,
            "GET",
            params={"experiment_id": experiment_id, "username": username},
        )
        return ExperimentPermission.from_json(resp["experiment_permission"])

    def update_experiment_permission(self, experiment_id: str, username: str, permission: str):
        """
        Update an existing experiment permission for a user.

        Args:
            experiment_id: The id of the experiment.
            username: The username.
            permission: New permission to grant. Must be one of "READ", "EDIT", "MANAGE" and
                "NO_PERMISSIONS".

        Raises:
            mlflow.exceptions.RestException: if the user does not exist, or no permission exists for
                this experiment user pair, or if the permission is invalid

        .. code-block:: bash
            :caption: Example

            export MLFLOW_TRACKING_USERNAME=admin
            export MLFLOW_TRACKING_PASSWORD=password

        .. code-block:: python

            from mlflow.server.auth.client import AuthServiceClient

            client = AuthServiceClient("tracking_uri")
            client.create_user("newuser", "newpassword")
            client.create_experiment_permission("myexperiment", "newuser", "READ")
            client.update_experiment_permission("myexperiment", "newuser", "EDIT")
        """
        self._request(
            UPDATE_EXPERIMENT_PERMISSION,
            "PATCH",
            json={"experiment_id": experiment_id, "username": username, "permission": permission},
        )

    def delete_experiment_permission(self, experiment_id: str, username: str):
        """
        Delete an existing experiment permission for a user.

        Args:
            experiment_id: The id of the experiment.
            username: The username.

        Raises:
            mlflow.exceptions.RestException: if the user does not exist, or no permission exists for
                this experiment user pair, or if the permission is invalid.
                Note that the default permission will still be effective even
                after the permission has been deleted.


        .. code-block:: bash
            :caption: Example

            export MLFLOW_TRACKING_USERNAME=admin
            export MLFLOW_TRACKING_PASSWORD=password

        .. code-block:: python

            from mlflow.server.auth.client import AuthServiceClient

            client = AuthServiceClient("tracking_uri")
            client.create_user("newuser", "newpassword")
            client.create_experiment_permission("myexperiment", "newuser", "READ")
            client.delete_experiment_permission("myexperiment", "newuser")
        """
        self._request(
            DELETE_EXPERIMENT_PERMISSION,
            "DELETE",
            json={"experiment_id": experiment_id, "username": username},
        )

    def create_registered_model_permission(self, name: str, username: str, permission: str):
        """
        Create a permission on an registered model for a user.

        Args:
            name: The name of the registered model.
            username: The username.
            permission: Permission to grant. Must be one of "READ", "EDIT", "MANAGE" and
                "NO_PERMISSIONS".

        Raises:
            mlflow.exceptions.RestException: if the user does not exist,
                or a permission already exists for this registered model user pair,
                or if the permission is invalid.
                Does not require ``name`` to be an existing registered model.

        Returns:
            A single :py:class:`mlflow.server.auth.entities.RegisteredModelPermission` object.
        """
        resp = self._request(
            CREATE_REGISTERED_MODEL_PERMISSION,
            "POST",
            json={"name": name, "username": username, "permission": permission},
        )
        return RegisteredModelPermission.from_json(resp["registered_model_permission"])

    def get_registered_model_permission(self, name: str, username: str):
        """
        Get an registered model permission for a user.

        Args:
            name: The name of the registered model.
            username: The username.

        Raises:
            mlflow.exceptions.RestException: if the user does not
                exist, or no permission exists for this registered model user pair. Note that the
                default permission will still be effective even if no permission exists.

        Returns:
             A single :py:class:`mlflow.server.auth.entities.RegisteredModelPermission` object.

        .. code-block:: bash
            :caption: Example

            export MLFLOW_TRACKING_USERNAME=admin
            export MLFLOW_TRACKING_PASSWORD=password

        .. code-block:: python

            from mlflow.server.auth.client import AuthServiceClient

            client = AuthServiceClient("tracking_uri")
            client.create_user("newuser", "newpassword")
            client.create_registered_model_permission("myregisteredmodel", "newuser", "READ")
            rmp = client.get_registered_model_permission("myregisteredmodel", "newuser")

            print(f"name: {rmp.name}")
            print(f"user_id: {rmp.user_id}")
            print(f"permission: {rmp.permission}")

        .. code-block:: text
            :caption: Output

            name: myregisteredmodel
            user_id: 3
            permission: READ
        """
        resp = self._request(
            GET_REGISTERED_MODEL_PERMISSION,
            "GET",
            params={"name": name, "username": username},
        )
        return RegisteredModelPermission.from_json(resp["registered_model_permission"])

    def update_registered_model_permission(self, name: str, username: str, permission: str):
        """
        Update an existing registered model permission for a user.

        Args:
            name: The name of the registered model.
            username: The username.
            permission: New permission to grant. Must be one of "READ", "EDIT", "MANAGE" and
                "NO_PERMISSIONS".

        Raises:
            mlflow.exceptions.RestException: if the user does not exist, or no permission exists for
                this registered model user pair, or if the permission is invalid.

        .. code-block:: bash
            :caption: Example

            export MLFLOW_TRACKING_USERNAME=admin
            export MLFLOW_TRACKING_PASSWORD=password

        .. code-block:: python

            from mlflow.server.auth.client import AuthServiceClient

            client = AuthServiceClient("tracking_uri")
            client.create_user("newuser", "newpassword")
            client.create_registered_model_permission("myregisteredmodel", "newuser", "READ")
            client.update_registered_model_permission("myregisteredmodel", "newuser", "EDIT")
        """
        self._request(
            UPDATE_REGISTERED_MODEL_PERMISSION,
            "PATCH",
            json={"name": name, "username": username, "permission": permission},
        )

    def delete_registered_model_permission(self, name: str, username: str):
        """
        Delete an existing registered model permission for a user.

        Args:
            name: The name of the registered model.
            username: The username.

        Raises:
            mlflow.exceptions.RestException: if the user does not exist,
                or no permission exists for this registered model user pair,
                or if the permission is invalid.
                Note that the default permission will still be effective even
                after the permission has been deleted.

        .. code-block:: bash
            :caption: Example

            export MLFLOW_TRACKING_USERNAME=admin
            export MLFLOW_TRACKING_PASSWORD=password

        .. code-block:: python

            from mlflow.server.auth.client import AuthServiceClient

            client = AuthServiceClient("tracking_uri")
            client.create_user("newuser", "newpassword")
            client.create_registered_model_permission("myregisteredmodel", "newuser", "READ")
            client.delete_registered_model_permission("myregisteredmodel", "newuser")
        """
        self._request(
            DELETE_REGISTERED_MODEL_PERMISSION,
            "DELETE",
            json={"name": name, "username": username},
        )

    def create_scorer_permission(
        self, experiment_id: str, scorer_name: str, username: str, permission: str
    ):
        """
        Create a permission on a scorer for a user.

        Args:
            experiment_id: The id of the experiment containing the scorer.
            scorer_name: The name of the scorer.
            username: The username.
            permission: Permission to grant. Must be one of "READ", "EDIT", "MANAGE" and
                "NO_PERMISSIONS".

        Raises:
            mlflow.exceptions.RestException: if the user does not exist,
                or the scorer permission already exists.

        Returns:
            A single :py:class:`mlflow.server.auth.entities.ScorerPermission` object.
        """
        resp = self._request(
            CREATE_SCORER_PERMISSION,
            "POST",
            json={
                "experiment_id": experiment_id,
                "scorer_name": scorer_name,
                "username": username,
                "permission": permission,
            },
        )
        return ScorerPermission.from_json(resp["scorer_permission"])

    def get_scorer_permission(self, experiment_id: str, scorer_name: str, username: str):
        """
        Get a scorer permission for a user.

        Args:
            experiment_id: The id of the experiment containing the scorer.
            scorer_name: The name of the scorer.
            username: The username.

        Raises:
            mlflow.exceptions.RestException: if the user does not exist,
                or no permission exists for this scorer user pair.

        Returns:
            A single :py:class:`mlflow.server.auth.entities.ScorerPermission` object.
        """
        resp = self._request(
            GET_SCORER_PERMISSION,
            "GET",
            params={
                "experiment_id": experiment_id,
                "scorer_name": scorer_name,
                "username": username,
            },
        )
        return ScorerPermission.from_json(resp["scorer_permission"])

    def update_scorer_permission(
        self, experiment_id: str, scorer_name: str, username: str, permission: str
    ):
        """
        Update an existing scorer permission for a user.

        Args:
            experiment_id: The id of the experiment containing the scorer.
            scorer_name: The name of the scorer.
            username: The username.
            permission: New permission to grant. Must be one of "READ", "EDIT", "MANAGE" and
                "NO_PERMISSIONS".

        Raises:
            mlflow.exceptions.RestException: if the user does not exist,
                or no permission exists for this scorer user pair,
                or if the permission is invalid.
        """
        self._request(
            UPDATE_SCORER_PERMISSION,
            "PATCH",
            json={
                "experiment_id": experiment_id,
                "scorer_name": scorer_name,
                "username": username,
                "permission": permission,
            },
        )

    def delete_scorer_permission(self, experiment_id: str, scorer_name: str, username: str):
        """
        Delete an existing scorer permission for a user.

        Args:
            experiment_id: The id of the experiment containing the scorer.
            scorer_name: The name of the scorer.
            username: The username.

        Raises:
            mlflow.exceptions.RestException: if the user does not exist,
                or no permission exists for this scorer user pair.
        """
        self._request(
            DELETE_SCORER_PERMISSION,
            "DELETE",
            json={
                "experiment_id": experiment_id,
                "scorer_name": scorer_name,
                "username": username,
            },
        )
```

--------------------------------------------------------------------------------

---[FILE: config.py]---
Location: mlflow-master/mlflow/server/auth/config.py

```python
import configparser
from pathlib import Path
from typing import NamedTuple

from mlflow.environment_variables import MLFLOW_AUTH_CONFIG_PATH


class AuthConfig(NamedTuple):
    default_permission: str
    database_uri: str
    admin_username: str
    admin_password: str
    authorization_function: str


def _get_auth_config_path() -> str:
    return (
        MLFLOW_AUTH_CONFIG_PATH.get() or Path(__file__).parent.joinpath("basic_auth.ini").resolve()
    )


def read_auth_config() -> AuthConfig:
    config_path = _get_auth_config_path()
    config = configparser.ConfigParser()
    config.read(config_path)
    return AuthConfig(
        default_permission=config["mlflow"]["default_permission"],
        database_uri=config["mlflow"]["database_uri"],
        admin_username=config["mlflow"]["admin_username"],
        admin_password=config["mlflow"]["admin_password"],
        authorization_function=config["mlflow"].get(
            "authorization_function", "mlflow.server.auth:authenticate_request_basic_auth"
        ),
    )
```

--------------------------------------------------------------------------------

---[FILE: entities.py]---
Location: mlflow-master/mlflow/server/auth/entities.py

```python
class User:
    def __init__(
        self,
        id_,
        username,
        password_hash,
        is_admin,
        experiment_permissions=None,
        registered_model_permissions=None,
        scorer_permissions=None,
    ):
        self._id = id_
        self._username = username
        self._password_hash = password_hash
        self._is_admin = is_admin
        self._experiment_permissions = experiment_permissions
        self._registered_model_permissions = registered_model_permissions
        self._scorer_permissions = scorer_permissions

    @property
    def id(self):
        return self._id

    @property
    def username(self):
        return self._username

    @property
    def password_hash(self):
        return self._password_hash

    @property
    def is_admin(self):
        return self._is_admin

    @is_admin.setter
    def is_admin(self, is_admin):
        self._is_admin = is_admin

    @property
    def experiment_permissions(self):
        return self._experiment_permissions

    @experiment_permissions.setter
    def experiment_permissions(self, experiment_permissions):
        self._experiment_permissions = experiment_permissions

    @property
    def registered_model_permissions(self):
        return self._registered_model_permissions

    @registered_model_permissions.setter
    def registered_model_permissions(self, registered_model_permissions):
        self._registered_model_permissions = registered_model_permissions

    @property
    def scorer_permissions(self):
        return self._scorer_permissions

    @scorer_permissions.setter
    def scorer_permissions(self, scorer_permissions):
        self._scorer_permissions = scorer_permissions

    def to_json(self):
        return {
            "id": self.id,
            "username": self.username,
            "is_admin": self.is_admin,
            "experiment_permissions": [p.to_json() for p in self.experiment_permissions],
            "registered_model_permissions": [
                p.to_json() for p in self.registered_model_permissions
            ],
            "scorer_permissions": [p.to_json() for p in self.scorer_permissions],
        }

    @classmethod
    def from_json(cls, dictionary):
        return cls(
            id_=dictionary["id"],
            username=dictionary["username"],
            password_hash="REDACTED",
            is_admin=dictionary["is_admin"],
            experiment_permissions=[
                ExperimentPermission.from_json(p) for p in dictionary["experiment_permissions"]
            ],
            registered_model_permissions=[
                RegisteredModelPermission.from_json(p)
                for p in dictionary["registered_model_permissions"]
            ],
            scorer_permissions=[
                ScorerPermission.from_json(p) for p in dictionary["scorer_permissions"]
            ],
        )


class ExperimentPermission:
    def __init__(
        self,
        experiment_id,
        user_id,
        permission,
    ):
        self._experiment_id = experiment_id
        self._user_id = user_id
        self._permission = permission

    @property
    def experiment_id(self):
        return self._experiment_id

    @property
    def user_id(self):
        return self._user_id

    @property
    def permission(self):
        return self._permission

    @permission.setter
    def permission(self, permission):
        self._permission = permission

    def to_json(self):
        return {
            "experiment_id": self.experiment_id,
            "user_id": self.user_id,
            "permission": self.permission,
        }

    @classmethod
    def from_json(cls, dictionary):
        return cls(
            experiment_id=dictionary["experiment_id"],
            user_id=dictionary["user_id"],
            permission=dictionary["permission"],
        )


class RegisteredModelPermission:
    def __init__(
        self,
        name,
        user_id,
        permission,
    ):
        self._name = name
        self._user_id = user_id
        self._permission = permission

    @property
    def name(self):
        return self._name

    @property
    def user_id(self):
        return self._user_id

    @property
    def permission(self):
        return self._permission

    @permission.setter
    def permission(self, permission):
        self._permission = permission

    def to_json(self):
        return {
            "name": self.name,
            "user_id": self.user_id,
            "permission": self.permission,
        }

    @classmethod
    def from_json(cls, dictionary):
        return cls(
            name=dictionary["name"],
            user_id=dictionary["user_id"],
            permission=dictionary["permission"],
        )


class ScorerPermission:
    def __init__(
        self,
        experiment_id,
        scorer_name,
        user_id,
        permission,
    ):
        self._experiment_id = experiment_id
        self._scorer_name = scorer_name
        self._user_id = user_id
        self._permission = permission

    @property
    def experiment_id(self):
        return self._experiment_id

    @property
    def scorer_name(self):
        return self._scorer_name

    @property
    def user_id(self):
        return self._user_id

    @property
    def permission(self):
        return self._permission

    @permission.setter
    def permission(self, permission):
        self._permission = permission

    def to_json(self):
        return {
            "experiment_id": self.experiment_id,
            "scorer_name": self.scorer_name,
            "user_id": self.user_id,
            "permission": self.permission,
        }

    @classmethod
    def from_json(cls, dictionary):
        return cls(
            experiment_id=dictionary["experiment_id"],
            scorer_name=dictionary["scorer_name"],
            user_id=dictionary["user_id"],
            permission=dictionary["permission"],
        )
```

--------------------------------------------------------------------------------

---[FILE: logo.py]---
Location: mlflow-master/mlflow/server/auth/logo.py

```python
# ruff: noqa: E501
MLFLOW_LOGO = """
<svg width="109" height="40" viewBox="0 0 109 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 31.0316V15.5024H3.54258V17.4699C4.43636 15.8756 6.38278 15.045 8.13589 15.045C10.178 15.045 11.9636 15.9713 12.7943 17.7895C14.0096 15.7474 15.8278 15.045 17.8373 15.045C20.6469 15.045 23.3263 16.8325 23.3263 20.9493V31.0316H19.7531V21.5541C19.7531 19.7359 18.8268 18.3636 16.7522 18.3636C14.8057 18.3636 13.5292 19.8947 13.5292 21.8086V31.0297H9.89282V21.5541C9.89282 19.7684 8.99522 18.3732 6.88995 18.3732C4.91292 18.3732 3.66699 19.8412 3.66699 21.8182V31.0392Z" fill="#333333"/>
<path d="M27.8546 31.0316V7.92917H31.5579V31.0316Z" fill="#333333"/>
<path d="M30.0708 39.4871C30.9033 39.7187 31.6517 39.8699 33.2402 39.8699C36.1933 39.8699 39.6765 38.2048 40.5933 33.5311L44.3789 14.7923H50.0076L50.6947 11.6746H45.0086L45.7741 7.95023C46.3598 5.05837 47.9598 3.59234 50.5282 3.59234C51.1962 3.59234 51.0086 3.64975 51.6038 3.76267L52.4268 0.570327C51.6344 0.333006 50.9244 0.191379 49.378 0.191379C47.7454 0.166831 46.1514 0.688934 44.8497 1.67463C43.4086 2.78851 42.4574 4.42487 42.023 6.53779L40.9569 11.6746H35.9234L35.5119 14.7943H40.3349L36.8593 32.1206C36.4765 34.0861 35.3588 36.4364 32.1512 36.4364C31.4239 36.4364 31.688 36.3809 31.0297 36.2737Z" fill="#0194E2"/>
<path d="M53.3416 30.9053H49.6402L54.7139 7.59616H58.4153Z" fill="#0194E2"/>
<path d="M71.8067 16.4766C68.5762 14.2161 64.1778 14.6606 61.4649 17.5216C58.7519 20.3826 58.5416 24.7984 60.9703 27.9043L63.3952 26.1244C62.1915 24.6312 61.9471 22.5815 62.7658 20.8471C63.5845 19.1127 65.3224 17.9987 67.2402 17.979V19.8737Z" fill="#43C9ED"/>
<path d="M62.6179 29.4717C65.8484 31.7322 70.2468 31.2877 72.9597 28.4267C75.6727 25.5657 75.883 21.1499 73.4543 18.044L71.0294 19.8239C72.2331 21.3171 72.4775 23.3668 71.6588 25.1012C70.8401 26.8356 69.1022 27.9496 67.1844 27.9693V26.0746Z" fill="#0194E2"/>
<path d="M78.0919 15.4928H82.1359L82.9588 26.1053L88.7177 15.4928L92.5569 15.5483L94.0651 26.1053L99.1387 15.4928L102.84 15.5483L95.1617 31.0412H91.4603L89.6765 19.9349L83.7818 31.0412H79.9426Z" fill="#0194E2"/>
<path d="M105.072 15.7684H104.306V15.5024H106.151V15.7741H105.386V18.0172H105.072Z" fill="#0194E2"/>
<path d="M106.614 15.5024H106.997L107.479 16.8421C107.541 17.0143 107.598 17.1904 107.657 17.3665H107.675C107.734 17.1904 107.788 17.0143 107.847 16.8421L108.325 15.5024H108.708V18.0172H108.41V16.6297C108.41 16.4096 108.434 16.1072 108.45 15.8832H108.434L108.243 16.4574L107.768 17.7608H107.56L107.079 16.4593L106.888 15.8852H106.873C106.89 16.1091 106.915 16.4115 106.915 16.6316V18.0191H106.624Z" fill="#0194E2"/>
</svg>
"""
```

--------------------------------------------------------------------------------

---[FILE: permissions.py]---
Location: mlflow-master/mlflow/server/auth/permissions.py

```python
from dataclasses import dataclass

from mlflow import MlflowException
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE


@dataclass
class Permission:
    name: str
    can_read: bool
    can_update: bool
    can_delete: bool
    can_manage: bool


READ = Permission(
    name="READ",
    can_read=True,
    can_update=False,
    can_delete=False,
    can_manage=False,
)

EDIT = Permission(
    name="EDIT",
    can_read=True,
    can_update=True,
    can_delete=False,
    can_manage=False,
)

MANAGE = Permission(
    name="MANAGE",
    can_read=True,
    can_update=True,
    can_delete=True,
    can_manage=True,
)

NO_PERMISSIONS = Permission(
    name="NO_PERMISSIONS",
    can_read=False,
    can_update=False,
    can_delete=False,
    can_manage=False,
)

ALL_PERMISSIONS = {
    READ.name: READ,
    EDIT.name: EDIT,
    MANAGE.name: MANAGE,
    NO_PERMISSIONS.name: NO_PERMISSIONS,
}


def get_permission(permission: str) -> Permission:
    return ALL_PERMISSIONS[permission]


def _validate_permission(permission: str):
    if permission not in ALL_PERMISSIONS:
        raise MlflowException(
            f"Invalid permission '{permission}'. Valid permissions are: {tuple(ALL_PERMISSIONS)}",
            INVALID_PARAMETER_VALUE,
        )
```

--------------------------------------------------------------------------------

---[FILE: routes.py]---
Location: mlflow-master/mlflow/server/auth/routes.py
Signals: Flask

```python
from mlflow.server.handlers import _add_static_prefix, _get_ajax_path, _get_rest_path

HOME = "/"
SIGNUP = "/signup"
CREATE_USER = _get_rest_path("/mlflow/users/create")
CREATE_USER_UI = _get_rest_path("/mlflow/users/create-ui")
GET_USER = _get_rest_path("/mlflow/users/get")
UPDATE_USER_PASSWORD = _get_rest_path("/mlflow/users/update-password")
UPDATE_USER_ADMIN = _get_rest_path("/mlflow/users/update-admin")
DELETE_USER = _get_rest_path("/mlflow/users/delete")
CREATE_EXPERIMENT_PERMISSION = _get_rest_path("/mlflow/experiments/permissions/create")
GET_EXPERIMENT_PERMISSION = _get_rest_path("/mlflow/experiments/permissions/get")
UPDATE_EXPERIMENT_PERMISSION = _get_rest_path("/mlflow/experiments/permissions/update")
DELETE_EXPERIMENT_PERMISSION = _get_rest_path("/mlflow/experiments/permissions/delete")
CREATE_REGISTERED_MODEL_PERMISSION = _get_rest_path("/mlflow/registered-models/permissions/create")
GET_REGISTERED_MODEL_PERMISSION = _get_rest_path("/mlflow/registered-models/permissions/get")
UPDATE_REGISTERED_MODEL_PERMISSION = _get_rest_path("/mlflow/registered-models/permissions/update")
DELETE_REGISTERED_MODEL_PERMISSION = _get_rest_path("/mlflow/registered-models/permissions/delete")
CREATE_SCORER_PERMISSION = _get_rest_path("/mlflow/scorers/permissions/create", version=3)
GET_SCORER_PERMISSION = _get_rest_path("/mlflow/scorers/permissions/get", version=3)
UPDATE_SCORER_PERMISSION = _get_rest_path("/mlflow/scorers/permissions/update", version=3)
DELETE_SCORER_PERMISSION = _get_rest_path("/mlflow/scorers/permissions/delete", version=3)

# Flask routes (not part of Protobuf API)
GET_ARTIFACT = _add_static_prefix("/get-artifact")
UPLOAD_ARTIFACT = _get_ajax_path("/mlflow/upload-artifact")
GET_MODEL_VERSION_ARTIFACT = _add_static_prefix("/model-versions/get-artifact")
GET_TRACE_ARTIFACT = _get_ajax_path("/mlflow/get-trace-artifact")
GET_METRIC_HISTORY_BULK = _get_ajax_path("/mlflow/metrics/get-history-bulk")
GET_METRIC_HISTORY_BULK_INTERVAL = _get_ajax_path("/mlflow/metrics/get-history-bulk-interval")
SEARCH_DATASETS = _get_ajax_path("/mlflow/experiments/search-datasets")
CREATE_PROMPTLAB_RUN = _get_ajax_path("/mlflow/runs/create-promptlab-run")
GATEWAY_PROXY = _get_ajax_path("/mlflow/gateway-proxy")
```

--------------------------------------------------------------------------------

````
