---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 323
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 323 of 867)

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

---[FILE: vpc_service.py]---
Location: prowler-master/prowler/providers/aws/services/vpc/vpc_service.py
Signals: Pydantic

```python
import json
from typing import Optional

from botocore.client import ClientError
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class VPC(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__("ec2", provider)
        self.vpc_arn_template = (
            f"arn:{self.audited_partition}:ec2:{self.region}:{self.audited_account}:vpc"
        )
        self.vpcs = {}
        self.vpc_peering_connections = []
        self.vpc_endpoints = []
        self.vpc_endpoint_services = []
        self.__threading_call__(self._describe_vpcs)
        self.__threading_call__(self._describe_vpc_peering_connections)
        self.__threading_call__(self._describe_vpc_endpoints)
        self.__threading_call__(self._describe_vpc_endpoint_services)
        self._describe_flow_logs()
        self._describe_peering_route_tables()
        self._describe_vpc_endpoint_service_permissions()
        self.vpc_subnets = {}
        self.__threading_call__(self._describe_vpc_subnets)
        self._describe_network_interfaces()
        self.vpn_connections = {}
        self.__threading_call__(self._describe_vpn_connections)

    def _describe_vpcs(self, regional_client):
        logger.info("VPC - Describing VPCs...")
        try:
            describe_vpcs_paginator = regional_client.get_paginator("describe_vpcs")
            for page in describe_vpcs_paginator.paginate():
                for vpc in page["Vpcs"]:
                    try:
                        arn = f"arn:{self.audited_partition}:ec2:{regional_client.region}:{self.audited_account}:vpc/{vpc['VpcId']}"
                        if not self.audit_resources or (
                            is_resource_filtered(arn, self.audit_resources)
                        ):
                            vpc_name = ""
                            for tag in vpc.get("Tags", []):
                                if tag["Key"] == "Name":
                                    vpc_name = tag["Value"]
                            self.vpcs[vpc["VpcId"]] = VPCs(
                                arn=arn,
                                id=vpc["VpcId"],
                                name=vpc_name,
                                default=vpc["IsDefault"],
                                cidr_block=vpc["CidrBlock"],
                                region=regional_client.region,
                                tags=vpc.get("Tags"),
                            )
                    except Exception as error:
                        logger.error(
                            f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                        )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_vpc_peering_connections(self, regional_client):
        logger.info("VPC - Describing VPC Peering Connections...")
        try:
            describe_vpc_peering_connections_paginator = regional_client.get_paginator(
                "describe_vpc_peering_connections"
            )
            for page in describe_vpc_peering_connections_paginator.paginate():
                for conn in page["VpcPeeringConnections"]:
                    arn = f"arn:{self.audited_partition}:ec2:{regional_client.region}:{self.audited_account}:vpc-peering-connection/{conn['VpcPeeringConnectionId']}"
                    if not self.audit_resources or (
                        is_resource_filtered(arn, self.audit_resources)
                    ):
                        try:
                            conn["AccepterVpcInfo"]["CidrBlock"] = None
                            self.vpc_peering_connections.append(
                                VpcPeeringConnection(
                                    arn=arn,
                                    id=conn["VpcPeeringConnectionId"],
                                    accepter_vpc=conn["AccepterVpcInfo"]["VpcId"],
                                    accepter_cidr=conn["AccepterVpcInfo"].get(
                                        "CidrBlock"
                                    ),
                                    requester_vpc=conn["RequesterVpcInfo"]["VpcId"],
                                    requester_cidr=conn["RequesterVpcInfo"].get(
                                        "CidrBlock"
                                    ),
                                    region=regional_client.region,
                                    tags=conn.get("Tags"),
                                )
                            )
                        except Exception as error:
                            logger.error(
                                f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                            )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_peering_route_tables(self):
        logger.info("VPC - Describing Peering Route Tables...")
        try:
            for conn in self.vpc_peering_connections:
                regional_client = self.regional_clients[conn.region]
                for route_table in regional_client.describe_route_tables(
                    Filters=[
                        {
                            "Name": "route.vpc-peering-connection-id",
                            "Values": [
                                conn.id,
                            ],
                        },
                    ]
                )["RouteTables"]:
                    try:
                        destination_cidrs = []
                        for route in route_table["Routes"]:
                            if (
                                route["Origin"] != "CreateRouteTable"
                            ):  # avoid default route table
                                if (
                                    "DestinationCidrBlock" in route
                                    and "VpcPeeringConnectionId" in route
                                ):
                                    destination_cidrs.append(
                                        route["DestinationCidrBlock"]
                                    )
                        conn.route_tables.append(
                            Route(
                                id=route_table["RouteTableId"],
                                destination_cidrs=destination_cidrs,
                            )
                        )
                    except Exception as error:
                        logger.error(
                            f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                        )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}:{error.__traceback__.tb_lineno} -- {error}"
            )

    def _describe_flow_logs(self):
        logger.info("VPC - Describing flow logs...")
        try:
            for vpc in self.vpcs.values():
                try:
                    regional_client = self.regional_clients[vpc.region]
                    flow_logs = regional_client.describe_flow_logs(
                        Filters=[
                            {
                                "Name": "resource-id",
                                "Values": [
                                    vpc.id,
                                ],
                            },
                        ]
                    )["FlowLogs"]
                    if flow_logs:
                        vpc.flow_log = True
                except Exception as error:
                    logger.error(
                        f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}:{error.__traceback__.tb_lineno} -- {error}"
            )

    def _describe_network_interfaces(self):
        logger.info("VPC - Describing flow logs...")
        try:
            for vpc in self.vpcs.values():
                try:
                    regional_client = self.regional_clients[vpc.region]
                    enis = regional_client.describe_network_interfaces(
                        Filters=[
                            {
                                "Name": "vpc-id",
                                "Values": [
                                    vpc.id,
                                ],
                            },
                        ]
                    )["NetworkInterfaces"]
                    if enis:
                        vpc.in_use = True
                    for subnet in vpc.subnets:
                        enis = regional_client.describe_network_interfaces(
                            Filters=[
                                {
                                    "Name": "subnet-id",
                                    "Values": [
                                        subnet.id,
                                    ],
                                },
                            ]
                        )["NetworkInterfaces"]
                        if enis:
                            subnet.in_use = True
                except Exception as error:
                    logger.error(
                        f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}:{error.__traceback__.tb_lineno} -- {error}"
            )

    def _describe_vpc_endpoints(self, regional_client):
        logger.info("VPC - Describing VPC Endpoints...")
        try:
            describe_vpc_endpoints_paginator = regional_client.get_paginator(
                "describe_vpc_endpoints"
            )
            for page in describe_vpc_endpoints_paginator.paginate():
                for endpoint in page["VpcEndpoints"]:
                    try:
                        arn = f"arn:{self.audited_partition}:ec2:{regional_client.region}:{self.audited_account}:vpc-endpoint/{endpoint['VpcEndpointId']}"
                        if not self.audit_resources or (
                            is_resource_filtered(arn, self.audit_resources)
                        ):
                            endpoint_policy = None
                            if endpoint.get("PolicyDocument"):
                                endpoint_policy = json.loads(endpoint["PolicyDocument"])
                            self.vpc_endpoints.append(
                                VpcEndpoint(
                                    arn=arn,
                                    id=endpoint["VpcEndpointId"],
                                    vpc_id=endpoint["VpcId"],
                                    service_name=endpoint["ServiceName"],
                                    state=endpoint["State"],
                                    policy_document=endpoint_policy,
                                    subnet_ids=endpoint.get("SubnetIds", []),
                                    owner_id=endpoint["OwnerId"],
                                    type=endpoint["VpcEndpointType"],
                                    region=regional_client.region,
                                    tags=endpoint.get("Tags"),
                                )
                            )
                    except Exception as error:
                        logger.error(
                            f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                        )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_vpc_endpoint_services(self, regional_client):
        logger.info("VPC - Describing VPC Endpoint Services...")
        try:
            describe_vpc_endpoint_services_paginator = regional_client.get_paginator(
                "describe_vpc_endpoint_services"
            )
            for page in describe_vpc_endpoint_services_paginator.paginate():
                for endpoint in page["ServiceDetails"]:
                    try:
                        if endpoint["Owner"] != "amazon":
                            arn = f"arn:{self.audited_partition}:ec2:{regional_client.region}:{self.audited_account}:vpc-endpoint-service/{endpoint['ServiceId']}"
                            if not self.audit_resources or (
                                is_resource_filtered(arn, self.audit_resources)
                            ):
                                self.vpc_endpoint_services.append(
                                    VpcEndpointService(
                                        arn=arn,
                                        id=endpoint["ServiceId"],
                                        service=endpoint["ServiceName"],
                                        owner_id=endpoint["Owner"],
                                        region=regional_client.region,
                                        tags=endpoint.get("Tags", []),
                                    )
                                )
                    except Exception as error:
                        logger.error(
                            f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                        )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_vpc_endpoint_service_permissions(self):
        logger.info("VPC - Describing VPC Endpoint service permissions...")
        try:
            for service in self.vpc_endpoint_services:
                regional_client = self.regional_clients[service.region]
                try:
                    for (
                        principal
                    ) in regional_client.describe_vpc_endpoint_service_permissions(
                        ServiceId=service.id
                    )[
                        "AllowedPrincipals"
                    ]:
                        service.allowed_principals.append(principal["Principal"])
                except ClientError as error:
                    if (
                        error.response["Error"]["Code"]
                        == "InvalidVpcEndpointServiceId.NotFound"
                    ):
                        logger.warning(
                            f"{service.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                        )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}:{error.__traceback__.tb_lineno} -- {error}"
            )

    def _describe_vpc_subnets(self, regional_client):
        logger.info("VPC - Describing VPC subnets...")
        try:
            describe_subnets_paginator = regional_client.get_paginator(
                "describe_subnets"
            )
            for page in describe_subnets_paginator.paginate():
                for subnet in page["Subnets"]:
                    if not self.audit_resources or (
                        is_resource_filtered(subnet["SubnetArn"], self.audit_resources)
                    ):
                        try:
                            # Check the route table associated with the subnet to see if it's public
                            regional_client_for_subnet = self.regional_clients[
                                regional_client.region
                            ]
                            public = False
                            nat_gateway = False
                            route_tables_for_subnet = (
                                regional_client_for_subnet.describe_route_tables(
                                    Filters=[
                                        {
                                            "Name": "association.subnet-id",
                                            "Values": [subnet["SubnetId"]],
                                        }
                                    ]
                                )
                            )
                            if not route_tables_for_subnet.get("RouteTables"):
                                # If a subnet is not explicitly associated with any route table, it is implicitly associated with the main route table.
                                route_tables_for_subnet = (
                                    regional_client_for_subnet.describe_route_tables(
                                        Filters=[
                                            {
                                                "Name": "association.main",
                                                "Values": ["true"],
                                            }
                                        ]
                                    )
                                )
                            for route_table in route_tables_for_subnet.get(
                                "RouteTables"
                            ):
                                for route in route_table.get("Routes"):
                                    if (
                                        "GatewayId" in route
                                        and "igw" in route["GatewayId"]
                                        and route.get("DestinationCidrBlock", "")
                                        == "0.0.0.0/0"
                                    ):
                                        # If the route table has a default route to an internet gateway, the subnet is public
                                        public = True
                                    if "NatGatewayId" in route:
                                        nat_gateway = True
                            subnet_name = ""
                            for tag in subnet.get("Tags", []):
                                if tag["Key"] == "Name":
                                    subnet_name = tag["Value"]
                            # Add it to to list of vpc_subnets and to the VPC object
                            object = VpcSubnet(
                                arn=subnet["SubnetArn"],
                                id=subnet["SubnetId"],
                                name=subnet_name,
                                default=subnet["DefaultForAz"],
                                vpc_id=subnet["VpcId"],
                                cidr_block=subnet.get("CidrBlock"),
                                region=regional_client.region,
                                availability_zone=subnet["AvailabilityZone"],
                                public=public,
                                nat_gateway=nat_gateway,
                                tags=subnet.get("Tags"),
                                mapPublicIpOnLaunch=subnet["MapPublicIpOnLaunch"],
                            )
                            self.vpc_subnets[subnet["SubnetId"]] = object
                            # Add it to the VPC object
                            for vpc in self.vpcs.values():
                                if vpc.id == subnet["VpcId"]:
                                    vpc.subnets.append(object)
                        except Exception as error:
                            logger.error(
                                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                            )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_vpn_connections(self, regional_client):
        try:
            describe_vpn_connections = regional_client.describe_vpn_connections()

            for vpn_connection in describe_vpn_connections["VpnConnections"]:
                arn = f"arn:{self.audited_partition}:ec2:{regional_client.region}:{self.audited_account}:vpn-connection/{vpn_connection['VpnConnectionId']}"
                if not self.audit_resources or (
                    is_resource_filtered(arn, self.audit_resources)
                ):
                    tunnels = []
                    for tunnel in vpn_connection["VgwTelemetry"]:
                        tunnels.append(
                            VpnTunnel(
                                status=tunnel["Status"],
                                outside_ip_address=tunnel["OutsideIpAddress"],
                            )
                        )
                    self.vpn_connections[arn] = VpnConnection(
                        id=vpn_connection["VpnConnectionId"],
                        arn=arn,
                        tunnels=tunnels,
                        region=regional_client.region,
                        tags=vpn_connection.get("Tags"),
                    )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class VpcSubnet(BaseModel):
    arn: str
    id: str
    name: str
    default: bool
    vpc_id: str
    cidr_block: Optional[str]
    availability_zone: str
    public: bool
    in_use: bool = False
    nat_gateway: bool
    region: str
    mapPublicIpOnLaunch: bool
    tags: Optional[list] = []


class VPCs(BaseModel):
    arn: str
    id: str
    name: str
    default: bool
    in_use: bool = False
    cidr_block: str
    flow_log: bool = False
    region: str
    subnets: list[VpcSubnet] = []
    tags: Optional[list] = []


class Route(BaseModel):
    id: str
    destination_cidrs: list[str]


class VpcPeeringConnection(BaseModel):
    arn: str
    id: str
    accepter_vpc: str
    accepter_cidr: Optional[str]
    requester_vpc: str
    requester_cidr: Optional[str]
    route_tables: list[Route] = []
    region: str
    tags: Optional[list] = []


class VpcEndpoint(BaseModel):
    arn: str
    id: str
    vpc_id: str
    service_name: str
    state: str
    subnet_ids: Optional[list] = []
    policy_document: Optional[dict]
    owner_id: str
    type: str
    region: str
    tags: Optional[list] = []


class VpcEndpointService(BaseModel):
    arn: str
    id: str
    service: str
    owner_id: str
    allowed_principals: list = []
    region: str
    tags: Optional[list] = []


class VpnTunnel(BaseModel):
    status: str
    outside_ip_address: str


class VpnConnection(BaseModel):
    id: str
    arn: str
    tunnels: list[VpnTunnel]
    region: str
    tags: Optional[list] = []
```

--------------------------------------------------------------------------------

---[FILE: vpc_different_regions.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/vpc/vpc_different_regions/vpc_different_regions.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "vpc_different_regions",
  "CheckTitle": "Ensure there are VPCs in more than one region",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "vpc",
  "SubServiceName": "subnet",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "AwsEc2Vpc",
  "Description": "Ensure there are VPCs in more than one region",
  "Risk": "",
  "RelatedUrl": "https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html",
  "Remediation": {
    "Code": {
      "CLI": "aws ec2 create-vpc",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure there are VPCs in more than one region",
      "Url": "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-example-private-subnets-nat.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: vpc_different_regions.py]---
Location: prowler-master/prowler/providers/aws/services/vpc/vpc_different_regions/vpc_different_regions.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class vpc_different_regions(Check):
    def execute(self):
        findings = []
        if len(vpc_client.vpcs) > 0:
            vpc_regions = set()
            for vpc in vpc_client.vpcs.values():
                if not vpc.default:
                    vpc_regions.add(vpc.region)

            report = Check_Report_AWS(
                metadata=self.metadata(), resource=vpc_client.vpcs
            )
            report.region = vpc_client.region
            report.resource_id = vpc_client.audited_account
            report.resource_arn = vpc_client.vpc_arn_template

            report.status = "FAIL"
            report.status_extended = "VPCs found only in one region."

            if len(vpc_regions) > 1:
                report.status = "PASS"
                report.status_extended = "VPCs found in more than one region."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: vpc_endpoint_connections_trust_boundaries.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/vpc/vpc_endpoint_connections_trust_boundaries/vpc_endpoint_connections_trust_boundaries.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "vpc_endpoint_connections_trust_boundaries",
  "CheckTitle": "Find trust boundaries in VPC endpoint connections.",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "vpc",
  "SubServiceName": "endpoint",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "AwsEc2VpcEndpointService",
  "Description": "Find trust boundaries in VPC endpoint connections.",
  "Risk": "Account VPC could be linked to other accounts.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://docs.prowler.com/checks/aws/networking-policies/networking_9#aws-vpc-endpoints-are-exposed",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "In multi Account environments identify untrusted links. Check trust chaining and dependencies between accounts.",
      "Url": "https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-access.html"
    }
  },
  "Categories": [
    "trust-boundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: vpc_endpoint_connections_trust_boundaries.py]---
Location: prowler-master/prowler/providers/aws/services/vpc/vpc_endpoint_connections_trust_boundaries/vpc_endpoint_connections_trust_boundaries.py

```python
from re import compile

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.lib.policy import is_condition_block_restrictive
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class vpc_endpoint_connections_trust_boundaries(Check):
    def execute(self):
        findings = []
        # Get trusted account_ids from prowler.config.yaml
        trusted_account_ids = vpc_client.audit_config.get("trusted_account_ids", [])
        # Always include the same account as trusted
        trusted_account_ids.append(vpc_client.audited_account)
        for endpoint in vpc_client.vpc_endpoints:
            # Check VPC endpoint policy and  avoid "com.amazonaws.vpce" endpoints since the policy cannot be modified
            if (
                endpoint.policy_document
                and "com.amazonaws.vpce." not in endpoint.service_name
            ):
                access_from_trusted_accounts = True
                for statement in endpoint.policy_document["Statement"]:
                    # If one policy allows access from a non-trusted account
                    if not access_from_trusted_accounts:
                        break
                    if "*" == statement["Principal"]:
                        access_from_trusted_accounts = False
                        report = Check_Report_AWS(
                            metadata=self.metadata(), resource=endpoint
                        )

                        if "Condition" in statement:
                            for account_id in trusted_account_ids:
                                if is_condition_block_restrictive(
                                    statement["Condition"], account_id
                                ):
                                    access_from_trusted_accounts = True
                                else:
                                    access_from_trusted_accounts = False
                                    break

                        if not access_from_trusted_accounts:
                            report.status = "FAIL"
                            report.status_extended = f"VPC Endpoint {endpoint.id} in VPC {endpoint.vpc_id} can be accessed from non-trusted accounts."
                        else:
                            report.status = "PASS"
                            report.status_extended = f"VPC Endpoint {endpoint.id} in VPC {endpoint.vpc_id} can only be accessed from trusted accounts."

                        findings.append(report)
                        if not access_from_trusted_accounts:
                            break

                    else:
                        if "AWS" in statement["Principal"]:
                            if isinstance(statement["Principal"]["AWS"], str):
                                principals = [statement["Principal"]["AWS"]]
                            else:
                                principals = statement["Principal"]["AWS"]
                        else:
                            # If the principal is not an AWS principal, we don't need to check it since it could be a service or a federated principal
                            principals = []
                        for principal_arn in principals:
                            report = Check_Report_AWS(
                                metadata=self.metadata(), resource=endpoint
                            )

                            if principal_arn == "*":
                                access_from_trusted_accounts = False
                                if "Condition" in statement:
                                    for account_id in trusted_account_ids:
                                        if is_condition_block_restrictive(
                                            statement["Condition"], account_id
                                        ):
                                            access_from_trusted_accounts = True
                                        else:
                                            access_from_trusted_accounts = False
                                            break

                                if not access_from_trusted_accounts:
                                    report.status = "FAIL"
                                    report.status_extended = f"VPC Endpoint {endpoint.id} in VPC {endpoint.vpc_id} can be accessed from non-trusted accounts."
                                else:
                                    report.status = "PASS"
                                    report.status_extended = f"VPC Endpoint {endpoint.id} in VPC {endpoint.vpc_id} can only be accessed from trusted accounts."

                                findings.append(report)
                                if not access_from_trusted_accounts:
                                    break
                            else:
                                # Account ID can be an ARN or just a 12-digit string
                                pattern = compile(r"^[0-9]{12}$")
                                match = pattern.match(principal_arn)
                                if not match:
                                    account_id = principal_arn.split(":")[4]
                                else:
                                    account_id = match.string

                                if account_id not in trusted_account_ids:
                                    access_from_trusted_accounts = False

                                if "Condition" in statement:
                                    for account_id in trusted_account_ids:
                                        if is_condition_block_restrictive(
                                            statement["Condition"], account_id
                                        ):
                                            access_from_trusted_accounts = True
                                        else:
                                            access_from_trusted_accounts = False
                                            break

                                if not access_from_trusted_accounts:
                                    report.status = "FAIL"
                                    report.status_extended = f"VPC Endpoint {endpoint.id} in VPC {endpoint.vpc_id} can be accessed from non-trusted accounts."
                                else:
                                    report.status = "PASS"
                                    report.status_extended = f"VPC Endpoint {endpoint.id} in VPC {endpoint.vpc_id} can only be accessed from trusted accounts."

                                findings.append(report)
                                if not access_from_trusted_accounts:
                                    break

        return findings
```

--------------------------------------------------------------------------------

---[FILE: vpc_endpoint_for_ec2_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/vpc/vpc_endpoint_for_ec2_enabled/vpc_endpoint_for_ec2_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "vpc_endpoint_for_ec2_enabled",
  "CheckTitle": "Amazon EC2 should be configured to use VPC endpoints that are created for the Amazon EC2 service.",
  "CheckType": [],
  "ServiceName": "vpc",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "AwsEc2VpcEndpointService",
  "Description": "Ensure that a service endpoint for Amazon EC2 is created for each VPC. The check fails if a VPC does not have a VPC endpoint created for the Amazon EC2 service.",
  "Risk": "Without VPC endpoints, network traffic between your VPC and Amazon EC2 may traverse the public internet, increasing the risk of unintended access or data exposure.",
  "RelatedUrl": "https://docs.aws.amazon.com/config/latest/developerguide/service-vpc-endpoint-enabled.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/ec2-controls.html#ec2-10",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "To improve the security posture of your VPC, configure Amazon EC2 to use an interface VPC endpoint powered by AWS PrivateLink.",
      "Url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/interface-vpc-endpoints.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: vpc_endpoint_for_ec2_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/vpc/vpc_endpoint_for_ec2_enabled/vpc_endpoint_for_ec2_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class vpc_endpoint_for_ec2_enabled(Check):
    def execute(self):
        findings = []
        for vpc_id, vpc in vpc_client.vpcs.items():
            if vpc_client.provider.scan_unused_services or vpc.in_use:
                report = Check_Report_AWS(metadata=self.metadata(), resource=vpc)
                report.status = "FAIL"
                report.status_extended = f"VPC {vpc.id} has no EC2 endpoint."
                for endpoint in vpc_client.vpc_endpoints:
                    if endpoint.vpc_id == vpc_id and "ec2" in endpoint.service_name:
                        report.status = "PASS"
                        report.status_extended = (
                            f"VPC {vpc.id} has an EC2 {endpoint.type} endpoint."
                        )
                        break

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: vpc_endpoint_multi_az_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/vpc/vpc_endpoint_multi_az_enabled/vpc_endpoint_multi_az_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "vpc_endpoint_multi_az_enabled",
  "CheckTitle": "Amazon VPC Interface Endpoints should have ENIs in more than one subnet.",
  "CheckType": [],
  "ServiceName": "vpc",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "AwsVpcEndpointService",
  "Description": "Ensure that all vpc interface endpoints have ENIs in multiple subnets. If a VPC endpoint has an ENI in only a single subnet then this check will fail. You cannot create VPC Endpoints in 2 different subnets in the same AZ. So, for the purpose of VPC endpoints, having multiple subnets implies multiple AZs.",
  "Risk": "Without VPC endpoints ENIs in multiple subnets an AZ impacting event could lead to increased downtime or your network traffic between your VPC and Amazon services may traverse the public internet.",
  "RelatedUrl": "https://docs.aws.amazon.com/vpc/latest/privatelink/interface-endpoints.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "To improve the availability of your services residing in your VPC, configure multiple subnets for VPC Interface Endpoints.",
      "Url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/interface-vpc-endpoints.html"
    }
  },
  "Categories": [
    "redundancy"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: vpc_endpoint_multi_az_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/vpc/vpc_endpoint_multi_az_enabled/vpc_endpoint_multi_az_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class vpc_endpoint_multi_az_enabled(Check):
    def execute(self):
        findings = []
        for endpoint in vpc_client.vpc_endpoints:
            if endpoint.vpc_id in vpc_client.vpcs and endpoint.type == "Interface":
                report = Check_Report_AWS(metadata=self.metadata(), resource=endpoint)
                report.status = "FAIL"
                report.status_extended = f"VPC Endpoint {endpoint.id} in VPC {endpoint.vpc_id} does not have subnets in different AZs."
                if len(endpoint.subnet_ids) > 1:
                    report.status = "PASS"
                    report.status_extended = f"VPC Endpoint {endpoint.id} in VPC {endpoint.vpc_id} has subnets in different AZs."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
