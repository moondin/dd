---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 591
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 591 of 867)

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

---[FILE: mq_broker_auto_minor_version_upgrades_test.py]---
Location: prowler-master/tests/providers/aws/services/mq/mq_broker_auto_minor_version_upgrades/mq_broker_auto_minor_version_upgrades_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_mq_broker_auto_minor_version_upgrades:
    @mock_aws
    def test_no_brokers(self):
        from prowler.providers.aws.services.mq.mq_service import MQ

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.mq.mq_broker_auto_minor_version_upgrades.mq_broker_auto_minor_version_upgrades.mq_client",
                new=MQ(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.mq.mq_broker_auto_minor_version_upgrades.mq_broker_auto_minor_version_upgrades import (
                mq_broker_auto_minor_version_upgrades,
            )

            check = mq_broker_auto_minor_version_upgrades()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_broker_auto_minor_version_upgrades_enabled(self):
        mq_client = client("mq", region_name=AWS_REGION_US_EAST_1)
        broker_name = "test-broker"
        broker_id = mq_client.create_broker(
            BrokerName=broker_name,
            EngineType="ACTIVEMQ",
            EngineVersion="5.15.0",
            HostInstanceType="mq.t2.micro",
            Users=[
                {
                    "Username": "admin",
                    "Password": "admin",
                },
            ],
            DeploymentMode="SINGLE_INSTANCE",
            PubliclyAccessible=False,
            AutoMinorVersionUpgrade=True,
        )["BrokerId"]

        from prowler.providers.aws.services.mq.mq_service import MQ

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.mq.mq_broker_auto_minor_version_upgrades.mq_broker_auto_minor_version_upgrades.mq_client",
                new=MQ(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.mq.mq_broker_auto_minor_version_upgrades.mq_broker_auto_minor_version_upgrades import (
                mq_broker_auto_minor_version_upgrades,
            )

            check = mq_broker_auto_minor_version_upgrades()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"MQ Broker {broker_name} does have automated minor version upgrades enabled."
            )
            assert result[0].resource_id == broker_id
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:mq:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:broker:{broker_id}"
            )
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_broker_auto_minor_version_upgrades_disabled(self):
        mq_client = client("mq", region_name=AWS_REGION_US_EAST_1)
        broker_name = "test-broker"
        broker_id = mq_client.create_broker(
            BrokerName=broker_name,
            EngineType="ACTIVEMQ",
            EngineVersion="5.15.0",
            HostInstanceType="mq.t2.micro",
            Users=[
                {
                    "Username": "admin",
                    "Password": "admin",
                },
            ],
            DeploymentMode="SINGLE_INSTANCE",
            PubliclyAccessible=False,
            AutoMinorVersionUpgrade=False,
        )["BrokerId"]

        from prowler.providers.aws.services.mq.mq_service import MQ

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.mq.mq_broker_auto_minor_version_upgrades.mq_broker_auto_minor_version_upgrades.mq_client",
                new=MQ(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.mq.mq_broker_auto_minor_version_upgrades.mq_broker_auto_minor_version_upgrades import (
                mq_broker_auto_minor_version_upgrades,
            )

            check = mq_broker_auto_minor_version_upgrades()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"MQ Broker {broker_name} does not have automated minor version upgrades enabled."
            )
            assert result[0].resource_id == broker_id
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:mq:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:broker:{broker_id}"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
```

--------------------------------------------------------------------------------

---[FILE: mq_broker_cluster_deployment_mode_test.py]---
Location: prowler-master/tests/providers/aws/services/mq/mq_broker_cluster_deployment_mode/mq_broker_cluster_deployment_mode_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_mq_rabbitmq_broker_cluster_mode:
    @mock_aws
    def test_no_brokers(self):
        from prowler.providers.aws.services.mq.mq_service import MQ

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.mq.mq_broker_cluster_deployment_mode.mq_broker_cluster_deployment_mode.mq_client",
                new=MQ(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.mq.mq_broker_cluster_deployment_mode.mq_broker_cluster_deployment_mode import (
                    mq_broker_cluster_deployment_mode,
                )

                check = mq_broker_cluster_deployment_mode()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_no_rabbitmq_brokers(self):
        from prowler.providers.aws.services.mq.mq_service import MQ

        mq_client = client("mq", region_name=AWS_REGION_US_EAST_1)
        mq_client.create_broker(
            BrokerName="test-broker",
            EngineType="ACTIVEMQ",
            EngineVersion="5.15.0",
            HostInstanceType="mq.t2.micro",
            Users=[
                {
                    "Username": "admin",
                    "Password": "admin",
                },
            ],
            DeploymentMode="ACTIVE_STANDBY_MULTI_AZ",
            PubliclyAccessible=False,
            AutoMinorVersionUpgrade=True,
        )["BrokerId"]

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.mq.mq_broker_cluster_deployment_mode.mq_broker_cluster_deployment_mode.mq_client",
                new=MQ(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.mq.mq_broker_cluster_deployment_mode.mq_broker_cluster_deployment_mode import (
                    mq_broker_cluster_deployment_mode,
                )

                check = mq_broker_cluster_deployment_mode()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_rabbitmq_broker_cluster_mode_enabled(self):
        mq_client = client("mq", region_name=AWS_REGION_US_EAST_1)
        broker_name = "test-broker"
        broker_id = mq_client.create_broker(
            BrokerName="test-broker",
            EngineType="RABBITMQ",
            EngineVersion="5.15.0",
            HostInstanceType="mq.t2.micro",
            Users=[
                {
                    "Username": "admin",
                    "Password": "admin",
                },
            ],
            DeploymentMode="CLUSTER_MULTI_AZ",
            PubliclyAccessible=False,
            AutoMinorVersionUpgrade=True,
        )["BrokerId"]

        from prowler.providers.aws.services.mq.mq_service import MQ

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.mq.mq_broker_cluster_deployment_mode.mq_broker_cluster_deployment_mode.mq_client",
                new=MQ(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.mq.mq_broker_cluster_deployment_mode.mq_broker_cluster_deployment_mode import (
                    mq_broker_cluster_deployment_mode,
                )

                check = mq_broker_cluster_deployment_mode()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"MQ RabbitMQ Broker {broker_name} does have a cluster deployment mode."
                )
                assert result[0].resource_id == broker_id
                assert (
                    result[0].resource_arn
                    == f"arn:{aws_provider.identity.partition}:mq:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:broker:{broker_id}"
                )
                assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_rabbitmq_broker_active_standby_mode_disabled(self):
        mq_client = client("mq", region_name=AWS_REGION_US_EAST_1)
        broker_name = "test-broker"
        broker_id = mq_client.create_broker(
            BrokerName=broker_name,
            EngineType="RABBITMQ",
            EngineVersion="5.15.0",
            HostInstanceType="mq.t2.micro",
            Users=[
                {
                    "Username": "admin",
                    "Password": "admin",
                },
            ],
            DeploymentMode="SINGLE_INSTANCE",
            PubliclyAccessible=False,
            AutoMinorVersionUpgrade=False,
        )["BrokerId"]

        from prowler.providers.aws.services.mq.mq_service import MQ

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.mq.mq_broker_cluster_deployment_mode.mq_broker_cluster_deployment_mode.mq_client",
                new=MQ(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.mq.mq_broker_cluster_deployment_mode.mq_broker_cluster_deployment_mode import (
                    mq_broker_cluster_deployment_mode,
                )

                check = mq_broker_cluster_deployment_mode()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"MQ RabbitMQ Broker {broker_name} does not have a cluster deployment mode."
                )
                assert result[0].resource_id == broker_id
                assert (
                    result[0].resource_arn
                    == f"arn:{aws_provider.identity.partition}:mq:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:broker:{broker_id}"
                )
                assert result[0].region == AWS_REGION_US_EAST_1
```

--------------------------------------------------------------------------------

---[FILE: mq_broker_logging_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/mq/mq_broker_logging_enabled/mq_broker_logging_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_mq_broker_logging_enabled:
    @mock_aws
    def test_no_brokers(self):
        from prowler.providers.aws.services.mq.mq_service import MQ

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.mq.mq_broker_logging_enabled.mq_broker_logging_enabled.mq_client",
                new=MQ(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.mq.mq_broker_logging_enabled.mq_broker_logging_enabled import (
                mq_broker_logging_enabled,
            )

            check = mq_broker_logging_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_rabbitmq_broker_logging_enabled(self):
        mq_client = client("mq", region_name=AWS_REGION_US_EAST_1)
        broker_name = "test-broker"
        engine_type = "RABBITMQ"
        broker_id = mq_client.create_broker(
            BrokerName=broker_name,
            EngineType=engine_type,
            EngineVersion="5.15.0",
            HostInstanceType="mq.t2.micro",
            Users=[
                {
                    "Username": "admin",
                    "Password": "admin",
                },
            ],
            DeploymentMode="SINGLE_INSTANCE",
            PubliclyAccessible=False,
            AutoMinorVersionUpgrade=True,
            Logs={
                "General": True,
            },
        )["BrokerId"]

        from prowler.providers.aws.services.mq.mq_service import MQ

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.mq.mq_broker_logging_enabled.mq_broker_logging_enabled.mq_client",
                new=MQ(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.mq.mq_broker_logging_enabled.mq_broker_logging_enabled import (
                mq_broker_logging_enabled,
            )

            check = mq_broker_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"MQ Broker {broker_name} does have logging enabled."
            )
            assert result[0].resource_id == broker_id
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:mq:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:broker:{broker_id}"
            )
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_rabbitmq_broker_logging_disabled(self):
        mq_client = client("mq", region_name=AWS_REGION_US_EAST_1)
        broker_name = "test-broker"
        engine_type = "RABBITMQ"
        broker_id = mq_client.create_broker(
            BrokerName=broker_name,
            EngineType=engine_type,
            EngineVersion="5.15.0",
            HostInstanceType="mq.t2.micro",
            Users=[
                {
                    "Username": "admin",
                    "Password": "admin",
                },
            ],
            DeploymentMode="SINGLE_INSTANCE",
            PubliclyAccessible=False,
            AutoMinorVersionUpgrade=True,
            Logs={
                "General": False,
            },
        )["BrokerId"]

        from prowler.providers.aws.services.mq.mq_service import MQ

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.mq.mq_broker_logging_enabled.mq_broker_logging_enabled.mq_client",
                new=MQ(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.mq.mq_broker_logging_enabled.mq_broker_logging_enabled import (
                mq_broker_logging_enabled,
            )

            check = mq_broker_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"MQ Broker {broker_name} does not have logging enabled."
            )
            assert result[0].resource_id == broker_id
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:mq:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:broker:{broker_id}"
            )
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_activemq_broker_logging_enabled(self):
        mq_client = client("mq", region_name=AWS_REGION_US_EAST_1)
        broker_name = "test-broker"
        engine_type = "ACTIVEMQ"
        broker_id = mq_client.create_broker(
            BrokerName=broker_name,
            EngineType=engine_type,
            EngineVersion="5.15.0",
            HostInstanceType="mq.t2.micro",
            Users=[
                {
                    "Username": "admin",
                    "Password": "admin",
                },
            ],
            DeploymentMode="SINGLE_INSTANCE",
            PubliclyAccessible=False,
            AutoMinorVersionUpgrade=True,
            Logs={
                "General": True,
                "Audit": True,
            },
        )["BrokerId"]

        from prowler.providers.aws.services.mq.mq_service import MQ

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.mq.mq_broker_logging_enabled.mq_broker_logging_enabled.mq_client",
                new=MQ(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.mq.mq_broker_logging_enabled.mq_broker_logging_enabled import (
                mq_broker_logging_enabled,
            )

            check = mq_broker_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"MQ Broker {broker_name} does have logging enabled."
            )
            assert result[0].resource_id == broker_id
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:mq:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:broker:{broker_id}"
            )
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_activemq_broker_logging_disabled(self):
        mq_client = client("mq", region_name=AWS_REGION_US_EAST_1)
        broker_name = "test-broker"
        engine_type = "ACTIVEMQ"
        broker_id = mq_client.create_broker(
            BrokerName=broker_name,
            EngineType=engine_type,
            EngineVersion="5.15.0",
            HostInstanceType="mq.t2.micro",
            Users=[
                {
                    "Username": "admin",
                    "Password": "admin",
                },
            ],
            DeploymentMode="SINGLE_INSTANCE",
            PubliclyAccessible=False,
            AutoMinorVersionUpgrade=True,
            Logs={
                "General": True,
                "Audit": False,
            },
        )["BrokerId"]

        from prowler.providers.aws.services.mq.mq_service import MQ

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.mq.mq_broker_logging_enabled.mq_broker_logging_enabled.mq_client",
                new=MQ(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.mq.mq_broker_logging_enabled.mq_broker_logging_enabled import (
                mq_broker_logging_enabled,
            )

            check = mq_broker_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"MQ Broker {broker_name} does not have logging enabled."
            )
            assert result[0].resource_id == broker_id
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:mq:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:broker:{broker_id}"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
```

--------------------------------------------------------------------------------

---[FILE: mq_broker_not_publicly_accessible_test.py]---
Location: prowler-master/tests/providers/aws/services/mq/mq_broker_not_publicly_accessible/mq_broker_not_publicly_accessible_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_mq_broker_not_publicly_accessible:
    @mock_aws
    def test_no_brokers(self):
        from prowler.providers.aws.services.mq.mq_service import MQ

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.mq.mq_broker_not_publicly_accessible.mq_broker_not_publicly_accessible.mq_client",
                new=MQ(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.mq.mq_broker_not_publicly_accessible.mq_broker_not_publicly_accessible import (
                mq_broker_not_publicly_accessible,
            )

            check = mq_broker_not_publicly_accessible()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_broker_publicly_accessible(self):
        mq_client = client("mq", region_name=AWS_REGION_US_EAST_1)
        broker_name = "test-broker"
        broker_id = mq_client.create_broker(
            BrokerName=broker_name,
            EngineType="ACTIVEMQ",
            EngineVersion="5.15.0",
            HostInstanceType="mq.t2.micro",
            Users=[
                {
                    "Username": "admin",
                    "Password": "admin",
                },
            ],
            DeploymentMode="SINGLE_INSTANCE",
            PubliclyAccessible=True,
            AutoMinorVersionUpgrade=True,
        )["BrokerId"]

        from prowler.providers.aws.services.mq.mq_service import MQ

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.mq.mq_broker_not_publicly_accessible.mq_broker_not_publicly_accessible.mq_client",
                new=MQ(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.mq.mq_broker_not_publicly_accessible.mq_broker_not_publicly_accessible import (
                mq_broker_not_publicly_accessible,
            )

            check = mq_broker_not_publicly_accessible()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"MQ Broker {broker_name} is publicly accessible."
            )
            assert result[0].resource_id == broker_id
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:mq:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:broker:{broker_id}"
            )
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_broker_not_publicly_accessible(self):
        mq_client = client("mq", region_name=AWS_REGION_US_EAST_1)
        broker_name = "test-broker"
        broker_id = mq_client.create_broker(
            BrokerName=broker_name,
            EngineType="ACTIVEMQ",
            EngineVersion="5.15.0",
            HostInstanceType="mq.t2.micro",
            Users=[
                {
                    "Username": "admin",
                    "Password": "admin",
                },
            ],
            DeploymentMode="SINGLE_INSTANCE",
            PubliclyAccessible=False,
            AutoMinorVersionUpgrade=False,
        )["BrokerId"]

        from prowler.providers.aws.services.mq.mq_service import MQ

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.mq.mq_broker_not_publicly_accessible.mq_broker_not_publicly_accessible.mq_client",
                new=MQ(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.mq.mq_broker_not_publicly_accessible.mq_broker_not_publicly_accessible import (
                mq_broker_not_publicly_accessible,
            )

            check = mq_broker_not_publicly_accessible()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"MQ Broker {broker_name} is not publicly accessible."
            )
            assert result[0].resource_id == broker_id
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:mq:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:broker:{broker_id}"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
```

--------------------------------------------------------------------------------

---[FILE: neptune_service_test.py]---
Location: prowler-master/tests/providers/aws/services/neptune/neptune_service_test.py

```python
import botocore
from boto3 import client
from mock import patch
from moto import mock_aws

from prowler.providers.aws.services.neptune.neptune_service import (
    Cluster,
    ClusterSnapshot,
    Neptune,
)
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    AWS_REGION_US_EAST_1_AZA,
    AWS_REGION_US_EAST_1_AZB,
    set_mocked_aws_provider,
)

SUBNET_GROUP_NAME = "default"
SUBNET_1 = "subnet-1"
SUBNET_2 = "subnet-2"

NEPTUNE_CLUSTER_NAME = "test-cluster"
NEPTUNE_ENGINE = "neptune"

NEPTUNE_CLUSTER_TAGS = [
    {"Key": "environment", "Value": "test"},
]

# Mocking Access Analyzer Calls
make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwargs):
    """
    As you can see the operation_name has the list_analyzers snake_case form but
    we are using the ListAnalyzers form.
    Rationale -> https://github.com/boto/botocore/blob/develop/botocore/client.py#L810:L816

    We have to mock every AWS API call using Boto3
    """
    if operation_name == "DescribeDBSubnetGroups":
        return {
            "DBSubnetGroups": [
                {
                    "DBSubnetGroupName": SUBNET_GROUP_NAME,
                    "DBSubnetGroupDescription": "Subnet Group",
                    "VpcId": "vpc-1",
                    "SubnetGroupStatus": "Complete",
                    "Subnets": [
                        {
                            "SubnetIdentifier": "subnet-1",
                            "SubnetAvailabilityZone": {
                                "Name": AWS_REGION_US_EAST_1_AZA
                            },
                            "SubnetStatus": "Active",
                        },
                        {
                            "SubnetIdentifier": "subnet-2",
                            "SubnetAvailabilityZone": {
                                "Name": AWS_REGION_US_EAST_1_AZB
                            },
                            "SubnetStatus": "Active",
                        },
                    ],
                    "DBSubnetGroupArn": f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:subgrp:{SUBNET_GROUP_NAME}",
                }
            ]
        }
    if operation_name == "ListTagsForResource":
        return {"TagList": NEPTUNE_CLUSTER_TAGS}

    if operation_name == "DescribeDBClusterSnapshots":
        return {
            "DBClusterSnapshots": [
                {
                    "DBClusterSnapshotIdentifier": "test-cluster-snapshot",
                    "DBClusterIdentifier": NEPTUNE_CLUSTER_NAME,
                    "Engine": "docdb",
                    "Status": "available",
                    "StorageEncrypted": True,
                    "DBClusterSnapshotArn": f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster-snapshot:test-cluster-snapshot",
                    "TagList": [{"Key": "snapshot", "Value": "test"}],
                },
            ]
        }
    if operation_name == "DescribeDBClusterSnapshotAttributes":
        return {
            "DBClusterSnapshotAttributesResult": {
                "DBClusterSnapshotIdentifier": "test-cluster-snapshot",
                "DBClusterSnapshotAttributes": [
                    {"AttributeName": "restore", "AttributeValues": ["all"]}
                ],
            }
        }

    return make_api_call(self, operation_name, kwargs)


def mock_generate_regional_clients(provider, service):
    regional_client = provider._session.current_session.client(
        service, region_name=AWS_REGION_US_EAST_1
    )
    regional_client.region = AWS_REGION_US_EAST_1
    return {AWS_REGION_US_EAST_1: regional_client}


@patch(
    "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
    new=mock_generate_regional_clients,
)
# Patch every AWS call using Boto3
@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
class Test_Neptune_Service:
    # Test Neptune Service
    @mock_aws
    def test_service(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        neptune = Neptune(aws_provider)
        assert neptune.service == "neptune"

    # Test Neptune Client]
    @mock_aws
    def test_client(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        neptune = Neptune(aws_provider)
        assert neptune.client.__class__.__name__ == "Neptune"

    # Test Neptune Session
    @mock_aws
    def test__get_session__(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        neptune = Neptune(aws_provider)
        assert neptune.session.__class__.__name__ == "Session"

    # Test Neptune Session
    @mock_aws
    def test_audited_account(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        neptune = Neptune(aws_provider)
        assert neptune.audited_account == AWS_ACCOUNT_NUMBER

    # Test Neptune Get Neptune Contacts
    @mock_aws
    def test_describe_db_clusters(self):
        # Neptune client
        neptune_client = client("neptune", region_name=AWS_REGION_US_EAST_1)
        # Create Neptune Cluster
        cluster = neptune_client.create_db_cluster(
            AvailabilityZones=[AWS_REGION_US_EAST_1_AZA, AWS_REGION_US_EAST_1_AZB],
            BackupRetentionPeriod=1,
            CopyTagsToSnapshot=False,
            Engine=NEPTUNE_ENGINE,
            DatabaseName=NEPTUNE_CLUSTER_NAME,
            DBClusterIdentifier=NEPTUNE_CLUSTER_NAME,
            Port=123,
            StorageEncrypted=True,
            KmsKeyId="default_kms_key_id",
            Tags=NEPTUNE_CLUSTER_TAGS,
            EnableIAMDatabaseAuthentication=False,
            DeletionProtection=False,
        )["DBCluster"]

        cluster_arn = cluster["DBClusterArn"]
        cluster_id = cluster["DbClusterResourceId"]

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        neptune = Neptune(aws_provider)

        assert len(neptune.clusters) == 1
        assert neptune.clusters[cluster_arn]
        assert neptune.clusters[cluster_arn] == Cluster(
            arn=cluster_arn,
            name=NEPTUNE_CLUSTER_NAME,
            id=cluster_id,
            backup_retention_period=1,
            encrypted=True,
            kms_key="default_kms_key_id",
            multi_az=False,
            iam_auth=False,
            deletion_protection=False,
            region=AWS_REGION_US_EAST_1,
            db_subnet_group_id=SUBNET_GROUP_NAME,
            subnets=[SUBNET_1, SUBNET_2],
            tags=NEPTUNE_CLUSTER_TAGS,
            copy_tags_to_snapshot=False,
            cloudwatch_logs=[],
        )

    def test_describe_db_cluster_snapshots(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        neptune = Neptune(aws_provider)

        expected_snapshot = ClusterSnapshot(
            id="test-cluster-snapshot",
            arn=f"arn:aws:neptune:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster-snapshot:test-cluster-snapshot",
            cluster_id=NEPTUNE_CLUSTER_NAME,
            encrypted=True,
            region=AWS_REGION_US_EAST_1,
            tags=[{"Key": "snapshot", "Value": "test"}],
        )

        neptune.db_cluster_snapshots = [expected_snapshot]

        assert neptune.db_cluster_snapshots[0] == expected_snapshot

    def test_describe_db_cluster_snapshot_attributes(self):
        aws_provider = set_mocked_aws_provider()
        neptune = Neptune(aws_provider)
        neptune.db_cluster_snapshots = [
            ClusterSnapshot(
                id="test-cluster-snapshot",
                arn=f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster-snapshot:test-cluster-snapshot",
                cluster_id=NEPTUNE_CLUSTER_NAME,
                encrypted=True,
                region=AWS_REGION_US_EAST_1,
                tags=[{"Key": "snapshot", "Value": "test"}],
            )
        ]
        neptune._describe_db_cluster_snapshot_attributes(
            neptune.regional_clients[AWS_REGION_US_EAST_1]
        )
        assert neptune.db_cluster_snapshots[0].public is True
```

--------------------------------------------------------------------------------

````
