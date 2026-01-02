---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1225
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1225 of 1290)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - zulip-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/zulip-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: comment_update.json]---
Location: zulip-main/zerver/webhooks/linear/fixtures/comment_update.json

```json
{
    "action": "update",
    "createdAt": "2023-04-11T10:22:24.895Z",
    "data": {
        "id": "c7cafc52-994d-4984-a217-bff9f9aa9473",
        "createdAt": "2023-04-11T10:21:34.858Z",
        "updatedAt": "2023-04-11T10:22:24.895Z",
        "body": "Invalid response to any system outage or incident, it is essential to perform a comprehensive impact analysis and cost evaluation. By examining factors such as the extent of the outage, the affected systems or services, the number of users affected, and any error messages or logs generated during the incident, we can gain a detailed understanding of the incident's scope.\n\nThis information is then critical in prioritizing resolution efforts and reducing the impact on our organization's operations. Additionally, conducting cost realization allows us to assess the financial implications of the outage and make informed decisions about allocating resources for future incidents.\n\nOverall, performing a thorough impact analysis and cost realization is an effective way to manage incidents and prevent similar issues from recurring.",
        "issueId": "f9a37fcf-eb52-44be-a52c-0477f70e9952",
        "userId": "674c90c8-35ea-454d-8ca4-5548258fd795",
        "editedAt": "2023-04-11T10:22:24.895Z",
        "reactionData": [],
        "issue": {
            "id": "f9a37fcf-eb52-44be-a52c-0477f70e9952",
            "title": "Thorough Impact Analysis and Cost Realization"
        },
        "user": {
            "id": "674c90c8-35ea-454d-8ca4-5548258fd795",
            "name": "Satyam Bansal"
        }
    },
    "updatedFrom": {
        "updatedAt": "2023-04-11T10:21:34.858Z",
        "body": "Performing a thorough impact analysis and cost realization is a crucial step in responding to any system outage or incident. By examining the extent of the outage, the affected systems or services, the number of users impacted, and any error messages or logs generated during the incident, we can gain a comprehensive understanding of the scope of the incident.\n\nThis information can then be used to prioritize the resolution efforts and minimize the impact on our organization's operations. Additionally, cost realization allows us to evaluate the financial impact of the outage on our organization and make informed decisions regarding resource allocation for future incidents.\n\nOverall, conducting a thorough impact analysis and cost realization can help us effectively manage incidents and prevent similar issues from occurring in the future.",
        "editedAt": null
    },
    "url": "https://linear.app/webhooks/issue/WEB-46#comment-c7cafc52",
    "type": "Comment",
    "organizationId": "7a661544-df08-4cd1-a1e3-5ec611898806",
    "webhookTimestamp": 1681208545073
}
```

--------------------------------------------------------------------------------

---[FILE: issue_create_complex.json]---
Location: zulip-main/zerver/webhooks/linear/fixtures/issue_create_complex.json

```json
{
    "action": "create",
    "createdAt": "2023-04-11T10:10:15.037Z",
    "data": {
        "id": "3443a709-f2b5-46f2-a136-a0445fd432be",
        "createdAt": "2023-04-11T10:10:15.037Z",
        "updatedAt": "2023-04-11T10:10:15.037Z",
        "number": 44,
        "title": "This is regarding the outage that we faced during 11/12/22 from 2000 to 2200.",
        "priority": 1,
        "boardOrder": 0,
        "sortOrder": -2036,
        "startedAt": "2023-04-11T10:10:15.093Z",
        "teamId": "9e383f51-2629-4f19-97ff-451cc2f0a0ad",
        "previousIdentifiers": [],
        "creatorId": "674c90c8-35ea-454d-8ca4-5548258fd795",
        "assigneeId": "674c90c8-35ea-454d-8ca4-5548258fd795",
        "stateId": "a2530cac-36a0-4b6d-9af0-6357784035d4",
        "priorityLabel": "Urgent",
        "subscriberIds": [
            "674c90c8-35ea-454d-8ca4-5548258fd795"
        ],
        "labelIds": [
            "6e4da2ed-ee8b-4b19-9cf8-40e5603e04c1",
            "56111f1a-e733-49f2-856a-c42318bb8739",
            "196379c2-287d-436d-962c-b2c0ce8281a1",
            "926b0916-05e2-4e8b-a7c6-96bc2c763326"
        ],
        "description": "The outage that occurred on the above-mentioned date is a cause for concern as it could have significant implications for the organization and its users. A prolonged outage can result in lost revenue, productivity, and customer confidence. Therefore, it is essential to conduct a detailed assessment and analysis to identify the root cause of the outage and take appropriate measures to prevent its recurrence.\n\nThe analysis process may involve the use of specialized tools and techniques to help pinpoint the exact cause of the outage. Once the root cause has been identified, the organization can take steps to implement effective solutions that can mitigate the risk of a similar outage happening in the future. The assessment and analysis process will help the organization to develop a more robust and reliable IT infrastructure that can provide uninterrupted services to its users.",
        "descriptionData": "{\"type\":\"doc\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"text\":\"The outage that occurred on the above-mentioned date is a cause for concern as it could have significant implications for the organization and its users. A prolonged outage can result in lost revenue, productivity, and customer confidence. Therefore, it is essential to conduct a detailed assessment and analysis to identify the root cause of the outage and take appropriate measures to prevent its recurrence.\",\"type\":\"text\"}]},{\"type\":\"paragraph\",\"content\":[{\"text\":\"The analysis process may involve the use of specialized tools and techniques to help pinpoint the exact cause of the outage. Once the root cause has been identified, the organization can take steps to implement effective solutions that can mitigate the risk of a similar outage happening in the future. The assessment and analysis process will help the organization to develop a more robust and reliable IT infrastructure that can provide uninterrupted services to its users.\",\"type\":\"text\"}]}]}",
        "assignee": {
            "id": "674c90c8-35ea-454d-8ca4-5548258fd795",
            "name": "Satyam Bansal"
        },
        "state": {
            "id": "a2530cac-36a0-4b6d-9af0-6357784035d4",
            "color": "#f2c94c",
            "name": "In Progress",
            "type": "started"
        },
        "team": {
            "id": "9e383f51-2629-4f19-97ff-451cc2f0a0ad",
            "key": "WEB",
            "name": "Webhooks"
        },
        "labels": [
            {
                "id": "56111f1a-e733-49f2-856a-c42318bb8739",
                "color": "#4EA7FC",
                "name": "Improvement"
            },
            {
                "id": "196379c2-287d-436d-962c-b2c0ce8281a1",
                "color": "#BB87FC",
                "name": "Feature"
            },
            {
                "id": "6e4da2ed-ee8b-4b19-9cf8-40e5603e04c1",
                "color": "#EB5757",
                "name": "Bug"
            },
            {
                "id": "926b0916-05e2-4e8b-a7c6-96bc2c763326",
                "color": "#26b5ce",
                "name": "Custom Label"
            }
        ]
    },
    "url": "https://linear.app/webhooks/issue/WEB-44/this-is-regarding-the-outage-that-we-faced-during-111222-from-2000-to",
    "type": "Issue",
    "organizationId": "7a661544-df08-4cd1-a1e3-5ec611898806",
    "webhookTimestamp": 1681207816078
}
```

--------------------------------------------------------------------------------

---[FILE: issue_create_simple.json]---
Location: zulip-main/zerver/webhooks/linear/fixtures/issue_create_simple.json

```json
{
    "action": "create",
    "createdAt": "2023-04-11T09:59:47.094Z",
    "data": {
        "id": "a4344dc7-7d8d-4b28-a93c-553ac9aba41a",
        "createdAt": "2023-04-11T09:59:47.094Z",
        "updatedAt": "2023-04-11T09:59:47.094Z",
        "number": 43,
        "title": "Very small font in tooltip",
        "priority": 0,
        "boardOrder": 0,
        "sortOrder": -27663,
        "teamId": "9e383f51-2629-4f19-97ff-451cc2f0a0ad",
        "previousIdentifiers": [],
        "creatorId": "674c90c8-35ea-454d-8ca4-5548258fd795",
        "stateId": "a19a64b3-1d56-4ecb-b40e-d14aee5e9368",
        "priorityLabel": "No priority",
        "subscriberIds": [
            "674c90c8-35ea-454d-8ca4-5548258fd795"
        ],
        "labelIds": [],
        "description": "The tooltips at the \"Select Drawing\" and \"Edit Drawing\" buttons have a very small font and therefore are not very legible. Apart from this, the wording of the text has to be changed to fit better with the overall design pattern.",
        "descriptionData": "{\"type\":\"doc\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"text\":\"The tooltips at the \\\"Select Drawing\\\" and \\\"Edit Drawing\\\" buttons have a very small font and therefore are not very legible. Apart from this, the wording of the text has to be changed to fit better with the overall design pattern.\",\"type\":\"text\"}]}]}",
        "state": {
            "id": "a19a64b3-1d56-4ecb-b40e-d14aee5e9368",
            "color": "#e2e2e2",
            "name": "Todo",
            "type": "unstarted"
        },
        "team": {
            "id": "9e383f51-2629-4f19-97ff-451cc2f0a0ad",
            "key": "WEB",
            "name": "Webhooks"
        },
        "labels": []
    },
    "url": "https://linear.app/webhooks/issue/WEB-43/very-small-font-in-tooltip",
    "type": "Issue",
    "organizationId": "7a661544-df08-4cd1-a1e3-5ec611898806",
    "webhookTimestamp": 1681207187330
}
```

--------------------------------------------------------------------------------

---[FILE: issue_create_simple_without_description.json]---
Location: zulip-main/zerver/webhooks/linear/fixtures/issue_create_simple_without_description.json

```json
{
    "action": "create",
    "createdAt": "2023-04-11T09:47:53.218Z",
    "data": {
        "id": "21e12515-fe5e-4923-88a1-e9ace5056473",
        "createdAt": "2023-04-11T09:47:53.218Z",
        "updatedAt": "2023-04-11T09:47:53.218Z",
        "number": 42,
        "title": "Drop-down overflow in the select menu.",
        "priority": 2,
        "boardOrder": 0,
        "sortOrder": -26718,
        "teamId": "9e383f51-2629-4f19-97ff-451cc2f0a0ad",
        "previousIdentifiers": [],
        "creatorId": "674c90c8-35ea-454d-8ca4-5548258fd795",
        "stateId": "a19a64b3-1d56-4ecb-b40e-d14aee5e9368",
        "priorityLabel": "High",
        "subscriberIds": [
            "674c90c8-35ea-454d-8ca4-5548258fd795"
        ],
        "labelIds": [],
        "state": {
            "id": "a19a64b3-1d56-4ecb-b40e-d14aee5e9368",
            "color": "#e2e2e2",
            "name": "Todo",
            "type": "unstarted"
        },
        "team": {
            "id": "9e383f51-2629-4f19-97ff-451cc2f0a0ad",
            "key": "WEB",
            "name": "Webhooks"
        },
        "labels": []
    },
    "url": "https://linear.app/webhooks/issue/WEB-42/drop-down-overflow-in-the-select-menu",
    "type": "Issue",
    "organizationId": "7a661544-df08-4cd1-a1e3-5ec611898806",
    "webhookTimestamp": 1681206473447
}
```

--------------------------------------------------------------------------------

---[FILE: issue_remove.json]---
Location: zulip-main/zerver/webhooks/linear/fixtures/issue_remove.json

```json
{
    "action": "remove",
    "createdAt": "2023-04-11T10:17:17.810Z",
    "data": {
        "id": "3443a709-f2b5-46f2-a136-a0445fd432be",
        "createdAt": "2023-04-11T10:10:15.037Z",
        "updatedAt": "2023-04-11T10:16:53.023Z",
        "archivedAt": "2023-04-11T10:17:17.810Z",
        "number": 44,
        "title": "This is regarding the outage that we faced on 11/12/22 from 2000 to 2200 and also on 25/12/22 from 0000 to 0230",
        "priority": 1,
        "boardOrder": 0,
        "sortOrder": -2036,
        "startedAt": "2023-04-11T10:10:15.093Z",
        "trashed": true,
        "teamId": "9e383f51-2629-4f19-97ff-451cc2f0a0ad",
        "cycleId": "eaef2755-de5b-4342-accb-79060378493f",
        "previousIdentifiers": [],
        "creatorId": "674c90c8-35ea-454d-8ca4-5548258fd795",
        "assigneeId": "674c90c8-35ea-454d-8ca4-5548258fd795",
        "stateId": "a2530cac-36a0-4b6d-9af0-6357784035d4",
        "priorityLabel": "Urgent",
        "subscriberIds": [
            "674c90c8-35ea-454d-8ca4-5548258fd795"
        ],
        "labelIds": [
            "6e4da2ed-ee8b-4b19-9cf8-40e5603e04c1",
            "56111f1a-e733-49f2-856a-c42318bb8739",
            "196379c2-287d-436d-962c-b2c0ce8281a1",
            "926b0916-05e2-4e8b-a7c6-96bc2c763326"
        ],
        "description": "The outage that occurred on the above-mentioned date is a cause for concern as it could have significant implications for the organization and its users. A prolonged outage can result in lost revenue, productivity, and customer confidence. Therefore, it is essential to conduct a detailed assessment and analysis to identify the root cause of the outage and take appropriate measures to prevent its recurrence.\n\nThe analysis process may involve the use of specialized tools and techniques to help pinpoint the exact cause of the outage. Once the root cause has been identified, the organization can take steps to implement effective solutions that can mitigate the risk of a similar outage happening in the future. The assessment and analysis process will help the organization to develop a more robust and reliable IT infrastructure that can provide uninterrupted services to its users.",
        "descriptionData": "{\"type\":\"doc\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"text\":\"The outage that occurred on the above-mentioned date is a cause for concern as it could have significant implications for the organization and its users. A prolonged outage can result in lost revenue, productivity, and customer confidence. Therefore, it is essential to conduct a detailed assessment and analysis to identify the root cause of the outage and take appropriate measures to prevent its recurrence.\",\"type\":\"text\"}]},{\"type\":\"paragraph\",\"content\":[{\"text\":\"The analysis process may involve the use of specialized tools and techniques to help pinpoint the exact cause of the outage. Once the root cause has been identified, the organization can take steps to implement effective solutions that can mitigate the risk of a similar outage happening in the future. The assessment and analysis process will help the organization to develop a more robust and reliable IT infrastructure that can provide uninterrupted services to its users.\",\"type\":\"text\"}]}]}",
        "assignee": {
            "id": "674c90c8-35ea-454d-8ca4-5548258fd795",
            "name": "Satyam Bansal"
        },
        "cycle": {
            "id": "eaef2755-de5b-4342-accb-79060378493f",
            "number": 1,
            "startsAt": "2023-04-05T18:30:00.000Z",
            "endsAt": "2023-04-12T18:30:00.000Z"
        },
        "state": {
            "id": "a2530cac-36a0-4b6d-9af0-6357784035d4",
            "color": "#f2c94c",
            "name": "In Progress",
            "type": "started"
        },
        "team": {
            "id": "9e383f51-2629-4f19-97ff-451cc2f0a0ad",
            "key": "WEB",
            "name": "Webhooks"
        },
        "labels": [
            {
                "id": "56111f1a-e733-49f2-856a-c42318bb8739",
                "color": "#4EA7FC",
                "name": "Improvement"
            },
            {
                "id": "196379c2-287d-436d-962c-b2c0ce8281a1",
                "color": "#BB87FC",
                "name": "Feature"
            },
            {
                "id": "6e4da2ed-ee8b-4b19-9cf8-40e5603e04c1",
                "color": "#EB5757",
                "name": "Bug"
            },
            {
                "id": "926b0916-05e2-4e8b-a7c6-96bc2c763326",
                "color": "#26b5ce",
                "name": "Custom Label"
            }
        ]
    },
    "type": "Issue",
    "organizationId": "7a661544-df08-4cd1-a1e3-5ec611898806",
    "webhookTimestamp": 1681208237985
}
```

--------------------------------------------------------------------------------

---[FILE: issue_sub_issue_create.json]---
Location: zulip-main/zerver/webhooks/linear/fixtures/issue_sub_issue_create.json

```json
{
    "action": "create",
    "createdAt": "2023-04-11T10:10:15.037Z",
    "data": {
        "id": "f9a37fcf-eb52-44be-a52c-0477f70e9952",
        "createdAt": "2023-04-11T10:10:15.037Z",
        "updatedAt": "2023-04-11T10:10:15.037Z",
        "number": 46,
        "title": "Impact Analysis",
        "priority": 0,
        "boardOrder": 0,
        "sortOrder": -29786,
        "teamId": "9e383f51-2629-4f19-97ff-451cc2f0a0ad",
        "previousIdentifiers": [],
        "creatorId": "674c90c8-35ea-454d-8ca4-5548258fd795",
        "stateId": "a19a64b3-1d56-4ecb-b40e-d14aee5e9368",
        "parentId": "3443a709-f2b5-46f2-a136-a0445fd432be",
        "subIssueSortOrder": 1102,
        "priorityLabel": "No priority",
        "subscriberIds": [
            "674c90c8-35ea-454d-8ca4-5548258fd795"
        ],
        "labelIds": [],
        "description": "Examining the extent of the outage, the affected systems or services, the number of users impacted, and any error messages or logs generated during the incident.",
        "descriptionData": "{\"type\":\"doc\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"text\":\"Examining the extent of the outage, the affected systems or services, the number of users impacted, and any error messages or logs generated during the incident.\",\"type\":\"text\"}]}]}",
        "state": {
            "id": "a19a64b3-1d56-4ecb-b40e-d14aee5e9368",
            "color": "#e2e2e2",
            "name": "Todo",
            "type": "unstarted"
        },
        "team": {
            "id": "9e383f51-2629-4f19-97ff-451cc2f0a0ad",
            "key": "WEB",
            "name": "Webhooks"
        },
        "labels": []
    },
    "url": "https://linear.app/webhooks/issue/WEB-46/impact-analysis",
    "type": "Issue",
    "organizationId": "7a661544-df08-4cd1-a1e3-5ec611898806",
    "webhookTimestamp": 1681207816141
}
```

--------------------------------------------------------------------------------

---[FILE: issue_sub_issue_remove.json]---
Location: zulip-main/zerver/webhooks/linear/fixtures/issue_sub_issue_remove.json

```json
{
    "action": "remove",
    "createdAt": "2023-04-11T10:13:05.795Z",
    "data": {
        "id": "f9a37fcf-eb52-44be-a52c-0477f70e9952",
        "createdAt": "2023-04-11T10:10:15.037Z",
        "updatedAt": "2023-04-11T10:12:11.142Z",
        "archivedAt": "2023-04-11T10:13:05.795Z",
        "number": 46,
        "title": "Thorough Impact Analysis and Cost Realization",
        "priority": 0,
        "boardOrder": 0,
        "sortOrder": -29786,
        "trashed": true,
        "teamId": "9e383f51-2629-4f19-97ff-451cc2f0a0ad",
        "previousIdentifiers": [],
        "creatorId": "674c90c8-35ea-454d-8ca4-5548258fd795",
        "stateId": "a19a64b3-1d56-4ecb-b40e-d14aee5e9368",
        "parentId": "3443a709-f2b5-46f2-a136-a0445fd432be",
        "subIssueSortOrder": 1102,
        "priorityLabel": "No priority",
        "subscriberIds": [
            "674c90c8-35ea-454d-8ca4-5548258fd795"
        ],
        "labelIds": [],
        "description": "Examining the extent of the outage, the affected systems or services, the number of users impacted, and any error messages or logs generated during the incident.",
        "descriptionData": "{\"type\":\"doc\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"text\":\"Examining the extent of the outage, the affected systems or services, the number of users impacted, and any error messages or logs generated during the incident.\",\"type\":\"text\"}]}]}",
        "state": {
            "id": "a19a64b3-1d56-4ecb-b40e-d14aee5e9368",
            "color": "#e2e2e2",
            "name": "Todo",
            "type": "unstarted"
        },
        "team": {
            "id": "9e383f51-2629-4f19-97ff-451cc2f0a0ad",
            "key": "WEB",
            "name": "Webhooks"
        },
        "labels": []
    },
    "type": "Issue",
    "organizationId": "7a661544-df08-4cd1-a1e3-5ec611898806",
    "webhookTimestamp": 1681207985997
}
```

--------------------------------------------------------------------------------

---[FILE: issue_sub_issue_update.json]---
Location: zulip-main/zerver/webhooks/linear/fixtures/issue_sub_issue_update.json

```json
{
    "action": "update",
    "createdAt": "2023-04-11T10:12:11.141Z",
    "data": {
        "id": "f9a37fcf-eb52-44be-a52c-0477f70e9952",
        "createdAt": "2023-04-11T10:10:15.037Z",
        "updatedAt": "2023-04-11T10:12:11.141Z",
        "number": 46,
        "title": "Thorough Impact Analysis and Cost Realization",
        "priority": 0,
        "boardOrder": 0,
        "sortOrder": -29786,
        "teamId": "9e383f51-2629-4f19-97ff-451cc2f0a0ad",
        "previousIdentifiers": [],
        "creatorId": "674c90c8-35ea-454d-8ca4-5548258fd795",
        "stateId": "a19a64b3-1d56-4ecb-b40e-d14aee5e9368",
        "parentId": "3443a709-f2b5-46f2-a136-a0445fd432be",
        "subIssueSortOrder": 1102,
        "priorityLabel": "No priority",
        "subscriberIds": [
            "674c90c8-35ea-454d-8ca4-5548258fd795"
        ],
        "labelIds": [],
        "description": "Examining the extent of the outage, the affected systems or services, the number of users impacted, and any error messages or logs generated during the incident.",
        "descriptionData": "{\"type\":\"doc\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"text\":\"Examining the extent of the outage, the affected systems or services, the number of users impacted, and any error messages or logs generated during the incident.\",\"type\":\"text\"}]}]}",
        "state": {
            "id": "a19a64b3-1d56-4ecb-b40e-d14aee5e9368",
            "color": "#e2e2e2",
            "name": "Todo",
            "type": "unstarted"
        },
        "team": {
            "id": "9e383f51-2629-4f19-97ff-451cc2f0a0ad",
            "key": "WEB",
            "name": "Webhooks"
        },
        "labels": []
    },
    "updatedFrom": {
        "updatedAt": "2023-04-11T10:10:15.037Z",
        "title": "Impact Analysis"
    },
    "url": "https://linear.app/webhooks/issue/WEB-46/thorough-impact-analysis-and-cost-realization",
    "type": "Issue",
    "organizationId": "7a661544-df08-4cd1-a1e3-5ec611898806",
    "webhookTimestamp": 1681207931317
}
```

--------------------------------------------------------------------------------

---[FILE: issue_update.json]---
Location: zulip-main/zerver/webhooks/linear/fixtures/issue_update.json

```json
{
    "action": "update",
    "createdAt": "2023-04-11T10:16:53.022Z",
    "data": {
        "id": "3443a709-f2b5-46f2-a136-a0445fd432be",
        "createdAt": "2023-04-11T10:10:15.037Z",
        "updatedAt": "2023-04-11T10:16:53.022Z",
        "number": 44,
        "title": "This is regarding the outage that we faced on 11/12/22 from 2000 to 2200 and also on 25/12/22 from 0000 to 0230",
        "priority": 1,
        "boardOrder": 0,
        "sortOrder": -2036,
        "startedAt": "2023-04-11T10:10:15.093Z",
        "teamId": "9e383f51-2629-4f19-97ff-451cc2f0a0ad",
        "cycleId": "eaef2755-de5b-4342-accb-79060378493f",
        "previousIdentifiers": [],
        "creatorId": "674c90c8-35ea-454d-8ca4-5548258fd795",
        "assigneeId": "674c90c8-35ea-454d-8ca4-5548258fd795",
        "stateId": "a2530cac-36a0-4b6d-9af0-6357784035d4",
        "priorityLabel": "Urgent",
        "subscriberIds": [
            "674c90c8-35ea-454d-8ca4-5548258fd795"
        ],
        "labelIds": [
            "6e4da2ed-ee8b-4b19-9cf8-40e5603e04c1",
            "56111f1a-e733-49f2-856a-c42318bb8739",
            "196379c2-287d-436d-962c-b2c0ce8281a1",
            "926b0916-05e2-4e8b-a7c6-96bc2c763326"
        ],
        "description": "The outage that occurred on the above-mentioned date is a cause for concern as it could have significant implications for the organization and its users. A prolonged outage can result in lost revenue, productivity, and customer confidence. Therefore, it is essential to conduct a detailed assessment and analysis to identify the root cause of the outage and take appropriate measures to prevent its recurrence.\n\nThe analysis process may involve the use of specialized tools and techniques to help pinpoint the exact cause of the outage. Once the root cause has been identified, the organization can take steps to implement effective solutions that can mitigate the risk of a similar outage happening in the future. The assessment and analysis process will help the organization to develop a more robust and reliable IT infrastructure that can provide uninterrupted services to its users.",
        "descriptionData": "{\"type\":\"doc\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"text\":\"The outage that occurred on the above-mentioned date is a cause for concern as it could have significant implications for the organization and its users. A prolonged outage can result in lost revenue, productivity, and customer confidence. Therefore, it is essential to conduct a detailed assessment and analysis to identify the root cause of the outage and take appropriate measures to prevent its recurrence.\",\"type\":\"text\"}]},{\"type\":\"paragraph\",\"content\":[{\"text\":\"The analysis process may involve the use of specialized tools and techniques to help pinpoint the exact cause of the outage. Once the root cause has been identified, the organization can take steps to implement effective solutions that can mitigate the risk of a similar outage happening in the future. The assessment and analysis process will help the organization to develop a more robust and reliable IT infrastructure that can provide uninterrupted services to its users.\",\"type\":\"text\"}]}]}",
        "assignee": {
            "id": "674c90c8-35ea-454d-8ca4-5548258fd795",
            "name": "Satyam Bansal"
        },
        "cycle": {
            "id": "eaef2755-de5b-4342-accb-79060378493f",
            "number": 1,
            "startsAt": "2023-04-05T18:30:00.000Z",
            "endsAt": "2023-04-12T18:30:00.000Z"
        },
        "state": {
            "id": "a2530cac-36a0-4b6d-9af0-6357784035d4",
            "color": "#f2c94c",
            "name": "In Progress",
            "type": "started"
        },
        "team": {
            "id": "9e383f51-2629-4f19-97ff-451cc2f0a0ad",
            "key": "WEB",
            "name": "Webhooks"
        },
        "labels": [
            {
                "id": "56111f1a-e733-49f2-856a-c42318bb8739",
                "color": "#4EA7FC",
                "name": "Improvement"
            },
            {
                "id": "196379c2-287d-436d-962c-b2c0ce8281a1",
                "color": "#BB87FC",
                "name": "Feature"
            },
            {
                "id": "6e4da2ed-ee8b-4b19-9cf8-40e5603e04c1",
                "color": "#EB5757",
                "name": "Bug"
            },
            {
                "id": "926b0916-05e2-4e8b-a7c6-96bc2c763326",
                "color": "#26b5ce",
                "name": "Custom Label"
            }
        ]
    },
    "updatedFrom": {
        "updatedAt": "2023-04-11T10:13:05.980Z",
        "title": "This is regarding the outage that we faced during 11/12/22 from 2000 to 2200."
    },
    "url": "https://linear.app/webhooks/issue/WEB-44/this-is-regarding-the-outage-that-we-faced-on-111222-from-2000-to-2200",
    "type": "Issue",
    "organizationId": "7a661544-df08-4cd1-a1e3-5ec611898806",
    "webhookTimestamp": 1681208213456
}
```

--------------------------------------------------------------------------------

---[FILE: project_create.json]---
Location: zulip-main/zerver/webhooks/linear/fixtures/project_create.json

```json
{
    "action": "create",
    "createdAt": "2023-04-11T19:26:16.461Z",
    "data": {
        "id": "521660ac-782f-4dd9-8928-95dbc9cb4c9b",
        "createdAt": "2023-04-11T19:26:16.461Z",
        "updatedAt": "2023-04-11T19:26:16.461Z",
        "name": "This is just a sample project to test the working.",
        "description": "",
        "slugId": "3d89ec1c20d3",
        "color": "#bec2c8",
        "state": "backlog",
        "creatorId": "674c90c8-35ea-454d-8ca4-5548258fd795",
        "leadId": "674c90c8-35ea-454d-8ca4-5548258fd795",
        "sortOrder": 2014.64,
        "issueCountHistory": [],
        "completedIssueCountHistory": [],
        "scopeHistory": [],
        "completedScopeHistory": [],
        "inProgressScopeHistory": [],
        "slackNewIssue": true,
        "slackIssueComments": true,
        "slackIssueStatuses": true,
        "teamIds": [
            "9e383f51-2629-4f19-97ff-451cc2f0a0ad"
        ],
        "memberIds": [
            "674c90c8-35ea-454d-8ca4-5548258fd795"
        ]
    },
    "url": "https://linear.app/webhooks/project/this-is-just-a-sample-project-to-test-the-working-3d89ec1c20d3",
    "type": "Project",
    "organizationId": "7a661544-df08-4cd1-a1e3-5ec611898806",
    "webhookTimestamp": 1681241176588
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/mention/doc.md

```text
# Zulip Mention integration

Get Mention notifications within Zulip via Zapier!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Go to your Mention feed, and click on your profile in the top-right
   corner. Select **Settings**, click on **Integrations**, and select
   the **Zapier** integration.

1. Click **Explore Mention on Zapier**. Search for "webhooks" in
   the search bar, and click on **Webhooks by Zapier**. Look for
   **Add Webhook posts for new Mentions**, and click on
   **Use this Zap**. Click **Create this Zap**.

1. Follow the on-screen steps to link your Mention account to Zapier.
   Select your Mention **Account ID** and **Alert** when prompted.

1. Follow the on-screen steps to set up **Webhooks by Zapier POST**.
   When prompted, set **URL** to the URL constructed above, and set
   **Payload Type** to **JSON**. After **Test this Step**, click
   **Finish**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/mention/001.png)

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/mention/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class MentionHookTests(WebhookTestCase):
    CHANNEL_NAME = "test"
    URL_TEMPLATE = "/api/v1/external/mention?api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "mention"

    def test_mention_webfeed(self) -> None:
        expected_topic_name = "news"
        expected_message = """
**[Travel Industry Sees Surge in Eco-Tourism (Travel): 29 Nov 2024: Global Tourism - TheyWorkForYou](https://www.theyworkforyou.com/debates/?id=2016-11-29b.1398.7&p=24887)**:

``` quote
\u2026 Tourism, Culture and Heritage\nMore travelers prioritize environmental sustainability, driving growth in eco-friendly accommodations and activities. Popular destinations include Costa Rica and \u2026
```
""".strip()

        # use fixture named mention_webfeeds
        self.check_webhook(
            "webfeeds",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/mention/view.py
Signals: Django

```python
# Webhooks for external integrations.
from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile


@webhook_view("Mention")
@typed_endpoint
def api_mention_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    title = payload["title"].tame(check_string)
    source_url = payload["url"].tame(check_string)
    description = payload["description"].tame(check_string)
    # construct the body of the message
    template = """
**[{title}]({url})**:

``` quote
{description}
```
""".strip()
    body = template.format(title=title, url=source_url, description=description)
    topic_name = "news"

    # send the message
    check_send_webhook_message(request, user_profile, topic_name, body)

    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: webfeeds.json]---
Location: zulip-main/zerver/webhooks/mention/fixtures/webfeeds.json

```json
{
  "tasks": "",
  "tone": "0",
  "relevance_score": "1",
  "domain_reach": "13600",
  "updated_at": "2016-12-01T21:20:47.0+00:00",
  "published_at": "2016-12-01T21:20:46.22619100+00:00",
  "language_code": "en",
  "tone_score": "0.529054",
  "source_name": "theyworkforyou.com",
  "children": "",
  "logs": "",
  "display_site": "True",
  "title": "Travel Industry Sees Surge in Eco-Tourism (Travel): 29 Nov 2024: Global Tourism - TheyWorkForYou",
  "tags": "",
  "id": "121983065969",
  "description_short": "\u2026 Child sex abuse is an exceptionally vile crime, and all of Government take it very \u2026",
  "trashed": "False",
  "description": "\u2026 Tourism, Culture and Heritage\nMore travelers prioritize environmental sustainability, driving growth in eco-friendly accommodations and activities. Popular destinations include Costa Rica and \u2026",
  "offsets": {
    "source_name": "",
    "description": "122,122,5,5",
    "title": "",
    "url": "",
    "source_url": "",
    "description_medium": "89,89,5,5",
    "description_short": "43,43,5,5"
  },
  "read": "False",
  "source_url": "https:\/\/theyworkforyou.com",
  "author_influence": {
    "kind": "web",
    "name": "theyworkforyou.com",
    "scored_id": "theyworkforyou.com",
    "url": "https:\/\/theyworkforyou.com",
    "alert_id": "1380332",
    "score": "49",
    "author_unique_id": "theyworkforyou.com",
    "id": "44169449220"
  },
  "important": "False",
  "_zap_data_last_live_poll": "1480628636",
  "permissions": {
    "share_email": "True",
    "edit": "True",
    "create_task": "True",
    "favorite": "True",
    "share_facebook": "True",
    "trash": "True",
    "private_message_reply": "False",
    "share_buffer": "True"
  },
  "alert_id": "1380332",
  "source_type": "web",
  "_zap_data_was_live": "True",
  "_c": "r",
  "created_at": "2016-12-01T21:20:47.0+00:00",
  "favorite": "False",
  "trashed_set_by_user": "False",
  "_zap_data_was_cached": "True",
  "url": "https:\/\/www.theyworkforyou.com\/debates\/?id=2016-11-29b.1398.7&p=24887",
  "description_medium": "\u2026 is more important than keeping children safe. Child sex abuse is an exceptionally vile crime, and all of Government take it very seriously indeed, as I know this House does.\nChildren \u2026",
  "country": "GB",
  "unique_id": "https:\/\/www.theyworkforyou.com\/debates\/?id=2016-11-29b.1398.7&p=24887"
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/netlify/doc.md

```text
# Zulip Netlify integration

Get Zulip notifications for your Netlify deployments!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Go to your Netlify project, and click **Settings**. Click **Build & deploy**,
   and select **Deploy notifications**.
   Click **Add Notification**, and select **HTTP POST request**.

1. Select an **Event**, and set **URL to notify** to the URL generated above.
   Click **Save**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/netlify/001.png)

### Related documentation

- [Netlify HTTP Post Request documentation](https://docs.netlify.com/site-deploys/notifications/#http-post-request)

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/netlify/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class NetlifyHookTests(WebhookTestCase):
    CHANNEL_NAME = "netlify"
    URL_TEMPLATE = "/api/v1/external/netlify?stream={stream}&api_key={api_key}"
    WEBHOOK_DIR_NAME = "netlify"

    def test_building_message(self) -> None:
        expected_topic_name = "master"
        expected_message = "The build [objective-jepsen-35fbb2](http://objective-jepsen-35fbb2.netlify.com) on branch master is now building."

        self.check_webhook(
            "deploy_building",
            expected_topic_name,
            expected_message,
            content_type="application/json",
        )

    def test_created_message(self) -> None:
        expected_topic_name = "master"
        expected_message = "The build [objective-jepsen-35fbb2](http://objective-jepsen-35fbb2.netlify.com) on branch master is now ready."

        self.check_webhook(
            "deploy_created", expected_topic_name, expected_message, content_type="application/json"
        )

    def test_failed_message(self) -> None:
        expected_topic_name = "master"
        expected_message = (
            "The build [objective-jepsen-35fbb2](http://objective-jepsen-35fbb2.netlify.com) "
            "on branch master failed during stage 'building site': Build script returned non-zero exit code: 127"
        )

        self.check_webhook(
            "deploy_failed", expected_topic_name, expected_message, content_type="application/json"
        )

    def test_locked_message(self) -> None:
        expected_topic_name = "master"
        expected_message = (
            "The build [objective-jepsen-35fbb2](http://objective-jepsen-35fbb2.netlify.com) "
            "on branch master is now locked."
        )

        self.check_webhook(
            "deploy_locked", expected_topic_name, expected_message, content_type="application/json"
        )

    def test_unlocked_message(self) -> None:
        expected_topic_name = "master"
        expected_message = (
            "The build [objective-jepsen-35fbb2](http://objective-jepsen-35fbb2.netlify.com) "
            "on branch master is now unlocked."
        )

        self.check_webhook(
            "deploy_unlocked",
            expected_topic_name,
            expected_message,
            content_type="application/json",
        )
```

--------------------------------------------------------------------------------

````
