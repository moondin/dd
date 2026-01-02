---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1147
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1147 of 1290)

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

---[FILE: issues__edited.json]---
Location: zulip-main/zerver/webhooks/gitea/fixtures/issues__edited.json

```json
{
  "secret": "123",
  "action": "edited",
  "number": 3,
  "changes": {
    "title": {
      "from": "Test issue"
    }
  },
  "issue": {
    "id": 8184,
    "url": "https://try.gitea.io/api/v1/repos/kostekIV/test/issues/3",
    "number": 3,
    "user": {
      "id": 21818,
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
      "language": "",
      "is_admin": false,
      "last_login": "2019-11-17T23:23:04Z",
      "created": "2019-11-15T19:17:02Z",
      "username": "kostekIV"
    },
    "original_author": "",
    "original_author_id": 0,
    "title": "Test issue 2",
    "body": "Test body",
    "labels": [],
    "milestone": null,
    "assignee": {
      "id": 21818,
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
      "language": "",
      "is_admin": false,
      "last_login": "2019-11-17T23:23:04Z",
      "created": "2019-11-15T19:17:02Z",
      "username": "kostekIV"
    },
    "assignees": [
      {
        "id": 21818,
        "login": "kostekIV",
        "full_name": "",
        "email": "koscis.j@gmail.com",
        "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
        "language": "",
        "is_admin": false,
        "last_login": "2019-11-17T23:23:04Z",
        "created": "2019-11-15T19:17:02Z",
        "username": "kostekIV"
      }
    ],
    "state": "open",
    "comments": 1,
    "created_at": "2019-11-17T23:45:03Z",
    "updated_at": "2019-11-18T00:06:07Z",
    "closed_at": null,
    "due_date": null,
    "pull_request": null,
    "repository": {
      "id": 14576,
      "name": "test",
      "full_name": "kostekIV/test"
    }
  },
  "repository": {
    "id": 14576,
    "owner": {
      "id": 21818,
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
      "language": "",
      "is_admin": false,
      "last_login": "2019-11-17T23:23:04Z",
      "created": "2019-11-15T19:17:02Z",
      "username": "kostekIV"
    },
    "name": "test",
    "full_name": "kostekIV/test",
    "description": "",
    "empty": false,
    "private": false,
    "fork": false,
    "template": false,
    "parent": null,
    "mirror": false,
    "size": 18,
    "html_url": "https://try.gitea.io/kostekIV/test",
    "ssh_url": "git@try.gitea.io:kostekIV/test.git",
    "clone_url": "https://try.gitea.io/kostekIV/test.git",
    "original_url": "",
    "website": "",
    "stars_count": 0,
    "forks_count": 0,
    "watchers_count": 1,
    "open_issues_count": 1,
    "default_branch": "master",
    "archived": false,
    "created_at": "2019-11-15T19:19:34Z",
    "updated_at": "2019-11-17T21:35:13Z",
    "permissions": {
      "admin": true,
      "push": true,
      "pull": true
    },
    "has_issues": true,
    "internal_tracker": {
      "enable_time_tracker": true,
      "allow_only_contributors_to_track_time": true,
      "enable_issue_dependencies": true
    },
    "has_wiki": true,
    "has_pull_requests": true,
    "ignore_whitespace_conflicts": false,
    "allow_merge_commits": true,
    "allow_rebase": true,
    "allow_rebase_explicit": true,
    "allow_squash_merge": true,
    "avatar_url": ""
  },
  "sender": {
    "id": 21818,
    "login": "kostekIV",
    "full_name": "",
    "email": "koscis.j@gmail.com",
    "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
    "language": "",
    "is_admin": false,
    "last_login": "2019-11-17T23:23:04Z",
    "created": "2019-11-15T19:17:02Z",
    "username": "kostekIV"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: issues__opened.json]---
Location: zulip-main/zerver/webhooks/gitea/fixtures/issues__opened.json

```json
{
  "secret": "123",
  "action": "opened",
  "number": 3,
  "issue": {
    "id": 8184,
    "url": "https://try.gitea.io/api/v1/repos/kostekIV/test/issues/3",
    "number": 3,
    "user": {
      "id": 21818,
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
      "language": "",
      "is_admin": false,
      "last_login": "2019-11-17T23:23:04Z",
      "created": "2019-11-15T19:17:02Z",
      "username": "kostekIV"
    },
    "original_author": "",
    "original_author_id": 0,
    "title": "Test issue",
    "body": "Test body",
    "labels": [],
    "milestone": null,
    "assignee": null,
    "assignees": null,
    "state": "open",
    "comments": 0,
    "created_at": "2019-11-17T23:45:03Z",
    "updated_at": "2019-11-17T23:45:03Z",
    "closed_at": null,
    "due_date": null,
    "pull_request": null,
    "repository": {
      "id": 14576,
      "name": "test",
      "full_name": "kostekIV/test"
    }
  },
  "repository": {
    "id": 14576,
    "owner": {
      "id": 21818,
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
      "language": "",
      "is_admin": false,
      "last_login": "2019-11-17T23:23:04Z",
      "created": "2019-11-15T19:17:02Z",
      "username": "kostekIV"
    },
    "name": "test",
    "full_name": "kostekIV/test",
    "description": "",
    "empty": false,
    "private": false,
    "fork": false,
    "template": false,
    "parent": null,
    "mirror": false,
    "size": 18,
    "html_url": "https://try.gitea.io/kostekIV/test",
    "ssh_url": "git@try.gitea.io:kostekIV/test.git",
    "clone_url": "https://try.gitea.io/kostekIV/test.git",
    "original_url": "",
    "website": "",
    "stars_count": 0,
    "forks_count": 0,
    "watchers_count": 1,
    "open_issues_count": 1,
    "default_branch": "master",
    "archived": false,
    "created_at": "2019-11-15T19:19:34Z",
    "updated_at": "2019-11-17T21:35:13Z",
    "permissions": {
      "admin": true,
      "push": true,
      "pull": true
    },
    "has_issues": true,
    "internal_tracker": {
      "enable_time_tracker": true,
      "allow_only_contributors_to_track_time": true,
      "enable_issue_dependencies": true
    },
    "has_wiki": true,
    "has_pull_requests": true,
    "ignore_whitespace_conflicts": false,
    "allow_merge_commits": true,
    "allow_rebase": true,
    "allow_rebase_explicit": true,
    "allow_squash_merge": true,
    "avatar_url": ""
  },
  "sender": {
    "id": 21818,
    "login": "kostekIV",
    "full_name": "",
    "email": "koscis.j@gmail.com",
    "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
    "language": "",
    "is_admin": false,
    "last_login": "2019-11-17T23:23:04Z",
    "created": "2019-11-15T19:17:02Z",
    "username": "kostekIV"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: issues__reopened.json]---
Location: zulip-main/zerver/webhooks/gitea/fixtures/issues__reopened.json

```json
{
  "secret": "123",
  "action": "reopened",
  "number": 3,
  "issue": {
    "id": 8184,
    "url": "https://try.gitea.io/api/v1/repos/kostekIV/test/issues/3",
    "number": 3,
    "user": {
      "id": 21818,
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
      "language": "",
      "is_admin": false,
      "last_login": "2019-11-17T23:23:04Z",
      "created": "2019-11-15T19:17:02Z",
      "username": "kostekIV"
    },
    "original_author": "",
    "original_author_id": 0,
    "title": "Test issue 2",
    "body": "Test body",
    "labels": [],
    "milestone": null,
    "assignee": {
      "id": 21818,
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
      "language": "",
      "is_admin": false,
      "last_login": "2019-11-17T23:23:04Z",
      "created": "2019-11-15T19:17:02Z",
      "username": "kostekIV"
    },
    "assignees": [
      {
        "id": 21818,
        "login": "kostekIV",
        "full_name": "",
        "email": "koscis.j@gmail.com",
        "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
        "language": "",
        "is_admin": false,
        "last_login": "2019-11-17T23:23:04Z",
        "created": "2019-11-15T19:17:02Z",
        "username": "kostekIV"
      }
    ],
    "state": "open",
    "comments": 2,
    "created_at": "2019-11-17T23:45:03Z",
    "updated_at": "2019-11-18T00:42:36Z",
    "closed_at": null,
    "due_date": null,
    "pull_request": null,
    "repository": {
      "id": 14576,
      "name": "test",
      "full_name": "kostekIV/test"
    }
  },
  "repository": {
    "id": 14576,
    "owner": {
      "id": 21818,
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
      "language": "",
      "is_admin": false,
      "last_login": "2019-11-17T23:23:04Z",
      "created": "2019-11-15T19:17:02Z",
      "username": "kostekIV"
    },
    "name": "test",
    "full_name": "kostekIV/test",
    "description": "",
    "empty": false,
    "private": false,
    "fork": false,
    "template": false,
    "parent": null,
    "mirror": false,
    "size": 19,
    "html_url": "https://try.gitea.io/kostekIV/test",
    "ssh_url": "git@try.gitea.io:kostekIV/test.git",
    "clone_url": "https://try.gitea.io/kostekIV/test.git",
    "original_url": "",
    "website": "",
    "stars_count": 0,
    "forks_count": 0,
    "watchers_count": 1,
    "open_issues_count": 0,
    "default_branch": "master",
    "archived": false,
    "created_at": "2019-11-15T19:19:34Z",
    "updated_at": "2019-11-18T00:32:22Z",
    "permissions": {
      "admin": true,
      "push": true,
      "pull": true
    },
    "has_issues": true,
    "internal_tracker": {
      "enable_time_tracker": true,
      "allow_only_contributors_to_track_time": true,
      "enable_issue_dependencies": true
    },
    "has_wiki": true,
    "has_pull_requests": true,
    "ignore_whitespace_conflicts": false,
    "allow_merge_commits": true,
    "allow_rebase": true,
    "allow_rebase_explicit": true,
    "allow_squash_merge": true,
    "avatar_url": ""
  },
  "sender": {
    "id": 21818,
    "login": "kostekIV",
    "full_name": "",
    "email": "koscis.j@gmail.com",
    "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
    "language": "",
    "is_admin": false,
    "last_login": "2019-11-17T23:23:04Z",
    "created": "2019-11-15T19:17:02Z",
    "username": "kostekIV"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: issue_comment__edited.json]---
Location: zulip-main/zerver/webhooks/gitea/fixtures/issue_comment__edited.json

```json
{
  "secret": "123",
  "action": "edited",
  "issue": {
    "id": 8184,
    "url": "https://try.gitea.io/api/v1/repos/kostekIV/test/issues/3",
    "number": 3,
    "user": {
      "id": 21818,
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
      "language": "",
      "is_admin": false,
      "last_login": "2019-11-17T23:23:04Z",
      "created": "2019-11-15T19:17:02Z",
      "username": "kostekIV"
    },
    "original_author": "",
    "original_author_id": 0,
    "title": "Test issue 2",
    "body": "Test body",
    "labels": [],
    "milestone": null,
    "assignee": {
      "id": 21818,
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
      "language": "",
      "is_admin": false,
      "last_login": "2019-11-17T23:23:04Z",
      "created": "2019-11-15T19:17:02Z",
      "username": "kostekIV"
    },
    "assignees": [
      {
        "id": 21818,
        "login": "kostekIV",
        "full_name": "",
        "email": "koscis.j@gmail.com",
        "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
        "language": "",
        "is_admin": false,
        "last_login": "2019-11-17T23:23:04Z",
        "created": "2019-11-15T19:17:02Z",
        "username": "kostekIV"
      }
    ],
    "state": "open",
    "comments": 4,
    "created_at": "2019-11-17T23:45:03Z",
    "updated_at": "2019-11-18T01:21:56Z",
    "closed_at": null,
    "due_date": null,
    "pull_request": null,
    "repository": {
      "id": 14576,
      "name": "test",
      "full_name": "kostekIV/test"
    }
  },
  "comment": {
    "id": 24400,
    "html_url": "https://try.gitea.io/kostekIV/test/issues/3#issuecomment-24400",
    "pull_request_url": "",
    "issue_url": "https://try.gitea.io/kostekIV/test/issues/3",
    "user": {
      "id": 21818,
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
      "language": "",
      "is_admin": false,
      "last_login": "2019-11-17T23:23:04Z",
      "created": "2019-11-15T19:17:02Z",
      "username": "kostekIV"
    },
    "original_author": "",
    "original_author_id": 0,
    "body": "edit test comment",
    "created_at": "2019-11-17T23:45:10Z",
    "updated_at": "2019-11-18T02:44:09Z"
  },
  "changes": {
    "body": {
      "from": "test comment\r\n"
    }
  },
  "repository": {
    "id": 14576,
    "owner": {
      "id": 21818,
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
      "language": "",
      "is_admin": false,
      "last_login": "2019-11-17T23:23:04Z",
      "created": "2019-11-15T19:17:02Z",
      "username": "kostekIV"
    },
    "name": "test",
    "full_name": "kostekIV/test",
    "description": "",
    "empty": false,
    "private": false,
    "fork": false,
    "template": false,
    "parent": null,
    "mirror": false,
    "size": 66,
    "html_url": "https://try.gitea.io/kostekIV/test",
    "ssh_url": "git@try.gitea.io:kostekIV/test.git",
    "clone_url": "https://try.gitea.io/kostekIV/test.git",
    "original_url": "",
    "website": "",
    "stars_count": 1,
    "forks_count": 0,
    "watchers_count": 1,
    "open_issues_count": 1,
    "default_branch": "master",
    "archived": false,
    "created_at": "2019-11-15T19:19:34Z",
    "updated_at": "2019-11-18T01:55:57Z",
    "permissions": {
      "admin": true,
      "push": true,
      "pull": true
    },
    "has_issues": true,
    "internal_tracker": {
      "enable_time_tracker": true,
      "allow_only_contributors_to_track_time": true,
      "enable_issue_dependencies": true
    },
    "has_wiki": true,
    "has_pull_requests": true,
    "ignore_whitespace_conflicts": false,
    "allow_merge_commits": true,
    "allow_rebase": true,
    "allow_rebase_explicit": true,
    "allow_squash_merge": true,
    "avatar_url": ""
  },
  "sender": {
    "id": 21818,
    "login": "kostekIV",
    "full_name": "",
    "email": "koscis.j@gmail.com",
    "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
    "language": "",
    "is_admin": false,
    "last_login": "2019-11-17T23:23:04Z",
    "created": "2019-11-15T19:17:02Z",
    "username": "kostekIV"
  },
  "is_pull": false
}
```

--------------------------------------------------------------------------------

---[FILE: issue_comment__in_pr.json]---
Location: zulip-main/zerver/webhooks/gitea/fixtures/issue_comment__in_pr.json

```json
{
  "secret": "123",
  "action": "created",
  "issue": {
    "id": 8170,
    "url": "https://try.gitea.io/api/v1/repos/kostekIV/test/issues/1",
    "number": 1,
    "user": {
      "id": 21818,
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
      "language": "",
      "is_admin": false,
      "last_login": "2019-11-17T23:23:04Z",
      "created": "2019-11-15T19:17:02Z",
      "username": "kostekIV"
    },
    "original_author": "",
    "original_author_id": 0,
    "title": "dummy",
    "body": "sdfasdfa",
    "labels": [],
    "milestone": null,
    "assignee": null,
    "assignees": null,
    "state": "closed",
    "comments": 0,
    "created_at": "2019-11-15T20:56:14Z",
    "updated_at": "2019-11-15T21:01:32Z",
    "closed_at": "2019-11-15T21:01:26Z",
    "due_date": null,
    "pull_request": {
      "merged": true,
      "merged_at": "2019-11-15T21:01:26Z"
    },
    "repository": {
      "id": 14576,
      "name": "test",
      "full_name": "kostekIV/test"
    }
  },
  "comment": {
    "id": 24399,
    "html_url": "https://try.gitea.io/kostekIV/test/pulls/1/files#issuecomment-24399",
    "pull_request_url": "https://try.gitea.io/kostekIV/test/pulls/1",
    "issue_url": "",
    "user": {
      "id": 21818,
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
      "language": "",
      "is_admin": false,
      "last_login": "2019-11-17T23:23:04Z",
      "created": "2019-11-15T19:17:02Z",
      "username": "kostekIV"
    },
    "original_author": "",
    "original_author_id": 0,
    "body": "test comment",
    "created_at": "2019-11-17T23:24:44Z",
    "updated_at": "2019-11-17T23:24:44Z"
  },
  "repository": {
    "id": 14576,
    "owner": {
      "id": 21818,
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
      "language": "",
      "is_admin": false,
      "last_login": "2019-11-17T23:23:04Z",
      "created": "2019-11-15T19:17:02Z",
      "username": "kostekIV"
    },
    "name": "test",
    "full_name": "kostekIV/test",
    "description": "",
    "empty": false,
    "private": false,
    "fork": false,
    "template": false,
    "parent": null,
    "mirror": false,
    "size": 18,
    "html_url": "https://try.gitea.io/kostekIV/test",
    "ssh_url": "git@try.gitea.io:kostekIV/test.git",
    "clone_url": "https://try.gitea.io/kostekIV/test.git",
    "original_url": "",
    "website": "",
    "stars_count": 0,
    "forks_count": 0,
    "watchers_count": 1,
    "open_issues_count": 0,
    "default_branch": "master",
    "archived": false,
    "created_at": "2019-11-15T19:19:34Z",
    "updated_at": "2019-11-17T21:35:13Z",
    "permissions": {
      "admin": true,
      "push": true,
      "pull": true
    },
    "has_issues": true,
    "internal_tracker": {
      "enable_time_tracker": true,
      "allow_only_contributors_to_track_time": true,
      "enable_issue_dependencies": true
    },
    "has_wiki": true,
    "has_pull_requests": true,
    "ignore_whitespace_conflicts": false,
    "allow_merge_commits": true,
    "allow_rebase": true,
    "allow_rebase_explicit": true,
    "allow_squash_merge": true,
    "avatar_url": ""
  },
  "sender": {
    "id": 21818,
    "login": "kostekIV",
    "full_name": "",
    "email": "koscis.j@gmail.com",
    "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
    "language": "",
    "is_admin": false,
    "last_login": "2019-11-17T23:23:04Z",
    "created": "2019-11-15T19:17:02Z",
    "username": "kostekIV"
  },
  "is_pull": true
}
```

--------------------------------------------------------------------------------

---[FILE: issue_comment__new.json]---
Location: zulip-main/zerver/webhooks/gitea/fixtures/issue_comment__new.json

```json
{
  "secret": "123",
  "action": "created",
  "issue": {
    "id": 8184,
    "url": "https://try.gitea.io/api/v1/repos/kostekIV/test/issues/3",
    "number": 3,
    "user": {
      "id": 21818,
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
      "language": "",
      "is_admin": false,
      "last_login": "2019-11-17T23:23:04Z",
      "created": "2019-11-15T19:17:02Z",
      "username": "kostekIV"
    },
    "original_author": "",
    "original_author_id": 0,
    "title": "Test issue",
    "body": "Test body",
    "labels": [],
    "milestone": null,
    "assignee": null,
    "assignees": null,
    "state": "open",
    "comments": 0,
    "created_at": "2019-11-17T23:45:03Z",
    "updated_at": "2019-11-17T23:45:10Z",
    "closed_at": null,
    "due_date": null,
    "pull_request": null,
    "repository": {
      "id": 14576,
      "name": "test",
      "full_name": "kostekIV/test"
    }
  },
  "comment": {
    "id": 24400,
    "html_url": "https://try.gitea.io/kostekIV/test/issues/3#issuecomment-24400",
    "pull_request_url": "",
    "issue_url": "https://try.gitea.io/kostekIV/test/issues/3",
    "user": {
      "id": 21818,
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
      "language": "",
      "is_admin": false,
      "last_login": "2019-11-17T23:23:04Z",
      "created": "2019-11-15T19:17:02Z",
      "username": "kostekIV"
    },
    "original_author": "",
    "original_author_id": 0,
    "body": "test comment",
    "created_at": "2019-11-17T23:45:10Z",
    "updated_at": "2019-11-17T23:45:10Z"
  },
  "repository": {
    "id": 14576,
    "owner": {
      "id": 21818,
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
      "language": "",
      "is_admin": false,
      "last_login": "2019-11-17T23:23:04Z",
      "created": "2019-11-15T19:17:02Z",
      "username": "kostekIV"
    },
    "name": "test",
    "full_name": "kostekIV/test",
    "description": "",
    "empty": false,
    "private": false,
    "fork": false,
    "template": false,
    "parent": null,
    "mirror": false,
    "size": 18,
    "html_url": "https://try.gitea.io/kostekIV/test",
    "ssh_url": "git@try.gitea.io:kostekIV/test.git",
    "clone_url": "https://try.gitea.io/kostekIV/test.git",
    "original_url": "",
    "website": "",
    "stars_count": 0,
    "forks_count": 0,
    "watchers_count": 1,
    "open_issues_count": 1,
    "default_branch": "master",
    "archived": false,
    "created_at": "2019-11-15T19:19:34Z",
    "updated_at": "2019-11-17T21:35:13Z",
    "permissions": {
      "admin": true,
      "push": true,
      "pull": true
    },
    "has_issues": true,
    "internal_tracker": {
      "enable_time_tracker": true,
      "allow_only_contributors_to_track_time": true,
      "enable_issue_dependencies": true
    },
    "has_wiki": true,
    "has_pull_requests": true,
    "ignore_whitespace_conflicts": false,
    "allow_merge_commits": true,
    "allow_rebase": true,
    "allow_rebase_explicit": true,
    "allow_squash_merge": true,
    "avatar_url": ""
  },
  "sender": {
    "id": 21818,
    "login": "kostekIV",
    "full_name": "",
    "email": "koscis.j@gmail.com",
    "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
    "language": "",
    "is_admin": false,
    "last_login": "2019-11-17T23:23:04Z",
    "created": "2019-11-15T19:17:02Z",
    "username": "kostekIV"
  },
  "is_pull": false
}
```

--------------------------------------------------------------------------------

---[FILE: pull_request__assigned.json]---
Location: zulip-main/zerver/webhooks/gitea/fixtures/pull_request__assigned.json

```json
{
  "secret": "123",
  "action": "assigned",
  "number": 5,
  "pull_request": {
    "id": 1906,
    "url": "https://try.gitea.io/kostekIV/test/pulls/5",
    "number": 5,
    "user": {
      "id": 21818,
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
      "language": "",
      "is_admin": false,
      "last_login": "2019-11-17T23:23:04Z",
      "created": "2019-11-15T19:17:02Z",
      "username": "kostekIV"
    },
    "title": "test 2",
    "body": "test",
    "labels": [],
    "milestone": null,
    "assignee": {
      "id": 21818,
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
      "language": "",
      "is_admin": false,
      "last_login": "2019-11-17T23:23:04Z",
      "created": "2019-11-15T19:17:02Z",
      "username": "kostekIV"
    },
    "assignees": [
      {
        "id": 21818,
        "login": "kostekIV",
        "full_name": "",
        "email": "koscis.j@gmail.com",
        "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
        "language": "",
        "is_admin": false,
        "last_login": "2019-11-17T23:23:04Z",
        "created": "2019-11-15T19:17:02Z",
        "username": "kostekIV"
      }
    ],
    "state": "open",
    "comments": 1,
    "html_url": "https://try.gitea.io/kostekIV/test/pulls/5",
    "diff_url": "https://try.gitea.io/kostekIV/test/pulls/5.diff",
    "patch_url": "https://try.gitea.io/kostekIV/test/pulls/5.patch",
    "mergeable": false,
    "merged": false,
    "merged_at": null,
    "merge_commit_sha": null,
    "merged_by": null,
    "base": {
      "label": "master",
      "ref": "master",
      "sha": "1d40c3be7919f066f9158eaaaecaf696b3e22886",
      "repo_id": 14576,
      "repo": {
        "id": 14576,
        "owner": {
          "id": 21818,
          "login": "kostekIV",
          "full_name": "",
          "email": "koscis.j@gmail.com",
          "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
          "language": "",
          "is_admin": false,
          "last_login": "2019-11-17T23:23:04Z",
          "created": "2019-11-15T19:17:02Z",
          "username": "kostekIV"
        },
        "name": "test",
        "full_name": "kostekIV/test",
        "description": "",
        "empty": false,
        "private": false,
        "fork": false,
        "template": false,
        "parent": null,
        "mirror": false,
        "size": 19,
        "html_url": "https://try.gitea.io/kostekIV/test",
        "ssh_url": "git@try.gitea.io:kostekIV/test.git",
        "clone_url": "https://try.gitea.io/kostekIV/test.git",
        "original_url": "",
        "website": "",
        "stars_count": 0,
        "forks_count": 0,
        "watchers_count": 1,
        "open_issues_count": 0,
        "default_branch": "master",
        "archived": false,
        "created_at": "2019-11-15T19:19:34Z",
        "updated_at": "2019-11-18T00:32:22Z",
        "permissions": {
          "admin": false,
          "push": false,
          "pull": false
        },
        "has_issues": true,
        "internal_tracker": {
          "enable_time_tracker": true,
          "allow_only_contributors_to_track_time": true,
          "enable_issue_dependencies": true
        },
        "has_wiki": true,
        "has_pull_requests": true,
        "ignore_whitespace_conflicts": false,
        "allow_merge_commits": true,
        "allow_rebase": true,
        "allow_rebase_explicit": true,
        "allow_squash_merge": true,
        "avatar_url": ""
      }
    },
    "head": {
      "label": "d",
      "ref": "d",
      "sha": "40f7d3050bdc11085e00518a1356150e5fff512d",
      "repo_id": 14576,
      "repo": {
        "id": 14576,
        "owner": {
          "id": 21818,
          "login": "kostekIV",
          "full_name": "",
          "email": "koscis.j@gmail.com",
          "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
          "language": "",
          "is_admin": false,
          "last_login": "2019-11-17T23:23:04Z",
          "created": "2019-11-15T19:17:02Z",
          "username": "kostekIV"
        },
        "name": "test",
        "full_name": "kostekIV/test",
        "description": "",
        "empty": false,
        "private": false,
        "fork": false,
        "template": false,
        "parent": null,
        "mirror": false,
        "size": 19,
        "html_url": "https://try.gitea.io/kostekIV/test",
        "ssh_url": "git@try.gitea.io:kostekIV/test.git",
        "clone_url": "https://try.gitea.io/kostekIV/test.git",
        "original_url": "",
        "website": "",
        "stars_count": 0,
        "forks_count": 0,
        "watchers_count": 1,
        "open_issues_count": 0,
        "default_branch": "master",
        "archived": false,
        "created_at": "2019-11-15T19:19:34Z",
        "updated_at": "2019-11-18T00:32:22Z",
        "permissions": {
          "admin": false,
          "push": false,
          "pull": false
        },
        "has_issues": true,
        "internal_tracker": {
          "enable_time_tracker": true,
          "allow_only_contributors_to_track_time": true,
          "enable_issue_dependencies": true
        },
        "has_wiki": true,
        "has_pull_requests": true,
        "ignore_whitespace_conflicts": false,
        "allow_merge_commits": true,
        "allow_rebase": true,
        "allow_rebase_explicit": true,
        "allow_squash_merge": true,
        "avatar_url": ""
      }
    },
    "merge_base": "50a822293e4dda7fdc1ecb6e61f7da62345b7fce",
    "due_date": null,
    "created_at": "2019-11-18T00:26:08Z",
    "updated_at": "2019-11-18T00:35:13Z",
    "closed_at": null
  },
  "repository": {
    "id": 14576,
    "owner": {
      "id": 21818,
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
      "language": "",
      "is_admin": false,
      "last_login": "2019-11-17T23:23:04Z",
      "created": "2019-11-15T19:17:02Z",
      "username": "kostekIV"
    },
    "name": "test",
    "full_name": "kostekIV/test",
    "description": "",
    "empty": false,
    "private": false,
    "fork": false,
    "template": false,
    "parent": null,
    "mirror": false,
    "size": 19,
    "html_url": "https://try.gitea.io/kostekIV/test",
    "ssh_url": "git@try.gitea.io:kostekIV/test.git",
    "clone_url": "https://try.gitea.io/kostekIV/test.git",
    "original_url": "",
    "website": "",
    "stars_count": 0,
    "forks_count": 0,
    "watchers_count": 1,
    "open_issues_count": 0,
    "default_branch": "master",
    "archived": false,
    "created_at": "2019-11-15T19:19:34Z",
    "updated_at": "2019-11-18T00:32:22Z",
    "permissions": {
      "admin": true,
      "push": true,
      "pull": true
    },
    "has_issues": true,
    "internal_tracker": {
      "enable_time_tracker": true,
      "allow_only_contributors_to_track_time": true,
      "enable_issue_dependencies": true
    },
    "has_wiki": true,
    "has_pull_requests": true,
    "ignore_whitespace_conflicts": false,
    "allow_merge_commits": true,
    "allow_rebase": true,
    "allow_rebase_explicit": true,
    "allow_squash_merge": true,
    "avatar_url": ""
  },
  "sender": {
    "id": 21818,
    "login": "kostekIV",
    "full_name": "",
    "email": "koscis.j@gmail.com",
    "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
    "language": "",
    "is_admin": false,
    "last_login": "2019-11-17T23:23:04Z",
    "created": "2019-11-15T19:17:02Z",
    "username": "kostekIV"
  },
  "review": null
}
```

--------------------------------------------------------------------------------

---[FILE: pull_request__closed.json]---
Location: zulip-main/zerver/webhooks/gitea/fixtures/pull_request__closed.json

```json
{
  "secret": "123",
  "action": "closed",
  "number": 5,
  "pull_request": {
    "id": 1906,
    "url": "https://try.gitea.io/kostekIV/test/pulls/5",
    "number": 5,
    "user": {
      "id": 21818,
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
      "language": "",
      "is_admin": false,
      "last_login": "2019-11-17T23:23:04Z",
      "created": "2019-11-15T19:17:02Z",
      "username": "kostekIV"
    },
    "title": "test 2",
    "body": "test",
    "labels": [],
    "milestone": null,
    "assignee": null,
    "assignees": null,
    "state": "closed",
    "comments": 0,
    "html_url": "https://try.gitea.io/kostekIV/test/pulls/5",
    "diff_url": "https://try.gitea.io/kostekIV/test/pulls/5.diff",
    "patch_url": "https://try.gitea.io/kostekIV/test/pulls/5.patch",
    "mergeable": true,
    "merged": false,
    "merged_at": null,
    "merge_commit_sha": null,
    "merged_by": null,
    "base": {
      "label": "master",
      "ref": "master",
      "sha": "1d40c3be7919f066f9158eaaaecaf696b3e22886",
      "repo_id": 14576,
      "repo": {
        "id": 14576,
        "owner": {
          "id": 21818,
          "login": "kostekIV",
          "full_name": "",
          "email": "koscis.j@gmail.com",
          "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
          "language": "",
          "is_admin": false,
          "last_login": "2019-11-17T23:23:04Z",
          "created": "2019-11-15T19:17:02Z",
          "username": "kostekIV"
        },
        "name": "test",
        "full_name": "kostekIV/test",
        "description": "",
        "empty": false,
        "private": false,
        "fork": false,
        "template": false,
        "parent": null,
        "mirror": false,
        "size": 19,
        "html_url": "https://try.gitea.io/kostekIV/test",
        "ssh_url": "git@try.gitea.io:kostekIV/test.git",
        "clone_url": "https://try.gitea.io/kostekIV/test.git",
        "original_url": "",
        "website": "",
        "stars_count": 0,
        "forks_count": 0,
        "watchers_count": 1,
        "open_issues_count": 0,
        "default_branch": "master",
        "archived": false,
        "created_at": "2019-11-15T19:19:34Z",
        "updated_at": "2019-11-18T00:22:27Z",
        "permissions": {
          "admin": false,
          "push": false,
          "pull": false
        },
        "has_issues": true,
        "internal_tracker": {
          "enable_time_tracker": true,
          "allow_only_contributors_to_track_time": true,
          "enable_issue_dependencies": true
        },
        "has_wiki": true,
        "has_pull_requests": true,
        "ignore_whitespace_conflicts": false,
        "allow_merge_commits": true,
        "allow_rebase": true,
        "allow_rebase_explicit": true,
        "allow_squash_merge": true,
        "avatar_url": ""
      }
    },
    "head": {
      "label": "d",
      "ref": "d",
      "sha": "06902b147a01a3fc0e7c23caf5548e242300e553",
      "repo_id": 14576,
      "repo": {
        "id": 14576,
        "owner": {
          "id": 21818,
          "login": "kostekIV",
          "full_name": "",
          "email": "koscis.j@gmail.com",
          "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
          "language": "",
          "is_admin": false,
          "last_login": "2019-11-17T23:23:04Z",
          "created": "2019-11-15T19:17:02Z",
          "username": "kostekIV"
        },
        "name": "test",
        "full_name": "kostekIV/test",
        "description": "",
        "empty": false,
        "private": false,
        "fork": false,
        "template": false,
        "parent": null,
        "mirror": false,
        "size": 19,
        "html_url": "https://try.gitea.io/kostekIV/test",
        "ssh_url": "git@try.gitea.io:kostekIV/test.git",
        "clone_url": "https://try.gitea.io/kostekIV/test.git",
        "original_url": "",
        "website": "",
        "stars_count": 0,
        "forks_count": 0,
        "watchers_count": 1,
        "open_issues_count": 0,
        "default_branch": "master",
        "archived": false,
        "created_at": "2019-11-15T19:19:34Z",
        "updated_at": "2019-11-18T00:22:27Z",
        "permissions": {
          "admin": false,
          "push": false,
          "pull": false
        },
        "has_issues": true,
        "internal_tracker": {
          "enable_time_tracker": true,
          "allow_only_contributors_to_track_time": true,
          "enable_issue_dependencies": true
        },
        "has_wiki": true,
        "has_pull_requests": true,
        "ignore_whitespace_conflicts": false,
        "allow_merge_commits": true,
        "allow_rebase": true,
        "allow_rebase_explicit": true,
        "allow_squash_merge": true,
        "avatar_url": ""
      }
    },
    "merge_base": "50a822293e4dda7fdc1ecb6e61f7da62345b7fce",
    "due_date": null,
    "created_at": "2019-11-18T00:26:08Z",
    "updated_at": "2019-11-18T00:28:29Z",
    "closed_at": null
  },
  "repository": {
    "id": 14576,
    "owner": {
      "id": 21818,
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
      "language": "",
      "is_admin": false,
      "last_login": "2019-11-17T23:23:04Z",
      "created": "2019-11-15T19:17:02Z",
      "username": "kostekIV"
    },
    "name": "test",
    "full_name": "kostekIV/test",
    "description": "",
    "empty": false,
    "private": false,
    "fork": false,
    "template": false,
    "parent": null,
    "mirror": false,
    "size": 19,
    "html_url": "https://try.gitea.io/kostekIV/test",
    "ssh_url": "git@try.gitea.io:kostekIV/test.git",
    "clone_url": "https://try.gitea.io/kostekIV/test.git",
    "original_url": "",
    "website": "",
    "stars_count": 0,
    "forks_count": 0,
    "watchers_count": 1,
    "open_issues_count": 0,
    "default_branch": "master",
    "archived": false,
    "created_at": "2019-11-15T19:19:34Z",
    "updated_at": "2019-11-18T00:22:27Z",
    "permissions": {
      "admin": true,
      "push": true,
      "pull": true
    },
    "has_issues": true,
    "internal_tracker": {
      "enable_time_tracker": true,
      "allow_only_contributors_to_track_time": true,
      "enable_issue_dependencies": true
    },
    "has_wiki": true,
    "has_pull_requests": true,
    "ignore_whitespace_conflicts": false,
    "allow_merge_commits": true,
    "allow_rebase": true,
    "allow_rebase_explicit": true,
    "allow_squash_merge": true,
    "avatar_url": ""
  },
  "sender": {
    "id": 21818,
    "login": "kostekIV",
    "full_name": "",
    "email": "koscis.j@gmail.com",
    "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
    "language": "",
    "is_admin": false,
    "last_login": "2019-11-17T23:23:04Z",
    "created": "2019-11-15T19:17:02Z",
    "username": "kostekIV"
  },
  "review": null
}
```

--------------------------------------------------------------------------------

````
