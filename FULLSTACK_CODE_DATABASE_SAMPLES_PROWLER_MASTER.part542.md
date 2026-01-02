---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 542
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 542 of 867)

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

---[FILE: ecs_service_test.py]---
Location: prowler-master/tests/providers/aws/services/ecs/ecs_service_test.py

```python
from unittest.mock import patch

import botocore

from prowler.providers.aws.services.ecs.ecs_service import ECS
from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "ListTaskDefinitions":
        return {
            "taskDefinitionArns": [
                "arn:aws:ecs:eu-west-1:123456789012:task-definition/test_cluster_1/test_ecs_task:1"
            ]
        }
    if operation_name == "DescribeTaskDefinition":
        return {
            "taskDefinition": {
                "containerDefinitions": [
                    {
                        "name": "test-container",
                        "image": "test-image",
                        "logConfiguration": {
                            "logDriver": "awslogs",
                            "options": {
                                "mode": "non-blocking",
                                "max-buffer-size": "25m",
                            },
                        },
                        "environment": [
                            {"name": "DB_PASSWORD", "value": "pass-12343"},
                        ],
                    }
                ],
                "networkMode": "host",
                "pidMode": "host",
                "tags": [],
            }
        }
    if operation_name == "ListServices":
        return {
            "serviceArns": [
                "arn:aws:ecs:eu-west-1:123456789012:service/test_cluster_1/test_ecs_service"
            ]
        }
    if operation_name == "DescribeServices":
        return {
            "services": [
                {
                    "serviceArn": "arn:aws:ecs:eu-west-1:123456789012:service/test_cluster_1/test_ecs_service",
                    "serviceName": "test_ecs_service",
                    "networkConfiguration": {
                        "awsvpcConfiguration": {
                            "subnets": ["subnet-12345678"],
                            "securityGroups": ["sg-12345678"],
                            "assignPublicIp": "ENABLED",
                        }
                    },
                    "launchType": "FARGATE",
                    "platformVersion": "1.4.0",
                    "platformFamily": "Linux",
                    "taskSets": [
                        {
                            "id": "ecs-svc/task-set",
                            "taskSetArn": "arn:aws:ecs:eu-west-1:123456789012:task-set/test_cluster_1/test_ecs_service/ecs-svc/task-set",
                            "clusterArn": "arn:aws:ecs:eu-west-1:123456789012:cluster/test_cluster_1",
                            "serviceArn": "arn:aws:ecs:eu-west-1:123456789012:service/test_cluster_1/test_ecs_service",
                            "networkConfiguration": {
                                "awsvpcConfiguration": {
                                    "subnets": ["subnet-12345678"],
                                    "securityGroups": ["sg-12345678"],
                                    "assignPublicIp": "DISABLED",
                                },
                            },
                            "tags": [],
                        }
                    ],
                }
            ]
        }
    if operation_name == "ListClusters":
        return {
            "clusterArns": [
                "arn:aws:ecs:eu-west-1:123456789012:cluster/test_cluster_1",
            ]
        }
    if operation_name == "DescribeClusters":
        return {
            "clusters": [
                {
                    "clusterArn": "arn:aws:ecs:eu-west-1:123456789012:cluster/test_cluster_1",
                    "clusterName": "test_cluster_1",
                    "status": "ACTIVE",
                    "tags": [{"key": "Name", "value": "test_cluster_1"}],
                    "settings": [
                        {"name": "containerInsights", "value": "enabled"},
                    ],
                    "registeredContainerInstancesCount": 5,
                    "runningTasksCount": 10,
                    "pendingTasksCount": 1,
                    "activeServicesCount": 2,
                },
            ]
        }
    return make_api_call(self, operation_name, kwarg)


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
class Test_ECS_Service:
    # Test ECS Service
    def test_service(self):
        aws_provider = set_mocked_aws_provider()
        ecs = ECS(aws_provider)
        assert ecs.service == "ecs"

    # Test ECS client
    def test_client(self):
        aws_provider = set_mocked_aws_provider()
        ecs = ECS(aws_provider)
        for reg_client in ecs.regional_clients.values():
            assert reg_client.__class__.__name__ == "ECS"

    # Test ECS session
    def test__get_session__(self):
        aws_provider = set_mocked_aws_provider()
        ecs = ECS(aws_provider)
        assert ecs.session.__class__.__name__ == "Session"

    # Test list ECS task definitions
    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_list_task_definitions(self):
        aws_provider = set_mocked_aws_provider()
        ecs = ECS(aws_provider)

        task_arn = "arn:aws:ecs:eu-west-1:123456789012:task-definition/test_cluster_1/test_ecs_task:1"

        assert len(ecs.task_definitions) == 1
        assert ecs.task_definitions[task_arn].name == "test_ecs_task"
        assert ecs.task_definitions[task_arn].arn == task_arn
        assert ecs.task_definitions[task_arn].revision == "1"
        assert ecs.task_definitions[task_arn].region == AWS_REGION_EU_WEST_1

    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    # Test describe ECS task definitions
    def test_describe_task_definitions(self):
        aws_provider = set_mocked_aws_provider()
        ecs = ECS(aws_provider)

        task_arn = "arn:aws:ecs:eu-west-1:123456789012:task-definition/test_cluster_1/test_ecs_task:1"

        assert len(ecs.task_definitions) == 1
        assert ecs.task_definitions[task_arn].name == "test_ecs_task"
        assert ecs.task_definitions[task_arn].arn == task_arn
        assert ecs.task_definitions[task_arn].revision == "1"
        assert ecs.task_definitions[task_arn].region == AWS_REGION_EU_WEST_1
        assert len(ecs.task_definitions[task_arn].container_definitions) == 1
        assert (
            ecs.task_definitions[task_arn].container_definitions[0].name
            == "test-container"
        )
        assert (
            len(ecs.task_definitions[task_arn].container_definitions[0].environment)
            == 1
        )
        assert (
            ecs.task_definitions[task_arn].container_definitions[0].environment[0].name
            == "DB_PASSWORD"
        )
        assert (
            ecs.task_definitions[task_arn].container_definitions[0].environment[0].value
            == "pass-12343"
        )
        assert ecs.task_definitions[task_arn].network_mode == "host"
        assert not ecs.task_definitions[task_arn].container_definitions[0].privileged
        assert ecs.task_definitions[task_arn].container_definitions[0].user == ""
        assert (
            ecs.task_definitions[task_arn].container_definitions[0].log_driver
            == "awslogs"
        )
        assert (
            ecs.task_definitions[task_arn].container_definitions[0].log_option
            == "non-blocking"
        )
        assert ecs.task_definitions[task_arn].pid_mode == "host"
        assert (
            not ecs.task_definitions[task_arn]
            .container_definitions[0]
            .readonly_rootfilesystem
        )

    # Test list ECS clusters
    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_list_clusters(self):
        aws_provider = set_mocked_aws_provider()
        ecs = ECS(aws_provider)

        cluster_arn1 = "arn:aws:ecs:eu-west-1:123456789012:cluster/test_cluster_1"

        assert len(ecs.clusters) == 1
        assert ecs.clusters[cluster_arn1].name == "test_cluster_1"
        assert ecs.clusters[cluster_arn1].arn == cluster_arn1
        assert ecs.clusters[cluster_arn1].region == AWS_REGION_EU_WEST_1

    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    # Test describe ECS clusters
    def test_describe_clusters(self):
        aws_provider = set_mocked_aws_provider()
        ecs = ECS(aws_provider)

        cluster_arn1 = "arn:aws:ecs:eu-west-1:123456789012:cluster/test_cluster_1"

        assert len(ecs.clusters) == 1
        assert ecs.clusters[cluster_arn1].name == "test_cluster_1"
        assert ecs.clusters[cluster_arn1].arn == cluster_arn1
        assert ecs.clusters[cluster_arn1].region == AWS_REGION_EU_WEST_1
        assert ecs.clusters[cluster_arn1].services
        assert ecs.clusters[cluster_arn1].tags == [
            {"key": "Name", "value": "test_cluster_1"}
        ]
        assert ecs.clusters[cluster_arn1].settings == [
            {"name": "containerInsights", "value": "enabled"}
        ]

    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    # Test describe ECS services
    def test_describe_services(self):
        aws_provider = set_mocked_aws_provider()
        ecs = ECS(aws_provider)

        service_arn = (
            "arn:aws:ecs:eu-west-1:123456789012:service/test_cluster_1/test_ecs_service"
        )

        task_set_arn = "arn:aws:ecs:eu-west-1:123456789012:task-set/test_cluster_1/test_ecs_service/ecs-svc/task-set"

        assert len(ecs.services) == 1
        assert ecs.services[service_arn].name == "test_ecs_service"
        assert ecs.services[service_arn].arn == service_arn
        assert ecs.services[service_arn].region == AWS_REGION_EU_WEST_1
        assert ecs.services[service_arn].assign_public_ip
        assert ecs.services[service_arn].tags == []
        assert ecs.services[service_arn].launch_type == "FARGATE"
        assert ecs.services[service_arn].platform_version == "1.4.0"
        assert ecs.services[service_arn].platform_family == "Linux"
        assert len(ecs.task_sets) == 1
        assert ecs.task_sets[task_set_arn].id == "ecs-svc/task-set"
        assert ecs.task_sets[task_set_arn].arn == task_set_arn
        assert (
            ecs.task_sets[task_set_arn].cluster_arn
            == "arn:aws:ecs:eu-west-1:123456789012:cluster/test_cluster_1"
        )
        assert ecs.task_sets[task_set_arn].service_arn == service_arn
        assert ecs.task_sets[task_set_arn].assign_public_ip == "DISABLED"
        assert ecs.task_sets[task_set_arn].region == AWS_REGION_EU_WEST_1
        assert ecs.task_sets[task_set_arn].tags == []
```

--------------------------------------------------------------------------------

---[FILE: ecs_cluster_container_insights_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/ecs/ecs_cluster_container_insights_enabled/ecs_cluster_container_insights_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

CLUSTER_NAME = "test-cluster"


class Test_ecs_clusters_container_insights_enabled:
    @mock_aws
    def test_no_clusters(self):
        from prowler.providers.aws.services.ecs.ecs_service import ECS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ecs.ecs_cluster_container_insights_enabled.ecs_cluster_container_insights_enabled.ecs_client",
                new=ECS(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_cluster_container_insights_enabled.ecs_cluster_container_insights_enabled import (
                ecs_cluster_container_insights_enabled,
            )

            check = ecs_cluster_container_insights_enabled()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_cluster_no_settings(self):
        ecs_client = client("ecs", region_name=AWS_REGION_US_EAST_1)
        cluster_arn = ecs_client.create_cluster(
            clusterName=CLUSTER_NAME,
        )[
            "cluster"
        ]["clusterArn"]

        from prowler.providers.aws.services.ecs.ecs_service import ECS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ecs.ecs_cluster_container_insights_enabled.ecs_cluster_container_insights_enabled.ecs_client",
                new=ECS(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_cluster_container_insights_enabled.ecs_cluster_container_insights_enabled import (
                ecs_cluster_container_insights_enabled,
            )

            check = ecs_cluster_container_insights_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].resource_arn == cluster_arn
            assert (
                result[0].status_extended
                == f"ECS cluster {CLUSTER_NAME} does not have container insights enabled."
            )

    @mock_aws
    def test_cluster_enabled_container_insights(self):
        ecs_client = client("ecs", region_name=AWS_REGION_US_EAST_1)
        cluster_settings = [
            {"name": "containerInsights", "value": "enabled"},
        ]
        cluster_arn = ecs_client.create_cluster(
            clusterName=CLUSTER_NAME,
            settings=cluster_settings,
        )["cluster"]["clusterArn"]

        from prowler.providers.aws.services.ecs.ecs_service import ECS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ecs.ecs_cluster_container_insights_enabled.ecs_cluster_container_insights_enabled.ecs_client",
                new=ECS(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_cluster_container_insights_enabled.ecs_cluster_container_insights_enabled import (
                ecs_cluster_container_insights_enabled,
            )

            check = ecs_cluster_container_insights_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].resource_arn == cluster_arn
            assert (
                result[0].status_extended
                == f"ECS cluster {CLUSTER_NAME} has container insights enabled."
            )

    @mock_aws
    def test_cluster_enhanced_container_insights(self):
        ecs_client = client("ecs", region_name=AWS_REGION_US_EAST_1)
        cluster_settings = [
            {"name": "containerInsights", "value": "enhanced"},
        ]
        cluster_arn = ecs_client.create_cluster(
            clusterName=CLUSTER_NAME,
            settings=cluster_settings,
        )["cluster"]["clusterArn"]

        from prowler.providers.aws.services.ecs.ecs_service import ECS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ecs.ecs_cluster_container_insights_enabled.ecs_cluster_container_insights_enabled.ecs_client",
                new=ECS(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_cluster_container_insights_enabled.ecs_cluster_container_insights_enabled import (
                ecs_cluster_container_insights_enabled,
            )

            check = ecs_cluster_container_insights_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].resource_arn == cluster_arn
            assert (
                result[0].status_extended
                == f"ECS cluster {CLUSTER_NAME} has container insights enhanced."
            )

    @mock_aws
    def test_cluster_disabled_container_insights(self):
        ecs_client = client("ecs", region_name=AWS_REGION_US_EAST_1)
        cluster_settings = [
            {"name": "containerInsights", "value": "disabled"},
        ]
        cluster_arn = ecs_client.create_cluster(
            clusterName=CLUSTER_NAME,
            settings=cluster_settings,
        )["cluster"]["clusterArn"]

        from prowler.providers.aws.services.ecs.ecs_service import ECS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ecs.ecs_cluster_container_insights_enabled.ecs_cluster_container_insights_enabled.ecs_client",
                new=ECS(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_cluster_container_insights_enabled.ecs_cluster_container_insights_enabled import (
                ecs_cluster_container_insights_enabled,
            )

            check = ecs_cluster_container_insights_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].resource_arn == cluster_arn
            assert (
                result[0].status_extended
                == f"ECS cluster {CLUSTER_NAME} does not have container insights enabled."
            )
```

--------------------------------------------------------------------------------

---[FILE: ecs_service_fargate_latest_platform_version_test.py]---
Location: prowler-master/tests/providers/aws/services/ecs/ecs_service_fargate_latest_platform_version/ecs_service_fargate_latest_platform_version_test.py

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
            f"arn:aws:ecs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:service/test-cluster/test-latest-linux-service"
        ]:
            return {
                "services": [
                    {
                        "serviceName": "test-latest-linux-service",
                        "clusterArn": f"arn:aws:ecs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster/test-cluster",
                        "taskDefinition": "test-task",
                        "loadBalancers": [],
                        "serviceArn": f"arn:aws:ecs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:service/test-cluster/test-latest-linux-service",
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
            f"arn:aws:ecs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:service/test-cluster/test-latest-windows-service"
        ]:
            return {
                "services": [
                    {
                        "serviceName": "test-latest-windows-service",
                        "clusterArn": f"arn:aws:ecs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster/test-cluster",
                        "taskDefinition": "test-task",
                        "loadBalancers": [],
                        "serviceArn": f"arn:aws:ecs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:service/test-cluster/test-latest-windows-service",
                        "desiredCount": 1,
                        "launchType": "FARGATE",
                        "platformVersion": "1.0.0",
                        "platformFamily": "Windows",
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
            f"arn:aws:ecs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:service/test-cluster/test-no-latest-linux-service"
        ]:
            return {
                "services": [
                    {
                        "serviceName": "test-no-latest-linux-service",
                        "clusterArn": f"arn:aws:ecs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster/test-cluster",
                        "taskDefinition": "test-task",
                        "loadBalancers": [],
                        "serviceArn": f"arn:aws:ecs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:service/test-cluster/test-no-latest-linux-service",
                        "desiredCount": 1,
                        "launchType": "FARGATE",
                        "platformVersion": "1.2.0",
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
            f"arn:aws:ecs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:service/test-cluster/test-no-latest-windows-service"
        ]:
            return {
                "services": [
                    {
                        "serviceName": "test-no-latest-windows-service",
                        "clusterArn": f"arn:aws:ecs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster/test-cluster",
                        "taskDefinition": "test-task",
                        "loadBalancers": [],
                        "serviceArn": f"arn:aws:ecs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:service/test-cluster/test-no-latest-windows-service",
                        "desiredCount": 1,
                        "launchType": "FARGATE",
                        "platformVersion": "0.9.0",
                        "platformFamily": "Windows",
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
    return orig(self, operation_name, kwarg)


class Test_ecs_service_fargate_latest_platform_version:
    def test_no_services(self):
        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_service_fargate_latest_platform_version.ecs_service_fargate_latest_platform_version.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_service_fargate_latest_platform_version.ecs_service_fargate_latest_platform_version import (
                ecs_service_fargate_latest_platform_version,
            )

            check = ecs_service_fargate_latest_platform_version()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_service_ec2_type(self):
        ecs_client = client("ecs", region_name=AWS_REGION_US_EAST_1)

        ecs_client.create_cluster(clusterName="test-cluster")

        ecs_client.create_service(
            cluster="test-cluster",
            serviceName="test-service",
            launchType="EC2",
            platformVersion="1.4.0",
            desiredCount=1,
            clientToken="test-token",
        )

        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_service_fargate_latest_platform_version.ecs_service_fargate_latest_platform_version.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_service_fargate_latest_platform_version.ecs_service_fargate_latest_platform_version import (
                ecs_service_fargate_latest_platform_version,
            )

            check = ecs_service_fargate_latest_platform_version()
            result = check.execute()
            assert len(result) == 0

    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    @mock_aws
    def test_service_linux_latest_version(self):
        ecs_client = client("ecs", region_name=AWS_REGION_US_EAST_1)

        ecs_client.create_cluster(clusterName="test-cluster")

        ecs_client.create_service(
            cluster="test-cluster",
            serviceName="test-latest-linux-service",
            launchType="FARGATE",
            platformVersion="1.4.0",
            desiredCount=1,
            clientToken="test-token",
        )

        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        mocked_ecs_client = ECS(mocked_aws_provider)

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_service_fargate_latest_platform_version.ecs_service_fargate_latest_platform_version.ecs_client",
                new=mocked_ecs_client,
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_service_fargate_latest_platform_version.ecs_service_fargate_latest_platform_version import (
                ecs_service_fargate_latest_platform_version,
            )

            check = ecs_service_fargate_latest_platform_version()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                "ECS Service test-latest-linux-service is using latest FARGATE Linux version 1.4.0."
            )
            assert result[0].resource_id == "test-cluster/test-latest-linux-service"
            assert (
                result[0].resource_arn
                == f"arn:aws:ecs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:service/test-cluster/test-latest-linux-service"
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1

    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    @mock_aws
    def test_service_windows_latest_version(self):
        ecs_client = client("ecs", region_name=AWS_REGION_US_EAST_1)

        ecs_client.create_cluster(clusterName="test-cluster")

        ecs_client.create_service(
            cluster="test-cluster",
            serviceName="test-latest-windows-service",
            launchType="FARGATE",
            platformVersion="1.0.0",
            desiredCount=1,
            clientToken="test-token",
        )

        ecs_client.audit_config = {
            "fargate_windows_latest_version": "1.0.0",
        }

        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_service_fargate_latest_platform_version.ecs_service_fargate_latest_platform_version.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_service_fargate_latest_platform_version.ecs_service_fargate_latest_platform_version import (
                ecs_service_fargate_latest_platform_version,
            )

            check = ecs_service_fargate_latest_platform_version()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                "ECS Service test-latest-windows-service is using latest FARGATE Windows version 1.0.0."
            )
            assert result[0].resource_id == "test-cluster/test-latest-windows-service"
            assert (
                result[0].resource_arn
                == f"arn:aws:ecs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:service/test-cluster/test-latest-windows-service"
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1

    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    @mock_aws
    def test_service_linux_no_latest_version(self):
        ecs_client = client("ecs", region_name=AWS_REGION_US_EAST_1)

        ecs_client.create_cluster(clusterName="test-cluster")

        ecs_client.create_service(
            cluster="test-cluster",
            serviceName="test-no-latest-linux-service",
            launchType="FARGATE",
            platformVersion="1.2.0",
            desiredCount=1,
            clientToken="test-token",
        )

        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_service_fargate_latest_platform_version.ecs_service_fargate_latest_platform_version.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_service_fargate_latest_platform_version.ecs_service_fargate_latest_platform_version import (
                ecs_service_fargate_latest_platform_version,
            )

            check = ecs_service_fargate_latest_platform_version()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                "ECS Service test-no-latest-linux-service is not using latest FARGATE Linux version 1.4.0, currently using 1.2.0."
            )
            assert result[0].resource_id == "test-cluster/test-no-latest-linux-service"
            assert (
                result[0].resource_arn
                == f"arn:aws:ecs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:service/test-cluster/test-no-latest-linux-service"
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1

    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    @mock_aws
    def test_service_windows_no_latest_version(self):
        ecs_client = client("ecs", region_name=AWS_REGION_US_EAST_1)

        ecs_client.create_cluster(clusterName="test-cluster")

        ecs_client.create_service(
            cluster="test-cluster",
            serviceName="test-no-latest-windows-service",
            launchType="FARGATE",
            platformVersion="0.9.0",
            desiredCount=1,
            clientToken="test-token",
        )

        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_service_fargate_latest_platform_version.ecs_service_fargate_latest_platform_version.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_service_fargate_latest_platform_version.ecs_service_fargate_latest_platform_version import (
                ecs_service_fargate_latest_platform_version,
            )

            check = ecs_service_fargate_latest_platform_version()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                "ECS Service test-no-latest-windows-service is not using latest FARGATE Windows version 1.0.0, currently using 0.9.0."
            )
            assert (
                result[0].resource_id == "test-cluster/test-no-latest-windows-service"
            )
            assert (
                result[0].resource_arn
                == f"arn:aws:ecs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:service/test-cluster/test-no-latest-windows-service"
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1
```

--------------------------------------------------------------------------------

````
