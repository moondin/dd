---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 547
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 547 of 867)

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

---[FILE: eks_cluster_kms_cmk_encryption_in_secrets_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/eks/eks_cluster_kms_cmk_encryption_in_secrets_enabled/eks_cluster_kms_cmk_encryption_in_secrets_enabled_test.py

```python
from unittest import mock

from prowler.providers.aws.services.eks.eks_service import EKSCluster
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_EU_WEST_1

cluster_name = "cluster_test"
cluster_arn = (
    f"arn:aws:eks:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:cluster/{cluster_name}"
)


class Test_eks_cluster_kms_cmk_encryption_in_secrets_enabled:
    def test_no_clusters(self):
        eks_client = mock.MagicMock
        eks_client.clusters = []
        with mock.patch(
            "prowler.providers.aws.services.eks.eks_service.EKS",
            eks_client,
        ):
            from prowler.providers.aws.services.eks.eks_cluster_kms_cmk_encryption_in_secrets_enabled.eks_cluster_kms_cmk_encryption_in_secrets_enabled import (
                eks_cluster_kms_cmk_encryption_in_secrets_enabled,
            )

            check = eks_cluster_kms_cmk_encryption_in_secrets_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_not_secrets_encryption(self):
        eks_client = mock.MagicMock
        eks_client.clusters = []
        eks_client.clusters.append(
            EKSCluster(
                name=cluster_name,
                arn=cluster_arn,
                region=AWS_REGION_EU_WEST_1,
                encryptionConfig=False,
            )
        )

        with mock.patch(
            "prowler.providers.aws.services.eks.eks_service.EKS",
            eks_client,
        ):
            from prowler.providers.aws.services.eks.eks_cluster_kms_cmk_encryption_in_secrets_enabled.eks_cluster_kms_cmk_encryption_in_secrets_enabled import (
                eks_cluster_kms_cmk_encryption_in_secrets_enabled,
            )

            check = eks_cluster_kms_cmk_encryption_in_secrets_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"EKS cluster {cluster_name} does not have encryption for Kubernetes secrets."
            )
            assert result[0].resource_id == cluster_name
            assert result[0].resource_arn == cluster_arn

    def test_secrets_encryption(self):
        eks_client = mock.MagicMock
        eks_client.clusters = []
        eks_client.clusters.append(
            EKSCluster(
                name=cluster_name,
                arn=cluster_arn,
                region=AWS_REGION_EU_WEST_1,
                encryptionConfig=True,
            )
        )

        with mock.patch(
            "prowler.providers.aws.services.eks.eks_service.EKS",
            eks_client,
        ):
            from prowler.providers.aws.services.eks.eks_cluster_kms_cmk_encryption_in_secrets_enabled.eks_cluster_kms_cmk_encryption_in_secrets_enabled import (
                eks_cluster_kms_cmk_encryption_in_secrets_enabled,
            )

            check = eks_cluster_kms_cmk_encryption_in_secrets_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"EKS cluster {cluster_name} has encryption for Kubernetes secrets."
            )
            assert result[0].resource_id == cluster_name
            assert result[0].resource_arn == cluster_arn
```

--------------------------------------------------------------------------------

---[FILE: eks_cluster_network_policy_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/eks/eks_cluster_network_policy_enabled/eks_cluster_network_policy_enabled_test.py

```python
from unittest import mock

from prowler.providers.aws.services.eks.eks_service import EKSCluster
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_EU_WEST_1

cluster_name = "cluster_test"
cluster_arn = (
    f"arn:aws:eks:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:cluster/{cluster_name}"
)


class Test_eks_cluster_network_policy_enabled:
    def test_no_clusters(self):
        eks_client = mock.MagicMock
        eks_client.clusters = []
        with mock.patch(
            "prowler.providers.aws.services.eks.eks_service.EKS",
            eks_client,
        ):
            from prowler.providers.aws.services.eks.eks_cluster_network_policy_enabled.eks_cluster_network_policy_enabled import (
                eks_cluster_network_policy_enabled,
            )

            check = eks_cluster_network_policy_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_cluster_without_sg(self):
        eks_client = mock.MagicMock
        eks_client.clusters = []
        eks_client.clusters.append(
            EKSCluster(
                name=cluster_name,
                arn=cluster_arn,
                region=AWS_REGION_EU_WEST_1,
                logging=None,
            )
        )

        with mock.patch(
            "prowler.providers.aws.services.eks.eks_service.EKS",
            eks_client,
        ):
            from prowler.providers.aws.services.eks.eks_cluster_network_policy_enabled.eks_cluster_network_policy_enabled import (
                eks_cluster_network_policy_enabled,
            )

            check = eks_cluster_network_policy_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"EKS cluster {cluster_name} does not have a Network Policy. Cluster security group ID is not set."
            )
            assert result[0].resource_id == cluster_name
            assert result[0].resource_arn == cluster_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1

    def test_cluster_with_sg(self):
        eks_client = mock.MagicMock
        eks_client.clusters = []
        eks_client.clusters.append(
            EKSCluster(
                name=cluster_name,
                arn=cluster_arn,
                region=AWS_REGION_EU_WEST_1,
                logging=None,
                security_group_id="sg-123456789",
            )
        )

        with mock.patch(
            "prowler.providers.aws.services.eks.eks_service.EKS",
            eks_client,
        ):
            from prowler.providers.aws.services.eks.eks_cluster_network_policy_enabled.eks_cluster_network_policy_enabled import (
                eks_cluster_network_policy_enabled,
            )

            check = eks_cluster_network_policy_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"EKS cluster {cluster_name} has a Network Policy with the security group sg-123456789."
            )
            assert result[0].resource_id == cluster_name
            assert result[0].resource_arn == cluster_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1
```

--------------------------------------------------------------------------------

---[FILE: eks_endpoints_not_publicly_accessible_test.py]---
Location: prowler-master/tests/providers/aws/services/eks/eks_cluster_not_publicly_accessible/eks_endpoints_not_publicly_accessible_test.py

```python
from unittest import mock

from prowler.providers.aws.services.eks.eks_service import EKSCluster
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_EU_WEST_1

cluster_name = "cluster_test"
cluster_arn = (
    f"arn:aws:eks:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:cluster/{cluster_name}"
)


class Test_eks_cluster_not_publicly_accessible:
    def test_no_clusters(self):
        eks_client = mock.MagicMock
        eks_client.clusters = []
        with mock.patch(
            "prowler.providers.aws.services.eks.eks_service.EKS",
            eks_client,
        ):
            from prowler.providers.aws.services.eks.eks_cluster_not_publicly_accessible.eks_cluster_not_publicly_accessible import (
                eks_cluster_not_publicly_accessible,
            )

            check = eks_cluster_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 0

    def test_cluster_public_access(self):
        eks_client = mock.MagicMock
        eks_client.clusters = []
        eks_client.clusters.append(
            EKSCluster(
                name=cluster_name,
                arn=cluster_arn,
                region=AWS_REGION_EU_WEST_1,
                logging=None,
                endpoint_public_access=True,
                endpoint_private_access=False,
                public_access_cidrs=["0.0.0.0/0"],
            )
        )

        with mock.patch(
            "prowler.providers.aws.services.eks.eks_service.EKS",
            eks_client,
        ):
            from prowler.providers.aws.services.eks.eks_cluster_not_publicly_accessible.eks_cluster_not_publicly_accessible import (
                eks_cluster_not_publicly_accessible,
            )

            check = eks_cluster_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                f"EKS cluster {cluster_name} is publicly accessible."
            )
            assert result[0].resource_id == cluster_name
            assert result[0].resource_arn == cluster_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1

    def test_endpoint_not_public_access(self):
        eks_client = mock.MagicMock
        eks_client.clusters = []
        eks_client.clusters.append(
            EKSCluster(
                name=cluster_name,
                arn=cluster_arn,
                region=AWS_REGION_EU_WEST_1,
                logging=None,
                endpoint_public_access=False,
                endpoint_private_access=True,
            )
        )

        with mock.patch(
            "prowler.providers.aws.services.eks.eks_service.EKS",
            eks_client,
        ):
            from prowler.providers.aws.services.eks.eks_cluster_not_publicly_accessible.eks_cluster_not_publicly_accessible import (
                eks_cluster_not_publicly_accessible,
            )

            check = eks_cluster_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                f"EKS cluster {cluster_name} is not publicly accessible."
            )
            assert result[0].resource_id == cluster_name
            assert result[0].resource_arn == cluster_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1
```

--------------------------------------------------------------------------------

---[FILE: eks_cluster_private_nodes_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/eks/eks_cluster_private_nodes_enabled/eks_cluster_private_nodes_enabled_test.py

```python
from unittest import mock

from prowler.providers.aws.services.eks.eks_service import EKSCluster
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_EU_WEST_1

cluster_name = "cluster_test"
cluster_arn = (
    f"arn:aws:eks:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:cluster/{cluster_name}"
)


class Test_eks_cluster_private_nodes_enabled:
    def test_no_clusters(self):
        eks_client = mock.MagicMock
        eks_client.clusters = []
        with mock.patch(
            "prowler.providers.aws.services.eks.eks_service.EKS",
            eks_client,
        ):
            from prowler.providers.aws.services.eks.eks_cluster_private_nodes_enabled.eks_cluster_private_nodes_enabled import (
                eks_cluster_private_nodes_enabled,
            )

            check = eks_cluster_private_nodes_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_cluster_with_private_nodes(self):
        eks_client = mock.MagicMock
        eks_client.clusters = []
        eks_client.clusters.append(
            EKSCluster(
                name=cluster_name,
                arn=cluster_arn,
                region=AWS_REGION_EU_WEST_1,
                logging=None,
                public_access_cidrs=["203.0.113.5/32"],
                endpoint_private_access=True,
            )
        )

        with mock.patch(
            "prowler.providers.aws.services.eks.eks_service.EKS",
            eks_client,
        ):
            from prowler.providers.aws.services.eks.eks_cluster_private_nodes_enabled.eks_cluster_private_nodes_enabled import (
                eks_cluster_private_nodes_enabled,
            )

            check = eks_cluster_private_nodes_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"EKS cluster {cluster_name} is created with private nodes."
            )
            assert result[0].resource_id == cluster_name
            assert result[0].resource_arn == cluster_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1

    def test_endpoint_without_private_nodes(self):
        eks_client = mock.MagicMock
        eks_client.clusters = []
        eks_client.clusters.append(
            EKSCluster(
                name=cluster_name,
                arn=cluster_arn,
                region=AWS_REGION_EU_WEST_1,
                logging=None,
                endpoint_private_access=False,
            )
        )

        with mock.patch(
            "prowler.providers.aws.services.eks.eks_service.EKS",
            eks_client,
        ):
            from prowler.providers.aws.services.eks.eks_cluster_private_nodes_enabled.eks_cluster_private_nodes_enabled import (
                eks_cluster_private_nodes_enabled,
            )

            check = eks_cluster_private_nodes_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Cluster endpoint private access is not enabled for EKS cluster {cluster_name}."
            )
            assert result[0].resource_id == cluster_name
            assert result[0].resource_arn == cluster_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1
```

--------------------------------------------------------------------------------

---[FILE: eks_cluster_uses_a_supported_version.py]---
Location: prowler-master/tests/providers/aws/services/eks/eks_cluster_uses_a_supported_version/eks_cluster_uses_a_supported_version.py

```python
from unittest import mock

from prowler.providers.aws.services.eks.eks_service import EKSCluster
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_EU_WEST_1

cluster_name = "cluster_test"
cluster_arn = (
    f"arn:aws:eks:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:cluster/{cluster_name}"
)


class Test_eks_cluster_ensure_version_is_supported:
    def test_no_clusters(self):
        eks_client = mock.MagicMock
        eks_client.clusters = []
        eks_client.audit_config = {"eks_cluster_oldest_version_supported": "1.28"}
        with mock.patch(
            "prowler.providers.aws.services.eks.eks_service.EKS",
            eks_client,
        ):
            from prowler.providers.aws.services.eks.eks_cluster_uses_a_supported_version.eks_cluster_uses_a_supported_version import (
                eks_cluster_uses_a_supported_version,
            )

            check = eks_cluster_uses_a_supported_version()
            result = check.execute()
            assert len(result) == 0

    def test_eks_cluster_not_using_a_supported_minor_version(self):
        eks_client = mock.MagicMock
        eks_client.audit_config = {"eks_cluster_oldest_version_supported": "1.28"}
        eks_client.clusters = []
        eks_client.clusters.append(
            EKSCluster(
                name=cluster_name,
                version="1.22",
                arn=cluster_arn,
                region=AWS_REGION_EU_WEST_1,
                logging=None,
            )
        )

        with mock.patch(
            "prowler.providers.aws.services.eks.eks_service.EKS",
            eks_client,
        ):
            from prowler.providers.aws.services.eks.eks_cluster_uses_a_supported_version.eks_cluster_uses_a_supported_version import (
                eks_cluster_uses_a_supported_version,
            )

            check = eks_cluster_uses_a_supported_version()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"EKS cluster {cluster_name} is using version 1.22. It should be one of the supported versions: 1.28 or higher."
            )
            assert result[0].resource_id == cluster_name
            assert result[0].resource_arn == cluster_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1

    def test_eks_cluster_not_using_a_supported_major_version(self):
        eks_client = mock.MagicMock
        eks_client.audit_config = {"eks_cluster_oldest_version_supported": "1.28"}
        eks_client.clusters = []
        eks_client.clusters.append(
            EKSCluster(
                name=cluster_name,
                version="0.22",
                arn=cluster_arn,
                region=AWS_REGION_EU_WEST_1,
                logging=None,
            )
        )

        with mock.patch(
            "prowler.providers.aws.services.eks.eks_service.EKS",
            eks_client,
        ):
            from prowler.providers.aws.services.eks.eks_cluster_uses_a_supported_version.eks_cluster_uses_a_supported_version import (
                eks_cluster_uses_a_supported_version,
            )

            check = eks_cluster_uses_a_supported_version()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"EKS cluster {cluster_name} is using version 0.22. It should be one of the supported versions: 1.28 or higher."
            )
            assert result[0].resource_id == cluster_name
            assert result[0].resource_arn == cluster_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1

    def test_eks_cluster_using_a_supported_version_ver_1_28(self):
        eks_client = mock.MagicMock
        eks_client.audit_config = {"eks_cluster_oldest_version_supported": "1.28"}
        eks_client.clusters = []
        eks_client.clusters.append(
            EKSCluster(
                name=cluster_name,
                version="1.28",
                arn=cluster_arn,
                region=AWS_REGION_EU_WEST_1,
                logging=None,
            )
        )

        with mock.patch(
            "prowler.providers.aws.services.eks.eks_service.EKS",
            eks_client,
        ):
            from prowler.providers.aws.services.eks.eks_cluster_uses_a_supported_version.eks_cluster_uses_a_supported_version import (
                eks_cluster_uses_a_supported_version,
            )

            check = eks_cluster_uses_a_supported_version()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"EKS cluster {cluster_name} is using version 1.28 that is supported by AWS."
            )
            assert result[0].resource_id == cluster_name
            assert result[0].resource_arn == cluster_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1

    def test_eks_cluster_using_a_supported_version_ver_1_29(self):
        eks_client = mock.MagicMock
        eks_client.audit_config = {"eks_cluster_oldest_version_supported": "1.28"}
        eks_client.clusters = []
        eks_client.clusters.append(
            EKSCluster(
                name=cluster_name,
                version="1.29",
                arn=cluster_arn,
                region=AWS_REGION_EU_WEST_1,
                logging=None,
            )
        )

        with mock.patch(
            "prowler.providers.aws.services.eks.eks_service.EKS",
            eks_client,
        ):
            from prowler.providers.aws.services.eks.eks_cluster_uses_a_supported_version.eks_cluster_uses_a_supported_version import (
                eks_cluster_uses_a_supported_version,
            )

            check = eks_cluster_uses_a_supported_version()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"EKS cluster {cluster_name} is using version 1.29 that is supported by AWS."
            )
            assert result[0].resource_id == cluster_name
            assert result[0].resource_arn == cluster_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1

    def test_eks_cluster_using_a_supported_version_ver_1_30(self):
        eks_client = mock.MagicMock
        eks_client.audit_config = {"eks_cluster_oldest_version_supported": "1.28"}
        eks_client.clusters = []
        eks_client.clusters.append(
            EKSCluster(
                name=cluster_name,
                version="1.30",
                arn=cluster_arn,
                region=AWS_REGION_EU_WEST_1,
                logging=None,
            )
        )

        with mock.patch(
            "prowler.providers.aws.services.eks.eks_service.EKS",
            eks_client,
        ):
            from prowler.providers.aws.services.eks.eks_cluster_uses_a_supported_version.eks_cluster_uses_a_supported_version import (
                eks_cluster_uses_a_supported_version,
            )

            check = eks_cluster_uses_a_supported_version()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"EKS cluster {cluster_name} is using version 1.30 that is supported by AWS."
            )
            assert result[0].resource_id == cluster_name
            assert result[0].resource_arn == cluster_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1

    def test_eks_cluster_with_none_version(self):
        """Test EKS cluster with version=None - should return FAIL gracefully"""
        eks_client = mock.MagicMock
        eks_client.audit_config = {"eks_cluster_oldest_version_supported": "1.28"}
        eks_client.clusters = []
        eks_client.clusters.append(
            EKSCluster(
                name=cluster_name,
                version=None,  # This should trigger the AttributeError in current implementation
                arn=cluster_arn,
                region=AWS_REGION_EU_WEST_1,
                logging=None,
            )
        )

        with mock.patch(
            "prowler.providers.aws.services.eks.eks_service.EKS",
            eks_client,
        ):
            from prowler.providers.aws.services.eks.eks_cluster_uses_a_supported_version.eks_cluster_uses_a_supported_version import (
                eks_cluster_uses_a_supported_version,
            )

            check = eks_cluster_uses_a_supported_version()
            result = check.execute()

            assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: eks_control_plane_logging_all_types_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/eks/eks_control_plane_logging_all_types_enabled/eks_control_plane_logging_all_types_enabled_test.py

```python
from unittest import mock

from prowler.providers.aws.services.eks.eks_service import (
    EKSCluster,
    EKSClusterLoggingEntity,
)
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_EU_WEST_1

cluster_name = "cluster_test"
cluster_arn = (
    f"arn:aws:eks:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:cluster/{cluster_name}"
)


class Test_eks_control_plane_logging_all_types_enabled:
    def test_no_clusters(self):
        eks_client = mock.MagicMock
        eks_client.clusters = []
        with mock.patch(
            "prowler.providers.aws.services.eks.eks_service.EKS",
            eks_client,
        ):
            from prowler.providers.aws.services.eks.eks_control_plane_logging_all_types_enabled.eks_control_plane_logging_all_types_enabled import (
                eks_control_plane_logging_all_types_enabled,
            )

            check = eks_control_plane_logging_all_types_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_control_plane_not_logging(self):
        eks_client = mock.MagicMock
        eks_client.clusters = []
        eks_client.clusters.append(
            EKSCluster(
                name=cluster_name,
                arn=cluster_arn,
                region=AWS_REGION_EU_WEST_1,
                logging=None,
            )
        )
        eks_client.audit_config = {
            "eks_required_log_types": [
                "api",
                "audit",
                "authenticator",
                "controllerManager",
                "scheduler",
            ]
        }

        with mock.patch(
            "prowler.providers.aws.services.eks.eks_service.EKS",
            eks_client,
        ):
            from prowler.providers.aws.services.eks.eks_control_plane_logging_all_types_enabled.eks_control_plane_logging_all_types_enabled import (
                eks_control_plane_logging_all_types_enabled,
            )

            check = eks_control_plane_logging_all_types_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Control plane logging is not enabled for EKS cluster {cluster_name}. Required log types: api, audit, authenticator, controllerManager, scheduler."
            )
            assert result[0].resource_id == cluster_name
            assert result[0].resource_arn == cluster_arn

    def test_control_plane_incomplete_logging(self):
        eks_client = mock.MagicMock
        eks_client.clusters = []
        eks_client.clusters.append(
            EKSCluster(
                name=cluster_name,
                arn=cluster_arn,
                region=AWS_REGION_EU_WEST_1,
                logging=EKSClusterLoggingEntity(
                    types=["api", "audit", "authenticator", "controllerManager"],
                    enabled=True,
                ),
            )
        )
        eks_client.audit_config = {
            "eks_required_log_types": [
                "api",
                "audit",
                "authenticator",
                "controllerManager",
                "scheduler",
            ]
        }

        with mock.patch(
            "prowler.providers.aws.services.eks.eks_service.EKS",
            eks_client,
        ):
            from prowler.providers.aws.services.eks.eks_control_plane_logging_all_types_enabled.eks_control_plane_logging_all_types_enabled import (
                eks_control_plane_logging_all_types_enabled,
            )

            check = eks_control_plane_logging_all_types_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Control plane logging is enabled but not all required log types are enabled for EKS cluster {cluster_name}. Required log types: api, audit, authenticator, controllerManager, scheduler. Enabled log types: api, audit, authenticator, controllerManager."
            )
            assert result[0].resource_id == cluster_name
            assert result[0].resource_arn == cluster_arn

    def test_control_plane_complete_logging(self):
        eks_client = mock.MagicMock
        eks_client.clusters = []
        eks_client.clusters.append(
            EKSCluster(
                name=cluster_name,
                arn=cluster_arn,
                region=AWS_REGION_EU_WEST_1,
                logging=EKSClusterLoggingEntity(
                    types=[
                        "api",
                        "audit",
                        "authenticator",
                        "controllerManager",
                        "scheduler",
                    ],
                    enabled=True,
                ),
            )
        )
        eks_client.audit_config = {
            "eks_required_log_types": [
                "api",
                "audit",
                "authenticator",
                "controllerManager",
                "scheduler",
            ]
        }

        with mock.patch(
            "prowler.providers.aws.services.eks.eks_service.EKS",
            eks_client,
        ):
            from prowler.providers.aws.services.eks.eks_control_plane_logging_all_types_enabled.eks_control_plane_logging_all_types_enabled import (
                eks_control_plane_logging_all_types_enabled,
            )

            check = eks_control_plane_logging_all_types_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Control plane logging and all required log types are enabled for EKS cluster {cluster_name}."
            )
            assert result[0].resource_id == cluster_name
            assert result[0].resource_arn == cluster_arn
```

--------------------------------------------------------------------------------

---[FILE: elasticache_service_test.py]---
Location: prowler-master/tests/providers/aws/services/elasticache/elasticache_service_test.py

```python
import botocore
from mock import patch

from prowler.providers.aws.services.elasticache.elasticache_service import (
    Cluster,
    ElastiCache,
    ReplicationGroup,
)
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    AWS_REGION_US_EAST_1_AZA,
    AWS_REGION_US_EAST_1_AZB,
    set_mocked_aws_provider,
)

SUBNET_GROUP_NAME = "default"
SUBNET_1 = "subnet-1"
SUBNET_2 = "subnet-2"

ELASTICACHE_CLUSTER_NAME = "test-cluster"
ELASTICACHE_CLUSTER_ARN = f"arn:aws:elasticache:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster:{ELASTICACHE_CLUSTER_NAME}"
ELASTICACHE_ENGINE = "redis"
ELASTICACHE_ENGINE_MEMCACHED = "memcached"

ELASTICACHE_CLUSTER_TAGS = [
    {"Key": "environment", "Value": "test"},
]

REPLICATION_GROUP_ID = "clustered-redis"
REPLICATION_GROUP_ARN = f"arn:aws:elasticache:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:replicationgroup:{REPLICATION_GROUP_ID}"
REPLICATION_GROUP_STATUS = "available"
REPLICATION_GROUP_SNAPSHOT_RETENTION = "0"
REPLICATION_GROUP_ENCRYPTION = True
REPLICATION_GROUP_TRANSIT_ENCRYPTION = True
REPLICATION_GROUP_MULTI_AZ = "enabled"
REPLICATION_GROUP_TAGS = [
    {"Key": "environment", "Value": "test"},
]
AUTO_MINOR_VERSION_UPGRADE = True
AUTOMATIC_FAILOVER = "enabled"


# Mocking Access Analyzer Calls
make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwargs):
    """
    As you can see the operation_name has the list_analyzers snake_case form but
    we are using the ListAnalyzers form.
    Rationale -> https://github.com/boto/botocore/blob/develop/botocore/client.py#L810:L816

    We have to mock every AWS API call using Boto3
    """
    if operation_name == "DescribeCacheClusters":
        return {
            "CacheClusters": [
                {
                    "CacheClusterId": ELASTICACHE_CLUSTER_NAME,
                    "CacheSubnetGroupName": SUBNET_GROUP_NAME,
                    "ARN": ELASTICACHE_CLUSTER_ARN,
                    "Engine": ELASTICACHE_ENGINE,
                    "SecurityGroups": [],
                    "AutoMinorVersionUpgrade": AUTO_MINOR_VERSION_UPGRADE,
                    "EngineVersion": "6.0",
                    "AuthTokenEnabled": False,
                },
            ]
        }
    if operation_name == "DescribeCacheSubnetGroups":
        return {
            "CacheSubnetGroups": [
                {
                    "CacheSubnetGroupName": SUBNET_GROUP_NAME,
                    "CacheSubnetGroupDescription": "Subnet Group",
                    "VpcId": "vpc-1",
                    "SubnetGroupStatus": "Complete",
                    "Subnets": [
                        {
                            "SubnetIdentifier": "subnet-1",
                            "SubnetAvailabilityZone": {
                                "Name": AWS_REGION_US_EAST_1_AZA
                            },
                            "SubnetStatus": "Active",
                        },
                        {
                            "SubnetIdentifier": "subnet-2",
                            "SubnetAvailabilityZone": {
                                "Name": AWS_REGION_US_EAST_1_AZB
                            },
                            "SubnetStatus": "Active",
                        },
                    ],
                    "DBSubnetGroupArn": f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:subgrp:{SUBNET_GROUP_NAME}",
                }
            ]
        }
    if operation_name == "ListTagsForResource":
        return {"TagList": ELASTICACHE_CLUSTER_TAGS}
    if operation_name == "DescribeReplicationGroups":
        return {
            "ReplicationGroups": [
                {
                    "ReplicationGroupId": REPLICATION_GROUP_ID,
                    "Status": REPLICATION_GROUP_STATUS,
                    "SnapshotRetentionLimit": REPLICATION_GROUP_SNAPSHOT_RETENTION,
                    "MultiAZ": REPLICATION_GROUP_MULTI_AZ,
                    "TransitEncryptionEnabled": REPLICATION_GROUP_TRANSIT_ENCRYPTION,
                    "AtRestEncryptionEnabled": REPLICATION_GROUP_ENCRYPTION,
                    "ARN": REPLICATION_GROUP_ARN,
                    "AutoMinorVersionUpgrade": AUTO_MINOR_VERSION_UPGRADE,
                    "Memberclusters": [ELASTICACHE_CLUSTER_NAME],
                    "AuthTokenEnabled": False,
                },
            ]
        }
    return make_api_call(self, operation_name, kwargs)


def mock_generate_regional_clients(provider, service):
    regional_client = provider._session.current_session.client(
        service, region_name=AWS_REGION_US_EAST_1
    )
    regional_client.region = AWS_REGION_US_EAST_1
    return {AWS_REGION_US_EAST_1: regional_client}


@patch(
    "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
    new=mock_generate_regional_clients,
)
# Patch every AWS call using Boto3
@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
class Test_ElastiCache_Service:
    # Test ElastiCache Service
    def test_service(self):
        aws_provider = set_mocked_aws_provider()
        elasticache = ElastiCache(aws_provider)
        assert elasticache.service == "elasticache"

    # Test ElastiCache Client]
    def test_client(self):
        aws_provider = set_mocked_aws_provider()
        elasticache = ElastiCache(aws_provider)
        assert elasticache.client.__class__.__name__ == "ElastiCache"

    # Test ElastiCache Session
    def test__get_session__(self):
        aws_provider = set_mocked_aws_provider()
        elasticache = ElastiCache(aws_provider)
        assert elasticache.session.__class__.__name__ == "Session"

    # Test ElastiCache Session
    def test_audited_account(self):
        aws_provider = set_mocked_aws_provider()
        elasticache = ElastiCache(aws_provider)
        assert elasticache.audited_account == AWS_ACCOUNT_NUMBER

    # Test Elasticache Redis cache clusters
    def test_describe_cache_clusters(self):
        aws_provider = set_mocked_aws_provider()
        elasticache = ElastiCache(aws_provider)

        assert len(elasticache.clusters) == 1
        assert elasticache.clusters[ELASTICACHE_CLUSTER_ARN]
        assert elasticache.clusters[ELASTICACHE_CLUSTER_ARN] == Cluster(
            arn=ELASTICACHE_CLUSTER_ARN,
            id=ELASTICACHE_CLUSTER_NAME,
            engine=ELASTICACHE_ENGINE,
            region=AWS_REGION_US_EAST_1,
            security_groups=[],
            cache_subnet_group_id=SUBNET_GROUP_NAME,
            subnets=[SUBNET_1, SUBNET_2],
            tags=ELASTICACHE_CLUSTER_TAGS,
            auto_minor_version_upgrade=AUTO_MINOR_VERSION_UPGRADE,
            engine_version=6.0,
            auth_token_enabled=False,
        )

    # Test Elasticache Redis replication_groups
    def test_describe_replication_groups(self):
        aws_provider = set_mocked_aws_provider()
        elasticache = ElastiCache(aws_provider)

        assert len(elasticache.replication_groups) == 1
        assert elasticache.replication_groups[REPLICATION_GROUP_ARN]
        assert elasticache.replication_groups[
            REPLICATION_GROUP_ARN
        ] == ReplicationGroup(
            id=REPLICATION_GROUP_ID,
            arn=REPLICATION_GROUP_ARN,
            region=AWS_REGION_US_EAST_1,
            status=REPLICATION_GROUP_STATUS,
            snapshot_retention=REPLICATION_GROUP_SNAPSHOT_RETENTION,
            encrypted=REPLICATION_GROUP_ENCRYPTION,
            transit_encryption=REPLICATION_GROUP_TRANSIT_ENCRYPTION,
            multi_az=REPLICATION_GROUP_MULTI_AZ,
            tags=REPLICATION_GROUP_TAGS,
            auto_minor_version_upgrade=AUTO_MINOR_VERSION_UPGRADE,
            auth_token_enabled=False,
            automatic_failover="disabled",
            engine_version="0.0",
        )
```

--------------------------------------------------------------------------------

````
