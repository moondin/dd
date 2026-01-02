---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1139
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1139 of 1290)

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

---[FILE: epic_update_remove_description.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/epic_update_remove_description.json

```json
{
    "id":"5b296099-86f1-493c-a2c7-ad3b6a8f2151",
    "changed_at":"2018-06-19T19:59:21.194Z",
    "primary_id":20,
    "version":"v1",
    "member_id":"5b1fda16-626f-487f-9ecf-f3a4abf42b8b",
    "actions":[
        {
            "id":20,
            "entity_type":"epic",
            "action":"update",
            "name":"New Cool Epic!",
            "changes":{
                "description":{
                    "new":"",
                    "old":"Changed a description!"
                }
            }
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: story_archive.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_archive.json

```json
{
    "id":"5b2961f2-a2d0-449c-a4da-e9db7c69e10c",
    "changed_at":"2018-06-19T20:05:06.722Z",
    "primary_id":9,
    "version":"v1",
    "member_id":"5b1fda16-626f-487f-9ecf-f3a4abf42b8b",
    "actions":[
        {
            "id":9,
            "entity_type":"story",
            "action":"update",
            "name":"Story 2",
            "story_type":"feature",
            "app_url":"https://app.clubhouse.io/zulip/story/9",
            "changes":{
                "archived":{
                    "new":true,
                    "old":false
                }
            }
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: story_comment_updated.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_comment_updated.json

```json
{
    "id":"5c6dcbd0-f055-4efb-83f9-d745a444aec2",
    "changed_at":"2019-02-20T21:51:12.936Z",
    "primary_id":12,
    "version":"v1",
    "member_id":"5b1fda16-626f-487f-9ecf-f3a4abf42b8b",
    "actions":[
        {
            "id":12,
            "entity_type":"story-comment",
            "action":"update",
            "text":"Just leaving a comment here! EDIT: Just editing this",
            "story_id":11,
            "changes":{
                "text":{
                    "new":"Just leaving a comment here! EDIT: Just editing this",
                    "old":"Just leaving a comment here!"
                }
            }
        }
    ],
    "references":[
        {
            "id":11,
            "entity_type":"story",
            "name":"Add super cool feature!",
            "story_type":"bug",
            "app_url":"https://app.clubhouse.io/zulip/story/11"
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: story_create.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_create.json

```json
{
    "id":"5b1fdcea-4b6a-4128-9f78-7e58214191fc",
    "changed_at":"2018-06-12T14:47:06.221Z",
    "primary_id":11,
    "version":"v1",
    "member_id":"5b1fda16-626f-487f-9ecf-f3a4abf42b8b",
    "actions":[
        {
            "id":11,
            "entity_type":"story",
            "action":"create",
            "name":"Add cool feature!",
            "story_type":"feature",
            "app_url":"https://app.clubhouse.io/zulip/story/11",
            "project_id":6,
            "description":"We should probably add this cool feature!",
            "workflow_state_id":500000008,
            "follower_ids":[
                "5b1fda16-626f-487f-9ecf-f3a4abf42b8b"
            ],
            "requested_by_id":"5b1fda16-626f-487f-9ecf-f3a4abf42b8b"
        }
    ],
    "references":[
        {
            "id":6,
            "entity_type":"project",
            "name":"Backend"
        },
        {
            "id":500000008,
            "entity_type":"workflow-state",
            "name":"Unscheduled",
            "type":"unstarted"
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: story_delete.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_delete.json

```json
{
    "id":"5c182454-1f6d-4c08-8d41-dfa5409386a2",
    "changed_at":"2018-12-17T22:33:56.768Z",
    "primary_id":25,
    "version":"v1",
    "member_id":"5b1fda16-626f-487f-9ecf-f3a4abf42b8b",
    "actions":[
        {
            "id":25,
            "entity_type":"story",
            "action":"delete",
            "story_type":"feature",
            "name":"New random story"
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: story_task_complete.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_task_complete.json

```json
{
    "id":"5b1fe806-f582-4b45-ac64-44cc7567a5d7",
    "changed_at":"2018-06-12T15:34:30.005Z",
    "primary_id":15,
    "version":"v1",
    "member_id":"5b1fda16-626f-487f-9ecf-f3a4abf42b8b",
    "actions":[
        {
            "id":15,
            "entity_type":"story-task",
            "action":"update",
            "description":"A new task for this story",
            "story_id":11,
            "changes":{
                "complete":{
                    "new":true,
                    "old":false
                }
            }
        }
    ],
    "references":[
        {
            "id":11,
            "entity_type":"story",
            "name":"Add cool feature!",
            "story_type":"bug",
            "app_url":"https://app.clubhouse.io/zulip/story/11"
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: story_task_create.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_task_create.json

```json
{
    "id":"5b1fe66d-25b8-4838-9880-9a4169d369d7",
    "changed_at":"2018-06-12T15:27:41.816Z",
    "primary_id":14,
    "version":"v1",
    "member_id":"5b1fda16-626f-487f-9ecf-f3a4abf42b8b",
    "actions":[
        {
            "id":14,
            "entity_type":"story-task",
            "action":"create",
            "description":"Added a new task",
            "complete":false
        },
        {
            "id":11,
            "entity_type":"story",
            "action":"update",
            "name":"Add cool feature!",
            "story_type":"bug",
            "app_url":"https://app.clubhouse.io/zulip/story/11",
            "changes":{
                "task_ids":{
                    "adds":[
                        14
                    ]
                }
            }
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: story_task_delete.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_task_delete.json

```json
{
    "id":"5b1fe779-e8d0-4a4d-a8d3-3d179da7b55e",
    "changed_at":"2018-06-12T15:32:09.246Z",
    "primary_id":14,
    "version":"v1",
    "member_id":"5b1fda16-626f-487f-9ecf-f3a4abf42b8b",
    "actions":[
        {
            "id":14,
            "entity_type":"story-task",
            "action":"delete",
            "description":"Added a new task"
        },
        {
            "id":11,
            "entity_type":"story",
            "action":"update",
            "name":"Add cool feature!",
            "story_type":"bug",
            "app_url":"https://app.clubhouse.io/zulip/story/11",
            "changes":{
                "task_ids":{
                    "removes":[
                        14
                    ]
                }
            }
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: story_task_not_complete.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_task_not_complete.json

```json
{
    "id":"5b1fe806-f582-4b45-ac64-44cc7567a5d7",
    "changed_at":"2018-06-12T15:34:30.005Z",
    "primary_id":15,
    "version":"v1",
    "member_id":"5b1fda16-626f-487f-9ecf-f3a4abf42b8b",
    "actions":[
        {
            "id":15,
            "entity_type":"story-task",
            "action":"update",
            "description":"A new task for this story",
            "story_id":11,
            "changes":{
                "complete":{
                    "new":false,
                    "old":true
                }
            }
        }
    ],
    "references":[
        {
            "id":11,
            "entity_type":"story",
            "name":"Add cool feature!",
            "story_type":"bug",
            "app_url":"https://app.clubhouse.io/zulip/story/11"
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: story_unarchive.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_unarchive.json

```json
{
    "id":"5b2961f2-a2d0-449c-a4da-e9db7c69e10c",
    "changed_at":"2018-06-19T20:05:06.722Z",
    "primary_id":9,
    "version":"v1",
    "member_id":"5b1fda16-626f-487f-9ecf-f3a4abf42b8b",
    "actions":[
        {
            "id":9,
            "entity_type":"story",
            "action":"update",
            "name":"Story 2",
            "story_type":"feature",
            "app_url":"https://app.clubhouse.io/zulip/story/9",
            "changes":{
                "archived":{
                    "new":false,
                    "old":true
                }
            }
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: story_update_add_attachment.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_update_add_attachment.json

```json
{
    "id":"5b1fdf0a-80c2-4c95-907b-899efa86374f",
    "changed_at":"2018-06-12T14:56:10.984Z",
    "primary_id":11,
    "version":"v1",
    "member_id":"5b1fda16-626f-487f-9ecf-f3a4abf42b8b",
    "actions":[
        {
            "id":11,
            "entity_type":"story",
            "action":"update",
            "name":"Add cool feature!",
            "story_type":"feature",
            "app_url":"https://app.clubhouse.io/zulip/story/11",
            "changes":{
                "file_ids":{
                    "adds":[
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

---[FILE: story_update_add_comment.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_update_add_comment.json

```json
{
    "id":"5b1fdde6-c65d-4a20-a748-ec6d55bca140",
    "changed_at":"2018-06-12T14:51:18.822Z",
    "primary_id":12,
    "version":"v1",
    "member_id":"5b1fda16-626f-487f-9ecf-f3a4abf42b8b",
    "actions":[
        {
            "id":12,
            "entity_type":"story-comment",
            "action":"create",
            "text":"Just leaving a comment here!",
            "author_id":"5b1fda16-626f-487f-9ecf-f3a4abf42b8b"
        },
        {
            "id":11,
            "entity_type":"story",
            "action":"update",
            "name":"Add cool feature!",
            "story_type":"feature",
            "app_url":"https://app.clubhouse.io/zulip/story/11",
            "changes":{
                "comment_ids":{
                    "adds":[
                        12
                    ]
                }
            }
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: story_update_add_description.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_update_add_description.json

```json
{
    "id":"5b1feaa3-b3ad-40ec-b6a7-732febad698f",
    "changed_at":"2018-06-12T15:45:39.951Z",
    "primary_id":9,
    "version":"v1",
    "member_id":"5b1fda16-626f-487f-9ecf-f3a4abf42b8b",
    "actions":[
        {
            "id":9,
            "entity_type":"story",
            "action":"update",
            "name":"Story 2",
            "story_type":"feature",
            "app_url":"https://app.clubhouse.io/zulip/story/9",
            "changes":{
                "description":{
                    "new":"Added a description.",
                    "old":""
                }
            }
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: story_update_add_epic.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_update_add_epic.json

```json
{
    "id":"5b1fe052-2ebf-4efd-92f7-64ecdb555af7",
    "changed_at":"2018-06-12T15:01:38.093Z",
    "primary_id":11,
    "version":"v1",
    "member_id":"5b1fda16-626f-487f-9ecf-f3a4abf42b8b",
    "actions":[
        {
            "id":11,
            "entity_type":"story",
            "action":"update",
            "name":"Add cool feature!",
            "story_type":"feature",
            "app_url":"https://app.clubhouse.io/zulip/story/11",
            "changes":{
                "epic_id":{
                    "new":7
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

---[FILE: story_update_add_estimate.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_update_add_estimate.json

```json
{
    "id":"5b1ff439-0a94-454d-9aa5-a1192f6a8603",
    "changed_at":"2018-06-12T16:26:33.129Z",
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
                    "new":4
                }
            }
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: story_update_add_github_branch.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_update_add_github_branch.json

```json
{
    "id":"5c491cd1-53dd-4ccb-83a1-c5275eb3c234",
    "changed_at":"2019-01-24T02:02:58.000Z",
    "primary_id":500000029,
    "version":"v1",
    "actions":[
        {
            "id":500000029,
            "entity_type":"branch",
            "action":"create",
            "name":"eeshangarg/ch27/testing-pull-requests-with-story",
            "url":"https://github.com/eeshangarg/scheduler/tree/eeshangarg/ch27/testing-pull-requests-with-story"
        },
        {
            "id":27,
            "entity_type":"story",
            "action":"update",
            "name":"Testing pull requests with Story",
            "story_type":"feature",
            "app_url":"https://app.clubhouse.io/zulip/story/27",
            "changes":{
                "branch_ids":{
                    "adds":[
                        500000029
                    ]
                },
                "started":{
                    "new":true,
                    "old":false
                },
                "workflow_state_id":{
                    "new":500000006,
                    "old":500000008
                },
                "started_at":{
                    "new":"2019-01-24T02:02:57Z"
                }
            }
        }
    ],
    "references":[
        {
            "id":500000006,
            "entity_type":"workflow-state",
            "name":"In Development",
            "type":"started"
        },
        {
            "id":500000008,
            "entity_type":"workflow-state",
            "name":"Unscheduled",
            "type":"unstarted"
        }
    ],
    "webhook_id":"5c491814-1d65-44c4-92af-aece6fc41092",
    "external_id":"2b82a9e0-1f7c-11e9-89d2-03b6c67fe7a7"
}
```

--------------------------------------------------------------------------------

---[FILE: story_update_add_github_multiple_pull_requests.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_update_add_github_multiple_pull_requests.json

```json
{
    "id": "60718721-b87c-4405-96aa-38db82c693de",
    "changed_at": "2021-04-10T11:08:17.962Z",
    "version": "v1",
    "primary_id": 500000032,
    "actions": [
        {
            "id": 500000032,
            "entity_type": "pull-request",
            "action": "create",
            "number": 2,
            "title": "Testing pull requests with Story",
            "url": "https://github.com/PIG208/test-clubhouse/pull/2"
        },
        {
            "id": 500000031,
            "entity_type": "branch",
            "action": "create",
            "name": "two",
            "url": "https://github.com/PIG208/test-clubhouse/tree/two"
        },
        {
            "id": 17,
            "entity_type": "story",
            "action": "update",
            "name": "Story1",
            "story_type": "feature",
            "app_url": "https://app.clubhouse.io/pig208/story/17",
            "changes": {
                "pull_request_ids": {
                    "adds": [
                        500000032
                    ]
                },
                "started": {
                    "new": true,
                    "old": false
                },
                "position": {
                    "new": 32147680256,
                    "old": 12147614720
                },
                "workflow_state_id": {
                    "new": 500000006,
                    "old": 500000008
                },
                "started_at": {
                    "new": "2021-04-10T11:08:17Z"
                }
            }
        },
        {
            "id": 18,
            "entity_type": "story",
            "action": "update",
            "name": "Story2",
            "story_type": "feature",
            "app_url": "https://app.clubhouse.io/pig208/story/18",
            "changes": {
                "pull_request_ids": {
                    "adds": [
                        500000032
                    ]
                },
                "started": {
                    "new": true,
                    "old": false
                },
                "position": {
                    "new": 32147745792,
                    "old": 12147680256
                },
                "workflow_state_id": {
                    "new": 500000006,
                    "old": 500000008
                },
                    "started_at": {
                    "new": "2021-04-10T11:08:17Z"
                }
            }
        }
    ],
    "references": [
        {
            "id": 500000006,
            "entity_type": "workflow-state",
            "name": "In Development",
            "type": "started"
        },
        {
            "id": 500000008,
            "entity_type": "workflow-state",
            "name": "Unscheduled",
            "type": "unstarted"
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: story_update_add_github_multiple_pull_requests_with_comment.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_update_add_github_multiple_pull_requests_with_comment.json

```json
{
    "id": "60721a44-7d30-476b-ae19-514a47359c42",
    "changed_at": "2021-04-10T21:36:04.138Z",
    "version": "v1",
    "primary_id": 500000029,
    "actions": [
      {
        "id": 500000029,
        "entity_type": "pull-request",
        "action": "comment",
        "number": 1,
        "title": "readme: Update README.md.",
        "url": "https://github.com/PIG208/test-clubhouse/pull/1"
      },
      {
        "id": 26,
        "entity_type": "story",
        "action": "update",
        "name": "new1",
        "story_type": "feature",
        "app_url": "https://app.clubhouse.io/pig208/story/26",
        "changes": {
          "pull_request_ids": {
            "adds": [
              500000029
            ]
          },
          "started": {
            "new": true,
            "old": false
          },
          "position": {
            "new": 32147549184,
            "old": 12147549184
          },
          "workflow_state_id": {
            "new": 500000006,
            "old": 500000008
          },
          "started_at": {
            "new": "2021-04-10T21:36:03Z"
          }
        }
      },
      {
        "id": 27,
        "entity_type": "story",
        "action": "update",
        "name": "new2",
        "story_type": "feature",
        "app_url": "https://app.clubhouse.io/pig208/story/27",
        "changes": {
          "pull_request_ids": {
            "adds": [
              500000029
            ]
          },
          "started": {
            "new": true,
            "old": false
          },
          "position": {
            "new": 32147614720,
            "old": 12147614720
          },
          "workflow_state_id": {
            "new": 500000006,
            "old": 500000008
          },
          "started_at": {
            "new": "2021-04-10T21:36:03Z"
          }
        }
      }
    ],
    "references": [
      {
        "id": 500000006,
        "entity_type": "workflow-state",
        "name": "In Development",
        "type": "started"
      },
      {
        "id": 500000008,
        "entity_type": "workflow-state",
        "name": "Unscheduled",
        "type": "unstarted"
      }
    ]
  }
```

--------------------------------------------------------------------------------

---[FILE: story_update_add_github_pull_request.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_update_add_github_pull_request.json

```json
{
    "changed_at":"2019-01-24T02:18:20.031Z",
    "primary_id":500000035,
    "references":[
        {
            "id":500000010,
            "entity_type":"workflow-state",
            "name":"Ready for Review",
            "type":"started"
        },
        {
            "id":500000008,
            "entity_type":"workflow-state",
            "name":"Unscheduled",
            "type":"unstarted"
        }
    ],
    "actions":[
        {
            "id":500000035,
            "entity_type":"pull-request",
            "action":"create",
            "number":10,
            "title":"Testing pull requests with Story",
            "url":"https://github.com/eeshangarg/Scheduler/pull/10"
        },
        {
            "id":28,
            "entity_type":"story",
            "action":"update",
            "name":"Testing pull requests with Story",
            "story_type":"feature",
            "app_url":"https://app.clubhouse.io/zulip/story/28",
            "changes":{
                "started":{
                    "new":true,
                    "old":false
                },
                "pull_request_ids": {
                    "adds": [
                        500000032
                    ]
                },
                "workflow_state_id":{
                    "new":500000010,
                    "old":500000008
                },
                "started_at":{
                    "new":"2019-01-24T02:18:20Z"
                }
            }
        }
    ],
    "member_id":"5b1fda16-626f-487f-9ecf-f3a4abf42b8b",
    "external_id":"50e81c40-1f7e-11e9-8645-17f96d5e1138",
    "id":"5c49206c-506f-4312-a1b1-b1b8bfccbc9b",
    "version":"v1",
    "webhook_id":"5c491814-1d65-44c4-92af-aece6fc41092"
}
```

--------------------------------------------------------------------------------

---[FILE: story_update_add_github_pull_request_without_workflow_state.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_update_add_github_pull_request_without_workflow_state.json

```json
{
    "changed_at":"2019-01-24T02:18:20.031Z",
    "primary_id":500000035,
    "references":[
        {
            "id":500000010,
            "entity_type":"workflow-state",
            "name":"Ready for Review",
            "type":"started"
        },
        {
            "id":500000008,
            "entity_type":"workflow-state",
            "name":"Unscheduled",
            "type":"unstarted"
        }
    ],
    "actions":[
        {
            "id":500000035,
            "entity_type":"pull-request",
            "action":"create",
            "number":10,
            "title":"Testing pull requests with Story",
            "url":"https://github.com/eeshangarg/Scheduler/pull/10"
        },
        {
            "id":28,
            "entity_type":"story",
            "action":"update",
            "name":"Testing pull requests with Story",
            "story_type":"feature",
            "app_url":"https://app.clubhouse.io/zulip/story/28",
            "changes":{
                "started":{
                    "new":true,
                    "old":false
                },
                "pull_request_ids": {
                    "adds": [
                        500000035
                    ]
                },
                "started_at":{
                    "new":"2019-01-24T02:18:20Z"
                }
            }
        }
    ],
    "member_id":"5b1fda16-626f-487f-9ecf-f3a4abf42b8b",
    "external_id":"50e81c40-1f7e-11e9-8645-17f96d5e1138",
    "id":"5c49206c-506f-4312-a1b1-b1b8bfccbc9b",
    "version":"v1",
    "webhook_id":"5c491814-1d65-44c4-92af-aece6fc41092"
}
```

--------------------------------------------------------------------------------

---[FILE: story_update_add_github_pull_request_with_comment.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_update_add_github_pull_request_with_comment.json

```json
{
    "id": "6071f11a-1681-41f8-afa8-fd24ae747a5d",
    "changed_at": "2021-04-10T18:40:26.876Z",
    "version": "v1",
    "primary_id": 500000032,
    "actions": [
        {
        "id": 500000032,
        "entity_type": "pull-request",
        "action": "comment",
        "number": 2,
        "title": "Two",
        "url": "https://github.com/PIG208/test-clubhouse/pull/2"
        },
        {
        "id": 15,
        "entity_type": "story",
        "action": "update",
        "name": "asd2",
        "story_type": "bug",
        "app_url": "https://app.clubhouse.io/pig208/story/15",
        "changes":
            {
            "pull_request_ids": {
            "adds": [
                500000032
            ]
            }
            }
        }
    ]
  }
```

--------------------------------------------------------------------------------

---[FILE: story_update_add_label.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_update_add_label.json

```json
{
    "id":"5c37d3a3-6e3d-4b17-963c-adfa0a023d84",
    "changed_at":"2019-01-10T23:22:11.694Z",
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
                    "adds":[
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

---[FILE: story_update_add_label_name_in_action.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_update_add_label_name_in_action.json

```json
{
    "member_id":"5bc77d81-sdkf-23fk-sdkf-bfea45f0b806",
    "version":"v1",
    "primary_id":11200,
    "id":"5c488ff2-d76e-4b34-8cdb-4f6098ae79ec",
    "actions":[
        {
            "action":"update",
            "story_type":"chore",
            "entity_type":"story",
            "changes":{
                "label_ids":{
                    "adds":[
                        12135
                    ]
                }
            },
            "id":11200,
            "app_url":"https:\/\/app.clubhouse.io\/zulip\/story\/28",
            "name":"An emotional story!"
        },
        {
            "action":"create",
            "id":12135,
            "entity_type":"label",
            "name":"sad"
        }
    ],
    "changed_at":"2019-01-23T16:01:54.470Z"
}
```

--------------------------------------------------------------------------------

---[FILE: story_update_add_multiple_labels.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_update_add_multiple_labels.json

```json
{
    "id":"5c37d3a3-6e3d-4b17-963c-adfa0a023d84",
    "changed_at":"2019-01-10T23:22:11.694Z",
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
                    "adds":[
                        18,
                        19
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
        },
        {
            "id":19,
            "entity_type":"label",
            "name":"label"
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: story_update_add_owner.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_update_add_owner.json

```json
{
    "id":"5c2fd1dc-7156-4427-8d55-cd6dfbc3ddc9",
    "changed_at":"2019-01-04T21:36:29.000Z",
    "primary_id":26,
    "version":"v1",
    "member_id":"5b1fda16-626f-487f-9ecf-f3a4abf42b8b",
    "actions":[
        {
            "id":26,
            "entity_type":"story",
            "action":"update",
            "name":"A new story by Shakespeare!",
            "story_type":"feature",
            "app_url":"https://app.clubhouse.io/zulip/story/26",
            "changes":{
                "owner_ids":{
                    "adds":[
                        "5b1fda16-626f-487f-9ecf-f3a4abf42b8b"
                    ]
                }
            }
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: story_update_change_epic.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_update_change_epic.json

```json
{
    "id":"5b1fefb0-45f1-4e20-bacb-b8038867fa54",
    "changed_at":"2018-06-12T16:07:12.821Z",
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
                    "new":17,
                    "old":7
                }
            }
        }
    ],
    "references":[
        {
            "id":17,
            "entity_type":"epic",
            "name":"Clubhouse Fork"
        },
        {
            "id":7,
            "entity_type":"epic",
            "name":"Release 1.9"
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: story_update_change_estimate.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_update_change_estimate.json

```json
{
    "id":"5b1ff494-3127-424b-bf77-bbdd17a5a59d",
    "changed_at":"2018-06-12T16:28:04.923Z",
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
                    "new":4,
                    "old":1
                }
            }
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: story_update_change_project.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_update_change_project.json

```json
{
    "id":"5b1fed7e-3dc6-47e5-b6af-8820bf6e5554",
    "changed_at":"2018-06-12T15:57:50.741Z",
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
                "project_id":{
                    "new":16,
                    "old":6
                }
            }
        }
    ],
    "references":[
        {
            "id":16,
            "entity_type":"project",
            "name":"Devops"
        },
        {
            "id":6,
            "entity_type":"project",
            "name":"Backend"
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: story_update_change_state.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_update_change_state.json

```json
{
    "id":"5b1fe334-1258-408e-85eb-8ecb6acdcc82",
    "changed_at":"2018-06-12T15:13:56.523Z",
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
                "started":{
                    "new":true,
                    "old":false
                },
                "workflow_state_id":{
                    "new":500000010,
                    "old":500000008
                },
                "started_at":{
                    "new":"2018-06-12T15:13:56Z"
                },
                "owner_ids":{
                    "adds":[
                        "5b1fda16-626f-487f-9ecf-f3a4abf42b8b"
                    ]
                }
            }
        }
    ],
    "references":[
        {
            "id":500000010,
            "entity_type":"workflow-state",
            "name":"Ready for Review",
            "type":"started"
        },
        {
            "id":500000008,
            "entity_type":"workflow-state",
            "name":"Unscheduled",
            "type":"unstarted"
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: story_update_change_title.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_update_change_title.json

```json
{
    "id":"5b295e00-4bff-401e-ac41-23408c878ec9",
    "changed_at":"2018-06-19T19:48:16.817Z",
    "primary_id":11,
    "version":"v1",
    "member_id":"5b1fda16-626f-487f-9ecf-f3a4abf42b8b",
    "actions":[
        {
            "id":11,
            "entity_type":"story",
            "action":"update",
            "name":"Add super cool feature!",
            "story_type":"bug",
            "app_url":"https://app.clubhouse.io/zulip/story/11",
            "changes":{
                "name":{
                    "new":"Add super cool feature!",
                    "old":"Add cool feature!"
                }
            }
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: story_update_change_type.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_update_change_type.json

```json
{
    "id":"5b1fe22b-b0b4-4bd4-b73f-c89eedfbfbbe",
    "changed_at":"2018-06-12T15:09:31.659Z",
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
                "story_type":{
                    "new":"bug",
                    "old":"feature"
                }
            }
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: story_update_description.json]---
Location: zulip-main/zerver/webhooks/clubhouse/fixtures/story_update_description.json

```json
{
    "id":"5b1fe4a4-0402-4f06-af4c-0d676e8f0e23",
    "changed_at":"2018-06-12T15:20:04.324Z",
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
                    "new":"We should probably add this cool feature! Just edited this. :)",
                    "old":"We should probably add this cool feature!"
                }
            }
        }
    ]
}
```

--------------------------------------------------------------------------------

````
