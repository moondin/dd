---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 362
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 362 of 867)

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

---[FILE: iam_account_access_approval_enabled.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/iam/iam_account_access_approval_enabled/iam_account_access_approval_enabled.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "iam_account_access_approval_enabled",
  "CheckTitle": "Ensure Access Approval is Enabled in your account",
  "CheckType": [],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Account",
  "Description": "Ensure that Access Approval is enabled within your Google Cloud Platform (GCP) account in order to allow you to require your explicit approval whenever Google personnel need to access your GCP projects. Once the Access Approval feature is enabled, you can delegate users within your organization who can approve the access requests by giving them a security role in Identity and Access Management (IAM). These requests show the requester name/ID in an email or Pub/Sub message that you can choose to approve. This creates a new control and logging layer that reveals who in your organization approved/denied access requests to your projects.",
  "Risk": "Controlling access to your Google Cloud data is crucial when working with business-critical and sensitive data. With Access Approval, you can be certain that your cloud information is accessed by approved Google personnel only. The Access Approval feature ensures that a cryptographically-signed approval is available for Google Cloud support and engineering teams when they need to access your cloud data (certain exceptions apply). By default, Access Approval and its dependency of Access Transparency are not enabled.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudIAM/enable-access-approval.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure that Access Approval is enabled within your Google Cloud Platform (GCP) account in order to allow you to require your explicit approval whenever Google personnel need to access your GCP projects. Once the Access Approval feature is enabled, you can delegate users within your organization who can approve the access requests by giving them a security role in Identity and Access Management (IAM). These requests show the requester name/ID in an email or Pub/Sub message that you can choose to approve. This creates a new control and logging layer that reveals who in your organization approved/denied access requests to your projects.",
      "Url": "https://cloud.google.com/cloud-provider-access-management/access-approval/docs"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: iam_account_access_approval_enabled.py]---
Location: prowler-master/prowler/providers/gcp/services/iam/iam_account_access_approval_enabled/iam_account_access_approval_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.iam.accessapproval_client import (
    accessapproval_client,
)


class iam_account_access_approval_enabled(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for project_id in accessapproval_client.project_ids:
            report = Check_Report_GCP(
                metadata=self.metadata(),
                resource=accessapproval_client.projects[project_id],
                project_id=project_id,
                location=accessapproval_client.region,
            )
            report.status = "PASS"
            report.status_extended = (
                f"Project {project_id} has Access Approval enabled."
            )
            if project_id not in accessapproval_client.settings:
                report.status = "FAIL"
                report.status_extended = (
                    f"Project {project_id} does not have Access Approval enabled."
                )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_audit_logs_enabled.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/iam/iam_audit_logs_enabled/iam_audit_logs_enabled.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "iam_audit_logs_enabled",
  "CheckTitle": "Configure Google Cloud Audit Logs to Track All Activities",
  "CheckType": [],
  "ServiceName": "iam",
  "SubServiceName": "Audit Logs",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "GCPProject",
  "Description": "Ensure that Google Cloud Audit Logs feature is configured to track Data Access logs for all Google Cloud Platform (GCP) services and users, in order to enhance overall access security and meet compliance requirements. Once configured, the feature can record all admin related activities, as well as all the read and write access requests to user data.",
  "Risk": "In order to maintain an effective Google Cloud audit configuration for your project, folder, and organization, all 3 types of Data Access logs (ADMIN_READ, DATA_READ and DATA_WRITE) must be enabled for all supported GCP services. Also, Data Access logs should be captured for all IAM users, without exempting any of them. Exemptions let you control which users generate audit logs. When you add an exempted user to your log configuration, audit logs are not created for that user, for the selected log type(s). Data Access audit logs are disabled by default and must be explicitly enabled based on your business requirements.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudIAM/record-all-activities.html",
      "Terraform": "https://docs.prowler.com/checks/gcp/logging-policies-1/ensure-that-cloud-audit-logging-is-configured-properly-across-all-services-and-all-users-from-a-project#terraform"
    },
    "Recommendation": {
      "Text": "It is recommended that Cloud Audit Logging is configured to track all admin activities and read, write access to user data.",
      "Url": "https://cloud.google.com/logging/docs/audit/"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: iam_audit_logs_enabled.py]---
Location: prowler-master/prowler/providers/gcp/services/iam/iam_audit_logs_enabled/iam_audit_logs_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_client import (
    cloudresourcemanager_client,
)


class iam_audit_logs_enabled(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for project in cloudresourcemanager_client.cloud_resource_manager_projects:
            report = Check_Report_GCP(
                metadata=self.metadata(),
                resource=cloudresourcemanager_client.projects[project.id],
                project_id=project.id,
                location=cloudresourcemanager_client.region,
                resource_name=(
                    cloudresourcemanager_client.projects[project.id].name
                    if cloudresourcemanager_client.projects[project.id].name
                    else "GCP Project"
                ),
            )
            report.status = "PASS"
            report.status_extended = f"Audit Logs are enabled for project {project.id}."
            if not project.audit_logging:
                report.status = "FAIL"
                report.status_extended = (
                    f"Audit Logs are not enabled for project {project.id}."
                )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_cloud_asset_inventory_enabled.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/iam/iam_cloud_asset_inventory_enabled/iam_cloud_asset_inventory_enabled.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "iam_cloud_asset_inventory_enabled",
  "CheckTitle": "Ensure Cloud Asset Inventory Is Enabled",
  "CheckType": [],
  "ServiceName": "iam",
  "SubServiceName": "Asset Inventory",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Service",
  "Description": "GCP Cloud Asset Inventory is services that provides a historical view of GCP resources and IAM policies through a time-series database. The information recorded includes metadata on Google Cloud resources, metadata on policies set on Google Cloud projects or resources, and runtime information gathered within a Google Cloud resource.",
  "Risk": "Gaining insight into Google Cloud resources and policies is vital for tasks such as DevOps, security analytics, multi-cluster and fleet management, auditing, and governance. With Cloud Asset Inventory you can discover, monitor, and analyze all GCP assets in one place, achieving a better understanding of all your cloud assets across projects and services.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "gcloud services enable cloudasset.googleapis.com",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudAPI/enabled-cloud-asset-inventory.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure that Cloud Asset Inventory is enabled for all your GCP projects in order to efficiently manage the history and the inventory of your cloud resources. Google Cloud Asset Inventory is a fully managed metadata inventory service that allows you to view, monitor, analyze, and gain insights for your Google Cloud and Anthos assets. Cloud Asset Inventory is disabled by default in each GCP project.",
      "Url": "https://cloud.google.com/asset-inventory/docs"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: iam_cloud_asset_inventory_enabled.py]---
Location: prowler-master/prowler/providers/gcp/services/iam/iam_cloud_asset_inventory_enabled/iam_cloud_asset_inventory_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.serviceusage.serviceusage_client import (
    serviceusage_client,
)


class iam_cloud_asset_inventory_enabled(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for project_id in serviceusage_client.project_ids:
            report = Check_Report_GCP(
                metadata=self.metadata(),
                resource=serviceusage_client.projects[project_id],
                resource_id="cloudasset.googleapis.com",
                resource_name="Cloud Asset Inventory",
                project_id=project_id,
                location=serviceusage_client.region,
            )
            report.status = "FAIL"
            report.status_extended = (
                f"Cloud Asset Inventory is not enabled in project {project_id}."
            )
            for active_service in serviceusage_client.active_services.get(
                project_id, []
            ):
                if active_service.name == "cloudasset.googleapis.com":
                    report.status = "PASS"
                    report.status_extended = (
                        f"Cloud Asset Inventory is enabled in project {project_id}."
                    )
                    break
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_no_service_roles_at_project_level.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/iam/iam_no_service_roles_at_project_level/iam_no_service_roles_at_project_level.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "iam_no_service_roles_at_project_level",
  "CheckTitle": "Ensure That IAM Users Are Not Assigned the Service Account User or Service Account Token Creator Roles at Project Level",
  "CheckType": [],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "IAM Policy",
  "Description": "It is recommended to assign the `Service Account User (iam.serviceAccountUser)` and `Service Account Token Creator (iam.serviceAccountTokenCreator)` roles to a user for a specific service account rather than assigning the role to a user at project level.",
  "Risk": "The Service Account User (iam.serviceAccountUser) role allows an IAM user to attach a service account to a long-running job service such as an App Engine App or Dataflow Job, whereas the Service Account Token Creator (iam.serviceAccountTokenCreator) role allows a user to directly impersonate the identity of a service account.",
  "RelatedUrl": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudIAM/check-for-iam-users-with-service-roles.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://docs.prowler.com/checks/gcp/google-cloud-iam-policies/bc_gcp_iam_3",
      "Terraform": "https://docs.prowler.com/checks/gcp/google-cloud-iam-policies/bc_gcp_iam_3#terraform"
    },
    "Recommendation": {
      "Text": "Ensure that the Service Account User and Service Account Token Creator roles are assigned to a user for a specific GCP service account rather than to a user at the GCP project level, in order to implement the principle of least privilege (POLP). The principle of least privilege (also known as the principle of minimal privilege) is the practice of providing every user the minimal amount of access required to perform its tasks. Google Cloud Platform (GCP) IAM users should not have assigned the Service Account User or Service Account Token Creator roles at the GCP project level. Instead, these roles should be allocated to a user associated with a specific service account, providing that user access to the service account only.",
      "Url": "https://cloud.google.com/iam/docs/granting-changing-revoking-access"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: iam_no_service_roles_at_project_level.py]---
Location: prowler-master/prowler/providers/gcp/services/iam/iam_no_service_roles_at_project_level/iam_no_service_roles_at_project_level.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_client import (
    cloudresourcemanager_client,
)


class iam_no_service_roles_at_project_level(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        failed_projects = set()
        for binding in cloudresourcemanager_client.bindings:
            report = Check_Report_GCP(
                metadata=self.metadata(),
                resource=binding,
                resource_id=binding.role,
                resource_name=binding.role if binding.role else "Service Role",
                location=cloudresourcemanager_client.region,
            )
            if binding.role in [
                "roles/iam.serviceAccountUser",
                "roles/iam.serviceAccountTokenCreator",
            ]:
                report.status = "FAIL"
                report.status_extended = f"IAM Users assigned to service role '{binding.role}' at project level {binding.project_id}."
                failed_projects.add(binding.project_id)
                findings.append(report)

        for project in cloudresourcemanager_client.project_ids:
            if project not in failed_projects:
                report = Check_Report_GCP(
                    metadata=self.metadata(),
                    resource=cloudresourcemanager_client.projects[project],
                    project_id=project,
                    location=cloudresourcemanager_client.region,
                )
                report.status = "PASS"
                report.status_extended = f"No IAM Users assigned to service roles at project level {project}."
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_organization_essential_contacts_configured.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/iam/iam_organization_essential_contacts_configured/iam_organization_essential_contacts_configured.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "iam_organization_essential_contacts_configured",
  "CheckTitle": "Ensure Essential Contacts is Configured for Organization",
  "CheckType": [],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Organization",
  "Description": "It is recommended that Essential Contacts is configured to designate email addresses for Google Cloud services to notify of important technical or security information.",
  "Risk": "Google Cloud Platform (GCP) services, such as Cloud Billing, send out billing notifications to share important information with the cloud platform users. By default, these types of notifications are sent to members with certain Identity and Access Management (IAM) roles such as 'roles/owner' and 'roles/billing.admin'. With Essential Contacts, you can specify exactly who receives important notifications by providing your own list of contacts (i.e. email addresses).",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "gcloud essential-contacts create --email=<EMAIL> --notification-categories=<NOTIFICATION_CATEGORIES> --organization=<ORGANIZATION_ID>",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudIAM/essential-contacts.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "It is recommended that Essential Contacts is configured to designate email addresses for Google Cloud services to notify of important technical or security information.",
      "Url": "https://cloud.google.com/resource-manager/docs/managing-notification-contacts"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: iam_organization_essential_contacts_configured.py]---
Location: prowler-master/prowler/providers/gcp/services/iam/iam_organization_essential_contacts_configured/iam_organization_essential_contacts_configured.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.iam.essentialcontacts_client import (
    essentialcontacts_client,
)


class iam_organization_essential_contacts_configured(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for org in essentialcontacts_client.organizations:
            report = Check_Report_GCP(
                metadata=self.metadata(),
                resource=org,
                project_id=essentialcontacts_client.default_project_id,
                location=essentialcontacts_client.region,
            )
            report.status = "FAIL"
            report.status_extended = (
                f"Organization {org.name} does not have essential contacts configured."
            )
            if org.contacts:
                report.status = "PASS"
                report.status_extended = (
                    f"Organization {org.name} has essential contacts configured."
                )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_role_kms_enforce_separation_of_duties.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/iam/iam_role_kms_enforce_separation_of_duties/iam_role_kms_enforce_separation_of_duties.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "iam_role_kms_enforce_separation_of_duties",
  "CheckTitle": "Enforce Separation of Duties for KMS-Related Roles",
  "CheckType": [],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "IAMRole",
  "Description": "Ensure that separation of duties is enforced for all Cloud Key Management Service (KMS) related roles. The principle of separation of duties (also known as segregation of duties) has as its primary objective the prevention of fraud and human error. This objective is achieved by dismantling the tasks and the associated privileges for a specific business process among multiple users/identities. Google Cloud provides predefined roles that can be used to implement the principle of separation of duties, where it is needed. The predefined Cloud KMS Admin role is meant for users to manage KMS keys but not to use them. The Cloud KMS CryptoKey Encrypter/Decrypter roles are meant for services who can use keys to encrypt and decrypt data, but not to manage them. To adhere to cloud security best practices, your IAM users should not have the Admin role and any of the CryptoKey Encrypter/Decrypter roles assigned at the same time.",
  "Risk": "The principle of separation of duties can be enforced in order to eliminate the need for the IAM user/identity that has all the permissions needed to perform unwanted actions, such as using a cryptographic key to access and decrypt data which the user should not normally have access to.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudIAM/enforce-separation-of-duties-for-kms-related-roles.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "It is recommended that the principle of 'Separation of Duties' is enforced while assigning KMS related roles to users.",
      "Url": "https://cloud.google.com/kms/docs/separation-of-duties"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: iam_role_kms_enforce_separation_of_duties.py]---
Location: prowler-master/prowler/providers/gcp/services/iam/iam_role_kms_enforce_separation_of_duties/iam_role_kms_enforce_separation_of_duties.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_client import (
    cloudresourcemanager_client,
)


class iam_role_kms_enforce_separation_of_duties(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for project in cloudresourcemanager_client.project_ids:
            non_compliant_members = []
            kms_admin_members = []
            report = Check_Report_GCP(
                metadata=self.metadata(),
                resource=cloudresourcemanager_client.projects[project],
                project_id=project,
                location=cloudresourcemanager_client.region,
                resource_name=(
                    cloudresourcemanager_client.projects[project].name
                    if cloudresourcemanager_client.projects[project].name
                    else "GCP Project"
                ),
            )
            report.status = "PASS"
            report.status_extended = f"Principle of separation of duties was enforced for KMS-Related Roles in project {project}."
            for binding in cloudresourcemanager_client.bindings:
                if binding.project_id == project:
                    if "roles/cloudkms.admin" in binding.role:
                        kms_admin_members.extend(binding.members)
                    if (
                        "roles/cloudkms.cryptoKeyEncrypterDecrypter" in binding.role
                        or "roles/cloudkms.cryptoKeyEncrypter" in binding.role
                        or "roles/cloudkms.cryptoKeyDecrypter" in binding.role
                    ):
                        for member in binding.members:
                            if member in kms_admin_members:
                                non_compliant_members.append(member)
            if non_compliant_members:
                report.status = "FAIL"
                report.status_extended = f"Principle of separation of duties was not enforced for KMS-Related Roles in project {project} in members {','.join(non_compliant_members)}."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_role_sa_enforce_separation_of_duties.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/iam/iam_role_sa_enforce_separation_of_duties/iam_role_sa_enforce_separation_of_duties.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "iam_role_sa_enforce_separation_of_duties",
  "CheckTitle": "Enforce Separation of Duties for Service-Account Related Roles",
  "CheckType": [],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "IAMRole",
  "Description": "Ensure that separation of duties (also known as segregation of duties - SoD) is enforced for all Google Cloud Platform (GCP) service-account related roles. The security principle of separation of duties has as its primary objective the prevention of fraud and human error. This objective is achieved by disbanding the tasks and associated privileges for a specific business process among multiple users/members. To follow security best practices, your GCP service accounts should not have the Service Account Admin and Service Account User roles assigned at the same time.",
  "Risk": "The principle of separation of duties should be enforced in order to eliminate the need for high-privileged IAM members, as the permissions granted to these members can allow them to perform malicious or unwanted actions.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudIAM/enforce-separation-of-duties-for-service-account-roles.html",
      "Terraform": "https://docs.prowler.com/checks/gcp/google-cloud-iam-policies/bc_gcp_iam_10#terraform"
    },
    "Recommendation": {
      "Text": "Ensure that separation of duties (also known as segregation of duties - SoD) is enforced for all Google Cloud Platform (GCP) service-account related roles. The security principle of separation of duties has as its primary objective the prevention of fraud and human error. This objective is achieved by disbanding the tasks and associated privileges for a specific business process among multiple users/members. To follow security best practices, your GCP service accounts should not have the Service Account Admin and Service Account User roles assigned at the same time.",
      "Url": "https://cloud.google.com/iam/docs/understanding-roles"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: iam_role_sa_enforce_separation_of_duties.py]---
Location: prowler-master/prowler/providers/gcp/services/iam/iam_role_sa_enforce_separation_of_duties/iam_role_sa_enforce_separation_of_duties.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_client import (
    cloudresourcemanager_client,
)


class iam_role_sa_enforce_separation_of_duties(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for project in cloudresourcemanager_client.project_ids:
            non_compliant_members = []
            report = Check_Report_GCP(
                metadata=self.metadata(),
                resource=cloudresourcemanager_client.projects[project],
                location=cloudresourcemanager_client.region,
                project_id=project,
            )
            report.status = "PASS"
            report.status_extended = f"Principle of separation of duties was enforced for Service-Account Related Roles in project {project}."
            for binding in cloudresourcemanager_client.bindings:
                if binding.project_id == project and (
                    "roles/iam.serviceAccountUser" in binding.role
                    or "roles/iam.serviceAccountAdmin" in binding.role
                ):
                    non_compliant_members.extend(binding.members)
            if non_compliant_members:
                report.status = "FAIL"
                report.status_extended = f"Principle of separation of duties was not enforced for Service-Account Related Roles in project {project} in members {','.join(non_compliant_members)}."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_sa_no_administrative_privileges.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/iam/iam_sa_no_administrative_privileges/iam_sa_no_administrative_privileges.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "iam_sa_no_administrative_privileges",
  "CheckTitle": "Ensure Service Account does not have admin privileges",
  "CheckType": [],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "ServiceAccount",
  "Description": "Ensure Service Account does not have admin privileges",
  "Risk": "Enrolling ServiceAccount with Admin rights gives full access to an assigned application or a VM. A ServiceAccount Access holder can perform critical actions, such as delete and update change settings, without user intervention.",
  "RelatedUrl": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudIAM/restrict-admin-access-for-service-accounts.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://docs.prowler.com/checks/gcp/google-cloud-iam-policies/bc_gcp_iam_4",
      "Terraform": "https://docs.prowler.com/checks/gcp/google-cloud-iam-policies/bc_gcp_iam_4#terraform"
    },
    "Recommendation": {
      "Text": "Ensure that your Google Cloud user-managed service accounts are not using privileged (administrator) roles, in order to implement the principle of least privilege and prevent any accidental or intentional modifications that may lead to data leaks and/or data loss.",
      "Url": "https://cloud.google.com/iam/docs/manage-access-service-accounts"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: iam_sa_no_administrative_privileges.py]---
Location: prowler-master/prowler/providers/gcp/services/iam/iam_sa_no_administrative_privileges/iam_sa_no_administrative_privileges.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_client import (
    cloudresourcemanager_client,
)
from prowler.providers.gcp.services.iam.iam_client import iam_client


class iam_sa_no_administrative_privileges(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for account in iam_client.service_accounts:
            report = Check_Report_GCP(
                metadata=self.metadata(),
                resource=account,
                resource_id=account.email,
                location=iam_client.region,
            )
            report.status = "PASS"
            report.status_extended = (
                f"Account {account.email} has no administrative privileges."
            )
            for binding in cloudresourcemanager_client.bindings:
                if f"serviceAccount:{account.email}" in binding.members and (
                    "admin" in binding.role.lower()
                    or binding.role.lower() in ["roles/editor", "roles/owner"]
                ):
                    report.status = "FAIL"
                    report.status_extended = f"Account {account.email} has administrative privileges with {binding.role}."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_sa_no_user_managed_keys.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/iam/iam_sa_no_user_managed_keys/iam_sa_no_user_managed_keys.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "iam_sa_no_user_managed_keys",
  "CheckTitle": "Ensure That There Are Only GCP-Managed Service Account Keys for Each Service Account",
  "CheckType": [],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "ServiceAccountKey",
  "Description": "Ensure That There Are Only GCP-Managed Service Account Keys for Each Service Account",
  "Risk": "Anyone who has access to the keys will be able to access resources through the service account. GCP-managed keys are used by Cloud Platform services such as App Engine and Compute Engine. These keys cannot be downloaded. Google will keep the keys and automatically rotate them on an approximately weekly basis. User-managed keys are created, downloadable, and managed by users.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudIAM/delete-user-managed-service-account-keys.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "It is recommended to prevent user-managed service account keys.",
      "Url": "https://cloud.google.com/iam/docs/creating-managing-service-account-keys"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: iam_sa_no_user_managed_keys.py]---
Location: prowler-master/prowler/providers/gcp/services/iam/iam_sa_no_user_managed_keys/iam_sa_no_user_managed_keys.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.iam.iam_client import iam_client


class iam_sa_no_user_managed_keys(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for account in iam_client.service_accounts:
            report = Check_Report_GCP(
                metadata=self.metadata(),
                resource=account,
                resource_id=account.email,
                location=iam_client.region,
            )
            report.status = "PASS"
            report.status_extended = (
                f"Account {account.email} does not have user-managed keys."
            )
            for key in account.keys:
                if key.type == "USER_MANAGED":
                    report.status = "FAIL"
                    report.status_extended = (
                        f"Account {account.email} has user-managed keys."
                    )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_sa_user_managed_key_rotate_90_days.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/iam/iam_sa_user_managed_key_rotate_90_days/iam_sa_user_managed_key_rotate_90_days.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "iam_sa_user_managed_key_rotate_90_days",
  "CheckTitle": "Ensure User-Managed/External Keys for Service Accounts Are Rotated Every 90 Days",
  "CheckType": [],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "ServiceAccountKey",
  "Description": "Ensure User-Managed/External Keys for Service Accounts Are Rotated Every 90 Days",
  "Risk": "Service Account keys should be rotated to ensure that data cannot be accessed with an old key that might have been lost, cracked, or stolen.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudIAM/rotate-service-account-user-managed-keys.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "It is recommended that all Service Account keys are regularly rotated.",
      "Url": "https://cloud.google.com/iam/docs/creating-managing-service-account-keys"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: iam_sa_user_managed_key_rotate_90_days.py]---
Location: prowler-master/prowler/providers/gcp/services/iam/iam_sa_user_managed_key_rotate_90_days/iam_sa_user_managed_key_rotate_90_days.py

```python
from datetime import datetime

from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.iam.iam_client import iam_client


class iam_sa_user_managed_key_rotate_90_days(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for account in iam_client.service_accounts:
            for key in account.keys:
                if key.type == "USER_MANAGED":
                    last_rotated = (datetime.now() - key.valid_after).days
                    report = Check_Report_GCP(
                        metadata=self.metadata(),
                        resource=account,
                        resource_id=key.name,
                        resource_name=account.email,
                        location=iam_client.region,
                    )
                    report.status = "PASS"
                    report.status_extended = f"User-managed key {key.name} for account {account.email} was rotated over the last 90 days ({last_rotated} days ago)."
                    if last_rotated > 90:
                        report.status = "FAIL"
                        report.status_extended = f"User-managed key {key.name} for account {account.email} was not rotated over the last 90 days ({last_rotated} days ago)."
                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_sa_user_managed_key_unused.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/iam/iam_sa_user_managed_key_unused/iam_sa_user_managed_key_unused.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "iam_sa_user_managed_key_unused",
  "CheckTitle": "Ensure That There Are No Unused Service Account Keys for Each Service Account",
  "CheckType": [],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "ServiceAccountKey",
  "Description": "Ensure That There Are No Unused Service Account Keys for Each Service Account.",
  "Risk": "Anyone who has access to the keys will be able to access resources through the service account. GCP-managed keys are used by Cloud Platform services such as App Engine and Compute Engine. These keys cannot be downloaded. Google will keep the keys and automatically rotate them on an approximately weekly basis. User-managed keys are created, downloadable, and managed by users.",
  "RelatedUrl": "https://cloud.google.com/iam/docs/service-account-overview#identify-unused",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "It is recommended to prevent user-managed service account keys.",
      "Url": "https://cloud.google.com/iam/docs/creating-managing-service-account-keys"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

````
