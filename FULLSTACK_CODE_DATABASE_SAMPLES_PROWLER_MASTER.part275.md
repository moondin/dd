---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 275
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 275 of 867)

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

---[FILE: ecr_repositories_not_publicly_accessible.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ecr/ecr_repositories_not_publicly_accessible/ecr_repositories_not_publicly_accessible.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ecr_repositories_not_publicly_accessible",
  "CheckTitle": "ECR repository is not publicly accessible",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "TTPs/Initial Access",
    "Effects/Data Exposure"
  ],
  "ServiceName": "ecr",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "AwsEcrRepository",
  "Description": "**Amazon ECR repositories** are evaluated for **public exposure** via repository policies that allow anonymous principals (e.g., `Principal: \"*\"`) to access the repo, including image listing, pulling, or modification.",
  "Risk": "**Public access to ECR repositories** weakens **confidentiality** and **integrity**.\n\nAnyone can pull images, exposing proprietary code or embedded secrets; if pushes are allowed, attackers can poison images, enabling supply-chain compromise. Uncontrolled pulls can raise **egress costs** and leak repository metadata.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/AmazonECR/latest/public/security_iam_service-with-iam.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws ecr delete-repository-policy --repository-name <example_resource_name>",
      "NativeIaC": "```yaml\nResources:\n  <example_resource_name>:\n    Type: AWS::ECR::Repository\n    Properties:\n      RepositoryPolicyText:\n        Version: \"2012-10-17\"\n        Statement:\n          - Effect: Allow\n            Principal:\n              AWS: \"arn:aws:iam::<example_resource_id>:root\"  # Critical: restricts access to a specific AWS account; removes public (*) access\n            Action: \"ecr:*\"\n```",
      "Other": "1. In the AWS Console, go to Amazon ECR > Repositories\n2. Select the repository\n3. Open the Permissions tab and click Edit\n4. Remove any statement with Principal set to \"*\", or replace it with specific AWS ARN(s) (e.g., arn:aws:iam::<example_resource_id>:root)\n5. Save changes",
      "Terraform": "```hcl\nresource \"aws_ecr_repository_policy\" \"<example_resource_name>\" {\n  repository = \"<example_resource_name>\"\n  policy     = jsonencode({\n    Version   = \"2012-10-17\"\n    Statement = [{\n      Effect    = \"Allow\"\n      Principal = { AWS = \"arn:aws:iam::<example_resource_id>:root\" } # Critical: restricts access to a specific AWS principal; removes public (*) access\n      Action    = \"ecr:*\"\n    }]\n  })\n}\n```"
    },
    "Recommendation": {
      "Text": "Apply **least privilege** to repository policies:\n- Avoid `Principal:\"*\"` and block anonymous access\n- Grant minimal actions to specific accounts/roles\n- Require authenticated pulls/pushes via IAM\n- Use **private connectivity** (e.g., VPC endpoints)\n- Add **defense in depth** with image scanning and signing",
      "Url": "https://hub.prowler.com/check/ecr_repositories_not_publicly_accessible"
    }
  },
  "Categories": [
    "internet-exposed",
    "container-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: ecr_repositories_not_publicly_accessible.py]---
Location: prowler-master/prowler/providers/aws/services/ecr/ecr_repositories_not_publicly_accessible/ecr_repositories_not_publicly_accessible.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ecr.ecr_client import ecr_client
from prowler.providers.aws.services.iam.lib.policy import is_policy_public


class ecr_repositories_not_publicly_accessible(Check):
    def execute(self):
        findings = []
        for registry in ecr_client.registries.values():
            for repository in registry.repositories:
                if repository.policy is None:
                    continue
                report = Check_Report_AWS(metadata=self.metadata(), resource=repository)
                report.status = "PASS"
                report.status_extended = (
                    f"Repository {repository.name} is not publicly accessible."
                )
                if repository.policy:
                    if is_policy_public(repository.policy, ecr_client.audited_account):
                        report.status = "FAIL"
                        report.status_extended = (
                            f"Repository {repository.name} is publicly accessible."
                        )

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ecr_repositories_not_publicly_accessible_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/ecr/ecr_repositories_not_publicly_accessible/ecr_repositories_not_publicly_accessible_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.ecr.ecr_client import ecr_client


def fixer(resource_id: str, region: str) -> bool:
    """
    Modify the ECR repository's policy to remove public access.
    Specifically, this fixer delete the policy that had public access.
    Requires the ecr:DeleteRepositoryPolicy permission.
    Permissions:
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "ecr:DeleteRepositoryPolicy",
                "Resource": "*"
            }
        ]
    }
    Args:
        resource_id (str): The ECR repository name.
        region (str): AWS region where the ECR repository exists.
    Returns:
        bool: True if the operation is successful (policy updated), False otherwise.
    """
    try:
        regional_client = ecr_client.regional_clients[region]

        regional_client.delete_repository_policy(repositoryName=resource_id)

    except Exception as error:
        logger.error(
            f"{region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
        )
        return False
    else:
        return True
```

--------------------------------------------------------------------------------

---[FILE: ecr_repositories_scan_images_on_push_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ecr/ecr_repositories_scan_images_on_push_enabled/ecr_repositories_scan_images_on_push_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ecr_repositories_scan_images_on_push_enabled",
  "CheckTitle": "[DEPRECATED] ECR repository has image scanning on push enabled",
  "CheckType": [
    "Software and Configuration Checks/Vulnerabilities/CVE",
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "ecr",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsEcrRepository",
  "Description": "[DEPRECATED]\n**Amazon ECR repositories** are evaluated for **image scanning on push**; when configured, new image uploads automatically trigger a vulnerability scan (`scan_on_push`).",
  "Risk": "Without **scan on push**, images with known CVEs can enter registries and reach runtime unnoticed, undermining **integrity** and **confidentiality** through exploitable packages. Attackers may achieve code execution and lateral movement. Delayed detection increases operational risk and extends remediation timelines.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/ECR/scan-on-push.html",
    "https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-scanning-basic-enabling.html",
    "https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-scanning.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws ecr put-image-scanning-configuration --repository-name <repo_name> --image-scanning-configuration scanOnPush=true",
      "NativeIaC": "```yaml\nResources:\n  <example_resource_name>:\n    Type: AWS::ECR::Repository\n    Properties:\n      ImageScanningConfiguration:\n        ScanOnPush: true  # Critical: enables image scanning on push for this repository\n```",
      "Other": "1. Open the AWS Console and go to Amazon ECR\n2. Click Repositories and select the target repository\n3. Click Edit\n4. Enable the Scan on push toggle\n5. Click Save",
      "Terraform": "```hcl\nresource \"aws_ecr_repository\" \"<example_resource_name>\" {\n  name = \"<example_resource_name>\"\n\n  image_scanning_configuration {\n    scan_on_push = true # Critical: enables scanning on image push\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **image scanning on push** (`scan_on_push`) for all repositories and use findings as promotion gates. Prefer **continuous/enhanced scanning** for defense in depth, set severity thresholds, and block or quarantine noncompliant images. Integrate results with CI/CD and adopt **shift-left** vulnerability management.",
      "Url": "https://hub.prowler.com/check/ecr_repositories_scan_images_on_push_enabled"
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

---[FILE: ecr_repositories_scan_images_on_push_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/ecr/ecr_repositories_scan_images_on_push_enabled/ecr_repositories_scan_images_on_push_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ecr.ecr_client import ecr_client


class ecr_repositories_scan_images_on_push_enabled(Check):
    def execute(self):
        findings = []
        for registry in ecr_client.registries.values():
            for repository in registry.repositories:
                report = Check_Report_AWS(metadata=self.metadata(), resource=repository)
                report.status = "PASS"
                report.status_extended = (
                    f"ECR repository {repository.name} has scan on push enabled."
                )
                if not repository.scan_on_push:
                    report.status = "FAIL"
                    report.status_extended = (
                        f"ECR repository {repository.name} has scan on push disabled."
                    )

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ecr_repositories_scan_vulnerabilities_in_latest_image.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ecr/ecr_repositories_scan_vulnerabilities_in_latest_image/ecr_repositories_scan_vulnerabilities_in_latest_image.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ecr_repositories_scan_vulnerabilities_in_latest_image",
  "CheckTitle": "ECR repository latest image is scanned with no vulnerabilities at or above the configured minimum severity",
  "CheckType": [
    "Software and Configuration Checks/Vulnerabilities/CVE",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "ecr",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsEcrRepository",
  "Description": "**Amazon ECR repositories** are assessed on the most recent pushed image to confirm a vulnerability scan exists, completed successfully, and that no results meet or exceed the configured minimum severity (e.g., `CRITICAL`, `HIGH`, `MEDIUM`).",
  "Risk": "Unscanned or high-severity findings in container images expose workloads to exploitation of known CVEs.\n\nAttackers can gain code execution, exfiltrate data, alter services, or disrupt operations, enabling **lateral movement** and supply-chain compromise-impacting **confidentiality**, **integrity**, and **availability**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.geeksforgeeks.org/devops/how-to-manage-image-security-and-vulnerabilities-in-ecr/",
    "https://aws.amazon.com/blogs/aws/amazon-inspector-enhances-container-security-by-mapping-amazon-ecr-images-to-running-containers/",
    "https://docs.aws.amazon.com/inspector/latest/user/scanning-ecr.html",
    "https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-scanning-enhanced.html",
    "https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-scanning.html",
    "https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-scanning-basic.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# Enable scan on push so the latest image is automatically scanned\nResources:\n  EcrRepository:\n    Type: AWS::ECR::Repository\n    Properties:\n      RepositoryName: <example_resource_name>\n      ImageScanningConfiguration:\n        ScanOnPush: true  # CRITICAL: ensures each pushed image is scanned so the latest has scan results\n```",
      "Other": "1. In the AWS Console, go to ECR > Repositories > <example_resource_name>\n2. Click Edit and enable Scan on push, then Save\n3. Rebuild the container image to remove vulnerabilities and push a new tag to the repository\n4. Open the image details and click Scan image (if not auto-scanned)\n5. Confirm Findings show 0 vulnerabilities at or above the required severity",
      "Terraform": "```hcl\n# Enable scan on push so the latest image is automatically scanned\nresource \"aws_ecr_repository\" \"<example_resource_name>\" {\n  name = \"<example_resource_name>\"\n\n  image_scanning_configuration {\n    scan_on_push = true  # CRITICAL: ensures each pushed image is scanned so the latest has scan results\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **continuous scanning** for repositories and enforce deployment gates at your policy threshold (e.g., `MEDIUM`+).\n\nRebuild images with patched components and updated bases, keep images minimal, and apply **least privilege**. Use **image signing** and CI/CD checks so only scanned, compliant images can run.",
      "Url": "https://hub.prowler.com/check/ecr_repositories_scan_vulnerabilities_in_latest_image"
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

---[FILE: ecr_repositories_scan_vulnerabilities_in_latest_image.py]---
Location: prowler-master/prowler/providers/aws/services/ecr/ecr_repositories_scan_vulnerabilities_in_latest_image/ecr_repositories_scan_vulnerabilities_in_latest_image.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ecr.ecr_client import ecr_client


class ecr_repositories_scan_vulnerabilities_in_latest_image(Check):
    def execute(self):
        findings = []

        # Get minimun severity to report
        minimum_severity = ecr_client.audit_config.get(
            "ecr_repository_vulnerability_minimum_severity", "MEDIUM"
        )

        for registry in ecr_client.registries.values():
            for repository in registry.repositories:
                # First check if the repository has images
                if len(repository.images_details) > 0:
                    # We only want to check the latest image pushed that is scannable
                    image = repository.images_details[-1]
                    report = Check_Report_AWS(
                        metadata=self.metadata(), resource=repository
                    )
                    report.status = "PASS"
                    status_extended_prefix = f"ECR repository '{repository.name}' has scanned the {image.type} container image with digest '{image.latest_digest}' and tag '{image.latest_tag}' "
                    report.status_extended = (
                        status_extended_prefix + "without findings."
                    )
                    if not image.scan_findings_status:
                        report.status = "FAIL"
                        report.status_extended = (
                            status_extended_prefix + "without a scan."
                        )
                    elif image.scan_findings_status == "FAILED":
                        report.status = "FAIL"
                        report.status_extended = (
                            status_extended_prefix + "with scan status FAILED."
                        )
                    elif (
                        image.scan_findings_status != "FAILED"
                        and image.scan_findings_severity_count
                    ):
                        if (
                            minimum_severity == "CRITICAL"
                            and image.scan_findings_severity_count.critical
                        ):
                            report.status = "FAIL"
                            report.status_extended = (
                                status_extended_prefix
                                + f"with findings: CRITICAL->{image.scan_findings_severity_count.critical}."
                            )
                        elif minimum_severity == "HIGH" and (
                            image.scan_findings_severity_count.critical
                            or image.scan_findings_severity_count.high
                        ):
                            report.status = "FAIL"
                            report.status_extended = (
                                status_extended_prefix
                                + f"with findings: CRITICAL->{image.scan_findings_severity_count.critical}, HIGH->{image.scan_findings_severity_count.high}."
                            )
                        elif minimum_severity == "MEDIUM" and (
                            image.scan_findings_severity_count.critical
                            or image.scan_findings_severity_count.high
                            or image.scan_findings_severity_count.medium
                        ):
                            report.status = "FAIL"
                            report.status_extended = (
                                status_extended_prefix
                                + f"with findings: CRITICAL->{image.scan_findings_severity_count.critical}, HIGH->{image.scan_findings_severity_count.high}, MEDIUM->{image.scan_findings_severity_count.medium}."
                            )

                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ecr_repositories_tag_immutability.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ecr/ecr_repositories_tag_immutability/ecr_repositories_tag_immutability.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ecr_repositories_tag_immutability",
  "CheckTitle": "ECR repository has image tag immutability enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "ecr",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsEcrRepository",
  "Description": "Amazon ECR repositories are assessed for **image tag immutability**. Repositories permitting tag updates (`MUTABLE`) are identified; those enforcing immutable tags (such as `IMMUTABLE`) are recognized.",
  "Risk": "Mutable tags allow replacing the image behind a trusted tag, undermining release **integrity**. This enables supply-chain injection, unintended rollouts, and backdoored deployments, harming **availability**. Malicious images can exfiltrate data, impacting **confidentiality**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/config/latest/developerguide/ecr-private-tag-immutability-enabled.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/ecr-controls.html#ecr-2",
    "https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-tag-mutability.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws ecr put-image-tag-mutability --repository-name <repository-name> --image-tag-mutability IMMUTABLE",
      "NativeIaC": "```yaml\nResources:\n  <example_resource_name>:\n    Type: AWS::ECR::Repository\n    Properties:\n      ImageTagMutability: IMMUTABLE  # Critical: enables tag immutability to prevent tag overwrites\n```",
      "Other": "1. Open the Amazon ECR console\n2. Go to Repositories (Private) and select the repository\n3. Click Actions > Edit\n4. Set Image tag immutability to Immutable\n5. Click Save",
      "Terraform": "```hcl\nresource \"aws_ecr_repository\" \"<example_resource_name>\" {\n  name                 = \"<example_resource_name>\"\n  image_tag_mutability = \"IMMUTABLE\" # Critical: enables tag immutability to prevent tag overwrites\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **tag immutability** so tags map to a single artifact. Use **versioned tags** per build, block retagging in CI/CD, and apply **least privilege** for push actions. Layer **image signing** and admission controls to run only trusted images. *If exceptions are needed, keep them narrow and monitored.*",
      "Url": "https://hub.prowler.com/check/ecr_repositories_tag_immutability"
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

---[FILE: ecr_repositories_tag_immutability.py]---
Location: prowler-master/prowler/providers/aws/services/ecr/ecr_repositories_tag_immutability/ecr_repositories_tag_immutability.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ecr.ecr_client import ecr_client


class ecr_repositories_tag_immutability(Check):
    def execute(self):
        findings = []
        for registry in ecr_client.registries.values():
            for repository in registry.repositories:
                report = Check_Report_AWS(metadata=self.metadata(), resource=repository)

                report.status = "PASS"
                report.status_extended = (
                    f"Repository {repository.name} has immutability configured."
                )

                if repository.immutability == "MUTABLE":
                    report.status = "FAIL"
                    report.status_extended = f"Repository {repository.name} does not have immutability configured."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ecs_client.py]---
Location: prowler-master/prowler/providers/aws/services/ecs/ecs_client.py

```python
from prowler.providers.aws.services.ecs.ecs_service import ECS
from prowler.providers.common.provider import Provider

ecs_client = ECS(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: ecs_service.py]---
Location: prowler-master/prowler/providers/aws/services/ecs/ecs_service.py
Signals: Pydantic

```python
from re import sub
from typing import Optional

from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class ECS(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.task_definitions = {}
        self.services = {}
        self.clusters = {}
        self.task_sets = {}
        self.__threading_call__(self._list_task_definitions)
        self.__threading_call__(
            self._describe_task_definition, self.task_definitions.values()
        )
        self.__threading_call__(self._list_clusters)
        self.__threading_call__(self._describe_clusters, self.clusters.values())
        self.__threading_call__(self._describe_services, self.clusters.values())

    def _list_task_definitions(self, regional_client):
        logger.info("ECS - Listing Task Definitions...")
        try:
            list_ecs_paginator = regional_client.get_paginator("list_task_definitions")
            for page in list_ecs_paginator.paginate():
                for task_definition in page["taskDefinitionArns"]:
                    if not self.audit_resources or (
                        is_resource_filtered(task_definition, self.audit_resources)
                    ):
                        self.task_definitions[task_definition] = TaskDefinition(
                            # we want the family name without the revision
                            name=sub(":.*", "", task_definition.split("/")[-1]),
                            arn=task_definition,
                            revision=task_definition.split(":")[-1],
                            region=regional_client.region,
                            environment_variables=[],
                        )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_task_definition(self, task_definition):
        logger.info("ECS - Describing Task Definition...")
        try:
            client = self.regional_clients[task_definition.region]
            response = client.describe_task_definition(
                taskDefinition=task_definition.arn,
                include=[
                    "TAGS",
                ],
            )
            container_definitions = response["taskDefinition"]["containerDefinitions"]
            for container in container_definitions:
                environment = []
                if "environment" in container:
                    for env_var in container["environment"]:
                        environment.append(
                            ContainerEnvVariable(
                                name=env_var["name"], value=env_var["value"]
                            )
                        )
                task_definition.container_definitions.append(
                    ContainerDefinition(
                        name=container["name"],
                        privileged=container.get("privileged", False),
                        readonly_rootfilesystem=container.get(
                            "readonlyRootFilesystem", False
                        ),
                        user=container.get("user", ""),
                        environment=environment,
                        log_driver=container.get("logConfiguration", {}).get(
                            "logDriver", ""
                        ),
                        log_option=container.get("logConfiguration", {})
                        .get("options", {})
                        .get("mode", ""),
                    )
                )
            task_definition.pid_mode = response["taskDefinition"].get("pidMode", "")
            task_definition.tags = response.get("tags")
            task_definition.network_mode = response["taskDefinition"].get(
                "networkMode", "bridge"
            )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_services(self, cluster):
        logger.info("ECS - Describing Services for each Cluster...")
        try:
            client = self.regional_clients[cluster.region]

            list_ecs_paginator = client.get_paginator("list_services")
            service_arns = []
            for page in list_ecs_paginator.paginate(cluster=cluster.arn):
                service_arns.extend(page["serviceArns"])

            if service_arns:
                for service_arn in service_arns:
                    describe_response = client.describe_services(
                        cluster=cluster.arn,
                        services=[service_arn],
                        include=["TAGS"],
                    )

                    service_desc = describe_response["services"][0]
                    service_arn = service_desc["serviceArn"]
                    service_obj = Service(
                        name=sub(":.*", "", service_arn.split("/")[-1]),
                        id=f"{sub(':.*', '', service_arn.split('/')[-2])}/{sub(':.*', '', service_arn.split('/')[-1])}",
                        arn=service_arn,
                        region=cluster.region,
                        assign_public_ip=(
                            service_desc.get("networkConfiguration", {})
                            .get("awsvpcConfiguration", {})
                            .get("assignPublicIp", "DISABLED")
                            == "ENABLED"
                        ),
                        launch_type=service_desc.get("launchType", ""),
                        platform_version=service_desc.get("platformVersion", ""),
                        platform_family=service_desc.get("platformFamily", ""),
                        tags=service_desc.get("tags", []),
                    )
                    for task_set in service_desc.get("taskSets", []):
                        self.task_sets[task_set["taskSetArn"]] = TaskSet(
                            id=task_set["id"],
                            arn=task_set["taskSetArn"],
                            cluster_arn=task_set["clusterArn"],
                            service_arn=task_set["serviceArn"],
                            assign_public_ip=task_set.get("networkConfiguration", {})
                            .get("awsvpcConfiguration", {})
                            .get("assignPublicIp", "DISABLED"),
                            region=cluster.region,
                            tags=task_set.get("tags", []),
                        )
                    cluster.services[service_arn] = service_obj
                    self.services[service_arn] = service_obj
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_clusters(self, regional_client):
        logger.info("ECS - Listing Clusters...")
        try:
            list_ecs_paginator = regional_client.get_paginator("list_clusters")
            for page in list_ecs_paginator.paginate():
                for cluster in page["clusterArns"]:
                    if not self.audit_resources or (
                        is_resource_filtered(cluster, self.audit_resources)
                    ):
                        self.clusters[cluster] = Cluster(
                            name=sub(":.*", "", cluster.split("/")[-1]),
                            arn=cluster,
                            region=regional_client.region,
                        )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_clusters(self, cluster):
        logger.info("ECS - Describing Clusters...")
        try:
            client = self.regional_clients[cluster.region]
            response = client.describe_clusters(
                clusters=[cluster.arn],
                include=[
                    "TAGS",
                    "SETTINGS",
                ],
            )
            cluster.settings = response["clusters"][0].get("settings", [])
            cluster.tags = response["clusters"][0].get("tags", [])
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class ContainerEnvVariable(BaseModel):
    name: str
    value: str


class ContainerDefinition(BaseModel):
    name: str
    privileged: bool
    readonly_rootfilesystem: bool = False
    user: str
    environment: list[ContainerEnvVariable]
    log_driver: Optional[str]
    log_option: Optional[str]


class TaskDefinition(BaseModel):
    name: str
    arn: str
    revision: str
    region: str
    container_definitions: list[ContainerDefinition] = []
    pid_mode: Optional[str]
    tags: Optional[list] = []
    network_mode: Optional[str]


class Service(BaseModel):
    name: str
    id: str
    arn: str
    region: str
    launch_type: str = ""
    platform_version: Optional[str]
    platform_family: Optional[str]
    assign_public_ip: Optional[bool]
    tags: Optional[list] = []


class Cluster(BaseModel):
    name: str
    arn: str
    region: str
    services: dict = {}
    settings: Optional[list] = []
    tags: Optional[list] = []


class TaskSet(BaseModel):
    id: str
    arn: str
    cluster_arn: str
    service_arn: str
    region: str
    assign_public_ip: Optional[str]
    tags: Optional[list] = []
```

--------------------------------------------------------------------------------

---[FILE: ecs_cluster_container_insights_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ecs/ecs_cluster_container_insights_enabled/ecs_cluster_container_insights_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ecs_cluster_container_insights_enabled",
  "CheckTitle": "ECS cluster has Container Insights enabled or enhanced",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/AWS Security Best Practices/Runtime Behavior Analysis"
  ],
  "ServiceName": "ecs",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsEcsCluster",
  "Description": "**ECS clusters** have CloudWatch **Container Insights** configured via the `containerInsights` setting, accepting `enabled` or `enhanced` values to emit cluster, service, task, and container telemetry.",
  "Risk": "Without **Container Insights**, ECS operations lack **telemetry** to spot failures and anomalies. Missed CPU/memory/network spikes and restart loops degrade **availability** and delay response. Absent baselines impede detecting abuse (e.g., **cryptomining** or data egress bursts), risking **confidentiality** and unexpected **costs**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/ecs-controls.html#ecs-12",
    "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cloudwatch-container-insights.html",
    "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics-ECS.html",
    "https://docs.aws.amazon.com/config/latest/developerguide/ecs-container-insights-enabled.html",
    "https://aws.amazon.com/blogs/aws/container-insights-with-enhanced-observability-now-available-in-amazon-ecs/",
    "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-ECS-cluster.html",
    "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws ecs update-cluster-settings --cluster <cluster-name> --settings name=containerInsights,value=enabled",
      "NativeIaC": "```yaml\n# CloudFormation: Enable Container Insights on an ECS cluster\nResources:\n  <example_resource_name>:\n    Type: AWS::ECS::Cluster\n    Properties:\n      ClusterSettings:\n        - Name: containerInsights  # Critical: enables CloudWatch Container Insights for the cluster\n          Value: enabled           # Critical: setting that passes the check\n```",
      "Other": "1. Open the Amazon ECS console\n2. Go to Clusters and select the target cluster\n3. Click Update cluster\n4. Under CloudWatch Container Insights, enable Container Insights (or Enhanced)\n5. Click Save changes",
      "Terraform": "```hcl\n# Terraform: Enable Container Insights on an ECS cluster\nresource \"aws_ecs_cluster\" \"<example_resource_name>\" {\n  name = \"<example_resource_name>\"\n\n  setting {\n    name  = \"containerInsights\"   # Critical: enables CloudWatch Container Insights for the cluster\n    value = \"enabled\"             # Critical: setting that passes the check\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **Container Insights** on all clusters-prefer `enhanced` for deeper visibility. Apply at account level for new clusters and enforce via automation.\n\nUse **least privilege** for access to metrics/logs, encrypt logs, and set **alarms** on critical metrics. Correlate with app logs and tracing for **defense in depth** and faster incident detection.",
      "Url": "https://hub.prowler.com/check/ecs_cluster_container_insights_enabled"
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

---[FILE: ecs_cluster_container_insights_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/ecs/ecs_cluster_container_insights_enabled/ecs_cluster_container_insights_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ecs.ecs_client import ecs_client


class ecs_cluster_container_insights_enabled(Check):
    def execute(self):
        findings = []
        for cluster in ecs_client.clusters.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
            report.status = "FAIL"
            report.status_extended = (
                f"ECS cluster {cluster.name} does not have container insights enabled."
            )
            if cluster.settings:
                for setting in cluster.settings:
                    if setting["name"] == "containerInsights" and (
                        setting["value"] == "enabled" or setting["value"] == "enhanced"
                    ):
                        report.status = "PASS"
                        report.status_extended = f"ECS cluster {cluster.name} has container insights {setting['value']}."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

````
