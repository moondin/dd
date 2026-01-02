---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1201
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1201 of 1290)

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

---[FILE: issue_hook__issue_reopened.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/issue_hook__issue_reopened.json

```json
{
   "object_kind":"issue",
   "user":{
      "name":"Tomasz Kolek",
      "username":"tomaszkolek0",
      "avatar_url":"https://secure.gravatar.com/avatar/116a6fdbcfd00466297a39174da11fbb?s=80\u0026d=identicon"
   },
   "project":{
      "name":"my-awesome-project",
      "description":"",
      "web_url":"https://gitlab.com/tomaszkolek0/my-awesome-project",
      "avatar_url":null,
      "git_ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "git_http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git",
      "namespace":"tomaszkolek0",
      "visibility_level":0,
      "path_with_namespace":"tomaszkolek0/my-awesome-project",
      "default_branch":"master",
      "homepage":"https://gitlab.com/tomaszkolek0/my-awesome-project",
      "url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git"
   },
   "object_attributes":{
      "id":2788274,
      "title":"Issue title_new",
      "assignee_id":670043,
      "author_id":670043,
      "project_id":1534233,
      "created_at":"2016-08-18 17:47:36 UTC",
      "updated_at":"2016-08-18 18:15:07 UTC",
      "position":0,
      "branch_name":null,
      "description":"Issue description",
      "milestone_id":null,
      "state":"reopened",
      "iid":1,
      "updated_by_id":670043,
      "weight":3,
      "confidential":false,
      "moved_to_id":null,
      "deleted_at":null,
      "due_date":"2016-08-01",
      "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/issues/1",
      "action":"reopen"
   },
   "repository":{
      "name":"my-awesome-project",
      "url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "description":"",
      "homepage":"https://gitlab.com/tomaszkolek0/my-awesome-project"
   },
   "assignee":{
      "name":"Tomasz Kolek",
      "username":"tomaszkolek0",
      "avatar_url":"https://secure.gravatar.com/avatar/116a6fdbcfd00466297a39174da11fbb?s=80\u0026d=identicon"
   }
}
```

--------------------------------------------------------------------------------

---[FILE: issue_hook__issue_updated.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/issue_hook__issue_updated.json

```json
{
   "object_kind":"issue",
   "user":{
      "name":"Tomasz Kolek",
      "username":"tomaszkolek0",
      "avatar_url":"https://secure.gravatar.com/avatar/116a6fdbcfd00466297a39174da11fbb?s=80\u0026d=identicon"
   },
   "project":{
      "name":"my-awesome-project",
      "description":"",
      "web_url":"https://gitlab.com/tomaszkolek0/my-awesome-project",
      "avatar_url":null,
      "git_ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "git_http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git",
      "namespace":"tomaszkolek0",
      "visibility_level":0,
      "path_with_namespace":"tomaszkolek0/my-awesome-project",
      "default_branch":"master",
      "homepage":"https://gitlab.com/tomaszkolek0/my-awesome-project",
      "url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git"
   },
   "object_attributes":{
      "id":2788274,
      "title":"Issue title_new",
      "assignee_id":670043,
      "author_id":670043,
      "project_id":1534233,
      "created_at":"2016-08-18 17:47:36 UTC",
      "updated_at":"2016-08-18 17:56:30 UTC",
      "position":0,
      "branch_name":null,
      "description":"Issue description",
      "milestone_id":null,
      "state":"opened",
      "iid":1,
      "updated_by_id":670043,
      "weight":3,
      "confidential":false,
      "moved_to_id":null,
      "deleted_at":null,
      "due_date":"2016-08-01",
      "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/issues/1",
      "action":"update"
   },
   "repository":{
      "name":"my-awesome-project",
      "url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "description":"",
      "homepage":"https://gitlab.com/tomaszkolek0/my-awesome-project"
   },
   "assignee":{
      "name":"Tomasz Kolek",
      "username":"tomaszkolek0",
      "avatar_url":"https://secure.gravatar.com/avatar/116a6fdbcfd00466297a39174da11fbb?s=80\u0026d=identicon"
   }
}
```

--------------------------------------------------------------------------------

---[FILE: job_hook__build_created.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/job_hook__build_created.json

```json
{
  "object_kind": "build",
  "ref": "gitlab-script-trigger",
  "tag": false,
  "before_sha": "2293ada6b400935a1378653304eaf6221e0fdb8f",
  "sha": "2293ada6b400935a1378653304eaf6221e0fdb8f",
  "build_id": 1977,
  "build_name": "test",
  "build_stage": "test",
  "build_status": "created",
  "build_started_at": null,
  "build_finished_at": null,
  "build_duration": null,
  "build_allow_failure": false,
  "build_failure_reason": "script_failure",
  "pipeline_id": 2366,
  "project_id": 380,
  "project_name": "gitlab-org/gitlab-test",
  "user": {
    "id": 3,
    "name": "User",
    "email": "user@gitlab.com",
    "avatar_url": "http://www.gravatar.com/avatar/e32bd13e2add097461cb96824b7a829c?s=80\u0026d=identicon"
  },
  "commit": {
    "id": 2366,
    "sha": "2293ada6b400935a1378653304eaf6221e0fdb8f",
    "message": "test\n",
    "author_name": "User",
    "author_email": "user@gitlab.com",
    "status": "created",
    "duration": null,
    "started_at": null,
    "finished_at": null
  },
  "repository": {
    "name": "gitlab_test",
    "description": "Atque in sunt eos similique dolores voluptatem.",
    "homepage": "http://192.168.64.1:3005/gitlab-org/gitlab-test",
    "git_ssh_url": "git@192.168.64.1:gitlab-org/gitlab-test.git",
    "git_http_url": "http://192.168.64.1:3005/gitlab-org/gitlab-test.git",
    "visibility_level": 20
  },
  "runner": {
    "active": true,
    "is_shared": false,
    "id": 380987,
    "description": "shared-runners-manager-6.gitlab.com"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: merge_request_hook__merge_request_added_commit.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/merge_request_hook__merge_request_added_commit.json

```json
{
   "object_kind":"merge_request",
   "user":{
      "name":"Tomasz Kolek",
      "username":"tomaszkolek0",
      "avatar_url":"https://secure.gravatar.com/avatar/116a6fdbcfd00466297a39174da11fbb?s=80\u0026d=identicon"
   },
   "project":{
      "name":"my-awesome-project",
      "description":"",
      "web_url":"https://gitlab.com/tomaszkolek0/my-awesome-project",
      "avatar_url":null,
      "git_ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "git_http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git",
      "namespace":"tomaszkolek0",
      "visibility_level":0,
      "path_with_namespace":"tomaszkolek0/my-awesome-project",
      "default_branch":"master",
      "homepage":"https://gitlab.com/tomaszkolek0/my-awesome-project",
      "url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git"
   },
   "object_attributes":{
      "id":756509,
      "target_branch":"master",
      "source_branch":"tomek",
      "source_project_id":1534233,
      "author_id":670043,
      "assignee_id":670043,
      "title":"New Merge Request",
      "created_at":"2016-08-22 20:27:22 UTC",
      "updated_at":"2016-08-22 20:33:20 UTC",
      "milestone_id":null,
      "state":"opened",
      "merge_status":"can_be_merged",
      "target_project_id":1534233,
      "iid":3,
      "description":"updated desc",
      "position":0,
      "locked_at":null,
      "updated_by_id":670043,
      "merge_error":null,
      "merge_params":{
         "force_remove_source_branch":null
      },
      "merge_when_build_succeeds":false,
      "merge_user_id":null,
      "merge_commit_sha":null,
      "deleted_at":null,
      "approvals_before_merge":null,
      "rebase_commit_sha":null,
      "in_progress_merge_commit_sha":null,
      "source":{
         "name":"my-awesome-project",
         "description":"",
         "web_url":"https://gitlab.com/tomaszkolek0/my-awesome-project",
         "avatar_url":null,
         "git_ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
         "git_http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git",
         "namespace":"tomaszkolek0",
         "visibility_level":0,
         "path_with_namespace":"tomaszkolek0/my-awesome-project",
         "default_branch":"master",
         "homepage":"https://gitlab.com/tomaszkolek0/my-awesome-project",
         "url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
         "ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
         "http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git"
      },
      "target":{
         "name":"my-awesome-project",
         "description":"",
         "web_url":"https://gitlab.com/tomaszkolek0/my-awesome-project",
         "avatar_url":null,
         "git_ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
         "git_http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git",
         "namespace":"tomaszkolek0",
         "visibility_level":0,
         "path_with_namespace":"tomaszkolek0/my-awesome-project",
         "default_branch":"master",
         "homepage":"https://gitlab.com/tomaszkolek0/my-awesome-project",
         "url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
         "ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
         "http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git"
      },
      "last_commit":{
         "id":"600060393d326486c12f222ba78d569dab6b4114",
         "message":"new commit\n",
         "timestamp":"2016-08-22T21:31:34+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/600060393d326486c12f222ba78d569dab6b4114",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         }
      },
      "work_in_progress":false,
      "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/merge_requests/3",
      "action":"update",
      "oldrev":"600060393d326486c12f222ba78d569dab6b4114"
   },
   "repository":{
      "name":"my-awesome-project",
      "url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "description":"",
      "homepage":"https://gitlab.com/tomaszkolek0/my-awesome-project"
   },
   "assignee":{
      "name":"Tomasz Kolek",
      "username":"tomaszkolek0",
      "avatar_url":"https://secure.gravatar.com/avatar/116a6fdbcfd00466297a39174da11fbb?s=80\u0026d=identicon"
   }
}
```

--------------------------------------------------------------------------------

---[FILE: merge_request_hook__merge_request_approval.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/merge_request_hook__merge_request_approval.json

```json
{
  "object_kind": "merge_request",
  "event_type": "merge_request",
  "user": {
    "id": 587951,
    "name": "Sumit Bhanushali",
    "username": "sumitbhanu",
    "avatar_url": "https://secure.gravatar.com/avatar/432182d26b23e4b0b2f89bf21263bf321215f562258f2f31dfcd6372789a10a2?s=80&d=identicon",
    "email": "[REDACTED]"
  },
  "project": {
    "id": 68500871,
    "name": "my-awesome-project",
    "description": null,
    "web_url": "https://gitlab.com/sumitb16/my-awesome-project",
    "avatar_url": null,
    "git_ssh_url": "git@gitlab.com:sumitb16/my-awesome-project.git",
    "git_http_url": "https://gitlab.com/sumitb16/my-awesome-project.git",
    "namespace": "sumitb16",
    "visibility_level": 0,
    "path_with_namespace": "sumitb16/my-awesome-project",
    "default_branch": "main",
    "ci_config_path": "",
    "homepage": "https://gitlab.com/sumitb16/my-awesome-project",
    "url": "git@gitlab.com:sumitb16/my-awesome-project.git",
    "ssh_url": "git@gitlab.com:sumitb16/my-awesome-project.git",
    "http_url": "https://gitlab.com/sumitb16/my-awesome-project.git"
  },
  "object_attributes": {
    "assignee_id": null,
    "author_id": 26939388,
    "created_at": "2025-03-30 07:38:58 UTC",
    "description": "",
    "draft": false,
    "head_pipeline_id": null,
    "id": 373098278,
    "iid": 1,
    "last_edited_at": null,
    "last_edited_by_id": null,
    "merge_commit_sha": null,
    "merge_error": null,
    "merge_params": {
      "force_remove_source_branch": "1"
    },
    "merge_status": "can_be_merged",
    "merge_user_id": null,
    "merge_when_pipeline_succeeds": false,
    "milestone_id": null,
    "source_branch": "t3",
    "source_project_id": 68500871,
    "state_id": 1,
    "target_branch": "main",
    "target_project_id": 68500871,
    "time_estimate": 0,
    "title": "Update the README",
    "updated_at": "2025-03-30 08:13:27 UTC",
    "updated_by_id": 26939388,
    "prepared_at": "2025-03-30 07:38:59 UTC",
    "assignee_ids": [],
    "blocking_discussions_resolved": true,
    "detailed_merge_status": "not_approved",
    "first_contribution": false,
    "human_time_change": null,
    "human_time_estimate": null,
    "human_total_time_spent": null,
    "labels": [],
    "last_commit": {
      "id": "f61e5631699e3b869180fea166fd0968ec2c3992",
      "message": "Update file README.md",
      "title": "Update file README.md",
      "timestamp": "2025-03-30T07:38:04+00:00",
      "url": "https://gitlab.com/sumitb16/my-awesome-project/-/commit/f61e5631699e3b869180fea166fd0968ec2c3992",
      "author": {
        "name": "Sumit Bhanushali",
        "email": "[REDACTED]"
      }
    },
    "reviewer_ids": [
      26939388
    ],
    "source": {
      "id": 68500871,
      "name": "my-awesome-project",
      "description": null,
      "web_url": "https://gitlab.com/sumitb16/my-awesome-project",
      "avatar_url": null,
      "git_ssh_url": "git@gitlab.com:sumitb16/my-awesome-project.git",
      "git_http_url": "https://gitlab.com/sumitb16/my-awesome-project.git",
      "namespace": "sumitb16",
      "visibility_level": 0,
      "path_with_namespace": "sumitb16/my-awesome-project",
      "default_branch": "main",
      "ci_config_path": "",
      "homepage": "https://gitlab.com/sumitb16/my-awesome-project",
      "url": "git@gitlab.com:sumitb16/my-awesome-project.git",
      "ssh_url": "git@gitlab.com:sumitb16/my-awesome-project.git",
      "http_url": "https://gitlab.com/sumitb16/my-awesome-project.git"
    },
    "state": "opened",
    "target": {
      "id": 68500871,
      "name": "my-awesome-project",
      "description": null,
      "web_url": "https://gitlab.com/sumitb16/my-awesome-project",
      "avatar_url": null,
      "git_ssh_url": "git@gitlab.com:sumitb16/my-awesome-project.git",
      "git_http_url": "https://gitlab.com/sumitb16/my-awesome-project.git",
      "namespace": "sumitb16",
      "visibility_level": 0,
      "path_with_namespace": "sumitb16/my-awesome-project",
      "default_branch": "main",
      "ci_config_path": "",
      "homepage": "https://gitlab.com/sumitb16/my-awesome-project",
      "url": "git@gitlab.com:sumitb16/my-awesome-project.git",
      "ssh_url": "git@gitlab.com:sumitb16/my-awesome-project.git",
      "http_url": "https://gitlab.com/sumitb16/my-awesome-project.git"
    },
    "time_change": 0,
    "total_time_spent": 0,
    "url": "https://gitlab.com/sumitb16/my-awesome-project/merge_requests/1",
    "work_in_progress": false,
    "approval_rules": [],
    "action": "approval"
  },
  "labels": [],
  "changes": {},
  "repository": {
    "name": "my-awesome-project",
    "url": "git@gitlab.com:sumitb16/my-awesome-project.git",
    "description": null,
    "homepage": "https://gitlab.com/sumitb16/my-awesome-project"
  },
  "reviewers": [
    {
      "id": 26939388,
      "name": "Sumit Bhanushali",
      "username": "logancodes16",
      "avatar_url": "https://secure.gravatar.com/avatar/83f4e0baf47f363b6064bf8376d12baabf2ab6b38c1f41a6b1fa41b6d038f254?s=80&d=identicon",
      "email": "[REDACTED]"
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: merge_request_hook__merge_request_approved.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/merge_request_hook__merge_request_approved.json

```json
{
    "object_kind":"merge_request",
    "user":{
        "name":"Eeshan Garg",
        "username":"eeshangargtest",
        "avatar_url":"https://secure.gravatar.com/avatar/36cf0dc28c5302bcd68119fcaaf4d4f3?s=80\u0026d=identicon"
    },
    "project":{
        "id":3319043,
        "name":"my-awesome-project",
        "description":"",
        "web_url":"https://gitlab.com/eeshangarg/my-awesome-project",
        "avatar_url":null,
        "git_ssh_url":"git@gitlab.com:eeshangarg/my-awesome-project.git",
        "git_http_url":"https://gitlab.com/eeshangarg/my-awesome-project.git",
        "namespace":"eeshangarg",
        "visibility_level":20,
        "path_with_namespace":"eeshangarg/my-awesome-project",
        "default_branch":"feature",
        "ci_config_path":null,
        "homepage":"https://gitlab.com/eeshangarg/my-awesome-project",
        "url":"git@gitlab.com:eeshangarg/my-awesome-project.git",
        "ssh_url":"git@gitlab.com:eeshangarg/my-awesome-project.git",
        "http_url":"https://gitlab.com/eeshangarg/my-awesome-project.git"
    },
    "object_attributes":{
        "assignee_id":null,
        "author_id":1129123,
        "created_at":"2017-05-31 03:27:26 UTC",
        "deleted_at":null,
        "description":"",
        "head_pipeline_id":null,
        "id":3673242,
        "iid":1,
        "last_edited_at":null,
        "last_edited_by_id":null,
        "merge_commit_sha":null,
        "merge_error":null,
        "merge_params":{
            "force_remove_source_branch":null
        },
        "merge_status":"can_be_merged",
        "merge_user_id":null,
        "merge_when_pipeline_succeeds":false,
        "milestone_id":null,
        "source_branch":"changes",
        "source_project_id":3319043,
        "state":"opened",
        "target_branch":"feature",
        "target_project_id":3319043,
        "time_estimate":0,
        "title":"Update the README with author name",
        "updated_at":"2017-12-18 00:39:44 UTC",
        "updated_by_id":null,
        "url":"https://gitlab.com/eeshangarg/my-awesome-project/merge_requests/1",
        "source":{
            "id":3319043,
            "name":"my-awesome-project",
            "description":"",
            "web_url":"https://gitlab.com/eeshangarg/my-awesome-project",
            "avatar_url":null,
            "git_ssh_url":"git@gitlab.com:eeshangarg/my-awesome-project.git",
            "git_http_url":"https://gitlab.com/eeshangarg/my-awesome-project.git",
            "namespace":"eeshangarg",
            "visibility_level":20,
            "path_with_namespace":"eeshangarg/my-awesome-project",
            "default_branch":"feature",
            "ci_config_path":null,
            "homepage":"https://gitlab.com/eeshangarg/my-awesome-project",
            "url":"git@gitlab.com:eeshangarg/my-awesome-project.git",
            "ssh_url":"git@gitlab.com:eeshangarg/my-awesome-project.git",
            "http_url":"https://gitlab.com/eeshangarg/my-awesome-project.git"
        },
        "target":{
            "id":3319043,
            "name":"my-awesome-project",
            "description":"",
            "web_url":"https://gitlab.com/eeshangarg/my-awesome-project",
            "avatar_url":null,
            "git_ssh_url":"git@gitlab.com:eeshangarg/my-awesome-project.git",
            "git_http_url":"https://gitlab.com/eeshangarg/my-awesome-project.git",
            "namespace":"eeshangarg",
            "visibility_level":20,
            "path_with_namespace":"eeshangarg/my-awesome-project",
            "default_branch":"feature",
            "ci_config_path":null,
            "homepage":"https://gitlab.com/eeshangarg/my-awesome-project",
            "url":"git@gitlab.com:eeshangarg/my-awesome-project.git",
            "ssh_url":"git@gitlab.com:eeshangarg/my-awesome-project.git",
            "http_url":"https://gitlab.com/eeshangarg/my-awesome-project.git"
        },
        "last_commit":{
            "id":"b1b2824f280e73c5f57c78da5f8eb3cd19990867",
            "message":"Update the README with author name\n",
            "timestamp":"2017-05-31T00:55:38-02:30",
            "url":"https://gitlab.com/eeshangarg/my-awesome-project/commit/b1b2824f280e73c5f57c78da5f8eb3cd19990867",
            "author":{
                "name":"Eeshan Garg",
                "email":"jerryguitarist@gmail.com"
            }
        },
        "work_in_progress":false,
        "total_time_spent":0,
        "human_total_time_spent":null,
        "human_time_estimate":null,
        "action":"approved"
    },
    "labels":[

    ],
    "changes":{

    },
    "repository":{
        "name":"my-awesome-project",
        "url":"git@gitlab.com:eeshangarg/my-awesome-project.git",
        "description":"",
        "homepage":"https://gitlab.com/eeshangarg/my-awesome-project"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: merge_request_hook__merge_request_closed.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/merge_request_hook__merge_request_closed.json

```json
{
   "object_kind":"merge_request",
   "user":{
      "name":"Tomasz Kolek",
      "username":"tomaszkolek0",
      "avatar_url":"https://secure.gravatar.com/avatar/116a6fdbcfd00466297a39174da11fbb?s=80\u0026d=identicon"
   },
   "project":{
      "name":"my-awesome-project",
      "description":"",
      "web_url":"https://gitlab.com/tomaszkolek0/my-awesome-project",
      "avatar_url":null,
      "git_ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "git_http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git",
      "namespace":"tomaszkolek0",
      "visibility_level":0,
      "path_with_namespace":"tomaszkolek0/my-awesome-project",
      "default_branch":"master",
      "homepage":"https://gitlab.com/tomaszkolek0/my-awesome-project",
      "url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git"
   },
   "object_attributes":{
      "id":756208,
      "target_branch":"master",
      "source_branch":"tomek",
      "source_project_id":1534233,
      "author_id":670043,
      "assignee_id":null,
      "title":"NEW MR",
      "created_at":"2016-08-22 20:08:13 UTC",
      "updated_at":"2016-08-22 20:14:21 UTC",
      "milestone_id":null,
      "state":"closed",
      "merge_status":"can_be_merged",
      "target_project_id":1534233,
      "iid":2,
      "description":"",
      "position":0,
      "locked_at":null,
      "updated_by_id":null,
      "merge_error":null,
      "merge_params":{
         "force_remove_source_branch":null
      },
      "merge_when_build_succeeds":false,
      "merge_user_id":null,
      "merge_commit_sha":null,
      "deleted_at":null,
      "approvals_before_merge":null,
      "rebase_commit_sha":null,
      "in_progress_merge_commit_sha":null,
      "source":{
         "name":"my-awesome-project",
         "description":"",
         "web_url":"https://gitlab.com/tomaszkolek0/my-awesome-project",
         "avatar_url":null,
         "git_ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
         "git_http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git",
         "namespace":"tomaszkolek0",
         "visibility_level":0,
         "path_with_namespace":"tomaszkolek0/my-awesome-project",
         "default_branch":"master",
         "homepage":"https://gitlab.com/tomaszkolek0/my-awesome-project",
         "url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
         "ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
         "http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git"
      },
      "target":{
         "name":"my-awesome-project",
         "description":"",
         "web_url":"https://gitlab.com/tomaszkolek0/my-awesome-project",
         "avatar_url":null,
         "git_ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
         "git_http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git",
         "namespace":"tomaszkolek0",
         "visibility_level":0,
         "path_with_namespace":"tomaszkolek0/my-awesome-project",
         "default_branch":"master",
         "homepage":"https://gitlab.com/tomaszkolek0/my-awesome-project",
         "url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
         "ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
         "http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git"
      },
      "last_commit":{
         "id":"600060393d326486c12f222ba78d569dab6b4114",
         "message":"new commit\n",
         "timestamp":"2016-08-22T21:31:34+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/600060393d326486c12f222ba78d569dab6b4114",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         }
      },
      "work_in_progress":false,
      "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/merge_requests/2",
      "action":"close"
   },
   "repository":{
      "name":"my-awesome-project",
      "url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "description":"",
      "homepage":"https://gitlab.com/tomaszkolek0/my-awesome-project"
   }
}
```

--------------------------------------------------------------------------------

---[FILE: merge_request_hook__merge_request_created_without_assignee.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/merge_request_hook__merge_request_created_without_assignee.json

```json
{
   "object_kind":"merge_request",
   "user":{
      "name":"Tomasz Kolek",
      "username":"tomaszkolek0",
      "avatar_url":"https://secure.gravatar.com/avatar/116a6fdbcfd00466297a39174da11fbb?s=80\u0026d=identicon"
   },
   "project":{
      "name":"my-awesome-project",
      "description":"",
      "web_url":"https://gitlab.com/tomaszkolek0/my-awesome-project",
      "avatar_url":null,
      "git_ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "git_http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git",
      "namespace":"tomaszkolek0",
      "visibility_level":0,
      "path_with_namespace":"tomaszkolek0/my-awesome-project",
      "default_branch":"master",
      "homepage":"https://gitlab.com/tomaszkolek0/my-awesome-project",
      "url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git"
   },
   "object_attributes":{
      "id":756208,
      "target_branch":"master",
      "source_branch":"tomek",
      "source_project_id":1534233,
      "author_id":670043,
      "assignee_id":null,
      "title":"NEW MR",
      "created_at":"2016-08-22 20:08:13 UTC",
      "updated_at":"2016-08-22 20:08:13 UTC",
      "milestone_id":null,
      "state":"opened",
      "merge_status":"unchecked",
      "target_project_id":1534233,
      "iid":2,
      "description":"description of merge request",
      "position":0,
      "locked_at":null,
      "updated_by_id":null,
      "merge_error":null,
      "merge_params":{
         "force_remove_source_branch":null
      },
      "merge_when_build_succeeds":false,
      "merge_user_id":null,
      "merge_commit_sha":null,
      "deleted_at":null,
      "approvals_before_merge":null,
      "rebase_commit_sha":null,
      "in_progress_merge_commit_sha":null,
      "source":{
         "name":"my-awesome-project",
         "description":"",
         "web_url":"https://gitlab.com/tomaszkolek0/my-awesome-project",
         "avatar_url":null,
         "git_ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
         "git_http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git",
         "namespace":"tomaszkolek0",
         "visibility_level":0,
         "path_with_namespace":"tomaszkolek0/my-awesome-project",
         "default_branch":"master",
         "homepage":"https://gitlab.com/tomaszkolek0/my-awesome-project",
         "url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
         "ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
         "http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git"
      },
      "target":{
         "name":"my-awesome-project",
         "description":"",
         "web_url":"https://gitlab.com/tomaszkolek0/my-awesome-project",
         "avatar_url":null,
         "git_ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
         "git_http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git",
         "namespace":"tomaszkolek0",
         "visibility_level":0,
         "path_with_namespace":"tomaszkolek0/my-awesome-project",
         "default_branch":"master",
         "homepage":"https://gitlab.com/tomaszkolek0/my-awesome-project",
         "url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
         "ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
         "http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git"
      },
      "last_commit":{
         "id":"600060393d326486c12f222ba78d569dab6b4114",
         "message":"new commit\n",
         "timestamp":"2016-08-22T21:31:34+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/600060393d326486c12f222ba78d569dab6b4114",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         }
      },
      "work_in_progress":false,
      "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/merge_requests/2",
      "action":"open"
   },
   "repository":{
      "name":"my-awesome-project",
      "url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "description":"",
      "homepage":"https://gitlab.com/tomaszkolek0/my-awesome-project"
   }
}
```

--------------------------------------------------------------------------------

---[FILE: merge_request_hook__merge_request_created_with_assignee.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/merge_request_hook__merge_request_created_with_assignee.json

```json
{
   "object_kind":"merge_request",
   "user":{
      "name":"Tomasz Kolek",
      "username":"tomaszkolek0",
      "avatar_url":"https://secure.gravatar.com/avatar/116a6fdbcfd00466297a39174da11fbb?s=80\u0026d=identicon"
   },
   "project":{
      "name":"my-awesome-project",
      "description":"",
      "web_url":"https://gitlab.com/tomaszkolek0/my-awesome-project",
      "avatar_url":null,
      "git_ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "git_http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git",
      "namespace":"tomaszkolek0",
      "visibility_level":0,
      "path_with_namespace":"tomaszkolek0/my-awesome-project",
      "default_branch":"master",
      "homepage":"https://gitlab.com/tomaszkolek0/my-awesome-project",
      "url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git"
   },
   "object_attributes":{
      "id":756509,
      "target_branch":"master",
      "source_branch":"tomek",
      "source_project_id":1534233,
      "author_id":670043,
      "assignee_id":670043,
      "title":"New Merge Request",
      "created_at":"2016-08-22 20:27:22 UTC",
      "updated_at":"2016-08-22 20:27:22 UTC",
      "milestone_id":null,
      "state":"opened",
      "merge_status":"unchecked",
      "target_project_id":1534233,
      "iid":3,
      "description":"description of merge request",
      "position":0,
      "locked_at":null,
      "updated_by_id":null,
      "merge_error":null,
      "merge_params":{
         "force_remove_source_branch":null
      },
      "merge_when_build_succeeds":false,
      "merge_user_id":null,
      "merge_commit_sha":null,
      "deleted_at":null,
      "approvals_before_merge":null,
      "rebase_commit_sha":null,
      "in_progress_merge_commit_sha":null,
      "source":{
         "name":"my-awesome-project",
         "description":"",
         "web_url":"https://gitlab.com/tomaszkolek0/my-awesome-project",
         "avatar_url":null,
         "git_ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
         "git_http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git",
         "namespace":"tomaszkolek0",
         "visibility_level":0,
         "path_with_namespace":"tomaszkolek0/my-awesome-project",
         "default_branch":"master",
         "homepage":"https://gitlab.com/tomaszkolek0/my-awesome-project",
         "url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
         "ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
         "http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git"
      },
      "target":{
         "name":"my-awesome-project",
         "description":"",
         "web_url":"https://gitlab.com/tomaszkolek0/my-awesome-project",
         "avatar_url":null,
         "git_ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
         "git_http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git",
         "namespace":"tomaszkolek0",
         "visibility_level":0,
         "path_with_namespace":"tomaszkolek0/my-awesome-project",
         "default_branch":"master",
         "homepage":"https://gitlab.com/tomaszkolek0/my-awesome-project",
         "url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
         "ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
         "http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git"
      },
      "last_commit":{
         "id":"600060393d326486c12f222ba78d569dab6b4114",
         "message":"new commit\n",
         "timestamp":"2016-08-22T21:31:34+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/600060393d326486c12f222ba78d569dab6b4114",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         }
      },
      "work_in_progress":false,
      "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/merge_requests/3",
      "action":"open"
   },
   "repository":{
      "name":"my-awesome-project",
      "url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "description":"",
      "homepage":"https://gitlab.com/tomaszkolek0/my-awesome-project"
   },
   "assignee":{
      "name":"Tomasz Kolek",
      "username":"tomaszkolek0",
      "avatar_url":"https://secure.gravatar.com/avatar/116a6fdbcfd00466297a39174da11fbb?s=80\u0026d=identicon"
   }
}
```

--------------------------------------------------------------------------------

````
