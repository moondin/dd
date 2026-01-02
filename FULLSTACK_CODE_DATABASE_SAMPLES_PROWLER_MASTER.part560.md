---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 560
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 560 of 867)

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

---[FILE: fsx_service_test.py]---
Location: prowler-master/tests/providers/aws/services/fsx/fsx_service_test.py

```python
from boto3 import client
from mock import patch
from moto import mock_aws

from prowler.providers.aws.services.fsx.fsx_service import FSx
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
class Test_FSx_Service:
    # Test FSx Service
    def test_service(self):
        aws_provider = set_mocked_aws_provider()
        fsx = FSx(aws_provider)
        assert fsx.service == "fsx"

    # Test FSx Client
    def test_client(self):
        aws_provider = set_mocked_aws_provider()
        fsx = FSx(aws_provider)
        assert fsx.client.__class__.__name__ == "FSx"

    # Test FSx Session
    def test__get_session__(self):
        aws_provider = set_mocked_aws_provider()
        fsx = FSx(aws_provider)
        assert fsx.session.__class__.__name__ == "Session"

    # Test FSx Session
    def test_audited_account(self):
        aws_provider = set_mocked_aws_provider()
        fsx = FSx(aws_provider)
        assert fsx.audited_account == AWS_ACCOUNT_NUMBER

    # Test FSx Describe File Systems
    @mock_aws
    def test_describe_file_systems(self):
        fsx_client = client("fsx", region_name=AWS_REGION_US_EAST_1)
        file_system = fsx_client.create_file_system(
            FileSystemType="LUSTRE",
            StorageCapacity=1200,
            LustreConfiguration={"CopyTagsToBackups": True},
            Tags=[{"Key": "Name", "Value": "Test"}],
            SubnetIds=["subnet-12345678", "subnet-12345670"],
        )
        arn = f"arn:aws:fsx:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:file-system/{file_system['FileSystem']['FileSystemId']}"
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        fsx = FSx(aws_provider)
        assert len(fsx.file_systems) == 1
        assert fsx.file_systems[arn].id == file_system["FileSystem"]["FileSystemId"]
        assert fsx.file_systems[arn].type == "LUSTRE"
        assert fsx.file_systems[arn].copy_tags_to_backups
        assert fsx.file_systems[arn].region == AWS_REGION_US_EAST_1
        assert fsx.file_systems[arn].tags == [{"Key": "Name", "Value": "Test"}]
        assert (
            fsx.file_systems[arn].subnet_ids == file_system["FileSystem"]["SubnetIds"]
        )
```

--------------------------------------------------------------------------------

---[FILE: fsx_file_system_copy_tags_to_backups_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/fsx/fsx_file_system_copy_tags_to_backups_enabled/fsx_file_system_copy_tags_to_backups_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.fsx.fsx_service import FSx
from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider


class Test_fsx_file_system_copy_tags_to_backups_enabled:
    @mock_aws
    def test_fsx_no_file_system(self):
        client("fsx", region_name=AWS_REGION_EU_WEST_1)

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.fsx.fsx_file_system_copy_tags_to_backups_enabled.fsx_file_system_copy_tags_to_backups_enabled.fsx_client",
                new=FSx(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.fsx.fsx_file_system_copy_tags_to_backups_enabled.fsx_file_system_copy_tags_to_backups_enabled import (
                fsx_file_system_copy_tags_to_backups_enabled,
            )

            check = fsx_file_system_copy_tags_to_backups_enabled()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_ontap(self):
        fsx_client = client("fsx", region_name=AWS_REGION_EU_WEST_1)
        fsx_client.create_file_system(
            FileSystemType="ONTAP",
            StorageCapacity=1200,
            Tags=[{"Key": "Name", "Value": "Test"}],
            SubnetIds=["subnet-12345678"],
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.fsx.fsx_file_system_copy_tags_to_backups_enabled.fsx_file_system_copy_tags_to_backups_enabled.fsx_client",
                new=FSx(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.fsx.fsx_file_system_copy_tags_to_backups_enabled.fsx_file_system_copy_tags_to_backups_enabled import (
                fsx_file_system_copy_tags_to_backups_enabled,
            )

            check = fsx_file_system_copy_tags_to_backups_enabled()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_openzfs_copy_tags_to_backups_disabled(self):
        fsx_client = client("fsx", region_name=AWS_REGION_EU_WEST_1)
        file_system = fsx_client.create_file_system(
            FileSystemType="OPENZFS",
            StorageCapacity=1200,
            OpenZFSConfiguration={
                "CopyTagsToBackups": False,
                "DeploymentType": "SINGLE_AZ_1",
                "ThroughputCapacity": 12,
            },
            Tags=[{"Key": "Name", "Value": "Test"}],
            SubnetIds=["subnet-12345678"],
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.fsx.fsx_file_system_copy_tags_to_backups_enabled.fsx_file_system_copy_tags_to_backups_enabled.fsx_client",
                new=FSx(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.fsx.fsx_file_system_copy_tags_to_backups_enabled.fsx_file_system_copy_tags_to_backups_enabled import (
                fsx_file_system_copy_tags_to_backups_enabled,
            )

            check = fsx_file_system_copy_tags_to_backups_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"FSx file system {file_system['FileSystem']['FileSystemId']} does not have copy tags to backups enabled."
            )
            assert result[0].resource_id == file_system["FileSystem"]["FileSystemId"]
            assert (
                result[0].resource_arn
                == f"arn:aws:fsx:{AWS_REGION_EU_WEST_1}:123456789012:file-system/{file_system['FileSystem']['FileSystemId']}"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    def test_openzfs_copy_tags_to_backups_enabled(self):
        fsx_client = client("fsx", region_name=AWS_REGION_EU_WEST_1)
        file_system = fsx_client.create_file_system(
            FileSystemType="OPENZFS",
            StorageCapacity=1200,
            OpenZFSConfiguration={
                "CopyTagsToBackups": True,
                "DeploymentType": "SINGLE_AZ_1",
                "ThroughputCapacity": 12,
            },
            Tags=[{"Key": "Name", "Value": "Test"}],
            SubnetIds=["subnet-12345678"],
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.fsx.fsx_file_system_copy_tags_to_backups_enabled.fsx_file_system_copy_tags_to_backups_enabled.fsx_client",
                new=FSx(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.fsx.fsx_file_system_copy_tags_to_backups_enabled.fsx_file_system_copy_tags_to_backups_enabled import (
                fsx_file_system_copy_tags_to_backups_enabled,
            )

            check = fsx_file_system_copy_tags_to_backups_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"FSx file system {file_system['FileSystem']['FileSystemId']} has copy tags to backups enabled."
            )
            assert result[0].resource_id == file_system["FileSystem"]["FileSystemId"]
            assert (
                result[0].resource_arn
                == f"arn:aws:fsx:{AWS_REGION_EU_WEST_1}:123456789012:file-system/{file_system['FileSystem']['FileSystemId']}"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    def test_lustre_copy_tags_to_backups_disabled(self):
        fsx_client = client("fsx", region_name=AWS_REGION_EU_WEST_1)
        file_system = fsx_client.create_file_system(
            FileSystemType="LUSTRE",
            StorageCapacity=1200,
            LustreConfiguration={"CopyTagsToBackups": False},
            Tags=[{"Key": "Name", "Value": "Test"}],
            SubnetIds=["subnet-12345678"],
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.fsx.fsx_file_system_copy_tags_to_backups_enabled.fsx_file_system_copy_tags_to_backups_enabled.fsx_client",
                new=FSx(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.fsx.fsx_file_system_copy_tags_to_backups_enabled.fsx_file_system_copy_tags_to_backups_enabled import (
                fsx_file_system_copy_tags_to_backups_enabled,
            )

            check = fsx_file_system_copy_tags_to_backups_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"FSx file system {file_system['FileSystem']['FileSystemId']} does not have copy tags to backups enabled."
            )
            assert result[0].resource_id == file_system["FileSystem"]["FileSystemId"]
            assert (
                result[0].resource_arn
                == f"arn:aws:fsx:{AWS_REGION_EU_WEST_1}:123456789012:file-system/{file_system['FileSystem']['FileSystemId']}"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    def test_lustre_copy_tags_to_backups_enabled(self):
        fsx_client = client("fsx", region_name=AWS_REGION_EU_WEST_1)
        file_system = fsx_client.create_file_system(
            FileSystemType="LUSTRE",
            StorageCapacity=1200,
            LustreConfiguration={"CopyTagsToBackups": True},
            Tags=[{"Key": "Name", "Value": "Test"}],
            SubnetIds=["subnet-12345678"],
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.fsx.fsx_file_system_copy_tags_to_backups_enabled.fsx_file_system_copy_tags_to_backups_enabled.fsx_client",
                new=FSx(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.fsx.fsx_file_system_copy_tags_to_backups_enabled.fsx_file_system_copy_tags_to_backups_enabled import (
                fsx_file_system_copy_tags_to_backups_enabled,
            )

            check = fsx_file_system_copy_tags_to_backups_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"FSx file system {file_system['FileSystem']['FileSystemId']} has copy tags to backups enabled."
            )
            assert result[0].resource_id == file_system["FileSystem"]["FileSystemId"]
            assert (
                result[0].resource_arn
                == f"arn:aws:fsx:{AWS_REGION_EU_WEST_1}:123456789012:file-system/{file_system['FileSystem']['FileSystemId']}"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    def test_windows_copy_tags_to_backups_disabled(self):
        fsx_client = client("fsx", region_name=AWS_REGION_EU_WEST_1)
        file_system = fsx_client.create_file_system(
            FileSystemType="WINDOWS",
            StorageCapacity=1200,
            WindowsConfiguration={
                "CopyTagsToBackups": False,
                "ThroughputCapacity": 12,
            },
            Tags=[{"Key": "Name", "Value": "Test"}],
            SubnetIds=["subnet-12345678"],
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.fsx.fsx_file_system_copy_tags_to_backups_enabled.fsx_file_system_copy_tags_to_backups_enabled.fsx_client",
                new=FSx(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.fsx.fsx_file_system_copy_tags_to_backups_enabled.fsx_file_system_copy_tags_to_backups_enabled import (
                fsx_file_system_copy_tags_to_backups_enabled,
            )

            check = fsx_file_system_copy_tags_to_backups_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"FSx file system {file_system['FileSystem']['FileSystemId']} does not have copy tags to backups enabled."
            )
            assert result[0].resource_id == file_system["FileSystem"]["FileSystemId"]
            assert (
                result[0].resource_arn
                == f"arn:aws:fsx:{AWS_REGION_EU_WEST_1}:123456789012:file-system/{file_system['FileSystem']['FileSystemId']}"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    def test_windows_copy_tags_to_backups_enabled(self):
        fsx_client = client("fsx", region_name=AWS_REGION_EU_WEST_1)
        file_system = fsx_client.create_file_system(
            FileSystemType="WINDOWS",
            StorageCapacity=1200,
            WindowsConfiguration={
                "CopyTagsToBackups": True,
                "ThroughputCapacity": 12,
            },
            Tags=[{"Key": "Name", "Value": "Test"}],
            SubnetIds=["subnet-12345678"],
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.fsx.fsx_file_system_copy_tags_to_backups_enabled.fsx_file_system_copy_tags_to_backups_enabled.fsx_client",
                new=FSx(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.fsx.fsx_file_system_copy_tags_to_backups_enabled.fsx_file_system_copy_tags_to_backups_enabled import (
                fsx_file_system_copy_tags_to_backups_enabled,
            )

            check = fsx_file_system_copy_tags_to_backups_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"FSx file system {file_system['FileSystem']['FileSystemId']} has copy tags to backups enabled."
            )
            assert result[0].resource_id == file_system["FileSystem"]["FileSystemId"]
            assert (
                result[0].resource_arn
                == f"arn:aws:fsx:{AWS_REGION_EU_WEST_1}:123456789012:file-system/{file_system['FileSystem']['FileSystemId']}"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
```

--------------------------------------------------------------------------------

---[FILE: fsx_file_system_copy_tags_to_volumes_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/fsx/fsx_file_system_copy_tags_to_volumes_enabled/fsx_file_system_copy_tags_to_volumes_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.fsx.fsx_service import FSx
from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider


class Test_fsx_file_system_copy_tags_to_volumes_enabled:
    @mock_aws
    def test_fsx_no_file_system(self):
        client("fsx", region_name=AWS_REGION_EU_WEST_1)

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.fsx.fsx_file_system_copy_tags_to_volumes_enabled.fsx_file_system_copy_tags_to_volumes_enabled.fsx_client",
                new=FSx(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.fsx.fsx_file_system_copy_tags_to_volumes_enabled.fsx_file_system_copy_tags_to_volumes_enabled import (
                fsx_file_system_copy_tags_to_volumes_enabled,
            )

            check = fsx_file_system_copy_tags_to_volumes_enabled()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_fsx_file_system_not_openzfs(self):
        fsx_client = client("fsx", region_name=AWS_REGION_EU_WEST_1)
        fsx_client.create_file_system(
            FileSystemType="LUSTRE",
            StorageCapacity=1200,
            LustreConfiguration={"CopyTagsToBackups": True},
            Tags=[{"Key": "Name", "Value": "Test"}],
            SubnetIds=["subnet-12345678"],
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.fsx.fsx_file_system_copy_tags_to_volumes_enabled.fsx_file_system_copy_tags_to_volumes_enabled.fsx_client",
                new=FSx(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.fsx.fsx_file_system_copy_tags_to_volumes_enabled.fsx_file_system_copy_tags_to_volumes_enabled import (
                fsx_file_system_copy_tags_to_volumes_enabled,
            )

            check = fsx_file_system_copy_tags_to_volumes_enabled()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_fsx_copy_tags_to_volumes_disabled(self):
        fsx_client = client("fsx", region_name=AWS_REGION_EU_WEST_1)
        file_system = fsx_client.create_file_system(
            FileSystemType="OPENZFS",
            StorageCapacity=1200,
            OpenZFSConfiguration={
                "CopyTagsToVolumes": False,
                "DeploymentType": "SINGLE_AZ_1",
                "ThroughputCapacity": 12,
            },
            Tags=[{"Key": "Name", "Value": "Test"}],
            SubnetIds=["subnet-12345678"],
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.fsx.fsx_file_system_copy_tags_to_volumes_enabled.fsx_file_system_copy_tags_to_volumes_enabled.fsx_client",
                new=FSx(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.fsx.fsx_file_system_copy_tags_to_volumes_enabled.fsx_file_system_copy_tags_to_volumes_enabled import (
                fsx_file_system_copy_tags_to_volumes_enabled,
            )

            check = fsx_file_system_copy_tags_to_volumes_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"FSx file system {file_system['FileSystem']['FileSystemId']} does not have copy tags to volumes enabled."
            )
            assert result[0].resource_id == file_system["FileSystem"]["FileSystemId"]
            assert (
                result[0].resource_arn
                == f"arn:aws:fsx:{AWS_REGION_EU_WEST_1}:123456789012:file-system/{file_system['FileSystem']['FileSystemId']}"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    def test_fsx_copy_tags_to_volumes_enabled(self):
        fsx_client = client("fsx", region_name=AWS_REGION_EU_WEST_1)
        file_system = fsx_client.create_file_system(
            FileSystemType="OPENZFS",
            StorageCapacity=1200,
            OpenZFSConfiguration={
                "CopyTagsToVolumes": True,
                "DeploymentType": "SINGLE_AZ_1",
                "ThroughputCapacity": 12,
            },
            Tags=[{"Key": "Name", "Value": "Test"}],
            SubnetIds=["subnet-12345678"],
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.fsx.fsx_file_system_copy_tags_to_volumes_enabled.fsx_file_system_copy_tags_to_volumes_enabled.fsx_client",
                new=FSx(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.fsx.fsx_file_system_copy_tags_to_volumes_enabled.fsx_file_system_copy_tags_to_volumes_enabled import (
                fsx_file_system_copy_tags_to_volumes_enabled,
            )

            check = fsx_file_system_copy_tags_to_volumes_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"FSx file system {file_system['FileSystem']['FileSystemId']} has copy tags to volumes enabled."
            )
            assert result[0].resource_id == file_system["FileSystem"]["FileSystemId"]
            assert (
                result[0].resource_arn
                == f"arn:aws:fsx:{AWS_REGION_EU_WEST_1}:123456789012:file-system/{file_system['FileSystem']['FileSystemId']}"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
```

--------------------------------------------------------------------------------

---[FILE: fsx_file_system_multi_az_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/fsx/fsx_file_system_multi_az_enabled/fsx_file_system_multi_az_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.fsx.fsx_service import FSx
from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider


class Test_fsx_windows_file_system_multi_az:
    @mock_aws
    def test_fsx_no_file_system(self):
        client("fsx", region_name=AWS_REGION_EU_WEST_1)

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.fsx.fsx_windows_file_system_multi_az_enabled.fsx_windows_file_system_multi_az_enabled.fsx_client",
                new=FSx(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.fsx.fsx_windows_file_system_multi_az_enabled.fsx_windows_file_system_multi_az_enabled import (
                fsx_windows_file_system_multi_az_enabled,
            )

            check = fsx_windows_file_system_multi_az_enabled()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_fsx_file_system_not_windows(self):
        fsx_client = client("fsx", region_name=AWS_REGION_EU_WEST_1)
        fsx_client.create_file_system(
            FileSystemType="LUSTRE",
            StorageCapacity=1200,
            LustreConfiguration={"CopyTagsToBackups": True},
            Tags=[{"Key": "Name", "Value": "Test"}],
            SubnetIds=["subnet-12345678"],
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.fsx.fsx_windows_file_system_multi_az_enabled.fsx_windows_file_system_multi_az_enabled.fsx_client",
                new=FSx(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.fsx.fsx_windows_file_system_multi_az_enabled.fsx_windows_file_system_multi_az_enabled import (
                fsx_windows_file_system_multi_az_enabled,
            )

            check = fsx_windows_file_system_multi_az_enabled()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_fsx_windows_not_multi_az(self):
        fsx_client = client("fsx", region_name=AWS_REGION_EU_WEST_1)
        file_system = fsx_client.create_file_system(
            FileSystemType="WINDOWS",
            StorageCapacity=1200,
            OpenZFSConfiguration={
                "CopyTagsToVolumes": False,
                "DeploymentType": "SINGLE_AZ_1",
                "ThroughputCapacity": 12,
            },
            Tags=[{"Key": "Name", "Value": "Test"}],
            SubnetIds=["subnet-12345678"],
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.fsx.fsx_windows_file_system_multi_az_enabled.fsx_windows_file_system_multi_az_enabled.fsx_client",
                new=FSx(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.fsx.fsx_windows_file_system_multi_az_enabled.fsx_windows_file_system_multi_az_enabled import (
                fsx_windows_file_system_multi_az_enabled,
            )

            check = fsx_windows_file_system_multi_az_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"FSx Windows file system {file_system['FileSystem']['FileSystemId']} is not configured for Multi-AZ deployment."
            )
            assert result[0].resource_id == file_system["FileSystem"]["FileSystemId"]
            assert (
                result[0].resource_arn
                == f"arn:aws:fsx:{AWS_REGION_EU_WEST_1}:123456789012:file-system/{file_system['FileSystem']['FileSystemId']}"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    def test_fsx_windows_multi_az(self):
        fsx_client = client("fsx", region_name=AWS_REGION_EU_WEST_1)
        file_system = fsx_client.create_file_system(
            FileSystemType="WINDOWS",
            StorageCapacity=1200,
            OpenZFSConfiguration={
                "CopyTagsToVolumes": True,
                "DeploymentType": "MULTI_AZ_1",
                "ThroughputCapacity": 12,
            },
            Tags=[{"Key": "Name", "Value": "Test"}],
            SubnetIds=["subnet-12345678", "subnet-12345670"],
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.fsx.fsx_windows_file_system_multi_az_enabled.fsx_windows_file_system_multi_az_enabled.fsx_client",
                new=FSx(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.fsx.fsx_windows_file_system_multi_az_enabled.fsx_windows_file_system_multi_az_enabled import (
                fsx_windows_file_system_multi_az_enabled,
            )

            check = fsx_windows_file_system_multi_az_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"FSx Windows file system {file_system['FileSystem']['FileSystemId']} is configured for Multi-AZ deployment."
            )
            assert result[0].resource_id == file_system["FileSystem"]["FileSystemId"]
            assert (
                result[0].resource_arn
                == f"arn:aws:fsx:{AWS_REGION_EU_WEST_1}:123456789012:file-system/{file_system['FileSystem']['FileSystemId']}"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
```

--------------------------------------------------------------------------------

---[FILE: glacier_service_test.py]---
Location: prowler-master/tests/providers/aws/services/glacier/glacier_service_test.py

```python
import json
from unittest.mock import patch

import botocore

from prowler.providers.aws.services.glacier.glacier_service import Glacier
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

# Mocking Access Analyzer Calls
make_api_call = botocore.client.BaseClient._make_api_call

TEST_VAULT_ARN = (
    f"arn:aws:glacier:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:vaults/examplevault"
)
vault_json_policy = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "cross-account-upload",
            "Principal": {"AWS": [f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"]},
            "Effect": "Allow",
            "Action": [
                "glacier:UploadArchive",
                "glacier:InitiateMultipartUpload",
                "glacier:AbortMultipartUpload",
                "glacier:CompleteMultipartUpload",
            ],
            "Resource": [TEST_VAULT_ARN],
        }
    ],
}


def mock_make_api_call(self, operation_name, kwarg):
    """We have to mock every AWS API call using Boto3"""
    if operation_name == "ListVaults":
        return {
            "VaultList": [
                {
                    "VaultARN": TEST_VAULT_ARN,
                    "VaultName": "examplevault",
                    "CreationDate": "2012-03-16T22:22:47.214Z",
                    "LastInventoryDate": "2012-03-21T22:06:51.218Z",
                    "NumberOfArchives": 2,
                    "SizeInBytes": 12334,
                },
            ],
        }

    if operation_name == "GetVaultAccessPolicy":
        return {"policy": {"Policy": json.dumps(vault_json_policy)}}

    if operation_name == "ListTagsForVault":
        return {"Tags": {"test": "test"}}

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
class Test_Glacier_Service:
    # Test Glacier Client
    def test_get_client(self):
        glacier = Glacier(
            set_mocked_aws_provider([AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1])
        )
        assert (
            glacier.regional_clients[AWS_REGION_EU_WEST_1].__class__.__name__
            == "Glacier"
        )

    # Test Glacier Session
    def test__get_session__(self):
        glacier = Glacier(
            set_mocked_aws_provider([AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1])
        )
        assert glacier.session.__class__.__name__ == "Session"

    # Test Glacier Service
    def test__get_service__(self):
        glacier = Glacier(
            set_mocked_aws_provider([AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1])
        )
        assert glacier.service == "glacier"

    def test_list_vaults(self):
        # Set partition for the service
        glacier = Glacier(
            set_mocked_aws_provider([AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1])
        )
        vault_name = "examplevault"
        assert len(glacier.vaults) == 1
        assert glacier.vaults[TEST_VAULT_ARN]
        assert glacier.vaults[TEST_VAULT_ARN].name == vault_name
        assert (
            glacier.vaults[TEST_VAULT_ARN].arn
            == f"arn:aws:glacier:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:vaults/examplevault"
        )
        assert glacier.vaults[TEST_VAULT_ARN].region == AWS_REGION_EU_WEST_1
        assert glacier.vaults[TEST_VAULT_ARN].tags == [{"test": "test"}]

    def test_get_vault_access_policy(self):
        # Set partition for the service
        glacier = Glacier(
            set_mocked_aws_provider([AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1])
        )
        vault_name = "examplevault"
        assert len(glacier.vaults) == 1
        assert glacier.vaults[TEST_VAULT_ARN]
        assert glacier.vaults[TEST_VAULT_ARN].name == vault_name
        assert (
            glacier.vaults[TEST_VAULT_ARN].arn
            == f"arn:aws:glacier:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:vaults/examplevault"
        )
        assert glacier.vaults[TEST_VAULT_ARN].region == AWS_REGION_EU_WEST_1
        assert glacier.vaults[TEST_VAULT_ARN].access_policy == vault_json_policy
```

--------------------------------------------------------------------------------

---[FILE: glacier_vaults_policy_public_access_fixer_test.py]---
Location: prowler-master/tests/providers/aws/services/glacier/glacier_vaults_policy_public_access/glacier_vaults_policy_public_access_fixer_test.py

```python
from unittest import mock

import botocore
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider

mock_make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call_public_vault(self, operation_name, kwarg):
    if operation_name == "DeleteVaultAccessPolicy":
        return {
            "ResponseMetadata": {
                "HTTPStatusCode": 204,
                "RequestId": "test-request-id",
            }
        }
    return mock_make_api_call(self, operation_name, kwarg)


def mock_make_api_call_public_vault_error(self, operation_name, kwarg):
    if operation_name == "DeleteVaultAccessPolicy":
        raise botocore.exceptions.ClientError(
            {
                "Error": {
                    "Code": "VaultNotFound",
                    "Message": "VaultNotFound",
                }
            },
            operation_name,
        )
    return mock_make_api_call(self, operation_name, kwarg)


class Test_glacier_vaults_policy_public_access_fixer:
    @mock_aws
    def test_glacier_vault_public(self):
        with mock.patch(
            "botocore.client.BaseClient._make_api_call",
            new=mock_make_api_call_public_vault,
        ):
            from prowler.providers.aws.services.glacier.glacier_service import Glacier

            aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

            with (
                mock.patch(
                    "prowler.providers.common.provider.Provider.get_global_provider",
                    return_value=aws_provider,
                ),
                mock.patch(
                    "prowler.providers.aws.services.glacier.glacier_vaults_policy_public_access.glacier_vaults_policy_public_access_fixer.glacier_client",
                    new=Glacier(aws_provider),
                ),
            ):
                from prowler.providers.aws.services.glacier.glacier_vaults_policy_public_access.glacier_vaults_policy_public_access_fixer import (
                    fixer,
                )

                assert fixer(resource_id="test-vault", region=AWS_REGION_EU_WEST_1)

    @mock_aws
    def test_glacier_vault_public_error(self):
        with mock.patch(
            "botocore.client.BaseClient._make_api_call",
            new=mock_make_api_call_public_vault_error,
        ):
            from prowler.providers.aws.services.glacier.glacier_service import Glacier

            aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

            with (
                mock.patch(
                    "prowler.providers.common.provider.Provider.get_global_provider",
                    return_value=aws_provider,
                ),
                mock.patch(
                    "prowler.providers.aws.services.glacier.glacier_vaults_policy_public_access.glacier_vaults_policy_public_access_fixer.glacier_client",
                    new=Glacier(aws_provider),
                ),
            ):
                from prowler.providers.aws.services.glacier.glacier_vaults_policy_public_access.glacier_vaults_policy_public_access_fixer import (
                    fixer,
                )

                assert not fixer(resource_id="test-vault", region=AWS_REGION_EU_WEST_1)
```

--------------------------------------------------------------------------------

````
