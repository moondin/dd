---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 598
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 598 of 867)

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

---[FILE: opensearch_service_domains_fault_tolerant_master_nodes_test.py]---
Location: prowler-master/tests/providers/aws/services/opensearch/opensearch_service_domains_fault_tolerant_master_nodes/opensearch_service_domains_fault_tolerant_master_nodes_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider

domain_name = "test-domain"


class Test_opensearch_service_domains_fault_tolerant_master_nodes:
    @mock_aws
    def test_no_domains(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        from prowler.providers.aws.services.opensearch.opensearch_service import (
            OpenSearchService,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_fault_tolerant_master_nodes.opensearch_service_domains_fault_tolerant_master_nodes.opensearch_client",
                new=OpenSearchService(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_fault_tolerant_master_nodes.opensearch_service_domains_fault_tolerant_master_nodes import (
                opensearch_service_domains_fault_tolerant_master_nodes,
            )

            check = opensearch_service_domains_fault_tolerant_master_nodes()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_domain_no_master_nodes_enabled(self):
        opensearch_client = client("opensearch", region_name=AWS_REGION_EU_WEST_1)
        opensearch_client.create_domain(
            DomainName=domain_name,
            ClusterConfig={
                "DedicatedMasterEnabled": False,
            },
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        from prowler.providers.aws.services.opensearch.opensearch_service import (
            OpenSearchService,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_fault_tolerant_master_nodes.opensearch_service_domains_fault_tolerant_master_nodes.opensearch_client",
                new=OpenSearchService(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_fault_tolerant_master_nodes.opensearch_service_domains_fault_tolerant_master_nodes import (
                opensearch_service_domains_fault_tolerant_master_nodes,
            )

            check = opensearch_service_domains_fault_tolerant_master_nodes()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Opensearch domain {domain_name} has dedicated master nodes disabled."
            )
            assert result[0].resource_id == domain_name
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_domain_with_one_master_node(self):
        opensearch_client = client("opensearch", region_name=AWS_REGION_EU_WEST_1)
        domain_arn = opensearch_client.create_domain(
            DomainName=domain_name,
            ClusterConfig={
                "DedicatedMasterEnabled": True,
                "DedicatedMasterCount": 1,
                "DedicatedMasterType": "m3.medium.search",
            },
            TagList=[
                {"Key": "test", "Value": "test"},
            ],
        )["DomainStatus"]["ARN"]

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        from prowler.providers.aws.services.opensearch.opensearch_service import (
            OpenSearchService,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_fault_tolerant_master_nodes.opensearch_service_domains_fault_tolerant_master_nodes.opensearch_client",
                new=OpenSearchService(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_fault_tolerant_master_nodes.opensearch_service_domains_fault_tolerant_master_nodes import (
                opensearch_service_domains_fault_tolerant_master_nodes,
            )

            check = opensearch_service_domains_fault_tolerant_master_nodes()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Opensearch domain {domain_name} does not have at least 3 dedicated master nodes."
            )
            assert result[0].resource_id == domain_name
            assert result[0].resource_arn == domain_arn
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == [{"Key": "test", "Value": "test"}]

    @mock_aws
    def test_domain_with_three_master_nodes(self):
        opensearch_client = client("opensearch", region_name=AWS_REGION_EU_WEST_1)
        domain_arn = opensearch_client.create_domain(
            DomainName=domain_name,
            ClusterConfig={
                "DedicatedMasterEnabled": True,
                "DedicatedMasterCount": 3,
                "DedicatedMasterType": "m3.medium.search",
            },
            TagList=[{"Key": "test", "Value": "test"}],
        )["DomainStatus"]["ARN"]

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        from prowler.providers.aws.services.opensearch.opensearch_service import (
            OpenSearchService,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_fault_tolerant_master_nodes.opensearch_service_domains_fault_tolerant_master_nodes.opensearch_client",
                new=OpenSearchService(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_fault_tolerant_master_nodes.opensearch_service_domains_fault_tolerant_master_nodes import (
                opensearch_service_domains_fault_tolerant_master_nodes,
            )

            check = opensearch_service_domains_fault_tolerant_master_nodes()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Opensearch domain {domain_name} has 3 dedicated master nodes, which guarantees fault tolerance on the master nodes."
            )
            assert result[0].resource_id == domain_name
            assert result[0].resource_arn == domain_arn
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == [{"Key": "test", "Value": "test"}]
```

--------------------------------------------------------------------------------

---[FILE: opensearch_service_domains_https_communications_enforced_test.py]---
Location: prowler-master/tests/providers/aws/services/opensearch/opensearch_service_domains_https_communications_enforced/opensearch_service_domains_https_communications_enforced_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_opensearch_service_domains_https_communications_enforced:
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
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_https_communications_enforced.opensearch_service_domains_https_communications_enforced.opensearch_client",
                new=OpenSearchService(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_https_communications_enforced.opensearch_service_domains_https_communications_enforced import (
                opensearch_service_domains_https_communications_enforced,
            )

            check = opensearch_service_domains_https_communications_enforced()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_no_https_enabled(self):
        opensearch_client = client("opensearch", region_name=AWS_REGION_US_EAST_1)
        domain = opensearch_client.create_domain(
            DomainName="test-domain-no-https",
            DomainEndpointOptions={
                "EnforceHTTPS": False,
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
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_https_communications_enforced.opensearch_service_domains_https_communications_enforced.opensearch_client",
                new=OpenSearchService(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_https_communications_enforced.opensearch_service_domains_https_communications_enforced import (
                opensearch_service_domains_https_communications_enforced,
            )

            check = opensearch_service_domains_https_communications_enforced()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Opensearch domain test-domain-no-https does not have enforce HTTPS enabled."
            )
            assert result[0].resource_id == domain["DomainStatus"]["DomainName"]
            assert (
                result[0].resource_arn
                == f"arn:aws:es:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:domain/{domain['DomainStatus']['DomainName']}"
            )

    @mock_aws
    def test_https_enabled(self):
        opensearch_client = client("opensearch", region_name=AWS_REGION_US_EAST_1)
        domain = opensearch_client.create_domain(
            DomainName="test-domain-https",
            DomainEndpointOptions={
                "EnforceHTTPS": True,
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
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_https_communications_enforced.opensearch_service_domains_https_communications_enforced.opensearch_client",
                new=OpenSearchService(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_https_communications_enforced.opensearch_service_domains_https_communications_enforced import (
                opensearch_service_domains_https_communications_enforced,
            )

            check = opensearch_service_domains_https_communications_enforced()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Opensearch domain test-domain-https has enforce HTTPS enabled."
            )
            assert result[0].resource_id == domain["DomainStatus"]["DomainName"]
            assert (
                result[0].resource_arn
                == f"arn:aws:es:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:domain/{domain['DomainStatus']['DomainName']}"
            )
```

--------------------------------------------------------------------------------

---[FILE: opensearch_service_domains_internal_user_database_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/opensearch/opensearch_service_domains_internal_user_database_enabled/opensearch_service_domains_internal_user_database_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_opensearch_service_domains_internal_user_database_enabled:
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
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_internal_user_database_enabled.opensearch_service_domains_internal_user_database_enabled.opensearch_client",
                new=OpenSearchService(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_internal_user_database_enabled.opensearch_service_domains_internal_user_database_enabled import (
                opensearch_service_domains_internal_user_database_enabled,
            )

            check = opensearch_service_domains_internal_user_database_enabled()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_internal_database_disabled(self):
        opensearch_client = client("opensearch", region_name=AWS_REGION_US_EAST_1)
        domain = opensearch_client.create_domain(
            DomainName="test-domain",
            AdvancedSecurityOptions={"InternalUserDatabaseEnabled": False},
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
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_internal_user_database_enabled.opensearch_service_domains_internal_user_database_enabled.opensearch_client",
                new=OpenSearchService(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_internal_user_database_enabled.opensearch_service_domains_internal_user_database_enabled import (
                opensearch_service_domains_internal_user_database_enabled,
            )

            check = opensearch_service_domains_internal_user_database_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Opensearch domain test-domain does not have internal user database enabled."
            )
            assert result[0].resource_id == domain["DomainStatus"]["DomainName"]
            assert (
                result[0].resource_arn
                == f"arn:aws:es:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:domain/{domain['DomainStatus']['DomainName']}"
            )

    @mock_aws
    def test_internal_database_enabled(self):
        opensearch_client = client("opensearch", region_name=AWS_REGION_US_EAST_1)
        domain = opensearch_client.create_domain(
            DomainName="test-domain",
            AdvancedSecurityOptions={"InternalUserDatabaseEnabled": True},
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
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_internal_user_database_enabled.opensearch_service_domains_internal_user_database_enabled.opensearch_client",
                new=OpenSearchService(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_internal_user_database_enabled.opensearch_service_domains_internal_user_database_enabled import (
                opensearch_service_domains_internal_user_database_enabled,
            )

            check = opensearch_service_domains_internal_user_database_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Opensearch domain test-domain has internal user database enabled."
            )
            assert result[0].resource_id == domain["DomainStatus"]["DomainName"]
            assert (
                result[0].resource_arn
                == f"arn:aws:es:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:domain/{domain['DomainStatus']['DomainName']}"
            )
```

--------------------------------------------------------------------------------

---[FILE: opensearch_service_domains_node_to_node_encryption_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/opensearch/opensearch_service_domains_node_to_node_encryption_enabled/opensearch_service_domains_node_to_node_encryption_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_opensearch_service_domains_node_to_node_encryption_enabled:
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
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_node_to_node_encryption_enabled.opensearch_service_domains_node_to_node_encryption_enabled.opensearch_client",
                new=OpenSearchService(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_node_to_node_encryption_enabled.opensearch_service_domains_node_to_node_encryption_enabled import (
                opensearch_service_domains_node_to_node_encryption_enabled,
            )

            check = opensearch_service_domains_node_to_node_encryption_enabled()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_no_encryption_enabled(self):
        opensearch_client = client("opensearch", region_name=AWS_REGION_US_EAST_1)
        domain = opensearch_client.create_domain(
            DomainName="test-domain-no-encryption",
            NodeToNodeEncryptionOptions={"Enabled": False},
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
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_node_to_node_encryption_enabled.opensearch_service_domains_node_to_node_encryption_enabled.opensearch_client",
                new=OpenSearchService(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_node_to_node_encryption_enabled.opensearch_service_domains_node_to_node_encryption_enabled import (
                opensearch_service_domains_node_to_node_encryption_enabled,
            )

            check = opensearch_service_domains_node_to_node_encryption_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Opensearch domain test-domain-no-encryption does not have node-to-node encryption enabled."
            )
            assert result[0].resource_id == domain["DomainStatus"]["DomainName"]
            assert (
                result[0].resource_arn
                == f"arn:aws:es:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:domain/{domain['DomainStatus']['DomainName']}"
            )

    @mock_aws
    def test_encryption_enabled(self):
        opensearch_client = client("opensearch", region_name=AWS_REGION_US_EAST_1)
        domain = opensearch_client.create_domain(
            DomainName="test-domain-encryption",
            NodeToNodeEncryptionOptions={"Enabled": True},
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
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_node_to_node_encryption_enabled.opensearch_service_domains_node_to_node_encryption_enabled.opensearch_client",
                new=OpenSearchService(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_node_to_node_encryption_enabled.opensearch_service_domains_node_to_node_encryption_enabled import (
                opensearch_service_domains_node_to_node_encryption_enabled,
            )

            check = opensearch_service_domains_node_to_node_encryption_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Opensearch domain test-domain-encryption has node-to-node encryption enabled."
            )
            assert result[0].resource_id == domain["DomainStatus"]["DomainName"]
            assert (
                result[0].resource_arn
                == f"arn:aws:es:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:domain/{domain['DomainStatus']['DomainName']}"
            )
```

--------------------------------------------------------------------------------

---[FILE: opensearch_service_domains_not_publicly_accessible_fixer_test.py]---
Location: prowler-master/tests/providers/aws/services/opensearch/opensearch_service_domains_not_publicly_accessible/opensearch_service_domains_not_publicly_accessible_fixer_test.py

```python
from json import dumps
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_WEST_2,
    set_mocked_aws_provider,
)

domain_name = "test-domain"

policy_data_restricted = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {"AWS": [f"{AWS_ACCOUNT_NUMBER}"]},
            "Action": ["es:*"],
            "Resource": f"arn:aws:es:us-west-2:{AWS_ACCOUNT_NUMBER}:domain/{domain_name}/*",
        }
    ],
}

policy_data_not_restricted = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {"AWS": ["*"]},
            "Action": ["es:*"],
            "Resource": f"arn:aws:es:us-west-2:{AWS_ACCOUNT_NUMBER}:domain/{domain_name}/*",
        }
    ],
}

policy_data_not_restricted_principal = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": ["es:*"],
            "Resource": f"arn:aws:es:us-west-2:{AWS_ACCOUNT_NUMBER}:domain/{domain_name}/*",
        }
    ],
}


class Test_opensearch_service_domains_not_publicly_accessible_fixer:
    @mock_aws
    def test_policy_data_restricted_error(self):
        opensearch_client = client("opensearch", region_name=AWS_REGION_US_WEST_2)
        opensearch_client.create_domain(DomainName=domain_name)["DomainStatus"]["ARN"]
        opensearch_client.update_domain_config(
            DomainName=domain_name,
            AccessPolicies=str(policy_data_restricted),
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_WEST_2])

        from prowler.providers.aws.services.opensearch.opensearch_service import (
            OpenSearchService,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_not_publicly_accessible.opensearch_service_domains_not_publicly_accessible_fixer.opensearch_client",
                new=OpenSearchService(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_not_publicly_accessible.opensearch_service_domains_not_publicly_accessible_fixer import (
                fixer,
            )

            assert not fixer("domain_name_non_existing", AWS_REGION_US_WEST_2)

    @mock_aws
    def test_policy_data_not_restricted_with_principal_AWS(self):
        opensearch_client = client("opensearch", region_name=AWS_REGION_US_WEST_2)
        opensearch_client.create_domain(DomainName=domain_name)["DomainStatus"]["ARN"]
        opensearch_client.update_domain_config(
            DomainName=domain_name,
            AccessPolicies=dumps(policy_data_not_restricted),
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_WEST_2])

        from prowler.providers.aws.services.opensearch.opensearch_service import (
            OpenSearchService,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_not_publicly_accessible.opensearch_service_domains_not_publicly_accessible_fixer.opensearch_client",
                new=OpenSearchService(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_not_publicly_accessible.opensearch_service_domains_not_publicly_accessible_fixer import (
                fixer,
            )

            assert fixer(domain_name, AWS_REGION_US_WEST_2)

    @mock_aws
    def test_policy_data_not_restricted_with_principal_no_AWS(self):
        opensearch_client = client("opensearch", region_name=AWS_REGION_US_WEST_2)
        opensearch_client.create_domain(DomainName=domain_name)["DomainStatus"]["ARN"]
        opensearch_client.update_domain_config(
            DomainName=domain_name,
            AccessPolicies=dumps(policy_data_not_restricted_principal),
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_WEST_2])

        from prowler.providers.aws.services.opensearch.opensearch_service import (
            OpenSearchService,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_not_publicly_accessible.opensearch_service_domains_not_publicly_accessible_fixer.opensearch_client",
                new=OpenSearchService(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_not_publicly_accessible.opensearch_service_domains_not_publicly_accessible_fixer import (
                fixer,
            )

            assert fixer(domain_name, AWS_REGION_US_WEST_2)
```

--------------------------------------------------------------------------------

````
