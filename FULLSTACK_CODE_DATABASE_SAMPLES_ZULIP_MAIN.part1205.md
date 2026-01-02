---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1205
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1205 of 1290)

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

---[FILE: release_hook__create.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/release_hook__create.json

```json
{
    "id": 1,
    "created_at": "2020-11-02 12:55:12 UTC",
    "description": "## v1.1 (2024-09-06)\n\n- Feature added",
    "name": "v1.1",
    "released_at": "2020-11-02 12:55:12 UTC",
    "tag": "v1.1",
    "object_kind": "release",
    "project": {
        "id": 2,
        "name": "release-webhook-example",
        "description": "",
        "web_url": "https://example.com/gitlab-org/release-webhook-example",
        "avatar_url": null,
        "git_ssh_url": "ssh://git@example.com/gitlab-org/release-webhook-example.git",
        "git_http_url": "https://example.com/gitlab-org/release-webhook-example.git",
        "namespace": "Gitlab",
        "visibility_level": 0,
        "path_with_namespace": "gitlab-org/release-webhook-example",
        "default_branch": "master",
        "ci_config_path": null,
        "homepage": "https://example.com/gitlab-org/release-webhook-example",
        "url": "ssh://git@example.com/gitlab-org/release-webhook-example.git",
        "ssh_url": "ssh://git@example.com/gitlab-org/release-webhook-example.git",
        "http_url": "https://example.com/gitlab-org/release-webhook-example.git"
    },
    "url": "https://example.com/gitlab-org/release-webhook-example/-/releases/v1.1",
    "action": "create",
    "assets": {
        "count": 5,
        "links": [
            {
                "id": 1,
                "link_type": "other",
                "name": "Changelog",
                "url": "https://example.net/changelog"
            }
        ],
        "sources": [
            {
                "format": "zip",
                "url": "https://example.com/gitlab-org/release-webhook-example/-/archive/v1.1/release-webhook-example-v1.1.zip"
            },
            {
                "format": "tar.gz",
                "url": "https://example.com/gitlab-org/release-webhook-example/-/archive/v1.1/release-webhook-example-v1.1.tar.gz"
            },
            {
                "format": "tar.bz2",
                "url": "https://example.com/gitlab-org/release-webhook-example/-/archive/v1.1/release-webhook-example-v1.1.tar.bz2"
            },
            {
                "format": "tar",
                "url": "https://example.com/gitlab-org/release-webhook-example/-/archive/v1.1/release-webhook-example-v1.1.tar"
            }
        ]
    },
    "commit": {
        "id": "ee0a3fb31ac16e11b9dbb596ad16d4af654d08f8",
        "message": "Release v1.1",
        "title": "Release v1.1",
        "timestamp": "2020-10-31T14:58:32+11:00",
        "url": "https://example.com/gitlab-org/release-webhook-example/-/commit/ee0a3fb31ac16e11b9dbb596ad16d4af654d08f8",
        "author": {
            "name": "Example User",
            "email": "user@example.com"
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: release_hook__delete.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/release_hook__delete.json

```json
{
    "id": 1,
    "created_at": "2020-11-02 12:55:12 UTC",
    "description": "## v1.1 (2024-09-06)\n\n- Feature added",
    "name": "v1.1",
    "released_at": "2020-11-02 12:55:12 UTC",
    "tag": "v1.1",
    "object_kind": "release",
    "project": {
        "id": 2,
        "name": "release-webhook-example",
        "description": "",
        "web_url": "https://example.com/gitlab-org/release-webhook-example",
        "avatar_url": null,
        "git_ssh_url": "ssh://git@example.com/gitlab-org/release-webhook-example.git",
        "git_http_url": "https://example.com/gitlab-org/release-webhook-example.git",
        "namespace": "Gitlab",
        "visibility_level": 0,
        "path_with_namespace": "gitlab-org/release-webhook-example",
        "default_branch": "master",
        "ci_config_path": null,
        "homepage": "https://example.com/gitlab-org/release-webhook-example",
        "url": "ssh://git@example.com/gitlab-org/release-webhook-example.git",
        "ssh_url": "ssh://git@example.com/gitlab-org/release-webhook-example.git",
        "http_url": "https://example.com/gitlab-org/release-webhook-example.git"
    },
    "url": "https://example.com/gitlab-org/release-webhook-example/-/releases/v1.1",
    "action": "delete",
    "assets": {
        "count": 5,
        "links": [
            {
                "id": 1,
                "link_type": "other",
                "name": "Changelog",
                "url": "https://example.net/changelog"
            }
        ],
        "sources": [
            {
                "format": "zip",
                "url": "https://example.com/gitlab-org/release-webhook-example/-/archive/v1.1/release-webhook-example-v1.1.zip"
            },
            {
                "format": "tar.gz",
                "url": "https://example.com/gitlab-org/release-webhook-example/-/archive/v1.1/release-webhook-example-v1.1.tar.gz"
            },
            {
                "format": "tar.bz2",
                "url": "https://example.com/gitlab-org/release-webhook-example/-/archive/v1.1/release-webhook-example-v1.1.tar.bz2"
            },
            {
                "format": "tar",
                "url": "https://example.com/gitlab-org/release-webhook-example/-/archive/v1.1/release-webhook-example-v1.1.tar"
            }
        ]
    },
    "commit": {
        "id": "ee0a3fb31ac16e11b9dbb596ad16d4af654d08f8",
        "message": "Release v1.1",
        "title": "Release v1.1",
        "timestamp": "2020-10-31T14:58:32+11:00",
        "url": "https://example.com/gitlab-org/release-webhook-example/-/commit/ee0a3fb31ac16e11b9dbb596ad16d4af654d08f8",
        "author": {
            "name": "Example User",
            "email": "user@example.com"
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: release_hook__update.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/release_hook__update.json

```json
{
    "id": 1,
    "created_at": "2020-11-02 12:55:12 UTC",
    "description": "## v1.1 (2024-09-06)\n\n- Feature added",
    "name": "v1.1",
    "released_at": "2020-11-02 12:55:12 UTC",
    "tag": "v1.1",
    "object_kind": "release",
    "project": {
        "id": 2,
        "name": "release-webhook-example",
        "description": "",
        "web_url": "https://example.com/gitlab-org/release-webhook-example",
        "avatar_url": null,
        "git_ssh_url": "ssh://git@example.com/gitlab-org/release-webhook-example.git",
        "git_http_url": "https://example.com/gitlab-org/release-webhook-example.git",
        "namespace": "Gitlab",
        "visibility_level": 0,
        "path_with_namespace": "gitlab-org/release-webhook-example",
        "default_branch": "master",
        "ci_config_path": null,
        "homepage": "https://example.com/gitlab-org/release-webhook-example",
        "url": "ssh://git@example.com/gitlab-org/release-webhook-example.git",
        "ssh_url": "ssh://git@example.com/gitlab-org/release-webhook-example.git",
        "http_url": "https://example.com/gitlab-org/release-webhook-example.git"
    },
    "url": "https://example.com/gitlab-org/release-webhook-example/-/releases/v1.1",
    "action": "update",
    "assets": {
        "count": 5,
        "links": [
            {
                "id": 1,
                "link_type": "other",
                "name": "Changelog",
                "url": "https://example.net/changelog"
            }
        ],
        "sources": [
            {
                "format": "zip",
                "url": "https://example.com/gitlab-org/release-webhook-example/-/archive/v1.1/release-webhook-example-v1.1.zip"
            },
            {
                "format": "tar.gz",
                "url": "https://example.com/gitlab-org/release-webhook-example/-/archive/v1.1/release-webhook-example-v1.1.tar.gz"
            },
            {
                "format": "tar.bz2",
                "url": "https://example.com/gitlab-org/release-webhook-example/-/archive/v1.1/release-webhook-example-v1.1.tar.bz2"
            },
            {
                "format": "tar",
                "url": "https://example.com/gitlab-org/release-webhook-example/-/archive/v1.1/release-webhook-example-v1.1.tar"
            }
        ]
    },
    "commit": {
        "id": "ee0a3fb31ac16e11b9dbb596ad16d4af654d08f8",
        "message": "Release v1.1",
        "title": "Release v1.1",
        "timestamp": "2020-10-31T14:58:32+11:00",
        "url": "https://example.com/gitlab-org/release-webhook-example/-/commit/ee0a3fb31ac16e11b9dbb596ad16d4af654d08f8",
        "author": {
            "name": "Example User",
            "email": "user@example.com"
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: repository_update.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/repository_update.json

```json
{
  "event_name": "repository_update",
  "user_id": 1,
  "user_name": "John Smith",
  "user_email": "admin@example.com",
  "user_avatar": "https://s.gravatar.com/avatar/d4c74594d841139328695756648b6bd6?s=8://s.gravatar.com/avatar/d4c74594d841139328695756648b6bd6?s=80",
  "project_id": 1,
  "project": {
    "name":"Example",
    "description":"",
    "web_url":"http://example.com/jsmith/example",
    "avatar_url":null,
    "git_ssh_url":"git@example.com:jsmith/example.git",
    "git_http_url":"http://example.com/jsmith/example.git",
    "namespace":"Jsmith",
    "visibility_level":0,
    "path_with_namespace":"jsmith/example",
    "default_branch":"master",
    "homepage":"http://example.com/jsmith/example",
    "url":"git@example.com:jsmith/example.git",
    "ssh_url":"git@example.com:jsmith/example.git",
    "http_url":"http://example.com/jsmith/example.git"
  },
  "changes": [
    {
      "before":"8205ea8d81ce0c6b90fbe8280d118cc9fdad6130",
      "after":"4045ea7a3df38697b3730a20fb73c8bed8a3e69e",
      "ref":"refs/heads/master"
    }
  ],
  "refs":["refs/heads/master"]
}
```

--------------------------------------------------------------------------------

---[FILE: resource_access_token_hook__group_expiry.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/resource_access_token_hook__group_expiry.json

```json
{
    "object_kind": "access_token",
    "group": {
      "group_name": "Twitter",
      "group_path": "twitter",
      "group_id": 35,
      "full_path": "twitter"
    },
    "object_attributes": {
      "user_id": 90,
      "created_at": "2024-01-24 16:27:40 UTC",
      "id": 25,
      "name": "acd",
      "expires_at": "2024-01-26"
    },
    "event_name": "expiring_access_token"
  }
```

--------------------------------------------------------------------------------

---[FILE: resource_access_token_hook__project_expiry.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/resource_access_token_hook__project_expiry.json

```json
{
    "object_kind": "access_token",
    "project": {
      "id": 7,
      "name": "Flight",
      "description": "Eum dolore maxime atque reprehenderit voluptatem.",
      "web_url": "https://example.com/flightjs/Flight",
      "avatar_url": null,
      "git_ssh_url": "ssh://git@example.com/flightjs/Flight.git",
      "git_http_url": "https://example.com/flightjs/Flight.git",
      "namespace": "Flightjs",
      "visibility_level": 0,
      "path_with_namespace": "flightjs/Flight",
      "default_branch": "master",
      "ci_config_path": null,
      "homepage": "https://example.com/flightjs/Flight",
      "url": "ssh://git@example.com/flightjs/Flight.git",
      "ssh_url": "ssh://git@example.com/flightjs/Flight.git",
      "http_url": "https://example.com/flightjs/Flight.git"
    },
    "object_attributes": {
      "user_id": 90,
      "created_at": "2024-01-24 16:27:40 UTC",
      "id": 25,
      "name": "acd",
      "expires_at": "2024-01-26"
    },
    "event_name": "expiring_access_token"
  }
```

--------------------------------------------------------------------------------

---[FILE: system_hook__merge_request_closed.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/system_hook__merge_request_closed.json

```json
{
   "object_kind": "merge_request",
   "event_type": "merge_request",
   "user":{
      "name":"Tomasz Kolek",
      "username":"tomaszkolek0",
      "avatar_url":"https://secure.gravatar.com/avatar/116a6fdbcfd00466297a39174da11fbb?s=80\u0026d=identicon",
      "email": "test@test.com.au"
   },
   "project":{
      "id": 241,
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
      "ci_config_path": null,
      "homepage":"https://gitlab.com/tomaszkolek0/my-awesome-project",
      "url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git"
   },
   "object_attributes":{
      "head_pipeline_id": null,
      "state_id": 2,
      "last_edited_at": null,
      "last_edited_by_id": null,
      "time_estimate": 0,
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
         "id": 241,
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
      "total_time_spent": 0,
      "human_total_time_spent": null,
      "human_time_estimate": null,
      "assignee_ids": [

      ],
      "work_in_progress":false,
      "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/merge_requests/2",
      "action":"close",
      "changes": {
         "state_id": {
           "previous": 1,
           "current": 2
         },
         "updated_at": {
           "previous": "2020-04-22 10:12:52 UTC",
           "current": "2020-04-22 10:59:42 UTC"
         },
         "total_time_spent": {
           "previous": null,
           "current": 0
         }
       }
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

---[FILE: system_hook__merge_request_created_without_assignee.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/system_hook__merge_request_created_without_assignee.json

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

---[FILE: system_hook__merge_request_created_with_assignee.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/system_hook__merge_request_created_with_assignee.json

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

---[FILE: system_hook__merge_request_merged.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/system_hook__merge_request_merged.json

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

---[FILE: system_hook__push_hook.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/system_hook__push_hook.json

```json
{
  "object_kind": "push",
  "event_name": "push",
  "before": "95790bf891e76fee5e1747ab589903a6a1f80f22",
  "after": "da1560886d4f094c3e6c9ef40349f7d38b5d27d7",
  "ref": "refs/heads/master",
  "checkout_sha": "da1560886d4f094c3e6c9ef40349f7d38b5d27d7",
  "message": "Hello World",
  "user_id": 4,
  "user_name": "John Smith",
  "user_email": "john@example.com",
  "user_avatar": "https://s.gravatar.com/avatar/d4c74594d841139328695756648b6bd6?s=8://s.gravatar.com/avatar/d4c74594d841139328695756648b6bd6?s=80",
  "project_id": 15,
  "project": {
    "id": 15,
    "name": "gitlab",
    "description": "",
    "web_url": "http://test.example.com/gitlab/gitlab",
    "avatar_url": "https://s.gravatar.com/avatar/d4c74594d841139328695756648b6bd6?s=8://s.gravatar.com/avatar/d4c74594d841139328695756648b6bd6?s=80",
    "git_ssh_url": "git@test.example.com:gitlab/gitlab.git",
    "git_http_url": "http://test.example.com/gitlab/gitlab.git",
    "namespace": "gitlab",
    "visibility_level": 0,
    "path_with_namespace": "gitlab/gitlab",
    "default_branch": "master"
  },
  "commits": [
    {
      "id": "c5feabde2d8cd023215af4d2ceeb7a64839fc428",
      "message": "Add simple search to projects in public area\n\ncommit message body",
      "title": "Add simple search to projects in public area",
      "timestamp": "2013-05-13T18:18:08+00:00",
      "url": "https://test.example.com/gitlab/gitlab/-/commit/c5feabde2d8cd023215af4d2ceeb7a64839fc428",
      "author": {
        "name": "Test User",
        "email": "test@example.com"
      }
    }
  ],
  "total_commits_count": 1,
  "push_options": {
    "ci": {
      "skip": true
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: tag_push_hook__add_tag.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/tag_push_hook__add_tag.json

```json
{
   "object_kind":"tag_push",
   "event_name":"tag_push",
   "before":"0000000000000000000000000000000000000000",
   "after":"eb6ae1e591e0819dc5bf187c6bfe18ec065a80e9",
   "ref":"refs/tags/xyz",
   "checkout_sha":"eb6ae1e591e0819dc5bf187c6bfe18ec065a80e9",
   "message":null,
   "user_id":670043,
   "user_name":"Tomasz Kolek",
   "user_email":"tomaszkolek0@gmail.com",
   "user_avatar":"https://secure.gravatar.com/avatar/116a6fdbcfd00466297a39174da11fbb?s=80\u0026d=identicon",
   "project_id":1534233,
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
   "commits":[

   ],
   "total_commits_count":0,
   "repository":{
      "name":"my-awesome-project",
      "url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "description":"",
      "homepage":"https://gitlab.com/tomaszkolek0/my-awesome-project",
      "git_http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git",
      "git_ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "visibility_level":0
   }
}
```

--------------------------------------------------------------------------------

---[FILE: tag_push_hook__remove_tag.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/tag_push_hook__remove_tag.json

```json
{
   "object_kind":"tag_push",
   "event_name":"tag_push",
   "before":"0000000000000000000000000000000000000000",
   "after":"eb6ae1e591e0819dc5bf187c6bfe18ec065a80e9",
   "ref":"refs/tags/xyz",
   "checkout_sha": null,
   "message":null,
   "user_id":670043,
   "user_name":"Tomasz Kolek",
   "user_email":"tomaszkolek0@gmail.com",
   "user_avatar":"https://secure.gravatar.com/avatar/116a6fdbcfd00466297a39174da11fbb?s=80\u0026d=identicon",
   "project_id":1534233,
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
   "commits":[

   ],
   "total_commits_count":0,
   "repository":{
      "name":"my-awesome-project",
      "url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "description":"",
      "homepage":"https://gitlab.com/tomaszkolek0/my-awesome-project",
      "git_http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git",
      "git_ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "visibility_level":0
   }
}
```

--------------------------------------------------------------------------------

---[FILE: test_hook__issue_test_payload.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/test_hook__issue_test_payload.json

```json
{
    "object_kind":"issue",
    "user":{
        "name":"Eeshan Garg",
        "username":"eeshangarg",
        "avatar_url":"https://secure.gravatar.com/avatar/cd181af88d928dab53c55600c9f7551d?s=80\u0026d=identicon"
    },
    "project":{
        "name":"public-repo",
        "description":null,
        "web_url":"https://gitlab.com/eeshangarg/public-repo",
        "avatar_url":null,
        "git_ssh_url":"git@gitlab.com:eeshangarg/public-repo.git",
        "git_http_url":"https://gitlab.com/eeshangarg/public-repo.git",
        "namespace":"eeshangarg",
        "visibility_level":0,
        "path_with_namespace":"eeshangarg/public-repo",
        "default_branch":"changes",
        "ci_config_path":null,
        "homepage":"https://gitlab.com/eeshangarg/public-repo",
        "url":"git@gitlab.com:eeshangarg/public-repo.git",
        "ssh_url":"git@gitlab.com:eeshangarg/public-repo.git",
        "http_url":"https://gitlab.com/eeshangarg/public-repo.git"
    },
    "object_attributes":{
        "id":7755253,
        "title":"New issue that needs to be fixed",
        "assignee_id":null,
        "author_id":1129123,
        "project_id":3319013,
        "created_at":"2017-11-15T02:35:38.035Z",
        "updated_at":"2017-11-15T02:46:32.196Z",
        "branch_name":null,
        "description":"",
        "milestone_id":null,
        "state":"opened",
        "iid":1,
        "updated_by_id":1129123,
        "weight":null,
        "confidential":false,
        "moved_to_id":null,
        "deleted_at":null,
        "due_date":null,
        "lock_version":null,
        "time_estimate":0,
        "relative_position":1073742323,
        "service_desk_reply_to":null,
        "closed_at":null,
        "last_edited_at":null,
        "last_edited_by_id":null,
        "discussion_locked":null,
        "total_time_spent":0,
        "human_total_time_spent":null,
        "human_time_estimate":null,
        "assignee_ids":[

        ]
    },
    "labels":[

    ],
    "repository":{
        "name":"public-repo",
        "url":"git@gitlab.com:eeshangarg/public-repo.git",
        "description":null,
        "homepage":"https://gitlab.com/eeshangarg/public-repo"
    }
}
```

--------------------------------------------------------------------------------

````
