---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 470
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 470 of 1290)

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

---[FILE: public-access-option.mdx]---
Location: zulip-main/starlight_help/src/content/docs/public-access-option.mdx

```text
---
title: Public access option
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipNote from "../../components/ZulipNote.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import WebPublicChannelsIntro from "../include/_WebPublicChannelsIntro.mdx";

<WebPublicChannelsIntro />

## Enabling web-public channels in your organization

Enabling web-public channels makes it possible to create web-public
channels in your organization. It also makes certain information about
your organization accessible to anyone on the Internet via the Zulip
API (details below).

To help protect closed organizations, creating web-public channels is
disabled by default for all organizations.

### Information that can be accessed via API when web-public channels are enabled

The following information about your organization can be accessed via the Zulip
API if web-public channels are enabled and there is currently at least one
web-public channel.

* The organization's settings (linkifiers, custom emoji, permissions
  settings, etc.)
* Names of users
* Names of user groups and their membership
* Names and descriptions of channels

Enabling web-public channels is thus primarily recommended for open
communities such as open-source projects and research communities.

### Enable or disable web-public channels

<ZulipNote>
  Self-hosted Zulip servers must enable support for web-public channels in their
  [server settings](https://zulip.readthedocs.io/en/stable/production/settings.html)
  by setting `WEB_PUBLIC_STREAMS_ENABLED = True` prior to proceeding.
</ZulipNote>

<FlattenedSteps>
  <NavigationSteps target="settings/organization-permissions" />

  1. Under **Channel permissions**, toggle the checkbox labeled **Allow
     creating web-public channels (visible to anyone on the Internet)**.
</FlattenedSteps>

### Manage who can create web-public channels

<FlattenedSteps>
  <NavigationSteps target="settings/organization-permissions" />

  1. Under **Channel permissions**, make sure the checkbox labeled **Allow
     creating web-public channels (visible to anyone on the Internet)** is
     checked.
  1. Under **Who can create web-public channels?**, select the option you prefer.
</FlattenedSteps>

<ZulipTip>
  See [Managing abuse](#managing-abuse) to learn why only
  trusted roles like moderators and administrators can create web-public channels.
</ZulipTip>

## Creating a web-public channel

To create a new web-public channel, follow the [instructions for creating a
channel](/help/create-a-channel), selecting the **Web-public** option for **Who
can access this channel**.

To make an existing channel web-public, follow the instructions to
[change the privacy of a
channel](/help/change-the-privacy-of-a-channel), selecting the
**Web-public** option for **Who can access this channel**.

## What can logged out visitors do?

Logged out visitors can browse all content in web-public channels,
including using Zulip's [built-in search](/help/search-for-messages)
to find conversations. Logged out visitors can only access
the web-public channels in your organization, and the topics, messages
(including uploaded files) and emoji reactions in those channels.

They **cannot**:

* View channels that are not configured as web-public channels (or see
  whether any such channels exist) without creating an account.
* Send messages.
* React with emoji.
* Participate in polls, or do anything else that might be visible to
  other users.

Logged out visitors have access to a subset of the metadata
information available to any new account in the Zulip organization,
detailed below.

### Information about the organization

* The **Organization settings** and **Channel settings** menus are not
  available to logged out visitors. However, organization settings data is
  required for Zulip to load, and may thus be [accessed via the Zulip API][info-via-api].
* Logged out visitors cannot view [usage statistics](/help/analytics).

[info-via-api]: /help/public-access-option#information-that-can-be-accessed-via-api-when-web-public-channels-are-enabled

### Information about users

Logged out visitors can see the following information about users who
participate in web-public channels. They do not see this information
about users who do not participate in web-public channels in the Zulip
UI, though they may access it via the Zulip API.

* Name
* Avatar
* Role (e.g., Administrator)
* Join date

The following additional information is not available in the UI for
logged out visitors, but may be accessed without an account via the
Zulip API:

* Configured time zone
* Which user groups a user belongs to

The following information is available to all users with an account,
but not to logged out visitors:

* Presence information, i.e. whether the user is currently online,
  [their status](/help/status-and-availability),
  and whether they have set themselves as unavailable.
* Detailed profile information, such as [custom profile
  fields](/help/custom-profile-fields).
* Which users are subscribed to which web-public channels.

## Managing abuse

The unfortunate reality is that any service
that allows hosting files visible to the Internet is a potential target for bad
actors looking for places to distribute illegal or malicious content.

In order to protect Zulip organizations from
bad actors, web-public channels have a few limitations designed to make
Zulip an inconvenient target:

* Only users in trusted roles (moderators and administrators) can be given
  permission to create web-public channels. This is intended to make it hard
  for an attacker to host malicious content in an unadvertised web-public
  channel in a legitimate organization.
* There are rate limits for unauthenticated access to uploaded
  files, including viewing avatars and custom emoji.

Our aim is to tune anti-abuse protections so that they don't
interfere with legitimate use. Please [contact us](/help/contact-support)
if your organization encounters any problems with legitimate activity caused
these anti-abuse features.

As a reminder, Zulip Cloud organizations are expected to
[moderate content](/help/moderating-open-organizations) to ensure compliance
with [Zulip's Rules of Use](https://zulip.com/policies/rules).

## Caveats

* Web-public channels do not yet support search engine indexing. You
  can use [zulip-archive](https://github.com/zulip/zulip-archive) to
  create an archive of a Zulip organization that can be indexed by
  search engines.
* The web-public view is not yet integrated with Zulip's live-update
  system. As a result, a visitor will not see new messages that are
  sent to a topic they are currently viewing without reloading the
  browser window.

## Related articles

* [Moderating open organizations](/help/moderating-open-organizations)
* [Channel permissions](/help/channel-permissions)
* [Restrict channel creation](/help/configure-who-can-create-channels)
```

--------------------------------------------------------------------------------

---[FILE: quote-or-forward-a-message.mdx]---
Location: zulip-main/starlight_help/src/content/docs/quote-or-forward-a-message.mdx

```text
---
title: Quote or forward a message
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import KeyboardTip from "../../components/KeyboardTip.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import MessageActionsMenu from "../include/_MessageActionsMenu.mdx";
import MessageLongPressMenu from "../include/_MessageLongPressMenu.mdx";

Conversations in Zulip are [organized by topic](/help/introduction-to-topics),
so it's generally clear what you're responding to when you send a message.
However, when responding to an older message, you may want to
[quote](#quote-a-message) all or part of it for reference.

You can also [forward](#forward-a-message) a message to another conversation.

The first line of a quoted or forwarded message contains a [permanent
link][link-to-message] to the original message. Zulip automatically turns
mentions in the quoted text into [silent
mentions](/help/mention-a-user-or-group#silently-mention-a-user) to avoid
unnecessarily mentioning someone twice.

<ZulipTip>
  You can use [quote blocks](/help/format-a-quote)
  when quoting emails or other non-Zulip content.
</ZulipTip>

## Quote a message

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      1. *(optional)* To quote only part of a message, select the part that you want
         to quote.

      <MessageActionsMenu />

      1. Click **Quote message**.
      1. Send your message.
    </FlattenedSteps>

    <KeyboardTip>
      You can also use <kbd>></kbd> to quote to the
      selected message.
    </KeyboardTip>
  </TabItem>

  <TabItem label="Mobile">
    <FlattenedSteps>
      <MessageLongPressMenu />

      1. Tap **Quote message**.
      1. *(optional)* Delete any parts of the quoted message that are not
         relevant to your reply.
      1. Send your message.
    </FlattenedSteps>

    <ZulipTip>
      If you are in a channel view, you can set a different destination
      topic by tapping the compose box and selecting an existing topic
      or typing a new topic name.
    </ZulipTip>
  </TabItem>
</Tabs>

## Forward a message

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      1. *(optional)* To forward only part of a message, select the part that you want
         to forward.

      <MessageActionsMenu />

      1. Click **Forward message**.
      1. Select the desired destination channel or **Direct message** from the dropdown
         in the top left of the compose box.
      1. Enter a topic name, or recipient names for a direct message.
      1. Send your message.
    </FlattenedSteps>

    <KeyboardTip>
      You can also use <kbd>\<</kbd> to forward the selected message.
    </KeyboardTip>
  </TabItem>
</Tabs>

## Related articles

* [Replying to messages](/help/replying-to-messages)
* [Format a quote](/help/format-a-quote)
* [Link to a message or conversation][link-to-message]
* [Mention a user or group](/help/mention-a-user-or-group)

[link-to-message]: /help/link-to-a-message-or-conversation
```

--------------------------------------------------------------------------------

---[FILE: read-receipts.mdx]---
Location: zulip-main/starlight_help/src/content/docs/read-receipts.mdx

```text
---
title: Read receipts
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import KeyboardTip from "../../components/KeyboardTip.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import AdminOnly from "../include/_AdminOnly.mdx";
import MessageActionsMenu from "../include/_MessageActionsMenu.mdx";
import MessageLongPressMenu from "../include/_MessageLongPressMenu.mdx";
import SaveChanges from "../include/_SaveChanges.mdx";

Read receipts let you check who has read a message. You can see read receipts
for any message, including both [channel messages](/help/introduction-to-channels)
and [direct messages](/help/direct-messages).

With privacy in mind, Zulip lets you [control][configure-personal-read-receipts]
whether your read receipts are shared, and administrators can
[choose][configure-organization-read-receipts] whether to enable read receipts in
their organization.

<ZulipTip>
  Read receipts reflect whether or not someone has marked a message as read,
  whether by viewing it, or [by marking messages as read in
  bulk](/help/marking-messages-as-read).
</ZulipTip>

## View who has read a message

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <MessageActionsMenu />

      1. Click **View read receipts**.
    </FlattenedSteps>

    <KeyboardTip>
      You can also use <kbd>Shift</kbd> + <kbd>V</kbd> to show or hide read receipts
      for the selected message.
    </KeyboardTip>
  </TabItem>

  <TabItem label="Mobile">
    <FlattenedSteps>
      <MessageLongPressMenu />

      1. Tap **View read receipts**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

<ZulipTip>
  In addition to a list of names, you will see how many people have read
  the message.
</ZulipTip>

## Configure whether Zulip lets others see when you've read messages

Zulip supports the privacy option of never sharing whether or not you have read
a message. If this setting is turned off, your name will never appear in the
list of read receipts.

<FlattenedSteps>
  <NavigationSteps target="settings/account-and-privacy" />

  1. Under **Privacy**, toggle **Let others see when I've read messages**.
</FlattenedSteps>

## Configure read receipts for your organization

<AdminOnly />

You can configure:

* Whether read receipts are enabled in your organization.
* Whether new users will allow others to view read receipts by default. (Note
  that users [can always change this setting][configure-personal-read-receipts]
  once they join.)

### Configure whether read receipts are enabled in your organization

<FlattenedSteps>
  <NavigationSteps target="settings/organization-settings" />

  1. Under **Message feed settings**, toggle **Enable read receipts**.

  <SaveChanges />
</FlattenedSteps>

### Configure default read receipt sharing settings for new users

<FlattenedSteps>
  <NavigationSteps target="settings/default-user-settings" />

  1. Under **Privacy settings**, toggle **Allow other users to view read receipts**.
</FlattenedSteps>

## Related articles

* [Status and availability](/help/status-and-availability)
* [Typing notifications](/help/typing-notifications)
* [Marking messages as read](/help/marking-messages-as-read)
* [Marking messages as unread](/help/marking-messages-as-unread)

[configure-personal-read-receipts]: /help/read-receipts#configure-whether-zulip-lets-others-see-when-youve-read-messages

[configure-organization-read-receipts]: /help/read-receipts#configure-whether-read-receipts-are-enabled-in-your-organization
```

--------------------------------------------------------------------------------

---[FILE: reading-conversations.mdx]---
Location: zulip-main/starlight_help/src/content/docs/reading-conversations.mdx

```text
---
title: Reading conversations
---

import ReadingConversations from "../include/_ReadingConversations.mdx";

<ReadingConversations>
  ### Finding a conversation to read from the Inbox view

  ### Finding a conversation to read from Recent conversations

  ### Finding a conversation to read from the left sidebar

  ### Reading conversations
</ReadingConversations>

## Related articles

* [Getting started with Zulip](/help/getting-started-with-zulip)
* [Finding a conversation to read](/help/finding-a-conversation-to-read)
* [Reading strategies](/help/reading-strategies)
```

--------------------------------------------------------------------------------

---[FILE: reading-strategies.mdx]---
Location: zulip-main/starlight_help/src/content/docs/reading-strategies.mdx

```text
---
title: Reading strategies
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import CombinedFeed from "../include/_CombinedFeed.mdx";
import DmFeedInstructions from "../include/_DmFeedInstructions.mdx";
import FollowedTopicWorkflows from "../include/_FollowedTopicWorkflows.mdx";
import ReadingConversations from "../include/_ReadingConversations.mdx";
import ViewEmojiReactions from "../include/_ViewEmojiReactions.mdx";
import ViewMentions from "../include/_ViewMentions.mdx";
import ViewStarredMessages from "../include/_ViewStarredMessages.mdx";

In Zulip, channels determine who gets a message. Topics tell you what
the message is about. If you are not yet familiar with Zulip's topics,
we recommend first reading about [channels](/help/introduction-to-channels) and
[topics](/help/introduction-to-topics).

This article describes a few ways to efficiently read through messages
in Zulip.

## Conversation by conversation

<ReadingConversations>
  ### Finding a conversation to read from the Inbox view

  ### Finding a conversation to read from Recent conversations

  ### Finding a conversation to read from the left sidebar

  ### Reading conversations
</ReadingConversations>

### Following, muting and unmuting conversations

You can improve your workflow for catching up on messages by taking advantage of
[following topics](/help/follow-a-topic), as well as muting and unmuting
[channels](/help/mute-a-channel) and [topics](/help/mute-a-topic). Some example
workflows:

<FollowedTopicWorkflows />

## Combined views

### Combined feed

<CombinedFeed />

### Direct message feed

You can see all your direct messages in one place.

<DmFeedInstructions />

### Channel view

Sometimes it's useful to scroll through all the messages in a channel,
especially in situations where you just want a general idea of what's going
on.

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. Find the channel you want to read in the left sidebar. If you don't see it
         right away, you can search for a channel by clicking on **channels** in the
         left sidebar, or using the <kbd>Q</kbd> [keyboard
         shortcut](/help/keyboard-shortcuts).
      1. Click on the channel name in the left sidebar.
      1. Read messages in the channel, starting from your first unread message. You can
         scroll using your mouse, the arrow keys, <kbd>End</kbd>, or page up/down.
      1. You can click on a topic in the left sidebar or a message recipient bar to
         view that topic.
    </Steps>
  </TabItem>
</Tabs>

## Special views

### Mentions

The mentions view lets you quickly find all the places where you were
[mentioned](/help/mention-a-user-or-group). Reviewing your mentions can be a
good way to start your day.

<ViewMentions />

### Starred messages

You can [star messages](/help/star-a-message) that you plan to follow up on later.

#### View starred messages

<ViewStarredMessages />

### Reactions

<ViewEmojiReactions />

## Related articles

* [Getting started with Zulip](/help/getting-started-with-zulip)
* [Inbox](/help/inbox)
* [Recent conversations](/help/recent-conversations)
* [Searching for messages](/help/search-for-messages)
* [Marking messages as read](/help/marking-messages-as-read)
* [Marking messages as unread](/help/marking-messages-as-unread)
```

--------------------------------------------------------------------------------

---[FILE: recent-conversations.mdx]---
Location: zulip-main/starlight_help/src/content/docs/recent-conversations.mdx

```text
---
title: Recent conversations
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import KeyboardTip from "../../components/KeyboardTip.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import ConversationDefinition from "../include/_ConversationDefinition.mdx";
import GoToRecentConversations from "../include/_GoToRecentConversations.mdx";
import RecentConversations from "../include/_RecentConversations.mdx";

<ConversationDefinition />

<RecentConversations />

<KeyboardTip>
  The arrow keys and vim navigation keys (<kbd>J</kbd>, <kbd>K</kbd>,
  <kbd>L</kbd>, <kbd>H</kbd>) can be used to move between elements.
</KeyboardTip>

## Load more conversations

The **recent conversations** view displays a limited number of conversations
containing the most recent messages.

<ZulipTip>
  Use the [search bar](/help/search-for-messages) at the top of the web app
  to search through all conversations, not just recent ones.
</ZulipTip>

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <GoToRecentConversations />

      1. Scroll to the bottom of the list of conversations, or bring the bottom into
         view by filtering for a non-existent keyword.
      1. Click the **Load more** button in the banner at the bottom.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Related articles

* [Finding a conversation to read](/help/finding-a-conversation-to-read)
* [Reading conversations](/help/reading-conversations)
* [Reading strategies](/help/reading-strategies)
* [Inbox](/help/inbox)
* [List of topics in a channel](/help/list-of-topics)
* [Combined feed](/help/combined-feed)
* [Configure home view](/help/configure-home-view)
```

--------------------------------------------------------------------------------

---[FILE: rename-a-channel.mdx]---
Location: zulip-main/starlight_help/src/content/docs/rename-a-channel.mdx

```text
---
title: Rename a channel
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ChannelSettingsNavbarTip from "../include/_ChannelSettingsNavbarTip.mdx";
import SaveChanges from "../include/_SaveChanges.mdx";
import SelectChannelViewGeneral from "../include/_SelectChannelViewGeneral.mdx";

import EditIcon from "~icons/zulip-icon/edit";

A channel's name can be in any language, and can include spaces, punctuation,
and Unicode emoji.

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="relative/channel/all" />

      1. Select a channel.

      <SelectChannelViewGeneral />

      1. Click the **edit channel name and description**
         (<EditIcon />) icon to the right of the
         channel name, and enter a new channel name.

      <SaveChanges />
    </FlattenedSteps>

    <ChannelSettingsNavbarTip />
  </TabItem>

  <TabItem label="Mobile">
    Access this feature by following the web app instructions in your
    mobile device browser.

    Implementation of this feature in the mobile app is tracked [on
    GitHub](https://github.com/zulip/zulip-flutter/issues/1102). If
    you're interested in this feature, please react to the issue's
    description with 👍.
  </TabItem>
</Tabs>

## Related articles

* [View channel information](/help/view-channel-information)
* [Change a channel's description](/help/change-the-channel-description)
* [Configure automated notices for channel events](/help/configure-automated-notices#channel-events)
* [Channel permissions](/help/channel-permissions)
```

--------------------------------------------------------------------------------

---[FILE: rename-a-topic.mdx]---
Location: zulip-main/starlight_help/src/content/docs/rename-a-topic.mdx

```text
---
title: Rename a topic
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import TopicActions from "../include/_TopicActions.mdx";

import CheckIcon from "~icons/zulip-icon/check";
import PencilIcon from "~icons/zulip-icon/pencil";

Zulip makes it possible to rename topics. This is useful for keeping messages
organized, even if some users are still learning how to use topics effectively.
You can also [move content to another
topic](/help/move-content-to-another-topic).

When a topic is renamed, links [to the
topic](/help/link-to-a-message-or-conversation#get-a-link-to-a-specific-topic)
and [to messages in that
topic](/help/link-to-a-message-or-conversation#get-a-link-to-a-specific-message)
will automatically redirect to the new location of the message. [Muted
topics](/help/mute-a-topic) are automatically migrated when a topic is renamed.

Organization administrators can [configure](/help/restrict-moving-messages) who
is allowed to rename topics.

## Rename a topic

<Tabs>
  <TabItem label="Via message recipient bar">
    <Steps>
      1. Click the **edit topic** (<PencilIcon />) icon in
         the message recipient bar. If you do not see the
         **edit topic** (<PencilIcon />) icon, you do not
         have permission to rename this topic.
      1. Edit the topic name.
      1. Click the **save** (<CheckIcon />) icon
         to save your changes.
    </Steps>
  </TabItem>

  <TabItem label="Via left sidebar">
    <FlattenedSteps>
      <TopicActions />

      1. Select **Move topic** or **Rename topic**. If you do not see either option,
         you do not have permission to rename this topic.
      1. Edit the topic name.
      1. *(optional)*  If using the **Move topic** menu, select the destination channel
         for the topic from the channels dropdown list.
      1. Toggle whether automated notices should be sent.
      1. Click **Confirm** to rename the topic.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Mobile">
    Access this feature by following the web app instructions in your
    mobile device browser.

    Implementation of this feature in the mobile app is tracked [on
    GitHub](https://github.com/zulip/zulip-flutter/issues/1439). If
    you're interested in this feature, please react to the issue's
    description with 👍.
  </TabItem>
</Tabs>

## Related articles

* [Move content to another topic](/help/move-content-to-another-topic)
* [Move content to another channel](/help/move-content-to-another-channel)
* [Resolve a topic](/help/resolve-a-topic)
* [Restrict moving messages](/help/restrict-moving-messages)
```

--------------------------------------------------------------------------------

---[FILE: replying-to-messages.mdx]---
Location: zulip-main/starlight_help/src/content/docs/replying-to-messages.mdx

```text
---
title: Replying to messages
---

import HowToReplyIntro from "../include/_HowToReplyIntro.mdx";
import ReplyingToMessages from "../include/_ReplyingToMessages.mdx";

<HowToReplyIntro />

## Reply to messages in a conversation

<ReplyingToMessages />

## Related articles

* [Getting started with Zulip](/help/getting-started-with-zulip)
* [Introduction to topics](/help/introduction-to-topics)
* [Starting a new direct message](/help/starting-a-new-direct-message)
* [Quote or forward a message](/help/quote-or-forward-a-message)
* [Messaging tips & tricks](/help/messaging-tips)
```

--------------------------------------------------------------------------------

---[FILE: report-a-message.mdx]---
Location: zulip-main/starlight_help/src/content/docs/report-a-message.mdx

```text
---
title: Report a message
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import MessageActions from "../include/_MessageActions.mdx";

import FlagIcon from "~icons/zulip-icon/flag";

When moderation requests are enabled, you can report problematic messages. This
sends a message to a private channel, where moderators can review the report.

Keep in mind that reporting a message does not grant anyone access to see the
rest of the conversation. For example, moderators will see only direct messages
that you report, not other DMs in the same thread.

## Report a message

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <MessageActions />

      1. Select **report message**. If you do not see this option, moderation requests
         are [disabled](/help/enable-moderation-requests) in this organization.
      1. Fill out the requested information. Moderators will see the message
         you're reporting when they review your report.
      1. Click **Submit** to report the message.
    </FlattenedSteps>
  </TabItem>
</Tabs>

## Related articles

* [Enable moderation requests](/help/enable-moderation-requests)
* [Delete a message](/help/delete-a-message)
* [Mute a user](/help/mute-a-user)
* [Deactivate or reactivate a user](/help/deactivate-or-reactivate-a-user)
* [Community moderation toolkit](/help/moderating-open-organizations)
```

--------------------------------------------------------------------------------

---[FILE: request-an-integration.mdx]---
Location: zulip-main/starlight_help/src/content/docs/request-an-integration.mdx

```text
---
title: Request an integration
---

Zulip comes with over 100 native integrations. Hundreds more are
available through
[Zapier](https://zapier.com/home), [IFTTT](https://ifttt.com/), and
the [Slack compatible webhook](/integrations/slack_incoming).

However, sometimes there is no integration for a tool you use, or an
existing integration doesn't do what you need. If that's the case for
a third-party product you use, we'd love to [hear about
it](/help/contact-support)!

Or if you're familiar with GitHub, you can [browse open integrations
issues][integrations-issues], and if none exists, [open a new
issue](https://github.com/zulip/zulip/issues/new).

[integrations-issues]: https://github.com/zulip/zulip/issues?q=is%3Aopen+label%3A%22area%3A+integrations%22+is%3Aissue

## Related articles

* [Integrations overview](/help/integrations-overview)
* [Bots overview](/help/bots-overview)
* [Add a bot or integration](/help/add-a-bot-or-integration)
```

--------------------------------------------------------------------------------

---[FILE: require-topics.mdx]---
Location: zulip-main/starlight_help/src/content/docs/require-topics.mdx

```text
---
title: Configure whether topics are required in channel messages
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import AdminOnly from "../include/_AdminOnly.mdx";
import ChannelSettingsNavbarTip from "../include/_ChannelSettingsNavbarTip.mdx";
import GeneralChatIntro from "../include/_GeneralChatIntro.mdx";
import SaveChanges from "../include/_SaveChanges.mdx";
import SelectChannelViewPermissions from "../include/_SelectChannelViewPermissions.mdx";

<GeneralChatIntro />

Administrators can configure the default for whether topics are required in
channel messages (i.e., whether it's possible to send messages to the “*general
chat*” topic).

The default configuration can be overridden for any channel. You can also
configure channels to [allow only the “*general chat*”
topic](/help/general-chat-channels).

## Set the default *general chat* topic configuration

<AdminOnly />

<FlattenedSteps>
  <NavigationSteps target="settings/organization-settings" />

  1. Under **Compose settings**, select the desired option from the **Default
     *general chat* topic configuration for channels** dropdown.

  <SaveChanges />
</FlattenedSteps>

## Configure permission to post to “*general chat*” in a specific channel

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <NavigationSteps target="relative/channel/all" />

      1. Select a channel.

      <SelectChannelViewPermissions />

      1. Under **Messaging permissions**, choose the desired option from the **Allow
         posting to the *general chat* topic?** dropdown.

      <SaveChanges />
    </FlattenedSteps>

    <ChannelSettingsNavbarTip />
  </TabItem>
</Tabs>

## Related articles

* [Introduction to topics](/help/introduction-to-topics)
* [“*General chat*” topic](/help/general-chat-topic)
* [“*General chat*” channels](/help/general-chat-channels)
```

--------------------------------------------------------------------------------

---[FILE: resize-the-compose-box.mdx]---
Location: zulip-main/starlight_help/src/content/docs/resize-the-compose-box.mdx

```text
---
title: Resize the compose box
---

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import StartComposing from "../include/_StartComposing.mdx";

import CollapseDiagonalIcon from "~icons/zulip-icon/collapse-diagonal";
import ExpandDiagonalIcon from "~icons/zulip-icon/expand-diagonal";
import MaximizeDiagonalIcon from "~icons/zulip-icon/maximize-diagonal";

When composing a long message, it can be helpful to expand the compose
box to display more text and avoid distractions. Note that the compose
box also stretches automatically when you type a long message.

<FlattenedSteps>
  <StartComposing />

  1. Move your mouse to the compose box area.
  1. Click the <ExpandDiagonalIcon />, <MaximizeDiagonalIcon />, or <CollapseDiagonalIcon /> button in the top right corner of the text
     box.
</FlattenedSteps>

<ZulipTip>
  Which button you see depends on the current size of the compose box.
</ZulipTip>

## Related articles

* [Open the compose box](/help/open-the-compose-box)
* [Preview messages before sending](/help/preview-your-message-before-sending)
* [Mastering the compose box](/help/mastering-the-compose-box)
```

--------------------------------------------------------------------------------

---[FILE: resolve-a-topic.mdx]---
Location: zulip-main/starlight_help/src/content/docs/resolve-a-topic.mdx

```text
---
title: Resolve a topic
---

import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import KeyboardTip from "../../components/KeyboardTip.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import ConfigureResolvedNoticesMarkedAsRead from "../include/_ConfigureResolvedNoticesMarkedAsRead.mdx";
import FilterResolvedLeftSidebar from "../include/_FilterResolvedLeftSidebar.mdx";
import TopicActions from "../include/_TopicActions.mdx";
import TopicLongPressMenu from "../include/_TopicLongPressMenu.mdx";
import TopicLongPressMenuTip from "../include/_TopicLongPressMenuTip.mdx";

import CheckIcon from "~icons/zulip-icon/check";
import MoreVerticalIcon from "~icons/zulip-icon/more-vertical";
import SearchIcon from "~icons/zulip-icon/search";

Zulip's [topics](/help/introduction-to-topics) are very
helpful for customer support, answering questions, investigating
issues and production errors, as well as other workflows.
Resolving topics makes it easy to track the status of each question,
investigation, or notification.

Marking a topic as resolved:

* Puts a ✔ at the beginning of the topic name, e.g., `example topic`
  becomes `✔ example topic`.
* Triggers an automated notice from Notification Bot indicating that
  you resolved the topic. Users can
  [configure](/help/marking-messages-as-read#configure-whether-resolved-topic-notices-are-marked-as-read)
  whether these notices are automatically marked as read.
* Changes whether the topic appears when using the `is:resolved` and
  `-is:resolved` [search filters](/help/search-for-messages#search-filters).

Marking a topic as unresolved removes the ✔ and also triggers an
automated notice from Notification Bot.

It's often helpful to define a policy for when to resolve topics that
fits how topics are used in a given channel. Here are some common
approaches for deciding when to mark a topic as resolved:

* **Support**: When the support interaction is complete. Resolving
  topics is particularly useful for internal support teams that might
  not need a dedicated support ticket tracker.
* **Issues, errors and production incidents**: When investigation or
  incident response is complete, and any follow-up work has been
  transferred to the appropriate tracker.
* **Workflow management**: When the work described in the topic is
  complete and any follow-ups have been transcribed.
* **Answering questions**: When the question has been fully answered,
  and follow-ups would be best discussed in a new topic.

Users can resolve or unresolve a topic if they have
[permission](/help/restrict-resolving-topics) to do so.

## Mark a topic as resolved

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <TopicActions />

      1. Select **Mark as resolved**.
    </FlattenedSteps>

    <ZulipTip>
      You can also click on the **mark as resolved** (<CheckIcon />)
      icon in the message recipient bar to mark an unresolved topic as resolved.
    </ZulipTip>
  </TabItem>

  <TabItem label="Mobile">
    <FlattenedSteps>
      <TopicLongPressMenu />

      1. Tap **Mark as resolved**.
    </FlattenedSteps>

    <TopicLongPressMenuTip />
  </TabItem>
</Tabs>

## Mark a topic as unresolved

Marking a topic as unresolved normally triggers an automated notice from
Notification Bot. However, unresolving a topic right after you resolved it
removes the original notice instead. This is helpful if you resolved a topic by
accident.

<Tabs>
  <TabItem label="Desktop/Web">
    <FlattenedSteps>
      <TopicActions />

      1. Select **Mark as unresolved**.
    </FlattenedSteps>

    <ZulipTip>
      You can also click on the **ellipsis** (<MoreVerticalIcon />)
      in the message recipient bar, and select the **Mark as unresolved** option.
    </ZulipTip>
  </TabItem>

  <TabItem label="Mobile">
    <FlattenedSteps>
      <TopicLongPressMenu />

      1. Tap **Mark as unresolved**.
    </FlattenedSteps>

    <TopicLongPressMenuTip />
  </TabItem>
</Tabs>

## Search for messages in unresolved topics

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. Click the **search** (<SearchIcon />) icon in the top bar to open the search box.
      1. Type `-is:resolved`, or start typing and select **Exclude topics marked as
         resolved** from the typeahead.
      1. *(optional)* Enter additional search terms or
         [filters](/help/search-for-messages).
      1. Press <kbd>Enter</kbd>.
    </Steps>

    <KeyboardTip>
      You can also use the <kbd>/</kbd> or <kbd>Ctrl</kbd> + <kbd>K</kbd>
      keyboard shortcut to start searching messages.
    </KeyboardTip>
  </TabItem>
</Tabs>

<ZulipTip>
  To get a feed of unread messages in all unresolved topics, search for
  `is:unresolved is:unread`.
</ZulipTip>

## Search for messages in resolved topics

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. Click the **search** (<SearchIcon />) icon in the top bar to open the search box.
      1. Type `is:resolved`, or start typing and select **Topics marked as resolved**
         from the typeahead.
      1. *(optional)* Enter additional search terms or
         [filters](/help/search-for-messages).
      1. Press <kbd>Enter</kbd>.
    </Steps>

    <KeyboardTip>
      You can also use the <kbd>/</kbd> or <kbd>Ctrl</kbd> + <kbd>K</kbd>
      keyboard shortcut to start searching messages.
    </KeyboardTip>
  </TabItem>
</Tabs>

## Filter by whether topics are resolved

<FilterResolvedLeftSidebar />

## Configure whether resolved topic notices are marked as read

<ConfigureResolvedNoticesMarkedAsRead />

## Sending messages to resolved topics

You can send messages to a resolved topic, which is handy for *"thank you"*
messages, or to discuss whether a topic was incorrectly marked as resolved.

When a topic is resolved or unresolved, users' compose boxes and message views
automatically update to show the topic's current state. This helps make sure
everyone sends messages to the correct place.

[Integrations](/help/integrations-overview) will still send messages to the
original topic after a topic is resolved. This is useful for alerting
integrations, where a repeating alert might have a different cause. As usual,
you can mark the topic resolved once you've investigated the situation.

## Related articles

* [Rename a topic](/help/rename-a-topic)
* [Move content to another topic](/help/move-content-to-another-topic)
* [Restrict topic editing](/help/restrict-moving-messages)
* [API documentation for resolving topics](/api/update-message)
```

--------------------------------------------------------------------------------

````
