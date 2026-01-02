---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 442
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 442 of 867)

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

---[FILE: metadata.json]---
Location: prowler-master/tests/providers/aws/lib/security_hub/fixtures/metadata.json

```json
{
  "Categories": [
    "cat-one",
    "cat-two"
  ],
  "CheckID": "iam_user_accesskey_unused",
  "CheckTitle": "Ensure Access Keys unused are disabled",
  "CheckType": [
    "Software and Configuration Checks"
  ],
  "Compliance": [
    {
      "Control": [
        "4.4"
      ],
      "Framework": "CIS-AWS",
      "Group": [
        "level1",
        "level2"
      ],
      "Version": "1.4"
    }
  ],
  "DependsOn": [
    "othercheck1",
    "othercheck2"
  ],
  "Description": "Ensure Access Keys unused are disabled",
  "Notes": "additional information",
  "Provider": "aws",
  "RelatedTo": [
    "othercheck3",
    "othercheck4"
  ],
  "RelatedUrl": "https://serviceofficialsiteorpageforthissubject",
  "Remediation": {
    "Code": {
      "CLI": "cli command or URL to the cli command location.",
      "NativeIaC": "code or URL to the code location.",
      "Other": "cli command or URL to the cli command location.",
      "Terraform": "code or URL to the code location."
    },
    "Recommendation": {
      "Text": "Run sudo yum update and cross your fingers and toes.",
      "Url": "https://myfp.com/recommendations/dangerous_things_and_how_to_fix_them.html"
    }
  },
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "ResourceType": "AwsIamAccessAnalyzer",
  "Risk": "Risk associated.",
  "ServiceName": "iam",
  "Severity": "low",
  "SubServiceName": "accessanalyzer",
  "Tags": {
    "Tag1Key": "value",
    "Tag2Key": "value"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: service_test.py]---
Location: prowler-master/tests/providers/aws/lib/service/service_test.py

```python
from mock import patch

from prowler.providers.aws.lib.service.service import AWSService
from tests.providers.aws.utils import (
    AWS_ACCOUNT_ARN,
    AWS_ACCOUNT_NUMBER,
    AWS_COMMERCIAL_PARTITION,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


def mock_generate_regional_clients(provider, service):
    regional_client = provider._session.current_session.client(
        service, region_name=AWS_REGION_US_EAST_1
    )
    regional_client.region = AWS_REGION_US_EAST_1
    return {AWS_REGION_US_EAST_1: regional_client}


@patch(
    "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
    new=mock_generate_regional_clients,
)
class TestAWSService:
    def test_AWSService_init(self):
        service_name = "s3"
        provider = set_mocked_aws_provider()
        service = AWSService(service_name, provider)

        assert service.provider == provider
        assert service.audited_account == AWS_ACCOUNT_NUMBER
        assert service.audited_account_arn == AWS_ACCOUNT_ARN
        assert service.audited_partition == AWS_COMMERCIAL_PARTITION
        assert service.audit_resources == []
        assert service.audited_checks == []
        assert service.session == provider.session.current_session
        assert service.service == service_name
        assert len(service.regional_clients) == 1
        assert (
            service.regional_clients[AWS_REGION_US_EAST_1].__class__.__name__
            == service_name.upper()
        )
        assert service.region == AWS_REGION_US_EAST_1
        assert service.client.__class__.__name__ == service_name.upper()

    def test_AWSService_init_global_service(self):
        service_name = "cloudfront"
        provider = set_mocked_aws_provider()
        service = AWSService(service_name, provider, global_service=True)

        assert service.provider == provider
        assert service.audited_account == AWS_ACCOUNT_NUMBER
        assert service.audited_account_arn == AWS_ACCOUNT_ARN
        assert service.audited_partition == AWS_COMMERCIAL_PARTITION
        assert service.audit_resources == []
        assert service.audited_checks == []
        assert service.session == provider.session.current_session
        assert service.service == service_name
        assert not hasattr(service, "regional_clients")
        assert service.region == AWS_REGION_US_EAST_1
        assert service.client.__class__.__name__ == "CloudFront"

    def test_AWSService_set_failed_check(self):

        AWSService.failed_checks.clear()

        check_id = "ec2_securitygroup_allow_ingress_from_internet_to_all_ports"
        arn = "arn:aws:ec2:eu-central-1:123456789:security-group/sg-12345678"

        assert (check_id, arn) not in AWSService.failed_checks

        AWSService.set_failed_check(check_id, arn)

        assert (check_id, arn) in AWSService.failed_checks

    def test_AWSService_is_failed_check(self):

        AWSService.failed_checks.clear()

        check_id = "ec2_securitygroup_allow_ingress_from_internet_to_all_ports"
        arn = "arn:aws:ec2:eu-central-1:123456789:security-group/sg-12345678"

        assert not AWSService.is_failed_check(check_id, arn)

        AWSService.set_failed_check(check_id, arn)

        assert AWSService.is_failed_check(check_id, arn)
        assert not AWSService.is_failed_check(
            check_id,
            "arn:aws:ec2:eu-central-1:123456789:security-group/sg-87654321",
        )

    def test_AWSService_get_unknown_arn(self):
        service_name = "s3"
        provider = set_mocked_aws_provider()
        service = AWSService(service_name, provider)

        assert (
            service.get_unknown_arn(region="eu-west-1")
            == f"arn:aws:{service_name}:eu-west-1:{AWS_ACCOUNT_NUMBER}:unknown"
        )

    def test_AWSService_get_unknown_arn_cn_partition(self):
        service_name = "s3"
        provider = set_mocked_aws_provider()
        service = AWSService(service_name, provider)
        service.audited_partition = "aws-cn"

        assert (
            service.get_unknown_arn(region="eu-west-1")
            == f"arn:{service.audited_partition}:{service_name}:eu-west-1:{AWS_ACCOUNT_NUMBER}:unknown"
        )

    def test_AWSService_get_unknown_arn_no_region(self):
        service_name = "s3"
        provider = set_mocked_aws_provider()
        service = AWSService(service_name, provider)

        assert (
            service.get_unknown_arn()
            == f"arn:aws:{service_name}::{AWS_ACCOUNT_NUMBER}:unknown"
        )

    def test_AWSService_get_unknown_arn_resource_type_set(self):
        service_name = "s3"
        provider = set_mocked_aws_provider()
        service = AWSService(service_name, provider)

        assert (
            service.get_unknown_arn(resource_type="bucket")
            == f"arn:aws:{service_name}::{AWS_ACCOUNT_NUMBER}:bucket/unknown"
        )

    def test_AWSService_get_unknown_arn_resource_type_set_cn_partition(self):
        service_name = "s3"
        provider = set_mocked_aws_provider()
        service = AWSService(service_name, provider)
        service.audited_partition = "aws-cn"

        assert (
            service.get_unknown_arn(resource_type="bucket")
            == f"arn:{service.audited_partition}:{service_name}::{AWS_ACCOUNT_NUMBER}:bucket/unknown"
        )

    def test_AWSService_get_unknown_arn_resource_type_set_region(self):
        service_name = "s3"
        provider = set_mocked_aws_provider()
        service = AWSService(service_name, provider)

        assert (
            service.get_unknown_arn(region="eu-west-1", resource_type="bucket")
            == f"arn:aws:{service_name}:eu-west-1:{AWS_ACCOUNT_NUMBER}:bucket/unknown"
        )
```

--------------------------------------------------------------------------------

---[FILE: accessanalyzer_service_test.py]---
Location: prowler-master/tests/providers/aws/services/accessanalyzer/accessanalyzer_service_test.py

```python
from unittest.mock import patch

import botocore

from prowler.providers.aws.services.accessanalyzer.accessanalyzer_service import (
    AccessAnalyzer,
)
from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

# Mocking Access Analyzer Calls
make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    """
    Mock every AWS API call using Boto3

    As you can see the operation_name has the list_analyzers snake_case form but
    we are using the ListAnalyzers form.
    Rationale -> https://github.com/boto/botocore/blob/develop/botocore/client.py#L810:L816
    """
    if operation_name == "ListAnalyzers":
        return {
            "analyzers": [
                {
                    "arn": "ARN",
                    "name": "Test Analyzer",
                    "status": "ACTIVE",
                    "findings": 0,
                    "tags": {"test": "test"},
                    "type": "ACCOUNT",
                    "region": "eu-west-1",
                }
            ]
        }
    if operation_name == "ListFindings":
        # If we only want to count the number of findings
        # we return a list of values just to count them
        return {
            "findings": [
                {
                    "id": "test_id1",
                }
            ]
        }
    if operation_name == "GetFinding":
        # If we only want to count the number of findings
        # we return a list of values just to count them
        return {"finding": {"id": "test_id1", "status": "ARCHIVED"}}
    return make_api_call(self, operation_name, kwarg)


def mock_generate_regional_clients(provider, service):
    regional_client = provider._session.current_session.client(
        service, region_name=AWS_REGION_EU_WEST_1
    )
    regional_client.region = AWS_REGION_EU_WEST_1
    return {AWS_REGION_EU_WEST_1: regional_client}


# Patch every AWS call using Boto3 and generate_regional_clients to have 1 client
@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
@patch(
    "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
    new=mock_generate_regional_clients,
)
class Test_AccessAnalyzer_Service:
    # Test AccessAnalyzer Client
    def test_get_client(self):
        access_analyzer = AccessAnalyzer(
            set_mocked_aws_provider([AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1])
        )
        assert (
            access_analyzer.regional_clients[AWS_REGION_EU_WEST_1].__class__.__name__
            == "AccessAnalyzer"
        )

    # Test AccessAnalyzer Session
    def test__get_session__(self):
        access_analyzer = AccessAnalyzer(
            set_mocked_aws_provider([AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1])
        )
        assert access_analyzer.session.__class__.__name__ == "Session"

    # Test AccessAnalyzer Service
    def test__get_service__(self):
        access_analyzer = AccessAnalyzer(
            set_mocked_aws_provider([AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1])
        )
        assert access_analyzer.service == "accessanalyzer"

    def test_list_analyzers(self):
        access_analyzer = AccessAnalyzer(
            set_mocked_aws_provider([AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1])
        )
        assert len(access_analyzer.analyzers) == 1
        assert access_analyzer.analyzers[0].arn == "ARN"
        assert access_analyzer.analyzers[0].name == "Test Analyzer"
        assert access_analyzer.analyzers[0].status == "ACTIVE"
        assert access_analyzer.analyzers[0].tags == [{"test": "test"}]
        assert access_analyzer.analyzers[0].type == "ACCOUNT"
        assert access_analyzer.analyzers[0].region == AWS_REGION_EU_WEST_1

    def test_list_findings(self):
        access_analyzer = AccessAnalyzer(
            set_mocked_aws_provider([AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1])
        )
        assert len(access_analyzer.analyzers) == 1
        assert len(access_analyzer.analyzers[0].findings) == 1
        assert access_analyzer.analyzers[0].findings[0].status == "ARCHIVED"
        assert access_analyzer.analyzers[0].findings[0].id == "test_id1"
```

--------------------------------------------------------------------------------

---[FILE: accessanalyzer_enabled_fixer_test.py]---
Location: prowler-master/tests/providers/aws/services/accessanalyzer/accessanalyzer_enabled/accessanalyzer_enabled_fixer_test.py

```python
from unittest import mock

from tests.providers.aws.utils import AWS_ACCOUNT_ARN, AWS_REGION_EU_WEST_1


class Test_accessanalyzer_enabled_fixer:
    def test_accessanalyzer_enabled_fixer(self):
        regional_client = mock.MagicMock()
        accessanalyzer_client = mock.MagicMock()

        accessanalyzer_client.region = AWS_REGION_EU_WEST_1
        accessanalyzer_client.analyzers = []
        accessanalyzer_client.audited_account_arn = AWS_ACCOUNT_ARN
        regional_client.create_analyzer.return_value = None
        accessanalyzer_client.regional_clients = {AWS_REGION_EU_WEST_1: regional_client}

        with (
            mock.patch(
                "prowler.providers.aws.services.accessanalyzer.accessanalyzer_service.AccessAnalyzer",
                new=accessanalyzer_client,
            ) as accessanalyzer_client,
            mock.patch(
                "prowler.providers.aws.services.accessanalyzer.accessanalyzer_client.accessanalyzer_client",
                new=accessanalyzer_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.accessanalyzer.accessanalyzer_enabled.accessanalyzer_enabled_fixer import (
                fixer,
            )

            assert fixer(AWS_REGION_EU_WEST_1)
```

--------------------------------------------------------------------------------

---[FILE: accessanalyzer_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/accessanalyzer/accessanalyzer_enabled/accessanalyzer_enabled_test.py

```python
from unittest import mock

from prowler.providers.aws.services.accessanalyzer.accessanalyzer_service import (
    Analyzer,
)

AWS_REGION_1 = "eu-west-1"
AWS_REGION_2 = "eu-west-2"
AWS_ACCOUNT_NUMBER = "123456789012"
AWS_ACCOUNT_ARN = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
ACCESS_ANALYZER_NAME = "test-analyzer"
ACCESS_ANALYZER_ARN = f"arn:aws:access-analyzer:{AWS_REGION_2}:{AWS_ACCOUNT_NUMBER}:analyzer/{ACCESS_ANALYZER_NAME}"


class Test_accessanalyzer_enabled:
    def test_no_analyzers(self):
        accessanalyzer_client = mock.MagicMock
        accessanalyzer_client.analyzers = []
        with mock.patch(
            "prowler.providers.aws.services.accessanalyzer.accessanalyzer_service.AccessAnalyzer",
            new=accessanalyzer_client,
        ):
            # Test Check
            from prowler.providers.aws.services.accessanalyzer.accessanalyzer_enabled.accessanalyzer_enabled import (
                accessanalyzer_enabled,
            )

            check = accessanalyzer_enabled()
            result = check.execute()

            assert len(result) == 0

    def test_one_analyzer_not_available(self):
        # Include analyzers to check
        accessanalyzer_client = mock.MagicMock
        accessanalyzer_client.region = AWS_REGION_1
        accessanalyzer_client.audited_partition = "aws"
        accessanalyzer_client.audited_account = AWS_ACCOUNT_NUMBER
        accessanalyzer_client.get_unknown_arn = (
            lambda x: f"arn:aws:accessanalyzer:{x}:{AWS_ACCOUNT_NUMBER}:unknown"
        )
        accessanalyzer_client.analyzers = [
            Analyzer(
                arn=AWS_ACCOUNT_ARN,
                name=AWS_ACCOUNT_NUMBER,
                status="NOT_AVAILABLE",
                tags=[],
                type="",
                region=AWS_REGION_1,
            )
        ]
        with (
            mock.patch(
                "prowler.providers.aws.services.accessanalyzer.accessanalyzer_service.AccessAnalyzer",
                accessanalyzer_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.accessanalyzer.accessanalyzer_service.AccessAnalyzer.get_unknown_arn",
                return_value="arn:aws:accessanalyzer:eu-west-1:123456789012:unknown",
            ),
        ):
            from prowler.providers.aws.services.accessanalyzer.accessanalyzer_enabled.accessanalyzer_enabled import (
                accessanalyzer_enabled,
            )

            check = accessanalyzer_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"IAM Access Analyzer in account {AWS_ACCOUNT_NUMBER} is not enabled."
            )
            assert result[0].resource_id == "123456789012"
            assert result[0].resource_arn == "arn:aws:iam::123456789012:root"
            assert result[0].region == AWS_REGION_1
            assert result[0].resource_tags == []

    def test_one_analyzer_not_available_muted(self):
        # Include analyzers to check
        accessanalyzer_client = mock.MagicMock
        accessanalyzer_client.region = AWS_REGION_2
        accessanalyzer_client.audit_config = {"mute_non_default_regions": True}
        accessanalyzer_client.audited_partition = "aws"
        accessanalyzer_client.audited_account = AWS_ACCOUNT_NUMBER
        accessanalyzer_client.get_unknown_arn = (
            lambda x: f"arn:aws:accessanalyzer:{x}:{AWS_ACCOUNT_NUMBER}:unknown"
        )
        accessanalyzer_client.analyzers = [
            Analyzer(
                arn=AWS_ACCOUNT_ARN,
                name=AWS_ACCOUNT_NUMBER,
                status="NOT_AVAILABLE",
                tags=[],
                type="",
                region=AWS_REGION_1,
            )
        ]
        with (
            mock.patch(
                "prowler.providers.aws.services.accessanalyzer.accessanalyzer_service.AccessAnalyzer",
                accessanalyzer_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.accessanalyzer.accessanalyzer_service.AccessAnalyzer.get_unknown_arn",
                return_value="arn:aws:accessanalyzer:eu-west-1:123456789012:unknown",
            ),
        ):
            from prowler.providers.aws.services.accessanalyzer.accessanalyzer_enabled.accessanalyzer_enabled import (
                accessanalyzer_enabled,
            )

            check = accessanalyzer_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].muted
            assert (
                result[0].status_extended
                == f"IAM Access Analyzer in account {AWS_ACCOUNT_NUMBER} is not enabled."
            )
            assert result[0].resource_id == "123456789012"
            assert result[0].resource_arn == "arn:aws:iam::123456789012:root"
            assert result[0].region == AWS_REGION_1
            assert result[0].resource_tags == []

    def test_two_analyzers(self):
        accessanalyzer_client = mock.MagicMock
        accessanalyzer_client.region = AWS_REGION_1
        accessanalyzer_client.audited_partition = "aws"
        accessanalyzer_client.audited_account = AWS_ACCOUNT_NUMBER
        accessanalyzer_client.get_unknown_arn = (
            lambda x: f"arn:aws:accessanalyzer:{x}:{AWS_ACCOUNT_NUMBER}:analyzer/unknown"
        )
        accessanalyzer_client.analyzers = [
            Analyzer(
                arn=f"arn:aws:accessanalyzer:{AWS_REGION_1}:{AWS_ACCOUNT_NUMBER}:analyzer/unknown",
                name="analyzer/unknown",
                status="NOT_AVAILABLE",
                tags=[],
                type="",
                region=AWS_REGION_1,
            ),
            Analyzer(
                arn=ACCESS_ANALYZER_ARN,
                name=ACCESS_ANALYZER_NAME,
                status="ACTIVE",
                tags=[],
                type="",
                region=AWS_REGION_2,
            ),
        ]

        # Patch AccessAnalyzer Client
        with (
            mock.patch(
                "prowler.providers.aws.services.accessanalyzer.accessanalyzer_service.AccessAnalyzer",
                new=accessanalyzer_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.accessanalyzer.accessanalyzer_service.AccessAnalyzer.get_unknown_arn",
                return_value="arn:aws:accessanalyzer:eu-west-1:123456789012:analyzer/unknown",
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.accessanalyzer.accessanalyzer_enabled.accessanalyzer_enabled import (
                accessanalyzer_enabled,
            )

            check = accessanalyzer_enabled()
            result = check.execute()

            assert len(result) == 2

            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"IAM Access Analyzer in account {AWS_ACCOUNT_NUMBER} is not enabled."
            )
            assert result[0].resource_id == "analyzer/unknown"
            assert (
                result[0].resource_arn
                == "arn:aws:accessanalyzer:eu-west-1:123456789012:analyzer/unknown"
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_1

            assert result[1].status == "PASS"
            assert (
                result[1].status_extended
                == f"IAM Access Analyzer {ACCESS_ANALYZER_NAME} is enabled."
            )
            assert result[1].resource_id == ACCESS_ANALYZER_NAME
            assert result[1].resource_arn == ACCESS_ANALYZER_ARN
            assert result[1].resource_tags == []
            assert result[1].region == AWS_REGION_2

    def test_one_active_analyzer(self):
        accessanalyzer_client = mock.MagicMock
        accessanalyzer_client.analyzers = [
            Analyzer(
                arn=ACCESS_ANALYZER_ARN,
                name=ACCESS_ANALYZER_NAME,
                status="ACTIVE",
                tags=[],
                type="",
                region=AWS_REGION_2,
            )
        ]

        with mock.patch(
            "prowler.providers.aws.services.accessanalyzer.accessanalyzer_service.AccessAnalyzer",
            new=accessanalyzer_client,
        ):
            # Test Check
            from prowler.providers.aws.services.accessanalyzer.accessanalyzer_enabled.accessanalyzer_enabled import (
                accessanalyzer_enabled,
            )

            check = accessanalyzer_enabled()
            result = check.execute()

            assert len(result) == 1

            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"IAM Access Analyzer {ACCESS_ANALYZER_NAME} is enabled."
            )
            assert result[0].resource_id == ACCESS_ANALYZER_NAME
            assert result[0].resource_arn == ACCESS_ANALYZER_ARN
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_2
```

--------------------------------------------------------------------------------

---[FILE: accessanalyzer_enabled_without_findings_test.py]---
Location: prowler-master/tests/providers/aws/services/accessanalyzer/accessanalyzer_enabled_without_findings/accessanalyzer_enabled_without_findings_test.py

```python
from unittest import mock

from prowler.providers.aws.services.accessanalyzer.accessanalyzer_service import (
    Analyzer,
    Finding,
)

AWS_REGION_1 = "eu-west-1"
AWS_REGION_2 = "eu-west-2"
AWS_ACCOUNT_NUMBER = "123456789012"
AWS_ACCOUNT_ARN = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
ACCESS_ANALYZER_NAME = "test-analyzer"
ACCESS_ANALYZER_ARN = f"arn:aws:access-analyzer:{AWS_REGION_2}:{AWS_ACCOUNT_NUMBER}:analyzer/{ACCESS_ANALYZER_NAME}"


class Test_accessanalyzer_enabled_without_findings:
    def test_no_analyzers(self):
        accessanalyzer_client = mock.MagicMock
        accessanalyzer_client.analyzers = []
        with mock.patch(
            "prowler.providers.aws.services.accessanalyzer.accessanalyzer_service.AccessAnalyzer",
            new=accessanalyzer_client,
        ):
            # Test Check
            from prowler.providers.aws.services.accessanalyzer.accessanalyzer_enabled_without_findings.accessanalyzer_enabled_without_findings import (
                accessanalyzer_enabled_without_findings,
            )

            check = accessanalyzer_enabled_without_findings()
            result = check.execute()

            assert len(result) == 0

    def test_one_analyzer_not_available(self):
        # Include analyzers to check
        accessanalyzer_client = mock.MagicMock
        accessanalyzer_client.analyzers = [
            Analyzer(
                arn=AWS_ACCOUNT_ARN,
                name=AWS_ACCOUNT_NUMBER,
                status="NOT_AVAILABLE",
                tags=[],
                type="",
                fidings=[],
                region=AWS_REGION_1,
            )
        ]
        with mock.patch(
            "prowler.providers.aws.services.accessanalyzer.accessanalyzer_service.AccessAnalyzer",
            accessanalyzer_client,
        ):
            from prowler.providers.aws.services.accessanalyzer.accessanalyzer_enabled_without_findings.accessanalyzer_enabled_without_findings import (
                accessanalyzer_enabled_without_findings,
            )

            check = accessanalyzer_enabled_without_findings()
            result = check.execute()

            assert len(result) == 0

    def test_two_analyzers_but_one_with_findings(self):
        accessanalyzer_client = mock.MagicMock
        accessanalyzer_client.analyzers = [
            Analyzer(
                arn=AWS_ACCOUNT_ARN,
                name=AWS_ACCOUNT_NUMBER,
                status="NOT_AVAILABLE",
                tags=[],
                fidings=[],
                type="",
                region=AWS_REGION_1,
            ),
            Analyzer(
                arn=ACCESS_ANALYZER_ARN,
                name=ACCESS_ANALYZER_NAME,
                status="ACTIVE",
                findings=[
                    Finding(
                        id="test-finding-1",
                        status="ACTIVE",
                    ),
                    Finding(
                        id="test-finding-2",
                        status="ARCHIVED",
                    ),
                ],
                tags=[],
                type="",
                region=AWS_REGION_2,
            ),
        ]

        # Patch AccessAnalyzer Client
        with mock.patch(
            "prowler.providers.aws.services.accessanalyzer.accessanalyzer_service.AccessAnalyzer",
            new=accessanalyzer_client,
        ):
            # Test Check
            from prowler.providers.aws.services.accessanalyzer.accessanalyzer_enabled_without_findings.accessanalyzer_enabled_without_findings import (
                accessanalyzer_enabled_without_findings,
            )

            check = accessanalyzer_enabled_without_findings()
            result = check.execute()

            assert len(result) == 1

            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"IAM Access Analyzer {ACCESS_ANALYZER_NAME} has 1 active findings."
            )
            assert result[0].resource_id == ACCESS_ANALYZER_NAME
            assert result[0].resource_arn == ACCESS_ANALYZER_ARN
            assert result[0].region == AWS_REGION_2
            assert result[0].resource_tags == []

    def test_one_active_analyzer_without_findings(self):
        accessanalyzer_client = mock.MagicMock
        accessanalyzer_client.analyzers = [
            Analyzer(
                arn=ACCESS_ANALYZER_ARN,
                name=ACCESS_ANALYZER_NAME,
                status="ACTIVE",
                tags=[],
                fidings=[],
                type="",
                region=AWS_REGION_2,
            )
        ]

        with mock.patch(
            "prowler.providers.aws.services.accessanalyzer.accessanalyzer_service.AccessAnalyzer",
            new=accessanalyzer_client,
        ):
            # Test Check
            from prowler.providers.aws.services.accessanalyzer.accessanalyzer_enabled_without_findings.accessanalyzer_enabled_without_findings import (
                accessanalyzer_enabled_without_findings,
            )

            check = accessanalyzer_enabled_without_findings()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"IAM Access Analyzer {ACCESS_ANALYZER_NAME} does not have active findings."
            )
            assert result[0].resource_id == ACCESS_ANALYZER_NAME
            assert result[0].resource_arn == ACCESS_ANALYZER_ARN
            assert result[0].region == AWS_REGION_2
            assert result[0].resource_tags == []

    def test_one_active_analyzer_not_active_without_findings(self):
        accessanalyzer_client = mock.MagicMock
        accessanalyzer_client.analyzers = [
            Analyzer(
                arn=AWS_ACCOUNT_ARN,
                name=AWS_ACCOUNT_NUMBER,
                status="NOT_AVAILABLE",
                tags=[],
                fidings=[],
                type="",
                region=AWS_REGION_1,
            ),
        ]
        # Patch AccessAnalyzer Client
        with mock.patch(
            "prowler.providers.aws.services.accessanalyzer.accessanalyzer_service.AccessAnalyzer",
            new=accessanalyzer_client,
        ):
            # Test Check
            from prowler.providers.aws.services.accessanalyzer.accessanalyzer_enabled_without_findings.accessanalyzer_enabled_without_findings import (
                accessanalyzer_enabled_without_findings,
            )

            check = accessanalyzer_enabled_without_findings()
            result = check.execute()

            assert len(result) == 0

    def test_analyzer_finding_without_status(self):
        accessanalyzer_client = mock.MagicMock
        accessanalyzer_client.analyzers = [
            Analyzer(
                arn=ACCESS_ANALYZER_ARN,
                name=ACCESS_ANALYZER_NAME,
                status="ACTIVE",
                findings=[
                    Finding(
                        id="test-finding-1",
                        status="",
                    ),
                ],
                tags=[],
                type="",
                region=AWS_REGION_1,
            ),
        ]

        # Patch AccessAnalyzer Client
        with mock.patch(
            "prowler.providers.aws.services.accessanalyzer.accessanalyzer_service.AccessAnalyzer",
            new=accessanalyzer_client,
        ):
            # Test Check
            from prowler.providers.aws.services.accessanalyzer.accessanalyzer_enabled_without_findings.accessanalyzer_enabled_without_findings import (
                accessanalyzer_enabled_without_findings,
            )

            check = accessanalyzer_enabled_without_findings()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"IAM Access Analyzer {ACCESS_ANALYZER_NAME} does not have active findings."
            )
            assert result[0].resource_id == ACCESS_ANALYZER_NAME
            assert result[0].resource_arn == ACCESS_ANALYZER_ARN
            assert result[0].region == AWS_REGION_1
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: account_service_test.py]---
Location: prowler-master/tests/providers/aws/services/account/account_service_test.py

```python
import botocore
from mock import patch

from prowler.providers.aws.services.account.account_service import Account, Contact
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, set_mocked_aws_provider

# Mocking Access Analyzer Calls
make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwargs):
    """
    As you can see the operation_name has the list_analyzers snake_case form but
    we are using the ListAnalyzers form.
    Rationale -> https://github.com/boto/botocore/blob/develop/botocore/client.py#L810:L816

    We have to mock every AWS API call using Boto3
    """
    if operation_name == "GetContactInformation":
        return {
            "ContactInformation": {
                "AddressLine1": "AddressLine1",
                "AddressLine2": "AddressLine2",
                "AddressLine3": "AddressLine3",
                "City": "City",
                "CompanyName": "Prowler",
                "CountryCode": "CountryCode",
                "DistrictOrCounty": "DistrictOrCounty",
                "FullName": "Prowler",
                "PhoneNumber": "666666666",
                "PostalCode": "PostalCode",
                "StateOrRegion": "StateOrRegion",
                "WebsiteUrl": "WebsiteUrl",
            }
        }
    if operation_name == "GetAlternateContact":
        return {
            "AlternateContact": {
                "AlternateContactType": "SECURITY",
                "EmailAddress": "test@test.com",
                "Name": "Prowler",
                "PhoneNumber": "666666666",
                "Title": "Title",
            }
        }

    return make_api_call(self, operation_name, kwargs)


# Patch every AWS call using Boto3
@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
class Test_Account_Service:
    # Test Account Service
    def test_service(self):
        aws_provider = set_mocked_aws_provider()
        account = Account(aws_provider)
        assert account.service == "account"

    # Test Account Client
    def test_client(self):
        aws_provider = set_mocked_aws_provider()
        account = Account(aws_provider)
        assert account.client.__class__.__name__ == "Account"

    # Test Account Session
    def test__get_session__(self):
        aws_provider = set_mocked_aws_provider()
        account = Account(aws_provider)
        assert account.session.__class__.__name__ == "Session"

    # Test Account Session
    def test_audited_account(self):
        aws_provider = set_mocked_aws_provider()
        account = Account(aws_provider)
        assert account.audited_account == AWS_ACCOUNT_NUMBER

    # Test Account Get Account Contacts
    def test_get_account_contacts(self):
        # Account client for this test class
        aws_provider = set_mocked_aws_provider()
        account = Account(aws_provider)
        assert account.number_of_contacts == 4
        assert account.contact_base == Contact(
            type="PRIMARY",
            name="Prowler",
            phone_number="666666666",
        )
        assert account.contacts_billing == Contact(
            type="BILLING",
            email="test@test.com",
            name="Prowler",
            phone_number="666666666",
        )
        assert account.contacts_security == Contact(
            type="SECURITY",
            email="test@test.com",
            name="Prowler",
            phone_number="666666666",
        )
        assert account.contacts_operations == Contact(
            type="OPERATIONS",
            email="test@test.com",
            name="Prowler",
            phone_number="666666666",
        )
```

--------------------------------------------------------------------------------

````
