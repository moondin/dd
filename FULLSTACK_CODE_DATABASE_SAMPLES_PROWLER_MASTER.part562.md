---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 562
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 562 of 867)

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

---[FILE: glue_data_catalogs_connection_passwords_encryption_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/glue/glue_data_catalogs_connection_passwords_encryption_enabled/glue_data_catalogs_connection_passwords_encryption_enabled_test.py

```python
from unittest import mock

import botocore
from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.glue.glue_service import Glue
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "GetDataCatalogEncryptionSettings":
        return {
            "DataCatalogEncryptionSettings": {
                "EncryptionAtRest": {
                    "CatalogEncryptionMode": "DISABLED",
                    "SseAwsKmsKeyId": "kms-key",
                },
                "ConnectionPasswordEncryption": {
                    "ReturnConnectionPasswordEncrypted": False,
                    "AwsKmsKeyId": "password_key",
                },
            }
        }
    return make_api_call(self, operation_name, kwarg)


def mock_make_api_call_v2(self, operation_name, kwarg):
    if operation_name == "GetDataCatalogEncryptionSettings":
        return {
            "DataCatalogEncryptionSettings": {
                "EncryptionAtRest": {
                    "CatalogEncryptionMode": "DISABLED",
                    "SseAwsKmsKeyId": "kms-key",
                },
                "ConnectionPasswordEncryption": {
                    "ReturnConnectionPasswordEncrypted": False,
                    "AwsKmsKeyId": "password_key",
                },
            }
        }
    elif operation_name == "SearchTables":
        return {
            "TableList": [
                {
                    "Name": "test-table",
                    "DatabaseName": "test-database",
                    "CatalogId": AWS_ACCOUNT_NUMBER,
                }
            ],
        }
    return make_api_call(self, operation_name, kwarg)


def mock_make_api_call_v3(self, operation_name, kwarg):
    if operation_name == "GetDataCatalogEncryptionSettings":
        return {
            "DataCatalogEncryptionSettings": {
                "EncryptionAtRest": {
                    "CatalogEncryptionMode": "SSE-KMS",
                    "SseAwsKmsKeyId": "kms-key",
                },
                "ConnectionPasswordEncryption": {
                    "ReturnConnectionPasswordEncrypted": True,
                    "AwsKmsKeyId": "kms-key",
                },
            }
        }
    return make_api_call(self, operation_name, kwarg)


class Test_glue_data_catalogs_connection_passwords_encryption_enabled:
    @mock_aws
    def test_glue_no_data_catalogs(self):
        client("glue", region_name=AWS_REGION_EU_WEST_1)
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.glue.glue_data_catalogs_connection_passwords_encryption_enabled.glue_data_catalogs_connection_passwords_encryption_enabled.glue_client",
                new=Glue(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glue.glue_data_catalogs_connection_passwords_encryption_enabled.glue_data_catalogs_connection_passwords_encryption_enabled import (
                glue_data_catalogs_connection_passwords_encryption_enabled,
            )

            check = glue_data_catalogs_connection_passwords_encryption_enabled()
            result = check.execute()

            # Moto 5.1.11 now returns default data catalog settings even when no explicit catalog exists
            # The check should still run but with default settings (DISABLED encryption)
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Glue data catalog connection password is not encrypted."
            )

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_glue_catalog_password_unencrypted(self):
        client("glue", region_name=AWS_REGION_EU_WEST_1)
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.glue.glue_data_catalogs_connection_passwords_encryption_enabled.glue_data_catalogs_connection_passwords_encryption_enabled.glue_client",
                new=Glue(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glue.glue_data_catalogs_connection_passwords_encryption_enabled.glue_data_catalogs_connection_passwords_encryption_enabled import (
                glue_data_catalogs_connection_passwords_encryption_enabled,
            )

            check = glue_data_catalogs_connection_passwords_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Glue data catalog connection password is not encrypted."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:glue:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:data-catalog"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_glue_catalog_password_unencrypted_ignoring(self):
        client("glue", region_name=AWS_REGION_EU_WEST_1)
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        aws_provider._scan_unused_services = False

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.glue.glue_data_catalogs_connection_passwords_encryption_enabled.glue_data_catalogs_connection_passwords_encryption_enabled.glue_client",
                new=Glue(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glue.glue_data_catalogs_connection_passwords_encryption_enabled.glue_data_catalogs_connection_passwords_encryption_enabled import (
                glue_data_catalogs_connection_passwords_encryption_enabled,
            )

            check = glue_data_catalogs_connection_passwords_encryption_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call_v2)
    def test_glue_catalog_password_unencrypted_ignoring_with_tables(self):
        client("glue", region_name=AWS_REGION_EU_WEST_1)
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        aws_provider._scan_unused_services = False

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.glue.glue_data_catalogs_connection_passwords_encryption_enabled.glue_data_catalogs_connection_passwords_encryption_enabled.glue_client",
                new=Glue(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glue.glue_data_catalogs_connection_passwords_encryption_enabled.glue_data_catalogs_connection_passwords_encryption_enabled import (
                glue_data_catalogs_connection_passwords_encryption_enabled,
            )

            check = glue_data_catalogs_connection_passwords_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Glue data catalog connection password is not encrypted."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:glue:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:data-catalog"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call_v3)
    def test_glue_catalog_encrypted(self):
        client("glue", region_name=AWS_REGION_EU_WEST_1)
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.glue.glue_data_catalogs_connection_passwords_encryption_enabled.glue_data_catalogs_connection_passwords_encryption_enabled.glue_client",
                new=Glue(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glue.glue_data_catalogs_connection_passwords_encryption_enabled.glue_data_catalogs_connection_passwords_encryption_enabled import (
                glue_data_catalogs_connection_passwords_encryption_enabled,
            )

            check = glue_data_catalogs_connection_passwords_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Glue data catalog connection password is encrypted with KMS key kms-key."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:glue:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:data-catalog"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
```

--------------------------------------------------------------------------------

---[FILE: glue_data_catalogs_metadata_encryption_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/glue/glue_data_catalogs_metadata_encryption_enabled/glue_data_catalogs_metadata_encryption_enabled_test.py

```python
from unittest import mock

import botocore
from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.glue.glue_service import Glue
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "GetDataCatalogEncryptionSettings":
        return {
            "DataCatalogEncryptionSettings": {
                "EncryptionAtRest": {
                    "CatalogEncryptionMode": "DISABLED",
                    "SseAwsKmsKeyId": "kms-key",
                },
                "ConnectionPasswordEncryption": {
                    "ReturnConnectionPasswordEncrypted": True,
                    "AwsKmsKeyId": "password_key",
                },
            }
        }
    return make_api_call(self, operation_name, kwarg)


def mock_make_api_call_v2(self, operation_name, kwarg):
    if operation_name == "GetDataCatalogEncryptionSettings":
        return {
            "DataCatalogEncryptionSettings": {
                "EncryptionAtRest": {
                    "CatalogEncryptionMode": "DISABLED",
                    "SseAwsKmsKeyId": "kms-key",
                },
                "ConnectionPasswordEncryption": {
                    "ReturnConnectionPasswordEncrypted": True,
                    "AwsKmsKeyId": "password_key",
                },
            }
        }
    elif operation_name == "SearchTables":
        return {
            "TableList": [
                {
                    "Name": "test-table",
                    "DatabaseName": "test-database",
                    "CatalogId": AWS_ACCOUNT_NUMBER,
                }
            ],
        }
    return make_api_call(self, operation_name, kwarg)


def mock_make_api_call_v3(self, operation_name, kwarg):
    if operation_name == "GetDataCatalogEncryptionSettings":
        return {
            "DataCatalogEncryptionSettings": {
                "EncryptionAtRest": {
                    "CatalogEncryptionMode": "SSE-KMS",
                    "SseAwsKmsKeyId": "kms-key",
                },
                "ConnectionPasswordEncryption": {
                    "ReturnConnectionPasswordEncrypted": True,
                    "AwsKmsKeyId": "password_key",
                },
            }
        }
    return make_api_call(self, operation_name, kwarg)


class Test_glue_data_catalogs_metadata_encryption_enabled:
    @mock_aws
    def test_glue_no_data_catalogs(self):
        client("glue", region_name=AWS_REGION_EU_WEST_1)
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.glue.glue_data_catalogs_metadata_encryption_enabled.glue_data_catalogs_metadata_encryption_enabled.glue_client",
                new=Glue(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glue.glue_data_catalogs_metadata_encryption_enabled.glue_data_catalogs_metadata_encryption_enabled import (
                glue_data_catalogs_metadata_encryption_enabled,
            )

            check = glue_data_catalogs_metadata_encryption_enabled()
            result = check.execute()

            # Moto 5.1.11 now returns default data catalog settings even when no explicit catalog exists
            # The check should still run but with default settings (DISABLED encryption)
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Glue data catalog settings have metadata encryption disabled."
            )

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_glue_catalog_unencrypted(self):
        client("glue", region_name=AWS_REGION_EU_WEST_1)
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.glue.glue_data_catalogs_metadata_encryption_enabled.glue_data_catalogs_metadata_encryption_enabled.glue_client",
                new=Glue(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glue.glue_data_catalogs_metadata_encryption_enabled.glue_data_catalogs_metadata_encryption_enabled import (
                glue_data_catalogs_metadata_encryption_enabled,
            )

            check = glue_data_catalogs_metadata_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Glue data catalog settings have metadata encryption disabled."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:glue:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:data-catalog"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_glue_catalog_unencrypted_ignoring(self):
        client("glue", region_name=AWS_REGION_EU_WEST_1)
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        aws_provider._scan_unused_services = False
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.glue.glue_data_catalogs_metadata_encryption_enabled.glue_data_catalogs_metadata_encryption_enabled.glue_client",
                new=Glue(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glue.glue_data_catalogs_metadata_encryption_enabled.glue_data_catalogs_metadata_encryption_enabled import (
                glue_data_catalogs_metadata_encryption_enabled,
            )

            check = glue_data_catalogs_metadata_encryption_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call_v2)
    def test_glue_catalog_unencrypted_ignoring_with_tables(self):
        client("glue", region_name=AWS_REGION_EU_WEST_1)
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        aws_provider._scan_unused_services = False
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.glue.glue_data_catalogs_metadata_encryption_enabled.glue_data_catalogs_metadata_encryption_enabled.glue_client",
                new=Glue(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glue.glue_data_catalogs_metadata_encryption_enabled.glue_data_catalogs_metadata_encryption_enabled import (
                glue_data_catalogs_metadata_encryption_enabled,
            )

            check = glue_data_catalogs_metadata_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Glue data catalog settings have metadata encryption disabled."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:glue:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:data-catalog"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call_v3)
    def test_glue_catalog_encrypted(self):
        client("glue", region_name=AWS_REGION_EU_WEST_1)
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.glue.glue_data_catalogs_metadata_encryption_enabled.glue_data_catalogs_metadata_encryption_enabled.glue_client",
                new=Glue(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glue.glue_data_catalogs_metadata_encryption_enabled.glue_data_catalogs_metadata_encryption_enabled import (
                glue_data_catalogs_metadata_encryption_enabled,
            )

            check = glue_data_catalogs_metadata_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Glue data catalog settings have metadata encryption enabled with KMS key kms-key."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:glue:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:data-catalog"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
```

--------------------------------------------------------------------------------

---[FILE: glue_data_catalogs_not_publicly_accessible_test.py]---
Location: prowler-master/tests/providers/aws/services/glue/glue_data_catalogs_not_publicly_accessible/glue_data_catalogs_not_publicly_accessible_test.py

```python
from unittest import mock

import botocore
from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.glue.glue_service import Glue
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "GetDataCatalogEncryptionSettings":
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
    elif operation_name == "GetResourcePolicy":
        return {
            "PolicyInJson": '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":"arn:aws:iam::123456789012:root","Action":"secretsmanager:GetSecretValue","Resource":"*"}]}',
        }
    return make_api_call(self, operation_name, kwarg)


def mock_make_api_call_v2(self, operation_name, kwarg):
    if operation_name == "GetDataCatalogEncryptionSettings":
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
    elif operation_name == "GetResourcePolicy":
        return {
            "PolicyInJson": '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":"*","Action":"glue:*","Resource":"*"}]}',
        }
    return make_api_call(self, operation_name, kwarg)


class Test_glue_data_catalogs_not_publicly_accessible:
    @mock_aws
    def test_glue_no_data_catalogs(self):
        client("glue", region_name=AWS_REGION_EU_WEST_1)
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.glue.glue_data_catalogs_not_publicly_accessible.glue_data_catalogs_not_publicly_accessible.glue_client",
                new=Glue(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glue.glue_data_catalogs_not_publicly_accessible.glue_data_catalogs_not_publicly_accessible import (
                glue_data_catalogs_not_publicly_accessible,
            )

            check = glue_data_catalogs_not_publicly_accessible()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_glue_data_catalog_not_public_policy(self):
        client("glue", region_name=AWS_REGION_EU_WEST_1)
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.glue.glue_data_catalogs_not_publicly_accessible.glue_data_catalogs_not_publicly_accessible.glue_client",
                new=Glue(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glue.glue_data_catalogs_not_publicly_accessible.glue_data_catalogs_not_publicly_accessible import (
                glue_data_catalogs_not_publicly_accessible,
            )

            check = glue_data_catalogs_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Glue Data Catalog is not publicly accessible."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:glue:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:data-catalog"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call_v2)
    def test_glue_data_catalog_public_policy(self):
        client("glue", region_name=AWS_REGION_EU_WEST_1)
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.glue.glue_data_catalogs_not_publicly_accessible.glue_data_catalogs_not_publicly_accessible.glue_client",
                new=Glue(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.glue.glue_data_catalogs_not_publicly_accessible.glue_data_catalogs_not_publicly_accessible import (
                glue_data_catalogs_not_publicly_accessible,
            )

            check = glue_data_catalogs_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Glue Data Catalog is publicly accessible due to its resource policy."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:glue:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:data-catalog"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
```

--------------------------------------------------------------------------------

---[FILE: glue_development_endpoints_cloudwatch_logs_encryption_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/glue/glue_development_endpoints_cloudwatch_logs_encryption_enabled/glue_development_endpoints_cloudwatch_logs_encryption_enabled_test.py

```python
from unittest.mock import MagicMock, patch

from prowler.providers.aws.services.glue.glue_service import DevEndpoint, SecurityConfig
from tests.providers.aws.utils import AWS_REGION_US_EAST_1


class Test_glue_development_endpoints_cloudwatch_logs_encryption_enabled:
    def test_glue_no_endpoints(self):
        glue_client = MagicMock
        glue_client.dev_endpoints = []

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
            from prowler.providers.aws.services.glue.glue_development_endpoints_cloudwatch_logs_encryption_enabled.glue_development_endpoints_cloudwatch_logs_encryption_enabled import (
                glue_development_endpoints_cloudwatch_logs_encryption_enabled,
            )

            check = glue_development_endpoints_cloudwatch_logs_encryption_enabled()
            result = check.execute()

            assert len(result) == 0

    def test_glue_encrypted_endpoint(self):
        glue_client = MagicMock
        glue_client.dev_endpoints = [
            DevEndpoint(
                name="test",
                security="sec_config",
                region=AWS_REGION_US_EAST_1,
                arn="arn_test",
                tags=[{"key_test": "value_test"}],
            )
        ]
        glue_client.security_configs = [
            SecurityConfig(
                name="sec_config",
                cw_encryption="SSE-KMS",
                cw_key_arn="key_arn",
                s3_encryption="DISABLED",
                jb_encryption="DISABLED",
                region=AWS_REGION_US_EAST_1,
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
            from prowler.providers.aws.services.glue.glue_development_endpoints_cloudwatch_logs_encryption_enabled.glue_development_endpoints_cloudwatch_logs_encryption_enabled import (
                glue_development_endpoints_cloudwatch_logs_encryption_enabled,
            )

            check = glue_development_endpoints_cloudwatch_logs_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Glue development endpoint test has CloudWatch logs encryption enabled with key key_arn."
            )
            assert result[0].resource_id == "test"
            assert result[0].resource_arn == "arn_test"
            assert result[0].resource_tags == [{"key_test": "value_test"}]

    def test_glue_unencrypted_endpoint(self):
        glue_client = MagicMock
        glue_client.dev_endpoints = [
            DevEndpoint(
                name="test",
                security="sec_config",
                region=AWS_REGION_US_EAST_1,
                arn="arn_test",
                tags=[{"key_test": "value_test"}],
            )
        ]
        glue_client.security_configs = [
            SecurityConfig(
                name="sec_config",
                s3_encryption="DISABLED",
                cw_encryption="DISABLED",
                jb_encryption="DISABLED",
                region=AWS_REGION_US_EAST_1,
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
            from prowler.providers.aws.services.glue.glue_development_endpoints_cloudwatch_logs_encryption_enabled.glue_development_endpoints_cloudwatch_logs_encryption_enabled import (
                glue_development_endpoints_cloudwatch_logs_encryption_enabled,
            )

            check = glue_development_endpoints_cloudwatch_logs_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Glue development endpoint test does not have CloudWatch logs encryption enabled."
            )
            assert result[0].resource_id == "test"
            assert result[0].resource_arn == "arn_test"
            assert result[0].resource_tags == [{"key_test": "value_test"}]

    def test_glue_no_sec_configs(self):
        glue_client = MagicMock
        glue_client.dev_endpoints = [
            DevEndpoint(
                name="test",
                security="sec_config",
                region=AWS_REGION_US_EAST_1,
                arn="arn_test",
                tags=[{"key_test": "value_test"}],
            )
        ]
        glue_client.security_configs = []

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
            from prowler.providers.aws.services.glue.glue_development_endpoints_cloudwatch_logs_encryption_enabled.glue_development_endpoints_cloudwatch_logs_encryption_enabled import (
                glue_development_endpoints_cloudwatch_logs_encryption_enabled,
            )

            check = glue_development_endpoints_cloudwatch_logs_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Glue development endpoint test does not have security configuration."
            )
            assert result[0].resource_id == "test"
            assert result[0].resource_arn == "arn_test"
            assert result[0].resource_tags == [{"key_test": "value_test"}]
```

--------------------------------------------------------------------------------

````
