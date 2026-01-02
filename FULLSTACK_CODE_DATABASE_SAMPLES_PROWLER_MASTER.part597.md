---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 597
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 597 of 867)

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

---[FILE: opensearch_service_domains_access_control_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/opensearch/opensearch_service_domains_access_control_enabled/opensearch_service_domains_access_control_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_opensearch_service_domains_access_control_enabled:
    @mock_aws
    def test_no_domains(self):
        client("opensearch", region_name=AWS_REGION_US_EAST_1)

        from prowler.providers.aws.services.opensearch.opensearch_service import (
            OpenSearchService,
        )

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_access_control_enabled.opensearch_service_domains_access_control_enabled.opensearch_client",
                new=OpenSearchService(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_access_control_enabled.opensearch_service_domains_access_control_enabled import (
                opensearch_service_domains_access_control_enabled,
            )

            check = opensearch_service_domains_access_control_enabled()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_no_fine_grained_access_enabled(self):
        opensearch_client = client("opensearch", region_name=AWS_REGION_US_EAST_1)
        domain = opensearch_client.create_domain(
            DomainName="test-domain",
            AdvancedSecurityOptions={"Enabled": False},
        )

        from prowler.providers.aws.services.opensearch.opensearch_service import (
            OpenSearchService,
        )

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_access_control_enabled.opensearch_service_domains_access_control_enabled.opensearch_client",
                new=OpenSearchService(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_access_control_enabled.opensearch_service_domains_access_control_enabled import (
                opensearch_service_domains_access_control_enabled,
            )

            check = opensearch_service_domains_access_control_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                f"Opensearch domain {domain['DomainStatus']['DomainName']} does not have fine grained access control enabled."
                == result[0].status_extended
            )
            assert result[0].resource_id == domain["DomainStatus"]["DomainName"]
            assert (
                result[0].resource_arn
                == f"arn:aws:es:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:domain/{domain['DomainStatus']['DomainName']}"
            )

    @mock_aws
    def test_fine_grained_access_enabled(self):
        opensearch_client = client("opensearch", region_name=AWS_REGION_US_EAST_1)
        domain = opensearch_client.create_domain(
            DomainName="test-domain",
            AdvancedSecurityOptions={"Enabled": True},
        )

        from prowler.providers.aws.services.opensearch.opensearch_service import (
            OpenSearchService,
        )

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_access_control_enabled.opensearch_service_domains_access_control_enabled.opensearch_client",
                new=OpenSearchService(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_access_control_enabled.opensearch_service_domains_access_control_enabled import (
                opensearch_service_domains_access_control_enabled,
            )

            check = opensearch_service_domains_access_control_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                f"Opensearch domain {domain['DomainStatus']['DomainName']} has fine grained access control enabled."
                == result[0].status_extended
            )
            assert result[0].resource_id == domain["DomainStatus"]["DomainName"]
            assert (
                result[0].resource_arn
                == f"arn:aws:es:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:domain/{domain['DomainStatus']['DomainName']}"
            )
```

--------------------------------------------------------------------------------

---[FILE: opensearch_service_domains_audit_logging_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/opensearch/opensearch_service_domains_audit_logging_enabled/opensearch_service_domains_audit_logging_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_opensearch_service_domains_audit_logging_enabled:
    @mock_aws
    def test_no_domains(self):
        client("opensearch", region_name=AWS_REGION_US_EAST_1)

        from prowler.providers.aws.services.opensearch.opensearch_service import (
            OpenSearchService,
        )

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_audit_logging_enabled.opensearch_service_domains_audit_logging_enabled.opensearch_client",
                new=OpenSearchService(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_audit_logging_enabled.opensearch_service_domains_audit_logging_enabled import (
                opensearch_service_domains_audit_logging_enabled,
            )

            check = opensearch_service_domains_audit_logging_enabled()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_no_logging_enabled(self):
        opensearch_client = client("opensearch", region_name=AWS_REGION_US_EAST_1)
        domain = opensearch_client.create_domain(
            DomainName="test-domain-no-logging",
            LogPublishingOptions={
                "SEARCH_SLOW_LOGS": {
                    "CloudWatchLogsLogGroupArn": "arn:aws:logs:us-east-1:123456789012:log-group:search-logs:*"
                },
            },
        )
        from prowler.providers.aws.services.opensearch.opensearch_service import (
            OpenSearchService,
        )

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_audit_logging_enabled.opensearch_service_domains_audit_logging_enabled.opensearch_client",
                new=OpenSearchService(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_audit_logging_enabled.opensearch_service_domains_audit_logging_enabled import (
                opensearch_service_domains_audit_logging_enabled,
            )

            check = opensearch_service_domains_audit_logging_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Opensearch domain test-domain-no-logging AUDIT_LOGS disabled."
            )
            assert result[0].resource_id == domain["DomainStatus"]["DomainName"]
            assert (
                result[0].resource_arn
                == f"arn:aws:es:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:domain/{domain['DomainStatus']['DomainName']}"
            )

    @mock_aws
    def test_logging_AUDIT_LOGS_enabled(self):
        opensearch_client = client("opensearch", region_name=AWS_REGION_US_EAST_1)
        domain = opensearch_client.create_domain(
            DomainName="test-domain-logging",
            LogPublishingOptions={
                "AUDIT_LOGS": {
                    "CloudWatchLogsLogGroupArn": "arn:aws:logs:us-east-1:123456789012:log-group:audit-logs:*",
                    "Enabled": True,
                },
            },
        )
        from prowler.providers.aws.services.opensearch.opensearch_service import (
            OpenSearchService,
        )

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_audit_logging_enabled.opensearch_service_domains_audit_logging_enabled.opensearch_client",
                new=OpenSearchService(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_audit_logging_enabled.opensearch_service_domains_audit_logging_enabled import (
                opensearch_service_domains_audit_logging_enabled,
            )

            check = opensearch_service_domains_audit_logging_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Opensearch domain test-domain-logging AUDIT_LOGS enabled."
            )
            assert result[0].resource_id == domain["DomainStatus"]["DomainName"]
            assert (
                result[0].resource_arn
                == f"arn:aws:es:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:domain/{domain['DomainStatus']['DomainName']}"
            )
```

--------------------------------------------------------------------------------

---[FILE: opensearch_service_domains_cloudwatch_logging_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/opensearch/opensearch_service_domains_cloudwatch_logging_enabled/opensearch_service_domains_cloudwatch_logging_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_opensearch_service_domains_cloudwatch_logging_enabled:
    @mock_aws
    def test_no_domains(self):
        client("opensearch", region_name=AWS_REGION_US_EAST_1)

        from prowler.providers.aws.services.opensearch.opensearch_service import (
            OpenSearchService,
        )

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_cloudwatch_logging_enabled.opensearch_service_domains_cloudwatch_logging_enabled.opensearch_client",
                new=OpenSearchService(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_cloudwatch_logging_enabled.opensearch_service_domains_cloudwatch_logging_enabled import (
                opensearch_service_domains_cloudwatch_logging_enabled,
            )

            check = opensearch_service_domains_cloudwatch_logging_enabled()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_no_logging_enabled(self):
        opensearch_client = client("opensearch", region_name=AWS_REGION_US_EAST_1)
        domain = opensearch_client.create_domain(
            DomainName="test-domain-no-logging",
            LogPublishingOptions={
                "AUDIT_LOGS": {
                    "CloudWatchLogsLogGroupArn": "arn:aws:logs:us-east-1:123456789012:log-group:search-logs:*",
                    "Enabled": True,
                },
            },
        )
        from prowler.providers.aws.services.opensearch.opensearch_service import (
            OpenSearchService,
        )

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_cloudwatch_logging_enabled.opensearch_service_domains_cloudwatch_logging_enabled.opensearch_client",
                new=OpenSearchService(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_cloudwatch_logging_enabled.opensearch_service_domains_cloudwatch_logging_enabled import (
                opensearch_service_domains_cloudwatch_logging_enabled,
            )

            check = opensearch_service_domains_cloudwatch_logging_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Opensearch domain test-domain-no-logging SEARCH_SLOW_LOGS and INDEX_SLOW_LOGS disabled."
            )
            assert result[0].resource_id == domain["DomainStatus"]["DomainName"]
            assert (
                result[0].resource_arn
                == f"arn:aws:es:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:domain/{domain['DomainStatus']['DomainName']}"
            )

    @mock_aws
    def test_logging_SEARCH_SLOW_LOGS_enabled(self):
        opensearch_client = client("opensearch", region_name=AWS_REGION_US_EAST_1)
        domain = opensearch_client.create_domain(
            DomainName="test-domain-no-index-logging",
            LogPublishingOptions={
                "SEARCH_SLOW_LOGS": {
                    "CloudWatchLogsLogGroupArn": "arn:aws:logs:us-east-1:123456789012:log-group:search-logs:*",
                    "Enabled": True,
                },
            },
        )
        from prowler.providers.aws.services.opensearch.opensearch_service import (
            OpenSearchService,
        )

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_cloudwatch_logging_enabled.opensearch_service_domains_cloudwatch_logging_enabled.opensearch_client",
                new=OpenSearchService(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_cloudwatch_logging_enabled.opensearch_service_domains_cloudwatch_logging_enabled import (
                opensearch_service_domains_cloudwatch_logging_enabled,
            )

            check = opensearch_service_domains_cloudwatch_logging_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Opensearch domain test-domain-no-index-logging SEARCH_SLOW_LOGS enabled but INDEX_SLOW_LOGS disabled."
            )
            assert result[0].resource_id == domain["DomainStatus"]["DomainName"]
            assert (
                result[0].resource_arn
                == f"arn:aws:es:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:domain/{domain['DomainStatus']['DomainName']}"
            )

    @mock_aws
    def test_logging_INDEX_SLOW_LOGS_enabled(self):
        opensearch_client = client("opensearch", region_name=AWS_REGION_US_EAST_1)
        domain = opensearch_client.create_domain(
            DomainName="test-domain-no-search-logging",
            LogPublishingOptions={
                "INDEX_SLOW_LOGS": {
                    "CloudWatchLogsLogGroupArn": "arn:aws:logs:us-east-1:123456789012:log-group:search-logs:*",
                    "Enabled": True,
                },
            },
        )
        from prowler.providers.aws.services.opensearch.opensearch_service import (
            OpenSearchService,
        )

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_cloudwatch_logging_enabled.opensearch_service_domains_cloudwatch_logging_enabled.opensearch_client",
                new=OpenSearchService(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_cloudwatch_logging_enabled.opensearch_service_domains_cloudwatch_logging_enabled import (
                opensearch_service_domains_cloudwatch_logging_enabled,
            )

            check = opensearch_service_domains_cloudwatch_logging_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Opensearch domain test-domain-no-search-logging INDEX_SLOW_LOGS enabled but SEARCH_SLOW_LOGS disabled."
            )
            assert result[0].resource_id == domain["DomainStatus"]["DomainName"]
            assert (
                result[0].resource_arn
                == f"arn:aws:es:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:domain/{domain['DomainStatus']['DomainName']}"
            )

    @mock_aws
    def test_logging_INDEX_SLOW_LOGS_and_SEARCH_SLOW_LOGS_enabled(self):
        opensearch_client = client("opensearch", region_name=AWS_REGION_US_EAST_1)
        domain = opensearch_client.create_domain(
            DomainName="test-domain-logging",
            LogPublishingOptions={
                "SEARCH_SLOW_LOGS": {
                    "CloudWatchLogsLogGroupArn": "arn:aws:logs:us-east-1:123456789012:log-group:search-logs:*",
                    "Enabled": True,
                },
                "INDEX_SLOW_LOGS": {
                    "CloudWatchLogsLogGroupArn": "arn:aws:logs:us-east-1:123456789012:log-group:search-logs:*",
                    "Enabled": True,
                },
            },
        )
        from prowler.providers.aws.services.opensearch.opensearch_service import (
            OpenSearchService,
        )

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_cloudwatch_logging_enabled.opensearch_service_domains_cloudwatch_logging_enabled.opensearch_client",
                new=OpenSearchService(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_cloudwatch_logging_enabled.opensearch_service_domains_cloudwatch_logging_enabled import (
                opensearch_service_domains_cloudwatch_logging_enabled,
            )

            check = opensearch_service_domains_cloudwatch_logging_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Opensearch domain test-domain-logging SEARCH_SLOW_LOGS and INDEX_SLOW_LOGS enabled."
            )
            assert result[0].resource_id == domain["DomainStatus"]["DomainName"]
            assert (
                result[0].resource_arn
                == f"arn:aws:es:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:domain/{domain['DomainStatus']['DomainName']}"
            )
```

--------------------------------------------------------------------------------

---[FILE: opensearch_service_domains_encryption_at_rest_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/opensearch/opensearch_service_domains_encryption_at_rest_enabled/opensearch_service_domains_encryption_at_rest_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_opensearch_service_domains_encryption_at_rest_enabled:
    @mock_aws
    def test_no_domains(self):
        client("opensearch", region_name=AWS_REGION_US_EAST_1)

        from prowler.providers.aws.services.opensearch.opensearch_service import (
            OpenSearchService,
        )

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_encryption_at_rest_enabled.opensearch_service_domains_encryption_at_rest_enabled.opensearch_client",
                new=OpenSearchService(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_encryption_at_rest_enabled.opensearch_service_domains_encryption_at_rest_enabled import (
                opensearch_service_domains_encryption_at_rest_enabled,
            )

            check = opensearch_service_domains_encryption_at_rest_enabled()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_no_encryption_at_rest_enabled(self):
        opensearch_client = client("opensearch", region_name=AWS_REGION_US_EAST_1)
        domain = opensearch_client.create_domain(
            DomainName="test-domain-no-encryption",
            EncryptionAtRestOptions={"Enabled": False},
        )
        from prowler.providers.aws.services.opensearch.opensearch_service import (
            OpenSearchService,
        )

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_encryption_at_rest_enabled.opensearch_service_domains_encryption_at_rest_enabled.opensearch_client",
                new=OpenSearchService(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_encryption_at_rest_enabled.opensearch_service_domains_encryption_at_rest_enabled import (
                opensearch_service_domains_encryption_at_rest_enabled,
            )

            check = opensearch_service_domains_encryption_at_rest_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Opensearch domain test-domain-no-encryption does not have encryption at-rest enabled."
            )
            assert result[0].resource_id == domain["DomainStatus"]["DomainName"]
            assert (
                result[0].resource_arn
                == f"arn:aws:es:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:domain/{domain['DomainStatus']['DomainName']}"
            )

    @mock_aws
    def test_encryption_at_rest_enabled(self):
        opensearch_client = client("opensearch", region_name=AWS_REGION_US_EAST_1)
        domain = opensearch_client.create_domain(
            DomainName="test-domain-encryption-at-rest",
            EncryptionAtRestOptions={"Enabled": True},
        )
        from prowler.providers.aws.services.opensearch.opensearch_service import (
            OpenSearchService,
        )

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_encryption_at_rest_enabled.opensearch_service_domains_encryption_at_rest_enabled.opensearch_client",
                new=OpenSearchService(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_encryption_at_rest_enabled.opensearch_service_domains_encryption_at_rest_enabled import (
                opensearch_service_domains_encryption_at_rest_enabled,
            )

            check = opensearch_service_domains_encryption_at_rest_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Opensearch domain test-domain-encryption-at-rest has encryption at-rest enabled."
            )
            assert result[0].resource_id == domain["DomainStatus"]["DomainName"]
            assert (
                result[0].resource_arn
                == f"arn:aws:es:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:domain/{domain['DomainStatus']['DomainName']}"
            )
```

--------------------------------------------------------------------------------

---[FILE: opensearch_service_domains_fault_tolerant_data_nodes_data_nodes_test.py]---
Location: prowler-master/tests/providers/aws/services/opensearch/opensearch_service_domains_fault_tolerant_data_nodes/opensearch_service_domains_fault_tolerant_data_nodes_data_nodes_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_opensearch_service_domains_fault_tolerant_data_nodes:
    @mock_aws
    def test_no_domains(self):
        client("opensearch", region_name=AWS_REGION_US_EAST_1)

        from prowler.providers.aws.services.opensearch.opensearch_service import (
            OpenSearchService,
        )

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_fault_tolerant_data_nodes.opensearch_service_domains_fault_tolerant_data_nodes.opensearch_client",
                new=OpenSearchService(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_fault_tolerant_data_nodes.opensearch_service_domains_fault_tolerant_data_nodes import (
                opensearch_service_domains_fault_tolerant_data_nodes,
            )

            check = opensearch_service_domains_fault_tolerant_data_nodes()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_instance_count_less_than_three_zoneawareness_enabled(self):
        opensearch_client = client("opensearch", region_name=AWS_REGION_US_EAST_1)
        domain = opensearch_client.create_domain(
            DomainName="test-domain",
            ClusterConfig={"ZoneAwarenessEnabled": True, "InstanceCount": 2},
        )

        from prowler.providers.aws.services.opensearch.opensearch_service import (
            OpenSearchService,
        )

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_fault_tolerant_data_nodes.opensearch_service_domains_fault_tolerant_data_nodes.opensearch_client",
                new=OpenSearchService(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_fault_tolerant_data_nodes.opensearch_service_domains_fault_tolerant_data_nodes import (
                opensearch_service_domains_fault_tolerant_data_nodes,
            )

            check = opensearch_service_domains_fault_tolerant_data_nodes()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Opensearch domain test-domain is not fault tolerant as it has cross-zone replication (Zone Awareness) enabled, but only 2 data nodes."
            )
            assert result[0].resource_id == domain["DomainStatus"]["DomainName"]
            assert (
                result[0].resource_arn
                == f"arn:aws:es:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:domain/{domain['DomainStatus']['DomainName']}"
            )

    @mock_aws
    def test_instance_count_more_than_three_zoneawareness_not_enabled(self):
        opensearch_client = client("opensearch", region_name=AWS_REGION_US_EAST_1)
        domain = opensearch_client.create_domain(
            DomainName="test-domain",
            ClusterConfig={"ZoneAwarenessEnabled": False, "InstanceCount": 3},
        )

        from prowler.providers.aws.services.opensearch.opensearch_service import (
            OpenSearchService,
        )

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_fault_tolerant_data_nodes.opensearch_service_domains_fault_tolerant_data_nodes.opensearch_client",
                new=OpenSearchService(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_fault_tolerant_data_nodes.opensearch_service_domains_fault_tolerant_data_nodes import (
                opensearch_service_domains_fault_tolerant_data_nodes,
            )

            check = opensearch_service_domains_fault_tolerant_data_nodes()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Opensearch domain test-domain is not fault tolerant as it has 3 data nodes, but cross-zone replication (Zone Awareness) is not enabled."
            )
            assert result[0].resource_id == domain["DomainStatus"]["DomainName"]
            assert (
                result[0].resource_arn
                == f"arn:aws:es:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:domain/{domain['DomainStatus']['DomainName']}"
            )

    @mock_aws
    def test_instance_count_less_than_three_zoneawareness_not_enabled(self):
        opensearch_client = client("opensearch", region_name=AWS_REGION_US_EAST_1)
        domain = opensearch_client.create_domain(
            DomainName="test-domain",
            ClusterConfig={"ZoneAwarenessEnabled": False, "InstanceCount": 2},
        )

        from prowler.providers.aws.services.opensearch.opensearch_service import (
            OpenSearchService,
        )

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_fault_tolerant_data_nodes.opensearch_service_domains_fault_tolerant_data_nodes.opensearch_client",
                new=OpenSearchService(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_fault_tolerant_data_nodes.opensearch_service_domains_fault_tolerant_data_nodes import (
                opensearch_service_domains_fault_tolerant_data_nodes,
            )

            check = opensearch_service_domains_fault_tolerant_data_nodes()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Opensearch domain test-domain is not fault tolerant as it has less than 3 data nodes and cross-zone replication (Zone Awareness) is not enabled."
            )
            assert result[0].resource_id == domain["DomainStatus"]["DomainName"]
            assert (
                result[0].resource_arn
                == f"arn:aws:es:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:domain/{domain['DomainStatus']['DomainName']}"
            )

    @mock_aws
    def test_logging_instance_count_more_than_three_zoneawareness_enabled(self):
        opensearch_client = client("opensearch", region_name=AWS_REGION_US_EAST_1)
        domain = opensearch_client.create_domain(
            DomainName="test-domain",
            ClusterConfig={"ZoneAwarenessEnabled": True, "InstanceCount": 3},
        )

        from prowler.providers.aws.services.opensearch.opensearch_service import (
            OpenSearchService,
        )

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_fault_tolerant_data_nodes.opensearch_service_domains_fault_tolerant_data_nodes.opensearch_client",
                new=OpenSearchService(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_fault_tolerant_data_nodes.opensearch_service_domains_fault_tolerant_data_nodes import (
                opensearch_service_domains_fault_tolerant_data_nodes,
            )

            check = opensearch_service_domains_fault_tolerant_data_nodes()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Opensearch domain test-domain is fault tolerant with 3 data nodes and cross-zone replication (Zone Awareness) enabled."
            )
            assert result[0].resource_id == domain["DomainStatus"]["DomainName"]
            assert (
                result[0].resource_arn
                == f"arn:aws:es:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:domain/{domain['DomainStatus']['DomainName']}"
            )
```

--------------------------------------------------------------------------------

````
