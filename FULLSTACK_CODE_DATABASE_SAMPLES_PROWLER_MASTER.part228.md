---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 228
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 228 of 867)

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

---[FILE: vpc_flow_logs_enabled.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/vpc/vpc_flow_logs_enabled/vpc_flow_logs_enabled.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "vpc_flow_logs_enabled",
  "CheckTitle": "VPC flow logging is enabled in all VPCs",
  "CheckType": [
    "Suspicious network connection",
    "Cloud threat detection"
  ],
  "ServiceName": "vpc",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:vpc:region:account-id:vpc/{vpc-id}",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudVPC",
  "Description": "You can use the **flow log function** to monitor the IP traffic information for an ENI, a VSwitch, or a VPC.\n\nIf you create a flow log for a VSwitch or a VPC, all the **Elastic Network Interfaces**, including the newly created ones, are monitored. Such flow log data is stored in **Log Service**, where you can view and analyze IP traffic information. It is recommended that VPC Flow Logs be enabled for packet \"Rejects\" for VPCs.",
  "Risk": "**VPC Flow Logs** provide visibility into network traffic that traverses the VPC and can be used to detect **anomalous traffic** or provide insight during security workflows.\n\nWithout flow logs, it is difficult to investigate network-based security incidents.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/doc-detail/90628.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-VPC/enable-flow-logs.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aliyun vpc CreateFlowLog --ResourceId <vpc_id> --ResourceType VPC --FlowLogName <flow_log_name> --LogStoreName <log_store_name> --ProjectName <project_name>",
      "NativeIaC": "",
      "Other": "",
      "Terraform": "resource \"alicloud_vpc_flow_log\" \"example\" {\n  flow_log_name  = \"example-flow-log\"\n  resource_type  = \"VPC\"\n  resource_id    = alicloud_vpc.example.id\n  traffic_type   = \"All\"\n  project_name   = alicloud_log_project.example.project_name\n  log_store_name = alicloud_log_store.example.logstore_name\n}"
    },
    "Recommendation": {
      "Text": "1. Log on to the **VPC Console**\n2. In the left-side navigation pane, click **FlowLog**\n3. Follow the instructions to create FlowLog for each of your VPCs",
      "Url": "https://hub.prowler.com/check/vpc_flow_logs_enabled"
    }
  },
  "Categories": [
    "logging"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: vpc_flow_logs_enabled.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/vpc/vpc_flow_logs_enabled/vpc_flow_logs_enabled.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.vpc.vpc_client import vpc_client


class vpc_flow_logs_enabled(Check):
    """Check if VPC flow logging is enabled in all VPCs."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        for vpc in vpc_client.vpcs.values():
            report = CheckReportAlibabaCloud(metadata=self.metadata(), resource=vpc)
            report.region = vpc.region
            report.resource_id = vpc.id
            report.resource_arn = (
                f"acs:vpc:{vpc.region}:{vpc_client.audited_account}:vpc/{vpc.id}"
            )

            if vpc.flow_log_enabled:
                report.status = "PASS"
                report.status_extended = (
                    f"VPC {vpc.name if vpc.name else vpc.id} has flow logs enabled."
                )
            else:
                report.status = "FAIL"
                report.status_extended = f"VPC {vpc.name if vpc.name else vpc.id} does not have flow logs enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
