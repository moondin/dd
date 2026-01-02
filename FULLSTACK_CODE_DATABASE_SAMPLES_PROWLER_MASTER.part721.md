---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 721
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 721 of 867)

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

---[FILE: repository_secret_scanning_enabled_test.py]---
Location: prowler-master/tests/providers/github/services/repository/repository_secret_scanning_enabled/repository_secret_scanning_enabled_test.py

```python
from datetime import datetime, timezone
from unittest import mock

from prowler.providers.github.services.repository.repository_service import Branch, Repo
from tests.providers.github.github_fixtures import set_mocked_github_provider


class Test_repository_secret_scanning_enabled:
    def test_no_repositories(self):
        repository_client = mock.MagicMock
        repository_client.repositories = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_secret_scanning_enabled.repository_secret_scanning_enabled.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_secret_scanning_enabled.repository_secret_scanning_enabled import (
                repository_secret_scanning_enabled,
            )

            check = repository_secret_scanning_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_one_repository_no_secret_scanning(self):
        repository_client = mock.MagicMock
        repo_name = "repo1"
        repository_client.repositories = {
            1: Repo(
                id=1,
                name=repo_name,
                owner="account-name",
                full_name="account-name/repo1",
                default_branch=Branch(
                    name="main",
                    protected=False,
                    default_branch=True,
                    require_pull_request=False,
                    approval_count=0,
                    required_linear_history=False,
                    allow_force_pushes=True,
                    branch_deletion=True,
                    status_checks=False,
                    enforce_admins=False,
                    require_code_owner_reviews=False,
                    require_signed_commits=False,
                    conversation_resolution=False,
                ),
                private=False,
                securitymd=True,
                codeowners_exists=False,
                secret_scanning_enabled=False,
                archived=False,
                pushed_at=datetime.now(timezone.utc),
                delete_branch_on_merge=False,
            ),
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_secret_scanning_enabled.repository_secret_scanning_enabled.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_secret_scanning_enabled.repository_secret_scanning_enabled import (
                repository_secret_scanning_enabled,
            )

            check = repository_secret_scanning_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == 1
            assert result[0].resource_name == repo_name
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Repository {repo_name} does not have secret scanning enabled to detect sensitive data."
            )

    def test_one_repository_with_secret_scanning(self):
        repository_client = mock.MagicMock
        repo_name = "repo2"
        repository_client.repositories = {
            2: Repo(
                id=2,
                name=repo_name,
                owner="account-name",
                full_name="account-name/repo2",
                default_branch=Branch(
                    name="main",
                    protected=False,
                    default_branch=True,
                    require_pull_request=False,
                    approval_count=0,
                    required_linear_history=False,
                    allow_force_pushes=True,
                    branch_deletion=True,
                    status_checks=False,
                    enforce_admins=False,
                    require_code_owner_reviews=False,
                    require_signed_commits=False,
                    conversation_resolution=False,
                ),
                private=False,
                securitymd=True,
                codeowners_exists=False,
                secret_scanning_enabled=True,
                archived=False,
                pushed_at=datetime.now(timezone.utc),
                delete_branch_on_merge=False,
            ),
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_secret_scanning_enabled.repository_secret_scanning_enabled.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_secret_scanning_enabled.repository_secret_scanning_enabled import (
                repository_secret_scanning_enabled,
            )

            check = repository_secret_scanning_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == 2
            assert result[0].resource_name == repo_name
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Repository {repo_name} has secret scanning enabled to detect sensitive data."
            )
```

--------------------------------------------------------------------------------

---[FILE: iac_fixtures.py]---
Location: prowler-master/tests/providers/iac/iac_fixtures.py

```python
# IAC Provider Constants
DEFAULT_SCAN_PATH = "."

# Sample Trivy Output
SAMPLE_TRIVY_OUTPUT = {
    "Results": [
        {
            "Target": "main.tf",
            "Type": "terraform",
            "Misconfigurations": [
                {
                    "ID": "AVD-AWS-0001",
                    "Title": "S3 bucket should have encryption enabled",
                    "Description": "S3 bucket should have encryption enabled",
                    "Message": "S3 bucket should have encryption enabled",
                    "Resolution": "Enable encryption on the S3 bucket",
                    "Severity": "LOW",
                    "PrimaryURL": "https://avd.aquasec.com/misconfig/aws/s3/avd-aws-0001",
                    "RuleID": "AVD-AWS-0001",
                    "CauseMetadata": {
                        "StartLine": 10,
                        "EndLine": 15,
                    },
                },
                {
                    "ID": "AVD-AWS-0002",
                    "Title": "S3 bucket should have public access blocked",
                    "Description": "S3 bucket should have public access blocked",
                    "Message": "S3 bucket should have public access blocked",
                    "Resolution": "Block public access on the S3 bucket",
                    "Severity": "LOW",
                    "PrimaryURL": "https://avd.aquasec.com/misconfig/aws/s3/avd-aws-0002",
                    "RuleID": "AVD-AWS-0002",
                    "CauseMetadata": {
                        "StartLine": 20,
                        "EndLine": 25,
                    },
                },
            ],
            "Vulnerabilities": [],
            "Secrets": [],
            "Licenses": [],
        },
        {
            "Target": "main.tf",
            "Type": "terraform",
            "Misconfigurations": [
                {
                    "ID": "AVD-AWS-0003",
                    "Title": "S3 bucket should have versioning enabled",
                    "Description": "S3 bucket should have versioning enabled",
                    "Message": "S3 bucket should have versioning enabled",
                    "Resolution": "Enable versioning on the S3 bucket",
                    "Severity": "LOW",
                    "PrimaryURL": "https://avd.aquasec.com/misconfig/aws/s3/avd-aws-0003",
                    "RuleID": "AVD-AWS-0003",
                    "CauseMetadata": {
                        "StartLine": 30,
                        "EndLine": 35,
                    },
                }
            ],
            "Vulnerabilities": [],
            "Secrets": [],
            "Licenses": [],
        },
    ]
}

# Sample Finding Data
SAMPLE_FINDING = SAMPLE_TRIVY_OUTPUT["Results"][0]

SAMPLE_FAILED_CHECK = {
    "ID": "AVD-AWS-0001",
    "Title": "S3 bucket should have encryption enabled",
    "Description": "S3 bucket should have encryption enabled",
    "Message": "S3 bucket should have encryption enabled",
    "Resolution": "Enable encryption on the S3 bucket",
    "Severity": "low",
    "PrimaryURL": "https://avd.aquasec.com/misconfig/aws/s3/avd-aws-0001",
    "RuleID": "AVD-AWS-0001",
    "CauseMetadata": {
        "StartLine": 10,
        "EndLine": 15,
    },
}

SAMPLE_PASSED_CHECK = {
    "ID": "AVD-AWS-0003",
    "Title": "S3 bucket should have versioning enabled",
    "Description": "S3 bucket should have versioning enabled",
    "Message": "S3 bucket should have versioning enabled",
    "Resolution": "Enable versioning on the S3 bucket",
    "Severity": "low",
    "PrimaryURL": "https://avd.aquasec.com/misconfig/aws/s3/avd-aws-0003",
    "RuleID": "AVD-AWS-0003",
    "CauseMetadata": {
        "StartLine": 30,
        "EndLine": 35,
    },
}

# Additional sample checks
SAMPLE_ANOTHER_FAILED_CHECK = {
    "ID": "AVD-AWS-0004",
    "Title": "S3 bucket should have logging enabled",
    "Description": "S3 bucket should have logging enabled",
    "Message": "S3 bucket should have logging enabled",
    "Resolution": "Enable logging on the S3 bucket",
    "Severity": "medium",
    "PrimaryURL": "https://avd.aquasec.com/misconfig/aws/s3/avd-aws-0004",
    "RuleID": "AVD-AWS-0004",
}

SAMPLE_ANOTHER_PASSED_CHECK = {
    "ID": "AVD-AWS-0005",
    "Title": "S3 bucket should have lifecycle policy",
    "Description": "S3 bucket should have lifecycle policy",
    "Message": "S3 bucket should have lifecycle policy",
    "Resolution": "Configure lifecycle policy on the S3 bucket",
    "Severity": "low",
    "PrimaryURL": "https://avd.aquasec.com/misconfig/aws/s3/avd-aws-0005",
    "RuleID": "AVD-AWS-0005",
}

SAMPLE_ANOTHER_SKIPPED_CHECK = {
    "ID": "AVD-AWS-0006",
    "Title": "S3 bucket should have object lock enabled",
    "Description": "S3 bucket should have object lock enabled",
    "Message": "S3 bucket should have object lock enabled",
    "Resolution": "Enable object lock on the S3 bucket",
    "Severity": "high",
    "PrimaryURL": "https://avd.aquasec.com/misconfig/aws/s3/avd-aws-0006",
    "RuleID": "AVD-AWS-0006",
    "Status": "MUTED",
}

SAMPLE_SKIPPED_CHECK = {
    "ID": "AVD-AWS-0007",
    "Title": "S3 bucket should have server-side encryption",
    "Description": "S3 bucket should have server-side encryption",
    "Message": "S3 bucket should have server-side encryption",
    "Resolution": "Enable server-side encryption on the S3 bucket",
    "Severity": "medium",
    "PrimaryURL": "https://avd.aquasec.com/misconfig/aws/s3/avd-aws-0007",
    "RuleID": "AVD-AWS-0007",
    "Status": "MUTED",
}

SAMPLE_HIGH_SEVERITY_CHECK = {
    "ID": "AVD-AWS-0008",
    "Title": "S3 bucket should have public access blocked",
    "Description": "S3 bucket should have public access blocked",
    "Message": "S3 bucket should have public access blocked",
    "Resolution": "Block public access on the S3 bucket",
    "Severity": "high",
    "PrimaryURL": "https://avd.aquasec.com/misconfig/aws/s3/avd-aws-0008",
    "RuleID": "AVD-AWS-0008",
}

# Dockerfile samples
SAMPLE_DOCKERFILE_REPORT = {
    "Target": "Dockerfile",
    "Type": "dockerfile",
    "Misconfigurations": [
        {
            "ID": "AVD-DOCKER-0001",
            "Title": "Base image should not use latest tag",
            "Description": "Base image should not use latest tag",
            "Message": "Base image should not use latest tag",
            "Resolution": "Use a specific version tag instead of latest",
            "Severity": "medium",
            "PrimaryURL": "https://avd.aquasec.com/misconfig/docker/dockerfile/avd-docker-0001",
            "RuleID": "AVD-DOCKER-0001",
        }
    ],
    "Vulnerabilities": [],
    "Secrets": [],
    "Licenses": [],
}

SAMPLE_DOCKERFILE_CHECK = {
    "ID": "AVD-DOCKER-0001",
    "Title": "Base image should not use latest tag",
    "Description": "Base image should not use latest tag",
    "Message": "Base image should not use latest tag",
    "Resolution": "Use a specific version tag instead of latest",
    "Severity": "medium",
    "PrimaryURL": "https://avd.aquasec.com/misconfig/docker/dockerfile/avd-docker-0001",
    "RuleID": "AVD-DOCKER-0001",
}

# YAML samples
SAMPLE_YAML_REPORT = {
    "Target": "deployment.yaml",
    "Type": "kubernetes",
    "Misconfigurations": [
        {
            "ID": "AVD-K8S-0001",
            "Title": "API server should not be exposed",
            "Description": "API server should not be exposed",
            "Message": "API server should not be exposed",
            "Resolution": "Do not expose the API server",
            "Severity": "high",
            "PrimaryURL": "https://avd.aquasec.com/misconfig/kubernetes/avd-k8s-0001",
            "RuleID": "AVD-K8S-0001",
        }
    ],
    "Vulnerabilities": [],
    "Secrets": [],
    "Licenses": [],
}

SAMPLE_YAML_CHECK = {
    "ID": "AVD-K8S-0001",
    "Title": "API server should not be exposed",
    "Description": "API server should not be exposed",
    "Message": "API server should not be exposed",
    "Resolution": "Do not expose the API server",
    "Severity": "high",
    "PrimaryURL": "https://avd.aquasec.com/misconfig/kubernetes/avd-k8s-0001",
    "RuleID": "AVD-K8S-0001",
}

# CloudFormation samples
SAMPLE_CLOUDFORMATION_CHECK = {
    "ID": "AVD-AWS-0009",
    "Title": "CloudFormation stack should have drift detection enabled",
    "Description": "CloudFormation stack should have drift detection enabled",
    "Message": "CloudFormation stack should have drift detection enabled",
    "Resolution": "Enable drift detection on the CloudFormation stack",
    "Severity": "low",
    "PrimaryURL": "https://avd.aquasec.com/misconfig/aws/cloudformation/avd-aws-0009",
    "RuleID": "AVD-AWS-0009",
}

# Kubernetes samples
SAMPLE_KUBERNETES_CHECK = {
    "ID": "AVD-K8S-0002",
    "Title": "RBAC should be enabled",
    "Description": "RBAC should be enabled",
    "Message": "RBAC should be enabled",
    "Resolution": "Enable RBAC on the cluster",
    "Severity": "medium",
    "PrimaryURL": "https://avd.aquasec.com/misconfig/kubernetes/avd-k8s-0002",
    "RuleID": "AVD-K8S-0002",
}

# Sample Trivy output with vulnerabilities
SAMPLE_TRIVY_VULNERABILITY_OUTPUT = {
    "Results": [
        {
            "Target": "package.json",
            "Type": "nodejs",
            "Misconfigurations": [],
            "Vulnerabilities": [
                {
                    "VulnerabilityID": "CVE-2023-1234",
                    "Title": "Example vulnerability",
                    "Description": "This is an example vulnerability",
                    "Severity": "high",
                    "PrimaryURL": "https://example.com/cve-2023-1234",
                }
            ],
            "Secrets": [],
            "Licenses": [],
        }
    ]
}

# Sample Trivy output with secrets
SAMPLE_TRIVY_SECRET_OUTPUT = {
    "Results": [
        {
            "Target": "config.yaml",
            "Class": "secret",
            "Misconfigurations": [],
            "Vulnerabilities": [],
            "Secrets": [
                {
                    "ID": "aws-access-key-id",
                    "Title": "AWS Access Key ID",
                    "Description": "AWS Access Key ID found in configuration",
                    "Severity": "critical",
                    "PrimaryURL": "https://example.com/secret-aws-access-key-id",
                }
            ],
            "Licenses": [],
        }
    ]
}


def get_sample_trivy_json_output():
    """Return sample Trivy JSON output as string"""
    import json

    return json.dumps(SAMPLE_TRIVY_OUTPUT)


def get_empty_trivy_output():
    """Return empty Trivy output as string"""
    import json

    return json.dumps({"Results": []})


def get_invalid_trivy_output():
    """Return invalid JSON output as string"""
    return "invalid json output"
```

--------------------------------------------------------------------------------

````
