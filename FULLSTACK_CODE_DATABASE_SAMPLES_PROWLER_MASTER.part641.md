---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 641
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 641 of 867)

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

---[FILE: vpc_vpn_connection_tunnels_up_test.py]---
Location: prowler-master/tests/providers/aws/services/vpc/vpc_vpn_connection_tunnels_up/vpc_vpn_connection_tunnels_up_test.py

```python
from unittest import mock

import botocore
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "DescribeVpnConnections":
        return {
            "VpnConnections": [
                {
                    "VpnConnectionId": "vpn-1234567890abcdef0",
                    "CustomerGatewayId": "cgw-0123456789abcdef0",
                    "VpnGatewayId": "vgw-0123456789abcdef0",
                    "State": "available",
                    "Type": "ipsec.1",
                    "VgwTelemetry": [
                        {
                            "OutsideIpAddress": "192.168.1.1",
                            "Status": "UP",
                            "AcceptedRouteCount": 10,
                        },
                        {
                            "OutsideIpAddress": "192.168.1.2",
                            "Status": "UP",
                            "AcceptedRouteCount": 5,
                        },
                    ],
                    "Tags": [{"Key": "Name", "Value": "MyVPNConnection"}],
                }
            ]
        }
    return make_api_call(self, operation_name, kwarg)


def mock_make_api_call_v2(self, operation_name, kwarg):
    if operation_name == "DescribeVpnConnections":
        return {
            "VpnConnections": [
                {
                    "VpnConnectionId": "vpn-1234567890abcdef0",
                    "CustomerGatewayId": "cgw-0123456789abcdef0",
                    "VpnGatewayId": "vgw-0123456789abcdef0",
                    "State": "available",
                    "Type": "ipsec.1",
                    "VgwTelemetry": [
                        {
                            "OutsideIpAddress": "192.168.1.1",
                            "Status": "UP",
                            "AcceptedRouteCount": 10,
                        },
                        {
                            "OutsideIpAddress": "192.168.1.2",
                            "Status": "DOWN",
                            "AcceptedRouteCount": 5,
                        },
                    ],
                    "Tags": [{"Key": "Name", "Value": "MyVPNConnection"}],
                }
            ]
        }
    return make_api_call(self, operation_name, kwarg)


class Test_vpc_vpn_connection_tunnels_up:
    @mock_aws
    def test_no_vpn_connections(self):

        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.vpc.vpc_vpn_connection_tunnels_up.vpc_vpn_connection_tunnels_up.vpc_client",
                new=VPC(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.vpc.vpc_vpn_connection_tunnels_up.vpc_vpn_connection_tunnels_up import (
                vpc_vpn_connection_tunnels_up,
            )

            check = vpc_vpn_connection_tunnels_up()
            result = check.execute()

            assert len(result) == 0

    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_vpn_both_tunnels_up(self):
        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.vpc.vpc_vpn_connection_tunnels_up.vpc_vpn_connection_tunnels_up.vpc_client",
                new=VPC(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.vpc.vpc_vpn_connection_tunnels_up.vpc_vpn_connection_tunnels_up import (
                vpc_vpn_connection_tunnels_up,
            )

            check = vpc_vpn_connection_tunnels_up()
            result = check.execute()

            # Se espera que el resultado sea PASS ya que ambos túneles están "UP"
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == "vpn-1234567890abcdef0"
            assert (
                result[0].resource_arn
                == "arn:aws:ec2:us-east-1:123456789012:vpn-connection/vpn-1234567890abcdef0"
            )
            assert (
                result[0].status_extended
                == "VPN Connection vpn-1234567890abcdef0 has both tunnels UP. "
            )

    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call_v2)
    def test_vpn_one_tunnel_down(self):

        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.vpc.vpc_vpn_connection_tunnels_up.vpc_vpn_connection_tunnels_up.vpc_client",
                new=VPC(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.vpc.vpc_vpn_connection_tunnels_up.vpc_vpn_connection_tunnels_up import (
                vpc_vpn_connection_tunnels_up,
            )

            check = vpc_vpn_connection_tunnels_up()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == "vpn-1234567890abcdef0"
            assert (
                result[0].resource_arn
                == "arn:aws:ec2:us-east-1:123456789012:vpn-connection/vpn-1234567890abcdef0"
            )
            assert (
                result[0].status_extended
                == "VPN Connection vpn-1234567890abcdef0 has at least one tunnel DOWN. "
            )
```

--------------------------------------------------------------------------------

---[FILE: waf_service_test.py]---
Location: prowler-master/tests/providers/aws/services/waf/waf_service_test.py

```python
from unittest.mock import patch

import botocore

from prowler.providers.aws.services.waf.waf_service import (
    WAF,
    Predicate,
    Rule,
    RuleGroup,
    WAFRegional,
)
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

# Mocking WAF Calls
make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    """We have to mock every AWS API call using Boto3"""
    if operation_name == "ListWebACLs":
        return {
            "WebACLs": [
                {"WebACLId": "my-web-acl-id", "Name": "my-web-acl"},
            ]
        }
    if operation_name == "ListResourcesForWebACL":
        return {
            "ResourceArns": [
                "alb-arn",
            ]
        }
    if operation_name == "GetWebACL":
        return {
            "WebACL": {
                "Rules": [
                    {
                        "RuleId": "my-rule-id",
                        "Type": "REGULAR",
                    },
                    {
                        "RuleId": "my-rule-group-id",
                        "Type": "GROUP",
                    },
                ],
            }
        }
    if operation_name == "ListRules":
        return {
            "Rules": [
                {
                    "RuleId": "my-rule-id",
                    "Name": "my-rule",
                },
            ]
        }
    if operation_name == "GetRule":
        return {
            "Rule": {
                "RuleId": "my-rule-id",
                "Name": "my-rule",
                "Predicates": [
                    {
                        "Negated": False,
                        "Type": "IPMatch",
                        "DataId": "my-data-id",
                    }
                ],
            }
        }
    if operation_name == "ListRuleGroups":
        return {
            "RuleGroups": [
                {
                    "RuleGroupId": "my-rule-group-id",
                    "Name": "my-rule-group",
                },
            ]
        }
    if operation_name == "ListActivatedRulesInRuleGroup":
        return {
            "ActivatedRules": [
                {
                    "RuleId": "my-rule-id",
                },
            ]
        }
    if operation_name == "GetLoggingConfiguration":
        return {
            "LoggingConfiguration": {
                "ResourceArn": "arn:aws:waf:123456789012:webacl/my-web-acl-id",
                "LogDestinationConfigs": [
                    "arn:aws:firehose:us-east-1:123456789012:deliverystream/my-firehose"
                ],
                "RedactedFields": [],
                "ManagedByFirewallManager": False,
            }
        }
    if operation_name == "GetChangeToken":
        return {"ChangeToken": "my-change-token"}
    return make_api_call(self, operation_name, kwarg)


# Mock generate_regional_clients()
def mock_generate_regional_clients(provider, service):
    regional_client = provider._session.current_session.client(
        service, region_name=AWS_REGION_US_EAST_1
    )
    regional_client.region = AWS_REGION_US_EAST_1
    return {AWS_REGION_US_EAST_1: regional_client}


# Patch every AWS call using Boto3 and generate_regional_clients to have 1 client
@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
class Test_WAF_Service:
    # Test WAF Global Service
    def test_service_global(self):
        # WAF client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        waf = WAF(aws_provider)
        assert waf.service == "waf"

    # Test WAF Global Client
    def test_client_global(self):
        # WAF client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        waf = WAF(aws_provider)
        for regional_client in waf.regional_clients.values():
            assert regional_client.__class__.__name__ == "WAF"

    # Test WAF Global Session
    def test__get_session___global(self):
        # WAF client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        waf = WAF(aws_provider)
        assert waf.session.__class__.__name__ == "Session"

    # Test WAF Global List Rules
    def test_list_rules(self):
        # WAF client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        waf = WAF(aws_provider)
        waf_arn = f"arn:aws:waf:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:webacl/my-web-acl-id"
        assert waf.web_acls[waf_arn].name == "my-web-acl"
        assert waf.web_acls[waf_arn].region == AWS_REGION_US_EAST_1
        assert waf.web_acls[waf_arn].id == "my-web-acl-id"
        assert waf.web_acls[waf_arn].rules
        assert waf.web_acls[waf_arn].rule_groups
        assert waf.rules

    # Test WAF Global Get Rule
    def test_get_rule(self):
        # WAF client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        waf = WAF(aws_provider)
        waf_arn = f"arn:aws:waf:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:webacl/my-web-acl-id"
        assert waf.web_acls[waf_arn].name == "my-web-acl"
        assert waf.web_acls[waf_arn].region == AWS_REGION_US_EAST_1
        assert waf.web_acls[waf_arn].id == "my-web-acl-id"
        assert waf.web_acls[waf_arn].rules
        assert waf.web_acls[waf_arn].rule_groups
        rule_arn = (
            f"arn:aws:waf:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:rule/my-rule-id"
        )
        assert waf.rules == {
            rule_arn: Rule(
                arn=rule_arn,
                id="my-rule-id",
                name="my-rule",
                region=AWS_REGION_US_EAST_1,
                predicates=[
                    Predicate(negated=False, type="IPMatch", data_id="my-data-id")
                ],
            )
        }

    # Test WAF Global List Rule Groups
    def test_list_rule_groups(self):
        # WAF client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        waf = WAF(aws_provider)
        waf_arn = f"arn:aws:waf:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:webacl/my-web-acl-id"
        assert waf.web_acls[waf_arn].name == "my-web-acl"
        assert waf.web_acls[waf_arn].region == AWS_REGION_US_EAST_1
        assert waf.web_acls[waf_arn].id == "my-web-acl-id"
        assert waf.web_acls[waf_arn].rules
        assert waf.web_acls[waf_arn].rule_groups
        assert waf.rule_groups

    # Test WAF Global Get Rule Groups
    def test_get_rule_groups(self):
        # WAF client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        waf = WAF(aws_provider)
        waf_arn = f"arn:aws:waf:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:webacl/my-web-acl-id"
        assert waf.web_acls[waf_arn].name == "my-web-acl"
        assert waf.web_acls[waf_arn].region == AWS_REGION_US_EAST_1
        assert waf.web_acls[waf_arn].id == "my-web-acl-id"
        assert waf.web_acls[waf_arn].rules
        assert waf.web_acls[waf_arn].rule_groups
        rule_arn = f"arn:aws:waf:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:rulegroup/my-rule-group-id"
        assert waf.rule_groups == {
            rule_arn: RuleGroup(
                arn=f"arn:aws:waf:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:rulegroup/my-rule-group-id",
                id="my-rule-group-id",
                region=AWS_REGION_US_EAST_1,
                name="my-rule-group",
                rules=[
                    Rule(
                        arn=f"arn:aws:waf:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:rule/my-rule-id",
                        id="my-rule-id",
                        region=AWS_REGION_US_EAST_1,
                        name="my-rule",
                        predicates=[
                            Predicate(
                                negated=False, type="IPMatch", data_id="my-data-id"
                            )
                        ],
                        tags=[],
                    )
                ],
            )
        }

    # Test WAF Global List Web ACLs
    def test_list_web_acls_waf_global(self):
        # WAF client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        waf = WAF(aws_provider)
        waf_arn = f"arn:aws:waf:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:webacl/my-web-acl-id"
        assert len(waf.web_acls) == 1
        assert waf.web_acls[waf_arn].name == "my-web-acl"
        assert waf.web_acls[waf_arn].region == AWS_REGION_US_EAST_1
        assert waf.web_acls[waf_arn].id == "my-web-acl-id"
        assert waf.web_acls[waf_arn].rules
        assert waf.web_acls[waf_arn].rule_groups

    # Test WAF Global Get Web ACL
    def test_get_web_acl(self):
        # WAF client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        waf = WAF(aws_provider)
        waf_arn = f"arn:aws:waf:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:webacl/my-web-acl-id"
        assert waf.web_acls[waf_arn].name == "my-web-acl"
        assert waf.web_acls[waf_arn].region == AWS_REGION_US_EAST_1
        assert waf.web_acls[waf_arn].id == "my-web-acl-id"
        assert waf.web_acls[waf_arn].rules == [
            Rule(
                arn=f"arn:aws:waf:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:rule/my-rule-id",
                id="my-rule-id",
                region=AWS_REGION_US_EAST_1,
                name="my-rule",
                predicates=[
                    Predicate(negated=False, type="IPMatch", data_id="my-data-id")
                ],
                tags=[],
            )
        ]
        assert waf.web_acls[waf_arn].rule_groups == [
            RuleGroup(
                arn=f"arn:aws:waf:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:rulegroup/my-rule-group-id",
                id="my-rule-group-id",
                region=AWS_REGION_US_EAST_1,
                name="my-rule-group",
                rules=[
                    Rule(
                        arn=f"arn:aws:waf:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:rule/my-rule-id",
                        id="my-rule-id",
                        region=AWS_REGION_US_EAST_1,
                        name="my-rule",
                        predicates=[
                            Predicate(
                                negated=False, type="IPMatch", data_id="my-data-id"
                            )
                        ],
                        tags=[],
                    )
                ],
            )
        ]

    # Test WAFRegional Describe Web ACLs Resources
    def test_list_resources_for_web_acl(self):
        # WAF client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        waf = WAFRegional(aws_provider)
        waf_arn = f"arn:aws:waf-regional:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:webacl/my-web-acl-id"
        assert len(waf.web_acls) == 1
        assert len(waf.web_acls[waf_arn].albs) == 1
        assert "alb-arn" in waf.web_acls[waf_arn].albs

    # Test WAFRegional Service
    def test_service_regional(self):
        # WAF client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        waf = WAFRegional(aws_provider)
        assert waf.service == "waf-regional"

    # Test WAFRegional Client
    def test_client_regional(self):
        # WAF client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        waf = WAFRegional(aws_provider)
        for regional_client in waf.regional_clients.values():
            assert regional_client.__class__.__name__ == "WAFRegional"

    # Test WAFRegional Session
    def test__get_session___regional(self):
        # WAF client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        waf = WAFRegional(aws_provider)
        assert waf.session.__class__.__name__ == "Session"

    # Test WAFRegional List Rules
    def test_list_regional_rules(self):
        # WAF client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        waf = WAFRegional(aws_provider)
        waf_arn = f"arn:aws:waf-regional:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:webacl/my-web-acl-id"
        assert waf.web_acls[waf_arn].name == "my-web-acl"
        assert waf.web_acls[waf_arn].region == AWS_REGION_US_EAST_1
        assert waf.web_acls[waf_arn].id == "my-web-acl-id"
        assert waf.web_acls[waf_arn].rules
        assert waf.web_acls[waf_arn].rule_groups
        assert waf.rules

    # Test WAFRegional Get Rule
    def test_get_regional_rule(self):
        # WAF client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        waf = WAFRegional(aws_provider)
        waf_arn = f"arn:aws:waf-regional:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:webacl/my-web-acl-id"
        assert waf.web_acls[waf_arn].name == "my-web-acl"
        assert waf.web_acls[waf_arn].region == AWS_REGION_US_EAST_1
        assert waf.web_acls[waf_arn].id == "my-web-acl-id"
        assert waf.web_acls[waf_arn].rules
        assert waf.web_acls[waf_arn].rule_groups
        rule_arn = f"arn:aws:waf-regional:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:rule/my-rule-id"
        assert waf.rules == {
            rule_arn: Rule(
                arn=rule_arn,
                id="my-rule-id",
                name="my-rule",
                region=AWS_REGION_US_EAST_1,
                predicates=[
                    Predicate(negated=False, type="IPMatch", data_id="my-data-id")
                ],
            )
        }

    # Test WAFRegional List Rule Groups
    def test_list_regional_rule_groups(self):
        # WAF client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        waf = WAFRegional(aws_provider)
        waf_arn = f"arn:aws:waf-regional:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:webacl/my-web-acl-id"
        assert waf.web_acls[waf_arn].name == "my-web-acl"
        assert waf.web_acls[waf_arn].region == AWS_REGION_US_EAST_1
        assert waf.web_acls[waf_arn].id == "my-web-acl-id"
        assert waf.web_acls[waf_arn].rules
        assert waf.web_acls[waf_arn].rule_groups
        assert waf.rule_groups

    # Test WAFRegional Get Rule Groups
    def test_get_regional_rule_groups(self):
        # WAF client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        waf = WAFRegional(aws_provider)
        waf_arn = f"arn:aws:waf-regional:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:webacl/my-web-acl-id"
        assert waf.web_acls[waf_arn].name == "my-web-acl"
        assert waf.web_acls[waf_arn].region == AWS_REGION_US_EAST_1
        assert waf.web_acls[waf_arn].id == "my-web-acl-id"
        assert waf.web_acls[waf_arn].rules
        assert waf.web_acls[waf_arn].rule_groups
        rule_arn = f"arn:aws:waf-regional:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:rulegroup/my-rule-group-id"
        assert waf.rule_groups == {
            rule_arn: RuleGroup(
                arn=f"arn:aws:waf-regional:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:rulegroup/my-rule-group-id",
                id="my-rule-group-id",
                region=AWS_REGION_US_EAST_1,
                name="my-rule-group",
                rules=[
                    Rule(
                        arn=f"arn:aws:waf-regional:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:rule/my-rule-id",
                        id="my-rule-id",
                        region=AWS_REGION_US_EAST_1,
                        name="my-rule",
                        predicates=[
                            Predicate(
                                negated=False, type="IPMatch", data_id="my-data-id"
                            )
                        ],
                        tags=[],
                    )
                ],
            )
        }

    # Test WAFRegional List Web ACLs
    def test_list__regionalweb_acls_waf(self):
        # WAF client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        waf = WAFRegional(aws_provider)
        waf_arn = f"arn:aws:waf-regional:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:webacl/my-web-acl-id"
        assert len(waf.web_acls) == 1
        assert waf.web_acls[waf_arn].name == "my-web-acl"
        assert waf.web_acls[waf_arn].region == AWS_REGION_US_EAST_1
        assert waf.web_acls[waf_arn].id == "my-web-acl-id"
        assert waf.web_acls[waf_arn].rules
        assert waf.web_acls[waf_arn].rule_groups

    # Test WAFRegional Get Web ACL
    def test_get_regional_web_acl(self):
        # WAF client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        waf = WAFRegional(aws_provider)
        waf_arn = f"arn:aws:waf-regional:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:webacl/my-web-acl-id"
        assert waf.web_acls[waf_arn].name == "my-web-acl"
        assert waf.web_acls[waf_arn].region == AWS_REGION_US_EAST_1
        assert waf.web_acls[waf_arn].id == "my-web-acl-id"
        assert waf.web_acls[waf_arn].rules == [
            Rule(
                arn=f"arn:aws:waf-regional:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:rule/my-rule-id",
                id="my-rule-id",
                region=AWS_REGION_US_EAST_1,
                name="my-rule",
                predicates=[
                    Predicate(negated=False, type="IPMatch", data_id="my-data-id")
                ],
                tags=[],
            )
        ]
        assert waf.web_acls[waf_arn].rule_groups == [
            RuleGroup(
                arn=f"arn:aws:waf-regional:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:rulegroup/my-rule-group-id",
                id="my-rule-group-id",
                region=AWS_REGION_US_EAST_1,
                name="my-rule-group",
                rules=[
                    Rule(
                        arn=f"arn:aws:waf-regional:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:rule/my-rule-id",
                        id="my-rule-id",
                        region=AWS_REGION_US_EAST_1,
                        name="my-rule",
                        predicates=[
                            Predicate(
                                negated=False, type="IPMatch", data_id="my-data-id"
                            )
                        ],
                        tags=[],
                    )
                ],
            )
        ]
```

--------------------------------------------------------------------------------

---[FILE: waf_global_rulegroup_not_empty_test.py]---
Location: prowler-master/tests/providers/aws/services/waf/waf_global_rulegroup_not_empty/waf_global_rulegroup_not_empty_test.py

```python
from unittest import mock
from unittest.mock import patch

import botocore
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

RULE_GROUP_ID = "test-rulegroup-id"
RULE_ID = "my-rule-id"

# Original botocore _make_api_call function
orig = botocore.client.BaseClient._make_api_call


# Mocked botocore _make_api_call function
def mock_make_api_call_compliant_rule_group(self, operation_name, kwarg):
    unused_operations = ["ListWebACLs", "GetRule"]
    if operation_name in unused_operations:
        return {}
    if operation_name == "ListRules":
        return {
            "Rules": [
                {
                    "RuleId": RULE_ID,
                    "Name": "my-rule",
                },
            ]
        }
    if operation_name == "GetRule":
        return {
            "Rule": {
                "RuleId": RULE_ID,
                "Name": "my-rule",
                "Predicates": [
                    {
                        "Negated": False,
                        "Type": "IPMatch",
                        "DataId": "my-data-id",
                    }
                ],
            }
        }
    if operation_name == "ListRuleGroups":
        return {
            "RuleGroups": [
                {
                    "RuleGroupId": RULE_GROUP_ID,
                    "Name": RULE_GROUP_ID,
                },
            ]
        }
    if operation_name == "ListActivatedRulesInRuleGroup":
        return {
            "ActivatedRules": [
                {
                    "RuleId": RULE_ID,
                },
            ]
        }
    return orig(self, operation_name, kwarg)


def mock_make_api_call_non_compliant_rule_group(self, operation_name, kwarg):
    unused_operations = ["ListRules", "GetRule", "ListWebACLs", "GetRule"]
    if operation_name in unused_operations:
        return {}
    if operation_name == "ListRuleGroups":
        return {
            "RuleGroups": [
                {
                    "RuleGroupId": RULE_GROUP_ID,
                    "Name": RULE_GROUP_ID,
                },
            ]
        }
    if operation_name == "ListActivatedRulesInRuleGroup":
        return {"Rules": []}
    return orig(self, operation_name, kwarg)


class Test_waf_global_rulegroup_not_empty:
    @mock_aws
    def test_no_rule_groups(self):
        from prowler.providers.aws.services.waf.waf_service import WAF

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.waf.waf_global_rulegroup_not_empty.waf_global_rulegroup_not_empty.waf_client",
                new=WAF(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.waf.waf_global_rulegroup_not_empty.waf_global_rulegroup_not_empty import (
                    waf_global_rulegroup_not_empty,
                )

                check = waf_global_rulegroup_not_empty()
                result = check.execute()

                assert len(result) == 0

    @patch(
        "botocore.client.BaseClient._make_api_call",
        new=mock_make_api_call_compliant_rule_group,
    )
    @mock_aws
    def test_waf_rules_with_condition(self):
        from prowler.providers.aws.services.waf.waf_service import WAF

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.waf.waf_global_rulegroup_not_empty.waf_global_rulegroup_not_empty.waf_client",
                new=WAF(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.waf.waf_global_rulegroup_not_empty.waf_global_rulegroup_not_empty import (
                    waf_global_rulegroup_not_empty,
                )

                check = waf_global_rulegroup_not_empty()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"AWS WAF Global Rule Group {RULE_GROUP_ID} is not empty."
                )
                assert result[0].resource_id == RULE_GROUP_ID
                assert (
                    result[0].resource_arn
                    == f"arn:aws:waf:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:rulegroup/{RULE_GROUP_ID}"
                )
                assert result[0].region == AWS_REGION_US_EAST_1

    @patch(
        "botocore.client.BaseClient._make_api_call",
        new=mock_make_api_call_non_compliant_rule_group,
    )
    @mock_aws
    def test_waf_rules_without_condition(self):
        from prowler.providers.aws.services.waf.waf_service import WAF

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.waf.waf_global_rulegroup_not_empty.waf_global_rulegroup_not_empty.waf_client",
                new=WAF(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.waf.waf_global_rulegroup_not_empty.waf_global_rulegroup_not_empty import (
                    waf_global_rulegroup_not_empty,
                )

                check = waf_global_rulegroup_not_empty()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"AWS WAF Global Rule Group {RULE_GROUP_ID} does not have any rules."
                )
                assert result[0].resource_id == RULE_GROUP_ID
                assert (
                    result[0].resource_arn
                    == f"arn:aws:waf:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:rulegroup/{RULE_GROUP_ID}"
                )
                assert result[0].region == AWS_REGION_US_EAST_1
```

--------------------------------------------------------------------------------

---[FILE: waf_global_rule_with_conditions_test.py]---
Location: prowler-master/tests/providers/aws/services/waf/waf_global_rule_with_conditions/waf_global_rule_with_conditions_test.py

```python
from unittest import mock
from unittest.mock import patch

import botocore
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

RULE_ID = "test-rule-id"

# Original botocore _make_api_call function
orig = botocore.client.BaseClient._make_api_call


# Mocked botocore _make_api_call function
def mock_make_api_call_compliant_rule(self, operation_name, kwarg):
    if operation_name == "ListRules":
        return {
            "Rules": [
                {
                    "RuleId": RULE_ID,
                    "Name": RULE_ID,
                },
            ]
        }
    if operation_name == "GetRule":
        return {
            "Rule": {
                "RuleId": RULE_ID,
                "Predicates": [
                    {
                        "Negated": False,
                        "Type": "IPMatch",
                        "DataId": "IPSetId",
                    },
                ],
            }
        }
    return orig(self, operation_name, kwarg)


def mock_make_api_call_non_compliant_rule(self, operation_name, kwarg):
    if operation_name == "ListRules":
        return {
            "Rules": [
                {
                    "RuleId": RULE_ID,
                    "Name": RULE_ID,
                },
            ]
        }
    if operation_name == "GetRule":
        return {
            "Rule": {
                "RuleId": RULE_ID,
                "Predicates": [],
            }
        }
    return orig(self, operation_name, kwarg)


class Test_waf_global_rule_with_conditions:
    @mock_aws
    def test_no_rules(self):
        from prowler.providers.aws.services.waf.waf_service import WAF

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.waf.waf_global_rule_with_conditions.waf_global_rule_with_conditions.waf_client",
                new=WAF(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.waf.waf_global_rule_with_conditions.waf_global_rule_with_conditions import (
                    waf_global_rule_with_conditions,
                )

                check = waf_global_rule_with_conditions()
                result = check.execute()

                assert len(result) == 0

    @patch(
        "botocore.client.BaseClient._make_api_call",
        new=mock_make_api_call_compliant_rule,
    )
    @mock_aws
    def test_waf_rules_with_condition(self):
        from prowler.providers.aws.services.waf.waf_service import WAF

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.waf.waf_global_rule_with_conditions.waf_global_rule_with_conditions.waf_client",
                new=WAF(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.waf.waf_global_rule_with_conditions.waf_global_rule_with_conditions import (
                    waf_global_rule_with_conditions,
                )

                check = waf_global_rule_with_conditions()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"AWS WAF Global Rule {RULE_ID} has at least one condition."
                )
                assert result[0].resource_id == RULE_ID
                assert (
                    result[0].resource_arn
                    == f"arn:aws:waf:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:rule/{RULE_ID}"
                )
                assert result[0].region == AWS_REGION_US_EAST_1

    @patch(
        "botocore.client.BaseClient._make_api_call",
        new=mock_make_api_call_non_compliant_rule,
    )
    @mock_aws
    def test_waf_rules_without_condition(self):
        from prowler.providers.aws.services.waf.waf_service import WAF

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.waf.waf_global_rule_with_conditions.waf_global_rule_with_conditions.waf_client",
                new=WAF(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.waf.waf_global_rule_with_conditions.waf_global_rule_with_conditions import (
                    waf_global_rule_with_conditions,
                )

                check = waf_global_rule_with_conditions()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"AWS WAF Global Rule {RULE_ID} does not have any conditions."
                )
                assert result[0].resource_id == RULE_ID
                assert (
                    result[0].resource_arn
                    == f"arn:aws:waf:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:rule/{RULE_ID}"
                )
                assert result[0].region == AWS_REGION_US_EAST_1
```

--------------------------------------------------------------------------------

````
