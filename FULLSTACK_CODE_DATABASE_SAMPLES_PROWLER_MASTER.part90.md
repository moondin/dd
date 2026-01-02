---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 90
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 90 of 867)

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

---[FILE: threatscore.mdx]---
Location: prowler-master/docs/user-guide/compliance/tutorials/threatscore.mdx

```text
---
title: "Prowler ThreatScore Documentation"
---




## Introduction

The **Prowler ThreatScore** is a comprehensive compliance scoring system that provides a unified metric for assessing your organization's security posture across compliance frameworks. It aggregates findings from individual security checks into a single, normalized score ranging from 0 to 100.

### Purpose
- **Unified View**: Get a single metric representing overall compliance health
- **Risk Prioritization**: Understand which areas pose the highest security risks
- **Progress Tracking**: Monitor improvements in compliance posture over time
- **Executive Reporting**: Provide clear, quantifiable security metrics to stakeholders

## How ThreatScore Works

The ThreatScore calculation considers four critical factors for each compliance requirement:

### 1. Pass Rate (`rate_i`)
The percentage of security checks that passed for a specific requirement:
```
Pass Rate = (Number of PASS findings) / (Total findings)
```

### 2. Total Findings (`total_i`)
The total number of checks performed (both PASS and FAIL) for a requirement. This represents the amount of evidence available - more findings provide greater confidence in the assessment.

### 3. Weight (`weight_i`)
A numerical value (1-1000) representing the business importance or criticality of the requirement within your organization's context.

### 4. Risk Level (`risk_i`)
A severity rating (1-5) indicating the potential impact of non-compliance with this requirement.

## Score Interpretation Guidelines

| ThreatScore | Interpretation | Recommended Actions |
|------------------|----------------|-------------------|
| 90-100% | Excellent | Maintain current controls, focus on continuous improvement |
| 80-89% | Good | Address remaining gaps, prepare for compliance audits |
| 70-79% | Acceptable | Prioritize high-risk failures, develop improvement plan |
| 60-69% | Needs Improvement | Immediate attention required, may not pass compliance audit |
| Below 60% | Critical | Emergency response needed, potential regulatory issues |

## Mathematical Formula

The ThreatScore uses a weighted average formula that accounts for all four factors:

```
ThreatScore = (Σ(rate_i × total_i × weight_i × risk_i) / Σ(total_i × weight_i × risk_i)) × 100
```

### Formula Properties
- **Normalization**: Always produces a score between 0 and 100
- **Evidence-weighted**: Requirements with more findings have proportionally greater influence
- **Risk-sensitive**: Higher risk requirements impact the score more significantly
- **Business-aligned**: Weight values allow customization based on organizational priorities

## Parameters Explained

### Weight Values (1-1000)

The weight parameter allows customization of ThreatScore calculation based on organizational priorities and regulatory requirements.

#### Weight Assignment Guidelines

| Weight Range | Priority Level | Use Cases |
|--------------|----------------|-----------|
| 1-100 | Low | Optional or nice-to-have controls |
| 101-300 | Medium | Standard security practices |
| 301-600 | High | Important security controls |
| 601-850 | Critical | Regulatory compliance requirements |
| 851-1000 | Maximum | Mission-critical security controls |

#### Weight Selection Strategy
1. **Regulatory Mapping**: Assign higher weights to controls required by industry regulations
2. **Business Impact**: Consider the potential business impact of control failures
3. **Risk Tolerance**: Align weights with organizational risk appetite
4. **Stakeholder Input**: Involve compliance and business teams in weight decisions

### Risk Levels (1-5)

Risk levels represent the potential security impact of non-compliance with a requirement.

| Risk Level | Severity | Impact Description |
|------------|----------|-------------------|
| 1 | Very Low | Minimal security impact, informational |
| 2 | Low | Limited exposure, low probability of exploitation |
| 3 | Medium | Moderate security risk, potential for limited damage |
| 4 | High | Significant security risk, high probability of impact |
| 5 | Critical | Severe security risk, immediate threat to organization |

#### Risk Level Assessment Criteria
- **Confidentiality Impact**: Data exposure potential
- **Integrity Impact**: Risk of unauthorized data modification
- **Availability Impact**: Service disruption potential
- **Compliance Impact**: Regulatory violation consequences
- **Exploitability**: Ease of exploitation by threat actors

## Security Pillars and Subpillars

Prowler organizes security requirements into a hierarchical structure of pillars and subpillars, providing a comprehensive framework for security assessment and compliance evaluation.

### Security Pillars Overview

The ThreatScore calculation considers requirements organized within the following security pillars:

#### 1. IAM (Identity and Access Management)

**Purpose**: Controls who can access what resources and under what conditions

**Subpillars**:

- **1.1 Authentication**: Verifying user and system identities
- **1.2 Authorization**: Controlling access to resources based on authenticated identity
- **1.3 Privilege Escalation**: Preventing unauthorized elevation of permissions

#### 2. Attack Surface

**Purpose**: Minimizing exposure points that could be exploited by threat actors across network, storage, and application layers

**Subpillars**:

- **2.1 Network**: Network infrastructure security, segmentation, firewall rules, VPC configurations, and traffic controls
- **2.2 Storage**: Data storage systems security, database security, file system permissions, backup security, and storage encryption
- **2.3 Application**: Application-level controls and configurations, application security settings, code security, runtime protections

#### 3. Logging and Monitoring

**Purpose**: Ensuring comprehensive visibility and audit capabilities

**Subpillars**:

- **3.1 Logging**: Capturing security-relevant events and activities
- **3.2 Retention**: Maintaining logs for appropriate time periods
- **3.3 Monitoring**: Active surveillance and alerting on security events

#### 4. Encryption

**Purpose**: Protecting data confidentiality through cryptographic controls

**Subpillars**:

- **4.1 In-Transit**: Encrypting data during transmission
- **4.2 At-Rest**: Encrypting stored data

### Pillar Hierarchy and ThreatScore Impact

#### Hierarchy Structure
```
Security Framework
├── 1. IAM
│   ├── 1.1 Authentication
│   ├── 1.2 Authorization
│   └── 1.3 Privilege Escalation
├── 2. Attack Surface
│   ├── 2.1 Network
│   ├── 2.2 Storage
│   └── 2.3 Application
├── 3. Logging and Monitoring
│   ├── 3.1 Logging
│   ├── 3.2 Retention
│   └── 3.3 Monitoring
└── 4. Encryption
    ├── 4.1 In-Transit
    └── 4.2 At-Rest

Example Requirement Structure:
├── Pillar: 1. IAM
│   ├── Subpillar: 1.1 Authentication
│   │   ├── Requirement: MFA Implementation
│   │   │   ├── Check 1: Admin accounts use MFA
│   │   │   ├── Check 2: Regular users use MFA
│   │   │   └── Check 3: Service accounts use MFA
│   │   └── [Additional Requirements]
│   └── [Additional Subpillars: Authorization, Privilege Escalation]
```

#### Weight and Risk Assignment by Pillar

Different pillars typically receive different weight and risk assignments based on their security impact:

| Pillar | Typical Weight Range | Typical Risk Range | Rationale |
|--------|---------------------|-------------------|-----------|
| 1. IAM | 800-1000 | 4-5 | Critical for access control, high impact if compromised |
| 2. Attack Surface | 500-900 | 3-5 | Highly dependent on exposure and criticality across network, storage, and application layers |
| 3. Logging and Monitoring | 600-800 | 3-4 | Important for detection and compliance, moderate direct impact |
| 4. Encryption | 700-950 | 4-5 | Essential for data protection, regulatory compliance |

**Subpillar Weight Considerations**:

- **2.1 Network (Attack Surface)**: 500-800, Risk 3-4 - Network perimeter defense
- **2.2 Storage (Attack Surface)**: 600-900, Risk 4-5 - Data exposure impact
- **2.3 Application (Attack Surface)**: 400-700, Risk 2-4 - Varies by application criticality

### Pillar-Specific Scoring Considerations

#### High-Impact Pillars (1. IAM, 4. Encryption)

- **Characteristics**: Direct impact on data protection and access control
- **ThreatScore Impact**: Failures in these pillars significantly lower overall score
- **Weight Strategy**: Assign maximum weights (800-1000) to critical requirements
- **Risk Strategy**: Most requirements rated 4-5 due to severe consequences

#### Variable-Impact Pillar (2. Attack Surface)

- **Characteristics**: Impact varies significantly across subpillars (Network, Storage, Application)
- **ThreatScore Impact**: Depends on specific subpillar and business context
- **Weight Strategy**:
    - 2.1 Network subpillar: 500-800 (perimeter defense importance)
    - 2.2 Storage subpillar: 600-900 (data exposure risk)
    - 2.3 Application subpillar: 400-700 (application-specific criticality)
- **Risk Strategy**: Wide range (2-5) based on exposure, data sensitivity, and business criticality

#### Monitoring Pillar (3. Logging and Monitoring)

- **Characteristics**: Essential for compliance and incident response
- **ThreatScore Impact**: Moderate influence, critical for audit requirements
- **Weight Strategy**: Consistent weights (600-800) across logging, retention, and monitoring subpillars
- **Risk Strategy**: Moderate risk levels (3-4) with emphasis on compliance impact

### Cross-Pillar Dependencies

#### Authentication ↔ Authorization (IAM)

- Strong authentication enables effective authorization controls
- Weight both subpillars highly as they're interdependent

#### Logging ↔ Monitoring (Logging and Monitoring)

- Logging provides the data that monitoring systems analyze
- Balance weights to ensure both data collection and analysis are prioritized

#### In-Transit ↔ At-Rest (Encryption)

- Comprehensive data protection requires both encryption types
- Consider data flow patterns when assigning relative weights

### Pillar Coverage in ThreatScore

#### Complete Coverage Benefits

- **Comprehensive Assessment**: All security domains represented in score
- **Balanced View**: Prevents over-emphasis on single security aspect
- **Regulatory Alignment**: Covers requirements across major compliance frameworks

#### Partial Coverage Considerations

- **Focused Assessment**: Target specific security domains
- **Resource Optimization**: Concentrate efforts on high-priority areas
- **Gradual Implementation**: Phase in additional pillars over time

## Scoring Examples

### Example 1: Basic Two-Requirement Scenario

Consider a compliance framework with two requirements:

**Requirement 1: Encryption at Rest**

- Findings: 200 PASS, 500 FAIL (total = 700)
- Pass Rate: 200/700 = 0.286 (28.6%)
- Weight: 500 (High priority - data protection)
- Risk Level: 4 (High risk - data exposure)

**Requirement 2: Access Logging**

- Findings: 300 PASS, 100 FAIL (total = 400)
- Pass Rate: 300/400 = 0.75 (75%)
- Weight: 800 (Critical for audit compliance)
- Risk Level: 3 (Medium risk - audit trail)

**Calculation:**
```
Numerator = (0.286 × 700 × 500 × 4) + (0.75 × 400 × 800 × 3)
          = (400,400) + (720,000)
          = 1,120,400

Denominator = (700 × 500 × 4) + (400 × 800 × 3)
            = 1,400,000 + 960,000
            = 2,360,000

ThreatScore = (1,120,400 / 2,360,000) × 100 = 47.5%
```

### Example 2: Enterprise Scenario with Pillar Structure

This example demonstrates how pillar organization affects ThreatScore calculation:

| Pillar | Subpillar | Requirement | Pass | Fail | Total | Weight | Risk | Pass Rate |
|--------|-----------|-------------|------|------|-------|--------|------|-----------|
| 1. IAM | 1.2 Authorization | Access Controls | 280 | 120 | 400 | 800 | 4 | 70% |
| 2. Attack Surface | 2.1 Network | Network Segmentation | 150 | 50 | 200 | 750 | 4 | 75% |
| 2. Attack Surface | 2.2 Storage | Backup Security | 200 | 100 | 300 | 600 | 3 | 66.7% |
| 3. Logging and Monitoring | 3.1 Logging | Audit Logging | 350 | 50 | 400 | 700 | 3 | 87.5% |
| 4. Encryption | 4.2 At-Rest | Encryption | 450 | 50 | 500 | 950 | 5 | 90% |

**Step-by-step Calculation:**

1. **Calculate weighted contributions for each requirement:**

    ```
    Numerator = Σ(rate_i × total_i × weight_i × risk_i)
    ```

    - **Access Controls (1.2 Authorization)**: 0.70 × 400 × 800 × 4 = 896,000
    - **Network Segmentation (2.1 Network)**: 0.75 × 200 × 750 × 4 = 450,000
    - **Backup Security (2.2 Storage)**: 0.667 × 300 × 600 × 3 = 360,060
    - **Audit Logging (3.1 Logging)**: 0.875 × 400 × 700 × 3 = 735,000
    - **Encryption (4.2 At-Rest)**: 0.90 × 500 × 950 × 5 = 2,137,500

2. **Sum numerator:** 2,137,500 + 896,000 + 735,000 + 360,060 + 450,000 = **4,578,560**

3. **Calculate total weights for each requirement:**

    ```
    Denominator = Σ(total_i × weight_i × risk_i)
    ```

    - **Access Controls (1.2 Authorization)**: 400 × 800 × 4 = 1,280,000
    - **Network Segmentation (2.1 Network)**: 200 × 750 × 4 = 600,000
    - **Backup Security (2.2 Storage)**: 300 × 600 × 3 = 540,000
    - **Audit Logging (3.1 Logging)**: 400 × 700 × 3 = 840,000
    - **Encryption (4.2 At-Rest)**: 500 × 950 × 5 = 2,375,000

4. **Sum denominator:** 2,375,000 + 1,280,000 + 840,000 + 540,000 + 600,000 = **5,635,000**

5. **Final ThreatScore calculation:**

    ```
    ThreatScore = (Numerator / Denominator) × 100
    ThreatScore = (4,578,560 / 5,635,000) × 100 = 81.2%
    ```

**Pillar-Level Analysis:**

- **1. IAM pillar (1.2 Authorization)**: Significant impact despite lower pass rate (70%) due to high weight (800)
- **2. Attack Surface pillar (2.1 Network)**: Strong performance (75%) with high weight (750) balances the score
- **2. Attack Surface pillar (2.2 Storage)**: Lowest performance (66.7%) but limited impact due to moderate weight (600)
- **3. Logging and Monitoring pillar (3.1 Logging)**: Moderate contribution with good performance (87.5%)
- **4. Encryption pillar (4.2 At-Rest)**: Highest contribution due to maximum weight (950) and risk (5)

### Example 3: Multi-Pillar Comprehensive Scenario


| Pillar | Subpillar | Requirement | Pass | Fail | Weight | Risk | Pass Rate |
|--------|-----------|-------------|------|------|--------|------|-----------|
| 1. IAM | 1.1 Authentication | MFA Implementation | 180 | 20 | 900 | 5 | 90% |
| 1. IAM | 1.2 Authorization | Least Privilege Access | 150 | 50 | 850 | 4 | 75% |
| 1. IAM | 1.3 Privilege Escalation | Admin Account Controls | 95 | 5 | 950 | 5 | 95% |
| 2. Attack Surface | 2.1 Network | Firewall Configuration | 400 | 100 | 600 | 3 | 80% |
| 2. Attack Surface | 2.1 Network | Public Endpoint Security | 80 | 20 | 700 | 4 | 80% |
| 2. Attack Surface | 2.2 Storage | Data Classification | 300 | 100 | 650 | 3 | 75% |
| 2. Attack Surface | 2.3 Application | Input Validation | 150 | 50 | 500 | 3 | 75% |
| 3. Logging and Monitoring | 3.1 Logging | Transaction Logging | 500 | 50 | 750 | 3 | 90.9% |
| 3. Logging and Monitoring | 3.3 Monitoring | Real-time Alerts | 200 | 50 | 700 | 4 | 80% |
| 4. Encryption | 4.2 At-Rest | Database Encryption | 300 | 20 | 900 | 5 | 93.8% |
| 4. Encryption | 4.1 In-Transit | API/Web Encryption | 250 | 10 | 800 | 4 | 96.2% |

**Pillar Performance Summary**:

- **1. IAM Pillar Average**: ~87% (weighted by findings across Authentication, Authorization, and Privilege Escalation subpillars)
- **2. Attack Surface Pillar Average**: ~77% (weighted across Network, Storage, and Application subpillars)
    - 2.1 Network subpillar: ~80% average
    - 2.2 Storage subpillar: 75%
    - 2.3 Application subpillar: 75%
- **3. Logging and Monitoring Average**: ~87% (weighted by findings across Logging and Monitoring subpillars)
- **4. Encryption Pillar Average**: ~94% (weighted by findings across In-Transit and At-Rest subpillars)

**Overall ThreatScore**: ~85.3%

This comprehensive example demonstrates how:

- High-performing, high-weight pillars (4. Encryption, 1. IAM) significantly boost the score
- The 2. Attack Surface pillar shows how diverse subpillars (Network, Storage, Application) are aggregated
- Multiple requirements within pillars provide detailed granular assessment
- Cross-pillar balance prevents single points of failure in security posture

### Example 4: Impact of Parameter Changes

Using the scenario, let's see how parameter changes affect the score:

#### Scenario A: Increase Encryption Risk Level

Change Encryption risk from 5 to 3:

- **New ThreatScore: 77.8%** (decrease of 3.4 points)
- **Impact**: Lower risk weighting reduces the influence of high-performing critical controls

#### Scenario B: Improve Access Controls Pass Rate

Change Access Controls from 70% to 90% pass rate:

- **New ThreatScore: 85.1%** (increase of 3.9 points)
- **Impact**: Improving performance on high-weight requirements has significant score impact

#### Scenario C: Add New Low-Weight Requirement

Add "Documentation Completeness" (50 PASS, 10 FAIL, weight=100, risk=1):

- **New ThreatScore: 81.3%** (minimal change of 0.1 points)
- **Impact**: Low-weight requirements have minimal impact on overall score

## Implementation Details

### Edge Cases and Special Conditions

#### Zero Findings Scenario
When a requirement has `total_i = 0` (no findings):

- **Behavior**: Requirement is completely excluded from calculation
- **Rationale**: No evidence means no contribution to confidence in the score
- **Impact**: Other requirements receive proportionally more influence

#### Perfect Score Scenario
When all requirements have 100% pass rate:

- **Result**: ThreatScore = 100%
- **Interpretation**: All implemented security checks are passing

#### Zero Pass Rate Scenario
When all requirements have 0% pass rate:

- **Result**: ThreatScore = 0%
- **Interpretation**: Critical security failures across all requirements

#### Single Requirement Framework
For frameworks with only one requirement:

- **Formula simplification**: ThreatScore = pass_rate × 100
- **Impact**: Weight and risk values become irrelevant for score calculation

### Performance Considerations

#### Computational Complexity
- **Time Complexity**: O(n) where n = number of requirements
- **Space Complexity**: O(1) - constant space for accumulation
- **Scalability**: Efficiently handles frameworks with thousands of requirements

#### Calculation Precision
- **Floating Point**: Use double precision for intermediate calculations
- **Rounding**: Final score rounded to 1 decimal place for display
- **Overflow Protection**: Validate that weight × risk × total values don't exceed system limits

### Data Requirements

#### Minimum Data Set
For each requirement, the following data must be available:

- **pass_count**: Number of PASS findings (integer ≥ 0)
- **fail_count**: Number of FAIL findings (integer ≥ 0)
- **weight**: Business importance (integer 1-1000)
- **risk**: Risk level (integer 1-5)

#### Data Validation Rules
```
total_i = pass_i + fail_i
rate_i = pass_i / total_i (when total_i > 0)
1 ≤ weight_i ≤ 1000
1 ≤ risk_i ≤ 5
```

#### Handling Invalid Data
- **Negative values**: Treat as 0 and log warning
- **Out-of-range weights/risk**: Clamp to valid range and log warning
- **Missing data**: Exclude requirement from calculation and log warning

## Best Practices

### Monitoring and Trending

1. **Establish Baseline**
    - Record initial ThreatScore after implementing measurement
    - Set realistic improvement targets based on organizational capacity
    - Track score changes over time to identify trends

2. **Regular Reporting**
    - Generate monthly ThreatScore reports for stakeholders
    - Highlight significant score changes and their causes
    - Include requirement-level breakdowns for detailed analysis

3. **Continuous Improvement**
    - Use score trends to identify systematic issues
    - Correlate score changes with security incidents or changes
    - Adjust weights and risk levels based on lessons learned
```

--------------------------------------------------------------------------------

---[FILE: authentication.mdx]---
Location: prowler-master/docs/user-guide/providers/alibabacloud/authentication.mdx

```text
---
title: 'Alibaba Cloud Authentication in Prowler'
---

Prowler requires Alibaba Cloud credentials to perform security checks. Authentication is supported via multiple methods, prioritized as follows:

1. **Credentials URI**
2. **OIDC Role Authentication**
3. **ECS RAM Role**
4. **RAM Role Assumption**
5. **STS Temporary Credentials**
6. **Permanent Access Keys**
7. **Default Credential Chain**

## Authentication Methods

### Credentials URI (Recommended for Centralized Services)

If `--credentials-uri` is provided (or `ALIBABA_CLOUD_CREDENTIALS_URI` environment variable), Prowler will retrieve credentials from the specified external URI endpoint. The URI must return credentials in the standard JSON format.

```bash
export ALIBABA_CLOUD_CREDENTIALS_URI="http://localhost:8080/credentials"
prowler alibabacloud
```

### OIDC Role Authentication (Recommended for ACK/Kubernetes)

If OIDC environment variables are set, Prowler will use OIDC authentication to assume the specified role. This is the most secure method for containerized applications running in ACK (Alibaba Container Service for Kubernetes) with RRSA enabled.

Required environment variables:
- `ALIBABA_CLOUD_ROLE_ARN`
- `ALIBABA_CLOUD_OIDC_PROVIDER_ARN`
- `ALIBABA_CLOUD_OIDC_TOKEN_FILE`

```bash
export ALIBABA_CLOUD_ROLE_ARN="acs:ram::123456789012:role/YourRole"
export ALIBABA_CLOUD_OIDC_PROVIDER_ARN="acs:ram::123456789012:oidc-provider/ack-rrsa-provider"
export ALIBABA_CLOUD_OIDC_TOKEN_FILE="/var/run/secrets/tokens/oidc-token"
prowler alibabacloud
```

### ECS RAM Role (Recommended for ECS Instances)

When running on an ECS instance with an attached RAM role, Prowler can obtain credentials from the ECS instance metadata service.

```bash
# Using CLI argument
prowler alibabacloud --ecs-ram-role RoleName

# Or using environment variable
export ALIBABA_CLOUD_ECS_METADATA="RoleName"
prowler alibabacloud
```

### RAM Role Assumption (Recommended for Cross-Account)

For cross-account access, use RAM role assumption. You must provide the initial credentials (access keys) and the target role ARN.

```bash
export ALIBABA_CLOUD_ACCESS_KEY_ID="your-access-key-id"
export ALIBABA_CLOUD_ACCESS_KEY_SECRET="your-access-key-secret"
export ALIBABA_CLOUD_ROLE_ARN="acs:ram::123456789012:role/ProwlerAuditRole"
prowler alibabacloud
```

### STS Temporary Credentials

If you already have temporary STS credentials, you can provide them via environment variables.

```bash
export ALIBABA_CLOUD_ACCESS_KEY_ID="your-sts-access-key-id"
export ALIBABA_CLOUD_ACCESS_KEY_SECRET="your-sts-access-key-secret"
export ALIBABA_CLOUD_SECURITY_TOKEN="your-sts-security-token"
prowler alibabacloud
```

### Permanent Access Keys

You can use standard permanent access keys via environment variables.

```bash
export ALIBABA_CLOUD_ACCESS_KEY_ID="your-access-key-id"
export ALIBABA_CLOUD_ACCESS_KEY_SECRET="your-access-key-secret"
prowler alibabacloud
```

## Required Permissions

The credentials used by Prowler should have the minimum required permissions to audit the resources. At a minimum, the following permissions are recommended:

- `ram:GetUser`
- `ram:ListUsers`
- `ram:GetPasswordPolicy`
- `ram:GetAccountSummary`
- `ram:ListVirtualMFADevices`
- `ram:ListGroups`
- `ram:ListPolicies`
- `ram:ListAccessKeys`
- `ram:GetLoginProfile`
- `ram:ListPoliciesForUser`
- `ram:ListGroupsForUser`
- `actiontrail:DescribeTrails`
- `oss:GetBucketLogging`
- `oss:GetBucketAcl`
- `rds:DescribeDBInstances`
- `rds:DescribeDBInstanceAttribute`
- `ecs:DescribeInstances`
- `vpc:DescribeVpcs`
- `sls:ListProject`
- `sls:ListAlerts`
- `sls:ListLogStores`
- `sls:GetLogStore`
```

--------------------------------------------------------------------------------

---[FILE: getting-started-alibabacloud.mdx]---
Location: prowler-master/docs/user-guide/providers/alibabacloud/getting-started-alibabacloud.mdx

```text
---
title: 'Getting Started With Alibaba Cloud on Prowler'
---

## Prowler CLI

### Configure Alibaba Cloud Credentials

Prowler requires Alibaba Cloud credentials to perform security checks. Authentication is available through the following methods (in order of priority):

1. **Credentials URI** (Recommended for centralized credential services)
2. **OIDC Role Authentication** (Recommended for ACK/Kubernetes)
3. **ECS RAM Role** (Recommended for ECS instances)
4. **RAM Role Assumption** (Recommended for cross-account access)
5. **STS Temporary Credentials**
6. **Permanent Access Keys**
7. **Default Credential Chain**

<Warning>
Prowler does not accept credentials through command-line arguments. Provide credentials through environment variables or the Alibaba Cloud credential chain.

</Warning>

#### Option 1: Environment Variables (Permanent Credentials)

```bash
export ALIBABA_CLOUD_ACCESS_KEY_ID="your-access-key-id"
export ALIBABA_CLOUD_ACCESS_KEY_SECRET="your-access-key-secret"
prowler alibabacloud
```

#### Option 2: Environment Variables (STS Temporary Credentials)

```bash
export ALIBABA_CLOUD_ACCESS_KEY_ID="your-sts-access-key-id"
export ALIBABA_CLOUD_ACCESS_KEY_SECRET="your-sts-access-key-secret"
export ALIBABA_CLOUD_SECURITY_TOKEN="your-sts-security-token"
prowler alibabacloud
```

#### Option 3: RAM Role Assumption (Environment Variables)

```bash
export ALIBABA_CLOUD_ACCESS_KEY_ID="your-access-key-id"
export ALIBABA_CLOUD_ACCESS_KEY_SECRET="your-access-key-secret"
export ALIBABA_CLOUD_ROLE_ARN="acs:ram::123456789012:role/ProwlerAuditRole"
export ALIBABA_CLOUD_ROLE_SESSION_NAME="ProwlerAssessmentSession"  # Optional
prowler alibabacloud
```

#### Option 4: RAM Role Assumption (CLI + Environment Variables)

```bash
# Set credentials via environment variables
export ALIBABA_CLOUD_ACCESS_KEY_ID="your-access-key-id"
export ALIBABA_CLOUD_ACCESS_KEY_SECRET="your-access-key-secret"
# Specify role via CLI argument
prowler alibabacloud --role-arn acs:ram::123456789012:role/ProwlerAuditRole --role-session-name ProwlerAssessmentSession
```

#### Option 5: ECS Instance Metadata (ECS RAM Role)

```bash
# When running on an ECS instance with an attached RAM role
prowler alibabacloud --ecs-ram-role RoleName

# Or using environment variable
export ALIBABA_CLOUD_ECS_METADATA="RoleName"
prowler alibabacloud
```

#### Option 6: OIDC Role Authentication (for ACK/Kubernetes)

```bash
# For applications running in ACK (Alibaba Container Service for Kubernetes) with RRSA enabled
export ALIBABA_CLOUD_ROLE_ARN="acs:ram::123456789012:role/YourRole"
export ALIBABA_CLOUD_OIDC_PROVIDER_ARN="acs:ram::123456789012:oidc-provider/ack-rrsa-provider"
export ALIBABA_CLOUD_OIDC_TOKEN_FILE="/var/run/secrets/tokens/oidc-token"
export ALIBABA_CLOUD_ROLE_SESSION_NAME="ProwlerOIDCSession"  # Optional
prowler alibabacloud

# Or using CLI argument
prowler alibabacloud --oidc-role-arn acs:ram::123456789012:role/YourRole
```

#### Option 7: Credentials URI (External Credential Service)

```bash
# Retrieve credentials from an external URI endpoint
export ALIBABA_CLOUD_CREDENTIALS_URI="http://localhost:8080/credentials"
prowler alibabacloud

# Or using CLI argument
prowler alibabacloud --credentials-uri http://localhost:8080/credentials
```

#### Option 8: Default Credential Chain

The SDK automatically checks credentials in the following order:
1. Environment variables (`ALIBABA_CLOUD_*` or `ALIYUN_*`)
2. OIDC authentication (if OIDC environment variables are set)
3. Configuration file (`~/.aliyun/config.json`)
4. ECS instance metadata (if running on ECS)
5. Credentials URI (if `ALIBABA_CLOUD_CREDENTIALS_URI` is set)

```bash
prowler alibabacloud
```

### Specify Regions

To run checks only in specific regions:

```bash
prowler alibabacloud --regions cn-hangzhou cn-shanghai
```

### Run Specific Checks

To run specific checks:

```bash
prowler alibabacloud --checks ram_no_root_access_key ram_user_mfa_enabled_console_access
```

### Run Compliance Framework

To run a specific compliance framework:

```bash
prowler alibabacloud --compliance cis_2.0_alibabacloud
```
```

--------------------------------------------------------------------------------

---[FILE: authentication.mdx]---
Location: prowler-master/docs/user-guide/providers/aws/authentication.mdx

```text
---
title: 'AWS Authentication in Prowler'
---

Prowler requires AWS credentials to function properly. Authentication is available through the following methods:

- Static Credentials
- Assumed Role

## Required Permissions

To ensure full functionality, attach the following AWS managed policies to the designated user or role:

- `arn:aws:iam::aws:policy/SecurityAudit`
- `arn:aws:iam::aws:policy/job-function/ViewOnlyAccess`

### Additional Permissions

For certain checks, additional read-only permissions are required. Attach the following custom policy to your role: [prowler-additions-policy.json](https://github.com/prowler-cloud/prowler/blob/master/permissions/prowler-additions-policy.json)


## Assume Role (Recommended)

This method grants permanent access and is the recommended setup for production environments.

<Tabs>
  <Tab title="CloudFormation">
    1. Download the [Prowler Scan Role Template](https://raw.githubusercontent.com/prowler-cloud/prowler/refs/heads/master/permissions/templates/cloudformation/prowler-scan-role.yml)

        ![Prowler Scan Role Template](/images/providers/prowler-scan-role-template.png)

        ![Download Role Template](/images/providers/download-role-template.png)

    2. Open the [AWS Console](https://console.aws.amazon.com), search for **CloudFormation**

        ![CloudFormation Search](/images/providers/cloudformation-nav.png)

    3. Go to **Stacks** and click "Create stack" > "With new resources (standard)"

        ![Create Stack](/images/providers/create-stack.png)

    4. In **Specify Template**, choose "Upload a template file" and select the downloaded file

        ![Upload a template file](/images/providers/upload-template-file.png)
        ![Upload file from downloads](/images/providers/upload-template-from-downloads.png)

    5. Click "Next", provide a stack name and the **External ID** shown in the Prowler Cloud setup screen

        ![External ID](/images/providers/prowler-cloud-external-id.png)
        ![Stack Data](/images/providers/fill-stack-data.png)

        <Info>
            An **External ID** is required when assuming the *ProwlerScan* role to prevent the [confused deputy problem](https://docs.aws.amazon.com/IAM/latest/UserGuide/confused-deputy.html).
        </Info>

    6. Acknowledge the IAM resource creation warning and proceed

        ![Stack Creation Second Step](/images/providers/stack-creation-second-step.png)

    7. Click "Submit" to deploy the stack

        ![Click on submit](/images/providers/submit-third-page.png)
  </Tab>
  <Tab title="Terraform">
    To provision the scan role using Terraform:

    1. Run the following commands:

        ```bash
        terraform init
        terraform plan
        terraform apply
        ```
  </Tab>
</Tabs>

---

## Credentials

<Tabs>
  <Tab title="Long term credentials">
    1. Go to the [AWS Console](https://console.aws.amazon.com), open **CloudShell**

        ![AWS CloudShell](/images/providers/aws-cloudshell.png)

    2. Run:

        ```bash
        aws iam create-access-key
        ```
  </Tab>
  <Tab title="Short term credentials (Recommended)">
    Use the [AWS Access Portal](https://docs.aws.amazon.com/singlesignon/latest/userguide/howtogetcredentials.html) or the CLI:

    1. Retrieve short-term credentials for the IAM identity using this command:

        ```bash
        aws sts get-session-token --duration-seconds 900
        ```

        <Note>
        Check the aws documentation [here](https://docs.aws.amazon.com/IAM/latest/UserGuide/sts_example_sts_GetSessionToken_section.html)
        </Note>

    2. Copy the output containing:

        - `AccessKeyId`
        - `SecretAccessKey`
        - `SessionToken`

        > Sample output:
        ```json
        {
            "Credentials": {
                "AccessKeyId": "ASIAIOSFODNN7EXAMPLE",
                "SecretAccessKey": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYzEXAMPLEKEY",
                "SessionToken": "AQoEXAMPLEH4aoAH0gNCAPyJxz4BlCFFxWNE1OPTgk5TthT+FvwqnKwRcOIfrRh3c/LTo6UDdyJwOOvEVPvLXCrrrUtdnniCEXAMPLE/IvU1dYUg2RVAJBanLiHb4IgRmpRV3zrkuWJOgQs8IZZaIv2BXIa2R4OlgkBN9bkUDNCJiBeb/AXlzBBko7b15fjrBs2+cTQtpZ3CYWFXG8C5zqx37wnOE49mRl/+OtkIKGO7fAE",
                "Expiration": "2020-05-19T18:06:10+00:00"
            }
        }
        ```
  </Tab>
</Tabs>
```

--------------------------------------------------------------------------------

---[FILE: boto3-configuration.mdx]---
Location: prowler-master/docs/user-guide/providers/aws/boto3-configuration.mdx

```text
---
title: "Boto3 Retrier Configuration in Prowler"
---

Prowler's AWS Provider leverages Boto3's [Standard](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/retries.html) retry mode to automatically retry client calls to AWS services when encountering errors or exceptions.

## Retry Behavior Overview

Boto3's Standard retry mode includes the following mechanisms:

- Maximum Retry Attempts: Default value set to 3, configurable via the `--aws-retries-max-attempts 5` argument.

- Expanded Error Handling: Retries occur for a comprehensive set of errors.

  ```
  # *Transient Errors/Exceptions*
  The retrier handles various temporary failures:
  RequestTimeout
  RequestTimeoutException
  PriorRequestNotComplete
  ConnectionError
  HTTPClientError

  # *Service-Side Throttling and Limit Errors*
  Retries occur for service-imposed rate limits and resource constraints:
  Throttling
  ThrottlingException
  ThrottledException
  RequestThrottledException
  TooManyRequestsException
  ProvisionedThroughputExceededException
  TransactionInProgressException
  RequestLimitExceeded
  BandwidthLimitExceeded
  LimitExceededException
  RequestThrottled
  SlowDown
  EC2ThrottledException
  ```

- Nondescriptive Transient Error Codes: The retrier applies retry logic to standard HTTP status codes signaling transient errors: 500, 502, 503, 504.

- Exponential Backoff Strategy: Each retry attempt follows exponential backoff with a base factor of 2, ensuring progressive delay between retries. Maximum backoff time: 20 seconds

## Validating Retry Attempts

For testing or modifying Prowler's behavior, use the following steps to confirm whether requests are being retried or abandoned:

* Run prowler with `--log-level DEBUG` and `--log-file debuglogs.txt`
* Search for retry attempts using `grep -i 'Retry needed' debuglogs.txt`

This approach follows the [AWS documentation](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/retries.html#checking-retry-attempts-in-your-client-logs), which states that if a retry is performed, a message starting with "Retry needed” will be prompted.

It is possible to determine the total number of calls made using `grep -i 'Sending http request' debuglogs.txt | wc -l`
```

--------------------------------------------------------------------------------

---[FILE: cloudshell.mdx]---
Location: prowler-master/docs/user-guide/providers/aws/cloudshell.mdx

```text
---
title: 'Installing Prowler in AWS CloudShell'
---

## Following the migration of AWS CloudShell from Amazon Linux 2 to Amazon Linux 2023

AWS CloudShell has migrated from Amazon Linux 2 to Amazon Linux 2023 [[1]](https://aws.amazon.com/about-aws/whats-new/2023/12/aws-cloudshell-migrated-al2023/) [[2]](https://docs.aws.amazon.com/cloudshell/latest/userguide/cloudshell-AL2023-migration.html). With this transition, Python 3.9 is now included by default in AL2023, eliminating the need for manual compilation.

To install Prowler v4 in AWS CloudShell, follow the standard installation method using pip:

```shell
sudo bash
adduser prowler
su prowler
pip install prowler
cd /tmp
prowler aws
```

## Downloading Files from AWS CloudShell

To download results from AWS CloudShell:

- Select Actions → Download File.

- Specify the full file path of each file you wish to download. For example, downloading a CSV file would require providing its complete path, as in: `/home/cloudshell-user/output/prowler-output-123456789012-20221220191331.csv`

## Cloning Prowler from GitHub

Due to the limited storage in AWS CloudShell's home directory, installing Poetry dependencies for running Prowler from GitHub can be problematic.

The following workaround ensures successful installation:

```shell
sudo bash
adduser prowler
su prowler
git clone https://github.com/prowler-cloud/prowler.git
cd prowler
pip install poetry
mkdir /tmp/poetry
poetry config cache-dir /tmp/poetry
eval $(poetry env activate)
poetry install
python prowler-cli.py -v
```

<Warning>
Starting from Poetry v2.0.0, `poetry shell` has been deprecated in favor of `poetry env activate`.

If your Poetry version is below v2.0.0, continue using `poetry shell` to activate your environment. For further guidance, refer to the Poetry Environment Activation Guide https://python-poetry.org/docs/managing-environments/#activating-the-environment.

</Warning>
```

--------------------------------------------------------------------------------

````
