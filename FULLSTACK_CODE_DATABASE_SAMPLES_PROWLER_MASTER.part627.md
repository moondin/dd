---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 627
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 627 of 867)

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

---[FILE: sagemaker_endpoint_config_prod_variant_instances_test.py]---
Location: prowler-master/tests/providers/aws/services/sagemaker/sagemaker_endpoint_config_prod_variant_instances/sagemaker_endpoint_config_prod_variant_instances_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_sagemaker_endpoint_config_prod_variant_instances:
    @mock_aws
    def test_no_endpoint_configs(self):

        from prowler.providers.aws.services.sagemaker.sagemaker_service import SageMaker

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.sagemaker.sagemaker_endpoint_config_prod_variant_instances.sagemaker_endpoint_config_prod_variant_instances.sagemaker_client",
                new=SageMaker(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.sagemaker.sagemaker_endpoint_config_prod_variant_instances.sagemaker_endpoint_config_prod_variant_instances import (
                sagemaker_endpoint_config_prod_variant_instances,
            )

            check = sagemaker_endpoint_config_prod_variant_instances()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_endpoint_config_non_compliant_prod_variant(self):
        sagemaker_client = client("sagemaker", region_name=AWS_REGION_EU_WEST_1)
        endpoint_config_name = "endpoint-config-test"
        prod_variant_name = "Variant1"
        prod_variant_name2 = "Variant2"
        model_name = "mi-modelo-v1"
        model_name2 = "mi-modelo-v2"
        sagemaker_client.create_model(ModelName=model_name)
        sagemaker_client.create_model(ModelName=model_name2)
        endpoint_config = sagemaker_client.create_endpoint_config(
            EndpointConfigName=endpoint_config_name,
            ProductionVariants=[
                {
                    "VariantName": prod_variant_name,
                    "ModelName": "mi-modelo-v1",
                    "InitialInstanceCount": 1,
                    "InstanceType": "ml.m5.large",
                    "InitialVariantWeight": 0.6,
                },
                {
                    "VariantName": prod_variant_name2,
                    "ModelName": "mi-modelo-v2",
                    "InitialInstanceCount": 2,
                    "InstanceType": "ml.m5.large",
                    "InitialVariantWeight": 0.4,
                },
            ],
        )

        from prowler.providers.aws.services.sagemaker.sagemaker_service import SageMaker

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.sagemaker.sagemaker_endpoint_config_prod_variant_instances.sagemaker_endpoint_config_prod_variant_instances.sagemaker_client",
                new=SageMaker(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.sagemaker.sagemaker_endpoint_config_prod_variant_instances.sagemaker_endpoint_config_prod_variant_instances import (
                sagemaker_endpoint_config_prod_variant_instances,
            )

            check = sagemaker_endpoint_config_prod_variant_instances()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Sagemaker Endpoint Config {endpoint_config_name}'s production variants {prod_variant_name} with less than two initial instance."
            )
            assert result[0].resource_id == endpoint_config_name
            assert result[0].resource_arn == endpoint_config["EndpointConfigArn"]

    @mock_aws
    def test_endpoint_config_compliant_prod_variants(self):
        sagemaker_client = client("sagemaker", region_name=AWS_REGION_EU_WEST_1)
        endpoint_config_name = "endpoint-config-test"
        prod_variant_name = "Variant1"
        prod_variant_name2 = "Variant2"
        model_name = "mi-modelo-v1"
        model_name2 = "mi-modelo-v2"
        sagemaker_client.create_model(ModelName=model_name)
        sagemaker_client.create_model(ModelName=model_name2)
        endpoint_config = sagemaker_client.create_endpoint_config(
            EndpointConfigName=endpoint_config_name,
            ProductionVariants=[
                {
                    "VariantName": prod_variant_name,
                    "ModelName": "mi-modelo-v1",
                    "InitialInstanceCount": 2,
                    "InstanceType": "ml.m5.large",
                    "InitialVariantWeight": 0.6,
                },
                {
                    "VariantName": prod_variant_name2,
                    "ModelName": "mi-modelo-v2",
                    "InitialInstanceCount": 2,
                    "InstanceType": "ml.m5.large",
                    "InitialVariantWeight": 0.4,
                },
            ],
        )

        from prowler.providers.aws.services.sagemaker.sagemaker_service import SageMaker

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.sagemaker.sagemaker_endpoint_config_prod_variant_instances.sagemaker_endpoint_config_prod_variant_instances.sagemaker_client",
                new=SageMaker(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.sagemaker.sagemaker_endpoint_config_prod_variant_instances.sagemaker_endpoint_config_prod_variant_instances import (
                sagemaker_endpoint_config_prod_variant_instances,
            )

            check = sagemaker_endpoint_config_prod_variant_instances()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Sagemaker Endpoint Config {endpoint_config_name} has all production variants with more than one initial instance."
            )
            assert result[0].resource_id == endpoint_config_name
            assert result[0].resource_arn == endpoint_config["EndpointConfigArn"]
```

--------------------------------------------------------------------------------

---[FILE: sagemaker_models_network_isolation_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/sagemaker/sagemaker_models_network_isolation_enabled/sagemaker_models_network_isolation_enabled_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.aws.services.sagemaker.sagemaker_service import Model
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

test_notebook_instance = "test-notebook-instance"
notebook_instance_arn = f"arn:aws:sagemaker:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:notebook-instance/{test_notebook_instance}"
subnet_id = "subnet-" + str(uuid4())


class Test_sagemaker_models_network_isolation_enabled:
    def test_no_models(self):
        sagemaker_client = mock.MagicMock
        sagemaker_client.sagemaker_models = []

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.sagemaker.sagemaker_models_network_isolation_enabled.sagemaker_models_network_isolation_enabled.sagemaker_client",
                sagemaker_client,
            ),
        ):
            from prowler.providers.aws.services.sagemaker.sagemaker_models_network_isolation_enabled.sagemaker_models_network_isolation_enabled import (
                sagemaker_models_network_isolation_enabled,
            )

            check = sagemaker_models_network_isolation_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_instance_network_isolation_enabled(self):
        sagemaker_client = mock.MagicMock
        sagemaker_client.sagemaker_models = []
        sagemaker_client.sagemaker_models.append(
            Model(
                name=test_notebook_instance,
                arn=notebook_instance_arn,
                region=AWS_REGION_EU_WEST_1,
                network_isolation=True,
            )
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.sagemaker.sagemaker_models_network_isolation_enabled.sagemaker_models_network_isolation_enabled.sagemaker_client",
                sagemaker_client,
            ),
        ):
            from prowler.providers.aws.services.sagemaker.sagemaker_models_network_isolation_enabled.sagemaker_models_network_isolation_enabled import (
                sagemaker_models_network_isolation_enabled,
            )

            check = sagemaker_models_network_isolation_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Sagemaker notebook instance {test_notebook_instance} has network isolation enabled."
            )
            assert result[0].resource_id == test_notebook_instance
            assert result[0].resource_arn == notebook_instance_arn

    def test_instance_network_isolation_disabled(self):
        sagemaker_client = mock.MagicMock
        sagemaker_client.sagemaker_models = []
        sagemaker_client.sagemaker_models.append(
            Model(
                name=test_notebook_instance,
                arn=notebook_instance_arn,
                region=AWS_REGION_EU_WEST_1,
                network_isolation=False,
            )
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.sagemaker.sagemaker_models_network_isolation_enabled.sagemaker_models_network_isolation_enabled.sagemaker_client",
                sagemaker_client,
            ),
        ):
            from prowler.providers.aws.services.sagemaker.sagemaker_models_network_isolation_enabled.sagemaker_models_network_isolation_enabled import (
                sagemaker_models_network_isolation_enabled,
            )

            check = sagemaker_models_network_isolation_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Sagemaker notebook instance {test_notebook_instance} has network isolation disabled."
            )
            assert result[0].resource_id == test_notebook_instance
            assert result[0].resource_arn == notebook_instance_arn
```

--------------------------------------------------------------------------------

---[FILE: sagemaker_models_vpc_settings_configured_test.py]---
Location: prowler-master/tests/providers/aws/services/sagemaker/sagemaker_models_vpc_settings_configured/sagemaker_models_vpc_settings_configured_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.aws.services.sagemaker.sagemaker_service import Model
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

test_notebook_instance = "test-notebook-instance"
notebook_instance_arn = f"arn:aws:sagemaker:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:notebook-instance/{test_notebook_instance}"
subnet_id = "subnet-" + str(uuid4())


class Test_sagemaker_models_vpc_settings_configured:
    def test_no_models(self):
        sagemaker_client = mock.MagicMock
        sagemaker_client.sagemaker_models = []

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.sagemaker.sagemaker_models_vpc_settings_configured.sagemaker_models_vpc_settings_configured.sagemaker_client",
                sagemaker_client,
            ),
        ):
            from prowler.providers.aws.services.sagemaker.sagemaker_models_vpc_settings_configured.sagemaker_models_vpc_settings_configured import (
                sagemaker_models_vpc_settings_configured,
            )

            check = sagemaker_models_vpc_settings_configured()
            result = check.execute()
            assert len(result) == 0

    def test_instance_vpc_settings_configured(self):
        sagemaker_client = mock.MagicMock
        sagemaker_client.sagemaker_models = []
        sagemaker_client.sagemaker_models.append(
            Model(
                name=test_notebook_instance,
                arn=notebook_instance_arn,
                region=AWS_REGION_EU_WEST_1,
                vpc_config_subnets=[subnet_id],
            )
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.sagemaker.sagemaker_models_vpc_settings_configured.sagemaker_models_vpc_settings_configured.sagemaker_client",
                sagemaker_client,
            ),
        ):
            from prowler.providers.aws.services.sagemaker.sagemaker_models_vpc_settings_configured.sagemaker_models_vpc_settings_configured import (
                sagemaker_models_vpc_settings_configured,
            )

            check = sagemaker_models_vpc_settings_configured()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Sagemaker notebook instance {test_notebook_instance} has VPC settings enabled."
            )
            assert result[0].resource_id == test_notebook_instance
            assert result[0].resource_arn == notebook_instance_arn

    def test_instance_vpc_settings_not_configured(self):
        sagemaker_client = mock.MagicMock
        sagemaker_client.sagemaker_models = []
        sagemaker_client.sagemaker_models.append(
            Model(
                name=test_notebook_instance,
                arn=notebook_instance_arn,
                region=AWS_REGION_EU_WEST_1,
            )
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.sagemaker.sagemaker_models_vpc_settings_configured.sagemaker_models_vpc_settings_configured.sagemaker_client",
                sagemaker_client,
            ),
        ):
            from prowler.providers.aws.services.sagemaker.sagemaker_models_vpc_settings_configured.sagemaker_models_vpc_settings_configured import (
                sagemaker_models_vpc_settings_configured,
            )

            check = sagemaker_models_vpc_settings_configured()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Sagemaker notebook instance {test_notebook_instance} has VPC settings disabled."
            )
            assert result[0].resource_id == test_notebook_instance
            assert result[0].resource_arn == notebook_instance_arn
```

--------------------------------------------------------------------------------

---[FILE: sagemaker_notebook_instance_encryption_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/sagemaker/sagemaker_notebook_instance_encryption_enabled/sagemaker_notebook_instance_encryption_enabled_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.aws.services.sagemaker.sagemaker_service import NotebookInstance
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

test_notebook_instance = "test-notebook-instance"
notebook_instance_arn = f"arn:aws:sagemaker:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:notebook-instance/{test_notebook_instance}"
kms_key = str(uuid4())


class Test_sagemaker_notebook_instance_encryption_enabled:
    def test_no_instances(self):
        sagemaker_client = mock.MagicMock
        sagemaker_client.sagemaker_notebook_instances = []

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.sagemaker.sagemaker_notebook_instance_encryption_enabled.sagemaker_notebook_instance_encryption_enabled.sagemaker_client",
                sagemaker_client,
            ),
        ):
            from prowler.providers.aws.services.sagemaker.sagemaker_notebook_instance_encryption_enabled.sagemaker_notebook_instance_encryption_enabled import (
                sagemaker_notebook_instance_encryption_enabled,
            )

            check = sagemaker_notebook_instance_encryption_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_instance_with_kms_key(self):
        sagemaker_client = mock.MagicMock
        sagemaker_client.sagemaker_notebook_instances = []
        sagemaker_client.sagemaker_notebook_instances.append(
            NotebookInstance(
                name=test_notebook_instance,
                arn=notebook_instance_arn,
                region=AWS_REGION_EU_WEST_1,
                kms_key_id=kms_key,
            )
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.sagemaker.sagemaker_notebook_instance_encryption_enabled.sagemaker_notebook_instance_encryption_enabled.sagemaker_client",
                sagemaker_client,
            ),
        ):
            from prowler.providers.aws.services.sagemaker.sagemaker_notebook_instance_encryption_enabled.sagemaker_notebook_instance_encryption_enabled import (
                sagemaker_notebook_instance_encryption_enabled,
            )

            check = sagemaker_notebook_instance_encryption_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Sagemaker notebook instance {test_notebook_instance} has data encryption enabled."
            )
            assert result[0].resource_id == test_notebook_instance
            assert result[0].resource_arn == notebook_instance_arn

    def test_instance_no_kms_key(self):
        sagemaker_client = mock.MagicMock
        sagemaker_client.sagemaker_notebook_instances = []
        sagemaker_client.sagemaker_notebook_instances.append(
            NotebookInstance(
                name=test_notebook_instance,
                arn=notebook_instance_arn,
                region=AWS_REGION_EU_WEST_1,
            )
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.sagemaker.sagemaker_notebook_instance_encryption_enabled.sagemaker_notebook_instance_encryption_enabled.sagemaker_client",
                sagemaker_client,
            ),
        ):
            from prowler.providers.aws.services.sagemaker.sagemaker_notebook_instance_encryption_enabled.sagemaker_notebook_instance_encryption_enabled import (
                sagemaker_notebook_instance_encryption_enabled,
            )

            check = sagemaker_notebook_instance_encryption_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Sagemaker notebook instance {test_notebook_instance} has data encryption disabled."
            )
            assert result[0].resource_id == test_notebook_instance
            assert result[0].resource_arn == notebook_instance_arn
```

--------------------------------------------------------------------------------

---[FILE: sagemaker_notebook_instance_root_access_disabled_test.py]---
Location: prowler-master/tests/providers/aws/services/sagemaker/sagemaker_notebook_instance_root_access_disabled/sagemaker_notebook_instance_root_access_disabled_test.py

```python
from unittest import mock

from prowler.providers.aws.services.sagemaker.sagemaker_service import NotebookInstance
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

test_notebook_instance = "test-notebook-instance"
notebook_instance_arn = f"arn:aws:sagemaker:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:notebook-instance/{test_notebook_instance}"


class Test_sagemaker_notebook_instance_root_access_disabled:
    def test_no_instances(self):
        sagemaker_client = mock.MagicMock
        sagemaker_client.sagemaker_notebook_instances = []

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.sagemaker.sagemaker_notebook_instance_root_access_disabled.sagemaker_notebook_instance_root_access_disabled.sagemaker_client",
                sagemaker_client,
            ),
        ):
            from prowler.providers.aws.services.sagemaker.sagemaker_notebook_instance_root_access_disabled.sagemaker_notebook_instance_root_access_disabled import (
                sagemaker_notebook_instance_root_access_disabled,
            )

            check = sagemaker_notebook_instance_root_access_disabled()
            result = check.execute()
            assert len(result) == 0

    def test_instance_root_access_disabled(self):
        sagemaker_client = mock.MagicMock
        sagemaker_client.sagemaker_notebook_instances = []
        sagemaker_client.sagemaker_notebook_instances.append(
            NotebookInstance(
                name=test_notebook_instance,
                arn=notebook_instance_arn,
                region=AWS_REGION_EU_WEST_1,
                root_access=False,
            )
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.sagemaker.sagemaker_notebook_instance_root_access_disabled.sagemaker_notebook_instance_root_access_disabled.sagemaker_client",
                sagemaker_client,
            ),
        ):
            from prowler.providers.aws.services.sagemaker.sagemaker_notebook_instance_root_access_disabled.sagemaker_notebook_instance_root_access_disabled import (
                sagemaker_notebook_instance_root_access_disabled,
            )

            check = sagemaker_notebook_instance_root_access_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Sagemaker notebook instance {test_notebook_instance} has root access disabled."
            )
            assert result[0].resource_id == test_notebook_instance
            assert result[0].resource_arn == notebook_instance_arn

    def test_instance_root_access_enabled(self):
        sagemaker_client = mock.MagicMock
        sagemaker_client.sagemaker_notebook_instances = []
        sagemaker_client.sagemaker_notebook_instances.append(
            NotebookInstance(
                name=test_notebook_instance,
                arn=notebook_instance_arn,
                region=AWS_REGION_EU_WEST_1,
                root_access=True,
            )
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.sagemaker.sagemaker_notebook_instance_root_access_disabled.sagemaker_notebook_instance_root_access_disabled.sagemaker_client",
                sagemaker_client,
            ),
        ):
            from prowler.providers.aws.services.sagemaker.sagemaker_notebook_instance_root_access_disabled.sagemaker_notebook_instance_root_access_disabled import (
                sagemaker_notebook_instance_root_access_disabled,
            )

            check = sagemaker_notebook_instance_root_access_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Sagemaker notebook instance {test_notebook_instance} has root access enabled."
            )
            assert result[0].resource_id == test_notebook_instance
            assert result[0].resource_arn == notebook_instance_arn
```

--------------------------------------------------------------------------------

---[FILE: sagemaker_notebook_instance_vpc_settings_configured_test.py]---
Location: prowler-master/tests/providers/aws/services/sagemaker/sagemaker_notebook_instance_vpc_settings_configured/sagemaker_notebook_instance_vpc_settings_configured_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.aws.services.sagemaker.sagemaker_service import NotebookInstance
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

test_notebook_instance = "test-notebook-instance"
notebook_instance_arn = f"arn:aws:sagemaker:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:notebook-instance/{test_notebook_instance}"
subnet_id = "subnet-" + str(uuid4())


class Test_sagemaker_notebook_instance_vpc_settings_configured:
    def test_no_instances(self):
        sagemaker_client = mock.MagicMock
        sagemaker_client.sagemaker_notebook_instances = []

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.sagemaker.sagemaker_notebook_instance_vpc_settings_configured.sagemaker_notebook_instance_vpc_settings_configured.sagemaker_client",
                sagemaker_client,
            ),
        ):
            from prowler.providers.aws.services.sagemaker.sagemaker_notebook_instance_vpc_settings_configured.sagemaker_notebook_instance_vpc_settings_configured import (
                sagemaker_notebook_instance_vpc_settings_configured,
            )

            check = sagemaker_notebook_instance_vpc_settings_configured()
            result = check.execute()
            assert len(result) == 0

    def test_instance_vpc_settings_configured(self):
        sagemaker_client = mock.MagicMock
        sagemaker_client.sagemaker_notebook_instances = []
        sagemaker_client.sagemaker_notebook_instances.append(
            NotebookInstance(
                name=test_notebook_instance,
                arn=notebook_instance_arn,
                region=AWS_REGION_EU_WEST_1,
                subnet_id=subnet_id,
            )
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.sagemaker.sagemaker_notebook_instance_vpc_settings_configured.sagemaker_notebook_instance_vpc_settings_configured.sagemaker_client",
                sagemaker_client,
            ),
        ):
            from prowler.providers.aws.services.sagemaker.sagemaker_notebook_instance_vpc_settings_configured.sagemaker_notebook_instance_vpc_settings_configured import (
                sagemaker_notebook_instance_vpc_settings_configured,
            )

            check = sagemaker_notebook_instance_vpc_settings_configured()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Sagemaker notebook instance {test_notebook_instance} is in a VPC."
            )
            assert result[0].resource_id == test_notebook_instance
            assert result[0].resource_arn == notebook_instance_arn

    def test_instance_vpc_settings_not_configured(self):
        sagemaker_client = mock.MagicMock
        sagemaker_client.sagemaker_notebook_instances = []
        sagemaker_client.sagemaker_notebook_instances.append(
            NotebookInstance(
                name=test_notebook_instance,
                arn=notebook_instance_arn,
                region=AWS_REGION_EU_WEST_1,
                root_access=True,
            )
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.sagemaker.sagemaker_notebook_instance_vpc_settings_configured.sagemaker_notebook_instance_vpc_settings_configured.sagemaker_client",
                sagemaker_client,
            ),
        ):
            from prowler.providers.aws.services.sagemaker.sagemaker_notebook_instance_vpc_settings_configured.sagemaker_notebook_instance_vpc_settings_configured import (
                sagemaker_notebook_instance_vpc_settings_configured,
            )

            check = sagemaker_notebook_instance_vpc_settings_configured()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Sagemaker notebook instance {test_notebook_instance} has VPC settings disabled."
            )
            assert result[0].resource_id == test_notebook_instance
            assert result[0].resource_arn == notebook_instance_arn
```

--------------------------------------------------------------------------------

---[FILE: sagemaker_training_jobs_intercontainer_encryption_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/sagemaker/sagemaker_training_jobs_intercontainer_encryption_enabled/sagemaker_training_jobs_intercontainer_encryption_enabled_test.py

```python
from unittest import mock

from prowler.providers.aws.services.sagemaker.sagemaker_service import TrainingJob
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

test_training_job = "test-training-job"
training_job_arn = f"arn:aws:sagemaker:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:training-job/{test_training_job}"


class Test_sagemaker_training_jobs_intercontainer_encryption_enabled:
    def test_no_training_jobs(self):
        sagemaker_client = mock.MagicMock
        sagemaker_client.sagemaker_training_jobs = []

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.sagemaker.sagemaker_training_jobs_intercontainer_encryption_enabled.sagemaker_training_jobs_intercontainer_encryption_enabled.sagemaker_client",
                sagemaker_client,
            ),
        ):
            from prowler.providers.aws.services.sagemaker.sagemaker_training_jobs_intercontainer_encryption_enabled.sagemaker_training_jobs_intercontainer_encryption_enabled import (
                sagemaker_training_jobs_intercontainer_encryption_enabled,
            )

            check = sagemaker_training_jobs_intercontainer_encryption_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_instance_traffic_encryption_enabled(self):
        sagemaker_client = mock.MagicMock
        sagemaker_client.sagemaker_training_jobs = []
        sagemaker_client.sagemaker_training_jobs.append(
            TrainingJob(
                name=test_training_job,
                arn=training_job_arn,
                region=AWS_REGION_EU_WEST_1,
                container_traffic_encryption=True,
            )
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.sagemaker.sagemaker_training_jobs_intercontainer_encryption_enabled.sagemaker_training_jobs_intercontainer_encryption_enabled.sagemaker_client",
                sagemaker_client,
            ),
        ):
            from prowler.providers.aws.services.sagemaker.sagemaker_training_jobs_intercontainer_encryption_enabled.sagemaker_training_jobs_intercontainer_encryption_enabled import (
                sagemaker_training_jobs_intercontainer_encryption_enabled,
            )

            check = sagemaker_training_jobs_intercontainer_encryption_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Sagemaker training job {test_training_job} has intercontainer encryption enabled."
            )
            assert result[0].resource_id == test_training_job
            assert result[0].resource_arn == training_job_arn

    def test_instance_traffic_encryption_disabled(self):
        sagemaker_client = mock.MagicMock
        sagemaker_client.sagemaker_training_jobs = []
        sagemaker_client.sagemaker_training_jobs.append(
            TrainingJob(
                name=test_training_job,
                arn=training_job_arn,
                region=AWS_REGION_EU_WEST_1,
            )
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.sagemaker.sagemaker_training_jobs_intercontainer_encryption_enabled.sagemaker_training_jobs_intercontainer_encryption_enabled.sagemaker_client",
                sagemaker_client,
            ),
        ):
            from prowler.providers.aws.services.sagemaker.sagemaker_training_jobs_intercontainer_encryption_enabled.sagemaker_training_jobs_intercontainer_encryption_enabled import (
                sagemaker_training_jobs_intercontainer_encryption_enabled,
            )

            check = sagemaker_training_jobs_intercontainer_encryption_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Sagemaker training job {test_training_job} has intercontainer encryption disabled."
            )
            assert result[0].resource_id == test_training_job
            assert result[0].resource_arn == training_job_arn
```

--------------------------------------------------------------------------------

````
