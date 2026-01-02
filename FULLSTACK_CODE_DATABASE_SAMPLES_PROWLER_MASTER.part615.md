---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 615
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 615 of 867)

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

---[FILE: route53_dangling_ip_subdomain_takeover_test.py]---
Location: prowler-master/tests/providers/aws/services/route53/route53_dangling_ip_subdomain_takeover/route53_dangling_ip_subdomain_takeover_test.py

```python
from unittest import mock

from boto3 import client, resource
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

HOSTED_ZONE_NAME = "testdns.aws.com."


class Test_route53_dangling_ip_subdomain_takeover:
    @mock_aws
    def test_no_hosted_zones(self):
        from prowler.providers.aws.services.ec2.ec2_service import EC2
        from prowler.providers.aws.services.route53.route53_service import Route53

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.route53.route53_dangling_ip_subdomain_takeover.route53_dangling_ip_subdomain_takeover.route53_client",
                new=Route53(aws_provider),
            ):
                with mock.patch(
                    "prowler.providers.aws.services.route53.route53_dangling_ip_subdomain_takeover.route53_dangling_ip_subdomain_takeover.ec2_client",
                    new=EC2(aws_provider),
                ):
                    # Test Check
                    from prowler.providers.aws.services.route53.route53_dangling_ip_subdomain_takeover.route53_dangling_ip_subdomain_takeover import (
                        route53_dangling_ip_subdomain_takeover,
                    )

                    check = route53_dangling_ip_subdomain_takeover()
                    result = check.execute()

                    assert len(result) == 0

    @mock_aws
    def test_hosted_zone_no_records(self):
        conn = client("route53", region_name=AWS_REGION_US_EAST_1)

        conn.create_hosted_zone(
            Name=HOSTED_ZONE_NAME, CallerReference=str(hash("foo"))
        )["HostedZone"]["Id"]

        from prowler.providers.aws.services.ec2.ec2_service import EC2
        from prowler.providers.aws.services.route53.route53_service import Route53

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.route53.route53_dangling_ip_subdomain_takeover.route53_dangling_ip_subdomain_takeover.route53_client",
                new=Route53(aws_provider),
            ):
                with mock.patch(
                    "prowler.providers.aws.services.route53.route53_dangling_ip_subdomain_takeover.route53_dangling_ip_subdomain_takeover.ec2_client",
                    new=EC2(aws_provider),
                ):
                    # Test Check
                    from prowler.providers.aws.services.route53.route53_dangling_ip_subdomain_takeover.route53_dangling_ip_subdomain_takeover import (
                        route53_dangling_ip_subdomain_takeover,
                    )

                    check = route53_dangling_ip_subdomain_takeover()
                    result = check.execute()

                    assert len(result) == 0

    @mock_aws
    def test_hosted_zone_private_record(self):
        conn = client("route53", region_name=AWS_REGION_US_EAST_1)

        zone_id = conn.create_hosted_zone(
            Name=HOSTED_ZONE_NAME, CallerReference=str(hash("foo"))
        )["HostedZone"]["Id"]

        record_set_name = "foo.bar.testdns.aws.com."
        record_ip = "192.168.1.1"
        conn.change_resource_record_sets(
            HostedZoneId=zone_id,
            ChangeBatch={
                "Changes": [
                    {
                        "Action": "CREATE",
                        "ResourceRecordSet": {
                            "Name": record_set_name,
                            "Type": "A",
                            "ResourceRecords": [{"Value": record_ip}],
                        },
                    }
                ]
            },
        )
        from prowler.providers.aws.services.ec2.ec2_service import EC2
        from prowler.providers.aws.services.route53.route53_service import Route53

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.route53.route53_dangling_ip_subdomain_takeover.route53_dangling_ip_subdomain_takeover.route53_client",
                new=Route53(aws_provider),
            ):
                with mock.patch(
                    "prowler.providers.aws.services.route53.route53_dangling_ip_subdomain_takeover.route53_dangling_ip_subdomain_takeover.ec2_client",
                    new=EC2(aws_provider),
                ):
                    # Test Check
                    from prowler.providers.aws.services.route53.route53_dangling_ip_subdomain_takeover.route53_dangling_ip_subdomain_takeover import (
                        route53_dangling_ip_subdomain_takeover,
                    )

                    check = route53_dangling_ip_subdomain_takeover()
                    result = check.execute()

                    assert len(result) == 1
                    assert result[0].status == "PASS"
                    assert (
                        result[0].status_extended
                        == f"Route53 record {record_ip} (name: {record_set_name}) in Hosted Zone {HOSTED_ZONE_NAME} is not a dangling IP."
                    )
                    assert (
                        result[0].resource_id
                        == zone_id.replace("/hostedzone/", "")
                        + "/"
                        + record_set_name
                        + "/192.168.1.1"
                    )
                    assert (
                        result[0].resource_arn
                        == f"arn:{aws_provider.identity.partition}:route53:::hostedzone/{zone_id.replace('/hostedzone/', '')}"
                    )

    @mock_aws
    def test_hosted_zone_external_record(self):
        conn = client("route53", region_name=AWS_REGION_US_EAST_1)

        zone_id = conn.create_hosted_zone(
            Name=HOSTED_ZONE_NAME, CallerReference=str(hash("foo"))
        )["HostedZone"]["Id"]

        record_set_name = "foo.bar.testdns.aws.com."
        record_ip = "17.5.7.3"
        conn.change_resource_record_sets(
            HostedZoneId=zone_id,
            ChangeBatch={
                "Changes": [
                    {
                        "Action": "CREATE",
                        "ResourceRecordSet": {
                            "Name": record_set_name,
                            "Type": "A",
                            "ResourceRecords": [{"Value": record_ip}],
                        },
                    }
                ]
            },
        )
        from prowler.providers.aws.services.ec2.ec2_service import EC2
        from prowler.providers.aws.services.route53.route53_service import Route53

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.route53.route53_dangling_ip_subdomain_takeover.route53_dangling_ip_subdomain_takeover.route53_client",
                new=Route53(aws_provider),
            ):
                with mock.patch(
                    "prowler.providers.aws.services.route53.route53_dangling_ip_subdomain_takeover.route53_dangling_ip_subdomain_takeover.ec2_client",
                    new=EC2(aws_provider),
                ):
                    # Test Check
                    from prowler.providers.aws.services.route53.route53_dangling_ip_subdomain_takeover.route53_dangling_ip_subdomain_takeover import (
                        route53_dangling_ip_subdomain_takeover,
                    )

                    check = route53_dangling_ip_subdomain_takeover()
                    result = check.execute()

                    assert len(result) == 1
                    assert result[0].status == "PASS"
                    assert (
                        result[0].status_extended
                        == f"Route53 record {record_ip} (name: {record_set_name}) in Hosted Zone {HOSTED_ZONE_NAME} does not belong to AWS and it is not a dangling IP."
                    )
                    assert (
                        result[0].resource_id
                        == zone_id.replace("/hostedzone/", "")
                        + "/"
                        + record_set_name
                        + "/17.5.7.3"
                    )
                    assert (
                        result[0].resource_arn
                        == f"arn:{aws_provider.identity.partition}:route53:::hostedzone/{zone_id.replace('/hostedzone/', '')}"
                    )

    @mock_aws
    def test_hosted_zone_dangling_public_record(self):
        conn = client("route53", region_name=AWS_REGION_US_EAST_1)

        zone_id = conn.create_hosted_zone(
            Name=HOSTED_ZONE_NAME, CallerReference=str(hash("foo"))
        )["HostedZone"]["Id"]

        record_set_name = "foo.bar.testdns.aws.com."
        record_ip = "54.152.12.70"
        conn.change_resource_record_sets(
            HostedZoneId=zone_id,
            ChangeBatch={
                "Changes": [
                    {
                        "Action": "CREATE",
                        "ResourceRecordSet": {
                            "Name": record_set_name,
                            "Type": "A",
                            "ResourceRecords": [{"Value": record_ip}],
                        },
                    }
                ]
            },
        )
        from prowler.providers.aws.services.ec2.ec2_service import EC2
        from prowler.providers.aws.services.route53.route53_service import Route53

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.route53.route53_dangling_ip_subdomain_takeover.route53_dangling_ip_subdomain_takeover.route53_client",
                new=Route53(aws_provider),
            ):
                with mock.patch(
                    "prowler.providers.aws.services.route53.route53_dangling_ip_subdomain_takeover.route53_dangling_ip_subdomain_takeover.ec2_client",
                    new=EC2(aws_provider),
                ):
                    # Test Check
                    from prowler.providers.aws.services.route53.route53_dangling_ip_subdomain_takeover.route53_dangling_ip_subdomain_takeover import (
                        route53_dangling_ip_subdomain_takeover,
                    )

                    check = route53_dangling_ip_subdomain_takeover()
                    result = check.execute()

                    assert len(result) == 1
                    assert result[0].status == "FAIL"
                    assert (
                        result[0].status_extended
                        == f"Route53 record {record_ip} (name: {record_set_name}) in Hosted Zone {HOSTED_ZONE_NAME} is a dangling IP which can lead to a subdomain takeover attack."
                    )
                    assert (
                        result[0].resource_id
                        == zone_id.replace("/hostedzone/", "")
                        + "/"
                        + record_set_name
                        + "/54.152.12.70"
                    )
                    assert (
                        result[0].resource_arn
                        == f"arn:{aws_provider.identity.partition}:route53:::hostedzone/{zone_id.replace('/hostedzone/', '')}"
                    )

    @mock_aws
    def test_hosted_zone_eip_record(self):
        conn = client("route53", region_name=AWS_REGION_US_EAST_1)
        ec2 = client("ec2", region_name=AWS_REGION_US_EAST_1)

        address = "17.5.7.3"
        ec2.allocate_address(Domain="vpc", Address=address)

        zone_id = conn.create_hosted_zone(
            Name=HOSTED_ZONE_NAME, CallerReference=str(hash("foo"))
        )["HostedZone"]["Id"]

        record_set_name = "foo.bar.testdns.aws.com."
        record_ip = address
        conn.change_resource_record_sets(
            HostedZoneId=zone_id,
            ChangeBatch={
                "Changes": [
                    {
                        "Action": "CREATE",
                        "ResourceRecordSet": {
                            "Name": record_set_name,
                            "Type": "A",
                            "ResourceRecords": [{"Value": record_ip}],
                        },
                    }
                ]
            },
        )
        from prowler.providers.aws.services.ec2.ec2_service import EC2
        from prowler.providers.aws.services.route53.route53_service import Route53

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.route53.route53_dangling_ip_subdomain_takeover.route53_dangling_ip_subdomain_takeover.route53_client",
                new=Route53(aws_provider),
            ):
                with mock.patch(
                    "prowler.providers.aws.services.route53.route53_dangling_ip_subdomain_takeover.route53_dangling_ip_subdomain_takeover.ec2_client",
                    new=EC2(aws_provider),
                ):
                    # Test Check
                    from prowler.providers.aws.services.route53.route53_dangling_ip_subdomain_takeover.route53_dangling_ip_subdomain_takeover import (
                        route53_dangling_ip_subdomain_takeover,
                    )

                    check = route53_dangling_ip_subdomain_takeover()
                    result = check.execute()

                    assert len(result) == 1
                    assert result[0].status == "PASS"
                    assert (
                        result[0].status_extended
                        == f"Route53 record {record_ip} (name: {record_set_name}) in Hosted Zone {HOSTED_ZONE_NAME} is not a dangling IP."
                    )
                    assert (
                        result[0].resource_id
                        == zone_id.replace("/hostedzone/", "")
                        + "/"
                        + record_set_name
                        + "/17.5.7.3"
                    )
                    assert (
                        result[0].resource_arn
                        == f"arn:{aws_provider.identity.partition}:route53:::hostedzone/{zone_id.replace('/hostedzone/', '')}"
                    )

    @mock_aws
    def test_hosted_zone_eni_record(self):
        conn = client("route53", region_name=AWS_REGION_US_EAST_1)
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc = ec2.create_vpc(CidrBlock="10.0.0.0/16")
        subnet = ec2.create_subnet(VpcId=vpc.id, CidrBlock="10.0.0.0/18")
        eni_id = ec2.create_network_interface(SubnetId=subnet.id).id
        address = "17.5.7.3"
        eip = ec2_client.allocate_address(Domain="vpc", Address=address)
        ec2_client.associate_address(
            NetworkInterfaceId=eni_id, AllocationId=eip["AllocationId"]
        )

        zone_id = conn.create_hosted_zone(
            Name=HOSTED_ZONE_NAME, CallerReference=str(hash("foo"))
        )["HostedZone"]["Id"]

        record_set_name = "foo.bar.testdns.aws.com."
        record_ip = address
        conn.change_resource_record_sets(
            HostedZoneId=zone_id,
            ChangeBatch={
                "Changes": [
                    {
                        "Action": "CREATE",
                        "ResourceRecordSet": {
                            "Name": record_set_name,
                            "Type": "A",
                            "ResourceRecords": [{"Value": record_ip}],
                        },
                    }
                ]
            },
        )
        from prowler.providers.aws.services.ec2.ec2_service import EC2
        from prowler.providers.aws.services.route53.route53_service import Route53

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.route53.route53_dangling_ip_subdomain_takeover.route53_dangling_ip_subdomain_takeover.route53_client",
                new=Route53(aws_provider),
            ):
                with mock.patch(
                    "prowler.providers.aws.services.route53.route53_dangling_ip_subdomain_takeover.route53_dangling_ip_subdomain_takeover.ec2_client",
                    new=EC2(aws_provider),
                ):
                    # Test Check
                    from prowler.providers.aws.services.route53.route53_dangling_ip_subdomain_takeover.route53_dangling_ip_subdomain_takeover import (
                        route53_dangling_ip_subdomain_takeover,
                    )

                    check = route53_dangling_ip_subdomain_takeover()
                    result = check.execute()

                    assert len(result) == 1
                    assert result[0].status == "PASS"
                    assert (
                        result[0].status_extended
                        == f"Route53 record {record_ip} (name: {record_set_name}) in Hosted Zone {HOSTED_ZONE_NAME} is not a dangling IP."
                    )
                    assert (
                        result[0].resource_id
                        == zone_id.replace("/hostedzone/", "")
                        + "/"
                        + record_set_name
                        + "/17.5.7.3"
                    )
                    assert (
                        result[0].resource_arn
                        == f"arn:{aws_provider.identity.partition}:route53:::hostedzone/{zone_id.replace('/hostedzone/', '')}"
                    )
```

--------------------------------------------------------------------------------

---[FILE: route53_domains_privacy_protection_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/route53/route53_domains_privacy_protection_enabled/route53_domains_privacy_protection_enabled_test.py

```python
from unittest import mock

from prowler.providers.aws.services.route53.route53_service import Domain
from tests.providers.aws.utils import AWS_ACCOUNT_ARN, AWS_REGION_US_EAST_1


class Test_route53_domains_privacy_protection_enabled:
    def test_no_domains(self):
        route53domains = mock.MagicMock
        route53domains.domains = {}

        with mock.patch(
            "prowler.providers.aws.services.route53.route53_service.Route53Domains",
            new=route53domains,
        ):
            # Test Check
            from prowler.providers.aws.services.route53.route53_domains_privacy_protection_enabled.route53_domains_privacy_protection_enabled import (
                route53_domains_privacy_protection_enabled,
            )

            check = route53_domains_privacy_protection_enabled()
            result = check.execute()

            assert len(result) == 0

    def test_domain_privacy_protection_disabled(self):
        route53domains = mock.MagicMock
        route53domains.audited_account_arn = AWS_ACCOUNT_ARN
        domain_name = "test-domain.com"
        route53domains.domains = {
            domain_name: Domain(
                name=domain_name,
                arn=f"arn:aws:route53:::domain/{domain_name}",
                region=AWS_REGION_US_EAST_1,
                admin_privacy=False,
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.route53.route53_service.Route53Domains",
            new=route53domains,
        ):
            # Test Check
            from prowler.providers.aws.services.route53.route53_domains_privacy_protection_enabled.route53_domains_privacy_protection_enabled import (
                route53_domains_privacy_protection_enabled,
            )

            check = route53_domains_privacy_protection_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].resource_id == domain_name
            assert result[0].resource_arn == f"arn:aws:route53:::domain/{domain_name}"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Contact information is public for the {domain_name} domain."
            )

    def test_domain_privacy_protection_enabled(self):
        route53domains = mock.MagicMock
        route53domains.audited_account_arn = AWS_ACCOUNT_ARN
        domain_name = "test-domain.com"
        route53domains.domains = {
            domain_name: Domain(
                name=domain_name,
                arn=f"arn:aws:route53:::domain/{domain_name}",
                region=AWS_REGION_US_EAST_1,
                admin_privacy=True,
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.route53.route53_service.Route53Domains",
            new=route53domains,
        ):
            # Test Check
            from prowler.providers.aws.services.route53.route53_domains_privacy_protection_enabled.route53_domains_privacy_protection_enabled import (
                route53_domains_privacy_protection_enabled,
            )

            check = route53_domains_privacy_protection_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].resource_id == domain_name
            assert result[0].resource_arn == f"arn:aws:route53:::domain/{domain_name}"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Contact information is private for the {domain_name} domain."
            )
```

--------------------------------------------------------------------------------

---[FILE: route53_domains_transferlock_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/route53/route53_domains_transferlock_enabled/route53_domains_transferlock_enabled_test.py

```python
from unittest import mock

from prowler.providers.aws.services.route53.route53_service import Domain
from tests.providers.aws.utils import AWS_ACCOUNT_ARN, AWS_REGION_US_EAST_1


class Test_route53_domains_transferlock_enabled:
    def test_no_domains(self):
        route53domains = mock.MagicMock
        route53domains.domains = {}

        with mock.patch(
            "prowler.providers.aws.services.route53.route53_service.Route53Domains",
            new=route53domains,
        ):
            # Test Check
            from prowler.providers.aws.services.route53.route53_domains_transferlock_enabled.route53_domains_transferlock_enabled import (
                route53_domains_transferlock_enabled,
            )

            check = route53_domains_transferlock_enabled()
            result = check.execute()

            assert len(result) == 0

    def test_domain_transfer_lock_disabled(self):
        route53domains = mock.MagicMock
        route53domains.audited_account_arn = AWS_ACCOUNT_ARN
        domain_name = "test-domain.com"
        route53domains.domains = {
            domain_name: Domain(
                name=domain_name,
                arn=f"arn:aws:route53:::domain/{domain_name}",
                region=AWS_REGION_US_EAST_1,
                admin_privacy=False,
                status_list=[""],
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.route53.route53_service.Route53Domains",
            new=route53domains,
        ):
            # Test Check
            from prowler.providers.aws.services.route53.route53_domains_transferlock_enabled.route53_domains_transferlock_enabled import (
                route53_domains_transferlock_enabled,
            )

            check = route53_domains_transferlock_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].resource_id == domain_name
            assert result[0].resource_arn == f"arn:aws:route53:::domain/{domain_name}"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Transfer Lock is disabled for the {domain_name} domain."
            )

    def test_domain_transfer_lock_enabled(self):
        route53domains = mock.MagicMock
        route53domains.audited_account_arn = AWS_ACCOUNT_ARN
        domain_name = "test-domain.com"
        route53domains.domains = {
            domain_name: Domain(
                name=domain_name,
                arn=f"arn:aws:route53:::domain/{domain_name}",
                region=AWS_REGION_US_EAST_1,
                admin_privacy=False,
                status_list=["clientTransferProhibited"],
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.route53.route53_service.Route53Domains",
            new=route53domains,
        ):
            # Test Check
            from prowler.providers.aws.services.route53.route53_domains_transferlock_enabled.route53_domains_transferlock_enabled import (
                route53_domains_transferlock_enabled,
            )

            check = route53_domains_transferlock_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].resource_id == domain_name
            assert result[0].resource_arn == f"arn:aws:route53:::domain/{domain_name}"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Transfer Lock is enabled for the {domain_name} domain."
            )
```

--------------------------------------------------------------------------------

---[FILE: route53_public_hosted_zones_cloudwatch_logging_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/route53/route53_public_hosted_zones_cloudwatch_logging_enabled/route53_public_hosted_zones_cloudwatch_logging_enabled_test.py

```python
from unittest import mock

from prowler.providers.aws.services.route53.route53_service import (
    HostedZone,
    LoggingConfig,
)
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_US_EAST_1


class Test_route53_public_hosted_zones_cloudwatch_logging_enabled:
    def test_no_hosted_zones(self):
        route53 = mock.MagicMock
        route53.hosted_zones = {}

        with (
            mock.patch(
                "prowler.providers.aws.services.route53.route53_service.Route53",
                new=route53,
            ),
            mock.patch(
                "prowler.providers.aws.services.route53.route53_public_hosted_zones_cloudwatch_logging_enabled.route53_public_hosted_zones_cloudwatch_logging_enabled.route53_client",
                new=route53,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.route53.route53_public_hosted_zones_cloudwatch_logging_enabled.route53_public_hosted_zones_cloudwatch_logging_enabled import (
                route53_public_hosted_zones_cloudwatch_logging_enabled,
            )

            check = route53_public_hosted_zones_cloudwatch_logging_enabled()
            result = check.execute()

            assert len(result) == 0

    def test_hosted_zone__public_logging_enabled(self):
        route53 = mock.MagicMock
        hosted_zone_name = "test-domain.com"
        hosted_zone_id = "ABCDEF12345678"
        log_group_name = "test-log-group"
        log_group_arn = f"rn:aws:logs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:log-group:{log_group_name}"
        route53.hosted_zones = {
            hosted_zone_name: HostedZone(
                name=hosted_zone_name,
                arn=f"arn:aws:route53:::{hosted_zone_id}",
                id=hosted_zone_id,
                private_zone=False,
                region=AWS_REGION_US_EAST_1,
                logging_config=LoggingConfig(cloudwatch_log_group_arn=log_group_arn),
            )
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.route53.route53_service.Route53",
                new=route53,
            ),
            mock.patch(
                "prowler.providers.aws.services.route53.route53_public_hosted_zones_cloudwatch_logging_enabled.route53_public_hosted_zones_cloudwatch_logging_enabled.route53_client",
                new=route53,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.route53.route53_public_hosted_zones_cloudwatch_logging_enabled.route53_public_hosted_zones_cloudwatch_logging_enabled import (
                route53_public_hosted_zones_cloudwatch_logging_enabled,
            )

            check = route53_public_hosted_zones_cloudwatch_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].resource_id == hosted_zone_id
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Route53 Public Hosted Zone {hosted_zone_id} has query logging enabled in Log Group {log_group_arn}."
            )

    def test_hosted_zone__public_logging_disabled(self):
        route53 = mock.MagicMock
        hosted_zone_name = "test-domain.com"
        hosted_zone_id = "ABCDEF12345678"
        route53.hosted_zones = {
            hosted_zone_name: HostedZone(
                name=hosted_zone_name,
                arn=f"arn:aws:route53:::{hosted_zone_id}",
                id=hosted_zone_id,
                private_zone=False,
                region=AWS_REGION_US_EAST_1,
            )
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.route53.route53_service.Route53",
                new=route53,
            ),
            mock.patch(
                "prowler.providers.aws.services.route53.route53_public_hosted_zones_cloudwatch_logging_enabled.route53_public_hosted_zones_cloudwatch_logging_enabled.route53_client",
                new=route53,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.route53.route53_public_hosted_zones_cloudwatch_logging_enabled.route53_public_hosted_zones_cloudwatch_logging_enabled import (
                route53_public_hosted_zones_cloudwatch_logging_enabled,
            )

            check = route53_public_hosted_zones_cloudwatch_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].resource_id == hosted_zone_id
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Route53 Public Hosted Zone {hosted_zone_id} has query logging disabled."
            )

    def test_two_hosted_zone_public_one_logging_enabled_other_disabled(self):
        route53 = mock.MagicMock
        hosted_zone_name = "test-domain.com"
        hosted_zone_id = "ABCDEF12345678"
        log_group_name = "test-log-group"
        log_group_arn = f"rn:aws:logs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:log-group:{log_group_name}"

        hosted_zone_name_disabled = "test-domain-disabled.com"
        hosted_zone_id_disabled = "ABCDEF123456789"

        route53.hosted_zones = {
            hosted_zone_name: HostedZone(
                name=hosted_zone_name,
                arn=f"arn:aws:route53:::{hosted_zone_id}",
                id=hosted_zone_id,
                private_zone=False,
                region=AWS_REGION_US_EAST_1,
                logging_config=LoggingConfig(cloudwatch_log_group_arn=log_group_arn),
            ),
            hosted_zone_name_disabled: HostedZone(
                name=hosted_zone_name_disabled,
                arn=f"arn:aws:route53:::{hosted_zone_id_disabled}",
                id=hosted_zone_id_disabled,
                private_zone=False,
                region=AWS_REGION_US_EAST_1,
            ),
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.route53.route53_service.Route53",
                new=route53,
            ),
            mock.patch(
                "prowler.providers.aws.services.route53.route53_public_hosted_zones_cloudwatch_logging_enabled.route53_public_hosted_zones_cloudwatch_logging_enabled.route53_client",
                new=route53,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.route53.route53_public_hosted_zones_cloudwatch_logging_enabled.route53_public_hosted_zones_cloudwatch_logging_enabled import (
                route53_public_hosted_zones_cloudwatch_logging_enabled,
            )

            check = route53_public_hosted_zones_cloudwatch_logging_enabled()
            result = check.execute()

            assert len(result) == 2
            assert result[0].resource_id == hosted_zone_id
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Route53 Public Hosted Zone {hosted_zone_id} has query logging enabled in Log Group {log_group_arn}."
            )
            assert result[1].resource_id == hosted_zone_id_disabled
            assert result[1].region == AWS_REGION_US_EAST_1
            assert result[1].status == "FAIL"
            assert (
                result[1].status_extended
                == f"Route53 Public Hosted Zone {hosted_zone_id_disabled} has query logging disabled."
            )

    def test_hosted_zone__private(self):
        route53 = mock.MagicMock
        hosted_zone_name = "test-domain.com"
        hosted_zone_id = "ABCDEF12345678"
        route53.hosted_zones = {
            hosted_zone_name: HostedZone(
                name=hosted_zone_name,
                arn=f"arn:aws:route53:::{hosted_zone_id}",
                id=hosted_zone_id,
                private_zone=True,
                region=AWS_REGION_US_EAST_1,
            )
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.route53.route53_service.Route53",
                new=route53,
            ),
            mock.patch(
                "prowler.providers.aws.services.route53.route53_public_hosted_zones_cloudwatch_logging_enabled.route53_public_hosted_zones_cloudwatch_logging_enabled.route53_client",
                new=route53,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.route53.route53_public_hosted_zones_cloudwatch_logging_enabled.route53_public_hosted_zones_cloudwatch_logging_enabled import (
                route53_public_hosted_zones_cloudwatch_logging_enabled,
            )

            check = route53_public_hosted_zones_cloudwatch_logging_enabled()
            result = check.execute()

            assert len(result) == 0
```

--------------------------------------------------------------------------------

````
