---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 327
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 327 of 867)

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

---[FILE: workspaces_vpc_2private_1public_subnets_nat.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/workspaces/workspaces_vpc_2private_1public_subnets_nat/workspaces_vpc_2private_1public_subnets_nat.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "workspaces_vpc_2private_1public_subnets_nat",
  "CheckTitle": "Ensure that the Workspaces VPC are deployed following the best practices using 1 public subnet and 2 private subnets with a NAT Gateway attached",
  "CheckType": [],
  "ServiceName": "workspaces",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:workspaces:region:account-id:workspace",
  "Severity": "medium",
  "ResourceType": "AwsWorkSpacesWorkspace",
  "Description": "Ensure that the Workspaces VPC are deployed following the best practices using 1 public subnet and 2 private subnets with a NAT Gateway attached",
  "Risk": "Proper network segmentation is a key security best practice. Workspaces VPC should be deployed using 1 public subnet and 2 private subnets with a NAT Gateway attached",
  "RelatedUrl": "https://docs.aws.amazon.com/workspaces/latest/adminguide/amazon-workspaces-vpc.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Follow the documentation and deploy Workspaces VPC using 1 public subnet and 2 private subnets with a NAT Gateway attached",
      "Url": "https://docs.aws.amazon.com/workspaces/latest/adminguide/amazon-workspaces-vpc.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: workspaces_vpc_2private_1public_subnets_nat.py]---
Location: prowler-master/prowler/providers/aws/services/workspaces/workspaces_vpc_2private_1public_subnets_nat/workspaces_vpc_2private_1public_subnets_nat.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.vpc.vpc_client import vpc_client
from prowler.providers.aws.services.workspaces.workspaces_client import (
    workspaces_client,
)


class workspaces_vpc_2private_1public_subnets_nat(Check):
    def execute(self):
        findings = []
        for workspace in workspaces_client.workspaces:
            report = Check_Report_AWS(metadata=self.metadata(), resource=workspace)
            report.status = "PASS"
            report.status_extended = f"Workspace {workspace.id} is in a private subnet within a VPC which has 1 public subnet 2 private subnets with a NAT Gateway attached."
            vpc_object = None
            is_in_private_subnet = False
            if workspace.subnet_id:
                if vpc_client.vpcs[vpc_client.vpc_subnets[workspace.subnet_id].vpc_id]:
                    vpc_object = vpc_client.vpcs[
                        vpc_client.vpc_subnets[workspace.subnet_id].vpc_id
                    ]
                if vpc_client.vpc_subnets[workspace.subnet_id]:
                    if not vpc_client.vpc_subnets[workspace.subnet_id].public:
                        is_in_private_subnet = True
            public_subnets = 0
            private_subnets = 0
            nat_gateway = False
            if vpc_object:
                for vpc_subnet in vpc_object.subnets:
                    if vpc_subnet.public:
                        public_subnets += 1
                    if not vpc_subnet.public:
                        private_subnets += 1
                        if vpc_subnet.nat_gateway:
                            nat_gateway = True
                        # Check NAT Gateway here
            if (
                public_subnets < 1
                or private_subnets < 2
                or not nat_gateway
                or not is_in_private_subnet
            ):
                report.status = "FAIL"
                report.status_extended = f"Workspace {workspace.id} is not in a private subnet or its VPC does not have 1 public subnet and 2 private subnets with a NAT Gateway attached."

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

````
