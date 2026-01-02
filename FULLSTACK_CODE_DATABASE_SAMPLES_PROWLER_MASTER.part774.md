---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 774
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 774 of 867)

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

---[FILE: dataServices.json]---
Location: prowler-master/ui/dataServices.json
Signals: Next.js

```json
{
  "links": {
    "first": "http://localhost:8080/api/v1/services?page%5Bnumber%5D=1",
    "last": "http://localhost:8080/api/v1/services?page%5Bnumber%5D=1",
    "next": null,
    "prev": null
  },
  "data": [
    {
      "type": "Service",
      "id": "001",
      "attributes": {
        "inserted_at": "2024-08-14T10:00:00.000000Z",
        "updated_at": "2024-08-14T10:00:00.000000Z",
        "provider": "aws",
        "provider_id": "001",
        "alias": "Amazon EC2",
        "regions": ["us-east-1", "us-east-2"],
        "findings": {
          "failed": 3,
          "last_checked_at": null
        },
        "scanner_args": {}
      }
    },
    {
      "type": "Service",
      "id": "002",
      "attributes": {
        "inserted_at": "2024-08-14T10:01:00.000000Z",
        "updated_at": "2024-08-14T10:01:00.000000Z",
        "provider": "aws",
        "provider_id": "002",
        "alias": "Amazon EMR",
        "regions": ["us-west-1", "us-west-2"],
        "findings": {
          "failed": 0,
          "last_checked_at": null
        },
        "scanner_args": {}
      }
    },
    {
      "type": "Service",
      "id": "003",
      "attributes": {
        "inserted_at": "2024-08-14T10:02:00.000000Z",
        "updated_at": "2024-08-14T10:02:00.000000Z",
        "provider": "aws",
        "provider_id": "003",
        "alias": "Amazon GuardDuty",
        "regions": ["eu-west-1", "eu-west-2"],
        "findings": {
          "failed": 5,
          "last_checked_at": null
        },
        "scanner_args": {}
      }
    },
    {
      "type": "Service",
      "id": "004",
      "attributes": {
        "inserted_at": "2024-08-14T10:03:00.000000Z",
        "updated_at": "2024-08-14T10:03:00.000000Z",
        "provider": "aws",
        "provider_id": "004",
        "alias": "Amazon Inspector",
        "regions": ["ap-southeast-1", "ap-southeast-2"],
        "findings": {
          "failed": 0,
          "last_checked_at": null
        },
        "scanner_args": {}
      }
    },
    {
      "type": "Service",
      "id": "005",
      "attributes": {
        "inserted_at": "2024-08-14T10:04:00.000000Z",
        "updated_at": "2024-08-14T10:04:00.000000Z",
        "provider": "aws",
        "provider_id": "005",
        "alias": "Amazon Macie",
        "regions": ["eu-north-1", "eu-north-2"],
        "findings": {
          "failed": 2,
          "last_checked_at": null
        },
        "scanner_args": {}
      }
    },
    {
      "type": "Service",
      "id": "006",
      "attributes": {
        "inserted_at": "2024-08-14T10:05:00.000000Z",
        "updated_at": "2024-08-14T10:05:00.000000Z",
        "provider": "aws",
        "provider_id": "006",
        "alias": "Amazon RDS",
        "regions": ["sa-east-1", "sa-east-2"],
        "findings": {
          "failed": 0,
          "last_checked_at": null
        },
        "scanner_args": {}
      }
    },
    {
      "type": "Service",
      "id": "007",
      "attributes": {
        "inserted_at": "2024-08-14T10:06:00.000000Z",
        "updated_at": "2024-08-14T10:06:00.000000Z",
        "provider": "aws",
        "provider_id": "007",
        "alias": "Amazon Route 53",
        "regions": ["af-south-1", "af-south-2"],
        "findings": {
          "failed": 1,
          "last_checked_at": null
        },
        "scanner_args": {}
      }
    },
    {
      "type": "Service",
      "id": "008",
      "attributes": {
        "inserted_at": "2024-08-14T10:07:00.000000Z",
        "updated_at": "2024-08-14T10:07:00.000000Z",
        "provider": "aws",
        "provider_id": "008",
        "alias": "Amazon S3",
        "regions": ["us-east-1", "us-west-1"],
        "findings": {
          "failed": 3,
          "last_checked_at": null
        },
        "scanner_args": {}
      }
    },
    {
      "type": "Service",
      "id": "009",
      "attributes": {
        "inserted_at": "2024-08-14T10:08:00.000000Z",
        "updated_at": "2024-08-14T10:08:00.000000Z",
        "provider": "aws",
        "provider_id": "009",
        "alias": "Amazon SNS",
        "regions": ["eu-central-1", "eu-central-2"],
        "findings": {
          "failed": 0,
          "last_checked_at": null
        },
        "scanner_args": {}
      }
    },
    {
      "type": "Service",
      "id": "010",
      "attributes": {
        "inserted_at": "2024-08-14T10:09:00.000000Z",
        "updated_at": "2024-08-14T10:09:00.000000Z",
        "provider": "aws",
        "provider_id": "010",
        "alias": "Amazon VPC",
        "regions": ["us-west-1", "us-west-2"],
        "findings": {
          "failed": 4,
          "last_checked_at": null
        },
        "scanner_args": {}
      }
    },
    {
      "type": "Service",
      "id": "011",
      "attributes": {
        "inserted_at": "2024-08-14T10:10:00.000000Z",
        "updated_at": "2024-08-14T10:10:00.000000Z",
        "provider": "aws",
        "provider_id": "011",
        "alias": "AWS Account",
        "regions": ["eu-west-1", "eu-west-3"],
        "findings": {
          "failed": 0,
          "last_checked_at": null
        },
        "scanner_args": {}
      }
    },
    {
      "type": "Service",
      "id": "012",
      "attributes": {
        "inserted_at": "2024-08-14T10:11:00.000000Z",
        "updated_at": "2024-08-14T10:11:00.000000Z",
        "provider": "aws",
        "provider_id": "012",
        "alias": "AWS Athena",
        "regions": ["us-east-1", "us-east-2"],
        "findings": {
          "failed": 5,
          "last_checked_at": null
        },
        "scanner_args": {}
      }
    },
    {
      "type": "Service",
      "id": "013",
      "attributes": {
        "inserted_at": "2024-08-14T10:12:00.000000Z",
        "updated_at": "2024-08-14T10:12:00.000000Z",
        "provider": "aws",
        "provider_id": "013",
        "alias": "AWS Certificate Manager",
        "regions": ["us-west-1", "us-west-2"],
        "findings": {
          "failed": 1,
          "last_checked_at": null
        },
        "scanner_args": {}
      }
    },
    {
      "type": "Service",
      "id": "014",
      "attributes": {
        "inserted_at": "2024-08-14T10:13:00.000000Z",
        "updated_at": "2024-08-14T10:13:00.000000Z",
        "provider": "aws",
        "provider_id": "014",
        "alias": "AWS CloudFormation",
        "regions": ["eu-central-1", "eu-central-2"],
        "findings": {
          "failed": 0,
          "last_checked_at": null
        },
        "scanner_args": {}
      }
    },
    {
      "type": "Service",
      "id": "015",
      "attributes": {
        "inserted_at": "2024-08-14T10:14:00.000000Z",
        "updated_at": "2024-08-14T10:14:00.000000Z",
        "provider": "aws",
        "provider_id": "015",
        "alias": "AWS CloudTrail",
        "regions": ["us-east-1", "us-east-2"],
        "findings": {
          "failed": 4,
          "last_checked_at": null
        },
        "scanner_args": {}
      }
    },
    {
      "type": "Service",
      "id": "016",
      "attributes": {
        "inserted_at": "2024-08-14T10:15:00.000000Z",
        "updated_at": "2024-08-14T10:15:00.000000Z",
        "provider": "aws",
        "provider_id": "016",
        "alias": "AWS CloudWatch",
        "regions": ["us-west-1", "us-west-2"],
        "findings": {
          "failed": 2,
          "last_checked_at": null
        },
        "scanner_args": {}
      }
    },
    {
      "type": "Service",
      "id": "017",
      "attributes": {
        "inserted_at": "2024-08-14T10:16:00.000000Z",
        "updated_at": "2024-08-14T10:16:00.000000Z",
        "provider": "aws",
        "provider_id": "017",
        "alias": "AWS Config",
        "regions": ["eu-west-1", "eu-west-3"],
        "findings": {
          "failed": 0,
          "last_checked_at": null
        },
        "scanner_args": {}
      }
    },
    {
      "type": "Service",
      "id": "018",
      "attributes": {
        "inserted_at": "2024-08-14T10:17:00.000000Z",
        "updated_at": "2024-08-14T10:17:00.000000Z",
        "provider": "aws",
        "provider_id": "018",
        "alias": "AWS Database Migration",
        "regions": ["us-east-1", "us-east-2"],
        "findings": {
          "failed": 5,
          "last_checked_at": null
        },
        "scanner_args": {}
      }
    },
    {
      "type": "Service",
      "id": "019",
      "attributes": {
        "inserted_at": "2024-08-14T10:18:00.000000Z",
        "updated_at": "2024-08-14T10:18:00.000000Z",
        "provider": "aws",
        "provider_id": "019",
        "alias": "AWS Glue",
        "regions": ["us-west-1", "us-west-2"],
        "findings": {
          "failed": 1,
          "last_checked_at": null
        },
        "scanner_args": {}
      }
    },
    {
      "type": "Service",
      "id": "020",
      "attributes": {
        "inserted_at": "2024-08-14T10:19:00.000000Z",
        "updated_at": "2024-08-14T10:19:00.000000Z",
        "provider": "aws",
        "provider_id": "020",
        "alias": "AWS IAM",
        "regions": ["eu-central-1", "eu-central-2"],
        "findings": {
          "failed": 0,
          "last_checked_at": null
        },
        "scanner_args": {}
      }
    },
    {
      "type": "Service",
      "id": "021",
      "attributes": {
        "inserted_at": "2024-08-14T10:20:00.000000Z",
        "updated_at": "2024-08-14T10:20:00.000000Z",
        "provider": "aws",
        "provider_id": "021",
        "alias": "AWS Lambda",
        "regions": ["us-east-1", "us-east-2"],
        "findings": {
          "failed": 4,
          "last_checked_at": null
        },
        "scanner_args": {}
      }
    },
    {
      "type": "Service",
      "id": "022",
      "attributes": {
        "inserted_at": "2024-08-14T10:21:00.000000Z",
        "updated_at": "2024-08-14T10:21:00.000000Z",
        "provider": "aws",
        "provider_id": "022",
        "alias": "AWS Network Firewall",
        "regions": ["us-west-1", "us-west-2"],
        "findings": {
          "failed": 2,
          "last_checked_at": null
        },
        "scanner_args": {}
      }
    },
    {
      "type": "Service",
      "id": "023",
      "attributes": {
        "inserted_at": "2024-08-14T10:22:00.000000Z",
        "updated_at": "2024-08-14T10:22:00.000000Z",
        "provider": "aws",
        "provider_id": "023",
        "alias": "AWS Organizations",
        "regions": ["eu-west-1", "eu-west-3"],
        "findings": {
          "failed": 0,
          "last_checked_at": null
        },
        "scanner_args": {}
      }
    },
    {
      "type": "Service",
      "id": "024",
      "attributes": {
        "inserted_at": "2024-08-14T10:23:00.000000Z",
        "updated_at": "2024-08-14T10:23:00.000000Z",
        "provider": "aws",
        "provider_id": "024",
        "alias": "AWS Resource Explorer",
        "regions": ["us-east-1", "us-east-2"],
        "findings": {
          "failed": 3,
          "last_checked_at": null
        },
        "scanner_args": {}
      }
    },
    {
      "type": "Service",
      "id": "025",
      "attributes": {
        "inserted_at": "2024-08-14T10:24:00.000000Z",
        "updated_at": "2024-08-14T10:24:00.000000Z",
        "provider": "aws",
        "provider_id": "025",
        "alias": "AWS Security Hub",
        "regions": ["us-west-1", "us-west-2"],
        "findings": {
          "failed": 5,
          "last_checked_at": null
        },
        "scanner_args": {}
      }
    },
    {
      "type": "Service",
      "id": "026",
      "attributes": {
        "inserted_at": "2024-08-14T10:25:00.000000Z",
        "updated_at": "2024-08-14T10:25:00.000000Z",
        "provider": "aws",
        "provider_id": "026",
        "alias": "AWS Systems Manager",
        "regions": ["eu-west-1", "eu-west-3"],
        "findings": {
          "failed": 0,
          "last_checked_at": null
        },
        "scanner_args": {}
      }
    },
    {
      "type": "Service",
      "id": "027",
      "attributes": {
        "inserted_at": "2024-08-14T10:26:00.000000Z",
        "updated_at": "2024-08-14T10:26:00.000000Z",
        "provider": "aws",
        "provider_id": "027",
        "alias": "AWS Trusted Advisor",
        "regions": ["us-east-1", "us-east-2"],
        "findings": {
          "failed": 2,
          "last_checked_at": null
        },
        "scanner_args": {}
      }
    },
    {
      "type": "Service",
      "id": "028",
      "attributes": {
        "inserted_at": "2024-08-14T10:27:00.000000Z",
        "updated_at": "2024-08-14T10:27:00.000000Z",
        "provider": "aws",
        "provider_id": "028",
        "alias": "IAM Access Analyzer",
        "regions": ["eu-west-1", "eu-west-3"],
        "findings": {
          "failed": 0,
          "last_checked_at": null
        },
        "scanner_args": {}
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pages": 1,
      "count": 28
    },
    "version": "v1"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: dependency-log.json]---
Location: prowler-master/ui/dependency-log.json
Signals: React, Next.js

```json
[
  {
    "section": "dependencies",
    "name": "@ai-sdk/react",
    "from": "2.0.106",
    "to": "2.0.111",
    "strategy": "installed",
    "generatedAt": "2025-12-15T08:24:46.195Z"
  },
  {
    "section": "dependencies",
    "name": "@aws-sdk/client-bedrock-runtime",
    "from": "3.943.0",
    "to": "3.948.0",
    "strategy": "installed",
    "generatedAt": "2025-12-15T08:24:46.195Z"
  },
  {
    "section": "dependencies",
    "name": "@heroui/react",
    "from": "2.8.4",
    "to": "2.8.4",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "@hookform/resolvers",
    "from": "5.2.2",
    "to": "5.2.2",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "@internationalized/date",
    "from": "3.10.0",
    "to": "3.10.0",
    "strategy": "installed",
    "generatedAt": "2025-12-10T11:34:11.122Z"
  },
  {
    "section": "dependencies",
    "name": "@langchain/aws",
    "from": "0.1.15",
    "to": "1.1.0",
    "strategy": "installed",
    "generatedAt": "2025-12-12T10:01:54.132Z"
  },
  {
    "section": "dependencies",
    "name": "@langchain/core",
    "from": "0.3.77",
    "to": "1.1.4",
    "strategy": "installed",
    "generatedAt": "2025-12-15T08:24:46.195Z"
  },
  {
    "section": "dependencies",
    "name": "@langchain/mcp-adapters",
    "from": "1.0.3",
    "to": "1.0.3",
    "strategy": "installed",
    "generatedAt": "2025-12-12T10:01:54.132Z"
  },
  {
    "section": "dependencies",
    "name": "@langchain/openai",
    "from": "0.6.16",
    "to": "1.1.3",
    "strategy": "installed",
    "generatedAt": "2025-12-12T10:01:54.132Z"
  },
  {
    "section": "dependencies",
    "name": "@next/third-parties",
    "from": "15.3.5",
    "to": "15.5.9",
    "strategy": "installed",
    "generatedAt": "2025-12-15T11:18:25.093Z"
  },
  {
    "section": "dependencies",
    "name": "@radix-ui/react-alert-dialog",
    "from": "1.1.14",
    "to": "1.1.14",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "@radix-ui/react-avatar",
    "from": "1.1.11",
    "to": "1.1.11",
    "strategy": "installed",
    "generatedAt": "2025-12-10T11:34:11.122Z"
  },
  {
    "section": "dependencies",
    "name": "@radix-ui/react-collapsible",
    "from": "1.1.12",
    "to": "1.1.12",
    "strategy": "installed",
    "generatedAt": "2025-12-10T11:34:11.122Z"
  },
  {
    "section": "dependencies",
    "name": "@radix-ui/react-dialog",
    "from": "1.1.14",
    "to": "1.1.14",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "@radix-ui/react-dropdown-menu",
    "from": "2.1.15",
    "to": "2.1.15",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "@radix-ui/react-icons",
    "from": "1.3.2",
    "to": "1.3.2",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "@radix-ui/react-label",
    "from": "2.1.7",
    "to": "2.1.7",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "@radix-ui/react-popover",
    "from": "1.1.15",
    "to": "1.1.15",
    "strategy": "installed",
    "generatedAt": "2025-11-20T08:20:16.313Z"
  },
  {
    "section": "dependencies",
    "name": "@radix-ui/react-scroll-area",
    "from": "1.2.10",
    "to": "1.2.10",
    "strategy": "installed",
    "generatedAt": "2025-12-10T11:34:11.122Z"
  },
  {
    "section": "dependencies",
    "name": "@radix-ui/react-select",
    "from": "2.2.5",
    "to": "2.2.5",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "@radix-ui/react-separator",
    "from": "1.1.7",
    "to": "1.1.7",
    "strategy": "installed",
    "generatedAt": "2025-10-30T10:22:21.335Z"
  },
  {
    "section": "dependencies",
    "name": "@radix-ui/react-slot",
    "from": "1.2.3",
    "to": "1.2.3",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "@radix-ui/react-tabs",
    "from": "1.1.13",
    "to": "1.1.13",
    "strategy": "installed",
    "generatedAt": "2025-12-10T11:34:11.122Z"
  },
  {
    "section": "dependencies",
    "name": "@radix-ui/react-toast",
    "from": "1.2.14",
    "to": "1.2.14",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "@radix-ui/react-tooltip",
    "from": "1.2.8",
    "to": "1.2.8",
    "strategy": "installed",
    "generatedAt": "2025-12-10T11:34:11.122Z"
  },
  {
    "section": "dependencies",
    "name": "@radix-ui/react-use-controllable-state",
    "from": "1.2.2",
    "to": "1.2.2",
    "strategy": "installed",
    "generatedAt": "2025-12-15T08:24:46.195Z"
  },
  {
    "section": "dependencies",
    "name": "@react-aria/i18n",
    "from": "3.12.13",
    "to": "3.12.13",
    "strategy": "installed",
    "generatedAt": "2025-12-10T11:34:11.122Z"
  },
  {
    "section": "dependencies",
    "name": "@react-aria/ssr",
    "from": "3.9.4",
    "to": "3.9.4",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "@react-aria/visually-hidden",
    "from": "3.8.12",
    "to": "3.8.12",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "@react-stately/utils",
    "from": "3.10.8",
    "to": "3.10.8",
    "strategy": "installed",
    "generatedAt": "2025-12-10T11:34:11.122Z"
  },
  {
    "section": "dependencies",
    "name": "@react-types/datepicker",
    "from": "3.13.2",
    "to": "3.13.2",
    "strategy": "installed",
    "generatedAt": "2025-12-10T11:34:11.122Z"
  },
  {
    "section": "dependencies",
    "name": "@react-types/shared",
    "from": "3.26.0",
    "to": "3.26.0",
    "strategy": "installed",
    "generatedAt": "2025-12-10T11:34:11.122Z"
  },
  {
    "section": "dependencies",
    "name": "@sentry/nextjs",
    "from": "10.11.0",
    "to": "10.27.0",
    "strategy": "installed",
    "generatedAt": "2025-12-15T11:18:25.093Z"
  },
  {
    "section": "dependencies",
    "name": "@tailwindcss/postcss",
    "from": "4.1.13",
    "to": "4.1.13",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "@tailwindcss/typography",
    "from": "0.5.16",
    "to": "0.5.16",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "@tanstack/react-table",
    "from": "8.21.3",
    "to": "8.21.3",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "@types/js-yaml",
    "from": "4.0.9",
    "to": "4.0.9",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "ai",
    "from": "5.0.59",
    "to": "5.0.109",
    "strategy": "installed",
    "generatedAt": "2025-12-15T08:24:46.195Z"
  },
  {
    "section": "dependencies",
    "name": "alert",
    "from": "6.0.2",
    "to": "6.0.2",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "class-variance-authority",
    "from": "0.7.1",
    "to": "0.7.1",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "clsx",
    "from": "2.1.1",
    "to": "2.1.1",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "cmdk",
    "from": "1.1.1",
    "to": "1.1.1",
    "strategy": "installed",
    "generatedAt": "2025-11-20T08:20:16.313Z"
  },
  {
    "section": "dependencies",
    "name": "d3",
    "from": "7.9.0",
    "to": "7.9.0",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "date-fns",
    "from": "4.1.0",
    "to": "4.1.0",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "framer-motion",
    "from": "11.18.2",
    "to": "11.18.2",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "import-in-the-middle",
    "from": "2.0.0",
    "to": "2.0.0",
    "strategy": "installed",
    "generatedAt": "2025-12-16T08:33:37.278Z"
  },
  {
    "section": "dependencies",
    "name": "intl-messageformat",
    "from": "10.7.16",
    "to": "10.7.16",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "jose",
    "from": "5.10.0",
    "to": "5.10.0",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "js-yaml",
    "from": "4.1.0",
    "to": "4.1.1",
    "strategy": "installed",
    "generatedAt": "2025-12-15T11:18:25.093Z"
  },
  {
    "section": "dependencies",
    "name": "jwt-decode",
    "from": "4.0.0",
    "to": "4.0.0",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "langchain",
    "from": "1.1.4",
    "to": "1.1.5",
    "strategy": "installed",
    "generatedAt": "2025-12-15T08:24:46.195Z"
  },
  {
    "section": "dependencies",
    "name": "lucide-react",
    "from": "0.543.0",
    "to": "0.543.0",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "marked",
    "from": "15.0.12",
    "to": "15.0.12",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "nanoid",
    "from": "5.1.6",
    "to": "5.1.6",
    "strategy": "installed",
    "generatedAt": "2025-12-10T11:34:11.122Z"
  },
  {
    "section": "dependencies",
    "name": "next",
    "from": "15.5.7",
    "to": "15.5.9",
    "strategy": "installed",
    "generatedAt": "2025-12-15T11:18:25.093Z"
  },
  {
    "section": "dependencies",
    "name": "next-auth",
    "from": "5.0.0-beta.29",
    "to": "5.0.0-beta.30",
    "strategy": "installed",
    "generatedAt": "2025-12-15T11:18:25.093Z"
  },
  {
    "section": "dependencies",
    "name": "next-themes",
    "from": "0.2.1",
    "to": "0.2.1",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "radix-ui",
    "from": "1.4.2",
    "to": "1.4.2",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "react",
    "from": "19.2.1",
    "to": "19.2.2",
    "strategy": "installed",
    "generatedAt": "2025-12-15T11:18:25.093Z"
  },
  {
    "section": "dependencies",
    "name": "react-dom",
    "from": "19.2.1",
    "to": "19.2.2",
    "strategy": "installed",
    "generatedAt": "2025-12-15T11:18:25.093Z"
  },
  {
    "section": "dependencies",
    "name": "react-hook-form",
    "from": "7.62.0",
    "to": "7.62.0",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "react-markdown",
    "from": "10.1.0",
    "to": "10.1.0",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "recharts",
    "from": "2.15.4",
    "to": "2.15.4",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "require-in-the-middle",
    "from": "8.0.1",
    "to": "8.0.1",
    "strategy": "installed",
    "generatedAt": "2025-12-16T08:33:37.278Z"
  },
  {
    "section": "dependencies",
    "name": "rss-parser",
    "from": "3.13.0",
    "to": "3.13.0",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "server-only",
    "from": "0.0.1",
    "to": "0.0.1",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "sharp",
    "from": "0.33.5",
    "to": "0.33.5",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "shiki",
    "from": "3.20.0",
    "to": "3.20.0",
    "strategy": "installed",
    "generatedAt": "2025-12-16T08:33:37.278Z"
  },
  {
    "section": "dependencies",
    "name": "streamdown",
    "from": "1.3.0",
    "to": "1.6.10",
    "strategy": "installed",
    "generatedAt": "2025-12-15T08:24:46.195Z"
  },
  {
    "section": "dependencies",
    "name": "tailwind-merge",
    "from": "3.3.1",
    "to": "3.3.1",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "tailwindcss-animate",
    "from": "1.0.7",
    "to": "1.0.7",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "topojson-client",
    "from": "3.1.0",
    "to": "3.1.0",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "tw-animate-css",
    "from": "1.4.0",
    "to": "1.4.0",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "use-stick-to-bottom",
    "from": "1.1.1",
    "to": "1.1.1",
    "strategy": "installed",
    "generatedAt": "2025-12-15T08:24:46.195Z"
  },
  {
    "section": "dependencies",
    "name": "uuid",
    "from": "11.1.0",
    "to": "11.1.0",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "world-atlas",
    "from": "2.0.2",
    "to": "2.0.2",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "zod",
    "from": "4.1.11",
    "to": "4.1.11",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "dependencies",
    "name": "zustand",
    "from": "5.0.8",
    "to": "5.0.8",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "devDependencies",
    "name": "@iconify/react",
    "from": "5.2.1",
    "to": "5.2.1",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "devDependencies",
    "name": "@playwright/test",
    "from": "1.56.1",
    "to": "1.56.1",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "devDependencies",
    "name": "@types/d3",
    "from": "7.4.3",
    "to": "7.4.3",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "devDependencies",
    "name": "@types/geojson",
    "from": "7946.0.16",
    "to": "7946.0.16",
    "strategy": "installed",
    "generatedAt": "2025-10-30T10:22:21.335Z"
  },
  {
    "section": "devDependencies",
    "name": "@types/node",
    "from": "20.5.7",
    "to": "20.5.7",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "devDependencies",
    "name": "@types/react",
    "from": "19.1.13",
    "to": "19.1.13",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "devDependencies",
    "name": "@types/react-dom",
    "from": "19.1.9",
    "to": "19.1.9",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "devDependencies",
    "name": "@types/topojson-client",
    "from": "3.1.5",
    "to": "3.1.5",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "devDependencies",
    "name": "@types/topojson-specification",
    "from": "1.0.5",
    "to": "1.0.5",
    "strategy": "installed",
    "generatedAt": "2025-10-30T10:22:21.335Z"
  },
  {
    "section": "devDependencies",
    "name": "@types/uuid",
    "from": "10.0.0",
    "to": "10.0.0",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "devDependencies",
    "name": "@typescript-eslint/eslint-plugin",
    "from": "7.18.0",
    "to": "7.18.0",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "devDependencies",
    "name": "@typescript-eslint/parser",
    "from": "7.18.0",
    "to": "7.18.0",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "devDependencies",
    "name": "autoprefixer",
    "from": "10.4.19",
    "to": "10.4.19",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "devDependencies",
    "name": "babel-plugin-react-compiler",
    "from": "19.1.0-rc.3",
    "to": "19.1.0-rc.3",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "devDependencies",
    "name": "dotenv-expand",
    "from": "12.0.3",
    "to": "12.0.3",
    "strategy": "installed",
    "generatedAt": "2025-12-16T11:35:31.011Z"
  },
  {
    "section": "devDependencies",
    "name": "eslint",
    "from": "8.57.1",
    "to": "8.57.1",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "devDependencies",
    "name": "eslint-config-next",
    "from": "15.5.7",
    "to": "15.5.9",
    "strategy": "installed",
    "generatedAt": "2025-12-15T11:18:25.093Z"
  },
  {
    "section": "devDependencies",
    "name": "eslint-config-prettier",
    "from": "10.1.5",
    "to": "10.1.5",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "devDependencies",
    "name": "eslint-plugin-import",
    "from": "2.32.0",
    "to": "2.32.0",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "devDependencies",
    "name": "eslint-plugin-jsx-a11y",
    "from": "6.10.2",
    "to": "6.10.2",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "devDependencies",
    "name": "eslint-plugin-node",
    "from": "11.1.0",
    "to": "11.1.0",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "devDependencies",
    "name": "eslint-plugin-prettier",
    "from": "5.5.1",
    "to": "5.5.1",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "devDependencies",
    "name": "eslint-plugin-react",
    "from": "7.37.5",
    "to": "7.37.5",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "devDependencies",
    "name": "eslint-plugin-react-hooks",
    "from": "4.6.2",
    "to": "7.0.1",
    "strategy": "installed",
    "generatedAt": "2025-10-28T08:32:52.037Z"
  },
  {
    "section": "devDependencies",
    "name": "eslint-plugin-security",
    "from": "3.0.1",
    "to": "3.0.1",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "devDependencies",
    "name": "eslint-plugin-simple-import-sort",
    "from": "12.1.1",
    "to": "12.1.1",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "devDependencies",
    "name": "eslint-plugin-unused-imports",
    "from": "3.2.0",
    "to": "3.2.0",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "devDependencies",
    "name": "husky",
    "from": "9.1.7",
    "to": "9.1.7",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "devDependencies",
    "name": "lint-staged",
    "from": "15.5.2",
    "to": "15.5.2",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "devDependencies",
    "name": "postcss",
    "from": "8.4.38",
    "to": "8.4.38",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "devDependencies",
    "name": "prettier",
    "from": "3.6.2",
    "to": "3.6.2",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "devDependencies",
    "name": "prettier-plugin-tailwindcss",
    "from": "0.6.14",
    "to": "0.6.14",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "devDependencies",
    "name": "shadcn",
    "from": "3.4.1",
    "to": "3.4.1",
    "strategy": "installed",
    "generatedAt": "2025-10-22T15:52:15.849Z"
  },
  {
    "section": "devDependencies",
    "name": "tailwind-variants",
    "from": "0.1.20",
    "to": "0.1.20",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "devDependencies",
    "name": "tailwindcss",
    "from": "4.1.13",
    "to": "4.1.13",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  },
  {
    "section": "devDependencies",
    "name": "typescript",
    "from": "5.5.4",
    "to": "5.5.4",
    "strategy": "installed",
    "generatedAt": "2025-10-22T12:36:37.962Z"
  }
]
```

--------------------------------------------------------------------------------

---[FILE: Dockerfile]---
Location: prowler-master/ui/Dockerfile

```text
FROM node:20-alpine AS base

LABEL maintainer="https://github.com/prowler-cloud"

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@10 --activate

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
#hadolint ignore=DL3018
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml .npmrc ./
COPY scripts ./scripts
RUN pnpm install --frozen-lockfile


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_PROWLER_RELEASE_VERSION
ENV NEXT_PUBLIC_PROWLER_RELEASE_VERSION=${NEXT_PUBLIC_PROWLER_RELEASE_VERSION}
ARG NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID
ENV NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=${NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID}
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}

RUN pnpm run build

# Development stage
FROM base AS dev
WORKDIR /app

# Set up environment for development
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app /app

# Run development server with hot-reloading
CMD ["pnpm", "run", "dev"]

# Production stage
FROM base AS prod
WORKDIR /app

# Set up environment for production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs &&\
adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
```

--------------------------------------------------------------------------------

---[FILE: images.d.ts]---
Location: prowler-master/ui/images.d.ts

```typescript
declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module "*.jpeg" {
  const value: string;
  export default value;
}

declare module "*.gif" {
  const value: string;
  export default value;
}

declare module "*.svg" {
  const content: any;
  export default content;
}

declare module "*.webp" {
  const value: string;
  export default value;
}
```

--------------------------------------------------------------------------------

---[FILE: instrumentation-client.ts]---
Location: prowler-master/ui/instrumentation-client.ts

```typescript
/**
 * Next.js Client Instrumentation
 *
 * This file runs on the client before React hydration.
 * Used to set up navigation progress tracking.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client
 */

import {
  cancelProgress,
  startProgress,
} from "@/components/ui/navigation-progress/use-navigation-progress";

const NAVIGATION_TYPE = {
  PUSH: "push",
  REPLACE: "replace",
  TRAVERSE: "traverse",
} as const;

type NavigationType = (typeof NAVIGATION_TYPE)[keyof typeof NAVIGATION_TYPE];

function getCurrentUrl(): string {
  return window.location.pathname + window.location.search;
}

/**
 * Called by Next.js when router navigation begins.
 * Triggers the navigation progress bar.
 */
export function onRouterTransitionStart(
  url: string,
  _navigationType: NavigationType,
) {
  const currentUrl = getCurrentUrl();

  if (url === currentUrl) {
    // Same URL - cancel any ongoing progress
    cancelProgress();
  } else {
    // Different URL - start progress
    startProgress();
  }
}
```

--------------------------------------------------------------------------------

````
