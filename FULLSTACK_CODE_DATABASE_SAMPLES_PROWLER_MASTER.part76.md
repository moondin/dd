---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 76
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 76 of 867)

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

---[FILE: aws-details.mdx]---
Location: prowler-master/docs/developer-guide/aws-details.mdx

```text
---
title: 'AWS Provider'
---

In this page you can find all the details about [Amazon Web Services (AWS)](https://aws.amazon.com/) provider implementation in Prowler.

By default, Prowler will audit just one account and organization settings per scan. To configure it, follow the [AWS getting started guide](/user-guide/providers/aws/getting-started-aws).

## AWS Provider Classes Architecture

The AWS provider implementation follows the general [Provider structure](/developer-guide/provider). This section focuses on the AWS-specific implementation, highlighting how the generic provider concepts are realized for AWS in Prowler. For a full overview of the provider pattern, base classes, and extension guidelines, see [Provider documentation](/developer-guide/provider). In next subsection you can find a list of the main classes of the AWS provider.

### `AwsProvider` (Main Class)

- **Location:** [`prowler/providers/aws/aws_provider.py`](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/aws/aws_provider.py)
- **Base Class:** Inherits from `Provider` (see [base class details](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/common/provider.py)).
- **Purpose:** Central orchestrator for AWS-specific logic, session management, credential validation, role assumption, region and organization discovery, and configuration.
- **Key AWS Responsibilities:**
    - Initializes and manages AWS sessions (with or without role assumption, MFA, etc.).
    - Validates credentials and sets up the AWS identity context.
    - Loads and manages configuration, mutelist, and fixer settings.
    - Discovers enabled AWS regions and organization metadata.
    - Provides properties and methods for downstream AWS service classes to access session, identity, and configuration data.

### Data Models

- **Location:** [`prowler/providers/aws/models.py`](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/aws/models.py)
- **Purpose:** Define structured data for AWS identity, session, credentials, organization info, and more.
- **Key AWS Models:**
    - `AWSOrganizationsInfo`: Holds AWS Organizations metadata, to be used by the checks.
    - `AWSCredentials`, `AWSAssumeRoleInfo`, `AWSAssumeRoleConfiguration`: Used for role assumption and session management.
    - `AWSIdentityInfo`: Stores account, user, partition, and region context for the scan.
    - `AWSSession`: Wraps the current and original [boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html) sessions and config.

### `AWSService` (Service Base Class)

- **Location:** [`prowler/providers/aws/lib/service/service.py`](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/aws/lib/service/service.py)
- **Purpose:** Abstract base class that all AWS service-specific classes inherit from. This implements the generic service pattern (described in [service page](/developer-guide/services#service-base-class)) specifically for AWS.
- **Key AWS Responsibilities:**
    - Receives an `AwsProvider` instance to access session, identity, and configuration.
    - Manages clients for all services by regions.
    - Provides `__threading_call__` method to make boto3 calls in parallel. By default, this calls are made by region, but it can be overridden with the first parameter of the method and use by resource.
    - Exposes common audit context (`audited_account`, `audited_account_arn`, `audited_partition`, `audited_resources`) to subclasses.

### Exception Handling

- **Location:** [`prowler/providers/aws/exceptions/exceptions.py`](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/aws/exceptions/exceptions.py)
- **Purpose:** Custom exception classes for AWS-specific error handling, such as credential and role errors.

### Session and Utility Helpers

- **Location:** [`prowler/providers/aws/lib/`](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/aws/lib/)
- **Purpose:** Helpers for session setup, ARN parsing, mutelist management, and other cross-cutting concerns.

## Specific Patterns in AWS Services

The generic service pattern is described in [service page](/developer-guide/services#service-structure-and-initialisation). You can find all the right now implemented services in the following locations:

- Directly in the code, in location [`prowler/providers/aws/services/`](https://github.com/prowler-cloud/prowler/tree/master/prowler/providers/aws/services)
- In the [Prowler Hub](https://hub.prowler.com/). For a more human-readable view.

The best reference to understand how to implement a new service is following the [service implementation documentation](/developer-guide/services#adding-a-new-service) and taking other services already implemented as reference. In next subsection you can find a list of common patterns that are used accross all AWS services.

### AWS Service Common Patterns

- Services communicate with AWS using boto3, you can find the documentation with all the services [here](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/index.html).
- Every AWS service class inherits from `AWSService`, ensuring access to session, identity, configuration, and threading utilities.
- The constructor (`__init__`) always calls `super().__init__` with the service name and provider (e.g. `super().__init__(__class__.__name__, provider))`). Ensure that the service name in boto3 is the same that you use in the constructor. Usually is used the `__class__.__name__` to get the service name because it is the same as the class name.
- Resource containers **must** be initialized in the constructor. They should be dictionaries, with the key being the resource ARN or equivalent unique identifier and the value being the resource object.
- Resource discovery and attribute collection are parallelized using `self.__threading_call__`, typically by region or resource, for performance. The first parameter of the method is the iterator, if not provided, it will be the region; but if present indicate an array of the resources to be processed.
- Resource filtering is consistently enforced using `self.audit_resources` attribute and `is_resource_filtered` function, it is used to see if user has provided some resource that is not in the audit scope, so we can skip it in the service logic. Normally it is used befor storing the resource in the service container as follows: `if not self.audit_resources or (is_resource_filtered(resource["arn"], self.audit_resources)):`.
- All AWS resources are represented as Pydantic `BaseModel` classes, providing type safety and structured access to resource attributes.
- AWS API calls are wrapped in try/except blocks, with specific handling for `ClientError` and generic exceptions, always logging errors.
- If ARN is not present for some resource, it can be constructed using string interpolation, always including partition, service, region, account, and resource ID.
- Tags and additional attributes that cannot be retrieved from the default call, should be collected and stored for each resource using dedicated methods and threading using the resource object list as iterator.

## Specific Patterns in AWS Checks

The AWS checks pattern is described in [checks page](/developer-guide/checks). You can find all the right now implemented checks:

- Directly in the code, within each service folder, each check has its own folder named after the name of the check. (e.g. [`prowler/providers/aws/services/s3/s3_bucket_acl_prohibited/`](https://github.com/prowler-cloud/prowler/tree/master/prowler/providers/aws/services/s3/s3_bucket_acl_prohibited))
- In the [Prowler Hub](https://hub.prowler.com/). For a more human-readable view.

The best reference to understand how to implement a new check is following the [check creation documentation](/developer-guide/checks#creating-a-check) and taking other similar checks as reference.

### Check Report Class

The `Check_Report_AWS` class models a single finding for an AWS resource in a check report. It is defined in [`prowler/lib/check/models.py`](https://github.com/prowler-cloud/prowler/blob/master/prowler/lib/check/models.py) and inherits from the generic `Check_Report` base class.

#### Purpose

`Check_Report_AWS` extends the base report structure with AWS-specific fields, enabling detailed tracking of the resource, ARN, and region associated with each finding.

#### Constructor and Attribute Population

When you instantiate `Check_Report_AWS`, you must provide the check metadata and a resource object. The class will attempt to automatically populate its AWS-specific attributes from the resource, using the following logic (in order of precedence):

- **`resource_id`**:
    - Uses `resource.id` if present.
    - Otherwise, uses `resource.name` if present.
    - Defaults to an empty string if none are available.

- **`resource_arn`**:
    - Uses `resource.arn` if present.
    - Defaults to an empty string if ARN is not present in the resource object.

- **`region`**:
    - Uses `resource.region` if present.
    - Defaults to an empty string if region is not present in the resource object.

If the resource object does not contain the required attributes, you must set them manually in the check logic.

Other attributes are inherited from the `Check_Report` class, from that ones you **always** have to set the `status` and `status_extended` attributes in the check logic.

#### Example Usage

```python
report = Check_Report_AWS(
    metadata=check_metadata,
    resource=resource_object
)
report.status = "PASS"
report.status_extended = "Resource is compliant."
```
```

--------------------------------------------------------------------------------

---[FILE: azure-details.mdx]---
Location: prowler-master/docs/developer-guide/azure-details.mdx

```text
---
title: 'Azure Provider'
---

In this page you can find all the details about [Microsoft Azure](https://azure.microsoft.com/) provider implementation in Prowler.

By default, Prowler will audit all the subscriptions that it is able to list in the Microsoft Entra tenant, and tenant Entra ID service. To configure it, follow the [Azure getting started guide](/user-guide/providers/azure/getting-started-azure).

## Azure Provider Classes Architecture

The Azure provider implementation follows the general [Provider structure](/developer-guide/provider). This section focuses on the Azure-specific implementation, highlighting how the generic provider concepts are realized for Azure in Prowler. For a full overview of the provider pattern, base classes, and extension guidelines, see [Provider documentation](/developer-guide/provider). In next subsection you can find a list of the main classes of the Azure provider.

### `AzureProvider` (Main Class)

- **Location:** [`prowler/providers/azure/azure_provider.py`](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/azure/azure_provider.py)
- **Base Class:** Inherits from `Provider` (see [base class details](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/common/provider.py)).
- **Purpose:** Central orchestrator for Azure-specific logic, session management, credential validation, and configuration.
- **Key Azure Responsibilities:**
    - Initializes and manages Azure sessions (supports Service Principal, CLI, Browser, and Managed Identity authentication).
    - Validates credentials and sets up the Azure identity context.
    - Loads and manages configuration, mutelist, and fixer settings.
    - Retrieves subscription(s) metadata.
    - Provides properties and methods for downstream Azure service classes to access session, identity, and configuration data.

### Data Models

- **Location:** [`prowler/providers/azure/models.py`](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/azure/models.py)
- **Purpose:** Define structured data for Azure identity, session, region configuration, and subscription info.
- **Key Azure Models:**
    - `AzureIdentityInfo`: Holds Azure identity metadata, including tenant ID, domain, subscription names and IDs, and locations.
    - `AzureRegionConfig`: Stores the specific region that will be audited. That can be: Global, US Government or China.
    - `AzureSubscription`: Represents a subscription with ID, display name, and state.

### `AzureService` (Service Base Class)

- **Location:** [`prowler/providers/azure/lib/service/service.py`](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/azure/lib/service/service.py)
- **Purpose:** Abstract base class that all Azure service-specific classes inherit from. This implements the generic service pattern (described in [service page](/developer-guide/services#service-base-class)) specifically for Azure.
- **Key Azure Responsibilities:**
    - Receives an `AzureProvider` instance to access session, identity, and configuration.
    - Manages clients for all services by subscription.
    - Exposes common audit context (`subscriptions`, `locations`, `audit_config`, `fixer_config`) to subclasses.

### Exception Handling

- **Location:** [`prowler/providers/azure/exceptions/exceptions.py`](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/azure/exceptions/exceptions.py)
- **Purpose:** Custom exception classes for Azure-specific error handling, such as credential, region, and session errors.

### Session and Utility Helpers

- **Location:** [`prowler/providers/azure/lib/`](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/azure/lib/)
- **Purpose:** Helpers for argument parsing, region setup, mutelist management, and other cross-cutting concerns.

## Specific Patterns in Azure Services

The generic service pattern is described in [service page](/developer-guide/services#service-structure-and-initialisation). You can find all the currently implemented services in the following locations:

- Directly in the code, in location [`prowler/providers/azure/services/`](https://github.com/prowler-cloud/prowler/tree/master/prowler/providers/azure/services)
- In the [Prowler Hub](https://hub.prowler.com/) for a more human-readable view.

The best reference to understand how to implement a new service is following the [service implementation documentation](/developer-guide/services#adding-a-new-service) and taking other services already implemented as reference. In next subsection you can find a list of common patterns that are used accross all Azure services.

### Azure Service Common Patterns

- Services communicate with Azure using the Azure Python SDK, mainly using the Azure Management Client (except for the Microsoft Entra ID service, that is using the Microsoft Graph API), you can find the documentation with all the management services [here](https://learn.microsoft.com/en-us/python/api/overview/azure/?view=azure-python).
- Every Azure service class inherits from `AzureService`, ensuring access to session, identity, configuration, and client utilities.
- The constructor (`__init__`) always calls `super().__init__` with the service Azure Management Client and Prowler provider object (e.g `super().__init__(WebSiteManagementClient, provider)`).
- Resource containers **must** be initialized in the constructor, and they should be dictionaries, with the key being the subscription ID, the value being a dictionary with the resource ID as key and the resource object as value.
- All Azure resources are represented as Pydantic `BaseModel` classes, providing type safety and structured access to resource attributes. Some are represented as dataclasses due to legacy reasons, but new resources should be represented as Pydantic `BaseModel` classes.
- Azure SDK functions are wrapped in try/except blocks, with specific handling for errors, always logging errors. It is a best practice to create a custom function for every Azure SDK call, in that way we can handle the errors in a more specific way.

## Specific Patterns in Azure Checks

The Azure checks pattern is described in [checks page](/developer-guide/checks). You can find all the currently implemented checks:

- Directly in the code, within each service folder, each check has its own folder named after the name of the check. (e.g. [`prowler/providers/azure/services/storage/storage_blob_public_access_level_is_disabled/`](https://github.com/prowler-cloud/prowler/tree/master/prowler/providers/azure/services/storage/storage_blob_public_access_level_is_disabled))
- In the [Prowler Hub](https://hub.prowler.com/) for a more human-readable view.

The best reference to understand how to implement a new check is the [Azure check implementation documentation](/developer-guide/checks#creating-a-check) and taking other similar checks as reference.

### Check Report Class

The `Check_Report_Azure` class models a single finding for an Azure resource in a check report. It is defined in [`prowler/lib/check/models.py`](https://github.com/prowler-cloud/prowler/blob/master/prowler/lib/check/models.py) and inherits from the generic `Check_Report` base class.

#### Purpose

`Check_Report_Azure` extends the base report structure with Azure-specific fields, enabling detailed tracking of the resource, resource ID, name, subscription, and location associated with each finding.

#### Constructor and Attribute Population

When you instantiate `Check_Report_Azure`, you must provide the check metadata and a resource object. The class will attempt to automatically populate its Azure-specific attributes from the resource, using the following logic (in order of precedence):

- **`resource_id`**:
    - Uses `resource.id` if present.
    - Otherwise, uses `resource.resource_id` if present.
    - Defaults to an empty string if not available.

- **`resource_name`**:
    - Uses `resource.name` if present.
    - Otherwise, uses `resource.resource_name` if present.
    - Defaults to an empty string if not available.

- **`subscription`**:
    - Defaults to an empty string, it **must** be set in the check logic.

- **`location`**:
    - Uses `resource.location` if present.
    - Defaults to an empty string if not available.

If the resource object does not contain the required attributes, you must set them manually in the check logic.

Other attributes are inherited from the `Check_Report` class, from which you **always** have to set the `status` and `status_extended` attributes in the check logic.

#### Example Usage

```python
report = Check_Report_Azure(
    metadata=check_metadata,
    resource=resource_object
)
report.subscription = subscription_id
report.status = "PASS"
report.status_extended = "Resource is compliant."
```
```

--------------------------------------------------------------------------------

---[FILE: check-metadata-guidelines.mdx]---
Location: prowler-master/docs/developer-guide/check-metadata-guidelines.mdx

```text
---
title: 'Check Metadata Guidelines'
---

## Introduction

This guide provides comprehensive guidelines for creating check metadata in Prowler. For basic information on check metadata structure, refer to the [check metadata](/developer-guide/checks#metadata-structure-for-prowler-checks) section.

## Check Title Guidelines

### Writing Guidelines

1. **Determine Resource Finding Scope (Singular vs. Plural)**:
   When determining whether to use singular or plural in the check title, examine the code for certain patterns. If the code contains a loop that generates an individual report for each resource, use the singular form. If the code produces a single report that covers all resources collectively, use the plural form. For organization- or account-wide checks, select the scope that best matches the breadth of the evaluation. Additionally, review the `status_extended` field messages in the code, as they often provide clues about whether the check is scoped to individual resources or to groups of resources.
   Analyze the detection code to determine if the check reports on individual resources or aggregated resources:
    - **Singular**: Use when the check creates one report per resource (e.g., "EC2 instance has IMDSv2 enforced", "S3 bucket does not allow public write access").
    - **Plural**: Use when the check creates one report for all resources together (e.g., "All EC2 instances have IMDSv2 enforced", "S3 buckets do not allow public write access").
2. **Describe the Compliant (*PASS*) State**:
   Always write the title to describe the **desired, compliant state** of the resources. The title should reflect what it looks like when the audited resource is following the check's requirements.
3. **Be Specific and Factual**:
   Include the exact secure configuration being verified. Avoid vague or generic terms like "properly configured".
4. **Avoid Redundant or Action Words**:
   Do not include verbs like "Check", "Verify", "Ensure", or "Monitor". The title is a declarative statement of the secure condition.
5. **Length Limit**:
   Keep the title under 150 characters.

### Common Mistakes to Avoid

- Starting with verbs like "Check", "Verify", "Ensure", "Make sure". Always start with the affected resource instead.
- Being too vague or generic (e.g., "Ensure security groups are properly configured", what does it mean? "properly configured" is not a clear description of the compliant state).
- Focusing on the non-compliant state instead of the compliant state.
- Using unclear scope and resource identification.

## Check Type Guidelines (AWS Only)

### AWS Security Hub Type Format

AWS Security Hub uses a three-part type taxonomy:

- **Namespace**: The top-level security domain.
- **Category**: The security control family or area.
- **Classifier**: The specific security concern (optional).

A partial path may be defined (e.g., `TTPs` or `TTPs/Defense Evasion` are valid).

### Selection Guidelines

1. **Be Specific**: Use the most specific classifier that accurately describes the check.
2. **Standard Compliance**: Consider if the check relates to specific compliance standards.
3. **Multiple Types**: You can specify multiple types if the check addresses multiple concerns.

## Description Guidelines

### Writing Guidelines

1. **Focus on the Finding**: All fields should address how the finding affects the security posture, rather than the control itself.
2. **Use Natural Language**: Write in simple, clear paragraphs with complete, grammatically correct sentences.
3. **Use Markdown Formatting**: Enhance readability with:
   - Use **bold** for emphasis on key security concepts.
   - Use *italic* for a secondary emphasis. Use it for clarifications, conditions, or optional notes. But don't abuse it.
   - Use `code` formatting for specific configuration values, or technical details. Don't use it for service names or common technical terms.
   - Use one or two line breaks (`\n` or `\n\n`) to separate distinct ideas.
   - Use bullet points (`-`) for listing multiple concepts or actions.
   - Use numbers for listing steps or sequential actions.
4. **Be Concise**: Maximum 400 characters (spaces count). Every word should add value.
5. **Explain What the Finding Means**: Focus on what the security control evaluates and what it means when it passes or fails, but without explicitly stating the pass or fail state.
6. **Be Technical but Clear**: Use appropriate technical terminology while remaining understandable.
7. **Avoid Risk Descriptions**: Do not describe potential risks, threats, or consequences.
8. **CheckTitle and Description can be the same**: If the check is very simple and the title is already clear, you can use the same text for the description.

### Common Mistakes to Avoid

- **Technical Implementation Details**: "The control loops through all instances and calls the describe_instances API...".
- **Vague Descriptions**: "This control verifies proper configuration of resources". What does it mean? "proper configuration" is not a clear description of the compliant state.
- **Risk Descriptions**: "This could lead to data breaches" or "This poses a security threat".
- **Starting with Verbs**: "Check if...", "Verify...", "Ensure...". Always start with the affected resource instead.
- **References to Pass/Fail States**: Avoid using words like "pass" or "fail".

## Risk Guidelines

### Writing Guidelines

1. **Explain the Cybersecurity Impact**: Focus on how the finding affects confidentiality, integrity, or availability (CIA triad). If the CIA triad does not apply, explain the risk in terms of the organization's business objectives.
2. **Be Specific About Threats**: Clearly state what could happen if this security control is not in place. What attacks or incidents become possible?
3. **Focus on Risk Context**: Explain the specific security implications of the finding, not just generic security risks.
4. **Use Markdown Formatting**: Enhance readability with markdown formatting:
   - Use **bold** for emphasis on key security concepts.
   - Use *italic* for a secondary emphasis. Use it for clarifications, conditions, or optional notes. But don't abuse it.
   - Use `code` formatting for specific configuration values, or technical details. Don't use it for service names or common technical terms.
   - Use one or two line breaks (`\n` or `\n\n`) to separate distinct ideas.
   - Use bullet points (`-`) for listing multiple concepts or actions.
   - Use numbers for listing steps or sequential actions.
5. **Be Concise**: Maximum 400 characters. Make every word count.

### Common Mistakes to Avoid

- **Generic Risks**: "This could lead to security issues" or "Regulatory compliance violations".
- **Technical Implementation Focus**: "The API call might fail and return incorrect results...".
- **Overly Broad Statements**: "This is a serious security risk that could impact everything".
- **Vague Threats**: "This could be exploited by threat actors" without explaining how.

## Recommendation Guidelines

### Writing Guidelines

1. **Provide Actionable Best Practice Guidance**: Explain what should be done to maintain security posture. Focus on preventive measures and proactive security practices.
2. **Be Principle-Based**: Reference established security principles (least privilege, defense in depth, zero trust, separation of duties) where applicable.
3. **Focus on Prevention**: Explain best practices that prevent the security issue from occurring, not just detection or remediation.
4. **Use Markdown Formatting**: Enhance readability with markdown formatting:
   - Use **bold** for emphasis on key security concepts.
   - Use *italic* for a secondary emphasis. Use it for clarifications, conditions, or optional notes. But don't abuse it.
   - Use `code` formatting for specific configuration values, or technical details. Don't use it for service names or common technical terms.
   - Use one or two line breaks (`\n` or `\n\n`) to separate distinct ideas.
   - Use bullet points (`-`) for listing multiple concepts or actions.
   - Use numbers for listing steps or sequential actions.
5. **Be Concise**: Maximum 400 characters.

### Common Mistakes to Avoid

- **Specific Remediation Steps**: "1. Go to the console\n2. Click on settings..." - Focus on principles, not click-by-click instructions.
- **Implementation Details**: "Configure the JSON policy with the following IAM actions..." - Explain what to achieve, not how.
- **Vague Guidance**: "Follow security best practices..." without explaining what those practices are.
- **Resource-Specific Recommendations**: "Enable MFA on user john.doe@example.com" - Keep it general.
- **Missing Context**: Not explaining why the best practice is important for security.

### Good Examples

- *"Avoid exposing sensitive resources directly to the Internet; configure access controls to limit exposure."*
- *"Apply the principle of least privilege when assigning permissions to users and services."*
- *"Regularly review and update your security configurations to align with current best practices."*

## Remediation Code Guidelines

### Critical Requirement

The **fundamental principle** is to focus on the **specific change** that converts the finding from non-compliant to compliant.

Also is important to keep all code examples as short as possible, including the essential code to fix the issue. Remove any extra configuration, optional parameters, or nice-to-have settings and add comments to explain the code when possible.

### Common Guidelines for All Code Fields

1. **Be Minimal**: Keep code blocks as short as possible - only include what is absolutely necessary.
2. **Focus on the Fix**: Remove any extra configuration, optional parameters, or nice-to-have settings.
3. **Be Accurate**: Ensure all commands and code are syntactically correct.
4. **Use Markdown Formatting**: Format code properly using code blocks and appropriate syntax highlighting.
5. **Follow Best Practices**: Use the most secure and recommended approaches for each platform.

### CLI Guidelines

- Only provide a single command that directly changes the finding from fail to pass.
- The command must be executable as-is and resolve the security issue completely.
- Use proper command syntax for the provider (AWS CLI, Azure CLI, gcloud, kubectl, etc.).
- Do not use markdown formatting or code blocks - just the raw command.
- Do not include multiple commands, comments, or explanations.
- If the issue cannot be resolved with a single command, leave this field empty.

### Native IaC Guidelines

- **Keep It Minimal**: Only include the specific resource/configuration that fixes the security issue.
- Format as markdown code blocks with proper syntax highlighting.
- Include only the required properties to fix the issue.
- Add comments indicating the critical line(s) that remediate the check.
- Use `example_resource` as the generic name for all resources and IDs.

### Terraform Guidelines

- **Keep It Minimal**: Only include the specific resource/configuration that fixes the security issue.
- Provide valid HCL (HashiCorp Configuration Language) code with an example of a compliant configuration.
- Use the latest Terraform syntax and provider versions.
- Include only the required arguments to fix the issue - skip optional parameters.
- Format as markdown code blocks with `hcl` syntax highlighting.
- Add comments indicating the critical line(s) that remediate the check.
- Use `example_resource` as the generic name for all resources and IDs.
- Skip provider requirements unless critical for the fix.

### Other (Manual Steps) Guidelines

- **Keep It Minimal**: Only include the exact steps needed to fix the security issue.
- Provide step-by-step instructions for manual remediation through web interfaces.
- Use numbered lists for sequential steps.
- Be specific about menu locations, button names, and settings.
- Skip optional configurations or nice-to-have settings.
- Format using markdown for better readability.

## Categories Guidelines

### Selection Guidelines

1. **Be Specific**: Only select categories that directly relate to what the automated control evaluates.
2. **Primary Focus**: Consider the primary security concern the automated control addresses.
3. **Avoid Over-Categorization**: Do not select categories just because they are tangentially related.

### Available Categories

| Category                | Definition                                                                                                                                                                                                                                 |
|-------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| encryption              | Ensures data is encrypted in transit and/or at rest, including key management practices                                                                                                   |
| internet-exposed        | Checks that limit or flag public access to services, APIs, or assets from the Internet                                                                                                              |
| logging                 | Ensures appropriate logging of events, activities, and system interactions for traceability                                                                                                       |
| secrets                 | Manages and protects credentials, API keys, tokens, and other sensitive information                                                                                                               |
| resilience              | Ensures systems can maintain availability and recover from disruptions, failures, or degradation. Includes redundancy, fault-tolerance, auto-scaling, backup, disaster recovery, and failover strategies |
| threat-detection        | Identifies suspicious activity or behaviors using IDS, malware scanning, or anomaly detection                                                                                                      |
| trust-boundaries        | Enforces isolation or segmentation between different trust levels (e.g., VPCs, tenants, network zones)                                                                                            |
| vulnerabilities         | Detects or remediates known software, infrastructure, or config vulnerabilities (e.g., CVEs)                                                                                                      |
| cluster-security        | Secures Kubernetes cluster components such as API server, etcd, and role-based access                                                                                                             |
| container-security      | Ensures container images and runtimes follow security best practices                                                                                        |
| node-security           | Secures nodes running containers or services                                                                                                        |
| gen-ai                  | Checks related to safe and secure use of generative AI services or models                                                                                                                        |
| ci-cd                   | Ensures secure configurations in CI/CD pipelines                                                                                                         |
| identity-access         | Governs user and service identities, including least privilege, MFA, and permission boundaries                                                                                                    |
| email-security          | Ensures detection and protection against phishing, spam, spoofing, etc.                                                                                                                            |
| forensics-ready         | Ensures systems are instrumented to support post-incident investigations. Any digital trace or evidence (logs, volume snapshots, memory dumps, network captures, etc.) preserved immutably and accompanied by integrity guarantees, which can be used in a forensic analysis |
| software-supply-chain   | Detects or prevents tampering, unauthorized packages, or third-party risks in software supply chain                                                                                               |
| e3                      | M365-specific controls enabled by or dependent on an E3 license (e.g., baseline security policies, conditional access)                                                                            |
| e5                      | M365-specific controls enabled by or dependent on an E5 license (e.g., advanced threat protection, audit, DLP, and eDiscovery)                                                                    |
| privilege-escalation    | Detects IAM policies or permissions that allow identities to elevate their privileges beyond their intended scope, potentially gaining administrator or higher-level access through specific action combinations |
| ec2-imdsv1              | Identifies EC2 instances using Instance Metadata Service version 1 (IMDSv1), which is vulnerable to SSRF attacks and should be replaced with IMDSv2 for enhanced security                        |
```

--------------------------------------------------------------------------------

````
