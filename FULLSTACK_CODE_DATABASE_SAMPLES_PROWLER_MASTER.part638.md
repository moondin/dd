---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 638
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 638 of 867)

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

---[FILE: vpc_endpoint_connections_trust_boundaries_test.py]---
Location: prowler-master/tests/providers/aws/services/vpc/vpc_endpoint_connections_trust_boundaries/vpc_endpoint_connections_trust_boundaries_test.py

```python
import json
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

TRUSTED_AWS_ACCOUNT_NUMBER = "111122223333"
NON_TRUSTED_AWS_ACCOUNT_NUMBER = "000011112222"


class Test_vpc_endpoint_connections_trust_boundaries:
    @mock_aws
    def test_vpc_no_endpoints(self):
        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        # Set config variable
        aws_provider._audit_config = {"trusted_account_ids": []}

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_endpoint_connections_trust_boundaries.vpc_endpoint_connections_trust_boundaries.vpc_client",
                new=VPC(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.vpc.vpc_endpoint_connections_trust_boundaries.vpc_endpoint_connections_trust_boundaries import (
                    vpc_endpoint_connections_trust_boundaries,
                )

                check = vpc_endpoint_connections_trust_boundaries()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_vpc_aws_endpoint(self):
        # Create VPC Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)

        vpc = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]

        route_table = ec2_client.create_route_table(VpcId=vpc["VpcId"])["RouteTable"]
        ec2_client.create_vpc_endpoint(
            VpcId=vpc["VpcId"],
            ServiceName="com.amazonaws.vpce.us-east-1.s3",
            RouteTableIds=[route_table["RouteTableId"]],
            VpcEndpointType="Interface",
        )

        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        # Set config variable
        aws_provider._audit_config = {"trusted_account_ids": []}

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_endpoint_connections_trust_boundaries.vpc_endpoint_connections_trust_boundaries.vpc_client",
                new=VPC(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.vpc.vpc_endpoint_connections_trust_boundaries.vpc_endpoint_connections_trust_boundaries import (
                    vpc_endpoint_connections_trust_boundaries,
                )

                check = vpc_endpoint_connections_trust_boundaries()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_vpc_endpoint_with_full_access(self):
        # Create VPC Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)

        vpc = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]

        route_table = ec2_client.create_route_table(VpcId=vpc["VpcId"])["RouteTable"]
        vpc_endpoint = ec2_client.create_vpc_endpoint(
            VpcId=vpc["VpcId"],
            ServiceName="com.amazonaws.us-east-1.s3",
            RouteTableIds=[route_table["RouteTableId"]],
            VpcEndpointType="Gateway",
            PolicyDocument=json.dumps(
                {
                    "Statement": [
                        {
                            "Action": "*",
                            "Effect": "Allow",
                            "Principal": "*",
                            "Resource": "*",
                        }
                    ]
                }
            ),
        )

        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        # Set config variable
        aws_provider._audit_config = {"trusted_account_ids": []}

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_endpoint_connections_trust_boundaries.vpc_endpoint_connections_trust_boundaries.vpc_client",
                new=VPC(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.vpc.vpc_endpoint_connections_trust_boundaries.vpc_endpoint_connections_trust_boundaries import (
                    vpc_endpoint_connections_trust_boundaries,
                )

                check = vpc_endpoint_connections_trust_boundaries()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"VPC Endpoint {vpc_endpoint['VpcEndpoint']['VpcEndpointId']} in VPC {vpc['VpcId']} can be accessed from non-trusted accounts."
                )
                assert (
                    result[0].resource_id
                    == vpc_endpoint["VpcEndpoint"]["VpcEndpointId"]
                )
                assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_vpc_endpoint_with_trusted_account_arn(self):
        # Create VPC Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)

        vpc = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]

        route_table = ec2_client.create_route_table(VpcId=vpc["VpcId"])["RouteTable"]
        vpc_endpoint = ec2_client.create_vpc_endpoint(
            VpcId=vpc["VpcId"],
            ServiceName="com.amazonaws.us-east-1.s3",
            RouteTableIds=[route_table["RouteTableId"]],
            VpcEndpointType="Gateway",
            PolicyDocument=json.dumps(
                {
                    "Statement": [
                        {
                            "Effect": "Allow",
                            "Principal": {
                                "AWS": f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
                            },
                            "Action": "*",
                            "Resource": "*",
                        }
                    ]
                }
            ),
        )
        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        # Set config variable
        aws_provider._audit_config = {"trusted_account_ids": []}

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_endpoint_connections_trust_boundaries.vpc_endpoint_connections_trust_boundaries.vpc_client",
                new=VPC(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.vpc.vpc_endpoint_connections_trust_boundaries.vpc_endpoint_connections_trust_boundaries import (
                    vpc_endpoint_connections_trust_boundaries,
                )

                check = vpc_endpoint_connections_trust_boundaries()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"VPC Endpoint {vpc_endpoint['VpcEndpoint']['VpcEndpointId']} in VPC {vpc['VpcId']} can only be accessed from trusted accounts."
                )
                assert (
                    result[0].resource_id
                    == vpc_endpoint["VpcEndpoint"]["VpcEndpointId"]
                )
                assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_vpc_endpoint_with_trusted_account_id(self):
        # Create VPC Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)

        vpc = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]

        route_table = ec2_client.create_route_table(VpcId=vpc["VpcId"])["RouteTable"]
        vpc_endpoint = ec2_client.create_vpc_endpoint(
            VpcId=vpc["VpcId"],
            ServiceName="com.amazonaws.us-east-1.s3",
            RouteTableIds=[route_table["RouteTableId"]],
            VpcEndpointType="Gateway",
            PolicyDocument=json.dumps(
                {
                    "Statement": [
                        {
                            "Effect": "Allow",
                            "Principal": {"AWS": AWS_ACCOUNT_NUMBER},
                            "Action": "*",
                            "Resource": "*",
                        }
                    ]
                }
            ),
        )
        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        # Set config variable
        aws_provider._audit_config = {"trusted_account_ids": []}

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_endpoint_connections_trust_boundaries.vpc_endpoint_connections_trust_boundaries.vpc_client",
                new=VPC(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.vpc.vpc_endpoint_connections_trust_boundaries.vpc_endpoint_connections_trust_boundaries import (
                    vpc_endpoint_connections_trust_boundaries,
                )

                check = vpc_endpoint_connections_trust_boundaries()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"VPC Endpoint {vpc_endpoint['VpcEndpoint']['VpcEndpointId']} in VPC {vpc['VpcId']} can only be accessed from trusted accounts."
                )
                assert (
                    result[0].resource_id
                    == vpc_endpoint["VpcEndpoint"]["VpcEndpointId"]
                )
                assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_vpc_endpoint_with_untrusted_account(self):
        # Create VPC Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)

        vpc = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]

        route_table = ec2_client.create_route_table(VpcId=vpc["VpcId"])["RouteTable"]
        vpc_endpoint = ec2_client.create_vpc_endpoint(
            VpcId=vpc["VpcId"],
            ServiceName="com.amazonaws.us-east-1.s3",
            RouteTableIds=[route_table["RouteTableId"]],
            VpcEndpointType="Gateway",
            PolicyDocument=json.dumps(
                {
                    "Statement": [
                        {
                            "Effect": "Allow",
                            "Principal": {
                                "AWS": f"arn:aws:iam::{NON_TRUSTED_AWS_ACCOUNT_NUMBER}:root"
                            },
                            "Action": "*",
                            "Resource": "*",
                        }
                    ]
                }
            ),
        )

        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        # Set config variable
        aws_provider._audit_config = {"trusted_account_ids": []}

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_endpoint_connections_trust_boundaries.vpc_endpoint_connections_trust_boundaries.vpc_client",
                new=VPC(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.vpc.vpc_endpoint_connections_trust_boundaries.vpc_endpoint_connections_trust_boundaries import (
                    vpc_endpoint_connections_trust_boundaries,
                )

                check = vpc_endpoint_connections_trust_boundaries()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"VPC Endpoint {vpc_endpoint['VpcEndpoint']['VpcEndpointId']} in VPC {vpc['VpcId']} can be accessed from non-trusted accounts."
                )
                assert (
                    result[0].resource_id
                    == vpc_endpoint["VpcEndpoint"]["VpcEndpointId"]
                )

    @mock_aws
    def test_vpc_endpoint_with_config_trusted_account_with_arn(self):
        # Create VPC Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)

        vpc = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]

        route_table = ec2_client.create_route_table(VpcId=vpc["VpcId"])["RouteTable"]
        vpc_endpoint = ec2_client.create_vpc_endpoint(
            VpcId=vpc["VpcId"],
            ServiceName="com.amazonaws.us-east-1.s3",
            RouteTableIds=[route_table["RouteTableId"]],
            VpcEndpointType="Gateway",
            PolicyDocument=json.dumps(
                {
                    "Statement": [
                        {
                            "Effect": "Allow",
                            "Principal": {
                                "AWS": f"arn:aws:iam::{TRUSTED_AWS_ACCOUNT_NUMBER}:root"
                            },
                            "Action": "*",
                            "Resource": "*",
                        }
                    ]
                }
            ),
        )
        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        # Set config variable
        aws_provider._audit_config = {
            "trusted_account_ids": [TRUSTED_AWS_ACCOUNT_NUMBER]
        }

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_endpoint_connections_trust_boundaries.vpc_endpoint_connections_trust_boundaries.vpc_client",
                new=VPC(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.vpc.vpc_endpoint_connections_trust_boundaries.vpc_endpoint_connections_trust_boundaries import (
                    vpc_endpoint_connections_trust_boundaries,
                )

                check = vpc_endpoint_connections_trust_boundaries()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"VPC Endpoint {vpc_endpoint['VpcEndpoint']['VpcEndpointId']} in VPC {vpc['VpcId']} can only be accessed from trusted accounts."
                )
                assert (
                    result[0].resource_id
                    == vpc_endpoint["VpcEndpoint"]["VpcEndpointId"]
                )
                assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_vpc_endpoint_with_config_trusted_account(self):
        # Create VPC Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)

        vpc = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]

        route_table = ec2_client.create_route_table(VpcId=vpc["VpcId"])["RouteTable"]
        vpc_endpoint = ec2_client.create_vpc_endpoint(
            VpcId=vpc["VpcId"],
            ServiceName="com.amazonaws.us-east-1.s3",
            RouteTableIds=[route_table["RouteTableId"]],
            VpcEndpointType="Gateway",
            PolicyDocument=json.dumps(
                {
                    "Statement": [
                        {
                            "Effect": "Allow",
                            "Principal": {"AWS": [TRUSTED_AWS_ACCOUNT_NUMBER]},
                            "Action": "*",
                            "Resource": "*",
                        }
                    ]
                }
            ),
        )
        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        # Set config variable
        aws_provider._audit_config = {
            "trusted_account_ids": [TRUSTED_AWS_ACCOUNT_NUMBER]
        }

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_endpoint_connections_trust_boundaries.vpc_endpoint_connections_trust_boundaries.vpc_client",
                new=VPC(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.vpc.vpc_endpoint_connections_trust_boundaries.vpc_endpoint_connections_trust_boundaries import (
                    vpc_endpoint_connections_trust_boundaries,
                )

                check = vpc_endpoint_connections_trust_boundaries()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"VPC Endpoint {vpc_endpoint['VpcEndpoint']['VpcEndpointId']} in VPC {vpc['VpcId']} can only be accessed from trusted accounts."
                )
                assert (
                    result[0].resource_id
                    == vpc_endpoint["VpcEndpoint"]["VpcEndpointId"]
                )
                assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_vpc_endpoint_with_two_account_ids_one_trusted_one_not(self):
        # Create VPC Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)

        vpc = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]

        route_table = ec2_client.create_route_table(VpcId=vpc["VpcId"])["RouteTable"]
        vpc_endpoint = ec2_client.create_vpc_endpoint(
            VpcId=vpc["VpcId"],
            ServiceName="com.amazonaws.us-east-1.s3",
            RouteTableIds=[route_table["RouteTableId"]],
            VpcEndpointType="Gateway",
            PolicyDocument=json.dumps(
                {
                    "Statement": [
                        {
                            "Effect": "Allow",
                            "Principal": {
                                "AWS": [
                                    NON_TRUSTED_AWS_ACCOUNT_NUMBER,
                                    TRUSTED_AWS_ACCOUNT_NUMBER,
                                ]
                            },
                            "Action": "*",
                            "Resource": "*",
                        }
                    ]
                }
            ),
        )
        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        # Set config variable
        aws_provider._audit_config = {"trusted_account_ids": []}

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_endpoint_connections_trust_boundaries.vpc_endpoint_connections_trust_boundaries.vpc_client",
                new=VPC(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.vpc.vpc_endpoint_connections_trust_boundaries.vpc_endpoint_connections_trust_boundaries import (
                    vpc_endpoint_connections_trust_boundaries,
                )

                check = vpc_endpoint_connections_trust_boundaries()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"VPC Endpoint {vpc_endpoint['VpcEndpoint']['VpcEndpointId']} in VPC {vpc['VpcId']} can be accessed from non-trusted accounts."
                )
                assert (
                    result[0].resource_id
                    == vpc_endpoint["VpcEndpoint"]["VpcEndpointId"]
                )
                assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_vpc_endpoint_with_aws_principal_all(self):
        # Create VPC Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)

        vpc = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]

        route_table = ec2_client.create_route_table(VpcId=vpc["VpcId"])["RouteTable"]
        vpc_endpoint = ec2_client.create_vpc_endpoint(
            VpcId=vpc["VpcId"],
            ServiceName="com.amazonaws.us-east-1.s3",
            RouteTableIds=[route_table["RouteTableId"]],
            VpcEndpointType="Gateway",
            PolicyDocument=json.dumps(
                {
                    "Statement": [
                        {
                            "Effect": "Allow",
                            "Principal": {"AWS": "*"},
                            "Action": "*",
                            "Resource": "*",
                        }
                    ]
                }
            ),
        )
        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        # Set config variable
        aws_provider._audit_config = {"trusted_account_ids": []}

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_endpoint_connections_trust_boundaries.vpc_endpoint_connections_trust_boundaries.vpc_client",
                new=VPC(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.vpc.vpc_endpoint_connections_trust_boundaries.vpc_endpoint_connections_trust_boundaries import (
                    vpc_endpoint_connections_trust_boundaries,
                )

                check = vpc_endpoint_connections_trust_boundaries()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"VPC Endpoint {vpc_endpoint['VpcEndpoint']['VpcEndpointId']} in VPC {vpc['VpcId']} can be accessed from non-trusted accounts."
                )
                assert (
                    result[0].resource_id
                    == vpc_endpoint["VpcEndpoint"]["VpcEndpointId"]
                )
                assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_vpc_endpoint_with_aws_principal_all_but_restricted_condition_with_SourceAccount(
        self,
    ):
        # Create VPC Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)

        vpc = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]

        route_table = ec2_client.create_route_table(VpcId=vpc["VpcId"])["RouteTable"]
        vpc_endpoint = ec2_client.create_vpc_endpoint(
            VpcId=vpc["VpcId"],
            ServiceName="com.amazonaws.us-east-1.s3",
            RouteTableIds=[route_table["RouteTableId"]],
            VpcEndpointType="Gateway",
            PolicyDocument=json.dumps(
                {
                    "Statement": [
                        {
                            "Action": "*",
                            "Effect": "Allow",
                            "Principal": "*",
                            "Resource": "*",
                            "Condition": {
                                "StringEquals": {
                                    "aws:SourceAccount": AWS_ACCOUNT_NUMBER
                                }
                            },
                        }
                    ]
                }
            ),
        )
        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        # Set config variable
        aws_provider._audit_config = {"trusted_account_ids": []}

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_endpoint_connections_trust_boundaries.vpc_endpoint_connections_trust_boundaries.vpc_client",
                new=VPC(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.vpc.vpc_endpoint_connections_trust_boundaries.vpc_endpoint_connections_trust_boundaries import (
                    vpc_endpoint_connections_trust_boundaries,
                )

                check = vpc_endpoint_connections_trust_boundaries()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"VPC Endpoint {vpc_endpoint['VpcEndpoint']['VpcEndpointId']} in VPC {vpc['VpcId']} can only be accessed from trusted accounts."
                )
                assert (
                    result[0].resource_id
                    == vpc_endpoint["VpcEndpoint"]["VpcEndpointId"]
                )
                assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_vpc_endpoint_with_aws_principal_all_but_restricted_condition_with_PrincipalAccount(
        self,
    ):
        # Create VPC Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)

        vpc = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]

        route_table = ec2_client.create_route_table(VpcId=vpc["VpcId"])["RouteTable"]
        vpc_endpoint = ec2_client.create_vpc_endpoint(
            VpcId=vpc["VpcId"],
            ServiceName="com.amazonaws.us-east-1.s3",
            RouteTableIds=[route_table["RouteTableId"]],
            VpcEndpointType="Gateway",
            PolicyDocument=json.dumps(
                {
                    "Statement": [
                        {
                            "Action": "*",
                            "Effect": "Allow",
                            "Principal": "*",
                            "Resource": "*",
                            "Condition": {
                                "StringEquals": {
                                    "aws:PrincipalAccount": AWS_ACCOUNT_NUMBER
                                }
                            },
                        }
                    ]
                }
            ),
        )
        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        # Set config variable
        aws_provider._audit_config = {"trusted_account_ids": []}

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_endpoint_connections_trust_boundaries.vpc_endpoint_connections_trust_boundaries.vpc_client",
                new=VPC(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.vpc.vpc_endpoint_connections_trust_boundaries.vpc_endpoint_connections_trust_boundaries import (
                    vpc_endpoint_connections_trust_boundaries,
                )

                check = vpc_endpoint_connections_trust_boundaries()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"VPC Endpoint {vpc_endpoint['VpcEndpoint']['VpcEndpointId']} in VPC {vpc['VpcId']} can only be accessed from trusted accounts."
                )
                assert (
                    result[0].resource_id
                    == vpc_endpoint["VpcEndpoint"]["VpcEndpointId"]
                )
                assert result[0].region == AWS_REGION_US_EAST_1
```

--------------------------------------------------------------------------------

---[FILE: vpc_endpoint_for_ec2_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/vpc/vpc_endpoint_for_ec2_enabled/vpc_endpoint_for_ec2_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_vpc_endpoint_for_ec2_enabled:
    @mock_aws
    def test_vpc_no_endpoints(self):
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc_id = ec2_client.describe_vpcs()["Vpcs"][0]["VpcId"]
        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_endpoint_for_ec2_enabled.vpc_endpoint_for_ec2_enabled.vpc_client",
                new=VPC(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.vpc.vpc_endpoint_for_ec2_enabled.vpc_endpoint_for_ec2_enabled import (
                    vpc_endpoint_for_ec2_enabled,
                )

                check = vpc_endpoint_for_ec2_enabled()
                result = check.execute()

                assert len(result) == 1
                assert result[0].resource_id == vpc_id
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].status == "FAIL"
                assert result[0].status_extended == f"VPC {vpc_id} has no EC2 endpoint."

    @mock_aws
    def test_vpc_no_ec2_endpoint(self):
        # Create VPC Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)

        vpc = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]
        vpc_default_id = ec2_client.describe_vpcs()["Vpcs"][0]["VpcId"]

        route_table = ec2_client.create_route_table(VpcId=vpc["VpcId"])["RouteTable"]
        ec2_client.create_vpc_endpoint(
            VpcId=vpc["VpcId"],
            ServiceName="com.amazonaws.vpce.us-east-1.s3",
            RouteTableIds=[route_table["RouteTableId"]],
            VpcEndpointType="Interface",
        )

        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_endpoint_for_ec2_enabled.vpc_endpoint_for_ec2_enabled.vpc_client",
                new=VPC(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.vpc.vpc_endpoint_for_ec2_enabled.vpc_endpoint_for_ec2_enabled import (
                    vpc_endpoint_for_ec2_enabled,
                )

                check = vpc_endpoint_for_ec2_enabled()
                result = check.execute()

                # One VPC is created by default, so we should have 2 results
                assert len(result) == 2
                for result_vpc in result:
                    if result_vpc.resource_id == vpc["VpcId"]:
                        assert result_vpc.region == AWS_REGION_US_EAST_1
                        assert result_vpc.status == "FAIL"
                        assert (
                            result_vpc.status_extended
                            == f"VPC {vpc['VpcId']} has no EC2 endpoint."
                        )
                        assert (
                            result_vpc.resource_arn
                            == f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:123456789012:vpc/{vpc['VpcId']}"
                        )
                    else:
                        assert result_vpc.region == AWS_REGION_US_EAST_1
                        assert result_vpc.status == "FAIL"
                        assert (
                            result_vpc.status_extended
                            == f"VPC {vpc_default_id} has no EC2 endpoint."
                        )
                        assert result_vpc.resource_id == vpc_default_id

    @mock_aws
    def test_vpc_ec2_endpoint_enabled(self):
        # Create VPC Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)

        vpc = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]
        vpc_default_id = ec2_client.describe_vpcs()["Vpcs"][0]["VpcId"]

        route_table = ec2_client.create_route_table(VpcId=vpc["VpcId"])["RouteTable"]
        ec2_client.create_vpc_endpoint(
            VpcId=vpc["VpcId"],
            ServiceName="com.amazonaws.vpce.us-east-1.ec2",
            RouteTableIds=[route_table["RouteTableId"]],
            VpcEndpointType="Gateway",
        )

        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_endpoint_for_ec2_enabled.vpc_endpoint_for_ec2_enabled.vpc_client",
                new=VPC(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.vpc.vpc_endpoint_for_ec2_enabled.vpc_endpoint_for_ec2_enabled import (
                    vpc_endpoint_for_ec2_enabled,
                )

                check = vpc_endpoint_for_ec2_enabled()
                result = check.execute()

                # One VPC is created by default, so we should have 2 results
                assert len(result) == 2
                for result_vpc in result:
                    if result_vpc.resource_id == vpc["VpcId"]:
                        assert result_vpc.region == AWS_REGION_US_EAST_1
                        assert result_vpc.status == "PASS"
                        assert (
                            result_vpc.status_extended
                            == f"VPC {vpc['VpcId']} has an EC2 Gateway endpoint."
                        )
                        assert (
                            result_vpc.resource_arn
                            == f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:123456789012:vpc/{vpc['VpcId']}"
                        )
                    else:
                        assert result_vpc.region == AWS_REGION_US_EAST_1
                        assert result_vpc.status == "FAIL"
                        assert (
                            result_vpc.status_extended
                            == f"VPC {vpc_default_id} has no EC2 endpoint."
                        )
                        assert result_vpc.resource_id == vpc_default_id
```

--------------------------------------------------------------------------------

````
