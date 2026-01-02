---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 364
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 364 of 867)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - prowler-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/prowler-master
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: serviceusage_service.py]---
Location: prowler-master/prowler/providers/gcp/services/serviceusage/serviceusage_service.py
Signals: Pydantic

```python
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.gcp.config import DEFAULT_RETRY_ATTEMPTS
from prowler.providers.gcp.gcp_provider import GcpProvider
from prowler.providers.gcp.lib.service.service import GCPService


class ServiceUsage(GCPService):
    def __init__(self, provider: GcpProvider):
        super().__init__(__class__.__name__, provider)
        self.active_services = {}
        self._get_active_services()

    def _get_active_services(self):
        for project_id in self.project_ids:
            self.active_services[project_id] = []
            try:
                request = self.client.services().list(
                    parent="projects/" + project_id, filter="state:ENABLED"
                )
                while request is not None:
                    response = request.execute(num_retries=DEFAULT_RETRY_ATTEMPTS)
                    for service in response["services"]:
                        self.active_services[project_id].append(
                            Service(
                                name=service["name"].split("/")[-1],
                                title=service["config"]["title"],
                                project_id=project_id,
                            )
                        )

                    request = self.client.services().list_next(
                        previous_request=request, previous_response=response
                    )
            except Exception as error:
                logger.error(
                    f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )


class Service(BaseModel):
    name: str
    title: str
    project_id: str
```

--------------------------------------------------------------------------------

---[FILE: github_provider.py]---
Location: prowler-master/prowler/providers/github/github_provider.py

```python
import os
from os import environ
from typing import Union

from colorama import Fore, Style
from github import Auth, Github, GithubIntegration
from github.GithubRetry import GithubRetry

from prowler.config.config import (
    default_config_file_path,
    get_default_mute_file_path,
    load_and_validate_config_file,
)
from prowler.lib.logger import logger
from prowler.lib.mutelist.mutelist import Mutelist
from prowler.lib.utils.utils import print_boxes
from prowler.providers.common.models import Audit_Metadata, Connection
from prowler.providers.common.provider import Provider
from prowler.providers.github.exceptions.exceptions import (
    GithubEnvironmentVariableError,
    GithubInvalidCredentialsError,
    GithubInvalidProviderIdError,
    GithubInvalidTokenError,
    GithubSetUpIdentityError,
    GithubSetUpSessionError,
)
from prowler.providers.github.lib.mutelist.mutelist import GithubMutelist
from prowler.providers.github.models import (
    GithubAppIdentityInfo,
    GithubIdentityInfo,
    GithubSession,
)


def format_rsa_key(key: str) -> str:
    """
    Format an RSA private key by adding line breaks to the key body.
    This function takes an RSA private key in PEM format as input and formats it by inserting line breaks every 64 characters in the key body. This formatting is necessary for the GitHub SDK Parser to correctly process the key.
    Args:
        key (str): The RSA private key in PEM format as a string. The key should start with "-----BEGIN RSA PRIVATE KEY-----" and end with "-----END RSA PRIVATE KEY-----".
    Returns:
        str: The formatted RSA private key with line breaks added to the key body. If the input key does not have the correct headers, it is returned unchanged.
    Example:
        >>> key = "-----BEGIN RSA PRIVATE KEY-----XXXXXXXXXXXXX...-----END RSA PRIVATE KEY-----"
        >>> formatted_key = format_rsa_key(key)
        >>> print(formatted_key)
        -----BEGIN RSA PRIVATE KEY-----
        XXXXXXXXXXXXX...
        -----END RSA PRIVATE KEY-----

    """
    if (
        key.startswith("-----BEGIN RSA PRIVATE KEY-----")
        and key.endswith("-----END RSA PRIVATE KEY-----")
        and "\n" not in key
    ):
        # Extract the key body (excluding the headers)
        key_body = key[
            len("-----BEGIN RSA PRIVATE KEY-----") : len(key)
            - len("-----END RSA PRIVATE KEY-----")
        ].strip()
        # Add line breaks to the body
        formatted_key_body = "\n".join(
            [key_body[i : i + 64] for i in range(0, len(key_body), 64)]
        )
        # Reconstruct the key with headers and formatted body
        return f"-----BEGIN RSA PRIVATE KEY-----\n{formatted_key_body}\n-----END RSA PRIVATE KEY-----"
    return key


class GithubProvider(Provider):
    """
    GitHub Provider class

    This class is responsible for setting up the GitHub provider, including the session, identity, audit configuration, fixer configuration, and mutelist.

    Attributes:
        _type (str): The type of the provider.
        _auth_method (str): The authentication method used by the provider.
        _session (GithubSession): The session object for the provider.
        _identity (GithubIdentityInfo): The identity information for the provider.
        _audit_config (dict): The audit configuration for the provider.
        _fixer_config (dict): The fixer configuration for the provider.
        _mutelist (Mutelist): The mutelist for the provider.
        _repositories (list): List of repository names to scan in 'owner/repo-name' format.
        _organizations (list): List of organization or user names to scan repositories for.
        audit_metadata (Audit_Metadata): The audit metadata for the provider.
    """

    _type: str = "github"
    _auth_method: str = None
    _session: GithubSession
    _identity: GithubIdentityInfo
    _audit_config: dict
    _mutelist: Mutelist
    _repositories: list
    _organizations: list
    audit_metadata: Audit_Metadata

    def __init__(
        self,
        # Authentication credentials
        personal_access_token: str = "",
        oauth_app_token: str = "",
        github_app_key: str = "",
        github_app_key_content: str = "",
        github_app_id: int = 0,
        # Provider configuration
        config_path: str = None,
        config_content: dict = None,
        fixer_config: dict = {},
        mutelist_path: str = None,
        mutelist_content: dict = None,
        repositories: list = None,
        organizations: list = None,
    ):
        """
        GitHub Provider constructor

        Args:
            personal_access_token (str): GitHub personal access token.
            oauth_app_token (str): GitHub OAuth App token.
            github_app_key (str): GitHub App key.
            github_app_key_content (str): GitHub App key content.
            github_app_id (int): GitHub App ID.
            config_path (str): Path to the audit configuration file.
            config_content (dict): Audit configuration content.
            fixer_config (dict): Fixer configuration content.
            mutelist_path (str): Path to the mutelist file.
            mutelist_content (dict): Mutelist content.
            repositories (list): List of repository names to scan in 'owner/repo-name' format.
            organizations (list): List of organization or user names to scan repositories for.
        """
        logger.info("Instantiating GitHub Provider...")

        # Mute GitHub library logs to reduce noise since it is already handled by the Prowler logger
        import logging

        logging.getLogger("github").setLevel(logging.CRITICAL)
        logging.getLogger("github.GithubRetry").setLevel(logging.CRITICAL)

        # Set repositories and organizations for scoping
        self._repositories = repositories or []
        self._organizations = organizations or []

        self._session = GithubProvider.setup_session(
            personal_access_token,
            oauth_app_token,
            github_app_id,
            github_app_key,
            github_app_key_content,
        )

        # Set the authentication method
        if personal_access_token:
            self._auth_method = "Personal Access Token"
        elif oauth_app_token:
            self._auth_method = "OAuth App Token"
        elif github_app_id and (github_app_key or github_app_key_content):
            self._auth_method = "GitHub App Token"
        elif environ.get("GITHUB_PERSONAL_ACCESS_TOKEN", ""):
            self._auth_method = "Environment Variable for Personal Access Token"
        elif environ.get("GITHUB_OAUTH_APP_TOKEN", ""):
            self._auth_method = "Environment Variable for OAuth App Token"
        elif environ.get("GITHUB_APP_ID", "") and environ.get("GITHUB_APP_KEY", ""):
            self._auth_method = "Environment Variables for GitHub App Key and ID"

        self._identity = GithubProvider.setup_identity(self._session)

        # Audit Config
        if config_content:
            self._audit_config = config_content
        else:
            if not config_path:
                config_path = default_config_file_path
            self._audit_config = load_and_validate_config_file(self._type, config_path)

        # Fixer Config
        self._fixer_config = fixer_config

        # Mutelist
        if mutelist_content:
            self._mutelist = GithubMutelist(
                mutelist_content=mutelist_content,
            )
        else:
            if not mutelist_path:
                mutelist_path = get_default_mute_file_path(self.type)
            self._mutelist = GithubMutelist(
                mutelist_path=mutelist_path,
            )
        Provider.set_global_provider(self)

    @property
    def auth_method(self):
        """Returns the authentication method for the GitHub provider."""
        return self._auth_method

    @property
    def pat(self):
        """Returns the personal access token for the GitHub provider."""
        return self._pat

    @property
    def session(self):
        """Returns the session object for the GitHub provider."""
        return self._session

    @property
    def identity(self):
        """Returns the identity information for the GitHub provider."""
        return self._identity

    @property
    def type(self):
        """Returns the type of the GitHub provider."""
        return self._type

    @property
    def audit_config(self):
        return self._audit_config

    @property
    def fixer_config(self):
        return self._fixer_config

    @property
    def mutelist(self) -> GithubMutelist:
        """
        mutelist method returns the provider's mutelist.
        """
        return self._mutelist

    @property
    def repositories(self) -> list:
        """
        repositories method returns the provider's repository list for scoping.
        """
        return self._repositories

    @property
    def organizations(self) -> list:
        """
        organizations method returns the provider's organization list for scoping.
        """
        return self._organizations

    @staticmethod
    def setup_session(
        personal_access_token: str = None,
        oauth_app_token: str = None,
        github_app_id: int = 0,
        github_app_key: str = None,
        github_app_key_content: str = None,
    ) -> GithubSession:
        """
        Returns the GitHub headers responsible  authenticating API calls.

        Args:
            personal_access_token (str): GitHub personal access token.
            oauth_app_token (str): GitHub OAuth App token.
            github_app_id (int): GitHub App ID.
            github_app_key (str): GitHub App key.
            github_app_key_content (str): GitHub App key content.
        Returns:
            GithubSession: Authenticated session token for API requests.
        """

        session_token = ""
        app_key = ""
        app_id = 0

        try:
            # Ensure that at least one authentication method is selected. Default to environment variable for PAT if none is provided.
            if personal_access_token:
                session_token = personal_access_token

            elif oauth_app_token:
                session_token = oauth_app_token

            elif github_app_id and (github_app_key or github_app_key_content):
                app_id = github_app_id
                if github_app_key:
                    with open(github_app_key, "r") as rsa_key:
                        app_key = rsa_key.read()
                else:
                    app_key = format_rsa_key(github_app_key_content)

            else:
                # PAT
                logger.info(
                    "Looking for GITHUB_PERSONAL_ACCESS_TOKEN environment variable as user has not provided any token...."
                )
                session_token = environ.get("GITHUB_PERSONAL_ACCESS_TOKEN", "")

                if not session_token:
                    # OAUTH
                    logger.info(
                        "Looking for GITHUB_OAUTH_APP_TOKEN environment variable as user has not provided any token...."
                    )
                    session_token = environ.get("GITHUB_OAUTH_APP_TOKEN", "")

                    if not session_token:
                        # APP
                        logger.info(
                            "Looking for GITHUB_APP_ID and GITHUB_APP_KEY environment variables as user has not provided any token...."
                        )
                        app_id = environ.get("GITHUB_APP_ID", "")
                        app_key = format_rsa_key(environ.get("GITHUB_APP_KEY", ""))

                        if app_id and app_key:
                            pass

            if not session_token and not (app_id and app_key):
                raise GithubEnvironmentVariableError(
                    file=os.path.basename(__file__),
                    message="No authentication method selected and not environment variables were found.",
                )

            credentials = GithubSession(
                token=session_token,
                key=app_key,
                id=app_id,
            )

            return credentials

        except Exception as error:
            logger.critical(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            raise GithubSetUpSessionError(
                original_exception=error,
            )

    @staticmethod
    def setup_identity(
        session: GithubSession,
    ) -> Union[GithubIdentityInfo, GithubAppIdentityInfo]:
        """
        Returns the GitHub identity information

        Returns:
            GithubIdentityInfo | GithubAppIdentityInfo: An instance of GithubIdentityInfo or GithubAppIdentityInfo containing the identity information.
        """

        try:
            retry_config = GithubRetry(total=3)
            if session.token:
                auth = Auth.Token(session.token)
                g = Github(auth=auth, retry=retry_config)
                try:
                    user = g.get_user()
                    # Try to get email if the token has the necessary scope
                    account_email = None
                    try:
                        emails = user.get_emails()
                        if emails:
                            account_email = emails[0].email
                    except Exception:
                        # Token doesn't have user:email scope or other API error
                        pass

                    identity = GithubIdentityInfo(
                        account_id=user.id,
                        account_name=user.login,
                        account_url=user.url,
                        account_email=account_email,
                    )
                    return identity

                except Exception as error:
                    raise GithubInvalidTokenError(
                        original_exception=error,
                    )

            elif session.id != 0 and session.key:
                auth = Auth.AppAuth(session.id, session.key)
                gi = GithubIntegration(auth=auth, retry=retry_config)
                installations = []
                for installation in gi.get_installations():
                    installations.append(
                        installation.raw_data.get("account", {}).get("login")
                    )
                try:
                    app = gi.get_app()
                    identity = GithubAppIdentityInfo(
                        app_id=app.id,
                        app_name=app.name,
                        installations=installations,
                    )
                    return identity

                except Exception as error:
                    raise GithubInvalidCredentialsError(
                        original_exception=error,
                    )

        except Exception as error:
            logger.critical(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            raise GithubSetUpIdentityError(
                original_exception=error,
            )

    def print_credentials(self):
        """
        Prints the GitHub credentials.

        Usage:
            >>> self.print_credentials()
        """
        if isinstance(self.identity, GithubIdentityInfo):
            report_lines = [
                f"GitHub Account: {Fore.YELLOW}{self.identity.account_name}{Style.RESET_ALL}",
                f"GitHub Account ID: {Fore.YELLOW}{self.identity.account_id}{Style.RESET_ALL}",
            ]
            if self.identity.account_email:
                report_lines.append(
                    f"GitHub Account Email: {Fore.YELLOW}{self.identity.account_email}{Style.RESET_ALL}"
                )
            report_lines.append(
                f"Authentication Method: {Fore.YELLOW}{self.auth_method}{Style.RESET_ALL}"
            )
        elif isinstance(self.identity, GithubAppIdentityInfo):
            report_lines = [
                f"GitHub App ID: {Fore.YELLOW}{self.identity.app_id}{Style.RESET_ALL}",
                f"GitHub App Name: {Fore.YELLOW}{self.identity.app_name}{Style.RESET_ALL}",
                f"Authentication Method: {Fore.YELLOW}{self.auth_method}{Style.RESET_ALL}",
            ]
        report_title = (
            f"{Style.BRIGHT}Using the GitHub credentials below:{Style.RESET_ALL}"
        )
        print_boxes(report_lines, report_title)

    @staticmethod
    def validate_provider_id(
        session: GithubSession,
        provider_id: str,
    ) -> None:
        """
        Validate that the provider ID (username or organization) is accessible with the given credentials.

        Args:
            session (GithubSession): The GitHub session with authentication.
            provider_id (str): The provider ID to validate (username or organization name).

        Raises:
            GithubInvalidProviderIdError: If the provider ID is not accessible with the given credentials.

        Examples:
            >>> GithubProvider.validate_provider_id(session, "my-username")
            >>> GithubProvider.validate_provider_id(session, "my-organization")
        """
        try:
            retry_config = GithubRetry(total=3)

            if session.token:
                # For Personal Access Token and OAuth App Token
                auth = Auth.Token(session.token)
                g = Github(auth=auth, retry=retry_config)

                # First check if the provider ID is the authenticated user
                authenticated_user = g.get_user()
                if authenticated_user.login == provider_id:
                    return

                # Then check if the provider ID is an organization the token has access to
                try:
                    g.get_organization(provider_id)
                    return
                except Exception:
                    # Organization doesn't exist or the token doesn't have access to it
                    pass

                raise GithubInvalidProviderIdError(
                    file=os.path.basename(__file__),
                    message=f"The provider ID '{provider_id}' is not accessible with the provided credentials. "
                    f"Authenticated user: {authenticated_user.login}",
                )

            elif session.id != 0 and session.key:
                # For GitHub App
                auth = Auth.AppAuth(session.id, session.key)
                gi = GithubIntegration(auth=auth, retry=retry_config)

                # Check if the provider ID is in the app's installations
                for installation in gi.get_installations():
                    try:
                        # Check if the installation id is the username or organization id
                        account_login = installation.raw_data.get("account", {}).get(
                            "login"
                        )
                        if account_login == provider_id:
                            return
                    except Exception:
                        continue

                raise GithubInvalidProviderIdError(
                    file=os.path.basename(__file__),
                    message=f"The provider ID '{provider_id}' is not accessible with the provided GitHub App credentials.",
                )

        except GithubInvalidProviderIdError:
            # Re-raise the specific exception
            raise
        except Exception as error:
            logger.critical(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            raise GithubInvalidProviderIdError(
                file=os.path.basename(__file__),
                original_exception=error,
                message=f"Error validating provider ID '{provider_id}'",
            )

    @staticmethod
    def test_connection(
        personal_access_token: str = "",
        oauth_app_token: str = "",
        github_app_key: str = "",
        github_app_key_content: str = "",
        github_app_id: int = 0,
        raise_on_exception: bool = True,
        provider_id: str = None,
    ) -> Connection:
        """Test connection to GitHub.

        Test the connection to GitHub using the provided credentials.

        Args:
            personal_access_token (str): GitHub personal access token.
            oauth_app_token (str): GitHub OAuth App token.
            github_app_key (str): GitHub App key.
            github_app_key_content (str): GitHub App key content.
            github_app_id (int): GitHub App ID.
            raise_on_exception (bool): Flag indicating whether to raise an exception if the connection fails.
            provider_id (str): The provider ID, in this case it's the GitHub organization/username.

        Returns:
            Connection: Connection object with success status or error information.

        Raises:
            Exception: If failed to test the connection to GitHub.
            GithubEnvironmentVariableError: If environment variables are missing.
            GithubInvalidTokenError: If the provided token is invalid.
            GithubInvalidCredentialsError: If the provided App credentials are invalid.
            GithubSetUpSessionError: If there is an error setting up the session.
            GithubSetUpIdentityError: If there is an error setting up the identity.
            GithubInvalidProviderIdError: If the provided provider ID is not accessible with the given credentials.

        Examples:
            >>> GithubProvider.test_connection(personal_access_token="ghp_xxxxxxxxxxxxxxxx")
            Connection(is_connected=True)
            >>> GithubProvider.test_connection(github_app_id=12345, github_app_key="/path/to/key.pem")
            Connection(is_connected=True)
            >>> GithubProvider.test_connection(provider_id="my-org")
            Connection(is_connected=True)
        """
        try:
            # Set up the GitHub session
            session = GithubProvider.setup_session(
                personal_access_token=personal_access_token,
                oauth_app_token=oauth_app_token,
                github_app_id=github_app_id,
                github_app_key=github_app_key,
                github_app_key_content=github_app_key_content,
            )

            # Set up the identity to test the connection
            GithubProvider.setup_identity(session)

            # Validate provider ID if provided
            if provider_id:
                GithubProvider.validate_provider_id(session, provider_id)

            return Connection(is_connected=True)
        except GithubInvalidProviderIdError as provider_id_error:
            logger.critical(
                f"{provider_id_error.__class__.__name__}[{provider_id_error.__traceback__.tb_lineno}]: {provider_id_error}"
            )
            if raise_on_exception:
                raise provider_id_error
            return Connection(error=provider_id_error)
        except Exception as error:
            logger.critical(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            if raise_on_exception:
                raise error
            return Connection(error=error)
```

--------------------------------------------------------------------------------

---[FILE: models.py]---
Location: prowler-master/prowler/providers/github/models.py
Signals: Pydantic

```python
from typing import Optional

from pydantic.v1 import BaseModel

from prowler.config.config import output_file_timestamp
from prowler.providers.common.models import ProviderOutputOptions


class GithubSession(BaseModel):
    token: str
    key: str
    id: str


class GithubIdentityInfo(BaseModel):
    account_id: str
    account_name: str
    account_url: str
    account_email: Optional[str] = None


class GithubAppIdentityInfo(BaseModel):
    app_id: str
    app_name: str
    installations: list[str]


class GithubOutputOptions(ProviderOutputOptions):
    def __init__(self, arguments, bulk_checks_metadata, identity):
        # First call ProviderOutputOptions init
        super().__init__(arguments, bulk_checks_metadata)
        # TODO move the below if to ProviderOutputOptions
        # Check if custom output filename was input, if not, set the default
        if (
            not hasattr(arguments, "output_filename")
            or arguments.output_filename is None
        ):
            if isinstance(identity, GithubIdentityInfo):
                self.output_filename = (
                    f"prowler-output-{identity.account_name}-{output_file_timestamp}"
                )
            elif isinstance(identity, GithubAppIdentityInfo):
                self.output_filename = (
                    f"prowler-output-{identity.app_id}-{output_file_timestamp}"
                )
        else:
            self.output_filename = arguments.output_filename
```

--------------------------------------------------------------------------------

---[FILE: exceptions.py]---
Location: prowler-master/prowler/providers/github/exceptions/exceptions.py

```python
from prowler.exceptions.exceptions import ProwlerException


# Exceptions codes from 5000 to 5999 are reserved for Github exceptions
class GithubBaseException(ProwlerException):
    """Base class for Github Errors."""

    GITHUB_ERROR_CODES = {
        (5000, "GithubEnvironmentVariableError"): {
            "message": "Github environment variable error",
            "remediation": "Check the Github environment variables and ensure they are properly set.",
        },
        (5001, "GithubNonExistentTokenError"): {
            "message": "A Github token is required to authenticate against Github",
            "remediation": "Check the Github token and ensure it is properly set up.",
        },
        (5002, "GithubInvalidTokenError"): {
            "message": "Github token provided is not valid",
            "remediation": "Check the Github token and ensure it is valid.",
        },
        (5003, "GithubSetUpSessionError"): {
            "message": "Error setting up session",
            "remediation": "Check the session setup and ensure it is properly set up.",
        },
        (5004, "GithubSetUpIdentityError"): {
            "message": "Github identity setup error due to bad credentials",
            "remediation": "Check credentials and ensure they are properly set up for Github and the identity provider.",
        },
        (5005, "GithubInvalidCredentialsError"): {
            "message": "Github invalid App Key or App ID for GitHub APP login",
            "remediation": "Check user and password and ensure they are properly set up as in your Github account.",
        },
        (5006, "GithubInvalidProviderIdError"): {
            "message": "The provided provider ID does not match with the authenticated user or accessible organizations",
            "remediation": "Check the provider ID and ensure it matches the authenticated user or an organization you have access to.",
        },
    }

    def __init__(self, code, file=None, original_exception=None, message=None):
        provider = "Github"
        error_info = self.GITHUB_ERROR_CODES.get((code, self.__class__.__name__))
        if message:
            error_info["message"] = message
        super().__init__(
            code=code,
            source=provider,
            file=file,
            original_exception=original_exception,
            error_info=error_info,
        )


class GithubCredentialsError(GithubBaseException):
    """Base class for Github credentials errors."""

    def __init__(self, code, file=None, original_exception=None, message=None):
        super().__init__(code, file, original_exception, message)


class GithubEnvironmentVariableError(GithubCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            5000, file=file, original_exception=original_exception, message=message
        )


class GithubNonExistentTokenError(GithubCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            5001, file=file, original_exception=original_exception, message=message
        )


class GithubInvalidTokenError(GithubCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            5002, file=file, original_exception=original_exception, message=message
        )


class GithubSetUpSessionError(GithubCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            5003, file=file, original_exception=original_exception, message=message
        )


class GithubSetUpIdentityError(GithubCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            5004, file=file, original_exception=original_exception, message=message
        )


class GithubInvalidCredentialsError(GithubCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            5005, file=file, original_exception=original_exception, message=message
        )


class GithubInvalidProviderIdError(GithubCredentialsError):
    def __init__(self, file=None, original_exception=None, message=None):
        super().__init__(
            5006, file=file, original_exception=original_exception, message=message
        )
```

--------------------------------------------------------------------------------

---[FILE: arguments.py]---
Location: prowler-master/prowler/providers/github/lib/arguments/arguments.py

```python
def init_parser(self):
    """Init the Github Provider CLI parser"""
    github_parser = self.subparsers.add_parser(
        "github", parents=[self.common_providers_parser], help="GitHub Provider"
    )
    github_auth_subparser = github_parser.add_argument_group("Authentication Modes")
    # Authentication Modes
    github_auth_subparser.add_argument(
        "--personal-access-token",
        nargs="?",
        help="Personal Access Token to log in against GitHub",
        default=None,
        metavar="GITHUB_PERSONAL_ACCESS_TOKEN",
    )

    github_auth_subparser.add_argument(
        "--oauth-app-token",
        nargs="?",
        help="OAuth App Token to log in against GitHub",
        default=None,
        metavar="GITHUB_OAUTH_APP_TOKEN",
    )

    # GitHub App Authentication
    github_auth_subparser.add_argument(
        "--github-app-id",
        nargs="?",
        help="GitHub App ID to log in against GitHub",
        default=None,
        metavar="GITHUB_APP_ID",
    )
    github_auth_subparser.add_argument(
        "--github-app-key",
        "--github-app-key-path",
        nargs="?",
        help="GitHub App Key Path to log in against GitHub",
        default=None,
        metavar="GITHUB_APP_KEY",
    )

    github_scoping_subparser = github_parser.add_argument_group("Scan Scoping")
    github_scoping_subparser.add_argument(
        "--repository",
        "--repositories",
        nargs="*",
        help="Repository name(s) to scan in 'owner/repo-name' format",
        default=None,
        metavar="REPOSITORY",
    )
    github_scoping_subparser.add_argument(
        "--organization",
        "--organizations",
        nargs="*",
        help="Organization or user name(s) to scan repositories for",
        default=None,
        metavar="ORGANIZATION",
    )
```

--------------------------------------------------------------------------------

---[FILE: mutelist.py]---
Location: prowler-master/prowler/providers/github/lib/mutelist/mutelist.py

```python
from prowler.lib.check.models import CheckReportGithub
from prowler.lib.mutelist.mutelist import Mutelist
from prowler.lib.outputs.utils import unroll_dict, unroll_tags


class GithubMutelist(Mutelist):
    def is_finding_muted(
        self,
        finding: CheckReportGithub,
        account_name: str,
    ) -> bool:
        return self.is_muted(
            account_name,
            finding.check_metadata.CheckID,
            "*",  # TODO: Study regions in GitHub
            finding.resource_name,
            unroll_dict(unroll_tags(finding.resource_tags)),
        )
```

--------------------------------------------------------------------------------

---[FILE: service.py]---
Location: prowler-master/prowler/providers/github/lib/service/service.py

```python
import github
from github import Auth, Github, GithubIntegration
from github.GithubRetry import GithubRetry

from prowler.lib.logger import logger
from prowler.providers.github.github_provider import GithubProvider


class GithubService:
    def __init__(
        self,
        service: str,
        provider: GithubProvider,
    ):
        self.provider = provider
        self.clients = self.__set_clients__(
            provider.session,
        )

        self.audit_config = provider.audit_config
        self.fixer_config = provider.fixer_config

    def __set_clients__(self, session):
        clients = []
        try:
            retry_config = GithubRetry(total=3)
            if session.token:
                auth = Auth.Token(session.token)
                clients = [Github(auth=auth, retry=retry_config)]

            elif session.key and session.id:
                auth = Auth.AppAuth(
                    session.id,
                    session.key,
                )
                gi = GithubIntegration(auth=auth, retry=retry_config)

                for installation in gi.get_installations():
                    clients.append(installation.get_github_for_installation())

        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return clients

    def _handle_github_api_error(
        self, error, context: str, item_name: str, reraise_rate_limit: bool = False
    ):
        """Centralized GitHub API error handling"""
        if isinstance(error, github.RateLimitExceededException):
            logger.error(f"Rate limit exceeded while {context} '{item_name}': {error}")
            if reraise_rate_limit:
                raise
        elif isinstance(error, github.GithubException):
            if "404" in str(error):
                logger.error(f"'{item_name}' not found or not accessible")
            elif "403" in str(error):
                logger.error(
                    f"Access denied to '{item_name}' - insufficient permissions"
                )
            else:
                logger.error(f"GitHub API error for '{item_name}': {error}")
        else:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_repositories_from_owner(self, client, name: str):
        """Get repositories from organization or user entity"""
        try:
            org = client.get_organization(name)
            return org.get_repos(), "organization"
        except github.GithubException as error:
            if "404" in str(error):
                logger.info(f"'{name}' not found as organization, trying as user...")
                try:
                    user = client.get_user(name)
                    return user.get_repos(), "user"
                except github.GithubException as user_error:
                    self._handle_github_api_error(
                        user_error, "accessing", f"{name} as user"
                    )
                    return [], "none"
                except Exception as user_error:
                    self._handle_github_api_error(
                        user_error, "accessing", f"{name} as user"
                    )
                    return [], "none"
            else:
                self._handle_github_api_error(error, "accessing organization", name)
                return [], "none"
        except Exception as error:
            self._handle_github_api_error(error, "accessing organization", name)
            return [], "none"
```

--------------------------------------------------------------------------------

---[FILE: organization_client.py]---
Location: prowler-master/prowler/providers/github/services/organization/organization_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.github.services.organization.organization_service import (
    Organization,
)

organization_client = Organization(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

````
