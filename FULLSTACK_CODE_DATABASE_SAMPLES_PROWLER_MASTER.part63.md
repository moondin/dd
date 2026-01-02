---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 63
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 63 of 867)

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

---[FILE: job.yaml]---
Location: prowler-master/contrib/k8s/helm/prowler-cli/templates/job.yaml

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: {{ .Values.cronjob.name }}
  namespace: {{ .Values.namespace.name }}
spec:
  schedule: "{{ .Values.cronjob.schedule }}"
  jobTemplate:
    spec:
      template:
        metadata:
          labels:
            app: prowler
        spec:
          serviceAccountName: {{ .Values.serviceAccount.name }}
          containers:
          - name: prowler
            image: {{ .Values.image.repository }}:{{ .Values.image.tag }}
            args: ["kubernetes", "-z", "-b"]
            imagePullPolicy: {{ .Values.image.pullPolicy }}
            volumeMounts:
            {{- range $key, $value := .Values.configMap.data }}
              {{- if and (eq $.Values.clusterType "gke") (eq $key "srvKubernetes") }}
              {{- else }}
              - name: {{ $key | lower }}
                mountPath: {{ $value }}
                readOnly: true
              {{- end }}
            {{- end }}
          hostPID: {{ .Values.cronjob.hostPID }}
          restartPolicy: Never
          volumes:
          {{- range $key, $value := .Values.configMap.data }}
            {{- if and (eq $.Values.clusterType "gke") (eq $key "srvKubernetes") }}
            {{- else }}
            - name: {{ $key | lower }}
              hostPath:
                path: {{ $value }}
            {{- end }}
          {{- end }}
```

--------------------------------------------------------------------------------

---[FILE: namespace.yaml]---
Location: prowler-master/contrib/k8s/helm/prowler-cli/templates/namespace.yaml

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: {{ .Values.namespace.name }}
```

--------------------------------------------------------------------------------

---[FILE: role-binding.yaml]---
Location: prowler-master/contrib/k8s/helm/prowler-cli/templates/role-binding.yaml

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: {{ .Values.clusterRoleBinding.name }}
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: {{ .Values.clusterRole.name }}
subjects:
- kind: ServiceAccount
  name: {{ .Values.serviceAccount.name }}
  namespace: {{ .Values.namespace.name }}
```

--------------------------------------------------------------------------------

---[FILE: sa.yaml]---
Location: prowler-master/contrib/k8s/helm/prowler-cli/templates/sa.yaml

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: {{ .Values.serviceAccount.name }}
  namespace: {{ .Values.namespace.name }}
```

--------------------------------------------------------------------------------

---[FILE: .helmignore]---
Location: prowler-master/contrib/k8s/helm/prowler-ui/.helmignore

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
Location: prowler-master/contrib/k8s/helm/prowler-ui/Chart.yaml

```yaml
apiVersion: v2
name: prowler-ui
description: A Helm chart for Kubernetes
type: application
version: 0.1.0
appVersion: "5.1.1"
```

--------------------------------------------------------------------------------

---[FILE: values.yaml]---
Location: prowler-master/contrib/k8s/helm/prowler-ui/values.yaml

```yaml
# Default values for prowler-ui.
# This is a YAML-formatted file.
# Declare variables to be passed into your templates.

# This will set the replicaset count more information can be found here: https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/
replicaCount: 1

# This sets the container image more information can be found here: https://kubernetes.io/docs/concepts/containers/images/
image:
  repository: prowlercloud/prowler-ui
  # This sets the pull policy for images.
  pullPolicy: IfNotPresent
  # Overrides the image tag whose default is the chart appVersion.
  tag: ""

# This is for the secretes for pulling an image from a private repository more information can be found here: https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/
imagePullSecrets: []
# This is to override the chart name.
nameOverride: ""
fullnameOverride: ""

secrets:
  SITE_URL: http://localhost:3000
  API_BASE_URL: http://prowler-api:8080/api/v1
  NEXT_PUBLIC_API_DOCS_URL: http://prowler-api:8080/api/v1/docs
  AUTH_TRUST_HOST: True
  UI_PORT: 3000
  # openssl rand -base64 32
  AUTH_SECRET:

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
  port: 3000

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

---[FILE: deployment.yaml]---
Location: prowler-master/contrib/k8s/helm/prowler-ui/templates/deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "prowler-ui.fullname" . }}
  labels:
    {{- include "prowler-ui.labels" . | nindent 4 }}
spec:
  {{- if not .Values.autoscaling.enabled }}
  replicas: {{ .Values.replicaCount }}
  {{- end }}
  selector:
    matchLabels:
      {{- include "prowler-ui.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      annotations:
        checksum/config: {{ include (print $.Template.BasePath "/secrets.yaml") . | sha256sum }}
      {{- with .Values.podAnnotations }}
        {{- toYaml . | nindent 8 }}
      {{- end }}
      labels:
        {{- include "prowler-ui.labels" . | nindent 8 }}
        {{- with .Values.podLabels }}
        {{- toYaml . | nindent 8 }}
        {{- end }}
    spec:
      {{- with .Values.imagePullSecrets }}
      imagePullSecrets:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      serviceAccountName: {{ include "prowler-ui.serviceAccountName" . }}
      securityContext:
        {{- toYaml .Values.podSecurityContext | nindent 8 }}
      containers:
        - name: {{ .Chart.Name }}
          securityContext:
            {{- toYaml .Values.securityContext | nindent 12 }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          envFrom:
            - secretRef:
                name: {{ include "prowler-ui.fullname" $ }}
          ports:
            - name: http
              containerPort: {{ .Values.service.port }}
              protocol: TCP
          livenessProbe:
            {{- toYaml .Values.livenessProbe | nindent 12 }}
          readinessProbe:
            {{- toYaml .Values.readinessProbe | nindent 12 }}
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
          {{- with .Values.volumeMounts }}
          volumeMounts:
            {{- toYaml . | nindent 12 }}
          {{- end }}
      {{- with .Values.volumes }}
      volumes:
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
Location: prowler-master/contrib/k8s/helm/prowler-ui/templates/ingress.yaml

```yaml
{{- if .Values.ingress.enabled -}}
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: {{ include "prowler-ui.fullname" . }}
  labels:
    {{- include "prowler-ui.labels" . | nindent 4 }}
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
                name: {{ include "prowler-ui.fullname" $ }}
                port:
                  number: {{ $.Values.service.port }}
          {{- end }}
    {{- end }}
{{- end }}
```

--------------------------------------------------------------------------------

---[FILE: NOTES.txt]---
Location: prowler-master/contrib/k8s/helm/prowler-ui/templates/NOTES.txt

```text
1. Get the application URL by running these commands:
{{- if .Values.ingress.enabled }}
{{- range $host := .Values.ingress.hosts }}
  {{- range .paths }}
  http{{ if $.Values.ingress.tls }}s{{ end }}://{{ $host.host }}{{ .path }}
  {{- end }}
{{- end }}
{{- else if contains "NodePort" .Values.service.type }}
  export NODE_PORT=$(kubectl get --namespace {{ .Release.Namespace }} -o jsonpath="{.spec.ports[0].nodePort}" services {{ include "prowler-ui.fullname" . }})
  export NODE_IP=$(kubectl get nodes --namespace {{ .Release.Namespace }} -o jsonpath="{.items[0].status.addresses[0].address}")
  echo http://$NODE_IP:$NODE_PORT
{{- else if contains "LoadBalancer" .Values.service.type }}
     NOTE: It may take a few minutes for the LoadBalancer IP to be available.
           You can watch its status by running 'kubectl get --namespace {{ .Release.Namespace }} svc -w {{ include "prowler-ui.fullname" . }}'
  export SERVICE_IP=$(kubectl get svc --namespace {{ .Release.Namespace }} {{ include "prowler-ui.fullname" . }} --template "{{"{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}"}}")
  echo http://$SERVICE_IP:{{ .Values.service.port }}
{{- else if contains "ClusterIP" .Values.service.type }}
  export POD_NAME=$(kubectl get pods --namespace {{ .Release.Namespace }} -l "app.kubernetes.io/name={{ include "prowler-ui.name" . }},app.kubernetes.io/instance={{ .Release.Name }}" -o jsonpath="{.items[0].metadata.name}")
  export CONTAINER_PORT=$(kubectl get pod --namespace {{ .Release.Namespace }} $POD_NAME -o jsonpath="{.spec.containers[0].ports[0].containerPort}")
  echo "Visit http://127.0.0.1:8080 to use your application"
  kubectl --namespace {{ .Release.Namespace }} port-forward $POD_NAME 8080:$CONTAINER_PORT
{{- end }}
```

--------------------------------------------------------------------------------

---[FILE: secrets.yaml]---
Location: prowler-master/contrib/k8s/helm/prowler-ui/templates/secrets.yaml

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: {{ include "prowler-ui.fullname" . }}
  labels:
    {{- include "prowler-ui.labels" . | nindent 4 }}
type: Opaque
data:
  {{- range $k, $v := .Values.secrets }}
  {{ $k }}: {{ $v | toString | b64enc | quote }}
  {{- end }}
```

--------------------------------------------------------------------------------

---[FILE: service.yaml]---
Location: prowler-master/contrib/k8s/helm/prowler-ui/templates/service.yaml

```yaml
apiVersion: v1
kind: Service
metadata:
  name: {{ include "prowler-ui.fullname" . }}
  labels:
    {{- include "prowler-ui.labels" . | nindent 4 }}
spec:
  type: {{ .Values.service.type }}
  ports:
    - port: {{ .Values.service.port }}
      targetPort: http
      protocol: TCP
      name: http
  selector:
    {{- include "prowler-ui.selectorLabels" . | nindent 4 }}
```

--------------------------------------------------------------------------------

---[FILE: serviceaccount.yaml]---
Location: prowler-master/contrib/k8s/helm/prowler-ui/templates/serviceaccount.yaml

```yaml
{{- if .Values.serviceAccount.create -}}
apiVersion: v1
kind: ServiceAccount
metadata:
  name: {{ include "prowler-ui.serviceAccountName" . }}
  labels:
    {{- include "prowler-ui.labels" . | nindent 4 }}
  {{- with .Values.serviceAccount.annotations }}
  annotations:
    {{- toYaml . | nindent 4 }}
  {{- end }}
automountServiceAccountToken: {{ .Values.serviceAccount.automount }}
{{- end }}
```

--------------------------------------------------------------------------------

---[FILE: _helpers.tpl]---
Location: prowler-master/contrib/k8s/helm/prowler-ui/templates/_helpers.tpl

```text
{{/*
Expand the name of the chart.
*/}}
{{- define "prowler-ui.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "prowler-ui.fullname" -}}
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
{{- define "prowler-ui.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "prowler-ui.labels" -}}
helm.sh/chart: {{ include "prowler-ui.chart" . }}
{{ include "prowler-ui.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "prowler-ui.selectorLabels" -}}
app.kubernetes.io/name: {{ include "prowler-ui.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "prowler-ui.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "prowler-ui.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}
```

--------------------------------------------------------------------------------

---[FILE: Audit_Exec_Role.yaml]---
Location: prowler-master/contrib/other-contrib/multi-account/Audit_Exec_Role.yaml

```yaml
---
AWSTemplateFormatVersion: '2010-09-09'
Description: Prowler Auditing Role - in Control Tower pick AWSControlTowerStackSetRole for IAM role and AWSControlTowerExecution for execution

Parameters:

  AuditorAccountId:
    Default: 987600001234
    Description: AWS Account ID where the audit tooling executes
    Type: Number
  AuditRolePathName:
    Default: '/audit/prowler/XA_AuditRole_Prowler'
    Description: Path for role name in audit tooling account
    Type: String

Resources:
  XAAuditRole:
    Type: "AWS::IAM::Role"
    Properties: # /audit/prowler/XA_AuditRole_Prowler
      RoleName: XA_AuditRole_Prowler
      Path: "/audit/prowler/"
      ManagedPolicyArns:
        - arn:aws:iam::aws:policy/SecurityAudit
        - arn:aws:iam::aws:policy/AWSOrganizationsReadOnlyAccess
        - arn:aws:iam::aws:policy/IAMReadOnlyAccess
      AssumeRolePolicyDocument:
        Version: "2012-10-17"
        Statement:
          - Effect: "Allow"
            Principal:
              AWS: # TODO: review permissions to see if this can be narrowed down - code build only perhaps
                - !Sub "arn:aws:iam::${AuditorAccountId}:root"
            Action:
              - "sts:AssumeRole"
          - Effect: "Allow"
            Principal:
              Service:
                - "codebuild.amazonaws.com"
            Action:
              - "sts:AssumeRole"
            # TODO: restrict to only AuditorAccount only
      Policies:
        - PolicyName: "ProwlerPolicyAdditions"
          PolicyDocument:
            Version: "2012-10-17"
            Statement:
              - Sid: "ProwlerPolicyAdditions"
                Effect: "Allow"
                Resource: "*"
                Action:
                  - "acm:describecertificate"
                  - "acm:listcertificates"
                  - "apigateway:GET"
                  - "cloudtrail:GetEventSelectors"
                  - "ec2:GetEbsEncryptionByDefault"
                  - "es:describeelasticsearchdomainconfig"
                  - "guardduty:ListDetectors"
                  - "guardduty:GetDetector"
                  - "logs:DescribeLogGroups"
                  - "logs:DescribeMetricFilters"
                  - "s3:GetEncryptionConfiguration"
                  - "ses:getidentityverificationattributes"
                  - "sns:listsubscriptionsbytopic"
                  - "support:*"
                  - "trustedadvisor:Describe*"

    Metadata:
      cfn_nag:
        rules_to_suppress:
          - id: W28
            reason: "the role name is intentionally static"
          - id: W11
            reason: "the policy grants read/view/audit access only, to all resources, by design"
          - id: F3
            reason: "Support does not allow or deny access to individual actions"
```

--------------------------------------------------------------------------------

---[FILE: Audit_Pipeline.yaml]---
Location: prowler-master/contrib/other-contrib/multi-account/Audit_Pipeline.yaml

```yaml
---
AWSTemplateFormatVersion: '2010-09-09'
Description: Prowler Auditing Tools Stack

Metadata:
  AWS::CloudFormation::Interface:
    ParameterGroups:
      - Label:
          default: "Organizations and Accounts"
        Parameters:
          - pOrgMasterAccounts
          - pOrgExcludedAccounts
          - pStandAloneAccounts
      - Label:
          default: "Check Group and Execution"
        Parameters:
          - pProwlerCheckGroup
          - pAuditEveryXHours
      - Label:
          default: "Advanced"
        Parameters:
          - pTimeoutMinutes
          - pAuditRolePathName
          - pCustomProwlerRepo
          - pCustomProwlerCloneArgs
    ParameterLabels:
      pOrgMasterAccounts:
        default: "Organization Master Accounts"
      pOrgExcludedAccounts:
        default: "Excluded Organiztion Members"
      pStandAloneAccounts:
        default: "Stand-alone Accounts"
      pProwlerCheckGroup:
        default: "Prowler Check Group"
      pAuditEveryXHours:
        default: "Perform Audit every X hours"
      pTimeoutMinutes:
        default: "Permit Audit to run for X minutes"
      pAuditRolePathName:
        default: "Custom audit role path"
      pCustomProwlerRepo:
        default: "Custom git repo location for prowler"
      pCustomProwlerCloneArgs:
        default: "Custom arguments to git clone --depth 1"

Parameters:
  pAuditEveryXHours:
    Default: 24
    Type: Number
    Description: Number of hours between prowler audit runs.
    MinValue: 2
    MaxValue: 168
  pTimeoutMinutes:
    Default: 30
    Type: Number
    Description: Timeout for running prowler across the fleet
    MinValue: 5
    MaxValue: 480
  pAuditRolePathName:
    Default: '/audit/prowler/XA_AuditRole_Prowler'
    Type: String
    Description: Role path and name which prowler will assume in the target accounts (Audit_Exec_Role.yaml)
    # TODO: Validation: begins with "/" and does NOT end with "/"
  pOrgMasterAccounts:
    Description: Comma Separated list of Organization Master Accounts, or 'none'
    Default: 'none'
    Type: String
    MinLength: 4
    AllowedPattern: ^(none|([0-9]{12}(,[0-9]{12})*))$
    ConstraintDescription: comma separated list 12-digit account numbers, or 'none'
  pOrgExcludedAccounts: # Comma Separated list of Org Member Accounts to EXCLUDE
    Description: Comma Separated list of Skipped Organization Member Accounts, or 'none'
    Default: 'none'
    Type: String
    MinLength: 4
    AllowedPattern: ^(none|([0-9]{12}(,[0-9]{12})*))$
    ConstraintDescription: comma separated list 12-digit account numbers, or 'none'
  pStandAloneAccounts: # Comma Separated list of Stand-Alone Accounts
    Description: Comma Separated list of Stand-alone Accounts, or 'none'
    Default: 'none'
    Type: String
    MinLength: 4
    AllowedPattern: ^(none|([0-9]{12}(,[0-9]{12})*))$
    ConstraintDescription: comma separated list 12-digit account numbers, or 'none'
  pProwlerCheckGroup:
    Default: 'cislevel1'
    Type: String
    Description: Which group of checks should prowler run
    AllowedValues:
     - 'group1'
     - 'group2'
     - 'group3'
     - 'group4'
     - 'cislevel1'
     - 'cislevel2'
     - 'extras'
     - 'forensics-ready'
     - 'gdpr'
     - 'hipaa'
     - 'secrets'
     - 'apigateway'
     - 'rds'
  pCustomProwlerRepo:
    Type: String
    Default: 'https://github.com/prowler-cloud/prowler.git'
    MinLength: 10
  pCustomProwlerCloneArgs:
    Type: String
    Default: '--branch master'
    MinLength: 0
  ##### TODO
  # pResultsBucket: # if specified, use an existing bucket for the data
  # pEnableAthena:
  #   Default: false
  #   Type: Boolean
  #   Description: Set to true to enable creation of Athena/QuickSight resources

#### TODO
# Conditions:
#   cUseAthena: False

Resources:

  # S3 Bucket for Results, Config
  ProwlerResults:
    Type: "AWS::S3::Bucket"
    Properties:
      # BucketName: !Sub "audit-results-${AWS::AccountId}"
      Tags:
        - Key: "data-type"
          Value: "it-audit:sensitive"
        - Key: "data-public"
          Value: "NO"
      AccessControl: Private
      BucketEncryption:
        ServerSideEncryptionConfiguration:
            - ServerSideEncryptionByDefault:
                SSEAlgorithm: AES256
      PublicAccessBlockConfiguration:
        BlockPublicAcls: True
        BlockPublicPolicy: True
        IgnorePublicAcls: True
        RestrictPublicBuckets: True
      # LoggingConfiguration:
      # TODO: Enable BucketLogging - requires more parameters
    DeletionPolicy: "Retain"
    Metadata:
      cfn_nag:
        rules_to_suppress:
          - id: W35
            reason: "Bucket logging requires additional configuration not yet supported by this template"

  # Policy to allow assuming the XA_AuditRole_Prowler in target accounts
  ProwlerAuditManagerRole:
    Type: AWS::IAM::Role
    Properties:
      RoleName: AuditManagerRole_Prowler
      AssumeRolePolicyDocument:
        Version: 2012-10-17
        Statement:
          - Effect: Allow
            Principal:
              Service: codebuild.amazonaws.com
            Action:
              - sts:AssumeRole
      Path: /
      Policies:
        - PolicyName: AssumeRole-XA_AuditRole_Prowler
          PolicyDocument:
            Version: 2012-10-17
            Statement:
              - Effect: Allow
                Action:
                  - sts:AssumeRole
                Resource:
                  - !Sub "arn:aws:iam::*:role${pAuditRolePathName}"
              - Effect: Allow
                Action:
                  - s3:PutObject
                  - s3:GetObject
                  - s3:GetObjectVersion
                Resource:
                  - !Sub "${ProwlerResults.Arn}/*"
              - Effect: Allow
                Action:
                  - s3:ListBucket
                  - s3:HeadBucket
                  - s3:GetBucketLocation
                  - s3:GetBucketAcl
                Resource:
                  - !Sub "${ProwlerResults.Arn}"
              - Effect: Allow
                Action:
                  - logs:CreateLogGroup
                  - logs:CreateLogStream
                  - logs:PutLogEvents
                Resource:
                  - !Sub "arn:aws:logs:${AWS::Region}:${AWS::AccountId}:log-group:*"
                  - !Sub "${ProwlerResults.Arn}"
              - Effect: Allow
                Action:
                  - ssm:GetParameters
                Resource:
                  - !Sub "arn:aws:ssm:us-east-1:${AWS::AccountId}:parameter/audit/prowler/config/*"
    Metadata:
      cfn_nag:
        rules_to_suppress:
          - id: W28
            reason: "the role name is intentionally static"
          - id: W11
            reason: "not sure where the violation of w11 is"

  ## Code Build Job
  ProwlerBuildProject:
    Type: "AWS::CodeBuild::Project"
    Properties:
      Name: PerformProwlerAudit
      Description: "Run Prowler audit on accounts in targeted organizations"
      QueuedTimeoutInMinutes: 480
      TimeoutInMinutes: !Ref pTimeoutMinutes
      ServiceRole: !Ref ProwlerAuditManagerRole
      EncryptionKey: !Sub "arn:aws:kms:us-east-1:${AWS::AccountId}:alias/aws/s3"
      Environment:
        Type: "LINUX_CONTAINER"
        ComputeType: "BUILD_GENERAL1_MEDIUM"
        PrivilegedMode: False
        Image: "aws/codebuild/standard:2.0-1.12.0"
        ImagePullCredentialsType: "CODEBUILD"
      Artifacts: # s3://stack-prowlerresults-randomness/prowler/results/...
        Name: "results"
        Type: "S3"
        Location: !Ref ProwlerResults
        Path: "prowler"
        NamespaceType: NONE
        Packaging: NONE
        OverrideArtifactName: False
        EncryptionDisabled: False
      LogsConfig: # S3/logs/pipeline/
        CloudWatchLogs:
          Status: ENABLED
          GroupName: "audit/prowler"
          StreamName: "codebuild_runs"
        S3Logs:
          Status: DISABLED
          # Location: !Sub "${ProwlerResults.Arn}/codebuild_run_logs"
          EncryptionDisabled: False
      BadgeEnabled: False
      Tags:
        - Key: "data-type"
          Value: "it-audit:sensitive"
        - Key: "data-public"
          Value: "NO"
      Cache:
        Type: "NO_CACHE"
      Source:
        Type: NO_SOURCE
        BuildSpec: |
          version: 0.2
          env:
            parameter-store:
              PROWL_CHECK_GROUP:         /audit/prowler/config/check_group
              PROWL_MASTER_ACCOUNTS:     /audit/prowler/config/orgmaster_accounts
              PROWL_STANDALONE_ACCOUNTS: /audit/prowler/config/standalone_accounts
              PROWL_SKIP_ACCOUNTS:       /audit/prowler/config/skip_accounts
              PROWL_AUDIT_ROLE:          /audit/prowler/config/audit_role
              PROWLER_REPO:              /audit/prowler/config/gitrepo
              PROWLER_CLONE_ARGS:        /audit/prowler/config/gitcloneargs
          phases:
            install:
              runtime-versions:
                python: 3.7
              commands:
                - aws --version
                - git clone --depth 1 $PROWLER_REPO $PROWLER_CLONE_ARGS
            pre_build:
              commands:
                - env | grep PROWL_
                - export OUTBASE=$(date -u +"out/diagnostics/%Y/%m/%d")
                - export STAMP=$(date -u +"%Y%m%dT%H%M%SZ")
                - mkdir -p $OUTBASE || true
                - prowler/prowler -V
                - aws sts get-caller-identity > ${OUTBASE}/${STAMP}-caller-id.json
            build:
              commands:
                #### Run Prowler against this account, but don't fail the build
                # - export PROWLER_ACCOUNT_ID=$(aws sts get-caller-identity | jq -r '.Account')
                # - /bin/bash prowler/prowler -g cislevel1 -M csv -n -k > ${OUTBASE}/${STAMP}.${PROWLER_ACCOUNT_ID}.prowler.cislevel1.csv || /bin/true
                # - /bin/bash prowler/prowler -g forensics-ready -M csv -n -k > ${OUTBASE}/${STAMP}.${PROWLER_ACCOUNT_ID}.prowler.forensics-ready.csv || /bin/true
                #### Run Prowler targeting all accounts in the configured organizations
                - test -f prowler/util/multi-account/config
                - /bin/bash prowler/util/multi-account/megaprowler.sh out
              finally:
                - ps axuwww | grep -E 'parallel|sem|prowler'
            post_build:
              commands:
                - echo "attempting to collect any prowler credential reports ..."
                - find /tmp/ -name prowler\* | xargs -I % cp % ${OUTDIAG} || true
          artifacts:
            files:
              - '**/*'
            discard-paths: no
            base-directory: out

  ProwlerAuditTriggerRole:
    Type: AWS::IAM::Role
    Properties:
      # RoleName: Let cloudformation create this
      AssumeRolePolicyDocument:
        Version: 2012-10-17
        Statement:
          - Effect: Allow
            Principal:
              Service: events.amazonaws.com
            Action:
              - sts:AssumeRole
      Path: /
      Policies:
        - PolicyName: AssumeRole-XA_AuditRole_Prowler
          PolicyDocument:
            Version: 2012-10-17
            Statement:
              - Effect: Allow
                Action:
                  - codebuild:StartBuild
                Resource:
                  - !GetAtt ProwlerBuildProject.Arn

  ProwlerAuditTrigger:
    Type: AWS::Events::Rule
    Properties:
      Description: !Sub "Execute Prowler audit every ${pAuditEveryXHours} hours"
      Name: "ScheduledProwler"
      RoleArn: !GetAtt ProwlerAuditTriggerRole.Arn
      ## Other ways to define scheduling
      # ScheduleExpression: "cron(MM HH ? * * *)"
      # ScheduleExpression: "cron(45 15 ? * * *)"
      # ScheduleExpression: !Sub "rate( ${pAuditEveryXHours} hours)"
      ScheduleExpression: !Sub "rate(${pAuditEveryXHours} hours)"
      State: ENABLED
      Targets:
        - Arn: !GetAtt ProwlerBuildProject.Arn
          Id: 'ScheduledProwler'
          RoleArn: !GetAtt ProwlerAuditTriggerRole.Arn

  ProwlerConfigCheckGroup:
    Type: AWS::SSM::Parameter
    Properties:
      Description: "Name of the prowler check group to use"
      Name: "/audit/prowler/config/check_group"
      Type: "String"
      Value: !Ref pProwlerCheckGroup

  ProwlerConfigMasterAccounts:
    Type: AWS::SSM::Parameter
    Properties:
      Description: "List of organization master accounts"
      Name: "/audit/prowler/config/orgmaster_accounts"
      Type: "String"
      Value: !Ref pOrgMasterAccounts

  ProwlerConfigStandAloneAccounts:
    Type: AWS::SSM::Parameter
    Properties:
      Description: "List of stand-alone accounts"
      Name: "/audit/prowler/config/standalone_accounts"
      Type: "String"
      Value: !Ref pStandAloneAccounts

  ProwlerConfigSkipAccounts:
    Type: AWS::SSM::Parameter
    Properties:
      Description: "List of skipped organization member accounts"
      Name: "/audit/prowler/config/skip_accounts"
      Type: "String"
      Value: !Ref pOrgExcludedAccounts

  ProwlerConfigAuditRole:
    Type: AWS::SSM::Parameter
    Properties:
      Description: "Role used to audit target accounts"
      Name: "/audit/prowler/config/audit_role"
      Type: "String"
      Value: !Ref pAuditRolePathName

  ProwlerConfigGitRepo:
    Type: AWS::SSM::Parameter
    Properties:
      Description: "Git repository where prowler is gathered"
      Name: "/audit/prowler/config/gitrepo"
      Type: "String"
      Value: !Ref pCustomProwlerRepo

  ProwlerConfigGitCloneArgs:
    Type: AWS::SSM::Parameter
    Properties:
      Description: "Git clone arguments"
      Name: "/audit/prowler/config/gitcloneargs"
      Type: "String"
      Value: !Ref pCustomProwlerCloneArgs


  # -- Conditional "cUseAthena"
  # Athena
  # QuickSight
  # ???


Outputs:
  ResultsBucket:
    Description: S3 Bucket with Prowler Results, Logs, Configs
    Value: !Ref ProwlerResults
```

--------------------------------------------------------------------------------

---[FILE: config]---
Location: prowler-master/contrib/other-contrib/multi-account/config

```text
#!/bin/bash
########### CODEBUILD CONFIGURATION ##################
# shellcheck disable=SC2034
## Collect environment parameters set by buildspec
CHECKGROUP=${PROWL_CHECK_GROUP}

if [ "none" == "${PROWL_MASTER_ACCOUNTS}" ]; then
  ORG_MASTERS=""
else
  ORG_MASTERS=$(echo "${PROWL_MASTER_ACCOUNTS}" | tr "," " ")
fi

if [ "none" == "${PROWL_STANDALONE_ACCOUNTS}" ]; then
  STANDALONE_ACCOUNTS=""
else
  STANDALONE_ACCOUNTS=$(echo "${PROWL_STANDALONE_ACCOUNTS}" | tr "," " ")
fi

if [ "none" == "${PROWL_SKIP_ACCOUNTS}" ]; then
  SKIP_ACCOUNTS_REGEX='^$'
else
  skip_inside=$(echo "${PROWL_SKIP_ACCOUNTS}" | tr "," "|")
  # shellcheck disable=SC2116
  SKIP_ACCOUNTS_REGEX=$(echo "(${skip_inside})" )
fi

AUDIT_ROLE=${PROWL_AUDIT_ROLE}

# Adjust if you clone prowler from somewhere other than the default location
PROWLER='prowler/prowler'

# Change this if you want to ensure it breaks in code build
CREDSOURCE='EcsContainer'
```

--------------------------------------------------------------------------------

````
