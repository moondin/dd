---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 134
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 134 of 867)

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

---[FILE: fedramp_20x_ksi_low_aws.json]---
Location: prowler-master/prowler/compliance/aws/fedramp_20x_ksi_low_aws.json

```json
{
  "Framework": "FedRAMP-20x-KSI-Low",
  "Name": "FedRAMP 20x Key Security Indicators (KSIs) - Low Impact Level v25.05C",
  "Version": "25.05C",
  "Provider": "AWS",
  "Description": "FedRAMP 20x Key Security Indicators (KSIs) Low Impact Level represent core security indicators for cloud service providers, focusing on automation, continuous monitoring, and cloud-native security principles per FedRAMP 20x Phase One pilot requirements for Low impact systems.",
  "Requirements": [
    {
      "Id": "ksi-cmt",
      "Name": "KSI-CMT: Change Management",
      "Description": "A secure cloud service provider will ensure that all system changes are properly documented and configuration baselines are updated accordingly",
      "Attributes": [
        {
          "ItemId": "ksi-cmt",
          "Section": "Change Management",
          "Service": "aws"
        }
      ],
      "Checks": [
        "cloudtrail_multi_region_enabled",
        "cloudtrail_log_file_validation_enabled",
        "cloudtrail_s3_dataevents_read_enabled",
        "cloudtrail_s3_dataevents_write_enabled",
        "cloudwatch_changes_to_network_acls_alarm_configured",
        "cloudwatch_changes_to_network_gateways_alarm_configured",
        "cloudwatch_changes_to_network_route_tables_alarm_configured",
        "cloudwatch_changes_to_vpcs_alarm_configured",
        "cloudwatch_log_metric_filter_and_alarm_for_aws_config_configuration_changes_enabled",
        "cloudwatch_log_metric_filter_and_alarm_for_cloudtrail_configuration_changes_enabled",
        "cloudwatch_log_metric_filter_aws_organizations_changes",
        "cloudwatch_log_metric_filter_for_s3_bucket_policy_changes",
        "cloudwatch_log_metric_filter_policy_changes",
        "cloudwatch_log_metric_filter_security_group_changes",
        "config_recorder_all_regions_enabled",
        "ec2_instance_managed_by_ssm",
        "ec2_instance_older_than_specific_days",
        "ssm_managed_compliant_patching",
        "ssm_managed_instance_compliance_association_compliant",
        "ssm_managed_instance_compliance_patch_compliant"
      ]
    },
    {
      "Id": "ksi-cna",
      "Name": "KSI-CNA: Cloud Native Architecture",
      "Description": "A secure cloud service offering will use cloud native architecture and design principles to enforce and enhance the Confidentiality, Integrity and Availability of the system",
      "Attributes": [
        {
          "ItemId": "ksi-cna",
          "Section": "Cloud Native Architecture",
          "Service": "aws"
        }
      ],
      "Checks": [
        "autoscaling_group_multiple_az",
        "autoscaling_group_multiple_instance_types",
        "autoscaling_group_capacity_rebalance_enabled",
        "dynamodb_tables_pitr_enabled",
        "dynamodb_tables_deletion_protection_enabled",
        "ec2_instance_imdsv2_enabled",
        "ec2_networkacl_allow_ingress_any_port",
        "ec2_securitygroup_default_restrict_traffic",
        "ec2_securitygroup_allow_ingress_from_internet_to_any_port",
        "eks_cluster_network_policy_enabled",
        "eks_cluster_not_publicly_accessible",
        "eks_cluster_private_nodes_enabled",
        "eks_cluster_uses_a_supported_version",
        "elb_cross_zone_load_balancing_enabled",
        "elbv2_alb_multi_az_scheme",
        "elbv2_waf_acl_attached",
        "rds_instance_multi_az",
        "rds_cluster_multi_az",
        "vpc_subnet_auto_assign_public_ip_disabled",
        "vpc_default_security_group_restricts_traffic",
        "vpc_peering_connection_routing_tables_with_least_privilege"
      ]
    },
    {
      "Id": "ksi-iam",
      "Name": "KSI-IAM: Identity and Access Management",
      "Description": "A secure cloud service offering will protect user data, control access, and apply zero trust principles",
      "Attributes": [
        {
          "ItemId": "ksi-iam",
          "Section": "Identity and Access Management",
          "Service": "aws"
        }
      ],
      "Checks": [
        "iam_administrator_access_with_mfa",
        "iam_aws_attached_policy_no_administrative_privileges",
        "iam_customer_attached_policy_no_administrative_privileges",
        "iam_inline_policy_no_administrative_privileges",
        "iam_no_custom_policy_permissive_role_assumption",
        "iam_no_root_access_key",
        "iam_password_policy_expires_passwords_within_90_days_or_less",
        "iam_password_policy_lowercase",
        "iam_password_policy_minimum_length_14",
        "iam_password_policy_number",
        "iam_password_policy_reuse_24",
        "iam_password_policy_symbol",
        "iam_password_policy_uppercase",
        "iam_policy_attached_only_to_group_or_roles",
        "iam_policy_no_full_access_to_cloudtrail",
        "iam_policy_no_full_access_to_kms",
        "iam_root_hardware_mfa_enabled",
        "iam_root_mfa_enabled",
        "iam_rotate_access_key_90_days",
        "iam_user_accesskey_unused",
        "iam_user_console_access_unused",
        "iam_user_hardware_mfa_enabled",
        "iam_user_mfa_enabled_console_access",
        "iam_user_two_active_access_key",
        "organizations_scp_check_deny_regions",
        "organizations_opt_out_ai_services_policy"
      ]
    },
    {
      "Id": "ksi-inr",
      "Name": "KSI-INR: Incident Response",
      "Description": "A secure cloud service offering will respond to incidents according to FedRAMP requirements and cloud service provider policies",
      "Attributes": [
        {
          "ItemId": "ksi-inr",
          "Section": "Incident Response",
          "Service": "aws"
        }
      ],
      "Checks": [
        "guardduty_centrally_managed",
        "guardduty_ec2_malware_protection_enabled",
        "guardduty_eks_audit_log_enabled",
        "guardduty_eks_protection_enabled",
        "guardduty_eks_runtime_monitoring_enabled",
        "guardduty_is_enabled",
        "guardduty_lambda_protection_enabled",
        "guardduty_malware_protection_enabled",
        "guardduty_no_high_severity_findings",
        "guardduty_rds_protection_enabled",
        "guardduty_s3_protection_enabled",
        "inspector2_is_enabled",
        "inspector2_active_findings_exist",
        "securityhub_enabled",
        "sns_topics_kms_encryption_at_rest_enabled"
      ]
    },
    {
      "Id": "ksi-mla",
      "Name": "KSI-MLA: Monitoring, Logging, and Auditing",
      "Description": "A secure cloud service offering will monitor, log, and audit all important events, activity, and changes",
      "Attributes": [
        {
          "ItemId": "ksi-mla",
          "Section": "Monitoring, Logging, and Auditing",
          "Service": "aws"
        }
      ],
      "Checks": [
        "apigateway_restapi_logging_enabled",
        "cloudtrail_cloudwatch_logging_enabled",
        "cloudtrail_kms_encryption_enabled",
        "cloudtrail_log_file_validation_enabled",
        "cloudtrail_multi_region_enabled",
        "cloudtrail_s3_dataevents_read_enabled",
        "cloudtrail_s3_dataevents_write_enabled",
        "cloudwatch_log_group_kms_encryption_enabled",
        "cloudwatch_log_group_retention_policy_specific_days_enabled",
        "ecs_cluster_container_insights_enabled",
        "eks_cluster_control_plane_audit_logging_enabled",
        "elb_logging_enabled",
        "elbv2_logging_enabled",
        "inspector2_is_enabled",
        "opensearch_service_domains_cloudwatch_logging_enabled",
        "rds_instance_enhanced_monitoring_enabled",
        "rds_instance_integration_cloudwatch_logs",
        "redshift_cluster_audit_logging",
        "s3_bucket_server_access_logging_enabled",
        "vpc_flow_logs_enabled",
        "wafv2_webacl_logging_enabled"
      ]
    },
    {
      "Id": "ksi-piy",
      "Name": "KSI-PIY: Policy and Inventory",
      "Description": "A secure cloud service offering will have intentional, organized, universal guidance for how every information resource, including personnel, is secured",
      "Attributes": [
        {
          "ItemId": "ksi-piy",
          "Section": "Policy and Inventory",
          "Service": "aws"
        }
      ],
      "Checks": [
        "config_recorder_all_regions_enabled",
        "config_recorder_using_aws_service_role",
        "ec2_instance_managed_by_ssm",
        "organizations_account_part_of_organizations",
        "organizations_delegated_administrators",
        "organizations_scp_check_deny_regions",
        "organizations_tags_policies_enabled_and_attached",
        "resourceexplorer_indexes_found",
        "ssm_managed_instance_compliance_association_compliant",
        "trustedadvisor_premium_support_plan_subscribed"
      ]
    },
    {
      "Id": "ksi-rpl",
      "Name": "KSI-RPL: Recovery Planning",
      "Description": "A secure cloud service offering will define, maintain, and test incident response plan(s) and recovery capabilities to ensure minimal service disruption and data loss",
      "Attributes": [
        {
          "ItemId": "ksi-rpl",
          "Section": "Recovery Planning",
          "Service": "aws"
        }
      ],
      "Checks": [
        "backup_plans_exist",
        "backup_reportplans_exist",
        "backup_vaults_exist",
        "backup_vaults_encrypted",
        "backup_recovery_point_encrypted",
        "backup_recovery_point_manual_deletion_disabled",
        "backup_recovery_point_minimum_retention_days",
        "dlm_ebs_snapshot_lifecycle_policy_exists",
        "dynamodb_tables_pitr_enabled",
        "dynamodb_tables_deletion_protection_enabled",
        "efs_have_backup_enabled",
        "fsx_file_system_copy_tags_to_backups",
        "rds_instance_backup_enabled",
        "rds_instance_backup_retention_policy",
        "rds_instance_deletion_protection",
        "rds_cluster_deletion_protection",
        "rds_snapshots_encrypted",
        "redshift_cluster_automated_snapshot"
      ]
    },
    {
      "Id": "ksi-svc",
      "Name": "KSI-SVC: Service Configuration",
      "Description": "A secure cloud service offering will follow FedRAMP encryption policies, continuously verify information resource integrity, and restrict access to third-party information resources",
      "Attributes": [
        {
          "ItemId": "ksi-svc",
          "Section": "Service Configuration",
          "Service": "aws"
        }
      ],
      "Checks": [
        "acm_certificates_expiration_check",
        "apigateway_restapi_cache_encrypted",
        "cloudtrail_kms_encryption_enabled",
        "dax_cluster_encryption_enabled",
        "dynamodb_table_encryption_enabled",
        "dynamodb_table_encryption_uses_cmks",
        "ebs_volume_encryption_enabled",
        "ec2_ebs_default_encryption",
        "ec2_instance_ebs_optimized",
        "efs_encryption_at_rest_enabled",
        "eks_cluster_envelope_encryption_enabled",
        "elasticache_redis_cluster_encryption_at_rest_enabled",
        "elasticache_redis_cluster_encryption_at_transit_enabled",
        "elbv2_ssl_listeners",
        "fsx_file_system_encryption_at_rest_enabled",
        "kinesis_stream_encrypted_at_rest",
        "kms_cmk_rotation_enabled",
        "kms_cmk_not_scheduled_for_deletion",
        "kms_key_not_publicly_accessible",
        "rds_instance_storage_encrypted",
        "rds_instance_storage_encrypted_with_cmk",
        "rds_cluster_storage_encrypted",
        "redshift_cluster_encryption_at_rest",
        "redshift_cluster_encryption_in_transit",
        "s3_bucket_server_side_encryption_enabled",
        "s3_bucket_default_encryption",
        "s3_bucket_secure_transport_policy",
        "sagemaker_notebook_instance_encryption_enabled",
        "sns_topics_kms_encryption_at_rest_enabled",
        "sqs_queue_server_side_encryption_enabled"
      ]
    },
    {
      "Id": "ksi-tpr",
      "Name": "KSI-TPR: Third-Party Information Resources",
      "Description": "A secure cloud service offering will understand, monitor, and manage supply chain risks from third-party information resources",
      "Attributes": [
        {
          "ItemId": "ksi-tpr",
          "Section": "Third-Party Information Resources",
          "Service": "aws"
        }
      ],
      "Checks": [
        "ecr_registry_scan_images_on_push_enabled",
        "ecr_repositories_lifecycle_policy_enabled",
        "ecr_repositories_not_publicly_accessible",
        "ecr_repositories_scan_on_push_enabled",
        "ecr_repositories_scan_vulnerabilities_in_latest_image",
        "ecr_repositories_tag_immutability",
        "inspector2_active_findings_exist",
        "inspector2_is_enabled",
        "awslambda_function_using_supported_runtimes",
        "ssm_managed_compliant_patching",
        "trustedadvisor_premium_support_plan_subscribed",
        "guardduty_no_high_severity_findings"
      ]
    },
    {
      "Id": "ksi-iam-07",
      "Name": "KSI-IAM-07: Account Lifecycle Management",
      "Description": "Securely manage the lifecycle and privileges of all accounts, roles, and groups",
      "Attributes": [
        {
          "ItemId": "ksi-iam-07",
          "Section": "Identity and Access Management",
          "Service": "aws"
        }
      ],
      "Checks": [
        "iam_no_root_access_key",
        "iam_policy_attached_only_to_group_or_roles",
        "iam_rotate_access_key_90_days",
        "iam_user_accesskey_unused",
        "iam_user_console_access_unused",
        "organizations_delegated_administrators"
      ]
    },
    {
      "Id": "ksi-mla-07",
      "Name": "KSI-MLA-07: Monitoring and Logging Inventory",
      "Description": "Maintain a list of information resources and event types that will be monitored, logged, and audited",
      "Attributes": [
        {
          "ItemId": "ksi-mla-07",
          "Section": "Monitoring, Logging, and Auditing",
          "Service": "aws"
        }
      ],
      "Checks": [
        "cloudtrail_multi_region_enabled",
        "cloudwatch_log_group_retention_policy_specific_days_enabled",
        "config_recorder_all_regions_enabled",
        "inspector2_is_enabled",
        "resourceexplorer_indexes_found"
      ]
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: fedramp_low_revision_4_aws.json]---
Location: prowler-master/prowler/compliance/aws/fedramp_low_revision_4_aws.json

```json
{
  "Framework": "FedRAMP-Low-Revision-4",
  "Name": "FedRAMP Low Revision 4",
  "Version": "",
  "Provider": "AWS",
  "Description": "The Federal Risk and Authorization Management Program (FedRAMP) was established in 2011. It provides a cost-effective, risk-based approach for the adoption and use of cloud services by the U.S. federal government. FedRAMP empowers federal agencies to use modern cloud technologies, with an emphasis on the security and protection of federal information.",
  "Requirements": [
    {
      "Id": "ac-2",
      "Name": "Account Management (AC-2)",
      "Description": "Manage system accounts, group memberships, privileges, workflow, notifications, deactivations, and authorizations.",
      "Attributes": [
        {
          "ItemId": "ac-2",
          "Section": "Access Control (AC)",
          "Service": "aws"
        }
      ],
      "Checks": [
        "apigateway_restapi_logging_enabled",
        "cloudtrail_multi_region_enabled",
        "cloudtrail_s3_dataevents_read_enabled",
        "cloudtrail_s3_dataevents_write_enabled",
        "cloudtrail_multi_region_enabled",
        "cloudtrail_log_file_validation_enabled",
        "cloudwatch_changes_to_network_acls_alarm_configured",
        "opensearch_service_domains_cloudwatch_logging_enabled",
        "guardduty_is_enabled",
        "iam_password_policy_minimum_length_14",
        "iam_policy_attached_only_to_group_or_roles",
        "iam_aws_attached_policy_no_administrative_privileges",
        "iam_customer_attached_policy_no_administrative_privileges",
        "iam_inline_policy_no_administrative_privileges",
        "iam_root_hardware_mfa_enabled",
        "iam_root_mfa_enabled",
        "iam_no_root_access_key",
        "iam_rotate_access_key_90_days",
        "iam_user_mfa_enabled_console_access",
        "iam_user_hardware_mfa_enabled",
        "iam_user_accesskey_unused",
        "iam_user_console_access_unused",
        "rds_instance_integration_cloudwatch_logs",
        "redshift_cluster_audit_logging",
        "s3_bucket_server_access_logging_enabled",
        "securityhub_enabled"
      ]
    },
    {
      "Id": "ac-3",
      "Name": "Account Management (AC-3)",
      "Description": "The information system enforces approved authorizations for logical access to information and system resources in accordance with applicable access control policies.",
      "Attributes": [
        {
          "ItemId": "ac-3",
          "Section": "Access Control (AC)",
          "Service": "aws"
        }
      ],
      "Checks": [
        "ec2_ebs_public_snapshot",
        "ec2_instance_public_ip",
        "ec2_instance_imdsv2_enabled",
        "emr_cluster_master_nodes_no_public_ip",
        "iam_policy_attached_only_to_group_or_roles",
        "iam_aws_attached_policy_no_administrative_privileges",
        "iam_customer_attached_policy_no_administrative_privileges",
        "iam_inline_policy_no_administrative_privileges",
        "iam_no_root_access_key",
        "iam_user_accesskey_unused",
        "iam_user_console_access_unused",
        "awslambda_function_not_publicly_accessible",
        "awslambda_function_url_public",
        "rds_instance_no_public_access",
        "rds_snapshots_public_access",
        "redshift_cluster_public_access",
        "s3_bucket_policy_public_write_access",
        "s3_account_level_public_access_blocks",
        "s3_bucket_public_access",
        "sagemaker_notebook_instance_without_direct_internet_access_configured"
      ]
    },
    {
      "Id": "ac-17",
      "Name": "Remote Access (AC-17)",
      "Description": "Authorize remote access systems prior to connection. Enforce remote connection requirements to information systems.",
      "Attributes": [
        {
          "ItemId": "ac-17",
          "Section": "Access Control (AC)",
          "Service": "aws"
        }
      ],
      "Checks": [
        "acm_certificates_expiration_check",
        "ec2_ebs_public_snapshot",
        "ec2_instance_public_ip",
        "elb_ssl_listeners",
        "emr_cluster_master_nodes_no_public_ip",
        "guardduty_is_enabled",
        "awslambda_function_not_publicly_accessible",
        "awslambda_function_url_public",
        "rds_instance_no_public_access",
        "rds_snapshots_public_access",
        "redshift_cluster_public_access",
        "s3_bucket_secure_transport_policy",
        "s3_bucket_policy_public_write_access",
        "s3_account_level_public_access_blocks",
        "s3_bucket_public_access",
        "sagemaker_notebook_instance_without_direct_internet_access_configured",
        "securityhub_enabled",
        "ec2_securitygroup_default_restrict_traffic",
        "ec2_networkacl_allow_ingress_any_port",
        "ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_22",
        "ec2_networkacl_allow_ingress_any_port"
      ]
    },
    {
      "Id": "au-2",
      "Name": "Audit Events (AU-2)",
      "Description": "The organization: a. Determines that the information system is capable of auditing the following events: [Assignment: organization-defined auditable events]; b. Coordinates the security audit function with other organizational entities requiring audit- related information to enhance mutual support and to help guide the selection of auditable events; c. Provides a rationale for why the auditable events are deemed to be adequate support after- the-fact investigations of security incidents",
      "Attributes": [
        {
          "ItemId": "au-2",
          "Section": "Audit and Accountability (AU)",
          "Service": "aws"
        }
      ],
      "Checks": [
        "apigateway_restapi_logging_enabled",
        "cloudtrail_multi_region_enabled",
        "cloudtrail_s3_dataevents_read_enabled",
        "cloudtrail_s3_dataevents_write_enabled",
        "cloudtrail_multi_region_enabled",
        "cloudtrail_log_file_validation_enabled",
        "elbv2_logging_enabled",
        "rds_instance_integration_cloudwatch_logs",
        "redshift_cluster_audit_logging",
        "s3_bucket_server_access_logging_enabled",
        "vpc_flow_logs_enabled"
      ]
    },
    {
      "Id": "au-9",
      "Name": "Protection of Audit Information (AU-9)",
      "Description": "The information system protects audit information and audit tools from unauthorized access, modification, and deletion.",
      "Attributes": [
        {
          "ItemId": "au-9",
          "Section": "Audit and Accountability (AU)",
          "Service": "aws"
        }
      ],
      "Checks": [
        "cloudtrail_kms_encryption_enabled",
        "cloudtrail_log_file_validation_enabled",
        "cloudwatch_log_group_kms_encryption_enabled",
        "s3_bucket_object_versioning"
      ]
    },
    {
      "Id": "au-11",
      "Name": "Audit Record Retention (AU-11)",
      "Description": "The organization retains audit records for at least 90 days to provide support for after-the-fact investigations of security incidents and to meet regulatory and organizational information retention requirements.",
      "Attributes": [
        {
          "ItemId": "au-11",
          "Section": "Audit and Accountability (AU)",
          "Service": "aws"
        }
      ],
      "Checks": [
        "cloudwatch_log_group_retention_policy_specific_days_enabled"
      ]
    },
    {
      "Id": "ca-7",
      "Name": "Continuous Monitoring (CA-7)",
      "Description": "Continuously monitor configuration management processes. Determine security impact, environment and operational risks.",
      "Attributes": [
        {
          "ItemId": "ca-7",
          "Section": "Security Assessment And Authorization (CA)",
          "Service": "aws"
        }
      ],
      "Checks": [
        "cloudtrail_multi_region_enabled",
        "cloudtrail_s3_dataevents_read_enabled",
        "cloudtrail_s3_dataevents_write_enabled",
        "cloudtrail_multi_region_enabled",
        "cloudwatch_changes_to_network_acls_alarm_configured",
        "ec2_instance_imdsv2_enabled",
        "elbv2_waf_acl_attached",
        "guardduty_is_enabled",
        "rds_instance_enhanced_monitoring_enabled",
        "redshift_cluster_audit_logging",
        "securityhub_enabled"
      ]
    },
    {
      "Id": "cm-2",
      "Name": "Baseline Configuration (CM-2)",
      "Description": "The organization develops, documents, and maintains under configuration control, a current baseline configuration of the information system.",
      "Attributes": [
        {
          "ItemId": "cm-2",
          "Section": "Configuration Management (CM)",
          "Service": "aws"
        }
      ],
      "Checks": [
        "apigateway_restapi_waf_acl_attached",
        "ec2_ebs_public_snapshot",
        "ec2_instance_public_ip",
        "ec2_instance_older_than_specific_days",
        "elbv2_deletion_protection",
        "emr_cluster_master_nodes_no_public_ip",
        "awslambda_function_not_publicly_accessible",
        "awslambda_function_url_public",
        "rds_instance_no_public_access",
        "rds_snapshots_public_access",
        "redshift_cluster_public_access",
        "s3_bucket_public_access",
        "s3_bucket_policy_public_write_access",
        "s3_account_level_public_access_blocks",
        "s3_bucket_public_access",
        "sagemaker_notebook_instance_without_direct_internet_access_configured",
        "ssm_managed_compliant_patching",
        "ec2_securitygroup_default_restrict_traffic",
        "ec2_networkacl_allow_ingress_any_port",
        "ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_22",
        "ec2_networkacl_allow_ingress_any_port"
      ]
    },
    {
      "Id": "cm-8",
      "Name": "Information System Component Inventory (CM-8)",
      "Description": "The organization develops and documents an inventory of information system components that accurately reflects the current information system, includes all components within the authorization boundary of the information system, is at the level of granularity deemed necessary for tracking and reporting and reviews and updates the information system component inventory.",
      "Attributes": [
        {
          "ItemId": "cm-8",
          "Section": "Configuration Management (CM)",
          "Service": "aws"
        }
      ],
      "Checks": [
        "ec2_instance_managed_by_ssm",
        "guardduty_is_enabled",
        "ssm_managed_compliant_patching",
        "ssm_managed_compliant_patching"
      ]
    },
    {
      "Id": "cp-9",
      "Name": "Information System Backup (CP-9)",
      "Description": "The organization conducts backups of user-level information, system-level information and information system documentation including security-related documentation contained in the information system and protects the confidentiality, integrity, and availability of backup information at storage locations.",
      "Attributes": [
        {
          "ItemId": "cp-9",
          "Section": "Contingency Planning (CP)",
          "Service": "aws"
        }
      ],
      "Checks": [
        "dynamodb_tables_pitr_enabled",
        "dynamodb_tables_pitr_enabled",
        "efs_have_backup_enabled",
        "rds_instance_backup_enabled",
        "rds_instance_backup_enabled",
        "redshift_cluster_automated_snapshot",
        "s3_bucket_object_versioning"
      ]
    },
    {
      "Id": "cp-10",
      "Name": "Information System Recovery And Reconstitution (CP-10)",
      "Description": "The organization provides for the recovery and reconstitution of the information system to a known state after a disruption, compromise, or failure.",
      "Attributes": [
        {
          "ItemId": "cp-10",
          "Section": "Contingency Planning (CP)",
          "Service": "aws"
        }
      ],
      "Checks": [
        "dynamodb_tables_pitr_enabled",
        "dynamodb_tables_pitr_enabled",
        "efs_have_backup_enabled",
        "elbv2_deletion_protection",
        "rds_instance_backup_enabled",
        "rds_instance_multi_az",
        "rds_instance_backup_enabled",
        "redshift_cluster_automated_snapshot",
        "s3_bucket_object_versioning"
      ]
    },
    {
      "Id": "ia-2",
      "Name": "Identification and Authentication (Organizational users) (IA-2)",
      "Description": "The information system uniquely identifies and authenticates organizational users (or processes acting on behalf of organizational users).",
      "Attributes": [
        {
          "ItemId": "ia-2",
          "Section": "Identification and Authentication (IA)",
          "Service": "aws"
        }
      ],
      "Checks": [
        "iam_password_policy_minimum_length_14",
        "iam_root_hardware_mfa_enabled",
        "iam_root_mfa_enabled",
        "iam_no_root_access_key",
        "iam_user_mfa_enabled_console_access",
        "iam_user_mfa_enabled_console_access"
      ]
    },
    {
      "Id": "ir-4",
      "Name": "Incident Handling (IR-4)",
      "Description": "The organization implements an incident handling capability for security incidents that includes preparation, detection and analysis, containment, eradication, and recovery, coordinates incident handling activities with contingency planning activities and incorporates lessons learned from ongoing incident handling activities into incident response procedures, training, and testing, and implements the resulting changes accordingly.",
      "Attributes": [
        {
          "ItemId": "ir-4",
          "Section": "Incident Response (IR)",
          "Service": "aws"
        }
      ],
      "Checks": [
        "cloudwatch_changes_to_network_acls_alarm_configured",
        "cloudwatch_changes_to_network_gateways_alarm_configured",
        "cloudwatch_changes_to_network_route_tables_alarm_configured",
        "cloudwatch_changes_to_vpcs_alarm_configured",
        "guardduty_is_enabled",
        "guardduty_no_high_severity_findings",
        "securityhub_enabled"
      ]
    },
    {
      "Id": "sa-3",
      "Name": "System Development Life Cycle (SA-3)",
      "Description": "The organization manages the information system using organization-defined system development life cycle, defines and documents information security roles and responsibilities throughout the system development life cycle, identifies individuals having information security roles and responsibilities and integrates the organizational information security risk management process into system development life cycle activities.",
      "Attributes": [
        {
          "ItemId": "sa-3",
          "Section": "System and Services Acquisition (SA)",
          "Service": "aws"
        }
      ],
      "Checks": [
        "ec2_instance_managed_by_ssm"
      ]
    },
    {
      "Id": "sc-5",
      "Name": "Denial Of Service Protection (SC-5)",
      "Description": "The information system protects against or limits the effects of the following types of denial of service attacks: [Assignment: organization-defined types of denial of service attacks or references to sources for such information] by employing [Assignment: organization-defined security safeguards].",
      "Attributes": [
        {
          "ItemId": "sc-5",
          "Section": "System and Communications Protection (SC)",
          "Service": "aws"
        }
      ],
      "Checks": [
        "dynamodb_tables_pitr_enabled",
        "elbv2_deletion_protection",
        "guardduty_is_enabled",
        "rds_instance_backup_enabled",
        "rds_instance_deletion_protection",
        "rds_instance_multi_az",
        "redshift_cluster_automated_snapshot",
        "s3_bucket_object_versioning"
      ]
    },
    {
      "Id": "sc-7",
      "Name": "Boundary Protection (SC-7)",
      "Description": "The information system: a. Monitors and controls communications at the external boundary of the system and at key internal boundaries within the system; b. Implements subnetworks for publicly accessible system components that are [Selection: physically; logically] separated from internal organizational networks; and c. Connects to external networks or information systems only through managed interfaces consisting of boundary protection devices arranged in accordance with an organizational security architecture.",
      "Attributes": [
        {
          "ItemId": "sc-7",
          "Section": "System and Communications Protection (SC)",
          "Service": "aws"
        }
      ],
      "Checks": [
        "ec2_ebs_public_snapshot",
        "ec2_instance_public_ip",
        "elbv2_waf_acl_attached",
        "elb_ssl_listeners",
        "emr_cluster_master_nodes_no_public_ip",
        "opensearch_service_domains_node_to_node_encryption_enabled",
        "awslambda_function_not_publicly_accessible",
        "awslambda_function_url_public",
        "rds_instance_no_public_access",
        "rds_snapshots_public_access",
        "redshift_cluster_public_access",
        "s3_bucket_secure_transport_policy",
        "s3_bucket_public_access",
        "s3_bucket_policy_public_write_access",
        "s3_account_level_public_access_blocks",
        "s3_bucket_public_access",
        "sagemaker_notebook_instance_without_direct_internet_access_configured",
        "ec2_securitygroup_default_restrict_traffic",
        "ec2_networkacl_allow_ingress_any_port",
        "ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_22",
        "ec2_networkacl_allow_ingress_any_port"
      ]
    },
    {
      "Id": "sc-12",
      "Name": "Cryptographic Key Establishment And Management (SC-12)",
      "Description": "The organization establishes and manages cryptographic keys for required cryptography employed within the information system in accordance with [Assignment: organization-defined requirements for key generation, distribution, storage, access, and destruction].",
      "Attributes": [
        {
          "ItemId": "sc-12",
          "Section": "System and Communications Protection (SC)",
          "Service": "aws"
        }
      ],
      "Checks": [
        "acm_certificates_expiration_check",
        "kms_cmk_rotation_enabled"
      ]
    },
    {
      "Id": "sc-13",
      "Name": "Use of Cryptography (SC-13)",
      "Description": "The information system implements FIPS-validated or NSA-approved cryptography in accordance with applicable federal laws, Executive Orders, directives, policies, regulations, and standards.",
      "Attributes": [
        {
          "ItemId": "sc-13",
          "Section": "System and Communications Protection (SC)",
          "Service": "aws"
        }
      ],
      "Checks": [
        "s3_bucket_default_encryption",
        "sagemaker_training_jobs_volume_and_output_encryption_enabled",
        "sagemaker_notebook_instance_encryption_enabled",
        "sns_topics_kms_encryption_at_rest_enabled"
      ]
    }
  ]
}
```

--------------------------------------------------------------------------------

````
