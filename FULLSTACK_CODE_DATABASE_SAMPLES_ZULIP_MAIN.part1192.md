---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1192
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1192 of 1290)

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

---[FILE: push__delete_branch.json]---
Location: zulip-main/zerver/webhooks/github/fixtures/push__delete_branch.json

```json
{
    "ref":"refs/heads/feature",
    "before":"2e8cf535fb38a3dab2476cdf856efda904ad4c94",
    "after":"0000000000000000000000000000000000000000",
    "created":false,
    "deleted":true,
    "forced":false,
    "base_ref":null,
    "compare":"https://github.com/eeshangarg/public-repo/compare/2e8cf535fb38...000000000000",
    "commits":[

    ],
    "head_commit":null,
    "repository":{
        "id":89799239,
        "name":"public-repo",
        "full_name":"eeshangarg/public-repo",
        "owner":{
            "name":"eeshangarg",
            "email":"jerryguitarist@gmail.com",
            "login":"eeshangarg",
            "id":7251823,
            "avatar_url":"https://avatars3.githubusercontent.com/u/7251823?v=3",
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
        },
        "private":false,
        "html_url":"https://github.com/eeshangarg/public-repo",
        "description":null,
        "fork":false,
        "url":"https://github.com/eeshangarg/public-repo",
        "forks_url":"https://api.github.com/repos/eeshangarg/public-repo/forks",
        "keys_url":"https://api.github.com/repos/eeshangarg/public-repo/keys{/key_id}",
        "collaborators_url":"https://api.github.com/repos/eeshangarg/public-repo/collaborators{/collaborator}",
        "teams_url":"https://api.github.com/repos/eeshangarg/public-repo/teams",
        "hooks_url":"https://api.github.com/repos/eeshangarg/public-repo/hooks",
        "issue_events_url":"https://api.github.com/repos/eeshangarg/public-repo/issues/events{/number}",
        "events_url":"https://api.github.com/repos/eeshangarg/public-repo/events",
        "assignees_url":"https://api.github.com/repos/eeshangarg/public-repo/assignees{/user}",
        "branches_url":"https://api.github.com/repos/eeshangarg/public-repo/branches{/branch}",
        "tags_url":"https://api.github.com/repos/eeshangarg/public-repo/tags",
        "blobs_url":"https://api.github.com/repos/eeshangarg/public-repo/git/blobs{/sha}",
        "git_tags_url":"https://api.github.com/repos/eeshangarg/public-repo/git/tags{/sha}",
        "git_refs_url":"https://api.github.com/repos/eeshangarg/public-repo/git/refs{/sha}",
        "trees_url":"https://api.github.com/repos/eeshangarg/public-repo/git/trees{/sha}",
        "statuses_url":"https://api.github.com/repos/eeshangarg/public-repo/statuses/{sha}",
        "languages_url":"https://api.github.com/repos/eeshangarg/public-repo/languages",
        "stargazers_url":"https://api.github.com/repos/eeshangarg/public-repo/stargazers",
        "contributors_url":"https://api.github.com/repos/eeshangarg/public-repo/contributors",
        "subscribers_url":"https://api.github.com/repos/eeshangarg/public-repo/subscribers",
        "subscription_url":"https://api.github.com/repos/eeshangarg/public-repo/subscription",
        "commits_url":"https://api.github.com/repos/eeshangarg/public-repo/commits{/sha}",
        "git_commits_url":"https://api.github.com/repos/eeshangarg/public-repo/git/commits{/sha}",
        "comments_url":"https://api.github.com/repos/eeshangarg/public-repo/comments{/number}",
        "issue_comment_url":"https://api.github.com/repos/eeshangarg/public-repo/issues/comments{/number}",
        "contents_url":"https://api.github.com/repos/eeshangarg/public-repo/contents/{+path}",
        "compare_url":"https://api.github.com/repos/eeshangarg/public-repo/compare/{base}...{head}",
        "merges_url":"https://api.github.com/repos/eeshangarg/public-repo/merges",
        "archive_url":"https://api.github.com/repos/eeshangarg/public-repo/{archive_format}{/ref}",
        "downloads_url":"https://api.github.com/repos/eeshangarg/public-repo/downloads",
        "issues_url":"https://api.github.com/repos/eeshangarg/public-repo/issues{/number}",
        "pulls_url":"https://api.github.com/repos/eeshangarg/public-repo/pulls{/number}",
        "milestones_url":"https://api.github.com/repos/eeshangarg/public-repo/milestones{/number}",
        "notifications_url":"https://api.github.com/repos/eeshangarg/public-repo/notifications{?since,all,participating}",
        "labels_url":"https://api.github.com/repos/eeshangarg/public-repo/labels{/name}",
        "releases_url":"https://api.github.com/repos/eeshangarg/public-repo/releases{/id}",
        "deployments_url":"https://api.github.com/repos/eeshangarg/public-repo/deployments",
        "created_at":1493484776,
        "updated_at":"2017-04-29T16:52:56Z",
        "pushed_at":1494897868,
        "git_url":"git://github.com/eeshangarg/public-repo.git",
        "ssh_url":"git@github.com:eeshangarg/public-repo.git",
        "clone_url":"https://github.com/eeshangarg/public-repo.git",
        "svn_url":"https://github.com/eeshangarg/public-repo",
        "homepage":null,
        "size":0,
        "stargazers_count":0,
        "watchers_count":0,
        "language":null,
        "has_issues":true,
        "has_projects":true,
        "has_downloads":true,
        "has_wiki":true,
        "has_pages":false,
        "forks_count":0,
        "mirror_url":null,
        "open_issues_count":0,
        "forks":0,
        "open_issues":0,
        "watchers":0,
        "default_branch":"changes",
        "stargazers":0,
        "master_branch":"changes"
    },
    "pusher":{
        "name":"eeshangarg",
        "email":"jerryguitarist@gmail.com"
    },
    "sender":{
        "login":"eeshangarg",
        "id":7251823,
        "avatar_url":"https://avatars3.githubusercontent.com/u/7251823?v=3",
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

---[FILE: push__event.json]---
Location: zulip-main/zerver/webhooks/github/fixtures/push__event.json

```json
{
  "ref": "refs/heads/changes",
  "before": "9049f1265b7d61be4a8904a9a27120d2064dab3b",
  "after": "0d1a26e67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c",
  "created": false,
  "deleted": false,
  "forced": false,
  "base_ref": null,
  "compare": "https://github.com/baxterthehacker/public-repo/compare/9049f1265b7d...0d1a26e67d8f",
  "commits": [
    {
      "id": "0d1a26e67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c",
      "tree_id": "f9d2a07e9488b91af2641b26b9407fe22a451433",
      "distinct": true,
      "message": "Update README.md",
      "timestamp": "2015-05-05T19:40:15-04:00",
      "url": "https://github.com/baxterthehacker/public-repo/commit/0d1a26e67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c",
      "author": {
        "name": "baxterthehacker",
        "email": "baxterthehacker@users.noreply.github.com",
        "username": "baxterthehacker"
      },
      "committer": {
        "name": "baxterthehacker",
        "email": "baxterthehacker@users.noreply.github.com",
        "username": "baxterthehacker"
      },
      "added": [

      ],
      "removed": [

      ],
      "modified": [
        "README.md"
      ]
    }
  ],
  "head_commit": {
    "id": "0d1a26e67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c",
    "tree_id": "f9d2a07e9488b91af2641b26b9407fe22a451433",
    "distinct": true,
    "message": "Update README.md",
    "timestamp": "2015-05-05T19:40:15-04:00",
    "url": "https://github.com/baxterthehacker/public-repo/commit/0d1a26e67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c",
    "author": {
      "name": "baxterthehacker",
      "email": "baxterthehacker@users.noreply.github.com",
      "username": "baxterthehacker"
    },
    "committer": {
      "name": "baxterthehacker",
      "email": "baxterthehacker@users.noreply.github.com",
      "username": "baxterthehacker"
    },
    "added": [

    ],
    "removed": [

    ],
    "modified": [
      "README.md"
    ]
  },
  "repository": {
    "id": 35129377,
    "name": "public-repo",
    "full_name": "baxterthehacker/public-repo",
    "owner": {
      "name": "baxterthehacker",
      "email": "baxterthehacker@users.noreply.github.com"
    },
    "private": false,
    "html_url": "https://github.com/baxterthehacker/public-repo",
    "description": "",
    "fork": false,
    "url": "https://github.com/baxterthehacker/public-repo",
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
    "created_at": 1430869212,
    "updated_at": "2015-05-05T23:40:12Z",
    "pushed_at": 1430869217,
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
    "default_branch": "master",
    "stargazers": 0,
    "master_branch": "master"
  },
  "pusher": {
    "name": "baxterthehacker",
    "email": "baxterthehacker@users.noreply.github.com"
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

---[FILE: push__force_1_commit.json]---
Location: zulip-main/zerver/webhooks/github/fixtures/push__force_1_commit.json

```json
{
    "ref": "refs/heads/temp",
    "before": "b6de8891fc10adb01e608ea01db326e99278fc70",
    "after": "971d76ca309446a9c20381f6271cea8a59b4e40a",
    "repository": {
        "id": 606370184,
        "node_id": "R_kgDOJCR5iA",
        "name": "zulip",
        "full_name": "sbansal1999/zulip",
        "private": false,
        "owner": {
            "name": "sbansal1999",
            "email": "sbansal1999@gmail.com",
            "login": "sbansal1999",
            "id": 35286603,
            "node_id": "MDQ6VXNlcjM1Mjg2NjAz",
            "avatar_url": "https://avatars.githubusercontent.com/u/35286603?v=4",
            "gravatar_id": "",
            "url": "https://api.github.com/users/sbansal1999",
            "html_url": "https://github.com/sbansal1999",
            "followers_url": "https://api.github.com/users/sbansal1999/followers",
            "following_url": "https://api.github.com/users/sbansal1999/following{/other_user}",
            "gists_url": "https://api.github.com/users/sbansal1999/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/sbansal1999/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/sbansal1999/subscriptions",
            "organizations_url": "https://api.github.com/users/sbansal1999/orgs",
            "repos_url": "https://api.github.com/users/sbansal1999/repos",
            "events_url": "https://api.github.com/users/sbansal1999/events{/privacy}",
            "received_events_url": "https://api.github.com/users/sbansal1999/received_events",
            "type": "User",
            "site_admin": false
        },
        "html_url": "https://github.com/sbansal1999/zulip",
        "description": "Zulip server and web application. Open-source team chat that helps teams stay productive and focused.",
        "fork": true,
        "url": "https://github.com/sbansal1999/zulip",
        "forks_url": "https://api.github.com/repos/sbansal1999/zulip/forks",
        "keys_url": "https://api.github.com/repos/sbansal1999/zulip/keys{/key_id}",
        "collaborators_url": "https://api.github.com/repos/sbansal1999/zulip/collaborators{/collaborator}",
        "teams_url": "https://api.github.com/repos/sbansal1999/zulip/teams",
        "hooks_url": "https://api.github.com/repos/sbansal1999/zulip/hooks",
        "issue_events_url": "https://api.github.com/repos/sbansal1999/zulip/issues/events{/number}",
        "events_url": "https://api.github.com/repos/sbansal1999/zulip/events",
        "assignees_url": "https://api.github.com/repos/sbansal1999/zulip/assignees{/user}",
        "branches_url": "https://api.github.com/repos/sbansal1999/zulip/branches{/branch}",
        "tags_url": "https://api.github.com/repos/sbansal1999/zulip/tags",
        "blobs_url": "https://api.github.com/repos/sbansal1999/zulip/git/blobs{/sha}",
        "git_tags_url": "https://api.github.com/repos/sbansal1999/zulip/git/tags{/sha}",
        "git_refs_url": "https://api.github.com/repos/sbansal1999/zulip/git/refs{/sha}",
        "trees_url": "https://api.github.com/repos/sbansal1999/zulip/git/trees{/sha}",
        "statuses_url": "https://api.github.com/repos/sbansal1999/zulip/statuses/{sha}",
        "languages_url": "https://api.github.com/repos/sbansal1999/zulip/languages",
        "stargazers_url": "https://api.github.com/repos/sbansal1999/zulip/stargazers",
        "contributors_url": "https://api.github.com/repos/sbansal1999/zulip/contributors",
        "subscribers_url": "https://api.github.com/repos/sbansal1999/zulip/subscribers",
        "subscription_url": "https://api.github.com/repos/sbansal1999/zulip/subscription",
        "commits_url": "https://api.github.com/repos/sbansal1999/zulip/commits{/sha}",
        "git_commits_url": "https://api.github.com/repos/sbansal1999/zulip/git/commits{/sha}",
        "comments_url": "https://api.github.com/repos/sbansal1999/zulip/comments{/number}",
        "issue_comment_url": "https://api.github.com/repos/sbansal1999/zulip/issues/comments{/number}",
        "contents_url": "https://api.github.com/repos/sbansal1999/zulip/contents/{+path}",
        "compare_url": "https://api.github.com/repos/sbansal1999/zulip/compare/{base}...{head}",
        "merges_url": "https://api.github.com/repos/sbansal1999/zulip/merges",
        "archive_url": "https://api.github.com/repos/sbansal1999/zulip/{archive_format}{/ref}",
        "downloads_url": "https://api.github.com/repos/sbansal1999/zulip/downloads",
        "issues_url": "https://api.github.com/repos/sbansal1999/zulip/issues{/number}",
        "pulls_url": "https://api.github.com/repos/sbansal1999/zulip/pulls{/number}",
        "milestones_url": "https://api.github.com/repos/sbansal1999/zulip/milestones{/number}",
        "notifications_url": "https://api.github.com/repos/sbansal1999/zulip/notifications{?since,all,participating}",
        "labels_url": "https://api.github.com/repos/sbansal1999/zulip/labels{/name}",
        "releases_url": "https://api.github.com/repos/sbansal1999/zulip/releases{/id}",
        "deployments_url": "https://api.github.com/repos/sbansal1999/zulip/deployments",
        "created_at": 1677317320,
        "updated_at": "2023-02-26T07:37:10Z",
        "pushed_at": 1683220524,
        "git_url": "git://github.com/sbansal1999/zulip.git",
        "ssh_url": "git@github.com:sbansal1999/zulip.git",
        "clone_url": "https://github.com/sbansal1999/zulip.git",
        "svn_url": "https://github.com/sbansal1999/zulip",
        "homepage": "https://zulip.com",
        "size": 394612,
        "stargazers_count": 0,
        "watchers_count": 0,
        "language": "Python",
        "has_issues": false,
        "has_projects": true,
        "has_downloads": true,
        "has_wiki": false,
        "has_pages": false,
        "has_discussions": false,
        "forks_count": 0,
        "mirror_url": null,
        "archived": false,
        "disabled": false,
        "open_issues_count": 6,
        "license": {
            "key": "apache-2.0",
            "name": "Apache License 2.0",
            "spdx_id": "Apache-2.0",
            "url": "https://api.github.com/licenses/apache-2.0",
            "node_id": "MDc6TGljZW5zZTI="
        },
        "allow_forking": true,
        "is_template": false,
        "web_commit_signoff_required": false,
        "topics": [],
        "visibility": "public",
        "forks": 0,
        "open_issues": 6,
        "watchers": 0,
        "default_branch": "main",
        "stargazers": 0,
        "master_branch": "main"
    },
    "pusher": {
        "name": "sbansal1999",
        "email": "sbansal1999@gmail.com"
    },
    "sender": {
        "login": "sbansal1999",
        "id": 35286603,
        "node_id": "MDQ6VXNlcjM1Mjg2NjAz",
        "avatar_url": "https://avatars.githubusercontent.com/u/35286603?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/sbansal1999",
        "html_url": "https://github.com/sbansal1999",
        "followers_url": "https://api.github.com/users/sbansal1999/followers",
        "following_url": "https://api.github.com/users/sbansal1999/following{/other_user}",
        "gists_url": "https://api.github.com/users/sbansal1999/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/sbansal1999/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/sbansal1999/subscriptions",
        "organizations_url": "https://api.github.com/users/sbansal1999/orgs",
        "repos_url": "https://api.github.com/users/sbansal1999/repos",
        "events_url": "https://api.github.com/users/sbansal1999/events{/privacy}",
        "received_events_url": "https://api.github.com/users/sbansal1999/received_events",
        "type": "User",
        "site_admin": false
    },
    "created": false,
    "deleted": false,
    "forced": true,
    "base_ref": null,
    "compare": "https://github.com/sbansal1999/zulip/compare/b6de8891fc10...971d76ca3094",
    "commits": [
        {
            "id": "971d76ca309446a9c20381f6271cea8a59b4e40a",
            "tree_id": "1e1050602fedd197200906a7042d789bca4fe820",
            "distinct": true,
            "message": "log: Add important.txt which is useful for logging errors.",
            "timestamp": "2023-05-04T22:44:40+05:30",
            "url": "https://github.com/sbansal1999/zulip/commit/971d76ca309446a9c20381f6271cea8a59b4e40a",
            "author": {
                "name": "sbansal1999",
                "email": "sbansal1999@gmail.com",
                "username": "sbansal1999"
            },
            "committer": {
                "name": "sbansal1999",
                "email": "sbansal1999@gmail.com",
                "username": "sbansal1999"
            },
            "added": [
                "important.txt"
            ],
            "removed": [],
            "modified": []
        }
    ],
    "head_commit": {
        "id": "971d76ca309446a9c20381f6271cea8a59b4e40a",
        "tree_id": "1e1050602fedd197200906a7042d789bca4fe820",
        "distinct": true,
        "message": "log: Add important.txt which is useful for logging errors.",
        "timestamp": "2023-05-04T22:44:40+05:30",
        "url": "https://github.com/sbansal1999/zulip/commit/971d76ca309446a9c20381f6271cea8a59b4e40a",
        "author": {
            "name": "sbansal1999",
            "email": "sbansal1999@gmail.com",
            "username": "sbansal1999"
        },
        "committer": {
            "name": "sbansal1999",
            "email": "sbansal1999@gmail.com",
            "username": "sbansal1999"
        },
        "added": [
            "important.txt"
        ],
        "removed": [],
        "modified": []
    }
}
```

--------------------------------------------------------------------------------

---[FILE: push__force_remove_commits.json]---
Location: zulip-main/zerver/webhooks/github/fixtures/push__force_remove_commits.json

```json
{
    "ref": "refs/heads/temp",
    "before": "2084a91af9ca7c71b4dd020fb973292d92884324",
    "after": "9a8749ea8fe78a9cde773c60acf54f81f82c5d7e",
    "repository": {
        "id": 606370184,
        "node_id": "R_kgDOJCR5iA",
        "name": "zulip",
        "full_name": "sbansal1999/zulip",
        "private": false,
        "owner": {
            "name": "sbansal1999",
            "email": "sbansal1999@gmail.com",
            "login": "sbansal1999",
            "id": 35286603,
            "node_id": "MDQ6VXNlcjM1Mjg2NjAz",
            "avatar_url": "https://avatars.githubusercontent.com/u/35286603?v=4",
            "gravatar_id": "",
            "url": "https://api.github.com/users/sbansal1999",
            "html_url": "https://github.com/sbansal1999",
            "followers_url": "https://api.github.com/users/sbansal1999/followers",
            "following_url": "https://api.github.com/users/sbansal1999/following{/other_user}",
            "gists_url": "https://api.github.com/users/sbansal1999/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/sbansal1999/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/sbansal1999/subscriptions",
            "organizations_url": "https://api.github.com/users/sbansal1999/orgs",
            "repos_url": "https://api.github.com/users/sbansal1999/repos",
            "events_url": "https://api.github.com/users/sbansal1999/events{/privacy}",
            "received_events_url": "https://api.github.com/users/sbansal1999/received_events",
            "type": "User",
            "site_admin": false
        },
        "html_url": "https://github.com/sbansal1999/zulip",
        "description": "Zulip server and web application. Open-source team chat that helps teams stay productive and focused.",
        "fork": true,
        "url": "https://github.com/sbansal1999/zulip",
        "forks_url": "https://api.github.com/repos/sbansal1999/zulip/forks",
        "keys_url": "https://api.github.com/repos/sbansal1999/zulip/keys{/key_id}",
        "collaborators_url": "https://api.github.com/repos/sbansal1999/zulip/collaborators{/collaborator}",
        "teams_url": "https://api.github.com/repos/sbansal1999/zulip/teams",
        "hooks_url": "https://api.github.com/repos/sbansal1999/zulip/hooks",
        "issue_events_url": "https://api.github.com/repos/sbansal1999/zulip/issues/events{/number}",
        "events_url": "https://api.github.com/repos/sbansal1999/zulip/events",
        "assignees_url": "https://api.github.com/repos/sbansal1999/zulip/assignees{/user}",
        "branches_url": "https://api.github.com/repos/sbansal1999/zulip/branches{/branch}",
        "tags_url": "https://api.github.com/repos/sbansal1999/zulip/tags",
        "blobs_url": "https://api.github.com/repos/sbansal1999/zulip/git/blobs{/sha}",
        "git_tags_url": "https://api.github.com/repos/sbansal1999/zulip/git/tags{/sha}",
        "git_refs_url": "https://api.github.com/repos/sbansal1999/zulip/git/refs{/sha}",
        "trees_url": "https://api.github.com/repos/sbansal1999/zulip/git/trees{/sha}",
        "statuses_url": "https://api.github.com/repos/sbansal1999/zulip/statuses/{sha}",
        "languages_url": "https://api.github.com/repos/sbansal1999/zulip/languages",
        "stargazers_url": "https://api.github.com/repos/sbansal1999/zulip/stargazers",
        "contributors_url": "https://api.github.com/repos/sbansal1999/zulip/contributors",
        "subscribers_url": "https://api.github.com/repos/sbansal1999/zulip/subscribers",
        "subscription_url": "https://api.github.com/repos/sbansal1999/zulip/subscription",
        "commits_url": "https://api.github.com/repos/sbansal1999/zulip/commits{/sha}",
        "git_commits_url": "https://api.github.com/repos/sbansal1999/zulip/git/commits{/sha}",
        "comments_url": "https://api.github.com/repos/sbansal1999/zulip/comments{/number}",
        "issue_comment_url": "https://api.github.com/repos/sbansal1999/zulip/issues/comments{/number}",
        "contents_url": "https://api.github.com/repos/sbansal1999/zulip/contents/{+path}",
        "compare_url": "https://api.github.com/repos/sbansal1999/zulip/compare/{base}...{head}",
        "merges_url": "https://api.github.com/repos/sbansal1999/zulip/merges",
        "archive_url": "https://api.github.com/repos/sbansal1999/zulip/{archive_format}{/ref}",
        "downloads_url": "https://api.github.com/repos/sbansal1999/zulip/downloads",
        "issues_url": "https://api.github.com/repos/sbansal1999/zulip/issues{/number}",
        "pulls_url": "https://api.github.com/repos/sbansal1999/zulip/pulls{/number}",
        "milestones_url": "https://api.github.com/repos/sbansal1999/zulip/milestones{/number}",
        "notifications_url": "https://api.github.com/repos/sbansal1999/zulip/notifications{?since,all,participating}",
        "labels_url": "https://api.github.com/repos/sbansal1999/zulip/labels{/name}",
        "releases_url": "https://api.github.com/repos/sbansal1999/zulip/releases{/id}",
        "deployments_url": "https://api.github.com/repos/sbansal1999/zulip/deployments",
        "created_at": 1677317320,
        "updated_at": "2023-02-26T07:37:10Z",
        "pushed_at": 1683201505,
        "git_url": "git://github.com/sbansal1999/zulip.git",
        "ssh_url": "git@github.com:sbansal1999/zulip.git",
        "clone_url": "https://github.com/sbansal1999/zulip.git",
        "svn_url": "https://github.com/sbansal1999/zulip",
        "homepage": "https://zulip.com",
        "size": 394610,
        "stargazers_count": 0,
        "watchers_count": 0,
        "language": "Python",
        "has_issues": false,
        "has_projects": true,
        "has_downloads": true,
        "has_wiki": false,
        "has_pages": false,
        "has_discussions": false,
        "forks_count": 0,
        "mirror_url": null,
        "archived": false,
        "disabled": false,
        "open_issues_count": 6,
        "license": {
            "key": "apache-2.0",
            "name": "Apache License 2.0",
            "spdx_id": "Apache-2.0",
            "url": "https://api.github.com/licenses/apache-2.0",
            "node_id": "MDc6TGljZW5zZTI="
        },
        "allow_forking": true,
        "is_template": false,
        "web_commit_signoff_required": false,
        "topics": [],
        "visibility": "public",
        "forks": 0,
        "open_issues": 6,
        "watchers": 0,
        "default_branch": "main",
        "stargazers": 0,
        "master_branch": "main"
    },
    "pusher": {
        "name": "sbansal1999",
        "email": "sbansal1999@gmail.com"
    },
    "sender": {
        "login": "sbansal1999",
        "id": 35286603,
        "node_id": "MDQ6VXNlcjM1Mjg2NjAz",
        "avatar_url": "https://avatars.githubusercontent.com/u/35286603?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/sbansal1999",
        "html_url": "https://github.com/sbansal1999",
        "followers_url": "https://api.github.com/users/sbansal1999/followers",
        "following_url": "https://api.github.com/users/sbansal1999/following{/other_user}",
        "gists_url": "https://api.github.com/users/sbansal1999/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/sbansal1999/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/sbansal1999/subscriptions",
        "organizations_url": "https://api.github.com/users/sbansal1999/orgs",
        "repos_url": "https://api.github.com/users/sbansal1999/repos",
        "events_url": "https://api.github.com/users/sbansal1999/events{/privacy}",
        "received_events_url": "https://api.github.com/users/sbansal1999/received_events",
        "type": "User",
        "site_admin": false
    },
    "created": false,
    "deleted": false,
    "forced": true,
    "base_ref": null,
    "compare": "https://github.com/sbansal1999/zulip/compare/2084a91af9ca...9a8749ea8fe7",
    "commits": [],
    "head_commit": {
        "id": "9a8749ea8fe78a9cde773c60acf54f81f82c5d7e",
        "tree_id": "44c09aa81080a562a6eb76d49ea060be03027582",
        "distinct": true,
        "message": "message_fetch: Fix stream narrows when everything recent is muted.",
        "timestamp": "2023-05-03T18:40:59-07:00",
        "url": "https://github.com/sbansal1999/zulip/commit/9a8749ea8fe78a9cde773c60acf54f81f82c5d7e",
        "author": {
            "name": "Tim Abbott",
            "email": "tabbott@zulip.com",
            "username": "timabbott"
        },
        "committer": {
            "name": "Tim Abbott",
            "email": "tabbott@zulip.com",
            "username": "timabbott"
        },
        "added": [],
        "removed": [],
        "modified": [
            "web/src/message_fetch.js"
        ]
    }
}
```

--------------------------------------------------------------------------------

````
