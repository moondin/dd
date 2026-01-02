---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 251
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 251 of 867)

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

---[FILE: cloudtrail_threat_detection_privilege_escalation.py]---
Location: prowler-master/prowler/providers/aws/services/cloudtrail/cloudtrail_threat_detection_privilege_escalation/cloudtrail_threat_detection_privilege_escalation.py

```python
import json

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudtrail.cloudtrail_client import (
    cloudtrail_client,
)

default_threat_detection_privilege_escalation_actions = [
    "AddPermission",
    "AddRoleToInstanceProfile",
    "AddUserToGroup",
    "AssociateAccessPolicy",
    "AssumeRole",
    "AttachGroupPolicy",
    "AttachRolePolicy",
    "AttachUserPolicy",
    "ChangePassword",
    "CreateAccessEntry",
    "CreateAccessKey",
    "CreateDevEndpoint",
    "CreateEventSourceMapping",
    "CreateFunction",
    "CreateGroup",
    "CreateJob",
    "CreateKeyPair",
    "CreateLoginProfile",
    "CreatePipeline",
    "CreatePolicyVersion",
    "CreateRole",
    "CreateStack",
    "DeleteRolePermissionsBoundary",
    "DeleteRolePolicy",
    "DeleteUserPermissionsBoundary",
    "DeleteUserPolicy",
    "DetachRolePolicy",
    "DetachUserPolicy",
    "GetCredentialsForIdentity",
    "GetId",
    "GetPolicyVersion",
    "GetUserPolicy",
    "Invoke",
    "ModifyInstanceAttribute",
    "PassRole",
    "PutGroupPolicy",
    "PutPipelineDefinition",
    "PutRolePermissionsBoundary",
    "PutRolePolicy",
    "PutUserPermissionsBoundary",
    "PutUserPolicy",
    "ReplaceIamInstanceProfileAssociation",
    "RunInstances",
    "SetDefaultPolicyVersion",
    "UpdateAccessKey",
    "UpdateAssumeRolePolicy",
    "UpdateDevEndpoint",
    "UpdateEventSourceMapping",
    "UpdateFunctionCode",
    "UpdateJob",
    "UpdateLoginProfile",
]


class cloudtrail_threat_detection_privilege_escalation(Check):
    def execute(self):
        findings = []
        threshold = cloudtrail_client.audit_config.get(
            "threat_detection_privilege_escalation_threshold", 0.2
        )
        threat_detection_minutes = cloudtrail_client.audit_config.get(
            "threat_detection_privilege_escalation_minutes", 1440
        )
        privilege_escalation_actions = cloudtrail_client.audit_config.get(
            "threat_detection_privilege_escalation_actions",
            default_threat_detection_privilege_escalation_actions,
        )

        potential_privilege_escalation = {}
        found_potential_privilege_escalation = False
        multiregion_trail = None
        # Check if any trail is multi-region so we only need to check once
        for trail in cloudtrail_client.trails.values():
            if trail.is_multiregion:
                multiregion_trail = trail
                break
        trails_to_scan = (
            cloudtrail_client.trails.values()
            if not multiregion_trail
            else [multiregion_trail]
        )
        for trail in trails_to_scan:
            for event_name in privilege_escalation_actions:
                for event_log in cloudtrail_client._lookup_events(
                    trail=trail,
                    event_name=event_name,
                    minutes=threat_detection_minutes,
                ):
                    event_log = json.loads(event_log["CloudTrailEvent"])
                    if (
                        "arn" in event_log["userIdentity"]
                    ):  # Ignore event logs without ARN since they are AWS services
                        if (
                            event_log["userIdentity"]["arn"],
                            event_log["userIdentity"]["type"],
                        ) not in potential_privilege_escalation:
                            potential_privilege_escalation[
                                (
                                    event_log["userIdentity"]["arn"],
                                    event_log["userIdentity"]["type"],
                                )
                            ] = set()
                        potential_privilege_escalation[
                            (
                                event_log["userIdentity"]["arn"],
                                event_log["userIdentity"]["type"],
                            )
                        ].add(event_name)
        for aws_identity, actions in potential_privilege_escalation.items():
            identity_threshold = round(
                len(actions) / len(privilege_escalation_actions), 2
            )
            aws_identity_type = aws_identity[1]
            aws_identity_arn = aws_identity[0]
            if len(actions) / len(privilege_escalation_actions) > threshold:
                found_potential_privilege_escalation = True
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=cloudtrail_client.trails
                )
                report.region = cloudtrail_client.region
                report.resource_id = aws_identity_arn.split("/")[-1]
                report.resource_arn = aws_identity_arn
                report.status = "FAIL"
                report.status_extended = f"Potential privilege escalation attack detected from AWS {aws_identity_type} {aws_identity_arn.split('/')[-1]} with a threshold of {identity_threshold}."
                findings.append(report)
        if not found_potential_privilege_escalation:
            report = Check_Report_AWS(
                metadata=self.metadata(), resource=cloudtrail_client.trails
            )
            report.region = cloudtrail_client.region
            report.resource_id = cloudtrail_client.audited_account
            report.resource_arn = cloudtrail_client._get_trail_arn_template(
                cloudtrail_client.region
            )
            report.status = "PASS"
            report.status_extended = (
                "No potential privilege escalation attack detected."
            )
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudtrail_threat_detection_privilege_escalation_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/cloudtrail/cloudtrail_threat_detection_privilege_escalation/cloudtrail_threat_detection_privilege_escalation_fixer.py

```python
import json

from prowler.lib.logger import logger
from prowler.providers.aws.services.iam.iam_client import iam_client


def fixer(resource_arn: str) -> bool:
    """
    Restricts access to a compromised AWS entity by attaching a deny-all inline policy to the user or role.

    Requires the following permissions:
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": [
                    "iam:PutUserPolicy",
                    "iam:PutRolePolicy",
                ],
                "Resource": "*"
            }
        ]
    }

    Args:
        resource_arn (str): The ARN of the compromised AWS entity (IAM User or Role).

    Returns:
        bool: True if the fix was applied successfully, False otherwise.
    """
    try:
        if ":user/" in resource_arn:
            entity_type = "user"
            entity_name = resource_arn.split("/")[-1]
        elif ":role/" in resource_arn:
            entity_type = "role"
            entity_name = resource_arn.split("/")[-1]
        else:
            return False

        deny_policy = {
            "Version": "2012-10-17",
            "Statement": [{"Effect": "Deny", "Action": "*", "Resource": "*"}],
        }

        policy_name = "DenyAllAccess"

        if entity_type == "user":
            iam_client.client.put_user_policy(
                UserName=entity_name,
                PolicyName=policy_name,
                PolicyDocument=json.dumps(deny_policy),
            )
            logger.info(f"Applied Deny policy to user {entity_name}")

        elif entity_type == "role":
            iam_client.client.put_role_policy(
                RoleName=entity_name,
                PolicyName=policy_name,
                PolicyDocument=json.dumps(deny_policy),
            )
            logger.info(f"Applied Deny policy to role {entity_name}")

        return True

    except Exception as error:
        logger.error(
            f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
        )
        return False
```

--------------------------------------------------------------------------------

---[FILE: cloudwatch_client.py]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_client.py

```python
from prowler.providers.aws.services.cloudwatch.cloudwatch_service import CloudWatch
from prowler.providers.common.provider import Provider

cloudwatch_client = CloudWatch(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: cloudwatch_service.py]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_service.py
Signals: Pydantic

```python
import json
from datetime import datetime, timezone
from typing import Optional

from botocore.exceptions import ClientError
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class CloudWatch(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.metric_alarms = []
        self.__threading_call__(self._describe_alarms)
        if self.metric_alarms:
            self._list_tags_for_resource()

    def _describe_alarms(self, regional_client):
        logger.info("CloudWatch - Describing alarms...")
        try:
            describe_alarms_paginator = regional_client.get_paginator("describe_alarms")
            for page in describe_alarms_paginator.paginate():
                for alarm in page["MetricAlarms"]:
                    if not self.audit_resources or (
                        is_resource_filtered(alarm["AlarmArn"], self.audit_resources)
                    ):
                        metric_name = None
                        if "MetricName" in alarm:
                            metric_name = alarm["MetricName"]
                        namespace = None
                        if "Namespace" in alarm:
                            namespace = alarm["Namespace"]
                        if self.metric_alarms is None:
                            self.metric_alarms = []
                        self.metric_alarms.append(
                            MetricAlarm(
                                arn=alarm["AlarmArn"],
                                name=alarm["AlarmName"],
                                metric=metric_name,
                                name_space=namespace,
                                region=regional_client.region,
                                alarm_actions=alarm.get("AlarmActions", []),
                                actions_enabled=alarm.get("ActionsEnabled", False),
                            )
                        )
        except ClientError as error:
            if error.response["Error"]["Code"] == "AccessDenied":
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
                if not self.metric_alarms:
                    self.metric_alarms = None
            else:
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_tags_for_resource(self):
        logger.info("CloudWatch - List Tags...")
        try:
            for metric_alarm in self.metric_alarms:
                regional_client = self.regional_clients[metric_alarm.region]
                response = regional_client.list_tags_for_resource(
                    ResourceARN=metric_alarm.arn
                )["Tags"]
                metric_alarm.tags = response
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class Logs(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.log_group_arn_template = f"arn:{self.audited_partition}:logs:{self.region}:{self.audited_account}:log-group"
        self.log_groups = {}
        self.__threading_call__(self._describe_log_groups)
        self.resource_policies = {}
        self.__threading_call__(self._describe_resource_policies)
        self.metric_filters = []
        self.__threading_call__(self._describe_metric_filters)
        if self.log_groups:
            if (
                "cloudwatch_log_group_no_secrets_in_logs"
                in provider.audit_metadata.expected_checks
            ):
                self.events_per_log_group_threshold = (
                    1000  # The threshold for number of events to return per log group.
                )
                self.__threading_call__(self._get_log_events)
            self.__threading_call__(
                self._list_tags_for_resource, self.log_groups.values()
            )

    def _describe_metric_filters(self, regional_client):
        logger.info("CloudWatch Logs - Describing metric filters...")
        try:
            describe_metric_filters_paginator = regional_client.get_paginator(
                "describe_metric_filters"
            )
            for page in describe_metric_filters_paginator.paginate():
                for filter in page["metricFilters"]:
                    arn = f"arn:{self.audited_partition}:logs:{regional_client.region}:{self.audited_account}:metric-filter/{filter['filterName']}"
                    if not self.audit_resources or (
                        is_resource_filtered(arn, self.audit_resources)
                    ):
                        if self.metric_filters is None:
                            self.metric_filters = []

                        log_group = None
                        for lg in self.log_groups.values():
                            if lg.name == filter["logGroupName"]:
                                log_group = lg
                                break

                        self.metric_filters.append(
                            MetricFilter(
                                arn=arn,
                                name=filter["filterName"],
                                metric=filter["metricTransformations"][0]["metricName"],
                                pattern=filter.get("filterPattern", ""),
                                log_group=log_group,
                                region=regional_client.region,
                            )
                        )
        except ClientError as error:
            if error.response["Error"]["Code"] == "AccessDeniedException":
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
                if not self.metric_filters:
                    self.metric_filters = None
            else:
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_log_groups(self, regional_client):
        logger.info("CloudWatch Logs - Describing log groups...")
        try:
            describe_log_groups_paginator = regional_client.get_paginator(
                "describe_log_groups"
            )
            for page in describe_log_groups_paginator.paginate():
                for log_group in page["logGroups"]:
                    if not self.audit_resources or (
                        is_resource_filtered(log_group["arn"], self.audit_resources)
                    ):
                        never_expire = False
                        kms = log_group.get("kmsKeyId")
                        retention_days = log_group.get("retentionInDays")
                        if not retention_days:
                            never_expire = True
                            retention_days = 9999
                        if self.log_groups is None:
                            self.log_groups = {}
                        self.log_groups[log_group["arn"]] = LogGroup(
                            arn=log_group["arn"],
                            name=log_group["logGroupName"],
                            retention_days=retention_days,
                            never_expire=never_expire,
                            kms_id=kms,
                            region=regional_client.region,
                        )
        except ClientError as error:
            if error.response["Error"]["Code"] == "AccessDeniedException":
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
                if not self.log_groups:
                    self.log_groups = None
            else:
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_log_events(self, regional_client):
        regional_log_groups = [
            log_group
            for log_group in self.log_groups.values()
            if log_group.region == regional_client.region
        ]
        total_log_groups = len(regional_log_groups)
        logger.info(
            f"CloudWatch Logs - Retrieving log events for {total_log_groups} log groups in {regional_client.region}..."
        )
        try:
            for count, log_group in enumerate(regional_log_groups, start=1):
                events = regional_client.filter_log_events(
                    logGroupName=log_group.name,
                    limit=self.events_per_log_group_threshold,
                )["events"]
                for event in events:
                    if event["logStreamName"] not in log_group.log_streams:
                        log_group.log_streams[event["logStreamName"]] = []
                    log_group.log_streams[event["logStreamName"]].append(event)
                if count % 10 == 0:
                    logger.info(
                        f"CloudWatch Logs - Retrieved log events for {count}/{total_log_groups} log groups in {regional_client.region}..."
                    )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        logger.info(
            f"CloudWatch Logs - Finished retrieving log events in {regional_client.region}..."
        )

    def _describe_resource_policies(self, regional_client):
        logger.info("CloudWatch Logs - Describing resource policies...")
        try:
            describe_resource_policies_paginator = regional_client.get_paginator(
                "describe_resource_policies"
            )
            if regional_client.region not in self.resource_policies:
                self.resource_policies[regional_client.region] = []
            for page in describe_resource_policies_paginator.paginate():
                for policy in page["resourcePolicies"]:
                    self.resource_policies[regional_client.region].append(
                        ResourcePolicy(
                            name=policy["policyName"],
                            policy=json.loads(policy["policyDocument"]),
                            region=regional_client.region,
                        )
                    )
        except ClientError as error:
            if error.response["Error"]["Code"] == "AccessDeniedException":
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
                self.resource_policies[regional_client.region] = None
            else:
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_tags_for_resource(self, log_group):
        logger.info(f"CloudWatch Logs - List Tags for Log Group {log_group.name}...")
        try:
            regional_client = self.regional_clients[log_group.region]
            response = regional_client.list_tags_for_resource(
                resourceArn=log_group.arn
            )["tags"]
            log_group.tags = [response]
        except ClientError as error:
            if error.response["Error"]["Code"] == "ResourceNotFoundException":
                logger.warning(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class MetricAlarm(BaseModel):
    arn: str
    name: str
    metric: Optional[str] = None
    name_space: Optional[str] = None
    region: str
    tags: Optional[list] = []
    alarm_actions: list
    actions_enabled: bool


class LogGroup(BaseModel):
    arn: str
    name: str
    retention_days: int
    never_expire: bool
    kms_id: Optional[str]
    region: str
    log_streams: dict[str, list[str]] = (
        {}
    )  # Log stream name as the key, array of events as the value
    tags: Optional[list] = []


class ResourcePolicy(BaseModel):
    name: str
    policy: dict
    region: str


class MetricFilter(BaseModel):
    arn: str
    name: str
    metric: str
    pattern: str
    log_group: Optional[LogGroup] = None
    region: str


def convert_to_cloudwatch_timestamp_format(epoch_time):
    date_time = datetime.fromtimestamp(
        epoch_time / 1000, datetime.now(timezone.utc).astimezone().tzinfo
    )
    datetime_str = date_time.strftime(
        "%Y-%m-%dT%H:%M:%S.!%f!%z"
    )  # use exclamation marks as placeholders to convert datetime str to cloudwatch timestamp str
    datetime_parts = datetime_str.split("!")
    return (
        datetime_parts[0]
        + datetime_parts[1][:-3]
        + datetime_parts[2][:-2]
        + ":"
        + datetime_parts[2][-2:]
    )  # Removes the microseconds, and places a ':' character in the timezone offset
```

--------------------------------------------------------------------------------

---[FILE: logs_client.py]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/logs_client.py

```python
from prowler.providers.aws.services.cloudwatch.cloudwatch_service import Logs
from prowler.providers.common.provider import Provider

logs_client = Logs(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: cloudwatch_alarm_actions_alarm_state_configured.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_alarm_actions_alarm_state_configured/cloudwatch_alarm_actions_alarm_state_configured.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudwatch_alarm_actions_alarm_state_configured",
  "CheckTitle": "CloudWatch metric alarm has actions configured for the ALARM state",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "cloudwatch",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsCloudWatchAlarm",
  "Description": "Amazon CloudWatch metric alarms are evaluated for **actions** configured for the `ALARM` state. The finding flags alarms that have no action to execute when their monitored metric crosses its threshold.",
  "Risk": "Without an **ALARM action**, threshold breaches trigger no **notification** or **automated response**. This delays detection and containment, risking:\n- Availability: prolonged outages or missed scale-out\n- Integrity/confidentiality: unchecked anomalies enabling tampering or data loss",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html#alarms-and-actions",
    "https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/cloudwatch/client/put_metric_alarm.html",
    "https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_metric_alarm",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/cloudwatch-controls.html#cloudwatch-15",
    "https://support.icompaas.com/support/solutions/articles/62000233431-ensure-cloudwatch-alarms-have-specified-actions-configured-for-the-alarm-state",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/CloudWatch/cloudwatch-alarm-action.html",
    "https://awscli.amazonaws.com/v2/documentation/api/2.0.34/reference/cloudwatch/put-metric-alarm.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws cloudwatch put-metric-alarm --alarm-name <alarm-name> --metric-name <metric-name> --namespace <namespace> --statistic <statistic> --period <period-seconds> --evaluation-periods <evaluation-periods> --threshold <threshold> --comparison-operator <comparison-operator> --alarm-actions <action-arn>",
      "NativeIaC": "```yaml\n# CloudFormation: add an ALARM action to a metric alarm\nResources:\n  <example_resource_name>:\n    Type: AWS::CloudWatch::Alarm\n    Properties:\n      AlarmName: <example_resource_name>\n      MetricName: <metric-name>\n      Namespace: <namespace>\n      Statistic: Average\n      Period: 60\n      EvaluationPeriods: 1\n      Threshold: 1\n      ComparisonOperator: GreaterThanThreshold\n      AlarmActions:\n        - <action-arn>  # CRITICAL: adds an action for ALARM state so the check passes\n```",
      "Other": "1. Open the AWS Console and go to CloudWatch > Alarms\n2. Select the target alarm and choose Edit (or Modify alarm)\n3. In Actions, under When alarm state is ALARM, add an action (e.g., select an SNS topic or other supported action)\n4. Click Save changes",
      "Terraform": "```hcl\n# Terraform: add an ALARM action to a metric alarm\nresource \"aws_cloudwatch_metric_alarm\" \"<example_resource_name>\" {\n  alarm_name          = \"<example_resource_name>\"\n  metric_name         = \"<metric-name>\"\n  namespace           = \"<namespace>\"\n  statistic           = \"Average\"\n  period              = 60\n  evaluation_periods  = 1\n  threshold           = 1\n  comparison_operator = \"GreaterThanThreshold\"\n  alarm_actions       = [\"<action-arn>\"] # CRITICAL: ensures an action is configured for ALARM state\n}\n```"
    },
    "Recommendation": {
      "Text": "Assign at least one **ALARM-state action** per alarm (e.g., notify via SNS or run automated remediation with Lambda/SSM). Keep actions enabled, apply **least privilege** to targets, and regularly test. *For critical metrics*, add redundant paths (EventBridge) for **defense in depth**.",
      "Url": "https://hub.prowler.com/check/cloudwatch_alarm_actions_alarm_state_configured"
    }
  },
  "Categories": [
    "resilience"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cloudwatch_alarm_actions_alarm_state_configured.py]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_alarm_actions_alarm_state_configured/cloudwatch_alarm_actions_alarm_state_configured.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudwatch.cloudwatch_client import (
    cloudwatch_client,
)


class cloudwatch_alarm_actions_alarm_state_configured(Check):
    def execute(self):
        findings = []
        if cloudwatch_client.metric_alarms is not None:
            for metric_alarm in cloudwatch_client.metric_alarms:
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=metric_alarm
                )
                report.status = "PASS"
                report.status_extended = f"CloudWatch metric alarm {metric_alarm.name} has actions configured for the ALARM state."
                if not metric_alarm.alarm_actions:
                    report.status = "FAIL"
                    report.status_extended = f"CloudWatch metric alarm {metric_alarm.name} does not have actions configured for the ALARM state."
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudwatch_alarm_actions_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_alarm_actions_enabled/cloudwatch_alarm_actions_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudwatch_alarm_actions_enabled",
  "CheckTitle": "CloudWatch metric alarm has actions enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "TTPs/Defense Evasion"
  ],
  "ServiceName": "cloudwatch",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsCloudWatchAlarm",
  "Description": "**CloudWatch metric alarms** are evaluated for **alarm actions** activation (`actions_enabled: true`), enabling state changes to invoke configured notifications or automated responses.",
  "Risk": "With alarm actions disabled, state changes neither notify nor remediate. Incidents can persist unnoticed, enabling unauthorized activity, configuration drift, or capacity exhaustion. Visibility drops, MTTR rises, and confidentiality, integrity, and availability are all at greater risk.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/CloudWatch/cloudwatch-alarm-action-activated.html",
    "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html#alarms-and-actions",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/cloudwatch-controls.html#cloudwatch-17"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws cloudwatch enable-alarm-actions --alarm-names <alarm-name>",
      "NativeIaC": "```yaml\nResources:\n  <example_resource_name>:\n    Type: AWS::CloudWatch::Alarm\n    Properties:\n      ActionsEnabled: true  # FIX: activates alarm actions so the check passes\n      ComparisonOperator: GreaterThanThreshold\n      EvaluationPeriods: 1\n      MetricName: <example_metric_name>\n      Namespace: <example_metric_namespace>\n      Period: 60\n      Statistic: Average\n      Threshold: 1\n```",
      "Other": "1. Open the CloudWatch console\n2. Go to Alarms > All alarms and select the alarm\n3. Choose Actions > Alarm actions - new > Enable\n4. Confirm to activate actions",
      "Terraform": "```hcl\nresource \"aws_cloudwatch_metric_alarm\" \"<example_resource_name>\" {\n  alarm_name          = \"<example_resource_name>\"\n  comparison_operator = \"GreaterThanThreshold\"\n  evaluation_periods  = 1\n  metric_name         = \"<example_metric_name>\"\n  namespace           = \"<example_metric_namespace>\"\n  period              = 60\n  statistic           = \"Average\"\n  threshold           = 1\n\n  actions_enabled = true  # FIX: activates alarm actions so the check passes\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable `actions_enabled` on critical alarms and attach least-privilege actions (SNS, automation) for ALARM and recovery states. Use redundant targets, regularly test notifications, and integrate with incident response. Apply **defense in depth** with complementary detections to ensure timely, reliable alerting.",
      "Url": "https://hub.prowler.com/check/cloudwatch_alarm_actions_enabled"
    }
  },
  "Categories": [
    "resilience"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cloudwatch_alarm_actions_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_alarm_actions_enabled/cloudwatch_alarm_actions_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudwatch.cloudwatch_client import (
    cloudwatch_client,
)


class cloudwatch_alarm_actions_enabled(Check):
    def execute(self):
        findings = []
        if cloudwatch_client.metric_alarms is not None:
            for metric_alarm in cloudwatch_client.metric_alarms:
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=metric_alarm
                )
                report.status = "PASS"
                report.status_extended = (
                    f"CloudWatch metric alarm {metric_alarm.name} has actions enabled."
                )
                if not metric_alarm.actions_enabled:
                    report.status = "FAIL"
                    report.status_extended = f"CloudWatch metric alarm {metric_alarm.name} does not have actions enabled."
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudwatch_changes_to_network_acls_alarm_configured.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudwatch/cloudwatch_changes_to_network_acls_alarm_configured/cloudwatch_changes_to_network_acls_alarm_configured.metadata.json
Signals: Next.js

```json
{
  "Provider": "aws",
  "CheckID": "cloudwatch_changes_to_network_acls_alarm_configured",
  "CheckTitle": "CloudWatch log metric filter and alarm exist for Network ACL (NACL) change events",
  "CheckType": [
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark",
    "Software and Configuration Checks/AWS Security Best Practices/Runtime Behavior Analysis"
  ],
  "ServiceName": "cloudwatch",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsCloudWatchAlarm",
  "Description": "CloudTrail records for **Network ACL changes** are matched by a CloudWatch Logs metric filter with an associated alarm for events like `CreateNetworkAcl`, `CreateNetworkAclEntry`, `DeleteNetworkAcl`, `DeleteNetworkAclEntry`, `ReplaceNetworkAclEntry`, and `ReplaceNetworkAclAssociation`.",
  "Risk": "Absent monitoring of **NACL changes** reduces detection of policy tampering, risking loss of **confidentiality** (opened ingress/egress), degraded network **integrity** (lateral movement, bypassed segmentation), and reduced **availability** (traffic blackholes or lockouts).",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudwatch-alarms-for-cloudtrail.html",
    "https://www.clouddefense.ai/compliance-rules/cis-v130/monitoring/cis-v130-4-11",
    "https://support.icompaas.com/support/solutions/articles/62000084031-ensure-a-log-metric-filter-and-alarm-exist-for-changes-to-network-access-control-lists-nacl-",
    "https://trendmicro.com/cloudoneconformity/knowledge-base/aws/CloudWatchLogs/network-acl-changes-alarm.html",
    "https://support.icompaas.com/support/solutions/articles/62000233134-4-11-ensure-network-access-control-list-nacl-changes-are-monitored-manual-"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation to alert on NACL changes\nResources:\n  MetricFilter:\n    Type: AWS::Logs::MetricFilter\n    Properties:\n      LogGroupName: \"<example_resource_name>\"  # CRITICAL: CloudTrail log group to monitor\n      FilterPattern: '{ ($.eventName = CreateNetworkAcl) || ($.eventName = CreateNetworkAclEntry) || ($.eventName = DeleteNetworkAcl) || ($.eventName = DeleteNetworkAclEntry) || ($.eventName = ReplaceNetworkAclEntry) || ($.eventName = ReplaceNetworkAclAssociation) }'  # CRITICAL: detects NACL changes\n      MetricTransformations:\n        - MetricValue: \"1\"\n          MetricNamespace: \"CISBenchmark\"\n          MetricName: \"nacl_changes\"\n\n  NaclChangesAlarm:\n    Type: AWS::CloudWatch::Alarm\n    Properties:\n      AlarmName: \"nacl_changes\"\n      ComparisonOperator: GreaterThanOrEqualToThreshold\n      EvaluationPeriods: 1\n      MetricName: \"nacl_changes\"   # CRITICAL: alarm targets the metric from the filter\n      Namespace: \"CISBenchmark\"\n      Period: 300\n      Statistic: Sum\n      Threshold: 1\n```",
      "Other": "1. In the AWS Console, go to CloudWatch > Log groups and open the CloudTrail log group\n2. Metric filters tab > Create metric filter\n3. Set Filter pattern to:\n   { ($.eventName = CreateNetworkAcl) || ($.eventName = CreateNetworkAclEntry) || ($.eventName = DeleteNetworkAcl) || ($.eventName = DeleteNetworkAclEntry) || ($.eventName = ReplaceNetworkAclEntry) || ($.eventName = ReplaceNetworkAclAssociation) }\n4. Next > Filter name: nacl_changes; Metric namespace: CISBenchmark; Metric name: nacl_changes; Metric value: 1 > Create metric filter\n5. Select the new metric filter > Create alarm\n6. Set Statistic: Sum, Period: 5 minutes, Threshold type: Static, Condition: Greater/Equal, Threshold: 1\n7. Next through actions (optional) > Name: nacl_changes > Create alarm",
      "Terraform": "```hcl\n# CloudWatch metric filter and alarm for NACL changes\nresource \"aws_cloudwatch_log_metric_filter\" \"nacl\" {\n  name           = \"nacl_changes\"\n  log_group_name = \"<example_resource_name>\"  # CloudTrail log group\n  pattern        = \"{ ($.eventName = CreateNetworkAcl) || ($.eventName = CreateNetworkAclEntry) || ($.eventName = DeleteNetworkAcl) || ($.eventName = DeleteNetworkAclEntry) || ($.eventName = ReplaceNetworkAclEntry) || ($.eventName = ReplaceNetworkAclAssociation) }\"  # CRITICAL: detects NACL changes\n\n  metric_transformation {\n    name      = \"nacl_changes\"\n    namespace = \"CISBenchmark\"\n    value     = \"1\"\n  }\n}\n\nresource \"aws_cloudwatch_metric_alarm\" \"nacl\" {\n  alarm_name          = \"nacl_changes\"\n  comparison_operator = \"GreaterThanOrEqualToThreshold\"\n  evaluation_periods  = 1\n  metric_name         = \"nacl_changes\"   # CRITICAL: alarm targets the metric from the filter\n  namespace           = \"CISBenchmark\"\n  period              = 300\n  statistic           = \"Sum\"\n  threshold           = 1\n}\n```"
    },
    "Recommendation": {
      "Text": "Implement a CloudWatch Logs metric filter and alarm for NACL change events from CloudTrail and route alerts to responders. Enforce **least privilege** on NACL management, require **change control**, and use **defense in depth** with configuration monitoring and flow logs to validate and monitor network posture.",
      "Url": "https://hub.prowler.com/check/cloudwatch_changes_to_network_acls_alarm_configured"
    }
  },
  "Categories": [
    "logging"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Logging and Monitoring"
}
```

--------------------------------------------------------------------------------

````
