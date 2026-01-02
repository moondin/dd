---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 561
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 561 of 867)

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

---[FILE: glacier_vaults_policy_public_access_test.py]---
Location: prowler-master/tests/providers/aws/services/glacier/glacier_vaults_policy_public_access/glacier_vaults_policy_public_access_test.py

```python
from unittest import mock

from prowler.providers.aws.services.glacier.glacier_service import Vault
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_EU_WEST_1


class Test_glacier_vaults_policy_public_access:
    def test_no_vaults(self):
        glacier_client = mock.MagicMock
        glacier_client.vaults = {}
        with (
            mock.patch(
                "prowler.providers.aws.services.glacier.glacier_service.Glacier",
                new=glacier_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.glacier.glacier_client.glacier_client",
                new=glacier_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glacier.glacier_vaults_policy_public_access.glacier_vaults_policy_public_access import (
                glacier_vaults_policy_public_access,
            )

            check = glacier_vaults_policy_public_access()
            result = check.execute()

            assert len(result) == 0

    def test_vault_no_policy(self):
        glacier_client = mock.MagicMock
        vault_name = "test-vault"
        vault_arn = f"arn:aws:glacier:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:vaults/examplevault"
        glacier_client.vaults = {
            vault_name: Vault(
                name=vault_name,
                arn=vault_arn,
                access_policy={},
                region=AWS_REGION_EU_WEST_1,
            )
        }
        with (
            mock.patch(
                "prowler.providers.aws.services.glacier.glacier_service.Glacier",
                new=glacier_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.glacier.glacier_client.glacier_client",
                new=glacier_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glacier.glacier_vaults_policy_public_access.glacier_vaults_policy_public_access import (
                glacier_vaults_policy_public_access,
            )

            check = glacier_vaults_policy_public_access()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == vault_name
            assert result[0].resource_arn == vault_arn
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Vault {vault_name} does not have a policy."
            )

    def test_vault_policy_pricipal_aws_list_asterisk(self):
        glacier_client = mock.MagicMock
        vault_name = "test-vault"
        vault_arn = f"arn:aws:glacier:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:vaults/examplevault"
        glacier_client.vaults = {
            vault_name: Vault(
                name=vault_name,
                arn=vault_arn,
                access_policy={
                    "Version": "2012-10-17",
                    "Statement": [
                        {
                            "Sid": "cross-account-upload",
                            "Principal": {"AWS": ["*", AWS_ACCOUNT_NUMBER]},
                            "Effect": "Allow",
                            "Action": [
                                "glacier:UploadArchive",
                                "glacier:InitiateMultipartUpload",
                                "glacier:AbortMultipartUpload",
                                "glacier:CompleteMultipartUpload",
                            ],
                            "Resource": [
                                f"arn:aws:glacier:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:vaults/examplevault"
                            ],
                        }
                    ],
                },
                region=AWS_REGION_EU_WEST_1,
            )
        }
        with (
            mock.patch(
                "prowler.providers.aws.services.glacier.glacier_service.Glacier",
                new=glacier_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.glacier.glacier_client.glacier_client",
                new=glacier_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glacier.glacier_vaults_policy_public_access.glacier_vaults_policy_public_access import (
                glacier_vaults_policy_public_access,
            )

            check = glacier_vaults_policy_public_access()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == vault_name
            assert result[0].resource_arn == vault_arn
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Vault {vault_name} has policy which allows access to everyone."
            )

    def test_vault_policy_pricipal_asterisk(self):
        glacier_client = mock.MagicMock
        vault_name = "test-vault"
        vault_arn = f"arn:aws:glacier:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:vaults/examplevault"
        glacier_client.vaults = {
            vault_name: Vault(
                name=vault_name,
                arn=vault_arn,
                access_policy={
                    "Version": "2012-10-17",
                    "Statement": [
                        {
                            "Sid": "cross-account-upload",
                            "Principal": {"AWS": ["*"]},
                            "Effect": "Allow",
                            "Action": [
                                "glacier:UploadArchive",
                                "glacier:InitiateMultipartUpload",
                                "glacier:AbortMultipartUpload",
                                "glacier:CompleteMultipartUpload",
                            ],
                            "Resource": [
                                f"arn:aws:glacier:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:vaults/examplevault"
                            ],
                        }
                    ],
                },
                region=AWS_REGION_EU_WEST_1,
            )
        }
        with (
            mock.patch(
                "prowler.providers.aws.services.glacier.glacier_service.Glacier",
                new=glacier_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.glacier.glacier_client.glacier_client",
                new=glacier_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glacier.glacier_vaults_policy_public_access.glacier_vaults_policy_public_access import (
                glacier_vaults_policy_public_access,
            )

            check = glacier_vaults_policy_public_access()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == vault_name
            assert result[0].resource_arn == vault_arn
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Vault {vault_name} has policy which allows access to everyone."
            )

    def test_vault_policy_pricipal_canonical_user_asterisk(self):
        glacier_client = mock.MagicMock
        vault_name = "test-vault"
        vault_arn = f"arn:aws:glacier:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:vaults/examplevault"
        glacier_client.vaults = {
            vault_name: Vault(
                name=vault_name,
                arn=vault_arn,
                access_policy={
                    "Version": "2012-10-17",
                    "Statement": [
                        {
                            "Sid": "cross-account-upload",
                            "Principal": {"CanonicalUser": ["*"]},
                            "Effect": "Allow",
                            "Action": [
                                "glacier:UploadArchive",
                                "glacier:InitiateMultipartUpload",
                                "glacier:AbortMultipartUpload",
                                "glacier:CompleteMultipartUpload",
                            ],
                            "Resource": [
                                f"arn:aws:glacier:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:vaults/examplevault"
                            ],
                        }
                    ],
                },
                region=AWS_REGION_EU_WEST_1,
            )
        }
        with (
            mock.patch(
                "prowler.providers.aws.services.glacier.glacier_service.Glacier",
                new=glacier_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.glacier.glacier_client.glacier_client",
                new=glacier_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glacier.glacier_vaults_policy_public_access.glacier_vaults_policy_public_access import (
                glacier_vaults_policy_public_access,
            )

            check = glacier_vaults_policy_public_access()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == vault_name
            assert result[0].resource_arn == vault_arn
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Vault {vault_name} has policy which allows access to everyone."
            )

    def test_vault_policy_private(self):
        glacier_client = mock.MagicMock
        vault_name = "test-vault"
        vault_arn = f"arn:aws:glacier:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:vaults/examplevault"
        glacier_client.vaults = {
            vault_name: Vault(
                name=vault_name,
                arn=vault_arn,
                access_policy={
                    "Version": "2012-10-17",
                    "Statement": [
                        {
                            "Sid": "cross-account-upload",
                            "Principal": {
                                "CanonicalUser": [
                                    f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root",
                                ]
                            },
                            "Effect": "Allow",
                            "Action": [
                                "glacier:UploadArchive",
                                "glacier:InitiateMultipartUpload",
                                "glacier:AbortMultipartUpload",
                                "glacier:CompleteMultipartUpload",
                            ],
                            "Resource": [
                                f"arn:aws:glacier:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:vaults/examplevault"
                            ],
                        }
                    ],
                },
                region=AWS_REGION_EU_WEST_1,
            )
        }
        with (
            mock.patch(
                "prowler.providers.aws.services.glacier.glacier_service.Glacier",
                new=glacier_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.glacier.glacier_client.glacier_client",
                new=glacier_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glacier.glacier_vaults_policy_public_access.glacier_vaults_policy_public_access import (
                glacier_vaults_policy_public_access,
            )

            check = glacier_vaults_policy_public_access()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == vault_name
            assert result[0].resource_arn == vault_arn
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Vault {vault_name} has policy which does not allow access to everyone."
            )
```

--------------------------------------------------------------------------------

---[FILE: globalaccelerator_service_test.py]---
Location: prowler-master/tests/providers/aws/services/globalaccelerator/globalaccelerator_service_test.py

```python
import botocore
from mock import patch
from moto import mock_aws

from prowler.providers.aws.services.globalaccelerator.globalaccelerator_service import (
    GlobalAccelerator,
)
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_WEST_2,
    set_mocked_aws_provider,
)

# Mocking Access Analyzer Calls
make_api_call = botocore.client.BaseClient._make_api_call

TEST_ACCELERATOR_ARN = f"arn:aws:globalaccelerator::{AWS_ACCOUNT_NUMBER}:accelerator/5555abcd-abcd-5555-abcd-5555EXAMPLE1"


def mock_make_api_call(self, operation_name, kwarg):
    """We have to mock every AWS API call using Boto3"""
    if operation_name == "ListAccelerators":
        return {
            "Accelerators": [
                {
                    "AcceleratorArn": TEST_ACCELERATOR_ARN,
                    "Name": "TestAccelerator",
                    "IpAddressType": "IPV4",
                    "Enabled": True,
                    "IpSets": [
                        {
                            "IpFamily": "IPv4",
                            "IpAddresses": ["192.0.2.250", "198.51.100.52"],
                        }
                    ],
                    "DnsName": "5a5a5a5a5a5a5a5a.awsglobalaccelerator.com",
                    "Status": "DEPLOYED",
                    "CreatedTime": 1552424416.0,
                    "LastModifiedTime": 1569375641.0,
                }
            ]
        }
    if operation_name == "GetSubscriptionState":
        return {"SubscriptionState": "ACTIVE"}
    if operation_name == "ListTagsForResource":
        return {"Tags": [{"Key": "Name", "Value": "TestAccelerator"}]}

    return make_api_call(self, operation_name, kwarg)


@mock_aws
# Patch every AWS call using Boto3 and generate_regional_clients to have 1 client
@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
class Test_GlobalAccelerator_Service:
    # Test GlobalAccelerator Service
    def test_service(self):
        # GlobalAccelerator client for this test class
        aws_provider = set_mocked_aws_provider()
        globalaccelerator = GlobalAccelerator(aws_provider)
        assert globalaccelerator.service == "globalaccelerator"

    # Test GlobalAccelerator Client
    def test_client(self):
        # GlobalAccelerator client for this test class
        aws_provider = set_mocked_aws_provider()
        globalaccelerator = GlobalAccelerator(aws_provider)
        assert globalaccelerator.client.__class__.__name__ == "GlobalAccelerator"

    # Test GlobalAccelerator Session
    def test__get_session__(self):
        # GlobalAccelerator client for this test class
        aws_provider = set_mocked_aws_provider()
        globalaccelerator = GlobalAccelerator(aws_provider)
        assert globalaccelerator.session.__class__.__name__ == "Session"

    def test_list_accelerators(self):
        # GlobalAccelerator client for this test class
        aws_provider = set_mocked_aws_provider()
        globalaccelerator = GlobalAccelerator(aws_provider)

        accelerator_name = "TestAccelerator"

        assert globalaccelerator.accelerators
        assert len(globalaccelerator.accelerators) == 1
        assert globalaccelerator.accelerators[TEST_ACCELERATOR_ARN]
        assert (
            globalaccelerator.accelerators[TEST_ACCELERATOR_ARN].name
            == accelerator_name
        )
        assert (
            globalaccelerator.accelerators[TEST_ACCELERATOR_ARN].arn
            == TEST_ACCELERATOR_ARN
        )
        assert (
            globalaccelerator.accelerators[TEST_ACCELERATOR_ARN].region
            == AWS_REGION_US_WEST_2
        )
        assert globalaccelerator.accelerators[TEST_ACCELERATOR_ARN].enabled

    def test_list_tags(self):
        # GlobalAccelerator client for this test class
        aws_provider = set_mocked_aws_provider()
        globalaccelerator = GlobalAccelerator(aws_provider)

        assert len(globalaccelerator.accelerators) == 1
        assert (
            globalaccelerator.accelerators[TEST_ACCELERATOR_ARN].tags[0]["Key"]
            == "Name"
        )
        assert (
            globalaccelerator.accelerators[TEST_ACCELERATOR_ARN].tags[0]["Value"]
            == "TestAccelerator"
        )
```

--------------------------------------------------------------------------------

---[FILE: glue_service_test.py]---
Location: prowler-master/tests/providers/aws/services/glue/glue_service_test.py

```python
from unittest.mock import patch

import botocore
from moto import mock_aws

from prowler.providers.aws.services.glue.glue_service import Glue
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

# Mocking Access Analyzer Calls
make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    """
    We have to mock every AWS API call using Boto3

    As you can see the operation_name has the list_analyzers snake_case form but
    we are using the ListAnalyzers form.
    Rationale -> https://github.com/boto/botocore/blob/develop/botocore/client.py#L810:L816
    """
    if operation_name == "GetJobs":
        return {
            "Jobs": [
                {
                    "Name": "job",
                    "SecurityConfiguration": "security_config",
                    "DefaultArguments": {
                        "--encryption-type": "sse-s3",
                        "--enable-job-insights": "false",
                    },
                }
            ]
        }
    elif operation_name == "GetConnections":
        return {
            "ConnectionList": [
                {
                    "Name": "connection",
                    "ConnectionType": "JDBC",
                    "ConnectionProperties": {
                        "CONNECTOR_TYPE": "Jdbc",
                        "JDBC_CONNECTION_URL": '[["default=test"],":"]',
                        "CONNECTOR_URL": "s3://bck-dev",
                        "CONNECTOR_CLASS_NAME": "test",
                        "JDBC_ENFORCE_SSL": "true",
                    },
                }
            ]
        }
    elif operation_name == "SearchTables":
        return {
            "TableList": [
                {"Name": "table", "DatabaseName": "database", "CatalogId": "catalog"}
            ]
        }
    elif operation_name == "GetDevEndpoints":
        return {
            "DevEndpoints": [
                {
                    "EndpointName": "endpoint",
                    "SecurityConfiguration": "security_config",
                }
            ]
        }
    elif operation_name == "GetDataCatalogEncryptionSettings":
        return {
            "DataCatalogEncryptionSettings": {
                "EncryptionAtRest": {
                    "CatalogEncryptionMode": "SSE-KMS",
                    "SseAwsKmsKeyId": "kms_key",
                },
                "ConnectionPasswordEncryption": {
                    "ReturnConnectionPasswordEncrypted": True,
                    "AwsKmsKeyId": "password_key",
                },
            }
        }
    elif operation_name == "GetSecurityConfigurations":
        return {
            "SecurityConfigurations": [
                {
                    "Name": "test",
                    "EncryptionConfiguration": {
                        "S3Encryption": [
                            {
                                "S3EncryptionMode": "DISABLED",
                            },
                        ],
                        "CloudWatchEncryption": {
                            "CloudWatchEncryptionMode": "DISABLED",
                        },
                        "JobBookmarksEncryption": {
                            "JobBookmarksEncryptionMode": "DISABLED",
                        },
                    },
                },
            ],
        }
    elif operation_name == "GetMLTransforms":
        return {
            "Transforms": [
                {
                    "Name": "ml-transform1",
                    "TransformId": "transform1",
                    "UserDefinedEncryption": "DISABLED",
                }
            ]
        }
    elif operation_name == "GetTags":
        return {
            "Tags": {
                "test_key": "test_value",
            },
        }
    elif operation_name == "GetResourcePolicy":
        return {
            "PolicyInJson": '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":"*","Action":"secretsmanager:GetSecretValue","Resource":"*"}]}',
        }
    return make_api_call(self, operation_name, kwarg)


# Mock generate_regional_clients()
def mock_generate_regional_clients(provider, service):
    regional_client = provider._session.current_session.client(
        service, region_name=AWS_REGION_US_EAST_1
    )
    regional_client.region = AWS_REGION_US_EAST_1
    return {AWS_REGION_US_EAST_1: regional_client}


# Patch every AWS call using Boto3 and generate_regional_clients to have 1 client
@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
@patch(
    "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
    new=mock_generate_regional_clients,
)
class Test_Glue_Service:
    # Test Glue Service
    @mock_aws
    def test_service(self):
        # Glue client for this test class
        aws_provider = set_mocked_aws_provider()
        glue = Glue(aws_provider)
        assert glue.service == "glue"

    # Test Glue Client
    @mock_aws
    def test_client(self):
        # Glue client for this test class
        aws_provider = set_mocked_aws_provider()
        glue = Glue(aws_provider)
        for regional_client in glue.regional_clients.values():
            assert regional_client.__class__.__name__ == "Glue"

    # Test Glue Session
    @mock_aws
    def test__get_session__(self):
        # Glue client for this test class
        aws_provider = set_mocked_aws_provider()
        glue = Glue(aws_provider)
        assert glue.session.__class__.__name__ == "Session"

    # Test Glue Session
    @mock_aws
    def test_audited_account(self):
        # Glue client for this test class
        aws_provider = set_mocked_aws_provider()
        glue = Glue(aws_provider)
        assert glue.audited_account == AWS_ACCOUNT_NUMBER

    # Test Glue Search Tables
    @mock_aws
    def test_search_tables(self):
        aws_provider = set_mocked_aws_provider()
        glue = Glue(aws_provider)
        assert len(glue.tables) == 1
        assert glue.tables[0].name == "table"
        assert glue.tables[0].database == "database"
        assert glue.tables[0].catalog == "catalog"
        assert glue.tables[0].region == AWS_REGION_US_EAST_1

    # Test Glue Get Connections
    @mock_aws
    def test_get_connections(self):
        aws_provider = set_mocked_aws_provider()
        glue = Glue(aws_provider)
        assert len(glue.connections) == 1
        assert glue.connections[0].name == "connection"
        assert glue.connections[0].type == "JDBC"
        assert glue.connections[0].properties == {
            "CONNECTOR_TYPE": "Jdbc",
            "JDBC_CONNECTION_URL": '[["default=test"],":"]',
            "CONNECTOR_URL": "s3://bck-dev",
            "CONNECTOR_CLASS_NAME": "test",
            "JDBC_ENFORCE_SSL": "true",
        }
        assert glue.connections[0].region == AWS_REGION_US_EAST_1

    # Test Glue Get Catalog Encryption
    @mock_aws
    def test_get_data_catalog_encryption_settings(self):
        aws_provider = set_mocked_aws_provider()
        glue = Glue(aws_provider)
        assert glue.data_catalogs[AWS_REGION_US_EAST_1].encryption_settings
        assert (
            glue.data_catalogs[AWS_REGION_US_EAST_1].encryption_settings.mode
            == "SSE-KMS"
        )
        assert (
            glue.data_catalogs[AWS_REGION_US_EAST_1].encryption_settings.kms_id
            == "kms_key"
        )
        assert glue.data_catalogs[
            AWS_REGION_US_EAST_1
        ].encryption_settings.password_encryption
        assert (
            glue.data_catalogs[AWS_REGION_US_EAST_1].encryption_settings.password_kms_id
            == "password_key"
        )

    # Test Glue Get Dev Endpoints
    @mock_aws
    def test_get_dev_endpoints(self):
        aws_provider = set_mocked_aws_provider()
        glue = Glue(aws_provider)
        assert len(glue.dev_endpoints) == 1
        assert glue.dev_endpoints[0].name == "endpoint"
        assert glue.dev_endpoints[0].security == "security_config"
        assert glue.dev_endpoints[0].region == AWS_REGION_US_EAST_1

    # Test Glue Get Security Configs
    @mock_aws
    def test_get_security_configurations(self):
        aws_provider = set_mocked_aws_provider()
        glue = Glue(aws_provider)
        assert len(glue.security_configs) == 1
        assert glue.security_configs[0].name == "test"
        assert glue.security_configs[0].s3_encryption == "DISABLED"
        assert glue.security_configs[0].cw_encryption == "DISABLED"
        assert glue.security_configs[0].jb_encryption == "DISABLED"
        assert glue.security_configs[0].region == AWS_REGION_US_EAST_1

    # Test Glue Get Security Configs
    @mock_aws
    def test_get_jobs(self):
        aws_provider = set_mocked_aws_provider()
        glue = Glue(aws_provider)
        assert len(glue.jobs) == 1
        assert glue.jobs[0].name == "job"
        assert glue.jobs[0].security == "security_config"
        assert glue.jobs[0].arguments == {
            "--encryption-type": "sse-s3",
            "--enable-job-insights": "false",
        }
        assert glue.jobs[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_get_ml_transforms(self):
        aws_provider = set_mocked_aws_provider()
        glue = Glue(aws_provider)
        arn_transform = f"arn:aws:glue:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:mlTransform/transform1"

        assert len(glue.ml_transforms) == 1
        assert arn_transform in glue.ml_transforms
        assert glue.ml_transforms[arn_transform].arn == arn_transform
        assert glue.ml_transforms[arn_transform].id == "transform1"
        assert glue.ml_transforms[arn_transform].name == "ml-transform1"
        assert glue.ml_transforms[arn_transform].user_data_encryption == "DISABLED"
        assert glue.ml_transforms[arn_transform].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_get_tags(self):
        aws_provider = set_mocked_aws_provider()
        glue = Glue(aws_provider)

        assert glue.dev_endpoints[0].tags == [{"test_key": "test_value"}]
        assert glue.jobs[0].tags == [{"test_key": "test_value"}]

    @mock_aws
    def test_get_resource_policy(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        glue = Glue(aws_provider)
        assert glue.data_catalogs[AWS_REGION_US_EAST_1].policy == {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": "*",
                    "Action": "secretsmanager:GetSecretValue",
                    "Resource": "*",
                }
            ],
        }
```

--------------------------------------------------------------------------------

---[FILE: glue_database_connections_ssl_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/glue/glue_database_connections_ssl_enabled/glue_database_connections_ssl_enabled_test.py

```python
from unittest.mock import MagicMock, patch

from prowler.providers.aws.services.glue.glue_service import Connection
from tests.providers.aws.utils import AWS_REGION_US_EAST_1


class Test_glue_database_connections_ssl_enabled:
    def test_glue_no_conns(self):
        glue_client = MagicMock
        glue_client.connections = []

        with (
            patch(
                "prowler.providers.aws.services.glue.glue_service.Glue",
                new=glue_client,
            ),
            patch(
                "prowler.providers.aws.services.glue.glue_client.glue_client",
                new=glue_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glue.glue_database_connections_ssl_enabled.glue_database_connections_ssl_enabled import (
                glue_database_connections_ssl_enabled,
            )

            check = glue_database_connections_ssl_enabled()
            result = check.execute()

            assert len(result) == 0

    def test_glue_table_no_SSL(self):
        glue_client = MagicMock
        glue_client.connections = [
            Connection(
                name="test",
                type="JDBC",
                properties={
                    "CONNECTOR_TYPE": "Jdbc",
                    "JDBC_CONNECTION_URL": '[["default=test"],":"]',
                    "CONNECTOR_URL": "s3://bck-dev",
                    "CONNECTOR_CLASS_NAME": "test",
                },
                region=AWS_REGION_US_EAST_1,
                arn="arn_test",
                tags=[{"test": "test"}],
            )
        ]

        with (
            patch(
                "prowler.providers.aws.services.glue.glue_service.Glue",
                new=glue_client,
            ),
            patch(
                "prowler.providers.aws.services.glue.glue_client.glue_client",
                new=glue_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glue.glue_database_connections_ssl_enabled.glue_database_connections_ssl_enabled import (
                glue_database_connections_ssl_enabled,
            )

            check = glue_database_connections_ssl_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Glue connection test has SSL connection disabled."
            )
            assert result[0].resource_id == "test"
            assert result[0].resource_arn == "arn_test"
            assert result[0].resource_tags == [{"test": "test"}]

    def test_glue_table_with_SSL(self):
        glue_client = MagicMock
        glue_client.connections = [
            Connection(
                name="test",
                type="JDBC",
                properties={
                    "CONNECTOR_TYPE": "Jdbc",
                    "JDBC_CONNECTION_URL": '[["default=test"],":"]',
                    "CONNECTOR_URL": "s3://bck-dev",
                    "CONNECTOR_CLASS_NAME": "test",
                    "JDBC_ENFORCE_SSL": "true",
                },
                region=AWS_REGION_US_EAST_1,
                arn="arn_test",
                tags=[{"test": "test"}],
            )
        ]

        with (
            patch(
                "prowler.providers.aws.services.glue.glue_service.Glue",
                new=glue_client,
            ),
            patch(
                "prowler.providers.aws.services.glue.glue_client.glue_client",
                new=glue_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glue.glue_database_connections_ssl_enabled.glue_database_connections_ssl_enabled import (
                glue_database_connections_ssl_enabled,
            )

            check = glue_database_connections_ssl_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Glue connection test has SSL connection enabled."
            )
            assert result[0].resource_id == "test"
            assert result[0].resource_arn == "arn_test"
            assert result[0].resource_tags == [{"test": "test"}]
```

--------------------------------------------------------------------------------

````
