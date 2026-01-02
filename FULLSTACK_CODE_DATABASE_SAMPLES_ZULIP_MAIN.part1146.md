---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1146
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1146 of 1290)

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

---[FILE: outbound_message.json]---
Location: zulip-main/zerver/webhooks/front/fixtures/outbound_message.json
Signals: Next.js, Express

```json
{
  "_links": {
    "self": "https://api2.frontapp.com/events/evt_28du6wi"
  },
  "id": "evt_28du6wi",
  "type": "outbound",
  "emitted_at": 1518307909.541,
  "conversation": {
    "_links": {
      "self": "https://api2.frontapp.com/conversations/cnv_keo696",
      "related": {
        "events": "https://api2.frontapp.com/conversations/cnv_keo696/events",
        "followers": "https://api2.frontapp.com/conversations/cnv_keo696/followers",
        "messages": "https://api2.frontapp.com/conversations/cnv_keo696/messages",
        "comments": "https://api2.frontapp.com/conversations/cnv_keo696/comments",
        "inboxes": "https://api2.frontapp.com/conversations/cnv_keo696/inboxes"
      }
    },
    "id": "cnv_keo696",
    "subject": "Your next delivery is on Epsilon 96Z",
    "status": "assigned",
    "assignee": {
      "_links": {
        "self": "https://api2.frontapp.com/teammates/tea_40yq",
        "related": {
          "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
          "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
        }
      },
      "id": "tea_40yq",
      "email": "leela@planet-express.com",
      "username": "leela",
      "first_name": "Leela",
      "last_name": "Turanga",
      "is_admin": true,
      "is_available": true
    },
    "recipient": {
      "_links": {
        "related": {
          "contact": "https://api2.frontapp.com/contacts/crd_62euuy"
        }
      },
      "handle": "calculon@momsbot.com",
      "role": "to"
    },
    "tags": [],
    "last_message": {
      "_links": {
        "self": "https://api2.frontapp.com/messages/msg_1176ie2",
        "related": {
          "conversation": "https://api2.frontapp.com/conversations/cnv_keo696"
        }
      },
      "id": "msg_1176ie2",
      "type": "email",
      "is_inbound": false,
      "created_at": 1518307909.541,
      "blurb": "There will be plenty of time to discuss your objections when and if you return. ",
      "body": "<div>There will be plenty of time to discuss your objections when and if you return.</div>",
      "text": "There will be plenty of time to discuss your objections when and if you return.\n",
      "metadata": {},
      "author": {
        "_links": {
          "self": "https://api2.frontapp.com/teammates/tea_40yq",
          "related": {
            "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
            "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
          }
        },
        "id": "tea_40yq",
        "email": "leela@planet-express.com",
        "username": "leela",
        "first_name": "Leela",
        "last_name": "Turanga",
        "is_admin": true,
        "is_available": true
      },
      "recipients": [
        {
          "_links": {
            "related": {
              "contact": null
            }
          },
          "handle": "support@planet-express.com",
          "role": "from"
        },
        {
          "_links": {
            "related": {
              "contact": "https://api2.frontapp.com/contacts/crd_62euuy"
            }
          },
          "handle": "calculon@momsbot.com",
          "role": "to"
        }
      ],
      "attachments": []
    },
    "created_at": 1518307874.673
  },
  "source": {
    "_meta": {
      "type": "inboxes"
    },
    "data": [
      {
        "_links": {
          "self": "https://api2.frontapp.com/inboxes/inb_6j96",
          "related": {
            "channels": "https://api2.frontapp.com/inboxes/inb_6j96/channels",
            "conversations": "https://api2.frontapp.com/inboxes/inb_6j96/conversations",
            "teammates": "https://api2.frontapp.com/inboxes/inb_6j96/teammates"
          }
        },
        "id": "inb_6j96",
        "address": "support@planet-express.com",
        "send_as": "support@planet-express.com",
        "name": "Support@",
        "type": "gmail"
      }
    ]
  },
  "target": {
    "_meta": {
      "type": "message"
    },
    "data": {
      "_links": {
        "self": "https://api2.frontapp.com/messages/msg_1176ie2",
        "related": {
          "conversation": "https://api2.frontapp.com/conversations/cnv_keo696"
        }
      },
      "id": "msg_1176ie2",
      "type": "email",
      "is_inbound": false,
      "created_at": 1518307909.541,
      "blurb": "There will be plenty of time to discuss your objections when and if you return. ",
      "body": "<div>There will be plenty of time to discuss your objections when and if you return.</div>",
      "text": "There will be plenty of time to discuss your objections when and if you return.\n",
      "metadata": {},
      "author": {
        "_links": {
          "self": "https://api2.frontapp.com/teammates/tea_40yq",
          "related": {
            "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
            "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
          }
        },
        "id": "tea_40yq",
        "email": "leela@planet-express.com",
        "username": "leela",
        "first_name": "Leela",
        "last_name": "Turanga",
        "is_admin": true,
        "is_available": true
      },
      "recipients": [
        {
          "_links": {
            "related": {
              "contact": null
            }
          },
          "handle": "support@planet-express.com",
          "role": "from"
        },
        {
          "_links": {
            "related": {
              "contact": "https://api2.frontapp.com/contacts/crd_62euuy"
            }
          },
          "handle": "calculon@momsbot.com",
          "role": "to"
        }
      ],
      "attachments": []
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: outbound_reply.json]---
Location: zulip-main/zerver/webhooks/front/fixtures/outbound_reply.json
Signals: Express

```json
{
  "_links": {
    "self": "https://api2.frontapp.com/events/evt_28duq42"
  },
  "id": "evt_28duq42",
  "type": "out_reply",
  "emitted_at": 1518309342.896,
  "conversation": {
    "_links": {
      "self": "https://api2.frontapp.com/conversations/cnv_keocka",
      "related": {
        "events": "https://api2.frontapp.com/conversations/cnv_keocka/events",
        "followers": "https://api2.frontapp.com/conversations/cnv_keocka/followers",
        "messages": "https://api2.frontapp.com/conversations/cnv_keocka/messages",
        "comments": "https://api2.frontapp.com/conversations/cnv_keocka/comments",
        "inboxes": "https://api2.frontapp.com/conversations/cnv_keocka/inboxes"
      }
    },
    "id": "cnv_keocka",
    "subject": "Re: Being a robot is great, but...",
    "status": "assigned",
    "assignee": {
      "_links": {
        "self": "https://api2.frontapp.com/teammates/tea_40yq",
        "related": {
          "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
          "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
        }
      },
      "id": "tea_40yq",
      "email": "leela@planet-express.com",
      "username": "leela",
      "first_name": "Leela",
      "last_name": "Turanga",
      "is_admin": true,
      "is_available": true
    },
    "recipient": {
      "_links": {
        "related": {
          "contact": "https://api2.frontapp.com/contacts/crd_62euuy"
        }
      },
      "handle": "calculon@momsbot.com",
      "role": "to"
    },
    "tags": [
      {
        "_links": {
          "self": "https://api2.frontapp.com/tags/tag_11dg2",
          "related": {
            "conversations": "https://api2.frontapp.com/tags/tag_11dg2/conversations"
          }
        },
        "id": "tag_11dg2",
        "name": "Urgent"
      }
    ],
    "last_message": {
      "_links": {
        "self": "https://api2.frontapp.com/messages/msg_1176ryy",
        "related": {
          "conversation": "https://api2.frontapp.com/conversations/cnv_keocka",
          "message_replied_to": "https://api2.frontapp.com/messages/msg_1176r8y"
        }
      },
      "id": "msg_1176ryy",
      "type": "email",
      "is_inbound": false,
      "created_at": 1518309342.896,
      "blurb": "Emotions are dumb and should be hated. ",
      "body": "<div>Emotions are dumb and should be hated.</div>",
      "text": "Emotions are dumb and should be hated.\n",
      "metadata": {},
      "author": {
        "_links": {
          "self": "https://api2.frontapp.com/teammates/tea_40yq",
          "related": {
            "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
            "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
          }
        },
        "id": "tea_40yq",
        "email": "leela@planet-express.com",
        "username": "leela",
        "first_name": "Leela",
        "last_name": "Turanga",
        "is_admin": true,
        "is_available": true
      },
      "recipients": [
        {
          "_links": {
            "related": {
              "contact": null
            }
          },
          "handle": "support@planet-express.com",
          "role": "from"
        },
        {
          "_links": {
            "related": {
              "contact": "https://api2.frontapp.com/contacts/crd_62euuy"
            }
          },
          "handle": "calculon@momsbot.com",
          "role": "to"
        }
      ],
      "attachments": []
    },
    "created_at": 1518309203.872
  },
  "source": {
    "_meta": {
      "type": "inboxes"
    },
    "data": [
      {
        "_links": {
          "self": "https://api2.frontapp.com/inboxes/inb_6j96",
          "related": {
            "channels": "https://api2.frontapp.com/inboxes/inb_6j96/channels",
            "conversations": "https://api2.frontapp.com/inboxes/inb_6j96/conversations",
            "teammates": "https://api2.frontapp.com/inboxes/inb_6j96/teammates"
          }
        },
        "id": "inb_6j96",
        "address": "support@planet-express.com",
        "send_as": "support@planet-express.com",
        "name": "Support@",
        "type": "gmail"
      }
    ]
  },
  "target": {
    "_meta": {
      "type": "message"
    },
    "data": {
      "_links": {
        "self": "https://api2.frontapp.com/messages/msg_1176ryy",
        "related": {
          "conversation": "https://api2.frontapp.com/conversations/cnv_keocka",
          "message_replied_to": "https://api2.frontapp.com/messages/msg_1176r8y"
        }
      },
      "id": "msg_1176ryy",
      "type": "email",
      "is_inbound": false,
      "created_at": 1518309342.896,
      "blurb": "Emotions are dumb and should be hated. ",
      "body": "<div>Emotions are dumb and should be hated.</div>",
      "text": "Emotions are dumb and should be hated.\n",
      "metadata": {},
      "author": {
        "_links": {
          "self": "https://api2.frontapp.com/teammates/tea_40yq",
          "related": {
            "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
            "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
          }
        },
        "id": "tea_40yq",
        "email": "leela@planet-express.com",
        "username": "leela",
        "first_name": "Leela",
        "last_name": "Turanga",
        "is_admin": true,
        "is_available": true
      },
      "recipients": [
        {
          "_links": {
            "related": {
              "contact": null
            }
          },
          "handle": "support@planet-express.com",
          "role": "from"
        },
        {
          "_links": {
            "related": {
              "contact": "https://api2.frontapp.com/contacts/crd_62euuy"
            }
          },
          "handle": "calculon@momsbot.com",
          "role": "to"
        }
      ],
      "attachments": []
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: rule.json]---
Location: zulip-main/zerver/webhooks/front/fixtures/rule.json
Signals: Express

```json
{
  "_links": {
    "self": "https://api2.frontapp.com/events/evt_28duxju"
  },
  "id": "evt_28duxju",
  "type": "assign",
  "emitted_at": 1518309907.474,
  "conversation": {
    "_links": {
      "self": "https://api2.frontapp.com/conversations/cnv_keocka",
      "related": {
        "events": "https://api2.frontapp.com/conversations/cnv_keocka/events",
        "followers": "https://api2.frontapp.com/conversations/cnv_keocka/followers",
        "messages": "https://api2.frontapp.com/conversations/cnv_keocka/messages",
        "comments": "https://api2.frontapp.com/conversations/cnv_keocka/comments",
        "inboxes": "https://api2.frontapp.com/conversations/cnv_keocka/inboxes"
      }
    },
    "id": "cnv_keocka",
    "subject": "Re: Being a robot is great, but...",
    "status": "assigned",
    "assignee": {
      "_links": {
        "self": "https://api2.frontapp.com/teammates/tea_40z6",
        "related": {
          "inboxes": "https://api2.frontapp.com/teammates/tea_40z6/inboxes",
          "conversations": "https://api2.frontapp.com/teammates/tea_40z6/conversations"
        }
      },
      "id": "tea_40z6",
      "email": "bender@planet-express.com",
      "username": "bender",
      "first_name": "Bender",
      "last_name": "Rodriguez",
      "is_admin": false,
      "is_available": true
    },
    "recipient": {
      "_links": {
        "related": {
          "contact": "https://api2.frontapp.com/contacts/crd_62euuy"
        }
      },
      "handle": "calculon@momsbot.com",
      "role": "to"
    },
    "tags": [],
    "last_message": {
      "_links": {
        "self": "https://api2.frontapp.com/messages/msg_1176ryy",
        "related": {
          "conversation": "https://api2.frontapp.com/conversations/cnv_keocka",
          "message_replied_to": "https://api2.frontapp.com/messages/msg_1176r8y"
        }
      },
      "id": "msg_1176ryy",
      "type": "email",
      "is_inbound": false,
      "created_at": 1518309342.896,
      "blurb": "Emotions are dumb and should be hated. ",
      "body": "<div>Emotions are dumb and should be hated.</div>",
      "text": "Emotions are dumb and should be hated.\n",
      "metadata": {},
      "author": {
        "_links": {
          "self": "https://api2.frontapp.com/teammates/tea_40yq",
          "related": {
            "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
            "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
          }
        },
        "id": "tea_40yq",
        "email": "leela@planet-express.com",
        "username": "leela",
        "first_name": "Leela",
        "last_name": "Turanga",
        "is_admin": true,
        "is_available": true
      },
      "recipients": [
        {
          "_links": {
            "related": {
              "contact": null
            }
          },
          "handle": "support@planet-express.com",
          "role": "from"
        },
        {
          "_links": {
            "related": {
              "contact": "https://api2.frontapp.com/contacts/crd_62euuy"
            }
          },
          "handle": "calculon@momsbot.com",
          "role": "to"
        }
      ],
      "attachments": []
    },
    "created_at": 1518309203.872
  },
  "source": {
    "_meta": {
      "type": "rule"
    },
    "data": {
      "_links": {
        "self": "https://api2.frontapp.com/rules/rul_55c8c149",
        "related": {
          "owner": "https://api2.frontapp.com/teams/tim_55c8c149"
        }
        },
        "id": "rul_55c8c149",
        "name": "Important deliveries",
        "actions": [
          "Assign to Bender Rodriguez"
        ],
      "is_private": false
    }
  },
  "target": {
    "_meta": {
      "type": "teammate"
    },
    "data": {
      "_links": {
        "self": "https://api2.frontapp.com/teammates/tea_40z6",
        "related": {
          "inboxes": "https://api2.frontapp.com/teammates/tea_40z6/inboxes",
          "conversations": "https://api2.frontapp.com/teammates/tea_40z6/conversations"
        }
      },
      "id": "tea_40z6",
      "email": "bender@planet-express.com",
      "username": "bender",
      "first_name": "Bender",
      "last_name": "Rodriguez",
      "is_admin": false,
      "is_available": true
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/gitea/doc.md

```text
# Zulip Gitea integration

Receive Gitea notifications in Zulip!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-with-branch-filtering.md!}

1. Go to your repository on Gitea and click on **Settings**. Select
   **Webhooks** on the left sidebar, and click **Add Webhook**.
   Select **Gitea**.

1. Set **Payload URL** to the URL generated above. Set **Content type**
   to `application/json`. Select the [events](#filtering-incoming-events)
   you would like to receive notifications for, and click **Add Webhook**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/gitea/001.png)

{!event-filtering-additional-feature.md!}

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/gitea/tests.py

```python
from unittest.mock import MagicMock, patch

from zerver.lib.test_classes import WebhookTestCase


class GiteaHookTests(WebhookTestCase):
    CHANNEL_NAME = "commits"
    URL_TEMPLATE = "/api/v1/external/gitea?&api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "gitea"

    def test_multiple_commits(self) -> None:
        expected_topic_name = "test / d"
        expected_message = """kostekIV [pushed](https://try.gitea.io/kostekIV/test/compare/21138d2ca0ce18f8e037696fdbe1b3f0c211f630...2ec0c971d04723523aa20f2b378f8b419b47d4ec) 5 commits to branch d.

* commit ([2ec0c971d04](https://try.gitea.io/kostekIV/test/commit/2ec0c971d04723523aa20f2b378f8b419b47d4ec))
* commit ([6cb1701c8b0](https://try.gitea.io/kostekIV/test/commit/6cb1701c8b0114ad716f4cd49153076e7109cb85))
* commit ([6773eabc077](https://try.gitea.io/kostekIV/test/commit/6773eabc0778a3e38997c06a13f5f0c48b67e5dc))
* commit ([337402cf675](https://try.gitea.io/kostekIV/test/commit/337402cf675ce7082ddcd23d06a116c85241825a))
* commit ([0a38cad3fac](https://try.gitea.io/kostekIV/test/commit/0a38cad3fac3a13bb78b738d13f15ce9cc3343fa))"""
        self.check_webhook("push__5_commits", expected_topic_name, expected_message)

    def test_new_branch(self) -> None:
        expected_topic_name = "test / test-branch"
        expected_message = "kostekIV created [test-branch](https://try.gitea.io/kostekIV/test/src/test-branch) branch."
        self.check_webhook("create__branch", expected_topic_name, expected_message)

    def test_pull_request_opened(self) -> None:
        expected_topic_name = "test / PR #1905 New pr"
        expected_message = """kostekIV opened [PR #4](https://try.gitea.io/kostekIV/test/pulls/4) from `test-branch` to `master`."""
        self.check_webhook("pull_request__opened", expected_topic_name, expected_message)

    def test_pull_request_merged(self) -> None:
        expected_topic_name = "zulip-terminal / PR #1905 Fix remove-op on reaction event"
        expected_message = """kostekIV merged [PR #1905](https://try.gitea.io/kostekIV/test/pulls/4) from `reaction-metadata` to `main`."""
        self.check_webhook("pull_request__merged", expected_topic_name, expected_message)

    def test_pull_request_edited(self) -> None:
        expected_topic_name = "test / PR #1906 test 2"
        expected_message = (
            """kostekIV edited [PR #5](https://try.gitea.io/kostekIV/test/pulls/5)."""
        )
        self.check_webhook("pull_request__edited", expected_topic_name, expected_message)

    def test_pull_request_reopened(self) -> None:
        expected_topic_name = "test / PR #1906 test 2"
        expected_message = """kostekIV reopened [PR #5](https://try.gitea.io/kostekIV/test/pulls/5) from `d` to `master`."""
        self.check_webhook("pull_request__reopened", expected_topic_name, expected_message)

    def test_pull_request_closed(self) -> None:
        expected_topic_name = "test / PR #1906 test 2"
        expected_message = """kostekIV closed [PR #5](https://try.gitea.io/kostekIV/test/pulls/5) from `d` to `master`."""
        self.check_webhook("pull_request__closed", expected_topic_name, expected_message)

    def test_pull_request_closed_different_user(self) -> None:
        expected_topic_name = "test / PR #126085 PR closed"
        expected_message = """Aneesh-Hegde closed [PR #1](https://gitea.com/Aneesh-Hegde/test-repo/pulls/1) from `main` to `main`."""
        self.check_webhook("pull_request__closed_diff_user", expected_topic_name, expected_message)

    def test_pull_request_assigned(self) -> None:
        expected_topic_name = "test / PR #1906 test 2"
        expected_message = """kostekIV assigned kostekIV to [PR #5](https://try.gitea.io/kostekIV/test/pulls/5) from `d` to `master` (assigned to kostekIV)."""
        self.check_webhook("pull_request__assigned", expected_topic_name, expected_message)

    def test_issues_opened(self) -> None:
        expected_topic_name = "test / issue #3 Test issue"
        expected_message = """kostekIV opened [issue #3](https://try.gitea.io/kostekIV/test/issues/3):\n\n~~~ quote\nTest body\n~~~"""
        self.check_webhook("issues__opened", expected_topic_name, expected_message)

    def test_issues_edited(self) -> None:
        expected_topic_name = "test / issue #3 Test issue 2"
        expected_message = """kostekIV edited [issue #3](https://try.gitea.io/kostekIV/test/issues/3) (assigned to kostekIV):\n\n~~~ quote\nTest body\n~~~"""
        self.check_webhook("issues__edited", expected_topic_name, expected_message)

    def test_issues_closed(self) -> None:
        expected_topic_name = "test / issue #3 Test issue 2"
        expected_message = """kostekIV closed [issue #3](https://try.gitea.io/kostekIV/test/issues/3) (assigned to kostekIV):\n\n~~~ quote\nTest body\n~~~"""
        self.check_webhook("issues__closed", expected_topic_name, expected_message)

    def test_issues_assigned(self) -> None:
        expected_topic_name = "test / issue #3 Test issue"
        expected_message = """kostekIV assigned kostekIV to [issue #3](https://try.gitea.io/kostekIV/test/issues/3) (assigned to kostekIV):\n\n~~~ quote\nTest body\n~~~"""
        self.check_webhook("issues__assigned", expected_topic_name, expected_message)

    def test_issues_reopened(self) -> None:
        expected_topic_name = "test / issue #3 Test issue 2"
        expected_message = """kostekIV reopened [issue #3](https://try.gitea.io/kostekIV/test/issues/3) (assigned to kostekIV):\n\n~~~ quote\nTest body\n~~~"""
        self.check_webhook("issues__reopened", expected_topic_name, expected_message)

    def test_issue_comment_new(self) -> None:
        expected_topic_name = "test / issue #3 Test issue"
        expected_message = """kostekIV [commented](https://try.gitea.io/kostekIV/test/issues/3#issuecomment-24400) on [issue #3](https://try.gitea.io/kostekIV/test/issues/3):\n\n~~~ quote\ntest comment\n~~~"""
        self.check_webhook("issue_comment__new", expected_topic_name, expected_message)

    def test_issue_comment_in_pr(self) -> None:
        expected_topic_name = "test / issue #1 dummy"
        expected_message = """kostekIV [commented](https://try.gitea.io/kostekIV/test/pulls/1/files#issuecomment-24399) on [issue #1](https://try.gitea.io/kostekIV/test/issues/1):\n\n~~~ quote\ntest comment\n~~~"""
        self.check_webhook("issue_comment__in_pr", expected_topic_name, expected_message)

    def test_issue_comment_edited(self) -> None:
        expected_topic_name = "test / issue #3 Test issue 2"
        expected_message = """kostekIV edited a [comment](https://try.gitea.io/kostekIV/test/issues/3#issuecomment-24400) on [issue #3](https://try.gitea.io/kostekIV/test/issues/3):\n\n~~~ quote\nedit test comment\n~~~"""

        self.check_webhook("issue_comment__edited", expected_topic_name, expected_message)

    @patch("zerver.webhooks.gogs.view.check_send_webhook_message")
    def test_push_filtered_by_branches_ignore(
        self, check_send_webhook_message_mock: MagicMock
    ) -> None:
        self.url = self.build_webhook_url(branches="changes,development")
        payload = self.get_body("push__5_commits")
        result = self.client_post(
            self.url, payload, HTTP_X_GITEA_EVENT="push", content_type="application/json"
        )
        self.assertFalse(check_send_webhook_message_mock.called)
        self.assert_json_success(result)
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/gitea/view.py
Signals: Django

```python
# vim:fenc=utf-8

from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_bool, check_int, check_string
from zerver.lib.webhooks.common import OptionalUserSpecifiedTopicStr, get_http_headers_from_filename
from zerver.lib.webhooks.git import get_pull_request_event_message
from zerver.models import UserProfile

# Gitea is a fork of Gogs, and so the webhook implementation is nearly the same.
from zerver.webhooks.gogs.view import gogs_webhook_main

fixture_to_headers = get_http_headers_from_filename("HTTP_X_GITEA_EVENT")


def format_pull_request_event(payload: WildValue, include_title: bool = False) -> str:
    assignee = payload["pull_request"]["assignee"]

    if payload["pull_request"]["merged"].tame(check_bool):
        user_name = payload["pull_request"]["merged_by"]["username"].tame(check_string)
        action = "merged"
    else:
        user_name = payload["sender"]["username"].tame(check_string)
        action = payload["action"].tame(check_string)

    url = payload["pull_request"]["html_url"].tame(check_string)
    number = payload["pull_request"]["number"].tame(check_int)
    target_branch = None
    base_branch = None
    if action != "edited":
        if "head" in payload["pull_request"]:
            target_branch = payload["pull_request"]["head"]["ref"].tame(check_string)
        if "base" in payload["pull_request"]:
            base_branch = payload["pull_request"]["base"]["ref"].tame(check_string)
    title = payload["pull_request"]["title"].tame(check_string) if include_title else None
    stringified_assignee = assignee["login"].tame(check_string) if assignee else None

    return get_pull_request_event_message(
        user_name=user_name,
        action=action,
        url=url,
        number=number,
        target_branch=target_branch,
        base_branch=base_branch,
        title=title,
        assignee=stringified_assignee,
        assignee_updated=stringified_assignee if action == "assigned" else None,
    )


@webhook_view("Gitea")
@typed_endpoint
def api_gitea_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
    branches: str | None = None,
    user_specified_topic: OptionalUserSpecifiedTopicStr = None,
) -> HttpResponse:
    return gogs_webhook_main(
        "Gitea",
        "X-Gitea-Event",
        format_pull_request_event,
        request,
        user_profile,
        payload,
        branches,
        user_specified_topic,
    )
```

--------------------------------------------------------------------------------

---[FILE: create__branch.json]---
Location: zulip-main/zerver/webhooks/gitea/fixtures/create__branch.json

```json
{
  "secret": "123",
  "sha": "01efc1fe09d4fba25397a386a6c623fd12eadd79",
  "ref": "test-branch",
  "ref_type": "branch",
  "repository": {
    "id": 14576,
    "owner": {
      "id": 21818,
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
      "language": "",
      "is_admin": false,
      "last_login": "2019-11-17T23:23:04Z",
      "created": "2019-11-15T19:17:02Z",
      "username": "kostekIV"
    },
    "name": "test",
    "full_name": "kostekIV/test",
    "description": "",
    "empty": false,
    "private": false,
    "fork": false,
    "template": false,
    "parent": null,
    "mirror": false,
    "size": 18,
    "html_url": "https://try.gitea.io/kostekIV/test",
    "ssh_url": "git@try.gitea.io:kostekIV/test.git",
    "clone_url": "https://try.gitea.io/kostekIV/test.git",
    "original_url": "",
    "website": "",
    "stars_count": 0,
    "forks_count": 0,
    "watchers_count": 1,
    "open_issues_count": 0,
    "default_branch": "master",
    "archived": false,
    "created_at": "2019-11-15T19:19:34Z",
    "updated_at": "2019-11-18T00:11:14Z",
    "permissions": {
      "admin": false,
      "push": false,
      "pull": false
    },
    "has_issues": true,
    "internal_tracker": {
      "enable_time_tracker": true,
      "allow_only_contributors_to_track_time": true,
      "enable_issue_dependencies": true
    },
    "has_wiki": true,
    "has_pull_requests": true,
    "ignore_whitespace_conflicts": false,
    "allow_merge_commits": true,
    "allow_rebase": true,
    "allow_rebase_explicit": true,
    "allow_squash_merge": true,
    "avatar_url": ""
  },
  "sender": {
    "id": 21818,
    "login": "kostekIV",
    "full_name": "",
    "email": "koscis.j@gmail.com",
    "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
    "language": "",
    "is_admin": false,
    "last_login": "2019-11-17T23:23:04Z",
    "created": "2019-11-15T19:17:02Z",
    "username": "kostekIV"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: issues__assigned.json]---
Location: zulip-main/zerver/webhooks/gitea/fixtures/issues__assigned.json

```json
{
  "secret": "123",
  "action": "assigned",
  "number": 3,
  "issue": {
    "id": 8184,
    "url": "https://try.gitea.io/api/v1/repos/kostekIV/test/issues/3",
    "number": 3,
    "user": {
      "id": 21818,
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
      "language": "",
      "is_admin": false,
      "last_login": "2019-11-17T23:23:04Z",
      "created": "2019-11-15T19:17:02Z",
      "username": "kostekIV"
    },
    "original_author": "",
    "original_author_id": 0,
    "title": "Test issue",
    "body": "Test body",
    "labels": [],
    "milestone": null,
    "assignee": {
      "id": 21818,
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
      "language": "",
      "is_admin": false,
      "last_login": "2019-11-17T23:23:04Z",
      "created": "2019-11-15T19:17:02Z",
      "username": "kostekIV"
    },
    "assignees": [
      {
        "id": 21818,
        "login": "kostekIV",
        "full_name": "",
        "email": "koscis.j@gmail.com",
        "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
        "language": "",
        "is_admin": false,
        "last_login": "2019-11-17T23:23:04Z",
        "created": "2019-11-15T19:17:02Z",
        "username": "kostekIV"
      }
    ],
    "state": "open",
    "comments": 1,
    "created_at": "2019-11-17T23:45:03Z",
    "updated_at": "2019-11-18T00:01:30Z",
    "closed_at": null,
    "due_date": null,
    "pull_request": null,
    "repository": {
      "id": 14576,
      "name": "test",
      "full_name": "kostekIV/test"
    }
  },
  "repository": {
    "id": 14576,
    "owner": {
      "id": 21818,
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
      "language": "",
      "is_admin": false,
      "last_login": "2019-11-17T23:23:04Z",
      "created": "2019-11-15T19:17:02Z",
      "username": "kostekIV"
    },
    "name": "test",
    "full_name": "kostekIV/test",
    "description": "",
    "empty": false,
    "private": false,
    "fork": false,
    "template": false,
    "parent": null,
    "mirror": false,
    "size": 18,
    "html_url": "https://try.gitea.io/kostekIV/test",
    "ssh_url": "git@try.gitea.io:kostekIV/test.git",
    "clone_url": "https://try.gitea.io/kostekIV/test.git",
    "original_url": "",
    "website": "",
    "stars_count": 0,
    "forks_count": 0,
    "watchers_count": 1,
    "open_issues_count": 1,
    "default_branch": "master",
    "archived": false,
    "created_at": "2019-11-15T19:19:34Z",
    "updated_at": "2019-11-17T21:35:13Z",
    "permissions": {
      "admin": true,
      "push": true,
      "pull": true
    },
    "has_issues": true,
    "internal_tracker": {
      "enable_time_tracker": true,
      "allow_only_contributors_to_track_time": true,
      "enable_issue_dependencies": true
    },
    "has_wiki": true,
    "has_pull_requests": true,
    "ignore_whitespace_conflicts": false,
    "allow_merge_commits": true,
    "allow_rebase": true,
    "allow_rebase_explicit": true,
    "allow_squash_merge": true,
    "avatar_url": ""
  },
  "sender": {
    "id": 21818,
    "login": "kostekIV",
    "full_name": "",
    "email": "koscis.j@gmail.com",
    "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
    "language": "",
    "is_admin": false,
    "last_login": "2019-11-17T23:23:04Z",
    "created": "2019-11-15T19:17:02Z",
    "username": "kostekIV"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: issues__closed.json]---
Location: zulip-main/zerver/webhooks/gitea/fixtures/issues__closed.json

```json
{
  "secret": "123",
  "action": "closed",
  "number": 3,
  "issue": {
    "id": 8184,
    "url": "https://try.gitea.io/api/v1/repos/kostekIV/test/issues/3",
    "number": 3,
    "user": {
      "id": 21818,
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
      "language": "",
      "is_admin": false,
      "last_login": "2019-11-17T23:23:04Z",
      "created": "2019-11-15T19:17:02Z",
      "username": "kostekIV"
    },
    "original_author": "",
    "original_author_id": 0,
    "title": "Test issue 2",
    "body": "Test body",
    "labels": [],
    "milestone": null,
    "assignee": {
      "id": 21818,
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
      "language": "",
      "is_admin": false,
      "last_login": "2019-11-17T23:23:04Z",
      "created": "2019-11-15T19:17:02Z",
      "username": "kostekIV"
    },
    "assignees": [
      {
        "id": 21818,
        "login": "kostekIV",
        "full_name": "",
        "email": "koscis.j@gmail.com",
        "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
        "language": "",
        "is_admin": false,
        "last_login": "2019-11-17T23:23:04Z",
        "created": "2019-11-15T19:17:02Z",
        "username": "kostekIV"
      }
    ],
    "state": "closed",
    "comments": 1,
    "created_at": "2019-11-17T23:45:03Z",
    "updated_at": "2019-11-18T00:08:27Z",
    "closed_at": "2019-11-18T00:08:27Z",
    "due_date": null,
    "pull_request": null,
    "repository": {
      "id": 14576,
      "name": "test",
      "full_name": "kostekIV/test"
    }
  },
  "repository": {
    "id": 14576,
    "owner": {
      "id": 21818,
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
      "language": "",
      "is_admin": false,
      "last_login": "2019-11-17T23:23:04Z",
      "created": "2019-11-15T19:17:02Z",
      "username": "kostekIV"
    },
    "name": "test",
    "full_name": "kostekIV/test",
    "description": "",
    "empty": false,
    "private": false,
    "fork": false,
    "template": false,
    "parent": null,
    "mirror": false,
    "size": 18,
    "html_url": "https://try.gitea.io/kostekIV/test",
    "ssh_url": "git@try.gitea.io:kostekIV/test.git",
    "clone_url": "https://try.gitea.io/kostekIV/test.git",
    "original_url": "",
    "website": "",
    "stars_count": 0,
    "forks_count": 0,
    "watchers_count": 1,
    "open_issues_count": 1,
    "default_branch": "master",
    "archived": false,
    "created_at": "2019-11-15T19:19:34Z",
    "updated_at": "2019-11-17T21:35:13Z",
    "permissions": {
      "admin": true,
      "push": true,
      "pull": true
    },
    "has_issues": true,
    "internal_tracker": {
      "enable_time_tracker": true,
      "allow_only_contributors_to_track_time": true,
      "enable_issue_dependencies": true
    },
    "has_wiki": true,
    "has_pull_requests": true,
    "ignore_whitespace_conflicts": false,
    "allow_merge_commits": true,
    "allow_rebase": true,
    "allow_rebase_explicit": true,
    "allow_squash_merge": true,
    "avatar_url": ""
  },
  "sender": {
    "id": 21818,
    "login": "kostekIV",
    "full_name": "",
    "email": "koscis.j@gmail.com",
    "avatar_url": "https://try.gitea.io/user/avatar/kostekIV/-1",
    "language": "",
    "is_admin": false,
    "last_login": "2019-11-17T23:23:04Z",
    "created": "2019-11-15T19:17:02Z",
    "username": "kostekIV"
  }
}
```

--------------------------------------------------------------------------------

````
