---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 647
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 647 of 867)

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

---[FILE: azure_provider_test.py]---
Location: prowler-master/tests/providers/azure/azure_provider_test.py

```python
from unittest.mock import patch
from uuid import uuid4

import pytest
from azure.core.credentials import AccessToken
from azure.identity import DefaultAzureCredential
from mock import MagicMock

from prowler.config.config import (
    default_config_file_path,
    default_fixer_config_file_path,
    load_and_validate_config_file,
)
from prowler.providers.azure.azure_provider import AzureProvider
from prowler.providers.azure.exceptions.exceptions import (
    AzureBrowserAuthNoTenantIDError,
    AzureHTTPResponseError,
    AzureInvalidProviderIdError,
    AzureNoAuthenticationMethodError,
    AzureTenantIDNoBrowserAuthError,
)
from prowler.providers.azure.models import AzureIdentityInfo, AzureRegionConfig
from prowler.providers.common.models import Connection


class TestAzureProvider:
    def test_azure_provider(self):
        subscription_id = None
        tenant_id = None
        # We need to set exactly one auth method
        az_cli_auth = True
        sp_env_auth = None
        browser_auth = None
        managed_identity_auth = None
        client_id = None
        client_secret = None

        fixer_config = load_and_validate_config_file(
            "azure", default_fixer_config_file_path
        )
        azure_region = "AzureCloud"

        with (
            patch(
                "prowler.providers.azure.azure_provider.AzureProvider.setup_identity",
                return_value=AzureIdentityInfo(),
            ),
            patch(
                "prowler.providers.azure.azure_provider.AzureProvider.get_locations",
                return_value={},
            ),
        ):
            azure_provider = AzureProvider(
                az_cli_auth,
                sp_env_auth,
                browser_auth,
                managed_identity_auth,
                tenant_id,
                azure_region,
                subscription_id,
                config_path=default_config_file_path,
                fixer_config=fixer_config,
                client_id=client_id,
                client_secret=client_secret,
            )

            assert azure_provider.region_config == AzureRegionConfig(
                name="AzureCloud",
                authority=None,
                base_url="https://management.azure.com",
                credential_scopes=["https://management.azure.com/.default"],
            )
            assert isinstance(azure_provider.session, DefaultAzureCredential)
            assert azure_provider.identity == AzureIdentityInfo(
                identity_id="",
                identity_type="",
                tenant_ids=[],
                tenant_domain="Unknown tenant domain (missing AAD permissions)",
                subscriptions={},
                locations={},
            )
            assert azure_provider.audit_config == {
                "shodan_api_key": None,
                "php_latest_version": "8.2",
                "python_latest_version": "3.12",
                "java_latest_version": "17",
                "recommended_minimal_tls_versions": ["1.2", "1.3"],
                "vm_backup_min_daily_retention_days": 7,
                "desired_vm_sku_sizes": [
                    "Standard_A8_v2",
                    "Standard_DS3_v2",
                    "Standard_D4s_v3",
                ],
                "defender_attack_path_minimal_risk_level": "High",
                "apim_threat_detection_llm_jacking_threshold": 0.1,
                "apim_threat_detection_llm_jacking_minutes": 1440,
                "apim_threat_detection_llm_jacking_actions": [
                    "ImageGenerations_Create",
                    "ChatCompletions_Create",
                    "Completions_Create",
                    "Embeddings_Create",
                    "FineTuning_Jobs_Create",
                    "Models_List",
                    "Deployments_List",
                    "Deployments_Get",
                    "Deployments_Create",
                    "Deployments_Delete",
                    "Messages_Create",
                    "Claude_Create",
                    "GenerateContent",
                    "GenerateText",
                    "GenerateImage",
                    "Llama_Create",
                    "CodeLlama_Create",
                    "Gemini_Generate",
                    "Claude_Generate",
                    "Llama_Generate",
                ],
            }

    def test_azure_provider_not_auth_methods(self):
        subscription_id = None
        tenant_id = None
        # We need to set exactly one auth method
        az_cli_auth = None
        sp_env_auth = None
        browser_auth = None
        managed_identity_auth = None

        config_file = default_config_file_path
        fixer_config = default_fixer_config_file_path
        azure_region = "AzureCloud"

        with (
            patch(
                "prowler.providers.azure.azure_provider.AzureProvider.setup_identity",
                return_value=AzureIdentityInfo(),
            ),
            patch(
                "prowler.providers.azure.azure_provider.AzureProvider.get_locations",
                return_value={},
            ),
        ):
            with pytest.raises(AzureNoAuthenticationMethodError) as exception:
                _ = AzureProvider(
                    az_cli_auth,
                    sp_env_auth,
                    browser_auth,
                    managed_identity_auth,
                    tenant_id,
                    azure_region,
                    subscription_id,
                    config_file,
                    fixer_config,
                )
            assert exception.type == AzureNoAuthenticationMethodError
            assert (
                "Azure provider requires at least one authentication method set: [--az-cli-auth | --sp-env-auth | --browser-auth | --managed-identity-auth]"
                in exception.value.args[0]
            )

    def test_azure_provider_browser_auth_but_not_tenant_id(self):
        subscription_id = None
        tenant_id = None
        # We need to set exactly one auth method
        az_cli_auth = None
        sp_env_auth = None
        browser_auth = True
        managed_identity_auth = None
        config_file = default_config_file_path
        fixer_config = default_fixer_config_file_path
        azure_region = "AzureCloud"

        with (
            patch(
                "prowler.providers.azure.azure_provider.AzureProvider.setup_identity",
                return_value=AzureIdentityInfo(),
            ),
            patch(
                "prowler.providers.azure.azure_provider.AzureProvider.get_locations",
                return_value={},
            ),
        ):
            with pytest.raises(AzureBrowserAuthNoTenantIDError) as exception:
                _ = AzureProvider(
                    az_cli_auth,
                    sp_env_auth,
                    browser_auth,
                    managed_identity_auth,
                    tenant_id,
                    azure_region,
                    subscription_id,
                    config_file,
                    fixer_config,
                )
            assert exception.type == AzureBrowserAuthNoTenantIDError
            assert (
                exception.value.args[0]
                == "[2004] Azure Tenant ID (--tenant-id) is required for browser authentication mode"
            )

    def test_azure_provider_not_browser_auth_but_tenant_id(self):
        subscription_id = None

        tenant_id = "test-tenant-id"
        # We need to set exactly one auth method
        az_cli_auth = None
        sp_env_auth = None
        browser_auth = False
        managed_identity_auth = None
        config_file = default_config_file_path
        fixer_config = default_fixer_config_file_path
        azure_region = "AzureCloud"

        with (
            patch(
                "prowler.providers.azure.azure_provider.AzureProvider.setup_identity",
                return_value=AzureIdentityInfo(),
            ),
            patch(
                "prowler.providers.azure.azure_provider.AzureProvider.get_locations",
                return_value={},
            ),
        ):
            with pytest.raises(AzureTenantIDNoBrowserAuthError) as exception:
                _ = AzureProvider(
                    az_cli_auth,
                    sp_env_auth,
                    browser_auth,
                    managed_identity_auth,
                    tenant_id,
                    azure_region,
                    subscription_id,
                    config_file,
                    fixer_config,
                )
            assert exception.type == AzureTenantIDNoBrowserAuthError
            assert (
                exception.value.args[0]
                == "[2005] Azure Tenant ID (--tenant-id) is required for browser authentication mode"
            )

    def test_test_connection_browser_auth(self):
        with (
            patch(
                "prowler.providers.azure.azure_provider.DefaultAzureCredential"
            ) as mock_default_credential,
            patch(
                "prowler.providers.azure.azure_provider.AzureProvider.setup_session"
            ) as mock_setup_session,
            patch(
                "prowler.providers.azure.azure_provider.SubscriptionClient"
            ) as mock_resource_client,
        ):
            # Mock the return value of DefaultAzureCredential
            mock_credentials = MagicMock()
            mock_credentials.get_token.return_value = AccessToken(
                token="fake_token", expires_on=9999999999
            )
            mock_default_credential.return_value = mock_credentials

            # Mock setup_session to return a mocked session object
            mock_session = MagicMock()
            mock_setup_session.return_value = mock_session

            # Mock ResourceManagementClient to avoid real API calls
            mock_client = MagicMock()
            mock_resource_client.return_value = mock_client

            test_connection = AzureProvider.test_connection(
                browser_auth=True,
                tenant_id=str(uuid4()),
                region="AzureCloud",
                raise_on_exception=False,
            )

            assert isinstance(test_connection, Connection)
            assert test_connection.is_connected
            assert test_connection.error is None

    def test_test_connection_tenant_id_client_id_client_secret(self):
        with (
            patch(
                "prowler.providers.azure.azure_provider.DefaultAzureCredential"
            ) as mock_default_credential,
            patch(
                "prowler.providers.azure.azure_provider.AzureProvider.setup_session"
            ) as mock_setup_session,
            patch(
                "prowler.providers.azure.azure_provider.SubscriptionClient"
            ) as mock_resource_client,
            patch(
                "prowler.providers.azure.azure_provider.AzureProvider.validate_static_credentials"
            ) as mock_validate_static_credentials,
        ):
            # Mock the return value of DefaultAzureCredential
            mock_credentials = MagicMock()
            mock_credentials.get_token.return_value = AccessToken(
                token="fake_token", expires_on=9999999999
            )
            mock_default_credential.return_value = {
                "client_id": str(uuid4()),
                "client_secret": str(uuid4()),
                "tenant_id": str(uuid4()),
            }

            # Mock setup_session to return a mocked session object
            mock_session = MagicMock()
            mock_setup_session.return_value = mock_session

            # Mock ValidateStaticCredentials to avoid real API calls
            mock_validate_static_credentials.return_value = None

            # Mock ResourceManagementClient to avoid real API calls
            mock_client = MagicMock()
            mock_resource_client.return_value = mock_client

            test_connection = AzureProvider.test_connection(
                browser_auth=False,
                tenant_id=str(uuid4()),
                region="AzureCloud",
                raise_on_exception=False,
                client_id=str(uuid4()),
                client_secret=str(uuid4()),
            )

            assert isinstance(test_connection, Connection)
            assert test_connection.is_connected
            assert test_connection.error is None

    def test_test_connection_provider_validation(self):
        with (
            patch(
                "prowler.providers.azure.azure_provider.DefaultAzureCredential"
            ) as mock_default_credential,
            patch(
                "prowler.providers.azure.azure_provider.AzureProvider.setup_session"
            ) as mock_setup_session,
            patch(
                "prowler.providers.azure.azure_provider.SubscriptionClient"
            ) as mock_resource_client,
            patch(
                "prowler.providers.azure.azure_provider.AzureProvider.validate_static_credentials"
            ) as mock_validate_static_credentials,
        ):
            # Mock the return value of DefaultAzureCredential
            mock_default_credential.return_value = {
                "client_id": str(uuid4()),
                "client_secret": str(uuid4()),
                "tenant_id": str(uuid4()),
            }

            # Mock setup_session to return a mocked session object
            mock_session = MagicMock()
            mock_setup_session.return_value = mock_session

            # Mock ValidateStaticCredentials to avoid real API calls
            mock_validate_static_credentials.return_value = None

            # Mock ResourceManagementClient to avoid real API calls
            mock_subscription = MagicMock()
            mock_subscription.subscription_id = "test_provider_id"
            mock_return_value = MagicMock()
            mock_return_value.subscriptions.list.return_value = [mock_subscription]
            mock_resource_client.return_value = mock_return_value

            test_connection = AzureProvider.test_connection(
                browser_auth=False,
                tenant_id=str(uuid4()),
                region="AzureCloud",
                raise_on_exception=False,
                client_id=str(uuid4()),
                client_secret=str(uuid4()),
                provider_id="test_provider_id",
            )

            assert isinstance(test_connection, Connection)
            assert test_connection.is_connected
            assert test_connection.error is None

    def test_test_connection_provider_validation_error(self):
        with (
            patch(
                "prowler.providers.azure.azure_provider.DefaultAzureCredential"
            ) as mock_default_credential,
            patch(
                "prowler.providers.azure.azure_provider.AzureProvider.setup_session"
            ) as mock_setup_session,
            patch(
                "prowler.providers.azure.azure_provider.SubscriptionClient"
            ) as mock_resource_client,
            patch(
                "prowler.providers.azure.azure_provider.AzureProvider.validate_static_credentials"
            ) as mock_validate_static_credentials,
        ):
            # Mock the return value of DefaultAzureCredential
            mock_default_credential.return_value = {
                "client_id": str(uuid4()),
                "client_secret": str(uuid4()),
                "tenant_id": str(uuid4()),
            }

            # Mock setup_session to return a mocked session object
            mock_session = MagicMock()
            mock_setup_session.return_value = mock_session

            # Mock ValidateStaticCredentials to avoid real API calls
            mock_validate_static_credentials.return_value = None

            # Mock ResourceManagementClient to avoid real API calls
            mock_subscription = MagicMock()
            mock_subscription.subscription_id = "test_invalid_provider_id"
            mock_return_value = MagicMock()
            mock_return_value.subscriptions.list.return_value = [mock_subscription]
            mock_resource_client.return_value = mock_return_value

            test_connection = AzureProvider.test_connection(
                browser_auth=False,
                tenant_id=str(uuid4()),
                region="AzureCloud",
                raise_on_exception=False,
                client_id=str(uuid4()),
                client_secret=str(uuid4()),
                provider_id="test_provider_id",
            )

            assert test_connection.error is not None
            assert isinstance(test_connection.error, AzureInvalidProviderIdError)
            assert (
                "The provided credentials are not valid for the specified Azure subscription."
                in test_connection.error.args[0]
            )

    def test_test_connection_with_ClientAuthenticationError(self):
        with pytest.raises(AzureHTTPResponseError) as exception:
            tenant_id = str(uuid4())
            AzureProvider.test_connection(
                browser_auth=True,
                tenant_id=tenant_id,
                region="AzureCloud",
            )

        assert exception.type == AzureHTTPResponseError
        assert (
            exception.value.args[0]
            == f"[2010] Error in HTTP response from Azure - Authentication failed: Unable to get authority configuration for https://login.microsoftonline.com/{tenant_id}. Authority would typically be in a format of https://login.microsoftonline.com/your_tenant or https://tenant_name.ciamlogin.com or https://tenant_name.b2clogin.com/tenant.onmicrosoft.com/policy.  Also please double check your tenant name or GUID is correct."
        )

    def test_test_connection_without_any_method(self):
        with pytest.raises(AzureNoAuthenticationMethodError) as exception:
            AzureProvider.test_connection()

        assert exception.type == AzureNoAuthenticationMethodError
        assert (
            "[2003] Azure provider requires at least one authentication method set: [--az-cli-auth | --sp-env-auth | --browser-auth | --managed-identity-auth]"
            in exception.value.args[0]
        )

    def test_test_connection_with_httpresponseerror(self):
        with (
            patch(
                "prowler.providers.azure.azure_provider.AzureProvider.get_locations",
                return_value={},
            ),
            patch(
                "prowler.providers.azure.azure_provider.AzureProvider.setup_session"
            ) as mock_setup_session,
        ):
            mock_setup_session.side_effect = AzureHTTPResponseError(
                file="test_file", original_exception="Simulated HttpResponseError"
            )

            with pytest.raises(AzureHTTPResponseError) as exception:
                AzureProvider.test_connection(
                    az_cli_auth=True,
                    raise_on_exception=True,
                )

            assert exception.type == AzureHTTPResponseError
            assert (
                exception.value.args[0]
                == "[2010] Error in HTTP response from Azure - Simulated HttpResponseError"
            )

    def test_test_connection_with_exception(self):
        with patch(
            "prowler.providers.azure.azure_provider.AzureProvider.setup_session"
        ) as mock_setup_session:
            mock_setup_session.side_effect = Exception("Simulated Exception")

            with pytest.raises(Exception) as exception:
                AzureProvider.test_connection(
                    sp_env_auth=True,
                    raise_on_exception=True,
                )

            assert exception.type is Exception
            assert exception.value.args[0] == "Simulated Exception"

    @pytest.mark.parametrize(
        "subscription_ids, expected_regions",
        [
            (None, {"region1", "region2", "region3"}),
            (["sub1", "sub2"], {"region1", "region2", "region3"}),
            ("sub1", {"region1", "region2"}),
            ("not_exists", set()),
        ],
    )
    @patch("prowler.providers.azure.azure_provider.AzureProvider.get_locations")
    @patch(
        "prowler.providers.azure.azure_provider.AzureProvider.__init__",
        return_value=None,
    )
    def test_get_regions(
        self,
        azure_provider_init_mock,  # noqa: F841
        azure_get_locations_mock,
        subscription_ids,
        expected_regions,
    ):
        azure_get_locations_mock.return_value = {
            "sub1": ["region1", "region2"],
            "sub2": ["region2", "region3"],
        }

        azure_provider = AzureProvider()
        regions = azure_provider.get_regions(subscription_ids=subscription_ids)

        assert regions == expected_regions
```

--------------------------------------------------------------------------------

---[FILE: azure_mutelist_test.py]---
Location: prowler-master/tests/providers/azure/lib/mutelist/azure_mutelist_test.py

```python
import yaml
from mock import MagicMock

from prowler.providers.azure.lib.mutelist.mutelist import AzureMutelist
from tests.lib.outputs.fixtures.fixtures import generate_finding_output

MUTELIST_FIXTURE_PATH = (
    "tests/providers/azure/lib/mutelist/fixtures/azure_mutelist.yaml"
)


class TestAzureMutelist:
    def test_get_mutelist_file_from_local_file(self):
        mutelist = AzureMutelist(mutelist_path=MUTELIST_FIXTURE_PATH)

        with open(MUTELIST_FIXTURE_PATH) as f:
            mutelist_fixture = yaml.safe_load(f)["Mutelist"]

        assert mutelist.mutelist == mutelist_fixture
        assert mutelist.mutelist_file_path == MUTELIST_FIXTURE_PATH

    def test_get_mutelist_file_from_local_file_non_existent(self):
        mutelist_path = "tests/lib/mutelist/fixtures/not_present"
        mutelist = AzureMutelist(mutelist_path=mutelist_path)

        assert mutelist.mutelist == {}
        assert mutelist.mutelist_file_path == mutelist_path

    def test_validate_mutelist_not_valid_key(self):
        mutelist_path = MUTELIST_FIXTURE_PATH
        with open(mutelist_path) as f:
            mutelist_fixture = yaml.safe_load(f)["Mutelist"]

        mutelist_fixture["Accounts1"] = mutelist_fixture["Accounts"]
        del mutelist_fixture["Accounts"]

        mutelist = AzureMutelist(mutelist_content=mutelist_fixture)

        assert len(mutelist.validate_mutelist(mutelist_fixture)) == 0
        assert mutelist.mutelist == {}
        assert mutelist.mutelist_file_path is None

    def test_is_finding_muted_subscription_name(self):
        # Mutelist
        mutelist_content = {
            "Accounts": {
                "subscription_1": {
                    "Checks": {
                        "check_test": {
                            "Regions": ["*"],
                            "Resources": ["test_resource"],
                        }
                    }
                }
            }
        }

        mutelist = AzureMutelist(mutelist_content=mutelist_content)

        finding = MagicMock
        finding.check_metadata = MagicMock
        finding.check_metadata.CheckID = "check_test"
        finding.location = "West Europe"
        finding.status = "FAIL"
        finding.resource_name = "test_resource"
        finding.resource_tags = {}
        finding.subscription = "subscription_1"

        assert mutelist.is_finding_muted(
            finding, "12345678-1234-1234-1234-123456789012"
        )

    def test_is_finding_muted_subscription_id(self):
        # Mutelist
        mutelist_content = {
            "Accounts": {
                "12345678-1234-1234-1234-123456789012": {
                    "Checks": {
                        "check_test": {
                            "Regions": ["*"],
                            "Resources": ["test_resource"],
                        }
                    }
                }
            }
        }

        mutelist = AzureMutelist(mutelist_content=mutelist_content)

        finding = MagicMock
        finding.check_metadata = MagicMock
        finding.check_metadata.CheckID = "check_test"
        finding.location = "West Europe"
        finding.status = "FAIL"
        finding.resource_name = "test_resource"
        finding.resource_tags = {}
        finding.subscription = "subscription_1"

        assert mutelist.is_finding_muted(
            finding, "12345678-1234-1234-1234-123456789012"
        )

    def test_mute_finding(self):
        # Mutelist
        mutelist_content = {
            "Accounts": {
                "subscription_1": {
                    "Checks": {
                        "check_test": {
                            "Regions": ["*"],
                            "Resources": ["test_resource"],
                        }
                    }
                }
            }
        }

        mutelist = AzureMutelist(mutelist_content=mutelist_content)

        finding_1 = generate_finding_output(
            check_id="service_check_test",
            status="FAIL",
            account_uid="subscription_1",
            region="subscription_1",
            resource_uid="test_resource",
            resource_tags={},
            muted=False,
        )

        muted_finding = mutelist.mute_finding(finding=finding_1)

        assert muted_finding.status == "MUTED"
        assert muted_finding.muted is True
        assert muted_finding.raw["status"] == "FAIL"
```

--------------------------------------------------------------------------------

---[FILE: azure_mutelist.yaml]---
Location: prowler-master/tests/providers/azure/lib/mutelist/fixtures/azure_mutelist.yaml

```yaml
### Account, Check and/or Region can be * to apply for all the cases.
### Resources and tags are lists that can have either Regex or Keywords.
### Tags is an optional list that matches on tuples of 'key=value' and are "ANDed" together.
### Use an alternation Regex to match one of multiple tags with "ORed" logic.
### For each check you can except Accounts, Regions, Resources and/or Tags.
###########################  MUTELIST EXAMPLE  ###########################
Mutelist:
  Accounts:
    "subscription_1":
      Checks:
        "aks_cluster_rbac_enabled":
          Regions:
            - "*"
          Resources:
            - "resource_1"
            - "resource_2"
```

--------------------------------------------------------------------------------

---[FILE: regions_test.py]---
Location: prowler-master/tests/providers/azure/lib/regions/regions_test.py

```python
from azure.identity import AzureAuthorityHosts

from prowler.providers.azure.lib.regions.regions import (
    AZURE_CHINA_CLOUD,
    AZURE_GENERIC_CLOUD,
    AZURE_US_GOV_CLOUD,
    get_regions_config,
)


class Test_azure_regions:
    def test_get_regions_config(self):
        allowed_regions = [
            "AzureCloud",
            "AzureChinaCloud",
            "AzureUSGovernment",
        ]
        expected_output = {
            "AzureCloud": {
                "authority": None,
                "base_url": AZURE_GENERIC_CLOUD,
                "credential_scopes": [AZURE_GENERIC_CLOUD + "/.default"],
            },
            "AzureChinaCloud": {
                "authority": AzureAuthorityHosts.AZURE_CHINA,
                "base_url": AZURE_CHINA_CLOUD,
                "credential_scopes": [AZURE_CHINA_CLOUD + "/.default"],
            },
            "AzureUSGovernment": {
                "authority": AzureAuthorityHosts.AZURE_GOVERNMENT,
                "base_url": AZURE_US_GOV_CLOUD,
                "credential_scopes": [AZURE_US_GOV_CLOUD + "/.default"],
            },
        }

        for region in allowed_regions:
            region_config = get_regions_config(region)
            assert region_config == expected_output[region]
```

--------------------------------------------------------------------------------

---[FILE: aisearch_service_test.py]---
Location: prowler-master/tests/providers/azure/services/aisearch/aisearch_service_test.py

```python
from unittest.mock import patch

from prowler.providers.azure.services.aisearch.aisearch_service import (
    AISearch,
    AISearchService,
)
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


def mock_storage_get_aisearch_services(_):
    return {
        AZURE_SUBSCRIPTION_ID: {
            "aisearch_service_id-1": AISearchService(
                id="aisearch_service_id-1",
                name="name",
                location="westeurope",
                public_network_access=True,
            )
        }
    }


@patch(
    "prowler.providers.azure.services.aisearch.aisearch_service.AISearch._get_aisearch_services",
    new=mock_storage_get_aisearch_services,
)
class Test_AISearch_Service:
    def test_get_client(self):
        aisearch = AISearch(set_mocked_azure_provider())
        assert (
            aisearch.clients[AZURE_SUBSCRIPTION_ID].__class__.__name__
            == "SearchManagementClient"
        )

    def test_get_aisearch_services(self):
        aisearch = AISearch(set_mocked_azure_provider())
        assert (
            aisearch.aisearch_services[AZURE_SUBSCRIPTION_ID][
                "aisearch_service_id-1"
            ].__class__.__name__
            == "AISearchService"
        )
        assert (
            aisearch.aisearch_services[AZURE_SUBSCRIPTION_ID][
                "aisearch_service_id-1"
            ].name
            == "name"
        )
        assert (
            aisearch.aisearch_services[AZURE_SUBSCRIPTION_ID][
                "aisearch_service_id-1"
            ].location
            == "westeurope"
        )
        assert aisearch.aisearch_services[AZURE_SUBSCRIPTION_ID][
            "aisearch_service_id-1"
        ].public_network_access
```

--------------------------------------------------------------------------------

---[FILE: aisearch_service_public_access_level_is_disabled_test.py]---
Location: prowler-master/tests/providers/azure/services/aisearch/aisearch_service_public_access_level_is_disabled/aisearch_service_public_access_level_is_disabled_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.aisearch.aisearch_service import AISearchService
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_AISearch_service_not_publicly_accessible:
    def test_aisearch_sevice_no_aisearch_services(self):
        aisearch_client = mock.MagicMock
        aisearch_client.aisearch_services = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.aisearch.aisearch_service_not_publicly_accessible.aisearch_service_not_publicly_accessible.aisearch_client",
                new=aisearch_client,
            ),
        ):
            from prowler.providers.azure.services.aisearch.aisearch_service_not_publicly_accessible.aisearch_service_not_publicly_accessible import (
                aisearch_service_not_publicly_accessible,
            )

            check = aisearch_service_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 0

    def test_aisearch_service_not_publicly_accessible_enabled(self):
        aisearch_service_id = str(uuid4())
        aisearch_service_name = "Test AISearch Service"
        aisearch_client = mock.MagicMock
        aisearch_client.aisearch_services = {
            AZURE_SUBSCRIPTION_ID: {
                aisearch_service_id: AISearchService(
                    id=aisearch_service_id,
                    name=aisearch_service_name,
                    location="westeurope",
                    public_network_access=True,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.aisearch.aisearch_service_not_publicly_accessible.aisearch_service_not_publicly_accessible.aisearch_client",
                new=aisearch_client,
            ),
        ):
            from prowler.providers.azure.services.aisearch.aisearch_service_not_publicly_accessible.aisearch_service_not_publicly_accessible import (
                aisearch_service_not_publicly_accessible,
            )

            check = aisearch_service_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"AISearch Service {aisearch_service_name} from subscription {AZURE_SUBSCRIPTION_ID} allows public access."
            )
            assert result[0].resource_id == aisearch_service_id
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == aisearch_service_name
            assert result[0].location == "westeurope"

    def test_aisearch_service_not_publicly_accessible_disabled(self):
        aisearch_service_id = str(uuid4())
        aisearch_service_name = "Test Search Service"
        aisearch_client = mock.MagicMock
        aisearch_client.aisearch_services = {
            AZURE_SUBSCRIPTION_ID: {
                aisearch_service_id: AISearchService(
                    id=aisearch_service_id,
                    name=aisearch_service_name,
                    location="westeurope",
                    public_network_access=False,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.aisearch.aisearch_service_not_publicly_accessible.aisearch_service_not_publicly_accessible.aisearch_client",
                new=aisearch_client,
            ),
        ):
            from prowler.providers.azure.services.aisearch.aisearch_service_not_publicly_accessible.aisearch_service_not_publicly_accessible import (
                aisearch_service_not_publicly_accessible,
            )

            check = aisearch_service_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"AISearch Service {aisearch_service_name} from subscription {AZURE_SUBSCRIPTION_ID} does not allows public access."
            )
            assert result[0].resource_id == aisearch_service_id
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == aisearch_service_name
            assert result[0].resource_id == aisearch_service_id
            assert result[0].location == "westeurope"
```

--------------------------------------------------------------------------------

---[FILE: aks_service_test.py]---
Location: prowler-master/tests/providers/azure/services/aks/aks_service_test.py

```python
from unittest.mock import patch

from prowler.providers.azure.services.aks.aks_service import AKS, Cluster
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


def mock_aks_get_clusters(_):
    return {
        AZURE_SUBSCRIPTION_ID: {
            "cluster_id-1": Cluster(
                id="cluster_id-1",
                name="cluster_name",
                public_fqdn="public_fqdn",
                private_fqdn="private_fqdn",
                network_policy="network_policy",
                agent_pool_profiles=[],
                location="westeurope",
                rbac_enabled=True,
            )
        }
    }


@patch(
    "prowler.providers.azure.services.aks.aks_service.AKS._get_clusters",
    new=mock_aks_get_clusters,
)
class Test_AKS_Service:
    def test_get_client(self):
        aks = AKS(set_mocked_azure_provider())
        assert (
            aks.clients[AZURE_SUBSCRIPTION_ID].__class__.__name__
            == "ContainerServiceClient"
        )

    def test__get_subscriptions__(self):
        aks = AKS(set_mocked_azure_provider())
        assert aks.subscriptions.__class__.__name__ == "dict"

    def test_get_components(self):
        aks = AKS(set_mocked_azure_provider())
        assert len(aks.clusters) == 1
        assert (
            aks.clusters[AZURE_SUBSCRIPTION_ID]["cluster_id-1"].name == "cluster_name"
        )
        assert (
            aks.clusters[AZURE_SUBSCRIPTION_ID]["cluster_id-1"].public_fqdn
            == "public_fqdn"
        )
        assert (
            aks.clusters[AZURE_SUBSCRIPTION_ID]["cluster_id-1"].private_fqdn
            == "private_fqdn"
        )
        assert (
            aks.clusters[AZURE_SUBSCRIPTION_ID]["cluster_id-1"].network_policy
            == "network_policy"
        )
        assert (
            aks.clusters[AZURE_SUBSCRIPTION_ID]["cluster_id-1"].agent_pool_profiles
            == []
        )
        assert (
            aks.clusters[AZURE_SUBSCRIPTION_ID]["cluster_id-1"].location == "westeurope"
        )
        assert aks.clusters[AZURE_SUBSCRIPTION_ID]["cluster_id-1"].rbac_enabled
```

--------------------------------------------------------------------------------

````
