---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 872
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 872 of 1290)

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

---[FILE: email_mirror.py]---
Location: zulip-main/zerver/lib/email_mirror.py
Signals: Django

```python
import logging
import re
import secrets
from email.headerregistry import Address, AddressHeader
from email.message import EmailMessage
from re import Match

from django.conf import settings
from django.utils.translation import gettext as _
from typing_extensions import override

from zerver.actions.message_send import (
    check_send_message,
    internal_send_group_direct_message,
    internal_send_private_message,
    internal_send_stream_message,
)
from zerver.lib.display_recipient import get_display_recipient
from zerver.lib.email_mirror_helpers import (
    ZulipEmailForwardError,
    ZulipEmailForwardUserError,
    decode_email_address,
    get_email_gateway_message_string_from_address,
)
from zerver.lib.email_notifications import convert_html_to_markdown
from zerver.lib.exceptions import JsonableError, RateLimitedError
from zerver.lib.markdown import get_markdown_link_for_url
from zerver.lib.message import normalize_body, truncate_content, truncate_topic
from zerver.lib.rate_limiter import RateLimitedObject
from zerver.lib.send_email import FromAddress
from zerver.lib.streams import access_stream_for_send_message
from zerver.lib.string_validation import is_character_printable
from zerver.lib.upload import upload_message_attachment
from zerver.models import (
    ChannelEmailAddress,
    Message,
    MissedMessageEmailAddress,
    Realm,
    Recipient,
    Stream,
    UserProfile,
)
from zerver.models.clients import get_client
from zerver.models.streams import StreamTopicsPolicyEnum, get_stream_by_id_in_realm
from zerver.models.users import get_system_bot, get_user_profile_by_id
from zproject.backends import is_user_active

logger = logging.getLogger(__name__)


def redact_email_address(error_message: str) -> str:
    if not settings.EMAIL_GATEWAY_EXTRA_PATTERN_HACK:
        domain = Address(addr_spec=settings.EMAIL_GATEWAY_PATTERN).domain
    else:
        # EMAIL_GATEWAY_EXTRA_PATTERN_HACK is of the form '@example.com'
        domain = settings.EMAIL_GATEWAY_EXTRA_PATTERN_HACK.removeprefix("@")

    def redact(address_match: Match[str]) -> str:
        email_address = address_match[0]
        # Annotate basic info about the address before scrubbing:
        if is_missed_message_address(email_address):
            annotation = " <Missed message address>"
        else:
            try:
                target_stream_id = decode_stream_email_address(email_address)[0].channel_id
                annotation = f" <Address to stream id: {target_stream_id}>"
            except ZulipEmailForwardError:
                annotation = " <Invalid address>"

        # Scrub the address from the message, to the form XXXXX@example.com:
        return "X" * len(address_match[1]) + address_match[2] + annotation

    return re.sub(rf"\b(\S*?)(@{re.escape(domain)})", redact, error_message)


def log_error(email_message: EmailMessage, error_message: str, to: str | None) -> None:
    recipient = to or "No recipient found"
    error_message = "Sender: {}\nTo: {}\n{}".format(
        email_message.get("From"), recipient, error_message
    )

    error_message = redact_email_address(error_message)
    logger.error(error_message)


# Temporary missed message addresses


def generate_missed_message_token() -> str:
    return "mm" + secrets.token_hex(16)


def is_missed_message_address(address: str) -> bool:
    try:
        msg_string = get_email_gateway_message_string_from_address(address)
    except ZulipEmailForwardError:
        return False

    return is_mm_32_format(msg_string)


def is_mm_32_format(msg_string: str | None) -> bool:
    """
    Missed message strings are formatted with a little "mm" prefix
    followed by a randomly generated 32-character string.
    """
    return msg_string is not None and msg_string.startswith("mm") and len(msg_string) == 34


def get_missed_message_token_from_address(address: str) -> str:
    msg_string = get_email_gateway_message_string_from_address(address)

    if not is_mm_32_format(msg_string):
        raise ZulipEmailForwardError("Could not parse missed message address")

    return msg_string


def get_usable_missed_message_address(address: str) -> MissedMessageEmailAddress:
    token = get_missed_message_token_from_address(address)
    try:
        mm_address = MissedMessageEmailAddress.objects.select_related(
            "user_profile",
            "user_profile__realm",
            "message",
            "message__sender",
            "message__recipient",
            "message__sender__recipient",
        ).get(email_token=token)
    except MissedMessageEmailAddress.DoesNotExist:
        raise ZulipEmailForwardError("Zulip notification reply address is invalid.")

    return mm_address


def create_missed_message_address(user_profile: UserProfile, message: Message) -> str:
    # If the email gateway isn't configured, we specify a reply
    # address, since there's no useful way for the user to reply into
    # Zulip.
    if settings.EMAIL_GATEWAY_PATTERN == "":
        return FromAddress.NOREPLY

    mm_address = MissedMessageEmailAddress.objects.create(
        message=message,
        user_profile=user_profile,
        email_token=generate_missed_message_token(),
    )
    return str(mm_address)


def construct_zulip_body(
    message: EmailMessage,
    subject: str,
    realm: Realm,
    *,
    sender: UserProfile,
    show_sender: bool = False,
    include_quotes: bool = False,
    include_footer: bool = False,
    prefer_text: bool = True,
    subject_in_body: bool = False,
) -> str:
    body = extract_body(message, include_quotes, prefer_text)
    # Remove null characters, since Zulip will reject
    body = body.replace("\x00", "")
    if not include_footer:
        body = filter_footer(body)

    if not body.endswith("\n"):
        body += "\n"
    if not body.rstrip():
        body = "(No email body)"

    preamble = ""
    if show_sender:
        from_address = str(message.get("From", ""))
        preamble = f"**From:** {from_address}\n"
    if subject_in_body:
        preamble += f"**Subject:** {subject}\n"
    if preamble != "":
        preamble += "\n"

    postamble = extract_and_upload_attachments(message, realm, sender)
    if postamble != "":
        postamble = "\n" + postamble

    # Truncate the content ourselves, to ensure that the attachments
    # all make it into the body-as-posted
    body = truncate_content(
        body,
        settings.MAX_MESSAGE_LENGTH - len(preamble) - len(postamble),
        "\n[message truncated]",
    )
    return preamble + body + postamble


## Sending the Zulip ##


def send_zulip(sender: UserProfile, stream: Stream, topic_name: str, content: str) -> None:
    internal_send_stream_message(
        sender,
        stream,
        truncate_topic(topic_name),
        normalize_body(content),
        email_gateway=True,
    )


def send_mm_reply_to_stream(
    user_profile: UserProfile, stream: Stream, topic_name: str, body: str
) -> None:
    try:
        check_send_message(
            sender=user_profile,
            client=get_client("Internal"),
            recipient_type_name="stream",
            message_to=[stream.id],
            topic_name=topic_name,
            message_content=body,
        )
    except JsonableError as error:
        error_message = _(
            "Error sending message to channel {channel_name} via message notification email reply:\n{error_message}"
        ).format(channel_name=stream.name, error_message=error.msg)
        internal_send_private_message(
            get_system_bot(settings.NOTIFICATION_BOT, user_profile.realm_id),
            user_profile,
            error_message,
        )


def get_message_part_by_type(message: EmailMessage, content_type: str) -> str | None:
    charsets = message.get_charsets()

    for idx, part in enumerate(message.walk()):
        if part.get_content_type() == content_type:
            content = part.get_payload(decode=True)
            assert isinstance(content, bytes)
            charset = charsets[idx]
            if charset is not None:
                try:
                    return content.decode(charset, errors="ignore")
                except LookupError:
                    # The RFCs do not define how to handle unknown
                    # charsets, but treating as US-ASCII seems
                    # reasonable; fall through to below.
                    pass

            # If no charset has been specified in the header, assume us-ascii,
            # by RFC6657: https://tools.ietf.org/html/rfc6657
            return content.decode("us-ascii", errors="ignore")

    return None


def extract_body(
    message: EmailMessage, include_quotes: bool = False, prefer_text: bool = True
) -> str:
    plaintext_content = extract_plaintext_body(message, include_quotes)
    html_content = extract_html_body(message, include_quotes)

    if plaintext_content is None and html_content is None:
        logger.warning("Content types: %s", [part.get_content_type() for part in message.walk()])
        raise ZulipEmailForwardUserError("Unable to find plaintext or HTML message body")
    if not plaintext_content and not html_content:
        raise ZulipEmailForwardUserError("Email has no nonempty body sections; ignoring.")

    if prefer_text:
        if plaintext_content:
            return plaintext_content
        else:
            assert html_content  # Needed for mypy. Ensured by the validating block above.
            return html_content
    else:
        if html_content:
            return html_content
        else:
            assert plaintext_content  # Needed for mypy. Ensured by the validating block above.
            return plaintext_content


talon_initialized = False


def extract_plaintext_body(message: EmailMessage, include_quotes: bool = False) -> str | None:
    import talon_core

    global talon_initialized
    if not talon_initialized:
        talon_core.init()
        talon_initialized = True

    plaintext_content = get_message_part_by_type(message, "text/plain")
    if plaintext_content is not None:
        if include_quotes:
            return plaintext_content
        else:
            return talon_core.quotations.extract_from_plain(plaintext_content)
    else:
        return None


def extract_html_body(message: EmailMessage, include_quotes: bool = False) -> str | None:
    import talon_core

    global talon_initialized
    if not talon_initialized:  # nocoverage
        talon_core.init()
        talon_initialized = True

    html_content = get_message_part_by_type(message, "text/html")
    if html_content is not None:
        if include_quotes:
            return convert_html_to_markdown(html_content)
        else:
            return convert_html_to_markdown(talon_core.quotations.extract_from_html(html_content))
    else:
        return None


def filter_footer(text: str) -> str:
    # Try to filter out obvious footers.
    possible_footers = [line for line in text.split("\n") if line.strip() == "--"]
    if len(possible_footers) != 1:
        # Be conservative and don't try to scrub content if there
        # isn't a trivial footer structure.
        return text

    return re.split(r"^\s*--\s*$", text, maxsplit=1, flags=re.MULTILINE)[0].strip()


def extract_and_upload_attachments(message: EmailMessage, realm: Realm, sender: UserProfile) -> str:
    attachment_links = []
    for part in message.walk():
        content_type = part.get_content_type()
        filename = part.get_filename()
        if filename:
            attachment = part.get_payload(decode=True)
            if isinstance(attachment, bytes):
                upload_url, filename = upload_message_attachment(
                    filename,
                    content_type,
                    attachment,
                    sender,
                    target_realm=realm,
                )
                formatted_link = get_markdown_link_for_url(filename, upload_url)
                attachment_links.append(formatted_link)
            else:
                logger.warning(
                    "Payload is not bytes (invalid attachment %s in message from %s).",
                    filename,
                    message.get("From"),
                )

    return "\n".join(attachment_links)


def decode_stream_email_address(email: str) -> tuple[ChannelEmailAddress, dict[str, bool]]:
    token, options = decode_email_address(email)

    try:
        channel_email_address = ChannelEmailAddress.objects.select_related(
            "channel", "sender", "creator", "realm"
        ).get(email_token=token)
    except ChannelEmailAddress.DoesNotExist:
        raise ZulipEmailForwardError("Bad stream token from email recipient " + email)

    return channel_email_address, options


def find_emailgateway_recipient(message: EmailMessage) -> str:
    # We can't use Delivered-To; if there is a X-Gm-Original-To
    # it is more accurate, so try to find the most-accurate
    # recipient list in descending priority order
    recipient_headers = [
        "X-Gm-Original-To",
        "Delivered-To",
        "Envelope-To",
        "Resent-To",
        "Resent-CC",
        "To",
        "CC",
    ]

    pattern_parts = [re.escape(part) for part in settings.EMAIL_GATEWAY_PATTERN.split("%s")]
    match_email_re = re.compile(r".*?".join(pattern_parts))

    for header_name in recipient_headers:
        for header_value in message.get_all(header_name, []):
            if isinstance(header_value, AddressHeader):
                emails = [addr.addr_spec for addr in header_value.addresses]
            else:
                emails = [str(header_value)]

            for email in emails:
                if match_email_re.match(email):
                    return email

    raise ZulipEmailForwardError("Missing recipient in mirror email")


def strip_from_subject(subject: str) -> str:
    # strips RE and FWD from the subject
    # from: https://stackoverflow.com/questions/9153629/regex-code-for-removing-fwd-re-etc-from-email-subject
    reg = r"([\[\(] *)?\b(RE|AW|SV|FWD?) *(\[\d+\])?([-:;)\]][ :;\])-]*|$)|\]+ *$"
    stripped = re.sub(reg, "", subject, flags=re.IGNORECASE | re.MULTILINE)
    return stripped.strip()


def is_forwarded(subject: str) -> bool:
    # regex taken from strip_from_subject, we use it to detect various forms
    # of FWD at the beginning of the subject.
    reg = r"([\[\(] *)?\b(FWD?) *([-:;)\]][ :;\])-]*|$)|\]+ *$"
    return bool(re.match(reg, subject, flags=re.IGNORECASE))


def check_access_for_channel_email_address(channel_email_address: ChannelEmailAddress) -> None:
    channel = channel_email_address.channel
    sender = channel_email_address.sender
    creator = channel_email_address.creator
    realm = channel_email_address.realm
    email_gateway_bot = get_system_bot(settings.EMAIL_GATEWAY_BOT, realm.id)

    if sender.id == email_gateway_bot.id and creator is not None:
        user_for_access_check = creator
    else:
        user_for_access_check = sender

    # Raises JsonableError on permission denied
    access_stream_for_send_message(user_for_access_check, channel, forwarder_user_profile=None)


def process_stream_message(to: str, message: EmailMessage) -> None:
    subject_header = message.get("Subject", "")

    channel_email_address, options = decode_stream_email_address(to)
    channel = channel_email_address.channel
    sender = channel_email_address.sender
    realm = channel_email_address.realm
    try:
        check_access_for_channel_email_address(channel_email_address)
    except JsonableError as e:
        logger.info("Failed to process email to %s (%s): %s", channel.name, realm.string_id, e)
        return

    # Don't remove quotations if message is forwarded, unless otherwise specified:
    if "include_quotes" not in options:
        options["include_quotes"] = is_forwarded(subject_header)

    subject = strip_from_subject(subject_header)
    # We don't want to reject email messages with disallowed characters in the Subject,
    # so we just remove them to make it a valid Zulip topic name.
    subject = "".join([char for char in subject if is_character_printable(char)])
    if channel.topics_policy == StreamTopicsPolicyEnum.empty_topic_only.value:
        options["subject_in_body"] = True
        topic = ""
    elif subject == "":
        topic = _("Email with no subject")
    else:
        topic = subject

    body = construct_zulip_body(message, subject, realm, sender=sender, **options)
    send_zulip(sender, channel, topic, body)
    logger.info(
        "Successfully processed email to %s (%s)",
        channel.name,
        realm.string_id,
    )


def process_missed_message(to: str, message: EmailMessage) -> None:
    auto_submitted = message.get("Auto-Submitted", "")
    if auto_submitted in ("auto-replied", "auto-generated"):
        logger.info("Dropping %s message from %s", auto_submitted, message.get("From"))
        return

    mm_address = get_usable_missed_message_address(to)
    mm_address.increment_times_used()

    user_profile = mm_address.user_profile
    topic_name = mm_address.message.topic_name()

    if mm_address.message.recipient.type == Recipient.PERSONAL:
        # We need to reply to the sender so look up their personal recipient_id
        recipient = mm_address.message.sender.recipient
    else:
        recipient = mm_address.message.recipient

    if not is_user_active(user_profile):
        logger.warning("Sending user is not active. Ignoring this message notification email.")
        return

    body = construct_zulip_body(message, topic_name, user_profile.realm, sender=user_profile)

    assert recipient is not None
    if recipient.type == Recipient.STREAM:
        stream = get_stream_by_id_in_realm(recipient.type_id, user_profile.realm)
        send_mm_reply_to_stream(user_profile, stream, topic_name, body)
        recipient_str = stream.name
    elif recipient.type == Recipient.PERSONAL:
        recipient_user_id = recipient.type_id
        recipient_user = get_user_profile_by_id(recipient_user_id)
        recipient_str = recipient_user.email
        internal_send_private_message(user_profile, recipient_user, body)
    elif recipient.type == Recipient.DIRECT_MESSAGE_GROUP:
        display_recipient = get_display_recipient(recipient)
        emails = [user_dict["email"] for user_dict in display_recipient]
        recipient_str = ", ".join(emails)
        internal_send_group_direct_message(user_profile.realm, user_profile, body, emails=emails)
    else:
        raise AssertionError("Invalid recipient type!")

    logger.info(
        "Successfully processed email from user %s to %s",
        user_profile.id,
        recipient_str,
    )


def process_message(message: EmailMessage, rcpt_to: str | None = None) -> None:
    to: str | None = None

    try:
        if rcpt_to is not None:
            to = rcpt_to
        else:
            to = find_emailgateway_recipient(message)

        if is_missed_message_address(to):
            process_missed_message(to, message)
        else:
            process_stream_message(to, message)
    except ZulipEmailForwardUserError as e:
        # TODO: notify sender of error, retry if appropriate.
        logger.info(e.args[0])
    except ZulipEmailForwardError as e:
        log_error(message, e.args[0], to)


def validate_to_address(address: str, rate_limit: bool = True) -> None:
    if is_missed_message_address(address):
        mm_address = get_usable_missed_message_address(address)
        if mm_address.message.recipient.type == Recipient.STREAM:
            # ACL's on DMs are harder to apply simply, so we
            # just check channel messages.
            access_stream_for_send_message(
                mm_address.user_profile,
                get_stream_by_id_in_realm(
                    mm_address.message.recipient.type_id,
                    mm_address.user_profile.realm,
                ),
                forwarder_user_profile=None,
            )
    else:
        channel_email = decode_stream_email_address(address)[0]
        if rate_limit:
            # Only channel email addresses are rate-limited, since
            # they are likely to be used as the destination for
            # mails from automated systems.
            rate_limit_mirror_by_realm(channel_email.realm)
        check_access_for_channel_email_address(channel_email)


# Email mirror rate limiter code:
class RateLimitedRealmMirror(RateLimitedObject):
    def __init__(self, realm: Realm) -> None:
        self.realm = realm
        super().__init__()

    @override
    def key(self) -> str:
        return f"{type(self).__name__}:{self.realm.string_id}"

    @override
    def rules(self) -> list[tuple[int, int]]:
        return settings.RATE_LIMITING_MIRROR_REALM_RULES


def rate_limit_mirror_by_realm(recipient_realm: Realm) -> None:
    ratelimited, secs_to_freedom = RateLimitedRealmMirror(recipient_realm).rate_limit()

    if ratelimited:
        raise RateLimitedError(secs_to_freedom)
```

--------------------------------------------------------------------------------

---[FILE: email_mirror_helpers.py]---
Location: zulip-main/zerver/lib/email_mirror_helpers.py
Signals: Django

```python
import re
from collections.abc import Callable
from typing import Any

from django.conf import settings
from django.utils.text import slugify

from zerver.models import ChannelEmailAddress, Stream, UserProfile


def default_option_handler_factory(address_option: str) -> Callable[[dict[str, Any]], None]:
    def option_setter(options_dict: dict[str, Any]) -> None:
        options_dict[address_option.replace("-", "_")] = True

    return option_setter


optional_address_tokens = {
    "show-sender": default_option_handler_factory("show-sender"),
    "include-footer": default_option_handler_factory("include-footer"),
    "include-quotes": default_option_handler_factory("include-quotes"),
    "prefer-text": lambda options: options.update(prefer_text=True),
    "prefer-html": lambda options: options.update(prefer_text=False),
}


class ZulipEmailForwardError(Exception):
    pass


class ZulipEmailForwardUserError(ZulipEmailForwardError):
    pass


def get_email_gateway_message_string_from_address(address: str) -> str:
    if settings.EMAIL_GATEWAY_PATTERN == "":
        raise ZulipEmailForwardError("This server is not configured for incoming email.")
    pattern_parts = [re.escape(part) for part in settings.EMAIL_GATEWAY_PATTERN.split("%s")]
    if settings.EMAIL_GATEWAY_EXTRA_PATTERN_HACK:
        # Accept mails delivered to any Zulip server
        pattern_parts[-1] = settings.EMAIL_GATEWAY_EXTRA_PATTERN_HACK
    match_email_re = re.compile(r"(.*?)".join(pattern_parts))
    match = match_email_re.match(address)

    if not match:
        raise ZulipEmailForwardError("Address not recognized by gateway.")
    msg_string = match.group(1)

    return msg_string


def get_channel_email_token(stream: Stream, *, creator: UserProfile, sender: UserProfile) -> str:
    channel_email_address, _created = ChannelEmailAddress.objects.get_or_create(
        realm=stream.realm,
        channel=stream,
        creator=creator,
        sender=sender,
    )
    return channel_email_address.email_token


def encode_email_address(name: str, email_token: str, show_sender: bool = False) -> str:
    # Some deployments may not use the email gateway
    if settings.EMAIL_GATEWAY_PATTERN == "":
        return ""

    # Given the fact that we have almost no restrictions on stream names and
    # that what characters are allowed in e-mail addresses is complicated and
    # dependent on context in the address, we opt for a simple scheme:
    # 1. Replace all substrings of non-alphanumeric characters with a single hyphen.
    # 2. Use Django's slugify to convert the resulting name to ascii.
    # 3. If the resulting name is shorter than the name we got in step 1,
    # it means some letters can't be reasonably turned to ascii and have to be dropped,
    # which would mangle the name, so we just skip the name part of the address.
    name = re.sub(r"\W+", "-", name)
    slug_name = slugify(name)
    encoded_name = slug_name if len(slug_name) == len(name) else ""

    # If encoded_name ends up empty, we just skip this part of the address:
    if encoded_name:
        encoded_token = f"{encoded_name}.{email_token}"
    else:
        encoded_token = email_token

    if show_sender:
        encoded_token += ".show-sender"

    return settings.EMAIL_GATEWAY_PATTERN % (encoded_token,)


def decode_email_address(email: str) -> tuple[str, dict[str, bool]]:
    # Perform the reverse of encode_email_address. Returns a tuple of
    # (email_token, options)
    msg_string = get_email_gateway_message_string_from_address(email)

    # Support both + and . as separators.  For background, the `+` is
    # more aesthetically pleasing, but because Google groups silently
    # drops the use of `+` in email addresses, which would completely
    # break the integration, we now favor `.` as the separator between
    # tokens in the email addresses we generate.
    #
    # We need to keep supporting `+` indefinitely for backwards
    # compatibility with older versions of Zulip that offered users
    # email addresses prioritizing using `+` for better aesthetics.
    msg_string = msg_string.replace(".", "+")

    parts = msg_string.split("+")
    options: dict[str, bool] = {}
    for part in parts:
        if part in optional_address_tokens:
            optional_address_tokens[part](options)

    remaining_parts = [part for part in parts if part not in optional_address_tokens]

    # There should be one or two parts left:
    # [stream_name, email_token] or just [email_token]
    if len(remaining_parts) == 1:
        token = remaining_parts[0]
    else:
        token = remaining_parts[1]

    return token, options
```

--------------------------------------------------------------------------------

---[FILE: email_mirror_server.py]---
Location: zulip-main/zerver/lib/email_mirror_server.py
Signals: Django

```python
import asyncio
import base64
import email
import grp
import logging
import os
import pwd
import signal
import smtplib
import socket
from collections.abc import Awaitable
from contextlib import suppress
from ssl import SSLContext, SSLError
from typing import Any

from aiosmtpd.controller import UnthreadedController
from aiosmtpd.handlers import Message as MessageHandler
from aiosmtpd.smtp import SMTP, Envelope, Session, TLSSetupException
from asgiref.sync import sync_to_async
from django.conf import settings
from django.core.mail import EmailMultiAlternatives as DjangoEmailMultiAlternatives
from typing_extensions import override

from version import ZULIP_VERSION
from zerver.lib.email_mirror import decode_stream_email_address, validate_to_address
from zerver.lib.email_mirror_helpers import (
    ZulipEmailForwardError,
    get_email_gateway_message_string_from_address,
)
from zerver.lib.exceptions import JsonableError, RateLimitedError
from zerver.lib.logging_util import log_to_file
from zerver.lib.queue import queue_json_publish_rollback_unsafe

# We add a file handler to this later, once we've dropped privileges
logger = logging.getLogger("zerver.lib.email_mirror")


def send_to_postmaster(msg: email.message.Message) -> None:
    # RFC5321 says:
    #   Any system that includes an SMTP server supporting mail relaying or
    #   delivery MUST support the reserved mailbox "postmaster" as a case-
    #   insensitive local name.  This postmaster address is not strictly
    #   necessary if the server always returns 554 on connection opening (as
    #   described in Section 3.1).  The requirement to accept mail for
    #   postmaster implies that RCPT commands that specify a mailbox for
    #   postmaster at any of the domains for which the SMTP server provides
    #   mail service, as well as the special case of "RCPT TO:<Postmaster>"
    #   (with no domain specification), MUST be supported.
    #
    # We forward such mail to the ZULIP_ADMINISTRATOR.
    mail = DjangoEmailMultiAlternatives(
        subject=f"Mail to postmaster: {msg['Subject']}",
        from_email=settings.NOREPLY_EMAIL_ADDRESS,
        to=[settings.ZULIP_ADMINISTRATOR],
    )
    mail.attach(None, msg, "message/rfc822")
    try:
        mail.send()
    except smtplib.SMTPResponseException as e:
        logger.exception(
            "Error sending bounce email to %s with error code %s: %s",
            mail.to,
            e.smtp_code,
            e.smtp_error,
            stack_info=True,
        )
    except smtplib.SMTPException as e:
        logger.exception("Error sending bounce email to %s: %s", mail.to, str(e), stack_info=True)


class ZulipMessageHandler(MessageHandler):
    def __init__(self) -> None:
        super().__init__(email.message.Message)

    async def handle_RCPT(
        self,
        server: SMTP,
        session: Session,
        envelope: Envelope,
        address: str,
        rcpt_options: list[str],
    ) -> str:
        # Rewrite all postmaster email addresses to just "postmaster"
        if address.lower() == "postmaster":
            envelope.rcpt_tos.append("postmaster")
            return "250 Continue"

        with suppress(ZulipEmailForwardError):
            if get_email_gateway_message_string_from_address(address).lower() == "postmaster":
                envelope.rcpt_tos.append("postmaster")
                return "250 Continue"

        try:
            # Attempt to do the ACL-check now, just to reject early.
            # The authoritative check is done in the worker, but we
            # wish to reject now if we can do so simply.
            await sync_to_async(validate_to_address)(address)

        except RateLimitedError:
            recipient_realm = await sync_to_async(
                lambda a: decode_stream_email_address(a)[0].realm
            )(address)
            logger.info(
                "Rejecting a MAIL FROM: %s to realm: %s via %s - rate limited.",
                envelope.mail_from,
                recipient_realm.string_id,
                str(session.peer),
            )
            return "550 4.7.0 Rate-limited due to too many emails on this realm."

        except ZulipEmailForwardError as e:
            return f"550 5.1.1 Bad destination mailbox address: {e}"

        except JsonableError as e:
            return f"550 5.7.1 Permission denied: {e}"

        envelope.rcpt_tos.append(address)
        return "250 Continue"

    @override
    def handle_message(self, message: email.message.Message) -> None:
        msg_base64 = base64.b64encode(bytes(message))

        logger.info(
            "Received email to %s, from %s via %s",
            message["X-RcptTo"],
            message["X-MailFrom"],
            message["X-Peer"],
        )
        for address in message["X-RcptTo"].split(", "):
            if address == "postmaster":
                send_to_postmaster(message)
            else:
                queue_json_publish_rollback_unsafe(
                    "email_mirror",
                    {
                        "rcpt_to": address,
                        "msg_base64": msg_base64.decode(),
                    },
                )

    async def handle_exception(self, error: Exception) -> str:
        if isinstance(error, TLSSetupException):  # nocoverage
            if isinstance(error.__cause__, SSLError):
                reason = error.__cause__.reason
            else:
                reason = str(error.__cause__)
            logger.debug("Dropping invalid TLS connection: %s", reason)
            return f"421 4.7.6 TLS error: {reason}"
        else:
            logger.exception("SMTP session exception")
            return "500 Server error"


class PermissionDroppingUnthreadedController(UnthreadedController):  # nocoverage
    @override
    def __init__(
        self,
        user: str | None = None,
        group: str | None = None,
        **kwargs: Any,
    ) -> None:
        super().__init__(**kwargs)

        # These may remain None in development, when elevated
        # privileges are not needed because a non-low port is chosen.
        self.user_id: int | None = None
        self.group_id: int | None = None
        if user is not None:
            self.user_id = pwd.getpwnam(user).pw_uid
        if group is not None:
            self.group_id = grp.getgrnam(group).gr_gid

    @override
    def _create_server(self) -> Awaitable[asyncio.AbstractServer]:
        # Make the listen socket, then drop privileges before starting
        # the server
        server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        server_socket.bind((self.hostname, self.port))
        if os.geteuid() == 0:
            assert self.user_id is not None
            assert self.group_id is not None
            # We may have a logfile owned by root, from before we
            # fixed it to be owned by zulip; chown it if it exists, so
            # we don't fail below.
            if os.path.exists(settings.EMAIL_MIRROR_LOG_PATH):
                os.chown(settings.EMAIL_MIRROR_LOG_PATH, self.user_id, self.group_id)

            logger.info("Dropping privileges to uid %d / gid %d", self.user_id, self.group_id)
            os.setgid(self.group_id)
            os.setuid(self.user_id)

        log_to_file(logger, settings.EMAIL_MIRROR_LOG_PATH)

        server = self.loop.create_server(
            self._factory_invoker,
            sock=server_socket,
            ssl=self.ssl_context,
        )

        return server


def run_smtp_server(
    user: str | None, group: str | None, host: str, port: int, tls_context: SSLContext | None
) -> None:  # nocoverage
    logger.info("Listening on %s:%d", host, port)
    server = PermissionDroppingUnthreadedController(
        user=user,
        group=group,
        hostname=host,
        port=port,
        handler=ZulipMessageHandler(),
        tls_context=tls_context,
        ident=f"Zulip Server {ZULIP_VERSION}",
    )

    server.loop.add_signal_handler(signal.SIGINT, server.loop.stop)

    server.begin()
    with suppress(KeyboardInterrupt):
        # The KeyboardInterrupt will exit the loop, but there's no
        # reason to throw a stacktrace rather than conduct an ordered
        # exit.
        server.loop.run_forever()

    server.end()
```

--------------------------------------------------------------------------------

````
