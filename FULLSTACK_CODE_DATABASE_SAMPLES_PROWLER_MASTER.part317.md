---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 317
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 317 of 867)

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

---[FILE: sagemaker_service.py]---
Location: prowler-master/prowler/providers/aws/services/sagemaker/sagemaker_service.py
Signals: Pydantic

```python
from typing import Optional

from botocore.client import ClientError
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class SageMaker(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.sagemaker_notebook_instances = []
        self.sagemaker_models = []
        self.sagemaker_training_jobs = []
        self.endpoint_configs = {}
        self.__threading_call__(self._list_notebook_instances)
        self.__threading_call__(self._list_models)
        self.__threading_call__(self._list_training_jobs)
        self.__threading_call__(self._list_endpoint_configs)
        self.__threading_call__(self._describe_model, self.sagemaker_models)
        self.__threading_call__(
            self._describe_notebook_instance, self.sagemaker_notebook_instances
        )
        self.__threading_call__(
            self._describe_training_job, self.sagemaker_training_jobs
        )
        self.__threading_call__(
            self._describe_endpoint_config, self.endpoint_configs.values()
        )
        self._list_tags_for_resource()

    def _list_notebook_instances(self, regional_client):
        logger.info("SageMaker - listing notebook instances...")
        try:
            list_notebook_instances_paginator = regional_client.get_paginator(
                "list_notebook_instances"
            )
            for page in list_notebook_instances_paginator.paginate():
                for notebook_instance in page["NotebookInstances"]:
                    if not self.audit_resources or (
                        is_resource_filtered(
                            notebook_instance["NotebookInstanceArn"],
                            self.audit_resources,
                        )
                    ):
                        self.sagemaker_notebook_instances.append(
                            NotebookInstance(
                                name=notebook_instance["NotebookInstanceName"],
                                region=regional_client.region,
                                arn=notebook_instance["NotebookInstanceArn"],
                            )
                        )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_models(self, regional_client):
        logger.info("SageMaker - listing models...")
        try:
            list_models_paginator = regional_client.get_paginator("list_models")
            for page in list_models_paginator.paginate():
                for model in page["Models"]:
                    if not self.audit_resources or (
                        is_resource_filtered(model["ModelArn"], self.audit_resources)
                    ):
                        self.sagemaker_models.append(
                            Model(
                                name=model["ModelName"],
                                region=regional_client.region,
                                arn=model["ModelArn"],
                            )
                        )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_training_jobs(self, regional_client):
        logger.info("SageMaker - listing training jobs...")
        try:
            list_training_jobs_paginator = regional_client.get_paginator(
                "list_training_jobs"
            )
            for page in list_training_jobs_paginator.paginate():
                for training_job in page["TrainingJobSummaries"]:
                    if not self.audit_resources or (
                        is_resource_filtered(
                            training_job["TrainingJobArn"], self.audit_resources
                        )
                    ):
                        self.sagemaker_training_jobs.append(
                            TrainingJob(
                                name=training_job["TrainingJobName"],
                                region=regional_client.region,
                                arn=training_job["TrainingJobArn"],
                            )
                        )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_notebook_instance(self, notebook_instance):
        logger.info("SageMaker - describing notebook instances...")
        try:
            regional_client = self.regional_clients[notebook_instance.region]
            try:
                describe_notebook_instance = regional_client.describe_notebook_instance(
                    NotebookInstanceName=notebook_instance.name
                )
            except ClientError as error:
                if error.response["Error"]["Code"] == "ValidationException":
                    logger.warning(
                        f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
            if (
                "RootAccess" in describe_notebook_instance
                and describe_notebook_instance["RootAccess"] == "Enabled"
            ):
                notebook_instance.root_access = True
            if "SubnetId" in describe_notebook_instance:
                notebook_instance.subnet_id = describe_notebook_instance["SubnetId"]
            if (
                "DirectInternetAccess" in describe_notebook_instance
                and describe_notebook_instance["RootAccess"] == "Enabled"
            ):
                notebook_instance.direct_internet_access = True
            if "KmsKeyId" in describe_notebook_instance:
                notebook_instance.kms_key_id = describe_notebook_instance["KmsKeyId"]
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_model(self, model):
        logger.info("SageMaker - describing models...")
        try:
            regional_client = self.regional_clients[model.region]
            describe_model = regional_client.describe_model(ModelName=model.name)
            if "EnableNetworkIsolation" in describe_model:
                model.network_isolation = describe_model["EnableNetworkIsolation"]
            if (
                "VpcConfig" in describe_model
                and "Subnets" in describe_model["VpcConfig"]
            ):
                model.vpc_config_subnets = describe_model["VpcConfig"]["Subnets"]
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_training_job(self, training_job):
        logger.info("SageMaker - describing training jobs...")
        try:
            regional_client = self.regional_clients[training_job.region]
            describe_training_job = regional_client.describe_training_job(
                TrainingJobName=training_job.name
            )
            if "EnableInterContainerTrafficEncryption" in describe_training_job:
                training_job.container_traffic_encryption = describe_training_job[
                    "EnableInterContainerTrafficEncryption"
                ]
            if (
                "ResourceConfig" in describe_training_job
                and "VolumeKmsKeyId" in describe_training_job["ResourceConfig"]
            ):
                training_job.volume_kms_key_id = describe_training_job[
                    "ResourceConfig"
                ]["VolumeKmsKeyId"]
            if "EnableNetworkIsolation" in describe_training_job:
                training_job.network_isolation = describe_training_job[
                    "EnableNetworkIsolation"
                ]
            if (
                "VpcConfig" in describe_training_job
                and "Subnets" in describe_training_job["VpcConfig"]
            ):
                training_job.vpc_config_subnets = describe_training_job["VpcConfig"][
                    "Subnets"
                ]
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_tags_for_resource(self):
        logger.info("SageMaker - List Tags...")
        try:
            for model in self.sagemaker_models:
                regional_client = self.regional_clients[model.region]
                response = regional_client.list_tags(ResourceArn=model.arn)["Tags"]
                model.tags = response
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        try:
            for instance in self.sagemaker_notebook_instances:
                regional_client = self.regional_clients[instance.region]
                response = regional_client.list_tags(ResourceArn=instance.arn)["Tags"]
                instance.tags = response
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        try:
            for job in self.sagemaker_training_jobs:
                regional_client = self.regional_clients[job.region]
                response = regional_client.list_tags(ResourceArn=job.arn)["Tags"]
                job.tags = response
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        try:
            for endpoint in self.endpoint_configs.values():
                regional_client = self.regional_clients[endpoint.region]
                response = regional_client.list_tags(ResourceArn=endpoint.arn)["Tags"]
                endpoint.tags = response
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_endpoint_configs(self, regional_client):
        logger.info("SageMaker - listing endpoint configs...")
        try:
            list_endpoint_config_paginator = regional_client.get_paginator(
                "list_endpoint_configs"
            )
            for page in list_endpoint_config_paginator.paginate():
                for endpoint_config in page["EndpointConfigs"]:
                    if not self.audit_resources or (
                        is_resource_filtered(
                            endpoint_config["EndpointConfigArn"], self.audit_resources
                        )
                    ):
                        self.endpoint_configs[endpoint_config["EndpointConfigArn"]] = (
                            EndpointConfig(
                                name=endpoint_config["EndpointConfigName"],
                                region=regional_client.region,
                                arn=endpoint_config["EndpointConfigArn"],
                            )
                        )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_endpoint_config(self, endpoint_config):
        logger.info("SageMaker - describing endpoint configs...")
        try:
            regional_client = self.regional_clients[endpoint_config.region]
            describe_endpoint_config = regional_client.describe_endpoint_config(
                EndpointConfigName=endpoint_config.name
            )
            production_variants = []
            for production_variant in describe_endpoint_config["ProductionVariants"]:
                production_variants.append(
                    ProductionVariant(
                        name=production_variant["VariantName"],
                        initial_instance_count=production_variant.get(
                            "InitialInstanceCount", 0
                        ),
                    )
                )
            endpoint_config.production_variants = production_variants
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class NotebookInstance(BaseModel):
    name: str
    region: str
    arn: str
    root_access: bool = None
    subnet_id: str = None
    direct_internet_access: bool = None
    kms_key_id: str = None
    tags: Optional[list] = []


class Model(BaseModel):
    name: str
    region: str
    arn: str
    network_isolation: bool = None
    vpc_config_subnets: list[str] = []
    tags: Optional[list] = []


class TrainingJob(BaseModel):
    name: str
    region: str
    arn: str
    container_traffic_encryption: bool = None
    volume_kms_key_id: str = None
    network_isolation: bool = None
    vpc_config_subnets: list[str] = []
    tags: Optional[list] = []


class ProductionVariant(BaseModel):
    name: str
    initial_instance_count: int


class EndpointConfig(BaseModel):
    name: str
    region: str
    arn: str
    production_variants: list[ProductionVariant] = []
    tags: Optional[list] = []
```

--------------------------------------------------------------------------------

---[FILE: sagemaker_endpoint_config_prod_variant_instances.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/sagemaker/sagemaker_endpoint_config_prod_variant_instances/sagemaker_endpoint_config_prod_variant_instances.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "sagemaker_endpoint_config_prod_variant_instances",
  "CheckTitle": "SageMaker endpoint production variants should have at least two initial instances",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "sagemaker",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:sagemaker:region:account-id:endpoint-config/resource-id",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "This control checks whether production variants of an Amazon SageMaker endpoint have an initial instance count greater than 1. A single instance creates a single point of failure and reduces availability.",
  "Risk": "Having only one instance for a SageMaker endpoint production variant can lead to reduced availability, single points of failure, and slow recovery during incidents, especially if the instance becomes unavailable due to failure or security incidents.",
  "RelatedUrl": "https://docs.aws.amazon.com/config/latest/developerguide/sagemaker-endpoint-config-prod-instance-count.html",
  "Remediation": {
    "Code": {
      "CLI": "aws sagemaker update-endpoint --endpoint-name <endpoint-name> --endpoint-config-name <config-name>",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/sagemaker-controls.html#sagemaker-4",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "To increase the initial instance count, configure your SageMaker endpoint to use more than 1 instance in the production variant for high availability.",
      "Url": "https://docs.aws.amazon.com/sagemaker/latest/dg/serverless-endpoints-create.html#serverless-endpoints-create-config"
    }
  },
  "Categories": [
    "redundancy",
    "gen-ai"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: sagemaker_endpoint_config_prod_variant_instances.py]---
Location: prowler-master/prowler/providers/aws/services/sagemaker/sagemaker_endpoint_config_prod_variant_instances/sagemaker_endpoint_config_prod_variant_instances.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.sagemaker.sagemaker_client import sagemaker_client


class sagemaker_endpoint_config_prod_variant_instances(Check):
    def execute(self):
        findings = []
        for endpoint_config in sagemaker_client.endpoint_configs.values():
            report = Check_Report_AWS(
                metadata=self.metadata(), resource=endpoint_config
            )
            report.status = "PASS"
            report.status_extended = f"Sagemaker Endpoint Config {endpoint_config.name} has all production variants with more than one initial instance."
            non_compliant_production_variants = []
            for production_variant in endpoint_config.production_variants:
                if production_variant.initial_instance_count <= 1:
                    non_compliant_production_variants.append(production_variant.name)

            if non_compliant_production_variants:
                report.status = "FAIL"
                report.status_extended = f"Sagemaker Endpoint Config {endpoint_config.name}'s production variants {', '.join(non_compliant_production_variants)} with less than two initial instance."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: sagemaker_models_network_isolation_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/sagemaker/sagemaker_models_network_isolation_enabled/sagemaker_models_network_isolation_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "sagemaker_models_network_isolation_enabled",
  "CheckTitle": "Check if Amazon SageMaker Models have network isolation enabled",
  "CheckType": [],
  "ServiceName": "sagemaker",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:sagemaker:region:account-id:model",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "Check if Amazon SageMaker Models have network isolation enabled",
  "Risk": "This could provide an avenue for unauthorized access to your data.",
  "RelatedUrl": "https://docs.aws.amazon.com/sagemaker/latest/dg/studio-notebooks-and-internet-access.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Restrict which traffic can access by launching Studio in a Virtual Private Cloud (VPC) of your choosing.",
      "Url": "https://docs.aws.amazon.com/sagemaker/latest/dg/studio-notebooks-and-internet-access.html"
    }
  },
  "Categories": ["gen-ai"],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: sagemaker_models_network_isolation_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/sagemaker/sagemaker_models_network_isolation_enabled/sagemaker_models_network_isolation_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.sagemaker.sagemaker_client import sagemaker_client


class sagemaker_models_network_isolation_enabled(Check):
    def execute(self):
        findings = []
        for model in sagemaker_client.sagemaker_models:
            report = Check_Report_AWS(metadata=self.metadata(), resource=model)
            report.status = "PASS"
            report.status_extended = f"Sagemaker notebook instance {model.name} has network isolation enabled."
            if not model.network_isolation:
                report.status = "FAIL"
                report.status_extended = f"Sagemaker notebook instance {model.name} has network isolation disabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: sagemaker_models_vpc_settings_configured.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/sagemaker/sagemaker_models_vpc_settings_configured/sagemaker_models_vpc_settings_configured.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "sagemaker_models_vpc_settings_configured",
  "CheckTitle": "Check if Amazon SageMaker Models have VPC settings configured",
  "CheckType": [],
  "ServiceName": "sagemaker",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:sagemaker:region:account-id:model",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "Check if Amazon SageMaker Models have VPC settings configured",
  "Risk": "This could provide an avenue for unauthorized access to your data.",
  "RelatedUrl": "https://docs.aws.amazon.com/sagemaker/latest/dg/studio-notebooks-and-internet-access.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Restrict which traffic can access by launching Studio in a Virtual Private Cloud (VPC) of your choosing.",
      "Url": "https://docs.aws.amazon.com/sagemaker/latest/dg/studio-notebooks-and-internet-access.html"
    }
  },
  "Categories": ["gen-ai"],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: sagemaker_models_vpc_settings_configured.py]---
Location: prowler-master/prowler/providers/aws/services/sagemaker/sagemaker_models_vpc_settings_configured/sagemaker_models_vpc_settings_configured.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.sagemaker.sagemaker_client import sagemaker_client


class sagemaker_models_vpc_settings_configured(Check):
    def execute(self):
        findings = []
        for model in sagemaker_client.sagemaker_models:
            report = Check_Report_AWS(metadata=self.metadata(), resource=model)
            report.status = "PASS"
            report.status_extended = (
                f"Sagemaker notebook instance {model.name} has VPC settings enabled."
            )
            if not model.vpc_config_subnets:
                report.status = "FAIL"
                report.status_extended = f"Sagemaker notebook instance {model.name} has VPC settings disabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: sagemaker_notebook_instance_encryption_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/sagemaker/sagemaker_notebook_instance_encryption_enabled/sagemaker_notebook_instance_encryption_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "sagemaker_notebook_instance_encryption_enabled",
  "CheckTitle": "Check if Amazon SageMaker Notebook instances have data encryption enabled",
  "CheckType": [],
  "ServiceName": "sagemaker",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:sagemaker:region:account-id:notebook-instance",
  "Severity": "medium",
  "ResourceType": "AwsSageMakerNotebookInstance",
  "Description": "Check if Amazon SageMaker Notebook instances have data encryption enabled",
  "Risk": "Data exfiltration could happen if information is not protected. KMS keys provide additional security level to IAM policies.",
  "RelatedUrl": "https://docs.aws.amazon.com/sagemaker/latest/dg/key-management.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/SageMaker/notebook-data-encrypted.html",
      "Terraform": "https://docs.prowler.com/checks/aws/general-policies/bc_aws_general_40#fix---buildtime"
    },
    "Recommendation": {
      "Text": "Specify AWS KMS keys to use for input and output from S3 and EBS.",
      "Url": "https://docs.aws.amazon.com/sagemaker/latest/dg/key-management.html"
    }
  },
  "Categories": [
    "encryption",
    "gen-ai"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: sagemaker_notebook_instance_encryption_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/sagemaker/sagemaker_notebook_instance_encryption_enabled/sagemaker_notebook_instance_encryption_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.sagemaker.sagemaker_client import sagemaker_client


class sagemaker_notebook_instance_encryption_enabled(Check):
    def execute(self):
        findings = []
        for notebook_instance in sagemaker_client.sagemaker_notebook_instances:
            report = Check_Report_AWS(
                metadata=self.metadata(), resource=notebook_instance
            )
            report.status = "PASS"
            report.status_extended = f"Sagemaker notebook instance {notebook_instance.name} has data encryption enabled."
            if not notebook_instance.kms_key_id:
                report.status = "FAIL"
                report.status_extended = f"Sagemaker notebook instance {notebook_instance.name} has data encryption disabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: sagemaker_notebook_instance_root_access_disabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/sagemaker/sagemaker_notebook_instance_root_access_disabled/sagemaker_notebook_instance_root_access_disabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "sagemaker_notebook_instance_root_access_disabled",
  "CheckTitle": "Check if Amazon SageMaker Notebook instances have root access disabled",
  "CheckType": [],
  "ServiceName": "sagemaker",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:sagemaker:region:account-id:notebook-instance",
  "Severity": "medium",
  "ResourceType": "AwsSageMakerNotebookInstance",
  "Description": "Check if Amazon SageMaker Notebook instances have root access disabled",
  "Risk": "Users with root access have administrator privileges, users can access and edit all files on a notebook instance with root access enabled",
  "RelatedUrl": "https://docs.aws.amazon.com/sagemaker/latest/dg/nbi-root-access.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Set the RootAccess field to Disabled. You can also disable root access for users when you create or update a notebook instance in the Amazon SageMaker console.",
      "Url": "https://docs.aws.amazon.com/sagemaker/latest/dg/nbi-root-access.html"
    }
  },
  "Categories": ["gen-ai"],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: sagemaker_notebook_instance_root_access_disabled.py]---
Location: prowler-master/prowler/providers/aws/services/sagemaker/sagemaker_notebook_instance_root_access_disabled/sagemaker_notebook_instance_root_access_disabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.sagemaker.sagemaker_client import sagemaker_client


class sagemaker_notebook_instance_root_access_disabled(Check):
    def execute(self):
        findings = []
        for notebook_instance in sagemaker_client.sagemaker_notebook_instances:
            report = Check_Report_AWS(
                metadata=self.metadata(), resource=notebook_instance
            )
            report.status = "PASS"
            report.status_extended = f"Sagemaker notebook instance {notebook_instance.name} has root access disabled."
            if notebook_instance.root_access:
                report.status = "FAIL"
                report.status_extended = f"Sagemaker notebook instance {notebook_instance.name} has root access enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: sagemaker_notebook_instance_vpc_settings_configured.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/sagemaker/sagemaker_notebook_instance_vpc_settings_configured/sagemaker_notebook_instance_vpc_settings_configured.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "sagemaker_notebook_instance_vpc_settings_configured",
  "CheckTitle": "Check if Amazon SageMaker Notebook instances have VPC settings configured",
  "CheckType": [],
  "ServiceName": "sagemaker",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:sagemaker:region:account-id:notebook-instance",
  "Severity": "medium",
  "ResourceType": "AwsSageMakerNotebookInstance",
  "Description": "Check if Amazon SageMaker Notebook instances have VPC settings configured",
  "Risk": "This could provide an avenue for unauthorized access to your data.",
  "RelatedUrl": "https://docs.aws.amazon.com/sagemaker/latest/dg/studio-notebooks-and-internet-access.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/SageMaker/notebook-instance-in-vpc.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Restrict which traffic can access by launching Studio in a Virtual Private Cloud (VPC) of your choosing..",
      "Url": "https://docs.aws.amazon.com/sagemaker/latest/dg/studio-notebooks-and-internet-access.html"
    }
  },
  "Categories": [
    "gen-ai"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: sagemaker_notebook_instance_vpc_settings_configured.py]---
Location: prowler-master/prowler/providers/aws/services/sagemaker/sagemaker_notebook_instance_vpc_settings_configured/sagemaker_notebook_instance_vpc_settings_configured.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.sagemaker.sagemaker_client import sagemaker_client


class sagemaker_notebook_instance_vpc_settings_configured(Check):
    def execute(self):
        findings = []
        for notebook_instance in sagemaker_client.sagemaker_notebook_instances:
            report = Check_Report_AWS(
                metadata=self.metadata(), resource=notebook_instance
            )
            report.status = "PASS"
            report.status_extended = (
                f"Sagemaker notebook instance {notebook_instance.name} is in a VPC."
            )
            if not notebook_instance.subnet_id:
                report.status = "FAIL"
                report.status_extended = f"Sagemaker notebook instance {notebook_instance.name} has VPC settings disabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: sagemaker_training_jobs_intercontainer_encryption_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/sagemaker/sagemaker_training_jobs_intercontainer_encryption_enabled/sagemaker_training_jobs_intercontainer_encryption_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "sagemaker_training_jobs_intercontainer_encryption_enabled",
  "CheckTitle": "Check if Amazon SageMaker Training jobs have intercontainer encryption enabled",
  "CheckType": [],
  "ServiceName": "sagemaker",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:sagemaker:region:account-id:training-job",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "Check if Amazon SageMaker Training jobs have intercontainer encryption enabled",
  "Risk": "If not restricted unintended access could happen.",
  "RelatedUrl": "https://docs.aws.amazon.com/sagemaker/latest/dg/interface-vpc-endpoint.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Internetwork communications support TLS 1.2 encryption between all components and clients.",
      "Url": "https://docs.aws.amazon.com/sagemaker/latest/dg/interface-vpc-endpoint.html"
    }
  },
  "Categories": [
    "encryption",
    "gen-ai"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: sagemaker_training_jobs_intercontainer_encryption_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/sagemaker/sagemaker_training_jobs_intercontainer_encryption_enabled/sagemaker_training_jobs_intercontainer_encryption_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.sagemaker.sagemaker_client import sagemaker_client


class sagemaker_training_jobs_intercontainer_encryption_enabled(Check):
    def execute(self):
        findings = []
        for training_job in sagemaker_client.sagemaker_training_jobs:
            report = Check_Report_AWS(metadata=self.metadata(), resource=training_job)
            report.status = "PASS"
            report.status_extended = f"Sagemaker training job {training_job.name} has intercontainer encryption enabled."
            if not training_job.container_traffic_encryption:
                report.status = "FAIL"
                report.status_extended = f"Sagemaker training job {training_job.name} has intercontainer encryption disabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: sagemaker_training_jobs_network_isolation_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/sagemaker/sagemaker_training_jobs_network_isolation_enabled/sagemaker_training_jobs_network_isolation_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "sagemaker_training_jobs_network_isolation_enabled",
  "CheckTitle": "Check if Amazon SageMaker Training jobs have network isolation enabled",
  "CheckType": [],
  "ServiceName": "sagemaker",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:sagemaker:region:account-id:training-job",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "Check if Amazon SageMaker Training jobs have network isolation enabled",
  "Risk": "This could provide an avenue for unauthorized access to your data.",
  "RelatedUrl": "https://docs.aws.amazon.com/sagemaker/latest/dg/interface-vpc-endpoint.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Restrict which traffic can access by launching Studio in a Virtual Private Cloud (VPC) of your choosing.",
      "Url": "https://docs.aws.amazon.com/sagemaker/latest/dg/interface-vpc-endpoint.html"
    }
  },
  "Categories": ["gen-ai"],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: sagemaker_training_jobs_network_isolation_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/sagemaker/sagemaker_training_jobs_network_isolation_enabled/sagemaker_training_jobs_network_isolation_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.sagemaker.sagemaker_client import sagemaker_client


class sagemaker_training_jobs_network_isolation_enabled(Check):
    def execute(self):
        findings = []
        for training_job in sagemaker_client.sagemaker_training_jobs:
            report = Check_Report_AWS(metadata=self.metadata(), resource=training_job)
            report.status = "PASS"
            report.status_extended = f"Sagemaker training job {training_job.name} has network isolation enabled."
            if not training_job.network_isolation:
                report.status = "FAIL"
                report.status_extended = f"Sagemaker training job {training_job.name} has network isolation disabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: sagemaker_training_jobs_volume_and_output_encryption_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/sagemaker/sagemaker_training_jobs_volume_and_output_encryption_enabled/sagemaker_training_jobs_volume_and_output_encryption_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "sagemaker_training_jobs_volume_and_output_encryption_enabled",
  "CheckTitle": "Check if Amazon SageMaker Training jobs have volume and output with KMS encryption enabled",
  "CheckType": [],
  "ServiceName": "sagemaker",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:sagemaker:region:account-id:training-job",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "Check if Amazon SageMaker Training jobs have volume and output with KMS encryption enabled",
  "Risk": "Data exfiltration could happen if information is not protected. KMS keys provide additional security level to IAM policies.",
  "RelatedUrl": "https://docs.aws.amazon.com/sagemaker/latest/dg/key-management.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Specify AWS KMS keys to use for input and output from S3 and EBS.",
      "Url": "https://docs.aws.amazon.com/sagemaker/latest/dg/key-management.html"
    }
  },
  "Categories": [
    "encryption",
    "gen-ai"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: sagemaker_training_jobs_volume_and_output_encryption_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/sagemaker/sagemaker_training_jobs_volume_and_output_encryption_enabled/sagemaker_training_jobs_volume_and_output_encryption_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.sagemaker.sagemaker_client import sagemaker_client


class sagemaker_training_jobs_volume_and_output_encryption_enabled(Check):
    def execute(self):
        findings = []
        for training_job in sagemaker_client.sagemaker_training_jobs:
            report = Check_Report_AWS(metadata=self.metadata(), resource=training_job)
            report.status = "PASS"
            report.status_extended = f"Sagemaker training job {training_job.name} has KMS encryption enabled."
            if not training_job.volume_kms_key_id:
                report.status = "FAIL"
                report.status_extended = f"Sagemaker training job {training_job.name} has KMS encryption disabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
