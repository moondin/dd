---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1132
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1132 of 1290)

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

---[FILE: pull_request_comment_deleted.json]---
Location: zulip-main/zerver/webhooks/bitbucket3/fixtures/pull_request_comment_deleted.json

```json
{
    "comment": {
        "author": {
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
        "id": 2,
        "updatedDate": 1553585861365,
        "tasks": [],
        "comments": [],
        "version": 4,
        "text": "This seems like a pretty good idea. @shimura what do you think?",
        "createdDate": 1553585547535
    },
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
    "eventKey": "pr:comment:deleted",
    "date": "2019-03-26T13:08:41+0530",
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
    }
}
```

--------------------------------------------------------------------------------

---[FILE: pull_request_comment_edited.json]---
Location: zulip-main/zerver/webhooks/bitbucket3/fixtures/pull_request_comment_edited.json

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
    "comment": {
        "author": {
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
        "id": 2,
        "updatedDate": 1553585861365,
        "tasks": [],
        "comments": [],
        "version": 4,
        "text": "This seems like a pretty good idea. @shimura what do you think?",
        "createdDate": 1553585547535,
        "properties": {
            "repositoryId": 2
        }
    },
    "previousComment": "This seems like a pretty good idea.",
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
    "eventKey": "pr:comment:edited",
    "date": "2019-03-26T13:07:41+0530"
}
```

--------------------------------------------------------------------------------

---[FILE: pull_request_declined.json]---
Location: zulip-main/zerver/webhooks/bitbucket3/fixtures/pull_request_declined.json

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
    "eventKey": "pr:declined",
    "date": "2019-03-26T15:53:42+0530",
    "pullRequest": {
        "locked": false,
        "state": "DECLINED",
        "description": "I just got a crazy idea, how 'bout we just delete everything?",
        "closed": true,
        "open": false,
        "title": "Crazy Idea",
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
            "latestCommit": "1015204bf62881c5ef9e18e6e73e0211a667a00c"
        },
        "closedDate": 1553595822665,
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
                    "href": "http://139.59.64.214:7990/projects/SBOX/repos/sandbox/pull-requests/7"
                }
            ]
        },
        "createdDate": 1553595372759,
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
            "id": "refs/heads/crazy_idea",
            "displayId": "crazy_idea",
            "latestCommit": "dd17f2eaad634e292068ef7f353b3538334d31f1"
        },
        "version": 2,
        "id": 7,
        "updatedDate": 1553595822665,
        "participants": []
    }
}
```

--------------------------------------------------------------------------------

---[FILE: pull_request_deleted.json]---
Location: zulip-main/zerver/webhooks/bitbucket3/fixtures/pull_request_deleted.json

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
    "eventKey": "pr:deleted",
    "date": "2019-03-21T19:29:49+0530",
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
