---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1203
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1203 of 1290)

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

---[FILE: note_hook__design_note.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/note_hook__design_note.json

```json
{
    "object_kind": "note",
    "event_type": "note",
    "user": {
        "id": 14613894,
        "name": "Satyam Bansal",
        "username": "sbansal1999",
        "avatar_url": "https://gitlab.com/uploads/-/system/user/avatar/14613894/avatar.png",
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
        "change_position": {
            "base_sha": null,
            "start_sha": null,
            "head_sha": null,
            "old_path": null,
            "new_path": null,
            "position_type": "text",
            "old_line": null,
            "new_line": null,
            "line_range": null
        },
        "commit_id": null,
        "created_at": "2023-07-05 16:38:53 UTC",
        "discussion_id": "90c3bd62a51e132229eb2433a42af0707c1b7091",
        "id": 1458583152,
        "line_code": null,
        "note": "hello",
        "noteable_id": 601586,
        "noteable_type": "DesignManagement::Design",
        "original_position": {
            "base_sha": "0000000000000000000000000000000000000000",
            "start_sha": "0000000000000000000000000000000000000000",
            "head_sha": "3e8137cae02e78675cd220ae1dd2ced26feba62f",
            "old_path": null,
            "new_path": "designs/issue-1/Screenshot.png",
            "position_type": "image",
            "width": 740,
            "height": 499,
            "x": 413,
            "y": 315
        },
        "position": {
            "base_sha": "0000000000000000000000000000000000000000",
            "start_sha": "0000000000000000000000000000000000000000",
            "head_sha": "3e8137cae02e78675cd220ae1dd2ced26feba62f",
            "old_path": null,
            "new_path": "designs/issue-1/Screenshot.png",
            "position_type": "image",
            "width": 740,
            "height": 499,
            "x": 413,
            "y": 315
        },
        "project_id": 46186758,
        "resolved_at": null,
        "resolved_by_id": null,
        "resolved_by_push": null,
        "st_diff": null,
        "system": false,
        "type": "DiffNote",
        "updated_at": "2023-07-05 16:38:53 UTC",
        "updated_by_id": null,
        "description": "hello",
        "url": null
    },
    "repository": {
        "name": "testing-zulip-gitlab-integration",
        "url": "git@gitlab.com:sbansal1999/testing-zulip-gitlab-integration.git",
        "description": null,
        "homepage": "https://gitlab.com/sbansal1999/testing-zulip-gitlab-integration"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: note_hook__issue_note.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/note_hook__issue_note.json

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
    "commit_id": null,
    "created_at": "2023-05-25 18:41:09 UTC",
    "discussion_id": "d85e085fd1fbf70a166d9aebd27933112a25a072",
    "id": 1406279810,
    "line_code": null,
    "note": "This is again a random comment.",
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
    "updated_at": "2023-05-25 18:41:09 UTC",
    "updated_by_id": null,
    "description": "This is again a random comment.",
    "url": "https://gitlab.com/sbansal1999/testing-zulip-gitlab-integration/-/issues/1#note_1406279810"
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
    "updated_at": "2023-05-25 18:41:09 UTC",
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

---[FILE: note_hook__merge_request_note.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/note_hook__merge_request_note.json

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
      "commit_id": null,
      "created_at": "2023-05-25 19:04:19 UTC",
      "discussion_id": "547c7f02ebb7bbdef59e006756cc5b4a09de710a",
      "id": 1406328457,
      "line_code": null,
      "note": "I am not sure if this new feature is even required or not.",
      "noteable_id": 226323715,
      "noteable_type": "MergeRequest",
      "original_position": null,
      "position": null,
      "project_id": 46186758,
      "resolved_at": null,
      "resolved_by_id": null,
      "resolved_by_push": null,
      "st_diff": null,
      "system": false,
      "type": null,
      "updated_at": "2023-05-25 19:04:19 UTC",
      "updated_by_id": null,
      "description": "I am not sure if this new feature is even required or not.",
      "url": "https://gitlab.com/sbansal1999/testing-zulip-gitlab-integration/-/merge_requests/1#note_1406328457"
   },
   "repository": {
      "name": "testing-zulip-gitlab-integration",
      "url": "git@gitlab.com:sbansal1999/testing-zulip-gitlab-integration.git",
      "description": null,
      "homepage": "https://gitlab.com/sbansal1999/testing-zulip-gitlab-integration"
   },
   "merge_request": {
      "assignee_id": null,
      "author_id": 14613894,
      "created_at": "2023-05-25 19:03:52 UTC",
      "description": "",
      "head_pipeline_id": null,
      "id": 226323715,
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
      "source_branch": "feature",
      "source_project_id": 46186758,
      "state_id": 1,
      "target_branch": "main",
      "target_project_id": 46186758,
      "time_estimate": 0,
      "title": "add new-feature",
      "updated_at": "2023-05-25 19:03:53 UTC",
      "updated_by_id": null,
      "url": "https://gitlab.com/sbansal1999/testing-zulip-gitlab-integration/-/merge_requests/1",
      "source": {
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
      "target": {
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
      "last_commit": {
         "id": "b7d5e68a840f73be14f580e88bc8e37181805f64",
         "message": "add new-feature\n",
         "title": "add new-feature",
         "timestamp": "2023-05-26T00:32:24+05:30",
         "url": "https://gitlab.com/sbansal1999/testing-zulip-gitlab-integration/-/commit/b7d5e68a840f73be14f580e88bc8e37181805f64",
         "author": {
            "name": "Satyam Bansal",
            "email": "sbansal1999@gmail.com"
         }
      },
      "work_in_progress": false,
      "total_time_spent": 0,
      "time_change": 0,
      "human_total_time_spent": null,
      "human_time_change": null,
      "human_time_estimate": null,
      "assignee_ids": [],
      "reviewer_ids": [],
      "labels": [],
      "state": "opened",
      "blocking_discussions_resolved": true,
      "first_contribution": true,
      "detailed_merge_status": "mergeable"
   }
}
```

--------------------------------------------------------------------------------

---[FILE: note_hook__snippet_note.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/note_hook__snippet_note.json

```json
{
  "object_kind": "note",
  "event_type": "note",
  "user": {
    "id": 14613894,
    "name": "Satyam Bansal",
    "username": "sbansal1999",
    "avatar_url": "https://gitlab.com/uploads/-/system/user/avatar/14613894/avatar.png",
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
    "created_at": "2023-06-08 19:25:03 UTC",
    "discussion_id": "d3348140b5483090551f0e4cce3a08f2faf041a3",
    "id": 1424268837,
    "line_code": null,
    "note": "some comment",
    "noteable_id": 2547713,
    "noteable_type": "Snippet",
    "original_position": null,
    "position": null,
    "project_id": 46186758,
    "resolved_at": null,
    "resolved_by_id": null,
    "resolved_by_push": null,
    "st_diff": null,
    "system": false,
    "type": null,
    "updated_at": "2023-06-08 19:25:03 UTC",
    "updated_by_id": null,
    "description": "some comment",
    "url": "https://gitlab.com/sbansal1999/testing-zulip-gitlab-integration/-/snippets/2547713#note_1424268837"
  },
  "repository": {
    "name": "testing-zulip-gitlab-integration",
    "url": "git@gitlab.com:sbansal1999/testing-zulip-gitlab-integration.git",
    "description": null,
    "homepage": "https://gitlab.com/sbansal1999/testing-zulip-gitlab-integration"
  },
  "snippet": {
    "id": 2547713,
    "title": "a very new new feature",
    "content": "a very new new feature\na very new new feature\na very new new feature\na very new new feature\na very new new feature",
    "author_id": 14613894,
    "project_id": 46186758,
    "created_at": "2023-05-25 19:13:05 UTC",
    "updated_at": "2023-06-08 19:25:03 UTC",
    "file_name": "",
    "type": "ProjectSnippet",
    "visibility_level": 0,
    "description": "",
    "encrypted_secret_token": null,
    "encrypted_secret_token_iv": null,
    "secret": false,
    "repository_read_only": false,
    "secret_token": null,
    "url": "https://gitlab.com/sbansal1999/testing-zulip-gitlab-integration/-/snippets/2547713"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: note_hook__snippet_note_old.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/note_hook__snippet_note_old.json

```json
{
    "object_kind": "note",
    "user": {
        "name": "Tomasz Kolek",
        "username": "tomaszkolek0",
        "avatar_url": "https://secure.gravatar.com/avatar/116a6fdbcfd00466297a39174da11fbb?s=80\u0026d=identicon"
    },
    "project_id": 1534233,
    "project": {
        "name": "my-awesome-project",
        "description": "",
        "web_url": "https://gitlab.com/tomaszkolek0/my-awesome-project",
        "avatar_url": null,
        "git_ssh_url": "git@gitlab.com:tomaszkolek0/my-awesome-project.git",
        "git_http_url": "https://gitlab.com/tomaszkolek0/my-awesome-project.git",
        "namespace": "tomaszkolek0",
        "visibility_level": 0,
        "path_with_namespace": "tomaszkolek0/my-awesome-project",
        "default_branch": "master",
        "homepage": "https://gitlab.com/tomaszkolek0/my-awesome-project",
        "url": "git@gitlab.com:tomaszkolek0/my-awesome-project.git",
        "ssh_url": "git@gitlab.com:tomaszkolek0/my-awesome-project.git",
        "http_url": "https://gitlab.com/tomaszkolek0/my-awesome-project.git"
    },
    "repository": {
        "name": "my-awesome-project",
        "url": "git@gitlab.com:tomaszkolek0/my-awesome-project.git",
        "description": "",
        "homepage": "https://gitlab.com/tomaszkolek0/my-awesome-project"
    },
    "object_attributes": {
        "id": 14172058,
        "note": "Nice snippet",
        "noteable_type": "Snippet",
        "author_id": 670043,
        "created_at": "2016-08-22 19:46:01 UTC",
        "updated_at": "2016-08-22 19:46:01 UTC",
        "project_id": 1534233,
        "attachment": null,
        "line_code": null,
        "commit_id": "",
        "noteable_id": 2788404,
        "system": false,
        "st_diff": null,
        "url": "https://gitlab.com/tomaszkolek0/my-awesome-project/snippets/2#note_14172058"
    },
    "snippet": {
        "id": 2,
        "title": "test",
        "content": "puts 'Hello world'",
        "author_id": 670043,
        "project_id": 1534233,
        "created_at": "2016-08-21 17:36:01 UTC",
        "updated_at": "2016-08-22 19:46:01 UTC",
        "file_name": "README.md",
        "expires_at": null,
        "type": "ProjectSnippet",
        "visibility_level": 0
    }
}
```

--------------------------------------------------------------------------------

---[FILE: pipeline_hook__pipeline_pending.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/pipeline_hook__pipeline_pending.json

```json
{
   "object_kind":"pipeline",
   "object_attributes":{
      "id":4414206,
      "ref":"master",
      "tag":false,
      "sha":"6f88e719ccde3804b1b669cef9dfb236a92fbbff",
      "before_sha":"6f88e719ccde3804b1b669cef9dfb236a92fbbff",
      "status":"pending",
      "stages":[
         "test"
      ],
      "created_at":"2016-09-28 20:04:55 UTC",
      "finished_at":null,
      "duration":null
   },
   "user":{
      "name":"Tomasz Kolek",
      "username":"TomaszKolek",
      "avatar_url":"https://secure.gravatar.com/avatar/c80a7a8454ed7d9e3c5618f1748385c2?s=80\u0026d=identicon"
   },
   "project":{
      "name":"my-awesome-project",
      "description":"abc",
      "web_url":"https://gitlab.com/TomaszKolek/my-awesome-project",
      "avatar_url":null,
      "git_ssh_url":"git@gitlab.com:TomaszKolek/my-awesome-project.git",
      "git_http_url":"https://gitlab.com/TomaszKolek/my-awesome-project.git",
      "namespace":"TomaszKolek",
      "visibility_level":20,
      "path_with_namespace":"TomaszKolek/my-awesome-project",
      "default_branch":"master"
   },
   "commit":{
      "id":"6f88e719ccde3804b1b669cef9dfb236a92fbbff",
      "message":"a\n",
      "timestamp":"2016-09-28T22:04:48+02:00",
      "url":"https://gitlab.com/TomaszKolek/my-awesome-project/commit/6f88e719ccde3804b1b669cef9dfb236a92fbbff",
      "author":{
         "name":"Tomasz Kolek",
         "email":"tomasz-kolek@go2.pl"
      }
   },
   "builds":[
      {
         "id":4541113,
         "stage":"test",
         "name":"job_name2",
         "status":"pending",
         "created_at":"2016-09-28 20:04:56 UTC",
         "started_at":null,
         "finished_at":null,
         "when":"on_success",
         "manual":false,
         "user":{
            "name":"Tomasz Kolek",
            "username":"TomaszKolek",
            "avatar_url":"https://secure.gravatar.com/avatar/c80a7a8454ed7d9e3c5618f1748385c2?s=80\u0026d=identicon"
         },
         "runner":null,
         "artifacts_file":{
            "filename":null,
            "size":null
         }
      },
      {
         "id":4541112,
         "stage":"test",
         "name":"job_name",
         "status":"created",
         "created_at":"2016-09-28 20:04:55 UTC",
         "started_at":null,
         "finished_at":null,
         "when":"on_success",
         "manual":false,
         "user":{
            "name":"Tomasz Kolek",
            "username":"TomaszKolek",
            "avatar_url":"https://secure.gravatar.com/avatar/c80a7a8454ed7d9e3c5618f1748385c2?s=80\u0026d=identicon"
         },
         "runner":null,
         "artifacts_file":{
            "filename":null,
            "size":null
         }
      }
   ]
}
```

--------------------------------------------------------------------------------

---[FILE: pipeline_hook__pipeline_started.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/pipeline_hook__pipeline_started.json

```json
{
   "object_kind":"pipeline",
   "object_attributes":{
      "id":4414206,
      "ref":"master",
      "tag":false,
      "sha":"6f88e719ccde3804b1b669cef9dfb236a92fbbff",
      "before_sha":"6f88e719ccde3804b1b669cef9dfb236a92fbbff",
      "status":"running",
      "stages":[
         "test"
      ],
      "created_at":"2016-09-28 20:04:55 UTC",
      "finished_at":null,
      "duration":0
   },
   "user":{
      "name":"Tomasz Kolek",
      "username":"TomaszKolek",
      "avatar_url":"https://secure.gravatar.com/avatar/c80a7a8454ed7d9e3c5618f1748385c2?s=80\u0026d=identicon"
   },
   "project":{
      "name":"my-awesome-project",
      "description":"abc",
      "web_url":"https://gitlab.com/TomaszKolek/my-awesome-project",
      "avatar_url":null,
      "git_ssh_url":"git@gitlab.com:TomaszKolek/my-awesome-project.git",
      "git_http_url":"https://gitlab.com/TomaszKolek/my-awesome-project.git",
      "namespace":"TomaszKolek",
      "visibility_level":20,
      "path_with_namespace":"TomaszKolek/my-awesome-project",
      "default_branch":"master"
   },
   "commit":{
      "id":"6f88e719ccde3804b1b669cef9dfb236a92fbbff",
      "message":"a\n",
      "timestamp":"2016-09-28T22:04:48+02:00",
      "url":"https://gitlab.com/TomaszKolek/my-awesome-project/commit/6f88e719ccde3804b1b669cef9dfb236a92fbbff",
      "author":{
         "name":"Tomasz Kolek",
         "email":"tomasz-kolek@go2.pl"
      }
   },
   "builds":[
      {
         "id":4541112,
         "stage":"test",
         "name":"job_name",
         "status":"running",
         "created_at":"2016-09-28 20:04:55 UTC",
         "started_at":"2016-09-28 20:21:04 UTC",
         "finished_at":null,
         "when":"on_success",
         "manual":false,
         "user":{
            "name":"Tomasz Kolek",
            "username":"TomaszKolek",
            "avatar_url":"https://secure.gravatar.com/avatar/c80a7a8454ed7d9e3c5618f1748385c2?s=80\u0026d=identicon"
         },
         "runner":{
            "id":21099,
            "description":"shared-runners-manager-2.gitlab.com",
            "active":true,
            "is_shared":true
         },
         "artifacts_file":{
            "filename":null,
            "size":null
         }
      },
      {
         "id":4541113,
         "stage":"test",
         "name":"job_name2",
         "status":"pending",
         "created_at":"2016-09-28 20:04:56 UTC",
         "started_at":null,
         "finished_at":null,
         "when":"on_success",
         "manual":false,
         "user":{
            "name":"Tomasz Kolek",
            "username":"TomaszKolek",
            "avatar_url":"https://secure.gravatar.com/avatar/c80a7a8454ed7d9e3c5618f1748385c2?s=80\u0026d=identicon"
         },
         "runner":null,
         "artifacts_file":{
            "filename":null,
            "size":null
         }
      }
   ]
}
```

--------------------------------------------------------------------------------

---[FILE: pipeline_hook__pipeline_succeeded.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/pipeline_hook__pipeline_succeeded.json

```json
{
   "object_kind":"pipeline",
   "object_attributes":{
      "id":4414206,
      "ref":"master",
      "tag":false,
      "sha":"6f88e719ccde3804b1b669cef9dfb236a92fbbff",
      "before_sha":"6f88e719ccde3804b1b669cef9dfb236a92fbbff",
      "status":"success",
      "stages":[
         "test"
      ],
      "created_at":"2016-09-28 20:04:55 UTC",
      "finished_at":"2016-09-28 20:22:34 UTC",
      "duration":84
   },
   "user":{
      "name":"Tomasz Kolek",
      "username":"TomaszKolek",
      "avatar_url":"https://secure.gravatar.com/avatar/c80a7a8454ed7d9e3c5618f1748385c2?s=80\u0026d=identicon"
   },
   "project":{
      "name":"my-awesome-project",
      "description":"abc",
      "web_url":"https://gitlab.com/TomaszKolek/my-awesome-project",
      "avatar_url":null,
      "git_ssh_url":"git@gitlab.com:TomaszKolek/my-awesome-project.git",
      "git_http_url":"https://gitlab.com/TomaszKolek/my-awesome-project.git",
      "namespace":"TomaszKolek",
      "visibility_level":20,
      "path_with_namespace":"TomaszKolek/my-awesome-project",
      "default_branch":"master"
   },
   "commit":{
      "id":"6f88e719ccde3804b1b669cef9dfb236a92fbbff",
      "message":"a\n",
      "timestamp":"2016-09-28T22:04:48+02:00",
      "url":"https://gitlab.com/TomaszKolek/my-awesome-project/commit/6f88e719ccde3804b1b669cef9dfb236a92fbbff",
      "author":{
         "name":"Tomasz Kolek",
         "email":"tomasz-kolek@go2.pl"
      }
   },
   "builds":[
      {
         "id":4541113,
         "stage":"test",
         "name":"job_name2",
         "status":"success",
         "created_at":"2016-09-28 20:04:56 UTC",
         "started_at":"2016-09-28 20:21:52 UTC",
         "finished_at":"2016-09-28 20:22:34 UTC",
         "when":"on_success",
         "manual":false,
         "user":{
            "name":"Tomasz Kolek",
            "username":"TomaszKolek",
            "avatar_url":"https://secure.gravatar.com/avatar/c80a7a8454ed7d9e3c5618f1748385c2?s=80\u0026d=identicon"
         },
         "runner":{
            "id":21099,
            "description":"shared-runners-manager-2.gitlab.com",
            "active":true,
            "is_shared":true
         },
         "artifacts_file":{
            "filename":null,
            "size":null
         }
      },
      {
         "id":4541112,
         "stage":"test",
         "name":"job_name",
         "status":"success",
         "created_at":"2016-09-28 20:04:55 UTC",
         "started_at":"2016-09-28 20:21:04 UTC",
         "finished_at":"2016-09-28 20:21:47 UTC",
         "when":"on_success",
         "manual":false,
         "user":{
            "name":"Tomasz Kolek",
            "username":"TomaszKolek",
            "avatar_url":"https://secure.gravatar.com/avatar/c80a7a8454ed7d9e3c5618f1748385c2?s=80\u0026d=identicon"
         },
         "runner":{
            "id":21099,
            "description":"shared-runners-manager-2.gitlab.com",
            "active":true,
            "is_shared":true
         },
         "artifacts_file":{
            "filename":null,
            "size":null
         }
      }
   ]
}
```

--------------------------------------------------------------------------------

---[FILE: pipeline_hook__pipeline_succeeded_with_artifacts.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/pipeline_hook__pipeline_succeeded_with_artifacts.json
Signals: Docker

```json
{
    "object_kind": "pipeline",
    "object_attributes": {
        "id": 22668,
        "ref": "test/links-in-zulip-pipeline-message",
        "tag": false,
        "sha": "fdf1367fcd3a3b18a465eeb719e397607c1b38dc",
        "before_sha": "3321a6c3aa5f6ef636ab46d39638d67bdf24074b",
        "source": "push",
        "status": "success",
        "detailed_status": "passed",
        "stages": [
        "setup",
        "test",
        "test_updated_packages",
        "release",
        "cleanup",
        "deploy"
        ],
        "created_at": "2020-05-26 14:46:28 UTC",
        "finished_at": "2020-05-26 14:50:13 UTC",
        "duration": 215,
        "variables": [

        ]
    },
    "merge_request": null,
    "user": {
        "name": "Great Maintainer",
        "username": "maintainer",
        "avatar_url": "https://gitlab.example.com/uploads/-/system/user/avatar/130/avatar.png",
        "email": "maintainer@example.com"
    },
    "project": {
        "id": 345,
        "name": "onlysomeproject",
        "description": "just awesome",
        "web_url": "https://gitlab.example.com/group1/onlysomeproject",
        "avatar_url": "https://gitlab.example.com/uploads/-/system/project/avatar/345/onlysomeproject.jpg",
        "git_ssh_url": "git@gitlab.example.com:group1/onlysomeproject.git",
        "git_http_url": "https://gitlab.example.com/group1/onlysomeproject.git",
        "namespace": "Group1",
        "visibility_level": 10,
        "path_with_namespace": "group1/onlysomeproject",
        "default_branch": "master",
        "ci_config_path": ""
    },
    "commit": {
        "id": "fdf1367fcd3a3b18a465eeb719e397607c1b38dc",
        "message": "fixed this, tested that",
        "timestamp": "2020-05-26T16:46:18+02:00",
        "url": "https://gitlab.example.com/group1/onlysomeproject/-/commit/fdf1367fcd3a3b18a465eeb719e397607c1b38dc",
        "author": {
        "name": "Great Maintainer",
        "email": "maintainer@example.com"
        }
    },
    "builds": [
        {
        "id": 58592,
        "stage": "cleanup",
        "name": "cleanup:cleanup docker image",
        "status": "success",
        "created_at": "2020-05-26 14:46:28 UTC",
        "started_at": "2020-05-26 14:49:54 UTC",
        "finished_at": "2020-05-26 14:50:13 UTC",
        "when": "always",
        "manual": false,
        "allow_failure": true,
        "user": {
            "name": "Great Maintainer",
            "username": "maintainer",
            "avatar_url": "https://gitlab.example.com/uploads/-/system/user/avatar/130/avatar.png",
            "email": "maintainer@example.com"
        },
        "runner": {
            "id": 22,
            "description": "global-runner",
            "active": true,
            "is_shared": true
        },
        "artifacts_file": {
            "filename": null,
            "size": null
        }
        },
        {
        "id": 58591,
        "stage": "release",
        "name": "pages",
        "status": "success",
        "created_at": "2020-05-26 14:46:28 UTC",
        "started_at": "2020-05-26 14:49:36 UTC",
        "finished_at": "2020-05-26 14:49:51 UTC",
        "when": "on_success",
        "manual": false,
        "allow_failure": false,
        "user": {
            "name": "Great Maintainer",
            "username": "maintainer",
            "avatar_url": "https://gitlab.example.com/uploads/-/system/user/avatar/130/avatar.png",
            "email": "maintainer@example.com"
        },
        "runner": {
            "id": 22,
            "description": "global-runner",
            "active": true,
            "is_shared": true
        },
        "artifacts_file": {
            "filename": "artifacts.zip",
            "size": 7049623
        }
        },
        {
        "id": 58590,
        "stage": "test_updated_packages",
        "name": "black+pytest:future environment",
        "status": "success",
        "created_at": "2020-05-26 14:46:28 UTC",
        "started_at": "2020-05-26 14:48:34 UTC",
        "finished_at": "2020-05-26 14:49:36 UTC",
        "when": "on_success",
        "manual": false,
        "allow_failure": false,
        "user": {
            "name": "Great Maintainer",
            "username": "maintainer",
            "avatar_url": "https://gitlab.example.com/uploads/-/system/user/avatar/130/avatar.png",
            "email": "maintainer@example.com"
        },
        "runner": {
            "id": 22,
            "description": "global-runner",
            "active": true,
            "is_shared": true
        },
        "artifacts_file": {
            "filename": null,
            "size": null
        }
        },
        {
        "id": 58589,
        "stage": "test",
        "name": "docs:anaconda environment",
        "status": "success",
        "created_at": "2020-05-26 14:46:28 UTC",
        "started_at": "2020-05-26 14:48:15 UTC",
        "finished_at": "2020-05-26 14:48:33 UTC",
        "when": "on_success",
        "manual": false,
        "allow_failure": false,
        "user": {
            "name": "Great Maintainer",
            "username": "maintainer",
            "avatar_url": "https://gitlab.example.com/uploads/-/system/user/avatar/130/avatar.png",
            "email": "maintainer@example.com"
        },
        "runner": {
            "id": 22,
            "description": "global-runner",
            "active": true,
            "is_shared": true
        },
        "artifacts_file": {
            "filename": "sphinx-docs.zip",
            "size": 7050633
        }
        },
        {
        "id": 58588,
        "stage": "test",
        "name": "pytest:current environment",
        "status": "success",
        "created_at": "2020-05-26 14:46:28 UTC",
        "started_at": "2020-05-26 14:47:56 UTC",
        "finished_at": "2020-05-26 14:48:15 UTC",
        "when": "on_success",
        "manual": false,
        "allow_failure": false,
        "user": {
            "name": "Great Maintainer",
            "username": "maintainer",
            "avatar_url": "https://gitlab.example.com/uploads/-/system/user/avatar/130/avatar.png",
            "email": "maintainer@example.com"
        },
        "runner": {
            "id": 22,
            "description": "global-runner",
            "active": true,
            "is_shared": true
        },
        "artifacts_file": {
            "filename": null,
            "size": null
        }
        },
        {
        "id": 58587,
        "stage": "test",
        "name": "black:current environment",
        "status": "success",
        "created_at": "2020-05-26 14:46:28 UTC",
        "started_at": "2020-05-26 14:47:36 UTC",
        "finished_at": "2020-05-26 14:47:56 UTC",
        "when": "on_success",
        "manual": false,
        "allow_failure": false,
        "user": {
            "name": "Great Maintainer",
            "username": "maintainer",
            "avatar_url": "https://gitlab.example.com/uploads/-/system/user/avatar/130/avatar.png",
            "email": "maintainer@example.com"
        },
        "runner": {
            "id": 22,
            "description": "global-runner",
            "active": true,
            "is_shared": true
        },
        "artifacts_file": {
            "filename": null,
            "size": null
        }
        },
        {
        "id": 58586,
        "stage": "setup",
        "name": "setup:docker image",
        "status": "success",
        "created_at": "2020-05-26 14:46:28 UTC",
        "started_at": "2020-05-26 14:46:30 UTC",
        "finished_at": "2020-05-26 14:47:33 UTC",
        "when": "on_success",
        "manual": false,
        "allow_failure": false,
        "user": {
            "name": "Great Maintainer",
            "username": "maintainer",
            "avatar_url": "https://gitlab.example.com/uploads/-/system/user/avatar/130/avatar.png",
            "email": "maintainer@example.com"
        },
        "runner": {
            "id": 22,
            "description": "global-runner",
            "active": true,
            "is_shared": true
        },
        "artifacts_file": {
            "filename": null,
            "size": null
        }
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: push_hook.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/push_hook.json

```json
{
   "object_kind":"push",
   "event_name":"push",
   "before":"5fcdd5551fc3085df79bece2c32b1400802ac407",
   "after":"eb6ae1e591e0819dc5bf187c6bfe18ec065a80e9",
   "ref":"refs/heads/tomek",
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
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"eb6ae1e591e0819dc5bf187c6bfe18ec065a80e9",
         "message":"c\n",
         "timestamp":"2016-08-17T21:18:06+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/eb6ae1e591e0819dc5bf187c6bfe18ec065a80e9",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      }
   ],
   "total_commits_count":2,
   "repository":{
      "name":"my-awesome-project",
      "url":"git@gitlab.com:tomaszkolek/my-awesome-project.git",
      "description":"",
      "homepage":"https://gitlab.com/tomaszkolek0/my-awesome-project",
      "git_http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git",
      "git_ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "visibility_level":0
   }
}
```

--------------------------------------------------------------------------------

````
