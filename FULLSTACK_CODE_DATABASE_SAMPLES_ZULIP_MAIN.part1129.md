---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1129
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1129 of 1290)

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

---[FILE: push_without_changes.json]---
Location: zulip-main/zerver/webhooks/bitbucket2/fixtures/push_without_changes.json

```json
{
    "push":{
        "changes":[

        ]
    },
    "actor":{
        "nickname":"Eeshan Garg",
        "type":"user",
        "display_name":"eeshangarg",
        "uuid":"{a161e482-30e8-47ef-b6ab-c4e4cfaa0dce}",
        "links":{
            "self":{
                "href":"https://api.bitbucket.org/2.0/users/eeshangarg"
            },
            "html":{
                "href":"https://bitbucket.org/eeshangarg/"
            },
            "avatar":{
                "href":"https://bitbucket.org/account/eeshangarg/avatar/32/"
            }
        }
    },
    "repository":{
        "scm":"git",
        "website":"",
        "name":"test-repo",
        "links":{
            "self":{
                "href":"https://api.bitbucket.org/2.0/repositories/webhooktest/test-repo"
            },
            "html":{
                "href":"https://bitbucket.org/webhooktest/test-repo"
            },
            "avatar":{
                "href":"https://bitbucket.org/webhooktest/test-repo/avatar/32/"
            }
        },
        "project":{
            "links":{
                "self":{
                    "href":"https://api.bitbucket.org/2.0/teams/webhooktest/projects/TES"
                },
                "html":{
                    "href":"https://bitbucket.org/account/user/webhooktest/projects/TES"
                },
                "avatar":{
                    "href":"https://bitbucket.org/account/user/webhooktest/projects/TES/avatar/32"
                }
            },
            "type":"project",
            "uuid":"{c9b1f7ee-1949-4f6e-ba2b-6333fdbe6bf6}",
            "key":"TES",
            "name":"test-project"
        },
        "full_name":"webhooktest/test-repo",
        "owner":{
            "nickname":"Webhook Test",
            "type":"team",
            "display_name":"webhooktest",
            "uuid":"{31358906-183f-4b53-b83c-f70ba0ca5d3c}",
            "links":{
                "self":{
                    "href":"https://api.bitbucket.org/2.0/teams/webhooktest"
                },
                "html":{
                    "href":"https://bitbucket.org/webhooktest/"
                },
                "avatar":{
                    "href":"https://bitbucket.org/account/webhooktest/avatar/32/"
                }
            }
        },
        "type":"repository",
        "is_private":true,
        "uuid":"{79e5af61-a749-45c5-be24-ba1cba7b662e}"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: remove_branch.json]---
Location: zulip-main/zerver/webhooks/bitbucket2/fixtures/remove_branch.json

```json
{
   "repository":{
      "is_private":true,
      "type":"repository",
      "full_name":"kolaszek/repository-name",
      "name":"Repository name",
      "website":null,
      "scm":"git",
      "owner":{
         "display_name":"Tomasz",
         "links":{
            "avatar":{
               "href":"https://bitbucket.org/account/kolaszek/avatar/32/"
            },
            "self":{
               "href":"https://api.bitbucket.org/2.0/users/kolaszek"
            },
            "html":{
               "href":"https://bitbucket.org/kolaszek/"
            }
         },
         "nickname":"Tomasz Kolaszek",
         "type":"user",
         "uuid":"{678ab31f-9f88-4d7a-b343-1bdf9f024917}"
      },
      "uuid":"{ede265ff-3649-4068-a7da-81ac581b6f47}",
      "links":{
         "avatar":{
            "href":"https://bitbucket.org/kolaszek/repository-name/avatar/32/"
         },
         "self":{
            "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name"
         },
         "html":{
            "href":"https://bitbucket.org/kolaszek/repository-name"
         }
      }
   },
   "push":{
      "changes":[
         {
            "old":{
               "repository":{
                  "type":"repository",
                  "name":"Repository name",
                  "full_name":"kolaszek/repository-name",
                  "links":{
                     "avatar":{
                        "href":"https://bitbucket.org/kolaszek/repository-name/avatar/32/"
                     },
                     "self":{
                        "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name"
                     },
                     "html":{
                        "href":"https://bitbucket.org/kolaszek/repository-name"
                     }
                  },
                  "uuid":"{ede265ff-3649-4068-a7da-81ac581b6f47}"
               },
               "type":"branch",
               "links":{
                  "self":{
                     "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name/refs/branches/master"
                  },
                  "commits":{
                     "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name/commits/master"
                  },
                  "html":{
                     "href":"https://bitbucket.org/kolaszek/repository-name/branch/master"
                  }
               },
               "target":{
                  "author":{
                     "user":{
                        "display_name":"Tomasz",
                        "links":{
                           "avatar":{
                              "href":"https://bitbucket.org/account/kolaszek/avatar/32/"
                           },
                           "self":{
                              "href":"https://api.bitbucket.org/2.0/users/kolaszek"
                           },
                           "html":{
                              "href":"https://bitbucket.org/kolaszek/"
                           }
                        },
                        "nickname":"Tomasz Kolaszek",
                        "type":"user",
                        "uuid":"{678ab31f-9f88-4d7a-b343-1bdf9f024917}"
                     },
                     "raw":"Tomasz Kolek <tomasz-kolek@o2.pl>"
                  },
                  "type":"commit",
                  "links":{
                     "self":{
                        "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name/commit/25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12"
                     },
                     "html":{
                        "href":"https://bitbucket.org/kolaszek/repository-name/commits/25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12"
                     }
                  },
                  "hash":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
                  "parents":[
                     {
                        "type":"commit",
                        "links":{
                           "self":{
                              "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name/commit/f438e1c1b456b7d9ff278991aaca24123e7a591c"
                           },
                           "html":{
                              "href":"https://bitbucket.org/kolaszek/repository-name/commits/f438e1c1b456b7d9ff278991aaca24123e7a591c"
                           }
                        },
                        "hash":"f438e1c1b456b7d9ff278991aaca24123e7a591c"
                     }
                  ],
                  "date":"2016-10-05T19:07:51+00:00",
                  "message":"c\n"
               },
               "name":"master"
            },
            "closed":true,
            "new":null,
            "created":false,
            "forced":false,
            "truncated":false
         }
      ]
   },
   "actor":{
      "display_name":"Tomasz",
      "links":{
         "avatar":{
            "href":"https://bitbucket.org/account/kolaszek/avatar/32/"
         },
         "self":{
            "href":"https://api.bitbucket.org/2.0/users/kolaszek"
         },
         "html":{
            "href":"https://bitbucket.org/kolaszek/"
         }
      },
      "nickname":"Tomasz Kolaszek",
      "type":"user",
      "uuid":"{678ab31f-9f88-4d7a-b343-1bdf9f024917}"
   }
}
```

--------------------------------------------------------------------------------

---[FILE: repo_updated.json]---
Location: zulip-main/zerver/webhooks/bitbucket2/fixtures/repo_updated.json

```json
{
    "changes":{
        "website":{
            "new":"http://zulipchat.com",
            "old":""
        },
        "name":{
            "new":"new-name",
            "old":"test-repo"
        },
        "links":{
            "new":{

            },
            "old":{

            }
        },
        "language":{
            "new":"python",
            "old":""
        },
        "full_name":{
            "new":"webhooktest/new-name",
            "old":"webhooktest/test-repo"
        },
        "slug":{
            "new":"new-name",
            "old":"test-repo"
        },
        "description":{
            "new":"Random description.",
            "old":""
        }
    },
    "actor":{
        "nickname":"Eeshan Garg",
        "type":"user",
        "display_name":"eeshangarg",
        "uuid":"{a161e482-30e8-47ef-b6ab-c4e4cfaa0dce}",
        "links":{
            "self":{
                "href":"https://api.bitbucket.org/2.0/users/eeshangarg"
            },
            "html":{
                "href":"https://bitbucket.org/eeshangarg/"
            },
            "avatar":{
                "href":"https://bitbucket.org/account/eeshangarg/avatar/32/"
            }
        }
    },
    "repository":{
        "scm":"git",
        "website":"http://zulipchat.com",
        "name":"new-name",
        "links":{
            "self":{
                "href":"https://api.bitbucket.org/2.0/repositories/webhooktest/new-name"
            },
            "html":{
                "href":"https://bitbucket.org/webhooktest/new-name"
            },
            "avatar":{
                "href":"https://bitbucket.org/webhooktest/new-name/avatar/32/"
            }
        },
        "project":{
            "links":{
                "self":{
                    "href":"https://api.bitbucket.org/2.0/teams/webhooktest/projects/TES"
                },
                "html":{
                    "href":"https://bitbucket.org/account/user/webhooktest/projects/TES"
                },
                "avatar":{
                    "href":"https://bitbucket.org/account/user/webhooktest/projects/TES/avatar/32"
                }
            },
            "type":"project",
            "uuid":"{c9b1f7ee-1949-4f6e-ba2b-6333fdbe6bf6}",
            "key":"TES",
            "name":"test-project"
        },
        "full_name":"webhooktest/new-name",
        "owner":{
            "nickname":"Webhook Test",
            "type":"team",
            "display_name":"webhooktest",
            "uuid":"{31358906-183f-4b53-b83c-f70ba0ca5d3c}",
            "links":{
                "self":{
                    "href":"https://api.bitbucket.org/2.0/teams/webhooktest"
                },
                "html":{
                    "href":"https://bitbucket.org/webhooktest/"
                },
                "avatar":{
                    "href":"https://bitbucket.org/account/webhooktest/avatar/32/"
                }
            }
        },
        "type":"repository",
        "is_private":true,
        "uuid":"{79e5af61-a749-45c5-be24-ba1cba7b662e}"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/bitbucket3/doc.md

```text
# Zulip Bitbucket Server integration

Zulip supports both Git and Mercurial notifications from
Bitbucket. This integration is for the new-style Bitbucket
webhooks used by Bitbucket Server.

For the old-style Bitbucket webhooks used by Bitbucket Enterprise,
click [here](./bitbucket), and for the new-style webhooks used by
Bitbucket Cloud (SAAS service) click [here](./bitbucket2).

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-with-branch-filtering.md!}

1. On your repository's web page, go to **Settings**. Select
   **Webhooks**, and then click **Add webhook**.

1. Set **Title** to a title of your choice, such as `Zulip`. Set **URL**
   to the URL generated above, and toggle the **Active** checkbox.
   Select the **Triggers** you'd like to be notified about, and click
   **Save**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/bitbucket/004.png)

{!event-filtering-additional-feature.md!}

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/bitbucket3/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase

TOPIC = "sandbox"
TOPIC_BRANCH_EVENTS = "sandbox / {branch}"


class Bitbucket3HookTests(WebhookTestCase):
    CHANNEL_NAME = "bitbucket3"
    URL_TEMPLATE = "/api/v1/external/bitbucket3?stream={stream}&api_key={api_key}"
    WEBHOOK_DIR_NAME = "bitbucket3"

    # Diagnostics events:
    def test_ping(self) -> None:
        expected_message = (
            "Congratulations! The Bitbucket Server webhook was configured successfully!"
        )
        self.check_webhook("diagnostics_ping", "Bitbucket Server Ping", expected_message)

    def test_ping_with_user_defined_topic(self) -> None:
        self.url = self.build_webhook_url(topic="my topic")
        expected_message = (
            "Congratulations! The Bitbucket Server webhook was configured successfully!"
        )
        self.check_webhook("diagnostics_ping", "my topic", expected_message)

    # Core repo events:
    def test_commit_comment_added(self) -> None:
        expected_message = """[hypro999](http://139.59.64.214:7990/users/hypro999) commented on [508d1b67f1f](http://139.59.64.214:7990/projects/SBOX/repos/sandbox/commits/508d1b67f1f8f3a25f543a030a7a178894aa9907):\n~~~ quote\nJust an arbitrary comment on a commit.\n~~~"""
        self.check_webhook("commit_comment_added", TOPIC, expected_message)

    def test_commit_comment_edited(self) -> None:
        expected_message = """[hypro999](http://139.59.64.214:7990/users/hypro999) edited their comment on [508d1b67f1f](http://139.59.64.214:7990/projects/SBOX/repos/sandbox/commits/508d1b67f1f8f3a25f543a030a7a178894aa9907):\n~~~ quote\nJust an arbitrary comment on a commit. Nothing to see here...\n~~~"""
        self.check_webhook("commit_comment_edited", TOPIC, expected_message)

    def test_commit_comment_deleted(self) -> None:
        expected_message = """[hypro999](http://139.59.64.214:7990/users/hypro999) deleted their comment on [508d1b67f1f](http://139.59.64.214:7990/projects/SBOX/repos/sandbox/commits/508d1b67f1f8f3a25f543a030a7a178894aa9907):\n~~~ quote\n~~Just an arbitrary comment on a commit. Nothing to see here...~~\n~~~"""
        self.check_webhook("commit_comment_deleted", TOPIC, expected_message)

    def test_bitbucket3_repo_forked(self) -> None:
        expected_message = """User Hemanth V. Alluri(login: [hypro999](http://139.59.64.214:7990/users/hypro999)) forked the repository into [sandbox fork](http://139.59.64.214:7990/users/hypro999/repos/sandbox-fork/browse)."""
        self.check_webhook("repo_forked", TOPIC, expected_message)

    def test_bitbucket3_repo_modified(self) -> None:
        expected_message = """[hypro999](http://139.59.64.214:7990/users/hypro999) changed the name of the **sandbox** repo from **sandbox** to **sandbox v2**."""
        expected_topic_name = "sandbox v2"
        self.check_webhook("repo_modified", expected_topic_name, expected_message)

    # Repo push events:
    def test_push_add_branch(self) -> None:
        expected_message = (
            """[hypro999](http://139.59.64.214:7990/users/hypro999) created branch2 branch."""
        )
        expected_topic_name = TOPIC_BRANCH_EVENTS.format(branch="branch2")
        self.check_webhook("repo_push_add_branch", expected_topic_name, expected_message)

    def test_push_add_tag(self) -> None:
        expected_message = (
            """[hypro999](http://139.59.64.214:7990/users/hypro999) pushed tag newtag."""
        )
        self.check_webhook("repo_push_add_tag", TOPIC, expected_message)

    def test_push_delete_branch(self) -> None:
        expected_message = (
            """[hypro999](http://139.59.64.214:7990/users/hypro999) deleted branch branch2."""
        )
        expected_topic_name = TOPIC_BRANCH_EVENTS.format(branch="branch2")
        self.check_webhook("repo_push_delete_branch", expected_topic_name, expected_message)

    def test_push_delete_tag(self) -> None:
        expected_message = (
            """[hypro999](http://139.59.64.214:7990/users/hypro999) removed tag test-tag."""
        )
        self.check_webhook("repo_push_delete_tag", TOPIC, expected_message)

    def test_push_update_single_branch(self) -> None:
        expected_message = """[hypro999](http://139.59.64.214:7990/users/hypro999) pushed to branch master. Head is now e68c981ef53dbab0a5ca320a2d8d80e216c70528."""
        expected_topic_name = TOPIC_BRANCH_EVENTS.format(branch="master")
        self.check_webhook("repo_push_update_single_branch", expected_topic_name, expected_message)

    def test_push_update_multiple_branches(self) -> None:
        branch1_content = """[hypro999](http://139.59.64.214:7990/users/hypro999) pushed to branch branch1. Head is now 3980c2be32a7e23c795741d5dc1a2eecb9b85d6d."""
        master_content = """[hypro999](http://139.59.64.214:7990/users/hypro999) pushed to branch master. Head is now fc43d13cff1abb28631196944ba4fc4ad06a2cf2."""

        self.subscribe(self.test_user, self.CHANNEL_NAME)
        payload = self.get_body("repo_push_update_multiple_branches")

        msg = self.send_webhook_payload(
            self.test_user,
            self.url,
            payload,
            content_type="application/json",
        )

        msg = self.get_second_to_last_message()
        self.assert_channel_message(
            message=msg,
            channel_name=self.CHANNEL_NAME,
            topic_name=TOPIC_BRANCH_EVENTS.format(branch="branch1"),
            content=branch1_content,
        )

        msg = self.get_last_message()
        self.assert_channel_message(
            message=msg,
            channel_name=self.CHANNEL_NAME,
            topic_name=TOPIC_BRANCH_EVENTS.format(branch="master"),
            content=master_content,
        )

    def test_push_update_multiple_branches_with_branch_filter(self) -> None:
        self.url = self.build_webhook_url(branches="master")
        expected_message = """[hypro999](http://139.59.64.214:7990/users/hypro999) pushed to branch master. Head is now fc43d13cff1abb28631196944ba4fc4ad06a2cf2."""
        expected_topic_name = TOPIC_BRANCH_EVENTS.format(branch="master")
        self.check_webhook(
            "repo_push_update_multiple_branches", expected_topic_name, expected_message
        )

        self.url = self.build_webhook_url(branches="branch1")
        expected_message = """[hypro999](http://139.59.64.214:7990/users/hypro999) pushed to branch branch1. Head is now 3980c2be32a7e23c795741d5dc1a2eecb9b85d6d."""
        expected_topic_name = TOPIC_BRANCH_EVENTS.format(branch="branch1")
        self.check_webhook(
            "repo_push_update_multiple_branches", expected_topic_name, expected_message
        )

    # Core PR events:
    def test_pr_opened_without_reviewers(self) -> None:
        expected_topic_name = "sandbox / PR #1 Branch1"
        expected_message = """[hypro999](http://139.59.64.214:7990/users/hypro999) opened [PR #1](http://139.59.64.214:7990/projects/SBOX/repos/sandbox/pull-requests/1) from `branch1` to `master`:\n\n~~~ quote\n* Add file2.txt\r\n* Add file3.txt\n~~~"""
        self.check_webhook(
            "pull_request_opened_without_reviewers", expected_topic_name, expected_message
        )

    def test_pr_opened_without_description(self) -> None:
        expected_topic_name = "sandbox / PR #2 Add notes feature."
        expected_message = """[hypro999](http://139.59.64.214:7990/users/hypro999) opened [PR #2](http://139.59.64.214:7990/projects/SBOX/repos/sandbox/pull-requests/2) from `master` to `master`."""
        self.check_webhook(
            "pull_request_opened_without_description", expected_topic_name, expected_message
        )

    def test_pr_opened_with_two_reviewers(self) -> None:
        expected_topic_name = "sandbox / PR #5 Add Notes Feature"
        expected_message = """[hypro999](http://139.59.64.214:7990/users/hypro999) opened [PR #5](http://139.59.64.214:7990/projects/SBOX/repos/sandbox/pull-requests/5) from `master` to `master` (assigned reviewers: [shimura](http://139.59.64.214:7990/users/shimura) and [sougo](http://139.59.64.214:7990/users/sougo))."""
        self.check_webhook(
            "pull_request_opened_with_two_reviewers", expected_topic_name, expected_message
        )

    def test_pr_opened_with_two_reviewers_and_user_defined_topic(self) -> None:
        expected_topic_name = "sandbox / PR #5 Add Notes Feature"
        expected_topic_name = "custom_topic"
        self.url = self.build_webhook_url(topic="custom_topic")
        expected_message = """[hypro999](http://139.59.64.214:7990/users/hypro999) opened [PR #5 Add Notes Feature](http://139.59.64.214:7990/projects/SBOX/repos/sandbox/pull-requests/5) from `master` to `master` (assigned reviewers: [shimura](http://139.59.64.214:7990/users/shimura) and [sougo](http://139.59.64.214:7990/users/sougo))."""
        self.check_webhook(
            "pull_request_opened_with_two_reviewers", expected_topic_name, expected_message
        )

    def test_pr_opened_with_multiple_reviewers(self) -> None:
        expected_topic_name = "sandbox / PR #6 sample_file: Add sample_file.txt."
        expected_message = """[hypro999](http://139.59.64.214:7990/users/hypro999) opened [PR #6](http://139.59.64.214:7990/projects/SBOX/repos/sandbox/pull-requests/6) from `master` to `master` (assigned reviewers: [sougo](http://139.59.64.214:7990/users/sougo), [zura](http://139.59.64.214:7990/users/zura) and [shimura](http://139.59.64.214:7990/users/shimura)):\n\n~~~ quote\nAdd a simple text file for further testing purposes.\n~~~"""
        self.check_webhook(
            "pull_request_opened_with_multiple_reviewers", expected_topic_name, expected_message
        )

    def test_pr_modified(self) -> None:
        expected_topic_name = "sandbox / PR #1 Branch1"
        expected_message = """[hypro999](http://139.59.64.214:7990/users/hypro999) modified [PR #1](http://139.59.64.214:7990/projects/SBOX/repos/sandbox/pull-requests/1) (assigned reviewers: [shimura](http://139.59.64.214:7990/users/shimura)):\n\n~~~ quote\n* Add file2.txt\n* Add file3.txt\nBoth of these files would be important additions to the project!\n~~~"""
        self.check_webhook("pull_request_modified", expected_topic_name, expected_message)

    def test_pr_modified_with_include_title(self) -> None:
        expected_topic_name = "custom_topic"
        expected_message = """[hypro999](http://139.59.64.214:7990/users/hypro999) modified [PR #1 Branch1](http://139.59.64.214:7990/projects/SBOX/repos/sandbox/pull-requests/1) (assigned reviewers: [shimura](http://139.59.64.214:7990/users/shimura)):\n\n~~~ quote\n* Add file2.txt\n* Add file3.txt\nBoth of these files would be important additions to the project!\n~~~"""
        self.url = self.build_webhook_url(topic="custom_topic")
        self.check_webhook("pull_request_modified", expected_topic_name, expected_message)

    def test_pr_deleted(self) -> None:
        expected_topic_name = "sandbox / PR #2 Add notes feature."
        expected_message = """[hypro999](http://139.59.64.214:7990/users/hypro999) deleted [PR #2](http://139.59.64.214:7990/projects/SBOX/repos/sandbox/pull-requests/2)."""
        self.check_webhook("pull_request_deleted", expected_topic_name, expected_message)

    def test_pr_deleted_with_include_title(self) -> None:
        expected_topic_name = "custom_topic"
        expected_message = """[hypro999](http://139.59.64.214:7990/users/hypro999) deleted [PR #2 Add notes feature.](http://139.59.64.214:7990/projects/SBOX/repos/sandbox/pull-requests/2)"""
        self.url = self.build_webhook_url(topic="custom_topic")
        self.check_webhook("pull_request_deleted", expected_topic_name, expected_message)

    def test_pr_declined(self) -> None:
        expected_topic_name = "sandbox / PR #7 Crazy Idea"
        expected_message = """[zura](http://139.59.64.214:7990/users/zura) declined [PR #7](http://139.59.64.214:7990/projects/SBOX/repos/sandbox/pull-requests/7)."""
        self.check_webhook("pull_request_declined", expected_topic_name, expected_message)

    def test_pr_merged(self) -> None:
        expected_topic_name = "sandbox / PR #6 sample_file: Add sample_file.txt."
        expected_message = """[zura](http://139.59.64.214:7990/users/zura) merged [PR #6](http://139.59.64.214:7990/projects/SBOX/repos/sandbox/pull-requests/6) from `master` to `master`."""
        self.check_webhook("pull_request_merged", expected_topic_name, expected_message)

    # PR reviewer events:
    def test_pr_approved(self) -> None:
        expected_topic_name = "sandbox / PR #6 sample_file: Add sample_file.txt."
        expected_message = """[zura](http://139.59.64.214:7990/users/zura) approved [PR #6](http://139.59.64.214:7990/projects/SBOX/repos/sandbox/pull-requests/6)."""
        self.check_webhook("pull_request_approved", expected_topic_name, expected_message)

    def test_pr_unapproved(self) -> None:
        expected_topic_name = "sandbox / PR #6 sample_file: Add sample_file.txt."
        expected_message = """[zura](http://139.59.64.214:7990/users/zura) unapproved [PR #6](http://139.59.64.214:7990/projects/SBOX/repos/sandbox/pull-requests/6)."""
        self.check_webhook("pull_request_unapproved", expected_topic_name, expected_message)

    def test_pr_marked_as_needs_review(self) -> None:
        expected_topic_name = "sandbox / PR #6 sample_file: Add sample_file.txt."
        expected_message = """[zura](http://139.59.64.214:7990/users/zura) marked [PR #6](http://139.59.64.214:7990/projects/SBOX/repos/sandbox/pull-requests/6) as \"needs work\"."""
        self.check_webhook("pull_request_needs_work", expected_topic_name, expected_message)

    def test_pr_marked_as_needs_review_and_include_title(self) -> None:
        expected_topic_name = "custom_topic"
        expected_message = """[zura](http://139.59.64.214:7990/users/zura) marked [PR #6 sample_file: Add sample_file.txt.](http://139.59.64.214:7990/projects/SBOX/repos/sandbox/pull-requests/6) as \"needs work\"."""
        self.url = self.build_webhook_url(topic="custom_topic")
        self.check_webhook("pull_request_needs_work", expected_topic_name, expected_message)

    def test_pull_request_reviewer_added(self) -> None:
        expected_message = """[hypro999](http://139.59.64.214:7990/users/hypro999) reassigned [PR #1](http://139.59.64.214:7990/projects/SBOX/repos/sandbox/pull-requests/1) to [shimura](http://139.59.64.214:7990/users/shimura)."""
        expected_topic_name = "sandbox / PR #1 Branch1"
        self.check_webhook("pull_request_add_reviewer", expected_topic_name, expected_message)

    def test_pull_request_reviewer_added_and_include_title(self) -> None:
        expected_message = """[hypro999](http://139.59.64.214:7990/users/hypro999) reassigned [PR #1 Branch1](http://139.59.64.214:7990/projects/SBOX/repos/sandbox/pull-requests/1) to [shimura](http://139.59.64.214:7990/users/shimura)."""
        expected_topic_name = "custom_topic"
        self.url = self.build_webhook_url(topic="custom_topic")
        self.check_webhook("pull_request_add_reviewer", expected_topic_name, expected_message)

    def test_pull_request_reviewers_added(self) -> None:
        expected_message = """[hypro999](http://139.59.64.214:7990/users/hypro999) reassigned [PR #1](http://139.59.64.214:7990/projects/SBOX/repos/sandbox/pull-requests/1) to [shimura](http://139.59.64.214:7990/users/shimura) and [sougo](http://139.59.64.214:7990/users/sougo)."""
        expected_topic_name = "sandbox / PR #1 Branch1"
        self.check_webhook("pull_request_add_two_reviewers", expected_topic_name, expected_message)

    def test_pull_request_remove_all_reviewers(self) -> None:
        expected_message = """[hypro999](http://139.59.64.214:7990/users/hypro999) removed all reviewers from [PR #1](http://139.59.64.214:7990/projects/SBOX/repos/sandbox/pull-requests/1)."""
        expected_topic_name = "sandbox / PR #1 Branch1"
        self.check_webhook("pull_request_remove_reviewer", expected_topic_name, expected_message)

    def test_pull_request_remove_all_reviewers_with_title(self) -> None:
        expected_message = """[hypro999](http://139.59.64.214:7990/users/hypro999) removed all reviewers from [PR #1 Branch1](http://139.59.64.214:7990/projects/SBOX/repos/sandbox/pull-requests/1)."""
        expected_topic_name = "sandbox / PR #1 Branch1"
        expected_topic_name = "custom_topic"
        self.url = self.build_webhook_url(topic="custom_topic")
        self.check_webhook("pull_request_remove_reviewer", expected_topic_name, expected_message)

    # PR comment events:
    def test_pull_request_comment_added(self) -> None:
        expected_message = """[zura](http://139.59.64.214:7990/users/zura) commented on [PR #6](http://139.59.64.214:7990/projects/SBOX/repos/sandbox/pull-requests/6):\n\n~~~ quote\nThis seems like a pretty good idea.\n~~~"""
        expected_topic_name = "sandbox / PR #6 sample_file: Add sample_file.txt."
        self.check_webhook("pull_request_comment_added", expected_topic_name, expected_message)

    def test_pull_request_comment_edited(self) -> None:
        expected_message = """[zura](http://139.59.64.214:7990/users/zura) edited their comment on [PR #6](http://139.59.64.214:7990/projects/SBOX/repos/sandbox/pull-requests/6):\n\n~~~ quote\nThis seems like a pretty good idea. @shimura what do you think?\n~~~"""
        expected_topic_name = "sandbox / PR #6 sample_file: Add sample_file.txt."
        self.check_webhook("pull_request_comment_edited", expected_topic_name, expected_message)

    def test_pull_request_comment_deleted(self) -> None:
        expected_message = """[zura](http://139.59.64.214:7990/users/zura) deleted their comment on [PR #6](http://139.59.64.214:7990/projects/SBOX/repos/sandbox/pull-requests/6):\n\n~~~ quote\n~~This seems like a pretty good idea. @shimura what do you think?~~\n~~~"""
        expected_topic_name = "sandbox / PR #6 sample_file: Add sample_file.txt."
        self.check_webhook("pull_request_comment_deleted", expected_topic_name, expected_message)
```

--------------------------------------------------------------------------------

````
