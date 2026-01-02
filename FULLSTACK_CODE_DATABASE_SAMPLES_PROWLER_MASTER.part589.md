---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 589
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 589 of 867)

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

---[FILE: lightsail_database_public_test.py]---
Location: prowler-master/tests/providers/aws/services/lightsail/lightsail_database_public/lightsail_database_public_test.py

```python
from unittest.mock import MagicMock, patch

from prowler.providers.aws.services.lightsail.lightsail_service import Database
from tests.providers.aws.utils import (
    AWS_REGION_US_EAST_1,
    AWS_REGION_US_EAST_1_AZA,
    BASE_LIGHTSAIL_ARN,
    set_mocked_aws_provider,
)


class Test_lightsail_database_public:
    def test_lightsail_no_databases(self):
        lightsail_client = MagicMock
        lightsail_client.databases = {}

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            patch(
                "prowler.providers.aws.services.lightsail.lightsail_service.Lightsail",
                new=lightsail_client,
            ),
        ):
            from prowler.providers.aws.services.lightsail.lightsail_database_public.lightsail_database_public import (
                lightsail_database_public,
            )

            check = lightsail_database_public()
            result = check.execute()

            assert len(result) == 0

    def test_lightsail_database_public(self):
        lightsail_client = MagicMock
        lightsail_client.databases = {
            f"{BASE_LIGHTSAIL_ARN}:Database/test-database": Database(
                name="test-database",
                id="1234/5678",
                arn=f"{BASE_LIGHTSAIL_ARN}:Database/test-database",
                tags=[],
                region=AWS_REGION_US_EAST_1,
                availability_zone=AWS_REGION_US_EAST_1_AZA,
                engine="mysql",
                engine_version="5.7",
                size="nano",
                status="running",
                master_username="admin",
                public_access=True,
            )
        }

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            patch(
                "prowler.providers.aws.services.lightsail.lightsail_service.Lightsail",
                new=lightsail_client,
            ),
        ):
            from prowler.providers.aws.services.lightsail.lightsail_database_public.lightsail_database_public import (
                lightsail_database_public,
            )

            check = lightsail_database_public()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == "Database 'test-database' is public."
            assert result[0].resource_id == "1234/5678"
            assert (
                result[0].resource_arn == f"{BASE_LIGHTSAIL_ARN}:Database/test-database"
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1

    def test_lightsail_database_private(self):
        lightsail_client = MagicMock
        lightsail_client.databases = {
            f"{BASE_LIGHTSAIL_ARN}:Database/test-database": Database(
                name="test-database",
                id="1234/5678",
                arn=f"{BASE_LIGHTSAIL_ARN}:Database/test-database",
                tags=[],
                region=AWS_REGION_US_EAST_1,
                availability_zone=AWS_REGION_US_EAST_1_AZA,
                engine="mysql",
                engine_version="5.7",
                size="nano",
                status="running",
                master_username="admin",
                public_access=False,
            )
        }

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            patch(
                "prowler.providers.aws.services.lightsail.lightsail_service.Lightsail",
                new=lightsail_client,
            ),
        ):
            from prowler.providers.aws.services.lightsail.lightsail_database_public.lightsail_database_public import (
                lightsail_database_public,
            )

            check = lightsail_database_public()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended == "Database 'test-database' is not public."
            )
            assert result[0].resource_id == "1234/5678"
            assert (
                result[0].resource_arn == f"{BASE_LIGHTSAIL_ARN}:Database/test-database"
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1
```

--------------------------------------------------------------------------------

---[FILE: lightsail_instance_automated_snapshots_test.py]---
Location: prowler-master/tests/providers/aws/services/lightsail/lightsail_instance_automated_snapshots/lightsail_instance_automated_snapshots_test.py

```python
from unittest.mock import MagicMock, patch

from prowler.providers.aws.services.lightsail.lightsail_service import (
    Instance,
    PortRange,
)
from tests.providers.aws.utils import (
    AWS_REGION_US_EAST_1,
    AWS_REGION_US_EAST_1_AZA,
    BASE_LIGHTSAIL_ARN,
    set_mocked_aws_provider,
)


class Test_lightsail_instance_automated_snapshots:
    def test_no_instances(self):
        lightsail_client = MagicMock
        lightsail_client.instances = {}

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            patch(
                "prowler.providers.aws.services.lightsail.lightsail_service.Lightsail",
                new=lightsail_client,
            ),
        ):
            from prowler.providers.aws.services.lightsail.lightsail_instance_automated_snapshots.lightsail_instance_automated_snapshots import (
                lightsail_instance_automated_snapshots,
            )

            check = lightsail_instance_automated_snapshots()
            result = check.execute()

            assert len(result) == 0

    def test_no_automated_snapshots(self):
        lightsail_client = MagicMock
        lightsail_client.instances = {
            f"{BASE_LIGHTSAIL_ARN}:Instance/test-instance": Instance(
                name="test-instance",
                id="1234/5678",
                arn=f"{BASE_LIGHTSAIL_ARN}:Instance/test-instance",
                tags=[],
                region=AWS_REGION_US_EAST_1,
                availability_zone=AWS_REGION_US_EAST_1_AZA,
                static_ip=False,
                public_ip="1.2.3.4",
                private_ip="10.0.0.2",
                ipv6_addresses=[],
                ip_address_type="ipv4",
                ports=[
                    PortRange(
                        range="80",
                        protocol="tcp",
                        access_from="0.0.0.0/0",
                        access_type="Public",
                    ),
                    PortRange(
                        range="443",
                        protocol="tcp",
                        access_from="0.0.0.0/0",
                        access_type="Public",
                    ),
                ],
                auto_snapshot=False,
            )
        }

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            patch(
                "prowler.providers.aws.services.lightsail.lightsail_service.Lightsail",
                new=lightsail_client,
            ),
        ):
            from prowler.providers.aws.services.lightsail.lightsail_instance_automated_snapshots.lightsail_instance_automated_snapshots import (
                lightsail_instance_automated_snapshots,
            )

            check = lightsail_instance_automated_snapshots()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Instance 'test-instance' does not have automated snapshots enabled."
            )
            assert result[0].resource_id == "1234/5678"
            assert (
                result[0].resource_arn == f"{BASE_LIGHTSAIL_ARN}:Instance/test-instance"
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1

    def test_automated_snapshots(self):
        lightsail_client = MagicMock
        lightsail_client.instances = {
            f"{BASE_LIGHTSAIL_ARN}:Instance/test-instance": Instance(
                name="test-instance",
                id="1234/5678",
                arn=f"{BASE_LIGHTSAIL_ARN}:Instance/test-instance",
                tags=[],
                region=AWS_REGION_US_EAST_1,
                availability_zone=AWS_REGION_US_EAST_1_AZA,
                static_ip=False,
                public_ip="1.2.3.4",
                private_ip="10.0.0.2",
                ipv6_addresses=[],
                ip_address_type="ipv4",
                ports=[
                    PortRange(
                        range="80",
                        protocol="tcp",
                        access_from="0.0.0.0/0",
                        access_type="Public",
                    ),
                    PortRange(
                        range="443",
                        protocol="tcp",
                        access_from="0.0.0.0/0",
                        access_type="Public",
                    ),
                ],
                auto_snapshot=True,
            )
        }

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            patch(
                "prowler.providers.aws.services.lightsail.lightsail_service.Lightsail",
                new=lightsail_client,
            ),
        ):
            from prowler.providers.aws.services.lightsail.lightsail_instance_automated_snapshots.lightsail_instance_automated_snapshots import (
                lightsail_instance_automated_snapshots,
            )

            check = lightsail_instance_automated_snapshots()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Instance 'test-instance' has automated snapshots enabled."
            )
            assert result[0].resource_id == "1234/5678"
            assert (
                result[0].resource_arn == f"{BASE_LIGHTSAIL_ARN}:Instance/test-instance"
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1
```

--------------------------------------------------------------------------------

---[FILE: lightsail_instance_public_test.py]---
Location: prowler-master/tests/providers/aws/services/lightsail/lightsail_instance_public/lightsail_instance_public_test.py

```python
from unittest.mock import MagicMock, patch

from prowler.providers.aws.services.lightsail.lightsail_service import (
    Instance,
    PortRange,
)
from tests.providers.aws.utils import (
    AWS_REGION_US_EAST_1,
    AWS_REGION_US_EAST_1_AZA,
    BASE_LIGHTSAIL_ARN,
    set_mocked_aws_provider,
)


class Test_lightsail_instance_public:
    def test_no_instances(self):
        lightsail_client = MagicMock
        lightsail_client.instances = {}

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            patch(
                "prowler.providers.aws.services.lightsail.lightsail_service.Lightsail",
                new=lightsail_client,
            ),
        ):
            from prowler.providers.aws.services.lightsail.lightsail_instance_public.lightsail_instance_public import (
                lightsail_instance_public,
            )

            check = lightsail_instance_public()
            result = check.execute()

            assert len(result) == 0

    def test_private_instance(self):
        lightsail_client = MagicMock
        lightsail_client.instances = {
            f"{BASE_LIGHTSAIL_ARN}:Instance/test-instance": Instance(
                name="test-instance",
                id="1234/5678",
                arn=f"{BASE_LIGHTSAIL_ARN}:Instance/test-instance",
                tags=[],
                region=AWS_REGION_US_EAST_1,
                availability_zone=AWS_REGION_US_EAST_1_AZA,
                static_ip=False,
                public_ip="",
                private_ip="172.16.2.3",
                ipv6_addresses=[],
                ip_address_type="ipv4",
                ports=[
                    PortRange(
                        range="80",
                        protocol="tcp",
                        access_from="Custom(172.16.0.0/16)",
                        access_type="private",
                    ),
                    PortRange(
                        range="443",
                        protocol="tcp",
                        access_from="Custom(172.16.0.0/16)",
                        access_type="private",
                    ),
                ],
                auto_snapshot=False,
            )
        }

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            patch(
                "prowler.providers.aws.services.lightsail.lightsail_service.Lightsail",
                new=lightsail_client,
            ),
        ):
            from prowler.providers.aws.services.lightsail.lightsail_instance_public.lightsail_instance_public import (
                lightsail_instance_public,
            )

            check = lightsail_instance_public()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Instance 'test-instance' is not publicly exposed."
            )
            assert result[0].resource_tags == []
            assert (
                result[0].resource_arn == f"{BASE_LIGHTSAIL_ARN}:Instance/test-instance"
            )
            assert result[0].resource_id == "1234/5678"
            assert result[0].region == AWS_REGION_US_EAST_1

    def test_public_instance(self):
        lightsail_client = MagicMock
        lightsail_client.instances = {
            f"{BASE_LIGHTSAIL_ARN}:Instance/test-instance": Instance(
                name="test-instance",
                id="1234/5678",
                arn=f"{BASE_LIGHTSAIL_ARN}:Instance/test-instance",
                tags=[],
                region=AWS_REGION_US_EAST_1,
                availability_zone=AWS_REGION_US_EAST_1_AZA,
                static_ip=False,
                public_ip="1.2.3.4",
                private_ip="10.0.0.3",
                ipv6_addresses=[],
                ip_address_type="ipv4",
                ports=[
                    PortRange(
                        range="80",
                        protocol="tcp",
                        access_from="Anywhere(::/0)",
                        access_type="public",
                    ),
                    PortRange(
                        range="443",
                        protocol="tcp",
                        access_from="Anywhere(::/0)",
                        access_type="public",
                    ),
                ],
                auto_snapshot=False,
            )
        }

        with patch(
            "prowler.providers.aws.services.lightsail.lightsail_service.Lightsail",
            new=lightsail_client,
        ):
            from prowler.providers.aws.services.lightsail.lightsail_instance_public.lightsail_instance_public import (
                lightsail_instance_public,
            )

            check = lightsail_instance_public()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Instance 'test-instance' is publicly exposed. The open ports are: 80, 443"
            )
            assert result[0].resource_tags == []
            assert (
                result[0].resource_arn == f"{BASE_LIGHTSAIL_ARN}:Instance/test-instance"
            )
            assert result[0].resource_id == "1234/5678"
            assert result[0].region == AWS_REGION_US_EAST_1
```

--------------------------------------------------------------------------------

---[FILE: lightsail_static_ip_unused_test.py]---
Location: prowler-master/tests/providers/aws/services/lightsail/lightsail_static_ip_unused/lightsail_static_ip_unused_test.py

```python
from unittest.mock import MagicMock, patch

from prowler.providers.aws.services.lightsail.lightsail_service import StaticIP
from tests.providers.aws.utils import (
    AWS_REGION_US_EAST_1,
    AWS_REGION_US_EAST_1_AZA,
    BASE_LIGHTSAIL_ARN,
    set_mocked_aws_provider,
)


class Test_lightsail_static_ip_unused:
    def test_lightsail_no_statics_ips(self):
        lightsail_client = MagicMock
        lightsail_client.static_ips = {}

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            patch(
                "prowler.providers.aws.services.lightsail.lightsail_service.Lightsail",
                new=lightsail_client,
            ),
        ):
            from prowler.providers.aws.services.lightsail.lightsail_static_ip_unused.lightsail_static_ip_unused import (
                lightsail_static_ip_unused,
            )

            check = lightsail_static_ip_unused()
            result = check.execute()

            assert len(result) == 0

    def test_lightsail_static_ip_unused(self):
        lightsail_client = MagicMock
        lightsail_client.static_ips = {
            f"{BASE_LIGHTSAIL_ARN}:StaticIp/test-static-ip": StaticIP(
                name="test-static-ip",
                id="1234/5678",
                arn=f"{BASE_LIGHTSAIL_ARN}:StaticIp/test-static-ip",
                region=AWS_REGION_US_EAST_1,
                availability_zone=AWS_REGION_US_EAST_1_AZA,
                ip_address="1.2.3.4",
                is_attached=False,
                attached_to="",
            )
        }

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            patch(
                "prowler.providers.aws.services.lightsail.lightsail_service.Lightsail",
                new=lightsail_client,
            ),
        ):
            from prowler.providers.aws.services.lightsail.lightsail_static_ip_unused.lightsail_static_ip_unused import (
                lightsail_static_ip_unused,
            )

            check = lightsail_static_ip_unused()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Static IP 'test-static-ip' is not associated with any instance."
            )
            assert result[0].resource_id == "1234/5678"
            assert (
                result[0].resource_arn
                == f"{BASE_LIGHTSAIL_ARN}:StaticIp/test-static-ip"
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1

    def test_lightsail_static_ip_attached(self):
        lightsail_client = MagicMock
        lightsail_client.static_ips = {
            f"{BASE_LIGHTSAIL_ARN}:StaticIp/test-static-ip": StaticIP(
                name="test-static-ip",
                id="1234/5678",
                arn=f"{BASE_LIGHTSAIL_ARN}:StaticIp/test-static-ip",
                region=AWS_REGION_US_EAST_1,
                availability_zone=AWS_REGION_US_EAST_1_AZA,
                ip_address="1.2.3.4",
                is_attached=True,
                attached_to="test-instance",
            )
        }

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            patch(
                "prowler.providers.aws.services.lightsail.lightsail_service.Lightsail",
                new=lightsail_client,
            ),
        ):
            from prowler.providers.aws.services.lightsail.lightsail_static_ip_unused.lightsail_static_ip_unused import (
                lightsail_static_ip_unused,
            )

            check = lightsail_static_ip_unused()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Static IP 'test-static-ip' is associated with the instance 'test-instance'."
            )
            assert result[0].resource_id == "1234/5678"
            assert (
                result[0].resource_arn
                == f"{BASE_LIGHTSAIL_ARN}:StaticIp/test-static-ip"
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1
```

--------------------------------------------------------------------------------

---[FILE: macie_service_test.py]---
Location: prowler-master/tests/providers/aws/services/macie/macie_service_test.py

```python
import datetime
from unittest.mock import patch

import botocore

from prowler.providers.aws.services.macie.macie_service import Macie, Session
from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider

# Mocking Macie2 Calls
make_api_call = botocore.client.BaseClient._make_api_call

# As you can see the operation_name has the list_sessions snake_case form but
# we are using the GetMacieSession form.
# Rationale -> https://github.com/boto/botocore/blob/develop/botocore/client.py#L810:L816
#
# We have to mock every AWS API call using Boto3


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "GetMacieSession":
        return {
            "createdAt": datetime(2015, 1, 1),
            "findingPublishingFrequency": "SIX_HOURS",
            "serviceRole": "string",
            "status": "ENABLED",
            "updatedAt": datetime(2015, 1, 1),
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
@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
@patch(
    "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
    new=mock_generate_regional_clients,
)
class Test_Macie_Service:
    # Test Macie Client
    def test_get_client(self):
        macie = Macie(set_mocked_aws_provider([AWS_REGION_EU_WEST_1]))
        assert (
            macie.regional_clients[AWS_REGION_EU_WEST_1].__class__.__name__ == "Macie2"
        )

    # Test Macie Session
    def test__get_session__(self):
        macie = Macie(set_mocked_aws_provider([AWS_REGION_EU_WEST_1]))
        assert macie.session.__class__.__name__ == "Session"

    # Test Macie Service
    def test__get_service__(self):
        macie = Macie(set_mocked_aws_provider([AWS_REGION_EU_WEST_1]))
        assert macie.service == "macie2"

    def test_get_macie_session(self):
        # Set partition for the service
        macie = Macie(set_mocked_aws_provider([AWS_REGION_EU_WEST_1]))
        macie.sessions = [
            Session(
                status="ENABLED",
                region="eu-west-1",
            )
        ]
        assert len(macie.sessions) == 1
        assert macie.sessions[0].status == "ENABLED"
        assert macie.sessions[0].region == AWS_REGION_EU_WEST_1

    def test_get_automated_discovery_configuration(self):
        # Set partition for the service
        macie = Macie(set_mocked_aws_provider([AWS_REGION_EU_WEST_1]))
        macie.sessions = [
            Session(
                status="ENABLED",
                region="eu-west-1",
                automated_discovery_status="ENABLED",
            )
        ]
        assert len(macie.sessions) == 1
        assert macie.sessions[0].status == "ENABLED"
        assert macie.sessions[0].region == AWS_REGION_EU_WEST_1
        assert macie.sessions[0].automated_discovery_status == "ENABLED"
```

--------------------------------------------------------------------------------

---[FILE: macie_automated_sensitive_data_discovery_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/macie/macie_automated_sensitive_data_discovery_enabled/macie_automated_sensitive_data_discovery_enabled_test.py

```python
from unittest import mock

from moto import mock_aws

from prowler.providers.aws.services.macie.macie_service import Session
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)


class Test_macie_automated_sensitive_data_discovery_enabled:
    @mock_aws
    def test_macie_disabled(self):
        macie_client = mock.MagicMock
        macie_client.provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        macie_client.audited_account = AWS_ACCOUNT_NUMBER
        macie_client.audited_account_arn = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
        macie_client.audited_partition = "aws"
        macie_client.region = AWS_REGION_EU_WEST_1
        macie_client.sessions = [
            Session(
                status="DISABLED",
                region="eu-west-1",
                automated_discovery_status="DISABLED",
            )
        ]
        macie_client.session_arn_template = f"arn:{macie_client.audited_partition}:macie:{macie_client.region}:{macie_client.audited_account}:session"
        macie_client._get_session_arn_template = mock.MagicMock(
            return_value=macie_client.session_arn_template
        )
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1], create_default_organization=False
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.macie.macie_automated_sensitive_data_discovery_enabled.macie_automated_sensitive_data_discovery_enabled.macie_client",
                new=macie_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.macie.macie_automated_sensitive_data_discovery_enabled.macie_automated_sensitive_data_discovery_enabled import (
                macie_automated_sensitive_data_discovery_enabled,
            )

            check = macie_automated_sensitive_data_discovery_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_macie_enabled_automated_discovery_disabled(self):
        macie_client = mock.MagicMock
        macie_client.provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        macie_client.audited_account = AWS_ACCOUNT_NUMBER
        macie_client.audited_account_arn = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
        macie_client.audited_partition = "aws"
        macie_client.region = AWS_REGION_EU_WEST_1
        macie_client.sessions = [
            Session(
                status="ENABLED",
                region="eu-west-1",
                automated_discovery_status="DISABLED",
            )
        ]
        macie_client.session_arn_template = f"arn:{macie_client.audited_partition}:macie:{macie_client.region}:{macie_client.audited_account}:session"
        macie_client._get_session_arn_template = mock.MagicMock(
            return_value=macie_client.session_arn_template
        )
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1], create_default_organization=False
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.macie.macie_automated_sensitive_data_discovery_enabled.macie_automated_sensitive_data_discovery_enabled.macie_client",
                new=macie_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.macie.macie_automated_sensitive_data_discovery_enabled.macie_automated_sensitive_data_discovery_enabled import (
                macie_automated_sensitive_data_discovery_enabled,
            )

            check = macie_automated_sensitive_data_discovery_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Macie is enabled but it does not have automated sensitive data discovery."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:macie:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:session"
            )

    @mock_aws
    def test_macie_enabled_automated_discovery_enabled(self):
        macie_client = mock.MagicMock
        macie_client.provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        macie_client.audited_account = AWS_ACCOUNT_NUMBER
        macie_client.audited_account_arn = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
        macie_client.audited_partition = "aws"
        macie_client.region = AWS_REGION_EU_WEST_1
        macie_client.sessions = [
            Session(
                status="ENABLED",
                region="eu-west-1",
                automated_discovery_status="ENABLED",
            )
        ]
        macie_client.session_arn_template = f"arn:{macie_client.audited_partition}:macie:{macie_client.region}:{macie_client.audited_account}:session"
        macie_client._get_session_arn_template = mock.MagicMock(
            return_value=macie_client.session_arn_template
        )
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1], create_default_organization=False
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.macie.macie_automated_sensitive_data_discovery_enabled.macie_automated_sensitive_data_discovery_enabled.macie_client",
                new=macie_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.macie.macie_automated_sensitive_data_discovery_enabled.macie_automated_sensitive_data_discovery_enabled import (
                macie_automated_sensitive_data_discovery_enabled,
            )

            check = macie_automated_sensitive_data_discovery_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Macie has automated sensitive data discovery enabled."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:macie:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:session"
            )
```

--------------------------------------------------------------------------------

````
