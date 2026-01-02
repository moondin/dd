---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1167
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1167 of 1290)

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

---[FILE: page_build.json]---
Location: zulip-main/zerver/webhooks/github/fixtures/page_build.json

```json
{
  "id": 15995382,
  "build": {
    "url": "https://api.github.com/repos/baxterthehacker/public-repo/pages/builds/15995382",
    "status": "built",
    "error": {
      "message": null
    },
    "pusher": {
      "login": "baxterthehacker",
      "id": 6752317,
      "avatar_url": "https://avatars.githubusercontent.com/u/6752317?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/baxterthehacker",
      "html_url": "https://github.com/baxterthehacker",
      "followers_url": "https://api.github.com/users/baxterthehacker/followers",
      "following_url": "https://api.github.com/users/baxterthehacker/following{/other_user}",
      "gists_url": "https://api.github.com/users/baxterthehacker/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/baxterthehacker/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/baxterthehacker/subscriptions",
      "organizations_url": "https://api.github.com/users/baxterthehacker/orgs",
      "repos_url": "https://api.github.com/users/baxterthehacker/repos",
      "events_url": "https://api.github.com/users/baxterthehacker/events{/privacy}",
      "received_events_url": "https://api.github.com/users/baxterthehacker/received_events",
      "type": "User",
      "site_admin": false
    },
    "commit": "053b99542c83021d6b202d1a1f5ecd5ef7084e55",
    "duration": 3790,
    "created_at": "2015-05-05T23:40:13Z",
    "updated_at": "2015-05-05T23:40:17Z"
  },
  "repository": {
    "id": 35129377,
    "name": "public-repo",
    "full_name": "baxterthehacker/public-repo",
    "owner": {
      "login": "baxterthehacker",
      "id": 6752317,
      "avatar_url": "https://avatars.githubusercontent.com/u/6752317?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/baxterthehacker",
      "html_url": "https://github.com/baxterthehacker",
      "followers_url": "https://api.github.com/users/baxterthehacker/followers",
      "following_url": "https://api.github.com/users/baxterthehacker/following{/other_user}",
      "gists_url": "https://api.github.com/users/baxterthehacker/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/baxterthehacker/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/baxterthehacker/subscriptions",
      "organizations_url": "https://api.github.com/users/baxterthehacker/orgs",
      "repos_url": "https://api.github.com/users/baxterthehacker/repos",
      "events_url": "https://api.github.com/users/baxterthehacker/events{/privacy}",
      "received_events_url": "https://api.github.com/users/baxterthehacker/received_events",
      "type": "User",
      "site_admin": false
    },
    "private": false,
    "html_url": "https://github.com/baxterthehacker/public-repo",
    "description": "",
    "fork": false,
    "url": "https://api.github.com/repos/baxterthehacker/public-repo",
    "forks_url": "https://api.github.com/repos/baxterthehacker/public-repo/forks",
    "keys_url": "https://api.github.com/repos/baxterthehacker/public-repo/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/baxterthehacker/public-repo/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/baxterthehacker/public-repo/teams",
    "hooks_url": "https://api.github.com/repos/baxterthehacker/public-repo/hooks",
    "issue_events_url": "https://api.github.com/repos/baxterthehacker/public-repo/issues/events{/number}",
    "events_url": "https://api.github.com/repos/baxterthehacker/public-repo/events",
    "assignees_url": "https://api.github.com/repos/baxterthehacker/public-repo/assignees{/user}",
    "branches_url": "https://api.github.com/repos/baxterthehacker/public-repo/branches{/branch}",
    "tags_url": "https://api.github.com/repos/baxterthehacker/public-repo/tags",
    "blobs_url": "https://api.github.com/repos/baxterthehacker/public-repo/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/baxterthehacker/public-repo/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/baxterthehacker/public-repo/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/baxterthehacker/public-repo/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/baxterthehacker/public-repo/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/baxterthehacker/public-repo/languages",
    "stargazers_url": "https://api.github.com/repos/baxterthehacker/public-repo/stargazers",
    "contributors_url": "https://api.github.com/repos/baxterthehacker/public-repo/contributors",
    "subscribers_url": "https://api.github.com/repos/baxterthehacker/public-repo/subscribers",
    "subscription_url": "https://api.github.com/repos/baxterthehacker/public-repo/subscription",
    "commits_url": "https://api.github.com/repos/baxterthehacker/public-repo/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/baxterthehacker/public-repo/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/baxterthehacker/public-repo/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/baxterthehacker/public-repo/issues/comments{/number}",
    "contents_url": "https://api.github.com/repos/baxterthehacker/public-repo/contents/{+path}",
    "compare_url": "https://api.github.com/repos/baxterthehacker/public-repo/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/baxterthehacker/public-repo/merges",
    "archive_url": "https://api.github.com/repos/baxterthehacker/public-repo/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/baxterthehacker/public-repo/downloads",
    "issues_url": "https://api.github.com/repos/baxterthehacker/public-repo/issues{/number}",
    "pulls_url": "https://api.github.com/repos/baxterthehacker/public-repo/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/baxterthehacker/public-repo/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/baxterthehacker/public-repo/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/baxterthehacker/public-repo/labels{/name}",
    "releases_url": "https://api.github.com/repos/baxterthehacker/public-repo/releases{/id}",
    "created_at": "2015-05-05T23:40:12Z",
    "updated_at": "2015-05-05T23:40:12Z",
    "pushed_at": "2015-05-05T23:40:17Z",
    "git_url": "git://github.com/baxterthehacker/public-repo.git",
    "ssh_url": "git@github.com:baxterthehacker/public-repo.git",
    "clone_url": "https://github.com/baxterthehacker/public-repo.git",
    "svn_url": "https://github.com/baxterthehacker/public-repo",
    "homepage": null,
    "size": 0,
    "stargazers_count": 0,
    "watchers_count": 0,
    "language": null,
    "has_issues": true,
    "has_downloads": true,
    "has_wiki": true,
    "has_pages": true,
    "forks_count": 0,
    "mirror_url": null,
    "open_issues_count": 0,
    "forks": 0,
    "open_issues": 0,
    "watchers": 0,
    "default_branch": "master"
  },
  "sender": {
    "login": "baxterthehacker",
    "id": 6752317,
    "avatar_url": "https://avatars.githubusercontent.com/u/6752317?v=3",
    "gravatar_id": "",
    "url": "https://api.github.com/users/baxterthehacker",
    "html_url": "https://github.com/baxterthehacker",
    "followers_url": "https://api.github.com/users/baxterthehacker/followers",
    "following_url": "https://api.github.com/users/baxterthehacker/following{/other_user}",
    "gists_url": "https://api.github.com/users/baxterthehacker/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/baxterthehacker/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/baxterthehacker/subscriptions",
    "organizations_url": "https://api.github.com/users/baxterthehacker/orgs",
    "repos_url": "https://api.github.com/users/baxterthehacker/repos",
    "events_url": "https://api.github.com/users/baxterthehacker/events{/privacy}",
    "received_events_url": "https://api.github.com/users/baxterthehacker/received_events",
    "type": "User",
    "site_admin": false
  }
}
```

--------------------------------------------------------------------------------

---[FILE: page_build__errored.json]---
Location: zulip-main/zerver/webhooks/github/fixtures/page_build__errored.json

```json
{
    "id": 15995382,
    "build": {
      "url": "https://api.github.com/repos/baxterthehacker/public-repo/pages/builds/15995382",
      "status": "errored",
      "error": {
        "message": "Something went wrong."
      },
      "pusher": {
        "login": "baxterthehacker",
        "id": 6752317,
        "avatar_url": "https://avatars.githubusercontent.com/u/6752317?v=3",
        "gravatar_id": "",
        "url": "https://api.github.com/users/baxterthehacker",
        "html_url": "https://github.com/baxterthehacker",
        "followers_url": "https://api.github.com/users/baxterthehacker/followers",
        "following_url": "https://api.github.com/users/baxterthehacker/following{/other_user}",
        "gists_url": "https://api.github.com/users/baxterthehacker/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/baxterthehacker/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/baxterthehacker/subscriptions",
        "organizations_url": "https://api.github.com/users/baxterthehacker/orgs",
        "repos_url": "https://api.github.com/users/baxterthehacker/repos",
        "events_url": "https://api.github.com/users/baxterthehacker/events{/privacy}",
        "received_events_url": "https://api.github.com/users/baxterthehacker/received_events",
        "type": "User",
        "site_admin": false
      },
      "commit": "053b99542c83021d6b202d1a1f5ecd5ef7084e55",
      "duration": 3790,
      "created_at": "2015-05-05T23:40:13Z",
      "updated_at": "2015-05-05T23:40:17Z"
    },
    "repository": {
      "id": 35129377,
      "name": "public-repo",
      "full_name": "baxterthehacker/public-repo",
      "owner": {
        "login": "baxterthehacker",
        "id": 6752317,
        "avatar_url": "https://avatars.githubusercontent.com/u/6752317?v=3",
        "gravatar_id": "",
        "url": "https://api.github.com/users/baxterthehacker",
        "html_url": "https://github.com/baxterthehacker",
        "followers_url": "https://api.github.com/users/baxterthehacker/followers",
        "following_url": "https://api.github.com/users/baxterthehacker/following{/other_user}",
        "gists_url": "https://api.github.com/users/baxterthehacker/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/baxterthehacker/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/baxterthehacker/subscriptions",
        "organizations_url": "https://api.github.com/users/baxterthehacker/orgs",
        "repos_url": "https://api.github.com/users/baxterthehacker/repos",
        "events_url": "https://api.github.com/users/baxterthehacker/events{/privacy}",
        "received_events_url": "https://api.github.com/users/baxterthehacker/received_events",
        "type": "User",
        "site_admin": false
      },
      "private": false,
      "html_url": "https://github.com/baxterthehacker/public-repo",
      "description": "",
      "fork": false,
      "url": "https://api.github.com/repos/baxterthehacker/public-repo",
      "forks_url": "https://api.github.com/repos/baxterthehacker/public-repo/forks",
      "keys_url": "https://api.github.com/repos/baxterthehacker/public-repo/keys{/key_id}",
      "collaborators_url": "https://api.github.com/repos/baxterthehacker/public-repo/collaborators{/collaborator}",
      "teams_url": "https://api.github.com/repos/baxterthehacker/public-repo/teams",
      "hooks_url": "https://api.github.com/repos/baxterthehacker/public-repo/hooks",
      "issue_events_url": "https://api.github.com/repos/baxterthehacker/public-repo/issues/events{/number}",
      "events_url": "https://api.github.com/repos/baxterthehacker/public-repo/events",
      "assignees_url": "https://api.github.com/repos/baxterthehacker/public-repo/assignees{/user}",
      "branches_url": "https://api.github.com/repos/baxterthehacker/public-repo/branches{/branch}",
      "tags_url": "https://api.github.com/repos/baxterthehacker/public-repo/tags",
      "blobs_url": "https://api.github.com/repos/baxterthehacker/public-repo/git/blobs{/sha}",
      "git_tags_url": "https://api.github.com/repos/baxterthehacker/public-repo/git/tags{/sha}",
      "git_refs_url": "https://api.github.com/repos/baxterthehacker/public-repo/git/refs{/sha}",
      "trees_url": "https://api.github.com/repos/baxterthehacker/public-repo/git/trees{/sha}",
      "statuses_url": "https://api.github.com/repos/baxterthehacker/public-repo/statuses/{sha}",
      "languages_url": "https://api.github.com/repos/baxterthehacker/public-repo/languages",
      "stargazers_url": "https://api.github.com/repos/baxterthehacker/public-repo/stargazers",
      "contributors_url": "https://api.github.com/repos/baxterthehacker/public-repo/contributors",
      "subscribers_url": "https://api.github.com/repos/baxterthehacker/public-repo/subscribers",
      "subscription_url": "https://api.github.com/repos/baxterthehacker/public-repo/subscription",
      "commits_url": "https://api.github.com/repos/baxterthehacker/public-repo/commits{/sha}",
      "git_commits_url": "https://api.github.com/repos/baxterthehacker/public-repo/git/commits{/sha}",
      "comments_url": "https://api.github.com/repos/baxterthehacker/public-repo/comments{/number}",
      "issue_comment_url": "https://api.github.com/repos/baxterthehacker/public-repo/issues/comments{/number}",
      "contents_url": "https://api.github.com/repos/baxterthehacker/public-repo/contents/{+path}",
      "compare_url": "https://api.github.com/repos/baxterthehacker/public-repo/compare/{base}...{head}",
      "merges_url": "https://api.github.com/repos/baxterthehacker/public-repo/merges",
      "archive_url": "https://api.github.com/repos/baxterthehacker/public-repo/{archive_format}{/ref}",
      "downloads_url": "https://api.github.com/repos/baxterthehacker/public-repo/downloads",
      "issues_url": "https://api.github.com/repos/baxterthehacker/public-repo/issues{/number}",
      "pulls_url": "https://api.github.com/repos/baxterthehacker/public-repo/pulls{/number}",
      "milestones_url": "https://api.github.com/repos/baxterthehacker/public-repo/milestones{/number}",
      "notifications_url": "https://api.github.com/repos/baxterthehacker/public-repo/notifications{?since,all,participating}",
      "labels_url": "https://api.github.com/repos/baxterthehacker/public-repo/labels{/name}",
      "releases_url": "https://api.github.com/repos/baxterthehacker/public-repo/releases{/id}",
      "created_at": "2015-05-05T23:40:12Z",
      "updated_at": "2015-05-05T23:40:12Z",
      "pushed_at": "2015-05-05T23:40:17Z",
      "git_url": "git://github.com/baxterthehacker/public-repo.git",
      "ssh_url": "git@github.com:baxterthehacker/public-repo.git",
      "clone_url": "https://github.com/baxterthehacker/public-repo.git",
      "svn_url": "https://github.com/baxterthehacker/public-repo",
      "homepage": null,
      "size": 0,
      "stargazers_count": 0,
      "watchers_count": 0,
      "language": null,
      "has_issues": true,
      "has_downloads": true,
      "has_wiki": true,
      "has_pages": true,
      "forks_count": 0,
      "mirror_url": null,
      "open_issues_count": 0,
      "forks": 0,
      "open_issues": 0,
      "watchers": 0,
      "default_branch": "master"
    },
    "sender": {
      "login": "baxterthehacker",
      "id": 6752317,
      "avatar_url": "https://avatars.githubusercontent.com/u/6752317?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/baxterthehacker",
      "html_url": "https://github.com/baxterthehacker",
      "followers_url": "https://api.github.com/users/baxterthehacker/followers",
      "following_url": "https://api.github.com/users/baxterthehacker/following{/other_user}",
      "gists_url": "https://api.github.com/users/baxterthehacker/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/baxterthehacker/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/baxterthehacker/subscriptions",
      "organizations_url": "https://api.github.com/users/baxterthehacker/orgs",
      "repos_url": "https://api.github.com/users/baxterthehacker/repos",
      "events_url": "https://api.github.com/users/baxterthehacker/events{/privacy}",
      "received_events_url": "https://api.github.com/users/baxterthehacker/received_events",
      "type": "User",
      "site_admin": false
    }
  }
```

--------------------------------------------------------------------------------

---[FILE: pending_cancellation.json]---
Location: zulip-main/zerver/webhooks/github/fixtures/pending_cancellation.json

```json
{
    "action": "pending_cancellation",
    "sponsorship": {
      "node_id": "MDExOlNwb25zb3JzaGlwMQ==",
      "created_at": "2019-12-30T19:24:46+00:00",
      "sponsorable": {
        "login": "octocat",
        "id": 5,
        "node_id": "MDQ6VXNlcjU=",
        "avatar_url": "https://avatars2.githubusercontent.com/u/5?",
        "gravatar_id": "",
        "url": "https://api.github.com/users/octocat",
        "html_url": "https://github.com/octocat",
        "followers_url": "https://api.github.com/users/octocat/followers",
        "following_url": "https://api.github.com/users/octocat/following{/other_user}",
        "gists_url": "https://api.github.com/users/octocat/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/octocat/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/octocat/subscriptions",
        "organizations_url": "https://api.github.com/users/octocat/orgs",
        "repos_url": "https://api.github.com/users/octocat/repos",
        "events_url": "https://api.github.com/users/octocat/events{/privacy}",
        "received_events_url": "https://api.github.com/users/octocat/received_events",
        "type": "User",
        "site_admin": false
      },
      "sponsor": {
        "login": "monalisa",
        "id": 2,
        "node_id": "MDQ6VXNlcjI=",
        "avatar_url": "https://avatars2.githubusercontent.com/u/2?",
        "gravatar_id": "",
        "url": "https://api.github.com/users/monalisa",
        "html_url": "https://github.com/monalisa",
        "followers_url": "https://api.github.com/users/monalisa/followers",
        "following_url": "https://api.github.com/users/monalisa/following{/other_user}",
        "gists_url": "https://api.github.com/users/monalisa/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/monalisa/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/monalisa/subscriptions",
        "organizations_url": "https://api.github.com/users/monalisa/orgs",
        "repos_url": "https://api.github.com/users/monalisa/repos",
        "events_url": "https://api.github.com/users/monalisa/events{/privacy}",
        "received_events_url": "https://api.github.com/users/monalisa/received_events",
        "type": "User",
        "site_admin": true
      },
      "privacy_level": "private",
      "tier": {
        "node_id": "MDEyOlNwb25zb3JzVGllcjE=",
        "created_at": "2019-12-30T19:17:05Z",
        "description": "foo",
        "monthly_price_in_cents": 500,
        "monthly_price_in_dollars": 5,
        "name": "$5 a month",
        "is_one_time": false,
        "is_custom_amount": false
      }
    },
    "changes": {
      "tier": {
        "from": {
          "node_id": "MDEyOlNwb25zb3JzVGllcjI=",
          "created_at": "2019-12-30T19:26:26Z",
          "description": "bar",
          "monthly_price_in_cents": 1000,
          "monthly_price_in_dollars": 10,
          "name": "$10 a month"
        }
      }
    },
    "effective_date": "2020-01-05T00:00:00+00:00",
    "sender": {
      "login": "monalisa",
      "id": 2,
      "node_id": "MDQ6VXNlcjI=",
      "avatar_url": "https://avatars2.githubusercontent.com/u/2?",
      "gravatar_id": "",
      "url": "https://api.github.com/users/monalisa",
      "html_url": "https://github.com/monalisa",
      "followers_url": "https://api.github.com/users/monalisa/followers",
      "following_url": "https://api.github.com/users/monalisa/following{/other_user}",
      "gists_url": "https://api.github.com/users/monalisa/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/monalisa/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/monalisa/subscriptions",
      "organizations_url": "https://api.github.com/users/monalisa/orgs",
      "repos_url": "https://api.github.com/users/monalisa/repos",
      "events_url": "https://api.github.com/users/monalisa/events{/privacy}",
      "received_events_url": "https://api.github.com/users/monalisa/received_events",
      "type": "User",
      "site_admin": true
    }
  }
```

--------------------------------------------------------------------------------

---[FILE: pending_tier_change.json]---
Location: zulip-main/zerver/webhooks/github/fixtures/pending_tier_change.json

```json
{
    "action": "pending_tier_change",
    "sponsorship": {
      "node_id": "MDExOlNwb25zb3JzaGlwMQ==",
      "created_at": "2019-12-20T19:24:46+00:00",
      "sponsorable": {
        "login": "octocat",
        "id": 5,
        "node_id": "MDQ6VXNlcjU=",
        "avatar_url": "https://avatars2.githubusercontent.com/u/5?",
        "gravatar_id": "",
        "url": "https://api.github.com/users/octocat",
        "html_url": "https://github.com/octocat",
        "followers_url": "https://api.github.com/users/octocat/followers",
        "following_url": "https://api.github.com/users/octocat/following{/other_user}",
        "gists_url": "https://api.github.com/users/octocat/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/octocat/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/octocat/subscriptions",
        "organizations_url": "https://api.github.com/users/octocat/orgs",
        "repos_url": "https://api.github.com/users/octocat/repos",
        "events_url": "https://api.github.com/users/octocat/events{/privacy}",
        "received_events_url": "https://api.github.com/users/octocat/received_events",
        "type": "User",
        "site_admin": false
      },
      "sponsor": {
        "login": "monalisa",
        "id": 2,
        "node_id": "MDQ6VXNlcjI=",
        "avatar_url": "https://avatars2.githubusercontent.com/u/2?",
        "gravatar_id": "",
        "url": "https://api.github.com/users/monalisa",
        "html_url": "https://github.com/monalisa",
        "followers_url": "https://api.github.com/users/monalisa/followers",
        "following_url": "https://api.github.com/users/monalisa/following{/other_user}",
        "gists_url": "https://api.github.com/users/monalisa/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/monalisa/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/monalisa/subscriptions",
        "organizations_url": "https://api.github.com/users/monalisa/orgs",
        "repos_url": "https://api.github.com/users/monalisa/repos",
        "events_url": "https://api.github.com/users/monalisa/events{/privacy}",
        "received_events_url": "https://api.github.com/users/monalisa/received_events",
        "type": "User",
        "site_admin": true
      },
      "privacy_level": "private",
      "tier": {
        "node_id": "MDEyOlNwb25zb3JzVGllcjE=",
        "created_at": "2019-12-20T19:17:05Z",
        "description": "foo",
        "monthly_price_in_cents": 500,
        "monthly_price_in_dollars": 5,
        "name": "$5 a month",
        "is_one_time": false,
        "is_custom_amount": false
      }
    },
    "changes": {
      "tier": {
        "from": {
          "node_id": "MDEyOlNwb25zb3JzVGllcjI=",
          "created_at": "2019-12-20T19:26:26Z",
          "description": "bar",
          "monthly_price_in_cents": 1000,
          "monthly_price_in_dollars": 10,
          "name": "$10 a month"
        }
      }
    },
    "effective_date": "2019-12-30T00:00:00+00:00",
    "sender": {
      "login": "monalisa",
      "id": 2,
      "node_id": "MDQ6VXNlcjI=",
      "avatar_url": "https://avatars2.githubusercontent.com/u/2?",
      "gravatar_id": "",
      "url": "https://api.github.com/users/monalisa",
      "html_url": "https://github.com/monalisa",
      "followers_url": "https://api.github.com/users/monalisa/followers",
      "following_url": "https://api.github.com/users/monalisa/following{/other_user}",
      "gists_url": "https://api.github.com/users/monalisa/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/monalisa/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/monalisa/subscriptions",
      "organizations_url": "https://api.github.com/users/monalisa/orgs",
      "repos_url": "https://api.github.com/users/monalisa/repos",
      "events_url": "https://api.github.com/users/monalisa/events{/privacy}",
      "received_events_url": "https://api.github.com/users/monalisa/received_events",
      "type": "User",
      "site_admin": true
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ping.json]---
Location: zulip-main/zerver/webhooks/github/fixtures/ping.json

```json
{
  "zen": "Favor focus over features.",
  "hook_id": 11847078,
  "hook": {
    "type": "Repository",
    "id": 11847078,
    "name": "web",
    "active": true,
    "events": [
      "push"
    ],
    "config": {
      "content_type": "json",
      "insecure_ssl": "0",
      "url": "http://requestb.in/18z1jwv1"
    },
    "updated_at": "2017-01-31T23:30:48Z",
    "created_at": "2017-01-31T23:30:48Z",
    "url": "https://api.github.com/repos/TomaszKolek/zulip/hooks/11847078",
    "test_url": "https://api.github.com/repos/TomaszKolek/zulip/hooks/11847078/test",
    "ping_url": "https://api.github.com/repos/TomaszKolek/zulip/hooks/11847078/pings",
    "last_response": {
      "code": null,
      "status": "unused",
      "message": null
    }
  },
  "repository": {
    "id": 53679793,
    "name": "public-repo",
    "full_name": "TomaszKolek/public-repo",
    "owner": {
      "login": "TomaszKolek",
      "id": 5993758,
      "avatar_url": "https://avatars.githubusercontent.com/u/5993758?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/TomaszKolek",
      "html_url": "https://github.com/TomaszKolek",
      "followers_url": "https://api.github.com/users/TomaszKolek/followers",
      "following_url": "https://api.github.com/users/TomaszKolek/following{/other_user}",
      "gists_url": "https://api.github.com/users/TomaszKolek/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/TomaszKolek/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/TomaszKolek/subscriptions",
      "organizations_url": "https://api.github.com/users/TomaszKolek/orgs",
      "repos_url": "https://api.github.com/users/TomaszKolek/repos",
      "events_url": "https://api.github.com/users/TomaszKolek/events{/privacy}",
      "received_events_url": "https://api.github.com/users/TomaszKolek/received_events",
      "type": "User",
      "site_admin": false
    },
    "private": false,
    "html_url": "https://github.com/TomaszKolek/zulip",
    "description": "Zulip server - powerful open source group chat",
    "fork": true,
    "url": "https://api.github.com/repos/TomaszKolek/zulip",
    "forks_url": "https://api.github.com/repos/TomaszKolek/zulip/forks",
    "keys_url": "https://api.github.com/repos/TomaszKolek/zulip/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/TomaszKolek/zulip/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/TomaszKolek/zulip/teams",
    "hooks_url": "https://api.github.com/repos/TomaszKolek/zulip/hooks",
    "issue_events_url": "https://api.github.com/repos/TomaszKolek/zulip/issues/events{/number}",
    "events_url": "https://api.github.com/repos/TomaszKolek/zulip/events",
    "assignees_url": "https://api.github.com/repos/TomaszKolek/zulip/assignees{/user}",
    "branches_url": "https://api.github.com/repos/TomaszKolek/zulip/branches{/branch}",
    "tags_url": "https://api.github.com/repos/TomaszKolek/zulip/tags",
    "blobs_url": "https://api.github.com/repos/TomaszKolek/zulip/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/TomaszKolek/zulip/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/TomaszKolek/zulip/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/TomaszKolek/zulip/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/TomaszKolek/zulip/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/TomaszKolek/zulip/languages",
    "stargazers_url": "https://api.github.com/repos/TomaszKolek/zulip/stargazers",
    "contributors_url": "https://api.github.com/repos/TomaszKolek/zulip/contributors",
    "subscribers_url": "https://api.github.com/repos/TomaszKolek/zulip/subscribers",
    "subscription_url": "https://api.github.com/repos/TomaszKolek/zulip/subscription",
    "commits_url": "https://api.github.com/repos/TomaszKolek/zulip/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/TomaszKolek/zulip/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/TomaszKolek/zulip/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/TomaszKolek/zulip/issues/comments{/number}",
    "contents_url": "https://api.github.com/repos/TomaszKolek/zulip/contents/{+path}",
    "compare_url": "https://api.github.com/repos/TomaszKolek/zulip/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/TomaszKolek/zulip/merges",
    "archive_url": "https://api.github.com/repos/TomaszKolek/zulip/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/TomaszKolek/zulip/downloads",
    "issues_url": "https://api.github.com/repos/TomaszKolek/zulip/issues{/number}",
    "pulls_url": "https://api.github.com/repos/TomaszKolek/zulip/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/TomaszKolek/zulip/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/TomaszKolek/zulip/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/TomaszKolek/zulip/labels{/name}",
    "releases_url": "https://api.github.com/repos/TomaszKolek/zulip/releases{/id}",
    "deployments_url": "https://api.github.com/repos/TomaszKolek/zulip/deployments",
    "created_at": "2016-03-11T16:16:19Z",
    "updated_at": "2016-03-11T16:16:26Z",
    "pushed_at": "2017-01-31T09:55:16Z",
    "git_url": "git://github.com/TomaszKolek/zulip.git",
    "ssh_url": "git@github.com:TomaszKolek/zulip.git",
    "clone_url": "https://github.com/TomaszKolek/zulip.git",
    "svn_url": "https://github.com/TomaszKolek/zulip",
    "homepage": "",
    "size": 140023,
    "stargazers_count": 0,
    "watchers_count": 0,
    "language": "Python",
    "has_issues": false,
    "has_downloads": true,
    "has_wiki": true,
    "has_pages": false,
    "forks_count": 0,
    "mirror_url": null,
    "open_issues_count": 0,
    "forks": 0,
    "open_issues": 0,
    "watchers": 0,
    "default_branch": "master"
  },
  "sender": {
    "login": "TomaszKolek",
    "id": 5993758,
    "avatar_url": "https://avatars.githubusercontent.com/u/5993758?v=3",
    "gravatar_id": "",
    "url": "https://api.github.com/users/TomaszKolek",
    "html_url": "https://github.com/TomaszKolek",
    "followers_url": "https://api.github.com/users/TomaszKolek/followers",
    "following_url": "https://api.github.com/users/TomaszKolek/following{/other_user}",
    "gists_url": "https://api.github.com/users/TomaszKolek/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/TomaszKolek/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/TomaszKolek/subscriptions",
    "organizations_url": "https://api.github.com/users/TomaszKolek/orgs",
    "repos_url": "https://api.github.com/users/TomaszKolek/repos",
    "events_url": "https://api.github.com/users/TomaszKolek/events{/privacy}",
    "received_events_url": "https://api.github.com/users/TomaszKolek/received_events",
    "type": "User",
    "site_admin": false
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ping__organization.json]---
Location: zulip-main/zerver/webhooks/github/fixtures/ping__organization.json

```json
{
    "zen":"Keep it logically awesome.",
    "hook_id":14977773,
    "hook":{
        "type":"Organization",
        "id":14977773,
        "name":"web",
        "active":true,
        "events":[
            "gollum",
            "issues",
            "issue_comment",
            "pull_request",
            "pull_request_review",
            "pull_request_review_comment",
            "push",
            "repository"
        ],
        "config":{
            "content_type":"json",
            "insecure_ssl":"0",
            "url":"https://requestb.in/13vy30l1"
        },
        "updated_at":"2017-07-17T01:15:39Z",
        "created_at":"2017-07-17T01:15:39Z",
        "url":"https://api.github.com/orgs/zulip-test-org/hooks/14977773",
        "ping_url":"https://api.github.com/orgs/zulip-test-org/hooks/14977773/pings"
    },
    "organization":{
        "login":"zulip-test-org",
        "id":30221202,
        "url":"https://api.github.com/orgs/zulip-test-org",
        "repos_url":"https://api.github.com/orgs/zulip-test-org/repos",
        "events_url":"https://api.github.com/orgs/zulip-test-org/events",
        "hooks_url":"https://api.github.com/orgs/zulip-test-org/hooks",
        "issues_url":"https://api.github.com/orgs/zulip-test-org/issues",
        "members_url":"https://api.github.com/orgs/zulip-test-org/members{/member}",
        "public_members_url":"https://api.github.com/orgs/zulip-test-org/public_members{/member}",
        "avatar_url":"https://avatars4.githubusercontent.com/u/30221202?v=4",
        "description":null
    },
    "sender":{
        "login":"eeshangarg",
        "id":7251823,
        "avatar_url":"https://avatars4.githubusercontent.com/u/7251823?v=4",
        "gravatar_id":"",
        "url":"https://api.github.com/users/eeshangarg",
        "html_url":"https://github.com/eeshangarg",
        "followers_url":"https://api.github.com/users/eeshangarg/followers",
        "following_url":"https://api.github.com/users/eeshangarg/following{/other_user}",
        "gists_url":"https://api.github.com/users/eeshangarg/gists{/gist_id}",
        "starred_url":"https://api.github.com/users/eeshangarg/starred{/owner}{/repo}",
        "subscriptions_url":"https://api.github.com/users/eeshangarg/subscriptions",
        "organizations_url":"https://api.github.com/users/eeshangarg/orgs",
        "repos_url":"https://api.github.com/users/eeshangarg/repos",
        "events_url":"https://api.github.com/users/eeshangarg/events{/privacy}",
        "received_events_url":"https://api.github.com/users/eeshangarg/received_events",
        "type":"User",
        "site_admin":false
    }
}
```

--------------------------------------------------------------------------------

````
