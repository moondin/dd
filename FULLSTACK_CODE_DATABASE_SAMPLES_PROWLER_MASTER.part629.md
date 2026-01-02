---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 629
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 629 of 867)

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

---[FILE: secretsmanager_secret_rotated_periodically_test.py]---
Location: prowler-master/tests/providers/aws/services/secretsmanager/secretsmanager_secret_rotated_periodically/secretsmanager_secret_rotated_periodically_test.py

```python
from datetime import datetime, timezone
from unittest.mock import patch

import botocore
from boto3 import client
from freezegun import freeze_time
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider

orig = botocore.client.BaseClient._make_api_call


def mock_make_api_call_secret_rotated_recently(self, operation_name, kwarg):
    if operation_name == "ListSecrets":
        return {
            "SecretList": [
                {
                    "ARN": "arn:aws:secretsmanager:eu-west-1:123456789012:secret:test-secret",
                    "Name": "test-secret",
                    "LastAccessedDate": datetime(
                        2023, 1, 1, 0, 0, 0, tzinfo=timezone.utc
                    ),
                    "LastRotatedDate": datetime(
                        2023, 4, 9, 0, 0, 0, tzinfo=timezone.utc
                    ),
                    "Tags": [{"Key": "Name", "Value": "test-secret"}],
                }
            ]
        }
    # If we don't want to patch the API call
    return orig(self, operation_name, kwarg)


def mock_make_api_call_secret_not_rotated_for_99_days(self, operation_name, kwarg):
    if operation_name == "ListSecrets":
        return {
            "SecretList": [
                {
                    "ARN": "arn:aws:secretsmanager:eu-west-1:123456789012:secret:test-secret",
                    "Name": "test-secret",
                    "LastAccessedDate": datetime(
                        2023, 1, 1, 0, 0, 0, tzinfo=timezone.utc
                    ),
                    "LastRotatedDate": datetime(
                        2023, 1, 1, 0, 0, 0, tzinfo=timezone.utc
                    ),
                    "Tags": [{"Key": "Name", "Value": "test-secret"}],
                }
            ]
        }
    # If we don't want to patch the API call
    return orig(self, operation_name, kwarg)


class Test_secretsmanager_secret_rotated_periodically:
    def test_no_secrets(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        from prowler.providers.aws.services.secretsmanager.secretsmanager_service import (
            SecretsManager,
        )

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.secretsmanager.secretsmanager_secret_rotated_periodically.secretsmanager_secret_rotated_periodically.secretsmanager_client",
                new=SecretsManager(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.secretsmanager.secretsmanager_secret_rotated_periodically.secretsmanager_secret_rotated_periodically import (
                secretsmanager_secret_rotated_periodically,
            )

            check = secretsmanager_secret_rotated_periodically()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_secret_never_rotated(self):
        secretsmanager_client = client(
            "secretsmanager", region_name=AWS_REGION_EU_WEST_1
        )

        secret_arn = secretsmanager_client.create_secret(
            Name="test-secret",
            Tags=[
                {"Key": "Name", "Value": "test-secret"},
            ],
        )["ARN"]

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        from prowler.providers.aws.services.secretsmanager.secretsmanager_service import (
            SecretsManager,
        )

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.secretsmanager.secretsmanager_secret_rotated_periodically.secretsmanager_secret_rotated_periodically.secretsmanager_client",
                new=SecretsManager(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.secretsmanager.secretsmanager_secret_rotated_periodically.secretsmanager_secret_rotated_periodically import (
                secretsmanager_secret_rotated_periodically,
            )

            check = secretsmanager_secret_rotated_periodically()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Secret test-secret has never been rotated."
            )
            assert result[0].resource_id == "test-secret"
            assert result[0].resource_arn == secret_arn
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == [{"Key": "Name", "Value": "test-secret"}]

    @freeze_time("2023-04-10")
    @patch(
        "botocore.client.BaseClient._make_api_call",
        new=mock_make_api_call_secret_not_rotated_for_99_days,
    )
    @mock_aws
    def test_secret_not_rotated_for_99_days(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        from prowler.providers.aws.services.secretsmanager.secretsmanager_service import (
            SecretsManager,
        )

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.secretsmanager.secretsmanager_secret_rotated_periodically.secretsmanager_secret_rotated_periodically.secretsmanager_client",
                new=SecretsManager(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.secretsmanager.secretsmanager_secret_rotated_periodically.secretsmanager_secret_rotated_periodically import (
                secretsmanager_secret_rotated_periodically,
            )

            check = secretsmanager_secret_rotated_periodically()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Secret test-secret has not been rotated in 99 days, which is more than the maximum allowed of 90 days."
            )
            assert result[0].resource_id == "test-secret"
            assert (
                result[0].resource_arn
                == "arn:aws:secretsmanager:eu-west-1:123456789012:secret:test-secret"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == [{"Key": "Name", "Value": "test-secret"}]

    @freeze_time("2023-04-10")
    @patch(
        "botocore.client.BaseClient._make_api_call",
        new=mock_make_api_call_secret_rotated_recently,
    )
    @mock_aws
    def test_secret_rotated_recently(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        from prowler.providers.aws.services.secretsmanager.secretsmanager_service import (
            SecretsManager,
        )

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.secretsmanager.secretsmanager_secret_rotated_periodically.secretsmanager_secret_rotated_periodically.secretsmanager_client",
                new=SecretsManager(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.secretsmanager.secretsmanager_secret_rotated_periodically.secretsmanager_secret_rotated_periodically import (
                secretsmanager_secret_rotated_periodically,
            )

            check = secretsmanager_secret_rotated_periodically()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Secret test-secret was last rotated on April 09, 2023."
            )
            assert result[0].resource_id == "test-secret"
            assert (
                result[0].resource_arn
                == "arn:aws:secretsmanager:eu-west-1:123456789012:secret:test-secret"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == [{"Key": "Name", "Value": "test-secret"}]
```

--------------------------------------------------------------------------------

---[FILE: secretsmanager_secret_unused_test.py]---
Location: prowler-master/tests/providers/aws/services/secretsmanager/secretsmanager_secret_unused/secretsmanager_secret_unused_test.py

```python
from datetime import datetime, timezone
from unittest.mock import patch

import botocore
from boto3 import client
from freezegun import freeze_time
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider

orig = botocore.client.BaseClient._make_api_call


def mock_make_api_call_secret_accessed_100_days_ago(self, operation_name, kwarg):
    if operation_name == "ListSecrets":
        return {
            "SecretList": [
                {
                    "ARN": "arn:aws:secretsmanager:eu-west-1:123456789012:secret:test-100-days-secret",
                    "Name": "test-100-days-secret",
                    "LastAccessedDate": datetime(
                        2023, 1, 1, 0, 0, 0, tzinfo=timezone.utc
                    ),
                    "LastRotatedDate": datetime(
                        2023, 4, 9, 0, 0, 0, tzinfo=timezone.utc
                    ),
                    "Tags": [{"Key": "Name", "Value": "test-100-days-secret"}],
                }
            ]
        }
    # If we don't want to patch the API call
    return orig(self, operation_name, kwarg)


def mock_make_api_call_secret_accessed_yesterday(self, operation_name, kwarg):
    if operation_name == "ListSecrets":
        return {
            "SecretList": [
                {
                    "ARN": "arn:aws:secretsmanager:eu-west-1:123456789012:secret:test-secret",
                    "Name": "test-secret",
                    "LastAccessedDate": datetime(
                        2023, 4, 9, 0, 0, 0, tzinfo=timezone.utc
                    ),
                    "LastRotatedDate": datetime(
                        2023, 4, 9, 0, 0, 0, tzinfo=timezone.utc
                    ),
                    "Tags": [{"Key": "Name", "Value": "test-secret"}],
                }
            ]
        }
    # If we don't want to patch the API call
    return orig(self, operation_name, kwarg)


class Test_secretsmanager_secret_unused:
    def test_no_secrets(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        from prowler.providers.aws.services.secretsmanager.secretsmanager_service import (
            SecretsManager,
        )

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.secretsmanager.secretsmanager_secret_unused.secretsmanager_secret_unused.secretsmanager_client",
                new=SecretsManager(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.secretsmanager.secretsmanager_secret_unused.secretsmanager_secret_unused import (
                secretsmanager_secret_unused,
            )

            check = secretsmanager_secret_unused()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_secret_never_used(self):
        secretsmanager_client = client(
            "secretsmanager", region_name=AWS_REGION_EU_WEST_1
        )

        secret_arn = secretsmanager_client.create_secret(
            Name="test-secret",
            Tags=[
                {"Key": "Name", "Value": "test-secret"},
            ],
        )["ARN"]

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        from prowler.providers.aws.services.secretsmanager.secretsmanager_service import (
            SecretsManager,
        )

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.secretsmanager.secretsmanager_secret_unused.secretsmanager_secret_unused.secretsmanager_client",
                new=SecretsManager(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.secretsmanager.secretsmanager_secret_unused.secretsmanager_secret_unused import (
                secretsmanager_secret_unused,
            )

            check = secretsmanager_secret_unused()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Secret test-secret has never been accessed."
            )
            assert result[0].resource_id == "test-secret"
            assert result[0].resource_arn == secret_arn
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == [{"Key": "Name", "Value": "test-secret"}]

    @freeze_time("2023-04-10")
    @patch(
        "botocore.client.BaseClient._make_api_call",
        new=mock_make_api_call_secret_accessed_100_days_ago,
    )
    @mock_aws
    def test_secret_unused_for_last_100_days(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        from prowler.providers.aws.services.secretsmanager.secretsmanager_service import (
            SecretsManager,
        )

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.secretsmanager.secretsmanager_secret_unused.secretsmanager_secret_unused.secretsmanager_client",
                new=SecretsManager(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.secretsmanager.secretsmanager_secret_unused.secretsmanager_secret_unused import (
                secretsmanager_secret_unused,
            )

            check = secretsmanager_secret_unused()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Secret test-100-days-secret has not been accessed since January 01, 2023, you should review if it is still needed."
            )
            assert result[0].resource_id == "test-100-days-secret"
            assert (
                result[0].resource_arn
                == "arn:aws:secretsmanager:eu-west-1:123456789012:secret:test-100-days-secret"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == [
                {"Key": "Name", "Value": "test-100-days-secret"}
            ]

    @freeze_time("2023-04-10")
    @patch(
        "botocore.client.BaseClient._make_api_call",
        new=mock_make_api_call_secret_accessed_yesterday,
    )
    @mock_aws
    def test_secret_used_yesterday(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        from prowler.providers.aws.services.secretsmanager.secretsmanager_service import (
            SecretsManager,
        )

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.secretsmanager.secretsmanager_secret_unused.secretsmanager_secret_unused.secretsmanager_client",
                new=SecretsManager(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.secretsmanager.secretsmanager_secret_unused.secretsmanager_secret_unused import (
                secretsmanager_secret_unused,
            )

            check = secretsmanager_secret_unused()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Secret test-secret has been accessed recently, last accessed on April 09, 2023."
            )
            assert result[0].resource_id == "test-secret"
            assert result[0].resource_arn == (
                "arn:aws:secretsmanager:eu-west-1:123456789012:secret:test-secret"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == [{"Key": "Name", "Value": "test-secret"}]
```

--------------------------------------------------------------------------------

---[FILE: securityhub_service_test.py]---
Location: prowler-master/tests/providers/aws/services/securityhub/securityhub_service_test.py

```python
from unittest.mock import patch

import botocore

from prowler.providers.aws.services.securityhub.securityhub_service import SecurityHub
from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider

# Mocking Access Analyzer Calls
make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    """
    We have to mock every AWS API call using Boto3

    As you can see the operation_name has the snake_case
    Rationale -> https://github.com/boto/botocore/blob/develop/botocore/client.py#L810:L816
    """
    if operation_name == "GetEnabledStandards":
        return {
            "StandardsSubscriptions": [
                {
                    "StandardsArn": "arn:aws:securityhub:::ruleset/cis-aws-foundations-benchmark/v/1.2.0",
                    "StandardsSubscriptionArn": "arn:aws:securityhub:us-east-1:0123456789012:subscription/cis-aws-foundations-benchmark/v/1.2.0",
                    "StandardsInput": {"string": "string"},
                    "StandardsStatus": "READY",
                },
            ]
        }
    if operation_name == "ListEnabledProductsForImport":
        return {
            "ProductSubscriptions": [
                "arn:aws:securityhub:us-east-1:0123456789012:product-subscription/prowler/prowler",
            ]
        }
    if operation_name == "DescribeHub":
        return {
            "HubArn": "arn:aws:securityhub:us-east-1:0123456789012:hub/default",
        }
    if operation_name == "ListTagsForResource":
        return {
            "Tags": {"test_key": "test_value"},
        }

    return make_api_call(self, operation_name, kwarg)


# Mock generate_regional_clients()
def mock_generate_regional_clients(provider, service):
    regional_client = provider._session.current_session.client(
        service, region_name=AWS_REGION_EU_WEST_1
    )
    regional_client.region = AWS_REGION_EU_WEST_1
    return {AWS_REGION_EU_WEST_1: regional_client}


# Patch every AWS call using Boto3 and generate_regional_clients to have 1 client
@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
@patch(
    "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
    new=mock_generate_regional_clients,
)
class Test_SecurityHub_Service:
    # Test SecurityHub Client
    def test_get_client(self):
        security_hub = SecurityHub(set_mocked_aws_provider([AWS_REGION_EU_WEST_1]))
        assert (
            security_hub.regional_clients[AWS_REGION_EU_WEST_1].__class__.__name__
            == "SecurityHub"
        )

    # Test SecurityHub Session
    def test__get_session__(self):
        security_hub = SecurityHub(set_mocked_aws_provider([AWS_REGION_EU_WEST_1]))
        assert security_hub.session.__class__.__name__ == "Session"

    def test_describe_hub(self):
        # Set partition for the service
        securityhub = SecurityHub(set_mocked_aws_provider([AWS_REGION_EU_WEST_1]))
        assert len(securityhub.securityhubs) == 1
        assert (
            securityhub.securityhubs[0].arn
            == "arn:aws:securityhub:us-east-1:0123456789012:hub/default"
        )
        assert securityhub.securityhubs[0].id == "default"
        assert securityhub.securityhubs[0].standards == "cis-aws-foundations-benchmark "
        assert securityhub.securityhubs[0].integrations == "prowler "

    def test_list_tags(self):
        # Set partition for the service
        securityhub = SecurityHub(set_mocked_aws_provider([AWS_REGION_EU_WEST_1]))
        assert len(securityhub.securityhubs) == 1
        assert securityhub.securityhubs[0].tags == [{"test_key": "test_value"}]
```

--------------------------------------------------------------------------------

---[FILE: securityhub_enabled_fixer_test.py]---
Location: prowler-master/tests/providers/aws/services/securityhub/securityhub_enabled/securityhub_enabled_fixer_test.py

```python
from unittest import mock

from moto import mock_aws

from prowler.providers.aws.services.securityhub.securityhub_service import (
    SecurityHubHub,
)
from tests.providers.aws.utils import AWS_REGION_EU_WEST_1


class test_securityhub_enabled_fixer:
    @mock_aws
    def test_securityhub_enabled_fixer(self):
        securityhub_client = mock.MagicMock
        securityhub_client.securityhubs = [
            SecurityHubHub(
                arn="arn:aws:securityhub:us-east-1:0123456789012:hub/default",
                id="default",
                status="ACTIVE",
                standards="cis-aws-foundations-benchmark/v/1.2.0",
                integrations="",
                region="eu-west-1",
            )
        ]
        with mock.patch(
            "prowler.providers.aws.services.securityhub.securityhub_service.SecurityHub",
            new=securityhub_client,
        ):
            # Test Check
            from prowler.providers.aws.services.securityhub.securityhub_enabled.securityhub_enabled_fixer import (
                fixer,
            )

            assert fixer(AWS_REGION_EU_WEST_1)
```

--------------------------------------------------------------------------------

---[FILE: securityhub_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/securityhub/securityhub_enabled/securityhub_enabled_test.py

```python
from unittest import mock

from prowler.providers.aws.services.securityhub.securityhub_service import (
    SecurityHubHub,
)
from tests.providers.aws.utils import AWS_REGION_EU_WEST_1


class Test_securityhub_enabled:
    def test_securityhub_hub_inactive(self):
        securityhub_client = mock.MagicMock
        securityhub_client.region = AWS_REGION_EU_WEST_1
        securityhub_client.get_unknown_arn = (
            lambda x: f"arn:aws:securityhub:{x}:0123456789012:hub/unknown"
        )
        securityhub_client.securityhubs = [
            SecurityHubHub(
                arn=f"arn:aws:securityhub:{AWS_REGION_EU_WEST_1}:0123456789012:hub/unknown",
                id="hub/unknown",
                status="NOT_AVAILABLE",
                standards="",
                integrations="",
                region=AWS_REGION_EU_WEST_1,
                tags=[{"test_key": "test_value"}],
            )
        ]
        with (
            mock.patch(
                "prowler.providers.aws.services.securityhub.securityhub_service.SecurityHub",
                new=securityhub_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.securityhub.securityhub_service.SecurityHub.get_unknown_arn",
                return_value="arn:aws:securityhub:eu-west-1:0123456789012:hub/unknown",
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.securityhub.securityhub_enabled.securityhub_enabled import (
                securityhub_enabled,
            )

            check = securityhub_enabled()
            result = check.execute()

            assert result[0].status == "FAIL"
            assert result[0].status_extended == "Security Hub is not enabled."
            assert result[0].resource_id == "hub/unknown"
            assert (
                result[0].resource_arn
                == "arn:aws:securityhub:eu-west-1:0123456789012:hub/unknown"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == [{"test_key": "test_value"}]

    def test_securityhub_hub_active_with_standards(self):
        securityhub_client = mock.MagicMock
        securityhub_client.securityhubs = [
            SecurityHubHub(
                arn="arn:aws:securityhub:us-east-1:0123456789012:hub/default",
                id="default",
                status="ACTIVE",
                standards="cis-aws-foundations-benchmark/v/1.2.0",
                integrations="",
                region=AWS_REGION_EU_WEST_1,
                tags=[{"test_key": "test_value"}],
            )
        ]
        with mock.patch(
            "prowler.providers.aws.services.securityhub.securityhub_service.SecurityHub",
            new=securityhub_client,
        ):
            # Test Check
            from prowler.providers.aws.services.securityhub.securityhub_enabled.securityhub_enabled import (
                securityhub_enabled,
            )

            check = securityhub_enabled()
            result = check.execute()

            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Security Hub is enabled with standards: cis-aws-foundations-benchmark/v/1.2.0."
            )
            assert result[0].resource_id == "default"
            assert (
                result[0].resource_arn
                == "arn:aws:securityhub:us-east-1:0123456789012:hub/default"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == [{"test_key": "test_value"}]

    def test_securityhub_hub_active_with_integrations(self):
        securityhub_client = mock.MagicMock
        securityhub_client.securityhubs = [
            SecurityHubHub(
                arn="arn:aws:securityhub:us-east-1:0123456789012:hub/default",
                id="default",
                status="ACTIVE",
                standards="",
                integrations="prowler",
                region=AWS_REGION_EU_WEST_1,
                tags=[{"test_key": "test_value"}],
            )
        ]
        with mock.patch(
            "prowler.providers.aws.services.securityhub.securityhub_service.SecurityHub",
            new=securityhub_client,
        ):
            # Test Check
            from prowler.providers.aws.services.securityhub.securityhub_enabled.securityhub_enabled import (
                securityhub_enabled,
            )

            check = securityhub_enabled()
            result = check.execute()

            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Security Hub is enabled without standards but with integrations: prowler."
            )
            assert result[0].resource_id == "default"
            assert (
                result[0].resource_arn
                == "arn:aws:securityhub:us-east-1:0123456789012:hub/default"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == [{"test_key": "test_value"}]

    def test_securityhub_hub_active_without_integrations_or_standards(self):
        securityhub_client = mock.MagicMock
        securityhub_client.region = AWS_REGION_EU_WEST_1
        securityhub_client.audited_partition = "aws"
        securityhub_client.audited_account = "0123456789012"
        securityhub_client.securityhubs = [
            SecurityHubHub(
                arn="arn:aws:securityhub:us-east-1:0123456789012:hub/default",
                id="default",
                status="ACTIVE",
                standards="",
                integrations="",
                region=AWS_REGION_EU_WEST_1,
                tags=[{"test_key": "test_value"}],
            )
        ]
        with mock.patch(
            "prowler.providers.aws.services.securityhub.securityhub_service.SecurityHub",
            new=securityhub_client,
        ):
            # Test Check
            from prowler.providers.aws.services.securityhub.securityhub_enabled.securityhub_enabled import (
                securityhub_enabled,
            )

            check = securityhub_enabled()
            result = check.execute()

            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Security Hub is enabled but without any standard or integration."
            )
            assert result[0].resource_id == "default"
            assert (
                result[0].resource_arn
                == "arn:aws:securityhub:us-east-1:0123456789012:hub/default"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == [{"test_key": "test_value"}]

    def test_securityhub_hub_active_without_integrations_or_standards_muted(self):
        securityhub_client = mock.MagicMock
        securityhub_client.audit_config = {"mute_non_default_regions": True}
        securityhub_client.region = AWS_REGION_EU_WEST_1
        securityhub_client.audited_partition = "aws"
        securityhub_client.audited_account = "0123456789012"
        securityhub_client.securityhubs = [
            SecurityHubHub(
                arn="arn:aws:securityhub:us-east-1:0123456789012:hub/default",
                id="default",
                status="ACTIVE",
                standards="",
                integrations="",
                region="eu-south-2",
                tags=[],
            )
        ]
        with mock.patch(
            "prowler.providers.aws.services.securityhub.securityhub_service.SecurityHub",
            new=securityhub_client,
        ):
            # Test Check
            from prowler.providers.aws.services.securityhub.securityhub_enabled.securityhub_enabled import (
                securityhub_enabled,
            )

            check = securityhub_enabled()
            result = check.execute()

            assert result[0].status == "FAIL"
            assert result[0].muted
            assert (
                result[0].status_extended
                == "Security Hub is enabled but without any standard or integration."
            )
            assert result[0].resource_id == "default"
            assert (
                result[0].resource_arn
                == "arn:aws:securityhub:us-east-1:0123456789012:hub/default"
            )
            assert result[0].region == "eu-south-2"
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: servicecatalog_service_test.py]---
Location: prowler-master/tests/providers/aws/services/servicecatalog/servicecatalog_service_test.py

```python
from unittest.mock import patch

import botocore
from moto import mock_aws

from prowler.providers.aws.services.servicecatalog.servicecatalog_service import (
    ServiceCatalog,
)
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "ListPortfolios":
        return {
            "PortfolioDetails": [
                {
                    "Id": "portfolio-id-test",
                    "ARN": "arn:aws:servicecatalog:eu-west-1:123456789012:portfolio/portfolio-id-test",
                    "DisplayName": "portfolio-name",
                }
            ],
        }
    elif operation_name == "DescribePortfolioShares":
        return {
            "PortfolioShareDetails": [
                {
                    "Type": "ACCOUNT",
                    "Accepted": True,
                }
            ],
        }
    elif operation_name == "DescribePortfolio":
        return {
            "Tags": {"tag1": "value1", "tag2": "value2"},
        }
    return make_api_call(self, operation_name, kwarg)


def mock_generate_regional_clients(provider, service):
    regional_client = provider._session.current_session.client(
        service, region_name=AWS_REGION_EU_WEST_1
    )
    regional_client.region = AWS_REGION_EU_WEST_1
    return {AWS_REGION_EU_WEST_1: regional_client}


@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
@patch(
    "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
    new=mock_generate_regional_clients,
)
class Test_ServiceCatalog_Service:
    # Test ServiceCatalog Service
    def test_service(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        service_catalog = ServiceCatalog(aws_provider)
        assert service_catalog.service == "servicecatalog"

    # Test ServiceCatalog client
    def test_client(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        service_catalog = ServiceCatalog(aws_provider)
        for reg_client in service_catalog.regional_clients.values():
            assert reg_client.__class__.__name__ == "ServiceCatalog"

    # Test ServiceCatalog session
    def test__get_session__(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        ses = ServiceCatalog(aws_provider)
        assert ses.session.__class__.__name__ == "Session"

    @mock_aws
    # Test ServiceCatalog list portfolios
    def test_list_portfolios(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        service_catalog = ServiceCatalog(aws_provider)
        arn = f"arn:aws:servicecatalog:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:portfolio/portfolio-id-test"
        assert service_catalog.portfolios[arn].name == "portfolio-name"
        assert service_catalog.portfolios[arn].id == "portfolio-id-test"
        assert service_catalog.portfolios[arn].arn == arn
        assert service_catalog.portfolios[arn].region == AWS_REGION_EU_WEST_1

    @mock_aws
    # Test ServiceCatalog describe portfolio shares
    def test_describe_portfolio_shares(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        service_catalog = ServiceCatalog(aws_provider)
        arn = f"arn:aws:servicecatalog:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:portfolio/portfolio-id-test"
        assert len(service_catalog.portfolios[arn].shares) == 4
        assert service_catalog.portfolios[arn].shares[0].accepted
        assert service_catalog.portfolios[arn].shares[0].type == "ACCOUNT"

    @mock_aws
    # Test ServiceCatalog describe portfolio
    def test_describe_portfolio(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        service_catalog = ServiceCatalog(aws_provider)
        arn = f"arn:aws:servicecatalog:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:portfolio/portfolio-id-test"
        assert service_catalog.portfolios[arn].tags == {
            "tag1": "value1",
            "tag2": "value2",
        }
```

--------------------------------------------------------------------------------

````
