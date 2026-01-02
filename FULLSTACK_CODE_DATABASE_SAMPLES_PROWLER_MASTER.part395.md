---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 395
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 395 of 867)

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

---[FILE: clusters_encryption_at_rest_enabled.metadata.json]---
Location: prowler-master/prowler/providers/mongodbatlas/services/clusters/clusters_encryption_at_rest_enabled/clusters_encryption_at_rest_enabled.metadata.json

```json
{
  "Provider": "mongodbatlas",
  "CheckID": "clusters_encryption_at_rest_enabled",
  "CheckTitle": "Ensure MongoDB Atlas clusters have encryption at rest enabled",
  "CheckType": [],
  "ServiceName": "clusters",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "MongoDBAtlasCluster",
  "Description": "Ensure that MongoDB Atlas clusters have encryption at rest enabled to protect data stored on disk. Encryption at rest provides an additional layer of security by encrypting data before it's written to storage, protecting against unauthorized access to the underlying storage media.",
  "Risk": "If encryption at rest is not enabled on MongoDB Atlas clusters, sensitive data stored in the database is vulnerable to unauthorized access if the underlying storage is compromised. This could lead to data breaches, compliance violations, and exposure of sensitive information.",
  "RelatedUrl": "https://www.mongodb.com/docs/atlas/security-kms-encryption/",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable encryption at rest for your MongoDB Atlas clusters. This can be configured when creating a new cluster or by modifying an existing cluster's settings. Choose an appropriate encryption provider (AWS KMS, Azure Key Vault, or Google Cloud KMS) based on your cloud provider and security requirements.",
      "Url": "https://www.mongodb.com/docs/atlas/security-kms-encryption/"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: clusters_encryption_at_rest_enabled.py]---
Location: prowler-master/prowler/providers/mongodbatlas/services/clusters/clusters_encryption_at_rest_enabled/clusters_encryption_at_rest_enabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportMongoDBAtlas
from prowler.providers.mongodbatlas.config import ATLAS_ENCRYPTION_PROVIDERS
from prowler.providers.mongodbatlas.services.clusters.clusters_client import (
    clusters_client,
)


class clusters_encryption_at_rest_enabled(Check):
    """Check if MongoDB Atlas clusters have encryption at rest enabled

    This class verifies that MongoDB Atlas clusters have encryption at rest
    enabled to protect data stored on disk.
    """

    def execute(self) -> List[CheckReportMongoDBAtlas]:
        """Execute the MongoDB Atlas cluster encryption at rest check

        Iterates over all clusters and checks if they have encryption at rest
        enabled with a supported encryption provider.

        Returns:
            List[CheckReportMongoDBAtlas]: A list of reports for each cluster
        """
        findings = []

        for cluster in clusters_client.clusters.values():
            report = CheckReportMongoDBAtlas(metadata=self.metadata(), resource=cluster)

            if cluster.encryption_at_rest_provider:
                if cluster.encryption_at_rest_provider in ATLAS_ENCRYPTION_PROVIDERS:
                    if cluster.encryption_at_rest_provider == "NONE":
                        report.status = "FAIL"
                        report.status_extended = (
                            f"Cluster {cluster.name} in project {cluster.project_name} "
                            f"has encryption at rest explicitly disabled."
                        )
                    else:
                        report.status = "PASS"
                        report.status_extended = (
                            f"Cluster {cluster.name} in project {cluster.project_name} "
                            f"has encryption at rest enabled with provider: {cluster.encryption_at_rest_provider}."
                        )
                else:
                    report.status = "FAIL"
                    report.status_extended = (
                        f"Cluster {cluster.name} in project {cluster.project_name} "
                        f"has an unsupported encryption provider: {cluster.encryption_at_rest_provider}."
                    )
            else:
                # Check provider settings for EBS encryption (AWS specific)
                provider_settings = cluster.provider_settings or {}
                encrypt_ebs_volume = provider_settings.get("encryptEBSVolume", False)

                if encrypt_ebs_volume:
                    report.status = "PASS"
                    report.status_extended = (
                        f"Cluster {cluster.name} in project {cluster.project_name} "
                        f"has EBS volume encryption enabled."
                    )
                else:
                    report.status = "FAIL"
                    report.status_extended = (
                        f"Cluster {cluster.name} in project {cluster.project_name} "
                        f"does not have encryption at rest enabled."
                    )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: clusters_tls_enabled.metadata.json]---
Location: prowler-master/prowler/providers/mongodbatlas/services/clusters/clusters_tls_enabled/clusters_tls_enabled.metadata.json

```json
{
  "Provider": "mongodbatlas",
  "CheckID": "clusters_tls_enabled",
  "CheckTitle": "Ensure MongoDB Atlas clusters have TLS authentication required",
  "CheckType": [],
  "ServiceName": "clusters",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "MongoDBAtlasCluster",
  "Description": "Ensure MongoDB Atlas clusters have TLS authentication required to secure data in transit",
  "Risk": "Without TLS enabled, MongoDB Atlas clusters are vulnerable to man-in-the-middle attacks and data interception during transmission",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable TLS for MongoDB Atlas clusters by setting sslEnabled to true in the cluster configuration.",
      "Url": "https://www.mongodb.com/docs/atlas/setup-cluster-security/#encryption-in-transit"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: clusters_tls_enabled.py]---
Location: prowler-master/prowler/providers/mongodbatlas/services/clusters/clusters_tls_enabled/clusters_tls_enabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportMongoDBAtlas
from prowler.providers.mongodbatlas.services.clusters.clusters_client import (
    clusters_client,
)


class clusters_tls_enabled(Check):
    """Check if MongoDB Atlas clusters have TLS authentication required

    This class verifies that MongoDB Atlas clusters have TLS authentication
    required to secure data in transit.
    """

    def execute(self) -> List[CheckReportMongoDBAtlas]:
        """Execute the MongoDB Atlas cluster TLS enabled check

        Iterates over all clusters and checks if they have TLS
        enabled (sslEnabled=true).

        Returns:
            List[CheckReportMongoDBAtlas]: A list of reports for each cluster
        """
        findings = []

        for cluster in clusters_client.clusters.values():
            report = CheckReportMongoDBAtlas(metadata=self.metadata(), resource=cluster)

            if cluster.ssl_enabled:
                report.status = "PASS"
                report.status_extended = (
                    f"Cluster {cluster.name} in project {cluster.project_name} "
                    f"has TLS authentication enabled."
                )
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"Cluster {cluster.name} in project {cluster.project_name} "
                    f"does not have TLS authentication enabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: organizations_client.py]---
Location: prowler-master/prowler/providers/mongodbatlas/services/organizations/organizations_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.mongodbatlas.services.organizations.organizations_service import (
    Organizations,
)

organizations_client = Organizations(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: organizations_service.py]---
Location: prowler-master/prowler/providers/mongodbatlas/services/organizations/organizations_service.py
Signals: Pydantic

```python
from typing import List, Optional

from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.mongodbatlas.lib.service.service import MongoDBAtlasService
from prowler.providers.mongodbatlas.mongodbatlas_provider import MongodbatlasProvider


class Organizations(MongoDBAtlasService):
    """MongoDB Atlas Organizations service"""

    def __init__(self, provider: MongodbatlasProvider):
        super().__init__(__class__.__name__, provider)
        self.organizations = self._list_organizations()

    def _list_organizations(self):
        """
        List MongoDB Atlas organization for the authenticated API key

        Returns:
            Dict[str, Organization]: Dictionary containing the organization indexed by organization ID
        """
        logger.info("Organizations - Listing MongoDB Atlas organization...")
        organizations = {}

        try:
            # Get the organization associated with the API key
            all_orgs = self._paginate_request("/orgs")

            for org_data in all_orgs:
                org_id = org_data["id"]

                # Get organization settings
                org_settings = {}
                try:
                    org_settings = self._make_request("GET", f"/orgs/{org_id}/settings")
                except Exception as error:
                    logger.error(
                        f"Error getting organization settings for organization {org_id}: {error}"
                    )

                # Create organization object
                organization = Organization(
                    id=org_id,
                    name=org_data.get("name", ""),
                    settings=(
                        OrganizationSettings(
                            api_access_list_required=org_settings.get(
                                "apiAccessListRequired", False
                            ),
                            ip_access_list_enabled=org_settings.get(
                                "ipAccessListEnabled", False
                            ),
                            ip_access_list=org_settings.get("ipAccessList", []),
                            multi_factor_auth_required=org_settings.get(
                                "multiFactorAuthRequired", False
                            ),
                            security_contact=org_settings.get("securityContact"),
                            max_service_account_secret_validity_in_hours=org_settings.get(
                                "maxServiceAccountSecretValidityInHours"
                            ),
                        )
                        if org_settings
                        else None
                    ),
                )

                organizations[org_id] = organization

        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

        logger.info(f"Found {len(organizations)} MongoDB Atlas organizations")
        return organizations


class OrganizationSettings(BaseModel):
    """MongoDB Atlas Organization Settings model"""

    api_access_list_required: bool = False
    ip_access_list_enabled: bool = False
    ip_access_list: Optional[List[str]] = []
    multi_factor_auth_required: bool = False
    security_contact: Optional[str] = None
    max_service_account_secret_validity_in_hours: Optional[int] = None


class Organization(BaseModel):
    """MongoDB Atlas Organization model"""

    id: str
    name: str
    settings: Optional[OrganizationSettings] = None
    location: str = "global"
```

--------------------------------------------------------------------------------

---[FILE: organizations_api_access_list_required.metadata.json]---
Location: prowler-master/prowler/providers/mongodbatlas/services/organizations/organizations_api_access_list_required/organizations_api_access_list_required.metadata.json

```json
{
  "Provider": "mongodbatlas",
  "CheckID": "organizations_api_access_list_required",
  "CheckTitle": "Ensure organization requires API access list",
  "CheckType": [],
  "ServiceName": "organizations",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "MongoDBAtlasOrganization",
  "Description": "Ensure organization requires API operations to originate from an IP Address added to the API access list",
  "Risk": "Without API access list requirement, API operations can originate from any IP address, increasing the risk of unauthorized access",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable API access list requirement for the organization by setting apiAccessListRequired to true in the organization settings.",
      "Url": "https://www.mongodb.com/docs/atlas/security/ip-access-list/"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "If you are running this check from Prowler Cloud, you will need to add our IP to the API access list of your API Key and then enable apiAccessListRequired to make this check pass."
}
```

--------------------------------------------------------------------------------

---[FILE: organizations_api_access_list_required.py]---
Location: prowler-master/prowler/providers/mongodbatlas/services/organizations/organizations_api_access_list_required/organizations_api_access_list_required.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportMongoDBAtlas
from prowler.providers.mongodbatlas.services.organizations.organizations_client import (
    organizations_client,
)


class organizations_api_access_list_required(Check):
    """Check if organization requires API access list

    This class verifies that MongoDB Atlas organizations require API operations
    to originate from an IP Address added to the API access list.
    """

    def execute(self) -> List[CheckReportMongoDBAtlas]:
        """Execute the MongoDB Atlas organization API access list required check

        Iterates over all organizations and checks if they require API operations
        to originate from an IP Address added to the API access list.

        Returns:
            List[CheckReportMongoDBAtlas]: A list of reports for each organization
        """
        findings = []

        for organization in organizations_client.organizations.values():
            report = CheckReportMongoDBAtlas(
                metadata=self.metadata(), resource=organization
            )

            if organization.settings.api_access_list_required:
                report.status = "PASS"
                report.status_extended = (
                    f"Organization {organization.name} requires API operations "
                    f"to originate from an IP Address added to the API access list."
                )
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"Organization {organization.name} does not require API operations "
                    f"to originate from an IP Address added to the API access list."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: organizations_mfa_required.metadata.json]---
Location: prowler-master/prowler/providers/mongodbatlas/services/organizations/organizations_mfa_required/organizations_mfa_required.metadata.json

```json
{
  "Provider": "mongodbatlas",
  "CheckID": "organizations_mfa_required",
  "CheckTitle": "Ensure organization requires MFA",
  "CheckType": [],
  "ServiceName": "organizations",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "MongoDBAtlasOrganization",
  "Description": "Ensure organization requires users to set up Multi-Factor Authentication (MFA) before accessing the organization",
  "Risk": "Without MFA requirement, user accounts are vulnerable to credential-based attacks and unauthorized access",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.mongodb.com/docs/atlas/security-multi-factor-authentication/",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable MFA requirement for the organization by setting multiFactorAuthRequired to true in the organization settings.",
      "Url": "https://www.mongodb.com/docs/atlas/security-multi-factor-authentication/"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: organizations_mfa_required.py]---
Location: prowler-master/prowler/providers/mongodbatlas/services/organizations/organizations_mfa_required/organizations_mfa_required.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportMongoDBAtlas
from prowler.providers.mongodbatlas.services.organizations.organizations_client import (
    organizations_client,
)


class organizations_mfa_required(Check):
    """Check if organization requires MFA

    This class verifies that MongoDB Atlas organizations require users
    to set up Multi-Factor Authentication (MFA) before accessing the organization.
    """

    def execute(self) -> List[CheckReportMongoDBAtlas]:
        """Execute the MongoDB Atlas organization MFA required check

        Iterates over all organizations and checks if they require users
        to set up Multi-Factor Authentication (MFA) before accessing the organization.

        Returns:
            List[CheckReportMongoDBAtlas]: A list of reports for each organization
        """
        findings = []

        for organization in organizations_client.organizations.values():
            report = CheckReportMongoDBAtlas(
                metadata=self.metadata(), resource=organization
            )

            if organization.settings.multi_factor_auth_required:
                report.status = "PASS"
                report.status_extended = (
                    f"Organization {organization.name} requires users to set up "
                    f"Multi-Factor Authentication (MFA) before accessing the organization."
                )
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"Organization {organization.name} does not require users to set up "
                    f"Multi-Factor Authentication (MFA) before accessing the organization."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: organizations_security_contact_defined.metadata.json]---
Location: prowler-master/prowler/providers/mongodbatlas/services/organizations/organizations_security_contact_defined/organizations_security_contact_defined.metadata.json

```json
{
  "Provider": "mongodbatlas",
  "CheckID": "organizations_security_contact_defined",
  "CheckTitle": "Ensure organization has a Security Contact defined",
  "CheckType": [],
  "ServiceName": "organizations",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "MongoDBAtlasOrganization",
  "Description": "Ensure organization has a security contact defined to receive security-related notifications",
  "Risk": "Without a security contact, the organization may not receive important security notifications and alerts",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Set a security contact email address in the organization settings to receive security-related notifications.",
      "Url": "https://www.mongodb.com/docs/atlas/tutorial/manage-organization-settings/#add-security-contact-information"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: organizations_security_contact_defined.py]---
Location: prowler-master/prowler/providers/mongodbatlas/services/organizations/organizations_security_contact_defined/organizations_security_contact_defined.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportMongoDBAtlas
from prowler.providers.mongodbatlas.services.organizations.organizations_client import (
    organizations_client,
)


class organizations_security_contact_defined(Check):
    """Check if organization has a Security Contact defined

    This class verifies that MongoDB Atlas organizations have a security contact
    defined to receive security-related notifications.
    """

    def execute(self) -> List[CheckReportMongoDBAtlas]:
        """Execute the MongoDB Atlas organization security contact defined check

        Iterates over all organizations and checks if they have a security contact
        defined to receive security-related notifications.

        Returns:
            List[CheckReportMongoDBAtlas]: A list of reports for each organization
        """
        findings = []

        for organization in organizations_client.organizations.values():
            report = CheckReportMongoDBAtlas(
                metadata=self.metadata(), resource=organization
            )

            if organization.settings.security_contact:
                report.status = "PASS"
                report.status_extended = (
                    f"Organization {organization.name} has a security contact defined: "
                    f"{organization.settings.security_contact}"
                )
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"Organization {organization.name} does not have a security contact "
                    f"defined to receive security-related notifications."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: organizations_service_account_secrets_expiration.metadata.json]---
Location: prowler-master/prowler/providers/mongodbatlas/services/organizations/organizations_service_account_secrets_expiration/organizations_service_account_secrets_expiration.metadata.json

```json
{
  "Provider": "mongodbatlas",
  "CheckID": "organizations_service_account_secrets_expiration",
  "CheckTitle": "Ensure organization has maximum period expiration for Admin API Service Account Secrets",
  "CheckType": [],
  "ServiceName": "organizations",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "MongoDBAtlasOrganization",
  "Description": "Ensure organization has a maximum period before expiry for new Atlas Admin API Service Account secrets",
  "Risk": "Without proper expiration limits, service account secrets may remain valid for extended periods, increasing security risks",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Set maxServiceAccountSecretValidityInHours to 8 hours or less in the organization settings to ensure service account secrets expire regularly.",
      "Url": "https://www.mongodb.com/docs/api/doc/atlas-admin-api-v2/2025-03-12/operation/operation-getorganizationsettings#operation-getorganizationsettings-200-body-application-vnd-atlas-2023-01-01-json-maxserviceaccountsecretvalidityinhours"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: organizations_service_account_secrets_expiration.py]---
Location: prowler-master/prowler/providers/mongodbatlas/services/organizations/organizations_service_account_secrets_expiration/organizations_service_account_secrets_expiration.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportMongoDBAtlas
from prowler.providers.mongodbatlas.services.organizations.organizations_client import (
    organizations_client,
)


class organizations_service_account_secrets_expiration(Check):
    """Check if organization has maximum period expiration for Admin API Service Account Secrets

    This class verifies that MongoDB Atlas organizations have a maximum period
    before expiry for new Atlas Admin API Service Account secrets.
    """

    def execute(self) -> List[CheckReportMongoDBAtlas]:
        """Execute the MongoDB Atlas organization service account secrets expiration check

        Iterates over all organizations and checks if they have a maximum period
        expiration for Admin API Service Account secrets set to 8 hours or less.

        Returns:
            List[CheckReportMongoDBAtlas]: A list of reports for each organization
        """
        findings = []

        # Get configurable threshold from audit config, default to 8 hours
        max_hours_threshold = organizations_client.audit_config.get(
            "max_service_account_secret_validity_hours", 8
        )

        for organization in organizations_client.organizations.values():
            report = CheckReportMongoDBAtlas(
                metadata=self.metadata(), resource=organization
            )

            if (
                organization.settings.max_service_account_secret_validity_in_hours
                is None
            ):
                report.status = "FAIL"
                report.status_extended = (
                    f"Organization {organization.name} does not have a maximum period "
                    f"expiration configured for Admin API Service Account secrets."
                )
            elif (
                organization.settings.max_service_account_secret_validity_in_hours
                <= max_hours_threshold
            ):
                report.status = "PASS"
                report.status_extended = (
                    f"Organization {organization.name} has a maximum period expiration "
                    f"of {organization.settings.max_service_account_secret_validity_in_hours} hours for Admin API Service Account secrets, "
                    f"which is within the recommended threshold of {max_hours_threshold} hours."
                )
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"Organization {organization.name} has a maximum period expiration "
                    f"of {organization.settings.max_service_account_secret_validity_in_hours} hours for Admin API Service Account secrets, "
                    f"which exceeds the recommended threshold of {max_hours_threshold} hours."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: projects_client.py]---
Location: prowler-master/prowler/providers/mongodbatlas/services/projects/projects_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.mongodbatlas.services.projects.projects_service import Projects

projects_client = Projects(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: projects_service.py]---
Location: prowler-master/prowler/providers/mongodbatlas/services/projects/projects_service.py
Signals: Pydantic

```python
from typing import List, Optional

from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.mongodbatlas.lib.service.service import MongoDBAtlasService
from prowler.providers.mongodbatlas.mongodbatlas_provider import MongodbatlasProvider


class Projects(MongoDBAtlasService):
    """MongoDB Atlas Projects service"""

    def __init__(self, provider: MongodbatlasProvider):
        super().__init__(__class__.__name__, provider)
        self.projects = self._list_projects()

    def _list_projects(self):
        """
        List all MongoDB Atlas projects

        Returns:
            Dict[str, Project]: Dictionary of projects indexed by project ID
        """
        logger.info("Projects - Listing MongoDB Atlas projects...")
        projects = {}

        try:
            # If project_id filter is set, only get that project
            if self.provider.project_id:
                project_data = self._make_request(
                    "GET", f"/groups/{self.provider.project_id}"
                )
                project_id = project_data["id"]

                # Get cluster count
                cluster_count = self._get_cluster_count(project_id)

                # Get network access entries
                network_access_entries = self._get_network_access_entries(project_id)

                # Get project settings
                project_settings = self._get_project_settings(project_id)

                # Get audit configuration
                audit_config = self._get_audit_config(project_id)

                projects[project_id] = Project(
                    id=project_id,
                    name=project_data.get("name", ""),
                    org_id=project_data.get("orgId", ""),
                    created=project_data.get("created", ""),
                    cluster_count=cluster_count,
                    network_access_entries=network_access_entries,
                    project_settings=project_settings,
                    audit_config=audit_config,
                )
            else:
                # Get all projects with pagination
                all_projects = self._paginate_request("/groups")

                for project_data in all_projects:
                    project_id = project_data["id"]

                    # Get cluster count
                    cluster_count = self._get_cluster_count(project_id)

                    # Get network access entries
                    network_access_entries = self._get_network_access_entries(
                        project_id
                    )

                    # Get project settings
                    project_settings = self._get_project_settings(project_id)

                    # Get audit configuration
                    audit_config = self._get_audit_config(project_id)

                    projects[project_id] = Project(
                        id=project_id,
                        name=project_data.get("name", ""),
                        org_id=project_data.get("orgId", ""),
                        created=project_data.get("created", ""),
                        cluster_count=cluster_count,
                        network_access_entries=network_access_entries,
                        project_settings=project_settings,
                        audit_config=audit_config,
                    )

        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

        logger.info(f"Found {len(projects)} MongoDB Atlas projects")
        return projects

    def _get_cluster_count(self, project_id: str) -> int:
        """
        Get cluster count for a project

        Args:
            project_id: Project ID

        Returns:
            int: Number of clusters in the project
        """
        try:
            clusters = self._paginate_request(f"/groups/{project_id}/clusters")
            return len(clusters)
        except Exception as error:
            logger.error(
                f"Error getting cluster count for project {project_id}: {error}"
            )
            return 0

    def _get_network_access_entries(self, project_id: str):
        """
        Get network access entries for a project

        Args:
            project_id: Project ID

        Returns:
            List[MongoDBAtlasNetworkAccessEntry]: List of network access entries
        """
        try:
            entries = self._paginate_request(f"/groups/{project_id}/accessList")
            network_entries = []
            if entries:
                for entry in entries:
                    network_entry = MongoDBAtlasNetworkAccessEntry(
                        cidr_block=entry.get("cidrBlock"),
                        ip_address=entry.get("ipAddress"),
                        aws_security_group=entry.get("awsSecurityGroup"),
                        comment=entry.get("comment"),
                        delete_after_date=entry.get("deleteAfterDate"),
                    )
                    network_entries.append(network_entry)

            return network_entries

        except Exception as error:
            logger.error(
                f"Error getting network access entries for project {project_id}: {error}"
            )
            return []

    def _get_project_settings(self, project_id: str):
        """Get project settings"""
        try:
            settings = self._make_request("GET", f"/groups/{project_id}/settings")
            project_settings = (
                ProjectSettings(
                    collect_specific_statistics=settings.get(
                        "isCollectDatabaseSpecificsStatisticsEnabled", False
                    ),
                    data_explorer=settings.get("isDataExplorerEnabled", False),
                    data_explorer_gen_ai_features=settings.get(
                        "isDataExplorerGenAIFeaturesEnabled", False
                    ),
                    data_explorer_gen_ai_sample_documents=settings.get(
                        "isDataExplorerGenAISampleDocumentPassingEnabled", False
                    ),
                    extended_storage_sizes=settings.get(
                        "isExtendedStorageSizesEnabled", False
                    ),
                    performance_advisories=settings.get(
                        "isPerformanceAdvisoriesEnabled", False
                    ),
                    real_time_performance_panel=settings.get(
                        "isRealTimePerformancePanelEnabled", False
                    ),
                    schema_advisor=settings.get("isSchemaAdvisorEnabled", False),
                )
                if settings
                else None
            )
            return project_settings
        except Exception as error:
            logger.error(
                f"Error getting project settings for project {project_id}: {error}"
            )
            return None

    def _get_audit_config(self, project_id: str):
        """Get audit configuration for a project"""
        try:
            audit_config = self._make_request("GET", f"/groups/{project_id}/auditLog")
            return (
                AuditConfig(
                    enabled=audit_config.get("enabled", False),
                    audit_filter=audit_config.get("auditFilter", None),
                )
                if audit_config
                else None
            )
        except Exception as error:
            logger.error(
                f"Error getting audit configuration for project {project_id}: {error}"
            )
            return None


class MongoDBAtlasNetworkAccessEntry(BaseModel):
    """MongoDB Atlas network access entry model"""

    cidr_block: Optional[str] = None
    ip_address: Optional[str] = None
    aws_security_group: Optional[str] = None
    comment: Optional[str] = None
    delete_after_date: Optional[str] = None


class ProjectSettings(BaseModel):
    """MongoDB Atlas Project Settings model"""

    collect_specific_statistics: bool
    data_explorer: bool
    data_explorer_gen_ai_features: bool
    data_explorer_gen_ai_sample_documents: bool
    extended_storage_sizes: bool
    performance_advisories: bool
    real_time_performance_panel: bool
    schema_advisor: bool


class AuditConfig(BaseModel):
    """MongoDB Atlas Audit Configuration model"""

    enabled: bool = False
    audit_filter: Optional[str] = None


class Project(BaseModel):
    """MongoDB Atlas Project model"""

    id: str
    name: str
    org_id: str
    created: str
    cluster_count: int
    network_access_entries: List[MongoDBAtlasNetworkAccessEntry] = []
    project_settings: Optional[ProjectSettings] = None
    audit_config: Optional[AuditConfig] = None
    location: str = "global"
```

--------------------------------------------------------------------------------

---[FILE: projects_auditing_enabled.metadata.json]---
Location: prowler-master/prowler/providers/mongodbatlas/services/projects/projects_auditing_enabled/projects_auditing_enabled.metadata.json

```json
{
  "Provider": "mongodbatlas",
  "CheckID": "projects_auditing_enabled",
  "CheckTitle": "MongoDB Atlas project has database auditing enabled",
  "CheckType": [],
  "ServiceName": "projects",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "MongoDBAtlasProject",
  "Description": "**MongoDB Atlas projects** with **database auditing** capture database operations and administrative events. The evaluation looks for an active audit configuration and, *when present*, notes any configured `audit_filter` that scopes which events are recorded.",
  "Risk": "Without auditing, critical actions lack traceability, reducing **detectability** and impeding **forensics**. Attackers can mask unauthorized reads/writes and privilege changes, threatening data **confidentiality** and **integrity**, and weakening non-repudiation and incident response.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.mongodb.com/docs/manual/tutorial/configure-auditing/",
    "https://www.mongodb.com/docs/atlas/architecture/current/auditing/",
    "https://www.mongodb.com/docs/atlas/architecture/current/auditing-logging/?msockid=0878cc3dfa4e66a707beda0efb5a67b5",
    "https://www.mongodb.com/docs/atlas/operator/current/ak8so-configure-audit-logs/",
    "https://www.mongodb.com/docs/manual/core/auditing/",
    "https://www.mongodb.com/docs/atlas/database-auditing/"
  ],
  "Remediation": {
    "Code": {
      "CLI": "atlas auditing update --projectId <example_resource_id> --enabled",
      "NativeIaC": "",
      "Other": "1. Sign in to MongoDB Atlas and open the target project\n2. In the left sidebar, click Security > Database & Network Access, then click Advanced\n3. Toggle Database Auditing to On\n4. Click Save",
      "Terraform": "```hcl\nresource \"mongodbatlas_auditing\" \"example\" {\n  project_id = \"<example_resource_id>\"\n  enabled    = true  # Critical: turns on project-level database auditing to pass the check\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **auditing** and apply least-privilege filters to capture high-risk events:\n- authentication and session activity\n- DDL/config changes\n- user/role modifications and privilege grants\n\nCentralize logs in a SIEM, enforce retention/immutability with separation of duties, restrict access, and tune `auditAuthorizationSuccess` to balance coverage vs performance.",
      "Url": "https://hub.prowler.com/check/projects_auditing_enabled"
    }
  },
  "Categories": [
    "logging",
    "forensics-ready"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

````
