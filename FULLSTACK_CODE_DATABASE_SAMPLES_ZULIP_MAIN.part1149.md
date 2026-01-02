---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1149
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1149 of 1290)

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

---[FILE: pull_request__reopened.json]---
Location: zulip-main/zerver/webhooks/gitea/fixtures/pull_request__reopened.json

```json
{
  "secret": "123",
  "action": "reopened",
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
    "updated_at": "2019-11-18T00:28:33Z",
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

---[FILE: push__5_commits.json]---
Location: zulip-main/zerver/webhooks/gitea/fixtures/push__5_commits.json

```json
{
  "secret": "123",
  "ref": "refs/heads/d",
  "before": "21138d2ca0ce18f8e037696fdbe1b3f0c211f630",
  "after": "2ec0c971d04723523aa20f2b378f8b419b47d4ec",
  "compare_url": "https://try.gitea.io/kostekIV/test/compare/21138d2ca0ce18f8e037696fdbe1b3f0c211f630...2ec0c971d04723523aa20f2b378f8b419b47d4ec",
  "commits": [
    {
      "id": "2ec0c971d04723523aa20f2b378f8b419b47d4ec",
      "message": "commit\n",
      "url": "https://try.gitea.io/kostekIV/test/commit/2ec0c971d04723523aa20f2b378f8b419b47d4ec",
      "author": {
        "name": "Jan Koscisz",
        "email": "koscis.j@gmail.com",
        "username": "kostekIV"
      },
      "committer": {
        "name": "Jan Koscisz",
        "email": "koscis.j@gmail.com",
        "username": "kostekIV"
      },
      "verification": null,
      "timestamp": "2019-11-18T02:55:51+01:00",
      "added": [],
      "removed": [],
      "modified": [
        "1.c"
      ]
    },
    {
      "id": "6cb1701c8b0114ad716f4cd49153076e7109cb85",
      "message": "commit\n",
      "url": "https://try.gitea.io/kostekIV/test/commit/6cb1701c8b0114ad716f4cd49153076e7109cb85",
      "author": {
        "name": "Jan Koscisz",
        "email": "koscis.j@gmail.com",
        "username": "kostekIV"
      },
      "committer": {
        "name": "Jan Koscisz",
        "email": "koscis.j@gmail.com",
        "username": "kostekIV"
      },
      "verification": null,
      "timestamp": "2019-11-18T02:55:51+01:00",
      "added": [],
      "removed": [],
      "modified": [
        "1.c"
      ]
    },
    {
      "id": "6773eabc0778a3e38997c06a13f5f0c48b67e5dc",
      "message": "commit\n",
      "url": "https://try.gitea.io/kostekIV/test/commit/6773eabc0778a3e38997c06a13f5f0c48b67e5dc",
      "author": {
        "name": "Jan Koscisz",
        "email": "koscis.j@gmail.com",
        "username": "kostekIV"
      },
      "committer": {
        "name": "Jan Koscisz",
        "email": "koscis.j@gmail.com",
        "username": "kostekIV"
      },
      "verification": null,
      "timestamp": "2019-11-18T02:55:51+01:00",
      "added": [],
      "removed": [],
      "modified": [
        "1.c"
      ]
    },
    {
      "id": "337402cf675ce7082ddcd23d06a116c85241825a",
      "message": "commit\n",
      "url": "https://try.gitea.io/kostekIV/test/commit/337402cf675ce7082ddcd23d06a116c85241825a",
      "author": {
        "name": "Jan Koscisz",
        "email": "koscis.j@gmail.com",
        "username": "kostekIV"
      },
      "committer": {
        "name": "Jan Koscisz",
        "email": "koscis.j@gmail.com",
        "username": "kostekIV"
      },
      "verification": null,
      "timestamp": "2019-11-18T02:55:51+01:00",
      "added": [],
      "removed": [],
      "modified": [
        "1.c"
      ]
    },
    {
      "id": "0a38cad3fac3a13bb78b738d13f15ce9cc3343fa",
      "message": "commit\n",
      "url": "https://try.gitea.io/kostekIV/test/commit/0a38cad3fac3a13bb78b738d13f15ce9cc3343fa",
      "author": {
        "name": "Jan Koscisz",
        "email": "koscis.j@gmail.com",
        "username": "kostekIV"
      },
      "committer": {
        "name": "Jan Koscisz",
        "email": "koscis.j@gmail.com",
        "username": "kostekIV"
      },
      "verification": null,
      "timestamp": "2019-11-18T02:55:51+01:00",
      "added": [],
      "removed": [],
      "modified": [
        "1.c"
      ]
    }
  ],
  "head_commit": null,
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
  "pusher": {
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

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/github/doc.md

```text
# Zulip GitHub integration

Get GitHub notifications in Zulip!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. Decide where to send {{ integration_display_name }} notifications, and
   [generate the integration URL](/help/generate-integration-url). You'll be
   able to configure which branches you'll receive notifications from,
   whether to exclude notifications from private repositories, and whether
   to include the repository name in the notifications.

1. On your repository's web page, go to **Settings**. Select **Webhooks**,
   and click **Add webhook**. GitHub may prompt you for your password.

1. Set **Payload URL** to the URL generated above. Set **Content type**
   to `application/json`. Select the [events](#filtering-incoming-events)
   you'd like to be notified about, and click **Add Webhook**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/github/001.png)

{!event-filtering-additional-feature.md!}

### Related documentation

- [GitHub's webhook events documentation][github-webhook-events]

- [Zulip GitHub Actions integration](/integrations/github-actions)

{!webhooks-url-specification.md!}

[github-webhook-events]: https://docs.github.com/en/webhooks-and-events/webhooks/webhook-events-and-payloads
```

--------------------------------------------------------------------------------

---[FILE: githubsponsors.md]---
Location: zulip-main/zerver/webhooks/github/githubsponsors.md

```text
# Zulip GitHub Sponsors integration

Get GitHub Sponsors notifications in Zulip!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Go to your profile on GitHub, and click on **Sponsors dashboard**.
   Select **Webhooks**, and click **Add webhook**. GitHub may prompt
   you for your password.

1. Set **Payload URL** to the URL generated above. Set **Content type**
   to `application/json`, and click **Create webhook**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/githubsponsors/001.png)

{!event-filtering-additional-feature.md!}

### Related documentation

- [GitHub's webhook events documentation][github-webhook-events]

- [Zulip GitHub integration](/integrations/github).

{!webhooks-url-specification.md!}

[github-webhook-events]: https://docs.github.com/en/webhooks-and-events/webhooks/webhook-events-and-payloads
```

--------------------------------------------------------------------------------

````
