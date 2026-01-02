---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 507
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 507 of 867)

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

---[FILE: ec2_instance_account_imdsv2_enabled_fixer_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_instance_account_imdsv2_enabled/ec2_instance_account_imdsv2_enabled_fixer_test.py

```python
from unittest import mock

from moto import mock_aws

from prowler.providers.aws.services.ec2.ec2_service import (
    EbsSnapshotBlockPublicAccess,
    InstanceMetadataDefaults,
)
from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


# Since moto does not support the ec2 metadata service, we need to mock the response for some functions
def mock_get_instance_metadata_defaults(http_tokens, instances, region):
    return InstanceMetadataDefaults(
        http_tokens=http_tokens, instances=instances, region=region
    )


def mock_get_snapshot_block_public_access_state(status, snapshots, region):
    return EbsSnapshotBlockPublicAccess(
        status=status, snapshots=snapshots, region=region
    )


def mock_modify_instance_metadata_defaults(HttpTokens):
    if HttpTokens == "required":
        return {"Return": True}


class Test_ec2_instance_account_imdsv2_enabled_fixer:
    @mock_aws
    def test_ec2_instance_account_imdsv2_enabled_fixer(self):
        ec2_service = mock.MagicMock()
        ec2_client = mock.MagicMock()
        ec2_service.regional_clients = {AWS_REGION_US_EAST_1: ec2_client}

        ec2_client.instance_metadata_defaults = [
            mock_get_instance_metadata_defaults(
                http_tokens="required", instances=True, region=AWS_REGION_US_EAST_1
            )
        ]

        ec2_client.ebs_block_public_access_snapshots_states = [
            mock_get_snapshot_block_public_access_state(
                status="block-all-sharing", snapshots=True, region=AWS_REGION_US_EAST_1
            )
        ]

        ec2_client.modify_instance_metadata_defaults = (
            mock_modify_instance_metadata_defaults
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_account_imdsv2_enabled.ec2_instance_account_imdsv2_enabled_fixer.ec2_client",
                ec2_service,
            ),
        ):

            from prowler.providers.aws.services.ec2.ec2_instance_account_imdsv2_enabled.ec2_instance_account_imdsv2_enabled_fixer import (
                fixer,
            )

            # By default, the account has not public access blocked
            assert fixer(region=AWS_REGION_US_EAST_1)
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_account_imdsv2_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_instance_account_imdsv2_enabled/ec2_instance_account_imdsv2_enabled_test.py

```python
from unittest import mock

from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_ec2_instance_account_imdsv2_enabled:
    @mock_aws
    def test_ec2_imdsv2_required(self):
        from prowler.providers.aws.services.ec2.ec2_service import (
            InstanceMetadataDefaults,
        )

        ec2_client = mock.MagicMock()
        ec2_client.instance_metadata_defaults = [
            InstanceMetadataDefaults(
                http_tokens="required", instances=True, region=AWS_REGION_US_EAST_1
            )
        ]
        ec2_client.audited_account = AWS_ACCOUNT_NUMBER
        ec2_client.region = AWS_REGION_US_EAST_1
        ec2_client.account_arn_template = (
            f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:account"
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_account_imdsv2_enabled.ec2_instance_account_imdsv2_enabled.ec2_client",
                new=ec2_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_instance_account_imdsv2_enabled.ec2_instance_account_imdsv2_enabled import (
                ec2_instance_account_imdsv2_enabled,
            )

            check = ec2_instance_account_imdsv2_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "IMDSv2 is enabled by default for EC2 instances."
            )
            assert (
                result[0].resource_arn
                == f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:account"
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER

    @mock_aws
    def test_ec2_imdsv2_none(self):
        from prowler.providers.aws.services.ec2.ec2_service import (
            InstanceMetadataDefaults,
        )

        ec2_client = mock.MagicMock()
        ec2_client.instance_metadata_defaults = [
            InstanceMetadataDefaults(
                http_tokens=None, instances=True, region=AWS_REGION_US_EAST_1
            )
        ]
        ec2_client.audited_account = AWS_ACCOUNT_NUMBER
        ec2_client.region = AWS_REGION_US_EAST_1

        ec2_client.account_arn_template = (
            f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:account"
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_account_imdsv2_enabled.ec2_instance_account_imdsv2_enabled.ec2_client",
                new=ec2_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_instance_account_imdsv2_enabled.ec2_instance_account_imdsv2_enabled import (
                ec2_instance_account_imdsv2_enabled,
            )

            check = ec2_instance_account_imdsv2_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "IMDSv2 is not enabled by default for EC2 instances."
            )
            assert (
                result[0].resource_arn
                == f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:account"
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_detailed_monitoring_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_instance_detailed_monitoring_enabled/ec2_instance_detailed_monitoring_enabled_test.py

```python
from unittest import mock

from boto3 import resource
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

EXAMPLE_AMI_ID = "ami-12c6146b"


class Test_ec2_instance_detailed_monitoring_enabled:
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
                "prowler.providers.aws.services.ec2.ec2_instance_detailed_monitoring_enabled.ec2_instance_detailed_monitoring_enabled.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_instance_detailed_monitoring_enabled.ec2_instance_detailed_monitoring_enabled import (
                ec2_instance_detailed_monitoring_enabled,
            )

            check = ec2_instance_detailed_monitoring_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_instance_with_enhanced_monitoring_disabled(self):
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        instance = ec2.create_instances(
            ImageId=EXAMPLE_AMI_ID,
            MinCount=1,
            MaxCount=1,
            Monitoring={"Enabled": False},
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
                "prowler.providers.aws.services.ec2.ec2_instance_detailed_monitoring_enabled.ec2_instance_detailed_monitoring_enabled.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ec2.ec2_instance_detailed_monitoring_enabled.ec2_instance_detailed_monitoring_enabled import (
                ec2_instance_detailed_monitoring_enabled,
            )

            check = ec2_instance_detailed_monitoring_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].region == AWS_REGION_US_EAST_1
            # Moto fills instance tags with None
            assert result[0].resource_tags is None
            assert (
                result[0].status_extended
                == f"EC2 Instance {instance.id} does not have detailed monitoring enabled."
            )
            assert result[0].resource_id == instance.id
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:instance/{instance.id}"
            )

    @mock_aws
    def test_instance_with_enhanced_monitoring_enabled(self):
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        instance = ec2.create_instances(
            ImageId=EXAMPLE_AMI_ID,
            MinCount=1,
            MaxCount=1,
            Monitoring={"Enabled": True},
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
                "prowler.providers.aws.services.ec2.ec2_instance_detailed_monitoring_enabled.ec2_instance_detailed_monitoring_enabled.ec2_client",
                new=EC2(aws_provider),
            ) as ec2_service,
        ):
            from prowler.providers.aws.services.ec2.ec2_instance_detailed_monitoring_enabled.ec2_instance_detailed_monitoring_enabled import (
                ec2_instance_detailed_monitoring_enabled,
            )

            # TEMPORAL FIX
            # Need to inspect why in service the monitoring state is set as disabled, since when is this failing ???
            ec2_service.instances[0].monitoring_state = "enabled"
            check = ec2_instance_detailed_monitoring_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].region == AWS_REGION_US_EAST_1
            # Moto fills instance tags with None
            assert result[0].resource_tags is None
            assert (
                result[0].status_extended
                == f"EC2 Instance {instance.id} has detailed monitoring enabled."
            )
            assert result[0].resource_id == instance.id
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:instance/{instance.id}"
            )
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_imdsv2_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_instance_imdsv2_enabled/ec2_instance_imdsv2_enabled_test.py

```python
from re import search
from unittest import mock

from boto3 import resource
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

EXAMPLE_AMI_ID = "ami-12c6146b"


class Test_ec2_instance_imdsv2_enabled:
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
                "prowler.providers.aws.services.ec2.ec2_instance_imdsv2_enabled.ec2_instance_imdsv2_enabled.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_instance_imdsv2_enabled.ec2_instance_imdsv2_enabled import (
                ec2_instance_imdsv2_enabled,
            )

            check = ec2_instance_imdsv2_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_one_compliant_ec2(self):
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        instance = ec2.create_instances(
            ImageId=EXAMPLE_AMI_ID,
            MinCount=1,
            MaxCount=1,
            MetadataOptions={
                "HttpTokens": "required",
                "HttpEndpoint": "enabled",
            },
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
                "prowler.providers.aws.services.ec2.ec2_instance_imdsv2_enabled.ec2_instance_imdsv2_enabled.ec2_client",
                new=EC2(aws_provider),
            ) as service_client,
        ):
            from prowler.providers.aws.services.ec2.ec2_instance_imdsv2_enabled.ec2_instance_imdsv2_enabled import (
                ec2_instance_imdsv2_enabled,
            )

            service_client.instances[0].http_endpoint = "enabled"
            service_client.instances[0].http_tokens = "required"

            check = ec2_instance_imdsv2_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].region == AWS_REGION_US_EAST_1
            # Moto fills instance tags with None
            assert result[0].resource_tags is None
            assert search(
                f"EC2 Instance {instance.id} has IMDSv2 enabled and required",
                result[0].status_extended,
            )
            assert result[0].resource_id == instance.id
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:instance/{instance.id}"
            )

    @mock_aws
    def test_one_uncompliant_ec2_metadata_server_disabled(self):
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        instance = ec2.create_instances(
            ImageId=EXAMPLE_AMI_ID,
            MinCount=1,
            MaxCount=1,
            MetadataOptions={
                "HttpTokens": "optional",
                "HttpEndpoint": "disabled",
            },
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
                "prowler.providers.aws.services.ec2.ec2_instance_imdsv2_enabled.ec2_instance_imdsv2_enabled.ec2_client",
                new=EC2(aws_provider),
            ) as service_client,
        ):
            from prowler.providers.aws.services.ec2.ec2_instance_imdsv2_enabled.ec2_instance_imdsv2_enabled import (
                ec2_instance_imdsv2_enabled,
            )

            service_client.instances[0].http_endpoint = "disabled"
            service_client.instances[0].http_tokens = "optional"

            check = ec2_instance_imdsv2_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].region == AWS_REGION_US_EAST_1
            # Moto fills instance tags with None
            assert result[0].resource_tags is None
            assert (
                result[0].status_extended
                == f"EC2 Instance {instance.id} has metadata service disabled."
            )
            assert result[0].resource_id == instance.id
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:instance/{instance.id}"
            )

    @mock_aws
    def test_one_uncompliant_ec2_metadata_server_enabled(self):
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        instance = ec2.create_instances(
            ImageId=EXAMPLE_AMI_ID,
            MinCount=1,
            MaxCount=1,
            MetadataOptions={
                "HttpTokens": "optional",
                "HttpEndpoint": "enabled",
            },
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
                "prowler.providers.aws.services.ec2.ec2_instance_imdsv2_enabled.ec2_instance_imdsv2_enabled.ec2_client",
                new=EC2(aws_provider),
            ) as service_client,
        ):
            from prowler.providers.aws.services.ec2.ec2_instance_imdsv2_enabled.ec2_instance_imdsv2_enabled import (
                ec2_instance_imdsv2_enabled,
            )

            service_client.instances[0].http_endpoint = "enabled"
            service_client.instances[0].http_tokens = "optional"

            check = ec2_instance_imdsv2_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].region == AWS_REGION_US_EAST_1
            # Moto fills instance tags with None
            assert result[0].resource_tags is None
            assert (
                result[0].status_extended
                == f"EC2 Instance {instance.id} has IMDSv2 disabled or not required."
            )
            assert result[0].resource_id == instance.id
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:instance/{instance.id}"
            )
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_internet_facing_with_instance_profile_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_instance_internet_facing_with_instance_profile/ec2_instance_internet_facing_with_instance_profile_test.py

```python
from re import search
from unittest import mock

from boto3 import client, resource
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

EXAMPLE_AMI_ID = "ami-12c6146b"


class Test_ec2_instance_internet_facing_with_instance_profile:
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
                "prowler.providers.aws.services.ec2.ec2_instance_internet_facing_with_instance_profile.ec2_instance_internet_facing_with_instance_profile.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_instance_internet_facing_with_instance_profile.ec2_instance_internet_facing_with_instance_profile import (
                ec2_instance_internet_facing_with_instance_profile,
            )

            check = ec2_instance_internet_facing_with_instance_profile()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_one_compliant_ec2(self):
        iam = client("iam", "us-west-1")
        profile_name = "fake_profile"
        _ = iam.create_instance_profile(
            InstanceProfileName=profile_name,
        )
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc = ec2.create_vpc(CidrBlock="10.0.0.0/16")
        subnet = ec2.create_subnet(VpcId=vpc.id, CidrBlock="10.0.0.0/18")
        instance = ec2.create_instances(
            ImageId=EXAMPLE_AMI_ID,
            MinCount=1,
            MaxCount=1,
            IamInstanceProfile={"Name": profile_name},
            NetworkInterfaces=[
                {
                    "DeviceIndex": 0,
                    "SubnetId": subnet.id,
                    "AssociatePublicIpAddress": False,
                }
            ],
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
                "prowler.providers.aws.services.ec2.ec2_instance_internet_facing_with_instance_profile.ec2_instance_internet_facing_with_instance_profile.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ec2.ec2_instance_internet_facing_with_instance_profile.ec2_instance_internet_facing_with_instance_profile import (
                ec2_instance_internet_facing_with_instance_profile,
            )

            check = ec2_instance_internet_facing_with_instance_profile()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags is None
            assert result[0].status_extended == (
                f"EC2 Instance {instance.id} is not internet facing with an instance profile."
            )
            assert result[0].resource_id == instance.id
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:instance/{instance.id}"
            )

    @mock_aws
    def test_one_non_compliant_ec2(self):
        iam = client("iam", "us-west-1")
        profile_name = "fake_profile"
        _ = iam.create_instance_profile(
            InstanceProfileName=profile_name,
        )
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc = ec2.create_vpc(CidrBlock="10.0.0.0/16")
        subnet = ec2.create_subnet(VpcId=vpc.id, CidrBlock="10.0.0.0/18")
        instance = ec2.create_instances(
            ImageId=EXAMPLE_AMI_ID,
            MinCount=1,
            MaxCount=1,
            IamInstanceProfile={"Name": profile_name},
            NetworkInterfaces=[
                {
                    "DeviceIndex": 0,
                    "SubnetId": subnet.id,
                    "AssociatePublicIpAddress": True,
                }
            ],
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
                "prowler.providers.aws.services.ec2.ec2_instance_internet_facing_with_instance_profile.ec2_instance_internet_facing_with_instance_profile.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ec2.ec2_instance_internet_facing_with_instance_profile.ec2_instance_internet_facing_with_instance_profile import (
                ec2_instance_internet_facing_with_instance_profile,
            )

            check = ec2_instance_internet_facing_with_instance_profile()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags is None
            assert search(
                "is internet-facing with Instance Profile", result[0].status_extended
            )
            assert result[0].resource_id == instance.id
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:instance/{instance.id}"
            )
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_managed_by_ssm_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_instance_managed_by_ssm/ec2_instance_managed_by_ssm_test.py

```python
from unittest import mock

from boto3 import resource
from moto import mock_aws

from prowler.providers.aws.services.ssm.ssm_service import ManagedInstance
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

EXAMPLE_AMI_ID = "ami-12c6146b"


class Test_ec2_instance_managed_by_ssm_test:
    @mock_aws
    def test_ec2_no_instances(self):
        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        ssm_client = mock.MagicMock
        ssm_client.managed_instances = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ssm.ssm_service.SSM",
                new=ssm_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.ssm.ssm_client.ssm_client",
                new=ssm_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_managed_by_ssm.ec2_instance_managed_by_ssm.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_instance_managed_by_ssm.ec2_instance_managed_by_ssm import (
                ec2_instance_managed_by_ssm,
            )

            check = ec2_instance_managed_by_ssm()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_ec2_instance_managed_by_ssm_non_compliance_instance(self):
        ssm_client = mock.MagicMock
        ssm_client.managed_instances = {}

        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        instance = ec2.create_instances(
            ImageId=EXAMPLE_AMI_ID,
            MinCount=1,
            MaxCount=1,
            UserData="This is some user_data",
        )[0]

        ssm_client = mock.MagicMock
        ssm_client.managed_instances = {}

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
                "prowler.providers.aws.services.ssm.ssm_service.SSM",
                new=ssm_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.ssm.ssm_client.ssm_client",
                new=ssm_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_managed_by_ssm.ec2_instance_managed_by_ssm.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_instance_managed_by_ssm.ec2_instance_managed_by_ssm import (
                ec2_instance_managed_by_ssm,
            )

            check = ec2_instance_managed_by_ssm()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags is None
            assert (
                result[0].status_extended
                == f"EC2 Instance {instance.id} is not managed by Systems Manager."
            )
            assert result[0].resource_id == instance.id

    @mock_aws
    def test_ec2_instance_managed_by_ssm_compliance_instance(self):
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        instance = ec2.create_instances(
            ImageId=EXAMPLE_AMI_ID,
            MinCount=1,
            MaxCount=1,
            UserData="This is some user_data",
        )[0]

        ssm_client = mock.MagicMock
        ssm_client.managed_instances = {
            instance.id: ManagedInstance(
                arn=f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:instance/{instance.id}",
                id=instance.id,
                region=AWS_REGION_US_EAST_1,
            )
        }

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
                "prowler.providers.aws.services.ssm.ssm_service.SSM",
                new=ssm_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.ssm.ssm_client.ssm_client",
                new=ssm_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_managed_by_ssm.ec2_instance_managed_by_ssm.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_instance_managed_by_ssm.ec2_instance_managed_by_ssm import (
                ec2_instance_managed_by_ssm,
            )

            check = ec2_instance_managed_by_ssm()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags is None
            assert (
                result[0].status_extended
                == f"EC2 Instance {instance.id} is managed by Systems Manager."
            )
            assert result[0].resource_id == instance.id

    @mock_aws
    def test_ec2_instance_managed_by_ssm_running(self):
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        instances_pending = ec2.create_instances(
            ImageId=EXAMPLE_AMI_ID,
            MinCount=2,
            MaxCount=2,
            UserData="This is some user_data",
        )
        instance_managed = ec2.Instance(instances_pending[0].id)
        instance_unmanaged = ec2.Instance(instances_pending[1].id)
        assert instance_managed.state["Name"] == "running"
        assert instance_unmanaged.state["Name"] == "running"

        ssm_client = mock.MagicMock
        ssm_client.managed_instances = {
            instance_managed.id: ManagedInstance(
                arn=f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:instance/{instance_managed.id}",
                id=instance_managed.id,
                region=AWS_REGION_US_EAST_1,
            )
        }

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
                "prowler.providers.aws.services.ssm.ssm_service.SSM",
                new=ssm_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.ssm.ssm_client.ssm_client",
                new=ssm_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_managed_by_ssm.ec2_instance_managed_by_ssm.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_instance_managed_by_ssm.ec2_instance_managed_by_ssm import (
                ec2_instance_managed_by_ssm,
            )

            check = ec2_instance_managed_by_ssm()
            results = check.execute()

            assert len(results) == 2
            for result in results:
                if result.resource_id == instance_managed.id:
                    assert result.status == "PASS"
                    assert result.region == AWS_REGION_US_EAST_1
                    assert result.resource_tags is None
                    assert (
                        result.status_extended
                        == f"EC2 Instance {instance_managed.id} is managed by Systems Manager."
                    )

                if result.resource_id == instance_unmanaged.id:
                    assert result.status == "FAIL"
                    assert result.region == AWS_REGION_US_EAST_1
                    assert result.resource_tags is None
                    assert (
                        result.status_extended
                        == f"EC2 Instance {instance_unmanaged.id} is not managed by Systems Manager."
                    )

    @mock_aws
    def test_ec2_instance_managed_by_ssm_stopped(self):
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        instances_pending = ec2.create_instances(
            ImageId=EXAMPLE_AMI_ID,
            MinCount=1,
            MaxCount=1,
            UserData="This is some user_data",
        )
        instances_pending[0].stop()
        instance = ec2.Instance(instances_pending[0].id)
        assert instance.state["Name"] == "stopped"

        ssm_client = mock.MagicMock
        ssm_client.managed_instances = {}

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
                "prowler.providers.aws.services.ssm.ssm_service.SSM",
                new=ssm_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.ssm.ssm_client.ssm_client",
                new=ssm_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_managed_by_ssm.ec2_instance_managed_by_ssm.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_instance_managed_by_ssm.ec2_instance_managed_by_ssm import (
                ec2_instance_managed_by_ssm,
            )

            check = ec2_instance_managed_by_ssm()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags is None
            assert (
                result[0].status_extended
                == f"EC2 Instance {instance.id} is unmanaged by Systems Manager because it is stopped."
            )

    @mock_aws
    def test_ec2_instance_managed_by_ssm_terminated(self):
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        instances_pending = ec2.create_instances(
            ImageId=EXAMPLE_AMI_ID,
            MinCount=1,
            MaxCount=1,
            UserData="This is some user_data",
        )
        instances_pending[0].terminate()
        instance = ec2.Instance(instances_pending[0].id)
        assert instance.state["Name"] == "terminated"

        ssm_client = mock.MagicMock
        ssm_client.managed_instances = {}

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
                "prowler.providers.aws.services.ssm.ssm_service.SSM",
                new=ssm_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.ssm.ssm_client.ssm_client",
                new=ssm_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_managed_by_ssm.ec2_instance_managed_by_ssm.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_instance_managed_by_ssm.ec2_instance_managed_by_ssm import (
                ec2_instance_managed_by_ssm,
            )

            check = ec2_instance_managed_by_ssm()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags is None
            assert (
                result[0].status_extended
                == f"EC2 Instance {instance.id} is unmanaged by Systems Manager because it is terminated."
            )
```

--------------------------------------------------------------------------------

````
