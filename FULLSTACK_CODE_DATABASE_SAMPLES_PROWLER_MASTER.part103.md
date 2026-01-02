---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 103
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 103 of 867)

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

---[FILE: example_output_gcp.ocsf.json]---
Location: prowler-master/examples/output/example_output_gcp.ocsf.json

```json
[
  {
    "message": "Project <project_id> does not have active API Keys.",
    "metadata": {
      "event_code": "apikeys_key_exists",
      "product": {
        "name": "Prowler",
        "uid": "prowler",
        "vendor_name": "Prowler",
        "version": "5.4.0"
      },
      "profiles": [
        "cloud",
        "datetime"
      ],
      "tenant_uid": "<tenant_uid>",
      "version": "1.4.0"
    },
    "severity_id": 3,
    "severity": "Medium",
    "status": "New",
    "status_code": "PASS",
    "status_detail": "Project <project_id> does not have active API Keys.",
    "status_id": 1,
    "unmapped": {
      "related_url": "",
      "categories": [],
      "depends_on": [],
      "related_to": [],
      "additional_urls": [],
      "notes": "",
      "compliance": {
        "MITRE-ATTACK": [
          "T1098"
        ],
        "CIS-2.0": [
          "1.12"
        ],
        "ENS-RD2022": [
          "op.acc.2.gcp.rbak.1"
        ],
        "CIS-3.0": [
          "1.12"
        ]
      }
    },
    "activity_name": "Create",
    "activity_id": 1,
    "finding_info": {
      "created_time": 1739539640,
      "created_time_dt": "2025-02-14T14:27:20.697446",
      "desc": "API Keys should only be used for services in cases where other authentication methods are unavailable. Unused keys with their permissions in tact may still exist within a project. Keys are insecure because they can be viewed publicly, such as from within a browser, or they can be accessed on a device where the key resides. It is recommended to use standard authentication flow instead.",
      "product_uid": "prowler",
      "title": "Ensure API Keys Only Exist for Active Services",
      "types": [],
      "uid": "<finding_uid>"
    },
    "resources": [
      {
        "region": "global",
        "data": {
          "details": "",
          "metadata": {
            "number": "<uid>",
            "id": "<project_id>",
            "name": "<project_name>",
            "organization": {
              "id": "<tenant_uid>",
              "name": "organizations/<tenant_uid>",
              "display_name": "prowler.com"
            },
            "labels": {
              "tag": "test",
              "tag2": "test2",
              "generative-language": "enabled"
            },
            "lifecycle_state": "ACTIVE"
          }
        },
        "group": {
          "name": "apikeys"
        },
        "labels": [],
        "name": "<project_name>",
        "type": "API Key",
        "uid": "<project_id>"
      }
    ],
    "category_name": "Findings",
    "category_uid": 2,
    "class_name": "Detection Finding",
    "class_uid": 2004,
    "cloud": {
      "account": {
        "name": "<project_name>",
        "type": "GCP Account",
        "type_id": 5,
        "uid": "<project_id>",
        "labels": [
          "tag:test"
        ]
      },
      "org": {
        "name": "prowler.com",
        "uid": "<tenant_uid>"
      },
      "provider": "gcp",
      "region": "global"
    },
    "remediation": {
      "desc": "To avoid the security risk in using API keys, it is recommended to use standard authentication flow instead.",
      "references": [
        "gcloud alpha services api-keys delete",
        "https://cloud.google.com/docs/authentication/api-keys"
      ]
    },
    "risk_details": "Security risks involved in using API-Keys appear below: API keys are simple encrypted strings, API keys do not identify the user or the application making the API request, API keys are typically accessible to clients, making it easy to discover and steal an API key.",
    "time": 1739539640,
    "time_dt": "2025-02-14T14:27:20.697446",
    "type_uid": 200401,
    "type_name": "Detection Finding: Create"
  },
  {
    "message": "AR Container Analysis is not enabled in project <project_id>.",
    "metadata": {
      "event_code": "artifacts_container_analysis_enabled",
      "product": {
        "name": "Prowler",
        "uid": "prowler",
        "vendor_name": "Prowler",
        "version": "5.4.0"
      },
      "profiles": [
        "cloud",
        "datetime"
      ],
      "tenant_uid": "<tenant_uid>",
      "version": "1.4.0"
    },
    "severity_id": 3,
    "severity": "Medium",
    "status": "New",
    "status_code": "FAIL",
    "status_detail": "AR Container Analysis is not enabled in project <project_id>.",
    "status_id": 1,
    "unmapped": {
      "related_url": "https://cloud.google.com/artifact-analysis/docs",
      "categories": [],
      "depends_on": [],
      "related_to": [],
      "additional_urls": [],
      "notes": "By default, AR Container Analysis is disabled.",
      "compliance": {
        "MITRE-ATTACK": [
          "T1525"
        ],
        "ENS-RD2022": [
          "op.exp.4.r4.gcp.log.1",
          "op.mon.3.gcp.scc.1"
        ]
      }
    },
    "activity_name": "Create",
    "activity_id": 1,
    "finding_info": {
      "created_time": 1739539640,
      "created_time_dt": "2025-02-14T14:27:20.697446",
      "desc": "Scan images stored in Google Container Registry (GCR) for vulnerabilities using AR Container Analysis or a third-party provider. This helps identify and mitigate security risks associated with known vulnerabilities in container images.",
      "product_uid": "prowler",
      "title": "Ensure Image Vulnerability Analysis using AR Container Analysis or a third-party provider",
      "types": [
        "Security",
        "Configuration"
      ],
      "uid": "<finding_uid>"
    },
    "resources": [
      {
        "region": "global",
        "data": {
          "details": "",
          "metadata": {
            "number": "538174383574",
            "id": "<project_id>",
            "name": "<project_name>",
            "organization": {
              "id": "<tenant_uid>",
              "name": "organizations/<tenant_uid>",
              "display_name": "prowler.com"
            },
            "labels": {
              "tag": "test",
              "tag2": "test2",
              "generative-language": "enabled"
            },
            "lifecycle_state": "ACTIVE"
          }
        },
        "group": {
          "name": "artifacts"
        },
        "labels": [],
        "name": "AR Container Analysis",
        "type": "Service",
        "uid": "containeranalysis.googleapis.com"
      }
    ],
    "category_name": "Findings",
    "category_uid": 2,
    "class_name": "Detection Finding",
    "class_uid": 2004,
    "cloud": {
      "account": {
        "name": "<project_name>",
        "type": "GCP Account",
        "type_id": 5,
        "uid": "<project_id>",
        "labels": [
          "tag:test"
        ]
      },
      "org": {
        "name": "prowler.com",
        "uid": "<tenant_uid>"
      },
      "provider": "gcp",
      "region": "global"
    },
    "remediation": {
      "desc": "Enable vulnerability scanning for images stored in Artifact Registry using AR Container Analysis or a third-party provider.",
      "references": [
        "gcloud services enable containeranalysis.googleapis.com",
        "https://cloud.google.com/artifact-analysis/docs/container-scanning-overview"
      ]
    },
    "risk_details": "Without image vulnerability scanning, container images stored in Artifact Registry may contain known vulnerabilities, increasing the risk of exploitation by malicious actors.",
    "time": 1739539640,
    "time_dt": "2025-02-14T14:27:20.697446",
    "type_uid": 200401,
    "type_name": "Detection Finding: Create"
  },
  {
    "message": "Firewall <resource_id> does not expose port 3389 (RDP) to the internet.",
    "metadata": {
      "event_code": "compute_firewall_rdp_access_from_the_internet_allowed",
      "product": {
        "name": "Prowler",
        "uid": "prowler",
        "vendor_name": "Prowler",
        "version": "5.4.0"
      },
      "profiles": [
        "cloud",
        "datetime"
      ],
      "tenant_uid": "<tenant_uid>",
      "version": "1.4.0"
    },
    "severity_id": 5,
    "severity": "Critical",
    "status": "New",
    "status_code": "PASS",
    "status_detail": "Firewall <resource_id> does not expose port 3389 (RDP) to the internet.",
    "status_id": 1,
    "unmapped": {
      "related_url": "",
      "categories": [
        "internet-exposed"
      ],
      "depends_on": [],
      "related_to": [],
      "additional_urls": [],
      "notes": "",
      "compliance": {
        "MITRE-ATTACK": [
          "T1190",
          "T1199",
          "T1048",
          "T1498",
          "T1046"
        ],
        "CIS-2.0": [
          "3.7"
        ],
        "ENS-RD2022": [
          "mp.com.1.gcp.fw.1"
        ],
        "CIS-3.0": [
          "3.7"
        ]
      }
    },
    "activity_name": "Create",
    "activity_id": 1,
    "finding_info": {
      "created_time": 1739539640,
      "created_time_dt": "2025-02-14T14:27:20.697446",
      "desc": "GCP `Firewall Rules` are specific to a `VPC Network`. Each rule either `allows` or `denies` traffic when its conditions are met. Its conditions allow users to specify the type of traffic, such as ports and protocols, and the source or destination of the traffic, including IP addresses, subnets, and instances. Firewall rules are defined at the VPC network level and are specific to the network in which they are defined. The rules themselves cannot be shared among networks. Firewall rules only support IPv4 traffic. When specifying a source for an ingress rule or a destination for an egress rule by address, an `IPv4` address or `IPv4 block in CIDR` notation can be used. Generic `(0.0.0.0/0)` incoming traffic from the Internet to a VPC or VM instance using `RDP` on `Port 3389` can be avoided.",
      "product_uid": "prowler",
      "title": "Ensure That RDP Access Is Restricted From the Internet",
      "types": [],
      "uid": "<finding_uid>"
    },
    "resources": [
      {
        "region": "global",
        "data": {
          "details": "",
          "metadata": {
            "name": "<resource_id>",
            "id": "<uid>",
            "source_ranges": [
              "<value>"
            ],
            "direction": "INGRESS",
            "allowed_rules": [
              {
                "IPProtocol": "icmp"
              }
            ],
            "project_id": "<project_id>"
          }
        },
        "group": {
          "name": "networking"
        },
        "labels": [],
        "name": "<resource_id>",
        "type": "FirewallRule",
        "uid": "<uid>"
      }
    ],
    "category_name": "Findings",
    "category_uid": 2,
    "class_name": "Detection Finding",
    "class_uid": 2004,
    "cloud": {
      "account": {
        "name": "<project_name>",
        "type": "GCP Account",
        "type_id": 5,
        "uid": "<project_id>",
        "labels": [
          "tag:test",
          "tag2:test2"
        ]
      },
      "org": {
        "name": "prowler.com",
        "uid": "<tenant_uid>"
      },
      "provider": "gcp",
      "region": "global"
    },
    "remediation": {
      "desc": "Ensure that Google Cloud Virtual Private Cloud (VPC) firewall rules do not allow unrestricted access (i.e. 0.0.0.0/0) on TCP port 3389 in order to restrict Remote Desktop Protocol (RDP) traffic to trusted IP addresses or IP ranges only and reduce the attack surface. TCP port 3389 is used for secure remote GUI login to Windows VM instances by connecting a RDP client application with an RDP server.",
      "references": [
        "https://docs.prowler.com/checks/gcp/google-cloud-networking-policies/bc_gcp_networking_2#terraform",
        "https://docs.prowler.com/checks/gcp/google-cloud-networking-policies/bc_gcp_networking_2#cli-command",
        "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudVPC/unrestricted-rdp-access.html",
        "https://cloud.google.com/vpc/docs/using-firewalls"
      ]
    },
    "risk_details": "Allowing unrestricted Remote Desktop Protocol (RDP) access can increase opportunities for malicious activities such as hacking, Man-In-The-Middle attacks (MITM) and Pass-The-Hash (PTH) attacks.",
    "time": 1739539640,
    "time_dt": "2025-02-14T14:27:20.697446",
    "type_uid": 200401,
    "type_name": "Detection Finding: Create"
  },
  {
    "message": "Firewall <resource_id> does not expose port 3389 (RDP) to the internet.",
    "metadata": {
      "event_code": "compute_firewall_rdp_access_from_the_internet_allowed",
      "product": {
        "name": "Prowler",
        "uid": "prowler",
        "vendor_name": "Prowler",
        "version": "5.4.0"
      },
      "profiles": [
        "cloud",
        "datetime"
      ],
      "tenant_uid": "<tenant_uid>",
      "version": "1.4.0"
    },
    "severity_id": 5,
    "severity": "Critical",
    "status": "New",
    "status_code": "PASS",
    "status_detail": "Firewall <resource_id> does not expose port 3389 (RDP) to the internet.",
    "status_id": 1,
    "unmapped": {
      "related_url": "",
      "categories": [
        "internet-exposed"
      ],
      "depends_on": [],
      "related_to": [],
      "additional_urls": [],
      "notes": "",
      "compliance": {
        "MITRE-ATTACK": [
          "T1190",
          "T1199",
          "T1048",
          "T1498",
          "T1046"
        ],
        "CIS-2.0": [
          "3.7"
        ],
        "ENS-RD2022": [
          "mp.com.1.gcp.fw.1"
        ],
        "CIS-3.0": [
          "3.7"
        ]
      }
    },
    "activity_name": "Create",
    "activity_id": 1,
    "finding_info": {
      "created_time": 1739539640,
      "created_time_dt": "2025-02-14T14:27:20.697446",
      "desc": "GCP `Firewall Rules` are specific to a `VPC Network`. Each rule either `allows` or `denies` traffic when its conditions are met. Its conditions allow users to specify the type of traffic, such as ports and protocols, and the source or destination of the traffic, including IP addresses, subnets, and instances. Firewall rules are defined at the VPC network level and are specific to the network in which they are defined. The rules themselves cannot be shared among networks. Firewall rules only support IPv4 traffic. When specifying a source for an ingress rule or a destination for an egress rule by address, an `IPv4` address or `IPv4 block in CIDR` notation can be used. Generic `(0.0.0.0/0)` incoming traffic from the Internet to a VPC or VM instance using `RDP` on `Port 3389` can be avoided.",
      "product_uid": "prowler",
      "title": "Ensure That RDP Access Is Restricted From the Internet",
      "types": [],
      "uid": "<finding_uid>"
    },
    "resources": [
      {
        "region": "global",
        "data": {
          "details": "",
          "metadata": {
            "name": "<resource_id>",
            "id": "<uid>",
            "source_ranges": [
              "<value>"
            ],
            "direction": "INGRESS",
            "allowed_rules": [
              {
                "IPProtocol": "tcp",
                "ports": [
                  "0-65535"
                ]
              },
              {
                "IPProtocol": "udp",
                "ports": [
                  "0-65535"
                ]
              },
              {
                "IPProtocol": "icmp"
              }
            ],
            "project_id": "<project_id>"
          }
        },
        "group": {
          "name": "networking"
        },
        "labels": [],
        "name": "<resource_id>",
        "type": "FirewallRule",
        "uid": "<uid>"
      }
    ],
    "category_name": "Findings",
    "category_uid": 2,
    "class_name": "Detection Finding",
    "class_uid": 2004,
    "cloud": {
      "account": {
        "name": "<project_name>",
        "type": "GCP Account",
        "type_id": 5,
        "uid": "<project_id>",
        "labels": [
          "tag:test",
          "tag2:test2"
        ]
      },
      "org": {
        "name": "prowler.com",
        "uid": "<tenant_uid>"
      },
      "provider": "gcp",
      "region": "global"
    },
    "remediation": {
      "desc": "Ensure that Google Cloud Virtual Private Cloud (VPC) firewall rules do not allow unrestricted access (i.e. 0.0.0.0/0) on TCP port 3389 in order to restrict Remote Desktop Protocol (RDP) traffic to trusted IP addresses or IP ranges only and reduce the attack surface. TCP port 3389 is used for secure remote GUI login to Windows VM instances by connecting a RDP client application with an RDP server.",
      "references": [
        "https://docs.prowler.com/checks/gcp/google-cloud-networking-policies/bc_gcp_networking_2#terraform",
        "https://docs.prowler.com/checks/gcp/google-cloud-networking-policies/bc_gcp_networking_2#cli-command",
        "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudVPC/unrestricted-rdp-access.html",
        "https://cloud.google.com/vpc/docs/using-firewalls"
      ]
    },
    "risk_details": "Allowing unrestricted Remote Desktop Protocol (RDP) access can increase opportunities for malicious activities such as hacking, Man-In-The-Middle attacks (MITM) and Pass-The-Hash (PTH) attacks.",
    "time": 1739539640,
    "time_dt": "2025-02-14T14:27:20.697446",
    "type_uid": 200401,
    "type_name": "Detection Finding: Create"
  },
  {
    "message": "Firewall <resource_id> does exposes port 3389 (RDP) to the internet.",
    "metadata": {
      "event_code": "compute_firewall_rdp_access_from_the_internet_allowed",
      "product": {
        "name": "Prowler",
        "uid": "prowler",
        "vendor_name": "Prowler",
        "version": "5.4.0"
      },
      "profiles": [
        "cloud",
        "datetime"
      ],
      "tenant_uid": "<tenant_uid>",
      "version": "1.4.0"
    },
    "severity_id": 5,
    "severity": "Critical",
    "status": "New",
    "status_code": "FAIL",
    "status_detail": "Firewall <resource_id> does exposes port 3389 (RDP) to the internet.",
    "status_id": 1,
    "unmapped": {
      "related_url": "",
      "categories": [
        "internet-exposed"
      ],
      "depends_on": [],
      "related_to": [],
      "additional_urls": [],
      "notes": "",
      "compliance": {
        "MITRE-ATTACK": [
          "T1190",
          "T1199",
          "T1048",
          "T1498",
          "T1046"
        ],
        "CIS-2.0": [
          "3.7"
        ],
        "ENS-RD2022": [
          "mp.com.1.gcp.fw.1"
        ],
        "CIS-3.0": [
          "3.7"
        ]
      }
    },
    "activity_name": "Create",
    "activity_id": 1,
    "finding_info": {
      "created_time": 1739539640,
      "created_time_dt": "2025-02-14T14:27:20.697446",
      "desc": "GCP `Firewall Rules` are specific to a `VPC Network`. Each rule either `allows` or `denies` traffic when its conditions are met. Its conditions allow users to specify the type of traffic, such as ports and protocols, and the source or destination of the traffic, including IP addresses, subnets, and instances. Firewall rules are defined at the VPC network level and are specific to the network in which they are defined. The rules themselves cannot be shared among networks. Firewall rules only support IPv4 traffic. When specifying a source for an ingress rule or a destination for an egress rule by address, an `IPv4` address or `IPv4 block in CIDR` notation can be used. Generic `(0.0.0.0/0)` incoming traffic from the Internet to a VPC or VM instance using `RDP` on `Port 3389` can be avoided.",
      "product_uid": "prowler",
      "title": "Ensure That RDP Access Is Restricted From the Internet",
      "types": [],
      "uid": "<finding_uid>"
    },
    "resources": [
      {
        "region": "global",
        "data": {
          "details": "",
          "metadata": {
            "name": "<resource_id>",
            "id": "<uid>",
            "source_ranges": [
              "<value>"
            ],
            "direction": "INGRESS",
            "allowed_rules": [
              {
                "IPProtocol": "tcp",
                "ports": [
                  "3389"
                ]
              }
            ],
            "project_id": "<project_id>"
          }
        },
        "group": {
          "name": "networking"
        },
        "labels": [],
        "name": "<resource_id>",
        "type": "FirewallRule",
        "uid": "<uid>"
      }
    ],
    "category_name": "Findings",
    "category_uid": 2,
    "class_name": "Detection Finding",
    "class_uid": 2004,
    "cloud": {
      "account": {
        "name": "<project_name>",
        "type": "GCP Account",
        "type_id": 5,
        "uid": "<project_id>",
        "labels": [
          "tag:test",
          "tag2:test2"
        ]
      },
      "org": {
        "name": "prowler.com",
        "uid": "<tenant_uid>"
      },
      "provider": "gcp",
      "region": "global"
    },
    "remediation": {
      "desc": "Ensure that Google Cloud Virtual Private Cloud (VPC) firewall rules do not allow unrestricted access (i.e. 0.0.0.0/0) on TCP port 3389 in order to restrict Remote Desktop Protocol (RDP) traffic to trusted IP addresses or IP ranges only and reduce the attack surface. TCP port 3389 is used for secure remote GUI login to Windows VM instances by connecting a RDP client application with an RDP server.",
      "references": [
        "https://docs.prowler.com/checks/gcp/google-cloud-networking-policies/bc_gcp_networking_2#terraform",
        "https://docs.prowler.com/checks/gcp/google-cloud-networking-policies/bc_gcp_networking_2#cli-command",
        "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudVPC/unrestricted-rdp-access.html",
        "https://cloud.google.com/vpc/docs/using-firewalls"
      ]
    },
    "risk_details": "Allowing unrestricted Remote Desktop Protocol (RDP) access can increase opportunities for malicious activities such as hacking, Man-In-The-Middle attacks (MITM) and Pass-The-Hash (PTH) attacks.",
    "time": 1739539640,
    "time_dt": "2025-02-14T14:27:20.697446",
    "type_uid": 200401,
    "type_name": "Detection Finding: Create"
  }
]
```

--------------------------------------------------------------------------------

---[FILE: example_output_kubernetes.csv]---
Location: prowler-master/examples/output/example_output_kubernetes.csv

```text
AUTH_METHOD;TIMESTAMP;ACCOUNT_UID;ACCOUNT_NAME;ACCOUNT_EMAIL;ACCOUNT_ORGANIZATION_UID;ACCOUNT_ORGANIZATION_NAME;ACCOUNT_TAGS;FINDING_UID;PROVIDER;CHECK_ID;CHECK_TITLE;CHECK_TYPE;STATUS;STATUS_EXTENDED;MUTED;SERVICE_NAME;SUBSERVICE_NAME;SEVERITY;RESOURCE_TYPE;RESOURCE_UID;RESOURCE_NAME;RESOURCE_DETAILS;RESOURCE_TAGS;PARTITION;REGION;DESCRIPTION;RISK;RELATED_URL;REMEDIATION_RECOMMENDATION_TEXT;REMEDIATION_RECOMMENDATION_URL;REMEDIATION_CODE_NATIVEIAC;REMEDIATION_CODE_TERRAFORM;REMEDIATION_CODE_CLI;REMEDIATION_CODE_OTHER;COMPLIANCE;CATEGORIES;DEPENDS_ON;RELATED_TO;NOTES;PROWLER_VERSION;ADDITIONAL_URLS
<auth_method>;2025-02-14 14:27:38.533897;<account_uid>;context: <context>;;;;;<finding_uid>;kubernetes;apiserver_always_pull_images_plugin;Ensure that the admission control plugin AlwaysPullImages is set;;FAIL;AlwaysPullImages admission control plugin is not set in pod <resource_uid>;False;apiserver;;medium;KubernetesAPIServer;<resource_id>;<resource_name>;;;;namespace: kube-system;This check verifies that the AlwaysPullImages admission control plugin is enabled in the Kubernetes API server. This plugin ensures that every new pod always pulls the required images, enforcing image access control and preventing the use of possibly outdated or altered images.;Without AlwaysPullImages, once an image is pulled to a node, any pod can use it without any authorization check, potentially leading to security risks.;https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages;Configure the API server to use the AlwaysPullImages admission control plugin to ensure image security and integrity.;https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers;https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-admission-control-plugin-alwayspullimages-is-set#kubernetes;;--enable-admission-plugins=...,AlwaysPullImages,...;;CIS-1.10: 1.2.11 | CIS-1.8: 1.2.11;cluster-security;;;Enabling AlwaysPullImages can increase network and registry load and decrease container startup speed. It may not be suitable for all environments.;<prowler_version>;https://kubernetes.io/docs/concepts/containers/images/ | https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/
<auth_method>;2025-02-14 14:27:38.533897;<account_uid>;context: <context>;;;;;<finding_uid>;kubernetes;apiserver_anonymous_requests;Ensure that the --anonymous-auth argument is set to false;;PASS;API Server does not have anonymous-auth enabled in pod <resource_uid>;False;apiserver;;high;KubernetesAPIServer;<resource_id>;<resource_name>;;;;namespace: kube-system;Disable anonymous requests to the API server. When enabled, requests that are not rejected by other configured authentication methods are treated as anonymous requests, which are then served by the API server. Disallowing anonymous requests strengthens security by ensuring all access is authenticated.;Enabling anonymous access to the API server can expose the cluster to unauthorized access and potential security vulnerabilities.;https://kubernetes.io/docs/admin/authentication/#anonymous-requests;Ensure the --anonymous-auth argument in the API server is set to false. This will reject all anonymous requests, enforcing authenticated access to the server.;https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/;https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-anonymous-auth-argument-is-set-to-false-1#kubernetes;;--anonymous-auth=false;;CIS-1.10: 1.2.1 | CIS-1.8: 1.2.1;trustboundaries;;;While anonymous access can be useful for health checks and discovery, consider the security implications for your specific environment.;<prowler_version>;https://kubernetes.io/docs/concepts/containers/images/ | https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/
<auth_method>;2025-02-14 14:27:38.533897;<account_uid>;context: <context>;;;;;<finding_uid>;kubernetes;apiserver_audit_log_maxage_set;Ensure that the --audit-log-maxage argument is set to 30 or as appropriate;;FAIL;Audit log max age is not set to 30 or as appropriate in pod <resource_uid>;False;apiserver;;medium;KubernetesAPIServer;<resource_id>;<resource_name>;;;;namespace: kube-system;This check ensures that the Kubernetes API server is configured with an appropriate audit log retention period. Setting --audit-log-maxage to 30 or as per business requirements helps in maintaining logs for sufficient time to investigate past events.;Without an adequate log retention period, there may be insufficient audit history to investigate and analyze past events or security incidents.;https://kubernetes.io/docs/concepts/cluster-administration/audit/;Configure the API server audit log retention period to retain logs for at least 30 days or as per your organization's requirements.;https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/;https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-audit-log-maxage-argument-is-set-to-30-or-as-appropriate#kubernetes;;--audit-log-maxage=30;;CIS-1.10: 1.2.17 | CIS-1.8: 1.2.18;logging;;;Ensure the audit log retention period is set appropriately to balance between storage constraints and the need for historical data.;<prowler_version>;https://kubernetes.io/docs/concepts/containers/images/ | https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/
<auth_method>;2025-02-14 14:27:38.533897;<account_uid>;context: <context>;;;;;<finding_uid>;kubernetes;apiserver_audit_log_maxbackup_set;Ensure that the --audit-log-maxbackup argument is set to 10 or as appropriate;;FAIL;Audit log max backup is not set to 10 or as appropriate in pod <resource_uid>;False;apiserver;;medium;KubernetesAPIServer;<resource_id>;<resource_name>;;;;namespace: kube-system;This check ensures that the Kubernetes API server is configured with an appropriate number of audit log backups. Setting --audit-log-maxbackup to 10 or as per business requirements helps maintain a sufficient log backup for investigations or analysis.;Without an adequate number of audit log backups, there may be insufficient log history to investigate past events or security incidents.;https://kubernetes.io/docs/concepts/cluster-administration/audit/;Configure the API server audit log backup retention to 10 or as per your organization's requirements.;https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/;https://docs.prowler.com/checks/kubernetes/kubernetes-policy-index/ensure-that-the-audit-log-maxbackup-argument-is-set-to-10-or-as-appropriate#kubernetes;;--audit-log-maxbackup=10;;CIS-1.10: 1.2.18 | CIS-1.8: 1.2.19;logging;;;Ensure the audit log backup retention period is set appropriately to balance between storage constraints and the need for historical data.;<prowler_version>;https://kubernetes.io/docs/concepts/containers/images/ | https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/
```

--------------------------------------------------------------------------------

````
