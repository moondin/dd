---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 277
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 277 of 867)

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

---[FILE: ecs_task_definitions_no_environment_secrets.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ecs/ecs_task_definitions_no_environment_secrets/ecs_task_definitions_no_environment_secrets.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ecs_task_definitions_no_environment_secrets",
  "CheckTitle": "ECS task definition has no secrets in environment variables",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Sensitive Data Identifications/Passwords",
    "TTPs/Credential Access"
  ],
  "ServiceName": "ecs",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "AwsEcsTaskDefinition",
  "Description": "**ECS task definitions** are analyzed for **plaintext secrets** placed in container `environment` variables. It identifies values that resemble credentials (keys, tokens, passwords) within container definitions.",
  "Risk": "Exposed secrets in env vars undermine confidentiality via logs, task metadata, and introspection.\n\nWith container or read-only API access, attackers can reuse credentials to read databases, modify records (integrity), pivot to other services, and trigger outages or unauthorized costs (availability).",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\nResources:\n  <example_resource_name>:\n    Type: AWS::ECS::TaskDefinition\n    Properties:\n      Family: <example_resource_name>\n      ContainerDefinitions:\n        - Name: app\n          Image: <image>\n          Secrets:                      # Critical: use Secrets instead of plaintext env vars\n            - Name: DB_PASSWORD         # Critical: inject secret at runtime\n              ValueFrom: <secret_arn_or_parameter_arn>  # Critical: reference Secrets Manager/SSM parameter\n```",
      "Other": "1. In the AWS Console, go to ECS > Task Definitions and open your task definition\n2. Create a new revision\n3. For each container, remove any sensitive values from Environment variables\n4. Under Environment variables, add a new entry in the Secrets section with Name (e.g., DB_PASSWORD) and ValueFrom pointing to your Secrets Manager/SSM parameter\n5. Save to create the new revision\n6. If using a service, update the service to use the new task definition revision and deploy",
      "Terraform": "```hcl\nresource \"aws_ecs_task_definition\" \"<example_resource_name>\" {\n  family                = \"<example_resource_name>\"\n  # Critical: define container secrets instead of plaintext env vars\n  container_definitions = jsonencode([\n    {\n      name    = \"app\"\n      image   = \"<image>\"\n      secrets = [\n        { name = \"DB_PASSWORD\", valueFrom = \"<secret_arn_or_parameter_arn>\" } # Critical: inject secret at runtime\n      ]\n    }\n  ])\n}\n```"
    },
    "Recommendation": {
      "Text": "Store secrets in **AWS Secrets Manager** or **SSM Parameter Store** and inject them at runtime instead of plaintext env vars.\n\nApply **least privilege** via task roles, enable regular **rotation**, avoid logging secret values, and prefer **ephemeral credentials** for downstream services.",
      "Url": "https://hub.prowler.com/check/ecs_task_definitions_no_environment_secrets"
    }
  },
  "Categories": [
    "secrets"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: ecs_task_definitions_no_environment_secrets.py]---
Location: prowler-master/prowler/providers/aws/services/ecs/ecs_task_definitions_no_environment_secrets/ecs_task_definitions_no_environment_secrets.py

```python
from json import dumps

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.lib.utils.utils import detect_secrets_scan
from prowler.providers.aws.services.ecs.ecs_client import ecs_client


class ecs_task_definitions_no_environment_secrets(Check):
    def execute(self):
        findings = []
        secrets_ignore_patterns = ecs_client.audit_config.get(
            "secrets_ignore_patterns", []
        )
        for task_definition in ecs_client.task_definitions.values():
            report = Check_Report_AWS(
                metadata=self.metadata(), resource=task_definition
            )
            report.resource_id = f"{task_definition.name}:{task_definition.revision}"
            report.status = "PASS"
            extended_status_parts = []

            for container in task_definition.container_definitions:
                container_secrets_found = []

                if container.environment:
                    dump_env_vars = {}
                    original_env_vars = []
                    for env_var in container.environment:
                        dump_env_vars.update({env_var.name: env_var.value})
                        original_env_vars.append(env_var.name)

                    env_data = dumps(dump_env_vars, indent=2)
                    detect_secrets_output = detect_secrets_scan(
                        data=env_data,
                        excluded_secrets=secrets_ignore_patterns,
                        detect_secrets_plugins=ecs_client.audit_config.get(
                            "detect_secrets_plugins",
                        ),
                    )
                    if detect_secrets_output:
                        secrets_string = ", ".join(
                            [
                                f"{secret['type']} on the environment variable {original_env_vars[secret['line_number'] - 2]}"
                                for secret in detect_secrets_output
                            ]
                        )
                        container_secrets_found.append(
                            f"Secrets in container {container.name} -> {secrets_string}"
                        )
                if container_secrets_found:
                    report.status = "FAIL"
                    extended_status_parts.extend(container_secrets_found)
            if report.status == "FAIL":
                report.status_extended = (
                    f"Potential secrets found in ECS task definition {task_definition.name} with revision {task_definition.revision}: "
                    + "; ".join(extended_status_parts)
                    + "."
                )
            else:
                report.status_extended = f"No secrets found in variables of ECS task definition {task_definition.name} with revision {task_definition.revision}."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ecs_task_definitions_no_privileged_containers.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ecs/ecs_task_definitions_no_privileged_containers/ecs_task_definitions_no_privileged_containers.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ecs_task_definitions_no_privileged_containers",
  "CheckTitle": "ECS task definition has no privileged containers",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS Host Hardening Benchmarks",
    "TTPs/Privilege Escalation"
  ],
  "ServiceName": "ecs",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsEcsTaskDefinition",
  "Description": "**Amazon ECS task definitions** are evaluated for containers configured with **privileged mode** (`privileged: true`).\n\nThe outcome indicates whether any container definition enables this setting.",
  "Risk": "**Privileged containers** can act with host-level root, breaking isolation. A foothold lets attackers achieve **container escape**, mount host devices, read secrets, alter configs, and control other workloads-impacting confidentiality, integrity, and availability via data theft, tampering, and service disruption.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/config/latest/developerguide/ecs-containers-nonprivileged.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/ecs-controls.html#ecs-4",
    "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html#container_definition_security"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws ecs deregister-task-definition --task-definition <task-family>:<revision>",
      "NativeIaC": "```yaml\n# CloudFormation: ECS task definition with non-privileged container\nResources:\n  <example_resource_name>:\n    Type: AWS::ECS::TaskDefinition\n    Properties:\n      Family: <example_resource_name>\n      ContainerDefinitions:\n        - Name: <example_resource_name>\n          Image: <image>\n          Privileged: false  # Critical: ensures container is non-privileged to pass the check\n```",
      "Other": "1. Open the Amazon ECS console and go to Task definitions\n2. Select the failing task definition family and open the failing revision\n3. Click Create new revision\n4. Edit the affected container and uncheck Privileged (set it to false)\n5. Click Create to register the new revision",
      "Terraform": "```hcl\n# ECS task definition with non-privileged container\nresource \"aws_ecs_task_definition\" \"<example_resource_name>\" {\n  family                = \"<example_resource_name>\"\n  container_definitions = jsonencode([\n    {\n      name       = \"<example_resource_name>\"\n      image      = \"<image>\"\n      privileged = false # Critical: ensures container is non-privileged to pass the check\n    }\n  ])\n}\n```"
    },
    "Recommendation": {
      "Text": "Run containers without elevated rights (`privileged: false`) and as non-root (`user`). Apply **least privilege**:\n- Grant only required Linux capabilities via `capDrop`/`capAdd`\n- Prefer `readonlyRootFilesystem: true`\n- Isolate networks and separate duties\n- Monitor with logging to support defense in depth",
      "Url": "https://hub.prowler.com/check/ecs_task_definitions_no_privileged_containers"
    }
  },
  "Categories": [
    "container-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: ecs_task_definitions_no_privileged_containers.py]---
Location: prowler-master/prowler/providers/aws/services/ecs/ecs_task_definitions_no_privileged_containers/ecs_task_definitions_no_privileged_containers.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ecs.ecs_client import ecs_client


class ecs_task_definitions_no_privileged_containers(Check):
    def execute(self):
        findings = []
        for task_definition in ecs_client.task_definitions.values():
            report = Check_Report_AWS(
                metadata=self.metadata(), resource=task_definition
            )
            report.resource_id = f"{task_definition.name}:{task_definition.revision}"
            report.status = "PASS"
            report.status_extended = f"ECS task definition {task_definition.name} with revision {task_definition.revision} does not have privileged containers."
            failed_containers = []
            for container in task_definition.container_definitions:
                if container.privileged:
                    report.status = "FAIL"
                    failed_containers.append(container.name)

            if failed_containers:
                report.status_extended = f"ECS task definition {task_definition.name} with revision {task_definition.revision} has privileged containers: {', '.join(failed_containers)}"
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: ecs_task_set_no_assign_public_ip.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ecs/ecs_task_set_no_assign_public_ip/ecs_task_set_no_assign_public_ip.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ecs_task_set_no_assign_public_ip",
  "CheckTitle": "ECS task set does not automatically assign a public IP address",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Effects/Data Exposure"
  ],
  "ServiceName": "ecs",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsEcsService",
  "Description": "**ECS task sets** are assessed for **automatic public IP assignment** via `AssignPublicIP`. When set to `ENABLED`, tasks are given public addresses in their network configuration.",
  "Risk": "Public IPs make tasks directly reachable from the Internet, enabling scanning, brute force, and exploit attempts.\n\nImpacts: **confidentiality** (data exposure), **integrity** (unauthorized actions), **availability** (DoS). Attackers can bypass internal controls and pivot for lateral movement.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/update-task-definition-console-v2.html",
    "https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_TaskSet.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/ecs-controls.html#ecs-16"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation to ensure ECS Task Set does not auto-assign public IP\nResources:\n  <example_resource_name>:\n    Type: AWS::ECS::TaskSet\n    Properties:\n      Cluster: \"<example_resource_id>\"\n      Service: \"<example_resource_id>\"\n      TaskDefinition: \"<example_resource_id>\"\n      NetworkConfiguration:\n        AwsvpcConfiguration:\n          AssignPublicIp: DISABLED  # CRITICAL: disables automatic public IP assignment\n          Subnets:\n            - \"<example_resource_id>\"\n```",
      "Other": "1. In the AWS Console, go to ECS > Clusters > select your cluster\n2. Open your Service and choose Update (or Edit)\n3. In Networking, set Public IP assignment to Disabled\n4. Save/Deploy the update to create a new deployment/task set\n5. After the new task set is Primary and stable, delete the old task set that had Public IP enabled",
      "Terraform": "```hcl\n# ECS Task Set with public IP assignment disabled\nresource \"aws_ecs_task_set\" \"<example_resource_name>\" {\n  cluster         = \"<example_resource_id>\"\n  service         = \"<example_resource_id>\"\n  task_definition = \"<example_resource_id>\"\n\n  network_configuration {\n    subnets          = [\"<example_resource_id>\"]\n    assign_public_ip = false  # CRITICAL: disables automatic public IP assignment\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Disable **automatic public IPs** on task sets.\n\nUse private subnets behind controlled entry points (load balancers, API gateways, or service discovery). Enforce **least privilege** security groups and **defense in depth**. Prefer private connectivity (VPC endpoints/VPN). *Expose only frontends, not tasks.*",
      "Url": "https://hub.prowler.com/check/ecs_task_set_no_assign_public_ip"
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

---[FILE: ecs_task_set_no_assign_public_ip.py]---
Location: prowler-master/prowler/providers/aws/services/ecs/ecs_task_set_no_assign_public_ip/ecs_task_set_no_assign_public_ip.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ecs.ecs_client import ecs_client


class ecs_task_set_no_assign_public_ip(Check):
    def execute(self):
        findings = []
        for task_set in ecs_client.task_sets.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=task_set)
            report.status = "PASS"
            report.status_extended = f"ECS Task Set {task_set.id} does not have automatic public IP assignment."

            if task_set.assign_public_ip == "ENABLED":
                report.status = "FAIL"
                report.status_extended = (
                    f"ECS Task Set {task_set.id} has automatic public IP assignment."
                )

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: efs_client.py]---
Location: prowler-master/prowler/providers/aws/services/efs/efs_client.py

```python
from prowler.providers.aws.services.efs.efs_service import EFS
from prowler.providers.common.provider import Provider

efs_client = EFS(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: efs_service.py]---
Location: prowler-master/prowler/providers/aws/services/efs/efs_service.py
Signals: Pydantic

```python
import json
from typing import Optional

from botocore.client import ClientError
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class EFS(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.filesystems = {}
        self.__threading_call__(self._describe_file_systems)
        self.__threading_call__(
            self._describe_file_system_policies, self.filesystems.values()
        )
        self.__threading_call__(self._describe_mount_targets, self.filesystems.values())
        self.__threading_call__(self._describe_access_points, self.filesystems.values())

    def _describe_file_systems(self, regional_client):
        logger.info("EFS - Describing file systems...")
        try:
            describe_efs_paginator = regional_client.get_paginator(
                "describe_file_systems"
            )
            for page in describe_efs_paginator.paginate():
                for efs in page["FileSystems"]:
                    efs_id = efs["FileSystemId"]
                    efs_arn = f"arn:{self.audited_partition}:elasticfilesystem:{regional_client.region}:{self.audited_account}:file-system/{efs_id}"
                    if not self.audit_resources or (
                        is_resource_filtered(efs_arn, self.audit_resources)
                    ):
                        self.filesystems[efs_arn] = FileSystem(
                            id=efs_id,
                            arn=efs_arn,
                            region=regional_client.region,
                            availability_zone_id=efs.get("AvailabilityZoneId", ""),
                            number_of_mount_targets=efs["NumberOfMountTargets"],
                            encrypted=efs["Encrypted"],
                            tags=efs.get("Tags"),
                        )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_file_system_policies(self, filesystem):
        logger.info("EFS - Describing file system policies...")
        try:
            client = self.regional_clients[filesystem.region]
            try:
                filesystem.backup_policy = client.describe_backup_policy(
                    FileSystemId=filesystem.id
                )["BackupPolicy"]["Status"]
            except ClientError as error:
                if error.response["Error"]["Code"] == "PolicyNotFound":
                    filesystem.backup_policy = "DISABLED"
                    logger.warning(
                        f"{client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
                else:
                    logger.error(
                        f"{client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
            try:
                fs_policy = client.describe_file_system_policy(
                    FileSystemId=filesystem.id
                )
                if "Policy" in fs_policy:
                    filesystem.policy = json.loads(fs_policy["Policy"])
            except ClientError as error:
                if error.response["Error"]["Code"] == "PolicyNotFound":
                    filesystem.policy = {}
                    logger.warning(
                        f"{client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
                else:
                    logger.error(
                        f"{client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
        except Exception as error:
            logger.error(
                f"{client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_mount_targets(self, filesystem):
        logger.info("EFS - Describing mount targets...")
        try:
            client = self.regional_clients[filesystem.region]
            describe_mount_target_paginator = client.get_paginator(
                "describe_mount_targets"
            )
            for page in describe_mount_target_paginator.paginate(
                FileSystemId=filesystem.id
            ):
                for mount_target in page["MountTargets"]:
                    mount_target_id = mount_target["MountTargetId"]
                    mount_target_arn = f"arn:{self.audited_partition}:elasticfilesystem:{client.region}:{self.audited_account}:mount-target/{mount_target_id}"
                    if not self.audit_resources or (
                        is_resource_filtered(mount_target_arn, self.audit_resources)
                    ):
                        self.filesystems[filesystem.arn].mount_targets.append(
                            MountTarget(
                                id=mount_target_id,
                                file_system_id=mount_target["FileSystemId"],
                                subnet_id=mount_target["SubnetId"],
                            )
                        )
        except Exception as error:
            logger.error(
                f"{client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_access_points(self, filesystem):
        logger.info("EFS - Describing access points...")
        try:
            client = self.regional_clients[filesystem.region]
            describe_access_point_paginator = client.get_paginator(
                "describe_access_points"
            )
            for page in describe_access_point_paginator.paginate(
                FileSystemId=filesystem.id
            ):
                for access_point in page["AccessPoints"]:
                    access_point_id = access_point["AccessPointId"]
                    access_point_arn = access_point["AccessPointArn"]
                    if not self.audit_resources or (
                        is_resource_filtered(access_point_arn, self.audit_resources)
                    ):
                        self.filesystems[filesystem.arn].access_points.append(
                            AccessPoint(
                                id=access_point_id,
                                file_system_id=access_point["FileSystemId"],
                                root_directory_path=access_point["RootDirectory"][
                                    "Path"
                                ],
                                posix_user=access_point.get("PosixUser", {}),
                            )
                        )
        except Exception as error:
            logger.error(
                f"{client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class MountTarget(BaseModel):
    id: str
    file_system_id: str
    subnet_id: str


class AccessPoint(BaseModel):
    id: str
    file_system_id: str
    root_directory_path: str
    posix_user: dict = {}


class FileSystem(BaseModel):
    id: str
    arn: str
    region: str
    policy: Optional[dict]
    backup_policy: Optional[str] = "DISABLED"
    encrypted: bool
    availability_zone_id: Optional[str]
    number_of_mount_targets: int
    mount_targets: list[MountTarget] = []
    access_points: list[AccessPoint] = []
    tags: Optional[list] = []
```

--------------------------------------------------------------------------------

---[FILE: efs_access_point_enforce_root_directory.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/efs/efs_access_point_enforce_root_directory/efs_access_point_enforce_root_directory.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "efs_access_point_enforce_root_directory",
  "CheckTitle": "EFS file system has no access points allowing access to the root directory",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Effects/Data Exposure"
  ],
  "ServiceName": "efs",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsEfsAccessPoint",
  "Description": "**Amazon EFS access points** are evaluated to ensure they enforce a non-root directory. The check identifies access points whose configured root directory `Path` is `/`, meaning clients would mount the file system's root instead of a scoped subdirectory.",
  "Risk": "Exposing the file system root via an access point undermines **confidentiality** and **integrity** by allowing traversal beyond intended datasets. Attackers or misconfigured apps could:\n- Read sensitive directories\n- Modify or delete shared data\n- Pivot across tenants, impacting **availability**",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/efs/latest/ug/enforce-root-directory-access-point.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/efs-controls.html#efs-3"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws efs delete-access-point --access-point-id <access-point-id>",
      "NativeIaC": "```yaml\n# CloudFormation: EFS access point enforcing a non-root directory\nResources:\n  <example_resource_name>:\n    Type: AWS::EFS::AccessPoint\n    Properties:\n      FileSystemId: <example_resource_id>\n      RootDirectory:\n        Path: /data  # Critical: set to a non-root path to avoid \"/\" and pass the check\n        # This enforces the access point root to /data instead of the file system root\n```",
      "Other": "1. In the AWS Console, go to EFS > Access points\n2. Select the access point showing Root directory as /\n3. Click Delete and confirm\n4. Click Create access point\n5. Select the file system and set Root directory Path to a non-root path (for example, /data)\n6. Click Create access point",
      "Terraform": "```hcl\n# Terraform: EFS access point enforcing a non-root directory\nresource \"aws_efs_access_point\" \"<example_resource_name>\" {\n  file_system_id = \"<example_resource_id>\"\n\n  root_directory {\n    path = \"/data\"  # Critical: not \"/\"; enforces a subdirectory as root to pass the check\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Apply **least privilege**: set each access point `Path` to a dedicated subdirectory and avoid `/`.\n- Use per-application access points\n- Enforce POSIX identity and directory permissions\n- Layer controls (network segmentation, monitoring) for **defense in depth**",
      "Url": "https://hub.prowler.com/check/efs_access_point_enforce_root_directory"
    }
  },
  "Categories": [
    "vulnerabilities"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: efs_access_point_enforce_root_directory.py]---
Location: prowler-master/prowler/providers/aws/services/efs/efs_access_point_enforce_root_directory/efs_access_point_enforce_root_directory.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.efs.efs_client import efs_client


class efs_access_point_enforce_root_directory(Check):
    def execute(self):
        findings = []
        for fs in efs_client.filesystems.values():
            if fs.access_points:
                report = Check_Report_AWS(metadata=self.metadata(), resource=fs)
                report.status = "PASS"
                report.status_extended = f"EFS {fs.id} does not have any access point allowing access to the root directory."
                access_points = []
                for access_point in fs.access_points:
                    if access_point.root_directory_path == "/":
                        access_points.append(access_point)
                if access_points:
                    report.status = "FAIL"
                    report.status_extended = f"EFS {fs.id} has access points which allow access to the root directory: {', '.join([ap.id for ap in access_points])}."
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: efs_access_point_enforce_user_identity.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/efs/efs_access_point_enforce_user_identity/efs_access_point_enforce_user_identity.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "efs_access_point_enforce_user_identity",
  "CheckTitle": "EFS file system has all access points with a defined POSIX user",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Effects/Data Exposure",
    "TTPs/Privilege Escalation"
  ],
  "ServiceName": "efs",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsEfsAccessPoint",
  "Description": "**Amazon EFS access points** are evaluated for a defined **POSIX user** (`uid`, `gid`, optional secondary groups). The check inspects each access point on a file system and flags those without a configured POSIX user identity.",
  "Risk": "Without enforced **POSIX identity**, NFS clients can supply arbitrary UIDs/GIDs, enabling impersonation, unauthorized reads/writes, and ownership spoofing. This undermines **confidentiality** and **integrity** of shared data and can enable **lateral movement** across applications sharing the file system.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/efs/latest/ug/efs-access-points.html",
    "https://repost.aws/knowledge-center/efs-access-points-directory-access",
    "https://www.plerion.com/cloud-knowledge-base/efs-access-points-should-be-configured-to-enforce-a-user-identity",
    "https://docs.aws.amazon.com/efs/latest/ug/enforce-identity-access-points.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/efs-controls.html#efs-4"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\nResources:\n  ExampleAccessPoint:\n    Type: AWS::EFS::AccessPoint\n    Properties:\n      FileSystemId: \"<example_resource_id>\"\n      PosixUser:               # Critical: enforces a POSIX user for all requests via this access point\n        Uid: \"<uid>\"          # Critical: POSIX user ID enforced\n        Gid: \"<gid>\"          # Critical: POSIX group ID enforced\n```",
      "Other": "1. In the AWS Console, go to Amazon EFS > Access points\n2. Click Create access point, select the file system, and set POSIX user: enter User ID and Group ID\n3. Click Create access point\n4. Update clients to mount using the new access point ID\n5. Delete the old access point(s) that lack a POSIX user",
      "Terraform": "```hcl\nresource \"aws_efs_access_point\" \"example\" {\n  file_system_id = \"<example_resource_id>\"\n\n  # Critical: enforces a POSIX user for all requests via this access point\n  posix_user {\n    uid = 1000  # Critical: user ID enforced\n    gid = 1000  # Critical: group ID enforced\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enforce a **POSIX user identity** on every access point using least-privilege `uid`/`gid` (avoid `0`). Apply **separation of duties** with dedicated access points per application and minimal groups. Use **IAM** to require access point usage and add **defense in depth** by enforcing a restricted root directory.",
      "Url": "https://hub.prowler.com/check/efs_access_point_enforce_user_identity"
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

---[FILE: efs_access_point_enforce_user_identity.py]---
Location: prowler-master/prowler/providers/aws/services/efs/efs_access_point_enforce_user_identity/efs_access_point_enforce_user_identity.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.efs.efs_client import efs_client


class efs_access_point_enforce_user_identity(Check):
    def execute(self):
        findings = []
        for fs in efs_client.filesystems.values():
            if fs.access_points:
                report = Check_Report_AWS(metadata=self.metadata(), resource=fs)
                report.status = "PASS"
                report.status_extended = (
                    f"EFS {fs.id} has all access points with defined POSIX user."
                )

                access_points = []
                for access_point in fs.access_points:
                    if not access_point.posix_user:
                        access_points.append(access_point)
                if access_points:
                    report.status = "FAIL"
                    report.status_extended = f"EFS {fs.id} has access points with no POSIX user: {', '.join([ap.id for ap in access_points])}."
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: efs_encryption_at_rest_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/efs/efs_encryption_at_rest_enabled/efs_encryption_at_rest_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "efs_encryption_at_rest_enabled",
  "CheckTitle": "EFS file system has encryption at rest enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls (USA)",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST CSF Controls (USA)",
    "Software and Configuration Checks/Industry and Regulatory Standards/PCI-DSS",
    "Software and Configuration Checks/Industry and Regulatory Standards/HIPAA Controls (USA)",
    "Software and Configuration Checks/Industry and Regulatory Standards/ISO 27001 Controls",
    "Effects/Data Exposure"
  ],
  "ServiceName": "efs",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsEfsFileSystem",
  "Description": "**Amazon EFS file system** has **encryption at rest** enabled using AWS KMS to protect file data and metadata stored on the service",
  "Risk": "Without encryption at rest, EFS contents can be read from storage media, backups, or compromised hosts, eroding **confidentiality** and enabling offline exfiltration. Privileged compromise also allows covert data harvesting or manipulation, threatening **integrity** of files.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://repost.aws/knowledge-center/efs-turn-on-encryption-at-rest",
    "https://docs.aws.amazon.com/efs/latest/ug/EFSKMS.html",
    "https://docs.aws.amazon.com/efs/latest/ug/encryption-at-rest.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: Create an EFS file system with encryption at rest enabled\nResources:\n  <example_resource_name>:\n    Type: AWS::EFS::FileSystem\n    Properties:\n      Encrypted: true  # Critical: enables encryption at rest so the check passes\n```",
      "Other": "1. In the AWS Console, go to Amazon EFS\n2. Click Create file system\n3. Check Enable encryption (leave default key or choose a KMS key if required)\n4. Click Create\n5. Migrate data from the unencrypted file system to the new encrypted one\n6. Delete the unencrypted file system to clear the failing finding",
      "Terraform": "```hcl\n# Terraform: Create an EFS file system with encryption at rest enabled\nresource \"aws_efs_file_system\" \"<example_resource_name>\" {\n  encrypted = true  # Critical: enables encryption at rest so the check passes\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **encryption at rest** for all EFS file systems and prefer **customer-managed KMS keys** for control, rotation, and audit. Apply **least privilege** to key policies and separate key management duties. *For existing unencrypted data*, migrate to a new encrypted file system. Enforce creation policies (IAM/SCP) to prevent non-encrypted deployments.",
      "Url": "https://hub.prowler.com/check/efs_encryption_at_rest_enabled"
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

---[FILE: efs_encryption_at_rest_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/efs/efs_encryption_at_rest_enabled/efs_encryption_at_rest_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.efs.efs_client import efs_client


class efs_encryption_at_rest_enabled(Check):
    def execute(self):
        findings = []
        for fs in efs_client.filesystems.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=fs)
            report.status = "FAIL"
            report.status_extended = (
                f"EFS {fs.id} does not have encryption at rest enabled."
            )
            if fs.encrypted:
                report.status = "PASS"
                report.status_extended = f"EFS {fs.id} has encryption at rest enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
