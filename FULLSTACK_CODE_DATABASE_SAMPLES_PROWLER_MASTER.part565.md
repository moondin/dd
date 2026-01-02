---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 565
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 565 of 867)

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

---[FILE: guardduty_eks_runtime_monitoring_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/guardduty/guardduty_eks_runtime_monitoring_enabled/guardduty_eks_runtime_monitoring_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.guardduty.guardduty_service import GuardDuty
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_guardduty_eks_runtime_monitoring_enabled:
    @mock_aws
    def test_no_detectors(self):
        client("guardduty", region_name=AWS_REGION_US_EAST_1)

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.guardduty.guardduty_eks_runtime_monitoring_enabled.guardduty_eks_runtime_monitoring_enabled.guardduty_client",
                new=GuardDuty(aws_provider),
            ),
        ):

            from prowler.providers.aws.services.guardduty.guardduty_eks_runtime_monitoring_enabled.guardduty_eks_runtime_monitoring_enabled import (
                guardduty_eks_runtime_monitoring_enabled,
            )

            check = guardduty_eks_runtime_monitoring_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_detector_disabled(self):
        guardduty_client = client("guardduty", region_name=AWS_REGION_US_EAST_1)
        guardduty_client.create_detector(
            Enable=False,
            DataSources={
                "S3Logs": {"Enable": True},
                "Kubernetes": {"AuditLogs": {"Enable": True}},
            },
            Features=[{"Name": "EKS_RUNTIME_MONITORING", "Status": "ENABLED"}],
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.guardduty.guardduty_eks_runtime_monitoring_enabled.guardduty_eks_runtime_monitoring_enabled.guardduty_client",
                new=GuardDuty(aws_provider),
            ),
        ):

            from prowler.providers.aws.services.guardduty.guardduty_eks_runtime_monitoring_enabled.guardduty_eks_runtime_monitoring_enabled import (
                guardduty_eks_runtime_monitoring_enabled,
            )

            check = guardduty_eks_runtime_monitoring_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_detector_enabled_eks_runtime_monitoring_disabled(self):
        guardduty_client = client("guardduty", region_name=AWS_REGION_US_EAST_1)
        response = guardduty_client.create_detector(
            Enable=True,
            DataSources={
                "S3Logs": {"Enable": True},
                "Kubernetes": {"AuditLogs": {"Enable": True}},
            },
            Features=[{"Name": "EKS_RUNTIME_MONITORING", "Status": "DISABLED"}],
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.guardduty.guardduty_eks_runtime_monitoring_enabled.guardduty_eks_runtime_monitoring_enabled.guardduty_client",
                new=GuardDuty(aws_provider),
            ),
        ):

            from prowler.providers.aws.services.guardduty.guardduty_eks_runtime_monitoring_enabled.guardduty_eks_runtime_monitoring_enabled import (
                guardduty_eks_runtime_monitoring_enabled,
            )

            check = guardduty_eks_runtime_monitoring_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"GuardDuty detector {response['DetectorId']} does not have EKS Runtime Monitoring enabled."
            )
            assert result[0].resource_id == response["DetectorId"]
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:guardduty:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:detector/{response['DetectorId']}"
            )
            assert result[0].resource_tags == []

    @mock_aws
    def test_detector_enabled_eks_runtime_monitoring_enabled(self):
        guardduty_client = client("guardduty", region_name=AWS_REGION_US_EAST_1)
        response = guardduty_client.create_detector(
            Enable=True,
            DataSources={
                "S3Logs": {"Enable": True},
                "Kubernetes": {"AuditLogs": {"Enable": True}},
            },
            Features=[{"Name": "EKS_RUNTIME_MONITORING", "Status": "ENABLED"}],
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.guardduty.guardduty_eks_runtime_monitoring_enabled.guardduty_eks_runtime_monitoring_enabled.guardduty_client",
                new=GuardDuty(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.guardduty.guardduty_eks_runtime_monitoring_enabled.guardduty_eks_runtime_monitoring_enabled import (
                guardduty_eks_runtime_monitoring_enabled,
            )

            check = guardduty_eks_runtime_monitoring_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"GuardDuty detector {response['DetectorId']} has EKS Runtime Monitoring enabled."
            )
            assert result[0].resource_id == response["DetectorId"]
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:guardduty:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:detector/{response['DetectorId']}"
            )
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: guardduty_is_enabled_fixer_test.py]---
Location: prowler-master/tests/providers/aws/services/guardduty/guardduty_is_enabled/guardduty_is_enabled_fixer_test.py

```python
from unittest import mock
from uuid import uuid4

import botocore
import botocore.client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

DETECTOR_ID = str(uuid4())
DETECTOR_ARN = f"arn:aws:guardduty:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:detector/{DETECTOR_ID}"

mock_make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call_create_detector_success(self, operation_name, kwarg):
    if operation_name == "CreateDetector":
        return {"DetectorId": DETECTOR_ID}
    elif operation_name == "GetDetector":
        return {"Status": "ENABLED"}
    return mock_make_api_call(self, operation_name, kwarg)


def mock_make_api_call_create_detector_failure(self, operation_name, kwarg):
    if operation_name == "CreateDetector":
        raise botocore.exceptions.ClientError(
            {
                "Error": {
                    "Code": "AccessDeniedException",
                    "Message": "User: arn:aws:iam::012345678901:user/test is not authorized to perform: guardduty:CreateDetector",
                }
            },
            "CreateDetector",
        )
    return mock_make_api_call(self, operation_name, kwarg)


class Test_guardduty_is_enabled_fixer:
    @mock_aws
    def test_guardduty_is_enabled_fixer(self):
        with mock.patch(
            "botocore.client.BaseClient._make_api_call",
            new=mock_make_api_call_create_detector_success,
        ):

            from prowler.providers.aws.services.guardduty.guardduty_service import (
                GuardDuty,
            )

            aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

            with (
                mock.patch(
                    "prowler.providers.common.provider.Provider.get_global_provider",
                    return_value=aws_provider,
                ),
                mock.patch(
                    "prowler.providers.aws.services.guardduty.guardduty_is_enabled.guardduty_is_enabled_fixer.guardduty_client",
                    new=GuardDuty(aws_provider),
                ),
            ):
                from prowler.providers.aws.services.guardduty.guardduty_is_enabled.guardduty_is_enabled_fixer import (
                    fixer,
                )

                assert fixer(AWS_REGION_EU_WEST_1)

    @mock_aws
    def test_guardduty_is_enabled_fixer_failure(self):
        with mock.patch(
            "botocore.client.BaseClient._make_api_call",
            new=mock_make_api_call_create_detector_failure,
        ):

            from prowler.providers.aws.services.guardduty.guardduty_service import (
                GuardDuty,
            )

            aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

            with (
                mock.patch(
                    "prowler.providers.common.provider.Provider.get_global_provider",
                    return_value=aws_provider,
                ),
                mock.patch(
                    "prowler.providers.aws.services.guardduty.guardduty_is_enabled.guardduty_is_enabled_fixer.guardduty_client",
                    new=GuardDuty(aws_provider),
                ),
            ):
                from prowler.providers.aws.services.guardduty.guardduty_is_enabled.guardduty_is_enabled_fixer import (
                    fixer,
                )

                assert not fixer(AWS_REGION_EU_WEST_1)
```

--------------------------------------------------------------------------------

---[FILE: guardduty_is_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/guardduty/guardduty_is_enabled/guardduty_is_enabled_test.py

```python
from unittest.mock import patch

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)


class Test_guardduty_is_enabled:
    @mock_aws
    def test_no_detectors(self):
        aws_provider = set_mocked_aws_provider()

        from prowler.providers.aws.services.guardduty.guardduty_service import GuardDuty

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.guardduty.guardduty_is_enabled.guardduty_is_enabled.guardduty_client",
                new=GuardDuty(aws_provider),
            ) as guardduty_client,
        ):
            from prowler.providers.aws.services.guardduty.guardduty_is_enabled.guardduty_is_enabled import (
                guardduty_is_enabled,
            )

            guardduty_client.detectors = []

            check = guardduty_is_enabled()
            results = check.execute()
            assert len(results) == 0

    @mock_aws
    def test_guardduty_enabled(self):
        guardduty_client = client("guardduty", region_name=AWS_REGION_EU_WEST_1)

        detector_id = guardduty_client.create_detector(Enable=True)["DetectorId"]

        aws_provider = set_mocked_aws_provider()

        from prowler.providers.aws.services.guardduty.guardduty_service import GuardDuty

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.guardduty.guardduty_is_enabled.guardduty_is_enabled.guardduty_client",
                new=GuardDuty(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.guardduty.guardduty_is_enabled.guardduty_is_enabled import (
                guardduty_is_enabled,
            )

            check = guardduty_is_enabled()
            results = check.execute()
            assert len(results) == 32
            for result in results:
                if result.region == AWS_REGION_EU_WEST_1:
                    assert result.status == "PASS"
                    assert (
                        result.status_extended
                        == f"GuardDuty detector {result.resource_id} enabled."
                    )
                    assert result.resource_id == detector_id
                    assert (
                        result.resource_arn
                        == f"arn:aws:guardduty:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:detector/{detector_id}"
                    )
                    assert result.resource_tags == []

    @mock_aws
    def test_guardduty_configured_but_suspended(self):
        guardduty_client = client("guardduty", region_name=AWS_REGION_EU_WEST_1)

        detector_id = guardduty_client.create_detector(Enable=False)["DetectorId"]

        aws_provider = set_mocked_aws_provider()

        from prowler.providers.aws.services.guardduty.guardduty_service import GuardDuty

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.guardduty.guardduty_is_enabled.guardduty_is_enabled.guardduty_client",
                new=GuardDuty(aws_provider),
            ) as mock_guardduty_client,
        ):
            from prowler.providers.aws.services.guardduty.guardduty_is_enabled.guardduty_is_enabled import (
                guardduty_is_enabled,
            )

            for detector in mock_guardduty_client.detectors:
                if detector.region == AWS_REGION_EU_WEST_1:
                    detector.status = False

            check = guardduty_is_enabled()
            results = check.execute()
            assert len(results) == 32
            for result in results:
                if result.region == AWS_REGION_EU_WEST_1:
                    assert result.status == "FAIL"
                    assert (
                        result.status_extended
                        == f"GuardDuty detector {result.resource_id} configured but suspended."
                    )
                    assert result.resource_id == detector_id
                    assert (
                        result.resource_arn
                        == f"arn:aws:guardduty:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:detector/{detector_id}"
                    )
                    assert result.resource_tags == []

    @mock_aws
    def test_guardduty_not_configured(self):
        guardduty_client = client("guardduty", region_name=AWS_REGION_EU_WEST_1)

        detector_id = guardduty_client.create_detector(Enable=False)["DetectorId"]

        aws_provider = set_mocked_aws_provider()

        from prowler.providers.aws.services.guardduty.guardduty_service import GuardDuty

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.guardduty.guardduty_is_enabled.guardduty_is_enabled.guardduty_client",
                new=GuardDuty(aws_provider),
            ) as mock_guardduty_client,
        ):
            from prowler.providers.aws.services.guardduty.guardduty_is_enabled.guardduty_is_enabled import (
                guardduty_is_enabled,
            )

            for detector in mock_guardduty_client.detectors:
                if detector.region == AWS_REGION_EU_WEST_1:
                    detector.status = None

            check = guardduty_is_enabled()
            results = check.execute()
            assert len(results) == 32
            for result in results:
                if result.region == AWS_REGION_EU_WEST_1:
                    assert result.status == "FAIL"
                    assert (
                        result.status_extended
                        == f"GuardDuty detector {result.resource_id} not configured."
                    )
                    assert result.resource_id == detector_id
                    assert (
                        result.resource_arn
                        == f"arn:aws:guardduty:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:detector/{detector_id}"
                    )
                    assert result.resource_tags == []

    @mock_aws
    def test_guardduty_not_configured_muted(self):
        guardduty_client = client("guardduty", region_name=AWS_REGION_EU_WEST_1)

        detector_id = guardduty_client.create_detector(Enable=False)["DetectorId"]

        aws_provider = set_mocked_aws_provider()

        from prowler.providers.aws.services.guardduty.guardduty_service import GuardDuty

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.guardduty.guardduty_is_enabled.guardduty_is_enabled.guardduty_client",
                new=GuardDuty(aws_provider),
            ) as mock_guardduty_client,
        ):
            from prowler.providers.aws.services.guardduty.guardduty_is_enabled.guardduty_is_enabled import (
                guardduty_is_enabled,
            )

            mock_guardduty_client.audit_config = {"mute_non_default_regions": True}

            check = guardduty_is_enabled()
            results = check.execute()
            assert len(results) == 32
            for result in results:
                if result.region == AWS_REGION_EU_WEST_1:
                    assert result.status == "FAIL"
                    assert result.muted
                    assert (
                        result.status_extended
                        == f"GuardDuty detector {result.resource_id} not configured."
                    )
                    assert result.resource_id == detector_id
                    assert (
                        result.resource_arn
                        == f"arn:aws:guardduty:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:detector/{detector_id}"
                    )
                    assert result.resource_tags == []
                    assert result.muted
```

--------------------------------------------------------------------------------

---[FILE: guardduty_lambda_protection_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/guardduty/guardduty_lambda_protection_enabled/guardduty_lambda_protection_enabled_test.py

```python
from unittest.mock import patch

import botocore
from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

orig = botocore.client.BaseClient._make_api_call


class Test_guardduty_lambda_protection_enabled:
    def test_no_detectors(self):
        aws_provider = set_mocked_aws_provider()

        from prowler.providers.aws.services.guardduty.guardduty_service import GuardDuty

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.guardduty.guardduty_lambda_protection_enabled.guardduty_lambda_protection_enabled.guardduty_client",
                new=GuardDuty(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.guardduty.guardduty_lambda_protection_enabled.guardduty_lambda_protection_enabled import (
                guardduty_lambda_protection_enabled,
            )

            check = guardduty_lambda_protection_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_detector_disabled(self):
        guardduty_client = client("guardduty", region_name=AWS_REGION_EU_WEST_1)

        guardduty_client.create_detector(Enable=False)

        aws_provider = set_mocked_aws_provider()

        from prowler.providers.aws.services.guardduty.guardduty_service import GuardDuty

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.guardduty.guardduty_lambda_protection_enabled.guardduty_lambda_protection_enabled.guardduty_client",
                new=GuardDuty(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.guardduty.guardduty_lambda_protection_enabled.guardduty_lambda_protection_enabled import (
                guardduty_lambda_protection_enabled,
            )

            check = guardduty_lambda_protection_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_detector_lambda_protection_enabled(self):
        guardduty_client = client("guardduty", region_name=AWS_REGION_EU_WEST_1)

        detector_id = guardduty_client.create_detector(
            Enable=True,
            Features=[{"Name": "LAMBDA_NETWORK_LOGS", "Status": "ENABLED"}],
        )["DetectorId"]

        aws_provider = set_mocked_aws_provider()

        from prowler.providers.aws.services.guardduty.guardduty_service import GuardDuty

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.guardduty.guardduty_lambda_protection_enabled.guardduty_lambda_protection_enabled.guardduty_client",
                new=GuardDuty(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.guardduty.guardduty_lambda_protection_enabled.guardduty_lambda_protection_enabled import (
                guardduty_lambda_protection_enabled,
            )

            check = guardduty_lambda_protection_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"GuardDuty detector {detector_id} has Lambda Protection enabled."
            )
            assert result[0].resource_id == detector_id
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:guardduty:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:detector/{detector_id}"
            )
            assert result[0].resource_tags == []

    @mock_aws
    def test_detector_lambda_protection_disabled(self):
        guardduty_client = client("guardduty", region_name=AWS_REGION_EU_WEST_1)

        detector_id = guardduty_client.create_detector(
            Enable=True,
            Features=[{"Name": "LAMBDA_NETWORK_LOGS", "Status": "DISABLED"}],
        )["DetectorId"]

        aws_provider = set_mocked_aws_provider()

        from prowler.providers.aws.services.guardduty.guardduty_service import GuardDuty

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.guardduty.guardduty_lambda_protection_enabled.guardduty_lambda_protection_enabled.guardduty_client",
                new=GuardDuty(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.guardduty.guardduty_lambda_protection_enabled.guardduty_lambda_protection_enabled import (
                guardduty_lambda_protection_enabled,
            )

            check = guardduty_lambda_protection_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"GuardDuty detector {detector_id} does not have Lambda Protection enabled."
            )
            assert result[0].resource_id == detector_id
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:guardduty:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:detector/{detector_id}"
            )
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: guardduty_no_high_severity_findings_test.py]---
Location: prowler-master/tests/providers/aws/services/guardduty/guardduty_no_high_severity_findings/guardduty_no_high_severity_findings_test.py

```python
from unittest.mock import patch

import botocore
from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

orig = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "ListFindings":
        return {
            "FindingIds": [
                "f1",
                "f2",
            ]
        }
    # If we don't want to patch the API call
    return orig(self, operation_name, kwarg)


class Test_guardduty_no_high_severity_findings:
    @mock_aws
    def test_no_detectors(self):
        aws_provider = set_mocked_aws_provider()

        from prowler.providers.aws.services.guardduty.guardduty_service import GuardDuty

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.guardduty.guardduty_no_high_severity_findings.guardduty_no_high_severity_findings.guardduty_client",
                new=GuardDuty(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.guardduty.guardduty_no_high_severity_findings.guardduty_no_high_severity_findings import (
                guardduty_no_high_severity_findings,
            )

            check = guardduty_no_high_severity_findings()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_no_high_findings(self):
        guardduty_client = client("guardduty", region_name=AWS_REGION_EU_WEST_1)

        detector_id = guardduty_client.create_detector(Enable=True)["DetectorId"]

        aws_provider = set_mocked_aws_provider()

        from prowler.providers.aws.services.guardduty.guardduty_service import GuardDuty

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.guardduty.guardduty_no_high_severity_findings.guardduty_no_high_severity_findings.guardduty_client",
                new=GuardDuty(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.guardduty.guardduty_no_high_severity_findings.guardduty_no_high_severity_findings import (
                guardduty_no_high_severity_findings,
            )

            check = guardduty_no_high_severity_findings()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"GuardDuty detector {detector_id} does not have high severity findings."
            )
            assert result[0].resource_id == detector_id
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:guardduty:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:detector/{detector_id}"
            )
            assert result[0].resource_tags == []

    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    @mock_aws
    def test_high_findings(self):
        guardduty_client = client("guardduty", region_name=AWS_REGION_EU_WEST_1)

        detector_id = guardduty_client.create_detector(Enable=True)["DetectorId"]

        aws_provider = set_mocked_aws_provider()

        from prowler.providers.aws.services.guardduty.guardduty_service import GuardDuty

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.guardduty.guardduty_no_high_severity_findings.guardduty_no_high_severity_findings.guardduty_client",
                new=GuardDuty(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.guardduty.guardduty_no_high_severity_findings.guardduty_no_high_severity_findings import (
                guardduty_no_high_severity_findings,
            )

            check = guardduty_no_high_severity_findings()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"GuardDuty detector {detector_id} has 2 high severity findings."
            )
            assert result[0].resource_id == detector_id
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:guardduty:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:detector/{detector_id}"
            )
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: guardduty_rds_protection_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/guardduty/guardduty_rds_protection_enabled/guardduty_rds_protection_enabled_test.py

```python
from unittest import mock

from prowler.providers.aws.services.guardduty.guardduty_service import Detector
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_US_EAST_1


class Test_guardduty_rds_protection_enabled:
    def test_no_detectors(self):
        guardduty_client = mock.MagicMock()
        guardduty_client.detectors = []

        with (
            mock.patch(
                "prowler.providers.aws.services.guardduty.guardduty_service.GuardDuty",
                new=guardduty_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.guardduty.guardduty_rds_protection_enabled.guardduty_rds_protection_enabled.guardduty_client",
                new=guardduty_client,
            ),
        ):

            from prowler.providers.aws.services.guardduty.guardduty_rds_protection_enabled.guardduty_rds_protection_enabled import (
                guardduty_rds_protection_enabled,
            )

            check = guardduty_rds_protection_enabled()
            result = check.execute()

            assert len(result) == 0

    def test_detector_disabled(self):
        guardduty_client = mock.MagicMock()
        detector_arn = f"arn:aws:guardduty:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:detector/1234567890"
        guardduty_client.detectors = [
            Detector(
                id="1234567890",
                arn=detector_arn,
                region=AWS_REGION_US_EAST_1,
                tags=[],
                enabled_in_account=False,
                rds_protection=False,
            )
        ]

        with (
            mock.patch(
                "prowler.providers.aws.services.guardduty.guardduty_service.GuardDuty",
                new=guardduty_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.guardduty.guardduty_rds_protection_enabled.guardduty_rds_protection_enabled.guardduty_client",
                new=guardduty_client,
            ),
        ):

            from prowler.providers.aws.services.guardduty.guardduty_rds_protection_enabled.guardduty_rds_protection_enabled import (
                guardduty_rds_protection_enabled,
            )

            check = guardduty_rds_protection_enabled()
            result = check.execute()

            assert len(result) == 0

    def test_detector_enabled_rds_protection_disabled(self):
        guardduty_client = mock.MagicMock()
        detector_arn = f"arn:aws:guardduty:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:detector/1234567890"
        guardduty_client.detectors = [
            Detector(
                id="1234567890",
                arn=detector_arn,
                region=AWS_REGION_US_EAST_1,
                tags=[],
                enabled_in_account=True,
                rds_protection=False,
                status=True,
            )
        ]

        with (
            mock.patch(
                "prowler.providers.aws.services.guardduty.guardduty_service.GuardDuty",
                new=guardduty_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.guardduty.guardduty_rds_protection_enabled.guardduty_rds_protection_enabled.guardduty_client",
                new=guardduty_client,
            ),
        ):

            from prowler.providers.aws.services.guardduty.guardduty_rds_protection_enabled.guardduty_rds_protection_enabled import (
                guardduty_rds_protection_enabled,
            )

            check = guardduty_rds_protection_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "GuardDuty detector does not have RDS Protection enabled."
            )
            assert result[0].resource_id == "1234567890"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_arn == detector_arn
            assert result[0].resource_tags == []

    def test_detector_enabled_rds_protection_enabled(self):
        guardduty_client = mock.MagicMock()
        detector_arn = f"arn:aws:guardduty:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:detector/1234567890"
        guardduty_client.detectors = [
            Detector(
                id="1234567890",
                arn=detector_arn,
                region=AWS_REGION_US_EAST_1,
                tags=[],
                enabled_in_account=True,
                rds_protection=True,
                status=True,
            )
        ]

        with (
            mock.patch(
                "prowler.providers.aws.services.guardduty.guardduty_service.GuardDuty",
                new=guardduty_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.guardduty.guardduty_rds_protection_enabled.guardduty_rds_protection_enabled.guardduty_client",
                new=guardduty_client,
            ),
        ):
            from prowler.providers.aws.services.guardduty.guardduty_rds_protection_enabled.guardduty_rds_protection_enabled import (
                guardduty_rds_protection_enabled,
            )

            check = guardduty_rds_protection_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "GuardDuty detector has RDS Protection enabled."
            )
            assert result[0].resource_id == "1234567890"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_arn == detector_arn
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

````
