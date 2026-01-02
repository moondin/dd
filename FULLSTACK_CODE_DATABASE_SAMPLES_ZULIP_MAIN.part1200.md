---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1200
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1200 of 1290)

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

---[FILE: feature_flag_hook__activated.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/feature_flag_hook__activated.json

```json
{
    "object_kind": "feature_flag",
    "project": {
        "id": 68452408,
        "name": "sample",
        "description": null,
        "web_url": "https://gitlab.com/kolanuvarun/sample",
        "avatar_url": null,
        "git_ssh_url": "git@gitlab.com:kolanuvarun/sample.git",
        "git_http_url": "https://gitlab.com/kolanuvarun/sample.git",
        "namespace": "kolanuvarun",
        "visibility_level": 0,
        "path_with_namespace": "kolanuvarun/sample",
        "default_branch": "master",
        "ci_config_path": "",
        "homepage": "https://gitlab.com/kolanuvarun/sample",
        "url": "git@gitlab.com:kolanuvarun/sample.git",
        "ssh_url": "git@gitlab.com:kolanuvarun/sample.git",
        "http_url": "https://gitlab.com/kolanuvarun/sample.git"
    },
    "user": {
        "id": 26076637,
        "name": "Varun Kolanu",
        "username": "kolanuvarun739",
        "avatar_url": "https://secure.gravatar.com/avatar/dde05c11435528ac083e918ce384c5b943c7ec54be520b7f4a4bcd3863b36060?s=80&d=identicon",
        "email": "[REDACTED]"
    },
    "user_url": "https://gitlab.com/kolanuvarun739",
    "object_attributes": {
        "id": 2073324,
        "name": "sample-feature-flag",
        "description": "",
        "active": true
    }
}
```

--------------------------------------------------------------------------------

---[FILE: feature_flag_hook__deactivated.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/feature_flag_hook__deactivated.json

```json
{
    "object_kind": "feature_flag",
    "project": {
        "id": 68452408,
        "name": "sample",
        "description": null,
        "web_url": "https://gitlab.com/kolanuvarun/sample",
        "avatar_url": null,
        "git_ssh_url": "git@gitlab.com:kolanuvarun/sample.git",
        "git_http_url": "https://gitlab.com/kolanuvarun/sample.git",
        "namespace": "kolanuvarun",
        "visibility_level": 0,
        "path_with_namespace": "kolanuvarun/sample",
        "default_branch": "master",
        "ci_config_path": "",
        "homepage": "https://gitlab.com/kolanuvarun/sample",
        "url": "git@gitlab.com:kolanuvarun/sample.git",
        "ssh_url": "git@gitlab.com:kolanuvarun/sample.git",
        "http_url": "https://gitlab.com/kolanuvarun/sample.git"
    },
    "user": {
        "id": 26076637,
        "name": "Varun Kolanu",
        "username": "kolanuvarun739",
        "avatar_url": "https://secure.gravatar.com/avatar/dde05c11435528ac083e918ce384c5b943c7ec54be520b7f4a4bcd3863b36060?s=80&d=identicon",
        "email": "[REDACTED]"
    },
    "user_url": "https://gitlab.com/kolanuvarun739",
    "object_attributes": {
        "id": 2073324,
        "name": "sample-feature-flag",
        "description": "",
        "active": false
    }
}
```

--------------------------------------------------------------------------------

---[FILE: issue_hook__confidential_issue_closed.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/issue_hook__confidential_issue_closed.json

```json
{
    "object_kind": "issue",
    "event_type": "confidential_issue",
    "user": {
      "name": "Joe Bloggs",
      "username": "joe.bloggs",
      "avatar_url": "https://secure.gravatar.com/avatar/ca4538511817d50e4c64a354537f1135?s=80&d=identicon"
    },
    "project": {
      "id": 5,
      "name": "testing",
      "description": "",
      "web_url": "https://gitlab.example.co.uk/joe.bloggs/testing",
      "avatar_url": null,
      "git_ssh_url": "ssh://git@gitlab.example.co.uk/joe.bloggs/testing.git",
      "git_http_url": "https://gitlab.example.co.uk/joe.bloggs/testing.git",
      "namespace": "joe.bloggs",
      "visibility_level": 0,
      "path_with_namespace": "joe.bloggs/testing",
      "default_branch": null,
      "ci_config_path": null,
      "homepage": "https://gitlab.example.co.uk/joe.bloggs/testing",
      "url": "ssh://git@gitlab.example.co.uk/joe.bloggs/testing.git",
      "ssh_url": "ssh://git@gitlab.example.co.uk/joe.bloggs/testing.git",
      "http_url": "https://gitlab.example.co.uk/joe.bloggs/testing.git"
    },
    "object_attributes": {
      "author_id": 2,
      "closed_at": "2018-09-15 19:05:12 UTC",
      "confidential": true,
      "created_at": "2018-09-14 17:48:36 UTC",
      "description": "Testing Test",
      "due_date": null,
      "id": 1,
      "iid": 1,
      "last_edited_at": "2018-09-15 19:04:31 UTC",
      "last_edited_by_id": 2,
      "milestone_id": null,
      "moved_to_id": null,
      "project_id": 5,
      "relative_position": 1073742323,
      "state": "closed",
      "time_estimate": 0,
      "title": "Testing Test",
      "updated_at": "2018-09-15 19:05:12 UTC",
      "updated_by_id": 2,
      "url": "https://gitlab.example.co.uk/joe.bloggs/testing/issues/1",
      "total_time_spent": 0,
      "human_total_time_spent": null,
      "human_time_estimate": null,
      "assignee_ids": [],
      "assignee_id": null,
      "action": "close"
    },
    "labels": [],
    "changes": {
      "updated_at": {
        "previous": "2018-09-15 19:05:12 UTC",
        "current": "2018-09-15 19:05:12 UTC"
      },
      "total_time_spent": {
        "previous": null,
        "current": 0
      }
    },
    "repository": {
      "name": "testing",
      "url": "ssh://git@gitlab.example.co.uk/joe.bloggs/testing.git",
      "description": "",
      "homepage": "https://gitlab.example.co.uk/joe.bloggs/testing"
    }
  }
```

--------------------------------------------------------------------------------

---[FILE: issue_hook__confidential_issue_created_without_assignee.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/issue_hook__confidential_issue_created_without_assignee.json

```json
{
    "object_kind": "issue",
    "event_type": "confidential_issue",
    "user": {
      "name": "Joe Bloggs",
      "username": "joe.bloggs",
      "avatar_url": "https://secure.gravatar.com/avatar/ca4538511817d50e4c64a354537f1135?s=80&d=identicon"
    },
    "project": {
      "id": 5,
      "name": "testing",
      "description": "",
      "web_url": "https://gitlab.example.co.uk/joe.bloggs/testing",
      "avatar_url": null,
      "git_ssh_url": "ssh://git@gitlab.example.co.uk/joe.bloggs/testing.git",
      "git_http_url": "https://gitlab.example.co.uk/joe.bloggs/testing.git",
      "namespace": "joe.bloggs",
      "visibility_level": 0,
      "path_with_namespace": "joe.bloggs/testing",
      "default_branch": null,
      "ci_config_path": null,
      "homepage": "https://gitlab.example.co.uk/joe.bloggs/testing",
      "url": "ssh://git@gitlab.example.co.uk/joe.bloggs/testing.git",
      "ssh_url": "ssh://git@gitlab.example.co.uk/joe.bloggs/testing.git",
      "http_url": "https://gitlab.example.co.uk/joe.bloggs/testing.git"
    },
    "object_attributes": {
      "author_id": 2,
      "closed_at": null,
      "confidential": true,
      "created_at": "2018-09-14 17:48:36 UTC",
      "description": "Testing",
      "due_date": null,
      "id": 1,
      "iid": 1,
      "last_edited_at": null,
      "last_edited_by_id": null,
      "milestone_id": null,
      "moved_to_id": null,
      "project_id": 5,
      "relative_position": 1073742323,
      "state": "opened",
      "time_estimate": 0,
      "title": "Testing",
      "updated_at": "2018-09-14 17:48:36 UTC",
      "updated_by_id": null,
      "url": "https://gitlab.example.co.uk/joe.bloggs/testing/issues/1",
      "total_time_spent": 0,
      "human_total_time_spent": null,
      "human_time_estimate": null,
      "assignee_ids": [],
      "assignee_id": null,
      "action": "open"
    },
    "labels": [],
    "changes": {
      "total_time_spent": {
        "previous": null,
        "current": 0
      }
    },
    "repository": {
      "name": "testing",
      "url": "ssh://git@gitlab.example.co.uk/joe.bloggs/testing.git",
      "description": "",
      "homepage": "https://gitlab.example.co.uk/joe.bloggs/testing"
    }
  }
```

--------------------------------------------------------------------------------

---[FILE: issue_hook__confidential_issue_created_with_assignee.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/issue_hook__confidential_issue_created_with_assignee.json

```json
{
    "object_kind": "issue",
    "event_type": "confidential_issue",
    "user": {
      "name": "Joe Bloggs",
      "username": "joe.bloggs",
      "avatar_url": "https://secure.gravatar.com/avatar/ca4538511817d50e4c64a354537f1135?s=80&d=identicon"
    },
    "project": {
      "id": 5,
      "name": "testing",
      "description": "",
      "web_url": "https://gitlab.example.co.uk/joe.bloggs/testing",
      "avatar_url": null,
      "git_ssh_url": "ssh://git@gitlab.example.co.uk/joe.bloggs/testing.git",
      "git_http_url": "https://gitlab.example.co.uk/joe.bloggs/testing.git",
      "namespace": "joe.bloggs",
      "visibility_level": 0,
      "path_with_namespace": "joe.bloggs/testing",
      "default_branch": null,
      "ci_config_path": null,
      "homepage": "https://gitlab.example.co.uk/joe.bloggs/testing",
      "url": "ssh://git@gitlab.example.co.uk/joe.bloggs/testing.git",
      "ssh_url": "ssh://git@gitlab.example.co.uk/joe.bloggs/testing.git",
      "http_url": "https://gitlab.example.co.uk/joe.bloggs/testing.git"
    },
    "object_attributes": {
      "author_id": 2,
      "closed_at": null,
      "confidential": true,
      "created_at": "2018-09-15 19:33:44 UTC",
      "description": "Testing",
      "due_date": null,
      "id": 2,
      "iid": 2,
      "last_edited_at": null,
      "last_edited_by_id": null,
      "milestone_id": null,
      "moved_to_id": null,
      "project_id": 5,
      "relative_position": 1073742823,
      "state": "opened",
      "time_estimate": 0,
      "title": "Testing",
      "updated_at": "2018-09-15 19:33:44 UTC",
      "updated_by_id": null,
      "url": "https://gitlab.example.co.uk/joe.bloggs/testing/issues/2",
      "total_time_spent": 0,
      "human_total_time_spent": null,
      "human_time_estimate": null,
      "assignee_ids": [
        2
      ],
      "assignee_id": 2,
      "action": "open"
    },
    "labels": [],
    "changes": {
      "assignees": {
        "previous": [],
        "current": [
          {
            "name": "Joe Bloggs",
            "username": "joe.bloggs",
            "avatar_url": "https://secure.gravatar.com/avatar/ca4538511817d50e4c64a354537f1135?s=80&d=identicon"
          }
        ]
      },
      "total_time_spent": {
        "previous": null,
        "current": 0
      }
    },
    "repository": {
      "name": "testing",
      "url": "ssh://git@gitlab.example.co.uk/joe.bloggs/testing.git",
      "description": "",
      "homepage": "https://gitlab.example.co.uk/joe.bloggs/testing"
    },
    "assignees": [
      {
        "name": "Joe Bloggs",
        "username": "joe.bloggs",
        "avatar_url": "https://secure.gravatar.com/avatar/ca4538511817d50e4c64a354537f1135?s=80&d=identicon"
      }
    ]
  }
```

--------------------------------------------------------------------------------

---[FILE: issue_hook__confidential_issue_created_with_hidden_comment_in_description.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/issue_hook__confidential_issue_created_with_hidden_comment_in_description.json

```json
{
    "object_kind": "issue",
    "event_type": "confidential_issue",
    "user": {
      "name": "Joe Bloggs",
      "username": "joe.bloggs",
      "avatar_url": "https://secure.gravatar.com/avatar/ca4538511817d50e4c64a354537f1135?s=80&d=identicon"
    },
    "project": {
      "id": 5,
      "name": "testing",
      "description": "",
      "web_url": "https://gitlab.example.co.uk/joe.bloggs/testing",
      "avatar_url": null,
      "git_ssh_url": "ssh://git@gitlab.example.co.uk/joe.bloggs/testing.git",
      "git_http_url": "https://gitlab.example.co.uk/joe.bloggs/testing.git",
      "namespace": "joe.bloggs",
      "visibility_level": 0,
      "path_with_namespace": "joe.bloggs/testing",
      "default_branch": null,
      "ci_config_path": null,
      "homepage": "https://gitlab.example.co.uk/joe.bloggs/testing",
      "url": "ssh://git@gitlab.example.co.uk/joe.bloggs/testing.git",
      "ssh_url": "ssh://git@gitlab.example.co.uk/joe.bloggs/testing.git",
      "http_url": "https://gitlab.example.co.uk/joe.bloggs/testing.git"
    },
    "object_attributes": {
      "author_id": 2,
      "closed_at": null,
      "confidential": true,
      "created_at": "2018-09-14 17:48:36 UTC",
      "description": "This description actually has a hidden comment in it!\n\n<!-- This is\na multiline\ncomment -->\n\n<!-- one line comment -->\n\n<!--\nanother\nmultiline\ncomment\n-->",
      "due_date": null,
      "id": 1,
      "iid": 1,
      "last_edited_at": null,
      "last_edited_by_id": null,
      "milestone_id": null,
      "moved_to_id": null,
      "project_id": 5,
      "relative_position": 1073742323,
      "state": "opened",
      "time_estimate": 0,
      "title": "Testing",
      "updated_at": "2018-09-14 17:48:36 UTC",
      "updated_by_id": null,
      "url": "https://gitlab.example.co.uk/joe.bloggs/testing/issues/1",
      "total_time_spent": 0,
      "human_total_time_spent": null,
      "human_time_estimate": null,
      "assignee_ids": [],
      "assignee_id": null,
      "action": "open"
    },
    "labels": [],
    "changes": {
      "total_time_spent": {
        "previous": null,
        "current": 0
      }
    },
    "repository": {
      "name": "testing",
      "url": "ssh://git@gitlab.example.co.uk/joe.bloggs/testing.git",
      "description": "",
      "homepage": "https://gitlab.example.co.uk/joe.bloggs/testing"
    }
  }
```

--------------------------------------------------------------------------------

---[FILE: issue_hook__confidential_issue_reopened.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/issue_hook__confidential_issue_reopened.json

```json
{
    "object_kind": "issue",
    "event_type": "confidential_issue",
    "user": {
      "name": "Joe Bloggs",
      "username": "joe.bloggs",
      "avatar_url": "https://secure.gravatar.com/avatar/ca4538511817d50e4c64a354537f1135?s=80&d=identicon"
    },
    "project": {
      "id": 5,
      "name": "testing",
      "description": "",
      "web_url": "https://gitlab.example.co.uk/joe.bloggs/testing",
      "avatar_url": null,
      "git_ssh_url": "ssh://git@gitlab.example.co.uk/joe.bloggs/testing.git",
      "git_http_url": "https://gitlab.example.co.uk/joe.bloggs/testing.git",
      "namespace": "joe.bloggs",
      "visibility_level": 0,
      "path_with_namespace": "joe.bloggs/testing",
      "default_branch": null,
      "ci_config_path": null,
      "homepage": "https://gitlab.example.co.uk/joe.bloggs/testing",
      "url": "ssh://git@gitlab.example.co.uk/joe.bloggs/testing.git",
      "ssh_url": "ssh://git@gitlab.example.co.uk/joe.bloggs/testing.git",
      "http_url": "https://gitlab.example.co.uk/joe.bloggs/testing.git"
    },
    "object_attributes": {
      "author_id": 2,
      "closed_at": null,
      "confidential": true,
      "created_at": "2018-09-14 17:48:36 UTC",
      "description": "Testing Test",
      "due_date": null,
      "id": 1,
      "iid": 1,
      "last_edited_at": "2018-09-15 19:04:31 UTC",
      "last_edited_by_id": 2,
      "milestone_id": null,
      "moved_to_id": null,
      "project_id": 5,
      "relative_position": 1073742323,
      "state": "opened",
      "time_estimate": 0,
      "title": "Testing Test",
      "updated_at": "2018-09-15 19:05:15 UTC",
      "updated_by_id": 2,
      "url": "https://gitlab.example.co.uk/joe.bloggs/testing/issues/1",
      "total_time_spent": 0,
      "human_total_time_spent": null,
      "human_time_estimate": null,
      "assignee_ids": [],
      "assignee_id": null,
      "action": "reopen"
    },
    "labels": [],
    "changes": {
      "closed_at": {
        "previous": "2018-09-15 19:05:12 UTC",
        "current": null
      },
      "state": {
        "previous": "closed",
        "current": "opened"
      },
      "updated_at": {
        "previous": "2018-09-15 19:05:12 UTC",
        "current": "2018-09-15 19:05:15 UTC"
      },
      "total_time_spent": {
        "previous": null,
        "current": 0
      }
    },
    "repository": {
      "name": "testing",
      "url": "ssh://git@gitlab.example.co.uk/joe.bloggs/testing.git",
      "description": "",
      "homepage": "https://gitlab.example.co.uk/joe.bloggs/testing"
    }
  }
```

--------------------------------------------------------------------------------

---[FILE: issue_hook__confidential_issue_updated.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/issue_hook__confidential_issue_updated.json

```json
{
    "object_kind": "issue",
    "event_type": "confidential_issue",
    "user": {
      "name": "Joe Bloggs",
      "username": "joe.bloggs",
      "avatar_url": "https://secure.gravatar.com/avatar/ca4538511817d50e4c64a354537f1135?s=80&d=identicon"
    },
    "project": {
      "id": 5,
      "name": "testing",
      "description": "",
      "web_url": "https://gitlab.example.co.uk/joe.bloggs/testing",
      "avatar_url": null,
      "git_ssh_url": "ssh://git@gitlab.example.co.uk:1999/joe.bloggs/testing.git",
      "git_http_url": "https://gitlab.example.co.uk/joe.bloggs/testing.git",
      "namespace": "joe.bloggs",
      "visibility_level": 0,
      "path_with_namespace": "joe.bloggs/testing",
      "default_branch": null,
      "ci_config_path": null,
      "homepage": "https://gitlab.example.co.uk/joe.bloggs/testing",
      "url": "ssh://git@gitlab.example.co.uk:1999/joe.bloggs/testing.git",
      "ssh_url": "ssh://git@gitlab.example.co.uk:1999/joe.bloggs/testing.git",
      "http_url": "https://gitlab.example.co.uk/joe.bloggs/testing.git"
    },
    "object_attributes": {
      "author_id": 2,
      "closed_at": null,
      "confidential": true,
      "created_at": "2018-09-14 17:48:36 UTC",
      "description": "Testing",
      "due_date": null,
      "id": 1,
      "iid": 1,
      "last_edited_at": "2018-09-15 19:08:43 UTC",
      "last_edited_by_id": 2,
      "milestone_id": null,
      "moved_to_id": null,
      "project_id": 5,
      "relative_position": 1073742323,
      "state": "opened",
      "time_estimate": 0,
      "title": "Testing",
      "updated_at": "2018-09-15 19:08:43 UTC",
      "updated_by_id": 2,
      "url": "https://gitlab.example.co.uk/joe.bloggs/testing/issues/1",
      "total_time_spent": 0,
      "human_total_time_spent": null,
      "human_time_estimate": null,
      "assignee_ids": [],
      "assignee_id": null,
      "action": "update"
    },
    "labels": [],
    "changes": {
      "description": {
        "previous": "Testing Test",
        "current": "Testing"
      },
      "last_edited_at": {
        "previous": "2018-09-15 19:04:31 UTC",
        "current": "2018-09-15 19:08:43 UTC"
      },
      "title": {
        "previous": "Testing Test",
        "current": "Testing"
      },
      "updated_at": {
        "previous": "2018-09-15 19:05:15 UTC",
        "current": "2018-09-15 19:08:43 UTC"
      }
    },
    "repository": {
      "name": "testing",
      "url": "ssh://git@gitlab.example.co.uk:1999/joe.bloggs/testing.git",
      "description": "",
      "homepage": "https://gitlab.example.co.uk/joe.bloggs/testing"
    }
  }
```

--------------------------------------------------------------------------------

---[FILE: issue_hook__issue_closed.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/issue_hook__issue_closed.json

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
      "updated_at":"2016-08-18 18:14:13 UTC",
      "position":0,
      "branch_name":null,
      "description":"Issue description",
      "milestone_id":null,
      "state":"closed",
      "iid":1,
      "updated_by_id":670043,
      "weight":3,
      "confidential":false,
      "moved_to_id":null,
      "deleted_at":null,
      "due_date":"2016-08-01",
      "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/issues/1",
      "action":"close"
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

---[FILE: issue_hook__issue_created_without_assignee.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/issue_hook__issue_created_without_assignee.json

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
      "title":"Issue title",
      "assignee_id":670043,
      "author_id":670043,
      "project_id":1534233,
      "created_at":"2016-08-18 17:47:36 UTC",
      "updated_at":"2016-08-18 17:47:36 UTC",
      "position":0,
      "branch_name":null,
      "description":"Issue description",
      "milestone_id":null,
      "state":"opened",
      "iid":1,
      "updated_by_id":null,
      "weight":3,
      "confidential":false,
      "moved_to_id":null,
      "deleted_at":null,
      "due_date":"2016-08-01",
      "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/issues/1",
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

---[FILE: issue_hook__issue_created_with_assignee.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/issue_hook__issue_created_with_assignee.json

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
      "title":"Issue title",
      "assignee_id":670043,
      "author_id":670043,
      "project_id":1534233,
      "created_at":"2016-08-18 17:47:36 UTC",
      "updated_at":"2016-08-18 17:47:36 UTC",
      "position":0,
      "branch_name":null,
      "description":"Issue description",
      "milestone_id":null,
      "state":"opened",
      "iid":1,
      "updated_by_id":null,
      "weight":3,
      "confidential":false,
      "moved_to_id":null,
      "deleted_at":null,
      "due_date":"2016-08-01",
      "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/issues/1",
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

---[FILE: issue_hook__issue_created_with_hidden_comment_in_description.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/issue_hook__issue_created_with_hidden_comment_in_description.json

```json
{
    "object_kind": "issue",
    "user": {
        "name": "Eeshan Garg",
        "username": "eeshangarg",
        "avatar_url": "https://secure.gravatar.com/avatar/cd181af88d928dab53c55600c9f7551d?s=80&d=identicon"
    },
    "project": {
        "id": 3319013,
        "name": "public-repo",
        "description": null,
        "web_url": "https://gitlab.com/eeshangarg/public-repo",
        "avatar_url": null,
        "git_ssh_url": "git@gitlab.com:eeshangarg/public-repo.git",
        "git_http_url": "https://gitlab.com/eeshangarg/public-repo.git",
        "namespace": "eeshangarg",
        "visibility_level": 0,
        "path_with_namespace": "eeshangarg/public-repo",
        "default_branch": "changes",
        "ci_config_path": null,
        "homepage": "https://gitlab.com/eeshangarg/public-repo",
        "url": "git@gitlab.com:eeshangarg/public-repo.git",
        "ssh_url": "git@gitlab.com:eeshangarg/public-repo.git",
        "http_url": "https://gitlab.com/eeshangarg/public-repo.git"
    },
    "object_attributes": {
        "author_id": 1129123,
        "closed_at": null,
        "confidential": false,
        "created_at": "2018-01-24 00:47:44 UTC",
        "description": "This description actually has a hidden comment in it!\n\n<!-- This is\na multiline\ncomment -->\n\n<!-- one line comment -->\n\n<!--\nanother\nmultiline\ncomment\n-->",
        "due_date": null,
        "id": 8816601,
        "iid": 3,
        "last_edited_at": null,
        "last_edited_by_id": null,
        "milestone_id": null,
        "moved_to_id": null,
        "project_id": 3319013,
        "relative_position": 1073743323,
        "state": "opened",
        "time_estimate": 0,
        "title": "New Issue with hidden comment",
        "updated_at": "2018-01-24 00:47:44 UTC",
        "updated_by_id": null,
        "url": "https://gitlab.com/eeshangarg/public-repo/issues/3",
        "total_time_spent": 0,
        "human_total_time_spent": null,
        "human_time_estimate": null,
        "assignee_ids": [],
        "assignee_id": null,
        "action": "open"
    },
    "labels": [],
    "changes": {
        "total_time_spent": {
            "previous": null,
            "current": 0
        }
    },
    "repository": {
        "name": "public-repo",
        "url": "git@gitlab.com:eeshangarg/public-repo.git",
        "description": null,
        "homepage": "https://gitlab.com/eeshangarg/public-repo"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: issue_hook__issue_created_with_three_assignees.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/issue_hook__issue_created_with_three_assignees.json

```json
{
    "object_kind": "issue",
    "event_type": "issue",
    "user": {
      "name": "Adam Birds",
      "username": "adambirds",
      "avatar_url": "https://secure.gravatar.com/avatar/1e00d93acdfdddc06304143a1dfcd0b4?s=80&d=identicon"
    },
    "project": {
      "id": 8427506,
      "name": "Zulip GitLab Test",
      "description": "",
      "web_url": "https://gitlab.com/adambirds/zulip-gitlab-test",
      "avatar_url": null,
      "git_ssh_url": "git@gitlab.com:adambirds/zulip-gitlab-test.git",
      "git_http_url": "https://gitlab.com/adambirds/zulip-gitlab-test.git",
      "namespace": "adambirds",
      "visibility_level": 20,
      "path_with_namespace": "adambirds/zulip-gitlab-test",
      "default_branch": null,
      "ci_config_path": null,
      "homepage": "https://gitlab.com/adambirds/zulip-gitlab-test",
      "url": "git@gitlab.com:adambirds/zulip-gitlab-test.git",
      "ssh_url": "git@gitlab.com:adambirds/zulip-gitlab-test.git",
      "http_url": "https://gitlab.com/adambirds/zulip-gitlab-test.git"
    },
    "object_attributes": {
      "author_id": 1102929,
      "closed_at": null,
      "confidential": false,
      "created_at": "2018-09-17 21:01:30 UTC",
      "description": "Zulip Test Issue 2",
      "due_date": null,
      "id": 14226169,
      "iid": 2,
      "last_edited_at": null,
      "last_edited_by_id": null,
      "milestone_id": null,
      "moved_to_id": null,
      "project_id": 8427506,
      "relative_position": 1073742823,
      "state": "opened",
      "time_estimate": 0,
      "title": "Zulip Test Issue 2",
      "updated_at": "2018-09-17 21:01:30 UTC",
      "updated_by_id": null,
      "weight": null,
      "url": "https://gitlab.com/adambirds/zulip-gitlab-test/issues/2",
      "total_time_spent": 0,
      "human_total_time_spent": null,
      "human_time_estimate": null,
      "assignee_ids": [
        1102929,
        1129123
      ],
      "assignee_id": 1102929,
      "action": "open"
    },
    "labels": [],
    "changes": {
      "author_id": {
        "previous": null,
        "current": 1102929
      },
      "created_at": {
        "previous": null,
        "current": "2018-09-17 21:01:30 UTC"
      },
      "description": {
        "previous": null,
        "current": "Zulip Test Issue 2"
      },
      "id": {
        "previous": null,
        "current": 14226169
      },
      "iid": {
        "previous": null,
        "current": 2
      },
      "project_id": {
        "previous": null,
        "current": 8427506
      },
      "relative_position": {
        "previous": null,
        "current": 1073742823
      },
      "state": {
        "previous": null,
        "current": "opened"
      },
      "title": {
        "previous": null,
        "current": "Zulip Test Issue 2"
      },
      "updated_at": {
        "previous": null,
        "current": "2018-09-17 21:01:30 UTC"
      },
      "assignees": {
        "previous": [],
        "current": [
          {
            "name": "Adam Birds",
            "username": "adambirds",
            "avatar_url": "https://secure.gravatar.com/avatar/1e00d93acdfdddc06304143a1dfcd0b4?s=80&d=identicon"
          },
          {
            "name": "Eeshan Garg",
            "username": "eeshangarg",
            "avatar_url": "https://secure.gravatar.com/avatar/cd181af88d928dab53c55600c9f7551d?s=80&d=identicon"
          },
          {
            "name": "Tim Abbott",
            "username": "timabbott",
            "avatar_url": "https://secure.gravatar.com/avatar/cd181af88d928dab53c55600c9f7551d?s=80&d=identicon"
          }
        ]
      },
      "total_time_spent": {
        "previous": null,
        "current": 0
      }
    },
    "repository": {
      "name": "Zulip GitLab Test",
      "url": "git@gitlab.com:adambirds/zulip-gitlab-test.git",
      "description": "",
      "homepage": "https://gitlab.com/adambirds/zulip-gitlab-test"
    },
    "assignees": [
      {
        "name": "Adam Birds",
        "username": "adambirds",
        "avatar_url": "https://secure.gravatar.com/avatar/1e00d93acdfdddc06304143a1dfcd0b4?s=80&d=identicon"
      },
      {
        "name": "Eeshan Garg",
        "username": "eeshangarg",
        "avatar_url": "https://secure.gravatar.com/avatar/cd181af88d928dab53c55600c9f7551d?s=80&d=identicon"
      },
      {
        "name": "Tim Abbott",
        "username": "timabbott",
        "avatar_url": "https://secure.gravatar.com/avatar/cd181af88d928dab53c55600c9f7551d?s=80&d=identicon"
      }
    ]
  }
```

--------------------------------------------------------------------------------

---[FILE: issue_hook__issue_created_with_two_assignees.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/issue_hook__issue_created_with_two_assignees.json

```json
{
    "object_kind": "issue",
    "event_type": "issue",
    "user": {
      "name": "Adam Birds",
      "username": "adambirds",
      "avatar_url": "https://secure.gravatar.com/avatar/1e00d93acdfdddc06304143a1dfcd0b4?s=80&d=identicon"
    },
    "project": {
      "id": 8427506,
      "name": "Zulip GitLab Test",
      "description": "",
      "web_url": "https://gitlab.com/adambirds/zulip-gitlab-test",
      "avatar_url": null,
      "git_ssh_url": "git@gitlab.com:adambirds/zulip-gitlab-test.git",
      "git_http_url": "https://gitlab.com/adambirds/zulip-gitlab-test.git",
      "namespace": "adambirds",
      "visibility_level": 20,
      "path_with_namespace": "adambirds/zulip-gitlab-test",
      "default_branch": null,
      "ci_config_path": null,
      "homepage": "https://gitlab.com/adambirds/zulip-gitlab-test",
      "url": "git@gitlab.com:adambirds/zulip-gitlab-test.git",
      "ssh_url": "git@gitlab.com:adambirds/zulip-gitlab-test.git",
      "http_url": "https://gitlab.com/adambirds/zulip-gitlab-test.git"
    },
    "object_attributes": {
      "author_id": 1102929,
      "closed_at": null,
      "confidential": false,
      "created_at": "2018-09-17 21:01:30 UTC",
      "description": "Zulip Test Issue 2",
      "due_date": null,
      "id": 14226169,
      "iid": 2,
      "last_edited_at": null,
      "last_edited_by_id": null,
      "milestone_id": null,
      "moved_to_id": null,
      "project_id": 8427506,
      "relative_position": 1073742823,
      "state": "opened",
      "time_estimate": 0,
      "title": "Zulip Test Issue 2",
      "updated_at": "2018-09-17 21:01:30 UTC",
      "updated_by_id": null,
      "weight": null,
      "url": "https://gitlab.com/adambirds/zulip-gitlab-test/issues/2",
      "total_time_spent": 0,
      "human_total_time_spent": null,
      "human_time_estimate": null,
      "assignee_ids": [
        1102929,
        1129123
      ],
      "assignee_id": 1102929,
      "action": "open"
    },
    "labels": [],
    "changes": {
      "author_id": {
        "previous": null,
        "current": 1102929
      },
      "created_at": {
        "previous": null,
        "current": "2018-09-17 21:01:30 UTC"
      },
      "description": {
        "previous": null,
        "current": "Zulip Test Issue 2"
      },
      "id": {
        "previous": null,
        "current": 14226169
      },
      "iid": {
        "previous": null,
        "current": 2
      },
      "project_id": {
        "previous": null,
        "current": 8427506
      },
      "relative_position": {
        "previous": null,
        "current": 1073742823
      },
      "state": {
        "previous": null,
        "current": "opened"
      },
      "title": {
        "previous": null,
        "current": "Zulip Test Issue 2"
      },
      "updated_at": {
        "previous": null,
        "current": "2018-09-17 21:01:30 UTC"
      },
      "assignees": {
        "previous": [],
        "current": [
          {
            "name": "Adam Birds",
            "username": "adambirds",
            "avatar_url": "https://secure.gravatar.com/avatar/1e00d93acdfdddc06304143a1dfcd0b4?s=80&d=identicon"
          },
          {
            "name": "Eeshan Garg",
            "username": "eeshangarg",
            "avatar_url": "https://secure.gravatar.com/avatar/cd181af88d928dab53c55600c9f7551d?s=80&d=identicon"
          }
        ]
      },
      "total_time_spent": {
        "previous": null,
        "current": 0
      }
    },
    "repository": {
      "name": "Zulip GitLab Test",
      "url": "git@gitlab.com:adambirds/zulip-gitlab-test.git",
      "description": "",
      "homepage": "https://gitlab.com/adambirds/zulip-gitlab-test"
    },
    "assignees": [
      {
        "name": "Adam Birds",
        "username": "adambirds",
        "avatar_url": "https://secure.gravatar.com/avatar/1e00d93acdfdddc06304143a1dfcd0b4?s=80&d=identicon"
      },
      {
        "name": "Eeshan Garg",
        "username": "eeshangarg",
        "avatar_url": "https://secure.gravatar.com/avatar/cd181af88d928dab53c55600c9f7551d?s=80&d=identicon"
      }
    ]
  }
```

--------------------------------------------------------------------------------

---[FILE: issue_hook__issue_opened_with_null_description.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/issue_hook__issue_opened_with_null_description.json

```json
{
    "object_kind":"issue",
    "user":{
        "name":"Eeshan Garg",
        "username":"eeshangarg",
        "avatar_url":"https://secure.gravatar.com/avatar/cd181af88d928dab53c55600c9f7551d?s=80\u0026d=identicon"
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
        "author_id":1129123,
        "closed_at":null,
        "confidential":false,
        "created_at":"2018-03-23 17:35:53 UTC",
        "description":null,
        "due_date":null,
        "id":9892394,
        "iid":7,
        "last_edited_at":null,
        "last_edited_by_id":null,
        "milestone_id":null,
        "moved_to_id":null,
        "project_id":3319043,
        "relative_position":1073745323,
        "state":"opened",
        "time_estimate":0,
        "title":"Issue without description",
        "updated_at":"2018-03-23 17:35:53 UTC",
        "updated_by_id":null,
        "url":"https://gitlab.com/eeshangarg/my-awesome-project/issues/7",
        "total_time_spent":0,
        "human_total_time_spent":null,
        "human_time_estimate":null,
        "assignee_ids":[

        ],
        "assignee_id":null,
        "action":"open"
    },
    "labels":[

    ],
    "changes":{
        "total_time_spent":{
            "previous":null,
            "current":0
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

````
