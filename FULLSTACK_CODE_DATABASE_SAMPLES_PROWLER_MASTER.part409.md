---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 409
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 409 of 867)

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

---[FILE: objectstorage_bucket_not_publicly_accessible.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/objectstorage/objectstorage_bucket_not_publicly_accessible/objectstorage_bucket_not_publicly_accessible.py

```python
"""Check if Object Storage buckets are not publicly accessible."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.objectstorage.objectstorage_client import (
    objectstorage_client,
)


class objectstorage_bucket_not_publicly_accessible(Check):
    """Check if Object Storage buckets are not publicly accessible."""

    def execute(self) -> Check_Report_OCI:
        """Execute the objectstorage_bucket_not_publicly_accessible check.

        Returns:
            List of Check_Report_OCI objects with findings
        """
        findings = []

        for bucket in objectstorage_client.buckets:
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource=bucket,
                region=bucket.region,
                resource_name=bucket.name,
                resource_id=bucket.id,
                compartment_id=bucket.compartment_id,
            )

            # Check if bucket has public access
            # NoPublicAccess means the bucket is not publicly accessible
            if bucket.public_access_type == "NoPublicAccess":
                report.status = "PASS"
                report.status_extended = (
                    f"Bucket {bucket.name} is not publicly accessible."
                )
            else:
                report.status = "FAIL"
                report.status_extended = f"Bucket {bucket.name} has public access type: {bucket.public_access_type}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: objectstorage_bucket_versioning_enabled.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/objectstorage/objectstorage_bucket_versioning_enabled/objectstorage_bucket_versioning_enabled.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "objectstorage_bucket_versioning_enabled",
  "CheckTitle": "Ensure Versioning is Enabled for Object Storage Buckets",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS OCI Foundations Benchmark"
  ],
  "ServiceName": "objectstorage",
  "SubServiceName": "",
  "ResourceIdTemplate": "oci:objectstorage:bucket",
  "Severity": "medium",
  "ResourceType": "OciBucket",
  "Description": "Object Storage buckets should have versioning enabled.",
  "Risk": "Not meeting this storage security requirement increases data security risk.",
  "RelatedUrl": "https://docs.oracle.com/en-us/iaas/Content/Object/home.htm",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/oci/OCI-ObjectStorage/enable-versioning.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure Versioning is Enabled for Object Storage Buckets",
      "Url": "https://hub.prowler.com/check/oci/objectstorage_bucket_versioning_enabled"
    }
  },
  "Categories": [
    "storage",
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: objectstorage_bucket_versioning_enabled.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/objectstorage/objectstorage_bucket_versioning_enabled/objectstorage_bucket_versioning_enabled.py

```python
"""Check Ensure Versioning is Enabled for Object Storage Buckets."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.objectstorage.objectstorage_client import (
    objectstorage_client,
)


class objectstorage_bucket_versioning_enabled(Check):
    """Check Ensure Versioning is Enabled for Object Storage Buckets."""

    def execute(self) -> Check_Report_OCI:
        """Execute the objectstorage_bucket_versioning_enabled check."""
        findings = []

        # Check buckets have versioning enabled
        for bucket in objectstorage_client.buckets:
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource=bucket,
                region=bucket.region,
                resource_name=bucket.name,
                resource_id=bucket.id,
                compartment_id=bucket.compartment_id,
            )

            if bucket.versioning and bucket.versioning == "Enabled":
                report.status = "PASS"
                report.status_extended = f"Bucket {bucket.name} has versioning enabled."
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"Bucket {bucket.name} does not have versioning enabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: setup-git-hooks.sh]---
Location: prowler-master/scripts/setup-git-hooks.sh

```bash
#!/bin/bash

# Setup Git Hooks for Prowler
# This script installs pre-commit hooks using the project's Poetry environment

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 Setting up Prowler Git Hooks"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo -e "${RED}❌ Not in a git repository${NC}"
  exit 1
fi

# Check if Poetry is installed
if ! command -v poetry &>/dev/null; then
  echo -e "${RED}❌ Poetry is not installed${NC}"
  echo -e "${YELLOW}   Install Poetry: https://python-poetry.org/docs/#installation${NC}"
  exit 1
fi

# Check if pyproject.toml exists
if [ ! -f "pyproject.toml" ]; then
  echo -e "${RED}❌ pyproject.toml not found${NC}"
  echo -e "${YELLOW}   Please run this script from the repository root${NC}"
  exit 1
fi

# Check if dependencies are already installed
if ! poetry run python -c "import pre_commit" 2>/dev/null; then
  echo -e "${YELLOW}📦 Installing project dependencies (including pre-commit)...${NC}"
  poetry install --with dev
else
  echo -e "${GREEN}✓${NC} Dependencies already installed"
fi

echo ""
# Clear any existing core.hooksPath to avoid pre-commit conflicts
if git config --get core.hooksPath >/dev/null 2>&1; then
  echo -e "${YELLOW}🧹 Clearing existing core.hooksPath configuration...${NC}"
  git config --unset-all core.hooksPath
fi

echo -e "${YELLOW}🔗 Installing pre-commit hooks...${NC}"
poetry run pre-commit install

echo ""
echo -e "${GREEN}✅ Git hooks successfully configured!${NC}"
echo ""
echo -e "${YELLOW}📋 Pre-commit system:${NC}"
echo -e "   • Python pre-commit manages all git hooks"
echo -e "   • API files: Python checks (black, flake8, bandit, etc.)"
echo -e "   • UI files: UI checks (TypeScript, ESLint, Claude Code validation)"
echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
```

--------------------------------------------------------------------------------

---[FILE: config_test.py]---
Location: prowler-master/tests/config/config_test.py

```python
import logging
import os
import pathlib
from unittest import mock

from requests import Response

from prowler.config.config import (
    check_current_version,
    get_available_compliance_frameworks,
    load_and_validate_config_file,
    load_and_validate_fixer_config_file,
)

MOCK_PROWLER_VERSION = "3.3.0"
MOCK_OLD_PROWLER_VERSION = "0.0.0"
MOCK_PROWLER_MASTER_VERSION = "3.4.0"


def mock_prowler_get_latest_release(_, **kwargs):
    """Mock requests.get() to get the Prowler latest release"""
    response = Response()
    response._content = b'[{"name":"3.3.0"}]'
    return response


old_config_aws = {
    "shodan_api_key": None,
    "max_security_group_rules": 50,
    "max_ec2_instance_age_in_days": 180,
    "ec2_allowed_interface_types": ["api_gateway_managed", "vpc_endpoint"],
    "ec2_allowed_instance_owners": ["amazon-elb"],
    "trusted_account_ids": [],
    "log_group_retention_days": 365,
    "max_idle_disconnect_timeout_in_seconds": 600,
    "max_disconnect_timeout_in_seconds": 300,
    "max_session_duration_seconds": 36000,
    "obsolete_lambda_runtimes": [
        "java8",
        "go1.x",
        "provided",
        "python3.6",
        "python2.7",
        "python3.7",
        "nodejs4.3",
        "nodejs4.3-edge",
        "nodejs6.10",
        "nodejs",
        "nodejs8.10",
        "nodejs10.x",
        "nodejs12.x",
        "nodejs14.x",
        "dotnet5.0",
        "dotnetcore1.0",
        "dotnetcore2.0",
        "dotnetcore2.1",
        "dotnetcore3.1",
        "ruby2.5",
        "ruby2.7",
    ],
    "organizations_enabled_regions": [],
    "organizations_trusted_delegated_administrators": [],
    "check_rds_instance_replicas": False,
    "days_to_expire_threshold": 7,
    "eks_required_log_types": [
        "api",
        "audit",
        "authenticator",
        "controllerManager",
        "scheduler",
    ],
}
config_aws = {
    "mute_non_default_regions": False,
    "max_unused_access_keys_days": 45,
    "max_console_access_days": 45,
    "shodan_api_key": None,
    "max_security_group_rules": 50,
    "max_ec2_instance_age_in_days": 180,
    "ec2_allowed_interface_types": ["api_gateway_managed", "vpc_endpoint"],
    "ec2_allowed_instance_owners": ["amazon-elb"],
    "ec2_high_risk_ports": [
        25,
        110,
        135,
        143,
        445,
        3000,
        4333,
        5000,
        5500,
        8080,
        8088,
    ],
    "fargate_linux_latest_version": "1.4.0",
    "fargate_windows_latest_version": "1.0.0",
    "trusted_account_ids": [],
    "log_group_retention_days": 365,
    "max_idle_disconnect_timeout_in_seconds": 600,
    "max_disconnect_timeout_in_seconds": 300,
    "max_session_duration_seconds": 36000,
    "obsolete_lambda_runtimes": [
        "java8",
        "go1.x",
        "provided",
        "python3.6",
        "python2.7",
        "python3.7",
        "nodejs4.3",
        "nodejs4.3-edge",
        "nodejs6.10",
        "nodejs",
        "nodejs8.10",
        "nodejs10.x",
        "nodejs12.x",
        "nodejs14.x",
        "dotnet5.0",
        "dotnetcore1.0",
        "dotnetcore2.0",
        "dotnetcore2.1",
        "dotnetcore3.1",
        "ruby2.5",
        "ruby2.7",
    ],
    "lambda_min_azs": 2,
    "organizations_enabled_regions": [],
    "organizations_trusted_delegated_administrators": [],
    "ecr_repository_vulnerability_minimum_severity": "MEDIUM",
    "verify_premium_support_plans": True,
    "threat_detection_privilege_escalation_threshold": 0.2,
    "threat_detection_privilege_escalation_minutes": 1440,
    "threat_detection_privilege_escalation_actions": [
        "AddPermission",
        "AddRoleToInstanceProfile",
        "AddUserToGroup",
        "AssociateAccessPolicy",
        "AssumeRole",
        "AttachGroupPolicy",
        "AttachRolePolicy",
        "AttachUserPolicy",
        "ChangePassword",
        "CreateAccessEntry",
        "CreateAccessKey",
        "CreateDevEndpoint",
        "CreateEventSourceMapping",
        "CreateFunction",
        "CreateGroup",
        "CreateJob",
        "CreateKeyPair",
        "CreateLoginProfile",
        "CreatePipeline",
        "CreatePolicyVersion",
        "CreateRole",
        "CreateStack",
        "DeleteRolePermissionsBoundary",
        "DeleteRolePolicy",
        "DeleteUserPermissionsBoundary",
        "DeleteUserPolicy",
        "DetachRolePolicy",
        "DetachUserPolicy",
        "GetCredentialsForIdentity",
        "GetId",
        "GetPolicyVersion",
        "GetUserPolicy",
        "Invoke",
        "ModifyInstanceAttribute",
        "PassRole",
        "PutGroupPolicy",
        "PutPipelineDefinition",
        "PutRolePermissionsBoundary",
        "PutRolePolicy",
        "PutUserPermissionsBoundary",
        "PutUserPolicy",
        "ReplaceIamInstanceProfileAssociation",
        "RunInstances",
        "SetDefaultPolicyVersion",
        "UpdateAccessKey",
        "UpdateAssumeRolePolicy",
        "UpdateDevEndpoint",
        "UpdateEventSourceMapping",
        "UpdateFunctionCode",
        "UpdateJob",
        "UpdateLoginProfile",
    ],
    "threat_detection_enumeration_threshold": 0.3,
    "threat_detection_enumeration_minutes": 1440,
    "threat_detection_enumeration_actions": [
        "DescribeAccessEntry",
        "DescribeAccountAttributes",
        "DescribeAvailabilityZones",
        "DescribeBundleTasks",
        "DescribeCarrierGateways",
        "DescribeClientVpnRoutes",
        "DescribeCluster",
        "DescribeDhcpOptions",
        "DescribeFlowLogs",
        "DescribeImages",
        "DescribeInstanceAttribute",
        "DescribeInstanceInformation",
        "DescribeInstanceTypes",
        "DescribeInstances",
        "DescribeInstances",
        "DescribeKeyPairs",
        "DescribeLogGroups",
        "DescribeLogStreams",
        "DescribeOrganization",
        "DescribeRegions",
        "DescribeSecurityGroups",
        "DescribeSnapshotAttribute",
        "DescribeSnapshotTierStatus",
        "DescribeSubscriptionFilters",
        "DescribeTransitGatewayMulticastDomains",
        "DescribeVolumes",
        "DescribeVolumesModifications",
        "DescribeVpcEndpointConnectionNotifications",
        "DescribeVpcs",
        "GetAccount",
        "GetAccountAuthorizationDetails",
        "GetAccountSendingEnabled",
        "GetBucketAcl",
        "GetBucketLogging",
        "GetBucketPolicy",
        "GetBucketReplication",
        "GetBucketVersioning",
        "GetCallerIdentity",
        "GetCertificate",
        "GetConsoleScreenshot",
        "GetCostAndUsage",
        "GetDetector",
        "GetEbsDefaultKmsKeyId",
        "GetEbsEncryptionByDefault",
        "GetFindings",
        "GetFlowLogsIntegrationTemplate",
        "GetIdentityVerificationAttributes",
        "GetInstances",
        "GetIntrospectionSchema",
        "GetLaunchTemplateData",
        "GetLaunchTemplateData",
        "GetLogRecord",
        "GetParameters",
        "GetPolicyVersion",
        "GetPublicAccessBlock",
        "GetQueryResults",
        "GetRegions",
        "GetSMSAttributes",
        "GetSMSSandboxAccountStatus",
        "GetSendQuota",
        "GetTransitGatewayRouteTableAssociations",
        "GetUserPolicy",
        "HeadObject",
        "ListAccessKeys",
        "ListAccounts",
        "ListAllMyBuckets",
        "ListAssociatedAccessPolicies",
        "ListAttachedUserPolicies",
        "ListClusters",
        "ListDetectors",
        "ListDomains",
        "ListFindings",
        "ListHostedZones",
        "ListIPSets",
        "ListIdentities",
        "ListInstanceProfiles",
        "ListObjects",
        "ListOrganizationalUnitsForParent",
        "ListOriginationNumbers",
        "ListPolicyVersions",
        "ListRoles",
        "ListRoles",
        "ListRules",
        "ListServiceQuotas",
        "ListSubscriptions",
        "ListTargetsByRule",
        "ListTopics",
        "ListUsers",
        "LookupEvents",
        "Search",
    ],
    "threat_detection_llm_jacking_threshold": 0.4,
    "threat_detection_llm_jacking_minutes": 1440,
    "threat_detection_llm_jacking_actions": [
        "PutUseCaseForModelAccess",
        "PutFoundationModelEntitlement",
        "PutModelInvocationLoggingConfiguration",
        "CreateFoundationModelAgreement",
        "InvokeModel",
        "InvokeModelWithResponseStream",
        "GetUseCaseForModelAccess",
        "GetModelInvocationLoggingConfiguration",
        "GetFoundationModelAvailability",
        "ListFoundationModelAgreementOffers",
        "ListFoundationModels",
        "ListProvisionedModelThroughputs",
    ],
    "check_rds_instance_replicas": False,
    "days_to_expire_threshold": 7,
    "insecure_key_algorithms": [
        "RSA-1024",
        "P-192",
    ],
    "eks_required_log_types": [
        "api",
        "audit",
        "authenticator",
        "controllerManager",
        "scheduler",
    ],
    "eks_cluster_oldest_version_supported": "1.28",
    "excluded_sensitive_environment_variables": [],
    "minimum_snapshot_retention_period": 7,
    "elb_min_azs": 2,
    "elbv2_min_azs": 2,
    "secrets_ignore_patterns": [],
    "max_days_secret_unused": 90,
    "max_days_secret_unrotated": 90,
}

config_azure = {
    "shodan_api_key": None,
    "php_latest_version": "8.2",
    "python_latest_version": "3.12",
    "java_latest_version": "17",
    "recommended_minimal_tls_versions": ["1.2", "1.3"],
    "desired_vm_sku_sizes": [
        "Standard_A8_v2",
        "Standard_DS3_v2",
        "Standard_D4s_v3",
    ],
    "defender_attack_path_minimal_risk_level": "High",
}

config_gcp = {"shodan_api_key": None, "max_unused_account_days": 30}

config_kubernetes = {
    "audit_log_maxbackup": 10,
    "audit_log_maxsize": 100,
    "audit_log_maxage": 30,
    "apiserver_strong_ciphers": [
        "TLS_AES_128_GCM_SHA256",
        "TLS_AES_256_GCM_SHA384",
        "TLS_CHACHA20_POLY1305_SHA256",
    ],
    "kubelet_strong_ciphers": [
        "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256",
        "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256",
        "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305",
        "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384",
        "TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305",
        "TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384",
        "TLS_RSA_WITH_AES_256_GCM_SHA384",
        "TLS_RSA_WITH_AES_128_GCM_SHA256",
    ],
}


class Test_Config:
    @mock.patch(
        "prowler.config.config.requests.get", new=mock_prowler_get_latest_release
    )
    @mock.patch("prowler.config.config.prowler_version", new=MOCK_PROWLER_VERSION)
    def test_check_current_version_with_latest(self):
        assert (
            check_current_version()
            == f"Prowler {MOCK_PROWLER_VERSION} (You are running the latest version, yay!)"
        )

    @mock.patch(
        "prowler.config.config.requests.get", new=mock_prowler_get_latest_release
    )
    @mock.patch("prowler.config.config.prowler_version", new=MOCK_OLD_PROWLER_VERSION)
    def test_check_current_version_with_old(self):
        assert (
            check_current_version()
            == f"Prowler {MOCK_OLD_PROWLER_VERSION} (latest is {MOCK_PROWLER_VERSION}, upgrade for the latest features)"
        )

    @mock.patch(
        "prowler.config.config.requests.get", new=mock_prowler_get_latest_release
    )
    @mock.patch(
        "prowler.config.config.prowler_version", new=MOCK_PROWLER_MASTER_VERSION
    )
    def test_check_current_version_with_master_version(self):
        assert (
            check_current_version()
            == f"Prowler {MOCK_PROWLER_MASTER_VERSION} (You are running the latest version, yay!)"
        )

    def test_get_available_compliance_frameworks(self):
        compliance_frameworks = [
            "cisa_aws",
            "soc2_aws",
            "cis_1.4_aws",
            "cis_1.5_aws",
            "mitre_attack_aws",
            "gdpr_aws",
            "aws_foundational_security_best_practices_aws",
            "iso27001_2013_aws",
            "hipaa_aws",
            "cis_2.0_aws",
            "gxp_21_cfr_part_11_aws",
            "aws_well_architected_framework_security_pillar_aws",
            "gxp_eu_annex_11_aws",
            "nist_800_171_revision_2_aws",
            "nist_800_53_revision_4_aws",
            "nist_800_53_revision_5_aws",
            "ens_rd2022_aws",
            "nist_csf_1.1_aws",
            "aws_well_architected_framework_reliability_pillar_aws",
            "aws_audit_manager_control_tower_guardrails_aws",
            "rbi_cyber_security_framework_aws",
            "ffiec_aws",
            "pci_3.2.1_aws",
            "fedramp_moderate_revision_4_aws",
            "fedramp_low_revision_4_aws",
            "cis_2.0_gcp",
            "cis_1.8_kubernetes",
            "kisa_isms-p_2023_aws",
            "kisa_isms-p_2023-korean_aws",
        ]
        assert (
            get_available_compliance_frameworks().sort() == compliance_frameworks.sort()
        )

    def test_load_and_validate_config_file_aws(self):
        path = pathlib.Path(os.path.dirname(os.path.realpath(__file__)))
        config_test_file = f"{path}/fixtures/config.yaml"
        provider = "aws"
        assert load_and_validate_config_file(provider, config_test_file) == config_aws

    def test_load_and_validate_config_file_gcp(self):
        path = pathlib.Path(os.path.dirname(os.path.realpath(__file__)))
        config_test_file = f"{path}/fixtures/config.yaml"
        provider = "gcp"

        assert load_and_validate_config_file(provider, config_test_file) == config_gcp

    def test_load_and_validate_config_file_kubernetes(self):
        path = pathlib.Path(os.path.dirname(os.path.realpath(__file__)))
        config_test_file = f"{path}/fixtures/config.yaml"
        provider = "kubernetes"
        assert (
            load_and_validate_config_file(provider, config_test_file)
            == config_kubernetes
        )

    def test_load_and_validate_config_file_azure(self):
        path = pathlib.Path(os.path.dirname(os.path.realpath(__file__)))
        config_test_file = f"{path}/fixtures/config.yaml"
        provider = "azure"

        assert load_and_validate_config_file(provider, config_test_file) == config_azure

    def test_load_and_validate_config_file_old_format(self):
        path = pathlib.Path(os.path.dirname(os.path.realpath(__file__)))
        config_test_file = f"{path}/fixtures/config_old.yaml"
        assert load_and_validate_config_file("aws", config_test_file) == old_config_aws
        assert load_and_validate_config_file("gcp", config_test_file) == {}
        assert load_and_validate_config_file("azure", config_test_file) == {}
        assert load_and_validate_config_file("kubernetes", config_test_file) == {}

    def test_load_and_validate_config_file_invalid_config_file_path(self, caplog):
        provider = "aws"
        config_file_path = "invalid/path/to/fixer_config.yaml"

        with caplog.at_level(logging.ERROR):
            result = load_and_validate_config_file(provider, config_file_path)
            assert "FileNotFoundError" in caplog.text
            assert result == {}

    def test_load_and_validate_fixer_config_aws(self):
        path = pathlib.Path(os.path.dirname(os.path.realpath(__file__)))
        config_test_file = f"{path}/fixtures/fixer_config.yaml"
        provider = "aws"

        assert load_and_validate_fixer_config_file(provider, config_test_file)

    def test_load_and_validate_fixer_config_gcp(self):
        path = pathlib.Path(os.path.dirname(os.path.realpath(__file__)))
        config_test_file = f"{path}/fixtures/fixer_config.yaml"
        provider = "gcp"

        assert load_and_validate_fixer_config_file(provider, config_test_file) == {}

    def test_load_and_validate_fixer_config_kubernetes(self):
        path = pathlib.Path(os.path.dirname(os.path.realpath(__file__)))
        config_test_file = f"{path}/fixtures/fixer_config.yaml"
        provider = "kubernetes"

        assert load_and_validate_fixer_config_file(provider, config_test_file) == {}

    def test_load_and_validate_fixer_config_azure(self):
        path = pathlib.Path(os.path.dirname(os.path.realpath(__file__)))
        config_test_file = f"{path}/fixtures/fixer_config.yaml"
        provider = "azure"

        assert load_and_validate_fixer_config_file(provider, config_test_file) == {}

    def test_load_and_validate_fixer_config_invalid_fixer_config_path(self, caplog):
        provider = "aws"
        fixer_config_path = "invalid/path/to/fixer_config.yaml"

        with caplog.at_level(logging.ERROR):
            result = load_and_validate_fixer_config_file(provider, fixer_config_path)
            assert "FileNotFoundError" in caplog.text
            assert result == {}
```

--------------------------------------------------------------------------------

---[FILE: config.yaml]---
Location: prowler-master/tests/config/fixtures/config.yaml

```yaml
# AWS Configuration
aws:
  # AWS Global Configuration
  # aws.mute_non_default_regions --> Set to True to muted failed findings in non-default regions for AccessAnalyzer, GuardDuty, SecurityHub, DRS and Config
  mute_non_default_regions: False
  # If you want to mute failed findings only in specific regions, create a file with the following syntax and run it with `prowler aws -w mutelist.yaml`:
  # Mutelist:
  #  Accounts:
  #   "*":
  #     Checks:
  #       "*":
  #         Regions:
  #           - "ap-southeast-1"
  #           - "ap-southeast-2"
  #         Resources:
  #           - "*"

  # AWS IAM Configuration
  # aws.iam_user_accesskey_unused --> CIS recommends 45 days
  max_unused_access_keys_days: 45
  # aws.iam_user_console_access_unused --> CIS recommends 45 days
  max_console_access_days: 45

  # AWS EC2 Configuration
  # aws.ec2_elastic_ip_shodan
  # TODO: create common config
  shodan_api_key: null
  # aws.ec2_securitygroup_with_many_ingress_egress_rules --> by default is 50 rules
  max_security_group_rules: 50
  # aws.ec2_instance_older_than_specific_days --> by default is 6 months (180 days)
  max_ec2_instance_age_in_days: 180
  # aws.ec2_securitygroup_allow_ingress_from_internet_to_any_port
  # allowed network interface types for security groups open to the Internet
  ec2_allowed_interface_types:
    [
        "api_gateway_managed",
        "vpc_endpoint",
    ]
  # allowed network interface owners for security groups open to the Internet
  ec2_allowed_instance_owners:
    [
        "amazon-elb"
    ]
  # aws.ec2_securitygroup_allow_ingress_from_internet_to_high_risk_tcp_ports
  ec2_high_risk_ports:
    [
        25,
        110,
        135,
        143,
        445,
        3000,
        4333,
        5000,
        5500,
        8080,
        8088,
    ]

  # AWS ECS Configuration
  # aws.ecs_service_fargate_latest_platform_version
  fargate_linux_latest_version: "1.4.0"
  fargate_windows_latest_version: "1.0.0"

  # AWS VPC Configuration (vpc_endpoint_connections_trust_boundaries, vpc_endpoint_services_allowed_principals_trust_boundaries)
  # AWS SSM Configuration (aws.ssm_documents_set_as_public)
  # Single account environment: No action required. The AWS account number will be automatically added by the checks.
  # Multi account environment: Any additional trusted account number should be added as a space separated list, e.g.
  # trusted_account_ids : ["123456789012", "098765432109", "678901234567"]
  trusted_account_ids: []

  # AWS Cloudwatch Configuration
  # aws.cloudwatch_log_group_retention_policy_specific_days_enabled --> by default is 365 days
  log_group_retention_days: 365

  # AWS AppStream Session Configuration
  # aws.appstream_fleet_session_idle_disconnect_timeout
  max_idle_disconnect_timeout_in_seconds: 600 # 10 Minutes
  # aws.appstream_fleet_session_disconnect_timeout
  max_disconnect_timeout_in_seconds: 300 # 5 Minutes
  # aws.appstream_fleet_maximum_session_duration
  max_session_duration_seconds: 36000 # 10 Hours

  # AWS Lambda Configuration
  # aws.awslambda_function_using_supported_runtimes
  obsolete_lambda_runtimes:
    [
      "java8",
      "go1.x",
      "provided",
      "python3.6",
      "python2.7",
      "python3.7",
      "nodejs4.3",
      "nodejs4.3-edge",
      "nodejs6.10",
      "nodejs",
      "nodejs8.10",
      "nodejs10.x",
      "nodejs12.x",
      "nodejs14.x",
      "dotnet5.0",
      "dotnetcore1.0",
      "dotnetcore2.0",
      "dotnetcore2.1",
      "dotnetcore3.1",
      "ruby2.5",
      "ruby2.7",
    ]
  # aws.awslambda_function_vpc_is_in_multi_azs
  lambda_min_azs: 2

  # AWS Organizations
  # aws.organizations_scp_check_deny_regions
  # aws.organizations_enabled_regions: [
  #   "eu-central-1",
  #   "eu-west-1",
  #   "us-east-1"
  # ]
  organizations_enabled_regions: []
  organizations_trusted_delegated_administrators: []

  # AWS ECR
  # aws.ecr_repositories_scan_vulnerabilities_in_latest_image
  # CRITICAL
  # HIGH
  # MEDIUM
  ecr_repository_vulnerability_minimum_severity: "MEDIUM"

  # AWS Trusted Advisor
  # aws.trustedadvisor_premium_support_plan_subscribed
  verify_premium_support_plans: True

  # AWS CloudTrail Configuration
  # aws.cloudtrail_threat_detection_privilege_escalation
  threat_detection_privilege_escalation_threshold: 0.2 # Percentage of actions found to decide if it is an privilege_escalation attack event, by default is 0.2 (20%)
  threat_detection_privilege_escalation_minutes: 1440 # Past minutes to search from now for privilege_escalation attacks, by default is 1440 minutes (24 hours)
  threat_detection_privilege_escalation_actions:
    [
      "AddPermission",
      "AddRoleToInstanceProfile",
      "AddUserToGroup",
      "AssociateAccessPolicy",
      "AssumeRole",
      "AttachGroupPolicy",
      "AttachRolePolicy",
      "AttachUserPolicy",
      "ChangePassword",
      "CreateAccessEntry",
      "CreateAccessKey",
      "CreateDevEndpoint",
      "CreateEventSourceMapping",
      "CreateFunction",
      "CreateGroup",
      "CreateJob",
      "CreateKeyPair",
      "CreateLoginProfile",
      "CreatePipeline",
      "CreatePolicyVersion",
      "CreateRole",
      "CreateStack",
      "DeleteRolePermissionsBoundary",
      "DeleteRolePolicy",
      "DeleteUserPermissionsBoundary",
      "DeleteUserPolicy",
      "DetachRolePolicy",
      "DetachUserPolicy",
      "GetCredentialsForIdentity",
      "GetId",
      "GetPolicyVersion",
      "GetUserPolicy",
      "Invoke",
      "ModifyInstanceAttribute",
      "PassRole",
      "PutGroupPolicy",
      "PutPipelineDefinition",
      "PutRolePermissionsBoundary",
      "PutRolePolicy",
      "PutUserPermissionsBoundary",
      "PutUserPolicy",
      "ReplaceIamInstanceProfileAssociation",
      "RunInstances",
      "SetDefaultPolicyVersion",
      "UpdateAccessKey",
      "UpdateAssumeRolePolicy",
      "UpdateDevEndpoint",
      "UpdateEventSourceMapping",
      "UpdateFunctionCode",
      "UpdateJob",
      "UpdateLoginProfile",
    ]
  # aws.cloudtrail_threat_detection_enumeration
  threat_detection_enumeration_threshold: 0.3 # Percentage of actions found to decide if it is an enumeration attack event, by default is 0.3 (30%)
  threat_detection_enumeration_minutes: 1440 # Past minutes to search from now for enumeration attacks, by default is 1440 minutes (24 hours)
  threat_detection_enumeration_actions:
    [
      "DescribeAccessEntry",
      "DescribeAccountAttributes",
      "DescribeAvailabilityZones",
      "DescribeBundleTasks",
      "DescribeCarrierGateways",
      "DescribeClientVpnRoutes",
      "DescribeCluster",
      "DescribeDhcpOptions",
      "DescribeFlowLogs",
      "DescribeImages",
      "DescribeInstanceAttribute",
      "DescribeInstanceInformation",
      "DescribeInstanceTypes",
      "DescribeInstances",
      "DescribeInstances",
      "DescribeKeyPairs",
      "DescribeLogGroups",
      "DescribeLogStreams",
      "DescribeOrganization",
      "DescribeRegions",
      "DescribeSecurityGroups",
      "DescribeSnapshotAttribute",
      "DescribeSnapshotTierStatus",
      "DescribeSubscriptionFilters",
      "DescribeTransitGatewayMulticastDomains",
      "DescribeVolumes",
      "DescribeVolumesModifications",
      "DescribeVpcEndpointConnectionNotifications",
      "DescribeVpcs",
      "GetAccount",
      "GetAccountAuthorizationDetails",
      "GetAccountSendingEnabled",
      "GetBucketAcl",
      "GetBucketLogging",
      "GetBucketPolicy",
      "GetBucketReplication",
      "GetBucketVersioning",
      "GetCallerIdentity",
      "GetCertificate",
      "GetConsoleScreenshot",
      "GetCostAndUsage",
      "GetDetector",
      "GetEbsDefaultKmsKeyId",
      "GetEbsEncryptionByDefault",
      "GetFindings",
      "GetFlowLogsIntegrationTemplate",
      "GetIdentityVerificationAttributes",
      "GetInstances",
      "GetIntrospectionSchema",
      "GetLaunchTemplateData",
      "GetLaunchTemplateData",
      "GetLogRecord",
      "GetParameters",
      "GetPolicyVersion",
      "GetPublicAccessBlock",
      "GetQueryResults",
      "GetRegions",
      "GetSMSAttributes",
      "GetSMSSandboxAccountStatus",
      "GetSendQuota",
      "GetTransitGatewayRouteTableAssociations",
      "GetUserPolicy",
      "HeadObject",
      "ListAccessKeys",
      "ListAccounts",
      "ListAllMyBuckets",
      "ListAssociatedAccessPolicies",
      "ListAttachedUserPolicies",
      "ListClusters",
      "ListDetectors",
      "ListDomains",
      "ListFindings",
      "ListHostedZones",
      "ListIPSets",
      "ListIdentities",
      "ListInstanceProfiles",
      "ListObjects",
      "ListOrganizationalUnitsForParent",
      "ListOriginationNumbers",
      "ListPolicyVersions",
      "ListRoles",
      "ListRoles",
      "ListRules",
      "ListServiceQuotas",
      "ListSubscriptions",
      "ListTargetsByRule",
      "ListTopics",
      "ListUsers",
      "LookupEvents",
      "Search",
    ]
  # aws.cloudtrail_threat_detection_llm_jacking
  threat_detection_llm_jacking_threshold: 0.4 # Percentage of actions found to decide if it is an LLM Jacking attack event, by default is 0.4 (40%)
  threat_detection_llm_jacking_minutes: 1440 # Past minutes to search from now for LLM Jacking attacks, by default is 1440 minutes (24 hours)
  threat_detection_llm_jacking_actions:
    [
    "PutUseCaseForModelAccess",  # Submits a use case for model access, providing justification (Write).
    "PutFoundationModelEntitlement",  # Grants entitlement for accessing a foundation model (Write).
    "PutModelInvocationLoggingConfiguration", # Configures logging for model invocations (Write).
    "CreateFoundationModelAgreement",  # Creates a new agreement to use a foundation model (Write).
    "InvokeModel",  # Invokes a specified Bedrock model for inference using provided prompt and parameters (Read).
    "InvokeModelWithResponseStream",  # Invokes a Bedrock model for inference with real-time token streaming (Read).
    "GetUseCaseForModelAccess",  # Retrieves an existing use case for model access (Read).
    "GetModelInvocationLoggingConfiguration",  # Fetches the logging configuration for model invocations (Read).
    "GetFoundationModelAvailability",  # Checks the availability of a foundation model for use (Read).
    "ListFoundationModelAgreementOffers",  # Lists available agreement offers for accessing foundation models (List).
    "ListFoundationModels",  # Lists the available foundation models in Bedrock (List).
    "ListProvisionedModelThroughputs",  # Lists the provisioned throughput for previously created models (List).
    ]

  # AWS RDS Configuration
  # aws.rds_instance_backup_enabled
  # Whether to check RDS instance replicas or not
  check_rds_instance_replicas: False

  # AWS ACM Configuration
  # aws.acm_certificates_expiration_check
  days_to_expire_threshold: 7
  # aws.acm_certificates_with_secure_key_algorithms
  insecure_key_algorithms:
    [
      "RSA-1024",
      "P-192",
    ]

  # AWS EKS Configuration
  # aws.eks_control_plane_logging_all_types_enabled
  # EKS control plane logging types that must be enabled
  eks_required_log_types:
    [
        "api",
        "audit",
        "authenticator",
        "controllerManager",
        "scheduler",
    ]
  # aws.eks_cluster_uses_a_supported_version
  # EKS clusters must be version 1.28 or higher
  eks_cluster_oldest_version_supported: "1.28"

  # AWS CodeBuild Configuration
  # aws.codebuild_project_no_secrets_in_variables
  # CodeBuild sensitive variables that are excluded from the check
  excluded_sensitive_environment_variables:
    [

    ]

  # AWS ELB Configuration
  # aws.elb_is_in_multiple_az
  # Minimum number of Availability Zones that an CLB must be in
  elb_min_azs: 2

  # AWS ELBv2 Configuration
  # aws.elbv2_is_in_multiple_az
  # Minimum number of Availability Zones that an ELBv2 must be in
  elbv2_min_azs: 2

  # AWS Elasticache Configuration
  # aws.elasticache_redis_cluster_backup_enabled
  # Minimum number of days that a Redis cluster must have backups retention period
  minimum_snapshot_retention_period: 7

  # AWS Secrets Configuration
  # Patterns to ignore in the secrets checks
  secrets_ignore_patterns: []

  # AWS Secrets Manager Configuration
  # aws.secretsmanager_secret_unused
  # Maximum number of days a secret can be unused
  max_days_secret_unused: 90

  # aws.secretsmanager_secret_rotated_periodically
  # Maximum number of days a secret should be rotated
  max_days_secret_unrotated: 90

# Azure Configuration
azure:
  # Azure Network Configuration
  # azure.network_public_ip_shodan
  # TODO: create common config
  shodan_api_key: null
    # Configurable minimal risk level for attack path notifications
  defender_attack_path_minimal_risk_level: "High"

  # Azure App Service
  # azure.app_ensure_php_version_is_latest
  php_latest_version: "8.2"
  # azure.app_ensure_python_version_is_latest
  python_latest_version: "3.12"
  # azure.app_ensure_java_version_is_latest
  java_latest_version: "17"

  # Azure SQL Server
  # azure.sqlserver_minimal_tls_version
  recommended_minimal_tls_versions:
    [
      "1.2",
      "1.3"
    ]

  # Azure Virtual Machines
  # azure.vm_desired_sku_size
  # List of desired VM SKU sizes that are allowed in the organization
  desired_vm_sku_sizes:
    [
      "Standard_A8_v2",
      "Standard_DS3_v2",
      "Standard_D4s_v3",
    ]

# GCP Configuration
gcp:
  # GCP Compute Configuration
  # gcp.compute_public_address_shodan
  shodan_api_key: null
  max_unused_account_days: 30

# Kubernetes Configuration
kubernetes:
  # Kubernetes API Server
  # kubernetes.apiserver_audit_log_maxbackup_set
  audit_log_maxbackup: 10
  # kubernetes.apiserver_audit_log_maxsize_set
  audit_log_maxsize: 100
  # kubernetes.apiserver_audit_log_maxage_set
  audit_log_maxage: 30
  # kubernetes.apiserver_strong_ciphers_only
  apiserver_strong_ciphers:
    [
      "TLS_AES_128_GCM_SHA256",
      "TLS_AES_256_GCM_SHA384",
      "TLS_CHACHA20_POLY1305_SHA256",
    ]
  # Kubelet
  # kubernetes.kubelet_strong_ciphers_only
  kubelet_strong_ciphers:
    [
      "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256",
      "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256",
      "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305",
      "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384",
      "TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305",
      "TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384",
      "TLS_RSA_WITH_AES_256_GCM_SHA384",
      "TLS_RSA_WITH_AES_128_GCM_SHA256",
    ]

# M365 Configuration
m365:
  # Conditional Access Policy
  # policy.session_controls.sign_in_frequency.frequency in hours
  sign_in_frequency: 4
  # Teams Settings
  # m365.teams_external_file_sharing_restricted
  allowed_cloud_storage_services:
    [
      #"allow_box",
      #"allow_drop_box",
      #"allow_egnyte",
      #"allow_google_drive",
      #"allow_share_file",
    ]
  # Exchange Organization Settings
  # m365.exchange_organization_mailtips_enabled
  recommended_mailtips_large_audience_threshold: 25 # maximum number of recipients
  # Defender Malware Policy Settings
  # m365.defender_malware_policy_comprehensive_attachments_filter_applied
  # The recommended list of file extensions to be blocked, this can be changed depending on the organization needs
  default_recommended_extensions:
    [
      "ace", "ani", "apk", "app", "appx", "arj", "bat", "cab", "cmd", "com",
      "deb", "dex", "dll", "docm", "elf", "exe", "hta", "img", "iso", "jar",
      "jnlp", "kext", "lha", "lib", "library", "lnk", "lzh", "macho", "msc",
      "msi", "msix", "msp", "mst", "pif", "ppa", "ppam", "reg", "rev", "scf",
      "scr", "sct", "sys", "uif", "vb", "vbe", "vbs", "vxd", "wsc", "wsf",
      "wsh", "xll", "xz", "z"
    ]
  # Exchange Mailbox Settings
  # m365.exchange_mailbox_properties_auditing_enabled
  audit_log_age: 90 # maximum number of days to keep audit logs
```

--------------------------------------------------------------------------------

````
