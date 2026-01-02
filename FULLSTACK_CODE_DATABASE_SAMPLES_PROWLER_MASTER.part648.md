---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 648
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 648 of 867)

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

---[FILE: aks_clusters_created_with_private_nodes_test.py]---
Location: prowler-master/tests/providers/azure/services/aks/aks_clusters_created_with_private_nodes/aks_clusters_created_with_private_nodes_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.aks.aks_service import Cluster
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_aks_clusters_created_with_private_nodes:
    def test_aks_no_subscriptions(self):
        aks_client = mock.MagicMock
        aks_client.clusters = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.aks.aks_clusters_created_with_private_nodes.aks_clusters_created_with_private_nodes.aks_client",
                new=aks_client,
            ),
        ):
            from prowler.providers.azure.services.aks.aks_clusters_created_with_private_nodes.aks_clusters_created_with_private_nodes import (
                aks_clusters_created_with_private_nodes,
            )

            check = aks_clusters_created_with_private_nodes()
            result = check.execute()
            assert len(result) == 0

    def test_aks_subscription_empty(self):
        aks_client = mock.MagicMock
        aks_client.clusters = {AZURE_SUBSCRIPTION_ID: {}}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.aks.aks_clusters_created_with_private_nodes.aks_clusters_created_with_private_nodes.aks_client",
                new=aks_client,
            ),
        ):
            from prowler.providers.azure.services.aks.aks_clusters_created_with_private_nodes.aks_clusters_created_with_private_nodes import (
                aks_clusters_created_with_private_nodes,
            )

            check = aks_clusters_created_with_private_nodes()
            result = check.execute()
            assert len(result) == 0

    def test_aks_cluster_no_private_nodes(self):
        aks_client = mock.MagicMock
        cluster_id = str(uuid4())
        aks_client.clusters = {
            AZURE_SUBSCRIPTION_ID: {
                cluster_id: Cluster(
                    id=cluster_id,
                    name="cluster_name",
                    public_fqdn="public_fqdn",
                    private_fqdn="",
                    network_policy="network_policy",
                    agent_pool_profiles=[mock.MagicMock(enable_node_public_ip=True)],
                    location="westeurope",
                    rbac_enabled=True,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.aks.aks_clusters_created_with_private_nodes.aks_clusters_created_with_private_nodes.aks_client",
                new=aks_client,
            ),
        ):
            from prowler.providers.azure.services.aks.aks_clusters_created_with_private_nodes.aks_clusters_created_with_private_nodes import (
                aks_clusters_created_with_private_nodes,
            )

            check = aks_clusters_created_with_private_nodes()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Cluster 'cluster_name' was not created with private nodes in subscription '{AZURE_SUBSCRIPTION_ID}'"
            )
            assert result[0].resource_id == cluster_id
            assert result[0].resource_name == "cluster_name"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "westeurope"

    def test_aks_cluster_private_nodes(self):
        aks_client = mock.MagicMock
        cluster_id = str(uuid4())
        aks_client.clusters = {
            AZURE_SUBSCRIPTION_ID: {
                cluster_id: Cluster(
                    id=cluster_id,
                    name="cluster_name",
                    public_fqdn="public_fqdn",
                    private_fqdn="private_fqdn",
                    network_policy="network_policy",
                    agent_pool_profiles=[mock.MagicMock(enable_node_public_ip=False)],
                    location="westeurope",
                    rbac_enabled=True,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.aks.aks_clusters_created_with_private_nodes.aks_clusters_created_with_private_nodes.aks_client",
                new=aks_client,
            ),
        ):
            from prowler.providers.azure.services.aks.aks_clusters_created_with_private_nodes.aks_clusters_created_with_private_nodes import (
                aks_clusters_created_with_private_nodes,
            )

            check = aks_clusters_created_with_private_nodes()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Cluster 'cluster_name' was created with private nodes in subscription '{AZURE_SUBSCRIPTION_ID}'"
            )
            assert result[0].resource_id == cluster_id
            assert result[0].resource_name == "cluster_name"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "westeurope"

    def test_aks_cluster_public_and_private_nodes(self):
        aks_client = mock.MagicMock
        cluster_id = str(uuid4())
        aks_client.clusters = {
            AZURE_SUBSCRIPTION_ID: {
                cluster_id: Cluster(
                    id=cluster_id,
                    name="cluster_name",
                    public_fqdn="public_fqdn",
                    private_fqdn="private_fqdn",
                    network_policy="network_policy",
                    agent_pool_profiles=[
                        mock.MagicMock(enable_node_public_ip=False),
                        mock.MagicMock(enable_node_public_ip=True),
                        mock.MagicMock(enable_node_public_ip=False),
                    ],
                    location="westeurope",
                    rbac_enabled=True,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.aks.aks_clusters_created_with_private_nodes.aks_clusters_created_with_private_nodes.aks_client",
                new=aks_client,
            ),
        ):
            from prowler.providers.azure.services.aks.aks_clusters_created_with_private_nodes.aks_clusters_created_with_private_nodes import (
                aks_clusters_created_with_private_nodes,
            )

            check = aks_clusters_created_with_private_nodes()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Cluster 'cluster_name' was not created with private nodes in subscription '{AZURE_SUBSCRIPTION_ID}'"
            )
            assert result[0].resource_id == cluster_id
            assert result[0].resource_name == "cluster_name"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "westeurope"
```

--------------------------------------------------------------------------------

---[FILE: aks_clusters_public_access_disabled_test.py]---
Location: prowler-master/tests/providers/azure/services/aks/aks_clusters_public_access_disabled/aks_clusters_public_access_disabled_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.aks.aks_service import Cluster
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_aks_clusters_public_access_disabled:
    def test_aks_no_subscriptions(self):
        aks_client = mock.MagicMock
        aks_client.clusters = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.aks.aks_clusters_public_access_disabled.aks_clusters_public_access_disabled.aks_client",
                new=aks_client,
            ),
        ):
            from prowler.providers.azure.services.aks.aks_clusters_public_access_disabled.aks_clusters_public_access_disabled import (
                aks_clusters_public_access_disabled,
            )

            check = aks_clusters_public_access_disabled()
            result = check.execute()
            assert len(result) == 0

    def test_aks_subscription_empty(self):
        aks_client = mock.MagicMock
        aks_client.clusters = {AZURE_SUBSCRIPTION_ID: {}}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.aks.aks_clusters_public_access_disabled.aks_clusters_public_access_disabled.aks_client",
                new=aks_client,
            ),
        ):
            from prowler.providers.azure.services.aks.aks_clusters_public_access_disabled.aks_clusters_public_access_disabled import (
                aks_clusters_public_access_disabled,
            )

            check = aks_clusters_public_access_disabled()
            result = check.execute()
            assert len(result) == 0

    def test_aks_cluster_public_fqdn(self):
        aks_client = mock.MagicMock
        cluster_id = str(uuid4())
        aks_client.clusters = {
            AZURE_SUBSCRIPTION_ID: {
                cluster_id: Cluster(
                    id=cluster_id,
                    name="cluster_name",
                    public_fqdn="public_fqdn",
                    private_fqdn=None,
                    network_policy="network_policy",
                    agent_pool_profiles=[mock.MagicMock(enable_node_public_ip=False)],
                    location="westeurope",
                    rbac_enabled=True,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.aks.aks_clusters_public_access_disabled.aks_clusters_public_access_disabled.aks_client",
                new=aks_client,
            ),
        ):
            from prowler.providers.azure.services.aks.aks_clusters_public_access_disabled.aks_clusters_public_access_disabled import (
                aks_clusters_public_access_disabled,
            )

            check = aks_clusters_public_access_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Public access to nodes is enabled for cluster 'cluster_name' in subscription '{AZURE_SUBSCRIPTION_ID}'"
            )
            assert result[0].resource_id == cluster_id
            assert result[0].resource_name == "cluster_name"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "westeurope"

    def test_aks_cluster_private_fqdn(self):
        aks_client = mock.MagicMock
        cluster_id = str(uuid4())
        aks_client.clusters = {
            AZURE_SUBSCRIPTION_ID: {
                cluster_id: Cluster(
                    id=cluster_id,
                    name="cluster_name",
                    public_fqdn="public_fqdn",
                    private_fqdn="private_fqdn",
                    network_policy="network_policy",
                    agent_pool_profiles=[mock.MagicMock(enable_node_public_ip=False)],
                    location="westeurope",
                    rbac_enabled=True,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.aks.aks_clusters_public_access_disabled.aks_clusters_public_access_disabled.aks_client",
                new=aks_client,
            ),
        ):
            from prowler.providers.azure.services.aks.aks_clusters_public_access_disabled.aks_clusters_public_access_disabled import (
                aks_clusters_public_access_disabled,
            )

            check = aks_clusters_public_access_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Public access to nodes is disabled for cluster 'cluster_name' in subscription '{AZURE_SUBSCRIPTION_ID}'"
            )
            assert result[0].resource_id == cluster_id
            assert result[0].resource_name == "cluster_name"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "westeurope"

    def test_aks_cluster_private_fqdn_with_public_ip(self):
        aks_client = mock.MagicMock
        cluster_id = str(uuid4())
        aks_client.clusters = {
            AZURE_SUBSCRIPTION_ID: {
                cluster_id: Cluster(
                    id=cluster_id,
                    name="cluster_name",
                    public_fqdn="public_fqdn",
                    private_fqdn="private_fqdn",
                    network_policy="network_policy",
                    agent_pool_profiles=[mock.MagicMock(enable_node_public_ip=True)],
                    location="westeurope",
                    rbac_enabled=True,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.aks.aks_clusters_public_access_disabled.aks_clusters_public_access_disabled.aks_client",
                new=aks_client,
            ),
        ):
            from prowler.providers.azure.services.aks.aks_clusters_public_access_disabled.aks_clusters_public_access_disabled import (
                aks_clusters_public_access_disabled,
            )

            check = aks_clusters_public_access_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Public access to nodes is enabled for cluster 'cluster_name' in subscription '{AZURE_SUBSCRIPTION_ID}'"
            )
            assert result[0].resource_id == cluster_id
            assert result[0].resource_name == "cluster_name"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "westeurope"
```

--------------------------------------------------------------------------------

---[FILE: aks_cluster_rbac_enabled_test.py]---
Location: prowler-master/tests/providers/azure/services/aks/aks_cluster_rbac_enabled/aks_cluster_rbac_enabled_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.aks.aks_service import Cluster
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_aks_cluster_rbac_enabled:
    def test_aks_no_subscriptions(self):
        aks_client = mock.MagicMock
        aks_client.clusters = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.aks.aks_cluster_rbac_enabled.aks_cluster_rbac_enabled.aks_client",
                new=aks_client,
            ),
        ):
            from prowler.providers.azure.services.aks.aks_cluster_rbac_enabled.aks_cluster_rbac_enabled import (
                aks_cluster_rbac_enabled,
            )

            check = aks_cluster_rbac_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_aks_subscription_empty(self):
        aks_client = mock.MagicMock
        aks_client.clusters = {AZURE_SUBSCRIPTION_ID: {}}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.aks.aks_cluster_rbac_enabled.aks_cluster_rbac_enabled.aks_client",
                new=aks_client,
            ),
        ):
            from prowler.providers.azure.services.aks.aks_cluster_rbac_enabled.aks_cluster_rbac_enabled import (
                aks_cluster_rbac_enabled,
            )

            check = aks_cluster_rbac_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_aks_cluster_rbac_enabled(self):
        aks_client = mock.MagicMock
        cluster_id = str(uuid4())
        aks_client.clusters = {
            AZURE_SUBSCRIPTION_ID: {
                cluster_id: Cluster(
                    id=cluster_id,
                    name="cluster_name",
                    public_fqdn="public_fqdn",
                    private_fqdn=None,
                    network_policy="network_policy",
                    agent_pool_profiles=[mock.MagicMock(enable_node_public_ip=False)],
                    location="westeurope",
                    rbac_enabled=True,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.aks.aks_cluster_rbac_enabled.aks_cluster_rbac_enabled.aks_client",
                new=aks_client,
            ),
        ):
            from prowler.providers.azure.services.aks.aks_cluster_rbac_enabled.aks_cluster_rbac_enabled import (
                aks_cluster_rbac_enabled,
            )

            check = aks_cluster_rbac_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"RBAC is enabled for cluster 'cluster_name' in subscription '{AZURE_SUBSCRIPTION_ID}'."
            )
            assert result[0].resource_name == "cluster_name"
            assert result[0].resource_id == cluster_id
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "westeurope"

    def test_aks_rbac_not_enabled(self):
        aks_client = mock.MagicMock
        cluster_id = str(uuid4())
        aks_client.clusters = {
            AZURE_SUBSCRIPTION_ID: {
                cluster_id: Cluster(
                    id=cluster_id,
                    name="cluster_name",
                    public_fqdn="public_fqdn",
                    private_fqdn=None,
                    network_policy="network_policy",
                    agent_pool_profiles=[mock.MagicMock(enable_node_public_ip=False)],
                    location="westeurope",
                    rbac_enabled=False,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.aks.aks_cluster_rbac_enabled.aks_cluster_rbac_enabled.aks_client",
                new=aks_client,
            ),
        ):
            from prowler.providers.azure.services.aks.aks_cluster_rbac_enabled.aks_cluster_rbac_enabled import (
                aks_cluster_rbac_enabled,
            )

            check = aks_cluster_rbac_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"RBAC is not enabled for cluster 'cluster_name' in subscription '{AZURE_SUBSCRIPTION_ID}'."
            )
            assert result[0].resource_name == "cluster_name"
            assert result[0].resource_id == cluster_id
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "westeurope"
```

--------------------------------------------------------------------------------

---[FILE: aks_network_policy_enabled_test.py]---
Location: prowler-master/tests/providers/azure/services/aks/aks_network_policy_enabled/aks_network_policy_enabled_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.aks.aks_service import Cluster
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_aks_network_policy_enabled:
    def test_aks_no_subscriptions(self):
        aks_client = mock.MagicMock
        aks_client.clusters = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.aks.aks_network_policy_enabled.aks_network_policy_enabled.aks_client",
                new=aks_client,
            ),
        ):
            from prowler.providers.azure.services.aks.aks_network_policy_enabled.aks_network_policy_enabled import (
                aks_network_policy_enabled,
            )

            check = aks_network_policy_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_aks_subscription_empty(self):
        aks_client = mock.MagicMock
        aks_client.clusters = {AZURE_SUBSCRIPTION_ID: {}}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.aks.aks_network_policy_enabled.aks_network_policy_enabled.aks_client",
                new=aks_client,
            ),
        ):
            from prowler.providers.azure.services.aks.aks_network_policy_enabled.aks_network_policy_enabled import (
                aks_network_policy_enabled,
            )

            check = aks_network_policy_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_aks_network_policy_enabled(self):
        aks_client = mock.MagicMock
        cluster_id = str(uuid4())
        aks_client.clusters = {
            AZURE_SUBSCRIPTION_ID: {
                cluster_id: Cluster(
                    id=cluster_id,
                    name="cluster_name",
                    public_fqdn="public_fqdn",
                    private_fqdn=None,
                    network_policy="network_policy",
                    agent_pool_profiles=[mock.MagicMock(enable_node_public_ip=False)],
                    location="westeurope",
                    rbac_enabled=True,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.aks.aks_network_policy_enabled.aks_network_policy_enabled.aks_client",
                new=aks_client,
            ),
        ):
            from prowler.providers.azure.services.aks.aks_network_policy_enabled.aks_network_policy_enabled import (
                aks_network_policy_enabled,
            )

            check = aks_network_policy_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Network policy is enabled for cluster 'cluster_name' in subscription '{AZURE_SUBSCRIPTION_ID}'."
            )
            assert result[0].resource_name == "cluster_name"
            assert result[0].resource_id == cluster_id
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "westeurope"

    def test_aks_network_policy_disabled(self):
        aks_client = mock.MagicMock
        cluster_id = str(uuid4())
        aks_client.clusters = {
            AZURE_SUBSCRIPTION_ID: {
                cluster_id: Cluster(
                    id=cluster_id,
                    name="cluster_name",
                    public_fqdn="public_fqdn",
                    private_fqdn=None,
                    network_policy=None,
                    agent_pool_profiles=[mock.MagicMock(enable_node_public_ip=False)],
                    location="westeurope",
                    rbac_enabled=True,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.aks.aks_network_policy_enabled.aks_network_policy_enabled.aks_client",
                new=aks_client,
            ),
        ):
            from prowler.providers.azure.services.aks.aks_network_policy_enabled.aks_network_policy_enabled import (
                aks_network_policy_enabled,
            )

            check = aks_network_policy_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Network policy is not enabled for cluster 'cluster_name' in subscription '{AZURE_SUBSCRIPTION_ID}'."
            )
            assert result[0].resource_name == "cluster_name"
            assert result[0].resource_id == cluster_id
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "westeurope"
```

--------------------------------------------------------------------------------

````
