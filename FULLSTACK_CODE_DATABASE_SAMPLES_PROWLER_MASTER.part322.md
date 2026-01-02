---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 322
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 322 of 867)

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

---[FILE: storagegateway_service.py]---
Location: prowler-master/prowler/providers/aws/services/storagegateway/storagegateway_service.py
Signals: Pydantic

```python
from typing import Optional

from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class StorageGateway(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.fileshares = []
        self.gateways = []
        self.__threading_call__(self._list_file_shares)
        self.__threading_call__(self._describe_nfs_file_shares)
        self.__threading_call__(self._describe_smb_file_shares)
        self.__threading_call__(self._list_gateways)

    def _list_file_shares(self, regional_client):
        logger.info("StorageGateway - List FileShares...")
        try:
            list_file_share_paginator = regional_client.get_paginator(
                "list_file_shares"
            )
            for page in list_file_share_paginator.paginate():
                for fileshare in page["FileShareInfoList"]:
                    if not self.audit_resources or (
                        is_resource_filtered(
                            fileshare["FileShareARN"], self.audit_resources
                        )
                    ):
                        self.fileshares.append(
                            FileShare(
                                id=fileshare["FileShareId"],
                                arn=fileshare["FileShareARN"],
                                gateway_arn=fileshare["GatewayARN"],
                                region=regional_client.region,
                                fs_type=fileshare["FileShareType"],
                                status=fileshare["FileShareStatus"],
                            )
                        )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_nfs_file_shares(self, regional_client):
        logger.info("StorageGateway - Describe NFS FileShares...")
        try:
            for fileshare in self.fileshares:
                if (
                    fileshare.region == regional_client.region
                    and fileshare.fs_type == "NFS"
                ):
                    response = regional_client.describe_nfs_file_shares(
                        FileShareARNList=[fileshare.arn]
                    )
                    fileshare.tags = response["NFSFileShareInfoList"][0].get("Tags", [])
                    fileshare.kms = response["NFSFileShareInfoList"][0]["KMSEncrypted"]
                    fileshare.kms_key = response["NFSFileShareInfoList"][0].get(
                        "KMSKey", ""
                    )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_smb_file_shares(self, regional_client):
        logger.info("StorageGateway - Describe SMB FileShares...")
        try:
            for fileshare in self.fileshares:
                if (
                    fileshare.region == regional_client.region
                    and fileshare.fs_type == "SMB"
                ):
                    response = regional_client.describe_smb_file_shares(
                        FileShareARNList=[fileshare.arn]
                    )
                    fileshare.tags = response["SMBFileShareInfoList"][0].get("Tags", [])
                    fileshare.kms = response["SMBFileShareInfoList"][0]["KMSEncrypted"]
                    fileshare.kms_key = response["SMBFileShareInfoList"][0].get(
                        "KMSKey", ""
                    )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_gateways(self, regional_client):
        logger.info("StorageGateway - List Gateways...")
        try:
            list_gateway_paginator = regional_client.get_paginator("list_gateways")
            for page in list_gateway_paginator.paginate():
                for gateway in page["Gateways"]:
                    if not self.audit_resources or (
                        is_resource_filtered(
                            gateway["GatewayARN"], self.audit_resources
                        )
                    ):
                        self.gateways.append(
                            Gateway(
                                id=gateway["GatewayId"],
                                arn=gateway["GatewayARN"],
                                name=gateway["GatewayName"],
                                type=gateway["GatewayType"],
                                region=regional_client.region,
                                environment=gateway["HostEnvironment"],
                            )
                        )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class FileShare(BaseModel):
    id: str
    arn: str
    gateway_arn: str
    region: str
    fs_type: str
    status: str
    kms: Optional[bool]
    kms_key: Optional[str]
    tags: Optional[list] = []


class Gateway(BaseModel):
    id: str
    arn: str
    name: str
    type: str
    region: str
    environment: str
```

--------------------------------------------------------------------------------

---[FILE: storagegateway_fileshare_encryption_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/storagegateway/storagegateway_fileshare_encryption_enabled/storagegateway_fileshare_encryption_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "storagegateway_fileshare_encryption_enabled",
  "CheckTitle": "Check if AWS StorageGateway File Shares are encrypted with KMS CMK.",
  "CheckType": [
    "Security"
  ],
  "ServiceName": "storagegateway",
  "SubServiceName": "filegateway",
  "ResourceIdTemplate": "arn:aws:storagegateway:region:account-id:share",
  "Severity": "low",
  "ResourceType": "Other",
  "Description": "Ensure that Amazon Storage Gateway service is using AWS KMS Customer Master Keys (CMKs) instead of AWS managed-keys (i.e. default keys) for file share data encryption, in order to have a fine-grained control over data-at-rest encryption/decryption process and meet compliance requirements. An AWS Storage Gateway file share is a file system mount point backed by Amazon S3 cloud storage.",
  "Risk": "This could provide an avenue for unauthorized access to your data by not having fine-grained control over data-at-rest encryption/decryption process and meet compliance requirements.",
  "RelatedUrl": "https://docs.aws.amazon.com/filegateway/latest/files3/encrypt-objects-stored-by-file-gateway-in-amazon-s3.html",
  "Remediation": {
    "Code": {
      "CLI": "aws storagegateway update-nfs-file-share --region us-east-1 --file-share-arn arn:aws:storagegateway:us-east-1:123456789012:share/share-abcd1234 --kms-encrypted --kms-key arn:aws:kms:us-east-1:123456789012:key/abcdabcd-1234-1234-1234-abcdabcdabcd",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/aws/StorageGateway/file-shares-encrypted-with-cmk.html#",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure that Amazon Storage Gateway service is using AWS KMS Customer Master Keys (CMKs).",
      "Url": "https://docs.aws.amazon.com/filegateway/latest/files3/encrypt-objects-stored-by-file-gateway-in-amazon-s3.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: storagegateway_fileshare_encryption_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/storagegateway/storagegateway_fileshare_encryption_enabled/storagegateway_fileshare_encryption_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.storagegateway.storagegateway_client import (
    storagegateway_client,
)


class storagegateway_fileshare_encryption_enabled(Check):
    def execute(self):
        findings = []
        for fileshare in storagegateway_client.fileshares:
            report = Check_Report_AWS(metadata=self.metadata(), resource=fileshare)
            report.status = "FAIL"
            report.status_extended = (
                f"StorageGateway File Share {fileshare.id} is not using KMS CMK."
            )
            if fileshare.kms:
                report.status = "PASS"
                report.status_extended = (
                    f"StorageGateway File Share {fileshare.id} is using KMS CMK."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: storagegateway_gateway_fault_tolerant.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/storagegateway/storagegateway_gateway_fault_tolerant/storagegateway_gateway_fault_tolerant.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "storagegateway_gateway_fault_tolerant",
  "CheckTitle": "Check if AWS StorageGateway Gateways are hosted in a fault-tolerant environment.",
  "CheckType": [
    "Resilience"
  ],
  "ServiceName": "storagegateway",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:storagegateway:region:account-id:share",
  "Severity": "low",
  "ResourceType": "Other",
  "Description": "Storage Gateway, when hosted on an EC2 environment, runs on a single EC2 instance. This is a single-point of failure for any applications expecting highly available access to application storage.",
  "Risk": "Running Storage Gateway as a mechanism for providing file-based application storage that require high-availability increases the risk of application outages if any AZ outages occur.",
  "RelatedUrl": "https://docs.aws.amazon.com/filegateway/latest/files3/disaster-recovery-resiliency.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Migrating workloads to Amazon EFS, FSx, or other storage services can provide higher availability architectures if required.",
      "Url": "https://docs.aws.amazon.com/filegateway/latest/files3/resource-vm-setup.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: storagegateway_gateway_fault_tolerant.py]---
Location: prowler-master/prowler/providers/aws/services/storagegateway/storagegateway_gateway_fault_tolerant/storagegateway_gateway_fault_tolerant.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.storagegateway.storagegateway_client import (
    storagegateway_client,
)


class storagegateway_gateway_fault_tolerant(Check):
    def execute(self):
        findings = []
        for gateway in storagegateway_client.gateways:
            report = Check_Report_AWS(metadata=self.metadata(), resource=gateway)
            report.status = "FAIL"
            report.status_extended = f"StorageGateway Gateway {gateway.name} may not be fault tolerant as it is hosted on {gateway.environment}."
            if gateway.environment != "EC2":
                report.status = "PASS"
                report.status_extended = f"StorageGateway Gateway {gateway.name} may be fault tolerant as it is hosted on {gateway.environment}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: transfer_client.py]---
Location: prowler-master/prowler/providers/aws/services/transfer/transfer_client.py

```python
from prowler.providers.aws.services.transfer.transfer_service import Transfer
from prowler.providers.common.provider import Provider

transfer_client = Transfer(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: transfer_service.py]---
Location: prowler-master/prowler/providers/aws/services/transfer/transfer_service.py
Signals: Pydantic

```python
from enum import Enum
from typing import Dict, List

from pydantic.v1 import BaseModel, Field

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class Transfer(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.servers = {}
        self.__threading_call__(self._list_servers)
        self.__threading_call__(self._describe_server, self.servers.values())

    def _list_servers(self, regional_client):
        logger.info("Transfer - Listing Transfer Servers...")
        try:
            list_servers_paginator = regional_client.get_paginator("list_servers")
            for page in list_servers_paginator.paginate():
                for server in page["Servers"]:
                    arn = server["Arn"]
                    if not self.audit_resources or (
                        is_resource_filtered(arn, self.audit_resources)
                    ):
                        self.servers[arn] = Server(
                            arn=arn,
                            id=server.get("ServerId", ""),
                            region=regional_client.region,
                        )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_server(self, server):
        logger.info(f"Transfer - Describing Server {server.id}...")
        try:
            server_description = (
                self.regional_clients[server.region]
                .describe_server(ServerId=server.id)
                .get("Server", {})
            )
            for protocol in server_description.get("Protocols", []):
                server.protocols.append(Protocol(protocol))
            server.tags = server_description.get("Tags", [])
        except Exception as error:
            logger.error(
                f"{server.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class Protocol(Enum):
    FTP = "FTP"
    FTPS = "FTPS"
    SFTP = "SFTP"
    AS2 = "AS2"


class Server(BaseModel):
    arn: str
    id: str
    region: str
    protocols: List[Protocol] = Field(default_factory=list)
    tags: List[Dict[str, str]] = Field(default_factory=list)
```

--------------------------------------------------------------------------------

---[FILE: transfer_server_in_transit_encryption_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/transfer/transfer_server_in_transit_encryption_enabled/transfer_server_in_transit_encryption_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "transfer_server_in_transit_encryption_enabled",
  "CheckTitle": "Transfer Family Servers should have encryption in transit enabled.",
  "CheckType": [
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls"
  ],
  "ServiceName": "transfer",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:transfer:region:account-id:server/server-id",
  "Severity": "medium",
  "ResourceType": "AwsTransferServer",
  "Description": "Ensure that your Transfer Family servers have encryption in transit enabled.",
  "Risk": "Using FTP for endpoint connections leaves data in transit unencrypted, making it susceptible to interception by attackers. FTP lacks encryption, which exposes your data to person-in-the-middle and other interception risks. Adopting encrypted protocols such as SFTP, FTPS, or AS2 provides a layer of protection that helps secure sensitive data during transfer.",
  "RelatedUrl": "https://docs.aws.amazon.com/config/latest/developerguide/transfer-family-server-no-ftp.html",
  "Remediation": {
    "Code": {
      "CLI": "aws transfer update-server --server-id <server-id> --protocols SFTP FTPS AS2",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/transfer-controls.html#transfer-2",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Configure AWS Transfer Family servers to use secure protocols, such as SFTP, FTPS, or AS2, instead of FTP to protect data in transit. These protocols offer encryption, reducing exposure to interception and manipulation attacks.",
      "Url": "https://docs.aws.amazon.com/transfer/latest/userguide/edit-server-config.html#edit-protocols"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: transfer_server_in_transit_encryption_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/transfer/transfer_server_in_transit_encryption_enabled/transfer_server_in_transit_encryption_enabled.py

```python
from typing import List

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.transfer.transfer_client import transfer_client
from prowler.providers.aws.services.transfer.transfer_service import Protocol


class transfer_server_in_transit_encryption_enabled(Check):
    """Check if Transfer Servers have encryption in transit enabled.

    This class checks if Transfer Servers have encryption in transit enabled.
    """

    def execute(self) -> List[Check_Report_AWS]:
        """Execute the server in transit encyption check.

        Iterate over all Transfer Servers and check if they have FTP as one of the valid protocols.

        Returns:
            List[Check_Report_AWS]: A list of reports for each Transfer Server.
        """
        findings = []
        for server in transfer_client.servers.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=server)
            report.status = "PASS"
            report.status_extended = (
                f"Transfer Server {server.id} does have encryption in transit enabled."
            )

            if Protocol.FTP in server.protocols:
                report.status = "FAIL"
                report.status_extended = f"Transfer Server {server.id} does not have encryption in transit enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: trustedadvisor_client.py]---
Location: prowler-master/prowler/providers/aws/services/trustedadvisor/trustedadvisor_client.py

```python
from prowler.providers.aws.services.trustedadvisor.trustedadvisor_service import (
    TrustedAdvisor,
)
from prowler.providers.common.provider import Provider

trustedadvisor_client = TrustedAdvisor(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: trustedadvisor_service.py]---
Location: prowler-master/prowler/providers/aws/services/trustedadvisor/trustedadvisor_service.py
Signals: Pydantic

```python
from typing import Optional

from botocore.client import ClientError
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.aws.lib.service.service import AWSService


class TrustedAdvisor(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__("support", provider)
        self.account_arn_template = f"arn:{self.audited_partition}:trusted-advisor:{self.region}:{self.audited_account}:account"
        self.checks = []
        self.premium_support = PremiumSupport(enabled=False)
        # Support API is not available in China Partition
        # But only in us-east-1 or us-gov-west-1 https://docs.aws.amazon.com/general/latest/gr/awssupport.html
        if self.audited_partition != "aws-cn":
            if self.audited_partition == "aws":
                support_region = "us-east-1"
            else:
                support_region = "us-gov-west-1"
            self.client = self.session.client(self.service, region_name=support_region)
            self.client.region = support_region
            self._describe_services()
            if getattr(self.premium_support, "enabled", False):
                self._describe_trusted_advisor_checks()
                self._describe_trusted_advisor_check_result()

    def _describe_trusted_advisor_checks(self):
        logger.info("TrustedAdvisor - Describing Checks...")
        try:
            for check in self.client.describe_trusted_advisor_checks(language="en").get(
                "checks", []
            ):
                check_arn = f"arn:{self.audited_partition}:trusted-advisor:{self.client.region}:{self.audited_account}:check/{check['id']}"
                self.checks.append(
                    Check(
                        id=check["id"],
                        name=check["name"],
                        arn=check_arn,
                        region=self.client.region,
                    )
                )
        except ClientError as error:
            if (
                error.response["Error"]["Code"] == "SubscriptionRequiredException"
                and error.response["Error"]["Message"]
                == "Amazon Web Services Premium Support Subscription is required to use this service."
            ):
                logger.warning(
                    f"{self.client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
            else:
                logger.error(
                    f"{self.client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        except Exception as error:
            logger.error(
                f"{self.client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_trusted_advisor_check_result(self):
        logger.info("TrustedAdvisor - Describing Check Result...")
        try:
            for check in self.checks:
                if check.region == self.client.region:
                    try:
                        response = self.client.describe_trusted_advisor_check_result(
                            checkId=check.id
                        )
                        if "result" in response:
                            check.status = response["result"]["status"]
                    except ClientError as error:
                        if (
                            error.response["Error"]["Code"]
                            == "InvalidParameterValueException"
                        ):
                            logger.warning(
                                f"{self.client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                            )
        except Exception as error:
            logger.error(
                f"{self.client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_services(self):
        logger.info("Support - Describing Services...")
        try:
            self.client.describe_services()
            # If the above call succeeds the account has a Business,
            # Enterprise On-Ramp, or Enterprise Support plan.
            self.premium_support.enabled = True

        except ClientError as error:
            if (
                error.response["Error"]["Code"] == "SubscriptionRequiredException"
                and error.response["Error"]["Message"]
                == "Amazon Web Services Premium Support Subscription is required to use this service."
            ):
                logger.warning(
                    f"{self.region} --"
                    f" {error.__class__.__name__}[{error.__traceback__.tb_lineno}]:"
                    f" {error}"
                )
            elif error.response["Error"]["Code"] == "AccessDeniedException":
                logger.error(
                    f"{self.region} --"
                    f" {error.__class__.__name__}[{error.__traceback__.tb_lineno}]:"
                    f" {error}"
                )
                self.premium_support = None
            else:
                logger.error(
                    f"{self.region} --"
                    f" {error.__class__.__name__}[{error.__traceback__.tb_lineno}]:"
                    f" {error}"
                )

        except Exception as error:
            logger.error(
                f"{self.region} --"
                f" {error.__class__.__name__}[{error.__traceback__.tb_lineno}]:"
                f" {error}"
            )


class Check(BaseModel):
    id: str
    name: str
    arn: str
    status: Optional[str]
    region: str


class PremiumSupport(BaseModel):
    enabled: bool
```

--------------------------------------------------------------------------------

---[FILE: trustedadvisor_errors_and_warnings.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/trustedadvisor/trustedadvisor_errors_and_warnings/trustedadvisor_errors_and_warnings.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "trustedadvisor_errors_and_warnings",
  "CheckTitle": "Trusted Advisor check has no errors or warnings",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "trustedadvisor",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**AWS Trusted Advisor** check statuses are assessed to identify items in `warning` or `error`. The finding reflects the state reported by Trusted Advisor across categories such as **Security**, **Fault Tolerance**, **Service Limits**, and **Cost**, indicating where configurations or quotas require attention.",
  "Risk": "Unaddressed **warnings/errors** can leave misconfigurations that impact CIA:\n- **Confidentiality**: public access or weak auth exposes data\n- **Integrity**: overly permissive settings allow unwanted changes\n- **Availability**: limit exhaustion or poor resilience triggers outages\nThey can also increase unnecessary cost.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://aws.amazon.com/premiumsupport/technology/trusted-advisor/best-practice-checklist/",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/TrustedAdvisor/checks.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. Sign in to the AWS Console and open Trusted Advisor\n2. Go to Checks and filter Status to Warning and Error\n3. Open each failing check and click View details/Recommended actions\n4. Apply the listed fix to the affected resources\n5. Click Refresh on the check and repeat until all checks show OK",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Adopt a continuous process to remediate Trusted Advisor findings:\n- Prioritize **`error`** then `warning`\n- Assign ownership and SLAs\n- Integrate alerts with workflows\n- Enforce **least privilege**, segmentation, encryption, MFA, and tested backups\n- Reassess regularly to confirm fixes and prevent regression",
      "Url": "https://hub.prowler.com/check/trustedadvisor_errors_and_warnings"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: trustedadvisor_errors_and_warnings.py]---
Location: prowler-master/prowler/providers/aws/services/trustedadvisor/trustedadvisor_errors_and_warnings/trustedadvisor_errors_and_warnings.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.trustedadvisor.trustedadvisor_client import (
    trustedadvisor_client,
)


class trustedadvisor_errors_and_warnings(Check):
    def execute(self):
        findings = []
        if trustedadvisor_client.premium_support:
            if trustedadvisor_client.premium_support.enabled:
                if trustedadvisor_client.checks:
                    for check in trustedadvisor_client.checks:
                        if (
                            check.status != "not_available"
                        ):  # avoid not_available checks since there are no resources that apply
                            report = Check_Report_AWS(
                                metadata=self.metadata(), resource=check
                            )
                            report.status = "FAIL"
                            report.status_extended = f"Trusted Advisor check {check.name} is in state {check.status}."
                            if check.status == "ok":
                                report.status = "PASS"
                            findings.append(report)
            else:
                report = Check_Report_AWS(
                    metadata=self.metadata(),
                    resource={},
                )
                report.status = "MANUAL"
                report.status_extended = "Amazon Web Services Premium Support Subscription is required to use this service."
                report.resource_id = trustedadvisor_client.audited_account
                report.resource_arn = trustedadvisor_client.account_arn_template
                report.region = trustedadvisor_client.region
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: trustedadvisor_premium_support_plan_subscribed.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/trustedadvisor/trustedadvisor_premium_support_plan_subscribed/trustedadvisor_premium_support_plan_subscribed.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "trustedadvisor_premium_support_plan_subscribed",
  "CheckTitle": "AWS account is subscribed to an AWS Premium Support plan",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "trustedadvisor",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "Other",
  "Description": "**AWS account** is subscribed to an **AWS Premium Support plan** (e.g., Business or Enterprise)",
  "Risk": "Without **Premium Support**, critical incidents face slower response, reducing **availability** and delaying containment of security events. Limited Trusted Advisor coverage lets **misconfigurations** persist, risking **data exposure** and **privilege misuse**. Lack of expert guidance increases change risk during production impacts.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/aws/Support/support-plan.html",
    "https://aws.amazon.com/premiumsupport/plans/"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. Sign in to the AWS Management Console as the account root user\n2. Open https://console.aws.amazon.com/support/home#/plans\n3. Click \"Change plan\"\n4. Select \"Business Support\" (or higher) and click \"Continue\"\n5. Review and confirm the upgrade",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Adopt **Business** or higher for production and mission-critical accounts.\n- Integrate Support into IR with defined contacts/severity\n- Enforce **least privilege** for case access\n- Use Trusted Advisor for proactive hardening\n- If opting out, ensure an equivalent 24/7 support and escalation path",
      "Url": "https://hub.prowler.com/check/trustedadvisor_premium_support_plan_subscribed"
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

---[FILE: trustedadvisor_premium_support_plan_subscribed.py]---
Location: prowler-master/prowler/providers/aws/services/trustedadvisor/trustedadvisor_premium_support_plan_subscribed/trustedadvisor_premium_support_plan_subscribed.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.trustedadvisor.trustedadvisor_client import (
    trustedadvisor_client,
)


class trustedadvisor_premium_support_plan_subscribed(Check):
    def execute(self):
        findings = []
        if (
            trustedadvisor_client.premium_support
            and trustedadvisor_client.audit_config.get(
                "verify_premium_support_plans", True
            )
        ):
            report = Check_Report_AWS(
                metadata=self.metadata(),
                resource=trustedadvisor_client.premium_support,
            )
            report.status = "FAIL"
            report.status_extended = (
                "Amazon Web Services Premium Support Plan isn't subscribed."
            )
            report.region = trustedadvisor_client.region
            report.resource_id = trustedadvisor_client.audited_account
            report.resource_arn = trustedadvisor_client.account_arn_template
            if trustedadvisor_client.premium_support.enabled:
                report.status = "PASS"
                report.status_extended = (
                    "Amazon Web Services Premium Support Plan is subscribed."
                )
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: vpc_client.py]---
Location: prowler-master/prowler/providers/aws/services/vpc/vpc_client.py

```python
from prowler.providers.aws.services.vpc.vpc_service import VPC
from prowler.providers.common.provider import Provider

vpc_client = VPC(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

````
