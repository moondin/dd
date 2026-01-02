---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 101
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 101 of 867)

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

---[FILE: example_output_aws.ocsf.json]---
Location: prowler-master/examples/output/example_output_aws.ocsf.json

```json
[
  {
    "message": "IAM Access Analyzer in account <account_uid> is not enabled.",
    "metadata": {
      "event_code": "accessanalyzer_enabled",
      "product": {
        "name": "Prowler",
        "uid": "prowler",
        "vendor_name": "Prowler",
        "version": "<prowler_version>"
      },
      "profiles": [
        "cloud",
        "datetime"
      ],
      "tenant_uid": "",
      "version": "1.4.0"
    },
    "severity_id": 2,
    "severity": "Low",
    "status": "New",
    "status_code": "FAIL",
    "status_detail": "IAM Access Analyzer in account <account_uid> is not enabled.",
    "status_id": 1,
    "unmapped": {
      "related_url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html",
      "categories": [],
      "depends_on": [],
      "related_to": [],
      "additional_urls": [],
      "notes": "",
      "compliance": {
        "CIS-1.4": [
          "1.20"
        ],
        "CIS-1.5": [
          "1.20"
        ],
        "KISA-ISMS-P-2023": [
          "2.5.6",
          "2.6.4",
          "2.8.1",
          "2.8.2"
        ],
        "CIS-2.0": [
          "1.20"
        ],
        "KISA-ISMS-P-2023-korean": [
          "2.5.6",
          "2.6.4",
          "2.8.1",
          "2.8.2"
        ],
        "AWS-Account-Security-Onboarding": [
          "Enabled security services",
          "Create analyzers in each active regions",
          "Verify that events are present in SecurityHub aggregated view"
        ],
        "CIS-3.0": [
          "1.20"
        ]
      }
    },
    "activity_name": "Create",
    "activity_id": 1,
    "finding_info": {
      "created_time": 1739539623,
      "created_time_dt": "2025-02-14T14:27:03.913874",
      "desc": "Check if IAM Access Analyzer is enabled",
      "product_uid": "prowler",
      "title": "Check if IAM Access Analyzer is enabled",
      "types": [
        "IAM"
      ],
      "uid": "<finding_uid>"
    },
    "resources": [
      {
        "cloud_partition": "aws",
        "region": "<region>",
        "data": {
          "details": "",
          "metadata": {
            "arn": "<resource_arn>",
            "name": "<resource_name>",
            "status": "NOT_AVAILABLE",
            "findings": [],
            "tags": [],
            "type": "",
            "region": "<region>"
          }
        },
        "group": {
          "name": "accessanalyzer"
        },
        "labels": [],
        "name": "<resource_name>",
        "type": "Other",
        "uid": "<resource_uid>"
      }
    ],
    "category_name": "Findings",
    "category_uid": 2,
    "class_name": "Detection Finding",
    "class_uid": 2004,
    "cloud": {
      "account": {
        "name": "",
        "type": "AWS Account",
        "type_id": 10,
        "uid": "<account_uid>",
        "labels": []
      },
      "org": {
        "name": "",
        "uid": ""
      },
      "provider": "aws",
      "region": "<region>"
    },
    "remediation": {
      "desc": "Enable IAM Access Analyzer for all accounts, create analyzer and take action over it is recommendations (IAM Access Analyzer is available at no additional cost).",
      "references": [
        "aws accessanalyzer create-analyzer --analyzer-name <NAME> --type <ACCOUNT|ORGANIZATION>",
        "https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html"
      ]
    },
    "risk_details": "AWS IAM Access Analyzer helps you identify the resources in your organization and accounts, such as Amazon S3 buckets or IAM roles, that are shared with an external entity. This lets you identify unintended access to your resources and data, which is a security risk. IAM Access Analyzer uses a form of mathematical analysis called automated reasoning, which applies logic and mathematical inference to determine all possible access paths allowed by a resource policy.",
    "time": 1739539623,
    "time_dt": "2025-02-14T14:27:03.913874",
    "type_uid": 200401,
    "type_name": "Detection Finding: Create"
  },
  {
    "message": "Login to the AWS Console. Choose your account name on the top right of the window -> My Account -> Contact Information.",
    "metadata": {
      "event_code": "account_maintain_current_contact_details",
      "product": {
        "name": "Prowler",
        "uid": "prowler",
        "vendor_name": "Prowler",
        "version": "<prowler_version>"
      },
      "profiles": [
        "cloud",
        "datetime"
      ],
      "tenant_uid": "",
      "version": "1.4.0"
    },
    "severity_id": 3,
    "severity": "Medium",
    "status": "New",
    "status_code": "MANUAL",
    "status_detail": "Login to the AWS Console. Choose your account name on the top right of the window -> My Account -> Contact Information.",
    "status_id": 1,
    "unmapped": {
      "related_url": "",
      "categories": [],
      "depends_on": [],
      "related_to": [],
      "additional_urls": [],
      "notes": "",
      "compliance": {
        "CIS-1.4": [
          "1.1"
        ],
        "CIS-1.5": [
          "1.1"
        ],
        "KISA-ISMS-P-2023": [
          "2.1.3"
        ],
        "CIS-2.0": [
          "1.1"
        ],
        "KISA-ISMS-P-2023-korean": [
          "2.1.3"
        ],
        "AWS-Well-Architected-Framework-Security-Pillar": [
          "SEC03-BP03",
          "SEC10-BP01"
        ],
        "AWS-Account-Security-Onboarding": [
          "Billing, emergency, security contacts"
        ],
        "CIS-3.0": [
          "1.1"
        ],
        "ENS-RD2022": [
          "op.ext.7.aws.am.1"
        ]
      }
    },
    "activity_name": "Create",
    "activity_id": 1,
    "finding_info": {
      "created_time": 1739539623,
      "created_time_dt": "2025-02-14T14:27:03.913874",
      "desc": "Maintain current contact details.",
      "product_uid": "prowler",
      "title": "Maintain current contact details.",
      "types": [
        "IAM"
      ],
      "uid": "<finding_uid>"
    },
    "resources": [
      {
        "cloud_partition": "aws",
        "region": "<region>",
        "data": {
          "details": "",
          "metadata": {
            "type": "PRIMARY",
            "email": null,
            "name": "<account_name>",
            "phone_number": "<value>"
          }
        },
        "group": {
          "name": "account"
        },
        "labels": [],
        "name": "<account_uid>",
        "type": "Other",
        "uid": "arn:aws:iam::<account_uid>:root"
      }
    ],
    "category_name": "Findings",
    "category_uid": 2,
    "class_name": "Detection Finding",
    "class_uid": 2004,
    "cloud": {
      "account": {
        "name": "",
        "type": "AWS Account",
        "type_id": 10,
        "uid": "<account_uid>",
        "labels": []
      },
      "org": {
        "name": "",
        "uid": ""
      },
      "provider": "aws",
      "region": "<region>"
    },
    "remediation": {
      "desc": "Using the Billing and Cost Management console complete contact details.",
      "references": [
        "No command available.",
        "https://docs.prowler.com/checks/aws/iam-policies/iam_18-maintain-contact-details#aws-console",
        "https://docs.aws.amazon.com/accounts/latest/reference/manage-acct-update-contact.html"
      ]
    },
    "risk_details": "Ensure contact email and telephone details for AWS accounts are current and map to more than one individual in your organization. An AWS account supports a number of contact details, and AWS will use these to contact the account owner if activity judged to be in breach of Acceptable Use Policy. If an AWS account is observed to be behaving in a prohibited or suspicious manner, AWS will attempt to contact the account owner by email and phone using the contact details listed. If this is unsuccessful and the account behavior needs urgent mitigation, proactive measures may be taken, including throttling of traffic between the account exhibiting suspicious behavior and the AWS API endpoints and the Internet. This will result in impaired service to and from the account in question.",
    "time": 1739539623,
    "time_dt": "2025-02-14T14:27:03.913874",
    "type_uid": 200401,
    "type_name": "Detection Finding: Create"
  },
  {
    "message": "SECURITY, BILLING and OPERATIONS contacts not found or they are not different between each other and between ROOT contact.",
    "metadata": {
      "event_code": "account_maintain_different_contact_details_to_security_billing_and_operations",
      "product": {
        "name": "Prowler",
        "uid": "prowler",
        "vendor_name": "Prowler",
        "version": "<prowler_version>"
      },
      "profiles": [
        "cloud",
        "datetime"
      ],
      "tenant_uid": "",
      "version": "1.4.0"
    },
    "severity_id": 3,
    "severity": "Medium",
    "status": "New",
    "status_code": "FAIL",
    "status_detail": "SECURITY, BILLING and OPERATIONS contacts not found or they are not different between each other and between ROOT contact.",
    "status_id": 1,
    "unmapped": {
      "related_url": "https://docs.aws.amazon.com/accounts/latest/reference/manage-acct-update-contact.html",
      "categories": [],
      "depends_on": [],
      "related_to": [],
      "additional_urls": [],
      "notes": "",
      "compliance": {
        "KISA-ISMS-P-2023": [
          "2.1.3"
        ],
        "KISA-ISMS-P-2023-korean": [
          "2.1.3"
        ]
      }
    },
    "activity_name": "Create",
    "activity_id": 1,
    "finding_info": {
      "created_time": 1739539623,
      "created_time_dt": "2025-02-14T14:27:03.913874",
      "desc": "Maintain different contact details to security, billing and operations.",
      "product_uid": "prowler",
      "title": "Maintain different contact details to security, billing and operations.",
      "types": [
        "IAM"
      ],
      "uid": "<finding_uid>"
    },
    "resources": [
      {
        "cloud_partition": "aws",
        "region": "<region>",
        "data": {
          "details": "",
          "metadata": {
            "type": "PRIMARY",
            "email": null,
            "name": "<account_name>",
            "phone_number": "<value>"
          }
        },
        "group": {
          "name": "account"
        },
        "labels": [],
        "name": "<account_uid>",
        "type": "Other",
        "uid": "arn:aws:iam::<account_uid>:root"
      }
    ],
    "category_name": "Findings",
    "category_uid": 2,
    "class_name": "Detection Finding",
    "class_uid": 2004,
    "cloud": {
      "account": {
        "name": "",
        "type": "AWS Account",
        "type_id": 10,
        "uid": "<account_uid>",
        "labels": []
      },
      "org": {
        "name": "",
        "uid": ""
      },
      "provider": "aws",
      "region": "<region>"
    },
    "remediation": {
      "desc": "Using the Billing and Cost Management console complete contact details.",
      "references": [
        "https://docs.prowler.com/checks/aws/iam-policies/iam_18-maintain-contact-details#aws-console",
        "https://docs.aws.amazon.com/accounts/latest/reference/manage-acct-update-contact.html"
      ]
    },
    "risk_details": "Ensure contact email and telephone details for AWS accounts are current and map to more than one individual in your organization. An AWS account supports a number of contact details, and AWS will use these to contact the account owner if activity judged to be in breach of Acceptable Use Policy. If an AWS account is observed to be behaving in a prohibited or suspicious manner, AWS will attempt to contact the account owner by email and phone using the contact details listed. If this is unsuccessful and the account behavior needs urgent mitigation, proactive measures may be taken, including throttling of traffic between the account exhibiting suspicious behavior and the AWS API endpoints and the Internet. This will result in impaired service to and from the account in question.",
    "time": 1739539623,
    "time_dt": "2025-02-14T14:27:03.913874",
    "type_uid": 200401,
    "type_name": "Detection Finding: Create"
  },
  {
    "message": "Login to the AWS Console. Choose your account name on the top right of the window -> My Account -> Alternate Contacts -> Security Section.",
    "metadata": {
      "event_code": "account_security_contact_information_is_registered",
      "product": {
        "name": "Prowler",
        "uid": "prowler",
        "vendor_name": "Prowler",
        "version": "<prowler_version>"
      },
      "profiles": [
        "cloud",
        "datetime"
      ],
      "tenant_uid": "",
      "version": "1.4.0"
    },
    "severity_id": 3,
    "severity": "Medium",
    "status": "New",
    "status_code": "MANUAL",
    "status_detail": "Login to the AWS Console. Choose your account name on the top right of the window -> My Account -> Alternate Contacts -> Security Section.",
    "status_id": 1,
    "unmapped": {
      "related_url": "",
      "categories": [],
      "depends_on": [],
      "related_to": [],
      "additional_urls": [],
      "notes": "",
      "compliance": {
        "CIS-1.4": [
          "1.2"
        ],
        "CIS-1.5": [
          "1.2"
        ],
        "AWS-Foundational-Security-Best-Practices": [
          "account",
          "acm"
        ],
        "KISA-ISMS-P-2023": [
          "2.1.3",
          "2.2.1"
        ],
        "CIS-2.0": [
          "1.2"
        ],
        "KISA-ISMS-P-2023-korean": [
          "2.1.3",
          "2.2.1"
        ],
        "AWS-Well-Architected-Framework-Security-Pillar": [
          "SEC03-BP03",
          "SEC10-BP01"
        ],
        "AWS-Account-Security-Onboarding": [
          "Billing, emergency, security contacts"
        ],
        "CIS-3.0": [
          "1.2"
        ],
        "ENS-RD2022": [
          "op.ext.7.aws.am.1"
        ]
      }
    },
    "activity_name": "Create",
    "activity_id": 1,
    "finding_info": {
      "created_time": 1739539623,
      "created_time_dt": "2025-02-14T14:27:03.913874",
      "desc": "Ensure security contact information is registered.",
      "product_uid": "prowler",
      "title": "Ensure security contact information is registered.",
      "types": [
        "IAM"
      ],
      "uid": "<finding_uid>"
    },
    "resources": [
      {
        "cloud_partition": "aws",
        "region": "<region>",
        "data": {
          "details": "",
          "metadata": {
            "type": "PRIMARY",
            "email": null,
            "name": "<account_name>",
            "phone_number": "<value>"
          }
        },
        "group": {
          "name": "account"
        },
        "labels": [],
        "name": "<account_uid>",
        "type": "Other",
        "uid": "arn:aws:iam::<account_uid>:root"
      }
    ],
    "category_name": "Findings",
    "category_uid": 2,
    "class_name": "Detection Finding",
    "class_uid": 2004,
    "cloud": {
      "account": {
        "name": "",
        "type": "AWS Account",
        "type_id": 10,
        "uid": "<account_uid>",
        "labels": []
      },
      "org": {
        "name": "",
        "uid": ""
      },
      "provider": "aws",
      "region": "<region>"
    },
    "remediation": {
      "desc": "Go to the My Account section and complete alternate contacts.",
      "references": [
        "No command available.",
        "https://docs.prowler.com/checks/aws/iam-policies/iam_19#aws-console",
        "https://docs.aws.amazon.com/accounts/latest/reference/manage-acct-update-contact.html"
      ]
    },
    "risk_details": "AWS provides customers with the option of specifying the contact information for accounts security team. It is recommended that this information be provided. Specifying security-specific contact information will help ensure that security advisories sent by AWS reach the team in your organization that is best equipped to respond to them.",
    "time": 1739539623,
    "time_dt": "2025-02-14T14:27:03.913874",
    "type_uid": 200401,
    "type_name": "Detection Finding: Create"
  },
  {
    "message": "Login to the AWS Console as root. Choose your account name on the top right of the window -> My Account -> Configure Security Challenge Questions.",
    "metadata": {
      "event_code": "account_security_questions_are_registered_in_the_aws_account",
      "product": {
        "name": "Prowler",
        "uid": "prowler",
        "vendor_name": "Prowler",
        "version": "<prowler_version>"
      },
      "profiles": [
        "cloud",
        "datetime"
      ],
      "tenant_uid": "",
      "version": "1.4.0"
    },
    "severity_id": 3,
    "severity": "Medium",
    "status": "New",
    "status_code": "MANUAL",
    "status_detail": "Login to the AWS Console as root. Choose your account name on the top right of the window -> My Account -> Configure Security Challenge Questions.",
    "status_id": 1,
    "unmapped": {
      "related_url": "",
      "categories": [],
      "depends_on": [],
      "related_to": [],
      "additional_urls": [],
      "notes": "",
      "compliance": {
        "CIS-1.4": [
          "1.3"
        ],
        "CIS-1.5": [
          "1.3"
        ],
        "KISA-ISMS-P-2023": [
          "2.1.3"
        ],
        "CIS-2.0": [
          "1.3"
        ],
        "KISA-ISMS-P-2023-korean": [
          "2.1.3"
        ],
        "AWS-Well-Architected-Framework-Security-Pillar": [
          "SEC03-BP03",
          "SEC10-BP01"
        ],
        "CIS-3.0": [
          "1.3"
        ],
        "ENS-RD2022": [
          "op.ext.7.aws.am.1"
        ]
      }
    },
    "activity_name": "Create",
    "activity_id": 1,
    "finding_info": {
      "created_time": 1739539623,
      "created_time_dt": "2025-02-14T14:27:03.913874",
      "desc": "Ensure security questions are registered in the AWS account.",
      "product_uid": "prowler",
      "title": "Ensure security questions are registered in the AWS account.",
      "types": [
        "IAM"
      ],
      "uid": "<finding_uid>"
    },
    "resources": [
      {
        "cloud_partition": "aws",
        "region": "<region>",
        "data": {
          "details": "",
          "metadata": {
            "type": "SECURITY",
            "email": null,
            "name": null,
            "phone_number": null
          }
        },
        "group": {
          "name": "account"
        },
        "labels": [],
        "name": "<account_uid>",
        "type": "Other",
        "uid": "arn:aws:iam::<account_uid>:root"
      }
    ],
    "category_name": "Findings",
    "category_uid": 2,
    "class_name": "Detection Finding",
    "class_uid": 2004,
    "cloud": {
      "account": {
        "name": "",
        "type": "AWS Account",
        "type_id": 10,
        "uid": "<account_uid>",
        "labels": []
      },
      "org": {
        "name": "",
        "uid": ""
      },
      "provider": "aws",
      "region": "<region>"
    },
    "remediation": {
      "desc": "Login as root account and from My Account configure Security questions.",
      "references": [
        "No command available.",
        "https://docs.prowler.com/checks/aws/iam-policies/iam_15",
        "https://docs.aws.amazon.com/accounts/latest/reference/manage-acct-security-challenge.html"
      ]
    },
    "risk_details": "The AWS support portal allows account owners to establish security questions that can be used to authenticate individuals calling AWS customer service for support. It is recommended that security questions be established. When creating a new AWS account a default super user is automatically created. This account is referred to as the root account. It is recommended that the use of this account be limited and highly controlled. During events in which the root password is no longer accessible or the MFA token associated with root is lost/destroyed it is possible through authentication using secret questions and associated answers to recover root login access.",
    "time": 1739539623,
    "time_dt": "2025-02-14T14:27:03.913874",
    "type_uid": 200401,
    "type_name": "Detection Finding: Create"
  }
]
```

--------------------------------------------------------------------------------

---[FILE: example_output_azure.csv]---
Location: prowler-master/examples/output/example_output_azure.csv

```text
AUTH_METHOD;TIMESTAMP;ACCOUNT_UID;ACCOUNT_NAME;ACCOUNT_EMAIL;ACCOUNT_ORGANIZATION_UID;ACCOUNT_ORGANIZATION_NAME;ACCOUNT_TAGS;FINDING_UID;PROVIDER;CHECK_ID;CHECK_TITLE;CHECK_TYPE;STATUS;STATUS_EXTENDED;MUTED;SERVICE_NAME;SUBSERVICE_NAME;SEVERITY;RESOURCE_TYPE;RESOURCE_UID;RESOURCE_NAME;RESOURCE_DETAILS;RESOURCE_TAGS;PARTITION;REGION;DESCRIPTION;RISK;RELATED_URL;REMEDIATION_RECOMMENDATION_TEXT;REMEDIATION_RECOMMENDATION_URL;REMEDIATION_CODE_NATIVEIAC;REMEDIATION_CODE_TERRAFORM;REMEDIATION_CODE_CLI;REMEDIATION_CODE_OTHER;COMPLIANCE;CATEGORIES;DEPENDS_ON;RELATED_TO;NOTES;PROWLER_VERSION;ADDITIONAL_URLS
<auth_method>;2025-02-14 14:27:30.710664;<account_uid>;<account_name>;;<account_organization_uid>;ProwlerPro.onmicrosoft.com;;<finding_uid>;azure;aks_cluster_rbac_enabled;Ensure AKS RBAC is enabled;;PASS;RBAC is enabled for cluster '<resource_name>' in subscription '<account_name>'.;False;aks;;medium;Microsoft.ContainerService/ManagedClusters;/subscriptions/<account_uid>/resourcegroups/<resource_name>_group/providers/Microsoft.ContainerService/managedClusters/<resource_name>;<resource_name>;;;<partition>;<region>;Azure Kubernetes Service (AKS) can be configured to use Azure Active Directory (AD) for user authentication. In this configuration, you sign in to an AKS cluster using an Azure AD authentication token. You can also configure Kubernetes role-based access control (Kubernetes RBAC) to limit access to cluster resources based a user's identity or group membership.;Kubernetes RBAC and AKS help you secure your cluster access and provide only the minimum required permissions to developers and operators.;https://learn.microsoft.com/en-us/azure/aks/azure-ad-rbac?tabs=portal;;https://learn.microsoft.com/en-us/security/benchmark/azure/security-controls-v2-privileged-access#pa-7-follow-just-enough-administration-least-privilege-principle;;https://docs.prowler.com/checks/azure/azure-kubernetes-policies/bc_azr_kubernetes_2#terraform;;https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/AKS/enable-role-based-access-control-for-kubernetes-service.html#;ENS-RD2022: op.acc.2.az.r1.eid.1;;;;;<prowler_version>;https://learn.microsoft.com/azure/aks/azure-ad-rbac | https://learn.microsoft.com/azure/aks/concepts-identity
<auth_method>;2025-02-14 14:27:30.710664;<account_uid>;<account_name>;;<account_organization_uid>;ProwlerPro.onmicrosoft.com;;<finding_uid>;azure;aks_clusters_created_with_private_nodes;Ensure clusters are created with Private Nodes;;PASS;Cluster '<resource_name>' was created with private nodes in subscription '<account_name>';False;aks;;high;Microsoft.ContainerService/ManagedClusters;/subscriptions/<account_uid>/resourcegroups/<resource_name>_group/providers/Microsoft.ContainerService/managedClusters/<resource_name>;<resource_name>;;;<partition>;<region>;Disable public IP addresses for cluster nodes, so that they only have private IP addresses. Private Nodes are nodes with no public IP addresses.;Disabling public IP addresses on cluster nodes restricts access to only internal networks, forcing attackers to obtain local network access before attempting to compromise the underlying Kubernetes hosts.;https://learn.microsoft.com/en-us/azure/aks/private-clusters;;https://learn.microsoft.com/en-us/azure/aks/access-private-cluster;;;;;ENS-RD2022: mp.com.4.r2.az.aks.1 | MITRE-ATTACK: T1190, T1530;;;;;<prowler_version>;https://learn.microsoft.com/azure/aks/azure-ad-rbac | https://learn.microsoft.com/azure/aks/concepts-identity
<auth_method>;2025-02-14 14:27:30.710664;<account_uid>;<account_name>;;<account_organization_uid>;ProwlerPro.onmicrosoft.com;;<finding_uid>;azure;aks_clusters_public_access_disabled;Ensure clusters are created with Private Endpoint Enabled and Public Access Disabled;;FAIL;Public access to nodes is enabled for cluster '<resource_name>' in subscription '<account_name>';False;aks;;high;Microsoft.ContainerService/ManagedClusters;/subscriptions/<account_uid>/resourcegroups/<resource_name>_group/providers/Microsoft.ContainerService/managedClusters/<resource_name>;<resource_name>;;;<partition>;<region>;Disable access to the Kubernetes API from outside the node network if it is not required.;In a private cluster, the master node has two endpoints, a private and public endpoint. The private endpoint is the internal IP address of the master, behind an internal load balancer in the master's wirtual network. Nodes communicate with the master using the private endpoint. The public endpoint enables the Kubernetes API to be accessed from outside the master's virtual network. Although Kubernetes API requires an authorized token to perform sensitive actions, a vulnerability could potentially expose the Kubernetes publically with unrestricted access. Additionally, an attacker may be able to identify the current cluster and Kubernetes API version and determine whether it is vulnerable to an attack. Unless required, disabling public endpoint will help prevent such threats, and require the attacker to be on the master's virtual network to perform any attack on the Kubernetes API.;https://learn.microsoft.com/en-us/azure/aks/private-clusters?tabs=azure-portal;To use a private endpoint, create a new private endpoint in your virtual network then create a link between your virtual network and a new private DNS zone;https://learn.microsoft.com/en-us/azure/aks/access-private-cluster?tabs=azure-cli;;;az aks update -n <cluster_name> -g <resource_group> --disable-public-fqdn;;ENS-RD2022: mp.com.4.az.aks.2 | MITRE-ATTACK: T1190, T1530;;;;;<prowler_version>;https://learn.microsoft.com/azure/aks/azure-ad-rbac | https://learn.microsoft.com/azure/aks/concepts-identity
<auth_method>;2025-02-14 14:27:30.710664;<account_uid>;<account_name>;;<account_organization_uid>;ProwlerPro.onmicrosoft.com;;<finding_uid>;azure;aks_network_policy_enabled;Ensure Network Policy is Enabled and set as appropriate;;PASS;Network policy is enabled for cluster '<resource_name>' in subscription '<account_name>'.;False;aks;;medium;Microsoft.ContainerService/managedClusters;/subscriptions/<account_uid>/resourcegroups/<resource_name>_group/providers/Microsoft.ContainerService/managedClusters/<resource_name>;<resource_name>;;;<partition>;<region>;When you run modern, microservices-based applications in Kubernetes, you often want to control which components can communicate with each other. The principle of least privilege should be applied to how traffic can flow between pods in an Azure Kubernetes Service (AKS) cluster. Let's say you likely want to block traffic directly to back-end applications. The Network Policy feature in Kubernetes lets you define rules for ingress and egress traffic between pods in a cluster.;All pods in an AKS cluster can send and receive traffic without limitations, by default. To improve security, you can define rules that control the flow of traffic. Back-end applications are often only exposed to required front-end services, for example. Or, database components are only accessible to the application tiers that connect to them. Network Policy is a Kubernetes specification that defines access policies for communication between Pods. Using Network Policies, you define an ordered set of rules to send and receive traffic and apply them to a collection of pods that match one or more label selectors. These network policy rules are defined as YAML manifests. Network policies can be included as part of a wider manifest that also creates a deployment or service.;https://learn.microsoft.com/en-us/security/benchmark/azure/security-controls-v2-network-security#ns-2-connect-private-networks-together;;https://learn.microsoft.com/en-us/azure/aks/use-network-policies;;https://docs.prowler.com/checks/azure/azure-kubernetes-policies/bc_azr_kubernetes_4#terraform;;;ENS-RD2022: mp.com.4.r2.az.aks.1;;;;Network Policy requires the Network Policy add-on. This add-on is included automatically when a cluster with Network Policy is created, but for an existing cluster, needs to be added prior to enabling Network Policy. Enabling/Disabling Network Policy causes a rolling update of all cluster nodes, similar to performing a cluster upgrade. This operation is long-running and will block other operations on the cluster (including delete) until it has run to completion. If Network Policy is used, a cluster must have at least 2 nodes of type n1-standard-1 or higher. The recommended minimum size cluster to run Network Policy enforcement is 3 n1-standard-1 instances. Enabling Network Policy enforcement consumes additional resources in nodes. Specifically, it increases the memory footprint of the kube-system process by approximately 128MB, and requires approximately 300 millicores of CPU.;<prowler_version>;https://learn.microsoft.com/azure/aks/azure-ad-rbac | https://learn.microsoft.com/azure/aks/concepts-identity
```

--------------------------------------------------------------------------------

````
