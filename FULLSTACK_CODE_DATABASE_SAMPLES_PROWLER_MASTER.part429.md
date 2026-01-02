---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 429
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 429 of 867)

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

---[FILE: ocsf_test.py]---
Location: prowler-master/tests/lib/outputs/ocsf/ocsf_test.py

```python
import json
from datetime import datetime, timezone
from io import StringIO

import requests
from freezegun import freeze_time
from mock import patch
from py_ocsf_models.events.base_event import SeverityID, StatusID
from py_ocsf_models.events.findings.detection_finding import (
    DetectionFinding,
    DetectionFindingTypeID,
)
from py_ocsf_models.events.findings.finding import ActivityID, FindingInformation
from py_ocsf_models.objects.account import Account, TypeID
from py_ocsf_models.objects.cloud import Cloud
from py_ocsf_models.objects.group import Group
from py_ocsf_models.objects.metadata import Metadata
from py_ocsf_models.objects.organization import Organization
from py_ocsf_models.objects.product import Product
from py_ocsf_models.objects.remediation import Remediation
from py_ocsf_models.objects.resource_details import ResourceDetails

from prowler.config.config import prowler_version
from prowler.lib.outputs.ocsf.ocsf import OCSF
from tests.lib.outputs.fixtures.fixtures import generate_finding_output
from tests.providers.aws.utils import AWS_REGION_EU_WEST_1


class TestOCSF:
    # TODO: improve this test checking the fields
    def test_transform(self):
        findings = [
            generate_finding_output(
                status="FAIL",
                severity="low",
                muted=False,
                region=AWS_REGION_EU_WEST_1,
                resource_tags={"Name": "test", "Environment": "dev"},
            ),
            # Test with int timestamp (UNIX timestamp)
            generate_finding_output(
                status="FAIL",
                severity="medium",
                muted=False,
                region=AWS_REGION_EU_WEST_1,
                timestamp=1619600000,
            ),
        ]

        ocsf = OCSF(findings)

        output_data = ocsf.data[0]

        assert isinstance(output_data, DetectionFinding)
        assert output_data.activity_id == ActivityID.Create.value
        assert output_data.activity_name == ActivityID.Create.name
        assert output_data.message == findings[0].status_extended
        assert output_data.finding_info.created_time == int(
            findings[0].timestamp.timestamp()
        )
        assert output_data.finding_info.created_time_dt == findings[0].timestamp
        assert output_data.finding_info.desc == findings[0].metadata.Description
        assert output_data.finding_info.title == findings[0].metadata.CheckTitle
        assert output_data.finding_info.uid == findings[0].uid
        assert output_data.finding_info.types == ["test-type"]
        assert output_data.time == int(findings[0].timestamp.timestamp())
        assert output_data.time_dt == findings[0].timestamp
        assert (
            output_data.remediation.desc
            == findings[0].metadata.Remediation.Recommendation.Text
        )
        assert output_data.remediation.references == []
        assert output_data.severity_id == SeverityID.Low
        assert output_data.severity == SeverityID.Low.name
        assert output_data.status_id == StatusID.New.value
        assert output_data.status == StatusID.New.name
        assert output_data.status_code == findings[0].status
        assert output_data.status_detail == findings[0].status_extended
        assert output_data.risk_details == findings[0].metadata.Risk
        assert output_data.resources[0].labels == ["Name:test", "Environment:dev"]
        assert output_data.resources[0].name == findings[0].resource_name
        assert output_data.resources[0].uid == findings[0].resource_uid
        assert output_data.resources[0].type == findings[0].metadata.ResourceType
        assert output_data.resources[0].cloud_partition == findings[0].partition
        assert output_data.resources[0].region == findings[0].region
        assert output_data.resources[0].data == {
            "details": findings[0].resource_details,
            "metadata": {},
        }
        assert output_data.metadata.profiles == ["cloud", "datetime"]
        assert output_data.metadata.tenant_uid == "test-organization-id"
        assert output_data.metadata.event_code == findings[0].metadata.CheckID
        assert output_data.metadata.product.name == "Prowler"
        assert output_data.metadata.product.vendor_name == "Prowler"
        assert output_data.metadata.product.uid == "prowler"
        assert output_data.metadata.product.version == prowler_version
        assert output_data.type_uid == DetectionFindingTypeID.Create
        assert (
            output_data.type_name
            == f"Detection Finding: {DetectionFindingTypeID.Create.name}"
        )
        assert output_data.unmapped == {
            "related_url": findings[0].metadata.RelatedUrl,
            "categories": findings[0].metadata.Categories,
            "depends_on": findings[0].metadata.DependsOn,
            "related_to": findings[0].metadata.RelatedTo,
            "additional_urls": findings[0].metadata.AdditionalURLs,
            "notes": findings[0].metadata.Notes,
            "compliance": findings[0].compliance,
        }

        # Test with int timestamp (UNIX timestamp)
        output_data = ocsf.data[1]

        assert output_data.time == 1619600000
        assert output_data.time_dt == datetime.fromtimestamp(
            1619600000, tz=timezone.utc
        )

    def test_validate_ocsf(self):
        mock_file = StringIO()
        findings = [
            generate_finding_output(
                status="FAIL",
                severity="low",
                muted=False,
                region=AWS_REGION_EU_WEST_1,
                timestamp=datetime.now(),
                resource_details="resource_details",
                resource_name="resource_name",
                resource_uid="resource-id",
                status_extended="status extended",
            )
        ]

        output = OCSF(findings)
        output._file_descriptor = mock_file

        with patch.object(mock_file, "close", return_value=None):
            output.batch_write_data_to_file()

        mock_file.seek(0)
        content = mock_file.read()
        json_data = json.loads(content)
        url = "https://schema.ocsf.io/api/v2/validate"
        headers = {"content-type": "application/json"}
        response = requests.post(url, headers=headers, json=json_data[0])
        assert response.json()["error_count"] == 0

    @freeze_time(datetime.now())
    def test_batch_write_data_to_file(self):
        mock_file = StringIO()
        findings = [
            generate_finding_output(
                status="FAIL",
                severity="low",
                muted=False,
                region=AWS_REGION_EU_WEST_1,
                timestamp=datetime.now(),
                resource_details="resource_details",
                resource_name="resource_name",
                resource_uid="resource-id",
                status_extended="status extended",
            )
        ]

        expected_json_output = [
            {
                "message": "status extended",
                "metadata": {
                    "event_code": "service_test_check_id",
                    "product": {
                        "name": "Prowler",
                        "uid": "prowler",
                        "vendor_name": "Prowler",
                        "version": prowler_version,
                    },
                    "version": "1.5.0",
                    "profiles": ["cloud", "datetime"],
                    "tenant_uid": "test-organization-id",
                },
                "severity_id": 2,
                "severity": "Low",
                "status": "New",
                "status_code": "FAIL",
                "status_detail": "status extended",
                "status_id": 1,
                "unmapped": {
                    "related_url": "test-url",
                    "categories": ["test-category"],
                    "depends_on": ["test-dependency"],
                    "related_to": ["test-related-to"],
                    "additional_urls": [
                        "https://docs.aws.amazon.com/prescriptive-guidance/latest/migration-operations-integration/best-practices.html",
                        "https://docs.aws.amazon.com/prescriptive-guidance/latest/migration-operations-integration/introduction.html",
                    ],
                    "notes": "test-notes",
                    "compliance": {"test-compliance": "test-compliance"},
                },
                "activity_name": "Create",
                "activity_id": 1,
                "finding_info": {
                    "created_time": int(datetime.now().timestamp()),
                    "created_time_dt": datetime.now().isoformat(),
                    "desc": "check description",
                    "title": "service_test_check_id",
                    "uid": "test-unique-finding",
                    "types": ["test-type"],
                },
                "resources": [
                    {
                        "cloud_partition": "aws",
                        "region": "eu-west-1",
                        "data": {
                            "details": "resource_details",
                            "metadata": {},
                        },
                        "group": {"name": "service"},
                        "labels": [],
                        "name": "resource_name",
                        "type": "test-resource",
                        "uid": "resource-id",
                    }
                ],
                "category_name": "Findings",
                "category_uid": 2,
                "class_name": "Detection Finding",
                "class_uid": 2004,
                "cloud": {
                    "account": {
                        "name": "123456789012",
                        "type": "AWS Account",
                        "type_id": 10,
                        "uid": "123456789012",
                        "labels": ["test-tag:test-value"],
                    },
                    "org": {
                        "name": "test-organization",
                        "uid": "test-organization-id",
                    },
                    "provider": "aws",
                    "region": "eu-west-1",
                },
                "time": int(datetime.now().timestamp()),
                "time_dt": datetime.now().isoformat(),
                "remediation": {"desc": "", "references": []},
                "risk_details": "test-risk",
                "type_uid": 200401,
                "type_name": "Detection Finding: Create",
            }
        ]

        output = OCSF(findings)
        output._file_descriptor = mock_file

        with patch.object(mock_file, "close", return_value=None):
            output.batch_write_data_to_file()

        mock_file.seek(0)
        content = mock_file.read()
        assert json.loads(content) == expected_json_output

    def test_batch_write_data_to_file_without_findings(self):
        assert not OCSF([])._file_descriptor

    def test_finding_output_cloud_pass_low_muted(self):
        finding_output = generate_finding_output(
            status="PASS",
            severity="low",
            muted=True,
            region=AWS_REGION_EU_WEST_1,
            resource_tags={"Name": "test", "Environment": "dev"},
        )

        finding_ocsf = OCSF([finding_output])
        finding_ocsf = finding_ocsf.data[0]
        # Activity
        assert finding_ocsf.activity_id == ActivityID.Create.value
        assert finding_ocsf.activity_name == ActivityID.Create.name

        # Finding Information
        finding_information = finding_ocsf.finding_info

        assert isinstance(finding_information, FindingInformation)
        assert finding_information.created_time == int(
            finding_output.timestamp.timestamp()
        )
        assert finding_information.created_time_dt == finding_output.timestamp
        assert finding_information.desc == finding_output.metadata.Description
        assert finding_information.title == finding_output.metadata.CheckTitle
        assert finding_information.uid == finding_output.uid

        # Event time
        assert finding_ocsf.time == int(finding_output.timestamp.timestamp())
        assert finding_ocsf.time_dt == finding_output.timestamp

        # Remediation
        remediation = finding_ocsf.remediation
        assert isinstance(remediation, Remediation)
        assert (
            remediation.desc == finding_output.metadata.Remediation.Recommendation.Text
        )
        assert remediation.references == []

        # Severity
        assert finding_ocsf.severity_id == SeverityID.Low
        assert finding_ocsf.severity == SeverityID.Low.name

        # Status
        assert finding_ocsf.status_id == StatusID.Suppressed.value
        assert finding_ocsf.status == StatusID.Suppressed.name
        assert finding_ocsf.status_code == finding_output.status
        assert finding_ocsf.status_detail == finding_output.status_extended

        # Risk
        assert finding_ocsf.risk_details == finding_output.metadata.Risk

        # Unmapped Data
        assert finding_ocsf.unmapped == {
            "related_url": finding_output.metadata.RelatedUrl,
            "categories": finding_output.metadata.Categories,
            "depends_on": finding_output.metadata.DependsOn,
            "related_to": finding_output.metadata.RelatedTo,
            "additional_urls": finding_output.metadata.AdditionalURLs,
            "notes": finding_output.metadata.Notes,
            "compliance": finding_output.compliance,
        }

        # ResourceDetails
        resource_details = finding_ocsf.resources

        assert len(resource_details) == 1
        assert isinstance(resource_details, list)
        assert isinstance(resource_details[0], ResourceDetails)
        assert resource_details[0].labels == ["Name:test", "Environment:dev"]
        assert resource_details[0].name == finding_output.resource_name
        assert resource_details[0].data == {
            "details": finding_output.resource_details,
            "metadata": {},  # TODO: add metadata to the resource details
        }
        assert resource_details[0].type == finding_output.metadata.ResourceType
        assert resource_details[0].cloud_partition == finding_output.partition
        assert resource_details[0].region == finding_output.region
        assert resource_details[0].data == {
            "details": finding_output.resource_details,
            "metadata": {},
        }

        resource_details_group = resource_details[0].group
        assert isinstance(resource_details_group, Group)
        assert resource_details_group.name == finding_output.metadata.ServiceName

        # Metadata
        metadata = finding_ocsf.metadata
        assert isinstance(metadata, Metadata)
        assert metadata.event_code == finding_output.metadata.CheckID

        metadata_product = metadata.product
        assert isinstance(metadata_product, Product)
        assert metadata_product.name == "Prowler"
        assert metadata_product.vendor_name == "Prowler"
        assert metadata_product.version == prowler_version

        # Type
        assert finding_ocsf.type_uid == DetectionFindingTypeID.Create
        assert (
            finding_ocsf.type_name
            == f"Detection Finding: {DetectionFindingTypeID.Create.name}"
        )

        # Cloud
        cloud = finding_ocsf.cloud
        assert isinstance(cloud, Cloud)
        assert cloud.provider == "aws"
        assert cloud.region == finding_output.region

        cloud_account = cloud.account
        assert isinstance(cloud_account, Account)
        assert cloud_account.name == finding_output.account_name
        assert cloud_account.type_id == TypeID.AWS_Account
        assert cloud_account.type == TypeID.AWS_Account.name.replace("_", " ")
        assert cloud_account.uid == finding_output.account_uid
        assert cloud_account.labels == ["test-tag:test-value"]

        cloud_organization = cloud.org
        assert isinstance(cloud_organization, Organization)
        assert cloud_organization.uid == finding_output.account_organization_uid
        assert cloud_organization.name == finding_output.account_organization_name

    def test_finding_output_kubernetes(self):
        finding_output = generate_finding_output(
            status="PASS",
            severity="low",
            muted=True,
            region=AWS_REGION_EU_WEST_1,
            provider="kubernetes",
        )

        finding_ocsf = OCSF([finding_output])
        finding_ocsf = finding_ocsf.data[0]

        assert finding_ocsf.metadata.profiles == ["container", "datetime"]
        assert finding_ocsf.resources[0].namespace == finding_output.region.replace(
            "namespace: ", ""
        )

    def test_finding_output_cloud_fail_low_not_muted(self):
        finding_output = generate_finding_output(
            status="FAIL", severity="low", muted=False, region=AWS_REGION_EU_WEST_1
        )

        finding_ocsf = OCSF([finding_output])
        finding_ocsf = finding_ocsf.data[0]

        # Status
        assert finding_ocsf.status_id == StatusID.New.value
        assert finding_ocsf.status == StatusID.New.name
        assert finding_ocsf.status_code == finding_output.status
        assert finding_ocsf.status_detail == finding_output.status_extended

    def test_finding_output_cloud_pass_low_not_muted(self):
        finding_output = generate_finding_output(
            status="PASS", severity="low", muted=False, region=AWS_REGION_EU_WEST_1
        )

        finding_ocsf = OCSF([finding_output])
        finding_ocsf = finding_ocsf.data[0]

        # Status
        assert finding_ocsf.status_id == StatusID.New.value
        assert finding_ocsf.status == StatusID.New.name
        assert finding_ocsf.status_code == finding_output.status
        assert finding_ocsf.status_detail == finding_output.status_extended

    # Returns TypeID.AWS_Account when provider is 'aws'
    def test_returns_aws_account_when_provider_is_aws(self):
        provider = "aws"
        assert OCSF.get_account_type_id_by_provider(provider) == TypeID.AWS_Account

    # Returns TypeID.Azure_AD_Account when provider is 'azure'
    def test_returns_azure_ad_account_when_provider_is_azure(self):
        provider = "azure"
        assert OCSF.get_account_type_id_by_provider(provider) == TypeID.Azure_AD_Account

    # Returns TypeID.GCP_Account when provider is 'gcp'
    def test_returns_gcp_account_when_provider_is_gcp(self):
        provider = "gcp"
        assert OCSF.get_account_type_id_by_provider(provider) == TypeID.GCP_Account

    # Returns TypeID.Other when provider is None
    def test_returns_other_when_provider_is_none(self):
        provider = "None"
        assert OCSF.get_account_type_id_by_provider(provider) == TypeID.Other

    # Returns StatusID.New when muted is False
    def test_new_when_not_muted(self):
        muted = False
        assert OCSF.get_finding_status_id(muted) == StatusID.New

    # Returns StatusID.Suppressed when muted is True
    def test_suppressed_when_muted(self):
        muted = True
        assert OCSF.get_finding_status_id(muted) == StatusID.Suppressed
```

--------------------------------------------------------------------------------

---[FILE: output_options_test.py]---
Location: prowler-master/tests/lib/outputs/output_options/output_options_test.py

```python
from argparse import Namespace
from datetime import datetime
from os import rmdir
from unittest import mock

from freezegun import freeze_time

from prowler.config.config import output_file_timestamp
from prowler.providers.aws.models import AWSOutputOptions
from prowler.providers.azure.models import AzureOutputOptions
from prowler.providers.gcp.models import GCPOutputOptions
from prowler.providers.kubernetes.models import KubernetesOutputOptions


class Test_Output_Options:
    @freeze_time(datetime.today())
    def test_set_output_options_aws_no_output_filename(self):
        arguments = Namespace()
        arguments.status = ["FAIL"]
        arguments.output_formats = ["csv"]
        arguments.output_directory = "output_test_directory"
        arguments.verbose = True
        arguments.security_hub = True
        arguments.shodan = None
        arguments.only_logs = False
        arguments.unix_timestamp = False
        arguments.send_sh_only_fails = True

        identity = mock.MagicMock()
        identity.account = "123456789012"

        output_options = AWSOutputOptions(arguments, {}, identity)

        assert output_options.status == ["FAIL"]
        assert output_options.output_modes == ["csv", "json-asff"]
        assert output_options.output_directory == "output_test_directory"
        assert output_options.verbose
        assert output_options.security_hub_enabled
        assert not output_options.shodan_api_key
        assert not output_options.only_logs
        assert not output_options.unix_timestamp
        assert output_options.send_sh_only_fails
        assert (
            output_options.output_filename
            == f"prowler-output-{identity.account}-{output_file_timestamp}"
        )
        assert output_options.bulk_checks_metadata == {}

        rmdir(f"{arguments.output_directory}/compliance")
        rmdir(arguments.output_directory)

    @freeze_time(datetime.today())
    def test_set_output_options_aws(self):
        arguments = Namespace()
        arguments.status = []
        arguments.output_formats = ["csv"]
        arguments.output_directory = "output_test_directory"
        arguments.verbose = True
        arguments.output_filename = "output_test_filename"
        arguments.security_hub = True
        arguments.shodan = None
        arguments.only_logs = False
        arguments.unix_timestamp = False
        arguments.send_sh_only_fails = True

        identity = mock.MagicMock()
        identity.account = "123456789012"

        output_options = AWSOutputOptions(arguments, {}, identity)

        assert isinstance(output_options, AWSOutputOptions)
        assert output_options.security_hub_enabled
        assert output_options.send_sh_only_fails
        assert output_options.status == []
        assert output_options.output_modes == ["csv", "json-asff"]
        assert output_options.output_directory == arguments.output_directory
        assert output_options.bulk_checks_metadata == {}
        assert output_options.verbose
        assert output_options.output_filename == arguments.output_filename

        rmdir(f"{arguments.output_directory}/compliance")
        rmdir(arguments.output_directory)

    @freeze_time(datetime.today())
    def test_azure_provider_output_options_with_domain(self):
        arguments = Namespace()
        # Output Options
        arguments.output_formats = ["csv"]
        arguments.output_directory = "output_test_directory"
        output_directory = arguments.output_directory
        arguments.status = []
        arguments.verbose = True
        arguments.only_logs = False
        arguments.unix_timestamp = False
        arguments.shodan = None

        identity = mock.MagicMock()
        identity.tenant_domain = "test-domain"

        output_options = AzureOutputOptions(
            arguments,
            {},
            identity,
        )

        assert isinstance(output_options, AzureOutputOptions)
        assert output_options.status == []
        assert output_options.output_modes == [
            "csv",
        ]
        assert output_options.output_directory == output_directory
        assert output_options.bulk_checks_metadata == {}
        assert output_options.verbose
        assert (
            output_options.output_filename
            == f"prowler-output-{identity.tenant_domain}-{output_file_timestamp}"
        )

        rmdir(f"{arguments.output_directory}/compliance")
        rmdir(arguments.output_directory)

    @freeze_time(datetime.today())
    def test_gcp_output_options(self):
        arguments = Namespace()
        # Output options
        arguments.status = []
        arguments.output_formats = ["csv"]
        arguments.output_directory = "output_test_directory"
        arguments.verbose = True
        arguments.only_logs = False
        arguments.unix_timestamp = False
        arguments.shodan = None

        identity = mock.MagicMock()
        identity.profile = "test-profile"

        output_optionss = GCPOutputOptions(
            arguments,
            {},
            identity,
        )

        assert isinstance(output_optionss, GCPOutputOptions)
        assert output_optionss.status == []
        assert output_optionss.output_modes == [
            "csv",
        ]
        assert output_optionss.output_directory == arguments.output_directory
        assert output_optionss.bulk_checks_metadata == {}
        assert output_optionss.verbose
        assert f"prowler-output-{identity.profile}" in output_optionss.output_filename

        rmdir(f"{arguments.output_directory}/compliance")
        rmdir(arguments.output_directory)

    def test_set_output_options_kubernetes(self):
        arguments = Namespace()
        arguments.status = []
        arguments.output_formats = ["csv"]
        arguments.output_directory = "output_test_directory"
        arguments.verbose = True
        arguments.output_filename = "output_test_filename"
        arguments.only_logs = False
        arguments.unix_timestamp = False
        arguments.shodan = None

        identity = mock.MagicMock()
        identity.context = "test-context"

        output_options = KubernetesOutputOptions(
            arguments,
            {},
            identity,
        )

        assert isinstance(output_options, KubernetesOutputOptions)
        assert output_options.status == []
        assert output_options.output_modes == ["csv"]
        assert output_options.output_directory == arguments.output_directory
        assert output_options.bulk_checks_metadata == {}
        assert output_options.verbose
        assert output_options.output_filename == arguments.output_filename

        rmdir(f"{arguments.output_directory}/compliance")
        rmdir(arguments.output_directory)
```

--------------------------------------------------------------------------------

````
