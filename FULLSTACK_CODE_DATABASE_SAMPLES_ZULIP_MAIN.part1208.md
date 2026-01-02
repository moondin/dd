---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1208
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1208 of 1290)

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

---[FILE: pull_request__merged.json]---
Location: zulip-main/zerver/webhooks/gogs/fixtures/pull_request__merged.json

```json
{
  "secret": "",
  "action": "closed",
  "number": 2,
  "pull_request": {
    "id": 2,
    "number": 2,
    "user": {
      "id": 2,
      "login": "john",
      "full_name": "",
      "email": "john@example.com",
      "avatar_url": "https://secure.gravatar.com/avatar/3e55b4d0f779dd3b7ab3be7960dc157a",
      "username": "john"
    },
    "title": "Title Text for Pull Request",
    "body": "Description Text",
    "labels": [],
    "milestone": null,
    "assignee": null,
    "state": "closed",
    "comments": 0,
    "head_branch": "feature",
    "head_repo": {
      "id": 2,
      "owner": {
        "id": 2,
        "login": "john",
        "full_name": "",
        "email": "john@example.com",
        "avatar_url": "https://secure.gravatar.com/avatar/3e55b4d0f779dd3b7ab3be7960dc157a",
        "username": "john"
      },
      "name": "try-git",
      "full_name": "john/try-git",
      "description": "",
      "private": false,
      "fork": true,
      "html_url": "http://localhost:3000/john/try-git",
      "ssh_url": "john@localhost:john/try-git.git",
      "clone_url": "http://localhost:3000/john/try-git.git",
      "website": "",
      "stars_count": 0,
      "forks_count": 0,
      "watchers_count": 1,
      "open_issues_count": 0,
      "default_branch": "master",
      "created_at": "2017-02-19T18:10:53-05:00",
      "updated_at": "2017-02-19T18:19:27-05:00"
    },
    "base_branch": "master",
    "base_repo": {
      "id": 1,
      "owner": {
        "id": 1,
        "login": "john",
        "full_name": "",
        "email": "john@example.com",
        "avatar_url": "https://secure.gravatar.com/avatar/715cb4680284423d81d2e75e94f812a1",
        "username": "john"
      },
      "name": "try-git",
      "full_name": "john/try-git",
      "description": "",
      "private": false,
      "fork": false,
      "html_url": "http://localhost:3000/john/try-git",
      "ssh_url": "john@localhost:john/try-git.git",
      "clone_url": "http://localhost:3000/john/try-git.git",
      "website": "",
      "stars_count": 0,
      "forks_count": 1,
      "watchers_count": 1,
      "open_issues_count": 0,
      "default_branch": "master",
      "created_at": "2017-02-19T13:23:39-05:00",
      "updated_at": "2017-02-19T17:56:41-05:00"
    },
    "html_url": "http://localhost:3000/john/try-git/pulls/2",
    "mergeable": true,
    "merged": true,
    "merged_at": "2017-02-19T18:20:24.851356231-05:00",
    "merge_commit_sha": "9c65fc6e0a3a7487ad70a3711c8c478aa6e94c69",
    "merged_by": {
      "id": 1,
      "login": "john",
      "full_name": "",
      "email": "john@example.com",
      "avatar_url": "https://secure.gravatar.com/avatar/715cb4680284423d81d2e75e94f812a1",
      "username": "john"
    }
  },
  "repository": {
    "id": 1,
    "owner": {
      "id": 1,
      "login": "john",
      "full_name": "",
      "email": "john@example.com",
      "avatar_url": "https://secure.gravatar.com/avatar/715cb4680284423d81d2e75e94f812a1",
      "username": "john"
    },
    "name": "try-git",
    "full_name": "john/try-git",
    "description": "",
    "private": false,
    "fork": false,
    "html_url": "http://localhost:3000/john/try-git",
    "ssh_url": "john@localhost:john/try-git.git",
    "clone_url": "http://localhost:3000/john/try-git.git",
    "website": "",
    "stars_count": 0,
    "forks_count": 1,
    "watchers_count": 1,
    "open_issues_count": 0,
    "default_branch": "master",
    "created_at": "2017-02-19T13:23:39-05:00",
    "updated_at": "2017-02-19T17:56:41-05:00"
  },
  "sender": {
    "id": 1,
    "login": "john",
    "full_name": "",
    "email": "john@example.com",
    "avatar_url": "https://secure.gravatar.com/avatar/715cb4680284423d81d2e75e94f812a1",
    "username": "john"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: pull_request__opened.json]---
Location: zulip-main/zerver/webhooks/gogs/fixtures/pull_request__opened.json

```json
{
  "secret": "",
  "action": "opened",
  "number": 1,
  "pull_request": {
    "id": 1,
    "number": 1,
    "user": {
      "id": 2,
      "login": "john",
      "full_name": "",
      "email": "john@example.com",
      "avatar_url": "https://secure.gravatar.com/avatar/3e55b4d0f779dd3b7ab3be7960dc157a",
      "username": "john"
    },
    "title": "Title Text for Pull Request",
    "body": "Description Text",
    "labels": [],
    "milestone": null,
    "assignee": null,
    "state": "open",
    "comments": 0,
    "head_branch": "feature",
    "head_repo": {
      "id": 2,
      "owner": {
        "id": 2,
        "login": "john",
        "full_name": "",
        "email": "john@example.com",
        "avatar_url": "https://secure.gravatar.com/avatar/3e55b4d0f779dd3b7ab3be7960dc157a",
        "username": "john"
      },
      "name": "try-git",
      "full_name": "john/try-git",
      "description": "",
      "private": false,
      "fork": true,
      "html_url": "http://localhost:3000/john/try-git",
      "ssh_url": "john@localhost:john/try-git.git",
      "clone_url": "http://localhost:3000/john/try-git.git",
      "website": "",
      "stars_count": 0,
      "forks_count": 0,
      "watchers_count": 1,
      "open_issues_count": 0,
      "default_branch": "master",
      "created_at": "2017-02-19T18:10:53-05:00",
      "updated_at": "2017-02-19T18:13:08-05:00"
    },
    "base_branch": "master",
    "base_repo": {
      "id": 1,
      "owner": {
        "id": 1,
        "login": "john",
        "full_name": "",
        "email": "john@example.com",
        "avatar_url": "https://secure.gravatar.com/avatar/715cb4680284423d81d2e75e94f812a1",
        "username": "john"
      },
      "name": "try-git",
      "full_name": "john/try-git",
      "description": "",
      "private": false,
      "fork": false,
      "html_url": "http://localhost:3000/john/try-git",
      "ssh_url": "john@localhost:john/try-git.git",
      "clone_url": "http://localhost:3000/john/try-git.git",
      "website": "",
      "stars_count": 0,
      "forks_count": 1,
      "watchers_count": 1,
      "open_issues_count": 0,
      "default_branch": "master",
      "created_at": "2017-02-19T13:23:39-05:00",
      "updated_at": "2017-02-19T17:56:41-05:00"
    },
    "html_url": "http://localhost:3000/john/try-git/pulls/1",
    "mergeable": true,
    "merged": false,
    "merged_at": null,
    "merge_commit_sha": null,
    "merged_by": null
  },
  "repository": {
    "id": 1,
    "owner": {
      "id": 1,
      "login": "john",
      "full_name": "",
      "email": "john@example.com",
      "avatar_url": "https://secure.gravatar.com/avatar/715cb4680284423d81d2e75e94f812a1",
      "username": "john"
    },
    "name": "try-git",
    "full_name": "john/try-git",
    "description": "",
    "private": false,
    "fork": false,
    "html_url": "http://localhost:3000/john/try-git",
    "ssh_url": "john@localhost:john/try-git.git",
    "clone_url": "http://localhost:3000/john/try-git.git",
    "website": "",
    "stars_count": 0,
    "forks_count": 1,
    "watchers_count": 1,
    "open_issues_count": 0,
    "default_branch": "master",
    "created_at": "2017-02-19T13:23:39-05:00",
    "updated_at": "2017-02-19T17:56:41-05:00"
  },
  "sender": {
    "id": 2,
    "login": "john",
    "full_name": "",
    "email": "john@example.com",
    "avatar_url": "https://secure.gravatar.com/avatar/3e55b4d0f779dd3b7ab3be7960dc157a",
    "username": "john"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: pull_request__reopened.json]---
Location: zulip-main/zerver/webhooks/gogs/fixtures/pull_request__reopened.json

```json
{
  "action": "reopened",
  "number": 2,
  "pull_request": {
    "id": 1349,
    "number": 2,
    "user": {
      "id": 43132,
      "username": "kostekIV",
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
    },
    "title": "reopened",
    "body": "",
    "labels": [],
    "milestone": null,
    "assignee": null,
    "state": "open",
    "comments": 2,
    "head_branch": "c",
    "head_repo": {
      "id": 23925,
      "owner": {
        "id": 43132,
        "username": "kostekIV",
        "login": "kostekIV",
        "full_name": "",
        "email": "koscis.j@gmail.com",
        "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
      },
      "name": "test",
      "full_name": "kostekIV/test",
      "description": "",
      "private": false,
      "fork": false,
      "parent": null,
      "empty": false,
      "mirror": false,
      "size": 40960,
      "html_url": "https://try.gogs.io/kostekIV/test",
      "ssh_url": "git@try.gogs.io:kostekIV/test.git",
      "clone_url": "https://try.gogs.io/kostekIV/test.git",
      "website": "",
      "stars_count": 0,
      "forks_count": 0,
      "watchers_count": 1,
      "open_issues_count": 0,
      "default_branch": "master",
      "created_at": "2019-11-16T08:08:03Z",
      "updated_at": "2019-11-16T08:12:33Z"
    },
    "base_branch": "master",
    "base_repo": {
      "id": 23925,
      "owner": {
        "id": 43132,
        "username": "kostekIV",
        "login": "kostekIV",
        "full_name": "",
        "email": "koscis.j@gmail.com",
        "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
      },
      "name": "test",
      "full_name": "kostekIV/test",
      "description": "",
      "private": false,
      "fork": false,
      "parent": null,
      "empty": false,
      "mirror": false,
      "size": 40960,
      "html_url": "https://try.gogs.io/kostekIV/test",
      "ssh_url": "git@try.gogs.io:kostekIV/test.git",
      "clone_url": "https://try.gogs.io/kostekIV/test.git",
      "website": "",
      "stars_count": 0,
      "forks_count": 0,
      "watchers_count": 1,
      "open_issues_count": 0,
      "default_branch": "master",
      "created_at": "2019-11-16T08:08:03Z",
      "updated_at": "2019-11-16T08:12:33Z"
    },
    "html_url": "https://try.gogs.io/kostekIV/test/pulls/2",
    "mergeable": null,
    "merged": false,
    "merged_at": null,
    "merge_commit_sha": null,
    "merged_by": null
  },
  "repository": {
    "id": 23925,
    "owner": {
      "id": 43132,
      "username": "kostekIV",
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
    },
    "name": "test",
    "full_name": "kostekIV/test",
    "description": "",
    "private": false,
    "fork": false,
    "parent": null,
    "empty": false,
    "mirror": false,
    "size": 40960,
    "html_url": "https://try.gogs.io/kostekIV/test",
    "ssh_url": "git@try.gogs.io:kostekIV/test.git",
    "clone_url": "https://try.gogs.io/kostekIV/test.git",
    "website": "",
    "stars_count": 0,
    "forks_count": 0,
    "watchers_count": 1,
    "open_issues_count": 0,
    "default_branch": "master",
    "created_at": "2019-11-16T08:08:03Z",
    "updated_at": "2019-11-16T08:12:33Z"
  },
  "sender": {
    "id": 43132,
    "username": "kostekIV",
    "login": "kostekIV",
    "full_name": "",
    "email": "koscis.j@gmail.com",
    "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: pull_request__synchronized.json]---
Location: zulip-main/zerver/webhooks/gogs/fixtures/pull_request__synchronized.json

```json
{
  "action": "synchronized",
  "number": 2,
  "pull_request": {
    "id": 1349,
    "number": 2,
    "user": {
      "id": 43132,
      "username": "kostekIV",
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
    },
    "title": "Test",
    "body": "",
    "labels": [],
    "milestone": null,
    "assignee": {
      "id": 43132,
      "username": "kostekIV",
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
    },
    "state": "open",
    "comments": 3,
    "head_branch": "c",
    "head_repo": {
      "id": 23925,
      "owner": {
        "id": 43132,
        "username": "kostekIV",
        "login": "kostekIV",
        "full_name": "",
        "email": "koscis.j@gmail.com",
        "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
      },
      "name": "test",
      "full_name": "kostekIV/test",
      "description": "",
      "private": false,
      "fork": false,
      "parent": null,
      "empty": false,
      "mirror": false,
      "size": 49152,
      "html_url": "https://try.gogs.io/kostekIV/test",
      "ssh_url": "git@try.gogs.io:kostekIV/test.git",
      "clone_url": "https://try.gogs.io/kostekIV/test.git",
      "website": "",
      "stars_count": 1,
      "forks_count": 0,
      "watchers_count": 1,
      "open_issues_count": 2,
      "default_branch": "master",
      "created_at": "2019-11-16T08:08:03Z",
      "updated_at": "2019-11-17T23:18:17Z"
    },
    "base_branch": "master",
    "base_repo": {
      "id": 23925,
      "owner": {
        "id": 43132,
        "username": "kostekIV",
        "login": "kostekIV",
        "full_name": "",
        "email": "koscis.j@gmail.com",
        "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
      },
      "name": "test",
      "full_name": "kostekIV/test",
      "description": "",
      "private": false,
      "fork": false,
      "parent": null,
      "empty": false,
      "mirror": false,
      "size": 49152,
      "html_url": "https://try.gogs.io/kostekIV/test",
      "ssh_url": "git@try.gogs.io:kostekIV/test.git",
      "clone_url": "https://try.gogs.io/kostekIV/test.git",
      "website": "",
      "stars_count": 1,
      "forks_count": 0,
      "watchers_count": 1,
      "open_issues_count": 2,
      "default_branch": "master",
      "created_at": "2019-11-16T08:08:03Z",
      "updated_at": "2019-11-17T23:18:17Z"
    },
    "html_url": "https://try.gogs.io/kostekIV/test/pulls/2",
    "mergeable": false,
    "merged": false,
    "merged_at": null,
    "merge_commit_sha": null,
    "merged_by": null
  },
  "repository": {
    "id": 23925,
    "owner": {
      "id": 43132,
      "username": "kostekIV",
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
    },
    "name": "test",
    "full_name": "kostekIV/test",
    "description": "",
    "private": false,
    "fork": false,
    "parent": null,
    "empty": false,
    "mirror": false,
    "size": 49152,
    "html_url": "https://try.gogs.io/kostekIV/test",
    "ssh_url": "git@try.gogs.io:kostekIV/test.git",
    "clone_url": "https://try.gogs.io/kostekIV/test.git",
    "website": "",
    "stars_count": 1,
    "forks_count": 0,
    "watchers_count": 1,
    "open_issues_count": 2,
    "default_branch": "master",
    "created_at": "2019-11-16T08:08:03Z",
    "updated_at": "2019-11-17T23:18:17Z"
  },
  "sender": {
    "id": 43132,
    "username": "kostekIV",
    "login": "kostekIV",
    "full_name": "",
    "email": "koscis.j@gmail.com",
    "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: push.json]---
Location: zulip-main/zerver/webhooks/gogs/fixtures/push.json

```json
{
  "secret": "",
  "ref": "refs/heads/master",
  "before": "479e6b772b7fba19412457483f50b201286d0103",
  "after": "d8fce16c72a2ff56a5afc8a08645a6ce45491794",
  "compare_url": "http://localhost:3000/john/try-git/compare/479e6b772b7fba19412457483f50b201286d0103...d8fce16c72a2ff56a5afc8a08645a6ce45491794",
  "commits": [
    {
      "id": "d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "message": "Webhook Test\n",
      "url": "http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "committer": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "timestamp": "2017-01-28T08:54:49-05:00"
    }
  ],
  "repository": {
    "id": 1,
    "owner": {
      "id": 1,
      "login": "john",
      "full_name": "",
      "email": "john@example.com",
      "avatar_url": "https://secure.gravatar.com/avatar/ab4e102452ed53394cba1eb306de04c4",
      "username": "john"
    },
    "name": "try-git",
    "full_name": "john/try-git",
    "description": "",
    "private": false,
    "fork": false,
    "html_url": "http://localhost:3000/john/try-git",
    "ssh_url": "john@localhost:john/try-git.git",
    "clone_url": "http://localhost:3000/john/try-git.git",
    "website": "",
    "stars_count": 0,
    "forks_count": 0,
    "watchers_count": 1,
    "open_issues_count": 0,
    "default_branch": "master",
    "created_at": "2017-01-27T17:21:00-05:00",
    "updated_at": "2017-01-27T17:22:47-05:00"
  },
  "pusher": {
    "id": 1,
    "login": "john",
    "full_name": "",
    "email": "john@example.com",
    "avatar_url": "https://secure.gravatar.com/avatar/ab4e102452ed53394cba1eb306de04c4",
    "username": "john"
  },
  "sender": {
    "id": 1,
    "login": "john",
    "full_name": "",
    "email": "john@example.com",
    "avatar_url": "https://secure.gravatar.com/avatar/ab4e102452ed53394cba1eb306de04c4",
    "username": "john"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: push__commits_more_than_limits.json]---
Location: zulip-main/zerver/webhooks/gogs/fixtures/push__commits_more_than_limits.json

```json
{
  "secret": "",
  "ref": "refs/heads/master",
  "before": "479e6b772b7fba19412457483f50b201286d0103",
  "after": "d8fce16c72a2ff56a5afc8a08645a6ce45491794",
  "compare_url": "http://localhost:3000/john/try-git/compare/479e6b772b7fba19412457483f50b201286d0103...d8fce16c72a2ff56a5afc8a08645a6ce45491794",
  "commits": [
    {
      "id": "d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "message": "Webhook Test\n",
      "url": "http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "committer": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "timestamp": "2017-01-28T08:54:49-05:00"
    },
    {
      "id": "d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "message": "Webhook Test\n",
      "url": "http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "committer": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "timestamp": "2017-01-28T08:54:49-05:00"
    },
    {
      "id": "d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "message": "Webhook Test\n",
      "url": "http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "committer": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "timestamp": "2017-01-28T08:54:49-05:00"
    },
    {
      "id": "d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "message": "Webhook Test\n",
      "url": "http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "committer": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "timestamp": "2017-01-28T08:54:49-05:00"
    },
    {
      "id": "d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "message": "Webhook Test\n",
      "url": "http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "committer": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "timestamp": "2017-01-28T08:54:49-05:00"
    },
    {
      "id": "d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "message": "Webhook Test\n",
      "url": "http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "committer": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "timestamp": "2017-01-28T08:54:49-05:00"
    },
    {
      "id": "d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "message": "Webhook Test\n",
      "url": "http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "committer": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "timestamp": "2017-01-28T08:54:49-05:00"
    },
    {
      "id": "d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "message": "Webhook Test\n",
      "url": "http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "committer": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "timestamp": "2017-01-28T08:54:49-05:00"
    },
    {
      "id": "d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "message": "Webhook Test\n",
      "url": "http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "committer": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "timestamp": "2017-01-28T08:54:49-05:00"
    },
    {
      "id": "d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "message": "Webhook Test\n",
      "url": "http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "committer": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "timestamp": "2017-01-28T08:54:49-05:00"
    },
    {
      "id": "d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "message": "Webhook Test\n",
      "url": "http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "committer": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "timestamp": "2017-01-28T08:54:49-05:00"
    },
    {
      "id": "d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "message": "Webhook Test\n",
      "url": "http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "committer": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "timestamp": "2017-01-28T08:54:49-05:00"
    },
    {
      "id": "d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "message": "Webhook Test\n",
      "url": "http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "committer": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "timestamp": "2017-01-28T08:54:49-05:00"
    },
    {
      "id": "d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "message": "Webhook Test\n",
      "url": "http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "committer": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "timestamp": "2017-01-28T08:54:49-05:00"
    },
    {
      "id": "d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "message": "Webhook Test\n",
      "url": "http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "committer": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "timestamp": "2017-01-28T08:54:49-05:00"
    },
    {
      "id": "d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "message": "Webhook Test\n",
      "url": "http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "committer": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "timestamp": "2017-01-28T08:54:49-05:00"
    },
    {
      "id": "d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "message": "Webhook Test\n",
      "url": "http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "committer": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "timestamp": "2017-01-28T08:54:49-05:00"
    },
    {
      "id": "d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "message": "Webhook Test\n",
      "url": "http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "committer": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "timestamp": "2017-01-28T08:54:49-05:00"
    },
    {
      "id": "d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "message": "Webhook Test\n",
      "url": "http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "committer": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "timestamp": "2017-01-28T08:54:49-05:00"
    },
    {
      "id": "d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "message": "Webhook Test\n",
      "url": "http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "committer": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "timestamp": "2017-01-28T08:54:49-05:00"
    },
    {
      "id": "d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "message": "Webhook Test\n",
      "url": "http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "committer": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "timestamp": "2017-01-28T08:54:49-05:00"
    },
    {
      "id": "d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "message": "Webhook Test\n",
      "url": "http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "committer": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "timestamp": "2017-01-28T08:54:49-05:00"
    },
    {
      "id": "d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "message": "Webhook Test\n",
      "url": "http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "committer": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "timestamp": "2017-01-28T08:54:49-05:00"
    },
    {
      "id": "d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "message": "Webhook Test\n",
      "url": "http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "committer": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "timestamp": "2017-01-28T08:54:49-05:00"
    },
    {
      "id": "d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "message": "Webhook Test\n",
      "url": "http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "committer": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "timestamp": "2017-01-28T08:54:49-05:00"
    },
    {
      "id": "d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "message": "Webhook Test\n",
      "url": "http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "committer": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "timestamp": "2017-01-28T08:54:49-05:00"
    },
    {
      "id": "d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "message": "Webhook Test\n",
      "url": "http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "committer": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "timestamp": "2017-01-28T08:54:49-05:00"
    },
    {
      "id": "d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "message": "Webhook Test\n",
      "url": "http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "committer": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "timestamp": "2017-01-28T08:54:49-05:00"
    },
    {
      "id": "d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "message": "Webhook Test\n",
      "url": "http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "committer": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "timestamp": "2017-01-28T08:54:49-05:00"
    },
    {
      "id": "d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "message": "Webhook Test\n",
      "url": "http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "committer": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "timestamp": "2017-01-28T08:54:49-05:00"
    }
  ],
  "repository": {
    "id": 1,
    "owner": {
      "id": 1,
      "login": "john",
      "full_name": "",
      "email": "john@example.com",
      "avatar_url": "https://secure.gravatar.com/avatar/ab4e102452ed53394cba1eb306de04c4",
      "username": "john"
    },
    "name": "try-git",
    "full_name": "john/try-git",
    "description": "",
    "private": false,
    "fork": false,
    "html_url": "http://localhost:3000/john/try-git",
    "ssh_url": "john@localhost:john/try-git.git",
    "clone_url": "http://localhost:3000/john/try-git.git",
    "website": "",
    "stars_count": 0,
    "forks_count": 0,
    "watchers_count": 1,
    "open_issues_count": 0,
    "default_branch": "master",
    "created_at": "2017-01-27T17:21:00-05:00",
    "updated_at": "2017-01-27T17:22:47-05:00"
  },
  "pusher": {
    "id": 1,
    "login": "john",
    "full_name": "",
    "email": "john@example.com",
    "avatar_url": "https://secure.gravatar.com/avatar/ab4e102452ed53394cba1eb306de04c4",
    "username": "john"
  },
  "sender": {
    "id": 1,
    "login": "john",
    "full_name": "",
    "email": "john@example.com",
    "avatar_url": "https://secure.gravatar.com/avatar/ab4e102452ed53394cba1eb306de04c4",
    "username": "john"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: push__commits_multiple_committers.json]---
Location: zulip-main/zerver/webhooks/gogs/fixtures/push__commits_multiple_committers.json

```json
{
  "secret": "",
  "ref": "refs/heads/master",
  "before": "479e6b772b7fba19412457483f50b201286d0103",
  "after": "d8fce16c72a2ff56a5afc8a08645a6ce45491794",
  "compare_url": "http://localhost:3000/john/try-git/compare/479e6b772b7fba19412457483f50b201286d0103...d8fce16c72a2ff56a5afc8a08645a6ce45491794",
  "commits": [
    {
      "id": "d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "message": "Webhook Test\n",
      "url": "http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "committer": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "timestamp": "2017-01-28T08:54:49-05:00"
    },
      {
      "id": "d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "message": "Webhook Test\n",
      "url": "http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794",
      "author": {
        "name": "Benjamin",
        "email": "ben@example.com",
        "username": ""
      },
      "committer": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": ""
      },
      "timestamp": "2017-01-28T08:54:49-05:00"
    }
  ],
  "repository": {
    "id": 1,
    "owner": {
      "id": 1,
      "login": "john",
      "full_name": "",
      "email": "john@example.com",
      "avatar_url": "https://secure.gravatar.com/avatar/ab4e102452ed53394cba1eb306de04c4",
      "username": "john"
    },
    "name": "try-git",
    "full_name": "john/try-git",
    "description": "",
    "private": false,
    "fork": false,
    "html_url": "http://localhost:3000/john/try-git",
    "ssh_url": "john@localhost:john/try-git.git",
    "clone_url": "http://localhost:3000/john/try-git.git",
    "website": "",
    "stars_count": 0,
    "forks_count": 0,
    "watchers_count": 1,
    "open_issues_count": 0,
    "default_branch": "master",
    "created_at": "2017-01-27T17:21:00-05:00",
    "updated_at": "2017-01-27T17:22:47-05:00"
  },
  "pusher": {
    "id": 1,
    "login": "john",
    "full_name": "",
    "email": "john@example.com",
    "avatar_url": "https://secure.gravatar.com/avatar/ab4e102452ed53394cba1eb306de04c4",
    "username": "john"
  },
  "sender": {
    "id": 1,
    "login": "john",
    "full_name": "",
    "email": "john@example.com",
    "avatar_url": "https://secure.gravatar.com/avatar/ab4e102452ed53394cba1eb306de04c4",
    "username": "john"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: release__published.json]---
Location: zulip-main/zerver/webhooks/gogs/fixtures/release__published.json

```json
{
    "action": "published",
    "release": {
        "id": 620,
        "tag_name": "v1.4",
        "target_commitish": "master",
        "name": "Title",
        "body": "Content",
        "draft": false,
        "prerelease": false,
        "author": {
        "id": 54021,
        "username": "cestrell",
        "login": "cestrell",
        "full_name": "",
        "email": "cestrell@umich.edu",
        "avatar_url": "https://secure.gravatar.com/avatar/9d38a3e0dfca4e5784288da94c98ff34?d=identicon"
        },
        "created_at": "2020-05-11T04:47:11Z"
    },
    "repository": {
        "id": 26908,
        "owner": {
        "id": 54021,
        "username": "cestrell",
        "login": "cestrell",
        "full_name": "",
        "email": "cestrell@umich.edu",
        "avatar_url": "https://secure.gravatar.com/avatar/9d38a3e0dfca4e5784288da94c98ff34?d=identicon"
        },
        "name": "zulip_test",
        "full_name": "cestrell/zulip_test",
        "description": "",
        "private": false,
        "fork": false,
        "parent": null,
        "empty": false,
        "mirror": false,
        "size": 16384,
        "html_url": "https://try.gogs.io/cestrell/zulip_test",
        "ssh_url": "git@try.gogs.io:cestrell/zulip_test.git",
        "clone_url": "https://try.gogs.io/cestrell/zulip_test.git",
        "website": "",
        "stars_count": 0,
        "forks_count": 0,
        "watchers_count": 1,
        "open_issues_count": 0,
        "default_branch": "master",
        "created_at": "2020-04-25T16:02:30Z",
        "updated_at": "2020-04-25T16:15:49Z"
    },
    "sender": {
        "id": 54021,
        "username": "cestrell",
        "login": "cestrell",
        "full_name": "",
        "email": "cestrell@umich.edu",
        "avatar_url": "https://secure.gravatar.com/avatar/9d38a3e0dfca4e5784288da94c98ff34?d=identicon"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/gosquared/doc.md

```text
# Zulip GoSquared integration

Receive GoSquared notifications in Zulip!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Go to your project's **Settings**, and click on **Services**.
   Scroll down and next to **Webhook**, click on **Connect**. Click
   **Add new**.

1. Set **Webhook URL** to the URL generated above. Set **Name** to a
   name of your choice, such as `Zulip`. Click **Save Integration**.

1. In your project's **Settings**, click on **Notifications**. Click
   **Add new notification**.

1. Under **Trigger**, you can configure when notifications are
   triggered. Under **Delivery**, toggle the **Webhook** checkbox,
   and click **Add**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/gosquared/001.png)

{!event-filtering-additional-feature.md!}

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

````
