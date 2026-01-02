---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 235
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 235 of 867)

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

---[FILE: service.py]---
Location: prowler-master/prowler/providers/aws/lib/service/service.py

```python
from concurrent.futures import ThreadPoolExecutor, as_completed

from prowler.lib.logger import logger
from prowler.providers.aws.aws_provider import AwsProvider

# TODO: review the following code
# from prowler.providers.aws.aws_provider import (
#     generate_regional_clients,
#     get_default_region,
# )

MAX_WORKERS = 10


class AWSService:
    """The AWSService class offers a parent class for each AWS Service to generate:
    - AWS Regional Clients
    - Shared information like the account ID and ARN, the AWS partition and the checks audited
    - AWS Session
    - Thread pool for the __threading_call__
    - Also handles if the AWS Service is Global
    """

    failed_checks = set()

    @classmethod
    def set_failed_check(cls, check_id=None, arn=None):
        if check_id is not None and arn is not None:
            cls.failed_checks.add((check_id.split(".")[-1], arn))

    @classmethod
    def is_failed_check(cls, check_id, arn):
        return (check_id.split(".")[-1], arn) in cls.failed_checks

    def __init__(self, service: str, provider: AwsProvider, global_service=False):
        # Audit Information
        # Do we need to store the whole provider?
        self.provider = provider
        self.audited_account = provider.identity.account
        self.audited_account_arn = provider.identity.account_arn
        self.audited_partition = provider.identity.partition
        self.audit_resources = provider.audit_resources
        # TODO: remove this
        self.audited_checks = provider.audit_metadata.expected_checks
        self.audit_config = provider.audit_config
        self.fixer_config = provider.fixer_config

        # AWS Session
        self.session = provider.session.current_session

        # We receive the service using __class__.__name__ or the service name in lowercase
        # e.g.: AccessAnalyzer --> we need a lowercase string, so service.lower()
        self.service = service.lower() if not service.islower() else service

        # Generate Regional Clients
        if not global_service:
            self.regional_clients = provider.generate_regional_clients(self.service)
            # TODO: review the following code
            # self.regional_clients = generate_regional_clients(self.service, audit_info)

        # Get a single region and client if the service needs it (e.g. AWS Global Service)
        # We cannot include this within an else because some services needs both the regional_clients
        # and a single client like S3
        self.region = provider.get_default_region(self.service)
        self.client = self.session.client(self.service, self.region)

        # Thread pool for __threading_call__
        self.thread_pool = ThreadPoolExecutor(max_workers=MAX_WORKERS)

    def __get_session__(self):
        return self.session

    def __threading_call__(self, call, iterator=None):
        # Use the provided iterator, or default to self.regional_clients
        items = iterator if iterator is not None else self.regional_clients.values()
        # Determine the total count for logging
        item_count = len(items)

        # Trim leading and trailing underscores from the call's name
        call_name = call.__name__.strip("_")
        # Add Capitalization
        call_name = " ".join([x.capitalize() for x in call_name.split("_")])

        # Print a message based on the call's name, and if its regional or processing a list of items
        if iterator is None:
            logger.info(
                f"{self.service.upper()} - Starting threads for '{call_name}' function across {item_count} regions..."
            )
        else:
            logger.info(
                f"{self.service.upper()} - Starting threads for '{call_name}' function to process {item_count} items..."
            )

        # Submit tasks to the thread pool
        futures = [self.thread_pool.submit(call, item) for item in items]

        # Wait for all tasks to complete
        for future in as_completed(futures):
            try:
                future.result()  # Raises exceptions from the thread, if any
            except Exception:
                # Handle exceptions if necessary
                pass  # Replace 'pass' with any additional exception handling logic. Currently handled within the called function

    def get_unknown_arn(self, resource_type: str = None, region: str = None) -> str:
        """
        Generate an unknown ARN for the service
        Args:
            region (str): The region to get the unknown ARN for.
            resource_type (str): The resource type to get the unknown ARN for
        Returns:
            str: The unknown ARN for the region.
        Examples:
            >>> service.get_unknown_arn(resource_type="bucket", region="us-east-1")
            arn:aws:s3:us-east-1:123456789012:bucket/unknown
        """
        return f"arn:{self.audited_partition}:{self.service}:{f'{region}' if region else ''}:{self.audited_account}:{f'{resource_type}/' if resource_type else ''}unknown"
```

--------------------------------------------------------------------------------

---[FILE: aws_set_up_session.py]---
Location: prowler-master/prowler/providers/aws/lib/session/aws_set_up_session.py

```python
from typing import Optional

from prowler.lib.logger import logger
from prowler.providers.aws.aws_provider import (
    AwsProvider,
    get_aws_region_for_sts,
    parse_iam_credentials_arn,
)
from prowler.providers.aws.config import ROLE_SESSION_NAME
from prowler.providers.aws.models import (
    AWSAssumeRoleConfiguration,
    AWSAssumeRoleInfo,
    AWSIdentityInfo,
    AWSSession,
)


class AwsSetUpSession:
    """
    A class to set up the AWS session.

    Attributes:
    - _session: An instance of the AWSSession class.

    Methods:
    - __init__: The constructor for the AwsSetUpSession class.
    """

    _session: AWSSession
    _identity: AWSIdentityInfo

    def __init__(
        self,
        role_arn: str = None,
        session_duration: int = 3600,
        external_id: str = None,
        role_session_name: str = ROLE_SESSION_NAME,
        mfa: bool = None,
        profile: str = None,
        aws_access_key_id: str = None,
        aws_secret_access_key: str = None,
        aws_session_token: Optional[str] = None,
        retries_max_attempts: int = 3,
        regions: set = set(),
    ) -> None:
        """
        The constructor for the AwsSetUpSession class.

        Parameters:
        - role_arn: The ARN of the IAM role to assume.
        - session_duration: The duration of the session in seconds, between 900 and 43200.
        - external_id: The external ID to use when assuming the IAM role.
        - role_session_name: The name of the session when assuming the IAM role.
        - mfa: A boolean indicating whether MFA is enabled.
        - profile: The name of the AWS CLI profile to use.
        - aws_access_key_id: The AWS access key ID.
        - aws_secret_access_key: The AWS secret access key.
        - aws_session_token: The AWS session token, optional.
        - retries_max_attempts: The maximum number of retries for the AWS client.
        - regions: A set of regions to audit.

        Returns:

        An instance of the AwsSetUpSession class.
        """

        validate_arguments(
            role_arn=role_arn,
            session_duration=session_duration,
            external_id=external_id,
            role_session_name=role_session_name,
            profile=profile,
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key,
        )
        # Setup the AWS session
        aws_session = AwsProvider.setup_session(
            mfa=mfa,
            profile=profile,
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key,
            aws_session_token=aws_session_token,
        )
        session_config = AwsProvider.set_session_config(retries_max_attempts)
        self._session = AWSSession(
            current_session=aws_session,
            session_config=session_config,
            original_session=aws_session,
        )

        ######## Validate AWS credentials
        # After the session is created, validate it
        logger.info("Validating credentials ...")
        sts_region = get_aws_region_for_sts(
            self._session.current_session.region_name, regions
        )

        # Validate the credentials
        caller_identity = AwsProvider.validate_credentials(
            session=self._session.current_session,
            aws_region=sts_region,
        )

        logger.info("Credentials validated")
        ########

        ######## AWS Provider Identity
        # Get profile region
        profile_region = AwsProvider.get_profile_region(self._session.current_session)

        # Set identity
        self._identity = AwsProvider.set_identity(
            caller_identity=caller_identity,
            profile=profile,
            regions=regions,
            profile_region=profile_region,
        )
        ########

        ######## AWS Session with Assume Role (if needed)
        if role_arn:
            # Validate the input role
            valid_role_arn = parse_iam_credentials_arn(role_arn)
            # Set assume IAM Role information
            assumed_role_information = AWSAssumeRoleInfo(
                role_arn=valid_role_arn,
                session_duration=session_duration,
                external_id=external_id,
                mfa_enabled=mfa,
                role_session_name=role_session_name,
                sts_region=sts_region,
            )
            # Assume the IAM Role
            logger.info(f"Assuming role: {assumed_role_information.role_arn.arn}")
            assumed_role_credentials = AwsProvider.assume_role(
                self._session.current_session,
                assumed_role_information,
            )
            logger.info(f"IAM Role assumed: {assumed_role_information.role_arn.arn}")

            assumed_role_configuration = AWSAssumeRoleConfiguration(
                info=assumed_role_information, credentials=assumed_role_credentials
            )
            # Store the assumed role configuration since it'll be needed to refresh the credentials
            self._assumed_role_configuration = assumed_role_configuration

            # Store a new current session using the assumed IAM Role
            self._session.current_session = AwsProvider.setup_assumed_session(
                self._identity,
                self._assumed_role_configuration,
                self._session,
            )
            logger.info("Audit session is the new session created assuming an IAM Role")

            # Modify identity for the IAM Role assumed since this will be the identity to audit with
            logger.info("Setting new identity for the AWS IAM Role assumed")
            self._identity.account = assumed_role_configuration.info.role_arn.account_id
            self._identity.partition = (
                assumed_role_configuration.info.role_arn.partition
            )
            self._identity.account_arn = f"arn:{assumed_role_configuration.info.role_arn.partition}:iam::{assumed_role_configuration.info.role_arn.account_id}:root"
        ########


def validate_arguments(
    role_arn: str = None,
    session_duration: int = None,
    external_id: str = None,
    role_session_name: str = None,
    profile: str = None,
    aws_access_key_id: str = None,
    aws_secret_access_key: str = None,
) -> None:
    """
    Validate the arguments provided to the S3 class."

    Parameters:
    - role_arn: The ARN of the IAM role to assume.
    - session_duration: The duration of the session in seconds, between 900 and 43200.
    - external_id: The external ID to use when assuming the IAM role.
    - role_session_name: The name of the session when assuming the IAM role.
    - mfa: A boolean indicating whether MFA is enabled.
    - profile: The name of the AWS CLI profile to use.
    - aws_access_key_id: The AWS access key ID.
    - aws_secret_access_key: The AWS secret access key.
    - aws_session_token: The AWS session token, optional.
    - retries_max_attempts: The maximum number of retries for the AWS client.
    - regions: A set of regions to audit.
    """

    if role_arn:
        if not session_duration or not external_id or not role_session_name:
            raise ValueError(
                "If a role ARN is provided, a session duration, an external ID, and a role session name are required."
            )
    else:
        if external_id:
            raise ValueError("If an external ID is provided, a role ARN is required.")
        if not profile and not aws_access_key_id and not aws_secret_access_key:
            raise ValueError(
                "If no role ARN is provided, a profile, an AWS access key ID, or an AWS secret access key is required."
            )
```

--------------------------------------------------------------------------------

---[FILE: accessanalyzer_client.py]---
Location: prowler-master/prowler/providers/aws/services/accessanalyzer/accessanalyzer_client.py

```python
from prowler.providers.aws.services.accessanalyzer.accessanalyzer_service import (
    AccessAnalyzer,
)
from prowler.providers.common.provider import Provider

accessanalyzer_client = AccessAnalyzer(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: accessanalyzer_service.py]---
Location: prowler-master/prowler/providers/aws/services/accessanalyzer/accessanalyzer_service.py
Signals: Pydantic

```python
from typing import Optional

from botocore.exceptions import ClientError
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class AccessAnalyzer(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.analyzers = []
        self.__threading_call__(self._list_analyzers)
        self._list_findings()
        self._get_finding_status()

    def _list_analyzers(self, regional_client):
        logger.info("AccessAnalyzer - Listing Analyzers...")
        try:
            list_analyzers_paginator = regional_client.get_paginator("list_analyzers")
            analyzer_count = 0
            for page in list_analyzers_paginator.paginate():
                for analyzer in page["analyzers"]:
                    if not self.audit_resources or (
                        is_resource_filtered(analyzer["arn"], self.audit_resources)
                    ):
                        analyzer_count += 1
                        self.analyzers.append(
                            Analyzer(
                                arn=analyzer["arn"],
                                name=analyzer["name"],
                                status=analyzer["status"],
                                tags=[analyzer.get("tags")],
                                type=analyzer["type"],
                                region=regional_client.region,
                            )
                        )
            # No analyzers in region
            if analyzer_count == 0:
                self.analyzers.append(
                    Analyzer(
                        arn=self.get_unknown_arn(
                            region=regional_client.region, resource_type="analyzer"
                        ),
                        name="analyzer/unknown",
                        status="NOT_AVAILABLE",
                        tags=[],
                        type="",
                        region=regional_client.region,
                    )
                )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_finding_status(self):
        logger.info("AccessAnalyzer - Get Finding status...")
        try:
            for analyzer in self.analyzers:
                if analyzer.status == "ACTIVE":
                    regional_client = self.regional_clients[analyzer.region]
                    for finding in analyzer.findings:
                        try:
                            finding_information = regional_client.get_finding(
                                analyzerArn=analyzer.arn, id=finding.id
                            )
                            finding.status = finding_information["finding"]["status"]
                        except ClientError as error:
                            if (
                                error.response["Error"]["Code"]
                                == "ResourceNotFoundException"
                            ):
                                logger.warning(
                                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                                )
                                finding.status = ""
                            continue

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    # TODO: We need to include ListFindingsV2
    # https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/accessanalyzer/client/list_findings_v2.html
    def _list_findings(self):
        logger.info("AccessAnalyzer - Listing Findings per Analyzer...")
        try:
            for analyzer in self.analyzers:
                try:
                    if analyzer.status == "ACTIVE":
                        regional_client = self.regional_clients[analyzer.region]
                        list_findings_paginator = regional_client.get_paginator(
                            "list_findings"
                        )
                        for page in list_findings_paginator.paginate(
                            analyzerArn=analyzer.arn
                        ):
                            for finding in page["findings"]:
                                analyzer.findings.append(Finding(id=finding["id"]))
                except ClientError as error:
                    if error.response["Error"]["Code"] == "ValidationException":
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
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class Finding(BaseModel):
    id: str
    status: str = ""


class Analyzer(BaseModel):
    arn: str
    name: str
    status: str
    findings: list[Finding] = []
    tags: Optional[list] = []
    type: str
    region: str
```

--------------------------------------------------------------------------------

---[FILE: accessanalyzer_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/accessanalyzer/accessanalyzer_enabled/accessanalyzer_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "accessanalyzer_enabled",
  "CheckTitle": "IAM Access Analyzer is enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "accessanalyzer",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "Other",
  "Description": "**IAM Access Analyzer** presence and status are evaluated per account and Region. An analyzer in `ACTIVE` state indicates continuous analysis of supported resources and IAM activity to identify external, internal, and unused access.",
  "Risk": "Without an active analyzer, visibility into unintended public, cross-account, or risky internal access is lost. Adversaries can exploit exposed S3, snapshots, KMS keys, or permissive role trusts for data exfiltration and escalation. Unused permissions persist, enlarging the attack surface. This degrades confidentiality and integrity.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/IAM/latest/UserGuide/access-analyzer-manage-external.html",
    "https://aws.amazon.com/iam/access-analyzer/",
    "https://docs.aws.amazon.com/IAM/latest/UserGuide/access-analyzer-getting-started.html",
    "https://docs.aws.amazon.com/access-analyzer/latest/APIReference/API_CreateAnalyzer.html",
    "https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html",
    "https://docs.aws.amazon.com/IAM/latest/UserGuide/access-analyzer-create-external.html",
    "https://docs.aws.amazon.com/access-analyzer/latest/APIReference/Welcome.html",
    "https://docs.aws.amazon.com/IAM/latest/UserGuide/access-analyzer-create-internal.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws accessanalyzer create-analyzer --analyzer-name example_resource --type ACCOUNT",
      "NativeIaC": "```yaml\nResources:\n  example_resource:\n    Type: AWS::AccessAnalyzer::Analyzer  # This resource enables IAM Access Analyzer\n    Properties:\n      AnalyzerName: example_resource\n      Type: ACCOUNT  # This line fixes the security issue\n```",
      "Other": "1. In the AWS Console, open IAM\n2. Go to Access analyzer > Analyzer settings\n3. Confirm the desired Region\n4. Click Create analyzer\n5. Select Resource analysis - External access\n6. Set Name to \"example_resource\" and Zone of trust to \"Current account\"\n7. Click Create",
      "Terraform": "```hcl\nresource \"aws_accessanalyzer_analyzer\" \"example_resource\" {\n  analyzer_name = \"example_resource\"\n  type          = \"ACCOUNT\" # This line fixes the security issue\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **IAM Access Analyzer** across all accounts and active Regions (*or organization-wide*). Operate on least privilege: continuously review findings, remove unintended access, and trim unused permissions. Use archive rules sparingly, integrate reviews into change/CI/CD workflows, and enforce separation of duties on policy changes.",
      "Url": "https://hub.prowler.com/check/accessanalyzer_enabled"
    }
  },
  "Categories": [
    "identity-access",
    "trust-boundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: accessanalyzer_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/accessanalyzer/accessanalyzer_enabled/accessanalyzer_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.accessanalyzer.accessanalyzer_client import (
    accessanalyzer_client,
)


class accessanalyzer_enabled(Check):
    def execute(self):
        findings = []
        for analyzer in accessanalyzer_client.analyzers:
            report = Check_Report_AWS(metadata=self.metadata(), resource=analyzer)
            if analyzer.status == "ACTIVE":
                report.status = "PASS"
                report.status_extended = (
                    f"IAM Access Analyzer {analyzer.name} is enabled."
                )

            else:
                if analyzer.status == "NOT_AVAILABLE":
                    report.status = "FAIL"
                    report.status_extended = f"IAM Access Analyzer in account {accessanalyzer_client.audited_account} is not enabled."

                else:
                    report.status = "FAIL"
                    report.status_extended = (
                        f"IAM Access Analyzer {analyzer.name} is not active."
                    )
                if (
                    accessanalyzer_client.audit_config.get(
                        "mute_non_default_regions", False
                    )
                    and not analyzer.region == accessanalyzer_client.region
                ):
                    report.muted = True

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: accessanalyzer_enabled_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/accessanalyzer/accessanalyzer_enabled/accessanalyzer_enabled_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.accessanalyzer.accessanalyzer_client import (
    accessanalyzer_client,
)


def fixer(region):
    """
    Enable Access Analyzer in a region. Requires the access-analyzer:CreateAnalyzer permission.
    Permissions:
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "access-analyzer:CreateAnalyzer",
                "Resource": "*"
            }
        ]
    }
    Args:
        region (str): AWS region
    Returns:
        bool: True if Access Analyzer is enabled, False otherwise
    """
    try:
        regional_client = accessanalyzer_client.regional_clients[region]
        regional_client.create_analyzer(
            analyzerName=accessanalyzer_client.fixer_config.get(
                "accessanalyzer_enabled", {}
            ).get("AnalyzerName", "DefaultAnalyzer"),
            type=accessanalyzer_client.fixer_config.get(
                "accessanalyzer_enabled", {}
            ).get("AnalyzerType", "ACCOUNT_UNUSED_ACCESS"),
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

---[FILE: accessanalyzer_enabled_without_findings.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/accessanalyzer/accessanalyzer_enabled_without_findings/accessanalyzer_enabled_without_findings.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "accessanalyzer_enabled_without_findings",
  "CheckTitle": "IAM Access Analyzer analyzer is active and has no active findings",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "TTPs/Initial Access/Unauthorized Access",
    "Effects/Data Exposure"
  ],
  "ServiceName": "accessanalyzer",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "Other",
  "Description": "**IAM Access Analyzer** analyzers are in `Active` state and currently report zero `Active` findings within their scope of monitored resources.",
  "Risk": "Unresolved `Active` findings indicate unintended external or internal access paths.\n- **Confidentiality**: public/cross-account reads of data (buckets, snapshots, secrets)\n- **Integrity**: rogue role assumption or KMS use enabling policy/data changes\n- **Lateral movement** across accounts",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/IAM/latest/UserGuide/access-analyzer-findings-remediate.html",
    "https://docs.aws.amazon.com/IAM/latest/UserGuide/access-analyzer-findings-view.html",
    "https://aws.amazon.com/iam/access-analyzer/",
    "https://docs.aws.amazon.com/IAM/latest/UserGuide/access-analyzer-getting-started.html",
    "https://docs.aws.amazon.com/IAM/latest/UserGuide/access-analyzer-concepts.html",
    "https://docs.aws.amazon.com/IAM/latest/UserGuide/access-analyzer-dashboard.html",
    "https://docs.aws.amazon.com/IAM/latest/UserGuide/access-analyzer-findings.html",
    "https://aws.amazon.com/blogs/security/automate-resolution-for-iam-access-analyzer-cross-account-access-findings-on-iam-roles/",
    "https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/AccessAnalyzer/findings.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\nResources:\n  example_resource:\n    Type: AWS::AccessAnalyzer::Analyzer\n    Properties:\n      AnalyzerName: example_resource\n      Type: ACCOUNT  # This line fixes the security issue\n```",
      "Other": "1. In the AWS Console, go to IAM > Access analyzer\n2. If no analyzer exists, click Create analyzer, select Type: Account, name it example_resource, and click Create\n3. To clear active findings: under Resource analysis, select your analyzer, select all Active findings, choose Actions > Archive\n4. For unintended access findings, open the finding and follow the linked resource to remove the offending permission (edit the resource policy or role trust policy), then return to the finding and choose Rescan\n5. Confirm the dashboard shows 0 Active findings",
      "Terraform": "```hcl\nresource \"aws_accessanalyzer_analyzer\" \"example_resource\" {\n  analyzer_name = \"example_resource\"\n  type          = \"ACCOUNT\" # This line fixes the security issue\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **IAM Access Analyzer** in all relevant Regions and org/account scopes. Triage every `Active` finding:\n- Remove unintended access by tightening resource and trust policies\n- Enforce **least privilege** and separation of duties\n- Archive only validated, intended access\n- Continuously monitor and automate reviews",
      "Url": "https://hub.prowler.com/check/accessanalyzer_enabled_without_findings"
    }
  },
  "Categories": [
    "identity-access",
    "trust-boundaries",
    "internet-exposed"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: accessanalyzer_enabled_without_findings.py]---
Location: prowler-master/prowler/providers/aws/services/accessanalyzer/accessanalyzer_enabled_without_findings/accessanalyzer_enabled_without_findings.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.accessanalyzer.accessanalyzer_client import (
    accessanalyzer_client,
)


class accessanalyzer_enabled_without_findings(Check):
    def execute(self):
        findings = []
        for analyzer in accessanalyzer_client.analyzers:
            report = Check_Report_AWS(metadata=self.metadata(), resource=analyzer)
            if analyzer.status == "ACTIVE":
                report.status = "PASS"
                report.status_extended = f"IAM Access Analyzer {analyzer.name} does not have active findings."

                if len(analyzer.findings) != 0:
                    active_finding_counter = 0
                    for finding in analyzer.findings:
                        if finding.status == "ACTIVE":
                            active_finding_counter += 1

                    if active_finding_counter > 0:
                        report.status = "FAIL"
                        report.status_extended = f"IAM Access Analyzer {analyzer.name} has {active_finding_counter} active findings."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: account_client.py]---
Location: prowler-master/prowler/providers/aws/services/account/account_client.py

```python
from prowler.providers.aws.services.account.account_service import Account
from prowler.providers.common.provider import Provider

account_client = Account(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: account_service.py]---
Location: prowler-master/prowler/providers/aws/services/account/account_service.py
Signals: Pydantic

```python
from typing import Optional

from botocore.client import ClientError
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.aws.lib.service.service import AWSService


class Account(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.number_of_contacts = 4
        self.contact_base = self._get_contact_information()
        self.contacts_billing = self._get_alternate_contact("BILLING")
        self.contacts_security = self._get_alternate_contact("SECURITY")
        self.contacts_operations = self._get_alternate_contact("OPERATIONS")

        if self.contact_base:
            # Set of contact phone numbers
            self.contact_phone_numbers = {
                self.contact_base.phone_number,
                self.contacts_billing.phone_number,
                self.contacts_security.phone_number,
                self.contacts_operations.phone_number,
            }

            # Set of contact names
            self.contact_names = {
                self.contact_base.name,
                self.contacts_billing.name,
                self.contacts_security.name,
                self.contacts_operations.name,
            }

            # Set of contact emails
            self.contact_emails = {
                self.contacts_billing.email,
                self.contacts_security.email,
                self.contacts_operations.email,
            }

    def _get_contact_information(self):
        try:
            primary_account_contact = self.client.get_contact_information()[
                "ContactInformation"
            ]

            return Contact(
                type="PRIMARY",
                name=primary_account_contact.get("FullName"),
                phone_number=primary_account_contact.get("PhoneNumber"),
            )
        except Exception as error:
            if error.response["Error"]["Code"] == "AccessDeniedException":
                logger.error(
                    f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
                return None
            else:
                logger.error(
                    f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
                return Contact(type="PRIMARY")

    def _get_alternate_contact(self, contact_type: str):
        try:
            account_contact = self.client.get_alternate_contact(
                AlternateContactType=contact_type
            )["AlternateContact"]

            return Contact(
                type=contact_type,
                email=account_contact.get("EmailAddress"),
                name=account_contact.get("Name"),
                phone_number=account_contact.get("PhoneNumber"),
            )

        except ClientError as error:
            if (
                error.response["Error"]["Code"] == "ResourceNotFoundException"
                and error.response["Error"]["Message"]
                == "No contact of the inputted alternate contact type found."
            ):
                logger.warning(
                    f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
            return Contact(
                type=contact_type,
            )

        except Exception as error:
            logger.error(
                f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            return Contact(
                type=contact_type,
            )


class Contact(BaseModel):
    type: str
    email: Optional[str] = None
    name: Optional[str] = None
    phone_number: Optional[str] = None
```

--------------------------------------------------------------------------------

---[FILE: account_maintain_current_contact_details.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/account/account_maintain_current_contact_details/account_maintain_current_contact_details.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "account_maintain_current_contact_details",
  "CheckTitle": "AWS account contact information is current",
  "CheckType": [
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "account",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**AWS account contact information** is current for the **primary contact** and the **alternate contacts** for `security`, `billing`, and `operations`, with accurate email addresses and phone numbers.",
  "Risk": "Outdated or single-person contacts delay **security notifications**, slow **incident response**, and complicate **account recovery**.\n\nAWS may throttle services during abuse mitigation, reducing **availability**. Missed alerts enable ongoing misuse, risking **data exfiltration** and unauthorized changes (**integrity**).",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.prowler.com/checks/aws/iam-policies/iam_18-maintain-contact-details#aws-console",
    "https://repost.aws/knowledge-center/update-phone-number",
    "https://support.stax.io/docs/accounts/update-aws-account-contact-details",
    "https://maartenbruntink.nl/blog/2022/09/26/aws-account-hygiene-101-mass-updating-alternate-account-contacts/",
    "https://docs.aws.amazon.com/security-ir/latest/userguide/update-account-contact-info.html",
    "https://docs.aws.amazon.com/accounts/latest/reference/manage-acct-update-contact-primary.html",
    "https://repost.aws/knowledge-center/add-update-billing-contact",
    "https://aws.amazon.com/blogs/security/update-the-alternate-security-contact-across-your-aws-accounts-for-timely-security-notifications/",
    "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_update_contacts.html",
    "https://docs.aws.amazon.com/accounts/latest/reference/manage-acct-update-contact-alternate.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws account put-alternate-contact --alternate-contact-type=SECURITY --email-address=<SECURITY_EMAIL> --name=\"<SECURITY_CONTACT_NAME>\" --phone-number=\"<SECURITY_PHONE>\" --title=\"Security\"",
      "NativeIaC": "",
      "Other": "1. Sign in to the AWS Management Console\n2. Open Billing and Cost Management, then click your account name > Account\n3. Under Contact information, click Edit, update details, then Update\n4. Under Alternate contacts, click Edit\n5. Enter Security contact name, email, and phone (use a team alias), then Update\n6. Repeat for Billing and Operations if needed",
      "Terraform": "```hcl\n# Set the Security alternate contact for the AWS account\nresource \"aws_account_alternate_contact\" \"<example_resource_name>\" {\n  alternate_contact_type = \"SECURITY\"  # Critical: ensures AWS can reach your security team\n  email_address          = \"<SECURITY_EMAIL>\"  # Critical: contact destination\n  name                   = \"<SECURITY_CONTACT_NAME>\"\n  phone_number           = \"<SECURITY_PHONE>\"\n  title                  = \"Security\"\n}\n```"
    },
    "Recommendation": {
      "Text": "Adopt:\n- **Primary** and **alternate contacts** for `security`, `billing`, `operations`\n- Shared, monitored aliases and SMS-capable phone numbers (non-personal)\n- Centralized management across accounts with periodic reviews\n- **Least privilege** for who can modify contact data\n- Regular reachability tests and documented ownership",
      "Url": "https://hub.prowler.com/check/account_maintain_current_contact_details"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

````
