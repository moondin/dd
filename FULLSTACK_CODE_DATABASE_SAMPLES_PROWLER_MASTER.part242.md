---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 242
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 242 of 867)

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

---[FILE: awslambda_function_not_publicly_accessible.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/awslambda/awslambda_function_not_publicly_accessible/awslambda_function_not_publicly_accessible.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "awslambda_function_not_publicly_accessible",
  "CheckTitle": "Lambda function resource-based policy does not allow public access",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "awslambda",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "AwsLambdaFunction",
  "Description": "**AWS Lambda** function resource-based policies are assessed for **public access**. The finding identifies policies with wildcard or empty `Principal` that allow actions like `lambda:InvokeFunction` to any principal.",
  "Risk": "**Public invocation** lets outsiders run code under the function's IAM role.\n\nImpacts:\n- **Confidentiality**: data exfiltration via backend access\n- **Integrity**: unauthorized state changes from side effects\n- **Availability/cost**: invocation floods causing throttling and spend spikes",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/config/latest/developerguide/lambda-function-public-access-prohibited.html",
    "https://docs.aws.amazon.com/lambda/latest/dg/access-control-resource-based.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/lambda-controls.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/Lambda/function-exposed.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws lambda remove-permission --function-name <example_function_name> --statement-id <example_statement_id>",
      "NativeIaC": "```yaml\n# CloudFormation: restrict Lambda permission to a non-public principal\nResources:\n  <example_resource_name>Permission:\n    Type: AWS::Lambda::Permission\n    Properties:\n      Action: lambda:InvokeFunction\n      FunctionName: <example_resource_name>\n      Principal: 123456789012  # Critical: not \"*\"; limits invoke permission to a specific account to prevent public access\n```",
      "Other": "1. Open the AWS Lambda console and select the function\n2. Go to Configuration > Permissions\n3. Under Resource-based policy, view the policy statements\n4. Find any statement with Principal set to \"*\" (or { \"AWS\": \"*\" })\n5. Delete that statement and save\n6. If access is needed, re-add a permission for a specific principal only (for example, an AWS account ID or a service principal)",
      "Terraform": "```hcl\n# Restrict Lambda permission to a non-public principal\nresource \"aws_lambda_permission\" \"<example_resource_name>\" {\n  statement_id  = \"AllowSpecificPrincipal\"\n  action        = \"lambda:InvokeFunction\"\n  function_name = \"<example_resource_name>\"\n  principal     = \"123456789012\"  # Critical: not \"*\"; prevents public access\n}\n```"
    },
    "Recommendation": {
      "Text": "Remove public principals from function policies. Grant access only to specific accounts, roles, or services using fixed ARNs and **least privilege**. Add conditions like `AWS:SourceAccount` and `AWS:SourceArn` to constrain service triggers. Enforce **separation of duties** and monitor access for **defense in depth**.",
      "Url": "https://hub.prowler.com/check/awslambda_function_not_publicly_accessible"
    }
  },
  "Categories": [
    "internet-exposed"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "It gives a false positive if the function is exposed publicly by an other public resource like an ALB or API Gateway in an AWS Account when an AWS account ID is set as the principal of the policy."
}
```

--------------------------------------------------------------------------------

---[FILE: awslambda_function_not_publicly_accessible.py]---
Location: prowler-master/prowler/providers/aws/services/awslambda/awslambda_function_not_publicly_accessible/awslambda_function_not_publicly_accessible.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.awslambda.awslambda_client import awslambda_client
from prowler.providers.aws.services.iam.lib.policy import is_policy_public


class awslambda_function_not_publicly_accessible(Check):
    def execute(self):
        findings = []
        for function in awslambda_client.functions.values():
            if function.policy is None:
                continue
            report = Check_Report_AWS(metadata=self.metadata(), resource=function)

            report.status = "PASS"
            report.status_extended = f"Lambda function {function.name} has a resource-based policy without public access."
            if is_policy_public(
                function.policy,
                awslambda_client.audited_account,
                is_cross_account_allowed=True,
            ):
                report.status = "FAIL"
                report.status_extended = f"Lambda function {function.name} has a resource-based policy with public access."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: awslambda_function_not_publicly_accessible_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/awslambda/awslambda_function_not_publicly_accessible/awslambda_function_not_publicly_accessible_fixer.py

```python
import json

from prowler.lib.logger import logger
from prowler.providers.aws.services.awslambda.awslambda_client import awslambda_client


def fixer(resource_id: str, region: str) -> bool:
    """
    Remove the Lambda function's resource-based policy to prevent public access and add a new permission for the account.
    Specifically, this fixer deletes all permission statements associated with the Lambda function's policy and then adds a new permission.
    Requires the lambda:RemovePermission and lambda:AddPermission permissions.
    Permissions:
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "lambda:RemovePermission",
                "Resource": "*"
            },
            {
                "Effect": "Allow",
                "Action": "lambda:AddPermission",
                "Resource": "*"
            }
        ]
    }
    Args:
        resource_id (str): The Lambda function name or ARN.
        region (str): AWS region where the Lambda function exists.
    Returns:
        bool: True if the operation is successful (policy removed and permission added), False otherwise.
    """
    try:
        account_id = awslambda_client.audited_account

        regional_client = awslambda_client.regional_clients[region]
        policy_response = regional_client.get_policy(FunctionName=resource_id)
        policy = json.loads(policy_response.get("Policy"))

        for statement in policy.get("Statement", []):
            statement_id = statement.get("Sid")
            if statement_id:
                regional_client.remove_permission(
                    FunctionName=resource_id, StatementId=statement_id
                )

        regional_client.add_permission(
            FunctionName=resource_id,
            StatementId="ProwlerFixerStatement",
            Principal=account_id,
            Action="lambda:InvokeFunction",
        )

    except Exception as error:
        logger.error(
            f"{region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
        )
        return False
    else:
        return True
```

--------------------------------------------------------------------------------

---[FILE: awslambda_function_no_secrets_in_code.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/awslambda/awslambda_function_no_secrets_in_code/awslambda_function_no_secrets_in_code.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "awslambda_function_no_secrets_in_code",
  "CheckTitle": "Lambda function code contains no hardcoded secrets",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Sensitive Data Identifications/Passwords",
    "Effects/Data Exposure"
  ],
  "ServiceName": "awslambda",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "AwsLambdaFunction",
  "Description": "**Lambda function code** is analyzed for **embedded secrets** across files in the deployment package, detecting patterns like API keys, passwords, tokens, and connection strings. Findings reference file names and line numbers where potential secrets appear.",
  "Risk": "**Hardcoded secrets** undermine confidentiality and integrity: if code, layers, or artifacts are exposed, attackers can reuse credentials to access databases, APIs, or cloud resources, enabling data exfiltration and unauthorized changes.\n\nRotation is harder, increasing dwell time and blast radius of compromises.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html",
    "https://aws.amazon.com/blogs/security/how-to-securely-provide-database-credentials-to-lambda-functions-by-using-aws-secrets-manager/",
    "https://www.cloudcurls.com/2025/08/how-to-manage-secrets-securely-with-aws-secrets-manager.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. In AWS Secrets Manager, click Store a new secret and create a secret for the value you hardcoded. Note the secret name/ARN.\n2. In IAM > Roles, open your Lambda execution role and add an inline policy allowing secretsmanager:GetSecretValue on that secret only.\n3. Edit your Lambda function code to remove the hardcoded value and retrieve it at runtime using the AWS SDK (GetSecretValue) with the secret name/ARN.\n4. Deploy the updated function code.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Use **AWS Secrets Manager** (or Parameter Store) to store secrets and retrieve at runtime; never put them in code or Lambda env vars.\n- Apply **least privilege** IAM\n- Enable **rotation**\n- Prevent secret logging; encrypt\n- Add CI/CD secret scanning",
      "Url": "https://hub.prowler.com/check/awslambda_function_no_secrets_in_code"
    }
  },
  "Categories": [
    "secrets"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: awslambda_function_no_secrets_in_code.py]---
Location: prowler-master/prowler/providers/aws/services/awslambda/awslambda_function_no_secrets_in_code/awslambda_function_no_secrets_in_code.py

```python
import os
import tempfile

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.lib.utils.utils import detect_secrets_scan
from prowler.providers.aws.services.awslambda.awslambda_client import awslambda_client


class awslambda_function_no_secrets_in_code(Check):
    def execute(self):
        findings = []
        if awslambda_client.functions:
            secrets_ignore_patterns = awslambda_client.audit_config.get(
                "secrets_ignore_patterns", []
            )
            for function, function_code in awslambda_client._get_function_code():
                if function_code:
                    report = Check_Report_AWS(
                        metadata=self.metadata(), resource=function
                    )

                    report.status = "PASS"
                    report.status_extended = (
                        f"No secrets found in Lambda function {function.name} code."
                    )
                    with tempfile.TemporaryDirectory() as tmp_dir_name:
                        function_code.code_zip.extractall(tmp_dir_name)
                        # List all files
                        files_in_zip = next(os.walk(tmp_dir_name))[2]
                        secrets_findings = []
                        for file in files_in_zip:
                            detect_secrets_output = detect_secrets_scan(
                                file=f"{tmp_dir_name}/{file}",
                                excluded_secrets=secrets_ignore_patterns,
                                detect_secrets_plugins=awslambda_client.audit_config.get(
                                    "detect_secrets_plugins",
                                ),
                            )
                            if detect_secrets_output:
                                for (
                                    secret
                                ) in (
                                    detect_secrets_output
                                ):  # Appears that only 1 file is being scanned at a time, so could rework this
                                    output_file_name = secret["filename"].replace(
                                        f"{tmp_dir_name}/", ""
                                    )
                                    secrets_string = ", ".join(
                                        [
                                            f"{secret['type']} on line {secret['line_number']}"
                                            for secret in detect_secrets_output
                                        ]
                                    )
                                    secrets_findings.append(
                                        f"{output_file_name}: {secrets_string}"
                                    )

                        if secrets_findings:
                            final_output_string = "; ".join(secrets_findings)
                            report.status = "FAIL"
                            report.status_extended = f"Potential {'secrets' if len(secrets_findings) > 1 else 'secret'} found in Lambda function {function.name} code -> {final_output_string}."

                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: awslambda_function_no_secrets_in_variables.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/awslambda/awslambda_function_no_secrets_in_variables/awslambda_function_no_secrets_in_variables.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "awslambda_function_no_secrets_in_variables",
  "CheckTitle": "Lambda function environment variables do not contain secrets",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Sensitive Data Identifications/Passwords",
    "Effects/Data Exposure"
  ],
  "ServiceName": "awslambda",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "AwsLambdaFunction",
  "Description": "AWS Lambda function environment variables are analyzed for content that resembles **secrets** (API keys, tokens, passwords). Pattern-based detection highlights potential hardcoded credentials present in the function's environment.",
  "Risk": "Secrets in Lambda environment variables weaken **confidentiality**: users with config read access, runtime introspection, or logs may obtain them. Exposure can grant access to downstream systems, enable **lateral movement**, and allow tampering, impacting **integrity** and **availability**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html",
    "https://support.icompaas.com/support/solutions/articles/62000129505-ensure-there-are-no-secrets-in-lambda-functions-variables"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws lambda update-function-configuration --region <REGION> --function-name <FUNCTION_NAME> --environment \"Variables={}\"",
      "NativeIaC": "```yaml\nResources:\n  <example_resource_name>:\n    Type: AWS::Lambda::Function\n    Properties:\n      Environment:\n        Variables: {}  # CRITICAL: clears environment variables to ensure no secrets are stored\n```",
      "Other": "1. Open the AWS Lambda console and select the function\n2. Go to Configuration > Environment variables\n3. Click Edit\n4. Delete variables that contain secrets (or remove all variables)\n5. Click Save",
      "Terraform": "```hcl\nresource \"aws_lambda_function\" \"<example_resource_name>\" {\n  environment {\n    variables = {} # CRITICAL: remove all env vars so no secrets are present\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Do not store secrets in environment variables or code. Use **AWS Secrets Manager** or **Parameter Store** with encryption, fetch at runtime using **least privilege** IAM, and prefer short-lived creds via **IAM roles**.\n\nRotate keys, limit configuration read access, and apply **defense in depth** with logging and alerts for secret access.",
      "Url": "https://hub.prowler.com/check/awslambda_function_no_secrets_in_variables"
    }
  },
  "Categories": [
    "secrets"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: awslambda_function_no_secrets_in_variables.py]---
Location: prowler-master/prowler/providers/aws/services/awslambda/awslambda_function_no_secrets_in_variables/awslambda_function_no_secrets_in_variables.py

```python
import json

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.lib.utils.utils import detect_secrets_scan
from prowler.providers.aws.services.awslambda.awslambda_client import awslambda_client


class awslambda_function_no_secrets_in_variables(Check):
    def execute(self):
        findings = []
        secrets_ignore_patterns = awslambda_client.audit_config.get(
            "secrets_ignore_patterns", []
        )
        for function in awslambda_client.functions.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=function)

            report.status = "PASS"
            report.status_extended = (
                f"No secrets found in Lambda function {function.name} variables."
            )

            if function.environment:
                detect_secrets_output = detect_secrets_scan(
                    data=json.dumps(function.environment, indent=2),
                    excluded_secrets=secrets_ignore_patterns,
                    detect_secrets_plugins=awslambda_client.audit_config.get(
                        "detect_secrets_plugins",
                    ),
                )
                original_env_vars = []
                for name, value in function.environment.items():
                    original_env_vars.append(name)
                if detect_secrets_output:
                    secrets_string = ", ".join(
                        [
                            f"{secret['type']} in variable {original_env_vars[secret['line_number'] - 2]}"
                            for secret in detect_secrets_output
                        ]
                    )
                    report.status = "FAIL"
                    report.status_extended = f"Potential secret found in Lambda function {function.name} variables -> {secrets_string}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: awslambda_function_url_cors_policy.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/awslambda/awslambda_function_url_cors_policy/awslambda_function_url_cors_policy.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "awslambda_function_url_cors_policy",
  "CheckTitle": "Lambda function URL CORS does not allow wildcard origins (*)",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Effects/Data Exposure"
  ],
  "ServiceName": "awslambda",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsLambdaFunction",
  "Description": "**Lambda function URL** CORS policy is reviewed for `AllowOrigins`. The presence of `*` indicates a wide origin allowance in the CORS configuration.",
  "Risk": "**Wildcard origins** allow any website to call the endpoint from a browser and read responses, weakening origin isolation.\n\nThis can lead to data exposure (C) and unauthorized actions (I) if state-changing methods are reachable, enabling scripted abuse and cross-origin attacks.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://support.icompaas.com/support/solutions/articles/62000229584-ensure-lambda-function-url-cors-configurations-were-checked",
    "https://docs.aws.amazon.com/lambda/latest/api/API_Cors.html",
    "https://tutorialsdojo.com/how-to-configure-aws-lambda-function-url-with-cross-origin-resource-sharing/",
    "https://dev.to/rimutaka/aws-lambda-function-url-with-cors-explained-by-example-14df"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws lambda update-function-url-config --function-name <example_resource_name> --cors AllowOrigins=https://www.example.com",
      "NativeIaC": "```yaml\n# CloudFormation: restrict Lambda Function URL CORS to a specific origin\nResources:\n  FunctionUrl:\n    Type: AWS::Lambda::Url\n    Properties:\n      TargetFunctionArn: <example_resource_arn>\n      AuthType: AWS_IAM\n      Cors:\n        AllowOrigins:\n          - https://www.example.com  # Critical: removes '*' wildcard by allowing only this origin\n```",
      "Other": "1. In the AWS Console, go to Lambda > Functions and select <example_resource_name>\n2. Open Configuration > Function URL > Edit\n3. In CORS, remove '*' from Allowed origins and enter https://www.example.com\n4. Save changes",
      "Terraform": "```hcl\n# Terraform: restrict Lambda Function URL CORS to a specific origin\nresource \"aws_lambda_function_url\" \"example\" {\n  function_name      = \"<example_resource_name>\"\n  authorization_type = \"AWS_IAM\"\n  cors {\n    allow_origins = [\"https://www.example.com\"] # Critical: removes '*' wildcard by allowing only this origin\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Apply least privilege to CORS:\n- Restrict `AllowOrigins` to trusted domains; avoid `*`\n- Limit `AllowMethods`/`AllowHeaders`; disable `AllowCredentials` unless required\n- Prefer authenticated access (e.g., `AWS_IAM`) and enforce resource policies for defense in depth",
      "Url": "https://hub.prowler.com/check/awslambda_function_url_cors_policy"
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

---[FILE: awslambda_function_url_cors_policy.py]---
Location: prowler-master/prowler/providers/aws/services/awslambda/awslambda_function_url_cors_policy/awslambda_function_url_cors_policy.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.awslambda.awslambda_client import awslambda_client


class awslambda_function_url_cors_policy(Check):
    def execute(self):
        findings = []
        for function in awslambda_client.functions.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=function)

            if function.url_config:
                if "*" in function.url_config.cors_config.allow_origins:
                    report.status = "FAIL"
                    report.status_extended = f"Lambda function {function.name} URL has a wide CORS configuration."
                else:
                    report.status = "PASS"
                    report.status_extended = f"Lambda function {function.name} does not have a wide CORS configuration."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: awslambda_function_url_public.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/awslambda/awslambda_function_url_public/awslambda_function_url_public.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "awslambda_function_url_public",
  "CheckTitle": "Lambda function URL is not publicly accessible",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Effects/Data Exposure"
  ],
  "ServiceName": "awslambda",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsLambdaFunction",
  "Description": "**AWS Lambda function URLs** are assessed to determine whether `AuthType` enforces **AWS IAM authentication** or permits **public invocation**.\n\nApplies to functions with a function URL and highlights when requests must be authenticated and authorized via IAM principals.",
  "Risk": "An unauthenticated function URL lets anyone invoke code:\n- Confidentiality: data exposure\n- Integrity: unintended changes via over-privileged logic\n- Availability: DoS/denial-of-wallet through high request rates\n\nAttackers can script calls, exfiltrate data, and pivot using the function's permissions.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/Lambda/iam-auth-function-url.html",
    "https://www.roastdev.com/post/aws-lambda-url-invocations-with-iam-authentication-and-throttling-limits",
    "https://docs.aws.amazon.com/secretsmanager/latest/userguide/lambda-functions.html",
    "https://dev.to/aws-builders/hands-on-aws-lambda-function-url-with-aws-iam-authentication-type-180g",
    "https://www.rahulpnath.com/blog/how-to-secure-and-authenticate-lambda-function-urls/"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws lambda update-function-url-config --function-name <FUNCTION_NAME> --auth-type AWS_IAM",
      "NativeIaC": "```yaml\n# CloudFormation: set Lambda Function URL to require IAM auth\nResources:\n  FunctionUrl:\n    Type: AWS::Lambda::Url\n    Properties:\n      TargetFunctionArn: arn:aws:lambda:<region>:<account-id>:function/<example_resource_name>\n      AuthType: AWS_IAM  # CRITICAL: requires IAM authentication, preventing public access\n```",
      "Other": "1. In AWS Console, go to Lambda > Functions and open <example_resource_name>\n2. Select Configuration > Function URL > Edit\n3. Set Auth type to AWS_IAM\n4. Click Save",
      "Terraform": "```hcl\n# Set Lambda Function URL to require IAM authentication\nresource \"aws_lambda_function_url\" \"example\" {\n  function_name      = \"<example_resource_name>\"\n  authorization_type = \"AWS_IAM\"  # CRITICAL: blocks public access by requiring IAM auth\n}\n```"
    },
    "Recommendation": {
      "Text": "Enforce `AWS_IAM` on function URLs and apply **least privilege**:\n- Grant `lambda:InvokeFunctionUrl` only to required principals\n- Avoid `*` principals or broad conditions\n- Limit CORS to trusted origins and methods\n- Set reserved concurrency to contain abuse\n\nConsider **defense in depth** (WAF/CDN or private access) for Internet use.",
      "Url": "https://hub.prowler.com/check/awslambda_function_url_public"
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

---[FILE: awslambda_function_url_public.py]---
Location: prowler-master/prowler/providers/aws/services/awslambda/awslambda_function_url_public/awslambda_function_url_public.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.awslambda.awslambda_client import awslambda_client
from prowler.providers.aws.services.awslambda.awslambda_service import AuthType


class awslambda_function_url_public(Check):
    def execute(self):
        findings = []
        for function in awslambda_client.functions.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=function)

            if function.url_config:
                if function.url_config.auth_type == AuthType.AWS_IAM:
                    report.status = "PASS"
                    report.status_extended = f"Lambda function {function.name} does not have a publicly accessible function URL."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"Lambda function {function.name} has a publicly accessible function URL."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: awslambda_function_using_supported_runtimes.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/awslambda/awslambda_function_using_supported_runtimes/awslambda_function_using_supported_runtimes.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "awslambda_function_using_supported_runtimes",
  "CheckTitle": "Lambda function uses a supported runtime",
  "CheckType": [
    "Software and Configuration Checks/Patch Management",
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "awslambda",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsLambdaFunction",
  "Description": "**Lambda functions** using **obsolete runtimes**-such as `python3.8`, `nodejs14.x`, `go1.x`, `ruby2.7`-are identified against a curated list of deprecated runtime identifiers.",
  "Risk": "Unmaintained runtimes lack security patches, exposing code and libraries to known CVEs (**confidentiality, integrity**).\n\nDeprecation can block create/update and break builds, causing failed deployments or runtime errors (**availability**). Tooling may stop supporting builds, slowing fixes and recovery.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://aws.amazon.com/blogs/compute/managing-aws-lambda-runtime-upgrades/",
    "https://docs.aws.amazon.com/lambda/latest/dg/runtime-support-policy.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/Lambda/supported-runtime-environment.html",
    "https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws lambda update-function-configuration --function-name <FUNCTION_NAME> --runtime <SUPPORTED_RUNTIME>",
      "NativeIaC": "```yaml\n# CloudFormation: set Lambda to a supported runtime\nResources:\n  <example_resource_name>:\n    Type: AWS::Lambda::Function\n    Properties:\n      Role: <example_role_arn>\n      Handler: <example_handler>\n      Runtime: <SUPPORTED_RUNTIME>  # FIX: change to a supported runtime (e.g., python3.12) to pass the check\n      Code:\n        S3Bucket: <example_bucket_name>\n        S3Key: <example_object_key>\n```",
      "Other": "1. Open the AWS Lambda console and select the function\n2. Go to Configuration > Runtime settings > Edit\n3. In Runtime, choose a supported runtime (e.g., python3.12) and click Save",
      "Terraform": "```hcl\n# Set Lambda to a supported runtime\nresource \"aws_lambda_function\" \"<example_resource_name>\" {\n  function_name = \"<example_resource_name>\"\n  role          = \"<example_role_arn>\"\n  handler       = \"<example_handler>\"\n  runtime       = \"<SUPPORTED_RUNTIME>\" # FIX: use a supported runtime (e.g., python3.12) to pass the check\n  filename      = \"<example_package.zip>\"\n}\n```"
    },
    "Recommendation": {
      "Text": "Upgrade to **supported LTS runtimes** (AL2/AL2023) and include runtime upgrades in a secure SDLC.\n\nTest in staging, deploy via versions/aliases, and keep dependencies current. Monitor deprecation notices. Apply guardrails to block deprecated `runtime` values and allow only approved runtimes, aligning with **defense in depth**.",
      "Url": "https://hub.prowler.com/check/awslambda_function_using_supported_runtimes"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: awslambda_function_using_supported_runtimes.py]---
Location: prowler-master/prowler/providers/aws/services/awslambda/awslambda_function_using_supported_runtimes/awslambda_function_using_supported_runtimes.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.awslambda.awslambda_client import awslambda_client

default_obsolete_lambda_runtimes = [
    "java8",
    "go1.x",
    "provided",
    "python3.6",
    "python2.7",
    "python3.7",
    "python3.8",
    "nodejs4.3",
    "nodejs4.3-edge",
    "nodejs6.10",
    "nodejs",
    "nodejs8.10",
    "nodejs10.x",
    "nodejs12.x",
    "nodejs14.x",
    "nodejs16.x",
    "dotnet5.0",
    "dotnet6",
    "dotnet7",
    "dotnetcore1.0",
    "dotnetcore2.0",
    "dotnetcore2.1",
    "dotnetcore3.1",
    "ruby2.5",
    "ruby2.7",
]


class awslambda_function_using_supported_runtimes(Check):
    def execute(self):
        findings = []
        for function in awslambda_client.functions.values():
            if function.runtime:
                report = Check_Report_AWS(metadata=self.metadata(), resource=function)

                if function.runtime in awslambda_client.audit_config.get(
                    "obsolete_lambda_runtimes", default_obsolete_lambda_runtimes
                ):
                    report.status = "FAIL"
                    report.status_extended = f"Lambda function {function.name} is using {function.runtime} which is obsolete."
                else:
                    report.status = "PASS"
                    report.status_extended = f"Lambda function {function.name} is using {function.runtime} which is supported."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: awslambda_function_vpc_multi_az.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/awslambda/awslambda_function_vpc_multi_az/awslambda_function_vpc_multi_az.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "awslambda_function_vpc_multi_az",
  "CheckTitle": "Lambda function is configured with VPC subnets in at least two Availability Zones",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability"
  ],
  "ServiceName": "awslambda",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsLambdaFunction",
  "Description": "**AWS Lambda** functions attached to a VPC use subnets that span at least the required number of **Availability Zones** (`2` by default).\n\nThe evaluation counts the unique AZs of the function's configured subnets.",
  "Risk": "Single-AZ placement limits **availability**. An AZ outage or subnet/IP exhaustion can block ENI creation and VPC access, causing failed invocations, timeouts, and event backlogs.\n\nThis degrades uptime and can delay processing of critical events.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/lambda/latest/operatorguide/networking-vpc.html",
    "https://stackzonecom.tawk.help/article/aws-config-rule-lambda-vpc-multi-az-check",
    "https://stackoverflow.com/questions/62052490/why-aws-lambda-suggests-to-set-up-two-subnets-if-vpc-is-configured",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/lambda-controls.html#lambda-5"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws lambda update-function-configuration --function-name <example_resource_name> --vpc-config SubnetIds=<subnet_id_az1>,<subnet_id_az2>,SecurityGroupIds=<example_security_group_id>",
      "NativeIaC": "```yaml\nResources:\n  <example_resource_name>:\n    Type: AWS::Lambda::Function\n    Properties:\n      Role: <example_role_arn>\n      Handler: index.handler\n      Runtime: python3.12\n      Code:\n        ZipFile: |\n          def handler(event, context):\n            return \"\"\n      VpcConfig:\n        SecurityGroupIds:\n          - <example_security_group_id>\n        SubnetIds:\n          - <subnet_id_az1>  # Critical: select subnets in different AZs\n          - <subnet_id_az2>  # Critical: ensures function operates in >=2 AZs\n```",
      "Other": "1. Open the Lambda console and select the function\n2. Go to Configuration > VPC > Edit\n3. Select the target VPC and choose at least two subnets in different Availability Zones\n4. Select a security group\n5. Click Save",
      "Terraform": "```hcl\nresource \"aws_lambda_function\" \"<example_resource_name>\" {\n  function_name = \"<example_resource_name>\"\n  role          = \"<example_role_arn>\"\n  handler       = \"index.handler\"\n  runtime       = \"python3.12\"\n  filename      = \"function.zip\"\n\n  vpc_config {\n    subnet_ids         = [\"<subnet_id_az1>\", \"<subnet_id_az2>\"] # Critical: subnets in different AZs\n    security_group_ids = [\"<example_security_group_id>\"]\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Distribute VPC-connected functions across subnets in `2` distinct AZs to ensure **fault tolerance**.\n- Choose subnets from different AZs\n- Avoid AZ-pinned configs or fixed IPs\n- Provide per-AZ egress/endpoints and routing\n- Regularly test AZ failover\nAligns with **resilience** and **defense in depth**.",
      "Url": "https://hub.prowler.com/check/awslambda_function_vpc_multi_az"
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

---[FILE: awslambda_function_vpc_multi_az.py]---
Location: prowler-master/prowler/providers/aws/services/awslambda/awslambda_function_vpc_multi_az/awslambda_function_vpc_multi_az.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.awslambda.awslambda_client import awslambda_client
from prowler.providers.aws.services.awslambda.awslambda_function_inside_vpc.awslambda_function_inside_vpc import (
    awslambda_function_inside_vpc,
)
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class awslambda_function_vpc_multi_az(Check):
    def execute(self) -> list[Check_Report_AWS]:
        findings = []
        LAMBDA_MIN_AZS = awslambda_client.audit_config.get("lambda_min_azs", 2)
        for function_arn, function in awslambda_client.functions.items():
            # only proceed if check "awslambda_function_inside_vpc" did not run or did not FAIL to avoid to report that the function is not inside a VPC twice
            if not awslambda_client.is_failed_check(
                awslambda_function_inside_vpc.__name__,
                function_arn,
            ):
                report = Check_Report_AWS(metadata=self.metadata(), resource=function)

                report.status = "FAIL"
                report.status_extended = (
                    f"Lambda function {function.name} is not inside a VPC."
                )

                if function.vpc_id:
                    function_availability_zones = {
                        getattr(
                            vpc_client.vpc_subnets.get(subnet_id),
                            "availability_zone",
                            None,
                        )
                        for subnet_id in function.subnet_ids
                        if subnet_id in vpc_client.vpc_subnets
                    }

                    if len(function_availability_zones) >= LAMBDA_MIN_AZS:
                        report.status = "PASS"
                        report.status_extended = f"Lambda function {function.name} is inside of VPC {function.vpc_id} that spans in at least {LAMBDA_MIN_AZS} AZs: {', '.join(function_availability_zones)}."
                    else:
                        report.status_extended = f"Lambda function {function.name} is inside of VPC {function.vpc_id} that spans only in {len(function_availability_zones)} AZs: {', '.join(function_availability_zones)}. Must span in at least {LAMBDA_MIN_AZS} AZs."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: backup_client.py]---
Location: prowler-master/prowler/providers/aws/services/backup/backup_client.py

```python
from prowler.providers.aws.services.backup.backup_service import Backup
from prowler.providers.common.provider import Provider

backup_client = Backup(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

````
