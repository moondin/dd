---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 276
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 276 of 867)

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

---[FILE: ecs_service_fargate_latest_platform_version.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ecs/ecs_service_fargate_latest_platform_version/ecs_service_fargate_latest_platform_version.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ecs_service_fargate_latest_platform_version",
  "CheckTitle": "ECS Fargate service uses the latest Fargate platform version",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "ecs",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsEcsService",
  "Description": "**ECS Fargate services** use the **latest Fargate platform version** via `platformVersion`=`LATEST` or an explicit value matching the current release for their `platformFamily` (Linux/Windows).",
  "Risk": "Running on an outdated platform leaves known CVEs in the kernel/runtime unpatched, risking:\n- **Confidentiality**: data exposure via container escape\n- **Integrity**: privilege escalation and tampering\n- **Availability**: crashes/DoS and instability under load",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://servian.dev/setting-up-fargate-for-ecs-exec-8f5cc8d7d80e",
    "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/platform-fargate.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/ECS/platform-version.html",
    "https://docs.aws.amazon.com/config/latest/developerguide/ecs-fargate-latest-platform-version.html",
    "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/ecs-controls.html#ecs-10"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws ecs update-service --cluster <cluster-name> --service <service-name> --platform-version LATEST",
      "NativeIaC": "```yaml\n# CloudFormation: set ECS Fargate service to latest platform version\nResources:\n  <example_resource_name>:\n    Type: AWS::ECS::Service\n    Properties:\n      Cluster: <example_resource_id>\n      TaskDefinition: <example_resource_name>\n      LaunchType: FARGATE\n      PlatformVersion: LATEST  # Critical: use the latest Fargate platform version\n      NetworkConfiguration:\n        AwsvpcConfiguration:\n          Subnets:\n            - <example_resource_id>\n```",
      "Other": "1. In the AWS Console, go to Amazon ECS\n2. Open your cluster and select the service\n3. Click Update\n4. Set Platform version to LATEST\n5. Click Update service (or Deploy) to apply",
      "Terraform": "```hcl\n# ECS Fargate service using the latest platform version\nresource \"aws_ecs_service\" \"<example_resource_name>\" {\n  name            = \"<example_resource_name>\"\n  cluster         = \"<example_resource_id>\"\n  task_definition = \"<example_resource_name>\"\n  launch_type     = \"FARGATE\"\n  platform_version = \"LATEST\" # Critical: ensures the latest Fargate platform version\n\n  network_configuration {\n    subnets = [\"<example_resource_id>\"]\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "- Prefer `platformVersion` `LATEST` to receive patches.\n- If pinning, monitor releases and redeploy quickly to the current version.\n- Automate updates with staged rollouts in CI/CD.\n- Apply **defense in depth** and **least privilege** to limit runtime exploit impact.",
      "Url": "https://hub.prowler.com/check/ecs_service_fargate_latest_platform_version"
    }
  },
  "Categories": [
    "vulnerabilities",
    "container-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: ecs_service_fargate_latest_platform_version.py]---
Location: prowler-master/prowler/providers/aws/services/ecs/ecs_service_fargate_latest_platform_version/ecs_service_fargate_latest_platform_version.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ecs.ecs_client import ecs_client


class ecs_service_fargate_latest_platform_version(Check):
    def execute(self):
        findings = []
        for service in ecs_client.services.values():
            if service.launch_type == "FARGATE":
                report = Check_Report_AWS(metadata=self.metadata(), resource=service)
                fargate_latest_linux_version = ecs_client.audit_config.get(
                    "fargate_linux_latest_version", "1.4.0"
                )
                fargate_latest_windows_version = ecs_client.audit_config.get(
                    "fargate_windows_latest_version", "1.0.0"
                )
                report.status = "PASS"
                report.status_extended = f"ECS Service {service.name} is using latest FARGATE {service.platform_family} version {fargate_latest_linux_version if service.platform_family == 'Linux' else fargate_latest_windows_version}."
                if (
                    service.platform_version != "LATEST"
                    and (
                        service.platform_family == "Linux"
                        and service.platform_version != fargate_latest_linux_version
                    )
                    or (
                        service.platform_family == "Windows"
                        and service.platform_version != fargate_latest_windows_version
                    )
                ):
                    report.status = "FAIL"
                    report.status_extended = f"ECS Service {service.name} is not using latest FARGATE {service.platform_family} version {fargate_latest_linux_version if service.platform_family == 'Linux' else fargate_latest_windows_version}, currently using {service.platform_version}."

                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: ecs_service_no_assign_public_ip.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ecs/ecs_service_no_assign_public_ip/ecs_service_no_assign_public_ip.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ecs_service_no_assign_public_ip",
  "CheckTitle": "ECS service does not have automatic public IP assignment",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability"
  ],
  "ServiceName": "ecs",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsEcsService",
  "Description": "**ECS services** are assessed for automatic public IP assignment via the `assignPublicIp` setting in their network configuration.\n\nThe finding indicates whether tasks launched by the service receive a public IP or are limited to private addressing.",
  "Risk": "Automatic **public IPs** make tasks directly reachable from the Internet, enabling:\n- Port scanning and remote exploitation\n- Brute-force against admin endpoints\n- Data exfiltration via exposed APIs\nThis jeopardizes **confidentiality**, **integrity**, and **availability**, and can facilitate lateral movement within the VPC.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/ecs-controls.html#ecs-2",
    "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/security.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/ecs-controls.html",
    "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws ecs update-service --cluster <cluster-name> --service <service-name> --network-configuration \"awsvpcConfiguration={subnets=[<subnet-id>],assignPublicIp=DISABLED}\"",
      "NativeIaC": "```yaml\nResources:\n  <example_resource_name>:\n    Type: AWS::ECS::Service\n    Properties:\n      Cluster: <example_resource_id>\n      TaskDefinition: <example_resource_id>\n      NetworkConfiguration:\n        AwsvpcConfiguration:\n          Subnets:\n            - <example_resource_id>\n          AssignPublicIp: DISABLED  # Critical: disables automatic public IP assignment for the service\n```",
      "Other": "1. In the AWS Console, go to ECS > Clusters and open your cluster\n2. Select the service and click Update\n3. Under Networking (awsvpc), set Assign public IP to Disabled\n4. Click Update service to apply",
      "Terraform": "```hcl\nresource \"aws_ecs_service\" \"<example_resource_name>\" {\n  name           = \"<example_resource_name>\"\n  cluster        = \"<example_resource_id>\"\n  task_definition = \"<example_resource_id>\"\n\n  network_configuration {\n    subnets          = [\"<example_resource_id>\"]\n    assign_public_ip = false  # Critical: disables automatic public IP assignment\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Disable `assignPublicIp` to keep tasks private. Expose services through **load balancers** or **private endpoints**, restrict ingress with **least-privilege** security groups, and route egress via **NAT**. Apply **defense in depth** (WAF, TLS, monitoring) and segment networks to minimize blast radius.",
      "Url": "https://hub.prowler.com/check/ecs_service_no_assign_public_ip"
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

---[FILE: ecs_service_no_assign_public_ip.py]---
Location: prowler-master/prowler/providers/aws/services/ecs/ecs_service_no_assign_public_ip/ecs_service_no_assign_public_ip.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ecs.ecs_client import ecs_client


class ecs_service_no_assign_public_ip(Check):
    def execute(self):
        findings = []
        for service in ecs_client.services.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=service)
            report.status = "PASS"
            report.status_extended = f"ECS Service {service.name} does not have automatic public IP assignment."

            if service.assign_public_ip:
                report.status = "FAIL"
                report.status_extended = (
                    f"ECS Service {service.name} has automatic public IP assignment."
                )

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: ecs_task_definitions_containers_readonly_access.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ecs/ecs_task_definitions_containers_readonly_access/ecs_task_definitions_containers_readonly_access.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ecs_task_definitions_containers_readonly_access",
  "CheckTitle": "ECS task definition has all containers with read-only root filesystems",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS Host Hardening Benchmarks"
  ],
  "ServiceName": "ecs",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsEcsTaskDefinition",
  "Description": "Amazon ECS task definitions specify whether container root filesystems are **read-only** via `readonlyRootFilesystem`. Containers where this setting is absent or set to `false` effectively have write access to the root filesystem.",
  "Risk": "A **writable root filesystem** enables runtime tampering and persistence. Attackers can modify binaries or configs, drop implants, or delete critical files, degrading **integrity** and **availability**. Access to writable paths can also expose secrets and logs, eroding **confidentiality** and complicating incident response.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/config/latest/developerguide/ecs-containers-readonly-access.html",
    "https://docs.aws.amazon.com/AmazonECS/latest/userguide/task_definition_parameters.html#container_definition_readonly",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/ecs-controls.html#ecs-5"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws ecs register-task-definition --family <task-family> --container-definitions '[{\"name\":\"<container-name>\",\"image\":\"<image>\",\"readonlyRootFilesystem\":true}]'",
      "NativeIaC": "```yaml\n# CloudFormation: ECS task definition with read-only root filesystem\nResources:\n  <example_resource_name>:\n    Type: AWS::ECS::TaskDefinition\n    Properties:\n      Family: <example_resource_name>\n      ContainerDefinitions:\n        - Name: <example_resource_name>\n          Image: <image>\n          ReadonlyRootFilesystem: true  # Critical: enforces read-only root FS for the container\n```",
      "Other": "1. In the AWS Console, go to Amazon ECS > Task Definitions\n2. Select the task family <task-family> and click Create new revision\n3. For each container, edit and enable Read-only root filesystem (readonlyRootFilesystem = true)\n4. Click Create to register the new revision\n5. (If needed) Update services to use the new revision",
      "Terraform": "```hcl\n# ECS task definition with read-only root filesystem\nresource \"aws_ecs_task_definition\" \"<example_resource_name>\" {\n  family                = \"<example_resource_name>\"\n  container_definitions = jsonencode([\n    {\n      name                   = \"<example_resource_name>\"\n      image                  = \"<image>\"\n      readonlyRootFilesystem = true  # Critical: enforces read-only root FS for the container\n    }\n  ])\n}\n```"
    },
    "Recommendation": {
      "Text": "Enforce `readonlyRootFilesystem: true` for containers.\n- Grant write access only via specific volumes required by the app\n- Apply **least privilege** and **defense in depth**: run as non-root, drop unnecessary capabilities, and keep images immutable so runtime writes aren't needed",
      "Url": "https://hub.prowler.com/check/ecs_task_definitions_containers_readonly_access"
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

---[FILE: ecs_task_definitions_containers_readonly_access.py]---
Location: prowler-master/prowler/providers/aws/services/ecs/ecs_task_definitions_containers_readonly_access/ecs_task_definitions_containers_readonly_access.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ecs.ecs_client import ecs_client


class ecs_task_definitions_containers_readonly_access(Check):
    def execute(self):
        findings = []
        for task_definition in ecs_client.task_definitions.values():
            report = Check_Report_AWS(
                metadata=self.metadata(), resource=task_definition
            )
            report.resource_id = f"{task_definition.name}:{task_definition.revision}"
            report.status = "PASS"
            report.status_extended = f"ECS task definition {task_definition.name} with revision {task_definition.revision} does not have containers with write access to the root filesystems."

            failed_containers = []
            for container in task_definition.container_definitions:
                if not container.readonly_rootfilesystem:
                    report.status = "FAIL"
                    failed_containers.append(container.name)

            if failed_containers:
                report.status_extended = f"ECS task definition {task_definition.name} with revision {task_definition.revision} has containers with write access to the root filesystem: {', '.join(failed_containers)}"
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ecs_task_definitions_host_namespace_not_shared.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ecs/ecs_task_definitions_host_namespace_not_shared/ecs_task_definitions_host_namespace_not_shared.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ecs_task_definitions_host_namespace_not_shared",
  "CheckTitle": "ECS task definition does not share the host's process namespace with its containers",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS Host Hardening Benchmarks",
    "TTPs/Privilege Escalation",
    "TTPs/Discovery"
  ],
  "ServiceName": "ecs",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsEcsTaskDefinition",
  "Description": "**ECS task definitions** where `pidMode` is `host` are configured to share the host's **process namespace** with containers, rather than using isolated task or private namespaces.",
  "Risk": "**Host PID sharing** lets containers view and interact with host processes, eroding isolation.\n- Confidentiality: process enumeration and metadata leakage\n- Integrity/Availability: signal or `ptrace` tampering, killing services\n\nEnables lateral movement and privilege escalation from a compromised container.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/ecs-controls.html#ecs-3",
    "https://docs.aws.amazon.com/config/latest/developerguide/ecs-task-definition-pid-mode-check.html",
    "https://docs.aws.amazon.com/AmazonECS/latest/userguide/task_definition_parameters.html#container_definition_pid_mode"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws ecs register-task-definition --family <example_resource_name> --pid-mode task --container-definitions '[{\"name\":\"<container-name>\",\"image\":\"<image>\"}]'",
      "NativeIaC": "```yaml\n# CloudFormation: ECS Task Definition without host PID namespace\nResources:\n  <example_resource_name>:\n    Type: AWS::ECS::TaskDefinition\n    Properties:\n      Family: <example_resource_name>\n      ContainerDefinitions:\n        - Name: <container-name>\n          Image: <image>\n      PidMode: task  # Critical: ensures containers use task PID namespace, not host\n```",
      "Other": "1. In the AWS Console, go to Amazon ECS > Task Definitions\n2. Select the task definition and click Create new revision\n3. Set Process namespace sharing (PID mode) to Task (not Host)\n4. Save the new revision\n5. (If the previous Host PID revision remains active) Select that revision and click Deregister",
      "Terraform": "```hcl\n# ECS Task Definition without host PID namespace\nresource \"aws_ecs_task_definition\" \"example\" {\n  family                = \"<example_resource_name>\"\n  container_definitions = jsonencode([{ name = \"<container-name>\", image = \"<image>\" }])\n  pid_mode              = \"task\"  # Critical: prevents sharing the host's process namespace\n}\n```"
    },
    "Recommendation": {
      "Text": "Prefer **isolated PID namespaces**: set `pidMode=task` or use the default per-container namespace. Avoid `host` PID sharing except for tightly controlled diagnostics.\n\nApply **least privilege**: non-root users, minimal capabilities, read-only filesystems; and **defense in depth** with network and runtime controls.",
      "Url": "https://hub.prowler.com/check/ecs_task_definitions_host_namespace_not_shared"
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

---[FILE: ecs_task_definitions_host_namespace_not_shared.py]---
Location: prowler-master/prowler/providers/aws/services/ecs/ecs_task_definitions_host_namespace_not_shared/ecs_task_definitions_host_namespace_not_shared.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ecs.ecs_client import ecs_client


class ecs_task_definitions_host_namespace_not_shared(Check):
    def execute(self):
        findings = []
        for task_definition in ecs_client.task_definitions.values():
            report = Check_Report_AWS(
                metadata=self.metadata(), resource=task_definition
            )
            report.resource_id = f"{task_definition.name}:{task_definition.revision}"
            report.status = "PASS"
            report.status_extended = f"ECS task definition {task_definition.name} with revision {task_definition.revision} does not share a host's process namespace with its containers."
            if task_definition.pid_mode == "host":
                report.status = "FAIL"
                report.status_extended = f"ECS task definition {task_definition.name} with revision {task_definition.revision} is configured to share a host's process namespace with its containers."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: ecs_task_definitions_host_networking_mode_users.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ecs/ecs_task_definitions_host_networking_mode_users/ecs_task_definitions_host_networking_mode_users.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ecs_task_definitions_host_networking_mode_users",
  "CheckTitle": "Amazon ECS task definition does not use host network mode, or non-privileged containers specify a non-root user",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Software and Configuration Checks/AWS Security Best Practices/Runtime Behavior Analysis",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS Host Hardening Benchmarks",
    "TTPs/Privilege Escalation",
    "TTPs/Lateral Movement"
  ],
  "ServiceName": "ecs",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsEcsTaskDefinition",
  "Description": "**Amazon ECS task definitions** in `host` network mode are assessed for containers where `privileged=false` and the container `user` is `root` or unset.",
  "Risk": "Sharing the host network lets containers reach host interfaces directly. Running as **root** (or with no user set) increases the chance to bind low ports, sniff traffic, or impersonate services, and makes kernel flaws more exploitable-enabling data exfiltration, tampering, and outages, impacting **confidentiality**, **integrity**, and **availability**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-networking.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/ecs-controls.html#ecs-6",
    "https://docs.aws.amazon.com/config/latest/developerguide/ecs-task-definition-user-for-host-mode-check.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/ecs-controls.html",
    "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/update-task-definition-console-v2.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: ECS task definition not using host network mode\nResources:\n  <example_resource_name>:\n    Type: AWS::ECS::TaskDefinition\n    Properties:\n      NetworkMode: awsvpc  # CRITICAL: avoids host mode to pass the check\n      ContainerDefinitions:\n        - Name: <example_resource_name>\n          Image: <image>\n```",
      "Other": "1. Open the Amazon ECS console and go to Task definitions\n2. Select the task definition and choose the latest revision\n3. Click Create new revision\n4. Set Network mode to awsvpc (not host)\n5. Save the revision and, if used by a service, update the service to this new revision\n6. If you must keep host mode: edit each non-privileged container and set User to a non-root value (e.g., 1000) and save a new revision",
      "Terraform": "```hcl\n# ECS task definition not using host network mode\nresource \"aws_ecs_task_definition\" \"<example_resource_name>\" {\n  family                = \"<example_resource_name>\"\n  network_mode          = \"awsvpc\"  # CRITICAL: avoids host mode to pass the check\n  container_definitions = jsonencode([\n    {\n      name  = \"<example_resource_name>\"\n      image = \"nginx\"\n    }\n  ])\n}\n```"
    },
    "Recommendation": {
      "Text": "Prefer **`awsvpc`** for isolation. If `host` is required, enforce **least privilege**:\n- Run as a non-root `user`\n- Avoid `privileged` unless strictly justified\n- Limit capabilities and exposed ports\n\nApply **defense in depth** with network segmentation and minimal IAM permissions.",
      "Url": "https://hub.prowler.com/check/ecs_task_definitions_host_networking_mode_users"
    }
  },
  "Categories": [
    "container-security",
    "trust-boundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: ecs_task_definitions_host_networking_mode_users.py]---
Location: prowler-master/prowler/providers/aws/services/ecs/ecs_task_definitions_host_networking_mode_users/ecs_task_definitions_host_networking_mode_users.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ecs.ecs_client import ecs_client


class ecs_task_definitions_host_networking_mode_users(Check):
    def execute(self):
        findings = []
        for task_definition in ecs_client.task_definitions.values():
            report = Check_Report_AWS(
                metadata=self.metadata(), resource=task_definition
            )
            report.resource_id = f"{task_definition.name}:{task_definition.revision}"
            report.status = "PASS"
            report.status_extended = f"ECS task definition {task_definition.name} with revision {task_definition.revision} does not have host network mode."
            failed_containers = []
            if task_definition.network_mode == "host":
                for container in task_definition.container_definitions:
                    if not container.privileged and (
                        container.user == "root" or container.user == ""
                    ):
                        report.status = "FAIL"
                        failed_containers.append(container.name)

                if failed_containers:
                    report.status_extended = f"ECS task definition {task_definition.name} with revision {task_definition.revision} has containers with host network mode and non-privileged containers running as root or with no user specified: {', '.join(failed_containers)}"
                else:
                    report.status_extended = f"ECS task definition {task_definition.name} with revision {task_definition.revision} has host network mode but no containers running as root or with no user specified."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: ecs_task_definitions_logging_block_mode.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ecs/ecs_task_definitions_logging_block_mode/ecs_task_definitions_logging_block_mode.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ecs_task_definitions_logging_block_mode",
  "CheckTitle": "ECS task definition has container logging in non-blocking mode",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Runtime Behavior Analysis",
    "Effects/Denial of Service"
  ],
  "ServiceName": "ecs",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "AwsEcsTaskDefinition",
  "Description": "**ECS task definition containers** use **non-blocking logging mode** via the `logConfiguration.mode` option on the latest active revision",
  "Risk": "**Blocking log mode** can stall writes to stdout/stderr, making containers unresponsive, failing health checks, and causing task restarts or startup failures if log groups/streams can't be created. This reduces **availability** and may trigger cascading instability across dependent services.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/config/latest/developerguide/ecs-task-definition-log-configuration.html",
    "https://www.amazonaws.cn/en/blog-selection/preventing-log-loss-with-non-blocking-mode-in-the-awslogs-container-log-driver/",
    "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_awslogs.html#specify-log-config"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws ecs register-task-definition --family <task-family> --container-definitions '[{\"name\":\"<container-name>\",\"image\":\"<image>\",\"logConfiguration\":{\"logDriver\":\"awslogs\",\"options\":{\"awslogs-group\":\"<log-group>\",\"awslogs-region\":\"<region>\",\"awslogs-stream-prefix\":\"ecs\",\"mode\":\"non-blocking\"}}}]'",
      "NativeIaC": "```yaml\n# CloudFormation: ECS Task Definition with non-blocking container logging\nResources:\n  <example_resource_name>:\n    Type: AWS::ECS::TaskDefinition\n    Properties:\n      Family: <example_resource_name>\n      ContainerDefinitions:\n        - Name: <example_resource_name>\n          Image: <image>\n          LogConfiguration:\n            LogDriver: awslogs\n            Options:\n              awslogs-group: <log-group>\n              awslogs-region: <region>\n              awslogs-stream-prefix: ecs\n              mode: non-blocking  # CRITICAL: sets logging to non-blocking to pass the check\n```",
      "Other": "1. Open the AWS Console and go to ECS > Task Definitions\n2. Select the failing task definition and choose Create new revision\n3. Edit the affected container > Log configuration\n4. Set Log driver to awslogs and add option: mode = non-blocking\n5. Ensure awslogs-group, awslogs-region, and (if needed) awslogs-stream-prefix are set\n6. Save and Create; the new revision will have non-blocking logging",
      "Terraform": "```hcl\n# ECS Task Definition with container logging set to non-blocking\nresource \"aws_ecs_task_definition\" \"<example_resource_name>\" {\n  family = \"<example_resource_name>\"\n\n  # CRITICAL: \"mode\": \"non-blocking\" in logConfiguration options enforces non-blocking logging\n  container_definitions = jsonencode([\n    {\n      name  = \"<example_resource_name>\"\n      image = \"<image>\"\n      logConfiguration = {\n        logDriver = \"awslogs\"\n        options = {\n          awslogs-group         = \"<log-group>\"\n          awslogs-region        = \"<region>\"\n          awslogs-stream-prefix = \"ecs\"\n          mode                  = \"non-blocking\" # CRITICAL: required to pass the check\n        }\n      }\n    }\n  ])\n}\n```"
    },
    "Recommendation": {
      "Text": "Set `logConfiguration.mode` to `non-blocking` for all containers and size `max-buffer-size` to handle bursts. Keep log destinations in-Region to lower latency. Apply **defense in depth**: decouple application execution from logging, monitor log throughput, and design for backpressure so logging never blocks runtime.",
      "Url": "https://hub.prowler.com/check/ecs_task_definitions_logging_block_mode"
    }
  },
  "Categories": [
    "logging",
    "resilience"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: ecs_task_definitions_logging_block_mode.py]---
Location: prowler-master/prowler/providers/aws/services/ecs/ecs_task_definitions_logging_block_mode/ecs_task_definitions_logging_block_mode.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ecs.ecs_client import ecs_client


class ecs_task_definitions_logging_block_mode(Check):
    def execute(self):
        findings = []
        for task_definition in ecs_client.task_definitions.values():
            report = Check_Report_AWS(
                metadata=self.metadata(), resource=task_definition
            )
            report.resource_id = f"{task_definition.name}:{task_definition.revision}"
            containers = 0
            report.status = "PASS"
            report.status_extended = f"ECS task definition {task_definition.name} with revision {task_definition.revision} containers has logging configured with non blocking mode."
            failed_containers = []
            for container in task_definition.container_definitions:
                if container.log_driver:
                    containers = containers + 1
                    if container.log_option != "non-blocking":
                        report.status = "FAIL"
                        failed_containers.append(container.name)

            if failed_containers:
                report.status_extended = f"ECS task definition {task_definition.name} with revision {task_definition.revision} running with logging set to blocking mode on containers: {', '.join(failed_containers)}"

            if containers > 0:
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: ecs_task_definitions_logging_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ecs/ecs_task_definitions_logging_enabled/ecs_task_definitions_logging_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ecs_task_definitions_logging_enabled",
  "CheckTitle": "ECS task definition has logging configured for all containers",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Runtime Behavior Analysis",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "ecs",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsEcsTaskDefinition",
  "Description": "**Amazon ECS task definition** containers specify a **logging configuration** with a non-null `logDriver` for every container in the latest active revision.",
  "Risk": "Absent container logs erode visibility, letting intrusions, data exfiltration, and configuration tampering go undetected.\n\nMissing audit trails weaken confidentiality and integrity, hinder forensics, and increase MTTR during outages, impacting availability and compliance evidence.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/ecs-controls.html#ecs-9",
    "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_awslogs.html#specify-log-config",
    "https://docs.aws.amazon.com/config/latest/developerguide/ecs-task-definition-log-configuration.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws ecs register-task-definition --family <task-family> --container-definitions '[{\"name\":\"<container-name>\",\"image\":\"<image>\",\"logConfiguration\":{\"logDriver\":\"awslogs\",\"options\":{\"awslogs-group\":\"<log-group>\",\"awslogs-region\":\"<region>\"}}}]'",
      "NativeIaC": "```yaml\n# CloudFormation: ECS task definition with logging enabled for the container\nResources:\n  ExampleTaskDefinition:\n    Type: AWS::ECS::TaskDefinition\n    Properties:\n      ContainerDefinitions:\n        - Name: \"<example_resource_name>\"\n          Image: \"<image>\"\n          LogConfiguration:                 # Critical: ensures container has logging configured\n            LogDriver: awslogs              # Critical: non-null log driver passes the check\n            Options:\n              awslogs-group: \"<log-group>\" # Critical: CloudWatch Logs group\n              awslogs-region: \"<region>\"\n```",
      "Other": "1. In the AWS Console, go to Amazon ECS > Task Definitions\n2. Select your task definition and click Create new revision\n3. For each container, open Edit and set Log configuration to awslogs\n4. Set Log group to the desired CloudWatch Logs group and select the Region\n5. Save and Create to register the new revision (ensure all containers have logging)",
      "Terraform": "```hcl\n# ECS task definition with logging enabled for the container\nresource \"aws_ecs_task_definition\" \"<example_resource_name>\" {\n  family                = \"<example_resource_name>\"\n  container_definitions = jsonencode([\n    {\n      name  = \"<example_resource_name>\"\n      image = \"<image>\"\n      logConfiguration = {                 # Critical: enables container logging\n        logDriver = \"awslogs\"             # Critical: non-null log driver passes the check\n        options = {\n          awslogs-group  = \"<log-group>\"  # Critical: CloudWatch Logs group\n          awslogs-region = \"<region>\"\n        }\n      }\n    }\n  ])\n}\n```"
    },
    "Recommendation": {
      "Text": "Implement centralized, tamper-resistant **container logging** for all tasks. Define a `logDriver` per container and ship logs to a managed destination with restricted access. Apply **least privilege**, encryption, and retention. Monitor and alert on anomalies. *If using external collectors, ensure equivalent coverage and durability.*",
      "Url": "https://hub.prowler.com/check/ecs_task_definitions_logging_enabled"
    }
  },
  "Categories": [
    "logging"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: ecs_task_definitions_logging_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/ecs/ecs_task_definitions_logging_enabled/ecs_task_definitions_logging_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ecs.ecs_client import ecs_client


class ecs_task_definitions_logging_enabled(Check):
    def execute(self):
        findings = []
        for task_definition in ecs_client.task_definitions.values():
            report = Check_Report_AWS(
                metadata=self.metadata(), resource=task_definition
            )
            report.resource_id = f"{task_definition.name}:{task_definition.revision}"
            report.status = "PASS"
            report.status_extended = f"ECS task definition {task_definition.name} with revision {task_definition.revision} containers have logging configured."
            failed_containers = []
            for container in task_definition.container_definitions:
                if not container.log_driver:
                    report.status = "FAIL"
                    failed_containers.append(container.name)

            if failed_containers:
                report.status_extended = f"ECS task definition {task_definition.name} with revision {task_definition.revision} has containers running with no logging configuration: {', '.join(failed_containers)}"

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

````
