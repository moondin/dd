---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 259
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 259 of 867)

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

---[FILE: cognito_user_pool_temporary_password_expiration.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cognito/cognito_user_pool_temporary_password_expiration/cognito_user_pool_temporary_password_expiration.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cognito_user_pool_temporary_password_expiration",
  "CheckTitle": "Ensure that the user pool has a temporary password expiration period of 7 days or less",
  "CheckType": [],
  "ServiceName": "cognito",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:cognito-idp:region:account:userpool/userpool-id",
  "Severity": "medium",
  "ResourceType": "AwsCognitoUserPool",
  "Description": "Temporary passwords are set by the administrator and are used to allow users to sign in and change their password. Temporary passwords are valid for a limited period of time, after which they expire. Temporary passwords are used when an administrator creates a new user account or resets a user password. The temporary password expiration period is the length of time that the temporary password is valid. The default value is 7 days. You can set the expiration period to a value between 0 and 365 days.",
  "Risk": "If the temporary password expiration period is too long, it increases the risk of unauthorized access to the user account. If the temporary password expiration period is too short, it increases the risk of users being unable to sign in and change their password.",
  "RelatedUrl": "https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-policies.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Set the temporary password expiration period to 7 days or less.",
      "Url": "https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-policies.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cognito_user_pool_temporary_password_expiration.py]---
Location: prowler-master/prowler/providers/aws/services/cognito/cognito_user_pool_temporary_password_expiration/cognito_user_pool_temporary_password_expiration.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cognito.cognito_idp_client import cognito_idp_client


class cognito_user_pool_temporary_password_expiration(Check):
    def execute(self):
        findings = []
        for pool in cognito_idp_client.user_pools.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=pool)
            if pool.password_policy:
                if pool.password_policy.temporary_password_validity_days <= 7:
                    report.status = "PASS"
                    report.status_extended = f"User pool {pool.name} has temporary password expiration set to {pool.password_policy.temporary_password_validity_days} days."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"User pool {pool.name} has temporary password expiration set to {pool.password_policy.temporary_password_validity_days} days."
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"User pool {pool.name} has not password policy set."
                )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cognito_user_pool_waf_acl_attached.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cognito/cognito_user_pool_waf_acl_attached/cognito_user_pool_waf_acl_attached.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cognito_user_pool_waf_acl_attached",
  "CheckTitle": "Ensure that Amazon Cognito User Pool is associated with a WAF Web ACL",
  "CheckType": [],
  "ServiceName": "cognito",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:cognito-idp:region:account:userpool/userpool-id",
  "Severity": "medium",
  "ResourceType": "AwsCognitoUserPool",
  "Description": "Web ACLs are used to control access to your content. You can use a Web ACL to control who can access your content. You can also use a Web ACL to block requests based on IP address, HTTP headers, HTTP body, URI, or URI query string parameters. You can associate a Web ACL with a Cognito User Pool to control access to your content.",
  "Risk": "If a Web ACL is not associated with a Cognito User Pool, then the content is not protected by the Web ACL. This could lead to unauthorized access to your content.",
  "RelatedUrl": "https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-waf.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "The Web ACL should be associated with the Cognito User Pool. To associate a Web ACL with a Cognito User Pool, use the AWS Management Console.",
      "Url": "https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-waf.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cognito_user_pool_waf_acl_attached.py]---
Location: prowler-master/prowler/providers/aws/services/cognito/cognito_user_pool_waf_acl_attached/cognito_user_pool_waf_acl_attached.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cognito.cognito_idp_client import cognito_idp_client
from prowler.providers.aws.services.wafv2.wafv2_client import wafv2_client


class cognito_user_pool_waf_acl_attached(Check):
    def execute(self):
        findings = []
        for pool in cognito_idp_client.user_pools.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=pool)
            report.status = "FAIL"
            report.status_extended = (
                f"Cognito User Pool {pool.name} is not associated with a WAF Web ACL."
            )
            for acl in wafv2_client.web_acls.values():
                if pool.arn in acl.user_pools:
                    report.status = "PASS"
                    report.status_extended = f"Cognito User Pool {pool.name} is associated with the WAF Web ACL {acl.name}."
                    break
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: config_client.py]---
Location: prowler-master/prowler/providers/aws/services/config/config_client.py

```python
from prowler.providers.aws.services.config.config_service import Config
from prowler.providers.common.provider import Provider

config_client = Config(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: config_service.py]---
Location: prowler-master/prowler/providers/aws/services/config/config_service.py
Signals: Pydantic

```python
from typing import Optional

from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class Config(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.recorders = {}
        self.__threading_call__(self.describe_configuration_recorders)
        self.__threading_call__(
            self._describe_configuration_recorder_status, self.recorders.values()
        )

    def _get_recorder_arn_template(self, region):
        return f"arn:{self.audited_partition}:config:{region}:{self.audited_account}:recorder"

    def describe_configuration_recorders(self, regional_client):
        logger.info("Config - Listing Recorders...")
        try:
            recorders = regional_client.describe_configuration_recorders().get(
                "ConfigurationRecorders", []
            )

            # No config recorders in region
            if not recorders:
                self.recorders[regional_client.region] = Recorder(
                    name=self.audited_account,
                    role_arn="",
                    region=regional_client.region,
                )
            else:
                for recorder in recorders:
                    if not self.audit_resources or (
                        is_resource_filtered(recorder["name"], self.audit_resources)
                    ):
                        self.recorders[recorder["name"]] = Recorder(
                            name=recorder["name"],
                            role_arn=recorder["roleARN"],
                            region=regional_client.region,
                        )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_configuration_recorder_status(self, recorder):
        logger.info("Config - Listing Recorders Status...")
        try:
            if recorder.name != self.audited_account:
                recorder_status = (
                    self.regional_clients[recorder.region]
                    .describe_configuration_recorder_status(
                        ConfigurationRecorderNames=[recorder.name]
                    )
                    .get("ConfigurationRecordersStatus", [])
                )

                if recorder_status:
                    recorder.recording = recorder_status[0].get("recording", False)
                    recorder.last_status = recorder_status[0].get(
                        "lastStatus", "Failure"
                    )

        except Exception as error:
            logger.error(
                f"{recorder.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class Recorder(BaseModel):
    name: str
    role_arn: str
    recording: Optional[bool]
    last_status: Optional[str]
    region: str
```

--------------------------------------------------------------------------------

---[FILE: config_recorder_all_regions_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/config/config_recorder_all_regions_enabled/config_recorder_all_regions_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "config_recorder_all_regions_enabled",
  "CheckTitle": "AWS Config recorder is enabled and not in failure state or disabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "config",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**AWS accounts** have **AWS Config recorders** active and healthy in each Region. It identifies Regions with no recorder, a disabled recorder, or a recorder in a failure state.",
  "Risk": "**Gaps in Config recording** create **blind spots**. Changes in unmonitored Regions aren't captured, weakening **integrity** and **auditability**. Adversaries can alter resources or stage assets unnoticed, enabling misconfigurations and delaying **incident response**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://repost.aws/es/questions/QUGcgeerhcTamRkwgdwh_tLQ/enable-aws-config",
    "https://www.tenable.com/audits/items/CIS_Amazon_Web_Services_Foundations_v1.5.0_L2.audit:6a5136528bd329139e5969f8f1e5ffbc",
    "https://aws.amazon.com/blogs/mt/aws-config-best-practices/"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\nResources:\n  example_resource_recorder:\n    Type: AWS::Config::ConfigurationRecorder\n    Properties:\n      Name: example_resource\n      RoleARN: !Sub arn:aws:iam::${AWS::AccountId}:role/aws-service-role/config.amazonaws.com/AWSServiceRoleForConfig\n\n  example_resource_channel:\n    Type: AWS::Config::DeliveryChannel\n    Properties:\n      S3BucketName: example_resource\n\n  example_resource_status:\n    Type: AWS::Config::ConfigurationRecorderStatus\n    Properties:\n      Name: example_resource\n      Recording: true  # This line fixes the security issue\n    DependsOn:\n      - example_resource_channel\n```",
      "Other": "1. In the AWS Console, go to Config\n2. Click Set up AWS Config (or Settings)\n3. Select a resource recording option (any) and choose an existing S3 bucket for delivery\n4. Keep the default AWSServiceRoleForConfig role\n5. Click Confirm/Turn on to start recording\n6. Verify on the Settings page that Status shows Recording and not Failure",
      "Terraform": "```hcl\nresource \"aws_iam_service_linked_role\" \"example_resource\" {\n  aws_service_name = \"config.amazonaws.com\"\n}\n\nresource \"aws_config_configuration_recorder\" \"example_resource\" {\n  name     = \"example_resource\"\n  role_arn = aws_iam_service_linked_role.example_resource.arn\n}\n\nresource \"aws_config_delivery_channel\" \"example_resource\" {\n  s3_bucket_name = \"example_resource\"\n}\n\nresource \"aws_config_configuration_recorder_status\" \"example_resource\" {\n  name         = aws_config_configuration_recorder.example_resource.name\n  is_recording = true  # This line fixes the security issue\n  depends_on   = [aws_config_delivery_channel.example_resource]\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **AWS Config** in every Region with continuous recording and maintain healthy recorder status.",
      "Url": "https://hub.prowler.com/check/config_recorder_all_regions_enabled"
    }
  },
  "Categories": [
    "logging",
    "forensics-ready"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: config_recorder_all_regions_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/config/config_recorder_all_regions_enabled/config_recorder_all_regions_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.config.config_client import config_client


class config_recorder_all_regions_enabled(Check):
    def execute(self):
        findings = []
        for recorder in config_client.recorders.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=recorder)
            report.resource_arn = config_client._get_recorder_arn_template(
                recorder.region
            )
            # Check if Config is enabled in region
            if not recorder.name:
                report.status = "FAIL"
                report.status_extended = "No AWS Config recorders in region."
            else:
                if recorder.recording:
                    if recorder.last_status == "Failure":
                        report.status = "FAIL"
                        report.status_extended = (
                            f"AWS Config recorder {recorder.name} in failure state."
                        )
                    else:
                        report.status = "PASS"
                        report.status_extended = (
                            f"AWS Config recorder {recorder.name} is enabled."
                        )
                else:
                    report.status = "FAIL"
                    report.status_extended = (
                        f"AWS Config recorder {recorder.name} is disabled."
                    )
            if report.status == "FAIL" and (
                config_client.audit_config.get("mute_non_default_regions", False)
                and not recorder.region == config_client.region
            ):
                report.muted = True

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: config_recorder_using_aws_service_role.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/config/config_recorder_using_aws_service_role/config_recorder_using_aws_service_role.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "config_recorder_using_aws_service_role",
  "CheckTitle": "AWS Config recorder uses the AWSServiceRoleForConfig service-linked role",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "config",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**AWS Config recorders** are evaluated for use of the service‑linked IAM role `AWSServiceRoleForConfig` linked to `config.amazonaws.com` rather than a custom role.\n\nThe evaluation inspects active recorders and their role ARN to confirm the AWS‑managed service‑linked role is in use.",
  "Risk": "Using a custom or incorrect role can break recording or create blind spots, undermining the **integrity** and **availability** of configuration history. Over‑privileged roles weaken **least privilege**, increasing risk of unauthorized access, stealthy changes, and delayed incident response.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/config-controls.html#config-1",
    "https://docs.aws.amazon.com/config/latest/developerguide/using-service-linked-roles.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws configservice put-configuration-recorder --configuration-recorder name=<RECORDER_NAME>,roleARN=arn:<PARTITION>:iam::<ACCOUNT_ID>:role/aws-service-role/config.amazonaws.com/AWSServiceRoleForConfig",
      "NativeIaC": "```yaml\nResources:\n  example_resource:\n    Type: AWS::Config::ConfigurationRecorder\n    Properties:\n      Name: example_resource\n      RoleARN: arn:<PARTITION>:iam::<ACCOUNT_ID>:role/aws-service-role/config.amazonaws.com/AWSServiceRoleForConfig  # This line fixes the security issue\n```",
      "Other": "1. Open the AWS Console and go to AWS Config\n2. Choose Settings (or Recording) and click Edit\n3. For IAM role, select Use service-linked role (AWSServiceRoleForConfig)\n4. Save changes",
      "Terraform": "```hcl\nresource \"aws_config_configuration_recorder\" \"example_resource\" {\n  name     = \"example_resource\"\n  role_arn = \"arn:<PARTITION>:iam::<ACCOUNT_ID>:role/aws-service-role/config.amazonaws.com/AWSServiceRoleForConfig\"  # This line fixes the security issue\n}\n```"
    },
    "Recommendation": {
      "Text": "Use the AWS‑managed service‑linked role `AWSServiceRoleForConfig` for all recorders to enforce **least privilege** and consistent trust.\n\nAvoid custom roles; restrict who can modify the recorder or role; monitor for drift and ensure recording remains enabled as part of **defense in depth**.",
      "Url": "https://hub.prowler.com/check/config_recorder_using_aws_service_role"
    }
  },
  "Categories": [
    "identity-access"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: config_recorder_using_aws_service_role.py]---
Location: prowler-master/prowler/providers/aws/services/config/config_recorder_using_aws_service_role/config_recorder_using_aws_service_role.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.config.config_client import config_client


class config_recorder_using_aws_service_role(Check):
    def execute(self):
        findings = []
        for recorder in config_client.recorders.values():
            if recorder.name and recorder.recording:
                report = Check_Report_AWS(metadata=self.metadata(), resource=recorder)
                report.resource_arn = config_client._get_recorder_arn_template(
                    recorder.region
                )
                if (
                    recorder.role_arn
                    == f"arn:{config_client.audited_partition}:iam::{config_client.audited_account}:role/aws-service-role/config.amazonaws.com/AWSServiceRoleForConfig"
                ):
                    report.status = "PASS"
                    report.status_extended = f"AWS Config recorder {recorder.name} is using AWSServiceRoleForConfig."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"AWS Config recorder {recorder.name} is not using AWSServiceRoleForConfig."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: datasync_client.py]---
Location: prowler-master/prowler/providers/aws/services/datasync/datasync_client.py

```python
from prowler.providers.aws.services.datasync.datasync_service import DataSync
from prowler.providers.common.provider import Provider

datasync_client = DataSync(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: datasync_service.py]---
Location: prowler-master/prowler/providers/aws/services/datasync/datasync_service.py
Signals: Pydantic

```python
from typing import Dict, List, Optional

from botocore.exceptions import ClientError
from pydantic.v1 import BaseModel, Field

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class DataSync(AWSService):
    """AWS DataSync service class to list tasks, describe them, and list their tags."""

    def __init__(self, provider):
        """Initialize the DataSync service.

        Args:
            provider: The AWS provider instance.
        """

        super().__init__(__class__.__name__, provider)
        self.tasks = {}
        self.__threading_call__(self._list_tasks)
        self.__threading_call__(self._describe_tasks, self.tasks.values())
        self.__threading_call__(self._list_task_tags, self.tasks.values())

    def _list_tasks(self, regional_client):
        """List DataSync tasks in the given region.

        Args:
            regional_client: The regional AWS client.
        """

        logger.info("DataSync - Listing tasks...")
        try:
            list_tasks_paginator = regional_client.get_paginator("list_tasks")
            for page in list_tasks_paginator.paginate():
                for task in page.get("Tasks", []):
                    task_arn = task["TaskArn"]
                    task_id = task_arn.split("/")[-1]
                    if not self.audit_resources or (
                        is_resource_filtered(task_arn, self.audit_resources)
                    ):
                        self.tasks[task_arn] = DataSyncTask(
                            id=task_id,
                            arn=task_arn,
                            name=task.get("Name"),
                            region=regional_client.region,
                        )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_tasks(self, task):
        """Describe each DataSync task and update task details."""

        logger.info("DataSync - Describing tasks...")
        try:
            regional_client = self.regional_clients[task.region]
            response = regional_client.describe_task(TaskArn=task.arn)
            task.status = response.get("Status")
            task.options = response.get("Options")
            task.source_location_arn = response.get("SourceLocationArn")
            task.destination_location_arn = response.get("DestinationLocationArn")
            task.excludes = response.get("Excludes")
            task.schedule = response.get("Schedule")
            task.cloudwatch_log_group_arn = response.get("CloudWatchLogGroupArn")
        except ClientError as error:
            if error.response["Error"]["Code"] == "ResourceNotFoundException":
                logger.warning(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
            else:
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_task_tags(self, task):
        """List tags for each DataSync task."""

        logger.info("DataSync - Listing task tags...")
        try:
            regional_client = self.regional_clients[task.region]
            response = regional_client.list_tags_for_resource(ResourceArn=task.arn)
            task.tags = response.get("Tags", [])
        except ClientError as error:
            if error.response["Error"]["Code"] == "ResourceNotFoundException":
                logger.warning(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
            else:
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class DataSyncTask(BaseModel):
    id: str
    name: Optional[str] = None
    arn: str
    region: str
    status: Optional[str] = None
    options: Optional[Dict] = None
    source_location_arn: Optional[str] = None
    destination_location_arn: Optional[str] = None
    excludes: Optional[List] = None
    schedule: Optional[Dict] = None
    cloudwatch_log_group_arn: Optional[str] = None
    tags: List[Dict] = Field(default_factory=list)
```

--------------------------------------------------------------------------------

---[FILE: datasync_task_logging_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/datasync/datasync_task_logging_enabled/datasync_task_logging_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "datasync_task_logging_enabled",
  "CheckTitle": "DataSync tasks should have logging enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "datasync",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:datasync:{region}:{account-id}:task/{task-id}",
  "Severity": "high",
  "ResourceType": "AwsDataSyncTask",
  "Description": "This control checks if AWS DataSync tasks have logging enabled. The control fails if the task doesn't have the CloudWatchLogGroupArn property defined.",
  "Risk": "Without logging enabled, important operational data may be lost, making it difficult to troubleshoot issues, monitor performance, and ensure compliance with auditing requirements.",
  "RelatedUrl": "https://docs.aws.amazon.com/datasync/latest/userguide/monitor-datasync.html#enable-logging",
  "Remediation": {
    "Code": {
      "CLI": "aws datasync update-task --task-arn <task-arn> --cloud-watch-log-group-arn <log-group-arn>",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/datasync/latest/userguide/monitor-datasync.html#enable-logging",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Configure logging for your DataSync tasks to ensure that operational data is captured and available for debugging, monitoring, and auditing purposes.",
      "Url": "https://docs.aws.amazon.com/datasync/latest/userguide/monitor-datasync.html#enable-logging"
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

---[FILE: datasync_task_logging_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/datasync/datasync_task_logging_enabled/datasync_task_logging_enabled.py

```python
from typing import List

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.datasync.datasync_client import datasync_client


class datasync_task_logging_enabled(Check):
    """Check if AWS DataSync tasks have logging enabled.

    This class verifies whether each AWS DataSync task has logging enabled by checking
    for the presence of a CloudWatch Log Group ARN in the task's configuration.
    """

    def execute(self) -> List[Check_Report_AWS]:
        """Execute the DataSync tasks logging enabled check.

        Iterates over all DataSync tasks and generates a report indicating whether
        each task has logging enabled.

        Returns:
            List[Check_Report_AWS]: A list of report objects with the results of the check.
        """
        findings = []
        for task in datasync_client.tasks.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=task)
            report.status = "PASS"
            report.status_extended = f"DataSync task {task.name} has logging enabled."

            if not task.cloudwatch_log_group_arn:
                report.status = "FAIL"
                report.status_extended = (
                    f"DataSync task {task.name} does not have logging enabled."
                )

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: directconnect_client.py]---
Location: prowler-master/prowler/providers/aws/services/directconnect/directconnect_client.py

```python
from prowler.providers.aws.services.directconnect.directconnect_service import (
    DirectConnect,
)
from prowler.providers.common.provider import Provider

directconnect_client = DirectConnect(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: directconnect_service.py]---
Location: prowler-master/prowler/providers/aws/services/directconnect/directconnect_service.py
Signals: Pydantic

```python
from typing import Optional

from botocore.exceptions import ClientError
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class DirectConnect(AWSService):
    def __init__(self, provider):
        super().__init__(__class__.__name__, provider)
        self.connections = {}
        self.vifs = {}
        self.vgws = {}
        self.dxgws = {}
        self.__threading_call__(self._describe_connections)
        self.__threading_call__(self._describe_vifs)

    def _get_connection_arn_template(self, region):
        return (
            f"arn:{self.audited_partition}:directconnect:{region}:{self.audited_account}:dxcon"
            if region
            else f"arn:{self.audited_partition}:directconnect:{self.region}:{self.audited_account}:dxcon"
        )

    def _describe_connections(self, regional_client):
        """List DirectConnect(s) in the given region.

        Args:
            regional_client: The regional AWS client.
        """

        try:
            logger.info("DirectConnect - Listing Connections...")
            dx_connect = regional_client.describe_connections()

            for connection in dx_connect["connections"]:
                connection_arn = f"arn:{self.audited_partition}:directconnect:{regional_client.region}:{self.audited_account}:dxcon/{connection['connectionId']}"
                if not self.audit_resources or (
                    is_resource_filtered(connection_arn, self.audit_resources)
                ):
                    self.connections[connection_arn] = Connection(
                        arn=connection_arn,
                        id=connection["connectionId"],
                        name=connection["connectionName"],
                        location=connection["location"],
                        region=regional_client.region,
                    )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_vifs(self, regional_client):
        """Describe each DirectConnect VIFs."""

        logger.info("DirectConnect - Describing VIFs...")
        try:
            describe_vifs = regional_client.describe_virtual_interfaces()
            for vif in describe_vifs["virtualInterfaces"]:
                vif_id = vif["virtualInterfaceId"]
                vif_arn = f"arn:{self.audited_partition}:directconnect:{regional_client.region}:{self.audited_account}:dxvif/{vif_id}"
                if not self.audit_resources or (
                    is_resource_filtered(vif_arn, self.audit_resources)
                ):
                    vgw_id = vif.get("virtualGatewayId")
                    connection_id = vif.get("connectionId")
                    dxgw_id = vif.get("directConnectGatewayId")
                    self.vifs[vif_arn] = VirtualInterface(
                        arn=vif_arn,
                        id=vif_id,
                        name=vif["virtualInterfaceName"],
                        connection_id=connection_id,
                        vgw_gateway_id=vif["virtualGatewayId"],
                        dx_gateway_id=dxgw_id,
                        location=vif["location"],
                        region=regional_client.region,
                    )
                    if vgw_id:
                        vgw_arn = f"arn:{self.audited_partition}:directconnect:{regional_client.region}:{self.audited_account}:virtual-gateway/{vgw_id}"
                        if vgw_arn in self.vgws:
                            self.vgws[vgw_arn].vifs.append(vif_id)
                            self.vgws[vgw_arn].connections.append(connection_id)
                        else:
                            self.vgws[vgw_arn] = VirtualGateway(
                                arn=vgw_arn,
                                id=vgw_id,
                                vifs=[vif_id],
                                connections=[connection_id],
                                region=regional_client.region,
                            )

                    if dxgw_id:
                        dxgw_arn = f"arn:{self.audited_partition}:directconnect:{regional_client.region}:{self.audited_account}:dx-gateway/{dxgw_id}"
                        if dxgw_arn in self.dxgws:
                            self.dxgws[dxgw_arn].vifs.append(vif_id)
                            self.dxgws[dxgw_arn].connections.append(connection_id)
                        else:
                            self.dxgws[dxgw_arn] = DXGateway(
                                arn=dxgw_arn,
                                id=dxgw_id,
                                vifs=[vif_id],
                                connections=[connection_id],
                                region=regional_client.region,
                            )
        except ClientError as error:
            if error.response["Error"]["Code"] == "ResourceNotFoundException":
                logger.warning(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
            else:
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class Connection(BaseModel):
    arn = str
    id: str
    name: Optional[str] = None
    location: str
    region: str


class VirtualInterface(BaseModel):
    arn: str
    id: str
    name: str
    connection_id: Optional[str] = None
    vgw_gateway_id: str
    dx_gateway_id: str
    location: str
    region: str


class VirtualGateway(BaseModel):
    arn: str
    id: str
    vifs: list
    connections: list
    region: str


class DXGateway(BaseModel):
    arn: str
    id: str
    vifs: list
    connections: list
    region: str
```

--------------------------------------------------------------------------------

---[FILE: directconnect_connection_redundancy.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/directconnect/directconnect_connection_redundancy/directconnect_connection_redundancy.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "directconnect_connection_redundancy",
  "CheckTitle": "Direct Connect connections span at least two locations per region",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability"
  ],
  "ServiceName": "directconnect",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**AWS Direct Connect** connectivity is provisioned with **connection and location redundancy**-multiple connections spread across **at least two distinct Direct Connect locations** in each Region.",
  "Risk": "Missing **connection/location redundancy** creates a **single point of failure**, degrading **availability**. A router, fiber, or site outage can sever private paths to AWS, stalling app traffic, data replication, and admin access, leading to timeouts or extended downtime until alternate paths are restored.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/awssupport/latest/user/fault-tolerance-checks.html#amazon-direct-connect-location-resiliency",
    "https://repost.aws/knowledge-center/direct-connect-physical-redundancy",
    "https://aws.amazon.com/directconnect/resiliency-recommendation/"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws directconnect create-connection --region <REGION> --location <NEW_DX_LOCATION_CODE> --bandwidth 1Gbps --connection-name <example_resource_name>",
      "NativeIaC": "",
      "Other": "1. In the AWS Console, go to Direct Connect > Connections\n2. Click Create connection\n3. Region: select the Region where the existing connection resides\n4. Name: enter <example_resource_name>\n5. Location: select a different Direct Connect location than your existing connection\n6. Bandwidth: choose a supported value (e.g., 1 Gbps)\n7. Click Create connection",
      "Terraform": "```hcl\n# Create an additional Direct Connect connection in a different location\nresource \"aws_dx_connection\" \"example\" {\n  name      = \"<example_resource_name>\"\n  bandwidth = \"1Gbps\"\n  location  = \"<NEW_DX_LOCATION_CODE>\" # Critical: choose a different DX location in the same Region to achieve location redundancy\n}\n```"
    },
    "Recommendation": {
      "Text": "Apply **redundancy** and **defense in depth**:\n- Deploy 2 Direct Connect connections across **two distinct locations**\n- Use **dynamic, active/active routing** for automatic failover\n- Ensure **provider/device diversity**\n- Size capacity so one link loss doesn't overload remaining paths\n- Consider a **VPN** as tertiary backup",
      "Url": "https://hub.prowler.com/check/directconnect_connection_redundancy"
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

````
