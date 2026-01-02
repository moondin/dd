---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 866
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 866 of 1290)

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

---[FILE: slack_message_conversion.py]---
Location: zulip-main/zerver/data_import/slack_message_conversion.py
Signals: Django

```python
import json
import re
from datetime import datetime, timezone
from itertools import zip_longest
from typing import Any, Literal, TypeAlias, TypedDict, cast

import regex
from django.core.exceptions import ValidationError
from requests.utils import requote_uri

from zerver.lib.timestamp import datetime_to_global_time
from zerver.lib.types import Validator
from zerver.lib.validator import (
    WildValue,
    check_dict,
    check_int,
    check_list,
    check_string,
    check_string_in,
    check_url,
    to_wild_value,
)

# stubs
ZerverFieldsT: TypeAlias = dict[str, Any]
SlackToZulipUserIDT: TypeAlias = dict[str, int]
AddedChannelsT: TypeAlias = dict[str, tuple[str, int]]
SlackFieldsT: TypeAlias = dict[str, Any]

# Slack link can be in the format <http://www.foo.com|www.foo.com> and <http://foo.com/>
LINK_REGEX = r"""
              (<)                                                              # match '>'
              (http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/|ftp:\/\/)?  # protocol and www
                  ([a-z0-9]+([\-\.]{1}[a-z0-9]+)*)(\.)                         # domain name
                      ([a-z]{2,63}(:[0-9]{1,5})?)                              # domain
                  (\/[^>]*)?                                                   # path
              (\|)?(?:\|([^>]+))?                                # char after pipe (for Slack links)
              (>)
              """

SLACK_MAILTO_REGEX = r"""
                      <((mailto:)?                     # match  `<mailto:`
                      ([\w\.-]+@[\w\.-]+(\.[\w]+)+))   # match email
                          (\|)?                        # match pipe
                      ([\w\.-]+@[\w\.-]+(\.[\w]+)+)?>  # match email
                      """

SLACK_USERMENTION_REGEX = r"""
                           (<@)                  # Start with '<@'
                               ([a-zA-Z0-9]+)    # Here we have the Slack id
                           (\|)?                 # We not always have a vertical line in mention
                               ([a-zA-Z0-9]+)?   # If vertical line is present, this is short name
                           (>)                   # ends with '>'
                           """
# Slack doesn't have mid-word message-formatting like Zulip.
# Hence, ~stri~ke doesn't format the word in Slack, but ~~stri~~ke
# formats the word in Zulip
SLACK_STRIKETHROUGH_REGEX = r"""
                             (
                                # Capture punctuation (\p{P}), white space (\p{Zs}),
                                # symbols (\p{S}) or newline.
                                # Skip ~ to not reformat the same string twice
                                # Skip @ and \
                                # Skip closing brackets & closing quote (\p{Pf}\p{Pe})
                                (?![~`@\\\p{Pf}\p{Pe}])
                                [\p{P}\p{Zs}\p{S}]|^
                             )
                             (\~)                                  # followed by a ~
                                 ([^~]+)                           # any character except ~
                             (\~)                                  # followed by a ~
                             (
                                # Capture punctuation, white space, symbols or end of
                                # line.
                                # Skip ~ to not reformat the same string twice
                                # Skip @ and \
                                # Skip opening brackets & opening quote (\p{Pi}\p{Ps})
                                (?![~`@\\\p{Pi}\p{Ps}])
                                (?=[\p{P}\p{Zs}\p{S}]|$)
                             )
                             """
SLACK_ITALIC_REGEX = r"""
                      # Same as `SLACK_STRIKETHROUGH_REGEX`s. The difference
                      # being, this skips _ instead of ~
                      (
                        (?![_`@\\\p{Pf}\p{Pe}])
                        [\p{P}\p{Zs}\p{S}]|^
                      )
                      (\_)
                          ([^_]+)                    # any character except _
                      (\_)
                      (
                        (?![_`@\\\p{Pi}\p{Ps}])
                        (?=[\p{P}\p{Zs}\p{S}]|$)
                      )
                      """
SLACK_BOLD_REGEX = r"""
                    # Same as `SLACK_STRIKETHROUGH_REGEX`s. The difference
                    # being, this skips * instead of ~
                    (
                        (?![*`@\\\p{Pf}\p{Pe}])
                        [\p{P}\p{Zs}\p{S}]|^
                    )
                    (\*)
                        ([^*]+)                       # any character except *
                    (\*)
                    (
                        (?![*`@\\\p{Pi}\p{Ps}])
                        (?=[\p{P}\p{Zs}\p{S}]|$)
                    )
                    """


def get_user_full_name(user: ZerverFieldsT) -> str:
    if "deleted" in user and user["deleted"] is False:
        return user["real_name"] or user["name"]
    elif user["is_mirror_dummy"]:
        return user["profile"].get("real_name", user["name"])
    else:
        return user["name"]


def get_zulip_mention_for_slack_user(
    slack_user_id: str | None,
    slack_user_shortname: str | None,
    users: list[ZerverFieldsT],
    silent: bool = False,
) -> str | None:
    if slack_user_id:
        for user in users:
            if user["id"] == slack_user_id and (
                slack_user_shortname is None or user["name"] == slack_user_shortname
            ):
                return ("@_**" if silent else "@**") + get_user_full_name(user) + "**"
    return None


def get_user_mentions(
    token: str,
    users: list[ZerverFieldsT],
    slack_user_id_to_zulip_user_id: SlackToZulipUserIDT,
) -> tuple[str, int | None]:
    slack_usermention_match = re.search(SLACK_USERMENTION_REGEX, token, re.VERBOSE)
    assert slack_usermention_match is not None
    short_name = slack_usermention_match.group(4)
    slack_id = slack_usermention_match.group(2)
    zulip_mention = get_zulip_mention_for_slack_user(slack_id, short_name, users)
    if zulip_mention is not None:
        token = re.sub(SLACK_USERMENTION_REGEX, zulip_mention, token, flags=re.VERBOSE)
        user_id = slack_user_id_to_zulip_user_id[slack_id]
        return token, user_id
    return token, None


def convert_link_format(text: str) -> tuple[str, bool]:
    """
    1. Converts '<https://foo.com>' to 'https://foo.com'
    2. Converts '<https://foo.com|foo>' to '[foo](https://foo.com)'
    """
    has_link = False
    for match in re.finditer(LINK_REGEX, text, re.VERBOSE):
        slack_url = match.group(0)
        url_parts = slack_url[1:-1].split("|", maxsplit=1)
        # Check if there's a pipe with text after it
        if len(url_parts) == 2:
            converted_url = f"[{url_parts[1]}]({url_parts[0]})"
        else:
            converted_url = url_parts[0]

        has_link = True
        text = text.replace(slack_url, converted_url)
    return text, has_link


def convert_mailto_format(text: str) -> tuple[str, bool]:
    """
    1. Converts '<mailto:foo@foo.com>' to 'mailto:foo@foo.com'
    2. Converts '<mailto:foo@foo.com|foo@foo.com>' to 'mailto:foo@foo.com'
    """
    has_link = False
    for match in re.finditer(SLACK_MAILTO_REGEX, text, re.VERBOSE):
        has_link = True
        text = text.replace(match.group(0), match.group(1))
    return text, has_link


# Map italic, bold and strikethrough Markdown
def convert_markdown_syntax(text: str, pattern: str, zulip_keyword: str) -> str:
    """
    Returns:
    1. For strikethrough formatting: This maps Slack's '~strike~' to Zulip's '~~strike~~'
    2. For bold formatting: This maps Slack's '*bold*' to Zulip's '**bold**'
    3. For italic formatting: This maps Slack's '_italic_' to Zulip's '*italic*'
    """

    def replace_slack_format(match: regex.Match[str]) -> str:
        return match.group(1) + zulip_keyword + match.group(3) + zulip_keyword

    return regex.sub(pattern, replace_slack_format, text, flags=re.VERBOSE | re.MULTILINE)


def convert_slack_workspace_mentions(text: str) -> str:
    # Map Slack's '<!everyone>', '<!channel>' and '<!here>'
    # mentions to Zulip's '@**all**' wildcard mention.
    # No regex for these as they can be present anywhere
    # in the sentence.
    text = text.replace("<!everyone>", "@**all**")
    text = text.replace("<!channel>", "@**all**")
    text = text.replace("<!here>", "@**all**")
    return text


def convert_slack_formatting(text: str) -> str:
    text = convert_markdown_syntax(text, SLACK_BOLD_REGEX, "**")
    text = convert_markdown_syntax(text, SLACK_STRIKETHROUGH_REGEX, "~~")
    text = convert_markdown_syntax(text, SLACK_ITALIC_REGEX, "*")
    return text


# Markdown mapping
def convert_to_zulip_markdown(
    text: str,
    users: list[ZerverFieldsT],
    added_channels: AddedChannelsT,
    slack_user_id_to_zulip_user_id: SlackToZulipUserIDT,
) -> tuple[str, list[int], bool]:
    mentioned_users_id = []
    text = convert_slack_formatting(text)
    text = convert_slack_workspace_mentions(text)

    # Map Slack channel mention: '<#C5Z73A7RA|general>' to '#**general**'
    for cname, ids in added_channels.items():
        cid = ids[0]
        text = text.replace(f"<#{cid}|{cname}>", "#**" + cname + "**")

    tokens = text.split(" ")
    for iterator in range(len(tokens)):
        # Check user mentions and change mention format from
        # '<@slack_id|short_name>' to '@**full_name**'
        if re.findall(SLACK_USERMENTION_REGEX, tokens[iterator], re.VERBOSE):
            tokens[iterator], user_id = get_user_mentions(
                tokens[iterator], users, slack_user_id_to_zulip_user_id
            )
            if user_id is not None:
                mentioned_users_id.append(user_id)

    text = " ".join(tokens)

    # Check and convert link format
    text, has_link = convert_link_format(text)
    # convert `<mailto:foo@foo.com>` to `mailto:foo@foo.com`
    text, has_mailto_link = convert_mailto_format(text)

    message_has_link = has_link or has_mailto_link

    return text, mentioned_users_id, message_has_link


def render_block(block: WildValue) -> str:
    # https://api.slack.com/reference/block-kit/blocks
    block_type = block["type"].tame(
        check_string_in(
            [
                "actions",
                "context",
                "call",
                "contact_card",
                "condition",
                "divider",
                "file",
                "header",
                "image",
                "input",
                "section",
                "table",
                "rich_text",
            ]
        )
    )

    unhandled_types = [
        # `call` is a block type we've observed in the wild in a Slack export,
        # despite not being documented in
        # https://docs.slack.dev/reference/block-kit/blocks/
        # It likes maps to a request for a Slack call. If we can verify that,
        # probably it would be worth replacing with a string indicating a Slack
        # call occurred.
        "call",
        "contact_card",
        "file",
        "table",
        # The "actions" block is used to format literal in-message clickable
        # buttons and similar elements, which Zulip currently doesn't support.
        # https://docs.slack.dev/reference/block-kit/blocks/actions-block
        "actions",
        # All user-sent messages contain at least a "block" component with a
        # "rich_text" block. This block contains the same string as the "text"
        # field. We're skipping this because the Slack import tool already
        # handles the "text" field and the Slack incoming integration
        # overrides it.
        # https://docs.slack.dev/reference/block-kit/blocks/rich-text-block/
        "rich_text",
    ]
    if block_type in unhandled_types:
        return ""
    elif block_type == "context" and block.get("elements"):
        pieces = []
        # Slack renders these pieces left-to-right, packed in as
        # closely as possible.  We just render them above each other,
        # for simplicity.
        for element in block["elements"]:
            element_type = element["type"].tame(check_string_in(["image", "plain_text", "mrkdwn"]))
            if element_type == "image":
                pieces.append(render_block_element(element))
            else:
                pieces.append(element.tame(check_text_block())["text"])
        return "\n\n".join(piece.strip() for piece in pieces if piece.strip() != "")
    elif block_type == "divider":
        return "----"
    elif block_type == "header":
        return "## " + block["text"].tame(check_text_block(plain_text_only=True))["text"]
    elif block_type == "image":
        image_url = block["image_url"].tame(check_url)
        alt_text = block["alt_text"].tame(check_string)
        if "title" in block:
            alt_text = block["title"].tame(check_text_block(plain_text_only=True))["text"]
        return f"[{alt_text}]({image_url})"
    elif block_type == "input":
        # Unhandled
        pass
    elif block_type == "section":
        pieces = []
        if "text" in block:
            pieces.append(block["text"].tame(check_text_block())["text"])

        if "accessory" in block:
            pieces.append(render_block_element(block["accessory"]))

        if "fields" in block:
            fields = block["fields"].tame(check_list(check_text_block()))
            if len(fields) == 1:
                # Special-case a single field to display a bit more
                # nicely, without extraneous borders and limitations
                # on its contents.
                pieces.append(fields[0]["text"])
            else:
                # It is not possible to have newlines in a table, nor
                # escape the pipes that make it up; replace them with
                # whitespace.
                field_text = [f["text"].replace("\n", " ").replace("|", " ") for f in fields]
                # Because Slack formats this as two columns, but not
                # necessarily a table with a bold header, we emit a
                # blank header row first.
                table = "| | |\n|-|-|\n"
                # Then take the fields two-at-a-time to make the table
                iters = [iter(field_text)] * 2
                for left, right in zip_longest(*iters, fillvalue=""):
                    table += f"| {left} | {right} |\n"
                pieces.append(table)

        return "\n\n".join(piece.strip() for piece in pieces if piece.strip() != "")

    return ""


class TextField(TypedDict):
    text: str
    type: Literal["plain_text", "mrkdwn"]


def check_text_block(plain_text_only: bool = False) -> Validator[TextField]:
    if plain_text_only:
        type_validator = check_string_in(["plain_text"])
    else:
        type_validator = check_string_in(["plain_text", "mrkdwn"])

    def f(var_name: str, val: object) -> TextField:
        block = check_dict(
            [
                ("type", type_validator),
                ("text", check_string),
            ],
        )(var_name, val)

        return cast(TextField, block)

    return f


def render_block_element(element: WildValue) -> str:
    # https://api.slack.com/reference/block-kit/block-elements
    # Zulip doesn't support interactive elements, so we only render images here
    element_type = element["type"].tame(check_string)
    if element_type == "image":
        image_url = element["image_url"].tame(check_url)
        alt_text = element["alt_text"].tame(check_string)
        return f"[{alt_text}]({image_url})"
    else:
        # Unsupported
        return ""


def render_attachment(attachment: WildValue) -> str:
    # https://api.slack.com/reference/messaging/attachments
    # Slack recommends the usage of "blocks" even within attachments; the
    # rest of the fields we handle here are legacy fields. These fields are
    # optional and may contain null values.
    pieces = []
    if attachment.get("title"):
        title = attachment["title"].tame(check_string)
        if attachment.get("title_link"):
            title_link = attachment["title_link"].tame(check_url)
            pieces.append(f"## [{title}]({title_link})")
        else:
            pieces.append(f"## {title}")
    if attachment.get("pretext"):
        pieces.append(attachment["pretext"].tame(check_string))
    if attachment.get("text"):
        pieces.append(attachment["text"].tame(check_string))
    if "fields" in attachment:
        fields = []
        for field in attachment["fields"]:
            if "title" in field and "value" in field and field["title"] and field["value"]:
                title = field["title"].tame(check_string)
                value = field["value"].tame(check_string)
                fields.append(f"*{title}*: {value}")
            elif field.get("title"):
                title = field["title"].tame(check_string)
                fields.append(f"*{title}*")
            elif field.get("value"):
                value = field["value"].tame(check_string)
                fields.append(f"{value}")
        pieces.append("\n".join(fields))
    if attachment.get("blocks"):
        pieces += map(render_block, attachment["blocks"])
    if image_url_wv := attachment.get("image_url"):
        try:
            image_url = image_url_wv.tame(check_url)
        except ValidationError:  # nocoverage
            image_url = image_url_wv.tame(check_string)
            image_url = requote_uri(image_url)
        pieces.append(f"[]({image_url})")
    if attachment.get("footer"):
        pieces.append(attachment["footer"].tame(check_string))
    if attachment.get("ts"):
        try:
            time = attachment["ts"].tame(check_int)
        except ValidationError as e:  # nocoverage
            # In some cases Slack has the ts as a string with a float
            # number. The reason is unknown, but we've observed it
            # in the wild several times.
            ts = attachment["ts"].tame(check_string)
            try:
                ts_float = float(ts)
            except ValueError:
                raise e

            time = int(ts_float)
        pieces.append(datetime_to_global_time(datetime.fromtimestamp(time, timezone.utc)))

    return "\n\n".join(piece.strip() for piece in pieces if piece.strip() != "")


def replace_links(text: str) -> str:
    text, _ = convert_link_format(text)
    text, _ = convert_mailto_format(text)
    return text


def process_slack_block_and_attachment(message: ZerverFieldsT) -> str:
    slack_message: WildValue = to_wild_value("slack_message", json.dumps(message))
    pieces: list[str] = []

    if slack_message.get("blocks"):
        pieces += map(render_block, slack_message["blocks"])

    if slack_message.get("attachments"):
        pieces += map(render_attachment, slack_message["attachments"])
    return "\n".join(piece.strip() for piece in pieces if piece.strip() != "")
```

--------------------------------------------------------------------------------

---[FILE: user_handler.py]---
Location: zulip-main/zerver/data_import/user_handler.py

```python
from typing import Any

from zerver.data_import.import_util import validate_user_emails_for_import


class UserHandler:
    """
    Our UserHandler class is a glorified wrapper
    around the data that eventually goes into
    zerver_userprofile.

    The class helps us do things like map ids
    to names for mentions.
    """

    def __init__(self) -> None:
        self.id_to_user_map: dict[int, dict[str, Any]] = {}

    def add_user(self, user: dict[str, Any]) -> None:
        user_id = user["id"]
        self.id_to_user_map[user_id] = user

    def get_user(self, user_id: int) -> dict[str, Any]:
        user = self.id_to_user_map[user_id]
        return user

    def get_all_users(self) -> list[dict[str, Any]]:
        users = list(self.id_to_user_map.values())
        return users

    def validate_user_emails(self) -> None:
        all_users = self.get_all_users()
        validate_user_emails_for_import([user["delivery_email"] for user in all_users])
```

--------------------------------------------------------------------------------

---[FILE: addressee.py]---
Location: zulip-main/zerver/lib/addressee.py
Signals: Django

```python
from collections.abc import Iterable, Sequence
from typing import cast

from django.utils.translation import gettext as _

from zerver.lib.exceptions import JsonableError
from zerver.lib.string_validation import check_stream_topic
from zerver.lib.topic import (
    maybe_rename_general_chat_to_empty_topic,
    maybe_rename_no_topic_to_empty_topic,
)
from zerver.models import Realm, Stream, UserProfile
from zerver.models.users import (
    get_user_by_id_in_realm_including_cross_realm,
    get_user_including_cross_realm,
)


def get_user_profiles(emails: Iterable[str], realm: Realm) -> list[UserProfile]:
    user_profiles: list[UserProfile] = []
    for email in emails:
        try:
            user_profile = get_user_including_cross_realm(email, realm)
        except UserProfile.DoesNotExist:
            raise JsonableError(_("Invalid email '{email}'").format(email=email))
        user_profiles.append(user_profile)
    return user_profiles


def get_user_profiles_by_ids(user_ids: Iterable[int], realm: Realm) -> list[UserProfile]:
    user_profiles: list[UserProfile] = []
    for user_id in user_ids:
        try:
            user_profile = get_user_by_id_in_realm_including_cross_realm(user_id, realm)
        except UserProfile.DoesNotExist:
            raise JsonableError(_("Invalid user ID {user_id}").format(user_id=user_id))
        user_profiles.append(user_profile)
    return user_profiles


class Addressee:
    # This is really just a holder for vars that tended to be passed
    # around in a non-type-safe way before this class was introduced.
    #
    # It also avoids some nonsense where you have to think about whether
    # topic should be None or '' for a direct message, or you have to
    # make an array of one stream.
    #
    # Eventually we can use this to cache Stream and UserProfile objects
    # in memory.
    #
    # This should be treated as an immutable class.
    def __init__(
        self,
        msg_type: str,
        user_profiles: Sequence[UserProfile] | None = None,
        stream: Stream | None = None,
        stream_name: str | None = None,
        stream_id: int | None = None,
        topic_name: str | None = None,
    ) -> None:
        assert msg_type in ["stream", "private"]
        if msg_type == "stream" and topic_name is None:
            raise JsonableError(_("Missing topic"))
        self._msg_type = msg_type
        self._user_profiles = user_profiles
        self._stream = stream
        self._stream_name = stream_name
        self._stream_id = stream_id
        self._topic_name = topic_name

    def is_stream(self) -> bool:
        return self._msg_type == "stream"

    def is_private(self) -> bool:
        return self._msg_type == "private"

    def user_profiles(self) -> Sequence[UserProfile]:
        assert self.is_private()
        assert self._user_profiles is not None
        return self._user_profiles

    def stream(self) -> Stream | None:
        assert self.is_stream()
        return self._stream

    def stream_name(self) -> str | None:
        assert self.is_stream()
        return self._stream_name

    def stream_id(self) -> int | None:
        assert self.is_stream()
        return self._stream_id

    def topic_name(self) -> str:
        assert self.is_stream()
        assert self._topic_name is not None
        return self._topic_name

    def is_message_to_self(self, sender: UserProfile) -> bool:
        return (
            self.is_private()
            and len(self.user_profiles()) == 1
            and self.user_profiles()[0].id == sender.id
        )

    @staticmethod
    def legacy_build(
        sender: UserProfile,
        recipient_type_name: str,
        message_to: Sequence[int] | Sequence[str],
        topic_name: str | None,
        realm: Realm | None = None,
    ) -> "Addressee":
        # For legacy reason message_to used to be either a list of
        # emails or a list of streams.  We haven't fixed all of our
        # callers yet.
        if realm is None:
            realm = sender.realm

        if recipient_type_name == "stream":
            if len(message_to) > 1:
                raise JsonableError(_("Cannot send to multiple channels"))

            if message_to:
                stream_name_or_id = message_to[0]
            else:
                # This is a hack to deal with the fact that we still support
                # default streams (and the None will be converted later in the
                # call path).
                if sender.default_sending_stream_id:
                    # Use the user's default stream
                    stream_name_or_id = sender.default_sending_stream_id
                else:
                    raise JsonableError(_("Missing channel"))

            if topic_name is None:
                raise JsonableError(_("Missing topic"))

            if isinstance(stream_name_or_id, int):
                return Addressee.for_stream_id(stream_name_or_id, topic_name)

            return Addressee.for_stream_name(stream_name_or_id, topic_name)
        elif recipient_type_name == "private":
            if not message_to:
                raise JsonableError(_("Message must have recipients"))

            if isinstance(message_to[0], str):
                emails = cast(Sequence[str], message_to)
                return Addressee.for_private(emails, realm)
            elif isinstance(message_to[0], int):
                user_ids = cast(Sequence[int], message_to)
                return Addressee.for_user_ids(user_ids=user_ids, realm=realm)
        else:
            raise JsonableError(_("Invalid message type"))

    @staticmethod
    def for_stream(stream: Stream, topic_name: str) -> "Addressee":
        topic_name = topic_name.strip()
        topic_name = maybe_rename_general_chat_to_empty_topic(topic_name)
        topic_name = maybe_rename_no_topic_to_empty_topic(topic_name)
        check_stream_topic(topic_name)
        return Addressee(
            msg_type="stream",
            stream=stream,
            topic_name=topic_name,
        )

    @staticmethod
    def for_stream_name(stream_name: str, topic_name: str) -> "Addressee":
        topic_name = topic_name.strip()
        topic_name = maybe_rename_general_chat_to_empty_topic(topic_name)
        topic_name = maybe_rename_no_topic_to_empty_topic(topic_name)
        check_stream_topic(topic_name)
        return Addressee(
            msg_type="stream",
            stream_name=stream_name,
            topic_name=topic_name,
        )

    @staticmethod
    def for_stream_id(stream_id: int, topic_name: str) -> "Addressee":
        topic_name = topic_name.strip()
        topic_name = maybe_rename_general_chat_to_empty_topic(topic_name)
        topic_name = maybe_rename_no_topic_to_empty_topic(topic_name)
        check_stream_topic(topic_name)
        return Addressee(
            msg_type="stream",
            stream_id=stream_id,
            topic_name=topic_name,
        )

    @staticmethod
    def for_private(emails: Sequence[str], realm: Realm) -> "Addressee":
        assert len(emails) > 0
        user_profiles = get_user_profiles(emails, realm)
        return Addressee(
            msg_type="private",
            user_profiles=user_profiles,
        )

    @staticmethod
    def for_user_ids(user_ids: Sequence[int], realm: Realm) -> "Addressee":
        assert len(user_ids) > 0
        user_profiles = get_user_profiles_by_ids(user_ids, realm)
        return Addressee(
            msg_type="private",
            user_profiles=user_profiles,
        )

    @staticmethod
    def for_user_profile(user_profile: UserProfile) -> "Addressee":
        user_profiles = [user_profile]
        return Addressee(
            msg_type="private",
            user_profiles=user_profiles,
        )

    @staticmethod
    def for_user_profiles(user_profiles: Sequence[UserProfile]) -> "Addressee":
        assert len(user_profiles) > 0
        return Addressee(
            msg_type="private",
            user_profiles=user_profiles,
        )
```

--------------------------------------------------------------------------------

---[FILE: alert_words.py]---
Location: zulip-main/zerver/lib/alert_words.py
Signals: Django

```python
from collections.abc import Iterable

import ahocorasick
from django.db import transaction

from zerver.lib.cache import (
    cache_with_key,
    realm_alert_words_automaton_cache_key,
    realm_alert_words_cache_key,
)
from zerver.models import AlertWord, Realm, UserProfile
from zerver.models.alert_words import flush_realm_alert_words


@cache_with_key(lambda realm: realm_alert_words_cache_key(realm.id), timeout=3600 * 24)
def alert_words_in_realm(realm: Realm) -> dict[int, list[str]]:
    user_ids_and_words = AlertWord.objects.filter(realm=realm, user_profile__is_active=True).values(
        "user_profile_id", "word"
    )
    user_ids_with_words: dict[int, list[str]] = {}
    for id_and_word in user_ids_and_words:
        user_ids_with_words.setdefault(id_and_word["user_profile_id"], [])
        user_ids_with_words[id_and_word["user_profile_id"]].append(id_and_word["word"])
    return user_ids_with_words


@cache_with_key(lambda realm: realm_alert_words_automaton_cache_key(realm.id), timeout=3600 * 24)
def get_alert_word_automaton(realm: Realm) -> ahocorasick.Automaton:
    user_id_with_words = alert_words_in_realm(realm)
    alert_word_automaton = ahocorasick.Automaton()
    for user_id, alert_words in user_id_with_words.items():
        for alert_word in alert_words:
            alert_word_lower = alert_word.lower()
            if alert_word_automaton.exists(alert_word_lower):
                (_key, user_ids_for_alert_word) = alert_word_automaton.get(alert_word_lower)
                user_ids_for_alert_word.add(user_id)
            else:
                alert_word_automaton.add_word(alert_word_lower, (alert_word_lower, {user_id}))
    alert_word_automaton.make_automaton()
    # If the kind is not AHOCORASICK after calling make_automaton, it means there is no key present
    # and hence we cannot call items on the automaton yet. To avoid it we return None for such cases
    # where there is no alert-words in the realm.
    # https://pyahocorasick.readthedocs.io/en/latest/#make-automaton
    if alert_word_automaton.kind != ahocorasick.AHOCORASICK:
        return None
    return alert_word_automaton


def user_alert_words(user_profile: UserProfile) -> list[str]:
    return list(AlertWord.objects.filter(user_profile=user_profile).values_list("word", flat=True))


@transaction.atomic(savepoint=False)
def add_user_alert_words(user_profile: UserProfile, new_words: Iterable[str]) -> list[str]:
    existing_words_lower = {word.lower() for word in user_alert_words(user_profile)}

    # Keeping the case, use a dictionary to get the set of
    # case-insensitive distinct, new alert words
    word_dict: dict[str, str] = {}
    for word in new_words:
        if word.lower() in existing_words_lower:
            continue
        word_dict[word.lower()] = word

    AlertWord.objects.bulk_create(
        AlertWord(user_profile=user_profile, word=word, realm=user_profile.realm)
        for word in word_dict.values()
    )
    # Django bulk_create operations don't flush caches, so we need to do this ourselves.
    flush_realm_alert_words(user_profile.realm_id)

    return user_alert_words(user_profile)


@transaction.atomic(savepoint=False)
def remove_user_alert_words(user_profile: UserProfile, delete_words: Iterable[str]) -> list[str]:
    # TODO: Ideally, this would be a bulk query, but Django doesn't have a `__iexact`.
    # We can clean this up if/when PostgreSQL has more native support for case-insensitive fields.
    # If we turn this into a bulk operation, we will need to call flush_realm_alert_words() here.
    for delete_word in delete_words:
        AlertWord.objects.filter(user_profile=user_profile, word__iexact=delete_word).delete()
    return user_alert_words(user_profile)
```

--------------------------------------------------------------------------------

---[FILE: async_utils.py]---
Location: zulip-main/zerver/lib/async_utils.py
Signals: Django

```python
import asyncio

from typing_extensions import override


class NoAutoCreateEventLoopPolicy(asyncio.DefaultEventLoopPolicy):
    """
    By default asyncio.get_event_loop() automatically creates an event
    loop for the main thread if one isn't currently installed.  Since
    Django intentionally uninstalls the event loop within
    sync_to_async, that autocreation proliferates confusing extra
    event loops that will never be run.  It is also deprecated in
    Python 3.10.  This policy disables it so we don't rely on it by
    accident.
    """

    @override
    def get_event_loop(self) -> asyncio.AbstractEventLoop:  # nocoverage
        return asyncio.get_running_loop()
```

--------------------------------------------------------------------------------

````
