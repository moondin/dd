---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1259
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1259 of 1290)

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

---[FILE: invoice_updated__paid.json]---
Location: zulip-main/zerver/webhooks/stripe/fixtures/invoice_updated__paid.json

```json
{
    "object": "event",
    "type": "invoice.updated",
    "pending_webhooks": 1,
    "created": 1560064810,
    "livemode": false,
    "request": {
        "idempotency_key": null,
        "id": "req_4ITsSSm2tprAwz"
    },
    "data": {
        "previous_attributes": {
            "status": "draft",
            "due_date": null,
            "invoice_pdf": null,
            "attempted": false,
            "number": "113948B9-DRAFT",
            "ending_balance": null,
            "auto_advance": true,
            "paid": false,
            "status_transitions": {
                "finalized_at": null,
                "paid_at": null
            },
            "hosted_invoice_url": null
        },
        "object": {
            "default_tax_rates": [],
            "livemode": false,
            "tax": null,
            "number": "113948B9-0001",
            "attempt_count": 0,
            "currency": "usd",
            "payment_intent": null,
            "default_payment_method": null,
            "total": 100,
            "account_name": null,
            "custom_fields": null,
            "customer_name": "Hemanth V. Alluri",
            "customer_shipping": null,
            "customer_tax_ids": [],
            "invoice_pdf": "https://pay.stripe.com/invoice/invst_iTAW0hYwxklggGxPhtXkSyUF8y/pdf",
            "billing": "send_invoice",
            "footer": null,
            "description": null,
            "customer_phone": null,
            "id": "in_1EjLINHuGUuNWDDZjDf2WNqd",
            "webhooks_delivered_at": 1560064708,
            "charge": null,
            "period_end": 1560064707,
            "discount": null,
            "customer_tax_exempt": "none",
            "post_payment_credit_notes_amount": 0,
            "metadata": {},
            "status": "paid",
            "due_date": 1560151211,
            "pre_payment_credit_notes_amount": 0,
            "customer_email": "hemanth.alluri.123@gmail.com",
            "collection_method": "send_invoice",
            "statement_descriptor": null,
            "attempted": true,
            "amount_paid": 100,
            "object": "invoice",
            "amount_remaining": 0,
            "paid": true,
            "customer_address": null,
            "auto_advance": false,
            "ending_balance": 0,
            "billing_reason": "manual",
            "hosted_invoice_url": "https://pay.stripe.com/invoice/invst_iTAW0hYwxklggGxPhtXkSyUF8y",
            "period_start": 1560064707,
            "subtotal": 100,
            "tax_percent": null,
            "subscription": null,
            "customer": "cus_FDmrSwQt9Fck5M",
            "total_tax_amounts": [],
            "application_fee_amount": null,
            "next_payment_attempt": null,
            "created": 1560064707,
            "status_transitions": {
                "voided_at": null,
                "finalized_at": 1560064810,
                "marked_uncollectible_at": null,
                "paid_at": 1560064810
            },
            "default_source": null,
            "lines": {
                "has_more": false,
                "total_count": 1,
                "object": "list",
                "data": [
                    {
                        "discountable": true,
                        "livemode": false,
                        "description": "Pen",
                        "subscription": null,
                        "proration": false,
                        "object": "line_item",
                        "period": {
                            "start": 1560064707,
                            "end": 1560064707
                        },
                        "tax_rates": [],
                        "currency": "usd",
                        "amount": 100,
                        "invoice_item": "ii_1EjLINHuGUuNWDDZJX6Nl48C",
                        "tax_amounts": [],
                        "plan": null,
                        "quantity": 1,
                        "type": "invoiceitem",
                        "id": "ii_1EjLINHuGUuNWDDZJX6Nl48C",
                        "metadata": {}
                    }
                ],
                "url": "/v1/invoices/in_1EjLINHuGUuNWDDZjDf2WNqd/lines"
            },
            "account_country": "US",
            "starting_balance": 0,
            "amount_due": 100,
            "receipt_number": null
        }
    },
    "id": "evt_1EjLK2HuGUuNWDDZZ88XyWhO",
    "api_version": "2019-03-14"
}
```

--------------------------------------------------------------------------------

---[FILE: pseudo_refund_event.json]---
Location: zulip-main/zerver/webhooks/stripe/fixtures/pseudo_refund_event.json

```json
{
    "id": "evt_abcde12345ABCDE",
    "object": "event",
    "api_version": "2018-05-21",
    "created": 1581391347,
    "data": {
        "object": {
            "id": "pyr_abcde12345ABCDF",
            "object": "refund",
            "amount": 1234,
            "balance_transaction": null,
            "charge": "py_abcde12345ABCDG",
            "created": 1589212391,
            "currency": "eur",
            "metadata": {},
            "payment_intent": "pi_abcd1234ABCDH",
            "reason": null,
            "receipt_number": null,
            "source_transfer_reversal": null,
            "status": "succeeded",
            "transfer_reversal": null
        },
        "previous_attributes": {}
    },
    "livemode": true,
    "pending_webhooks": 1,
    "request": {
        "id": null,
        "idempotency_key": null
    },
    "type": "charge.refund.updated"
}
```

--------------------------------------------------------------------------------

---[FILE: refund_event.json]---
Location: zulip-main/zerver/webhooks/stripe/fixtures/refund_event.json

```json
{
    "id": "evt_1Gib6dHLwdCOCoR7mbMhSVu0",
    "object": "event",
    "api_version": "2020-03-02",
    "created": 1589439827,
    "data": {
        "object": {
            "id": "re_1Gib6ZHLwdCOCoR7VrzCnXlj",
            "object": "refund",
            "amount": 30000000,
            "balance_transaction": "txn_1Gib6ZHLwdCOCoR71Gd83huz",
            "charge": "ch_1Gib61HLwdCOCoR71rnkccye",
            "created": 1589439823,
            "currency": "inr",
            "failure_balance_transaction": "txn_1Gib6dHLwdCOCoR7VQXTaZVj",
            "failure_reason": "expired_or_canceled_card",
            "metadata": {},
            "payment_intent": "pi_1Gib60HLwdCOCoR7KJbTO3U7",
            "reason": null,
            "receipt_number": null,
            "source_transfer_reversal": null,
            "status": "failed",
            "transfer_reversal": null
        },
        "previous_attributes": {
            "failure_balance_transaction": null,
            "failure_reason": null,
            "status": "succeeded"
        }
    },
    "livemode": false,
    "pending_webhooks": 1,
    "request": {
        "id": null,
        "idempotency_key": null
    },
    "type": "charge.refund.updated"
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/taiga/doc.md

```text
# Zulip Taiga integration

Receive Zulip notifications for your Taiga projects!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Go to your **Projects Dashboard** on Taiga, and select the project you'd like to
   receive notifications for.

1. Go to **Admin**, and select  **Integrations**. Click **Add a new webhook**.

1. Set **Name** to a name of your choice, such as `Zulip`. Set **URL** to the
   URL generated above, and set **Secret key** to the API key of the bot created
   above. Save the form.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/taiga/001.png)

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/taiga/tests.py

```python
from typing_extensions import override

from zerver.lib.test_classes import WebhookTestCase


class TaigaHookTests(WebhookTestCase):
    CHANNEL_NAME = "taiga"
    TOPIC_NAME = "subject"
    URL_TEMPLATE = "/api/v1/external/taiga?stream={stream}&api_key={api_key}"
    WEBHOOK_DIR_NAME = "taiga"

    @override
    def setUp(self) -> None:
        super().setUp()
        self.url = self.build_webhook_url(topic=self.TOPIC_NAME)

    def test_taiga_userstory_deleted(self) -> None:
        message = "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) deleted user story **New userstory**."
        self.check_webhook("userstory_deleted", self.TOPIC_NAME, message)

    def test_taiga_userstory_created(self) -> None:
        message = "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) created user story **New userstory**."
        self.check_webhook("userstory_created", self.TOPIC_NAME, message)

    def test_taiga_userstory_changed_unblocked(self) -> None:
        message = "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) unblocked user story **UserStory**."
        self.check_webhook("userstory_changed_unblocked", self.TOPIC_NAME, message)

    def test_taiga_userstory_changed_subject(self) -> None:
        message = "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) renamed user story from UserStory to **UserStoryNewSubject**."
        self.check_webhook("userstory_changed_subject", self.TOPIC_NAME, message)

    def test_taiga_userstory_changed_status(self) -> None:
        message = "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) changed status of user story **UserStory** from Ready to In progress."
        self.check_webhook("userstory_changed_status", self.TOPIC_NAME, message)

    def test_taiga_userstory_changed_reassigned(self) -> None:
        message = "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) reassigned user story **UserStory** from TomaszKolek to HanSolo."
        self.check_webhook("userstory_changed_reassigned", self.TOPIC_NAME, message)

    def test_taiga_userstory_changed_unassigned(self) -> None:
        message = "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) unassigned user story **UserStory**."
        self.check_webhook("userstory_changed_unassigned", self.TOPIC_NAME, message)

    def test_taiga_userstory_changed_points(self) -> None:
        message = "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) changed estimation of user story **UserStory**."
        self.check_webhook("userstory_changed_points", self.TOPIC_NAME, message)

    def test_taiga_userstory_changed_new_sprint(self) -> None:
        message = "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) added user story **UserStory** to sprint Sprint1."
        self.check_webhook("userstory_changed_new_sprint", self.TOPIC_NAME, message)

    def test_taiga_userstory_changed_sprint(self) -> None:
        message = "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) changed sprint of user story **UserStory** from Sprint1 to Sprint2."
        self.check_webhook("userstory_changed_sprint", self.TOPIC_NAME, message)

    def test_taiga_userstory_changed_remove_sprint(self) -> None:
        message = "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) removed user story **UserStory** from sprint Sprint2."
        self.check_webhook("userstory_changed_remove_sprint", self.TOPIC_NAME, message)

    def test_taiga_userstory_changed_description(self) -> None:
        message = "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) updated description of user story **UserStory**."
        self.check_webhook("userstory_changed_description", self.TOPIC_NAME, message)

    def test_taiga_userstory_changed_closed(self) -> None:
        message = "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) changed status of user story **UserStory** from New to Done.\n[TomaszKolek](https://tree.taiga.io/profile/kolaszek) closed user story **UserStory**."
        self.check_webhook("userstory_changed_closed", self.TOPIC_NAME, message)

    def test_taiga_userstory_changed_reopened(self) -> None:
        message = "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) changed status of user story **UserStory** from Done to Ready.\n[TomaszKolek](https://tree.taiga.io/profile/kolaszek) reopened user story **UserStory**."
        self.check_webhook("userstory_changed_reopened", self.TOPIC_NAME, message)

    def test_taiga_userstory_changed_blocked(self) -> None:
        message = "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) blocked user story **UserStory**."
        self.check_webhook("userstory_changed_blocked", self.TOPIC_NAME, message)

    def test_taiga_userstory_changed_assigned(self) -> None:
        message = "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) assigned user story **UserStory** to TomaszKolek."
        self.check_webhook("userstory_changed_assigned", self.TOPIC_NAME, message)

    def test_taiga_userstory_comment_added(self) -> None:
        message = "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) commented on user story **UserStory**."
        self.check_webhook("userstory_changed_comment_added", self.TOPIC_NAME, message)

    def test_taiga_userstory_changed_due_date(self) -> None:
        message = (
            "[Aditya Verma](https://tree.taiga.io/profile/orientor) changed due date of user story"
            " [Nice Issue](https://tree.taiga.io/project/orientor-sd/us/54) from 2020-02-15 to"
            " 2020-02-22."
        )
        self.check_webhook("userstory_changed_due_date", self.TOPIC_NAME, message)

    def test_taiga_userstory_changed_new_due_date(self) -> None:
        message = "[Aditya Verma](https://tree.taiga.io/profile/orientor) set due date of user story [random](https://tree.taiga.io/project/orientor-sd/us/58) to 2020-02-15."
        self.check_webhook("userstory_changed_new_due_date", self.TOPIC_NAME, message)

    def test_taiga_task_created(self) -> None:
        message = "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) created task **New Task**."
        self.check_webhook("task_created", self.TOPIC_NAME, message)

    def test_taiga_task_changed_user_stories(self) -> None:
        message = "[Eeshan Garg](https://tree.taiga.io/profile/eeshangarg) added task **Get this task done** to sprint Another one.\n[Eeshan Garg](https://tree.taiga.io/profile/eeshangarg) moved task **Get this task done** from user story #7 Yaar ne scirra! to #8 A related user story, which is epic."
        self.check_webhook("task_changed_user_stories", self.TOPIC_NAME, message)

    def test_taiga_task_changed_status(self) -> None:
        message = "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) changed status of task **New Task** from New to In progress."
        self.check_webhook("task_changed_status", self.TOPIC_NAME, message)

    def test_taiga_task_changed_blocked(self) -> None:
        message = "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) blocked task **New Task**."
        self.check_webhook("task_changed_blocked", self.TOPIC_NAME, message)

    def test_taiga_task_changed_blocked_link(self) -> None:
        message = "[Aditya Verma](https://tree.taiga.io/profile/orientor) blocked task [nice task](https://tree.taiga.io/project/orientor-sd/task/56)."
        self.check_webhook("task_changed_blocked_link", self.TOPIC_NAME, message)

    def test_taiga_task_changed_unblocked(self) -> None:
        message = (
            "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) unblocked task **New Task**."
        )
        self.check_webhook("task_changed_unblocked", self.TOPIC_NAME, message)

    def test_taiga_task_changed_assigned(self) -> None:
        message = "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) assigned task **New Task** to TomaszKolek."
        self.check_webhook("task_changed_assigned", self.TOPIC_NAME, message)

    def test_taiga_task_changed_reassigned(self) -> None:
        message = "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) reassigned task **New Task** from HanSolo to TomaszKolek."
        self.check_webhook("task_changed_reassigned", self.TOPIC_NAME, message)

    def test_taiga_task_changed_subject(self) -> None:
        message = "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) renamed task New Task to **New Task Subject**."
        self.check_webhook("task_changed_subject", self.TOPIC_NAME, message)

    def test_taiga_task_changed_description(self) -> None:
        message = "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) updated description of task **New Task**."
        self.check_webhook("task_changed_description", self.TOPIC_NAME, message)

    def test_taiga_task_deleted(self) -> None:
        message = "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) deleted task **New Task**."
        self.check_webhook("task_deleted", self.TOPIC_NAME, message)

    def test_taiga_task_changed_comment_added(self) -> None:
        message = (
            "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) commented on task **New Task**."
        )
        self.check_webhook("task_changed_comment_added", self.TOPIC_NAME, message)

    def test_taiga_task_changed_due_date(self) -> None:
        message = (
            "[Aditya Verma](https://tree.taiga.io/profile/orientor) changed due date of task"
            " [nice task](https://tree.taiga.io/project/orientor-sd/task/56) from 2020-02-22 to"
            " 2020-02-15."
        )
        self.check_webhook("task_changed_due_date", self.TOPIC_NAME, message)

    def test_taiga_task_changed_new_due_date(self) -> None:
        message = "[Aditya Verma](https://tree.taiga.io/profile/orientor) set due date of task [nice task](https://tree.taiga.io/project/orientor-sd/task/56) to 2020-02-22."
        self.check_webhook("task_changed_new_due_date", self.TOPIC_NAME, message)

    def test_taiga_sprint_created(self) -> None:
        message = (
            "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) created sprint **New sprint**."
        )
        self.check_webhook("sprint_created", self.TOPIC_NAME, message)

    def test_taiga_sprint_deleted(self) -> None:
        message = (
            "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) deleted sprint **New name**."
        )
        self.check_webhook("sprint_deleted", self.TOPIC_NAME, message)

    def test_taiga_sprint_changed_time(self) -> None:
        message = "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) changed estimated finish of sprint **New sprint** from 2017-01-24 to 2017-01-25."
        self.check_webhook("sprint_changed_time", self.TOPIC_NAME, message)

    def test_taiga_sprint_changed_name(self) -> None:
        message = "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) renamed sprint from New sprint to **New name**."
        self.check_webhook("sprint_changed_name", self.TOPIC_NAME, message)

    def test_taiga_issue_created(self) -> None:
        message = (
            "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) created issue **New issue**."
        )
        self.check_webhook("issue_created", self.TOPIC_NAME, message)

    def test_taiga_issue_created_link(self) -> None:
        message = "[Aditya Verma](https://tree.taiga.io/profile/orientor) created issue [Issues](https://tree.taiga.io/project/orientor-sd/issue/49)."
        self.check_webhook("issue_created_link", self.TOPIC_NAME, message)

    def test_taiga_issue_deleted(self) -> None:
        message = (
            "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) deleted issue **New issue**."
        )
        self.check_webhook("issue_deleted", self.TOPIC_NAME, message)

    def test_taiga_issue_changed_assigned(self) -> None:
        message = "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) assigned issue **New issue** to TomaszKolek."
        self.check_webhook("issue_changed_assigned", self.TOPIC_NAME, message)

    def test_taiga_issue_changed_reassigned(self) -> None:
        message = "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) reassigned issue **New issue** from TomaszKolek to HanSolo."
        self.check_webhook("issue_changed_reassigned", self.TOPIC_NAME, message)

    def test_taiga_issue_changed_subject(self) -> None:
        message = "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) renamed issue New issue to **New issueNewSubject**."
        self.check_webhook("issue_changed_subject", self.TOPIC_NAME, message)

    def test_taiga_issue_changed_description(self) -> None:
        message = "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) updated description of issue **New issue**."
        self.check_webhook("issue_changed_description", self.TOPIC_NAME, message)

    def test_taiga_issue_changed_type(self) -> None:
        message = "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) changed type of issue **New issue** from Bug to Question."
        self.check_webhook("issue_changed_type", self.TOPIC_NAME, message)

    def test_taiga_issue_changed_status(self) -> None:
        message = "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) changed status of issue **New issue** from New to In progress."
        self.check_webhook("issue_changed_status", self.TOPIC_NAME, message)

    def test_taiga_issue_changed_severity(self) -> None:
        message = "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) changed severity of issue **New issue** from Normal to Minor."
        self.check_webhook("issue_changed_severity", self.TOPIC_NAME, message)

    def test_taiga_issue_changed_priority(self) -> None:
        message = "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) changed priority of issue **New issue** from Normal to Low."
        self.check_webhook("issue_changed_priority", self.TOPIC_NAME, message)

    def test_taiga_issue_changed_comment_added(self) -> None:
        message = "[TomaszKolek](https://tree.taiga.io/profile/kolaszek) commented on issue **New issue**."
        self.check_webhook("issue_changed_comment_added", self.TOPIC_NAME, message)

    def test_taiga_issue_changed_blocked(self) -> None:
        message = "[Aditya Verma](https://tree.taiga.io/profile/orientor) blocked issue [Issues](https://tree.taiga.io/project/orientor-sd/issue/49)."
        self.check_webhook("issue_changed_blocked", self.TOPIC_NAME, message)

    def test_taiga_issue_changed_unblocked(self) -> None:
        message = "[Aditya Verma](https://tree.taiga.io/profile/orientor) unblocked issue [Issues](https://tree.taiga.io/project/orientor-sd/issue/49)."
        self.check_webhook("issue_changed_unblocked", self.TOPIC_NAME, message)

    def test_taiga_issue_changed_due_date(self) -> None:
        message = (
            "[Aditya Verma](https://tree.taiga.io/profile/orientor) changed due date of issue"
            " [Issues](https://tree.taiga.io/project/orientor-sd/issue/49) from 2020-03-08 to"
            " 2020-02-22."
        )
        self.check_webhook("issue_changed_due_date", self.TOPIC_NAME, message)

    def test_taiga_issue_changed_new_due_date(self) -> None:
        message = "[Aditya Verma](https://tree.taiga.io/profile/orientor) set due date of issue [Nice Issue](https://tree.taiga.io/project/orientor-sd/issue/53) to 2020-02-22."
        self.check_webhook("issue_changed_new_due_date", self.TOPIC_NAME, message)

    def test_taiga_issue_changed_new_sprint(self) -> None:
        message = "[Aditya Verma](https://tree.taiga.io/profile/orientor) added issue [Nice Issue](https://tree.taiga.io/project/orientor-sd/issue/53) to sprint eres."
        self.check_webhook("issue_changed_new_sprint", self.TOPIC_NAME, message)

    def test_taiga_issue_changed_remove_sprint(self) -> None:
        message = "[Aditya Verma](https://tree.taiga.io/profile/orientor) detached issue [Nice Issue](https://tree.taiga.io/project/orientor-sd/issue/53) from sprint eres."
        self.check_webhook("issue_changed_remove_sprint", self.TOPIC_NAME, message)

    def test_taiga_epic_created(self) -> None:
        message = "[Eeshan Garg](https://tree.taiga.io/profile/eeshangarg) created epic **Zulip is awesome!**."
        self.check_webhook("epic_created", self.TOPIC_NAME, message)

    def test_taiga_epic_changed_assigned(self) -> None:
        message = "[Eeshan Garg](https://tree.taiga.io/profile/eeshangarg) assigned epic **Zulip is awesome!** to Eeshan Garg."
        self.check_webhook("epic_changed_assigned", self.TOPIC_NAME, message)

    def test_taiga_epic_changed_unassigned(self) -> None:
        message = "[Eeshan Garg](https://tree.taiga.io/profile/eeshangarg) unassigned epic **Zulip is awesome!**."
        self.check_webhook("epic_changed_unassigned", self.TOPIC_NAME, message)

    def test_taiga_epic_changed_reassigned(self) -> None:
        message = "[Eeshan Garg](https://tree.taiga.io/profile/eeshangarg) reassigned epic **Zulip is awesome!** from Eeshan Garg to Angela Johnson."
        self.check_webhook("epic_changed_reassigned", self.TOPIC_NAME, message)

    def test_taiga_epic_changed_blocked(self) -> None:
        message = "[Eeshan Garg](https://tree.taiga.io/profile/eeshangarg) blocked epic **Zulip is awesome!**."
        self.check_webhook("epic_changed_blocked", self.TOPIC_NAME, message)

    def test_taiga_epic_changed_unblocked(self) -> None:
        message = "[Eeshan Garg](https://tree.taiga.io/profile/eeshangarg) unblocked epic **Zulip is awesome!**."
        self.check_webhook("epic_changed_unblocked", self.TOPIC_NAME, message)

    def test_taiga_epic_changed_status(self) -> None:
        message = "[Eeshan Garg](https://tree.taiga.io/profile/eeshangarg) changed status of epic **Zulip is awesome!** from New to In progress."
        self.check_webhook("epic_changed_status", self.TOPIC_NAME, message)

    def test_taiga_epic_changed_renamed(self) -> None:
        message = "[Eeshan Garg](https://tree.taiga.io/profile/eeshangarg) renamed epic from **Zulip is awesome!** to **Zulip is great!**."
        self.check_webhook("epic_changed_renamed", self.TOPIC_NAME, message)

    def test_taiga_epic_changed_description(self) -> None:
        message = "[Eeshan Garg](https://tree.taiga.io/profile/eeshangarg) updated description of epic **Zulip is great!**."
        self.check_webhook("epic_changed_description", self.TOPIC_NAME, message)

    def test_taiga_epic_changed_commented(self) -> None:
        message = "[Eeshan Garg](https://tree.taiga.io/profile/eeshangarg) commented on epic **Zulip is great!**."
        self.check_webhook("epic_changed_commented", self.TOPIC_NAME, message)

    def test_taiga_epic_deleted(self) -> None:
        message = "[Eeshan Garg](https://tree.taiga.io/profile/eeshangarg) deleted epic **Zulip is great!**."
        self.check_webhook("epic_deleted", self.TOPIC_NAME, message)

    def test_taiga_relateduserstory_created(self) -> None:
        message = "[Eeshan Garg](https://tree.taiga.io/profile/eeshangarg) added a related user story **A related user story** to the epic **This is Epic!**."
        self.check_webhook("relateduserstory_created", self.TOPIC_NAME, message)

    def test_taiga_relateduserstory_created_link(self) -> None:
        message = (
            "[Aditya Verma](https://tree.taiga.io/profile/orientor) added a related user story"
            " [Nice Issue](https://tree.taiga.io/project/orientor-sd/us/54) to the epic"
            " [ASAS](https://tree.taiga.io/project/orientor-sd/epic/42)."
        )
        self.check_webhook("relateduserstory_created_link", self.TOPIC_NAME, message)

    def test_taiga_relateduserstory_deleted(self) -> None:
        message = "[Eeshan Garg](https://tree.taiga.io/profile/eeshangarg) removed a related user story **A related user story, which is epic** from the epic **This is Epic!**."
        self.check_webhook("relateduserstory_deleted", self.TOPIC_NAME, message)

    def test_taiga_webhook_test(self) -> None:
        message = (
            "[Jan](https://tree.taiga.io/profile/kostek) triggered a test of the Taiga integration."
        )
        self.check_webhook("webhook_test", self.TOPIC_NAME, message)
```

--------------------------------------------------------------------------------

````
