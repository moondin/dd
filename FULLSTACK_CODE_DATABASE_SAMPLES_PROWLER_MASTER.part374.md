---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 374
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 374 of 867)

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

---[FILE: core_minimize_privileged_containers.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/core/core_minimize_privileged_containers/core_minimize_privileged_containers.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "core_minimize_privileged_containers",
  "CheckTitle": "Minimize the admission of privileged containers",
  "CheckType": [],
  "ServiceName": "core",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesPod",
  "Description": "This check ensures that Kubernetes clusters are configured to minimize the admission of privileged containers, which have access to all Linux Kernel capabilities and devices. The use of privileged containers should be controlled and restricted to specific use-cases.",
  "Risk": "Permitting privileged containers by default can lead to security vulnerabilities as these containers have elevated privileges equivalent to the host.",
  "RelatedUrl": "https://kubernetes.io/docs/concepts/security/pod-security-standards/",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/bc_k8s_2#kubernetes",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Restrict the use of privileged containers through admission control policies.",
      "Url": "https://kubernetes.io/docs/concepts/security/pod-security-standards/"
    }
  },
  "Categories": [
    "container-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Exceptions for privileged containers should be clearly defined and monitored."
}
```

--------------------------------------------------------------------------------

---[FILE: core_minimize_privileged_containers.py]---
Location: prowler-master/prowler/providers/kubernetes/services/core/core_minimize_privileged_containers/core_minimize_privileged_containers.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.core.core_client import core_client


class core_minimize_privileged_containers(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in core_client.pods.values():
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = (
                f"Pod {pod.name} does not contain a privileged container."
            )

            for container in pod.containers.values():
                if (
                    container.security_context
                    and container.security_context["privileged"]
                ):
                    report.status = "FAIL"
                    report.status_extended = f"Pod {pod.name} contains a privileged container {container.name}."
                    break

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: core_minimize_root_containers_admission.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/core/core_minimize_root_containers_admission/core_minimize_root_containers_admission.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "core_minimize_root_containers_admission",
  "CheckTitle": "Minimize the admission of root containers",
  "CheckType": [],
  "ServiceName": "core",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesPod",
  "Description": "This check ensures that Kubernetes clusters are configured to minimize the admission of containers running as the root user. Running containers as root increases the risk of container breakout and should be restricted.",
  "Risk": "Allowing containers to run as root can lead to elevated risk of security breaches and container breakout.",
  "RelatedUrl": "https://kubernetes.io/docs/concepts/security/pod-security-standards/",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/bc_k8s_5#kubernetes",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Restrict the use of root containers through admission control policies.",
      "Url": "https://kubernetes.io/docs/concepts/security/pod-security-standards/"
    }
  },
  "Categories": [
    "container-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Exceptions for root containers should be clearly defined and monitored."
}
```

--------------------------------------------------------------------------------

---[FILE: core_minimize_root_containers_admission.py]---
Location: prowler-master/prowler/providers/kubernetes/services/core/core_minimize_root_containers_admission/core_minimize_root_containers_admission.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.core.core_client import core_client


class core_minimize_root_containers_admission(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in core_client.pods.values():
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = f"Pod {pod.name} is not running as root user."

            for container in pod.containers.values():
                if (
                    container.security_context
                    and container.security_context["run_as_user"] == 0
                ):
                    report.status = "FAIL"
                    report.status_extended = f"Pod {pod.name} is running as root user in container {container.name}."
                    break

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: core_no_secrets_envs.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/core/core_no_secrets_envs/core_no_secrets_envs.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "core_no_secrets_envs",
  "CheckTitle": "Prefer using secrets as files over secrets as environment variables",
  "CheckType": [],
  "ServiceName": "core",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "KubernetesSecrets",
  "Description": "This check ensures that secrets in Kubernetes are used as files rather than environment variables. Using secrets as files is safer, as it reduces the risk of exposing sensitive data through application logs.",
  "Risk": "Secrets exposed as environment variables can be inadvertently logged by applications, leading to potential security breaches.",
  "RelatedUrl": "https://kubernetes.io/docs/concepts/configuration/secret/#using-secrets",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/bc_k8s_33#kubernetes",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Minimize the use of environment variable secrets and prefer mounting secrets as files for enhanced security.",
      "Url": "https://kubernetes.io/docs/concepts/configuration/secret/#using-secrets-as-files-over-environment-variables"
    }
  },
  "Categories": [
    "trustboundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Mounting secrets as files allows for dynamic updates of secrets without needing to restart the pod."
}
```

--------------------------------------------------------------------------------

---[FILE: core_no_secrets_envs.py]---
Location: prowler-master/prowler/providers/kubernetes/services/core/core_no_secrets_envs/core_no_secrets_envs.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.core.core_client import core_client


class core_no_secrets_envs(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in core_client.pods.values():
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = (
                f"Pod {pod.name} does not contain any secret environment variables."
            )

            for container in pod.containers.values():
                if "secretKeyRef" in str(container.env):
                    report.status = "FAIL"
                    report.status_extended = f"Pod {pod.name} contains secret environment variables in container {container.name}."
                    break

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: core_seccomp_profile_docker_default.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/core/core_seccomp_profile_docker_default/core_seccomp_profile_docker_default.metadata.json
Signals: Docker

```json
{
  "Provider": "kubernetes",
  "CheckID": "core_seccomp_profile_docker_default",
  "CheckTitle": "Ensure that the seccomp profile is set to docker/default in your pod definitions",
  "CheckType": [],
  "ServiceName": "core",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesPod",
  "Description": "This check verifies that the docker/default seccomp profile is enabled in pod definitions. Enabling seccomp profiles helps restrict the set of system calls applications can make, enhancing the security of workloads in the cluster.",
  "Risk": "Not using or incorrectly configuring seccomp profiles can leave containers with broader permissions, increasing the risk of malicious actions.",
  "RelatedUrl": "https://kubernetes.io/docs/tutorials/clusters/seccomp/",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/bc_k8s_30#kubernetes",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Implement the docker/default seccomp profile in pod definitions for enhanced container security.",
      "Url": "https://docs.docker.com/engine/security/seccomp/"
    }
  },
  "Categories": [
    "container-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "The docker/default seccomp profile may need to be adjusted if it's too restrictive for certain applications."
}
```

--------------------------------------------------------------------------------

---[FILE: core_seccomp_profile_docker_default.py]---
Location: prowler-master/prowler/providers/kubernetes/services/core/core_seccomp_profile_docker_default/core_seccomp_profile_docker_default.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.core.core_client import core_client


class core_seccomp_profile_docker_default(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in core_client.pods.values():
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)

            pod_seccomp_correct = (
                pod.security_context
                and pod.security_context["seccomp_profile"]
                and pod.security_context["seccomp_profile"]["type"] == "RuntimeDefault"
            )
            containers_seccomp_correct = True

            # Check container-level seccomp profile
            for container in pod.containers.values():
                if not (
                    container.security_context
                    and container.security_context["seccomp_profile"]
                    and container.security_context["seccomp_profile"]["type"]
                    == "RuntimeDefault"
                ):
                    containers_seccomp_correct = False
                    break

            # Determine the report status
            if pod_seccomp_correct or containers_seccomp_correct:
                report.status = "PASS"
                report.status_extended = f"Pod {pod.name} and its containers have docker/default seccomp profile enabled."
            else:
                report.status = "FAIL"
                if not pod_seccomp_correct and not containers_seccomp_correct:
                    report.status_extended = f"Pod {pod.name} does not have docker/default seccomp profile enabled at both pod and container levels."
                elif not pod_seccomp_correct:
                    report.status_extended = f"Pod {pod.name} does not have docker/default seccomp profile enabled at pod level."
                else:
                    report.status_extended = f"Pod {pod.name} does not have docker/default seccomp profile enabled at container level."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: etcd_client.py]---
Location: prowler-master/prowler/providers/kubernetes/services/etcd/etcd_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.kubernetes.services.etcd.etcd_service import Etcd

etcd_client = Etcd(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: etcd_service.py]---
Location: prowler-master/prowler/providers/kubernetes/services/etcd/etcd_service.py

```python
from prowler.lib.logger import logger
from prowler.providers.kubernetes.kubernetes_provider import KubernetesProvider
from prowler.providers.kubernetes.lib.service.service import KubernetesService
from prowler.providers.kubernetes.services.core.core_client import core_client


class Etcd(KubernetesService):
    def __init__(self, provider: KubernetesProvider):
        super().__init__(provider)
        self.client = core_client

        self.etcd_pods = self._get_etcd_pods()

    def _get_etcd_pods(self):
        try:
            etcd_pods = []
            for pod in self.client.pods.values():
                if pod.namespace == "kube-system" and pod.name.startswith("etcd"):
                    etcd_pods.append(pod)
            return etcd_pods
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
```

--------------------------------------------------------------------------------

---[FILE: etcd_client_cert_auth.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/etcd/etcd_client_cert_auth/etcd_client_cert_auth.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "etcd_client_cert_auth",
  "CheckTitle": "Etcd pod has client certificate authentication enabled (--client-cert-auth=true)",
  "CheckType": [],
  "ServiceName": "etcd",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Pod",
  "Description": "**Etcd** is configured to require **TLS client certificate authentication** when the etcd container includes `--client-cert-auth`, so client access is validated with trusted certificates.",
  "Risk": "Without **mTLS client auth**, any reachable client can query or mutate etcd:\n- Confidentiality: exposure of Secrets and cluster metadata\n- Integrity: tampering with RBAC, pods, and configs\n- Availability: destructive writes can disrupt the control plane",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://etcd.io/docs/latest/op-guide/security/",
    "https://kubernetes.io/docs/tasks/administer-cluster/configure-upgrade-etcd/"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. SSH to the control plane node that runs etcd\n2. Edit the static pod manifest: /etc/kubernetes/manifests/etcd.yaml\n3. Under spec.containers[0].command (or args), add:\n   ```\n   - --client-cert-auth=true  # Critical: enables client certificate authentication\n   ```\n4. Save the file; kubelet will restart the etcd pod automatically\n5. Repeat on each control-plane node hosting an etcd pod",
      "Terraform": "```hcl\n# Enable client certificate authentication on etcd\nresource \"kubernetes_pod\" \"<example_resource_name>\" {\n  metadata {\n    name      = \"<example_resource_name>\"\n    namespace = \"kube-system\"\n  }\n  spec {\n    container {\n      name  = \"etcd\"\n      image = \"gcr.io/etcd-development/etcd:v3.5.13\"\n      command = [\n        \"etcd\",\n        \"--client-cert-auth=true\" # Critical: enables client cert auth to pass the check\n      ]\n    }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enforce **mutual TLS** for etcd clients by requiring validated certificates (`--client-cert-auth=true`) issued by a trusted CA.\n\nRestrict network access to etcd to API servers, rotate keys regularly, and apply **least privilege** and **separation of duties** for certificate management.",
      "Url": "https://hub.prowler.com/check/etcd_client_cert_auth"
    }
  },
  "Categories": [
    "cluster-security",
    "identity-access",
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Ensure that all clients communicating with etcd have valid certificates."
}
```

--------------------------------------------------------------------------------

---[FILE: etcd_client_cert_auth.py]---
Location: prowler-master/prowler/providers/kubernetes/services/etcd/etcd_client_cert_auth/etcd_client_cert_auth.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.etcd.etcd_client import etcd_client


class etcd_client_cert_auth(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in etcd_client.etcd_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = (
                f"Etcd has client certificate authentication enabled in pod {pod.name}."
            )
            for container in pod.containers.values():
                if "--client-cert-auth" not in str(
                    container.command
                ) and "--client-cert-auth=true" not in str(container.command):
                    report.status = "FAIL"
                    report.status_extended = f"Etcd does not have client certificate authentication enabled in pod {pod.name}."
                    break
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: etcd_no_auto_tls.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/etcd/etcd_no_auto_tls/etcd_no_auto_tls.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "etcd_no_auto_tls",
  "CheckTitle": "Etcd pod has --auto-tls disabled",
  "CheckType": [],
  "ServiceName": "etcd",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Pod",
  "Description": "**Etcd** configuration is reviewed for the `--auto-tls` option, which enables automatically generated self-signed certificates for client TLS.\n\nPresence of this flag indicates self-signed TLS is used; absence indicates client TLS relies on externally managed certificates.",
  "Risk": "Using **self-signed auto TLS** weakens identity assurance, enabling spoofed endpoints and **man-in-the-middle** on etcd client traffic. Attackers could read or alter Kubernetes state in etcd, impacting **confidentiality** and **integrity**, and facilitating control-plane takeover or data exfiltration.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://kubernetes.io/docs/tasks/tls/managing-tls-in-a-cluster/",
    "https://etcd.io/docs/latest/op-guide/security/",
    "https://etcd.io/docs/v3.2/op-guide/security/"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. SSH to the control plane node running etcd\n2. Edit the static Pod manifest: sudo vi /etc/kubernetes/manifests/etcd.yaml\n3. In containers -> command or args, remove any occurrence of --auto-tls or --auto-tls=true (do not set it to false)\n4. Save and exit; kubelet will recreate the etcd pod automatically\n5. Verify the flag is absent: kubectl -n kube-system get pod -l component=etcd -o yaml | grep -q \"auto-tls\" || echo \"PASS: --auto-tls not set\"",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Disable `--auto-tls` and use **CA-signed certificates** with **mutual TLS** for etcd clients. Apply managed PKI to enforce trusted CAs, rotate and revoke keys, and prefer modern TLS versions and strong cipher suites. Monitor certificate expiry and limit access per **least privilege** for **defense in depth**.",
      "Url": "https://hub.prowler.com/check/etcd_no_auto_tls"
    }
  },
  "Categories": [
    "encryption",
    "cluster-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Self-signed certificates should be replaced with certificates from a trusted certificate authority."
}
```

--------------------------------------------------------------------------------

---[FILE: etcd_no_auto_tls.py]---
Location: prowler-master/prowler/providers/kubernetes/services/etcd/etcd_no_auto_tls/etcd_no_auto_tls.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.etcd.etcd_client import etcd_client


class etcd_no_auto_tls(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in etcd_client.etcd_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = f"Etcd is not configured to use self-signed certificates for TLS in pod {pod.name}."
            for container in pod.containers.values():
                if "--auto-tls" in str(container.command) or "--auto-tls=true" in str(
                    container.command
                ):
                    report.status = "FAIL"
                    report.status_extended = f"Etcd is configured to use self-signed certificates for TLS in pod {pod.name}."
                    break
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: etcd_no_peer_auto_tls.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/etcd/etcd_no_peer_auto_tls/etcd_no_peer_auto_tls.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "etcd_no_peer_auto_tls",
  "CheckTitle": "Etcd pod does not use automatically generated self-signed certificates for peer TLS connections",
  "CheckType": [],
  "ServiceName": "etcd",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Pod",
  "Description": "**Etcd peer TLS** configuration is evaluated by checking etcd containers for the `--peer-auto-tls` flag. Presence of `--peer-auto-tls` indicates peers use automatically generated self-signed certificates for inter-peer connections.",
  "Risk": "With `--peer-auto-tls`, traffic is encrypted but peer identity isn't verified, enabling:\n- MITM on peer links\n- Rogue member joins to read/modify data\n- Quorum disruption\n\nThis degrades **confidentiality**, **integrity**, and **availability** of control-plane state replicated in etcd.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://etcd.io/docs/latest/op-guide/security/",
    "https://etcd.io/docs/v3.4/op-guide/security/",
    "https://kubernetes.io/docs/tasks/administer-cluster/configure-upgrade-etcd/"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. SSH to the control-plane node running etcd\n2. Open /etc/kubernetes/manifests/etcd.yaml\n3. In the etcd container args/command, remove any entry that starts with --peer-auto-tls\n4. Save the file; the kubelet will restart etcd automatically",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Disable `--peer-auto-tls` and use **mTLS** with a trusted CA issuing unique per-member peer certificates. Enforce SAN validation and, *where supported*, peer certificate authentication. Apply **least privilege**, separate CAs for peers/clients, rotate keys, and monitor certificate expiry and peer membership.",
      "Url": "https://hub.prowler.com/check/etcd_no_peer_auto_tls"
    }
  },
  "Categories": [
    "encryption",
    "cluster-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "This check is applicable only for etcd clusters. For single etcd server setups, this recommendation does not apply."
}
```

--------------------------------------------------------------------------------

---[FILE: etcd_no_peer_auto_tls.py]---
Location: prowler-master/prowler/providers/kubernetes/services/etcd/etcd_no_peer_auto_tls/etcd_no_peer_auto_tls.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.etcd.etcd_client import etcd_client


class etcd_no_peer_auto_tls(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in etcd_client.etcd_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = f"Etcd is not using automatically generated self-signed certificates for peer TLS connections in pod {pod.name}."
            for container in pod.containers.values():
                if "--peer-auto-tls" in str(
                    container.command
                ) or "--peer-auto-tls=true" in str(container.command):
                    report.status = "FAIL"
                    report.status_extended = f"Etcd is using automatically generated self-signed certificates for TLS connections in pod {pod.name}."
                    break
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: etcd_peer_client_cert_auth.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/etcd/etcd_peer_client_cert_auth/etcd_peer_client_cert_auth.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "etcd_peer_client_cert_auth",
  "CheckTitle": "Etcd pod has peer client certificate authentication enabled",
  "CheckType": [],
  "ServiceName": "etcd",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Pod",
  "Description": "**Etcd** requires **peer client certificate authentication** for inter-member traffic via `--peer-client-cert-auth=true` set in the etcd container command",
  "Risk": "Without peer authentication, a rogue host can impersonate a member, eavesdrop on or alter Raft traffic, inject state, and disrupt elections-compromising **confidentiality** (state leakage), **integrity** (malicious writes), and **availability** (cluster instability/outage).",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://etcd.io/docs/latest/op-guide/security/",
    "https://etcd.io/docs/v3.6/op-guide/configuration/",
    "https://kubernetes.io/docs/tasks/administer-cluster/configure-upgrade-etcd/#limiting-access-of-etcd-clusters"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. SSH to the control-plane node\n2. Edit the etcd static Pod manifest: /etc/kubernetes/manifests/etcd.yaml\n3. In spec.containers[0].command, add this entry:\n   - --peer-client-cert-auth=true\n   (Critical: enables peer client certificate authentication)\n4. Save the file; the kubelet will automatically restart the etcd Pod\n5. Verify the Pod's container command includes --peer-client-cert-auth=true",
      "Terraform": "```hcl\nresource \"kubernetes_pod\" \"<example_resource_name>\" {\n  metadata {\n    name      = \"<example_resource_name>\"\n    namespace = \"kube-system\"\n  }\n  spec {\n    container {\n      name    = \"etcd\"\n      image   = \"registry.k8s.io/etcd:3.5.12-0\"\n      command = [\n        \"etcd\",\n        \"--peer-client-cert-auth=true\"  # Critical: enables peer client certificate authentication for peer traffic\n      ]\n    }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enforce **mTLS** for etcd peers with client certificate auth. Use a dedicated CA, validate SANs, and apply **least privilege** to issued certs. Rotate and revoke certificates regularly, restrict network access to peer ports, and avoid auto-generated self-signed peer TLS to maintain strong identity assurance.",
      "Url": "https://hub.prowler.com/check/etcd_peer_client_cert_auth"
    }
  },
  "Categories": [
    "cluster-security",
    "identity-access"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "This check is applicable only for etcd clusters. For single etcd server setups, this recommendation does not apply."
}
```

--------------------------------------------------------------------------------

---[FILE: etcd_peer_client_cert_auth.py]---
Location: prowler-master/prowler/providers/kubernetes/services/etcd/etcd_peer_client_cert_auth/etcd_peer_client_cert_auth.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.etcd.etcd_client import etcd_client


class etcd_peer_client_cert_auth(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in etcd_client.etcd_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = f"Etcd is configured for peer client certificate authentication in pod {pod.name}."
            for container in pod.containers.values():
                if "--peer-client-cert-auth" not in str(
                    container.command
                ) and "--peer-client-cert-auth=true" not in str(container.command):
                    report.status = "FAIL"
                    report.status_extended = f"Etcd does not have peer client certificate authentication configured in pod {pod.name}."
                    break
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: etcd_peer_tls_config.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/etcd/etcd_peer_tls_config/etcd_peer_tls_config.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "etcd_peer_tls_config",
  "CheckTitle": "Etcd pod uses TLS for peer connections",
  "CheckType": [],
  "ServiceName": "etcd",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Pod",
  "Description": "**Etcd peer communication** is treated as secure when **TLS** is configured with a peer certificate and key (e.g., `--peer-cert-file` and `--peer-key-file`). The assessment inspects etcd containers for these options to determine whether server-to-server traffic is encrypted and authenticated.",
  "Risk": "Without **TLS** on peer links, attackers can intercept or alter Raft traffic, enabling node impersonation and **consensus manipulation**. This endangers **confidentiality** (exposed cluster state), **integrity** (tampered writes), and **availability** (quorum disruption), cascading into control-plane instability.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://etcd.io/docs/latest/op-guide/security/",
    "https://kubernetes.io/docs/tasks/administer-cluster/configure-upgrade-etcd/#securing-communication"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. SSH to the control plane node running etcd\n2. Open /etc/kubernetes/manifests/etcd.yaml\n3. Under spec.containers[0].command add:\n   - --peer-cert-file=</path/to/peer-cert-file>\n   - --peer-key-file=</path/to/peer-key-file>\n4. Save the file; kubelet will restart the etcd Pod automatically\n5. Verify the etcd container command includes both flags",
      "Terraform": "```hcl\nresource \"kubernetes_pod\" \"<example_resource_name>\" {\n  metadata {\n    name = \"<example_resource_name>\"\n  }\n  spec {\n    container {\n      name  = \"etcd\"\n      image = \"quay.io/coreos/etcd:latest\"\n      command = [\n        \"etcd\",\n        \"--peer-cert-file=</path/to/peer-cert-file>\", # Critical: enables TLS for peer connections\n        \"--peer-key-file=</path/to/peer-key-file>\"   # Critical: key for the peer TLS cert\n      ]\n    }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enforce **TLS** for etcd peer communication with unique certificates per member and mutual authentication. Apply strong cipher suites and modern protocol versions, rotate keys, and separate CAs for peers and clients. Limit network access to peer ports to trusted nodes, following **least privilege** and **defense in depth**.",
      "Url": "https://hub.prowler.com/check/etcd_peer_tls_config"
    }
  },
  "Categories": [
    "encryption",
    "cluster-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "This check is only applicable for etcd clusters. For single etcd server setups, this recommendation does not apply."
}
```

--------------------------------------------------------------------------------

---[FILE: etcd_peer_tls_config.py]---
Location: prowler-master/prowler/providers/kubernetes/services/etcd/etcd_peer_tls_config/etcd_peer_tls_config.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.etcd.etcd_client import etcd_client


class etcd_peer_tls_config(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in etcd_client.etcd_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = (
                f"Etcd is configured with TLS for peer connections in pod {pod.name}."
            )
            for container in pod.containers.values():
                if "--peer-cert-file" not in str(
                    container.command
                ) and "--peer-key-file" not in str(container.command):
                    report.status = "FAIL"
                    report.status_extended = f"Etcd does not have TLS configured for peer connections in pod {pod.name}."
                    break
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: etcd_tls_encryption.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/etcd/etcd_tls_encryption/etcd_tls_encryption.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "etcd_tls_encryption",
  "CheckTitle": "Etcd pod has TLS encryption configured",
  "CheckType": [],
  "ServiceName": "etcd",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Pod",
  "Description": "**Etcd pods** are assessed for **TLS-enabled client communication**, indicated by `--cert-file` and `--key-file` in container arguments, showing that Kubernetes API state traffic is encrypted in transit.",
  "Risk": "Without **TLS**, etcd traffic is exposed on the network, weakening CIA:\n- Confidentiality: leakage of **secrets** and cluster state\n- Integrity: **MITM** can alter configs, roles, and objects\n- Availability: control-plane instability from tampered responses",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://kubernetes.io/docs/tasks/administer-cluster/configure-upgrade-etcd/",
    "https://etcd.io/docs/latest/op-guide/security/"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. SSH to the control-plane node\n2. Open /etc/kubernetes/manifests/etcd.yaml\n3. In spec.containers[0].command add:\n   - --cert-file=/etc/kubernetes/pki/etcd/server.crt\n   - --key-file=/etc/kubernetes/pki/etcd/server.key\n4. Save the file; kubelet will automatically restart the etcd Pod\n5. Confirm the etcd container command now includes both --cert-file and --key-file",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enforce **mTLS** for etcd client and peer traffic and disable plaintext listeners. Restrict access to etcd to control-plane components via tight network policies and firewalls. Use strong TLS versions/ciphers, rotate certificates, and safeguard keys, applying **least privilege** and **defense in depth**.",
      "Url": "https://hub.prowler.com/check/etcd_tls_encryption"
    }
  },
  "Categories": [
    "encryption",
    "cluster-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "By default, etcd may not be configured with TLS encryption. It is crucial to enable TLS to protect the sensitive data handled by etcd."
}
```

--------------------------------------------------------------------------------

---[FILE: etcd_tls_encryption.py]---
Location: prowler-master/prowler/providers/kubernetes/services/etcd/etcd_tls_encryption/etcd_tls_encryption.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.etcd.etcd_client import etcd_client


class etcd_tls_encryption(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in etcd_client.etcd_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "FAIL"
            report.status_extended = (
                f"Etcd does not have TLS encryption configured in pod {pod.name}."
            )
            for container in pod.containers.values():
                if "--cert-file" in str(container.command) and "--key-file" in str(
                    container.command
                ):
                    report.status = "PASS"
                    report.status_extended = (
                        f"Etcd has configured TLS encryption in pod {pod.name}."
                    )
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

````
