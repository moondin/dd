---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1196
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1196 of 1290)

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

---[FILE: status__with_target_url.json]---
Location: zulip-main/zerver/webhooks/github/fixtures/status__with_target_url.json

```json
{
  "id": 214015194,
  "sha": "9049f1265b7d61be4a8904a9a27120d2064dab3b",
  "name": "baxterthehacker/public-repo",
  "target_url": "https://example.com/build/status",
  "context": "default",
  "description": null,
  "state": "success",
  "commit": {
    "sha": "9049f1265b7d61be4a8904a9a27120d2064dab3b",
    "commit": {
      "author": {
        "name": "baxterthehacker",
        "email": "baxterthehacker@users.noreply.github.com",
        "date": "2015-05-05T23:40:12Z"
      },
      "committer": {
        "name": "baxterthehacker",
        "email": "baxterthehacker@users.noreply.github.com",
        "date": "2015-05-05T23:40:12Z"
      },
      "message": "Initial commit",
      "tree": {
        "sha": "02b49ad0ba4f1acd9f06531b21e16a4ac5d341d0",
        "url": "https://api.github.com/repos/baxterthehacker/public-repo/git/trees/02b49ad0ba4f1acd9f06531b21e16a4ac5d341d0"
      },
      "url": "https://api.github.com/repos/baxterthehacker/public-repo/git/commits/9049f1265b7d61be4a8904a9a27120d2064dab3b",
      "comment_count": 1
    },
    "url": "https://api.github.com/repos/baxterthehacker/public-repo/commits/9049f1265b7d61be4a8904a9a27120d2064dab3b",
    "html_url": "https://github.com/baxterthehacker/public-repo/commit/9049f1265b7d61be4a8904a9a27120d2064dab3b",
    "comments_url": "https://api.github.com/repos/baxterthehacker/public-repo/commits/9049f1265b7d61be4a8904a9a27120d2064dab3b/comments",
    "author": {
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
    "committer": {
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
    "parents": [

    ]
  },
  "branches": [
    {
      "name": "master",
      "commit": {
        "sha": "9049f1265b7d61be4a8904a9a27120d2064dab3b",
        "url": "https://api.github.com/repos/baxterthehacker/public-repo/commits/9049f1265b7d61be4a8904a9a27120d2064dab3b"
      }
    },
    {
      "name": "changes",
      "commit": {
        "sha": "0d1a26e67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c",
        "url": "https://api.github.com/repos/baxterthehacker/public-repo/commits/0d1a26e67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c"
      }
    },
    {
      "name": "gh-pages",
      "commit": {
        "sha": "b11bb7545ac14abafc6191a0481b0d961e7793c6",
        "url": "https://api.github.com/repos/baxterthehacker/public-repo/commits/b11bb7545ac14abafc6191a0481b0d961e7793c6"
      }
    }
  ],
  "created_at": "2015-05-05T23:40:39Z",
  "updated_at": "2015-05-05T23:40:39Z",
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
    "updated_at": "2015-05-05T23:40:30Z",
    "pushed_at": "2015-05-05T23:40:39Z",
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
    "open_issues_count": 2,
    "forks": 0,
    "open_issues": 2,
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

---[FILE: team_add.json]---
Location: zulip-main/zerver/webhooks/github/fixtures/team_add.json

```json
{
  "team": {
    "name": "github",
    "id": 836012,
    "slug": "github",
    "description": "",
    "permission": "pull",
    "url": "https://api.github.com/teams/836012",
    "members_url": "https://api.github.com/teams/836012/members{/member}",
    "repositories_url": "https://api.github.com/teams/836012/repos"
  },
  "repository": {
    "id": 35129393,
    "name": "public-repo",
    "full_name": "baxterandthehackers/public-repo",
    "owner": {
      "login": "baxterandthehackers",
      "id": 7649605,
      "avatar_url": "https://avatars.githubusercontent.com/u/7649605?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/baxterandthehackers",
      "html_url": "https://github.com/baxterandthehackers",
      "followers_url": "https://api.github.com/users/baxterandthehackers/followers",
      "following_url": "https://api.github.com/users/baxterandthehackers/following{/other_user}",
      "gists_url": "https://api.github.com/users/baxterandthehackers/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/baxterandthehackers/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/baxterandthehackers/subscriptions",
      "organizations_url": "https://api.github.com/users/baxterandthehackers/orgs",
      "repos_url": "https://api.github.com/users/baxterandthehackers/repos",
      "events_url": "https://api.github.com/users/baxterandthehackers/events{/privacy}",
      "received_events_url": "https://api.github.com/users/baxterandthehackers/received_events",
      "type": "Organization",
      "site_admin": false
    },
    "private": false,
    "html_url": "https://github.com/baxterandthehackers/public-repo",
    "description": "",
    "fork": true,
    "url": "https://api.github.com/repos/baxterandthehackers/public-repo",
    "forks_url": "https://api.github.com/repos/baxterandthehackers/public-repo/forks",
    "keys_url": "https://api.github.com/repos/baxterandthehackers/public-repo/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/baxterandthehackers/public-repo/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/baxterandthehackers/public-repo/teams",
    "hooks_url": "https://api.github.com/repos/baxterandthehackers/public-repo/hooks",
    "issue_events_url": "https://api.github.com/repos/baxterandthehackers/public-repo/issues/events{/number}",
    "events_url": "https://api.github.com/repos/baxterandthehackers/public-repo/events",
    "assignees_url": "https://api.github.com/repos/baxterandthehackers/public-repo/assignees{/user}",
    "branches_url": "https://api.github.com/repos/baxterandthehackers/public-repo/branches{/branch}",
    "tags_url": "https://api.github.com/repos/baxterandthehackers/public-repo/tags",
    "blobs_url": "https://api.github.com/repos/baxterandthehackers/public-repo/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/baxterandthehackers/public-repo/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/baxterandthehackers/public-repo/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/baxterandthehackers/public-repo/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/baxterandthehackers/public-repo/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/baxterandthehackers/public-repo/languages",
    "stargazers_url": "https://api.github.com/repos/baxterandthehackers/public-repo/stargazers",
    "contributors_url": "https://api.github.com/repos/baxterandthehackers/public-repo/contributors",
    "subscribers_url": "https://api.github.com/repos/baxterandthehackers/public-repo/subscribers",
    "subscription_url": "https://api.github.com/repos/baxterandthehackers/public-repo/subscription",
    "commits_url": "https://api.github.com/repos/baxterandthehackers/public-repo/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/baxterandthehackers/public-repo/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/baxterandthehackers/public-repo/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/baxterandthehackers/public-repo/issues/comments{/number}",
    "contents_url": "https://api.github.com/repos/baxterandthehackers/public-repo/contents/{+path}",
    "compare_url": "https://api.github.com/repos/baxterandthehackers/public-repo/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/baxterandthehackers/public-repo/merges",
    "archive_url": "https://api.github.com/repos/baxterandthehackers/public-repo/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/baxterandthehackers/public-repo/downloads",
    "issues_url": "https://api.github.com/repos/baxterandthehackers/public-repo/issues{/number}",
    "pulls_url": "https://api.github.com/repos/baxterandthehackers/public-repo/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/baxterandthehackers/public-repo/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/baxterandthehackers/public-repo/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/baxterandthehackers/public-repo/labels{/name}",
    "releases_url": "https://api.github.com/repos/baxterandthehackers/public-repo/releases{/id}",
    "created_at": "2015-05-05T23:40:30Z",
    "updated_at": "2015-05-05T23:40:30Z",
    "pushed_at": "2015-05-05T23:40:27Z",
    "git_url": "git://github.com/baxterandthehackers/public-repo.git",
    "ssh_url": "git@github.com:baxterandthehackers/public-repo.git",
    "clone_url": "https://github.com/baxterandthehackers/public-repo.git",
    "svn_url": "https://github.com/baxterandthehackers/public-repo",
    "homepage": null,
    "size": 0,
    "stargazers_count": 0,
    "watchers_count": 0,
    "language": null,
    "has_issues": false,
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
  "organization": {
    "login": "baxterandthehackers",
    "id": 7649605,
    "url": "https://api.github.com/orgs/baxterandthehackers",
    "repos_url": "https://api.github.com/orgs/baxterandthehackers/repos",
    "events_url": "https://api.github.com/orgs/baxterandthehackers/events",
    "members_url": "https://api.github.com/orgs/baxterandthehackers/members{/member}",
    "public_members_url": "https://api.github.com/orgs/baxterandthehackers/public_members{/member}",
    "avatar_url": "https://avatars.githubusercontent.com/u/7649605?v=3",
    "description": null
  },
  "sender": {
    "login": "baxterandthehackers",
    "id": 7649605,
    "avatar_url": "https://avatars.githubusercontent.com/u/7649605?v=3",
    "gravatar_id": "",
    "url": "https://api.github.com/users/baxterandthehackers",
    "html_url": "https://github.com/baxterandthehackers",
    "followers_url": "https://api.github.com/users/baxterandthehackers/followers",
    "following_url": "https://api.github.com/users/baxterandthehackers/following{/other_user}",
    "gists_url": "https://api.github.com/users/baxterandthehackers/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/baxterandthehackers/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/baxterandthehackers/subscriptions",
    "organizations_url": "https://api.github.com/users/baxterandthehackers/orgs",
    "repos_url": "https://api.github.com/users/baxterandthehackers/repos",
    "events_url": "https://api.github.com/users/baxterandthehackers/events{/privacy}",
    "received_events_url": "https://api.github.com/users/baxterandthehackers/received_events",
    "type": "Organization",
    "site_admin": false
  }
}
```

--------------------------------------------------------------------------------

---[FILE: team__edited_description.json]---
Location: zulip-main/zerver/webhooks/github/fixtures/team__edited_description.json

```json
{
  "changes": {
    "description": {
      "from": "A temporary team so that I can get some webhook fixtures."
    }
  },
  "action": "edited",
  "team": {
    "name": "Testing",
    "id": 3835900,
    "node_id": "MDQ6VGVhbTM4MzU5MDA=",
    "slug": "testing",
    "description": "A temporary team so that I can get some webhook fixtures!",
    "privacy": "closed",
    "url": "https://api.github.com/organizations/14038814/team/3835900",
    "html_url": "https://github.com/orgs/dvm-bitspilani/teams/testing",
    "members_url": "https://api.github.com/organizations/14038814/team/3835900/members{/member}",
    "repositories_url": "https://api.github.com/organizations/14038814/team/3835900/repos",
    "permission": "pull",
    "parent": null
  },
  "organization": {
    "login": "dvm-bitspilani",
    "id": 14038814,
    "node_id": "MDEyOk9yZ2FuaXphdGlvbjE0MDM4ODE0",
    "url": "https://api.github.com/orgs/dvm-bitspilani",
    "repos_url": "https://api.github.com/orgs/dvm-bitspilani/repos",
    "events_url": "https://api.github.com/orgs/dvm-bitspilani/events",
    "hooks_url": "https://api.github.com/orgs/dvm-bitspilani/hooks",
    "issues_url": "https://api.github.com/orgs/dvm-bitspilani/issues",
    "members_url": "https://api.github.com/orgs/dvm-bitspilani/members{/member}",
    "public_members_url": "https://api.github.com/orgs/dvm-bitspilani/public_members{/member}",
    "avatar_url": "https://avatars3.githubusercontent.com/u/14038814?v=4",
    "description": ""
  },
  "sender": {
    "login": "Hypro999",
    "id": 29123352,
    "node_id": "MDQ6VXNlcjI5MTIzMzUy",
    "avatar_url": "https://avatars3.githubusercontent.com/u/29123352?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/Hypro999",
    "html_url": "https://github.com/Hypro999",
    "followers_url": "https://api.github.com/users/Hypro999/followers",
    "following_url": "https://api.github.com/users/Hypro999/following{/other_user}",
    "gists_url": "https://api.github.com/users/Hypro999/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/Hypro999/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/Hypro999/subscriptions",
    "organizations_url": "https://api.github.com/users/Hypro999/orgs",
    "repos_url": "https://api.github.com/users/Hypro999/repos",
    "events_url": "https://api.github.com/users/Hypro999/events{/privacy}",
    "received_events_url": "https://api.github.com/users/Hypro999/received_events",
    "type": "User",
    "site_admin": false
  }
}
```

--------------------------------------------------------------------------------

---[FILE: team__edited_name.json]---
Location: zulip-main/zerver/webhooks/github/fixtures/team__edited_name.json

```json
{
    "changes": {
        "name": {
            "from": "Testing"
        }
    },
    "action": "edited",
    "team": {
        "name": "Testing Team",
        "id": 3835900,
        "node_id": "MDQ6VGVhbTM4MzU5MDA=",
        "slug": "testing-team",
        "description": "A temporary team so that I can get some webhook fixtures!",
        "privacy": "closed",
        "url": "https://api.github.com/organizations/14038814/team/3835900",
        "html_url": "https://github.com/orgs/dvm-bitspilani/teams/testing-team",
        "members_url": "https://api.github.com/organizations/14038814/team/3835900/members{/member}",
        "repositories_url": "https://api.github.com/organizations/14038814/team/3835900/repos",
        "permission": "pull",
        "parent": null
    },
    "organization": {
        "login": "dvm-bitspilani",
        "id": 14038814,
        "node_id": "MDEyOk9yZ2FuaXphdGlvbjE0MDM4ODE0",
        "url": "https://api.github.com/orgs/dvm-bitspilani",
        "repos_url": "https://api.github.com/orgs/dvm-bitspilani/repos",
        "events_url": "https://api.github.com/orgs/dvm-bitspilani/events",
        "hooks_url": "https://api.github.com/orgs/dvm-bitspilani/hooks",
        "issues_url": "https://api.github.com/orgs/dvm-bitspilani/issues",
        "members_url": "https://api.github.com/orgs/dvm-bitspilani/members{/member}",
        "public_members_url": "https://api.github.com/orgs/dvm-bitspilani/public_members{/member}",
        "avatar_url": "https://avatars3.githubusercontent.com/u/14038814?v=4",
        "description": ""
    },
    "sender": {
        "login": "Hypro999",
        "id": 29123352,
        "node_id": "MDQ6VXNlcjI5MTIzMzUy",
        "avatar_url": "https://avatars3.githubusercontent.com/u/29123352?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/Hypro999",
        "html_url": "https://github.com/Hypro999",
        "followers_url": "https://api.github.com/users/Hypro999/followers",
        "following_url": "https://api.github.com/users/Hypro999/following{/other_user}",
        "gists_url": "https://api.github.com/users/Hypro999/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/Hypro999/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/Hypro999/subscriptions",
        "organizations_url": "https://api.github.com/users/Hypro999/orgs",
        "repos_url": "https://api.github.com/users/Hypro999/repos",
        "events_url": "https://api.github.com/users/Hypro999/events{/privacy}",
        "received_events_url": "https://api.github.com/users/Hypro999/received_events",
        "type": "User",
        "site_admin": false
    }
}
```

--------------------------------------------------------------------------------

---[FILE: team__edited_privacy_closed.json]---
Location: zulip-main/zerver/webhooks/github/fixtures/team__edited_privacy_closed.json

```json
{
  "changes": {
    "privacy": {
      "from": "secret"
    }
  },
  "action": "edited",
  "team": {
    "name": "Testing",
    "id": 3835900,
    "node_id": "MDQ6VGVhbTM4MzU5MDA=",
    "slug": "testing",
    "description": "A temporary team so that I can get some webhook fixtures!",
    "privacy": "closed",
    "url": "https://api.github.com/organizations/14038814/team/3835900",
    "html_url": "https://github.com/orgs/dvm-bitspilani/teams/testing",
    "members_url": "https://api.github.com/organizations/14038814/team/3835900/members{/member}",
    "repositories_url": "https://api.github.com/organizations/14038814/team/3835900/repos",
    "permission": "pull",
    "parent": null
  },
  "organization": {
    "login": "dvm-bitspilani",
    "id": 14038814,
    "node_id": "MDEyOk9yZ2FuaXphdGlvbjE0MDM4ODE0",
    "url": "https://api.github.com/orgs/dvm-bitspilani",
    "repos_url": "https://api.github.com/orgs/dvm-bitspilani/repos",
    "events_url": "https://api.github.com/orgs/dvm-bitspilani/events",
    "hooks_url": "https://api.github.com/orgs/dvm-bitspilani/hooks",
    "issues_url": "https://api.github.com/orgs/dvm-bitspilani/issues",
    "members_url": "https://api.github.com/orgs/dvm-bitspilani/members{/member}",
    "public_members_url": "https://api.github.com/orgs/dvm-bitspilani/public_members{/member}",
    "avatar_url": "https://avatars3.githubusercontent.com/u/14038814?v=4",
    "description": ""
  },
  "sender": {
    "login": "Hypro999",
    "id": 29123352,
    "node_id": "MDQ6VXNlcjI5MTIzMzUy",
    "avatar_url": "https://avatars3.githubusercontent.com/u/29123352?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/Hypro999",
    "html_url": "https://github.com/Hypro999",
    "followers_url": "https://api.github.com/users/Hypro999/followers",
    "following_url": "https://api.github.com/users/Hypro999/following{/other_user}",
    "gists_url": "https://api.github.com/users/Hypro999/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/Hypro999/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/Hypro999/subscriptions",
    "organizations_url": "https://api.github.com/users/Hypro999/orgs",
    "repos_url": "https://api.github.com/users/Hypro999/repos",
    "events_url": "https://api.github.com/users/Hypro999/events{/privacy}",
    "received_events_url": "https://api.github.com/users/Hypro999/received_events",
    "type": "User",
    "site_admin": false
  }
}
```

--------------------------------------------------------------------------------

---[FILE: team__edited_privacy_secret.json]---
Location: zulip-main/zerver/webhooks/github/fixtures/team__edited_privacy_secret.json

```json
{
  "changes": {
    "privacy": {
      "from": "closed"
    }
  },
  "action": "edited",
  "team": {
    "name": "Testing Team",
    "id": 3835900,
    "node_id": "MDQ6VGVhbTM4MzU5MDA=",
    "slug": "testing-team",
    "description": "A temporary team so that I can get some webhook fixtures!",
    "privacy": "secret",
    "url": "https://api.github.com/organizations/14038814/team/3835900",
    "html_url": "https://github.com/orgs/dvm-bitspilani/teams/testing-team",
    "members_url": "https://api.github.com/organizations/14038814/team/3835900/members{/member}",
    "repositories_url": "https://api.github.com/organizations/14038814/team/3835900/repos",
    "permission": "pull",
    "parent": null
  },
  "organization": {
    "login": "dvm-bitspilani",
    "id": 14038814,
    "node_id": "MDEyOk9yZ2FuaXphdGlvbjE0MDM4ODE0",
    "url": "https://api.github.com/orgs/dvm-bitspilani",
    "repos_url": "https://api.github.com/orgs/dvm-bitspilani/repos",
    "events_url": "https://api.github.com/orgs/dvm-bitspilani/events",
    "hooks_url": "https://api.github.com/orgs/dvm-bitspilani/hooks",
    "issues_url": "https://api.github.com/orgs/dvm-bitspilani/issues",
    "members_url": "https://api.github.com/orgs/dvm-bitspilani/members{/member}",
    "public_members_url": "https://api.github.com/orgs/dvm-bitspilani/public_members{/member}",
    "avatar_url": "https://avatars3.githubusercontent.com/u/14038814?v=4",
    "description": ""
  },
  "sender": {
    "login": "Hypro999",
    "id": 29123352,
    "node_id": "MDQ6VXNlcjI5MTIzMzUy",
    "avatar_url": "https://avatars3.githubusercontent.com/u/29123352?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/Hypro999",
    "html_url": "https://github.com/Hypro999",
    "followers_url": "https://api.github.com/users/Hypro999/followers",
    "following_url": "https://api.github.com/users/Hypro999/following{/other_user}",
    "gists_url": "https://api.github.com/users/Hypro999/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/Hypro999/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/Hypro999/subscriptions",
    "organizations_url": "https://api.github.com/users/Hypro999/orgs",
    "repos_url": "https://api.github.com/users/Hypro999/repos",
    "events_url": "https://api.github.com/users/Hypro999/events{/privacy}",
    "received_events_url": "https://api.github.com/users/Hypro999/received_events",
    "type": "User",
    "site_admin": false
  }
}
```

--------------------------------------------------------------------------------

---[FILE: tier_changed.json]---
Location: zulip-main/zerver/webhooks/github/fixtures/tier_changed.json

```json
{
    "action": "tier_changed",
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

````
