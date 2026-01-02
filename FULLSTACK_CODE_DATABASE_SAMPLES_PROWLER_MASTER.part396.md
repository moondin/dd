---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 396
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 396 of 867)

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

---[FILE: projects_auditing_enabled.py]---
Location: prowler-master/prowler/providers/mongodbatlas/services/projects/projects_auditing_enabled/projects_auditing_enabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportMongoDBAtlas
from prowler.providers.mongodbatlas.services.projects.projects_client import (
    projects_client,
)


class projects_auditing_enabled(Check):
    """Check if database auditing is enabled for MongoDB Atlas projects

    This class verifies that MongoDB Atlas projects have database auditing
    enabled to track database operations and security events.
    """

    def execute(self) -> List[CheckReportMongoDBAtlas]:
        """Execute the MongoDB Atlas project auditing enabled check

        Iterates over all projects and checks if they have database auditing
        enabled by examining the audit configuration.

        Returns:
            List[CheckReportMongoDBAtlas]: A list of reports for each project
        """
        findings = []

        for project in projects_client.projects.values():
            report = CheckReportMongoDBAtlas(metadata=self.metadata(), resource=project)

            if not project.audit_config:
                report.status = "FAIL"
                report.status_extended = f"Project {project.name} does not have audit configuration available."
            else:
                # Check if audit configuration is enabled
                if project.audit_config.enabled:
                    report.status = "PASS"
                    report.status_extended = (
                        f"Project {project.name} has database auditing enabled."
                    )
                    if project.audit_config.audit_filter:
                        report.status_extended += f" Audit filter configured: {project.audit_config.audit_filter}"
                else:
                    report.status = "FAIL"
                    report.status_extended = f"Project {project.name} does not have database auditing enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: projects_network_access_list_exposed_to_internet.metadata.json]---
Location: prowler-master/prowler/providers/mongodbatlas/services/projects/projects_network_access_list_exposed_to_internet/projects_network_access_list_exposed_to_internet.metadata.json

```json
{
  "Provider": "mongodbatlas",
  "CheckID": "projects_network_access_list_exposed_to_internet",
  "CheckTitle": "MongoDB Atlas project network access list has entries and excludes 0.0.0.0/0, ::/0, 0.0.0.0, and ::",
  "CheckType": [],
  "ServiceName": "projects",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "MongoDBAtlasProject",
  "Description": "**MongoDB Atlas project network access list** configuration is evaluated for entries that allow access from anywhere (`0.0.0.0/0`, `::/0`, `0.0.0.0`, `::`) or for missing access lists, instead of restricting connections to specific IPs or CIDRs.",
  "Risk": "Internet-wide access enables scanning, brute force, and credential stuffing against database endpoints. A successful compromise can cause data exfiltration (**confidentiality**), unauthorized writes or drops (**integrity**), and service disruption or lockout (**availability**).",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.atlas.mongodb.com/security/ip-access-list/"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. In MongoDB Atlas, open your project and go to Security > Database & Network Access > IP Access List\n2. Delete any entries equal to 0.0.0.0/0, ::/0, 0.0.0.0, or ::\n3. If the list becomes empty, click Add IP Address and add a specific IP/CIDR or an AWS Security Group (for a peered VPC)\n4. Click Save",
      "Terraform": "```hcl\nresource \"mongodbatlas_project_ip_access_list\" \"<example_resource_name>\" {\n  project_id = \"<example_resource_id>\"\n  cidr_block = \"<ALLOWED_CIDR>\" # Critical: add a restricted CIDR (not 0.0.0.0/0 or ::/0) to ensure the list isn't empty and not open to the world\n}\n```"
    },
    "Recommendation": {
      "Text": "Apply **least privilege**: permit only required IPs/CIDRs or approved security groups; avoid `0.0.0.0/0` and `::/0`. Prefer **private connectivity** (VPC peering or private endpoints) over public access. Use temporary entries for short-lived admin needs and review lists regularly.",
      "Url": "https://hub.prowler.com/check/projects_network_access_list_exposed_to_internet"
    }
  },
  "Categories": [
    "internet-exposed"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: projects_network_access_list_exposed_to_internet.py]---
Location: prowler-master/prowler/providers/mongodbatlas/services/projects/projects_network_access_list_exposed_to_internet/projects_network_access_list_exposed_to_internet.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportMongoDBAtlas
from prowler.providers.mongodbatlas.services.projects.projects_client import (
    projects_client,
)


class projects_network_access_list_exposed_to_internet(Check):
    """Check if MongoDB Atlas project network access list is not open to the world

    This class verifies that MongoDB Atlas projects don't have network access
    entries that allow unrestricted access from the internet (0.0.0.0/0 or ::/0).
    """

    def execute(self) -> List[CheckReportMongoDBAtlas]:
        """Execute the MongoDB Atlas project network access list check

        Iterates over all projects and checks if their network access lists
        contain entries that allow unrestricted access from anywhere.

        Returns:
            List[CheckReportMongoDBAtlas]: A list of reports for each project
        """
        findings = []

        for project in projects_client.projects.values():
            report = CheckReportMongoDBAtlas(metadata=self.metadata(), resource=project)

            if not project.network_access_entries:
                report.status = "FAIL"
                report.status_extended = (
                    f"Project {project.name} has no network access list entries configured, "
                    f"which may allow unrestricted access."
                )
            else:
                open_entries = []

                for entry in project.network_access_entries:
                    if entry.cidr_block and entry.cidr_block in ["0.0.0.0/0", "::/0"]:
                        open_entries.append(f"CIDR: {entry.cidr_block}")

                    if entry.ip_address and entry.ip_address in ["0.0.0.0", "::"]:
                        open_entries.append(f"IP: {entry.ip_address}")

                if open_entries:
                    report.status = "FAIL"
                    report.status_extended = (
                        f"Project {project.name} has network access entries open to the world: "
                        f"{', '.join(open_entries)}. This allows unrestricted access from anywhere on the internet."
                    )
                else:
                    report.status = "PASS"
                    report.status_extended = (
                        f"Project {project.name} has properly configured network access list "
                        f"with {len(project.network_access_entries)} restricted entries."
                    )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: models.py]---
Location: prowler-master/prowler/providers/nhn/models.py
Signals: Pydantic

```python
from pydantic.v1 import BaseModel

from prowler.config.config import output_file_timestamp
from prowler.providers.common.models import ProviderOutputOptions


class NHNIdentityInfo(BaseModel):
    """
    NHNIdentityInfo holds basic identity fields for the NHN provider.

    Attributes:
        - identity_id (str): An optional identity ID if used by NHN services.
        - identity_type (str): The type or role of the identity, if needed.
        - tenant_domain (str): The tenant domain if applicable.
          (Some NHN services might require a domain or project domain.)
        - tenant_id (str): The tenant ID for the NHN Cloud account.
        - username (str): The username associated with the account.
    """

    identity_id: str = ""
    identity_type: str = ""
    tenant_domain: str = ""
    tenant_id: str
    username: str


class NHNOutputOptions(ProviderOutputOptions):
    """
    NHNOutputOptions overrides ProviderOutputOptions for NHN-specific output logic.
    For example, generating a filename that includes the NHN tenant_id.

    Attributes inherited from ProviderOutputOptions:
        - output_filename (str): The base filename used for generated reports.
        - output_directory (str): The directory to store the output files.
        - ... see ProviderOutputOptions for more details.

    Methods:
        - __init__: Customizes the output filename logic for NHN.
    """

    def __init__(self, arguments, bulk_checks_metadata, identity: NHNIdentityInfo):
        super().__init__(arguments, bulk_checks_metadata)

        # If --output-filename is not specified, build a default name.
        if not getattr(arguments, "output_filename", None):
            # If tenant_id exists, include it in the filename (e.g., prowler-output-nhn-<tenant_id>-20230101)
            if identity.tenant_id:
                self.output_filename = (
                    f"prowler-output-nhn-{identity.tenant_id}-{output_file_timestamp}"
                )
            # Otherwise just 'prowler-output-nhn-<timestamp>'
            else:
                self.output_filename = f"prowler-output-nhn-{output_file_timestamp}"
        # If --output-filename was explicitly given, respect that
        else:
            self.output_filename = arguments.output_filename
```

--------------------------------------------------------------------------------

---[FILE: nhn_provider.py]---
Location: prowler-master/prowler/providers/nhn/nhn_provider.py

```python
import os
from typing import Optional

import requests
from colorama import Style

from prowler.config.config import (
    default_config_file_path,
    get_default_mute_file_path,
    load_and_validate_config_file,
)
from prowler.lib.logger import logger
from prowler.lib.utils.utils import print_boxes
from prowler.providers.common.models import Audit_Metadata, Connection
from prowler.providers.common.provider import Provider
from prowler.providers.nhn.lib.mutelist.mutelist import NHNMutelist
from prowler.providers.nhn.models import NHNIdentityInfo


class NhnProvider(Provider):
    """
    NHN Provider class to handle the NHN provider

    Attributes:
    - _type: str -> The type of the provider, which is set to "nhn".
    - _session: requests.Session -> The session object associated with the NHN provider.
    - _identity: NHNIdentityInfo -> The identity information for the NHN provider.
    - _audit_config: dict -> The audit configuration for the NHN provider.
    - _mutelist: NHNMutelist -> The mutelist object associated with the NHN provider.
    - audit_metadata: Audit_Metadata -> The audit metadata for the NHN provider.

    Methods:
    - __init__: Initializes the NHN provider.
    - type: Returns the type of the NHN provider.
    - identity: Returns the identity of the NHN provider.(ex: tenant_id, username)
    - session: Returns the session object associated with the NHN provider.(ex: Bearer token)
    - audit_config: Returns the audit configuration for the NHN provider.
    - fixer_config: Returns the fixer configuration.
    - mutelist: Returns the mutelist object associated with the NHN provider.
    - validate_arguments: Validates the NHN provider arguments.(ex: username, password, tenant_id)
    - print_credentials: Prints the NHN credentials information.(ex: username, tenant_id)
    - setup_session: Set up the NHN session with the specified authentication method.
    - test_connection: tests the provider connection
    """

    _type: str = "nhn"
    _session: Optional[requests.Session]
    _identity: NHNIdentityInfo
    _audit_config: dict
    _mutelist: NHNMutelist
    # TODO: this is not optional, enforce for all providers
    audit_metadata: Audit_Metadata

    def __init__(
        self,
        username: str = None,
        password: str = None,
        tenant_id: str = None,
        config_path: str = None,
        fixer_config: dict = None,
        mutelist_path: str = None,
        mutelist_content: dict = None,
    ):
        """
        Initializes the NHN provider.

        Args:
            - username: The NHN Cloud client ID
            - password: The NHN Cloud client password
            - tenant_id: The NHN Cloud Tenant ID
            - config_path: The path to the configuration file.
            - fixer_config: The fixer configuration.
            - mutelist_path: The path to the mutelist file.
            - mutelist_content: The mutelist content.
        """
        logger.info("Initializing Nhn Provider...")

        # 1) Store argument values
        self._username = username or os.getenv("NHN_USERNAME")
        self._password = password or os.getenv("NHN_PASSWORD")
        self._tenant_id = tenant_id or os.getenv("NHN_TENANT_ID")

        if not all([self._username, self._password, self._tenant_id]):
            raise ValueError("NhnProvider requires username, password and tenant_id")

        # 2) Load audit_config, fixer_config, mutelist
        self._fixer_config = fixer_config if fixer_config else {}
        if not config_path:
            config_path = default_config_file_path
        self._audit_config = load_and_validate_config_file(self._type, config_path)

        if mutelist_content:
            self._mutelist = NHNMutelist(mutelist_content=mutelist_content)
        else:
            if not mutelist_path:
                mutelist_path = get_default_mute_file_path(self._type)
            self._mutelist = NHNMutelist(mutelist_path=mutelist_path)

        # 3) Initialize session/token
        self._token = None
        self._session = None
        self.setup_session()

        # 4) Create NHNIdentityInfo object
        self._identity = NHNIdentityInfo(
            tenant_id=self._tenant_id,
            username=self._username,
        )

        Provider.set_global_provider(self)

    @property
    def type(self) -> str:
        """
        Returns the type of the provider ("nhn").
        """
        return self._type

    @property
    def identity(self) -> str:
        """
        Returns the NHNIdentityInfo object, which may contain tenant_id, username, etc.
        """
        return self._identity

    @property
    def session(self) -> str:
        """
        Returns the requests.Session object for NHN API calls.
        """
        return self._session

    @property
    def audit_config(self) -> dict:
        """
        Returns the audit configuration loaded from file or default settings.
        """
        return self._audit_config

    @property
    def fixer_config(self) -> dict:
        """
        Returns any fixer configuration provided to the NHN provider.
        """
        return self._fixer_config

    @property
    def mutelist(self) -> dict:
        """
        Returns the NHNMutelist object for handling any muted checks.
        """
        return self._mutelist

    @staticmethod
    def validate_arguments(username: str, password: str, tenant_id: str) -> None:
        """
        Ensures that username, password, and tenant_id are not empty.
        """
        if not username or not password or not tenant_id:
            raise ValueError("NHN Provider requires username, password and tenant_id.")

    def print_credentials(self) -> None:
        """
        Prints the NHN credentials in a simple box format.
        """
        report_lines = [
            f"  Username: {self._username}",
            f"  TenantID: {self._tenant_id}",
        ]
        report_title = (
            f"{Style.BRIGHT}Using the NHN credentials below:{Style.RESET_ALL}"
        )
        print_boxes(report_lines, report_title)

    def setup_session(self) -> None:
        """
        Implement NHN Cloud Authentication method by calling Keystone v2.0 API(POST /v2.0/tokens).
        ex) https://api-identity-infrastructure.nhncloudservice.com/v2.0/tokens
        {
            "auth": {
                "tenantId": "f5073eaa26b64cffbee89411df94ce01",
                "passwordCredentials": {
                    "username": "user@example.com",
                    "password": "secretsecret"
                }
            }
        }

        On success, it creates a requests.Session and sets the X-Auth-Token header.
        """
        url = "https://api-identity-infrastructure.nhncloudservice.com/v2.0/tokens"
        data = {
            "auth": {
                "tenantId": self._tenant_id,
                "passwordCredentials": {
                    "username": self._username,
                    "password": self._password,
                },
            }
        }
        try:
            response = requests.post(url, json=data, timeout=10)
            if response.status_code == 200:
                resp_json = response.json()
                self._token = resp_json["access"]["token"]["id"]
                sess = requests.Session()
                sess.headers.update(
                    {"X-Auth-Token": self._token, "Content-Type": "application/json"}
                )
                self._session = sess
                logger.info("NHN token acquired successfully and session is set up.")
            else:
                logger.critical(
                    f"Failed to get token. Status: {response.status_code}, Body: {response.text}"
                )
                raise ValueError("Failed to get NHN token")
        except Exception as e:
            logger.critical(f"[setup_session] Error: {e}")
            raise e

    @staticmethod
    def test_connection(
        username: str,
        password: str,
        tenant_id: str,
        raise_on_exception: bool = True,
    ) -> Connection:
        """
        Test connection to NHN Cloud by performing:
          1) Keystone token request
          2) (Optional) a small test API call to confirm credentials are valid

        Args:
            username (str): NHN Cloud user ID (email)
            password (str): NHN Cloud user password
            tenant_id (str): NHN Cloud tenant ID
            raise_on_exception (bool): If True, raise the caught exception;
                                       if False, return Connection(error=exception).

        Returns:
            Connection:
                Connection(is_connected=True) if success,
                otherwise Connection(error=Exception or custom error).
        """
        try:
            # 1) Validate arguments (예: username/password/tenant_id)
            if not username or not password or not tenant_id:
                error_msg = (
                    "NHN test_connection error: missing username/password/tenant_id"
                )
                logger.error(error_msg)
                raise ValueError(error_msg)

            # 2) Request Keystone token
            token_url = (
                "https://api-identity-infrastructure.nhncloudservice.com/v2.0/tokens"
            )
            data = {
                "auth": {
                    "tenantId": tenant_id,
                    "passwordCredentials": {
                        "username": username,
                        "password": password,
                    },
                }
            }
            resp = requests.post(token_url, json=data, timeout=10)
            if resp.status_code != 200:
                # Fail
                error_msg = f"Failed to get token. Status: {resp.status_code}, Body: {resp.text}"
                logger.error(error_msg)
                if raise_on_exception:
                    raise Exception(error_msg)
                return Connection(error=Exception(error_msg))

            # Success
            token_json = resp.json()
            keystone_token = token_json["access"]["token"]["id"]
            logger.info("NHN test_connection: Successfully acquired Keystone token.")

            # 3) (Optional) Test API call to confirm credentials are valid
            compute_endpoint = f"https://kr1-api-instance.infrastructure.cloud.toast.com/v2/{tenant_id}"

            # Check servers list
            headers = {
                "X-Auth-Token": keystone_token,
                "Content-Type": "application/json",
            }
            servers_resp = requests.get(
                f"{compute_endpoint}/servers", headers=headers, timeout=10
            )
            if servers_resp.status_code == 200:
                logger.info(
                    "NHN test_connection: /servers call success. Credentials valid."
                )
                return Connection(is_connected=True)
            else:
                error_msg = f"/servers call failed. Status: {servers_resp.status_code}, Body: {servers_resp.text}"
                logger.error(error_msg)
                if raise_on_exception:
                    raise Exception(error_msg)
                return Connection(error=Exception(error_msg))

        except Exception as e:
            logger.critical(f"{e.__class__.__name__}[{e.__traceback__.tb_lineno}]: {e}")
            if raise_on_exception:
                raise e
            return Connection(error=e)
```

--------------------------------------------------------------------------------

---[FILE: arguments.py]---
Location: prowler-master/prowler/providers/nhn/lib/arguments/arguments.py

```python
def init_parser(self):
    """Init the NHN Provider CLI parser"""
    nhn_parser = self.subparsers.add_parser(
        "nhn", parents=[self.common_providers_parser], help="NHN Provider"
    )

    # Authentication
    nhn_auth_subparser = nhn_parser.add_argument_group("Authentication")
    nhn_auth_subparser.add_argument(
        "--nhn-username", nargs="?", default=None, help="NHN API Username"
    )
    nhn_auth_subparser.add_argument(
        "--nhn-password", nargs="?", default=None, help="NHN API Password"
    )
    nhn_auth_subparser.add_argument(
        "--nhn-tenant-id", nargs="?", default=None, help="NHN Tenant ID"
    )
```

--------------------------------------------------------------------------------

---[FILE: mutelist.py]---
Location: prowler-master/prowler/providers/nhn/lib/mutelist/mutelist.py

```python
from prowler.lib.check.models import CheckReportNHN
from prowler.lib.mutelist.mutelist import Mutelist
from prowler.lib.outputs.utils import unroll_dict, unroll_tags


class NHNMutelist(Mutelist):
    def is_finding_muted(self, finding: CheckReportNHN) -> bool:
        return self.is_muted(
            finding.resource_id,
            finding.check_metadata.CheckID,
            finding.location,
            finding.resource_name,
            unroll_dict(unroll_tags(finding.resource_tags)),
        )
```

--------------------------------------------------------------------------------

---[FILE: service.py]---
Location: prowler-master/prowler/providers/nhn/lib/service/service.py

```python
# TODO: If more services are added, we need to add common methods here
```

--------------------------------------------------------------------------------

---[FILE: compute_client.py]---
Location: prowler-master/prowler/providers/nhn/services/compute/compute_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.nhn.services.compute.compute_service import NHNComputeService

compute_client = NHNComputeService(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: compute_service.py]---
Location: prowler-master/prowler/providers/nhn/services/compute/compute_service.py
Signals: Pydantic

```python
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.nhn.nhn_provider import NhnProvider


class NHNComputeService:
    def __init__(self, provider: NhnProvider):
        self.session = provider.session
        self.tenant_id = provider._tenant_id
        self.endpoint = "https://kr1-api-instance.infrastructure.cloud.toast.com"

        self.instances: list[Instance] = []
        self._get_instances()

    def _list_servers(self) -> list:
        url = f"{self.endpoint}/v2/{self.tenant_id}/servers"
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            data = response.json()
            return data.get("servers", [])
        except Exception as e:
            logger.error(f"Error listing servers: {e}")
            return []

    def _get_server_detail(self, server_id: str) -> dict:
        url = f"{self.endpoint}/v2/{self.tenant_id}/servers/{server_id}"
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Error getting server detail {server_id}: {e}")
            return {}

    def _check_public_ip(self, server_info: dict) -> bool:
        addresses = server_info.get("addresses", {})
        for _, ip_list in addresses.items():
            for ip_info in ip_list:
                if ip_info.get("OS-EXT-IPS:type") == "floating":
                    return True
        return False

    def _check_security_groups(self, server_info: dict) -> bool:
        secruity_groups = server_info.get("security_groups", [])
        sg_names = []
        for sg_info in secruity_groups:
            name = sg_info.get("name", "")
            sg_names.append(name)

        for name in sg_names:
            if name != "default":
                return False
        return True

    def _check_login_user(self, server_info: dict) -> bool:
        metadata = server_info.get("metadata", {})
        login_user = metadata.get("login_username", "")
        if (
            login_user == "Administrator"
            or login_user == "root"
            or login_user == "admin"
        ):
            return True
        return False

    def _get_instances(self):
        server_list = self._list_servers()
        for server in server_list:
            server_id = server["id"]
            server_name = server["name"]
            detail = self._get_server_detail(server_id)
            server_info = detail.get("server", {})

            server_public_ip = self._check_public_ip(server_info)
            server_security_groups = self._check_security_groups(server_info)
            server_login_user = self._check_login_user(server_info)

            instance = Instance(
                id=server_id,
                name=server_name,
                public_ip=server_public_ip,
                security_groups=server_security_groups,
                login_user=server_login_user,
            )
            self.instances.append(instance)


class Instance(BaseModel):
    id: str
    name: str
    public_ip: bool
    security_groups: bool
    login_user: bool
```

--------------------------------------------------------------------------------

---[FILE: compute_instance_login_user.metadata.json]---
Location: prowler-master/prowler/providers/nhn/services/compute/compute_instance_login_user/compute_instance_login_user.metadata.json

```json
{
  "Provider": "nhn",
  "CheckID": "compute_instance_login_user",
  "CheckTitle": "Check for Administrative Login Users in NHN Compute Instances",
  "CheckType": [],
  "ServiceName": "compute",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "VMInstance",
  "Description": "Checks if NHN Compute instances have administrative login users.",
  "Risk": "",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Review the login users configured for each VM instance.",
      "Url": ""
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: compute_instance_login_user.py]---
Location: prowler-master/prowler/providers/nhn/services/compute/compute_instance_login_user/compute_instance_login_user.py

```python
from prowler.lib.check.models import Check, CheckReportNHN
from prowler.providers.nhn.services.compute.compute_client import compute_client


class compute_instance_login_user(Check):
    def execute(self):
        findings = []
        for instance in compute_client.instances:
            report = CheckReportNHN(
                metadata=self.metadata(),
                resource=instance,
            )
            report.status = "PASS"
            report.status_extended = (
                f"VM Instance {instance.name} has an appropriate login user."
            )
            if instance.login_user:
                report.status = "FAIL"
                report.status_extended = f"VM Instance {instance.name} has an Administrative(admin/root) login user."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: compute_instance_public_ip.metadata.json]---
Location: prowler-master/prowler/providers/nhn/services/compute/compute_instance_public_ip/compute_instance_public_ip.metadata.json

```json
{
  "Provider": "nhn",
  "CheckID": "compute_instance_public_ip",
  "CheckTitle": "Check for Public IP in NHN Compute Instances",
  "CheckType": [],
  "ServiceName": "compute",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "VMInstance",
  "Description": "Check if a floating(public) IP is assigned to an NHN compute instance.",
  "Risk": "",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Remove or unassign floating IP if not required to reduce external exposure.",
      "Url": ""
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: compute_instance_public_ip.py]---
Location: prowler-master/prowler/providers/nhn/services/compute/compute_instance_public_ip/compute_instance_public_ip.py

```python
from prowler.lib.check.models import Check, CheckReportNHN
from prowler.providers.nhn.services.compute.compute_client import compute_client


class compute_instance_public_ip(Check):
    def execute(self):
        findings = []
        for instance in compute_client.instances:
            report = CheckReportNHN(
                metadata=self.metadata(),
                resource=instance,
            )
            report.status = "PASS"
            report.status_extended = (
                f"VM Instance {instance.name} does not have a public IP."
            )
            if instance.public_ip:
                report.status = "FAIL"
                report.status_extended = f"VM Instance {instance.name} has a public IP."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: compute_instance_security_groups.metadata.json]---
Location: prowler-master/prowler/providers/nhn/services/compute/compute_instance_security_groups/compute_instance_security_groups.metadata.json

```json
{
  "Provider": "nhn",
  "CheckID": "compute_instance_security_groups",
  "CheckTitle": "Check NHN Compute Security Group Configuration",
  "CheckType": [],
  "ServiceName": "compute",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "VMInstance",
  "Description": "Checks if NHN Compute VM instances are using appropriate security group configurations. Using only the default security group can pose a security risk.",
  "Risk": "",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Review and modify security group rules for each VM instance.",
      "Url": ""
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: compute_instance_security_groups.py]---
Location: prowler-master/prowler/providers/nhn/services/compute/compute_instance_security_groups/compute_instance_security_groups.py

```python
from prowler.lib.check.models import Check, CheckReportNHN
from prowler.providers.nhn.services.compute.compute_client import compute_client


class compute_instance_security_groups(Check):
    def execute(self):
        findings = []
        for instance in compute_client.instances:
            report = CheckReportNHN(
                metadata=self.metadata(),
                resource=instance,
            )
            report.status = "PASS"
            report.status_extended = (
                f"VM Instance {instance.name} has a variety of security groups."
            )
            if instance.security_groups:
                report.status = "FAIL"
                report.status_extended = (
                    f"VM Instance {instance.name} has only the default security group."
                )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: network_client.py]---
Location: prowler-master/prowler/providers/nhn/services/network/network_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.nhn.services.network.network_service import NHNNetworkService

network_client = NHNNetworkService(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: network_service.py]---
Location: prowler-master/prowler/providers/nhn/services/network/network_service.py
Signals: Pydantic

```python
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.nhn.nhn_provider import NhnProvider


class Subnet(BaseModel):
    name: str
    external_router: bool
    enable_dhcp: bool


class Network(BaseModel):
    id: str
    name: str
    empty_routingtables: bool
    subnets: list[Subnet]


class NHNNetworkService:
    def __init__(self, provider: NhnProvider):
        self.session = provider.session
        self.tenant_id = provider._tenant_id
        self.endpoint = "https://kr1-api-network-infrastructure.nhncloudservice.com"
        self.networks: list[Network] = []
        self._get_networks()

    def _list_vpcs(self) -> list:
        url = f"{self.endpoint}/v2.0/vpcs"
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            data = response.json()
            return data.get("vpcs", [])
        except Exception as e:
            logger.error(f"Error listing vpcs: {e}")
            return []

    def _get_vpc_detail(self, vpc_id: str) -> dict:
        url = f"{self.endpoint}/v2.0/vpcs/{vpc_id}"
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Error getting vpc detail {vpc_id}: {e}")
            return {}

    def _check_has_empty_routingtables(self, vpc_info: dict) -> bool:
        routingtables = vpc_info.get("routingtables", [])
        return not routingtables

    def _check_subnet_has_external_router(self, subnet: dict) -> bool:
        return subnet.get("router:external", True)

    def _check_subnet_enable_dhcp(self, subnet: dict) -> bool:
        return subnet.get("enable_dhcp", True)

    def _get_networks(self):
        vpc_list = self._list_vpcs()
        for vpc in vpc_list:
            vpc_id = vpc["id"]
            vpc_name = vpc["name"]
            detail = self._get_vpc_detail(vpc_id)
            vpc_info = detail.get("vpc", {})
            vpc_empty_routingtables = self._check_has_empty_routingtables(vpc_info)

            network = Network(
                id=vpc_id,
                name=vpc_name,
                empty_routingtables=vpc_empty_routingtables,
                subnets=[],
            )
            self._get_subnets(vpc_info, network)
            self.networks.append(network)

    def _get_subnets(self, vpc_info: dict, network: Network):
        subnet_list = vpc_info.get("subnets", [])
        # ret_subnet_list = []
        for subnet in subnet_list:
            subnet_name = subnet["name"]
            subnet_external_router = self._check_subnet_has_external_router(subnet)
            subnet_enable_dhcp = self._check_subnet_enable_dhcp(subnet)
            subnet_instance = Subnet(
                name=subnet_name,
                external_router=subnet_external_router,
                enable_dhcp=subnet_enable_dhcp,
            )
            network.subnets.append(subnet_instance)
```

--------------------------------------------------------------------------------

---[FILE: network_vpc_has_empty_routingtables.metadata.json]---
Location: prowler-master/prowler/providers/nhn/services/network/network_vpc_has_empty_routingtables/network_vpc_has_empty_routingtables.metadata.json

```json
{
  "Provider": "nhn",
  "CheckID": "network_vpc_has_empty_routingtables",
  "CheckTitle": "Check if VPC has empty routing tables",
  "CheckType": [],
  "ServiceName": "network",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "VPC",
  "Description": "Check if VPC has empty routing tables. Having empty routing tables may indicate misconfiguration or incomplete network setup.",
  "Risk": "",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure that VPC has properly configured routing tables with necessary routes to ensure proper network connectivity. If not needed, delete the empty routing tables.",
      "Url": ""
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: network_vpc_has_empty_routingtables.py]---
Location: prowler-master/prowler/providers/nhn/services/network/network_vpc_has_empty_routingtables/network_vpc_has_empty_routingtables.py

```python
from prowler.lib.check.models import Check, CheckReportNHN
from prowler.providers.nhn.services.network.network_client import network_client


class network_vpc_has_empty_routingtables(Check):
    def execute(self):
        findings = []
        for network in network_client.networks:
            report = CheckReportNHN(
                metadata=self.metadata(),
                resource=network,
            )
            report.status = "PASS"
            report.status_extended = (
                f"VPC {network.name} does not have empty routingtables."
            )
            if network.empty_routingtables:
                report.status = "FAIL"
                report.status_extended = f"VPC {network.name} has empty routingtables."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
