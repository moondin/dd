---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 256
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 256 of 867)

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

---[FILE: codebuild_project_not_publicly_accessible.py]---
Location: prowler-master/prowler/providers/aws/services/codebuild/codebuild_project_not_publicly_accessible/codebuild_project_not_publicly_accessible.py

```python
from typing import List

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.codebuild.codebuild_client import codebuild_client


class codebuild_project_not_publicly_accessible(Check):
    def execute(self) -> List[Check_Report_AWS]:
        findings = []

        projects = codebuild_client.projects
        for arn, project in projects.items():
            report = Check_Report_AWS(self.metadata(), resource=project)
            report.resource_id = project.name
            report.resource_arn = arn
            report.region = project.region
            report.status = "FAIL"
            report.status_extended = f"CodeBuild project {project.name} is public."

            if project.project_visibility == "PRIVATE":
                report.status = "PASS"
                report.status_extended = f"CodeBuild project {project.name} is private."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: codebuild_project_no_secrets_in_variables.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/codebuild/codebuild_project_no_secrets_in_variables/codebuild_project_no_secrets_in_variables.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "codebuild_project_no_secrets_in_variables",
  "CheckTitle": "CodeBuild project has no sensitive credentials in plaintext environment variables",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "TTPs/Credential Access",
    "Effects/Data Exposure",
    "Sensitive Data Identifications/Security"
  ],
  "ServiceName": "codebuild",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "AwsCodeBuildProject",
  "Description": "**AWS CodeBuild projects** are inspected for **plaintext environment variables** (`PLAINTEXT`) that resemble **secrets** (keys, tokens, passwords).\n\nSuch values indicate sensitive data is stored directly in environment variables instead of being sourced securely.",
  "Risk": "Plaintext secrets in environment variables reduce confidentiality: values can be viewed in consoles/CLI and may leak into build logs or public outputs. Compromised credentials enable unauthorized AWS actions, artifact tampering, and lateral movement, causing data exfiltration and CI/CD supply-chain compromise.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html",
    "https://www.learnaws.org/2022/11/18/aws-codebuild-secrets-manager/",
    "https://www.learnaws.org/2023/08/23/codebuild-env-vars/",
    "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codebuild-project-environmentvariable.html",
    "https://docs.aws.amazon.com/codebuild/latest/userguide/change-project.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/codebuild-controls.html#codebuild-2",
    "https://pasmichal.medium.com/how-to-handle-secrets-in-aws-codebuild-6e1b96013712",
    "https://medium.com/@odofing/aws-codepipeline-how-to-securely-store-environment-variables-in-ssm-paramater-store-and-aws-9a96d7083b3c"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\nResources:\n  <example_resource_name>:\n    Type: AWS::CodeBuild::Project\n    Properties:\n      Name: <example_resource_name>\n      ServiceRole: <example_resource_arn>\n      Source:\n        Type: NO_SOURCE\n      Artifacts:\n        Type: NO_ARTIFACTS\n      Environment:\n        Type: LINUX_CONTAINER\n        ComputeType: BUILD_GENERAL1_SMALL\n        Image: aws/codebuild/standard:5.0\n        EnvironmentVariables:\n          - Name: <SENSITIVE_VAR_NAME>\n            Type: SECRETS_MANAGER  # CRITICAL: store secret in Secrets Manager to avoid PLAINTEXT\n            Value: <example_secret_name>  # Secret name or ARN (optionally include json-key)\n```",
      "Other": "1. In AWS Console, go to CodeBuild > Build projects and open your project\n2. Click Edit in the Environment section\n3. Under Environment variables, for each sensitive variable with Type = Plaintext, change Type to Secrets Manager (or Parameter store)\n4. Select the secret (or parameter) that holds the value, then Save\n5. If the secret/parameter does not exist, create it in Secrets Manager or Systems Manager Parameter Store first, then repeat steps 3-4",
      "Terraform": "```hcl\nresource \"aws_codebuild_project\" \"<example_resource_name>\" {\n  name         = \"<example_resource_name>\"\n  service_role = \"<example_resource_arn>\"\n\n  source {\n    type = \"NO_SOURCE\"\n  }\n\n  artifacts {\n    type = \"NO_ARTIFACTS\"\n  }\n\n  environment {\n    compute_type = \"BUILD_GENERAL1_SMALL\"\n    image        = \"aws/codebuild/standard:5.0\"\n    type         = \"LINUX_CONTAINER\"\n\n    environment_variable {\n      name  = \"<SENSITIVE_VAR_NAME>\"\n      type  = \"SECRETS_MANAGER\"  # CRITICAL: use Secrets Manager so value isn't plaintext\n      value = \"<example_secret_name>\"\n    }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Store secrets outside the build and reference them via **AWS Secrets Manager** or **AWS Systems Manager Parameter Store** instead of `PLAINTEXT` variables.\n- Enforce **least privilege** on the build role\n- Rotate secrets; prefer short-lived credentials\n- Avoid logging or exporting secret values and never embed them in artifacts",
      "Url": "https://hub.prowler.com/check/codebuild_project_no_secrets_in_variables"
    }
  },
  "Categories": [
    "secrets",
    "ci-cd"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: codebuild_project_no_secrets_in_variables.py]---
Location: prowler-master/prowler/providers/aws/services/codebuild/codebuild_project_no_secrets_in_variables/codebuild_project_no_secrets_in_variables.py

```python
import json

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.lib.utils.utils import detect_secrets_scan
from prowler.providers.aws.services.codebuild.codebuild_client import codebuild_client


class codebuild_project_no_secrets_in_variables(Check):
    def execute(self):
        findings = []
        sensitive_vars_excluded = codebuild_client.audit_config.get(
            "excluded_sensitive_environment_variables", []
        )
        secrets_ignore_patterns = codebuild_client.audit_config.get(
            "secrets_ignore_patterns", []
        )
        for project in codebuild_client.projects.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=project)
            report.status = "PASS"
            report.status_extended = f"CodeBuild project {project.name} does not have sensitive environment plaintext credentials."
            secrets_found = []

            if project.environment_variables:
                for env_var in project.environment_variables:
                    if (
                        env_var.type == "PLAINTEXT"
                        and env_var.name not in sensitive_vars_excluded
                    ):
                        detect_secrets_output = detect_secrets_scan(
                            data=json.dumps({env_var.name: env_var.value}),
                            excluded_secrets=secrets_ignore_patterns,
                            detect_secrets_plugins=codebuild_client.audit_config.get(
                                "detect_secrets_plugins",
                            ),
                        )
                        if detect_secrets_output:
                            secrets_info = [
                                f"{secret['type']} in variable {env_var.name}"
                                for secret in detect_secrets_output
                            ]
                            secrets_found.extend(secrets_info)

            if secrets_found:
                report.status = "FAIL"
                report.status_extended = f"CodeBuild project {project.name} has sensitive environment plaintext credentials in variables: {', '.join(secrets_found)}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: codebuild_project_older_90_days.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/codebuild/codebuild_project_older_90_days/codebuild_project_older_90_days.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "codebuild_project_older_90_days",
  "CheckTitle": "CodeBuild project has been invoked in the last 90 days",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "codebuild",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsCodeBuildProject",
  "Description": "**AWS CodeBuild projects** are assessed for recent activity using the last build invocation timestamp. Projects not invoked within `90 days` or never built are treated as **inactive**.",
  "Risk": "**Inactive projects** increase **attack surface**. Dormant webhooks or **source credentials** can be abused, and attached **IAM roles** may retain excessive permissions. Stale configs can expose **secrets** in env vars or logs, threatening build **integrity** and data **confidentiality**, while adding avoidable cost and operational sprawl.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/codebuild/latest/userguide/delete-project.html",
    "https://support.icompaas.com/support/solutions/articles/62000233684-ensure-codebuild-project-has-been-invoked-in-the-last-90-days"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. Open the AWS Console and go to CodeBuild\n2. In Build projects, select the project\n3. Click Start build, then confirm Start build\n4. Wait for the build to start to update the last invoked time",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Implement lifecycle management: review projects idle over `90 days`, confirm ownership and need, then delete or archive. Revoke unused webhooks, tokens, and service roles; rotate any secrets. Enforce **least privilege**, tagging, and periodic audits to reduce **attack surface** and keep the build environment tidy and defensible.",
      "Url": "https://hub.prowler.com/check/codebuild_project_older_90_days"
    }
  },
  "Categories": [
    "ci-cd"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: codebuild_project_older_90_days.py]---
Location: prowler-master/prowler/providers/aws/services/codebuild/codebuild_project_older_90_days/codebuild_project_older_90_days.py

```python
from datetime import datetime, timezone

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.codebuild.codebuild_client import codebuild_client


class codebuild_project_older_90_days(Check):
    def execute(self):
        findings = []
        for project in codebuild_client.projects.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=project)
            report.status = "PASS"
            report.status_extended = f"CodeBuild project {project.name} has been invoked in the last 90 days."
            if project.last_invoked_time:
                if (datetime.now(timezone.utc) - project.last_invoked_time).days > 90:
                    report.status = "FAIL"
                    report.status_extended = f"CodeBuild project {project.name} has not been invoked in the last 90 days."
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"CodeBuild project {project.name} has never been built."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: codebuild_project_s3_logs_encrypted.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/codebuild/codebuild_project_s3_logs_encrypted/codebuild_project_s3_logs_encrypted.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "codebuild_project_s3_logs_encrypted",
  "CheckTitle": "CodeBuild project S3 logs are encrypted at rest",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Effects/Data Exposure"
  ],
  "ServiceName": "codebuild",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "AwsCodeBuildProject",
  "Description": "**CodeBuild projects** with **S3 log delivery** are evaluated for **encryption at rest** on their S3 log objects. Only projects that write logs to S3 are in scope.",
  "Risk": "Unencrypted build logs jeopardize **confidentiality**. Logs can include secrets, environment data, and error traces. If the bucket is misconfigured or storage is accessed, attackers can harvest credentials and map the pipeline, enabling **lateral movement** and build tampering that impacts **integrity**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/codebuild/latest/userguide/change-project.html#change-project-console-logs",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/codebuild-controls.html#codebuild-3",
    "https://support.icompaas.com/support/solutions/articles/62000233685-ensure-s3-logs-for-codebuild-projects-are-encrypted-at-rest",
    "https://hub.powerpipe.io/mods/turbot/steampipe-mod-aws-compliance/benchmarks/control.codebuild_project_s3_logs_encryption_enabled"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws codebuild update-project --name <project-name> --logs-config s3Logs={status=ENABLED,location=<bucket-name>/<path>,encryptionDisabled=false}",
      "NativeIaC": "```yaml\nResources:\n  <example_resource_name>:\n    Type: AWS::CodeBuild::Project\n    Properties:\n      Name: <example_resource_name>\n      ServiceRole: <example_role_arn>\n      Artifacts:\n        Type: NO_ARTIFACTS\n      Environment:\n        Type: LINUX_CONTAINER\n        ComputeType: BUILD_GENERAL1_SMALL\n        Image: aws/codebuild/amazonlinux2-x86_64-standard:5.0\n      Source:\n        Type: NO_SOURCE\n      LogsConfig:\n        S3Logs:\n          Status: ENABLED\n          Location: <bucket-name>/<path>\n          EncryptionDisabled: false  # Critical: ensures S3 logs are encrypted at rest\n```",
      "Other": "1. Open the AWS CodeBuild console and select your project\n2. Choose Edit, then open the Logs section\n3. Under S3 logs, select Enabled and choose the Bucket/Path\n4. Ensure Disable S3 log encryption is unchecked (encryption enabled)\n5. Save changes",
      "Terraform": "```hcl\nresource \"aws_codebuild_project\" \"<example_resource_name>\" {\n  name         = \"<example_resource_name>\"\n  service_role = \"<example_role_arn>\"\n\n  artifacts { type = \"NO_ARTIFACTS\" }\n\n  environment {\n    compute_type = \"BUILD_GENERAL1_SMALL\"\n    image        = \"aws/codebuild/amazonlinux2-x86_64-standard:5.0\"\n    type         = \"LINUX_CONTAINER\"\n  }\n\n  source { type = \"NO_SOURCE\" }\n\n  logs_config {\n    s3_logs {\n      status              = \"ENABLED\"\n      location            = \"<bucket-name>/<path>\"\n      encryption_disabled = false  # Critical: enables encryption for S3 logs\n    }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable encryption at rest for S3 logs on CodeBuild projects. Prefer `SSE-KMS` with customer-managed keys to control access and rotation. Enforce encryption via bucket policy, apply **least privilege** to log access, and monitor access patterns. *If needed*, segregate logs and keep them private.",
      "Url": "https://hub.prowler.com/check/codebuild_project_s3_logs_encrypted"
    }
  },
  "Categories": [
    "encryption",
    "logging"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: codebuild_project_s3_logs_encrypted.py]---
Location: prowler-master/prowler/providers/aws/services/codebuild/codebuild_project_s3_logs_encrypted/codebuild_project_s3_logs_encrypted.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.codebuild.codebuild_client import codebuild_client


class codebuild_project_s3_logs_encrypted(Check):
    def execute(self):
        findings = []
        for project in codebuild_client.projects.values():
            if project.s3_logs and project.s3_logs.enabled:
                report = Check_Report_AWS(metadata=self.metadata(), resource=project)
                report.status = "PASS"
                report.status_extended = f"CodeBuild project {project.name} has encrypted S3 logs stored in {project.s3_logs.bucket_location}."
                if not project.s3_logs.encrypted:
                    report.status = "FAIL"
                    report.status_extended = f"CodeBuild project {project.name} does not have encrypted S3 logs stored in {project.s3_logs.bucket_location}."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: codebuild_project_source_repo_url_no_sensitive_credentials.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/codebuild/codebuild_project_source_repo_url_no_sensitive_credentials/codebuild_project_source_repo_url_no_sensitive_credentials.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "codebuild_project_source_repo_url_no_sensitive_credentials",
  "CheckTitle": "CodeBuild project source repository URLs do not contain sensitive credentials",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Sensitive Data Identifications/Passwords",
    "Sensitive Data Identifications/Security",
    "Effects/Data Exposure"
  ],
  "ServiceName": "codebuild",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "AwsCodeBuildProject",
  "Description": "**AWS CodeBuild projects** with **Bitbucket sources** are assessed to confirm repository URLs do not embed credentials (for example, `x-token-auth:<token>@` or `user:password@`). The assessment includes both the primary source and all secondary sources.",
  "Risk": "Credentials in URLs are **plainly exposed** in configs and logs, enabling unauthorized repo access. This can lead to:\n- **Source code theft** (C)\n- **Malicious commits/CI changes** (I)\n- **Supply-chain compromise** and lateral movement via token reuse",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/codebuild-controls.html#codebuild-1",
    "https://docs.aws.amazon.com/config/latest/developerguide/codebuild-project-source-repo-url-check.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\nResources:\n  <example_resource_name>:\n    Type: AWS::CodeBuild::Project\n    Properties:\n      Name: <example_resource_name>\n      ServiceRole: <example_role_arn>\n      Artifacts:\n        Type: NO_ARTIFACTS\n      Environment:\n        Type: LINUX_CONTAINER\n        Image: aws/codebuild/standard:5.0\n        ComputeType: BUILD_GENERAL1_SMALL\n      Source:\n        Type: BITBUCKET\n        Location: https://bitbucket.org/<example_owner>/<example_repo>.git  # FIX: remove embedded credentials; keep only the repo URL\n        # This removes tokens/user:pass from the URL, eliminating exposed secrets\n```",
      "Other": "1. In the AWS Console, go to CodeBuild and open your project\n2. Click Edit > Source\n3. Replace the repository URL with only the Bitbucket path (no credentials):\n   - https://bitbucket.org/<workspace>/<repo>.git\n4. If prompted for access, choose Connect using OAuth and authorize Bitbucket\n5. Save changes\n6. If you use Secondary sources, edit each one and remove any embedded credentials from their URLs",
      "Terraform": "```hcl\nresource \"aws_codebuild_project\" \"<example_resource_name>\" {\n  name         = \"<example_resource_name>\"\n  service_role = \"<example_role_arn>\"\n\n  artifacts {\n    type = \"NO_ARTIFACTS\"\n  }\n\n  environment {\n    compute_type = \"BUILD_GENERAL1_SMALL\"\n    image        = \"aws/codebuild/standard:5.0\"\n    type         = \"LINUX_CONTAINER\"\n  }\n\n  source {\n    type     = \"BITBUCKET\"\n    location = \"https://bitbucket.org/<example_owner>/<example_repo>.git\" # FIX: sanitized URL without credentials\n    # Removing credentials from the URL prevents sensitive data exposure\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Use **OAuth/CodeStar Connections** or store tokens in **Secrets Manager/SSM**, never in the URL. Enforce **least privilege**, scope to needed repos, set short lifetimes, and rotate regularly. Audit configs and logs to remove leaked secrets. *Apply to primary and secondary sources.*",
      "Url": "https://hub.prowler.com/check/codebuild_project_source_repo_url_no_sensitive_credentials"
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

---[FILE: codebuild_project_source_repo_url_no_sensitive_credentials.py]---
Location: prowler-master/prowler/providers/aws/services/codebuild/codebuild_project_source_repo_url_no_sensitive_credentials/codebuild_project_source_repo_url_no_sensitive_credentials.py

```python
import re

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.codebuild.codebuild_client import codebuild_client


class codebuild_project_source_repo_url_no_sensitive_credentials(Check):
    def execute(self):
        findings = []
        token_pattern = re.compile(r"https://x-token-auth:[^@]+@bitbucket\.org/.+\.git")
        user_pass_pattern = re.compile(r"https://[^:]+:[^@]+@bitbucket\.org/.+\.git")
        for project in codebuild_client.projects.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=project)
            report.status = "PASS"
            report.status_extended = f"CodeBuild project {project.name} does not contain sensitive credentials in any source repository URLs."
            secrets_found = []

            if project.source and project.source.type == "BITBUCKET":
                if token_pattern.match(project.source.location):
                    secrets_found.append(
                        f"Token in {project.source.type} URL {project.source.location}"
                    )
                elif user_pass_pattern.match(project.source.location):
                    secrets_found.append(
                        f"Basic Auth Credentials in {project.source.type} URL {project.source.location}"
                    )
            for url in project.secondary_sources:
                if url.type == "BITBUCKET":
                    if token_pattern.match(url.location):
                        secrets_found.append(f"Token in {url.type} URL {url.location}")
                    elif user_pass_pattern.match(url.location):
                        secrets_found.append(
                            f"Basic Auth Credentials in {url.type} URL {url.location}"
                        )
            if secrets_found:
                report.status = "FAIL"
                report.status_extended = f"CodeBuild project {project.name} has sensitive credentials in source repository URLs: {', '.join(secrets_found)}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: codebuild_project_user_controlled_buildspec.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/codebuild/codebuild_project_user_controlled_buildspec/codebuild_project_user_controlled_buildspec.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "codebuild_project_user_controlled_buildspec",
  "CheckTitle": "CodeBuild project does not use a user-controlled buildspec file",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "codebuild",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsCodeBuildProject",
  "Description": "AWS CodeBuild projects are evaluated for use of a **user-controlled buildspec**, identified when the project references a repository file like `*.yml` or `*.yaml`. Projects using non file-based build instructions are treated as centrally managed.",
  "Risk": "Repository-controlled buildspecs let unreviewed changes run in CI, endangering **integrity** (tampered artifacts), **confidentiality** (secret leakage), and **availability** (resource abuse). Attackers can weaponize PRs to execute code and pivot via the build role.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/codebuild/latest/userguide/security.html",
    "https://support.icompaas.com/support/solutions/articles/62000229579-ensure-codebuild-project-with-an-user-controlled-buildspec",
    "https://docs.aws.amazon.com/codebuild/latest/userguide/change-project.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\nResources:\n  <example_resource_name>:\n    Type: AWS::CodeBuild::Project\n    Properties:\n      ServiceRole: <example_role_arn>\n      Artifacts:\n        Type: NO_ARTIFACTS\n      Environment:\n        Type: LINUX_CONTAINER\n        ComputeType: BUILD_GENERAL1_SMALL\n        Image: <IMAGE>\n      Source:\n        Type: CODEPIPELINE\n        BuildSpec: |  # Critical: Inline buildspec avoids using a user-controlled file path\n          version: 0.2\n```",
      "Other": "1. In the AWS Console, go to CodeBuild > Projects and open the target project\n2. Click Edit\n3. In Source, under Buildspec, select Insert build commands (not Use a buildspec file)\n4. Paste minimal inline YAML:\n   ```\n   version: 0.2\n   ```\n5. Save",
      "Terraform": "```hcl\nresource \"aws_codebuild_project\" \"<example_resource_name>\" {\n  name         = \"<example_resource_name>\"\n  service_role = \"<example_role_arn>\"\n\n  artifacts {\n    type = \"NO_ARTIFACTS\"\n  }\n\n  environment {\n    compute_type = \"BUILD_GENERAL1_SMALL\"\n    image        = \"<IMAGE>\"\n    type         = \"LINUX_CONTAINER\"\n  }\n\n  source {\n    type      = \"CODEPIPELINE\"\n    buildspec = <<EOT\nversion: 0.2\nEOT\n    # Critical: Inline buildspec avoids using a user-controlled buildspec file\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Adopt a **centrally managed buildspec** that contributors cannot modify.\n- Enforce protected branches and required reviews for build instructions\n- Apply **least privilege** to the build role and minimize secrets\n- Separate duties for pipeline admins vs code authors\n\nUse vetted, versioned templates for defense in depth.",
      "Url": "https://hub.prowler.com/check/codebuild_project_user_controlled_buildspec"
    }
  },
  "Categories": [
    "software-supply-chain",
    "ci-cd"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: codebuild_project_user_controlled_buildspec.py]---
Location: prowler-master/prowler/providers/aws/services/codebuild/codebuild_project_user_controlled_buildspec/codebuild_project_user_controlled_buildspec.py

```python
from re import search

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.codebuild.codebuild_client import codebuild_client


class codebuild_project_user_controlled_buildspec(Check):
    def execute(self):
        findings = []
        for project in codebuild_client.projects.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=project)
            report.status = "PASS"
            report.status_extended = f"CodeBuild project {project.name} does not use an user controlled buildspec."
            if project.buildspec:
                if search(r".*\.yaml$", project.buildspec) or search(
                    r".*\.yml$", project.buildspec
                ):
                    report.status = "FAIL"
                    report.status_extended = f"CodeBuild project {project.name} uses an user controlled buildspec."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: codebuild_project_uses_allowed_github_organizations.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/codebuild/codebuild_project_uses_allowed_github_organizations/codebuild_project_uses_allowed_github_organizations.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "codebuild_project_uses_allowed_github_organizations",
  "CheckTitle": "CodeBuild project using GitHub uses an allowed GitHub organization",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "codebuild",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsCodeBuildProject",
  "Description": "**CodeBuild projects** sourcing from **GitHub/GitHub Enterprise** with a service role that trusts CodeBuild are evaluated by deriving the repository's organization from its URL and comparing it to an **allowed organizations** list.",
  "Risk": "Using repos from **untrusted GitHub orgs** can let external workflows assume the project role and obtain AWS credentials.\n- Confidentiality: data/secrets exfiltration\n- Integrity: unauthorized changes\n- Availability: build abuse or service disruption",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://medium.com/@adan.alvarez/gaining-long-term-aws-access-with-codebuild-and-github-873324638784",
    "https://paul-hands-phd.medium.com/using-aws-codebuild-to-set-up-github-continuous-integration-19b92efbd094",
    "https://docs.aws.amazon.com/codebuild/latest/userguide/connections-github-app.html",
    "https://docs.aws.amazon.com/codebuild/latest/userguide/auth-and-access-control-iam-identity-based-access-control.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws codebuild update-project --name <example_resource_name> --source type=GITHUB,location=https://github.com/<ALLOWED_GITHUB_ORG>/<REPO>",
      "NativeIaC": "```yaml\n# CloudFormation: point CodeBuild project to a repo in an allowed GitHub org\nResources:\n  <example_resource_name>:\n    Type: AWS::CodeBuild::Project\n    Properties:\n      ServiceRole: <example_resource_arn>\n      Artifacts:\n        Type: NO_ARTIFACTS\n      Environment:\n        Type: LINUX_CONTAINER\n        ComputeType: BUILD_GENERAL1_SMALL\n        Image: aws/codebuild/standard:7.0\n      Source:\n        Type: GITHUB\n        Location: https://github.com/<ALLOWED_GITHUB_ORG>/<REPO>  # FIX: repo org must be in the allowed list\n```",
      "Other": "1. Open the AWS Console and go to CodeBuild > Build projects\n2. Select the project and click Edit\n3. In Source, set Repository URL to https://github.com/<ALLOWED_GITHUB_ORG>/<REPO>\n4. Click Update to save",
      "Terraform": "```hcl\n# Terraform: set CodeBuild source to a repo under an allowed GitHub org\nresource \"aws_codebuild_project\" \"<example_resource_name>\" {\n  name         = \"<example_resource_name>\"\n  service_role = \"<example_resource_arn>\"\n\n  artifacts { type = \"NO_ARTIFACTS\" }\n\n  environment {\n    compute_type = \"BUILD_GENERAL1_SMALL\"\n    image        = \"aws/codebuild/standard:7.0\"\n    type         = \"LINUX_CONTAINER\"\n  }\n\n  source {\n    type     = \"GITHUB\"\n    location = \"https://github.com/<ALLOWED_GITHUB_ORG>/<REPO>\" # FIX: use an allowed GitHub org\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Limit sources to **approved GitHub organizations** via an explicit allowlist. Enforce **least privilege** on the CodeBuild service role and avoid admin rights. Apply **separation of duties** for allowlist changes and add **defense in depth** (branch protections, reviews, monitoring) to prevent workflow abuse.",
      "Url": "https://hub.prowler.com/check/codebuild_project_uses_allowed_github_organizations"
    }
  },
  "Categories": [
    "software-supply-chain",
    "ci-cd"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: codebuild_project_uses_allowed_github_organizations.py]---
Location: prowler-master/prowler/providers/aws/services/codebuild/codebuild_project_uses_allowed_github_organizations/codebuild_project_uses_allowed_github_organizations.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.codebuild.codebuild_client import codebuild_client
from prowler.providers.aws.services.iam.iam_client import iam_client
from prowler.providers.aws.services.iam.lib.policy import (
    has_codebuild_trusted_principal,
    is_codebuild_using_allowed_github_org,
)


class codebuild_project_uses_allowed_github_organizations(Check):
    def execute(self):
        findings = []
        allowed_organizations = codebuild_client.audit_config.get(
            "codebuild_github_allowed_organizations", []
        )

        for project in codebuild_client.projects.values():
            if project.source and project.source.type in (
                "GITHUB",
                "GITHUB_ENTERPRISE",
            ):
                project_github_repo_url = project.source.location
                project_role = next(
                    (
                        role
                        for role in iam_client.roles
                        if role.arn == project.service_role_arn
                    ),
                    None,
                )
                project_iam_trust_policy = (
                    project_role.assume_role_policy if project_role else None
                )

                if not project_iam_trust_policy or not has_codebuild_trusted_principal(
                    project_iam_trust_policy
                ):
                    continue

                report = Check_Report_AWS(metadata=self.metadata(), resource=project)
                report.status = "PASS"

                is_allowed, org_name = is_codebuild_using_allowed_github_org(
                    project_iam_trust_policy,
                    project_github_repo_url,
                    allowed_organizations,
                )
                if org_name is not None:
                    if is_allowed:
                        report.status_extended = f"CodeBuild project {project.name} uses GitHub organization '{org_name}', which is in the allowed organizations."
                    else:
                        report.status = "FAIL"
                        report.status_extended = f"CodeBuild project {project.name} uses GitHub organization '{org_name}', which is not in the allowed organizations."

                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: codebuild_report_group_export_encrypted.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/codebuild/codebuild_report_group_export_encrypted/codebuild_report_group_export_encrypted.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "codebuild_report_group_export_encrypted",
  "CheckTitle": "CodeBuild report group exports to S3 are encrypted at rest",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls (USA)",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST CSF Controls (USA)",
    "Software and Configuration Checks/Industry and Regulatory Standards/PCI-DSS",
    "Software and Configuration Checks/Industry and Regulatory Standards/HIPAA Controls (USA)",
    "Software and Configuration Checks/Industry and Regulatory Standards/ISO 27001 Controls",
    "Software and Configuration Checks/Industry and Regulatory Standards/SOC 2"
  ],
  "ServiceName": "codebuild",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsCodeBuildProject",
  "Description": "**CodeBuild report groups** with export type `S3` are evaluated to confirm their exported test results are encrypted at rest with a **KMS key**.\n\nReport groups configured with `NO_EXPORT` are out of scope.",
  "Risk": "**Unencrypted S3 exports** leave report data in plaintext, weakening confidentiality.\n\nIf a bucket is misconfigured, compromised, or accessed by insiders, attackers can harvest test outputs for secrets, tokens, build paths, and system details, enabling credential theft and lateral movement.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/codebuild-controls.html#codebuild-7",
    "https://www.pulumi.com/registry/packages/aws/api-docs/codebuild/reportgroup/",
    "https://docs.aws.amazon.com/codebuild/latest/userguide/report-group-export-settings.html",
    "https://docs.aws.amazon.com/codebuild/latest/userguide/security-encryption.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/codebuild-controls.html",
    "https://docs.amazonaws.cn/en_us/codebuild/latest/userguide/report-group-export-settings.html",
    "https://docs.aws.amazon.com/codebuild/latest/userguide/test-report-group-create-console.html",
    "https://docs.aws.amazon.com/codebuild/latest/userguide/update-report-group-console.html",
    "https://docs.aws.amazon.com/codebuild/latest/userguide/report-group-create.html",
    "https://docs.amazonaws.cn/en_us/codebuild/latest/userguide/test-report-group-create-console.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws codebuild update-report-group --arn <report-group-arn> --export-config \"exportConfigType=S3,s3Destination={bucket=<bucket-name>,encryptionDisabled=false}\"",
      "NativeIaC": "```yaml\n# CloudFormation: Enable encryption for CodeBuild report group S3 exports\nResources:\n  <example_resource_name>:\n    Type: AWS::CodeBuild::ReportGroup\n    Properties:\n      Name: <example_resource_name>\n      Type: TEST\n      ExportConfig:\n        ExportConfigType: S3\n        S3Destination:\n          Bucket: <example_resource_name>\n          EncryptionDisabled: false  # Critical: ensures S3 exports are encrypted at rest\n          # Uses AWS managed key by default\n```",
      "Other": "1. Open the AWS Console and go to CodeBuild > Report groups\n2. Select the report group and click Edit\n3. Ensure Export to Amazon S3 is enabled and a bucket is set\n4. Expand Additional configuration and enable encryption by choosing Default AWS managed key (or select a KMS key)\n5. Ensure Disable artifact encryption is NOT selected\n6. Save changes",
      "Terraform": "```hcl\n# Enable encryption for CodeBuild report group S3 exports\nresource \"aws_codebuild_report_group\" \"<example_resource_name>\" {\n  name = \"<example_resource_name>\"\n  type = \"TEST\"\n\n  export_config {\n    type = \"S3\"\n    s3_destination {\n      bucket              = \"<example_resource_name>\"\n      encryption_disabled = false  # Critical: ensures S3 exports are encrypted at rest\n      # Uses AWS managed key by default\n    }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable at-rest encryption for report exports using **KMS** (prefer **customer managed keys**).\n\nApply least privilege: restrict key usage to the CodeBuild role and required principals, enable rotation, and audit key usage. Combine with S3 bucket policies for **defense in depth**.",
      "Url": "https://hub.prowler.com/check/codebuild_report_group_export_encrypted"
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

````
