---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 314
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 314 of 867)

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

---[FILE: s3_service.py]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_service.py
Signals: Pydantic

```python
import json
from typing import Dict, List, Optional

from botocore.client import ClientError
from pydantic.v1 import BaseModel, Field

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class S3(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.account_arn_template = f"arn:{self.audited_partition}:s3:{self.region}:{self.audited_account}:account"
        self.regions_with_buckets = []
        self.buckets = {}
        self.audited_canonical_id = ""
        self._list_buckets(provider)
        self.__threading_call__(self._get_bucket_versioning, self.buckets.values())
        self.__threading_call__(self._get_bucket_logging, self.buckets.values())
        self.__threading_call__(self._get_bucket_policy, self.buckets.values())
        self.__threading_call__(self._get_bucket_acl, self.buckets.values())
        self.__threading_call__(self._get_public_access_block, self.buckets.values())
        self.__threading_call__(self._get_bucket_encryption, self.buckets.values())
        self.__threading_call__(
            self._get_bucket_ownership_controls, self.buckets.values()
        )
        self.__threading_call__(
            self._get_object_lock_configuration, self.buckets.values()
        )
        self.__threading_call__(self._get_bucket_tagging, self.buckets.values())
        self.__threading_call__(self._get_bucket_replication, self.buckets.values())
        self.__threading_call__(self._get_bucket_lifecycle, self.buckets.values())
        self.__threading_call__(
            self._get_bucket_notification_configuration, self.buckets.values()
        )

    def _list_buckets(self, provider):
        logger.info("S3 - Listing buckets...")
        try:
            list_buckets = self.client.list_buckets()
            self.audited_canonical_id = list_buckets["Owner"]["ID"]
            for bucket in list_buckets["Buckets"]:
                try:
                    bucket_region = self.client.get_bucket_location(
                        Bucket=bucket["Name"]
                    )["LocationConstraint"]
                    if bucket_region == "EU":  # If EU, bucket_region is eu-west-1
                        bucket_region = "eu-west-1"
                    if not bucket_region:  # If None, bucket_region is us-east-1
                        bucket_region = "us-east-1"
                    # Arn
                    arn = f"arn:{self.audited_partition}:s3:::{bucket['Name']}"
                    if not self.audit_resources or (
                        is_resource_filtered(arn, self.audit_resources)
                    ):
                        self.regions_with_buckets.append(bucket_region)
                        # Check if there are filter regions
                        # FIXME: what if the bucket comes from a CloudTrail bucket in another audited region
                        if provider.identity.audited_regions:
                            if bucket_region in provider.identity.audited_regions:
                                self.buckets[arn] = Bucket(
                                    arn=arn,
                                    name=bucket["Name"],
                                    region=bucket_region,
                                )
                        else:
                            self.buckets[arn] = Bucket(
                                arn=arn,
                                name=bucket["Name"],
                                region=bucket_region,
                            )
                except ClientError as error:
                    if error.response["Error"]["Code"] == "NoSuchBucket":
                        logger.warning(
                            f"{bucket['Name']} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                        )
                    else:
                        logger.error(
                            f"{bucket['Name']} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                        )
                except Exception as error:
                    logger.error(
                        f"{bucket['Name']} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
        except ClientError as error:
            if error.response["Error"]["Code"] == "NotSignedUp":
                logger.warning(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
            else:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_bucket_versioning(self, bucket):
        logger.info("S3 - Get buckets versioning...")
        try:
            regional_client = self.regional_clients[bucket.region]
            bucket_versioning = regional_client.get_bucket_versioning(
                Bucket=bucket.name
            )
            if "Status" in bucket_versioning:
                if "Enabled" == bucket_versioning["Status"]:
                    bucket.versioning = True
            if "MFADelete" in bucket_versioning:
                if "Enabled" == bucket_versioning["MFADelete"]:
                    bucket.mfa_delete = True
        except ClientError as error:
            if error.response["Error"]["Code"] == "NoSuchBucket":
                logger.warning(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
            else:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        except Exception as error:
            if bucket.region:
                logger.error(
                    f"{bucket.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
            else:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

    def _get_bucket_encryption(self, bucket):
        logger.info("S3 - Get buckets encryption...")
        try:
            regional_client = self.regional_clients[bucket.region]
            bucket.encryption = regional_client.get_bucket_encryption(
                Bucket=bucket.name
            )["ServerSideEncryptionConfiguration"]["Rules"][0][
                "ApplyServerSideEncryptionByDefault"
            ][
                "SSEAlgorithm"
            ]
        except ClientError as error:
            if error.response["Error"]["Code"] == "NoSuchBucket":
                logger.warning(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
            else:
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        except Exception as error:
            if "ServerSideEncryptionConfigurationNotFoundError" in str(error):
                bucket.encryption = None
            elif regional_client:
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
            else:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

    def _get_bucket_logging(self, bucket):
        logger.info("S3 - Get buckets logging...")
        try:
            regional_client = self.regional_clients[bucket.region]
            bucket_logging = regional_client.get_bucket_logging(Bucket=bucket.name)
            if "LoggingEnabled" in bucket_logging:
                bucket.logging = True
                bucket.logging_target_bucket = bucket_logging["LoggingEnabled"][
                    "TargetBucket"
                ]
        except ClientError as error:
            if error.response["Error"]["Code"] == "NoSuchBucket":
                logger.warning(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
            else:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        except Exception as error:
            if regional_client:
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
            else:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

    def _get_public_access_block(self, bucket):
        logger.info("S3 - Get buckets public access block...")
        try:
            regional_client = self.regional_clients[bucket.region]
            public_access_block = regional_client.get_public_access_block(
                Bucket=bucket.name
            )["PublicAccessBlockConfiguration"]
            bucket.public_access_block = PublicAccessBlock(
                block_public_acls=public_access_block["BlockPublicAcls"],
                ignore_public_acls=public_access_block["IgnorePublicAcls"],
                block_public_policy=public_access_block["BlockPublicPolicy"],
                restrict_public_buckets=public_access_block["RestrictPublicBuckets"],
            )
        except ClientError as error:
            if error.response["Error"]["Code"] == "NoSuchBucket":
                logger.warning(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
            elif (
                error.response["Error"]["Code"]
                == "NoSuchPublicAccessBlockConfiguration"
            ):
                # Set all block as False
                bucket.public_access_block = PublicAccessBlock(
                    block_public_acls=False,
                    ignore_public_acls=False,
                    block_public_policy=False,
                    restrict_public_buckets=False,
                )
            else:
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        except Exception as error:
            if regional_client:
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
            else:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

    def _get_bucket_acl(self, bucket):
        logger.info("S3 - Get buckets acl...")
        try:
            regional_client = self.regional_clients[bucket.region]
            acl = regional_client.get_bucket_acl(Bucket=bucket.name)
            bucket.owner_id = acl["Owner"]["ID"]
            grantees = []
            for grant in acl["Grants"]:
                grantee = ACL_Grantee(type=grant["Grantee"]["Type"])
                if "DisplayName" in grant["Grantee"]:
                    grantee.display_name = grant["Grantee"]["DisplayName"]
                if "ID" in grant["Grantee"]:
                    grantee.ID = grant["Grantee"]["ID"]
                if "URI" in grant["Grantee"]:
                    grantee.URI = grant["Grantee"]["URI"]
                if "Permission" in grant:
                    grantee.permission = grant["Permission"]
                grantees.append(grantee)
            bucket.acl_grantees = grantees
        except ClientError as error:
            if error.response["Error"]["Code"] == "NoSuchBucket":
                logger.warning(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
            else:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        except Exception as error:
            if regional_client:
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
            else:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

    def _get_bucket_policy(self, bucket):
        logger.info("S3 - Get buckets policy...")
        try:
            regional_client = self.regional_clients[bucket.region]
            bucket.policy = json.loads(
                regional_client.get_bucket_policy(Bucket=bucket.name)["Policy"]
            )
        except ClientError as error:
            if error.response["Error"]["Code"] == "NoSuchBucketPolicy":
                bucket.policy = {}
            elif error.response["Error"]["Code"] == "NoSuchBucket":
                logger.warning(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
            else:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        except Exception as error:
            if regional_client:
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
            else:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

    def _get_bucket_ownership_controls(self, bucket):
        logger.info("S3 - Get buckets ownership controls...")
        try:
            regional_client = self.regional_clients[bucket.region]
            bucket.ownership = regional_client.get_bucket_ownership_controls(
                Bucket=bucket.name
            )["OwnershipControls"]["Rules"][0]["ObjectOwnership"]
        except ClientError as error:
            if error.response["Error"]["Code"] == "NoSuchBucket":
                logger.warning(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
            elif error.response["Error"]["Code"] == "OwnershipControlsNotFoundError":
                bucket.ownership = None
            else:
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        except Exception as error:
            if regional_client:
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
            else:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

    def _get_object_lock_configuration(self, bucket):
        logger.info("S3 - Get buckets ownership controls...")
        try:
            regional_client = self.regional_clients[bucket.region]
            regional_client.get_object_lock_configuration(Bucket=bucket.name)
            bucket.object_lock = True
        except Exception as error:
            if (
                "ObjectLockConfigurationNotFoundError" in str(error)
                or error.response["Error"]["Code"] == "NoSuchBucket"
            ):
                bucket.object_lock = False
                if regional_client:
                    logger.warning(
                        f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
                else:
                    logger.warning(
                        f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
            else:
                if regional_client:
                    logger.error(
                        f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
                else:
                    logger.error(
                        f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )

    def _get_bucket_tagging(self, bucket):
        logger.info("S3 - Get buckets logging...")
        try:
            regional_client = self.regional_clients[bucket.region]
            bucket_tags = regional_client.get_bucket_tagging(Bucket=bucket.name)[
                "TagSet"
            ]
            bucket.tags = bucket_tags
        except ClientError as error:
            bucket.tags = []
            if error.response["Error"]["Code"] != "NoSuchTagSet":
                if error.response["Error"]["Code"] == "NoSuchBucket":
                    logger.warning(
                        f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
                else:
                    logger.error(
                        f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
        except Exception as error:
            if regional_client:
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
            else:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

    def _get_bucket_lifecycle(self, bucket):
        logger.info("S3 - Get buckets lifecycle...")
        try:
            regional_client = self.regional_clients[bucket.region]
            lifecycle_configuration = (
                regional_client.get_bucket_lifecycle_configuration(Bucket=bucket.name)
            )
            for rule in lifecycle_configuration["Rules"]:
                bucket.lifecycle.append(
                    LifeCycleRule(
                        id=rule["ID"],
                        status=rule["Status"],
                    )
                )
        except ClientError as error:
            if error.response["Error"]["Code"] == "NoSuchLifecycleConfiguration":
                bucket.lifecycle = []
            elif error.response["Error"]["Code"] == "NoSuchBucket":
                logger.warning(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

    def _get_bucket_replication(self, bucket):
        logger.info("S3 - Get buckets replication...")
        try:
            regional_client = self.regional_clients[bucket.region]
            replication_config = regional_client.get_bucket_replication(
                Bucket=bucket.name
            )["ReplicationConfiguration"]["Rules"]
            if replication_config:
                for rule in replication_config:
                    bucket.replication_rules.append(
                        ReplicationRule(
                            id=rule["ID"],
                            status=rule["Status"],
                            destination=rule["Destination"]["Bucket"],
                        )
                    )
        except ClientError as error:
            if error.response["Error"]["Code"] == "NoSuchBucket":
                logger.warning(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
            elif (
                error.response["Error"]["Code"]
                == "ReplicationConfigurationNotFoundError"
            ):
                bucket.replication = None
            else:
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        except Exception as error:
            if regional_client:
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
            else:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

    def _get_bucket_notification_configuration(self, bucket):
        logger.info("S3 - Get bucket's notification configuration...")
        try:
            regional_client = self.regional_clients[bucket.region]
            bucket_notification_config = (
                regional_client.get_bucket_notification_configuration(
                    Bucket=bucket.name
                )
            )

            if any(
                key in bucket_notification_config
                for key in (
                    "TopicConfigurations",
                    "QueueConfigurations",
                    "LambdaFunctionConfigurations",
                    "EventBridgeConfiguration",
                )
            ):
                bucket.notification_config = bucket_notification_config
            else:
                bucket.notification_config = {}

        except ClientError as error:
            if error.response["Error"]["Code"] == "NoSuchBucket":
                logger.warning(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
            else:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _head_bucket(self, bucket_name):
        logger.info("S3 - Checking if bucket exists...")
        try:
            self.client.head_bucket(Bucket=bucket_name)
            return True
        except ClientError as error:
            if error.response["Error"]["Message"] == "Not Found":
                logger.warning(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
                return False
            else:
                # Bucket exists but we don't have access to it
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
                return True
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class S3Control(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.account_public_access_block = None
        self.access_points = {}
        self.multi_region_access_points = {}
        self._get_public_access_block()
        self.__threading_call__(self._list_access_points)
        self.__threading_call__(self._get_access_point, self.access_points.values())
        if self.audited_partition == "aws":
            self._list_multi_region_access_points()

    def _get_public_access_block(self):
        logger.info("S3 - Get account public access block...")
        try:
            public_access_block = self.client.get_public_access_block(
                AccountId=self.audited_account
            )["PublicAccessBlockConfiguration"]
            self.account_public_access_block = PublicAccessBlock(
                block_public_acls=public_access_block["BlockPublicAcls"],
                ignore_public_acls=public_access_block["IgnorePublicAcls"],
                block_public_policy=public_access_block["BlockPublicPolicy"],
                restrict_public_buckets=public_access_block["RestrictPublicBuckets"],
            )
        except Exception as error:
            if "NoSuchPublicAccessBlockConfiguration" in str(error):
                # Set all block as False
                self.account_public_access_block = PublicAccessBlock(
                    block_public_acls=False,
                    ignore_public_acls=False,
                    block_public_policy=False,
                    restrict_public_buckets=False,
                )
                logger.warning(
                    f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
            else:
                logger.error(
                    f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

    def _list_access_points(self, regional_client):
        logger.info("S3 - Listing account access points...")
        try:
            list_access_points = regional_client.list_access_points(
                AccountId=self.audited_account
            )["AccessPointList"]
            for ap in list_access_points:
                self.access_points[ap["AccessPointArn"]] = AccessPoint(
                    arn=ap["AccessPointArn"],
                    account_id=self.audited_account,
                    name=ap["Name"],
                    bucket=ap["Bucket"],
                    region=regional_client.region,
                )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_multi_region_access_points(self):
        # NOTE: This function is restricted to the us-west-2 region due to AWS limitations on Multi-Region Access Points.
        # For more details on region restrictions, see the AWS documentation:
        # https://docs.aws.amazon.com/AmazonS3/latest/userguide/MultiRegionAccessPointRestrictions.html
        logger.info("S3 - Listing account multi region access points...")
        try:
            region = "us-west-2"
            client = self.session.client(self.service, region)
            list_multi_region_access_points = client.list_multi_region_access_points(
                AccountId=self.audited_account
            ).get("AccessPoints", [])
            for mr_access_point in list_multi_region_access_points:
                mr_ap_arn = f"arn:{self.audited_partition}:s3::{self.audited_account}:accesspoint/{mr_access_point['Name']}"
                bucket_list = []
                for mrap_region in mr_access_point.get("Regions", []):
                    bucket_list.append(mrap_region.get("Bucket", ""))
                self.multi_region_access_points[mr_ap_arn] = MultiRegionAccessPoint(
                    arn=mr_ap_arn,
                    account_id=self.audited_account,
                    name=mr_access_point["Name"],
                    buckets=bucket_list,
                    region=region,
                    public_access_block=PublicAccessBlock(
                        block_public_acls=mr_access_point.get(
                            "PublicAccessBlock", {}
                        ).get("BlockPublicAcls", False),
                        ignore_public_acls=mr_access_point.get(
                            "PublicAccessBlock", {}
                        ).get("IgnorePublicAcls", False),
                        block_public_policy=mr_access_point.get(
                            "PublicAccessBlock", {}
                        ).get("BlockPublicPolicy", False),
                        restrict_public_buckets=mr_access_point.get(
                            "PublicAccessBlock", {}
                        ).get("RestrictPublicBuckets", False),
                    ),
                )
        except Exception as error:
            logger.error(
                f"{region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_access_point(self, ap):
        logger.info("S3 - Get account access point...")
        try:
            access_point = self.regional_clients[ap.region].get_access_point(
                AccountId=ap.account_id, Name=ap.name
            )
            ap.public_access_block = PublicAccessBlock(
                block_public_acls=access_point.get(
                    "PublicAccessBlockConfiguration", {}
                ).get("BlockPublicAcls", False),
                ignore_public_acls=access_point.get(
                    "PublicAccessBlockConfiguration", {}
                ).get("IgnorePublicAcls", False),
                block_public_policy=access_point.get(
                    "PublicAccessBlockConfiguration", {}
                ).get("BlockPublicPolicy", False),
                restrict_public_buckets=access_point.get(
                    "PublicAccessBlockConfiguration", {}
                ).get("RestrictPublicBuckets", False),
            )
        except Exception as error:
            logger.error(
                f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class ACL_Grantee(BaseModel):
    display_name: Optional[str]
    ID: Optional[str]
    type: str
    URI: Optional[str]
    permission: Optional[str]


class PublicAccessBlock(BaseModel):
    block_public_acls: bool
    ignore_public_acls: bool
    block_public_policy: bool
    restrict_public_buckets: bool


class AccessPoint(BaseModel):
    arn: str
    account_id: str
    name: str
    bucket: str
    public_access_block: Optional[PublicAccessBlock]
    region: str


class MultiRegionAccessPoint(BaseModel):
    arn: str
    account_id: str
    name: str
    buckets: list[str] = []
    public_access_block: Optional[PublicAccessBlock]
    region: str


class LifeCycleRule(BaseModel):
    id: str
    status: str


class ReplicationRule(BaseModel):
    id: str
    status: str
    destination: str


class Bucket(BaseModel):
    arn: str
    name: str
    owner_id: Optional[str]
    owner: Optional[str]
    versioning: bool = False
    logging: bool = False
    public_access_block: Optional[PublicAccessBlock]
    acl_grantees: List[ACL_Grantee] = Field(default_factory=list)
    policy: Optional[dict]
    encryption: Optional[str]
    region: str
    logging_target_bucket: Optional[str]
    ownership: Optional[str]
    object_lock: bool = False
    mfa_delete: bool = False
    tags: List[Dict[str, str]] = Field(default_factory=list)
    lifecycle: List[LifeCycleRule] = Field(default_factory=list)
    replication_rules: List[ReplicationRule] = Field(default_factory=list)
    notification_config: Dict = Field(default_factory=dict)
```

--------------------------------------------------------------------------------

---[FILE: s3_access_point_public_access_block.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_access_point_public_access_block/s3_access_point_public_access_block.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "s3_access_point_public_access_block",
  "CheckTitle": "Block Public Access Settings enabled on Access Points.",
  "CheckType": [
    "Data Protection"
  ],
  "ServiceName": "s3",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:s3:::bucket_name",
  "Severity": "critical",
  "ResourceType": "AwsS3AccessPoint",
  "Description": "Ensures that public access is blocked on S3 Access Points.",
  "Risk": "Leaving S3 access points open to the public in AWS can lead to data exposure, breaches, compliance violations, unauthorized access, and data integrity issues.",
  "RelatedUrl": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-points.html#access-points-policies",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/s3-controls.html#s3-19",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure S3 access points are private by default, applying strict access controls, and regularly auditing permissions to prevent unauthorized public access.",
      "Url": "https://docs.aws.amazon.com/config/latest/developerguide/s3-access-point-public-access-blocks.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: s3_access_point_public_access_block.py]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_access_point_public_access_block/s3_access_point_public_access_block.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.s3.s3control_client import s3control_client


class s3_access_point_public_access_block(Check):
    def execute(self):
        findings = []
        for access_point in s3control_client.access_points.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=access_point)
            report.status = "PASS"
            report.status_extended = f"Access Point {access_point.name} of bucket {access_point.bucket} does have Public Access Block enabled."

            if not (
                access_point.public_access_block.block_public_acls
                and access_point.public_access_block.ignore_public_acls
                and access_point.public_access_block.block_public_policy
                and access_point.public_access_block.restrict_public_buckets
            ):
                report.status = "FAIL"
                report.status_extended = f"Access Point {access_point.name} of bucket {access_point.bucket} does not have Public Access Block enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: s3_account_level_public_access_blocks.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_account_level_public_access_blocks/s3_account_level_public_access_blocks.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "s3_account_level_public_access_blocks",
  "CheckTitle": "Check S3 Account Level Public Access Block.",
  "CheckType": [
    "Data Protection"
  ],
  "ServiceName": "s3",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:s3:::bucket_name",
  "Severity": "high",
  "ResourceType": "AwsS3AccountPublicAccessBlock",
  "Description": "Check S3 Account Level Public Access Block.",
  "Risk": "Public access policies may be applied to sensitive data buckets.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "aws s3control put-public-access-block --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true --account-id <account_id>",
      "NativeIaC": "https://docs.prowler.com/checks/aws/s3-policies/bc_aws_s3_21#cloudformation",
      "Other": "https://github.com/cloudmatos/matos/tree/master/remediations/aws/s3/s3control/block-public-access",
      "Terraform": "https://docs.prowler.com/checks/aws/s3-policies/bc_aws_s3_21#terraform"
    },
    "Recommendation": {
      "Text": "You can enable Public Access Block at the account level to prevent the exposure of your data stored in S3.",
      "Url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: s3_account_level_public_access_blocks.py]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_account_level_public_access_blocks/s3_account_level_public_access_blocks.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.s3.s3_client import s3_client
from prowler.providers.aws.services.s3.s3control_client import s3control_client


class s3_account_level_public_access_blocks(Check):
    def execute(self):
        findings = []
        if s3control_client.account_public_access_block is not None:
            report = Check_Report_AWS(
                metadata=self.metadata(),
                resource=s3control_client.account_public_access_block,
            )
            if (
                s3control_client.account_public_access_block
                and s3control_client.account_public_access_block.ignore_public_acls
                and s3control_client.account_public_access_block.restrict_public_buckets
            ):
                report.status = "PASS"
                report.status_extended = f"Block Public Access is configured for the account {s3control_client.audited_account}."
                report.region = s3control_client.region
                report.resource_id = s3control_client.audited_account
                report.resource_arn = s3_client.account_arn_template
                findings.append(report)
            elif s3_client.buckets or s3_client.provider.scan_unused_services:
                report.status = "FAIL"
                report.status_extended = f"Block Public Access is not configured for the account {s3control_client.audited_account}."
                report.region = s3control_client.region
                report.resource_id = s3control_client.audited_account
                report.resource_arn = s3_client.account_arn_template
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: s3_account_level_public_access_blocks_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_account_level_public_access_blocks/s3_account_level_public_access_blocks_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.s3.s3control_client import s3control_client


def fixer(resource_id: str) -> bool:
    """
    Enable S3 Block Public Access for the account. NOTE: By blocking all S3 public access you may break public S3 buckets.
    Requires the s3:PutAccountPublicAccessBlock permission.
    Permissions:
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "s3:PutAccountPublicAccessBlock",
                "Resource": "*"
            }
        ]
    }
    Args:
        resource_id (str): The AWS account ID.
    Returns:
        bool: True if S3 Block Public Access is enabled, False otherwise
    """
    try:
        s3control_client.client.put_public_access_block(
            AccountId=resource_id,
            PublicAccessBlockConfiguration={
                "BlockPublicAcls": True,
                "IgnorePublicAcls": True,
                "BlockPublicPolicy": True,
                "RestrictPublicBuckets": True,
            },
        )
    except Exception as error:
        logger.error(
            f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
        )
        return False
    else:
        return True
```

--------------------------------------------------------------------------------

````
