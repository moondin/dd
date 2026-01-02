---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 92
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 92 of 867)

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

---[FILE: v2_to_v3_checks_mapping.mdx]---
Location: prowler-master/docs/user-guide/providers/aws/v2_to_v3_checks_mapping.mdx

```text
---
title: 'Check Mapping Prowler v4/v3 to v2'
---

Prowler v3 and v4 introduce distinct identifiers while preserving the checks originally implemented in v2. This change was made because, in previous versions, check names were primarily derived from the CIS Benchmark for AWS. Starting with v3 and v4, all checks are independent of any security framework and have unique names and IDs.

For more details on the updated compliance implementation in Prowler v4 and v3, refer to the [Compliance](/user-guide/cli/tutorials/compliance) section.

```
checks_v4_v3_to_v2_mapping = {
    "accessanalyzer_enabled_without_findings": "extra769",
    "account_maintain_current_contact_details": "check117",
    "account_security_contact_information_is_registered": "check118",
    "account_security_questions_are_registered_in_the_aws_account": "check115",
    "acm_certificates_expiration_check": "extra730",
    "acm_certificates_transparency_logs_enabled": "extra724",
    "apigateway_restapi_authorizers_enabled": "extra746",
    "apigateway_restapi_client_certificate_enabled": "extra743",
    "apigateway_restapi_public": "extra745",
    "apigateway_restapi_logging_enabled": "extra722",
    "apigateway_restapi_waf_acl_attached": "extra744",
    “apigatewayv2_api_access_logging_enabled": "extra7156",
    "apigatewayv2_api_authorizers_enabled": "extra7157",
    "appstream_fleet_default_internet_access_disabled": "extra7193",
    "appstream_fleet_maximum_session_duration": "extra7190",
    "appstream_fleet_session_disconnect_timeout": "extra7191",
    "appstream_fleet_session_idle_disconnect_timeout": "extra7192",
    "autoscaling_find_secrets_ec2_launch_configuration": "extra775",
    "awslambda_function_invoke_api_operations_cloudtrail_logging_enabled": "extra720",
    "awslambda_function_no_secrets_in_code": "extra760",
    "awslambda_function_no_secrets_in_variables": "extra759",
    "awslambda_function_not_publicly_accessible": "extra798",
    "awslambda_function_url_cors_policy": "extra7180",
    "awslambda_function_url_public": "extra7179",
    "awslambda_function_using_supported_runtimes": "extra762",
    "cloudformation_stack_outputs_find_secrets": "extra742",
    "cloudformation_stacks_termination_protection_enabled": "extra7154",
    "cloudfront_distributions_field_level_encryption_enabled": "extra767",
    "cloudfront_distributions_geo_restrictions_enabled": "extra732",
    "cloudfront_distributions_https_enabled": "extra738",
    "cloudfront_distributions_logging_enabled": "extra714",
    "cloudfront_distributions_using_deprecated_ssl_protocols": "extra791",
    "cloudfront_distributions_using_waf": "extra773",
    "cloudtrail_cloudwatch_logging_enabled": "check24",
    "cloudtrail_kms_encryption_enabled": "check27",
    "cloudtrail_log_file_validation_enabled": "check22",
    "cloudtrail_logs_s3_bucket_access_logging_enabled": "check26",
    "cloudtrail_logs_s3_bucket_is_not_publicly_accessible": "check23",
    "cloudtrail_multi_region_enabled": "check21",
    "cloudtrail_s3_dataevents_read_enabled": "extra7196",
    "cloudtrail_s3_dataevents_write_enabled": "extra725",
    "cloudwatch_changes_to_network_acls_alarm_configured": "check311",
    "cloudwatch_changes_to_network_gateways_alarm_configured": "check312",
    "cloudwatch_changes_to_network_route_tables_alarm_configured": "check313",
    "cloudwatch_changes_to_vpcs_alarm_configured": "check314",
    "cloudwatch_cross_account_sharing_disabled": "extra7144",
    "cloudwatch_log_group_kms_encryption_enabled": "extra7164",
    "cloudwatch_log_group_retention_policy_specific_days_enabled": "extra7162",
    "cloudwatch_log_metric_filter_and_alarm_for_aws_config_configuration_changes_enabled": "check39",
    "cloudwatch_log_metric_filter_and_alarm_for_cloudtrail_configuration_changes_enabled": "check35",
    "cloudwatch_log_metric_filter_authentication_failures": "check36",
    "cloudwatch_log_metric_filter_aws_organizations_changes": "extra7197",
    "cloudwatch_log_metric_filter_disable_or_scheduled_deletion_of_kms_cmk": "check37",
    "cloudwatch_log_metric_filter_for_s3_bucket_policy_changes": "check38",
    "cloudwatch_log_metric_filter_policy_changes": "check34",
    "cloudwatch_log_metric_filter_root_usage": "check33",
    "cloudwatch_log_metric_filter_security_group_changes": "check310",
    "cloudwatch_log_metric_filter_sign_in_without_mfa": "check32",
    "cloudwatch_log_metric_filter_unauthorized_api_calls": "check31",
    "codeartifact_packages_external_public_publishing_disabled": "extra7195",
    "codebuild_project_older_90_days": "extra7174",
    "codebuild_project_user_controlled_buildspec": "extra7175",
    "config_recorder_all_regions_enabled": "check25",
    "directoryservice_directory_log_forwarding_enabled": "extra7181",
    "directoryservice_directory_monitor_notifications": "extra7182",
    "directoryservice_directory_snapshots_limit": "extra7184",
    "directoryservice_ldap_certificate_expiration": "extra7183",
    "directoryservice_radius_server_security_protocol": "extra7188",
    "directoryservice_supported_mfa_radius_enabled": "extra7189",
    "dynamodb_accelerator_cluster_encryption_enabled": "extra7165",
    "dynamodb_tables_kms_cmk_encryption_enabled": "extra7128",
    "dynamodb_tables_pitr_enabled": "extra7151",
    "ec2_ami_public": "extra76",
    "ec2_ebs_default_encryption": "extra761",
    "ec2_ebs_public_snapshot": "extra72",
    "ec2_ebs_snapshots_encrypted": "extra740",
    "ec2_ebs_volume_encryption": "extra729",
    "ec2_elastic_ip_shodan": "extra7102",
    "ec2_elastic_ip_unassigned": "extra7146",
    "ec2_instance_imdsv2_enabled": "extra786",
    "ec2_instance_internet_facing_with_instance_profile": "extra770",
    "ec2_instance_managed_by_ssm": "extra7124",
    "ec2_instance_older_than_specific_days": "extra758",
    "ec2_instance_profile_attached": "check119",
    "ec2_instance_public_ip": "extra710",
    "ec2_instance_secrets_user_data": "extra741",
    "ec2_networkacl_allow_ingress_any_port": "extra7138",
    "ec2_networkacl_allow_ingress_tcp_port_22": "check45",
    "ec2_networkacl_allow_ingress_tcp_port_3389": "check46",
    "ec2_securitygroup_allow_ingress_from_internet_to_all_ports": "extra748",
    "ec2_securitygroup_allow_ingress_from_internet_to_any_port": "extra74",
    "ec2_securitygroup_allow_ingress_from_internet_to_port_mongodb_27017_27018": "extra753",
    "ec2_securitygroup_allow_ingress_from_internet_to_tcp_ftp_port_20_21": "extra7134",
    "ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_22": "check41",
    "ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_3389": "check42",
    "ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_cassandra_7199_9160_8888": "extra754",
    "ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_elasticsearch_kibana_9200_9300_5601": "extra779",
    "ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_kafka_9092": "extra7135",
    "ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_memcached_11211": "extra755",
    "ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_mysql_3306": "extra750",
    "ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_oracle_1521_2483": "extra749",
    "ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_postgres_5432": "extra751",
    "ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_redis_6379": "extra752",
    "ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_sql_server_1433_1434": "extra7137",
    "ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_telnet_23": "extra7136",
    "ec2_securitygroup_allow_wide_open_public_ipv4": "extra778",
    "ec2_securitygroup_default_restrict_traffic": "check43",
    "ec2_securitygroup_from_launch_wizard": "extra7173",
    "ec2_securitygroup_not_used": "extra75",
    "ec2_securitygroup_with_many_ingress_egress_rules": "extra777",
    "ecr_repositories_lifecycle_policy_enabled": "extra7194",
    "ecr_repositories_not_publicly_accessible": "extra77",
    "ecr_repositories_scan_images_on_push_enabled": "extra765",
    "ecr_repositories_scan_vulnerabilities_in_latest_image": "extra776",
    "ecs_task_definitions_no_environment_secrets": "extra768",
    "efs_encryption_at_rest_enabled": "extra7161",
    "efs_have_backup_enabled": "extra7148",
    "efs_not_publicly_accessible": "extra7143",
    "eks_cluster_kms_cmk_encryption_in_secrets_enabled": "extra797",
    "eks_control_plane_endpoint_access_restricted": "extra796",
    "eks_control_plane_logging_all_types_enabled": "extra794",
    "eks_endpoints_not_publicly_accessible": "extra795",
    "elb_insecure_ssl_ciphers": "extra792",
    "elb_internet_facing": "extra79",
    "elb_logging_enabled": "extra717",
    "elb_ssl_listeners": "extra793",
    "elbv2_deletion_protection": "extra7150",
    "elbv2_desync_mitigation_mode": "extra7155",
    "elbv2_insecure_ssl_ciphers": "extra792",
    "elbv2_internet_facing": "extra79",
    "elbv2_listeners_underneath": "extra7158",
    "elbv2_logging_enabled": "extra717",
    "elbv2_ssl_listeners": "extra793",
    "elbv2_waf_acl_attached": "extra7129",
    "emr_cluster_account_public_block_enabled": "extra7178",
    "emr_cluster_master_nodes_no_public_ip": "extra7176",
    "emr_cluster_publicly_accesible": "extra7177",
    "glacier_vaults_policy_public_access": "extra7147",
    "glue_data_catalogs_connection_passwords_encryption_enabled": "extra7117",
    "glue_data_catalogs_metadata_encryption_enabled": "extra7116",
    "glue_database_connections_ssl_enabled": "extra7115",
    "glue_development_endpoints_cloudwatch_logs_encryption_enabled": "extra7119",
    "glue_development_endpoints_job_bookmark_encryption_enabled": "extra7121",
    "glue_development_endpoints_s3_encryption_enabled": "extra7114",
    "glue_etl_jobs_amazon_s3_encryption_enabled": "extra7118",
    "glue_etl_jobs_cloudwatch_logs_encryption_enabled": "extra7120",
    "glue_etl_jobs_job_bookmark_encryption_enabled": "extra7122",
    "guardduty_is_enabled": "extra713",
    "guardduty_no_high_severity_findings": "extra7139",
    "iam_administrator_access_with_mfa": "extra71",
    "iam_avoid_root_usage": "check11",
    "iam_check_saml_providers_sts": "extra733",
    "iam_customer_attached_policy_no_administrative_privileges": "subset of check122",
    "iam_customer_unattached_policy_no_administrative_privileges": "subset of check122",
    "iam_no_custom_policy_permissive_role_assumption": "extra7100",
    "iam_no_expired_server_certificates_stored": "extra7199",
    "iam_no_root_access_key": "check112",
    "iam_password_policy_expires_passwords_within_90_days_or_less": "check111",
    "iam_password_policy_lowercase": "check16",
    "iam_password_policy_minimum_length_14": "check19",
    "iam_password_policy_number": "check18",
    "iam_password_policy_reuse_24": "check110",
    "iam_password_policy_symbol": "check17",
    "iam_password_policy_uppercase": "check15",
    "iam_policy_allows_privilege_escalation": "extra7185",
    "iam_policy_attached_only_to_group_or_roles": "check116",
    "iam_root_hardware_mfa_enabled": "check114",
    "iam_root_mfa_enabled": "check113",
    "iam_rotate_access_key_90_days": "check14",
    "iam_support_role_created": "check120",
    "iam_user_accesskey_unused": "subset of check13,extra774,extra7198",
    "iam_user_console_access_unused": "subset of check13,extra774,extra7198",
    "iam_user_hardware_mfa_enabled": "extra7125",
    "iam_user_mfa_enabled_console_access": "check12",
    "iam_user_no_setup_initial_access_key": "check121",
    "iam_user_two_active_access_key": "extra7123",
    "iam_role_cross_service_confused_deputy_prevention": "extra7201",
    "kms_cmk_are_used": "extra7126",
    "kms_cmk_rotation_enabled": "check28",
    "kms_key_not_publicly_accessible": "extra736",
    "macie_is_enabled": "extra712",
    "opensearch_service_domains_audit_logging_enabled": "extra7101",
    "opensearch_service_domains_cloudwatch_logging_enabled": "extra715",
    "opensearch_service_domains_encryption_at_rest_enabled": "extra781",
    "opensearch_service_domains_https_communications_enforced": "extra783",
    "opensearch_service_domains_internal_user_database_enabled": "extra784",
    "opensearch_service_domains_node_to_node_encryption_enabled": "extra782",
    "opensearch_service_domains_not_publicly_accessible": "extra716",
    "opensearch_service_domains_updated_to_the_latest_service_software_version": "extra785",
    "opensearch_service_domains_use_cognito_authentication_for_kibana": "extra780",
    "rds_instance_backup_enabled": "extra739",
    "rds_instance_deletion_protection": "extra7113",
    "rds_instance_enhanced_monitoring_enabled": "extra7132",
    "rds_instance_integration_cloudwatch_logs": "extra747",
    "rds_instance_minor_version_upgrade_enabled": "extra7131",
    "rds_instance_multi_az": "extra7133",
    "rds_instance_no_public_access": "extra78",
    "rds_instance_storage_encrypted": "extra735",
    "rds_snapshots_public_access": "extra723",
    "redshift_cluster_audit_logging": "extra721",
    "redshift_cluster_automated_snapshot": "extra7149",
    "redshift_cluster_automatic_upgrades": "extra7160",
    "redshift_cluster_public_access": "extra711",
    "route53_domains_privacy_protection_enabled": "extra7152",
    "route53_domains_transferlock_enabled": "extra7153",
    "route53_public_hosted_zones_cloudwatch_logging_enabled": "extra719",
    "s3_account_level_public_access_blocks": "extra7186",
    "s3_bucket_acl_prohibited": "extra7172",
    "s3_bucket_default_encryption": "extra734",
    "s3_bucket_no_mfa_delete": "extra7200",
    "s3_bucket_object_versioning": "extra763",
    "s3_bucket_policy_public_write_access": "extra771",
    "s3_bucket_public_access": "extra73",
    "s3_bucket_secure_transport_policy": "extra764",
    "s3_bucket_server_access_logging_enabled": "extra718",
    "sagemaker_models_network_isolation_enabled": "extra7105",
    "sagemaker_models_vpc_settings_configured": "extra7106",
    "sagemaker_notebook_instance_encryption_enabled": "extra7112",
    "sagemaker_notebook_instance_root_access_disabled": "extra7103",
    "sagemaker_notebook_instance_vpc_settings_configured": "extra7104",
    "sagemaker_notebook_instance_without_direct_internet_access_configured": "extra7111",
    "sagemaker_training_jobs_intercontainer_encryption_enabled": "extra7107",
    "sagemaker_training_jobs_network_isolation_enabled": "extra7109",
    "sagemaker_training_jobs_volume_and_output_encryption_enabled": "extra7108",
    "sagemaker_training_jobs_vpc_settings_configured": "extra7110",
    "secretsmanager_automatic_rotation_enabled": "extra7163",
    "securityhub_enabled": "extra799",
    "shield_advanced_protection_in_associated_elastic_ips": "extra7166",
    "shield_advanced_protection_in_classic_load_balancers": "extra7171",
    "shield_advanced_protection_in_cloudfront_distributions": "extra7167",
    "shield_advanced_protection_in_global_accelerators": "extra7169",
    "shield_advanced_protection_in_internet_facing_load_balancers": "extra7170",
    "shield_advanced_protection_in_route53_hosted_zones": "extra7168",
    "sns_topics_kms_encryption_at_rest_enabled": "extra7130",
    "sns_topics_not_publicly_accessible": "extra731",
    "sqs_queues_not_publicly_accessible": "extra727",
    "sqs_queues_server_side_encryption_enabled": "extra728",
    "ssm_document_secrets": "extra7141",
    "ssm_documents_set_as_public": "extra7140",
    "ssm_managed_compliant_patching": "extra7127",
    "trustedadvisor_errors_and_warnings": "extra726",
    "vpc_endpoint_connections_trust_boundaries": "extra789",
    "vpc_endpoint_services_allowed_principals_trust_boundaries": "extra790",
    "vpc_flow_logs_enabled": "check29",
    "vpc_peering_routing_tables_with_least_privilege": "check44",
    "workspaces_volume_encryption_enabled": "extra7187",
}
```
```

--------------------------------------------------------------------------------

---[FILE: authentication.mdx]---
Location: prowler-master/docs/user-guide/providers/azure/authentication.mdx

```text
---
title: 'Azure Authentication in Prowler'
---

Prowler for Azure supports multiple authentication types. Authentication methods vary between Prowler App and Prowler CLI:

**Prowler App:**

- [**Service Principal Application**](#service-principal-application-authentication-recommended)

**Prowler CLI:**

- [**Service Principal Application**](#service-principal-application-authentication-recommended) (**Recommended**)
- [**AZ CLI credentials**](#az-cli-authentication)
- [**Interactive browser authentication**](#browser-authentication)
- [**Managed Identity Authentication**](#managed-identity-authentication)

## Required Permissions

Prowler for Azure requires two types of permission scopes:

### Microsoft Entra ID Permissions

These permissions allow Prowler to retrieve metadata from the assumed identity and perform specific Entra checks. While not mandatory for execution, they enhance functionality.

#### Assigning Required API Permissions

Assign the following Microsoft Graph permissions:

- `Directory.Read.All`
- `Policy.Read.All`
- `UserAuthenticationMethod.Read.All` (optional, for multifactor authentication (MFA) checks)

<Note>
Replace `Directory.Read.All` with `Domain.Read.All` for more restrictive permissions. Note that Entra checks related to DirectoryRoles and GetUsers will not run with this permission.

</Note>
<Tabs>
  <Tab title="Azure Portal">
    1. Go to your App Registration > "API permissions"

        ![API Permission Page](/images/providers/api-permissions-page.png)

    2. Click "+ Add a permission" > "Microsoft Graph" > "Application permissions"

        ![Add API Permission](/images/providers/add-api-permission.png)
        ![Microsoft Graph Detail](/images/providers/microsoft-graph-detail.png)

    3. Search and select:

        - `Directory.Read.All`
        - `Policy.Read.All`
        - `UserAuthenticationMethod.Read.All`

        ![Permission Screenshots](/images/providers/domain-permission.png)

    4. Click "Add permissions", then grant admin consent

        ![Grant Admin Consent](/images/providers/grant-admin-consent.png)
  </Tab>
  <Tab title="Azure CLI">
    1. To grant permissions to a Service Principal, execute the following command in a terminal:

        ```console
        az ad app permission add --id {appId} --api 00000003-0000-0000-c000-000000000000 --api-permissions 7ab1d382-f21e-4acd-a863-ba3e13f7da61=Role 246dd0d5-5bd0-4def-940b-0421030a5b68=Role 38d9df27-64da-44fd-b7c5-a6fbac20248f=Role
        ```
  </Tab>
</Tabs>
### Subscription Scope Permissions

These permissions are required to perform security checks against Azure resources. The following **RBAC roles** must be assigned per subscription to the entity used by Prowler:

- `Reader` – Grants read-only access to Azure resources.
- `ProwlerRole` – A custom role with minimal permissions needed for some specific checks, defined in the [prowler-azure-custom-role](https://github.com/prowler-cloud/prowler/blob/master/permissions/prowler-azure-custom-role.json).


#### Assigning "Reader" Role at the Subscription Level
By default, Prowler scans all accessible subscriptions. If you need to audit specific subscriptions, you must assign the necessary role `Reader` for each one. For streamlined and less repetitive role assignments in multi-subscription environments, refer to the [following section](/user-guide/providers/azure/subscriptions#recommendation-for-managing-multiple-subscriptions).

<Tabs>
  <Tab title="Azure Portal">
    1. To grant Prowler access to scan a specific Azure subscription, follow these steps in Azure Portal:
    Navigate to the subscription you want to audit with Prowler.

    1. In the left menu, select "Access control (IAM)".

    2. Click "+ Add" and select "Add role assignment".

    3. In the search bar, enter `Reader`, select it and click "Next".

    4. In the "Members" tab, click "+ Select members", then add the accounts to assign this role.

    5. Click "Review + assign" to finalize and apply the role assignment.

    ![Adding the Reader Role to a Subscription](/images/providers/add-reader-role.gif)
  </Tab>
  <Tab title="Azure CLI">
    1. Open a terminal and execute the following command to assign the `Reader` role to the identity that is going to be assumed by Prowler:

        ```console
        az role assignment create --role "Reader" --assignee <user, group, or service principal> --scope /subscriptions/<subscription-id>
        ```
  </Tab>
</Tabs>
#### Assigning "ProwlerRole" Permissions at the Subscription Level

Some read-only permissions required for specific security checks are not included in the built-in Reader role. To support these checks, Prowler utilizes a custom role, defined in [prowler-azure-custom-role](https://github.com/prowler-cloud/prowler/blob/master/permissions/prowler-azure-custom-role.json). Once created, this role can be assigned following the same process as the `Reader` role.

The checks requiring this `ProwlerRole` can be found in this [section](/user-guide/providers/azure/authentication#checks-requiring-prowlerrole).

<Tabs>
  <Tab title="Azure Portal">
    1. Download the [Prowler Azure Custom Role](https://github.com/prowler-cloud/prowler/blob/master/permissions/prowler-azure-custom-role.json)

        ![Azure Custom Role](/images/providers/download-prowler-role.png)

    2. Modify `assignableScopes` to match your Subscription ID (e.g. `/subscriptions/xxxx-xxxx-xxxx-xxxx`)

    3. Go to your Azure Subscription > "Access control (IAM)"

        ![IAM Page](/images/providers/iam-azure-page.png)

    4. Click "+ Add" > "Add custom role", choose "Start from JSON" and upload the modified file

        ![Add custom role via JSON](/images/providers/add-custom-role-json.png)

    5. Click "Review + Create" to finish

        ![Select review and create](/images/providers/review-and-create.png)

    6. Return to "Access control (IAM)" > "+ Add" > "Add role assignment"

        - Assign the `Reader` role to the Application created in the previous step
        - Then repeat the same process assigning the custom `ProwlerRole`

        ![Role Assignment](/images/providers/add-role-assigment.png)

    <Note>
        The `assignableScopes` field in the JSON custom role file must be updated to reflect the correct subscription or management group. Use one of the following formats: `/subscriptions/<subscription-id>` or `/providers/Microsoft.Management/managementGroups/<management-group-id>`.

    </Note>
  </Tab>
  <Tab title="Azure CLI">
    1. To create a new custom role, open a terminal and execute the following command:

    ```console
    az role definition create --role-definition '{                                                                                                                   640ms  lun 16 dic 17:04:17 2024
                        "Name": "ProwlerRole",
                        "IsCustom": true,
                        "Description": "Role used for checks that require read-only access to Azure resources and are not covered by the Reader role.",
                        "AssignableScopes": [
                        "/subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" // USE YOUR SUBSCRIPTION ID
                        ],
                        "Actions": [
                        "Microsoft.Web/sites/host/listkeys/action",
                        "Microsoft.Web/sites/config/list/Action"
                        ]
                    }'
    ```

2. If the command is executed successfully, the output is going to be similar to the following:

    ```json
    {
        "assignableScopes": [
            "/subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
        ],
        "createdBy": null,
        "createdOn": "YYYY-MM-DDTHH:MM:SS.SSSSSS+00:00",
        "description": "Role used for checks that require read-only access to Azure resources and are not covered by the Reader role.",
        "id": "/subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/providers/Microsoft.Authorization/roleDefinitions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
        "name": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
        "permissions": [
            {
                "actions": [
                    "Microsoft.Web/sites/host/listkeys/action",
                    "Microsoft.Web/sites/config/list/Action"
                ],
                "condition": null,
                "conditionVersion": null,
                "dataActions": [],
                "notActions": [],
                "notDataActions": []
            }
        ],
        "roleName": "ProwlerRole",
        "roleType": "CustomRole",
        "type": "Microsoft.Authorization/roleDefinitions",
        "updatedBy": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
        "updatedOn": "YYYY-MM-DDTHH:MM:SS.SSSSSS+00:00"
    }
    ```
  </Tab>
</Tabs>

### Additional Resources

For more detailed guidance on subscription management and permissions:

- [Azure subscription permissions](/user-guide/providers/azure/subscriptions)
- [Create Prowler Service Principal](/user-guide/providers/azure/create-prowler-service-principal)

<Warning>
 Some permissions in `ProwlerRole` involve **write access**. If a `ReadOnly` lock is attached to certain resources, you may encounter errors, and findings for those checks will not be available.

</Warning>
#### Checks Requiring `ProwlerRole`

The following security checks require the `ProwlerRole` permissions for execution. Ensure the role is assigned to the identity assumed by Prowler before running these checks:

- `app_function_access_keys_configured`
- `app_function_ftps_deployment_disabled`

---

## Service Principal Application Authentication (Recommended)

This method is required for Prowler App and recommended for Prowler CLI.

### Creating the Service Principal
For more information, see [Creating Prowler Service Principal](/user-guide/providers/azure/create-prowler-service-principal).

### Environment Variables (CLI)

For Prowler CLI, set up the following environment variables:

```console
export AZURE_CLIENT_ID="XXXXXXXXX"
export AZURE_TENANT_ID="XXXXXXXXX"
export AZURE_CLIENT_SECRET="XXXXXXX"
```

Execution with the `--sp-env-auth` flag fails if these variables are not set or exported.

## AZ CLI Authentication

*Available only for Prowler CLI*

Use stored Azure CLI credentials:

```console
prowler azure --az-cli-auth
```

## Managed Identity Authentication

*Available only for Prowler CLI*

Authenticate via Azure Managed Identity (when running on Azure resources):

```console
prowler azure --managed-identity-auth
```

## Browser Authentication

*Available only for Prowler CLI*

Authenticate using the default browser:

```console
prowler azure --browser-auth --tenant-id <tenant-id>
```

> **Note:** The `tenant-id` parameter is mandatory for browser authentication.
```

--------------------------------------------------------------------------------

---[FILE: create-prowler-service-principal.mdx]---
Location: prowler-master/docs/user-guide/providers/azure/create-prowler-service-principal.mdx

```text
---
title: 'Creating a Prowler Service Principal Application'
---

To enable Prowler to assume an identity for scanning with the required privileges, a Service Principal must be created. This Service Principal authenticates against Azure and retrieves necessary metadata for checks.

Service Principal Applications can be created using either the Azure Portal or the Azure CLI.

![Registering an Application in Azure CLI for Prowler](/images/prowler-app/create-sp.gif)

## Creating a Service Principal via Azure Portal / Entra Admin Center

1. Access **Microsoft Entra ID** in the [Azure Portal](https://portal.azure.com)

    ![Search Microsoft Entra ID](/images/providers/search-microsoft-entra-id.png)

2. Navigate to "Manage" > "App registrations"

    ![App Registration nav](/images/providers/app-registration-menu.png)

3. Click "+ New registration", complete the form, and click "Register"

    ![New Registration](/images/providers/new-registration.png)

4. Go to "Certificates & secrets" > "+ New client secret"

    ![Certificate & Secrets nav](/images/providers/certificates-and-secrets.png)
    ![New Client Secret](/images/providers/new-client-secret.png)

5. Fill in the required fields and click "Add", then copy the generated value

| Value | Description |
|-------|-----------|
| Client ID | Application ID |
| Client Secret | Secret to Connect to the App |
| Tenant ID | Microsoft Entra Tenant ID |


## Creating a Service Principal from Azure CLI

To create a Service Principal using the Azure CLI, follow these steps:

1. Open a terminal and execute the following command:

      ```console
      az ad sp create-for-rbac --name "ProwlerApp"
      ```

2. The output will be similar to:

      ```json
      {
      "appId": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
      "displayName": "ProwlerApp",
      "password": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      "tenant": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
      }
      ```

3. Save the values of `appId`, `password` and `tenant`, as they will be used as credentials in Prowler.

## Assigning Proper Permissions

Go to [Assigning Proper Permissions](/user-guide/providers/azure/authentication#required-permissions) to learn how to assign the necessary permissions to the Service Principal.
```

--------------------------------------------------------------------------------

---[FILE: getting-started-azure.mdx]---
Location: prowler-master/docs/user-guide/providers/azure/getting-started-azure.mdx

```text
---
title: 'Getting Started With Azure on Prowler'
---

## Prowler App

<iframe width="560" height="380" src="https://www.youtube-nocookie.com/embed/v1as8vTFlMg" title="Prowler Cloud Onboarding Azure" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="1"></iframe>
> Walkthrough video onboarding an Azure Subscription using Service Principal.


<Note>
**Government Cloud Support**

Government cloud subscriptions (Azure Government) are not currently supported, but we expect to add support for them in the near future.

</Note>
### Prerequisites

Before setting up Azure in Prowler App, you need to create a Service Principal with proper permissions.

For detailed instructions on how to create the Service Principal and configure permissions, see [Authentication > Service Principal](/user-guide/providers/azure/authentication#service-principal-application-authentication-recommended).

---

### Step 1: Get the Subscription ID

1. Go to the [Azure Portal](https://portal.azure.com/#home) and search for `Subscriptions`
2. Locate and copy your Subscription ID

    ![Search Subscription](/images/providers/search-subscriptions.png)
    ![Subscriptions Page](/images/providers/get-subscription-id.png)

---

### Step 2: Access Prowler App

1. Navigate to [Prowler Cloud](https://cloud.prowler.com/) or launch [Prowler App](/user-guide/tutorials/prowler-app)
2. Navigate to `Configuration` > `Cloud Providers`

    ![Cloud Providers Page](/images/prowler-app/cloud-providers-page.png)

3. Click on `Add Cloud Provider`

    ![Add a Cloud Provider](/images/prowler-app/add-cloud-provider.png)

4. Select `Microsoft Azure`

    ![Select Microsoft Azure](/images/providers/select-azure-prowler-cloud.png)

5. Add the Subscription ID and an optional alias, then click `Next`

    ![Add Subscription ID](/images/providers/add-subscription-id.png)

### Step 3: Add Credentials to Prowler App

For Azure, Prowler App uses a service principal application to authenticate. For more information about the process of creating and adding permissions to a service principal refer to this [section](/user-guide/providers/azure/authentication). When you finish creating and adding the [Entra](/user-guide/providers/azure/create-prowler-service-principal#assigning-proper-permissions) and [Subscription](/user-guide/providers/azure/subscriptions) scope permissions to the service principal, enter the `Tenant ID`, `Client ID` and `Client Secret` of the service principal application.


1. Go to your App Registration overview and copy the `Client ID` and `Tenant ID`

    ![App Overview](/images/providers/app-overview.png)

2. Go to Prowler App and paste:

    - `Client ID`
    - `Tenant ID`
    - `Client Secret` from [earlier](/user-guide/providers/azure/authentication#service-principal-application-authentication-recommended)

    ![Prowler Cloud Azure Credentials](/images/providers/add-credentials-azure-prowler-cloud.png)

3. Click `Next`

    ![Next Detail](/images/providers/click-next-azure.png)

4. Click "Launch Scan"

    ![Launch Scan Azure](/images/providers/launch-scan.png)

---

## Prowler CLI

### Configure Azure Credentials

To authenticate with Azure, Prowler CLI supports multiple authentication methods. Choose the method that best suits your environment.

For detailed authentication setup instructions, see [Authentication](/user-guide/providers/azure/authentication).

**Service Principal (Recommended)**

Set up environment variables:

```console
export AZURE_CLIENT_ID="XXXXXXXXX"
export AZURE_TENANT_ID="XXXXXXXXX"
export AZURE_CLIENT_SECRET="XXXXXXX"
```

Then run:

```console
prowler azure --sp-env-auth
```

**Azure CLI Credentials**

Use stored Azure CLI credentials:

```console
prowler azure --az-cli-auth
```

**Browser Authentication**

Authenticate using your default browser:

```console
prowler azure --browser-auth --tenant-id <tenant-id>
```

**Managed Identity**

When running on Azure resources:

```console
prowler azure --managed-identity-auth
```

### Subscription Selection

To scan a specific Azure subscription:

```console
prowler azure --subscription-ids <subscription-id>
```

To scan multiple Azure subscriptions:

```console
prowler azure --subscription-ids <subscription-id1> <subscription-id2> <subscription-id3>
```
```

--------------------------------------------------------------------------------

---[FILE: subscriptions.mdx]---
Location: prowler-master/docs/user-guide/providers/azure/subscriptions.mdx

```text
---
title: 'Azure Subscription Scope'
---

Prowler performs security scans within the subscription scope in Azure. To execute checks, it requires appropriate permissions to access the subscription and retrieve necessary metadata.

By default, Prowler operates multi-subscription, scanning all subscriptions it has permission to list. If permissions are granted for only a single subscription, Prowler will limit scans to that subscription.

## Configuring Specific Subscription Scans in Prowler

Additionally, Prowler supports restricting scans to specific subscriptions by passing a set of subscription IDs as an input argument. To configure this limitation, use the appropriate command options:

```console
prowler azure --az-cli-auth --subscription-ids <subscription ID 1> <subscription ID 2> ... <subscription ID N>
```

Prowler allows you to specify one or more subscriptions for scanning (up to N), enabling flexible audit configurations.

<Warning>
The multi-subscription feature is available only in the CLI. In Prowler App, each scan is limited to a single subscription.

</Warning>
## Assigning Permissions for Subscription Scans
Check the [Authentication > Subscription Scope Permissions](/user-guide/providers/azure/authentication#subscription-scope-permissions) guide for more information on how to assign permissions for subscription scans.

## Recommendation for Managing Multiple Subscriptions

Scanning multiple subscriptions requires creating and assigning roles for each, which can be a time-consuming process. To streamline subscription management and auditing, use management groups in Azure. This approach allows Prowler to efficiently organize and audit multiple subscriptions collectively.

1. **Create a Management Group**: Follow the [official guide](https://learn.microsoft.com/en-us/azure/governance/management-groups/create-management-group-portal) to create a new management group.

    ![Create management group](/images/create-management-group.gif)

2. **Assign Roles**: Assign necessary roles to the management group, similar to the [role assignment process](#assigning-permissions-for-subscription-scans).

    Role assignment should be done at the management group level instead of per subscription.

3. **Add Subscriptions**: Add all subscriptions you want to audit to the newly created management group. ![Add Subscription to Management Group](/images/add-sub-to-management-group.gif)
```

--------------------------------------------------------------------------------

---[FILE: use-non-default-cloud.mdx]---
Location: prowler-master/docs/user-guide/providers/azure/use-non-default-cloud.mdx

```text
---
title: 'Using Non-Default Azure Regions'
---

Microsoft offers cloud environments that comply with regional regulations. These clouds are available for use based on your requirements. By default, Prowler utilizes the commercial `AzureCloud` environment. (To list all available Azure clouds, use `az cloud list --output table`).

As of this documentation's publication, the following Azure clouds are available:

- AzureCloud
- AzureChinaCloud
- AzureUSGovernment

To change the default cloud, include the flag `--azure-region`. For example:

```console
prowler azure --az-cli-auth --azure-region AzureChinaCloud
```
```

--------------------------------------------------------------------------------

````
