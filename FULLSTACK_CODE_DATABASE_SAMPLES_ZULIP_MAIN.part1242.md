---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1242
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1242 of 1290)

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
Location: zulip-main/zerver/webhooks/rhodecode/fixtures/push__local_branch_without_commits.json

```json
{
    "event": {
      "repo": {
        "repo_name": "u/yuroitaki/zulip-testing",
        "permalink_url": "https://code.rhodecode.com/_1936",
        "repo_type": "git",
        "extra_fields": {},
        "url": "https://code.rhodecode.com/u/yuroitaki/zulip-testing",
        "repo_id": 1936
      },
      "actor_ip": "14.192.212.32",
      "utc_timestamp": "2022-07-10T08:07:32.747",
      "name": "repo-push",
      "actor": {
        "user_id": 2263,
        "username": "yuroitaki"
      },
      "push": {
        "issues": {},
        "commits": [],
        "branches": [
          {
            "url": "https://code.rhodecode.com/u/yuroitaki/zulip-testing/changelog?branch=dev",
            "name": "dev"
          }
        ],
        "tags": []
      },
      "server_url": "https://code.rhodecode.com"
    },
    "token": ""
}
```

--------------------------------------------------------------------------------

---[FILE: push__multiple_committers.json]---
Location: zulip-main/zerver/webhooks/rhodecode/fixtures/push__multiple_committers.json

```json
{
    "event": {
      "repo": {
        "repo_name": "u/yuroitaki/zulip-testing",
        "permalink_url": "https://code.rhodecode.com/_1936",
        "repo_type": "git",
        "extra_fields": {},
        "url": "https://code.rhodecode.com/u/yuroitaki/zulip-testing",
        "repo_id": 1936
      },
      "actor_ip": "14.192.212.32",
      "utc_timestamp": "2022-07-10T08:22:48.930",
      "name": "repo-push",
      "actor": {
        "user_id": 2263,
        "username": "yuroitaki"
      },
      "push": {
        "issues": {},
        "commits": [
          {
            "parents": [
              {
                "raw_id": "2b8c0ebf50710bc2e1cdb6a33071dd2435ad667c"
              }
            ],
            "message_html_title": "Add test.py",
            "raw_id": "b0d892e1cdd4236b1f74debca1772ea330ff5acd",
            "author": "Yuro Itaki <yuroitaki@email.com>",
            "short_id": "b0d892e1cdd4",
            "branch": "master",
            "revision": 2,
            "permalink_url": "https://code.rhodecode.com/1936/changeset/b0d892e1cdd4236b1f74debca1772ea330ff5acd",
            "message_html": "Add test.py\n",
            "mentions": [],
            "url": "https://code.rhodecode.com/u/yuroitaki/zulip-testing/changeset/b0d892e1cdd4236b1f74debca1772ea330ff5acd",
            "message": "Add test.py\n",
            "issues": [],
            "refs": {
              "tags": [],
              "bookmarks": [],
              "branches": []
            },
            "date": "2022-07-10T08:21:51",
            "reviewers": []
          },
          {
            "parents": [
              {
                "raw_id": "b0d892e1cdd4236b1f74debca1772ea330ff5acd"
              }
            ],
            "message_html_title": "Modify test.py",
            "raw_id": "6dbae5f842f80ccb05508a1de7aace9d0f327473",
            "author": "Itachi Sensei <itachisensei@email.com>",
            "short_id": "6dbae5f842f8",
            "branch": "master",
            "revision": 3,
            "permalink_url": "https://code.rhodecode.com/1936/changeset/6dbae5f842f80ccb05508a1de7aace9d0f327473",
            "message_html": "Modify test.py\n",
            "mentions": [],
            "url": "https://code.rhodecode.com/u/yuroitaki/zulip-testing/changeset/6dbae5f842f80ccb05508a1de7aace9d0f327473",
            "message": "Modify test.py\n",
            "issues": [],
            "refs": {
              "tags": [],
              "bookmarks": [],
              "branches": [
                "master"
              ]
            },
            "date": "2022-07-10T08:22:42",
            "reviewers": []
          }
        ],
        "branches": [
          {
            "url": "https://code.rhodecode.com/u/yuroitaki/zulip-testing/changelog?branch=master",
            "name": "master"
          }
        ],
        "tags": []
      },
      "server_url": "https://code.rhodecode.com"
    },
    "token": ""
}
```

--------------------------------------------------------------------------------

---[FILE: push__multiple_committers_with_others.json]---
Location: zulip-main/zerver/webhooks/rhodecode/fixtures/push__multiple_committers_with_others.json

```json
{
    "event": {
      "repo": {
        "repo_name": "u/yuroitaki/zulip-testing",
        "permalink_url": "https://code.rhodecode.com/_1936",
        "repo_type": "git",
        "extra_fields": {},
        "url": "https://code.rhodecode.com/u/yuroitaki/zulip-testing",
        "repo_id": 1936
      },
      "actor_ip": "14.192.212.32",
      "utc_timestamp": "2022-07-10T08:22:48.930",
      "name": "repo-push",
      "actor": {
        "user_id": 2263,
        "username": "yuroitaki"
      },
      "push": {
        "issues": {},
        "commits": [
          {
            "parents": [
              {
                "raw_id": "2b8c0ebf50710bc2e1cdb6a33071dd2435ad667c"
              }
            ],
            "message_html_title": "Add test.py",
            "raw_id": "b0d892e1cdd4236b1f74debca1772ea330ff5acd",
            "author": "Yuro Itaki <yuroitaki@email.com>",
            "short_id": "b0d892e1cdd4",
            "branch": "master",
            "revision": 2,
            "permalink_url": "https://code.rhodecode.com/1936/changeset/b0d892e1cdd4236b1f74debca1772ea330ff5acd",
            "message_html": "Add test.py\n",
            "mentions": [],
            "url": "https://code.rhodecode.com/u/yuroitaki/zulip-testing/changeset/b0d892e1cdd4236b1f74debca1772ea330ff5acd",
            "message": "Add test.py\n",
            "issues": [],
            "refs": {
              "tags": [],
              "bookmarks": [],
              "branches": []
            },
            "date": "2022-07-10T08:21:51",
            "reviewers": []
          },
          {
            "parents": [
              {
                "raw_id": "b0d892e1cdd4236b1f74debca1772ea330ff5acd"
              }
            ],
            "message_html_title": "Modify test.py",
            "raw_id": "6dbae5f842f80ccb05508a1de7aace9d0f327473",
            "author": "Itachi Sensei <itachisensei@email.com>",
            "short_id": "6dbae5f842f8",
            "branch": "master",
            "revision": 3,
            "permalink_url": "https://code.rhodecode.com/1936/changeset/6dbae5f842f80ccb05508a1de7aace9d0f327473",
            "message_html": "Modify test.py\n",
            "mentions": [],
            "url": "https://code.rhodecode.com/u/yuroitaki/zulip-testing/changeset/6dbae5f842f80ccb05508a1de7aace9d0f327473",
            "message": "Modify test.py\n",
            "issues": [],
            "refs": {
              "tags": [],
              "bookmarks": [],
              "branches": [
                "master"
              ]
            },
            "date": "2022-07-10T08:22:42",
            "reviewers": []
          },
          {
            "parents": [
              {
                "raw_id": "b0d892e1cdd4236b1f74debca1772ea330ff5acd"
              }
            ],
            "message_html_title": "Modify test.py",
            "raw_id": "6dbae5f842f80ccb05508a1de7aace9d0f327473",
            "author": "Itachi Sensei <itachisensei@email.com>",
            "short_id": "6dbae5f842f8",
            "branch": "master",
            "revision": 3,
            "permalink_url": "https://code.rhodecode.com/1936/changeset/6dbae5f842f80ccb05508a1de7aace9d0f327473",
            "message_html": "Modify test.py\n",
            "mentions": [],
            "url": "https://code.rhodecode.com/u/yuroitaki/zulip-testing/changeset/6dbae5f842f80ccb05508a1de7aace9d0f327473",
            "message": "Modify test.py\n",
            "issues": [],
            "refs": {
              "tags": [],
              "bookmarks": [],
              "branches": [
                "master"
              ]
            },
            "date": "2022-07-10T08:22:42",
            "reviewers": []
          },
          {
            "parents": [
              {
                "raw_id": "b0d892e1cdd4236b1f74debca1772ea330ff5acd"
              }
            ],
            "message_html_title": "Modify test.py",
            "raw_id": "6dbae5f842f80ccb05508a1de7aace9d0f327473",
            "author": "Jonas Nielsen <jonasnielsen@email.com>",
            "short_id": "6dbae5f842f8",
            "branch": "master",
            "revision": 3,
            "permalink_url": "https://code.rhodecode.com/1936/changeset/6dbae5f842f80ccb05508a1de7aace9d0f327473",
            "message_html": "Modify test.py\n",
            "mentions": [],
            "url": "https://code.rhodecode.com/u/yuroitaki/zulip-testing/changeset/6dbae5f842f80ccb05508a1de7aace9d0f327473",
            "message": "Modify test.py\n",
            "issues": [],
            "refs": {
              "tags": [],
              "bookmarks": [],
              "branches": [
                "master"
              ]
            },
            "date": "2022-07-10T08:22:42",
            "reviewers": []
          },
          {
            "parents": [
              {
                "raw_id": "b0d892e1cdd4236b1f74debca1772ea330ff5acd"
              }
            ],
            "message_html_title": "Modify test.py",
            "raw_id": "6dbae5f842f80ccb05508a1de7aace9d0f327473",
            "author": "Lelouch Strange <lelouchstrange@email.com>",
            "short_id": "6dbae5f842f8",
            "branch": "master",
            "revision": 3,
            "permalink_url": "https://code.rhodecode.com/1936/changeset/6dbae5f842f80ccb05508a1de7aace9d0f327473",
            "message_html": "Modify test.py\n",
            "mentions": [],
            "url": "https://code.rhodecode.com/u/yuroitaki/zulip-testing/changeset/6dbae5f842f80ccb05508a1de7aace9d0f327473",
            "message": "Modify test.py\n",
            "issues": [],
            "refs": {
              "tags": [],
              "bookmarks": [],
              "branches": [
                "master"
              ]
            },
            "date": "2022-07-10T08:22:42",
            "reviewers": []
          },
          {
            "parents": [
              {
                "raw_id": "2b8c0ebf50710bc2e1cdb6a33071dd2435ad667c"
              }
            ],
            "message_html_title": "Add test.py",
            "raw_id": "b0d892e1cdd4236b1f74debca1772ea330ff5acd",
            "author": "Yuro Itaki <yuroitaki@email.com>",
            "short_id": "b0d892e1cdd4",
            "branch": "master",
            "revision": 2,
            "permalink_url": "https://code.rhodecode.com/1936/changeset/b0d892e1cdd4236b1f74debca1772ea330ff5acd",
            "message_html": "Add test.py\n",
            "mentions": [],
            "url": "https://code.rhodecode.com/u/yuroitaki/zulip-testing/changeset/b0d892e1cdd4236b1f74debca1772ea330ff5acd",
            "message": "Add test.py\n",
            "issues": [],
            "refs": {
              "tags": [],
              "bookmarks": [],
              "branches": []
            },
            "date": "2022-07-10T08:21:51",
            "reviewers": []
          }
        ],
        "branches": [
          {
            "url": "https://code.rhodecode.com/u/yuroitaki/zulip-testing/changelog?branch=master",
            "name": "master"
          }
        ],
        "tags": []
      },
      "server_url": "https://code.rhodecode.com"
    },
    "token": ""
}
```

--------------------------------------------------------------------------------

---[FILE: push__remove_branch.json]---
Location: zulip-main/zerver/webhooks/rhodecode/fixtures/push__remove_branch.json

```json
{
    "event": {
      "repo": {
        "repo_name": "u/yuroitaki/zulip-testing",
        "permalink_url": "https://code.rhodecode.com/_1936",
        "repo_type": "git",
        "extra_fields": {},
        "url": "https://code.rhodecode.com/u/yuroitaki/zulip-testing",
        "repo_id": 1936
      },
      "actor_ip": "14.192.212.32",
      "utc_timestamp": "2022-07-10T09:01:54.648",
      "name": "repo-push",
      "actor": {
        "user_id": 2263,
        "username": "yuroitaki"
      },
      "push": {
        "issues": {},
        "commits": [
          {
            "message_html_title": "Deleted branch dev",
            "raw_id": "delete_branch=>dev",
            "author": "Yuro Itaki <yuroitaki@email.com>",
            "reviewers": [],
            "branch": null,
            "short_id": "delete_branch=>dev",
            "permalink_url": "https://code.rhodecode.com/1936/changeset/delete_branch=%3Edev",
            "message_html": "Deleted branch dev",
            "mentions": [],
            "url": "https://code.rhodecode.com/u/yuroitaki/zulip-testing/changeset/delete_branch=%3Edev",
            "message": "Deleted branch dev",
            "issues": [],
            "refs": {
              "tags": [],
              "bookmarks": [],
              "branches": []
            },
            "date": "2022-07-10T09:01:54.670",
            "git_ref_change": "branch_delete"
          }
        ],
        "branches": [],
        "tags": []
      },
      "server_url": "https://code.rhodecode.com"
    },
    "token": ""
}
```

--------------------------------------------------------------------------------

---[FILE: event_occurred_10_exp_n_items.json]---
Location: zulip-main/zerver/webhooks/rollbar/fixtures/event_occurred_10_exp_n_items.json

```json
{
    "event_name": "exp_repeat_item",
    "data": {
        "item": {
            "public_item_id": null,
            "integrations_data": {},
            "level_lock": 0,
            "last_activated_timestamp": 1515470048,
            "assigned_user_id": null,
            "group_status": 1,
            "hash": "31cd6a4aee99a094c09f3724bf2bc2288bcd0c9d",
            "id": 496445267,
            "environment": "production",
            "title_lock": 0,
            "title": "An Error",
            "last_occurrence_id": 35686807584,
            "last_occurrence_timestamp": 1515470382,
            "platform": 0,
            "first_occurrence_timestamp": 1515470048,
            "project_id": 162774,
            "resolved_in_version": null,
            "status": 1,
            "unique_occurrences": null,
            "group_item_id": null,
            "last_occurrence": {
                "body": {
                    "message": {
                        "body": "An Error"
                    }
                },
                "uuid": "62f54a7b-86a0-4016-9adb-14237627f6ef",
                "language": "python 3.6.3",
                "level": "error",
                "timestamp": 1515470382,
                "server": {
                    "host": "DESKTOP-6LMFI2P",
                    "pid": 12472,
                    "argv": [
                        "C:\\Python27\\rollbartest.py"
                    ]
                },
                "environment": "production",
                "framework": "unknown",
                "notifier": {
                    "version": "0.13.17",
                    "name": "pyrollbar"
                },
                "metadata": {
                    "access_token": "7ac6f65439684ac386a6a3950ba7059b",
                    "debug": {
                        "routes": {
                            "start_time": 1513455526667,
                            "counters": {
                                "post_item": 18899117
                            }
                        }
                    },
                    "customer_timestamp": 1515470381,
                    "api_server_hostname": "api05",
                    "timestamp_ms": 1515470382343
                }
            },
            "framework": 13,
            "total_occurrences": 10,
            "level": 40,
            "counter": 7,
            "last_modified_by": 8247,
            "first_occurrence_id": 35686638471,
            "activating_occurrence_id": 35686638471
        },
        "occurrences": 10
    }
}
```

--------------------------------------------------------------------------------

---[FILE: every_occurrence.json]---
Location: zulip-main/zerver/webhooks/rollbar/fixtures/every_occurrence.json

```json
{
    "event_name": "occurrence",
    "data": {
        "item": {
            "public_item_id": null,
            "integrations_data": {},
            "level_lock": 0,
            "last_activated_timestamp": 1515545958,
            "assigned_user_id": null,
            "group_status": 1,
            "hash": "1685f5ca9f20bd77803b170f4d8be78f7f3c6a63",
            "id": 496735830,
            "environment": "production",
            "title_lock": 0,
            "title": "new again again",
            "last_occurrence_id": 35726608283,
            "last_occurrence_timestamp": 1515545958,
            "platform": 0,
            "first_occurrence_timestamp": 1515545958,
            "project_id": 162774,
            "resolved_in_version": null,
            "status": 1,
            "unique_occurrences": null,
            "group_item_id": null,
            "framework": 13,
            "total_occurrences": 2,
            "level": 40,
            "counter": 10,
            "last_modified_by": 8247,
            "first_occurrence_id": 35726608283,
            "activating_occurrence_id": 35726608283
        },
        "occurrence": {
            "body": {
                "message": {
                    "body": "new again again"
                }
            },
            "uuid": "661f18aa-0703-42db-8e02-15ffc9d5d38a",
            "language": "python 3.6.3",
            "level": "error",
            "timestamp": 1515545958,
            "server": {
                "host": "DESKTOP-6LMFI2P",
                "pid": 14392,
                "argv": [
                    "C:\\Python27\\rollbartest.py"
                ]
            },
            "environment": "production",
            "framework": "unknown",
            "notifier": {
                "version": "0.13.17",
                "name": "pyrollbar"
            },
            "metadata": {
                "customer_timestamp": 1515545954
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: high_occurrence_rate.json]---
Location: zulip-main/zerver/webhooks/rollbar/fixtures/high_occurrence_rate.json

```json
{
    "event_name": "item_velocity",
    "data": {
        "item": {
            "public_item_id": null,
            "integrations_data": {},
            "level_lock": 1,
            "last_activated_timestamp": 1515470113,
            "assigned_user_id": 110361,
            "group_status": 1,
            "hash": "4be154a9fc129b2f1901b52ba5ef262b8b0e406c",
            "id": 495300143,
            "environment": "production",
            "title_lock": 0,
            "title": "All set.",
            "last_occurrence_id": 35687211870,
            "last_occurrence_timestamp": 1515471152,
            "platform": 0,
            "first_occurrence_timestamp": 1514961665,
            "project_id": 162774,
            "resolved_in_version": null,
            "status": 1,
            "unique_occurrences": null,
            "group_item_id": null,
            "framework": 13,
            "total_occurrences": 12,
            "level": 50,
            "counter": 3,
            "last_modified_by": 8247,
            "first_occurrence_id": 35445911833,
            "activating_occurrence_id": 35686669981
        },
        "trigger": {
            "threshold": 10,
            "window_size": 300,
            "window_size_description": "5 minutes"
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: new_item.json]---
Location: zulip-main/zerver/webhooks/rollbar/fixtures/new_item.json

```json
{
    "event_name": "new_item",
    "data": {
        "item": {
            "public_item_id": null,
            "integrations_data": {},
            "level_lock": 0,
            "last_activated_timestamp": 1515470048,
            "assigned_user_id": null,
            "group_status": 1,
            "hash": "31cd6a4aee99a094c09f3724bf2bc2288bcd0c9d",
            "id": 496445267,
            "environment": "production",
            "title_lock": 0,
            "title": "An Error",
            "last_occurrence_id": 35686638471,
            "last_occurrence_timestamp": 1515470048,
            "platform": 0,
            "first_occurrence_timestamp": 1515470048,
            "project_id": 162774,
            "resolved_in_version": null,
            "status": 1,
            "unique_occurrences": null,
            "group_item_id": null,
            "last_occurrence": {
                "body": {
                    "message": {
                        "body": "An Error"
                    }
                },
                "uuid": "9342eca6-09e7-4bab-89f1-ff16da631853",
                "language": "python 3.6.3",
                "level": "error",
                "timestamp": 1515470048,
                "server": {
                    "host": "DESKTOP-6LMFI2P",
                    "pid": 11348,
                    "argv": [
                        "C:\\Python27\\rollbartest.py"
                    ]
                },
                "environment": "production",
                "framework": "unknown",
                "notifier": {
                    "version": "0.13.17",
                    "name": "pyrollbar"
                },
                "metadata": {
                    "access_token": "7ac6f65439684ac386a6a3950ba7059b",
                    "debug": {
                        "routes": {
                            "start_time": 1513455858783,
                            "counters": {
                                "post_item": 20484633
                            }
                        }
                    },
                    "customer_timestamp": 1515470047,
                    "api_server_hostname": "api03",
                    "timestamp_ms": 1515470048909
                }
            },
            "framework": 13,
            "total_occurrences": 1,
            "level": 40,
            "counter": 7,
            "last_modified_by": 2147,
            "first_occurrence_id": 35686638471,
            "activating_occurrence_id": 35686638471
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: reactivated_item.json]---
Location: zulip-main/zerver/webhooks/rollbar/fixtures/reactivated_item.json

```json
{
    "event_name": "reactivated_item",
    "data": {
        "item": {
            "public_item_id": null,
            "integrations_data": {},
            "level_lock": 1,
            "last_activated_timestamp": 1515470113,
            "assigned_user_id": 110361,
            "group_status": 1,
            "hash": "4be154a9fc129b2f1901b52ba5ef262b8b0e406c",
            "id": 495300143,
            "environment": "production",
            "title_lock": 0,
            "title": "All set.",
            "last_occurrence_id": 35686669981,
            "last_occurrence_timestamp": 1515470113,
            "platform": 0,
            "first_occurrence_timestamp": 1514961665,
            "project_id": 162774,
            "resolved_in_version": null,
            "status": 1,
            "unique_occurrences": null,
            "group_item_id": null,
            "last_occurrence": {
                "body": {
                    "message": {
                        "body": "All set."
                    }
                },
                "uuid": "6775efce-be1f-42c9-8a9c-0e7e5e238193",
                "language": "python 3.6.3",
                "level": "error",
                "timestamp": 1515470113,
                "server": {
                    "host": "DESKTOP-6LMFI2P",
                    "pid": 3652,
                    "argv": [
                        "C:\\Python27\\rollbartest.py"
                    ]
                },
                "environment": "production",
                "framework": "unknown",
                "notifier": {
                    "version": "0.13.17",
                    "name": "pyrollbar"
                },
                "metadata": {
                    "access_token": "7ac6f65439684ac386a6a3950ba7059b",
                    "debug": {
                        "routes": {
                            "start_time": 1513455902630,
                            "counters": {
                                "post_item": 20484233
                            }
                        }
                    },
                    "customer_timestamp": 1515470112,
                    "api_server_hostname": "api03",
                    "timestamp_ms": 1515470113413
                }
            },
            "framework": 13,
            "total_occurrences": 1,
            "level": 40,
            "counter": 3,
            "last_modified_by": 8247,
            "first_occurrence_id": 35445911833,
            "activating_occurrence_id": 35686669981
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: reopened_item.json]---
Location: zulip-main/zerver/webhooks/rollbar/fixtures/reopened_item.json

```json
{
    "event_name": "reopened_item",
    "data": {
        "item": {
            "public_item_id": null,
            "integrations_data": {},
            "level_lock": 1,
            "last_activated_timestamp": 1515469672,
            "assigned_user_id": 110361,
            "group_status": 1,
            "hash": "4be154a9fc129b2f1901b52ba5ef262b8b0e406c",
            "id": 495300143,
            "environment": "production",
            "title_lock": 0,
            "title": "All set.",
            "last_occurrence_id": 35683042294,
            "last_occurrence_timestamp": 1515463181,
            "platform": 0,
            "first_occurrence_timestamp": 1514961665,
            "project_id": 162774,
            "resolved_in_version": null,
            "status": 1,
            "unique_occurrences": null,
            "group_item_id": null,
            "last_occurrence": {
                "body": {
                    "message": {
                        "body": "All set."
                    }
                },
                "uuid": "aeb171e7-0c7d-4a99-b2d0-7f7720af212f",
                "language": "python 3.6.3",
                "level": "error",
                "timestamp": 1515463181,
                "server": {
                    "host": "DESKTOP-6LMFI2P",
                    "pid": 15920,
                    "argv": [
                        "C:\\Python27\\rollbartest.py"
                    ]
                },
                "environment": "production",
                "framework": "unknown",
                "notifier": {
                    "version": "0.13.17",
                    "name": "pyrollbar"
                },
                "metadata": {
                    "access_token": "7ac6f65439684ac386a6a3950ba7059b",
                    "debug": {
                        "routes": {
                            "start_time": 1513456259983,
                            "counters": {
                                "post_item": 17514904
                            }
                        }
                    },
                    "customer_timestamp": 1515463180,
                    "api_server_hostname": "api02",
                    "timestamp_ms": 1515463181246
                }
            },
            "framework": 13,
            "total_occurrences": 127,
            "level": 40,
            "counter": 3,
            "last_modified_by": 110361,
            "first_occurrence_id": 35445911833,
            "activating_occurrence_id": 35677890483
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: resolved_item.json]---
Location: zulip-main/zerver/webhooks/rollbar/fixtures/resolved_item.json

```json
{
    "event_name": "resolved_item",
    "data": {
        "item": {
            "public_item_id": null,
            "integrations_data": {},
            "level_lock": 1,
            "last_activated_timestamp": 1515453018,
            "assigned_user_id": 110361,
            "group_status": 1,
            "hash": "4be154a9fc129b2f1901b52ba5ef262b8b0e406c",
            "id": 495300143,
            "environment": "production",
            "title_lock": 0,
            "title": "All set.",
            "last_occurrence_id": 35683042294,
            "last_occurrence_timestamp": 1515463181,
            "platform": 0,
            "first_occurrence_timestamp": 1514961665,
            "project_id": 162774,
            "resolved_in_version": null,
            "status": 2,
            "unique_occurrences": null,
            "group_item_id": null,
            "last_occurrence": {
                "body": {
                    "message": {
                        "body": "All set."
                    }
                },
                "uuid": "aeb171e7-0c7d-4a99-b2d0-7f7720af212f",
                "language": "python 3.6.3",
                "level": "error",
                "timestamp": 1515463181,
                "server": {
                    "host": "DESKTOP-6LMFI2P",
                    "pid": 15920,
                    "argv": [
                        "C:\\Python27\\rollbartest.py"
                    ]
                },
                "environment": "production",
                "framework": "unknown",
                "notifier": {
                    "version": "0.13.17",
                    "name": "pyrollbar"
                },
                "metadata": {
                    "access_token": "7ac6f65439684ac386a6a3950ba7059b",
                    "debug": {
                        "routes": {
                            "start_time": 1513456259983,
                            "counters": {
                                "post_item": 17514904
                            }
                        }
                    },
                    "customer_timestamp": 1515463180,
                    "api_server_hostname": "api02",
                    "timestamp_ms": 1515463181246
                }
            },
            "framework": 13,
            "total_occurrences": 127,
            "level": 40,
            "counter": 3,
            "last_modified_by": 110361,
            "first_occurrence_id": 35445911833,
            "activating_occurrence_id": 35677890483
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: test.json]---
Location: zulip-main/zerver/webhooks/rollbar/fixtures/test.json

```json
{
    "event_name": "test",
    "data": {
        "message": "This is a test payload from Rollbar. If you got this, it works!"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/rundeck/doc.md

```text
# Zulip Rundeck integration

Receive Rundeck job notifications in Zulip!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Go to your Rundeck web interface, and click on the desired job.
   Click on **Actions**, and select **Edit this Job**.

1. Go to the **Notifications** tab. Next to the desired event, click
   **Add Notification**.

1. Select **Send Webhook** as the Notification Type. Enter the URL
   generated above. Ensure payload format is **JSON**, and the method is
   **POST**. Click **Save**.

{end_tabs}

{!congrats.md!}

![Rundeck Integration](/static/images/integrations/rundeck/001.png)

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/rundeck/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class RundeckHookTests(WebhookTestCase):
    CHANNEL_NAME = "Rundeck"
    TOPIC_NAME = "Global Log Filter Usage"
    URL_TEMPLATE = "/api/v1/external/rundeck?&api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "rundeck"

    def test_start_message(self) -> None:
        expected_message = "[Global Log Filter Usage](http://localhost:4440/project/welcome-project-community/job/show/a0296d93-4b10-48d7-8b7d-86ad3f603b85) execution [#3](http://localhost:4440/project/welcome-project-community/execution/show/3) for welcome-project-community has started. :running:"

        self.check_webhook(
            "start",
            RundeckHookTests.TOPIC_NAME,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_success_message(self) -> None:
        expected_message = "[Global Log Filter Usage](http://localhost:4440/project/welcome-project-community/job/show/a0296d93-4b10-48d7-8b7d-86ad3f603b85) execution [#3](http://localhost:4440/project/welcome-project-community/execution/show/3) for welcome-project-community has succeeded. :check:"

        self.check_webhook(
            "success",
            RundeckHookTests.TOPIC_NAME,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_failure_message(self) -> None:
        expected_message = "[Global Log Filter Usage](http://localhost:4440/project/welcome-project-community/job/show/a0296d93-4b10-48d7-8b7d-86ad3f603b85) execution [#7](http://localhost:4440/project/welcome-project-community/execution/show/7) for welcome-project-community has failed. :cross_mark:"

        self.check_webhook(
            "failure",
            RundeckHookTests.TOPIC_NAME,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_duration_message(self) -> None:
        expected_message = "[Global Log Filter Usage](http://localhost:4440/project/welcome-project-community/job/show/a0296d93-4b10-48d7-8b7d-86ad3f603b85) execution [#6](http://localhost:4440/project/welcome-project-community/execution/show/6) for welcome-project-community is running long. :time_ticking:"

        self.check_webhook(
            "duration",
            RundeckHookTests.TOPIC_NAME,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_scheduled_start_message(self) -> None:
        expected_message = "[Global Log Filter Usage](https://rundeck.com/project/myproject/job/show/a0296d93-4b10-48d7-8b7d-86ad3f603b85) execution [#12](https://rundeck.com/project/myproject/execution/follow/12) for myproject has started. :running:"

        self.check_webhook(
            "scheduled_start",
            RundeckHookTests.TOPIC_NAME,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/rundeck/view.py
Signals: Django

```python
from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_int, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

RUNDECK_MESSAGE_TEMPLATE = "[{job_name}]({job_link}) execution [#{execution_id}]({execution_link}) for {project_name} {status}. :{emoji}:"
RUNDECK_TOPIC_TEMPLATE = "{job_name}"


@webhook_view("Rundeck")
@typed_endpoint
def api_rundeck_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    topic_name = get_topic(payload)
    body = get_body(payload)

    check_send_webhook_message(request, user_profile, topic_name, body)
    return json_success(request)


def get_topic(payload: WildValue) -> str:
    return RUNDECK_TOPIC_TEMPLATE.format(
        job_name=payload["execution"]["job"]["name"].tame(check_string)
    )


def get_body(payload: WildValue) -> str:
    message_data = {
        "job_name": payload["execution"]["job"]["name"].tame(check_string),
        "job_link": payload["execution"]["job"]["permalink"].tame(check_string),
        "execution_id": payload["execution"]["id"].tame(check_int),
        "execution_link": payload["execution"]["href"].tame(check_string),
        "project_name": payload["execution"]["project"].tame(check_string),
        "status": payload["execution"]["status"].tame(check_string),
    }
    status = payload["execution"]["status"].tame(check_string)

    if status == "failed":
        message_data["status"] = "has failed"
        message_data["emoji"] = "cross_mark"

    if status == "succeeded":
        message_data["status"] = "has succeeded"
        message_data["emoji"] = "check"

    if status == "running":
        if payload["trigger"].tame(check_string) == "avgduration":
            message_data["status"] = "is running long"
            message_data["emoji"] = "time_ticking"
        else:
            message_data["status"] = "has started"
            message_data["emoji"] = "running"

    if status == "scheduled":
        message_data["status"] = "has started"
        message_data["emoji"] = "running"

    return RUNDECK_MESSAGE_TEMPLATE.format(**message_data)
```

--------------------------------------------------------------------------------

---[FILE: duration.json]---
Location: zulip-main/zerver/webhooks/rundeck/fixtures/duration.json
Signals: Next.js

```json
{
  "trigger": "avgduration",
  "status": "running",
  "executionId": 6,
  "execution": {
    "id": 6,
    "href": "http://localhost:4440/project/welcome-project-community/execution/show/6",
    "permalink": null,
    "status": "running",
    "project": "welcome-project-community",
    "executionType": "user",
    "user": "admin",
    "date-started": {
      "unixtime": 1680848069313,
      "date": "2023-04-07T06:14:29Z"
    },
    "job": {
      "id": "a0296d93-4b10-48d7-8b7d-86ad3f603b85",
      "averageDuration": 2408,
      "name": "Global Log Filter Usage",
      "group": "Basic Examples/Basic Workflows",
      "project": "welcome-project-community",
      "description": "Global Log Filter basic example.\r\n\r\nGlobal Log Filter allows you to capture information from the whole job. This example shows how to capture env command data and use it later in the next step as [key-value](https://docs.rundeck.com/docs/manual/log-filters/key-value-data.html#key-value-data) data.\r\n\r\nMore information [here](https://docs.rundeck.com/docs/manual/log-filters/#log-filters).",
      "href": "http://localhost:4440/api/42/job/a0296d93-4b10-48d7-8b7d-86ad3f603b85",
      "permalink": "http://localhost:4440/project/welcome-project-community/job/show/a0296d93-4b10-48d7-8b7d-86ad3f603b85"
    },
    "description": "env ('Using env command we can extract a lot of keys/values :-)') [... 3 steps]",
    "argstring": null,
    "serverUUID": "a14bc3e6-75e8-4fe4-a90d-a16dcc976bf6"
  }
}
```

--------------------------------------------------------------------------------

````
