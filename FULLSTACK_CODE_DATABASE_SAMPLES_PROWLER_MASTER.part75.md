---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 75
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 75 of 867)

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

---[FILE: docs.json]---
Location: prowler-master/docs/docs.json

```json
{
  "$schema": "https://mintlify.com/docs.json",
  "theme": "mint",
  "name": "Prowler Documentation",
  "colors": {
    "primary": "#000000",
    "light": "#10B981",
    "dark": "#10B981"
  },
  "favicon": "/favicon.ico",
  "logo": {
    "dark": "/images/prowler-logo-white.png",
    "light": "/images/prowler-logo-black.png"
  },
  "navigation": {
    "tabs": [
      {
        "tab": "Getting Started",
        "groups": [
          {
            "group": "Welcome",
            "pages": ["introduction"]
          },
          {
            "group": "Prowler Cloud",
            "pages": [
              "getting-started/products/prowler-cloud",
              "getting-started/products/prowler-cloud-pricing",
              "getting-started/products/prowler-cloud-aws-marketplace",
              "getting-started/goto/prowler-cloud",
              "getting-started/goto/prowler-api-reference"
            ]
          },
          {
            "group": "Prowler CLI",
            "pages": [
              "getting-started/products/prowler-cli",
              "getting-started/installation/prowler-cli",
              "getting-started/basic-usage/prowler-cli"
            ]
          },
          {
            "group": "Prowler App",
            "pages": [
              "getting-started/products/prowler-app",
              "getting-started/installation/prowler-app",
              "getting-started/basic-usage/prowler-app"
            ]
          },
          {
            "group": "Prowler Lighthouse AI",
            "pages": ["getting-started/products/prowler-lighthouse-ai"]
          },
          {
            "group": "Prowler MCP Server",
            "pages": [
              "getting-started/products/prowler-mcp",
              "getting-started/installation/prowler-mcp",
              "getting-started/basic-usage/prowler-mcp",
              "getting-started/basic-usage/prowler-mcp-tools"
            ]
          },
          {
            "group": "Prowler Hub",
            "pages": [
              "getting-started/products/prowler-hub",
              "getting-started/goto/prowler-hub"
            ]
          },
          {
            "group": "Prowler vs. Others",
            "pages": [
              "getting-started/comparison/index",
              "getting-started/comparison/awssecurityhub",
              "getting-started/comparison/gcp",
              "getting-started/comparison/microsoftdefender",
              "getting-started/comparison/microsoftsentinel"
            ]
          }
        ]
      },
      {
        "tab": "Guides",
        "groups": [
          {
            "group": "Prowler Cloud/App",
            "pages": [
              "user-guide/tutorials/prowler-app",
              {
                "group": "Authentication",
                "pages": [
                  "user-guide/tutorials/prowler-app-social-login",
                  "user-guide/tutorials/prowler-app-sso"
                ]
              },
              "user-guide/tutorials/prowler-app-rbac",
              "user-guide/tutorials/prowler-app-api-keys",
              "user-guide/tutorials/prowler-app-mute-findings",
              {
                "group": "Integrations",
                "expanded": true,
                "pages": [
                  "user-guide/tutorials/prowler-app-s3-integration",
                  "user-guide/tutorials/prowler-app-security-hub-integration",
                  "user-guide/tutorials/prowler-app-jira-integration"
                ]
              },
              {
                "group": "Lighthouse AI",
                "pages": [
                  "user-guide/tutorials/prowler-app-lighthouse",
                  "user-guide/tutorials/prowler-app-lighthouse-multi-llm"
                ]
              },
              "user-guide/tutorials/prowler-cloud-public-ips",
              {
                "group": "Tutorials",
                "pages": [
                  "user-guide/tutorials/prowler-app-sso-entra",
                  "user-guide/tutorials/bulk-provider-provisioning",
                  "user-guide/tutorials/aws-organizations-bulk-provisioning"
                ]
              }
            ]
          },
          {
            "group": "CLI",
            "pages": [
              "user-guide/cli/tutorials/misc",
              "user-guide/cli/tutorials/reporting",
              "user-guide/cli/tutorials/compliance",
              "user-guide/cli/tutorials/dashboard",
              "user-guide/cli/tutorials/configuration_file",
              "user-guide/cli/tutorials/logging",
              "user-guide/cli/tutorials/mutelist",
              {
                "group": "Integrations",
                "pages": [
                  "user-guide/providers/aws/securityhub",
                  "user-guide/cli/tutorials/integrations",
                  "user-guide/providers/aws/s3"
                ]
              },
              "user-guide/cli/tutorials/fixer",
              "user-guide/cli/tutorials/check-aliases",
              "user-guide/cli/tutorials/custom-checks-metadata",
              "user-guide/cli/tutorials/pentesting",
              "user-guide/cli/tutorials/scan-unused-services",
              "user-guide/cli/tutorials/quick-inventory",
              {
                "group": "Tutorials",
                "pages": ["user-guide/cli/tutorials/parallel-execution"]
              }
            ]
          },
          {
            "group": "Providers",
            "pages": [
              {
                "group": "AWS",
                "pages": [
                  "user-guide/providers/aws/getting-started-aws",
                  "user-guide/providers/aws/authentication",
                  "user-guide/providers/aws/role-assumption",
                  "user-guide/providers/aws/organizations",
                  "user-guide/providers/aws/regions-and-partitions",
                  "user-guide/providers/aws/tag-based-scan",
                  "user-guide/providers/aws/resource-arn-based-scan",
                  "user-guide/providers/aws/boto3-configuration",
                  "user-guide/providers/aws/threat-detection",
                  "user-guide/providers/aws/cloudshell",
                  "user-guide/providers/aws/multiaccount"
                ]
              },
              {
                "group": "Azure",
                "pages": [
                  "user-guide/providers/azure/getting-started-azure",
                  "user-guide/providers/azure/authentication",
                  "user-guide/providers/azure/use-non-default-cloud",
                  "user-guide/providers/azure/subscriptions",
                  "user-guide/providers/azure/create-prowler-service-principal"
                ]
              },
              {
                "group": "Google Cloud",
                "pages": [
                  "user-guide/providers/gcp/getting-started-gcp",
                  "user-guide/providers/gcp/authentication",
                  "user-guide/providers/gcp/projects",
                  "user-guide/providers/gcp/organization",
                  "user-guide/providers/gcp/retry-configuration"
                ]
              },
              {
                "group": "Alibaba Cloud",
                "pages": [
                  "user-guide/providers/alibabacloud/getting-started-alibabacloud",
                  "user-guide/providers/alibabacloud/authentication"
                ]
              },
              {
                "group": "Kubernetes",
                "pages": [
                  "user-guide/providers/kubernetes/getting-started-k8s",
                  "user-guide/providers/kubernetes/misc"
                ]
              },
              {
                "group": "Microsoft 365",
                "pages": [
                  "user-guide/providers/microsoft365/getting-started-m365",
                  "user-guide/providers/microsoft365/authentication",
                  "user-guide/providers/microsoft365/use-of-powershell"
                ]
              },
              {
                "group": "GitHub",
                "pages": [
                  "user-guide/providers/github/getting-started-github",
                  "user-guide/providers/github/authentication"
                ]
              },
              {
                "group": "IaC",
                "pages": [
                  "user-guide/providers/iac/getting-started-iac",
                  "user-guide/providers/iac/authentication"
                ]
              },
              {
                "group": "MongoDB Atlas",
                "pages": [
                  "user-guide/providers/mongodbatlas/getting-started-mongodbatlas",
                  "user-guide/providers/mongodbatlas/authentication"
                ]
              },
              {
                "group": "LLM",
                "pages": ["user-guide/providers/llm/getting-started-llm"]
              },
              {
                "group": "Oracle Cloud Infrastructure",
                "pages": [
                  "user-guide/providers/oci/getting-started-oci",
                  "user-guide/providers/oci/authentication"
                ]
              }
            ]
          },
          {
            "group": "Compliance",
            "pages": ["user-guide/compliance/tutorials/threatscore"]
          }
        ]
      },
      {
        "tab": "Developer Guide",
        "groups": [
          {
            "group": "Concepts",
            "pages": [
              "developer-guide/introduction",
              "developer-guide/provider",
              "developer-guide/services",
              "developer-guide/checks",
              "developer-guide/outputs",
              "developer-guide/integrations",
              "developer-guide/security-compliance-framework",
              "developer-guide/lighthouse",
              "developer-guide/mcp-server"
            ]
          },
          {
            "group": "Providers",
            "pages": [
              "developer-guide/aws-details",
              "developer-guide/azure-details",
              "developer-guide/gcp-details",
              "developer-guide/kubernetes-details",
              "developer-guide/m365-details",
              "developer-guide/github-details",
              "developer-guide/llm-details"
            ]
          },
          {
            "group": "Miscellaneous",
            "pages": [
              "developer-guide/documentation",
              {
                "group": "Testing",
                "pages": [
                  "developer-guide/unit-testing",
                  "developer-guide/integration-testing"
                ]
              },
              "developer-guide/debugging",
              "developer-guide/configurable-checks",
              "developer-guide/renaming-checks",
              "developer-guide/check-metadata-guidelines"
            ]
          }
        ]
      },
      {
        "tab": "Security",
        "pages": ["security"]
      },
      {
        "tab": "Contact Us",
        "pages": ["contact"]
      },
      {
        "tab": "Troubleshooting",
        "pages": ["troubleshooting"]
      },
      {
        "tab": "About Us",
        "icon": "/favicon.ico",
        "href": "https://prowler.com/about#team"
      },
      {
        "tab": "Changelog",
        "icon": "github",
        "href": "https://github.com/prowler-cloud/prowler/releases"
      },
      {
        "tab": "Public Roadmap",
        "href": "https://roadmap.prowler.com/"
      }
    ],
    "global": {
      "anchors": [
        {
          "anchor": "GitHub",
          "href": "https://github.com/prowler-cloud/prowler",
          "icon": "github"
        },
        {
          "anchor": "Slack",
          "href": "https://goto.prowler.com/slack",
          "icon": "slack"
        },
        {
          "anchor": "YouTube",
          "href": "https://www.youtube.com/@prowlercloud",
          "icon": "youtube"
        }
      ]
    }
  },
  "navbar": {
    "links": [
      {
        "label": "Prowler Hub",
        "href": "https://hub.prowler.com"
      },
      {
        "label": "Prowler Cloud",
        "href": "https://cloud.prowler.com",
        "style": "primary"
      }
    ]
  },
  "analytics": {
    "ga4": {
      "measurementId": "G-KBKV70W5Y2"
    }
  },
  "feedback": {
    "thumbsRating": true,
    "suggestEdit": true,
    "raiseIssue": true
  },
  "footer": {
    "socials": {
      "x-twitter": "https://x.com/prowlercloud",
      "github": "https://github.com/prowler-cloud/prowler",
      "linkedin": "https://www.linkedin.com/company/prowler-security",
      "youtube": "https://www.youtube.com/@prowlercloud",
      "slack": "https://goto.prowler.com/slack",
      "website": "https://prowler.com"
    }
  },
  "redirects": [
    {
      "source": "/projects/prowler-open-source/en/latest/tutorials/prowler-app-lighthouse",
      "destination": "/user-guide/tutorials/prowler-app-lighthouse"
    },
    {
      "source": "/projects/prowler-open-source/en/latest/developer-guide/introduction",
      "destination": "/developer-guide/introduction"
    },
    {
      "source": "/projects/prowler-open-source/en/latest/tutorials/aws/getting-started-aws",
      "destination": "/user-guide/providers/aws/getting-started-aws"
    },
    {
      "source": "/projects/prowler-open-source/en/latest/tutorials/azure/getting-started-azure",
      "destination": "/user-guide/providers/azure/getting-started-azure"
    },
    {
      "source": "/projects/prowler-open-source/en/latest/tutorials/gcp/getting-started-gcp",
      "destination": "/user-guide/providers/gcp/getting-started-gcp"
    },
    {
      "source": "/projects/prowler-open-source/en/latest/tutorials/microsoft365/getting-started-m365",
      "destination": "/user-guide/providers/microsoft365/getting-started-m365"
    },
    {
      "source": "/projects/prowler-open-source/en/latest/tutorials/github/getting-started-github",
      "destination": "/user-guide/providers/github/getting-started-github"
    },
    {
      "source": "/projects/prowler-open-source/en/latest/tutorials/prowler-app-sso",
      "destination": "/user-guide/tutorials/prowler-app-sso"
    },
    {
      "source": "/projects/prowler-open-source/en/latest",
      "destination": "/introduction"
    },
    {
      "source": "/projects/prowler-saas/en/latest/:slug*",
      "destination": "https://docs.prowler.pro/en/latest/:slug*"
    },
    {
      "source": "/projects/prowler-open-source/en/latest/tutorials/:slug*",
      "destination": "/user-guide/tutorials/:slug*"
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: introduction.mdx]---
Location: prowler-master/docs/introduction.mdx

```text
# What is Prowler?

**Prowler** is the world’s most widely used open-source cloud security platform that **automates security and compliance** across any cloud environment. With hundreds of ready-to-use security checks, remediation guidance, and compliance frameworks, Prowler delivers AI-driven, customizable, and easy-to-use monitoring and integrations, making cloud security simple, scalable, and cost-effective for organizations of any size.

![](/images/products/overview.png)

<Columns cols={2}>
  <Card title="Prowler CLI" icon="terminal" href="/getting-started/products/prowler-cli">
    Command Line Interface
  </Card>
  <Card title="Prowler App" icon="pen-to-square" href="/getting-started/products/prowler-app">
    Web Application
  </Card>
  <Card title="Prowler Cloud" icon="pen-to-square" href="/getting-started/products/prowler-cloud">
    A managed service built on top of Prowler App.
  </Card>
  <Card title="Prowler Hub" icon="map" href="/getting-started/products/prowler-hub">
    A public library of versioned checks, cloud service artifacts, and compliance frameworks.
  </Card>
</Columns>

## Supported Providers

The supported providers right now are:

| Provider                                                                         | Support    | Interface    |
| -------------------------------------------------------------------------------- | ---------- | ------------ |
| [AWS](/user-guide/providers/aws/getting-started-aws)                             | Official   | UI, API, CLI |
| [Azure](/user-guide/providers/azure/getting-started-azure)                       | Official   | UI, API, CLI |
| [Google Cloud](/user-guide/providers/gcp/getting-started-gcp)                    | Official   | UI, API, CLI |
| [Kubernetes](/user-guide/providers/kubernetes/getting-started-k8s)               | Official   | UI, API, CLI |
| [M365](/user-guide/providers/microsoft365/getting-started-m365)                  | Official   | UI, API, CLI |
| [Github](/user-guide/providers/github/getting-started-github)                    | Official   | UI, API, CLI |
| [Oracle Cloud](/user-guide/providers/oci/getting-started-oci)                    | Official   | UI, API, CLI |
| [Infra as Code](/user-guide/providers/iac/getting-started-iac)                   | Official   | UI, API, CLI |
| [MongoDB Atlas](/user-guide/providers/mongodbatlas/getting-started-mongodbatlas) | Official   | UI, API, CLI |
| [LLM](/user-guide/providers/llm/getting-started-llm)                             | Official   | CLI          |
| **NHN**                                                                          | Unofficial | CLI          |

For more information about the checks and compliance of each provider visit [Prowler Hub](https://hub.prowler.com).

## Where to go next?

<Columns cols={2}>
  <Card title="User Guide" icon="terminal" href="/user-guide/tutorials/prowler-app">
    Detailed instructions on how to use Prowler.
  </Card>
  <Card title="Development Guide" icon="pen-to-square" href="/developer-guide/introduction">
    Interested in contributing to Prowler?
  </Card>
</Columns>
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: prowler-master/docs/README.md

```text
# Prowler Documentation

This repository contains the Prowler Open Source documentation powered by [Mintlify](https://mintlify.com).

## Documentation Structure

- **Getting Started**: Overview, installation, and basic usage guides
- **User Guide**: Comprehensive guides for Prowler App, CLI, providers, and compliance
- **Developer Guide**: Technical documentation for developers contributing to Prowler

## Local Development

Install the [Mintlify CLI](https://www.npmjs.com/package/mint) to preview documentation changes locally:

```bash
npm i -g mint
```

Run the following command at the root of your documentation (where `mint.json` is located):

```bash
mint dev
```

View your local preview at `http://localhost:3000`.

## Publishing Changes

Changes pushed to the main branch are automatically deployed to production through Mintlify's GitHub integration.

## Documentation Guidelines

When contributing to the documentation, please follow the Prowler documentation style guide located in the `.claude` directory.

## Troubleshooting

- If your dev environment isn't running: Run `mint update` to ensure you have the most recent version of the CLI.
- If a page loads as a 404: Make sure you are running in a folder with a valid `mint.json` file and that the page path is correctly listed in the navigation.

## Resources

- [Prowler GitHub Repository](https://github.com/prowler-cloud/prowler)
- [Prowler Documentation](https://docs.prowler.com/)
- [Mintlify Documentation](https://mintlify.com/docs)
- [Mintlify Community](https://mintlify.com/community)
```

--------------------------------------------------------------------------------

---[FILE: security.mdx]---
Location: prowler-master/docs/security.mdx

```text
---
title: 'Security'
---

## Compliance and Trust
We publish our live SOC 2 Type 2 Compliance data at [https://trust.prowler.com](https://trust.prowler.com)

As an **AWS Partner**, we have passed the [AWS Foundation Technical Review (FTR)](https://aws.amazon.com/partners/foundational-technical-review/).


## Encryption (Prowler Cloud)

We use encryption everywhere possible. The data and communications used by **Prowler Cloud** are **encrypted at-rest** and **in-transit**.

## Data Retention Policy (Prowler Cloud)

Prowler Cloud is GDPR compliant in regards to personal data and the ["right to be forgotten"](https://gdpr.eu/right-to-be-forgotten/). When a user deletes their account their user information will be deleted from Prowler Cloud online and backup systems within 10 calendar days.

## Software Security

We follow a **security-by-design approach** throughout our software development lifecycle. All changes go through automated checks at every stage, from local development to production deployment.

We enforce [pre-commit](https://github.com/prowler-cloud/prowler/blob/master/.pre-commit-config.yaml) validations to catch issues early, and [our CI/CD pipelines](https://github.com/prowler-cloud/prowler/tree/master/.github) include multiple security gates to ensure code quality, secure configurations, and compliance with internal standards.

Our container registries are continuously scanned for vulnerabilities, with findings automatically reported to our security team for assessment and remediation. This process evolves alongside our stack as we adopt new languages, frameworks, and technologies, ensuring our security practices remain comprehensive, proactive, and adaptable.

### Static Application Security Testing (SAST)

We employ multiple SAST tools across our codebase to identify security vulnerabilities, code quality issues, and potential bugs during development:

#### CodeQL Analysis
- **Scope**: UI (JavaScript/TypeScript), API (Python), and SDK (Python)
- **Frequency**: On every push and pull request, plus daily scheduled scans
- **Integration**: Results uploaded to GitHub Security tab via SARIF format
- **Purpose**: Identifies security vulnerabilities, coding errors, and potential exploits in source code

#### Python Security Scanners
- **Bandit**: Detects common security issues in Python code (SQL injection, hardcoded passwords, etc.)
  - Configured to ignore test files and report only high-severity issues
  - Runs on both SDK and API codebases
- **Pylint**: Static code analysis with security-focused checks
  - Integrated into pre-commit hooks and CI/CD pipelines

#### Code Quality & Dead Code Detection
- **Vulture**: Identifies unused code that could indicate incomplete implementations or security gaps
- **Flake8**: Style guide enforcement with security-relevant checks
- **Shellcheck**: Security and correctness checks for shell scripts

### Software Composition Analysis (SCA)

We continuously monitor our dependencies for known vulnerabilities and ensure timely updates:

#### Dependency Vulnerability Scanning
- **Safety**: Scans Python dependencies against known vulnerability databases
  - Runs on every commit via pre-commit hooks
  - Integrated into CI/CD for SDK and API
  - Configured with selective ignores for tracked exceptions
- **Trivy**: Multi-purpose scanner for containers and dependencies
  - Scans all container images (UI, API, SDK, MCP Server)
  - Checks for vulnerabilities in OS packages and application dependencies
  - Reports findings to GitHub Security tab

#### Automated Dependency Updates
- **Dependabot**: Automated pull requests for dependency updates
  - **Python (pip)**: Monthly updates for SDK
  - **GitHub Actions**: Monthly updates for workflow dependencies
  - **Docker**: Monthly updates for base images
  - Temporarily paused for API and UI to maintain stability during active development
  - **Security-first approach**: Even when paused, Dependabot automatically creates pull requests for security vulnerabilities, ensuring critical security patches are never delayed

### Container Security

All container images are scanned before deployment:

- **Trivy Vulnerability Scanning**:
  - Scans images for vulnerabilities and misconfigurations
  - Generates SARIF reports uploaded to GitHub Security tab
  - Creates PR comments with scan summaries
  - Configurable to fail builds on critical findings
  - Reports include CVE counts and remediation guidance
- **Hadolint**: Dockerfile linting to enforce best practices
  - Validates Dockerfile syntax and structure
  - Ensures secure image building practices

### Secrets Detection

We protect against accidental exposure of sensitive credentials:

- **TruffleHog**: Scans entire codebase and Git history for secrets
  - Runs on every push and pull request
  - Pre-commit hook prevents committing secrets
  - Detects high-entropy strings, API keys, tokens, and credentials
  - Configured to report verified and unknown findings

### Security Monitoring

- **GitHub Security Tab**: Centralized view of all security findings from CodeQL, Trivy, and other SARIF-compatible tools
- **Artifact Retention**: Security scan reports retained for post-deployment analysis
- **PR Comments**: Automated security feedback on pull requests for rapid remediation

## Reporting Vulnerabilities

At Prowler, we consider the security of our open source software and systems a top priority. But no matter how much effort we put into system security, there can still be vulnerabilities present.

If you discover a vulnerability, we would like to know about it so we can take steps to address it as quickly as possible. We would like to ask you to help us better protect our users, our clients and our systems.

When reporting vulnerabilities, please consider (1) attack scenario / exploitability, and (2) the security impact of the bug. The following issues are considered out of scope:

- Social engineering support or attacks requiring social engineering.
- Clickjacking on pages with no sensitive actions.
- Cross-Site Request Forgery (CSRF) on unauthenticated forms or forms with no sensitive actions.
- Attacks requiring Man-In-The-Middle (MITM) or physical access to a user's device.
- Previously known vulnerable libraries without a working Proof of Concept (PoC).
- Comma Separated Values (CSV) injection without demonstrating a vulnerability.
- Missing best practices in SSL/TLS configuration.
- Any activity that could lead to the disruption of service (DoS).
- Rate limiting or brute force issues on non-authentication endpoints.
- Missing best practices in Content Security Policy (CSP).
- Missing HttpOnly or Secure flags on cookies.
- Configuration of or missing security headers.
- Missing email best practices, such as invalid, incomplete, or missing SPF/DKIM/DMARC records.
- Vulnerabilities only affecting users of outdated or unpatched browsers (less than two stable versions behind).
- Software version disclosure, banner identification issues, or descriptive error messages.
- Tabnabbing.
- Issues that require unlikely user interaction.
- Improper logout functionality and improper session timeout.
- CORS misconfiguration without an exploitation scenario.
- Broken link hijacking.
- Automated scanning results (e.g., sqlmap, Burp active scanner) that have not been manually verified.
- Content spoofing and text injection issues without a clear attack vector.
- Email spoofing without exploiting security flaws.
- Dead links or broken links.
- User enumeration.

Testing guidelines:

- Do not run automated scanners on other customer projects. Running automated scanners can run up costs for our users. Aggressively configured scanners might inadvertently disrupt services, exploit vulnerabilities, lead to system instability or breaches and violate Terms of Service from our upstream providers. Our own security systems won't be able to distinguish hostile reconnaissance from whitehat research. If you wish to run an automated scanner, notify us at support@prowler.com and only run it on your own Prowler app project. Do NOT attack Prowler in usage of other customers.
- Do not take advantage of the vulnerability or problem you have discovered, for example by downloading more data than necessary to demonstrate the vulnerability or deleting or modifying other people's data.

Reporting guidelines:

- File a report through our Support Desk at https://support.prowler.com
- If it is about a lack of a security functionality, please file a feature request instead at https://github.com/prowler-cloud/prowler/issues
- Do provide sufficient information to reproduce the problem, so we will be able to resolve it as quickly as possible.
- If you have further questions and want direct interaction with the Prowler team, please contact us at via our Community Slack at goto.prowler.com/slack.

Disclosure guidelines:

- In order to protect our users and customers, do not reveal the problem to others until we have researched, addressed and informed our affected customers.
- If you want to publicly share your research about Prowler at a conference, in a blog or any other public forum, you should share a draft with us for review and approval at least 30 days prior to the publication date. Please note that the following should not be included:
    - Data regarding any Prowler user or customer projects.
    - Prowler customers' data.
    - Information about Prowler employees, contractors or partners.

What we promise:

- We will respond to your report within 5 business days with our evaluation of the report and an expected resolution date.
- If you have followed the instructions above, we will not take any legal action against you in regard to the report.
- We will handle your report with strict confidentiality, and not pass on your personal details to third parties without your permission.
- We will keep you informed of the progress towards resolving the problem.
- In the public information concerning the problem reported, we will give your name as the discoverer of the problem (unless you desire otherwise).

We strive to resolve all problems as quickly as possible, and we would like to play an active role in the ultimate publication on the problem after it is resolved.
```

--------------------------------------------------------------------------------

---[FILE: style.css]---
Location: prowler-master/docs/style.css

```text
/* Version Badge Styling */
.version-badge-container {
    display: inline-block;
        margin: 0 0 1rem 0;
    padding: 0;
}

.version-badge {
    display: inline-flex;
    align-items: center;
    margin: 0;
    padding: 0.375rem 0.75rem;
    background: linear-gradient(135deg, #1a1a1a 0%, #000000 100%);
    color: #ffffff;
    border-radius: 1.25rem;
    font-weight: 400;
    font-size: 0.875rem;
    line-height: 1.25rem;
    border: 1px solid rgba(0, 0, 0, 0.15);
    box-shadow: none;
}

.version-badge-label {
    font-weight: 400;
    opacity: 1;
}

.version-badge-version {
    background: rgba(255, 255, 255, 0.12);
    padding: 0.125rem 0.5rem;
    border-radius: 0.875rem;
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
    font-weight: 600;
    font-size: 0.875rem;
    color: #ffffff;
    border: none;
}


.dark .version-badge {
    background: #55B685;
        color: #000000;
        border: 2px solid rgba(85, 182, 133, 0.3);
        box-shadow: none;
    }

    .dark .version-badge-version {
        background: rgba(0, 0, 0, 0.1);
        color: #000000;
        border: none;
}
```

--------------------------------------------------------------------------------

---[FILE: troubleshooting.mdx]---
Location: prowler-master/docs/troubleshooting.mdx

```text
---
title: 'Troubleshooting'
---

- **Running `prowler` I get `[File: utils.py:15] [Module: utils]	CRITICAL: path/redacted: OSError[13]`**:

    That is an error related to file descriptors or opened files allowed by your operating system.

    In macOS Ventura, the default value for the `file descriptors` is `256`. With the following command `ulimit -n 1000` you'll increase that value and solve the issue.

    If you have a different OS and you are experiencing the same, please increase the value of your `file descriptors`. You can check it running `ulimit -a | grep "file descriptors"`.

    This error is also related with a lack of system requirements. To improve performance, Prowler stores information in memory so it may need to be run in a system with more than 1GB of memory.


See section [Logging](/user-guide/cli/tutorials/logging) for further information or [contact us](/contact).

## Common Issues with Docker Compose Installation

- **Problem adding AWS Provider using "Connect assuming IAM Role" in Docker (see [GitHub Issue #7745](https://github.com/prowler-cloud/prowler/issues/7745))**:

    When running Prowler App via Docker, you may encounter errors such as `Provider not set`, `AWS assume role error - Unable to locate credentials`, or `Provider has no secret` when trying to add an AWS Provider using the "Connect assuming IAM Role" option. This typically happens because the container does not have access to the necessary AWS credentials or profiles.

    **Workaround:**

      - Ensure your AWS credentials and configuration are available to the Docker container. You can do this by mounting your local `.aws` directory into the container. For example, in your `docker-compose.yaml`, add the following volume to the relevant services:

      ```yaml
      volumes:
        - "${HOME}/.aws:/home/prowler/.aws:ro"
      ```
      This should be added to the `api`, `worker`, and `worker-beat` services.

    - Create or update your `~/.aws/config` and `~/.aws/credentials` files with the appropriate profiles and roles. For example:

      ```ini
      [profile prowler-profile]
      role_arn = arn:aws:iam::<account-id>:role/ProwlerScan
      source_profile = default
      ```
      And set the environment variable in your `.env` file:

      ```env
      AWS_PROFILE=prowler-profile
      ```

    - If you are scanning multiple AWS accounts, you may need to add multiple profiles to your AWS config. Note that this workaround is mainly for local testing; for production or multi-account setups, follow the [CloudFormation Template guide](https://github.com/prowler-cloud/prowler/issues/7745) and ensure the correct IAM roles and permissions are set up in each account.
```

--------------------------------------------------------------------------------

````
