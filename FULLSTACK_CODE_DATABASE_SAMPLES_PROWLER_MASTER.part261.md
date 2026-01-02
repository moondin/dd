---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 261
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 261 of 867)

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

---[FILE: directoryservice_ldap_certificate_expiration.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/directoryservice/directoryservice_ldap_certificate_expiration/directoryservice_ldap_certificate_expiration.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "directoryservice_ldap_certificate_expiration",
  "CheckTitle": "Directory Service LDAP certificate expires in more than 90 days",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "directoryservice",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**AWS Directory Service** Secure LDAP (LDAPS) certificates are assessed for upcoming expiration by comparing each directory's certificate expiration to the current time and identifying those with `<= 90` days remaining.",
  "Risk": "Expired LDAPS certificates cause TLS handshakes to fail, blocking directory binds and queries and disrupting authentication and app integrations (availability). If clients fall back to plain LDAP, credentials and directory data can be intercepted or altered (confidentiality and integrity).",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/directoryservice/latest/admin-guide/ms_ad_ldap.html",
    "https://support.icompaas.com/support/solutions/articles/62000229587-ensure-to-monitor-directory-service-ldap-certificates-expiration"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws ds register-certificate --directory-id <DIRECTORY_ID> --certificate-data file://certificate.pem",
      "NativeIaC": "",
      "Other": "1. In the AWS Console, open Directory Service and select your AWS Managed Microsoft AD (<example_resource_id>)\n2. Go to Networking & security > Secure LDAP\n3. Click Edit (Manage certificate)\n4. Choose Replace certificate (or Upload certificate)\n5. Upload a new LDAPS server certificate with private key from a trusted CA (valid for >90 days); enter the password if using a .pfx\n6. Save and wait until the certificate status is Active",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Adopt certificate lifecycle management: inventory LDAPS certificates, alert well before expiry, and automate renewal with staged rollout and overlap. Enforce TLS-only LDAP and disable plaintext fallback. Apply **least privilege** and **separation of duties** to certificate issuance and deployment.",
      "Url": "https://hub.prowler.com/check/directoryservice_ldap_certificate_expiration"
    }
  },
  "Categories": [
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: directoryservice_ldap_certificate_expiration.py]---
Location: prowler-master/prowler/providers/aws/services/directoryservice/directoryservice_ldap_certificate_expiration/directoryservice_ldap_certificate_expiration.py

```python
from datetime import datetime

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.directoryservice.directoryservice_client import (
    directoryservice_client,
)

DAYS_TO_EXPIRE_THRESHOLD = 90
"""Number of days to notify about a certificate expiration"""


class directoryservice_ldap_certificate_expiration(Check):
    def execute(self):
        findings = []
        for directory in directoryservice_client.directories.values():
            for certificate in directory.certificates:
                report = Check_Report_AWS(metadata=self.metadata(), resource=directory)
                report.resource_id = certificate.id

                remaining_days_to_expire = (
                    certificate.expiry_date_time
                    - datetime.now(
                        certificate.expiry_date_time.tzinfo
                        if hasattr(certificate.expiry_date_time, "tzinfo")
                        else None
                    )
                ).days

                if remaining_days_to_expire <= DAYS_TO_EXPIRE_THRESHOLD:
                    report.status = "FAIL"
                    report.status_extended = f"LDAP Certificate {certificate.id} configured at {directory.id} is about to expire in {remaining_days_to_expire} days."
                else:
                    report.status = "PASS"
                    report.status_extended = f"LDAP Certificate {certificate.id} configured at {directory.id} expires in {remaining_days_to_expire} days."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: directoryservice_radius_server_security_protocol.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/directoryservice/directoryservice_radius_server_security_protocol/directoryservice_radius_server_security_protocol.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "directoryservice_radius_server_security_protocol",
  "CheckTitle": "Directory Service directory RADIUS server uses MS-CHAPv2",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "TTPs/Credential Access"
  ],
  "ServiceName": "directoryservice",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "AWS Directory Service RADIUS configuration uses the **authentication protocol** defined for MFA integration. The finding evaluates whether directories with RADIUS enabled are set to `MS-CHAPv2` instead of weaker options like `PAP`, `CHAP`, or `MS-CHAPv1`.",
  "Risk": "Using `PAP`, `CHAP`, or `MS-CHAPv1` weakens RADIUS-based MFA.\n\n`PAP` exposes cleartext credentials, while legacy CHAP variants permit offline cracking and replay, enabling unauthorized access to AD-integrated services and lateral movement, degrading confidentiality and integrity.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.secureauth.com/0903/en/ms-chapv2-and-radius--sp-initiated--for-cisco-and-netscaler-configuration-guide.html",
    "https://docs.aws.amazon.com/directoryservice/latest/admin-guide/ms_ad_mfa.html",
    "https://www.freeradius.org/documentation/freeradius-server/4.0~alpha1/raddb/mods-available/mschap.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws ds update-radius --directory-id <example_resource_id> --radius-settings AuthenticationProtocol=MS-CHAPv2",
      "NativeIaC": "",
      "Other": "1. In the AWS Console, open Directory Service and select your directory\n2. Open the Networking & security tab (Multi-factor authentication section)\n3. Click Actions > Edit (or Enable)\n4. Set Protocol to MS-CHAPv2\n5. Click Save (or Enable) to apply",
      "Terraform": "```hcl\nresource \"aws_directory_service_radius_settings\" \"<example_resource_name>\" {\n  directory_id  = \"<example_resource_id>\"\n  radius_servers = [\"<RADIUS_SERVER_IP>\"]\n  shared_secret  = \"<SHARED_SECRET>\"\n\n  authentication_protocol = \"MS-CHAPv2\" # Critical: sets the RADIUS auth protocol to MS-CHAPv2 to pass the check\n}\n```"
    },
    "Recommendation": {
      "Text": "Standardize on `MS-CHAPv2` for RADIUS authentication to MFA providers. Disable `PAP`, `CHAP`, and `MS-CHAPv1` to prevent downgrades. Apply least privilege and defense in depth: use strong shared secrets, restrict network access to RADIUS endpoints, and monitor authentication logs for anomalies.",
      "Url": "https://hub.prowler.com/check/directoryservice_radius_server_security_protocol"
    }
  },
  "Categories": [
    "identity-access"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: directoryservice_radius_server_security_protocol.py]---
Location: prowler-master/prowler/providers/aws/services/directoryservice/directoryservice_radius_server_security_protocol/directoryservice_radius_server_security_protocol.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.directoryservice.directoryservice_client import (
    directoryservice_client,
)
from prowler.providers.aws.services.directoryservice.directoryservice_service import (
    AuthenticationProtocol,
)


class directoryservice_radius_server_security_protocol(Check):
    def execute(self):
        findings = []
        for directory in directoryservice_client.directories.values():
            if directory.radius_settings:
                report = Check_Report_AWS(metadata=self.metadata(), resource=directory)
                if (
                    directory.radius_settings.authentication_protocol
                    == AuthenticationProtocol.MS_CHAPv2
                ):
                    report.status = "PASS"
                    report.status_extended = f"Radius server of Directory {directory.id} have recommended security protocol for the Radius server."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"Radius server of Directory {directory.id} does not have recommended security protocol for the Radius server."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: directoryservice_supported_mfa_radius_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/directoryservice/directoryservice_supported_mfa_radius_enabled/directoryservice_supported_mfa_radius_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "directoryservice_supported_mfa_radius_enabled",
  "CheckTitle": "AWS Directory Service directory has RADIUS-based MFA enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "TTPs/Initial Access",
    "TTPs/Credential Access"
  ],
  "ServiceName": "directoryservice",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**AWS Directory Service directories** are evaluated for **RADIUS-backed multi-factor authentication**, confirming that MFA is configured and the RADIUS integration is active.",
  "Risk": "Without **RADIUS MFA**, directory-based sign-ins to AWS-integrated services rely on a single factor, enabling credential stuffing and phishing to succeed. Compromised passwords can grant unauthorized access, drive data exfiltration, and enable privilege escalation, undermining confidentiality and integrity.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/directoryservice/latest/admin-guide/ms_ad_mfa.html",
    "https://support.icompaas.com/support/solutions/articles/62000233537-ensure-multi-factor-authentication-mfa-using-a-radius-server-is-enabled-in-directory-service"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws ds enable-radius --directory-id <example_resource_id> --radius-settings '{\"RadiusServers\":[\"<RADIUS_IP_OR_DNS>\"],\"SharedSecret\":\"<SHARED_SECRET>\"}'",
      "NativeIaC": "",
      "Other": "1. Sign in to the AWS Console and open Directory Service\n2. Select your directory and open it\n3. Go to the Networking & security tab\n4. In Multi-factor authentication, click Actions > Enable\n5. Enter RADIUS server IP(s) and the Shared secret, then click Enable\n6. Wait until the RADIUS status shows Completed",
      "Terraform": "```hcl\nresource \"aws_directory_service_radius_settings\" \"<example_resource_name>\" {\n  directory_id  = \"<example_resource_id>\"            # Directory to enable RADIUS MFA on\n  radius_servers = [\"<RADIUS_IP_OR_DNS>\"]             # Critical: RADIUS server endpoint(s)\n  shared_secret  = \"<SHARED_SECRET>\"                   # Critical: Shared secret for RADIUS\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable and enforce **RADIUS-based MFA** for all Directory Service authentications. Apply **least privilege**, harden and monitor the RADIUS infrastructure, rotate shared secrets, and restrict network access (e.g., `UDP/1812`). Use **defense in depth** with segmentation and session controls to limit lateral movement and reduce blast radius.",
      "Url": "https://hub.prowler.com/check/directoryservice_supported_mfa_radius_enabled"
    }
  },
  "Categories": [
    "identity-access"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: directoryservice_supported_mfa_radius_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/directoryservice/directoryservice_supported_mfa_radius_enabled/directoryservice_supported_mfa_radius_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.directoryservice.directoryservice_client import (
    directoryservice_client,
)
from prowler.providers.aws.services.directoryservice.directoryservice_service import (
    RadiusStatus,
)


class directoryservice_supported_mfa_radius_enabled(Check):
    def execute(self):
        findings = []
        for directory in directoryservice_client.directories.values():
            if directory.radius_settings:
                report = Check_Report_AWS(metadata=self.metadata(), resource=directory)
                if directory.radius_settings.status == RadiusStatus.Completed:
                    report.status = "PASS"
                    report.status_extended = (
                        f"Directory {directory.id} have Radius MFA enabled."
                    )
                else:
                    report.status = "FAIL"
                    report.status_extended = (
                        f"Directory {directory.id} does not have Radius MFA enabled."
                    )

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: dlm_client.py]---
Location: prowler-master/prowler/providers/aws/services/dlm/dlm_client.py

```python
from prowler.providers.aws.services.dlm.dlm_service import DLM
from prowler.providers.common.provider import Provider

dlm_client = DLM(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: dlm_service.py]---
Location: prowler-master/prowler/providers/aws/services/dlm/dlm_service.py
Signals: Pydantic

```python
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.aws.lib.service.service import AWSService


class DLM(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.lifecycle_policies = {}
        self.__threading_call__(self._get_lifecycle_policies)

    def _get_lifecycle_policy_arn_template(self, region):
        return (
            f"arn:{self.audited_partition}:dlm:{region}:{self.audited_account}:policy"
        )

    def _get_lifecycle_policies(self, regional_client):
        logger.info("DLM - Getting EBS Snapshots Lifecycle Policies...")
        try:
            lifecycle_policies = regional_client.get_lifecycle_policies()
            policies = {}
            for policy in lifecycle_policies["Policies"]:
                policy_id = policy.get("PolicyId")
                policies[policy_id] = LifecyclePolicy(
                    id=policy_id,
                    state=policy.get("State"),
                    tags=policy.get("Tags"),
                    type=policy.get("PolicyType"),
                )
            self.lifecycle_policies[regional_client.region] = policies
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class LifecyclePolicy(BaseModel):
    id: str
    state: str
    tags: dict
    type: str
```

--------------------------------------------------------------------------------

---[FILE: dlm_ebs_snapshot_lifecycle_policy_exists.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/dlm/dlm_ebs_snapshot_lifecycle_policy_exists/dlm_ebs_snapshot_lifecycle_policy_exists.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "dlm_ebs_snapshot_lifecycle_policy_exists",
  "CheckTitle": "Region with EBS snapshots has at least one EBS snapshot lifecycle policy defined",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "dlm",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**EBS snapshots** are expected to be governed by **Data Lifecycle Manager (DLM) policies** in each Region where snapshots exist.\n\nThe evaluation looks for lifecycle policies that automate snapshot creation, retention, and cleanup for those snapshots.",
  "Risk": "Without **automated lifecycle policies**, backups become inconsistent and error-prone, reducing availability and weakening recovery objectives. Missing retention rules cause premature deletion or snapshot sprawl, increasing cost and exposing stale data. Lack of cross-Region/account copies limits resilience to regional outages and malicious deletion.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/DLM/ebs-snapshot-automation.html",
    "https://repost.aws/articles/ARmYgZmA8MRQi89pWd9D7eFw/how-to-create-a-automate-backup-aws-data-lifecycle-management-using-snapshots",
    "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/snapshot-lifecycle.html#dlm-elements"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws dlm create-lifecycle-policy --region <region> --execution-role-arn <execution-role-arn> --description \"<description>\" --state ENABLED --policy-details '{\"PolicyType\":\"EBS_SNAPSHOT_MANAGEMENT\",\"ResourceTypes\":[\"VOLUME\"],\"TargetTags\":[{\"Key\":\"<tag_key>\",\"Value\":\"<tag_value>\"}],\"Schedules\":[{\"CreateRule\":{\"Interval\":24,\"IntervalUnit\":\"HOURS\"},\"RetainRule\":{\"Count\":1}}]}'",
      "NativeIaC": "```yaml\n# CloudFormation: minimal EBS snapshot lifecycle policy\nResources:\n  <example_resource_name>:\n    Type: AWS::DLM::LifecyclePolicy\n    Properties:\n      Description: \"<description>\"\n      ExecutionRoleArn: \"<example_resource_arn>\"\n      State: ENABLED  # Critical: enables the policy so it is counted by the check\n      PolicyDetails:\n        PolicyType: EBS_SNAPSHOT_MANAGEMENT  # Critical: creates an EBS snapshot lifecycle policy\n        ResourceTypes: [VOLUME]\n        TargetTags:\n          - Key: \"<tag_key>\"  # Critical: selects target volumes by tag\n            Value: \"<tag_value>\"\n        Schedules:\n          - CreateRule:\n              Interval: 24\n              IntervalUnit: HOURS\n            RetainRule:\n              Count: 1\n```",
      "Other": "1. In the AWS console, switch to the Region that has EBS snapshots\n2. Open EC2 > Lifecycle Manager (DLM) > Create lifecycle policy\n3. Select EBS snapshot policy; Target resource: Volumes\n4. Add Target tags: Key = <tag_key>, Value = <tag_value>\n5. Set Schedule: Create every 24 hours; Retain 1 snapshot\n6. Ensure State is Enabled and click Create policy",
      "Terraform": "```hcl\n# Terraform: minimal EBS snapshot lifecycle policy\nresource \"aws_dlm_lifecycle_policy\" \"<example_resource_name>\" {\n  description        = \"<description>\"\n  execution_role_arn = \"<example_resource_arn>\"\n  state              = \"ENABLED\" # Critical: enables the policy so it is counted by the check\n\n  policy_details {\n    policy_type    = \"EBS_SNAPSHOT_MANAGEMENT\" # Critical: creates an EBS snapshot lifecycle policy\n    resource_types = [\"VOLUME\"]\n    target_tags = {\n      \"<tag_key>\" = \"<tag_value>\" # Critical: selects target volumes by tag\n    }\n    schedule {\n      create_rule {\n        interval      = 24\n        interval_unit = \"HOURS\"\n      }\n      retain_rule {\n        count = 1\n      }\n    }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Implement **DLM lifecycle policies** for all volumes that require backup.\n\n- Schedule creations to meet RPO/RTO\n- Define retention to prevent sprawl and enforce least data exposure\n- Use **least privilege** roles and separation of duties\n- Copy snapshots to another Region/account for **defense in depth**\n- Monitor policy health and coverage with tags",
      "Url": "https://hub.prowler.com/check/dlm_ebs_snapshot_lifecycle_policy_exists"
    }
  },
  "Categories": [
    "forensics-ready"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: dlm_ebs_snapshot_lifecycle_policy_exists.py]---
Location: prowler-master/prowler/providers/aws/services/dlm/dlm_ebs_snapshot_lifecycle_policy_exists/dlm_ebs_snapshot_lifecycle_policy_exists.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.dlm.dlm_client import dlm_client
from prowler.providers.aws.services.ec2.ec2_client import ec2_client


class dlm_ebs_snapshot_lifecycle_policy_exists(Check):
    def execute(self):
        findings = []
        for region in dlm_client.lifecycle_policies:
            if (
                region in ec2_client.regions_with_snapshots
                and ec2_client.regions_with_snapshots[region]
            ):
                report = Check_Report_AWS(
                    metadata=self.metadata(),
                    resource=dlm_client.lifecycle_policies,
                )
                report.status = "FAIL"
                report.status_extended = "No EBS Snapshot lifecycle policies found."
                report.region = region
                report.resource_id = dlm_client.audited_account
                report.resource_arn = dlm_client._get_lifecycle_policy_arn_template(
                    region
                )
                if dlm_client.lifecycle_policies[region]:
                    report.status = "PASS"
                    report.status_extended = "EBS snapshot lifecycle policies found."
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: dms_client.py]---
Location: prowler-master/prowler/providers/aws/services/dms/dms_client.py

```python
from prowler.providers.aws.services.dms.dms_service import DMS
from prowler.providers.common.provider import Provider

dms_client = DMS(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: dms_service.py]---
Location: prowler-master/prowler/providers/aws/services/dms/dms_service.py
Signals: Pydantic

```python
import json
from typing import Optional

from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class DMS(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.instances = []
        self.endpoints = {}
        self.replication_tasks = {}
        self.__threading_call__(self._describe_replication_instances)
        self.__threading_call__(self._list_tags, self.instances)
        self.__threading_call__(self._describe_endpoints)
        self.__threading_call__(self._describe_replication_tasks)
        self.__threading_call__(self._list_tags, self.endpoints.values())
        self.__threading_call__(self._list_tags, self.replication_tasks.values())

    def _describe_replication_instances(self, regional_client):
        logger.info("DMS - Describing DMS Replication Instances...")
        try:
            describe_replication_instances_paginator = regional_client.get_paginator(
                "describe_replication_instances"
            )
            for page in describe_replication_instances_paginator.paginate():
                for instance in page["ReplicationInstances"]:
                    arn = instance["ReplicationInstanceArn"]
                    if not self.audit_resources or (
                        is_resource_filtered(arn, self.audit_resources)
                    ):
                        self.instances.append(
                            RepInstance(
                                id=instance["ReplicationInstanceIdentifier"],
                                arn=arn,
                                status=instance["ReplicationInstanceStatus"],
                                public=instance["PubliclyAccessible"],
                                kms_key=instance["KmsKeyId"],
                                auto_minor_version_upgrade=instance[
                                    "AutoMinorVersionUpgrade"
                                ],
                                security_groups=[
                                    sg["VpcSecurityGroupId"]
                                    for sg in instance["VpcSecurityGroups"]
                                    if sg["Status"] == "active"
                                ],
                                multi_az=instance["MultiAZ"],
                                region=regional_client.region,
                            )
                        )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_endpoints(self, regional_client):
        logger.info("DMS - Describing DMS Endpoints...")
        try:
            describe_endpoints_paginator = regional_client.get_paginator(
                "describe_endpoints"
            )
            for page in describe_endpoints_paginator.paginate():
                for endpoint in page["Endpoints"]:
                    arn = endpoint["EndpointArn"]
                    if not self.audit_resources or (
                        is_resource_filtered(arn, self.audit_resources)
                    ):
                        self.endpoints[arn] = Endpoint(
                            arn=arn,
                            id=endpoint["EndpointIdentifier"],
                            region=regional_client.region,
                            ssl_mode=endpoint.get("SslMode", False),
                            redis_ssl_protocol=endpoint.get("RedisSettings", {}).get(
                                "SslSecurityProtocol", "plaintext"
                            ),
                            mongodb_auth_type=endpoint.get("MongoDbSettings", {}).get(
                                "AuthType", "no"
                            ),
                            neptune_iam_auth_enabled=endpoint.get(
                                "NeptuneSettings", {}
                            ).get("IamAuthEnabled", False),
                            engine_name=endpoint["EngineName"],
                        )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_replication_tasks(self, regional_client):
        logger.info("DMS - Describing DMS Replication Tasks for Logging Settings...")
        try:
            paginator = regional_client.get_paginator("describe_replication_tasks")
            for page in paginator.paginate():
                for task in page["ReplicationTasks"]:
                    arn = task["ReplicationTaskArn"]
                    if not self.audit_resources or (
                        is_resource_filtered(arn, self.audit_resources)
                    ):
                        task_settings = json.loads(
                            task.get("ReplicationTaskSettings", "")
                        )
                        self.replication_tasks[arn] = ReplicationTasks(
                            arn=arn,
                            id=task["ReplicationTaskIdentifier"],
                            region=regional_client.region,
                            source_endpoint_arn=task["SourceEndpointArn"],
                            target_endpoint_arn=task["TargetEndpointArn"],
                            logging_enabled=task_settings.get("Logging", {}).get(
                                "EnableLogging", False
                            ),
                            log_components=task_settings.get("Logging", {}).get(
                                "LogComponents", []
                            ),
                        )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_tags(self, resource: any):
        try:
            resource.tags = self.regional_clients[
                resource.region
            ].list_tags_for_resource(ResourceArn=resource.arn)["TagList"]
        except Exception as error:
            logger.error(
                f"{resource.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class Endpoint(BaseModel):
    arn: str
    id: str
    region: str
    ssl_mode: str
    redis_ssl_protocol: str
    mongodb_auth_type: str
    neptune_iam_auth_enabled: bool = False
    engine_name: str
    tags: Optional[list]


class RepInstance(BaseModel):
    id: str
    arn: str
    status: str
    public: bool
    kms_key: str
    auto_minor_version_upgrade: bool
    security_groups: list[str] = []
    multi_az: bool
    region: str
    tags: Optional[list] = []


class ReplicationTasks(BaseModel):
    arn: str
    id: str
    region: str
    source_endpoint_arn: str
    target_endpoint_arn: str
    logging_enabled: bool = False
    log_components: list[dict] = []
    tags: Optional[list] = []
```

--------------------------------------------------------------------------------

---[FILE: dms_endpoint_mongodb_authentication_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/dms/dms_endpoint_mongodb_authentication_enabled/dms_endpoint_mongodb_authentication_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "dms_endpoint_mongodb_authentication_enabled",
  "CheckTitle": "DMS MongoDB endpoint has an authentication mechanism enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Effects/Data Exposure"
  ],
  "ServiceName": "dms",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsDmsEndpoint",
  "Description": "**AWS DMS MongoDB endpoints** use an authentication mechanism. Configuration expects `AuthType` not `no` (e.g., `password`) with an `authMechanism` such as `scram_sha_1` or `mongodb_cr`.",
  "Risk": "Without authentication, unauthenticated connections can access the source, degrading **confidentiality** and **integrity**. Adversaries could read or modify migrated documents, hijack CDC, inject data, or exfiltrate records during replication.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.MongoDB.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/dms-controls.html#dms-11"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws dms modify-endpoint --endpoint-arn <endpoint-arn> --mongodb-settings '{\"AuthType\":\"password\"}' --username <username> --password <password>",
      "NativeIaC": "```yaml\n# CloudFormation: enable authentication on a MongoDB DMS endpoint\nResources:\n  <example_resource_name>:\n    Type: AWS::DMS::Endpoint\n    Properties:\n      EndpointIdentifier: <example_resource_name>\n      EndpointType: source\n      EngineName: mongodb\n      MongoDbSettings:\n        AuthType: password  # CRITICAL: sets authentication mode to 'password' so auth is enabled\n```",
      "Other": "1. In the AWS Console, go to Database Migration Service > Endpoints\n2. Select the MongoDB endpoint and click Modify\n3. Under MongoDB settings, set Authentication mode to Password\n4. Enter Username and Password\n5. Click Save changes",
      "Terraform": "```hcl\n# Terraform: enable authentication on a MongoDB DMS endpoint\nresource \"aws_dms_endpoint\" \"<example_resource_name>\" {\n  endpoint_id   = \"<example_resource_name>\"\n  endpoint_type = \"source\"\n  engine_name   = \"mongodb\"\n\n  mongodb_settings {\n    auth_type = \"password\"  # CRITICAL: enables authentication for the MongoDB endpoint\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enforce **strong authentication** on MongoDB endpoints: set `AuthType` to `password` and use `authMechanism` like `scram_sha_1`. Apply **least privilege** database accounts, store secrets in **Secrets Manager**, and pair with **TLS** for defense in depth.",
      "Url": "https://hub.prowler.com/check/dms_endpoint_mongodb_authentication_enabled"
    }
  },
  "Categories": [
    "identity-access"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: dms_endpoint_mongodb_authentication_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/dms/dms_endpoint_mongodb_authentication_enabled/dms_endpoint_mongodb_authentication_enabled.py

```python
from typing import List

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.dms.dms_client import dms_client


class dms_endpoint_mongodb_authentication_enabled(Check):
    """
    Check if AWS DMS Endpoints for MongoDB have an authentication mechanism enabled.

    This class verifies whether each AWS DMS Endpoint configured for MongoDB has an authentication
    mechanism enabled by checking the `AuthType` property in the endpoint's configuration. The check
    ensures that the `AuthType` is not set to "no", indicating that an authentication method is in place.
    """

    def execute(self) -> List[Check_Report_AWS]:
        """
        Execute the DMS MongoDB authentication type configured check.

        Iterates over all DMS Endpoints and generates a report indicating whether
        each MongoDB endpoint has an authentication mechanism enabled.

        Returns:
            List[Check_Report_AWS]: A list of report objects with the results of the check.
        """
        findings = []
        for endpoint in dms_client.endpoints.values():
            if endpoint.engine_name == "mongodb":
                report = Check_Report_AWS(metadata=self.metadata(), resource=endpoint)
                report.status = "FAIL"
                report.status_extended = f"DMS Endpoint '{endpoint.id}' for MongoDB does not have an authentication mechanism enabled."
                if endpoint.mongodb_auth_type != "no":
                    report.status = "PASS"
                    report.status_extended = f"DMS Endpoint '{endpoint.id}' for MongoDB has {endpoint.mongodb_auth_type} as the authentication mechanism."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: dms_endpoint_neptune_iam_authorization_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/dms/dms_endpoint_neptune_iam_authorization_enabled/dms_endpoint_neptune_iam_authorization_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "dms_endpoint_neptune_iam_authorization_enabled",
  "CheckTitle": "DMS endpoint for Neptune has IAM authorization enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Effects/Data Exposure"
  ],
  "ServiceName": "dms",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsDmsEndpoint",
  "Description": "**DMS Neptune endpoints** have **IAM authorization** enabled via the endpoint setting `IamAuthEnabled`.",
  "Risk": "Without **IAM authorization**, migration components can interact with Neptune using broad trust, enabling unauthorized data loads, reads, or alterations.\n\nThis degrades **confidentiality** and **integrity** and increases the chance of privilege abuse and data exfiltration.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.Neptune.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/dms-controls.html#dms-10"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws dms modify-endpoint --endpoint-arn <endpoint-arn> --neptune-settings '{\"IamAuthEnabled\":true}'",
      "NativeIaC": "```yaml\n# CloudFormation: Enable IAM authorization on a DMS Neptune endpoint\nResources:\n  <example_resource_name>:\n    Type: AWS::DMS::Endpoint\n    Properties:\n      EndpointType: target\n      EngineName: neptune\n      NeptuneSettings:\n        ServiceAccessRoleArn: <example_resource_arn>\n        S3BucketName: <example_resource_name>\n        S3BucketFolder: <example_resource_name>\n        IamAuthEnabled: true  # Critical: enables IAM authorization for the Neptune endpoint\n```",
      "Other": "1. In the AWS Console, go to Database Migration Service > Endpoints\n2. Select the Neptune endpoint and click Modify\n3. Expand Endpoint settings (Neptune settings) and set IAM authorization to Enabled\n4. Ensure Service access role ARN is set, then click Save",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable **IAM authorization** on Neptune endpoints (`IamAuthEnabled=true`) and use a **least privilege** service role limited to minimal Neptune and S3 permissions.\n\nApply **defense in depth**: restrict network paths, separate duties for migration roles, and monitor access with logs and alerts.",
      "Url": "https://hub.prowler.com/check/dms_endpoint_neptune_iam_authorization_enabled"
    }
  },
  "Categories": [
    "identity-access"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: dms_endpoint_neptune_iam_authorization_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/dms/dms_endpoint_neptune_iam_authorization_enabled/dms_endpoint_neptune_iam_authorization_enabled.py

```python
from typing import List

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.dms.dms_client import dms_client


class dms_endpoint_neptune_iam_authorization_enabled(Check):
    """
    Check if AWS DMS Endpoints for Neptune have IAM authorization enabled.

    This class verifies whether each AWS DMS Endpoint configured for Neptune has IAM authorization enabled
    by checking the `NeptuneSettings.IamAuthEnabled` property in the endpoint's configuration.
    """

    def execute(self) -> List[Check_Report_AWS]:
        """
        Execute the DMS Neptune IAM authorization enabled check.

        Iterates over all DMS Endpoints and generates a report indicating whether
        each Neptune endpoint has IAM authorization enabled.

        Returns:
            List[Check_Report_AWS]: A list of report objects with the results of the check.
        """
        findings = []
        for endpoint in dms_client.endpoints.values():
            if endpoint.engine_name == "neptune":
                report = Check_Report_AWS(metadata=self.metadata(), resource=endpoint)
                report.status = "FAIL"
                report.status_extended = f"DMS Endpoint {endpoint.id} for Neptune databases does not have IAM authorization enabled."
                if endpoint.neptune_iam_auth_enabled:
                    report.status = "PASS"
                    report.status_extended = f"DMS Endpoint {endpoint.id} for Neptune databases has IAM authorization enabled."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
