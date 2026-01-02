---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1193
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1193 of 1290)

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

---[FILE: push__local_branch_without_commits.json]---
Location: zulip-main/zerver/webhooks/github/fixtures/push__local_branch_without_commits.json

```json
{
    "ref":"refs/heads/feature",
    "before":"0000000000000000000000000000000000000000",
    "after":"2e8cf535fb38a3dab2476cdf856efda904ad4c94",
    "created":true,
    "deleted":false,
    "forced":false,
    "base_ref":"refs/heads/changes",
    "compare":"https://github.com/eeshangarg/public-repo/compare/feature",
    "commits":[

    ],
    "head_commit":{
        "id":"2e8cf535fb38a3dab2476cdf856efda904ad4c94",
        "tree_id":"09303be712bd8e923f9b227c8522257fa32ca7dc",
        "distinct":true,
        "message":"Update the README",
        "timestamp":"2017-04-29T14:31:31-02:30",
        "url":"https://github.com/eeshangarg/public-repo/commit/2e8cf535fb38a3dab2476cdf856efda904ad4c94",
        "author":{
            "name":"John Snow",
            "email":"johnsnow@got.com"
        },
        "committer":{
            "name":"Eeshan Garg",
            "email":"jerryguitarist@gmail.com",
            "username":"eeshangarg"
        },
        "added":[

        ],
        "removed":[

        ],
        "modified":[
            "README.md"
        ]
    },
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
        "pushed_at":1494977751,
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

---[FILE: push__merge_queue.json]---
Location: zulip-main/zerver/webhooks/github/fixtures/push__merge_queue.json

```json
{
    "ref": "refs/heads/gh-readonly-queue/main/pr-3072-287d30540ac5a1acc57d0bdc138fa81dee315f48",
    "before": "a6bd77bbe77ee6ae8f9686621b192d70fcf83e2b",
    "after": "0000000000000000000000000000000000000000",
    "repository": {
        "id": 353322834,
        "node_id": "MDEwOJllG9zcXaRcvknzNYyTzM4OUQD=",
        "name": "infra-core",
        "full_name": "some-organization/infra-core",
        "private": false,
        "owner": {
            "name": "some-organization",
            "email": null,
            "login": "some-organization",
            "id": 52709322,
            "node_id": "MDEyO9ky2ZuaXpFdhlGvjbzNzczMTO3Y",
            "avatar_url": "https://avatars.githubusercontent.com/u/52709322?v=4",
            "gravatar_id": "",
            "url": "https://api.github.com/users/some-organization",
            "html_url": "https://github.com/some-organization",
            "followers_url": "https://api.github.com/users/some-organization/followers",
            "following_url": "https://api.github.com/users/some-organization/following{/other_user}",
            "gists_url": "https://api.github.com/users/some-organization/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/some-organization/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/some-organization/subscriptions",
            "organizations_url": "https://api.github.com/users/some-organization/orgs",
            "repos_url": "https://api.github.com/users/some-organization/repos",
            "events_url": "https://api.github.com/users/some-organization/events{/privacy}",
            "received_events_url": "https://api.github.com/users/some-organization/received_events",
            "type": "Organization",
            "site_admin": false
        },
        "html_url": "https://github.com/some-organization/infra-core",
        "description": "Homo sapiens non urinat in ventum",
        "fork": false,
        "url": "https://github.com/some-organization/infra-core",
        "forks_url": "https://api.github.com/repos/some-organization/infra-core/forks",
        "keys_url": "https://api.github.com/repos/some-organization/infra-core/keys{/key_id}",
        "collaborators_url": "https://api.github.com/repos/some-organization/infra-core/collaborators{/collaborator}",
        "teams_url": "https://api.github.com/repos/some-organization/infra-core/teams",
        "hooks_url": "https://api.github.com/repos/some-organization/infra-core/hooks",
        "issue_events_url": "https://api.github.com/repos/some-organization/infra-core/issues/events{/number}",
        "events_url": "https://api.github.com/repos/some-organization/infra-core/events",
        "assignees_url": "https://api.github.com/repos/some-organization/infra-core/assignees{/user}",
        "branches_url": "https://api.github.com/repos/some-organization/infra-core/branches{/branch}",
        "tags_url": "https://api.github.com/repos/some-organization/infra-core/tags",
        "blobs_url": "https://api.github.com/repos/some-organization/infra-core/git/blobs{/sha}",
        "git_tags_url": "https://api.github.com/repos/some-organization/infra-core/git/tags{/sha}",
        "git_refs_url": "https://api.github.com/repos/some-organization/infra-core/git/refs{/sha}",
        "trees_url": "https://api.github.com/repos/some-organization/infra-core/git/trees{/sha}",
        "statuses_url": "https://api.github.com/repos/some-organization/infra-core/statuses/{sha}",
        "languages_url": "https://api.github.com/repos/some-organization/infra-core/languages",
        "stargazers_url": "https://api.github.com/repos/some-organization/infra-core/stargazers",
        "contributors_url": "https://api.github.com/repos/some-organization/infra-core/contributors",
        "subscribers_url": "https://api.github.com/repos/some-organization/infra-core/subscribers",
        "subscription_url": "https://api.github.com/repos/some-organization/infra-core/subscription",
        "commits_url": "https://api.github.com/repos/some-organization/infra-core/commits{/sha}",
        "git_commits_url": "https://api.github.com/repos/some-organization/infra-core/git/commits{/sha}",
        "comments_url": "https://api.github.com/repos/some-organization/infra-core/comments{/number}",
        "issue_comment_url": "https://api.github.com/repos/some-organization/infra-core/issues/comments{/number}",
        "contents_url": "https://api.github.com/repos/some-organization/infra-core/contents/{+path}",
        "compare_url": "https://api.github.com/repos/some-organization/infra-core/compare/{base}...{head}",
        "merges_url": "https://api.github.com/repos/some-organization/infra-core/merges",
        "archive_url": "https://api.github.com/repos/some-organization/infra-core/{archive_format}{/ref}",
        "downloads_url": "https://api.github.com/repos/some-organization/infra-core/downloads",
        "issues_url": "https://api.github.com/repos/some-organization/infra-core/issues{/number}",
        "pulls_url": "https://api.github.com/repos/some-organization/infra-core/pulls{/number}",
        "milestones_url": "https://api.github.com/repos/some-organization/infra-core/milestones{/number}",
        "notifications_url": "https://api.github.com/repos/some-organization/infra-core/notifications{?since,all,participating}",
        "labels_url": "https://api.github.com/repos/some-organization/infra-core/labels{/name}",
        "releases_url": "https://api.github.com/repos/some-organization/infra-core/releases{/id}",
        "deployments_url": "https://api.github.com/repos/some-organization/infra-core/deployments",
        "created_at": 1618165822,
        "updated_at": "2022-11-07T17:04:28Z",
        "pushed_at": 1670262117,
        "git_url": "git://github.com/some-organization/infra-core.git",
        "ssh_url": "git@github.com:some-organization/infra-core.git",
        "clone_url": "https://github.com/some-organization/infra-core.git",
        "svn_url": "https://github.com/some-organization/infra-core",
        "homepage": "https://github.com/orgs/some-organization/projects/7",
        "size": 23932,
        "stargazers_count": 4,
        "watchers_count": 4,
        "language": "Brainfuck",
        "has_issues": true,
        "has_projects": true,
        "has_downloads": true,
        "has_wiki": true,
        "has_pages": false,
        "has_discussions": true,
        "forks_count": 1,
        "mirror_url": null,
        "archived": false,
        "disabled": false,
        "open_issues_count": 130,
        "license": {
            "key": "other",
            "name": "Other",
            "spdx_id": "NOASSERTION",
            "url": null,
            "node_id": "MDc6GTjlW5ZZzAT="
        },
        "allow_forking": false,
        "is_template": false,
        "web_commit_signoff_required": false,
        "topics": [],
        "visibility": "private",
        "forks": 1,
        "open_issues": 130,
        "watchers": 4,
        "default_branch": "main",
        "stargazers": 4,
        "master_branch": "main",
        "organization": "some-organization"
    },
    "pusher": {
        "name": "none"
    },
    "organization": {
        "login": "some-organization",
        "id": 52709322,
        "node_id": "MDEyO9kZyFua2pXhGlvdjbzNcMzOTYz3",
        "url": "https://api.github.com/orgs/some-organization",
        "repos_url": "https://api.github.com/orgs/some-organization/repos",
        "events_url": "https://api.github.com/orgs/some-organization/events",
        "hooks_url": "https://api.github.com/orgs/some-organization/hooks",
        "issues_url": "https://api.github.com/orgs/some-organization/issues",
        "members_url": "https://api.github.com/orgs/some-organization/members{/member}",
        "public_members_url": "https://api.github.com/orgs/some-organization/public_members{/member}",
        "avatar_url": "https://avatars.githubusercontent.com/u/52709322?v=4",
        "description": "Plurality Media"
    },
    "installation": {
        "id": 17816238,
        "node_id": "MDIzklOdGunVcFm0WauSW9z5GFdsGb0FW9uaTMgM3zcNjg4="
    },
    "created": false,
    "deleted": true,
    "forced": false,
    "base_ref": null,
    "compare": "https://github.com/some-organization/infra-core/compare/a6bd77bbe77e...000000000000",
    "commits": [],
    "head_commit": null
}
```

--------------------------------------------------------------------------------

---[FILE: push__multiple_committers.json]---
Location: zulip-main/zerver/webhooks/github/fixtures/push__multiple_committers.json

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
    },
    {
      "id": "0d1a26e67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c",
      "tree_id": "f9d2a07e9488b91af2641b26b9407fe22a451433",
      "distinct": true,
      "message": "Update README.md",
      "timestamp": "2015-05-05T19:40:15-04:00",
      "url": "https://github.com/baxterthehacker/public-repo/commit/0d1a26e67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c",
      "author": {
        "name": "Tomasz Kolek",
        "email": "baxterthehacker@users.noreply.github.com",
        "username": "Tomasz"
      },
      "committer": {
        "name": "Tomasz Kolek",
        "email": "baxterthehacker@users.noreply.github.com",
        "username": "Tomasz"
      },
      "added": [

      ],
      "removed": [

      ],
      "modified": [
        "README.md"
      ]
    },
      {
      "id": "0d1a26e67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c",
      "tree_id": "f9d2a07e9488b91af2641b26b9407fe22a451433",
      "distinct": true,
      "message": "Update README.md",
      "timestamp": "2015-05-05T19:40:15-04:00",
      "url": "https://github.com/baxterthehacker/public-repo/commit/0d1a26e67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c",
      "author": {
        "name": "Tomasz Kolek",
        "email": "baxterthehacker@users.noreply.github.com",
        "username": "Tomasz"
      },
      "committer": {
        "name": "Tomasz Kolek",
        "email": "baxterthehacker@users.noreply.github.com",
        "username": "Tomasz"
      },
      "added": [

      ],
      "removed": [

      ],
      "modified": [
        "README.md"
      ]
    },
      {
      "id": "0d1a26e67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c",
      "tree_id": "f9d2a07e9488b91af2641b26b9407fe22a451433",
      "distinct": true,
      "message": "Update README.md",
      "timestamp": "2015-05-05T19:40:15-04:00",
      "url": "https://github.com/baxterthehacker/public-repo/commit/0d1a26e67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c",
      "author": {
        "name": "Tomasz Kolek",
        "email": "baxterthehacker@users.noreply.github.com",
        "username": "Tomasz"
      },
      "committer": {
        "name": "Tomasz Kolek",
        "email": "baxterthehacker@users.noreply.github.com",
        "username": "Tomasz"
      },
      "added": [

      ],
      "removed": [

      ],
      "modified": [
        "README.md"
      ]
    },
      {
      "id": "0d1a26e67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c",
      "tree_id": "f9d2a07e9488b91af2641b26b9407fe22a451433",
      "distinct": true,
      "message": "Update README.md",
      "timestamp": "2015-05-05T19:40:15-04:00",
      "url": "https://github.com/baxterthehacker/public-repo/commit/0d1a26e67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c",
      "author": {
        "name": "Ben Simon",
        "email": "baxterthehacker@users.noreply.github.com",
        "username": "Ben"
      },
      "committer": {
        "name": "Ben Simon",
        "email": "baxterthehacker@users.noreply.github.com",
        "username": "Ben"
      },
      "added": [

      ],
      "removed": [

      ],
      "modified": [
        "README.md"
      ]
    },
      {
      "id": "0d1a26e67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c",
      "tree_id": "f9d2a07e9488b91af2641b26b9407fe22a451433",
      "distinct": true,
      "message": "Update README.md",
      "timestamp": "2015-05-05T19:40:15-04:00",
      "url": "https://github.com/baxterthehacker/public-repo/commit/0d1a26e67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c",
      "author": {
        "name": "Ben Simon",
        "email": "baxterthehacker@users.noreply.github.com",
        "username": "Ben"
      },
      "committer": {
        "name": "Ben Simon",
        "email": "baxterthehacker@users.noreply.github.com",
        "username": "Ben"
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

````
