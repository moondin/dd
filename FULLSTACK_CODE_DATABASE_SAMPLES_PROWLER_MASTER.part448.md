---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 448
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 448 of 867)

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

---[FILE: appsync_graphql_api_no_api_key_authentication_test.py]---
Location: prowler-master/tests/providers/aws/services/appsync/appsync_graphql_api_no_api_key_authentication/appsync_graphql_api_no_api_key_authentication_test.py

```python
from unittest import mock

import botocore
from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.appsync.appsync_service import AppSync
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

orig = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "ListGraphqlApis":
        return {
            "graphqlApis": [
                {
                    "name": "test-merged-api",
                    "apiId": "api_id",
                    "apiType": "MERGED",
                    "arn": f"arn:aws:appsync:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:graphqlapi/test-merged-api",
                    "authenticationType": "API_KEY",
                    "region": AWS_REGION_US_EAST_1,
                    "tags": {"test": "test", "test2": "test2"},
                },
            ]
        }
    return orig(self, operation_name, kwarg)


def mock_make_api_call_v2(self, operation_name, kwarg):
    if operation_name == "ListGraphqlApis":
        return {
            "graphqlApis": [
                {
                    "name": "test-graphql-no-api-key",
                    "apiId": "api_id",
                    "apiType": "GRAPHQL",
                    "arn": f"arn:aws:appsync:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:graphqlapi/test-graphql-no-api-key",
                    "authenticationType": "AWS_IAM",
                    "region": AWS_REGION_US_EAST_1,
                    "tags": {"test": "test", "test2": "test2"},
                },
            ]
        }
    return orig(self, operation_name, kwarg)


def mock_make_api_call_v3(self, operation_name, kwarg):
    if operation_name == "ListGraphqlApis":
        return {
            "graphqlApis": [
                {
                    "name": "test-graphql-api-key",
                    "apiId": "api_id",
                    "apiType": "GRAPHQL",
                    "arn": f"arn:aws:appsync:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:graphqlapi/test-graphql-api-key",
                    "authenticationType": "API_KEY",
                    "region": AWS_REGION_US_EAST_1,
                    "tags": {"test": "test", "test2": "test2"},
                },
            ]
        }
    return orig(self, operation_name, kwarg)


class Test_appsync_graphql_api_no_api_key_authentication:
    @mock_aws
    def test_no_apis(self):
        client("appsync", region_name=AWS_REGION_US_EAST_1)

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.appsync.appsync_graphql_api_no_api_key_authentication.appsync_graphql_api_no_api_key_authentication.appsync_client",
                new=AppSync(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.appsync.appsync_graphql_api_no_api_key_authentication.appsync_graphql_api_no_api_key_authentication import (
                appsync_graphql_api_no_api_key_authentication,
            )

            check = appsync_graphql_api_no_api_key_authentication()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_merged_api(self):

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.appsync.appsync_graphql_api_no_api_key_authentication.appsync_graphql_api_no_api_key_authentication.appsync_client",
                new=AppSync(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.appsync.appsync_graphql_api_no_api_key_authentication.appsync_graphql_api_no_api_key_authentication import (
                appsync_graphql_api_no_api_key_authentication,
            )

            check = appsync_graphql_api_no_api_key_authentication()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call_v2)
    def test_graphql_no_api_key(self):

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.appsync.appsync_graphql_api_no_api_key_authentication.appsync_graphql_api_no_api_key_authentication.appsync_client",
                new=AppSync(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.appsync.appsync_graphql_api_no_api_key_authentication.appsync_graphql_api_no_api_key_authentication import (
                appsync_graphql_api_no_api_key_authentication,
            )

            check = appsync_graphql_api_no_api_key_authentication()
            result = check.execute()

            assert len(result) == 1
            assert (
                result[0].resource_arn
                == f"arn:aws:appsync:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:graphqlapi/test-graphql-no-api-key"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == "api_id"
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "AppSync GraphQL API test-graphql-no-api-key is not using an API KEY for authentication."
            )
            assert result[0].resource_tags == [{"test": "test", "test2": "test2"}]

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call_v3)
    def test_graphql_api_key(self):

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.appsync.appsync_graphql_api_no_api_key_authentication.appsync_graphql_api_no_api_key_authentication.appsync_client",
                new=AppSync(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.appsync.appsync_graphql_api_no_api_key_authentication.appsync_graphql_api_no_api_key_authentication import (
                appsync_graphql_api_no_api_key_authentication,
            )

            check = appsync_graphql_api_no_api_key_authentication()
            result = check.execute()

            assert len(result) == 1
            assert (
                result[0].resource_arn
                == f"arn:aws:appsync:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:graphqlapi/test-graphql-api-key"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == "api_id"
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "AppSync GraphQL API test-graphql-api-key is using an API KEY for authentication."
            )
            assert result[0].resource_tags == [{"test": "test", "test2": "test2"}]
```

--------------------------------------------------------------------------------

---[FILE: athena_service_test.py]---
Location: prowler-master/tests/providers/aws/services/athena/athena_service_test.py

```python
from botocore.client import BaseClient
from mock import patch
from moto import mock_aws

from prowler.providers.aws.services.athena.athena_service import Athena
from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider

# Mocking Access Analyzer Calls
make_api_call = BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    """
    Mock every AWS API call using Boto3

    As you can see the operation_name has the get_work_group snake_case form but
    we are using the GetWorkGroup form.
    Rationale -> https://github.com/boto/botocore/blob/develop/botocore/client.py#L810:L816
    """
    if operation_name == "GetWorkGroup":
        return {
            "WorkGroup": {
                "Name": "primary",
                "State": "ENABLED",
                "Configuration": {
                    "ResultConfiguration": {
                        "EncryptionConfiguration": {
                            "EncryptionOption": "SSE_S3",
                        },
                    },
                    "EnforceWorkGroupConfiguration": True,
                    "PublishCloudWatchMetricsEnabled": True,
                },
            }
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
@patch(
    "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
    new=mock_generate_regional_clients,
)
class Test_Athena_Service:
    # Test Athena Get Workgrups
    @mock_aws
    def test_get_workgroupsnot_encrypted(self):
        default_workgroup_name = "primary"
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        workgroup_arn = f"arn:{aws_provider.identity.partition}:athena:{AWS_REGION_EU_WEST_1}:{aws_provider.identity.account}:workgroup/{default_workgroup_name}"
        athena = Athena(aws_provider)
        assert len(athena.workgroups) == 1
        assert athena.workgroups[workgroup_arn]
        assert athena.workgroups[workgroup_arn].arn == workgroup_arn
        assert athena.workgroups[workgroup_arn].name == default_workgroup_name
        assert athena.workgroups[workgroup_arn].region == AWS_REGION_EU_WEST_1
        assert athena.workgroups[workgroup_arn].tags == []
        assert (
            athena.workgroups[workgroup_arn].encryption_configuration.encrypted is False
        )
        assert (
            athena.workgroups[workgroup_arn].encryption_configuration.encryption_option
            == ""
        )
        assert athena.workgroups[workgroup_arn].enforce_workgroup_configuration is False

    # Test Athena Get Workgrups
    # We mock the get_work_group to return an encrypted workgroup
    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    @mock_aws
    def test_get_workgroupsencrypted(self):
        default_workgroup_name = "primary"
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        # Athena client
        # This API call is not implemented by Moto
        # athena_client = aws_provider.audit_session.client(
        #     "athena", region_name=AWS_REGION
        # )
        # athena_client.update_work_group(
        #     WorkGroup=default_workgroup_name,
        #     ConfigurationUpdates={
        #         "ResultConfigurationUpdates": {
        #             "EncryptionConfiguration": {"EncryptionOption": "SSE_S3"}
        #         }
        #     },
        # )

        workgroup_arn = f"arn:{aws_provider.identity.partition}:athena:{AWS_REGION_EU_WEST_1}:{aws_provider.identity.account}:workgroup/{default_workgroup_name}"
        athena = Athena(aws_provider)
        assert len(athena.workgroups) == 1
        assert athena.workgroups[workgroup_arn]
        assert athena.workgroups[workgroup_arn].arn == workgroup_arn
        assert athena.workgroups[workgroup_arn].name == default_workgroup_name
        assert athena.workgroups[workgroup_arn].region == AWS_REGION_EU_WEST_1
        assert athena.workgroups[workgroup_arn].tags == []
        assert (
            athena.workgroups[workgroup_arn].encryption_configuration.encrypted is True
        )
        assert (
            athena.workgroups[workgroup_arn].encryption_configuration.encryption_option
            == "SSE_S3"
        )
        assert athena.workgroups[workgroup_arn].enforce_workgroup_configuration is True
        assert athena.workgroups[workgroup_arn].cloudwatch_logging
```

--------------------------------------------------------------------------------

---[FILE: athena_workgroup_encryption_test.py]---
Location: prowler-master/tests/providers/aws/services/athena/athena_workgroup_encryption/athena_workgroup_encryption_test.py

```python
from unittest import mock

from mock import patch
from moto import mock_aws

from tests.providers.aws.services.athena.athena_service_test import mock_make_api_call
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

ATHENA_PRIMARY_WORKGROUP = "primary"
ATHENA_PRIMARY_WORKGROUP_ARN = f"arn:aws:athena:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:workgroup/{ATHENA_PRIMARY_WORKGROUP}"


class Test_athena_workgroup_encryption:
    @mock_aws
    def test_primary_workgroup_not_encrypted(self):
        from prowler.providers.aws.services.athena.athena_service import Athena

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.athena.athena_workgroup_encryption.athena_workgroup_encryption.athena_client",
                new=Athena(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.athena.athena_workgroup_encryption.athena_workgroup_encryption import (
                athena_workgroup_encryption,
            )

            check = athena_workgroup_encryption()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Athena WorkGroup {ATHENA_PRIMARY_WORKGROUP} does not encrypt the query results."
            )
            assert result[0].resource_id == ATHENA_PRIMARY_WORKGROUP
            assert result[0].resource_arn == ATHENA_PRIMARY_WORKGROUP_ARN
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_primary_workgroup_not_encrypted_ignoring(self):
        from prowler.providers.aws.services.athena.athena_service import Athena

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        aws_provider._scan_unused_services = False

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.athena.athena_workgroup_encryption.athena_workgroup_encryption.athena_client",
                new=Athena(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.athena.athena_workgroup_encryption.athena_workgroup_encryption import (
                athena_workgroup_encryption,
            )

            check = athena_workgroup_encryption()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    # We mock the get_work_group to return an encrypted workgroup
    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_primary_workgroup_encrypted(self):
        from prowler.providers.aws.services.athena.athena_service import Athena

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.athena.athena_workgroup_encryption.athena_workgroup_encryption.athena_client",
                new=Athena(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.athena.athena_workgroup_encryption.athena_workgroup_encryption import (
                athena_workgroup_encryption,
            )

            check = athena_workgroup_encryption()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Athena WorkGroup {ATHENA_PRIMARY_WORKGROUP} encrypts the query results using SSE_S3."
            )
            assert result[0].resource_id == ATHENA_PRIMARY_WORKGROUP
            assert result[0].resource_arn == ATHENA_PRIMARY_WORKGROUP_ARN
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: athena_workgroup_enforce_configuration_test.py]---
Location: prowler-master/tests/providers/aws/services/athena/athena_workgroup_enforce_configuration/athena_workgroup_enforce_configuration_test.py

```python
from unittest import mock

from mock import patch
from moto import mock_aws

from tests.providers.aws.services.athena.athena_service_test import mock_make_api_call
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

ATHENA_PRIMARY_WORKGROUP = "primary"
ATHENA_PRIMARY_WORKGROUP_ARN = f"arn:aws:athena:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:workgroup/{ATHENA_PRIMARY_WORKGROUP}"


class Test_athena_workgroup_enforce_configuration:
    @mock_aws
    def test_primary_workgroup_configuration_not_enforced(self):
        from prowler.providers.aws.services.athena.athena_service import Athena

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.athena.athena_workgroup_enforce_configuration.athena_workgroup_enforce_configuration.athena_client",
                new=Athena(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.athena.athena_workgroup_enforce_configuration.athena_workgroup_enforce_configuration import (
                athena_workgroup_enforce_configuration,
            )

            check = athena_workgroup_enforce_configuration()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Athena WorkGroup {ATHENA_PRIMARY_WORKGROUP} does not enforce the workgroup configuration, so it can be overridden by the client-side settings."
            )
            assert result[0].resource_id == ATHENA_PRIMARY_WORKGROUP
            assert result[0].resource_arn == ATHENA_PRIMARY_WORKGROUP_ARN
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_primary_workgroup_configuration_not_enforced_ignoring(self):
        from prowler.providers.aws.services.athena.athena_service import Athena

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        aws_provider._scan_unused_services = False

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.athena.athena_workgroup_enforce_configuration.athena_workgroup_enforce_configuration.athena_client",
                new=Athena(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.athena.athena_workgroup_enforce_configuration.athena_workgroup_enforce_configuration import (
                athena_workgroup_enforce_configuration,
            )

            check = athena_workgroup_enforce_configuration()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    # We mock the get_work_group to return a workgroup not enforcing configuration
    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_primary_workgroup_configuration_enforced(self):
        from prowler.providers.aws.services.athena.athena_service import Athena

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.athena.athena_workgroup_enforce_configuration.athena_workgroup_enforce_configuration.athena_client",
                new=Athena(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.athena.athena_workgroup_enforce_configuration.athena_workgroup_enforce_configuration import (
                athena_workgroup_enforce_configuration,
            )

            check = athena_workgroup_enforce_configuration()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Athena WorkGroup {ATHENA_PRIMARY_WORKGROUP} enforces the workgroup configuration, so it cannot be overridden by the client-side settings."
            )
            assert result[0].resource_id == ATHENA_PRIMARY_WORKGROUP
            assert result[0].resource_arn == ATHENA_PRIMARY_WORKGROUP_ARN
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: athena_workgroup_logging_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/athena/athena_workgroup_logging_enabled/athena_workgroup_logging_enabled_test.py

```python
from unittest.mock import patch

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

ATHENA_PRIMARY_WORKGROUP = "primary"
ATHENA_PRIMARY_WORKGROUP_ARN = f"arn:aws:athena:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:workgroup/{ATHENA_PRIMARY_WORKGROUP}"


class Test_athena_workgroup_logging_enabled:
    @mock_aws
    def test_primary_workgroup_logging_disabled(self):
        from prowler.providers.aws.services.athena.athena_service import Athena

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.athena.athena_workgroup_logging_enabled.athena_workgroup_logging_enabled.athena_client",
                new=Athena(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.athena.athena_workgroup_logging_enabled.athena_workgroup_logging_enabled import (
                athena_workgroup_logging_enabled,
            )

            check = athena_workgroup_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Athena WorkGroup {ATHENA_PRIMARY_WORKGROUP} does not have CloudWatch logging enabled."
            )
            assert result[0].resource_id == ATHENA_PRIMARY_WORKGROUP
            assert result[0].resource_arn == ATHENA_PRIMARY_WORKGROUP_ARN
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_primary_workgroup_logging_disabled_ignoring(self):
        from prowler.providers.aws.services.athena.athena_service import Athena

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        aws_provider._scan_unused_services = False

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.athena.athena_workgroup_logging_enabled.athena_workgroup_logging_enabled.athena_client",
                new=Athena(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.athena.athena_workgroup_logging_enabled.athena_workgroup_logging_enabled import (
                athena_workgroup_logging_enabled,
            )

            check = athena_workgroup_logging_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_primary_workgroup_logging_enabled(self):
        athena_client = client("athena", region_name=AWS_REGION_EU_WEST_1)

        # Delete and recreate the primary workgroup with logging enabled
        athena_client.delete_work_group(WorkGroup=ATHENA_PRIMARY_WORKGROUP)

        athena_client.create_work_group(
            Name=ATHENA_PRIMARY_WORKGROUP,
            Configuration={
                "ResultConfiguration": {
                    "OutputLocation": f"s3://aws-athena-query-results-{AWS_ACCOUNT_NUMBER}-{AWS_REGION_EU_WEST_1}/",
                    "EncryptionConfiguration": {"EncryptionOption": "SSE_S3"},
                },
                "EnforceWorkGroupConfiguration": False,
                "PublishCloudWatchMetricsEnabled": True,
                "BytesScannedCutoffPerQuery": 100000000,
                "RequesterPaysEnabled": False,
                "EngineVersion": {
                    "SelectedEngineVersion": "Athena engine version 2",
                    "EffectiveEngineVersion": "Athena engine version 2",
                },
            },
            Description="Primary WorkGroup",
        )

        from prowler.providers.aws.services.athena.athena_service import Athena

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.athena.athena_workgroup_logging_enabled.athena_workgroup_logging_enabled.athena_client",
                new=Athena(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.athena.athena_workgroup_logging_enabled.athena_workgroup_logging_enabled import (
                athena_workgroup_logging_enabled,
            )

            check = athena_workgroup_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Athena WorkGroup {ATHENA_PRIMARY_WORKGROUP} has CloudWatch logging enabled."
            )
            assert result[0].resource_id == ATHENA_PRIMARY_WORKGROUP
            assert result[0].resource_arn == ATHENA_PRIMARY_WORKGROUP_ARN
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

````
