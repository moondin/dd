---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1117
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1117 of 1290)

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

---[FILE: code_push__local_branch_without_commits.json]---
Location: zulip-main/zerver/webhooks/azuredevops/fixtures/code_push__local_branch_without_commits.json

```json
{
    "subscriptionId": "eead0877-fb06-46e2-9ec1-5f852a6d0297",
    "notificationId": 3,
    "id": "7687ae00-23fe-44e8-a66b-bb61d279e2e1",
    "eventType": "git.push",
    "publisherId": "tfs",
    "message": {
      "text": "Yuro Itaki pushed updates to test-zulip:dev\r\n(https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/#version=GBdev)",
      "html": "Yuro Itaki pushed updates to <a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/\">test-zulip</a>:<a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/#version=GBdev\">dev</a>",
      "markdown": "Yuro Itaki pushed updates to [test-zulip](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/):[dev](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/#version=GBdev)"
    },
    "detailedMessage": {
      "text": "Yuro Itaki pushed a commit to test-zulip:dev\r\n - Add reply 0929a340 (https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/commit/0929a3404b39f6e39076a640779b2c1c961e19b5)",
      "html": "Yuro Itaki pushed a commit to <a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/\">test-zulip</a>:<a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/#version=GBdev\">dev</a>\r\n<ul>\r\n<li>Add reply <a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/commit/0929a3404b39f6e39076a640779b2c1c961e19b5\">0929a340</a></li>\r\n</ul>",
      "markdown": "Yuro Itaki pushed a commit to [test-zulip](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/):[dev](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/#version=GBdev)\r\n* Add reply [0929a340](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/commit/0929a3404b39f6e39076a640779b2c1c961e19b5)"
    },
    "resource": {
      "refUpdates": [
        {
          "name": "refs/heads/dev",
          "oldObjectId": "0000000000000000000000000000000000000000",
          "newObjectId": "0929a3404b39f6e39076a640779b2c1c961e19b5"
        }
      ],
      "repository": {
        "id": "98f0ce59-a912-43d5-96d2-bc0942a03f7b",
        "name": "test-zulip",
        "url": "https://dev.azure.com/ttchong/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b",
        "project": {
          "id": "068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2",
          "name": "test-zulip",
          "url": "https://dev.azure.com/ttchong/_apis/projects/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2",
          "state": "wellFormed",
          "visibility": "unchanged",
          "lastUpdateTime": "0001-01-01T00:00:00"
        },
        "defaultBranch": "refs/heads/main",
        "remoteUrl": "https://dev.azure.com/ttchong/test-zulip/_git/test-zulip"
      },
      "pushedBy": {
        "displayName": "Yuro Itaki",
        "url": "https://spsprodsea2.vssps.visualstudio.com/Aa56cba4a-dc80-4dd2-91fa-6fe7047fea7c/_apis/Identities/107e08c7-2725-675e-a1b0-281729035ea6",
        "_links": {
          "avatar": {
            "href": "https://dev.azure.com/ttchong/_apis/GraphProfile/MemberAvatars/msa.MTA3ZTA4YzctMjcyNS03NzVlLWExYjAtMjgxNzI5MDM1ZWE2"
          }
        },
        "id": "107e08c7-2725-675e-a1b0-281729035ea6",
        "uniqueName": "yuroitaki@email.com",
        "imageUrl": "https://dev.azure.com/ttchong/_api/_common/identityImage?id=107e08c7-2725-675e-a1b0-281729035ea6",
        "descriptor": "msa.MTA3ZTA4YzctMjcyNS03NzVlLWExYjAtMjgxNzI5MDM1ZWE2"
      },
      "pushId": 5,
      "date": "2022-07-17T10:18:15.3667447Z",
      "url": "https://dev.azure.com/ttchong/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/pushes/5",
      "_links": {
        "self": {
          "href": "https://dev.azure.com/ttchong/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/pushes/5"
        },
        "repository": {
          "href": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b"
        },
        "commits": {
          "href": "https://dev.azure.com/ttchong/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/pushes/5/commits"
        },
        "pusher": {
          "href": "https://spsprodsea2.vssps.visualstudio.com/Aa56cba4a-dc80-4dd2-91fa-6fe7047fea7c/_apis/Identities/107e08c7-2725-675e-a1b0-281729035ea6"
        },
        "refs": {
          "href": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/refs/heads/dev"
        }
      }
    },
    "resourceVersion": "1.0",
    "resourceContainers": {
      "collection": {
        "id": "ad9e1dcf-6055-4fc7-a146-5511ab5ab1e8",
        "baseUrl": "https://dev.azure.com/ttchong/"
      },
      "account": {
        "id": "a56cba4a-dc80-4dd2-91fa-6fe7047fea7c",
        "baseUrl": "https://dev.azure.com/ttchong/"
      },
      "project": {
        "id": "068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2",
        "baseUrl": "https://dev.azure.com/ttchong/"
      }
    },
    "createdDate": "2022-07-17T10:18:22.69149Z"
}
```

--------------------------------------------------------------------------------

---[FILE: code_push__multiple_committers.json]---
Location: zulip-main/zerver/webhooks/azuredevops/fixtures/code_push__multiple_committers.json

```json
{
    "subscriptionId": "eead0877-fb06-46e2-9ec1-5f852a6d0297",
    "notificationId": 2,
    "id": "7afcf4e6-f3d0-47f0-ba5f-395f0776496b",
    "eventType": "git.push",
    "publisherId": "tfs",
    "message": {
      "text": "Yuro Itaki pushed updates to test-zulip:main\r\n(https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/#version=GBmain)",
      "html": "Yuro Itaki pushed updates to <a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/\">test-zulip</a>:<a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/#version=GBmain\">main</a>",
      "markdown": "Yuro Itaki pushed updates to [test-zulip](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/):[main](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/#version=GBmain)"
    },
    "detailedMessage": {
      "text": "Yuro Itaki pushed 2 commits to test-zulip:main\r\n - Add reply 0929a340 (https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/commit/0929a3404b39f6e39076a640779b2c1c961e19b5)\r\n - Add how are you 819ce8de (https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/commit/819ce8de51bedfc250c202edcaee0ce8dc70bf3b)",
      "html": "Yuro Itaki pushed 2 commits to <a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/\">test-zulip</a>:<a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/#version=GBmain\">main</a>\r\n<ul>\r\n<li>Add reply <a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/commit/0929a3404b39f6e39076a640779b2c1c961e19b5\">0929a340</a></li>\r\n<li>Add how are you <a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/commit/819ce8de51bedfc250c202edcaee0ce8dc70bf3b\">819ce8de</a></li>\r\n</ul>",
      "markdown": "Yuro Itaki pushed 2 commits to [test-zulip](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/):[main](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/#version=GBmain)\r\n* Add reply [0929a340](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/commit/0929a3404b39f6e39076a640779b2c1c961e19b5)\r\n* Add how are you [819ce8de](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/commit/819ce8de51bedfc250c202edcaee0ce8dc70bf3b)"
    },
    "resource": {
      "commits": [
        {
          "commitId": "0929a3404b39f6e39076a640779b2c1c961e19b5",
          "author": {
            "name": "Yuro Itaki",
            "email": "yuroitaki@email.com",
            "date": "2022-07-17T09:13:02Z"
          },
          "committer": {
            "name": "Yuro Itaki",
            "email": "yuroitaki@email.com",
            "date": "2022-07-17T09:13:02Z"
          },
          "comment": "Add reply",
          "url": "https://dev.azure.com/ttchong/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/commits/0929a3404b39f6e39076a640779b2c1c961e19b5"
        },
        {
          "commitId": "819ce8de51bedfc250c202edcaee0ce8dc70bf3b",
          "author": {
            "name": "Itachi Sensei",
            "email": "itachisensei@email.com",
            "date": "2022-07-17T09:12:35Z"
          },
          "committer": {
            "name": "Itachi Sensei",
            "email": "itachisensei@email.com",
            "date": "2022-07-17T09:12:35Z"
          },
          "comment": "Add how are you",
          "url": "https://dev.azure.com/ttchong/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/commits/819ce8de51bedfc250c202edcaee0ce8dc70bf3b"
        }
      ],
      "refUpdates": [
        {
          "name": "refs/heads/main",
          "oldObjectId": "cc21b940719cc372b364d932eb39e528b0ec2a91",
          "newObjectId": "0929a3404b39f6e39076a640779b2c1c961e19b5"
        }
      ],
      "repository": {
        "id": "98f0ce59-a912-43d5-96d2-bc0942a03f7b",
        "name": "test-zulip",
        "url": "https://dev.azure.com/ttchong/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b",
        "project": {
          "id": "068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2",
          "name": "test-zulip",
          "url": "https://dev.azure.com/ttchong/_apis/projects/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2",
          "state": "wellFormed",
          "visibility": "unchanged",
          "lastUpdateTime": "0001-01-01T00:00:00"
        },
        "defaultBranch": "refs/heads/main",
        "remoteUrl": "https://dev.azure.com/ttchong/test-zulip/_git/test-zulip"
      },
      "pushedBy": {
        "displayName": "Yuro Itaki",
        "url": "https://spsprodsea2.vssps.visualstudio.com/Aa56cba4a-dc80-4dd2-91fa-6fe7047fea7c/_apis/Identities/107e08c7-2725-675e-a1b0-281729035ea6",
        "_links": {
          "avatar": {
            "href": "https://dev.azure.com/ttchong/_apis/GraphProfile/MemberAvatars/msa.MTA3ZTA4YzctMjcyNS03NzVlLWExYjAtMjgxNzI5MDM1ZWE2"
          }
        },
        "id": "107e08c7-2725-675e-a1b0-281729035ea6",
        "uniqueName": "yuroitaki@email.com",
        "imageUrl": "https://dev.azure.com/ttchong/_api/_common/identityImage?id=107e08c7-2725-675e-a1b0-281729035ea6",
        "descriptor": "msa.MTA3ZTA4YzctMjcyNS03NzVlLWExYjAtMjgxNzI5MDM1ZWE2"
      },
      "pushId": 4,
      "date": "2022-07-17T09:13:10.0775053Z",
      "url": "https://dev.azure.com/ttchong/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/pushes/4",
      "_links": {
        "self": {
          "href": "https://dev.azure.com/ttchong/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/pushes/4"
        },
        "repository": {
          "href": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b"
        },
        "commits": {
          "href": "https://dev.azure.com/ttchong/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/pushes/4/commits"
        },
        "pusher": {
          "href": "https://spsprodsea2.vssps.visualstudio.com/Aa56cba4a-dc80-4dd2-91fa-6fe7047fea7c/_apis/Identities/107e08c7-2725-675e-a1b0-281729035ea6"
        },
        "refs": {
          "href": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/refs/heads/main"
        }
      }
    },
    "resourceVersion": "1.0",
    "resourceContainers": {
      "collection": {
        "id": "ad9e1dcf-6055-4fc7-a146-5511ab5ab1e8",
        "baseUrl": "https://dev.azure.com/ttchong/"
      },
      "account": {
        "id": "a56cba4a-dc80-4dd2-91fa-6fe7047fea7c",
        "baseUrl": "https://dev.azure.com/ttchong/"
      },
      "project": {
        "id": "068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2",
        "baseUrl": "https://dev.azure.com/ttchong/"
      }
    },
    "createdDate": "2022-07-17T09:13:17.0920723Z"
}
```

--------------------------------------------------------------------------------

---[FILE: code_push__multiple_committers_with_others.json]---
Location: zulip-main/zerver/webhooks/azuredevops/fixtures/code_push__multiple_committers_with_others.json

```json
{
    "subscriptionId": "eead0877-fb06-46e2-9ec1-5f852a6d0297",
    "notificationId": 2,
    "id": "7afcf4e6-f3d0-47f0-ba5f-395f0776496b",
    "eventType": "git.push",
    "publisherId": "tfs",
    "message": {
      "text": "Yuro Itaki pushed updates to test-zulip:main\r\n(https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/#version=GBmain)",
      "html": "Yuro Itaki pushed updates to <a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/\">test-zulip</a>:<a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/#version=GBmain\">main</a>",
      "markdown": "Yuro Itaki pushed updates to [test-zulip](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/):[main](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/#version=GBmain)"
    },
    "detailedMessage": {
      "text": "Yuro Itaki pushed 6 commits to test-zulip:main\r\n - Add reply 0929a340 (https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/commit/0929a3404b39f6e39076a640779b2c1c961e19b5)\r\n - Add how are you 819ce8de (https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/commit/819ce8de51bedfc250c202edcaee0ce8dc70bf3b)",
      "html": "Yuro Itaki pushed 6 commits to <a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/\">test-zulip</a>:<a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/#version=GBmain\">main</a>\r\n<ul>\r\n<li>Add reply <a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/commit/0929a3404b39f6e39076a640779b2c1c961e19b5\">0929a340</a></li>\r\n<li>Add how are you <a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/commit/819ce8de51bedfc250c202edcaee0ce8dc70bf3b\">819ce8de</a></li>\r\n</ul>",
      "markdown": "Yuro Itaki pushed 6 commits to [test-zulip](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/):[main](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/#version=GBmain)\r\n* Add reply [0929a340](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/commit/0929a3404b39f6e39076a640779b2c1c961e19b5)\r\n* Add how are you [819ce8de](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/commit/819ce8de51bedfc250c202edcaee0ce8dc70bf3b)"
    },
    "resource": {
      "commits": [
        {
          "commitId": "0929a3404b39f6e39076a640779b2c1c961e19b5",
          "author": {
            "name": "Yuro Itaki",
            "email": "yuroitaki@email.com",
            "date": "2022-07-17T09:13:02Z"
          },
          "committer": {
            "name": "Yuro Itaki",
            "email": "yuroitaki@email.com",
            "date": "2022-07-17T09:13:02Z"
          },
          "comment": "Add reply",
          "url": "https://dev.azure.com/ttchong/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/commits/0929a3404b39f6e39076a640779b2c1c961e19b5"
        },
        {
          "commitId": "819ce8de51bedfc250c202edcaee0ce8dc70bf3b",
          "author": {
            "name": "Itachi Sensei",
            "email": "itachisensei@email.com",
            "date": "2022-07-17T09:12:35Z"
          },
          "committer": {
            "name": "Itachi Sensei",
            "email": "itachisensei@email.com",
            "date": "2022-07-17T09:12:35Z"
          },
          "comment": "Add how are you",
          "url": "https://dev.azure.com/ttchong/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/commits/819ce8de51bedfc250c202edcaee0ce8dc70bf3b"
        },
        {
            "commitId": "819ce8de51bedfc250c202edcaee0ce8dc70bf3b",
            "author": {
              "name": "Itachi Sensei",
              "email": "itachisensei@email.com",
              "date": "2022-07-17T09:12:35Z"
            },
            "committer": {
              "name": "Itachi Sensei",
              "email": "itachisensei@email.com",
              "date": "2022-07-17T09:12:35Z"
            },
            "comment": "Add how are you",
            "url": "https://dev.azure.com/ttchong/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/commits/819ce8de51bedfc250c202edcaee0ce8dc70bf3b"
        },
        {
            "commitId": "819ce8de51bedfc250c202edcaee0ce8dc70bf3b",
            "author": {
              "name": "Lelouch Strange",
              "email": "lelouchstrange@email.com",
              "date": "2022-07-17T09:12:35Z"
            },
            "committer": {
              "name": "Lelouch Strange",
              "email": "lelouchstrange@email.com",
              "date": "2022-07-17T09:12:35Z"
            },
            "comment": "Add how are you",
            "url": "https://dev.azure.com/ttchong/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/commits/819ce8de51bedfc250c202edcaee0ce8dc70bf3b"
        },
        {
            "commitId": "819ce8de51bedfc250c202edcaee0ce8dc70bf3b",
            "author": {
              "name": "Jonas Nielsen",
              "email": "jonasnielsen@email.com",
              "date": "2022-07-17T09:12:35Z"
            },
            "committer": {
              "name": "Jonas Nielsen",
              "email": "jonasnielsen@email.com",
              "date": "2022-07-17T09:12:35Z"
            },
            "comment": "Add how are you",
            "url": "https://dev.azure.com/ttchong/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/commits/819ce8de51bedfc250c202edcaee0ce8dc70bf3b"
        },
        {
            "commitId": "0929a3404b39f6e39076a640779b2c1c961e19b5",
            "author": {
              "name": "Yuro Itaki",
              "email": "yuroitaki@email.com",
              "date": "2022-07-17T09:13:02Z"
            },
            "committer": {
              "name": "Yuro Itaki",
              "email": "yuroitaki@email.com",
              "date": "2022-07-17T09:13:02Z"
            },
            "comment": "Add reply",
            "url": "https://dev.azure.com/ttchong/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/commits/0929a3404b39f6e39076a640779b2c1c961e19b5"
        }
      ],
      "refUpdates": [
        {
          "name": "refs/heads/main",
          "oldObjectId": "cc21b940719cc372b364d932eb39e528b0ec2a91",
          "newObjectId": "0929a3404b39f6e39076a640779b2c1c961e19b5"
        }
      ],
      "repository": {
        "id": "98f0ce59-a912-43d5-96d2-bc0942a03f7b",
        "name": "test-zulip",
        "url": "https://dev.azure.com/ttchong/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b",
        "project": {
          "id": "068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2",
          "name": "test-zulip",
          "url": "https://dev.azure.com/ttchong/_apis/projects/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2",
          "state": "wellFormed",
          "visibility": "unchanged",
          "lastUpdateTime": "0001-01-01T00:00:00"
        },
        "defaultBranch": "refs/heads/main",
        "remoteUrl": "https://dev.azure.com/ttchong/test-zulip/_git/test-zulip"
      },
      "pushedBy": {
        "displayName": "Yuro Itaki",
        "url": "https://spsprodsea2.vssps.visualstudio.com/Aa56cba4a-dc80-4dd2-91fa-6fe7047fea7c/_apis/Identities/107e08c7-2725-675e-a1b0-281729035ea6",
        "_links": {
          "avatar": {
            "href": "https://dev.azure.com/ttchong/_apis/GraphProfile/MemberAvatars/msa.MTA3ZTA4YzctMjcyNS03NzVlLWExYjAtMjgxNzI5MDM1ZWE2"
          }
        },
        "id": "107e08c7-2725-675e-a1b0-281729035ea6",
        "uniqueName": "yuroitaki@email.com",
        "imageUrl": "https://dev.azure.com/ttchong/_api/_common/identityImage?id=107e08c7-2725-675e-a1b0-281729035ea6",
        "descriptor": "msa.MTA3ZTA4YzctMjcyNS03NzVlLWExYjAtMjgxNzI5MDM1ZWE2"
      },
      "pushId": 4,
      "date": "2022-07-17T09:13:10.0775053Z",
      "url": "https://dev.azure.com/ttchong/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/pushes/4",
      "_links": {
        "self": {
          "href": "https://dev.azure.com/ttchong/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/pushes/4"
        },
        "repository": {
          "href": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b"
        },
        "commits": {
          "href": "https://dev.azure.com/ttchong/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/pushes/4/commits"
        },
        "pusher": {
          "href": "https://spsprodsea2.vssps.visualstudio.com/Aa56cba4a-dc80-4dd2-91fa-6fe7047fea7c/_apis/Identities/107e08c7-2725-675e-a1b0-281729035ea6"
        },
        "refs": {
          "href": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/refs/heads/main"
        }
      }
    },
    "resourceVersion": "1.0",
    "resourceContainers": {
      "collection": {
        "id": "ad9e1dcf-6055-4fc7-a146-5511ab5ab1e8",
        "baseUrl": "https://dev.azure.com/ttchong/"
      },
      "account": {
        "id": "a56cba4a-dc80-4dd2-91fa-6fe7047fea7c",
        "baseUrl": "https://dev.azure.com/ttchong/"
      },
      "project": {
        "id": "068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2",
        "baseUrl": "https://dev.azure.com/ttchong/"
      }
    },
    "createdDate": "2022-07-17T09:13:17.0920723Z"
}
```

--------------------------------------------------------------------------------

---[FILE: code_push__remove_branch.json]---
Location: zulip-main/zerver/webhooks/azuredevops/fixtures/code_push__remove_branch.json

```json
{
    "subscriptionId": "eead0877-fb06-46e2-9ec1-5f852a6d0297",
    "notificationId": 4,
    "id": "91264257-1f51-46d3-bba3-5448d40a724a",
    "eventType": "git.push",
    "publisherId": "tfs",
    "message": {
      "text": "Yuro Itaki deleted test-zulip:dev\r\n(https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/#version=GBdev)",
      "html": "Yuro Itaki deleted <a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/\">test-zulip</a>:dev",
      "markdown": "Yuro Itaki deleted [test-zulip](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/):dev"
    },
    "detailedMessage": {
      "text": "Yuro Itaki deleted test-zulip:dev",
      "html": "Yuro Itaki deleted <a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/\">test-zulip</a>:<a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/#version=GBdev\">dev</a>",
      "markdown": "Yuro Itaki deleted [test-zulip](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/):[dev](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/#version=GBdev)"
    },
    "resource": {
      "refUpdates": [
        {
          "name": "refs/heads/dev",
          "oldObjectId": "0929a3404b39f6e39076a640779b2c1c961e19b5",
          "newObjectId": "0000000000000000000000000000000000000000"
        }
      ],
      "repository": {
        "id": "98f0ce59-a912-43d5-96d2-bc0942a03f7b",
        "name": "test-zulip",
        "url": "https://dev.azure.com/ttchong/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b",
        "project": {
          "id": "068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2",
          "name": "test-zulip",
          "url": "https://dev.azure.com/ttchong/_apis/projects/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2",
          "state": "wellFormed",
          "visibility": "unchanged",
          "lastUpdateTime": "0001-01-01T00:00:00"
        },
        "defaultBranch": "refs/heads/main",
        "remoteUrl": "https://dev.azure.com/ttchong/test-zulip/_git/test-zulip"
      },
      "pushedBy": {
        "displayName": "Yuro Itaki",
        "url": "https://spsprodsea2.vssps.visualstudio.com/Aa56cba4a-dc80-4dd2-91fa-6fe7047fea7c/_apis/Identities/107e08c7-2725-675e-a1b0-281729035ea6",
        "_links": {
          "avatar": {
            "href": "https://dev.azure.com/ttchong/_apis/GraphProfile/MemberAvatars/msa.MTA3ZTA4YzctMjcyNS03NzVlLWExYjAtMjgxNzI5MDM1ZWE2"
          }
        },
        "id": "107e08c7-2725-675e-a1b0-281729035ea6",
        "uniqueName": "yuroitaki@email.com",
        "imageUrl": "https://dev.azure.com/ttchong/_api/_common/identityImage?id=107e08c7-2725-675e-a1b0-281729035ea6",
        "descriptor": "msa.MTA3ZTA4YzctMjcyNS03NzVlLWExYjAtMjgxNzI5MDM1ZWE2"
      },
      "pushId": 6,
      "date": "2022-07-17T11:08:58.0728467Z",
      "url": "https://dev.azure.com/ttchong/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/pushes/6",
      "_links": {
        "self": {
          "href": "https://dev.azure.com/ttchong/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/pushes/6"
        },
        "repository": {
          "href": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b"
        },
        "commits": {
          "href": "https://dev.azure.com/ttchong/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/pushes/6/commits"
        },
        "pusher": {
          "href": "https://spsprodsea2.vssps.visualstudio.com/Aa56cba4a-dc80-4dd2-91fa-6fe7047fea7c/_apis/Identities/107e08c7-2725-675e-a1b0-281729035ea6"
        },
        "refs": {
          "href": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/refs/heads/dev"
        }
      }
    },
    "resourceVersion": "1.0",
    "resourceContainers": {
      "collection": {
        "id": "ad9e1dcf-6055-4fc7-a146-5511ab5ab1e8",
        "baseUrl": "https://dev.azure.com/ttchong/"
      },
      "account": {
        "id": "a56cba4a-dc80-4dd2-91fa-6fe7047fea7c",
        "baseUrl": "https://dev.azure.com/ttchong/"
      },
      "project": {
        "id": "068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2",
        "baseUrl": "https://dev.azure.com/ttchong/"
      }
    },
    "createdDate": "2022-07-17T11:09:05.1538362Z"
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/basecamp/doc.md

```text
# Zulip Basecamp integration

Receive notifications about Basecamp events in Zulip!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Go to your project on Basecamp, and toggle the **Settings** menu in
   the top right corner. Click on **Set up webhooks**, and then select
   **Add a new webhook**.

1. Set **Payload URL** to the URL generated above. Select the
   [events](#filtering-incoming-events) you'd like to be notified about,
   and toggle the checkbox under **Enable this webhook**. Finally, click
   **Add this webhook**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/basecamp/001.png)

{!event-filtering-additional-feature.md!}

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: support_event.py]---
Location: zulip-main/zerver/webhooks/basecamp/support_event.py

```python
DOC_SUPPORT_EVENTS = [
    "document_active",
    "document_created",
    "document_archived",
    "document_unarchived",
    "document_publicized",
    "document_title_changed",
    "document_content_changed",
    "document_trashed",
    "document_publicized",
]

QUESTION_SUPPORT_EVENTS = [
    "question_archived",
    "question_created",
    "question_trashed",
    "question_unarchived",
    "question_answer_archived",
    "question_answer_content_changed",
    "question_answer_created",
    "question_answer_trashed",
    "question_answer_unarchived",
]

MESSAGE_SUPPORT_EVENTS = [
    "message_archived",
    "message_content_changed",
    "message_created",
    "message_subject_changed",
    "message_trashed",
    "message_unarchived",
    "comment_created",
]

TODOS_SUPPORT_EVENTS = [
    "todolist_created",
    "todolist_description_changed",
    "todolist_name_changed",
    "todo_assignment_changed",
    "todo_completed",
    "todo_uncompleted",
    "todo_created",
    "todo_due_on_changed",
]

SUPPORT_EVENTS = (
    DOC_SUPPORT_EVENTS + QUESTION_SUPPORT_EVENTS + MESSAGE_SUPPORT_EVENTS + TODOS_SUPPORT_EVENTS
)
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/basecamp/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase

TOPIC_NAME = "Zulip HQ"


class BasecampHookTests(WebhookTestCase):
    CHANNEL_NAME = "basecamp"
    URL_TEMPLATE = "/api/v1/external/basecamp?stream={stream}&api_key={api_key}"
    WEBHOOK_DIR_NAME = "basecamp"

    def test_basecamp_makes_doc_active(self) -> None:
        expected_message = "Tomasz activated the document [Sponsorship Package Outline](https://3.basecamp.com/3688623/buckets/2957043/documents/432522214)."
        self._send_and_test_message(
            "doc_active", expected_message, "Event Planning - Annual Conference"
        )

    def test_basecamp_makes_doc_archived(self) -> None:
        expected_message = "Tomasz archived the document [new doc](https://3.basecamp.com/3688623/buckets/2957043/documents/434455988)."
        self._send_and_test_message("doc_archived", expected_message)

    def test_basecamp_makes_doc_changed_content(self) -> None:
        expected_message = "Tomasz changed content of the document [New doc edit](https://3.basecamp.com/3688623/buckets/2957043/documents/432522214)."
        self._send_and_test_message("doc_content_changed", expected_message)

    def test_basecamp_makes_doc_changed_title(self) -> None:
        expected_message = "Tomasz changed title of the document [New doc edit](https://3.basecamp.com/3688623/buckets/2957043/documents/432522214)."
        self._send_and_test_message("doc_title_changed", expected_message)

    def test_basecamp_makes_doc_publicized(self) -> None:
        expected_message = "Tomasz publicized the document [new doc](https://3.basecamp.com/3688623/buckets/2957043/documents/434455988)."
        self._send_and_test_message("doc_publicized", expected_message)

    def test_basecamp_makes_doc_created(self) -> None:
        expected_message = "Tomasz created the document [new doc](https://3.basecamp.com/3688623/buckets/2957043/documents/434455988)."
        self._send_and_test_message("doc_created", expected_message)

    def test_basecamp_makes_doc_trashed(self) -> None:
        expected_message = "Tomasz trashed the document [new doc](https://3.basecamp.com/3688623/buckets/2957043/documents/434455988)."
        self._send_and_test_message("doc_trashed", expected_message)

    def test_basecamp_makes_doc_unarchived(self) -> None:
        expected_message = "Tomasz unarchived the document [new doc](https://3.basecamp.com/3688623/buckets/2957043/documents/434455988)."
        self._send_and_test_message("doc_unarchive", expected_message)

    def test_basecamp_makes_questions_answer_archived(self) -> None:
        expected_message = "Tomasz archived the [answer](https://3.basecamp.com/3688623/buckets/2957043/questions/432527747/answers/2017-03-16#__recording_432529636) of the question [Question?](https://3.basecamp.com/3688623/buckets/2957043/questions/432527747)"
        self._send_and_test_message("questions_answer_archived", expected_message)

    def test_basecamp_makes_questions_answer_content_changed(self) -> None:
        expected_message = "Tomasz changed content of the [answer](https://3.basecamp.com/3688623/buckets/2957043/questions/432527747/answers/2017-03-16#__recording_432529636) of the question [Question](https://3.basecamp.com/3688623/buckets/2957043/questions/432527747)."
        self._send_and_test_message("questions_answer_content_changed", expected_message)

    def test_basecamp_makes_questions_answer_created(self) -> None:
        expected_message = "Tomasz created the [answer](https://3.basecamp.com/3688623/buckets/2957043/questions/432527747/answers/2017-03-16#__recording_432529636) of the question [Question](https://3.basecamp.com/3688623/buckets/2957043/questions/432527747)."
        self._send_and_test_message("questions_answer_created", expected_message)

    def test_basecamp_makes_questions_answer_trashed(self) -> None:
        expected_message = "Tomasz trashed the [answer](https://3.basecamp.com/3688623/buckets/2957043/question_answers/432529636) of the question [Question](https://3.basecamp.com/3688623/buckets/2957043/questions/432527747)."
        self._send_and_test_message("questions_answer_trashed", expected_message)

    def test_basecamp_makes_questions_answer_unarchived(self) -> None:
        expected_message = "Tomasz unarchived the [answer](https://3.basecamp.com/3688623/buckets/2957043/questions/432527747/answers/2017-03-16#__recording_432529636) of the question [Question](https://3.basecamp.com/3688623/buckets/2957043/questions/432527747)."
        self._send_and_test_message("questions_answer_unarchived", expected_message)

    def test_basecamp_makes_question_archived(self) -> None:
        expected_message = "Tomasz archived the question [Question](https://3.basecamp.com/3688623/buckets/2957043/questions/432527747)."
        self._send_and_test_message("question_archived", expected_message)

    def test_basecamp_makes_question_created(self) -> None:
        expected_message = "Tomasz created the question [Question](https://3.basecamp.com/3688623/buckets/2957043/questions/432527747)."
        self._send_and_test_message("question_created", expected_message)

    def test_basecamp_makes_question_trashed(self) -> None:
        expected_message = "Tomasz trashed the question [Question](https://3.basecamp.com/3688623/buckets/2957043/questions/432527747)."
        self._send_and_test_message("question_trashed", expected_message)

    def test_basecamp_makes_question_unarchived(self) -> None:
        expected_message = "Tomasz unarchived the question [Question](https://3.basecamp.com/3688623/buckets/2957043/questions/432527747)."
        self._send_and_test_message("question_unarchived", expected_message)

    def test_basecamp_makes_message_archived(self) -> None:
        expected_message = "Tomasz archived the message [Message Title new](https://3.basecamp.com/3688623/buckets/2957043/messages/430680605)."
        self._send_and_test_message("message_archived", expected_message)

    def test_basecamp_makes_message_content_change(self) -> None:
        expected_message = "Tomasz changed content of the message [Message Title new](https://3.basecamp.com/3688623/buckets/2957043/messages/430680605)."
        self._send_and_test_message("message_content_changed", expected_message)

    def test_basecamp_makes_message_created(self) -> None:
        expected_message = "Tomasz created the message [Message Title](https://3.basecamp.com/3688623/buckets/2957043/messages/430680605)."
        self._send_and_test_message("message_created", expected_message)

    def test_basecamp_makes_message_title_change(self) -> None:
        expected_message = "Tomasz changed subject of the message [Message Title new](https://3.basecamp.com/3688623/buckets/2957043/messages/430680605)."
        self._send_and_test_message("message_title_changed", expected_message)

    def test_basecamp_makes_message_trashed(self) -> None:
        expected_message = "Tomasz trashed the message [Message Title new](https://3.basecamp.com/3688623/buckets/2957043/messages/430680605)."
        self._send_and_test_message("message_trashed", expected_message)

    def test_basecamp_makes_message_unarchived(self) -> None:
        expected_message = "Tomasz unarchived the message [Message Title new](https://3.basecamp.com/3688623/buckets/2957043/messages/430680605)."
        self._send_and_test_message("message_unarchived", expected_message)

    def test_basecamp_makes_todo_list_created(self) -> None:
        expected_message = "Tomasz created the todo list [NEW TO DO LIST](https://3.basecamp.com/3688623/buckets/2957043/todolists/427050190)."
        self._send_and_test_message("todo_list_created", expected_message)

    def test_basecamp_makes_todo_list_description_changed(self) -> None:
        expected_message = "Tomasz changed description of the todo list [NEW TO DO LIST](https://3.basecamp.com/3688623/buckets/2957043/todolists/427050190)."
        self._send_and_test_message("todo_list_description_changed", expected_message)

    def test_basecamp_makes_todo_list_modified(self) -> None:
        expected_message = "Tomasz changed name of the todo list [NEW Name TO DO LIST](https://3.basecamp.com/3688623/buckets/2957043/todolists/427050190)."
        self._send_and_test_message("todo_list_name_changed", expected_message)

    def test_basecamp_makes_todo_assignment_changed(self) -> None:
        expected_message = "Tomasz changed assignment of the todo task [New task](https://3.basecamp.com/3688623/buckets/2957043/todos/427055624)."
        self._send_and_test_message("todo_assignment_changed", expected_message)

    def test_basecamp_makes_todo_completed(self) -> None:
        expected_message = "Tomasz completed the todo task [New task](https://3.basecamp.com/3688623/buckets/2957043/todos/427055624)."
        self._send_and_test_message("todo_completed", expected_message)

    def test_basecamp_makes_todo_uncompleted(self) -> None:
        expected_message = "Tomasz uncompleted the todo task [New task](https://3.basecamp.com/3688623/buckets/2957043/todos/427055624)."
        self._send_and_test_message("todo_uncompleted", expected_message)

    def test_basecamp_makes_todo_created(self) -> None:
        expected_message = "Tomasz created the todo task [New task](https://3.basecamp.com/3688623/buckets/2957043/todos/427055624)."
        self._send_and_test_message("todo_created", expected_message)

    def test_basecamp_makes_todo_due_on_changed(self) -> None:
        expected_message = "Tomasz changed due_on of the todo task [New task](https://3.basecamp.com/3688623/buckets/2957043/todos/427055624)."
        self._send_and_test_message("todo_due_on_changed", expected_message)

    def test_basecamp_makes_comment_created(self) -> None:
        expected_message = "Tomasz created the [comment](https://3.basecamp.com/3688623/buckets/2957043/todos/427055624#__recording_427058780) of the task [New task](https://3.basecamp.com/3688623/buckets/2957043/todos/427055624)."
        self._send_and_test_message("comment_created", expected_message)

    def _send_and_test_message(
        self, fixture_name: str, expected_message: str, topic_name: str = TOPIC_NAME
    ) -> None:
        self.check_webhook(fixture_name, topic_name, expected_message)
```

--------------------------------------------------------------------------------

````
