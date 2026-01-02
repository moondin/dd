---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 528
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 528 of 867)

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

---[FILE: ec2_launch_template_no_secrets_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_launch_template_no_secrets/ec2_launch_template_no_secrets_test.py

```python
from base64 import b64encode
from os import path
from pathlib import Path
from unittest import mock

import botocore
from boto3 import client
from moto import mock_aws

from prowler.config.config import encoding_format_utf_8
from prowler.providers.aws.services.ec2.ec2_service import (
    LaunchTemplate,
    LaunchTemplateVersion,
    TemplateData,
)
from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

ACTUAL_DIRECTORY = Path(path.dirname(path.realpath(__file__)))
FIXTURES_DIR_NAME = "fixtures"

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "DescribeLaunchTemplateVersions":
        return {
            "LaunchTemplateVersions": [
                {
                    "VersionNumber": 123,
                    "LaunchTemplateData": {
                        "UserData": b64encode(
                            "DB_PASSWORD=foobar123".encode(encoding_format_utf_8)
                        ).decode(encoding_format_utf_8),
                        "NetworkInterfaces": [{"AssociatePublicIpAddress": True}],
                    },
                }
            ]
        }
    elif operation_name == "DescribeLaunchTemplates":
        return {
            "LaunchTemplates": [
                {
                    "LaunchTemplateName": "tester1",
                    "LaunchTemplateId": "lt-1234567890",
                    "Tags": [
                        {"Key": "Name", "Value": "tester1"},
                    ],
                }
            ]
        }
    return make_api_call(self, operation_name, kwarg)


class Test_ec2_launch_template_no_secrets:
    @mock_aws
    def test_no_launch_templates(self):
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        ec2_client.launch_templates = []

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_launch_template_no_secrets.ec2_launch_template_no_secrets.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_launch_template_no_secrets.ec2_launch_template_no_secrets import (
                ec2_launch_template_no_secrets,
            )

            check = ec2_launch_template_no_secrets()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_one_launch_template_with_no_secrets(self):
        # Include launch_template to check
        launch_template_name = "tester"
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        ec2_client.create_launch_template(
            LaunchTemplateName=launch_template_name,
            VersionDescription="Launch Template without secrets",
            LaunchTemplateData={
                "InstanceType": "t1.micro",
                "UserData": b64encode(
                    "This is some user_data".encode(encoding_format_utf_8)
                ).decode(encoding_format_utf_8),
            },
        )

        launch_template_id = ec2_client.describe_launch_templates()["LaunchTemplates"][
            0
        ]["LaunchTemplateId"]

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_launch_template_no_secrets.ec2_launch_template_no_secrets.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_launch_template_no_secrets.ec2_launch_template_no_secrets import (
                ec2_launch_template_no_secrets,
            )

            check = ec2_launch_template_no_secrets()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"No secrets found in User Data of any version for EC2 Launch Template {launch_template_name}."
            )
            assert result[0].resource_id == launch_template_id
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_arn == (
                f"arn:aws:ec2:us-east-1:123456789012:launch-template/{launch_template_id}"
            )
            assert result[0].resource_tags == []

    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_one_launch_template_with_secrets(self):
        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_launch_template_no_secrets.ec2_launch_template_no_secrets.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_launch_template_no_secrets.ec2_launch_template_no_secrets import (
                ec2_launch_template_no_secrets,
            )

            check = ec2_launch_template_no_secrets()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Potential secret found in User Data for EC2 Launch Template tester1 in template versions: Version 123: Secret Keyword on line 1."
            )
            assert result[0].resource_id == "lt-1234567890"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_arn == (
                "arn:aws:ec2:us-east-1:123456789012:launch-template/lt-1234567890"
            )
            assert result[0].resource_tags == [{"Key": "Name", "Value": "tester1"}]

    def test_one_launch_template_with_secrets_in_multiple_versions(self):
        ec2_client = mock.MagicMock()
        launch_template_name = "tester"
        launch_template_id = "lt-1234567890"
        launch_template_arn = (
            f"arn:aws:ec2:us-east-1:123456789012:launch-template/{launch_template_id}"
        )

        f = open(
            f"{ACTUAL_DIRECTORY}/{FIXTURES_DIR_NAME}/fixture",
            "rb",
        )
        secrets = f.read()

        launch_template_data = TemplateData(
            user_data=b64encode(secrets).decode(encoding_format_utf_8),
            associate_public_ip_address=True,
        )

        launch_template_versions = [
            LaunchTemplateVersion(
                version_number=1,
                template_data=launch_template_data,
            ),
            LaunchTemplateVersion(
                version_number=2,
                template_data=launch_template_data,
            ),
        ]

        launch_template = LaunchTemplate(
            name=launch_template_name,
            id=launch_template_id,
            arn=launch_template_arn,
            region=AWS_REGION_US_EAST_1,
            versions=launch_template_versions,
        )

        ec2_client.launch_templates = [launch_template]
        ec2_client.audit_config = {"detect_secrets_plugins": None}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=ec2_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_launch_template_no_secrets.ec2_launch_template_no_secrets.ec2_client",
                new=ec2_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_launch_template_no_secrets.ec2_launch_template_no_secrets import (
                ec2_launch_template_no_secrets,
            )

            check = ec2_launch_template_no_secrets()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Potential secret found in User Data for EC2 Launch Template {launch_template_name} in template versions: Version 1: Secret Keyword on line 1, Hex High Entropy String on line 3, Secret Keyword on line 3, Secret Keyword on line 4, Version 2: Secret Keyword on line 1, Hex High Entropy String on line 3, Secret Keyword on line 3, Secret Keyword on line 4."
            )
            assert result[0].resource_id == launch_template_id
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_arn == (
                f"arn:aws:ec2:us-east-1:123456789012:launch-template/{launch_template_id}"
            )
            assert result[0].resource_tags == []

    def test_one_launch_template_with_secrets_in_single_version(self):
        ec2_client = mock.MagicMock()
        launch_template_name = "tester"
        launch_template_id = "lt-1234567890"
        launch_template_arn = (
            f"arn:aws:ec2:us-east-1:123456789012:launch-template/{launch_template_id}"
        )

        f = open(
            f"{ACTUAL_DIRECTORY}/{FIXTURES_DIR_NAME}/fixture",
            "rb",
        )
        secrets = f.read()

        launch_template_data_secrets = TemplateData(
            user_data=b64encode(secrets).decode(encoding_format_utf_8),
            associate_public_ip_address=True,
        )
        launch_template_data_no_secrets = TemplateData(
            user_data=b64encode("sinsecretos".encode(encoding_format_utf_8)).decode(
                encoding_format_utf_8
            ),
            associate_public_ip_address=True,
        )

        launch_template_versions = [
            LaunchTemplateVersion(
                version_number=1,
                template_data=launch_template_data_secrets,
            ),
            LaunchTemplateVersion(
                version_number=2,
                template_data=launch_template_data_no_secrets,
            ),
        ]

        launch_template = LaunchTemplate(
            name=launch_template_name,
            id=launch_template_id,
            arn=launch_template_arn,
            region=AWS_REGION_US_EAST_1,
            versions=launch_template_versions,
        )

        ec2_client.launch_templates = [launch_template]
        ec2_client.audit_config = {"detect_secrets_plugins": None}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=ec2_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_launch_template_no_secrets.ec2_launch_template_no_secrets.ec2_client",
                new=ec2_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_launch_template_no_secrets.ec2_launch_template_no_secrets import (
                ec2_launch_template_no_secrets,
            )

            check = ec2_launch_template_no_secrets()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Potential secret found in User Data for EC2 Launch Template {launch_template_name} in template versions: Version 1: Secret Keyword on line 1, Hex High Entropy String on line 3, Secret Keyword on line 3, Secret Keyword on line 4."
            )
            assert result[0].resource_id == launch_template_id
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_arn == (
                f"arn:aws:ec2:us-east-1:123456789012:launch-template/{launch_template_id}"
            )
            assert result[0].resource_tags == []

    def test_one_launch_template_with_secrets_gzip(self):
        ec2_client = mock.MagicMock()
        launch_template_name = "tester"
        launch_template_id = "lt-1234567890"
        launch_template_arn = (
            f"arn:aws:ec2:us-east-1:123456789012:launch-template/{launch_template_id}"
        )

        f = open(
            f"{ACTUAL_DIRECTORY}/{FIXTURES_DIR_NAME}/fixture.gz",
            "rb",
        )
        secrets = f.read()

        launch_template_data = TemplateData(
            user_data=b64encode(secrets).decode(encoding_format_utf_8),
            associate_public_ip_address=True,
        )

        launch_template_versions = [
            LaunchTemplateVersion(
                version_number=1,
                template_data=launch_template_data,
            ),
        ]

        launch_template = LaunchTemplate(
            name=launch_template_name,
            id=launch_template_id,
            arn=launch_template_arn,
            region=AWS_REGION_US_EAST_1,
            versions=launch_template_versions,
        )

        ec2_client.launch_templates = [launch_template]
        ec2_client.audit_config = {"detect_secrets_plugins": None}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=ec2_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_launch_template_no_secrets.ec2_launch_template_no_secrets.ec2_client",
                new=ec2_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_launch_template_no_secrets.ec2_launch_template_no_secrets import (
                ec2_launch_template_no_secrets,
            )

            check = ec2_launch_template_no_secrets()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Potential secret found in User Data for EC2 Launch Template {launch_template_name} in template versions: Version 1: Secret Keyword on line 1, Hex High Entropy String on line 3, Secret Keyword on line 3, Secret Keyword on line 4."
            )
            assert result[0].resource_id == launch_template_id
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_arn == (
                f"arn:aws:ec2:us-east-1:123456789012:launch-template/{launch_template_id}"
            )
            assert result[0].resource_tags == []

    @mock_aws
    def test_one_launch_template_without_user_data(self):
        launch_template_name = "tester"

        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        ec2_client.create_launch_template(
            LaunchTemplateName=launch_template_name,
            VersionDescription="Launch Template without user data",
            LaunchTemplateData={
                "InstanceType": "t1.micro",
            },
        )

        launch_template_id = ec2_client.describe_launch_templates()["LaunchTemplates"][
            0
        ]["LaunchTemplateId"]

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_launch_template_no_secrets.ec2_launch_template_no_secrets.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_launch_template_no_secrets.ec2_launch_template_no_secrets import (
                ec2_launch_template_no_secrets,
            )

            check = ec2_launch_template_no_secrets()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"No secrets found in User Data of any version for EC2 Launch Template {launch_template_name}."
            )
            assert result[0].resource_id == launch_template_id
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_arn == (
                f"arn:aws:ec2:us-east-1:123456789012:launch-template/{launch_template_id}"
            )
            assert result[0].resource_tags == []

    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_two_launch_templates_one_template_with_secrets(self):
        ec2_client = mock.MagicMock()
        launch_template_name1 = "tester-secrets"
        launch_template_name2 = "tester-no-secrets"
        launch_template_id1 = "lt-1234567890"
        launch_template_id2 = "lt-0987654321"
        launch_template_arn1 = (
            f"arn:aws:ec2:us-east-1:123456789012:launch-template/{launch_template_id1}"
        )
        launch_template_arn2 = (
            f"arn:aws:ec2:us-east-1:123456789012:launch-template/{launch_template_id2}"
        )

        f = open(
            f"{ACTUAL_DIRECTORY}/{FIXTURES_DIR_NAME}/fixture",
            "rb",
        )
        secrets = f.read()

        launch_template_data_secrets = TemplateData(
            user_data=b64encode(secrets).decode(encoding_format_utf_8),
            associate_public_ip_address=True,
        )
        launch_template_data_no_secrets = TemplateData(
            user_data=b64encode("sinsecretos".encode(encoding_format_utf_8)).decode(
                encoding_format_utf_8
            ),
            associate_public_ip_address=True,
        )

        launch_template_secrets_version = [
            LaunchTemplateVersion(
                version_number=1,
                template_data=launch_template_data_secrets,
            ),
        ]
        launch_template_no_secret_version = [
            LaunchTemplateVersion(
                version_number=2,
                template_data=launch_template_data_no_secrets,
            ),
        ]

        launch_template_secrets = LaunchTemplate(
            name=launch_template_name1,
            id=launch_template_id1,
            arn=launch_template_arn1,
            region=AWS_REGION_US_EAST_1,
            versions=launch_template_secrets_version,
        )
        launch_template_no_secrets = LaunchTemplate(
            name=launch_template_name2,
            id=launch_template_id2,
            arn=launch_template_arn2,
            region=AWS_REGION_US_EAST_1,
            versions=launch_template_no_secret_version,
        )

        ec2_client.launch_templates = [
            launch_template_secrets,
            launch_template_no_secrets,
        ]
        ec2_client.audit_config = {"detect_secrets_plugins": None}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=ec2_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_launch_template_no_secrets.ec2_launch_template_no_secrets.ec2_client",
                new=ec2_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_launch_template_no_secrets.ec2_launch_template_no_secrets import (
                ec2_launch_template_no_secrets,
            )

            check = ec2_launch_template_no_secrets()
            result = check.execute()

            assert len(result) == 2
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Potential secret found in User Data for EC2 Launch Template {launch_template_name1} in template versions: Version 1: Secret Keyword on line 1, Hex High Entropy String on line 3, Secret Keyword on line 3, Secret Keyword on line 4."
            )
            assert result[0].resource_id == launch_template_id1
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_arn == (
                f"arn:aws:ec2:us-east-1:123456789012:launch-template/{launch_template_id1}"
            )
            assert result[0].resource_tags == []

            assert result[1].status == "PASS"
            assert (
                result[1].status_extended
                == f"No secrets found in User Data of any version for EC2 Launch Template {launch_template_name2}."
            )
            assert result[1].resource_id == launch_template_id2
            assert result[1].region == AWS_REGION_US_EAST_1
            assert result[1].resource_arn == (
                f"arn:aws:ec2:us-east-1:123456789012:launch-template/{launch_template_id2}"
            )
            assert result[1].resource_tags == []

    @mock_aws
    def test_one_launch_template_with_unicode_error(self):
        launch_template_name = "tester"
        invalid_utf8_bytes = b"\xc0\xaf"

        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        ec2_client.create_launch_template(
            LaunchTemplateName=launch_template_name,
            VersionDescription="Launch Template with secrets",
            LaunchTemplateData={
                "InstanceType": "t1.micro",
                "UserData": b64encode(invalid_utf8_bytes).decode(encoding_format_utf_8),
            },
        )

        launch_template_id = ec2_client.describe_launch_templates()["LaunchTemplates"][
            0
        ]["LaunchTemplateId"]

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_launch_template_no_secrets.ec2_launch_template_no_secrets.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_launch_template_no_secrets.ec2_launch_template_no_secrets import (
                ec2_launch_template_no_secrets,
            )

            check = ec2_launch_template_no_secrets()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"No secrets found in User Data of any version for EC2 Launch Template {launch_template_name}."
            )
            assert result[0].resource_id == launch_template_id
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_arn == (
                f"arn:aws:ec2:us-east-1:123456789012:launch-template/{launch_template_id}"
            )
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: fixture]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_launch_template_no_secrets/fixtures/fixture

```text
DB_PASSWORD=foobar123
DB_USER=foo
API_KEY=12345abcd
SERVICE_PASSWORD=bbaabb45
```

--------------------------------------------------------------------------------

---[FILE: ec2_networkacl_allow_ingress_any_port_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_networkacl_allow_ingress_any_port/ec2_networkacl_allow_ingress_any_port_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_ec2_networkacl_allow_ingress_any_port:
    @mock_aws
    def test_ec2_default_nacls(self):
        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_networkacl_allow_ingress_any_port.ec2_networkacl_allow_ingress_any_port.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_networkacl_allow_ingress_any_port.ec2_networkacl_allow_ingress_any_port import (
                ec2_networkacl_allow_ingress_any_port,
            )

            check = ec2_networkacl_allow_ingress_any_port()
            result = check.execute()

            # One default nacl per region
            assert len(result) == 2

    @mock_aws
    def test_ec2_non_default_compliant_nacl(self):
        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_networkacl_allow_ingress_any_port.ec2_networkacl_allow_ingress_any_port.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_networkacl_allow_ingress_any_port.ec2_networkacl_allow_ingress_any_port import (
                ec2_networkacl_allow_ingress_any_port,
            )

            check = ec2_networkacl_allow_ingress_any_port()
            result = check.execute()

            # One default sg per region
            assert len(result) == 2

            # by default nacls are public
            assert result[0].status == "FAIL"
            assert result[0].region in (AWS_REGION_US_EAST_1, "eu-west-1")
            assert result[0].resource_tags == []
            assert (
                result[0].status_extended
                == f"Network ACL {result[0].resource_id} has every port open to the Internet."
            )

    @mock_aws
    def test_ec2_non_compliant_nacl(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]
        nacl_id = ec2_client.create_network_acl(VpcId=vpc_id)["NetworkAcl"][
            "NetworkAclId"
        ]
        ec2_client.create_network_acl_entry(
            NetworkAclId=nacl_id,
            RuleNumber=100,
            Protocol="-1",
            RuleAction="allow",
            Egress=False,
            CidrBlock="0.0.0.0/0",
        )

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_networkacl_allow_ingress_any_port.ec2_networkacl_allow_ingress_any_port.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_networkacl_allow_ingress_any_port.ec2_networkacl_allow_ingress_any_port import (
                ec2_networkacl_allow_ingress_any_port,
            )

            check = ec2_networkacl_allow_ingress_any_port()
            result = check.execute()

            # One default sg per region + default of new VPC + new NACL
            assert len(result) == 4
            # Search changed sg
            for nacl in result:
                if nacl.resource_id == nacl_id:
                    assert nacl.status == "FAIL"
                    assert result[0].region in (AWS_REGION_US_EAST_1, "eu-west-1")
                    assert result[0].resource_tags == []
                    assert (
                        nacl.status_extended
                        == f"Network ACL {nacl_id} has every port open to the Internet."
                    )
                    assert (
                        nacl.resource_arn
                        == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:network-acl/{nacl_id}"
                    )

    @mock_aws
    def test_ec2_compliant_nacl(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]
        nacl_id = ec2_client.create_network_acl(VpcId=vpc_id)["NetworkAcl"][
            "NetworkAclId"
        ]
        ec2_client.create_network_acl_entry(
            NetworkAclId=nacl_id,
            RuleNumber=100,
            Protocol="-1",
            RuleAction="allow",
            Egress=False,
            CidrBlock="10.0.0.2/32",
        )

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_networkacl_allow_ingress_any_port.ec2_networkacl_allow_ingress_any_port.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_networkacl_allow_ingress_any_port.ec2_networkacl_allow_ingress_any_port import (
                ec2_networkacl_allow_ingress_any_port,
            )

            check = ec2_networkacl_allow_ingress_any_port()
            result = check.execute()

            # One default sg per region + default of new VPC + new NACL
            assert len(result) == 4
            # Search changed sg
            for nacl in result:
                if nacl.resource_id == nacl_id:
                    assert nacl.status == "PASS"
                    assert result[0].region in (AWS_REGION_US_EAST_1, "eu-west-1")
                    assert result[0].resource_tags == []
                    assert (
                        nacl.status_extended
                        == f"Network ACL {nacl_id} does not have every port open to the Internet."
                    )
                    assert (
                        nacl.resource_arn
                        == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:network-acl/{nacl_id}"
                    )

    @mock_aws
    def test_ec2_non_compliant_nacl_ignoring(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]
        nacl_id = ec2_client.create_network_acl(VpcId=vpc_id)["NetworkAcl"][
            "NetworkAclId"
        ]
        ec2_client.create_network_acl_entry(
            NetworkAclId=nacl_id,
            RuleNumber=100,
            Protocol="-1",
            RuleAction="allow",
            Egress=False,
            CidrBlock="0.0.0.0/0",
        )

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
            scan_unused_services=False,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_networkacl_allow_ingress_any_port.ec2_networkacl_allow_ingress_any_port.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_networkacl_allow_ingress_any_port.ec2_networkacl_allow_ingress_any_port import (
                ec2_networkacl_allow_ingress_any_port,
            )

            check = ec2_networkacl_allow_ingress_any_port()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_ec2_non_compliant_nacl_ignoring_with_sgs(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]
        nacl_id = ec2_client.create_network_acl(VpcId=vpc_id)["NetworkAcl"][
            "NetworkAclId"
        ]
        ec2_client.create_network_acl_entry(
            NetworkAclId=nacl_id,
            RuleNumber=100,
            Protocol="-1",
            RuleAction="allow",
            Egress=False,
            CidrBlock="0.0.0.0/0",
        )
        ec2_client.create_security_group(GroupName="sg", Description="test")

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
            scan_unused_services=False,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_networkacl_allow_ingress_any_port.ec2_networkacl_allow_ingress_any_port.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_networkacl_allow_ingress_any_port.ec2_networkacl_allow_ingress_any_port import (
                ec2_networkacl_allow_ingress_any_port,
            )

            check = ec2_networkacl_allow_ingress_any_port()
            result = check.execute()

            # One default sg per region + default of new VPC + new NACL
            assert len(result) == 3
            # Search changed sg
            for nacl in result:
                if nacl.resource_id == nacl_id:
                    assert nacl.status == "FAIL"
                    assert result[0].region in (AWS_REGION_US_EAST_1, "eu-west-1")
                    assert result[0].resource_tags == []
                    assert (
                        nacl.status_extended
                        == f"Network ACL {nacl_id} has every port open to the Internet."
                    )
                    assert (
                        nacl.resource_arn
                        == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:network-acl/{nacl_id}"
                    )
```

--------------------------------------------------------------------------------

````
