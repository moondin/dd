---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 284
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 284 of 867)

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

---[FILE: elbv2_nlb_tls_termination_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/elbv2/elbv2_nlb_tls_termination_enabled/elbv2_nlb_tls_termination_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "elbv2_nlb_tls_termination_enabled",
  "CheckTitle": "ELBv2 Network Load Balancer has TLS termination enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/PCI-DSS",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls (USA)"
  ],
  "ServiceName": "elbv2",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsElbv2LoadBalancer",
  "Description": "**Network Load Balancers** with listeners using the `TLS` protocol indicate **TLS termination** at the load balancer. The evaluation identifies NLBs that have at least one `TLS` listener versus those using plain `TCP`/`UDP` or deferring encryption to targets.",
  "Risk": "Lack of NLB-level TLS termination can leave transit data unencrypted or managed inconsistently on instances, undermining **confidentiality** and **integrity**. It also shifts handshake CPU cost to targets, reducing **availability** and making them more susceptible to connection floods and downgrade or weak-cipher exposures.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/elasticloadbalancing/latest/network/listener-update-rules.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/ELBv2/network-load-balancer-listener-security.html#"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws elbv2 create-listener --load-balancer-arn <nlb_arn> --protocol TLS --port 443 --ssl-policy ELBSecurityPolicy-TLS13-1-2-2021-06 --certificates CertificateArn=<certificate_arn> --default-actions Type=forward,TargetGroupArn=<target_group_arn>",
      "NativeIaC": "```yaml\n# CloudFormation: Add a TLS listener to enable TLS termination on the NLB\nResources:\n  \"<example_resource_name>\":\n    Type: AWS::ElasticLoadBalancingV2::Listener\n    Properties:\n      LoadBalancerArn: \"<example_resource_arn>\"\n      Protocol: TLS  # critical: enables TLS termination on the NLB\n      Port: 443\n      SslPolicy: ELBSecurityPolicy-TLS13-1-2-2021-06  # critical: required when Protocol is TLS\n      Certificates:\n        - CertificateArn: \"<example_resource_arn>\"  # critical: server certificate for TLS termination\n      DefaultActions:\n        - Type: forward\n          TargetGroupArn: \"<example_resource_arn>\"\n```",
      "Other": "1. In the AWS Console, go to EC2 > Load Balancers and select your Network Load Balancer\n2. Open the Listeners tab and click Add listener\n3. Set Protocol to TLS and Port to 443\n4. Select an ACM certificate and a security policy\n5. Set Default action to Forward to your target group\n6. Click Save changes",
      "Terraform": "```hcl\n# Terraform: Add a TLS listener to enable TLS termination on the NLB\nresource \"aws_lb_listener\" \"<example_resource_name>\" {\n  load_balancer_arn = \"<example_resource_arn>\"\n  port              = 443\n  protocol          = \"TLS\"  # critical: enables TLS termination\n  ssl_policy        = \"ELBSecurityPolicy-TLS13-1-2-2021-06\"  # critical: required for TLS\n  certificate_arn   = \"<example_resource_arn>\"  # critical: server certificate for TLS termination\n\n  default_action {\n    type             = \"forward\"\n    target_group_arn = \"<example_resource_arn>\"\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **TLS listeners** to terminate client encryption at the NLB and enforce centralized, modern cipher policies and certificate rotation. Apply **defense in depth** by re-encrypting to targets when needed, limit backend access to the NLB, and automate certificate lifecycle with secure storage and monitoring for deprecated protocols.",
      "Url": "https://hub.prowler.com/check/elbv2_nlb_tls_termination_enabled"
    }
  },
  "Categories": [
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: elbv2_nlb_tls_termination_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/elbv2/elbv2_nlb_tls_termination_enabled/elbv2_nlb_tls_termination_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.elbv2.elbv2_client import elbv2_client


class elbv2_nlb_tls_termination_enabled(Check):
    def execute(self):
        findings = []
        for lb in elbv2_client.loadbalancersv2.values():
            if lb.type == "network":
                report = Check_Report_AWS(metadata=self.metadata(), resource=lb)
                report.status = "FAIL"
                report.status_extended = f"ELBv2 NLB {lb.name} is not configured to terminate TLS connections."
                for listener in lb.listeners.values():
                    if listener.protocol == "TLS":
                        report.status = "PASS"
                        report.status_extended = f"ELBv2 NLB {lb.name} is configured to terminate TLS connections."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: elbv2_ssl_listeners.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/elbv2/elbv2_ssl_listeners/elbv2_ssl_listeners.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "elbv2_ssl_listeners",
  "CheckTitle": "ELBv2 Application Load Balancer listeners use HTTPS or redirect HTTP to HTTPS",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Effects/Data Exposure"
  ],
  "ServiceName": "elbv2",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsElbv2LoadBalancer",
  "Description": "**Application Load Balancer listeners** are assessed for **encrypted ingress**: either only `HTTPS` listeners are present, or any `HTTP` listener redirects to `HTTPS`.",
  "Risk": "Exposed `HTTP` paths allow traffic to travel in plaintext, enabling interception, credential theft, session hijacking, and response tampering. This weakens confidentiality and integrity and makes **MITM** on public or shared networks feasible.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/elb-controls.html#elb-1",
    "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws elbv2 modify-listener --listener-arn <listener_arn> --default-actions '[{\"Type\":\"redirect\",\"RedirectConfig\":{\"Protocol\":\"HTTPS\",\"Port\":\"443\",\"StatusCode\":\"HTTP_301\"}}]'",
      "NativeIaC": "```yaml\n# CloudFormation: Redirect HTTP listener to HTTPS\nResources:\n  <example_resource_name>:\n    Type: AWS::ElasticLoadBalancingV2::Listener\n    Properties:\n      LoadBalancerArn: <example_resource_id>\n      Protocol: HTTP\n      Port: 80\n      DefaultActions:\n        - Type: redirect\n          RedirectConfig:\n            Protocol: HTTPS  # Critical: redirect HTTP to HTTPS\n            Port: '443'      # Critical: target HTTPS port\n            StatusCode: HTTP_301  # Critical: enforce redirect\n```",
      "Other": "1. Open the EC2 console and go to Load Balancers\n2. Select the Application Load Balancer and open the Listeners tab\n3. Select the HTTP:80 listener and choose Edit (or View/edit rules)\n4. Set the default action to Redirect to, Protocol: HTTPS, Port: 443, Status code: HTTP_301\n5. Save changes",
      "Terraform": "```hcl\n# Terraform: Redirect HTTP listener to HTTPS\nresource \"aws_lb_listener\" \"<example_resource_name>\" {\n  load_balancer_arn = \"<example_resource_id>\"\n  protocol          = \"HTTP\"\n  port              = 80\n\n  default_action {\n    type = \"redirect\"\n    redirect {\n      protocol   = \"HTTPS\"   # Critical: redirect to HTTPS\n      port       = \"443\"     # Critical: target HTTPS port\n      status_code = \"HTTP_301\" # Critical: enforce redirect\n    }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enforce **TLS everywhere**: use `HTTPS` listeners and make all `HTTP` listeners redirect to `HTTPS` only. Do not forward plaintext. Apply **defense in depth** with strong TLS policies and managed certificates, and consider `HSTS` to prevent users from reaching `http`.",
      "Url": "https://hub.prowler.com/check/elbv2_ssl_listeners"
    }
  },
  "Categories": [
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: elbv2_ssl_listeners.py]---
Location: prowler-master/prowler/providers/aws/services/elbv2/elbv2_ssl_listeners/elbv2_ssl_listeners.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.elbv2.elbv2_client import elbv2_client


class elbv2_ssl_listeners(Check):
    def execute(self):
        findings = []
        for lb in elbv2_client.loadbalancersv2.values():
            if lb.type == "application":
                report = Check_Report_AWS(metadata=self.metadata(), resource=lb)
                report.status = "PASS"
                report.status_extended = (
                    f"ELBv2 ALB {lb.name} has HTTPS listeners only."
                )
                for listener in lb.listeners.values():
                    if listener.protocol == "HTTP":
                        report.status = "FAIL"
                        report.status_extended = (
                            f"ELBv2 ALB {lb.name} has non-encrypted listeners."
                        )
                        # Check if it redirects HTTP to HTTPS
                        for rule in listener.rules:
                            for action in rule.actions:
                                if (
                                    action["Type"] == "redirect"
                                    and action["RedirectConfig"]["Protocol"] == "HTTPS"
                                ):
                                    report.status = "PASS"
                                    report.status_extended = f"ELBv2 ALB {lb.name} has HTTP listener but it redirects to HTTPS."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: elbv2_waf_acl_attached.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/elbv2/elbv2_waf_acl_attached/elbv2_waf_acl_attached.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "elbv2_waf_acl_attached",
  "CheckTitle": "Application Load Balancer has a WAF Web ACL attached",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "TTPs/Initial Access"
  ],
  "ServiceName": "elbv2",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsElbv2LoadBalancer",
  "Description": "Application Load Balancers are evaluated for an associated **AWS WAF web ACL** that governs HTTP(S) requests. The evaluation detects ALBs missing a web ACL and recognizes associations from **WAFv2** or regional **WAF Classic**.",
  "Risk": "Absent a **WAF web ACL**, ALBs accept unfiltered Layer 7 traffic, enabling:\n- **Injection** (SQLi/XSS) harming confidentiality and integrity\n- **Credential stuffing** and **bot abuse**\n- **Resource exhaustion** degrading availability",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/waf/latest/developerguide/web-acl-associating-aws-resource.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws wafv2 associate-web-acl --web-acl-arn <WEB_ACL_ARN> --resource-arn <ALB_ARN>",
      "NativeIaC": "```yaml\n# CloudFormation: associate an existing WAFv2 Web ACL to an ALB\nResources:\n  <example_resource_name>:\n    Type: AWS::WAFv2::WebACLAssociation\n    Properties:\n      ResourceArn: <example_resource_id>  # CRITICAL: ALB ARN to protect\n      WebACLArn: <example_resource_id>    # CRITICAL: WAFv2 Web ACL ARN to attach\n```",
      "Other": "1. In the AWS Console, open **WAF & Shield**\n2. Go to **Web ACLs** and select your regional Web ACL\n3. Click **Associated AWS resources** > **Associate resource**\n4. Select the target **Application Load Balancer** and click **Associate**",
      "Terraform": "```hcl\n# Associate WAFv2 Web ACL with an ALB\nresource \"aws_wafv2_web_acl_association\" \"<example_resource_name>\" {\n  resource_arn = \"<example_resource_id>\" # CRITICAL: ALB ARN\n  web_acl_arn  = \"<example_resource_id>\" # CRITICAL: WAFv2 Web ACL ARN\n}\n```"
    },
    "Recommendation": {
      "Text": "Associate a **WAF web ACL** with each ALB as **defense in depth**. Use managed and custom rules, IP reputation lists, and rate limiting to block attacks. Continuously tune policies and monitor logs. *Apply least privilege* by scoping rules to required paths, methods, and sources.",
      "Url": "https://hub.prowler.com/check/elbv2_waf_acl_attached"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: elbv2_waf_acl_attached.py]---
Location: prowler-master/prowler/providers/aws/services/elbv2/elbv2_waf_acl_attached/elbv2_waf_acl_attached.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.elbv2.elbv2_client import elbv2_client
from prowler.providers.aws.services.waf.wafregional_client import wafregional_client
from prowler.providers.aws.services.wafv2.wafv2_client import wafv2_client


class elbv2_waf_acl_attached(Check):
    def execute(self):
        findings = []
        for lb in elbv2_client.loadbalancersv2.values():
            if lb.type == "application":
                report = Check_Report_AWS(metadata=self.metadata(), resource=lb)
                report.status = "FAIL"
                report.status_extended = (
                    f"ELBv2 ALB {lb.name} is not protected by WAF Web ACL."
                )
                for acl in wafv2_client.web_acls.values():
                    if lb.arn in acl.albs:
                        report.status = "PASS"
                        report.status_extended = f"ELBv2 ALB {lb.name} is protected by WAFv2 Web ACL {acl.name}."
                for acl in wafregional_client.web_acls.values():
                    if lb.arn in acl.albs:
                        report.status = "PASS"
                        report.status_extended = f"ELBv2 ALB {lb.name} is protected by WAFv1 Web ACL {acl.name}."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: emr_client.py]---
Location: prowler-master/prowler/providers/aws/services/emr/emr_client.py

```python
from prowler.providers.aws.services.emr.emr_service import EMR
from prowler.providers.common.provider import Provider

emr_client = EMR(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: emr_service.py]---
Location: prowler-master/prowler/providers/aws/services/emr/emr_service.py
Signals: Pydantic

```python
from enum import Enum
from typing import Optional

from botocore.client import ClientError
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class EMR(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.clusters = {}
        self.block_public_access_configuration = {}
        self.__threading_call__(self._list_clusters)
        self.__threading_call__(self._describe_cluster)
        self.__threading_call__(self._get_block_public_access_configuration)

    def _get_cluster_arn_template(self, region):
        return f"arn:{self.audited_partition}:elasticmapreduce:{region}:{self.audited_account}:cluster"

    def _list_clusters(self, regional_client):
        logger.info("EMR - Listing Clusters...")
        try:
            list_clusters_paginator = regional_client.get_paginator("list_clusters")
            for page in list_clusters_paginator.paginate():
                for cluster in page["Clusters"]:
                    if not self.audit_resources or (
                        is_resource_filtered(
                            cluster["ClusterArn"], self.audit_resources
                        )
                    ):
                        cluster_name = cluster["Name"]
                        cluster_id = cluster["Id"]
                        cluster_arn = cluster["ClusterArn"]
                        cluster_status = cluster["Status"]["State"]

                        self.clusters[cluster_id] = Cluster(
                            id=cluster_id,
                            name=cluster_name,
                            arn=cluster_arn,
                            status=cluster_status,
                            region=regional_client.region,
                        )

        except Exception as error:
            logger.error(
                f"{regional_client.region} --"
                f" {error.__class__.__name__}[{error.__traceback__.tb_lineno}]:"
                f" {error}"
            )

    def _describe_cluster(self, regional_client):
        logger.info("EMR - Describing Clusters...")
        try:
            for cluster in self.clusters.values():
                if cluster.region == regional_client.region:
                    try:
                        describe_cluster_parameters = {"ClusterId": cluster.id}
                        cluster_info = regional_client.describe_cluster(
                            **describe_cluster_parameters
                        )
                    except ClientError as error:
                        if error.response["Error"]["Code"] == "InvalidRequestException":
                            logger.warning(
                                f"{regional_client.region} --"
                                f" {error.__class__.__name__}[{error.__traceback__.tb_lineno}]:"
                                f" {error}"
                            )
                        continue

                    # Master Node Security Groups
                    master_node_security_group = cluster_info["Cluster"][
                        "Ec2InstanceAttributes"
                    ].get("EmrManagedMasterSecurityGroup")
                    master_node_additional_security_groups = None
                    if (
                        "AdditionalMasterSecurityGroups"
                        in cluster_info["Cluster"]["Ec2InstanceAttributes"]
                    ):
                        master_node_additional_security_groups = cluster_info[
                            "Cluster"
                        ]["Ec2InstanceAttributes"]["AdditionalMasterSecurityGroups"]
                    self.clusters[cluster.id].master = Node(
                        security_group_id=master_node_security_group,
                        additional_security_groups_id=master_node_additional_security_groups,
                    )

                    # Slave Node Security Groups
                    slave_node_security_group = cluster_info["Cluster"][
                        "Ec2InstanceAttributes"
                    ].get("EmrManagedSlaveSecurityGroup")
                    slave_node_additional_security_groups = []
                    if (
                        "AdditionalSlaveSecurityGroups"
                        in cluster_info["Cluster"]["Ec2InstanceAttributes"]
                    ):
                        slave_node_additional_security_groups = cluster_info["Cluster"][
                            "Ec2InstanceAttributes"
                        ]["AdditionalSlaveSecurityGroups"]
                    self.clusters[cluster.id].slave = Node(
                        security_group_id=slave_node_security_group,
                        additional_security_groups_id=slave_node_additional_security_groups,
                    )

                    # Save MasterPublicDnsName
                    master_public_dns_name = cluster_info["Cluster"].get(
                        "MasterPublicDnsName"
                    )
                    self.clusters[cluster.id].master_public_dns_name = (
                        master_public_dns_name
                    )
                    # Set cluster Public/Private
                    # Public EMR cluster have their DNS ending with .amazonaws.com
                    # while private ones have format of ip-xxx-xx-xx.us-east-1.compute.internal.
                    if (
                        master_public_dns_name
                        and ".amazonaws.com" in master_public_dns_name
                    ):
                        self.clusters[cluster.id].public = True
                    cluster.tags = cluster_info["Cluster"].get("Tags")

        except Exception as error:
            logger.error(
                f"{regional_client.region} --"
                f" {error.__class__.__name__}[{error.__traceback__.tb_lineno}]:"
                f" {error}"
            )

    def _get_block_public_access_configuration(self, regional_client):
        """Returns the Amazon EMR block public access configuration for your Amazon Web Services account in the current Region."""
        logger.info("EMR - Getting Block Public Access Configuration...")
        try:
            block_public_access_configuration = (
                regional_client.get_block_public_access_configuration()
            )

            self.block_public_access_configuration[regional_client.region] = (
                BlockPublicAccessConfiguration(
                    block_public_security_group_rules=block_public_access_configuration[
                        "BlockPublicAccessConfiguration"
                    ]["BlockPublicSecurityGroupRules"]
                )
            )
        except Exception as error:
            logger.error(
                f"{regional_client.region} --"
                f" {error.__class__.__name__}[{error.__traceback__.tb_lineno}]:"
                f" {error}"
            )


class BlockPublicAccessConfiguration(BaseModel):
    block_public_security_group_rules: bool


class ClusterStatus(Enum):
    STARTING = "STARTING"
    BOOTSTRAPPING = "BOOTSTRAPPING"
    RUNNING = "RUNNING"
    WAITING = "WAITING"
    TERMINATING = "TERMINATING"
    TERMINATED = "TERMINATED"
    TERMINATED_WITH_ERRORS = "TERMINATED_WITH_ERRORS"


class Node(BaseModel):
    security_group_id: Optional[str] = ""
    additional_security_groups_id: Optional[list[str]] = []


class Cluster(BaseModel):
    id: str
    name: str
    status: ClusterStatus
    arn: str
    region: str
    master: Node = Node()
    slave: Node = Node()
    master_public_dns_name: str = ""
    public: bool = False
    tags: Optional[list] = []
```

--------------------------------------------------------------------------------

---[FILE: emr_cluster_account_public_block_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/emr/emr_cluster_account_public_block_enabled/emr_cluster_account_public_block_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "emr_cluster_account_public_block_enabled",
  "CheckTitle": "EMR account has Block Public Access enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "emr",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Other",
  "Description": "Amazon EMR account-level **Block Public Access** configuration is assessed per Region. When `BlockPublicSecurityGroupRules` is enabled, clusters cannot use security groups that allow inbound public sources (`0.0.0.0/0`, `::/0`) except on permitted ports.",
  "Risk": "Public EMR-facing rules enable Internet reachability to cluster nodes and UIs, inviting brute force and remote exploits.\n\nAttackers can exfiltrate job data, alter processing, or pivot into the VPC, degrading **confidentiality**, **integrity**, and **availability** through data theft, tampering, and service disruption.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/EMR/block-public-access.html",
    "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-block-public-access.html",
    "https://github.com/cloudmatos/matos/tree/master/remediations/aws/emr/block-emr-public-access"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws emr put-block-public-access-configuration --block-public-access-configuration BlockPublicSecurityGroupRules=true",
      "NativeIaC": "```yaml\n# CloudFormation: Enable EMR Block Public Access (account/Region level)\nResources:\n  EmrBpaRole:\n    Type: AWS::IAM::Role\n    Properties:\n      AssumeRolePolicyDocument:\n        Version: '2012-10-17'\n        Statement:\n          - Effect: Allow\n            Principal:\n              Service: lambda.amazonaws.com\n            Action: sts:AssumeRole\n      Policies:\n        - PolicyName: EmrBpaPut\n          PolicyDocument:\n            Version: '2012-10-17'\n            Statement:\n              - Effect: Allow\n                Action: elasticmapreduce:PutBlockPublicAccessConfiguration\n                Resource: \"*\"\n\n  EmrBpaFunction:\n    Type: AWS::Lambda::Function\n    Properties:\n      Role: !GetAtt EmrBpaRole.Arn\n      Runtime: python3.12\n      Handler: index.handler\n      Code:\n        ZipFile: |\n          import boto3, json, urllib.request\n          def handler(event, context):\n              try:\n                  boto3.client('emr').put_block_public_access_configuration(\n                      BlockPublicAccessConfiguration={\n                          'BlockPublicSecurityGroupRules': True  # CRITICAL: enables EMR Block Public Access\n                      }\n                  )\n                  status='SUCCESS'\n              except Exception:\n                  status='FAILED'\n              body=json.dumps({\n                  'Status': status,\n                  'PhysicalResourceId': 'EmrBPA',  # respond to CFN\n                  'StackId': event['StackId'],\n                  'RequestId': event['RequestId'],\n                  'LogicalResourceId': event['LogicalResourceId']\n              }).encode()\n              req=urllib.request.Request(event['ResponseURL'], data=body, method='PUT')\n              req.add_header('content-type','')\n              req.add_header('content-length',str(len(body)))\n              urllib.request.urlopen(req)\n\n  EmrBpa:\n    Type: Custom::EmrBpa\n    Properties:\n      ServiceToken: !GetAtt EmrBpaFunction.Arn  # Invokes Lambda to apply the setting\n```",
      "Other": "1. In the AWS Console, go to Amazon EMR\n2. Select the target Region (top-right)\n3. In the left menu under \"EMR on EC2\", click \"Block public access\"\n4. Click \"Edit\" and choose \"Turn on\"\n5. Click \"Save\"",
      "Terraform": "```hcl\n# Enable EMR Block Public Access (account/Region level)\nresource \"aws_emr_block_public_access_configuration\" \"example_resource_name\" {\n  block_public_security_group_rules = true  # CRITICAL: enables Block Public Access\n}\n```"
    },
    "Recommendation": {
      "Text": "Keep EMR **Block Public Access** enabled and minimize exceptions; allow only required ports and restrict sources.\n\nApply **least privilege** on security groups, place clusters in private subnets, and use bastion hosts or Session Manager. Combine with **VPC** controls and monitoring for **defense in depth**.",
      "Url": "https://hub.prowler.com/check/emr_cluster_account_public_block_enabled"
    }
  },
  "Categories": [
    "internet-exposed"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: emr_cluster_account_public_block_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/emr/emr_cluster_account_public_block_enabled/emr_cluster_account_public_block_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.emr.emr_client import emr_client


class emr_cluster_account_public_block_enabled(Check):
    def execute(self):
        findings = []
        for region in emr_client.block_public_access_configuration:
            report = Check_Report_AWS(
                metadata=self.metadata(),
                resource=emr_client.block_public_access_configuration,
            )
            report.region = region
            report.resource_id = emr_client.audited_account
            report.resource_arn = emr_client._get_cluster_arn_template(region)
            if emr_client.block_public_access_configuration[
                region
            ].block_public_security_group_rules:
                report.status = "PASS"
                report.status_extended = "EMR Account has Block Public Access enabled."
            else:
                report.status = "FAIL"
                report.status_extended = "EMR Account has Block Public Access disabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: emr_cluster_master_nodes_no_public_ip.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/emr/emr_cluster_master_nodes_no_public_ip/emr_cluster_master_nodes_no_public_ip.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "emr_cluster_master_nodes_no_public_ip",
  "CheckTitle": "EMR Cluster without Public IP.",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "TTPs/Initial Access"
  ],
  "ServiceName": "emr",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**Amazon EMR clusters** in non-terminated states are assessed for **public IP assignment** on cluster nodes (primary and workers). The finding identifies clusters whose instances are reachable via public IPs rather than private VPC addresses.",
  "Risk": "**Publicly reachable EMR nodes** expose admin UIs and SSH to the Internet, enabling brute force and service exploits. A compromised primary node can alter jobs and exfiltrate data from S3/HDFS, degrading **confidentiality** and **integrity**, and disrupt workloads, impacting **availability**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-plan-vpc-subnet.html",
    "https://aws.amazon.com/blogs/aws/new-launch-amazon-emr-clusters-in-private-subnets/",
    "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-block-public-access.html",
    "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-clusters-in-a-vpc.html",
    "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-vpc-launching-job-flows.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: Launch EMR in a private subnet (no public IPs)\nResources:\n  <example_resource_name>:\n    Type: AWS::EMR::Cluster\n    Properties:\n      Name: <example_resource_name>\n      ReleaseLabel: emr-6.10.0\n      ServiceRole: EMR_DefaultRole\n      JobFlowRole: EMR_EC2_DefaultRole\n      Instances:\n        Ec2SubnetId: <example_resource_id>  # CRITICAL: use a PRIVATE subnet to prevent public IPs\n        InstanceGroups:\n          - InstanceRole: MASTER\n            InstanceType: m5.xlarge\n            InstanceCount: 1\n          - InstanceRole: CORE\n            InstanceType: m5.xlarge\n            InstanceCount: 1\n```",
      "Other": "1. In the AWS Console, go to EMR > Clusters, select the non-compliant cluster (with Public IP) and choose Terminate.\n2. Click Create cluster.\n3. Under Networking, select your VPC and choose a private Subnet (no auto-assign public IPv4).\n4. Create the cluster. Its instances will launch without public IPs.",
      "Terraform": "```hcl\n# Terraform: Launch EMR in a private subnet (no public IPs)\nresource \"aws_emr_cluster\" \"<example_resource_name>\" {\n  name                = \"<example_resource_name>\"\n  release_label       = \"emr-6.10.0\"\n  master_instance_type = \"m5.xlarge\"\n  core_instance_type   = \"m5.xlarge\"\n\n  service_role = \"EMR_DefaultRole\"\n  ec2_attributes {\n    instance_profile = \"EMR_EC2_DefaultRole\"\n    subnet_id        = \"<example_resource_id>\"  # CRITICAL: private subnet ensures no public IPs\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Run EMR in **private subnets** without public IPs. Use **VPC endpoints** for AWS services and **NAT** only when needed. Enforce **least privilege** security groups, avoid `0.0.0.0/0`, and prefer **SSM** or a bastion for admin access. Keep **EMR block public access** enabled and favor **private connectivity** for external dependencies.",
      "Url": "https://hub.prowler.com/check/emr_cluster_master_nodes_no_public_ip"
    }
  },
  "Categories": [
    "internet-exposed"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: emr_cluster_master_nodes_no_public_ip.py]---
Location: prowler-master/prowler/providers/aws/services/emr/emr_cluster_master_nodes_no_public_ip/emr_cluster_master_nodes_no_public_ip.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.emr.emr_client import emr_client
from prowler.providers.aws.services.emr.emr_service import ClusterStatus


class emr_cluster_master_nodes_no_public_ip(Check):
    def execute(self):
        findings = []
        for cluster in emr_client.clusters.values():
            if cluster.status not in (
                ClusterStatus.TERMINATED,
                ClusterStatus.TERMINATED_WITH_ERRORS,
            ):
                report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
                if cluster.public:
                    report.status = "FAIL"
                    report.status_extended = (
                        f"EMR Cluster {cluster.id} has a Public IP."
                    )
                else:
                    report.status = "PASS"
                    report.status_extended = (
                        f"EMR Cluster {cluster.id} does not have a Public IP."
                    )

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: emr_cluster_publicly_accesible.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/emr/emr_cluster_publicly_accesible/emr_cluster_publicly_accesible.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "emr_cluster_publicly_accesible",
  "CheckTitle": "EMR cluster is not publicly accessible",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "TTPs/Initial Access"
  ],
  "ServiceName": "emr",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**Amazon EMR clusters** are assessed for **public network exposure** by examining master and core/task node security groups for inbound rules that allow any source (`0.0.0.0/0` or `::/0`).\n\nOnly active clusters are considered, and findings identify exposure via the specific security groups attached to the cluster nodes.",
  "Risk": "**Open Internet ingress** to EMR nodes enables direct access to services and UIs, facilitating brute force, RCE, and data theft. Adversaries can pivot inside the VPC, alter jobs and outputs (**integrity**), exfiltrate datasets (**confidentiality**), or abuse compute for mining, degrading **availability**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-block-public-access.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: Security Group without public ingress for EMR nodes\nResources:\n  <example_resource_name>:\n    Type: AWS::EC2::SecurityGroup\n    Properties:\n      GroupDescription: SG for EMR without public access\n      VpcId: <example_resource_id>\n      SecurityGroupIngress:\n        - IpProtocol: tcp\n          FromPort: 22\n          ToPort: 22\n          CidrIp: 10.0.0.0/8  # CRITICAL: restrict source; do not use 0.0.0.0/0 or ::/0 to avoid public access\n```",
      "Other": "1. In AWS Console, go to EMR > Clusters and open the affected cluster\n2. In the cluster details, note the Security Groups for Master and Core/Task under Network and security\n3. Open the EC2 Console > Security Groups and select each noted group\n4. Edit Inbound rules and remove any rule with Source 0.0.0.0/0 or ::/0\n5. If access is required, re-add only from specific CIDR(s) you control, then Save",
      "Terraform": "```hcl\n# Restrict EMR SG ingress to avoid 0.0.0.0/0 or ::/0\nresource \"aws_security_group_rule\" \"<example_resource_name>\" {\n  type              = \"ingress\"\n  from_port         = 22\n  to_port           = 22\n  protocol          = \"tcp\"\n  security_group_id = \"<example_resource_id>\"  # EMR master/core SG\n  cidr_blocks       = [\"10.0.0.0/8\"]           # CRITICAL: restrict source; not 0.0.0.0/0 or ::/0\n}\n```"
    },
    "Recommendation": {
      "Text": "Apply **least privilege** and **defense in depth**:\n- Place clusters in private subnets; avoid public IPs\n- Deny `0.0.0.0/0` and `::/0` in node security groups; allow trusted CIDRs only\n- Keep EMR **Block Public Access** enabled with minimal exceptions\n- Use **bastion/SSM**, private connectivity, and logging for hardened access",
      "Url": "https://hub.prowler.com/check/emr_cluster_publicly_accesible"
    }
  },
  "Categories": [
    "internet-exposed"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

````
