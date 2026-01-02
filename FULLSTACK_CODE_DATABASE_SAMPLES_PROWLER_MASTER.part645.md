---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 645
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 645 of 867)

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

---[FILE: wafv2_webacl_with_rules_test.py]---
Location: prowler-master/tests/providers/aws/services/wafv2/wafv2_webacl_with_rules/wafv2_webacl_with_rules_test.py

```python
from unittest import mock
from unittest.mock import patch

import botocore
from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

# Original botocore _make_api_call function
orig = botocore.client.BaseClient._make_api_call

FM_RG_NAME = "test-firewall-managed-rule-group"
FM_RG_ARN = "arn:aws:wafv2:us-east-1:123456789012:regional/webacl/test-firewall-managed-rule-group"


# Mocked botocore _make_api_call function
def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "ListWebACLs":
        return {
            "WebACLs": [
                {
                    "Name": FM_RG_NAME,
                    "Id": FM_RG_NAME,
                    "ARN": FM_RG_ARN,
                }
            ]
        }
    elif operation_name == "GetWebACL":
        return {
            "WebACL": {
                "PostProcessFirewallManagerRuleGroups": [
                    {
                        "Name": FM_RG_NAME,
                        "VisibilityConfig": {
                            "SampledRequestsEnabled": True,
                            "CloudWatchMetricsEnabled": True,
                            "MetricName": "web-acl-test-metric",
                        },
                    }
                ]
            }
        }
    elif operation_name == "ListResourcesForWebACL":
        return {
            "ResourceArns": [
                FM_RG_ARN,
            ]
        }
    elif operation_name == "ListTagsForResource":
        return {
            "TagInfoForResource": {
                "ResourceARN": FM_RG_ARN,
                "TagList": [{"Key": "Name", "Value": FM_RG_NAME}],
            }
        }
    return orig(self, operation_name, kwarg)


class Test_wafv2_webacl_with_rules:
    @mock_aws
    def test_no_web_acls(self):
        from prowler.providers.aws.services.wafv2.wafv2_service import WAFv2

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.wafv2.wafv2_webacl_with_rules.wafv2_webacl_with_rules.wafv2_client",
                new=WAFv2(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.wafv2.wafv2_webacl_with_rules.wafv2_webacl_with_rules import (
                wafv2_webacl_with_rules,
            )

            check = wafv2_webacl_with_rules()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_wafv2_web_acl_with_rule(self):
        wafv2_client = client("wafv2", region_name=AWS_REGION_US_EAST_1)
        waf = wafv2_client.create_web_acl(
            Name="test-rules",
            Scope="REGIONAL",
            DefaultAction={"Allow": {}},
            Rules=[
                {
                    "Name": "rule-on",
                    "Priority": 1,
                    "Statement": {
                        "ByteMatchStatement": {
                            "SearchString": "test",
                            "FieldToMatch": {"UriPath": {}},
                            "TextTransformations": [{"Type": "NONE", "Priority": 0}],
                            "PositionalConstraint": "CONTAINS",
                        }
                    },
                    "VisibilityConfig": {
                        "SampledRequestsEnabled": True,
                        "CloudWatchMetricsEnabled": True,
                        "MetricName": "web-acl-test-metric",
                    },
                }
            ],
            VisibilityConfig={
                "SampledRequestsEnabled": True,
                "CloudWatchMetricsEnabled": False,
                "MetricName": "web-acl-test-metric",
            },
            Tags=[{"Key": "Name", "Value": "test-rules"}],
        )["Summary"]
        waf_id = waf["Id"]
        waf_name = waf["Name"]
        waf_arn = waf["ARN"]

        from prowler.providers.aws.services.wafv2.wafv2_service import WAFv2

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.wafv2.wafv2_webacl_with_rules.wafv2_webacl_with_rules.wafv2_client",
                new=WAFv2(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.wafv2.wafv2_webacl_with_rules.wafv2_webacl_with_rules import (
                wafv2_webacl_with_rules,
            )

            check = wafv2_webacl_with_rules()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"AWS WAFv2 Web ACL {waf_name} does have rules or rule groups attached."
            )
            assert result[0].resource_id == waf_id
            assert result[0].resource_arn == waf_arn
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == [{"Key": "Name", "Value": waf_name}]

    @mock_aws
    def test_wafv2_web_acl_with_rule_group(self):
        wafv2_client = client("wafv2", region_name=AWS_REGION_US_EAST_1)
        waf = wafv2_client.create_web_acl(
            Name="test-rule-groups",
            Scope="REGIONAL",
            DefaultAction={"Allow": {}},
            Rules=[
                {
                    "Name": "rg-on",
                    "Priority": 1,
                    "Statement": {
                        "ByteMatchStatement": {
                            "SearchString": "test",
                            "FieldToMatch": {"UriPath": {}},
                            "TextTransformations": [{"Type": "NONE", "Priority": 0}],
                            "PositionalConstraint": "CONTAINS",
                        },
                        "RuleGroupReferenceStatement": {
                            "ARN": "arn:aws:wafv2:us-east-1:123456789012:regional/rulegroup/ManagedRuleGroup/af9d9b6b-1d1b-4e0d-8f3e-1d1d0e1d0e1d",
                        },
                    },
                    "VisibilityConfig": {
                        "SampledRequestsEnabled": True,
                        "CloudWatchMetricsEnabled": True,
                        "MetricName": "web-acl-test-metric",
                    },
                }
            ],
            VisibilityConfig={
                "SampledRequestsEnabled": True,
                "CloudWatchMetricsEnabled": False,
                "MetricName": "web-acl-test-metric",
            },
            Tags=[{"Key": "Name", "Value": "test-rule-groups"}],
        )["Summary"]
        waf_id = waf["Id"]
        waf_name = waf["Name"]
        waf_arn = waf["ARN"]

        from prowler.providers.aws.services.wafv2.wafv2_service import WAFv2

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.wafv2.wafv2_webacl_with_rules.wafv2_webacl_with_rules.wafv2_client",
                new=WAFv2(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.wafv2.wafv2_webacl_with_rules.wafv2_webacl_with_rules import (
                wafv2_webacl_with_rules,
            )

            check = wafv2_webacl_with_rules()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"AWS WAFv2 Web ACL {waf_name} does have rules or rule groups attached."
            )
            assert result[0].resource_id == waf_id
            assert result[0].resource_arn == waf_arn
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == [{"Key": "Name", "Value": waf_name}]

    @patch(
        "botocore.client.BaseClient._make_api_call",
        new=mock_make_api_call,
    )
    @mock_aws
    def test_wafv2_web_acl_with_firewall_manager_managed_rule_group(self):
        from prowler.providers.aws.services.wafv2.wafv2_service import WAFv2

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.wafv2.wafv2_webacl_with_rules.wafv2_webacl_with_rules.wafv2_client",
                new=WAFv2(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.wafv2.wafv2_webacl_with_rules.wafv2_webacl_with_rules import (
                wafv2_webacl_with_rules,
            )

            check = wafv2_webacl_with_rules()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"AWS WAFv2 Web ACL {FM_RG_NAME} does have rules or rule groups attached."
            )
            assert result[0].resource_id == FM_RG_NAME
            assert result[0].resource_arn == FM_RG_ARN
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == [{"Key": "Name", "Value": FM_RG_NAME}]

    @mock_aws
    def test_wafv2_web_acl_without_rule_or_rule_group(self):
        wafv2_client = client("wafv2", region_name=AWS_REGION_US_EAST_1)
        waf = wafv2_client.create_web_acl(
            Name="test-none",
            Scope="REGIONAL",
            DefaultAction={"Allow": {}},
            Rules=[],
            VisibilityConfig={
                "SampledRequestsEnabled": True,
                "CloudWatchMetricsEnabled": False,
                "MetricName": "web-acl-test-metric",
            },
            Tags=[{"Key": "Name", "Value": "test-none"}],
        )["Summary"]
        waf_id = waf["Id"]
        waf_name = waf["Name"]
        waf_arn = waf["ARN"]

        from prowler.providers.aws.services.wafv2.wafv2_service import WAFv2

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.wafv2.wafv2_webacl_with_rules.wafv2_webacl_with_rules.wafv2_client",
                new=WAFv2(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.wafv2.wafv2_webacl_with_rules.wafv2_webacl_with_rules import (
                wafv2_webacl_with_rules,
            )

            check = wafv2_webacl_with_rules()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"AWS WAFv2 Web ACL {waf_name} does not have any rules or rule groups attached."
            )
            assert result[0].resource_id == waf_id
            assert result[0].resource_arn == waf_arn
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == [{"Key": "Name", "Value": waf_name}]
```

--------------------------------------------------------------------------------

---[FILE: wellarchitected_service_test.py]---
Location: prowler-master/tests/providers/aws/services/wellarchitected/wellarchitected_service_test.py

```python
from unittest.mock import patch
from uuid import uuid4

import botocore

from prowler.providers.aws.services.wellarchitected.wellarchitected_service import (
    WellArchitected,
)
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

workload_id = str(uuid4())

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "ListWorkloads":
        return {
            "WorkloadSummaries": [
                {
                    "WorkloadId": workload_id,
                    "WorkloadArn": f"arn:aws:wellarchitected:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:workload/{workload_id}",
                    "WorkloadName": "test",
                    "Owner": AWS_ACCOUNT_NUMBER,
                    "UpdatedAt": "2023-06-07T15:40:24+02:00",
                    "Lenses": ["wellarchitected", "serverless", "softwareasaservice"],
                    "RiskCounts": {"UNANSWERED": 56, "NOT_APPLICABLE": 4, "HIGH": 10},
                    "ImprovementStatus": "NOT_APPLICABLE",
                },
            ]
        }
    if operation_name == "ListTagsForResource":
        return {
            "Tags": {"Key": "test", "Value": "test"},
        }
    return make_api_call(self, operation_name, kwarg)


def mock_generate_regional_clients(provider, service):
    regional_client = provider._session.current_session.client(
        service, region_name=AWS_REGION_EU_WEST_1
    )
    regional_client.region = AWS_REGION_EU_WEST_1
    return {AWS_REGION_EU_WEST_1: regional_client}


@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
@patch(
    "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
    new=mock_generate_regional_clients,
)
class Test_WellArchitected_Service:
    # Test WellArchitected Service
    def test_service(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        wellarchitected = WellArchitected(aws_provider)
        assert wellarchitected.service == "wellarchitected"

    # Test WellArchitected client
    def test_client(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        wellarchitected = WellArchitected(aws_provider)
        for reg_client in wellarchitected.regional_clients.values():
            assert reg_client.__class__.__name__ == "WellArchitected"

    # Test WellArchitected session
    def test__get_session__(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        wellarchitected = WellArchitected(aws_provider)
        assert wellarchitected.session.__class__.__name__ == "Session"

    # Test WellArchitected list workloads
    def test_list_workloads(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        wellarchitected = WellArchitected(aws_provider)
        assert len(wellarchitected.workloads) == 1
        assert wellarchitected.workloads[0].id == workload_id
        assert (
            wellarchitected.workloads[0].arn
            == f"arn:aws:wellarchitected:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:workload/{workload_id}"
        )
        assert wellarchitected.workloads[0].name == "test"
        assert wellarchitected.workloads[0].region == AWS_REGION_EU_WEST_1
        assert wellarchitected.workloads[0].tags == [
            {"Key": "test", "Value": "test"},
        ]
        assert wellarchitected.workloads[0].lenses == [
            "wellarchitected",
            "serverless",
            "softwareasaservice",
        ]
        assert wellarchitected.workloads[0].improvement_status == "NOT_APPLICABLE"
        assert wellarchitected.workloads[0].risks == {
            "UNANSWERED": 56,
            "NOT_APPLICABLE": 4,
            "HIGH": 10,
        }
```

--------------------------------------------------------------------------------

---[FILE: wellarchitected_workload_no_high_or_medium_risks_test.py]---
Location: prowler-master/tests/providers/aws/services/wellarchitected/wellarchitected_workload_no_high_or_medium_risks/wellarchitected_workload_no_high_or_medium_risks_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.aws.services.wellarchitected.wellarchitected_service import (
    Workload,
)
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_EU_WEST_1

workload_id = str(uuid4())


class Test_wellarchitected_workload_no_high_or_medium_risks:
    def test_no_wellarchitected(self):
        wellarchitected_client = mock.MagicMock
        wellarchitected_client.workloads = []
        with (
            mock.patch(
                "prowler.providers.aws.services.wellarchitected.wellarchitected_service.WellArchitected",
                wellarchitected_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.wellarchitected.wellarchitected_client.wellarchitected_client",
                wellarchitected_client,
            ),
        ):
            from prowler.providers.aws.services.wellarchitected.wellarchitected_workload_no_high_or_medium_risks.wellarchitected_workload_no_high_or_medium_risks import (
                wellarchitected_workload_no_high_or_medium_risks,
            )

            check = wellarchitected_workload_no_high_or_medium_risks()
            result = check.execute()
            assert len(result) == 0

    def test_wellarchitected_no_risks(self):
        wellarchitected_client = mock.MagicMock
        wellarchitected_client.workloads = []
        wellarchitected_client.workloads.append(
            Workload(
                id=workload_id,
                arn=f"arn:aws:wellarchitected:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:workload/{workload_id}",
                name="test",
                lenses=["wellarchitected", "serverless", "softwareasaservice"],
                improvement_status="NOT_APPLICABLE",
                risks={},
                region=AWS_REGION_EU_WEST_1,
            )
        )
        with (
            mock.patch(
                "prowler.providers.aws.services.wellarchitected.wellarchitected_service.WellArchitected",
                wellarchitected_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.wellarchitected.wellarchitected_client.wellarchitected_client",
                wellarchitected_client,
            ),
        ):
            from prowler.providers.aws.services.wellarchitected.wellarchitected_workload_no_high_or_medium_risks.wellarchitected_workload_no_high_or_medium_risks import (
                wellarchitected_workload_no_high_or_medium_risks,
            )

            check = wellarchitected_workload_no_high_or_medium_risks()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Well Architected workload test does not contain high or medium risks."
            )
            assert result[0].resource_id == workload_id
            assert (
                result[0].resource_arn
                == f"arn:aws:wellarchitected:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:workload/{workload_id}"
            )

    def test_wellarchitected_no_high_medium_risks(self):
        wellarchitected_client = mock.MagicMock
        wellarchitected_client.workloads = []
        wellarchitected_client.workloads.append(
            Workload(
                id=workload_id,
                arn=f"arn:aws:wellarchitected:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:workload/{workload_id}",
                name="test",
                lenses=["wellarchitected", "serverless", "softwareasaservice"],
                improvement_status="NOT_APPLICABLE",
                risks={
                    "UNANSWERED": 56,
                    "NOT_APPLICABLE": 4,
                },
                region=AWS_REGION_EU_WEST_1,
            )
        )
        with (
            mock.patch(
                "prowler.providers.aws.services.wellarchitected.wellarchitected_service.WellArchitected",
                wellarchitected_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.wellarchitected.wellarchitected_client.wellarchitected_client",
                wellarchitected_client,
            ),
        ):
            from prowler.providers.aws.services.wellarchitected.wellarchitected_workload_no_high_or_medium_risks.wellarchitected_workload_no_high_or_medium_risks import (
                wellarchitected_workload_no_high_or_medium_risks,
            )

            check = wellarchitected_workload_no_high_or_medium_risks()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Well Architected workload test does not contain high or medium risks."
            )
            assert result[0].resource_id == workload_id
            assert (
                result[0].resource_arn
                == f"arn:aws:wellarchitected:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:workload/{workload_id}"
            )

    def test_wellarchitected_with_high_medium_risks(self):
        wellarchitected_client = mock.MagicMock
        wellarchitected_client.workloads = []
        wellarchitected_client.workloads.append(
            Workload(
                id=workload_id,
                arn=f"arn:aws:wellarchitected:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:workload/{workload_id}",
                name="test",
                lenses=["wellarchitected", "serverless", "softwareasaservice"],
                improvement_status="NOT_APPLICABLE",
                risks={
                    "UNANSWERED": 56,
                    "NOT_APPLICABLE": 4,
                    "HIGH": 10,
                    "MEDIUM": 20,
                },
                region=AWS_REGION_EU_WEST_1,
            )
        )
        with (
            mock.patch(
                "prowler.providers.aws.services.wellarchitected.wellarchitected_service.WellArchitected",
                wellarchitected_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.wellarchitected.wellarchitected_client.wellarchitected_client",
                wellarchitected_client,
            ),
        ):
            from prowler.providers.aws.services.wellarchitected.wellarchitected_workload_no_high_or_medium_risks.wellarchitected_workload_no_high_or_medium_risks import (
                wellarchitected_workload_no_high_or_medium_risks,
            )

            check = wellarchitected_workload_no_high_or_medium_risks()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Well Architected workload test contains 10 high and 20 medium risks."
            )
            assert result[0].resource_id == workload_id
            assert (
                result[0].resource_arn
                == f"arn:aws:wellarchitected:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:workload/{workload_id}"
            )
```

--------------------------------------------------------------------------------

---[FILE: workspaces_service_test.py]---
Location: prowler-master/tests/providers/aws/services/workspaces/workspaces_service_test.py

```python
from unittest.mock import patch
from uuid import uuid4

import botocore

from prowler.providers.aws.services.workspaces.workspaces_service import WorkSpaces
from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider

workspace_id = str(uuid4())

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "DescribeWorkspaces":
        return {
            "Workspaces": [
                {
                    "WorkspaceId": workspace_id,
                    "UserVolumeEncryptionEnabled": True,
                    "RootVolumeEncryptionEnabled": True,
                    "SubnetId": "subnet-1234567890",
                },
            ],
        }
    if operation_name == "DescribeTags":
        return {
            "TagList": [
                {"Key": "test", "Value": "test"},
            ]
        }
    return make_api_call(self, operation_name, kwarg)


def mock_generate_regional_clients(provider, service):
    regional_client = provider._session.current_session.client(
        service, region_name=AWS_REGION_EU_WEST_1
    )
    regional_client.region = AWS_REGION_EU_WEST_1
    return {AWS_REGION_EU_WEST_1: regional_client}


@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
@patch(
    "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
    new=mock_generate_regional_clients,
)
class Test_WorkSpaces_Service:
    # Test WorkSpaces Service
    def test_service(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        workspaces = WorkSpaces(aws_provider)
        assert workspaces.service == "workspaces"

    # Test WorkSpaces client
    def test_client(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        workspaces = WorkSpaces(aws_provider)
        for reg_client in workspaces.regional_clients.values():
            assert reg_client.__class__.__name__ == "WorkSpaces"

    # Test WorkSpaces session
    def test__get_session__(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        workspaces = WorkSpaces(aws_provider)
        assert workspaces.session.__class__.__name__ == "Session"

    # Test WorkSpaces describe workspaces
    def test_describe_workspaces(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        workspaces = WorkSpaces(aws_provider)
        assert len(workspaces.workspaces) == 1
        assert workspaces.workspaces[0].id == workspace_id
        assert workspaces.workspaces[0].region == AWS_REGION_EU_WEST_1
        assert workspaces.workspaces[0].tags == [
            {"Key": "test", "Value": "test"},
        ]
        assert workspaces.workspaces[0].user_volume_encryption_enabled
        assert workspaces.workspaces[0].root_volume_encryption_enabled
```

--------------------------------------------------------------------------------

---[FILE: workspaces_volume_encryption_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/workspaces/workspaces_volume_encryption_enabled/workspaces_volume_encryption_enabled_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.aws.services.workspaces.workspaces_service import WorkSpace
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_EU_WEST_1

WORKSPACE_ID = str(uuid4())
WORKSPACE_ARN = f"arn:aws:workspaces:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:workspace/{WORKSPACE_ID}"


class Test_workspaces_volume_encryption_enabled:
    def test_no_workspaces(self):
        workspaces_client = mock.MagicMock
        workspaces_client.workspaces = []
        with (
            mock.patch(
                "prowler.providers.aws.services.workspaces.workspaces_service.WorkSpaces",
                workspaces_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.workspaces.workspaces_client.workspaces_client",
                workspaces_client,
            ),
        ):
            from prowler.providers.aws.services.workspaces.workspaces_volume_encryption_enabled.workspaces_volume_encryption_enabled import (
                workspaces_volume_encryption_enabled,
            )

            check = workspaces_volume_encryption_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_workspaces_encrypted(self):
        workspaces_client = mock.MagicMock
        workspaces_client.workspaces = []
        workspaces_client.workspaces.append(
            WorkSpace(
                id=WORKSPACE_ID,
                arn=WORKSPACE_ARN,
                region=AWS_REGION_EU_WEST_1,
                user_volume_encryption_enabled=True,
                root_volume_encryption_enabled=True,
                subnet_id="subnet-12345678",
            )
        )
        with (
            mock.patch(
                "prowler.providers.aws.services.workspaces.workspaces_service.WorkSpaces",
                workspaces_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.workspaces.workspaces_client.workspaces_client",
                workspaces_client,
            ),
        ):
            from prowler.providers.aws.services.workspaces.workspaces_volume_encryption_enabled.workspaces_volume_encryption_enabled import (
                workspaces_volume_encryption_enabled,
            )

            check = workspaces_volume_encryption_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"WorkSpaces workspace {WORKSPACE_ID} root and user volumes are encrypted."
            )
            assert result[0].resource_id == WORKSPACE_ID
            assert result[0].resource_arn == WORKSPACE_ARN
            assert result[0].region == AWS_REGION_EU_WEST_1

    def test_workspaces_user_not_encrypted(self):
        workspaces_client = mock.MagicMock
        workspaces_client.workspaces = []
        workspaces_client.workspaces.append(
            WorkSpace(
                id=WORKSPACE_ID,
                arn=WORKSPACE_ARN,
                region=AWS_REGION_EU_WEST_1,
                user_volume_encryption_enabled=False,
                root_volume_encryption_enabled=True,
                subnet_id="subnet-12345678",
            )
        )
        with (
            mock.patch(
                "prowler.providers.aws.services.workspaces.workspaces_service.WorkSpaces",
                workspaces_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.workspaces.workspaces_client.workspaces_client",
                workspaces_client,
            ),
        ):
            from prowler.providers.aws.services.workspaces.workspaces_volume_encryption_enabled.workspaces_volume_encryption_enabled import (
                workspaces_volume_encryption_enabled,
            )

            check = workspaces_volume_encryption_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"WorkSpaces workspace {WORKSPACE_ID} with user unencrypted volumes."
            )
            assert result[0].resource_id == WORKSPACE_ID
            assert result[0].resource_arn == WORKSPACE_ARN
            assert result[0].region == AWS_REGION_EU_WEST_1

    def test_workspaces_root_not_encrypted(self):
        workspaces_client = mock.MagicMock
        workspaces_client.workspaces = []
        workspaces_client.workspaces.append(
            WorkSpace(
                id=WORKSPACE_ID,
                arn=WORKSPACE_ARN,
                region=AWS_REGION_EU_WEST_1,
                user_volume_encryption_enabled=True,
                root_volume_encryption_enabled=False,
                subnet_id="subnet-12345678",
            )
        )
        with (
            mock.patch(
                "prowler.providers.aws.services.workspaces.workspaces_service.WorkSpaces",
                workspaces_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.workspaces.workspaces_client.workspaces_client",
                workspaces_client,
            ),
        ):
            from prowler.providers.aws.services.workspaces.workspaces_volume_encryption_enabled.workspaces_volume_encryption_enabled import (
                workspaces_volume_encryption_enabled,
            )

            check = workspaces_volume_encryption_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"WorkSpaces workspace {WORKSPACE_ID} with root unencrypted volumes."
            )
            assert result[0].resource_id == WORKSPACE_ID
            assert result[0].resource_arn == WORKSPACE_ARN
            assert result[0].region == AWS_REGION_EU_WEST_1

    def test_workspaces_user_and_root_not_encrypted(self):
        workspaces_client = mock.MagicMock
        workspaces_client.workspaces = []
        workspaces_client.workspaces.append(
            WorkSpace(
                id=WORKSPACE_ID,
                arn=WORKSPACE_ARN,
                region=AWS_REGION_EU_WEST_1,
                user_volume_encryption_enabled=False,
                root_volume_encryption_enabled=False,
                subnet_id="subnet-12345678",
            )
        )
        with (
            mock.patch(
                "prowler.providers.aws.services.workspaces.workspaces_service.WorkSpaces",
                workspaces_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.workspaces.workspaces_client.workspaces_client",
                workspaces_client,
            ),
        ):
            from prowler.providers.aws.services.workspaces.workspaces_volume_encryption_enabled.workspaces_volume_encryption_enabled import (
                workspaces_volume_encryption_enabled,
            )

            check = workspaces_volume_encryption_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"WorkSpaces workspace {WORKSPACE_ID} with root and user unencrypted volumes."
            )
            assert result[0].resource_id == WORKSPACE_ID
            assert result[0].resource_arn == WORKSPACE_ARN
            assert result[0].region == AWS_REGION_EU_WEST_1
```

--------------------------------------------------------------------------------

````
