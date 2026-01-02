---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 476
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 476 of 867)

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

---[FILE: cloudwatch_log_group_kms_encryption_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/cloudwatch/cloudwatch_log_group_kms_encryption_enabled/cloudwatch_log_group_kms_encryption_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_cloudwatch_log_group_kms_encryption_enabled:
    def test_cloudwatch_no_log_groups(self):
        from prowler.providers.aws.services.cloudwatch.cloudwatch_service import Logs

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        from prowler.providers.common.models import Audit_Metadata

        aws_provider.audit_metadata = Audit_Metadata(
            services_scanned=0,
            # We need to set this check to call _describe_log_groups
            expected_checks=["cloudwatch_log_group_no_secrets_in_logs"],
            completed_checks=0,
            audit_progress=0,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudwatch.cloudwatch_log_group_kms_encryption_enabled.cloudwatch_log_group_kms_encryption_enabled.logs_client",
                new=Logs(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudwatch.cloudwatch_log_group_kms_encryption_enabled.cloudwatch_log_group_kms_encryption_enabled import (
                cloudwatch_log_group_kms_encryption_enabled,
            )

            check = cloudwatch_log_group_kms_encryption_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_cloudwatch_log_group_without_kms_key(self):
        # Generate Logs Client
        logs_client = client("logs", region_name=AWS_REGION_US_EAST_1)
        # Request Logs group
        logs_client.create_log_group(
            logGroupName="test",
        )

        from prowler.providers.aws.services.cloudwatch.cloudwatch_service import Logs

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        from prowler.providers.common.models import Audit_Metadata

        aws_provider.audit_metadata = Audit_Metadata(
            services_scanned=0,
            # We need to set this check to call _describe_log_groups
            expected_checks=["cloudwatch_log_group_no_secrets_in_logs"],
            completed_checks=0,
            audit_progress=0,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudwatch.cloudwatch_log_group_kms_encryption_enabled.cloudwatch_log_group_kms_encryption_enabled.logs_client",
                new=Logs(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudwatch.cloudwatch_log_group_kms_encryption_enabled.cloudwatch_log_group_kms_encryption_enabled import (
                cloudwatch_log_group_kms_encryption_enabled,
            )

            check = cloudwatch_log_group_kms_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Log Group test does not have AWS KMS keys associated."
            )
            assert result[0].resource_id == "test"

    @mock_aws
    def test_cloudwatch_log_group_with_kms_key(self):
        # Generate Logs Client
        logs_client = client("logs", region_name=AWS_REGION_US_EAST_1)
        # Request Logs group
        logs_client.create_log_group(logGroupName="test", kmsKeyId="test_kms_id")

        from prowler.providers.aws.services.cloudwatch.cloudwatch_service import Logs

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        from prowler.providers.common.models import Audit_Metadata

        aws_provider.audit_metadata = Audit_Metadata(
            services_scanned=0,
            # We need to set this check to call _describe_log_groups
            expected_checks=["cloudwatch_log_group_no_secrets_in_logs"],
            completed_checks=0,
            audit_progress=0,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudwatch.cloudwatch_log_group_kms_encryption_enabled.cloudwatch_log_group_kms_encryption_enabled.logs_client",
                new=Logs(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudwatch.cloudwatch_log_group_kms_encryption_enabled.cloudwatch_log_group_kms_encryption_enabled import (
                cloudwatch_log_group_kms_encryption_enabled,
            )

            check = cloudwatch_log_group_kms_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Log Group test does have AWS KMS key test_kms_id associated."
            )
            assert result[0].resource_id == "test"

    @mock_aws
    def test_access_denied(self):
        from prowler.providers.aws.services.cloudwatch.cloudwatch_service import Logs

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        from prowler.providers.common.models import Audit_Metadata

        aws_provider.audit_metadata = Audit_Metadata(
            services_scanned=0,
            # We need to set this check to call _describe_log_groups
            expected_checks=["cloudwatch_log_group_no_secrets_in_logs"],
            completed_checks=0,
            audit_progress=0,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudwatch.cloudwatch_log_group_kms_encryption_enabled.cloudwatch_log_group_kms_encryption_enabled.logs_client",
                new=Logs(aws_provider),
            ) as service_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudwatch.cloudwatch_log_group_kms_encryption_enabled.cloudwatch_log_group_kms_encryption_enabled import (
                cloudwatch_log_group_kms_encryption_enabled,
            )

            service_client.log_groups = None
            check = cloudwatch_log_group_kms_encryption_enabled()
            result = check.execute()

            assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: cloudwatch_log_group_not_publicly_accessible_test.py]---
Location: prowler-master/tests/providers/aws/services/cloudwatch/cloudwatch_log_group_not_publicly_accessible/cloudwatch_log_group_not_publicly_accessible_test.py

```python
import json
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_cloudwatch_log_group_not_publicly_accessible:
    @mock_aws
    def test_no_log_groups(self):
        from prowler.providers.aws.services.cloudwatch.cloudwatch_service import Logs

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudwatch.cloudwatch_log_group_not_publicly_accessible.cloudwatch_log_group_not_publicly_accessible.logs_client",
                new=Logs(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudwatch.cloudwatch_log_group_not_publicly_accessible.cloudwatch_log_group_not_publicly_accessible import (
                cloudwatch_log_group_not_publicly_accessible,
            )

            check = cloudwatch_log_group_not_publicly_accessible()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_log_group_not_publicly_accessible(self):
        # Generate Logs Client
        logs_client = client("logs", region_name=AWS_REGION_US_EAST_1)
        # Create Log Group without a public policy
        logs_client.create_log_group(
            logGroupName="test-log-group", tags={"test": "test"}
        )

        from prowler.providers.aws.services.cloudwatch.cloudwatch_service import Logs

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudwatch.cloudwatch_log_group_not_publicly_accessible.cloudwatch_log_group_not_publicly_accessible.logs_client",
                new=Logs(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudwatch.cloudwatch_log_group_not_publicly_accessible.cloudwatch_log_group_not_publicly_accessible import (
                cloudwatch_log_group_not_publicly_accessible,
            )

            check = cloudwatch_log_group_not_publicly_accessible()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Log Group test-log-group is not publicly accessible."
            )
            assert result[0].resource_id == "test-log-group"
            assert (
                result[0].resource_arn
                == f"arn:aws:logs:{AWS_REGION_US_EAST_1}:123456789012:log-group:test-log-group:*"
            )

    @mock_aws
    def test_log_group_publicly_accessible(self):
        # Generate Logs Client
        logs_client = client("logs", region_name=AWS_REGION_US_EAST_1)
        # Create Log Group with a public policy
        logs_client.create_log_group(
            logGroupName="test-log-group", tags={"test": "test"}
        )
        logs_client.put_resource_policy(
            policyName="PublicAccessPolicy",
            policyDocument=json.dumps(
                {
                    "Version": "2012-10-17",
                    "Statement": [
                        {
                            "Effect": "Allow",
                            "Principal": "*",
                            "Action": "logs:*",
                            "Resource": "*",
                        }
                    ],
                }
            ),
        )

        from prowler.providers.aws.services.cloudwatch.cloudwatch_service import Logs

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudwatch.cloudwatch_log_group_not_publicly_accessible.cloudwatch_log_group_not_publicly_accessible.logs_client",
                new=Logs(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudwatch.cloudwatch_log_group_not_publicly_accessible.cloudwatch_log_group_not_publicly_accessible import (
                cloudwatch_log_group_not_publicly_accessible,
            )

            check = cloudwatch_log_group_not_publicly_accessible()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Log Group test-log-group is publicly accessible."
            )
            assert result[0].resource_id == "test-log-group"
            assert (
                result[0].resource_arn
                == f"arn:aws:logs:{AWS_REGION_US_EAST_1}:123456789012:log-group:test-log-group:*"
            )

    @mock_aws
    def test_log_group_empty_principal(self):
        # Generate Logs Client
        logs_client = client("logs", region_name=AWS_REGION_US_EAST_1)
        # Create Log Group with a policy missing 'Principal'
        logs_client.create_log_group(
            logGroupName="test-log-group", tags={"test": "test"}
        )
        logs_client.put_resource_policy(
            policyName="LimitedAccessPolicy",
            policyDocument=json.dumps(
                {
                    "Version": "2012-10-17",
                    "Statement": [
                        {"Effect": "Allow", "Action": "logs:*", "Resource": "*"}
                    ],
                }
            ),
        )

        from prowler.providers.aws.services.cloudwatch.cloudwatch_service import Logs

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudwatch.cloudwatch_log_group_not_publicly_accessible.cloudwatch_log_group_not_publicly_accessible.logs_client",
                new=Logs(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudwatch.cloudwatch_log_group_not_publicly_accessible.cloudwatch_log_group_not_publicly_accessible import (
                cloudwatch_log_group_not_publicly_accessible,
            )

            check = cloudwatch_log_group_not_publicly_accessible()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Log Group test-log-group is not publicly accessible."
            )
            assert result[0].resource_id == "test-log-group"
            assert (
                result[0].resource_arn
                == f"arn:aws:logs:{AWS_REGION_US_EAST_1}:123456789012:log-group:test-log-group:*"
            )
```

--------------------------------------------------------------------------------

---[FILE: cloudwatch_log_group_no_secrets_in_logs_test.py]---
Location: prowler-master/tests/providers/aws/services/cloudwatch/cloudwatch_log_group_no_secrets_in_logs/cloudwatch_log_group_no_secrets_in_logs_test.py

```python
from datetime import datetime
from unittest import mock

from boto3 import client
from moto import mock_aws
from moto.core.utils import unix_time_millis

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

timestamp = int(unix_time_millis())
dttimestamp = (
    (datetime.fromtimestamp(timestamp / 1000))
    .astimezone()
    .isoformat(timespec="milliseconds")
)


class Test_cloudwatch_log_group_no_secrets_in_logs:
    def test_cloudwatch_no_log_groups(self):
        from prowler.providers.aws.services.cloudwatch.cloudwatch_service import Logs

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        from prowler.providers.common.models import Audit_Metadata

        aws_provider.audit_metadata = Audit_Metadata(
            services_scanned=0,
            # We need to set this check to call _describe_log_groups
            expected_checks=["cloudwatch_log_group_no_secrets_in_logs"],
            completed_checks=0,
            audit_progress=0,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudwatch.cloudwatch_log_group_no_secrets_in_logs.cloudwatch_log_group_no_secrets_in_logs.logs_client",
                new=Logs(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudwatch.cloudwatch_log_group_no_secrets_in_logs.cloudwatch_log_group_no_secrets_in_logs import (
                cloudwatch_log_group_no_secrets_in_logs,
            )

            check = cloudwatch_log_group_no_secrets_in_logs()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_cloudwatch_log_group_without_secrets(self):
        # Generate Logs Client
        logs_client = client("logs", region_name=AWS_REGION_US_EAST_1)
        # Request Logs group
        logs_client.create_log_group(logGroupName="test", tags={"test": "test"})
        logs_client.create_log_stream(logGroupName="test", logStreamName="test stream")
        logs_client.put_log_events(
            logGroupName="test",
            logStreamName="test stream",
            logEvents=[
                {
                    "timestamp": timestamp,
                    "message": "non sensitive message",
                }
            ],
        )
        from prowler.providers.aws.services.cloudwatch.cloudwatch_service import Logs

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        from prowler.providers.common.models import Audit_Metadata

        aws_provider.audit_metadata = Audit_Metadata(
            services_scanned=0,
            # We need to set this check to call _describe_log_groups
            expected_checks=["cloudwatch_log_group_no_secrets_in_logs"],
            completed_checks=0,
            audit_progress=0,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudwatch.cloudwatch_log_group_no_secrets_in_logs.cloudwatch_log_group_no_secrets_in_logs.logs_client",
                new=Logs(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudwatch.cloudwatch_log_group_no_secrets_in_logs.cloudwatch_log_group_no_secrets_in_logs import (
                cloudwatch_log_group_no_secrets_in_logs,
            )

            check = cloudwatch_log_group_no_secrets_in_logs()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == "No secrets found in test log group."
            assert result[0].resource_id == "test"
            assert (
                result[0].resource_arn
                == f"arn:aws:logs:{AWS_REGION_US_EAST_1}:123456789012:log-group:test:*"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == [{}]

    @mock_aws
    def test_cloudwatch_log_group_with_secrets(self):
        # Generate Logs Client
        logs_client = client("logs", region_name=AWS_REGION_US_EAST_1)
        # Request Logs group
        logs_client.create_log_group(logGroupName="test", tags={"test": "test"})
        logs_client.create_log_stream(logGroupName="test", logStreamName="test stream")
        logs_client.put_log_events(
            logGroupName="test",
            logStreamName="test stream",
            logEvents=[
                {
                    "timestamp": timestamp,
                    "message": "password = password123",
                }
            ],
        )
        from prowler.providers.aws.services.cloudwatch.cloudwatch_service import Logs

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        from prowler.providers.common.models import Audit_Metadata

        aws_provider.audit_metadata = Audit_Metadata(
            services_scanned=0,
            # We need to set this check to call _describe_log_groups
            expected_checks=["cloudwatch_log_group_no_secrets_in_logs"],
            completed_checks=0,
            audit_progress=0,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudwatch.cloudwatch_log_group_no_secrets_in_logs.cloudwatch_log_group_no_secrets_in_logs.logs_client",
                new=Logs(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudwatch.cloudwatch_log_group_no_secrets_in_logs.cloudwatch_log_group_no_secrets_in_logs import (
                cloudwatch_log_group_no_secrets_in_logs,
            )

            check = cloudwatch_log_group_no_secrets_in_logs()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Potential secrets found in log group test in log stream test stream at {dttimestamp} - Secret Keyword on line 1."
            )
            assert result[0].resource_id == "test"
            assert (
                result[0].resource_arn
                == f"arn:aws:logs:{AWS_REGION_US_EAST_1}:123456789012:log-group:test:*"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == [{}]

    @mock_aws
    def test_access_denied(self):
        from prowler.providers.aws.services.cloudwatch.cloudwatch_service import Logs

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        from prowler.providers.common.models import Audit_Metadata

        aws_provider.audit_metadata = Audit_Metadata(
            services_scanned=0,
            # We need to set this check to call _describe_log_groups
            expected_checks=["cloudwatch_log_group_no_secrets_in_logs"],
            completed_checks=0,
            audit_progress=0,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudwatch.cloudwatch_log_group_no_secrets_in_logs.cloudwatch_log_group_no_secrets_in_logs.logs_client",
                new=Logs(aws_provider),
            ) as logs_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudwatch.cloudwatch_log_group_no_secrets_in_logs.cloudwatch_log_group_no_secrets_in_logs import (
                cloudwatch_log_group_no_secrets_in_logs,
            )

            logs_client.log_groups = None
            check = cloudwatch_log_group_no_secrets_in_logs()
            result = check.execute()

            assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: cloudwatch_log_group_retention_policy_specific_days_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/cloudwatch/cloudwatch_log_group_retention_policy_specific_days_enabled/cloudwatch_log_group_retention_policy_specific_days_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_cloudwatch_log_group_retention_policy_specific_days_enabled:
    def test_cloudwatch_no_log_groups(self):
        from prowler.providers.aws.services.cloudwatch.cloudwatch_service import Logs

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        aws_provider._audit_config = {"log_group_retention_days": 365}

        from prowler.providers.common.models import Audit_Metadata

        aws_provider.audit_metadata = Audit_Metadata(
            services_scanned=0,
            # We need to set this check to call _describe_log_groups
            expected_checks=["cloudwatch_log_group_no_secrets_in_logs"],
            completed_checks=0,
            audit_progress=0,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudwatch.cloudwatch_log_group_retention_policy_specific_days_enabled.cloudwatch_log_group_retention_policy_specific_days_enabled.logs_client",
                new=Logs(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudwatch.cloudwatch_log_group_retention_policy_specific_days_enabled.cloudwatch_log_group_retention_policy_specific_days_enabled import (
                cloudwatch_log_group_retention_policy_specific_days_enabled,
            )

            check = cloudwatch_log_group_retention_policy_specific_days_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_cloudwatch_log_group_without_retention_days_never_expires(self):
        # Generate Logs Client
        logs_client = client("logs", region_name=AWS_REGION_US_EAST_1)
        # Request Logs group
        logs_client.create_log_group(
            logGroupName="test",
        )
        from prowler.providers.aws.services.cloudwatch.cloudwatch_service import Logs

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        aws_provider._audit_config = {"log_group_retention_days": 365}

        from prowler.providers.common.models import Audit_Metadata

        aws_provider.audit_metadata = Audit_Metadata(
            services_scanned=0,
            # We need to set this check to call _describe_log_groups
            expected_checks=["cloudwatch_log_group_no_secrets_in_logs"],
            completed_checks=0,
            audit_progress=0,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudwatch.cloudwatch_log_group_retention_policy_specific_days_enabled.cloudwatch_log_group_retention_policy_specific_days_enabled.logs_client",
                new=Logs(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudwatch.cloudwatch_log_group_retention_policy_specific_days_enabled.cloudwatch_log_group_retention_policy_specific_days_enabled import (
                cloudwatch_log_group_retention_policy_specific_days_enabled,
            )

            check = cloudwatch_log_group_retention_policy_specific_days_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Log Group test comply with 365 days retention period since it never expires."
            )
            assert result[0].resource_id == "test"
            assert (
                result[0].resource_arn
                == f"arn:aws:logs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:log-group:test:*"
            )
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_cloudwatch_log_group_with_compliant_retention_days(self):
        # Generate Logs Client
        logs_client = client("logs", region_name=AWS_REGION_US_EAST_1)
        # Request Logs group
        logs_client.create_log_group(
            logGroupName="test",
        )
        logs_client.put_retention_policy(logGroupName="test", retentionInDays=400)
        from prowler.providers.aws.services.cloudwatch.cloudwatch_service import Logs

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        aws_provider._audit_config = {"log_group_retention_days": 365}

        from prowler.providers.common.models import Audit_Metadata

        aws_provider.audit_metadata = Audit_Metadata(
            services_scanned=0,
            # We need to set this check to call _describe_log_groups
            expected_checks=["cloudwatch_log_group_no_secrets_in_logs"],
            completed_checks=0,
            audit_progress=0,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudwatch.cloudwatch_log_group_retention_policy_specific_days_enabled.cloudwatch_log_group_retention_policy_specific_days_enabled.logs_client",
                new=Logs(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudwatch.cloudwatch_log_group_retention_policy_specific_days_enabled.cloudwatch_log_group_retention_policy_specific_days_enabled import (
                cloudwatch_log_group_retention_policy_specific_days_enabled,
            )

            check = cloudwatch_log_group_retention_policy_specific_days_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Log Group test comply with 365 days retention period since it has 400 days."
            )
            assert result[0].resource_id == "test"
            assert (
                result[0].resource_arn
                == f"arn:aws:logs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:log-group:test:*"
            )
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_cloudwatch_log_group_with_no_compliant_retention_days(self):
        # Generate Logs Client
        logs_client = client("logs", region_name=AWS_REGION_US_EAST_1)
        # Request Logs group
        logs_client.create_log_group(
            logGroupName="test",
        )
        logs_client.put_retention_policy(logGroupName="test", retentionInDays=7)
        from prowler.providers.aws.services.cloudwatch.cloudwatch_service import Logs

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        aws_provider._audit_config = {"log_group_retention_days": 365}

        from prowler.providers.common.models import Audit_Metadata

        aws_provider.audit_metadata = Audit_Metadata(
            services_scanned=0,
            # We need to set this check to call _describe_log_groups
            expected_checks=["cloudwatch_log_group_no_secrets_in_logs"],
            completed_checks=0,
            audit_progress=0,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudwatch.cloudwatch_log_group_retention_policy_specific_days_enabled.cloudwatch_log_group_retention_policy_specific_days_enabled.logs_client",
                new=Logs(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudwatch.cloudwatch_log_group_retention_policy_specific_days_enabled.cloudwatch_log_group_retention_policy_specific_days_enabled import (
                cloudwatch_log_group_retention_policy_specific_days_enabled,
            )

            check = cloudwatch_log_group_retention_policy_specific_days_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Log Group test has less than 365 days retention period (7 days)."
            )
            assert result[0].resource_id == "test"
            assert (
                result[0].resource_arn
                == f"arn:aws:logs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:log-group:test:*"
            )
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_access_denied(self):
        # Generate Logs Client
        logs_client = client("logs", region_name=AWS_REGION_US_EAST_1)
        # Request Logs group
        logs_client.create_log_group(
            logGroupName="test",
        )
        logs_client.put_retention_policy(logGroupName="test", retentionInDays=7)
        from prowler.providers.aws.services.cloudwatch.cloudwatch_service import Logs

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        aws_provider._audit_config = {"log_group_retention_days": 365}

        from prowler.providers.common.models import Audit_Metadata

        aws_provider.audit_metadata = Audit_Metadata(
            services_scanned=0,
            # We need to set this check to call _describe_log_groups
            expected_checks=["cloudwatch_log_group_no_secrets_in_logs"],
            completed_checks=0,
            audit_progress=0,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudwatch.cloudwatch_log_group_retention_policy_specific_days_enabled.cloudwatch_log_group_retention_policy_specific_days_enabled.logs_client",
                new=Logs(aws_provider),
            ) as service_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudwatch.cloudwatch_log_group_retention_policy_specific_days_enabled.cloudwatch_log_group_retention_policy_specific_days_enabled import (
                cloudwatch_log_group_retention_policy_specific_days_enabled,
            )

            service_client.log_groups = None
            check = cloudwatch_log_group_retention_policy_specific_days_enabled()
            result = check.execute()

            assert len(result) == 0
```

--------------------------------------------------------------------------------

````
