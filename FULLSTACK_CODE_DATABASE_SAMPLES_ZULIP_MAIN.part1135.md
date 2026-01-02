---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1135
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1135 of 1290)

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

---[FILE: pull_request_unapproved.json]---
Location: zulip-main/zerver/webhooks/bitbucket3/fixtures/pull_request_unapproved.json

```json
{
    "actor": {
        "active": true,
        "type": "NORMAL",
        "links": {
            "self": [
                {
                    "href": "http://139.59.64.214:7990/users/zura"
                }
            ]
        },
        "displayName": "Katsura Kotarou",
        "emailAddress": "katsura_kotarou@gmail.com",
        "slug": "zura",
        "id": 4,
        "name": "zura"
    },
    "previousStatus": "APPROVED",
    "participant": {
        "status": "UNAPPROVED",
        "role": "REVIEWER",
        "user": {
            "active": true,
            "type": "NORMAL",
            "links": {
                "self": [
                    {
                        "href": "http://139.59.64.214:7990/users/zura"
                    }
                ]
            },
            "displayName": "Katsura Kotarou",
            "emailAddress": "katsura_kotarou@gmail.com",
            "slug": "zura",
            "id": 4,
            "name": "zura"
        },
        "lastReviewedCommit": "556bde1a2442562568fce6016de570516ac1c4f6",
        "approved": false
    },
    "pullRequest": {
        "locked": false,
        "state": "OPEN",
        "description": "Add a simple text file for further testing purposes.",
        "closed": false,
        "open": true,
        "title": "sample_file: Add sample_file.txt.",
        "toRef": {
            "repository": {
                "state": "AVAILABLE",
                "links": {
                    "clone": [
                        {
                            "href": "ssh://git@139.59.64.214:7999/sbox/sandbox.git",
                            "name": "ssh"
                        },
                        {
                            "href": "http://139.59.64.214:7990/scm/sbox/sandbox.git",
                            "name": "http"
                        }
                    ],
                    "self": [
                        {
                            "href": "http://139.59.64.214:7990/projects/SBOX/repos/sandbox/browse"
                        }
                    ]
                },
                "forkable": true,
                "slug": "sandbox",
                "project": {
                    "key": "SBOX",
                    "public": false,
                    "links": {
                        "self": [
                            {
                                "href": "http://139.59.64.214:7990/projects/SBOX"
                            }
                        ]
                    },
                    "id": 2,
                    "type": "NORMAL",
                    "name": "Sandbox"
                },
                "id": 2,
                "scmId": "git",
                "public": false,
                "name": "sandbox",
                "statusMessage": "Available"
            },
            "id": "refs/heads/master",
            "displayId": "master",
            "latestCommit": "d46b4d2e3326e106147c0ea748f7defba29d9e1e"
        },
        "reviewers": [
            {
                "status": "UNAPPROVED",
                "role": "REVIEWER",
                "user": {
                    "active": true,
                    "type": "NORMAL",
                    "links": {
                        "self": [
                            {
                                "href": "http://139.59.64.214:7990/users/shimura"
                            }
                        ]
                    },
                    "displayName": "Shimura Shinpachi",
                    "emailAddress": "shimura_shinpachi@gmail.com",
                    "slug": "shimura",
                    "id": 2,
                    "name": "shimura"
                },
                "approved": false
            },
            {
                "status": "UNAPPROVED",
                "role": "REVIEWER",
                "user": {
                    "active": true,
                    "type": "NORMAL",
                    "links": {
                        "self": [
                            {
                                "href": "http://139.59.64.214:7990/users/zura"
                            }
                        ]
                    },
                    "displayName": "Katsura Kotarou",
                    "emailAddress": "katsura_kotarou@gmail.com",
                    "slug": "zura",
                    "id": 4,
                    "name": "zura"
                },
                "lastReviewedCommit": "556bde1a2442562568fce6016de570516ac1c4f6",
                "approved": false
            },
            {
                "status": "UNAPPROVED",
                "role": "REVIEWER",
                "user": {
                    "active": true,
                    "type": "NORMAL",
                    "links": {
                        "self": [
                            {
                                "href": "http://139.59.64.214:7990/users/sougo"
                            }
                        ]
                    },
                    "displayName": "Okita Sougo",
                    "emailAddress": "okita_sougo@gmail.com",
                    "slug": "sougo",
                    "id": 3,
                    "name": "sougo"
                },
                "approved": false
            }
        ],
        "author": {
            "status": "UNAPPROVED",
            "role": "AUTHOR",
            "user": {
                "active": true,
                "type": "NORMAL",
                "links": {
                    "self": [
                        {
                            "href": "http://139.59.64.214:7990/users/hypro999"
                        }
                    ]
                },
                "displayName": "Hemanth V. Alluri",
                "emailAddress": "f20171170@pilani.bits-pilani.ac.in",
                "slug": "hypro999",
                "id": 1,
                "name": "hypro999"
            },
            "approved": false
        },
        "links": {
            "self": [
                {
                    "href": "http://139.59.64.214:7990/projects/SBOX/repos/sandbox/pull-requests/6"
                }
            ]
        },
        "createdDate": 1553572666612,
        "fromRef": {
            "repository": {
                "state": "AVAILABLE",
                "links": {
                    "clone": [
                        {
                            "href": "ssh://git@139.59.64.214:7999/~hypro999/sandbox-fork.git",
                            "name": "ssh"
                        },
                        {
                            "href": "http://139.59.64.214:7990/scm/~hypro999/sandbox-fork.git",
                            "name": "http"
                        }
                    ],
                    "self": [
                        {
                            "href": "http://139.59.64.214:7990/users/hypro999/repos/sandbox-fork/browse"
                        }
                    ]
                },
                "forkable": true,
                "origin": {
                    "state": "AVAILABLE",
                    "links": {
                        "clone": [
                            {
                                "href": "ssh://git@139.59.64.214:7999/sbox/sandbox.git",
                                "name": "ssh"
                            },
                            {
                                "href": "http://139.59.64.214:7990/scm/sbox/sandbox.git",
                                "name": "http"
                            }
                        ],
                        "self": [
                            {
                                "href": "http://139.59.64.214:7990/projects/SBOX/repos/sandbox/browse"
                            }
                        ]
                    },
                    "forkable": true,
                    "slug": "sandbox",
                    "project": {
                        "key": "SBOX",
                        "public": false,
                        "links": {
                            "self": [
                                {
                                    "href": "http://139.59.64.214:7990/projects/SBOX"
                                }
                            ]
                        },
                        "id": 2,
                        "type": "NORMAL",
                        "name": "Sandbox"
                    },
                    "id": 2,
                    "scmId": "git",
                    "public": false,
                    "name": "sandbox",
                    "statusMessage": "Available"
                },
                "slug": "sandbox-fork",
                "project": {
                    "key": "~HYPRO999",
                    "type": "PERSONAL",
                    "owner": {
                        "active": true,
                        "type": "NORMAL",
                        "links": {
                            "self": [
                                {
                                    "href": "http://139.59.64.214:7990/users/hypro999"
                                }
                            ]
                        },
                        "displayName": "Hemanth V. Alluri",
                        "emailAddress": "f20171170@pilani.bits-pilani.ac.in",
                        "slug": "hypro999",
                        "id": 1,
                        "name": "hypro999"
                    },
                    "links": {
                        "self": [
                            {
                                "href": "http://139.59.64.214:7990/users/hypro999"
                            }
                        ]
                    },
                    "id": 3,
                    "name": "Hemanth V. Alluri"
                },
                "id": 4,
                "scmId": "git",
                "public": false,
                "name": "sandbox fork",
                "statusMessage": "Available"
            },
            "id": "refs/heads/master",
            "displayId": "master",
            "latestCommit": "556bde1a2442562568fce6016de570516ac1c4f6"
        },
        "version": 0,
        "id": 6,
        "updatedDate": 1553572666612,
        "participants": []
    },
    "eventKey": "pr:reviewer:unapproved",
    "date": "2019-03-26T15:49:39+0530"
}
```

--------------------------------------------------------------------------------

---[FILE: repo_forked.json]---
Location: zulip-main/zerver/webhooks/bitbucket3/fixtures/repo_forked.json

```json
{
    "actor": {
        "links": {
            "self": [
                {
                    "href": "http://139.59.64.214:7990/users/hypro999"
                }
            ]
        },
        "displayName": "Hemanth V. Alluri",
        "active": true,
        "slug": "hypro999",
        "type": "NORMAL",
        "name": "hypro999",
        "id": 1,
        "emailAddress": "f20171170@pilani.bits-pilani.ac.in"
    },
    "repository": {
        "links": {
            "clone": [
                {
                    "href": "ssh://git@139.59.64.214:7999/~hypro999/sandbox-fork.git",
                    "name": "ssh"
                },
                {
                    "href": "http://139.59.64.214:7990/scm/~hypro999/sandbox-fork.git",
                    "name": "http"
                }
            ],
            "self": [
                {
                    "href": "http://139.59.64.214:7990/users/hypro999/repos/sandbox-fork/browse"
                }
            ]
        },
        "statusMessage": "Available",
        "id": 4,
        "slug": "sandbox-fork",
        "project": {
            "links": {
                "self": [
                    {
                        "href": "http://139.59.64.214:7990/users/hypro999"
                    }
                ]
            },
            "owner": {
                "links": {
                    "self": [
                        {
                            "href": "http://139.59.64.214:7990/users/hypro999"
                        }
                    ]
                },
                "displayName": "Hemanth V. Alluri",
                "active": true,
                "slug": "hypro999",
                "type": "NORMAL",
                "name": "hypro999",
                "id": 1,
                "emailAddress": "f20171170@pilani.bits-pilani.ac.in"
            },
            "key": "~HYPRO999",
            "type": "PERSONAL",
            "name": "Hemanth V. Alluri",
            "id": 3
        },
        "origin": {
            "links": {
                "clone": [
                    {
                        "href": "ssh://git@139.59.64.214:7999/sbox/sandbox.git",
                        "name": "ssh"
                    },
                    {
                        "href": "http://139.59.64.214:7990/scm/sbox/sandbox.git",
                        "name": "http"
                    }
                ],
                "self": [
                    {
                        "href": "http://139.59.64.214:7990/projects/SBOX/repos/sandbox/browse"
                    }
                ]
            },
            "statusMessage": "Available",
            "id": 2,
            "slug": "sandbox",
            "project": {
                "links": {
                    "self": [
                        {
                            "href": "http://139.59.64.214:7990/projects/SBOX"
                        }
                    ]
                },
                "key": "SBOX",
                "type": "NORMAL",
                "name": "Sandbox",
                "id": 2,
                "public": false
            },
            "name": "sandbox",
            "state": "AVAILABLE",
            "forkable": true,
            "scmId": "git",
            "public": false
        },
        "name": "sandbox fork",
        "state": "AVAILABLE",
        "forkable": true,
        "scmId": "git",
        "public": false
    },
    "date": "2019-03-08T12:25:34+0530",
    "eventKey": "repo:forked"
}
```

--------------------------------------------------------------------------------

---[FILE: repo_modified.json]---
Location: zulip-main/zerver/webhooks/bitbucket3/fixtures/repo_modified.json

```json
{
    "actor": {
        "links": {
            "self": [
                {
                    "href": "http://139.59.64.214:7990/users/hypro999"
                }
            ]
        },
        "displayName": "Hemanth V. Alluri",
        "active": true,
        "slug": "hypro999",
        "type": "NORMAL",
        "name": "hypro999",
        "id": 1,
        "emailAddress": "f20171170@pilani.bits-pilani.ac.in"
    },
    "old": {
        "links": {
            "clone": [
                {
                    "href": "ssh://git@139.59.64.214:7999/sbox/sandbox-v2.git",
                    "name": "ssh"
                },
                {
                    "href": "http://139.59.64.214:7990/scm/sbox/sandbox-v2.git",
                    "name": "http"
                }
            ],
            "self": [
                {
                    "href": "http://139.59.64.214:7990/projects/SBOX/repos/sandbox/browse"
                }
            ]
        },
        "statusMessage": "Available",
        "id": 2,
        "slug": "sandbox",
        "project": {
            "links": {
                "self": [
                    {
                        "href": "http://139.59.64.214:7990/projects/SBOX"
                    }
                ]
            },
            "key": "SBOX",
            "type": "NORMAL",
            "name": "Sandbox",
            "id": 2,
            "public": false
        },
        "name": "sandbox",
        "state": "AVAILABLE",
        "forkable": true,
        "scmId": "git",
        "public": false
    },
    "date": "2019-03-08T18:20:26+0530",
    "eventKey": "repo:modified",
    "new": {
        "links": {
            "clone": [
                {
                    "href": "ssh://git@139.59.64.214:7999/sbox/sandbox-v2.git",
                    "name": "ssh"
                },
                {
                    "href": "http://139.59.64.214:7990/scm/sbox/sandbox-v2.git",
                    "name": "http"
                }
            ],
            "self": [
                {
                    "href": "http://139.59.64.214:7990/projects/SBOX/repos/sandbox-v2/browse"
                }
            ]
        },
        "statusMessage": "Available",
        "id": 2,
        "slug": "sandbox-v2",
        "project": {
            "links": {
                "self": [
                    {
                        "href": "http://139.59.64.214:7990/projects/SBOX"
                    }
                ]
            },
            "key": "SBOX",
            "type": "NORMAL",
            "name": "Sandbox",
            "id": 2,
            "public": false
        },
        "name": "sandbox v2",
        "state": "AVAILABLE",
        "forkable": true,
        "scmId": "git",
        "public": false
    }
}
```

--------------------------------------------------------------------------------

---[FILE: repo_push_add_branch.json]---
Location: zulip-main/zerver/webhooks/bitbucket3/fixtures/repo_push_add_branch.json

```json
{
    "repository": {
        "state": "AVAILABLE",
        "links": {
            "clone": [
                {
                    "href": "ssh://git@139.59.64.214:7999/sbox/sandbox.git",
                    "name": "ssh"
                },
                {
                    "href": "http://139.59.64.214:7990/scm/sbox/sandbox.git",
                    "name": "http"
                }
            ],
            "self": [
                {
                    "href": "http://139.59.64.214:7990/projects/SBOX/repos/sandbox/browse"
                }
            ]
        },
        "forkable": true,
        "slug": "sandbox",
        "project": {
            "key": "SBOX",
            "public": false,
            "links": {
                "self": [
                    {
                        "href": "http://139.59.64.214:7990/projects/SBOX"
                    }
                ]
            },
            "id": 2,
            "type": "NORMAL",
            "name": "Sandbox"
        },
        "id": 2,
        "scmId": "git",
        "public": false,
        "name": "sandbox",
        "statusMessage": "Available"
    },
    "actor": {
        "active": true,
        "type": "NORMAL",
        "links": {
            "self": [
                {
                    "href": "http://139.59.64.214:7990/users/hypro999"
                }
            ]
        },
        "displayName": "Hemanth V. Alluri",
        "emailAddress": "f20171170@pilani.bits-pilani.ac.in",
        "slug": "hypro999",
        "id": 1,
        "name": "hypro999"
    },
    "eventKey": "repo:refs_changed",
    "date": "2019-03-21T09:37:33+0530",
    "changes": [
        {
            "toHash": "c7fccd35e163571148c42a3e8b11aef6661d19b8",
            "type": "ADD",
            "ref": {
                "type": "BRANCH",
                "id": "refs/heads/branch2",
                "displayId": "branch2"
            },
            "fromHash": "0000000000000000000000000000000000000000",
            "refId": "refs/heads/branch2"
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: repo_push_add_tag.json]---
Location: zulip-main/zerver/webhooks/bitbucket3/fixtures/repo_push_add_tag.json

```json
{
    "repository": {
        "state": "AVAILABLE",
        "links": {
            "clone": [
                {
                    "href": "ssh://git@139.59.64.214:7999/sbox/sandbox.git",
                    "name": "ssh"
                },
                {
                    "href": "http://139.59.64.214:7990/scm/sbox/sandbox.git",
                    "name": "http"
                }
            ],
            "self": [
                {
                    "href": "http://139.59.64.214:7990/projects/SBOX/repos/sandbox/browse"
                }
            ]
        },
        "forkable": true,
        "slug": "sandbox",
        "project": {
            "key": "SBOX",
            "public": false,
            "links": {
                "self": [
                    {
                        "href": "http://139.59.64.214:7990/projects/SBOX"
                    }
                ]
            },
            "id": 2,
            "type": "NORMAL",
            "name": "Sandbox"
        },
        "id": 2,
        "scmId": "git",
        "public": false,
        "name": "sandbox",
        "statusMessage": "Available"
    },
    "actor": {
        "active": true,
        "type": "NORMAL",
        "links": {
            "self": [
                {
                    "href": "http://139.59.64.214:7990/users/hypro999"
                }
            ]
        },
        "displayName": "Hemanth V. Alluri",
        "emailAddress": "f20171170@pilani.bits-pilani.ac.in",
        "slug": "hypro999",
        "id": 1,
        "name": "hypro999"
    },
    "eventKey": "repo:refs_changed",
    "date": "2019-03-17T22:41:19+0530",
    "changes": [
        {
            "toHash": "9b5565bec1d0e8d5d60d423fe70b54849d3aacc4",
            "type": "ADD",
            "ref": {
                "type": "TAG",
                "id": "refs/tags/newtag",
                "displayId": "newtag"
            },
            "fromHash": "0000000000000000000000000000000000000000",
            "refId": "refs/tags/newtag"
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: repo_push_delete_branch.json]---
Location: zulip-main/zerver/webhooks/bitbucket3/fixtures/repo_push_delete_branch.json

```json
{
    "repository": {
        "state": "AVAILABLE",
        "links": {
            "clone": [
                {
                    "href": "ssh://git@139.59.64.214:7999/sbox/sandbox.git",
                    "name": "ssh"
                },
                {
                    "href": "http://139.59.64.214:7990/scm/sbox/sandbox.git",
                    "name": "http"
                }
            ],
            "self": [
                {
                    "href": "http://139.59.64.214:7990/projects/SBOX/repos/sandbox/browse"
                }
            ]
        },
        "forkable": true,
        "slug": "sandbox",
        "project": {
            "key": "SBOX",
            "public": false,
            "links": {
                "self": [
                    {
                        "href": "http://139.59.64.214:7990/projects/SBOX"
                    }
                ]
            },
            "id": 2,
            "type": "NORMAL",
            "name": "Sandbox"
        },
        "id": 2,
        "scmId": "git",
        "public": false,
        "name": "sandbox",
        "statusMessage": "Available"
    },
    "actor": {
        "active": true,
        "type": "NORMAL",
        "links": {
            "self": [
                {
                    "href": "http://139.59.64.214:7990/users/hypro999"
                }
            ]
        },
        "displayName": "Hemanth V. Alluri",
        "emailAddress": "f20171170@pilani.bits-pilani.ac.in",
        "slug": "hypro999",
        "id": 1,
        "name": "hypro999"
    },
    "eventKey": "repo:refs_changed",
    "date": "2019-03-21T09:44:17+0530",
    "changes": [
        {
            "toHash": "0000000000000000000000000000000000000000",
            "type": "DELETE",
            "ref": {
                "type": "BRANCH",
                "id": "refs/heads/branch2",
                "displayId": "branch2"
            },
            "fromHash": "c7fccd35e163571148c42a3e8b11aef6661d19b8",
            "refId": "refs/heads/branch2"
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: repo_push_delete_tag.json]---
Location: zulip-main/zerver/webhooks/bitbucket3/fixtures/repo_push_delete_tag.json

```json
{
    "repository": {
        "state": "AVAILABLE",
        "links": {
            "clone": [
                {
                    "href": "ssh://git@139.59.64.214:7999/sbox/sandbox.git",
                    "name": "ssh"
                },
                {
                    "href": "http://139.59.64.214:7990/scm/sbox/sandbox.git",
                    "name": "http"
                }
            ],
            "self": [
                {
                    "href": "http://139.59.64.214:7990/projects/SBOX/repos/sandbox/browse"
                }
            ]
        },
        "forkable": true,
        "slug": "sandbox",
        "project": {
            "key": "SBOX",
            "public": false,
            "links": {
                "self": [
                    {
                        "href": "http://139.59.64.214:7990/projects/SBOX"
                    }
                ]
            },
            "id": 2,
            "type": "NORMAL",
            "name": "Sandbox"
        },
        "id": 2,
        "scmId": "git",
        "public": false,
        "name": "sandbox",
        "statusMessage": "Available"
    },
    "actor": {
        "active": true,
        "type": "NORMAL",
        "links": {
            "self": [
                {
                    "href": "http://139.59.64.214:7990/users/hypro999"
                }
            ]
        },
        "displayName": "Hemanth V. Alluri",
        "emailAddress": "f20171170@pilani.bits-pilani.ac.in",
        "slug": "hypro999",
        "id": 1,
        "name": "hypro999"
    },
    "eventKey": "repo:refs_changed",
    "date": "2019-03-21T09:54:37+0530",
    "changes": [
        {
            "toHash": "0000000000000000000000000000000000000000",
            "type": "DELETE",
            "ref": {
                "type": "TAG",
                "id": "refs/tags/test-tag",
                "displayId": "test-tag"
            },
            "fromHash": "b223099667fb4f71dd4f6f7d61cd2b7cdb184b37",
            "refId": "refs/tags/test-tag"
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: repo_push_update_multiple_branches.json]---
Location: zulip-main/zerver/webhooks/bitbucket3/fixtures/repo_push_update_multiple_branches.json

```json
{
    "repository": {
        "state": "AVAILABLE",
        "links": {
            "clone": [
                {
                    "href": "ssh://git@139.59.64.214:7999/sbox/sandbox.git",
                    "name": "ssh"
                },
                {
                    "href": "http://139.59.64.214:7990/scm/sbox/sandbox.git",
                    "name": "http"
                }
            ],
            "self": [
                {
                    "href": "http://139.59.64.214:7990/projects/SBOX/repos/sandbox/browse"
                }
            ]
        },
        "forkable": true,
        "slug": "sandbox",
        "project": {
            "key": "SBOX",
            "public": false,
            "links": {
                "self": [
                    {
                        "href": "http://139.59.64.214:7990/projects/SBOX"
                    }
                ]
            },
            "id": 2,
            "type": "NORMAL",
            "name": "Sandbox"
        },
        "id": 2,
        "scmId": "git",
        "public": false,
        "name": "sandbox",
        "statusMessage": "Available"
    },
    "actor": {
        "active": true,
        "type": "NORMAL",
        "links": {
            "self": [
                {
                    "href": "http://139.59.64.214:7990/users/hypro999"
                }
            ]
        },
        "displayName": "Hemanth V. Alluri",
        "emailAddress": "f20171170@pilani.bits-pilani.ac.in",
        "slug": "hypro999",
        "id": 1,
        "name": "hypro999"
    },
    "eventKey": "repo:refs_changed",
    "date": "2019-03-17T19:09:40+0530",
    "changes": [
        {
            "toHash": "3980c2be32a7e23c795741d5dc1a2eecb9b85d6d",
            "type": "UPDATE",
            "ref": {
                "type": "BRANCH",
                "id": "refs/heads/branch1",
                "displayId": "branch1"
            },
            "fromHash": "9e5afb9f11a396eae4bf24755505d931b530649a",
            "refId": "refs/heads/branch1"
        },
        {
            "toHash": "fc43d13cff1abb28631196944ba4fc4ad06a2cf2",
            "type": "UPDATE",
            "ref": {
                "type": "BRANCH",
                "id": "refs/heads/master",
                "displayId": "master"
            },
            "fromHash": "cb2e368ba3aca8a510f89667ae97b56d6a323db7",
            "refId": "refs/heads/master"
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: repo_push_update_single_branch.json]---
Location: zulip-main/zerver/webhooks/bitbucket3/fixtures/repo_push_update_single_branch.json

```json
{
    "actor": {
        "links": {
            "self": [
                {
                    "href": "http://139.59.64.214:7990/users/hypro999"
                }
            ]
        },
        "displayName": "Hemanth V. Alluri",
        "active": true,
        "slug": "hypro999",
        "type": "NORMAL",
        "name": "hypro999",
        "id": 1,
        "emailAddress": "f20171170@pilani.bits-pilani.ac.in"
    },
    "repository": {
        "links": {
            "clone": [
                {
                    "href": "ssh://git@139.59.64.214:7999/sbox/sandbox.git",
                    "name": "ssh"
                },
                {
                    "href": "http://139.59.64.214:7990/scm/sbox/sandbox.git",
                    "name": "http"
                }
            ],
            "self": [
                {
                    "href": "http://139.59.64.214:7990/projects/SBOX/repos/sandbox/browse"
                }
            ]
        },
        "statusMessage": "Available",
        "id": 2,
        "slug": "sandbox",
        "project": {
            "links": {
                "self": [
                    {
                        "href": "http://139.59.64.214:7990/projects/SBOX"
                    }
                ]
            },
            "key": "SBOX",
            "type": "NORMAL",
            "name": "Sandbox",
            "id": 2,
            "public": false
        },
        "name": "sandbox",
        "state": "AVAILABLE",
        "forkable": true,
        "scmId": "git",
        "public": false
    },
    "date": "2019-03-17T18:15:52+0530",
    "eventKey": "repo:refs_changed",
    "changes": [
        {
            "ref": {
                "id": "refs/heads/master",
                "displayId": "master",
                "type": "BRANCH"
            },
            "toHash": "e68c981ef53dbab0a5ca320a2d8d80e216c70528",
            "refId": "refs/heads/master",
            "fromHash": "7c4cae30d77990b9095024bdd6c7bf0d545d870b",
            "type": "UPDATE"
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/buildbot/doc.md

```text
Get Zulip notifications for your Buildbot builds!

!!! tip ""

    This integration requires Buildbot version 2.2.0 or higher.

1. {!create-channel.md!}

1. {!create-an-incoming-webhook.md!}

1. Edit the Buildbot configuration file to add a new Zulip reporter
 ([or follow the steps listed here][1]):

        from buildbot.plugins import reporters

        zs = reporters.ZulipStatusPush('{{ zulip_url }}',
                                       token='api_key',
                                       stream='buildbot')
        c['services'].append(zs)

    When adding the new reporter, modify the code above such that `api_key`
    is the API key of your Zulip bot, and `stream` is set to the channel name
    you want the notifications sent to.

[1]: https://docs.buildbot.net/latest/manual/configuration/reporters/zulip_status.html

{!congrats.md!}

![](/static/images/integrations/buildbot/001.png)
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/buildbot/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class BuildbotHookTests(WebhookTestCase):
    CHANNEL_NAME = "buildbot"
    URL_TEMPLATE = "/api/v1/external/buildbot?api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "buildbot"

    def test_build_started(self) -> None:
        expected_topic_name = "buildbot-hello"
        expected_message = (
            "Build [#33](http://exampleurl.com/#builders/1/builds/33) for **runtests** started."
        )
        self.check_webhook("started", expected_topic_name, expected_message)

    def test_build_success(self) -> None:
        expected_topic_name = "buildbot-hello"
        expected_message = "Build [#33](http://exampleurl.com/#builders/1/builds/33) (result: success) for **runtests** finished."
        self.check_webhook("finished_success", expected_topic_name, expected_message)

    def test_build_failure(self) -> None:
        expected_topic_name = "general"  # project key is empty
        expected_message = "Build [#34](http://exampleurl.com/#builders/1/builds/34) (result: failure) for **runtests** finished."
        self.check_webhook("finished_failure", expected_topic_name, expected_message)

    def test_build_cancelled(self) -> None:
        expected_topic_name = "zulip/zulip-zapier"
        expected_message = "Build [#10434](https://ci.example.org/#builders/79/builds/307) (result: cancelled) for **AMD64 Ubuntu 18.04 Python 3** finished."
        self.check_webhook("finished_cancelled", expected_topic_name, expected_message)
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/buildbot/view.py
Signals: Django

```python
from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_int, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

ALL_EVENT_TYPES = ["new", "finished"]


@webhook_view("Buildbot", all_event_types=ALL_EVENT_TYPES)
@typed_endpoint
def api_buildbot_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    topic_name = payload["project"].tame(check_string)
    if not topic_name:
        topic_name = "general"
    body = get_message(payload)
    check_send_webhook_message(
        request, user_profile, topic_name, body, payload["event"].tame(check_string)
    )
    return json_success(request)


def get_message(payload: WildValue) -> str:
    if "results" in payload:
        # See http://docs.buildbot.net/latest/developer/results.html
        results = ("success", "warnings", "failure", "skipped", "exception", "retry", "cancelled")
        status = results[payload["results"].tame(check_int)]

    event = payload["event"].tame(check_string)
    if event == "new":
        body = "Build [#{id}]({url}) for **{name}** started.".format(
            id=payload["buildid"].tame(check_int),
            name=payload["buildername"].tame(check_string),
            url=payload["url"].tame(check_string),
        )
    elif event == "finished":
        body = "Build [#{id}]({url}) (result: {status}) for **{name}** finished.".format(
            id=payload["buildid"].tame(check_int),
            name=payload["buildername"].tame(check_string),
            url=payload["url"].tame(check_string),
            status=status,
        )

    return body
```

--------------------------------------------------------------------------------

---[FILE: finished_cancelled.json]---
Location: zulip-main/zerver/webhooks/buildbot/fixtures/finished_cancelled.json

```json
{
    "timestamp":1558960446,
    "buildid":10434,
    "project":"zulip\/zulip-zapier",
    "results":6,
    "url":"https:\/\/ci.example.org\/#builders\/79\/builds\/307",
    "event":"finished",
    "buildername":"AMD64 Ubuntu 18.04 Python 3"
}
```

--------------------------------------------------------------------------------

---[FILE: finished_failure.json]---
Location: zulip-main/zerver/webhooks/buildbot/fixtures/finished_failure.json

```json
{
  "event": "finished",
  "buildid": 34,
  "buildername": "runtests",
  "url": "http://exampleurl.com/#builders/1/builds/34",
  "project": "",
  "timestamp": 1553911142,
  "results": 2
}
```

--------------------------------------------------------------------------------

---[FILE: finished_success.json]---
Location: zulip-main/zerver/webhooks/buildbot/fixtures/finished_success.json

```json
{
	  "event": "finished",
	  "buildid": 33,
	  "buildername": "runtests",
	  "url": "http://exampleurl.com/#builders/1/builds/33",
	  "project": "buildbot-hello",
	  "timestamp": 1553910552,
	  "results": 0
}
```

--------------------------------------------------------------------------------

---[FILE: started.json]---
Location: zulip-main/zerver/webhooks/buildbot/fixtures/started.json

```json
{
  "event": "new",
  "buildid": 33,
  "buildername": "runtests",
  "url": "http://exampleurl.com/#builders/1/builds/33",
  "project": "buildbot-hello",
  "timestamp": 1553910544
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/canarytoken/doc.md

```text
# Zulip Thinkst Canarytoken integration

See your Thinkst Canarytoken alerts in Zulip!

This integration works with Canarytokens from
[canarytokens.org][canarytokens], not Thinkst's paid product. See the
[Zulip Thinkst integration](/integrations/thinkst) for those!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Go to [canarytokens.org][canarytokens].

1. From the **Select your token**  dropdown, choose the type of webhook
   that you want to create. In the **Provide an email address or webhook
   URL** field, enter the generated URL above. Add a reminder note, and
   click **Create my Canarytoken**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/canarytoken/001.png)

### Related documentation

{!webhooks-url-specification.md!}

[canarytokens]: https://canarytokens.org
```

--------------------------------------------------------------------------------

````
