---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 4
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 4 of 867)

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

---[FILE: prowler-cli.py]---
Location: prowler-master/prowler-cli.py

```python
#!/usr/bin/env python3
import sys

from prowler.__main__ import prowler

if __name__ == "__main__":
    sys.exit(prowler())
```

--------------------------------------------------------------------------------

---[FILE: pyproject.toml]---
Location: prowler-master/pyproject.toml
Signals: Docker

```toml
[build-system]
build-backend = "poetry.core.masonry.api"
requires = ["poetry-core>=2.0"]

# https://peps.python.org/pep-0621/
[project]
authors = [{name = "Toni de la Fuente", email = "toni@blyx.com"}]
classifiers = [
  "Programming Language :: Python :: 3",
  "Programming Language :: Python :: 3.9",
  "License :: OSI Approved :: Apache Software License"
]
dependencies = [
  "awsipranges==0.3.3",
  "alive-progress==3.3.0",
  "azure-identity==1.21.0",
  "azure-keyvault-keys==4.10.0",
  "azure-mgmt-applicationinsights==4.1.0",
  "azure-mgmt-authorization==4.0.0",
  "azure-mgmt-compute==34.0.0",
  "azure-mgmt-containerregistry==12.0.0",
  "azure-mgmt-containerservice==34.1.0",
  "azure-mgmt-cosmosdb==9.7.0",
  "azure-mgmt-databricks==2.0.0",
  "azure-mgmt-keyvault==10.3.1",
  "azure-mgmt-monitor==6.0.2",
  "azure-mgmt-network==28.1.0",
  "azure-mgmt-rdbms==10.1.0",
  "azure-mgmt-postgresqlflexibleservers==1.1.0",
  "azure-mgmt-recoveryservices==3.1.0",
  "azure-mgmt-recoveryservicesbackup==9.2.0",
  "azure-mgmt-resource==23.3.0",
  "azure-mgmt-search==9.1.0",
  "azure-mgmt-security==7.0.0",
  "azure-mgmt-sql==3.0.1",
  "azure-mgmt-storage==22.1.1",
  "azure-mgmt-subscription==3.1.1",
  "azure-mgmt-web==8.0.0",
  "azure-mgmt-apimanagement==5.0.0",
  "azure-mgmt-loganalytics==12.0.0",
  "azure-monitor-query==2.0.0",
  "azure-storage-blob==12.24.1",
  "boto3==1.39.15",
  "botocore==1.39.15",
  "colorama==0.4.6",
  "cryptography==44.0.1",
  "dash==3.1.1",
  "dash-bootstrap-components==2.0.3",
  "detect-secrets==1.5.0",
  "dulwich==0.23.0",
  "google-api-python-client==2.163.0",
  "google-auth-httplib2>=0.1,<0.3",
  "jsonschema==4.23.0",
  "kubernetes==32.0.1",
  "markdown==3.9.0",
  "microsoft-kiota-abstractions==1.9.2",
  "msgraph-sdk==1.23.0",
  "numpy==2.0.2",
  "pandas==2.2.3",
  "py-ocsf-models==0.5.0",
  "pydantic (>=2.0,<3.0)",
  "pygithub==2.5.0",
  "python-dateutil (>=2.9.0.post0,<3.0.0)",
  "pytz==2025.1",
  "schema==0.7.5",
  "shodan==1.31.0",
  "slack-sdk==3.34.0",
  "tabulate==0.9.0",
  "tzlocal==5.3.1",
  "py-iam-expand==0.1.0",
  "h2==4.3.0",
  "oci==2.160.3",
  "alibabacloud_credentials==1.0.3",
  "alibabacloud_ram20150501==1.2.0",
  "alibabacloud_tea_openapi==0.4.1",
  "alibabacloud_sts20150401==1.1.6",
  "alibabacloud_vpc20160428==6.13.0",
  "alibabacloud_ecs20140526==7.2.5",
  "alibabacloud_sas20181203==6.1.0",
  "alibabacloud_oss20190517==1.0.6",
  "alibabacloud-gateway-oss-util==0.0.3",
  "alibabacloud_actiontrail20200706==2.4.1",
  "alibabacloud_cs20151215==6.1.0",
  "alibabacloud-rds20140815==12.0.0",
  "alibabacloud-sls20201230==5.9.0"
]
description = "Prowler is an Open Source security tool to perform AWS, GCP and Azure security best practices assessments, audits, incident response, continuous monitoring, hardening and forensics readiness. It contains hundreds of controls covering CIS, NIST 800, NIST CSF, CISA, RBI, FedRAMP, PCI-DSS, GDPR, HIPAA, FFIEC, SOC2, GXP, AWS Well-Architected Framework Security Pillar, AWS Foundational Technical Review (FTR), ENS (Spanish National Security Scheme) and your custom security frameworks."
license = "Apache-2.0"
maintainers = [{name = "Prowler Engineering", email = "engineering@prowler.com"}]
name = "prowler"
readme = "README.md"
requires-python = ">3.9.1,<3.13"
version = "5.16.0"

[project.scripts]
prowler = "prowler.__main__:prowler"

[project.urls]
"Changelog" = "https://github.com/prowler-cloud/prowler/releases"
"Documentation" = "https://docs.prowler.com"
"Homepage" = "https://github.com/prowler-cloud/prowler"
"Issue tracker" = "https://github.com/prowler-cloud/prowler/issues"

[tool.poetry]
packages = [
  {include = "prowler"},
  {include = "dashboard"}
]
requires-poetry = ">=2.0"

[tool.poetry.group.dev.dependencies]
bandit = "1.8.3"
black = "25.1.0"
coverage = "7.6.12"
docker = "7.1.0"
flake8 = "7.1.2"
freezegun = "1.5.1"
marshmallow = ">=3.15.0,<4.0.0"
mock = "5.2.0"
moto = {extras = ["all"], version = "5.1.11"}
openapi-schema-validator = "0.6.3"
openapi-spec-validator = "0.7.1"
pre-commit = "4.2.0"
pylint = "3.3.4"
pytest = "8.3.5"
pytest-cov = "6.0.0"
pytest-env = "1.1.5"
pytest-randomly = "3.16.0"
pytest-xdist = "3.6.1"
safety = "3.2.9"
vulture = "2.14"

[tool.poetry-version-plugin]
source = "init"

[tool.poetry_bumpversion.file."prowler/config/config.py"]
replace = 'prowler_version = "{new_version}"'
search = 'prowler_version = "{current_version}"'

[tool.pytest.ini_options]
pythonpath = [
  "."
]

[tool.pytest_env]
# For Moto and Boto3 while testing AWS
AWS_ACCESS_KEY_ID = 'testing'
AWS_DEFAULT_REGION = 'us-east-1'
AWS_SECRET_ACCESS_KEY = 'testing'
AWS_SECURITY_TOKEN = 'testing'
AWS_SESSION_TOKEN = 'testing'
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: prowler-master/README.md

```text
<p align="center">
  <img align="center" src="https://github.com/prowler-cloud/prowler/blob/master/docs/img/prowler-logo-black.png#gh-light-mode-only" width="50%" height="50%">
  <img align="center" src="https://github.com/prowler-cloud/prowler/blob/master/docs/img/prowler-logo-white.png#gh-dark-mode-only" width="50%" height="50%">
</p>
<p align="center">
  <b><i>Prowler</b> is the Open Cloud Security platform trusted by thousands to automate security and compliance in any cloud environment. With hundreds of ready-to-use checks and compliance frameworks, Prowler delivers real-time, customizable monitoring and seamless integrations, making cloud security simple, scalable, and cost-effective for organizations of any size.
</p>
<p align="center">
<b>Secure ANY cloud at AI Speed at <a href="https://prowler.com">prowler.com</i></b>
</p>

<p align="center">
<a href="https://goto.prowler.com/slack"><img width="30" height="30" alt="Prowler community on Slack" src="https://github.com/prowler-cloud/prowler/assets/38561120/3c8b4ec5-6849-41a5-b5e1-52bbb94af73a"></a>
  <br>
  <a href="https://goto.prowler.com/slack">Join our Prowler community!</a>
</p>
<hr>
<p align="center">
  <a href="https://goto.prowler.com/slack"><img alt="Slack Shield" src="https://img.shields.io/badge/slack-prowler-brightgreen.svg?logo=slack"></a>
  <a href="https://pypi.org/project/prowler/"><img alt="Python Version" src="https://img.shields.io/pypi/v/prowler.svg"></a>
  <a href="https://pypi.python.org/pypi/prowler/"><img alt="Python Version" src="https://img.shields.io/pypi/pyversions/prowler.svg"></a>
  <a href="https://pypistats.org/packages/prowler"><img alt="PyPI Downloads" src="https://img.shields.io/pypi/dw/prowler.svg?label=downloads"></a>
  <a href="https://hub.docker.com/r/toniblyx/prowler"><img alt="Docker Pulls" src="https://img.shields.io/docker/pulls/toniblyx/prowler"></a>
  <a href="https://gallery.ecr.aws/prowler-cloud/prowler"><img width="120" height=19" alt="AWS ECR Gallery" src="https://user-images.githubusercontent.com/3985464/151531396-b6535a68-c907-44eb-95a1-a09508178616.png"></a>
  <a href="https://codecov.io/gh/prowler-cloud/prowler"><img src="https://codecov.io/gh/prowler-cloud/prowler/graph/badge.svg?token=OflBGsdpDl"/></a>
  <a href="https://insights.linuxfoundation.org/project/prowler-cloud-prowler"><img src="https://insights.linuxfoundation.org/api/badge/health-score?project=prowler-cloud-prowler"/></a>
</p>
<p align="center">
    <a href="https://github.com/prowler-cloud/prowler/releases"><img alt="Version" src="https://img.shields.io/github/v/release/prowler-cloud/prowler"></a>
  <a href="https://github.com/prowler-cloud/prowler/releases"><img alt="Version" src="https://img.shields.io/github/release-date/prowler-cloud/prowler"></a>
  <a href="https://github.com/prowler-cloud/prowler"><img alt="Contributors" src="https://img.shields.io/github/contributors-anon/prowler-cloud/prowler"></a>
  <a href="https://github.com/prowler-cloud/prowler/issues"><img alt="Issues" src="https://img.shields.io/github/issues/prowler-cloud/prowler"></a>
  <a href="https://github.com/prowler-cloud/prowler"><img alt="License" src="https://img.shields.io/github/license/prowler-cloud/prowler"></a>
  <a href="https://twitter.com/ToniBlyx"><img alt="Twitter" src="https://img.shields.io/twitter/follow/toniblyx?style=social"></a>
  <a href="https://twitter.com/prowlercloud"><img alt="Twitter" src="https://img.shields.io/twitter/follow/prowlercloud?style=social"></a>
</p>
<hr>
<p align="center">
  <img align="center" src="/docs/img/prowler-cloud.gif" width="100%" height="100%">
</p>

# Description

**Prowler** is the world’s most widely used _open-source cloud security platform_ that automates security and compliance across **any cloud environment**. With hundreds of ready-to-use security checks, remediation guidance, and compliance frameworks, Prowler is built to _“Secure ANY cloud at AI Speed”_. Prowler delivers **AI-driven**, **customizable**, and **easy-to-use** assessments, dashboards, reports, and integrations, making cloud security **simple**, **scalable**, and **cost-effective** for organizations of any size.

Prowler includes hundreds of built-in controls to ensure compliance with standards and frameworks, including:

- **Prowler ThreatScore:** Weighted risk prioritization scoring that helps you focus on the most critical security findings first
- **Industry Standards:** CIS, NIST 800, NIST CSF, CISA, and MITRE ATT&CK
- **Regulatory Compliance and Governance:** RBI, FedRAMP, PCI-DSS, and NIS2
- **Frameworks for Sensitive Data and Privacy:** GDPR, HIPAA, and FFIEC
- **Frameworks for Organizational Governance and Quality Control:** SOC2, GXP, and ISO 27001
- **Cloud-Specific Frameworks:** AWS Foundational Technical Review (FTR), AWS Well-Architected Framework, and BSI C5
- **National Security Standards:** ENS (Spanish National Security Scheme) and KISA ISMS-P (Korean)
- **Custom Security Frameworks:** Tailored to your needs

## Prowler App / Prowler Cloud

Prowler App / [Prowler Cloud](https://cloud.prowler.com/) is a web-based application that simplifies running Prowler across your cloud provider accounts. It provides a user-friendly interface to visualize the results and streamline your security assessments.

![Prowler App](docs/images/products/overview.png)
![Risk Pipeline](docs/images/products/risk-pipeline.png)
![Threat Map](docs/images/products/threat-map.png)


>For more details, refer to the [Prowler App Documentation](https://docs.prowler.com/projects/prowler-open-source/en/latest/#prowler-app-installation)

## Prowler CLI

```console
prowler <provider>
```
![Prowler CLI Execution](docs/img/short-display.png)


## Prowler Dashboard

```console
prowler dashboard
```
![Prowler Dashboard](docs/images/products/dashboard.png)

# Prowler at a Glance
> [!Tip]
> For the most accurate and up-to-date information about checks, services, frameworks, and categories, visit [**Prowler Hub**](https://hub.prowler.com).


| Provider | Checks | Services | [Compliance Frameworks](https://docs.prowler.com/projects/prowler-open-source/en/latest/tutorials/compliance/) | [Categories](https://docs.prowler.com/projects/prowler-open-source/en/latest/tutorials/misc/#categories) | Support | Interface |
|---|---|---|---|---|---|---|
| AWS | 584 | 85 | 40 | 17 | Official | UI, API, CLI |
| GCP | 89 | 17 | 14 | 5 | Official | UI, API, CLI |
| Azure | 169 | 22 | 15 | 8 | Official | UI, API, CLI |
| Kubernetes | 84 | 7 | 6 | 9 | Official | UI, API, CLI |
| GitHub | 20 | 2 | 1 | 2 | Official | UI, API, CLI |
| M365 | 70 | 7 | 3 | 2 | Official | UI, API, CLI |
| OCI | 52 | 15 | 1 | 12 | Official | UI, API, CLI |
| Alibaba Cloud | 63 | 10 | 1 | 9 | Official | CLI |
| IaC | [See `trivy` docs.](https://trivy.dev/latest/docs/coverage/iac/) | N/A | N/A | N/A | Official | UI, API, CLI |
| MongoDB Atlas | 10 | 4 | 0 | 3 | Official | UI, API, CLI |
| LLM | [See `promptfoo` docs.](https://www.promptfoo.dev/docs/red-team/plugins/) | N/A | N/A | N/A | Official | CLI |
| NHN | 6 | 2 | 1 | 0 | Unofficial | CLI |

> [!Note]
> The numbers in the table are updated periodically.



> [!Note]
> Use the following commands to list Prowler's available checks, services, compliance frameworks, and categories:
> - `prowler <provider> --list-checks`
> - `prowler <provider> --list-services`
> - `prowler <provider> --list-compliance`
> - `prowler <provider> --list-categories`

# 💻 Installation

## Prowler App

Prowler App offers flexible installation methods tailored to various environments:

> For detailed instructions on using Prowler App, refer to the [Prowler App Usage Guide](https://docs.prowler.com/projects/prowler-open-source/en/latest/tutorials/prowler-app/).

### Docker Compose

**Requirements**

* `Docker Compose` installed: https://docs.docker.com/compose/install/.

**Commands**

``` console
curl -LO https://raw.githubusercontent.com/prowler-cloud/prowler/refs/heads/master/docker-compose.yml
curl -LO https://raw.githubusercontent.com/prowler-cloud/prowler/refs/heads/master/.env
docker compose up -d
```

> Containers are built for `linux/amd64`.

### Configuring Your Workstation for Prowler App

If your workstation's architecture is incompatible, you can resolve this by:

- **Setting the environment variable**: `DOCKER_DEFAULT_PLATFORM=linux/amd64`
- **Using the following flag in your Docker command**: `--platform linux/amd64`

> Once configured, access the Prowler App at http://localhost:3000. Sign up using your email and password to get started.

### Common Issues with Docker Pull Installation

> [!Note]
  If you want to use AWS role assumption (e.g., with the "Connect assuming IAM Role" option), you may need to mount your local `.aws` directory into the container as a volume (e.g., `- "${HOME}/.aws:/home/prowler/.aws:ro"`). There are several ways to configure credentials for Docker containers. See the [Troubleshooting](./docs/troubleshooting.md) section for more details and examples.

You can find more information in the [Troubleshooting](./docs/troubleshooting.md) section.


### From GitHub

**Requirements**

* `git` installed.
* `poetry` v2 installed: [poetry installation](https://python-poetry.org/docs/#installation).
* `pnpm` installed: [pnpm installation](https://pnpm.io/installation).
* `Docker Compose` installed: https://docs.docker.com/compose/install/.

**Commands to run the API**

``` console
git clone https://github.com/prowler-cloud/prowler
cd prowler/api
poetry install
eval $(poetry env activate)
set -a
source .env
docker compose up postgres valkey -d
cd src/backend
python manage.py migrate --database admin
gunicorn -c config/guniconf.py config.wsgi:application
```
> [!IMPORTANT]
> As of Poetry v2.0.0, the `poetry shell` command has been deprecated. Use `poetry env activate` instead for environment activation.
>
> If your Poetry version is below v2.0.0, continue using `poetry shell` to activate your environment.
> For further guidance, refer to the Poetry Environment Activation Guide https://python-poetry.org/docs/managing-environments/#activating-the-environment.

> After completing the setup, access the API documentation at http://localhost:8080/api/v1/docs.

**Commands to run the API Worker**

``` console
git clone https://github.com/prowler-cloud/prowler
cd prowler/api
poetry install
eval $(poetry env activate)
set -a
source .env
cd src/backend
python -m celery -A config.celery worker -l info -E
```

**Commands to run the API Scheduler**

``` console
git clone https://github.com/prowler-cloud/prowler
cd prowler/api
poetry install
eval $(poetry env activate)
set -a
source .env
cd src/backend
python -m celery -A config.celery beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler
```

**Commands to run the UI**

``` console
git clone https://github.com/prowler-cloud/prowler
cd prowler/ui
pnpm install
pnpm run build
pnpm start
```

> Once configured, access the Prowler App at http://localhost:3000. Sign up using your email and password to get started.

## Prowler CLI
### Pip package
Prowler CLI is available as a project in [PyPI](https://pypi.org/project/prowler-cloud/). Consequently, it can be installed using pip with Python >3.9.1, <3.13:

```console
pip install prowler
prowler -v
```
>For further guidance, refer to [https://docs.prowler.com](https://docs.prowler.com/projects/prowler-open-source/en/latest/#prowler-cli-installation)

### Containers

**Available Versions of Prowler CLI**

The following versions of Prowler CLI are available, depending on your requirements:

- `latest`: Synchronizes with the `master` branch. Note that this version is not stable.
- `v4-latest`: Synchronizes with the `v4` branch. Note that this version is not stable.
- `v3-latest`: Synchronizes with the `v3` branch. Note that this version is not stable.
- `<x.y.z>` (release): Stable releases corresponding to specific versions. You can find the complete list of releases [here](https://github.com/prowler-cloud/prowler/releases).
- `stable`: Always points to the latest release.
- `v4-stable`: Always points to the latest release for v4.
- `v3-stable`: Always points to the latest release for v3.

The container images are available here:
- Prowler CLI:
    - [DockerHub](https://hub.docker.com/r/prowlercloud/prowler/tags)
    - [AWS Public ECR](https://gallery.ecr.aws/prowler-cloud/prowler)
- Prowler App:
    - [DockerHub - Prowler UI](https://hub.docker.com/r/prowlercloud/prowler-ui/tags)
    - [DockerHub - Prowler API](https://hub.docker.com/r/prowlercloud/prowler-api/tags)

### From GitHub

Python >3.9.1, <3.13 is required with pip and Poetry:

``` console
git clone https://github.com/prowler-cloud/prowler
cd prowler
eval $(poetry env activate)
poetry install
python prowler-cli.py -v
```
> [!IMPORTANT]
> To clone Prowler on Windows, configure Git to support long file paths by running the following command: `git config core.longpaths true`.

> [!IMPORTANT]
> As of Poetry v2.0.0, the `poetry shell` command has been deprecated. Use `poetry env activate` instead for environment activation.
>
> If your Poetry version is below v2.0.0, continue using `poetry shell` to activate your environment.
> For further guidance, refer to the Poetry Environment Activation Guide https://python-poetry.org/docs/managing-environments/#activating-the-environment.

# ✏️ High level architecture

## Prowler App
**Prowler App** is composed of four key components:

- **Prowler UI**: A web-based interface, built with Next.js, providing a user-friendly experience for executing Prowler scans and visualizing results.
- **Prowler API**: A backend service, developed with Django REST Framework, responsible for running Prowler scans and storing the generated results.
- **Prowler SDK**: A Python SDK designed to extend the functionality of the Prowler CLI for advanced capabilities.
- **Prowler MCP Server**: A Model Context Protocol server that provides AI tools for Lighthouse, the AI-powered security assistant. This is a critical dependency for Lighthouse functionality.

![Prowler App Architecture](docs/products/img/prowler-app-architecture.png)

## Prowler CLI

**Running Prowler**

Prowler can be executed across various environments, offering flexibility to meet your needs. It can be run from:

- Your own workstation

- A Kubernetes Job

- Google Compute Engine

- Azure Virtual Machines (VMs)

- Amazon EC2 instances

- AWS Fargate or other container platforms

- CloudShell

And many more environments.

![Architecture](docs/img/architecture.png)

# 📖 Documentation

For installation instructions, usage details, tutorials, and the Developer Guide, visit https://docs.prowler.com/

# 📃 License

Prowler is licensed under the Apache License 2.0.

A copy of the License is available at <http://www.apache.org/licenses/LICENSE-2.0>
```

--------------------------------------------------------------------------------

---[FILE: SECURITY.md]---
Location: prowler-master/SECURITY.md

```text
# Security

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

---

For more information about our security policies, please refer to our [Security](https://docs.prowler.com/projects/prowler-open-source/en/latest/security/) section in our documentation.
```

--------------------------------------------------------------------------------

---[FILE: CODEOWNERS]---
Location: prowler-master/.github/CODEOWNERS

```text
# SDK
/* @prowler-cloud/sdk
/prowler/ @prowler-cloud/sdk @prowler-cloud/detection-and-remediation
/tests/ @prowler-cloud/sdk @prowler-cloud/detection-and-remediation
/dashboard/ @prowler-cloud/sdk
/docs/ @prowler-cloud/sdk
/examples/ @prowler-cloud/sdk
/util/ @prowler-cloud/sdk
/contrib/ @prowler-cloud/sdk
/permissions/ @prowler-cloud/sdk
/codecov.yml @prowler-cloud/sdk @prowler-cloud/api

# API
/api/ @prowler-cloud/api

# UI
/ui/ @prowler-cloud/ui

# AI
/mcp_server/ @prowler-cloud/ai

# Platform
/.github/ @prowler-cloud/platform
/Makefile @prowler-cloud/platform
/kubernetes/ @prowler-cloud/platform
**/Dockerfile* @prowler-cloud/platform
**/docker-compose*.yml @prowler-cloud/platform
**/docker-compose*.yaml @prowler-cloud/platform
```

--------------------------------------------------------------------------------

---[FILE: dependabot.yml]---
Location: prowler-master/.github/dependabot.yml
Signals: Docker

```yaml
# To get started with Dependabot version updates, you'll need to specify which
# package ecosystems to update and where the package manifests are located.
# Please see the documentation for all configuration options:
# https://docs.github.com/github/administering-a-repository/configuration-options-for-dependency-updates

version: 2
updates:
  # v5
  - package-ecosystem: "pip"
    directory: "/"
    schedule:
      interval: "monthly"
    open-pull-requests-limit: 25
    target-branch: master
    labels:
      - "dependencies"
      - "pip"

  # Dependabot Updates are temporary disabled - 2025/03/19
  # - package-ecosystem: "pip"
  #   directory: "/api"
  #   schedule:
  #     interval: "daily"
  #   open-pull-requests-limit: 10
  #   target-branch: master
  #   labels:
  #     - "dependencies"
  #     - "pip"
  #     - "component/api"

  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "monthly"
    open-pull-requests-limit: 25
    target-branch: master
    labels:
      - "dependencies"
      - "github_actions"

  # Dependabot Updates are temporary disabled - 2025/03/19
  # - package-ecosystem: "npm"
  #   directory: "/ui"
  #   schedule:
  #     interval: "daily"
  #   open-pull-requests-limit: 10
  #   target-branch: master
  #   labels:
  #     - "dependencies"
  #     - "npm"
  #     - "component/ui"

  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "monthly"
    open-pull-requests-limit: 25
    target-branch: master
    labels:
      - "dependencies"
      - "docker"

  # Dependabot Updates are temporary disabled - 2025/04/15
  # v4.6
  # - package-ecosystem: "pip"
  #   directory: "/"
  #   schedule:
  #     interval: "weekly"
  #   open-pull-requests-limit: 10
  #   target-branch: v4.6
  #   labels:
  #     - "dependencies"
  #     - "pip"
  #     - "v4"

  # - package-ecosystem: "github-actions"
  #   directory: "/"
  #   schedule:
  #     interval: "weekly"
  #   open-pull-requests-limit: 10
  #   target-branch: v4.6
  #   labels:
  #     - "dependencies"
  #     - "github_actions"
  #     - "v4"

  # - package-ecosystem: "docker"
  #   directory: "/"
  #   schedule:
  #     interval: "weekly"
  #   open-pull-requests-limit: 10
  #   target-branch: v4.6
  #   labels:
  #     - "dependencies"
  #     - "docker"
  #     - "v4"

  # Dependabot Updates are temporary disabled - 2025/03/19
  # v3
  # - package-ecosystem: "pip"
  #   directory: "/"
  #   schedule:
  #     interval: "monthly"
  #   open-pull-requests-limit: 10
  #   target-branch: v3
  #   labels:
  #     - "dependencies"
  #     - "pip"
  #     - "v3"

  # - package-ecosystem: "github-actions"
  #   directory: "/"
  #   schedule:
  #     interval: "monthly"
  #   open-pull-requests-limit: 10
  #   target-branch: v3
  #   labels:
  #     - "dependencies"
  #     - "github_actions"
  #     - "v3"
```

--------------------------------------------------------------------------------

---[FILE: labeler.yml]---
Location: prowler-master/.github/labeler.yml

```yaml
documentation:
  - changed-files:
      - any-glob-to-any-file: "docs/**"

provider/aws:
  - changed-files:
      - any-glob-to-any-file: "prowler/providers/aws/**"
      - any-glob-to-any-file: "tests/providers/aws/**"

provider/azure:
  - changed-files:
      - any-glob-to-any-file: "prowler/providers/azure/**"
      - any-glob-to-any-file: "tests/providers/azure/**"

provider/gcp:
  - changed-files:
      - any-glob-to-any-file: "prowler/providers/gcp/**"
      - any-glob-to-any-file: "tests/providers/gcp/**"

provider/kubernetes:
  - changed-files:
      - any-glob-to-any-file: "prowler/providers/kubernetes/**"
      - any-glob-to-any-file: "tests/providers/kubernetes/**"

provider/m365:
  - changed-files:
      - any-glob-to-any-file: "prowler/providers/m365/**"
      - any-glob-to-any-file: "tests/providers/m365/**"

provider/github:
  - changed-files:
      - any-glob-to-any-file: "prowler/providers/github/**"
      - any-glob-to-any-file: "tests/providers/github/**"

provider/iac:
  - changed-files:
      - any-glob-to-any-file: "prowler/providers/iac/**"
      - any-glob-to-any-file: "tests/providers/iac/**"

provider/mongodbatlas:
  - changed-files:
      - any-glob-to-any-file: "prowler/providers/mongodbatlas/**"
      - any-glob-to-any-file: "tests/providers/mongodbatlas/**"

provider/oci:
  - changed-files:
      - any-glob-to-any-file: "prowler/providers/oraclecloud/**"
      - any-glob-to-any-file: "tests/providers/oraclecloud/**"

github_actions:
  - changed-files:
      - any-glob-to-any-file: ".github/workflows/*"

cli:
  - changed-files:
      - any-glob-to-any-file: "cli/**"

mutelist:
  - changed-files:
      - any-glob-to-any-file: "prowler/lib/mutelist/**"
      - any-glob-to-any-file: "prowler/providers/aws/lib/mutelist/**"
      - any-glob-to-any-file: "prowler/providers/azure/lib/mutelist/**"
      - any-glob-to-any-file: "prowler/providers/gcp/lib/mutelist/**"
      - any-glob-to-any-file: "prowler/providers/kubernetes/lib/mutelist/**"
      - any-glob-to-any-file: "prowler/providers/mongodbatlas/lib/mutelist/**"
      - any-glob-to-any-file: "tests/lib/mutelist/**"
      - any-glob-to-any-file: "tests/providers/aws/lib/mutelist/**"
      - any-glob-to-any-file: "tests/providers/azure/lib/mutelist/**"
      - any-glob-to-any-file: "tests/providers/gcp/lib/mutelist/**"
      - any-glob-to-any-file: "tests/providers/kubernetes/lib/mutelist/**"
      - any-glob-to-any-file: "tests/providers/mongodbatlas/lib/mutelist/**"

integration/s3:
  - changed-files:
      - any-glob-to-any-file: "prowler/providers/aws/lib/s3/**"
      - any-glob-to-any-file: "tests/providers/aws/lib/s3/**"

integration/slack:
  - changed-files:
      - any-glob-to-any-file: "prowler/lib/outputs/slack/**"
      - any-glob-to-any-file: "tests/lib/outputs/slack/**"

integration/security-hub:
  - changed-files:
      - any-glob-to-any-file: "prowler/providers/aws/lib/security_hub/**"
      - any-glob-to-any-file: "tests/providers/aws/lib/security_hub/**"
      - any-glob-to-any-file: "prowler/lib/outputs/asff/**"
      - any-glob-to-any-file: "tests/lib/outputs/asff/**"

output/html:
  - changed-files:
      - any-glob-to-any-file: "prowler/lib/outputs/html/**"
      - any-glob-to-any-file: "tests/lib/outputs/html/**"

output/asff:
  - changed-files:
      - any-glob-to-any-file: "prowler/lib/outputs/asff/**"
      - any-glob-to-any-file: "tests/lib/outputs/asff/**"

output/ocsf:
  - changed-files:
      - any-glob-to-any-file: "prowler/lib/outputs/ocsf/**"
      - any-glob-to-any-file: "tests/lib/outputs/ocsf/**"

output/csv:
  - changed-files:
      - any-glob-to-any-file: "prowler/lib/outputs/csv/**"
      - any-glob-to-any-file: "tests/lib/outputs/csv/**"

component/api:
  - changed-files:
      - any-glob-to-any-file: "api/**"

component/ui:
  - changed-files:
      - any-glob-to-any-file: "ui/**"

component/mcp-server:
  - changed-files:
      - any-glob-to-any-file: "mcp_server/**"

compliance:
  - changed-files:
      - any-glob-to-any-file: "prowler/compliance/**"
      - any-glob-to-any-file: "prowler/lib/outputs/compliance/**"
      - any-glob-to-any-file: "tests/lib/outputs/compliance/**"

review-django-migrations:
  - changed-files:
      - any-glob-to-any-file: "api/src/backend/api/migrations/**"

metadata-review:
  - changed-files:
      - any-glob-to-any-file: "**/*.metadata.json"
```

--------------------------------------------------------------------------------

---[FILE: pull_request_template.md]---
Location: prowler-master/.github/pull_request_template.md

```text
### Context

Please include relevant motivation and context for this PR.

If fixes an issue please add it with `Fix #XXXX`

### Description

Please include a summary of the change and which issue is fixed. List any dependencies that are required for this change.

### Steps to review

Please add a detailed description of how to review this PR.

### Checklist

- Are there new checks included in this PR? Yes / No
    - If so, do we need to update permissions for the provider? Please review this carefully.
- [ ] Review if the code is being covered by tests.
- [ ] Review if code is being documented following this specification https://github.com/google/styleguide/blob/gh-pages/pyguide.md#38-comments-and-docstrings
- [ ] Review if backport is needed.
- [ ] Review if is needed to change the [Readme.md](https://github.com/prowler-cloud/prowler/blob/master/README.md)
- [ ] Ensure new entries are added to [CHANGELOG.md](https://github.com/prowler-cloud/prowler/blob/master/prowler/CHANGELOG.md), if applicable.

#### UI
- [ ] All issue/task requirements work as expected on the UI
- [ ] Screenshots/Video of the functionality flow (if applicable) - Mobile (X < 640px)
- [ ] Screenshots/Video of the functionality flow (if applicable) - Table (640px > X < 1024px)
- [ ] Screenshots/Video of the functionality flow (if applicable) - Desktop (X > 1024px)
- [ ] Ensure new entries are added to [CHANGELOG.md](https://github.com/prowler-cloud/prowler/blob/master/ui/CHANGELOG.md), if applicable.

#### API
- [ ] Verify if API specs need to be regenerated.
- [ ] Check if version updates are required (e.g., specs, Poetry, etc.).
- [ ] Ensure new entries are added to [CHANGELOG.md](https://github.com/prowler-cloud/prowler/blob/master/api/CHANGELOG.md), if applicable.

### License

By submitting this pull request, I confirm that my contribution is made under the terms of the Apache 2.0 license.
```

--------------------------------------------------------------------------------

---[FILE: action.yml]---
Location: prowler-master/.github/actions/setup-python-poetry/action.yml

```yaml
name: 'Setup Python with Poetry'
description: 'Setup Python environment with Poetry and install dependencies'
author: 'Prowler'

inputs:
  python-version:
    description: 'Python version to use'
    required: true
  working-directory:
    description: 'Working directory for Poetry'
    required: false
    default: '.'
  poetry-version:
    description: 'Poetry version to install'
    required: false
    default: '2.1.1'
  install-dependencies:
    description: 'Install Python dependencies with Poetry'
    required: false
    default: 'true'

runs:
  using: 'composite'
  steps:
    - name: Replace @master with current branch in pyproject.toml (prowler repo only)
      if: github.event_name == 'pull_request' && github.base_ref == 'master' && github.repository == 'prowler-cloud/prowler'
      shell: bash
      working-directory: ${{ inputs.working-directory }}
      run: |
        BRANCH_NAME="${GITHUB_HEAD_REF:-${GITHUB_REF_NAME}}"
        echo "Using branch: $BRANCH_NAME"
        sed -i "s|@master|@$BRANCH_NAME|g" pyproject.toml

    - name: Install poetry
      shell: bash
      run: |
        python -m pip install --upgrade pip
        pipx install poetry==${{ inputs.poetry-version }}

    - name: Update poetry.lock with latest Prowler commit
      if: github.repository_owner == 'prowler-cloud' && github.repository != 'prowler-cloud/prowler'
      shell: bash
      working-directory: ${{ inputs.working-directory }}
      run: |
        LATEST_COMMIT=$(curl -s "https://api.github.com/repos/prowler-cloud/prowler/commits/master" | jq -r '.sha')
        echo "Latest commit hash: $LATEST_COMMIT"
        sed -i '/url = "https:\/\/github\.com\/prowler-cloud\/prowler\.git"/,/resolved_reference = / {
          s/resolved_reference = "[a-f0-9]\{40\}"/resolved_reference = "'"$LATEST_COMMIT"'"/
        }' poetry.lock
        echo "Updated resolved_reference:"
        grep -A2 -B2 "resolved_reference" poetry.lock

    - name: Update SDK resolved_reference to latest commit (prowler repo on push)
      if: github.event_name == 'push' && github.ref == 'refs/heads/master' && github.repository == 'prowler-cloud/prowler'
      shell: bash
      working-directory: ${{ inputs.working-directory }}
      run: |
        LATEST_COMMIT=$(curl -s "https://api.github.com/repos/prowler-cloud/prowler/commits/master" | jq -r '.sha')
        echo "Latest commit hash: $LATEST_COMMIT"
        sed -i '/url = "https:\/\/github\.com\/prowler-cloud\/prowler\.git"/,/resolved_reference = / {
          s/resolved_reference = "[a-f0-9]\{40\}"/resolved_reference = "'"$LATEST_COMMIT"'"/
        }' poetry.lock
        echo "Updated resolved_reference:"
        grep -A2 -B2 "resolved_reference" poetry.lock

    - name: Update poetry.lock (prowler repo only)
      if: github.repository == 'prowler-cloud/prowler'
      shell: bash
      working-directory: ${{ inputs.working-directory }}
      run: poetry lock

    - name: Set up Python ${{ inputs.python-version }}
      uses: actions/setup-python@e797f83bcb11b83ae66e0230d6156d7c80228e7c # v6.0.0
      with:
        python-version: ${{ inputs.python-version }}
        cache: 'poetry'
        cache-dependency-path: ${{ inputs.working-directory }}/poetry.lock

    - name: Install Python dependencies
      if: inputs.install-dependencies == 'true'
      shell: bash
      working-directory: ${{ inputs.working-directory }}
      run: |
        poetry install --no-root
        poetry run pip list

    - name: Update Prowler Cloud API Client
      if: github.repository_owner == 'prowler-cloud' && github.repository != 'prowler-cloud/prowler'
      shell: bash
      working-directory: ${{ inputs.working-directory }}
      run: |
        poetry remove prowler-cloud-api-client
        poetry add ./prowler-cloud-api-client
```

--------------------------------------------------------------------------------

````
