---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 414
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 414 of 867)

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

---[FILE: custom_checks_metadata_example.yaml]---
Location: prowler-master/tests/lib/check/fixtures/custom_checks_metadata_example.yaml

```yaml
CustomChecksMetadata:
  aws:
    Checks:
      s3_bucket_level_public_access_block:
        Severity: high
        CheckTitle: S3 Bucket Level Public Access Block
        Description: This check ensures that the S3 bucket level public access block is enabled.
        Risk: This check is important because it ensures that the S3 bucket level public access block is enabled.
        RelatedUrl: https://docs.aws.amazon.com/AmazonS3/latest/dev/access-control-block-public-access.html
        Remediation:
          Code:
            CLI: aws s3api put-public-access-block --bucket <bucket-name> --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
            NativeIaC: https://aws.amazon.com/es/s3/features/block-public-access/
            Other: https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html
            Terraform: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_public_access_block
          Recommendation:
            Text: Enable the S3 bucket level public access block.
            Url: https://docs.aws.amazon.com/AmazonS3/latest/dev/access-control-block-public-access.html
      s3_bucket_no_mfa_delete:
        Severity: high
        CheckTitle: S3 Bucket No MFA Delete
        Description: This check ensures that the S3 bucket does not allow delete operations without MFA.
        Risk: This check is important because it ensures that the S3 bucket does not allow delete operations without MFA.
        RelatedUrl: https://docs.aws.amazon.com/AmazonS3/latest/dev/Versioning.html
        Remediation:
          Code:
            CLI: aws s3api put-bucket-versioning --bucket <bucket-name> --versioning-configuration Status=Enabled
            NativeIaC: https://aws.amazon.com/es/s3/features/versioning/
            Other: https://docs.aws.amazon.com/AmazonS3/latest/dev/Versioning.html
            Terraform: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_versioning
          Recommendation:
            Text: Enable versioning on the S3 bucket.
            Url: https://docs.aws.amazon.com/AmazonS3/latest/dev/Versioning.html
  azure:
    Checks:
      storage_infrastructure_encryption_is_enabled:
        Severity: medium
        CheckTitle: Storage Infrastructure Encryption Is Enabled
        Description: This check ensures that storage infrastructure encryption is enabled.
        Risk: This check is important because it ensures that storage infrastructure encryption is enabled.
        RelatedUrl: https://docs.microsoft.com/en-us/azure/storage/common/storage-service-encryption
        Remediation:
          Code:
            CLI: az storage account update --name <storage-account-name> --resource-group <resource-group-name> --set properties.encryption.services.blob.enabled=true properties.encryption.services.file.enabled=true properties.encryption.services.queue.enabled=true properties.encryption.services.table.enabled=true
            NativeIaC: https://docs.microsoft.com/en-us/azure/templates/microsoft.storage/storageaccounts
            Other: https://docs.microsoft.com/en-us/azure/storage/common/storage-service-encryption
            Terraform: https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/storage_account
          Recommendation:
            Text: Enable storage infrastructure encryption.
            Url: https://docs.microsoft.com/en-us/azure/storage/common/storage-service-encryption
  gcp:
    Checks:
      compute_instance_public_ip:
        Severity: critical
        CheckTitle: Compute Instance Public IP
        Description: This check ensures that the compute instance does not have a public IP.
        Risk: This check is important because it ensures that the compute instance does not have a public IP.
        RelatedUrl: https://cloud.google.com/compute/docs/ip-addresses/reserve-static-external-ip-address
        Remediation:
          Code:
            CLI: gcloud compute instances describe INSTANCE_NAME --zone=ZONE
            NativeIaC: https://cloud.google.com/compute/docs/reference/rest/v1/instances
            Other: https://cloud.google.com/compute/docs/ip-addresses/reserve-static-external-ip-address
            Terraform: https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_instance
          Recommendation:
            Text: Remove the public IP from the compute instance.
            Url: https://cloud.google.com/compute/docs/ip-addresses/reserve-static-external-ip-address
  kubernetes:
    Checks:
      apiserver_anonymous_requests:
        Severity: low
        CheckTitle: APIServer Anonymous Requests
        Description: This check ensures that anonymous requests to the APIServer are disabled.
        Risk: This check is important because it ensures that anonymous requests to the APIServer are disabled.
        RelatedUrl: https://kubernetes.io/docs/reference/access-authn-authz/authentication/
        Remediation:
          Code:
            CLI: --anonymous-auth=false
            NativeIaC: https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-anonymous-auth-argument-is-set-to-false-1#kubernetes
            Other: https://kubernetes.io/docs/reference/access-authn-authz/authentication/
            Terraform: https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs/resources/cluster_role_binding
          Recommendation:
            Text: Disable anonymous requests to the APIServer.
            Url: https://kubernetes.io/docs/reference/access-authn-authz/authentication/
```

--------------------------------------------------------------------------------

---[FILE: custom_checks_metadata_example_not_valid.yaml]---
Location: prowler-master/tests/lib/check/fixtures/custom_checks_metadata_example_not_valid.yaml

```yaml
CustomChecksMetadata:
  aws:
    Check:
      s3_bucket_level_public_access_block:
        Severity: high
```

--------------------------------------------------------------------------------

---[FILE: groupsA.json]---
Location: prowler-master/tests/lib/check/fixtures/groupsA.json

```json
{
  "aws": {
    "gdpr": {
      "checks": [
        "check11",
        "check12"
      ],
      "description": "GDPR Readiness"
    },
    "iam": {
      "checks": [
        "iam_user_accesskey_unused",
        "iam_user_console_access_unused"
      ],
      "description": "Identity and Access Management"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: metadata.json]---
Location: prowler-master/tests/lib/check/fixtures/metadata.json

```json
{
  "Categories": [
    "cat-one",
    "cat-two"
  ],
  "CheckID": "iam_user_accesskey_unused",
  "CheckTitle": "Ensure Access Keys unused are disabled",
  "CheckType": [
    "Software and Configuration Checks"
  ],
  "Compliance": [
    {
      "Control": [
        "4.4"
      ],
      "Framework": "CIS-AWS",
      "Group": [
        "level1",
        "level2"
      ],
      "Version": "1.4"
    }
  ],
  "DependsOn": [
    "othercheck1",
    "othercheck2"
  ],
  "Description": "Ensure Access Keys unused are disabled",
  "Notes": "additional information",
  "Provider": "aws",
  "RelatedTo": [
    "othercheck3",
    "othercheck4"
  ],
  "RelatedUrl": "https://serviceofficialsiteorpageforthissubject",
  "Remediation": {
    "Code": {
      "CLI": "cli command or URL to the cli command location.",
      "NativeIaC": "code or URL to the code location.",
      "Other": "cli command or URL to the cli command location.",
      "Terraform": "code or URL to the code location."
    },
    "Recommendation": {
      "Text": "Run sudo yum update and cross your fingers and toes.",
      "Url": "https://myfp.com/recommendations/dangerous_things_and_how_to_fix_them.html"
    }
  },
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "ResourceType": "AwsIamAccessAnalyzer",
  "Risk": "Risk associated.",
  "ServiceName": "iam",
  "Severity": "low",
  "SubServiceName": "accessanalyzer",
  "Tags": {
    "Tag1Key": "value",
    "Tag2Key": "value"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: cis_v1.4_aws.json]---
Location: prowler-master/tests/lib/check/fixtures/aws/cis_v1.4_aws.json

```json
{
  "Framework": "CIS",
  "Provider": "AWS",
  "Version": "1.4",
  "Requirements": [
    {
      "Id": "1.4",
      "Description": "Ensure no 'root' user account access key exists (Automated)",
      "Attributes": [
        {
          "Section": "1. Identity and Access Management (IAM)",
          "Level": [
            "level1"
          ],
          "Rationale": "Removing access keys associated with the 'root' user account limits vectors by which the account can be compromised. Additionally, removing the 'root' access keys encourages the creation and use of role based accounts that are least privileged.",
          "Guidance": "The 'root' user account is the most privileged user in an AWS account. AWS Access Keys provide programmatic access to a given AWS account. It is recommended that all access keys associated with the 'root' user account be removed.",
          "Additional information": "IAM User account \"root\" for us-gov cloud regions is not enabled by default. However, on request to AWS support enables 'root' access only through access-keys (CLI, API methods) for us-gov cloud region.",
          "References": [
            "CCE-78910-7",
            "https://docs.aws.amazon.com/general/latest/gr/aws-access-keys-best-practices.html",
            "https://docs.aws.amazon.com/general/latest/gr/managing-aws-access-keys.html",
            "https://docs.aws.amazon.com/IAM/latest/APIReference/API_GetAccountSummary.html",
            "https://aws.amazon.com/blogs/security/an-easier-way-to-determine-the-presence-of-aws-account-access-keys/"
          ]
        }
      ],
      "Checks": [
        "iam_avoid_root_usage"
      ]
    },
    {
      "Id": "1.10",
      "Description": "Ensure multi-factor authentication (MFA) is enabled for all IAM users that have a console password (Automated)",
      "Attributes": [
        {
          "Section": "1. Identity and Access Management (IAM)",
          "Level": [
            "level1"
          ],
          "Guidance": "Multi-Factor Authentication (MFA) adds an extra layer of authentication assurance beyond traditional credentials. With MFA enabled, when a user signs in to the AWS Console, they will be prompted for their user name and password as well as for an authentication code from their physical or virtual MFA token. It is recommended that MFA be enabled for all accounts that have a console password.",
          "Rationale": "Enabling MFA provides increased security for console access as it requires the authenticating principal to possess a device that displays a time-sensitive key and have knowledge of a credential.",
          "Impact": "AWS will soon end support for SMS multi-factor authentication (MFA). New customers are not allowed to use this feature. We recommend that existing customers switch to one of the following alternative methods of MFA.",
          "Additional information": "Forced IAM User Self-Service Remediation. Amazon has published a pattern that forces users to self-service setup MFA before they have access to their complete permissions set. Until they complete this step, they cannot access their full permissions. This pattern can be used on new AWS accounts. It can also be used on existing accounts - it is recommended users are given instructions and a grace period to accomplish MFA enrollment before active enforcement on existing AWS accounts.",
          "References": [
            "CCE-78901-6",
            "https://tools.ietf.org/html/rfc6238",
            "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa.html",
            "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#enable-mfa-for-privileged-users",
            "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa_enable_virtual.html",
            "https://blogs.aws.amazon.com/security/post/Tx2SJJYE082KBUK/How-to-Delegate-Management-of-Multi-Factor-Authentication-to-AWS-IAM-Users"
          ]
        }
      ],
      "Checks": [
        "iam_user_mfa_enabled_console_access"
      ]
    },
    {
      "Id": "2.1.1",
      "Description": "Ensure all S3 buckets employ encryption-at-rest (Automated)",
      "Attributes": [
        {
          "Section": "2. Storage",
          "Level": [
            "level2"
          ],
          "Guidance": "Amazon S3 provides a variety of no, or low, cost encryption options to protect data at rest.",
          "Rationale": "Encrypting data at rest reduces the likelihood that it is unintentionally exposed and can nullify the impact of disclosure if the encryption remains unbroken.",
          "Impact": "Amazon S3 buckets with default bucket encryption using SSE-KMS cannot be used as destination buckets for Amazon S3 server access logging. Only SSE-S3 default encryption is supported for server access log destination buckets.",
          "Additional information": "S3 bucket encryption only applies to objects as they are placed in the bucket. Enabling S3 bucket encryption does not encrypt objects previously stored within the bucket",
          "References": [
            "https://docs.aws.amazon.com/AmazonS3/latest/user-guide/default-bucket-encryption.html",
            "https://docs.aws.amazon.com/AmazonS3/latest/dev/bucket-encryption.html#bucket-encryption-related-resources"
          ]
        }
      ],
      "Checks": [
        "s3_bucket_default_encryption"
      ]
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: ens_v3_aws.json]---
Location: prowler-master/tests/lib/check/fixtures/aws/ens_v3_aws.json

```json
{
  "Framework": "ENS",
  "Version": "3",
  "Requirements": [
    {
      "Id": "op.mon.1",
      "Description": "Detección de intrusión",
      "Attributes": [
        {
          "Marco": "operacional",
          "Categoria": "monitorización del sistema",
          "Descripcion_Control": "- En ausencia de otras herramientas de terceros, habilitar Amazon GuarDuty para la detección de amenazas e intrusiones..- Activar el servicio de eventos AWS CloudTrail para todas las regiones..- Activar el servicio VPC FlowLogs..-Deberá habilitarse Amazon GuardDuty para todas las regiones tanto en la cuenta raíz como en las cuentas miembro de un entorno multi-cuenta..-Todas las cuentas miembro deberán estar añadidas para la supervisión bajo la cuenta raíz..-La adminsitración de Amazon GuardDuty quedará delegada exclusivamente a la cuenta de seguridad para garantizar una correcta asignación de los roles para este servicio.",
          "Nivel": [
            "bajo",
            "medio",
            "alto"
          ],
          "Dimensiones": [
            "confidencialidad",
            "integridad",
            "trazabilidad",
            "autenticidad",
            "disponibilidad"
          ]
        }
      ],
      "Checks": [
        "guardduty_is_enabled",
        "cloudtrail_multi_region_enabled",
        "vpc_flow_logs_enabled",
        "guardduty_is_enabled"
      ]
    },
    {
      "Id": "op.mon.3",
      "Description": "Protección de la integridad y de la autenticidad",
      "Attributes": [
        {
          "Marco": "operacional",
          "Categoria": "protección de las comunicaciones",
          "Descripcion_Control": "- Habilitar TLS en los balanceadores de carga ELB.- Evitar el uso de protocolos de cifrado inseguros en la conexión TLS entre clientes y balanceadores de carga.- Asegurar que los Buckets de almacenamiento S3 apliquen cifrado para la transferencia de datos empleando TLS.- Asegurar que la distribución entre frontales CloudFront y sus orígenes únicamente emplee tráfico HTTPS.",
          "Nivel": [
            "bajo",
            "medio",
            "alto"
          ],
          "Dimensiones": [
            "integridad",
            "autenticidad"
          ]
        }
      ],
      "Checks": [
        "ec2_elbv2_insecure_ssl_ciphers",
        "ec2_elbv2_insecure_ssl_ciphers",
        "s3_bucket_secure_transport_policy",
        "cloudfront_distributions_https_enabled"
      ]
    },
    {
      "Id": "mp.si.2.r2.1",
      "Description": "Copias de seguridad",
      "Attributes": [
        {
          "Marco": "medidas de protección",
          "Categoria": "protección de los soportes de información",
          "Descripcion_Control": "Se deberá asegurar el cifrado de las copias de seguridad de EBS.",
          "Nivel": [
            "alto"
          ],
          "Dimensiones": [
            "confidencialidad",
            "integridad"
          ]
        }
      ],
      "Checks": [
        "ec2_ebs_snapshot_encryption"
      ]
    }
  ]
}
```

--------------------------------------------------------------------------------

````
