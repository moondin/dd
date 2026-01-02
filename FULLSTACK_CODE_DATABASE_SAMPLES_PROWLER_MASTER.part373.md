---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 373
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 373 of 867)

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

---[FILE: controllermanager_service_account_credentials.py]---
Location: prowler-master/prowler/providers/kubernetes/services/controllermanager/controllermanager_service_account_credentials/controllermanager_service_account_credentials.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.controllermanager.controllermanager_client import (
    controllermanager_client,
)


class controllermanager_service_account_credentials(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in controllermanager_client.controllermanager_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = f"Controller Manager is not using service account credentials in pod {pod.name}."
            for container in pod.containers.values():
                if "--use-service-account-credentials=true" not in str(
                    container.command
                ):
                    report.status = "FAIL"
                    report.status_extended = f"Controller Manager is using service account credentials in pod {pod.name}."
                    break
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: controllermanager_service_account_private_key_file.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/controllermanager/controllermanager_service_account_private_key_file/controllermanager_service_account_private_key_file.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "controllermanager_service_account_private_key_file",
  "CheckTitle": "Ensure that the --service-account-private-key-file argument is set as appropriate",
  "CheckType": [],
  "ServiceName": "controllermanager",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "KubernetesControllerManager",
  "Description": "This check ensures that the Kubernetes Controller Manager is configured with the --service-account-private-key-file argument set to the private key file for service accounts.",
  "Risk": "Not setting a private key file for service accounts can hinder the ability to securely rotate service account tokens.",
  "RelatedUrl": "https://kubernetes.io/docs/reference/access-authn-authz/service-accounts-admin/",
  "Remediation": {
    "Code": {
      "CLI": "--service-account-private-key-file=/path/to/sa-key-file",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-service-account-private-key-file-argument-is-set-as-appropriate",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Configure the Controller Manager with a private key file for service accounts to maintain security and enable token rotation.",
      "Url": "https://kubernetes.io/docs/reference/access-authn-authz/service-accounts-admin/#token-controller"
    }
  },
  "Categories": [
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Ensure the private key file is securely maintained and periodically rotated as per the organization's policy."
}
```

--------------------------------------------------------------------------------

---[FILE: controllermanager_service_account_private_key_file.py]---
Location: prowler-master/prowler/providers/kubernetes/services/controllermanager/controllermanager_service_account_private_key_file/controllermanager_service_account_private_key_file.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.controllermanager.controllermanager_client import (
    controllermanager_client,
)


class controllermanager_service_account_private_key_file(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in controllermanager_client.controllermanager_pods:
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = f"Controller Manager does not have the service account private key file set in pod {pod.name}."
            for container in pod.containers.values():
                if "--service-account-private-key-file=" not in str(container.command):
                    report.status = "FAIL"
                    report.status_extended = f"Controller Manager has the service account private key file set in pod {pod.name}."
                    break
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: core_client.py]---
Location: prowler-master/prowler/providers/kubernetes/services/core/core_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.kubernetes.services.core.core_service import Core

core_client = Core(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: core_service.py]---
Location: prowler-master/prowler/providers/kubernetes/services/core/core_service.py
Signals: Pydantic

```python
import socket
from typing import List, Optional

from pydantic.v1 import BaseModel

from kubernetes import client
from prowler.lib.logger import logger
from prowler.providers.kubernetes.kubernetes_provider import KubernetesProvider
from prowler.providers.kubernetes.lib.service.service import KubernetesService


class Core(KubernetesService):
    def __init__(self, provider: KubernetesProvider):
        super().__init__(provider)
        self.client = client.CoreV1Api(self.api_client)
        self.namespaces = provider.namespaces
        self.pods = {}
        self._get_pods()
        self.config_maps = {}
        self._list_config_maps()
        self.nodes = {}
        self._list_nodes()
        self._in_worker_node()

    def _get_pods(self):
        try:
            for namespace in self.namespaces:
                pods = self.client.list_namespaced_pod(namespace)
                for pod in pods.items:
                    pod_containers = {}
                    containers = pod.spec.containers if pod.spec.containers else []
                    init_containers = (
                        pod.spec.init_containers if pod.spec.init_containers else []
                    )
                    ephemeral_containers = (
                        pod.spec.ephemeral_containers
                        if pod.spec.ephemeral_containers
                        else []
                    )
                    for container in (
                        containers + init_containers + ephemeral_containers
                    ):
                        pod_containers[container.name] = Container(
                            name=container.name,
                            image=container.image,
                            command=container.command if container.command else None,
                            ports=(
                                [
                                    {"containerPort": port.container_port}
                                    for port in container.ports
                                ]
                                if container.ports
                                else None
                            ),
                            env=(
                                [
                                    {"name": env.name, "value": env.value}
                                    for env in container.env
                                ]
                                if container.env
                                else None
                            ),
                            security_context=(
                                container.security_context.to_dict()
                                if container.security_context
                                else {}
                            ),
                        )
                    self.pods[pod.metadata.uid] = Pod(
                        name=pod.metadata.name,
                        uid=pod.metadata.uid,
                        namespace=pod.metadata.namespace,
                        labels=pod.metadata.labels,
                        annotations=pod.metadata.annotations,
                        node_name=pod.spec.node_name,
                        service_account=pod.spec.service_account_name,
                        status_phase=pod.status.phase,
                        pod_ip=pod.status.pod_ip,
                        host_ip=pod.status.host_ip,
                        host_pid=pod.spec.host_pid,
                        host_ipc=pod.spec.host_ipc,
                        host_network=pod.spec.host_network,
                        security_context=(
                            pod.spec.security_context.to_dict()
                            if pod.spec.security_context
                            else {}
                        ),
                        containers=pod_containers,
                    )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_config_maps(self):
        try:
            response = self.client.list_config_map_for_all_namespaces()
            for cm in response.items:
                self.config_maps[cm.metadata.uid] = ConfigMap(
                    name=cm.metadata.name,
                    namespace=cm.metadata.namespace,
                    uid=cm.metadata.uid,
                    data=cm.data,
                    labels=cm.metadata.labels,
                    annotations=cm.metadata.annotations,
                )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_nodes(self):
        try:
            response = self.client.list_node()
            for node in response.items:
                node_model = Node(
                    name=node.metadata.name,
                    uid=node.metadata.uid,
                    namespace=(
                        node.metadata.namespace
                        if node.metadata.namespace
                        else "cluster-wide"
                    ),
                    labels=node.metadata.labels,
                    annotations=node.metadata.annotations,
                    unschedulable=node.spec.unschedulable,
                    node_info=(
                        node.status.node_info.to_dict()
                        if node.status.node_info
                        else None
                    ),
                )
                self.nodes[node.metadata.uid] = node_model
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _in_worker_node(self):
        try:
            hostname = socket.gethostname()
            for node in self.nodes.values():
                if hostname == node.name:
                    node.inside = True

        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class Container(BaseModel):
    name: str
    image: str
    command: Optional[List[str]]
    ports: Optional[List[dict]]
    env: Optional[List[dict]]
    security_context: dict


class Pod(BaseModel):
    name: str
    uid: str
    namespace: str
    labels: Optional[dict]
    annotations: Optional[dict]
    node_name: Optional[str]
    service_account: Optional[str]
    status_phase: Optional[str]
    pod_ip: Optional[str]
    host_ip: Optional[str]
    host_pid: Optional[str]
    host_ipc: Optional[str]
    host_network: Optional[bool]
    security_context: Optional[dict]
    containers: Optional[dict]


class ConfigMap(BaseModel):
    name: str
    namespace: str
    uid: str
    data: Optional[dict]
    labels: Optional[dict]
    kubelet_args: list = []
    annotations: Optional[dict]


class Node(BaseModel):
    name: str
    uid: str
    namespace: str
    labels: Optional[dict]
    annotations: Optional[dict]
    unschedulable: Optional[bool]
    node_info: Optional[dict]
    inside: bool = False
```

--------------------------------------------------------------------------------

---[FILE: core_minimize_admission_hostport_containers.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/core/core_minimize_admission_hostport_containers/core_minimize_admission_hostport_containers.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "core_minimize_admission_hostport_containers",
  "CheckTitle": "Minimize the admission of containers which use HostPorts",
  "CheckType": [],
  "ServiceName": "core",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesPod",
  "Description": "This check ensures that Kubernetes clusters are configured to minimize the admission of containers that require the use of HostPorts. This helps maintain network policy controls and reduce security risks.",
  "Risk": "Permitting containers with HostPorts can bypass network policy controls, increasing the risk of unauthorized network access.",
  "RelatedUrl": "https://kubernetes.io/docs/concepts/security/pod-security-standards/",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/bc_k8s_25#kubernetes",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Limit the use of HostPorts in Kubernetes containers to maintain network security.",
      "Url": "https://kubernetes.io/docs/concepts/security/pod-security-standards/"
    }
  },
  "Categories": [
    "internet-exposed"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Carefully evaluate the need for HostPorts in container configurations and prefer network policies for secure communication."
}
```

--------------------------------------------------------------------------------

---[FILE: core_minimize_admission_hostport_containers.py]---
Location: prowler-master/prowler/providers/kubernetes/services/core/core_minimize_admission_hostport_containers/core_minimize_admission_hostport_containers.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.core.core_client import core_client


class core_minimize_admission_hostport_containers(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in core_client.pods.values():
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = f"Pod {pod.name} does not use HostPorts."

            for container in pod.containers.values():
                if container.ports and "host_port" in str(container.ports):
                    report.status = "FAIL"
                    report.status_extended = (
                        f"Pod {pod.name} uses HostPorts in container {container.name}."
                    )
                    break

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: core_minimize_admission_windows_hostprocess_containers.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/core/core_minimize_admission_windows_hostprocess_containers/core_minimize_admission_windows_hostprocess_containers.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "core_minimize_admission_windows_hostprocess_containers",
  "CheckTitle": "Minimize the admission of Windows HostProcess Containers",
  "CheckType": [],
  "ServiceName": "core",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesPod",
  "Description": "This check ensures that Kubernetes clusters are configured to minimize the admission of Windows containers with the hostProcess flag set to true, thus reducing the risk of privilege escalation and security breaches.",
  "Risk": "Allowing Windows containers with hostProcess can lead to increased security risks due to privileged access to Windows nodes.",
  "RelatedUrl": "https://kubernetes.io/docs/tasks/configure-pod-container/create-hostprocess-pod/",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/bc_k8s_1#kubernetes",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Restrict the use of Windows HostProcess containers unless essential for their operation.",
      "Url": "https://kubernetes.io/docs/tasks/configure-pod-container/create-hostprocess-pod/"
    }
  },
  "Categories": [
    "container-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Carefully review the need for HostProcess containers in Windows environments and restrict their use."
}
```

--------------------------------------------------------------------------------

---[FILE: core_minimize_admission_windows_hostprocess_containers.py]---
Location: prowler-master/prowler/providers/kubernetes/services/core/core_minimize_admission_windows_hostprocess_containers/core_minimize_admission_windows_hostprocess_containers.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.core.core_client import core_client


class core_minimize_admission_windows_hostprocess_containers(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in core_client.pods.values():
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = f"Pod {pod.name} does not have the ability to run a Windows HostProcess."

            for container in pod.containers.values():
                if (
                    container.security_context
                    and container.security_context["windows_options"]
                    and container.security_context["windows_options"]["host_process"]
                ):
                    report.status = "FAIL"
                    report.status_extended = f"Pod {pod.name} has the ability to run a Windows HostProcess in container {container.name}."
                    break

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: core_minimize_allowPrivilegeEscalation_containers.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/core/core_minimize_allowPrivilegeEscalation_containers/core_minimize_allowPrivilegeEscalation_containers.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "core_minimize_allowPrivilegeEscalation_containers",
  "CheckTitle": "Minimize the admission of containers with allowPrivilegeEscalation",
  "CheckType": [],
  "ServiceName": "core",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesPod",
  "Description": "This check ensures that Kubernetes clusters are configured to minimize the admission of containers that have the allowPrivilegeEscalation flag set to true, preventing processes within containers from gaining additional privileges.",
  "Risk": "Allowing containers with allowPrivilegeEscalation can lead to elevated privileges within the container's context, posing a security risk.",
  "RelatedUrl": "https://kubernetes.io/docs/concepts/security/pod-security-standards/",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/bc_k8s_19#kubernetes",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Restrict the use of allowPrivilegeEscalation in containers through admission control policies.",
      "Url": "https://kubernetes.io/docs/tasks/configure-pod-container/security-context/"
    }
  },
  "Categories": [
    "container-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Exceptions for containers requiring allowPrivilegeEscalation should be clearly defined and monitored."
}
```

--------------------------------------------------------------------------------

---[FILE: core_minimize_allowPrivilegeEscalation_containers.py]---
Location: prowler-master/prowler/providers/kubernetes/services/core/core_minimize_allowPrivilegeEscalation_containers/core_minimize_allowPrivilegeEscalation_containers.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.core.core_client import core_client


class core_minimize_allowPrivilegeEscalation_containers(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in core_client.pods.values():
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = (
                f"Pod {pod.name} does not allow for privilege escalation."
            )

            for container in pod.containers.values():
                if (
                    container.security_context
                    and container.security_context["allow_privilege_escalation"]
                ):
                    report.status = "FAIL"
                    report.status_extended = f"Pod {pod.name} allows privilege escalation in container {container.name}."
                    break

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: core_minimize_containers_added_capabilities.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/core/core_minimize_containers_added_capabilities/core_minimize_containers_added_capabilities.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "core_minimize_containers_added_capabilities",
  "CheckTitle": "Minimize the admission of containers with added capabilities",
  "CheckType": [],
  "ServiceName": "core",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesPod",
  "Description": "This check ensures that Kubernetes clusters are configured to minimize the admission of containers with capabilities assigned beyond the default set, mitigating the risks of container breakout attacks.",
  "Risk": "Allowing containers with additional capabilities increases the risk of security breaches and container breakout attacks.",
  "RelatedUrl": "https://kubernetes.io/docs/concepts/security/pod-security-standards/",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Restrict the addition of extra capabilities to containers through admission control policies.",
      "Url": "https://kubernetes.io/docs/concepts/security/pod-security-standards/"
    }
  },
  "Categories": [
    "container-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Exceptions for adding capabilities should be explicitly defined and monitored."
}
```

--------------------------------------------------------------------------------

---[FILE: core_minimize_containers_added_capabilities.py]---
Location: prowler-master/prowler/providers/kubernetes/services/core/core_minimize_containers_added_capabilities/core_minimize_containers_added_capabilities.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.core.core_client import core_client


class core_minimize_containers_added_capabilities(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in core_client.pods.values():
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = f"Pod {pod.name} does not have added capabilities."

            for container in pod.containers.values():
                if (
                    container.security_context
                    and container.security_context["capabilities"]
                    and container.security_context["capabilities"]["add"]
                ):
                    report.status = "FAIL"
                    report.status_extended = f"Pod {pod.name} has added capabilities in container {container.name}."
                    break

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: core_minimize_containers_capabilities_assigned.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/core/core_minimize_containers_capabilities_assigned/core_minimize_containers_capabilities_assigned.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "core_minimize_containers_capabilities_assigned",
  "CheckTitle": "Minimize the admission of containers with capabilities assigned",
  "CheckType": [],
  "ServiceName": "core",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesPod",
  "Description": "This check ensures that Kubernetes clusters are configured to minimize the admission of containers with Linux capabilities assigned, adhering to the principle of least privilege and reducing the risk of privilege escalation.",
  "Risk": "Assigning unnecessary Linux capabilities to containers increases the risk of privilege escalation and security breaches.",
  "RelatedUrl": "https://kubernetes.io/docs/concepts/security/pod-security-standards/",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/bc_k8s_34#kubernetes",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Restrict the assignment of Linux capabilities to containers unless essential for their operation.",
      "Url": "https://kubernetes.io/docs/concepts/security/pod-security-standards/"
    }
  },
  "Categories": [
    "container-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Review the use of capabilities in applications and ensure that only necessary capabilities are assigned."
}
```

--------------------------------------------------------------------------------

---[FILE: core_minimize_containers_capabilities_assigned.py]---
Location: prowler-master/prowler/providers/kubernetes/services/core/core_minimize_containers_capabilities_assigned/core_minimize_containers_capabilities_assigned.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.core.core_client import core_client


class core_minimize_containers_capabilities_assigned(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in core_client.pods.values():
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = (
                f"Pod {pod.name} without capabilities issues found."
            )

            for container in pod.containers.values():
                if (
                    container.security_context
                    and container.security_context["capabilities"]
                ):
                    if (
                        container.security_context["capabilities"]["add"]
                        or not container.security_context["capabilities"]["drop"]
                    ):
                        report.status = "FAIL"
                        report.status_extended = f"Pod {pod.name} has capabilities assigned or not all dropped in container {container.name}."
                        break

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: core_minimize_hostIPC_containers.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/core/core_minimize_hostIPC_containers/core_minimize_hostIPC_containers.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "core_minimize_hostIPC_containers",
  "CheckTitle": "Minimize the admission of containers wishing to share the host IPC namespace",
  "CheckType": [],
  "ServiceName": "core",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesPod",
  "Description": "This check ensures that Kubernetes clusters are configured to minimize the admission of containers that share the host's IPC namespace. Containers with hostIPC can interact with processes outside of the container, potentially leading to security risks.",
  "Risk": "Allowing containers to share the host's IPC namespace without strict control can lead to security risks and potential privilege escalations.",
  "RelatedUrl": "https://kubernetes.io/docs/concepts/security/pod-security-standards/",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/bc_k8s_3#kubernetes",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Restrict the use of hostIPC in containers through admission control policies.",
      "Url": "https://kubernetes.io/docs/concepts/security/pod-security-standards/"
    }
  },
  "Categories": [
    "container-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Exceptions for hostIPC containers should be clearly defined and monitored."
}
```

--------------------------------------------------------------------------------

---[FILE: core_minimize_hostIPC_containers.py]---
Location: prowler-master/prowler/providers/kubernetes/services/core/core_minimize_hostIPC_containers/core_minimize_hostIPC_containers.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.core.core_client import core_client


class core_minimize_hostIPC_containers(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in core_client.pods.values():
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            if pod.host_ipc:
                report.status = "FAIL"
                report.status_extended = f"Pod {pod.name} is using hostIPC."
            else:
                report.status = "PASS"
                report.status_extended = f"Pod {pod.name} is not using hostIPC."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: core_minimize_hostNetwork_containers.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/core/core_minimize_hostNetwork_containers/core_minimize_hostNetwork_containers.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "core_minimize_hostNetwork_containers",
  "CheckTitle": "Minimize the admission of containers wishing to share the host network namespace",
  "CheckType": [],
  "ServiceName": "core",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesPod",
  "Description": "This check ensures that Kubernetes clusters are configured to minimize the admission of containers that share the host's network namespace. Containers with hostNetwork can access local network traffic and other pods, potentially leading to security risks.",
  "Risk": "Allowing containers to share the host's network namespace without strict control can lead to security risks and potential network breaches.",
  "RelatedUrl": "https://kubernetes.io/docs/concepts/security/pod-security-standards/",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/bc_k8s_4#kubernetes",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Restrict the use of hostNetwork in containers through admission control policies.",
      "Url": "https://kubernetes.io/docs/concepts/security/pod-security-standards/"
    }
  },
  "Categories": [
    "container-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Exceptions for hostNetwork containers should be clearly defined and monitored."
}
```

--------------------------------------------------------------------------------

---[FILE: core_minimize_hostNetwork_containers.py]---
Location: prowler-master/prowler/providers/kubernetes/services/core/core_minimize_hostNetwork_containers/core_minimize_hostNetwork_containers.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.core.core_client import core_client


class core_minimize_hostNetwork_containers(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in core_client.pods.values():
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            if pod.host_network:
                report.status = "FAIL"
                report.status_extended = f"Pod {pod.name} is using hostNetwork."
            else:
                report.status = "PASS"
                report.status_extended = f"Pod {pod.name} is not using hostNetwork."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: core_minimize_hostPID_containers.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/core/core_minimize_hostPID_containers/core_minimize_hostPID_containers.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "core_minimize_hostPID_containers",
  "CheckTitle": "Minimize the admission of containers wishing to share the host process ID namespace",
  "CheckType": [],
  "ServiceName": "core",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesPod",
  "Description": "This check ensures that Kubernetes clusters are configured to minimize the admission of containers that share the host's process ID namespace. Containers with hostPID can inspect and interact with processes outside of the container, potentially leading to privilege escalation.",
  "Risk": "Allowing containers to share the host's PID namespace without strict control can lead to security risks and potential privilege escalations.",
  "RelatedUrl": "https://kubernetes.io/docs/concepts/security/pod-security-standards/",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/bc_k8s_1#kubernetes",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Restrict the use of hostPID in containers through admission control policies.",
      "Url": "https://kubernetes.io/docs/concepts/security/pod-security-standards/"
    }
  },
  "Categories": [
    "container-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Exceptions for hostPID containers should be clearly defined and monitored."
}
```

--------------------------------------------------------------------------------

---[FILE: core_minimize_hostPID_containers.py]---
Location: prowler-master/prowler/providers/kubernetes/services/core/core_minimize_hostPID_containers/core_minimize_hostPID_containers.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.core.core_client import core_client


class core_minimize_hostPID_containers(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in core_client.pods.values():
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            if pod.host_pid:
                report.status = "FAIL"
                report.status_extended = f"Pod {pod.name} is using hostPID."
            else:
                report.status = "PASS"
                report.status_extended = f"Pod {pod.name} is not using hostPID."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: core_minimize_net_raw_capability_admission.metadata.json]---
Location: prowler-master/prowler/providers/kubernetes/services/core/core_minimize_net_raw_capability_admission/core_minimize_net_raw_capability_admission.metadata.json

```json
{
  "Provider": "kubernetes",
  "CheckID": "core_minimize_net_raw_capability_admission",
  "CheckTitle": "Minimize the admission of containers with the NET_RAW capability",
  "CheckType": [],
  "ServiceName": "core",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "KubernetesPod",
  "Description": "This check ensures that Kubernetes clusters are configured to minimize the admission of containers with the potentially dangerous NET_RAW capability, which can be exploited by malicious containers.",
  "Risk": "Allowing containers with NET_RAW capability increases the risk of network attacks and privilege escalation.",
  "RelatedUrl": "https://kubernetes.io/docs/tasks/configure-pod-container/security-context",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/bc_k8s_6#kubernetes",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Restrict the use of NET_RAW capability through admission control policies.",
      "Url": "https://kubernetes.io/docs/tasks/configure-pod-container/security-context/#set-capabilities-for-a-container"
    }
  },
  "Categories": [
    "container-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Exceptions for NET_RAW capability should be clearly defined and monitored."
}
```

--------------------------------------------------------------------------------

---[FILE: core_minimize_net_raw_capability_admission.py]---
Location: prowler-master/prowler/providers/kubernetes/services/core/core_minimize_net_raw_capability_admission/core_minimize_net_raw_capability_admission.py

```python
from prowler.lib.check.models import Check, Check_Report_Kubernetes
from prowler.providers.kubernetes.services.core.core_client import core_client


class core_minimize_net_raw_capability_admission(Check):
    def execute(self) -> Check_Report_Kubernetes:
        findings = []
        for pod in core_client.pods.values():
            report = Check_Report_Kubernetes(metadata=self.metadata(), resource=pod)
            report.status = "PASS"
            report.status_extended = f"Pod {pod.name} does not have NET_RAW capability."
            for container in pod.containers.values():
                security_context = getattr(container, "security_context", None)
                if security_context:
                    capabilities = getattr(security_context, "capabilities", None)
                    if capabilities:
                        add_capabilities = getattr(capabilities, "add", [])
                        if add_capabilities and "NET_RAW" in add_capabilities:
                            report.status = "FAIL"
                            report.status_extended = f"Pod {pod.name} has NET_RAW capability in container {container.name}."
                            break

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
