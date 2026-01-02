---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 553
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 553 of 1290)

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

---[FILE: update-for-legacy-translations]---
Location: zulip-main/tools/i18n/update-for-legacy-translations

```text
#!/usr/bin/env python3
import glob
import os
import re
from subprocess import check_output

import orjson

LEGACY_STRINGS_MAP = {
    "<p>You are searching for messages that belong to more than one channel, which is not possible.</p>": "<p>You are searching for messages that belong to more than one stream, which is not possible.</p>",
    "<strong>{name}</strong> <i>(guest)</i> is not subscribed to this channel. They will not be notified if you mention them.": "<strong>{name}</strong> <i>(guest)</i> is not subscribed to this stream. They will not be notified if you mention them.",
    "<strong>{name}</strong> <i>(guest)</i> is not subscribed to this channel. They will not be notified unless you subscribe them.": "<strong>{name}</strong> <i>(guest)</i> is not subscribed to this stream. They will not be notified unless you subscribe them.",
    "<strong>{name}</strong> is not subscribed to this channel. They will not be notified if you mention them.": "<strong>{name}</strong> is not subscribed to this stream. They will not be notified if you mention them.",
    "<strong>{name}</strong> is not subscribed to this channel. They will not be notified unless you subscribe them.": "<strong>{name}</strong> is not subscribed to this stream. They will not be notified unless you subscribe them.",
    "<z-link>Click here</z-link> to learn about exporting private channels and direct messages.": "<z-link>Click here</z-link> to learn about exporting private streams and direct messages.",
    "<z-user></z-user> will have the same properties as it did prior to deactivation, including role, owner and channel subscriptions.": "<z-user></z-user> will have the same properties as it did prior to deactivation, including role, owner and stream subscriptions.",
    "<z-user></z-user> will have the same role, channel subscriptions, user group memberships, and other settings and permissions as they did prior to deactivation.": "<z-user></z-user> will have the same role, stream subscriptions, user group memberships, and other settings and permissions as they did prior to deactivation.",
    "A channel with this name already exists.": "A stream with this name already exists.",
    "Add default channels": "Add default streams",
    "Add members. Use usergroup or #channelname to bulk add members.": "Add members. Use usergroup or #streamname to bulk add members.",
    "Add channel": "Add stream",
    "Add channels": "Add streams",
    "Add subscribers. Use usergroup or #channelname to bulk add subscribers.": "Add subscribers. Use usergroup or #streamname to bulk add subscribers.",
    "All messages including muted channels": "All messages including muted streams",
    "All channels": "All streams",
    "Allow creating web-public streams (visible to anyone on the Internet)": "Allow creating web-public streams (visible to anyone on the Internet)",
    # "Already subscribed to {channel}": "Already subscribed to {stream}",
    "Announce new channel in": "Announce new stream in",
    "Archive channel": "Archive stream",
    "Archiving channel <z-stream></z-stream> will immediately unsubscribe everyone. This action cannot be undone.": "Archiving stream <z-stream></z-stream> will immediately unsubscribe everyone. This action cannot be undone.",
    "Archiving this channel will also disable settings that were configured to use this channel:": "Archiving this stream will also disable settings that were configured to use this stream:",
    # "Are you sure you want to create channel ''''{channel_name}'''' and subscribe {count} users to it?": "Are you sure you want to create stream ''''{stream_name}'''' and subscribe {count} users to it?",
    # "Are you sure you want to send @-mention notifications to the <strong>{subscriber_count}</strong> users subscribed to #{channel_name}? If not, please edit your message to remove the <strong>@{wildcard_mention}</strong> mention.": "Are you sure you want to send @-mention notifications to the <strong>{subscriber_count}</strong> users subscribed to #{stream_name}? If not, please edit your message to remove the <strong>@{stream_wildcard_mention}</strong> mention.",
    "Automatically unmute topics in muted channels": "Automatically unmute topics in muted streams",
    "Back to channels": "Back to streams",
    "Because you are removing the last subscriber from a private channel, it will be automatically <z-link>archived</z-link>.": "Because you are removing the last subscriber from a private stream, it will be automatically <z-link>archived</z-link>.",
    "Because you are the only subscriber, this channel will be automatically <z-link>archived</z-link>.": "Because you are the only subscriber, this stream will be automatically <z-link>archived</z-link>.",
    "Browse 1 more channel": "Browse 1 more stream",
    "Browse channels": "Browse streams",
    "Browse {can_subscribe_stream_count} more channels": "Browse {can_subscribe_stream_count} more streams",
    "Cannot subscribe to private channel <z-stream></z-stream>": "Cannot subscribe to private stream <z-stream></z-stream>",
    "Cannot view channel": "Cannot view stream",
    "Choose a name for the new channel.": "Choose a name for the new stream.",
    "Configure how Zulip notifies you about new messages. In muted channels, channel notification settings apply only to unmuted topics.": "Configure how Zulip notifies you about new messages. In muted streams, stream notification settings apply only to unmuted topics.",
    "Configure the default channels new users are subscribed to when joining your organization.": "Configure the default streams new users are subscribed to when joining your organization.",
    "Consider <z-link>searching all public channels</z-link>.": "Consider <z-link>searching all public streams</z-link>.",
    "Create a channel": "Create a stream",
    "Create new channel": "Create new stream",
    "Create channel": "Create stream",
    "Creating channel...": "Creating stream...",
    "Currently viewing the entire channel.": "Currently viewing the entire stream.",
    "Cycle between channel views": "Cycle between stream views",
    "Default for channel": "Default for stream",
    "Default channels": "Default streams",
    "Default channels for new users cannot be made private.": "Default streams for new users cannot be made private.",
    "Default channels for this organization": "Default streams for this organization",
    "Demote inactive channels": "Demote inactive streams",
    # "Edit #{channel_name}": "Edit #{stream_name}",
    "Edit channel name and description": "Edit stream name and description",
    "Error creating channel": "Error creating stream",
    # "Error in unsubscribing from #{channel_name}": "Error in unsubscribing from #{stream_name}",
    # "Error removing user from #{channel_name}": "Error removing user from #{stream_name}",
    "Error removing user from this channel.": "Error removing user from this stream.",
    "Exports all users, settings, and all data visible in public channels.": "Exports all users, settings, and all data visible in public streams.",
    "Failed adding one or more channels.": "Failed adding one or more streams.",
    "Filter default channels": "Filter default streams",
    "Filter channels": "Filter streams",
    "First time? Read our <z-link>guidelines</z-link> for creating and naming channels.": "First time? Read our <z-link>guidelines</z-link> for creating and naming streams.",
    "Generate channel email address": "Generate stream email address",
    "Go to channel from topic view": "Go to stream from topic view",
    "Go to channel settings": "Go to stream settings",
    "However, it will no longer be subscribed to the private channels that you are not subscribed to.": "However, it will no longer be subscribed to the private streams that you are not subscribed to.",
    "In muted channels, channel notification settings apply only to unmuted topics.": "In muted streams, stream notification settings apply only to unmuted topics.",
    "In this channel": "In this stream",
    "Includes muted channels and topics": "Includes muted streams and topics",
    "Invalid channel ID": "Invalid stream ID",
    "Let recipients see when I'm typing messages in channels": "Let recipients see when I'm typing messages in streams",
    "Let recipients see when a user is typing channel messages": "Let recipients see when a user is typing stream messages",
    "Log in to browse more channels": "Log in to browse more streams",
    # "Message #{channel_name}": "Message #{stream_name}",
    # "Message #{channel_name} > {topic_name}": "Message #{stream_name} > {topic_name}",
    "Messages in all public channels": "Messages in all public streams",
    "Mute channel": "Mute stream",
    "Narrow to messages on channel <z-value></z-value>.": "Narrow to messages on stream <z-value></z-value>.",
    "New channel announcements": "New stream announcements",
    "New channel message": "New stream message",
    "New channel notifications": "New stream notifications",
    "No default channels match your current filter.": "No default streams match your current filter.",
    "No matching channels": "No matching streams",
    "No channel subscribers match your current filter.": "No stream subscribers match your current filter.",
    "No channel subscriptions.": "No stream subscriptions.",
    "No channels": "No streams",
    "Notify channel": "Notify stream",
    # "Now following <z-link>{channel_topic}</z-link>.": "Now following <z-link>{stream_topic}</z-link>.",
    "Once you leave this channel, you will not be able to rejoin.": "Once you leave this stream, you will not be able to rejoin.",
    "Only channel members can add users to a private channel.": "Only stream members can add users to a private stream.",
    "Only subscribers can access or join private channels, so you will lose access to this channel if you convert it to a private channel while not subscribed to it.": "Only subscribers can access or join private streams, so you will lose access to this stream if you convert it to a private stream while not subscribed to it.",
    "Only subscribers to this channel can edit channel permissions.": "Only subscribers to this stream can edit stream permissions.",
    "Pin channel to top": "Pin stream to top",
    "Pin channel to top of left sidebar": "Pin stream to top of left sidebar",
    "Please select a channel.": "Please specify a stream.",
    "Private channels cannot be default channels for new users.": "Private streams cannot be default streams for new users.",
    "Receives new channel announcements": "Receives new stream announcements",
    "Require topics in channel messages": "Require topics in stream messages",
    "CHANNELS": "STREAMS",
    "Scroll through channels": "Scroll through streams",
    "Search all public channels in the organization.": "Search all public streams in the organization.",
    "Select a channel": "Select a stream",
    "Select a channel below or change topic name.": "Select a stream below or change topic name.",
    "Select a channel to subscribe": "Select a stream to subscribe",
    "Select channel": "Select stream",
    "Channel": "Stream",
    "Channel <b><z-stream></z-stream></b> created!": "Stream <b><z-stream></z-stream></b> created!",
    "Channel ID": "Stream ID",
    "Channel color": "Stream color",
    "Channel created recently": "Stream created recently",
    "Channel creation": "Stream creation",
    "Channel description": "Stream description",
    "Channel details": "Stream details",
    "Channel email address:": "Stream email address:",
    "Channel name": "Stream name",
    "Channel permissions": "Stream permissions",
    "Channel settings": "Stream settings",
    "Channel successfully created!": "Stream successfully created!",
    "Channels": "Streams",
    "Channels they should join": "Streams they should join",
    "Subscribe to/unsubscribe from selected channel": "Subscribe to/unsubscribe from selected stream",
    "Subscribe {full_name} to channels": "Subscribe {full_name} to streams",
    "Subscribed channels": "Subscribed streams",
    # "The channel <b>#{channel_name}</b> does not exist. Manage your subscriptions <z-link>on your Channels page</z-link>.": "The stream <b>#{stream_name}</b> does not exist. Manage your subscriptions <z-link>on your Streams page</z-link>.",
    "The channel description cannot contain newline characters.": "The stream description cannot contain newline characters.",
    "The topic <strong>{topic_name}</strong> already exists in this channel. Are you sure you want to combine messages from these topics? This cannot be undone.": "The topic <strong>{topic_name}</strong> already exists in this stream. Are you sure you want to combine messages from these topics? This cannot be undone.",
    "There are no default channels.": "There are no default streams.",
    "There are no channels you can view in this organization.": "There are no streams you can view in this organization.",
    "This change will make this channel's entire message history accessible according to the new configuration.": "This change will make this stream's entire message history accessible according to the new configuration.",
    "This channel does not exist or is private.": "This stream does not exist or is private.",
    "This channel does not yet have a description.": "This stream does not yet have a description.",
    "This channel has been archived.": "This stream has been archived.",
    "This channel has no subscribers.": "This stream has no subscribers.",
    "This channel has {sub_count, plural, =0 {no subscribers} one {# subscriber} other {# subscribers}}.": "This stream has {sub_count, plural, =0 {no subscribers} one {# subscriber} other {# subscribers}}.",
    "Time limit for moving messages between channels": "Time limit for moving messages between streams",
    "Unknown channel": "Unknown stream",
    "Unknown channel #{search_text}": "Unknown stream #{search_text}",
    "Unmute channel": "Unmute stream",
    # "Unmuted <z-link>{channel_topic}</z-link>.": "Unmuted <z-link>{stream_topic}</z-link>.",
    "Unmuted channels and topics": "Unmuted streams and topics",
    "Unpin channel from top": "Unpin stream from top",
    "Use channel settings to unsubscribe from private channels.": "Use stream settings to unsubscribe from private streams.",
    "Use channel settings to unsubscribe the last user from a private channel.": "Use stream settings to unsubscribe the last user from a private stream.",
    "View all channels": "View all streams",
    "View channel": "View stream",
    "View channel messages": "View stream messages",
    "View channels": "View streams",
    # "Warning: <strong>#{channel_name}</strong> is a private channel.": "Warning: <strong>#{stream_name}</strong> is a private stream.",
    "Which parts of the email should be included in the Zulip message sent to this channel?": "Which parts of the email should be included in the Zulip message sent to this stream?",
    "Who can access this channel": "Who can access this stream",
    "Who can add users to channels": "Who can add users to streams",
    "Who can create private channels": "Who can create private streams",
    "Who can create public channels": "Who can create public streams",
    "Who can create web-public channels": "Who can create web-public streams",
    "Who can move messages to another channel": "Who can move messages to another stream",
    "Who can post to this channel": "Who can post to this stream",
    "Who can unsubscribe others from this channel": "Who can unsubscribe others from this stream",
    "You are not currently subscribed to this channel.": "You are not currently subscribed to this stream.",
    "You are not subscribed to any channels.": "You are not subscribed to any streams.",
    "You are not subscribed to channel <z-stream-name></z-stream-name>.": "You are not subscribed to stream <z-stream-name></z-stream-name>.",
    # "You aren't subscribed to this channel and nobody has talked about that yet!": "You aren't subscribed to this stream and nobody has talked about that yet!",
    "You can use email to send messages to Zulip channels.": "You can use email to send messages to Zulip streams.",
    "You cannot create a channel with no subscribers.": "You cannot create a stream with no subscribers.",
    "You do not have permission to add other users to channels in this organization.": "You do not have permission to add other users to streams in this organization.",
    "You do not have permission to move messages to another channel in this organization.": "You do not have permission to move messages to another stream in this organization.",
    "You do not have permission to post in this channel.": "You do not have permission to post in this stream.",
    # "You do not have permission to use <b>@{wildcard_mention_string}</b> mentions in this channel.": "You do not have permission to use <b>@{stream_wildcard_mention}</b> mentions in this stream.",
    "You must be an organization administrator to create a channel without subscribing.": "You must be an organization administrator to create a stream without subscribing.",
    "You subscribed to channel <z-stream-name></z-stream-name>.": "You subscribed to stream <z-stream-name></z-stream-name>.",
    "You unsubscribed from channel <z-stream-name></z-stream-name>.": "You unsubscribed from stream <z-stream-name></z-stream-name>.",
    "You're not subscribed to this channel. You will not be notified if other users reply to your message.": "You're not subscribed to this stream. You will not be notified if other users reply to your message.",
    "Your message was sent to a channel you have muted.": "Your message was sent to a stream you have muted.",
    "back to channels": "back to streams",
}


def get_json_filename(locale: str) -> str:
    return f"locale/{locale}/translations.json"


def get_legacy_filename(locale: str) -> str:
    return f"locale/{locale}/legacy_stream_translations.json"


def get_locales() -> list[str]:
    output = check_output(["git", "ls-files", "locale"], text=True)
    tracked_files = output.split()
    regex = re.compile(r"locale/(\w+)/LC_MESSAGES/django.po")
    locales = []
    for tracked_file in tracked_files:
        matched = regex.search(tracked_file)
        if matched and matched.group(1) != "en_GB":
            locales.append(matched.group(1))

    return locales


def get_translations(path: str) -> dict[str, str]:
    with open(path, "rb") as raw_resource_file:
        translations = orjson.loads(raw_resource_file.read())

    return translations


def update_for_legacy_stream_translations(
    current: dict[str, str], legacy: dict[str, str], path: str
) -> None:
    number_of_updates = 0
    updated_translations: dict[str, str] = {}
    for line, translation in current.items():
        # If the string has a legacy string mapped and see if it's
        # not currently translated (e.g. an empty string), then use
        # the legacy translated string (which might be an empty string).
        if (
            line in LEGACY_STRINGS_MAP
            and translation == ""
            and (legacy_string := LEGACY_STRINGS_MAP[line]) in legacy
        ):
            updated_translations[line] = legacy[legacy_string]
            number_of_updates += 1
        else:
            updated_translations[line] = translation

    # Only replace file content if we've made any updates for legacy
    # translated strings.
    if number_of_updates > 0:
        with open(path, "wb") as f:
            f.write(
                orjson.dumps(
                    updated_translations,
                    option=orjson.OPT_APPEND_NEWLINE | orjson.OPT_INDENT_2 | orjson.OPT_SORT_KEYS,
                )
            )
        print(f"Updated {number_of_updates} strings in: {path}")


expected_legacy_filenames = set()
for locale in get_locales():
    current = get_json_filename(locale)
    legacy = get_legacy_filename(locale)
    expected_legacy_filenames.add(legacy)
    if os.path.exists(current) and os.path.exists(legacy):
        print(f"Checking legacy translations for: {current}")
        current_translations = get_translations(current)
        legacy_translations = get_translations(legacy)
        update_for_legacy_stream_translations(current_translations, legacy_translations, current)

for extra_file in (
    set(glob.glob("locale/*/legacy_stream_translations.json")) - expected_legacy_filenames
):
    print(f"Removing dangling legacy translation file {extra_file}")
    os.unlink(extra_file)
```

--------------------------------------------------------------------------------

---[FILE: capitalization.py]---
Location: zulip-main/tools/lib/capitalization.py

```python
import re
from io import StringIO
from re import Match

from bs4 import BeautifulSoup

# The phrases in this list will be ignored. The longest phrase is
# tried first; this removes the chance of smaller phrases changing
# the text before longer phrases are tried.
# The errors shown by `tools/check-capitalization` can be added to
# this list without any modification.
IGNORED_PHRASES = [
    # Proper nouns and acronyms
    r"AI",
    r"API",
    r"APNS",
    r"Botserver",
    r"Cookie Bot",
    r"DevAuthBackend",
    r"DSN",
    r"Esc",
    r"GCM",
    r"GitHub",
    r"Gravatar",
    r"HTTP",
    r"ID",
    r"IDs",
    r"Inbox",
    r"IP",
    r"JSON",
    r"Jitsi",
    r"Jotform",
    r"LinkedIn",
    r"LDAP",
    r"Markdown",
    r"OAuth",
    r"OTP",
    r"Pivotal",
    r"Recent conversations",
    r"DM",
    r"DMs",
    r"Slack",
    r"Google",
    r"Terms of Service",
    r"Tuesday",
    r"URL",
    r"UUID",
    r"WordPress",
    r"Zoom",
    r"Zulip",
    r"Zulip Server",
    r"Zulip Account Security",
    r"Zulip Security",
    r"Zulip Cloud",
    r"Zulip Cloud Standard",
    r"Zulip Cloud Plus",
    r"Zulip Desktop",
    r"BigBlueButton",
    # Code things
    r"\.zuliprc",
    # BeautifulSoup will remove <z-user> which is horribly confusing,
    # so we need more of the sentence.
    r"<z-user></z-user> will have the same role",
    r"<z-user></z-user> will have the same properties",
    # Things using "I"
    r"I understand",
    r"I'm",
    r"I've",
    r"Topics I participate in",
    r"Topics I send a message to",
    r"Topics I start",
    # Specific short words
    r"beta",
    r"and",
    r"bot",
    r"e\.g\.",
    r"email",
    r"enabled",
    r"signups",
    # Pasted text filename
    r"PastedText",
    # Placeholders
    r"keyword",
    r"streamname",
    r"user@example\.com",
    r"example\.com",
    r"acme",
    # Fragments of larger strings
    r"is …",
    r"your subscriptions on your Channels page",
    r"Add global time<br />Everyone sees global times in their own time zone\.",
    r"user",
    r"an unknown operating system",
    r"Go to Settings",
    r"find accounts for another email address",
    # SPECIAL CASES
    # Because topics usually are lower-case, this would look weird if it were capitalized
    r"show all topics",
    # Used alone in a parenthetical where capitalized looks worse.
    r"^deprecated$",
    # We want the similar text in the Private Messages section to have the same capitalization.
    r"more conversations",
    r"back to channels",
    # Capital 'i' looks weird in reminders popover
    r"in 1 hour",
    r"in 20 minutes",
    r"in 3 hours",
    # these are used as channel or topic names
    r"^new channels$",
    r"^channel events$",
    r"^general$",
    r"^sandbox$",
    r"^experiments$",
    r"^greetings$",
    r"^moving messages$",
    r"^start a conversation$",
    r"^welcome to Zulip!$",
    r"^general chat$",
    # These are used as example short names (e.g. an uncapitalized context):
    r"^marketing$",
    r"^cookie$",
    # Used to refer custom time limits
    r"\bN\b",
    r"minute",
    r"minutes",
    # Capital c feels obtrusive in clear status option
    r"clear",
    r"group direct messages with \{recipient\}",
    r"direct messages with \{recipient\}",
    r"direct messages with yourself",
    r"GIF",
    # Emoji name placeholder
    r"leafy green vegetable",
    # Subdomain placeholder
    r"your-organization",
    # Used in invite modal
    r"or",
    # Units
    r"MB",
    r"GB",
    # Used in GIPHY integration setting. GIFs Rating.
    r"rated Y",
    r"rated G",
    r"rated PG",
    r"rated PG13",
    r"rated R",
    # Used in GIPHY popover.
    r"GIFs",
    r"GIPHY",
    # Used for Tenor attributions
    r"Search Tenor",
    # Used in our case studies
    r"Technical University of Munich",
    r"University of California San Diego",
    # Used in stream creation form
    r"email hidden",
    # Use in compose box.
    r"to send",
    r"to add a new line",
    # Used in showing Notification Bot read receipts message
    "Notification Bot",
    # Used in strings around welcome bot custom messages
    r"Welcome Bot",
    # Used in presence_enabled setting label
    r"invisible mode off",
    # Typeahead suggestions for "Pronouns" custom field type.
    r"he/him",
    r"she/her",
    r"they/them",
    # Used in message-move-time-limit setting label
    r"does not apply to moderators and administrators",
    # Used in message-delete-time-limit setting label
    r"does not apply to users who can delete any message",
    # Used as indicator with names for guest users.
    r"guest",
    # Used as indicator with names for archived streams.
    r"archived",
    # Used in pills for deactivated users.
    r"deactivated",
    # Used in pills for resolved topics.
    r"resolved",
    # Used in pills for unresolved topics.
    r"unresolved",
    # This is a reference to a setting/secret and should be lowercase.
    r"zulip_org_id",
    # These are custom time unit options for modal dropdowns
    r"minutes",
    r"hours",
    r"days",
    r"weeks",
    # Used in "Who can subscribe to this channel" label.
    r"everyone except guests can subscribe to any public channel",
    # Used in branch-filtering label in the integration-url-modal.
    r"comma-separated list",
    # Used in info_overlay.
    r"then",
    r"Joe Smith",
    r"bold",
    r"channel name",
    r"is busy working",
    r"italic",
    r"strikethrough",
    r"support team",
    r"topic name",
]

# Sort regexes in descending order of their lengths. As a result, the
# longer phrases will be ignored first.
IGNORED_PHRASES.sort(key=len, reverse=True)

# Compile regexes to improve performance. This also extracts the
# text using BeautifulSoup and then removes extra whitespaces from
# it. This step enables us to add HTML in our regexes directly.
COMPILED_IGNORED_PHRASES = [
    re.compile(r" ".join(BeautifulSoup(StringIO(regex), "lxml").text.split()))
    for regex in IGNORED_PHRASES
]

SPLIT_BOUNDARY = r"?.!"  # Used to split string into sentences.
SPLIT_BOUNDARY_REGEX = re.compile(rf"[{SPLIT_BOUNDARY}]")

# Regexes which check capitalization in sentences.
DISALLOWED = [
    r"^[a-z](?!\})",  # Checks if the sentence starts with a lower case character.
    r"^[A-Z][a-z]+[\sa-z0-9]+[A-Z]",  # Checks if an upper case character exists
    # after a lower case character when the first character is in upper case.
]
DISALLOWED_REGEX = re.compile(r"|".join(DISALLOWED))

BANNED_WORDS = {
    "realm": "The term realm should not appear in user-facing strings. Use organization instead.",
}


def get_safe_phrase(phrase: str) -> str:
    """
    Safe phrase is in lower case and doesn't contain characters which can
    conflict with split boundaries. All conflicting characters are replaced
    with low dash (_).
    """
    phrase = SPLIT_BOUNDARY_REGEX.sub("_", phrase)
    return phrase.lower()


def replace_with_safe_phrase(matchobj: Match[str]) -> str:
    """
    The idea is to convert IGNORED_PHRASES into safe phrases, see
    `get_safe_phrase()` function. The only exception is when the
    IGNORED_PHRASE is at the start of the text or after a split
    boundary; in this case, we change the first letter of the phrase
    to upper case.
    """
    ignored_phrase = matchobj.group(0)
    safe_string = get_safe_phrase(ignored_phrase)

    start_index = matchobj.start()
    complete_string = matchobj.string

    is_string_start = start_index == 0
    # We expect that there will be one space between split boundary
    # and the next word.
    punctuation = complete_string[max(start_index - 2, 0)]
    is_after_split_boundary = punctuation in SPLIT_BOUNDARY
    if is_string_start or is_after_split_boundary:
        return safe_string.capitalize()

    return safe_string


def get_safe_text(text: str) -> str:
    """
    This returns text which is rendered by BeautifulSoup and is in the
    form that can be split easily and has all IGNORED_PHRASES processed.
    """
    soup = BeautifulSoup(StringIO(text), "lxml")
    text = " ".join(soup.text.split())  # Remove extra whitespaces.
    for phrase_regex in COMPILED_IGNORED_PHRASES:
        text = phrase_regex.sub(replace_with_safe_phrase, text)

    return text


def is_capitalized(safe_text: str) -> bool:
    sentences = SPLIT_BOUNDARY_REGEX.split(safe_text)
    return not any(DISALLOWED_REGEX.search(sentence.strip()) for sentence in sentences)


def check_banned_words(text: str) -> list[str]:
    lower_cased_text = text.lower()
    errors = []
    for word, reason in BANNED_WORDS.items():
        if word in lower_cased_text:
            # Hack: Should move this into BANNED_WORDS framework; for
            # now, just hand-code the skips:
            if (
                "realm_name" in lower_cased_text
                or "realm_uri" in lower_cased_text
                or "realm_url" in lower_cased_text
                or "remote_realm_host" in lower_cased_text
                or "realm_message" in lower_cased_text
                or "realm_move" in lower_cased_text
            ):
                continue
            kwargs = dict(word=word, text=text, reason=reason)
            msg = "{word} found in '{text}'. {reason}".format(**kwargs)
            errors.append(msg)

    return errors


def check_capitalization(strings: list[str]) -> tuple[list[str], list[str], list[str]]:
    errors = []
    ignored = []
    banned_word_errors = []
    for text in strings:
        text = " ".join(text.split())  # Remove extra whitespaces.
        safe_text = get_safe_text(text)
        has_ignored_phrase = text != safe_text
        capitalized = is_capitalized(safe_text)
        if not capitalized:
            errors.append(text)
        elif has_ignored_phrase:
            ignored.append(text)

        banned_word_errors.extend(check_banned_words(text))

    return sorted(errors), sorted(ignored), sorted(banned_word_errors)
```

--------------------------------------------------------------------------------

---[FILE: git-tools.bash]---
Location: zulip-main/tools/lib/git-tools.bash

```text
# shellcheck shell=bash

# Borrowed from Git's git-sh-setup.
#
# See git.git commit 92c62a3f4 (from 2010!); as of 2020 with Git 2.26,
# this function has only needed one edit since then, adding localization
# with gettext, which we can omit.
require_clean_work_tree() {
    local action="$1"

    git rev-parse --verify HEAD >/dev/null || exit 1
    git update-index -q --ignore-submodules --refresh
    local err=0

    if ! git diff-files --quiet --ignore-submodules; then
        echo >&2 "Cannot $action: You have unstaged changes."
        err=1
    fi

    if ! git diff-index --cached --quiet --ignore-submodules HEAD --; then
        if [ $err = 0 ]; then
            echo >&2 "Cannot $action: Your index contains uncommitted changes."
        else
            echo >&2 "Additionally, your index contains uncommitted changes."
        fi
        err=1
    fi

    if [ $err = 1 ]; then
        git status --short
        echo >&2 "Doing nothing to avoid losing your work."
        exit 1
    fi
}
```

--------------------------------------------------------------------------------

---[FILE: gitlint_rules.py]---
Location: zulip-main/tools/lib/gitlint_rules.py

```python
from gitlint.git import GitCommit
from gitlint.rules import CommitMessageTitle, LineRule, RuleViolation

# Word list from https://github.com/m1foley/fit-commit
# Copyright (c) 2015 Mike Foley
# License: MIT
# Ref: fit_commit/validators/tense.rb
TENSE_DATA = [
    (["adds", "adding", "added"], "add"),
    (["allows", "allowing", "allowed"], "allow"),
    (["amends", "amending", "amended"], "amend"),
    (["bumps", "bumping", "bumped"], "bump"),
    (["calculates", "calculating", "calculated"], "calculate"),
    (["changes", "changing", "changed"], "change"),
    (["cleans", "cleaning", "cleaned"], "clean"),
    (["commits", "committing", "committed"], "commit"),
    (["corrects", "correcting", "corrected"], "correct"),
    (["creates", "creating", "created"], "create"),
    (["darkens", "darkening", "darkened"], "darken"),
    (["disables", "disabling", "disabled"], "disable"),
    (["displays", "displaying", "displayed"], "display"),
    (["documents", "documenting", "documented"], "document"),
    (["drys", "drying", "dried"], "dry"),
    (["ends", "ending", "ended"], "end"),
    (["enforces", "enforcing", "enforced"], "enforce"),
    (["enqueues", "enqueuing", "enqueued"], "enqueue"),
    (["extracts", "extracting", "extracted"], "extract"),
    (["finishes", "finishing", "finished"], "finish"),
    (["fixes", "fixing", "fixed"], "fix"),
    (["formats", "formatting", "formatted"], "format"),
    (["guards", "guarding", "guarded"], "guard"),
    (["handles", "handling", "handled"], "handle"),
    (["hides", "hiding", "hid"], "hide"),
    (["increases", "increasing", "increased"], "increase"),
    (["ignores", "ignoring", "ignored"], "ignore"),
    (["implements", "implementing", "implemented"], "implement"),
    (["improves", "improving", "improved"], "improve"),
    (["keeps", "keeping", "kept"], "keep"),
    (["kills", "killing", "killed"], "kill"),
    (["makes", "making", "made"], "make"),
    (["merges", "merging", "merged"], "merge"),
    (["moves", "moving", "moved"], "move"),
    (["permits", "permitting", "permitted"], "permit"),
    (["prevents", "preventing", "prevented"], "prevent"),
    (["pushes", "pushing", "pushed"], "push"),
    (["rebases", "rebasing", "rebased"], "rebase"),
    (["refactors", "refactoring", "refactored"], "refactor"),
    (["removes", "removing", "removed"], "remove"),
    (["renames", "renaming", "renamed"], "rename"),
    (["reorders", "reordering", "reordered"], "reorder"),
    (["replaces", "replacing", "replaced"], "replace"),
    (["requires", "requiring", "required"], "require"),
    (["restores", "restoring", "restored"], "restore"),
    (["sends", "sending", "sent"], "send"),
    (["sets", "setting"], "set"),
    (["separates", "separating", "separated"], "separate"),
    (["shows", "showing", "showed"], "show"),
    (["simplifies", "simplifying", "simplified"], "simplify"),
    (["skips", "skipping", "skipped"], "skip"),
    (["sorts", "sorting"], "sort"),
    (["speeds", "speeding", "sped"], "speed"),
    (["starts", "starting", "started"], "start"),
    (["supports", "supporting", "supported"], "support"),
    (["takes", "taking", "took"], "take"),
    (["testing", "tested"], "test"),  # "tests" excluded to reduce false negatives
    (["truncates", "truncating", "truncated"], "truncate"),
    (["updates", "updating", "updated"], "update"),
    (["uses", "using", "used"], "use"),
]

TENSE_CORRECTIONS = {word: imperative for words, imperative in TENSE_DATA for word in words}


class ImperativeMood(LineRule):
    """This rule will enforce that the commit message title uses imperative
    mood. This is done by checking if the first word is in `WORD_SET`, if so
    show the word in the correct mood."""

    name = "title-imperative-mood"
    id = "Z1"
    target = CommitMessageTitle

    error_msg = (
        "The first word in commit title should be in imperative mood "
        '("{word}" -> "{imperative}"): "{title}"'
    )

    def validate(self, line: str, commit: GitCommit) -> list[RuleViolation]:
        violations = []

        # Ignore the section tag (ie `<section tag>: <message body>.`)
        words = line.split(": ", 1)[-1].split()
        first_word = words[0].lower()

        if first_word in TENSE_CORRECTIONS:
            imperative = TENSE_CORRECTIONS[first_word]
            violation = RuleViolation(
                self.id,
                self.error_msg.format(
                    word=first_word,
                    imperative=imperative,
                    title=commit.message.title,
                ),
            )

            violations.append(violation)

        return violations
```

--------------------------------------------------------------------------------

---[FILE: html_branches.py]---
Location: zulip-main/tools/lib/html_branches.py

```python
import re
from collections import defaultdict

from .template_parser import FormattedError, Token, tokenize


class TagInfo:
    def __init__(self, tag: str, classes: list[str], ids: list[str], token: Token) -> None:
        self.tag = tag
        self.classes = classes
        self.ids = ids
        self.token = token
        self.words = [
            self.tag,
            *("." + s for s in classes),
            *("#" + s for s in ids),
        ]

    def text(self) -> str:
        s = self.tag
        if self.classes:
            s += "." + ".".join(self.classes)
        if self.ids:
            s += "#" + "#".join(self.ids)
        return s


def get_tag_info(token: Token) -> TagInfo:
    s = token.s
    tag = token.tag
    classes: list[str] = []
    ids: list[str] = []

    searches = [
        (classes, ' class="(.*?)"'),
        (classes, " class='(.*?)'"),
        (ids, ' id="(.*?)"'),
        (ids, " id='(.*?)'"),
    ]

    for lst, regex in searches:
        m = re.search(regex, s)
        if m:
            for g in m.groups():
                lst += split_for_id_and_class(g)

    return TagInfo(tag=tag, classes=classes, ids=ids, token=token)


def split_for_id_and_class(element: str) -> list[str]:
    # Here we split a given string which is expected to contain id or class
    # attributes from HTML tags. This also takes care of template variables
    # in string during splitting process. For eg. 'red black {{ a|b|c }}'
    # is split as ['red', 'black', '{{ a|b|c }}']
    outside_braces: bool = True
    lst = []
    s = ""

    for ch in element:
        if ch == "{":
            outside_braces = False
        if ch == "}":
            outside_braces = True
        if ch == " " and outside_braces:
            if s != "":
                lst.append(s)
            s = ""
        else:
            s += ch
    if s != "":
        lst.append(s)

    return lst


def build_id_dict(templates: list[str]) -> dict[str, list[str]]:
    template_id_dict: dict[str, list[str]] = defaultdict(list)

    for fn in templates:
        with open(fn) as f:
            text = f.read()

        try:
            list_tags = tokenize(text)
        except FormattedError as e:
            raise Exception(
                f"""
                fn: {fn}
                {e}"""
            )

        for tag in list_tags:
            info = get_tag_info(tag)

            for ids in info.ids:
                template_id_dict[ids].append("Line " + str(info.token.line) + ":" + fn)

    return template_id_dict
```

--------------------------------------------------------------------------------

````
