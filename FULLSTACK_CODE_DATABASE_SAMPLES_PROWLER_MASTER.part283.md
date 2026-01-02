---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 283
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 283 of 867)

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

---[FILE: elbv2_cross_zone_load_balancing_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/elbv2/elbv2_cross_zone_load_balancing_enabled/elbv2_cross_zone_load_balancing_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "elbv2_cross_zone_load_balancing_enabled",
  "CheckTitle": "ELBv2 Network or Gateway Load Balancer has cross-zone load balancing enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "elbv2",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsElbv2LoadBalancer",
  "Description": "**Network and Gateway Load Balancers** have **cross-zone load balancing** enabled (`load_balancing.cross_zone.enabled`), so each node distributes requests to targets in all enabled Availability Zones rather than only its own.",
  "Risk": "Without cross-zone distribution, traffic can concentrate in one zone, degrading **availability** through target saturation, uneven failover, and connection drops. Zonal impairment can cause partial outages and increase **latency** under load.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/ELBv2/enable-cross-zone-load-balancing.html#",
    "https://docs.aws.amazon.com/elasticloadbalancing/latest/network/network-load-balancers.html#cross-zone-load-balancing"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws elbv2 modify-load-balancer-attributes --load-balancer-arn <load-balancer-arn> --attributes Key=load_balancing.cross_zone.enabled,Value=true",
      "NativeIaC": "```yaml\nResources:\n  <example_resource_name>:\n    Type: AWS::ElasticLoadBalancingV2::LoadBalancer\n    Properties:\n      Type: network\n      Subnets:\n        - <subnet-id-1>\n        - <subnet-id-2>\n      LoadBalancerAttributes:\n        - Key: load_balancing.cross_zone.enabled  # Critical: enable cross-zone load balancing\n          Value: true  # Ensures the check passes for NLB/GLB\n```",
      "Other": "1. Open the AWS EC2 console and go to Load Balancers\n2. Select your Network or Gateway Load Balancer\n3. Choose the Attributes tab > Edit attributes\n4. Turn on Cross-zone load balancing\n5. Save changes",
      "Terraform": "```hcl\nresource \"aws_lb\" \"<example_resource_name>\" {\n  load_balancer_type = \"network\"\n  subnets            = [\"<subnet-id-1>\", \"<subnet-id-2>\"]\n  enable_cross_zone_load_balancing = true  # Critical: enable cross-zone load balancing\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **cross-zone load balancing** to spread load across zones and design for AZ redundancy.\n\n- Balance capacity per AZ and use health-based routing\n- Avoid single-AZ dependencies and sticky designs\n- Monitor zonal health to sustain **fault tolerance**",
      "Url": "https://hub.prowler.com/check/elbv2_cross_zone_load_balancing_enabled"
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

---[FILE: elbv2_cross_zone_load_balancing_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/elbv2/elbv2_cross_zone_load_balancing_enabled/elbv2_cross_zone_load_balancing_enabled.py

```python
from typing import List

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.elbv2.elbv2_client import elbv2_client


class elbv2_cross_zone_load_balancing_enabled(Check):
    def execute(self) -> List[Check_Report_AWS]:
        findings = []
        for lb in elbv2_client.loadbalancersv2.values():
            if lb.type != "application":
                report = Check_Report_AWS(metadata=self.metadata(), resource=lb)
                report.status = "FAIL"
                report.status_extended = (
                    f"ELBv2 {lb.name} does not have cross-zone load balancing enabled."
                )
                if lb.cross_zone_load_balancing == "true":
                    report.status = "PASS"
                    report.status_extended = (
                        f"ELBv2 {lb.name} has cross-zone load balancing enabled."
                    )

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: elbv2_deletion_protection.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/elbv2/elbv2_deletion_protection/elbv2_deletion_protection.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "elbv2_deletion_protection",
  "CheckTitle": "ELBv2 load balancer has deletion protection enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Effects/Denial of Service"
  ],
  "ServiceName": "elbv2",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsElbv2LoadBalancer",
  "Description": "**ELBv2 load balancers** with **deletion protection** (`deletion_protection.enabled`) are resistant to deletion through standard APIs.\n\nThe assessment determines whether this attribute is enabled on each load balancer.",
  "Risk": "Without **deletion protection**, a user or automated process can delete the load balancer, cutting off service endpoints and breaking routing, harming **availability**.\n\nMalicious or mistaken deletes enable **DoS**, disrupt blue/green rollbacks, and increase incident recovery time.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/application-load-balancers.html#deletion-protection",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/ELBv2/deletion-protection.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws elbv2 modify-load-balancer-attributes --load-balancer-arn <lb_arn> --attributes Key=deletion_protection.enabled,Value=true",
      "NativeIaC": "```yaml\nResources:\n  <example_resource_name>:\n    Type: AWS::ElasticLoadBalancingV2::LoadBalancer\n    Properties:\n      Subnets:\n        - <example_subnet_id_1>\n        - <example_subnet_id_2>\n      LoadBalancerAttributes:\n        - Key: deletion_protection.enabled  # Critical: enable deletion protection\n          Value: \"true\"                   # Ensures the LB cannot be deleted accidentally\n```",
      "Other": "1. In the AWS Console, go to EC2 > Load Balancers (under Load Balancing)\n2. Select the target load balancer\n3. Open the Attributes tab and click Edit attributes\n4. Enable Deletion protection\n5. Click Save changes",
      "Terraform": "```hcl\nresource \"aws_lb\" \"<example_resource_name>\" {\n  subnets = [\"<example_subnet_id_1>\", \"<example_subnet_id_2>\"]\n\n  enable_deletion_protection = true # Critical: enables deletion protection to pass the check\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **deletion protection** for production and other critical load balancers.\n\nEnforce **least privilege** to restrict delete actions, apply governance (tags and policy guardrails) for protected assets, and require **change control** with approvals. *For pipelines*, add checks that block deletion of protected resources.",
      "Url": "https://hub.prowler.com/check/elbv2_deletion_protection"
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

---[FILE: elbv2_deletion_protection.py]---
Location: prowler-master/prowler/providers/aws/services/elbv2/elbv2_deletion_protection/elbv2_deletion_protection.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.elbv2.elbv2_client import elbv2_client


class elbv2_deletion_protection(Check):
    def execute(self):
        findings = []
        for lb in elbv2_client.loadbalancersv2.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=lb)
            report.status = "FAIL"
            report.status_extended = (
                f"ELBv2 {lb.name} does not have deletion protection enabled."
            )
            if lb.deletion_protection == "true":
                report.status = "PASS"
                report.status_extended = (
                    f"ELBv2 {lb.name} has deletion protection enabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: elbv2_desync_mitigation_mode.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/elbv2/elbv2_desync_mitigation_mode/elbv2_desync_mitigation_mode.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "elbv2_desync_mitigation_mode",
  "CheckTitle": "Application Load Balancer has desync mitigation mode set to strictest or defensive, or drops invalid header fields",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "TTPs/Initial Access",
    "Effects/Data Exposure"
  ],
  "ServiceName": "elbv2",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsElbv2LoadBalancer",
  "Description": "**Application Load Balancer** settings are reviewed for **HTTP desync protections**. It evaluates `routing.http.desync_mitigation_mode` for `strictest` or `defensive`; when neither is configured, it checks `routing.http.drop_invalid_header_fields.enabled` is `true` as a compensating control.",
  "Risk": "Lacking robust desync mitigation enables inconsistent HTTP parsing and **request smuggling**:\n- **Confidentiality**: token theft, data exfiltration\n- **Integrity**: cache/queue poisoning, unauthorized actions\n- **Availability**: backend exhaustion and outages\n\nOnly dropping invalid headers reduces but does not eliminate this exposure.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/elb-controls.html#elb-12",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/ELBv2/drop-invalid-header-fields-enabled.html",
    "https://support.icompaas.com/support/solutions/articles/62000233515-ensure-the-application-load-balancer-is-configured-with-strictest-desync-mitigation-mode",
    "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/application-load-balancers.html#desync-mitigation-mode"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws elbv2 modify-load-balancer-attributes --load-balancer-arn <ALB_ARN> --attributes Key=routing.http.desync_mitigation_mode,Value=strictest",
      "NativeIaC": "```yaml\n# CloudFormation: Set ALB desync mitigation mode\nResources:\n  <example_resource_name>:\n    Type: AWS::ElasticLoadBalancingV2::LoadBalancer\n    Properties:\n      Type: application\n      Subnets:\n        - <example_subnet_id1>\n        - <example_subnet_id2>\n      LoadBalancerAttributes:\n        - Key: routing.http.desync_mitigation_mode  # Critical: enforce strictest/defensive desync mitigation to pass the check\n          Value: strictest\n```",
      "Other": "1. Open the AWS Console and go to EC2 > Load Balancers\n2. Select your Application Load Balancer\n3. Choose Actions > Edit attributes (or the Attributes tab > Edit)\n4. Set Desync mitigation mode to Strictest (or Defensive)\n5. Save changes",
      "Terraform": "```hcl\n# Terraform: Set ALB desync mitigation mode\nresource \"aws_lb\" \"<example_resource_name>\" {\n  name    = \"<example_resource_name>\"\n  subnets = [\"<example_subnet_id1>\", \"<example_subnet_id2>\"]\n\n  desync_mitigation_mode = \"strictest\" # Critical: enforce strictest/defensive desync mitigation to pass the check\n}\n```"
    },
    "Recommendation": {
      "Text": "Set ALBs to `desync_mitigation_mode`=`strictest` (*or* `defensive` if compatibility is required) and keep `routing.http.drop_invalid_header_fields.enabled`=`true`.\n\nApply **defense in depth**: validate RFC-compliant requests, roll out changes gradually with monitoring, and enforce **least privilege** on downstream services.",
      "Url": "https://hub.prowler.com/check/elbv2_desync_mitigation_mode"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: elbv2_desync_mitigation_mode.py]---
Location: prowler-master/prowler/providers/aws/services/elbv2/elbv2_desync_mitigation_mode/elbv2_desync_mitigation_mode.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.elbv2.elbv2_client import elbv2_client


class elbv2_desync_mitigation_mode(Check):
    def execute(self):
        findings = []
        for lb in elbv2_client.loadbalancersv2.values():
            if lb.type == "application":
                report = Check_Report_AWS(metadata=self.metadata(), resource=lb)
                report.status = "PASS"
                report.status_extended = f"ELBv2 ALB {lb.name} is configured with correct desync mitigation mode."
                if (
                    lb.desync_mitigation_mode != "strictest"
                    and lb.desync_mitigation_mode != "defensive"
                ):
                    if lb.drop_invalid_header_fields == "false":
                        report.status = "FAIL"
                        report.status_extended = f"ELBv2 ALB {lb.name} does not have desync mitigation mode set as strictest/defensive and is not dropping invalid header fields."
                    elif lb.drop_invalid_header_fields == "true":
                        report.status_extended = f"ELBv2 ALB {lb.name} does not have desync mitigation mode set as strictest/defensive but is dropping invalid header fields."
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: elbv2_insecure_ssl_ciphers.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/elbv2/elbv2_insecure_ssl_ciphers/elbv2_insecure_ssl_ciphers.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "elbv2_insecure_ssl_ciphers",
  "CheckTitle": "ELBv2 load balancer uses a secure SSL policy on HTTPS listeners",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark",
    "Software and Configuration Checks/Industry and Regulatory Standards/PCI-DSS"
  ],
  "ServiceName": "elbv2",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsElbv2LoadBalancer",
  "Description": "**ELBv2 HTTPS listeners** are assessed for use of **strong TLS policies**. Listeners whose `ssl_policy` is not in the approved set (TLS 1.2/1.3-focused policies) may include weak protocols or ciphers.",
  "Risk": "Legacy or weak ciphers enable **downgrade** and **man-in-the-middle** attacks, allowing decryption of sessions, credential theft, and request tampering. This undermines **confidentiality** and **integrity** of data in transit and can expose cookies or tokens for **account takeover**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html#describe-ssl-policies",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/ELBv2/security-policy.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws elbv2 modify-listener --listener-arn <listener_arn> --ssl-policy ELBSecurityPolicy-TLS13-1-2-2021-06",
      "NativeIaC": "```yaml\n# CloudFormation: Set a secure SSL policy on an HTTPS listener\nResources:\n  <example_resource_name>:\n    Type: AWS::ElasticLoadBalancingV2::Listener\n    Properties:\n      LoadBalancerArn: <example_resource_arn>\n      Protocol: HTTPS\n      Port: 443\n      DefaultActions:\n        - Type: forward\n          TargetGroupArn: <example_resource_arn>\n      Certificates:\n        - CertificateArn: <example_certificate_arn>\n      SslPolicy: ELBSecurityPolicy-TLS13-1-2-2021-06  # FIX: uses an approved secure policy to eliminate insecure ciphers\n```",
      "Other": "1. In the AWS Console, go to EC2 > Load Balancers\n2. Select the load balancer and open the Listeners tab\n3. Select the HTTPS listener and choose Edit\n4. Set Security policy to ELBSecurityPolicy-TLS13-1-2-2021-06 (or any approved policy)\n5. Save changes",
      "Terraform": "```hcl\n# Terraform: Ensure HTTPS listener uses a secure SSL policy\nresource \"aws_lb_listener\" \"<example_resource_name>\" {\n  load_balancer_arn = \"<example_resource_arn>\"\n  port              = 443\n  protocol          = \"HTTPS\"\n  ssl_policy        = \"ELBSecurityPolicy-TLS13-1-2-2021-06\" # FIX: approved secure policy\n  certificate_arn   = \"<example_certificate_arn>\"\n\n  default_action {\n    type             = \"forward\"\n    target_group_arn = \"<example_resource_arn>\"\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enforce **modern TLS** on load balancer listeners:\n- Use AWS recommended policies like `ELBSecurityPolicy-TLS13-1-2-2021-06`\n- Disable TLS 1.0/1.1 and weak ciphers; prefer suites with **forward secrecy**\n- Periodically review and update policies\n\nApply **defense in depth** with strict client access and **least privilege** for changes.",
      "Url": "https://hub.prowler.com/check/elbv2_insecure_ssl_ciphers"
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

---[FILE: elbv2_insecure_ssl_ciphers.py]---
Location: prowler-master/prowler/providers/aws/services/elbv2/elbv2_insecure_ssl_ciphers/elbv2_insecure_ssl_ciphers.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.elbv2.elbv2_client import elbv2_client


class elbv2_insecure_ssl_ciphers(Check):
    def execute(self):
        findings = []
        secure_ssl_policies = [
            "ELBSecurityPolicy-TLS-1-2-2017-01",
            "ELBSecurityPolicy-TLS-1-2-Ext-2018-06",
            "ELBSecurityPolicy-FS-1-2-2019-08",
            "ELBSecurityPolicy-FS-1-2-Res-2019-08",
            "ELBSecurityPolicy-FS-1-2-Res-2020-10",
            "ELBSecurityPolicy-TLS13-1-2-2021-06",
            "ELBSecurityPolicy-TLS13-1-3-2021-06",
            "ELBSecurityPolicy-TLS13-1-2-Res-2021-06",
            "ELBSecurityPolicy-TLS13-1-2-Ext1-2021-06",
            "ELBSecurityPolicy-TLS13-1-2-Ext2-2021-06",
        ]
        for lb in elbv2_client.loadbalancersv2.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=lb)
            report.status = "PASS"
            report.status_extended = (
                f"ELBv2 {lb.name} does not have insecure SSL protocols or ciphers."
            )
            for listener in lb.listeners.values():
                if (
                    listener.protocol == "HTTPS"
                    and listener.ssl_policy not in secure_ssl_policies
                ):
                    report.status = "FAIL"
                    report.status_extended = f"ELBv2 {lb.name} has listeners with insecure SSL protocols or ciphers ({listener.ssl_policy})."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: elbv2_internet_facing.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/elbv2/elbv2_internet_facing/elbv2_internet_facing.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "elbv2_internet_facing",
  "CheckTitle": "Application Load Balancer is not publicly accessible (no inbound TCP from 0.0.0.0/0 or ::/0)",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark",
    "TTPs/Initial Access"
  ],
  "ServiceName": "elbv2",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsElbv2LoadBalancer",
  "Description": "**ELBv2 Application Load Balancers** configured as `internet-facing` are assessed for exposure by reviewing attached **security groups**.\n\nInbound TCP rules that allow `0.0.0.0/0` or `::/0` indicate unrestricted internet reachability.",
  "Risk": "**Unrestricted ALB access** lets any client reach exposed endpoints, enabling **credential stuffing**, automated scanning, and **web exploits**.\n\nImpacts:\n- Confidentiality: data exfiltration\n- Integrity: unauthorized changes\n- Availability: increased attack surface and **DoS** potential",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/waf/latest/developerguide/web-acl-associating-aws-resource.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/ELBv2/internet-facing-load-balancers.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation Security Group for ALB with no public (0.0.0.0/0 or ::/0) TCP ingress\nResources:\n  <example_resource_name>:\n    Type: AWS::EC2::SecurityGroup\n    Properties:\n      GroupDescription: ALB SG restricted ingress\n      VpcId: \"<example_resource_id>\"\n      SecurityGroupIngress:\n        - IpProtocol: tcp\n          FromPort: 80\n          ToPort: 80\n          CidrIp: 10.0.0.0/8  # Critical: restricts inbound to private CIDR, preventing public access\n```",
      "Other": "1. In AWS Console, go to EC2 > Load Balancers and select the ALB\n2. In the Description tab, note the attached Security Group and open it\n3. Click Edit inbound rules\n4. Delete any TCP rule with Source 0.0.0.0/0 or ::/0\n5. If access is needed, add only specific private CIDRs or trusted security groups\n6. Click Save rules",
      "Terraform": "```hcl\n# Security Group for ALB with no public (0.0.0.0/0 or ::/0) TCP ingress\nresource \"aws_security_group\" \"<example_resource_name>\" {\n  name   = \"alb-restricted-sg\"\n  vpc_id = \"<example_resource_id>\"\n\n  ingress {\n    from_port   = 80\n    to_port     = 80\n    protocol    = \"tcp\"\n    cidr_blocks = [\"10.0.0.0/8\"] # Critical: restricts inbound to private CIDR, preventing public access\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enforce **least privilege** on security groups: avoid `0.0.0.0/0`; allow only trusted CIDRs or upstream services.\n\nUse an `internal` load balancer for non-public apps.\n\nFor public endpoints, layer **WAF** rules, strict TLS, and rate limiting; consider **CloudFront/Shield** for defense in depth and reduced direct exposure.",
      "Url": "https://hub.prowler.com/check/elbv2_internet_facing"
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

---[FILE: elbv2_internet_facing.py]---
Location: prowler-master/prowler/providers/aws/services/elbv2/elbv2_internet_facing/elbv2_internet_facing.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group
from prowler.providers.aws.services.elbv2.elbv2_client import elbv2_client


class elbv2_internet_facing(Check):
    def execute(self):
        findings = []
        for lb in elbv2_client.loadbalancersv2.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=lb)
            report.status = "PASS"
            report.status_extended = f"ELBv2 ALB {lb.name} is not internet facing."
            if lb.scheme == "internet-facing":
                report.status_extended = f"ELBv2 ALB {lb.name} has an internet facing scheme with domain {lb.dns} but is not public."
                for sg_id in getattr(lb, "security_groups", []):
                    sg_arn = f"arn:{elbv2_client.audited_partition}:ec2:{lb.region}:{elbv2_client.audited_account}:security-group/{sg_id}"
                    if sg_arn in ec2_client.security_groups:
                        for ingress_rule in ec2_client.security_groups[
                            sg_arn
                        ].ingress_rules:
                            if check_security_group(
                                ingress_rule, "tcp", any_address=True
                            ):
                                report.status = "FAIL"
                                report.status_extended = f"ELBv2 ALB {lb.name} is internet facing with domain {lb.dns} due to their security group {sg_id} is public."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: elbv2_is_in_multiple_az.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/elbv2/elbv2_is_in_multiple_az/elbv2_is_in_multiple_az.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "elbv2_is_in_multiple_az",
  "CheckTitle": "ELBv2 load balancer is configured across multiple Availability Zones",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Effects/Denial of Service"
  ],
  "ServiceName": "elbv2",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsElbv2LoadBalancer",
  "Description": "ELBv2 load balancers (Application, Network, or Gateway) are assessed for distribution across multiple **Availability Zones**. The finding indicates whether each load balancer spans at least the configured minimum number of AZs (default `2`).",
  "Risk": "Limiting a load balancer to one AZ introduces a single point of failure. An AZ outage, zonal degradation, or imbalanced target capacity can cause downtime, dropped connections, and deployment risk, undermining service **availability** and resiliency.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/elasticloadbalancing/latest/network/availability-zones.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/ELBv2/enable-multi-az.html",
    "https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html#availability-zones"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws elbv2 set-subnets --load-balancer-arn <LOAD_BALANCER_ARN> --subnets <SUBNET_ID_A> <SUBNET_ID_B>",
      "NativeIaC": "```yaml\n# CloudFormation: ensure the ELBv2 spans at least two AZs by specifying two subnets\nResources:\n  <example_resource_name>:\n    Type: AWS::ElasticLoadBalancingV2::LoadBalancer\n    Properties:\n      Subnets:\n        - <subnet_id_a>  # critical: add a second AZ/subnet\n        - <subnet_id_b>  # critical: ensures the load balancer spans >=2 AZs\n```",
      "Other": "1. Open AWS Console > EC2 > Load Balancers\n2. Select the load balancer\n3. Go to the Network mapping tab and click Edit subnets\n4. Enable at least two Availability Zones by selecting one subnet in each of two AZs\n5. Click Save changes",
      "Terraform": "```hcl\n# Ensure ELBv2 spans at least two Availability Zones\nresource \"aws_lb\" \"<example_resource_name>\" {\n  subnets = [\n    \"<subnet_id_a>\",  # critical: add a second AZ/subnet\n    \"<subnet_id_b>\"   # critical: ensures the load balancer spans >=2 AZs\n  ]\n}\n```"
    },
    "Recommendation": {
      "Text": "Operate each load balancer across at least **two AZs** and ensure every enabled AZ has healthy, scaled targets.\n- Distribute capacity per AZ; use autoscaling\n- Keep health checks effective\n- Consider cross-zone load balancing to absorb bursts\n- Regularly test failover",
      "Url": "https://hub.prowler.com/check/elbv2_is_in_multiple_az"
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

---[FILE: elbv2_is_in_multiple_az.py]---
Location: prowler-master/prowler/providers/aws/services/elbv2/elbv2_is_in_multiple_az/elbv2_is_in_multiple_az.py

```python
from typing import List

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.elbv2.elbv2_client import elbv2_client


class elbv2_is_in_multiple_az(Check):
    def execute(self) -> List[Check_Report_AWS]:
        findings = []
        elbv2_min_azs = elbv2_client.audit_config.get("elbv2_min_azs", 2)
        for lb in elbv2_client.loadbalancersv2.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=lb)
            report.status = "FAIL"
            report.status_extended = f"ELBv2 {lb.name} is not in at least {elbv2_min_azs} AZs. Is only in {', '.join(lb.availability_zones.keys())}."

            if len(lb.availability_zones) >= elbv2_min_azs:
                report.status = "PASS"
                report.status_extended = f"ELBv2 {lb.name} is at least in {elbv2_min_azs} AZs: {', '.join(lb.availability_zones.keys())}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: elbv2_listeners_underneath.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/elbv2/elbv2_listeners_underneath/elbv2_listeners_underneath.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "elbv2_listeners_underneath",
  "CheckTitle": "ELBv2 load balancer has at least one listener",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Effects/Denial of Service"
  ],
  "ServiceName": "elbv2",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsElbv2LoadBalancer",
  "Description": "**ELBv2 load balancer** requires at least one **listener** (protocol and port) to accept client connections and route requests to target groups. The finding indicates whether listeners are defined on the load balancer.",
  "Risk": "Without a listener, the load balancer cannot accept connections, making back-end services unreachable. This harms **availability**, leads to client timeouts and errors, and disrupts integrations that rely on the load balancer's DNS endpoint.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws elbv2 create-listener --load-balancer-arn <LOAD_BALANCER_ARN> --protocol HTTP --port 80 --default-actions 'Type=fixed-response,FixedResponseConfig={StatusCode=200}'",
      "NativeIaC": "```yaml\n# CloudFormation: add a minimal listener to the ELBv2\nResources:\n  <example_resource_name>:\n    Type: AWS::ElasticLoadBalancingV2::Listener\n    Properties:\n      LoadBalancerArn: <example_load_balancer_arn>  # Critical: attaches the listener to the load balancer\n      Port: 80                                      # Critical: defines the listener port\n      Protocol: HTTP                                # Critical: defines the listener protocol\n      DefaultActions:\n        - Type: fixed-response                       # Critical: minimal required default action so the listener is valid\n          FixedResponseConfig:\n            StatusCode: '200'                       # Critical: required for fixed-response action\n```",
      "Other": "1. In the AWS Console, go to EC2 > Load Balancing > Load Balancers\n2. Select the load balancer with the finding\n3. Open the Listeners tab and click Add listener\n4. Set Protocol to HTTP and Port to 80\n5. For Default action, choose Return fixed response and set Status code to 200\n6. Click Create/Save to add the listener",
      "Terraform": "```hcl\n# Terraform: add a minimal listener to the ELBv2\nresource \"aws_lb_listener\" \"<example_resource_name>\" {\n  load_balancer_arn = \"<example_load_balancer_arn>\"  # Critical: attaches the listener to the load balancer\n  port              = 80                               # Critical: defines the listener port\n  protocol          = \"HTTP\"                          # Critical: defines the listener protocol\n\n  default_action {                                     # Critical: required default action so the listener is valid\n    type = \"fixed-response\"\n    fixed_response {\n      status_code = \"200\"                             # Critical: required for fixed-response action\n    }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Define at least one listener per load balancer. Prefer **HTTPS** on `443` to protect data in transit, and expose only required ports. Apply **least privilege** by limiting protocols and rules to intended traffic, and set an explicit default action to avoid unintended routing.",
      "Url": "https://hub.prowler.com/check/elbv2_listeners_underneath"
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

---[FILE: elbv2_listeners_underneath.py]---
Location: prowler-master/prowler/providers/aws/services/elbv2/elbv2_listeners_underneath/elbv2_listeners_underneath.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.elbv2.elbv2_client import elbv2_client


class elbv2_listeners_underneath(Check):
    def execute(self):
        findings = []
        for lb in elbv2_client.loadbalancersv2.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=lb)
            report.status = "PASS"
            report.status_extended = f"ELBv2 {lb.name} has listeners underneath."
            if len(lb.listeners) == 0:
                report.status = "FAIL"
                report.status_extended = f"ELBv2 {lb.name} has no listeners underneath."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: elbv2_logging_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/elbv2/elbv2_logging_enabled/elbv2_logging_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "elbv2_logging_enabled",
  "CheckTitle": "ELBv2 Application Load Balancer has access logs to S3 configured",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "elbv2",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsElbv2LoadBalancer",
  "Description": "**ELBv2 Application Load Balancers** are evaluated for **access logging** enabled to Amazon S3, capturing request details such as timestamps, client IPs, paths, and response codes.",
  "Risk": "Absent **ALB access logs** reduces **visibility** and hampers **incident detection** and **forensics**. Malicious requests, credential stuffing, or data exfiltration via the load balancer can go unnoticed, undermining **confidentiality** and **integrity**, and delaying recovery from **availability** incidents.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-access-logs.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/ELBv2/access-log.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws elbv2 modify-load-balancer-attributes --load-balancer-arn <lb_arn> --attributes Key=access_logs.s3.enabled,Value=true Key=access_logs.s3.bucket,Value=<bucket_name>",
      "NativeIaC": "```yaml\n# CloudFormation: enable ALB access logs to S3\nResources:\n  <example_resource_name>:\n    Type: AWS::ElasticLoadBalancingV2::LoadBalancer\n    Properties:\n      Subnets:\n        - <subnet_id_1>\n        - <subnet_id_2>\n      SecurityGroups:\n        - <example_security_group_id>\n      LoadBalancerAttributes:\n        - Key: access_logs.s3.enabled  # critical: enable ALB access logging\n          Value: \"true\"\n        - Key: access_logs.s3.bucket   # critical: destination S3 bucket for logs\n          Value: \"<example_resource_name>\"\n```",
      "Other": "1. In AWS Console, go to EC2 > Load Balancers and select your Application Load Balancer\n2. Open the Attributes (or Edit attributes) section and find Access logs\n3. Check Enable access logs and choose the S3 bucket for delivery\n4. Save changes",
      "Terraform": "```hcl\n# Terraform: enable ALB access logs to S3\nresource \"aws_lb\" \"<example_resource_name>\" {\n  name            = \"<example_resource_name>\"\n  security_groups = [\"<example_security_group_id>\"]\n  subnets         = [\"<subnet_id_1>\", \"<subnet_id_2>\"]\n\n  access_logs {\n    bucket  = \"<example_resource_name>\"  # critical: destination S3 bucket for logs\n    enabled = true                        # critical: enable ALB access logging\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **ALB access logging** to a dedicated, encrypted S3 bucket. Apply **least privilege** to the bucket for delivery and readers, set lifecycle policies for retention, and consider `Object Lock` to deter tampering. Centralize logs in a **SIEM** and alert on anomalies as part of **defense in depth**.",
      "Url": "https://hub.prowler.com/check/elbv2_logging_enabled"
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

---[FILE: elbv2_logging_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/elbv2/elbv2_logging_enabled/elbv2_logging_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.elbv2.elbv2_client import elbv2_client


class elbv2_logging_enabled(Check):
    def execute(self):
        findings = []
        for lb in elbv2_client.loadbalancersv2.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=lb)
            report.status = "FAIL"
            report.status_extended = (
                f"ELBv2 ALB {lb.name} does not have access logs configured."
            )
            if lb.access_logs == "true":
                report.status = "PASS"
                report.status_extended = (
                    f"ELBv2 ALB {lb.name} has access logs to S3 configured."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
