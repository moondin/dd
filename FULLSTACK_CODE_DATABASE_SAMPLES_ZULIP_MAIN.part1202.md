---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1202
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1202 of 1290)

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

---[FILE: merge_request_hook__merge_request_created_with_multiple_assignees.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/merge_request_hook__merge_request_created_with_multiple_assignees.json

```json
{
  "object_kind": "merge_request",
  "event_type": "merge_request",
  "user": {
    "name": "Hemanth V. Alluri",
    "username": "Hypro999",
    "avatar_url": "https://assets.gitlab-static.net/uploads/-/system/user/avatar/2222626/avatar.png",
    "email": "hdrive1999@gmail.com"
  },
  "project": {
    "id": 20677423,
    "name": "Demo Project",
    "description": "Just a sample project for generating webhook fixtures.",
    "web_url": "https://gitlab.com/Hypro999/demo-project",
    "avatar_url": null,
    "git_ssh_url": "git@gitlab.com:Hypro999/demo-project.git",
    "git_http_url": "https://gitlab.com/Hypro999/demo-project.git",
    "namespace": "Hemanth V. Alluri",
    "visibility_level": 20,
    "path_with_namespace": "Hypro999/demo-project",
    "default_branch": "master",
    "ci_config_path": "",
    "homepage": "https://gitlab.com/Hypro999/demo-project",
    "url": "git@gitlab.com:Hypro999/demo-project.git",
    "ssh_url": "git@gitlab.com:Hypro999/demo-project.git",
    "http_url": "https://gitlab.com/Hypro999/demo-project.git"
  },
  "object_attributes": {
    "assignee_id": 2222626,
    "author_id": 2222626,
    "created_at": "2020-08-22 09:35:19 UTC",
    "description": "A trivial change that should probably be ignored.",
    "head_pipeline_id": null,
    "id": 68400043,
    "iid": 1,
    "last_edited_at": null,
    "last_edited_by_id": null,
    "merge_commit_sha": null,
    "merge_error": null,
    "merge_params": {
      "force_remove_source_branch": "1"
    },
    "merge_status": "unchecked",
    "merge_user_id": null,
    "merge_when_pipeline_succeeds": false,
    "milestone_id": null,
    "source_branch": "devel",
    "source_project_id": 20677423,
    "state_id": 1,
    "target_branch": "master",
    "target_project_id": 20677423,
    "time_estimate": 0,
    "title": "Make a trivial change to the README.",
    "updated_at": "2020-08-22 09:35:19 UTC",
    "updated_by_id": null,
    "url": "https://gitlab.com/Hypro999/demo-project/-/merge_requests/1",
    "source": {
      "id": 20677423,
      "name": "Demo Project",
      "description": "Just a sample project for generating webhook fixtures.",
      "web_url": "https://gitlab.com/Hypro999/demo-project",
      "avatar_url": null,
      "git_ssh_url": "git@gitlab.com:Hypro999/demo-project.git",
      "git_http_url": "https://gitlab.com/Hypro999/demo-project.git",
      "namespace": "Hemanth V. Alluri",
      "visibility_level": 20,
      "path_with_namespace": "Hypro999/demo-project",
      "default_branch": "master",
      "ci_config_path": "",
      "homepage": "https://gitlab.com/Hypro999/demo-project",
      "url": "git@gitlab.com:Hypro999/demo-project.git",
      "ssh_url": "git@gitlab.com:Hypro999/demo-project.git",
      "http_url": "https://gitlab.com/Hypro999/demo-project.git"
    },
    "target": {
      "id": 20677423,
      "name": "Demo Project",
      "description": "Just a sample project for generating webhook fixtures.",
      "web_url": "https://gitlab.com/Hypro999/demo-project",
      "avatar_url": null,
      "git_ssh_url": "git@gitlab.com:Hypro999/demo-project.git",
      "git_http_url": "https://gitlab.com/Hypro999/demo-project.git",
      "namespace": "Hemanth V. Alluri",
      "visibility_level": 20,
      "path_with_namespace": "Hypro999/demo-project",
      "default_branch": "master",
      "ci_config_path": "",
      "homepage": "https://gitlab.com/Hypro999/demo-project",
      "url": "git@gitlab.com:Hypro999/demo-project.git",
      "ssh_url": "git@gitlab.com:Hypro999/demo-project.git",
      "http_url": "https://gitlab.com/Hypro999/demo-project.git"
    },
    "last_commit": {
      "id": "1499daa03599c6781f427ee683d2969f39cad4d0",
      "message": "Make a trivial change to the README.\n",
      "title": "Make a trivial change to the README.",
      "timestamp": "2020-08-22T14:21:01+05:30",
      "url": "https://gitlab.com/Hypro999/demo-project/-/commit/1499daa03599c6781f427ee683d2969f39cad4d0",
      "author": {
        "name": "Hemanth V. Alluri",
        "email": "hdrive1999@gmail.com"
      }
    },
    "work_in_progress": false,
    "total_time_spent": 0,
    "human_total_time_spent": null,
    "human_time_estimate": null,
    "assignee_ids": [
      2222626,
      2808044
    ],
    "state": "opened",
    "action": "open"
  },
  "labels": [],
  "changes": {
    "author_id": {
      "previous": null,
      "current": 2222626
    },
    "created_at": {
      "previous": null,
      "current": "2020-08-22 09:35:19 UTC"
    },
    "description": {
      "previous": null,
      "current": "A trivial change that should probably be ignored."
    },
    "id": {
      "previous": null,
      "current": 68400043
    },
    "iid": {
      "previous": null,
      "current": 1
    },
    "merge_params": {
      "previous": {},
      "current": {
        "force_remove_source_branch": "1"
      }
    },
    "source_branch": {
      "previous": null,
      "current": "devel"
    },
    "source_project_id": {
      "previous": null,
      "current": 20677423
    },
    "target_branch": {
      "previous": null,
      "current": "master"
    },
    "target_project_id": {
      "previous": null,
      "current": 20677423
    },
    "title": {
      "previous": null,
      "current": "Make a trivial change to the README."
    },
    "updated_at": {
      "previous": null,
      "current": "2020-08-22 09:35:19 UTC"
    }
  },
  "repository": {
    "name": "Demo Project",
    "url": "git@gitlab.com:Hypro999/demo-project.git",
    "description": "Just a sample project for generating webhook fixtures.",
    "homepage": "https://gitlab.com/Hypro999/demo-project"
  },
  "assignees": [
    {
      "name": "Hemanth V. Alluri",
      "username": "Hypro999",
      "avatar_url": "https://assets.gitlab-static.net/uploads/-/system/user/avatar/2222626/avatar.png",
      "email": "hdrive1999@gmail.com"
    },
    {
      "name": "Hemanth V. Alluri",
      "username": "f20171170",
      "avatar_url": "https://assets.gitlab-static.net/uploads/-/system/user/avatar/2808044/avatar.png",
      "email": "f20171170@pilani.bits-pilani.ac.in"
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: merge_request_hook__merge_request_merged.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/merge_request_hook__merge_request_merged.json

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
      "updated_at":"2016-08-22 20:41:06 UTC",
      "milestone_id":null,
      "state":"merged",
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
      "merge_commit_sha":"5bcfb805534d13224e8fa7698a2819bf0d055f29",
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
         "id":"f423fe3fedbc09f64ef438bedbde12caa161ee14",
         "message":"new\n",
         "timestamp":"2016-08-22T22:34:57+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/f423fe3fedbc09f64ef438bedbde12caa161ee14",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         }
      },
      "work_in_progress":false,
      "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/merge_requests/3",
      "action":"merge"
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

---[FILE: merge_request_hook__merge_request_reopened.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/merge_request_hook__merge_request_reopened.json

```json
{
    "object_kind":"merge_request",
    "user":{
        "name":"Eeshan Garg",
        "username":"eeshangarg",
        "avatar_url":"https://secure.gravatar.com/avatar/cd181af88d928dab53c55600c9f7551d?s=80\u0026d=identicon"
    },
    "project":{
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
        "homepage":"https://gitlab.com/eeshangarg/my-awesome-project",
        "url":"git@gitlab.com:eeshangarg/my-awesome-project.git",
        "ssh_url":"git@gitlab.com:eeshangarg/my-awesome-project.git",
        "http_url":"https://gitlab.com/eeshangarg/my-awesome-project.git"
    },
    "object_attributes":{
        "id":3673242,
        "target_branch":"feature",
        "source_branch":"changes",
        "source_project_id":3319043,
        "author_id":1129123,
        "assignee_id":null,
        "title":"Update the README with author name",
        "created_at":"2017-05-31 03:27:26 UTC",
        "updated_at":"2017-05-31 03:29:52 UTC",
        "milestone_id":null,
        "state":"reopened",
        "merge_status":"can_be_merged",
        "target_project_id":3319043,
        "iid":1,
        "description":"",
        "position":0,
        "locked_at":null,
        "updated_by_id":null,
        "merge_error":null,
        "merge_params":{
            "force_remove_source_branch":null
        },
        "merge_when_pipeline_succeeds":false,
        "merge_user_id":null,
        "merge_commit_sha":null,
        "deleted_at":null,
        "approvals_before_merge":null,
        "rebase_commit_sha":null,
        "in_progress_merge_commit_sha":null,
        "lock_version":null,
        "time_estimate":0,
        "squash":false,
        "last_edited_at":null,
        "last_edited_by_id":null,
        "source":{
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
            "homepage":"https://gitlab.com/eeshangarg/my-awesome-project",
            "url":"git@gitlab.com:eeshangarg/my-awesome-project.git",
            "ssh_url":"git@gitlab.com:eeshangarg/my-awesome-project.git",
            "http_url":"https://gitlab.com/eeshangarg/my-awesome-project.git"
        },
        "target":{
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
        "url":"https://gitlab.com/eeshangarg/my-awesome-project/merge_requests/1",
        "action":"reopen"
    },
    "labels":[

    ],
    "repository":{
        "name":"my-awesome-project",
        "url":"git@gitlab.com:eeshangarg/my-awesome-project.git",
        "description":"",
        "homepage":"https://gitlab.com/eeshangarg/my-awesome-project"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: merge_request_hook__merge_request_unapproval.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/merge_request_hook__merge_request_unapproval.json

```json
{
  "object_kind": "merge_request",
  "event_type": "merge_request",
  "user": {
    "id": 26939734,
    "name": "Sumit Bhanushali",
    "username": "gunner.sumit",
    "avatar_url": "https://secure.gravatar.com/avatar/62375142d03eb8b07a511a443f8d2af36497e8f36f24b71b6ffabecadda41598?s=80&d=identicon",
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
    "updated_at": "2025-03-30 08:22:36 UTC",
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
    "action": "unapproval"
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

---[FILE: merge_request_hook__merge_request_unapproved.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/merge_request_hook__merge_request_unapproved.json

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
        "work_in_progress": false,
        "total_time_spent": 0,
        "human_total_time_spent": null,
        "human_time_estimate": null,
        "assignee_ids": [
          3655283
        ],
        "state": "opened",
        "action": "unapproved"
      },
    "labels":[

    ],
    "changes": {
        "updated_at": {
          "previous": "2020-04-25 07:40:54 UTC",
          "current": "2020-04-25 07:44:00 UTC"
        },
        "total_time_spent": {
            "previous": null,
            "current": 0
        }
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

---[FILE: merge_request_hook__merge_request_updated.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/merge_request_hook__merge_request_updated.json

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

---[FILE: note_hook__commit_note.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/note_hook__commit_note.json

```json
{
  "object_kind": "note",
  "event_type": "note",
  "user": {
    "id": 14613894,
    "name": "Satyam Bansal",
    "username": "sbansal1999",
    "avatar_url": "https://secure.gravatar.com/avatar/f4dd7cfc79fac91db4d9ecbb443a0519?s=80&d=identicon",
    "email": "[REDACTED]"
  },
  "project_id": 46186758,
  "project": {
    "id": 46186758,
    "name": "testing-zulip-gitlab-integration",
    "description": null,
    "web_url": "https://gitlab.com/sbansal1999/testing-zulip-gitlab-integration",
    "avatar_url": null,
    "git_ssh_url": "git@gitlab.com:sbansal1999/testing-zulip-gitlab-integration.git",
    "git_http_url": "https://gitlab.com/sbansal1999/testing-zulip-gitlab-integration.git",
    "namespace": "Satyam Bansal",
    "visibility_level": 0,
    "path_with_namespace": "sbansal1999/testing-zulip-gitlab-integration",
    "default_branch": "main",
    "ci_config_path": "",
    "homepage": "https://gitlab.com/sbansal1999/testing-zulip-gitlab-integration",
    "url": "git@gitlab.com:sbansal1999/testing-zulip-gitlab-integration.git",
    "ssh_url": "git@gitlab.com:sbansal1999/testing-zulip-gitlab-integration.git",
    "http_url": "https://gitlab.com/sbansal1999/testing-zulip-gitlab-integration.git"
  },
  "object_attributes": {
    "attachment": null,
    "author_id": 14613894,
    "change_position": null,
    "commit_id": "82689ddf00fd7bdadb5c2afb3b94bd555edc9d01",
    "created_at": "2023-05-25 18:18:17 UTC",
    "discussion_id": "10ffd7c627f00f19cc2fa9cbbed9d13f3ff91375",
    "id": 1406241063,
    "line_code": null,
    "note": "Wow what a beautiful commit.",
    "noteable_id": null,
    "noteable_type": "Commit",
    "original_position": null,
    "position": null,
    "project_id": 46186758,
    "resolved_at": null,
    "resolved_by_id": null,
    "resolved_by_push": null,
    "st_diff": null,
    "system": false,
    "type": null,
    "updated_at": "2023-05-25 18:18:17 UTC",
    "updated_by_id": null,
    "description": "Wow what a beautiful commit.",
    "url": "https://gitlab.com/sbansal1999/testing-zulip-gitlab-integration/-/commit/82689ddf00fd7bdadb5c2afb3b94bd555edc9d01#note_1406241063"
  },
  "repository": {
    "name": "testing-zulip-gitlab-integration",
    "url": "git@gitlab.com:sbansal1999/testing-zulip-gitlab-integration.git",
    "description": null,
    "homepage": "https://gitlab.com/sbansal1999/testing-zulip-gitlab-integration"
  },
  "commit": {
    "id": "82689ddf00fd7bdadb5c2afb3b94bd555edc9d01",
    "message": "added some lines in second file\n",
    "title": "added some lines in second file",
    "timestamp": "2023-05-25T22:21:16+05:30",
    "url": "https://gitlab.com/sbansal1999/testing-zulip-gitlab-integration/-/commit/82689ddf00fd7bdadb5c2afb3b94bd555edc9d01",
    "author": {
      "name": "Satyam Bansal",
      "email": "sbansal1999@gmail.com"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: note_hook__confidential_issue_note.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/note_hook__confidential_issue_note.json

```json
{
  "object_kind": "note",
  "event_type": "confidential_note",
  "user": {
    "id": 14613894,
    "name": "Satyam Bansal",
    "username": "sbansal1999",
    "avatar_url": "https://secure.gravatar.com/avatar/f4dd7cfc79fac91db4d9ecbb443a0519?s=80&d=identicon",
    "email": "[REDACTED]"
  },
  "project_id": 46186758,
  "project": {
    "id": 46186758,
    "name": "testing-zulip-gitlab-integration",
    "description": null,
    "web_url": "https://gitlab.com/sbansal1999/testing-zulip-gitlab-integration",
    "avatar_url": null,
    "git_ssh_url": "git@gitlab.com:sbansal1999/testing-zulip-gitlab-integration.git",
    "git_http_url": "https://gitlab.com/sbansal1999/testing-zulip-gitlab-integration.git",
    "namespace": "Satyam Bansal",
    "visibility_level": 0,
    "path_with_namespace": "sbansal1999/testing-zulip-gitlab-integration",
    "default_branch": "main",
    "ci_config_path": "",
    "homepage": "https://gitlab.com/sbansal1999/testing-zulip-gitlab-integration",
    "url": "git@gitlab.com:sbansal1999/testing-zulip-gitlab-integration.git",
    "ssh_url": "git@gitlab.com:sbansal1999/testing-zulip-gitlab-integration.git",
    "http_url": "https://gitlab.com/sbansal1999/testing-zulip-gitlab-integration.git"
  },
  "object_attributes": {
    "attachment": null,
    "author_id": 14613894,
    "change_position": null,
    "commit_id": null,
    "created_at": "2023-05-25 17:12:06 UTC",
    "discussion_id": "0f34ca7c156316d3169dee075808536909857945",
    "id": 1406130881,
    "line_code": null,
    "note": "Some more comments",
    "noteable_id": 128231959,
    "noteable_type": "Issue",
    "original_position": null,
    "position": null,
    "project_id": 46186758,
    "resolved_at": null,
    "resolved_by_id": null,
    "resolved_by_push": null,
    "st_diff": null,
    "system": false,
    "type": null,
    "updated_at": "2023-05-25 17:12:06 UTC",
    "updated_by_id": null,
    "description": "Some more comments",
    "url": "https://gitlab.com/sbansal1999/testing-zulip-gitlab-integration/-/issues/1#note_1406130881"
  },
  "repository": {
    "name": "testing-zulip-gitlab-integration",
    "url": "git@gitlab.com:sbansal1999/testing-zulip-gitlab-integration.git",
    "description": null,
    "homepage": "https://gitlab.com/sbansal1999/testing-zulip-gitlab-integration"
  },
  "issue": {
    "author_id": 14613894,
    "closed_at": null,
    "confidential": false,
    "created_at": "2023-05-20 17:56:18 UTC",
    "description": "I think we should add a couple of more lines to the file. That will make this a lot better. :eyes:",
    "discussion_locked": null,
    "due_date": null,
    "id": 128231959,
    "iid": 1,
    "last_edited_at": null,
    "last_edited_by_id": null,
    "milestone_id": null,
    "moved_to_id": null,
    "duplicated_to_id": null,
    "project_id": 46186758,
    "relative_position": 513,
    "state_id": 1,
    "time_estimate": 0,
    "title": "Add more lines",
    "updated_at": "2023-05-25 17:12:06 UTC",
    "updated_by_id": null,
    "weight": null,
    "health_status": null,
    "url": "https://gitlab.com/sbansal1999/testing-zulip-gitlab-integration/-/issues/1",
    "total_time_spent": 0,
    "time_change": 0,
    "human_total_time_spent": null,
    "human_time_change": null,
    "human_time_estimate": null,
    "assignee_ids": [],
    "assignee_id": null,
    "labels": [],
    "state": "opened",
    "severity": "unknown"
  }
}
```

--------------------------------------------------------------------------------

````
