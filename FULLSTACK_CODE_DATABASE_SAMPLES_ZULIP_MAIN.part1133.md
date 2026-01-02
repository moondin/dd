---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1133
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1133 of 1290)

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

---[FILE: pull_request_merged.json]---
Location: zulip-main/zerver/webhooks/bitbucket3/fixtures/pull_request_merged.json

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
    "eventKey": "pr:merged",
    "date": "2019-03-26T15:52:24+0530",
    "pullRequest": {
        "locked": false,
        "state": "MERGED",
        "description": "Add a simple text file for further testing purposes.",
        "closed": true,
        "open": false,
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
        "closedDate": 1553595743394,
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
            },
            {
                "status": "APPROVED",
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
                "approved": true
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
        "properties": {
            "mergeCommit": {
                "id": "1015204bf62881c5ef9e18e6e73e0211a667a00c",
                "displayId": "1015204bf62"
            }
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
        "version": 2,
        "id": 6,
        "updatedDate": 1553595743394,
        "participants": []
    }
}
```

--------------------------------------------------------------------------------

---[FILE: pull_request_modified.json]---
Location: zulip-main/zerver/webhooks/bitbucket3/fixtures/pull_request_modified.json

```json
{
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
    "previousDescription": "* Add file2.txt\r\n* Add file3.txt",
    "pullRequest": {
        "locked": false,
        "state": "OPEN",
        "description": "* Add file2.txt\n* Add file3.txt\nBoth of these files would be important additions to the project!",
        "closed": false,
        "open": true,
        "title": "Branch1",
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
            "latestCommit": "508d1b67f1f8f3a25f543a030a7a178894aa9907"
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
                    "href": "http://139.59.64.214:7990/projects/SBOX/repos/sandbox/pull-requests/1"
                }
            ]
        },
        "createdDate": 1553172738844,
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
            "id": "refs/heads/branch1",
            "displayId": "branch1",
            "latestCommit": "3980c2be32a7e23c795741d5dc1a2eecb9b85d6d"
        },
        "version": 1,
        "id": 1,
        "updatedDate": 1553337991505,
        "participants": []
    },
    "previousTitle": "Branch1",
    "previousTarget": {
        "latestChangeset": "508d1b67f1f8f3a25f543a030a7a178894aa9907",
        "type": "BRANCH",
        "id": "refs/heads/master",
        "displayId": "master",
        "latestCommit": "508d1b67f1f8f3a25f543a030a7a178894aa9907"
    },
    "eventKey": "pr:modified",
    "date": "2019-03-23T16:16:31+0530"
}
```

--------------------------------------------------------------------------------

---[FILE: pull_request_needs_work.json]---
Location: zulip-main/zerver/webhooks/bitbucket3/fixtures/pull_request_needs_work.json

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
    "previousStatus": "UNAPPROVED",
    "participant": {
        "status": "NEEDS_WORK",
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
                "status": "NEEDS_WORK",
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
    "eventKey": "pr:reviewer:needs_work",
    "date": "2019-03-26T15:50:44+0530"
}
```

--------------------------------------------------------------------------------

---[FILE: pull_request_opened_without_description.json]---
Location: zulip-main/zerver/webhooks/bitbucket3/fixtures/pull_request_opened_without_description.json

```json
{
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
    "eventKey": "pr:opened",
    "date": "2019-03-21T19:23:56+0530",
    "pullRequest": {
        "locked": false,
        "state": "OPEN",
        "closed": false,
        "open": true,
        "title": "Add notes feature.",
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
            "latestCommit": "508d1b67f1f8f3a25f543a030a7a178894aa9907"
        },
        "reviewers": [],
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
                    "href": "http://139.59.64.214:7990/projects/SBOX/repos/sandbox/pull-requests/2"
                }
            ]
        },
        "createdDate": 1553176436660,
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
            "latestCommit": "1a8de2fd34dcf6c9c2117b62eb17a266736aad7f"
        },
        "version": 0,
        "id": 2,
        "updatedDate": 1553176436660,
        "participants": []
    }
}
```

--------------------------------------------------------------------------------

````
