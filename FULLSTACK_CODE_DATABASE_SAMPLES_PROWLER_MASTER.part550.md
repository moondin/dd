---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 550
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 550 of 867)

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

---[FILE: elasticache_redis_replication_group_auth_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/elasticache/elasticache_redis_replication_group_auth_enabled/elasticache_redis_replication_group_auth_enabled_test.py

```python
from unittest import mock

from mock import MagicMock, patch
from moto import mock_aws

from prowler.providers.aws.services.elasticache.elasticache_service import (
    ReplicationGroup,
)
from tests.providers.aws.services.elasticache.elasticache_service_test import (
    REPLICATION_GROUP_ARN,
    REPLICATION_GROUP_ENCRYPTION,
    REPLICATION_GROUP_ID,
    REPLICATION_GROUP_MULTI_AZ,
    REPLICATION_GROUP_SNAPSHOT_RETENTION,
    REPLICATION_GROUP_STATUS,
    REPLICATION_GROUP_TAGS,
    REPLICATION_GROUP_TRANSIT_ENCRYPTION,
    mock_make_api_call,
)
from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

VPC_ID = "vpc-12345678901234567"


# Patch every AWS call using Boto3
@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
class Test_elasticache_redis_replication_group_auth_enabled:
    @mock_aws
    def test_elasticache_no_replication_groups(self):
        # Mock VPC Service
        vpc_client = MagicMock
        vpc_client.vpc_subnets = {}

        # Mock ElastiCache Service
        elasticache_service = MagicMock
        elasticache_service.replication_groups = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.elasticache.elasticache_service.ElastiCache",
                new=elasticache_service,
            ),
            mock.patch(
                "prowler.providers.aws.services.vpc.vpc_service.VPC",
                new=vpc_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.vpc.vpc_client.vpc_client",
                new=vpc_client,
            ),
        ):
            from prowler.providers.aws.services.elasticache.elasticache_redis_replication_group_auth_enabled.elasticache_redis_replication_group_auth_enabled import (
                elasticache_redis_replication_group_auth_enabled,
            )

            check = elasticache_redis_replication_group_auth_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_elasticache_no_old_redis_replication_groups(self):
        # Mock ElastiCache Service
        elasticache_service = MagicMock
        engine_version = "6.0"
        elasticache_service.replication_groups = {
            REPLICATION_GROUP_ARN: ReplicationGroup(
                arn=REPLICATION_GROUP_ARN,
                id=REPLICATION_GROUP_ID,
                region=AWS_REGION_US_EAST_1,
                status=REPLICATION_GROUP_STATUS,
                snapshot_retention=REPLICATION_GROUP_SNAPSHOT_RETENTION,
                encrypted=REPLICATION_GROUP_ENCRYPTION,
                transit_encryption=REPLICATION_GROUP_TRANSIT_ENCRYPTION,
                multi_az=REPLICATION_GROUP_MULTI_AZ,
                tags=REPLICATION_GROUP_TAGS,
                automatic_failover="enabled",
                auto_minor_version_upgrade=False,
                engine_version=engine_version,
                auth_token_enabled=False,
            )
        }

        # Mock VPC Service
        vpc_client = MagicMock
        vpc_client.vpc_subnets = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.elasticache.elasticache_service.ElastiCache",
                new=elasticache_service,
            ),
            mock.patch(
                "prowler.providers.aws.services.vpc.vpc_service.VPC",
                new=vpc_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.vpc.vpc_client.vpc_client",
                new=vpc_client,
            ),
        ):
            from prowler.providers.aws.services.elasticache.elasticache_redis_replication_group_auth_enabled.elasticache_redis_replication_group_auth_enabled import (
                elasticache_redis_replication_group_auth_enabled,
            )

            check = elasticache_redis_replication_group_auth_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "MANUAL"
            assert (
                result[0].status_extended
                == f"Elasticache Redis replication group {REPLICATION_GROUP_ID} has version {engine_version} which supports Redis ACLs. Please review the ACL configuration."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == REPLICATION_GROUP_ID
            assert result[0].resource_arn == REPLICATION_GROUP_ARN
            assert result[0].resource_tags == REPLICATION_GROUP_TAGS

    def test_elasticache_redis_replication_group_auth_enabled(self):
        # Mock ElastiCache Service
        elasticache_service = MagicMock
        engine_version = "5.0"
        elasticache_service.replication_groups = {
            REPLICATION_GROUP_ARN: ReplicationGroup(
                arn=REPLICATION_GROUP_ARN,
                id=REPLICATION_GROUP_ID,
                region=AWS_REGION_US_EAST_1,
                status=REPLICATION_GROUP_STATUS,
                snapshot_retention=REPLICATION_GROUP_SNAPSHOT_RETENTION,
                encrypted=REPLICATION_GROUP_ENCRYPTION,
                transit_encryption=REPLICATION_GROUP_TRANSIT_ENCRYPTION,
                multi_az=REPLICATION_GROUP_MULTI_AZ,
                tags=REPLICATION_GROUP_TAGS,
                automatic_failover="enabled",
                auto_minor_version_upgrade=False,
                engine_version=engine_version,
                auth_token_enabled=True,
            )
        }

        # Mock VPC Service
        vpc_client = MagicMock
        vpc_client.vpc_subnets = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.elasticache.elasticache_service.ElastiCache",
                new=elasticache_service,
            ),
            mock.patch(
                "prowler.providers.aws.services.vpc.vpc_service.VPC",
                new=vpc_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.vpc.vpc_client.vpc_client",
                new=vpc_client,
            ),
        ):
            from prowler.providers.aws.services.elasticache.elasticache_redis_replication_group_auth_enabled.elasticache_redis_replication_group_auth_enabled import (
                elasticache_redis_replication_group_auth_enabled,
            )

            check = elasticache_redis_replication_group_auth_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Elasticache Redis replication group {REPLICATION_GROUP_ID}(v{engine_version}) does have AUTH enabled."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == REPLICATION_GROUP_ID
            assert result[0].resource_arn == REPLICATION_GROUP_ARN
            assert result[0].resource_tags == REPLICATION_GROUP_TAGS

    def test_elasticache_redis_cluster_auth_disabled(self):
        # Mock ElastiCache Service
        elasticache_service = MagicMock
        engine_version = "4.2"
        elasticache_service.replication_groups = {
            REPLICATION_GROUP_ARN: ReplicationGroup(
                arn=REPLICATION_GROUP_ARN,
                id=REPLICATION_GROUP_ID,
                region=AWS_REGION_US_EAST_1,
                status=REPLICATION_GROUP_STATUS,
                snapshot_retention=REPLICATION_GROUP_SNAPSHOT_RETENTION,
                encrypted=REPLICATION_GROUP_ENCRYPTION,
                transit_encryption=REPLICATION_GROUP_TRANSIT_ENCRYPTION,
                multi_az=REPLICATION_GROUP_MULTI_AZ,
                tags=REPLICATION_GROUP_TAGS,
                automatic_failover="enabled",
                auto_minor_version_upgrade=False,
                engine_version=engine_version,
                auth_token_enabled=False,
            )
        }

        # Mock VPC Service
        vpc_client = MagicMock
        vpc_client.vpc_subnets = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.elasticache.elasticache_service.ElastiCache",
                new=elasticache_service,
            ),
            mock.patch(
                "prowler.providers.aws.services.vpc.vpc_service.VPC",
                new=vpc_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.vpc.vpc_client.vpc_client",
                new=vpc_client,
            ),
        ):
            from prowler.providers.aws.services.elasticache.elasticache_redis_replication_group_auth_enabled.elasticache_redis_replication_group_auth_enabled import (
                elasticache_redis_replication_group_auth_enabled,
            )

            check = elasticache_redis_replication_group_auth_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Elasticache Redis replication group {REPLICATION_GROUP_ID}(v{engine_version}) does not have AUTH enabled."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == REPLICATION_GROUP_ID
            assert result[0].resource_arn == REPLICATION_GROUP_ARN
            assert result[0].resource_tags == REPLICATION_GROUP_TAGS
```

--------------------------------------------------------------------------------

---[FILE: elasticbeanstalk_service_test.py]---
Location: prowler-master/tests/providers/aws/services/elasticbeanstalk/elasticbeanstalk_service_test.py

```python
from unittest.mock import patch

import botocore
from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.elasticbeanstalk.elasticbeanstalk_service import (
    ElasticBeanstalk,
)
from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "DescribeConfigurationSettings":
        return {
            "ConfigurationSettings": [
                {
                    "OptionSettings": [
                        {
                            "Namespace": "aws:elasticbeanstalk:healthreporting:system",
                            "OptionName": "SystemType",
                            "Value": "enhanced",
                        },
                        {
                            "Namespace": "aws:elasticbeanstalk:managedactions",
                            "OptionName": "ManagedActionsEnabled",
                            "Value": "true",
                        },
                        {
                            "Namespace": "aws:elasticbeanstalk:cloudwatch:logs",
                            "OptionName": "StreamLogs",
                            "Value": "true",
                        },
                    ],
                }
            ]
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
class Test_ElasticBeanstalk_Service:
    # Test ElasticBeanstalk Client
    @mock_aws
    def test_get_client(self):
        elasticbeanstalk = ElasticBeanstalk(set_mocked_aws_provider())
        assert (
            elasticbeanstalk.regional_clients[AWS_REGION_EU_WEST_1].__class__.__name__
            == "ElasticBeanstalk"
        )

    # Test ElasticBeanstalk Session
    @mock_aws
    def test__get_session__(self):
        elasticbeanstalk = ElasticBeanstalk(set_mocked_aws_provider())
        assert elasticbeanstalk.session.__class__.__name__ == "Session"

    # Test ElasticBeanstalk Service
    @mock_aws
    def test__get_service__(self):
        elasticbeanstalk = ElasticBeanstalk(set_mocked_aws_provider())
        assert elasticbeanstalk.service == "elasticbeanstalk"

    # Test _describe_environments
    @mock_aws
    def test_describe_environments(self):
        # Create ElasticBeanstalk app and env
        elasticbeanstalk_client = client(
            "elasticbeanstalk", region_name=AWS_REGION_EU_WEST_1
        )
        elasticbeanstalk_client.create_application(ApplicationName="test-app")
        environment = elasticbeanstalk_client.create_environment(
            ApplicationName="test-app",
            EnvironmentName="test-env",
        )
        # ElasticBeanstalk Class
        elasticbeanstalk = ElasticBeanstalk(set_mocked_aws_provider())

        assert len(elasticbeanstalk.environments) == 1
        assert (
            elasticbeanstalk.environments[environment["EnvironmentArn"]].id
            == environment["EnvironmentId"]
        )
        assert (
            elasticbeanstalk.environments[environment["EnvironmentArn"]].name
            == "test-env"
        )
        assert (
            elasticbeanstalk.environments[environment["EnvironmentArn"]].region
            == AWS_REGION_EU_WEST_1
        )
        assert (
            elasticbeanstalk.environments[
                environment["EnvironmentArn"]
            ].application_name
            == "test-app"
        )

    # Test _describe_configuration_settings
    @mock_aws
    def test_describe_configuration_settings(self):
        # Create ElasticBeanstalk app and env
        elasticbeanstalk_client = client(
            "elasticbeanstalk", region_name=AWS_REGION_EU_WEST_1
        )
        elasticbeanstalk_client.create_application(ApplicationName="test-app")
        environment = elasticbeanstalk_client.create_environment(
            ApplicationName="test-app",
            EnvironmentName="test-env",
        )
        # ElasticBeanstalk Class
        elasticbeanstalk = ElasticBeanstalk(set_mocked_aws_provider())
        assert (
            elasticbeanstalk.environments[
                environment["EnvironmentArn"]
            ].health_reporting
            == "enhanced"
        )
        assert (
            elasticbeanstalk.environments[
                environment["EnvironmentArn"]
            ].managed_platform_updates
            == "true"
        )
        assert (
            elasticbeanstalk.environments[
                environment["EnvironmentArn"]
            ].cloudwatch_stream_logs
            == "true"
        )

    @mock_aws
    def test_list_tags_for_resource(self):
        # Create ElasticBeanstalk app and env
        elasticbeanstalk_client = client(
            "elasticbeanstalk", region_name=AWS_REGION_EU_WEST_1
        )
        elasticbeanstalk_client.create_application(ApplicationName="test-app")
        environment = elasticbeanstalk_client.create_environment(
            ApplicationName="test-app",
            EnvironmentName="test-env",
            Tags=[{"Key": "test-key", "Value": "test-value"}],
        )
        # ElasticBeanstalk Class
        elasticbeanstalk = ElasticBeanstalk(set_mocked_aws_provider())
        assert elasticbeanstalk.environments[environment["EnvironmentArn"]].tags == [
            {"Key": "test-key", "Value": "test-value"}
        ]
```

--------------------------------------------------------------------------------

---[FILE: elasticbeanstalk_environment_cloudwatch_logging_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/elasticbeanstalk/elasticbeanstalk_environment_cloudwatch_logging_enabled/elasticbeanstalk_environment_cloudwatch_logging_enabled_test.py

```python
from unittest import mock

import botocore
from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.elasticbeanstalk.elasticbeanstalk_service import (
    ElasticBeanstalk,
)
from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "DescribeConfigurationSettings":
        if kwarg["EnvironmentName"] == "test-env-not-using-cloudwatch":
            return {
                "ConfigurationSettings": [
                    {
                        "OptionSettings": [
                            {
                                "Namespace": "aws:elasticbeanstalk:cloudwatch:logs",
                                "OptionName": "StreamLogs",
                                "Value": "false",
                            },
                        ],
                    }
                ]
            }
        if kwarg["EnvironmentName"] == "test-env-using-cloudwatch":
            return {
                "ConfigurationSettings": [
                    {
                        "OptionSettings": [
                            {
                                "Namespace": "aws:elasticbeanstalk:cloudwatch:logs",
                                "OptionName": "StreamLogs",
                                "Value": "true",
                            },
                        ],
                    }
                ]
            }

    return make_api_call(self, operation_name, kwarg)


class Test_elasticbeanstalk_environment_cloudwatch_logging_enabled:
    @mock_aws
    def test_elasticbeanstalk_no_environments(self):
        elasticbeanstalk_client = client(
            "elasticbeanstalk", region_name=AWS_REGION_EU_WEST_1
        )
        elasticbeanstalk_client.create_application(ApplicationName="test-app")

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.elasticbeanstalk.elasticbeanstalk_environment_cloudwatch_logging_enabled.elasticbeanstalk_environment_cloudwatch_logging_enabled.elasticbeanstalk_client",
                new=ElasticBeanstalk(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.elasticbeanstalk.elasticbeanstalk_environment_cloudwatch_logging_enabled.elasticbeanstalk_environment_cloudwatch_logging_enabled import (
                elasticbeanstalk_environment_cloudwatch_logging_enabled,
            )

            check = elasticbeanstalk_environment_cloudwatch_logging_enabled()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_elasticbeanstalk_environment_cloudwatch_not_enabled(self):
        elasticbeanstalk_client = client(
            "elasticbeanstalk", region_name=AWS_REGION_EU_WEST_1
        )
        elasticbeanstalk_client.create_application(ApplicationName="test-app")
        environment = elasticbeanstalk_client.create_environment(
            ApplicationName="test-app",
            EnvironmentName="test-env-using-cloudwatch",
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.elasticbeanstalk.elasticbeanstalk_environment_cloudwatch_logging_enabled.elasticbeanstalk_environment_cloudwatch_logging_enabled.elasticbeanstalk_client",
                new=ElasticBeanstalk(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.elasticbeanstalk.elasticbeanstalk_environment_cloudwatch_logging_enabled.elasticbeanstalk_environment_cloudwatch_logging_enabled import (
                elasticbeanstalk_environment_cloudwatch_logging_enabled,
            )

            check = elasticbeanstalk_environment_cloudwatch_logging_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Elastic Beanstalk environment test-env-using-cloudwatch is sending logs to CloudWatch Logs."
            )
            assert result[0].resource_id == environment["EnvironmentName"]
            assert result[0].resource_arn == environment["EnvironmentArn"]
            assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_elasticbeanstalk_environment_cloudwatch_enabled(self):
        elasticbeanstalk_client = client(
            "elasticbeanstalk", region_name=AWS_REGION_EU_WEST_1
        )
        elasticbeanstalk_client.create_application(ApplicationName="test-app")
        environment = elasticbeanstalk_client.create_environment(
            ApplicationName="test-app",
            EnvironmentName="test-env-not-using-cloudwatch",
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.elasticbeanstalk.elasticbeanstalk_environment_cloudwatch_logging_enabled.elasticbeanstalk_environment_cloudwatch_logging_enabled.elasticbeanstalk_client",
                new=ElasticBeanstalk(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.elasticbeanstalk.elasticbeanstalk_environment_cloudwatch_logging_enabled.elasticbeanstalk_environment_cloudwatch_logging_enabled import (
                elasticbeanstalk_environment_cloudwatch_logging_enabled,
            )

            check = elasticbeanstalk_environment_cloudwatch_logging_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Elastic Beanstalk environment test-env-not-using-cloudwatch is not sending logs to CloudWatch Logs."
            )
            assert result[0].resource_id == environment["EnvironmentName"]
            assert result[0].resource_arn == environment["EnvironmentArn"]
            assert result[0].region == AWS_REGION_EU_WEST_1
```

--------------------------------------------------------------------------------

---[FILE: elasticbeanstalk_environment_enhanced_health_reporting_test.py]---
Location: prowler-master/tests/providers/aws/services/elasticbeanstalk/elasticbeanstalk_environment_enhanced_health_reporting/elasticbeanstalk_environment_enhanced_health_reporting_test.py

```python
from unittest import mock

import botocore
from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.elasticbeanstalk.elasticbeanstalk_service import (
    ElasticBeanstalk,
)
from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "DescribeConfigurationSettings":
        if kwarg["EnvironmentName"] == "test-env-using-basic-health-reporting":
            return {
                "ConfigurationSettings": [
                    {
                        "OptionSettings": [
                            {
                                "Namespace": "aws:elasticbeanstalk:healthreporting:system",
                                "OptionName": "SystemType",
                                "Value": "basic",
                            },
                        ],
                    }
                ]
            }
        if kwarg["EnvironmentName"] == "test-env-using-enhanced-health-reporting":
            return {
                "ConfigurationSettings": [
                    {
                        "OptionSettings": [
                            {
                                "Namespace": "aws:elasticbeanstalk:healthreporting:system",
                                "OptionName": "SystemType",
                                "Value": "enhanced",
                            },
                        ],
                    }
                ]
            }

    return make_api_call(self, operation_name, kwarg)


class Test_elasticbeanstalk_environment_enhanced_health_reporting:
    @mock_aws
    def test_elasticbeanstalk_no_environments(self):
        elasticbeanstalk_client = client(
            "elasticbeanstalk", region_name=AWS_REGION_EU_WEST_1
        )
        elasticbeanstalk_client.create_application(ApplicationName="test-app")

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.elasticbeanstalk.elasticbeanstalk_environment_enhanced_health_reporting.elasticbeanstalk_environment_enhanced_health_reporting.elasticbeanstalk_client",
                new=ElasticBeanstalk(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.elasticbeanstalk.elasticbeanstalk_environment_enhanced_health_reporting.elasticbeanstalk_environment_enhanced_health_reporting import (
                elasticbeanstalk_environment_enhanced_health_reporting,
            )

            check = elasticbeanstalk_environment_enhanced_health_reporting()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_elasticbeanstalk_environment_cloudwatch_not_enabled(self):
        elasticbeanstalk_client = client(
            "elasticbeanstalk", region_name=AWS_REGION_EU_WEST_1
        )
        elasticbeanstalk_client.create_application(ApplicationName="test-app")
        environment = elasticbeanstalk_client.create_environment(
            ApplicationName="test-app",
            EnvironmentName="test-env-using-enhanced-health-reporting",
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.elasticbeanstalk.elasticbeanstalk_environment_enhanced_health_reporting.elasticbeanstalk_environment_enhanced_health_reporting.elasticbeanstalk_client",
                new=ElasticBeanstalk(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.elasticbeanstalk.elasticbeanstalk_environment_enhanced_health_reporting.elasticbeanstalk_environment_enhanced_health_reporting import (
                elasticbeanstalk_environment_enhanced_health_reporting,
            )

            check = elasticbeanstalk_environment_enhanced_health_reporting()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Elastic Beanstalk environment test-env-using-enhanced-health-reporting has enhanced health reporting enabled."
            )
            assert result[0].resource_id == environment["EnvironmentName"]
            assert result[0].resource_arn == environment["EnvironmentArn"]
            assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_elasticbeanstalk_environment_cloudwatch_enabled(self):
        elasticbeanstalk_client = client(
            "elasticbeanstalk", region_name=AWS_REGION_EU_WEST_1
        )
        elasticbeanstalk_client.create_application(ApplicationName="test-app")
        environment = elasticbeanstalk_client.create_environment(
            ApplicationName="test-app",
            EnvironmentName="test-env-using-basic-health-reporting",
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.elasticbeanstalk.elasticbeanstalk_environment_enhanced_health_reporting.elasticbeanstalk_environment_enhanced_health_reporting.elasticbeanstalk_client",
                new=ElasticBeanstalk(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.elasticbeanstalk.elasticbeanstalk_environment_enhanced_health_reporting.elasticbeanstalk_environment_enhanced_health_reporting import (
                elasticbeanstalk_environment_enhanced_health_reporting,
            )

            check = elasticbeanstalk_environment_enhanced_health_reporting()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Elastic Beanstalk environment test-env-using-basic-health-reporting does not have enhanced health reporting enabled."
            )
            assert result[0].resource_id == environment["EnvironmentName"]
            assert result[0].resource_arn == environment["EnvironmentArn"]
            assert result[0].region == AWS_REGION_EU_WEST_1
```

--------------------------------------------------------------------------------

---[FILE: elasticbeanstalk_environment_managed_updates_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/elasticbeanstalk/elasticbeanstalk_environment_managed_updates_enabled/elasticbeanstalk_environment_managed_updates_enabled_test.py

```python
from unittest import mock

import botocore
from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.elasticbeanstalk.elasticbeanstalk_service import (
    ElasticBeanstalk,
)
from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "DescribeConfigurationSettings":
        return {
            "ConfigurationSettings": [
                {
                    "OptionSettings": [
                        {
                            "Namespace": "aws:elasticbeanstalk:managedactions",
                            "OptionName": "ManagedActionsEnabled",
                            "Value": "true",
                        },
                    ],
                }
            ]
        }

    return make_api_call(self, operation_name, kwarg)


def mock_make_api_call_v2(self, operation_name, kwarg):
    if operation_name == "DescribeConfigurationSettings":
        return {
            "ConfigurationSettings": [
                {
                    "OptionSettings": [
                        {
                            "Namespace": "aws:elasticbeanstalk:managedactions",
                            "OptionName": "ManagedActionsEnabled",
                            "Value": "false",
                        },
                    ],
                }
            ]
        }

    return make_api_call(self, operation_name, kwarg)


class Test_elasticbeanstalk_environment_managed_updates_enabled:
    @mock_aws
    def test_elasticbeanstalk_no_environments(self):
        elasticbeanstalk_client = client(
            "elasticbeanstalk", region_name=AWS_REGION_EU_WEST_1
        )
        elasticbeanstalk_client.create_application(ApplicationName="test-app")

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.elasticbeanstalk.elasticbeanstalk_environment_managed_updates_enabled.elasticbeanstalk_environment_managed_updates_enabled.elasticbeanstalk_client",
                new=ElasticBeanstalk(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.elasticbeanstalk.elasticbeanstalk_environment_managed_updates_enabled.elasticbeanstalk_environment_managed_updates_enabled import (
                elasticbeanstalk_environment_managed_updates_enabled,
            )

            check = elasticbeanstalk_environment_managed_updates_enabled()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_elasticbeanstalk_environments_enabled_autoupdate(self):
        elasticbeanstalk_client = client(
            "elasticbeanstalk", region_name=AWS_REGION_EU_WEST_1
        )
        elasticbeanstalk_client.create_application(ApplicationName="test-app")
        environment = elasticbeanstalk_client.create_environment(
            ApplicationName="test-app",
            EnvironmentName="test-env",
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.elasticbeanstalk.elasticbeanstalk_environment_managed_updates_enabled.elasticbeanstalk_environment_managed_updates_enabled.elasticbeanstalk_client",
                new=ElasticBeanstalk(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.elasticbeanstalk.elasticbeanstalk_environment_managed_updates_enabled.elasticbeanstalk_environment_managed_updates_enabled import (
                elasticbeanstalk_environment_managed_updates_enabled,
            )

            check = elasticbeanstalk_environment_managed_updates_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Elastic Beanstalk environment test-env has managed platform updates enabled."
            )
            assert result[0].resource_id == environment["EnvironmentName"]
            assert result[0].resource_arn == environment["EnvironmentArn"]
            assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call_v2)
    def test_elasticbeanstalk_environments_not_enabled_autoupdate(self):
        elasticbeanstalk_client = client(
            "elasticbeanstalk", region_name=AWS_REGION_EU_WEST_1
        )
        elasticbeanstalk_client.create_application(ApplicationName="test-app")
        environment = elasticbeanstalk_client.create_environment(
            ApplicationName="test-app",
            EnvironmentName="test-env",
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.elasticbeanstalk.elasticbeanstalk_environment_managed_updates_enabled.elasticbeanstalk_environment_managed_updates_enabled.elasticbeanstalk_client",
                new=ElasticBeanstalk(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.elasticbeanstalk.elasticbeanstalk_environment_managed_updates_enabled.elasticbeanstalk_environment_managed_updates_enabled import (
                elasticbeanstalk_environment_managed_updates_enabled,
            )

            check = elasticbeanstalk_environment_managed_updates_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Elastic Beanstalk environment test-env does not have managed platform updates enabled."
            )
            assert result[0].resource_id == environment["EnvironmentName"]
            assert result[0].resource_arn == environment["EnvironmentArn"]
            assert result[0].region == AWS_REGION_EU_WEST_1
```

--------------------------------------------------------------------------------

````
