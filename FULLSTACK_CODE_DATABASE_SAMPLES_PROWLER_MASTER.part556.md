---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 556
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 556 of 867)

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

---[FILE: elbv2_ssl_listeners_test.py]---
Location: prowler-master/tests/providers/aws/services/elbv2/elbv2_ssl_listeners/elbv2_ssl_listeners_test.py

```python
from unittest import mock

from boto3 import client, resource
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_EU_WEST_1_AZA,
    AWS_REGION_EU_WEST_1_AZB,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_elbv2_ssl_listeners:
    @mock_aws
    def test_elb_no_balancers(self):
        from prowler.providers.aws.services.elbv2.elbv2_service import ELBv2

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(
                    [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
                ),
            ),
            mock.patch(
                "prowler.providers.aws.services.elbv2.elbv2_ssl_listeners.elbv2_ssl_listeners.elbv2_client",
                new=ELBv2(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.elbv2.elbv2_ssl_listeners.elbv2_ssl_listeners import (
                elbv2_ssl_listeners,
            )

            check = elbv2_ssl_listeners()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_elbv2_with_HTTP_listener(self):
        conn = client("elbv2", region_name=AWS_REGION_EU_WEST_1)
        ec2 = resource("ec2", region_name=AWS_REGION_EU_WEST_1)

        security_group = ec2.create_security_group(
            GroupName="a-security-group", Description="First One"
        )
        vpc = ec2.create_vpc(CidrBlock="172.28.7.0/24", InstanceTenancy="default")
        subnet1 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.192/26",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZA,
        )
        subnet2 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.0/26",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZB,
        )

        lb = conn.create_load_balancer(
            Name="my-lb",
            Subnets=[subnet1.id, subnet2.id],
            SecurityGroups=[security_group.id],
            Scheme="internal",
            Type="application",
        )["LoadBalancers"][0]

        response = conn.create_target_group(
            Name="a-target",
            Protocol="HTTP",
            Port=8080,
            VpcId=vpc.id,
            HealthCheckProtocol="HTTP",
            HealthCheckPort="8080",
            HealthCheckPath="/",
            HealthCheckIntervalSeconds=5,
            HealthCheckTimeoutSeconds=3,
            HealthyThresholdCount=5,
            UnhealthyThresholdCount=2,
            Matcher={"HttpCode": "200"},
        )
        target_group = response.get("TargetGroups")[0]
        target_group_arn = target_group["TargetGroupArn"]
        response = conn.create_listener(
            LoadBalancerArn=lb["LoadBalancerArn"],
            Protocol="HTTP",
            Port=80,
            DefaultActions=[{"Type": "forward", "TargetGroupArn": target_group_arn}],
        )

        from prowler.providers.aws.services.elbv2.elbv2_service import ELBv2

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(
                    [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
                ),
            ),
            mock.patch(
                "prowler.providers.aws.services.elbv2.elbv2_ssl_listeners.elbv2_ssl_listeners.elbv2_client",
                new=ELBv2(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ),
        ):
            from prowler.providers.aws.services.elbv2.elbv2_ssl_listeners.elbv2_ssl_listeners import (
                elbv2_ssl_listeners,
            )

            check = elbv2_ssl_listeners()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "ELBv2 ALB my-lb has non-encrypted listeners."
            )
            assert result[0].resource_id == "my-lb"
            assert result[0].resource_arn == lb["LoadBalancerArn"]

    @mock_aws
    def test_elbv2_with_HTTPS_listener(self):
        conn = client("elbv2", region_name=AWS_REGION_EU_WEST_1)
        ec2 = resource("ec2", region_name=AWS_REGION_EU_WEST_1)

        security_group = ec2.create_security_group(
            GroupName="a-security-group", Description="First One"
        )
        vpc = ec2.create_vpc(CidrBlock="172.28.7.0/24", InstanceTenancy="default")
        subnet1 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.192/26",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZA,
        )
        subnet2 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.0/26",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZB,
        )

        lb = conn.create_load_balancer(
            Name="my-lb",
            Subnets=[subnet1.id, subnet2.id],
            SecurityGroups=[security_group.id],
            Scheme="internal",
        )["LoadBalancers"][0]

        response = conn.create_target_group(
            Name="a-target",
            Protocol="HTTP",
            Port=8080,
            VpcId=vpc.id,
            HealthCheckProtocol="HTTP",
            HealthCheckPort="8080",
            HealthCheckPath="/",
            HealthCheckIntervalSeconds=5,
            HealthCheckTimeoutSeconds=3,
            HealthyThresholdCount=5,
            UnhealthyThresholdCount=2,
            Matcher={"HttpCode": "200"},
        )
        target_group = response.get("TargetGroups")[0]
        target_group_arn = target_group["TargetGroupArn"]
        response = conn.create_listener(
            LoadBalancerArn=lb["LoadBalancerArn"],
            Protocol="HTTPS",
            Port=443,
            DefaultActions=[{"Type": "forward", "TargetGroupArn": target_group_arn}],
        )

        from prowler.providers.aws.services.elbv2.elbv2_service import ELBv2

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(
                    [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
                ),
            ),
            mock.patch(
                "prowler.providers.aws.services.elbv2.elbv2_ssl_listeners.elbv2_ssl_listeners.elbv2_client",
                new=ELBv2(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ),
        ):
            from prowler.providers.aws.services.elbv2.elbv2_ssl_listeners.elbv2_ssl_listeners import (
                elbv2_ssl_listeners,
            )

            check = elbv2_ssl_listeners()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended == "ELBv2 ALB my-lb has HTTPS listeners only."
            )
            assert result[0].resource_id == "my-lb"
            assert result[0].resource_arn == lb["LoadBalancerArn"]

    @mock_aws
    def test_elbv2_with_HTTPS_redirection(self):
        conn = client("elbv2", region_name=AWS_REGION_EU_WEST_1)
        ec2 = resource("ec2", region_name=AWS_REGION_EU_WEST_1)

        security_group = ec2.create_security_group(
            GroupName="a-security-group", Description="First One"
        )
        vpc = ec2.create_vpc(CidrBlock="172.28.7.0/24", InstanceTenancy="default")
        subnet1 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.192/26",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZA,
        )
        subnet2 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.0/26",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZB,
        )

        lb = conn.create_load_balancer(
            Name="my-lb",
            Subnets=[subnet1.id, subnet2.id],
            SecurityGroups=[security_group.id],
            Scheme="internal",
        )["LoadBalancers"][0]

        conn.create_listener(
            LoadBalancerArn=lb["LoadBalancerArn"],
            Protocol="HTTP",
            Port=80,
            DefaultActions=[
                {
                    "Type": "redirect",
                    "RedirectConfig": {
                        "Protocol": "HTTPS",
                        "Port": "443",
                        "StatusCode": "HTTP_301",
                    },
                }
            ],
        )

        from prowler.providers.aws.services.elbv2.elbv2_service import ELBv2

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(
                    [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
                ),
            ),
            mock.patch(
                "prowler.providers.aws.services.elbv2.elbv2_ssl_listeners.elbv2_ssl_listeners.elbv2_client",
                new=ELBv2(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ),
        ):
            from prowler.providers.aws.services.elbv2.elbv2_ssl_listeners.elbv2_ssl_listeners import (
                elbv2_ssl_listeners,
            )

            check = elbv2_ssl_listeners()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "ELBv2 ALB my-lb has HTTP listener but it redirects to HTTPS."
            )
            assert result[0].resource_id == "my-lb"
            assert result[0].resource_arn == lb["LoadBalancerArn"]
```

--------------------------------------------------------------------------------

---[FILE: elbv2_waf_acl_attached_test.py]---
Location: prowler-master/tests/providers/aws/services/elbv2/elbv2_waf_acl_attached/elbv2_waf_acl_attached_test.py

```python
from unittest import mock

import botocore
from boto3 import client, resource
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_EU_WEST_1_AZA,
    AWS_REGION_EU_WEST_1_AZB,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

# Mocking WAF-Regional Calls
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

    return make_api_call(self, operation_name, kwarg)


class Test_elbv2_waf_acl_attached:
    @mock_aws
    def test_elb_no_balancers(self):
        from prowler.providers.aws.services.elbv2.elbv2_service import ELBv2
        from prowler.providers.aws.services.waf.waf_service import WAFRegional
        from prowler.providers.aws.services.wafv2.wafv2_service import WAFv2

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(
                    [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
                ),
            ),
            mock.patch(
                "prowler.providers.aws.services.elbv2.elbv2_waf_acl_attached.elbv2_waf_acl_attached.elbv2_client",
                new=ELBv2(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ),
            mock.patch(
                "prowler.providers.aws.services.elbv2.elbv2_waf_acl_attached.elbv2_waf_acl_attached.wafv2_client",
                new=WAFv2(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ),
            mock.patch(
                "prowler.providers.aws.services.elbv2.elbv2_waf_acl_attached.elbv2_waf_acl_attached.wafregional_client",
                new=WAFRegional(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.elbv2.elbv2_waf_acl_attached.elbv2_waf_acl_attached import (
                elbv2_waf_acl_attached,
            )

            check = elbv2_waf_acl_attached()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_elbv2_without_WAF(self):
        conn = client("elbv2", region_name=AWS_REGION_EU_WEST_1)
        ec2 = resource("ec2", region_name=AWS_REGION_EU_WEST_1)
        wafv2 = client("wafv2", region_name="us-east-1")
        _ = wafv2.create_web_acl(
            Scope="REGIONAL",
            Name="my-web-acl",
            DefaultAction={"Allow": {}},
            VisibilityConfig={
                "SampledRequestsEnabled": False,
                "CloudWatchMetricsEnabled": False,
                "MetricName": "idk",
            },
        )["Summary"]
        security_group = ec2.create_security_group(
            GroupName="a-security-group", Description="First One"
        )
        vpc = ec2.create_vpc(CidrBlock="172.28.7.0/24", InstanceTenancy="default")
        subnet1 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.192/26",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZA,
        )
        subnet2 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.0/26",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZB,
        )

        lb = conn.create_load_balancer(
            Name="my-lb",
            Subnets=[subnet1.id, subnet2.id],
            SecurityGroups=[security_group.id],
            Scheme="internal",
            Type="application",
        )["LoadBalancers"][0]

        from prowler.providers.aws.services.elbv2.elbv2_service import ELBv2
        from prowler.providers.aws.services.waf.waf_service import WAFRegional
        from prowler.providers.aws.services.wafv2.wafv2_service import WAFv2

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(
                    [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
                ),
            ),
            mock.patch(
                "prowler.providers.aws.services.elbv2.elbv2_waf_acl_attached.elbv2_waf_acl_attached.elbv2_client",
                new=ELBv2(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ),
            mock.patch(
                "prowler.providers.aws.services.elbv2.elbv2_waf_acl_attached.elbv2_waf_acl_attached.wafv2_client",
                new=WAFv2(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ),
            mock.patch(
                "prowler.providers.aws.services.elbv2.elbv2_waf_acl_attached.elbv2_waf_acl_attached.wafregional_client",
                new=WAFRegional(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.elbv2.elbv2_waf_acl_attached.elbv2_waf_acl_attached import (
                elbv2_waf_acl_attached,
            )

            check = elbv2_waf_acl_attached()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "ELBv2 ALB my-lb is not protected by WAF Web ACL."
            )
            assert result[0].resource_id == "my-lb"
            assert result[0].resource_arn == lb["LoadBalancerArn"]

    @mock_aws
    def test_elbv2_with_WAF(self):
        conn = client("elbv2", region_name=AWS_REGION_EU_WEST_1)
        ec2 = resource("ec2", region_name=AWS_REGION_EU_WEST_1)
        wafv2 = client("wafv2", region_name="us-east-1")
        waf = wafv2.create_web_acl(
            Scope="REGIONAL",
            Name="my-web-acl",
            DefaultAction={"Allow": {}},
            VisibilityConfig={
                "SampledRequestsEnabled": False,
                "CloudWatchMetricsEnabled": False,
                "MetricName": "idk",
            },
        )["Summary"]
        security_group = ec2.create_security_group(
            GroupName="a-security-group", Description="First One"
        )
        vpc = ec2.create_vpc(CidrBlock="172.28.7.0/24", InstanceTenancy="default")
        subnet1 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.192/26",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZA,
        )
        subnet2 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.0/26",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZB,
        )

        lb = conn.create_load_balancer(
            Name="my-lb",
            Subnets=[subnet1.id, subnet2.id],
            SecurityGroups=[security_group.id],
            Scheme="internal",
            Type="application",
        )["LoadBalancers"][0]

        wafv2.associate_web_acl(WebACLArn=waf["ARN"], ResourceArn=lb["LoadBalancerArn"])

        from prowler.providers.aws.services.elbv2.elbv2_service import ELBv2
        from prowler.providers.aws.services.waf.waf_service import WAFRegional
        from prowler.providers.aws.services.wafv2.wafv2_service import WAFv2

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(
                    [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
                ),
            ),
            mock.patch(
                "prowler.providers.aws.services.elbv2.elbv2_waf_acl_attached.elbv2_waf_acl_attached.elbv2_client",
                new=ELBv2(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ),
            mock.patch(
                "prowler.providers.aws.services.elbv2.elbv2_waf_acl_attached.elbv2_waf_acl_attached.wafv2_client",
                new=WAFv2(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ) as service_client,
        ):
            with mock.patch(
                "prowler.providers.aws.services.elbv2.elbv2_waf_acl_attached.elbv2_waf_acl_attached.wafregional_client",
                new=WAFRegional(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.elbv2.elbv2_waf_acl_attached.elbv2_waf_acl_attached import (
                    elbv2_waf_acl_attached,
                )

                service_client.web_acls[waf["ARN"]].albs.append(lb["LoadBalancerArn"])

                check = elbv2_waf_acl_attached()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "ELBv2 ALB my-lb is protected by WAFv2 Web ACL my-web-acl."
                )
                assert result[0].resource_id == "my-lb"
                assert result[0].resource_arn == lb["LoadBalancerArn"]
```

--------------------------------------------------------------------------------

---[FILE: emr_service_test.py]---
Location: prowler-master/tests/providers/aws/services/emr/emr_service_test.py

```python
from datetime import datetime
from unittest.mock import patch

import botocore
from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.emr.emr_service import EMR, ClusterStatus
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

# Mocking Access Analyzer Calls
make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    """We have to mock every AWS API call using Boto3"""
    if operation_name == "GetBlockPublicAccessConfiguration":
        return {
            "BlockPublicAccessConfiguration": {
                "BlockPublicSecurityGroupRules": True,
                "PermittedPublicSecurityGroupRuleRanges": [
                    {"MinRange": 0, "MaxRange": 65535},
                ],
            },
            "BlockPublicAccessConfigurationMetadata": {
                "CreationDateTime": datetime(2015, 1, 1),
                "CreatedByArn": "test-arn",
            },
        }

    return make_api_call(self, operation_name, kwarg)


# Mock generate_regional_clients()
def mock_generate_regional_clients(provider, service):
    regional_client = provider._session.current_session.client(
        service, region_name=AWS_REGION_EU_WEST_1
    )
    regional_client.region = AWS_REGION_EU_WEST_1
    return {AWS_REGION_EU_WEST_1: regional_client}


@patch(
    "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
    new=mock_generate_regional_clients,
)
@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
class Test_EMR_Service:
    # Test EMR Client
    @mock_aws
    def test_get_client(self):
        emr = EMR(set_mocked_aws_provider())
        assert emr.regional_clients[AWS_REGION_EU_WEST_1].__class__.__name__ == "EMR"

    # Test EMR Session
    @mock_aws
    def test__get_session__(self):
        emr = EMR(set_mocked_aws_provider())
        assert emr.session.__class__.__name__ == "Session"

    # Test EMR Service
    @mock_aws
    def test__get_service__(self):
        emr = EMR(set_mocked_aws_provider())
        assert emr.service == "emr"

    # Test _list_clusters and _describe_cluster
    @mock_aws
    def test_list_clusters(self):
        # Create EMR Cluster
        emr_client = client("emr", region_name=AWS_REGION_EU_WEST_1)
        cluster_name = "test-cluster"
        run_job_flow_args = dict(
            Instances={
                "InstanceCount": 3,
                "KeepJobFlowAliveWhenNoSteps": True,
                "MasterInstanceType": "c3.medium",
                "Placement": {"AvailabilityZone": "us-east-1a"},
                "SlaveInstanceType": "c3.xlarge",
            },
            JobFlowRole="EMR_EC2_DefaultRole",
            LogUri="s3://mybucket/log",
            Name=cluster_name,
            ServiceRole="EMR_DefaultRole",
            VisibleToAllUsers=True,
            Tags=[
                {"Key": "test", "Value": "test"},
            ],
        )
        cluster_id = emr_client.run_job_flow(**run_job_flow_args)["JobFlowId"]
        # EMR Class
        emr = EMR(set_mocked_aws_provider())

        assert len(emr.clusters) == 1
        assert emr.clusters[cluster_id].id == cluster_id
        assert emr.clusters[cluster_id].name == cluster_name
        assert emr.clusters[cluster_id].status == ClusterStatus.WAITING
        assert (
            emr.clusters[cluster_id].arn
            == f"arn:aws:elasticmapreduce:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:cluster/{cluster_id}"
        )
        assert emr.clusters[cluster_id].region == AWS_REGION_EU_WEST_1
        assert (
            emr.clusters[cluster_id].master_public_dns_name
            == "ec2-184-0-0-1.us-west-1.compute.amazonaws.com"
        )
        assert emr.clusters[cluster_id].public
        assert emr.clusters[cluster_id].tags == [
            {"Key": "test", "Value": "test"},
        ]

    @mock_aws
    def test_get_block_public_access_configuration(self):
        emr = EMR(set_mocked_aws_provider())

        assert len(emr.block_public_access_configuration) == 1
        assert emr.block_public_access_configuration[
            AWS_REGION_EU_WEST_1
        ].block_public_security_group_rules
```

--------------------------------------------------------------------------------

---[FILE: emr_cluster_account_public_block_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/emr/emr_cluster_account_public_block_enabled/emr_cluster_account_public_block_enabled_test.py

```python
from unittest import mock

from prowler.providers.aws.services.emr.emr_service import (
    BlockPublicAccessConfiguration,
)
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_EU_WEST_1


class Test_emr_cluster_account_public_block_enabled:
    def test_account_public_block_enabled(self):
        emr_client = mock.MagicMock
        emr_client.audited_account = AWS_ACCOUNT_NUMBER
        emr_client.block_public_access_configuration = {
            AWS_REGION_EU_WEST_1: BlockPublicAccessConfiguration(
                block_public_security_group_rules=True
            )
        }
        emr_client.region = AWS_REGION_EU_WEST_1
        emr_client.audited_partition = "aws"
        emr_client.cluster_arn_template = f"arn:{emr_client.audited_partition}:elasticmapreduce:{emr_client.region}:{emr_client.audited_account}:cluster"
        emr_client._get_cluster_arn_template = mock.MagicMock(
            return_value=emr_client.cluster_arn_template
        )
        with mock.patch(
            "prowler.providers.aws.services.emr.emr_service.EMR",
            new=emr_client,
        ):
            # Test Check
            from prowler.providers.aws.services.emr.emr_cluster_account_public_block_enabled.emr_cluster_account_public_block_enabled import (
                emr_cluster_account_public_block_enabled,
            )

            check = emr_cluster_account_public_block_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "EMR Account has Block Public Access enabled."
            )

    def test_account_public_block_disabled(self):
        emr_client = mock.MagicMock
        emr_client.audited_account = AWS_ACCOUNT_NUMBER
        emr_client.block_public_access_configuration = {
            AWS_REGION_EU_WEST_1: BlockPublicAccessConfiguration(
                block_public_security_group_rules=False
            )
        }
        emr_client.region = AWS_REGION_EU_WEST_1
        emr_client.audited_partition = "aws"
        emr_client.cluster_arn_template = f"arn:{emr_client.audited_partition}:elasticmapreduce:{emr_client.region}:{emr_client.audited_account}:cluster"
        emr_client._get_cluster_arn_template = mock.MagicMock(
            return_value=emr_client.cluster_arn_template
        )
        with mock.patch(
            "prowler.providers.aws.services.emr.emr_service.EMR",
            new=emr_client,
        ):
            # Test Check
            from prowler.providers.aws.services.emr.emr_cluster_account_public_block_enabled.emr_cluster_account_public_block_enabled import (
                emr_cluster_account_public_block_enabled,
            )

            check = emr_cluster_account_public_block_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "EMR Account has Block Public Access disabled."
            )
```

--------------------------------------------------------------------------------

---[FILE: emr_cluster_master_nodes_no_public_ip_test.py]---
Location: prowler-master/tests/providers/aws/services/emr/emr_cluster_master_nodes_no_public_ip/emr_cluster_master_nodes_no_public_ip_test.py

```python
from unittest import mock

from prowler.providers.aws.services.emr.emr_service import Cluster, ClusterStatus
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_EU_WEST_1


class Test_emr_cluster_master_nodes_no_public_ip:
    def test_no_clusters(self):
        emr_client = mock.MagicMock
        emr_client.clusters = {}
        with mock.patch(
            "prowler.providers.aws.services.emr.emr_service.EMR",
            new=emr_client,
        ):
            # Test Check
            from prowler.providers.aws.services.emr.emr_cluster_master_nodes_no_public_ip.emr_cluster_master_nodes_no_public_ip import (
                emr_cluster_master_nodes_no_public_ip,
            )

            check = emr_cluster_master_nodes_no_public_ip()
            result = check.execute()

            assert len(result) == 0

    def test_cluster_public_running(self):
        emr_client = mock.MagicMock
        cluster_name = "test-cluster"
        cluster_id = "j-XWO1UKVCC6FCV"
        cluster_arn = f"arn:aws:elasticmapreduce:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:cluster/{cluster_name}"
        emr_client.clusters = {
            "test-cluster": Cluster(
                id=cluster_id,
                arn=cluster_arn,
                name=cluster_name,
                status=ClusterStatus.RUNNING,
                region=AWS_REGION_EU_WEST_1,
                master_public_dns_name="test.amazonaws.com",
                public=True,
            )
        }
        with mock.patch(
            "prowler.providers.aws.services.emr.emr_service.EMR",
            new=emr_client,
        ):
            # Test Check
            from prowler.providers.aws.services.emr.emr_cluster_master_nodes_no_public_ip.emr_cluster_master_nodes_no_public_ip import (
                emr_cluster_master_nodes_no_public_ip,
            )

            check = emr_cluster_master_nodes_no_public_ip()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == cluster_id
            assert result[0].resource_arn == cluster_arn
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"EMR Cluster {cluster_id} has a Public IP."
            )

    def test_cluster_private_running(self):
        emr_client = mock.MagicMock
        cluster_name = "test-cluster"
        cluster_id = "j-XWO1UKVCC6FCV"
        cluster_arn = f"arn:aws:elasticmapreduce:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:cluster/{cluster_name}"
        emr_client.clusters = {
            "test-cluster": Cluster(
                id=cluster_id,
                arn=cluster_arn,
                name=cluster_name,
                status=ClusterStatus.RUNNING,
                region=AWS_REGION_EU_WEST_1,
                master_public_dns_name="compute.internal",
                public=False,
            )
        }
        with mock.patch(
            "prowler.providers.aws.services.emr.emr_service.EMR",
            new=emr_client,
        ):
            # Test Check
            from prowler.providers.aws.services.emr.emr_cluster_master_nodes_no_public_ip.emr_cluster_master_nodes_no_public_ip import (
                emr_cluster_master_nodes_no_public_ip,
            )

            check = emr_cluster_master_nodes_no_public_ip()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == cluster_id
            assert result[0].resource_arn == cluster_arn
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"EMR Cluster {cluster_id} does not have a Public IP."
            )

    def test_cluster_public_terminated(self):
        emr_client = mock.MagicMock
        cluster_name = "test-cluster"
        cluster_id = "j-XWO1UKVCC6FCV"
        cluster_arn = f"arn:aws:elasticmapreduce:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:cluster/{cluster_name}"
        emr_client.clusters = {
            "test-cluster": Cluster(
                id=cluster_id,
                arn=cluster_arn,
                name=cluster_name,
                status=ClusterStatus.TERMINATED,
                region=AWS_REGION_EU_WEST_1,
                master_public_dns_name="test.amazonaws.com",
                public=True,
            )
        }
        with mock.patch(
            "prowler.providers.aws.services.emr.emr_service.EMR",
            new=emr_client,
        ):
            # Test Check
            from prowler.providers.aws.services.emr.emr_cluster_master_nodes_no_public_ip.emr_cluster_master_nodes_no_public_ip import (
                emr_cluster_master_nodes_no_public_ip,
            )

            check = emr_cluster_master_nodes_no_public_ip()
            result = check.execute()

            assert len(result) == 0

    def test_cluster_private_bootstrapping(self):
        emr_client = mock.MagicMock
        cluster_name = "test-cluster"
        cluster_id = "j-XWO1UKVCC6FCV"
        cluster_arn = f"arn:aws:elasticmapreduce:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:cluster/{cluster_name}"
        emr_client.clusters = {
            "test-cluster": Cluster(
                id=cluster_id,
                arn=cluster_arn,
                name=cluster_name,
                status=ClusterStatus.BOOTSTRAPPING,
                region=AWS_REGION_EU_WEST_1,
                master_public_dns_name="compute.internal",
                public=False,
            )
        }
        with mock.patch(
            "prowler.providers.aws.services.emr.emr_service.EMR",
            new=emr_client,
        ):
            # Test Check
            from prowler.providers.aws.services.emr.emr_cluster_master_nodes_no_public_ip.emr_cluster_master_nodes_no_public_ip import (
                emr_cluster_master_nodes_no_public_ip,
            )

            check = emr_cluster_master_nodes_no_public_ip()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == cluster_id
            assert result[0].resource_arn == cluster_arn
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"EMR Cluster {cluster_id} does not have a Public IP."
            )
```

--------------------------------------------------------------------------------

````
