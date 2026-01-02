---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 447
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 447 of 867)

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

---[FILE: appstream_fleet_default_internet_access_disabled_test.py]---
Location: prowler-master/tests/providers/aws/services/appstream/appstream_fleet_default_internet_access_disabled/appstream_fleet_default_internet_access_disabled_test.py

```python
from unittest import mock

from prowler.providers.aws.services.appstream.appstream_service import Fleet

# Mock Test Region
AWS_REGION = "eu-west-1"


class Test_appstream_fleet_default_internet_access_disabled:
    def test_no_fleets(self):
        appstream_client = mock.MagicMock
        appstream_client.fleets = []
        with mock.patch(
            "prowler.providers.aws.services.appstream.appstream_service.AppStream",
            new=appstream_client,
        ):
            # Test Check
            from prowler.providers.aws.services.appstream.appstream_fleet_default_internet_access_disabled.appstream_fleet_default_internet_access_disabled import (
                appstream_fleet_default_internet_access_disabled,
            )

            check = appstream_fleet_default_internet_access_disabled()
            result = check.execute()

            assert len(result) == 0

    def test_one_fleet_internet_access_enabled(self):
        appstream_client = mock.MagicMock
        appstream_client.fleets = []
        fleet1 = Fleet(
            arn="arn",
            name="test-fleet",
            max_user_duration_in_seconds=900,
            disconnect_timeout_in_seconds=900,
            idle_disconnect_timeout_in_seconds=900,
            enable_default_internet_access=True,
            region=AWS_REGION,
        )

        appstream_client.fleets.append(fleet1)

        with mock.patch(
            "prowler.providers.aws.services.appstream.appstream_service.AppStream",
            new=appstream_client,
        ):
            # Test Check
            from prowler.providers.aws.services.appstream.appstream_fleet_default_internet_access_disabled.appstream_fleet_default_internet_access_disabled import (
                appstream_fleet_default_internet_access_disabled,
            )

            check = appstream_fleet_default_internet_access_disabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].resource_arn == fleet1.arn
            assert result[0].region == fleet1.region
            assert result[0].resource_id == fleet1.name
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Fleet {fleet1.name} has default internet access enabled."
            )
            assert result[0].resource_tags == []

    def test_one_fleet_internet_access_disbaled(self):
        appstream_client = mock.MagicMock
        appstream_client.fleets = []
        fleet1 = Fleet(
            arn="arn",
            name="test-fleet",
            max_user_duration_in_seconds=900,
            disconnect_timeout_in_seconds=900,
            idle_disconnect_timeout_in_seconds=900,
            enable_default_internet_access=False,
            region=AWS_REGION,
        )

        appstream_client.fleets.append(fleet1)

        with mock.patch(
            "prowler.providers.aws.services.appstream.appstream_service.AppStream",
            new=appstream_client,
        ):
            # Test Check
            from prowler.providers.aws.services.appstream.appstream_fleet_default_internet_access_disabled.appstream_fleet_default_internet_access_disabled import (
                appstream_fleet_default_internet_access_disabled,
            )

            check = appstream_fleet_default_internet_access_disabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].resource_arn == fleet1.arn
            assert result[0].region == fleet1.region
            assert result[0].resource_id == fleet1.name
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Fleet {fleet1.name} has default internet access disabled."
            )
            assert result[0].resource_tags == []

    def test_two_fleets_internet_access_one_enabled_two_disabled(self):
        appstream_client = mock.MagicMock
        appstream_client.fleets = []
        fleet1 = Fleet(
            arn="arn",
            name="test-fleet-1",
            max_user_duration_in_seconds=900,
            disconnect_timeout_in_seconds=900,
            idle_disconnect_timeout_in_seconds=900,
            enable_default_internet_access=True,
            region=AWS_REGION,
        )
        fleet2 = Fleet(
            arn="arn",
            name="test-fleet-2",
            max_user_duration_in_seconds=900,
            disconnect_timeout_in_seconds=900,
            idle_disconnect_timeout_in_seconds=900,
            enable_default_internet_access=False,
            region=AWS_REGION,
        )

        appstream_client.fleets.append(fleet1)
        appstream_client.fleets.append(fleet2)

        with mock.patch(
            "prowler.providers.aws.services.appstream.appstream_service.AppStream",
            new=appstream_client,
        ):
            # Test Check
            from prowler.providers.aws.services.appstream.appstream_fleet_default_internet_access_disabled.appstream_fleet_default_internet_access_disabled import (
                appstream_fleet_default_internet_access_disabled,
            )

            check = appstream_fleet_default_internet_access_disabled()
            result = check.execute()

            assert len(result) == 2

            for res in result:
                if res.resource_id == fleet1.name:
                    assert result[0].resource_arn == fleet1.arn
                    assert result[0].region == fleet1.region
                    assert result[0].resource_id == fleet1.name
                    assert result[0].status == "FAIL"
                    assert (
                        result[0].status_extended
                        == f"Fleet {fleet1.name} has default internet access enabled."
                    )
                    assert result[0].resource_tags == []
                if res.resource_id == fleet2.name:
                    assert result[1].resource_arn == fleet2.arn
                    assert result[1].region == fleet2.region
                    assert result[1].resource_id == fleet2.name
                    assert result[1].status == "PASS"
                    assert (
                        result[1].status_extended
                        == f"Fleet {fleet2.name} has default internet access disabled."
                    )
                    assert result[1].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: appstream_fleet_maximum_session_duration_test.py]---
Location: prowler-master/tests/providers/aws/services/appstream/appstream_fleet_maximum_session_duration/appstream_fleet_maximum_session_duration_test.py

```python
from unittest import mock

from prowler.providers.aws.services.appstream.appstream_service import Fleet

# Mock Test Region
AWS_REGION = "eu-west-1"


class Test_appstream_fleet_maximum_session_duration:
    def test_no_fleets(self):
        appstream_client = mock.MagicMock
        appstream_client.fleets = []
        with mock.patch(
            "prowler.providers.aws.services.appstream.appstream_service.AppStream",
            new=appstream_client,
        ):
            # Test Check
            from prowler.providers.aws.services.appstream.appstream_fleet_maximum_session_duration.appstream_fleet_maximum_session_duration import (
                appstream_fleet_maximum_session_duration,
            )

            check = appstream_fleet_maximum_session_duration()
            result = check.execute()

            assert len(result) == 0

    def test_one_fleet_maximum_session_duration_more_than_10_hours(self):
        appstream_client = mock.MagicMock
        appstream_client.fleets = []
        fleet1 = Fleet(
            arn="arn",
            name="test-fleet",
            # 11 Hours
            max_user_duration_in_seconds=11 * 60 * 60,
            disconnect_timeout_in_seconds=900,
            idle_disconnect_timeout_in_seconds=900,
            enable_default_internet_access=True,
            region=AWS_REGION,
        )

        appstream_client.fleets.append(fleet1)

        appstream_client.audit_config = {"max_session_duration_seconds": 36000}

        with mock.patch(
            "prowler.providers.aws.services.appstream.appstream_service.AppStream",
            new=appstream_client,
        ):
            # Test Check
            from prowler.providers.aws.services.appstream.appstream_fleet_maximum_session_duration.appstream_fleet_maximum_session_duration import (
                appstream_fleet_maximum_session_duration,
            )

            check = appstream_fleet_maximum_session_duration()
            result = check.execute()

            assert len(result) == 1
            assert result[0].resource_arn == fleet1.arn
            assert result[0].region == fleet1.region
            assert result[0].resource_id == fleet1.name
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Fleet {fleet1.name} has the maximum session duration configured for more that 10 hours."
            )
            assert result[0].resource_tags == []

    def test_one_fleet_maximum_session_duration_less_than_10_hours(self):
        appstream_client = mock.MagicMock
        appstream_client.fleets = []
        fleet1 = Fleet(
            arn="arn",
            name="test-fleet",
            # 9 Hours
            max_user_duration_in_seconds=9 * 60 * 60,
            disconnect_timeout_in_seconds=900,
            idle_disconnect_timeout_in_seconds=900,
            enable_default_internet_access=True,
            region=AWS_REGION,
        )

        appstream_client.fleets.append(fleet1)

        appstream_client.audit_config = {"max_session_duration_seconds": 36000}

        with mock.patch(
            "prowler.providers.aws.services.appstream.appstream_service.AppStream",
            new=appstream_client,
        ):
            # Test Check
            from prowler.providers.aws.services.appstream.appstream_fleet_maximum_session_duration.appstream_fleet_maximum_session_duration import (
                appstream_fleet_maximum_session_duration,
            )

            check = appstream_fleet_maximum_session_duration()
            result = check.execute()

            assert len(result) == 1
            assert result[0].resource_arn == fleet1.arn
            assert result[0].region == fleet1.region
            assert result[0].resource_id == fleet1.name
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Fleet {fleet1.name} has the maximum session duration configured for less that 10 hours."
            )
            assert result[0].resource_tags == []

    def test_two_fleets_one_maximum_session_duration_less_than_10_hours_on_more_than_10_hours(
        self,
    ):
        appstream_client = mock.MagicMock
        appstream_client.fleets = []
        fleet1 = Fleet(
            arn="arn",
            name="test-fleet-1",
            # 1 Hours
            max_user_duration_in_seconds=1 * 60 * 60,
            disconnect_timeout_in_seconds=900,
            idle_disconnect_timeout_in_seconds=900,
            enable_default_internet_access=True,
            region=AWS_REGION,
        )
        fleet2 = Fleet(
            arn="arn",
            name="test-fleet-2",
            # 24 Hours
            max_user_duration_in_seconds=24 * 60 * 60,
            disconnect_timeout_in_seconds=900,
            idle_disconnect_timeout_in_seconds=900,
            enable_default_internet_access=False,
            region=AWS_REGION,
        )

        appstream_client.fleets.append(fleet1)
        appstream_client.fleets.append(fleet2)

        appstream_client.audit_config = {"max_session_duration_seconds": 36000}

        with mock.patch(
            "prowler.providers.aws.services.appstream.appstream_service.AppStream",
            new=appstream_client,
        ):
            # Test Check
            from prowler.providers.aws.services.appstream.appstream_fleet_maximum_session_duration.appstream_fleet_maximum_session_duration import (
                appstream_fleet_maximum_session_duration,
            )

            check = appstream_fleet_maximum_session_duration()
            result = check.execute()

            assert len(result) == 2

            for res in result:
                if res.resource_id == fleet1.name:
                    assert result[0].resource_arn == fleet1.arn
                    assert result[0].region == fleet1.region
                    assert result[0].resource_id == fleet1.name
                    assert result[0].status == "PASS"
                    assert (
                        result[0].status_extended
                        == f"Fleet {fleet1.name} has the maximum session duration configured for less that 10 hours."
                    )
                    assert result[0].resource_tags == []

                if res.resource_id == fleet2.name:
                    assert result[1].resource_arn == fleet2.arn
                    assert result[1].region == fleet2.region
                    assert result[1].resource_id == fleet2.name
                    assert result[1].status == "FAIL"
                    assert (
                        result[1].status_extended
                        == f"Fleet {fleet2.name} has the maximum session duration configured for more that 10 hours."
                    )
                    assert result[1].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: appstream_fleet_session_disconnect_timeout_test.py]---
Location: prowler-master/tests/providers/aws/services/appstream/appstream_fleet_session_disconnect_timeout/appstream_fleet_session_disconnect_timeout_test.py

```python
from unittest import mock

from prowler.providers.aws.services.appstream.appstream_service import Fleet

# Mock Test Region
AWS_REGION = "eu-west-1"


class Test_appstream_fleet_session_disconnect_timeout:
    def test_no_fleets(self):
        appstream_client = mock.MagicMock
        appstream_client.fleets = []
        with mock.patch(
            "prowler.providers.aws.services.appstream.appstream_service.AppStream",
            new=appstream_client,
        ):
            # Test Check
            from prowler.providers.aws.services.appstream.appstream_fleet_session_disconnect_timeout.appstream_fleet_session_disconnect_timeout import (
                appstream_fleet_session_disconnect_timeout,
            )

            check = appstream_fleet_session_disconnect_timeout()
            result = check.execute()

            assert len(result) == 0

    def test_one_fleet_session_disconnect_timeout_more_than_5_minutes(self):
        appstream_client = mock.MagicMock
        appstream_client.fleets = []
        fleet1 = Fleet(
            arn="arn",
            name="test-fleet",
            max_user_duration_in_seconds=1 * 60 * 60,
            # 1 hour
            disconnect_timeout_in_seconds=1 * 60 * 60,
            idle_disconnect_timeout_in_seconds=900,
            enable_default_internet_access=True,
            region=AWS_REGION,
        )

        appstream_client.fleets.append(fleet1)
        appstream_client.audit_config = {"max_disconnect_timeout_in_seconds": 300}

        with mock.patch(
            "prowler.providers.aws.services.appstream.appstream_service.AppStream",
            new=appstream_client,
        ):
            # Test Check
            from prowler.providers.aws.services.appstream.appstream_fleet_session_disconnect_timeout.appstream_fleet_session_disconnect_timeout import (
                appstream_fleet_session_disconnect_timeout,
            )

            check = appstream_fleet_session_disconnect_timeout()
            result = check.execute()

            assert len(result) == 1
            assert result[0].resource_arn == fleet1.arn
            assert result[0].region == fleet1.region
            assert result[0].resource_id == fleet1.name
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Fleet {fleet1.name} has the session disconnect timeout set to more than 5 minutes."
            )
            assert result[0].resource_tags == []

    def test_one_fleet_session_disconnect_timeout_less_than_5_minutes(self):
        appstream_client = mock.MagicMock
        appstream_client.fleets = []
        fleet1 = Fleet(
            arn="arn",
            name="test-fleet",
            max_user_duration_in_seconds=900,
            # 4 minutes
            disconnect_timeout_in_seconds=4 * 60,
            idle_disconnect_timeout_in_seconds=900,
            enable_default_internet_access=True,
            region=AWS_REGION,
        )

        appstream_client.fleets.append(fleet1)

        appstream_client.audit_config = {"max_disconnect_timeout_in_seconds": 300}

        with mock.patch(
            "prowler.providers.aws.services.appstream.appstream_service.AppStream",
            new=appstream_client,
        ):
            # Test Check
            from prowler.providers.aws.services.appstream.appstream_fleet_session_disconnect_timeout.appstream_fleet_session_disconnect_timeout import (
                appstream_fleet_session_disconnect_timeout,
            )

            check = appstream_fleet_session_disconnect_timeout()
            result = check.execute()

            assert len(result) == 1
            assert result[0].resource_arn == fleet1.arn
            assert result[0].region == fleet1.region
            assert result[0].resource_id == fleet1.name
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Fleet {fleet1.name} has the session disconnect timeout set to less than 5 minutes."
            )
            assert result[0].resource_tags == []

    def test_two_fleets_session_disconnect_timeout_less_than_5_minutes_one_more_than_5_minutes(
        self,
    ):
        appstream_client = mock.MagicMock
        appstream_client.fleets = []
        fleet1 = Fleet(
            arn="arn",
            name="test-fleet-1",
            max_user_duration_in_seconds=1 * 60 * 60,
            # 1 Hours
            disconnect_timeout_in_seconds=1 * 60 * 60,
            idle_disconnect_timeout_in_seconds=900,
            enable_default_internet_access=True,
            region=AWS_REGION,
        )
        fleet2 = Fleet(
            arn="arn",
            name="test-fleet-2",
            max_user_duration_in_seconds=24 * 60 * 60,
            #  3 minutes
            disconnect_timeout_in_seconds=3 * 60,
            idle_disconnect_timeout_in_seconds=900,
            enable_default_internet_access=False,
            region=AWS_REGION,
        )

        appstream_client.fleets.append(fleet1)
        appstream_client.fleets.append(fleet2)

        appstream_client.audit_config = {"max_disconnect_timeout_in_seconds": 300}

        with mock.patch(
            "prowler.providers.aws.services.appstream.appstream_service.AppStream",
            new=appstream_client,
        ):
            # Test Check
            from prowler.providers.aws.services.appstream.appstream_fleet_session_disconnect_timeout.appstream_fleet_session_disconnect_timeout import (
                appstream_fleet_session_disconnect_timeout,
            )

            check = appstream_fleet_session_disconnect_timeout()
            result = check.execute()

            assert len(result) == 2

            for res in result:
                if res.resource_id == fleet1.name:
                    assert result[0].resource_arn == fleet1.arn
                    assert result[0].region == fleet1.region
                    assert result[0].resource_id == fleet1.name
                    assert result[0].status == "FAIL"
                    assert (
                        result[0].status_extended
                        == f"Fleet {fleet1.name} has the session disconnect timeout set to more than 5 minutes."
                    )
                    assert result[0].resource_tags == []
                if res.resource_id == fleet2.name:
                    assert result[1].resource_arn == fleet2.arn
                    assert result[1].region == fleet2.region
                    assert result[1].resource_id == fleet2.name
                    assert result[1].status == "PASS"
                    assert (
                        result[1].status_extended
                        == f"Fleet {fleet2.name} has the session disconnect timeout set to less than 5 minutes."
                    )
                    assert result[1].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: appstream_fleet_session_idle_disconnect_timeout_test.py]---
Location: prowler-master/tests/providers/aws/services/appstream/appstream_fleet_session_idle_disconnect_timeout/appstream_fleet_session_idle_disconnect_timeout_test.py

```python
from unittest import mock

from prowler.providers.aws.services.appstream.appstream_service import Fleet

# Mock Test Region
AWS_REGION = "eu-west-1"


class Test_appstream_fleet_session_idle_disconnect_timeout:
    def test_no_fleets(self):
        appstream_client = mock.MagicMock
        appstream_client.fleets = []
        with mock.patch(
            "prowler.providers.aws.services.appstream.appstream_service.AppStream",
            new=appstream_client,
        ):
            # Test Check
            from prowler.providers.aws.services.appstream.appstream_fleet_session_idle_disconnect_timeout.appstream_fleet_session_idle_disconnect_timeout import (
                appstream_fleet_session_idle_disconnect_timeout,
            )

            check = appstream_fleet_session_idle_disconnect_timeout()
            result = check.execute()

            assert len(result) == 0

    def test_one_fleet_session_idle_disconnect_timeout_more_than_10_minutes(self):
        appstream_client = mock.MagicMock
        appstream_client.fleets = []
        fleet1 = Fleet(
            arn="arn",
            name="test-fleet",
            max_user_duration_in_seconds=1 * 60 * 60,
            disconnect_timeout_in_seconds=1 * 60 * 60,
            # 15 minutes
            idle_disconnect_timeout_in_seconds=15 * 60,
            enable_default_internet_access=True,
            region=AWS_REGION,
        )

        appstream_client.fleets.append(fleet1)

        appstream_client.audit_config = {"max_idle_disconnect_timeout_in_seconds": 300}

        with mock.patch(
            "prowler.providers.aws.services.appstream.appstream_service.AppStream",
            new=appstream_client,
        ):
            # Test Check
            from prowler.providers.aws.services.appstream.appstream_fleet_session_idle_disconnect_timeout.appstream_fleet_session_idle_disconnect_timeout import (
                appstream_fleet_session_idle_disconnect_timeout,
            )

            check = appstream_fleet_session_idle_disconnect_timeout()
            result = check.execute()

            assert len(result) == 1
            assert result[0].resource_arn == fleet1.arn
            assert result[0].region == fleet1.region
            assert result[0].resource_id == fleet1.name
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Fleet {fleet1.name} has the session idle disconnect timeout set to more than 10 minutes."
            )
            assert result[0].resource_tags == []

    def test_one_fleet_session_idle_disconnect_timeout_less_than_10_minutes(self):
        appstream_client = mock.MagicMock
        appstream_client.fleets = []
        fleet1 = Fleet(
            arn="arn",
            name="test-fleet",
            max_user_duration_in_seconds=900,
            disconnect_timeout_in_seconds=4 * 60,
            # 8 minutes
            idle_disconnect_timeout_in_seconds=8 * 60,
            enable_default_internet_access=True,
            region=AWS_REGION,
        )

        appstream_client.fleets.append(fleet1)

        appstream_client.audit_config = {"max_idle_disconnect_timeout_in_seconds": 600}

        with mock.patch(
            "prowler.providers.aws.services.appstream.appstream_service.AppStream",
            new=appstream_client,
        ):
            # Test Check
            from prowler.providers.aws.services.appstream.appstream_fleet_session_idle_disconnect_timeout.appstream_fleet_session_idle_disconnect_timeout import (
                appstream_fleet_session_idle_disconnect_timeout,
            )

            check = appstream_fleet_session_idle_disconnect_timeout()
            result = check.execute()

            assert len(result) == 1
            assert result[0].resource_arn == fleet1.arn
            assert result[0].region == fleet1.region
            assert result[0].resource_id == fleet1.name
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Fleet {fleet1.name} has the session idle disconnect timeout set to less than 10 minutes."
            )
            assert result[0].resource_tags == []

    def test_two_fleets_session_idle_disconnect_timeout_than_10_minutes_one_more_than_10_minutes(
        self,
    ):
        appstream_client = mock.MagicMock
        appstream_client.fleets = []
        fleet1 = Fleet(
            arn="arn",
            name="test-fleet-1",
            max_user_duration_in_seconds=1 * 60 * 60,
            disconnect_timeout_in_seconds=3 * 60,
            # 5 minutes
            idle_disconnect_timeout_in_seconds=5 * 60,
            enable_default_internet_access=True,
            region=AWS_REGION,
        )
        fleet2 = Fleet(
            arn="arn",
            name="test-fleet-2",
            max_user_duration_in_seconds=24 * 60 * 60,
            disconnect_timeout_in_seconds=3 * 60,
            # 45 minutes
            idle_disconnect_timeout_in_seconds=45 * 60,
            enable_default_internet_access=False,
            region=AWS_REGION,
        )

        appstream_client.fleets.append(fleet1)
        appstream_client.fleets.append(fleet2)

        appstream_client.audit_config = {"max_idle_disconnect_timeout_in_seconds": 300}

        with mock.patch(
            "prowler.providers.aws.services.appstream.appstream_service.AppStream",
            new=appstream_client,
        ):
            # Test Check
            from prowler.providers.aws.services.appstream.appstream_fleet_session_idle_disconnect_timeout.appstream_fleet_session_idle_disconnect_timeout import (
                appstream_fleet_session_idle_disconnect_timeout,
            )

            check = appstream_fleet_session_idle_disconnect_timeout()
            result = check.execute()

            assert len(result) == 2

            for res in result:
                if res.resource_id == fleet1.name:
                    assert result[0].resource_arn == fleet1.arn
                    assert result[0].region == fleet1.region
                    assert result[0].resource_id == fleet1.name
                    assert result[0].status == "PASS"
                    assert (
                        result[0].status_extended
                        == f"Fleet {fleet1.name} has the session idle disconnect timeout set to less than 10 minutes."
                    )
                if res.resource_id == fleet2.name:
                    assert result[1].resource_arn == fleet2.arn
                    assert result[1].region == fleet2.region
                    assert result[1].resource_id == fleet2.name
                    assert result[1].status == "FAIL"
                    assert (
                        result[1].status_extended
                        == f"Fleet {fleet2.name} has the session idle disconnect timeout set to more than 10 minutes."
                    )
                    assert result[1].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: appsync_service_test.py]---
Location: prowler-master/tests/providers/aws/services/appsync/appsync_service_test.py

```python
from boto3 import client
from mock import patch
from moto import mock_aws

from prowler.providers.aws.services.appsync.appsync_service import AppSync
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


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
class Test_AppSync_Service:
    # Test AppSync Service
    def test_service(self):
        aws_provider = set_mocked_aws_provider()
        appsync = AppSync(aws_provider)
        assert appsync.service == "appsync"

    # Test AppSync Client
    def test_client(self):
        aws_provider = set_mocked_aws_provider()
        appsync = AppSync(aws_provider)
        assert appsync.client.__class__.__name__ == "AppSync"

    # Test AppSync Session
    def test__get_session__(self):
        aws_provider = set_mocked_aws_provider()
        appsync = AppSync(aws_provider)
        assert appsync.session.__class__.__name__ == "Session"

    # Test AppSync Session
    def test_audited_account(self):
        aws_provider = set_mocked_aws_provider()
        appsync = AppSync(aws_provider)
        assert appsync.audited_account == AWS_ACCOUNT_NUMBER

    # Test AppSync Describe File Systems
    @mock_aws
    def test_list_graphql_apis(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        appsync = client("appsync", region_name=AWS_REGION_US_EAST_1)
        api = appsync.create_graphql_api(
            name="test-api",
            authenticationType="API_KEY",
            logConfig={"fieldLogLevel": "ALL", "cloudWatchLogsRoleArn": "test"},
        )
        api_arn = api["graphqlApi"]["arn"]
        appsync_client = AppSync(aws_provider)

        assert appsync_client.graphql_apis[api_arn].name == "test-api"
        assert appsync_client.graphql_apis[api_arn].field_log_level == "ALL"
        assert appsync_client.graphql_apis[api_arn].authentication_type == "API_KEY"
        assert appsync_client.graphql_apis[api_arn].tags == [{}]
```

--------------------------------------------------------------------------------

---[FILE: appsync_field_level_logging_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/appsync/appsync_field_level_logging_enabled/appsync_field_level_logging_enabled_test.py

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
                    "name": "test-log-level",
                    "apiId": "idididid",
                    "apiType": "MERGED",
                    "arn": f"arn:aws:appsync:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:graphqlapi/test-log-level",
                    "authenticationType": "API_KEY",
                    "logConfig": {"fieldLogLevel": "ALL"},
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
                    "name": "test-none-log-level",
                    "apiId": "idididid",
                    "apiType": "GRAPHQL",
                    "arn": f"arn:aws:appsync:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:graphqlapi/test-none-log-level",
                    "authenticationType": "AWS_IAM",
                    "logConfig": {"fieldLogLevel": "NONE"},
                    "region": AWS_REGION_US_EAST_1,
                    "tags": {"test": "test", "test2": "test2"},
                },
            ]
        }
    return orig(self, operation_name, kwarg)


class Test_appsync_field_level_logging_enabled:
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
                "prowler.providers.aws.services.appsync.appsync_field_level_logging_enabled.appsync_field_level_logging_enabled.appsync_client",
                new=AppSync(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.appsync.appsync_field_level_logging_enabled.appsync_field_level_logging_enabled import (
                appsync_field_level_logging_enabled,
            )

            check = appsync_field_level_logging_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_graphql_no_api_key(self):

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.appsync.appsync_field_level_logging_enabled.appsync_field_level_logging_enabled.appsync_client",
                new=AppSync(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.appsync.appsync_field_level_logging_enabled.appsync_field_level_logging_enabled import (
                appsync_field_level_logging_enabled,
            )

            check = appsync_field_level_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert (
                result[0].resource_arn
                == f"arn:aws:appsync:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:graphqlapi/test-log-level"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == "idididid"
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "AppSync API test-log-level has field log level enabled."
            )
            assert result[0].resource_tags == [{"test": "test", "test2": "test2"}]

    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call_v2)
    def test_graphql_api_key(self):

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.appsync.appsync_field_level_logging_enabled.appsync_field_level_logging_enabled.appsync_client",
                new=AppSync(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.appsync.appsync_field_level_logging_enabled.appsync_field_level_logging_enabled import (
                appsync_field_level_logging_enabled,
            )

            check = appsync_field_level_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert (
                result[0].resource_arn
                == f"arn:aws:appsync:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:graphqlapi/test-none-log-level"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == "idididid"
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "AppSync API test-none-log-level does not have field log level enabled."
            )
            assert result[0].resource_tags == [{"test": "test", "test2": "test2"}]
```

--------------------------------------------------------------------------------

````
