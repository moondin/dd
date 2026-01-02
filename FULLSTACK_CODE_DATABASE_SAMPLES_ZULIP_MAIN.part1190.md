---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1190
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1190 of 1290)

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

---[FILE: push__1_commit_private_repository.json]---
Location: zulip-main/zerver/webhooks/github/fixtures/push__1_commit_private_repository.json

```json
{
    "ref": "refs/heads/changes",
    "before": "9049f1265b7d61be4a8904a9a27120d2064dab3b",
    "after": "0d1a26e67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c",
    "created": false,
    "deleted": false,
    "forced": false,
    "base_ref": null,
    "compare": "https://github.com/baxterthehacker/private-repo/compare/9049f1265b7d...0d1a26e67d8f",
    "commits": [
      {
        "id": "0d1a26e67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c",
        "tree_id": "f9d2a07e9488b91af2641b26b9407fe22a451433",
        "distinct": true,
        "message": "Update README.md",
        "timestamp": "2015-05-05T19:40:15-04:00",
        "url": "https://github.com/baxterthehacker/private-repo/commit/0d1a26e67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c",
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
      "url": "https://github.com/baxterthehacker/private-repo/commit/0d1a26e67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c",
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
      "name": "private-repo",
      "full_name": "baxterthehacker/private-repo",
      "owner": {
        "name": "baxterthehacker",
        "email": "baxterthehacker@users.noreply.github.com"
      },
      "private": true,
      "html_url": "https://github.com/baxterthehacker/private-repo",
      "description": "",
      "fork": false,
      "url": "https://github.com/baxterthehacker/private-repo",
      "forks_url": "https://api.github.com/repos/baxterthehacker/private-repo/forks",
      "keys_url": "https://api.github.com/repos/baxterthehacker/private-repo/keys{/key_id}",
      "collaborators_url": "https://api.github.com/repos/baxterthehacker/private-repo/collaborators{/collaborator}",
      "teams_url": "https://api.github.com/repos/baxterthehacker/private-repo/teams",
      "hooks_url": "https://api.github.com/repos/baxterthehacker/private-repo/hooks",
      "issue_events_url": "https://api.github.com/repos/baxterthehacker/private-repo/issues/events{/number}",
      "events_url": "https://api.github.com/repos/baxterthehacker/private-repo/events",
      "assignees_url": "https://api.github.com/repos/baxterthehacker/private-repo/assignees{/user}",
      "branches_url": "https://api.github.com/repos/baxterthehacker/private-repo/branches{/branch}",
      "tags_url": "https://api.github.com/repos/baxterthehacker/private-repo/tags",
      "blobs_url": "https://api.github.com/repos/baxterthehacker/private-repo/git/blobs{/sha}",
      "git_tags_url": "https://api.github.com/repos/baxterthehacker/private-repo/git/tags{/sha}",
      "git_refs_url": "https://api.github.com/repos/baxterthehacker/private-repo/git/refs{/sha}",
      "trees_url": "https://api.github.com/repos/baxterthehacker/private-repo/git/trees{/sha}",
      "statuses_url": "https://api.github.com/repos/baxterthehacker/private-repo/statuses/{sha}",
      "languages_url": "https://api.github.com/repos/baxterthehacker/private-repo/languages",
      "stargazers_url": "https://api.github.com/repos/baxterthehacker/private-repo/stargazers",
      "contributors_url": "https://api.github.com/repos/baxterthehacker/private-repo/contributors",
      "subscribers_url": "https://api.github.com/repos/baxterthehacker/private-repo/subscribers",
      "subscription_url": "https://api.github.com/repos/baxterthehacker/private-repo/subscription",
      "commits_url": "https://api.github.com/repos/baxterthehacker/private-repo/commits{/sha}",
      "git_commits_url": "https://api.github.com/repos/baxterthehacker/private-repo/git/commits{/sha}",
      "comments_url": "https://api.github.com/repos/baxterthehacker/private-repo/comments{/number}",
      "issue_comment_url": "https://api.github.com/repos/baxterthehacker/private-repo/issues/comments{/number}",
      "contents_url": "https://api.github.com/repos/baxterthehacker/private-repo/contents/{+path}",
      "compare_url": "https://api.github.com/repos/baxterthehacker/private-repo/compare/{base}...{head}",
      "merges_url": "https://api.github.com/repos/baxterthehacker/private-repo/merges",
      "archive_url": "https://api.github.com/repos/baxterthehacker/private-repo/{archive_format}{/ref}",
      "downloads_url": "https://api.github.com/repos/baxterthehacker/private-repo/downloads",
      "issues_url": "https://api.github.com/repos/baxterthehacker/private-repo/issues{/number}",
      "pulls_url": "https://api.github.com/repos/baxterthehacker/private-repo/pulls{/number}",
      "milestones_url": "https://api.github.com/repos/baxterthehacker/private-repo/milestones{/number}",
      "notifications_url": "https://api.github.com/repos/baxterthehacker/private-repo/notifications{?since,all,participating}",
      "labels_url": "https://api.github.com/repos/baxterthehacker/private-repo/labels{/name}",
      "releases_url": "https://api.github.com/repos/baxterthehacker/private-repo/releases{/id}",
      "created_at": 1430869212,
      "updated_at": "2015-05-05T23:40:12Z",
      "pushed_at": 1430869217,
      "git_url": "git://github.com/baxterthehacker/private-repo.git",
      "ssh_url": "git@github.com:baxterthehacker/private-repo.git",
      "clone_url": "https://github.com/baxterthehacker/private-repo.git",
      "svn_url": "https://github.com/baxterthehacker/private-repo",
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

---[FILE: push__1_commit_without_username.json]---
Location: zulip-main/zerver/webhooks/github/fixtures/push__1_commit_without_username.json

```json
{
    "ref":"refs/heads/changes",
    "before":"0383613da871608c384cef652df7b61669156cac",
    "after":"2e8cf535fb38a3dab2476cdf856efda904ad4c94",
    "created":false,
    "deleted":false,
    "forced":false,
    "base_ref":null,
    "compare":"https://github.com/eeshangarg/public-repo/compare/0383613da871...2e8cf535fb38",
    "commits":[
        {
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
        }
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
        "pushed_at":1493485308,
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

````
