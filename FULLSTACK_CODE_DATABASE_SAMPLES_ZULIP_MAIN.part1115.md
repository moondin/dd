---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1115
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1115 of 1290)

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

---[FILE: code_pull_request__merge_attempted.json]---
Location: zulip-main/zerver/webhooks/azuredevops/fixtures/code_pull_request__merge_attempted.json

```json
{
    "subscriptionId": "4f1eccb6-04ff-45dd-90aa-713078e5c395",
    "notificationId": 5,
    "id": "e41a8834-0875-4fa1-ace0-ba656e630af9",
    "eventType": "git.pullrequest.merged",
    "publisherId": "tfs",
    "message": {
      "text": "Merge attempted  for pull request 4 (Add 4th PR) in test-zulip\r\nhttps://dev.azure.com/ttchong/test-zulip/_git/test-zulip/",
      "html": "Merge attempted  for <a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/pullrequest/4\">pull request 4</a> (Add 4th PR) in <a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/\">test-zulip</a>",
      "markdown": "Merge attempted  for [pull request 4](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/pullrequest/4) (Add 4th PR) in [test-zulip](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/)"
    },
    "detailedMessage": {
      "text": "Merge attempted  for pull request 4 (Add 4th PR) in test-zulip\r\nhttps://dev.azure.com/ttchong/test-zulip/_git/test-zulip/",
      "html": "Merge attempted  for <a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/pullrequest/4\">pull request 4</a> (Add 4th PR) in <a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/\">test-zulip</a>",
      "markdown": "Merge attempted  for [pull request 4](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/pullrequest/4) (Add 4th PR) in [test-zulip](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/)"
    },
    "resource": {
      "repository": {
        "id": "98f0ce59-a912-43d5-96d2-bc0942a03f7b",
        "name": "test-zulip",
        "url": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b",
        "project": {
          "id": "068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2",
          "name": "test-zulip",
          "url": "https://dev.azure.com/ttchong/_apis/projects/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2",
          "state": "wellFormed",
          "revision": 11,
          "visibility": "private",
          "lastUpdateTime": "2022-07-17T05:01:05.987Z"
        },
        "size": 7840,
        "remoteUrl": "https://ttchong@dev.azure.com/ttchong/test-zulip/_git/test-zulip",
        "sshUrl": "git@ssh.dev.azure.com:v3/ttchong/test-zulip/test-zulip",
        "webUrl": "https://dev.azure.com/ttchong/test-zulip/_git/test-zulip",
        "isDisabled": false
      },
      "pullRequestId": 4,
      "codeReviewId": 4,
      "status": "active",
      "createdBy": {
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
      "creationDate": "2022-07-30T07:47:15.091534Z",
      "title": "Add 4th PR",
      "sourceRefName": "refs/heads/preprod",
      "targetRefName": "refs/heads/main",
      "mergeStatus": "conflicts",
      "isDraft": false,
      "mergeId": "697a791b-ab1a-48bf-910f-df958081a45c",
      "lastMergeSourceCommit": {
        "commitId": "885adddfa29eeeb8a0c9448b6744d2cfe02b1ebf",
        "url": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/commits/885adddfa29eeeb8a0c9448b6744d2cfe02b1ebf"
      },
      "lastMergeTargetCommit": {
        "commitId": "6c86f973c0cd02726af8a5da074795745927e0d2",
        "url": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/commits/6c86f973c0cd02726af8a5da074795745927e0d2"
      },
      "reviewers": [
        {
          "reviewerUrl": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/pullRequests/4/reviewers/107e08c7-2725-675e-a1b0-281729035ea6",
          "vote": 10,
          "hasDeclined": false,
          "isFlagged": false,
          "displayName": "Yuro Itaki",
          "url": "https://spsprodsea2.vssps.visualstudio.com/Aa56cba4a-dc80-4dd2-91fa-6fe7047fea7c/_apis/Identities/107e08c7-2725-675e-a1b0-281729035ea6",
          "_links": {
            "avatar": {
              "href": "https://dev.azure.com/ttchong/_apis/GraphProfile/MemberAvatars/msa.MTA3ZTA4YzctMjcyNS03NzVlLWExYjAtMjgxNzI5MDM1ZWE2"
            }
          },
          "id": "107e08c7-2725-675e-a1b0-281729035ea6",
          "uniqueName": "yuroitaki@email.com",
          "imageUrl": "https://dev.azure.com/ttchong/_api/_common/identityImage?id=107e08c7-2725-675e-a1b0-281729035ea6"
        }
      ],
      "url": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/pullRequests/4",
      "_links": {
        "web": {
          "href": "https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/pullrequest/4"
        },
        "statuses": {
          "href": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/pullRequests/4/statuses"
        }
      },
      "supportsIterations": true,
      "artifactId": "vstfs:///Git/PullRequestId/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2%2f98f0ce59-a912-43d5-96d2-bc0942a03f7b%2f4"
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
    "createdDate": "2022-07-30T07:48:03.2511337Z"
}
```

--------------------------------------------------------------------------------

---[FILE: code_pull_request__opened.json]---
Location: zulip-main/zerver/webhooks/azuredevops/fixtures/code_pull_request__opened.json

```json
{
    "subscriptionId": "a0e7f493-8c02-498d-b9ee-86a8612bc74e",
    "notificationId": 1,
    "id": "d1e96858-24cd-4064-9e08-0c55db2ff3fa",
    "eventType": "git.pullrequest.created",
    "publisherId": "tfs",
    "message": {
      "text": "Yuro Itaki created pull request 1 (Add PR request) in test-zulip\r\nhttps://dev.azure.com/ttchong/test-zulip/_git/test-zulip/",
      "html": "Yuro Itaki created <a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/pullrequest/1\">pull request 1</a> (Add PR request) in <a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/\">test-zulip</a>",
      "markdown": "Yuro Itaki created [pull request 1](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/pullrequest/1) (Add PR request) in [test-zulip](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/)"
    },
    "detailedMessage": {
      "text": "Yuro Itaki created pull request 1 (Add PR request) in test-zulip\r\nhttps://dev.azure.com/ttchong/test-zulip/_git/test-zulip/\r\nAdd PR request\r\n",
      "html": "Yuro Itaki created <a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/pullrequest/1\">pull request 1</a> (Add PR request) in <a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/\">test-zulip</a><p>Add PR request</p>",
      "markdown": "Yuro Itaki created [pull request 1](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/pullrequest/1) (Add PR request) in [test-zulip](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/)\r\nAdd PR request\r\n"
    },
    "resource": {
      "repository": {
        "id": "98f0ce59-a912-43d5-96d2-bc0942a03f7b",
        "name": "test-zulip",
        "url": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b",
        "project": {
          "id": "068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2",
          "name": "test-zulip",
          "url": "https://dev.azure.com/ttchong/_apis/projects/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2",
          "state": "wellFormed",
          "revision": 11,
          "visibility": "private",
          "lastUpdateTime": "2022-07-17T05:01:05.987Z"
        },
        "size": 4425,
        "remoteUrl": "https://ttchong@dev.azure.com/ttchong/test-zulip/_git/test-zulip",
        "sshUrl": "git@ssh.dev.azure.com:v3/ttchong/test-zulip/test-zulip",
        "webUrl": "https://dev.azure.com/ttchong/test-zulip/_git/test-zulip",
        "isDisabled": false
      },
      "pullRequestId": 1,
      "codeReviewId": 1,
      "status": "active",
      "createdBy": {
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
      "creationDate": "2022-07-24T08:02:50.160355Z",
      "title": "Add PR request",
      "description": "Add PR request",
      "sourceRefName": "refs/heads/dev",
      "targetRefName": "refs/heads/main",
      "mergeStatus": "succeeded",
      "isDraft": false,
      "mergeId": "3cb082bf-62fd-4ff9-81f2-bea41241eadb",
      "lastMergeSourceCommit": {
        "commitId": "8b913c8e0d0492952bd215da12df9a422182e9c5",
        "url": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/commits/8b913c8e0d0492952bd215da12df9a422182e9c5"
      },
      "lastMergeTargetCommit": {
        "commitId": "0929a3404b39f6e39076a640779b2c1c961e19b5",
        "url": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/commits/0929a3404b39f6e39076a640779b2c1c961e19b5"
      },
      "lastMergeCommit": {
        "commitId": "4d1292958374b3311a517429d6160f7fc434de86",
        "author": {
          "name": "Yuro Itaki",
          "email": "yuroitaki@email.com",
          "date": "2022-07-24T08:02:50Z"
        },
        "committer": {
          "name": "Yuro Itaki",
          "email": "yuroitaki@email.com",
          "date": "2022-07-24T08:02:50Z"
        },
        "comment": "Merge pull request 1 from dev into main",
        "url": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/commits/4d1292958374b3311a517429d6160f7fc434de86"
      },
      "reviewers": [],
      "url": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/pullRequests/1",
      "_links": {
        "web": {
          "href": "https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/pullrequest/1"
        },
        "statuses": {
          "href": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/pullRequests/1/statuses"
        }
      },
      "supportsIterations": true,
      "artifactId": "vstfs:///Git/PullRequestId/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2%2f98f0ce59-a912-43d5-96d2-bc0942a03f7b%2f1"
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
    "createdDate": "2022-07-24T08:02:56.9717413Z"
}
```

--------------------------------------------------------------------------------

---[FILE: code_pull_request__opened_without_description.json]---
Location: zulip-main/zerver/webhooks/azuredevops/fixtures/code_pull_request__opened_without_description.json

```json
{
    "subscriptionId": "a0e7f493-8c02-498d-b9ee-86a8612bc74e",
    "notificationId": 2,
    "id": "3559461b-0001-422f-8c1c-7946284839ab",
    "eventType": "git.pullrequest.created",
    "publisherId": "tfs",
    "message": {
      "text": "Yuro Itaki created pull request 2 (Raised 2nd PR!) in test-zulip\r\nhttps://dev.azure.com/ttchong/test-zulip/_git/test-zulip/",
      "html": "Yuro Itaki created <a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/pullrequest/2\">pull request 2</a> (Raised 2nd PR!) in <a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/\">test-zulip</a>",
      "markdown": "Yuro Itaki created [pull request 2](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/pullrequest/2) (Raised 2nd PR!) in [test-zulip](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/)"
    },
    "detailedMessage": {
      "text": "Yuro Itaki created pull request 2 (Raised 2nd PR!) in test-zulip\r\nhttps://dev.azure.com/ttchong/test-zulip/_git/test-zulip/\r\nRaised 2nd PR!\r\n",
      "html": "Yuro Itaki created <a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/pullrequest/2\">pull request 2</a> (Raised 2nd PR!) in <a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/\">test-zulip</a><p>Raised 2nd PR!</p>",
      "markdown": "Yuro Itaki created [pull request 2](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/pullrequest/2) (Raised 2nd PR!) in [test-zulip](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/)\r\nRaised 2nd PR!\r\n"
    },
    "resource": {
      "repository": {
        "id": "98f0ce59-a912-43d5-96d2-bc0942a03f7b",
        "name": "test-zulip",
        "url": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b",
        "project": {
          "id": "068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2",
          "name": "test-zulip",
          "url": "https://dev.azure.com/ttchong/_apis/projects/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2",
          "state": "wellFormed",
          "revision": 11,
          "visibility": "private",
          "lastUpdateTime": "2022-07-17T05:01:05.987Z"
        },
        "size": 4425,
        "remoteUrl": "https://ttchong@dev.azure.com/ttchong/test-zulip/_git/test-zulip",
        "sshUrl": "git@ssh.dev.azure.com:v3/ttchong/test-zulip/test-zulip",
        "webUrl": "https://dev.azure.com/ttchong/test-zulip/_git/test-zulip",
        "isDisabled": false
      },
      "pullRequestId": 2,
      "codeReviewId": 2,
      "status": "active",
      "createdBy": {
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
      "creationDate": "2022-07-24T08:45:53.9577409Z",
      "title": "Raised 2nd PR!",
      "sourceRefName": "refs/heads/stg",
      "targetRefName": "refs/heads/main",
      "mergeStatus": "succeeded",
      "isDraft": false,
      "mergeId": "675bced4-738a-4f9e-b255-a30dce8b91df",
      "lastMergeSourceCommit": {
        "commitId": "fe3b16dd2079fc96f4e31752b0e3e0782389b469",
        "url": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/commits/fe3b16dd2079fc96f4e31752b0e3e0782389b469"
      },
      "lastMergeTargetCommit": {
        "commitId": "0929a3404b39f6e39076a640779b2c1c961e19b5",
        "url": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/commits/0929a3404b39f6e39076a640779b2c1c961e19b5"
      },
      "lastMergeCommit": {
        "commitId": "037561654dedfcc22e96230eee4550916357ec7a",
        "author": {
          "name": "Yuro Itaki",
          "email": "yuroitaki@email.com",
          "date": "2022-07-24T08:45:54Z"
        },
        "committer": {
          "name": "Yuro Itaki",
          "email": "yuroitaki@email.com",
          "date": "2022-07-24T08:45:54Z"
        },
        "comment": "Merge pull request 2 from stg into main",
        "url": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/commits/037561654dedfcc22e96230eee4550916357ec7a"
      },
      "reviewers": [
        {
          "reviewerUrl": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/pullRequests/2/reviewers/ed580ebe-b4a9-485d-bfed-c58ba519d7b6",
          "vote": 0,
          "hasDeclined": false,
          "isFlagged": false,
          "displayName": "Project Collection Build Service (Pad9e1dcf-6055-4fc7-a146-5511ab5ab1e8)",
          "url": "https://spsprodsea2.vssps.visualstudio.com/Aa56cba4a-dc80-4dd2-91fa-6fe7047fea7c/_apis/Identities/ed580ebe-b4a9-485d-bfed-c58ba519d7b6",
          "_links": {
            "avatar": {
              "href": "https://dev.azure.com/ttchong/_apis/GraphProfile/MemberAvatars/svc.YTU2Y2JhNGEtZGM4MC00ZGQyLTkxZmEtNmZlNzA0N2ZlYTdjOkJ1aWxkOmFkOWUxZGNmLTYwNTUtNGZjNy1hMTQ2LTU1MTFhYjVhYjFlOA"
            }
          },
          "id": "ed580ebe-b4a9-485d-bfed-c58ba519d7b6",
          "uniqueName": "Build\\ad9e1dcf-6055-4fc7-a146-5511ab5ab1e8",
          "imageUrl": "https://dev.azure.com/ttchong/_api/_common/identityImage?id=ed580ebe-b4a9-485d-bfed-c58ba519d7b6"
        }
      ],
      "url": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/pullRequests/2",
      "_links": {
        "web": {
          "href": "https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/pullrequest/2"
        },
        "statuses": {
          "href": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/pullRequests/2/statuses"
        }
      },
      "supportsIterations": true,
      "artifactId": "vstfs:///Git/PullRequestId/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2%2f98f0ce59-a912-43d5-96d2-bc0942a03f7b%2f2"
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
    "createdDate": "2022-07-24T08:46:00.8535001Z"
}
```

--------------------------------------------------------------------------------

---[FILE: code_pull_request__updated.json]---
Location: zulip-main/zerver/webhooks/azuredevops/fixtures/code_pull_request__updated.json

```json
{
    "subscriptionId": "d21a27a6-3b89-45fb-9af9-0fe220348c1d",
    "notificationId": 1,
    "id": "6544f94b-ce5d-4bc1-b4be-30559b589d15",
    "eventType": "git.pullrequest.updated",
    "publisherId": "tfs",
    "message": {
      "text": "Yuro Itaki updated the source branch of pull request 2 (Raised 2nd PR!) in test-zulip\r\nhttps://dev.azure.com/ttchong/test-zulip/_git/test-zulip/",
      "html": "Yuro Itaki updated the source branch of <a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/pullrequest/2\">pull request 2</a> (Raised 2nd PR!) in <a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/\">test-zulip</a>",
      "markdown": "Yuro Itaki updated the source branch of [pull request 2](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/pullrequest/2) (Raised 2nd PR!) in [test-zulip](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/)"
    },
    "detailedMessage": {
      "text": "Yuro Itaki updated the source branch of pull request 2 (Raised 2nd PR!) in test-zulip\r\nhttps://dev.azure.com/ttchong/test-zulip/_git/test-zulip/\r\nRaised 2nd PR!\r\n",
      "html": "Yuro Itaki updated the source branch of <a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/pullrequest/2\">pull request 2</a> (Raised 2nd PR!) in <a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/\">test-zulip</a><p>Raised 2nd PR!</p>",
      "markdown": "Yuro Itaki updated the source branch of [pull request 2](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/pullrequest/2) (Raised 2nd PR!) in [test-zulip](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/)\r\nRaised 2nd PR!\r\n"
    },
    "resource": {
      "repository": {
        "id": "98f0ce59-a912-43d5-96d2-bc0942a03f7b",
        "name": "test-zulip",
        "url": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b",
        "project": {
          "id": "068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2",
          "name": "test-zulip",
          "url": "https://dev.azure.com/ttchong/_apis/projects/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2",
          "state": "wellFormed",
          "revision": 11,
          "visibility": "private",
          "lastUpdateTime": "2022-07-17T05:01:05.987Z"
        },
        "size": 7840,
        "remoteUrl": "https://ttchong@dev.azure.com/ttchong/test-zulip/_git/test-zulip",
        "sshUrl": "git@ssh.dev.azure.com:v3/ttchong/test-zulip/test-zulip",
        "webUrl": "https://dev.azure.com/ttchong/test-zulip/_git/test-zulip",
        "isDisabled": false
      },
      "pullRequestId": 2,
      "codeReviewId": 2,
      "status": "active",
      "createdBy": {
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
      "creationDate": "2022-07-24T08:45:53.9577409Z",
      "title": "Raised 2nd PR!",
      "description": "Raised 2nd PR!",
      "sourceRefName": "refs/heads/stg",
      "targetRefName": "refs/heads/main",
      "mergeStatus": "succeeded",
      "isDraft": false,
      "mergeId": "675bced4-738a-4f9e-b255-a30dce8b91df",
      "lastMergeSourceCommit": {
        "commitId": "aefa35fb7c4505b9b8337aff3c4be96eddbbd861",
        "url": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/commits/aefa35fb7c4505b9b8337aff3c4be96eddbbd861"
      },
      "lastMergeTargetCommit": {
        "commitId": "b2606c193460441311f4d31f4729589c77f5efe0",
        "url": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/commits/b2606c193460441311f4d31f4729589c77f5efe0"
      },
      "lastMergeCommit": {
        "commitId": "f0fb095f4e89065e2edccaedae4535979e212b78",
        "author": {
          "name": "Yuro Itaki",
          "email": "yuroitaki@email.com",
          "date": "2022-07-30T08:42:00Z"
        },
        "committer": {
          "name": "Yuro Itaki",
          "email": "yuroitaki@email.com",
          "date": "2022-07-30T08:42:00Z"
        },
        "comment": "Merge pull request 2 from stg into main",
        "url": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/commits/f0fb095f4e89065e2edccaedae4535979e212b78"
      },
      "reviewers": [
        {
          "reviewerUrl": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/pullRequests/2/reviewers/ed580ebe-b4a9-485d-bfed-c58ba519d7b6",
          "vote": 0,
          "hasDeclined": false,
          "isFlagged": false,
          "displayName": "Project Collection Build Service (Pad9e1dcf-6055-4fc7-a146-5511ab5ab1e8)",
          "url": "https://spsprodsea2.vssps.visualstudio.com/Aa56cba4a-dc80-4dd2-91fa-6fe7047fea7c/_apis/Identities/ed580ebe-b4a9-485d-bfed-c58ba519d7b6",
          "_links": {
            "avatar": {
              "href": "https://dev.azure.com/ttchong/_apis/GraphProfile/MemberAvatars/svc.YTU2Y2JhNGEtZGM4MC00ZGQyLTkxZmEtNmZlNzA0N2ZlYTdjOkJ1aWxkOmFkOWUxZGNmLTYwNTUtNGZjNy1hMTQ2LTU1MTFhYjVhYjFlOA"
            }
          },
          "id": "ed580ebe-b4a9-485d-bfed-c58ba519d7b6",
          "uniqueName": "Build\\ad9e1dcf-6055-4fc7-a146-5511ab5ab1e8",
          "imageUrl": "https://dev.azure.com/ttchong/_api/_common/identityImage?id=ed580ebe-b4a9-485d-bfed-c58ba519d7b6"
        }
      ],
      "url": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/pullRequests/2",
      "_links": {
        "web": {
          "href": "https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/pullrequest/2"
        },
        "statuses": {
          "href": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/pullRequests/2/statuses"
        }
      },
      "completionOptions": {
        "mergeCommitMessage": "Merged PR 2: Raised 2nd PR!\n\nRaised 2nd PR!",
        "mergeStrategy": "noFastForward",
        "transitionWorkItems": true,
        "autoCompleteIgnoreConfigIds": []
      },
      "supportsIterations": true,
      "artifactId": "vstfs:///Git/PullRequestId/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2%2f98f0ce59-a912-43d5-96d2-bc0942a03f7b%2f2"
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
    "createdDate": "2022-07-30T08:42:07.2382228Z"
}
```

--------------------------------------------------------------------------------

---[FILE: code_push.json]---
Location: zulip-main/zerver/webhooks/azuredevops/fixtures/code_push.json

```json
{
    "subscriptionId": "bb3738ff-00ae-472e-b752-d192c676780c",
    "notificationId": 2,
    "id": "9c335e3e-e047-405c-a420-d679bd54a299",
    "eventType": "git.push",
    "publisherId": "tfs",
    "message": {
      "text": "Yuro Itaki pushed updates to test-zulip:main\r\n(https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/#version=GBmain)",
      "html": "Yuro Itaki pushed updates to <a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/\">test-zulip</a>:<a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/#version=GBmain\">main</a>",
      "markdown": "Yuro Itaki pushed updates to [test-zulip](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/):[main](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/#version=GBmain)"
    },
    "detailedMessage": {
      "text": "Yuro Itaki pushed a commit to test-zulip:main\r\n - Modify readme b0ce2f20 (https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/commit/b0ce2f2009c3c87dbefadf61d7eb2c0697a6f369)",
      "html": "Yuro Itaki pushed a commit to <a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/\">test-zulip</a>:<a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/#version=GBmain\">main</a>\r\n<ul>\r\n<li>Modify readme <a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/commit/b0ce2f2009c3c87dbefadf61d7eb2c0697a6f369\">b0ce2f20</a></li>\r\n</ul>",
      "markdown": "Yuro Itaki pushed a commit to [test-zulip](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/):[main](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/#version=GBmain)\r\n* Modify readme [b0ce2f20](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/commit/b0ce2f2009c3c87dbefadf61d7eb2c0697a6f369)"
    },
    "resource": {
      "commits": [
        {
          "commitId": "b0ce2f2009c3c87dbefadf61d7eb2c0697a6f369",
          "author": {
            "name": "Yuro Itaki",
            "email": "yuroitaki@email.com",
            "date": "2022-07-17T07:14:01Z"
          },
          "committer": {
            "name": "Yuro Itaki",
            "email": "yuroitaki@email.com",
            "date": "2022-07-17T07:14:01Z"
          },
          "comment": "Modify readme",
          "url": "https://dev.azure.com/ttchong/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/commits/b0ce2f2009c3c87dbefadf61d7eb2c0697a6f369"
        }
      ],
      "refUpdates": [
        {
          "name": "refs/heads/main",
          "oldObjectId": "51515957669f93c543df09f8f3e7f47c3613c879",
          "newObjectId": "b0ce2f2009c3c87dbefadf61d7eb2c0697a6f369"
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
      "pushId": 2,
      "date": "2022-07-17T07:14:05.9409049Z",
      "url": "https://dev.azure.com/ttchong/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/pushes/2",
      "_links": {
        "self": {
          "href": "https://dev.azure.com/ttchong/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/pushes/2"
        },
        "repository": {
          "href": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b"
        },
        "commits": {
          "href": "https://dev.azure.com/ttchong/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/pushes/2/commits"
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
    "createdDate": "2022-07-17T07:14:12.5477052Z"
}
```

--------------------------------------------------------------------------------

````
