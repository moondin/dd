---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 85
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 85 of 867)

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

---[FILE: gcp.mdx]---
Location: prowler-master/docs/getting-started/comparison/gcp.mdx

```text
---
title: 'GCP Cloud Security Command Center (Cloud SCC)'
---

Google Cloud Security Command Center (Cloud SCC) is a centralized security and risk management platform for Google Cloud Platform (GCP). It provides visibility into assets, vulnerabilities, and threats across GCP environments, helping organizations to manage and improve their security posture.

## Key Features and Strengths

- **Centralized Security Visibility:** Cloud SCC provides a single pane of glass to monitor the security and risk status across your GCP resources. It aggregates findings from various GCP security services, such as Security Health Analytics, Web Security Scanner, and Event Threat Detection.

- **Asset Inventory and Classification:** Cloud SCC offers comprehensive asset discovery and classification across GCP, giving security teams a detailed inventory of their cloud resources, including their configurations and security states.

- **Threat Detection and Monitoring:** The platform integrates with GCP’s threat detection tools, such as Google’s Event Threat Detection, which analyzes logs for suspicious activities and potential threats.

- **Compliance Monitoring:** Cloud SCC helps monitor compliance with various regulatory standards by continuously assessing your GCP resources against best practices and security benchmarks.

- **Automated Remediation:** Cloud SCC can trigger automated responses to security findings through integrations with Google Cloud Functions or other orchestration tools, helping to mitigate risks quickly.

- **Native GCP Integration:** Cloud SCC is deeply integrated with the GCP ecosystem, offering seamless operation within Google Cloud environments and leveraging Google's extensive security expertise.

## Limitations

- **GCP-Centric:** While Cloud SCC is powerful within the GCP ecosystem, it is primarily focused on GCP and does not natively extend to multi-cloud environments without additional tools or connectors.

- **Cost Considerations:** As a managed service within GCP, costs can scale with the amount of data ingested and the complexity of the environment, especially as additional features or higher volumes of data are utilized.

- **Dependency on GCP Services:** Cloud SCC's capabilities depend on other GCP services being enabled, such as Security Health Analytics and Web Security Scanner, which may increase overall complexity and cost.

## Prowler

Prowler is an open-source, multi-cloud security tool designed to perform detailed security assessments and compliance checks across diverse cloud environments, including AWS, Azure, GCP, and Kubernetes. Here are the key advantages of Prowler when compared to GCP Cloud SCC:

## Main Advantages of Prowler

- **Multi-Region and Multi-Account Scanning by Default:**
  - Prowler inherently supports multi-region and multi-account scanning across multiple cloud providers, including GCP, AWS, Azure, and Kubernetes. It does not require additional configuration to perform these scans, making it immediately useful for organizations operating in multiple cloud environments.

- **Minimal Setup Requirements:**
  - Prowler requires only appropriate roles and permissions to start scanning. It doesn’t necessitate enabling specific services within GCP, which can simplify the setup process and reduce dependencies.

- **Versatile Execution Environment:**
  - Prowler can be run from various environments, such as a local workstation, container, Google Cloud Shell, or even other cloud providers by assuming a role. This versatility allows for flexible deployment and integration into existing security operations.

- **Flexible Results Storage and Sharing:**
  - Prowler results can be stored in an S3 bucket for AWS, Google Cloud Storage (GCS) for GCP, or locally, allowing for quick analysis and easy sharing. This flexibility is particularly advantageous for multi-cloud security assessments and collaborative security processes.

- **Customizable Reporting and Analysis:**
  - Prowler supports exporting results in multiple formats, including JSON, CSV, OCSF format, and static HTML reports. These reports can be tailored to specific needs and easily integrated with other security tools or dashboards, providing comprehensive insights across all cloud environments.

- **SIEM Integration and Cost Efficiency:**
  - Prowler can be configured to send findings directly into SIEM systems, including those integrated with GCP or other platforms. By sending only failed findings or selected results, Prowler helps manage costs associated with data ingestion and analysis in SIEM platforms.

- **Custom Checks and Compliance Frameworks:**
  - Prowler allows for the creation of custom security checks, remediation actions, and compliance frameworks, providing flexibility that can be adapted to the unique security policies and regulatory requirements of an organization.

- **Extensive Compliance Support:**
  - Prowler supports over 27 compliance frameworks out of the box, with capabilities to extend these frameworks to GCP environments as well as other cloud platforms. This broad compliance coverage ensures that organizations can maintain adherence to various regulatory requirements.

- **Kubernetes and Multi-Cloud Support:**
  - Prowler is designed to support security assessments across cloud environments, including Kubernetes clusters and GCP. This multi-cloud capability is essential for organizations that operate across diverse cloud platforms and require consistent security posture management.

- **All-Region Checks:**
  - Prowler runs all checks in all regions by default, ensuring comprehensive coverage across an organization’s cloud resources, regardless of the region or cloud provider.

## Comparison Summary

### Scope and Environment

- **GCP Cloud SCC** is ideal for organizations primarily using GCP, offering a centralized platform for managing security and compliance within the GCP ecosystem.
- **Prowler** excels in multi-cloud environments, offering flexibility and comprehensive security checks across AWS, Azure, GCP, and Kubernetes without being confined to a single cloud provider.

### Setup and Flexibility

- **GCP Cloud SCC** requires enabling various GCP services and may involve more complex setup, especially for multi-region or multi-account scenarios within GCP.
- **Prowler** requires minimal setup and can be deployed quickly across different cloud environments, offering a more straightforward approach to multi-cloud security management.

### Customization and Compliance

- **GCP Cloud SCC** provides predefined compliance checks within the GCP environment but may require additional tools or customization for broader or more specific requirements.
- **Prowler** allows for extensive customization of security checks, compliance frameworks, and reporting, providing a flexible solution that can be tailored to an organization’s specific needs across various cloud platforms.

### Cost Efficiency

- **GCP Cloud SCC** costs can scale with the volume of data processed and the number of enabled services, which may be significant in large or complex environments. SCC pricing is confusing to understand, and starts at $0.071 per vCPU hour for some tiers and depending on the scan service. Take a look at the pricing model [here](https://cloud.google.com/security-command-center/pricing), godspeed.
- **Prowler** helps manage costs by allowing selective reporting, such as sending only failed findings to SIEMs, and storing results in cost-effective ways, such as local storage or cloud buckets. Prowler is always $0.001 per resource per day - no per account charge.

### Multi-Cloud and Multi-Region Support

- **GCP Cloud SCC** is focused on GCP and may require additional tools for comprehensive multi-cloud support.
- **Prowler** is inherently multi-cloud, supporting AWS, Azure, GCP, and Kubernetes out of the box, making it an ideal choice for organizations with diverse cloud footprints.

## Conclusion

For a CISO evaluating these tools, the decision between GCP Cloud Security Command Center (Cloud SCC) and Prowler hinges on the organization’s cloud strategy, security management needs, and the level of flexibility and multi-cloud support required:

- If the organization is heavily invested in GCP and needs a centralized platform that integrates seamlessly with GCP services for asset management, threat detection, and compliance monitoring, **GCP Cloud SCC** is likely the better choice.
- If the organization operates in a multi-cloud environment or requires a highly customizable tool for performing detailed security assessments across AWS, Azure, GCP, and Kubernetes, **Prowler** offers a more flexible and cost-effective solution, especially for those needing quick deployment, minimal setup, and the ability to manage security across diverse cloud environments.
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: prowler-master/docs/getting-started/comparison/index.mdx

```text
---
title: 'Comparison'
---

Click to learn more about each cloud security provider and learn how Prowler is differentiated.

- [AWS Security Hub](/getting-started/comparison/awssecurityhub)
- [Microsoft Sentinel](/getting-started/comparison/microsoftsentinel)
- [Microsoft Defender](/getting-started/comparison/microsoftdefender)
- [Google Cloud Security Command Center](/getting-started/comparison/gcp)
```

--------------------------------------------------------------------------------

---[FILE: microsoftdefender.mdx]---
Location: prowler-master/docs/getting-started/comparison/microsoftdefender.mdx

```text
---
title: 'Microsoft Defender for Cloud'
---

**Use open-source scanning to validate and extend Microsoft Defender for Cloud**

---

## **Overview**

If you're using Microsoft Defender for Cloud to monitor your Azure infrastructure, Prowler can complement it with fully transparent, customizable scans across Azure, AWS, GCP, and Kubernetes. Prowler helps you validate policies, automate compliance, and gain deeper visibility—all from the CLI, API or our Prowler UI.

You can run Prowler alongside Defender for Cloud to:

* Double-check security posture with open-source checks.
* Customize rules for your organization’s policies.
* Bring your own, or community contributed policies.
* Automate multi-cloud scans in CI/CD or scheduled jobs.

---

## **Why use Prowler with Defender for Cloud**

Microsoft Defender for Cloud offers centralized dashboards, alerting, and some cross-cloud coverage. Prowler provides full transparency and control over what’s being checked and how those checks work—no vendor lock-in, no surprises.

Use them together to get:

* More confidence in your security posture
* Checks you can inspect, modify, and version
* CLI-first, portable scanning across clouds
* Open-source tooling that integrates easily into pipelines and audits

---

## **Quickstart**

Here’s how to install Prowler and run a scan in your Azure account.

### **1\. Install Prowler**

```
git clone https://github.com/prowler-cloud/prowler
cd prowler
./install.sh
```

### **2\. Authenticate with Azure**

Make sure you're signed in and select your subscription:

```
az login
export AZURE_SUBSCRIPTION_ID=$(az account show --query id -o tsv)
```

### **3\. Run a scan**

```
./prowler -p Azure -f az-aks -f az-general
```

This will run checks focused on Azure Kubernetes Service (AKS) and general Azure best practices.

### **4\. Review results**

```
cat output/prowler-output-*.json
open output/prowler-output-*.html
```

You can export findings in JSON, CSV, JUnit, HTML, or AWS Security Hub–compatible formats.

---

## **Compare capabilities**

| Feature | Microsoft Defender for Cloud | Prowler |
| ----- | ----- | ----- |
| Azure-native posture management | ✅ | ✅ |
| AWS, GCP, and Kubernetes support | ⚠️ (limited) | ✅ |
| Custom policy creation | ❌ | ✅ |
| CLI-first, scriptable | ❌ | ✅ |
| Open source | ❌ | ✅ |
| Compliance mappings (CIS, NIST, etc.) | ✅ (limited control) | ✅ (customizable) |
| Exportable detections | ❌ | ✅ |

---

## **Common use cases**

**✅ Validate policies**
 Run Prowler to confirm your Azure policies are configured as expected and compliant with frameworks like CIS or NIST.

**✅ Automate compliance scans**
 Schedule regular Prowler scans in your CI/CD pipeline or infrastructure monitoring workflows. Generate reports for auditors or internal reviews.

**✅ Extend detection coverage**
 If Defender for Cloud doesn’t cover all the services or resources in your environment, Prowler’s checks fill in the gaps.

**✅ Build custom checks**
 Security is never one-size-fits-all. Prowler lets you write your own checks for organization-specific policies.
```

--------------------------------------------------------------------------------

---[FILE: microsoftsentinel.mdx]---
Location: prowler-master/docs/getting-started/comparison/microsoftsentinel.mdx

```text
---
title: 'Microsoft Sentinel'
---

Microsoft Sentinel is a scalable, cloud-native security information and event management (SIEM) and security orchestration automated response (SOAR) solution. It's designed to collect, detect, investigate, and respond to threats across the enterprise, primarily within the Azure cloud environment but also extending to on-premises and other cloud environments through various connectors.

## Key Features and Strengths

- **SIEM and SOAR Capabilities:** Microsoft Sentinel combines SIEM and SOAR functionalities, allowing it to collect and analyze large volumes of data from various sources and automate responses to detected threats.

- **Native Azure Integration:** As part of the Azure ecosystem, Sentinel integrates seamlessly with Azure services, providing deep visibility and analytics for Azure resources.

- **Advanced Threat Detection:** Sentinel uses AI and machine learning to detect potential threats and anomalous activities, leveraging Microsoft's extensive threat intelligence network.

- **Scalability and Flexibility:** Being cloud-native, Sentinel scales automatically to handle increasing data volumes and complexity without requiring extensive infrastructure management.

- **Customizable Dashboards and Analytics:** Sentinel offers customizable dashboards and analytics, allowing security teams to tailor their views and queries to specific needs.

- **Multi-Source Data Ingestion:** While focused on Azure, Sentinel can ingest data from multiple sources, including AWS, GCP, on-premises environments, and third-party security products.

## Limitations

- **Azure-Centric:** While it supports multi-cloud environments, its primary focus and strengths are within the Azure ecosystem. Integration with other cloud platforms and on-premises environments may require additional connectors and configurations.

- **Cost Considerations:** As a SIEM tool, Sentinel can become expensive, particularly as data ingestion and analysis volumes grow. The cost model is based on data volume, which can add up quickly in large environments.

- **Complexity in Customization:** Although Sentinel offers advanced customization, setting up and fine-tuning these customizations can require significant expertise and effort, particularly in multi-cloud environments.

## Prowler

Prowler is an open-source, multi-cloud security tool that offers extensive flexibility and customization, making it ideal for organizations that need to maintain a strong security posture across diverse cloud environments. Here are the key advantages of Prowler, particularly when compared to Microsoft Sentinel:

## Main Advantages of Prowler

- **Multi-Region and Multi-Account Scanning by Default:**
  - Prowler is inherently multi-region and multi-account, requiring no additional configuration to scan across these environments. This capability is available out of the box without needing to enable specific services or create complex setups.

- **Minimal Setup Requirements:**
  - Prowler requires only a role with appropriate permissions to begin scanning. There’s no need for extensive setup, making it easier and quicker to deploy across various environments.

- **Versatile Execution Environment:**
  - Prowler can be run from a local workstation, container, AWS CloudShell, or even from other cloud providers like Azure or GCP by assuming a role. This versatility allows security teams to integrate Prowler into a wide range of operational workflows without being tied to a single cloud environment.

- **Flexible Results Storage and Sharing:**
  - Prowler results can be stored directly into an S3 bucket, allowing for quick analysis or locally for easy sharing and collaboration. This flexibility is particularly useful for multi-cloud security assessments and incident response.

- **Customizable Reporting and Analysis:**
  - Prowler supports exporting results in multiple formats, including JSON, CSV, OCSF format, and static HTML reports. Additionally, it can integrate with Amazon QuickSight for advanced analytics, and offers a SaaS model with resource-based pricing, making it adaptable to various organizational needs.

- **SIEM Integration and Cost Efficiency:**
  - While Microsoft Sentinel has a built-in SIEM functionality, Prowler can send results directly into SIEM systems, including Microsoft Sentinel. By sending only failed findings, Prowler can help optimize costs associated with data ingestion and storage in SIEM platforms.

- **Custom Checks and Compliance Frameworks:**
  - Prowler enables users to write custom checks, remediations, and compliance frameworks quickly, allowing organizations to adapt the tool to their specific security policies and regulatory requirements.

- **Extensive Compliance Support:**
  - Prowler supports over 27 compliance frameworks out of the box, providing comprehensive coverage for AWS environments, which can be extended to multi-cloud scenarios.

- **Kubernetes and Multi-Cloud Support:**
  - Prowler is designed to support security assessments beyond AWS, including Kubernetes clusters (including EKS) and environments in Azure and GCP. This capability is critical for organizations that operate across multiple cloud platforms and require consistent security posture management.

- **All-Region Checks:**
  - Prowler runs all checks in all regions by default, ensuring comprehensive coverage without the limitations that may be imposed by region-specific configurations or services.

## Comparison Summary

### Scope and Environment
- **Microsoft Sentinel** is an advanced SIEM/SOAR tool optimized for Azure environments, with support for multi-cloud and on-premises systems through connectors.
- **Prowler** is a flexible, multi-cloud security tool that excels in environments where organizations need to manage security across AWS, Azure, GCP, and Kubernetes with minimal setup and high customizability.

### Setup and Flexibility
- **Microsoft Sentinel** requires more setup, especially when integrating with non-Azure environments, and its cost scales with data ingestion.
- **Prowler** requires minimal setup and can be easily deployed in any cloud or on-premises environment. Its ability to run from various environments and store results in flexible formats makes it particularly adaptable.

### Customization and Compliance
- **Microsoft Sentinel** offers powerful but complex customization options, primarily within the Azure ecosystem.
- **Prowler** provides straightforward customization of security checks, remediation actions, and compliance frameworks, with broad support for multiple compliance standards out of the box.

### Cost Efficiency
- **Microsoft Sentinel** can become costly as data volumes grow, particularly in large or multi-cloud environments.
- **Prowler** helps control costs by enabling selective reporting (e.g., sending only failed findings to SIEMs like Sentinel) and storing results in cost-effective ways, such as S3 or locally.

### Multi-Cloud and Multi-Region Support
- **Microsoft Sentinel** supports multi-cloud environments but may require additional configuration and connectors.
- **Prowler** is designed for multi-cloud environments from the ground up, with inherent support for AWS, Azure, GCP, Kubernetes, and all regions, making it an ideal tool for organizations with diverse cloud footprints.

## Conclusion

For a CISO or security professional evaluating these tools, the decision between Microsoft Sentinel and Prowler hinges on the organization's cloud strategy, SIEM needs, and the level of customization and flexibility required:

- If the organization is heavily invested in Azure and needs an integrated SIEM/SOAR solution with advanced threat detection, analytics, and automation capabilities, **Microsoft Sentinel** is likely the better choice.

- If the organization operates in a multi-cloud environment or requires a highly customizable tool for performing detailed security assessments across AWS, Azure, GCP, and Kubernetes, **Prowler** offers a more flexible and cost-effective solution, especially for those needing quick deployment, minimal setup, and the ability to manage security across diverse cloud environments.
```

--------------------------------------------------------------------------------

---[FILE: prowler-api-reference.mdx]---
Location: prowler-master/docs/getting-started/goto/prowler-api-reference.mdx

```text
---
title: "Prowler API Reference"
url: "https://api.prowler.com/api/v1/docs"
---
```

--------------------------------------------------------------------------------

---[FILE: prowler-cloud.mdx]---
Location: prowler-master/docs/getting-started/goto/prowler-cloud.mdx

```text
---
title: "Go to Cloud"
url: "https://cloud.prowler.com"
---
```

--------------------------------------------------------------------------------

---[FILE: prowler-hub.mdx]---
Location: prowler-master/docs/getting-started/goto/prowler-hub.mdx

```text
---
title: "Go to Hub"
url: "https://hub.prowler.com"
---
```

--------------------------------------------------------------------------------

---[FILE: prowler-mcp.mdx]---
Location: prowler-master/docs/getting-started/goto/prowler-mcp.mdx

```text
---
title: "Prowler MCP"
url: "https://github.com/prowler-cloud/prowler/tree/master/mcp_server"
tag: "new!"
---
```

--------------------------------------------------------------------------------

---[FILE: prowler-app.mdx]---
Location: prowler-master/docs/getting-started/installation/prowler-app.mdx

```text
---
title: "Installation"
---

### Installation

Prowler App offers flexible installation methods tailored to various environments.

Refer to the [Prowler App Tutorial](/user-guide/tutorials/prowler-app) for detailed usage instructions.

<Warning>
  Prowler configuration is based on `.env` files. Every version of Prowler can have differences on that file, so, please, use the file that corresponds with that version or repository branch or tag.
</Warning>

<Tabs>
  <Tab title="Docker Compose">
    _Requirements_:

    - `Docker Compose` installed: https://docs.docker.com/compose/install/.

    _Commands_:

    ```bash
    VERSION=$(curl -s https://api.github.com/repos/prowler-cloud/prowler/releases/latest | jq -r .tag_name)
    curl -sLO "https://raw.githubusercontent.com/prowler-cloud/prowler/refs/tags/${VERSION}/docker-compose.yml"
    curl -sLO "https://raw.githubusercontent.com/prowler-cloud/prowler/refs/tags/${VERSION}/.env"
    docker compose up -d
    ```
  </Tab>
  <Tab title="GitHub">
    _Requirements_:

    - `git` installed.
    - `poetry` installed: [poetry installation](https://python-poetry.org/docs/#installation).
    - `npm` installed: [npm installation](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).
    - `Docker Compose` installed: https://docs.docker.com/compose/install/.

    <Warning>
      Make sure to have `api/.env` and `ui/.env.local` files with the required environment variables. You can find the required environment variables in the [`api/.env.template`](https://github.com/prowler-cloud/prowler/blob/master/api/.env.example) and [`ui/.env.template`](https://github.com/prowler-cloud/prowler/blob/master/ui/.env.template) files.
    </Warning>
    _Commands to run the API_:

    ```bash
    git clone https://github.com/prowler-cloud/prowler \
    cd prowler/api \
    poetry install \
    eval $(poetry env activate) \
    set -a \
    source .env \
    docker compose up postgres valkey -d \
    cd src/backend \
    python manage.py migrate --database admin \
    gunicorn -c config/guniconf.py config.wsgi:application
    ```

    <Warning>
      Starting from Poetry v2.0.0, `poetry shell` has been deprecated in favor of `poetry env activate`.

      If your poetry version is below 2.0.0 you must keep using `poetry shell` to activate your environment. In case you have any doubts, consult the Poetry environment activation guide: https://python-poetry.org/docs/managing-environments/#activating-the-environment
    </Warning>
    > Now, you can access the API documentation at http://localhost:8080/api/v1/docs.

    _Commands to run the API Worker_:

    ```bash
    git clone https://github.com/prowler-cloud/prowler \
    cd prowler/api \
    poetry install \
    eval $(poetry env activate) \
    set -a \
    source .env \
    cd src/backend \
    python -m celery -A config.celery worker -l info -E
    ```

    _Commands to run the API Scheduler_:

    ```bash
    git clone https://github.com/prowler-cloud/prowler \
    cd prowler/api \
    poetry install \
    eval $(poetry env activate) \
    set -a \
    source .env \
    cd src/backend \
    python -m celery -A config.celery beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler
    ```

    _Commands to run the UI_:

    ```bash
    git clone https://github.com/prowler-cloud/prowler \
    cd prowler/ui \
    npm install \
    npm run build \
    npm start
    ```

    > Enjoy Prowler App at http://localhost:3000 by signing up with your email and password.

    <Warning>
      Google and GitHub authentication is only available in [Prowler Cloud](https://prowler.com).
    </Warning>
  </Tab>
</Tabs>

### Updating Prowler App

Upgrade Prowler App installation using one of two options:

#### Option 1: Updating the Environment File

To update the environment file:

Edit the `.env` file and change version values:

```env
PROWLER_UI_VERSION="5.15.0"
PROWLER_API_VERSION="5.15.0"
```

<Note>
  You can find the latest versions of Prowler App in the [Releases Github section](https://github.com/prowler-cloud/prowler/releases) or in the [Container Versions](#container-versions) section of this documentation.
</Note>


#### Option 2: Using Docker Compose Pull

```bash
docker compose pull --policy always
```

The `--policy always` flag ensures that Docker pulls the latest images even if they already exist locally.

<Note>
  **What Gets Preserved During Upgrade**

  Everything is preserved, nothing will be deleted after the update.
</Note>

### Troubleshooting Installation Issues

If containers don't start, check logs for errors:

```bash
# Check logs for errors
docker compose logs

# Verify image versions
docker images | grep prowler
```

If issues are encountered, rollback to the previous version by changing the `.env` file back to the previous version and running:

```bash
docker compose pull
docker compose up -d
```

### Container Versions

The available versions of Prowler App are the following:

- `latest`: in sync with `master` branch (please note that it is not a stable version)
- `v4-latest`: in sync with `v4` branch (please note that it is not a stable version)
- `v3-latest`: in sync with `v3` branch (please note that it is not a stable version)
- `<x.y.z>` (release): you can find the releases [here](https://github.com/prowler-cloud/prowler/releases), those are stable releases.
- `stable`: this tag always point to the latest release.
- `v4-stable`: this tag always point to the latest release for v4.
- `v3-stable`: this tag always point to the latest release for v3.

The container images are available here:

- Prowler App:
  - [DockerHub - Prowler UI](https://hub.docker.com/r/prowlercloud/prowler-ui/tags)
  - [DockerHub - Prowler API](https://hub.docker.com/r/prowlercloud/prowler-api/tags)
```

--------------------------------------------------------------------------------

---[FILE: prowler-cli.mdx]---
Location: prowler-master/docs/getting-started/installation/prowler-cli.mdx

```text
---
title: 'Installation'
---

## Installation

To install Prowler as a Python package, use `Python >= 3.9, <= 3.12`. Prowler is available as a project in [PyPI](https://pypi.org/project/prowler/):

<Tabs>
  <Tab title="pipx">
    [pipx](https://pipx.pypa.io/stable/) installs Python applications in isolated environments. Use `pipx` for global installation.

    _Requirements_:

    * `Python >= 3.9, <= 3.12`
    * `pipx` installed: [pipx installation](https://pipx.pypa.io/stable/installation/).
    * AWS, GCP, Azure and/or Kubernetes credentials

    _Commands_:

    ``` bash
    pipx install prowler
    prowler -v
    ```
  </Tab>
  <Tab title="pip">
    <Warning>
    This method modifies the chosen installation environment. Consider using [pipx](https://docs.prowler.com/projects/prowler-open-source/en/latest/#__tabbed_1_1) for global installation.
    </Warning>

    _Requirements_:

    * `Python >= 3.9, <= 3.12`
    * `Python pip >= 21.0.0`
    * AWS, GCP, Azure, M365 and/or Kubernetes credentials

    _Commands_:

    ``` bash
    pip install prowler
    prowler -v
    ```

    To upgrade Prowler to the latest version:

    ``` bash
    pip install --upgrade prowler
    ```
  </Tab>
  <Tab title="Docker">
    _Requirements_:

    * Have `docker` installed: https://docs.docker.com/get-docker/.
    * In the command below, change `-v` to your local directory path in order to access the reports.
    * AWS, GCP, Azure and/or Kubernetes credentials

    _Commands_:

    ``` bash
    docker run -ti --rm -v /your/local/dir/prowler-output:/home/prowler/output \
    --name prowler \
    --env AWS_ACCESS_KEY_ID \
    --env AWS_SECRET_ACCESS_KEY \
    --env AWS_SESSION_TOKEN toniblyx/prowler:latest
    ```
  </Tab>
  <Tab title="GitHub">
    _Requirements for Developers_:

    * `git`
    * `poetry` installed: [poetry installation](https://python-poetry.org/docs/#installation).
    * AWS, GCP, Azure and/or Kubernetes credentials

    _Commands_:

    ```bash
    git clone https://github.com/prowler-cloud/prowler
    cd prowler
    poetry install
    poetry run python prowler-cli.py -v
    ```

    <Note>
    If you want to clone Prowler from Windows, use `git config core.longpaths true` to allow long file paths.
    </Note>
  </Tab>
  <Tab title="Amazon Linux 2">
    _Requirements_:

    * `Python >= 3.9, <= 3.12`
    * AWS, GCP, Azure and/or Kubernetes credentials

    _Commands_:

    ```bash
    python3 -m pip install --user pipx
    python3 -m pipx ensurepath
    pipx install prowler
    prowler -v
    ```
  </Tab>
  <Tab title="Ubuntu">
    _Requirements_:

    * `Ubuntu 23.04` or above. For older Ubuntu versions, check [pipx installation](https://docs.prowler.com/projects/prowler-open-source/en/latest/#__tabbed_1_1) and ensure `Python >= 3.9, <= 3.12` is installed.
    * `Python >= 3.9, <= 3.12`
    * AWS, GCP, Azure and/or Kubernetes credentials

    _Commands_:

    ``` bash
    sudo apt update
    sudo apt install pipx
    pipx ensurepath
    pipx install prowler
    prowler -v
    ```
  </Tab>
  <Tab title="Brew">
    _Requirements_:

    * `Brew` installed on Mac or Linux
    * AWS, GCP, Azure and/or Kubernetes credentials

    _Commands_:

    ``` bash
    brew install prowler
    prowler -v
    ```
  </Tab>
  <Tab title="AWS CloudShell">
    After the migration of AWS CloudShell from Amazon Linux 2 to Amazon Linux 2023 [[1]](https://aws.amazon.com/about-aws/whats-new/2023/12/aws-cloudshell-migrated-al2023/) [[2]](https://docs.aws.amazon.com/cloudshell/latest/userguide/cloudshell-AL2023-migration.html), there is no longer a need to manually compile Python 3.9 as it is already included in AL2023. Prowler can thus be easily installed following the generic method of installation via pip. Follow the steps below to successfully execute Prowler v4 in AWS CloudShell:

    _Requirements_:

    * Open AWS CloudShell `bash`.

    _Commands_:

    ```bash
    sudo bash
    adduser prowler
    su prowler
    python3 -m pip install --user pipx
    python3 -m pipx ensurepath
    pipx install prowler
    cd /tmp
    prowler aws
    ```

    <Note>
    To download the results from AWS CloudShell, select Actions -> Download File and add the full path of each file. For the CSV file it will be something like `/tmp/output/prowler-output-123456789012-20221220191331.csv`
    </Note>
  </Tab>
  <Tab title="Azure CloudShell">
    _Requirements_:

    * Open Azure CloudShell `bash`.

    _Commands_:

    ```bash
    python3 -m pip install --user pipx
    python3 -m pipx ensurepath
    pipx install prowler
    cd /tmp
    prowler azure --az-cli-auth
    ```
  </Tab>
</Tabs>

## Container Versions

The available versions of Prowler CLI are the following:

- `latest`: in sync with `master` branch (please note that it is not a stable version)
- `v4-latest`: in sync with `v4` branch (please note that it is not a stable version)
- `v3-latest`: in sync with `v3` branch (please note that it is not a stable version)
- `<x.y.z>` (release): you can find the releases [here](https://github.com/prowler-cloud/prowler/releases), those are stable releases.
- `stable`: this tag always point to the latest release.
- `v4-stable`: this tag always point to the latest release for v4.
- `v3-stable`: this tag always point to the latest release for v3.

The container images are available here:

- Prowler CLI:

    - [DockerHub](https://hub.docker.com/r/toniblyx/prowler/tags)
    - [AWS Public ECR](https://gallery.ecr.aws/prowler-cloud/prowler)
```

--------------------------------------------------------------------------------

````
