---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 498
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 498 of 867)

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

---[FILE: dms_no_public_access_test.py]---
Location: prowler-master/tests/providers/aws/services/dms/dms_instance_no_public_access/dms_no_public_access_test.py

```python
from unittest import mock

import botocore
from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.dms.dms_service import RepInstance
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

DMS_INSTANCE_NAME = "rep-instance"
DMS_INSTANCE_ARN = (
    f"arn:aws:dms:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:rep:{DMS_INSTANCE_NAME}"
)
KMS_KEY_ID = f"arn:aws:kms:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:key/abcdabcd-1234-abcd-1234-abcdabcdabcd"

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call_public(self, operation_name, kwargs):
    if operation_name == "DescribeReplicationInstances":
        return {
            "ReplicationInstances": [
                {
                    "ReplicationInstanceIdentifier": DMS_INSTANCE_NAME,
                    "ReplicationInstanceStatus": "available",
                    "AutoMinorVersionUpgrade": True,
                    "PubliclyAccessible": True,
                    "ReplicationInstanceArn": DMS_INSTANCE_ARN,
                    "MultiAZ": True,
                    "VpcSecurityGroups": [],
                    "KmsKeyId": KMS_KEY_ID,
                },
            ]
        }

    return make_api_call(self, operation_name, kwargs)


def mock_make_api_call_private(self, operation_name, kwargs):
    if operation_name == "DescribeReplicationInstances":
        return {
            "ReplicationInstances": [
                {
                    "ReplicationInstanceIdentifier": DMS_INSTANCE_NAME,
                    "ReplicationInstanceStatus": "available",
                    "AutoMinorVersionUpgrade": True,
                    "PubliclyAccessible": False,
                    "ReplicationInstanceArn": DMS_INSTANCE_ARN,
                    "MultiAZ": True,
                    "VpcSecurityGroups": [],
                    "KmsKeyId": KMS_KEY_ID,
                },
            ]
        }

    return make_api_call(self, operation_name, kwargs)


class Test_dms_instance_no_public_access:
    @mock_aws
    def test_dms_no_instances(self):
        dms_client = client("dms", region_name=AWS_REGION_US_EAST_1)
        dms_client.instances = []

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        from prowler.providers.aws.services.dms.dms_service import DMS

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.dms.dms_instance_no_public_access.dms_instance_no_public_access.dms_client",
                new=DMS(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.dms.dms_instance_no_public_access.dms_instance_no_public_access import (
                dms_instance_no_public_access,
            )

            check = dms_instance_no_public_access()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_dms_private(self):
        with mock.patch(
            "botocore.client.BaseClient._make_api_call",
            new=mock_make_api_call_private,
        ):

            aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

            from prowler.providers.aws.services.dms.dms_service import DMS

            with (
                mock.patch(
                    "prowler.providers.common.provider.Provider.get_global_provider",
                    return_value=aws_provider,
                ),
                mock.patch(
                    "prowler.providers.aws.services.dms.dms_instance_no_public_access.dms_instance_no_public_access.dms_client",
                    new=DMS(aws_provider),
                ),
            ):
                from prowler.providers.aws.services.dms.dms_instance_no_public_access.dms_instance_no_public_access import (
                    dms_instance_no_public_access,
                )

                check = dms_instance_no_public_access()
                result = check.execute()
                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"DMS Replication Instance {DMS_INSTANCE_NAME} is not publicly accessible."
                )
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_id == DMS_INSTANCE_NAME
                assert result[0].resource_arn == DMS_INSTANCE_ARN
                assert result[0].resource_tags == []

    @mock_aws
    def test_dms_public(self):
        with mock.patch(
            "botocore.client.BaseClient._make_api_call",
            new=mock_make_api_call_public,
        ):

            aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

            from prowler.providers.aws.services.dms.dms_service import DMS

            with (
                mock.patch(
                    "prowler.providers.common.provider.Provider.get_global_provider",
                    return_value=aws_provider,
                ),
                mock.patch(
                    "prowler.providers.aws.services.dms.dms_instance_no_public_access.dms_instance_no_public_access.dms_client",
                    new=DMS(aws_provider),
                ),
            ):
                from prowler.providers.aws.services.dms.dms_instance_no_public_access.dms_instance_no_public_access import (
                    dms_instance_no_public_access,
                )

                check = dms_instance_no_public_access()
                result = check.execute()
                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"DMS Replication Instance {DMS_INSTANCE_NAME} is set as publicly accessible, but is not publicly exposed."
                )
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_id == DMS_INSTANCE_NAME
                assert result[0].resource_arn == DMS_INSTANCE_ARN
                assert result[0].resource_tags == []

    @mock_aws
    def test_dms_public_with_public_sg(self):
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        ec2_client.create_vpc(CidrBlock="10.0.0.0/16")
        default_sg = ec2_client.describe_security_groups(GroupNames=["default"])[
            "SecurityGroups"
        ][0]
        default_sg_id = default_sg["GroupId"]
        ec2_client.authorize_security_group_ingress(
            GroupId=default_sg_id,
            IpPermissions=[
                {
                    "IpProtocol": "-1",
                    "IpRanges": [{"CidrIp": "0.0.0.0/0"}],
                }
            ],
        )
        dms_client = mock.MagicMock
        dms_client = mock.MagicMock()
        dms_client.instances = []
        dms_client.instances.append(
            RepInstance(
                id=DMS_INSTANCE_NAME,
                arn=DMS_INSTANCE_ARN,
                status="available",
                public=True,
                security_groups=[default_sg_id],
                kms_key=KMS_KEY_ID,
                auto_minor_version_upgrade=False,
                multi_az=False,
                region=AWS_REGION_US_EAST_1,
                tags=[{"Key": "Name", "Value": DMS_INSTANCE_NAME}],
            )
        )
        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        aws_provider.audit_metadata.expected_checks = [
            "ec2_securitygroup_allow_ingress_from_internet_to_any_port"
        ]
        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with (
                mock.patch(
                    "prowler.providers.aws.services.dms.dms_instance_no_public_access.dms_instance_no_public_access.dms_client",
                    new=dms_client,
                ),
                mock.patch(
                    "prowler.providers.aws.services.dms.dms_client.dms_client",
                    new=dms_client,
                ),
                mock.patch(
                    "prowler.providers.aws.services.dms.dms_instance_no_public_access.dms_instance_no_public_access.ec2_client",
                    new=EC2(aws_provider),
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.dms.dms_instance_no_public_access.dms_instance_no_public_access import (
                    dms_instance_no_public_access,
                )

                check = dms_instance_no_public_access()
                result = check.execute()
                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"DMS Replication Instance {DMS_INSTANCE_NAME} is set as publicly accessible and security group default ({default_sg_id}) is open to the Internet."
                )
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_id == DMS_INSTANCE_NAME
                assert result[0].resource_arn == DMS_INSTANCE_ARN
                assert result[0].resource_tags == [
                    {
                        "Key": "Name",
                        "Value": DMS_INSTANCE_NAME,
                    }
                ]

    @mock_aws
    def test_dms_public_with_filtered_sg(self):
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        ec2_client.create_vpc(CidrBlock="10.0.0.0/16")
        default_sg = ec2_client.describe_security_groups(GroupNames=["default"])[
            "SecurityGroups"
        ][0]
        default_sg_id = default_sg["GroupId"]
        ec2_client.authorize_security_group_ingress(
            GroupId=default_sg_id,
            IpPermissions=[
                {
                    "IpProtocol": "-1",
                    "IpRanges": [{"CidrIp": "123.123.123.123/32"}],
                }
            ],
        )
        dms_client = mock.MagicMock
        dms_client.instances = []
        dms_client.instances.append(
            RepInstance(
                id=DMS_INSTANCE_NAME,
                arn=DMS_INSTANCE_ARN,
                status="available",
                public=True,
                security_groups=[default_sg_id],
                kms_key=KMS_KEY_ID,
                auto_minor_version_upgrade=False,
                multi_az=False,
                region=AWS_REGION_US_EAST_1,
                tags=[{"Key": "Name", "Value": DMS_INSTANCE_NAME}],
            )
        )
        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        aws_provider.audit_metadata.expected_checks = [
            "ec2_securitygroup_allow_ingress_from_internet_to_any_port"
        ]
        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with (
                mock.patch(
                    "prowler.providers.aws.services.dms.dms_instance_no_public_access.dms_instance_no_public_access.dms_client",
                    new=dms_client,
                ),
                mock.patch(
                    "prowler.providers.aws.services.dms.dms_client.dms_client",
                    new=dms_client,
                ),
                mock.patch(
                    "prowler.providers.aws.services.dms.dms_instance_no_public_access.dms_instance_no_public_access.ec2_client",
                    new=EC2(aws_provider),
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.dms.dms_instance_no_public_access.dms_instance_no_public_access import (
                    dms_instance_no_public_access,
                )

                check = dms_instance_no_public_access()
                result = check.execute()
                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"DMS Replication Instance {DMS_INSTANCE_NAME} is set as publicly accessible but filtered with security groups."
                )
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_id == DMS_INSTANCE_NAME
                assert result[0].resource_arn == DMS_INSTANCE_ARN
                assert result[0].resource_tags == [
                    {
                        "Key": "Name",
                        "Value": DMS_INSTANCE_NAME,
                    }
                ]
```

--------------------------------------------------------------------------------

---[FILE: dms_replication_task_source_logging_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/dms/dms_replication_task_source_logging_enabled/dms_replication_task_source_logging_enabled_test.py

```python
from unittest import mock

from prowler.providers.aws.services.dms.dms_service import ReplicationTasks
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

DMS_ENDPOINT_NAME = "dms-endpoint"
DMS_ENDPOINT_ARN = f"arn:aws:dms:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:endpoint:{DMS_ENDPOINT_NAME}"
DMS_INSTANCE_NAME = "rep-instance"
DMS_INSTANCE_ARN = (
    f"arn:aws:dms:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:rep:{DMS_INSTANCE_NAME}"
)
DMS_REPLICATION_TASK_ARN = (
    f"arn:aws:dms:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:task:rep-task"
)


class Test_dms_replication_task_source_logging_enabled:
    def test_no_dms_replication_tasks(self):
        dms_client = mock.MagicMock()
        dms_client.replication_tasks = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.dms.dms_replication_task_source_logging_enabled.dms_replication_task_source_logging_enabled.dms_client",
                new=dms_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dms.dms_replication_task_source_logging_enabled.dms_replication_task_source_logging_enabled import (
                dms_replication_task_source_logging_enabled,
            )

            check = dms_replication_task_source_logging_enabled()
            result = check.execute()

            assert len(result) == 0

    def test_dms_replication_task_logging_not_enabled(self):
        dms_client = mock.MagicMock()
        dms_client.replication_tasks = {
            DMS_REPLICATION_TASK_ARN: ReplicationTasks(
                arn=DMS_REPLICATION_TASK_ARN,
                id="rep-task",
                region=AWS_REGION_US_EAST_1,
                source_endpoint_arn=DMS_ENDPOINT_ARN,
                target_endpoint_arn=DMS_ENDPOINT_ARN,
                logging_enabled=False,
                log_components=[
                    {"Id": "SOURCE_CAPTURE", "Severity": "LOGGER_SEVERITY_DEFAULT"}
                ],
                tags=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.dms.dms_replication_task_source_logging_enabled.dms_replication_task_source_logging_enabled.dms_client",
                new=dms_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dms.dms_replication_task_source_logging_enabled.dms_replication_task_source_logging_enabled import (
                dms_replication_task_source_logging_enabled,
            )

            check = dms_replication_task_source_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                "DMS Replication Task rep-task does not have logging enabled for source events."
            )
            assert result[0].resource_id == "rep-task"
            assert result[0].resource_arn == DMS_REPLICATION_TASK_ARN
            assert result[0].resource_tags == []
            assert result[0].region == "us-east-1"

    def test_dms_replication_task_logging_enabled_source_capture_only(self):
        dms_client = mock.MagicMock()
        dms_client.replication_tasks = {
            DMS_REPLICATION_TASK_ARN: ReplicationTasks(
                arn=DMS_REPLICATION_TASK_ARN,
                id="rep-task",
                region=AWS_REGION_US_EAST_1,
                source_endpoint_arn=DMS_ENDPOINT_ARN,
                target_endpoint_arn=DMS_ENDPOINT_ARN,
                logging_enabled=True,
                log_components=[
                    {"Id": "SOURCE_CAPTURE", "Severity": "LOGGER_SEVERITY_DEFAULT"}
                ],
                tags=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.dms.dms_replication_task_source_logging_enabled.dms_replication_task_source_logging_enabled.dms_client",
                new=dms_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dms.dms_replication_task_source_logging_enabled.dms_replication_task_source_logging_enabled import (
                dms_replication_task_source_logging_enabled,
            )

            check = dms_replication_task_source_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                "DMS Replication Task rep-task does not meet the minimum severity level of logging in Source Unload events."
            )
            assert result[0].resource_id == "rep-task"
            assert result[0].resource_arn == DMS_REPLICATION_TASK_ARN
            assert result[0].resource_tags == []
            assert result[0].region == "us-east-1"

    def test_dms_replication_task_logging_enabled_source_unload_only(self):
        dms_client = mock.MagicMock()
        dms_client.replication_tasks = {
            DMS_REPLICATION_TASK_ARN: ReplicationTasks(
                arn=DMS_REPLICATION_TASK_ARN,
                id="rep-task",
                region=AWS_REGION_US_EAST_1,
                source_endpoint_arn=DMS_ENDPOINT_ARN,
                target_endpoint_arn=DMS_ENDPOINT_ARN,
                logging_enabled=True,
                log_components=[
                    {"Id": "SOURCE_UNLOAD", "Severity": "LOGGER_SEVERITY_DEFAULT"}
                ],
                tags=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.dms.dms_replication_task_source_logging_enabled.dms_replication_task_source_logging_enabled.dms_client",
                new=dms_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dms.dms_replication_task_source_logging_enabled.dms_replication_task_source_logging_enabled import (
                dms_replication_task_source_logging_enabled,
            )

            check = dms_replication_task_source_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                "DMS Replication Task rep-task does not meet the minimum severity level of logging in Source Capture events."
            )
            assert result[0].resource_id == "rep-task"
            assert result[0].resource_arn == DMS_REPLICATION_TASK_ARN
            assert result[0].resource_tags == []
            assert result[0].region == "us-east-1"

    def test_dms_replication_task_logging_enabled_source_unload_capture_with_not_enough_severity_on_capture(
        self,
    ):
        dms_client = mock.MagicMock()
        dms_client.replication_tasks = {
            DMS_REPLICATION_TASK_ARN: ReplicationTasks(
                arn=DMS_REPLICATION_TASK_ARN,
                id="rep-task",
                region=AWS_REGION_US_EAST_1,
                source_endpoint_arn=DMS_ENDPOINT_ARN,
                target_endpoint_arn=DMS_ENDPOINT_ARN,
                logging_enabled=True,
                log_components=[
                    {"Id": "SOURCE_CAPTURE", "Severity": "LOGGER_SEVERITY_INFO"},
                    {"Id": "SOURCE_UNLOAD", "Severity": "LOGGER_SEVERITY_DEFAULT"},
                ],
                tags=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.dms.dms_replication_task_source_logging_enabled.dms_replication_task_source_logging_enabled.dms_client",
                new=dms_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dms.dms_replication_task_source_logging_enabled.dms_replication_task_source_logging_enabled import (
                dms_replication_task_source_logging_enabled,
            )

            check = dms_replication_task_source_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                "DMS Replication Task rep-task does not meet the minimum severity level of logging in Source Capture events."
            )
            assert result[0].resource_id == "rep-task"
            assert result[0].resource_arn == DMS_REPLICATION_TASK_ARN
            assert result[0].resource_tags == []
            assert result[0].region == "us-east-1"

    def test_dms_replication_task_logging_enabled_source_unload_capture_with_not_enough_severity_on_unload(
        self,
    ):
        dms_client = mock.MagicMock()
        dms_client.replication_tasks = {
            DMS_REPLICATION_TASK_ARN: ReplicationTasks(
                arn=DMS_REPLICATION_TASK_ARN,
                id="rep-task",
                region=AWS_REGION_US_EAST_1,
                source_endpoint_arn=DMS_ENDPOINT_ARN,
                target_endpoint_arn=DMS_ENDPOINT_ARN,
                logging_enabled=True,
                log_components=[
                    {"Id": "SOURCE_CAPTURE", "Severity": "LOGGER_SEVERITY_DEFAULT"},
                    {"Id": "SOURCE_UNLOAD", "Severity": "LOGGER_SEVERITY_INFO"},
                ],
                tags=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.dms.dms_replication_task_source_logging_enabled.dms_replication_task_source_logging_enabled.dms_client",
                new=dms_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dms.dms_replication_task_source_logging_enabled.dms_replication_task_source_logging_enabled import (
                dms_replication_task_source_logging_enabled,
            )

            check = dms_replication_task_source_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                "DMS Replication Task rep-task does not meet the minimum severity level of logging in Source Unload events."
            )
            assert result[0].resource_id == "rep-task"
            assert result[0].resource_arn == DMS_REPLICATION_TASK_ARN
            assert result[0].resource_tags == []
            assert result[0].region == "us-east-1"

    def test_dms_replication_task_logging_enabled_source_unload_capture_with_not_enough_severity_on_both(
        self,
    ):
        dms_client = mock.MagicMock()
        dms_client.replication_tasks = {
            DMS_REPLICATION_TASK_ARN: ReplicationTasks(
                arn=DMS_REPLICATION_TASK_ARN,
                id="rep-task",
                region=AWS_REGION_US_EAST_1,
                source_endpoint_arn=DMS_ENDPOINT_ARN,
                target_endpoint_arn=DMS_ENDPOINT_ARN,
                logging_enabled=True,
                log_components=[
                    {"Id": "SOURCE_CAPTURE", "Severity": "LOGGER_SEVERITY_INFO"},
                    {"Id": "SOURCE_UNLOAD", "Severity": "LOGGER_SEVERITY_INFO"},
                ],
                tags=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.dms.dms_replication_task_source_logging_enabled.dms_replication_task_source_logging_enabled.dms_client",
                new=dms_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dms.dms_replication_task_source_logging_enabled.dms_replication_task_source_logging_enabled import (
                dms_replication_task_source_logging_enabled,
            )

            check = dms_replication_task_source_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                "DMS Replication Task rep-task does not meet the minimum severity level of logging in Source Capture and Source Unload events."
            )
            assert result[0].resource_id == "rep-task"
            assert result[0].resource_arn == DMS_REPLICATION_TASK_ARN
            assert result[0].resource_tags == []
            assert result[0].region == "us-east-1"

    def test_dms_replication_task_logging_enabled_source_unload_capture_with_enough_severity_on_both(
        self,
    ):
        dms_client = mock.MagicMock()
        dms_client.replication_tasks = {
            DMS_REPLICATION_TASK_ARN: ReplicationTasks(
                arn=DMS_REPLICATION_TASK_ARN,
                id="rep-task",
                region=AWS_REGION_US_EAST_1,
                source_endpoint_arn=DMS_ENDPOINT_ARN,
                target_endpoint_arn=DMS_ENDPOINT_ARN,
                logging_enabled=True,
                log_components=[
                    {"Id": "SOURCE_CAPTURE", "Severity": "LOGGER_SEVERITY_DEFAULT"},
                    {"Id": "SOURCE_UNLOAD", "Severity": "LOGGER_SEVERITY_DEFAULT"},
                ],
                tags=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.dms.dms_replication_task_source_logging_enabled.dms_replication_task_source_logging_enabled.dms_client",
                new=dms_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dms.dms_replication_task_source_logging_enabled.dms_replication_task_source_logging_enabled import (
                dms_replication_task_source_logging_enabled,
            )

            check = dms_replication_task_source_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                "DMS Replication Task rep-task has logging enabled with the minimum severity level in source events."
            )
            assert result[0].resource_id == "rep-task"
            assert result[0].resource_arn == DMS_REPLICATION_TASK_ARN
            assert result[0].resource_tags == []
            assert result[0].region == "us-east-1"
```

--------------------------------------------------------------------------------

````
