---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 543
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 543 of 867)

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

---[FILE: ecs_service_no_assign_public_ip_test.py]---
Location: prowler-master/tests/providers/aws/services/ecs/ecs_service_no_assign_public_ip/ecs_service_no_assign_public_ip_test.py

```python
from unittest.mock import patch

import botocore
from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

orig = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "DescribeServices":
        if kwarg["services"] == [
            f"arn:aws:ecs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:service/sample-cluster/service-with-no-public-ip"
        ]:
            return {
                "services": [
                    {
                        "serviceName": "test-latest-linux-service",
                        "clusterArn": f"arn:aws:ecs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster/sample-cluster",
                        "taskDefinition": "test-task",
                        "loadBalancers": [],
                        "serviceArn": f"arn:aws:ecs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:service/sample-cluster/service-with-no-public-ip",
                        "desiredCount": 1,
                        "launchType": "FARGATE",
                        "platformVersion": "1.4.0",
                        "platformFamily": "Linux",
                        "networkConfiguration": {
                            "awsvpcConfiguration": {
                                "subnets": ["subnet-12345678"],
                                "securityGroups": ["sg-12345678"],
                                "assignPublicIp": "DISABLED",
                            },
                        },
                        "tags": [],
                    },
                ],
            }
        elif kwarg["services"] == [
            f"arn:aws:ecs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:service/sample-cluster/service-with-public-ip"
        ]:
            return {
                "services": [
                    {
                        "serviceName": "test-latest-linux-service",
                        "clusterArn": f"arn:aws:ecs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster/sample-cluster",
                        "taskDefinition": "test-task",
                        "loadBalancers": [],
                        "serviceArn": f"arn:aws:ecs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:service/sample-cluster/service-with-public-ip",
                        "desiredCount": 1,
                        "launchType": "FARGATE",
                        "platformVersion": "1.4.0",
                        "platformFamily": "Linux",
                        "networkConfiguration": {
                            "awsvpcConfiguration": {
                                "subnets": ["subnet-12345678"],
                                "securityGroups": ["sg-12345678"],
                                "assignPublicIp": "ENABLED",
                            },
                        },
                        "tags": [],
                    },
                ],
            }
    return orig(self, operation_name, kwarg)


class Test_ecs_service_no_assign_public_ip:
    def test_no_services(self):
        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_service_no_assign_public_ip.ecs_service_no_assign_public_ip.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_service_no_assign_public_ip.ecs_service_no_assign_public_ip import (
                ecs_service_no_assign_public_ip,
            )

            check = ecs_service_no_assign_public_ip()
            result = check.execute()
            assert len(result) == 0

    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    @mock_aws
    def test_service_with_no_public_ip(self):
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")
        vpc_id = vpc["Vpc"]["VpcId"]
        subnet = ec2_client.create_subnet(
            VpcId=vpc_id,
            CidrBlock="10.0.1.0/24",
            AvailabilityZone=f"{AWS_REGION_US_EAST_1}a",
        )["Subnet"]["SubnetId"]
        sg = ec2_client.create_security_group(
            GroupName="alb-sg",
            Description="Security group for ALB",
            VpcId=vpc_id,
        )
        sg_id = sg["GroupId"]
        ecs_client = client("ecs", region_name=AWS_REGION_US_EAST_1)

        ecs_client.create_cluster(clusterName="sample-cluster")

        service_arn = ecs_client.create_service(
            cluster="sample-cluster",
            serviceName="service-with-no-public-ip",
            desiredCount=1,
            launchType="FARGATE",
            networkConfiguration={
                "awsvpcConfiguration": {
                    "subnets": [subnet],
                    "securityGroups": [sg_id],
                    "assignPublicIp": "DISABLED",
                }
            },
        )["service"]["serviceArn"]

        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_service_no_assign_public_ip.ecs_service_no_assign_public_ip.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_service_no_assign_public_ip.ecs_service_no_assign_public_ip import (
                ecs_service_no_assign_public_ip,
            )

            check = ecs_service_no_assign_public_ip()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "ECS Service service-with-no-public-ip does not have automatic public IP assignment."
            )
            assert result[0].resource_id == "sample-cluster/service-with-no-public-ip"
            assert result[0].resource_arn == service_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1

    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    @mock_aws
    def test_task_definition_no_host_network_mode(self):
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")
        vpc_id = vpc["Vpc"]["VpcId"]
        subnet = ec2_client.create_subnet(
            VpcId=vpc_id,
            CidrBlock="10.0.1.0/24",
            AvailabilityZone=f"{AWS_REGION_US_EAST_1}a",
        )["Subnet"]["SubnetId"]
        sg = ec2_client.create_security_group(
            GroupName="alb-sg",
            Description="Security group for ALB",
            VpcId=vpc_id,
        )
        sg_id = sg["GroupId"]
        ecs_client = client("ecs", region_name=AWS_REGION_US_EAST_1)

        ecs_client.create_cluster(clusterName="sample-cluster")

        service_arn = ecs_client.create_service(
            cluster="sample-cluster",
            serviceName="service-with-public-ip",
            desiredCount=1,
            launchType="FARGATE",
            networkConfiguration={
                "awsvpcConfiguration": {
                    "subnets": [subnet],
                    "securityGroups": [sg_id],
                    "assignPublicIp": "ENABLED",
                }
            },
        )["service"]["serviceArn"]

        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_service_no_assign_public_ip.ecs_service_no_assign_public_ip.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_service_no_assign_public_ip.ecs_service_no_assign_public_ip import (
                ecs_service_no_assign_public_ip,
            )

            check = ecs_service_no_assign_public_ip()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "ECS Service service-with-public-ip has automatic public IP assignment."
            )
            assert result[0].resource_id == "sample-cluster/service-with-public-ip"
            assert result[0].resource_arn == service_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1
```

--------------------------------------------------------------------------------

---[FILE: ecs_task_definitions_containers_readonly_access_test.py]---
Location: prowler-master/tests/providers/aws/services/ecs/ecs_task_definitions_containers_readonly_access/ecs_task_definitions_containers_readonly_access_test.py

```python
from unittest.mock import patch

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

TASK_NAME = "test-task-readonly"
TASK_REVISION = "1"
CONTAINER_NAME = "test-container"
TASK_ARN = f"arn:aws:ecs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:task-definition/{TASK_NAME}:{TASK_REVISION}"


class Test_ecs_task_definitions_containers_readonly_access:
    def test_no_task_definitions(self):
        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_task_definitions_containers_readonly_access.ecs_task_definitions_containers_readonly_access.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_task_definitions_containers_readonly_access.ecs_task_definitions_containers_readonly_access import (
                ecs_task_definitions_containers_readonly_access,
            )

            check = ecs_task_definitions_containers_readonly_access()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_task_definition_all_containers_readonly(self):
        ecs_client = client("ecs", region_name=AWS_REGION_US_EAST_1)

        task_definition_arn = ecs_client.register_task_definition(
            family=TASK_NAME,
            containerDefinitions=[
                {
                    "name": CONTAINER_NAME,
                    "image": "ubuntu",
                    "memory": 128,
                    "readonlyRootFilesystem": True,
                    "privileged": False,
                    "user": "appuser",
                    "environment": [],
                }
            ],
        )["taskDefinition"]["taskDefinitionArn"]

        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_task_definitions_containers_readonly_access.ecs_task_definitions_containers_readonly_access.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_task_definitions_containers_readonly_access.ecs_task_definitions_containers_readonly_access import (
                ecs_task_definitions_containers_readonly_access,
            )

            check = ecs_task_definitions_containers_readonly_access()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"ECS task definition {TASK_NAME} with revision {TASK_REVISION} does not have containers with write access to the root filesystems."
            )
            assert result[0].resource_id == f"{TASK_NAME}:{TASK_REVISION}"
            assert result[0].resource_arn == task_definition_arn
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_task_definition_some_containers_not_readonly(self):
        ecs_client = client("ecs", region_name=AWS_REGION_US_EAST_1)

        task_definition_arn = ecs_client.register_task_definition(
            family=TASK_NAME,
            containerDefinitions=[
                {
                    "name": CONTAINER_NAME,
                    "image": "ubuntu",
                    "memory": 128,
                    "readonlyRootFilesystem": False,
                    "privileged": False,
                    "user": "appuser",
                    "environment": [],
                }
            ],
        )["taskDefinition"]["taskDefinitionArn"]

        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_task_definitions_containers_readonly_access.ecs_task_definitions_containers_readonly_access.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_task_definitions_containers_readonly_access.ecs_task_definitions_containers_readonly_access import (
                ecs_task_definitions_containers_readonly_access,
            )

            check = ecs_task_definitions_containers_readonly_access()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"ECS task definition {TASK_NAME} with revision {TASK_REVISION} has containers with write access to the root filesystem: {CONTAINER_NAME}"
            )
            assert result[0].resource_id == f"{TASK_NAME}:{TASK_REVISION}"
            assert result[0].resource_arn == task_definition_arn
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_task_definition_mixed_containers(self):
        ecs_client = client("ecs", region_name=AWS_REGION_US_EAST_1)

        task_definition_arn = ecs_client.register_task_definition(
            family=TASK_NAME,
            containerDefinitions=[
                {
                    "name": CONTAINER_NAME,
                    "image": "ubuntu",
                    "memory": 128,
                    "readonlyRootFilesystem": False,  # Not readonly
                    "privileged": False,
                    "user": "appuser",
                    "environment": [],
                },
                {
                    "name": "readonly-container",
                    "image": "ubuntu",
                    "memory": 128,
                    "readonlyRootFilesystem": True,  # Readonly
                    "privileged": False,
                    "user": "appuser",
                    "environment": [],
                },
            ],
        )["taskDefinition"]["taskDefinitionArn"]

        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_task_definitions_containers_readonly_access.ecs_task_definitions_containers_readonly_access.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_task_definitions_containers_readonly_access.ecs_task_definitions_containers_readonly_access import (
                ecs_task_definitions_containers_readonly_access,
            )

            check = ecs_task_definitions_containers_readonly_access()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"ECS task definition {TASK_NAME} with revision {TASK_REVISION} has containers with write access to the root filesystem: {CONTAINER_NAME}"
            )
            assert result[0].resource_id == f"{TASK_NAME}:{TASK_REVISION}"
            assert result[0].resource_arn == task_definition_arn
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: ecs_task_definitions_host_namespace_not_shared_test.py]---
Location: prowler-master/tests/providers/aws/services/ecs/ecs_task_definitions_host_namespace_not_shared/ecs_task_definitions_host_namespace_not_shared_test.py

```python
from unittest.mock import patch

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

TASK_NAME = "test-task"
TASK_REVISION = "1"
CONTAINER_NAME = "test-container"


class Test_ecs_task_definitions_host_namespace_not_shared:
    @mock_aws
    def test_no_task_definitions(self):
        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_task_definitions_host_namespace_not_shared.ecs_task_definitions_host_namespace_not_shared.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_task_definitions_host_namespace_not_shared.ecs_task_definitions_host_namespace_not_shared import (
                ecs_task_definitions_host_namespace_not_shared,
            )

            check = ecs_task_definitions_host_namespace_not_shared()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_task_definition_no_host_pid_mode(self):
        ecs_client = client("ecs", region_name=AWS_REGION_US_EAST_1)

        task_arn = ecs_client.register_task_definition(
            family=TASK_NAME,
            containerDefinitions=[
                {
                    "name": CONTAINER_NAME,
                    "image": "ubuntu",
                    "memory": 128,
                    "readonlyRootFilesystem": True,
                    "privileged": False,
                    "user": "appuser",
                    "environment": [],
                }
            ],
            pidMode="task",
        )["taskDefinition"]["taskDefinitionArn"]

        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_task_definitions_host_namespace_not_shared.ecs_task_definitions_host_namespace_not_shared.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_task_definitions_host_namespace_not_shared.ecs_task_definitions_host_namespace_not_shared import (
                ecs_task_definitions_host_namespace_not_shared,
            )

            check = ecs_task_definitions_host_namespace_not_shared()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"ECS task definition {TASK_NAME} with revision {TASK_REVISION} does not share a host's process namespace with its containers."
            )
            assert result[0].resource_id == f"{TASK_NAME}:{TASK_REVISION}"
            assert result[0].resource_arn == task_arn
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_task_definition_host_pid_mode(self):
        ecs_client = client("ecs", region_name=AWS_REGION_US_EAST_1)

        task_arn = ecs_client.register_task_definition(
            family=TASK_NAME,
            containerDefinitions=[
                {
                    "name": CONTAINER_NAME,
                    "image": "ubuntu",
                    "memory": 128,
                    "readonlyRootFilesystem": True,
                    "privileged": False,
                    "user": "appuser",
                    "environment": [],
                }
            ],
            pidMode="host",
        )["taskDefinition"]["taskDefinitionArn"]

        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_task_definitions_host_namespace_not_shared.ecs_task_definitions_host_namespace_not_shared.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_task_definitions_host_namespace_not_shared.ecs_task_definitions_host_namespace_not_shared import (
                ecs_task_definitions_host_namespace_not_shared,
            )

            check = ecs_task_definitions_host_namespace_not_shared()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"ECS task definition {TASK_NAME} with revision {TASK_REVISION} is configured to share a host's process namespace with its containers."
            )
            assert result[0].resource_id == f"{TASK_NAME}:{TASK_REVISION}"
            assert result[0].resource_arn == task_arn
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_task_definition_no_pid_mode(self):
        ecs_client = client("ecs", region_name=AWS_REGION_US_EAST_1)

        task_arn = ecs_client.register_task_definition(
            family=TASK_NAME,
            containerDefinitions=[
                {
                    "name": CONTAINER_NAME,
                    "image": "ubuntu",
                    "memory": 128,
                    "readonlyRootFilesystem": True,
                    "privileged": False,
                    "user": "appuser",
                    "environment": [],
                }
            ],
        )["taskDefinition"]["taskDefinitionArn"]

        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_task_definitions_host_namespace_not_shared.ecs_task_definitions_host_namespace_not_shared.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_task_definitions_host_namespace_not_shared.ecs_task_definitions_host_namespace_not_shared import (
                ecs_task_definitions_host_namespace_not_shared,
            )

            check = ecs_task_definitions_host_namespace_not_shared()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"ECS task definition {TASK_NAME} with revision {TASK_REVISION} does not share a host's process namespace with its containers."
            )
            assert result[0].resource_id == f"{TASK_NAME}:{TASK_REVISION}"
            assert result[0].resource_arn == task_arn
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: ecs_task_definitions_host_networking_mode_users_test.py]---
Location: prowler-master/tests/providers/aws/services/ecs/ecs_task_definitions_host_networking_mode_users/ecs_task_definitions_host_networking_mode_users_test.py

```python
from unittest.mock import patch

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

TASK_NAME = "test-task"
TASK_REVISION = "1"
CONTAINER_NAME = "test-container"


class Test_ecs_task_definitions_host_networking_mode_users:
    def test_no_task_definitions(self):
        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_task_definitions_host_networking_mode_users.ecs_task_definitions_host_networking_mode_users.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_task_definitions_host_networking_mode_users.ecs_task_definitions_host_networking_mode_users import (
                ecs_task_definitions_host_networking_mode_users,
            )

            check = ecs_task_definitions_host_networking_mode_users()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_task_definition_no_host_network_mode(self):
        ecs_client = client("ecs", region_name=AWS_REGION_US_EAST_1)

        task_arn = ecs_client.register_task_definition(
            family=TASK_NAME,
            networkMode="bridge",
            containerDefinitions=[
                {
                    "name": CONTAINER_NAME,
                    "image": "ubuntu",
                    "memory": 128,
                    "readonlyRootFilesystem": True,
                    "privileged": False,
                    "user": "appuser",
                    "environment": [],
                }
            ],
        )["taskDefinition"]["taskDefinitionArn"]

        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_task_definitions_host_networking_mode_users.ecs_task_definitions_host_networking_mode_users.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_task_definitions_host_networking_mode_users.ecs_task_definitions_host_networking_mode_users import (
                ecs_task_definitions_host_networking_mode_users,
            )

            check = ecs_task_definitions_host_networking_mode_users()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"ECS task definition {TASK_NAME} with revision {TASK_REVISION} does not have host network mode."
            )
            assert result[0].resource_id == f"{TASK_NAME}:{TASK_REVISION}"
            assert result[0].resource_arn == task_arn
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_task_definition_host_mode_container_root_non_privileged(self):
        ecs_client = client("ecs", region_name=AWS_REGION_US_EAST_1)

        task_arn = ecs_client.register_task_definition(
            family=TASK_NAME,
            networkMode="host",
            containerDefinitions=[
                {
                    "name": CONTAINER_NAME,
                    "image": "ubuntu",
                    "memory": 128,
                    "readonlyRootFilesystem": True,
                    "privileged": False,
                    "user": "root",
                    "environment": [],
                }
            ],
        )["taskDefinition"]["taskDefinitionArn"]

        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_task_definitions_host_networking_mode_users.ecs_task_definitions_host_networking_mode_users.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_task_definitions_host_networking_mode_users.ecs_task_definitions_host_networking_mode_users import (
                ecs_task_definitions_host_networking_mode_users,
            )

            check = ecs_task_definitions_host_networking_mode_users()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"ECS task definition {TASK_NAME} with revision {TASK_REVISION} has containers with host network mode and non-privileged containers running as root or with no user specified: {CONTAINER_NAME}"
            )
            assert result[0].resource_id == f"{TASK_NAME}:{TASK_REVISION}"
            assert result[0].resource_arn == task_arn
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_task_definition_host_mode_container_privileged(self):
        ecs_client = client("ecs", region_name=AWS_REGION_US_EAST_1)

        task_arn = ecs_client.register_task_definition(
            family=TASK_NAME,
            networkMode="host",
            containerDefinitions=[
                {
                    "name": CONTAINER_NAME,
                    "image": "ubuntu",
                    "memory": 128,
                    "readonlyRootFilesystem": True,
                    "privileged": True,
                    "user": "root",
                    "environment": [],
                }
            ],
        )["taskDefinition"]["taskDefinitionArn"]

        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_task_definitions_host_networking_mode_users.ecs_task_definitions_host_networking_mode_users.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_task_definitions_host_networking_mode_users.ecs_task_definitions_host_networking_mode_users import (
                ecs_task_definitions_host_networking_mode_users,
            )

            check = ecs_task_definitions_host_networking_mode_users()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"ECS task definition {TASK_NAME} with revision {TASK_REVISION} has host network mode but no containers running as root or with no user specified."
            )
            assert result[0].resource_id == f"{TASK_NAME}:{TASK_REVISION}"
            assert result[0].resource_arn == task_arn
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_task_definition_host_mode_container_not_root(self):
        ecs_client = client("ecs", region_name=AWS_REGION_US_EAST_1)

        task_arn = ecs_client.register_task_definition(
            family=TASK_NAME,
            networkMode="host",
            containerDefinitions=[
                {
                    "name": CONTAINER_NAME,
                    "image": "ubuntu",
                    "memory": 128,
                    "readonlyRootFilesystem": True,
                    "privileged": False,
                    "user": "appuser",
                    "environment": [],
                }
            ],
        )["taskDefinition"]["taskDefinitionArn"]

        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_task_definitions_host_networking_mode_users.ecs_task_definitions_host_networking_mode_users.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_task_definitions_host_networking_mode_users.ecs_task_definitions_host_networking_mode_users import (
                ecs_task_definitions_host_networking_mode_users,
            )

            check = ecs_task_definitions_host_networking_mode_users()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"ECS task definition {TASK_NAME} with revision {TASK_REVISION} has host network mode but no containers running as root or with no user specified."
            )
            assert result[0].resource_id == f"{TASK_NAME}:{TASK_REVISION}"
            assert result[0].resource_arn == task_arn
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

````
