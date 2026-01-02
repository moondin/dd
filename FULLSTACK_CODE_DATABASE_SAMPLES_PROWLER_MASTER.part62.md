---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 62
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 62 of 867)

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

---[FILE: values.yaml]---
Location: prowler-master/contrib/k8s/helm/prowler-api/values.yaml
Signals: Docker

```yaml
# Default values for prowler-api.
# This is a YAML-formatted file.
# Declare variables to be passed into your templates.

# This will set the replicaset count more information can be found here: https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/
replicaCount: 1

# This sets the container image more information can be found here: https://kubernetes.io/docs/concepts/containers/images/
containers:
  prowler-api:
    enabled: true
    image:
      repository: prowlercloud/prowler-api
      pullPolicy: IfNotPresent
    ports:
      - name: http
        containerPort: 8080
        protocol: TCP
    command: ["/home/prowler/docker-entrypoint.sh", "prod"]
  worker:
    enabled: true
    image:
      repository: prowlercloud/prowler-api
      pullPolicy: IfNotPresent
    command: ["/home/prowler/docker-entrypoint.sh", "worker"]
  worker-beat:
    enabled: true
    image:
      repository: prowlercloud/prowler-api
      pullPolicy: IfNotPresent
    command: ["../docker-entrypoint.sh", "beat"]

secrets:
  POSTGRES_HOST:
  POSTGRES_PORT: 5432
  POSTGRES_ADMIN_USER:
  POSTGRES_ADMIN_PASSWORD:
  POSTGRES_USER:
  POSTGRES_PASSWORD:
  POSTGRES_DB:
  # Valkey settings
  VALKEY_HOST: valkey-headless
  VALKEY_PORT: "6379"
  VALKEY_DB: "0"
  # Django settings
  DJANGO_ALLOWED_HOSTS: localhost,127.0.0.1,prowler-api
  DJANGO_BIND_ADDRESS: 0.0.0.0
  DJANGO_PORT: "8080"
  DJANGO_DEBUG: False
  DJANGO_SETTINGS_MODULE: config.django.production
  # Select one of [ndjson|human_readable]
  DJANGO_LOGGING_FORMATTER: human_readable
  # Select one of [DEBUG|INFO|WARNING|ERROR|CRITICAL]
  # Applies to both Django and Celery Workers
  DJANGO_LOGGING_LEVEL: INFO
  # Defaults to the maximum available based on CPU cores if not set.
  DJANGO_WORKERS: 2
  # Token lifetime is in minutes
  DJANGO_ACCESS_TOKEN_LIFETIME: "30"
  # Token lifetime is in minutes
  DJANGO_REFRESH_TOKEN_LIFETIME: "1440"
  DJANGO_CACHE_MAX_AGE: "3600"
  DJANGO_STALE_WHILE_REVALIDATE: "60"
  DJANGO_MANAGE_DB_PARTITIONS: "False"
  # openssl genrsa -out private.pem 2048
  DJANGO_TOKEN_SIGNING_KEY:
  # openssl rsa -in private.pem -pubout -out public.pem
  DJANGO_TOKEN_VERIFYING_KEY:
  # openssl rand -base64 32
  DJANGO_SECRETS_ENCRYPTION_KEY:
  DJANGO_BROKER_VISIBILITY_TIMEOUT: 86400

releaseConfigRoot: /home/prowler/.cache/pypoetry/virtualenvs/prowler-api-NnJNioq7-py3.12/lib/python3.12/site-packages/
releaseConfigPath: prowler/config/config.yaml

mainConfig:
  # AWS Configuration
  aws:
    # AWS Global Configuration
    # aws.mute_non_default_regions --> Set to True to muted failed findings in non-default regions for AccessAnalyzer, GuardDuty, SecurityHub, DRS and Config
    mute_non_default_regions: False
    # If you want to mute failed findings only in specific regions, create a file with the following syntax and run it with `prowler aws -w mutelist.yaml`:
    # Mutelist:
    #  Accounts:
    #   "*":
    #     Checks:
    #       "*":
    #         Regions:
    #           - "ap-southeast-1"
    #           - "ap-southeast-2"
    #         Resources:
    #           - "*"

    # AWS IAM Configuration
    # aws.iam_user_accesskey_unused --> CIS recommends 45 days
    max_unused_access_keys_days: 45
    # aws.iam_user_console_access_unused --> CIS recommends 45 days
    max_console_access_days: 45

    # AWS EC2 Configuration
    # aws.ec2_elastic_ip_shodan
    # TODO: create common config
    shodan_api_key: null
    # aws.ec2_securitygroup_with_many_ingress_egress_rules --> by default is 50 rules
    max_security_group_rules: 50
    # aws.ec2_instance_older_than_specific_days --> by default is 6 months (180 days)
    max_ec2_instance_age_in_days: 180
    # aws.ec2_securitygroup_allow_ingress_from_internet_to_any_port
    # allowed network interface types for security groups open to the Internet
    ec2_allowed_interface_types:
      [
          "api_gateway_managed",
          "vpc_endpoint",
      ]
    # allowed network interface owners for security groups open to the Internet
    ec2_allowed_instance_owners:
      [
          "amazon-elb"
      ]
    # aws.ec2_securitygroup_allow_ingress_from_internet_to_high_risk_tcp_ports
    ec2_high_risk_ports:
      [
          25,
          110,
          135,
          143,
          445,
          3000,
          4333,
          5000,
          5500,
          8080,
          8088,
      ]

    # AWS ECS Configuration
    # aws.ecs_service_fargate_latest_platform_version
    fargate_linux_latest_version: "1.4.0"
    fargate_windows_latest_version: "1.0.0"

    # AWS VPC Configuration (vpc_endpoint_connections_trust_boundaries, vpc_endpoint_services_allowed_principals_trust_boundaries)
    # AWS SSM Configuration (aws.ssm_documents_set_as_public)
    # Single account environment: No action required. The AWS account number will be automatically added by the checks.
    # Multi account environment: Any additional trusted account number should be added as a space separated list, e.g.
    # trusted_account_ids : ["123456789012", "098765432109", "678901234567"]
    trusted_account_ids: []

    # AWS Cloudwatch Configuration
    # aws.cloudwatch_log_group_retention_policy_specific_days_enabled --> by default is 365 days
    log_group_retention_days: 365

    # AWS CloudFormation Configuration
    # cloudformation_stack_cdktoolkit_bootstrap_version --> by default is 21
    recommended_cdk_bootstrap_version: 21

    # AWS AppStream Session Configuration
    # aws.appstream_fleet_session_idle_disconnect_timeout
    max_idle_disconnect_timeout_in_seconds: 600 # 10 Minutes
    # aws.appstream_fleet_session_disconnect_timeout
    max_disconnect_timeout_in_seconds: 300 # 5 Minutes
    # aws.appstream_fleet_maximum_session_duration
    max_session_duration_seconds: 36000 # 10 Hours

    # AWS Lambda Configuration
    # aws.awslambda_function_using_supported_runtimes
    obsolete_lambda_runtimes:
      [
        "java8",
        "go1.x",
        "provided",
        "python3.6",
        "python2.7",
        "python3.7",
        "nodejs4.3",
        "nodejs4.3-edge",
        "nodejs6.10",
        "nodejs",
        "nodejs8.10",
        "nodejs10.x",
        "nodejs12.x",
        "nodejs14.x",
        "nodejs16.x",
        "dotnet5.0",
        "dotnet7",
        "dotnetcore1.0",
        "dotnetcore2.0",
        "dotnetcore2.1",
        "dotnetcore3.1",
        "ruby2.5",
        "ruby2.7",
      ]
    # aws.awslambda_function_vpc_is_in_multi_azs
    lambda_min_azs: 2

    # AWS Organizations
    # aws.organizations_scp_check_deny_regions
    # aws.organizations_enabled_regions: [
    #   "eu-central-1",
    #   "eu-west-1",
    #   "us-east-1"
    # ]
    organizations_enabled_regions: []
    organizations_trusted_delegated_administrators: []

    # AWS ECR
    # aws.ecr_repositories_scan_vulnerabilities_in_latest_image
    # CRITICAL
    # HIGH
    # MEDIUM
    ecr_repository_vulnerability_minimum_severity: "MEDIUM"

    # AWS Trusted Advisor
    # aws.trustedadvisor_premium_support_plan_subscribed
    verify_premium_support_plans: True

    # AWS CloudTrail Configuration
    # aws.cloudtrail_threat_detection_privilege_escalation
    threat_detection_privilege_escalation_threshold: 0.2 # Percentage of actions found to decide if it is an privilege_escalation attack event, by default is 0.2 (20%)
    threat_detection_privilege_escalation_minutes: 1440 # Past minutes to search from now for privilege_escalation attacks, by default is 1440 minutes (24 hours)
    threat_detection_privilege_escalation_actions:
      [
        "AddPermission",
        "AddRoleToInstanceProfile",
        "AddUserToGroup",
        "AssociateAccessPolicy",
        "AssumeRole",
        "AttachGroupPolicy",
        "AttachRolePolicy",
        "AttachUserPolicy",
        "ChangePassword",
        "CreateAccessEntry",
        "CreateAccessKey",
        "CreateDevEndpoint",
        "CreateEventSourceMapping",
        "CreateFunction",
        "CreateGroup",
        "CreateJob",
        "CreateKeyPair",
        "CreateLoginProfile",
        "CreatePipeline",
        "CreatePolicyVersion",
        "CreateRole",
        "CreateStack",
        "DeleteRolePermissionsBoundary",
        "DeleteRolePolicy",
        "DeleteUserPermissionsBoundary",
        "DeleteUserPolicy",
        "DetachRolePolicy",
        "DetachUserPolicy",
        "GetCredentialsForIdentity",
        "GetId",
        "GetPolicyVersion",
        "GetUserPolicy",
        "Invoke",
        "ModifyInstanceAttribute",
        "PassRole",
        "PutGroupPolicy",
        "PutPipelineDefinition",
        "PutRolePermissionsBoundary",
        "PutRolePolicy",
        "PutUserPermissionsBoundary",
        "PutUserPolicy",
        "ReplaceIamInstanceProfileAssociation",
        "RunInstances",
        "SetDefaultPolicyVersion",
        "UpdateAccessKey",
        "UpdateAssumeRolePolicy",
        "UpdateDevEndpoint",
        "UpdateEventSourceMapping",
        "UpdateFunctionCode",
        "UpdateJob",
        "UpdateLoginProfile",
      ]
    # aws.cloudtrail_threat_detection_enumeration
    threat_detection_enumeration_threshold: 0.3 # Percentage of actions found to decide if it is an enumeration attack event, by default is 0.3 (30%)
    threat_detection_enumeration_minutes: 1440 # Past minutes to search from now for enumeration attacks, by default is 1440 minutes (24 hours)
    threat_detection_enumeration_actions:
      [
        "DescribeAccessEntry",
        "DescribeAccountAttributes",
        "DescribeAvailabilityZones",
        "DescribeBundleTasks",
        "DescribeCarrierGateways",
        "DescribeClientVpnRoutes",
        "DescribeCluster",
        "DescribeDhcpOptions",
        "DescribeFlowLogs",
        "DescribeImages",
        "DescribeInstanceAttribute",
        "DescribeInstanceInformation",
        "DescribeInstanceTypes",
        "DescribeInstances",
        "DescribeInstances",
        "DescribeKeyPairs",
        "DescribeLogGroups",
        "DescribeLogStreams",
        "DescribeOrganization",
        "DescribeRegions",
        "DescribeSecurityGroups",
        "DescribeSnapshotAttribute",
        "DescribeSnapshotTierStatus",
        "DescribeSubscriptionFilters",
        "DescribeTransitGatewayMulticastDomains",
        "DescribeVolumes",
        "DescribeVolumesModifications",
        "DescribeVpcEndpointConnectionNotifications",
        "DescribeVpcs",
        "GetAccount",
        "GetAccountAuthorizationDetails",
        "GetAccountSendingEnabled",
        "GetBucketAcl",
        "GetBucketLogging",
        "GetBucketPolicy",
        "GetBucketReplication",
        "GetBucketVersioning",
        "GetCallerIdentity",
        "GetCertificate",
        "GetConsoleScreenshot",
        "GetCostAndUsage",
        "GetDetector",
        "GetEbsDefaultKmsKeyId",
        "GetEbsEncryptionByDefault",
        "GetFindings",
        "GetFlowLogsIntegrationTemplate",
        "GetIdentityVerificationAttributes",
        "GetInstances",
        "GetIntrospectionSchema",
        "GetLaunchTemplateData",
        "GetLaunchTemplateData",
        "GetLogRecord",
        "GetParameters",
        "GetPolicyVersion",
        "GetPublicAccessBlock",
        "GetQueryResults",
        "GetRegions",
        "GetSMSAttributes",
        "GetSMSSandboxAccountStatus",
        "GetSendQuota",
        "GetTransitGatewayRouteTableAssociations",
        "GetUserPolicy",
        "HeadObject",
        "ListAccessKeys",
        "ListAccounts",
        "ListAllMyBuckets",
        "ListAssociatedAccessPolicies",
        "ListAttachedUserPolicies",
        "ListClusters",
        "ListDetectors",
        "ListDomains",
        "ListFindings",
        "ListHostedZones",
        "ListIPSets",
        "ListIdentities",
        "ListInstanceProfiles",
        "ListObjects",
        "ListOrganizationalUnitsForParent",
        "ListOriginationNumbers",
        "ListPolicyVersions",
        "ListRoles",
        "ListRoles",
        "ListRules",
        "ListServiceQuotas",
        "ListSubscriptions",
        "ListTargetsByRule",
        "ListTopics",
        "ListUsers",
        "LookupEvents",
        "Search",
      ]
    # aws.cloudtrail_threat_detection_llm_jacking
    threat_detection_llm_jacking_threshold: 0.4 # Percentage of actions found to decide if it is an LLM Jacking attack event, by default is 0.4 (40%)
    threat_detection_llm_jacking_minutes: 1440 # Past minutes to search from now for LLM Jacking attacks, by default is 1440 minutes (24 hours)
    threat_detection_llm_jacking_actions:
      [
      "PutUseCaseForModelAccess",  # Submits a use case for model access, providing justification (Write).
      "PutFoundationModelEntitlement",  # Grants entitlement for accessing a foundation model (Write).
      "PutModelInvocationLoggingConfiguration", # Configures logging for model invocations (Write).
      "CreateFoundationModelAgreement",  # Creates a new agreement to use a foundation model (Write).
      "InvokeModel",  # Invokes a specified Bedrock model for inference using provided prompt and parameters (Read).
      "InvokeModelWithResponseStream",  # Invokes a Bedrock model for inference with real-time token streaming (Read).
      "GetUseCaseForModelAccess",  # Retrieves an existing use case for model access (Read).
      "GetModelInvocationLoggingConfiguration",  # Fetches the logging configuration for model invocations (Read).
      "GetFoundationModelAvailability",  # Checks the availability of a foundation model for use (Read).
      "ListFoundationModelAgreementOffers",  # Lists available agreement offers for accessing foundation models (List).
      "ListFoundationModels",  # Lists the available foundation models in Bedrock (List).
      "ListProvisionedModelThroughputs",  # Lists the provisioned throughput for previously created models (List).
      ]

    # AWS RDS Configuration
    # aws.rds_instance_backup_enabled
    # Whether to check RDS instance replicas or not
    check_rds_instance_replicas: False

    # AWS ACM Configuration
    # aws.acm_certificates_expiration_check
    days_to_expire_threshold: 7
    # aws.acm_certificates_with_secure_key_algorithms
    insecure_key_algorithms:
      [
        "RSA-1024",
        "P-192",
      ]

    # AWS EKS Configuration
    # aws.eks_control_plane_logging_all_types_enabled
    # EKS control plane logging types that must be enabled
    eks_required_log_types:
      [
        "api",
        "audit",
        "authenticator",
        "controllerManager",
        "scheduler",
      ]

    # aws.eks_cluster_uses_a_supported_version
    # EKS clusters must be version 1.28 or higher
    eks_cluster_oldest_version_supported: "1.28"

    # AWS CodeBuild Configuration
    # aws.codebuild_project_no_secrets_in_variables
    # CodeBuild sensitive variables that are excluded from the check
    excluded_sensitive_environment_variables:
      [

      ]

    # AWS ELB Configuration
    # aws.elb_is_in_multiple_az
    # Minimum number of Availability Zones that an CLB must be in
    elb_min_azs: 2

    # AWS ELBv2 Configuration
    # aws.elbv2_is_in_multiple_az
    # Minimum number of Availability Zones that an ELBv2 must be in
    elbv2_min_azs: 2


    # AWS Secrets Configuration
    # Patterns to ignore in the secrets checks
    secrets_ignore_patterns: []

    # AWS Secrets Manager Configuration
    # aws.secretsmanager_secret_unused
    # Maximum number of days a secret can be unused
    max_days_secret_unused: 90

    # aws.secretsmanager_secret_rotated_periodically
    # Maximum number of days a secret should be rotated
    max_days_secret_unrotated: 90

    # AWS Kinesis Configuration
    # Minimum retention period in hours for Kinesis streams
    min_kinesis_stream_retention_hours: 168 # 7 days


  # Azure Configuration
  azure:
    # Azure Network Configuration
    # azure.network_public_ip_shodan
    # TODO: create common config
    shodan_api_key: null

    # Azure App Service
    # azure.app_ensure_php_version_is_latest
    php_latest_version: "8.2"
    # azure.app_ensure_python_version_is_latest
    python_latest_version: "3.12"
    # azure.app_ensure_java_version_is_latest
    java_latest_version: "17"

    # Azure SQL Server
    # azure.sqlserver_minimal_tls_version
    recommended_minimal_tls_versions:
      [
        "1.2",
        "1.3",
      ]

  # GCP Configuration
  gcp:
    # GCP Compute Configuration
    # gcp.compute_public_address_shodan
    shodan_api_key: null

  # Kubernetes Configuration
  kubernetes:
    # Kubernetes API Server
    # kubernetes.apiserver_audit_log_maxbackup_set
    audit_log_maxbackup: 10
    # kubernetes.apiserver_audit_log_maxsize_set
    audit_log_maxsize: 100
    # kubernetes.apiserver_audit_log_maxage_set
    audit_log_maxage: 30
    # kubernetes.apiserver_strong_ciphers_only
    apiserver_strong_ciphers:
      [
        "TLS_AES_128_GCM_SHA256",
        "TLS_AES_256_GCM_SHA384",
        "TLS_CHACHA20_POLY1305_SHA256",
      ]
    # Kubelet
    # kubernetes.kubelet_strong_ciphers_only
    kubelet_strong_ciphers:
      [
        "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256",
        "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256",
        "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305",
        "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384",
        "TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305",
        "TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384",
        "TLS_RSA_WITH_AES_256_GCM_SHA384",
        "TLS_RSA_WITH_AES_128_GCM_SHA256",
      ]


# This is for the secretes for pulling an image from a private repository more information can be found here: https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/
imagePullSecrets: []
# This is to override the chart name.
nameOverride: ""
fullnameOverride: ""

#This section builds out the service account more information can be found here: https://kubernetes.io/docs/concepts/security/service-accounts/
serviceAccount:
  # Specifies whether a service account should be created
  create: true
  # Automatically mount a ServiceAccount's API credentials?
  automount: true
  # Annotations to add to the service account
  annotations: {}
  # The name of the service account to use.
  # If not set and create is true, a name is generated using the fullname template
  name: ""

# This is for setting Kubernetes Annotations to a Pod.
# For more information checkout: https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/
podAnnotations: {}
# This is for setting Kubernetes Labels to a Pod.
# For more information checkout: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/
podLabels: {}

podSecurityContext: {}
  # fsGroup: 2000

securityContext: {}
  # capabilities:
  #   drop:
  #   - ALL
  # readOnlyRootFilesystem: true
  # runAsNonRoot: true
  # runAsUser: 1000

# This is for setting up a service more information can be found here: https://kubernetes.io/docs/concepts/services-networking/service/
service:
  # This sets the service type more information can be found here: https://kubernetes.io/docs/concepts/services-networking/service/#publishing-services-service-types
  type: ClusterIP
  # This sets the ports more information can be found here: https://kubernetes.io/docs/concepts/services-networking/service/#field-spec-ports
  port: 80

# This block is for setting up the ingress for more information can be found here: https://kubernetes.io/docs/concepts/services-networking/ingress/
ingress:
  enabled: false
  className: ""
  annotations: {}
    # kubernetes.io/ingress.class: nginx
    # kubernetes.io/tls-acme: "true"
  hosts:
    - host: chart-example.local
      paths:
        - path: /
          pathType: ImplementationSpecific
  tls: []
  #  - secretName: chart-example-tls
  #    hosts:
  #      - chart-example.local

resources: {}
  # We usually recommend not to specify default resources and to leave this as a conscious
  # choice for the user. This also increases chances charts run on environments with little
  # resources, such as Minikube. If you do want to specify resources, uncomment the following
  # lines, adjust them as necessary, and remove the curly braces after 'resources:'.
  # limits:
  #   cpu: 100m
  #   memory: 128Mi
  # requests:
  #   cpu: 100m
  #   memory: 128Mi

# This is to setup the liveness and readiness probes more information can be found here: https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/
livenessProbe:
  httpGet:
    path: /
    port: http
readinessProbe:
  httpGet:
    path: /
    port: http

#This section is for setting up autoscaling more information can be found here: https://kubernetes.io/docs/concepts/workloads/autoscaling/
autoscaling:
  enabled: false
  minReplicas: 1
  maxReplicas: 100
  targetCPUUtilizationPercentage: 80
  # targetMemoryUtilizationPercentage: 80

# Additional volumes on the output Deployment definition.
volumes: []
# - name: foo
#   secret:
#     secretName: mysecret
#     optional: false

# Additional volumeMounts on the output Deployment definition.
volumeMounts: []
# - name: foo
#   mountPath: "/etc/foo"
#   readOnly: true

nodeSelector: {}

tolerations: []

affinity: {}
```

--------------------------------------------------------------------------------

---[FILE: configmap.yaml]---
Location: prowler-master/contrib/k8s/helm/prowler-api/templates/configmap.yaml

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ include "prowler-api.fullname" . }}-config
  labels:
    {{- include "prowler-api.labels" . | nindent 4 }}
data:
  config.yaml: |-
    {{- toYaml .Values.mainConfig | nindent 4 }}
```

--------------------------------------------------------------------------------

---[FILE: deployment.yaml]---
Location: prowler-master/contrib/k8s/helm/prowler-api/templates/deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "prowler-api.fullname" . }}
  labels:
    {{- include "prowler-api.labels" . | nindent 4 }}
spec:
  {{- if not .Values.autoscaling.enabled }}
  replicas: {{ .Values.replicaCount }}
  {{- end }}
  selector:
    matchLabels:
      {{- include "prowler-api.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      annotations:
        checksum/secrets: {{ include (print $.Template.BasePath "/secrets.yaml") . | sha256sum }}
        checksum/config: {{ include (print $.Template.BasePath "/configmap.yaml") . | sha256sum }}
      {{- with .Values.podAnnotations }}
        {{- toYaml . | nindent 8 }}
      {{- end }}
      labels:
        {{- include "prowler-api.labels" . | nindent 8 }}
        {{- with .Values.podLabels }}
        {{- toYaml . | nindent 8 }}
        {{- end }}
    spec:
      {{- with .Values.imagePullSecrets }}
      imagePullSecrets:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      serviceAccountName: {{ include "prowler-api.serviceAccountName" . }}
      securityContext:
        {{- toYaml .Values.podSecurityContext | nindent 8 }}
      containers:
      {{- range $name,$config := .Values.containers }}
      {{- if $config.enabled }}
        - name: {{ $name }}
          securityContext:
            {{- toYaml $config.securityContext | nindent 12 }}
          image: "{{ $config.image.repository }}:{{ $config.image.tag | default $.Chart.AppVersion }}"
          imagePullPolicy: {{ $config.image.pullPolicy }}
          envFrom:
            - secretRef:
                name: {{ include "prowler-api.fullname" $ }}
          command:
            {{- toYaml $config.command | nindent 12 }}
          {{- if $config.ports }}
          ports:
            {{- toYaml $config.ports | nindent 12 }}
          {{- end }}
          livenessProbe:
            {{- toYaml $config.livenessProbe | nindent 12 }}
          readinessProbe:
            {{- toYaml $config.readinessProbe | nindent 12 }}
          resources:
            {{- toYaml $config.resources | nindent 12 }}
          volumeMounts:
            - name: {{ include "prowler-api.fullname" $ }}-config
              mountPath: {{ $.Values.releaseConfigRoot }}{{ $.Values.releaseConfigPath }}
              subPath: config.yaml
          {{- with .volumeMounts }}
            {{- toYaml . | nindent 12 }}
          {{- end }}
      {{- end }}
      {{- end }}
      volumes:
        - name: {{ include "prowler-api.fullname" . }}-config
          configMap:
            name: {{ include "prowler-api.fullname" . }}-config
      {{- with .Values.volumes }}
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.nodeSelector }}
      nodeSelector:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.affinity }}
      affinity:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.tolerations }}
      tolerations:
        {{- toYaml . | nindent 8 }}
      {{- end }}
```

--------------------------------------------------------------------------------

---[FILE: ingress.yaml]---
Location: prowler-master/contrib/k8s/helm/prowler-api/templates/ingress.yaml

```yaml
{{- if .Values.ingress.enabled -}}
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: {{ include "prowler-api.fullname" . }}
  labels:
    {{- include "prowler-api.labels" . | nindent 4 }}
  {{- with .Values.ingress.annotations }}
  annotations:
    {{- toYaml . | nindent 4 }}
  {{- end }}
spec:
  {{- with .Values.ingress.className }}
  ingressClassName: {{ . }}
  {{- end }}
  {{- if .Values.ingress.tls }}
  tls:
    {{- range .Values.ingress.tls }}
    - hosts:
        {{- range .hosts }}
        - {{ . | quote }}
        {{- end }}
      secretName: {{ .secretName }}
    {{- end }}
  {{- end }}
  rules:
    {{- range .Values.ingress.hosts }}
    - host: {{ .host | quote }}
      http:
        paths:
          {{- range .paths }}
          - path: {{ .path }}
            {{- with .pathType }}
            pathType: {{ . }}
            {{- end }}
            backend:
              service:
                name: {{ include "prowler-api.fullname" $ }}
                port:
                  number: {{ $.Values.service.port }}
          {{- end }}
    {{- end }}
{{- end }}
```

--------------------------------------------------------------------------------

---[FILE: NOTES.txt]---
Location: prowler-master/contrib/k8s/helm/prowler-api/templates/NOTES.txt

```text
1. Get the application URL by running these commands:
{{- if .Values.ingress.enabled }}
{{- range $host := .Values.ingress.hosts }}
  {{- range .paths }}
  http{{ if $.Values.ingress.tls }}s{{ end }}://{{ $host.host }}{{ .path }}
  {{- end }}
{{- end }}
{{- else if contains "NodePort" .Values.service.type }}
  export NODE_PORT=$(kubectl get --namespace {{ .Release.Namespace }} -o jsonpath="{.spec.ports[0].nodePort}" services {{ include "prowler-api.fullname" . }})
  export NODE_IP=$(kubectl get nodes --namespace {{ .Release.Namespace }} -o jsonpath="{.items[0].status.addresses[0].address}")
  echo http://$NODE_IP:$NODE_PORT
{{- else if contains "LoadBalancer" .Values.service.type }}
     NOTE: It may take a few minutes for the LoadBalancer IP to be available.
           You can watch its status by running 'kubectl get --namespace {{ .Release.Namespace }} svc -w {{ include "prowler-api.fullname" . }}'
  export SERVICE_IP=$(kubectl get svc --namespace {{ .Release.Namespace }} {{ include "prowler-api.fullname" . }} --template "{{"{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}"}}")
  echo http://$SERVICE_IP:{{ .Values.service.port }}
{{- else if contains "ClusterIP" .Values.service.type }}
  export POD_NAME=$(kubectl get pods --namespace {{ .Release.Namespace }} -l "app.kubernetes.io/name={{ include "prowler-api.name" . }},app.kubernetes.io/instance={{ .Release.Name }}" -o jsonpath="{.items[0].metadata.name}")
  export CONTAINER_PORT=$(kubectl get pod --namespace {{ .Release.Namespace }} $POD_NAME -o jsonpath="{.spec.containers[0].ports[0].containerPort}")
  echo "Visit http://127.0.0.1:8080 to use your application"
  kubectl --namespace {{ .Release.Namespace }} port-forward $POD_NAME 8080:$CONTAINER_PORT
{{- end }}
```

--------------------------------------------------------------------------------

---[FILE: secrets.yaml]---
Location: prowler-master/contrib/k8s/helm/prowler-api/templates/secrets.yaml

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: {{ include "prowler-api.fullname" . }}
  labels:
    {{- include "prowler-api.labels" . | nindent 4 }}
type: Opaque
data:
  {{- range $k, $v := .Values.secrets }}
  {{ $k }}: {{ $v | toString | b64enc | quote }}
  {{- end }}
```

--------------------------------------------------------------------------------

---[FILE: service.yaml]---
Location: prowler-master/contrib/k8s/helm/prowler-api/templates/service.yaml

```yaml
apiVersion: v1
kind: Service
metadata:
  name: {{ include "prowler-api.fullname" . }}
  labels:
    {{- include "prowler-api.labels" . | nindent 4 }}
spec:
  type: {{ .Values.service.type }}
  ports:
  {{- range $name,$config := .Values.containers }}
    {{- if $config.ports }}
    {{- range $p := $config.ports }}
    - port: {{ $p.containerPort }}
      targetPort: {{ $p.containerPort }}
      protocol: TCP
      name: {{ $config.name }}
    {{- end }}
    {{- end }}
  {{- end }}
  selector:
    {{- include "prowler-api.selectorLabels" . | nindent 4 }}
```

--------------------------------------------------------------------------------

---[FILE: serviceaccount.yaml]---
Location: prowler-master/contrib/k8s/helm/prowler-api/templates/serviceaccount.yaml

```yaml
{{- if .Values.serviceAccount.create -}}
apiVersion: v1
kind: ServiceAccount
metadata:
  name: {{ include "prowler-api.serviceAccountName" . }}
  labels:
    {{- include "prowler-api.labels" . | nindent 4 }}
  {{- with .Values.serviceAccount.annotations }}
  annotations:
    {{- toYaml . | nindent 4 }}
  {{- end }}
automountServiceAccountToken: {{ .Values.serviceAccount.automount }}
{{- end }}
```

--------------------------------------------------------------------------------

---[FILE: _helpers.tpl]---
Location: prowler-master/contrib/k8s/helm/prowler-api/templates/_helpers.tpl

```text
{{/*
Expand the name of the chart.
*/}}
{{- define "prowler-api.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "prowler-api.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "prowler-api.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "prowler-api.labels" -}}
helm.sh/chart: {{ include "prowler-api.chart" . }}
{{ include "prowler-api.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "prowler-api.selectorLabels" -}}
app.kubernetes.io/name: {{ include "prowler-api.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "prowler-api.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "prowler-api.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}
```

--------------------------------------------------------------------------------

---[FILE: .helmignore]---
Location: prowler-master/contrib/k8s/helm/prowler-cli/.helmignore

```text
# Patterns to ignore when building packages.
# This supports shell glob matching, relative path matching, and
# negation (prefixed with !). Only one pattern per line.
.DS_Store
# Common VCS dirs
.git/
.gitignore
.bzr/
.bzrignore
.hg/
.hgignore
.svn/
# Common backup files
*.swp
*.bak
*.tmp
*.orig
*~
# Various IDEs
.project
.idea/
*.tmproj
.vscode/
```

--------------------------------------------------------------------------------

---[FILE: Chart.yaml]---
Location: prowler-master/contrib/k8s/helm/prowler-cli/Chart.yaml

```yaml
apiVersion: v2
name: prowler
description: Prowler Security Tool Helm chart for Kubernetes

# A chart can be either an 'application' or a 'library' chart.
#
# Application charts are a collection of templates that can be packaged into versioned archives
# to be deployed.
#
# Library charts provide useful utilities or functions for the chart developer. They're included as
# a dependency of application charts to inject those utilities and functions into the rendering
# pipeline. Library charts do not define any templates and therefore cannot be deployed.
type: application

# This is the chart version. This version number should be incremented each time you make changes
# to the chart and its templates, including the app version.
# Versions are expected to follow Semantic Versioning (https://semver.org/)
version: 0.1.1

# This is the version number of the application being deployed. This version number should be
# incremented each time you make changes to the application. Versions are not expected to
# follow Semantic Versioning. They should reflect the version the application is using.
# It is recommended to use it with quotes.
appVersion: "1.16.0"
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: prowler-master/contrib/k8s/helm/prowler-cli/README.md

```text
# prowler

![Version: 0.1.1](https://img.shields.io/badge/Version-0.1.1-informational?style=flat-square) ![Type: application](https://img.shields.io/badge/Type-application-informational?style=flat-square) ![AppVersion: 1.16.0](https://img.shields.io/badge/AppVersion-1.16.0-informational?style=flat-square)

Prowler Security Tool Helm chart for Kubernetes

# Prowler Helm Chart Deployment

This guide provides step-by-step instructions for deploying the Prowler Helm chart.

## Prerequisites

Before you begin, ensure you have the following:

1. A running Kubernetes cluster.
2. Helm installed on your local machine. If you don't have Helm installed, you can follow the [Helm installation guide](https://helm.sh/docs/intro/install/).
3. Proper access to your Kubernetes cluster (e.g., `kubectl` is configured and working).

## Deployment Steps

### 1. Clone the Repository

Clone the repository containing the Helm chart to your local machine.

```sh
git clone git@github.com:prowler-cloud/prowler.git
cd prowler/contrib/k8s/helm
```

### 2. Deploy the helm chart

```
helm install prowler .
```

### 3. Verify the deployment

```
helm status prowler
kubectl get all -n prowler-ns
```

### 4. Clean Up
To uninstall the Helm release and clean up the resources, run:

```helm uninstall prowler
kubectl delete namespace prowler-ns
```

## Values

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| clusterRole.name | string | `"prowler-read-cluster"` |  |
| clusterRoleBinding.name | string | `"prowler-read-cluster-binding"` |  |
| configMap.name | string | `"prowler-hostpaths"` |  |
| configMapData.etcCniNetd | string | `"/etc/cni/net.d"` |  |
| configMapData.etcKubernetes | string | `"/etc/kubernetes"` |  |
| configMapData.etcSystemd | string | `"/etc/systemd"` |  |
| configMapData.libSystemd | string | `"/lib/systemd"` |  |
| configMapData.optCniBin | string | `"/opt/cni/bin"` |  |
| configMapData.usrBin | string | `"/usr/bin"` |  |
| configMapData.varLibCni | string | `"/var/lib/cni"` |  |
| configMapData.varLibEtcd | string | `"/var/lib/etcd"` |  |
| configMapData.varLibKubeControllerManager | string | `"/var/lib/kube-controller-manager"` |  |
| configMapData.varLibKubeScheduler | string | `"/var/lib/kube-scheduler"` |  |
| configMapData.varLibKubelet | string | `"/var/lib/kubelet"` |  |
| cronjob.hostPID | bool | `true` |  |
| cronjob.name | string | `"prowler"` |  |
| cronjob.schedule | string | `"0 0 * * *"` |  |
| image.pullPolicy | string | `"Always"` |  |
| image.repository | string | `"toniblyx/prowler"` |  |
| image.tag | string | `"stable"` |  |
| namespace.name | string | `"prowler"` |  |
| serviceAccount.name | string | `"prowler"` |  |

----------------------------------------------
Autogenerated from chart metadata using [helm-docs v1.11.3](https://github.com/norwoodj/helm-docs/releases/v1.11.3)
```

--------------------------------------------------------------------------------

---[FILE: values.yaml]---
Location: prowler-master/contrib/k8s/helm/prowler-cli/values.yaml

```yaml
namespace:
  name: prowler-ns

cronjob:
  name: prowler
  schedule: "0 0 * * *"
  hostPID: true

serviceAccount:
  name: prowler-sa

image:
  repository: toniblyx/prowler
  tag: stable
  pullPolicy: Always

clusterType:

configMap:
  name: prowler-config
  data:
    varLibCni: "/var/lib/cni"
    varLibEtcd: "/var/lib/etcd"
    varLibKubelet: "/var/lib/kubelet"
    varLibKubeScheduler: "/var/lib/kube-scheduler"
    varLibKubeControllerManager: "/var/lib/kube-controller-manager"
    etcSystemd: "/etc/systemd"
    libSystemd: "/lib/systemd"
    etcKubernetes: "/etc/kubernetes"
    usrBin: "/usr/bin"
    etcCniNetd: "/etc/cni/net.d"
    optCniBin: "/opt/cni/bin"
    srvKubernetes: "/srv/kubernetes"

clusterRole:
  name: prowler-read-cluster

clusterRoleBinding:
  name: prowler-read-cluster-binding
  roleName: prowler-read-cluster
```

--------------------------------------------------------------------------------

---[FILE: cluster-role.yaml]---
Location: prowler-master/contrib/k8s/helm/prowler-cli/templates/cluster-role.yaml

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: {{ .Values.clusterRole.name }}
rules:
- apiGroups: [""]
  resources: ["pods", "configmaps", "nodes", "namespaces"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["rbac.authorization.k8s.io"]
  resources: ["clusterrolebindings", "rolebindings", "clusterroles", "roles"]
  verbs: ["get", "list", "watch"]
```

--------------------------------------------------------------------------------

---[FILE: cm.yaml]---
Location: prowler-master/contrib/k8s/helm/prowler-cli/templates/cm.yaml

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Values.configMap.name }}
  namespace: {{ .Values.namespace.name }}
data:
  varLibCni: "{{ .Values.configMap.data.varLibCni }}"
  varLibEtcd: "{{ .Values.configMap.data.varLibEtcd }}"
  varLibKubelet: "{{ .Values.configMap.data.varLibKubelet }}"
  varLibKubeScheduler: "{{ .Values.configMap.data.varLibKubeScheduler }}"
  varLibKubeControllerManager: "{{ .Values.configMap.data.varLibKubeControllerManager }}"
  etcSystemd: "{{ .Values.configMap.data.etcSystemd }}"
  libSystemd: "{{ .Values.configMap.data.libSystemd }}"
  etcKubernetes: "{{ .Values.configMap.data.etcKubernetes }}"
  usrBin: "{{ .Values.configMap.data.usrBin }}"
  etcCniNetd: "{{ .Values.configMap.data.etcCniNetd }}"
  optCniBin: "{{ .Values.configMap.data.optCniBin }}"
  srvKubernetes: "{{ .Values.configMap.data.srvKubernetes }}"
```

--------------------------------------------------------------------------------

````
