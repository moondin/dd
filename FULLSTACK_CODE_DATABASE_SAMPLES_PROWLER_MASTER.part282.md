---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 282
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 282 of 867)

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

---[FILE: elb_insecure_ssl_ciphers.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/elb/elb_insecure_ssl_ciphers/elb_insecure_ssl_ciphers.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "elb_insecure_ssl_ciphers",
  "CheckTitle": "Elastic Load Balancer HTTPS listeners, if present, use the ELBSecurityPolicy-TLS-1-2-2017-01 policy",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark",
    "Software and Configuration Checks/Industry and Regulatory Standards/PCI-DSS",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls (USA)"
  ],
  "ServiceName": "elb",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsElbLoadBalancer",
  "Description": "Elastic Load Balancer HTTPS listeners are assessed for use of a **strong TLS policy**. Listeners associated with `ELBSecurityPolicy-TLS-1-2-2017-01` are considered to negotiate only modern protocols and ciphers, avoiding legacy SSL/TLS and weak suites.",
  "Risk": "Legacy TLS or weak ciphers allow downgrades and man-in-the-middle decryption or tampering. Attackers can capture credentials, inject responses, and pivot, undermining data-in-transit **confidentiality** and **integrity**, and risking **availability** through failed handshakes.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/ELB/elb-security-policy.html",
    "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html#describe-ssl-policies",
    "https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/ssl-config-update.html",
    "https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/elb-security-policy-table.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws elb set-load-balancer-policies-of-listener --load-balancer-name <lb_name> --load-balancer-port 443 --policy-names ELBSecurityPolicy-TLS-1-2-2017-01",
      "NativeIaC": "```yaml\n# CloudFormation: Classic ELB with TLS 1.2-only security policy on HTTPS listener\nResources:\n  <example_resource_name>:\n    Type: AWS::ElasticLoadBalancing::LoadBalancer\n    Properties:\n      AvailabilityZones:\n        - <example_az>\n      Listeners:\n        - LoadBalancerPort: 443\n          InstancePort: 443\n          Protocol: HTTPS\n          InstanceProtocol: HTTPS\n          SSLCertificateId: <example_certificate_arn>\n          PolicyNames:\n            - ELBSecurityPolicy-TLS-1-2-2017-01  # Critical: attach TLS 1.2-only policy to the HTTPS listener\n      Policies:\n        - PolicyName: ELBSecurityPolicy-TLS-1-2-2017-01  # Critical: create policy referencing the predefined TLS 1.2 policy\n          PolicyType: SSLNegotiationPolicyType\n          Attributes:\n            - Name: Reference-Security-Policy\n              Value: ELBSecurityPolicy-TLS-1-2-2017-01  # Critical: enforce TLS 1.2-only\n```",
      "Other": "1. Open the AWS Management Console and go to EC2\n2. In the left menu, under Load Balancing, click Load Balancers\n3. Select your Classic Load Balancer\n4. On the Listeners tab, click Manage listeners (or Edit)\n5. Select the HTTPS (port 443) listener and under Security policy choose ELBSecurityPolicy-TLS-1-2-2017-01\n6. Click Save changes",
      "Terraform": "```hcl\n# Create and attach TLS 1.2-only policy to a Classic ELB HTTPS listener\nresource \"aws_load_balancer_policy\" \"<example_resource_name>\" {\n  load_balancer_name = \"<example_resource_name>\"\n  policy_name        = \"ELBSecurityPolicy-TLS-1-2-2017-01\"  # Critical: policy named as required by the check\n  policy_type_name   = \"SSLNegotiationPolicyType\"\n\n  policy_attributes {\n    name  = \"Reference-Security-Policy\"\n    value = \"ELBSecurityPolicy-TLS-1-2-2017-01\"  # Critical: reference the predefined TLS 1.2 policy\n  }\n}\n\nresource \"aws_load_balancer_listener_policy\" \"<example_resource_name>\" {\n  load_balancer_name = \"<example_resource_name>\"\n  load_balancer_port = 443\n  policy_names       = [aws_load_balancer_policy.<example_resource_name>.policy_name]  # Critical: attach policy to HTTPS listener\n}\n```"
    },
    "Recommendation": {
      "Text": "Standardize on ELB policies enforcing **TLS 1.2+** with modern AEAD ciphers; disable legacy protocols and weak suites. Enable server cipher order, retire outdated policies, and review regularly for crypto agility. Validate client compatibility, use strong certificates, and monitor negotiation results.",
      "Url": "https://hub.prowler.com/check/elb_insecure_ssl_ciphers"
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

---[FILE: elb_insecure_ssl_ciphers.py]---
Location: prowler-master/prowler/providers/aws/services/elb/elb_insecure_ssl_ciphers/elb_insecure_ssl_ciphers.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.elb.elb_client import elb_client


class elb_insecure_ssl_ciphers(Check):
    def execute(self):
        findings = []
        secure_ssl_policies = [
            "ELBSecurityPolicy-TLS-1-2-2017-01",
        ]
        for lb in elb_client.loadbalancers.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=lb)
            report.status = "PASS"
            report.status_extended = (
                f"ELB {lb.name} does not have insecure SSL protocols or ciphers."
            )
            for listener in lb.listeners:
                if listener.protocol == "HTTPS" and not any(
                    check in listener.policies for check in secure_ssl_policies
                ):
                    report.status = "FAIL"
                    report.status_extended = f"ELB {lb.name} has listeners with insecure SSL protocols or ciphers."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: elb_internet_facing.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/elb/elb_internet_facing/elb_internet_facing.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "elb_internet_facing",
  "CheckTitle": "Elastic Load Balancer is not internet-facing",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Effects/Data Exposure",
    "TTPs/Initial Access"
  ],
  "ServiceName": "elb",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsElbLoadBalancer",
  "Description": "Elastic Load Balancers are evaluated for the `scheme` to determine whether they are **internet-facing** or internal, indicating if the endpoint is publicly reachable via a public DNS name.",
  "Risk": "An unintended **internet-facing** load balancer exposes backends to the Internet, enabling reconnaissance, credential stuffing, and exploitation of app flaws. This can lead to data exposure (confidentiality), unauthorized changes (integrity), and **DDoS** or resource exhaustion (availability).",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/waf/latest/developerguide/web-acl-associating-aws-resource.html",
    "https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-resource-elasticloadbalancingv2-loadbalancer.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/ELB/internet-facing-load-balancers.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: create an internal load balancer\nResources:\n  <example_resource_name>:\n    Type: AWS::ElasticLoadBalancingV2::LoadBalancer\n    Properties:\n      Scheme: internal  # CRITICAL: makes the load balancer internal (not internet-facing)\n      Subnets:\n        - <example_resource_id>\n        - <example_resource_id>\n      SecurityGroups:\n        - <example_resource_id>\n```",
      "Other": "1. In AWS Console, go to EC2 > Load Balancers\n2. Click Create load balancer (Application or Network)\n3. Set Scheme to Internal\n4. Select at least two subnets and a security group; recreate listeners/target groups as needed\n5. Create the new load balancer and update DNS to its DNS name\n6. Delete the old internet-facing load balancer",
      "Terraform": "```hcl\nresource \"aws_lb\" \"<example_resource_name>\" {\n  internal        = true  # CRITICAL: sets scheme to internal so it's not internet-facing\n  subnets         = [\"<example_resource_id>\", \"<example_resource_id>\"]\n  security_groups = [\"<example_resource_id>\"]\n}\n```"
    },
    "Recommendation": {
      "Text": "Use `internal` load balancers for private services and restrict exposure with **security groups**, subnets, and allowlists. For public endpoints, apply **defense in depth**: associate an **AWS WAF** web ACL (*when supported*), enforce **TLS**, least-privilege network rules, and consider **Shield** or rate limiting. Regularly review necessity of public access.",
      "Url": "https://hub.prowler.com/check/elb_internet_facing"
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

---[FILE: elb_internet_facing.py]---
Location: prowler-master/prowler/providers/aws/services/elb/elb_internet_facing/elb_internet_facing.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.elb.elb_client import elb_client


class elb_internet_facing(Check):
    def execute(self):
        findings = []
        for lb in elb_client.loadbalancers.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=lb)
            report.status = "PASS"
            report.status_extended = f"ELB {lb.name} is not internet facing."
            if lb.scheme == "internet-facing":
                report.status = "FAIL"
                report.status_extended = (
                    f"ELB {lb.name} is internet facing in {lb.dns}."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: elb_is_in_multiple_az.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/elb/elb_is_in_multiple_az/elb_is_in_multiple_az.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "elb_is_in_multiple_az",
  "CheckTitle": "Classic Load Balancer is in multiple Availability Zones",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Effects/Denial of Service"
  ],
  "ServiceName": "elb",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsElbLoadBalancer",
  "Description": "**Classic Load Balancer** spans at least the configured number of **Availability Zones**.\n\nThe evaluation identifies load balancers enabled in fewer AZs than the specified minimum.",
  "Risk": "Operating in too few AZs makes the load balancer a **single point of failure**. An AZ outage or zonal degradation can cause **service unavailability**, dropped connections, and uneven capacity, undermining application **availability** and resilience and increasing recovery time.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/ELB/ec2-instances-distribution-across-availability-zones.html",
    "https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/enable-disable-crosszone-lb.html",
    "https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/introduction.html#classic-load-balancer-overview"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: Ensure CLB spans at least two Availability Zones by adding two subnets\nResources:\n  <example_resource_name>:\n    Type: AWS::ElasticLoadBalancing::LoadBalancer\n    Properties:\n      Subnets:\n        - <example_subnet_id_a>  # Critical: add a subnet in AZ A to ensure multiple AZs\n        - <example_subnet_id_b>  # Critical: add a subnet in a different AZ (>=2 AZs total)\n      Listeners:\n        - LoadBalancerPort: 80\n          InstancePort: 80\n          Protocol: HTTP\n```",
      "Other": "1. Open the Amazon EC2 console and go to Load Balancers\n2. Select your Classic Load Balancer (type: classic)\n3. Choose Edit subnets (or the Subnets tab > Edit)\n4. Add a subnet from a different Availability Zone than the existing one (ensure at least two AZs)\n5. Click Save\n6. If your CLB is in EC2-Classic, use Edit Availability Zones instead and select an additional AZ, then Save",
      "Terraform": "```hcl\n# Terraform: Ensure CLB spans at least two Availability Zones by adding two subnets\nresource \"aws_elb\" \"<example_resource_name>\" {\n  name    = \"<example_resource_name>\"\n  subnets = [\n    \"<example_subnet_id_a>\", # Critical: subnet in AZ A to ensure multiple AZs\n    \"<example_subnet_id_b>\"  # Critical: subnet in different AZ (>=2 AZs total)\n  ]\n\n  listener {\n    lb_port        = 80\n    lb_protocol    = \"http\"\n    instance_port  = 80\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Design for **multi-AZ high availability**:\n- Enable at least `2` AZs per load balancer\n- Distribute targets evenly and use Auto Scaling across AZs\n- Enable **cross-zone load balancing** to smooth imbalances\n- Regularly test failover and health thresholds\n\nApply **fault isolation** and **defense in depth** principles.",
      "Url": "https://hub.prowler.com/check/elb_is_in_multiple_az"
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

---[FILE: elb_is_in_multiple_az.py]---
Location: prowler-master/prowler/providers/aws/services/elb/elb_is_in_multiple_az/elb_is_in_multiple_az.py

```python
from typing import List

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.elb.elb_client import elb_client


class elb_is_in_multiple_az(Check):
    def execute(self) -> List[Check_Report_AWS]:
        findings = []
        ELB_MIN_AZS = elb_client.audit_config.get("elb_min_azs", 2)
        for lb in elb_client.loadbalancers.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=lb)
            report.status = "FAIL"
            report.status_extended = f"Classic Load Balancer {lb.name} is not in at least {ELB_MIN_AZS} availability zones, it is only in {', '.join(lb.availability_zones)}."

            if len(lb.availability_zones) >= ELB_MIN_AZS:
                report.status = "PASS"
                report.status_extended = f"Classic Load Balancer {lb.name} is in {len(lb.availability_zones)} availability zones: {', '.join(lb.availability_zones)}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: elb_logging_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/elb/elb_logging_enabled/elb_logging_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "elb_logging_enabled",
  "CheckTitle": "Elastic Load Balancer has access logs to S3 configured",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "elb",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsElbLoadBalancer",
  "Description": "**Elastic Load Balancers** have **access logs** configured to deliver request metadata (client IPs, paths, status, TLS details) to **Amazon S3**",
  "Risk": "Without **ELB access logs**, you lose **visibility** into edge traffic, reducing detection of reconnaissance, brute-force, and exploitation attempts. This hampers forensics and incident timelines, risking undetected data exfiltration (confidentiality), untraceable changes (integrity), and delayed response to outages or DDoS (availability).",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/elasticloadbalancing/latest/network/enable-access-logs.html",
    "https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/access-log-collection.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/ElasticBeanstalk/enable-access-logs.html",
    "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/enable-access-logging.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws elb modify-load-balancer-attributes --load-balancer-name <lb_name> --load-balancer-attributes AccessLog={Enabled=true,S3BucketName=<bucket_name>}",
      "NativeIaC": "```yaml\n# CloudFormation: Enable access logs for a Classic Load Balancer (CLB)\nResources:\n  <example_resource_name>:\n    Type: AWS::ElasticLoadBalancing::LoadBalancer\n    Properties:\n      Listeners:\n        - LoadBalancerPort: 80\n          InstancePort: 80\n          Protocol: HTTP\n      AvailabilityZones:\n        - <example_resource_id>\n      AccessLoggingPolicy:               # CRITICAL: Enables S3 access logs\n        Enabled: true                    # CRITICAL: Turn on access logging\n        S3BucketName: <example_resource_name>  # CRITICAL: S3 bucket to store logs\n```",
      "Other": "1. In the AWS Console, go to EC2 > Load Balancers\n2. Select the load balancer and choose Edit attributes (or the Attributes tab)\n3. Turn on Access logs\n4. Enter the S3 URI (e.g., s3://<bucket_name>)\n5. Click Save",
      "Terraform": "```hcl\n# Enable access logs for an ELBv2 load balancer (minimal)\nresource \"aws_lb\" \"<example_resource_name>\" {\n  load_balancer_type = \"network\"\n  subnets            = [\"<example_resource_id>\", \"<example_resource_id>\"]\n\n  access_logs {                   # CRITICAL: Enables S3 access logs\n    bucket  = \"<example_resource_name>\"  # CRITICAL: S3 bucket for logs\n    enabled = true                 # CRITICAL: Turn on access logging\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **access logs** to Amazon S3 (`access_logs.s3.enabled=true`). Apply **least privilege** bucket policies, encrypt objects, and restrict read access. Define lifecycle retention and centralize analysis. Monitor for delivery failures and alert on anomalies. Standardize across all load balancers via IaC as part of **defense in depth**.",
      "Url": "https://hub.prowler.com/check/elb_logging_enabled"
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

---[FILE: elb_logging_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/elb/elb_logging_enabled/elb_logging_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.elb.elb_client import elb_client


class elb_logging_enabled(Check):
    def execute(self):
        findings = []
        for lb in elb_client.loadbalancers.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=lb)
            report.status = "FAIL"
            report.status_extended = (
                f"ELB {lb.name} does not have access logs configured."
            )
            if lb.access_logs:
                report.status = "PASS"
                report.status_extended = (
                    f"ELB {lb.name} has access logs to S3 configured."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: elb_ssl_listeners.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/elb/elb_ssl_listeners/elb_ssl_listeners.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "elb_ssl_listeners",
  "CheckTitle": "Elastic Load Balancer has only HTTPS or SSL listeners",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/PCI-DSS",
    "Effects/Data Exposure"
  ],
  "ServiceName": "elb",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsElbLoadBalancer",
  "Description": "**Elastic Load Balancers** are assessed for client-facing listener protocols. Only `HTTPS` or `SSL` are considered encrypted; any `HTTP` or `TCP` listener indicates plaintext between clients and the load balancer.",
  "Risk": "Plaintext listeners enable network eavesdropping and content injection, compromising **confidentiality** and **integrity**. Attackers on public or untrusted paths can harvest credentials and session tokens or alter traffic via MITM, leading to data exposure and unauthorized access.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/ELB/elb-listener-security.html",
    "https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/elb-security-policy-table.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws elb delete-load-balancer-listeners --load-balancer-name <lb_name> --load-balancer-ports 80",
      "NativeIaC": "```yaml\n# CloudFormation: Classic ELB with only encrypted (HTTPS) listener\nResources:\n  <example_resource_name>:\n    Type: AWS::ElasticLoadBalancing::LoadBalancer\n    Properties:\n      AvailabilityZones:\n        - <example_az>\n      Listeners:\n        - Protocol: HTTPS           # CRITICAL: enforce encrypted listener\n          LoadBalancerPort: 443\n          InstanceProtocol: HTTP\n          InstancePort: 80\n          SSLCertificateId: <certificate_arn>  # CRITICAL: required for HTTPS termination\n```",
      "Other": "1. In the AWS console, go to EC2 > Load Balancers (Classic)\n2. Select the load balancer and open the Listeners tab\n3. Click Edit and remove any listener with Protocol HTTP or TCP\n4. Add a listener with Protocol HTTPS (port 443) and select an SSL certificate\n5. Save changes",
      "Terraform": "```hcl\n# Classic ELB with only encrypted (HTTPS) listener\nresource \"aws_elb\" \"<example_resource_name>\" {\n  availability_zones = [\"<example_az>\"]\n\n  listener {\n    lb_port            = 443\n    lb_protocol        = \"https\"   # CRITICAL: enforce encrypted listener\n    instance_port      = 80\n    instance_protocol  = \"http\"\n    ssl_certificate_id = \"<certificate_arn>\"  # CRITICAL: required for HTTPS/SSL\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enforce **encryption in transit** by using only `HTTPS`/`TLS` listeners. Redirect `HTTP` to `HTTPS` and retire plaintext listeners. Use trusted certificates (e.g., ACM) and modern TLS policies; align with **zero trust** and **defense in depth**. *If needed*, use end-to-end TLS to targets and monitor certificate health.",
      "Url": "https://hub.prowler.com/check/elb_ssl_listeners"
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

---[FILE: elb_ssl_listeners.py]---
Location: prowler-master/prowler/providers/aws/services/elb/elb_ssl_listeners/elb_ssl_listeners.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.elb.elb_client import elb_client


class elb_ssl_listeners(Check):
    def execute(self):
        findings = []
        secure_protocols = ["SSL", "HTTPS"]
        for lb in elb_client.loadbalancers.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=lb)
            report.status = "PASS"
            report.status_extended = f"ELB {lb.name} has HTTPS listeners only."
            for listener in lb.listeners:
                if listener.protocol not in secure_protocols:
                    report.status = "FAIL"
                    report.status_extended = (
                        f"ELB {lb.name} has non-encrypted listeners."
                    )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: elb_ssl_listeners_use_acm_certificate.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/elb/elb_ssl_listeners_use_acm_certificate/elb_ssl_listeners_use_acm_certificate.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "elb_ssl_listeners_use_acm_certificate",
  "CheckTitle": "Classic Load Balancer HTTPS/SSL listeners use ACM-issued certificates",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "elb",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsElbLoadBalancer",
  "Description": "Classic Load Balancer HTTPS/SSL listeners use **AWS Certificate Manager** certificates that are **Amazon-issued** (certificate type `AMAZON_ISSUED`).",
  "Risk": "Using imported or non Amazon-issued certificates reduces control over issuance and rotation, increasing chances of **expired or weak TLS**. This can trigger **service outages** and enable **man-in-the-middle** interception, compromising data **confidentiality** and **integrity**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/elb-controls.html#elb-2",
    "https://docs.aws.amazon.com/config/latest/developerguide/elb-acm-certificate-required.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws elb set-load-balancer-listener-ssl-certificate --load-balancer-name <load-balancer-name> --load-balancer-port <port> --ssl-certificate-id <acm_certificate_arn>",
      "NativeIaC": "```yaml\n# CloudFormation: Attach an Amazon-issued ACM cert to a CLB HTTPS/SSL listener\nResources:\n  <example_resource_name>:\n    Type: AWS::ElasticLoadBalancing::LoadBalancer\n    Properties:\n      AvailabilityZones:\n        - <example_az>\n      Listeners:\n        - LoadBalancerPort: 443\n          InstancePort: 443\n          Protocol: HTTPS\n          SSLCertificateId: <acm_certificate_arn>  # critical: use Amazon-issued ACM certificate to pass ELB.2\n```",
      "Other": "1. In the AWS Console, go to EC2 > Load Balancing > Load Balancers (Classic)\n2. Select the Classic Load Balancer\n3. Open the Listeners tab and choose the HTTPS/SSL listener\n4. Click Edit (or Change SSL certificate)\n5. Select an ACM certificate that is Amazon-issued (not imported)\n6. Save changes",
      "Terraform": "```hcl\n# Terraform: Attach an Amazon-issued ACM cert to a CLB HTTPS/SSL listener\nresource \"aws_elb\" \"<example_resource_name>\" {\n  availability_zones = [\"<example_az>\"]\n\n  listener {\n    lb_port            = 443\n    lb_protocol        = \"https\"\n    instance_port      = 443\n    instance_protocol  = \"https\"\n    ssl_certificate_id = \"<acm_certificate_arn>\" # critical: Amazon-issued ACM cert to satisfy ELB.2\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Standardize on **Amazon-issued ACM certificates** for CLB HTTPS/SSL listeners to ensure managed validation and **automatic renewal**.\n\nApply **least privilege** to certificate operations, automate rotation, and monitor certificate health as part of **defense in depth**.",
      "Url": "https://hub.prowler.com/check/elb_ssl_listeners_use_acm_certificate"
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

---[FILE: elb_ssl_listeners_use_acm_certificate.py]---
Location: prowler-master/prowler/providers/aws/services/elb/elb_ssl_listeners_use_acm_certificate/elb_ssl_listeners_use_acm_certificate.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.acm.acm_client import acm_client
from prowler.providers.aws.services.elb.elb_client import elb_client


class elb_ssl_listeners_use_acm_certificate(Check):
    def execute(self):
        findings = []
        secure_protocols = ["SSL", "HTTPS"]
        for lb in elb_client.loadbalancers.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=lb)
            report.status = "PASS"
            report.status_extended = f"ELB {lb.name} HTTPS/SSL listeners are using certificates managed by ACM."
            for listener in lb.listeners:
                if (
                    listener.certificate_arn
                    and listener.protocol in secure_protocols
                    and (
                        listener.certificate_arn not in acm_client.certificates
                        or (
                            acm_client.certificates.get(listener.certificate_arn)
                            and acm_client.certificates[listener.certificate_arn].type
                            != "AMAZON_ISSUED"
                        )
                    )
                ):
                    report.status = "FAIL"
                    report.status_extended = f"ELB {lb.name} has HTTPS/SSL listeners that are using certificates not managed by ACM."
                    break

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: elbv2_client.py]---
Location: prowler-master/prowler/providers/aws/services/elbv2/elbv2_client.py

```python
from prowler.providers.aws.services.elbv2.elbv2_service import ELBv2
from prowler.providers.common.provider import Provider

elbv2_client = ELBv2(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: elbv2_service.py]---
Location: prowler-master/prowler/providers/aws/services/elbv2/elbv2_service.py
Signals: Pydantic

```python
from typing import Dict, Optional

from botocore.client import ClientError
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class ELBv2(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.loadbalancersv2 = {}
        self.__threading_call__(self._describe_load_balancers)
        self.__threading_call__(self._describe_listeners, self.loadbalancersv2.items())
        self.__threading_call__(
            self._describe_load_balancer_attributes, self.loadbalancersv2.items()
        )
        self.__threading_call__(
            self._describe_rules,
            [
                (listener_arn, listener)
                for lb in self.loadbalancersv2.values()
                for listener_arn, listener in lb.listeners.items()
            ],
        )
        self.__threading_call__(self._describe_tags, self.loadbalancersv2.items())

    def _describe_load_balancers(self, regional_client):
        logger.info("ELBv2 - Describing load balancers...")
        try:
            describe_elbv2_paginator = regional_client.get_paginator(
                "describe_load_balancers"
            )
            for page in describe_elbv2_paginator.paginate():
                for elbv2 in page["LoadBalancers"]:
                    if not self.audit_resources or (
                        is_resource_filtered(
                            elbv2["LoadBalancerArn"], self.audit_resources
                        )
                    ):
                        self.loadbalancersv2[elbv2["LoadBalancerArn"]] = LoadBalancerv2(
                            arn=elbv2["LoadBalancerArn"],
                            name=elbv2["LoadBalancerName"],
                            region=regional_client.region,
                            type=elbv2["Type"],
                            dns=elbv2.get("DNSName", None),
                            scheme=elbv2.get("Scheme", None),
                            security_groups=elbv2.get("SecurityGroups", []),
                            availability_zones={
                                az["ZoneName"]: az["SubnetId"]
                                for az in elbv2.get("AvailabilityZones", [])
                            },
                        )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_listeners(self, load_balancer):
        logger.info("ELBv2 - Describing listeners...")
        try:
            # load_balancer is a tuple with the LoadBalancerArn and the LoadBalancer object
            regional_client = self.regional_clients[load_balancer[1].region]

            describe_elbv2_paginator = regional_client.get_paginator(
                "describe_listeners"
            )

            for page in describe_elbv2_paginator.paginate(
                LoadBalancerArn=load_balancer[0]
            ):
                for listener in page["Listeners"]:
                    load_balancer[1].listeners[listener["ListenerArn"]] = Listenerv2(
                        region=regional_client.region,
                        port=listener.get("Port", 0),
                        ssl_policy=listener.get("SslPolicy", ""),
                        protocol=listener.get("Protocol", ""),
                    )

        except ClientError as error:
            if error.response["Error"]["Code"] == "LoadBalancerNotFound":
                logger.warning(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
            else:
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_load_balancer_attributes(self, load_balancer):
        logger.info("ELBv2 - Describing attributes...")
        try:
            regional_client = self.regional_clients[load_balancer[1].region]

            for attribute in regional_client.describe_load_balancer_attributes(
                LoadBalancerArn=load_balancer[0]
            )["Attributes"]:
                if attribute["Key"] == "routing.http.desync_mitigation_mode":
                    load_balancer[1].desync_mitigation_mode = attribute["Value"]
                if attribute["Key"] == "load_balancing.cross_zone.enabled":
                    load_balancer[1].cross_zone_load_balancing = attribute["Value"]
                if attribute["Key"] == "deletion_protection.enabled":
                    load_balancer[1].deletion_protection = attribute["Value"]
                if attribute["Key"] == "access_logs.s3.enabled":
                    load_balancer[1].access_logs = attribute["Value"]
                if (
                    attribute["Key"]
                    == "routing.http.drop_invalid_header_fields.enabled"
                ):
                    load_balancer[1].drop_invalid_header_fields = attribute["Value"]

        except ClientError as error:
            if error.response["Error"]["Code"] == "LoadBalancerNotFound":
                logger.warning(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
            else:
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_rules(self, listener):
        logger.info("ELBv2 - Describing Rules...")
        try:
            # listener is a tuple with the ListenerArn and the Listener object
            regional_client = self.regional_clients[listener[1].region]

            for rule in regional_client.describe_rules(ListenerArn=listener[0])[
                "Rules"
            ]:
                listener[1].rules.append(
                    ListenerRule(
                        arn=rule["RuleArn"],
                        actions=rule["Actions"],
                        conditions=rule["Conditions"],
                    )
                )
        except ClientError as error:
            if error.response["Error"]["Code"] == "ListenerNotFound":
                logger.warning(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
            else:
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_tags(self, load_balancer):
        logger.info("ELBv2 - List Tags...")
        try:
            regional_client = self.regional_clients[load_balancer[1].region]

            load_balancer[1].tags = regional_client.describe_tags(
                ResourceArns=[load_balancer[0]]
            )["TagDescriptions"][0].get("Tags", [])
        except ClientError as error:
            if error.response["Error"]["Code"] == "LoadBalancerNotFound":
                logger.warning(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
            else:
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class ListenerRule(BaseModel):
    arn: str
    actions: list[dict]
    conditions: list[dict]


class Listenerv2(BaseModel):
    region: str
    port: int
    protocol: str
    ssl_policy: str
    rules: list[ListenerRule] = []


class LoadBalancerv2(BaseModel):
    arn: str
    name: str
    region: str
    type: str
    access_logs: Optional[str]
    desync_mitigation_mode: Optional[str]
    deletion_protection: Optional[str]
    dns: Optional[str]
    drop_invalid_header_fields: Optional[str]
    cross_zone_load_balancing: Optional[str]
    listeners: Dict[str, Listenerv2] = {}
    scheme: Optional[str]
    security_groups: list[str] = []
    # Key: ZoneName, Value: SubnetId
    availability_zones: Dict[str, str] = {}
    tags: Optional[list] = []
```

--------------------------------------------------------------------------------

````
