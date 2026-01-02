---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 526
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 526 of 867)

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

---[FILE: ec2_instance_secrets_user_data_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_instance_secrets_user_data/ec2_instance_secrets_user_data_test.py

```python
from os import path
from pathlib import Path
from unittest import mock

from boto3 import resource
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

EXAMPLE_AMI_ID = "ami-12c6146b"

ACTUAL_DIRECTORY = Path(path.dirname(path.realpath(__file__)))
FIXTURES_DIR_NAME = "fixtures"


class Test_ec2_instance_secrets_user_data:
    @mock_aws
    def test_no_ec2(self):
        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_secrets_user_data.ec2_instance_secrets_user_data.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_instance_secrets_user_data.ec2_instance_secrets_user_data import (
                ec2_instance_secrets_user_data,
            )

            check = ec2_instance_secrets_user_data()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_one_ec2_with_no_secrets(self):
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        instance = ec2.create_instances(
            ImageId=EXAMPLE_AMI_ID,
            MinCount=1,
            MaxCount=1,
            UserData="This is some user_data",
        )[0]

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_secrets_user_data.ec2_instance_secrets_user_data.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ec2.ec2_instance_secrets_user_data.ec2_instance_secrets_user_data import (
                ec2_instance_secrets_user_data,
            )

            check = ec2_instance_secrets_user_data()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"No secrets found in EC2 instance {instance.id} User Data."
            )
            assert result[0].resource_id == instance.id
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:instance/{instance.id}"
            )
            assert result[0].resource_tags is None
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_one_ec2_with_secrets(self):
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        instance = ec2.create_instances(
            ImageId=EXAMPLE_AMI_ID,
            MinCount=1,
            MaxCount=1,
            UserData="DB_PASSWORD=foobar123",
        )[0]

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_secrets_user_data.ec2_instance_secrets_user_data.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ec2.ec2_instance_secrets_user_data.ec2_instance_secrets_user_data import (
                ec2_instance_secrets_user_data,
            )

            check = ec2_instance_secrets_user_data()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Potential secret found in EC2 instance {instance.id} User Data -> Secret Keyword on line 1."
            )
            assert result[0].resource_id == instance.id
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:instance/{instance.id}"
            )
            assert result[0].resource_tags is None
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_one_ec2_with_secrets_other_case(self):
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        instance = ec2.create_instances(
            ImageId=EXAMPLE_AMI_ID,
            MinCount=1,
            MaxCount=1,
            UserData="MYSQL_ALLOW_EMPTY_PASSWORD: 'yes'",
        )[0]

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        ec2_client = EC2(aws_provider)

        ec2_client.audit_config = {
            "secrets_ignore_patterns": [".*_ALLOW_EMPTY_PASSWORD.*"]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_secrets_user_data.ec2_instance_secrets_user_data.ec2_client",
                new=ec2_client,
            ),
        ):
            from prowler.providers.aws.services.ec2.ec2_instance_secrets_user_data.ec2_instance_secrets_user_data import (
                ec2_instance_secrets_user_data,
            )

            check = ec2_instance_secrets_user_data()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"No secrets found in EC2 instance {instance.id} User Data."
            )
            assert result[0].resource_id == instance.id
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:instance/{instance.id}"
            )
            assert result[0].resource_tags is None
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_one_ec2_file_with_secrets(self):
        # Include launch_configurations to check
        f = open(
            f"{ACTUAL_DIRECTORY}/{FIXTURES_DIR_NAME}/fixture",
            "r",
        )
        secrets = f.read()
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        instance = ec2.create_instances(
            ImageId=EXAMPLE_AMI_ID, MinCount=1, MaxCount=1, UserData=secrets
        )[0]

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_secrets_user_data.ec2_instance_secrets_user_data.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ec2.ec2_instance_secrets_user_data.ec2_instance_secrets_user_data import (
                ec2_instance_secrets_user_data,
            )

            check = ec2_instance_secrets_user_data()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Potential secret found in EC2 instance {instance.id} User Data -> Secret Keyword on line 1, Hex High Entropy String on line 3, Secret Keyword on line 3, Secret Keyword on line 4."
            )
            assert result[0].resource_id == instance.id
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:instance/{instance.id}"
            )
            assert result[0].resource_tags is None
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_one_launch_configurations_without_user_data(self):
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        instance = ec2.create_instances(
            ImageId=EXAMPLE_AMI_ID, MinCount=1, MaxCount=1, UserData=""
        )[0]

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_secrets_user_data.ec2_instance_secrets_user_data.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ec2.ec2_instance_secrets_user_data.ec2_instance_secrets_user_data import (
                ec2_instance_secrets_user_data,
            )

            check = ec2_instance_secrets_user_data()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"No secrets found in EC2 instance {instance.id} since User Data is empty."
            )
            assert result[0].resource_id == instance.id
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:instance/{instance.id}"
            )
            assert result[0].resource_tags is None
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_one_ec2_file_with_secrets_gzip(self):
        # Include launch_configurations to check
        f = open(
            f"{ACTUAL_DIRECTORY}/{FIXTURES_DIR_NAME}/fixture.gz",
            "rb",
        )
        secrets = f.read()
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        instance = ec2.create_instances(
            ImageId=EXAMPLE_AMI_ID, MinCount=1, MaxCount=1, UserData=secrets
        )[0]

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_secrets_user_data.ec2_instance_secrets_user_data.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ec2.ec2_instance_secrets_user_data.ec2_instance_secrets_user_data import (
                ec2_instance_secrets_user_data,
            )

            check = ec2_instance_secrets_user_data()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Potential secret found in EC2 instance {instance.id} User Data -> Secret Keyword on line 1, Hex High Entropy String on line 3, Secret Keyword on line 3, Secret Keyword on line 4."
            )
            assert result[0].resource_id == instance.id
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:instance/{instance.id}"
            )
            assert result[0].resource_tags is None
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_one_secrets_with_unicode_error(self):
        invalid_utf8_bytes = b"\xc0\xaf"
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        ec2.create_instances(
            ImageId=EXAMPLE_AMI_ID, MinCount=1, MaxCount=1, UserData=invalid_utf8_bytes
        )

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_secrets_user_data.ec2_instance_secrets_user_data.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ec2.ec2_instance_secrets_user_data.ec2_instance_secrets_user_data import (
                ec2_instance_secrets_user_data,
            )

            check = ec2_instance_secrets_user_data()
            result = check.execute()

            assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: fixture]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_instance_secrets_user_data/fixtures/fixture

```text
DB_PASSWORD=foobar123
DB_USER=foo
API_KEY=12345abcd
SERVICE_PASSWORD=bbaabb45
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_uses_single_eni_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_instance_uses_single_eni/ec2_instance_uses_single_eni_test.py

```python
from unittest import mock

import botocore
from boto3 import resource
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "DescribeInstances":
        return {
            "Reservations": [
                {
                    "Instances": [
                        {
                            "InstanceId": "i-0123456789abcdef0",
                            "State": {"Name": "running"},
                            "InstanceType": "t2.micro",
                            "ImageId": "ami-12345678",
                            "LaunchTime": "2023-09-01T12:34:56Z",
                            "PrivateDnsName": "ip-172-31-32-101.ec2.internal",
                            "Monitoring": {"State": "disabled"},
                            "SecurityGroups": [
                                {"GroupId": "sg-12345678", "GroupName": "default"}
                            ],
                            "SubnetId": "subnet-12345678",
                            "Tags": [{"Key": "Name", "Value": "MyInstance"}],
                            "NetworkInterfaces": [
                                {"NetworkInterfaceId": "eni-1"},
                                {"NetworkInterfaceId": "eni-2"},
                            ],
                        }
                    ]
                }
            ]
        }
    elif operation_name == "DescribeNetworkInterfaces":
        return {
            "NetworkInterfaces": [
                {
                    "NetworkInterfaceId": "eni-1",
                    "SubnetId": "subnet-1234abcd",
                    "VpcId": "vpc-1234abcd",
                    "PrivateIpAddress": "192.168.1.1",
                    "InterfaceType": "interface",
                },
                {
                    "NetworkInterfaceId": "eni-2",
                    "SubnetId": "subnet-1234abcd",
                    "VpcId": "vpc-1234abcd",
                    "PrivateIpAddress": "192.168.1.2",
                    "InterfaceType": "efa",
                },
            ]
        }
    return make_api_call(self, operation_name, kwarg)


def mock_make_api_call_v2(self, operation_name, kwarg):
    if operation_name == "DescribeInstances":
        return {
            "Reservations": [
                {
                    "Instances": [
                        {
                            "InstanceId": "i-0123456789abcdef0",
                            "State": {"Name": "running"},
                            "InstanceType": "t2.micro",
                            "ImageId": "ami-12345678",
                            "LaunchTime": "2023-09-01T12:34:56Z",
                            "PrivateDnsName": "ip-172-31-32-101.ec2.internal",
                            "Monitoring": {"State": "disabled"},
                            "SecurityGroups": [
                                {"GroupId": "sg-12345678", "GroupName": "default"}
                            ],
                            "SubnetId": "subnet-12345678",
                            "Tags": [{"Key": "Name", "Value": "MyInstance"}],
                            "NetworkInterfaces": [],
                        }
                    ]
                }
            ]
        }
    elif operation_name == "DescribeNetworkInterfaces":
        return {
            "NetworkInterfaces": [
                {
                    "NetworkInterfaceId": "eni-3",
                    "SubnetId": "subnet-5678abcd",
                    "VpcId": "vpc-5678abcd",
                    "PrivateIpAddress": "192.168.1.3",
                    "InterfaceType": "interface",
                }
            ]
        }
    return make_api_call(self, operation_name, kwarg)


def mock_make_api_call_v3(self, operation_name, kwarg):
    if operation_name == "DescribeInstances":
        return {
            "Reservations": [
                {
                    "Instances": [
                        {
                            "InstanceId": "i-0123456789abcdef0",
                            "State": {"Name": "running"},
                            "InstanceType": "t2.micro",
                            "ImageId": "ami-12345678",
                            "LaunchTime": "2023-09-01T12:34:56Z",
                            "PrivateDnsName": "ip-172-31-32-101.ec2.internal",
                            "Monitoring": {"State": "disabled"},
                            "SecurityGroups": [
                                {"GroupId": "sg-12345678", "GroupName": "default"}
                            ],
                            "SubnetId": "subnet-12345678",
                            "Tags": [{"Key": "Name", "Value": "MyInstance"}],
                            "NetworkInterfaces": [
                                {"NetworkInterfaceId": "eni-1"},
                                {"NetworkInterfaceId": "eni-2"},
                                {"NetworkInterfaceId": "eni-3"},
                            ],
                        }
                    ]
                }
            ]
        }
    elif operation_name == "DescribeNetworkInterfaces":
        return {
            "NetworkInterfaces": [
                {
                    "NetworkInterfaceId": "eni-1",
                    "SubnetId": "subnet-1234abcd",
                    "VpcId": "vpc-1234abcd",
                    "PrivateIpAddress": "192.168.1.1",
                    "InterfaceType": "trunk",
                },
                {
                    "NetworkInterfaceId": "eni-2",
                    "SubnetId": "subnet-1234abcd",
                    "VpcId": "vpc-1234abcd",
                    "PrivateIpAddress": "192.168.1.2",
                    "InterfaceType": "efa",
                },
                {
                    "NetworkInterfaceId": "eni-3",
                    "SubnetId": "subnet-1234abcd",
                    "VpcId": "vpc-1234abcd",
                    "PrivateIpAddress": "192.168.1.3",
                    "InterfaceType": "trunk",
                },
            ]
        }
    return make_api_call(self, operation_name, kwarg)


class Test_ec2_instance_uses_single_eni:
    @mock_aws
    def test_ec2_no_instances(self):
        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_uses_single_eni.ec2_instance_uses_single_eni.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ec2.ec2_instance_uses_single_eni.ec2_instance_uses_single_eni import (
                ec2_instance_uses_single_eni,
            )

            check = ec2_instance_uses_single_eni()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call_v2)
    def test_ec2_instance_no_eni(self):

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_uses_single_eni.ec2_instance_uses_single_eni.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ec2.ec2_instance_uses_single_eni.ec2_instance_uses_single_eni import (
                ec2_instance_uses_single_eni,
            )

            check = ec2_instance_uses_single_eni()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == "i-0123456789abcdef0"
            assert (
                result[0].status_extended
                == "EC2 Instance i-0123456789abcdef0 has no network interfaces attached."
            )

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_instance_multiple_enis(self):

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_uses_single_eni.ec2_instance_uses_single_eni.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ec2.ec2_instance_uses_single_eni.ec2_instance_uses_single_eni import (
                ec2_instance_uses_single_eni,
            )

            check = ec2_instance_uses_single_eni()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == "i-0123456789abcdef0"
            assert (
                result[0].status_extended
                == "EC2 Instance i-0123456789abcdef0 uses multiple ENIs: ( EFAs: ['eni-2'] Interfaces: ['eni-1'] )."
            )

    @mock_aws
    def test_instance_with_single_eni(self):
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        instance = ec2.create_instances(
            ImageId="ami-12c6146b",
            MinCount=1,
            MaxCount=1,
            UserData="This is some user_data",
        )[0]
        network_interface = instance.network_interfaces[0]
        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_uses_single_eni.ec2_instance_uses_single_eni.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ec2.ec2_instance_uses_single_eni.ec2_instance_uses_single_eni import (
                ec2_instance_uses_single_eni,
            )

            check = ec2_instance_uses_single_eni()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == instance.id
            assert (
                result[0].status_extended
                == f"EC2 Instance {instance.id} uses only one ENI: ( Interfaces: ['{network_interface.id}'] )."
            )

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call_v3)
    def test_instance_one_efa_multiple_trunks(self):

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_uses_single_eni.ec2_instance_uses_single_eni.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ec2.ec2_instance_uses_single_eni.ec2_instance_uses_single_eni import (
                ec2_instance_uses_single_eni,
            )

            check = ec2_instance_uses_single_eni()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == "i-0123456789abcdef0"
            assert (
                result[0].status_extended
                == "EC2 Instance i-0123456789abcdef0 uses multiple ENIs: ( EFAs: ['eni-2'] Trunks: ['eni-1', 'eni-3'] )."
            )
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_with_outdated_ami_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_instance_with_outdated_ami/ec2_instance_with_outdated_ami_test.py

```python
from unittest import mock

import botocore
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "DescribeInstances":
        return {
            "Reservations": [
                {
                    "Instances": [
                        {
                            "InstanceId": "i-0123456789abcdef0",
                            "State": {"Name": "running"},
                            "InstanceType": "t2.micro",
                            "ImageId": "ami-12345678",
                            "LaunchTime": "2026-11-12T11:34:56.000Z",
                            "PrivateDnsName": "ip-172-31-32-101.ec2.internal",
                        }
                    ]
                }
            ]
        }
    elif operation_name == "DescribeImages":
        if "Owners" in kwarg and kwarg["Owners"] == ["amazon"]:
            return {
                "Images": [
                    {
                        "ImageId": "ami-12345678",
                        "DeprecationTime": "2050-01-01T00:00:00.000Z",
                        "Public": True,
                    }
                ]
            }
    return make_api_call(self, operation_name, kwarg)


def mock_make_api_call_private(self, operation_name, kwarg):
    if operation_name == "DescribeInstances":
        return {
            "Reservations": [
                {
                    "Instances": [
                        {
                            "InstanceId": "i-0123456789abcdef0",
                            "State": {"Name": "running"},
                            "InstanceType": "t2.micro",
                            "ImageId": "ami-12345678",
                            "LaunchTime": "2026-11-12T11:34:56.000Z",
                            "PrivateDnsName": "ip-172-31-32-101.ec2.internal",
                        }
                    ]
                }
            ]
        }
    elif operation_name == "DescribeImages":
        return {
            "Images": [
                {
                    "ImageId": "ami-12345678",
                    "DeprecationTime": "2050-01-01T00:00:00.000Z",
                    "Public": False,
                }
            ]
        }
    return make_api_call(self, operation_name, kwarg)


def mock_make_api_call_outdated_ami(self, operation_name, kwarg):
    if operation_name == "DescribeInstances":
        return {
            "Reservations": [
                {
                    "Instances": [
                        {
                            "InstanceId": "i-0123456789abcdef0",
                            "State": {"Name": "running"},
                            "InstanceType": "t2.micro",
                            "ImageId": "ami-87654321",
                            "LaunchTime": "2026-11-12T11:34:56.000Z",
                            "PrivateDnsName": "ip-172-31-32-101.ec2.internal",
                        }
                    ]
                }
            ]
        }
    elif operation_name == "DescribeImages":
        if "Owners" in kwarg and kwarg["Owners"] == ["amazon"]:
            return {
                "Images": [
                    {
                        "ImageId": "ami-87654321",
                        "DeprecationTime": "2022-01-01T00:00:00.000Z",
                        "Public": True,
                    }
                ]
            }
    return make_api_call(self, operation_name, kwarg)


def mock_make_api_call_missing_ami(self, operation_name, kwarg):
    if operation_name == "DescribeInstances":
        return {
            "Reservations": [
                {
                    "Instances": [
                        {
                            "InstanceId": "i-0123456789abcdef0",
                            "State": {"Name": "running"},
                            "InstanceType": "t2.micro",
                            "ImageId": "ami-missing",
                            "LaunchTime": "2026-11-12T11:34:56.000Z",
                            "PrivateDnsName": "ip-172-31-32-101.ec2.internal",
                        }
                    ]
                }
            ]
        }
    elif operation_name == "DescribeImages":
        return {"Images": []}
    return make_api_call(self, operation_name, kwarg)


class Test_ec2_instance_with_outdated_ami:
    @mock_aws
    def test_ec2_no_instances(self):
        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_with_outdated_ami.ec2_instance_with_outdated_ami.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ec2.ec2_instance_with_outdated_ami.ec2_instance_with_outdated_ami import (
                ec2_instance_with_outdated_ami,
            )

            check = ec2_instance_with_outdated_ami()
            result = check.execute()

            assert len(result) == 0

    @mock.patch(
        "botocore.client.BaseClient._make_api_call", new=mock_make_api_call_private
    )
    def test_ec2_no_public_images(self):
        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_with_outdated_ami.ec2_instance_with_outdated_ami.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ec2.ec2_instance_with_outdated_ami.ec2_instance_with_outdated_ami import (
                ec2_instance_with_outdated_ami,
            )

            check = ec2_instance_with_outdated_ami()
            result = check.execute()

            assert len(result) == 0

    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_instance_ami_not_outdated(self):
        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_with_outdated_ami.ec2_instance_with_outdated_ami.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ec2.ec2_instance_with_outdated_ami.ec2_instance_with_outdated_ami import (
                ec2_instance_with_outdated_ami,
            )

            check = ec2_instance_with_outdated_ami()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].resource_id == "i-0123456789abcdef0"
            assert (
                result[0].status_extended
                == "EC2 Instance i-0123456789abcdef0 is not using an outdated AMI."
            )

    @mock.patch(
        "botocore.client.BaseClient._make_api_call", new=mock_make_api_call_outdated_ami
    )
    def test_instance_ami_outdated(self):
        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_with_outdated_ami.ec2_instance_with_outdated_ami.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ec2.ec2_instance_with_outdated_ami.ec2_instance_with_outdated_ami import (
                ec2_instance_with_outdated_ami,
            )

            check = ec2_instance_with_outdated_ami()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].resource_id == "i-0123456789abcdef0"
            assert (
                result[0].status_extended
                == "EC2 Instance i-0123456789abcdef0 is using outdated AMI ami-87654321."
            )

    @mock.patch(
        "botocore.client.BaseClient._make_api_call", new=mock_make_api_call_missing_ami
    )
    def test_instance_missing_ami_details(self):
        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_with_outdated_ami.ec2_instance_with_outdated_ami.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ec2.ec2_instance_with_outdated_ami.ec2_instance_with_outdated_ami import (
                ec2_instance_with_outdated_ami,
            )

            check = ec2_instance_with_outdated_ami()
            result = check.execute()

            assert result == []
```

--------------------------------------------------------------------------------

````
