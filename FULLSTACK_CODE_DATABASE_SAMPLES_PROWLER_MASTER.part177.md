---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 177
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 177 of 867)

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

---[FILE: fedramp_20x_ksi_low_gcp.json]---
Location: prowler-master/prowler/compliance/gcp/fedramp_20x_ksi_low_gcp.json

```json
{
  "Framework": "FedRAMP-20x-KSI-Low",
  "Name": "FedRAMP 20x Key Security Indicators (KSIs) - Low Impact Level v25.05C",
  "Version": "25.05C",
  "Provider": "GCP",
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
          "Service": "gcp"
        }
      ],
      "Checks": [
        "iam_audit_logs_enabled",
        "iam_cloud_asset_inventory_enabled",
        "logging_log_metric_filter_and_alert_for_audit_configuration_changes_enabled",
        "logging_log_metric_filter_and_alert_for_bucket_permission_changes_enabled",
        "logging_log_metric_filter_and_alert_for_custom_role_changes_enabled",
        "logging_log_metric_filter_and_alert_for_project_ownership_changes_enabled",
        "logging_log_metric_filter_and_alert_for_sql_instance_configuration_changes_enabled",
        "logging_log_metric_filter_and_alert_for_vpc_firewall_rule_changes_enabled",
        "logging_log_metric_filter_and_alert_for_vpc_network_changes_enabled",
        "logging_log_metric_filter_and_alert_for_vpc_network_route_changes_enabled",
        "compute_instance_serial_ports_in_use",
        "compute_project_os_login_enabled"
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
          "Service": "gcp"
        }
      ],
      "Checks": [
        "cloudsql_instance_private_ip_assignment",
        "cloudsql_instance_public_access",
        "cloudsql_instance_public_ip",
        "cloudstorage_bucket_uniform_bucket_level_access",
        "compute_firewall_rdp_access_from_the_internet_allowed",
        "compute_firewall_ssh_access_from_the_internet_allowed",
        "compute_instance_block_project_wide_ssh_keys_disabled",
        "compute_instance_confidential_computing_enabled",
        "compute_instance_ip_forwarding_is_enabled",
        "compute_instance_public_ip",
        "compute_instance_shielded_vm_enabled",
        "compute_loadbalancer_logging_enabled",
        "compute_network_default_in_use",
        "compute_network_dns_logging_enabled",
        "compute_network_not_legacy",
        "compute_subnet_flow_logs_enabled",
        "gke_cluster_no_default_service_account"
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
          "Service": "gcp"
        }
      ],
      "Checks": [
        "apikeys_api_restrictions_configured",
        "apikeys_key_exists",
        "apikeys_key_rotated_in_90_days",
        "compute_instance_default_service_account_in_use",
        "compute_instance_default_service_account_in_use_with_full_api_access",
        "iam_no_service_roles_at_project_level",
        "iam_role_kms_enforce_separation_of_duties",
        "iam_role_sa_enforce_separation_of_duties",
        "iam_sa_no_administrative_privileges",
        "iam_sa_no_user_managed_keys",
        "iam_sa_user_managed_key_rotate_90_days",
        "iam_sa_user_managed_key_unused",
        "iam_service_account_unused"
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
          "Service": "gcp"
        }
      ],
      "Checks": [
        "iam_organization_essential_contacts_configured",
        "iam_account_access_approval_enabled",
        "logging_log_metric_filter_and_alert_for_audit_configuration_changes_enabled",
        "logging_log_metric_filter_and_alert_for_bucket_permission_changes_enabled",
        "logging_log_metric_filter_and_alert_for_custom_role_changes_enabled",
        "logging_log_metric_filter_and_alert_for_project_ownership_changes_enabled",
        "logging_log_metric_filter_and_alert_for_sql_instance_configuration_changes_enabled",
        "logging_log_metric_filter_and_alert_for_vpc_firewall_rule_changes_enabled",
        "logging_log_metric_filter_and_alert_for_vpc_network_changes_enabled",
        "logging_log_metric_filter_and_alert_for_vpc_network_route_changes_enabled"
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
          "Service": "gcp"
        }
      ],
      "Checks": [
        "cloudsql_instance_postgres_enable_pgaudit_flag",
        "cloudsql_instance_postgres_log_connections_flag",
        "cloudsql_instance_postgres_log_disconnections_flag",
        "cloudsql_instance_postgres_log_error_verbosity_flag",
        "cloudsql_instance_postgres_log_min_duration_statement_flag",
        "cloudsql_instance_postgres_log_min_error_statement_flag",
        "cloudsql_instance_postgres_log_min_messages_flag",
        "cloudsql_instance_postgres_log_statement_flag",
        "cloudsql_instance_sqlserver_trace_flag",
        "cloudstorage_bucket_log_retention_policy_lock",
        "compute_loadbalancer_logging_enabled",
        "compute_network_dns_logging_enabled",
        "compute_subnet_flow_logs_enabled",
        "iam_audit_logs_enabled",
        "logging_log_metric_filter_and_alert_for_audit_configuration_changes_enabled",
        "logging_log_metric_filter_and_alert_for_bucket_permission_changes_enabled",
        "logging_log_metric_filter_and_alert_for_custom_role_changes_enabled",
        "logging_log_metric_filter_and_alert_for_project_ownership_changes_enabled",
        "logging_log_metric_filter_and_alert_for_sql_instance_configuration_changes_enabled",
        "logging_log_metric_filter_and_alert_for_vpc_firewall_rule_changes_enabled",
        "logging_log_metric_filter_and_alert_for_vpc_network_changes_enabled",
        "logging_log_metric_filter_and_alert_for_vpc_network_route_changes_enabled",
        "logging_sink_created"
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
          "Service": "gcp"
        }
      ],
      "Checks": [
        "iam_cloud_asset_inventory_enabled",
        "iam_organization_essential_contacts_configured",
        "iam_audit_logs_enabled",
        "compute_project_os_login_enabled",
        "compute_instance_serial_ports_in_use",
        "compute_instance_block_project_wide_ssh_keys_disabled",
        "logging_sink_created"
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
          "Service": "gcp"
        }
      ],
      "Checks": [
        "cloudsql_instance_automated_backups",
        "cloudstorage_bucket_log_retention_policy_lock",
        "cloudstorage_bucket_versioning_enabled",
        "cloudstorage_bucket_lifecycle_management_enabled"
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
          "Service": "gcp"
        }
      ],
      "Checks": [
        "bigquery_dataset_cmk_encryption",
        "bigquery_table_cmk_encryption",
        "cloudsql_instance_mysql_local_infile_flag",
        "cloudsql_instance_mysql_skip_show_database_flag",
        "cloudsql_instance_postgres_enable_pgaudit_flag",
        "cloudsql_instance_postgres_log_connections_flag",
        "cloudsql_instance_postgres_log_disconnections_flag",
        "cloudsql_instance_postgres_log_error_verbosity_flag",
        "cloudsql_instance_postgres_log_min_duration_statement_flag",
        "cloudsql_instance_postgres_log_min_error_statement_flag",
        "cloudsql_instance_postgres_log_min_messages_flag",
        "cloudsql_instance_postgres_log_statement_flag",
        "cloudsql_instance_sqlserver_contained_database_authentication_flag",
        "cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag",
        "cloudsql_instance_sqlserver_external_scripts_enabled_flag",
        "cloudsql_instance_sqlserver_remote_access_flag",
        "cloudsql_instance_sqlserver_trace_flag",
        "cloudsql_instance_sqlserver_user_connections_flag",
        "cloudsql_instance_sqlserver_user_options_flag",
        "cloudsql_instance_ssl_connections",
        "compute_instance_encryption_with_csek_enabled",
        "compute_instance_shielded_vm_enabled",
        "dataproc_encrypted_with_cmks_disabled",
        "dns_dnssec_disabled",
        "dns_rsasha1_in_use_to_key_sign_in_dnssec",
        "dns_rsasha1_in_use_to_zone_sign_in_dnssec",
        "kms_key_not_publicly_accessible",
        "kms_key_rotation_enabled"
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
          "Service": "gcp"
        }
      ],
      "Checks": [
        "artifacts_container_analysis_enabled",
        "gcr_container_scanning_enabled",
        "compute_public_address_shodan",
        "cloudsql_instance_automated_backups",
        "iam_sa_user_managed_key_rotate_90_days",
        "iam_service_account_unused"
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
          "Service": "gcp"
        }
      ],
      "Checks": [
        "apikeys_key_rotated_in_90_days",
        "iam_sa_user_managed_key_rotate_90_days",
        "iam_sa_user_managed_key_unused",
        "iam_service_account_unused",
        "compute_instance_default_service_account_in_use"
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
          "Service": "gcp"
        }
      ],
      "Checks": [
        "iam_audit_logs_enabled",
        "iam_cloud_asset_inventory_enabled",
        "logging_sink_created",
        "compute_subnet_flow_logs_enabled",
        "compute_network_dns_logging_enabled"
      ]
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: hipaa_gcp.json]---
Location: prowler-master/prowler/compliance/gcp/hipaa_gcp.json

```json
{
  "Framework": "HIPAA",
  "Name": "HIPAA compliance framework for GCP",
  "Version": "",
  "Provider": "GCP",
  "Description": "The Health Insurance Portability and Accountability Act of 1996 (HIPAA) is legislation that helps US workers to retain health insurance coverage when they change or lose jobs. The legislation also seeks to encourage electronic health records to improve the efficiency and quality of the US healthcare system through improved information sharing. This framework maps HIPAA requirements to Google Cloud Platform (GCP) security best practices.",
  "Requirements": [
    {
      "Id": "164_308_a_1_ii_a",
      "Name": "164.308(a)(1)(ii)(A) Risk analysis",
      "Description": "Conduct an accurate and thorough assessment of the potential risks and vulnerabilities to the confidentiality, integrity, and availability of electronic protected health information held by the covered entity or business associate.",
      "Attributes": [
        {
          "ItemId": "164_308_a_1_ii_a",
          "Section": "164.308 Administrative Safeguards",
          "Service": "gcp"
        }
      ],
      "Checks": [
        "iam_cloud_asset_inventory_enabled",
        "securitycenter_security_health_analytics_enabled",
        "essentialcontacts_security_contacts_configured"
      ]
    },
    {
      "Id": "164_308_a_1_ii_b",
      "Name": "164.308(a)(1)(ii)(B) Risk Management",
      "Description": "Implement security measures sufficient to reduce risks and vulnerabilities to a reasonable and appropriate level to comply with 164.306(a): Ensure the confidentiality, integrity, and availability of all electronic protected health information the covered entity or business associate creates, receives, maintains, or transmits.",
      "Attributes": [
        {
          "ItemId": "164_308_a_1_ii_b",
          "Section": "164.308 Administrative Safeguards",
          "Service": "gcp"
        }
      ],
      "Checks": [
        "cloudstorage_bucket_encryption",
        "cloudstorage_bucket_public_access",
        "cloudstorage_bucket_uniform_access",
        "cloudsql_instance_automatic_backups_enabled",
        "cloudsql_instance_encryption_enabled",
        "cloudsql_instance_public_access",
        "compute_instance_public_ip",
        "compute_disk_encryption_enabled",
        "compute_firewall_rdp_access_from_internet_restricted",
        "compute_firewall_ssh_access_from_internet_restricted",
        "compute_network_legacy_network_not_used",
        "gke_cluster_master_authorized_networks_enabled",
        "gke_cluster_private_cluster_enabled",
        "iam_sa_no_administrative_privileges",
        "iam_no_service_roles_at_project_level",
        "bigquery_dataset_public_access",
        "bigquery_dataset_cmek_encryption",
        "kms_key_rotation_enabled"
      ]
    },
    {
      "Id": "164_308_a_1_ii_d",
      "Name": "164.308(a)(1)(ii)(D) Information system activity review",
      "Description": "Implement procedures to regularly review records of information system activity, such as audit logs, access reports, and security incident tracking reports.",
      "Attributes": [
        {
          "ItemId": "164_308_a_1_ii_d",
          "Section": "164.308 Administrative Safeguards",
          "Service": "gcp"
        }
      ],
      "Checks": [
        "logging_sink_created",
        "logging_log_metric_filter_and_alert_for_audit_configuration_changes_enabled",
        "logging_log_metric_filter_and_alert_for_project_ownership_changes_enabled",
        "logging_log_metric_filter_and_alert_for_custom_role_changes_enabled",
        "logging_log_metric_filter_and_alert_for_vpc_network_changes_enabled",
        "logging_log_metric_filter_and_alert_for_vpc_network_route_changes_enabled",
        "logging_log_metric_filter_and_alert_for_vpc_firewall_rule_changes_enabled",
        "logging_log_metric_filter_and_alert_for_bucket_permission_changes_enabled",
        "logging_log_metric_filter_and_alert_for_sql_instance_configuration_changes_enabled"
      ]
    },
    {
      "Id": "164_308_a_3_i",
      "Name": "164.308(a)(3)(i) Workforce security",
      "Description": "Implement policies and procedures to ensure that all members of its workforce have appropriate access to electronic protected health information.",
      "Attributes": [
        {
          "ItemId": "164_308_a_3_i",
          "Section": "164.308 Administrative Safeguards",
          "Service": "gcp"
        }
      ],
      "Checks": [
        "iam_sa_no_administrative_privileges",
        "iam_no_service_roles_at_project_level",
        "iam_role_kms_enforce_separation_of_duties",
        "iam_role_sa_enforce_separation_of_duties",
        "iam_sa_no_user_managed_keys",
        "iam_sa_user_managed_key_unused"
      ]
    },
    {
      "Id": "164_308_a_4_i",
      "Name": "164.308(a)(4)(i) Information access management",
      "Description": "Implement policies and procedures for authorizing access to electronic protected health information that are consistent with the applicable requirements of subpart E of this part.",
      "Attributes": [
        {
          "ItemId": "164_308_a_4_i",
          "Section": "164.308 Administrative Safeguards",
          "Service": "gcp"
        }
      ],
      "Checks": [
        "iam_account_access_approval_enabled",
        "iam_sa_no_administrative_privileges",
        "iam_no_service_roles_at_project_level",
        "iam_organization_essential_contacts_configured",
        "cloudstorage_bucket_public_access",
        "cloudsql_instance_public_access",
        "bigquery_dataset_public_access"
      ]
    },
    {
      "Id": "164_308_a_5_ii_c",
      "Name": "164.308(a)(5)(ii)(C) Log-in monitoring",
      "Description": "Procedures for monitoring log-in attempts and reporting discrepancies.",
      "Attributes": [
        {
          "ItemId": "164_308_a_5_ii_c",
          "Section": "164.308 Administrative Safeguards",
          "Service": "gcp"
        }
      ],
      "Checks": [
        "logging_sink_created",
        "logging_log_metric_filter_and_alert_for_project_ownership_changes_enabled",
        "logging_log_metric_filter_and_alert_for_custom_role_changes_enabled"
      ]
    },
    {
      "Id": "164_308_a_6_ii",
      "Name": "164.308(a)(6)(ii) Response and reporting",
      "Description": "Identify and respond to suspected or known security incidents; mitigate, to the extent practicable, harmful effects of security incidents that are known to the covered entity or business associate; and document security incidents and their outcomes.",
      "Attributes": [
        {
          "ItemId": "164_308_a_6_ii",
          "Section": "164.308 Administrative Safeguards",
          "Service": "gcp"
        }
      ],
      "Checks": [
        "securitycenter_security_health_analytics_enabled",
        "essentialcontacts_security_contacts_configured",
        "logging_sink_created"
      ]
    },
    {
      "Id": "164_308_a_7_i",
      "Name": "164.308(a)(7)(i) Contingency plan",
      "Description": "Establish (and implement as needed) policies and procedures for responding to an emergency or other occurrence (for example, fire, vandalism, system failure, and natural disaster) that damages systems that contain electronic protected health information.",
      "Attributes": [
        {
          "ItemId": "164_308_a_7_i",
          "Section": "164.308 Administrative Safeguards",
          "Service": "gcp"
        }
      ],
      "Checks": [
        "cloudsql_instance_automatic_backups_enabled",
        "compute_disk_snapshot_encryption_enabled",
        "gke_cluster_stackdriver_logging_enabled"
      ]
    },
    {
      "Id": "164_308_a_7_ii_a",
      "Name": "164.308(a)(7)(ii)(A) Data backup plan",
      "Description": "Establish and implement procedures to create and maintain retrievable exact copies of electronic protected health information.",
      "Attributes": [
        {
          "ItemId": "164_308_a_7_ii_a",
          "Section": "164.308 Administrative Safeguards",
          "Service": "gcp"
        }
      ],
      "Checks": [
        "cloudsql_instance_automatic_backups_enabled",
        "cloudstorage_bucket_object_versioning",
        "compute_disk_snapshot_encryption_enabled"
      ]
    },
    {
      "Id": "164_308_a_7_ii_b",
      "Name": "164.308(a)(7)(ii)(B) Disaster recovery plan",
      "Description": "Establish (and implement as needed) procedures to restore any loss of data.",
      "Attributes": [
        {
          "ItemId": "164_308_a_7_ii_b",
          "Section": "164.308 Administrative Safeguards",
          "Service": "gcp"
        }
      ],
      "Checks": [
        "cloudsql_instance_automatic_backups_enabled",
        "cloudsql_instance_point_in_time_recovery_enabled",
        "cloudstorage_bucket_object_versioning"
      ]
    },
    {
      "Id": "164_310_a_1",
      "Name": "164.310(a)(1) Facility access controls",
      "Description": "Implement policies and procedures to limit physical access to its electronic information systems and the facility or facilities in which they are housed, while ensuring that properly authorized access is allowed.",
      "Attributes": [
        {
          "ItemId": "164_310_a_1",
          "Section": "164.310 Physical Safeguards",
          "Service": "gcp"
        }
      ],
      "Checks": [
        "compute_instance_public_ip",
        "compute_firewall_rdp_access_from_internet_restricted",
        "compute_firewall_ssh_access_from_internet_restricted",
        "gke_cluster_private_cluster_enabled"
      ]
    },
    {
      "Id": "164_310_d_1",
      "Name": "164.310(d)(1) Device and media controls",
      "Description": "Implement policies and procedures that govern the receipt and removal of hardware and electronic media that contain electronic protected health information into and out of a facility, and the movement of these items within the facility.",
      "Attributes": [
        {
          "ItemId": "164_310_d_1",
          "Section": "164.310 Physical Safeguards",
          "Service": "gcp"
        }
      ],
      "Checks": [
        "compute_disk_encryption_enabled",
        "compute_disk_snapshot_encryption_enabled",
        "cloudstorage_bucket_encryption"
      ]
    },
    {
      "Id": "164_312_a_1",
      "Name": "164.312(a)(1) Access control",
      "Description": "Implement technical policies and procedures for electronic information systems that maintain electronic protected health information to allow access only to those persons or software programs that have been granted access rights as specified in 164.308(a)(4).",
      "Attributes": [
        {
          "ItemId": "164_312_a_1",
          "Section": "164.312 Technical Safeguards",
          "Service": "gcp"
        }
      ],
      "Checks": [
        "iam_sa_no_administrative_privileges",
        "iam_no_service_roles_at_project_level",
        "iam_account_access_approval_enabled",
        "cloudstorage_bucket_public_access",
        "cloudstorage_bucket_uniform_access",
        "cloudsql_instance_public_access",
        "bigquery_dataset_public_access",
        "compute_instance_public_ip",
        "gke_cluster_private_cluster_enabled"
      ]
    },
    {
      "Id": "164_312_a_2_i",
      "Name": "164.312(a)(2)(i) Unique user identification",
      "Description": "Assign a unique name and/or number for identifying and tracking user identity.",
      "Attributes": [
        {
          "ItemId": "164_312_a_2_i",
          "Section": "164.312 Technical Safeguards",
          "Service": "gcp"
        }
      ],
      "Checks": [
        "iam_sa_no_user_managed_keys",
        "iam_sa_user_managed_key_unused"
      ]
    },
    {
      "Id": "164_312_a_2_iv",
      "Name": "164.312(a)(2)(iv) Encryption and decryption",
      "Description": "Implement a mechanism to encrypt and decrypt electronic protected health information.",
      "Attributes": [
        {
          "ItemId": "164_312_a_2_iv",
          "Section": "164.312 Technical Safeguards",
          "Service": "gcp"
        }
      ],
      "Checks": [
        "cloudstorage_bucket_encryption",
        "cloudsql_instance_encryption_enabled",
        "compute_disk_encryption_enabled",
        "compute_disk_snapshot_encryption_enabled",
        "bigquery_dataset_cmek_encryption",
        "kms_key_rotation_enabled"
      ]
    },
    {
      "Id": "164_312_b",
      "Name": "164.312(b) Audit controls",
      "Description": "Implement hardware, software, and/or procedural mechanisms that record and examine activity in information systems that contain or use electronic protected health information.",
      "Attributes": [
        {
          "ItemId": "164_312_b",
          "Section": "164.312 Technical Safeguards",
          "Service": "gcp"
        }
      ],
      "Checks": [
        "logging_sink_created",
        "logging_log_metric_filter_and_alert_for_audit_configuration_changes_enabled",
        "logging_log_metric_filter_and_alert_for_project_ownership_changes_enabled",
        "logging_log_metric_filter_and_alert_for_custom_role_changes_enabled",
        "logging_log_metric_filter_and_alert_for_vpc_network_changes_enabled",
        "logging_log_metric_filter_and_alert_for_vpc_network_route_changes_enabled",
        "logging_log_metric_filter_and_alert_for_vpc_firewall_rule_changes_enabled",
        "logging_log_metric_filter_and_alert_for_bucket_permission_changes_enabled",
        "logging_log_metric_filter_and_alert_for_sql_instance_configuration_changes_enabled",
        "gke_cluster_stackdriver_logging_enabled"
      ]
    },
    {
      "Id": "164_312_c_1",
      "Name": "164.312(c)(1) Integrity",
      "Description": "Implement policies and procedures to protect electronic protected health information from improper alteration or destruction.",
      "Attributes": [
        {
          "ItemId": "164_312_c_1",
          "Section": "164.312 Technical Safeguards",
          "Service": "gcp"
        }
      ],
      "Checks": [
        "cloudstorage_bucket_object_versioning",
        "cloudsql_instance_automatic_backups_enabled",
        "cloudsql_instance_point_in_time_recovery_enabled",
        "kms_key_rotation_enabled"
      ]
    },
    {
      "Id": "164_312_d",
      "Name": "164.312(d) Person or entity authentication",
      "Description": "Implement procedures to verify that a person or entity seeking access to electronic protected health information is the one claimed.",
      "Attributes": [
        {
          "ItemId": "164_312_d",
          "Section": "164.312 Technical Safeguards",
          "Service": "gcp"
        }
      ],
      "Checks": [
        "iam_account_access_approval_enabled",
        "iam_sa_no_user_managed_keys"
      ]
    },
    {
      "Id": "164_312_e_1",
      "Name": "164.312(e)(1) Transmission security",
      "Description": "Implement technical security measures to guard against unauthorized access to electronic protected health information that is being transmitted over an electronic communications network.",
      "Attributes": [
        {
          "ItemId": "164_312_e_1",
          "Section": "164.312 Technical Safeguards",
          "Service": "gcp"
        }
      ],
      "Checks": [
        "cloudstorage_bucket_encryption",
        "compute_firewall_rdp_access_from_internet_restricted",
        "compute_firewall_ssh_access_from_internet_restricted",
        "cloudsql_instance_ssl_required",
        "gke_cluster_master_authorized_networks_enabled"
      ]
    },
    {
      "Id": "164_312_e_2_i",
      "Name": "164.312(e)(2)(i) Integrity controls",
      "Description": "Implement security measures to ensure that electronically transmitted electronic protected health information is not improperly modified without detection until disposed of.",
      "Attributes": [
        {
          "ItemId": "164_312_e_2_i",
          "Section": "164.312 Technical Safeguards",
          "Service": "gcp"
        }
      ],
      "Checks": [
        "cloudstorage_bucket_object_versioning",
        "cloudsql_instance_automatic_backups_enabled",
        "logging_sink_created"
      ]
    },
    {
      "Id": "164_312_e_2_ii",
      "Name": "164.312(e)(2)(ii) Encryption",
      "Description": "Implement a mechanism to encrypt electronic protected health information whenever deemed appropriate.",
      "Attributes": [
        {
          "ItemId": "164_312_e_2_ii",
          "Section": "164.312 Technical Safeguards",
          "Service": "gcp"
        }
      ],
      "Checks": [
        "cloudstorage_bucket_encryption",
        "cloudsql_instance_encryption_enabled",
        "compute_disk_encryption_enabled",
        "bigquery_dataset_cmek_encryption",
        "kms_key_rotation_enabled",
        "cloudsql_instance_ssl_required"
      ]
    }
  ]
}
```

--------------------------------------------------------------------------------

````
