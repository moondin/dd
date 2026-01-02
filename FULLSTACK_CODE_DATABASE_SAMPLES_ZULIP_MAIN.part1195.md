---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1195
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1195 of 1290)

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

---[FILE: repository.json]---
Location: zulip-main/zerver/webhooks/github/fixtures/repository.json

```json
{
  "action": "created",
  "repository": {
    "id": 27496774,
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
    "fork": false,
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
    "issue_comment_url": "https://api.github.com/repos/baxterandthehackers/public-repo/issues/comments/{number}",
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
    "created_at": "2014-12-03T16:39:25Z",
    "updated_at": "2014-12-03T16:39:25Z",
    "pushed_at": "2014-12-03T16:39:25Z",
    "git_url": "git://github.com/baxterandthehackers/public-repo.git",
    "ssh_url": "git@github.com:baxterandthehackers/public-repo.git",
    "clone_url": "https://github.com/baxterandthehackers/public-repo.git",
    "svn_url": "https://github.com/baxterandthehackers/public-repo",
    "homepage": null,
    "size": 0,
    "stargazers_count": 0,
    "watchers_count": 0,
    "language": null,
    "has_issues": true,
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
  "organization": {
    "login": "baxterandthehackers",
    "id": 7649605,
    "url": "https://api.github.com/orgs/baxterandthehackers",
    "repos_url": "https://api.github.com/orgs/baxterandthehackers/repos",
    "events_url": "https://api.github.com/orgs/baxterandthehackers/events",
    "members_url": "https://api.github.com/orgs/baxterandthehackers/members{/member}",
    "public_members_url": "https://api.github.com/orgs/baxterandthehackers/public_members{/member}",
    "avatar_url": "https://avatars.githubusercontent.com/u/7649605?v=2"
  },
  "sender": {
    "login": "baxterthehacker",
    "id": 6752317,
    "avatar_url": "https://avatars.githubusercontent.com/u/6752317?v=2",
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

---[FILE: repository_private.json]---
Location: zulip-main/zerver/webhooks/github/fixtures/repository_private.json

```json
{
  "action": "created",
  "repository": {
    "id": 27496774,
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
    "private": true,
    "html_url": "https://github.com/baxterandthehackers/public-repo",
    "description": "",
    "fork": false,
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
    "issue_comment_url": "https://api.github.com/repos/baxterandthehackers/public-repo/issues/comments/{number}",
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
    "created_at": "2014-12-03T16:39:25Z",
    "updated_at": "2014-12-03T16:39:25Z",
    "pushed_at": "2014-12-03T16:39:25Z",
    "git_url": "git://github.com/baxterandthehackers/public-repo.git",
    "ssh_url": "git@github.com:baxterandthehackers/public-repo.git",
    "clone_url": "https://github.com/baxterandthehackers/public-repo.git",
    "svn_url": "https://github.com/baxterandthehackers/public-repo",
    "homepage": null,
    "size": 0,
    "stargazers_count": 0,
    "watchers_count": 0,
    "language": null,
    "has_issues": true,
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
  "organization": {
    "login": "baxterandthehackers",
    "id": 7649605,
    "url": "https://api.github.com/orgs/baxterandthehackers",
    "repos_url": "https://api.github.com/orgs/baxterandthehackers/repos",
    "events_url": "https://api.github.com/orgs/baxterandthehackers/events",
    "members_url": "https://api.github.com/orgs/baxterandthehackers/members{/member}",
    "public_members_url": "https://api.github.com/orgs/baxterandthehackers/public_members{/member}",
    "avatar_url": "https://avatars.githubusercontent.com/u/7649605?v=2"
  },
  "sender": {
    "login": "baxterthehacker",
    "id": 6752317,
    "avatar_url": "https://avatars.githubusercontent.com/u/6752317?v=2",
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

---[FILE: repository_vulnerability_alert.json]---
Location: zulip-main/zerver/webhooks/github/fixtures/repository_vulnerability_alert.json

```json
{
  "action": "dismiss",
  "alert": {
    "id": 7649605,
    "affected_range": "0.2.0",
    "affected_package_name": "many_versioned_gem",
    "external_reference": "https://nvd.nist.gov/vuln/detail/CVE-2018-3728",
    "external_identifier": "CVE-2018-3728",
    "fixed_in": "0.2.5",
    "dismisser": {
      "login":"octocat",
      "id":1,
      "node_id": "MDQ6VXNlcjIxMDMxMDY3",
      "avatar_url":"https://github.com/images/error/octocat_happy.gif",
      "gravatar_id":"",
      "url":"https://api.github.com/users/octocat",
      "html_url":"https://github.com/octocat",
      "followers_url":"https://api.github.com/users/octocat/followers",
      "following_url":"https://api.github.com/users/octocat/following{/other_user}",
      "gists_url":"https://api.github.com/users/octocat/gists{/gist_id}",
      "starred_url":"https://api.github.com/users/octocat/starred{/owner}{/repo}",
      "subscriptions_url":"https://api.github.com/users/octocat/subscriptions",
      "organizations_url":"https://api.github.com/users/octocat/orgs",
      "repos_url":"https://api.github.com/users/octocat/repos",
      "events_url":"https://api.github.com/users/octocat/events{/privacy}",
      "received_events_url":"https://api.github.com/users/octocat/received_events",
      "type":"User",
      "site_admin":true
    },
    "dismiss_reason": "No bandwidth to fix this",
    "dismissed_at": "2017-10-25T00:00:00+00:00"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: star.json]---
Location: zulip-main/zerver/webhooks/github/fixtures/star.json

```json
{
    "action": "created",
    "starred_at": "2019-05-15T15:20:40Z",
    "repository": {
        "id": 186853002,
        "node_id": "MDEwOlJlcG9zaXRvcnkxODY4NTMwMDI=",
        "name": "Hello-World",
        "full_name": "Codertocat/Hello-World",
        "private": false,
        "owner": {
            "login": "Codertocat",
            "id": 21031067,
            "node_id": "MDQ6VXNlcjIxMDMxMDY3",
            "avatar_url": "https://avatars1.githubusercontent.com/u/21031067?v=4",
            "gravatar_id": "",
            "url": "https://api.github.com/users/Codertocat",
            "html_url": "https://github.com/Codertocat",
            "followers_url": "https://api.github.com/users/Codertocat/followers",
            "following_url": "https://api.github.com/users/Codertocat/following{/other_user}",
            "gists_url": "https://api.github.com/users/Codertocat/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/Codertocat/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/Codertocat/subscriptions",
            "organizations_url": "https://api.github.com/users/Codertocat/orgs",
            "repos_url": "https://api.github.com/users/Codertocat/repos",
            "events_url": "https://api.github.com/users/Codertocat/events{/privacy}",
            "received_events_url": "https://api.github.com/users/Codertocat/received_events",
            "type": "User",
            "site_admin": false
        },
        "html_url": "https://github.com/Codertocat/Hello-World",
        "description": null,
        "fork": false,
        "url": "https://api.github.com/repos/Codertocat/Hello-World",
        "forks_url": "https://api.github.com/repos/Codertocat/Hello-World/forks",
        "keys_url": "https://api.github.com/repos/Codertocat/Hello-World/keys{/key_id}",
        "collaborators_url": "https://api.github.com/repos/Codertocat/Hello-World/collaborators{/collaborator}",
        "teams_url": "https://api.github.com/repos/Codertocat/Hello-World/teams",
        "hooks_url": "https://api.github.com/repos/Codertocat/Hello-World/hooks",
        "issue_events_url": "https://api.github.com/repos/Codertocat/Hello-World/issues/events{/number}",
        "events_url": "https://api.github.com/repos/Codertocat/Hello-World/events",
        "assignees_url": "https://api.github.com/repos/Codertocat/Hello-World/assignees{/user}",
        "branches_url": "https://api.github.com/repos/Codertocat/Hello-World/branches{/branch}",
        "tags_url": "https://api.github.com/repos/Codertocat/Hello-World/tags",
        "blobs_url": "https://api.github.com/repos/Codertocat/Hello-World/git/blobs{/sha}",
        "git_tags_url": "https://api.github.com/repos/Codertocat/Hello-World/git/tags{/sha}",
        "git_refs_url": "https://api.github.com/repos/Codertocat/Hello-World/git/refs{/sha}",
        "trees_url": "https://api.github.com/repos/Codertocat/Hello-World/git/trees{/sha}",
        "statuses_url": "https://api.github.com/repos/Codertocat/Hello-World/statuses/{sha}",
        "languages_url": "https://api.github.com/repos/Codertocat/Hello-World/languages",
        "stargazers_url": "https://api.github.com/repos/Codertocat/Hello-World/stargazers",
        "contributors_url": "https://api.github.com/repos/Codertocat/Hello-World/contributors",
        "subscribers_url": "https://api.github.com/repos/Codertocat/Hello-World/subscribers",
        "subscription_url": "https://api.github.com/repos/Codertocat/Hello-World/subscription",
        "commits_url": "https://api.github.com/repos/Codertocat/Hello-World/commits{/sha}",
        "git_commits_url": "https://api.github.com/repos/Codertocat/Hello-World/git/commits{/sha}",
        "comments_url": "https://api.github.com/repos/Codertocat/Hello-World/comments{/number}",
        "issue_comment_url": "https://api.github.com/repos/Codertocat/Hello-World/issues/comments{/number}",
        "contents_url": "https://api.github.com/repos/Codertocat/Hello-World/contents/{+path}",
        "compare_url": "https://api.github.com/repos/Codertocat/Hello-World/compare/{base}...{head}",
        "merges_url": "https://api.github.com/repos/Codertocat/Hello-World/merges",
        "archive_url": "https://api.github.com/repos/Codertocat/Hello-World/{archive_format}{/ref}",
        "downloads_url": "https://api.github.com/repos/Codertocat/Hello-World/downloads",
        "issues_url": "https://api.github.com/repos/Codertocat/Hello-World/issues{/number}",
        "pulls_url": "https://api.github.com/repos/Codertocat/Hello-World/pulls{/number}",
        "milestones_url": "https://api.github.com/repos/Codertocat/Hello-World/milestones{/number}",
        "notifications_url": "https://api.github.com/repos/Codertocat/Hello-World/notifications{?since,all,participating}",
        "labels_url": "https://api.github.com/repos/Codertocat/Hello-World/labels{/name}",
        "releases_url": "https://api.github.com/repos/Codertocat/Hello-World/releases{/id}",
        "deployments_url": "https://api.github.com/repos/Codertocat/Hello-World/deployments",
        "created_at": "2019-05-15T15:19:25Z",
        "updated_at": "2019-05-15T15:20:40Z",
        "pushed_at": "2019-05-15T15:20:33Z",
        "git_url": "git://github.com/Codertocat/Hello-World.git",
        "ssh_url": "git@github.com:Codertocat/Hello-World.git",
        "clone_url": "https://github.com/Codertocat/Hello-World.git",
        "svn_url": "https://github.com/Codertocat/Hello-World",
        "homepage": null,
        "size": 0,
        "stargazers_count": 1,
        "watchers_count": 1,
        "language": "Ruby",
        "has_issues": true,
        "has_projects": true,
        "has_downloads": true,
        "has_wiki": true,
        "has_pages": true,
        "forks_count": 0,
        "mirror_url": null,
        "archived": false,
        "disabled": false,
        "open_issues_count": 2,
        "license": null,
        "forks": 0,
        "open_issues": 2,
        "watchers": 1,
        "default_branch": "master"
    },
    "sender": {
        "login": "Codertocat",
        "id": 21031067,
        "node_id": "MDQ6VXNlcjIxMDMxMDY3",
        "avatar_url": "https://avatars1.githubusercontent.com/u/21031067?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/Codertocat",
        "html_url": "https://github.com/Codertocat",
        "followers_url": "https://api.github.com/users/Codertocat/followers",
        "following_url": "https://api.github.com/users/Codertocat/following{/other_user}",
        "gists_url": "https://api.github.com/users/Codertocat/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/Codertocat/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/Codertocat/subscriptions",
        "organizations_url": "https://api.github.com/users/Codertocat/orgs",
        "repos_url": "https://api.github.com/users/Codertocat/repos",
        "events_url": "https://api.github.com/users/Codertocat/events{/privacy}",
        "received_events_url": "https://api.github.com/users/Codertocat/received_events",
        "type": "User",
        "site_admin": false
    }
}
```

--------------------------------------------------------------------------------

---[FILE: status.json]---
Location: zulip-main/zerver/webhooks/github/fixtures/status.json

```json
{
  "id": 214015194,
  "sha": "9049f1265b7d61be4a8904a9a27120d2064dab3b",
  "name": "baxterthehacker/public-repo",
  "target_url": null,
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

````
