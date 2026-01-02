---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1140
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1140 of 1290)

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

---[FILE: story_update_everything_at_once.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_update_everything_at_once.json

```json
{
  "id": "60723fdc-2c6d-4b31-b160-ef4d438dc5bc",
  "changed_at": "2021-04-11T00:16:28.845Z",
  "version": "v1",
  "member_id": "6071752f-e16e-4f79-b41e-7c78b76aa4bd",
  "actions": [
    {
      "id": 17,
      "entity_type": "story",
      "action": "update",
      "name": "asd4",
      "story_type": "bug",
      "app_url": "https://app.clubhouse.io/pig208/story/17",
      "changes": {
        "story_type": {
          "new": "bug",
          "old": "feature"
        },
        "epic_id": {
          "new": 23,
          "old": 29
        },
        "requested_by_id": {
          "new": "60723f5f-28ca-4ec2-a3a2-37b2dc5606ae",
          "old": "6071752f-e16e-4f79-b41e-7c78b76aa4bd"
        },
        "label_ids": {
          "adds": [
            8
          ]
        },
        "group_id": {
          "new": "6071adb0-641f-46c4-b5e1-4945dae399ea",
          "old": "6071752f-ece0-4772-854c-05a9666c480f"
        },
        "workflow_state_id": {
          "new": 500000010,
          "old": 500000006
        },
        "follower_ids": {
          "adds": [
            "60723f5f-28ca-4ec2-a3a2-37b2dc5606ae"
          ]
        },
        "owner_ids": {
          "adds": [
            "60723f5f-28ca-4ec2-a3a2-37b2dc5606ae"
          ]
        },
        "position": {
          "new": 42147811328,
          "old": 32147483648
        },
        "project_id": {
          "new": 28,
          "old": 2
        },
        "deadline": {
          "new": "2021-04-12T16:00:00Z",
          "old": "2021-04-11T16:00:00Z"
        }
      }
    },
    {
      "id": 26,
      "entity_type": "story",
      "action": "update",
      "name": "new1",
      "story_type": "bug",
      "app_url": "https://app.clubhouse.io/pig208/story/26",
      "changes": {
        "story_type": {
          "new": "bug",
          "old": "feature"
        },
        "epic_id": {
          "new": 23,
          "old": 29
        },
        "requested_by_id": {
          "new": "60723f5f-28ca-4ec2-a3a2-37b2dc5606ae",
          "old": "6071752f-e16e-4f79-b41e-7c78b76aa4bd"
        },
        "label_ids": {
          "adds": [
            8
          ]
        },
        "group_id": {
          "new": "6071adb0-641f-46c4-b5e1-4945dae399ea",
          "old": "6071752f-ece0-4772-854c-05a9666c480f"
        },
        "workflow_state_id": {
          "new": 500000010,
          "old": 500000006
        },
        "follower_ids": {
          "adds": [
            "60723f5f-28ca-4ec2-a3a2-37b2dc5606ae"
          ]
        },
        "owner_ids": {
          "adds": [
            "60723f5f-28ca-4ec2-a3a2-37b2dc5606ae"
          ]
        },
        "position": {
          "new": 42147942400,
          "old": 32147680256
        },
        "project_id": {
          "new": 28,
          "old": 2
        },
        "deadline": {
          "new": "2021-04-12T16:00:00Z",
          "old": "2021-04-11T16:00:00Z"
        }
      }
    },
    {
      "id": 27,
      "entity_type": "story",
      "action": "update",
      "name": "new2",
      "story_type": "bug",
      "app_url": "https://app.clubhouse.io/pig208/story/27",
      "changes": {
        "story_type": {
          "new": "bug",
          "old": "feature"
        },
        "epic_id": {
          "new": 23,
          "old": 29
        },
        "requested_by_id": {
          "new": "60723f5f-28ca-4ec2-a3a2-37b2dc5606ae",
          "old": "6071752f-e16e-4f79-b41e-7c78b76aa4bd"
        },
        "label_ids": {
          "adds": [
            8
          ]
        },
        "group_id": {
          "new": "6071adb0-641f-46c4-b5e1-4945dae399ea",
          "old": "6071752f-ece0-4772-854c-05a9666c480f"
        },
        "workflow_state_id": {
          "new": 500000010,
          "old": 500000006
        },
        "follower_ids": {
          "adds": [
            "60723f5f-28ca-4ec2-a3a2-37b2dc5606ae"
          ]
        },
        "owner_ids": {
          "adds": [
            "60723f5f-28ca-4ec2-a3a2-37b2dc5606ae"
          ]
        },
        "position": {
          "new": 42147876864,
          "old": 32147614720
        },
        "project_id": {
          "new": 28,
          "old": 2
        },
        "deadline": {
          "new": "2021-04-12T16:00:00Z",
          "old": "2021-04-11T16:00:00Z"
        }
      }
    }
  ],
  "references": [
    {
      "id": "6071752f-ece0-4772-854c-05a9666c480f",
      "entity_type": "group",
      "name": "Team 1"
    },
    {
      "id": 500000010,
      "entity_type": "workflow-state",
      "name": "Ready for Review",
      "type": "started"
    },
    {
      "id": 500000006,
      "entity_type": "workflow-state",
      "name": "In Development",
      "type": "started"
    },
    {
      "id": 8,
      "entity_type": "label",
      "name": "low priority",
      "app_url": "https://app.clubhouse.io/pig208/label/8"
    },
    {
      "id": 23,
      "entity_type": "epic",
      "name": "testeipc",
      "app_url": "https://app.clubhouse.io/pig208/epic/23"
    },
    {
      "id": 2,
      "entity_type": "project",
      "name": "Product Development",
      "app_url": "https://app.clubhouse.io/pig208/project/2"
    },
    {
      "id": "6071adb0-641f-46c4-b5e1-4945dae399ea",
      "entity_type": "group",
      "name": "team2"
    },
    {
      "id": 29,
      "entity_type": "epic",
      "name": "epic",
      "app_url": "https://app.clubhouse.io/pig208/epic/29"
    },
    {
      "id": 28,
      "entity_type": "project",
      "name": "test2",
      "app_url": "https://app.clubhouse.io/pig208/project/28"
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: story_update_everything_at_once_skip_removed_labels.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_update_everything_at_once_skip_removed_labels.json

```json
{
  "id": "60723fdc-2c6d-4b31-b160-ef4d438dc5bc",
  "changed_at": "2021-04-11T00:16:28.845Z",
  "version": "v1",
  "member_id": "6071752f-e16e-4f79-b41e-7c78b76aa4bd",
  "actions": [
    {
      "id": 17,
      "entity_type": "story",
      "action": "update",
      "name": "asd4",
      "story_type": "bug",
      "app_url": "https://app.clubhouse.io/pig208/story/17",
      "changes": {
        "story_type": {
          "new": "bug",
          "old": "feature"
        },
        "epic_id": {
          "new": 23,
          "old": 29
        },
        "requested_by_id": {
          "new": "60723f5f-28ca-4ec2-a3a2-37b2dc5606ae",
          "old": "6071752f-e16e-4f79-b41e-7c78b76aa4bd"
        },
        "label_ids": {
          "removes": [
            8
          ]
        },
        "group_id": {
          "new": "6071adb0-641f-46c4-b5e1-4945dae399ea",
          "old": "6071752f-ece0-4772-854c-05a9666c480f"
        },
        "workflow_state_id": {
          "new": 500000010,
          "old": 500000006
        },
        "follower_ids": {
          "adds": [
            "60723f5f-28ca-4ec2-a3a2-37b2dc5606ae"
          ]
        },
        "owner_ids": {
          "adds": [
            "60723f5f-28ca-4ec2-a3a2-37b2dc5606ae"
          ]
        },
        "position": {
          "new": 42147811328,
          "old": 32147483648
        },
        "project_id": {
          "new": 28,
          "old": 2
        },
        "deadline": {
          "new": "2021-04-12T16:00:00Z",
          "old": "2021-04-11T16:00:00Z"
        }
      }
    },
    {
      "id": 26,
      "entity_type": "story",
      "action": "update",
      "name": "new1",
      "story_type": "bug",
      "app_url": "https://app.clubhouse.io/pig208/story/26",
      "changes": {
        "story_type": {
          "new": "bug",
          "old": "feature"
        },
        "epic_id": {
          "new": 23,
          "old": 29
        },
        "requested_by_id": {
          "new": "60723f5f-28ca-4ec2-a3a2-37b2dc5606ae",
          "old": "6071752f-e16e-4f79-b41e-7c78b76aa4bd"
        },
        "label_ids": {
          "removes": [
            8
          ]
        },
        "group_id": {
          "new": "6071adb0-641f-46c4-b5e1-4945dae399ea",
          "old": "6071752f-ece0-4772-854c-05a9666c480f"
        },
        "workflow_state_id": {
          "new": 500000010,
          "old": 500000006
        },
        "follower_ids": {
          "adds": [
            "60723f5f-28ca-4ec2-a3a2-37b2dc5606ae"
          ]
        },
        "owner_ids": {
          "adds": [
            "60723f5f-28ca-4ec2-a3a2-37b2dc5606ae"
          ]
        },
        "position": {
          "new": 42147942400,
          "old": 32147680256
        },
        "project_id": {
          "new": 28,
          "old": 2
        },
        "deadline": {
          "new": "2021-04-12T16:00:00Z",
          "old": "2021-04-11T16:00:00Z"
        }
      }
    },
    {
      "id": 27,
      "entity_type": "story",
      "action": "update",
      "name": "new2",
      "story_type": "bug",
      "app_url": "https://app.clubhouse.io/pig208/story/27",
      "changes": {
        "story_type": {
          "new": "bug",
          "old": "feature"
        },
        "epic_id": {
          "new": 23,
          "old": 29
        },
        "requested_by_id": {
          "new": "60723f5f-28ca-4ec2-a3a2-37b2dc5606ae",
          "old": "6071752f-e16e-4f79-b41e-7c78b76aa4bd"
        },
        "label_ids": {
          "removes": [
            8
          ]
        },
        "group_id": {
          "new": "6071adb0-641f-46c4-b5e1-4945dae399ea",
          "old": "6071752f-ece0-4772-854c-05a9666c480f"
        },
        "workflow_state_id": {
          "new": 500000010,
          "old": 500000006
        },
        "follower_ids": {
          "adds": [
            "60723f5f-28ca-4ec2-a3a2-37b2dc5606ae"
          ]
        },
        "owner_ids": {
          "adds": [
            "60723f5f-28ca-4ec2-a3a2-37b2dc5606ae"
          ]
        },
        "position": {
          "new": 42147876864,
          "old": 32147614720
        },
        "project_id": {
          "new": 28,
          "old": 2
        },
        "deadline": {
          "new": "2021-04-12T16:00:00Z",
          "old": "2021-04-11T16:00:00Z"
        }
      }
    }
  ],
  "references": [
    {
      "id": "6071752f-ece0-4772-854c-05a9666c480f",
      "entity_type": "group",
      "name": "Team 1"
    },
    {
      "id": 500000010,
      "entity_type": "workflow-state",
      "name": "Ready for Review",
      "type": "started"
    },
    {
      "id": 500000006,
      "entity_type": "workflow-state",
      "name": "In Development",
      "type": "started"
    },
    {
      "id": 8,
      "entity_type": "label",
      "name": "low priority",
      "app_url": "https://app.clubhouse.io/pig208/label/8"
    },
    {
      "id": 23,
      "entity_type": "epic",
      "name": "testeipc",
      "app_url": "https://app.clubhouse.io/pig208/epic/23"
    },
    {
      "id": 2,
      "entity_type": "project",
      "name": "Product Development",
      "app_url": "https://app.clubhouse.io/pig208/project/2"
    },
    {
      "id": "6071adb0-641f-46c4-b5e1-4945dae399ea",
      "entity_type": "group",
      "name": "team2"
    },
    {
      "id": 29,
      "entity_type": "epic",
      "name": "epic",
      "app_url": "https://app.clubhouse.io/pig208/epic/29"
    },
    {
      "id": 28,
      "entity_type": "project",
      "name": "test2",
      "app_url": "https://app.clubhouse.io/pig208/project/28"
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: story_update_multiple_at_once.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_update_multiple_at_once.json

```json
{
  "id": "60723fdc-2c6d-4b31-b160-ef4d438dc5bc",
  "changed_at": "2021-04-11T00:16:28.845Z",
  "version": "v1",
  "member_id": "6071752f-e16e-4f79-b41e-7c78b76aa4bd",
  "actions": [
    {
      "id": 17,
      "entity_type": "story",
      "action": "update",
      "name": "asd4",
      "story_type": "bug",
      "app_url": "https://app.clubhouse.io/pig208/story/17",
      "changes": {
        "story_type": {
          "new": "bug",
          "old": "feature"
        }
      }
    },
    {
      "id": 26,
      "entity_type": "story",
      "action": "update",
      "name": "new1",
      "story_type": "bug",
      "app_url": "https://app.clubhouse.io/pig208/story/26",
      "changes": {
        "epic_id": {
          "new": 23,
          "old": 29
        }
      }
    },
    {
      "id": 27,
      "entity_type": "story",
      "action": "update",
      "name": "new2",
      "story_type": "bug",
      "app_url": "https://app.clubhouse.io/pig208/story/27",
      "changes": {
        "label_ids": {
          "adds": [
            8
          ]
        }
      }
    },
    {
      "id": 28,
      "entity_type": "story",
      "action": "update",
      "name": "new3",
      "story_type": "bug",
      "app_url": "https://app.clubhouse.io/pig208/story/28",
      "changes": {
        "workflow_state_id": {
          "new": 500000010,
          "old": 500000006
        }
      }
    },
    {
      "id": 29,
      "entity_type": "story",
      "action": "update",
      "name": "new4",
      "story_type": "bug",
      "app_url": "https://app.clubhouse.io/pig208/story/29",
      "changes": {
        "project_id": {
          "new": 28,
          "old": 2
        }
      }
    }
  ],
  "references": [
    {
      "id": "6071752f-ece0-4772-854c-05a9666c480f",
      "entity_type": "group",
      "name": "Team 1"
    },
    {
      "id": 500000010,
      "entity_type": "workflow-state",
      "name": "Ready for Review",
      "type": "started"
    },
    {
      "id": 500000006,
      "entity_type": "workflow-state",
      "name": "In Development",
      "type": "started"
    },
    {
      "id": 8,
      "entity_type": "label",
      "name": "low priority",
      "app_url": "https://app.clubhouse.io/pig208/label/8"
    },
    {
      "id": 23,
      "entity_type": "epic",
      "name": "testeipc",
      "app_url": "https://app.clubhouse.io/pig208/epic/23"
    },
    {
      "id": 2,
      "entity_type": "project",
      "name": "Product Development",
      "app_url": "https://app.clubhouse.io/pig208/project/2"
    },
    {
      "id": "6071adb0-641f-46c4-b5e1-4945dae399ea",
      "entity_type": "group",
      "name": "team2"
    },
    {
      "id": 29,
      "entity_type": "epic",
      "name": "epic",
      "app_url": "https://app.clubhouse.io/pig208/epic/29"
    },
    {
      "id": 28,
      "entity_type": "project",
      "name": "test2",
      "app_url": "https://app.clubhouse.io/pig208/project/28"
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: story_update_multiple_not_supported.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_update_multiple_not_supported.json

```json
{
  "id": "60723fdc-2c6d-4b31-b160-ef4d438dc5bc",
  "changed_at": "2021-04-11T00:16:28.845Z",
  "version": "v1",
  "member_id": "6071752f-e16e-4f79-b41e-7c78b76aa4bd",
  "actions": [
    {
      "id": 17,
      "entity_type": "story",
      "action": "update",
      "name": "asd4",
      "story_type": "bug",
      "app_url": "https://app.clubhouse.io/pig208/story/17",
      "changes": {
        "deadline": {
          "new": "2021-04-12T16:00:00Z",
          "old": "2021-04-11T16:00:00Z"
        }
      }
    },
    {
      "id": 26,
      "entity_type": "story",
      "action": "update",
      "name": "new1",
      "story_type": "bug",
      "app_url": "https://app.clubhouse.io/pig208/story/26",
      "changes": {
        "owner_ids": {
          "adds": [
            "60723f5f-28ca-4ec2-a3a2-37b2dc5606ae"
          ]
        }
      }
    },
    {
      "id": 27,
      "entity_type": "story",
      "action": "update",
      "name": "new2",
      "story_type": "bug",
      "app_url": "https://app.clubhouse.io/pig208/story/27",
      "changes": {
        "follower_ids": {
          "adds": [
            "60723f5f-28ca-4ec2-a3a2-37b2dc5606ae"
          ]
        }
      }
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: story_update_remove_attachment.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_update_remove_attachment.json

```json
{
    "id":"5b295afb-47df-420b-953d-62ec73ab043d",
    "changed_at":"2018-06-19T19:35:23.772Z",
    "primary_id":11,
    "version":"v1",
    "member_id":"5b1fda16-626f-487f-9ecf-f3a4abf42b8b",
    "actions":[
        {
            "id":11,
            "entity_type":"story",
            "action":"update",
            "name":"Add cool feature!",
            "story_type":"bug",
            "app_url":"https://app.clubhouse.io/zulip/story/11",
            "changes":{
                "file_ids":{
                    "removes":[
                        13
                    ]
                }
            }
        }
    ],
    "references":[
        {
            "id":13,
            "entity_type":"file",
            "name":"zuliprc"
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: story_update_remove_description.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_update_remove_description.json

```json
{
    "id":"5b1ff306-741f-4084-a544-be7c0b078ebc",
    "changed_at":"2018-06-12T16:21:26.472Z",
    "primary_id":11,
    "version":"v1",
    "member_id":"5b1fda16-626f-487f-9ecf-f3a4abf42b8b",
    "actions":[
        {
            "id":11,
            "entity_type":"story",
            "action":"update",
            "name":"Add cool feature!",
            "story_type":"bug",
            "app_url":"https://app.clubhouse.io/zulip/story/11",
            "changes":{
                "description":{
                    "new":"",
                    "old":"We should probably add this cool feature! Just edited this. :)"
                }
            }
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: story_update_remove_epic.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_update_remove_epic.json

```json
{
    "id":"5b1feccb-fb21-4c00-ab51-999728f8c2c1",
    "changed_at":"2018-06-12T15:54:51.986Z",
    "primary_id":11,
    "version":"v1",
    "member_id":"5b1fda16-626f-487f-9ecf-f3a4abf42b8b",
    "actions":[
        {
            "id":11,
            "entity_type":"story",
            "action":"update",
            "name":"Add cool feature!",
            "story_type":"bug",
            "app_url":"https://app.clubhouse.io/zulip/story/11",
            "changes":{
                "epic_id":{
                    "old":7
                }
            }
        }
    ],
    "references":[
        {
            "id":7,
            "entity_type":"epic",
            "name":"Release 1.9"
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: story_update_remove_estimate.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_update_remove_estimate.json

```json
{
    "id":"5b1ff466-e71a-48f6-9cf6-5fb021c65894",
    "changed_at":"2018-06-12T16:27:18.704Z",
    "primary_id":11,
    "version":"v1",
    "member_id":"5b1fda16-626f-487f-9ecf-f3a4abf42b8b",
    "actions":[
        {
            "id":11,
            "entity_type":"story",
            "action":"update",
            "name":"Add cool feature!",
            "story_type":"bug",
            "app_url":"https://app.clubhouse.io/zulip/story/11",
            "changes":{
                "estimate":{
                    "old":4
                }
            }
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: story_update_remove_label.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_update_remove_label.json

```json
{
    "id":"5c37d3f8-4a7e-4cdd-a066-7ced3ace1bd7",
    "changed_at":"2019-01-10T23:23:36.331Z",
    "primary_id":23,
    "version":"v1",
    "member_id":"5b1fda16-626f-487f-9ecf-f3a4abf42b8b",
    "actions":[
        {
            "id":23,
            "entity_type":"story",
            "action":"update",
            "name":"An epic story!",
            "story_type":"feature",
            "app_url":"https://app.clubhouse.io/zulip/story/23",
            "changes":{
                "label_ids":{
                    "removes":[
                        18
                    ]
                }
            }
        }
    ],
    "references":[
        {
            "id":18,
            "entity_type":"label",
            "name":"mockup"
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/codeship/doc.md

```text
# Zulip Codeship integration

Get notifications about Codeship build statuses in Zulip.

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. On your project's webpage, click on **Project Settings** in
   the top right corner.

1. Select the **Notifications** tab, and then select
   **+ New Notification**.

1. Select **Webhook**, and set **Webhook URL** to the URL generated
   above.

1. _(optional)_ You may also supply an optional description or a
   specific branch you would like to be notified about.

1. Select **Save**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/codeship/001.png)

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/codeship/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class CodeshipHookTests(WebhookTestCase):
    CHANNEL_NAME = "codeship"
    URL_TEMPLATE = "/api/v1/external/codeship?stream={stream}&api_key={api_key}"
    TOPIC_NAME = "codeship/docs"
    WEBHOOK_DIR_NAME = "codeship"

    def test_codeship_build_in_testing_status_message(self) -> None:
        """
        Tests if codeship testing status is mapped correctly
        """
        expected_message = "[Build](https://www.codeship.com/projects/10213/builds/973711) triggered by beanieboi on master branch started."
        self.check_webhook("testing_build", self.TOPIC_NAME, expected_message)

    def test_codeship_build_in_error_status_message(self) -> None:
        """
        Tests if codeship error status is mapped correctly
        """
        expected_message = "[Build](https://www.codeship.com/projects/10213/builds/973711) triggered by beanieboi on master branch failed."
        self.check_webhook("error_build", self.TOPIC_NAME, expected_message)

    def test_codeship_build_in_success_status_message(self) -> None:
        """
        Tests if codeship success status is mapped correctly
        """
        expected_message = "[Build](https://www.codeship.com/projects/10213/builds/973711) triggered by beanieboi on master branch succeeded."
        self.check_webhook("success_build", self.TOPIC_NAME, expected_message)

    def test_codeship_build_in_other_status_status_message(self) -> None:
        """
        Tests if codeship other status is mapped correctly
        """
        expected_message = "[Build](https://www.codeship.com/projects/10213/builds/973711) triggered by beanieboi on master branch has some_other_status status."
        self.check_webhook("other_status_build", self.TOPIC_NAME, expected_message)
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/codeship/view.py
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

CODESHIP_TOPIC_TEMPLATE = "{project_name}"
CODESHIP_MESSAGE_TEMPLATE = (
    "[Build]({build_url}) triggered by {committer} on {branch} branch {status}."
)

CODESHIP_DEFAULT_STATUS = "has {status} status"
CODESHIP_STATUS_MAPPER = {
    "testing": "started",
    "error": "failed",
    "success": "succeeded",
}


@webhook_view("Codeship")
@typed_endpoint
def api_codeship_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    payload = payload["build"]
    topic_name = get_topic_for_http_request(payload)
    body = get_body_for_http_request(payload)

    check_send_webhook_message(request, user_profile, topic_name, body)
    return json_success(request)


def get_topic_for_http_request(payload: WildValue) -> str:
    return CODESHIP_TOPIC_TEMPLATE.format(
        project_name=payload["project_name"].tame(check_string),
    )


def get_body_for_http_request(payload: WildValue) -> str:
    return CODESHIP_MESSAGE_TEMPLATE.format(
        build_url=payload["build_url"].tame(check_string),
        committer=payload["committer"].tame(check_string),
        branch=payload["branch"].tame(check_string),
        status=get_status_message(payload),
    )


def get_status_message(payload: WildValue) -> str:
    build_status = payload["status"].tame(check_string)
    return CODESHIP_STATUS_MAPPER.get(
        build_status, CODESHIP_DEFAULT_STATUS.format(status=build_status)
    )
```

--------------------------------------------------------------------------------

---[FILE: error_build.json]---
Location: zulip-main/zerver/webhooks/codeship/fixtures/error_build.json

```json
{
  "build": {
    "build_url":"https://www.codeship.com/projects/10213/builds/973711",
    "commit_url":"https://github.com/codeship/docs/commit/96943dc5269634c211b6fbb18896ecdcbd40a047",
    "project_id":10213,
    "build_id":973711,
    "status":"error",
    "project_full_name":"codeship/docs",
    "project_name":"codeship/docs",
    "commit_id":"96943dc5269634c211b6fbb18896ecdcbd40a047",
    "short_commit_id":"96943",
    "message":"Merge pull request #34 from codeship/feature/shallow-clone",
    "committer":"beanieboi",
    "branch":"master"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: other_status_build.json]---
Location: zulip-main/zerver/webhooks/codeship/fixtures/other_status_build.json

```json
{
  "build": {
    "build_url":"https://www.codeship.com/projects/10213/builds/973711",
    "commit_url":"https://github.com/codeship/docs/commit/96943dc5269634c211b6fbb18896ecdcbd40a047",
    "project_id":10213,
    "build_id":973711,
    "status":"some_other_status",
    "project_full_name":"codeship/docs",
    "project_name":"codeship/docs",
    "commit_id":"96943dc5269634c211b6fbb18896ecdcbd40a047",
    "short_commit_id":"96943",
    "message":"Merge pull request #34 from codeship/feature/shallow-clone",
    "committer":"beanieboi",
    "branch":"master"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: success_build.json]---
Location: zulip-main/zerver/webhooks/codeship/fixtures/success_build.json

```json
{
  "build": {
    "build_url":"https://www.codeship.com/projects/10213/builds/973711",
    "commit_url":"https://github.com/codeship/docs/commit/96943dc5269634c211b6fbb18896ecdcbd40a047",
    "project_id":10213,
    "build_id":973711,
    "status":"success",
    "project_full_name":"codeship/docs",
    "project_name":"codeship/docs",
    "commit_id":"96943dc5269634c211b6fbb18896ecdcbd40a047",
    "short_commit_id":"96943",
    "message":"Merge pull request #34 from codeship/feature/shallow-clone",
    "committer":"beanieboi",
    "branch":"master"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: testing_build.json]---
Location: zulip-main/zerver/webhooks/codeship/fixtures/testing_build.json

```json
{
  "build": {
    "build_url":"https://www.codeship.com/projects/10213/builds/973711",
    "commit_url":"https://github.com/codeship/docs/commit/96943dc5269634c211b6fbb18896ecdcbd40a047",
    "project_id":10213,
    "build_id":973711,
    "status":"testing",
    "project_full_name":"codeship/docs",
    "project_name":"codeship/docs",
    "commit_id":"96943dc5269634c211b6fbb18896ecdcbd40a047",
    "short_commit_id":"96943",
    "message":"Merge pull request #34 from codeship/feature/shallow-clone",
    "committer":"beanieboi",
    "branch":"master"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/crashlytics/doc.md

```text
# Zulip Crashlytics integration

Get notifications about Crashlytics issues in Zulip.

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Select the app you'd like to be notified about in your
   [Crashlytics settings panel](https://fabric.io/settings/apps).

1. On the integrations subpage, select **Web Hook**, and enter the URL
   generated above.

1. Select **Verify**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/crashlytics/001.png)

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/crashlytics/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class CrashlyticsHookTests(WebhookTestCase):
    CHANNEL_NAME = "crashlytics"
    URL_TEMPLATE = "/api/v1/external/crashlytics?stream={stream}&api_key={api_key}"
    WEBHOOK_DIR_NAME = "crashlytics"

    def test_crashlytics_verification_message(self) -> None:
        expected_topic_name = "Setup"
        expected_message = "Webhook has been successfully configured."
        self.check_webhook("verification", expected_topic_name, expected_message)

    def test_crashlytics_build_in_success_status(self) -> None:
        expected_topic_name = "123: Issue Title"
        expected_message = (
            "[Issue](http://crashlytics.com/full/url/to/issue) impacts at least 16 device(s)."
        )
        self.check_webhook("issue_message", expected_topic_name, expected_message)
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/crashlytics/view.py
Signals: Django

```python
# Webhooks for external integrations.
from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_int, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

CRASHLYTICS_TOPIC_TEMPLATE = "{display_id}: {title}"
CRASHLYTICS_MESSAGE_TEMPLATE = "[Issue]({url}) impacts at least {impacted_devices_count} device(s)."

CRASHLYTICS_SETUP_TOPIC_TEMPLATE = "Setup"
CRASHLYTICS_SETUP_MESSAGE_TEMPLATE = "Webhook has been successfully configured."

VERIFICATION_EVENT = "verification"


@webhook_view("Crashlytics")
@typed_endpoint
def api_crashlytics_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    event = payload["event"].tame(check_string)
    if event == VERIFICATION_EVENT:
        topic_name = CRASHLYTICS_SETUP_TOPIC_TEMPLATE
        body = CRASHLYTICS_SETUP_MESSAGE_TEMPLATE
    else:
        issue_body = payload["payload"]
        topic_name = CRASHLYTICS_TOPIC_TEMPLATE.format(
            display_id=issue_body["display_id"].tame(check_int),
            title=issue_body["title"].tame(check_string),
        )
        body = CRASHLYTICS_MESSAGE_TEMPLATE.format(
            impacted_devices_count=issue_body["impacted_devices_count"].tame(check_int),
            url=issue_body["url"].tame(check_string),
        )

    check_send_webhook_message(request, user_profile, topic_name, body)
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: issue_message.json]---
Location: zulip-main/zerver/webhooks/crashlytics/fixtures/issue_message.json

```json
{
  "event": "issue_impact_change",
  "payload_type": "issue",
  "payload": {
    "display_id": 123 ,
    "title": "Issue Title" ,
    "method": "methodName of issue",
    "impact_level": 2,
    "crashes_count": 54,
    "impacted_devices_count": 16,
    "url": "http://crashlytics.com/full/url/to/issue"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: verification.json]---
Location: zulip-main/zerver/webhooks/crashlytics/fixtures/verification.json

```json
{
  "event": "verification",
  "payload_type": "none"
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/dbt/doc.md

```text
# Zulip DBT integration

Get notifications about DBT cloud job runs in Zulip!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

    If you'd like your notification messages to link to your DBT job
    runs, make sure you include the [**DBT Access URL**][DBT Access URLs]
    when generating the integration URL.

1. From your DBT Dashboard, navigate to **Account settings**. Select
   **Notification Settings**, go to the **Webhooks** section, and
   click **Create webhook**.

1. Set **Webhook name** to a name of your choice, such as `Zulip`. Select
    the **Events** and **Jobs** you want to receive notifications for,
    and set **Endpoint** to the URL generated above. Click **Save**.

1. Click **Test Endpoint** to send a test notification to
    your Zulip organization.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/dbt/001.png)

{!event-filtering-additional-feature.md!}

### Related documentation

- [DBT's webhooks documentation](https://docs.getdbt.com/docs/deploy/webhooks)
- [DBT Access URLs][DBT Access URLs]
{!webhooks-url-specification.md!}

[DBT Access URLs]: https://docs.getdbt.com/docs/cloud/about-cloud/access-regions-ip-addresses#api-access-urls
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/dbt/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class DBTHookTests(WebhookTestCase):
    CHANNEL_NAME = "DBT"
    URL_TEMPLATE = "/api/v1/external/dbt?&api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "dbt"

    def test_dbt_webhook_when_job_started(self) -> None:
        expected_message = """:yellow_circle: Daily Job (dbt build) deployment started in **Production**.\n
Job #123 was kicked off from the UI by bwilliams@example.com at <time:2023-01-31T19:28:07Z>."""
        self.check_webhook("job_run_started", "Example Project", expected_message)

    def test_dbt_webhook_when_job_completed_success(self) -> None:
        expected_message = """:green_circle: Daily Job (dbt build) deployment succeeded in **Production**.\n
Job #123 was kicked off from the UI by bwilliams@example.com at <time:2023-01-31T19:28:07Z>."""
        self.check_webhook("job_run_completed_success", "Example Project", expected_message)

    def test_dbt_webhook_when_job_completed_errored(self) -> None:
        expected_message = """:cross_mark: Daily Job (dbt build) deployment completed with errors in **Production**.\n
Job #123 was kicked off from the UI by bwilliams@example.com at <time:2025-10-05T19:15:56Z>."""
        self.check_webhook("job_run_completed_errored", "Example Project", expected_message)

    def test_dbt_webhook_when_job_errored(self) -> None:
        expected_message = """:cross_mark: Daily Job (dbt build) deployment failed in **Production**.\n
Job #123 was kicked off from the UI by bwilliams@example.com at <time:2023-01-31T21:14:41Z>."""
        self.check_webhook("job_run_errored", "Example Project", expected_message)


class DBTHookWithAccessUrlTests(WebhookTestCase):
    CHANNEL_NAME = "DBT"
    URL_TEMPLATE = "/api/v1/external/dbt?&api_key={api_key}&stream={stream}&access_url=https%3A%2F%2Fexample.us1.dbt.com"
    WEBHOOK_DIR_NAME = "dbt"

    def test_dbt_webhook_with_valid_access_url(self) -> None:
        expected_message = """:yellow_circle: Daily Job (dbt build) [deployment](https://example.us1.dbt.com/deploy/1/projects/167194/runs/12345) started in **Production**.\n
[Job #123](https://example.us1.dbt.com/deploy/1/projects/167194/jobs/123) was kicked off from the UI by bwilliams@example.com at <time:2023-01-31T19:28:07Z>."""
        self.check_webhook("job_run_started", "Example Project", expected_message)
```

--------------------------------------------------------------------------------

````
