---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 78
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 78 of 867)

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

---[FILE: gcp-details.mdx]---
Location: prowler-master/docs/developer-guide/gcp-details.mdx

```text
---
title: 'Google Cloud Provider'
---

This page details the [Google Cloud Platform (GCP)](https://cloud.google.com/) provider implementation in Prowler.

By default, Prowler will audit all the GCP projects that the authenticated identity can access. To configure it, follow the [GCP getting started guide](/user-guide/providers/gcp/getting-started-gcp).

## GCP Provider Classes Architecture

The GCP provider implementation follows the general [Provider structure](/developer-guide/provider). This section focuses on the GCP-specific implementation, highlighting how the generic provider concepts are realized for GCP in Prowler. For a full overview of the provider pattern, base classes, and extension guidelines, see [Provider documentation](/developer-guide/provider).

### Main Class

- **Location:** [`prowler/providers/gcp/gcp_provider.py`](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/gcp/gcp_provider.py)
- **Base Class:** Inherits from `Provider` (see [base class details](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/common/provider.py)).
- **Purpose:** Central orchestrator for GCP-specific logic, session management, credential validation, project and organization discovery, and configuration.
- **Key GCP Responsibilities:**
    - Initializes and manages GCP sessions (supports Application Default Credentials, Service Account, OAuth, and impersonation).
    - Validates credentials and sets up the GCP identity context.
    - Loads and manages configuration, mutelist, and fixer settings.
    - Discovers accessible GCP projects and organization metadata.
    - Provides properties and methods for downstream GCP service classes to access session, identity, and configuration data.

### Data Models

- **Location:** [`prowler/providers/gcp/models.py`](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/gcp/models.py)
- **Purpose:** Define structured data for GCP identity, project, and organization info.
- **Key GCP Models:**
    - `GCPIdentityInfo`: Holds GCP identity metadata, such as the profile name.
    - `GCPOrganization`: Represents a GCP organization with ID, name, and display name.
    - `GCPProject`: Represents a GCP project with number, ID, name, organization, labels, and lifecycle state.

### `GCPService` (Service Base Class)

- **Location:** [`prowler/providers/gcp/lib/service/service.py`](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/gcp/lib/service/service.py)
- **Purpose:** Abstract base class that all GCP service-specific classes inherit from. This implements the generic service pattern (described in [service page](/developer-guide/services#service-base-class)) specifically for GCP.
- **Key GCP Responsibilities:**
    - Receives a `GcpProvider` instance to access session, identity, and configuration.
    - Manages clients for all services by project.
    - Filters projects to only those with the relevant API enabled.
    - Provides `__threading_call__` method to make API calls in parallel by project or resource.
    - Exposes common audit context (`project_ids`, `projects`, `default_project_id`, `audit_config`, `fixer_config`) to subclasses.

### Exception Handling

- **Location:** [`prowler/providers/gcp/exceptions/exceptions.py`](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/gcp/exceptions/exceptions.py)
- **Purpose:** Custom exception classes for GCP-specific error handling, such as credential, session, and project access errors.

### Session and Utility Helpers

- **Location:** [`prowler/providers/gcp/lib/`](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/gcp/lib/)
- **Purpose:** Helpers for argument parsing, mutelist management, and other cross-cutting concerns.

## Retry Configuration

GCP services implement automatic retry functionality for rate limiting errors (HTTP 429). This is configured centrally and must be included in all API calls:

### Required Implementation

```python
from prowler.providers.gcp.config import DEFAULT_RETRY_ATTEMPTS

# In discovery.build()
client = discovery.build(
    service, version, credentials=credentials,
    num_retries=DEFAULT_RETRY_ATTEMPTS
)

# In request.execute()
response = request.execute(num_retries=DEFAULT_RETRY_ATTEMPTS)
```

### Configuration

- **Default Value**: 3 attempts (configurable in `prowler/providers/gcp/config.py`)
- **Command Line Flag**: `--gcp-retries-max-attempts` for runtime configuration
- **Error Types**: HTTP 429 and quota exceeded errors
- **Backoff Strategy**: Exponential backoff with randomization

### Example Service Implementation

```python
def _get_instances(self):
    for project_id in self.project_ids:
        try:
            client = discovery.build(
                "compute", "v1", credentials=self.credentials,
                num_retries=DEFAULT_RETRY_ATTEMPTS
            )
            request = client.instances().list(project=project_id)
            response = request.execute(num_retries=DEFAULT_RETRY_ATTEMPTS)
            # Process response...
        except Exception as error:
            logger.error(f"{error.__class__.__name__}: {error}")
```

## Specific Patterns in GCP Services

The generic service pattern is described in [service page](/developer-guide/services#service-structure-and-initialisation). You can find all the currently implemented services in the following locations:

- Directly in the code, in location [`prowler/providers/gcp/services/`](https://github.com/prowler-cloud/prowler/tree/master/prowler/providers/gcp/services)
- In the [Prowler Hub](https://hub.prowler.com/) for a more human-readable view.

The best reference to understand how to implement a new service is following the [service implementation documentation](/developer-guide/services#adding-a-new-service) and taking other services already implemented as reference. In next subsection you can find a list of common patterns that are used accross all GCP services.

### GCP Service Common Patterns

- Services communicate with GCP using the Google Cloud Python SDK, you can find the documentation with all the services [here](https://cloud.google.com/python/docs/reference).
- Every GCP service class inherits from `GCPService`, ensuring access to session, identity, configuration, and client utilities.
- The constructor (`__init__`) always calls `super().__init__` with the service name, provider, region (default "global"), and API version (default "v1"). Usually, the service name is the class name in lowercase, so it is called like `super().__init__(__class__.__name__, provider)`.
- Resource containers **must** be initialized in the constructor, typically as dictionaries keyed by resource ID and the value is the resource object.
- Only projects with the API enabled are included in the audit scope.
- Resource discovery and attribute collection can be parallelized using `self.__threading_call__`, typically by region/zone or resource.
- All GCP resources are represented as Pydantic `BaseModel` classes, providing type safety and structured access to resource attributes.
- Each GCP API calls are wrapped in try/except blocks, always logging errors.
- **Retry Configuration**: All `request.execute()` calls must include `num_retries=DEFAULT_RETRY_ATTEMPTS` for automatic retry on rate limiting errors (HTTP 429).
- Tags and additional attributes that cannot be retrieved from the default call should be collected and stored for each resource using dedicated methods and threading.

## Specific Patterns in GCP Checks

The GCP checks pattern is described in [checks page](/developer-guide/checks). You can find all the currently implemented checks:

- Directly in the code, within each service folder, each check has its own folder named after the name of the check. (e.g. [`prowler/providers/gcp/services/iam/iam_sa_user_managed_key_unused/`](https://github.com/prowler-cloud/prowler/tree/master/prowler/providers/gcp/services/iam/iam_sa_user_managed_key_unused))
- In the [Prowler Hub](https://hub.prowler.com/) for a more human-readable view.

The best reference to understand how to implement a new check is following the [GCP check implementation documentation](/developer-guide/checks#creating-a-check) and taking other similar checks as reference.

### Check Report Class

The `Check_Report_GCP` class models a single finding for a GCP resource in a check report. It is defined in [`prowler/lib/check/models.py`](https://github.com/prowler-cloud/prowler/blob/master/prowler/lib/check/models.py) and inherits from the generic `Check_Report` base class.

#### Purpose

`Check_Report_GCP` extends the base report structure with GCP-specific fields, enabling detailed tracking of the resource, project, and location associated with each finding.

#### Constructor and Attribute Population

When you instantiate `Check_Report_GCP`, you must provide the check metadata and a resource object. The class will attempt to automatically populate its GCP-specific attributes from the resource, using the following logic (in order of precedence):

- **`resource_id`**:
    - Uses the explicit `resource_id` argument if provided.
    - Otherwise, uses `resource.id` if present.
    - Otherwise, uses `resource.name` if present.
    - Defaults to an empty string if none are available.

- **`resource_name`**:
    - Uses the explicit `resource_name` argument if provided.
    - Otherwise, uses `resource.name` if present.
    - Defaults to an empty string.

- **`project_id`**:
    - Uses the explicit `project_id` argument if provided.
    - Otherwise, uses `resource.project_id` if present.
    - Defaults to an empty string.

- **`location`**:
    - Uses the explicit `location` argument if provided.
    - Otherwise, uses `resource.location` if present.
    - Otherwise, uses `resource.region` if present.
    - Defaults to "global" if none are available.

All these attributes can be overridden by passing the corresponding argument to the constructor. If the resource object does not contain the required attributes, you must set them manually.
Others attributes are inherited from the `Check_Report` class, from that ones you **always** have to set the `status` and `status_extended` attributes in the check logic.

#### Example Usage

```python
report = Check_Report_GCP(
    metadata=check_metadata,
    resource=resource_object,
    resource_id="custom-id",  # Optional override
    resource_name="custom-name",  # Optional override
    project_id="my-gcp-project",  # Optional override
    location="us-central1"  # Optional override
)
report.status = "PASS"
report.status_extended = "Resource is compliant."
```
```

--------------------------------------------------------------------------------

---[FILE: github-details.mdx]---
Location: prowler-master/docs/developer-guide/github-details.mdx

```text
---
title: 'GitHub Provider'
---

This page details the [GitHub](https://github.com/) provider implementation in Prowler.

By default, Prowler will audit the GitHub account - scanning all repositories, organizations, and applications that your configured credentials can access. To configure it, follow the [GitHub getting started guide](/user-guide/providers/github/getting-started-github).

## GitHub Provider Classes Architecture

The GitHub provider implementation follows the general [Provider structure](/developer-guide/provider). This section focuses on the GitHub-specific implementation, highlighting how the generic provider concepts are realized for GitHub in Prowler. For a full overview of the provider pattern, base classes, and extension guidelines, see [Provider documentation](/developer-guide/provider).

### `GithubProvider` (Main Class)

- **Location:** [`prowler/providers/github/github_provider.py`](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/github/github_provider.py)
- **Base Class:** Inherits from `Provider` (see [base class details](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/common/provider.py)).
- **Purpose:** Central orchestrator for GitHub-specific logic, session management, credential validation, and configuration.
- **Key GitHub Responsibilities:**
    - Initializes and manages GitHub sessions (supports Personal Access Token, OAuth App, and GitHub App authentication).
    - Validates credentials and sets up the GitHub identity context.
    - Loads and manages configuration, mutelist, and fixer settings.
    - Provides properties and methods for downstream GitHub service classes to access session, identity, and configuration data.

### Data Models

- **Location:** [`prowler/providers/github/models.py`](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/github/models.py)
- **Purpose:** Define structured data for GitHub identity, session, and output options.
- **Key GitHub Models:**
    - `GithubSession`: Holds authentication tokens and keys for the session.
    - `GithubIdentityInfo`, `GithubAppIdentityInfo`: Store account or app identity metadata.

### `GithubService` (Service Base Class)

- **Location:** [`prowler/providers/github/lib/service/service.py`](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/github/lib/service/service.py)
- **Purpose:** Abstract base class for all GitHub service-specific classes.
- **Key GitHub Responsibilities:**
    - Receives a `GithubProvider` instance to access session, identity, and configuration.
    - Manages GitHub API clients for the authenticated user or app.
    - Exposes common audit context (`audit_config`, `fixer_config`) to subclasses.

### Exception Handling

- **Location:** [`prowler/providers/github/exceptions/exceptions.py`](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/github/exceptions/exceptions.py)
- **Purpose:** Custom exception classes for GitHub-specific error handling, such as credential and session errors.

### Session and Utility Helpers

- **Location:** [`prowler/providers/github/lib/`](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/github/lib/)
- **Purpose:** Helpers for argument parsing, mutelist management, and other cross-cutting concerns.

## Specific Patterns in GitHub Services

The generic service pattern is described in [service page](/developer-guide/services#service-structure-and-initialisation). You can find all the currently implemented services in the following locations:

- Directly in the code, in location [`prowler/providers/github/services/`](https://github.com/prowler-cloud/prowler/tree/master/prowler/providers/github/services)
- In the [Prowler Hub](https://hub.prowler.com/) for a more human-readable view.

The best reference to understand how to implement a new service is following the [service implementation documentation](/developer-guide/services#adding-a-new-service) and by taking other already implemented services as reference.

### GitHub Service Common Patterns

- Services communicate with GitHub using the PyGithub Python SDK. See the [official documentation](https://pygithub.readthedocs.io/).
- Every GitHub service class inherits from `GithubService`, ensuring access to session, identity, configuration, and client utilities.
- The constructor (`__init__`) always calls `super().__init__` with the service name and provider (e.g. `super().__init__(__class__.__name__, provider))`). Ensure that the service name in PyGithub is the same that you use in the constructor. Usually is used the `__class__.__name__` to get the service name because it is the same as the class name.
- Resource containers **must** be initialized in the constructor, typically as dictionaries keyed by resource ID or name.
- All GitHub resources are represented as Pydantic `BaseModel` classes, providing type safety and structured access to resource attributes.
- GitHub API calls are wrapped in try/except blocks, always logging errors.

## Specific Patterns in GitHub Checks

The GitHub checks pattern is described in [checks page](/developer-guide/checks). You can find all the currently implemented checks in:

- Directly in the code, within each service folder, each check has its own folder named after the name of the check. (e.g. [`prowler/providers/github/services/repository/repository_secret_scanning_enabled/`](https://github.com/prowler-cloud/prowler/tree/master/prowler/providers/github/services/repository/repository_secret_scanning_enabled))
- In the [Prowler Hub](https://hub.prowler.com/) for a more human-readable view.

The best reference to understand how to implement a new check is the [GitHub check implementation documentation](/developer-guide/checks#creating-a-check) and by taking other checks as reference.

### Check Report Class

The `CheckReportGithub` class models a single finding for a GitHub resource in a check report. It is defined in [`prowler/lib/check/models.py`](https://github.com/prowler-cloud/prowler/blob/master/prowler/lib/check/models.py) and inherits from the generic `Check_Report` base class.

#### Purpose

`CheckReportGithub` extends the base report structure with GitHub-specific fields, enabling detailed tracking of the resource, name, and owner associated with each finding.

#### Constructor and Attribute Population

When you instantiate `CheckReportGithub`, you must provide the check metadata and a resource object. The class will attempt to automatically populate its GitHub-specific attributes from the resource, using the following logic (in order of precedence):

- **`resource_id`**:
    - Uses the explicit `resource_id` argument if provided.
    - Otherwise, uses `resource.id` if present.
    - Defaults to an empty string if not available.

- **`resource_name`**:
    - Uses the explicit `resource_name` argument if provided.
    - Otherwise, uses `resource.name` if present.
    - Defaults to an empty string if not available.

- **`owner`**:
    - Uses the explicit `owner` argument if provided.
    - Otherwise, uses `resource.owner` for repositories and `resource.name` for organizations.
    - Defaults to an empty string if not available.

If the resource object does not contain the required attributes, you must set them manually in the check logic.

Other attributes are inherited from the `Check_Report` class, from which you **always** have to set the `status` and `status_extended` attributes in the check logic.

#### Example Usage

```python
report = CheckReportGithub(
    metadata=check_metadata,
    resource=resource_object
)
report.status = "PASS"
report.status_extended = "Resource is compliant."
```
```

--------------------------------------------------------------------------------

---[FILE: integration-testing.mdx]---
Location: prowler-master/docs/developer-guide/integration-testing.mdx

```text
---
title: 'Integration Tests'
---

Coming soon ...
```

--------------------------------------------------------------------------------

---[FILE: integrations.mdx]---
Location: prowler-master/docs/developer-guide/integrations.mdx

```text
---
title: 'Creating a New Integration'
---

## Introduction

Integrating Prowler with external tools enhances its functionality and enables seamless workflow automation. Prowler supports a variety of integrations to optimize security assessments and reporting.

### Supported Integration Targets

- Messaging Platforms – Example: Slack

- Project Management Tools – Example: Jira

- Cloud Services – Example: AWS Security Hub

### Integration Guidelines
To integrate Prowler with a specific product:

Refer to the [Prowler Developer Guide](https://docs.prowler.com/projects/prowler-open-source/en/latest/) to understand its architecture and integration mechanisms.

* Identify the most suitable integration method for the intended platform.

## Steps to Create an Integration

### Defining the Integration Purpose

* Before implementing an integration, clearly define its objective. Common purposes include:

    * Sending Prowler findings to a platform for alerting, tracking, or further analysis.
    * For inspiration and implementation examples, please review the existing integrations in the [`prowler/lib/outputs`](https://github.com/prowler-cloud/prowler/tree/master/prowler/lib/outputs) folder.

### Developing the Integration

* Script Development:

    * Write a script to process Prowler’s output and interact with the target platform’s API.
    * If the goal is to send findings, parse Prowler’s results and use the platform’s API to create entries or notifications.

* Configuration:

    * Ensure the script supports environment-specific settings, such as:

        - API endpoints

        - Authentication tokens

        - Any necessary configurable parameters.

### Fundamental Structure

* Integration Class:

    * To implement an integration, create a class that encapsulates the required attributes and methods for interacting with the target platform. Example: Jira Integration

    ```python title="Jira Class"
    class Jira:
    """
    Jira class to interact with the Jira API

    [Note]
    This integration is limited to a single Jira Cloud instance, meaning all issues will be created under the same Jira Cloud ID. Future improvements will include the ability to specify a Jira Cloud ID for users associated with multiple accounts.

    Attributes
        - _redirect_uri: The redirect URI used
        - _client_id: The client identifier
        - _client_secret: The client secret
        - _access_token: The access token
        - _refresh_token: The refresh token
        - _expiration_date: The authentication expiration
        - _cloud_id: The cloud identifier
        - _scopes: The scopes needed to authenticate, read:jira-user read:jira-work write:jira-work
        - AUTH_URL: The URL to authenticate with Jira
        - PARAMS_TEMPLATE: The template for the parameters to authenticate with Jira
        - TOKEN_URL: The URL to get the access token from Jira
        - API_TOKEN_URL: The URL to get the accessible resources from Jira

    Methods
        __init__: Initializes the Jira object
        - input_authorization_code: Inputs the authorization code
        - auth_code_url: Generates the URL to authorize the application
        - get_auth: Gets the access token and refreshes it
        - get_cloud_id: Gets the cloud identifier from Jira
        - get_access_token: Gets the access token
        - refresh_access_token: Refreshes the access token from Jira
        - test_connection: Tests the connection to Jira and returns a Connection object
        - get_projects: Gets the projects from Jira
        - get_available_issue_types: Gets the available issue types for a project
        - send_findings: Sends the findings to Jira and creates an issue

    Raises:
        - JiraGetAuthResponseError: Failed to get the access token and refresh token
        - JiraGetCloudIDNoResourcesError: No resources were found in Jira when getting the cloud id
        - JiraGetCloudIDResponseError: Failed to get the cloud ID, response code did not match 200
        - JiraGetCloudIDError: Failed to get the cloud ID from Jira
        - JiraAuthenticationError: Failed to authenticate
        - JiraRefreshTokenError: Failed to refresh the access token
        - JiraRefreshTokenResponseError: Failed to refresh the access token, response code did not match 200
        - JiraGetAccessTokenError: Failed to get the access token
        - JiraNoProjectsError: No projects found in Jira
        - JiraGetProjectsError: Failed to get projects from Jira
        - JiraGetProjectsResponseError: Failed to get projects from Jira, response code did not match 200
        - JiraInvalidIssueTypeError: The issue type is invalid
        - JiraGetAvailableIssueTypesError: Failed to get available issue types from Jira
        - JiraGetAvailableIssueTypesResponseError: Failed to get available issue types from Jira, response code did not match 200
        - JiraCreateIssueError: Failed to create an issue in Jira
        - JiraSendFindingsResponseError: Failed to send the findings to Jira
        - JiraTestConnectionError: Failed to test the connection

    Usage:
        jira = Jira(
            redirect_uri="http://localhost:8080",
            client_id="client_id",
            client_secret="client_secret
        )
        jira.send_findings(findings=findings, project_key="KEY")
    """

    _redirect_uri: str = None
    _client_id: str = None
    _client_secret: str = None
    _access_token: str = None
    _refresh_token: str = None
    _expiration_date: int = None
    _cloud_id: str = None
    _scopes: list[str] = None
    AUTH_URL = "https://auth.atlassian.com/authorize"
    PARAMS_TEMPLATE = {
        "audience": "api.atlassian.com",
        "client_id": None,
        "scope": None,
        "redirect_uri": None,
        "state": None,
        "response_type": "code",
        "prompt": "consent",
    }
    TOKEN_URL = "https://auth.atlassian.com/oauth/token"
    API_TOKEN_URL = "https://api.atlassian.com/oauth/token/accessible-resources"

    def __init__(
        self,
        redirect_uri: str = None,
        client_id: str = None,
        client_secret: str = None,
    ):
        self._redirect_uri = redirect_uri
        self._client_id = client_id
        self._client_secret = client_secret
        self._scopes = ["read:jira-user", "read:jira-work", "write:jira-work"]
        auth_url = self.auth_code_url()
        authorization_code = self.input_authorization_code(auth_url)
        self.get_auth(authorization_code)

    # More properties and methods
    ```

* Test Connection Method:

    * Validating Credentials or Tokens

        To ensure a successful connection to the target platform, implement a method that validates authentication credentials or tokens.

    #### Method Implementation

    The following example demonstrates the `test_connection` method for the `Jira` class:

    ```python title="Test connection"
    @staticmethod
    def test_connection(
        redirect_uri: str = None,
        client_id: str = None,
        client_secret: str = None,
        raise_on_exception: bool = True,
    ) -> Connection:
        """Test the connection to Jira

        Args:
            - redirect_uri: The redirect URI used
            - client_id: The client identifier
            - client_secret: The client secret
            - raise_on_exception: Whether to raise an exception or not

        Returns:
            - Connection: The connection object

        Raises:
            - JiraGetCloudIDNoResourcesError: No resources were found in Jira when getting the cloud id
            - JiraGetCloudIDResponseError: Failed to get the cloud ID, response code did not match 200
            - JiraGetCloudIDError: Failed to get the cloud ID from Jira
            - JiraAuthenticationError: Failed to authenticate
            - JiraTestConnectionError: Failed to test the connection
        """
        try:
            jira = Jira(
                redirect_uri=redirect_uri,
                client_id=client_id,
                client_secret=client_secret,
            )
            access_token = jira.get_access_token()

            if not access_token:
                return ValueError("Failed to get access token")

            headers = {"Authorization": f"Bearer {access_token}"}
            response = requests.get(
                f"https://api.atlassian.com/ex/jira/{jira.cloud_id}/rest/api/3/myself",
                headers=headers,
            )

            if response.status_code == 200:
                return Connection(is_connected=True)
            else:
                return Connection(is_connected=False, error=response.json())
        except JiraGetCloudIDNoResourcesError as no_resources_error:
            logger.error(
                f"{no_resources_error.__class__.__name__}[{no_resources_error.__traceback__.tb_lineno}]: {no_resources_error}"
            )
            if raise_on_exception:
                raise no_resources_error
            return Connection(error=no_resources_error)
        except JiraGetCloudIDResponseError as response_error:
            logger.error(
                f"{response_error.__class__.__name__}[{response_error.__traceback__.tb_lineno}]: {response_error}"
            )
            if raise_on_exception:
                raise response_error
            return Connection(error=response_error)
        except JiraGetCloudIDError as cloud_id_error:
            logger.error(
                f"{cloud_id_error.__class__.__name__}[{cloud_id_error.__traceback__.tb_lineno}]: {cloud_id_error}"
            )
            if raise_on_exception:
                raise cloud_id_error
            return Connection(error=cloud_id_error)
        except JiraAuthenticationError as auth_error:
            logger.error(
                f"{auth_error.__class__.__name__}[{auth_error.__traceback__.tb_lineno}]: {auth_error}"
            )
            if raise_on_exception:
                raise auth_error
            return Connection(error=auth_error)
        except Exception as error:
            logger.error(f"Failed to test connection: {error}")
            if raise_on_exception:
                raise JiraTestConnectionError(
                    message="Failed to test connection on the Jira integration",
                    file=os.path.basename(__file__),
                )
            return Connection(is_connected=False, error=error)
    ```

* Send Findings Method:

    * Add a method to send Prowler findings to the target platform, adhering to its API specifications.

    #### Method Implementation

    The following example demonstrates the `send_findings` method for the `Jira` class:

    ```python title="Send findings method"
    def send_findings(
        self,
        findings: list[Finding] = None,
        project_key: str = None,
        issue_type: str = None,
    ):
        """
        Send the findings to Jira

        Args:
            - findings: The findings to send
            - project_key: The project key
            - issue_type: The issue type

        Raises:
            - JiraRefreshTokenError: Failed to refresh the access token
            - JiraRefreshTokenResponseError: Failed to refresh the access token, response code did not match 200
            - JiraCreateIssueError: Failed to create an issue in Jira
            - JiraSendFindingsResponseError: Failed to send the findings to Jira
        """
        try:
            access_token = self.get_access_token()

            if not access_token:
                raise JiraNoTokenError(
                    message="No token was found",
                    file=os.path.basename(__file__),
                )

            projects = self.get_projects()

            if project_key not in projects:
                logger.error("The project key is invalid")
                raise JiraInvalidProjectKeyError(
                    message="The project key is invalid",
                    file=os.path.basename(__file__),
                )

            available_issue_types = self.get_available_issue_types(project_key)

            if issue_type not in available_issue_types:
                logger.error("The issue type is invalid")
                raise JiraInvalidIssueTypeError(
                    message="The issue type is invalid", file=os.path.basename(__file__)
                )
            headers = {
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
            }

            for finding in findings:
                status_color = self.get_color_from_status(finding.status.value)
                adf_description = self.get_adf_description(
                    check_id=finding.metadata.CheckID,
                    check_title=finding.metadata.CheckTitle,
                    severity=finding.metadata.Severity.value.upper(),
                    status=finding.status.value,
                    status_color=status_color,
                    status_extended=finding.status_extended,
                    provider=finding.metadata.Provider,
                    region=finding.region,
                    resource_uid=finding.resource_uid,
                    resource_name=finding.resource_name,
                    risk=finding.metadata.Risk,
                    recommendation_text=finding.metadata.Remediation.Recommendation.Text,
                    recommendation_url=finding.metadata.Remediation.Recommendation.Url,
                )
                payload = {
                    "fields": {
                        "project": {"key": project_key},
                        "summary": f"[Prowler] {finding.metadata.Severity.value.upper()} - {finding.metadata.CheckID} - {finding.resource_uid}",
                        "description": adf_description,
                        "issuetype": {"name": issue_type},
                    }
                }

                response = requests.post(
                    f"https://api.atlassian.com/ex/jira/{self.cloud_id}/rest/api/3/issue",
                    json=payload,
                    headers=headers,
                )

                if response.status_code != 201:
                    response_error = f"Failed to send finding: {response.status_code} - {response.json()}"
                    logger.warning(response_error)
                    raise JiraSendFindingsResponseError(
                        message=response_error, file=os.path.basename(__file__)
                    )
                else:
                    logger.info(f"Finding sent successfully: {response.json()}")
        except JiraRefreshTokenError as refresh_error:
            raise refresh_error
        except JiraRefreshTokenResponseError as response_error:
            raise response_error
        except Exception as e:
            logger.error(f"Failed to send findings: {e}")
            raise JiraCreateIssueError(
                message="Failed to create an issue in Jira",
                file=os.path.basename(__file__),
            )
    ```

### Testing the Integration

* Conduct integration testing in a controlled environment to validate expected behavior. Ensure the following:

    * Transmission Accuracy – Verify that Prowler findings are correctly sent and processed by the target platform.
    * Error Handling – Simulate edge cases to assess robustness and failure recovery mechanisms.

### Documentation

* Ensure the following elements are included:

    * Setup Instructions – List all necessary dependencies and installation steps.
    * Configuration Details – Specify required environment variables, authentication steps, etc.
    * Example Use Cases – Provide practical scenarios demonstrating functionality.
    * Troubleshooting Guide – Document common issues and resolution steps.
    * Comprehensive and clear documentation improves maintainability and simplifies onboarding.
```

--------------------------------------------------------------------------------

````
