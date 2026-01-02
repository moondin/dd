---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 281
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 281 of 867)

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

---[FILE: elasticbeanstalk_service.py]---
Location: prowler-master/prowler/providers/aws/services/elasticbeanstalk/elasticbeanstalk_service.py
Signals: Pydantic

```python
from typing import Optional

from botocore.client import ClientError
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class ElasticBeanstalk(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.environments = {}
        self.__threading_call__(self._describe_environments)
        self.__threading_call__(
            self._describe_configuration_settings, self.environments.values()
        )
        self.__threading_call__(
            self._list_tags_for_resource, self.environments.values()
        )

    def _describe_environments(self, regional_client):
        logger.info("ElasticBeanstalk - Describing environments...")
        try:
            describe_environment_paginator = regional_client.get_paginator(
                "describe_environments"
            )
            for page in describe_environment_paginator.paginate():
                for environment in page["Environments"]:
                    environment_arn = environment["EnvironmentArn"]
                    if not self.audit_resources or (
                        is_resource_filtered(environment_arn, self.audit_resources)
                    ):
                        self.environments[environment_arn] = Environment(
                            id=environment["EnvironmentId"],
                            arn=environment_arn,
                            application_name=environment["ApplicationName"],
                            name=environment["EnvironmentName"],
                            region=regional_client.region,
                        )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_configuration_settings(self, environment):
        logger.info("ElasticBeanstalk - Describing configuration settings...")
        try:
            regional_client = self.regional_clients[environment.region]
            configuration_settings = regional_client.describe_configuration_settings(
                ApplicationName=environment.application_name,
                EnvironmentName=environment.name,
            )
            option_settings = configuration_settings["ConfigurationSettings"][0].get(
                "OptionSettings", {}
            )
            for option in option_settings:
                if (
                    option["Namespace"] == "aws:elasticbeanstalk:healthreporting:system"
                    and option["OptionName"] == "SystemType"
                ):
                    environment.health_reporting = option.get("Value", "basic")
                elif (
                    option["Namespace"] == "aws:elasticbeanstalk:managedactions"
                    and option["OptionName"] == "ManagedActionsEnabled"
                ):
                    environment.managed_platform_updates = option.get("Value", "false")
                elif (
                    option["Namespace"] == "aws:elasticbeanstalk:cloudwatch:logs"
                    and option["OptionName"] == "StreamLogs"
                ):
                    environment.cloudwatch_stream_logs = option.get("Value", "false")
        except ClientError as error:
            if error.response["Error"]["Code"] in [
                "InvalidParameterValue",
            ]:
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

    def _list_tags_for_resource(self, resource: any):
        logger.info("ElasticBeanstalk -  List Tags...")
        try:
            regional_client = self.regional_clients[resource.region]
            response = regional_client.list_tags_for_resource(ResourceArn=resource.arn)[
                "ResourceTags"
            ]
            resource.tags = response
        except ClientError as error:
            if error.response["Error"]["Code"] in [
                "ResourceNotFoundException",
            ]:
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


class Environment(BaseModel):
    id: str
    name: str
    arn: str
    region: str
    application_name: str
    health_reporting: Optional[str]
    managed_platform_updates: Optional[str]
    cloudwatch_stream_logs: Optional[str]
    tags: Optional[list] = []
```

--------------------------------------------------------------------------------

---[FILE: elasticbeanstalk_environment_cloudwatch_logging_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/elasticbeanstalk/elasticbeanstalk_environment_cloudwatch_logging_enabled/elasticbeanstalk_environment_cloudwatch_logging_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "elasticbeanstalk_environment_cloudwatch_logging_enabled",
  "CheckTitle": "Elastic Beanstalk environment streams logs to CloudWatch Logs",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Runtime Behavior Analysis",
    "TTPs/Defense Evasion"
  ],
  "ServiceName": "elasticbeanstalk",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsElasticBeanstalkEnvironment",
  "Description": "**Elastic Beanstalk environments** are configured to stream instance and proxy logs to **Amazon CloudWatch Logs** via the `StreamLogs` setting",
  "Risk": "Without **centralized logging** to CloudWatch, logs may be lost during rotation or instance termination, delaying detection and response. Attackers can delete local logs to evade audits, hiding evidence of web attacks or config tampering and undermining **confidentiality**, **integrity**, and **availability**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/AWSHowTo.cloudwatchlogs.html",
    "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/environments-cfg-logging.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/elasticbeanstalk-controls.html#elasticbeanstalk-3"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws elasticbeanstalk update-environment --environment-name <example_resource_name> --option-settings Namespace=aws:elasticbeanstalk:cloudwatch:logs,OptionName=StreamLogs,Value=true",
      "NativeIaC": "```yaml\nResources:\n  <example_resource_name>:\n    Type: AWS::ElasticBeanstalk::Environment\n    Properties:\n      ApplicationName: \"<example_resource_name>\"\n      PlatformArn: \"<platform_arn>\"\n      OptionSettings:\n        - Namespace: aws:elasticbeanstalk:cloudwatch:logs\n          OptionName: StreamLogs\n          Value: \"true\"  # Critical: Enables instance log streaming to CloudWatch Logs\n```",
      "Other": "1. Open the AWS Elastic Beanstalk console and select your environment\n2. Go to Configuration > Updates, monitoring, and logging > Edit\n3. Under \"Instance log streaming to CloudWatch Logs\", set Log streaming to Activated\n4. Click Apply to save",
      "Terraform": "```hcl\nresource \"aws_elastic_beanstalk_environment\" \"<example_resource_name>\" {\n  name         = \"<example_resource_name>\"\n  application  = \"<example_resource_name>\"\n  platform_arn = \"<platform_arn>\"\n\n  # Critical: Enables instance log streaming to CloudWatch Logs\n  setting {\n    namespace = \"aws:elasticbeanstalk:cloudwatch:logs\"\n    name      = \"StreamLogs\"\n    value     = \"true\"\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable streaming to **CloudWatch Logs**. Set sensible retention, avoid deletion on termination, and restrict access with least-privilege IAM. Add metric filters and alerts for early detection, and retain archives to support **forensics**, **accountability**, and **defense in depth**.",
      "Url": "https://hub.prowler.com/check/elasticbeanstalk_environment_cloudwatch_logging_enabled"
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

---[FILE: elasticbeanstalk_environment_cloudwatch_logging_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/elasticbeanstalk/elasticbeanstalk_environment_cloudwatch_logging_enabled/elasticbeanstalk_environment_cloudwatch_logging_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.elasticbeanstalk.elasticbeanstalk_client import (
    elasticbeanstalk_client,
)


class elasticbeanstalk_environment_cloudwatch_logging_enabled(Check):
    def execute(self):
        findings = []
        for environment in elasticbeanstalk_client.environments.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=environment)
            report.status = "PASS"
            report.status_extended = f"Elastic Beanstalk environment {environment.name} is sending logs to CloudWatch Logs."

            if environment.cloudwatch_stream_logs != "true":
                report.status = "FAIL"
                report.status_extended = f"Elastic Beanstalk environment {environment.name} is not sending logs to CloudWatch Logs."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: elasticbeanstalk_environment_enhanced_health_reporting.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/elasticbeanstalk/elasticbeanstalk_environment_enhanced_health_reporting/elasticbeanstalk_environment_enhanced_health_reporting.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "elasticbeanstalk_environment_enhanced_health_reporting",
  "CheckTitle": "Elastic Beanstalk environment has enhanced health reporting enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/AWS Security Best Practices/Runtime Behavior Analysis"
  ],
  "ServiceName": "elasticbeanstalk",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "AwsElasticBeanstalkEnvironment",
  "Description": "**Elastic Beanstalk environments** have health reporting set to `enhanced` instead of basic.",
  "Risk": "Without **enhanced health**, issues are detected late, raising MTTR and enabling **service outages**. Hidden instance failures or bad deployments can create uneven fleets, degrading **availability** and potentially **integrity** (serving stale versions), while error spikes and thrash increase operational cost.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/health-enhanced-enable.html#health-enhanced-enable-console",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/elasticbeanstalk-controls.html#elasticbeanstalk-1"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws elasticbeanstalk update-environment --environment-name <environment-name> --option-settings Namespace=aws:elasticbeanstalk:healthreporting:system,OptionName=SystemType,Value=enhanced",
      "NativeIaC": "```yaml\n# CloudFormation: enable enhanced health reporting for an Elastic Beanstalk environment\nResources:\n  <example_resource_name>:\n    Type: AWS::ElasticBeanstalk::Environment\n    Properties:\n      ApplicationName: <example_resource_name>\n      EnvironmentName: <example_resource_name>\n      SolutionStackName: <example_solution_stack>\n      OptionSettings:\n        - Namespace: aws:elasticbeanstalk:healthreporting:system\n          OptionName: SystemType  # Critical: selects the enhanced health reporting system\n          Value: enhanced          # Critical: sets health reporting to enhanced\n```",
      "Other": "1. Open the AWS Elastic Beanstalk console and select your Region\n2. Go to Environments and choose your environment\n3. Select Configuration > Monitoring > Edit\n4. Under Health reporting, set System to Enhanced\n5. Click Apply to save the change",
      "Terraform": "```hcl\n# Terraform: enable enhanced health reporting for an Elastic Beanstalk environment\nresource \"aws_elastic_beanstalk_environment\" \"<example_resource_name>\" {\n  name                = \"<example_resource_name>\"\n  application         = \"<example_resource_name>\"\n  solution_stack_name = \"<example_solution_stack>\"\n\n  setting {\n    namespace = \"aws:elasticbeanstalk:healthreporting:system\"\n    name      = \"SystemType\"  # Critical: selects the enhanced health reporting system\n    value     = \"enhanced\"    # Critical: sets health reporting to enhanced\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Set health reporting to `enhanced` for all environments and make it a security baseline. Connect health signals to alerts for rapid response. Apply **least privilege** to required roles and use **defense in depth** with auto-healing, alarms, and runbooks to prevent prolonged degradation.",
      "Url": "https://hub.prowler.com/check/elasticbeanstalk_environment_enhanced_health_reporting"
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

---[FILE: elasticbeanstalk_environment_enhanced_health_reporting.py]---
Location: prowler-master/prowler/providers/aws/services/elasticbeanstalk/elasticbeanstalk_environment_enhanced_health_reporting/elasticbeanstalk_environment_enhanced_health_reporting.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.elasticbeanstalk.elasticbeanstalk_client import (
    elasticbeanstalk_client,
)


class elasticbeanstalk_environment_enhanced_health_reporting(Check):
    def execute(self):
        findings = []
        for environment in elasticbeanstalk_client.environments.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=environment)
            report.status = "PASS"
            report.status_extended = f"Elastic Beanstalk environment {environment.name} has enhanced health reporting enabled."

            if environment.health_reporting != "enhanced":
                report.status = "FAIL"
                report.status_extended = f"Elastic Beanstalk environment {environment.name} does not have enhanced health reporting enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: elasticbeanstalk_environment_managed_updates_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/elasticbeanstalk/elasticbeanstalk_environment_managed_updates_enabled/elasticbeanstalk_environment_managed_updates_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "elasticbeanstalk_environment_managed_updates_enabled",
  "CheckTitle": "Elastic Beanstalk environment has managed platform updates enabled",
  "CheckType": [
    "Software and Configuration Checks/Patch Management",
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "elasticbeanstalk",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsElasticBeanstalkEnvironment",
  "Description": "**Elastic Beanstalk environments** with **managed platform updates** enabled (`ManagedActionsEnabled: true`) automatically apply platform patch/minor updates during a scheduled maintenance window.",
  "Risk": "Without automatic platform updates, environments may run **vulnerable OS/runtime versions**, enabling exploitation of known CVEs, RCE, or privilege escalation.\n\nPatch drift also increases instability, harming **availability** and undermining application **integrity**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/elasticbeanstalk-controls.html#elasticbeanstalk-2",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/ElasticBeanstalk/managed-platform-updates.html",
    "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/environment-platform-update-managed.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws elasticbeanstalk update-environment --environment-name <environment-name> --option-settings Namespace=aws:elasticbeanstalk:managedactions,OptionName=ManagedActionsEnabled,Value=true",
      "NativeIaC": "```yaml\nResources:\n  <example_resource_name>:\n    Type: AWS::ElasticBeanstalk::Environment\n    Properties:\n      ApplicationName: <example_resource_name>\n      SolutionStackName: <example_resource_name>\n      OptionSettings:\n        - Namespace: aws:elasticbeanstalk:managedactions\n          OptionName: ManagedActionsEnabled  # Critical: enables managed platform updates\n          Value: \"true\"                      # Critical: set to true to pass the check\n```",
      "Other": "1. Open the AWS Management Console and go to Elastic Beanstalk\n2. Select your environment\n3. Choose Configuration\n4. In Managed updates, click Edit\n5. Turn Managed updates to Enabled\n6. Click Apply/Save",
      "Terraform": "```hcl\nresource \"aws_elastic_beanstalk_environment\" \"<example_resource_name>\" {\n  name                = \"<example_resource_name>\"\n  application         = \"<example_resource_name>\"\n  solution_stack_name = \"<example_resource_name>\"\n\n  setting {\n    namespace = \"aws:elasticbeanstalk:managedactions\"\n    name      = \"ManagedActionsEnabled\"   # Critical: enables managed platform updates\n    value     = \"true\"                    # Critical: set to true to pass the check\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **managed platform updates** with a set maintenance window and choose an update level (`patch` or `minor`). Ensure **enhanced health** is on and the update role follows **least privilege**. Validate in staging, roll out gradually, and stagger windows across environments to strengthen **defense in depth** and resilience.",
      "Url": "https://hub.prowler.com/check/elasticbeanstalk_environment_managed_updates_enabled"
    }
  },
  "Categories": [
    "vulnerabilities"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: elasticbeanstalk_environment_managed_updates_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/elasticbeanstalk/elasticbeanstalk_environment_managed_updates_enabled/elasticbeanstalk_environment_managed_updates_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.elasticbeanstalk.elasticbeanstalk_client import (
    elasticbeanstalk_client,
)


class elasticbeanstalk_environment_managed_updates_enabled(Check):
    def execute(self):
        findings = []
        for environment in elasticbeanstalk_client.environments.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=environment)
            report.status = "PASS"
            report.status_extended = f"Elastic Beanstalk environment {environment.name} has managed platform updates enabled."

            if environment.managed_platform_updates != "true":
                report.status = "FAIL"
                report.status_extended = f"Elastic Beanstalk environment {environment.name} does not have managed platform updates enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: elb_client.py]---
Location: prowler-master/prowler/providers/aws/services/elb/elb_client.py

```python
from prowler.providers.aws.services.elb.elb_service import ELB
from prowler.providers.common.provider import Provider

elb_client = ELB(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: elb_service.py]---
Location: prowler-master/prowler/providers/aws/services/elb/elb_service.py
Signals: Pydantic

```python
from typing import Optional

from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class ELB(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.loadbalancers = {}
        self.__threading_call__(self._describe_load_balancers)
        self.__threading_call__(
            self._describe_load_balancer_attributes, self.loadbalancers.values()
        )
        self.__threading_call__(self._describe_tags, self.loadbalancers.values())

    def _describe_load_balancers(self, regional_client):
        logger.info("ELB - Describing load balancers...")
        try:
            describe_elb_paginator = regional_client.get_paginator(
                "describe_load_balancers"
            )
            for page in describe_elb_paginator.paginate():
                for elb in page["LoadBalancerDescriptions"]:
                    arn = f"arn:{self.audited_partition}:elasticloadbalancing:{regional_client.region}:{self.audited_account}:loadbalancer/{elb['LoadBalancerName']}"
                    if not self.audit_resources or (
                        is_resource_filtered(arn, self.audit_resources)
                    ):
                        listeners = []
                        for listener in elb["ListenerDescriptions"]:
                            listeners.append(
                                Listener(
                                    protocol=listener["Listener"]["Protocol"],
                                    policies=listener["PolicyNames"],
                                    certificate_arn=listener["Listener"].get(
                                        "SSLCertificateId", ""
                                    ),
                                )
                            )

                        self.loadbalancers[arn] = LoadBalancer(
                            arn=arn,
                            name=elb["LoadBalancerName"],
                            dns=elb["DNSName"],
                            region=regional_client.region,
                            scheme=elb["Scheme"],
                            listeners=listeners,
                            availability_zones=set(elb.get("AvailabilityZones", [])),
                        )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_load_balancer_attributes(self, load_balancer):
        logger.info("ELB - Describing attributes...")
        try:
            regional_client = self.regional_clients[load_balancer.region]
            attributes = regional_client.describe_load_balancer_attributes(
                LoadBalancerName=load_balancer.name
            )["LoadBalancerAttributes"]

            load_balancer.access_logs = attributes.get("AccessLog", {}).get("Enabled")
            load_balancer.cross_zone_load_balancing = attributes.get(
                "CrossZoneLoadBalancing", {}
            ).get("Enabled")
            load_balancer.connection_draining = attributes.get(
                "ConnectionDraining", {}
            ).get("Enabled", False)
            additional_attributes = attributes.get("AdditionalAttributes", [])
            for attribute in additional_attributes:
                if attribute["Key"] == "elb.http.desyncmitigationmode":
                    load_balancer.desync_mitigation_mode = attribute["Value"]

        except Exception as error:
            logger.error(
                f"{load_balancer.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_tags(self, load_balancer):
        logger.info("ELB - List Tags...")
        try:
            regional_client = self.regional_clients[load_balancer.region]

            tags = regional_client.describe_tags(
                LoadBalancerNames=[load_balancer.name]
            )["TagDescriptions"][0].get("Tags", [])

            load_balancer.tags = tags

        except Exception as error:
            logger.error(
                f"{load_balancer.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class Listener(BaseModel):
    protocol: str
    certificate_arn: str
    policies: list[str]


class LoadBalancer(BaseModel):
    arn: str
    name: str
    dns: str
    region: str
    scheme: str
    access_logs: Optional[bool]
    listeners: list[Listener]
    cross_zone_load_balancing: Optional[bool]
    availability_zones: set[str]
    connection_draining: Optional[bool]
    desync_mitigation_mode: Optional[str]
    tags: Optional[list] = []
```

--------------------------------------------------------------------------------

---[FILE: elb_connection_draining_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/elb/elb_connection_draining_enabled/elb_connection_draining_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "elb_connection_draining_enabled",
  "CheckTitle": "Classic Load Balancer has connection draining enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Effects/Denial of Service"
  ],
  "ServiceName": "elb",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsElbLoadBalancer",
  "Description": "**Classic Load Balancer** has **connection draining** enabled, so deregistering or unhealthy instances stop receiving new requests while existing connections are allowed to complete within the configured drain window.",
  "Risk": "Without **connection draining**, instance removals or health failures can terminate in-flight requests, leading to partial transactions, broken sessions, and inconsistent application state. This reduces **availability** and can impact **data integrity** during deployments, scaling, or failover events.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://aws.amazon.com/blogs/aws/elb-connection-draining-remove-instances-from-service-with-care/",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/ELB/elb-connection-draining-enabled.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/elb-controls.html#elb-7",
    "https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/config-conn-drain.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws elb modify-load-balancer-attributes --load-balancer-name <example_resource_name> --load-balancer-attributes '{\"ConnectionDraining\":{\"Enabled\":true}}'",
      "NativeIaC": "```yaml\n# CloudFormation: Enable connection draining on a Classic Load Balancer\nResources:\n  <example_resource_name>:\n    Type: AWS::ElasticLoadBalancing::LoadBalancer\n    Properties:\n      Listeners:\n        - InstancePort: 80\n          LoadBalancerPort: 80\n          Protocol: HTTP\n      AvailabilityZones:\n        - us-east-1a\n      ConnectionDrainingPolicy:\n        Enabled: true  # CRITICAL: turns on connection draining so in-flight requests complete\n        # Timeout is optional; default 300s is used if omitted\n```",
      "Other": "1. Open the EC2 console and go to Load Balancers (Classic)\n2. Select the Classic Load Balancer\n3. Choose the Attributes tab, then click Edit\n4. Check Enable connection draining (leave default timeout or set as needed)\n5. Click Save changes",
      "Terraform": "```hcl\n# Terraform: Enable connection draining on a Classic Load Balancer\nresource \"aws_elb\" \"<example_resource_name>\" {\n  name               = \"<example_resource_name>\"\n  availability_zones = [\"us-east-1a\"]\n\n  listener {\n    lb_port           = 80\n    lb_protocol       = \"http\"\n    instance_port     = 80\n    instance_protocol = \"http\"\n  }\n\n  connection_draining = true  # CRITICAL: enables connection draining so existing connections complete\n  # connection_draining_timeout can be omitted (defaults to 300s)\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **connection draining** on all Classic Load Balancers and set a drain interval aligned to typical request latency. Coordinate autoscaling and deployments to allow graceful instance shutdowns. Monitor errors and retries to validate behavior and adjust the `timeout` conservatively to protect **availability** and **integrity**.",
      "Url": "https://hub.prowler.com/check/elb_connection_draining_enabled"
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

---[FILE: elb_connection_draining_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/elb/elb_connection_draining_enabled/elb_connection_draining_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.elb.elb_client import elb_client


class elb_connection_draining_enabled(Check):
    def execute(self) -> list[Check_Report_AWS]:
        findings = []
        for lb in elb_client.loadbalancers.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=lb)
            report.status = "PASS"
            report.status_extended = f"ELB {lb.name} has connection draining enabled."

            if not lb.connection_draining:
                report.status = "FAIL"
                report.status_extended = (
                    f"ELB {lb.name} does not have connection draining enabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: elb_cross_zone_load_balancing_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/elb/elb_cross_zone_load_balancing_enabled/elb_cross_zone_load_balancing_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "elb_cross_zone_load_balancing_enabled",
  "CheckTitle": "Classic Load Balancer has cross-zone load balancing enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Effects/Denial of Service",
    "Effects/Resource Consumption"
  ],
  "ServiceName": "elb",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsElbLoadBalancer",
  "Description": "Classic Load Balancer with **cross-zone load balancing** distributes requests across registered targets in all enabled Availability Zones.\n\nThis evaluates whether that setting is `enabled`, instead of restricting distribution to targets within only the same zone.",
  "Risk": "Without **cross-zone load balancing**, traffic can concentrate in one AZ due to DNS skew or uneven capacity, creating **hot spots**, timeouts, and latency. This degrades service **availability** and increases the chance of cascading failures during AZ impairment or instance loss.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/elb-controls.html#elb-9",
    "https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/enable-disable-crosszone-lb.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/ELB/elb-cross-zone-load-balancing-enabled.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws elb modify-load-balancer-attributes --load-balancer-name <load-balancer-name> --load-balancer-attributes \"{\\\"CrossZoneLoadBalancing\\\":{\\\"Enabled\\\":true}}\"",
      "NativeIaC": "```yaml\n# CloudFormation: Enable cross-zone load balancing on a Classic Load Balancer\nResources:\n  <example_resource_name>:\n    Type: AWS::ElasticLoadBalancing::LoadBalancer\n    Properties:\n      CrossZone: true  # Critical: enables cross-zone load balancing to pass the check\n      Listeners:\n        - LoadBalancerPort: 80\n          InstancePort: 80\n          Protocol: HTTP\n      AvailabilityZones:\n        - <example_az>\n```",
      "Other": "1. Open the AWS EC2 console\n2. Go to Load Balancing > Load Balancers and select your Classic Load Balancer\n3. Open the Attributes tab and click Edit\n4. Enable Cross-zone load balancing\n5. Click Save changes",
      "Terraform": "```hcl\n# Terraform: Enable cross-zone load balancing on a Classic Load Balancer\nresource \"aws_elb\" \"<example_resource_name>\" {\n  name = \"<example_resource_name>\"\n\n  listener {\n    lb_port           = 80\n    lb_protocol       = \"http\"\n    instance_port     = 80\n    instance_protocol = \"http\"\n  }\n\n  availability_zones = [\"<example_az>\"]\n\n  cross_zone_load_balancing = true  # Critical: enables cross-zone load balancing to pass the check\n}\n```"
    },
    "Recommendation": {
      "Text": "Set `cross-zone load balancing` to `enabled` on Classic Load Balancers and use at least two AZs.\n\nBalance capacity per AZ, enforce robust health checks with autoscaling, and design for **high availability** so load remains evenly distributed during demand spikes or partial AZ outages.",
      "Url": "https://hub.prowler.com/check/elb_cross_zone_load_balancing_enabled"
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

---[FILE: elb_cross_zone_load_balancing_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/elb/elb_cross_zone_load_balancing_enabled/elb_cross_zone_load_balancing_enabled.py

```python
from typing import List

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.elb.elb_client import elb_client


class elb_cross_zone_load_balancing_enabled(Check):
    def execute(self) -> List[Check_Report_AWS]:
        findings = []
        for lb in elb_client.loadbalancers.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=lb)
            report.status = "FAIL"
            report.status_extended = (
                f"ELB {lb.name} does not have cross-zone load balancing enabled."
            )

            if lb.cross_zone_load_balancing:
                report.status = "PASS"
                report.status_extended = (
                    f"ELB {lb.name} has cross-zone load balancing enabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: elb_desync_mitigation_mode.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/elb/elb_desync_mitigation_mode/elb_desync_mitigation_mode.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "elb_desync_mitigation_mode",
  "CheckTitle": "Classic Load Balancer desync mitigation mode is defensive or strictest",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "TTPs/Initial Access",
    "TTPs/Defense Evasion"
  ],
  "ServiceName": "elb",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsElbLoadBalancer",
  "Description": "**Classic Load Balancer** `desync_mitigation_mode` is evaluated to determine whether it is configured as **`defensive`** or **`strictest`**. Any other mode (such as `monitor`) is identified for attention.",
  "Risk": "Without strict desync mitigation, **HTTP request smuggling** can occur, enabling:\n- Cache/queue poisoning (**integrity**)\n- Session hijacking and data exposure (**confidentiality**)\n- Unintended backend actions and abuse (**availability**)",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/config-desync-mitigation-mode.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/elb-controls.html#elb-14",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/ELB/enable-configure-desync-mitigation-mode.html",
    "https://support.icompaas.com/support/solutions/articles/62000233337-ensure-classic-load-balancer-is-configured-with-defensive-or-strictest-desync-mitigation-mode"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws elb modify-load-balancer-attributes --load-balancer-name <load-balancer-name> --load-balancer-attributes '{\"AdditionalAttributes\":[{\"Key\":\"elb.http.desyncmitigationmode\",\"Value\":\"defensive\"}]}'",
      "NativeIaC": "",
      "Other": "1. Open the AWS Management Console and go to EC2\n2. Under Load Balancing, select Load Balancers\n3. Select your Classic Load Balancer\n4. On the Attributes tab, click Edit\n5. Set Desync mitigation mode to Defensive or Strictest\n6. Click Save changes",
      "Terraform": "```hcl\nresource \"aws_elb\" \"<example_resource_name>\" {\n  name               = \"<example_resource_name>\"\n  availability_zones = [\"<example_az>\"]\n\n  listener {\n    instance_port     = 80\n    instance_protocol = \"http\"\n    lb_port           = 80\n    lb_protocol       = \"http\"\n  }\n\n  desync_mitigation_mode = \"defensive\" # Critical: sets CLB desync mitigation to defensive to pass the check\n}\n```"
    },
    "Recommendation": {
      "Text": "Set CLB desync mitigation to **`defensive`** or, where compatible, **`strictest`**. Validate in staging to avoid client breakage. Apply **defense in depth**: enforce strict header handling, pair with WAF controls, and monitor non-compliant request indicators.",
      "Url": "https://hub.prowler.com/check/elb_desync_mitigation_mode"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: elb_desync_mitigation_mode.py]---
Location: prowler-master/prowler/providers/aws/services/elb/elb_desync_mitigation_mode/elb_desync_mitigation_mode.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.elb.elb_client import elb_client


class elb_desync_mitigation_mode(Check):
    def execute(self):
        findings = []
        for lb in elb_client.loadbalancers.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=lb)
            if (
                lb.desync_mitigation_mode == "defensive"
                or lb.desync_mitigation_mode == "strictest"
            ):
                report.status = "PASS"
                report.status_extended = f"ELB {lb.name} has desync mitigation mode set to {lb.desync_mitigation_mode}."
            else:
                report.status = "FAIL"
                report.status_extended = f"ELB {lb.name} has desync mitigation mode set to {lb.desync_mitigation_mode}, not to strictest or defensive."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
