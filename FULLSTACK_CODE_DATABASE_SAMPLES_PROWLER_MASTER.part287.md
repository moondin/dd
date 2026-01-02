---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 287
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 287 of 867)

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

---[FILE: fsx_windows_file_system_multi_az_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/fsx/fsx_windows_file_system_multi_az_enabled/fsx_windows_file_system_multi_az_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "fsx_windows_file_system_multi_az_enabled",
  "CheckTitle": "FSx Windows file system is configured for Multi-AZ deployment",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Effects/Denial of Service"
  ],
  "ServiceName": "fsx",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "Other",
  "Description": "**FSx for Windows File Server** file systems are evaluated for **Multi-AZ deployment**, determined when `SubnetIds` include more than one subnet in different Availability Zones.",
  "Risk": "Using **Single-AZ** creates a **single point of failure**. AZ outages, server failures, or maintenance can cause extended file share downtime, impacting availability. Crash scenarios may leave data inconsistent, threatening **integrity**, and recovery may rely on backups, increasing **RTO/RPO**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/fsx/latest/WindowsGuide/dfs-r.html",
    "https://docs.aws.amazon.com/fsx/latest/APIReference/API_WindowsFileSystemConfiguration.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/fsx-controls.html",
    "https://docs.aws.amazon.com/fsx/latest/WindowsGuide/high-availability-multiAZ.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: Create FSx for Windows File Server with Multi-AZ\nResources:\n  <example_resource_name>:\n    Type: AWS::FSx::FileSystem\n    Properties:\n      FileSystemType: WINDOWS\n      StorageCapacity: 32\n      SubnetIds:\n        - <example_subnet_id_1>  # CRITICAL: two subnets -> Multi-AZ across AZs\n        - <example_subnet_id_2>  # CRITICAL: two subnets -> Multi-AZ across AZs\n      WindowsConfiguration:\n        ThroughputCapacity: 8\n        DeploymentType: MULTI_AZ_1  # CRITICAL: enables Multi-AZ deployment\n        PreferredSubnetId: <example_subnet_id_1>\n```",
      "Other": "1. In AWS Console, go to FSx > Create file system > Amazon FSx for Windows File Server\n2. Set Deployment type to Multi-AZ\n3. Select two Subnets in different Availability Zones\n4. Set minimal required capacity/throughput and Create\n5. Migrate data to the new file system and repoint clients to its DNS name\n6. Delete the old Single-AZ file system",
      "Terraform": "```hcl\n# Terraform: FSx for Windows File Server configured for Multi-AZ\nresource \"aws_fsx_windows_file_system\" \"<example_resource_name>\" {\n  storage_capacity    = 32\n  subnet_ids          = [\"<example_subnet_id_1>\", \"<example_subnet_id_2>\"] # CRITICAL: two subnets in different AZs\n  throughput_capacity = 8\n  deployment_type     = \"MULTI_AZ_1\"                                      # CRITICAL: enables Multi-AZ deployment\n  preferred_subnet_id = \"<example_subnet_id_1>\"\n}\n```"
    },
    "Recommendation": {
      "Text": "Prefer `MULTI_AZ_1` for production to uphold **high availability** and avoid AZ-level single points of failure. Apply **resilience** and **defense in depth**: design to tolerate AZ loss, capacity-plan for failover, and test failover regularly. *If Single-AZ is unavoidable*, limit to noncritical or app-replicated workloads and keep frequent, verified backups.",
      "Url": "https://hub.prowler.com/check/fsx_windows_file_system_multi_az_enabled"
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

---[FILE: fsx_windows_file_system_multi_az_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/fsx/fsx_windows_file_system_multi_az_enabled/fsx_windows_file_system_multi_az_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.fsx.fsx_client import fsx_client


class fsx_windows_file_system_multi_az_enabled(Check):
    def execute(self):
        findings = []
        for file_system in fsx_client.file_systems.values():
            if file_system.type == "WINDOWS":
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=file_system
                )
                if len(file_system.subnet_ids) > 1:
                    report.status = "PASS"
                    report.status_extended = f"FSx Windows file system {file_system.id} is configured for Multi-AZ deployment."

                else:
                    report.status = "FAIL"
                    report.status_extended = f"FSx Windows file system {file_system.id} is not configured for Multi-AZ deployment."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: glacier_client.py]---
Location: prowler-master/prowler/providers/aws/services/glacier/glacier_client.py

```python
from prowler.providers.aws.services.glacier.glacier_service import Glacier
from prowler.providers.common.provider import Provider

glacier_client = Glacier(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: glacier_service.py]---
Location: prowler-master/prowler/providers/aws/services/glacier/glacier_service.py
Signals: Pydantic

```python
import json
from typing import Optional

from botocore.client import ClientError
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class Glacier(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.vaults = {}
        self.__threading_call__(self._list_vaults)
        self.__threading_call__(self._get_vault_access_policy)
        self._list_tags_for_vault()

    def _list_vaults(self, regional_client):
        logger.info("Glacier - Listing Vaults...")
        try:
            list_vaults_paginator = regional_client.get_paginator("list_vaults")
            for page in list_vaults_paginator.paginate():
                for vault in page["VaultList"]:
                    if not self.audit_resources or (
                        is_resource_filtered(vault["VaultARN"], self.audit_resources)
                    ):
                        vault_name = vault["VaultName"]
                        vault_arn = vault["VaultARN"]
                        # We must use the Vault ARN as the dict key to have unique keys
                        self.vaults[vault_arn] = Vault(
                            name=vault_name,
                            arn=vault_arn,
                            region=regional_client.region,
                        )

        except Exception as error:
            logger.error(
                f"{regional_client.region} --"
                f" {error.__class__.__name__}[{error.__traceback__.tb_lineno}]:"
                f" {error}"
            )

    def _get_vault_access_policy(self, regional_client):
        logger.info("Glacier - Getting Vault Access Policy...")
        try:
            for vault in self.vaults.values():
                if vault.region == regional_client.region:
                    try:
                        vault_access_policy = regional_client.get_vault_access_policy(
                            vaultName=vault.name
                        )
                        self.vaults[vault.arn].access_policy = json.loads(
                            vault_access_policy["policy"]["Policy"]
                        )
                    except ClientError as e:
                        if e.response["Error"]["Code"] == "ResourceNotFoundException":
                            self.vaults[vault.arn].access_policy = {}
        except Exception as error:
            logger.error(
                f"{regional_client.region} --"
                f" {error.__class__.__name__}[{error.__traceback__.tb_lineno}]:"
                f" {error}"
            )

    def _list_tags_for_vault(self):
        logger.info("Glacier - List Tags...")
        try:
            for vault in self.vaults.values():
                regional_client = self.regional_clients[vault.region]
                response = regional_client.list_tags_for_vault(vaultName=vault.name)[
                    "Tags"
                ]
                vault.tags = [response]
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class Vault(BaseModel):
    name: str
    arn: str
    region: str
    access_policy: dict = {}
    tags: Optional[list] = []
```

--------------------------------------------------------------------------------

---[FILE: glacier_vaults_policy_public_access.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/glacier/glacier_vaults_policy_public_access/glacier_vaults_policy_public_access.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "glacier_vaults_policy_public_access",
  "CheckTitle": "S3 Glacier vault has no policy or its policy does not allow access to everyone",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Effects/Data Exposure",
    "TTPs/Initial Access/Unauthorized Access"
  ],
  "ServiceName": "glacier",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "Other",
  "Description": "**Glacier vault** access policy is evaluated for exposure to **public principals**. The finding highlights `Allow` statements that grant access to `Principal: '*'` (including wildcard forms), and notes when a vault lacks a policy.",
  "Risk": "Publicly grantable vault access undermines **confidentiality** and **integrity**. Anyone could list, retrieve, or delete archives, leading to data exposure or loss. Attackers may also trigger large retrieval operations, degrading **availability** and driving unexpected costs.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/amazonglacier/latest/dev/access-control-overview.html",
    "https://docs.prowler.com/checks/aws/general-policies/ensure-glacier-vault-access-policy-is-not-public-by-only-allowing-specific-services-or-principals-to-access-it#terraform"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws glacier delete-vault-access-policy --account-id <ACCOUNT_ID> --vault-name <VAULT_NAME>",
      "NativeIaC": "```yaml\n# CloudFormation: Glacier vault without an access policy (no public access)\nResources:\n  <example_resource_name>:\n    Type: AWS::Glacier::Vault\n    Properties:\n      VaultName: <example_resource_name>\n      # AccessPolicy omitted to remove any public access and pass the check\n```",
      "Other": "1. In AWS Console, open Amazon S3 Glacier (Classic)\n2. Go to Vaults and select the target vault\n3. Open the Access policy tab and click Edit\n4. Remove the policy (clear all content) or delete it\n5. Save changes",
      "Terraform": "```hcl\n# Glacier vault with no access policy (not public)\nresource \"aws_glacier_vault\" \"<example_resource_name>\" {\n  name = \"<example_resource_name>\"\n  # access_policy omitted to remove any public access and pass the check\n}\n```"
    },
    "Recommendation": {
      "Text": "Enforce **least privilege** on vault policies: restrict to specific AWS accounts or roles, avoid `Principal: '*'`, and grant only necessary actions. Apply **defense in depth** with **Vault Lock** for immutable retention and continuous review and monitoring of access to prevent broad or unintended exposure.",
      "Url": "https://hub.prowler.com/check/glacier_vaults_policy_public_access"
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

---[FILE: glacier_vaults_policy_public_access.py]---
Location: prowler-master/prowler/providers/aws/services/glacier/glacier_vaults_policy_public_access/glacier_vaults_policy_public_access.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.glacier.glacier_client import glacier_client


class glacier_vaults_policy_public_access(Check):
    def execute(self):
        findings = []
        for vault in glacier_client.vaults.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=vault)
            report.status = "PASS"
            report.status_extended = f"Vault {vault.name} has policy which does not allow access to everyone."

            public_access = False
            if vault.access_policy:
                for statement in vault.access_policy["Statement"]:
                    # Only check allow statements
                    if statement["Effect"] == "Allow":
                        if (
                            "*" in statement["Principal"]
                            or (
                                "AWS" in statement["Principal"]
                                and "*" in statement["Principal"]["AWS"]
                            )
                            or (
                                "CanonicalUser" in statement["Principal"]
                                and "*" in statement["Principal"]["CanonicalUser"]
                            )
                        ):
                            public_access = True
                            break
            else:
                report.status_extended = f"Vault {vault.name} does not have a policy."
            if public_access:
                report.status = "FAIL"
                report.status_extended = (
                    f"Vault {vault.name} has policy which allows access to everyone."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: glacier_vaults_policy_public_access_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/glacier/glacier_vaults_policy_public_access/glacier_vaults_policy_public_access_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.glacier.glacier_client import glacier_client


def fixer(resource_id: str, region: str) -> bool:
    """
    Modify the Glacier vault's policy to remove public access.
    Specifically, this fixer delete the vault policy that has public access.
    Requires the glacier:DeleteVaultAccessPolicy permission.
    Permissions:
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "glacier:DeleteVaultAccessPolicy",
                "Resource": "*"
            }
        ]
    }
    Args:
        resource_id (str): The Glacier vault name.
        region (str): AWS region where the Glacier vault exists.
    Returns:
        bool: True if the operation is successful (policy updated), False otherwise.
    """
    try:
        regional_client = glacier_client.regional_clients[region]

        regional_client.delete_vault_access_policy(vaultName=resource_id)

    except Exception as error:
        logger.error(
            f"{region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
        )
        return False
    else:
        return True
```

--------------------------------------------------------------------------------

---[FILE: globalaccelerator_client.py]---
Location: prowler-master/prowler/providers/aws/services/globalaccelerator/globalaccelerator_client.py

```python
from prowler.providers.aws.services.globalaccelerator.globalaccelerator_service import (
    GlobalAccelerator,
)
from prowler.providers.common.provider import Provider

globalaccelerator_client = GlobalAccelerator(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: globalaccelerator_service.py]---
Location: prowler-master/prowler/providers/aws/services/globalaccelerator/globalaccelerator_service.py
Signals: Pydantic

```python
from typing import Optional

from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class GlobalAccelerator(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.accelerators = {}
        if self.audited_partition == "aws":
            # Global Accelerator is a global service that supports endpoints in multiple AWS Regions
            # but you must specify the US West (Oregon) Region to create, update, or otherwise work with accelerators.
            # That is, for example, specify --region us-west-2 on AWS CLI commands.
            self.region = "us-west-2"
            self.client = self.session.client(self.service, self.region)
            self._list_accelerators()
            self.__threading_call__(self._list_tags, self.accelerators.values())

    def _list_accelerators(self):
        logger.info("GlobalAccelerator - Listing Accelerators...")
        try:
            list_accelerators_paginator = self.client.get_paginator("list_accelerators")
            for page in list_accelerators_paginator.paginate():
                for accelerator in page["Accelerators"]:
                    if not self.audit_resources or (
                        is_resource_filtered(
                            accelerator["AcceleratorArn"], self.audit_resources
                        )
                    ):
                        accelerator_arn = accelerator["AcceleratorArn"]
                        accelerator_name = accelerator["Name"]
                        enabled = accelerator["Enabled"]
                        # We must use the Accelerator ARN as the dict key to have unique keys
                        self.accelerators[accelerator_arn] = Accelerator(
                            name=accelerator_name,
                            arn=accelerator_arn,
                            region=self.region,
                            enabled=enabled,
                        )

        except Exception as error:
            logger.error(
                f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_tags(self, resource: any):
        try:
            resource.tags = (
                self.regional_clients[resource.region]
                .list_tags_for_resource(ResourceArn=resource.arn)
                .get("Tags", [])
            )

        except Exception as error:
            logger.error(
                f"{resource.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class Accelerator(BaseModel):
    arn: str
    name: str
    region: str
    enabled: bool
    tags: Optional[list]
```

--------------------------------------------------------------------------------

---[FILE: glue_client.py]---
Location: prowler-master/prowler/providers/aws/services/glue/glue_client.py

```python
from prowler.providers.aws.services.glue.glue_service import Glue
from prowler.providers.common.provider import Provider

glue_client = Glue(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: glue_service.py]---
Location: prowler-master/prowler/providers/aws/services/glue/glue_service.py
Signals: Pydantic

```python
import json
from typing import Dict, List, Optional

from botocore.exceptions import ClientError
from pydantic.v1 import BaseModel, Field

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class Glue(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.connections = []
        self.__threading_call__(self._get_connections)
        self.__threading_call__(self._list_tags, self.connections)
        self.tables = []
        self.__threading_call__(self._search_tables)
        self.data_catalogs = {}
        self.__threading_call__(self._get_data_catalogs)
        self.__threading_call__(self._get_resource_policy, self.data_catalogs.values())
        self.dev_endpoints = []
        self.__threading_call__(self._get_dev_endpoints)
        self.__threading_call__(self._list_tags, self.dev_endpoints)
        self.security_configs = []
        self.__threading_call__(self._get_security_configurations)
        self.jobs = []
        self.__threading_call__(self._get_jobs)
        self.__threading_call__(self._list_tags, self.jobs)
        self.ml_transforms = {}
        self.__threading_call__(self._get_ml_transforms)
        self.__threading_call__(self._list_tags, self.ml_transforms.values())

    def _get_data_catalog_arn_template(self, region):
        return f"arn:{self.audited_partition}:glue:{region}:{self.audited_account}:data-catalog"

    def _get_connections(self, regional_client):
        logger.info("Glue - Getting connections...")
        try:
            get_connections_paginator = regional_client.get_paginator("get_connections")
            for page in get_connections_paginator.paginate():
                for conn in page["ConnectionList"]:
                    arn = f"arn:{self.audited_partition}:glue:{regional_client.region}:{self.audited_account}:connection/{conn['Name']}"
                    if not self.audit_resources or (
                        is_resource_filtered(arn, self.audit_resources)
                    ):
                        self.connections.append(
                            Connection(
                                arn=arn,
                                name=conn.get("Name", ""),
                                type=conn.get("ConnectionType", ""),
                                properties=conn.get("ConnectionProperties", {}),
                                region=regional_client.region,
                            )
                        )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_dev_endpoints(self, regional_client):
        logger.info("Glue - Getting dev endpoints...")
        try:
            get_dev_endpoints_paginator = regional_client.get_paginator(
                "get_dev_endpoints"
            )
            for page in get_dev_endpoints_paginator.paginate():
                for endpoint in page["DevEndpoints"]:
                    arn = f"arn:{self.audited_partition}:glue:{regional_client.region}:{self.audited_account}:devEndpoint/{endpoint['EndpointName']}"
                    if not self.audit_resources or (
                        is_resource_filtered(arn, self.audit_resources)
                    ):
                        self.dev_endpoints.append(
                            DevEndpoint(
                                arn=arn,
                                name=endpoint["EndpointName"],
                                security=endpoint.get("SecurityConfiguration"),
                                region=regional_client.region,
                            )
                        )
        except ClientError as error:
            # Check if the operation is not supported in the region
            if error.response["Error"]["Message"].startswith(
                "Operation is not supported"
            ):
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

    def _get_jobs(self, regional_client):
        logger.info("Glue - Getting jobs...")
        try:
            get_jobs_paginator = regional_client.get_paginator("get_jobs")
            for page in get_jobs_paginator.paginate():
                for job in page["Jobs"]:
                    arn = f"arn:{self.audited_partition}:glue:{regional_client.region}:{self.audited_account}:job/{job['Name']}"
                    if not self.audit_resources or (
                        is_resource_filtered(arn, self.audit_resources)
                    ):
                        self.jobs.append(
                            Job(
                                name=job["Name"],
                                arn=arn,
                                security=job.get("SecurityConfiguration"),
                                arguments=job.get("DefaultArguments", {}),
                                region=regional_client.region,
                            )
                        )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_security_configurations(self, regional_client):
        logger.info("Glue - Getting security configs...")
        try:
            get_security_configurations_paginator = regional_client.get_paginator(
                "get_security_configurations"
            )
            for page in get_security_configurations_paginator.paginate():
                for config in page["SecurityConfigurations"]:
                    if not self.audit_resources or (
                        is_resource_filtered(config["Name"], self.audit_resources)
                    ):
                        self.security_configs.append(
                            SecurityConfig(
                                name=config["Name"],
                                s3_encryption=config["EncryptionConfiguration"][
                                    "S3Encryption"
                                ][0]["S3EncryptionMode"],
                                s3_key_arn=config["EncryptionConfiguration"][
                                    "S3Encryption"
                                ][0].get("KmsKeyArn"),
                                cw_encryption=config["EncryptionConfiguration"][
                                    "CloudWatchEncryption"
                                ]["CloudWatchEncryptionMode"],
                                cw_key_arn=config["EncryptionConfiguration"][
                                    "CloudWatchEncryption"
                                ].get("KmsKeyArn"),
                                jb_encryption=config["EncryptionConfiguration"][
                                    "JobBookmarksEncryption"
                                ]["JobBookmarksEncryptionMode"],
                                jb_key_arn=config["EncryptionConfiguration"][
                                    "JobBookmarksEncryption"
                                ].get("KmsKeyArn"),
                                region=regional_client.region,
                            )
                        )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _search_tables(self, regional_client):
        logger.info("Glue - Search Tables...")
        try:
            for table in regional_client.search_tables()["TableList"]:
                arn = f"arn:{self.audited_partition}:glue:{regional_client.region}:{self.audited_account}:table/{table['DatabaseName']}/{table['Name']}"
                if not self.audit_resources or (
                    is_resource_filtered(arn, self.audit_resources)
                ):
                    self.tables.append(
                        Table(
                            arn=arn,
                            name=table["Name"],
                            database=table["DatabaseName"],
                            catalog=table["CatalogId"],
                            region=regional_client.region,
                        )
                    )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_data_catalogs(self, regional_client):
        logger.info("Glue - Catalog ...")
        try:
            settings = regional_client.get_data_catalog_encryption_settings()[
                "DataCatalogEncryptionSettings"
            ]
            tables_in_region = False
            for table in self.tables:
                if table.region == regional_client.region:
                    tables_in_region = True
            catalog_encryption_settings = CatalogEncryptionSetting(
                mode=settings["EncryptionAtRest"]["CatalogEncryptionMode"],
                kms_id=settings["EncryptionAtRest"].get("SseAwsKmsKeyId"),
                password_encryption=settings["ConnectionPasswordEncryption"][
                    "ReturnConnectionPasswordEncrypted"
                ],
                password_kms_id=settings["ConnectionPasswordEncryption"].get(
                    "AwsKmsKeyId"
                ),
            )
            self.data_catalogs[regional_client.region] = DataCatalog(
                tables=tables_in_region,
                region=regional_client.region,
                encryption_settings=catalog_encryption_settings,
            )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_tags(self, resource: any):
        try:
            resource.tags = [
                self.regional_clients[resource.region].get_tags(
                    ResourceArn=resource.arn
                )["Tags"]
            ]
        except Exception as error:
            logger.error(
                f"{resource.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_ml_transforms(self, regional_client):
        logger.info("Glue - Getting ML Transforms...")
        try:
            transforms = regional_client.get_ml_transforms()["Transforms"]
            for transform in transforms:
                ml_transform_arn = f"arn:{self.audited_partition}:glue:{regional_client.region}:{self.audited_account}:mlTransform/{transform['TransformId']}"
                if not self.audit_resources or is_resource_filtered(
                    ml_transform_arn, self.audit_resources
                ):
                    self.ml_transforms[ml_transform_arn] = MLTransform(
                        arn=ml_transform_arn,
                        id=transform["TransformId"],
                        name=transform["Name"],
                        user_data_encryption=transform.get("TransformEncryption", {})
                        .get("MlUserDataEncryption", {})
                        .get("MlUserDataEncryptionMode", "DISABLED"),
                        region=regional_client.region,
                    )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_resource_policy(self, data_catalog):
        logger.info("Glue - Getting Resource Policy...")
        try:
            data_catalog_policy = self.regional_clients[
                data_catalog.region
            ].get_resource_policy()
            data_catalog.policy = json.loads(data_catalog_policy["PolicyInJson"])
        except ClientError as error:
            if error.response["Error"]["Code"] == "EntityNotFoundException":
                logger.warning(
                    f"{data_catalog.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
            else:
                logger.error(
                    f"{data_catalog.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        except Exception as error:
            logger.error(
                f"{data_catalog.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class Connection(BaseModel):
    name: str
    arn: str
    type: str
    properties: dict
    region: str
    tags: Optional[List[Dict[str, str]]] = Field(default_factory=list)


class Table(BaseModel):
    name: str
    arn: str
    database: str
    catalog: Optional[str]
    region: str
    tags: Optional[List[Dict[str, str]]] = Field(default_factory=list)


class CatalogEncryptionSetting(BaseModel):
    mode: str
    kms_id: Optional[str]
    password_encryption: bool
    password_kms_id: Optional[str]


class DevEndpoint(BaseModel):
    name: str
    arn: str
    security: Optional[str]
    region: str
    tags: Optional[List[Dict[str, str]]] = Field(default_factory=list)


class Job(BaseModel):
    arn: str
    name: str
    security: Optional[str]
    arguments: Optional[Dict[str, str]] = Field(default_factory=dict)
    region: str
    tags: Optional[List[Dict[str, str]]] = Field(default_factory=list)


class SecurityConfig(BaseModel):
    name: str
    s3_encryption: str
    s3_key_arn: Optional[str]
    cw_encryption: str
    cw_key_arn: Optional[str]
    jb_encryption: str
    jb_key_arn: Optional[str]
    region: str
    tags: Optional[List[Dict[str, str]]] = Field(default_factory=list)


class MLTransform(BaseModel):
    arn: str
    id: str
    name: str
    user_data_encryption: str
    region: str
    tags: Optional[List[Dict[str, str]]] = Field(default_factory=list)


class DataCatalog(BaseModel):
    tables: bool
    region: str
    encryption_settings: Optional[CatalogEncryptionSetting]
    policy: Optional[dict]
    tags: Optional[List[Dict[str, str]]] = Field(default_factory=list)
```

--------------------------------------------------------------------------------

---[FILE: glue_database_connections_ssl_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/glue/glue_database_connections_ssl_enabled/glue_database_connections_ssl_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "glue_database_connections_ssl_enabled",
  "CheckTitle": "Glue connection has SSL enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "glue",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Other",
  "Description": "**AWS Glue connections** require **TLS/SSL** for JDBC when the `JDBC_ENFORCE_SSL` property is set to `true`.\n\nThis evaluates connection definitions to confirm SSL is enforced for traffic to external data stores.",
  "Risk": "Absent TLS enforcement, JDBC traffic-including credentials, queries, and results-can be **intercepted or modified** in transit.\n\nThis enables:\n- Confidentiality loss via sniffing/MITM\n- Integrity tampering of queries/results\n- Credential theft leading to broader database access",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/glue/latest/dg/encryption-in-transit.html",
    "https://support.icompaas.com/support/solutions/articles/62000233690-ensure-glue-connections-have-ssl-enabled"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws glue update-connection --name <example_resource_name> --connection-input '{\"Name\":\"<example_resource_name>\",\"ConnectionType\":\"JDBC\",\"ConnectionProperties\":{\"JDBC_CONNECTION_URL\":\"<example_jdbc_url>\",\"JDBC_ENFORCE_SSL\":\"true\"}}'",
      "NativeIaC": "```yaml\n# CloudFormation: Enable SSL on a Glue JDBC connection\nResources:\n  <example_resource_name>:\n    Type: AWS::Glue::Connection\n    Properties:\n      ConnectionInput:\n        ConnectionType: JDBC\n        ConnectionProperties:\n          JDBC_CONNECTION_URL: \"<example_jdbc_url>\"\n          JDBC_ENFORCE_SSL: \"true\"  # Critical: forces SSL for the JDBC connection\n```",
      "Other": "1. Open the AWS Console and go to AWS Glue > Data Catalog > Connections\n2. Select the connection and click Edit\n3. In Connection properties (Advanced properties), add key JDBC_ENFORCE_SSL with value true (or check Require SSL)\n4. Click Save",
      "Terraform": "```hcl\n# Terraform: Enable SSL on a Glue JDBC connection\nresource \"aws_glue_connection\" \"<example_resource_name>\" {\n  name            = \"<example_resource_name>\"\n  connection_type = \"JDBC\"\n\n  connection_properties = {\n    JDBC_CONNECTION_URL = \"<example_jdbc_url>\"\n    JDBC_ENFORCE_SSL    = \"true\"  # Critical: forces SSL for the JDBC connection\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enforce **TLS** on all Glue connections (set `JDBC_ENFORCE_SSL=true`) and require encryption on target databases.\n\nApply **defense in depth**: validate certificates, restrict network exposure, prefer private connectivity, and use **least-privilege** credentials with rotation.",
      "Url": "https://hub.prowler.com/check/glue_database_connections_ssl_enabled"
    }
  },
  "Categories": [
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Data Protection"
}
```

--------------------------------------------------------------------------------

---[FILE: glue_database_connections_ssl_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/glue/glue_database_connections_ssl_enabled/glue_database_connections_ssl_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.glue.glue_client import glue_client


class glue_database_connections_ssl_enabled(Check):
    def execute(self):
        findings = []
        for conn in glue_client.connections:
            report = Check_Report_AWS(metadata=self.metadata(), resource=conn)
            report.status = "FAIL"
            report.status_extended = (
                f"Glue connection {conn.name} has SSL connection disabled."
            )
            if conn.properties.get("JDBC_ENFORCE_SSL") == "true":
                report.status = "PASS"
                report.status_extended = (
                    f"Glue connection {conn.name} has SSL connection enabled."
                )
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

````
