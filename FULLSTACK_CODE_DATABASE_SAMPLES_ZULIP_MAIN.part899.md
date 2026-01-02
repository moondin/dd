---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 899
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 899 of 1290)

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

---[FILE: send_email.py]---
Location: zulip-main/zerver/lib/send_email.py
Signals: Django

```python
import contextlib
import hashlib
import logging
import os
import re
import smtplib
from collections.abc import Callable, Mapping
from contextlib import suppress
from datetime import timedelta
from email.headerregistry import Address
from email.message import EmailMessage
from email.parser import Parser
from email.policy import default
from email.utils import formataddr, parseaddr
from email.utils import formatdate as email_formatdate
from typing import Any

import backoff
import css_inline
import orjson
from django.conf import settings
from django.core.mail import EmailMultiAlternatives, get_connection
from django.core.mail.backends.base import BaseEmailBackend
from django.core.mail.backends.smtp import EmailBackend
from django.core.mail.message import sanitize_address
from django.core.management import CommandError
from django.db import transaction
from django.db.models import Exists, OuterRef, QuerySet
from django.db.models.functions import Lower
from django.http import HttpRequest
from django.template import loader
from django.utils.timezone import now as timezone_now
from django.utils.translation import gettext as _
from django.utils.translation import override as override_language

from confirmation.models import generate_key
from zerver.lib.logging_util import log_to_file
from zerver.lib.queue import queue_event_on_commit
from zerver.models import Realm, RealmAuditLog, ScheduledEmail, UserProfile
from zerver.models.realm_audit_logs import AuditLogEventType
from zerver.models.scheduled_jobs import EMAIL_TYPES
from zerver.models.users import get_user_profile_by_id
from zproject.email_backends import EmailLogBackEnd, get_forward_address

if settings.ZILENCER_ENABLED:
    from zilencer.models import RemoteZulipServer

MAX_CONNECTION_TRIES = 3

## Logging setup ##

logger = logging.getLogger("zulip.send_email")
log_to_file(logger, settings.EMAIL_LOG_PATH)


def get_inliner_instance() -> css_inline.CSSInliner:
    return css_inline.CSSInliner()


class FromAddress:
    SUPPORT = parseaddr(settings.ZULIP_ADMINISTRATOR)[1]
    NOREPLY = parseaddr(settings.NOREPLY_EMAIL_ADDRESS)[1]

    support_placeholder = "SUPPORT"
    no_reply_placeholder = "NO_REPLY"
    tokenized_no_reply_placeholder = "TOKENIZED_NO_REPLY"

    # Generates an unpredictable noreply address.
    @staticmethod
    def tokenized_no_reply_address() -> str:
        if settings.ADD_TOKENS_TO_NOREPLY_ADDRESS:
            return parseaddr(settings.TOKENIZED_NOREPLY_EMAIL_ADDRESS)[1].format(
                token=generate_key()
            )
        return FromAddress.NOREPLY

    @staticmethod
    def security_email_from_name(
        language: str | None = None, user_profile: UserProfile | None = None
    ) -> str:
        if language is None:
            assert user_profile is not None
            language = user_profile.default_language

        with override_language(language):
            return _("{service_name} account security").format(
                service_name=settings.INSTALLATION_NAME
            )


def build_email(
    template_prefix: str,
    to_user_ids: list[int] | None = None,
    to_emails: list[str] | None = None,
    from_name: str | None = None,
    from_address: str | None = None,
    reply_to_email: str | None = None,
    language: str | None = None,
    date: str | None = None,
    context: Mapping[str, Any] = {},
    realm: Realm | None = None,
) -> EmailMultiAlternatives:
    # Callers should pass exactly one of to_user_id and to_email.
    assert (to_user_ids is None) ^ (to_emails is None)
    if to_user_ids is not None:
        to_users = [get_user_profile_by_id(to_user_id) for to_user_id in to_user_ids]
        if realm is None:
            assert len({to_user.realm_id for to_user in to_users}) == 1
            realm = to_users[0].realm
        to_emails = []
        for to_user in to_users:
            stringified = str(
                Address(display_name=to_user.full_name, addr_spec=to_user.delivery_email)
            )
            # Check ASCII encoding length.  Amazon SES rejects emails
            # with From or To values longer than 320 characters (which
            # appears to be a misinterpretation of the RFC); in that
            # case we drop the name part from the address, under the
            # theory that it's better to send the email with a
            # simplified field than not at all.
            if len(sanitize_address(stringified, "utf-8")) > 320:
                stringified = str(Address(addr_spec=to_user.delivery_email))
            to_emails.append(stringified)

    # Attempt to suppress all auto-replies.  This header originally
    # came out of Microsoft Outlook and friends, but seems reasonably
    # commonly-recognized.
    extra_headers = {"X-Auto-Response-Suppress": "All"}

    if date is None:
        # Messages enqueued via the `email_senders` queue provide a
        # Date header of when they were enqueued; Django would also
        # add a default-now header if we left this off, but doing so
        # ourselves here explicitly makes it slightly more consistent.
        date = email_formatdate()
    extra_headers["Date"] = date

    if realm is not None:
        # formaddr is meant for formatting (display_name, email_address) pair for headers like "To",
        # but we can use its utility for formatting the List-Id header, as it follows the same format,
        # except having just a domain instead of an email address.
        extra_headers["List-Id"] = formataddr((realm.name, realm.host))

    assert settings.STATIC_URL is not None
    context = {
        **context,
        "support_email": FromAddress.SUPPORT,
        # Emails use unhashed image URLs so that those continue to
        # work over time, even if the prod-static directory is cleaned
        # out; as such, they just use a STATIC_URL prefix.
        "email_images_base_url": settings.STATIC_URL + "images/emails",
        "physical_address": settings.PHYSICAL_ADDRESS,
    }

    def get_inlined_template(template: str) -> str:
        inliner = get_inliner_instance()
        return inliner.inline(template)

    def render_templates() -> tuple[str, str, str]:
        email_subject = (
            loader.render_to_string(
                template_prefix + ".subject.txt", context=context, using="Jinja2_plaintext"
            )
            .strip()
            .replace("\n", "")
        )
        message = loader.render_to_string(
            template_prefix + ".txt", context=context, using="Jinja2_plaintext"
        )

        html_message = loader.render_to_string(template_prefix + ".html", context)
        return (get_inlined_template(html_message), message, email_subject)

    # The i18n story for emails is a bit complicated.  For emails
    # going to a single user, we want to use the language that user
    # has configured for their Zulip account.  For emails going to
    # multiple users or to email addresses without a known Zulip
    # account (E.g. invitations), we want to use the default language
    # configured for the Zulip organization.
    #
    # See our i18n documentation for some high-level details:
    # https://zulip.readthedocs.io/en/latest/translating/internationalization.html

    if not language and to_user_ids is not None:
        language = to_users[0].default_language
    if language:
        with override_language(language):
            # Make sure that we render the email using the target's native language
            (html_message, message, email_subject) = render_templates()
    else:
        (html_message, message, email_subject) = render_templates()
        logger.warning("Missing language for email template '%s'", template_prefix)

    if from_name is None:
        from_name = "Zulip"
    if from_address is None:
        from_address = FromAddress.NOREPLY
    if from_address == FromAddress.tokenized_no_reply_placeholder:
        from_address = FromAddress.tokenized_no_reply_address()
    if from_address == FromAddress.no_reply_placeholder:
        from_address = FromAddress.NOREPLY
    if from_address == FromAddress.support_placeholder:
        from_address = FromAddress.SUPPORT

    # Set the "From" that is displayed separately from the envelope-from.
    extra_headers["From"] = str(Address(display_name=from_name, addr_spec=from_address))
    # As above, with the "To" line, we drop the name part if it would
    # result in an address which is longer than 320 bytes.
    if len(sanitize_address(extra_headers["From"], "utf-8")) > 320:
        extra_headers["From"] = str(Address(addr_spec=from_address))

    # If we have an unsubscribe link for this email, configure it for
    # "Unsubscribe" buttons in email clients via the List-Unsubscribe header.
    #
    # Note that Microsoft ignores URLs in List-Unsubscribe headers, as
    # they only support the alternative `mailto:` format, which we
    # have not implemented.
    if "unsubscribe_link" in context:
        extra_headers["List-Unsubscribe"] = f"<{context['unsubscribe_link']}>"
        if not context.get("remote_server_email", False):
            extra_headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click"

    reply_to = None
    if reply_to_email is not None:
        reply_to = [reply_to_email]
    # Remove the from_name in the reply-to for noreply emails, so that users
    # see "noreply@..." rather than "Zulip" or whatever the from_name is
    # when they reply in their email client.
    elif from_address == FromAddress.NOREPLY:
        reply_to = [FromAddress.NOREPLY]

    envelope_from = FromAddress.NOREPLY
    mail = EmailMultiAlternatives(
        email_subject, message, envelope_from, to_emails, reply_to=reply_to, headers=extra_headers
    )
    if html_message is not None:
        mail.attach_alternative(html_message, "text/html")
    return mail


class EmailNotDeliveredError(Exception):
    pass


class DoubledEmailArgumentError(CommandError):
    def __init__(self, argument_name: str) -> None:
        msg = (
            f"Argument '{argument_name}' is ambiguously present in both options and email template."
        )
        super().__init__(msg)


class NoEmailArgumentError(CommandError):
    def __init__(self, argument_name: str) -> None:
        msg = f"Argument '{argument_name}' is required in either options or email template."
        super().__init__(msg)


# When changing the arguments to this function, you may need to write a
# migration to change or remove any emails in ScheduledEmail.
def send_immediate_email(
    template_prefix: str,
    to_user_ids: list[int] | None = None,
    to_emails: list[str] | None = None,
    from_name: str | None = None,
    from_address: str | None = None,
    reply_to_email: str | None = None,
    language: str | None = None,
    date: str | None = None,
    context: Mapping[str, Any] = {},
    realm: Realm | None = None,
    connection: BaseEmailBackend | None = None,
    dry_run: bool = False,
    request: HttpRequest | None = None,
) -> None:
    mail = build_email(
        template_prefix,
        to_user_ids=to_user_ids,
        to_emails=to_emails,
        from_name=from_name,
        from_address=from_address,
        reply_to_email=reply_to_email,
        language=language,
        date=date,
        context=context,
        realm=realm,
    )
    template = template_prefix.split("/")[-1]

    log_email_config_errors()

    if dry_run:
        print(mail.message().get_payload()[0])
        return

    if connection is None:
        connection = get_connection()

    cause = ""
    if request is not None:
        cause = f" (triggered from {request.META['REMOTE_ADDR']})"

    logging_recipient: str | list[str] = mail.to
    if realm is not None:
        logging_recipient = f"{mail.to} in {realm.string_id}"

    logger.info("Sending %s email to %s%s", template, logging_recipient, cause)

    try:
        # This will call .open() for us, which is a no-op if it's already open;
        # it will only call .close() if it was not open to begin with
        if connection.send_messages([mail]) == 0:
            logger.error("Unknown error sending %s email to %s", template, mail.to)
            raise EmailNotDeliveredError
    except smtplib.SMTPResponseException as e:
        logger.exception(
            "Error sending %s email to %s with error code %s: %s",
            template,
            mail.to,
            e.smtp_code,
            e.smtp_error,
            stack_info=True,
        )
        raise EmailNotDeliveredError
    except smtplib.SMTPException as e:
        logger.exception("Error sending %s email to %s: %s", template, mail.to, e, stack_info=True)
        raise EmailNotDeliveredError


def send_email(
    template_prefix: str,
    to_user_ids: list[int] | None = None,
    to_emails: list[str] | None = None,
    from_name: str | None = None,
    from_address: str | None = None,
    reply_to_email: str | None = None,
    language: str | None = None,
    date: str | None = None,
    context: Mapping[str, Any] = {},
    realm: Realm | None = None,
    connection: BaseEmailBackend | None = None,
    dry_run: bool = False,
    request: HttpRequest | None = None,
) -> None:
    if settings.EMAIL_ALWAYS_ENQUEUED and not dry_run:
        queue_event_on_commit(
            "email_senders",
            dict(
                template_prefix=template_prefix,
                to_user_ids=to_user_ids,
                to_emails=to_emails,
                from_name=from_name,
                from_address=from_address,
                reply_to_email=reply_to_email,
                language=language,
                date=date,
                context=context,
                realm_id=realm.id if realm is not None else None,
            ),
        )
    else:
        if settings.TEST_SUITE:
            # In tests, verify that the context object is
            # JSON-serializable, as may happen in production using
            # EMAIL_ALWAYS_ENQUEUED, above.
            context = orjson.loads(orjson.dumps(context))
        send_immediate_email(
            template_prefix,
            to_user_ids,
            to_emails,
            from_name,
            from_address,
            reply_to_email,
            language,
            date,
            context,
            realm,
            connection,
            dry_run,
            request,
        )


@backoff.on_exception(backoff.expo, OSError, max_tries=MAX_CONNECTION_TRIES, logger=None)
def initialize_connection(connection: BaseEmailBackend | None = None) -> BaseEmailBackend:
    if not connection:
        connection = get_connection()
        assert connection is not None

    if connection.open():
        # If it's a new connection, no need to no-op to check connectivity
        return connection

    if isinstance(connection, EmailLogBackEnd) and not get_forward_address():
        # With the development environment backend and without a
        # configured forwarding address, we don't actually send emails.
        #
        # As a result, the connection cannot be closed by the server
        # (as there is none), and `connection.noop` is not
        # implemented, so we need to return the connection early.
        return connection

    # No-op to ensure that we don't return a connection that has been
    # closed by the mail server.
    if isinstance(connection, EmailBackend):
        try:
            assert connection.connection is not None
            status = connection.connection.noop()[0]
        except Exception:
            status = -1
        if status != 250:
            # Close and connect again.
            connection.close()
            connection.open()

    return connection


def send_future_email(
    template_prefix: str,
    realm: Realm,
    to_user_ids: list[int] | None = None,
    to_emails: list[str] | None = None,
    from_name: str | None = None,
    from_address: str | None = None,
    language: str | None = None,
    context: Mapping[str, Any] = {},
    delay: timedelta = timedelta(0),
) -> None:
    template_name = template_prefix.split("/")[-1]
    email_fields = {
        "template_prefix": template_prefix,
        "from_name": from_name,
        "from_address": from_address,
        "language": language,
        "context": context,
    }

    if settings.DEVELOPMENT_LOG_EMAILS:
        send_immediate_email(
            template_prefix,
            to_user_ids=to_user_ids,
            to_emails=to_emails,
            from_name=from_name,
            from_address=from_address,
            language=language,
            context=context,
        )
        # For logging the email

    if delay == timedelta(0):
        # Immediately queue, rather than go through the ScheduledEmail table
        queue_event_on_commit(
            "deferred_email_senders",
            {**email_fields, "to_user_ids": to_user_ids, "to_emails": to_emails},
        )
        return

    assert (to_user_ids is None) ^ (to_emails is None)
    with transaction.atomic(savepoint=False):
        email = ScheduledEmail.objects.create(
            type=EMAIL_TYPES[template_name],
            scheduled_timestamp=timezone_now() + delay,
            realm=realm,
            data=orjson.dumps(email_fields).decode(),
        )

        # We store the recipients in the ScheduledEmail object itself,
        # rather than the JSON data object, so that we can find and clear
        # them using clear_scheduled_emails.
        try:
            if to_user_ids is not None:
                email.users.add(*to_user_ids)
            else:
                assert to_emails is not None
                assert len(to_emails) == 1
                email.address = parseaddr(to_emails[0])[1]
                email.save()
        except Exception as e:
            email.delete()
            raise e


def send_email_to_admins(
    template_prefix: str,
    realm: Realm,
    from_name: str | None = None,
    from_address: str | None = None,
    language: str | None = None,
    context: Mapping[str, Any] = {},
) -> None:
    admins = realm.get_human_admin_users()
    admin_user_ids = [admin.id for admin in admins]
    send_email(
        template_prefix,
        to_user_ids=admin_user_ids,
        from_name=from_name,
        from_address=from_address,
        language=language,
        context=context,
    )


def send_email_to_users_with_billing_access_and_realm_owners(
    template_prefix: str,
    realm: Realm,
    from_name: str | None = None,
    from_address: str | None = None,
    language: str | None = None,
    context: Mapping[str, Any] = {},
) -> None:
    send_email(
        template_prefix,
        to_user_ids=[
            user.id for user in realm.get_human_users_with_billing_access_and_realm_owner_users()
        ],
        from_name=from_name,
        from_address=from_address,
        language=language,
        context=context,
    )


def clear_scheduled_invitation_emails(email: str) -> None:
    """Unlike most scheduled emails, invitation emails don't have an
    existing user object to key off of, so we filter by address here."""
    items = ScheduledEmail.objects.filter(
        address__iexact=email, type=ScheduledEmail.INVITATION_REMINDER
    )
    items.delete()


@transaction.atomic(savepoint=False)
def clear_scheduled_emails(user_ids: list[int], email_type: int | None = None) -> None:
    # We need to obtain a FOR UPDATE lock on the selected rows to keep a concurrent
    # execution of this function (or something else) from deleting them before we access
    # the .users attribute.
    items = ScheduledEmail.objects.filter(users__in=user_ids).select_for_update()
    if email_type is not None:
        items = items.filter(type=email_type)
    item_ids = list(items.values_list("id", flat=True))
    if not item_ids:
        return

    through_model = ScheduledEmail.users.through
    through_model.objects.filter(
        scheduledemail_id__in=item_ids, userprofile_id__in=user_ids
    ).delete()

    # Due to our transaction holding the row lock we have a guarantee
    # that the obtained COUNT is accurate, thus we can reliably use it
    # to decide whether to delete the ScheduledEmail row.
    subquery = through_model.objects.filter(scheduledemail_id=OuterRef("id"))
    ScheduledEmail.objects.filter(id__in=item_ids).exclude(Exists(subquery)).delete()


def handle_send_email_format_changes(job: dict[str, Any]) -> None:
    # Reformat any jobs that used the old to_email
    # and to_user_ids argument formats.
    if "to_email" in job:
        if job["to_email"] is not None:
            job["to_emails"] = [job["to_email"]]
        del job["to_email"]
    if "to_user_id" in job:
        if job["to_user_id"] is not None:
            job["to_user_ids"] = [job["to_user_id"]]
        del job["to_user_id"]


def queue_scheduled_emails(email: ScheduledEmail) -> None:
    data = orjson.loads(email.data)
    user_ids = list(email.users.values_list("id", flat=True))
    if not user_ids and not email.address:
        # This state doesn't make sense, so something must have mutated the object
        logger.warning(
            "ScheduledEmail %s at %s had empty users and address attributes: %r",
            email.id,
            email.scheduled_timestamp,
            data,
        )
        email.delete()
        return

    if user_ids:
        data["to_user_ids"] = user_ids
    if email.address is not None:
        data["to_emails"] = [email.address]
    queue_event_on_commit("deferred_email_senders", data)
    email.delete()


def get_header(option: str | None, header: str | None, name: str) -> str:
    if option and header:
        raise DoubledEmailArgumentError(name)
    if not option and not header:
        raise NoEmailArgumentError(name)
    return str(option or header)


def custom_email_sender(
    markdown_template_path: str,
    dry_run: bool,
    subject: str | None = None,
    from_address: str = FromAddress.SUPPORT,
    from_name: str | None = None,
    reply_to: str | None = None,
    **kwargs: Any,
) -> tuple[Callable[..., None], str]:
    with open(markdown_template_path) as f:
        text = f.read()
        parsed_email_template = Parser(_class=EmailMessage, policy=default).parsestr(text)
        email_template_hash = hashlib.sha256(text.encode()).hexdigest()[0:32]

    email_id = f"zerver/emails/custom/custom_email_{email_template_hash}"
    markdown_email_base_template_path = "templates/zerver/emails/custom_email_base.pre.html"
    html_template_path = f"templates/{email_id}.html"
    plain_text_template_path = f"templates/{email_id}.txt"
    subject_path = f"templates/{email_id}.subject.txt"
    os.makedirs(os.path.dirname(html_template_path), exist_ok=True)

    # First, we render the Markdown input file just like our
    # user-facing docs with render_markdown_path.
    with open(plain_text_template_path, "w") as f:
        payload = parsed_email_template.get_payload()
        assert isinstance(payload, str)
        f.write(payload)

    from zerver.lib.templates import render_markdown_path

    rendered_input = render_markdown_path(plain_text_template_path.replace("templates/", ""))

    # And then extend it with our standard email headers.
    with (
        open(html_template_path, "w") as f,
        open(markdown_email_base_template_path) as base_template,
    ):
        # We use an ugly string substitution here, because we want to:
        #  1. Only run Jinja once on the supplied content
        #  2. Allow the supplied content to have jinja interpolation in it
        #  3. Have that interpolation happen in the context of
        #     each individual email we send, so the contents can
        #     vary user-to-user
        f.write(base_template.read().replace("{{ rendered_input }}", rendered_input))

    # Add the manage_preferences block content in the plain_text template.
    manage_preferences_block_template_path = (
        "templates/zerver/emails/custom_email_base.pre.manage_preferences_block.txt"
    )
    with (
        open(plain_text_template_path, "a") as f,
        open(manage_preferences_block_template_path) as manage_preferences_block,
    ):
        f.write(manage_preferences_block.read())

    with open(subject_path, "w") as f:
        f.write(get_header(subject, parsed_email_template.get("subject"), "subject"))

    already_printed_once = False

    def send_one_email(
        context: dict[str, Any], to_user: UserProfile | None = None, to_email: str | None = None
    ) -> None:
        assert to_user is not None or to_email is not None
        if dry_run:
            nonlocal already_printed_once
            if already_printed_once:
                return
            else:
                already_printed_once = True
        with suppress(EmailNotDeliveredError):
            send_immediate_email(
                email_id,
                to_user_ids=[to_user.id] if to_user is not None else None,
                to_emails=[to_email] if to_email is not None else None,
                from_address=from_address,
                reply_to_email=reply_to,
                from_name=get_header(from_name, parsed_email_template.get("from"), "from_name"),
                context=context,
                dry_run=dry_run,
            )
            if to_user is not None and not dry_run:
                RealmAuditLog.objects.create(
                    realm=to_user.realm,
                    acting_user=None,
                    modified_user=to_user,
                    event_type=AuditLogEventType.CUSTOM_EMAIL_SENT,
                    event_time=timezone_now(),
                    extra_data={
                        "email_id": email_template_hash,
                        "email_subject": get_header(
                            subject, parsed_email_template.get("subject"), "subject"
                        ),
                    },
                )

    return send_one_email, email_template_hash


def send_custom_email(
    users: QuerySet[UserProfile],
    *,
    dry_run: bool,
    options: dict[str, str],
    add_context: Callable[[dict[str, object], UserProfile], None] | None = None,
    distinct_email: bool = False,
) -> QuerySet[UserProfile]:
    """
    Helper for `manage.py send_custom_email`.

    Can be used directly with from a management shell with
    send_custom_email(user_profile_list, dict(
        markdown_template_path="/path/to/markdown/file.md",
        subject="Email subject",
        from_name="Sender Name")
    )
    """
    email_sender, email_template_hash = custom_email_sender(**options, dry_run=dry_run)

    users = users.select_related("realm")

    # Filter out users who already received this email.
    if distinct_email:
        # This deduplication logic is unsound, because the audit logs
        # get attached to one USER who received the email, but we
        # deduplicate based on the CURRENT email address of that user.
        #
        # Email addresses change rarely, so we expect failures to be
        # rare, and the impact of failures is likely to be minor.
        already_sent_emails = (
            RealmAuditLog.objects.filter(
                event_type=AuditLogEventType.CUSTOM_EMAIL_SENT,
                extra_data__email_id=email_template_hash,
                modified_user__isnull=False,
            )
            .annotate(lower_email=Lower("modified_user__delivery_email"))
            .values_list("lower_email", flat=True)
            .distinct()
        )

        already_sent_count = already_sent_emails.count()
        users = (
            users.annotate(lower_email=Lower("delivery_email"))
            .exclude(lower_email__in=already_sent_emails)
            .distinct("lower_email")
            .order_by("lower_email", "id")
        )
    else:
        # For regular emails: exclude by user ID
        already_sent_users = RealmAuditLog.objects.filter(
            event_type=AuditLogEventType.CUSTOM_EMAIL_SENT, extra_data__email_id=email_template_hash
        ).values_list("modified_user_id", flat=True)

        already_sent_count = already_sent_users.count()
        users = users.exclude(id__in=already_sent_users)
        users = users.order_by("id")

    if already_sent_count:
        print(f"Excluded {already_sent_count} users who already received this email")

    for user_profile in users:
        context: dict[str, object] = {
            "realm": user_profile.realm,
            "realm_string_id": user_profile.realm.string_id,
            "realm_url": user_profile.realm.url,
            "realm_name": user_profile.realm.name,
        }
        if add_context is not None:
            add_context(context, user_profile)
        email_sender(
            to_user=user_profile,
            context=context,
        )
    return users


def send_custom_server_email(
    remote_servers: QuerySet["RemoteZulipServer"],
    *,
    dry_run: bool,
    options: dict[str, str],
    add_context: Callable[[dict[str, object], "RemoteZulipServer"], None] | None = None,
) -> None:
    assert settings.CORPORATE_ENABLED
    from corporate.lib.stripe import BILLING_SUPPORT_EMAIL
    from corporate.views.remote_billing_page import (
        generate_confirmation_link_for_server_deactivation,
    )

    email_sender = custom_email_sender(
        **options, dry_run=dry_run, from_address=BILLING_SUPPORT_EMAIL
    )[0]

    for server in remote_servers:
        context = {
            "remote_server_email": True,
            "hostname": server.hostname,
            "unsubscribe_link": generate_confirmation_link_for_server_deactivation(
                server, 60 * 24 * 2
            ),
        }
        if add_context is not None:
            add_context(context, server)
        email_sender(
            to_email=server.contact_email,
            context=context,
        )


def log_email_config_errors() -> None:
    """
    The purpose of this function is to log (potential) config errors,
    but without raising an exception.
    """
    if settings.EMAIL_HOST_USER and settings.EMAIL_HOST_PASSWORD is None:
        logger.error(
            "An SMTP username was set (EMAIL_HOST_USER), but password is unset (EMAIL_HOST_PASSWORD).  "
            "To disable SMTP authentication, set EMAIL_HOST_USER to an empty string."
        )


def maybe_remove_from_suppression_list(email: str) -> None:
    if settings.EMAIL_HOST is None:
        return

    maybe_aws = re.match(r"^email-smtp(?:-fips)?\.([^.]+)\.amazonaws\.com$", settings.EMAIL_HOST)
    if maybe_aws is None:
        return

    import boto3
    import botocore

    if boto3.session.Session().get_credentials() is None:
        return

    with contextlib.suppress(botocore.exceptions.ClientError):
        boto3.client("sesv2", region_name=maybe_aws[1]).delete_suppressed_destination(
            EmailAddress=email
        )
```

--------------------------------------------------------------------------------

---[FILE: server_initialization.py]---
Location: zulip-main/zerver/lib/server_initialization.py
Signals: Django

```python
from collections.abc import Iterable

from django.conf import settings
from django.db import transaction

from zerver.lib.bulk_create import bulk_create_users
from zerver.lib.user_groups import create_system_user_groups_for_realm
from zerver.models import (
    Realm,
    RealmAuditLog,
    RealmAuthenticationMethod,
    RealmUserDefault,
    UserProfile,
)
from zerver.models.clients import get_client
from zerver.models.presence import PresenceSequence
from zerver.models.realm_audit_logs import AuditLogEventType
from zerver.models.users import get_system_bot
from zproject.backends import all_default_backend_names


def server_initialized() -> bool:
    return Realm.objects.exists()


@transaction.atomic(durable=True)
def create_internal_realm() -> None:
    from zerver.actions.create_realm import set_default_for_realm_permission_group_settings
    from zerver.actions.users import do_change_can_forge_sender

    realm = Realm(string_id=settings.SYSTEM_BOT_REALM, name="System bot realm")

    # For now a dummy value of -1 is given to groups fields which
    # is changed later before the transaction is committed.
    for setting_name in Realm.REALM_PERMISSION_GROUP_SETTINGS:
        setattr(realm, setting_name + "_id", -1)
    realm.save()

    RealmAuditLog.objects.create(
        realm=realm, event_type=AuditLogEventType.REALM_CREATED, event_time=realm.date_created
    )
    RealmUserDefault.objects.create(realm=realm)
    create_system_user_groups_for_realm(realm)
    set_default_for_realm_permission_group_settings(realm)

    RealmAuthenticationMethod.objects.bulk_create(
        [
            RealmAuthenticationMethod(name=backend_name, realm=realm)
            for backend_name in all_default_backend_names()
        ]
    )

    PresenceSequence.objects.create(realm=realm, last_update_id=0)

    # Create some client objects for common requests.  Not required;
    # just ensures these get low IDs in production, and in development
    # avoids an extra database write for the first HTTP request in
    # most tests.
    #
    # These are currently also present in DATA_IMPORT_CLIENTS.
    get_client("Internal")
    get_client("website")
    get_client("ZulipMobile")
    get_client("ZulipElectron")

    internal_bots = [
        (bot["name"], bot["email_template"] % (settings.INTERNAL_BOT_DOMAIN,))
        for bot in settings.INTERNAL_BOTS
    ]
    create_users(realm, internal_bots, bot_type=UserProfile.DEFAULT_BOT)
    # Set the owners for these bots to the bots themselves
    bots = UserProfile.objects.filter(email__in=[bot_info[1] for bot_info in internal_bots])
    for bot in bots:
        bot.bot_owner = bot
        # Avatars for system bots are hardcoded, so make sure gravatar
        # won't be used..
        bot.avatar_source = "U"
        bot.save()

    # Initialize the email gateway bot as able to forge senders.
    email_gateway_bot = get_system_bot(settings.EMAIL_GATEWAY_BOT, realm.id)
    do_change_can_forge_sender(email_gateway_bot, True)


def create_users(
    realm: Realm,
    name_list: Iterable[tuple[str, str]],
    tos_version: str | None = None,
    bot_type: int | None = None,
    bot_owner: UserProfile | None = None,
) -> None:
    user_set = {(email, full_name, True) for full_name, email in name_list}
    bulk_create_users(
        realm, user_set, bot_type=bot_type, bot_owner=bot_owner, tos_version=tos_version
    )
```

--------------------------------------------------------------------------------

---[FILE: sessions.py]---
Location: zulip-main/zerver/lib/sessions.py
Signals: Django

```python
import logging
from collections.abc import Mapping
from datetime import timedelta
from importlib import import_module
from typing import Any, Protocol, cast

from django.conf import settings
from django.contrib.auth import SESSION_KEY, get_user_model
from django.contrib.auth.models import AnonymousUser
from django.contrib.sessions.backends.base import SessionBase
from django.contrib.sessions.models import Session
from django.http import HttpRequest
from django.utils.functional import LazyObject
from django.utils.timezone import now as timezone_now

from zerver.lib.request import RequestNotes
from zerver.lib.timestamp import datetime_to_timestamp, timestamp_to_datetime
from zerver.models import Realm, UserProfile
from zerver.models.users import get_user_profile_narrow_by_id


class SessionEngine(Protocol):
    SessionStore: type[SessionBase]


session_engine = cast(SessionEngine, import_module(settings.SESSION_ENGINE))


def get_session_dict_user(session_dict: Mapping[str, int]) -> int | None:
    # Compare django.contrib.auth._get_user_session_key
    try:
        pk = get_user_model()._meta.pk
        assert pk is not None
        return pk.to_python(session_dict[SESSION_KEY])
    except KeyError:
        return None


def get_session_user_id(session: Session) -> int | None:
    return get_session_dict_user(session.get_decoded())


def user_sessions(user_profile: UserProfile) -> list[Session]:
    return [s for s in Session.objects.all() if get_session_user_id(s) == user_profile.id]


def delete_session(session: Session) -> None:
    session_engine.SessionStore(session.session_key).delete()


def delete_user_sessions(user_profile: UserProfile) -> None:
    for session in Session.objects.all().iterator():
        if get_session_user_id(session) == user_profile.id:
            delete_session(session)


def delete_realm_user_sessions(realm: Realm) -> None:
    realm_user_ids = set(UserProfile.objects.filter(realm=realm).values_list("id", flat=True))
    for session in Session.objects.all().iterator():
        if get_session_user_id(session) in realm_user_ids:
            delete_session(session)


def delete_all_user_sessions() -> None:
    for session in Session.objects.all().iterator():
        delete_session(session)


def delete_all_deactivated_user_sessions() -> None:
    for session in Session.objects.all().iterator():
        user_profile_id = get_session_user_id(session)
        if user_profile_id is None:  # nocoverage  # TODO: Investigate why we lost coverage on this
            continue
        user_profile = get_user_profile_narrow_by_id(user_profile_id)
        if not user_profile.is_active or user_profile.realm.deactivated:
            logging.info("Deactivating session for deactivated user %s", user_profile.id)
            delete_session(session)


def set_expirable_session_var(
    session: SessionBase, var_name: str, var_value: Any, expiry_seconds: int
) -> None:
    expire_at = datetime_to_timestamp(timezone_now() + timedelta(seconds=expiry_seconds))
    session[var_name] = {"value": var_value, "expire_at": expire_at}


def get_expirable_session_var(
    session: SessionBase, var_name: str, default_value: Any = None, delete: bool = False
) -> Any:
    if var_name not in session:
        return default_value

    try:
        value, expire_at = (session[var_name]["value"], session[var_name]["expire_at"])
    except (KeyError, TypeError):
        logging.warning("get_expirable_session_var: error getting %s", var_name, exc_info=True)
        return default_value

    if timestamp_to_datetime(expire_at) < timezone_now():
        del session[var_name]
        return default_value

    if delete:
        del session[var_name]
    return value


def narrow_request_user(
    request: HttpRequest, *, user_id: int | None = None
) -> UserProfile | AnonymousUser:
    # In Tornado and other performance-critical paths, we want to not
    # load the extremely wide default UserProfile select_related.  We
    # respect the request.user if it has been explicitly set already,
    # and otherwise perform a cached lookup of a much narrower view of
    # the UserProfile; this is faster than the normal UserProfile both
    # for cache misses (1.8ms vs 15ms) and cache hits (147μs vs
    # 387μs).  We fill the requester_for_logs to skip a session and
    # user memcached fetch when writing the log lines.
    if not isinstance(request.user, LazyObject):
        return request.user  # nocoverage

    if user_id is None:
        user_id = get_session_dict_user(request.session)
    if user_id is None:
        return AnonymousUser()  # nocoverage

    try:
        request.user = get_user_profile_narrow_by_id(user_id)
        RequestNotes.get_notes(
            request
        ).requester_for_logs = request.user.format_requester_for_logs()
    except UserProfile.DoesNotExist:  # nocoverage
        request.user = AnonymousUser()

    return request.user
```

--------------------------------------------------------------------------------

---[FILE: singleton_bmemcached.py]---
Location: zulip-main/zerver/lib/singleton_bmemcached.py
Signals: Django

```python
import pickle
from functools import lru_cache
from typing import Any

from django_bmemcached.memcached import BMemcached

from zerver.lib import zstd_level9


@lru_cache(None)
def _get_bmemcached(location: str, param_bytes: bytes) -> BMemcached:
    params = pickle.loads(param_bytes)  # noqa: S301
    params["OPTIONS"]["compression"] = zstd_level9
    return BMemcached(location, params)


def SingletonBMemcached(location: str, params: dict[str, Any]) -> BMemcached:
    # Django instantiates the cache backend per-task to guard against
    # thread safety issues, but BMemcached is already thread-safe and
    # does its own per-thread pooling, so make sure we instantiate only
    # one to avoid extra connections.

    return _get_bmemcached(location, pickle.dumps(params))
```

--------------------------------------------------------------------------------

````
